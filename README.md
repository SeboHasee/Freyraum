# Freyraum
> Last full markdown audit: 2026-05-21 (v0.20.7 — full technical audit + gap-closure coding plan).

## v0.20.7 — Full technical audit + gap-closure coding plan (docs-only, 2026-05-21)

A full line-by-line code audit of all v0.20 audio and control source files was completed. All v0.20.5 blocking regressions (state corruption, wrong volume mapping, startup-muted, wrong control placement) are **confirmed resolved** in the current codebase. Ten quality/robustness improvement findings (F-01 through F-10) with TypeScript/SCSS code patches are recorded in `plan.md § v0.20.7` and `FINDINGS.md § 2026-05-21 — v0.20.7 deep code audit`.

## v0.20.6 — Audio stabilization + UI polish (implemented, 2026-05-21)

Latest pass addressed the current customer-reported runtime/audio polish issues:

1. audio no longer dips/cuts during routine settings changes caused by redundant play restarts,
2. autoplay-blocked states now retry on first user interaction (including arrow-key navigation),
3. startup mute default remains unmuted,
4. top-right audio control sizing was tuned to better match fullscreen/settings controls,
5. keyboard focus on nav arrow buttons no longer shows the dark circular artifact.

Details: `plan.md § v0.20.6`, `FINDINGS.md § 2026-05-21 — v0.20.6 implementation findings`.

## v0.20.5 — Audio regression audit (2026-05-21, substantially resolved)

Current status: **substantially resolved** as of v0.20.7 code audit. The blocking regressions documented here were addressed across v0.20.6 and the corrected `volumeMapping.ts` linear mapping implementation. See `plan.md § v0.20.7` and `FINDINGS.md § 2026-05-21 — v0.20.7 deep code audit` for the confirmed-correct list and remaining minor gaps (F-01 through F-10).

## v0.20.3 — Technical planning hardening pass (2026-05-20, planning only)

Current status: **implemented in v0.20.4**.

Canonical plan: `plan.md § v0.20.2`  
Research and code-audit notes: `FINDINGS.md § 2026-05-20 (v0.20.2 planning audit)`

## v0.20 — Audio playback fix + main-page controls + sidecar cache-bust (2026-05-20)

Three bugs fixed in v0.20:

1. **Audio not playing (CORS block):** Removed `crossOrigin = 'anonymous'` from `BackgroundAudioManager`. Chromium-family browsers assign `null` origin to `file://` pages, causing all audio element CORS requests to fail. Audio now loads and plays correctly.
2. **Main-page audio controls:** v0.20 added a glass-pill `AudioControls` widget for quick mute/unmute and volume access. The originally shipped bottom-left placement is now under follow-up in `v0.20.5` because that location has been reported as wrong.
3. **Sidecar text stale after re-import:** Importer now stamps `?t=<timestamp>` on script src tags in `app.html` after every run, bypassing Chromium's file:// disk cache.

Current runtime status: **fully implemented**. Importer support, `file://` playback fix, volume mapping, state model, and control placement are all correct and confirmed by the v0.20.7 code audit.

Implementation details: `plan.md § v0.20` | Research: `FINDINGS.md § 2026-05-20 (v0.20)`

## v0.20.1 — Full markdown audit and sync (docs-only, 2026-05-20)

- Ran a full markdown consistency check across all repository `.md` files.
- Updated every markdown file with a shared audit stamp and refreshed top-level status notes.
- Revalidated baseline health during audit: `npm install`, `npm run lint`, `npm run build`.
- Recorded findings and release notes in `FINDINGS.md` and `CHANGELOG.md`.

## v0.19 — Calm background music workflow (implemented, 2026-05-20)

Customer-managed background audio is now integrated into the one-click `Update Gallery` workflow, with deterministic importer payloads, runtime compatibility selection, mute/volume controls, and lifecycle-aware playback handling.

Current runtime status: **fully implemented**. The preferences/audio payload architecture, startup loudness, mute recovery, slider sync, and control placement are all correct and confirmed by the v0.20.7 code audit.

Implementation details: `plan.md § v0.19`
Research/notes: `FINDINGS.md § 2026-05-20 (v0.19 implementation)`

## v0.18 — Customer painting text sidecars (shipped, 2026-05-20)

The v0.18 sidecar-text workflow is implemented and live in
`scripts/import-artworks.mjs`. Each painting in `customer-artworks/inbox/`
can now carry a same-basename `.txt` sidecar that the importer parses
and merges into the gallery info panel.

**Plan:** `plan.md § v0.18` — final audited implementation plan.
**Research log:** `FINDINGS.md § 2026-05-20`
**Customer guide:** `docs/CUSTOMER_TEXT_GUIDE.md` (how to import text)
**Template:** `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`

What v0.18 ships:

