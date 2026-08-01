/**
 * Museum hub configuration model (v0.82).
 *
 * Uses a versioned wall-plane contract stored in
 * `customer-artworks/museum-hub.json` and injected at runtime as
 * `window.__FREYRAUM_MUSEUM_HUB` by `scripts/import-artworks.mjs`.
 *
 * Model invariants:
 *  - Exact `Artwork.id` values are authoritative.
 *  - Every active manifest artwork receives exactly one selectable slot unless
 *    explicitly disabled.
 *  - Four artworks fit per museum room page; larger exhibitions paginate.
 *  - Invalid explicit mappings disable that slot; they never resolve to a
 *    different artwork.
 *  - Duplicate slot IDs and duplicate artwork mappings are rejected.
 *  - Wall geometry is calibrated once per wall and every artwork on that wall
 *    derives its projected quadrilateral from the same plane.
 */

import type { Artwork } from './artworks';
import {
  clonePolygon,
  clonePoint,
  computeHomographyFromUnitSquare,
  invertMatrix3x3,
  invertWallPoint,
  point,
  pointInPolygon,
  polygonIsClockwise,
  polygonSignedArea,
  polygonsIntersect,
  projectSlotArtwork,
  quadIsConvex,
  quadIsDegenerate,
  shrinkPolygonTowardsCentroid,
  type Point2D,
  type Polygon,
  type Quad,
  type StageReference,
  type WallProjectionModel,
} from '../hub/projectiveGeometry';

// ── Schema types ─────────────────────────────────────────────────────────────

export interface HubVisualTokens {
  galleryWall: string;
  museumWall: string;
}

export interface HubWallConfig {
  id: string;
  group: 'left' | 'right';
  planeAspect: number;
  quad: Quad;
  safePolygon?: Polygon;
  shadowVector?: Point2D;
}

export interface HubSlotPlacement {
  wallId: string;
  center: Point2D;
  mountedHeight: number;
  provisional?: boolean;
}

export interface HubSlotConfig {
  id: string;
  enabled: boolean;
  selectable: boolean;
  artworkId?: string;
  placement: HubSlotPlacement;
}

