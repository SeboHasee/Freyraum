# CHANGELOG

## v0.20 — Audio playback fix + main-page controls + sidecar cache-bust (2026-05-20)

### Fixed

- **Audio not playing on file:// origin:** Removed `crossOrigin = 'anonymous'` from `BackgroundAudioManager`. Chromium-family browsers treat `file://` pages as `null` origin; the CORS attribute triggered a rejected cross-origin request that silently blocked all audio loading. Audio now loads and plays correctly when the gallery is opened locally.
- **Sidecar text stale after re-import:** `import-artworks.mjs` now updates `customer-preview/app.html` on every import run, stamping `?t=<timestamp>` on the `customer-artworks.js` and `customer-audio.js` script src attributes. This forces Chromium's `file://` cache to treat each run as a new resource URL, ensuring updated sidecar text is always applied.

### Added

- **Main-page audio controls** (`src/ui/AudioControls.ts`): subtle glass-pill widget fixed to bottom-left, symmetric to ZoomControls. Shows mute/unmute button and compact volume slider. Hidden when no audio source is imported. Pulsing indicator appears when autoplay is blocked — clicking activates playback within the user gesture. Full accessibility labels (aria-label, aria-pressed, title) and reduced-motion / high-contrast adaptations.
- Improved `BackgroundAudioManager` error event handler to log `MediaError.code` and `MediaError.message` for easier future diagnosis.

## v0.19 — Background audio workflow (2026-05-20, implemented)

### Added / Changed

- `scripts/import-artworks.mjs` now imports customer audio from `customer-audio/inbox`, copies supported files to `customer-preview/audio`, emits `customer-preview/customer-audio.js`, and writes report sections for selected/ignored/unsupported/no-audio outcomes.
- `scripts/write-local-preview.mjs` now injects `customer-audio.js` into preview HTML and writes a fallback audio stub when no generated file exists yet.
- Added `src/audio/BackgroundAudioManager.ts` for runtime audio ownership (source selection, autoplay handling, loop fallback, diagnostics, lifecycle suspend/resume, disposal).
- `src/main.ts` now sanitizes injected audio payloads, wires manager lifecycle into existing runtime lifecycle hooks, and syncs UI status messaging.
- `src/utils/preferences.ts` now persists `audioMuted` + `audioVolume` in `freyraum.preferences.v1`.
- `src/ui/PreferencesPanel.ts` and `src/styles/main.scss` now include mute + volume controls and autoplay status note rendering.

### Documentation

- Updated v0.19 status across repository markdown files from planned to implemented and added shipped workflow details to customer/developer docs.

### Validation

- `npm run lint` ✅
- `npm run build` ✅

## v0.18 — Customer painting text sidecars (2026-05-20, implemented)

Implementation pass. The importer (`scripts/import-artworks.mjs`) now
reads same-basename `.txt` sidecar files (with `.md` as a secondary
alias) and merges customer-edited metadata into the generated manifest.
Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain
importer-owned. No new dependencies; no `src/` runtime changes.

### Added

- `scripts/import-artworks.mjs`:
  - Sidecar constants `SIDECAR_EXTENSIONS`, `PRIMARY_SIDECAR_EXT`,
    `ALLOWED_SURFACE_PROFILES`, `SIDECAR_FIELD_KEYS` lifted to the
    format-policy block.
  - Inbox scan separated into `imageEntries` and a deterministic
    `sidecarMap` (`.txt` preferred over `.md`); duplicates collected
    into `duplicateSidecarWarnings`.
  - Pure `parseSidecar(filePath)` helper: BOM-safe UTF-8 read,
    `CRLF`/`CR` normalization, case-insensitive `Label: value` parsing,
    multi-line `Description:` body with preserved internal blank lines,
    validated `Year` (four digits) and `Surface` (allow-listed),
    tags split on `,`/`;`, and field-level warnings (unknown keys,
    blank `Title`/`Alt`/`Description`).
  - Sidecar fields merged into the artwork object using `??` semantics
    so omitted falls back cleanly while blank still warns.
  - Orphaned sidecars (text without matching picture) computed from
    `imageStems` after the image loop.
- `customer-artworks/last-import-report.txt` gains plain-language
  sections: `Text applied`, `Pictures missing text`,
  `Text files without matching pictures`, `Text fields needing attention`,
  `Duplicate text files`. Missing/invalid text never fails the run.

### Documentation

- `docs/CUSTOMER_TEXT_GUIDE.md` rewritten as the shipped step-by-step
  "how to import text" walkthrough (template copy → rename → fill →
  save → run Update Gallery → read report).
- `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt` updated to reflect
  shipped behaviour and softer "recommended" wording (vs. "required",
  since missing text is non-fatal).
- All v0.18-referenced Markdown updated from "planned/not yet shipped"
  to "implemented" (`README.md`, `docs/HANDOFF.md`,
  `docs/IMAGE_MAINTENANCE_GUIDE.md`,
  `docs/CUSTOMER_PICTURE_GUIDE.md`, `DOCUMENTATION_RULES.md`,
  `ARCHITECTURE_MAP.md`, `AI_RULES.md`, `LESSONS_LEARNED.md`,
  `FINDINGS.md`, `plan.md`).

### Validation

- `npm install`, `npm run lint`, `npm run build` ✅
- `node -c scripts/import-artworks.mjs` ✅
- Manual importer pass over a fixture inbox (matched, missing, orphan,
  duplicate `.txt`/`.md`, invalid `Year`, invalid `Surface`, blank `Alt`,
  multi-line description) verified the expected report sections.

## v0.18 — Final audited sidecar-text plan (2026-05-20)

Planning/docs only. The sidecar-text workflow was fully audited in
`plan.md § v0.18` and `FINDINGS.md § 2026-05-20` ahead of the
implementation pass above.

## Unreleased

### Historical note (v0.19 planning audit — 2026-05-20)

- The pre-implementation v0.19 planning audit has been superseded by the shipped implementation entry above.

### Documentation (v0.18 final audited plan — 2026-05-20)

- Completed a full codebase audit focused on the planned sidecar-text importer change.
- Revalidated the coding guidance against `scripts/import-artworks.mjs`, `src/main.ts`, `src/config/artworks.ts`, and `src/ui/InfoPanel.ts`, plus current Node/accessibility/metadata sources.
- Finalized the v0.18 plan with explicit implementation slices, cleanup, and check-up steps.
- Updated repository markdown to mark the sidecar workflow as planned/not-yet-shipped and to point every v0.18 reference at the final audit sources.
- Current runtime behavior is unchanged: the importer still generates fallback text until the dedicated implementation pass lands.

### Changed / Fixed (v0.17 easy wins — 2026-05-20)

**PreferencesPanel ARIA accessibility:**

- Added `aria-modal="true"` to the preferences panel element (WCAG 4.1.2, ARIA APG dialog pattern).
- Replaced `aria-label` with `aria-labelledby` pointing to the panel's first heading (more robust per ARIA spec).
- Added static `id="freyraum-prefs-heading"` to the heading generated inside `renderPanel()` so the `aria-labelledby` reference is stable across re-renders.
- `handleOutsideClick` now returns focus to the trigger after dismissing the panel, matching the existing Escape-key path (WCAG SC 2.4.3 Focus Order).

**Dead-code removal:**

- Deleted `src/interaction/MouseInteraction.ts`, `TouchInteraction.ts`, and `ZoomPan.ts`. These three files were superseded by `CanvasInteraction.ts` in v0.11 and confirmed to have no remaining production imports.
- Removed deprecated `isMobileDevice()` from `src/utils/performance.ts`. No callers remained; `detectDeviceCapabilities()` in `device.ts` is the correct replacement.
- Updated comments in `CanvasInteraction.ts`, `main.ts`, and `device.ts` from present to past tense to match the removal.

Validation: `npm run lint` ✅, `npm run build` ✅, `customer-preview/` rebuilt.



- Completed a documentation-only deep audit across runtime architecture, scripts, dependency health, diagnostics, accessibility, customer docs, and AI guidance.
- Revalidated current platform/tooling assumptions online: `requestIdleCallback`, Long Tasks API, Page Lifecycle `freeze`/`resume`, three.js `WebGLRenderer.compileAsync`, typescript-eslint support, and ESLint v8 support status.
- Documented validation output: `npm install`, `npm run lint`, `npm run build`, and focused script syntax checks pass; `npm audit` reports two moderate Vite/esbuild dev-server advisories requiring a semver-major Vite upgrade to auto-fix.
- Recorded the lint-time TypeScript 5.9.x / `@typescript-eslint` v7 supported-version warning caused by floating dependency ranges.
- Refreshed every Markdown file with cross-links, stale wording fixes, audit notes, or workflow guidance.

### Documentation (AI context engineering workflow — 2026-05-19)

- Added repository-level AI guidance: `.github/copilot-instructions.md`, `.github/prompts/architecture.prompt.md`, `.github/prompts/refactor.prompt.md`, `.github/prompts/review.prompt.md`, `.github/prompts/autonomous-agent.prompt.md`, `AI_RULES.md`, `ARCHITECTURE_MAP.md`, and `LESSONS_LEARNED.md`.
- Added docs folders for architecture, standards, lessons learned, and AI feedback so future agent work starts from repository structure and previous regressions.
- Documented hard constraints around diagnostics, reduced motion, CSS containment, customer-preview rebuilds, injected artwork validation, and validation workflow.

### Fixed (v0.16.2 control-shell follow-up — 2026-05-19)

- Completed the settings/nav regression fix with a stronger CSS control-shell approach after the earlier containment-only fix proved incomplete in customer testing.
- `.nav-btn` now uses a larger 72×72 transparent shell with the visible 64px glass circle rendered on `::before`; hover scale now has spare pixels and is no longer lightly clipped at the edge.
- `.prefs__trigger` now uses a larger 52×52 transparent shell with the visible 44px glass circle rendered on `::before`; the gear control has a slightly larger hit area and no longer feels clipped.
- `.prefs` and `.nav-controls` remain excluded from the containment block from v0.16.1.
- Rebuilt `customer-preview/style.css` so the shipped preview matches the source fix.
- Validation: `npm run lint` ✅, `npm run build` ✅, and headless Chromium + SwiftShader confirmed the real built preview opens the settings panel (`aria-expanded false→true`, `panel.hidden true→false`).

### Fixed (v0.16.1 UI containment regression hotfix — 2026-05-19)

- Fixed a settings-popover regression where the gear/settings control appeared broken because the popover anchor (`.prefs`) was paint-contained; the absolute panel was clipped to the trigger box boundary.
- Fixed center left/right navigation button hover clipping where scaled hover states were cut off because `.nav-controls` was paint-contained.
- Updated `src/styles/main.scss` containment block to exclude `.prefs` and `.nav-controls`, while keeping containment on the other fixed chrome surfaces.
- Updated all repository markdown files to document this regression and the follow-up v0.16.2 control-shell hardening.
- Validation status: initial fresh-clone checks failed before dependency install (environment setup), then full checks passed after install (`npm run lint`, `npm run build`).


### Implemented (v0.16 deep performance and compatibility optimization — 2026-05-19)

This release implements every actionable finding from the v0.16 audit while preserving 100% of FREYRAUM's museum-grade fidelity. There are no changes to material shading, painting relief, raking-light inspection, or motion behaviour; all changes are restricted to scheduling, GPU resource lifetime, runtime measurement, capability progressive enhancement, and CSS paint-cost reduction on the existing battery preset.

