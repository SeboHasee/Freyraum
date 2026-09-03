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
  calibrateRoomWallToReferenceQuad,
  classifyProjectionConvergence,
  computeHomographyFromUnitSquare,
  evaluateWallProjectionRealism,
  invertMatrix3x3,
  invertWallPoint,
  point,
  point3,
  pointInPolygon,
  polygonIsClockwise,
  polygonSignedArea,
  polygonsIntersect,
  projectRoomPolygon,
  projectRoomWallQuad,
  projectSlotArtwork,
  quadIsConvex,
  quadIsDegenerate,
  solveRoomArtworkPlacement,
  shrinkPolygonTowardsCentroid,
  type CameraCalibration,
  type HangingBand,
  type Point2D,
  type Point3D,
  type Polygon,
  type ProjectionConvergence,
  type Quad,
  type RoomWallModel,
  type StageReference,
  type WallProjectionRealism,
  type WallProjectionModel,
} from '../hub/projectiveGeometry';
import { isReferenceOnlyHubAssetPath } from '../hub/backgroundFallback';

// ── Schema types ─────────────────────────────────────────────────────────────

export interface HubVisualTokens {
  galleryWall: string;
  museumWall: string;
}

export interface HubWallTransform {
  origin: Point3D;
  axisU: Point3D;
  axisV: Point3D;
  width: number;
  height: number;
}

export interface HubRoomConfig {
  floorOutline?: readonly Point3D[];
  bounds?: {
    min: Point3D;
    max: Point3D;
  };
  floorY?: number;
  ceilingY?: number;
  wallThickness?: number;
}

export interface HubHangingRules {
  verticalBand?: {
    minY: number;
    maxY: number;
  };
  sideMargin?: number;
  doorwayClearance?: number;
}

/** Spatial group of a wall inside the square hub room. */
export type HubWallGroup = 'front' | 'left' | 'right' | 'rear';

/**
 * `rendered` walls project into the stage and can carry artwork slots.
 * `bounds-only` walls define the architectural envelope (e.g. the entrance
 * wall behind the camera) but are never rendered nor calibrated.
 */
export type HubWallRole = 'rendered' | 'bounds-only';

export interface HubWallConfig {
  id: string;
  group: HubWallGroup;
  role?: HubWallRole;
  planeAspect: number;
  /** Stage-space reference quad; required for rendered walls. */
  quad?: Quad;
  safePolygon?: Polygon;
  drawableRegion?: Polygon;
  exclusionPolygons?: readonly Polygon[];
  transform?: HubWallTransform;
  hangingBand?: HangingBand;
  shadowVector?: Point2D;
  room?: RoomWallModel;
}

export interface HubSlotPlacement {
  wallId: string;
  /** v5 canonical horizontal position along wall U, normalized to 0..1. */
  horizontalPosition?: number;
  /** v5 canonical visual center above the wall origin, in metres. */
  centerHeight?: number;
  /** v5 canonical physical artwork height, in metres. */
  physicalHeight?: number;
  /** v5 canonical clearance between wall and artwork back, in metres. */
  mountingGap?: number;
  /** Legacy/projected alias, derived from the canonical fields for runtime compatibility. */
  center: Point2D;
  /** Legacy physical-height alias. */
  mountedHeight: number;
  /** v3 wall-local anchor in metric-like units; `center` remains migration-only. */
  anchor?: Point2D;
  /** v4 normalized wall-local anchor (0..1, y grows upward). */
  uv?: Point2D;
  targetSizePolicy?: 'contain' | 'fixed-height';
  minScale?: number;
  maxScale?: number;
  zOffset?: number;
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
  backgroundFallback: { src: string };
  visualTokens: HubVisualTokens;
  camera?: CameraCalibration;
  room?: HubRoomConfig;
  hangingRules?: HubHangingRules;
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
  /** Hero-room capacity per overflow page (sanitized 1–8, default 6). */
  slotsPerPage?: number;
  slots: HubSlotConfig[];
}

/** Aspect class used for deterministic auto-placement. */
export type ArtworkAspectClass = 'portrait' | 'landscape' | 'square' | 'panoramic';

export interface ResolvedHubWall extends WallProjectionModel {
  group: HubWallGroup;
  transform: HubWallTransform;
  safePolygon: Point2D[];
  drawableRegion?: Polygon;
  exclusionPolygons?: readonly Polygon[];
  hangingBand?: HangingBand;
  homography: ReturnType<typeof computeHomographyFromUnitSquare>;
  inverseHomography: ReturnType<typeof invertMatrix3x3>;
  room?: RoomWallModel;
  camera?: CameraCalibration;
  referenceQuad: Quad;
  referenceSafePolygon: Point2D[];
  projectedQuad: Quad | null;
  projectedSafePolygon: Point2D[] | null;
  localCalibrationScale: { x: number; y: number };
  projectionRealism?: WallProjectionRealism;
  expectedConvergence: ProjectionConvergence;
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
    | 'invalid-placement'
    | 'invalid-projection'
    | 'projection-realism'
    | null;
  mappingSource: 'explicit' | 'auto-placed';
  artworkAspect: number;
  wallGroup: HubWallGroup;
}

export interface ResolvedHubPage {
  pageIndex: number;
  slots: readonly ResolvedHubSlot[];
}

export type MuseumHubSource = 'injected' | 'legacy-migrated' | 'built-in-default' | 'v1-migrated';

export interface ResolvedHubRoom {
  floorOutline: readonly Point3D[];
  bounds: {
    min: Point3D;
    max: Point3D;
  };
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  floorY: number;
  ceilingY: number;
  wallThickness: number;
  wallIds: readonly string[];
}

export interface MuseumHubResolution {
  pages: readonly ResolvedHubPage[];
  slotToArtwork: ReadonlyMap<string, string>;
  artworkToSlot: ReadonlyMap<string, string>;
  artworkImageById: ReadonlyMap<string, string>;
  artworkSourceById: ReadonlyMap<
    string,
    {
      image: string;
      webglImage: string | null;
      dimensions: Artwork['dimensions'];
      imageSourceContext?: Artwork['imageSourceContext'];
    }
  >;
  background: { src: string; aspect: number };
  backgroundFallback: { src: string };
  stage: StageReference;
  visualTokens: HubVisualTokens;
  camera: CameraCalibration;
  room: ResolvedHubRoom;
  hangingRules: HubHangingRules;
  walls: readonly ResolvedHubWall[];
  wallById: ReadonlyMap<string, ResolvedHubWall>;
  slotsPerPage: number;
  selectionTimeoutMs: number;
  source: MuseumHubSource;
  warnings: readonly string[];
  unmappedArtworkCount: number;
}

// ── Baseline inventory and defaults ──────────────────────────────────────────

export const HUB_SLOTS_PER_PAGE = 6;
export const HUB_STAGE: StageReference = { width: 1366, height: 768 };
export const HUB_BACKGROUND_ASPECT = HUB_STAGE.width / HUB_STAGE.height;
export const HUB_BACKGROUND_SRC = 'Backgrounds/museum-empty.png';
export const DEFAULT_GALLERY_WALL = '#C7CED4';
export const HUB_SELECTION_TIMEOUT_MS = 1500;
export const HUB_MIN_PROJECTED_SHORT_EDGE_PX = 72;
export const HUB_CAMERA: CameraCalibration = {
  position: point3(0, 1.72, 9),
  target: point3(0, 2.05, -1.2),
  verticalFovDeg: 48,
  near: 0.1,
  far: 40,
  lensShift: point(0, 0),
};

// ── Elongated hero-room envelope (v1.02) ─────────────────────────────────────
// 9 × 12 m daylit gallery: x ∈ [−4.5, +4.5], z ∈ [−5.5, +6.5], height 5.2 m.
// Three rendered walls plus a bounds-only entrance wall close the envelope.
export const HUB_ROOM_WIDTH = 9;
export const HUB_ROOM_DEPTH = 12;
export const HUB_ROOM_HEIGHT = 5.2;
/** Mirrored side-wall doorways: z ∈ [+1.5, +2.55], 1.05 × 2.30 m, floor-based. */
export const HUB_DOORWAY_WIDTH = 1.05;
export const HUB_DOORWAY_HEIGHT = 2.3;

function roomWall(
  origin: Point3D,
  axisU: Point3D,
  width: number,
  height: number,
  doorwayExclusions: readonly Polygon[] = []
): RoomWallModel {
  const inset = 0.14;
  return {
    origin,
    axisU,
    axisV: point3(0, 1, 0),
    width,
    height,
    safePolygon: [
      point(inset, inset),
      point(width - inset, inset),
      point(width - inset, height - inset),
      point(inset, height - inset),
    ],
    doorwayExclusions,
    hangingBand: { minY: 0.42, maxY: height - 0.28, margin: 0.08 },
  };
}

function wallTransform(
  origin: Point3D,
  axisU: Point3D,
  width: number,
  height: number
): HubWallTransform {
  return {
    origin,
    axisU,
    axisV: point3(0, 1, 0),
    width,
    height,
  };
}

interface BaselineSlotDef {
  suffix: string;
  wallId: string;
  intendedUse: ArtworkAspectClass;
  placement: HubSlotPlacement;
}

