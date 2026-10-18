# Regression Validation Tooling
> Latest markdown audit: 2026-10-18 (photograph-backed museum follow-up).

This document is the explicit **regression model → tooling** mapping for the
current rendering baseline and active recovery work in `plan.md`. It maps pixel
diffs, structural invariants, and GC metrics to concrete tools.

Every optimization carries a regression **type** (Phase 12.1). No optimization
is accepted unless the measurement hook for its type exists and passes.

## Photograph-backed museum acceptance (2026-10-18)

The current correction restores one visible authority: the room photograph plus
calibrated DOM artwork in both museum and editor. An opaque WebGL room or a test
that requires a room canvas as the visible owner contradicts that contract.
Retained WebGL infrastructure and inspection-gallery recovery still need their
existing coverage; DOM decode/display is not GPU visible-pixel proof.

Required evidence for the implementation pass:

- exact background filename survives import/sync/build (`Museum_ohne_Bilder.png`);
- museum/editor use matching projected quads and native artwork aspect without
  an opaque room occluding the photograph;
- editable wall outlines preserve artwork size, rooms/assignments round-trip,
  and warning-only layouts remain saveable;
- local generated `file://` preview and served gallery/editor agree, including
  room navigation, selection and hub→inspection→hub transitions;
- gallery renderer initialization/context-loss recovery remains intact.

This documentation pass did not run tests, lint, build or browser capture.
Source review verifies structural divergence only; the exact customer artifact
is unavailable. Record implementation results separately and keep customer
visual acceptance open in `plan.md`.

The implementation pass separately reproduced the current `file://` baseline
(screenshots/JSON reported at `/tmp/freyraum-before`): only `Akt 27.png` and
`Fraktal.png` import. `gartenszene` and `zdigital` are absent from both inventories,
produce `invalid-mapping`, and leave the side places empty. Preserve those IDs;
missing genuine content is an owner-supplied acceptance blocker, not a reason to
insert substitute images or assert four recovered paintings. Baseline renderer
initialization also throws an `onBeforeCompile` TypeError; verify the photograph
path avoids the opaque room renderer, without claiming its unused architecture
was repaired.

Implementation status: built-preview capture at `/tmp/freyraum-after` confirms
the exact photograph, decoded `Fraktal` / `Akt 27`, opacity 1 in both routes,
and no hub canvas. Lint, typecheck, build, frame-budget, docs-authority and all
editor-rooms browser cases pass. Real deploy validation, four save-service cases,
the local-project test and editor-publish remain content-blocked by the missing
side IDs/disabled empty place. Geometry now passes with updated closed-outline/
legacy-wall expectations and explicit production/fixture mappings. HTTP
photographic smoke passes exact-photo, artwork pixel-contribution and editor
homography-parity checks; Google Fonts DNS failures are warnings. Type A visual
capture remains blocked under software Chrome by the pre-existing invariant
`shadow-casting light count 1 != expected 2`; investigation is ongoing.
Subsequent `file://` smoke, WebGL resilience, 10 deploy-validator fixture cases
and syntax checks also pass. Ordinary primary/fallback, neutral, phone and
shape/doorway captures work after fixture repairs, but the transparent-primary
fixture originally failed (`fixture-blank-primary did not resolve through embedded
fallback`). A conservative DOM alpha gate is now implemented: a nonempty 4×4
sample succeeds; an empty sample checks native alpha in ≤128×128 tiles within
4,194,304 source pixels (4 MP). Only proven all-zero alpha triggers fallback; over-budget
or unavailable/tainted readback remains inconclusive, preserving sparse strokes.
Method checks (including a sparse final-native-pixel case), lint/typecheck/build
and front-wall-aspect pass; rebuilt browser recovery confirmation remains pending.
The final 4 MP rebuild passes 1200×1600 blank rejection, same-size sparse
final-pixel alpha-1 acceptance and over-budget inconclusive acceptance method
checks; lint/typecheck/build pass again. These are not browser fixture results.
Do not mark the full visual suite green. Shipping missing-content failures and
software-Chrome shadow/selection/restore investigations remain separate.

