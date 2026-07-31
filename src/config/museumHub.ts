/**
 * Museum hub configuration model (v0.80).
 *
 * Replaces the narrow v0.79 hotspot array (`hub-hotspots.json`) with one
 * unified customer configuration: `customer-artworks/museum-hub.json`,
 * injected at runtime as `window.__FREYRAUM_MUSEUM_HUB` by
 * `scripts/import-artworks.mjs` (same Option-C injection pattern as
 * `__FREYRAUM_ARTWORKS`).
 *
 * Model invariants:
 *  - Exact `Artwork.id` values are authoritative. There is no index-based
 *    (`@order:<n>`) canonical mapping anymore.
 *  - Every active manifest artwork receives exactly one selectable slot
 *    unless it is explicitly disabled — explicit mappings first,
 *    deterministic aspect-aware placement second, paginated overflow last.
 *  - Four artworks fit per museum room page; larger exhibitions paginate
 *    automatically (`ceil(N / 4)` pages, page-qualified slot IDs). There is
 *    no six-slot cap.
 *  - Invalid explicit mappings disable that slot; they never resolve to a
 *    different artwork.
 *  - Duplicate slot IDs and duplicate artwork mappings are rejected.
 *
 * The legacy injected hotspot array (`window.__FREYRAUM_HUB_HOTSPOTS`) is
 * temporarily migrated into the new schema with a warning so existing
 * customer configurations keep working during the transition.
 */

import type { Artwork } from './artworks';

// ── Schema types ─────────────────────────────────────────────────────────────

export interface HubSlotPlacement {
  /** Normalized center X in [0, 1] of the hub background content box. */
  cx: number;
  /** Normalized center Y in [0, 1]. */
  cy: number;
  /** Maximum normalized width in [0, 1]. */
  maxW: number;
  /** Maximum normalized height in [0, 1]. */
  maxH: number;
  /** Static perspective rotation applied to the frame (CSS rotateY). */
  rotateYDeg: number;
}

export interface HubSlotConfig {
  /** Stable slot identifier, e.g. `room-01.wall-left.outer`. */
  id: string;
  enabled: boolean;
  selectable: boolean;
  /** Exact `Artwork.id` mapping. Empty = auto-placed by the resolver. */
  artworkId?: string;
  placement: HubSlotPlacement;
}

export interface HubFramePreset {
  color: string;
  depthMm: number;
  roughness: number;
  metalness: number;
}

export interface HubVisualTokens {
  galleryWall: string;
  museumWall: string;
  defaultFramePreset: string;
}

export interface MuseumHubConfig {
  version: number;
  coverage: 'all-active-artworks';
  background: { src: string; aspect: number };
  visualTokens: HubVisualTokens;
  framePresets: Record<string, HubFramePreset>;
  fallbacks: {
    requireAllMapped: boolean;
    autoPlaceUnmapped: boolean;
    overflow: 'paginate';
    invalidMapping: 'disable-slot';
    missingImage: 'placeholder-exact-target';
    selectionTimeoutMs: number;
    selectionTimeout: 'open-exact-target-procedural';
  };
  slots: HubSlotConfig[];
}

/** Aspect class used for deterministic auto-placement. */
export type ArtworkAspectClass = 'portrait' | 'landscape' | 'square' | 'panoramic';

export interface ResolvedHubSlot {
  /** Page-qualified slot ID, e.g. `room-02.wall-left.outer`. */
  id: string;
  /** Zero-based room page index. */
  pageIndex: number;
  placement: HubSlotPlacement;
  /**
   * Exact artwork ID this slot opens. `null` for disabled slots (invalid
   * mapping or explicitly disabled) — a disabled slot never opens another
   * artwork.
   */
  artworkId: string | null;
  /** Manifest index of `artworkId`, or -1 when the slot is disabled. */
  artworkIndex: number;
  /** Display label for the slot (artwork title). */
  displayLabel: string;
  /** Frame preset key resolved for this slot. */
  framePreset: string;
  /** Whether the slot is rendered as a selectable button. */
  selectable: boolean;
  /** Why a slot is disabled (diagnostics; null when selectable). */
  disabledReason: 'invalid-mapping' | 'duplicate-mapping' | 'explicitly-disabled' | null;
  /** Where the mapping came from (diagnostics). */
  mappingSource: 'explicit' | 'auto-placed';
  /** Artwork aspect ratio (width / height) for contain-fit sizing. */
  artworkAspect: number;
}