export interface MuseumHubConfig {
  version: number;
  coverage: 'all-active-artworks';
  stage: StageReference;
  background: { src: string; aspect: number };
  visualTokens: HubVisualTokens;
  walls: HubWallConfig[];
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

export interface ResolvedHubWall extends WallProjectionModel {
  group: 'left' | 'right';
  safePolygon: Point2D[];
  homography: ReturnType<typeof computeHomographyFromUnitSquare>;
  inverseHomography: ReturnType<typeof invertMatrix3x3>;
}

export interface ResolvedHubSlot {
  id: string;
  pageIndex: number;
  placement: HubSlotPlacement;
  artworkId: string | null;
  artworkIndex: number;
  displayLabel: string;
  selectable: boolean;
  disabledReason:
    | 'invalid-mapping'
    | 'duplicate-mapping'
    | 'explicitly-disabled'
    | 'missing-wall'
    | null;
  mappingSource: 'explicit' | 'auto-placed';
  artworkAspect: number;
  wallGroup: 'left' | 'right';
}

export interface ResolvedHubPage {
  pageIndex: number;
  slots: readonly ResolvedHubSlot[];
}

export type MuseumHubSource = 'injected' | 'legacy-migrated' | 'built-in-default' | 'v1-migrated';

export interface MuseumHubResolution {
  pages: readonly ResolvedHubPage[];
  slotToArtwork: ReadonlyMap<string, string>;
  artworkToSlot: ReadonlyMap<string, string>;
  artworkImageById: ReadonlyMap<string, string>;
  background: { src: string; aspect: number };
  stage: StageReference;
  visualTokens: HubVisualTokens;
  walls: readonly ResolvedHubWall[];
  wallById: ReadonlyMap<string, ResolvedHubWall>;
  selectionTimeoutMs: number;
  source: MuseumHubSource;
  warnings: readonly string[];
  unmappedArtworkCount: number;
}

// ── Baseline inventory and defaults ──────────────────────────────────────────

export const HUB_SLOTS_PER_PAGE = 4;
export const HUB_STAGE: StageReference = { width: 1366, height: 768 };
export const HUB_BACKGROUND_ASPECT = HUB_STAGE.width / HUB_STAGE.height;
export const HUB_BACKGROUND_SRC = 'Backgrounds/museum-empty.png';
export const DEFAULT_GALLERY_WALL = '#D8DDDB';
export const HUB_SELECTION_TIMEOUT_MS = 1500;

interface BaselineSlotDef {
  suffix: string;
  wallId: string;
  intendedUse: ArtworkAspectClass;
  placement: HubSlotPlacement;
}

const DEFAULT_WALLS: readonly HubWallConfig[] = [
  {
    id: 'wall-left',
    group: 'left',
    planeAspect: 1.55,
    quad: [
      point(102, 176),
      point(662, 192),
      point(708, 598),
      point(40, 620),
    ],
    safePolygon: shrinkPolygonTowardsCentroid(
      [point(102, 176), point(662, 192), point(708, 598), point(40, 620)],
      0.92
    ),
    shadowVector: point(-12, 16),
  },
  {
    id: 'wall-right',
    group: 'right',
    planeAspect: 1.56,
    quad: [
      point(706, 192),
      point(1264, 176),
      point(1324, 620),
      point(660, 598),
    ],
    safePolygon: shrinkPolygonTowardsCentroid(
      [point(706, 192), point(1264, 176), point(1324, 620), point(660, 598)],
      0.92
    ),
    shadowVector: point(12, 16),
  },
];

const BASELINE_SLOTS: readonly BaselineSlotDef[] = [
  {
    suffix: 'wall-left.outer',
    wallId: 'wall-left',
    intendedUse: 'portrait',
    placement: {
      wallId: 'wall-left',
      center: point(0.16, 0.56),
      mountedHeight: 0.33,
    },
  },
  {
    suffix: 'wall-left.inner',
    wallId: 'wall-left',
    intendedUse: 'landscape',
    placement: {
      wallId: 'wall-left',
      center: point(0.61, 0.56),
      mountedHeight: 0.25,
    },
  },
  {
    suffix: 'wall-right.inner',
    wallId: 'wall-right',
    intendedUse: 'square',
    placement: {
      wallId: 'wall-right',
      center: point(0.34, 0.56),
      mountedHeight: 0.25,
    },
  },
  {
    suffix: 'wall-right.outer',
    wallId: 'wall-right',
    intendedUse: 'panoramic',
    placement: {
      wallId: 'wall-right',
      center: point(0.77, 0.56),
      mountedHeight: 0.19,
    },
  },
];

const BUILT_IN_SLOT_MAPPINGS: Readonly<Record<string, string>> = {
  'room-01.wall-left.outer': 'quiet-coastline',
  'room-01.wall-left.inner': 'electric-storm',
  'room-01.wall-right.inner': 'tokyo-passage',
  'room-01.wall-right.outer': 'golden-desert',
};

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

function defaultVisualTokens(): HubVisualTokens {
  return {
    galleryWall: DEFAULT_GALLERY_WALL,
    museumWall: DEFAULT_GALLERY_WALL,
  };
}

function normalizeStage(stage: StageReference): StageReference {
  const width = Number.isFinite(stage.width) ? Math.max(640, Math.min(4096, stage.width)) : HUB_STAGE.width;
  const height = Number.isFinite(stage.height) ? Math.max(360, Math.min(4096, stage.height)) : HUB_STAGE.height;
  return { width, height };
}

function cloneQuad(quad: Quad): Quad {
  return [clonePoint(quad[0]), clonePoint(quad[1]), clonePoint(quad[2]), clonePoint(quad[3])];
}

function toProjectionWall(wall: HubWallConfig): WallProjectionModel {
  return {
    id: wall.id,
    planeAspect: wall.planeAspect,
    quad: wall.quad,
    safePolygon: wall.safePolygon ?? clonePolygon(shrinkPolygonTowardsCentroid(wall.quad, 0.92)),
    shadowVector: wall.shadowVector,
  };
}

function defaultWalls(): HubWallConfig[] {
  return DEFAULT_WALLS.map((wall) => ({
    ...wall,
    quad: cloneQuad(wall.quad),
    safePolygon: wall.safePolygon ? clonePolygon(wall.safePolygon) : undefined,
    shadowVector: wall.shadowVector ? clonePoint(wall.shadowVector) : undefined,
  }));
}

function baselinePageSlots(pageIndex: number): HubSlotConfig[] {
  return BASELINE_SLOTS.map((def) => ({
    id: `${roomPagePrefix(pageIndex)}.${def.suffix}`,
    enabled: true,
    selectable: true,
    placement: {
      wallId: def.wallId,
      center: clonePoint(def.placement.center),
      mountedHeight: def.placement.mountedHeight,
      provisional: false,
    },
  }));
}

function artworkAspect(artwork: Artwork): number {
  return artwork.dimensions.height > 0
    ? artwork.dimensions.width / artwork.dimensions.height
    : 1;
}

function parsePoint(raw: unknown, clamp = false): Point2D | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  const x = typeof candidate['x'] === 'number' && Number.isFinite(candidate['x']) ? (candidate['x'] as number) : NaN;
  const y = typeof candidate['y'] === 'number' && Number.isFinite(candidate['y']) ? (candidate['y'] as number) : NaN;
  if (Number.isNaN(x) || Number.isNaN(y)) return null;
  return clamp ? point(clamp01(x), clamp01(y)) : point(x, y);
}

