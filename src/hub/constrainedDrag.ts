import { point, type Point2D, type Polygon } from './projectiveGeometry';

/**
 * Shared "stop at the limit and slide along it" solver for every editor drag.
 *
 * `isValid` is evaluated on candidate positions only; callers keep ownership of
 * how a candidate is applied. When the requested target is blocked, motion
 * continues per axis from the last valid position (x-then-y, y-then-x, and the
 * direct segment), and the candidate closest to the target wins. This lets a
 * handle glide along a boundary instead of freezing or being pulled toward a
 * centroid.
 */
export interface SlideOptions {
  /** Bisection iterations per segment (default 16 → ~1/65 536 precision). */
  iterations?: number;
  /** Distance used to pick the best candidate (default Euclidean). */
  distance?: (a: Point2D, b: Point2D) => number;
  /**
   * Extra rounds that also try directions rotated away from the remaining
   * offset, so a handle glides along sloped (non axis-aligned) limits instead
   * of sticking to them (default 2).
   */
  refinements?: number;
}

const REFINEMENT_ANGLES = [Math.PI / 4, -Math.PI / 4, (4 * Math.PI) / 9, (-4 * Math.PI) / 9];

export interface SlideResult {
  point: Point2D;
  /** True when the target itself was invalid and the result was limited. */
  blocked: boolean;
  /** False when even the start position is invalid (nothing was moved). */
  startValid: boolean;
}

function lerpPoint(from: Point2D, to: Point2D, t: number): Point2D {
  return point(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t);
}

/** Furthest valid point on the segment from a valid `from` toward `to`. */
export function advanceToValid(
  from: Point2D,
  to: Point2D,
  isValid: (candidate: Point2D) => boolean,
  iterations = 16
): Point2D {
  if (isValid(to)) return to;
  let valid = 0;
  let invalid = 1;
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const t = (valid + invalid) / 2;
    if (isValid(lerpPoint(from, to, t))) valid = t;
    else invalid = t;
  }
  return lerpPoint(from, to, valid);
}

export function slideToValid(
  start: Point2D,
  target: Point2D,
  isValid: (candidate: Point2D) => boolean,
  options: SlideOptions = {}
): SlideResult {
  if (isValid(target)) return { point: target, blocked: false, startValid: true };
  if (!isValid(start)) return { point: start, blocked: true, startValid: false };
  const iterations = options.iterations ?? 16;
  const distance = options.distance ?? ((a: Point2D, b: Point2D) => Math.hypot(a.x - b.x, a.y - b.y));
  const closer = (winner: Point2D, candidate: Point2D): Point2D =>
    distance(candidate, target) < distance(winner, target) - 1e-12 ? candidate : winner;
  const step = (from: Point2D, withRotations: boolean): Point2D => {
    const afterX = advanceToValid(from, point(target.x, from.y), isValid, iterations);
    const xThenY = advanceToValid(afterX, point(afterX.x, target.y), isValid, iterations);
    const afterY = advanceToValid(from, point(from.x, target.y), isValid, iterations);
    const yThenX = advanceToValid(afterY, point(target.x, afterY.y), isValid, iterations);
    const direct = advanceToValid(from, target, isValid, iterations);
    const candidates = [xThenY, yThenX, direct];
    if (withRotations) {
      const dx = target.x - from.x;
      const dy = target.y - from.y;
      for (const angle of REFINEMENT_ANGLES) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        // Rotated toward a possible tangent of a sloped limit.
        candidates.push(advanceToValid(from, point(from.x + dx * cos - dy * sin, from.y + dx * sin + dy * cos), isValid, iterations));
      }
    }
    return candidates.reduce(closer, from);
  };
  let best = step(start, false);
  const refinements = options.refinements ?? 2;
  for (let round = 0; round < refinements; round += 1) {
    const next = step(best, true);
    if (next === best) break;
    best = next;
  }
  return { point: best, blocked: true, startValid: true };
}

function segmentsCross(a: Point2D, b: Point2D, c: Point2D, d: Point2D): boolean {
  const orient = (p: Point2D, q: Point2D, r: Point2D): number =>
    (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  const o1 = orient(a, b, c);
  const o2 = orient(a, b, d);
  const o3 = orient(c, d, a);
  const o4 = orient(c, d, b);
  return o1 * o2 < 0 && o3 * o4 < 0;
}

/** True when no two non-adjacent edges of the closed polygon intersect. */
export function polygonIsSimple(points: Polygon): boolean {
  const count = points.length;
  if (count < 3) return false;
  for (let index = 0; index < count; index += 1) {
    const a = points[index]!;
    const b = points[(index + 1) % count]!;
    for (let other = index + 1; other < count; other += 1) {
      if (other === index || (other + 1) % count === index || (index + 1) % count === other) continue;
      const c = points[other]!;
      const d = points[(other + 1) % count]!;
      if (segmentsCross(a, b, c, d)) return false;
    }
  }
  return true;
}

/** Closest edge of `polygon` to `target`, returned as its two endpoints. */
export function nearestPolygonEdge(target: Point2D, polygon: Polygon): [Point2D, Point2D] | null {
  if (polygon.length < 2) return null;
  let best: [Point2D, Point2D] | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let index = 0; index < polygon.length; index += 1) {
    const start = polygon[index]!;
    const end = polygon[(index + 1) % polygon.length]!;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;
    const t = lengthSquared <= 1e-12
      ? 0
      : Math.max(0, Math.min(1, ((target.x - start.x) * dx + (target.y - start.y) * dy) / lengthSquared));
    const distanceToEdge = Math.hypot(target.x - (start.x + dx * t), target.y - (start.y + dy * t));
    if (distanceToEdge < bestDistance) {
      bestDistance = distanceToEdge;
      best = [start, end];
    }
  }
  return best;
}
