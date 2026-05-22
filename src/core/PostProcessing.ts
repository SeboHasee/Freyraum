import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import type { QualityPreset } from '../config/quality';

export class PostProcessing {
  readonly composer: EffectComposer;
  private readonly bloomPass: UnrealBloomPass;
  // v0.27 W-06: FXAA pass restores edge quality lost when EffectComposer
  // renders to an internal WebGLRenderTarget (bypassing native antialias:true).
  private readonly fxaaPass: ShaderPass;
  private readonly renderer: THREE.WebGLRenderer;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    preset: QualityPreset
  ) {
    this.renderer = renderer;
    this.composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      preset.bloomStrength,
      preset.bloomRadius,
      preset.bloomThreshold
    );
    this.bloomPass.enabled = preset.bloomStrength > 0;
    this.composer.addPass(this.bloomPass);

    // v0.27 W-06: append FXAA as final post-process pass.
    this.fxaaPass = new ShaderPass(FXAAShader);
    this.applyFXAAResolution(window.innerWidth, window.innerHeight);
    this.fxaaPass.enabled = preset.fxaaEnabled ?? true;
    this.composer.addPass(this.fxaaPass);

    // v0.37: OutputPass applies tone mapping + linear→sRGB color space
    // conversion for the final canvas output. Without this, when any
    // ShaderPass (bloom/FXAA) is the last enabled pass, linear values are
    // written directly to the sRGB canvas — causing darker, contrast-shifted
    // rendering on high and balanced presets (where bloom/FXAA are active).
    // Battery mode was unaffected because only RenderPass ran, and
    // renderer.render() handles the conversion internally.
    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);
  }

  applyPreset(preset: QualityPreset): void {
    this.bloomPass.strength = preset.bloomStrength;
    this.bloomPass.radius = preset.bloomRadius;
    this.bloomPass.threshold = preset.bloomThreshold;
    this.bloomPass.enabled = preset.bloomStrength > 0;
    // v0.27 W-06: reflect preset fxaaEnabled flag on preset switch.
    this.fxaaPass.enabled = preset.fxaaEnabled ?? true;
  }

  /**
   * v0.16 — single resize coordinator. Composer framebuffer reallocations
   * are expensive on mobile GPUs; they now happen at most once per
   * debounce window, driven from the resize coordinator in `main.ts`.
   */
  resize(width: number, height: number): void {
    this.composer.setSize(Math.max(1, width), Math.max(1, height));
    // v0.27 W-06: keep FXAA resolution uniform in sync with canvas size.
    this.applyFXAAResolution(width, height);
  }

  /**
   * v0.27 W-04: Force-compile all EffectComposer pass shader programs before
   * the loading overlay is dismissed. Shrinks the composer to 4×4, renders
   * one frame (causing lazy shader compilation), then restores the full size.
   * The canvas is covered by the loading overlay during this call so the
   * 4×4 render is never visible to the user.
   */
  prewarmComposer(width: number, height: number): void {
    try {
      this.resize(4, 4);
      this.composer.render();
    } finally {
      this.resize(width, height);
    }
  }

  render(): void {
    this.composer.render();
  }

  dispose(): void {
    this.composer.dispose();
  }

  // ── private helpers ───────────────────────────────────────────────────────

  /**
   * v0.27 W-06: Update FXAA resolution uniform. Must be called on every
   * resize so the shader operates in pixel-space with the correct texel size.
   */
  private applyFXAAResolution(w: number, h: number): void {
    const pr = this.renderer.getPixelRatio();
    this.fxaaPass.material.uniforms['resolution'].value.set(1 / (w * pr), 1 / (h * pr));
  }
}