function parseQuad(raw: unknown): Quad | null {
  if (!Array.isArray(raw) || raw.length !== 4) return null;
  const points = raw.map((entry) => parsePoint(entry));
  if (points.some((entry) => entry === null)) return null;
  return [points[0]!, points[1]!, points[2]!, points[3]!];
}

function parsePolygon(raw: unknown): Point2D[] | null {
  if (!Array.isArray(raw) || raw.length < 3) return null;
  const points = raw.map((entry) => parsePoint(entry));
  if (points.some((entry) => entry === null)) return null;
  return points as Point2D[];
}

function parseShadowVector(raw: unknown): Point2D | undefined {
  const parsed = parsePoint(raw);
  return parsed ?? undefined;
}

function sanitizeStage(raw: unknown): StageReference {
  if (!raw || typeof raw !== 'object') return { ...HUB_STAGE };
  const candidate = raw as Record<string, unknown>;
  return normalizeStage({
    width: typeof candidate['width'] === 'number' ? (candidate['width'] as number) : HUB_STAGE.width,
    height: typeof candidate['height'] === 'number' ? (candidate['height'] as number) : HUB_STAGE.height,
  });
}

function sanitizeWallConfig(raw: unknown, warnings: string[]): HubWallConfig | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  const id = typeof candidate['id'] === 'string' ? candidate['id'].trim() : '';
  const group = candidate['group'] === 'right' ? 'right' : 'left';
  const planeAspect =
    typeof candidate['planeAspect'] === 'number' && Number.isFinite(candidate['planeAspect'])
      ? Math.max(0.25, Math.min(8, candidate['planeAspect'] as number))
      : NaN;
  const quad = parseQuad(candidate['quad']);
  if (!id || Number.isNaN(planeAspect) || !quad) {
    warnings.push(`wall "${id || '?'}" ignored: requires id, planeAspect, and a four-corner quad.`);
    return null;
  }
  if (quadIsDegenerate(quad) || !quadIsConvex(quad)) {
    warnings.push(`wall "${id}" ignored: quad must be convex and non-degenerate.`);
    return null;
  }
  const safePolygon = parsePolygon(candidate['safePolygon'])
    ?? clonePolygon(shrinkPolygonTowardsCentroid(quad, 0.92));
  if (!polygonIsClockwise(quad)) warnings.push(`wall "${id}": quad was normalized to clockwise winding.`);
  if (Math.abs(polygonSignedArea(safePolygon)) <= 1e-6) {
    warnings.push(`wall "${id}": safePolygon is degenerate; using a derived inset polygon.`);
  }
  return {
    id,
    group,
    planeAspect,
    quad,
    safePolygon,
    shadowVector: parseShadowVector(candidate['shadowVector']),
  };
}

function sanitizeV2Placement(raw: unknown): HubSlotPlacement | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  const wallId = typeof candidate['wallId'] === 'string' ? candidate['wallId'].trim() : '';
  const center = parsePoint(candidate['center'], true);
  const mountedHeight =
    typeof candidate['mountedHeight'] === 'number' && Number.isFinite(candidate['mountedHeight'])
      ? Math.max(0.04, Math.min(0.9, candidate['mountedHeight'] as number))
      : NaN;
  if (!wallId || !center || Number.isNaN(mountedHeight)) return null;
  return {
    wallId,
    center,
    mountedHeight,
    provisional: candidate['provisional'] === true,
  };
}