export interface ResolvedHubPage {
  pageIndex: number;
  slots: readonly ResolvedHubSlot[];
}

export type MuseumHubSource = 'injected' | 'legacy-migrated' | 'built-in-default';

export interface MuseumHubResolution {
  pages: readonly ResolvedHubPage[];
  /** Immutable slot-ID → artwork-ID map (selectable slots only). */
  slotToArtwork: ReadonlyMap<string, string>;
  /** Immutable artwork-ID → slot-ID map (selectable slots only). */
  artworkToSlot: ReadonlyMap<string, string>;
  /** Artwork-ID → presentation image source (browser-cached URL/data URI). */
  artworkImageById: ReadonlyMap<string, string>;
  background: { src: string; aspect: number };
  visualTokens: HubVisualTokens;
  framePresets: Readonly<Record<string, HubFramePreset>>;
  selectionTimeoutMs: number;
  source: MuseumHubSource;
  warnings: readonly string[];
  /** Count of active artworks without a selectable slot (must be 0). */
  unmappedArtworkCount: number;
}

// ── Baseline inventory and defaults ──────────────────────────────────────────

export const HUB_SLOTS_PER_PAGE = 4;

/** Exact 1366:768 design coordinate space (do not round to 16:9). */
export const HUB_BACKGROUND_ASPECT = 1366 / 768;

export const HUB_BACKGROUND_SRC = 'Backgrounds/museum-empty.png';

/** Final grey-wall pick (see plan: candidate table, `#E2E4E3`). */
export const DEFAULT_GALLERY_WALL = '#E2E4E3';

export const DEFAULT_FRAME_PRESET_ID = 'matte-charcoal';

/**
 * Shared static frame material presets. Roughness/metalness remain canonical
 * material metadata; they are translated once into CSS highlight/shadow
 * strengths by `frameMaterialStrengths` (no per-slot styles or WebGL scene).
 */
export const HUB_FRAME_PRESETS: Readonly<Record<string, HubFramePreset>> = {
  'matte-charcoal': { color: '#25282A', depthMm: 20, roughness: 0.78, metalness: 0.04 },
  'warm-oak': { color: '#8A6A48', depthMm: 20, roughness: 0.82, metalness: 0 },
  'dark-anodized-aluminum': { color: '#3A3E42', depthMm: 20, roughness: 0.42, metalness: 0.72 },
};

interface BaselineSlotDef {
  /** Wall-relative slot suffix (page prefix is added per room page). */
  suffix: string;
  placement: HubSlotPlacement;
  intendedUse: ArtworkAspectClass;
}

/**
 * Baseline slot inventory per room page. The first three anchors reuse the
 * repository hotspot calibration; the fourth is a practical panoramic
 * placement over the empty wall (the baked portrait frame is gone).
 */
const BASELINE_SLOTS: readonly BaselineSlotDef[] = [
  {
    suffix: 'wall-left.outer',
    placement: { cx: 0.185, cy: 0.514, maxW: 0.056, maxH: 0.207, rotateYDeg: 18 },
    intendedUse: 'portrait',
  },
  {
    suffix: 'wall-left.inner',
    placement: { cx: 0.381, cy: 0.514, maxW: 0.095, maxH: 0.158, rotateYDeg: 8 },
    intendedUse: 'landscape',
  },
  {
    suffix: 'wall-right.inner',
    placement: { cx: 0.625, cy: 0.515, maxW: 0.098, maxH: 0.16, rotateYDeg: -6 },
    intendedUse: 'square',
  },
  {
    suffix: 'wall-right.outer',
    placement: { cx: 0.819, cy: 0.515, maxW: 0.105, maxH: 0.075, rotateYDeg: -18 },
    intendedUse: 'panoramic',
  },
];

