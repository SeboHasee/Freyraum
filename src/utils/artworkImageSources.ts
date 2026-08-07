import type { Artwork } from '../config/artworks';

export type ArtworkImageUrlType = 'data-uri' | 'external-http' | 'local-relative';
export type ArtworkImageSourceMode = 'declared-image' | 'embedded-webgl-fallback';

export interface ArtworkImageSourceCandidate {
  url: string;
  mode: ArtworkImageSourceMode;
  urlType: ArtworkImageUrlType;
}

export interface ArtworkImageSourcePlan {
  primary: ArtworkImageSourceCandidate | null;
  fallback: ArtworkImageSourceCandidate | null;
}

type ArtworkImageSourceRecord = Pick<Artwork, 'image'> & {
  webglImage?: string | null;
};

export function classifyArtworkImageUrl(url: string): ArtworkImageUrlType {
  if (url.startsWith('data:')) return 'data-uri';
  if (/^https?:\/\//i.test(url)) return 'external-http';
  return 'local-relative';
}

export function resolveArtworkImageSources(
  artwork: ArtworkImageSourceRecord | null | undefined
): ArtworkImageSourcePlan {
  const primaryUrl = artwork?.image?.trim() ?? '';
  const fallbackUrl = artwork?.webglImage?.trim() ?? '';
  const primary = primaryUrl
    ? {
        url: primaryUrl,
        mode: 'declared-image' as const,
        urlType: classifyArtworkImageUrl(primaryUrl),
      }
    : null;
  const fallback =
    fallbackUrl && fallbackUrl !== primaryUrl
      ? {
          url: fallbackUrl,
          mode: 'embedded-webgl-fallback' as const,
          urlType: classifyArtworkImageUrl(fallbackUrl),
        }
      : null;
  return { primary, fallback };
}

export function redactArtworkImageUrlForLog(url: string): string {
  if (classifyArtworkImageUrl(url) !== 'data-uri') return url;
  const semicolon = url.indexOf(';');
  const mime = semicolon <= 5 ? 'unknown' : url.slice(5, semicolon);
  return `[data-uri:${mime}:${url.length}bytes]`;
}
