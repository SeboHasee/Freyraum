import * as THREE from 'three';
import type { Artwork } from '../config/artworks';
import { ArtworkMesh } from './ArtworkMesh';
import { SidePanels } from './SidePanels';
import { TextureManager } from './TextureManager';
import { ProceduralTextureFactory } from '../materials/ProceduralTextureFactory';
import { clamp, smoothDamp } from '../utils/math';
import { createScopedDiagnostics } from '../utils/Diagnostics';
import type { QualityPreset } from '../config/quality';
import type { ResolvedPaintingTextures, PaintingMapRole } from '../materials/PaintingTextureSet';

export type NavigationCallback = (index: number) => void;
export type FrameBudgetMarker = () => void;
export type ViewportMetricsProvider = () => ArtworkViewportMetrics;

export interface ArtworkViewportMetrics {
  viewportW: number;
  viewportH: number;
  usableW: number;
  usableH: number;
  usableFracX: number;
  usableFracY: number;
  effectiveAspect: number;
  occlusionTop: number;
  occlusionRight: number;
  occlusionBottom: number;
  occlusionLeft: number;
}

interface ZoomBounds {
  minInspectionZoom: number;
  resetFitZoom: number;
  maxOverviewZoom: number;
}

const DEFAULT_CAMERA_Z = 7;
// v0.13: raised from 10.75 — lets users step back noticeably farther than the
// reset/fit view for a wide overview of the gallery environment.
const MIN_OVERVIEW_CAMERA_Z = 18.0;
// v0.13: raised from 1.6 — extra headroom beyond the computed reset-fit zoom so
// the far overview distance grows with tall artworks rather than staying flat.
const OVERVIEW_HEADROOM_Z = 3.5;
// v0.14: lowered from 0.5 and paired with a lower visible fraction guard so
// close-inspection can move meaningfully nearer on medium and large artworks.
const MIN_CAMERA_Z = 0.2;
// v0.14: lowered from 0.28 to reduce the fraction-driven minimum zoom floor
// that previously dominated on larger artworks.
const MIN_VISIBLE_ARTWORK_FRACTION = 0.12;
const RESET_VIEW_FRAME_MARGIN = 1.04;
// v0.14: portrait-aware reset boost. Additive on top of the base reset-fit
// distance so it still applies when DEFAULT_CAMERA_Z dominates.
const PORTRAIT_ASPECT_THRESHOLD = 0.65;
const PORTRAIT_RESET_EXTRA_Z = 1.5;
const MIN_USABLE_VIEWPORT_FRACTION = 0.35;
const RESET_REFIT_EPSILON = 0.25;
/**
 * v0.03: replaces `PAN_SAFETY_FACTOR = 0.92`. Allows the viewport centre to
 * reach the artwork edge plus a small overscroll margin so every corner is
 * inspectable at maximum zoom.
 * v0.13: raised from 0.5 to 3.0 — allows panning well past the artwork edge
 * when zoomed in close, so narrow or elongated artworks can be fully explored
 * side to side.
 * v0.14: tightened to 1.2 to retain edge reach while reducing drift when near
 * reset-fit where a flat additive overscroll can feel too loose.
 * v0.14.2: split by axis so vertical pan can be tighter without reducing the
 * approved horizontal edge reach.
 */
const INSPECTION_OVERSCROLL_X = 1.2;
const INSPECTION_OVERSCROLL_Y = 0.6;

/**
 * v0.15 — Frame-rate-independent smoothing factors (per second).
 *
 * Before v0.15 the same motion settled in ~408ms on a 120 Hz screen and
 * ~817ms on a 60 Hz screen because every constant was applied per frame
 * rather than per second. After v0.15 each value below targets a wall-clock
 * 95% settle time, computed as t95 = -ln(0.05) / lambda ≈ 3 / lambda.
 *
 * | Property              | λ    | 95% settle |
 * | --------------------- | ---- | ---------- |
 * | hover rotation        | 12.0 |  ~250 ms   |
 * | nav position (x/y/z)  |  2.5 | ~1200 ms   |
 * | nav scale             |  3.0 | ~1000 ms   |
 * | camera zoom           |  4.0 |  ~750 ms   |
 * | camera pan            |  5.0 |  ~600 ms   |
 */
const LAMBDA_HOVER_ROTATION = 12.0;
const LAMBDA_NAV_POSITION = 2.5;
const LAMBDA_NAV_SCALE = 3.0;
const LAMBDA_CAMERA_ZOOM = 4.0;
const LAMBDA_CAMERA_PAN = 5.0;

