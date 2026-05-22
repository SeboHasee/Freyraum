import * as THREE from 'three';
import type { QualityPreset } from '../config/quality';

export class CanvasMaterial {
  private normalTexture: THREE.Texture | null = null;
  private frameNormalTexture: THREE.DataTexture | null = null;
  private frameRoughnessTexture: THREE.DataTexture | null = null;

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

  // ── v0.43 noise-based realistic brushed-metal frame textures ─────────────

  /**
   * Bilinear value noise. Returns a smooth 0..1 value at (x, y) for the
   * given integer seed. Identical implementation to ProceduralTextureFactory
   * so the two classes can share the same deterministic lattice.
   */
  private latticeHash(ix: number, iy: number, seed: number): number {
    let h = (seed * 1664525 + ix * 1013904223) >>> 0;
    h = (h ^ (iy * 1540483477)) >>> 0;
    h = (h ^ (h >>> 16)) >>> 0;
    h = Math.imul(h, 0x45d9f3b) >>> 0;
    h = (h ^ (h >>> 16)) >>> 0;
    return (h >>> 0) / 0xffffffff;
  }

  private valueNoise2d(x: number, y: number, seed: number): number {
    const xi = Math.floor(x) | 0;
    const yi = Math.floor(y) | 0;
    const xf = x - xi;
    const yf = y - yi;
    const ux = xf * xf * (3 - 2 * xf);
    const uy = yf * yf * (3 - 2 * yf);
    const h00 = this.latticeHash(xi,     yi,     seed);
    const h10 = this.latticeHash(xi + 1, yi,     seed);
    const h01 = this.latticeHash(xi,     yi + 1, seed);
    const h11 = this.latticeHash(xi + 1, yi + 1, seed);
    return (
      h00 * (1 - ux) * (1 - uy) +
      h10 * ux       * (1 - uy) +
      h01 * (1 - ux) * uy       +
      h11 * ux       * uy
    );
  }

  /**
   * Anisotropic height field for brushed-metal scratches.
   * Low X-frequency = long horizontal streaks.
   * Higher Y-frequency = fine cross-section detail within each rail strip.
   * Two octaves keep the generation fast while covering both fine and broad variation.
   */
  private scratchHeight(x: number, y: number, seed: number): number {
    const fine = this.valueNoise2d(x * 0.006, y * 0.25, seed)        * 0.60;
    const mid  = this.valueNoise2d(x * 0.002, y * 0.08, seed + 37)   * 0.40;
    return fine + mid;
  }

  /**
   * Brushed-metal normal map derived from the anisotropic scratch height field
   * via finite differences. Both Nx (R) and Ny (G) are computed so the surface
   * responds correctly to light from any angle. Mipmaps and linear filtering
   * prevent the aliasing (pixelation) that occurred with NearestFilter defaults.
   */
  private makeFrameNormalTexture(seed: number): THREE.DataTexture {
    const size = 256;
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = (y * size + x) * 4;
        // Finite-difference surface gradient → tangent-space normals
        const h  = this.scratchHeight(x,     y,     seed);
        const hx = this.scratchHeight(x + 1, y,     seed);
        const hy = this.scratchHeight(x,     y + 1, seed);
        const nx = (h - hx) * 100;
        const ny = (h - hy) * 100;
        data[idx + 0] = Math.max(0, Math.min(255, (128 + nx) | 0));
        data[idx + 1] = Math.max(0, Math.min(255, (128 + ny) | 0));
        data[idx + 2] = 255;
        data[idx + 3] = 255;
      }
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.colorSpace = THREE.LinearSRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // v0.42 fix: world-space UVs from ExtrudeGeometry — repeat.set(1,1) for natural tiling.
    texture.repeat.set(1, 1);
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * Roughness map derived from the same anisotropic noise.
   * withMacroDrift adds a second broad octave so high/balanced presets show
   * smooth roughness gradients along the rails, not uniform flat grey.
   */
  private makeFrameRoughnessTexture(seed: number, withMacroDrift: boolean): THREE.DataTexture {
    const size = 128;
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = (y * size + x) * 4;
        const fine  = this.valueNoise2d(x * 0.006, y * 0.25, seed + 200)  * 0.28;
        const drift = withMacroDrift
          ? this.valueNoise2d(x * 0.002, y * 0.06, seed + 250) * 0.14
          : 0;
        const v = 0.48 + fine + drift;
        const r = Math.max(0, Math.min(255, (v * 255) | 0));
        data[idx + 0] = r;
        data[idx + 1] = r;
        data[idx + 2] = r;
        data[idx + 3] = 255;
      }
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.colorSpace = THREE.LinearSRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * P-02: Creates the initial frame material with seeded textures.
   * Each artwork receives a distinct seed so frame surfaces never appear
   * phase-aligned across the gallery wall. Seed 0 is deterministic and
   * stable across page loads.
   */
  createFrameMaterial(preset: QualityPreset, seed = 0): THREE.MeshPhysicalMaterial {
    const withMacroDrift = preset.id !== 'battery';
    const frameNormal = this.makeFrameNormalTexture(seed);
    const frameRoughness = this.makeFrameRoughnessTexture(seed, withMacroDrift);
    // Dispose any previously tracked textures before replacing them.
    this.frameNormalTexture?.dispose();
    this.frameRoughnessTexture?.dispose();
    this.frameNormalTexture = frameNormal;
    this.frameRoughnessTexture = frameRoughness;

    // P-06: diagnostic log so the active frame configuration is visible in the console.
    console.debug('[CanvasMaterial] frame-material-created', {
      preset: preset.id, seed, macroDrift: withMacroDrift,
      frameRoughness: preset.frameRoughness, frameAnisotropy: preset.frameAnisotropy,
    });

    return new THREE.MeshPhysicalMaterial({
      color: 0xe8eaeb,
      roughness: preset.frameRoughness,
      roughnessMap: frameRoughness,
      metalness: 1.0,
      clearcoat: preset.frameClearcoat,
      clearcoatRoughness: 0.2,
      anisotropy: preset.frameAnisotropy,
      anisotropyRotation: Math.PI / 2,
      normalMap: frameNormal,
      normalScale: new THREE.Vector2(0.40, 0.40),
    });
  }

  /**
   * P-02: Updates the existing frame material's normal and roughness textures
   * in-place for a new artwork seed. Called by ArtworkMesh when navigating
   * to a different artwork so the frame surface phase changes without
   * disposing the material or re-uploading geometry.
   */
  refreshFrameTextures(material: THREE.MeshPhysicalMaterial, preset: QualityPreset, seed: number): void {
    const withMacroDrift = preset.id !== 'battery';
    const newNormal = this.makeFrameNormalTexture(seed);
    const newRoughness = this.makeFrameRoughnessTexture(seed, withMacroDrift);
    this.frameNormalTexture?.dispose();
    this.frameRoughnessTexture?.dispose();
    this.frameNormalTexture = newNormal;
    this.frameRoughnessTexture = newRoughness;
    material.normalMap = newNormal;
    material.roughnessMap = newRoughness;
    material.needsUpdate = true;
    console.debug('[CanvasMaterial] frame-textures-refreshed', {
      preset: preset.id, seed, macroDrift: withMacroDrift,
    });
  }

  dispose(): void {
    this.normalTexture?.dispose();
    this.frameNormalTexture?.dispose();
    this.frameRoughnessTexture?.dispose();
  }
}
