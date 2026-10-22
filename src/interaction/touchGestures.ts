/**
 * Shared touch-gesture physics for the gallery, the photo room, and the museum
 * hub panorama. Everything here is pure (no DOM state) so every view gets the
 * same feel and the maths can be unit-tested in Node:
 *
 * - velocity from the last ~100 ms of pointer samples (flick speed);
 * - frame-rate-independent exponential momentum decay;
 * - rubber-band resistance past a limit and a spring back on release;
 * - momentum-aware snap-target selection;
 * - tap-versus-drag slop and double-tap detection;
 * - anchored multiplicative zoom (content stays under the fingers).
 *
 * Reduced motion keeps direct finger control but callers skip momentum and
 * springs (`isMotionReduced`), matching the repository's motion-only rule.
 */

/** Movement allowance before a press becomes a drag (px). */
export const TAP_SLOP_PX = 9;
/** Pointer history window used for release velocity (ms). */
export const VELOCITY_WINDOW_MS = 100;
/** Release speed below which no momentum is started (px/s). */
export const MIN_FLING_VELOCITY = 120;
/** Momentum decay per second; distance travelled ≈ velocity / lambda. */
export const MOMENTUM_DECAY_LAMBDA = 4.2;
/** Spring-back speed when released past a limit. */
export const SPRING_BACK_LAMBDA = 11;
/** Fling speed above which a swipe navigates even under the distance threshold. */
export const FLICK_VELOCITY = 520;
export const DOUBLE_TAP_MS = 320;
export const DOUBLE_TAP_SLOP_PX = 28;
/** iOS-style rubber-band constant. */
export const RUBBER_BAND_COEFFICIENT = 0.55;

export interface PointSample {
  t: number;
  x: number;
  y: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

/** Tracks recent pointer samples and reports the release velocity in px/s. */
export class VelocityTracker {
  private samples: PointSample[] = [];

  constructor(private readonly windowMs = VELOCITY_WINDOW_MS) {}

  reset(): void {
    this.samples = [];
  }

  add(t: number, x: number, y: number): void {
    this.samples.push({ t, x, y });
    const cutoff = t - this.windowMs * 2;
    while (this.samples.length > 2 && this.samples[0]!.t < cutoff) this.samples.shift();
  }