const DEFAULT_WALLS: readonly HubWallConfig[] = [
  {
    id: 'wall-front',
    group: 'front',
    planeAspect: HUB_ROOM_WIDTH / HUB_ROOM_HEIGHT,
    quad: [
      point(417.26, 206.29),
      point(948.74, 206.29),
      point(951.84, 514.71),
      point(414.16, 514.71),
    ],
    safePolygon: [
      point(422.61, 506.32),
      point(943.39, 506.32),
      point(940.55, 214.5),
      point(425.45, 214.5),
    ],
    drawableRegion: [point(0.14, 0.14), point(8.86, 0.14), point(8.86, 4.92), point(0.14, 4.92)],
    transform: wallTransform(point3(-4.5, 0, -5.5), point3(1, 0, 0), HUB_ROOM_WIDTH, HUB_ROOM_HEIGHT),
    hangingBand: { minY: 0.42, maxY: 3.4, margin: 0.08 },
    shadowVector: point(0, 14),
    room: roomWall(point3(-4.5, 0, -5.5), point3(1, 0, 0), HUB_ROOM_WIDTH, HUB_ROOM_HEIGHT),
  },
  {
    id: 'wall-right',
    group: 'right',
    planeAspect: HUB_ROOM_DEPTH / HUB_ROOM_HEIGHT,
    quad: [
      point(948.74, 206.29),
      point(2169.34, -738.13),
      point(2271.63, 1019.43),
      point(951.84, 514.71),
    ],
    safePolygon: [
      point(954.38, 507.24),
      point(2182.95, 938.83),
      point(2096.06, -637.45),
      point(951.4, 212.59),
    ],
    drawableRegion: [point(0.14, 0.14), point(11.86, 0.14), point(11.86, 4.92), point(0.14, 4.92)],
    exclusionPolygons: [
      [point(8, 0), point(9.05, 0), point(9.05, HUB_DOORWAY_HEIGHT), point(8, HUB_DOORWAY_HEIGHT)],
    ],
    transform: wallTransform(point3(4.5, 0, -5.5), point3(0, 0, 1), HUB_ROOM_DEPTH, HUB_ROOM_HEIGHT),
    hangingBand: { minY: 0.42, maxY: 3.4, margin: 0.08 },
    shadowVector: point(8, 14),
    room: roomWall(point3(4.5, 0, -5.5), point3(0, 0, 1), HUB_ROOM_DEPTH, HUB_ROOM_HEIGHT, [
      [point(8, 0), point(9.05, 0), point(9.05, HUB_DOORWAY_HEIGHT), point(8, HUB_DOORWAY_HEIGHT)],
    ]),
  },
  {
    id: 'wall-rear',
    group: 'rear',
    role: 'bounds-only',
    planeAspect: HUB_ROOM_WIDTH / HUB_ROOM_HEIGHT,
    transform: wallTransform(point3(4.5, 0, 6.5), point3(-1, 0, 0), HUB_ROOM_WIDTH, HUB_ROOM_HEIGHT),
  },
  {
    id: 'wall-left',
    group: 'left',
    planeAspect: HUB_ROOM_DEPTH / HUB_ROOM_HEIGHT,
    quad: [
      point(-803.34, -738.13),
      point(417.26, 206.29),
      point(414.16, 514.71),
      point(-905.63, 1019.43),
    ],
    safePolygon: [
      point(-816.95, 938.83),
      point(411.62, 507.24),
      point(414.6, 212.59),
      point(-730.06, -637.45),
    ],
    drawableRegion: [point(0.14, 0.14), point(11.86, 0.14), point(11.86, 4.92), point(0.14, 4.92)],
    exclusionPolygons: [
      [point(2.95, 0), point(4, 0), point(4, HUB_DOORWAY_HEIGHT), point(2.95, HUB_DOORWAY_HEIGHT)],
    ],
    transform: wallTransform(point3(-4.5, 0, 6.5), point3(0, 0, -1), HUB_ROOM_DEPTH, HUB_ROOM_HEIGHT),
    hangingBand: { minY: 0.42, maxY: 3.4, margin: 0.08 },
    shadowVector: point(-8, 14),
    room: roomWall(point3(-4.5, 0, 6.5), point3(0, 0, -1), HUB_ROOM_DEPTH, HUB_ROOM_HEIGHT, [
      [point(2.95, 0), point(4, 0), point(4, HUB_DOORWAY_HEIGHT), point(2.95, HUB_DOORWAY_HEIGHT)],
    ]),
  },
];

export const HUB_HERO_CENTERLINE_M = 1.9;
export const HUB_ARTWORK_MOUNTING_GAP_M = 0.002;
export const HUB_MIN_ARTWORK_SPACING_M = 0.5;

function curatedPlacement(
  wallId: string,
  horizontalPosition: number,
  wallWidth: number,
  physicalHeight: number
): HubSlotPlacement {
  const centerHeight = HUB_HERO_CENTERLINE_M;
  const mountingGap = HUB_ARTWORK_MOUNTING_GAP_M;
  return {
    wallId,
    horizontalPosition,
    centerHeight,
    physicalHeight,
    mountingGap,
    center: point(horizontalPosition, 1 - centerHeight / HUB_ROOM_HEIGHT),
    anchor: point(horizontalPosition * wallWidth, centerHeight),
    uv: point(horizontalPosition, centerHeight / HUB_ROOM_HEIGHT),
    mountedHeight: physicalHeight,
    targetSizePolicy: 'fixed-height',
    minScale: 1,
    maxScale: 1,
    zOffset: mountingGap + 0.022,
  };
}

// 2 + 2 + 2 hero composition on a shared 1.90 m visual centerline. Physical
// heights are curated per role/aspect rather than forced to one generic size.
const BASELINE_SLOTS: readonly BaselineSlotDef[] = [
  {
    suffix: 'wall-front.a',
    wallId: 'wall-front',
    intendedUse: 'portrait',
    placement: curatedPlacement('wall-front', 0.28, HUB_ROOM_WIDTH, 2.25),
  },
  {
    suffix: 'wall-front.b',
    wallId: 'wall-front',
    intendedUse: 'panoramic',
    placement: curatedPlacement('wall-front', 0.72, HUB_ROOM_WIDTH, 2.05),
  },
  {
    suffix: 'wall-left.a',
    wallId: 'wall-left',
    intendedUse: 'landscape',
    placement: curatedPlacement('wall-left', 0.84, HUB_ROOM_DEPTH, 2),
  },
  {
    suffix: 'wall-left.b',
    wallId: 'wall-left',
    intendedUse: 'square',
    placement: curatedPlacement('wall-left', 0.585, HUB_ROOM_DEPTH, 1.75),
  },
  {
    suffix: 'wall-right.a',
    wallId: 'wall-right',
    intendedUse: 'landscape',
    placement: curatedPlacement('wall-right', 0.16, HUB_ROOM_DEPTH, 2),
  },
  {
    suffix: 'wall-right.b',
    wallId: 'wall-right',
    intendedUse: 'square',
    placement: curatedPlacement('wall-right', 0.415, HUB_ROOM_DEPTH, 1.75),
  },
];

const BASELINE_WALL_BY_SUFFIX = new Map<string, string>(
  BASELINE_SLOTS.map((entry) => [entry.suffix, entry.wallId])
);

const BUILT_IN_SLOT_MAPPINGS: Readonly<Record<string, string>> = {
  'room-01.wall-front.a': 'quiet-coastline',
  'room-01.wall-front.b': 'golden-desert',
  'room-01.wall-left.a': 'electric-storm',
  'room-01.wall-left.b': 'tokyo-passage',
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

function defaultHangingRules(): HubHangingRules {
  return {
    verticalBand: {
      minY: 0.42,
      maxY: 3.12,
    },
    sideMargin: 0.14,
    doorwayClearance: 0.35,
  };
}

function expectedWallConvergence(referenceQuad: Quad): ProjectionConvergence {
  return classifyProjectionConvergence(referenceQuad, 0.01);
}

function normalizeStage(stage: StageReference): StageReference {
  const width = Number.isFinite(stage.width) ? Math.max(640, Math.min(4096, stage.width)) : HUB_STAGE.width;
  const height = Number.isFinite(stage.height) ? Math.max(360, Math.min(4096, stage.height)) : HUB_STAGE.height;
  return { width, height };
}

function cloneQuad(quad: Quad): Quad {
  return [clonePoint(quad[0]), clonePoint(quad[1]), clonePoint(quad[2]), clonePoint(quad[3])];
}

function clonePoint3(value: Point3D): Point3D {
  return point3(value.x, value.y, value.z);
}

function cloneWallTransform(transform: HubWallTransform): HubWallTransform {
  return {
    origin: clonePoint3(transform.origin),
    axisU: clonePoint3(transform.axisU),
    axisV: clonePoint3(transform.axisV),
    width: transform.width,
    height: transform.height,
  };
}

function cloneRoomWall(room: RoomWallModel): RoomWallModel {
  return {
    origin: clonePoint3(room.origin),
    axisU: clonePoint3(room.axisU),
    axisV: clonePoint3(room.axisV),
    width: room.width,
    height: room.height,
    safePolygon: clonePolygon(room.safePolygon),
    doorwayExclusions: room.doorwayExclusions.map((polygon) => clonePolygon(polygon)),
    hangingBand: { ...room.hangingBand },
  };
}

function cloneCamera(camera: CameraCalibration): CameraCalibration {
  return {
    position: clonePoint3(camera.position),
    target: clonePoint3(camera.target),
    verticalFovDeg: camera.verticalFovDeg,
    near: camera.near,
    far: camera.far,
    lensShift: camera.lensShift ? clonePoint(camera.lensShift) : undefined,
  };
}

function toProjectionWall(wall: HubWallConfig): WallProjectionModel {
  const quad: Quad = wall.quad
    ? cloneQuad(wall.quad)
    : [point(0, 0), point(1, 0), point(1, 1), point(0, 1)];
  return {
    id: wall.id,
    planeAspect: wall.planeAspect,
    quad,
    safePolygon:
      wall.drawableRegion
      ?? wall.safePolygon
      ?? clonePolygon(shrinkPolygonTowardsCentroid(quad, 0.92)),
    shadowVector: wall.shadowVector,
    room: wall.room,
  };
}

function defaultWalls(): HubWallConfig[] {
  return DEFAULT_WALLS.map((wall) => ({
    ...wall,
    quad: wall.quad ? cloneQuad(wall.quad) : undefined,
    safePolygon: wall.safePolygon ? clonePolygon(wall.safePolygon) : undefined,
    drawableRegion: wall.drawableRegion ? clonePolygon(wall.drawableRegion) : undefined,
    exclusionPolygons: wall.exclusionPolygons?.map((polygon) => clonePolygon(polygon)),
    transform: wall.transform ? cloneWallTransform(wall.transform) : undefined,
    hangingBand: wall.hangingBand ? { ...wall.hangingBand } : undefined,
    shadowVector: wall.shadowVector ? clonePoint(wall.shadowVector) : undefined,
    room: wall.room ? cloneRoomWall(wall.room) : undefined,
  }));
}

function deriveFloorOutlineFromWalls(walls: readonly HubWallConfig[]): Point3D[] {
  const outline: Point3D[] = [];
  for (const wall of walls) {
    const transform = wall.transform;
    if (!transform) continue;
    outline.push(clonePoint3(transform.origin));
  }
  const lastWall = [...walls].reverse().find((wall) => wall.transform);
  if (lastWall?.transform) {
    outline.push(
      point3(
        lastWall.transform.origin.x + lastWall.transform.axisU.x * lastWall.transform.width,
        lastWall.transform.origin.y + lastWall.transform.axisU.y * lastWall.transform.width,
        lastWall.transform.origin.z + lastWall.transform.axisU.z * lastWall.transform.width
      )
    );
  }
  return outline.length >= 3 ? outline : [
    point3(-3.5, 0, -2.5),
    point3(3.5, 0, -2.5),
    point3(3.5, 0, 4.5),
    point3(-3.5, 0, 4.5),
  ];
}

function deriveRoomBounds(
  walls: readonly HubWallConfig[],
  floorOutline: readonly Point3D[]
): { min: Point3D; max: Point3D } {
  const wallPoints = walls.flatMap((wall) => {
    const transform = wall.transform;
    if (!transform) return [];
    return [
      transform.origin,
      point3(
        transform.origin.x + transform.axisU.x * transform.width,
        transform.origin.y + transform.axisU.y * transform.width + transform.axisV.y * transform.height,
        transform.origin.z + transform.axisU.z * transform.width + transform.axisV.z * transform.height
      ),
    ];
  });
  const points = [...floorOutline, ...wallPoints];
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const zs = points.map((point) => point.z);
  return {
    min: point3(Math.min(...xs), Math.min(...ys), Math.min(...zs)),
    max: point3(Math.max(...xs), Math.max(...ys), Math.max(...zs)),
  };
}

function defaultRoomConfig(walls: readonly HubWallConfig[]): HubRoomConfig {
  const floorOutline = deriveFloorOutlineFromWalls(walls);
  const bounds = deriveRoomBounds(walls, floorOutline);
  return {
    floorOutline,
    bounds,
    floorY: bounds.min.y,
    ceilingY: bounds.max.y,
    wallThickness: 0.08,
  };
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
      anchor: def.placement.anchor ? clonePoint(def.placement.anchor) : undefined,
      uv: def.placement.uv ? clonePoint(def.placement.uv) : undefined,
      horizontalPosition: def.placement.horizontalPosition,
      centerHeight: def.placement.centerHeight,
      physicalHeight: def.placement.physicalHeight,
      mountingGap: def.placement.mountingGap,
      targetSizePolicy: def.placement.targetSizePolicy,
      minScale: def.placement.minScale,
      maxScale: def.placement.maxScale,
      zOffset: def.placement.zOffset,
      provisional: false,
    },
  }));
}