Runtime changes:

- **Single resize coordinator.** Removed `window.resize` listeners from `SceneManager` and `PostProcessing`. New public methods `SceneManager.updateAspect(w, h)` and `PostProcessing.resize(w, h)` are driven exclusively from `main.ts`. The coordinator debounces all resize sources for 120 ms, then runs all DOM reads and GPU writes inside a single `requestAnimationFrame`, eliminating forced-layout thrash on mobile orientation changes.
- **Cached chrome refs.** `main.ts` populates `chromeRefs` (topbar, timeline, nav controls, info panel) once after UI construction. `measureArtworkViewport` no longer calls `app.querySelector` per resize.
- **Page Visibility + Page Lifecycle.** New `pageInactive` flag suspends `postProcessing.render()`, the per-frame light/material updates, and adaptive-quality sampling when the tab is hidden or frozen. `visibilitychange`, `freeze`, and `resume` events all route through `suspendRuntime` / `resumeRuntime`. On resume, `frameBudget.markNavigation()` guards against an adaptive downgrade caused by the catch-up spike.
- **Deferred preference application.** Repeated preference changes coalesce via `requestIdleCallback` (with `setTimeout(0)` fallback). The first apply remains synchronous because the scene is not yet shown. Adaptive downgrades route through the same path so they never land mid-frame.
- **Shader pre-warm.** New `RendererManager.prewarm(scene, camera)` calls three.js's `compileAsync()` (or falls back to `compile()`) after boot and after every deferred preset apply. Failures are logged but never block startup.
- **Anisotropy no-op guard.** `TextureManager.setAnisotropyDivisor()` short-circuits when the divisor is unchanged, preventing a GPU texture re-upload on every preference re-apply.
- **Renderer-info snapshot.** New `RendererManager.getRendererSnapshot()` exposes a read-only view of `renderer.info`. `main.ts` logs one `[renderer] snapshot` entry every 5 s in info/verbose diagnostics mode, providing a running GPU resource history in customer bug reports.
- **Progressive startup hints.** `suggestStartupQuality()` now consults `navigator.deviceMemory` (≤ 0.5 GB → battery) and `navigator.hardwareConcurrency` (≤ 2 cores → battery). Missing values pass through to the prior viewport-area heuristic.
- **Long Tasks observer.** Debug-only `PerformanceObserver({ type: 'longtask', buffered: true })` logs any task ≥ 50 ms as `[perf][warn] long-task`. Detached on `beforeunload`.
- **Dispose idempotency.** `RendererManager.dispose()` and `CanvasInteraction.dispose()` guard against double-invocation that previously could race a context-loss shutdown with `beforeunload`.

CSS changes (battery preset paint cost + compatibility fallback):

- **Quality data attribute.** `RendererManager.applyPreset()` writes `:root[data-quality='high'|'balanced'|'battery']` so SCSS can react without a JS round-trip.
- **Battery glass blur halved.** `:root[data-quality='battery']` sets `--glass-blur: 12px` (was 26px). Blur cost is O(r²); the visual style survives, the pixel cost drops by ~75%.
- **`backdrop-filter` fallback.** `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` replaces the glass surfaces with a solid `--glass-bg-strong` so older Firefox / embedded WebViews remain legible.
- **CSS containment on fixed chrome.** `contain: layout paint` was added across fixed-position chrome in v0.16 and later refined in v0.16.1 by excluding `.prefs` and `.nav-controls` to avoid popover/hover clipping regressions. The spinner adds `contain: strict`.

Importer changes (`scripts/import-artworks.mjs`):

- **GPU texture-memory warnings.** New warnings on import: (a) any side larger than 4096 px ("many phones cap textures at 4096"); (b) GPU footprint ≥ 128 MB ("phones may run out of memory and skip the texture"); (c) ≥ 64 MB ("performance may be reduced on low-end phones"). Footprint computed as `width × height × 4 × 4/3` to account for the RGBA8 mip pyramid.

Diagnostic surface (new info-mode entries):

- `[lifecycle] suspend` / `resume`
- `[renderer] snapshot` (5 s while active)
- `[renderer] prewarm-async` / `prewarm-sync` / `prewarm-failed`
- `[texture] anisotropy-noop` / `anisotropy-applied` (debug level)
- `[perf] longtask-observer-active` / `long-task` / `longtask-unsupported`

Acceptance gates:

- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `node -c scripts/import-artworks.mjs` ✅

Explicitly deferred (documented rationale in `plan.md § v0.16 implementation summary`):

- Pinch-zoom log-space squared-distance refactor (negligible measurable benefit).
- `ImageBitmapLoader` raster path (no Safari benefit against data URLs).
- `FrameBudgetMonitor` running-sum optimization (< 0.05 ms/frame benefit, +1 risk).
- Deletion of dead-code `MouseInteraction.ts` / `TouchInteraction.ts` / `ZoomPan.ts` (left for a dedicated cleanup PR).
- `content-visibility` on the glass overlay root (cannot be applied without breaking the blur layer behind it).

### Documentation (v0.16 final audited brainstorm — 2026-05-19)