/**
 * v0.15 — Navigation entrance seeds. Applied to the artwork group before
 * `update()` smooths the values back to their targets (0, 0, 1).
 *
 * - position.x: larger horizontal travel (3.2 → 4.5) is now witnessable
 *   thanks to the slower λ=2.5 settle (~1200 ms).
 * - position.z: new — painting recedes slightly behind the rest pose,
 *   giving a soft 3D approach feeling. Frame plane sits at z=0 and the
 *   artwork plane at z≈0.095, so a target of -0.6 does not cause z-fight.
 * - rotation.y: reduced 0.32 rad (~18°) → 0.15 rad (~9°) — a museum
 *   yaw rather than a theatrical pivot.
 * - scale: 0.84 → 0.88 — slightly less collapsed so the slower settle
 *   does not look like a shrunken thumbnail growing into place.
 */
const NAV_SEED_POSITION_X = 4.5;
const NAV_SEED_POSITION_Z = -0.6;
const NAV_SEED_ROTATION_Y = 0.15;
const NAV_SEED_SCALE = 0.88;

/** Maximum delta-time clamp (seconds) for smoothing — prevents huge jumps
 * after a stalled/backgrounded tab when `requestAnimationFrame` resumes. */
const MAX_SMOOTHING_DT = 0.1;

/** Roles that can be filled in by the procedural factory when no authored map exists. */
const PROCEDURAL_ROLES: PaintingMapRole[] = [
  'normal',
  'detailNormal',
  'height',
  'roughness',
  'specular',
  'ao',
  'varnish',
];

/**
 * v0.06: roles whose procedural texel grid is visible under raking light at
 * maximum zoom. When `inspectionMode` is true and the active preset declares
 * a non-zero `proceduralInspectionTileSize`, these roles are regenerated at
 * that higher resolution instead of the gallery `proceduralTileSize`.
 *
 * The other procedural roles (`roughness`, `specular`, `ao`, `varnish`)
 * carry no geometry signal, so they do not benefit from a resolution uplift.
 */
const INSPECTION_ROLES: readonly PaintingMapRole[] = ['normal', 'detailNormal', 'height'];

export class GalleryManager {
  private readonly diagnostics = createScopedDiagnostics('gallery');
  private readonly artworks: readonly Artwork[];
  private currentIndex = 0;
  private readonly artworkMesh: ArtworkMesh;
  private readonly sidePanels: SidePanels;
  private readonly textureManager: TextureManager;
  private readonly procedural: ProceduralTextureFactory;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly viewportMetricsProvider: ViewportMetricsProvider | null;
  private readonly raycaster = new THREE.Raycaster();
  private reducedMotion = false;
  /** Latest active quality preset. Maintained via `applyPreset`. */
  private currentPreset: QualityPreset | null = null;
  /** Cancellation token for async artwork loads (audited guard). */
  private artworkLoadToken = 0;
  /**
   * v0.06: when true, geometry-carrying procedural roles (see
   * `INSPECTION_ROLES`) are generated at `preset.proceduralInspectionTileSize`
   * instead of `preset.proceduralTileSize`. Driven by `main.ts` from the
   * active light profile's `displayIntent === 'inspection'`.
   *
   * Toggling the mode re-runs `showArtwork()` for the current index so the
   * new size takes effect immediately. The factory's cache key includes the
   * effective tile size, so both resolutions can coexist without
   * stale-texture risk during rapid profile toggles.
   */
  private inspectionMode = false;
  private pendingResetAfterArtworkLoad = false;
  private lastResetFitZoom = DEFAULT_CAMERA_Z;
  /** Optional callback used to mark navigation events for FrameBudgetMonitor. */
  private frameBudgetNavigationMarker: FrameBudgetMarker | null = null;

  private targetX = 0;
  private targetY = 0;
  zoom = DEFAULT_CAMERA_Z;
  targetZoom = DEFAULT_CAMERA_Z;
  panX = 0;
  panY = 0;
  targetPanX = 0;
  targetPanY = 0;
  /**
   * v0.15 — `DOMHighResTimeStamp` of the previous `update(now)` call.
   * `0` means we have not yet ticked; the first frame is skipped so the
   * dt computation never sees an unbounded delta.
   */
  private lastUpdateTime = 0;

  private onNavigateCallback: NavigationCallback | null = null;

  constructor(
    artworks: readonly Artwork[],
    artworkMesh: ArtworkMesh,
    sidePanels: SidePanels,
    textureManager: TextureManager,
    camera: THREE.PerspectiveCamera,
    procedural?: ProceduralTextureFactory,
    viewportMetricsProvider?: ViewportMetricsProvider
  ) {
    this.artworks = artworks;
    this.artworkMesh = artworkMesh;
    this.sidePanels = sidePanels;
    this.textureManager = textureManager;
    this.camera = camera;
    this.procedural = procedural ?? new ProceduralTextureFactory();
    this.viewportMetricsProvider = viewportMetricsProvider ?? null;
  }