/** Canonical explicit mappings for the built-in fallback artwork set. */
const BUILT_IN_SLOT_MAPPINGS: Readonly<Record<string, string>> = {
  'room-01.wall-left.outer': 'quiet-coastline',
  'room-01.wall-left.inner': 'electric-storm',
  'room-01.wall-right.inner': 'tokyo-passage',
  'room-01.wall-right.outer': 'golden-desert',
};

export const HUB_SELECTION_TIMEOUT_MS = 1500;

// ── Helpers ──────────────────────────────────────────────────────────────────

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const isHexColor = (value: unknown): value is string =>
  typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value.trim());

const roomPagePrefix = (pageIndex: number): string =>
  `room-${String(pageIndex + 1).padStart(2, '0')}`;

export function classifyArtworkAspect(aspect: number): ArtworkAspectClass {
  if (aspect < 0.9) return 'portrait';
  if (aspect <= 1.15) return 'square';
  if (aspect < 1.9) return 'landscape';
  return 'panoramic';
}

/**
 * Translates canonical roughness/metalness metadata once into static CSS
 * highlight and shadow strengths. Keeps a future WebGL frame upgrade possible
 * without adding current draw calls or texture duplication.
 */
export function frameMaterialStrengths(preset: HubFramePreset): {
  highlight: number;
  shadow: number;
} {
  const highlight = clamp01(0.16 + preset.metalness * 0.5 + (1 - preset.roughness) * 0.3);
  const shadow = clamp01(0.3 + preset.roughness * 0.25);
  return {
    highlight: Math.round(highlight * 100) / 100,
    shadow: Math.round(shadow * 100) / 100,
  };
}

function defaultVisualTokens(): HubVisualTokens {
  return {
    galleryWall: DEFAULT_GALLERY_WALL,
    museumWall: DEFAULT_GALLERY_WALL,
    defaultFramePreset: DEFAULT_FRAME_PRESET_ID,
  };
}

function baselinePageSlots(pageIndex: number): HubSlotConfig[] {
  return BASELINE_SLOTS.map((def) => ({
    id: `${roomPagePrefix(pageIndex)}.${def.suffix}`,
    enabled: true,
    selectable: true,
    placement: { ...def.placement },
  }));
}

// ── Sanitizing / migration ───────────────────────────────────────────────────

interface SanitizedConfig {
  config: MuseumHubConfig | null;
  warnings: string[];
  source: MuseumHubSource;
}

function sanitizePlacement(raw: unknown): HubSlotPlacement | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Record<string, unknown>;
  const num = (key: string): number =>
    typeof p[key] === 'number' && Number.isFinite(p[key]) ? (p[key] as number) : NaN;
  const cx = num('cx');
  const cy = num('cy');
  const maxW = num('maxW');
  const maxH = num('maxH');
  const rotateYDeg = typeof p['rotateYDeg'] === 'number' && Number.isFinite(p['rotateYDeg'])
    ? (p['rotateYDeg'] as number)
    : 0;
  if ([cx, cy, maxW, maxH].some(Number.isNaN) || maxW <= 0 || maxH <= 0) return null;
  return {
    cx: clamp01(cx),
    cy: clamp01(cy),
    maxW: clamp01(maxW),
    maxH: clamp01(maxH),
    rotateYDeg: Math.max(-45, Math.min(45, rotateYDeg)),
  };
}

/**
 * Validates an injected `window.__FREYRAUM_MUSEUM_HUB` object. Malformed
 * slots are dropped with warnings; duplicate slot IDs are rejected. Invalid
 * customer color overrides fall back to the defaults.
 */