- Same-basename `.txt` sidecars are parsed (`.md` accepted as a backup); `.txt` wins when both exist.
- BOM-safe UTF-8 reader; Windows / classic Mac line endings normalized; case-insensitive stem matching.
- Customer-facing fields merged: `title`, `subtitle`, `description`, `year`, `medium`, `alt`, `credit`, `tags`, `surfaceProfile`.
- Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned.
- Plain-language report (`customer-artworks/last-import-report.txt`) gains sections: `Text applied`, `Pictures missing text`, `Text files without matching pictures`, `Text fields needing attention`, `Duplicate text files`.
- Missing or invalid sidecars never fail the run; they surface as warnings only.

No `src/` runtime changes, no new dependencies.

A premium interactive digital museum installation built by a high-end creative technology studio.


## Current status — v0.17 easy wins shipped (2026-05-20)

**Latest pass:** implemented three accessibility fixes and removed dead code based on the 2026-05-19 deep audit and online research.

What v0.17 ships:

- **PreferencesPanel ARIA fixes.** Added `aria-modal="true"` (WCAG 4.1.2), replaced `aria-label` with `aria-labelledby` pointing to the panel heading, and returned focus to the trigger on outside-click dismiss. Screen readers now correctly identify the dialog title and treat background content as inert while the panel is open.
- **Legacy interaction cleanup.** Removed `MouseInteraction.ts`, `TouchInteraction.ts`, and `ZoomPan.ts` — three files superseded by `CanvasInteraction.ts` in v0.11 with no remaining production imports.
- **Deprecated API removal.** Removed `isMobileDevice()` from `src/utils/performance.ts`. It had no callers; `detectDeviceCapabilities()` is the correct replacement.

Validation for v0.17:

- `npm run lint` ✅
- `npm run build` ✅
- `customer-preview/` rebuilt.

Remaining items documented in `plan.md` (v0.17 section): ESLint v8 → v9 upgrade, Vite v5 → v6 for audit advisories, PreferencesPanel in-place DOM refactor.



**Latest pass:** a documentation-only deep audit reviewed the full repository structure, runtime architecture, validation workflow, dependency health, diagnostics surface, customer docs, and new AI context-engineering files.

Audit highlights:

- **Runtime still validates.** `npm install`, `npm run lint`, `npm run build`, and focused script syntax checks pass.
- **Dependency risk documented.** `npm audit` currently reports two moderate dev-server advisories in the Vite/esbuild chain; the available automated fix jumps to a semver-major Vite release, so it is reserved for a dedicated upgrade pass.
- **Tooling drift documented.** The floating TypeScript range installed TypeScript 5.9.x, which triggers the current `@typescript-eslint` v7 supported-version warning during lint; this is now recorded as a maintenance risk, not a runtime regression.
- **Online research captured.** The audit revalidated `requestIdleCallback`, Long Tasks API, Page Lifecycle `freeze`/`resume`, three.js `compileAsync`, typescript-eslint support, and ESLint v8 EOL status in `FINDINGS.md`.
- **All Markdown files refreshed.** Cross-links, stale planned wording, AI workflow guidance, developer handoff notes, and customer image-maintenance docs now point to the current architecture and audit findings.

## Current runtime status — v0.16.2 control-shell follow-up fix implemented (2026-05-19)

**Current build:** v0.16.2 completes the settings/nav regression fix with a stronger control-shell approach:

- **Settings gear verified working.** The preferences panel now opens in the built preview, and the gear button uses a slightly larger transparent shell around the visible 44px glass circle so the control no longer feels clipped at the edge.
- **Center nav hover clipping eliminated more robustly.** The left/right center buttons now use a larger transparent outer shell with the visual glass circle drawn on `::before`, so hover scale has breathing room instead of being raster-clipped at the button edge.

What changed in code:

- `src/styles/main.scss`: kept `.prefs` and `.nav-controls` out of paint containment, then upgraded `.prefs__trigger` and `.nav-btn` to shell-based controls with inset glass-circle pseudo-elements.
- `customer-preview/style.css`: rebuilt so the shipped local preview matches the source fix.

Validation for v0.16.2:

- `npm run lint` ✅
- `npm run build` ✅
- Headless Chromium + SwiftShader verification ✅
  - `.prefs__trigger` click toggles `aria-expanded` from `false` → `true`
  - `.prefs__panel.hidden` changes from `true` → `false`
  - rebuilt preview loads the real gallery UI (not fallback)

All repository markdown files were updated for this follow-up fix.

## AI context engineering workflow

Repository guidance for future autonomous agent work now lives in:

- `.github/copilot-instructions.md`
- `.github/prompts/architecture.prompt.md`
- `.github/prompts/refactor.prompt.md`
- `.github/prompts/review.prompt.md`
- `.github/prompts/autonomous-agent.prompt.md`
- `AI_RULES.md`
- `ARCHITECTURE_MAP.md`
- `LESSONS_LEARNED.md`
- `docs/architecture/README.md`
- `docs/ai-feedback/AI_FEEDBACK_LOOP.md`
- `docs/standards/CODING_GUIDELINES.md`
- `docs/lessons-learned/README.md`

