export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export type Polygon = readonly Point2D[];
export type Quad = readonly [Point2D, Point2D, Point2D, Point2D];
export type Matrix3x3 = readonly [number, number, number, number, number, number, number, number, number];

export interface StageReference {
  width: number;
  height: number;
}

export interface WallProjectionModel {
  id: string;
  planeAspect: number;
  quad: Quad;
  safePolygon: Polygon;
  shadowVector?: Point2D;
  room?: RoomWallModel;
  camera?: CameraCalibration;
  referenceQuad?: Quad;
  referenceSafePolygon?: Polygon;
  expectedConvergence?: ProjectionConvergence;
  projectionRealism?: WallProjectionRealism;
}

export interface SlotProjectionModel {
  wallId: string;
  center: Point2D;
  mountedHeight: number;
  /** v3 authoring uses metres in a wall-local coordinate system. */
  anchor?: Point2D;
  provisional?: boolean;
}

export interface CameraCalibration {
  position: Point3D;
  target: Point3D;
  verticalFovDeg: number;
  near: number;
}

export interface HangingBand {
  minY: number;
  maxY: number;
  margin: number;
}

/**
 * A metric-like, orthonormal wall coordinate system. `origin` is the lower-left
 * wall corner; local x/y values are measured in the supplied width/height units.
 */
export interface RoomWallModel {
  origin: Point3D;
  axisU: Point3D;
  axisV: Point3D;
  width: number;
  height: number;
  safePolygon: Polygon;
  doorwayExclusions: readonly Polygon[];
  hangingBand: HangingBand;
}

export type ProjectionConvergence = 'left' | 'right' | 'flat';

export interface ArtworkPlacementValidity {
  finite: boolean;
  contained: boolean;
  doorwayClear: boolean;
  inHangingBand: boolean;
  orientationConsistent: boolean;
}

export type ArtworkPlacementAdjustmentReason =
  | 'none'
  | 'clamped-safe-region'
  | 'shifted-away-from-doorway'
  | 'shrunk-to-fit'
  | 'shifted-and-shrunk'
  | 'rejected';

export type ArtworkPlacementRejectionReason =
  | 'none'
  | 'non-finite'
  | 'outside-safe-region'
  | 'doorway-overlap'
  | 'outside-hanging-band'
  | 'degenerate-local-quad'
  | 'no-valid-candidate'
  | 'projection-invalid'
  | 'projection-realism';

export interface ArtworkPlacementResult {
  anchor: Point2D;
  mountedHeight: number;
  localQuad: Quad;
  validity: ArtworkPlacementValidity;
  moved: boolean;
  scaleFactor: number;
  candidateCount: number;
  adjustmentReason: ArtworkPlacementAdjustmentReason;
  rejectionReason: ArtworkPlacementRejectionReason;
}

export interface WallProjectionRealism {
  referenceResidualMaxPx: number;
  referenceResidualMeanPx: number;
  safeResidualMaxPx: number | null;
  safeResidualMeanPx: number | null;
  axisULength: number;
  axisVLength: number;
  axisDot: number;
  expectedConvergence: ProjectionConvergence;
  projectedConvergence: ProjectionConvergence;
  convergenceSlope: number;
  convergenceMatchesExpected: boolean;
  windingClockwise: boolean;
  thresholdPx: number;
  passes: boolean;
}

export interface CalibratedRoomWallResult {
  room: RoomWallModel;
  scaleX: number;
  scaleY: number;
  projectedQuad: Quad;
  projectedSafePolygon: Point2D[] | null;
  realism: WallProjectionRealism;
}

export interface ProjectedArtworkGeometry {
  localQuad: Quad;
  projectedQuad: Quad;
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
  };
  sourceWidth: number;
  sourceHeight: number;
  cssMatrix3d: string;
  shortEdge: number;
  placement: ArtworkPlacementResult | null;
  validity?: ArtworkPlacementValidity;
  realism?: WallProjectionRealism;
}

const EPSILON = 1e-6;

export const point = (x: number, y: number): Point2D => ({ x, y });
export const point3 = (x: number, y: number, z: number): Point3D => ({ x, y, z });

export function clonePoint(value: Point2D): Point2D {
  return { x: value.x, y: value.y };
}

export function clonePolygon(points: Polygon): Point2D[] {
  return points.map(clonePoint);
}

export function polygonSignedArea(points: Polygon): number {
  let sum = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index]!;
    const next = points[(index + 1) % points.length]!;
    sum += current.x * next.y - next.x * current.y;
  }
  return sum / 2;
}

export function polygonIsClockwise(points: Polygon): boolean {
  return polygonSignedArea(points) > 0;
}

export function normalizeQuadClockwise(quad: Quad): Quad {
  if (polygonIsClockwise(quad)) return quad;
  return [quad[0], quad[3], quad[2], quad[1]];
}