export function sanitizeMuseumHubConfig(raw: unknown): SanitizedConfig {
  const warnings: string[] = [];
  if (raw === undefined || raw === null) return { config: null, warnings, source: 'built-in-default' };
  if (typeof raw !== 'object' || Array.isArray(raw)) {
    warnings.push('museum-hub config ignored: expected a JSON object.');
    return { config: null, warnings, source: 'built-in-default' };
  }
  const cfg = raw as Record<string, unknown>;

  const tokens = defaultVisualTokens();
  const rawTokens =
    cfg['visualTokens'] && typeof cfg['visualTokens'] === 'object'
      ? (cfg['visualTokens'] as Record<string, unknown>)
      : {};
  if (rawTokens['galleryWall'] !== undefined) {
    if (isHexColor(rawTokens['galleryWall'])) tokens.galleryWall = (rawTokens['galleryWall'] as string).trim();
    else warnings.push('visualTokens.galleryWall is not a valid #RRGGBB color; using default.');
  }
  tokens.museumWall = tokens.galleryWall;
  if (rawTokens['museumWall'] !== undefined) {
    if (isHexColor(rawTokens['museumWall'])) tokens.museumWall = (rawTokens['museumWall'] as string).trim();
    else warnings.push('visualTokens.museumWall is not a valid #RRGGBB color; using galleryWall.');
  }

  const framePresets: Record<string, HubFramePreset> = { ...HUB_FRAME_PRESETS };
  const rawPresets =
    cfg['framePresets'] && typeof cfg['framePresets'] === 'object'
      ? (cfg['framePresets'] as Record<string, unknown>)
      : {};
  for (const [key, value] of Object.entries(rawPresets)) {
    if (!value || typeof value !== 'object') {
      warnings.push(`framePresets.${key} ignored: not an object.`);
      continue;
    }
    const preset = value as Record<string, unknown>;
    const color = isHexColor(preset['color']) ? (preset['color'] as string).trim() : null;
    const roughness =
      typeof preset['roughness'] === 'number' ? clamp01(preset['roughness'] as number) : NaN;
    const metalness =
      typeof preset['metalness'] === 'number' ? clamp01(preset['metalness'] as number) : NaN;
    const depthMm =
      typeof preset['depthMm'] === 'number' && Number.isFinite(preset['depthMm'])
        ? Math.max(4, Math.min(60, preset['depthMm'] as number))
        : 20;
    if (!color || Number.isNaN(roughness) || Number.isNaN(metalness)) {
      warnings.push(`framePresets.${key} ignored: requires color (#RRGGBB), roughness, metalness.`);
      continue;
    }
    framePresets[key] = { color, depthMm, roughness, metalness };
  }
  if (typeof rawTokens['defaultFramePreset'] === 'string' && rawTokens['defaultFramePreset'].trim()) {
    const requested = (rawTokens['defaultFramePreset'] as string).trim();
    if (framePresets[requested]) tokens.defaultFramePreset = requested;
    else warnings.push(`visualTokens.defaultFramePreset "${requested}" is unknown; using default.`);
  }

  let backgroundAspect = HUB_BACKGROUND_ASPECT;
  let backgroundSrc = HUB_BACKGROUND_SRC;
  if (cfg['background'] && typeof cfg['background'] === 'object') {
    const bg = cfg['background'] as Record<string, unknown>;
    if (typeof bg['aspect'] === 'number' && Number.isFinite(bg['aspect']) && bg['aspect'] > 0.5 && bg['aspect'] < 4) {
      backgroundAspect = bg['aspect'];
    }
    if (typeof bg['src'] === 'string' && bg['src'].trim()) backgroundSrc = (bg['src'] as string).trim();
  }

  const rawFallbacks =
    cfg['fallbacks'] && typeof cfg['fallbacks'] === 'object'
      ? (cfg['fallbacks'] as Record<string, unknown>)
      : {};
  const selectionTimeoutMs =
    typeof rawFallbacks['selectionTimeoutMs'] === 'number' &&
    Number.isFinite(rawFallbacks['selectionTimeoutMs'])
      ? Math.max(250, Math.min(10000, rawFallbacks['selectionTimeoutMs'] as number))
      : HUB_SELECTION_TIMEOUT_MS;

  const slots: HubSlotConfig[] = [];
  const seenSlotIds = new Set<string>();
  if (Array.isArray(cfg['slots'])) {
    for (const candidate of cfg['slots'] as unknown[]) {
      if (!candidate || typeof candidate !== 'object') {
        warnings.push('slot ignored: not an object.');
        continue;
      }
      const slot = candidate as Record<string, unknown>;
      const id = typeof slot['id'] === 'string' ? slot['id'].trim() : '';
      const placement = sanitizePlacement(slot['placement']);
      if (!id || !placement) {
        warnings.push(`slot "${id || '?'}" ignored: requires id and a valid placement.`);
        continue;
      }
      if (seenSlotIds.has(id)) {
        warnings.push(`slot "${id}" ignored: duplicate slot ID.`);
        continue;
      }
      seenSlotIds.add(id);
      const artworkId =
        typeof slot['artworkId'] === 'string' && slot['artworkId'].trim()
          ? (slot['artworkId'] as string).trim()
          : undefined;
      slots.push({
        id,
        enabled: slot['enabled'] !== false,
        selectable: slot['selectable'] !== false,
        ...(artworkId ? { artworkId } : {}),
        placement,
      });
    }
  }

  return {
    config: {
      version: typeof cfg['version'] === 'number' ? (cfg['version'] as number) : 1,
      coverage: 'all-active-artworks',
      background: { src: backgroundSrc, aspect: backgroundAspect },
      visualTokens: tokens,
      framePresets,
      fallbacks: {
        requireAllMapped: rawFallbacks['requireAllMapped'] !== false,
        autoPlaceUnmapped: rawFallbacks['autoPlaceUnmapped'] !== false,
        overflow: 'paginate',
        invalidMapping: 'disable-slot',
        missingImage: 'placeholder-exact-target',
        selectionTimeoutMs,
        selectionTimeout: 'open-exact-target-procedural',
      },
      slots,
    },
    warnings,
    source: 'injected',
  };
}

