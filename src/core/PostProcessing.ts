import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export class PostProcessing {
  readonly composer: EffectComposer;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera
  ) {
    this.composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.12,
      0.4,
      1.1
    );
    this.composer.addPass(bloomPass);

    window.addEventListener('resize', this.handleResize);
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
