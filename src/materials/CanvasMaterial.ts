import * as THREE from 'three';
import type { QualityPreset } from '../config/quality';

export class CanvasMaterial {
  private normalTexture: THREE.Texture | null = null;
  private frameNormalTexture: THREE.Texture | null = null;

  async loadNormalTexture(): Promise<THREE.Texture> {
    if (this.normalTexture) return this.normalTexture;

    const canvas = document.createElement('canvas');
    // 128×128 keeps procedural generation cheap while repeating cleanly across the artwork surface.
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      const texture = new THREE.Texture();
      this.normalTexture = texture;
      return texture;
    }

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let y = 0; y < canvas.height; y += 1) {
      for (let x = 0; x < canvas.width; x += 1) {
        const fiberX = Math.sin(x * 0.42) * 10;
        const fiberY = Math.cos(y * 0.38) * 10;
        const weave = Math.sin((x + y) * 0.11) * 4;
        const value = fiberX + fiberY + weave;
        const index = (y * canvas.width + x) * 4;

        data[index] = 128 + value;
        data[index + 1] = 128 - value;
        data[index + 2] = 255;
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(18, 18);
    texture.needsUpdate = true;
    this.normalTexture = texture;

    return texture;
  }

  createArtworkMaterial(
    normalTexture: THREE.Texture,
    map?: THREE.Texture
  ): THREE.MeshPhysicalMaterial {
    const mat = new THREE.MeshPhysicalMaterial({
      map: map ?? null,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(0.12, 0.12),
      roughness: 0.88,
      metalness: 0,
      clearcoat: 0.04,
    });
    return mat;
  }

  private getFrameNormalTexture(): THREE.Texture {
    if (this.frameNormalTexture) return this.frameNormalTexture;

    const size = 128;
    const data = new Uint8Array(size * size * 4);
    const frequency = 0.6;
    const amplitude = 12;

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = (y * size + x) * 4;
        const groove = Math.sin(x * frequency) * amplitude;
        const noise = (Math.random() - 0.5) * 4;
        data[idx + 0] = 128;
        data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 + groove + noise)));
        data[idx + 2] = 255;
        data[idx + 3] = 255;
      }
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.colorSpace = THREE.LinearSRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(12, 1);
    texture.needsUpdate = true;
    this.frameNormalTexture = texture;
    return texture;
  }

  createFrameMaterial(preset: QualityPreset): THREE.MeshPhysicalMaterial {
    const frameNormal = this.getFrameNormalTexture();
    return new THREE.MeshPhysicalMaterial({
      color: 0xe8eaeb,
      roughness: preset.frameRoughness,
      metalness: 1.0,
      clearcoat: preset.frameClearcoat,
      clearcoatRoughness: 0.2,
      anisotropy: preset.frameAnisotropy,
      anisotropyRotation: Math.PI / 2,
      normalMap: frameNormal,
      normalScale: new THREE.Vector2(0.08, 0.08),
    });
  }

  dispose(): void {
    this.normalTexture?.dispose();
    this.frameNormalTexture?.dispose();
  }
}