  /** Allows main.ts to call `frameBudget.markNavigation()` on every navigation. */
  setFrameBudgetMarker(marker: FrameBudgetMarker | null): void {
    this.frameBudgetNavigationMarker = marker;
  }

  /** Receives preset changes from the preference store. */
  applyPreset(preset: QualityPreset): void {
    const hadPreset = this.currentPreset !== null;
    this.currentPreset = preset;
    this.textureManager.setAnisotropyDivisor(preset.anisotropyDivisor);
    // v0.06: mirror the per-preset anisotropy cap on the procedural factory
    // so DataTexture maps match authored textures at steep view angles.
    this.procedural.setAnisotropy(this.textureManager.getEffectiveAnisotropy());
    this.diagnostics.debug('preset-applied', 'Applied gallery quality preset', {
      shaderVariant: preset.shaderVariant,
      anisotropy: this.textureManager.getEffectiveAnisotropy(),
      proceduralTileSize: preset.proceduralTileSize,
      proceduralInspectionTileSize: preset.proceduralInspectionTileSize,
      specularStrength: preset.specularStrength,
      selfShadowBias: preset.selfShadowBias,
    });
    // Rebuild the current artwork's map set so preset-specific roles
    // (detailNormal, height, roughness, specular, AO) are added/removed
    // immediately on quality changes.
    if (hadPreset && this.textureManager.get(this.artworks[this.currentIndex].webglImage ?? this.artworks[this.currentIndex].image)) {
      void this.showArtwork(this.currentIndex);
    }
  }

  /**
   * v0.06: switches the procedural texture tile size for geometry-carrying
   * roles between the standard gallery size and the higher inspection size.
   * Re-generates the current artwork's map set immediately if the mode
   * changes; otherwise a no-op.
   */
  setInspectionMode(on: boolean): void {
    if (on === this.inspectionMode) return;
    this.inspectionMode = on;
    this.diagnostics.info('inspection-mode', `Inspection mode ${on ? 'enabled' : 'disabled'}`);
    if (this.currentPreset) void this.showArtwork(this.currentIndex);
  }

  async init(): Promise<void> {
    const artworkSources = this.artworks.map((a) => ({
      id: a.id,
      source: a.webglImage ? 'embedded-data-url' : 'file-url',
      urlType: a.webglImage
        ? `data-uri:${a.webglImage.slice(5, a.webglImage.indexOf(';'))}`
        : 'local-relative',
      hasWebglImage: !!a.webglImage,
      dimensions: a.dimensions,
    }));
    this.diagnostics.info('init', 'Starting gallery init — preloading albedo textures', {
      artworkCount: artworkSources.length,
      artworks: artworkSources,
    });
    const urls = this.artworks.map((a) => a.webglImage ?? a.image);
    await this.textureManager.preload(urls);
    this.diagnostics.info('init', 'Preload complete — showing first artwork', { artworkCount: urls.length });
    this.pendingResetAfterArtworkLoad = true;
    await this.showArtwork(0);
  }

  addZoomDelta(delta: number): void {
    this.targetZoom = this.clampZoom(this.targetZoom + delta);
    this.clampPanTargets();
  }

  setPanOffset(deltaX: number, deltaY: number): void {
    const { x, y } = this.getPanLimits(this.targetZoom);
    this.targetPanX = clamp(this.targetPanX + deltaX, -x, x);
    this.targetPanY = clamp(this.targetPanY + deltaY, -y, y);
  }

  canPan(): boolean {
    const { x, y } = this.getPanLimits(this.targetZoom);
    return x > 0.01 || y > 0.01;
  }

  getHoverRotationScale(): { x: number; y: number } {
    const bounds = this.getZoomBounds();
    const zoomRange = Math.max(0.001, bounds.maxOverviewZoom - bounds.minInspectionZoom);
    const zoomProgress = (this.clampZoom(this.targetZoom) - bounds.minInspectionZoom) / zoomRange;

    return {
      x: 0.03 + zoomProgress * 0.13,
      y: 0.018 + zoomProgress * 0.062,
    };
  }