function artworkAspect(artwork: Artwork): number {
  return artwork.dimensions.height > 0
    ? artwork.dimensions.width / artwork.dimensions.height
    : 1;
}

function derivePlacementUv(
  placement: HubSlotPlacement,
  wall?: Pick<ResolvedHubWall, 'room'>
): Point2D | undefined {
  if (
    placement.horizontalPosition !== undefined &&
    placement.centerHeight !== undefined &&
    wall?.room
  ) {
    return point(
      clamp01(placement.horizontalPosition),
      clamp01(placement.centerHeight / Math.max(0.001, wall.room.height))
    );
  }
  if (placement.uv) return clonePoint(placement.uv);
  if (placement.anchor && wall?.room) {
    return point(
      clamp01(placement.anchor.x / Math.max(0.001, wall.room.width)),
      clamp01(placement.anchor.y / Math.max(0.001, wall.room.height))
    );
  }
  return point(clamp01(placement.center.x), clamp01(1 - placement.center.y));
}

function derivePlacementAnchor(
  placement: HubSlotPlacement,
  wall?: Pick<ResolvedHubWall, 'room'>
): Point2D | undefined {
  if (
    placement.horizontalPosition !== undefined &&
    placement.centerHeight !== undefined &&
    wall?.room
  ) {
    return point(
      clamp01(placement.horizontalPosition) * wall.room.width,
      placement.centerHeight
    );
  }
  if (placement.anchor) return clonePoint(placement.anchor);
  const uv = derivePlacementUv(placement, wall);
  if (!uv || !wall?.room) return undefined;
  return point(uv.x * wall.room.width, uv.y * wall.room.height);
}

function polygonCentroid(points: readonly Point2D[]): Point2D {
  const total = points.reduce(
    (accumulator, current) => point(accumulator.x + current.x, accumulator.y + current.y),
    point(0, 0)
  );
  return point(total.x / Math.max(1, points.length), total.y / Math.max(1, points.length));
}

function candidateFallbackWalls(
  currentWallId: string,
  walls: readonly ResolvedHubWall[],
  preferredGroup: HubWallGroup
): ResolvedHubWall[] {
  const currentIndex = Math.max(0, walls.findIndex((wall) => wall.id === currentWallId));
  return [...walls].sort((a, b) => {
    const aSameWall = a.id === currentWallId ? -1 : 0;
    const bSameWall = b.id === currentWallId ? -1 : 0;
    if (aSameWall !== bSameWall) return aSameWall - bSameWall;
    const aGroup = a.group === preferredGroup ? 0 : 1;
    const bGroup = b.group === preferredGroup ? 0 : 1;
    if (aGroup !== bGroup) return aGroup - bGroup;
    return Math.abs(currentIndex - walls.findIndex((wall) => wall.id === a.id))
      - Math.abs(currentIndex - walls.findIndex((wall) => wall.id === b.id));
  });
}

function clampSlotPlacementToDrawableRegion(
  wall: ResolvedHubWall,
  placement: HubSlotPlacement,
  artworkAspectRatio: number,
  stage: StageReference
): { center: Point2D; anchor?: Point2D; mountedHeight: number; adjusted: boolean } {
  if (wall.room && placement.anchor) {
    const fitted = solveRoomArtworkPlacement(
      wall.room,
      placement.anchor,
      placement.mountedHeight,
      artworkAspectRatio
    );
    return {
      center: placement.center,
      anchor: fitted.anchor,
      mountedHeight: fitted.mountedHeight,
      adjusted:
        Math.abs(fitted.anchor.x - placement.anchor.x) > 1e-6 ||
        Math.abs(fitted.anchor.y - placement.anchor.y) > 1e-6 ||
        Math.abs(fitted.mountedHeight - placement.mountedHeight) > 1e-6,
    };
  }
  const aspect = Math.max(0.25, artworkAspectRatio);
  const wallAspect = Math.max(0.25, wall.planeAspect);
  let center = point(clamp01(placement.center.x), clamp01(placement.center.y));
  let mountedHeight = Math.max(0.04, Math.min(0.9, placement.mountedHeight));
  let adjusted = center.x !== placement.center.x || center.y !== placement.center.y || mountedHeight !== placement.mountedHeight;

  const containMaxHeight = Math.max(0.04, Math.min(0.9, wallAspect / aspect));
  if (mountedHeight > containMaxHeight) {
    mountedHeight = containMaxHeight;
    adjusted = true;
  }

  const clampCenterWithinLocalUnit = (): void => {
    const mountedWidth = (mountedHeight * aspect) / wallAspect;
    const halfWidth = mountedWidth / 2;
    const halfHeight = mountedHeight / 2;
    const minX = Math.max(0, halfWidth);
    const maxX = Math.min(1, 1 - halfWidth);
    const minY = Math.max(0, halfHeight);
    const maxY = Math.min(1, 1 - halfHeight);
    const clampedX = Math.max(minX, Math.min(maxX, center.x));
    const clampedY = Math.max(minY, Math.min(maxY, center.y));
    if (clampedX !== center.x || clampedY !== center.y) adjusted = true;
    center = point(clampedX, clampedY);
  };
  clampCenterWithinLocalUnit();

  const projectCurrent = (): ReturnType<typeof projectSlotArtwork> =>
    projectSlotArtwork(
      wall,
      {
        wallId: placement.wallId,
        center,
        mountedHeight,
      },
      aspect,
      stage
    );
  const containedCornerCount = (projected: ReturnType<typeof projectSlotArtwork> | null): number => {
    if (!projected) return -1;
    return projected.projectedQuad.reduce(
      (count, vertex) => count + (pointInPolygon(vertex, wall.safePolygon) ? 1 : 0),
      0
    );
  };

  let bestScore = containedCornerCount(projectCurrent());
  let bestCenter = center;
  let bestHeight = mountedHeight;
  if (bestScore === 4) {
    return { center: bestCenter, mountedHeight: bestHeight, adjusted };
  }

  const safeLocalAnchor = (() => {
    const local = invertWallPoint(wall, polygonCentroid(wall.safePolygon));
    return local ? point(clamp01(local.x), clamp01(local.y)) : point(0.5, 0.5);
  })();

  for (let attempt = 0; attempt < 36; attempt += 1) {
    center = point(
      clamp01(center.x + (safeLocalAnchor.x - center.x) * 0.22),
      clamp01(center.y + (safeLocalAnchor.y - center.y) * 0.22)
    );
    mountedHeight = Math.max(0.04, Math.min(containMaxHeight, mountedHeight * 0.985));
    clampCenterWithinLocalUnit();
    const projection = projectCurrent();
    const score = containedCornerCount(projection);
    if (score > bestScore) {
      bestScore = score;
      bestCenter = center;
      bestHeight = mountedHeight;
    }
    if (bestScore === 4) break;
  }

  const changed =
    Math.abs(bestCenter.x - placement.center.x) > 1e-6 ||
    Math.abs(bestCenter.y - placement.center.y) > 1e-6 ||
    Math.abs(bestHeight - placement.mountedHeight) > 1e-6;
  return {
    center: bestCenter,
    mountedHeight: bestHeight,
    adjusted: adjusted || changed,
  };
}

function parsePoint(raw: unknown, clamp = false): Point2D | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  const x = typeof candidate['x'] === 'number' && Number.isFinite(candidate['x']) ? (candidate['x'] as number) : NaN;
  const y = typeof candidate['y'] === 'number' && Number.isFinite(candidate['y']) ? (candidate['y'] as number) : NaN;
  if (Number.isNaN(x) || Number.isNaN(y)) return null;
  return clamp ? point(clamp01(x), clamp01(y)) : point(x, y);
}

