import * as THREE from 'three';
import type { PaintingMapRole, PaintingTextureSet, ResolvedPaintingTextures } from '../materials/PaintingTextureSet';
import { createScopedDiagnostics } from '../utils/Diagnostics';

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
  private readonly diagnostics = createScopedDiagnostics('texture');
  private readonly cache = new Map<string, THREE.Texture>();
  /**
   * v0.08: Loader used only for external HTTP(S) URLs. Setting crossOrigin
   * 'anonymous' is required there to avoid tainted-canvas WebGL errors when
   * loading from a different origin, but must NOT be set for local/relative
   * paths or data URIs — in file:// protocol the browser cannot fulfill a
   * CORS request for local files, causing the texture upload to fail silently
   * and the fallback gradient to appear instead.
   */
  private readonly externalLoader: THREE.TextureLoader;
  /**
   * v0.08: Loader used for relative paths, data URIs, and file:// resources.
   * No crossOrigin attribute is set so the browser treats the image as
   * same-origin and the WebGL texture upload succeeds.
   */
  private readonly localLoader: THREE.TextureLoader;
  private maxAnisotropy = 1;
  private maxTextureSize = 0;
  private anisotropyDivisor = 1;
  /**
   * v0.08: tracks which cache keys resolved to the generated fallback texture
   * rather than the real customer image. Used by GalleryManager to emit a
   * diagnostic warning when the central 3D painting falls back.
   */
  private readonly fallbackKeys = new Set<string>();

  constructor(loadingManager: THREE.LoadingManager = THREE.DefaultLoadingManager) {
    this.externalLoader = new THREE.TextureLoader(loadingManager);
    this.localLoader = new THREE.TextureLoader(loadingManager);
    this.externalLoader.setCrossOrigin('anonymous');
    // localLoader intentionally has no crossOrigin set.
  }

  init(renderer: THREE.WebGLRenderer): void {
    this.maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    this.maxTextureSize = renderer.capabilities.maxTextureSize;
    this.diagnostics.info('capabilities', 'Texture manager initialized', {
      maxAnisotropy: this.maxAnisotropy,
      maxTextureSize: this.maxTextureSize,
    });
  }

  /**
   * Updates the anisotropy cap and reapplies it to already-cached textures.
   *
   * v0.16 — no-op guard. If the requested divisor matches the currently
   * active value we skip the cache walk entirely. Previously every
   * quality-preset re-apply (e.g. opening the preferences panel and
   * re-selecting the same preset) marked every cached texture as
   * `needsUpdate = true`, forcing a GPU re-upload on the next draw.
   */
  setAnisotropyDivisor(divisor: number): void {
    const next = Math.max(1, divisor);
    if (next === this.anisotropyDivisor) {
      this.diagnostics.debug(
        'anisotropy-noop',
        'Anisotropy divisor unchanged; skipping cache walk',
        { divisor: next, cacheSize: this.cache.size }
      );
      return;
    }
    this.anisotropyDivisor = next;
    const anisotropy = this.getEffectiveAnisotropy();
    this.cache.forEach((texture) => {
      texture.anisotropy = anisotropy;
      texture.needsUpdate = true;
    });
    this.diagnostics.debug(
      'anisotropy-applied',
      'Anisotropy divisor changed; cache marked for re-upload',
      { divisor: next, anisotropy, cacheSize: this.cache.size }
    );
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
    this.diagnostics.info('preload', `Preloading ${urls.length} albedo texture(s)`, {
      count: urls.length,
      urlTypes: urls.map((u) => this.compactUrlType(u)),
    });
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

    // v0.08: only external HTTP(S) URLs need crossOrigin='anonymous'.
    // data URIs, relative paths, and file:// URLs must NOT use crossOrigin or
    // the browser cannot supply CORS headers, marking the image as tainted and
    // preventing WebGL from uploading the texture.
    const isExternal = /^https?:\/\//i.test(url);
    const loader = isExternal ? this.externalLoader : this.localLoader;
    const urlType = this.classifyUrlType(url);

    // v0.09: never log the full data URL — it can be many megabytes. Log only
    // the MIME prefix and byte count so diagnostics are readable.
    const urlForLog = this.redactUrlForLog(url);

    this.diagnostics.debug('load-start', `Starting ${role} texture load`, {
      url: urlForLog,
      urlType,
      role,
      crossOrigin: isExternal ? 'anonymous' : 'none',
    });

    return new Promise((resolve) => {
      loader.load(
        url,
        (texture) => {
          this.prepareTexture(texture, role);
          this.cache.set(cacheKey, texture);
          const img = texture.image as HTMLImageElement | ImageBitmap | { width?: number; height?: number };
          const w = 'naturalWidth' in img ? (img.naturalWidth || img.width || 0) : (img.width || 0);
          const h = 'naturalHeight' in img ? (img.naturalHeight || img.height || 0) : (img.height || 0);
          this.warnIfOversized(role, urlForLog, urlType, w, h);
          this.diagnostics.info('load-success', `Loaded ${role} texture`, {
            url: urlForLog,
            urlType,
            width: w,
            height: h,
            fallbackUsed: false,
          });
          resolve(texture);
        },
        undefined,
        (error) => {
          this.diagnostics.warn('load-fallback', `Failed to load ${role} texture — creating generated fallback`, {
            url: urlForLog,
            urlType,
            role,
            errorMessage: error instanceof Error ? error.message : String(error),
          });
          const fallback = this.createFallbackTexture(url);
          this.cache.set(cacheKey, fallback);
          this.fallbackKeys.add(cacheKey);
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

    const rolesPresent = roles.filter((r) => !!set[r]);
    this.diagnostics.debug('preload-texture-set', `Loading authored texture set (${rolesPresent.length} role(s))`, {
      roles: rolesPresent,
    });

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
    const cacheKey = `albedo::${url}`;
    const tex = this.cache.get(cacheKey);
    if (!tex) {
      this.diagnostics.debug('cache-miss', 'Albedo cache miss — texture not preloaded for this URL', {
        url: this.redactUrlForLog(url),
        cacheSize: this.cache.size,
      });
    }
    return tex;
  }

  /** Synchronous role-aware cache hit. Returns undefined on miss (no network fetch). */
  getForRole(url: string, role: PaintingMapRole): THREE.Texture | undefined {
    return this.cache.get(`${role}::${url}`);
  }

  /**
   * v0.08: returns true if the cached texture for this URL+role is a
   * generated fallback (i.e. the real image failed to load). Used by
   * GalleryManager to emit a high-visibility diagnostic when the central
   * 3D painting silently falls back to the generated gradient.
   */
  isFallback(url: string, role: PaintingMapRole = 'albedo'): boolean {
    return this.fallbackKeys.has(`${role}::${url}`);
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

  private warnIfOversized(
    role: PaintingMapRole,
    url: string,
    urlType: ReturnType<TextureManager['classifyUrlType']>,
    width: number,
    height: number
  ): void {
    if (this.maxTextureSize <= 0 || (width <= this.maxTextureSize && height <= this.maxTextureSize)) return;
    this.diagnostics.warn('texture-oversized', 'Loaded texture exceeds device MAX_TEXTURE_SIZE', {
      role,
      url,
      urlType,
      width,
      height,
      maxTextureSize: this.maxTextureSize,
      likelyBrowserDownscale: true,
    });
  }

  private hash(value: string): number {
    let result = 0;
    for (let i = 0; i < value.length; i += 1) {
      result = (result * 31 + value.charCodeAt(i)) >>> 0;
    }
    return result;
  }

  /**
   * Keeps URL classification consistent across preload/load/get diagnostics.
   * We intentionally distinguish data URIs because they must never be printed
   * in full (can be many MB of base64 payload).
   */
  private classifyUrlType(url: string): 'data-uri' | 'external-http' | 'local-relative' {
    if (url.startsWith('data:')) return 'data-uri';
    if (/^https?:\/\//i.test(url)) return 'external-http';
    return 'local-relative';
  }

  /** Compact URL-type label used in preload summary logs. */
  private compactUrlType(url: string): string {
    const type = this.classifyUrlType(url);
    if (type === 'external-http') return 'http';
    if (type === 'local-relative') return 'local';
    return `data-uri:${this.dataUriMime(url)}`;
  }

  /** Redacts data URLs to avoid logging large base64 payloads. */
  private redactUrlForLog(url: string): string {
    if (this.classifyUrlType(url) !== 'data-uri') return url;
    return `[data-uri:${this.dataUriMime(url)}:${url.length}bytes]`;
  }

  /** Extracts MIME from data URI (fallback: unknown). */
  private dataUriMime(url: string): string {
    const semicolon = url.indexOf(';');
    if (semicolon <= 5) return 'unknown';
    return url.slice(5, semicolon);
  }
}