  /**
   * Loads the painting texture set for the given artwork and applies it to
   * the artwork mesh. Async + race-protected: rapid navigation cannot apply
   * a stale map set (see audited Lifecycle Guardrails in plan.md).
   *
   * v0.09: Uses `artwork.webglImage ?? artwork.image` as the albedo source for
   * the central 3D painting. The `webglImage` field is an origin-clean base64
   * data URL written by the importer so WebGL texture upload does not depend on
   * `file://` image fetch behavior, which varies by browser.
   */
  private async showArtwork(index: number): Promise<void> {
    const artwork = this.artworks[index];
    // v0.09: prefer the embedded data URL for WebGL upload reliability.
    const albedoUrl = artwork.webglImage ?? artwork.image;
    const webglImageSource: 'embedded-data-url' | 'file-url' =
      artwork.webglImage ? 'embedded-data-url' : 'file-url';
    const albedo = this.textureManager.get(albedoUrl);

    const token = ++this.artworkLoadToken;
    const preset = this.currentPreset;
    this.diagnostics.debug('show-artwork', 'Preparing artwork render state', {
      index,
      artworkId: artwork.id,
      token,
      hasWebglImage: !!artwork.webglImage,
      webglImageSource,
      albedoUrlType: albedoUrl.startsWith('data:')
        ? `data-uri:${albedoUrl.slice(5, albedoUrl.indexOf(';'))}`
        : 'local-relative',
      dimensions: artwork.dimensions,
      surfaceProfile: artwork.surfaceProfile ?? 'matte-canvas',
    });

    // Side previews use albedo only, even when authored sets exist.
    // v0.09: side panels use webglImage too so they match the preloaded cache key.
    const prevIndex = (index - 1 + this.artworks.length) % this.artworks.length;
    const nextIndex = (index + 1) % this.artworks.length;
    const prevTexture = this.textureManager.get(this.artworks[prevIndex].webglImage ?? this.artworks[prevIndex].image) ?? null;
    const nextTexture = this.textureManager.get(this.artworks[nextIndex].webglImage ?? this.artworks[nextIndex].image) ?? null;
    this.sidePanels.updateTextures(prevTexture, nextTexture);

    if (!albedo || !preset) {
      this.diagnostics.warn('show-artwork-missing-state', 'Cannot render artwork because preset or albedo texture is missing', {
        artworkId: artwork.id,
        hasAlbedo: !!albedo,
        hasPreset: !!preset,
        webglImageSource,
        albedoUrlType: albedoUrl.startsWith('data:')
          ? `data-uri:${albedoUrl.slice(5, albedoUrl.indexOf(';'))}`
          : 'local-relative',
      });
      // Albedo preload should have populated the cache; if not, give up.
      return;
    }

    // Load any authored maps for this artwork in parallel.
    const authored = await this.textureManager.preloadTextureSet(artwork.textureSet);

    // Audited guard: discard stale loads.
    if (token !== this.artworkLoadToken) {
      this.diagnostics.debug('stale-load', 'Discarded stale artwork load', {
        artworkId: artwork.id,
        token,
        latestToken: this.artworkLoadToken,
      });
      return;
    }

    // Fill in missing roles from the procedural factory.
    const resolved: ResolvedPaintingTextures = {
      albedo: authored.albedo ?? albedo,
    };
    for (const role of PROCEDURAL_ROLES) {
      if (authored[role]) {
        resolved[role] = authored[role];
      } else if (this.shouldFillRole(role, preset)) {
        // v0.06: geometry-carrying roles use the higher inspection tile size
        // when the inspection light profile is active AND the preset opts in
        // (proceduralInspectionTileSize > 0). Gallery profiles and presets
        // without an inspection size fall through to proceduralTileSize.
        const inspSize = preset.proceduralInspectionTileSize;
        const useInspection =
          this.inspectionMode && inspSize > 0 && (INSPECTION_ROLES as readonly string[]).includes(role);
        const tileSize = useInspection ? inspSize : preset.proceduralTileSize;
        resolved[role] = this.procedural.generate(artwork.id, role, tileSize);
      }
    }

    this.artworkMesh.setPaintingTextures(resolved, preset, artwork.dimensions);
    this.artworkMesh.material.applySurfaceProfile(artwork.surfaceProfile, preset);

    // Log the full resolved texture map so support can see which roles are
    // authored vs procedurally generated vs absent at a glance.
    const resolvedSummary: Record<string, string> = { albedo: authored.albedo ? 'authored' : 'preloaded' };
    for (const role of PROCEDURAL_ROLES) {
      if (authored[role]) resolvedSummary[role] = 'authored';
      else if (resolved[role]) resolvedSummary[role] = 'procedural';
      else resolvedSummary[role] = 'absent';
    }
    this.diagnostics.debug('show-artwork-maps', 'Resolved texture map for artwork', {
      artworkId: artwork.id,
      maps: resolvedSummary,
      shaderVariant: preset.shaderVariant,
      inspectionMode: this.inspectionMode,
    });

    // v0.09: check fallback using the same URL that was loaded (albedoUrl).
    const albedoIsFallback = this.textureManager.isFallback(albedoUrl, 'albedo');
    if (albedoIsFallback) {
      this.diagnostics.warn('show-artwork-fallback', 'Central 3D painting is using a GENERATED FALLBACK texture — the customer image could not be loaded as a WebGL texture', {
        artworkId: artwork.id,
        imageUrl: artwork.image,
        webglImageSource,
        manifestWidth: artwork.dimensions?.width,
        manifestHeight: artwork.dimensions?.height,
        fallbackUsed: true,
      });
    }
    const viewportMetrics = this.getViewportMetrics();
    const zoomBounds = this.getZoomBounds(viewportMetrics);
    const panLimitsAtReset = this.getPanLimits(zoomBounds.resetFitZoom);
    const isPortraitReset = this.isPortraitResetArtwork();
    this.diagnostics.info('show-artwork-complete', 'Artwork is ready', {
      artworkId: artwork.id,
      activeMaps: this.artworkMesh.material.activeMaps(),
      inspectionMode: this.inspectionMode,
      fallbackUsed: albedoIsFallback,
      webglImageSource,
      aspectSource: this.artworkMesh.lastAspectSource,
      manifestDimensions: this.artworkMesh.lastManifestDimensions,
      paintingWidth: this.artworkMesh.artworkWidth,
      paintingHeight: this.artworkMesh.artworkHeight,
      paintingAspect: this.artworkMesh.artworkAspect,
      resetZoom: zoomBounds.resetFitZoom,
      minZoom: zoomBounds.minInspectionZoom,
      closeZoomMinVisibleFraction: MIN_VISIBLE_ARTWORK_FRACTION,
      maxZoom: zoomBounds.maxOverviewZoom,
      overviewHeadroom: zoomBounds.maxOverviewZoom - zoomBounds.resetFitZoom,
      panOverscrollX: INSPECTION_OVERSCROLL_X,
      panOverscrollY: INSPECTION_OVERSCROLL_Y,
      panLimitAtReset: {
        x: panLimitsAtReset.x,
        y: panLimitsAtReset.y,
      },
      portraitResetApplied: isPortraitReset,
      portraitResetExtra: isPortraitReset ? PORTRAIT_RESET_EXTRA_Z : 0,
      usableViewportWidth: viewportMetrics.usableW,
      usableViewportHeight: viewportMetrics.usableH,
      usableViewportFractionX: viewportMetrics.usableFracX,
      usableViewportFractionY: viewportMetrics.usableFracY,
      viewportOcclusion: {
        top: viewportMetrics.occlusionTop,
        right: viewportMetrics.occlusionRight,
        bottom: viewportMetrics.occlusionBottom,
        left: viewportMetrics.occlusionLeft,
      },
      parallaxEnabled: preset.parallaxEnabled,
      parallaxScale: preset.parallaxScale,
      specularStrength: preset.specularStrength,
      selfShadowBias: preset.selfShadowBias,
    });

    if (this.pendingResetAfterArtworkLoad) {
      this.pendingResetAfterArtworkLoad = false;
      this.resetView();
    } else {
      this.targetZoom = this.clampZoom(this.targetZoom);
      this.zoom = this.clampZoom(this.zoom);
    }
    this.clampPanTargets();
  }

