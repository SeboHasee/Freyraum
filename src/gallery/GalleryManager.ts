import * as THREE from 'three';
import type { Artwork } from '../config/artworks';
import { ArtworkMesh } from './ArtworkMesh';
import { SidePanels } from './SidePanels';
import { TextureManager } from './TextureManager';
import { ProceduralTextureFactory } from '../materials/ProceduralTextureFactory';
import { clamp } from '../utils/math';
import { createScopedDiagnostics } from '../utils/Diagnostics';
import type { QualityPreset } from '../config/quality';
import type { ResolvedPaintingTextures, PaintingMapRole } from '../materials/PaintingTextureSet';

export type NavigationCallback = (index: number) => void;
export type FrameBudgetMarker = () => void;

const DEFAULT_CAMERA_Z = 7;
const MAX_CAMERA_Z = 8.5;
const MIN_CAMERA_Z = 1.2;
const MIN_VISIBLE_ARTWORK_FRACTION = 0.28;
/**
 * v0.03: replaces `PAN_SAFETY_FACTOR = 0.92`. Allows the viewport centre to
 * reach the artwork edge plus a small overscroll margin so every corner is
 * inspectable at maximum zoom.
 */
const INSPECTION_OVERSCROLL = 0.5;

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

  private onNavigateCallback: NavigationCallback | null = null;

  constructor(
    artworks: readonly Artwork[],
    artworkMesh: ArtworkMesh,
    sidePanels: SidePanels,
    textureManager: TextureManager,
    camera: THREE.PerspectiveCamera,
    procedural?: ProceduralTextureFactory
  ) {
    this.artworks = artworks;
    this.artworkMesh = artworkMesh;
    this.sidePanels = sidePanels;
    this.textureManager = textureManager;
    this.camera = camera;
    this.procedural = procedural ?? new ProceduralTextureFactory();
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
    const zoomRange = Math.max(0.001, MAX_CAMERA_Z - this.getMinZoom());
    const zoomProgress = (this.clampZoom(this.targetZoom) - this.getMinZoom()) / zoomRange;

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
    });

    this.targetZoom = this.clampZoom(this.targetZoom);
    this.zoom = this.clampZoom(this.zoom);
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
    });

    if (!this.reducedMotion) {
      this.artworkMesh.group.position.x = direction * 3.2;
      this.artworkMesh.group.rotation.y = direction * 0.32;
      this.artworkMesh.group.scale.set(0.84, 0.84, 0.84);
    }

    this.currentIndex = newIndex;
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
    });

    this.currentIndex = index;

    if (!this.reducedMotion) {
      this.artworkMesh.group.position.x = (diff > 0 ? 1 : -1) * 3.2;
      this.artworkMesh.group.rotation.y = direction * 0.32;
      this.artworkMesh.group.scale.set(0.84, 0.84, 0.84);
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

  update(): void {
    const group = this.artworkMesh.group;

    this.targetZoom = this.clampZoom(this.targetZoom);
    this.clampPanTargets();

    group.rotation.x += (this.targetX - group.rotation.x) * 0.05;
    group.rotation.y += (this.targetY - group.rotation.y) * 0.05;

    group.position.x += (0 - group.position.x) * 0.06;
    group.position.y += (0 - group.position.y) * 0.06;
    group.scale.x += (1 - group.scale.x) * 0.06;
    group.scale.y += (1 - group.scale.y) * 0.06;
    group.scale.z += (1 - group.scale.z) * 0.06;

    this.zoom += (this.targetZoom - this.zoom) * 0.08;
    this.camera.position.z += (this.zoom - this.camera.position.z) * 0.08;

    this.panX += (this.targetPanX - this.panX) * 0.08;
    this.panY += (this.targetPanY - this.panY) * 0.08;
    this.camera.position.x += (this.panX - this.camera.position.x) * 0.08;
    this.camera.position.y += (this.panY - this.camera.position.y) * 0.08;
  }

  resetView(): void {
    this.targetPanX = 0;
    this.targetPanY = 0;
    this.targetZoom = this.clampZoom(DEFAULT_CAMERA_Z);
    this.targetX = 0;
    this.targetY = 0;
  }

  private clampZoom(value: number): number {
    return clamp(value, this.getMinZoom(), MAX_CAMERA_Z);
  }

  private clampPanTargets(): void {
    const limits = this.getPanLimits(this.targetZoom);
    this.targetPanX = clamp(this.targetPanX, -limits.x, limits.x);
    this.targetPanY = clamp(this.targetPanY, -limits.y, limits.y);
  }

  private getPanLimits(zoom: number): { x: number; y: number } {
    const visibleHeight = 2 * this.clampZoom(zoom) * Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5));
    const visibleWidth = visibleHeight * this.camera.aspect;

    // v0.03: allow viewport centre to reach the artwork edge plus an explicit
    // overscroll margin so every corner is reachable during close inspection.
    return {
      x: Math.max(0, (this.artworkMesh.artworkWidth - visibleWidth) * 0.5 + INSPECTION_OVERSCROLL),
      y: Math.max(0, (this.artworkMesh.artworkHeight - visibleHeight) * 0.5 + INSPECTION_OVERSCROLL),
    };
  }

  private getMinZoom(): number {
    const requiredVisibleHeight = Math.max(
      this.artworkMesh.artworkHeight * MIN_VISIBLE_ARTWORK_FRACTION,
      (this.artworkMesh.artworkWidth * MIN_VISIBLE_ARTWORK_FRACTION) / this.camera.aspect
    );

    const fittedDistance = requiredVisibleHeight /
      (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5)));

    return clamp(Math.max(MIN_CAMERA_Z, fittedDistance), MIN_CAMERA_Z, DEFAULT_CAMERA_Z);
  }
}