interface V1Placement {
  cx: number;
  cy: number;
  maxW: number;
  maxH: number;
  rotateYDeg: number;
}

function sanitizeV1Placement(raw: unknown): V1Placement | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  const cx = typeof candidate['cx'] === 'number' && Number.isFinite(candidate['cx']) ? clamp01(candidate['cx'] as number) : NaN;
  const cy = typeof candidate['cy'] === 'number' && Number.isFinite(candidate['cy']) ? clamp01(candidate['cy'] as number) : NaN;
  const maxW = typeof candidate['maxW'] === 'number' && Number.isFinite(candidate['maxW']) ? clamp01(candidate['maxW'] as number) : NaN;
  const maxH = typeof candidate['maxH'] === 'number' && Number.isFinite(candidate['maxH']) ? clamp01(candidate['maxH'] as number) : NaN;
  const rotateYDeg =
    typeof candidate['rotateYDeg'] === 'number' && Number.isFinite(candidate['rotateYDeg'])
      ? Math.max(-45, Math.min(45, candidate['rotateYDeg'] as number))
      : 0;
  if ([cx, cy, maxW, maxH].some(Number.isNaN) || maxW <= 0 || maxH <= 0) return null;
  return { cx, cy, maxW, maxH, rotateYDeg };
}

function migrateV1Placement(
  placement: V1Placement,
  slotId: string,
  walls: readonly HubWallConfig[],
  stage: StageReference
): HubSlotPlacement {
  const preferredWallId = slotId.includes('wall-right') ? 'wall-right' : slotId.includes('wall-left') ? 'wall-left' : placement.cx >= 0.5 ? 'wall-right' : 'wall-left';
  const wall = walls.find((entry) => entry.id === preferredWallId) ?? walls[0]!;
  const projectionWall = toProjectionWall(wall);
  const centerStage = point(placement.cx * stage.width, placement.cy * stage.height);
  const localCenter = invertWallPoint(projectionWall, centerStage) ?? point(0.5, 0.5);
  const topStage = point(centerStage.x, centerStage.y - (placement.maxH * stage.height) / 2);
  const bottomStage = point(centerStage.x, centerStage.y + (placement.maxH * stage.height) / 2);
  const topLocal = invertWallPoint(projectionWall, topStage);
  const bottomLocal = invertWallPoint(projectionWall, bottomStage);
  const localHeight =
    topLocal && bottomLocal ? Math.abs(bottomLocal.y - topLocal.y) : Math.max(0.08, placement.maxH * 1.35);
  return {
    wallId: wall.id,
    center: point(clamp01(localCenter.x), clamp01(localCenter.y)),
    mountedHeight: Math.max(0.06, Math.min(0.9, localHeight)),
    provisional: true,
  };
}

interface SanitizedConfig {
  config: MuseumHubConfig | null;
  warnings: string[];
  source: MuseumHubSource;
}

