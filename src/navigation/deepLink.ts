/**
 * v1.46 (E3) — shareable deep links to one artwork.
 *
 * `?artwork=<id>` preselects the artwork in the museum hub; adding
 * `&view=gallery` opens it in the interactive gallery after Start. Only IDs
 * of published artworks are accepted. Parameter rules: `docs/QUERY_PARAMETERS.md`.
 */

export const DEEP_LINK_ARTWORK_PARAM = 'artwork';
export const DEEP_LINK_VIEW_PARAM = 'view';
export const DEEP_LINK_GALLERY_VIEW = 'gallery';

/** Same alphabet as importer IDs; anything else is ignored, never echoed. */
const ARTWORK_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,119}$/;

export interface ArtworkDeepLink {
  artworkId: string | null;
  openGallery: boolean;
}

export function readArtworkDeepLink(search: string, knownIds: ReadonlySet<string>): ArtworkDeepLink {
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(search);
  } catch {
    return { artworkId: null, openGallery: false };
  }
  const raw = params.get(DEEP_LINK_ARTWORK_PARAM)?.trim().toLowerCase() ?? '';
  const artworkId = ARTWORK_ID_PATTERN.test(raw) && knownIds.has(raw) ? raw : null;
  return {
    artworkId,
    openGallery: artworkId !== null && params.get(DEEP_LINK_VIEW_PARAM) === DEEP_LINK_GALLERY_VIEW,
  };
}

/**
 * Returns the search string for the current artwork and view, keeping every
 * unrelated parameter (for example `?debug=`) unchanged.
 */
export function buildArtworkDeepLinkSearch(search: string, artworkId: string | null, inGallery: boolean): string {
  const params = new URLSearchParams(search);
  const validId = !!artworkId && ARTWORK_ID_PATTERN.test(artworkId);
  if (validId) {
    params.set(DEEP_LINK_ARTWORK_PARAM, artworkId);
  } else {
    params.delete(DEEP_LINK_ARTWORK_PARAM);
  }
  if (validId && inGallery) {
    params.set(DEEP_LINK_VIEW_PARAM, DEEP_LINK_GALLERY_VIEW);
  } else {
    params.delete(DEEP_LINK_VIEW_PARAM);
  }
  const next = params.toString();
  return next ? `?${next}` : '';
}
