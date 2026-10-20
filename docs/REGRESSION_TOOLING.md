# Regression Validation Tooling
> Latest markdown audit: 2026-10-20 (museum spotlight follow-up).

This document is the explicit **regression model → tooling** mapping for the
current rendering baseline and active recovery work in `plan.md`. It maps pixel
diffs, structural invariants, and GC metrics to concrete tools.

Every optimization carries a regression **type** (Phase 12.1). No optimization
is accepted unless the measurement hook for its type exists and passes.

## Photographic inspection-room regression (updated 2026-10-20)

Run `npm run test:gallery-room-view` to verify all four configured room-photo
assets and importer staging, artwork-free target regions, cleanup-edge gradients,
safe config sanitization, source-aspect-preserving projection and wall-corner
registration across wide, tablet, phone, and short-landscape viewport sizes.
It checks portrait, 3:4, and square artwork bounds remain fully visible after
centered `cover` cropping, validates room-background saves and editor export, and
verifies Update Gallery stages all photos and reports missing sources.

After installing the optional Playwright browser tooling, `npm run test:editor-rooms`
also checks room selection, projected artwork preview, placement export, and undo
in the actual generated placement editor.

For browser coverage, run `npm run import:artworks && npm run build`, then run
`FREYRAUM_ROOM_VIEW_URL=file:///absolute/project/path/customer-preview/app.html FREYRAUM_CHROME_PATH=/path/to/chrome npm run test:gallery-room-view:browser`.
This opens the generated customer preview over `file://` and verifies all four
photos decode, projected artwork remains onscreen, the shared gallery timeline
moves into the room overlay and selection stays synchronized, and the return
action restores the timeline and focus. It checks room selection, gallery-style zoom/reset controls, help context,
shared utility reparenting, and header/timeline/zoom bounds at desktop, tablet,
portrait phone, and short-landscape sizes. Photo pan, zoom, pinch, reset,
keyboard zoom, camera limits, artwork-centered button and wheel zoom, expanded
mouse-proximity reach, eased return, and reduced-motion behavior remain covered.
Responsive fixtures include 320×568 and 390×844 portrait phones, 390×320
narrow short landscape, 768×1024 tablet portrait, 844×390 landscape, and desktop.
Coarse-pointer browser checks cover the optional motion toggle, permission grant
and denial, unavailable sensors, subtle clamped orientation response, reduced
motion, and page-hidden listener suspension/resume. The structural test also
checks secure-context gating, screen-angle normalization, and smoothing.
Button/wheel zoom follows the gallery's two-stage frame-independent camera
easing and can retarget while a previous zoom is still moving. The in-flight
artwork center is sampled during off-center zoom to ensure it follows a straight
path toward the reachable viewport center; each frame derives pan from the same
scene-space anchor, subject to the zoomed-photo bounds. Pinch and pan remain
direct, including during edge-limited zoom, and responsive resize and reduced
motion remain covered.
The browser matrix also includes Wohnbereich at 2000×1080. Screenshot capture
waits for two animation frames after a viewport or room-state change so the photo
and artwork have been painted before manual visual review.
At the initial museum hub, it checks that the non-interactive SVG shadow layer
follows the projected artwork without changing the clipped button hit area. The
front-right `room-01.wall-front.b` (Akt 27) is targeted explicitly: real mouse
movement must reach its projected quad, update only its paired shadow and light,
and preserve its clip and projective image transform. The front-left and both side
walls are checked for reachable, unchanged geometry and one-to-one feedback.
At tablet and phone sizes, the front-right quad center and complete projected
button bounds must remain in the viewport; narrow front-wall focus therefore uses
a modest view scale without modifying wall registration or the button clip path.
Fine-pointer hover follows the pointer within the artwork; keyboard focus centers
the light; selected feedback stays centered and overrides hover. Touch pointer
events do not activate hover, calibration/debug remains free of the visitor light,
and reduced motion removes light/shadow easing. Responsive captures cover museum
normal state and front-right hover at desktop/tablet/phone; desktop additionally
captures pointer-follow, focus, selection, and front/side-wall hover. Set
`FREYRAUM_ROOM_VIEW_CAPTURE_DIR`
to save hub and room-view browser captures for manual review at the responsive
breakpoints. The photo pixel test samples cleanup boundaries at full resolution against the
unchanged source gradients, checks old-artwork removal, and bounds repaired
bedroom-wall texture against an untouched wall sample. Treat passing fixtures as
geometry evidence, not visual acceptance: a 2026-10-20 user screenshot still shows
the artwork clipped in Wohnbereich. Reproduce with its exact generated
bundle/config/camera at 2000×1080 before calling that report resolved. The camera
operates on a still photo; it does not provide genuine 3D orbit or walking.

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
- artwork navigation remains between the inspection-gallery wall and camera near
  plane during close-up tilted entry; normal-distance entrance tilt and the
  mounted body's wall shadow remain unchanged.
- the full-width timeline distributes fitting thumbnails, caps its overall width,
  and keeps visible arrow scrolling for overflow; browser checks cover small and
  large counts, narrow viewports, selection, keyboard navigation, and reduced motion.

Current results and dated incident evidence are in `FINDINGS.md`; do not treat
the earlier two-image baseline as current shipping content. All four paintings
now import; geometry, save-service, local-project and deploy-content checks pass.
The customer confirms the local room after Update Gallery. Live acceptance
requires a new post-merge deploy and live smoke.

## Tilted artwork depth-buffer regression (2026-10-19)

The inspection-gallery image plane sits only 0.002 units ahead of its backing
body. Preserve the combined depth/shadow contract in
`scripts/test-webgl-resilience.mjs`:

- the image material keeps its negative polygon offset;
- the backing material does not write depth, so its nearly coplanar front face
  cannot compete with the moving image plane;
- the backing mesh continues casting the intended wall shadow.

Run `npm run test:webgl-resilience` after changes to `ArtworkMesh` or artwork
materials. For rendering changes, also rotate/hover the artwork at more than one
tilt and quality preset, verify the image pixels remain stable, and confirm the
WebGL context remains live. Do not treat polygon offset alone as proof that the
backing-body depth conflict is fixed.

For stale-index regressions, run the existing smoke command against root
`file:///absolute/project/path/index.html`, nested HTTP root `index.html`,
and production output under `/Freyraum/app.html` (the workflow copies that
production entry to `index.html`). Root smoke additionally checks redirect
query/fragment preservation and versioned data/runtime/style URLs.
`test:front-wall-aspect` also compares injected config with source JSON.
Build via `npm run build` to regenerate data before testing; a partial runtime
build alone does not refresh injected JSON.

Do not mark the full visual suite green: the pre-existing software-Chrome
`shadow-casting light count 1 != expected 2` and selection/restore investigations
remain open. Earlier bounded-alpha recovery assertions pass independently;
see `FINDINGS.md` for their limits. File-fetch probe warnings and optional
Google Fonts DNS failures are distinct from visible-pixel smoke failures.

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
| `npm run test:gallery-room-view` | – | room-photo import/staging, config, projection, and save/export invariants | – |
| `npm run test:gallery-room-view:browser` | yes | local `file://` room-photo decode, responsive controls, pan/zoom/pinch/reset, keyboard, close/focus | – |
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