function sanitizeFallbacks(raw: unknown): MuseumHubConfig['fallbacks'] {
  const candidate = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const selectionTimeoutMs =
    typeof candidate['selectionTimeoutMs'] === 'number' && Number.isFinite(candidate['selectionTimeoutMs'])
      ? Math.max(250, Math.min(10000, candidate['selectionTimeoutMs'] as number))
      : HUB_SELECTION_TIMEOUT_MS;
  return {
    requireAllMapped: candidate['requireAllMapped'] !== false,
    autoPlaceUnmapped: candidate['autoPlaceUnmapped'] !== false,
    overflow: 'paginate',
    invalidMapping: 'disable-slot',
    missingImage: 'placeholder-exact-target',
    selectionTimeoutMs,
    selectionTimeout: 'open-exact-target-procedural',
  };
}

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
  if (rawTokens['museumWall'] !== undefined) {
    if (isHexColor(rawTokens['museumWall'])) tokens.museumWall = (rawTokens['museumWall'] as string).trim();
    else warnings.push('visualTokens.museumWall is not a valid #RRGGBB color; using galleryWall.');
  } else {
    tokens.museumWall = tokens.galleryWall;
  }

  const stage = sanitizeStage(cfg['stage']);
  let backgroundAspect = HUB_BACKGROUND_ASPECT;
  let backgroundSrc = HUB_BACKGROUND_SRC;
  if (cfg['background'] && typeof cfg['background'] === 'object') {
    const background = cfg['background'] as Record<string, unknown>;
    if (
      typeof background['aspect'] === 'number' &&
      Number.isFinite(background['aspect']) &&
      background['aspect'] > 0.5 &&
      background['aspect'] < 4
    ) {
      backgroundAspect = background['aspect'];
    }
    if (typeof background['src'] === 'string' && background['src'].trim()) {
      backgroundSrc = (background['src'] as string).trim();
    }
  }

  const fallbacks = sanitizeFallbacks(cfg['fallbacks']);
  const rawSlots = Array.isArray(cfg['slots']) ? (cfg['slots'] as unknown[]) : [];
  if (rawSlots.length === 0) {
    warnings.push('museum-hub config ignored: expected a non-empty slots array.');
    return { config: null, warnings, source: 'built-in-default' };
  }

  const parsedWalls = Array.isArray(cfg['walls']) ? (cfg['walls'] as unknown[]) : [];
  const walls = parsedWalls.map((entry) => sanitizeWallConfig(entry, warnings)).filter((entry): entry is HubWallConfig => entry !== null);
  const effectiveWalls = walls.length > 0 ? walls : defaultWalls();
  if (parsedWalls.length > 0 && walls.length === 0) {
    warnings.push('museum-hub walls were invalid; using built-in calibrated wall planes.');
  }

  const version = typeof cfg['version'] === 'number' ? (cfg['version'] as number) : 1;
  const seenSlotIds = new Set<string>();
  const slots: HubSlotConfig[] = [];
  let source: MuseumHubSource = 'injected';
  for (const candidate of rawSlots) {
    if (!candidate || typeof candidate !== 'object') {
      warnings.push('slot ignored: not an object.');
      continue;
    }
    const slot = candidate as Record<string, unknown>;
    const id = typeof slot['id'] === 'string' ? slot['id'].trim() : '';
    if (!id) {
      warnings.push('slot ignored: missing id.');
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
    const rawPlacement = slot['placement'];
    const v2Placement = sanitizeV2Placement(rawPlacement);
    let placement: HubSlotPlacement | null = null;
    if (v2Placement) {
      placement = v2Placement;
    } else {
      const v1Placement = sanitizeV1Placement(rawPlacement);
      if (v1Placement) {
        placement = migrateV1Placement(v1Placement, id, effectiveWalls, stage);
        source = version >= 2 ? 'injected' : 'v1-migrated';
      }
    }
    if (!placement) {
      warnings.push(`slot "${id}" ignored: requires a valid v2 placement or migratable v1 placement.`);
      continue;
    }
    slots.push({
      id,
      enabled: slot['enabled'] !== false,
      selectable: slot['selectable'] !== false,
      ...(artworkId ? { artworkId } : {}),
      placement,
    });
  }

  if (slots.length === 0) {
    return { config: null, warnings, source: 'built-in-default' };
  }
  if (source === 'v1-migrated') {
    warnings.push(
      'Version-1 museum-hub slots were migrated to the wall-plane v2 model. Review calibration output and re-save customer-artworks/museum-hub.json.'
    );
  }

  return {
    config: {
      version: 2,
      coverage: 'all-active-artworks',
      stage,
      background: { src: backgroundSrc, aspect: backgroundAspect },
      visualTokens: tokens,
      walls: effectiveWalls,
      fallbacks,
      slots,
    },
    warnings,
    source,
  };
}

/**
 * Temporary migration for the legacy v0.79 hotspot array. Each legacy entry
 * becomes an explicit v2 slot placement over the built-in wall planes.
 */
