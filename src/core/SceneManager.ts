import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export class SceneManager {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  private environmentTarget: THREE.WebGLRenderTarget | null = null;

  constructor(renderer: THREE.WebGLRenderer) {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = 7;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment(renderer);
    this.environmentTarget = pmremGenerator.fromScene(roomEnv);
    this.scene.environment = this.environmentTarget.texture;
    this.scene.environmentIntensity = 0.55;
    pmremGenerator.dispose();
    roomEnv.dispose();
  }

  /**
   * v0.16 — single resize coordinator.
   *
   * Before v0.16 this class owned its own `window.resize` listener that
   * ran immediately (no debounce). On a mobile orientation change the
   * browser fires multiple rapid resize events, each causing a redundant
   * camera matrix rebuild before the debounced coordinator in `main.ts`
   * could even run. The coordinator now debounces resize, schedules a
   * single rAF, and calls this method once with the measured viewport.
   */
  updateAspect(width: number, height: number): void {
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    this.environmentTarget?.dispose();
    this.environmentTarget = null;
    /* v0.16: no listeners owned by SceneManager. */
  }
}