Final parallel validation was attempted after commit but hit its tool time limit
and was not retried. Earlier CodeQL reported zero findings; automated review was
unavailable. Focused review found the sparse-alpha issue addressed above.

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

For the shipped v0.93 artwork-recovery path, retain the existing
primary-failure / embedded-fallback fixture **and** the post-upload blank
fixture. The visual harness now needs to prove both:

- request/decode failure still recovers through `webglImage`;
- a decoded `file://` primary that reaches upload but produces blank pixels also
  recovers through `webglImage` before the runtime accepts success.

Keep the broader gates as well: the real current PNG bundle in `file://`, Vite,
and Pages-base delivery; preview/public/dist asset-contract checks; typed final
placeholder and delayed-decode diagnostics; source-to-pixel binding proof; and
capability-limited image handling.

Because the user-visible blank-plane bug was environment-specific, every future
artwork-visibility investigation must also replay the local
`file://` preview (`customer-preview/app.html?debug=verbose&hubDebug=1`) with
the generated `customer-artworks.js` and matching `images/` bundle preserved as
evidence. The scripted gates are necessary but not sufficient for this class of
incident.

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
  guards the OPT-2 / OPT-9 geometry-ownership coupling (`docs/archive/plan-history-2026-10-17.md` § Phase 13)
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
check: it loads the shipping TypeScript modules, verifies v1–v4 migration keeps
exact artwork targets, validates the checked-in v5 camera/room/wall/slot
contract, reconciles wall-local planes against the photographed reference
quads, and asserts deterministic doorway-edge placement, fallback wall buckets,
projected containment, hanging-band containment, perspective foreshortening,
world-space quad export, selected-state runtime hooks, grey-token reach, and
the bounded missing-background fallback. It also guards four-work 2+1+1 pages,
overflow pagination, contiguous migrated page indices, pairwise wall intervals,
and 0.35 m doorway / 4.00 m front-corner wall-space clearances. Primary-camera
projection additionally hard-fails if a side artwork comes within 12 px of the
visible doorway reveal or front-wall corner seam. Threshold breaches hard-fail
`npm run validate:museum-hub` and CI. See **Automated test commands** below for the editor, save and desktop tests.
`npm run validate:museum-hub:visual`
runs the optional Type A screenshot comparison with an existing local baseline,
and the harness must check the photograph-backed DOM artwork owner rather than
require the former `.museum-hub__canvas` room bridge. It also carries the lightweight shared regression
assertions for inspection safety in the interactive gallery: close-inspection
pan may use only the bounded reveal margin, close hover tilt must retain its
full requested range after the wall setback, and larger hover motion must still
stay within the available front-wall clearance. The same script now also checks
the fixed gallery wall-lighting contract stays neutral enough (ambient Kelvin,
balanced two-key setup, no return to the old dramatic far-left spotlight), and
it now additionally guards the visible wall-material contract (matte wall,
restrained wall normal scale, calmer ceiling) plus the low-sheen matte artwork
response that prevents close-view washout.

The v1.17 contract additionally requires explicit four-corner mounting zones,
immutable explicit wall ownership, complete-quad zone containment, and exact
v5 canonical placement preservation through sanitize/re-import. Invalid
canonical placements are flagged rather than relocated to another wall.

The current editor contract requires a discoverable file-safe entry, editable
wall quads with calibration-independent artwork size, native keyboard behavior
inside form controls, rejection of incompatible fixed 3D models on import,
preservation of rendered and bounds-only walls plus fixed settings on export,
and cache-busted customer artwork/audio scripts in both generated file entries.
Room counts and artwork assignments may change; warning-only layouts save.

