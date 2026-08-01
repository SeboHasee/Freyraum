import * as THREE from 'three';
import { getOptimalPixelRatio } from '../utils/performance';
import { createScopedDiagnostics } from '../utils/Diagnostics';
import type { QualityPreset } from '../config/quality';

const diagnostics = createScopedDiagnostics('renderer');

/**
 * v0.16 — read-only snapshot of `renderer.info`. Exposed to the boot
 * loop so info/verbose diagnostics can periodically log GPU draw-call,
 * triangle, and texture counts without leaking the mutable info object
 * into callers.
 */
export interface RendererSnapshot {
  drawCalls: number;
  triangles: number;
  points: number;
  lines: number;
  geometries: number;
  textures: number;
  programs: number;
  pixelRatio: number;
  width: number;
  height: number;
  renderPaused: boolean;
  preset: string;
}

export type RendererContextState = 'lost' | 'restored';

export class RendererManager {
  readonly renderer: THREE.WebGLRenderer;
  private preset: QualityPreset;
  private wallClearColor: string;
  private renderPaused = false;
  private disposed = false;
  private contextChangeCallback: ((state: RendererContextState) => void) | null = null;
  // v0.74 OPT-7/T1-D — reusable scratch vector for `renderer.getSize()` reads in
  // `getRendererSnapshot()`. Avoids allocating a `THREE.Vector2` on every
  // diagnostics snapshot (periodic in info/verbose modes).
  private readonly _sizeScratch = new THREE.Vector2();