Use these files with `DOCUMENTATION_RULES.md`, `plan.md`, `FINDINGS.md`, and `CHANGELOG.md` before planning or implementing meaningful changes.

Recommended order:

1. Architecture analysis: `ARCHITECTURE_MAP.md` → `docs/architecture/README.md`.
2. Coding or refactor work: `AI_RULES.md` → `docs/standards/CODING_GUIDELINES.md` → the relevant prompt in `.github/prompts/`.
3. Review or audit work: `docs/ai-feedback/AI_FEEDBACK_LOOP.md` → `FINDINGS.md` → `LESSONS_LEARNED.md`.

## Current status — v0.16 deep performance and compatibility pass implemented (2026-05-19)

**Current build:** v0.16 is implemented on top of v0.15.1. Every actionable finding from the v0.16 audit is now in the runtime. No FREYRAUM fidelity surface (painting material, raking-light inspection, motion behaviour, reduced-motion rules, quality presets) is changed.

What v0.16 actually ships:

- **Unified resize coordinator.** `window.resize` listeners removed from `SceneManager` and `PostProcessing`; new `SceneManager.updateAspect(w,h)` and `PostProcessing.resize(w,h)` are driven from `main.ts`, which debounces (120 ms) and batches all DOM reads + GPU writes inside one `requestAnimationFrame`. No more forced layout thrash on mobile orientation changes.
- **Page Visibility + Page Lifecycle suspension.** The render path is gated by a `pageInactive` flag that responds to `visibilitychange`, `freeze`, and `resume`. The frame budget catch-up spike on resume is suppressed so adaptive quality never downgrades from a backgrounded tab.
- **Shader pre-warm.** `RendererManager.prewarm()` calls three.js's `compileAsync()` (or falls back to `compile()`) after boot and after every deferred preset apply. First interactions no longer pay a JIT compile cost.
- **Idle-scheduled preference apply.** `applyPreferences()` runs in `requestIdleCallback` (with `setTimeout(0)` fallback) after the first synchronous boot apply; repeated preference changes coalesce.
- **Anisotropy no-op guard.** `TextureManager.setAnisotropyDivisor()` short-circuits when the divisor is unchanged; no more wasted GPU re-uploads on preset re-apply.
- **Runtime renderer diagnostics.** `RendererManager.getRendererSnapshot()` exposes `renderer.info`; `main.ts` logs a `[renderer] snapshot` every 5 s in info/verbose mode. Customer bug reports now embed GPU resource history.
- **Progressive startup hints.** `suggestStartupQuality()` now also consults `navigator.deviceMemory` (≤ 0.5 GB → battery) and `navigator.hardwareConcurrency` (≤ 2 cores → battery), but only as hints — missing values fall through to the prior viewport heuristic.
- **Debug-only Long Tasks observer.** `PerformanceObserver({type:'longtask'})` logs tasks ≥ 50 ms as `[perf][warn] long-task` when diagnostics is in info/verbose mode.
- **CSS quality + containment.** `:root[data-quality='battery']` halves `--glass-blur` from 26 px to 12 px. `@supports not (backdrop-filter)` falls back to a solid surface. Fixed-position chrome surfaces use containment for paint/layout isolation, and the loading spinner uses `contain: strict`. `RendererManager.applyPreset()` writes the current preset id to `:root` so SCSS can react without a JS round-trip. *(v0.16.1 refines containment scope by excluding `.prefs` and `.nav-controls` to prevent clipping regressions.)*
- **Importer GPU memory warnings.** `scripts/import-artworks.mjs` warns the customer when any image exceeds 4096 px on a side or its GPU footprint (RGBA8 with mip pyramid) exceeds 64 MB (notice) or 128 MB (strong warning).
- **Dispose idempotency.** `RendererManager.dispose()` and `CanvasInteraction.dispose()` ignore a second call so the boot path can race a context-loss shutdown with `beforeunload` without leaking listeners.

Validation for v0.16:

- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅ (`tsc` clean; preview bundles regenerated)
- Importer syntax check ✅

