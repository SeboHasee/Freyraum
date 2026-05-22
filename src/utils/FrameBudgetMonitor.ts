/**
 * Rolling frame-budget monitor for v0.02.
 *
 * Records frame durations sampled from `requestAnimationFrame` and reports
 * both an instantaneous EMA and a rolling 60-frame average. Marker hooks let
 * navigation and preset changes be ignored for a short cooldown so we never
 * downgrade quality based on the spike caused by texture upload itself.
 *
 * The monitor is purely passive — it never mutates renderer or material
 * state. {@link AdaptiveQualityController} consumes its output and decides
 * whether to switch presets.
 */

export interface FrameBudgetSample {
  /** Instantaneous frame duration in ms. */
  dtMs: number;
  /** Exponential moving average of `dtMs`. */
  emaMs: number;
  /** Rolling average over the last `windowSize` samples. */
  rollingMs: number;
  /** Frames per second derived from `rollingMs`. */
  rollingFps: number;
  /** True when the most recent N samples are above the budget. */
  belowBudget: boolean;
  /** Number of severe hitch frames in the rolling window. */
  severeFrameCount: number;
  /** True when recently marked by a navigation/preset change. */
  inCooldown: boolean;
}

export interface FrameBudgetMonitorOptions {
  /** Budget in milliseconds. 16.7 ≈ 60 fps. */
  budgetMs: number;
  /** Rolling window size. Larger smooths more but reacts slower. */
  windowSize?: number;
  /** EMA smoothing factor [0..1]; higher = more reactive. */
  emaAlpha?: number;
  /** Cooldown after a marker (ms). Default 600. */
  cooldownMs?: number;
  /** Frame duration that counts as a visible hitch. Default 33ms. */
  severeFrameMs?: number;
  /** Severe hitches in the rolling window that should trigger mitigation. */
  severeFrameLimit?: number;
}

export class FrameBudgetMonitor {
  private readonly samples: number[] = [];
  private writeIndex = 0;
  private filled = false;
  private ema = 16.7;
  private rolling = 16.7;
  private lastNow = 0;
  private cooldownUntil = 0;
  readonly budgetMs: number;
  readonly windowSize: number;
  readonly emaAlpha: number;
  readonly cooldownMs: number;
  readonly severeFrameMs: number;
  readonly severeFrameLimit: number;

  constructor(opts: FrameBudgetMonitorOptions) {
    this.budgetMs = opts.budgetMs;
    this.windowSize = Math.max(8, opts.windowSize ?? 60);
    this.emaAlpha = opts.emaAlpha ?? 0.1;
    this.cooldownMs = opts.cooldownMs ?? 600;
    this.severeFrameMs = opts.severeFrameMs ?? 33;
    this.severeFrameLimit = opts.severeFrameLimit ?? 5;
    this.samples.length = this.windowSize;
    this.samples.fill(this.budgetMs);
  }

  /** Call inside the rAF loop. `now` is the rAF `DOMHighResTimeStamp`. */
  sample(now: number): FrameBudgetSample {
    if (this.lastNow === 0) {
      this.lastNow = now;
      return this.snapshot(0, 0);
    }
    const dt = now - this.lastNow;
    this.lastNow = now;

    // Drop pathological frames (tab switch, long task) so they don't poison
    // the rolling average.
    const clamped = Math.min(dt, 250);

    this.samples[this.writeIndex] = clamped;
    this.writeIndex = (this.writeIndex + 1) % this.windowSize;
    if (this.writeIndex === 0) this.filled = true;

    const usable = this.filled ? this.windowSize : this.writeIndex;
    let sum = 0;
    for (let i = 0; i < usable; i += 1) sum += this.samples[i];
    this.rolling = sum / Math.max(1, usable);
    this.ema = this.ema + this.emaAlpha * (clamped - this.ema);

    return this.snapshot(clamped, this.countAboveBudget(), this.countSevereFrames());
  }

  /** Reset cooldown for an upcoming spike. */
  markNavigation(): void {
    this.cooldownUntil = (typeof performance !== 'undefined' ? performance.now() : 0) + this.cooldownMs;
  }
  markReadinessWork(): void {
    this.markNavigation();
  }
  markPresetChange(): void {
    this.markNavigation();
  }

  private countAboveBudget(): number {
    const usable = this.filled ? this.windowSize : this.writeIndex;
    let count = 0;
    for (let i = 0; i < usable; i += 1) {
      if (this.samples[i] > this.budgetMs) count += 1;
    }
    return count;
  }

  private countSevereFrames(): number {
    const usable = this.filled ? this.windowSize : this.writeIndex;
    let count = 0;
    for (let i = 0; i < usable; i += 1) {
      if (this.samples[i] >= this.severeFrameMs) count += 1;
    }
    return count;
  }

  private snapshot(dtMs: number, aboveCount: number, severeFrameCount = 0): FrameBudgetSample {
    const now = typeof performance !== 'undefined' ? performance.now() : 0;
    const inCooldown = now < this.cooldownUntil;
    const sustainedOverBudget = aboveCount > this.windowSize * 0.7;
    const repeatedSevereHitches = severeFrameCount >= this.severeFrameLimit;
    return {
      dtMs,
      emaMs: this.ema,
      rollingMs: this.rolling,
      rollingFps: 1000 / Math.max(0.1, this.rolling),
      // > 70 % of the rolling window over budget triggers the warning.
      belowBudget: sustainedOverBudget || repeatedSevereHitches,
      severeFrameCount,
      inCooldown,
    };
  }

  /** Convenience for the dev overlay. */
  readSnapshot(): FrameBudgetSample {
    const now = typeof performance !== 'undefined' ? performance.now() : 0;
    const inCooldown = now < this.cooldownUntil;
    return {
      dtMs: 0,
      emaMs: this.ema,
      rollingMs: this.rolling,
      rollingFps: 1000 / Math.max(0.1, this.rolling),
      belowBudget: this.countAboveBudget() > this.windowSize * 0.7 || this.countSevereFrames() >= this.severeFrameLimit,
      severeFrameCount: this.countSevereFrames(),
      inCooldown,
    };
  }
}