- Re-audited the full source tree against the already-upgraded v0.16 plan and confirmed the original 12 findings still stand.
- Added 6 missed enhancements to the plan and findings: Page Lifecycle `freeze` / `resume`, `renderer.compileAsync()` shader pre-warm, optional `ImageBitmapLoader` raster path, `deviceMemory` / `hardwareConcurrency` first-run hints, debug-only Long Tasks API instrumentation, and CSS `contain` / internal `content-visibility`.
- Expanded the online validation section and implementation-order tables to include the new enhancements and their boundaries.
- Updated validation notes to record the fresh-clone baseline failure before dependency install (`eslint: not found`, `three` / related packages unavailable during `tsc`) so future implementers do not confuse environment setup issues with repo regressions.
- Updated `FINDINGS.md`, `README.md`, `DOCUMENTATION_RULES.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, and `docs/IMAGE_MAINTENANCE_GUIDE.md` to reflect the final v0.16 plan state.
- No runtime code, generated preview bundle, dependencies, or quality preset behavior changed in this pass.

### Fixed (v0.15.1 reduced-motion fidelity hotfix — 2026-05-19)

- Fixed an unintended coupling where `Reduzierte Bewegung` also reduced
  painting texture/shader fidelity.
- `PaintingMaterial` no longer scales detail-normal blending or grazing/specular
  response with reduced-motion state.
- `detailNormalActive()` no longer depends on reduced-motion scalar, avoiding
  reduced-motion-triggered shader-path degradation.
- `GalleryManager.setReducedMotion()` now only controls motion behavior and no
  longer forwards reduced-motion state into `PaintingMaterial`.
- Result: reduced motion now changes motion only; visual fidelity remains tied
  exclusively to the selected quality preset.
- Validation: `npm run lint` ✅, `npm run build` ✅.

### Implemented (v0.15 elegant animation system — 2026-05-19)

- **Frame-rate-independent motion.** Added `smoothDamp(current, target, lambda, dt)` to `src/utils/math.ts`. Converted all 13 frame-rate-dependent per-frame lerps in `GalleryManager.update()` to lambda-driven smoothing (`α = 1 − exp(−λ·dt)`), plus a 14th line for the new `position.z` depth recession. Motion now settles in the same wall-clock time on 30/60/90/120 Hz displays.
- **`GalleryManager.update(now: number)`.** Receives `DOMHighResTimeStamp` from the animate loop; clamps `dt` to ≤ 0.1 s to survive backgrounded tabs.
- **Navigation entrance seeds retuned.** `NAV_SEED_POSITION_X = 4.5` (was 3.2), `NAV_SEED_POSITION_Z = -0.6` (new depth recession), `NAV_SEED_ROTATION_Y = 0.15` rad / ~9° (was 0.32 rad / ~18°), `NAV_SEED_SCALE = 0.88` (was 0.84). Applied in `navigate()` and `goTo()`.
- **Lambda constants documented.** `LAMBDA_HOVER_ROTATION = 12`, `LAMBDA_NAV_POSITION = 2.5`, `LAMBDA_NAV_SCALE = 3.0`, `LAMBDA_CAMERA_ZOOM = 4.0`, `LAMBDA_CAMERA_PAN = 5.0`. Settle-time table: hover ≈ 250 ms, position ≈ 1200 ms, scale ≈ 1000 ms, zoom ≈ 750 ms, pan ≈ 600 ms.
- **New diagnostics on `navigate` / `goTo`.** `motionMode` (`'full'` | `'reduced'`), `seedPositionX`, `seedPositionZ`, `settleTargetMs`.
- **Fixed `InfoPanel.ts` content-swap timing bug.** `CONTENT_SWAP_DELAY_MS = 520` (was hardcoded 200 ms, shorter than the previous 320 ms CSS transition). Added `requestAnimationFrame` between `setContent()` and removing `is-transitioning` so layout is applied before fade-in.
- **Semantic SCSS motion tokens.** New: `--ease-gallery-out` (easeOutExpo `cubic-bezier(0.16, 1, 0.3, 1)`), `--ease-gallery-in-out` (easeInOutQuart), `--dur-control` (0.18 s), `--dur-content` (0.5 s), `--dur-panel` (0.55 s), `--dur-timeline` (0.42 s), `--dur-reveal` (0.9 s). Backward-compat aliases preserved: `--dur-fast → --dur-control`, `--dur-base → --dur-content`, `--dur-slow → --dur-reveal`. `--ease-spring` preserved but no longer used on gallery surfaces.
- **Retuned animated surfaces.** `.info-panel` transition → `--dur-content` + `--ease-gallery-out`; `.info-panel.is-transitioning` translateY 8 px → 16 px; `.timeline__thumb` transition → `--dur-timeline` + `--ease-gallery-out` (no more spring overshoot); `.prefs__panel` animation → `--dur-panel` + `--ease-gallery-out`; `@keyframes prefs-in` softened from `scale(0.94) translateY(-6px)` to `scale(0.96) translateY(-10px)`; `.loading-overlay` → `--dur-reveal` + `--ease-gallery-out`; `.loading-spinner` slowed from 0.8 s to 1.4 s.
- **`main.ts` adjustments.** `loadingOverlay.remove()` timeout raised from 700 ms to 950 ms (matches `--dur-reveal: 0.9s` + 50 ms buffer). Animate loop calls `galleryManager.update(now)`.
- **No new dependencies.** No reduced-motion regressions. v0.14.2 zoom/pan constants untouched.
- **Validation:** `npm run lint` ✅, `npm run build` ✅, preview bundles rebuilt.

### Documentation (v0.15 final documentation audit cleanup — 2026-05-19)

- Final-cleaned the v0.15 documentation set so the plan, findings, README, handoff, and image/customer guides all point to the same final technical audit wording.
- Added explicit repository-verification coverage to `plan.md` and `FINDINGS.md` so the v0.15 plan now states which code areas and markdown surfaces were re-checked.
- Fixed remaining documentation inaccuracies, including stale README/HANDOFF references and the “9 hard-coded lerp lines” wording in `plan.md`.
- Kept the v0.15 pass documentation-only; no runtime code changed.

### Documentation (v0.15 animation technical brainstorm — 2026-05-19)

- Completely replaced the initial animation planning section in `plan.md` with a full technical brainstorm.
- Identified and documented a root bug: all 13 WebGL motion paths in `GalleryManager.update()` use frame-rate-dependent per-frame lerp (`value += (target - value) × k`), causing artwork navigation to take ~408ms on 120 Hz screens vs ~817ms on 60 Hz.
- Specified the fix: add `smoothDamp(current, target, lambda, dt)` to `src/utils/math.ts` using the frame-rate-independent formula `1 − Math.exp(−lambda × dt)`.
- Provided exact lambda values for each property (hover=12, nav position=2.5, nav scale=3.0, camera zoom=4.0, camera pan=5.0) with 95% settle times.
- Identified and documented a timing bug in `InfoPanel.ts`: `setTimeout` delay of 200ms fires before the 320ms CSS transition completes, causing text to change while still partially visible.
- Specified the SCSS redesign: new semantic tokens (`--dur-control`, `--dur-content`, `--dur-panel`, `--dur-timeline`, `--dur-reveal`), new easing curves (`--ease-gallery-out: cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-gallery-in-out`), removal of overshoot `--ease-spring` from timeline/panel uses.
- Documented all `var(--dur-base)` and `var(--dur-slow)` consumers to avoid silent regressions when aliases change.
- Documented the loading overlay removal timeout in `main.ts` that must be raised from 700ms to 950ms after the `--dur-reveal` change.
- Added specific navigation entrance seed values: `position.x ±4.5`, `rotation.y ±0.15`, scale `0.88`, new `position.z −0.6` depth recession.
- Validated all findings against published sources: Stack Overflow #57851938, MDN, WCAG 2.2, web.dev, cubic-bezier.com.
- No runtime code was changed in this documentation pass.

### Documentation (v0.15 animation enhancement initial plan — 2026-05-19)

- Added a detailed research-backed plan for smoother, longer, more elegant animations that fit the modern art-gallery style.
- Documented 2026 guidance for accessible motion, `prefers-reduced-motion`, compositor-friendly animation, `requestAnimationFrame`, and duration ranges.
- Audited current motion surfaces in `src/styles/main.scss`, `src/gallery/GalleryManager.ts`, `src/main.ts`, `src/lighting/LightingSetup.ts`, and `src/utils/preferences.ts`.
- Planned a future implementation path for semantic motion tokens, frame-rate-independent WebGL smoothing, refined artwork navigation, smoother reset/zoom/pan, UI transition retuning, diagnostics, and reduced-motion safeguards.
- No runtime code was changed in this documentation pass.

### Implemented (v0.14.2 vertical pan tightening — 2026-05-19)

- Kept horizontal close-pan behavior unchanged (`INSPECTION_OVERSCROLL_X = 1.2`) because left/right edge reach was already approved.
- Tightened vertical close-pan behavior (`INSPECTION_OVERSCROLL_Y = 0.6`) so top/bottom movement is more restrictive when zoomed in.
- `getPanLimits()` now uses axis-specific overscroll constants (`X` and `Y`) instead of one shared value.
- `show-artwork-complete` diagnostics now logs `panOverscrollX` and `panOverscrollY`.
- Updated all markdown files for this follow-up and rebuilt validation artifacts via normal build flow.

### Fixed (importer launcher compatibility / Node version guard — 2026-05-19)

- Added `scripts/run-import-artworks.cjs` as a CommonJS launcher for the customer importer flow.
- `Update Gallery.command` and `Update Gallery.bat` now call the launcher instead of invoking `import-artworks.mjs` directly.
- The launcher checks Node.js major version before loading ESM importer code and requires Node.js 18+.
- Follow-up hardening: the launcher now uses legacy built-in module names (`child_process`, `fs`, `path`) instead of `node:` specifiers, so very old Node versions can reach the friendly version check/report instead of failing with `Cannot find module 'node:child_process'`.
- On unsupported Node versions, it writes a plain-language compatibility error to `customer-artworks/last-import-report.txt` and exits with a clear message instead of showing a raw `Unexpected token {` stack trace.
- Updated customer and maintainer documentation (`README.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/IMAGE_MAINTENANCE_GUIDE.md`) with Node 18+ requirement and troubleshooting.

### Implemented (v0.14 zoom/pan/reset-fit follow-up — 2026-05-19)

- **Deeper close zoom on medium/large artworks.** `MIN_CAMERA_Z` changed from `0.5` to `0.2` and `MIN_VISIBLE_ARTWORK_FRACTION` from `0.28` to `0.12`, lowering the practical close-inspection floor where fraction-driven limits previously dominated.
- **Tighter edge pan behavior.** `INSPECTION_OVERSCROLL` reduced from `3.0` to `1.2`, reducing reset-proximate drift while preserving close-inspection edge reach.
- **Portrait-aware reset-fit distance.** Added `PORTRAIT_ASPECT_THRESHOLD = 0.65` and `PORTRAIT_RESET_EXTRA_Z = 1.5`; `getResetFitZoom()` now adds portrait-only headroom after base fit computation.
- **Expanded runtime diagnostics for v0.14 tuning.** `show-artwork-complete` now logs `closeZoomMinVisibleFraction`, `panOverscroll`, `panLimitAtReset`, `portraitResetApplied`, and `portraitResetExtra`.
- Rebuilt `customer-preview/freyraum-gallery.js`.
- Updated `plan.md`, `FINDINGS.md`, `README.md`, `DOCUMENTATION_RULES.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, and `docs/IMAGE_MAINTENANCE_GUIDE.md` with implemented v0.14 details.

### Implemented (v0.13 nav/zoom/pan/icon fixes — 2026-05-18)

- **Nav controls no longer cut off by timeline.** `.nav-controls` bottom position changed from `bottom: var(--chrome-bottom)` (168px) to `bottom: calc(192px + var(--safe-bottom))`, placing the buttons 15px above the timeline's top edge. `--chrome-bottom` was updated from `max(168px, 148px+safe)` to `max(200px, 180px+safe)` to keep zoom controls and artwork fit measurements in sync.
- **Wider zoom range both directions.** `MIN_CAMERA_Z` lowered from `1.2` to `0.5` (closer inspection); `MIN_OVERVIEW_CAMERA_Z` raised from `10.75` to `18.0` and `OVERVIEW_HEADROOM_Z` raised from `1.6` to `3.5` (farther overview).
- **More horizontal pan room when zoomed in.** `INSPECTION_OVERSCROLL` raised from `0.5` to `3.0` world units, so narrow or elongated artworks can be panned well past the edge when close.
- **Gear and fullscreen icons now optically centred.** Added `.prefs__trigger-icon` and `.fullscreen-btn__icon` CSS rules (`display: flex; align-items: center; justify-content: center; line-height: 0; svg { display: block }`) to eliminate the fractional inline descender gap that offset the icons downward inside their circular buttons.
- Rebuilt `customer-preview/freyraum-gallery.js` and `customer-preview/style.css`.
- Updated `plan.md`, `FINDINGS.md`, `README.md`, `DOCUMENTATION_RULES.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, and `docs/IMAGE_MAINTENANCE_GUIDE.md` with v0.13 details.

### Implemented (v0.12 zoom/framing/timeline — 2026-05-18)

- Added `ArtworkViewportMetrics` / `ViewportMetricsProvider` to `GalleryManager` so reset, min, pan, hover, and diagnostics math can use the measured art-safe viewport instead of only raw camera aspect.
- Split the old far zoom ceiling into explicit `ZoomBounds`: `minInspectionZoom`, `resetFitZoom`, and `maxOverviewZoom`. Reset now uses the fitted distance while zoom-out controls can continue to a farther overview distance.
- Extended `main.ts` with `measureArtworkViewport()`, `visualViewport` listeners, and `ResizeObserver` coverage for fixed chrome. Viewport/chrome changes now call `galleryManager.handleViewportMetricsChanged()` and emit `layout/art-viewport` diagnostics.
- Updated timeline selection so the active thumbnail keeps its lifted visual state without clipping: CSS headroom + scroll gutters in `main.scss`, transform-aware manual centering in `Timeline.ts`, `aria-current`, reduced-motion-aware scroll behavior, and non-default `timeline/center-active` diagnostics.
- Extended `show-artwork-complete` diagnostics with reset/min/max zoom, overview headroom, usable viewport size/fractions, and viewport occlusion.
- Rebuilt `customer-preview/freyraum-gallery.js` and `customer-preview/style.css`.
- Updated `plan.md`, `FINDINGS.md`, `README.md`, `DOCUMENTATION_RULES.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, and `docs/IMAGE_MAINTENANCE_GUIDE.md` with deep v0.12 implementation notes and validation status.

### Documentation (v0.12 final research-backed technical coding plan — 2026-05-18)

- Rewrote the v0.12 section in `plan.md` from a short planning note into a full technical coding plan with exact files, code-level bugs, brainstormed solution options, recommended architecture, TypeScript interface suggestions, scroll/viewport formulas, diagnostics additions, and an implementation slice order.
- Added the 2026 online validation result and official source list for `VisualViewport`, `ResizeObserver`, `scrollIntoView`, `scroll-padding`, `scroll-margin`, dynamic viewport units, WCAG Reflow, and WCAG Target Size.

### Added (v0.11 implementation — 2026-05-18)

- New `src/utils/device.ts` module exporting `DeviceCapabilities`, `LayoutTier`, `PointerPrimary`, `Orientation`, `detectDeviceCapabilities()`, and `applyDeviceCaps()`. Capabilities are mirrored to `<html>` data attributes (`data-layout-tier`, `data-pointer-primary`, `data-hover`, `data-orientation`, `data-short-height`) so SCSS can react without re-running JS.
- New `src/interaction/CanvasInteraction.ts` consolidates mouse/touch/wheel input. Pointer Events Level 3 is the primary path with `setPointerCapture` and `lostpointercapture` cleanup; non-passive Touch Events serve as a fallback for older Safari. The gesture state machine has explicit `idle`, `panning`, `pinching`, `swipe-candidate`, and `cancelled` states. Hover rotation is suppressed on coarse pointers.
- New `suggestStartupQuality()` in `src/utils/performance.ts` returns `battery` for high-DPR small phones and `balanced` otherwise. `main.ts` only applies it on first run (when no quality is stored yet), so user choices are respected on every subsequent session.
- New `PreferencesStore.hasStoredQuality()` static helper for the startup heuristic.
- New `RendererManager.isRenderPaused()`; `RendererManager` now registers `webglcontextlost` (with `preventDefault()`) and `webglcontextrestored` listeners, emits diagnostics, and the render loop in `main.ts` short-circuits while the context is lost.
- New `InfoPanel.setCompact(boolean)` method + `.info-panel--compact` SCSS rule for phone-portrait/phone-small layout tiers.
- New `HintText.updateHint()` reads `<html data-pointer-primary>` and renders coarse-pointer-appropriate German copy (`"Wischen zum Navigieren · Zwei Finger zum Zoomen."`).
- New diagnostics scopes/events: `layout/capabilities`, `layout/resize`, `interaction/init`, `interaction/gesture-start`, `interaction/gesture-cancel`, `interaction/swipe`, `quality/startup-suggestion`, `renderer/context-lost`, `renderer/context-restored`.
- Safe-area CSS variables (`--safe-top/right/bottom/left`) and chrome-spacing tokens (`--chrome-top`, `--chrome-bottom`) added to `:root`, with `100dvh` body height and `touch-action: none` scoped to the canvas.
- Four-phase responsive breakpoint set in `main.scss`: phone-portrait (<600), short-height landscape (<500h), tablet-portrait (600–899), tablet-landscape (900–1179), plus device-capability mirror selectors.

### Changed (v0.11 — 2026-05-18)

- `getOptimalPixelRatio()` now clamps to `1.5` on `(pointer: coarse)` devices irrespective of the requested cap, to avoid thermal throttling on mobile while keeping perceived quality similar.
- `app.html`, `index.html`, `customer-preview/app.html`, and `scripts/write-local-preview.mjs` all use `viewport-fit=cover` so notch/safe-area insets are populated.
- All fixed-position chrome (topbar, info-panel, nav, zoom controls, fullscreen button, prefs trigger, prefs panel, timeline, hint, fallback card) offset against the new safe-area variables.
- `.prefs__panel` width is now `min(320px, 100vw - safe-area - 24px)` with `max-height: calc(100dvh - safe-area - 120px)` and `overflow-y: auto`, fixing the panel-overflow issue on narrow phones and short landscape viewports.
- `.zoom-controls__btn`, `.fullscreen-btn`, and `.prefs__trigger` get `min-width: 44px; min-height: 44px;` to keep the WCAG comfort target.
- `main.ts` introduces a single debounced (120 ms) `resize`+`orientationchange` listener that calls `rendererManager.resize()`, re-detects capabilities, re-applies them, toggles compact info-panel, and refreshes the hint copy. `SceneManager`'s existing camera-aspect listener is intentionally retained.
- `FallbackScreen` shows a coarse-pointer-only tip about private browsing/hardware acceleration. The technical reason is now HTML-escaped and only rendered when diagnostics mode is not `default`.

### Fixed (v0.11 — 2026-05-18)

- **Bug 1 — `RendererManager.resize()` never called on window resize.** The renderer drawing-buffer is now resized through the new debounced coordinator in `main.ts`.
- **Bug 2 — All touch listeners passive; iOS Safari native pinch always fired.** `CanvasInteraction` uses `touch-action: none` on the canvas, and the Touch Events fallback path is non-passive so `preventDefault()` can own pinch and pan gestures.
- **Bug 3 — Synthetic mouse events duplicated tap actions.** Pointer Events do not emit a synthetic stream; the Touch Events fallback calls `preventDefault()` on `touchstart` and the shared `click` handler short-circuits when the most recent input was touch.
- **Bug 4 — `isMobileDevice()` width-only heuristic was misleading.** Replaced by `detectDeviceCapabilities()`. The old function is retained but marked `@deprecated`.
- **Bug 5 — HintText showed desktop-only copy on touch devices.** Now reads the data attribute and shows coarse-pointer copy or hides on small phones.
- **Bug 6 — Preferences panel overflowed narrow phones / short landscape.** Fluid width with `min(...)` and bounded `max-height` with internal scrolling.
- **Bug 7 — No `viewport-fit=cover` / safe-area / `dvh`.** Added across HTML, the preview generator, and SCSS.

### Validation (v0.11)

- `npm install`, `npm run lint`, `npm run build` all pass with only the pre-existing Sass legacy-API deprecation notice and the TypeScript parser version warning.
- Vite now transforms 46 modules (down from 47) because the three superseded interaction files are no longer imported.
- `customer-preview/` was regenerated and committed.
- Post-implementation audit: cleaned two redundant `calc(var(--chrome-bottom) + 0px)` expressions in `main.scss` → simplified to `var(--chrome-bottom)` (no visual change; `.nav-controls` and `.zoom-controls`). Updated `docs/HANDOFF.md` priority headline from "v0.10 validation" to "v0.11 responsive/touch".

### Known follow-ups (v0.11)

- Delete the now-unused `src/interaction/{MouseInteraction,ZoomPan,TouchInteraction}.ts` files in a subsequent cleanup PR.
- Add an explicit user-visible WebGL context-loss recovery hint (currently only logged + render paused).
- Optional `ResizeObserver` integration in `RendererManager` for embedded/split-view scenarios.
- Physical-device QA against iPhone, iPad, and Android per the QA matrix in `plan.md`.

### Documentation (v0.11 final research-backed technical coding plan — 2026-05-18)

- Upgraded the v0.11 plan from a high-level goal document to a full technical coding plan with concrete TypeScript interfaces, code patterns, CSS snippets, and file-level action items.
- Identified and documented **7 code-level bugs** found during deep source audit: `RendererManager.resize()` never called on window resize; all touch listeners passive preventing iOS pinch-own; `TouchInteraction`/`ZoomPan`/`MouseInteraction` coexisting without synthetic-mouse suppression; `isMobileDevice()` checking only width; `HintText` hardcoded desktop copy; preferences panel overflow on narrow phones; missing `viewport-fit=cover` and safe-area CSS.
- Planned new `src/utils/device.ts` with `DeviceCapabilities` interface, `detectDeviceCapabilities()`, `LayoutTier` type, and `PointerPrimary` type.
- Planned new `src/interaction/CanvasInteraction.ts` with Pointer Events primary path, Touch Events fallback, gesture state machine, non-passive pinch fix, synthetic-mouse suppression, `setPointerCapture`, and proper `dispose()`.
- Documented all CSS changes: `viewport-fit=cover`, `env(safe-area-inset-*)` variables, `100dvh` with fallback, new 4-tier SCSS breakpoints, `touch-action: none` on canvas, compact info-panel mode, preferences panel `max-height` + `overflow-y: auto`.
- Finalized the v0.11 plan with online validation against W3C WCAG 2.2/2.1, W3C Pointer Events Level 3, MDN viewport/touch-action/env guidance, MDN WebGL best practices, and Khronos WebGL High-DPI/context-loss guidance.
- Added further validated risks/enhancements: explicit 320 px reflow testing, WebGL context-loss handling, optional `ResizeObserver` follow-up for drawing-buffer sizing, and caution that `touch-action: none` must stay scoped to the canvas.
- Updated `FINDINGS.md` with detailed per-bug root cause, file references, and fix descriptions.
- Updated all other markdown files to reference the technical plan pass.


### Fixed (v0.10 follow-up — parallax hole artifacts — 2026-05-17)

- Fixed the newly reported crater/hole artifacts in Hoch mode. Root cause:
  `PaintingMaterial` used parallax-shifted `pUV` for the actual albedo image,
  so procedural height recesses could show a displaced copy of the same picture,
  reading like holes with image content behind them.
- Albedo sampling now stays on the original `vMapUv`; parallax `pUV` is kept
  relief-only for normal/self-shadow sampling so the customer picture remains
  spatially stable.
- Hoch `parallaxScale` lowered from `0.04` to `0.012` to keep relief movement
  subtle and prevent crater-like offsets.
- Diagnostics now include `parallaxEnabled` and `parallaxScale` in
  `show-artwork-complete`.
- Validation: `npm run lint` and `npm run build` pass with only known warnings.

### Fixed (v0.10 — spot artifacts and portrait reset zoom — 2026-05-17)

- Deep source audit identified two root causes for "little spots" in Hoch mode.
  **Primary:** `generateHeight()` micro-noise amplitude too high for the
  self-shadow march step size, creating stochastic dark speckle.
  **Secondary:** `generateSpecular()` blob peak too high for Hoch close-up under
  clearcoat/raking light, creating bright spots.
- Implemented exact line-level changes from `plan.md`:
  - `ProceduralTextureFactory.ts` ~line 156: `* 16` → `* 3`
  - `ProceduralTextureFactory.ts` ~line 220: `* 90` → `* 50`
  - `quality.ts` Hoch `selfShadowBias`: `0.03` → `0.05`
  - `quality.ts` Hoch `specularStrength`: `0.4` → `0.28`
- Fixed reset framing for very vertical pictures: `GalleryManager` now computes
  reset zoom from the framed artwork dimensions and camera aspect/FOV, raises
  max zoom-out distance to `9.25`, and recomputes reset zoom after async artwork
  aspect loading on first load/navigation.
- Diagnostics now log `resetZoom`, `minZoom`, `maxZoom`, `specularStrength`,
  and `selfShadowBias`.
- No GLSL shader changes. No new public API. Balanced/battery unaffected by the
  spot tuning.
- Validation: `npm run lint` and `npm run build` pass with only known warnings.

### Fixed (v0.09 — actual uploaded image on 3D painting — 2026-05-17)

The central 3D painting now shows the actual customer-uploaded image instead of
the generated placeholder. Root cause was that the importer only wrote a relative
file path (`./images/...`) into the manifest — `Three.js TextureLoader` cannot
reliably upload local-file images as WebGL textures in all browsers when opened
via `file://`, even without `crossOrigin` set.

- **`scripts/import-artworks.mjs`**: after copying each image, reads the file
  bytes with `readFileSync`, encodes them as base64, and writes `webglImage:
  "data:image/<mime>;base64,<bytes>"` into `customer-artworks.js`. The exact
  original bytes are preserved — no crop, no scale, no recompression. A MIME
  type lookup table is added for all supported extensions. The import report
  states "3D painting source: embedded as data URLs for reliable offline WebGL."
- **`src/config/artworks.ts`**: added optional `webglImage?: string` to the
  `Artwork` interface.
- **`src/main.ts`**: `sanitizeInjectedArtworks()` now extracts `webglImage` from
  injected artwork objects. Only strings that match `data:image/...;base64,...`
  are accepted to block non-image content injection.
- **`src/gallery/GalleryManager.ts`**: all albedo URL derivations updated to
  `artwork.webglImage ?? artwork.image`: `init()` preload, `showArtwork()`
  cache lookup, `applyPreset()` cache presence check, side-panel lookups,
  fallback check. Diagnostics now include `webglImageSource:
  'embedded-data-url' | 'file-url'` in every `show-artwork-complete` log entry.
- **`src/gallery/TextureManager.ts`**: data URL diagnostic safety — full data
  URLs are never serialized into log entries. Instead logs
  `[data-uri:image/jpeg:2463944bytes]` showing only MIME type and byte count.

### Documentation (v0.09 — 2026-05-17)

- **`plan.md`**: replaced the v0.09 planning section with a full
  implementation and execution plan covering: code audit findings, detailed
  per-file change specs with code excerpts, analysis of alternative approaches
  (createObjectURL, createImageBitmap, fetch, canvas, server), security rationale
  for the data URL regex in the sanitizer, cache key consistency requirement,
  performance / size budget, and acceptance checks.
- **`FINDINGS.md`**: added v0.09 implemented section documenting what changed,
  why data URLs were chosen over alternatives, and the updated acceptance state.
- **`docs/HANDOFF.md`**: updated customer picture replacement status to mark
  v0.09 as implemented; updated acceptance checklist.

### Planned (v0.09 planning pass — 2026-05-17)

- Added a full v0.09 plan to `plan.md` after customer validation showed v0.08
  fixed the 3D painting aspect ratio but not the actual albedo image upload path.
- Documented the updated failure boundary: timeline DOM `<img>` displays the
  uploaded picture, `ArtworkMesh` sizes correctly from manifest dimensions, but
  the WebGL texture path can still fall back to the generated placeholder.
- Added online research findings to `FINDINGS.md` covering Three.js
  `TextureLoader`, CORS/origin-clean image rules, WebGL image texture security,
  `createImageBitmap`, and local user-image loading patterns.
- Planned the v0.09 technical direction: importer-generated exact base64
  `data:image/...` source (`webglImage`) for the central 3D painting albedo so
  WebGL no longer depends on `file://` image upload behavior.
- Updated customer/support docs to mark the remaining issue as v0.09 work rather
  than a completed v0.08 success state.

### Documentation (v0.08 deep implementation notes pass — 2026-05-17)

- **`plan.md`**: added "Deep Implementation Notes & Execution Plan" section to the
  v0.08 entry covering (1) the two-path render pipeline and the manifest-first
  aspect rule, (2) rationale for the two-loader pattern and the URL detection
  regex, (3) a verified all-resolutions matrix derived from `fitWithinBox(4.2,
  5.8)` covering ultrawide / wide / 4:3 / square / 4:5 portrait / 3:4 portrait /
  1:2 tall portrait / 1:4 extreme portrait, (4) how every shader effect
  (self-shadow, parallax, bump, clearcoat, anisotropy, inspection PCF) is
  invariant under the new per-artwork mesh scale, (5) enumerated edge cases
  (HEIC, AVIF, SVG, oversize >`MAX_TEXTURE_SIZE`, animated GIF, EXIF rotation,
  zero/negative aspect, CORS https, cache key collisions, rapid navigation),
  (6) coding advice for future PRs in this area, (7) browser/API stability
  boundaries, (8) resource ownership & disposal contract, (9) validation
  checklist later superseded by the v0.09 customer finding, and (10) parked
  future work for v0.09.
- **`FINDINGS.md`**: documented the follow-up validation pass; all resolutions,
  all image kinds, timeline behaviour, and effect application confirmed.
- **`docs/HANDOFF.md`**: marked v0.08 as shipped; added link to the Deep
  Implementation Notes section in `plan.md`.
- **`docs/CUSTOMER_PICTURE_GUIDE.md`**: confirmed the timeline-vs-3D-painting
  question is resolved for v0.08; added a short note on what the customer can
  expect after `Update Gallery`.

### Fixed (v0.08 — customer artwork 3D rendering — 2026-05-17)

Critical partial fix: imported customer images now drive the central 3D painting
aspect ratio correctly, and one confirmed local-file `crossOrigin` failure mode
was removed. Later customer validation showed the actual albedo bytes can still
fall back to the placeholder in the affected `file://` WebGL path; that remaining
issue is tracked as v0.09 above. The v0.08 root cause was `TextureManager`
setting `crossOrigin = 'anonymous'` on the `THREE.TextureLoader` used for all
textures — in `file://` protocol this caused local images to be treated as failed
CORS requests, silently substituting a 1600 × 1100 gradient fallback while the DOM
Timeline continued to display the images correctly.

- **`src/gallery/TextureManager.ts`**: replaced the single shared
  `THREE.TextureLoader` with two loaders — `externalLoader` (with
  `setCrossOrigin('anonymous')`) for actual `https?://` URLs, `localLoader` (no
  `crossOrigin`) for data URIs, relative paths, and `file://` resources. The URL
  type is detected per-load so both paths share the same cache key and anisotropy
  management. Added `isFallback(url, role)` and a `fallbackKeys` set so callers
  can detect silent fallback use. Added verbose diagnostics: load-start (with URL
  type and crossOrigin mode), load-success (with pixel dimensions), and
  load-failure (with browser error message).
- **`src/gallery/ArtworkMesh.ts`**: `updateAspect()` now accepts optional
  `manifestDimensions: { width, height }` and uses these as the primary source
  of truth for the 3D plane and frame aspect ratio. Texture metadata remains a
  safe fallback for built-in data-URI artworks. `setPaintingTextures()` updated to
  accept and forward `manifestDimensions`. New read-only getters `lastAspectSource`
  and `lastManifestDimensions` expose what was used for diagnostics.
- **`src/gallery/GalleryManager.ts`**: `showArtwork()` now passes
  `artwork.dimensions` to `setPaintingTextures()`. After each texture load it
  calls `isFallback()` and emits a high-visibility `warn` log when the central
  3D painting uses the fallback. The `show-artwork-complete` info log now includes
  `fallbackUsed`, `aspectSource`, `manifestDimensions`, `paintingWidth`,
  `paintingHeight`, and `paintingAspect`.
- **`plan.md`**: v0.08 section rewritten as a full technical implementation plan
  with root cause analysis, code snippets, logging table, acceptance checks, and
  changed-files summary.
- **`FINDINGS.md`**: v0.08 findings updated with confirmed root cause, applied fix
  summary, and build validation result.

### Planned fix (v0.08 critical customer artwork rendering — 2026-05-17)

- Added a critical plan to `plan.md` for the case where imported customer images
  appear in the timeline but not on the central 3D painting.
- Documented the likely failure boundary between DOM thumbnail loading and
  Three.js/WebGL texture loading.
- Added planned diagnostics for manifest dimensions, texture load success/failure,
  fallback texture usage, and computed 3D painting/frame aspect ratios.
- Marked the acceptance requirement: imported images must appear on the central
  3D painting with `fallbackUsed: false` and correct dimensions-derived aspect.

### Added (v0.07 customer-managed artworks — 2026-05-17)

The v0.07 importer and runtime injection path are implemented. A non-technical
customer can generate a customer artwork manifest by dropping images into one
folder and double-clicking one button. Final acceptance of the customer artwork
feature now depends on the v0.08 critical follow-up above: imported images must
also render on the central 3D painting with correct aspect ratios.

- Added `scripts/import-artworks.mjs` — zero-dependency Node 18+ importer that:
  - scans `customer-artworks/inbox/` for image files (sorted naturally)
  - reads pixel dimensions from JPEG / PNG / GIF / WebP / SVG / AVIF (HEIC) headers
  - skips RAW formats with a friendly message, warns about risky formats
  - copies images into `customer-preview/images/<id>.<ext>`
  - writes `customer-artworks/artworks.json` (human-readable manifest, with `.bak` of the previous run)
  - writes `customer-preview/customer-artworks.js` for runtime global injection
  - writes `customer-artworks/last-import-report.txt` in plain language
- Added `Update Gallery.command` (macOS) and `Update Gallery.bat` (Windows) — double-click
  launchers that run the importer and open the report. Both check for Node.js up front
  and print a friendly install hint if missing.
- Added `customer-artworks/inbox/` and `customer-artworks/processed/` with `.gitkeep`
  placeholders. All customer-generated content is excluded from version control via
  `.gitignore`.
- Updated `scripts/write-local-preview.mjs` to inject
  `<script src="./customer-artworks.js">` into `customer-preview/app.html` and to
  write a `window.__FREYRAUM_ARTWORKS = [];` stub when no customer artworks exist yet,
  so the `file://` preview never 404s the injection.
- Refactored to support arbitrary-length, arbitrary-aspect artwork lists:
  - `src/timeline/Timeline.ts`, `src/ui/InfoPanel.ts`, `src/gallery/GalleryManager.ts`
    no longer import the global `artworks` constant; they accept `readonly Artwork[]`
    (or a single `Artwork`) via their constructor.
  - `src/main.ts` now reads `window.__FREYRAUM_ARTWORKS`, validates every entry with
    `sanitizeInjectedArtworks()` (drops malformed entries, dedupes IDs, normalizes
    `surfaceProfile`, falls back gracefully), and uses the customer list when non-empty.
  - When no customer artworks are present, the built-in demo artworks load unchanged.
- Existing `ArtworkMesh.updateAspect()` and `SidePanels.fitWithinBox()` are the
  intended aspect-ratio path for portrait, landscape, square, and ultrawide
  artworks. v0.08 must ensure the central 3D painting uses real imported textures
  and manifest dimensions instead of generated fallback texture dimensions.
- Added `docs/CUSTOMER_PICTURE_GUIDE.md` (rewritten for the implemented workflow,
  including macOS Gatekeeper note, file-type matrix, and FAQ).
- Updated `.gitignore` for `customer-artworks/inbox/*` (except `.gitkeep`),
  `customer-artworks/processed/*` (except `.gitkeep`),
  `customer-artworks/artworks.json`, `customer-artworks/artworks.json.bak`,
  `customer-artworks/last-import-report.txt`, `customer-preview/images/`, and
  `customer-preview/customer-artworks.js`.

### Validation (v0.07 customer importer)

- `npm run lint` — passes with no new warnings.
- `npm run build` — passes; only the pre-existing Dart Sass legacy-JS-API warning is emitted.
- Importer end-to-end tested with portrait (300×600), landscape (800×400),
  square (512×512), ultrawide (3200×800), SVG (1024×768), and JPEG (512×768) files,
  plus one unsupported `.txt` skipped with a friendly message and an empty-inbox run
  that falls back to built-in artworks.

### Added (v0.07 diagnostics and logging system — 2026-05-17)

- Added `src/utils/Diagnostics.ts`, a centralized diagnostics/logger singleton with:
  - modes: `default`, `info`, `verbose`
  - levels: `debug`, `info`, `warn`, `error`
  - ring-buffered session history (300 entries)
  - short-window deduplication with repeat counts
  - structured metadata serialization
  - global error / unhandled-rejection capture
  - global developer API on `window.__FREYRAUM_DIAGNOSTICS__`
- Replaced ad hoc runtime logging with structured diagnostics in:
  - `src/main.ts`
  - `src/rendering/RenderBackend.ts`
  - `src/gallery/TextureManager.ts`
  - `src/gallery/GalleryManager.ts`
  - `src/utils/AdaptiveQualityController.ts`
  - `src/utils/preferences.ts`
- Kept normal console output intentionally low-noise (`warn` / `error` only) while enabling deeper logs through `?debug=1` / `?debug=verbose`.
- Updated `plan.md`, `FINDINGS.md`, `README.md`, `docs/HANDOFF.md`, and `DOCUMENTATION_RULES.md` to document the new diagnostics architecture and reliability guidance.

### Validation (v0.07 diagnostics)

- `npm run lint` — passes; only the pre-existing `@typescript-eslint` TypeScript-version support warning is emitted.
- `npm run build` — passes; only the pre-existing Dart Sass legacy-JS-API warning is emitted.

### Updated (v0.07 full technical execution plan — 2026-05-17)

The v0.07 plan has been expanded from a documentation-only pass into a complete technical implementation and execution guide.

- Documented the exact architecture decision: **global window injection** pattern (`window.__FREYRAUM_ARTWORKS`) is chosen over `fetch()` (blocked on `file://`) and full-rebuild-on-import (slow, unnecessary for every update).
- Added `v0.07 Technical Implementation Guide` to `plan.md`: exact architecture table, Slice S2 manifest schema, Slice S3 complete Node.js script outline with zero-dep dimension reading for JPEG/PNG/WebP/GIF/SVG, Slice S4 large-file strategy and jimp upgrade path, Slice S5 exact code changes for `main.ts` and `write-local-preview.mjs`, Slice S6 report format with sample output, full implementation checklist (Phase 1–4), and developer setup notes.
- Updated `FINDINGS.md` with: architecture decision rationale (why `fetch()` is ruled out on `file://`), global injection pattern, `jimp` vs `sharp` research, zero-dep dimension reading feasibility, macOS Gatekeeper `.command` approval note.
- Updated `docs/CUSTOMER_PICTURE_GUIDE.md` to mark the guide as ready for the next implementation pass.

### Added (v0.07 planning documentation pass — 2026-05-17)

- Added `docs/CUSTOMER_PICTURE_GUIDE.md`, a plain-language guide explaining the current limitation and the planned simple customer workflow: drag pictures into `customer-artworks/inbox/`, run one updater, then open `index.html`.
- Added a full v0.07 plan in `plan.md` for a customer-managed artwork-folder pipeline with one-click import/build automation, generated `artworks.json`, safe optimized copies, large-file handling, fallback demo artworks, and elderly-customer UX requirements.
- Documented online research findings for browser image format support, folder import limitations, EXIF/orientation caveats, and WebGL texture-size limits.
- Updated `README.md`, `FINDINGS.md`, `docs/HANDOFF.md`, and `DOCUMENTATION_RULES.md` to reference the new guide and plan.

### Validation (v0.07 planning docs)

- Documentation-only change. No runtime code changed.
- No new dependencies.

---



### Added (v0.06 implementation — Streifenlicht blockiness reduction)

Three vertical slices shipped against `src/`; root causes RC-1/RC-2/RC-3 from the v0.06 plan were verified in code before implementation and fixed below.

- **S2 — Procedural texture anisotropy.**
  - `src/gallery/TextureManager.ts`: New `getEffectiveAnisotropy()` getter; `setAnisotropyDivisor()` now delegates to it.
  - `src/materials/ProceduralTextureFactory.ts`: New `currentAnisotropy` field (default 1) + `setAnisotropy(value)` method that mutates every cached `DataTexture` in place; `generate()` applies the stored cap to newly created textures.
  - `src/gallery/GalleryManager.ts`: `applyPreset()` now calls `procedural.setAnisotropy(textureManager.getEffectiveAnisotropy())` so authored and procedural textures share the same per-preset cap.

- **S3 — Inspection-only relief-map resolution uplift.**
  - `src/config/quality.ts`: New `QualityPreset.proceduralInspectionTileSize` field — high=`2048`, balanced=`0`, battery=`0`.
  - `src/gallery/GalleryManager.ts`: New `inspectionMode` field + `setInspectionMode(on)` method that re-runs `showArtwork()` when toggled. Module-scope `INSPECTION_ROLES = ['normal','detailNormal','height']` (matches the style of `PROCEDURAL_ROLES`). `showArtwork()` picks `proceduralInspectionTileSize` for inspection roles when `inspectionMode && inspSize > 0`, `proceduralTileSize` otherwise. The factory cache key already includes the effective tile size, so 1024- and 2048-resolution entries coexist without stale-texture risk.
  - `src/main.ts`: `applyPreferences()` calls `galleryManager.setInspectionMode(lightProfile.displayIntent === 'inspection')`.

- **S4 — Lateral self-shadow PCF filter (inspection-only).**
  - `src/config/quality.ts`: High-preset `selfShadowFilterRadius` raised from `0.0` to `0.002` (balanced/battery stay `0.0`). The `selfShadowFilterEnabled` field proposed in the original plan was **not added** — see the plan's "Issues found in the original plan" section; the runtime gate in `main.ts` makes a preset-level boolean dead, and `selfShadowFilterRadius = 0` already disables the path on a preset.
  - `src/materials/PaintingMaterial.ts`: New `uShadowFilterRadius` uniform + `shadowFilterEnabled` instance flag + `setShadowFilterRadius(radius, enabled)` method that writes the uniform unconditionally and only triggers `needsUpdate = true` when the enable flag changes (recompile only on toggle). New GLSL block guarded by `#define PAINTING_USE_SHADOW_FILTER`, inserted inside the existing `#ifdef PAINTING_USE_SELFSHADOW` after the primary-ray `_occlusion` clamp: two companion rays perpendicular to `_shDelta`, each accumulated with the same reciprocal-distance weighting as the primary ray and clamped to `uShadowMaxOcclusion` before the 3-way average. The define is gated on `shadowFilterEnabled && selfShadowActive() && uShadowFilterRadius > 0` so it is never compiled in without the self-shadow path that hosts it.
  - `src/main.ts`: `applyPreferences()` calls `paintingMaterial.setShadowFilterRadius(isInspection ? preset.selfShadowFilterRadius : 0, isInspection && preset.selfShadowFilterRadius > 0)`.

### Validation (v0.06)

- `npm run lint` — clean.
- `npm run build` — typecheck + Vite preview + preview-HTML emitter all pass; only the pre-existing Dart Sass legacy-JS-API deprecation warning is emitted. Bundle: `customer-preview/freyraum-gallery.js` ≈ 562 KB (gzip ≈ 143 KB), up ~9 KB from v0.05 (new GLSL chunk + uniform plumbing).
- Self-shadow texture reads: gallery profile = 8 (unchanged from v0.05); inspection profile = 24 (1 primary ray + 2 lateral rays × 8 steps). Memory uplift on inspection mode on high preset: ≈48 MB GPU per inspected artwork (3 roles × (2048² − 1024²) × 4 bytes).

---

### Added (v0.05 implementation — soft self-shadow filtering)

- **Replaced the binary self-shadow GLSL break loop** in `src/materials/PaintingMaterial.ts` with smooth weighted accumulation: `smoothstep(0, softness, sampleH - wantedH - bias)` per step, reciprocal-distance weighted, normalised, clamped to `uShadowMaxOcclusion`, then multiplied by `strength × profileScale × grazeMask`.
- **Added a near-horizon `grazeMask`** (`smoothstep(0.05, 0.20, tsLight.z)`) so the self-shadow fades out smoothly as light approaches grazing, eliminating the previous hard `_tsLight.z > 0.05` cutoff edge.
- **Added 4 new uniforms** to `PaintingMaterial`: `uShadowBias`, `uShadowSoftness`, `uShadowMaxOcclusion`, `uShadowProfileScale`.
- **Added `PaintingMaterial.setShadowProfileScale(scale)`** (uniform-only, no recompile) and **`PaintingMaterial.setShadowDebug(enabled)`** (toggles `PAINTING_DEBUG_SHADOW`).
- **Added `PAINTING_DEBUG_SHADOW` define path** in the fragment shader. When enabled, the self-shadow value is stashed in `indirectDiffuse` and all other lighting terms are zeroed, producing a clean greyscale visualisation of the shadow mask only.
- **Extended `QualityPreset`** (`src/config/quality.ts`) with `selfShadowBias`, `selfShadowSoftness`, `selfShadowMaxOcclusion`, `selfShadowFilterRadius` for all three presets. Lowered high-preset `selfShadowStrength` from 0.55 to 0.30. `selfShadowFilterRadius` is wired through the type system but kept at `0.0` (PCF filter slot reserved for later).
- **Wired `src/main.ts`** to call `setShadowProfileScale(0.5)` for `display`/`demo` light profiles and `1.0` for `inspection`, via the existing `getLightProfile()` lookup. Added an `s`/`S` debug key (behind `?debug=1`) that toggles `setShadowDebug()` alongside the existing `a`/`A` albedo-only key.
- **Updated `plan.md`, `FINDINGS.md`, `README.md`, `docs/HANDOFF.md`** to mark v0.05 as implemented and document the new behaviour, effective values, and the four enhancement slots that remain open (S4 PCF filter; per-profile shadow scale on `LightProfile`; animated profile-scale fade; authored height drop-in).

### Validation (v0.05)

- `npm run lint` — clean.
- `npm run build` — typecheck + Vite preview + preview-HTML emitter all pass; only the pre-existing Sass legacy-JS-API deprecation warning is emitted.
- Customer-preview IIFE regenerated (`customer-preview/freyraum-gallery.js` ≈ 558 KB / 142 KB gzip).
- No new npm dependencies.

### Updated (v0.05 plan — full technical execution guide)

- **Rewrote v0.05 plan in `plan.md`** from a diagnosis stub into a 7-slice, file-by-file, line-by-line technical execution guide for fixing self-shadow stain artifacts.
- **Confirmed code root cause:** `src/materials/PaintingMaterial.ts` `PAINTING_USE_SELFSHADOW` block — binary break on first blocker, no bias, no softness, no max-occlusion cap, `selfShadowStrength: 0.55` causes direct light to drop to 45 % in a single step.
- **Designed new GLSL contract:** smooth weighted accumulation `smoothstep(0, softness, excess) * (1 / (step+1))`, clamped to `maxOcclusion`, then multiplied by `strength * profileScale`. Maximum gallery-soft darkening = 4.2 % of direct light.
- **Specified TypeScript changes:**
  - `src/config/quality.ts`: add `selfShadowBias`, `selfShadowSoftness`, `selfShadowMaxOcclusion`, `selfShadowFilterRadius` to `QualityPreset`; lower high-preset `selfShadowStrength` 0.55 → 0.30.
  - `src/materials/PaintingMaterial.ts`: add `uShadowBias/Softness/MaxOcclusion/ProfileScale` uniforms; add `setShadowProfileScale()` and `setShadowDebug()` methods; add `PAINTING_DEBUG_SHADOW` define path.
  - `src/main.ts`: call `setShadowProfileScale()` on profile switch; add `s`/`S` debug key for shadow-only visualisation.
- **Optional S4 PCF-like filter slot** documented for 3-ray lateral filtering; controlled by `selfShadowFilterRadius > 0`.
- **Extension slots designed in:** per-profile `shadowProfileScale`, animated profile fade, authored height support, HDR height encoding.
- Updated `FINDINGS.md` and `docs/HANDOFF.md` with code-grounded v0.05 technical context.

### Added (v0.05 planning — initial stub)

- Added initial v0.05 plan in `plan.md` for soft self-shadow filtering and stain artifact removal.
- Documented the suspected shader root cause: binary height-field blocker test with no bias, no penumbra softness, no filtering, and strong direct-light attenuation.
- Captured online research directions for parallax/relief self-shadowing, bias/deadzone handling, PCF-like filtering, and Three.js `onBeforeCompile` integration.
- Updated `FINDINGS.md`, `README.md`, `docs/HANDOFF.md`, and `DOCUMENTATION_RULES.md` with the v0.05 diagnosis, review focus, and documentation status.

### Added (v0.04 implementation)

- **Photorealistic procedural fallback pass.** Replaced the v0.03 `sin/cos` procedural normal, height, and roughness generators with deterministic value-noise maps so raking light no longer exposes checkerboard, cross-hatch, horizontal-band, or vertical-band artifacts.
- **Neutral AO fallback.** Removed the procedural AO radial vignette and replaced it with near-white neutral occlusion plus subtle value-noise grain. Default/high-preset paintings no longer get fake dark edges from fallback AO.
- **Clearcoat / varnish pipeline.** Added `clearcoatEnabled`, `clearcoatStrength`, and `clearcoatRoughnessValue` to quality presets; high enables subtle clearcoat, balanced and battery disable it.
- **Authored varnish map contract.** Added optional `varnish` role to `PaintingMapRole`, `PaintingTextureSet`, `ResolvedPaintingTextures`, and `TextureManager.preloadTextureSet()`.
- **Surface-profile wiring.** `PaintingMaterial.applySurfaceProfile()` now applies per-artwork matte/satin/varnish behavior, and `GalleryManager` calls it after race-protected artwork loads.
- **Artwork metadata update.** All four artworks now declare `surfaceProfile`; `tokyo-passage` is `satin-canvas`, the others are `matte-canvas`.
- **User-friendly surface labels.** `InfoPanel` now adds German material labels such as `Matte Leinwand` and `Satinierte Leinwand` to the artwork metadata line.
- **High-preset height fallback fix.** Procedural height maps are generated whenever bump, parallax, or self-shadow needs them, so high-preset parallax/self-shadow no longer depends on authored maps.
- Regenerated `customer-preview/freyraum-gallery.js` for the one-click local preview.
- Updated `plan.md`, `FINDINGS.md`, `README.md`, and `docs/HANDOFF.md` with implementation outcome, review notes, and validation evidence.

### Updated (v0.04 plan — full technical execution guide)

- **Rewrote v0.04 plan in `plan.md`** from a high-level strategy into an 11-slice, file-by-file technical execution guide. The new plan documents exact method names, line numbers, before/after code snippets, TypeScript constraints, and per-slice acceptance checks.
- **Confirmed Bug 1 root cause:** `ProceduralTextureFactory.generateAO()` line 211 `const vignette = 1 - Math.min(1, r2 * 0.55)` — a radial formula that evaluates to ~0 at texture corners and 1.0 at centre, producing fake edge darkening that is visible on the painting surface.
- **Confirmed Bug 2 root cause:** `generateHeight()` lines 119–120 use `Math.abs(Math.sin(y*0.12))` and `Math.abs(Math.sin(x*0.09))` creating perfect horizontal and vertical banding. `generateNormal()` lines 95–98 use `sin×cos` products at fixed harmonics creating a visible 2D grid. `generateRoughness()` lines 145–148 same pattern at lower amplitude.
- **Designed value-noise replacement:** `valueNoise2d(x, y, seed)` using smoothstep-interpolated 2D integer lattice hash (`latticeHash()` with LCG/Murmur-style constants and `Math.imul`). No external dependency, seeded per-artwork, fully deterministic.
- **Designed clearcoat / varnish pipeline:** `QualityPreset` gains `clearcoatEnabled` / `clearcoatStrength` / `clearcoatRoughnessValue`; `PaintingTextureSet` gains `'varnish'` map role; `PaintingMaterial` gains `applySurfaceProfile()` that reads the per-artwork `SurfaceProfile` and sets Three.js native clearcoat properties; `GalleryManager` calls `applySurfaceProfile()` after every artwork load.
- **Documented 11-file change scope with no new npm dependencies and no GLSL changes.**
- Updated `FINDINGS.md` with code-grounded diagnosis including exact line numbers for every diagnosed issue.
- Updated `docs/HANDOFF.md` v0.04 section with implementation-level summary.
- Updated `README.md` v0.04 section with reference to the new execution plan.

### Added (v0.04 planning — initial)

- Added a new `v0.04` follow-up plan in `plan.md` focused on removing the current vignette-like darkening, replacing the checkerboard-looking procedural surface, and moving the painting material toward a more photorealistic layered PBR workflow.
- Recorded the code-grounded diagnosis that the current dark radial falloff comes from the procedural AO fallback and that the synthetic checker pattern comes from the periodic `sin/cos` procedural normal/height/roughness generators.
- Captured web research sources in `FINDINGS.md` for museum/conservation lighting practice, RTI/photometric surface capture, and practical Three.js PBR guidance.
- Updated `README.md` and `docs/HANDOFF.md` so the next follow-up scope is visible to contributors and reviewers.

### Added (v0.03 validation audit)

- Re-ran a fresh-clone validation audit for the implemented v0.03 work. Documented that `npm run lint` and `npm run build` initially fail until `npm install` is run in a fresh checkout, then both commands pass cleanly aside from the already-known `@typescript-eslint` TypeScript-version warning and the current Dart Sass legacy JS API deprecation warning.
- Corrected the `plan.md` validation note that counted built-bundle shader-gate occurrences: the current production bundle contains **12** occurrences of `PAINTING_USE_PARALLAX`, `PAINTING_USE_SELFSHADOW`, `PAINTING_DEBUG_ALBEDO_ONLY`, and `uKeyLightDir`, not 11.
- Synced `README.md`, `FINDINGS.md`, and `docs/HANDOFF.md` with the fresh-clone audit so reviewer guidance now reflects the latest revalidation pass.

### Added (v0.03 implementation)

- **Matte-first painting material.** `PaintingMaterial` retuned for museum-quality default: `clearcoat 0.04→0.0`, `specularIntensity 1.0→0.3`, `uLightGrazingBoost 0.6→0.25`. Procedural roughness output range shifted from `[60..220]` to `[140..240]`; procedural specular baseline lowered from `12→6` and Gaussian blob peak lowered from `200→90` so varnish patches read as subtle highlights instead of dominant specular reflections.
- **Resolution-aware procedural fallback.** `ProceduralTextureFactory.generate(id, role, tileSize?)` parametrised on output resolution. Per-preset tile sizes baked into `quality.ts`: high `1024`, balanced `512`, battery `256`. Cache key includes `tileSize` so preset changes regenerate maps rather than returning stale low-resolution tiles.
- **Tangent-space parallax relief.** Added `geo.computeTangents()` to `ArtworkMesh.makeArtworkGeometry` so `vTangent`/`vBitangent` varyings populate. `PaintingMaterial` injects a steep parallax march before `map_fragment` that produces a `pUV` variable used by both the albedo and normal samples. New uniforms: `uParallaxScale`, `uParallaxSteps`. Gated by `#define PAINTING_USE_PARALLAX` and enabled only on the high preset (12 march iterations, UV depth scale `0.04`). When parallax is active, `bumpStrength` is set to `0.0` to prevent double-counting relief amplitude.
- **Direct-light self-shadow approximation.** Short height-march along the tangent-space key-light direction modulates `directDiffuse` and `directSpecular` only (the indirect / albedo path is untouched, so the original picture's colour is preserved). New uniforms: `uShadowSteps`, `uShadowStrength`, `uKeyLightDir`. `LightingSetup.getKeyLightWorldDir()` returns the world-space direction; `main.ts` transforms it into view space each frame and pushes it into the material. Gated by `#define PAINTING_USE_SELFSHADOW`, high preset only (8 march iterations, strength `0.55`).
- **Albedo-only fidelity QA toggle.** Hidden behind `?debug=1` URL parameter, then activated with the `a` keyboard key. Strips all shading (`directDiffuse = 0`, `directSpecular = 0`, `indirectDiffuse = diffuseColor`) so reviewers can verify the shader does not change the picture's essence. Console logs availability and current state. Gated by `#define PAINTING_DEBUG_ALBEDO_ONLY`.
- **Museum lighting reposition.** `gallery-soft` primary key moved from `{x:-10,y:5,z:7}` (~68° from vertical — theatrical side-light) to `{x:-3,y:5,z:4}` (~45° — flattering museum-style key that still reveals surface relief during pan/zoom). Horizontal drift amplitude lowered from 0.6 to 0.25 to match the new closer position. `raking-inspection` key moved to strictly horizontal `{x:-6,y:0,z:1.5}`; ambient lowered `0.4→0.3` to maximise shadow contrast. New `displayIntent: 'display' | 'inspection' | 'demo'` field on `LightProfile`.
- **Explicit spotlight target.** `LightingSetup` now creates a shared `THREE.Object3D` at world origin, adds it to the scene, and assigns it to every spotlight's `target`. Closes a latent bug where animating the spot position would have left the detached default target unmoved.
- **Lighting profile UI selector.** New `lighting: LightProfileId` field added to `Preferences` (persisted in localStorage and mirrored to `data-lighting` on `<html>`). New "Beleuchtung" radio group rendered in `PreferencesPanel` listing all four profiles with their German labels and descriptions. Selection is propagated through `applyPreferences` to `LightingSetup.setProfile()`.
- **Free corner inspection.** Replaced `PAN_SAFETY_FACTOR = 0.92` (which forced an artificial 8 % margin) with `INSPECTION_OVERSCROLL = 0.5` (an additive overscroll past the artwork edge). At maximum zoom the viewport centre can now reach any corner of the painting plus a small breathing margin, satisfying the v0.03 acceptance criterion of *every detail reachable*.
- **Surface contract types.** Added `SurfaceProfile` (`'matte-canvas' | 'satin-canvas' | 'varnished-oil' | 'paper' | 'procedural-fallback'`) and `SurfacePhysics` (`reliefScale?`, `parallaxDepthScale?`) to `src/config/artworks.ts`. Both are optional so existing artworks need no change. Reserved for future per-artwork tuning when scanned assets land.
- **Plan finalisation marker.** `plan.md` v0.03 section now reads "implemented" with an "Implementation Outcome" subsection documenting validation evidence, as-built deviations from the original plan, the issues found and fixed during implementation, and a per-slice summary. The original execution plan is retained verbatim below as the historical design record.

### Added (v0.03 plan finalized as execution plan)

- Replaced the v0.03 "planning status" header in `plan.md` with a full implementation-ready execution plan. Every slice now has exact file locations, type additions, method signatures, constant changes, shader injection tokens, GLSL code blocks, and rationale for each decision. A developer can open any target file and apply changes directly without interpreting architectural intent.
- The nine slices and their specific code targets:
  - **Slice 1 — Surface contract + fidelity**: `SurfaceProfile` and `SurfacePhysics` types added to `artworks.ts`; `uAlbedoOnly` uniform + `setAlbedoOnly()` added to `PaintingMaterial`; new quality preset fields `proceduralTileSize`, `parallaxEnabled`, `parallaxSteps`, `selfShadowEnabled`, `selfShadowSteps`.
  - **Slice 2 — Matte-first retune**: `clearcoat 0.04→0.0`, `specularIntensity 1.0→0.3`, `uLightGrazingBoost 0.6→0.25`; roughness procedural range shifted to `[140..240]`; specular blob peak `200→90`.
  - **Slice 3 — Resolution-aware procedural**: `generate()` gains `tileSize?` parameter; cache key extended; generators parametrised; `GalleryManager` passes `preset.proceduralTileSize`.
  - **Slice 4 — Parallax relief**: tangent computation added to `ArtworkMesh.makeArtworkGeometry`; steep parallax march injected before `map_fragment`; `pUV` variable shadows `vMapUv` for all map reads; gate: `PAINTING_USE_PARALLAX`.
  - **Slice 5 — Self-shadow**: short height-march along tangent-space key-light direction; `uKeyLightDir` uniform updated from `LightingSetup.getKeyLightWorldDir()` each frame; modulates `directDiffuse`/`directSpecular` only; gate: `PAINTING_USE_SELFSHADOW`.
  - **Slice 6 — Museum lighting**: `gallery-soft` key repositioned from `{x:-10,y:5,z:7}` (~68° from vertical) to `{x:-3,y:5,z:4}` (~45° from vertical, flattering + detail-revealing); `raking-inspection` key moved to near-horizontal `{x:-6,y:0,z:1.5}`; ambient reduced to 0.3; `displayIntent` field added to `LightProfile`; SpotLight target explicitly set to world origin.
  - **Slice 7 — Free inspection camera**: `PAN_SAFETY_FACTOR=0.92` removed; `INSPECTION_OVERSCROLL=0.5` replaces it; `getPanLimits` now uses `artworkEdge + overscroll` so every corner is reachable.
  - **Slice 8 — Performance hardening**: post-implementation tuning of parallax step counts and shadow step counts per preset.
  - **Slice 9 — Documentation handoff**: acceptance check completion, FINDINGS update with GPU profile and texture memory cost.

### Added (v0.03 planning)

- Expanded the v0.03 plan in `plan.md` into a more technical rendering architecture: modular artwork surface contracts, resolution-independent asset selection, preset-based shader tiers, museum-style display lighting, tangent-space parallax occlusion mapping strategy, direct-light self-shadow approximation, matte-first material retuning, and explicit module/file responsibilities.
- Reworked v0.03 findings in `FINDINGS.md` to document the current code-level constraints plus the researched lighting direction for gallery-display key placement, raking inspection light, motion-visible relief, modular asset swaps, effective texel-density handling, parallax-style relief, and self-shadowing.
- Updated `README.md` and `docs/HANDOFF.md` so the v0.03 summary and reviewer guidance now reflect the refined lighting architecture and acceptance criteria.

### Added (v0.02 implementation)

- **`PaintingMaterial`** (`src/materials/PaintingMaterial.ts`) — extends `MeshPhysicalMaterial` and combines native Three.js features (`map`, `normalMap`, `roughnessMap`, `specularIntensityMap`, `bumpMap`, `aoMap`) with a minimal `onBeforeCompile` injection that does tangent-space detail-normal blending, an explicit `perturbNormalArb` after-pass so `normalMap` and bump coexist correctly, and a grazing-light boost gated by `PAINTING_USE_GRAZING_BOOST`. Reduced-motion mode flattens the detail contribution via the `uReducedMotionScalar` uniform without corrupting the normal basis.
- **`ProceduralTextureFactory`** (`src/materials/ProceduralTextureFactory.ts`) — deterministic procedural generators for albedo, base normal, detail normal, height/bump, roughness, specular (with Gaussian varnish-pooling blobs), and AO maps. Outputs are `DataTexture` instances with mipmaps and `RepeatWrapping`.
- **`PaintingTextureSet`** contract (`src/materials/PaintingTextureSet.ts`) — typed map roles, colour-space hints, and resolved-texture shape. `Artwork.textureSet?` is now optional metadata on every artwork.
- **Role-aware `TextureManager`** (`src/gallery/TextureManager.ts`) — `loadForRole(url, role)` correctly sets `LinearSRGBColorSpace` for non-albedo maps and applies a per-preset anisotropy divisor; `preloadTextureSet(set)` loads a full `PaintingTextureSet` in parallel. Later audit hardening also reapplies anisotropy caps to already-cached textures when the preset changes.
- **`LightProfile` system** (`src/lighting/LightProfile.ts`) — four named profiles: `gallery-soft` (default, animated), `raking-inspection` (reveals canvas relief, still), `museum-neutral` (5500 K dual-key, still), `dramatic-demo` (warm-cool contrast, animated). Includes `kelvinToColor` Tanner-Helland approximation. `LightingSetup` reuses spotlight pool across profile switches.
- **`FrameBudgetMonitor`** (`src/utils/FrameBudgetMonitor.ts`) — rolling 60-frame window, EMA smoothing, cooldown for navigation/preset spikes, clamps pathological frames at 250 ms so tab-switches do not poison the rolling average.
- **`AdaptiveQualityController`** (`src/utils/AdaptiveQualityController.ts`) — one-way `high → balanced → battery` downgrade path with post-downgrade hold-off, ignores cooldown windows, and self-suspends as soon as the user makes a manual preset choice.
- **`RenderBackend` + external WebGPU probe module** (`src/rendering/RenderBackend.ts` + `public/webgpu-probe.js`) — opt-in (`?backend=webgpu` query or `localStorage.freyraum.backend = 'webgpu'`) experimental WebGPU adapter probe. Because the customer preview is built as a single IIFE for `file://`, the probe lives as a copied public ES module and is imported only at runtime; failures always fall back silently to WebGL. Returns a serializable probe-result shape independent of the browser's DOM WebGPU types.
- **Extended `QualityPreset`** (`src/config/quality.ts`) — adds `shaderVariant`, `normalStrength`, `detailNormalStrength`, `bumpStrength`, `specularStrength`, `anisotropyDivisor`, `aoEnabled`, `grazingBoostEnabled`, `detailNormalEnabled` fields. Existing presets (`high`, `balanced`, `battery`) populate all fields with non-breaking defaults.
- **Aspect-ratio-aware detail tiling** — `PaintingMaterial.applyTextures(textures, tilingPerWorldUnit, preset)` receives a per-artwork `uDetailTiling` derived from the artwork's world-space dimensions, so canvas weave stays at uniform physical density on portrait, square, landscape, and ultrawide artworks (no stretched weave on 7:3 ultrawide).
- **`uv1` AO support** — `ArtworkMesh.makeArtworkGeometry` clones `uv` into `uv1` after `PlaneGeometry` construction so Three.js ≥ 0.152's `aoMap` path works.
- **Lifecycle guardrails** — `GalleryManager.showArtwork` is async with an `artworkLoadToken` counter so rapid navigation cannot apply a stale texture set. Adaptive controller automatically suspends when the user changes the preset manually.

### Changed (v0.02)

- `ArtworkMesh` now owns a `PaintingMaterial` instead of an inline `MeshPhysicalMaterial`. The inline async normal-texture load from `CanvasMaterial.loadNormalTexture` is replaced by the procedural factory applying a fresh, deterministic per-artwork normal map.
- `GalleryManager` constructor now accepts an optional `ProceduralTextureFactory` (defaults to a new instance) and exposes `proceduralFactory` for shutdown disposal.
- `main.ts` now wires `FrameBudgetMonitor`, `AdaptiveQualityController`, and the WebGPU probe into the boot path. The animation loop samples the frame budget every frame and feeds adaptive decisions back through `preferences.setQuality(...)` so the UI stays consistent. A dedicated `adaptiveQualityWriteInFlight` guard now prevents the controller from suspending itself on its own automatic downgrade.
- `LightingSetup` constructor signature accepts an optional `LightProfileId`. The default profile reproduces v0.01 visuals.
- Quality-preset changes now rebuild the currently displayed artwork's full resolved map set immediately, so switching to `battery` really removes detail-normal / height / roughness / specular / AO work from the active material instead of only affecting the next navigation.

### Removed (v0.02)

- The lazy `CanvasMaterial.loadNormalTexture()` call from `ArtworkMesh`. Procedural normal maps are now generated synchronously by `ProceduralTextureFactory.generate(id, 'normal')`, eliminating a small async race during artwork construction. `CanvasMaterial` is still used for the frame material and may be retired in a future pass.

### Earlier "Unreleased" entries (v0.02 planning, kept for traceability)

- Replaced the v0.02 high-level plan in `plan.md` with a code-grounded final implementation plan: exact TypeScript interfaces for `PaintingTextureSet`, `PaintingMaterial`, `LightProfile`, `FrameBudgetMonitor`, `RenderBackend`, and `WebGPUPrototype`; GLSL injection patterns for Three.js 0.166; procedural texture generation algorithms; `QualityPreset` field additions; and changes to `ArtworkMesh`, `TextureManager`, `GalleryManager`, `LightingSetup`, and `main.ts`.
- Updated `FINDINGS.md` with codebase analysis findings from the v0.02 planning pass.
- Updated `docs/HANDOFF.md` with v0.02 shader controls, light profile descriptions, WebGPU probe instructions, and benchmark procedure.
- Completed a final v0.02 documentation audit: corrected shader-space and bump/specular implementation guidance, added async-load/disposal guardrails, added a validation matrix and risk register, and clarified WebGPU/debug-chunk boundaries.

- Structured artwork metadata model (`Artwork.id`, `year`, `medium`, `dimensions`, `alt`, `credit`, `tags`) in `src/config/artworks.ts` to prepare for future CMS integration
- `PreferencesStore` (`src/utils/preferences.ts`) with reduced-motion and high-contrast modes plus quality-preset persistence in `localStorage`
- Quality preset definitions (`src/config/quality.ts`) for `high` / `balanced` / `battery` modes, applied to renderer pixel ratio, bloom, shadows, and artwork geometry segments
- WebGL availability detection (`src/utils/webgl.ts`) and localized `FallbackScreen` UI component shown when WebGL or the renderer cannot initialize
- `ZoomControls` UI component (zoom in / out / reset) with ARIA labels and tooltips
- `FullscreenButton` UI component using the Fullscreen API with `aria-pressed` syncing on browser-initiated exits
- `PreferencesPanel` popover-style settings dialog with accessible toggles (reduced motion, high contrast) and a radio group for quality presets
- Public `GalleryManager.resetView()` and `setReducedMotion()` so UI and preferences can drive gallery behavior directly
- Keyboard shortcuts in `KeyboardNav`: `+` / `-` zoom, `0` or `R` reset view, `F` fullscreen
- Customer handoff documentation: `docs/HANDOFF.md` plus self-contained SVG architecture diagram at `docs/assets/architecture.svg`
- Info panel now displays year, medium, and credit fields from the structured metadata model

### Changed

- Timeline thumbnails are real `<button>` elements with a roving tabindex; Arrow / Home / End keys navigate, Enter / Space activate
- Timeline thumbnails reserve their artwork's intrinsic aspect ratio inside a fixed frame and use a shimmer skeleton until the image finishes loading, eliminating layout shift
- Renderer, post-processing, lighting, and artwork mesh now accept a `QualityPreset` and expose `applyPreset()` so quality switches at runtime
- SCSS rebuilt as a small design system: design tokens, universal `:focus-visible` ring, `data-motion="reduced"` and `data-contrast="high"` themes, presentation-mode chrome dimming, and responsive adjustments for narrow viewports
- Info panel now uses semantic `<h1>` plus meta and credit lines, with `aria-live="polite"` for artwork change announcements

### Fixed

- Navigation slide-in animation is suppressed in reduced-motion mode so users no longer see large positional swings on artwork change
- Spotlight subtle animation freezes when reduced motion is active, avoiding ambient motion during inspection

## v0.01 - 2026-05-17

### Added

- shared texture sizing helper for consistent image fitting
- documentation baseline files: plan, changelog, findings, and documentation rules
- dynamic zoom and pan safety calculations based on artwork size and camera framing
- touch panning while zoomed in

### Changed

- main artwork zoom now stops before the camera can move unrealistically through the artwork plane
- pan limits now respond to artwork aspect ratio, viewport size, and zoom level
- hover rotation remains available across zoom levels with reduced intensity during close inspection
- side preview panels now preserve artwork aspect ratio instead of stretching
- README now documents controls and repository documentation expectations

### Fixed

- users could previously zoom so deep that the view could move into invalid inspection space
- portrait artworks previously hit vertical inspection limits too early because pan limits were hardcoded
- inactive side preview artworks were stretched by fixed panel geometry

## v0.00 - 2026-05-17

### Added

- one-click root launcher for local customer preview
- committed `customer-preview/` static output
- separate Vite `app.html` development entry
- local preview build pipeline and preview HTML generator
- offline-safe embedded placeholder artworks and procedural normal texture

### Fixed

- blank screen when opening the downloaded repository locally via `index.html`
