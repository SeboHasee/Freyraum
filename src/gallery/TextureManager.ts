import * as THREE from 'three';
import type { PaintingMapRole, PaintingTextureSet, ResolvedPaintingTextures } from '../materials/PaintingTextureSet';

/**
 * Texture manager owns network-loaded textures and is solely responsible for
 * disposing them. Material classes may reference these textures but must
 * never dispose them.
 *
 * v0.02 adds:
 * - `loadForRole(url, role)` — applies the correct colour space per role.
 * - `preloadTextureSet(set, divisor)` — loads a full painting texture set.
 * - per-preset anisotropy cap via `setAnisotropyDivisor(divisor)`.
 */
export class TextureManager {
  private readonly cache = new Map<string, THREE.Texture>();
  private readonly loader = new THREE.TextureLoader();
  private maxAnisotropy = 1;
  private anisotropyDivisor = 1;

  constructor() {
    this.loader.setCrossOrigin('anonymous');
  }

  init(renderer: THREE.WebGLRenderer): void {
    this.maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  }

  /** Updates the anisotropy cap and reapplies it to already-cached textures. */
  setAnisotropyDivisor(divisor: number): void {
    this.anisotropyDivisor = Math.max(1, divisor);
    const anisotropy = this.getEffectiveAnisotropy();
    this.cache.forEach((texture) => {
      texture.anisotropy = anisotropy;
      texture.needsUpdate = true;
    });
  }

  /**
   * v0.06: returns the per-texture anisotropy currently applied to all cached
   * textures. Exposed so `ProceduralTextureFactory` can mirror the same cap on
   * its `DataTexture` cache (otherwise procedural maps default to anisotropy=1
   * and alias into coarse mips under raking light at steep angles).
   */
  getEffectiveAnisotropy(): number {
    return Math.max(1, Math.floor(this.maxAnisotropy / this.anisotropyDivisor));
  }

  async preload(urls: string[]): Promise<void> {
    await Promise.all(urls.map((url) => this.load(url)));
  }

  /** Default loader: treats the texture as an sRGB albedo / preview image. */
  load(url: string): Promise<THREE.Texture> {
    return this.loadForRole(url, 'albedo');
  }

  /** Role-aware loader. Sets colour space and wrapping appropriate to the role. */
  loadForRole(url: string, role: PaintingMapRole): Promise<THREE.Texture> {
    const cacheKey = `${role}::${url}`;
    if (this.cache.has(cacheKey)) {
      return Promise.resolve(this.cache.get(cacheKey)!);
    }

    return new Promise((resolve) => {
      this.loader.load(
        url,
        (texture) => {
          this.prepareTexture(texture, role);
          this.cache.set(cacheKey, texture);
          resolve(texture);
        },
        undefined,
        () => {
          const fallback = this.createFallbackTexture(url);
          this.cache.set(cacheKey, fallback);
          resolve(fallback);
        }
      );
    });
  }

  /**
   * Loads a {@link PaintingTextureSet}. Missing roles are returned as undefined
   * so the caller (typically GalleryManager) can fall back to procedural maps.
   */
  async preloadTextureSet(set: PaintingTextureSet | undefined): Promise<Partial<ResolvedPaintingTextures>> {
    if (!set) return {};

    const roles: PaintingMapRole[] = [
      'albedo',
      'normal',
      'detailNormal',
      'height',
      'roughness',
      'specular',
      'ao',
      'varnish',
    ];

    const results: Partial<ResolvedPaintingTextures> = {};
    await Promise.all(
      roles.map(async (role) => {
        const entry = set[role];
        if (!entry) return;
        const tex = await this.loadForRole(entry.url, role);
        results[role] = tex;
      })
    );
    return results;
  }

  /** Backwards-compatible getter — returns the default-role (`albedo`) cache entry. */
  get(url: string): THREE.Texture | undefined {
    return this.cache.get(`albedo::${url}`);
  }

  dispose(): void {
    this.cache.forEach((tex) => tex.dispose());
    this.cache.clear();
  }

  private prepareTexture(texture: THREE.Texture, role: PaintingMapRole): void {
    if (role === 'albedo') {
      texture.colorSpace = THREE.SRGBColorSpace;
    } else {
      // All non-albedo maps carry linear data (normals, heights, masks).
      texture.colorSpace = THREE.LinearSRGBColorSpace;
    }

    if (role === 'detailNormal') {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    }

    const anisotropy = Math.max(1, Math.floor(this.maxAnisotropy / this.anisotropyDivisor));
    texture.anisotropy = anisotropy;
    texture.needsUpdate = true;
  }

  private createFallbackTexture(seed: string): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const hue = this.hash(seed) % 32;
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${205 + hue}, 18%, 92%)`);
      gradient.addColorStop(0.55, `hsl(${35 + hue}, 22%, 78%)`);
      gradient.addColorStop(1, `hsl(${205 + hue}, 12%, 62%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255,255,255,0.34)';
      ctx.lineWidth = 28;
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.08, canvas.height * 0.28);
      ctx.bezierCurveTo(
        canvas.width * 0.35,
        canvas.height * 0.08,
        canvas.width * 0.58,
        canvas.height * 0.32,
        canvas.width * 0.9,
        canvas.height * 0.22
      );
      ctx.stroke();

      ctx.fillStyle = 'rgba(17,24,29,0.16)';
      ctx.font = '700 58px Inter, Arial, sans-serif';
      ctx.fillText('FREYRAUM', 96, canvas.height - 96);
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.prepareTexture(texture, 'albedo');
    return texture;
  }

  private hash(value: string): number {
    let result = 0;
    for (let i = 0; i < value.length; i += 1) {
      result = (result * 31 + value.charCodeAt(i)) >>> 0;
    }
    return result;
  }
}
