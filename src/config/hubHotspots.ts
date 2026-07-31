/**
 * Hub hotspot configuration model (v0.79).
 *
 * One editable config model for customer updates: each hotspot maps a stable
 * ordinal slot (`slot-1 … slot-N`) to an artwork ID and a normalized
 * rectangle inside the hub visual. Coordinates are `(cx, cy, w, h)` in
 * `[0, 1]`, relative to the hub image content box (`.museum-hub__visual`,
 * fixed 16:9 with `object-fit: fill`), so a percentage-positioned button maps
 * 1:1 without reading image pixels.
 *
 * Customer override: `customer-artworks/hub-hotspots.json` is injected at
 * runtime as `window.__FREYRAUM_HUB_HOTSPOTS` by `scripts/import-artworks.mjs`
 * (same Option-C injection pattern as `__FREYRAUM_ARTWORKS`).
 *
 * `artworkId` may be the literal ID string or `@order:<n>` (1-based position
 * in the active artwork manifest) for customers who do not want to know IDs.
 * Unresolvable IDs keep the slot visible but flag it
 * `fallback_to_gallery_default`; slots without any `artworkId` are dropped.
 */

import type { Artwork } from './artworks';

export interface HubHotspot {
  /** Stable ordinal slot identifier, e.g. `slot-1`. */
  slot: string;
  /** Artwork ID, or `@order:<n>` (1-based manifest position). */
  artworkId: string;
  /** Normalized center X in [0, 1] of the hub image content box. */
  cx: number;
  /** Normalized center Y in [0, 1]. */
  cy: number;
  /** Normalized width in [0, 1]. */
  w: number;
  /** Normalized height in [0, 1]. */
  h: number;
  /** Optional customer label override for the hotspot pill. */
  label?: string;
}

export interface ResolvedHubHotspot extends HubHotspot {
  /**
   * Index of the mapped artwork in the active manifest, or `-1` when the ID
   * did not resolve (`fallback_to_gallery_default` behavior).
   */
  artworkIndex: number;
  /** Display label (customer label, artwork title, or fallback text). */
  displayLabel: string;
}

export type HubHotspotSource = 'injected' | 'built-in-default' | 'derived-order';

export interface HubHotspotResolution {
  hotspots: readonly ResolvedHubHotspot[];
  source: HubHotspotSource;
  rejected: number;
}

/** Horizontal usable wall band (mirrors hub header/CTA safe margins). */
const WALL_X_MIN = 0.06;
const WALL_X_SPAN = 0.88;
/** Museum-hang eye-level band center (see `horizonPercent` convention). */
const WALL_CY = 0.46;
/** Default hotspot height inside the eye-level band [0.30, 0.62]. */
const WALL_H = 0.28;
/** Cap for order-derived slots so hotspots stay usable on dense manifests. */
const DERIVED_SLOT_CAP = 6;

/**
 * First-pass hotspot table for the built-in artwork set. Coordinates were
 * derived deterministically from the wall-band formula and per-artwork aspect
 * metadata in `src/config/artworks.ts` — never from image pixels.
 */
export const HUB_HOTSPOT_DEFAULTS: readonly HubHotspot[] = [
  { slot: 'slot-1', artworkId: 'electric-storm', cx: 0.17, cy: WALL_CY, w: 0.155, h: WALL_H },
  { slot: 'slot-2', artworkId: 'quiet-coastline', cx: 0.39, cy: WALL_CY, w: 0.155, h: WALL_H },
  { slot: 'slot-3', artworkId: 'tokyo-passage', cx: 0.61, cy: WALL_CY, w: 0.12, h: WALL_H },
  { slot: 'slot-4', artworkId: 'golden-desert', cx: 0.83, cy: WALL_CY, w: 0.155, h: WALL_H },
];

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

/**
 * Deterministic derivation from runtime artwork metadata for manifests
 * without an explicit hotspot config: slot i of N is centered on the wall
 * band; width comes from the manifest aspect ratio (16:9 content box).
 */
