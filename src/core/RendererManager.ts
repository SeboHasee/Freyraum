import * as THREE from 'three';
import { getOptimalPixelRatio } from '../utils/performance';
import type { QualityPreset } from '../config/quality';

export class RendererManager {
  readonly renderer: THREE.WebGLRenderer;
  private preset: QualityPreset;

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

    container.appendChild(this.renderer.domElement);
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

  dispose(): void {
    this.renderer.dispose();
  }
}
