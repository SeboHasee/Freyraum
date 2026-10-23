/**
 * v1.41 — pure camera math for the phone panorama of the museum hub.
 *
 * In narrow portrait viewports the hub photograph is sized by height, so it
 * is wider than the screen. The camera is a single horizontal translation
 * `pan` (px) of the centred visual: `pan > 0` reveals the left wall,
 * `pan < 0` the right wall. Artwork x positions are fractions of the visual
 * width (0 = left photo edge, 1 = right photo edge).
 */

/** Largest |pan| that keeps the photograph covering the viewport. */
export function panoramaPanLimit(visualWidth: number, viewportWidth: number): number {
  if (!(visualWidth > 0) || !(viewportWidth > 0)) return 0;
  return Math.max(0, (visualWidth - viewportWidth) / 2);
}

/** Pan that centres the photo x fraction `fraction`, clamped to the limits. */
export function panoramaPanForFraction(fraction: number, visualWidth: number, limit: number): number {
  const pan = visualWidth * (0.5 - fraction);
  return Math.max(-limit, Math.min(limit, pan));
}

/**
 * Fractional strip index for the current pan. `targets` are the pans that
 * centre each artwork, ordered left → right in the room (so non-increasing).
 * Between two artworks the index interpolates linearly; outside the first or
 * last artwork it is clamped to the strip ends.
 */
export function stripFractionForPan(pan: number, targets: readonly number[]): number {
  const count = targets.length;
  if (count === 0) return 0;
  if (count === 1 || pan >= targets[0]!) return 0;
  if (pan <= targets[count - 1]!) return count - 1;
  for (let index = 0; index < count - 1; index += 1) {
    const from = targets[index]!;
    const to = targets[index + 1]!;
    if (pan <= from && pan >= to) {
      const span = from - to;
      return span <= 1e-6 ? index : index + (from - pan) / span;
    }
  }
  return count - 1;
}

/** Inverse of {@link stripFractionForPan}: pan for a fractional strip index. */
export function panForStripFraction(fraction: number, targets: readonly number[]): number {
  const count = targets.length;
  if (count === 0) return 0;
  const clamped = Math.max(0, Math.min(count - 1, fraction));
  const index = Math.min(count - 2, Math.floor(clamped));
  if (index < 0) return targets[0]!;
  const local = clamped - index;
  const from = targets[index]!;
  const to = targets[index + 1]!;
  return from + (to - from) * local;
}

/** Index of the artwork whose centring pan is closest to `pan`. */
export function nearestPanoramaTarget(pan: number, targets: readonly number[]): number {
  let best = -1;
  let bestDistance = Infinity;
  targets.forEach((target, index) => {
    const distance = Math.abs(target - pan);
    if (distance < bestDistance - 1e-6) {
      best = index;
      bestDistance = distance;
    }
  });
  return best;
}

/**
 * Release decision for an edge pull: a drag that overshoots a panorama edge
 * by more than `threshold` px moves to the neighbouring room.
 * Returns -1 (previous room), 1 (next room) or 0.
 */
export function panoramaEdgeRoomStep(pan: number, limit: number, threshold: number): -1 | 0 | 1 {
  if (pan > limit + threshold) return -1;
  if (pan < -limit - threshold) return 1;
  return 0;
}
