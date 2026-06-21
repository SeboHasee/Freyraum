/**
 * v0.74 Phase 10 / Phase 12 — Type C (behavioral / GC-memory) regression
 * tooling.
 *
 * Provides the measurement hooks the v0.74 plan requires before any Tier 1+
 * optimization is accepted (`plan.md § Phase 10`, `§ Phase 12.3 Type C`,
 * `§ Phase 14`). It captures, on demand and at near-zero idle cost:
 *
 *  - frame delta samples → average, P99, and variance (σ) of frame time
 *  - frames-per-second average and σ (Phase 14.5 "FPS variance as a
 *    first-class metric")
 *  - JS heap size via `performance.memory` (Chromium only) and a GC-event
 *    estimate derived from used-heap drops between frames
 *  - long-task count via `PerformanceObserver('longtask')`
 *
 * This is a standalone, opt-in tool: it runs its own `requestAnimationFrame`
 * sampling loop only between `start()` and `stop()`, so it adds no per-frame
 * cost to the production render loop. It is exposed on `window` for console-
 * driven measurement sessions (see `installPerformanceTooling`).
 *
 * It deliberately performs no rendering and mutates no renderer/scene state —
 * it is a passive observer, consistent with {@link FrameBudgetMonitor}.
 */

export interface PerfMetricsReport {
  /** Number of frames sampled in the session. */
  frames: number;
  /** Wall-clock duration of the session in milliseconds. */
  durationMs: number;
  /** Average frame time in milliseconds. */
  avgFrameMs: number;
  /** 99th-percentile frame time in milliseconds. */
  p99FrameMs: number;
  /** Maximum frame time in milliseconds. */
  maxFrameMs: number;
  /** Standard deviation (σ) of frame time in milliseconds. */
  frameStdDevMs: number;
  /** Average frames per second. */
  avgFps: number;
  /** Standard deviation (σ) of instantaneous FPS. */
  fpsStdDev: number;
  /** Estimated minor GC events per minute (heap-drop heuristic). */
  gcEventsPerMinute: number;
  /** Estimated 99th-percentile pause associated with a heap-drop frame (ms). */
  gcPauseP99Ms: number;
  /** Number of `longtask` entries (> 50 ms) observed during the session. */
  longTasks: number;
  /** Peak used JS heap in MB, or null when `performance.memory` is unavailable. */
  peakHeapMb: number | null;
  /** Heap growth across the session in MB, or null when unavailable. */
  heapDeltaMb: number | null;
}

export interface PerfThresholdResult {
  checked: number;
  violations: string[];
}

export const TIER1_PERF_THRESHOLDS = {
  gcEventsPerMinute: 4,
  gcPauseP99Ms: 1,
} as const;

export function evaluateTier1PerfThresholds(report: PerfMetricsReport): PerfThresholdResult {
  const violations: string[] = [];
  if (report.gcEventsPerMinute > TIER1_PERF_THRESHOLDS.gcEventsPerMinute) {
    violations.push(
      `GC events/min ${report.gcEventsPerMinute} exceeds ${TIER1_PERF_THRESHOLDS.gcEventsPerMinute}`
    );
  }
  if (report.gcPauseP99Ms > TIER1_PERF_THRESHOLDS.gcPauseP99Ms) {
    violations.push(`GC pause P99 ${report.gcPauseP99Ms}ms exceeds ${TIER1_PERF_THRESHOLDS.gcPauseP99Ms}ms`);
  }
  return {
    checked: 2,
    violations,
  };
}

interface PerformanceMemoryLike {
  readonly usedJSHeapSize: number;
  readonly totalJSHeapSize: number;
  readonly jsHeapSizeLimit: number;
}

function readUsedHeapBytes(): number | null {
  const mem = (performance as Performance & { memory?: PerformanceMemoryLike }).memory;
  return mem ? mem.usedJSHeapSize : null;
}

function percentile(sortedAsc: number[], p: number): number {
  if (sortedAsc.length === 0) return 0;
  const idx = Math.min(sortedAsc.length - 1, Math.max(0, Math.ceil(p * sortedAsc.length) - 1));
  return sortedAsc[idx];
}

export class PerformanceMetrics {
  private running = false;
  private rafId: number | null = null;
  private startTime = 0;
  private lastNow = 0;
  private readonly frameMs: number[] = [];
  private lastHeapBytes: number | null = null;
  private peakHeapBytes = 0;
  private startHeapBytes: number | null = null;
  // Frames where used-heap dropped vs the previous frame ≈ a minor GC collection.
  private gcEventFrameMs: number[] = [];
  private longTasks = 0;
  private longTaskObserver: PerformanceObserver | null = null;

