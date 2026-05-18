import * as THREE from 'three';
import { getOptimalPixelRatio } from '../utils/performance';
import { createScopedDiagnostics } from '../utils/Diagnostics';
import type { QualityPreset } from '../config/quality';

const diagnostics = createScopedDiagnostics('renderer');

export class RendererManager {
  readonly renderer: THREE.WebGLRenderer;
  private preset: QualityPreset;
  private renderPaused = false;

  constructor(container: HTMLElement, preset: QualityPreset) {
    this.preset = preset;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });

    this.renderer.setPixelRatio(getOptimalPixelRatio(preset.pixelRatioCap));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.45;
    this.renderer.setClearColor(0xdfe5e9);
    this.renderer.shadowMap.enabled = preset.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
  }

  resize(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(getOptimalPixelRatio(this.preset.pixelRatioCap));
  }

  /** v0.11 — `true` while the WebGL context is lost; the render loop
   *  should skip drawing during this window. */
  isRenderPaused(): boolean {
    return this.renderPaused;
  }

  private onContextLost = (event: Event): void => {
    event.preventDefault();
    this.renderPaused = true;
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
    diagnostics.info('context-restored', 'WebGL context restored', {});
  };

  dispose(): void {
    const canvas = this.renderer.domElement;
    canvas.removeEventListener('webglcontextlost', this.onContextLost as EventListener, false);
    canvas.removeEventListener('webglcontextrestored', this.onContextRestored as EventListener, false);
    this.renderer.dispose();
  }
}
