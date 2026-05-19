export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/**
 * v0.15 — frame-rate-independent exponential smoothing.
 *
 * Equivalent to the per-frame lerp `value += (target - value) * k`, but with
 * consistent wall-clock timing at any refresh rate. The standard per-frame
 * lerp settles twice as fast on a 120 Hz display as on a 60 Hz display
 * because `k` is applied per frame rather than per second.
 *
 * Derivation (Glenn Fiedler, "Fix Your Timestep"; Stack Overflow #57851938):
 *   value' = value + (target - value) * (1 - exp(-lambda * dt))
 * which is the analytic solution to the continuous decay equation
 *   dv/dt = lambda * (target - v)
 * sampled at `dt` seconds.
 *
 * Reference settle times (95% — i.e. when (target - value) has decayed to 5%):
 *   λ = 2.5  → ~1200 ms (witnessable artwork entrance)
 *   λ = 3.0  → ~1000 ms (smooth scale)
 *   λ = 4.0  →  ~750 ms (graceful camera zoom)
 *   λ = 5.0  →  ~600 ms (connected pan)
 *   λ = 12   →  ~250 ms (immediate hover response)
 *
 * @param current  Current animated value.
 * @param target   Target value to approach.
 * @param lambda   Damping factor per second. Higher = snappier.
 * @param dt       Delta time in SECONDS. Caller should clamp to ≤0.1 to
 *                 avoid huge jumps after a stalled/backgrounded tab.
 *                 If `dt <= 0` the current value is returned unchanged:
 *                 this handles both the first-frame case (caller has not
 *                 yet captured a previous timestamp) and pathological
 *                 negative deltas from a monotonic-clock glitch.
 */
export function smoothDamp(current: number, target: number, lambda: number, dt: number): number {
  if (dt <= 0) return current;
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
