import * as THREE from 'three';
import type { Artwork } from '../config/artworks';
import {
  ARTWORK_PRESENTATION_PROFILES,
  resolveArtworkPresentation,
  type ArtworkPresentationId,
  type ArtworkPresentationProfile,
} from '../config/presentation';
import { ArtworkMesh } from './ArtworkMesh';
import { TextureManager } from './TextureManager';
import { ProceduralTextureFactory } from '../materials/ProceduralTextureFactory';
import { clamp, smoothDamp } from '../utils/math';
import { createScopedDiagnostics } from '../utils/Diagnostics';
import { resolveArtworkImageSources } from '../utils/artworkImageSources';
import type { QualityPreset } from '../config/quality';
import type { StartupReadinessMode } from '../config/startup';
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
// v0.28 X-03 — Raised from 2.5 (~1200 ms settle) to 3.5 (~860 ms settle).
// Reduces perceptible lag on painting navigation while retaining organic feel.
const LAMBDA_NAV_POSITION = 3.5;
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

/**
 * v0.26 V-01: Strict-preload safety cap, retained for the legacy `full`
 * startup-readiness mode (warm/preload every artwork before entry).
 *
 * v0.68 (v0.67 P-04): When `startupReadinessMode` is an entry mode
 * (`entry-balanced` / `entry-minimal`), the effective cap is the computed
 * entry-target count instead of MAX_SAFE_INTEGER — only the entry target set is
 * eagerly preloaded/warmed before the CTA, and the remainder is deferred to the
 * deterministic `near-next` / `background` prefetch lanes. See
 * `getStartupEntryTargetSet()` and `configureStartupReadiness()`.
 */
const FULL_PRELOAD_SAFETY_CAP = Number.MAX_SAFE_INTEGER;

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

type ReadinessStage =
  | 'albedoLoaded'
  | 'pbrLoaded'
  | 'proceduralReady'
  | 'materialApplied'
  | 'shaderCompiled'
  | 'gpuWarmed';

interface ArtworkReadiness {
  index: number;
  artworkId: string;
  albedoLoaded: boolean;
  pbrLoaded: boolean;
  proceduralReady: boolean;
  materialApplied: boolean;
  shaderCompiled: boolean;
  gpuWarmed: boolean;
  pbrMs: number;
  proceduralMs: number;
  lastWarmMs: number;
  lastReason: string;
  updatedAt: number;
}

interface PrefetchJob {
  index: number;
  reason: string;
  lane: PrefetchLane;
  enqueuedAt: number;
  sequence: number;
}

const CRITICAL_NAV_RADIUS = 2;
const PREFETCH_STARVATION_MS = 2500;
const PROCEDURAL_QUEUE_TIMEOUT_MS = 250;
const PREFETCH_LANE_PRIORITY: Record<PrefetchLane, number> = {
  'critical-now': 0,
  'near-next': 1,
  background: 2,
};

export type PrefetchLane = 'critical-now' | 'near-next' | 'background';

export interface ReadinessProfileConfig {
  criticalRadius: number;
}

export interface EntryReadinessContract {
  ready: boolean;
  pendingIndices: readonly number[];
  targetIndices: readonly number[];
}

/**
 * v0.24.2 Q-04 / v0.24.3 R-01: Snapshot of full-gallery readiness staged
 * immediately before the loading overlay is dismissed. Allows pre-entry
 * diagnostics to confirm every artwork is GPU-warmed and has no remaining
 * cold paths, and surfaces the active preload mode contract.
 */
export interface FullGalleryReadinessResult {
  totalArtworks: number;
  /** Artworks where all 6 readiness stages are complete. */
  fullyReadyCount: number;
  /** Artworks where at least one stage is still incomplete. */
  pendingCount: number;
  gpuWarmedCount: number;
  pbrLoadedCount: number;
  proceduralReadyCount: number;
  /** True when the gallery exceeds FULL_PRELOAD_SAFETY_CAP and capping was applied. */
  memoryCapApplied: boolean;
  /**
   * v0.24.3 R-01 / v0.68 P-04: Active preload contract mode.
   * - `strict`: legacy `full` mode — every artwork was eagerly loaded and
   *   warmed before CTA enablement.
   * - `staged`: an entry-readiness mode — only the entry target set was warmed
   *   before entry; remaining artworks are deferred to deterministic background
   *   lanes and complete after entry (expected, not a contract failure).
   * - `bounded-fallback`: gallery exceeds the cap; overflow artworks are
   *   queued as `near-next` and will complete in the background after entry.
   */
  preloadMode: 'strict' | 'staged' | 'bounded-fallback';
  /**
   * v0.24.3 R-03: IDs of artworks that have not yet reached all 6 readiness
   * stages. Empty array means the contract is fully satisfied. In `staged`
   * mode this lists the artworks deliberately deferred to background lanes.
   */
  unresolvedArtworkIds: readonly string[];
  /**
   * v0.68 P-04: Number of artworks intentionally deferred to background lanes
   * in `staged` mode (0 in `strict` mode).
   */
  deferredArtworkCount: number;
  /**
   * v0.24.3 R-01: Number of artworks that exceeded FULL_PRELOAD_SAFETY_CAP
   * and were not included in the strict preload pass (0 in strict mode).
   */
  overflowArtworkCount: number;
}

interface NavigationProbe {
  fromIndex: number;
  toIndex: number;
  trigger: 'navigate-next' | 'navigate-prev' | 'timeline-select';
  startedAt: number;
  readinessBefore?: {
    pbrLoaded: boolean;
    proceduralReady: boolean;
    gpuWarmed: boolean;
  };
}