export function quadIsConvex(quad: Quad): boolean {
  let lastSign = 0;
  for (let index = 0; index < quad.length; index += 1) {
    const a = quad[index]!;
    const b = quad[(index + 1) % quad.length]!;
    const c = quad[(index + 2) % quad.length]!;
    const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    const sign = Math.sign(cross);
    if (sign === 0) continue;
    if (lastSign !== 0 && sign !== lastSign) return false;
    lastSign = sign;
  }
  return lastSign !== 0;
}

export function quadIsDegenerate(quad: Quad, epsilon = EPSILON): boolean {
  return Math.abs(polygonSignedArea(quad)) <= epsilon;
}

export function distance(a: Point2D, b: Point2D): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function shortestEdge(quad: Quad): number {
  return Math.min(
    distance(quad[0], quad[1]),
    distance(quad[1], quad[2]),
    distance(quad[2], quad[3]),
    distance(quad[3], quad[0])
  );
}

export function pointInPolygon(target: Point2D, polygon: Polygon): boolean {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const a = polygon[index]!;
    const b = polygon[previous]!;
    const dy = b.y - a.y;
    const safeDy = Math.abs(dy) <= EPSILON ? (dy < 0 ? -EPSILON : EPSILON) : dy;
    const intersects =
      a.y > target.y !== b.y > target.y &&
      target.x < ((b.x - a.x) * (target.y - a.y)) / safeDy + a.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

function projectOntoAxis(points: Polygon, axis: Point2D): { min: number; max: number } {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const current of points) {
    const projection = current.x * axis.x + current.y * axis.y;
    if (projection < min) min = projection;
    if (projection > max) max = projection;
  }
  return { min, max };
}

export function polygonsIntersect(a: Polygon, b: Polygon): boolean {
  const polygons = [a, b];
  for (const polygon of polygons) {
    for (let index = 0; index < polygon.length; index += 1) {
      const current = polygon[index]!;
      const next = polygon[(index + 1) % polygon.length]!;
      const edge = point(next.x - current.x, next.y - current.y);
      const axis = point(-edge.y, edge.x);
      const projectionA = projectOntoAxis(a, axis);
      const projectionB = projectOntoAxis(b, axis);
      if (projectionA.max < projectionB.min || projectionB.max < projectionA.min) return false;
    }
  }
  return true;
}

export function shrinkPolygonTowardsCentroid(points: Polygon, factor: number): Point2D[] {
  const centroid = points.reduce((accumulator, current) => point(accumulator.x + current.x, accumulator.y + current.y), point(0, 0));
  centroid.x /= points.length;
  centroid.y /= points.length;
  return points.map((current) =>
    point(centroid.x + (current.x - centroid.x) * factor, centroid.y + (current.y - centroid.y) * factor)
  );
}

export function computeHomographyFromUnitSquare(rawQuad: Quad): Matrix3x3 | null {
  const quad = normalizeQuadClockwise(rawQuad);
  if (quadIsDegenerate(quad) || !quadIsConvex(quad)) return null;
  const [p0, p1, p2, p3] = quad;
  const dx1 = p1.x - p2.x;
  const dy1 = p1.y - p2.y;
  const dx2 = p3.x - p2.x;
  const dy2 = p3.y - p2.y;
  const sx = p0.x - p1.x + p2.x - p3.x;
  const sy = p0.y - p1.y + p2.y - p3.y;
  const denominator = dx1 * dy2 - dx2 * dy1;
  if (Math.abs(denominator) <= EPSILON) return null;
  const g = (sx * dy2 - dx2 * sy) / denominator;
  const h = (dx1 * sy - sx * dy1) / denominator;
  const a = p1.x - p0.x + g * p1.x;
  const b = p3.x - p0.x + h * p3.x;
  const c = p0.x;
  const d = p1.y - p0.y + g * p1.y;
  const e = p3.y - p0.y + h * p3.y;
  const f = p0.y;
  return [a, b, c, d, e, f, g, h, 1];
}

export function invertMatrix3x3(matrix: Matrix3x3): Matrix3x3 | null {
  const [a, b, c, d, e, f, g, h, i] = matrix;
  const A = e * i - f * h;
  const B = -(d * i - f * g);
  const C = d * h - e * g;
  const D = -(b * i - c * h);
  const E = a * i - c * g;
  const F = -(a * h - b * g);
  const G = b * f - c * e;
  const H = -(a * f - c * d);
  const I = a * e - b * d;
  const determinant = a * A + b * B + c * C;
  if (Math.abs(determinant) <= EPSILON) return null;
  const inverseDeterminant = 1 / determinant;
  return [
    A * inverseDeterminant,
    D * inverseDeterminant,
    G * inverseDeterminant,
    B * inverseDeterminant,
    E * inverseDeterminant,
    H * inverseDeterminant,
    C * inverseDeterminant,
    F * inverseDeterminant,
    I * inverseDeterminant,
  ];
}

