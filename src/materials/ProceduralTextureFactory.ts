import * as THREE from 'three';
import type { PaintingMapRole } from './PaintingTextureSet';

/**
 * Deterministic procedural texture generator for the v0.02 painting material.
 *
 * Generates believable canvas/brush relief, roughness, and specular maps so
 * the gallery looks correct without any authored scanned assets. The factory
 * owns every texture it creates and is solely responsible for disposing them.
 *
 * Aspect-ratio note: the factory itself produces square tiles. Aspect-aware
 * tiling is applied by the consumer (via `repeat` and `uDetailTiling`) using
 * the artwork's world-space width/height, so a portrait, landscape, square,
 * or ultrawide painting all show square canvas weave at the same physical
 * thread density.
 */
export class ProceduralTextureFactory {
  private readonly cache = new Map<string, THREE.Texture>();

  /** Returns (and caches) the procedural texture for an artwork+role. */
  generate(artworkId: string, role: PaintingMapRole): THREE.Texture {
    const cacheKey = `${artworkId}::${role}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const seed = this.hash(artworkId);
    let tex: THREE.Texture;
    switch (role) {
      case 'normal':
        tex = this.generateNormal(seed, 256, 14, 6, 3, 0.42);
        break;
      case 'detailNormal':
        tex = this.generateNormal(seed * 7 + 13, 256, 18, 7, 2.5, 1.1);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        break;
      case 'height':
        tex = this.generateHeight(seed);
        break;
      case 'roughness':
        tex = this.generateRoughness(seed);
        break;
      case 'specular':
        tex = this.generateSpecular(seed);
        break;
      case 'ao':
        tex = this.generateAO(seed);
        break;
      case 'albedo':
      default:
        tex = this.generateAlbedo(seed);
        break;
    }

    this.cache.set(cacheKey, tex);
    return tex;
  }

  /** Disposes every generated texture. Call only on application shutdown. */
  disposeAll(): void {
    this.cache.forEach((tex) => tex.dispose());
    this.cache.clear();
  }

  // ── Map generators ────────────────────────────────────────────────────────

  /**
   * Tangent-space normal map. Pseudocode follows §Procedural Map Generation
   * in plan.md. RGB encodes (Nx, Ny, Nz) packed to [0..1].
   * Frequencies chosen so the texture has clean canvas-weave appearance.
   */
  private generateNormal(
    seed: number,
    size: number,
    oct1Amp: number,
    oct2Amp: number,
    weaveAmp: number,
    freqScale: number
  ): THREE.Texture {
    const data = new Uint8Array(size * size * 4);
    const offset = ((seed % 100) / 100) * Math.PI * 2;

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = (y * size + x) * 4;

        const oct1 = Math.sin(x * 0.42 * freqScale + offset) * Math.cos(y * 0.38 * freqScale) * oct1Amp;
        const oct2 = Math.sin(x * 0.19 * freqScale + offset * 2) * Math.cos(y * 0.22 * freqScale) * oct2Amp;
        const weave = Math.sin((x + y) * 0.11 * freqScale) * weaveAmp;
        const v = oct1 + oct2 + weave;

        data[idx + 0] = this.clamp8(128 + v);
        data[idx + 1] = this.clamp8(128 - v);
        data[idx + 2] = 255;
        data[idx + 3] = 255;
      }
    }

    return this.makeDataTexture(data, size, size, /* sRGB */ false);
  }

  /** Grayscale R-channel height. Horizontal brush strokes + cross-hatch + tooth grain. */
  private generateHeight(seed: number): THREE.Texture {
    const size = 256;
    const data = new Uint8Array(size * size * 4);
    const o1 = (seed % 64) * 0.05;
    const o2 = (seed % 32) * 0.07;

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = (y * size + x) * 4;
        const stroke = Math.abs(Math.sin(y * 0.12 + o1)) * 80;
        const cross = Math.abs(Math.sin(x * 0.09 + o2)) * 30;
        const tooth = Math.sin(x * 1.4) * Math.sin(y * 1.6) * 12;
        const h = this.clamp8(stroke + cross + tooth);
        data[idx + 0] = h;
        data[idx + 1] = h;
        data[idx + 2] = h;
        data[idx + 3] = 255;
      }
    }

    return this.makeDataTexture(data, size, size, false);
  }

  /** Low-frequency varnish-style roughness in the [60..220] range. */
  private generateRoughness(seed: number): THREE.Texture {
    const size = 128;
    const data = new Uint8Array(size * size * 4);
    const o = ((seed % 50) / 50) * 0.8;

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = (y * size + x) * 4;
        const n1 = (Math.sin(x * 0.09 + o) * Math.cos(y * 0.07)) * 0.5 + 0.5;
        const n2 = (Math.sin(x * 0.21 + 1.3) * Math.cos(y * 0.18 + 0.7)) * 0.5 + 0.5;
        const combined = n1 * 0.7 + n2 * 0.3;
        const r = this.clamp8(60 + combined * 160);
        data[idx + 0] = r;
        data[idx + 1] = r;
        data[idx + 2] = r;
        data[idx + 3] = 255;
      }
    }

    return this.makeDataTexture(data, size, size, false);
  }

  /** Mostly dark specular with a handful of Gaussian "varnish pooling" blobs. */
  private generateSpecular(seed: number): THREE.Texture {
    const size = 128;
    const data = new Uint8Array(size * size * 4);

    // Baseline near-zero specular response.
    for (let i = 0; i < size * size; i += 1) {
      data[i * 4 + 0] = 12;
      data[i * 4 + 1] = 12;
      data[i * 4 + 2] = 12;
      data[i * 4 + 3] = 255;
    }

    // Sparse Gaussian blobs at hash-determined positions.
    const blobCount = 4 + (seed % 4);
    for (let b = 0; b < blobCount; b += 1) {
      const cx = ((seed * (b + 7)) % size);
      const cy = ((seed * (b + 13) * 3) % size);
      const radius = 14 + ((seed * (b + 1)) % 18);

      for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
          const dx = x - cx;
          const dy = y - cy;
          const distSq = dx * dx + dy * dy;
          const blob = Math.exp(-distSq / (radius * radius)) * 200;
          const idx = (y * size + x) * 4;
          const r = this.clamp8(data[idx] + blob);
          data[idx + 0] = r;
          data[idx + 1] = r;
          data[idx + 2] = r;
        }
      }
    }

    return this.makeDataTexture(data, size, size, false);
  }

  /** Soft vignetted ambient-occlusion suggestion (darker edges, lighter centre). */
  private generateAO(seed: number): THREE.Texture {
    const size = 256;
    const data = new Uint8Array(size * size * 4);
    const o = ((seed % 64) / 64) * 0.4;
    const half = size / 2;

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = (y * size + x) * 4;
        const nx = (x - half) / half;
        const ny = (y - half) / half;
        const r2 = nx * nx + ny * ny;
        const vignette = 1 - Math.min(1, r2 * 0.55);
        const fine = Math.sin(x * 0.13 + o) * Math.cos(y * 0.11) * 0.05;
        const v = this.clamp8((vignette + fine) * 255);
        data[idx + 0] = v;
        data[idx + 1] = v;
        data[idx + 2] = v;
        data[idx + 3] = 255;
      }
    }

    return this.makeDataTexture(data, size, size, false);
  }

  /** Neutral fallback albedo (very rarely used — `Artwork.image` provides the real picture). */
  private generateAlbedo(seed: number): THREE.Texture {
    const size = 64;
    const data = new Uint8Array(size * size * 4);
    const hue = seed % 32;
    const baseR = 200 + ((hue * 3) % 30);
    const baseG = 200 + ((hue * 5) % 30);
    const baseB = 200 + ((hue * 7) % 30);
    for (let i = 0; i < size * size; i += 1) {
      data[i * 4 + 0] = baseR;
      data[i * 4 + 1] = baseG;
      data[i * 4 + 2] = baseB;
      data[i * 4 + 3] = 255;
    }
    return this.makeDataTexture(data, size, size, /* sRGB */ true);
  }

  // ── Utilities ─────────────────────────────────────────────────────────────

  private makeDataTexture(
    data: Uint8Array,
    width: number,
    height: number,
    srgb: boolean
  ): THREE.DataTexture {
    const tex = new THREE.DataTexture(
      // newer TS lib types tighten Uint8Array<ArrayBufferLike>; cast through
      // an explicit ArrayBuffer-backed view to satisfy the DataTexture sig.
      data as unknown as ArrayBufferView<ArrayBuffer>,
      width,
      height,
      THREE.RGBAFormat,
      THREE.UnsignedByteType
    );
    tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.minFilter = THREE.LinearMipMapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;
    return tex;
  }

  private clamp8(value: number): number {
    if (value < 0) return 0;
    if (value > 255) return 255;
    return value | 0;
  }

  private hash(value: string): number {
    let result = 0;
    for (let i = 0; i < value.length; i += 1) {
      result = (result * 31 + value.charCodeAt(i)) >>> 0;
    }
    return result || 1;
  }
}
