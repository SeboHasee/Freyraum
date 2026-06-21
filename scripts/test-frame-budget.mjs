/**
 * v0.74 OPT-3 / T1-B — Type C behavioral regression gate.
 *
 * Proves the incremental O(1) `FrameBudgetMonitor` produces numerically
 * identical output to the original O(N) linear-scan reference for the same
 * input sequence (Phase 12.3 "Type C — Behavioral regression gate").
 *
 * Run: `node scripts/test-frame-budget.mjs`
 *
 * The real (refactored) class is loaded directly from the TypeScript source via
 * esbuild so the test exercises the shipping implementation, not a copy. A
 * self-contained O(N) reference re-implements the pre-optimization algorithm to
 * compare against.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import { transformSync } from 'esbuild';

const here = dirname(fileURLToPath(import.meta.url));
const tsPath = resolve(here, '../src/utils/FrameBudgetMonitor.ts');

// Load the actual shipping class.
const source = readFileSync(tsPath, 'utf8');
const { code } = transformSync(source, { loader: 'ts', format: 'esm' });
const moduleUrl =
  'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
const { FrameBudgetMonitor } = await import(moduleUrl);

/**
 * Reference O(N) implementation — a faithful copy of the pre-v0.74 algorithm.
 * `now` for cooldown is injected so the comparison is deterministic.
 */
class ReferenceMonitor {
  constructor(opts) {
    this.budgetMs = opts.budgetMs;
    this.windowSize = Math.max(8, opts.windowSize ?? 60);
    this.emaAlpha = opts.emaAlpha ?? 0.1;
    this.severeFrameMs = opts.severeFrameMs ?? 33;
    this.severeFrameLimit = opts.severeFrameLimit ?? 5;
    this.samples = new Array(this.windowSize).fill(this.budgetMs);
    this.writeIndex = 0;
    this.filled = false;
    this.ema = 16.7;
    this.rolling = 16.7;
    this.lastNow = 0;
  }
  sample(now) {
    if (this.lastNow === 0) {
      this.lastNow = now;
      return this.snapshot(0, 0, 0);
    }
    const dt = now - this.lastNow;
    this.lastNow = now;
    const clamped = Math.min(dt, 250);
    this.samples[this.writeIndex] = clamped;
    this.writeIndex = (this.writeIndex + 1) % this.windowSize;
    if (this.writeIndex === 0) this.filled = true;
    const usable = this.filled ? this.windowSize : this.writeIndex;
    let sum = 0;
    for (let i = 0; i < usable; i += 1) sum += this.samples[i];
    this.rolling = sum / Math.max(1, usable);
    this.ema = this.ema + this.emaAlpha * (clamped - this.ema);
    return this.snapshot(clamped, this.countAbove(), this.countSevere());
  }
  countAbove() {
    const usable = this.filled ? this.windowSize : this.writeIndex;
    let c = 0;
    for (let i = 0; i < usable; i += 1) if (this.samples[i] > this.budgetMs) c += 1;
    return c;
  }
  countSevere() {
    const usable = this.filled ? this.windowSize : this.writeIndex;
    let c = 0;
    for (let i = 0; i < usable; i += 1) if (this.samples[i] >= this.severeFrameMs) c += 1;
    return c;
  }
  snapshot(dtMs, aboveCount, severeFrameCount) {
    return {
      dtMs,
      emaMs: this.ema,
      rollingMs: this.rolling,
      rollingFps: 1000 / Math.max(0.1, this.rolling),
      belowBudget:
        aboveCount > this.windowSize * 0.7 || severeFrameCount >= this.severeFrameLimit,
      severeFrameCount,
    };
  }
}

function buildSequence() {
  // Deterministic PRNG (mulberry32) for reproducibility.
  let s = 0x9e3779b9;
  const rand = () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const deltas = [];
  // Edge cases first: a perfectly-budget run, then severe spikes, then a mix
  // that wraps the window many times, then pathological > 250 ms frames.
  for (let i = 0; i < 5; i += 1) deltas.push(16.7);
  for (let i = 0; i < 6; i += 1) deltas.push(40); // severe (>=33)
  for (let i = 0; i < 300; i += 1) deltas.push(8 + rand() * 60);
  for (let i = 0; i < 4; i += 1) deltas.push(400); // clamps to 250
  for (let i = 0; i < 120; i += 1) deltas.push(14 + rand() * 4);
  return deltas;
}

const opts = { budgetMs: 16.7, windowSize: 60, severeFrameMs: 33, severeFrameLimit: 5 };
const real = new FrameBudgetMonitor(opts);
const ref = new ReferenceMonitor(opts);

const deltas = buildSequence();
let now = 1000;
let failures = 0;
const FIELDS = ['dtMs', 'emaMs', 'rollingMs', 'rollingFps', 'belowBudget', 'severeFrameCount'];

for (let i = 0; i < deltas.length; i += 1) {
  now += deltas[i];
  const a = real.sample(now);
  const b = ref.sample(now);
  for (const f of FIELDS) {
    const av = a[f];
    const bv = b[f];
    const equal =
      typeof av === 'number' ? Math.abs(av - bv) < 1e-9 : av === bv;
    if (!equal) {
      failures += 1;
      if (failures <= 10) {
        console.error(`Mismatch at step ${i} field "${f}": real=${av} ref=${bv}`);
      }
    }
  }
}

if (failures > 0) {
  console.error(`\nFAIL: ${failures} field mismatch(es) across ${deltas.length} frames.`);
  process.exit(1);
}

console.log(
  `PASS: O(1) FrameBudgetMonitor matches O(N) reference across ${deltas.length} frames ` +
    `(fields: ${FIELDS.join(', ')}).`
);
