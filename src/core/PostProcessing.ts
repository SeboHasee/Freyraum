import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import type { QualityPreset } from '../config/quality';

export class PostProcessing {
  readonly composer: EffectComposer;
  private readonly bloomPass: UnrealBloomPass;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    preset: QualityPreset
  ) {
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

    window.addEventListener('resize', this.handleResize);
  }

  applyPreset(preset: QualityPreset): void {
    this.bloomPass.strength = preset.bloomStrength;
    this.bloomPass.radius = preset.bloomRadius;
    this.bloomPass.threshold = preset.bloomThreshold;
    this.bloomPass.enabled = preset.bloomStrength > 0;
  }

  private handleResize = (): void => {
    this.composer.setSize(window.innerWidth, window.innerHeight);
  };

  render(): void {
    this.composer.render();
  }

  dispose(): void {
    window.removeEventListener('resize', this.handleResize);
    this.composer.dispose();
  }
}
