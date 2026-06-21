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
  // v0.74 OPT-3/T1-B — incremental O(1) accumulators. These mirror the rolling
  // window so `sample()` no longer rescans all `windowSize` slots three times
  // per frame. `_sum`, `_aboveCount`, and `_severeCount` are kept in lock-step
  // with the ring buffer: the slot being overwritten is subtracted before the
  // new sample is added. The result is numerically identical to the previous
  // O(N) linear-scan implementation (verified by scripts/test-frame-budget.mjs).
  private _sum = 0;
  private _aboveCount = 0;
  private _severeCount = 0;
  // v0.74 OPT-3/T1-B — reused output objects eliminate the per-call
  // `FrameBudgetSample` allocation (≈60 objects/second at 60 fps). The returned
  // reference is owned by the monitor and is overwritten on the next call;
  // callers must read fields immediately and must not retain it across ticks.
  // `sample()` and `readSnapshot()` use separate buffers so a dev-overlay read
  // never aliases the hot render-loop sample.
  private readonly _sampleOut: FrameBudgetSample = {
    dtMs: 0,
    emaMs: 16.7,
    rollingMs: 16.7,
    rollingFps: 0,
    belowBudget: false,
    severeFrameCount: 0,
    inCooldown: false,
  };
  private readonly _readOut: FrameBudgetSample = {
    dtMs: 0,
    emaMs: 16.7,
    rollingMs: 16.7,
    rollingFps: 0,
    belowBudget: false,
    severeFrameCount: 0,
    inCooldown: false,
  };
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
      return this.writeSnapshot(this._sampleOut, 0, this._aboveCount, this._severeCount);
    }
    const dt = now - this.lastNow;
    this.lastNow = now;

    // Drop pathological frames (tab switch, long task) so they don't poison
    // the rolling average.
    const clamped = Math.min(dt, 250);

    // Remove the slot we are about to overwrite from the accumulators. Before
    // the ring has wrapped once (`filled === false`) the target slot still
    // holds the constructor pre-fill value and was never counted, so it must
    // not be subtracted — matching the old code that summed only `usable`
    // slots.
    if (this.filled) {
      const old = this.samples[this.writeIndex];
      this._sum -= old;
      if (old > this.budgetMs) this._aboveCount -= 1;
      if (old >= this.severeFrameMs) this._severeCount -= 1;
    }

    this.samples[this.writeIndex] = clamped;
    this._sum += clamped;
    if (clamped > this.budgetMs) this._aboveCount += 1;
    if (clamped >= this.severeFrameMs) this._severeCount += 1;

    this.writeIndex = (this.writeIndex + 1) % this.windowSize;
    if (this.writeIndex === 0) this.filled = true;

    const usable = this.filled ? this.windowSize : this.writeIndex;
    this.rolling = this._sum / Math.max(1, usable);
    this.ema = this.ema + this.emaAlpha * (clamped - this.ema);

    return this.writeSnapshot(this._sampleOut, clamped, this._aboveCount, this._severeCount);
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

  /**
   * Populate a reused {@link FrameBudgetSample} in place. The decision logic is
   * identical to the original `snapshot()` — only the allocation is removed.
   */
  private writeSnapshot(
    out: FrameBudgetSample,
    dtMs: number,
    aboveCount: number,
    severeFrameCount: number
  ): FrameBudgetSample {
    const now = typeof performance !== 'undefined' ? performance.now() : 0;
    const sustainedOverBudget = aboveCount > this.windowSize * 0.7;
    const repeatedSevereHitches = severeFrameCount >= this.severeFrameLimit;
    out.dtMs = dtMs;
    out.emaMs = this.ema;
    out.rollingMs = this.rolling;
    out.rollingFps = 1000 / Math.max(0.1, this.rolling);
    // > 70 % of the rolling window over budget triggers the warning.
    out.belowBudget = sustainedOverBudget || repeatedSevereHitches;
    out.severeFrameCount = severeFrameCount;
    out.inCooldown = now < this.cooldownUntil;
    return out;
  }

  /** Convenience for the dev overlay. */
  readSnapshot(): FrameBudgetSample {
    return this.writeSnapshot(this._readOut, 0, this._aboveCount, this._severeCount);
  }
}
