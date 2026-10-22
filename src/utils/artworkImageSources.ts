import type { Artwork, ArtworkImageSourceContext } from '../config/artworks';

export type ArtworkImageUrlType = 'data-uri' | 'external-http' | 'file-url' | 'local-relative';
export type ArtworkImageSourceMode = 'declared-image' | 'embedded-webgl-fallback';

export interface ArtworkImageSourceCandidate {
  declaredUrl: string;
  resolvedUrl: string;
  mode: ArtworkImageSourceMode;
  declaredUrlType: ArtworkImageUrlType;
  resolvedUrlType: ArtworkImageUrlType;
  bundleId: string | null;
}

export interface ArtworkImageSourcePlan {
  primary: ArtworkImageSourceCandidate | null;
  fallback: ArtworkImageSourceCandidate | null;
}

export type ArtworkImageSourceRecord = Pick<Artwork, 'image' | 'imageSourceContext'> & {
  webglImage?: string | null;
};

export function classifyArtworkImageUrl(url: string): ArtworkImageUrlType {
  if (url.startsWith('data:')) return 'data-uri';
  if (/^https?:\/\//i.test(url)) return 'external-http';
  if (/^file:\/\//i.test(url)) return 'file-url';
  return 'local-relative';
}

function resolveRelativeArtworkImageUrl(
  url: string,
  context: ArtworkImageSourceContext | null | undefined
): string {
  if (classifyArtworkImageUrl(url) !== 'local-relative') return url;
  const baseUrl = context?.assetBaseUrl?.trim() ?? '';
  if (baseUrl) {
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  }
  if (typeof window === 'undefined') return url;
  try {
    return new URL(url, window.location.href).href;
  } catch {
    return url;
  }
}

export function resolveArtworkImageSourceUrl(
  url: string,
  mode: ArtworkImageSourceMode,
  context: ArtworkImageSourceContext | null | undefined
): ArtworkImageSourceCandidate {
  const declaredUrl = url.trim();
  const resolvedUrl = resolveRelativeArtworkImageUrl(declaredUrl, context);
  return {
    declaredUrl,
    resolvedUrl,
    mode,
    declaredUrlType: classifyArtworkImageUrl(declaredUrl),
    resolvedUrlType: classifyArtworkImageUrl(resolvedUrl),
    bundleId: context?.bundleId?.trim() || null,
  };
}

export function resolveArtworkImageSources(
  artwork: ArtworkImageSourceRecord | null | undefined
): ArtworkImageSourcePlan {
  const context = artwork?.imageSourceContext;
  const primaryUrl = artwork?.image?.trim() ?? '';
  const fallbackUrl = artwork?.webglImage?.trim() ?? '';
  const primary = primaryUrl ? resolveArtworkImageSourceUrl(primaryUrl, 'declared-image', context) : null;
  const fallback =
    fallbackUrl && fallbackUrl !== primaryUrl
      ? resolveArtworkImageSourceUrl(fallbackUrl, 'embedded-webgl-fallback', context)
      : null;
  return { primary, fallback };
}

export function redactArtworkImageUrlForLog(url: string): string {
  if (classifyArtworkImageUrl(url) !== 'data-uri') return url;
  const semicolon = url.indexOf(';');
  const mime = semicolon <= 5 ? 'unknown' : url.slice(5, semicolon);
  return `[data-uri:${mime}:${url.length}bytes]`;
}

/** v1.46: one deployed WebP derivative (see `scripts/build-web-images.mjs`). */
export interface ArtworkWebImage {
  src: string;
  width: number;
  height: number;
}

const WEB_IMAGE_SRC_PATTERN = /^\.\/web-images\/[A-Za-z0-9_-]+-\d+-[0-9a-f]+\.webp$/;

/** Validates the injected `window.__FREYRAUM_WEB_IMAGES` map; invalid entries are dropped. */
export function sanitizeWebImageMap(raw: unknown): ReadonlyMap<string, readonly ArtworkWebImage[]> {
  const map = new Map<string, readonly ArtworkWebImage[]>();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return map;
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(value)) continue;
    const variants = value
      .filter((entry): entry is ArtworkWebImage => {
        if (!entry || typeof entry !== 'object') return false;
        const v = entry as Record<string, unknown>;
        return (
          typeof v['src'] === 'string' &&
          WEB_IMAGE_SRC_PATTERN.test(v['src']) &&
          Number.isInteger(v['width']) && (v['width'] as number) > 0 &&
          Number.isInteger(v['height']) && (v['height'] as number) > 0
        );
      })
      .map((v) => ({ src: v.src, width: v.width, height: v.height }))
      .sort((a, b) => Math.max(a.width, a.height) - Math.max(b.width, b.height));
    if (variants.length > 0) map.set(id, variants);
  }
  return map;
}

/** Smallest variant whose long edge reaches `targetLongEdge`, else the largest. */
export function pickWebImage(
  variants: readonly ArtworkWebImage[],
  targetLongEdge: number
): ArtworkWebImage | null {
  if (variants.length === 0) return null;
  for (const variant of variants) {
    if (Math.max(variant.width, variant.height) >= targetLongEdge) return variant;
  }
  return variants[variants.length - 1] ?? null;
}

/** Display long edge (px) for a device: phones and low-memory devices stop at 2048. */
export function webImageDisplayLongEdge(device: {
  layoutTier: string;
  pointerPrimary: string;
  deviceMemoryGb?: number | null;
}): number {
  const phone = device.layoutTier.startsWith('phone') || device.pointerPrimary === 'coarse';
  const lowMemory = typeof device.deviceMemoryGb === 'number' && device.deviceMemoryGb <= 4;
  return phone || lowMemory ? 2048 : 4096;
}

/**
 * Points `image` at the device-sized derivative and `thumbnailImage` at the
 * smallest one. Artworks without variants (local preview, built-ins) are
 * returned unchanged, so the original source path keeps working.
 */
export function applyWebImages<T extends Pick<Artwork, 'id' | 'image' | 'thumbnailImage'>>(
  artworks: readonly T[],
  map: ReadonlyMap<string, readonly ArtworkWebImage[]>,
  displayLongEdge: number
): T[] {
  return artworks.map((artwork) => {
    const variants = map.get(artwork.id);
    const display = variants ? pickWebImage(variants, displayLongEdge) : null;
    const thumbnail = variants ? pickWebImage(variants, 1) : null;
    if (!display || !thumbnail) return artwork;
    return { ...artwork, image: display.src, thumbnailImage: thumbnail.src };
  });
}