export function migrateLegacyHotspots(raw: unknown): SanitizedConfig {
  const warnings: string[] = [];
  if (!Array.isArray(raw) || raw.length === 0) {
    return { config: null, warnings, source: 'built-in-default' };
  }
  warnings.push(
    'Legacy hub-hotspots.json configuration migrated automatically. Please move to customer-artworks/museum-hub.json.'
  );
  const walls = defaultWalls();
  const slots: HubSlotConfig[] = [];
  const seenSlotIds = new Set<string>();
  const baseline = baselinePageSlots(0);
  let legacyCursor = 0;
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
    const nearest = baseline.find(
      (slot) =>
        !seenSlotIds.has(slot.id) &&
        Math.abs(slot.placement.center.x - cx) < 0.12 &&
        Math.abs(slot.placement.center.y - cy) < 0.12
    );
    const id = nearest ? nearest.id : `${roomPagePrefix(0)}.legacy-${(legacyCursor += 1)}`;
    if (seenSlotIds.has(id)) continue;
    seenSlotIds.add(id);
    const placement = migrateV1Placement(
      { cx, cy, maxW: w, maxH: h, rotateYDeg: cx < 0.5 ? 12 : -12 },
      id,
      walls,
      HUB_STAGE
    );
    slots.push({
      id,
      enabled: true,
      selectable: true,
      artworkId,
      placement,
    });
  }
  if (slots.length === 0) return { config: null, warnings, source: 'built-in-default' };
  return {
    config: {
      version: 2,
      coverage: 'all-active-artworks',
      stage: { ...HUB_STAGE },
      background: { src: HUB_BACKGROUND_SRC, aspect: HUB_BACKGROUND_ASPECT },
      visualTokens: defaultVisualTokens(),
      walls,
      fallbacks: sanitizeFallbacks(undefined),
      slots,
    },
    warnings,
    source: 'legacy-migrated',
  };
}

