/**
 * v0.92 — shared capability-aware raster downscale used before ANY decoded
 * artwork image (museum hub or interactive gallery) is uploaded to the GPU.
 *
 * Both routes previously only warned when a decoded source exceeded the
 * device `MAX_TEXTURE_SIZE` and relied on the browser to silently downscale
 * (or reject) the upload. This module makes the compatibility decision
 * explicit and shared: a source that fits is returned unchanged, and a
 * source that does not fit is drawn once into a single bounded canvas at the
 * largest size the active renderer can accept, preserving aspect ratio and
 * never upscaling beyond the source's native resolution.
 */

export interface TextureUploadFit {
  /** True when the source exceeds `maxTextureSize` on at least one axis. */
  needsDownscale: boolean;
  sourceWidth: number;
  sourceHeight: number;
  /** Target dimensions that fit within `maxTextureSize`. Equal to source when `needsDownscale` is false. */
  targetWidth: number;
  targetHeight: number;
}

export interface CompatibleTextureImage {
  image: CanvasImageSource;
  fit: TextureUploadFit;
  /** True only when a downscale was required AND actually produced (canvas 2D available). */
  downscaleApplied: boolean;
}

/** Computes the largest size (preserving aspect ratio) that fits within `maxTextureSize`. Never upscales. */
export function planTextureUploadFit(
  sourceWidth: number,
  sourceHeight: number,
  maxTextureSize: number
): TextureUploadFit {
  const safeWidth = Math.max(0, Math.floor(sourceWidth));
  const safeHeight = Math.max(0, Math.floor(sourceHeight));
  const fitsAlready =
    maxTextureSize <= 0 || safeWidth <= 0 || safeHeight <= 0 || (safeWidth <= maxTextureSize && safeHeight <= maxTextureSize);

  if (fitsAlready) {
    return {
      needsDownscale: false,
      sourceWidth: safeWidth,
      sourceHeight: safeHeight,
      targetWidth: safeWidth,
      targetHeight: safeHeight,
    };
  }

  const scale = Math.min(maxTextureSize / safeWidth, maxTextureSize / safeHeight);
  return {
    needsDownscale: true,
    sourceWidth: safeWidth,
    sourceHeight: safeHeight,
    targetWidth: Math.max(1, Math.floor(safeWidth * scale)),
    targetHeight: Math.max(1, Math.floor(safeHeight * scale)),
  };
}

/**
 * Returns a device-compatible image source for GPU upload. When the decoded
 * source already fits within `maxTextureSize`, the original source is
 * returned unchanged (no extra canvas, no copy, no re-decode). When it
 * exceeds the limit, a single bounded canvas is drawn once at the largest
 * compatible size; the canvas (and any decode-only resources it replaces)
 * becomes eligible for release as soon as the caller drops its reference to
 * the original source.
 */
export function createCompatibleTextureImage(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  maxTextureSize: number
): CompatibleTextureImage {
  const fit = planTextureUploadFit(sourceWidth, sourceHeight, maxTextureSize);
  if (!fit.needsDownscale) {
    return { image: source, fit, downscaleApplied: false };
  }

  const canvas = document.createElement('canvas');
  canvas.width = fit.targetWidth;
  canvas.height = fit.targetHeight;
  const context = canvas.getContext('2d');
  if (!context) {
    // No canvas 2D available (unsupported/degraded environment): fall back to
    // the original source. The caller is responsible for logging that the
    // required downscale could not be applied.
    return { image: source, fit, downscaleApplied: false };
  }

  context.drawImage(source, 0, 0, fit.targetWidth, fit.targetHeight);
  return { image: canvas, fit, downscaleApplied: true };
}