  velocity(now = this.samples[this.samples.length - 1]?.t ?? 0): Vector2 {
    return estimateVelocity(this.samples, now, this.windowMs);
  }
}

/**
 * Least-squares slope of position over time for samples inside the window.
 * A finger that stopped before release (last sample older than the window)
 * yields zero so a slow, deliberate placement never flings.
 */
export function estimateVelocity(
  samples: readonly PointSample[],
  now: number,
  windowMs = VELOCITY_WINDOW_MS
): Vector2 {
  const recent = samples.filter((sample) => now - sample.t <= windowMs);
  if (recent.length < 2) return { x: 0, y: 0 };
  const meanT = recent.reduce((sum, s) => sum + s.t, 0) / recent.length;
  const meanX = recent.reduce((sum, s) => sum + s.x, 0) / recent.length;
  const meanY = recent.reduce((sum, s) => sum + s.y, 0) / recent.length;
  let covX = 0;
  let covY = 0;
  let varT = 0;
  for (const sample of recent) {
    const dt = sample.t - meanT;
    covX += dt * (sample.x - meanX);
    covY += dt * (sample.y - meanY);
    varT += dt * dt;
  }
  if (varT <= 1e-9) return { x: 0, y: 0 };
  return { x: (covX / varT) * 1000, y: (covY / varT) * 1000 };
}

/**
 * Rubber-band displacement for an overshoot past a limit:
 * `(1 - 1 / (overshoot * c / dimension + 1)) * dimension`. Small pulls track
 * the finger almost 1:1 (scaled by c); large pulls approach `dimension`.
 */
export function rubberBand(
  overshoot: number,
  dimension: number,
  coefficient = RUBBER_BAND_COEFFICIENT
): number {
  if (overshoot === 0 || !(dimension > 0)) return 0;
  const sign = Math.sign(overshoot);
  const distance = Math.abs(overshoot);
  return sign * (1 - 1 / ((distance * coefficient) / dimension + 1)) * dimension;
}

/** Applies rubber-band resistance outside `[min, max]`, identity inside. */
export function rubberBandClamp(
  value: number,
  min: number,
  max: number,
  dimension: number,
  coefficient = RUBBER_BAND_COEFFICIENT
): number {
  if (min > max) return (min + max) * 0.5;
  if (value < min) return min + rubberBand(value - min, dimension, coefficient);
  if (value > max) return max + rubberBand(value - max, dimension, coefficient);
  return value;
}

export interface MomentumState {
  position: number;
  velocity: number;
}

export interface MomentumStep extends MomentumState {
  settled: boolean;
}

/**
 * One frame-rate-independent momentum step along a single axis. Inside the
 * limits the velocity decays exponentially; past a limit the overshoot is
 * pulled back with a critically-damped-like spring and any outward velocity
 * is absorbed quickly, so the content bounces softly instead of stopping hard.
 */
export function stepMomentum(
  state: MomentumState,
  deltaSeconds: number,
  min: number,
  max: number,
  decayLambda = MOMENTUM_DECAY_LAMBDA,
  springLambda = SPRING_BACK_LAMBDA
): MomentumStep {
  const dt = Math.max(0, Math.min(deltaSeconds, 0.064));
  let { position, velocity } = state;
  if (dt === 0) return { position, velocity, settled: false };
  const outside = position < min ? min : position > max ? max : null;
  if (outside === null) {
    const decay = Math.exp(-decayLambda * dt);
    position += (velocity / decayLambda) * (1 - decay);
    velocity *= decay;
  } else {
    // Absorb outward velocity fast, then ease the overshoot back.
    const absorb = Math.exp(-springLambda * 2.2 * dt);
    position += (velocity / (springLambda * 2.2)) * (1 - absorb);
    velocity *= absorb;
    const pull = 1 - Math.exp(-springLambda * dt);
    const bound = position < min ? min : position > max ? max : null;
    if (bound !== null) position += (bound - position) * pull;
  }
  const inside = position >= min - 0.25 && position <= max + 0.25;
  const settled = inside && Math.abs(velocity) < 8;
  if (settled) position = Math.max(min, Math.min(max, position));
  return { position, velocity: settled ? 0 : velocity, settled };
}

/** Distance an unconstrained fling covers before it stops. */
export function projectMomentumDistance(velocity: number, decayLambda = MOMENTUM_DECAY_LAMBDA): number {
  return velocity / decayLambda;
}

/**
 * Picks the snap target nearest to where a fling would come to rest. With a
 * `softRadius`, only targets within that distance of the resting point snap
 * (free scrolling elsewhere); `null` means "do not snap".
 */
export function pickSnapTarget(
  position: number,
  velocity: number,
  targets: readonly number[],
  options: { decayLambda?: number; softRadius?: number; min?: number; max?: number } = {}
): number | null {
  if (targets.length === 0) return null;
  const min = options.min ?? -Infinity;
  const max = options.max ?? Infinity;
  const rest = Math.max(min, Math.min(max, position + projectMomentumDistance(velocity, options.decayLambda)));
  let best: number | null = null;
  let bestDistance = Infinity;
  for (const target of targets) {
    const distance = Math.abs(target - rest);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = target;
    }
  }
  if (options.softRadius !== undefined && bestDistance > options.softRadius) return null;
  return best;
}

/** Velocity needed for an exponential fling to land exactly on `target`. */
export function velocityToReach(position: number, target: number, decayLambda = MOMENTUM_DECAY_LAMBDA): number {
  return (target - position) * decayLambda;
}

export function exceedsTapSlop(dx: number, dy: number, slop = TAP_SLOP_PX): boolean {
  return Math.hypot(dx, dy) > slop;
}

/** Swipe navigation resolves on distance or on a fast, mostly-horizontal flick. */
export function resolveSwipeDirection(
  dx: number,
  dy: number,
  velocityX: number,
  distanceThreshold = 50,
  flickVelocity = FLICK_VELOCITY
): -1 | 0 | 1 {
  if (Math.abs(dx) <= Math.abs(dy) * 1.2) return 0;
  const far = Math.abs(dx) > distanceThreshold;
  const flick = Math.abs(velocityX) > flickVelocity && Math.abs(dx) > 14 && Math.sign(velocityX) === Math.sign(dx);
  if (!far && !flick) return 0;
  return dx < 0 ? 1 : -1;
}

export type SheetStopRelease =
  | { kind: 'toggle' }
  | { kind: 'dismiss' }
  | { kind: 'stop'; index: number };

/**
 * v1.46 (C1) — phone bottom sheet with ascending stop heights (peek, half,
 * full). `dy` is the handle drag (down positive, px) from `startIndex`,
 * `velocityY` the release velocity (px/s). A tap toggles; short slow drags
 * and flicks against the drag spring back; otherwise the shared momentum
 * projection (`pickSnapTarget`) picks the stop, moving at least one stop in
 * the drag direction. Down from the lowest stop dismisses.
 */
