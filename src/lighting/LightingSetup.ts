import * as THREE from 'three';
import type { QualityPreset } from '../config/quality';

export class LightingSetup {
  private readonly spotlight: THREE.SpotLight;
  private readonly pointLight: THREE.PointLight;
  private readonly ambientLight: THREE.AmbientLight;
  private animate = true;

  constructor(scene: THREE.Scene, preset: QualityPreset) {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(this.ambientLight);

    this.spotlight = new THREE.SpotLight(0xffffff, 150);
    this.spotlight.distance = 80;
    this.spotlight.angle = 0.42;
    this.spotlight.penumbra = 0.9;
    this.spotlight.decay = 1.8;
    this.spotlight.position.set(-10, 5, 7);
    this.spotlight.castShadow = preset.shadows;
    scene.add(this.spotlight);

    this.pointLight = new THREE.PointLight(0xffffff, 8, 30);
    this.pointLight.position.set(5, -2, 6);
    scene.add(this.pointLight);
  }

  applyPreset(preset: QualityPreset): void {
    this.spotlight.castShadow = preset.shadows;
  }

  setAnimated(animate: boolean): void {
    this.animate = animate;
  }

  update(time: number): void {
    if (!this.animate) return;
    this.spotlight.position.x = -10 + Math.sin(time * 0.0002) * 0.6;
  }

  dispose(): void {
    this.ambientLight.dispose();
    this.spotlight.dispose();
    this.pointLight.dispose();
  }
}