  /** Selects which procedural fallback roles to generate for the active preset. */
  private shouldFillRole(role: PaintingMapRole, preset: QualityPreset): boolean {
    switch (role) {
      case 'normal':
        return true;
      case 'detailNormal':
        return preset.detailNormalEnabled && preset.detailNormalStrength > 0;
      case 'height':
        return preset.bumpStrength > 0 || (preset.parallaxEnabled && preset.parallaxScale > 0) || preset.selfShadowEnabled;
      case 'roughness':
        return preset.shaderVariant !== 'painting-battery';
      case 'specular':
        return preset.specularStrength > 0;
      case 'ao':
        return preset.aoEnabled;
      default:
        return false;
    }
  }

  navigate(direction: 1 | -1): void {
    const fromIndex = this.currentIndex;
    const newIndex = clamp(
      (this.currentIndex + direction + this.artworks.length) % this.artworks.length,
      0,
      this.artworks.length - 1
    );

    this.diagnostics.info('navigate', `Navigate ${direction > 0 ? 'forward' : 'back'}`, {
      fromIndex,
      toIndex: newIndex,
      fromArtworkId: this.artworks[fromIndex]?.id,
      toArtworkId: this.artworks[newIndex]?.id,
      direction,
      // v0.15 — motion mode and intended settle timing for QA / diagnostics.
      motionMode: this.reducedMotion ? 'reduced' : 'full',
      seedPositionX: this.reducedMotion ? 0 : direction * NAV_SEED_POSITION_X,
      seedPositionZ: this.reducedMotion ? 0 : NAV_SEED_POSITION_Z,
      settleTargetMs: this.reducedMotion
        ? 0
        : Math.round(1000 * (-Math.log(0.05) / LAMBDA_NAV_POSITION)),
    });

    if (!this.reducedMotion) {
      this.artworkMesh.group.position.x = direction * NAV_SEED_POSITION_X;
      this.artworkMesh.group.position.z = NAV_SEED_POSITION_Z;
      this.artworkMesh.group.rotation.y = direction * NAV_SEED_ROTATION_Y;
      this.artworkMesh.group.scale.set(NAV_SEED_SCALE, NAV_SEED_SCALE, NAV_SEED_SCALE);
    }

    this.currentIndex = newIndex;
    this.pendingResetAfterArtworkLoad = true;
    void this.showArtwork(newIndex);
    this.frameBudgetNavigationMarker?.();

    this.resetView();
    this.onNavigateCallback?.(this.currentIndex);
  }

