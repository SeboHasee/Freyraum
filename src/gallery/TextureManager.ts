import * as THREE from 'three';
import type { Artwork } from '../config/artworks';
import type { PaintingMapRole, PaintingTextureSet, ResolvedPaintingTextures } from '../materials/PaintingTextureSet';
import { createScopedDiagnostics } from '../utils/Diagnostics';
import {
  redactArtworkImageUrlForLog,
  resolveArtworkImageSources,
  type ArtworkImageSourceMode,
  type ArtworkImageUrlType,
} from '../utils/artworkImageSources';
import { createCompatibleTextureImage, type TextureUploadFit } from '../utils/textureUploadCompatibility';
import { probeTextureVisiblePixels, type VisiblePixelProbeResult } from '../utils/sourceToPixelProbe';
import {
  getRuntimeProtocol,
  recordSourceToPixelOutcome,
  shouldRetryEmbeddedFallbackAfterPostUploadFailure,
  shouldRunVisiblePixelProbe,
} from '../utils/sourceToPixelOutcome';

export interface ArtworkAlbedoSelection {
  selectedUrl: string;
  selectedUrlType: ArtworkImageUrlType;
  declaredUrl: string;
  declaredUrlType: ArtworkImageUrlType;
  sourceMode: ArtworkImageSourceMode;
  bundleId: string | null;
  usedEmbeddedFallback: boolean;
  attemptedEmbeddedFallback: boolean;
  generatedFallback: boolean;
}

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
  /** v0.25 T-03: stored renderer reference used for proactive GPU texture upload via initTexture(). */
  private renderer: THREE.WebGLRenderer | null = null;
  private readonly imageBitmapDecodeSupported =
    typeof createImageBitmap === 'function' && typeof THREE.ImageBitmapLoader === 'function';
  /**
   * v0.08: tracks which cache keys resolved to the generated fallback texture
   * rather than the real customer image. Used by GalleryManager to emit a
   * diagnostic warning when the central 3D painting falls back.
   */
  private readonly fallbackKeys = new Set<string>();
  private readonly artworkAlbedoSelections = new Map<string, ArtworkAlbedoSelection>();
  /**
   * v0.92: capability-aware upload-fit recorded for every successfully
   * loaded (non-fallback) texture, keyed the same way as `cache`. Used to
   * prove the request→decode→GPU pipeline and to report whether a
   * downscale was required/applied before upload.
   */
  private readonly uploadFits = new Map<string, TextureUploadFit>();

  constructor(loadingManager: THREE.LoadingManager = THREE.DefaultLoadingManager) {
    this.externalLoader = new THREE.TextureLoader(loadingManager);
    this.localLoader = new THREE.TextureLoader(loadingManager);
    this.externalLoader.setCrossOrigin('anonymous');
    // localLoader intentionally has no crossOrigin set.
  }

  init(renderer: THREE.WebGLRenderer): void {
    this.renderer = renderer;
    this.maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    this.maxTextureSize = renderer.capabilities.maxTextureSize;
    this.diagnostics.info('capabilities', 'Texture manager initialized', {
      maxAnisotropy: this.maxAnisotropy,
      maxTextureSize: this.maxTextureSize,
      imageBitmapDecodeSupported: this.imageBitmapDecodeSupported,
      imageBitmapStatus: this.imageBitmapDecodeSupported
        ? 'available-for-guarded-benchmark'
        : 'unsupported-or-unavailable',
      compressedTexturePipeline: 'ktx2-basis-future-importer-milestone',
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

  async preloadArtworkAlbedos(artworks: readonly Pick<Artwork, 'id' | 'image' | 'webglImage'>[]): Promise<void> {
    this.diagnostics.info('preload', `Preloading ${artworks.length} artwork albedo texture(s)`, {
      count: artworks.length,
      artworks: artworks.map((artwork) => {
        const sourcePlan = resolveArtworkImageSources(artwork);
        return {
          artworkId: artwork.id,
          bundleId: sourcePlan.primary?.bundleId ?? null,
          declaredImageUrlType: sourcePlan.primary?.declaredUrlType ?? null,
          resolvedImageUrlType: sourcePlan.primary?.resolvedUrlType ?? null,
          hasEmbeddedFallback: !!sourcePlan.fallback,
          embeddedFallbackUrlType: sourcePlan.fallback?.resolvedUrlType ?? null,
        };
      }),
    });
    await Promise.all(artworks.map((artwork) => this.loadArtworkAlbedo(artwork)));
  }

  async loadArtworkAlbedo(artwork: Pick<Artwork, 'id' | 'image' | 'webglImage'>): Promise<THREE.Texture> {
    const sourcePlan = resolveArtworkImageSources(artwork);
    const primary = sourcePlan.primary;
    const existingSelection = this.artworkAlbedoSelections.get(artwork.id);
    if (existingSelection) {
      const existingTexture =
        this.cache.get(`albedo::${existingSelection.selectedUrl}`)
        ?? (primary ? this.cache.get(`albedo::${primary.resolvedUrl}`) : undefined);
      if (existingTexture) return existingTexture;
    }
    const startedAt = this.now();
    if (!primary) {
      const fallback = this.createFallbackTexture(artwork.id);
      this.renderer?.initTexture(fallback);
      this.artworkAlbedoSelections.set(artwork.id, {
        selectedUrl: artwork.image,
        selectedUrlType: 'local-relative',
        declaredUrl: artwork.image,
        declaredUrlType: 'local-relative',
        sourceMode: 'declared-image',
        bundleId: null,
        usedEmbeddedFallback: false,
        attemptedEmbeddedFallback: false,
        generatedFallback: true,
      });
      recordSourceToPixelOutcome(this.diagnostics, {
        route: 'gallery',
        artworkId: artwork.id,
        bundleId: null,
        runtimeProtocol: getRuntimeProtocol(),
        candidateMode: null,
        resolvedUrlType: null,
        usedEmbeddedFallback: false,
        attemptedEmbeddedFallback: false,
        result: 'failed',
        firstFailedStage: 'candidate-selected',
        failureReason: 'no-declared-source',
        elapsedMs: Math.round(this.now() - startedAt),
        sourceWidth: null,
        sourceHeight: null,
        uploadWidth: null,
        uploadHeight: null,
        downscaleApplied: false,
        rendererMaxTextureSize: this.maxTextureSize || null,
        visibleProbe: null,
      });
      return fallback;
    }

    const primaryTexture = await this.loadForRole(primary.resolvedUrl, 'albedo');
    if (!this.isFallback(primary.resolvedUrl, 'albedo')) {
      const primaryProbe = this.probeArtworkTexture(primaryTexture, primary.resolvedUrlType);
      const shouldRetryAfterPrimaryPostUploadFailure = shouldRetryEmbeddedFallbackAfterPostUploadFailure(
        {
          runtimeProtocol: getRuntimeProtocol(),
          resolvedUrlType: primary.resolvedUrlType,
          debugEnabled: this.diagnostics.isDebugEnabled(),
        },
        !!sourcePlan.fallback
      );
      if (primaryProbe.failureReason && shouldRetryAfterPrimaryPostUploadFailure && sourcePlan.fallback) {
        const fallback = sourcePlan.fallback;
        const primaryFailure = `${primary.mode}:visible-pixel-probe:${primaryProbe.failureReason}`;
        this.diagnostics.warn('artwork-albedo-retry', 'Declared artwork image failed after GPU upload; retrying embedded fallback', {
          artworkId: artwork.id,
          bundleId: primary.bundleId,
          declaredImageUrl: redactArtworkImageUrlForLog(primary.declaredUrl),
          fallbackImageUrl: redactArtworkImageUrlForLog(fallback.resolvedUrl),
          declaredImageUrlType: primary.declaredUrlType,
          fallbackImageUrlType: fallback.resolvedUrlType,
          fallbackReason: primaryFailure,
          visibleProbe: primaryProbe.visibleProbe,
        });
        const fallbackTexture = await this.loadForRole(fallback.resolvedUrl, 'albedo');
        if (!this.isFallback(fallback.resolvedUrl, 'albedo')) {
          const fallbackProbe = this.probeArtworkTexture(fallbackTexture, fallback.resolvedUrlType);
          if (!fallbackProbe.failureReason) {
            this.promoteArtworkAlbedo(
              primary.resolvedUrl,
              fallbackTexture,
              this.uploadFits.get(`albedo::${fallback.resolvedUrl}`) ?? null
            );
            this.artworkAlbedoSelections.set(artwork.id, {
              selectedUrl: fallback.resolvedUrl,
              selectedUrlType: fallback.resolvedUrlType,
              declaredUrl: primary.declaredUrl,
              declaredUrlType: primary.declaredUrlType,
              sourceMode: fallback.mode,
              bundleId: fallback.bundleId,
              usedEmbeddedFallback: true,
              attemptedEmbeddedFallback: true,
              generatedFallback: false,
            });
            this.diagnostics.info('artwork-albedo-fallback', 'Artwork albedo resolved through embedded fallback', {
              artworkId: artwork.id,
              bundleId: fallback.bundleId,
              declaredImageUrl: redactArtworkImageUrlForLog(primary.declaredUrl),
              resolvedImageUrl: redactArtworkImageUrlForLog(fallback.resolvedUrl),
              declaredImageUrlType: primary.declaredUrlType,
              resolvedImageUrlType: fallback.resolvedUrlType,
            });
            this.recordAlbedoOutcome(
              artwork.id,
              fallback.resolvedUrl,
              fallback.bundleId,
              fallback.mode,
              fallback.resolvedUrlType,
              {
                usedEmbeddedFallback: true,
                attemptedEmbeddedFallback: true,
                startedAt,
                texture: fallbackTexture,
                visibleProbe: fallbackProbe.visibleProbe,
              }
            );
            return fallbackTexture;
          }
          this.installGeneratedFallbackTexture(primary.resolvedUrl, artwork.id);
          this.artworkAlbedoSelections.set(artwork.id, {
            selectedUrl: primary.resolvedUrl,
            selectedUrlType: primary.resolvedUrlType,
            declaredUrl: primary.declaredUrl,
            declaredUrlType: primary.declaredUrlType,
            sourceMode: primary.mode,
            bundleId: primary.bundleId,
            usedEmbeddedFallback: false,
            attemptedEmbeddedFallback: true,
            generatedFallback: true,
          });
          this.recordFailedAlbedoOutcome(artwork.id, {
            bundleId: fallback.bundleId,
            candidateMode: fallback.mode,
            resolvedUrlType: fallback.resolvedUrlType,
            usedEmbeddedFallback: true,
            attemptedEmbeddedFallback: true,
            startedAt,
            stage: 'visible-pixel-probe',
            failureReason: `${fallback.mode}:visible-pixel-probe:${fallbackProbe.failureReason}`,
            fit: this.uploadFits.get(`albedo::${fallback.resolvedUrl}`) ?? null,
            visibleProbe: fallbackProbe.visibleProbe,
          });
          return this.cache.get(`albedo::${primary.resolvedUrl}`)!;
        }
        this.installGeneratedFallbackTexture(primary.resolvedUrl, artwork.id);
        this.artworkAlbedoSelections.set(artwork.id, {
          selectedUrl: primary.resolvedUrl,
          selectedUrlType: primary.resolvedUrlType,
          declaredUrl: primary.declaredUrl,
          declaredUrlType: primary.declaredUrlType,
          sourceMode: primary.mode,
          bundleId: primary.bundleId,
          usedEmbeddedFallback: false,
          attemptedEmbeddedFallback: true,
          generatedFallback: true,
        });
        this.recordFailedAlbedoOutcome(artwork.id, {
          bundleId: primary.bundleId,
          candidateMode: primary.mode,
          resolvedUrlType: primary.resolvedUrlType,
          usedEmbeddedFallback: false,
          attemptedEmbeddedFallback: true,
          startedAt,
          stage: 'visible-pixel-probe',
          failureReason: primaryFailure,
          fit: this.uploadFits.get(`albedo::${primary.resolvedUrl}`) ?? null,
          visibleProbe: primaryProbe.visibleProbe,
        });
        return this.cache.get(`albedo::${primary.resolvedUrl}`)!;
      }
      if (primaryProbe.failureReason) {
        this.installGeneratedFallbackTexture(primary.resolvedUrl, artwork.id);
        this.artworkAlbedoSelections.set(artwork.id, {
          selectedUrl: primary.resolvedUrl,
          selectedUrlType: primary.resolvedUrlType,
          declaredUrl: primary.declaredUrl,
          declaredUrlType: primary.declaredUrlType,
          sourceMode: primary.mode,
          bundleId: primary.bundleId,
          usedEmbeddedFallback: false,
          attemptedEmbeddedFallback: false,
          generatedFallback: true,
        });
        this.recordFailedAlbedoOutcome(artwork.id, {
          bundleId: primary.bundleId,
          candidateMode: primary.mode,
          resolvedUrlType: primary.resolvedUrlType,
          usedEmbeddedFallback: false,
          attemptedEmbeddedFallback: false,
          startedAt,
          stage: 'visible-pixel-probe',
          failureReason: `${primary.mode}:visible-pixel-probe:${primaryProbe.failureReason}`,
          fit: this.uploadFits.get(`albedo::${primary.resolvedUrl}`) ?? null,
          visibleProbe: primaryProbe.visibleProbe,
        });
        return this.cache.get(`albedo::${primary.resolvedUrl}`)!;
      }
      this.artworkAlbedoSelections.set(artwork.id, {
        selectedUrl: primary.resolvedUrl,
        selectedUrlType: primary.resolvedUrlType,
        declaredUrl: primary.declaredUrl,
        declaredUrlType: primary.declaredUrlType,
        sourceMode: primary.mode,
        bundleId: primary.bundleId,
        usedEmbeddedFallback: false,
        attemptedEmbeddedFallback: false,
        generatedFallback: false,
      });
      this.recordAlbedoOutcome(artwork.id, primary.resolvedUrl, primary.bundleId, primary.mode, primary.resolvedUrlType, {
        usedEmbeddedFallback: false,
        attemptedEmbeddedFallback: false,
        startedAt,
        texture: primaryTexture,
        visibleProbe: primaryProbe.visibleProbe,
      });
      return primaryTexture;
    }

    const fallback = sourcePlan.fallback;
    if (fallback) {
      this.diagnostics.warn('artwork-albedo-retry', 'Declared artwork image failed; retrying embedded fallback', {
        artworkId: artwork.id,
        bundleId: primary.bundleId,
        declaredImageUrl: redactArtworkImageUrlForLog(primary.declaredUrl),
        fallbackImageUrl: redactArtworkImageUrlForLog(fallback.resolvedUrl),
        declaredImageUrlType: primary.declaredUrlType,
        fallbackImageUrlType: fallback.resolvedUrlType,
      });
      const fallbackTexture = await this.loadForRole(fallback.resolvedUrl, 'albedo');
      if (!this.isFallback(fallback.resolvedUrl, 'albedo')) {
        const fallbackProbe = this.probeArtworkTexture(fallbackTexture, fallback.resolvedUrlType);
        if (!fallbackProbe.failureReason) {
          this.promoteArtworkAlbedo(
            primary.resolvedUrl,
            fallbackTexture,
            this.uploadFits.get(`albedo::${fallback.resolvedUrl}`) ?? null
          );
          this.artworkAlbedoSelections.set(artwork.id, {
            selectedUrl: fallback.resolvedUrl,
            selectedUrlType: fallback.resolvedUrlType,
            declaredUrl: primary.declaredUrl,
            declaredUrlType: primary.declaredUrlType,
            sourceMode: fallback.mode,
            bundleId: fallback.bundleId,
            usedEmbeddedFallback: true,
            attemptedEmbeddedFallback: true,
            generatedFallback: false,
          });
          this.diagnostics.info('artwork-albedo-fallback', 'Artwork albedo resolved through embedded fallback', {
            artworkId: artwork.id,
            bundleId: fallback.bundleId,
            declaredImageUrl: redactArtworkImageUrlForLog(primary.declaredUrl),
            resolvedImageUrl: redactArtworkImageUrlForLog(fallback.resolvedUrl),
            declaredImageUrlType: primary.declaredUrlType,
            resolvedImageUrlType: fallback.resolvedUrlType,
          });
          this.recordAlbedoOutcome(
            artwork.id,
            fallback.resolvedUrl,
            fallback.bundleId,
            fallback.mode,
            fallback.resolvedUrlType,
            {
              usedEmbeddedFallback: true,
              attemptedEmbeddedFallback: true,
              startedAt,
              texture: fallbackTexture,
              visibleProbe: fallbackProbe.visibleProbe,
            }
          );
          return fallbackTexture;
        }
        this.installGeneratedFallbackTexture(primary.resolvedUrl, artwork.id);
        this.artworkAlbedoSelections.set(artwork.id, {
          selectedUrl: primary.resolvedUrl,
          selectedUrlType: primary.resolvedUrlType,
          declaredUrl: primary.declaredUrl,
          declaredUrlType: primary.declaredUrlType,
          sourceMode: primary.mode,
          bundleId: primary.bundleId,
          usedEmbeddedFallback: false,
          attemptedEmbeddedFallback: true,
          generatedFallback: true,
        });
        this.recordFailedAlbedoOutcome(artwork.id, {
          bundleId: fallback.bundleId,
          candidateMode: fallback.mode,
          resolvedUrlType: fallback.resolvedUrlType,
          usedEmbeddedFallback: true,
          attemptedEmbeddedFallback: true,
          startedAt,
          stage: 'visible-pixel-probe',
          failureReason: `${fallback.mode}:visible-pixel-probe:${fallbackProbe.failureReason}`,
          fit: this.uploadFits.get(`albedo::${fallback.resolvedUrl}`) ?? null,
          visibleProbe: fallbackProbe.visibleProbe,
        });
        return this.cache.get(`albedo::${primary.resolvedUrl}`)!;
      }
    }

    this.installGeneratedFallbackTexture(primary.resolvedUrl, artwork.id);
    this.artworkAlbedoSelections.set(artwork.id, {
      selectedUrl: primary.resolvedUrl,
      selectedUrlType: primary.resolvedUrlType,
      declaredUrl: primary.declaredUrl,
      declaredUrlType: primary.declaredUrlType,
      sourceMode: primary.mode,
      bundleId: primary.bundleId,
      usedEmbeddedFallback: false,
      attemptedEmbeddedFallback: !!fallback,
      generatedFallback: true,
    });
    this.recordFailedAlbedoOutcome(artwork.id, {
      bundleId: primary.bundleId,
      candidateMode: fallback?.mode ?? primary.mode,
      resolvedUrlType: fallback?.resolvedUrlType ?? primary.resolvedUrlType,
      usedEmbeddedFallback: false,
      attemptedEmbeddedFallback: !!fallback,
      startedAt,
      stage: 'request',
      failureReason: fallback ? 'primary-and-fallback-load-failed' : 'primary-load-failed-no-fallback',
      fit: null,
      visibleProbe: null,
    });
    return this.cache.get(`albedo::${primary.resolvedUrl}`) ?? primaryTexture;
  }

  /**
   * v0.92: builds and records the shared source-to-pixel outcome for a
   * successfully resolved (non-fallback) albedo texture, including a bounded
   * GPU visible-pixel probe when verbose diagnostics are enabled.
   */
  private recordAlbedoOutcome(
    artworkId: string,
    resolvedUrl: string,
    bundleId: string | null,
    candidateMode: ArtworkImageSourceMode,
    resolvedUrlType: ArtworkImageUrlType,
    options: {
      usedEmbeddedFallback: boolean;
      attemptedEmbeddedFallback: boolean;
      startedAt: number;
      texture: THREE.Texture;
      visibleProbe?: VisiblePixelProbeResult | null;
    }
  ): void {
    const fit = this.uploadFits.get(`albedo::${resolvedUrl}`) ?? null;
    recordSourceToPixelOutcome(this.diagnostics, {
      route: 'gallery',
      artworkId,
      bundleId,
      runtimeProtocol: getRuntimeProtocol(),
      candidateMode,
      resolvedUrlType,
      usedEmbeddedFallback: options.usedEmbeddedFallback,
      attemptedEmbeddedFallback: options.attemptedEmbeddedFallback,
      result: 'success',
      firstFailedStage: null,
      failureReason: null,
      elapsedMs: Math.round(this.now() - options.startedAt),
      sourceWidth: fit?.sourceWidth ?? null,
      sourceHeight: fit?.sourceHeight ?? null,
      uploadWidth: fit?.targetWidth ?? null,
      uploadHeight: fit?.targetHeight ?? null,
      downscaleApplied: fit?.needsDownscale ?? false,
      rendererMaxTextureSize: this.maxTextureSize || null,
      visibleProbe: options.visibleProbe ?? null,
    });
  }

  getArtworkAlbedoSelection(artwork: Pick<Artwork, 'id'>): ArtworkAlbedoSelection | undefined {
    return this.artworkAlbedoSelections.get(artwork.id);
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
          try {
            this.prepareTexture(texture, role);
            const img = texture.image as HTMLImageElement | ImageBitmap | { width?: number; height?: number };
            const sourceWidth = 'naturalWidth' in img ? (img.naturalWidth || img.width || 0) : (img.width || 0);
            const sourceHeight = 'naturalHeight' in img ? (img.naturalHeight || img.height || 0) : (img.height || 0);

            // v0.92: apply a shared capability-aware downscale BEFORE the
            // texture is cached/uploaded, instead of only warning after an
            // oversized upload already happened.
            const compatible = createCompatibleTextureImage(
              img as CanvasImageSource,
              sourceWidth,
              sourceHeight,
              this.maxTextureSize
            );
            if (compatible.downscaleApplied) {
              texture.image = compatible.image;
              texture.needsUpdate = true;
              this.diagnostics.warn('texture-downscaled', `Downscaled oversized ${role} texture to fit device capability`, {
                role,
                url: urlForLog,
                urlType,
                sourceWidth,
                sourceHeight,
                uploadWidth: compatible.fit.targetWidth,
                uploadHeight: compatible.fit.targetHeight,
                maxTextureSize: this.maxTextureSize,
              });
            } else if (compatible.fit.needsDownscale) {
              this.warnIfOversized(role, urlForLog, urlType, sourceWidth, sourceHeight);
            }
            this.uploadFits.set(cacheKey, compatible.fit);

            // v0.25 T-03: proactively push the decoded texture to the GPU so the
            // compositor can drain the upload queue before the warm render loop.
            this.renderer?.initTexture(texture);
            this.cache.set(cacheKey, texture);
            this.fallbackKeys.delete(cacheKey);
            this.diagnostics.info('load-success', `Loaded ${role} texture`, {
              url: urlForLog,
              urlType,
              width: compatible.fit.targetWidth,
              height: compatible.fit.targetHeight,
              sourceWidth,
              sourceHeight,
              downscaleApplied: compatible.downscaleApplied,
              fallbackUsed: false,
            });
            resolve(texture);
          } catch (error) {
            texture.dispose();
            this.uploadFits.delete(cacheKey);
            this.diagnostics.warn('load-fallback', `Failed to prepare ${role} texture for upload — creating generated fallback`, {
              url: urlForLog,
              urlType,
              role,
              failureStage: 'gpu-upload',
              errorMessage: error instanceof Error ? error.message : String(error),
            });
            const fallback = this.createFallbackTexture(url);
            this.cache.set(cacheKey, fallback);
            this.uploadFits.delete(cacheKey);
            this.renderer?.initTexture(fallback);
            this.fallbackKeys.add(cacheKey);
            resolve(fallback);
          }
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
          this.uploadFits.delete(cacheKey);
          // v0.25 T-03: upload fallback texture to GPU immediately.
          this.renderer?.initTexture(fallback);
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
    this.fallbackKeys.clear();
    this.artworkAlbedoSelections.clear();
    this.uploadFits.clear();
  }

  private promoteArtworkAlbedo(primaryUrl: string, texture: THREE.Texture, fit: TextureUploadFit | null): void {
    const cacheKey = `albedo::${primaryUrl}`;
    const existing = this.cache.get(cacheKey);
    if (existing && existing !== texture) {
      existing.dispose();
    }
    this.cache.set(cacheKey, texture);
    this.fallbackKeys.delete(cacheKey);
    if (fit) {
      this.uploadFits.set(cacheKey, fit);
    } else {
      this.uploadFits.delete(cacheKey);
    }
  }

  private installGeneratedFallbackTexture(primaryUrl: string, seed: string): THREE.Texture {
    const cacheKey = `albedo::${primaryUrl}`;
    const existing = this.cache.get(cacheKey);
    if (existing) existing.dispose();
    const fallback = this.createFallbackTexture(seed);
    this.cache.set(cacheKey, fallback);
    this.uploadFits.delete(cacheKey);
    this.fallbackKeys.add(cacheKey);
    this.renderer?.initTexture(fallback);
    return fallback;
  }

  private recordFailedAlbedoOutcome(
    artworkId: string,
    options: {
      bundleId: string | null;
      candidateMode: ArtworkImageSourceMode | null;
      resolvedUrlType: ArtworkImageUrlType | null;
      usedEmbeddedFallback: boolean;
      attemptedEmbeddedFallback: boolean;
      startedAt: number;
      stage: 'candidate-selected' | 'request' | 'decode' | 'gpu-upload' | 'visible-pixel-probe';
      failureReason: string;
      fit: TextureUploadFit | null;
      visibleProbe: VisiblePixelProbeResult | null;
    }
  ): void {
    recordSourceToPixelOutcome(this.diagnostics, {
      route: 'gallery',
      artworkId,
      bundleId: options.bundleId,
      runtimeProtocol: getRuntimeProtocol(),
      candidateMode: options.candidateMode,
      resolvedUrlType: options.resolvedUrlType,
      usedEmbeddedFallback: options.usedEmbeddedFallback,
      attemptedEmbeddedFallback: options.attemptedEmbeddedFallback,
      result: 'failed',
      firstFailedStage: options.stage,
      failureReason: options.failureReason,
      elapsedMs: Math.round(this.now() - options.startedAt),
      sourceWidth: options.fit?.sourceWidth ?? null,
      sourceHeight: options.fit?.sourceHeight ?? null,
      uploadWidth: options.fit?.targetWidth ?? null,
      uploadHeight: options.fit?.targetHeight ?? null,
      downscaleApplied: options.fit?.needsDownscale ?? false,
      rendererMaxTextureSize: this.maxTextureSize || null,
      visibleProbe: options.visibleProbe,
    });
  }

  private probeArtworkTexture(
    texture: THREE.Texture,
    resolvedUrlType: ArtworkImageUrlType
  ): { visibleProbe: VisiblePixelProbeResult | null; failureReason: string | null } {
    const shouldProbe = shouldRunVisiblePixelProbe({
      runtimeProtocol: getRuntimeProtocol(),
      resolvedUrlType,
      debugEnabled: this.diagnostics.isDebugEnabled(),
    });
    if (!shouldProbe || !this.renderer) {
      return { visibleProbe: null, failureReason: null };
    }
    const visibleProbe = probeTextureVisiblePixels(this.renderer, texture);
    return {
      visibleProbe,
      failureReason: visibleProbe.pass ? null : visibleProbe.reason ?? 'probe-failed',
    };
  }

  private now(): number {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
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
  private classifyUrlType(url: string): 'data-uri' | 'external-http' | 'file-url' | 'local-relative' {
    if (url.startsWith('data:')) return 'data-uri';
    if (/^https?:\/\//i.test(url)) return 'external-http';
    if (/^file:\/\//i.test(url)) return 'file-url';
    return 'local-relative';
  }

  /** Compact URL-type label used in preload summary logs. */
  private compactUrlType(url: string): string {
    const type = this.classifyUrlType(url);
    if (type === 'external-http') return 'http';
    if (type === 'file-url') return 'file';
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