/**
 * Temporary migration for the legacy v0.79 hotspot array
 * (`window.__FREYRAUM_HUB_HOTSPOTS` / `hub-hotspots.json`). Each legacy
 * entry becomes an explicit slot mapping in the unified schema. Emits a
 * deprecation warning so customers move to `museum-hub.json`.
 */
export function migrateLegacyHotspots(raw: unknown): SanitizedConfig {
  const warnings: string[] = [];
  if (!Array.isArray(raw) || raw.length === 0) {
    return { config: null, warnings, source: 'built-in-default' };
  }
  warnings.push(
    'Legacy hub-hotspots.json configuration migrated automatically. Please move to customer-artworks/museum-hub.json.'
  );
  const slots: HubSlotConfig[] = [];
  const seenSlotIds = new Set<string>();
  const baseline = baselinePageSlots(0);
  let baselineCursor = 0;
  for (const candidate of raw) {
    if (!candidate || typeof candidate !== 'object') {
      warnings.push('legacy hotspot ignored: not an object.');
      continue;
    }
    const entry = candidate as Record<string, unknown>;
    const artworkId = typeof entry['artworkId'] === 'string' ? entry['artworkId'].trim() : '';
    const cx = typeof entry['cx'] === 'number' && Number.isFinite(entry['cx']) ? clamp01(entry['cx'] as number) : NaN;
    const cy = typeof entry['cy'] === 'number' && Number.isFinite(entry['cy']) ? clamp01(entry['cy'] as number) : NaN;
    const w = typeof entry['w'] === 'number' && Number.isFinite(entry['w']) ? clamp01(entry['w'] as number) : NaN;
    const h = typeof entry['h'] === 'number' && Number.isFinite(entry['h']) ? clamp01(entry['h'] as number) : NaN;
    if (!artworkId || /^@order:/.test(artworkId) || [cx, cy, w, h].some(Number.isNaN)) {
      warnings.push(`legacy hotspot "${artworkId || '?'}" could not be migrated.`);
      continue;
    }
    // Snap onto the nearest free baseline anchor when close, otherwise keep
    // the calibrated legacy geometry as an explicit custom slot.
    const nearest = baseline.find(
      (slot) =>
        !seenSlotIds.has(slot.id) &&
        Math.abs(slot.placement.cx - cx) < 0.04 &&
        Math.abs(slot.placement.cy - cy) < 0.06
    );
    const id = nearest ? nearest.id : `${roomPagePrefix(0)}.legacy-${(baselineCursor += 1)}`;
    if (seenSlotIds.has(id)) continue;
    seenSlotIds.add(id);
    const rotateYDeg = nearest ? nearest.placement.rotateYDeg : cx < 0.5 ? 12 : -12;
    slots.push({
      id,
      enabled: true,
      selectable: true,
      artworkId,
      placement: { cx, cy, maxW: w, maxH: h, rotateYDeg },
    });
  }
  if (slots.length === 0) return { config: null, warnings, source: 'built-in-default' };
  const sanitized = sanitizeMuseumHubConfig({ version: 1, slots });
  return {
    config: sanitized.config,
    warnings: [...warnings, ...sanitized.warnings],
    source: 'legacy-migrated',
  };
}