export function multiplyMatrix3x3(a: Matrix3x3, b: Matrix3x3): Matrix3x3 {
  return [
    a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
    a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
    a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
    a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
    a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
    a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
    a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
    a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
    a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
  ];
}

export function applyHomography(matrix: Matrix3x3, x: number, y: number): Point2D | null {
  const [a, b, c, d, e, f, g, h, i] = matrix;
  const denominator = g * x + h * y + i;
  if (Math.abs(denominator) <= EPSILON) return null;
  return point((a * x + b * y + c) / denominator, (d * x + e * y + f) / denominator);
}

export function scaleHomographyForSourceRect(matrix: Matrix3x3, width: number, height: number): Matrix3x3 {
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  return [
    matrix[0] / safeWidth,
    matrix[1] / safeHeight,
    matrix[2],
    matrix[3] / safeWidth,
    matrix[4] / safeHeight,
    matrix[5],
    matrix[6] / safeWidth,
    matrix[7] / safeHeight,
    matrix[8],
  ];
}

export function homographyToCssMatrix3d(matrix: Matrix3x3): string {
  return `matrix3d(${matrix[0]}, ${matrix[3]}, 0, ${matrix[6]}, ${matrix[1]}, ${matrix[4]}, 0, ${matrix[7]}, 0, 0, 1, 0, ${matrix[2]}, ${matrix[5]}, 0, ${matrix[8]})`;
}

export function projectWallPoint(wall: WallProjectionModel, localPoint: Point2D): Point2D | null {
  const homography = computeHomographyFromUnitSquare(wall.quad);
  if (!homography) return null;
  return applyHomography(homography, localPoint.x, localPoint.y);
}

export function invertWallPoint(wall: WallProjectionModel, stagePoint: Point2D): Point2D | null {
  const homography = computeHomographyFromUnitSquare(wall.quad);
  if (!homography) return null;
  const inverse = invertMatrix3x3(homography);
  if (!inverse) return null;
  return applyHomography(inverse, stagePoint.x, stagePoint.y);
}