  /** Begin a measurement session. Safe to call when already running (no-op). */
  start(): void {
    if (this.running || typeof window === 'undefined') return;
    this.running = true;
    this.frameMs.length = 0;
    this.gcEventFrameMs = [];
    this.longTasks = 0;
    this.startTime = performance.now();
    this.lastNow = this.startTime;
    this.lastHeapBytes = readUsedHeapBytes();
    this.startHeapBytes = this.lastHeapBytes;
    this.peakHeapBytes = this.lastHeapBytes ?? 0;
    this.installLongTaskObserver();
    const tick = (now: number): void => {
      if (!this.running) return;
      this.recordFrame(now);
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  /** Stop the session and return the collected report. */
  stop(): PerfMetricsReport {
    this.running = false;
    if (this.rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.rafId);
    }
    this.rafId = null;
    this.longTaskObserver?.disconnect();
    this.longTaskObserver = null;
    return this.report();
  }

  private installLongTaskObserver(): void {
    if (typeof PerformanceObserver === 'undefined') return;
    try {
      this.longTaskObserver = new PerformanceObserver((list) => {
        this.longTasks += list.getEntries().length;
      });
      this.longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch {
      // `longtask` not supported in this browser; degrade gracefully.
      this.longTaskObserver = null;
    }
  }

  private recordFrame(now: number): void {
    const dt = now - this.lastNow;
    this.lastNow = now;
    if (dt <= 0) return;
    this.frameMs.push(dt);

    const heap = readUsedHeapBytes();
    if (heap !== null) {
      if (heap > this.peakHeapBytes) this.peakHeapBytes = heap;
      // A drop in used heap between consecutive frames indicates a collection.
      if (this.lastHeapBytes !== null && heap < this.lastHeapBytes) {
        this.gcEventFrameMs.push(dt);
      }
      this.lastHeapBytes = heap;
    }
  }

  /** Compute the report from collected samples without stopping the session. */
  report(): PerfMetricsReport {
    const frames = this.frameMs.length;
    const durationMs = frames > 0 ? this.lastNow - this.startTime : 0;
    const sum = this.frameMs.reduce((a, b) => a + b, 0);
    const avg = frames > 0 ? sum / frames : 0;
    const variance =
      frames > 0 ? this.frameMs.reduce((a, b) => a + (b - avg) * (b - avg), 0) / frames : 0;
    const sorted = [...this.frameMs].sort((a, b) => a - b);

    const fpsValues = this.frameMs.map((ms) => 1000 / ms);
    const fpsAvg = fpsValues.length > 0 ? fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length : 0;
    const fpsVar =
      fpsValues.length > 0
        ? fpsValues.reduce((a, b) => a + (b - fpsAvg) * (b - fpsAvg), 0) / fpsValues.length
        : 0;

    const gcSorted = [...this.gcEventFrameMs].sort((a, b) => a - b);
    const gcPerMinute = durationMs > 0 ? (this.gcEventFrameMs.length / durationMs) * 60_000 : 0;

    const peakHeapMb = this.peakHeapBytes > 0 ? this.peakHeapBytes / (1024 * 1024) : null;
    const heapDeltaMb =
      this.startHeapBytes !== null && this.lastHeapBytes !== null
        ? (this.lastHeapBytes - this.startHeapBytes) / (1024 * 1024)
        : null;

    return {
      frames,
      durationMs: Math.round(durationMs),
      avgFrameMs: round2(avg),
      p99FrameMs: round2(percentile(sorted, 0.99)),
      maxFrameMs: round2(sorted[sorted.length - 1] ?? 0),
      frameStdDevMs: round2(Math.sqrt(variance)),
      avgFps: round2(fpsAvg),
      fpsStdDev: round2(Math.sqrt(fpsVar)),
      gcEventsPerMinute: round2(gcPerMinute),
      gcPauseP99Ms: round2(percentile(gcSorted, 0.99)),
      longTasks: this.longTasks,
      peakHeapMb: peakHeapMb !== null ? round2(peakHeapMb) : null,
      heapDeltaMb: heapDeltaMb !== null ? round2(heapDeltaMb) : null,
    };
  }

  get isRunning(): boolean {
    return this.running;
  }
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