  constructor(container: HTMLElement, preset: QualityPreset, wallClearColor = '#d8dddb') {
    this.preset = preset;
    this.wallClearColor = wallClearColor;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });

    this.renderer.setPixelRatio(getOptimalPixelRatio(preset.pixelRatioCap));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    // No tone mapping — the scene does not use HDR rendering, so any
    // tone-mapping curve (ACES, Neutral, etc.) only washes out textures,
    // reduces contrast and shifts hues away from the source artwork.
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    // v0.81 — clear color comes from the resolved wall token (default
    // `#D8DDDB`) so CSS and WebGL share one authoritative value and canvas
    // creation/reveal cannot flash white.
    this.renderer.setClearColor(new THREE.Color(this.wallClearColor));
    this.renderer.shadowMap.enabled = preset.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // v0.16 — mirror the active preset id to a CSS data attribute so
    // SCSS rules (e.g. `[data-quality='battery']` blur reductions and
    // backdrop-filter fallbacks) can react without a JS round-trip.
    this.applyQualityDataAttribute(preset.id);

    // v0.11 — WebGL context-loss handling for mobile reliability. The
    // mobile GPU driver may drop the context under memory pressure, app
    // switching, or device sleep. Without `preventDefault()` the context
    // would not be restored automatically; with it, Three.js can
    // re-upload textures and re-link programs when 'webglcontextrestored'
    // fires. We log both events at diagnostic level so customer-preview
    // reports include them.
    const canvas = this.renderer.domElement;
    canvas.addEventListener('webglcontextlost', this.onContextLost as EventListener, false);
    canvas.addEventListener('webglcontextrestored', this.onContextRestored as EventListener, false);

    container.appendChild(canvas);
  }

  applyPreset(preset: QualityPreset): void {
    this.preset = preset;
    this.renderer.setPixelRatio(getOptimalPixelRatio(preset.pixelRatioCap));
    this.renderer.shadowMap.enabled = preset.shadows;
    this.applyQualityDataAttribute(preset.id);
  }

  setWallClearColor(wallClearColor: string): void {
    this.wallClearColor = wallClearColor;
    this.renderer.setClearColor(new THREE.Color(this.wallClearColor));
  }

  /**
   * v0.16 — single resize coordinator entry point. The caller passes the
   * already-measured viewport dimensions (typically the
   * `window.visualViewport` size on mobile) so every layer in the resize
   * chain agrees on one viewport rectangle for the same frame.
   */
  resize(width: number, height: number): void {
    this.renderer.setSize(Math.max(1, width), Math.max(1, height));
    this.renderer.setPixelRatio(getOptimalPixelRatio(this.preset.pixelRatioCap));
  }

  /** v0.11 — `true` while the WebGL context is lost; the render loop
   *  should skip drawing during this window. */
  isRenderPaused(): boolean {
    return this.renderPaused;
  }

  onContextChange(callback: ((state: RendererContextState) => void) | null): void {
    this.contextChangeCallback = callback;
  }

  /**
   * v0.16 — non-blocking shader pre-warm. After boot and after expensive
   * preset/profile changes, this asks three.js to compile every program
   * the scene currently needs ahead of the first interaction. Prefers
   * `compileAsync()` when available; falls back to the synchronous
   * `compile()` on older three.js builds. Failures are logged but never
   * thrown — pre-warming is an optimization, never a correctness
   * requirement.
   *
   * Online validation: https://threejs.org/docs/#api/en/renderers/WebGLRenderer.compileAsync
   */
  async prewarm(scene: THREE.Scene, camera: THREE.PerspectiveCamera): Promise<void> {
    const renderer = this.renderer as THREE.WebGLRenderer & {
      compileAsync?: (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => Promise<unknown>;
    };
    try {
      if (typeof renderer.compileAsync === 'function') {
        await renderer.compileAsync(scene, camera);
        diagnostics.debug('prewarm-async', 'Shader programs pre-warmed via compileAsync()', {
          preset: this.preset.id,
        });
      } else {
        renderer.compile(scene, camera);
        diagnostics.debug('prewarm-sync', 'Shader programs pre-warmed via compile()', {
          preset: this.preset.id,
        });
      }
    } catch (err) {
      diagnostics.warn('prewarm-failed', 'Shader pre-warm failed; continuing normally', {
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  /**
   * v0.16 — read-only snapshot of `renderer.info` and the current
   * drawing-buffer size. Periodically logged from the boot loop in
   * info/verbose modes to establish a runtime measurement baseline. Does
   * NOT call `renderer.info.reset()`; three.js manages that internally
   * via the auto-reset path.
   */
  getRendererSnapshot(): RendererSnapshot {
    const info = this.renderer.info;
    const size = this._sizeScratch;
    this.renderer.getSize(size);
    return {
      drawCalls: info.render.calls,
      triangles: info.render.triangles,
      points: info.render.points,
      lines: info.render.lines,
      geometries: info.memory.geometries,
      textures: info.memory.textures,
      programs: info.programs?.length ?? 0,
      pixelRatio: this.renderer.getPixelRatio(),
      width: size.x,
      height: size.y,
      renderPaused: this.renderPaused,
      preset: this.preset.id,
    };
  }

  private applyQualityDataAttribute(id: string): void {
    try {
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.dataset['quality'] = id;
      }
    } catch {
      /* Non-DOM contexts (tests / SSR) — ignore. */
    }
  }

  private onContextLost = (event: Event): void => {
    event.preventDefault();
    this.renderPaused = true;
    this.contextChangeCallback?.('lost');
    diagnostics.warn('context-lost', 'WebGL context lost; render paused until restoration', {
      width: this.renderer.domElement.width,
      height: this.renderer.domElement.height,
    });
  };

  private onContextRestored = (): void => {
    this.renderPaused = false;
    // Restore the drawing-buffer resolution; Three.js rebuilds GPU
    // resources lazily on the next draw, so a fresh resize is enough
    // for the framebuffer to be allocated at the right size.
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(getOptimalPixelRatio(this.preset.pixelRatioCap));
    this.renderer.setClearColor(new THREE.Color(this.wallClearColor));
    this.contextChangeCallback?.('restored');
    diagnostics.info('context-restored', 'WebGL context restored', {});
  };

  dispose(): void {
    // v0.16 — dispose idempotency. The boot path can race a context-loss
    // shutdown with a `beforeunload` cleanup; calling dispose twice must
    // not double-remove listeners or attempt to dispose an already-dead
    // GL context.
    if (this.disposed) return;
    this.disposed = true;
    const canvas = this.renderer.domElement;
    canvas.removeEventListener('webglcontextlost', this.onContextLost as EventListener, false);
    canvas.removeEventListener('webglcontextrestored', this.onContextRestored as EventListener, false);
    this.contextChangeCallback = null;
    this.renderer.dispose();
  }
}
