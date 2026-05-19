import * as THREE from 'three';

export class SceneManager {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;

  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = 7;
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
    /* v0.16: no listeners owned by SceneManager. */
  }
}