  goTo(index: number): void {
    if (index === this.currentIndex) return;
    const direction = index > this.currentIndex ? 1 : -1;
    const diff = index - this.currentIndex;

    this.diagnostics.info('navigate', 'goTo direct navigation', {
      fromIndex: this.currentIndex,
      toIndex: index,
      fromArtworkId: this.artworks[this.currentIndex]?.id,
      toArtworkId: this.artworks[index]?.id,
      diff,
      // v0.15 — motion diagnostics parity with navigate().
      motionMode: this.reducedMotion ? 'reduced' : 'full',
      seedPositionX: this.reducedMotion ? 0 : (diff > 0 ? 1 : -1) * NAV_SEED_POSITION_X,
      seedPositionZ: this.reducedMotion ? 0 : NAV_SEED_POSITION_Z,
      settleTargetMs: this.reducedMotion
        ? 0
        : Math.round(1000 * (-Math.log(0.05) / LAMBDA_NAV_POSITION)),
    });

    this.currentIndex = index;
    this.pendingResetAfterArtworkLoad = true;

    if (!this.reducedMotion) {
      this.artworkMesh.group.position.x = (diff > 0 ? 1 : -1) * NAV_SEED_POSITION_X;
      this.artworkMesh.group.position.z = NAV_SEED_POSITION_Z;
      this.artworkMesh.group.rotation.y = direction * NAV_SEED_ROTATION_Y;
      this.artworkMesh.group.scale.set(NAV_SEED_SCALE, NAV_SEED_SCALE, NAV_SEED_SCALE);
    }

    void this.showArtwork(index);
    this.frameBudgetNavigationMarker?.();
    this.resetView();
    this.onNavigateCallback?.(this.currentIndex);
  }

  setReducedMotion(value: boolean): void {
    this.reducedMotion = value;
    this.artworkMesh.material.setReducedMotion(value);
  }

  handleViewportMetricsChanged(): void {
    const wasNearReset = Math.abs(this.targetZoom - this.lastResetFitZoom) <= RESET_REFIT_EPSILON;
    const viewportMetrics = this.getViewportMetrics();
    const bounds = this.getZoomBounds(viewportMetrics);

    if (wasNearReset) {
      this.targetZoom = bounds.resetFitZoom;
    } else {
      this.targetZoom = clamp(this.targetZoom, bounds.minInspectionZoom, bounds.maxOverviewZoom);
    }
    this.zoom = clamp(this.zoom, bounds.minInspectionZoom, bounds.maxOverviewZoom);
    this.lastResetFitZoom = bounds.resetFitZoom;
    this.clampPanTargets();

    this.diagnostics.info('viewport-refit', 'Artwork viewport metrics changed', {
      resetFitZoom: bounds.resetFitZoom,
      minInspectionZoom: bounds.minInspectionZoom,
      maxOverviewZoom: bounds.maxOverviewZoom,
      overviewHeadroom: bounds.maxOverviewZoom - bounds.resetFitZoom,
      wasNearReset,
      viewport: viewportMetrics,
    });
  }

  setHoverTarget(x: number, y: number): void {
    this.targetY = x;
    this.targetX = y;
  }

  onNavigate(cb: NavigationCallback): void {
    this.onNavigateCallback = cb;
  }

  get index(): number {
    return this.currentIndex;
  }

  get artworkAspect(): number {
    return this.artworkMesh.artworkAspect;
  }

  /** Read-only accessor for the procedural factory (used in dispose). */
  get proceduralFactory(): ProceduralTextureFactory {
    return this.procedural;
  }

