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

export interface ArtworkPlacementValidity {
  finite: boolean;
  contained: boolean;
  doorwayClear: boolean;
  inHangingBand: boolean;
  orientationConsistent: boolean;
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
  validity?: ArtworkPlacementValidity;
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
  const forward = normalize3(subtract3(camera.target, camera.position));
  const worldUp = point3(0, 1, 0);
  const right = forward ? normalize3(cross3(forward, worldUp)) : null;
  const up = right && forward ? normalize3(cross3(right, forward)) : null;
  if (!forward || !right || !up) return null;

  const relative = subtract3(worldPoint, camera.position);
  const cameraX = dot3(relative, right);
  const cameraY = dot3(relative, up);
  const cameraZ = dot3(relative, forward);
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
): { anchor: Point2D; mountedHeight: number; localQuad: Quad; validity: ArtworkPlacementValidity } {
  const safeBounds = localBounds(wall.safePolygon);
  const aspect = Math.max(EPSILON, artworkAspect);
  const maxWidth = Math.max(EPSILON, safeBounds.maxX - safeBounds.minX);
  const maxHeight = Math.max(EPSILON, wall.hangingBand.maxY - wall.hangingBand.minY - wall.hangingBand.margin * 2);
  let mountedHeight = Math.max(EPSILON, Math.min(requestedHeight, maxHeight, maxWidth / aspect));

  const candidateFor = (anchor: Point2D, height: number): Quad => localArtworkQuad(anchor, height * aspect, height);
  const fitCandidate = (height: number): Point2D => {
    const halfWidth = (height * aspect) / 2;
    const halfHeight = height / 2;
    return point(
      Math.min(safeBounds.maxX - halfWidth, Math.max(safeBounds.minX + halfWidth, requestedAnchor.x)),
      Math.min(
        wall.hangingBand.maxY - wall.hangingBand.margin - halfHeight,
        Math.max(wall.hangingBand.minY + wall.hangingBand.margin + halfHeight, requestedAnchor.y)
      )
    );
  };

  let anchor = fitCandidate(mountedHeight);
  let localQuad = candidateFor(anchor, mountedHeight);
  const isDoorwayClear = (quad: Quad): boolean =>
    wall.doorwayExclusions.every((doorway) => !polygonsIntersect(quad, doorway));
  for (let attempt = 0; attempt < 16 && !isDoorwayClear(localQuad); attempt += 1) {
    const halfWidth = (mountedHeight * aspect) / 2;
    const alternatives = [
      point(safeBounds.minX + halfWidth, anchor.y),
      point(safeBounds.maxX - halfWidth, anchor.y),
      point(anchor.x, wall.hangingBand.maxY - wall.hangingBand.margin - mountedHeight / 2),
      point(anchor.x, wall.hangingBand.minY + wall.hangingBand.margin + mountedHeight / 2),
    ];
    const valid = alternatives
      .map((candidate) => ({ anchor: candidate, quad: candidateFor(candidate, mountedHeight) }))
      .find((candidate) => candidate.quad.every((corner) => pointInPolygon(corner, wall.safePolygon)) && isDoorwayClear(candidate.quad));
    if (valid) {
      anchor = valid.anchor;
      localQuad = valid.quad;
      break;
    }
    mountedHeight *= 0.9;
    anchor = fitCandidate(mountedHeight);
    localQuad = candidateFor(anchor, mountedHeight);
  }

  const contained = localQuad.every((corner) => pointInPolygon(corner, wall.safePolygon));
  const doorwayClear = isDoorwayClear(localQuad);
  const inHangingBand = localQuad.every(
    (corner) =>
      corner.y >= wall.hangingBand.minY + wall.hangingBand.margin - EPSILON &&
      corner.y <= wall.hangingBand.maxY - wall.hangingBand.margin + EPSILON
  );
  return {
    anchor,
    mountedHeight,
    localQuad,
    validity: {
      finite: [...localQuad, anchor].every((value) => Number.isFinite(value.x) && Number.isFinite(value.y)),
      contained,
      doorwayClear,
      inHangingBand,
      orientationConsistent: true,
    },
  };
}

export function projectSlotArtwork(
  wall: WallProjectionModel,
  slot: SlotProjectionModel,
  artworkAspect: number,
  stage: StageReference
): ProjectedArtworkGeometry | null {
  if (wall.room && wall.camera && slot.anchor) {
    const solved = solveRoomArtworkPlacement(
      wall.room,
      slot.anchor,
      slot.mountedHeight,
      artworkAspect
    );
    if (
      !solved.validity.finite ||
      !solved.validity.contained ||
      !solved.validity.doorwayClear ||
      !solved.validity.inHangingBand
    ) {
      return null;
    }
    const projected = solved.localQuad.map((corner) =>
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
    const sourceHeight = Math.max(1, (solved.mountedHeight / wall.room.height) * stage.height);
    const sourceWidth = Math.max(1, sourceHeight * Math.max(EPSILON, artworkAspect));
    const quadHomography = computeHomographyFromUnitSquare(projectedQuad);
    if (!quadHomography) return null;
    const sourceHomography = scaleHomographyForSourceRect(quadHomography, sourceWidth, sourceHeight);
    return {
      localQuad: solved.localQuad,
      projectedQuad,
      bounds: getQuadBounds(projectedQuad),
      sourceWidth,
      sourceHeight,
      cssMatrix3d: homographyToCssMatrix3d(sourceHomography),
      shortEdge: shortestEdge(projectedQuad),
      validity: solved.validity,
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
  };
}