See [`plan.md § v0.16 implementation summary`](./plan.md#v016--deep-performance-and-compatibility-optimization-2026-05-19-implemented) and [`FINDINGS.md`](./FINDINGS.md) for the implementation matrix, deferred items with rationale, and the device compatibility matrix.

## Previous status — v0.15 elegant animation system implemented (2026-05-19)

v0.14.2 zoom/pan tuning is preserved unchanged. v0.15 ships a museum-elegant motion system on top of v0.14.2:

- **frame-rate-independent smoothing**: new `smoothDamp(current, target, lambda, dt)` in `src/utils/math.ts`; all 13 prior per-frame lerps in `GalleryManager.update()` converted to lambda-based smoothing (+1 new line for the new `position.z` recession). Motion timing is now identical on 60 Hz, 90 Hz, 120 Hz, and 30 Hz screens;
- **witnessable artwork entrances**: navigation seeds retuned (`position.x` ±3.2 → ±4.5, `rotation.y` ±0.32 rad → ±0.15 rad, `scale` 0.84 → 0.88, new `position.z` = -0.6 depth recession), settling over ~1200 ms with λ=2.5;
- **fixed `InfoPanel` flicker**: content swap delay raised from 200 ms to 520 ms with an extra `requestAnimationFrame` before fade-in;
- **semantic SCSS motion tokens**: `--ease-gallery-out`, `--ease-gallery-in-out`, `--dur-control`, `--dur-content`, `--dur-panel`, `--dur-timeline`, `--dur-reveal`; backward-compatible aliases for the old names; museum-overshoot easing (`--ease-spring`) preserved but no longer used on gallery surfaces;
- **calmer reveals**: `.loading-overlay` fade extended to 0.9 s, removal timeout raised to 950 ms; spinner slowed from 0.8 s to 1.4 s per rotation;
- **reduced motion preserved**: both `[data-motion='reduced']` and `@media (prefers-reduced-motion: reduce)` paths remain authoritative.
- **v0.15.1 fidelity safeguard**: reduced motion no longer affects picture
  texture/shader quality; quality remains controlled only by the selected
  quality preset.

Outcome:

- artworks now arrive into the frame deliberately enough to be felt as a state change rather than a jump cut;
- the same wall-clock timing applies regardless of display refresh rate;
- info-panel text never flickers through a half-faded panel;
- prefs panel and timeline thumb no longer overshoot their landings.

Validation for v0.15:

- `npm run lint` ✅
- `npm run build` ✅ (`tsc` clean; preview bundles regenerated)

See [`plan.md`](./plan.md#v015--implemented-elegant-animation-system-2026-05-19) and [`FINDINGS.md`](./FINDINGS.md#2026-05-19--v015-implementation-pass-elegant-longer-animations) for full technical details.

## Previous planning pass — v0.15 final technical animation audit (2026-05-19)

**Current planning pass:** v0.15 has been implemented (see status block above). The historical audit narrative is preserved here for reference.

The next planned enhancement is a smoother, longer, more elegant motion system for the gallery. The final documentation pass re-verified the plan against the current source tree, repository findings, and current web animation/accessibility/performance guidance. It targets:

- semantic motion tokens for the modern art-gallery style;
- frame-rate-independent WebGL camera/artwork smoothing;
- artwork navigation transitions long enough to witness;
- calmer info-panel, timeline, preferences, loading, and reset motion;
- preserved `prefers-reduced-motion` / in-app reduced-motion behavior;
- diagnostics and QA checks for motion timing and frame budget.

Key technical findings already documented for the future implementation:

- all 13 `GalleryManager.update()` smoothing lines are currently frame-rate-dependent;
- `InfoPanel.ts` swaps content too early (`200ms`) relative to the current CSS transition (`320ms`);
- current `--ease-spring` overshoots and is too playful for the museum aesthetic;
- the future pass should add semantic duration/easing tokens and keep reduced-motion as a hard boundary.

See [`plan.md`](./plan.md) and [`FINDINGS.md`](./FINDINGS.md) for the full technical brainstorm, audit math, and source validation.

## Current runtime status — v0.14.2 implemented (2026-05-19)

**Current build:** v0.14.2 is implemented.

v0.14 / v0.14.2 runtime changes (in `src/gallery/GalleryManager.ts`):

- deeper close inspection: `MIN_CAMERA_Z` `0.5 → 0.2` and `MIN_VISIBLE_ARTWORK_FRACTION` `0.28 → 0.12`;
- tighter pan edge freedom: `INSPECTION_OVERSCROLL` `3.0 → 1.2`;
- follow-up axis split: `INSPECTION_OVERSCROLL_X = 1.2` and `INSPECTION_OVERSCROLL_Y = 0.6` (top/bottom now more restrictive, left/right unchanged);
- portrait-aware reset-fit boost: new `PORTRAIT_ASPECT_THRESHOLD = 0.65` and `PORTRAIT_RESET_EXTRA_Z = 1.5`, applied additively in `getResetFitZoom()`;
- richer diagnostics in `show-artwork-complete`: `closeZoomMinVisibleFraction`, `panOverscrollX`, `panOverscrollY`, `panLimitAtReset`, `portraitResetApplied`, `portraitResetExtra`.

Outcome:

- users can zoom closer for fine-detail inspection on medium/large artworks;
- pan feels more controlled near reset view while still reaching edges at close zoom, with extra vertical restriction in v0.14.2;
- large vertical artworks open farther away in reset/default view without pushing landscape/square artworks away.

Validation for v0.14:

- `npm run lint` ✅
- `npm run build` ✅

See [`plan.md`](./plan.md#v014--implemented-deeper-close-zoom-tighter-edge-limits-portrait-aware-reset-fit-2026-05-19) and [`FINDINGS.md`](./FINDINGS.md#2026-05-19--v014-implementation-pass-deeper-close-zoom-tighter-pan-edges-portrait-reset-fit-boost) for full technical details.

## Previous pass — v0.12 zoom and framing

## One-click local customer preview

Double-click the root `index.html` file.

It opens the committed static customer preview at:

```text
customer-preview/app.html
```

This path is designed to work locally without running a development server.

The customer preview is built as a classic browser script, not a Vite module entry, so it can run from `file://` when opened by double-clicking.

> Note: v0.01 ships final local optimized artwork assets generated by a metadata-driven SVG pipeline so the customer preview opens offline. The metadata model (`id`, `year`, `medium`, `dimensions`, `alt`, `credit`, `tags`) is the same contract that a future CMS would deliver.

## Adding your own pictures

**v0.07 implemented (2026-05-17).** A non-technical customer can manage the
gallery by dragging any number of images, in any aspect ratio, into one folder
and double-clicking one button. No code editing, no terminal.

Customer guide: [`docs/CUSTOMER_PICTURE_GUIDE.md`](./docs/CUSTOMER_PICTURE_GUIDE.md)

Maintainer guide: [`docs/IMAGE_MAINTENANCE_GUIDE.md`](./docs/IMAGE_MAINTENANCE_GUIDE.md)

Quick workflow:

1. Put image files into `customer-artworks/inbox/`.
   - Best: JPG, PNG, WebP, GIF, SVG, AVIF.
   - Risky (warning, still copied): HEIC, HEIF, TIFF, BMP.
   - Skipped with a friendly message: camera RAW formats.
2. Double-click `Update Gallery` (`.command` on macOS, `.bat` on Windows).
   - A plain-language report opens automatically.
3. Double-click `index.html` to view the updated gallery.

Requirement: **Node.js LTS 18+** must be installed (older Node versions fail on
the ESM importer syntax).

Behind the scenes, `Update Gallery` now launches
`scripts/run-import-artworks.cjs`, which first checks Node.js major version and
then runs `scripts/import-artworks.mjs`. This avoids raw syntax-crash stacks on
older Node and writes a plain-language report instead. The launcher avoids
modern `node:` built-in module specifiers so even very old Node installations can
reach that friendly version-check message.

`scripts/import-artworks.mjs` reads each picture's pixel
dimensions, copies it to `customer-preview/images/`, and writes both
`customer-artworks/artworks.json` (human-readable manifest) and
`customer-preview/customer-artworks.js` (runtime injection consumed by the
gallery). The previous manifest is backed up to `artworks.json.bak` so a bad
import can be recovered manually. If the inbox is empty, the built-in demo
artworks load instead.

Current rendering follow-up: v0.10 is implemented for Hoch close-up spots,
parallax hole artifacts, and reset framing on very vertical pictures. The fix
keeps the real picture on stable UVs, makes parallax relief-only/subtler,
retunes Hoch shadow/specular values, and computes reset zoom from framed artwork
dimensions. See
[`plan.md`](./plan.md#v010-follow-up--parallax-hole-artifact-fix-implemented).

For the full architecture see
[`plan.md`](./plan.md#v007-plan--customer-managed-artwork-folder-and-one-click-importer).


## Responsive phones/tablets — v0.11 (Implemented)

**Implemented 2026-05-18.** Desktop web remains the primary visual design; v0.11 hardens the same codebase for phones and tablets without disrupting the desktop layout. The seven bugs documented in the planning pass are all addressed:

- `RendererManager.resize()` is called by a single debounced `resize`+`orientationchange` listener in `main.ts`.
- A unified `CanvasInteraction` class replaces the previous three interaction managers. It uses Pointer Events when available, with a non-passive Touch Events fallback for older Safari, and uses CSS `touch-action: none` to own canvas gestures so iOS Safari pinch no longer fights the in-app zoom.
- New `src/utils/device.ts` mirrors capability data (`data-layout-tier`, `data-pointer-primary`, `data-hover`, `data-orientation`, `data-short-height`) to `<html>` so SCSS reacts without re-running JS. `isMobileDevice()` is deprecated.
- `HintText` now reads `data-pointer-primary` and shows a coarse-pointer-appropriate German hint (or is hidden on small phones).
- `InfoPanel.setCompact()` enables a scrollable compact layout on phone-portrait/phone-small (WCAG 1.4.10 Reflow).
- Preferences panel uses a fluid `min()` width and `max-height` with internal scrolling so it never overflows the viewport.
- Every HTML entry has `viewport-fit=cover`; the SCSS chrome (topbar, info-panel, nav, zoom, fullscreen, prefs, timeline, hint, fallback) honours `env(safe-area-inset-*)` via shared `--safe-*` and `--chrome-*` tokens; the body uses `100dvh`.
- Mobile WebGL reliability: DPR is capped at 1.5 on coarse-pointer devices, a startup quality heuristic picks `battery` for high-DPR small phones (only on first run; user choice is otherwise respected), and `RendererManager` handles `webglcontextlost` / `webglcontextrestored` with diagnostics and a render pause.

See [`plan.md`](./plan.md#v011--implemented-2026-05-18) for the implementation summary and [`FINDINGS.md`](./FINDINGS.md#2026-05-18--v011-implementation-pass-responsive-phonestablets-touch-gestures-webgl-reliability) for technical details.

## Diagnostics and debugging

The preview now includes a centralized diagnostics system designed to be useful for future debugging without flooding normal customer sessions.

### Normal behavior

- Default console output is intentionally quiet.
- Only real warnings and errors are printed during normal use.
- Recent diagnostics are still kept in memory for later inspection.

### Enable deeper diagnostics

- `?debug=1` or `?debug=info` — readable subsystem logs
- `?debug=verbose` — deeper engineering logs

Examples:

```text
index.html?debug=1
customer-preview/app.html?debug=verbose
```

### DevTools diagnostics API

In the browser console:

```js
window.__FREYRAUM_DIAGNOSTICS__.getEntries();
window.__FREYRAUM_DIAGNOSTICS__.snapshot();
window.__FREYRAUM_DIAGNOSTICS__.print('info');
window.__FREYRAUM_DIAGNOSTICS__.setMode('verbose');
window.__FREYRAUM_DIAGNOSTICS__.summarize();
window.__FREYRAUM_DIAGNOSTICS__.exportJson();
```

The diagnostics system currently records boot events, renderer/backend probe status, preference/storage issues, texture fallbacks, gallery navigation/load state, adaptive quality downgrades, and uncaught runtime errors.


## Current interaction behavior

- mouse wheel / pinch: zoom with dynamic safety limits
- mouse drag / one-finger touch while zoomed: pan within artwork bounds
- mouse move: subtle artwork hover reaction at every zoom level (suppressed on coarse-pointer devices)
- left/right arrows and side previews: navigate artworks
- touch swipe when not zoomed in: navigate artworks (activates on release, WCAG SC 2.5.2)
- on-screen Zoom controls: zoom in, zoom out, reset view
- `+` / `-` keys: zoom in / out · `0` or `R`: reset view · `F`: toggle fullscreen
- on-screen Fullscreen button or `F` key: enter / exit presentation mode
- Settings (gear) button: toggle reduced motion, high contrast, and choose a quality preset (high / balanced / battery); persisted in `localStorage`
- Timeline thumbnails: real keyboard-accessible buttons with roving tabindex (Arrow / Home / End / Enter / Space)
- WebGL is required; if unavailable a localized fallback screen is shown (with an extra private-browsing tip on touch devices)
- Mobile WebGL context loss is handled automatically: rendering pauses on `webglcontextlost` and resumes on `webglcontextrestored`; events are logged via the diagnostics API


## v0.02 implementation

v0.02 is **implemented** in this branch. See [`plan.md`](./plan.md#v002-implementation-status-this-session) for the per-slice status table, [`CHANGELOG.md`](./CHANGELOG.md) for the full list of additions, and [`FINDINGS.md`](./FINDINGS.md#2026-05-17---v002-implementation-findings) for implementation notes.

Final scope (all shipped except where noted):

- ✅ New `PaintingMaterial` class extending `MeshPhysicalMaterial` — native Three.js features for albedo / base normal / roughness / specular / AO, with minimal `onBeforeCompile` injection for tangent-space detail-normal blending, bump-after-normalMap, and a grazing-light boost
- ✅ `ProceduralTextureFactory` generates deterministic fallback maps (canvas weave, detail weave, brush relief, roughness, specular with Gaussian varnish blobs, AO) keyed by `artwork.id`
- ✅ `LightProfile` system in `LightingSetup` with four named profiles: `gallery-soft` (default, animated), `raking-inspection`, `museum-neutral` (5500 K dual-key), `dramatic-demo`
- ✅ `QualityPreset` extended with `shaderVariant`, `normalStrength`, `detailNormalStrength`, `bumpStrength`, `specularStrength`, `anisotropyDivisor`, `aoEnabled`, `grazingBoostEnabled`, `detailNormalEnabled`
- ✅ `FrameBudgetMonitor` with rolling 60-frame window, EMA, and navigation/preset cooldowns
- ✅ `AdaptiveQualityController` — one-way `high → balanced → battery` downgrade with hold-off and automatic suspension on manual preset change
- ✅ Experimental WebGPU probe behind explicit opt-in (`?backend=webgpu` or `localStorage.freyraum.backend = 'webgpu'`), loaded from the separate runtime module `public/webgpu-probe.js` so it stays out of the main `file://` IIFE preview bundle
- ✅ Aspect-ratio-aware detail-normal tiling so portrait, square, landscape, and ultrawide artworks all show square canvas weave at uniform physical density
- ✅ Async artwork-load race protection via `artworkLoadToken` in `GalleryManager`
- ✅ Quality preset switches rebuild the currently visible artwork immediately, so `battery` mode actually removes optional map work on the active painting without requiring navigation
- ⏸ Real authored asset integration is deferred until scanned/painted assets are provided. The `Artwork.textureSet?` field is in place and requires no code changes to consume authored maps.
- Performance targets: 60 FPS on mid-range discrete GPUs (balanced preset), 25 FPS minimum on old integrated GPUs (battery preset)

## v0.03 implementation

v0.03 is **implemented** in this branch. See [`plan.md`](./plan.md#v003-implementation-outcome) for the as-built outcome (including issues found and fixed during implementation), [`CHANGELOG.md`](./CHANGELOG.md) for the full list of additions, and [`FINDINGS.md`](./FINDINGS.md#2026-05-17---v003-implementation-findings) for the technical notes. A fresh-clone revalidation audit on 2026-05-17 reconfirmed that after `npm install`, both `npm run lint` and `npm run build` still pass for the shipped v0.03 branch.

Shipped system direction:

- the original artwork image stays the immutable albedo content; `?debug=1` + the `a` key now toggle an albedo-only render so reviewers can verify shader fidelity at any time;
- `SurfaceProfile` / `SurfacePhysics` types + optional `surfaceProfile?` / `surfacePhysics?` on every `Artwork` (no breaking change to existing entries);
- `PaintingMaterial` constructor defaults retuned for matte-first: `clearcoat: 0`, `specularIntensity: 0.3`, `uLightGrazingBoost: 0.25`;
- `ProceduralTextureFactory.generate(id, role, tileSize)` parametrised; cache keyed by tileSize; preset-driven tile sizes (high `1024`, balanced `512`, battery `256`);
- tangent-space steep parallax UV offset injected before `map_fragment`, gated by `PAINTING_USE_PARALLAX` (high preset, 12 march iterations); when active, bump perturbation is disabled so the same height field is not double-counted;
- short direct-light self-shadow march modulating `directDiffuse`/`directSpecular` only (never albedo), gated by `PAINTING_USE_SELFSHADOW` (high preset, 8 march iterations); driven by a `uKeyLightDir` view-space uniform updated from `LightingSetup.getKeyLightWorldDir()` each frame;
- `gallery-soft` key repositioned to `{x:-3,y:5,z:4}` (~45° from vertical) — flattering museum default that still reveals surface relief during pan/zoom;
- `raking-inspection` key at strictly horizontal `{x:-6,y:0,z:1.5}` with ambient `0.3` — maximum surface-reveal contrast;
- explicit shared `SpotLight.target` anchored at world origin, added to the scene (closes a latent bug introduced by the closer key positions);
- new "Beleuchtung" radio group in `PreferencesPanel` lets the visitor switch between the four lighting profiles; the choice is persisted to localStorage and mirrored to `data-lighting` on `<html>`;
- `PAN_SAFETY_FACTOR=0.92` replaced with `INSPECTION_OVERSCROLL=0.5` so every artwork edge and corner is reachable at close zoom.

## v0.04 implementation

v0.04 is **implemented** in this branch. See [`plan.md`](./plan.md#v004-implementation-outcome) for the as-built outcome and [`FINDINGS.md`](./FINDINGS.md#2026-05-17---v004-implementation-findings) for implementation notes.

Shipped material-quality improvements:

- procedural AO no longer creates fake radial darkening at the artwork edges;
- procedural normal, height, and roughness maps now use deterministic value noise instead of visible `sin/cos` checkerboard and cross-hatch patterns;
- high preset now has preset-gated clearcoat support for subtle satin/varnish response;
- `PaintingTextureSet` supports a future authored `varnish` map role;
- all built-in artworks define a `surfaceProfile`; `tokyo-passage` uses `satin-canvas`, the others use `matte-canvas`;
- the info panel now shows a user-friendly German surface label such as `Matte Leinwand` or `Satinierte Leinwand`;
- high-preset parallax/self-shadow now always receives a fallback height map when needed;
- the committed `customer-preview/` bundle was regenerated for the one-click `file://` workflow.

Validation: `npm run lint` and `npm run build` pass after `npm install`. The only output is the known TypeScript parser version warning and Dart Sass legacy JS API deprecation warning.

## v0.06 status — implemented

v0.06 (Streifenlicht blockiness reduction) is **shipped**. Three vertical slices targeted the visible blockiness under `raking-inspection` at steep angles:

- **S2 — Procedural texture anisotropy.** Procedural `DataTexture` maps now carry the same per-preset anisotropy cap as authored textures (`TextureManager.getEffectiveAnisotropy()`), so they no longer alias into coarse mips at steep view angles.
- **S3 — Inspection-only relief-map resolution uplift.** Under `raking-inspection` on the high preset, the geometry-carrying procedural maps (`normal`, `detailNormal`, `height`) are generated at `proceduralInspectionTileSize = 2048` instead of the gallery `proceduralTileSize = 1024`. Balanced/battery presets opt out (`proceduralInspectionTileSize = 0`).
- **S4 — Lateral self-shadow PCF filter (inspection-only).** A new `#define PAINTING_USE_SHADOW_FILTER` GLSL path adds two perpendicular companion rays to the existing self-shadow march. Activated only when the active light profile's `displayIntent === 'inspection'`. Gallery profiles pay zero extra cost (the define is absent).

The 3-ray average preserves the v0.05 darkening envelope (max 4.2 % gallery / 8.4 % inspection) because each ray is clamped to `uShadowMaxOcclusion` before averaging. Bundle size moved from ~552 KB to ~562 KB (gzip 143 KB).

See [`plan.md`](./plan.md#v006-plan--streifenlicht-blockiness-reduction-procedural-anisotropy-inspection-resolution-uplift-and-shadow-pcf-filter) for the full execution plan and the **v0.06 Implementation Outcome** subsection for as-built deviations, and the implementation entry in [`FINDINGS.md`](./FINDINGS.md#2026-05-17--v006-implemented-streifenlicht-blockiness-reduction).

### What you can verify in the running app

- Under `raking-inspection` on high preset: surface relief reads as smooth gradients without the previous lateral texel stripes; procedural maps remain sharp at maximum zoom.
- Under `gallery-soft`, `museum-neutral`, `dramatic-demo`: visually identical to v0.05 (no extra shader cost, no extra memory).
- Switching `balanced → high` while in inspection mode re-applies the anisotropy cap to both authored and procedural textures and triggers the inspection tile-size uplift.
- The `?debug=1` + `s` shadow-only overlay still renders correctly with the PCF filter active.

### Enhancement slots reserved for later

- **`ProceduralTextureFactory.pruneSizeBelow(threshold)`** to reclaim the 1024-resolution cache entries once an artwork has been inspected (today both sizes coexist in the cache).
- **Per-profile `LightProfile.shadowFilterRadius`** so future profiles can carry their own PCF radius rather than reading the active preset.

## v0.05 status — implemented

v0.05 (soft self-shadow filtering) is **shipped**. The binary height-field break loop in `PaintingMaterial.ts` is gone; the shader now accumulates a smooth occlusion value that is bias-deadzoned, distance-weighted, clamped to a max-occlusion cap, and per-profile scaled. Stain-like dark blobs on `gallery-soft` are removed; `raking-inspection` shows soft local relief gradients.

See [`plan.md`](./plan.md#v005-plan--soft-self-shadow-filtering-and-stain-artifact-removal) (status header at top of section) and the implementation entry in [`FINDINGS.md`](./FINDINGS.md#2026-05-17---v005-self-shadow-soft-filtering--implemented).

### What you can verify in the running app (v0.05)

- `gallery-soft`, `museum-neutral`, `dramatic-demo`: no moving dark blobs on any artwork.
- `raking-inspection`: soft surface gradients only.
- Append `?debug=1` to the preview URL and press **`s`** for a shadow-only greyscale overlay, or **`a`** for the albedo-only fidelity check.
- High preset only: balanced and battery have self-shadow disabled.

### v0.05 enhancement slots — superseded

- **3-ray PCF lateral filter** — shipped in v0.06 S4 (inspection-only).
- **Per-profile `shadowProfileScale` on `LightProfile`** — still derived from `displayIntent`; open for future.
- **Animated profile-scale fade** — still instant; open for future.
- **Authored height-map drop-in** — works today without any shader change.

## Developer workflow

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build the local customer preview:

```bash
npm run build
```

The build is split into smaller scripts for debugging:

```bash
npm run build:typecheck
npm run build:preview
npm run build:preview-html
```

Lint source files:

```bash
npm run lint
```

## Documentation

This repository now follows a documentation-first rule for future development.

- [`plan.md`](./plan.md) — current plan, implemented work, v0.01 vertical slices, and reserved future-pass scope
- [`CHANGELOG.md`](./CHANGELOG.md) — shipped changes by version/date
- [`FINDINGS.md`](./FINDINGS.md) — technical findings, caveats, and validation notes
- [`DOCUMENTATION_RULES.md`](./DOCUMENTATION_RULES.md) — required documentation process for future work
- [`docs/HANDOFF.md`](./docs/HANDOFF.md) — customer handoff guide with architecture diagram, controls reference, accessibility modes, quality preset matrix, screenshot procedure, and reviewer checklist