// ── Resolver ─────────────────────────────────────────────────────────────────

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
  let config: MuseumHubConfig;
  if (sanitized.config) {
    config = sanitized.config;
  } else {
    config = {
      version: 2,
      coverage: 'all-active-artworks',
      stage: { ...HUB_STAGE },
      background: { src: HUB_BACKGROUND_SRC, aspect: HUB_BACKGROUND_ASPECT },
      visualTokens: defaultVisualTokens(),
      walls: defaultWalls(),
      fallbacks: sanitizeFallbacks(undefined),
      slots: baselinePageSlots(0).map((slot) => {
        const mappedId = BUILT_IN_SLOT_MAPPINGS[slot.id];
        const exists = mappedId !== undefined && artworks.some((artwork) => artwork.id === mappedId);
        return exists ? { ...slot, artworkId: mappedId } : slot;
      }),
    };
    source = 'built-in-default';
  }

  const stage = normalizeStage(config.stage);
  const tokens = config.visualTokens;
  const background = config.background;
  const selectionTimeoutMs = config.fallbacks.selectionTimeoutMs;
  const autoPlaceUnmapped = config.fallbacks.autoPlaceUnmapped;

  const walls: ResolvedHubWall[] = [];
  for (const wall of config.walls) {
    const quad = cloneQuad(wall.quad);
    const safePolygon = wall.safePolygon ? clonePolygon(wall.safePolygon) : clonePolygon(shrinkPolygonTowardsCentroid(quad, 0.92));
    const homography = computeHomographyFromUnitSquare(quad);
    const inverseHomography = homography ? invertMatrix3x3(homography) : null;
    if (!homography || !inverseHomography) {
      warnings.push(`wall "${wall.id}" could not build a homography and will be ignored.`);
      continue;
    }
    walls.push({
      id: wall.id,
      group: wall.group,
      planeAspect: wall.planeAspect,
      quad,
      safePolygon,
      shadowVector: wall.shadowVector ? clonePoint(wall.shadowVector) : undefined,
      homography,
      inverseHomography,
    });
  }
  const wallById = new Map(walls.map((wall) => [wall.id, wall]));

  const artworkIndexById = new Map<string, number>();
  artworks.forEach((artwork, index) => artworkIndexById.set(artwork.id, index));

  const mappedArtworkIds = new Set<string>();
  const resolved: ResolvedHubSlot[] = [];
  const freeSlots: ResolvedHubSlot[] = [];

  for (const slot of config.slots) {
    const pageIndex = Math.max(0, parsePageIndex(slot.id));
    const wall = wallById.get(slot.placement.wallId);
    const wallGroup = wall?.group ?? (slot.placement.wallId.includes('right') ? 'right' : 'left');
    const base: Omit<ResolvedHubSlot, 'artworkId' | 'artworkIndex' | 'displayLabel' | 'selectable' | 'disabledReason' | 'mappingSource' | 'artworkAspect'> = {
      id: slot.id,
      pageIndex,
      placement: {
        wallId: slot.placement.wallId,
        center: clonePoint(slot.placement.center),
        mountedHeight: slot.placement.mountedHeight,
        provisional: slot.placement.provisional === true,
      },
      wallGroup,
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
    if (!wall) {
      warnings.push(`slot "${slot.id}" references unknown wall "${slot.placement.wallId}"; slot disabled.`);
      resolved.push({
        ...base,
        artworkId: null,
        artworkIndex: -1,
        displayLabel: '',
        selectable: false,
        disabledReason: 'missing-wall',
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

  const unmapped = autoPlaceUnmapped ? artworks.filter((artwork) => !mappedArtworkIds.has(artwork.id)) : [];
  const intendedUseBySuffix = new Map<string, ArtworkAspectClass>(
    BASELINE_SLOTS.map((entry) => [entry.suffix, entry.intendedUse])
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
  }

  let overflow = artworks.filter((artwork) => !mappedArtworkIds.has(artwork.id));
  if (autoPlaceUnmapped && overflow.length > 0) {
    let pageIndex = resolved.reduce((max, slot) => Math.max(max, slot.pageIndex), 0) + 1;
    while (overflow.length > 0) {
      const pageSlots = baselinePageSlots(pageIndex).map<ResolvedHubSlot>((slot) => ({
        id: slot.id,
        pageIndex,
        placement: {
          wallId: slot.placement.wallId,
          center: clonePoint(slot.placement.center),
          mountedHeight: slot.placement.mountedHeight,
          provisional: false,
        },
        artworkId: null,
        artworkIndex: -1,
        displayLabel: '',
        selectable: true,
        disabledReason: null,
        mappingSource: 'auto-placed',
        artworkAspect: 1,
        wallGroup: slot.placement.wallId.includes('right') ? 'right' : 'left',
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

  const projectedBySlot = new Map<string, ReturnType<typeof projectSlotArtwork>>();
  for (const slot of resolved) {
    if (!slot.selectable || !slot.artworkId) continue;
    const wall = wallById.get(slot.placement.wallId);
    if (!wall) continue;
    const projected = projectSlotArtwork(wall, slot.placement, slot.artworkAspect, stage);
    projectedBySlot.set(slot.id, projected);
    if (!projected) {
      warnings.push(`slot "${slot.id}": projected geometry is invalid.`);
      continue;
    }
    const withinSafePolygon = projected.localQuad.every((vertex) => pointInPolygon(vertex, wall.safePolygon));
    if (!withinSafePolygon) {
      warnings.push(`slot "${slot.id}": artwork bounds extend outside wall safePolygon.`);
    }
    if (projected.shortEdge < 84) {
      warnings.push(`slot "${slot.id}": projected short edge ${projected.shortEdge.toFixed(1)}px is below the 84px desktop guidance.`);
    }
    if (slot.placement.provisional) {
      warnings.push(`slot "${slot.id}": placement was migrated provisionally and should be recalibrated.`);
    }
  }

  const pageMap = new Map<number, ResolvedHubSlot[]>();
  for (const slot of resolved) {
    const list = pageMap.get(slot.pageIndex) ?? [];
    list.push(slot);
    pageMap.set(slot.pageIndex, list);
  }
  const pages: ResolvedHubPage[] = [...pageMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([pageIndex, slots]) => ({ pageIndex, slots }));

  for (const page of pages) {
    const projectedSlots = page.slots.filter((slot) => slot.selectable && slot.artworkId);
    for (let index = 0; index < projectedSlots.length; index += 1) {
      const current = projectedSlots[index]!;
      const currentProjection = projectedBySlot.get(current.id);
      if (!currentProjection) continue;
      for (let nextIndex = index + 1; nextIndex < projectedSlots.length; nextIndex += 1) {
        const next = projectedSlots[nextIndex]!;
        const nextProjection = projectedBySlot.get(next.id);
        if (!nextProjection) continue;
        if (polygonsIntersect(currentProjection.projectedQuad, nextProjection.projectedQuad)) {
          warnings.push(`page ${page.pageIndex + 1}: slot "${current.id}" overlaps slot "${next.id}".`);
        }
      }
    }
  }

  const slotToArtwork = new Map<string, string>();
  const artworkToSlot = new Map<string, string>();
  for (const slot of resolved) {
    if (slot.selectable && slot.artworkId) {
      slotToArtwork.set(slot.id, slot.artworkId);
      artworkToSlot.set(slot.artworkId, slot.id);
    }
  }
  const unmappedArtworkCount = artworks.filter((artwork) => !artworkToSlot.has(artwork.id)).length;
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
    stage,
    visualTokens: tokens,
    walls,
    wallById,
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