// ── Resolver ─────────────────────────────────────────────────────────────────

function artworkAspect(artwork: Artwork): number {
  return artwork.dimensions.height > 0
    ? artwork.dimensions.width / artwork.dimensions.height
    : 1;
}

/**
 * Resolves the active museum-hub composition against the active artwork
 * manifest. Precedence: injected `museum-hub.json` → migrated legacy hotspot
 * array → built-in default config. The resolver guarantees full manifest
 * coverage: explicit valid IDs first, deterministic aspect-aware placement
 * second, paginated overflow last.
 */
export function resolveMuseumHub(
  artworks: readonly Artwork[],
  injectedConfig: unknown,
  legacyInjected?: unknown
): MuseumHubResolution {
  let sanitized = sanitizeMuseumHubConfig(injectedConfig);
  if (!sanitized.config) {
    const migrated = migrateLegacyHotspots(legacyInjected);
    if (migrated.config) sanitized = { ...migrated, warnings: [...sanitized.warnings, ...migrated.warnings] };
  }

  const warnings = [...sanitized.warnings];
  let source: MuseumHubSource = sanitized.config ? sanitized.source : 'built-in-default';

  let configSlots: HubSlotConfig[];
  if (sanitized.config && sanitized.config.slots.length > 0) {
    configSlots = sanitized.config.slots;
  } else {
    // Built-in default: baseline page-1 inventory with the canonical
    // built-in mappings applied wherever those artworks exist.
    configSlots = baselinePageSlots(0).map((slot) => {
      const mappedId = BUILT_IN_SLOT_MAPPINGS[slot.id];
      const exists = mappedId !== undefined && artworks.some((a) => a.id === mappedId);
      return exists ? { ...slot, artworkId: mappedId } : slot;
    });
    if (!sanitized.config) source = 'built-in-default';
  }

  const config = sanitized.config;
  const tokens = config?.visualTokens ?? defaultVisualTokens();
  const framePresets = config?.framePresets ?? { ...HUB_FRAME_PRESETS };
  const background = config?.background ?? { src: HUB_BACKGROUND_SRC, aspect: HUB_BACKGROUND_ASPECT };
  const selectionTimeoutMs = config?.fallbacks.selectionTimeoutMs ?? HUB_SELECTION_TIMEOUT_MS;
  const autoPlaceUnmapped = config?.fallbacks.autoPlaceUnmapped ?? true;
  const defaultPreset = framePresets[tokens.defaultFramePreset]
    ? tokens.defaultFramePreset
    : DEFAULT_FRAME_PRESET_ID;

  const artworkIndexById = new Map<string, number>();
  artworks.forEach((artwork, index) => artworkIndexById.set(artwork.id, index));

  // Phase 1 — explicit mappings from config slots (exact IDs win; duplicates
  // and invalid IDs disable the slot instead of resolving elsewhere).
  const mappedArtworkIds = new Set<string>();
  const resolved: ResolvedHubSlot[] = [];
  const freeSlots: ResolvedHubSlot[] = [];

  for (const slot of configSlots) {
    const pageIndex = Math.max(0, parsePageIndex(slot.id));
    const base: Omit<ResolvedHubSlot, 'artworkId' | 'artworkIndex' | 'displayLabel' | 'selectable' | 'disabledReason' | 'mappingSource' | 'artworkAspect'> = {
      id: slot.id,
      pageIndex,
      placement: slot.placement,
      framePreset: defaultPreset,
    };
    if (!slot.enabled) {
      resolved.push({
        ...base,
        artworkId: null,
        artworkIndex: -1,
        displayLabel: '',
        selectable: false,
        disabledReason: 'explicitly-disabled',
        mappingSource: 'explicit',
        artworkAspect: 1,
      });
      continue;
    }
    if (slot.artworkId) {
      const index = artworkIndexById.get(slot.artworkId);
      if (index === undefined) {
        warnings.push(`slot "${slot.id}": artwork ID "${slot.artworkId}" not in the active manifest; slot disabled.`);
        resolved.push({
          ...base,
          artworkId: null,
          artworkIndex: -1,
          displayLabel: '',
          selectable: false,
          disabledReason: 'invalid-mapping',
          mappingSource: 'explicit',
          artworkAspect: 1,
        });
        continue;
      }
      if (mappedArtworkIds.has(slot.artworkId)) {
        warnings.push(`slot "${slot.id}": artwork "${slot.artworkId}" is already mapped; duplicate slot disabled.`);
        resolved.push({
          ...base,
          artworkId: null,
          artworkIndex: -1,
          displayLabel: '',
          selectable: false,
          disabledReason: 'duplicate-mapping',
          mappingSource: 'explicit',
          artworkAspect: 1,
        });
        continue;
      }
      mappedArtworkIds.add(slot.artworkId);
      const artwork = artworks[index]!;
      resolved.push({
        ...base,
        artworkId: slot.artworkId,
        artworkIndex: index,
        displayLabel: artwork.title,
        selectable: slot.selectable,
        disabledReason: slot.selectable ? null : 'explicitly-disabled',
        mappingSource: 'explicit',
        artworkAspect: artworkAspect(artwork),
      });
      continue;
    }
    // Unmapped enabled slot: available for deterministic auto-placement.
    freeSlots.push({
      ...base,
      artworkId: null,
      artworkIndex: -1,
      displayLabel: '',
      selectable: slot.selectable,
      disabledReason: null,
      mappingSource: 'auto-placed',
      artworkAspect: 1,
    });
  }

  // Phase 2 — deterministic aspect-aware placement of unmapped active
  // artworks: aspect-class match into free page-1 slots first, then stable
  // manifest order into remaining free slots.
  const unmapped = autoPlaceUnmapped
    ? artworks.filter((artwork) => !mappedArtworkIds.has(artwork.id))
    : [];
  const intendedUseBySuffix = new Map<string, ArtworkAspectClass>(
    BASELINE_SLOTS.map((def) => [def.suffix, def.intendedUse])
  );
  const slotIntendedUse = (slot: ResolvedHubSlot): ArtworkAspectClass | undefined => {
    const suffix = slot.id.replace(/^room-\d+\./, '');
    return intendedUseBySuffix.get(suffix);
  };
  const placeInto = (slot: ResolvedHubSlot, artwork: Artwork): void => {
    slot.artworkId = artwork.id;
    slot.artworkIndex = artworkIndexById.get(artwork.id)!;
    slot.displayLabel = artwork.title;
    slot.artworkAspect = artworkAspect(artwork);
    mappedArtworkIds.add(artwork.id);
  };

  const stillUnmapped: Artwork[] = [];
  for (const artwork of unmapped) {
    const aspectClass = classifyArtworkAspect(artworkAspect(artwork));
    const matchIndex = freeSlots.findIndex(
      (slot) => slot.selectable && !slot.artworkId && slotIntendedUse(slot) === aspectClass
    );
    if (matchIndex >= 0) {
      placeInto(freeSlots[matchIndex]!, artwork);
    } else {
      stillUnmapped.push(artwork);
    }
  }
  for (const artwork of stillUnmapped) {
    const free = freeSlots.find((slot) => slot.selectable && !slot.artworkId);
    if (free) placeInto(free, artwork);
  }
  for (const slot of freeSlots) {
    if (slot.artworkId) resolved.push(slot);
    // Free slots that stayed empty are simply not rendered.
  }

  // Phase 3 — paginated overflow: any artwork still unmapped receives a slot
  // on an additional room page with page-qualified slot IDs. No cap.
  let overflow = artworks.filter((artwork) => !mappedArtworkIds.has(artwork.id));
  if (autoPlaceUnmapped && overflow.length > 0) {
    let pageIndex = resolved.reduce((max, slot) => Math.max(max, slot.pageIndex), 0) + 1;
    while (overflow.length > 0) {
      const pageSlots = baselinePageSlots(pageIndex).map<ResolvedHubSlot>((slot) => ({
        id: slot.id,
        pageIndex,
        placement: slot.placement,
        framePreset: defaultPreset,
        artworkId: null,
        artworkIndex: -1,
        displayLabel: '',
        selectable: true,
        disabledReason: null,
        mappingSource: 'auto-placed',
        artworkAspect: 1,
      }));
      const batch = overflow.slice(0, HUB_SLOTS_PER_PAGE);
      const consumed = new Set<string>();
      for (const artwork of batch) {
        const aspectClass = classifyArtworkAspect(artworkAspect(artwork));
        const match = pageSlots.find(
          (slot) => !slot.artworkId && slotIntendedUse(slot) === aspectClass && !consumed.has(slot.id)
        );
        const target = match ?? pageSlots.find((slot) => !slot.artworkId)!;
        consumed.add(target.id);
        placeInto(target, artwork);
      }
      resolved.push(...pageSlots.filter((slot) => slot.artworkId));
      overflow = artworks.filter((artwork) => !mappedArtworkIds.has(artwork.id));
      pageIndex += 1;
    }
  }

  // Assemble pages, immutable maps, and coverage accounting.
  const pageMap = new Map<number, ResolvedHubSlot[]>();
  for (const slot of resolved) {
    const list = pageMap.get(slot.pageIndex) ?? [];
    list.push(slot);
    pageMap.set(slot.pageIndex, list);
  }
  const pages: ResolvedHubPage[] = [...pageMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([pageIndex, slots]) => ({ pageIndex, slots }));

  const slotToArtwork = new Map<string, string>();
  const artworkToSlot = new Map<string, string>();
  for (const slot of resolved) {
    if (slot.selectable && slot.artworkId) {
      slotToArtwork.set(slot.id, slot.artworkId);
      artworkToSlot.set(slot.artworkId, slot.id);
    }
  }
  const unmappedArtworkCount = artworks.filter((a) => !artworkToSlot.has(a.id)).length;
  if (unmappedArtworkCount > 0 && autoPlaceUnmapped) {
    warnings.push(`${unmappedArtworkCount} active artwork(s) without a selectable slot.`);
  }
  const artworkImageById = new Map<string, string>();
  for (const artwork of artworks) artworkImageById.set(artwork.id, artwork.image);

  return {
    pages,
    slotToArtwork,
    artworkToSlot,
    artworkImageById,
    background,
    visualTokens: tokens,
    framePresets,
    selectionTimeoutMs,
    source,
    warnings,
    unmappedArtworkCount,
  };
}

function parsePageIndex(slotId: string): number {
  const match = /^room-(\d+)\./.exec(slotId);
  if (!match) return 0;
  const parsed = Number.parseInt(match[1]!, 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed - 1 : 0;
}