The v1.15 orientation gate additionally proves that every artwork is a rigid
wall-parallel plane. It requires wall-normal alignment and zero relative corner
offset, then intersects the projected upper/lower U edges and compares that
vanishing point with the calibrated wall's U-edge vanishing point. Side-wall
residual must be no more than `0.01 px`; this prevents visual angle tuning,
billboarding, or a twisted quadrilateral from passing geometry validation.

### v1.12 artifact mismatch (resolved evidence, acceptance open)

The 2026-09-04 screenshot showed five works in `Raum 1 / 2`; a later customer
screenshot showed four, so the mismatch is no longer reproduced. Side-wall
visual acceptance stays open in `plan.md` until a screenshot of the current
deployed gallery is approved.

## Automated test commands

Browser tests need `npm run import:artworks && npm run build` and Playwright
(`npm i --no-save playwright`, or `FREYRAUM_CHROME_PATH` pointing at a local
Chrome). Desktop tests also need `cd desktop && npm ci && npm run build`; on
Linux run them under `xvfb-run -a`.

| Command | Browser | What it proves | CI |
|---|---|---|---|
| `npm run lint`, `npm run build:typecheck`, `npm run build` | – | lint (src, worker, desktop, local store), strict types, all bundles | quality (build also deploy) |
| `npm run docs:check-config-authority` | – | config tables only in `docs/QUERY_PARAMETERS.md` | quality |
| `npm run validate:museum-hub` | – | hub geometry, rooms, placement truth, calibration-scale, round trips | quality |
| `npm run validate:deploy` | – | generated content is complete before a Pages deploy | deploy |
| `npm run test:frame-budget`, `npm run test:webgl-resilience` | – | Type C frame budget; WebGL fallback | quality |
| `npm run test:local-project` | – | desktop project store: refusals, all-or-nothing writes, history/restore, rename retry, importer `--root` | quality, desktop |
| `npm run test:save-service` | – | Cloudflare save service against a fake GitHub | – |
| `npm run test:validate-deploy` | – | deploy content check | – |
| `npm run test:editor-drag` | yes | every artwork reaches all four green-zone edges and stops exactly there | – |
| `npm run test:editor-rooms` | yes | add/fill/switch/delete rooms, undo/redo, download + reload | – |
| `npm run test:editor-publish` | yes | login, uploads, placement, publish package, previews still load while waiting for approval | – |
| `npm run test:desktop-app` | Electron | `freyraum://app/` mapping (incl. Windows paths), lockdown, upload + "Im Projekt speichern" round trip | desktop (Linux + Windows) |
| `npm run smoke:desktop-package -- --exe <app>` | Electron | the **packaged** app: bundled importer, editor, save label, layout unchanged | desktop (Windows unpacked + installed) |
| `npm run test:deploy-smoke -- <url>` | yes | a deployed gallery: rooms, artworks, background, no 404s | deploy (`smoke` job) |
| `npm run validate:visual` / `validate:museum-hub:visual` | yes | Type A screenshots against a local baseline | – |

Workflows: `quality-and-doc-drift.yml` (every pull request and `main`),
`deploy-pages.yml` (`main` → GitHub Pages, then smoke), `desktop-release.yml`
(app changes: Linux + Windows tests, Windows installer build/smoke/artifact;
see `docs/DESKTOP_APP.md`).

## Acceptance thresholds (Phase 14)

| Tier | Key thresholds |
|---|---|
| Tier 0 (idle render) | idle FPS ≤ 3; GPU active < 5% of 16.7 ms |
| Tier 1 (CPU micro) | `FrameBudgetMonitor.sample()` < 0.01 ms; GC ≤ 4/min; GC pause P99 < 1 ms |
| Tier 2 (GPU) | GPU reduction ≥ estimate; Type A diff ≤ 2% |
| Tier 3 (architectural) | LOD ≤ 2,000 triangles; parallax reads ≤ 2/fragment |

Record before/after values in the Phase 10.2 measurement table for each tier.
