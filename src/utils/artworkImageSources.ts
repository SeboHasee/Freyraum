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
