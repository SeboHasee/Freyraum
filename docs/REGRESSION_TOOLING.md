# Regression Validation Tooling (v0.91)

This document is the explicit **regression model → tooling** mapping for the
current rendering baseline and active recovery work in `plan.md`. It maps pixel
diffs, structural invariants, and GC metrics to concrete tools.

Every optimization carries a regression **type** (Phase 12.1). No optimization
is accepted unless the measurement hook for its type exists and passes.

| Type | Risk | Tool in this repo | How to run |
|---|---|---|---|
| **A — Visual** | A rendered pixel differs perceptibly from baseline | `scripts/visual-regression.mjs` (Playwright screenshot + pixelmatch) | `npm run validate:visual baseline` / `... compare` |
| **B — Structural** | Scene graph / geometry / material / shadow state diverges | `src/utils/RuntimeInvariants.ts` via `window.__FREYRAUM_PERF_TOOLS__.checkInvariants()`; also run by the Type A script before every screenshot | browser console / Type A gate |
| **C — Behavioral / GC** | Internal state machine logic or allocation behavior changes | `src/utils/PerformanceMetrics.ts` via `window.__FREYRAUM_PERF_TOOLS__`; `scripts/test-frame-budget.mjs` | console session / `npm run test:frame-budget` |

## Type A — Pixel diff (Playwright / WebGL snapshot)

`scripts/visual-regression.mjs` drives Chromium through Playwright, captures the
Phase 10.3 state matrix plus expanded museum-hub states (desktop, wide desktop,
narrow portrait wall-focus, doorway-edge fixtures, extreme-aspect fixture sets,
hub→gallery→hub selection round trips, and WebGL context-restore token checks),
checks Type B invariants for every state, and compares against a stored baseline.
Before each screenshot, the harness now runs a hub-background fail-safe pass:
required `/backgrounds/...` URLs that returned 404 are logged with URL + status,
downgraded to the shipped `backgrounds/museum-empty.png` fallback when
available, otherwise forced to the neutral museum-grey token, and still
captured. Each run writes a per-state JSON summary to
`.visual-regression/*/capture-report.json`.
Fixture hub states also break one declared image path on purpose and assert that
the embedded fallback recovers it without exposing placeholder mode, so
hub/gallery artwork-source regressions fail even when the final pixels still
match the baseline.

For the persistent-grey-artwork recovery, retain that existing primary-failure /
embedded-fallback fixture and add the v0.91 gates before declaring a repair
complete: script-relative customer-bundle URL resolution in `file://`, Vite,
and Pages-base environments; an expected generated-image existence check in
preview/public/dist; final-placeholder diagnostics; delayed decode; and
capability-limited image handling. These are planned gates, not claims about
the current implementation.

- **Pass criterion (Phase 10.3 / 14.3):** fewer than **2%** of pixels differ by
  more than **10/255** on any comparison.
- **Matrix:** museum-hub desktop/wide/portrait wall-focus states, synthetic
  tall/square/wide hub fixture sets, and fixed dramatic lighting × artwork
  steps 0/1/2 × overview/reset/inspection zoom states.
- Optional diagnostic capture: `FREYRAUM_VISUAL_INCLUDE_HUB_DEBUG=1` adds a
  `?hubDebug=1` overlay screenshot without making it part of the mandatory gate.
- Round-trip states also assert hub selected-state persistence (`.is-selected` +
  `aria-current`) and transition-surface diagnostics before the screenshot is
  accepted.
- **Workflow:** capture a baseline *before* the change, apply the optimization,
  then compare. Diffs are written to `.visual-regression/diff/` (git-ignored).
- `node scripts/visual-regression.mjs capture` writes screenshots without
  requiring an existing baseline. `FREYRAUM_VISUAL_STATE_FILTER=foo,bar`
  restricts baseline/capture/compare runs to matching state-name substrings.
- **Required for:** OPT-4 (bloom), OPT-5 (shadow), OPT-6 (panel opacity),
  OPT-9 (LOD). These must additionally pass manual sign-off at close inspection
  zoom for shadow/bloom changes.
- Dependencies (`playwright`, `pixelmatch`, `pngjs`) are loaded lazily and
  installed on demand so the core toolchain never ships a browser engine.

## Type B — Runtime invariants (structural assertions)

`runInvariants()` evaluates structural invariants against live scene handles and
returns a non-throwing list of violations plus measured values:

- artwork geometry ownership (single valid buffer with a `position` attribute) —
  guards the OPT-2 / OPT-9 geometry-ownership coupling (`plan.md § Phase 13`)
- artwork triangle-count ceiling (LOD gate, Phase 14.4)
- material binding (live, non-empty material)
- shadow-casting light count matches the active preset (guards OPT-5)
- scene-graph consistency and finite artwork transform

Run from the browser console after an optimization:
`window.__FREYRAUM_PERF_TOOLS__.checkInvariants()`. Violations are also surfaced
through the diagnostics pipeline. The Type A visual regression script calls this
same gate before every screenshot and fails immediately on violations.

## Type C — GC / memory / frame-variance metrics

`PerformanceMetrics` runs an opt-in sampling session (its own rAF loop, zero
cost when idle) and reports the Phase 14 acceptance metrics:

- average / P99 / max frame time and frame-time σ
- average FPS and FPS σ (Phase 14.5 first-class variance metric)
- estimated minor-GC events per minute and GC-pause P99 (used-heap-drop
  heuristic via the Chrome Performance API `performance.memory`)
- long-task count (`PerformanceObserver('longtask')`)
- peak heap and heap delta (MB)

Run from the console: `__FREYRAUM_PERF_TOOLS__.startPerf()`, exercise the
gallery, then `__FREYRAUM_PERF_TOOLS__.stopPerf()`.

After a Type C session, run
`__FREYRAUM_PERF_TOOLS__.checkTier1Thresholds(report)` (or omit `report` to use
the current report). This actively checks the Tier 1 GC thresholds below.

`scripts/test-frame-budget.mjs` is the automated Type C gate for the
`FrameBudgetMonitor` O(1) refactor: it proves the optimized accumulator path is
numerically identical to the original O(N) reference across a 435-frame
sequence including edge cases.

`scripts/test-museum-hub-geometry.mjs` is a focused hub geometry regression
check: it loads the shipping TypeScript modules, verifies v1/v2 migration keeps
exact artwork targets, validates the checked-in v4 camera/room/wall/slot
contract, reconciles wall-local planes against the photographed reference
quads, and asserts deterministic doorway-edge placement, fallback wall buckets,
projected containment, hanging-band containment, perspective foreshortening,
world-space quad export, selected-state runtime hooks, grey-token reach, and
the bounded missing-background fallback. Threshold breaches hard-fail
`npm run validate:museum-hub` and CI. `npm run validate:museum-hub:visual`
runs the optional Type A screenshot comparison with an existing local baseline,
and the harness additionally checks that the hub still renders through the
dedicated `.museum-hub__canvas` scene bridge rather than per-slot DOM
projection transforms.

## Acceptance thresholds (Phase 14)

| Tier | Key thresholds |
|---|---|
| Tier 0 (idle render) | idle FPS ≤ 3; GPU active < 5% of 16.7 ms |
| Tier 1 (CPU micro) | `FrameBudgetMonitor.sample()` < 0.01 ms; GC ≤ 4/min; GC pause P99 < 1 ms |
| Tier 2 (GPU) | GPU reduction ≥ estimate; Type A diff ≤ 2% |
| Tier 3 (architectural) | LOD ≤ 2,000 triangles; parallax reads ≤ 2/fragment |

Record before/after values in the Phase 10.2 measurement table for each tier.