function parsePoint3(raw: unknown): Point3D | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  const x = candidate['x'];
  const y = candidate['y'];
  const z = candidate['z'];
  if (
    typeof x !== 'number' ||
    typeof y !== 'number' ||
    typeof z !== 'number' ||
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(z)
  ) {
    return null;
  }
  return point3(x, y, z);
}

function parseHangingBand(raw: unknown, height: number): HangingBand | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  const minY = candidate['minY'];
  const maxY = candidate['maxY'];
  const margin = candidate['margin'];
  if (
    typeof minY !== 'number' ||
    typeof maxY !== 'number' ||
    typeof margin !== 'number' ||
    !Number.isFinite(minY) ||
    !Number.isFinite(maxY) ||
    !Number.isFinite(margin) ||
    minY < 0 ||
    maxY > height ||
    maxY - minY <= 0.2 ||
    margin < 0 ||
    margin * 2 >= maxY - minY
  ) {
    return null;
  }
  return { minY, maxY, margin };
}

function parseWallTransform(raw: unknown): HubWallTransform | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  const origin = parsePoint3(candidate['origin']);
  const axisU = parsePoint3(candidate['axisU']);
  const axisV = parsePoint3(candidate['axisV']) ?? point3(0, 1, 0);
  const width = candidate['width'];
  const height = candidate['height'];
  if (
    !origin ||
    !axisU ||
    !axisV ||
    typeof width !== 'number' ||
    typeof height !== 'number' ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0.25 ||
    height <= 0.25
  ) {
    return null;
  }
  const axisULength = Math.hypot(axisU.x, axisU.y, axisU.z);
  const axisVLength = Math.hypot(axisV.x, axisV.y, axisV.z);
  const axisDot = axisU.x * axisV.x + axisU.y * axisV.y + axisU.z * axisV.z;
  if (
    axisULength < 0.92 ||
    axisULength > 1.08 ||
    axisVLength < 0.92 ||
    axisVLength > 1.08 ||
    Math.abs(axisDot) > 0.08
  ) {
    return null;
  }
  return { origin, axisU, axisV, width, height };
}

function parseHangingRules(raw: unknown): HubHangingRules | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  const verticalBandRaw =
    candidate['verticalBand'] && typeof candidate['verticalBand'] === 'object'
      ? (candidate['verticalBand'] as Record<string, unknown>)
      : null;
  const verticalBand =
    verticalBandRaw &&
    typeof verticalBandRaw['minY'] === 'number' &&
    Number.isFinite(verticalBandRaw['minY']) &&
    typeof verticalBandRaw['maxY'] === 'number' &&
    Number.isFinite(verticalBandRaw['maxY']) &&
    verticalBandRaw['maxY'] > verticalBandRaw['minY']
      ? {
          minY: verticalBandRaw['minY'] as number,
          maxY: verticalBandRaw['maxY'] as number,
        }
      : undefined;
  const sideMargin =
    typeof candidate['sideMargin'] === 'number' && Number.isFinite(candidate['sideMargin'])
      ? Math.max(0, candidate['sideMargin'] as number)
      : undefined;
  const doorwayClearance =
    typeof candidate['doorwayClearance'] === 'number' && Number.isFinite(candidate['doorwayClearance'])
      ? Math.max(0, candidate['doorwayClearance'] as number)
      : undefined;
  if (!verticalBand && sideMargin === undefined && doorwayClearance === undefined) return null;
  return {
    verticalBand,
    sideMargin,
    doorwayClearance,
  };
}

function parseRoomConfig(raw: unknown): HubRoomConfig | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  const floorOutline = Array.isArray(candidate['floorOutline'])
    ? candidate['floorOutline'].map((entry) => parsePoint3(entry)).filter((entry): entry is Point3D => entry !== null)
    : [];
  const boundsRaw =
    candidate['bounds'] && typeof candidate['bounds'] === 'object'
      ? (candidate['bounds'] as Record<string, unknown>)
      : null;
  const min = boundsRaw ? parsePoint3(boundsRaw['min']) : null;
  const max = boundsRaw ? parsePoint3(boundsRaw['max']) : null;
  const floorY =
    typeof candidate['floorY'] === 'number' && Number.isFinite(candidate['floorY'])
      ? (candidate['floorY'] as number)
      : undefined;
  const ceilingY =
    typeof candidate['ceilingY'] === 'number' && Number.isFinite(candidate['ceilingY'])
      ? (candidate['ceilingY'] as number)
      : undefined;
  const wallThickness =
    typeof candidate['wallThickness'] === 'number' && Number.isFinite(candidate['wallThickness'])
      ? Math.max(0.01, candidate['wallThickness'] as number)
      : undefined;
  if (floorOutline.length === 0 && (!min || !max) && floorY === undefined && ceilingY === undefined && wallThickness === undefined) {
    return null;
  }
  return {
    floorOutline: floorOutline.length >= 3 ? floorOutline : undefined,
    bounds: min && max ? { min, max } : undefined,
    floorY,
    ceilingY,
    wallThickness,
  };
}

function parseRoomWall(raw: unknown): RoomWallModel | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  const transform = parseWallTransform(raw);
  if (!transform) return null;
  const safePolygon = parsePolygon(candidate['safePolygon']);
  const rawDoorways = Array.isArray(candidate['doorwayExclusions']) ? candidate['doorwayExclusions'] : [];
  const doorwayExclusions = rawDoorways.map((doorway) => parsePolygon(doorway)).filter((doorway): doorway is Point2D[] => doorway !== null);
  const hangingBand = parseHangingBand(candidate['hangingBand'], transform.height);
  if (!safePolygon || !hangingBand) return null;
  const inBounds = (corner: Point2D): boolean =>
    corner.x >= 0 && corner.x <= transform.width && corner.y >= 0 && corner.y <= transform.height;
  if (!safePolygon.every(inBounds) || doorwayExclusions.some((doorway) => !doorway.every(inBounds))) return null;
  return {
    origin: transform.origin,
    axisU: transform.axisU,
    axisV: transform.axisV,
    width: transform.width,
    height: transform.height,
    safePolygon,
    doorwayExclusions,
    hangingBand,
  };
}

function parseCamera(raw: unknown): CameraCalibration | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  const position = parsePoint3(candidate['position']);
  const target = parsePoint3(candidate['target']);
  const verticalFovDeg = candidate['verticalFovDeg'];
  const near = candidate['near'];
  const far =
    typeof candidate['far'] === 'number' && Number.isFinite(candidate['far'])
      ? (candidate['far'] as number)
      : 40;
  const lensShift = parsePoint(candidate['lensShift']);
  if (
    !position ||
    !target ||
    typeof verticalFovDeg !== 'number' ||
    typeof near !== 'number' ||
    !Number.isFinite(verticalFovDeg) ||
    !Number.isFinite(near) ||
    !Number.isFinite(far) ||
    verticalFovDeg < 15 ||
    verticalFovDeg > 100 ||
    near <= 0 ||
    far <= near ||
    Math.hypot(position.x - target.x, position.y - target.y, position.z - target.z) < 0.1
  ) {
    return null;
  }
  return { position, target, verticalFovDeg, near, far, lensShift: lensShift ?? undefined };
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

function parseWallGroup(raw: unknown): HubWallGroup {
  return raw === 'right' || raw === 'front' || raw === 'rear' ? raw : 'left';
}

function sanitizeWallConfig(raw: unknown, warnings: string[]): HubWallConfig | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  const id = typeof candidate['id'] === 'string' ? candidate['id'].trim() : '';
  const group = parseWallGroup(candidate['group']);
  const role: HubWallRole = candidate['role'] === 'bounds-only' ? 'bounds-only' : 'rendered';
  const planeAspect =
    typeof candidate['planeAspect'] === 'number' && Number.isFinite(candidate['planeAspect'])
      ? Math.max(0.25, Math.min(8, candidate['planeAspect'] as number))
      : NaN;
  if (role === 'bounds-only') {
    const boundsTransform = parseWallTransform(candidate['transform']);
    if (!id || !boundsTransform) {
      warnings.push(`wall "${id || '?'}" ignored: bounds-only walls require an id and a valid transform.`);
      return null;
    }
    return {
      id,
      group,
      role,
      planeAspect: Number.isNaN(planeAspect)
        ? Math.max(0.25, Math.min(8, boundsTransform.width / Math.max(0.001, boundsTransform.height)))
        : planeAspect,
      transform: cloneWallTransform(boundsTransform),
    };
  }
  const quad = parseQuad(candidate['quad']);
  if (!id || Number.isNaN(planeAspect) || !quad) {
    warnings.push(`wall "${id || '?'}" ignored: requires id, planeAspect, and a four-corner quad.`);
    return null;
  }
  if (quadIsDegenerate(quad) || !quadIsConvex(quad)) {
    warnings.push(`wall "${id}" ignored: quad must be convex and non-degenerate.`);
    return null;
  }
  const safePolygon =
    parsePolygon(candidate['safePolygon'])
    ?? clonePolygon(shrinkPolygonTowardsCentroid(quad, 0.92));
  const drawableRegion =
    parsePolygon(candidate['drawableRegion'])
    ?? parsePolygon(candidate['safePolygon'])
    ?? undefined;
  const exclusionPolygons = Array.isArray(candidate['exclusionPolygons'])
    ? candidate['exclusionPolygons']
        .map((entry) => parsePolygon(entry))
        .filter((entry): entry is Point2D[] => entry !== null)
    : undefined;
  const transform = parseWallTransform(candidate['transform']);
  const hangingBandFromTransform =
    transform ? parseHangingBand(candidate['hangingBand'], transform.height) : null;
  const legacyRoom = parseRoomWall(candidate['room']);
  let room = legacyRoom ?? undefined;
  if (candidate['room'] !== undefined && !legacyRoom && candidate['transform'] === undefined) {
    warnings.push(`wall "${id}": v3 room plane is invalid; using the calibrated default plane when available.`);
  }
  if (candidate['transform'] !== undefined && !transform) {
    warnings.push(`wall "${id}": transform is invalid; falling back to the legacy room plane when available.`);
  }
  if (transform) {
    room = {
      origin: clonePoint3(transform.origin),
      axisU: clonePoint3(transform.axisU),
      axisV: clonePoint3(transform.axisV),
      width: transform.width,
      height: transform.height,
      safePolygon:
        drawableRegion
        ?? legacyRoom?.safePolygon
        ?? [
          point(0.14, 0.14),
          point(transform.width - 0.14, 0.14),
          point(transform.width - 0.14, transform.height - 0.14),
          point(0.14, transform.height - 0.14),
        ],
      doorwayExclusions: exclusionPolygons ?? legacyRoom?.doorwayExclusions ?? [],
      hangingBand:
        hangingBandFromTransform
        ?? legacyRoom?.hangingBand
        ?? { minY: 0.42, maxY: transform.height - 0.28, margin: 0.08 },
    };
  }
  if (!polygonIsClockwise(quad)) warnings.push(`wall "${id}": quad was normalized to clockwise winding.`);
  if (Math.abs(polygonSignedArea(safePolygon)) <= 1e-6) {
    warnings.push(`wall "${id}": safePolygon is degenerate; using a derived inset polygon.`);
  }
  return {
    id,
    group,
    role: 'rendered',
    planeAspect,
    quad,
    safePolygon,
    drawableRegion: drawableRegion ? clonePolygon(drawableRegion) : undefined,
    exclusionPolygons: exclusionPolygons?.map((polygon) => clonePolygon(polygon)),
    transform: transform ? cloneWallTransform(transform) : room ? {
      origin: clonePoint3(room.origin),
      axisU: clonePoint3(room.axisU),
      axisV: clonePoint3(room.axisV),
      width: room.width,
      height: room.height,
    } : undefined,
    hangingBand: hangingBandFromTransform ?? room?.hangingBand,
    shadowVector: parseShadowVector(candidate['shadowVector']),
    room: room ?? undefined,
  };
}