export function resolveSheetStop(
  startIndex: number,
  stopHeights: readonly number[],
  dy: number,
  velocityY: number,
  distanceThreshold = 44,
  flickVelocity = FLICK_VELOCITY
): SheetStopRelease {
  if (!exceedsTapSlop(0, dy)) return { kind: 'toggle' };
  const last = stopHeights.length - 1;
  const from = Math.max(0, Math.min(last, startIndex));
  const flickUp = velocityY < -flickVelocity && dy < 0;
  const flickDown = velocityY > flickVelocity && dy > 0;
  const moved = Math.abs(dy) > distanceThreshold || flickUp || flickDown;
  if (!moved || last < 0) return { kind: 'stop', index: from };
  const height = (stopHeights[from] ?? 0) - dy;
  const lowest = stopHeights[0] ?? 0;
  if (dy > 0 && (from === 0 || height < lowest - distanceThreshold)) return { kind: 'dismiss' };
  const target = pickSnapTarget(height, -velocityY, stopHeights, { min: lowest, max: stopHeights[last] });
  let index = target === null ? from : stopHeights.indexOf(target);
  if (dy < 0 && index <= from) index = Math.min(last, from + 1);
  if (dy > 0 && index >= from) index = Math.max(0, from - 1);
  return { kind: 'stop', index };
}

/** Detects two taps close in time and space. */
export class DoubleTapDetector {
  private last: PointSample | null = null;

  constructor(
    private readonly intervalMs = DOUBLE_TAP_MS,
    private readonly slopPx = DOUBLE_TAP_SLOP_PX
  ) {}

  /** Registers a completed tap; returns true when it completes a double tap. */
  tap(t: number, x: number, y: number): boolean {
    const previous = this.last;
    if (previous && t - previous.t <= this.intervalMs && Math.hypot(x - previous.x, y - previous.y) <= this.slopPx) {
      this.last = null;
      return true;
    }
    this.last = { t, x, y };
    return false;
  }

  reset(): void {
    this.last = null;
  }
}

/**
 * Screen-space anchored zoom for a `translate(offset) scale(scale)` camera:
 * returns the offset that keeps the content point under `anchor` fixed when
 * the scale changes from `scale` to `nextScale`.
 */
export function anchoredZoomOffset(
  scale: number,
  offset: Vector2,
  nextScale: number,
  anchor: Vector2
): Vector2 {
  const contentX = (anchor.x - offset.x) / scale;
  const contentY = (anchor.y - offset.y) / scale;
  return { x: anchor.x - contentX * nextScale, y: anchor.y - contentY * nextScale };
}

/** Pixels per wheel "line" (`deltaMode` 1, e.g. Firefox with line scrolling). */
export const WHEEL_LINE_PX = 16;

/**
 * v1.43 — wheel delta in pixels whatever the browser reports: line mode
 * (`deltaMode` 1) and page mode (`deltaMode` 2) otherwise make one notch
 * zoom 16–800× less than in pixel mode. Huge single events (page mode,
 * some mice) are capped so one notch never jumps the camera.
 */
export function normalizeWheelDelta(deltaY: number, deltaMode: number, pageHeight = 800): number {
  const pixels = deltaMode === 1 ? deltaY * WHEEL_LINE_PX : deltaMode === 2 ? deltaY * pageHeight : deltaY;
  return Math.max(-240, Math.min(240, pixels));
}

/**
 * v1.45 — one zoom curve for the gallery and the photo room. Every wheel
 * notch, button press and key multiplies the magnification by the same
 * factor, so both views zoom equally per step. (Before, the gallery added a
 * constant camera distance, which accelerated near the artwork, while the
 * room multiplied by ~10.5 % per notch.)
 */
export const WHEEL_ZOOM_PER_PX = 0.0012;
/** Trackpad pinch arrives as small ctrl+wheel deltas; amplify to feel direct. */
export const PINCH_WHEEL_GAIN = 2.5;
/** Magnification factor of one zoom button press or `+`/`-` key. */
export const ZOOM_STEP_FACTOR = 1.25;

/** Magnification factor (> 1 zooms in) for a normalised wheel delta in px. */
export function wheelZoomFactor(pixels: number, pinch = false): number {
  if (!Number.isFinite(pixels)) return 1;
  return Math.exp(-pixels * WHEEL_ZOOM_PER_PX * (pinch ? PINCH_WHEEL_GAIN : 1));
}

export function isMotionReduced(): boolean {
  if (typeof document === 'undefined') return false;
  const preference = document.documentElement.dataset['motion'];
  if (preference === 'reduced') return true;
  if (preference === 'full') return false;
  return typeof window !== 'undefined'
    && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
}

/** Light haptic tick on devices that support it (Android); silent elsewhere. */
export function hapticTick(durationMs = 8): void {
  if (isMotionReduced()) return;
  const vibrate = typeof navigator !== 'undefined'
    ? (navigator as Navigator & { vibrate?: (pattern: number) => boolean }).vibrate
    : undefined;
  if (typeof vibrate !== 'function') return;
  try {
    vibrate.call(navigator, durationMs);
  } catch {
    /* vibration is optional feedback */
  }
}