export function getQuadBounds(quad: Quad): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  const xs = quad.map((current) => current.x);
  const ys = quad.map((current) => current.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

function subtract3(a: Point3D, b: Point3D): Point3D {
  return point3(a.x - b.x, a.y - b.y, a.z - b.z);
}

function add3(a: Point3D, b: Point3D): Point3D {
  return point3(a.x + b.x, a.y + b.y, a.z + b.z);
}

function scale3(value: Point3D, factor: number): Point3D {
  return point3(value.x * factor, value.y * factor, value.z * factor);
}

function dot3(a: Point3D, b: Point3D): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cross3(a: Point3D, b: Point3D): Point3D {
  return point3(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );
}

function normalize3(value: Point3D): Point3D | null {
  const length = Math.hypot(value.x, value.y, value.z);
  return Number.isFinite(length) && length > EPSILON ? scale3(value, 1 / length) : null;
}

function cameraBasis(
  camera: CameraCalibration
): { right: Point3D; up: Point3D; forward: Point3D } | null {
  const forward = normalize3(subtract3(camera.target, camera.position));
  const worldUp = point3(0, 1, 0);
  const right = forward ? normalize3(cross3(forward, worldUp)) : null;
  const up = right && forward ? normalize3(cross3(right, forward)) : null;
  if (!forward || !right || !up) return null;
  return { right, up, forward };
}

function cameraIntrinsicsMatrix(
  camera: CameraCalibration,
  stage: StageReference
): Matrix3x3 | null {
  if (
    !Number.isFinite(camera.verticalFovDeg) ||
    camera.verticalFovDeg <= 1 ||
    camera.verticalFovDeg >= 179 ||
    stage.width <= 0 ||
    stage.height <= 0
  ) {
    return null;
  }
  const tanHalfFov = Math.tan((camera.verticalFovDeg * Math.PI) / 360);
  if (!Number.isFinite(tanHalfFov) || tanHalfFov <= EPSILON) return null;
  const focalLength = stage.height / (2 * tanHalfFov);
  return [
    focalLength,
    0,
    stage.width / 2,
    0,
    -focalLength,
    stage.height / 2,
    0,
    0,
    1,
  ];
}

function cameraVectorToWorld(
  camera: CameraCalibration,
  vector: Point3D
): Point3D | null {
  const basis = cameraBasis(camera);
  if (!basis) return null;
  return point3(
    basis.right.x * vector.x + basis.up.x * vector.y + basis.forward.x * vector.z,
    basis.right.y * vector.x + basis.up.y * vector.y + basis.forward.y * vector.z,
    basis.right.z * vector.x + basis.up.z * vector.y + basis.forward.z * vector.z
  );
}

export function isFinitePoint3D(value: Point3D): boolean {
  return Number.isFinite(value.x) && Number.isFinite(value.y) && Number.isFinite(value.z);
}

export function roomWallPoint(wall: RoomWallModel, local: Point2D): Point3D {
  return add3(
    add3(wall.origin, scale3(wall.axisU, local.x)),
    scale3(wall.axisV, local.y)
  );
}

export function roomWallQuad(wall: RoomWallModel): Quad {
  return [
    point(0, wall.height),
    point(wall.width, wall.height),
    point(wall.width, 0),
    point(0, 0),
  ];
}

/**
 * Canonical calibrated camera chain: world → camera → NDC → stage pixels.
 * It intentionally owns all perspective math used by v3 museum placement.
 */
export function projectWorldPoint(
  camera: CameraCalibration,
  worldPoint: Point3D,
  stage: StageReference
): Point2D | null {
  if (
    !isFinitePoint3D(camera.position) ||
    !isFinitePoint3D(camera.target) ||
    !isFinitePoint3D(worldPoint) ||
    !Number.isFinite(camera.verticalFovDeg) ||
    !Number.isFinite(camera.near) ||
    camera.verticalFovDeg <= 1 ||
    camera.verticalFovDeg >= 179 ||
    camera.near <= 0 ||
    stage.width <= 0 ||
    stage.height <= 0
  ) {
    return null;
  }
  const basis = cameraBasis(camera);
  if (!basis) return null;

  const relative = subtract3(worldPoint, camera.position);
  const cameraX = dot3(relative, basis.right);
  const cameraY = dot3(relative, basis.up);
  const cameraZ = dot3(relative, basis.forward);
  if (!Number.isFinite(cameraX) || !Number.isFinite(cameraY) || !Number.isFinite(cameraZ) || cameraZ <= camera.near) {
    return null;
  }
  const tanHalfFov = Math.tan((camera.verticalFovDeg * Math.PI) / 360);
  const aspect = stage.width / stage.height;
  if (!Number.isFinite(tanHalfFov) || tanHalfFov <= EPSILON || !Number.isFinite(aspect) || aspect <= EPSILON) {
    return null;
  }
  const ndcX = cameraX / (cameraZ * tanHalfFov * aspect);
  const ndcY = cameraY / (cameraZ * tanHalfFov);
  if (!Number.isFinite(ndcX) || !Number.isFinite(ndcY)) return null;
  return point(((ndcX + 1) * stage.width) / 2, ((1 - ndcY) * stage.height) / 2);
}

export function projectRoomWallPoint(
  wall: RoomWallModel,
  camera: CameraCalibration,
  local: Point2D,
  stage: StageReference
): Point2D | null {
  return projectWorldPoint(camera, roomWallPoint(wall, local), stage);
}

export function projectRoomWallQuad(
  wall: RoomWallModel,
  camera: CameraCalibration,
  stage: StageReference
): Quad | null {
  const projected = roomWallQuad(wall).map((corner) => projectRoomWallPoint(wall, camera, corner, stage));
  if (projected.some((corner) => corner === null)) return null;
  const quad: Quad = [projected[0]!, projected[1]!, projected[2]!, projected[3]!];
  return quadIsDegenerate(quad) || !quadIsConvex(quad) ? null : normalizeQuadClockwise(quad);
}

export function projectRoomPolygon(
  wall: RoomWallModel,
  camera: CameraCalibration,
  polygon: Polygon,
  stage: StageReference
): Point2D[] | null {
  const projected = polygon.map((corner) => projectRoomWallPoint(wall, camera, corner, stage));
  return projected.some((corner) => corner === null) ? null : (projected as Point2D[]);
}

export function projectRoomDoorwayPolygons(
  wall: RoomWallModel,
  camera: CameraCalibration,
  stage: StageReference
): Point2D[][] {
  return wall.doorwayExclusions
    .map((doorway) => projectRoomPolygon(wall, camera, doorway, stage))
    .filter((doorway): doorway is Point2D[] => doorway !== null);
}

function polygonResidualMetrics(
  reference: Polygon | null | undefined,
  projected: Polygon | null | undefined
): { max: number | null; mean: number | null } {
  if (!reference || !projected || reference.length !== projected.length || reference.length === 0) {
    return { max: null, mean: null };
  }
  const distances = reference.map((point, index) =>
    Math.hypot(point.x - projected[index]!.x, point.y - projected[index]!.y)
  );
  return {
    max: Math.max(...distances),
    mean: distances.reduce((sum, value) => sum + value, 0) / distances.length,
  };
}

export function classifyProjectionConvergence(quad: Quad, slopeEpsilon = 0.02): ProjectionConvergence {
  const run = quad[1].x - quad[0].x;
  const slope = Math.abs(run) <= EPSILON ? 0 : (quad[1].y - quad[0].y) / run;
  if (Math.abs(slope) <= slopeEpsilon) return 'flat';
  return slope > 0 ? 'left' : 'right';
}

export function evaluateWallProjectionRealism(
  room: RoomWallModel,
  projectedQuad: Quad,
  referenceQuad: Quad,
  projectedSafePolygon: Polygon | null,
  referenceSafePolygon: Polygon | null,
  expectedConvergence: ProjectionConvergence,
  thresholdPx = 36
): WallProjectionRealism {
  const quadResidual = polygonResidualMetrics(referenceQuad, projectedQuad);
  const safeResidual = polygonResidualMetrics(referenceSafePolygon, projectedSafePolygon);
  const axisULength = Math.hypot(room.axisU.x, room.axisU.y, room.axisU.z);
  const axisVLength = Math.hypot(room.axisV.x, room.axisV.y, room.axisV.z);
  const axisDot =
    axisULength > EPSILON && axisVLength > EPSILON
      ? (room.axisU.x * room.axisV.x + room.axisU.y * room.axisV.y + room.axisU.z * room.axisV.z) /
        (axisULength * axisVLength)
      : Number.POSITIVE_INFINITY;
  const run = projectedQuad[1].x - projectedQuad[0].x;
  const convergenceSlope = Math.abs(run) <= EPSILON ? 0 : (projectedQuad[1].y - projectedQuad[0].y) / run;
  const projectedConvergence = classifyProjectionConvergence(projectedQuad);
  const convergenceMatchesExpected = projectedConvergence === expectedConvergence;
  const windingClockwise = polygonSignedArea(projectedQuad) > EPSILON;
  const passes =
    windingClockwise &&
    convergenceMatchesExpected &&
    Math.abs(axisULength - 1) <= 0.08 &&
    Math.abs(axisVLength - 1) <= 0.08 &&
    Math.abs(axisDot) <= 0.08 &&
    (quadResidual.max ?? Number.POSITIVE_INFINITY) <= thresholdPx &&
    (safeResidual.max ?? 0) <= thresholdPx;
  return {
    referenceResidualMaxPx: quadResidual.max ?? Number.POSITIVE_INFINITY,
    referenceResidualMeanPx: quadResidual.mean ?? Number.POSITIVE_INFINITY,
    safeResidualMaxPx: safeResidual.max,
    safeResidualMeanPx: safeResidual.mean,
    axisULength,
    axisVLength,
    axisDot,
    expectedConvergence,
    projectedConvergence,
    convergenceSlope,
    convergenceMatchesExpected,
    windingClockwise,
    thresholdPx,
    passes,
  };
}

export function calibrateRoomWallToReferenceQuad(
  room: RoomWallModel,
  referenceQuad: Quad,
  referenceSafePolygon: Polygon | null,
  camera: CameraCalibration,
  stage: StageReference,
  expectedConvergence: ProjectionConvergence,
  thresholdPx = 36
): CalibratedRoomWallResult | null {
  const unitHomography = computeHomographyFromUnitSquare(referenceQuad);
  const intrinsics = cameraIntrinsicsMatrix(camera, stage);
  if (!unitHomography || !intrinsics) return null;
  const intrinsicsInverse = invertMatrix3x3(intrinsics);
  if (!intrinsicsInverse) return null;

  const deriveHomography = (width: number, height: number): {
    homography: Matrix3x3;
    basis1: Point3D;
    basis2: Point3D;
    origin: Point3D;
    norm1: number;
    norm2: number;
  } | null => {
    const localToUnit: Matrix3x3 = [
      1 / Math.max(EPSILON, width),
      0,
      0,
      0,
      -1 / Math.max(EPSILON, height),
      1,
      0,
      0,
      1,
    ];
    const localHomography = multiplyMatrix3x3(unitHomography, localToUnit);
    const decomposition = multiplyMatrix3x3(intrinsicsInverse, localHomography);
    const basis1 = point3(decomposition[0], decomposition[3], decomposition[6]);
    const basis2 = point3(decomposition[1], decomposition[4], decomposition[7]);
    const origin = point3(decomposition[2], decomposition[5], decomposition[8]);
    const norm1 = Math.hypot(basis1.x, basis1.y, basis1.z);
    const norm2 = Math.hypot(basis2.x, basis2.y, basis2.z);
    if (norm1 <= EPSILON || norm2 <= EPSILON) return null;
    return { homography: localHomography, basis1, basis2, origin, norm1, norm2 };
  };

  const initial = deriveHomography(room.width, room.height);
  if (!initial) return null;
  const calibratedWidth = room.width * initial.norm1;
  const calibratedHeight = room.height * initial.norm2;
  const calibrated = deriveHomography(calibratedWidth, calibratedHeight);
  if (!calibrated) return null;

  const cameraOrigin = point3(
    calibrated.origin.x,
    calibrated.origin.y,
    calibrated.origin.z
  );
  const axisUCamera = normalize3(calibrated.basis1);
  const axisVCamera = normalize3(calibrated.basis2);
  const originWorldOffset = cameraVectorToWorld(camera, cameraOrigin);
  const axisUWorld = axisUCamera ? cameraVectorToWorld(camera, axisUCamera) : null;
  const axisVWorld = axisVCamera ? cameraVectorToWorld(camera, axisVCamera) : null;
  if (!originWorldOffset || !axisUWorld || !axisVWorld) return null;

  const scaleX = calibratedWidth / room.width;
  const scaleY = calibratedHeight / room.height;
  const scaledPoint = (value: Point2D): Point2D => point(value.x * scaleX, value.y * scaleY);
  const safePolygon =
    referenceSafePolygon && referenceSafePolygon.length >= 3
      ? (() => {
          const inverse = invertMatrix3x3(calibrated.homography);
          if (!inverse) return room.safePolygon.map(scaledPoint);
          const projectedLocal = referenceSafePolygon
            .map((corner) => applyHomography(inverse, corner.x, corner.y))
            .filter((corner): corner is Point2D => corner !== null);
          return projectedLocal.length === referenceSafePolygon.length
            ? projectedLocal
            : room.safePolygon.map(scaledPoint);
        })()
      : room.safePolygon.map(scaledPoint);

  const calibratedRoom: RoomWallModel = {
    origin: add3(camera.position, originWorldOffset),
    axisU: axisUWorld,
    axisV: axisVWorld,
    width: calibratedWidth,
    height: calibratedHeight,
    safePolygon,
    doorwayExclusions: room.doorwayExclusions.map((polygon) => polygon.map(scaledPoint)),
    hangingBand: {
      minY: room.hangingBand.minY * scaleY,
      maxY: room.hangingBand.maxY * scaleY,
      margin: room.hangingBand.margin * scaleY,
    },
  };

  const projectedQuad = projectRoomWallQuad(calibratedRoom, camera, stage);
  if (!projectedQuad) return null;
  const projectedSafePolygon = projectRoomPolygon(calibratedRoom, camera, calibratedRoom.safePolygon, stage);
  const realism = evaluateWallProjectionRealism(
    calibratedRoom,
    projectedQuad,
    referenceQuad,
    projectedSafePolygon,
    referenceSafePolygon,
    expectedConvergence,
    thresholdPx
  );
  return {
    room: calibratedRoom,
    scaleX,
    scaleY,
    projectedQuad,
    projectedSafePolygon,
    realism,
  };
}

function localBounds(polygon: Polygon): { minX: number; maxX: number; minY: number; maxY: number } {
  return {
    minX: Math.min(...polygon.map((point) => point.x)),
    maxX: Math.max(...polygon.map((point) => point.x)),
    minY: Math.min(...polygon.map((point) => point.y)),
    maxY: Math.max(...polygon.map((point) => point.y)),
  };
}

function localArtworkQuad(anchor: Point2D, width: number, height: number): Quad {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  return [
    point(anchor.x - halfWidth, anchor.y + halfHeight),
    point(anchor.x + halfWidth, anchor.y + halfHeight),
    point(anchor.x + halfWidth, anchor.y - halfHeight),
    point(anchor.x - halfWidth, anchor.y - halfHeight),
  ];
}

/**
 * Fits an artwork in a wall's local coordinate system before any screen
 * projection. Doorway overlap is a hard rejection: the solver moves or shrinks
 * the candidate but never returns an intersecting mounted quad.
 */
export function solveRoomArtworkPlacement(
  wall: RoomWallModel,
  requestedAnchor: Point2D,
  requestedHeight: number,
  artworkAspect: number
): ArtworkPlacementResult {
  const safeBounds = localBounds(wall.safePolygon);
  const aspect = Math.max(EPSILON, artworkAspect);
  const maxWidth = Math.max(EPSILON, safeBounds.maxX - safeBounds.minX);
  const maxHeight = Math.max(EPSILON, wall.hangingBand.maxY - wall.hangingBand.minY - wall.hangingBand.margin * 2);
  const baseHeight = Math.max(EPSILON, Math.min(requestedHeight, maxHeight, maxWidth / aspect));

  const evaluateCandidate = (anchor: Point2D, height: number): ArtworkPlacementResult => {
    const localQuad = localArtworkQuad(anchor, height * aspect, height);
    const finite = [...localQuad, anchor].every((value) => Number.isFinite(value.x) && Number.isFinite(value.y));
    const contained = localQuad.every((corner) => pointInPolygon(corner, wall.safePolygon));
    const doorwayClear = wall.doorwayExclusions.every((doorway) => !polygonsIntersect(localQuad, doorway));
    const inHangingBand = localQuad.every(
      (corner) =>
        corner.y >= wall.hangingBand.minY + wall.hangingBand.margin - EPSILON &&
        corner.y <= wall.hangingBand.maxY - wall.hangingBand.margin + EPSILON
    );
    const orientationConsistent = quadIsConvex(localQuad) && Math.abs(polygonSignedArea(localQuad)) > EPSILON;
    const rejectionReason: ArtworkPlacementRejectionReason =
      !finite
        ? 'non-finite'
        : !orientationConsistent
          ? 'degenerate-local-quad'
          : !contained
            ? 'outside-safe-region'
            : !doorwayClear
              ? 'doorway-overlap'
              : !inHangingBand
                ? 'outside-hanging-band'
                : 'none';
    return {
      anchor,
      mountedHeight: height,
      localQuad,
      validity: {
        finite,
        contained,
        doorwayClear,
        inHangingBand,
        orientationConsistent,
      },
      moved: false,
      scaleFactor: 1,
      candidateCount: 1,
      adjustmentReason: 'none',
      rejectionReason,
    };
  };

  const shrinkSteps = [1, 0.97, 0.94, 0.91, 0.88, 0.85, 0.82, 0.79, 0.76, 0.73, 0.7, 0.67, 0.64, 0.61, 0.58, 0.55];
  const doorwayBounds = wall.doorwayExclusions.map((doorway) => localBounds(doorway));
  const roundCandidate = (value: number): number => Math.round(value * 10000) / 10000;
  const pushUnique = (list: number[], value: number, min: number, max: number): void => {
    if (!Number.isFinite(value)) return;
    const clamped = Math.min(max, Math.max(min, value));
    if (list.some((entry) => Math.abs(entry - clamped) <= 1e-4)) return;
    list.push(roundCandidate(clamped));
  };

  const bestRequested = evaluateCandidate(
    point(requestedAnchor.x, requestedAnchor.y),
    baseHeight
  );
  let fallback = bestRequested;
  let bestValid: ArtworkPlacementResult | null = null;
  let bestScore = Number.POSITIVE_INFINITY;
  let candidateCount = 0;

  for (const scaleFactor of shrinkSteps) {
    const mountedHeight = Math.max(EPSILON, baseHeight * scaleFactor);
    const halfWidth = (mountedHeight * aspect) / 2;
    const halfHeight = mountedHeight / 2;
    const xMin = safeBounds.minX + halfWidth;
    const xMax = safeBounds.maxX - halfWidth;
    const yMin = wall.hangingBand.minY + wall.hangingBand.margin + halfHeight;
    const yMax = wall.hangingBand.maxY - wall.hangingBand.margin - halfHeight;
    if (xMin > xMax || yMin > yMax) continue;

    const xCandidates: number[] = [];
    const yCandidates: number[] = [];
    const clampedX = Math.min(xMax, Math.max(xMin, requestedAnchor.x));
    const clampedY = Math.min(yMax, Math.max(yMin, requestedAnchor.y));
    pushUnique(xCandidates, clampedX, xMin, xMax);
    pushUnique(xCandidates, xMin, xMin, xMax);
    pushUnique(xCandidates, xMax, xMin, xMax);
    pushUnique(yCandidates, clampedY, yMin, yMax);
    pushUnique(yCandidates, yMin, yMin, yMax);
    pushUnique(yCandidates, yMax, yMin, yMax);

    for (const safePoint of wall.safePolygon) {
      pushUnique(xCandidates, safePoint.x, xMin, xMax);
      pushUnique(yCandidates, safePoint.y, yMin, yMax);
    }

    const doorwayClearance = Math.max(0.01, wall.hangingBand.margin * 0.5);
    for (const bounds of doorwayBounds) {
      pushUnique(xCandidates, bounds.minX - halfWidth - doorwayClearance, xMin, xMax);
      pushUnique(xCandidates, bounds.maxX + halfWidth + doorwayClearance, xMin, xMax);
      pushUnique(yCandidates, bounds.maxY + halfHeight + doorwayClearance, yMin, yMax);
      pushUnique(yCandidates, bounds.minY - halfHeight - doorwayClearance, yMin, yMax);
    }

    for (const y of yCandidates) {
      for (const x of xCandidates) {
        candidateCount += 1;
        const candidate = evaluateCandidate(point(x, y), mountedHeight);
        candidate.scaleFactor = scaleFactor;
        candidate.candidateCount = candidateCount;
        fallback = candidate;
        if (
          !candidate.validity.finite ||
          !candidate.validity.contained ||
          !candidate.validity.doorwayClear ||
          !candidate.validity.inHangingBand ||
          !candidate.validity.orientationConsistent
        ) {
          continue;
        }
        const movePenalty = Math.hypot(candidate.anchor.x - requestedAnchor.x, candidate.anchor.y - requestedAnchor.y);
        const shrinkPenalty = Math.abs(baseHeight - mountedHeight) / Math.max(baseHeight, EPSILON);
        const score = movePenalty + shrinkPenalty * 0.75;
        if (score < bestScore - 1e-6) {
          bestScore = score;
          bestValid = candidate;
        }
      }
    }
    if (bestValid) break;
  }

  const resolved = bestValid ?? fallback;
  const moved =
    Math.abs(resolved.anchor.x - requestedAnchor.x) > 1e-6 ||
    Math.abs(resolved.anchor.y - requestedAnchor.y) > 1e-6;
  const shrunk = Math.abs(resolved.mountedHeight - requestedHeight) > 1e-6;
  resolved.moved = moved;
  resolved.candidateCount = Math.max(candidateCount, 1);
  resolved.scaleFactor = Math.max(EPSILON, resolved.mountedHeight / Math.max(requestedHeight, EPSILON));
  const requestedIntersectsDoorway = !bestRequested.validity.doorwayClear;
  resolved.adjustmentReason = bestValid
    ? moved && shrunk
      ? 'shifted-and-shrunk'
      : moved
        ? requestedIntersectsDoorway
          ? 'shifted-away-from-doorway'
          : 'clamped-safe-region'
        : shrunk
          ? 'shrunk-to-fit'
          : 'none'
    : 'rejected';
  if (bestValid) {
    resolved.rejectionReason = 'none';
    return resolved;
  }
  resolved.rejectionReason = resolved.rejectionReason === 'none' ? 'no-valid-candidate' : resolved.rejectionReason;
  return resolved;
}

export function projectSlotArtwork(
  wall: WallProjectionModel,
  slot: SlotProjectionModel,
  artworkAspect: number,
  stage: StageReference
): ProjectedArtworkGeometry | null {
  if (wall.room && wall.camera && slot.anchor) {
    const placement = solveRoomArtworkPlacement(
      wall.room,
      slot.anchor,
      slot.mountedHeight,
      artworkAspect
    );
    if (
      !placement.validity.finite ||
      !placement.validity.contained ||
      !placement.validity.doorwayClear ||
      !placement.validity.inHangingBand ||
      !placement.validity.orientationConsistent
    ) {
      return null;
    }
    if (wall.projectionRealism && !wall.projectionRealism.passes) return null;
    const projected = placement.localQuad.map((corner) =>
      projectRoomWallPoint(wall.room!, wall.camera!, corner, stage)
    );
    if (projected.some((corner) => corner === null)) return null;
    const projectedQuad = normalizeQuadClockwise([
      projected[0]!,
      projected[1]!,
      projected[2]!,
      projected[3]!,
    ]);
    if (quadIsDegenerate(projectedQuad) || !quadIsConvex(projectedQuad)) return null;
    if (wall.safePolygon && !projectedQuad.every((corner) => pointInPolygon(corner, wall.safePolygon))) {
      return null;
    }
    const sourceHeight = Math.max(1, (placement.mountedHeight / wall.room.height) * stage.height);
    const sourceWidth = Math.max(1, sourceHeight * Math.max(EPSILON, artworkAspect));
    const quadHomography = computeHomographyFromUnitSquare(projectedQuad);
    if (!quadHomography) return null;
    const sourceHomography = scaleHomographyForSourceRect(quadHomography, sourceWidth, sourceHeight);
    return {
      localQuad: placement.localQuad,
      projectedQuad,
      bounds: getQuadBounds(projectedQuad),
      sourceWidth,
      sourceHeight,
      cssMatrix3d: homographyToCssMatrix3d(sourceHomography),
      shortEdge: shortestEdge(projectedQuad),
      placement,
      validity: placement.validity,
      realism: wall.projectionRealism,
    };
  }

  const safeAspect = Math.max(EPSILON, artworkAspect);
  const containHeightLimit = Math.max(EPSILON, Math.min(1, wall.planeAspect / safeAspect));
  const mountedHeight = Math.max(EPSILON, Math.min(slot.mountedHeight, containHeightLimit));
  const mountedWidth = mountedHeight * safeAspect / Math.max(EPSILON, wall.planeAspect);
  const halfWidth = mountedWidth / 2;
  const halfHeight = mountedHeight / 2;
  const localQuad: Quad = [
    point(slot.center.x - halfWidth, slot.center.y - halfHeight),
    point(slot.center.x + halfWidth, slot.center.y - halfHeight),
    point(slot.center.x + halfWidth, slot.center.y + halfHeight),
    point(slot.center.x - halfWidth, slot.center.y + halfHeight),
  ];
  const homography = computeHomographyFromUnitSquare(wall.quad);
  if (!homography) return null;
  const projected = localQuad.map((current) => applyHomography(homography, current.x, current.y));
  if (projected.some((current) => current === null)) return null;
  const projectedQuad = normalizeQuadClockwise([
    projected[0]!,
    projected[1]!,
    projected[2]!,
    projected[3]!,
  ]);
  const sourceHeight = Math.max(1, mountedHeight * stage.height);
  const sourceWidth = Math.max(1, sourceHeight * artworkAspect);
  const quadHomography = computeHomographyFromUnitSquare(projectedQuad);
  if (!quadHomography) return null;
  const sourceHomography = scaleHomographyForSourceRect(quadHomography, sourceWidth, sourceHeight);
  return {
    localQuad,
    projectedQuad,
    bounds: getQuadBounds(projectedQuad),
    sourceWidth,
    sourceHeight,
    cssMatrix3d: homographyToCssMatrix3d(sourceHomography),
    shortEdge: shortestEdge(projectedQuad),
    placement: null,
  };
}