interface AnimationSnapshot {
  groupX: number;
  groupY: number;
  groupZ: number;
  groupRotX: number;
  groupRotY: number;
  groupScaleX: number;
  groupScaleY: number;
  groupScaleZ: number;
  zoom: number;
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  panX: number;
  panY: number;
  targetX: number;
  targetY: number;
  targetZoom: number;
  targetPanX: number;
  targetPanY: number;
}

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
  private readonly textureManager: TextureManager;
  private readonly procedural: ProceduralTextureFactory;
  private readonly camera: THREE.PerspectiveCamera;
  // v0.74 OPT-1/T1-A — cache `tan(fov/2)`. `camera.fov` is constant at runtime
  // (never reassigned anywhere in src/; only `aspect` changes on resize), so
  // this avoids recomputing the same `Math.tan(degToRad(...))` 2–3× per frame.
  // The cache is keyed on the fov value, so a future fov change still recomputes
  // correctly on the next read. Output is mathematically identical.
  private _fovTanCache = NaN;
  private _fovTanForFov = NaN;
  private readonly viewportMetricsProvider: ViewportMetricsProvider | null;
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
  /**
   * v0.24.4 S-01: True while a pointer interaction window is open. When
   * active, non-critical-now prefetch jobs are deferred so the main thread
   * stays free for the render/present cycle that drives INP.
   */
  private interactionActive = false;
  private interactionActiveSince = 0;
  /** Frames rendered during the current interaction window (for telemetry). */
  private interactionFrameCount = 0;
  /** Accumulated CPU frame time (ms) across the current interaction window. */
  private interactionFrameTotalMs = 0;
  /** Frames in the current window where dt exceeded 33 ms (dropped at ≥30 fps). */
  private interactionFrameDropped = 0;
  private readonly prefetchedTextureSets = new Set<number>();
  private fullPrefetchScheduled = false;
  private readonly readiness: ArtworkReadiness[];
  private readonly prefetchQueue: PrefetchJob[] = [];
  private readonly activePrefetches = new Set<number>();
  private prefetchQueueRunning = false;
  private prefetchSequence = 0;
  private readinessRadius = CRITICAL_NAV_RADIUS;
  /**
   * v0.68 P-04: Active startup readiness contract. `full` reproduces the legacy
   * strict full-gallery preload/warm; entry modes warm only the entry target
   * set before the CTA and defer the rest to background lanes.
   */
  private startupReadinessMode: StartupReadinessMode = 'full';
  /** v0.68 P-04: Number of artworks that must reach full readiness before entry. */
  private startupEntryTargetCount = Number.MAX_SAFE_INTEGER;
  private pendingNavigationProbe: NavigationProbe | null = null;
  private readonly proceduralQueue = new Set<number>();
  private proceduralQueueRunning = false;
  private renderDirtyFrames = 8;
  private disposed = false;

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
    textureManager: TextureManager,
    camera: THREE.PerspectiveCamera,
    procedural?: ProceduralTextureFactory,
    viewportMetricsProvider?: ViewportMetricsProvider
  ) {
    this.artworks = artworks;
    this.artworkMesh = artworkMesh;
    this.textureManager = textureManager;
    this.camera = camera;
    this.procedural = procedural ?? new ProceduralTextureFactory();
    this.viewportMetricsProvider = viewportMetricsProvider ?? null;
    this.readiness = artworks.map((artwork, index) => ({
      index,
      artworkId: artwork.id,
      albedoLoaded: false,
      pbrLoaded: !artwork.textureSet,
      proceduralReady: false,
      materialApplied: false,
      shaderCompiled: false,
      gpuWarmed: false,
      pbrMs: 0,
      proceduralMs: 0,
      lastWarmMs: 0,
      lastReason: 'init',
      updatedAt: 0,
    }));
  }

  /** Allows main.ts to call `frameBudget.markNavigation()` on every navigation. */
  setFrameBudgetMarker(marker: FrameBudgetMarker | null): void {
    this.frameBudgetNavigationMarker = marker;
  }

  /**
   * v0.24.4 S-01/S-02: Signals that a pointer interaction window has opened
   * or closed. While active, non-`critical-now` prefetch queue jobs are
   * deferred so the main thread stays free for the render/present cycle that
   * drives INP. When the window closes, the queue is automatically resumed
   * and a per-interaction telemetry entry is emitted (S-03).
   */
  setInteractionActive(active: boolean): void {
    if (active === this.interactionActive) return;
    if (active) {
      this.interactionActive = true;
      this.interactionActiveSince = this.now();
      this.interactionFrameCount = 0;
      this.interactionFrameTotalMs = 0;
      this.interactionFrameDropped = 0;
      this.markRenderDirty(4);
      this.diagnostics.debug('interaction-start', 'Pointer interaction window opened; non-critical prefetch paused');
    } else {
      const durationMs = this.now() - this.interactionActiveSince;
      // v0.24.4 S-03: structured interaction telemetry
      this.diagnostics.info('interaction-end', 'Pointer interaction window ended; resuming background work', {
        durationMs: Math.round(durationMs),
        frameCount: this.interactionFrameCount,
        avgFrameMs: this.interactionFrameCount > 0
          ? Math.round(this.interactionFrameTotalMs / this.interactionFrameCount * 10) / 10
          : 0,
        droppedFrames: this.interactionFrameDropped,
        droppedFramePct: this.interactionFrameCount > 0
          ? Math.round((this.interactionFrameDropped / this.interactionFrameCount) * 100)
          : 0,
      });
      this.interactionActive = false;
      this.markRenderDirty(2);
      this.interactionActiveSince = 0;
      this.interactionFrameCount = 0;
      this.interactionFrameTotalMs = 0;
      this.interactionFrameDropped = 0;
      // Resume prefetch queue if it was paused while waiting for interaction to end
      if (this.prefetchQueue.length > 0 && !this.prefetchQueueRunning) {
        this.drainPrefetchQueue();
      }
    }
  }

  /**
   * v0.24.4 S-03: Called from the main animation loop each frame that falls
   * within an active interaction window. Accumulates CPU frame timing for
   * the per-interaction telemetry summary emitted by `setInteractionActive(false)`.
   */
  markInteractionFrame(dtMs: number): void {
    if (!this.interactionActive) return;
    this.interactionFrameCount += 1;
    this.interactionFrameTotalMs += dtMs;
    if (dtMs > 33) this.interactionFrameDropped += 1;
  }

  markRenderDirty(frames = 4): void {
    this.renderDirtyFrames = Math.max(this.renderDirtyFrames, Math.max(1, Math.round(frames)));
  }

  configureReadinessProfile(profile: ReadinessProfileConfig): void {
    this.readinessRadius = clamp(Math.round(profile.criticalRadius), 1, 3);
    this.diagnostics.info('readiness-profile', 'Applied readiness profile', {
      criticalRadius: this.readinessRadius,
      artworkCount: this.artworks.length,
    });
  }

  /**
   * v0.68 P-04: Configure the startup readiness contract before `init()`.
   * In entry modes only `entryTargetCount` artworks are eagerly
   * preloaded/warmed before the entry CTA; the remainder is deferred to the
   * deterministic `near-next` / `background` prefetch lanes.
   */
  configureStartupReadiness(config: { mode: StartupReadinessMode; entryTargetCount: number }): void {
    this.startupReadinessMode = config.mode;
    this.startupEntryTargetCount =
      config.mode === 'full'
        ? this.artworks.length
        : Math.max(1, Math.min(this.artworks.length, Math.round(config.entryTargetCount)));
    this.diagnostics.info('startup-readiness', 'Applied startup readiness contract', {
      mode: this.startupReadinessMode,
      entryTargetCount: this.startupEntryTargetCount,
      artworkCount: this.artworks.length,
      criticalRadius: this.readinessRadius,
    });
  }

  /**
   * v0.68 P-04: Priority-ordered list of artwork indices that must reach full
   * readiness before the entry CTA. `full` mode returns every artwork; entry
   * modes return the first `startupEntryTargetCount` of the budgeted warm order
   * (active artwork + critical window first).
   */
  getStartupEntryTargets(center = 0): number[] {
    const order = this.getBudgetedWarmOrder(center);
    if (this.startupReadinessMode === 'full') return order;
    return order.slice(0, this.startupEntryTargetCount);
  }

  /** v0.68 P-04: True when not every artwork is part of the pre-entry contract. */
  get isStagedStartup(): boolean {
    return this.startupReadinessMode !== 'full' && this.startupEntryTargetCount < this.artworks.length;
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
    this.markRenderDirty(4);
    // Rebuild the current artwork's map set so preset-specific roles
    // (detailNormal, height, roughness, specular, AO) are added/removed
    // immediately on quality changes.
    if (hadPreset && this.textureManager.get(this.artworks[this.currentIndex].image)) {
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
    this.markRenderDirty(4);
    this.diagnostics.info('inspection-mode', `Inspection mode ${on ? 'enabled' : 'disabled'}`);
    if (this.currentPreset) void this.showArtwork(this.currentIndex);
  }

  async init(): Promise<void> {
    const artworkSources = this.artworks.map((a) => {
      const sourcePlan = resolveArtworkImageSources(a);
      return {
        id: a.id,
        bundleId: sourcePlan.primary?.bundleId ?? null,
        declaredImageUrlType: sourcePlan.primary?.declaredUrlType ?? null,
        resolvedImageUrlType: sourcePlan.primary?.resolvedUrlType ?? null,
        hasEmbeddedFallback: !!sourcePlan.fallback,
        embeddedFallbackUrlType: sourcePlan.fallback?.resolvedUrlType ?? null,
        dimensions: a.dimensions,
      };
    });
    this.diagnostics.info('init', 'Starting gallery init — preloading albedo textures', {
      artworkCount: artworkSources.length,
      artworks: artworkSources,
    });
    await this.textureManager.preloadArtworkAlbedos(this.artworks);
    this.readiness.forEach((entry) => this.markReadiness(entry.index, 'albedoLoaded', 'init-preload'));

    const textureSetCount = this.artworks.filter((a) => !!a.textureSet).length;

    // v0.68 P-04: In entry modes only the entry target set is eagerly preloaded
    // under the overlay; the remainder is deferred to the deterministic
    // near-next lane so it streams in after entry without ever blocking the CTA.
    // In `full` mode the entry target set is the whole gallery, preserving the
    // legacy strict full-gallery preload contract exactly.
    const entryTargetSet = new Set(this.getStartupEntryTargets(0));
    const eagerEligible = ({ artwork, index }: { artwork: Artwork; index: number }): boolean =>
      !!artwork.textureSet && index < FULL_PRELOAD_SAFETY_CAP && entryTargetSet.has(index);
    const pbrArtworks = this.artworks
      .map((artwork, index) => ({ artwork, index }))
      .filter(eagerEligible);
    this.diagnostics.info('init', 'Preloading entry-target PBR texture sets under loading overlay (v0.68 staged-readiness contract)', {
      mode: this.startupReadinessMode,
      pbrCount: pbrArtworks.length,
      textureSetCount,
      totalArtworks: this.artworks.length,
      entryTargetCount: entryTargetSet.size,
      safetyCap: FULL_PRELOAD_SAFETY_CAP,
      cappedArtworks: Math.max(0, this.artworks.length - FULL_PRELOAD_SAFETY_CAP),
    });
    await Promise.allSettled(
      pbrArtworks.map(({ artwork, index }) =>
        this.preloadAuthoredTextureSet(index, 'init-pbr-preload').then(() => {
          this.prefetchedTextureSets.add(index);
          this.diagnostics.debug('preload-all', 'PBR texture set preloaded during init', {
            index,
            artworkId: artwork.id,
          });
        })
      )
    );

    // v0.24.3 R-02 / v0.68 P-04: Queue every artwork outside the eager preload
    // pass (overflow beyond the cap, or — in entry modes — artworks deferred
    // past the entry target set) into the near-next prefetch lane so their
    // completion is deterministic and queued, not dependent on opportunistic
    // idle callbacks alone.
    const deferredArtworks = this.artworks
      .map((artwork, index) => ({ artwork, index }))
      .filter(({ artwork, index }) => !!artwork.textureSet && !this.prefetchedTextureSets.has(index));
    if (deferredArtworks.length > 0) {
      this.diagnostics.info('init', 'Queuing deferred artworks for deterministic near-next prefetch (v0.68 staged-readiness)', {
        mode: this.startupReadinessMode,
        deferredCount: deferredArtworks.length,
        entryTargetCount: entryTargetSet.size,
        safetyCap: FULL_PRELOAD_SAFETY_CAP,
      });
      for (const { index } of deferredArtworks) {
        this.scheduleTextureSetPrefetch(index, 'init-staged-deferred-near-next', 'near-next');
      }
    }

    this.preGenerateProceduralWindow(0, this.readinessRadius, 'init-critical-window');
    this.logGalleryScaleValidation();
    this.diagnostics.info('init', 'Preload complete — showing first artwork', {
      artworkCount: this.artworks.length,
      pbrPreloaded: pbrArtworks.length,
      criticalProceduralReady: this.getCriticalWindowIndices(0, this.readinessRadius).length,
    });
    this.pendingResetAfterArtworkLoad = true;
    await this.showArtwork(0);
    this.scheduleFullTextureSetPrefetch();
  }

  addZoomDelta(delta: number): void {
    const metrics = this.getViewportMetrics();
    const bounds = this.getZoomBounds(metrics);
    this.targetZoom = this.clampZoom(this.targetZoom + delta, bounds);
    this.clampPanTargets(metrics, bounds);
    this.markRenderDirty(4);
  }

  setPanOffset(deltaX: number, deltaY: number): void {
    const metrics = this.getViewportMetrics();
    const bounds = this.getZoomBounds(metrics);
    const { x, y } = this.getPanLimits(this.targetZoom, metrics, bounds);
    this.targetPanX = clamp(this.targetPanX + deltaX, -x, x);
    this.targetPanY = clamp(this.targetPanY + deltaY, -y, y);
    this.markRenderDirty(4);
  }

  canPan(): boolean {
    const { x, y } = this.getPanLimits(this.targetZoom);
    return x > 0.01 || y > 0.01;
  }

  getHoverRotationScale(): { x: number; y: number } {
    const bounds = this.getZoomBounds();
    const zoomRange = Math.max(0.001, bounds.maxOverviewZoom - bounds.minInspectionZoom);
    const zoomProgress = (this.clampZoom(this.targetZoom, bounds) - bounds.minInspectionZoom) / zoomRange;

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
   * v0.90: Uses the shared artwork-source contract — declared image first,
   * optional embedded `webglImage` only as an explicit fallback if the image
   * asset fails to load as a WebGL albedo.
   */
  private async showArtwork(index: number): Promise<void> {
    const artwork = this.artworks[index];
    const presentation = this.resolvePresentation(index);
    const presentationProfile = ARTWORK_PRESENTATION_PROFILES[presentation];
    const sourcePlan = resolveArtworkImageSources(artwork);
    const albedoUrl = sourcePlan.primary?.resolvedUrl ?? artwork.image;
    const albedoSelection = this.textureManager.getArtworkAlbedoSelection(artwork);
    const albedo = this.textureManager.get(albedoUrl);

    const token = ++this.artworkLoadToken;
    const preset = this.currentPreset;
    const probeForIndex = this.pendingNavigationProbe?.toIndex === index ? this.pendingNavigationProbe : null;
    if (probeForIndex && !probeForIndex.readinessBefore) {
      const before = this.readiness[index];
      if (before) {
        probeForIndex.readinessBefore = {
          pbrLoaded: before.pbrLoaded,
          proceduralReady: before.proceduralReady,
          gpuWarmed: before.gpuWarmed,
        };
      }
    }
    this.diagnostics.debugLazy('show-artwork', 'Preparing artwork render state', () => ({
      index,
      artworkId: artwork.id,
      token,
      bundleId: albedoSelection?.bundleId ?? sourcePlan.primary?.bundleId ?? null,
      hasEmbeddedFallback: !!artwork.webglImage,
      albedoSourceMode: albedoSelection?.sourceMode ?? 'declared-image',
      albedoDeclaredUrlType: sourcePlan.primary?.declaredUrlType ?? 'local-relative',
      albedoResolvedUrlType: albedoSelection?.selectedUrlType ?? 'local-relative',
      usedEmbeddedFallback: albedoSelection?.usedEmbeddedFallback ?? false,
      generatedFallback: albedoSelection?.generatedFallback ?? false,
      dimensions: artwork.dimensions,
      surface: artwork.surface ?? null,
      presentation,
    }));

    if (!albedo || !preset) {
      this.diagnostics.warn('show-artwork-missing-state', 'Cannot render artwork because preset or albedo texture is missing', {
        artworkId: artwork.id,
        hasAlbedo: !!albedo,
        hasPreset: !!preset,
        bundleId: albedoSelection?.bundleId ?? sourcePlan.primary?.bundleId ?? null,
        albedoSourceMode: albedoSelection?.sourceMode ?? 'declared-image',
        albedoDeclaredUrlType: sourcePlan.primary?.declaredUrlType ?? 'local-relative',
        albedoResolvedUrlType: albedoSelection?.selectedUrlType ?? 'local-relative',
      });
      // Albedo preload should have populated the cache; if not, give up.
      return;
    }

    // Load any authored maps for this artwork in parallel.
    const authored = await this.preloadAuthoredTextureSet(index, 'show-artwork');
    if (artwork.textureSet) this.prefetchedTextureSets.add(index);

    // Audited guard: discard stale loads.
    if (token !== this.artworkLoadToken) {
      this.diagnostics.debugLazy('stale-load', 'Discarded stale artwork load', () => ({
        artworkId: artwork.id,
        token,
        latestToken: this.artworkLoadToken,
      }));
      return;
    }

    // Fill in missing roles from the procedural factory.
    const resolved: ResolvedPaintingTextures = {
      albedo: authored.albedo ?? albedo,
    };
    const proceduralStart = this.now();
    let proceduralGenerated = false;
    for (const role of PROCEDURAL_ROLES) {
      if (authored[role]) {
        resolved[role] = authored[role];
      } else if (this.shouldFillRole(role, preset, presentationProfile)) {
        resolved[role] = this.generateProceduralMap(artwork.id, role, preset);
        proceduralGenerated = true;
      }
    }
    this.markReadiness(index, 'proceduralReady', 'show-artwork', {
      proceduralMs: proceduralGenerated ? this.now() - proceduralStart : 0,
    });

    // P-02 v0.40: update frame surface seed so each artwork shows a distinct
    // deterministic texture phase, preventing phase alignment across the gallery.
    this.artworkMesh.setPaintingTextures(resolved, preset, artwork.dimensions, presentation);
    this.markReadiness(index, 'materialApplied', 'show-artwork');
    this.markRenderDirty(8);

    // Log the full resolved texture map so support can see which roles are
    // authored vs procedurally generated vs absent at a glance.
    const resolvedSummary: Record<string, string> = { albedo: authored.albedo ? 'authored' : 'preloaded' };
    for (const role of PROCEDURAL_ROLES) {
      if (authored[role]) resolvedSummary[role] = 'authored';
      else if (resolved[role]) resolvedSummary[role] = 'procedural';
      else resolvedSummary[role] = 'absent';
    }
    this.diagnostics.debugLazy('show-artwork-maps', 'Resolved texture map for artwork', () => ({
      artworkId: artwork.id,
      maps: resolvedSummary,
      shaderVariant: preset.shaderVariant,
      inspectionMode: this.inspectionMode,
      presentation,
    }));

    // v0.09: check fallback using the same URL that was loaded (albedoUrl).
    const albedoIsFallback = this.textureManager.isFallback(albedoUrl, 'albedo');
    if (albedoIsFallback) {
      this.diagnostics.warn('show-artwork-fallback', 'Central 3D painting is using a GENERATED FALLBACK texture — the customer image could not be loaded as a WebGL texture', {
        artworkId: artwork.id,
        bundleId: albedoSelection?.bundleId ?? sourcePlan.primary?.bundleId ?? null,
        imageUrl: sourcePlan.primary?.declaredUrl ?? artwork.image,
        resolvedImageUrl: albedoSelection?.selectedUrl ?? albedoUrl,
        albedoSourceMode: albedoSelection?.sourceMode ?? 'declared-image',
        usedEmbeddedFallback: albedoSelection?.usedEmbeddedFallback ?? false,
        manifestWidth: artwork.dimensions?.width,
        manifestHeight: artwork.dimensions?.height,
        fallbackUsed: true,
      });
    }
    const viewportMetrics = this.getViewportMetrics();
    const zoomBounds = this.getZoomBounds(viewportMetrics);
    const panLimitsAtReset = this.getPanLimits(zoomBounds.resetFitZoom, viewportMetrics, zoomBounds);
    const isPortraitReset = this.isPortraitResetArtwork();
    this.diagnostics.info('show-artwork-complete', 'Artwork is ready', {
      artworkId: artwork.id,
      bundleId: albedoSelection?.bundleId ?? sourcePlan.primary?.bundleId ?? null,
      activeMaps: this.artworkMesh.material.activeMaps(),
      inspectionMode: this.inspectionMode,
      fallbackUsed: albedoIsFallback,
      albedoSourceMode: albedoSelection?.sourceMode ?? 'declared-image',
      usedEmbeddedFallback: albedoSelection?.usedEmbeddedFallback ?? false,
      generatedFallback: albedoSelection?.generatedFallback ?? albedoIsFallback,
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
      presentation,
      specularStrength: preset.specularStrength,
      selfShadowBias: preset.selfShadowBias,
      readiness: this.readiness[index],
    });

    if (this.pendingResetAfterArtworkLoad) {
      this.pendingResetAfterArtworkLoad = false;
      this.resetView();
    } else {
      this.targetZoom = this.clampZoom(this.targetZoom, zoomBounds);
      this.zoom = this.clampZoom(this.zoom, zoomBounds);
    }
    this.clampPanTargets(viewportMetrics, zoomBounds);
    this.prefetchAdjacentArtworks(index);
    this.queueProceduralWindow(index, this.readinessRadius, 'show-artwork-adjacent');
    this.logNavigationReadinessVerdict(index);
  }

  getBudgetedWarmOrder(center = this.currentIndex): number[] {
    const critical = this.getCriticalWindowIndices(center, this.readinessRadius);
    const rest = this.artworks
      .map((_artwork, index) => index)
      .filter((index) => !critical.includes(index));
    return [...critical, ...rest];
  }

  markGpuWarmed(index: number, durationMs: number, reason: string): void {
    this.markReadiness(index, 'gpuWarmed', reason, { lastWarmMs: durationMs });
  }

  markShaderCompiled(index: number, reason: string): void {
    this.markReadiness(index, 'shaderCompiled', reason);
  }

  markAllShaderCompiled(reason: string): void {
    this.readiness.forEach((entry) => this.markReadiness(entry.index, 'shaderCompiled', reason));
  }

  promotePrefetchWindow(center: number, reason: string): void {
    this.scheduleTextureSetPrefetch(center, reason, 'critical-now');
    this.getCriticalWindowIndices(center, this.readinessRadius).forEach((index) => {
      if (index === center) return;
      this.scheduleTextureSetPrefetch(index, `${reason}:nearby`, 'near-next');
    });
    this.queueProceduralWindow(center, this.readinessRadius, `${reason}:nearby`);
  }

  hasReadinessWork(): boolean {
    if (this.prefetchQueue.length > 0 || this.activePrefetches.size > 0) return true;
    const current = this.readiness[this.currentIndex];
    return !!current && (!current.pbrLoaded || !current.proceduralReady || !current.gpuWarmed);
  }

  getReadinessLedger(): readonly ArtworkReadiness[] {
    return this.readiness.map((entry) => ({ ...entry }));
  }

  /**
   * v0.24.2 Q-04 / v0.24.3 R-01/R-03: Aggregates the per-artwork readiness
   * ledger into a concise summary for the pre-entry diagnostics log. Called
   * immediately before `loadingOverlay.reveal()` to confirm full-gallery warm
   * state, surface the active preload mode, and list any unresolved artworks.
   */
  getFullGalleryReadinessSummary(): FullGalleryReadinessResult {
    const r = this.readiness;
    const isFullyReady = (e: ArtworkReadiness): boolean =>
      e.albedoLoaded && e.pbrLoaded && e.proceduralReady && e.materialApplied && e.shaderCompiled && e.gpuWarmed;
    const fullyReadyCount = r.filter(isFullyReady).length;
    const overflowArtworkCount = 0;
    const unresolvedArtworkIds = r.filter((e) => !isFullyReady(e)).map((e) => e.artworkId);
    // v0.68 P-04: In entry modes, artworks outside the pre-entry contract are
    // intentionally deferred to background lanes. They count as `deferred`,
    // not as a strict-contract failure.
    const staged = this.isStagedStartup;
    const entryTargetSet = staged ? new Set(this.getStartupEntryTargets(this.currentIndex)) : null;
    const deferredArtworkCount = entryTargetSet
      ? r.filter((e) => !entryTargetSet.has(e.index) && !isFullyReady(e)).length
      : 0;
    return {
      totalArtworks: this.artworks.length,
      fullyReadyCount,
      pendingCount: this.artworks.length - fullyReadyCount,
      gpuWarmedCount: r.filter((e) => e.gpuWarmed).length,
      pbrLoadedCount: r.filter((e) => e.pbrLoaded).length,
      proceduralReadyCount: r.filter((e) => e.proceduralReady).length,
      memoryCapApplied: false,
      preloadMode: staged ? 'staged' : 'strict',
      unresolvedArtworkIds,
      deferredArtworkCount,
      overflowArtworkCount,
    };
  }

  getEntryWarmTargets(center: number, targetCount: number): number[] {
    const requested = Math.max(1, Math.min(this.artworks.length, Math.round(targetCount)));
    return this.getBudgetedWarmOrder(center).slice(0, requested);
  }

  async ensureEntryReadiness(indices: readonly number[], reason: string): Promise<void> {
    for (const index of indices) {
      await this.preloadAuthoredTextureSet(index, `${reason}:critical-now`);
      if (this.artworks[index]?.textureSet) this.prefetchedTextureSets.add(index);
      this.preGenerateProceduralWindow(index, 0, `${reason}:critical-now`);
      this.scheduleTextureSetPrefetch(index, `${reason}:critical-now`, 'critical-now');
    }
  }

  getEntryReadinessContract(indices: readonly number[]): EntryReadinessContract {
    const pendingIndices: number[] = [];
    for (const index of indices) {
      const entry = this.readiness[index];
      if (!entry) {
        pendingIndices.push(index);
        continue;
      }
      if (!entry.albedoLoaded || !entry.pbrLoaded || !entry.proceduralReady || !entry.materialApplied || !entry.gpuWarmed) {
        pendingIndices.push(index);
      }
    }
    return {
      ready: pendingIndices.length === 0,
      pendingIndices,
      targetIndices: [...indices],
    };
  }

  /**
   * v0.22 L-02: Binds cached textures for the artwork at `index` without
   * triggering navigation side effects. Call under the loading overlay before a
   * renderer.render() pass to force CPU→VRAM upload for first navigation.
   */
  warmArtworkForGPU(index: number, reason = 'gpu-warm'): boolean {
    const start = this.now();
    const artwork = this.artworks[index];
    const presentation = this.resolvePresentation(index);
    const presentationProfile = ARTWORK_PRESENTATION_PROFILES[presentation];
    const preset = this.currentPreset;
    if (!artwork || !preset) return false;

    const albedoUrl =
      this.textureManager.getArtworkAlbedoSelection(artwork)?.selectedUrl
      ?? resolveArtworkImageSources(artwork).primary?.resolvedUrl
      ?? artwork.image;
    const fallbackAlbedo = this.textureManager.get(albedoUrl);
    if (!fallbackAlbedo) {
      this.diagnostics.warn('warm-gpu', 'Cannot warm artwork because albedo is not cached', {
        index,
        artworkId: artwork.id,
      });
      return false;
    }

    const authored: Partial<ResolvedPaintingTextures> = {};
    if (artwork.textureSet) {
      const authoredAlbedo = artwork.textureSet.albedo
        ? this.textureManager.getForRole(artwork.textureSet.albedo.url, 'albedo')
        : undefined;
      if (authoredAlbedo) authored.albedo = authoredAlbedo;
      for (const role of PROCEDURAL_ROLES) {
        const entry = artwork.textureSet[role];
        if (!entry) continue;
        const cached = this.textureManager.getForRole(entry.url, role);
        if (cached) authored[role] = cached;
      }
    }

    const resolved: ResolvedPaintingTextures = {
      albedo: authored.albedo ?? fallbackAlbedo,
    };
    for (const role of PROCEDURAL_ROLES) {
      if (authored[role]) {
        resolved[role] = authored[role];
      } else if (this.shouldFillRole(role, preset, presentationProfile)) {
        resolved[role] = this.generateProceduralMap(artwork.id, role, preset);
      }
    }

    this.artworkMesh.setPaintingTextures(resolved, preset, artwork.dimensions, presentation);
    this.markReadiness(index, 'proceduralReady', reason);
    this.markReadiness(index, 'materialApplied', reason);
    this.diagnostics.debug('warm-gpu', 'Cached artwork textures bound for GPU warm render', {
      index,
      artworkId: artwork.id,
      activeMaps: this.artworkMesh.material.activeMaps(),
      reason,
      bindMs: Math.round((this.now() - start) * 10) / 10,
    });
    return true;
  }

  private async preloadAuthoredTextureSet(
    index: number,
    reason: string
  ): Promise<Partial<ResolvedPaintingTextures>> {
    const artwork = this.artworks[index];
    if (!artwork?.textureSet) {
      this.markReadiness(index, 'pbrLoaded', reason, { pbrMs: 0 });
      return {};
    }
    const start = this.now();
    const authored = await this.textureManager.preloadTextureSet(artwork.textureSet);
    this.markReadiness(index, 'pbrLoaded', reason, { pbrMs: this.now() - start });
    return authored;
  }

  private generateProceduralMap(
    artworkId: string,
    role: PaintingMapRole,
    preset: QualityPreset
  ): THREE.Texture {
    // v0.06: geometry-carrying roles use the higher inspection tile size when
    // the inspection light profile is active and the preset opts in.
    const inspSize = preset.proceduralInspectionTileSize;
    const useInspection =
      this.inspectionMode && inspSize > 0 && (INSPECTION_ROLES as readonly string[]).includes(role);
    const tileSize = useInspection ? inspSize : preset.proceduralTileSize;
    return this.procedural.generate(artworkId, role, tileSize);
  }

  private preGenerateProceduralWindow(center: number, radius: number, reason: string): void {
    const preset = this.currentPreset;
    if (!preset) return;
    for (const index of this.getCriticalWindowIndices(center, radius)) {
      const artwork = this.artworks[index];
      const presentationProfile = ARTWORK_PRESENTATION_PROFILES[this.resolvePresentation(index)];
      const start = this.now();
      let generated = 0;
      for (const role of PROCEDURAL_ROLES) {
        if (artwork.textureSet?.[role] || !this.shouldFillRole(role, preset, presentationProfile)) continue;
        this.generateProceduralMap(artwork.id, role, preset);
        generated += 1;
      }
      this.markReadiness(index, 'proceduralReady', reason, {
        proceduralMs: generated > 0 ? this.now() - start : 0,
      });
      this.diagnostics.debug('procedural-pregenerate', 'Procedural maps prepared for artwork', {
        index,
        artworkId: artwork.id,
        generated,
        reason,
        radius,
      });
    }
  }

  private getCriticalWindowIndices(center: number, radius: number): number[] {
    const result: number[] = [];
    const seen = new Set<number>();
    const add = (index: number): void => {
      if (index < 0 || index >= this.artworks.length || seen.has(index)) return;
      seen.add(index);
      result.push(index);
    };
    add(center);
    for (let offset = 1; offset <= radius; offset += 1) {
      add(center - offset);
      add(center + offset);
    }
    return result;
  }

  private markReadiness(
    index: number,
    stage: ReadinessStage,
    reason: string,
    timing: Partial<Pick<ArtworkReadiness, 'pbrMs' | 'proceduralMs' | 'lastWarmMs'>> = {}
  ): void {
    const entry = this.readiness[index];
    if (!entry) return;
    entry[stage] = true;
    entry.lastReason = reason;
    entry.updatedAt = this.now();
    if (timing.pbrMs !== undefined) entry.pbrMs = Math.round(timing.pbrMs * 10) / 10;
    if (timing.proceduralMs !== undefined) entry.proceduralMs = Math.round(timing.proceduralMs * 10) / 10;
    if (timing.lastWarmMs !== undefined) entry.lastWarmMs = Math.round(timing.lastWarmMs * 10) / 10;
    this.markRenderDirty(2);
    this.diagnostics.debugLazy('readiness', `Artwork readiness updated: ${stage}`, () => ({
      index,
      artworkId: entry.artworkId,
      stage,
      reason,
      ready: {
        albedoLoaded: entry.albedoLoaded,
        pbrLoaded: entry.pbrLoaded,
        proceduralReady: entry.proceduralReady,
        materialApplied: entry.materialApplied,
        shaderCompiled: entry.shaderCompiled,
        gpuWarmed: entry.gpuWarmed,
      },
      timings: {
        pbrMs: entry.pbrMs,
        proceduralMs: entry.proceduralMs,
        lastWarmMs: entry.lastWarmMs,
      },
    }));
  }

  private now(): number {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
  }

  private logGalleryScaleValidation(): void {
    const count = this.artworks.length;
    const buckets = [4, 15, 20, 50];
    const closest = buckets.reduce((best, candidate) =>
      Math.abs(candidate - count) < Math.abs(best - count) ? candidate : best
    );
    this.diagnostics.info('validation', 'v0.23 gallery-size readiness profile', {
      artworkCount: count,
      nearestValidationBucket: closest,
      validationBuckets: buckets,
      criticalWindowRadius: CRITICAL_NAV_RADIUS,
      criticalWindow: this.getCriticalWindowIndices(0, CRITICAL_NAV_RADIUS),
      warmOrderPreview: this.getBudgetedWarmOrder(0).slice(0, Math.min(count, 12)),
      readinessLedger: this.getReadinessLedger(),
    });
  }

  private prefetchAdjacentArtworks(index: number): void {
    for (const offset of [-1, 1, -2, 2]) {
      const target = index + offset;
      if (target < 0 || target >= this.artworks.length) continue;
      this.scheduleTextureSetPrefetch(target, `adjacent:${offset}`, 'near-next');
    }
  }

  private scheduleFullTextureSetPrefetch(): void {
    if (this.fullPrefetchScheduled) return;
    this.fullPrefetchScheduled = true;
    let index = 0;
    const runNext = (): void => {
      while (
        index < this.artworks.length &&
        (!this.artworks[index]?.textureSet || this.prefetchedTextureSets.has(index))
      ) {
        index += 1;
      }
      if (index >= this.artworks.length) {
        this.diagnostics.info('prefetch-complete', 'Idle artwork texture-set prefetch sweep complete', {
          artworkCount: this.artworks.length,
          prefetched: this.prefetchedTextureSets.size,
        });
        return;
      }
      const scheduledIndex = index;
      index += 1;
      this.scheduleTextureSetPrefetch(scheduledIndex, 'idle-sweep', 'background', runNext);
    };
    this.scheduleIdle(runNext, 500);
  }

  private scheduleTextureSetPrefetch(
    index: number,
    reason: string,
    lane: PrefetchLane,
    after?: () => void
  ): void {
    const artwork = this.artworks[index];
    if (!artwork?.textureSet || this.prefetchedTextureSets.has(index) || this.activePrefetches.has(index)) {
      after?.();
      return;
    }
    const queued = this.prefetchQueue.find((job) => job.index === index);
    if (queued) {
      if (PREFETCH_LANE_PRIORITY[lane] < PREFETCH_LANE_PRIORITY[queued.lane]) {
        queued.lane = lane;
        queued.reason = reason;
        queued.enqueuedAt = this.now();
        this.sortPrefetchQueue();
      }
      after?.();
      return;
    }
    this.prefetchQueue.push({
      index,
      reason,
      lane,
      enqueuedAt: this.now(),
      sequence: this.prefetchSequence++,
    });
    this.sortPrefetchQueue();
    this.diagnostics.debug('prefetch-queued', 'Artwork texture-set prefetch queued', {
      index,
      artworkId: artwork.id,
      reason,
      lane,
      queueLength: this.prefetchQueue.length,
    });
    this.drainPrefetchQueue(after);
  }

  private drainPrefetchQueue(after?: () => void): void {
    if (this.prefetchQueueRunning) {
      after?.();
      return;
    }
    const runNext = (): void => {
      if (!this.prefetchQueue.length) {
        this.prefetchQueueRunning = false;
        after?.();
        return;
      }
      // v0.24.4 S-01: Defer non-critical-now jobs while pointer interaction is
      // active. Pausing the queue keeps the main thread free for the render/
      // present cycle that drives INP. The queue resumes via setInteractionActive(false).
      const topJob = this.prefetchQueue[0];
      if (this.interactionActive && topJob && topJob.lane !== 'critical-now') {
        this.prefetchQueueRunning = false;
        this.diagnostics.debug('prefetch-deferred-interaction', 'Non-critical prefetch paused for active interaction window', {
          deferredLane: topJob.lane,
          queueLength: this.prefetchQueue.length,
        });
        return;
      }
      const job = this.prefetchQueue.shift()!;
      const artwork = this.artworks[job.index];
      if (!artwork?.textureSet || this.prefetchedTextureSets.has(job.index)) {
        this.scheduleIdle(runNext, 50);
        return;
      }
      this.activePrefetches.add(job.index);
      this.scheduleIdle(() => {
        this.diagnostics.debug('prefetch-start', 'Prefetching artwork texture set', {
          index: job.index,
          artworkId: artwork.id,
          reason: job.reason,
          lane: job.lane,
          queueLength: this.prefetchQueue.length,
        });
        this.preloadAuthoredTextureSet(job.index, `prefetch:${job.reason}`)
          .then(() => {
            this.prefetchedTextureSets.add(job.index);
            this.diagnostics.debug('prefetch-complete', 'Artwork texture set prefetched', {
              index: job.index,
              artworkId: artwork.id,
              reason: job.reason,
            });
          })
          .catch((err) => {
            this.prefetchedTextureSets.delete(job.index);
            this.diagnostics.warn('prefetch-failed', 'Artwork texture-set prefetch failed', {
              index: job.index,
              artworkId: artwork.id,
              reason: job.reason,
              message: err instanceof Error ? err.message : String(err),
            });
          })
          .finally(() => {
            this.activePrefetches.delete(job.index);
            runNext();
          });
      }, 250);
    };
    this.prefetchQueueRunning = true;
    runNext();
  }

  private sortPrefetchQueue(): void {
    const now = this.now();
    const effectiveRank = (job: PrefetchJob): number => {
      const ageMs = now - job.enqueuedAt;
      if (job.lane === 'background' && ageMs >= PREFETCH_STARVATION_MS) return PREFETCH_LANE_PRIORITY['near-next'];
      return PREFETCH_LANE_PRIORITY[job.lane];
    };
    this.prefetchQueue.sort((a, b) => {
      const rankDiff = effectiveRank(a) - effectiveRank(b);
      if (rankDiff !== 0) return rankDiff;
      return a.sequence - b.sequence;
    });
  }

  private scheduleIdle(callback: () => void, timeout: number): void {
    const invoke = (): void => {
      if (this.disposed) return;
      callback();
    };
    const idle = (window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;
    if (typeof idle === 'function') {
      idle(invoke, { timeout });
      return;
    }
    window.setTimeout(invoke, 1);
  }

  /** Selects which procedural fallback roles to generate for the active preset. */
  private shouldFillRole(
    role: PaintingMapRole,
    preset: QualityPreset,
    presentation: ArtworkPresentationProfile
  ): boolean {
    if (!presentation.proceduralRoles.includes(role)) return false;
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
      case 'varnish':
        return preset.clearcoatEnabled && presentation.clearcoatStrength > 0;
      case 'ao':
        return preset.aoEnabled;
      default:
        return false;
    }
  }

  private resolvePresentation(index: number): ArtworkPresentationId {
    return resolveArtworkPresentation(this.artworks[index]?.presentation);
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
    this.pendingNavigationProbe = {
      fromIndex,
      toIndex: newIndex,
      trigger: direction > 0 ? 'navigate-next' : 'navigate-prev',
      startedAt: this.now(),
    };
    this.promotePrefetchWindow(newIndex, `navigate:${direction > 0 ? 'next' : 'prev'}`);
    void this.showArtwork(newIndex);
    this.frameBudgetNavigationMarker?.();

    this.resetView();
    this.onNavigateCallback?.(this.currentIndex);
  }

  goTo(index: number): void {
    if (index === this.currentIndex) return;
    const fromIndex = this.currentIndex;
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
    this.pendingNavigationProbe = {
      fromIndex,
      toIndex: index,
      trigger: 'timeline-select',
      startedAt: this.now(),
    };
    this.promotePrefetchWindow(index, 'timeline-select');

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
    this.clampPanTargets(viewportMetrics, bounds);
    this.markRenderDirty(4);

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
    if (this.targetY === x && this.targetX === y) return;
    this.targetY = x;
    this.targetX = y;
    this.markRenderDirty(2);
  }

  onNavigate(cb: NavigationCallback): void {
    this.onNavigateCallback = cb;
  }

  get index(): number {
    return this.currentIndex;
  }

  /**
   * v0.81 — exact-target readiness gate for hub selection. Resolves `'ready'`
   * as soon as the artwork at `index` reaches an interactive presented
   * surface (`albedoLoaded`, `materialApplied`, and `shaderCompiled` in the
   * existing readiness ledger), or `'timeout'` after `timeoutMs`. Never
   * rejects and never blocks entry: on timeout the same exact target is
   * entered with its procedural surface while loading continues in the
   * background.
   */
  whenArtworkInteractive(index: number, timeoutMs: number): Promise<'ready' | 'timeout'> {
    const entry = this.readiness[index];
    if (!entry || this.disposed) return Promise.resolve('timeout');
    const isInteractive = (): boolean =>
      entry.albedoLoaded && entry.materialApplied && entry.shaderCompiled;
    if (isInteractive()) return Promise.resolve('ready');
    return new Promise((resolve) => {
      const startedAt = this.now();
      const poll = (): void => {
        if (this.disposed || !this.readiness[index]) {
          resolve('timeout');
          return;
        }
        if (isInteractive()) {
          resolve('ready');
          return;
        }
        if (this.now() - startedAt >= timeoutMs) {
          resolve('timeout');
          return;
        }
        window.setTimeout(poll, 50);
      };
      window.setTimeout(poll, 50);
    });
  }

  get artworkAspect(): number {
    return this.artworkMesh.artworkAspect;
  }

  /** Read-only accessor for the procedural factory (used in dispose). */
  get proceduralFactory(): ProceduralTextureFactory {
    return this.procedural;
  }

  /**
   * v0.15 — frame-rate-independent update step.
   *
   * Receives a `DOMHighResTimeStamp now` from the main animation loop and
   * derives `dt` in seconds. All smoothing uses `smoothDamp(value, target,
   * lambda, dt)` which is the analytic solution to exponential decay, so
   * timing is consistent across 30 Hz, 60 Hz, 90 Hz, and 120 Hz displays.
   */
  update(now: number): boolean {
    const group = this.artworkMesh.group;
    const before = this.readAnimationSnapshot();

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
    const metrics = this.getViewportMetrics();
    const bounds = this.getZoomBounds(metrics);
    this.targetZoom = this.clampZoom(this.targetZoom, bounds);
    this.clampPanTargets(metrics, bounds);

    if (dt <= 0) return this.consumeRenderDirty() || this.animationSnapshotChanged(before);

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
    return this.consumeRenderDirty() || this.animationSnapshotChanged(before);
  }

  resetView(): void {
    const bounds = this.getZoomBounds();
    this.targetPanX = 0;
    this.targetPanY = 0;
    this.targetZoom = bounds.resetFitZoom;
    this.lastResetFitZoom = bounds.resetFitZoom;
    this.targetX = 0;
    this.targetY = 0;
    this.markRenderDirty(4);
  }

  private consumeRenderDirty(): boolean {
    if (this.renderDirtyFrames <= 0) return false;
    this.renderDirtyFrames -= 1;
    return true;
  }

  private readAnimationSnapshot(): AnimationSnapshot {
    const group = this.artworkMesh.group;
    return {
      groupX: group.position.x,
      groupY: group.position.y,
      groupZ: group.position.z,
      groupRotX: group.rotation.x,
      groupRotY: group.rotation.y,
      groupScaleX: group.scale.x,
      groupScaleY: group.scale.y,
      groupScaleZ: group.scale.z,
      zoom: this.zoom,
      cameraX: this.camera.position.x,
      cameraY: this.camera.position.y,
      cameraZ: this.camera.position.z,
      panX: this.panX,
      panY: this.panY,
      targetX: this.targetX,
      targetY: this.targetY,
      targetZoom: this.targetZoom,
      targetPanX: this.targetPanX,
      targetPanY: this.targetPanY,
    };
  }

  private animationSnapshotChanged(before: AnimationSnapshot): boolean {
    const after = this.readAnimationSnapshot();
    return Object.keys(before).some((key) => {
      const k = key as keyof AnimationSnapshot;
      return Math.abs(after[k] - before[k]) > 1e-5;
    });
  }

  private clampZoom(value: number, bounds = this.getZoomBounds()): number {
    return clamp(value, bounds.minInspectionZoom, bounds.maxOverviewZoom);
  }

  private clampPanTargets(
    metrics = this.getViewportMetrics(),
    bounds = this.getZoomBounds(metrics)
  ): void {
    const limits = this.getPanLimits(this.targetZoom, metrics, bounds);
    this.targetPanX = clamp(this.targetPanX, -limits.x, limits.x);
    this.targetPanY = clamp(this.targetPanY, -limits.y, limits.y);
  }

  /**
   * v0.74 OPT-1/T1-A — memoized `tan(degToRad(fov/2))`. Recomputes only when
   * the camera fov actually changes (it does not at runtime), so the common
   * case is a single field read instead of a `Math.tan` + `degToRad` per call.
   */
  private getFovTan(): number {
    const fov = this.camera.fov;
    if (fov !== this._fovTanForFov) {
      this._fovTanForFov = fov;
      this._fovTanCache = Math.tan(THREE.MathUtils.degToRad(fov * 0.5));
    }
    return this._fovTanCache;
  }

  private getPanLimits(
    zoom: number,
    metrics = this.getViewportMetrics(),
    bounds = this.getZoomBounds(metrics)
  ): { x: number; y: number } {
    const boundedZoom = clamp(zoom, bounds.minInspectionZoom, bounds.maxOverviewZoom);
    const visibleHeight = 2 *
      boundedZoom *
      this.getFovTan() *
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
    const fovTan = this.getFovTan();
    const requiredHeight = this.artworkMesh.artworkHeight * MIN_VISIBLE_ARTWORK_FRACTION;
    const requiredWidth = this.artworkMesh.artworkWidth * MIN_VISIBLE_ARTWORK_FRACTION;
    const heightDistance = requiredHeight / (2 * fovTan * metrics.usableFracY);
    const widthDistance = requiredWidth / (2 * fovTan * this.camera.aspect * metrics.usableFracX);

    return clamp(Math.max(MIN_CAMERA_Z, heightDistance, widthDistance), MIN_CAMERA_Z, DEFAULT_CAMERA_Z);
  }

  private getResetFitZoom(metrics: ArtworkViewportMetrics): number {
    const frameWidth = this.artworkMesh.artworkWidth + 0.4;
    const frameHeight = this.artworkMesh.artworkHeight + 0.4;
    const fovTan = this.getFovTan();
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

  private queueProceduralWindow(center: number, radius: number, reason: string): void {
    this.getCriticalWindowIndices(center, radius).forEach((index) => this.proceduralQueue.add(index));
    if (this.proceduralQueueRunning) return;
    this.proceduralQueueRunning = true;
    const drain = (): void => {
      const next = this.proceduralQueue.values().next();
      if (next.done) {
        this.proceduralQueueRunning = false;
        return;
      }
      const index = next.value;
      this.proceduralQueue.delete(index);
      this.scheduleIdle(() => {
        this.preGenerateProceduralWindow(index, 0, `${reason}:queued`);
        drain();
      }, PROCEDURAL_QUEUE_TIMEOUT_MS);
    };
    drain();
  }

  private logNavigationReadinessVerdict(index: number): void {
    const probe = this.pendingNavigationProbe;
    if (!probe || probe.toIndex !== index) return;
    this.pendingNavigationProbe = null;
    const before = probe.readinessBefore;
    if (!before) return;
    const entry = this.readiness[index];
    if (!entry) return;
    const wasColdPbr = !before.pbrLoaded;
    const wasColdProcedural = !before.proceduralReady;
    const wasColdGpu = !before.gpuWarmed;
    const cold = wasColdPbr || wasColdProcedural || wasColdGpu;
    this.diagnostics.info(
      cold ? 'cold-path-detected' : 'hot-path-confirmed',
      cold ? 'Navigation required remaining readiness work' : 'Navigation stayed on prepared hot path',
      {
        trigger: probe.trigger,
        fromIndex: probe.fromIndex,
        toIndex: probe.toIndex,
        durationMs: Math.round((this.now() - probe.startedAt) * 10) / 10,
        cold: {
          pbr: wasColdPbr,
          procedural: wasColdProcedural,
          gpu: wasColdGpu,
        },
        readiness: entry,
      }
    );
  }

  dispose(): void {
    this.disposed = true;
    this.prefetchQueue.length = 0;
    this.proceduralQueue.clear();
    this.activePrefetches.clear();
    this.onNavigateCallback = null;
    this.pendingNavigationProbe = null;
  }
}