export function deriveHotspotsFromArtworks(artworks: readonly Artwork[]): HubHotspot[] {
  const count = Math.min(artworks.length, DERIVED_SLOT_CAP);
  const out: HubHotspot[] = [];
  for (let i = 0; i < count; i += 1) {
    const artwork = artworks[i]!;
    const aspect =
      artwork.dimensions.height > 0 ? artwork.dimensions.width / artwork.dimensions.height : 1;
    // Convert artwork aspect into content-box width: the 16:9 box compresses
    // horizontal fractions by 9/16 relative to vertical ones.
    const w = Math.min(Math.max(WALL_H * aspect * (9 / 16), 0.06), (WALL_X_SPAN / count) * 0.85);
    out.push({
      slot: `slot-${i + 1}`,
      artworkId: artwork.id,
      cx: WALL_X_MIN + ((i + 0.5) * WALL_X_SPAN) / count,
      cy: WALL_CY,
      w,
      h: WALL_H,
    });
  }
  return out;
}

/**
 * Validates an injected hotspot config (`window.__FREYRAUM_HUB_HOTSPOTS`).
 * Malformed entries are dropped, coordinates are clamped to [0, 1], and
 * duplicate slot IDs keep only the first occurrence.
 */
export function sanitizeInjectedHotspots(raw: unknown): { hotspots: HubHotspot[]; rejected: number } {
  if (!Array.isArray(raw)) return { hotspots: [], rejected: 0 };
  const out: HubHotspot[] = [];
  const seenSlots = new Set<string>();
  let rejected = 0;
  for (const candidate of raw) {
    if (!candidate || typeof candidate !== 'object') {
      rejected += 1;
      continue;
    }
    const entry = candidate as Record<string, unknown>;
    const slot = typeof entry['slot'] === 'string' ? entry['slot'].trim() : '';
    const artworkId = typeof entry['artworkId'] === 'string' ? entry['artworkId'].trim() : '';
    const cx = typeof entry['cx'] === 'number' && Number.isFinite(entry['cx']) ? entry['cx'] : NaN;
    const cy = typeof entry['cy'] === 'number' && Number.isFinite(entry['cy']) ? entry['cy'] : NaN;
    const w = typeof entry['w'] === 'number' && Number.isFinite(entry['w']) ? entry['w'] : NaN;
    const h = typeof entry['h'] === 'number' && Number.isFinite(entry['h']) ? entry['h'] : NaN;
    if (!slot || !artworkId || seenSlots.has(slot) || [cx, cy, w, h].some(Number.isNaN)) {
      rejected += 1;
      continue;
    }
    seenSlots.add(slot);
    const label = typeof entry['label'] === 'string' && entry['label'].trim() ? entry['label'].trim() : undefined;
    out.push({
      slot,
      artworkId,
      cx: clamp01(cx),
      cy: clamp01(cy),
      w: clamp01(w),
      h: clamp01(h),
      ...(label ? { label } : {}),
    });
  }
  return { hotspots: out, rejected };
}

function resolveArtworkIndex(artworkId: string, artworks: readonly Artwork[]): number {
  const orderMatch = /^@order:(\d+)$/.exec(artworkId);
  if (orderMatch) {
    const position = Number.parseInt(orderMatch[1]!, 10);
    return position >= 1 && position <= artworks.length ? position - 1 : -1;
  }
  return artworks.findIndex((artwork) => artwork.id === artworkId);
}

/**
 * Resolves the active hotspot set against the active artwork manifest.
 * Precedence: injected customer config → built-in default table (when the
 * built-in artwork set is active) → order-derived hotspots.
 */
export function resolveHubHotspots(
  artworks: readonly Artwork[],
  injected: unknown
): HubHotspotResolution {
  const sanitized = sanitizeInjectedHotspots(injected);
  let source: HubHotspotSource = 'injected';
  let hotspots: readonly HubHotspot[] = sanitized.hotspots;
  if (hotspots.length === 0) {
    const defaultsResolve = HUB_HOTSPOT_DEFAULTS.every((hotspot) =>
      artworks.some((artwork) => artwork.id === hotspot.artworkId)
    );
    if (defaultsResolve) {
      source = 'built-in-default';
      hotspots = HUB_HOTSPOT_DEFAULTS;
    } else {
      source = 'derived-order';
      hotspots = deriveHotspotsFromArtworks(artworks);
    }
  }
  const resolved: ResolvedHubHotspot[] = hotspots.map((hotspot) => {
    const artworkIndex = resolveArtworkIndex(hotspot.artworkId, artworks);
    const artwork = artworkIndex >= 0 ? artworks[artworkIndex] : undefined;
    return {
      ...hotspot,
      artworkIndex,
      displayLabel: hotspot.label ?? artwork?.title ?? 'Ausstellung betreten',
    };
  });
  return { hotspots: resolved, source, rejected: sanitized.rejected };
}