function sanitizeV2Placement(raw: unknown): HubSlotPlacement | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  const wallId = typeof candidate['wallId'] === 'string' ? candidate['wallId'].trim() : '';
  const horizontalPosition =
    typeof candidate['horizontalPosition'] === 'number' && Number.isFinite(candidate['horizontalPosition'])
      ? clamp01(candidate['horizontalPosition'] as number)
      : undefined;
  const centerHeight =
    typeof candidate['centerHeight'] === 'number' && Number.isFinite(candidate['centerHeight'])
      ? Math.max(0, Math.min(8, candidate['centerHeight'] as number))
      : undefined;
  const physicalHeight =
    typeof candidate['physicalHeight'] === 'number' && Number.isFinite(candidate['physicalHeight'])
      ? Math.max(0.04, Math.min(8, candidate['physicalHeight'] as number))
      : undefined;
  const uv = parsePoint(candidate['uv'], true);
  const center =
    parsePoint(candidate['center'], true)
    ?? (uv ? point(clamp01(uv.x), clamp01(1 - uv.y)) : null)
    ?? (horizontalPosition !== undefined && centerHeight !== undefined
      ? point(horizontalPosition, 0)
      : null);
  const anchor = parsePoint(candidate['anchor']);
  const maxMountedHeight = anchor || uv ? 8 : 0.9;
  const mountedHeight =
    typeof candidate['mountedHeight'] === 'number' && Number.isFinite(candidate['mountedHeight'])
      ? Math.max(0.04, Math.min(maxMountedHeight, candidate['mountedHeight'] as number))
      : physicalHeight ?? NaN;
  const targetSizePolicy =
    candidate['targetSizePolicy'] === 'fixed-height' || physicalHeight !== undefined
      ? 'fixed-height'
      : 'contain';
  const minScale =
    typeof candidate['minScale'] === 'number' && Number.isFinite(candidate['minScale'])
      ? Math.max(0.4, Math.min(1, candidate['minScale'] as number))
      : 0.7;
  const maxScale =
    typeof candidate['maxScale'] === 'number' && Number.isFinite(candidate['maxScale'])
      ? Math.max(1, Math.min(2.5, candidate['maxScale'] as number))
      : 1;
  const zOffset =
    typeof candidate['zOffset'] === 'number' && Number.isFinite(candidate['zOffset'])
      ? Math.max(0.001, Math.min(0.12, candidate['zOffset'] as number))
      : 0.02;
  const mountingGap =
    typeof candidate['mountingGap'] === 'number' && Number.isFinite(candidate['mountingGap'])
      ? Math.max(0.001, Math.min(0.03, candidate['mountingGap'] as number))
      : HUB_ARTWORK_MOUNTING_GAP_M;
  if (!wallId || !center || Number.isNaN(mountedHeight)) return null;
  return {
    wallId,
    horizontalPosition,
    centerHeight,
    physicalHeight: physicalHeight ?? mountedHeight,
    mountingGap,
    center,
    mountedHeight,
    anchor: anchor ?? undefined,
    uv: uv ?? undefined,
    targetSizePolicy,
    minScale,
    maxScale,
    zOffset,
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
  const suffix = slotId.replace(/^room-\d+\./, '');
  const explicitWallId = BASELINE_WALL_BY_SUFFIX.get(suffix);
  let preferredWallId = explicitWallId ?? '';
  if (!preferredWallId) {
    preferredWallId =
      placement.cx < 0.33
        ? 'wall-left'
        : placement.cx < 0.67
          ? 'wall-front'
          : 'wall-right';
  }
  const renderedWalls = walls.filter((entry) => entry.role !== 'bounds-only');
  const wall =
    renderedWalls.find((entry) => entry.id === preferredWallId)
    ?? renderedWalls[0]
    ?? walls[0]!;
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
    if (!isHexColor(rawTokens['museumWall'])) warnings.push('visualTokens.museumWall is not a valid #RRGGBB color; using galleryWall.');
    else if ((rawTokens['museumWall'] as string).trim().toUpperCase() !== tokens.galleryWall.toUpperCase()) {
      warnings.push('visualTokens.museumWall differs from galleryWall; the authoritative gallery wall token is used everywhere.');
    }
  }
  tokens.museumWall = tokens.galleryWall;

  const stage = sanitizeStage(cfg['stage']);
  let backgroundAspect = HUB_BACKGROUND_ASPECT;
  let backgroundSrc = HUB_BACKGROUND_SRC;
  let backgroundFallbackSrc = HUB_BACKGROUND_SRC;
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
  if (cfg['backgroundFallback'] && typeof cfg['backgroundFallback'] === 'object') {
    const fallback = cfg['backgroundFallback'] as Record<string, unknown>;
    if (typeof fallback['src'] === 'string' && fallback['src'].trim()) {
      backgroundFallbackSrc = fallback['src'].trim();
    }
  }
  if (isReferenceOnlyHubAssetPath(backgroundSrc)) {
    warnings.push(
      `museum-hub background "${backgroundSrc}" is a reference-only asset and is not shipped to public/backgrounds; hosted builds will fall back at runtime.`
    );
  }
  if (isReferenceOnlyHubAssetPath(backgroundFallbackSrc)) {
    warnings.push(
      `museum-hub background fallback "${backgroundFallbackSrc}" is a reference-only asset and is not shipped to public/backgrounds; hosted builds may continue on the neutral wall token.`
    );
  }
  const camera = parseCamera(cfg['camera']) ?? cloneCamera(HUB_CAMERA);
  if (cfg['camera'] !== undefined && !parseCamera(cfg['camera'])) {
    warnings.push('museum-hub camera is invalid; using built-in calibrated camera.');
  }
  const hangingRules = parseHangingRules(cfg['hangingRules']) ?? defaultHangingRules();
  if (cfg['hangingRules'] !== undefined && !parseHangingRules(cfg['hangingRules'])) {
    warnings.push('museum-hub hangingRules are invalid; using built-in doorway/band defaults.');
  }

  const fallbacks = sanitizeFallbacks(cfg['fallbacks']);
  const slotsPerPage =
    typeof cfg['slotsPerPage'] === 'number' && Number.isFinite(cfg['slotsPerPage'])
      ? Math.max(1, Math.min(8, Math.round(cfg['slotsPerPage'] as number)))
      : HUB_SLOTS_PER_PAGE;
  if (cfg['slotsPerPage'] !== undefined && slotsPerPage !== cfg['slotsPerPage']) {
    warnings.push(`museum-hub slotsPerPage was clamped to ${slotsPerPage} (allowed range 1–8).`);
  }
  const rawSlots = Array.isArray(cfg['slots']) ? (cfg['slots'] as unknown[]) : [];
  if (rawSlots.length === 0) {
    warnings.push('museum-hub config ignored: expected a non-empty slots array.');
    return { config: null, warnings, source: 'built-in-default' };
  }

  const parsedWalls = Array.isArray(cfg['walls']) ? (cfg['walls'] as unknown[]) : [];
  const walls = parsedWalls.map((entry) => sanitizeWallConfig(entry, warnings)).filter((entry): entry is HubWallConfig => entry !== null);
  const defaultWallsById = new Map(defaultWalls().map((wall) => [wall.id, wall]));
  const effectiveWalls = (walls.length > 0 ? walls : defaultWalls()).map((wall) => {
    if (wall.room || wall.role === 'bounds-only') return wall;
    const fallbackRoom = defaultWallsById.get(wall.id)?.room;
    if (!fallbackRoom) return wall;
    warnings.push(`wall "${wall.id}": missing v3 room plane; using built-in calibrated room plane.`);
    return { ...wall, room: cloneRoomWall(fallbackRoom) };
  });
  if (parsedWalls.length > 0 && walls.length === 0) {
    warnings.push('museum-hub walls were invalid; using built-in calibrated wall planes.');
  }
  const room = parseRoomConfig(cfg['room']) ?? defaultRoomConfig(effectiveWalls);
  if (cfg['room'] !== undefined && !parseRoomConfig(cfg['room'])) {
    warnings.push('museum-hub room is invalid; deriving floor/ceiling layout from wall transforms.');
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
      version: Math.max(5, version),
      coverage: 'all-active-artworks',
      stage,
      background: { src: backgroundSrc, aspect: backgroundAspect },
      backgroundFallback: { src: backgroundFallbackSrc },
      visualTokens: tokens,
      camera,
      room,
      hangingRules,
      walls: effectiveWalls,
      fallbacks,
      slotsPerPage,
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
      version: 5,
      coverage: 'all-active-artworks',
      stage: { ...HUB_STAGE },
      background: { src: HUB_BACKGROUND_SRC, aspect: HUB_BACKGROUND_ASPECT },
      backgroundFallback: { src: HUB_BACKGROUND_SRC },
      visualTokens: defaultVisualTokens(),
      camera: cloneCamera(HUB_CAMERA),
      room: defaultRoomConfig(walls),
      hangingRules: defaultHangingRules(),
      walls,
      fallbacks: sanitizeFallbacks(undefined),
      slotsPerPage: HUB_SLOTS_PER_PAGE,
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
      version: 5,
      coverage: 'all-active-artworks',
      stage: { ...HUB_STAGE },
      background: { src: HUB_BACKGROUND_SRC, aspect: HUB_BACKGROUND_ASPECT },
      backgroundFallback: { src: HUB_BACKGROUND_SRC },
      visualTokens: defaultVisualTokens(),
      camera: cloneCamera(HUB_CAMERA),
      room: defaultRoomConfig(defaultWalls()),
      hangingRules: defaultHangingRules(),
      walls: defaultWalls(),
      fallbacks: sanitizeFallbacks(undefined),
      slotsPerPage: HUB_SLOTS_PER_PAGE,
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
  const backgroundFallback = config.backgroundFallback;
  const camera = config.camera ? cloneCamera(config.camera) : cloneCamera(HUB_CAMERA);
  const roomConfig = config.room ?? defaultRoomConfig(config.walls);
  const hangingRules = config.hangingRules ?? defaultHangingRules();
  const selectionTimeoutMs = config.fallbacks.selectionTimeoutMs;
  const autoPlaceUnmapped = config.fallbacks.autoPlaceUnmapped;
  const slotsPerPage = config.slotsPerPage ?? HUB_SLOTS_PER_PAGE;

  const walls: ResolvedHubWall[] = [];
  for (const wall of config.walls) {
    if (wall.role === 'bounds-only') continue;
    if (!wall.quad) {
      warnings.push(`wall "${wall.id}" is missing a reference quad and will be ignored.`);
      continue;
    }
    const referenceQuad = cloneQuad(wall.quad);
    const referenceSafePolygon =
      wall.safePolygon ? clonePolygon(wall.safePolygon) : clonePolygon(shrinkPolygonTowardsCentroid(referenceQuad, 0.92));
    let room = wall.room ? cloneRoomWall(wall.room) : undefined;
    let projectedQuad: Quad | null = null;
    let projectedSafePolygon: Point2D[] | null = null;
    let localCalibrationScale = { x: 1, y: 1 };
    let projectionRealism: WallProjectionRealism | undefined;
    const expectedConvergence = expectedWallConvergence(referenceQuad);
    if (room) {
      const calibrated = calibrateRoomWallToReferenceQuad(
        room,
        referenceQuad,
        referenceSafePolygon,
        camera,
        stage,
        expectedConvergence
      );
      if (calibrated) {
        room = calibrated.room;
        projectedQuad = calibrated.projectedQuad;
        projectedSafePolygon = calibrated.projectedSafePolygon;
        localCalibrationScale = { x: calibrated.scaleX, y: calibrated.scaleY };
        projectionRealism = calibrated.realism;
        // Homography decomposition recovers the wall plane only up to scale
        // about the camera center. Rescale to the authored metric transform so
        // the rendered 3D room (walls, floor, doorway pockets, reflections)
        // shares one coherent world space. Rescaling about the camera keeps
        // the stage projection bit-identical.
        if (wall.transform && room.width > 0.000001) {
          const metricScale = wall.transform.width / room.width;
          if (Number.isFinite(metricScale) && metricScale > 0) {
            room = rescaleRoomWallAboutCamera(room, camera.position, metricScale);
            localCalibrationScale = {
              x: calibrated.scaleX * metricScale,
              y: calibrated.scaleY * metricScale,
            };
          }
        }
      } else {
        warnings.push(`wall "${wall.id}": room plane could not be reconciled to the reference quad; using the stored room transform.`);
        projectedQuad = projectRoomWallQuad(room, camera, stage);
        projectedSafePolygon = projectRoomPolygon(room, camera, room.safePolygon, stage);
        if (projectedQuad) {
          projectionRealism = evaluateWallProjectionRealism(
            room,
            projectedQuad,
            referenceQuad,
            projectedSafePolygon,
            referenceSafePolygon,
            expectedConvergence
          );
        }
      }
      if (projectionRealism && !projectionRealism.passes) {
        warnings.push(
          `wall "${wall.id}": projection realism failed (max residual ${projectionRealism.referenceResidualMaxPx.toFixed(1)}px, axis dot ${projectionRealism.axisDot.toFixed(3)}, convergence ${projectionRealism.projectedConvergence}).`
        );
      }
    }
    const quad = referenceQuad;
    const safePolygon = referenceSafePolygon;
    const homography = computeHomographyFromUnitSquare(quad);
    const inverseHomography = homography ? invertMatrix3x3(homography) : null;
    if (!homography || !inverseHomography) {
      warnings.push(`wall "${wall.id}" could not build a homography and will be ignored.`);
      continue;
    }
    const transform = wall.transform
      ? cloneWallTransform(wall.transform)
      : room
        ? {
            origin: clonePoint3(room.origin),
            axisU: clonePoint3(room.axisU),
            axisV: clonePoint3(room.axisV),
            width: room.width,
            height: room.height,
          }
        : null;
    if (!transform) {
      warnings.push(`wall "${wall.id}" is missing a room transform and will be ignored.`);
      continue;
    }
    walls.push({
      id: wall.id,
      group: wall.group,
      transform,
      planeAspect: wall.planeAspect,
      quad,
      safePolygon,
      shadowVector: wall.shadowVector ? clonePoint(wall.shadowVector) : undefined,
      room,
      camera: room ? camera : undefined,
      referenceQuad,
      referenceSafePolygon,
      projectedQuad,
      projectedSafePolygon,
      localCalibrationScale,
      projectionRealism,
      expectedConvergence,
      homography,
      inverseHomography,
    });
  }
  const wallById = new Map(walls.map((wall) => [wall.id, wall]));
  validateMirrorSymmetry(config, warnings);
  const roomFloorOutline = roomConfig.floorOutline?.map((point) => clonePoint3(point))
    ?? deriveFloorOutlineFromWalls(config.walls);
  const roomBounds = roomConfig.bounds
    ? {
        min: clonePoint3(roomConfig.bounds.min),
        max: clonePoint3(roomConfig.bounds.max),
      }
    : deriveRoomBounds(config.walls, roomFloorOutline);
  const room: ResolvedHubRoom = {
    floorOutline: roomFloorOutline,
    bounds: roomBounds,
    dimensions: {
      width: Math.max(0.01, roomBounds.max.x - roomBounds.min.x),
      height: Math.max(0.01, (roomConfig.ceilingY ?? roomBounds.max.y) - (roomConfig.floorY ?? roomBounds.min.y)),
      depth: Math.max(0.01, roomBounds.max.z - roomBounds.min.z),
    },
    floorY: roomConfig.floorY ?? roomBounds.min.y,
    ceilingY: roomConfig.ceilingY ?? roomBounds.max.y,
    wallThickness: roomConfig.wallThickness ?? 0.08,
    wallIds: walls.map((wall) => wall.id),
  };

  const artworkIndexById = new Map<string, number>();
  artworks.forEach((artwork, index) => artworkIndexById.set(artwork.id, index));

  const mappedArtworkIds = new Set<string>();
  const resolved: ResolvedHubSlot[] = [];
  const freeSlots: ResolvedHubSlot[] = [];

  for (const slot of config.slots) {
    const pageIndex = Math.max(0, parsePageIndex(slot.id));
    const wall = wallById.get(slot.placement.wallId);
    const wallGroup = wall?.group ?? heuristicWallGroup(slot.placement.wallId);
    const localScale = wall?.localCalibrationScale ?? { x: 1, y: 1 };
    const canonicalPlacement =
      slot.placement.horizontalPosition !== undefined &&
      slot.placement.centerHeight !== undefined &&
      slot.placement.physicalHeight !== undefined;
    const placementUv = derivePlacementUv(slot.placement, wall);
    if (
      wall?.room &&
      !slot.placement.anchor &&
      (slot.placement.horizontalPosition === undefined || slot.placement.centerHeight === undefined)
    ) {
      warnings.push(`slot "${slot.id}": room-local anchor missing; deriving it from the normalized center for calibrated placement.`);
    }
    const migratedAnchor =
      (() => {
        const explicitAnchor = derivePlacementAnchor(slot.placement, wall);
        if (explicitAnchor) {
          if (canonicalPlacement) return explicitAnchor;
          return point(explicitAnchor.x * localScale.x, explicitAnchor.y * localScale.y);
        }
        if (placementUv && wall?.room) {
          return point(placementUv.x * wall.room.width, placementUv.y * wall.room.height);
        }
        return wall?.room
          ? point(slot.placement.center.x * wall.room.width, (1 - slot.placement.center.y) * wall.room.height)
          : undefined;
      })();
    const base: Omit<ResolvedHubSlot, 'artworkId' | 'artworkIndex' | 'displayLabel' | 'selectable' | 'disabledReason' | 'mappingSource' | 'artworkAspect'> = {
      id: slot.id,
      pageIndex,
      placement: {
        wallId: slot.placement.wallId,
        center: placementUv ? point(placementUv.x, 1 - placementUv.y) : clonePoint(slot.placement.center),
        mountedHeight:
          canonicalPlacement
            ? slot.placement.physicalHeight!
            : wall?.room
              ? slot.placement.mountedHeight * localScale.y
              : slot.placement.mountedHeight,
        anchor: migratedAnchor ? clonePoint(migratedAnchor) : undefined,
        uv: placementUv ? clonePoint(placementUv) : undefined,
        horizontalPosition:
          migratedAnchor && wall?.room
            ? clamp01(migratedAnchor.x / Math.max(0.001, wall.room.width))
            : placementUv?.x,
        centerHeight: migratedAnchor?.y,
        physicalHeight:
          canonicalPlacement
            ? slot.placement.physicalHeight
            : wall?.room
              ? slot.placement.mountedHeight * localScale.y
              : slot.placement.mountedHeight,
        mountingGap: slot.placement.mountingGap ?? HUB_ARTWORK_MOUNTING_GAP_M,
        targetSizePolicy: slot.placement.targetSizePolicy ?? 'contain',
        minScale: slot.placement.minScale ?? 0.7,
        maxScale: slot.placement.maxScale ?? 1,
        zOffset: slot.placement.zOffset ?? 0.02,
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
      const pageSlots = baselinePageSlots(pageIndex).map<ResolvedHubSlot>((slot) => {
        const wall = wallById.get(slot.placement.wallId);
        const localScale = wall?.localCalibrationScale ?? { x: 1, y: 1 };
        return {
          id: slot.id,
          pageIndex,
          placement: {
            wallId: slot.placement.wallId,
            center: clonePoint(slot.placement.center),
            mountedHeight:
              slot.placement.physicalHeight
              ?? (wall?.room ? slot.placement.mountedHeight * localScale.y : slot.placement.mountedHeight),
            anchor:
              wall?.room && slot.placement.anchor
                ? slot.placement.horizontalPosition !== undefined && slot.placement.centerHeight !== undefined
                  ? clonePoint(slot.placement.anchor)
                  : point(slot.placement.anchor.x * localScale.x, slot.placement.anchor.y * localScale.y)
                : slot.placement.anchor
                  ? clonePoint(slot.placement.anchor)
                  : undefined,
            uv: slot.placement.uv ? clonePoint(slot.placement.uv) : undefined,
            horizontalPosition: slot.placement.horizontalPosition,
            centerHeight: slot.placement.centerHeight,
            physicalHeight:
              slot.placement.physicalHeight
              ?? (wall?.room ? slot.placement.mountedHeight * localScale.y : slot.placement.mountedHeight),
            mountingGap: slot.placement.mountingGap ?? HUB_ARTWORK_MOUNTING_GAP_M,
            targetSizePolicy: slot.placement.targetSizePolicy ?? 'contain',
            minScale: slot.placement.minScale ?? 0.7,
            maxScale: slot.placement.maxScale ?? 1,
            zOffset: slot.placement.zOffset ?? 0.02,
            provisional: false,
          },
          artworkId: null,
          artworkIndex: -1,
          displayLabel: '',
          selectable: true,
          disabledReason: null,
          mappingSource: 'auto-placed',
          artworkAspect: 1,
          wallGroup: heuristicWallGroup(slot.placement.wallId),
        };
      });
      const batch = overflow.slice(0, slotsPerPage);
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

  for (const slot of resolved) {
    if (!slot.selectable || !slot.artworkId) continue;
    const wall = wallById.get(slot.placement.wallId);
    if (!wall) continue;
    const fitted = clampSlotPlacementToDrawableRegion(wall, slot.placement, slot.artworkAspect, stage);
    if (!fitted.adjusted) continue;
    slot.placement.center = fitted.center;
    if (fitted.anchor) slot.placement.anchor = fitted.anchor;
    if (fitted.anchor && wall?.room) {
      slot.placement.uv = point(
        clamp01(fitted.anchor.x / Math.max(0.001, wall.room.width)),
        clamp01(fitted.anchor.y / Math.max(0.001, wall.room.height))
      );
      slot.placement.center = point(slot.placement.uv.x, 1 - slot.placement.uv.y);
    }
    slot.placement.mountedHeight = fitted.mountedHeight;
    slot.placement.physicalHeight = fitted.mountedHeight;
    slot.placement.horizontalPosition = slot.placement.uv?.x;
    slot.placement.centerHeight = fitted.anchor?.y;
    warnings.push(
      `slot "${slot.id}": authored wall placement was adjusted to remain inside the usable mounting area.`
    );
    if (slot.placement.provisional) {
      warnings.push(`slot "${slot.id}": provisional placement was clamped to the wall drawable region.`);
    }
  }

  const tryProjectResolvedSlot = (
    slot: ResolvedHubSlot,
    targetWall: ResolvedHubWall
  ): { projection: ReturnType<typeof projectSlotArtwork>; placement: HubSlotPlacement } => {
    const uv = slot.placement.uv
      ?? derivePlacementUv(slot.placement, targetWall)
      ?? point(slot.placement.center.x, 1 - slot.placement.center.y);
    const sourceWall = wallById.get(slot.placement.wallId);
    const sourceHeight = sourceWall?.room?.height ?? targetWall.room?.height ?? 1;
    const targetHeight = targetWall.room?.height ?? sourceHeight;
    const normalizedHeight = slot.placement.mountedHeight / Math.max(0.001, sourceHeight);
    const placement: HubSlotPlacement = {
      wallId: targetWall.id,
      center: point(uv.x, 1 - uv.y),
      anchor: targetWall.room ? point(uv.x * targetWall.room.width, uv.y * targetWall.room.height) : undefined,
      uv: clonePoint(uv),
      mountedHeight: targetWall.room
        ? Math.max(0.04, normalizedHeight * targetHeight)
        : slot.placement.mountedHeight,
      targetSizePolicy: slot.placement.targetSizePolicy,
      minScale: slot.placement.minScale,
      maxScale: slot.placement.maxScale,
      zOffset: slot.placement.zOffset,
      horizontalPosition: uv.x,
      centerHeight: targetWall.room ? uv.y * targetWall.room.height : undefined,
      physicalHeight: targetWall.room
        ? normalizedHeight * targetWall.room.height
        : slot.placement.physicalHeight,
      mountingGap: slot.placement.mountingGap,
      provisional: slot.placement.provisional,
    };
    const projection = projectSlotArtwork(targetWall, placement, slot.artworkAspect, stage);
    if (projection?.placement && targetWall.room) {
      const fitted = projection.placement;
      placement.anchor = clonePoint(fitted.anchor);
      placement.mountedHeight = fitted.mountedHeight;
      placement.physicalHeight = fitted.mountedHeight;
      placement.uv = point(
        clamp01(fitted.anchor.x / Math.max(0.001, targetWall.room.width)),
        clamp01(fitted.anchor.y / Math.max(0.001, targetWall.room.height))
      );
      placement.horizontalPosition = placement.uv.x;
      placement.centerHeight = fitted.anchor.y;
      placement.center = point(placement.uv.x, 1 - placement.uv.y);
    }
    return { projection, placement };
  };

  const projectedBySlot = new Map<string, ReturnType<typeof projectSlotArtwork>>();
  for (const slot of resolved) {
    if (!slot.selectable || !slot.artworkId) continue;
    const currentWall = wallById.get(slot.placement.wallId);
    if (!currentWall) continue;
    let resolvedWall: ResolvedHubWall | null = null;
    let resolvedPlacement: HubSlotPlacement | null = null;
    let projected: ReturnType<typeof projectSlotArtwork> = null;
    const fallbackWalls = candidateFallbackWalls(currentWall.id, walls, currentWall.group);
    for (const candidateWall of fallbackWalls) {
      if (candidateWall.projectionRealism && !candidateWall.projectionRealism.passes) continue;
      const attempt = tryProjectResolvedSlot(slot, candidateWall);
      if (!attempt.projection) continue;
      const withinSafePolygon = attempt.projection.projectedQuad.every((vertex) => pointInPolygon(vertex, candidateWall.safePolygon));
      if (!withinSafePolygon) continue;
      resolvedWall = candidateWall;
      resolvedPlacement = attempt.placement;
      projected = attempt.projection;
      break;
    }
    projectedBySlot.set(slot.id, projected);
    if (!resolvedWall || !resolvedPlacement || !projected) {
      slot.selectable = false;
      slot.disabledReason = currentWall.projectionRealism && !currentWall.projectionRealism.passes
        ? 'projection-realism'
        : 'invalid-projection';
      warnings.push(`slot "${slot.id}": projected geometry is invalid and the slot was suppressed.`);
      continue;
    }
    if (resolvedWall.id !== currentWall.id) {
      slot.placement = {
        ...resolvedPlacement,
        center: clonePoint(resolvedPlacement.center),
        anchor: resolvedPlacement.anchor ? clonePoint(resolvedPlacement.anchor) : undefined,
        uv: resolvedPlacement.uv ? clonePoint(resolvedPlacement.uv) : undefined,
      };
      slot.wallGroup = resolvedWall.group;
      warnings.push(`slot "${slot.id}": moved from "${currentWall.id}" to fallback wall "${resolvedWall.id}" after doorway/containment validation.`);
    } else {
      slot.placement = {
        ...slot.placement,
        center: clonePoint(resolvedPlacement.center),
        anchor: resolvedPlacement.anchor ? clonePoint(resolvedPlacement.anchor) : undefined,
        uv: resolvedPlacement.uv ? clonePoint(resolvedPlacement.uv) : undefined,
        mountedHeight: resolvedPlacement.mountedHeight,
      };
    }
    if (slot.placement.provisional) {
      warnings.push(`slot "${slot.id}": placement was migrated provisionally and should be recalibrated.`);
    }
  }

  let nextOverflowPageIndex = resolved.reduce((max, slot) => Math.max(max, slot.pageIndex), 0) + 1;
  let movedConflict = true;
  while (movedConflict) {
    movedConflict = false;
    const candidateGroups = new Map<string, ResolvedHubSlot[]>();
    for (const slot of resolved) {
      if (!slot.selectable || !slot.artworkId || !slot.placement.anchor) continue;
      const key = `${slot.pageIndex}:${slot.placement.wallId}`;
      const slots = candidateGroups.get(key) ?? [];
      slots.push(slot);
      candidateGroups.set(key, slots);
    }
    for (const slots of candidateGroups.values()) {
      slots.sort((a, b) => a.placement.anchor!.x - b.placement.anchor!.x);
      for (let index = 1; index < slots.length; index += 1) {
        const previous = slots[index - 1]!;
        const current = slots[index]!;
        const gap = current.placement.anchor!.x
          - current.placement.mountedHeight * current.artworkAspect * 0.5
          - previous.placement.anchor!.x
          - previous.placement.mountedHeight * previous.artworkAspect * 0.5;
        if (gap + 1e-6 >= HUB_MIN_ARTWORK_SPACING_M) continue;
        const overflowSlot = current.mappingSource === 'auto-placed'
          ? current
          : previous.mappingSource === 'auto-placed'
            ? previous
            : null;
        if (!overflowSlot) continue;
        overflowSlot.pageIndex = nextOverflowPageIndex;
        nextOverflowPageIndex += 1;
        movedConflict = true;
        warnings.push(
          `slot "${overflowSlot.id}": moved to an overflow page to preserve ${HUB_MIN_ARTWORK_SPACING_M.toFixed(2)} m wall spacing.`
        );
        break;
      }
      if (movedConflict) break;
    }
  }

  for (const slot of resolved) {
    if (!slot.selectable || !slot.artworkId) continue;
    const wall = wallById.get(slot.placement.wallId);
    if (!wall) continue;
    const projected = projectSlotArtwork(wall, slot.placement, slot.artworkAspect, stage);
    projectedBySlot.set(slot.id, projected);
    if (projected && projected.shortEdge < HUB_MIN_PROJECTED_SHORT_EDGE_PX) {
      warnings.push(
        `slot "${slot.id}": projected short edge ${projected.shortEdge.toFixed(1)}px is below the ${HUB_MIN_PROJECTED_SHORT_EDGE_PX}px desktop guidance.`
      );
    }
  }

  const slotsByWallAndPage = new Map<string, ResolvedHubSlot[]>();
  for (const slot of resolved) {
    if (!slot.selectable || !slot.artworkId || !slot.placement.anchor) continue;
    const key = `${slot.pageIndex}:${slot.placement.wallId}`;
    const slots = slotsByWallAndPage.get(key) ?? [];
    slots.push(slot);
    slotsByWallAndPage.set(key, slots);
  }
  for (const slots of slotsByWallAndPage.values()) {
    slots.sort((a, b) => a.placement.anchor!.x - b.placement.anchor!.x);
    for (let index = 1; index < slots.length; index += 1) {
      const previous = slots[index - 1]!;
      const current = slots[index]!;
      const gap = current.placement.anchor!.x
        - current.placement.mountedHeight * current.artworkAspect * 0.5
        - previous.placement.anchor!.x
        - previous.placement.mountedHeight * previous.artworkAspect * 0.5;
      if (gap + 1e-6 < HUB_MIN_ARTWORK_SPACING_M) {
        warnings.push(
          `slots "${previous.id}" and "${current.id}": wall spacing ${gap.toFixed(3)} m is below the ${HUB_MIN_ARTWORK_SPACING_M.toFixed(2)} m curator minimum.`
        );
      }
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
  const artworkSourceById = new Map<
    string,
    {
      image: string;
      webglImage: string | null;
      dimensions: Artwork['dimensions'];
    }
  >();
  for (const artwork of artworks) {
    artworkImageById.set(artwork.id, artwork.image);
    artworkSourceById.set(artwork.id, {
      image: artwork.image,
      webglImage: artwork.webglImage ?? null,
      dimensions: artwork.dimensions,
      ...(artwork.imageSourceContext ? { imageSourceContext: artwork.imageSourceContext } : {}),
    });
  }

  return {
    pages,
    slotToArtwork,
    artworkToSlot,
    artworkImageById,
    artworkSourceById,
    background,
    backgroundFallback,
    stage,
    visualTokens: tokens,
    camera,
    room,
    hangingRules,
    walls,
    wallById,
    slotsPerPage,
    selectionTimeoutMs,
    source,
    warnings,
    unmappedArtworkCount,
  };
}

function heuristicWallGroup(wallId: string): HubWallGroup {
  if (wallId.includes('front')) return 'front';
  if (wallId.includes('rear')) return 'rear';
  return wallId.includes('right') ? 'right' : 'left';
}

/** Data-derived mirror tolerance for the square hero room (1 cm). */
const MIRROR_TOLERANCE_M = 0.01;

/**
 * Uniformly rescales a calibrated wall plane about the camera position. The
 * stage-space projection of a plane is invariant under this scaling, so it can
 * reconcile the scale-ambiguous homography decomposition with the authored
 * metric wall transform.
 */
function rescaleRoomWallAboutCamera(
  room: RoomWallModel,
  cameraPosition: Point3D,
  scale: number
): RoomWallModel {
  const scaled = (value: Point2D): Point2D => point(value.x * scale, value.y * scale);
  return {
    origin: point3(
      cameraPosition.x + (room.origin.x - cameraPosition.x) * scale,
      cameraPosition.y + (room.origin.y - cameraPosition.y) * scale,
      cameraPosition.z + (room.origin.z - cameraPosition.z) * scale
    ),
    axisU: clonePoint3(room.axisU),
    axisV: clonePoint3(room.axisV),
    width: room.width * scale,
    height: room.height * scale,
    safePolygon: room.safePolygon.map(scaled),
    doorwayExclusions: room.doorwayExclusions.map((polygon) => polygon.map(scaled)),
    hangingBand: {
      minY: room.hangingBand.minY * scale,
      maxY: room.hangingBand.maxY * scale,
      margin: room.hangingBand.margin * scale,
    },
  };
}

function polygonSpanU(polygon: Polygon): { min: number; max: number } {
  const xs = polygon.map((corner) => corner.x);
  return { min: Math.min(...xs), max: Math.max(...xs) };
}

function polygonSpanV(polygon: Polygon): { min: number; max: number } {
  const ys = polygon.map((corner) => corner.y);
  return { min: Math.min(...ys), max: Math.max(...ys) };
}

/**
 * The hero room mandates exact left/right mirror symmetry: doorway openings
 * and slot placements on the right wall must mirror the left wall within 1 cm.
 * Violations are surfaced as resolver warnings so the geometry gate fails.
 */
function validateMirrorSymmetry(config: MuseumHubConfig, warnings: string[]): void {
  const leftWall = config.walls.find((wall) => wall.role !== 'bounds-only' && wall.group === 'left');
  const rightWall = config.walls.find((wall) => wall.role !== 'bounds-only' && wall.group === 'right');
  if (!leftWall?.room || !rightWall?.room) return;
  if (
    Math.abs(leftWall.room.width - rightWall.room.width) > MIRROR_TOLERANCE_M ||
    Math.abs(leftWall.room.height - rightWall.room.height) > MIRROR_TOLERANCE_M
  ) {
    warnings.push('museum-hub mirror symmetry: left/right wall dimensions differ beyond the 1 cm tolerance.');
    return;
  }
  const width = leftWall.room.width;
  const leftDoors = leftWall.room.doorwayExclusions;
  const rightDoors = rightWall.room.doorwayExclusions;
  if (leftDoors.length !== rightDoors.length) {
    warnings.push(
      `museum-hub mirror symmetry: left wall has ${leftDoors.length} doorway(s) but right wall has ${rightDoors.length}.`
    );
  } else {
    for (const leftDoor of leftDoors) {
      const leftU = polygonSpanU(leftDoor);
      const leftV = polygonSpanV(leftDoor);
      const mirrored = rightDoors.some((rightDoor) => {
        const rightU = polygonSpanU(rightDoor);
        const rightV = polygonSpanV(rightDoor);
        return (
          Math.abs(rightU.min - (width - leftU.max)) <= MIRROR_TOLERANCE_M &&
          Math.abs(rightU.max - (width - leftU.min)) <= MIRROR_TOLERANCE_M &&
          Math.abs(rightV.min - leftV.min) <= MIRROR_TOLERANCE_M &&
          Math.abs(rightV.max - leftV.max) <= MIRROR_TOLERANCE_M
        );
      });
      if (!mirrored) {
        warnings.push('museum-hub mirror symmetry: side-wall doorways are not mirrored within the 1 cm tolerance.');
        break;
      }
    }
  }
  for (const slot of config.slots) {
    if (slot.placement.wallId !== leftWall.id) continue;
    const counterpartId = slot.id.replace('wall-left', 'wall-right');
    if (counterpartId === slot.id) continue;
    const counterpart = config.slots.find((entry) => entry.id === counterpartId);
    if (!counterpart || counterpart.placement.wallId !== rightWall.id) {
      warnings.push(`museum-hub mirror symmetry: slot "${slot.id}" has no mirrored counterpart "${counterpartId}".`);
      continue;
    }
    const leftU =
      slot.placement.horizontalPosition
      ?? (slot.placement.anchor ? slot.placement.anchor.x / width : slot.placement.center.x);
    const rightU =
      counterpart.placement.horizontalPosition
      ?? (counterpart.placement.anchor ? counterpart.placement.anchor.x / width : counterpart.placement.center.x);
    const leftCenterHeight =
      slot.placement.centerHeight
      ?? slot.placement.anchor?.y
      ?? (1 - slot.placement.center.y) * leftWall.room.height;
    const rightCenterHeight =
      counterpart.placement.centerHeight
      ?? counterpart.placement.anchor?.y
      ?? (1 - counterpart.placement.center.y) * rightWall.room.height;
    const leftHeight = slot.placement.physicalHeight ?? slot.placement.mountedHeight;
    const rightHeight = counterpart.placement.physicalHeight ?? counterpart.placement.mountedHeight;
    if (
      Math.abs((rightU - (1 - leftU)) * width) > MIRROR_TOLERANCE_M ||
      Math.abs(rightCenterHeight - leftCenterHeight) > MIRROR_TOLERANCE_M ||
      Math.abs(rightHeight - leftHeight) > MIRROR_TOLERANCE_M
    ) {
      warnings.push(
        `museum-hub mirror symmetry: slot "${counterpartId}" does not mirror "${slot.id}" within the 1 cm tolerance.`
      );
    }
  }
}

function parsePageIndex(slotId: string): number {
  const match = /^room-(\d+)\./.exec(slotId);
  if (!match) return 0;
  const parsed = Number.parseInt(match[1]!, 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed - 1 : 0;
}
