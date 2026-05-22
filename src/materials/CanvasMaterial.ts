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

  // ── v0.40 multi-scale seeded frame texture generators ────────────────────

  /**
   * P-01: Three-layer brushed normal map. Each layer has a distinct spatial
   * frequency so two visual bands are always visible under a normal-map debug
   * overlay. The seed offsets every layer's phase so adjacent artworks never
   * show a phase-aligned surface.
   */
  private makeFrameNormalTexture(seed: number): THREE.DataTexture {
    const size = 256;
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = (y * size + x) * 4;
        // Layer 1: fine brushed grain (high frequency, low amplitude)
        const fineBrush = Math.sin(x * 0.18 + seed * 0.37) * 0.20;
        // Layer 2: mid-frequency streak modulation
        const midDrift  = Math.sin(x * 0.07 + seed * 0.71) * 0.25;
        // Layer 3: 1-D low-frequency warp (removes cadence during slow pan)
        const macroWarp = Math.sin(x * 0.021 + seed * 1.13) * 0.15;
        // Layer 4: cross-grain component — subtle Y variation breaks the pure-stripe pattern
        const crossGrain = Math.sin(y * 0.13 + seed * 0.61) * 0.07;
        const combined  = 0.5 + fineBrush + midDrift + macroWarp + crossGrain;
        data[idx + 0] = 128;
        data[idx + 1] = Math.max(0, Math.min(255, Math.round(combined * 255)));
        data[idx + 2] = 255;
        data[idx + 3] = 255;
      }
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.colorSpace = THREE.LinearSRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // v0.42 fix: ExtrudeGeometry uses WorldUVGenerator — UV coords are raw world values
    // (not normalised 0-1). The ring shape spans ~4.4 world units in X. With repeat=1
    // that gives ~4 grain cycles across the frame width — natural, non-repetitive.
    // The previous value of 12 produced 12 × 4.4 = 52.8 cycles = the dense stripe artifact.
    texture.repeat.set(1, 1);
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * P-01/P-03: Two-layer roughness map. Fine variation keeps per-pixel
   * micro-surface alive; macro drift (non-battery only) eliminates the
   * repetitive cadence visible under slow camera pan. Both layers are seeded
   * so phase never aligns across adjacent frames.
   */
  private makeFrameRoughnessTexture(seed: number, withMacroDrift: boolean): THREE.DataTexture {
    const size = 128;
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = (y * size + x) * 4;
        // Fine variation (primary roughness band)
        const fineLine   = Math.sin(x * 0.22 + seed * 0.53) * 0.35;
        // Macro drift layer -- broad, very subtle (P-03: +-0.05 roughness swing)
        const macroDrift = withMacroDrift ? Math.sin(x * 0.04 + seed * 0.89) * 0.12 : 0;
        // Cross-grain micro-roughness row variation — breaks the pure column-stripe look
        const fineCross  = Math.sin(y * 0.17 + seed * 0.47) * 0.05;
        const v = 0.5 + fineLine + macroDrift + fineCross;
        // Additional low-frequency breakup from P-03 formula
        const driftSwing = withMacroDrift
          ? Math.round(
              (Math.sin(x * 0.098 + seed * 1.17) * 0.5 + Math.sin(x * 0.041 + seed * 0.63) * 0.3) * 18
            )
          : 0;
        const roughness = Math.max(0, Math.min(255, Math.round(v * 255) + driftSwing));
        data[idx + 0] = roughness;
        data[idx + 1] = roughness;
        data[idx + 2] = roughness;
        data[idx + 3] = 255;
      }
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.colorSpace = THREE.LinearSRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // v0.42 fix: match normal map — repeat.set(1,1) for world-space UV coords from ExtrudeGeometry.
    texture.repeat.set(1, 1);
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
      normalScale: new THREE.Vector2(0.08, 0.08),
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