  handlePanelClick(event: MouseEvent, canvas: HTMLCanvasElement): void {
    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    this.raycaster.setFromCamera(mouse, this.camera);
    const meshes = this.sidePanels.getMeshes();
    const intersects = this.raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const side = intersects[0].object.userData['side'];
      if (side === 'left') this.navigate(-1);
      else if (side === 'right') this.navigate(1);
    }
  }

  /**
   * v0.15 — frame-rate-independent update step.
   *
   * Receives a `DOMHighResTimeStamp now` from the main animation loop and
   * derives `dt` in seconds. All smoothing uses `smoothDamp(value, target,
   * lambda, dt)` which is the analytic solution to exponential decay, so
   * timing is consistent across 30 Hz, 60 Hz, 90 Hz, and 120 Hz displays.
   */
  update(now: number): void {
    const group = this.artworkMesh.group;

    // Compute dt. Skip the very first tick (no previous timestamp) so we
    // do not feed an unbounded delta into smoothDamp. Clamp to
    // MAX_SMOOTHING_DT to avoid huge jumps after a backgrounded tab.
    let dt = 0;
    if (this.lastUpdateTime > 0) {
      dt = Math.min((now - this.lastUpdateTime) / 1000, MAX_SMOOTHING_DT);
    }
    this.lastUpdateTime = now;

    // Target clamping runs every tick (including the first, when dt is 0)
    // so that any target written between frames — e.g. by zoom/pan input
    // handlers — is constrained even before the first smoothing step.
    this.targetZoom = this.clampZoom(this.targetZoom);
    this.clampPanTargets();

    if (dt <= 0) return;

    // Hover rotation — λ=12 → ~250 ms settle (immediate feel).
    group.rotation.x = smoothDamp(group.rotation.x, this.targetX, LAMBDA_HOVER_ROTATION, dt);
    group.rotation.y = smoothDamp(group.rotation.y, this.targetY, LAMBDA_HOVER_ROTATION, dt);

    // Navigation position settle — λ=2.5 → ~1200 ms settle (witnessable
    // artwork entrance, including the new position.z depth recession).
    group.position.x = smoothDamp(group.position.x, 0, LAMBDA_NAV_POSITION, dt);
    group.position.y = smoothDamp(group.position.y, 0, LAMBDA_NAV_POSITION, dt);
    group.position.z = smoothDamp(group.position.z, 0, LAMBDA_NAV_POSITION, dt);

    // Navigation scale — λ=3.0 → ~1000 ms settle (smooth swell).
    group.scale.x = smoothDamp(group.scale.x, 1, LAMBDA_NAV_SCALE, dt);
    group.scale.y = smoothDamp(group.scale.y, 1, LAMBDA_NAV_SCALE, dt);
    group.scale.z = smoothDamp(group.scale.z, 1, LAMBDA_NAV_SCALE, dt);

    // Camera zoom — λ=4.0 → ~750 ms settle (graceful, responsive).
    this.zoom = smoothDamp(this.zoom, this.targetZoom, LAMBDA_CAMERA_ZOOM, dt);
    this.camera.position.z = smoothDamp(
      this.camera.position.z,
      this.zoom,
      LAMBDA_CAMERA_ZOOM,
      dt
    );

    // Camera pan — λ=5.0 → ~600 ms settle (connected to input).
    this.panX = smoothDamp(this.panX, this.targetPanX, LAMBDA_CAMERA_PAN, dt);
    this.panY = smoothDamp(this.panY, this.targetPanY, LAMBDA_CAMERA_PAN, dt);
    this.camera.position.x = smoothDamp(this.camera.position.x, this.panX, LAMBDA_CAMERA_PAN, dt);
    this.camera.position.y = smoothDamp(this.camera.position.y, this.panY, LAMBDA_CAMERA_PAN, dt);
  }

  resetView(): void {
    const bounds = this.getZoomBounds();
    this.targetPanX = 0;
    this.targetPanY = 0;
    this.targetZoom = bounds.resetFitZoom;
    this.lastResetFitZoom = bounds.resetFitZoom;
    this.targetX = 0;
    this.targetY = 0;
  }

  private clampZoom(value: number): number {
    const bounds = this.getZoomBounds();
    return clamp(value, bounds.minInspectionZoom, bounds.maxOverviewZoom);
  }

  private clampPanTargets(): void {
    const limits = this.getPanLimits(this.targetZoom);
    this.targetPanX = clamp(this.targetPanX, -limits.x, limits.x);
    this.targetPanY = clamp(this.targetPanY, -limits.y, limits.y);
  }

  private getPanLimits(zoom: number): { x: number; y: number } {
    const metrics = this.getViewportMetrics();
    const bounds = this.getZoomBounds(metrics);
    const boundedZoom = clamp(zoom, bounds.minInspectionZoom, bounds.maxOverviewZoom);
    const visibleHeight = 2 *
      boundedZoom *
      Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5)) *
      metrics.usableFracY;
    const visibleWidth = visibleHeight * metrics.effectiveAspect;

    // v0.03: allow viewport centre to reach the artwork edge plus an explicit
    // overscroll margin so every corner is reachable during close inspection.
    return {
      x: Math.max(0, (this.artworkMesh.artworkWidth - visibleWidth) * 0.5 + INSPECTION_OVERSCROLL_X),
      y: Math.max(0, (this.artworkMesh.artworkHeight - visibleHeight) * 0.5 + INSPECTION_OVERSCROLL_Y),
    };
  }

  private getZoomBounds(metrics = this.getViewportMetrics()): ZoomBounds {
    const minInspectionZoom = this.getInspectionMinZoom(metrics);
    const resetFitZoom = this.getResetFitZoom(metrics);
    const maxOverviewZoom = Math.max(MIN_OVERVIEW_CAMERA_Z, resetFitZoom + OVERVIEW_HEADROOM_Z);

    return {
      minInspectionZoom: clamp(minInspectionZoom, MIN_CAMERA_Z, resetFitZoom),
      resetFitZoom: clamp(resetFitZoom, MIN_CAMERA_Z, maxOverviewZoom),
      maxOverviewZoom,
    };
  }

  private getInspectionMinZoom(metrics: ArtworkViewportMetrics): number {
    const fovTan = Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5));
    const requiredHeight = this.artworkMesh.artworkHeight * MIN_VISIBLE_ARTWORK_FRACTION;
    const requiredWidth = this.artworkMesh.artworkWidth * MIN_VISIBLE_ARTWORK_FRACTION;
    const heightDistance = requiredHeight / (2 * fovTan * metrics.usableFracY);
    const widthDistance = requiredWidth / (2 * fovTan * this.camera.aspect * metrics.usableFracX);

    return clamp(Math.max(MIN_CAMERA_Z, heightDistance, widthDistance), MIN_CAMERA_Z, DEFAULT_CAMERA_Z);
  }

  private getResetFitZoom(metrics: ArtworkViewportMetrics): number {
    const frameWidth = this.artworkMesh.artworkWidth + 0.4;
    const frameHeight = this.artworkMesh.artworkHeight + 0.4;
    const fovTan = Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5));
    const heightDistance = (frameHeight * RESET_VIEW_FRAME_MARGIN) / (2 * fovTan * metrics.usableFracY);
    const widthDistance = (frameWidth * RESET_VIEW_FRAME_MARGIN) /
      (2 * fovTan * this.camera.aspect * metrics.usableFracX);

    const baseFitZoom = Math.max(DEFAULT_CAMERA_Z, heightDistance, widthDistance);
    return this.isPortraitResetArtwork() ? baseFitZoom + PORTRAIT_RESET_EXTRA_Z : baseFitZoom;
  }

  private isPortraitResetArtwork(): boolean {
    return this.artworkMesh.artworkAspect < PORTRAIT_ASPECT_THRESHOLD;
  }

  private getViewportMetrics(): ArtworkViewportMetrics {
    const raw = this.viewportMetricsProvider?.() ?? this.getDefaultViewportMetrics();
    const viewportW = Math.max(1, raw.viewportW);
    const viewportH = Math.max(1, raw.viewportH);
    // Guard against transient/stale chrome measurements that would otherwise
    // produce near-zero usable space and unstable camera-distance spikes.
    const usableW = clamp(raw.usableW, viewportW * MIN_USABLE_VIEWPORT_FRACTION, viewportW);
    const usableH = clamp(raw.usableH, viewportH * MIN_USABLE_VIEWPORT_FRACTION, viewportH);
    const usableFracX = clamp(raw.usableFracX || usableW / viewportW, MIN_USABLE_VIEWPORT_FRACTION, 1);
    const usableFracY = clamp(raw.usableFracY || usableH / viewportH, MIN_USABLE_VIEWPORT_FRACTION, 1);

    return {
      viewportW,
      viewportH,
      usableW,
      usableH,
      usableFracX,
      usableFracY,
      effectiveAspect: Math.max(0.1, raw.effectiveAspect || usableW / usableH),
      occlusionTop: Math.max(0, raw.occlusionTop),
      occlusionRight: Math.max(0, raw.occlusionRight),
      occlusionBottom: Math.max(0, raw.occlusionBottom),
      occlusionLeft: Math.max(0, raw.occlusionLeft),
    };
  }

  private getDefaultViewportMetrics(): ArtworkViewportMetrics {
    const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1;
    const viewportH = typeof window !== 'undefined' ? window.innerHeight : 1;

    return {
      viewportW,
      viewportH,
      usableW: viewportW,
      usableH: viewportH,
      usableFracX: 1,
      usableFracY: 1,
      effectiveAspect: viewportW / Math.max(1, viewportH),
      occlusionTop: 0,
      occlusionRight: 0,
      occlusionBottom: 0,
      occlusionLeft: 0,
    };
  }
}
