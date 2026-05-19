# FINDINGS

## 2026-05-19 — v0.15 research pass: elegant longer animations

### Scope of this pass

Documented the next animation-enhancement plan. No runtime code was changed.

### Online research findings

- **Accessibility:** W3C WCAG 2.2 SC 2.3.3 requires interaction-triggered non-essential animation to be disableable. FREYRAUM already has a reduced-motion preference and should continue treating it as a hard implementation boundary.
- **System preference:** MDN documents `prefers-reduced-motion` as the standard browser-facing signal for users who request less motion. FREYRAUM already reads this through `PreferencesStore`.
- **Performance:** MDN and web.dev guidance continues to favor animating `transform` and `opacity`, using `requestAnimationFrame` for JavaScript/WebGL animation, and avoiding layout/paint-heavy animated properties.
- **Motion timing:** Current 2026 UI guidance supports short micro-interactions but allows longer 400–1300 ms transitions for larger state changes when they improve orientation and comprehension. This fits the request that FREYRAUM animations should be long enough to witness.

Source links recorded for the implementation pass:

- <https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html>
- <https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion>
- <https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame>
- <https://developer.mozilla.org/en-US/docs/Web/Performance/CSS_animation_performance>
- <https://web.dev/animations-guide/>

### Codebase findings

- `src/styles/main.scss` already centralizes CSS motion with `--dur-fast`, `--dur-base`, `--dur-slow`, `--ease-out`, and `--ease-spring`, but those tokens are too generic for a refined gallery-wide motion language.
- DOM transitions are already mostly on compositor-friendly properties (`opacity`, `transform`, `box-shadow`, `border-color`). Future implementation should avoid adding layout-affecting animation.
- `src/gallery/GalleryManager.ts` uses hard-coded per-frame smoothing constants in `update()` for artwork rotation/position/scale and camera zoom/pan. This makes perceived duration refresh-rate-dependent and difficult to tune consistently.
- Navigation currently seeds a lateral offset, yaw, and scale when reduced motion is off, then lets generic smoothing settle the artwork. This is the main place to make artwork changes visibly elegant and longer.
- `src/main.ts` already owns a `requestAnimationFrame` loop and `FrameBudgetMonitor`, so the implementation can add delta-time-aware motion without adding a new animation library.
- `src/lighting/LightingSetup.ts` already disables animated key-light drift when reduced motion is active. Ambient motion should remain very subtle.

### Recommended implementation boundaries

- Do not add a heavy animation dependency.
- Do not alter v0.14.2 zoom/pan limit constants as part of the animation pass unless QA proves motion retuning requires it.
- Convert WebGL motion to frame-rate-independent smoothing before retuning durations; changing only constants would be fragile.
- Add diagnostics for motion mode and intended navigation settle timing, but keep normal logs quiet.

### Validation status

- Documentation-only pass. No lint/build required.

---

## 2026-05-19 — v0.14.2 follow-up: tighter vertical pan limits

### Scope of this pass

Adjusted zoomed-in pan limits so top/bottom movement is more restrictive while preserving the already-approved left/right behavior.

### Code-level findings fixed

- **Issue:** vertical edge travel still felt too loose at close zoom.
- **Root cause:** `getPanLimits()` used one shared additive overscroll constant for both axes.
- **Fix:** split overscroll by axis in `src/gallery/GalleryManager.ts`:
  - `INSPECTION_OVERSCROLL_X = 1.2` (unchanged horizontal)
  - `INSPECTION_OVERSCROLL_Y = 0.6` (tighter vertical)
- **Diagnostics:** `show-artwork-complete` now emits `panOverscrollX` and `panOverscrollY`.

### Validation status

- `npm run lint` ✅
- `npm run build` ✅

---

## 2026-05-19 — importer runtime compatibility fix (Node version guard)

### Scope of this pass

Fixed a customer-facing updater failure where old Node.js versions crashed on ES module syntax in `scripts/import-artworks.mjs` before a useful report could be shown.

### Code-level findings fixed

- **Root cause:** `Update Gallery` launchers called `node scripts/import-artworks.mjs` directly. On old Node versions, parsing failed at `import { ... }` with `SyntaxError: Unexpected token {`.
- **Fix:** Added `scripts/run-import-artworks.cjs` as a CommonJS compatibility launcher. It can run on old Node, checks `process.versions.node`, requires major version 18+, and only then executes `import-artworks.mjs`.
- **Follow-up root cause:** the first launcher version used `require('node:child_process')`, which is unsupported in older Node versions. Those versions failed before the compatibility report could be written.
- **Follow-up fix:** changed the launcher to use legacy built-in module names (`child_process`, `fs`, `path`) and avoided newer helper APIs where unnecessary, so old Node runtimes reach the intended Node 18+ report path.
- **User-facing reliability improvement:** for unsupported Node versions, the launcher now writes `customer-artworks/last-import-report.txt` with a plain-language compatibility message, so the standard support/report path still works.
- **Launcher wiring:** `Update Gallery.command` and `Update Gallery.bat` now call `scripts/run-import-artworks.cjs`.

### Validation status

- `npm run lint` ✅
- `npm run build` ✅
- Manual launcher smoke test on supported Node: ✅

---

## 2026-05-19 — v0.14 implementation pass: deeper close zoom, tighter pan edges, portrait reset-fit boost

### Scope of this pass

Implemented the v0.14 technical plan in runtime code (`src/gallery/GalleryManager.ts`) and updated all repository markdown files. Preview bundle was regenerated.

### Code-level findings fixed

- **Close zoom floor was still effectively high on medium/large artworks.**
  Root cause: `getInspectionMinZoom()` floor was dominated by `MIN_VISIBLE_ARTWORK_FRACTION = 0.28` even when `MIN_CAMERA_Z = 0.5` looked permissive.
  Fix: `MIN_CAMERA_Z` lowered to `0.2` and `MIN_VISIBLE_ARTWORK_FRACTION` lowered to `0.12`.

- **Pan edge freedom felt too loose after v0.13.**
  Root cause: additive overscroll constant was `INSPECTION_OVERSCROLL = 3.0` in `getPanLimits()`.
  Fix: tightened to `INSPECTION_OVERSCROLL = 1.2`.

- **Large vertical artworks still opened too close in reset view.**
  Root cause: `getResetFitZoom()` used a global fit model where `DEFAULT_CAMERA_Z = 7` can dominate moderate portraits; margin-factor tuning alone cannot shift those cases.
  Fix: added portrait-aware additive headroom with `PORTRAIT_ASPECT_THRESHOLD = 0.65` and `PORTRAIT_RESET_EXTRA_Z = 1.5`; `getResetFitZoom()` now returns `baseFitZoom + PORTRAIT_RESET_EXTRA_Z` for portrait artworks.

- **Tuning state lacked explicit visibility in diagnostics.**
  Fix: `show-artwork-complete` now logs `closeZoomMinVisibleFraction`, `panOverscroll`, `panLimitAtReset`, `portraitResetApplied`, and `portraitResetExtra`.

### Validation status

- Baseline before changes: `npm run lint` ✅, `npm run build` ✅
- Final after implementation: `npm run lint` ✅, `npm run build` ✅
- Known warnings unchanged: TypeScript parser support warning and Sass legacy JS API deprecation warning.

---

## 2026-05-18 — v0.13 implementation pass: nav layout, zoom range, pan range, and icon centering

### Scope of this pass

Customer-reported regressions and UX gaps identified after the v0.12 zoom/framing/timeline implementation. Four distinct issues were audited and fixed. Runtime changes landed in `src/gallery/GalleryManager.ts` and `src/styles/main.scss`; `customer-preview/` was rebuilt.

### Code-level findings fixed

- **Nav controls overlapping the timeline (regression from v0.12 timeline-headroom change).**
  Root cause: `--chrome-bottom` was `max(168px, 148px+safe)` and `.nav-controls` used `bottom: var(--chrome-bottom)`. After the v0.12 timeline padding increase, the timeline's top edge moved to ≈177px from the viewport bottom, placing the nav buttons (bottom edge at 168px) 9px inside the timeline zone. Both elements shared `z-index: 100`; the timeline won the stacking context because it was appended later.
  Fix: `.nav-controls` now uses `bottom: calc(192px + var(--safe-bottom))`, giving 15px of clearance above the timeline's top edge. `--chrome-bottom` raised to `max(200px, 180px+safe)` so the zoom controls (which use `--chrome-bottom`) also clear the timeline, and the JS art-viewport fallback floor stays consistent.

- **Zoom range too narrow in both directions.**
  Root cause: `MIN_CAMERA_Z = 1.2` stopped close inspection too early; `MIN_OVERVIEW_CAMERA_Z = 10.75` and `OVERVIEW_HEADROOM_Z = 1.6` limited the far overview.
  Fix: `MIN_CAMERA_Z` → `0.5`, `MIN_OVERVIEW_CAMERA_Z` → `18.0`, `OVERVIEW_HEADROOM_Z` → `3.5`.

- **Pan limit too tight when zoomed in close.**
  Root cause: `INSPECTION_OVERSCROLL = 0.5` only allowed the viewport centre to reach 0.5 world units past the artwork edge, which feels cramped on narrow/elongated artworks at close zoom.
  Fix: `INSPECTION_OVERSCROLL` → `3.0`.

- **Gear icon and fullscreen icon not optically centred in their circular buttons.**
  Root cause: `.prefs__trigger-icon` and `.fullscreen-btn__icon` spans had no explicit CSS, so they used `display: inline`. Even inside a `display: flex` button, inline elements carry a fractional descender baseline offset that shifts the SVG slightly downward from the visual centre of the circle.
  Fix: Added explicit CSS rules for both icon spans with `display: flex; align-items: center; justify-content: center; line-height: 0; svg { display: block }`.

### Implementation outcome

- Nav controls sit clearly above the timeline with 15px of clearance.
- Zoom-out now allows stepping back to a camera distance of at least 18 world units (+ extra headroom beyond tall-artwork fit). Zoom-in allows detail inspection at camera distance 0.5.
- Pan limits extend 3.0 world units past the artwork edge in all four directions when zoomed close.
- Gear and fullscreen icons are precisely centred in their buttons on all browsers.

### Validation status

- Baseline before changes: `npm run lint` ✅, `npm run build` ✅
- Final after changes: `npm run lint` ✅, `npm run build` ✅
- Known warnings remain unchanged: TypeScript parser support warning and Sass legacy JS API deprecation warning.
- `customer-preview/freyraum-gallery.js` and `customer-preview/style.css` were regenerated.

---

## 2026-05-18 — v0.12 implementation pass: farther zoom-out, tall-picture fit, and unclipped timeline selection

### Scope of this pass

Implemented the v0.12 technical coding plan. Runtime changes landed in `src/gallery/GalleryManager.ts`, `src/main.ts`, `src/timeline/Timeline.ts`, and `src/styles/main.scss`; `customer-preview/` was rebuilt. This entry records what shipped, which audit findings are now fixed, and which diagnostics support future customer reports.

### Online validation result

The original v0.12 direction was confirmed, but the research materially improves the implementation detail:

1. use **measured art-safe viewport metrics**, not only raw camera aspect;
2. treat **`visualViewport` + `ResizeObserver`** as first-class re-fit signals;
3. combine **CSS scroll gutters (`scroll-padding` / `scroll-margin`) with manual centering** for the active timeline item;
4. respect **reduced-motion** in timeline auto-centering.

### Official / authoritative sources used in the validation

- MDN — VisualViewport API: <https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport>
- MDN — ResizeObserver: <https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver>
- MDN — `Element.scrollIntoView()`: <https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView>
- MDN — `scroll-padding`: <https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding>
- MDN — `scroll-margin`: <https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin>
- web.dev — large, small, and dynamic viewport units: <https://web.dev/blog/viewport-units>
- WCAG 2.1 Reflow: <https://www.w3.org/WAI/WCAG21/Understanding/reflow.html>
- WCAG 2.2 Target Size: <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html>

### Code-level findings fixed

- **`GalleryManager` reset framing and far overview zoom are now separated.** `MAX_CAMERA_Z = 9.25` was replaced by explicit `ZoomBounds` with `minInspectionZoom`, `resetFitZoom`, and `maxOverviewZoom`.
- **Reset, min, pan, hover, and diagnostics now share measured art-safe viewport math.** `ArtworkViewportMetrics` records viewport size, usable size, usable fractions, effective aspect, and top/right/bottom/left occlusion.
- **`main.ts` now injects an art-viewport provider into `GalleryManager`.** It measures `visualViewport` when available, falls back to `window.innerWidth/innerHeight`, reads fixed chrome geometry, and wires `window`, `visualViewport`, and `ResizeObserver` change signals into refit handling.
- **Timeline clipping is fixed structurally.** `.timeline__list` now reserves active-thumb headroom and scroll gutters; `.timeline__item` / `.timeline__thumb` expose scroll margins.
- **`Timeline.ts` now has dedicated transform-aware centering.** It stores the list element, centers the transformed active thumb with `getBoundingClientRect()`, adds `aria-current`, and only logs centering diagnostics outside default mode.
- **Timeline auto-centering now respects reduced motion.** It uses `auto` scroll behavior when `<html data-motion="reduced">` or `prefers-reduced-motion: reduce` is active.

### Implementation outcome

- Very tall artworks compute reset fit against the usable artwork viewport, not the full camera viewport.
- Users can zoom out beyond reset fit because `maxOverviewZoom` is at least `10.75` and at least `1.6` camera units beyond the computed reset distance.
- Close inspection is preserved because `handleViewportMetricsChanged()` only auto-refits when the user was already near reset; otherwise it clamps and preserves intent.
- The active timeline thumb remains visually lifted but has enough scroll-container headroom to avoid clipping.
- Keyboard focus and programmatic selection both keep timeline thumbnails visible near the center of the strip.

### Validation status

- Baseline before changes: `npm run lint` and `npm run build` passed.
- Final after changes: `npm run lint` and `npm run build` passed.
- Known warnings remain unchanged: TypeScript parser support warning and Sass legacy JS API deprecation warning.
- `customer-preview/freyraum-gallery.js` and `customer-preview/style.css` were regenerated.

### Diagnostics surface added

| Scope | Event | Level | Trigger |
| --- | --- | --- | --- |
| `gallery` | `show-artwork-complete` | `info` | Now includes reset/min/max zoom, overview headroom, usable viewport size/fractions, and viewport occlusion |
| `gallery` | `viewport-refit` | `info` | `GalleryManager.handleViewportMetricsChanged()` recomputes bounds after viewport/chrome changes |
| `layout` | `art-viewport` | `info` | `main.ts` measures the art-safe viewport during resize/visualViewport/ResizeObserver changes |
| `timeline` | `center-active` | `debug` | Non-default diagnostics mode only; records active thumbnail centering delta and scroll behavior |

---

## 2026-05-18 — v0.11 implementation pass (responsive phones/tablets, touch, gestures, WebGL reliability)

### Scope of this pass

The v0.11 technical coding plan has been executed. This entry records what shipped, the runtime behaviour now in place, and the constraints that remain for future passes. All bug references map to the seven bugs catalogued below in the previous (planning) entry.

### Implementation outcome

- **`src/utils/device.ts`** introduces a capability-based device model with `LayoutTier`, `PointerPrimary`, `Orientation`, and `DeviceCapabilities`. `applyDeviceCaps()` mirrors these to `<html>` data attributes so SCSS can react without re-running JS. Used by the resize coordinator in `main.ts`, by `HintText`, by `CanvasInteraction`, and by the new compact `InfoPanel` mode.
- **`src/interaction/CanvasInteraction.ts`** replaces the three previous interaction classes (`MouseInteraction`, `ZoomPan`, `TouchInteraction`). It uses Pointer Events Level 3 when `window.PointerEvent` exists and falls back to non-passive Touch Events on legacy Safari. The gesture state machine has `idle / panning / pinching / swipe-candidate / cancelled`. The canvas owns the gesture via CSS `touch-action: none`; the Touch Events fallback path also calls `preventDefault()` to suppress synthetic mouse events (Bug 2 and Bug 3). Swipe navigation activates on the up-event (WCAG SC 2.5.2).
- **Resize coordinator** in `main.ts` is a single debounced (120 ms) listener on `resize` and `orientationchange` that calls `rendererManager.resize()`, re-detects capabilities, re-applies the data attributes, toggles compact info-panel, and refreshes the hint copy. `SceneManager`'s existing camera-aspect listener stays; both are removed in the unload cleanup (Bug 1).
- **`getOptimalPixelRatio`** now caps effective DPR to `1.5` on `(pointer: coarse)` devices regardless of the requested cap, to avoid thermal throttling on phones/tablets while keeping the perceived quality difference negligible.
- **`suggestStartupQuality()`** is new and is only applied when `PreferencesStore.hasStoredQuality()` returns `false`. It returns `battery` for high-DPR small phones and `balanced` otherwise. User choice always wins after the first session.
- **`RendererManager`** registers `webglcontextlost` (with `preventDefault()`) and `webglcontextrestored` handlers, exposes `isRenderPaused()`, and emits `render/context-lost` (`warn`) and `render/context-restored` (`info`) diagnostics. The animation loop short-circuits when paused so the `requestAnimationFrame` driver keeps ticking but Three.js draw calls are skipped until restoration.
- **`main.scss`** introduces `--safe-top/right/bottom/left` wrappers around `env(safe-area-inset-*, 0px)`, `--chrome-top` and `--chrome-bottom` spacing tokens, `100dvh` body height with a `100%` fallback, and `touch-action: none` scoped to the canvas. All fixed-position chrome (topbar, info-panel, nav, zoom, fullscreen, prefs, timeline, hint, fallback card) now offsets against the safe-area variables. The single legacy `@media (max-width: 720px)` block was replaced by an explicit four-phase breakpoint set; `phone-portrait`/`phone-small` also hide the topbar badge and hint via the new device-capability mirror selectors.
- **`InfoPanel.setCompact(boolean)`** toggles a new `.info-panel--compact` class that gives the panel full available width minus safe-area, raises it above the chrome, clamps the title, and allows internal scrolling to satisfy WCAG SC 1.4.10 Reflow.
- **`HintText.updateHint()`** reads `data-pointer-primary` and renders the appropriate German copy. It is called from the constructor and from the resize coordinator after a pointer-type change.
- **`FallbackScreen`** appends a coarse-pointer-only tip about private browsing and hardware acceleration; the technical reason is HTML-escaped and only shown when diagnostics mode is not `default`.

### What was deliberately not changed

- The three legacy interaction classes (`MouseInteraction.ts`, `ZoomPan.ts`, `TouchInteraction.ts`) remain on disk as dead code. They are no longer imported anywhere; the Vite build now transforms `46` modules instead of `47`. They are kept to make the v0.11 change reversible. A subsequent cleanup PR can delete them.
- `isMobileDevice()` in `performance.ts` is marked `@deprecated` but still exported. No remaining callers exist in the repository, but the function is retained for safety because external preview snapshots may reference it.
- `ResizeObserver` is not yet wired into `RendererManager`. The plan flagged this as a follow-up; the debounced `window.resize` + `orientationchange` path covers the FREYRAUM canvas (which always fills the viewport).
- The WebGL context-loss recovery currently only logs and pauses rendering. No user-visible recovery overlay or retry button has been added yet; this remains a follow-up.

### Validation

- `npm install`, `npm run lint`, `npm run build` all pass cleanly with only the known pre-existing Sass legacy-API deprecation notice and the TypeScript parser version warning.
- `tsc` (the typecheck step inside `npm run build`) reports zero errors.
- The `customer-preview/` bundle was regenerated and committed.
- Physical-device QA (iPhone, iPad, Android) and 320 px / browser-zoom reflow remain a customer-side acceptance step against the QA matrix in `plan.md`.

### Diagnostics surface

New scopes/events the runtime now emits:

| Scope | Event | Level | Trigger |
| --- | --- | --- | --- |
| `layout` | `capabilities` | `info` | Startup |
| `layout` | `resize` | `info` | After debounced resize/orientationchange |
| `interaction` | `init` | `info` | `CanvasInteraction` constructor records backend choice |
| `interaction` | `gesture-start` | `debug` | Pointer/touch down begins a gesture (verbose only) |
| `interaction` | `gesture-cancel` | `debug` | Pointer cancellation |
| `interaction` | `swipe` | `debug` | Swipe resolved on pointer up |
| `quality` | `startup-suggestion` | `info` | When the heuristic overrides default preset |
| `renderer` | `context-lost` | `warn` | WebGL context dropped |
| `renderer` | `context-restored` | `info` | WebGL context restored |

These complement the existing `boot/*`, `gallery/*`, `quality/adaptive-downgrade`, `preferences/*`, and `debug/*` events.

---

## 2026-05-18 — v0.11 final research-backed technical coding plan: responsive phones/tablets, touch, gestures, and compatibility

### Scope of this pass

Updated from a local code-audit plan to a final research-backed technical coding plan. Every v0.11 slice still maps to exact files, functions, TypeScript interfaces, CSS patterns, and concrete code suggestions, but the plan is now also validated against current official accessibility, input, viewport, and WebGL guidance. No runtime code was changed in this pass.

### Online validation result

The previous v0.11 direction was confirmed by current official guidance. The main outcome of the online validation was not a redesign of the plan, but four upgrades:

1. treat **WebGL context loss/recovery** as part of mobile reliability, not a later nice-to-have;
2. treat **high-DPI drawing-buffer sizing** as a first-class acceptance concern;
3. treat **320 px reflow and browser zoom** as explicit test gates;
4. treat **`touch-action` + listener passivity** as a combined browser-compatibility rule.

### Official / authoritative sources used in the validation

- W3C WCAG 2.2 — Target Size (Minimum): <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html>
- W3C WCAG 2.1 — Pointer Gestures: <https://www.w3.org/WAI/WCAG21/Understanding/pointer-gestures.html>
- W3C WCAG 2.1 — Pointer Cancellation: <https://www.w3.org/WAI/WCAG21/Understanding/pointer-cancellation.html>
- W3C WCAG 2.1 — Reflow: <https://www.w3.org/WAI/WCAG21/Understanding/reflow.html>
- W3C Pointer Events Level 3: <https://www.w3.org/TR/pointerevents3/>
- MDN — `touch-action`: <https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action>
- MDN — viewport meta / `viewport-fit`: <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport>
- MDN — CSS `env()` environment variables: <https://developer.mozilla.org/en-US/docs/Web/CSS/env>
- MDN — WebGL best practices: <https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices>
- Khronos — Handling High DPI in WebGL: <https://wikis.khronos.org/webgl/HandlingHighDPI>
- Khronos WebGL spec — context loss handling: <https://registry.khronos.org/webgl/specs/latest/1.0/>

### Code-level bugs found during technical audit (2026-05-18)

These were found by reading every relevant source file. Each entry records the file, the specific code, and the fix planned for v0.11.

#### Bug 1 — RendererManager.resize() is never called on window resize (critical for mobile)

- **File:** `src/core/SceneManager.ts`, `src/core/RendererManager.ts`, `src/main.ts`
- **Problem:** `SceneManager` registers `window.addEventListener('resize', this.handleResize)` which only calls `camera.aspect` + `updateProjectionMatrix()`. The public `RendererManager.resize()` method (which calls `renderer.setSize()`) has no listener and is never invoked after startup. The canvas visually fills the viewport via `position: fixed; inset: 0; width: 100%` CSS, but Three.js internal render resolution is never updated. On mobile, rotating portrait→landscape leaves the framebuffer at the wrong dimensions.
- **Fix:** Add a debounced `'resize'` listener in `main.ts` that calls `rendererManager.resize()`. Store the listener as a named function for cleanup.

#### Bug 2 — All touch listeners are passive; pinch cannot prevent native zoom on iOS Safari (critical)

- **File:** `src/interaction/TouchInteraction.ts` lines 17–19
- **Problem:** All three listeners use `{ passive: true }`. On iOS Safari, when the user pinches, the browser fires its native page zoom alongside the custom `getTouchDist` calculation. The result is dual-zoom behavior or unwanted page-scale changes.
- **Fix:** In the new `CanvasInteraction.ts`, register `touchmove` with `{ passive: false }` and call `e.preventDefault()` when `e.touches.length >= 2` (pinch) and when `state === 'panning'`.

#### Bug 3 — TouchInteraction and ZoomPan/MouseInteraction coexist; touch fires synthetic mouse events (moderate risk)

- **File:** `src/main.ts` lines 254–257 — four separate interaction managers on the same canvas
- **Problem:** On iOS/Android, a touch tap fires `touchstart` → `touchend` → `mousemove` → `mousedown` → `click`. `ZoomPan.ts` has `mousedown` on canvas and `mousemove`/`mouseup` on window. `MouseInteraction.ts` has `click` on canvas. A touch tap can invoke both the touch swipe check and the mouse click/panel-click path. Currently mostly safe due to the >50 px swipe threshold, but fragile and will misbehave if any new code uses `mousedown` state.
- **Fix:** Replace the three managers with `CanvasInteraction.ts`. Use Pointer Events (preferred) which do not generate synthetic mouse events; or for the Touch Events fallback path, call `e.preventDefault()` on `touchstart` to suppress synthetic mouse events.

#### Bug 4 — isMobileDevice() only checks viewport width, misses pointer type and landscape phones

- **File:** `src/utils/performance.ts` line 5–7
- **Problem:** `window.innerWidth < 768` is false for landscape phones (e.g., iPhone 14 landscape = 844 px), touch laptops (full-width viewport, coarse pointer), and large tablets. The function name is misleading.
- **Fix:** Replace with `detectDeviceCapabilities()` in new `src/utils/device.ts` using `matchMedia('(pointer: coarse)')` and `matchMedia('(hover: hover)')` alongside viewport dimensions.

#### Bug 5 — HintText always shows desktop-only German copy, even on touch devices

- **File:** `src/ui/HintText.ts` line 8
- **Problem:** `'Scrollen zum Zoomen · Ziehen zum freien Bewegen.'` is only meaningful on a desktop with a scroll wheel. On a phone, there is no scrolling.
- **Fix:** After Slice 1 sets `document.documentElement.dataset['pointerPrimary']`, `HintText.updateHint()` reads it and shows `'Wischen zum Navigieren · Zwei Finger zum Zoomen.'` for coarse pointer. Hide entirely on phone-portrait layout.

#### Bug 6 — Preferences panel can overflow viewport on narrow phones (320–380 px wide)

- **File:** `src/styles/main.scss` `.prefs__panel` rule (~line 393–408)
- **Problem:** `width: 320px` is absolute. On a 375 px wide phone, the panel right-aligns to the screen edge and left-extends to ~55 px, which is fine. But on 320 px (iPhone SE 1st gen), the panel clips the left margin. On short landscape viewports (height ≈ 320 px), the panel may extend below the screen bottom.
- **Fix:** `width: min(320px, calc(100vw - 24px))`, `max-height: calc(100dvh - 80px)`, `overflow-y: auto`.

#### Bug 7 — No viewport-fit=cover, no safe-area CSS, no dvh units in app.html / main.scss

- **Files:** `app.html` line 5, `src/styles/main.scss` `:root` block
- **Problem:** Without `viewport-fit=cover`, the safe-area environment variables are not computed by browsers for notch devices. Without `env(safe-area-inset-*)` usage in CSS, the topbar and bottom timeline sit under hardware notches or home indicators on iPhone. Fixed `bottom: 168px` offsets for nav, zoom, and timeline do not account for the home indicator height (34 px on iPhone 14).
- **Fix:** Add `viewport-fit=cover` to the viewport meta. Add `--safe-top/right/bottom/left` CSS variables that wrap `env(safe-area-inset-*, 0px)`. Apply to all fixed-position chrome elements.

### Positive findings — existing code that is already solid for mobile

- `GalleryManager.navigate()` and `resetView()` are stateless and safe to call from touch handlers.
- `GalleryManager.canPan()` correctly gates pan vs. swipe — the touch swipe/pan split logic in `TouchInteraction.ts` is correct in principle; the passive-listener bug is the only real flaw.
- `AdaptiveQualityController` has correct cooldown and manual-override behavior; it will work on mobile without modification.
- `Diagnostics.ts` `createScopedDiagnostics(scope)` pattern makes it trivial to add a `layout` scope.
- Timeline uses real `<button>` elements with roving tabindex — works on mobile screen readers.
- All controls have `aria-label`, real semantic HTML, and `focus-visible` ring — strong accessibility baseline.
- `FrameBudgetMonitor` clamps long frames (tab switch) and has navigation cooldown — thermal spikes will not trigger premature quality downgrades.

### Additional risks and enhancements validated online

- **Reflow remains a real risk** because FREYRAUM uses fixed-position chrome and overlay UI; the implementation must now explicitly test 320 px width / browser zoom behavior.
- **`touch-action: none` belongs on the canvas only**, not the whole page. The page must not globally disable browser zoom.
- **Context loss needs a documented recovery path**. Logging alone is not enough for a premium customer-facing gallery if memory pressure causes the WebGL context to drop.
- **A `ResizeObserver` follow-up would improve resilience** after the first v0.11 shipping pass, especially for split-view or embedded layouts.
- **Fullscreen should stay a graceful enhancement** because support and UX vary by device and browser.

### Updated technical conclusion

This is a targeted hardening pass, not a redesign. The seven bugs listed above are actionable and have low-risk fixes. The positive baseline means most of the work is additive (new `device.ts`, new `CanvasInteraction.ts`, CSS variables, breakpoints) rather than replacing working code.

### Validation status

Documentation-only pass. Runtime changes will be in a follow-on implementation PR. That PR must:
- Run `npm run lint` and `npm run build` and see only the existing known TS parser and Sass warnings.
- Manually verify all QA matrix entries documented in `plan.md`.
- Add explicit checks for 320 px reflow/browser zoom, high-DPI resize accuracy, and context-loss handling.
- Regenerate `customer-preview/` if any source output changes.

---

## 2026-05-17 — v0.10 follow-up: implemented — parallax hole artifacts

### Customer-observed behavior

After the first v0.10 spot fix, the customer reported **more artifacts** that
looked like **holes**, with the same picture visible behind them. The customer
suspected the parallax effect.

### Root cause identified

The suspicion was correct. In `PaintingMaterial.ts`, the parallax shader
computed `pUV` from procedural height and then sampled the real artwork albedo
with that shifted UV:

```glsl
vec4 sampledDiffuseColor = texture2D( map, pUV );
```

Because the height map is procedural and unrelated to the actual photo content,
deep/recessed height areas displaced the image locally. This can look like a
crater or hole showing a second, offset copy of the same picture behind the
surface.

### Fix implemented

- `PaintingMaterial.ts`: albedo now samples stable `vMapUv`.
- `PaintingMaterial.ts`: parallax `pUV` remains available only for relief maps
  (normal/self-shadow), preserving picture fidelity.
- `quality.ts`: Hoch `parallaxScale` reduced from `0.04` to `0.012`.
- `GalleryManager.ts`: diagnostics now log `parallaxEnabled` and
  `parallaxScale` in `show-artwork-complete`.
- Preview bundle regenerated.

Validation: `npm run lint` and `npm run build` pass with only the known
TypeScript parser and Sass warnings.

---

## 2026-05-17 — v0.10: implemented — spot artifacts and portrait reset zoom

### Customer-observed behavior

Customer reports **little spots** visible at close-up zoom with **Hoch** quality
preset. Balanced and battery do not reproduce the artifact. The screenshot URL
returns `HTTP 404` from this sandbox; the analysis is code-derived.

The customer also requested that especially very vertical pictures start far
enough away. The old reset view used fixed `DEFAULT_CAMERA_Z = 7`, which could
clip a fully framed portrait (`5.8` artwork height + `0.4` frame height) on the
initial/reset view.

### Root causes identified (code-derived with math)

Full analysis in `plan.md` v0.10. Short summary:

**Cause 1 (primary) — Height micro-noise creates stochastic shadow blockers**

`ProceduralTextureFactory.generateHeight()` line 156:

```ts
const micro = this.valueNoise2d(x * 0.55, y * 0.55, seed + 31) * 16;
```

Frequency 0.55 at 1024 px → period ≈ 1.8 px (near Nyquist). The self-shadow
march in `PaintingMaterial.ts` jumps ~5 pixels per step at 8 steps. Each step
lands at a statistically independent micro-noise height. Pixels whose `_curH`
sampled a micro-noise trough have all subsequent march samples appearing as
blockers → **dark spot**. Current bias `0.03` is only half the micro amplitude
`16/255 ≈ 0.063`, so micro-noise blockers are not suppressed.

**Cause 2 (secondary) — Specular blob peak too high for Hoch close-up**

`generateSpecular()` line 220:
```ts
const blob = Math.exp(-distSq / (radius * radius)) * 90;
```

With `specularStrength: 0.4` and clearcoat in Hoch, blob centers contribute
`(90/255) × 0.4 ≈ 14%` specular intensity — visible as bright spots at close
zoom under raking light.

### Fix implemented

| File | Line | Before | After | Reason |
|------|------|--------|-------|--------|
| `ProceduralTextureFactory.ts` | ~156 | `* 16` | `* 3` | max micro = 0.012 < bias 0.03, kills shadow speckle |
| `ProceduralTextureFactory.ts` | ~220 | `* 90` | `* 50` | blob peak drops from 14% to 7.8% specular |
| `quality.ts` Hoch | `selfShadowBias` | `0.03` | `0.05` | ×4 headroom over new micro amplitude |
| `quality.ts` Hoch | `specularStrength` | `0.4` | `0.28` | combined blob contribution drops to 5.5% |

Additional portrait/framing fix:

- `GalleryManager.ts`: `MAX_CAMERA_Z` raised from `8.5` to `9.25`.
- `GalleryManager.ts`: reset view now uses `getResetZoom()` based on framed
  artwork dimensions (`artworkWidth + 0.4`, `artworkHeight + 0.4`) and camera
  aspect/FOV, with a `1.04` safety margin.
- `GalleryManager.ts`: first load and navigation set `pendingResetAfterArtworkLoad`
  so reset zoom is recomputed after async artwork texture/aspect loading.
- Diagnostics now include `resetZoom`, `minZoom`, `maxZoom`,
  `specularStrength`, and `selfShadowBias`.

No GLSL shader changes. No new public API. No schema changes. Balanced/battery
unaffected by the spot tuning. Validation: `npm run lint` and `npm run build`
pass with only the known TypeScript parser and Sass warnings.

---

## 2026-05-17 — v0.09: implemented — uploaded image now on 3D painting

### What changed

v0.09 is implemented. The central 3D painting now shows the actual uploaded
customer image instead of the generated placeholder.

Root cause of the remaining v0.08 gap confirmed through code audit:

- The importer (`scripts/import-artworks.mjs`) only wrote `image: './images/...'`
  (a relative path) into the manifest. Under `file://` protocol, `Three.js
  TextureLoader` cannot reliably upload local-file images as WebGL textures in all
  browsers, even without `crossOrigin` set.
- The `Artwork` type had no `webglImage` field.
- `GalleryManager.init()`, `showArtwork()`, and `applyPreset()` all looked up the
  albedo by `artwork.image` — so even if a data URL had been available, it would
  have been ignored.
- `sanitizeInjectedArtworks()` did not extract or validate `webglImage`.

### Fix implemented

Five files changed:

1. `src/config/artworks.ts` — Added `webglImage?: string` to `Artwork`.
2. `src/main.ts` — `sanitizeInjectedArtworks` now extracts `webglImage`, validated
   strictly as `data:image/<subtype>;base64,<...>` to block non-image injection.
3. `src/gallery/GalleryManager.ts` — All albedo URL derivations changed to
   `artwork.webglImage ?? artwork.image`: `init()`, `showArtwork()`,
   `applyPreset()`, side-panel cache lookups, fallback check, and diagnostics
   (new `webglImageSource: 'embedded-data-url' | 'file-url'` field).
4. `src/gallery/TextureManager.ts` — Data URL diagnostic safety: full data URL is
   never logged; instead logs `[data-uri:image/jpeg:2463944bytes]`.
5. `scripts/import-artworks.mjs` — After copying each image, reads bytes with
   `readFileSync`, encodes as base64, and writes `webglImage: "data:image/...;base64,..."`
   into `customer-artworks.js`. Report states "3D painting source: embedded as data
   URLs for reliable offline WebGL." MIME types table added for all supported
   formats including risky ones.

### Why data URLs and not alternatives

| Approach | Verdict |
|----------|---------|
| `URL.createObjectURL(blob)` | Not viable — requires a File/Blob, not available in static file:// page |
| `createImageBitmap(blob)` | Safari/Firefox compat gaps; deferred to v0.10 |
| `fetch(filePath)` in file:// | Blocked by all major browsers for file:// |
| Canvas draw → `toDataURL()` | Destructive recompression — violates no-edit requirement |
| Local HTTP server | Violates no-server requirement |
| Importer base64 data URL | Chosen: JSON-serializable, origin-clean, exact bytes, works in file:// |

### Acceptance state after v0.09

- Central 3D painting: **shows actual uploaded image** when `webglImage` is embedded
- `webglImageSource: 'embedded-data-url'` in diagnostics when importer embeds it
- `fallbackUsed: false` for all supported raster formats (JPG, PNG, WebP, GIF, AVIF)
- Aspect ratio: unchanged, manifest-driven from v0.08
- Effects (self-shadow, parallax, bump, clearcoat, varnish): unchanged
- Build/lint: pass

---

## 2026-05-17 — v0.09: aspect fixed, actual uploaded image still falls back on 3D painting

### Customer-observed behavior

After v0.08, the central 3D painting now has the correct aspect ratio, but the
actual uploaded image still does not appear on the 3D painting. The user still
sees the generated placeholder/fallback texture.

This means the manifest/aspect path is fixed, but the WebGL albedo-byte path is
still unreliable in the customer preview environment.

### Current failure boundary

- Timeline uses DOM `<img>` and can display the uploaded file.
- 3D painting uses `TextureManager` / Three.js / WebGL texture upload.
- `ArtworkMesh` receives manifest dimensions and sizes the frame correctly.
- The remaining failure is therefore between "URL exists / image can display in
  DOM" and "image bytes are accepted as a WebGL texture".

### Online research findings

Research on Three.js / WebGL local image texture failures found:

- Three.js `TextureLoader` uses browser image loading primitives. It can load a
  URL that later still fails during WebGL texture upload if the browser considers
  the image not origin-clean or not uploadable.
  Source: <https://threejs.org/docs/#api/en/loaders/TextureLoader>
- MDN documents that images used with canvas/WebGL are subject to CORS /
  origin-clean rules; normal image display is not the same as pixel access.
  Source: <https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image>
- WebGL Fundamentals documents the same practical issue: cross-origin/local
  image rules are stricter for WebGL textures than for DOM display.
  Source: <https://webglfundamentals.org/webgl/lessons/webgl-cors-permission.html>
- `createImageBitmap()` can decode `Blob`/`File` sources and has orientation
  options, but it is not the simplest static `file://` customer workflow fix and
  still varies by browser/format.
  Source: <https://developer.mozilla.org/en-US/docs/Web/API/createImageBitmap>
- Community guidance for local user images in Three.js commonly recommends
  `FileReader.readAsDataURL()` or `URL.createObjectURL(file)` rather than direct
  `file://` paths. For FREYRAUM's non-interactive static preview, the importer
  equivalent is to write exact image bytes as a data URL into the generated
  manifest.

### v0.09 technical conclusion

v0.08's two-loader fix is necessary but not sufficient for every local
`file://` + WebGL setup. The v0.09 plan should avoid WebGL upload from local file
paths entirely by having the importer write an exact base64 `data:image/...`
source for the 3D albedo (`webglImage`), while keeping the human-readable file
path for reports and optional timeline display.

This preserves the user's requirement:

- no crop
- no stretch
- no destructive edit
- no recompression
- central 3D painting shows the actual uploaded picture bytes
- effects are applied on top of that real albedo texture

### Planned acceptance requirement

Do not accept v0.09 unless the reported imported images render on the central 3D
painting with:

- `fallbackUsed: false`
- `aspectSource: 'manifest'`
- source kind `embedded-data-url` (or equivalent origin-clean source)
- full-frame image mapping with no UV crop
- painting effects still active according to the selected quality/light profile

---

## 2026-05-17 — v0.08: customer images on 3D paintings — root cause confirmed and fixed

### Root cause

`TextureManager` called `this.loader.setCrossOrigin('anonymous')` on a single,
globally shared `THREE.TextureLoader`. In the customer-preview, all artwork images
are loaded from `file://` or relative paths. When `crossOrigin = 'anonymous'` is
set, the browser treats every local-file load as a CORS request, cannot get
`Access-Control-Allow-Origin` headers from a local file, marks the image as
tainted, and WebGL refuses to upload it. The `THREE.TextureLoader` error callback
fired, `TextureManager` silently created a 1600 × 1100 gradient fallback, and the
3D painting showed that fallback.

The Timeline was unaffected because it uses plain `<img>` elements with no
`crossOrigin` attribute — DOM display works without CORS.

The aspect ratio mismatch was a secondary effect: `ArtworkMesh.updateAspect()`
read aspect from the *loaded texture's* pixel dimensions. The fallback is always
1600 × 1100 (landscape), so portrait and square artworks always appeared as
landscape frames.

### Fix applied

Three surgical changes:

1. **`TextureManager`**: two loaders — `externalLoader` (with
   `setCrossOrigin('anonymous')`) for actual `https?://` URLs, `localLoader` (no
   crossOrigin) for data URIs, relative paths, and `file://` resources. A new
   `fallbackKeys` set and `isFallback(url, role)` method make fallback use
   queryable. Verbose diagnostics log URL type, load success with pixel dimensions,
   and load failure with the browser error message.

2. **`ArtworkMesh`**: `updateAspect()` now accepts optional `manifestDimensions`
   and uses them as the primary aspect source. `setPaintingTextures()` forwards the
   dimensions parameter. New getters `lastAspectSource` and `lastManifestDimensions`
   expose what was used for diagnostics.

3. **`GalleryManager`**: passes `artwork.dimensions` to `setPaintingTextures()`.
   Calls `isFallback()` after load and emits a high-visibility warn if the central
   3D painting is using a fallback texture. The `show-artwork-complete` diagnostic
   now includes `fallbackUsed`, `aspectSource`, `manifestDimensions`,
   `paintingWidth`, `paintingHeight`, and `paintingAspect`.

### Build validation

`npm run lint && npm run build` — exit 0, only expected TS-parser and Sass deprecation warnings.

### Follow-up validation pass (2026-05-17 evening)

The follow-up pass adds a deep technical implementation/execution plan and
verifies the fix against the v0.08 acceptance requirements:

- **All resolutions covered.** `ArtworkMesh.updateAspect` calls
  `fitWithinBox(aspect, 4.2, 5.8)`, which is defined for every finite positive
  aspect and clamps non-finite/non-positive inputs to 1.0. The all-resolutions
  matrix is enumerated in `plan.md` (v0.08 Deep Implementation Notes §3) and
  covers ultrawide (4:1), wide landscape (3:2), 4:3, square (1:1), 4:5 portrait,
  3:4 portrait, 1:2 tall portrait, and extreme 1:4 portrait.
- **All image kinds covered.** Edge-case table in `plan.md` v0.08 §5 covers
  HEIC/HEIF, AVIF, SVG without intrinsic size, oversized images
  (`gl.MAX_TEXTURE_SIZE`), animated GIFs, EXIF-rotated JPEGs, zero/negative
  aspect manifests, https URLs needing CORS, role-keyed cache collisions, and
  rapid timeline navigation.
- **Timeline still works for all aspects.** `src/styles/main.scss` ships the
  `--thumb-aspect` CSS variable on `.timeline__img { aspect-ratio: var(--thumb-aspect, 1.5); }`.
  Each thumbnail reserves space using the artwork's intrinsic aspect, so layout
  never shifts when the image finishes loading, regardless of portrait,
  landscape, square, or ultrawide source.
- **Effects still applied.** Procedural normal/height/roughness/specular/AO/
  varnish maps remain content-addressed by `(artworkId, role, tileSize)` and
  are independent of the albedo upload path. Self-shadow, parallax, bump,
  clearcoat, anisotropy, and the inspection-only 3-ray PCF filter all sample in
  UV space and so are invariant under per-artwork `mesh.scale` adjustments.
- **Diagnostics validated.** `show-artwork-complete` carries `fallbackUsed`,
  `aspectSource`, `manifestDimensions`, `paintingWidth`, `paintingHeight`, and
  `paintingAspect`. `show-artwork-fallback` is emitted at `warn` level the
  moment a fallback texture is detected on the central 3D painting.
- **Build re-validated.** `npm run lint && npm run build` — exit 0, only the
  expected TS-parser and Sass deprecation warnings.

Parked for v0.09: EXIF orientation honoured in the WebGL upload path; importer
downscale for images >4000 px on the longest edge; customer-controlled
`surfacePhysics` profiles per artwork. None of these block v0.08 acceptance.

---

## 2026-05-17 — v0.08 pre-fix finding: timeline works, 3D painting does not (original observation)

Customer import produced valid manifest entries and the timeline displayed the
images, but the actual 3D painting did not show the imported artwork and did not
match the imported aspect ratios.

### Why this matters

This is the main customer-image feature path. The import is not complete unless
the central 3D painting uses the customer image and the customer image dimensions.

### Likely failure area (now confirmed)

- The timeline loads images through DOM `<img>` elements.
- The 3D painting loads images through Three.js `TextureLoader` in `TextureManager`.
- `TextureManager` currently creates a generated fallback texture when loading
  fails, and that fallback can hide the real failure.
- `ArtworkMesh.updateAspect()` currently sizes from the loaded texture. If the
  loaded texture is fallback, the 3D painting gets the fallback aspect instead
  of the imported artwork aspect.

### Plan created

`plan.md` now contains the full **v0.08** technical implementation plan including
root cause analysis, code-level fix details, logging structure, and acceptance
checks for the reported images: `720 × 907`, `719 × 991`, and `4724 × 4724`.

---

## 2026-05-17 — v0.07 customer-managed artworks implemented

The v0.07 importer and runtime injection path are implemented in code. A
non-technical customer can manage the gallery by dropping images into
`customer-artworks/inbox/` and double-clicking `Update Gallery`. A later customer
report showed that the timeline can display imported files while the central 3D
painting still fails to show them; that critical acceptance gap is now tracked in
the v0.08 plan above.

### What is now implemented

- **Zero-dependency importer** (`scripts/import-artworks.mjs`): scans the inbox,
  reads pixel dimensions for JPEG / PNG / GIF / WebP / SVG / AVIF directly from
  file headers (no native binaries, no npm install beyond what the build already
  uses), skips RAW formats with a clear message, warns about HEIC/HEIF/TIFF/BMP,
  copies images to `customer-preview/images/`, writes both
  `customer-artworks/artworks.json` and `customer-preview/customer-artworks.js`,
  backs up the previous manifest, and produces a plain-language report.
- **Runtime injection** (Option C from the plan): the importer writes
  `window.__FREYRAUM_ARTWORKS` into a side-loaded `<script>` so the `file://`
  preview picks up new images without a rebuild and without violating browser
  `fetch()` restrictions on `file://`.
- **Constructor injection refactor**: `Timeline`, `InfoPanel`, and `GalleryManager`
  no longer reach for the global `artworks` constant; they accept the active list
  via their constructor. `main.ts` reads, validates, and dedupes the injected
  manifest with `sanitizeInjectedArtworks()` and falls back cleanly to built-in
  demo artworks when no customer manifest exists or every entry is invalid.
- **Arbitrary dimensions intended path**: `ArtworkMesh.updateAspect()` and
  `SidePanels` fit any aspect into the world box via `fitWithinBox(aspect, 4.2,
  5.8)`, and the timeline reserves space per-thumb from declared dimensions.
  v0.08 must harden this path so the central 3D painting uses the imported
  manifest dimensions and not fallback texture dimensions.
- **Double-click launchers**: `Update Gallery.command` (macOS, `chmod +x`) and
  `Update Gallery.bat` (Windows) both check for Node.js, run the importer, and
  open the report. The macOS launcher documents the Gatekeeper one-time approval.

### Reliability and edge-case behaviour

- One bad file does not stop the run; warnings, skips, and copy errors are all
  collected and reported separately.
- Duplicate IDs (after normalization) are disambiguated with a numeric suffix.
- A previous manifest is renamed to `artworks.json.bak` before being replaced,
  so a botched import can be recovered manually.
- `customer-preview/images/` is cleared at the start of each run, so removed
  inbox files do not leave orphan assets.
- The `customer-artworks.js` runtime injection is validated entry-by-entry at
  startup; malformed entries are dropped with a diagnostic warning instead of
  crashing the app.
- If the customer never runs the importer, `write-local-preview.mjs` emits a
  `window.__FREYRAUM_ARTWORKS = [];` stub so the script tag does not 404.

### Verified test matrix

End-to-end run with the importer:

| Test case             | File                       | Result                       |
| --------------------- | -------------------------- | ---------------------------- |
| Landscape PNG         | 800 × 400                  | imported, no stretching      |
| Portrait PNG          | 300 × 600                  | imported, no stretching      |
| Square PNG            | 512 × 512                  | imported                     |
| Ultrawide PNG         | 3200 × 800                 | imported                     |
| SVG with width/height | 1024 × 768                 | imported                     |
| JPEG with SOF0        | 512 × 768                  | imported, dimensions correct |
| Unsupported `.txt`    | —                          | skipped with friendly text   |
| Empty inbox           | —                          | empty manifest, demo loads   |

### Open follow-ups (out of scope for this pass)

- Optional `jimp` integration for a 4096 px long-edge cap on huge phone/camera
  images (Phase 4 in `plan.md`).
- Optional sidecar metadata file for custom titles, descriptions, and per-artwork
  `surfaceProfile` overrides.
- Optional thumbnail generation for the timeline.

---

## 2026-05-17 — v0.07 diagnostics and logging system implemented

The v0.07 plan previously covered the customer-managed artwork workflow well, but the code audit found a major cross-cutting gap: diagnostics were too narrow and too inconsistent for a reliability-focused rollout. Before this pass, runtime logging was limited to:

- hidden `?debug=1` shader toggles in `src/main.ts`
- one direct `console.warn()` in `src/rendering/RenderBackend.ts`
- almost no structured visibility into boot, preferences, gallery loads, texture fallbacks, adaptive quality, or uncaught runtime errors

### What is now implemented

- Added `src/utils/Diagnostics.ts`, a centralized diagnostics singleton with:
  - levels: `debug`, `info`, `warn`, `error`
  - modes: `default`, `info`, `verbose`
  - ring buffer of the latest 300 entries
  - short-window deduplication with repeat counts
  - structured metadata serialization (including `Error`)
  - global `window` API: `window.__FREYRAUM_DIAGNOSTICS__`
  - global capture of uncaught `error` and `unhandledrejection`
- Updated runtime integration:
  - `src/main.ts` now logs boot, preference application, gallery-ready state, debug toggle state, adaptive downgrades, shutdown, and fatal startup failures
  - `src/rendering/RenderBackend.ts` now logs backend detection and WebGPU probe start/success/failure through the diagnostics utility
  - `src/gallery/TextureManager.ts` now logs renderer texture capabilities and generated fallback-texture use
  - `src/gallery/GalleryManager.ts` now logs preset application, inspection-mode changes, artwork load start, stale async load discards, and final active-map summary
  - `src/utils/AdaptiveQualityController.ts` now logs downgrade requests and manual-suspension state
  - `src/utils/preferences.ts` now logs storage read/write failures

### Reliability design decisions

- **Normal customer sessions stay quiet.** Default console output only shows `warn` / `error`.
- **Debugging is opt-in.** `?debug=1` / `?debug=info` enables info logs; `?debug=verbose` enables debug logs.
- **History is still retained.** Even when console output is quiet, recent diagnostics remain available in memory through `window.__FREYRAUM_DIAGNOSTICS__`.
- **Noise is controlled.** Repeated identical events inside a short time window update a repeat count instead of printing endlessly.

### Practical debug workflow

1. Open the preview normally: customer sees only real warnings/errors.
2. Re-open with `?debug=1` for readable subsystem logs.
3. Re-open with `?debug=verbose` for deeper engineering detail.
4. In DevTools console, inspect:
   - `window.__FREYRAUM_DIAGNOSTICS__.getEntries()`
   - `window.__FREYRAUM_DIAGNOSTICS__.snapshot()`
   - `window.__FREYRAUM_DIAGNOSTICS__.print('info')`

### Validation

- `npm run lint` — passes (only the known TypeScript parser support warning)
- `npm run build` — passes (only the known Dart Sass legacy JS API warning)
- Preview bundle size increase from diagnostics pass: ~562 KB → ~569 KB (gzip ~143 KB → ~146 KB), acceptable for the current risk budget

---

## 2026-05-17 — v0.07 technical planning (full execution plan): customer-managed picture folder

The customer request is to make picture replacement simple enough for an elderly non-technical user: drag files into a folder, run one obvious update action, and open the preview. Current code does **not** support that yet. The v0.06 gallery still defines artworks in `src/config/artworks.ts` and ships a built static `customer-preview/` bundle.

### Current code findings

| File | Finding | Impact |
|------|---------|--------|
| `src/config/artworks.ts` | Four artworks are hardcoded and use embedded SVG `data:` images. | Customer cannot replace pictures without developer work. |
| `Artwork` interface | Metadata shape is already CMS-like (`id`, title, dimensions, alt, tags, optional material fields). | Good target for generated `artworks.json`. |
| `src/gallery/TextureManager.ts` | Uses `THREE.TextureLoader` for image URLs. | Static generated image files can be loaded once the manifest points to them. |
| `src/materials/ProceduralTextureFactory.ts` | Generates missing normal/height/roughness/specular/AO maps. | Customer only needs normal image files; advanced maps remain optional. |
| `vite.local.config.ts` + root `index.html` | Preview is a static IIFE build opened from `file://`. | Importer must preserve the double-click local preview workflow. |

### Architecture decision: global window injection pattern

Three approaches for getting customer images into the pre-built IIFE bundle were evaluated. The chosen approach is **global window injection**:

1. The importer writes `customer-preview/customer-artworks.js` containing `window.__FREYRAUM_ARTWORKS = [...]`.
2. `customer-preview/app.html` includes this script before the main IIFE.
3. `src/main.ts` reads `window.__FREYRAUM_ARTWORKS` at startup and prefers it over built-in demo artworks.

**Why `fetch()` was ruled out:** The `fetch()` API is blocked on `file://` URLs by all major browsers for same-origin security reasons. A customer opening `index.html` by double-click always uses `file://`. A JSON manifest loaded via `fetch()` would silently fail with a CORS or security error in every supported browser.

**Why a rebuild-on-import approach was ruled out as the only path:** A full `npm run build` takes 10–30 seconds and requires Node.js + npm on the machine. While this approach is viable for developer maintenance, the global injection approach allows future-faster updates that skip the rebuild entirely and still work from `file://`.

### Online research findings

- Browser-safe image formats are primarily JPEG, PNG, GIF, SVG, WebP, and modern AVIF; TIFF and RAW are not reliable direct browser inputs. Source: MDN Image file type and format guide — https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
- Browser folder APIs are not uniformly standard. `webkitdirectory` and File/Directory Entries can help in some browsers, but should not be the only workflow for a non-technical customer. Sources: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#webkitdirectory and https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API
- `createImageBitmap()` is useful for async decoding, but importer design still needs explicit orientation/metadata decisions for real camera files. Source: https://developer.mozilla.org/en-US/docs/Web/API/createImageBitmap
- WebGL has a device-dependent `MAX_TEXTURE_SIZE`; very large camera/scanner files need generated downscaled copies before reliable texture upload. Source: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#textures
- `fetch()` on `file://` URLs is blocked by all major browsers (Chrome, Firefox, Safari) for same-origin security reasons. Any runtime JSON loading for `file://`-based previews must use `<script>` tag injection instead. Source: verified by testing + MDN fetch same-origin policy notes.
- Zero-dependency Node.js image dimension reading is achievable by parsing binary headers: JPEG SOF markers, PNG IHDR chunk, WebP RIFF container, GIF header. No npm packages required for dimension reading only. Source: image format specifications + confirmed by 2024 Node.js community examples.
- Image resizing without native Node.js binaries is best handled by `jimp` (pure JS, works on macOS + Windows without node-gyp or build tools). `sharp` is faster but requires native binaries. For a customer-machine one-click script, `jimp` is the safer first choice. Source: npm package comparison research.
- macOS Gatekeeper blocks `.command` files from unidentified developers. Customers (or their developer during setup) must right-click → Open once to approve the script. After first approval, future double-clicks work without prompts.

### Planning conclusion

The most reliable customer-friendly architecture is: a local `customer-artworks/inbox/` folder + a Node.js importer script that copies images, reads dimensions (zero-dep), generates a `customer-artworks.js` global injection file, and writes a plain-language report. No rebuild of the bundle is required on every gallery update.

See `plan.md` → **v0.07 Technical Implementation Guide** for exact code patterns and implementation checklist.

---




## 2026-05-17 — v0.06 implemented: Streifenlicht blockiness reduction

All three vertical slices (S2 anisotropy, S3 inspection tile-size uplift, S4 lateral PCF self-shadow) have shipped against `src/`. `npm run lint` and `npm run build` pass; bundle is now ≈ 562 KB (gzip ≈ 143 KB), up ~9 KB from v0.05. Detailed implementation outcome (per-slice changes, the four issues found in the original plan and their fixes, acceptance results) is in `plan.md` → "v0.06 Implementation Outcome".

### Shipped changes

| File | Change |
|------|--------|
| `src/gallery/TextureManager.ts` | New `getEffectiveAnisotropy()` getter; `setAnisotropyDivisor()` delegates to it. |
| `src/materials/ProceduralTextureFactory.ts` | New `currentAnisotropy` field (default 1) + `setAnisotropy(value)` method that mutates every cached `DataTexture` in place; `generate()` applies the stored cap to newly created textures. |
| `src/gallery/GalleryManager.ts` | `applyPreset()` mirrors `getEffectiveAnisotropy()` onto the procedural factory. New `inspectionMode` field + `setInspectionMode(on)` that re-runs `showArtwork()` on toggle. Module-scope `INSPECTION_ROLES = ['normal','detailNormal','height']`. `showArtwork()` picks `proceduralInspectionTileSize` per role when `inspectionMode && inspSize > 0`. |
| `src/config/quality.ts` | New `proceduralInspectionTileSize` field — high=`2048`, balanced/battery=`0`. High-preset `selfShadowFilterRadius` `0.0` → `0.002`. The `selfShadowFilterEnabled` boolean from the original plan was intentionally **not added** (the runtime gate in `main.ts` makes it dead — see plan §"Issues found in the original plan"). |
| `src/materials/PaintingMaterial.ts` | New `uShadowFilterRadius` uniform + `shadowFilterEnabled` flag + `setShadowFilterRadius(radius, enabled)` method (recompile only on enable-flag change). New GLSL block guarded by `#define PAINTING_USE_SHADOW_FILTER`, inserted inside the `#ifdef PAINTING_USE_SELFSHADOW` after the primary-ray `_occlusion` clamp: two perpendicular companion rays, each accumulated with the same reciprocal-distance weighting and clamped to `uShadowMaxOcclusion` before the 3-way average. The define is gated on `shadowFilterEnabled && selfShadowActive() && radius > 0`. |
| `src/main.ts` | `applyPreferences()` calls `galleryManager.setInspectionMode(isInspection)` and `paintingMaterial.setShadowFilterRadius(isInspection ? preset.selfShadowFilterRadius : 0, isInspection && preset.selfShadowFilterRadius > 0)` alongside the existing `setShadowProfileScale()`. |

### Validation

- `npm run lint` — clean.
- `npm run build` — clean. Bundle: 562 KB / gzip 143 KB. Only pre-existing Dart Sass legacy-JS-API deprecation warning is emitted.
- Self-shadow texture reads: gallery profile = 8 (unchanged); inspection profile = 24. `_occlusion` after the 3-ray average is at most `uShadowMaxOcclusion`, so the v0.05 darkening envelope (4.2 % gallery / 8.4 % inspection) is preserved.
- Inspection memory uplift on high preset: ≈48 MB GPU per inspected artwork; 1024- and 2048-resolution entries coexist in the factory cache so a gallery-mode toggle does not pay the regeneration cost again.

### Confirmed root causes (recorded during analysis, all now fixed)

| # | File | Root cause | Resolved by |
|---|------|------------|-------------|
| RC-1 | `src/materials/ProceduralTextureFactory.ts` | `anisotropy` never set on generated `DataTexture` objects (defaults to 1). | S2 |
| RC-2 | `src/materials/PaintingMaterial.ts` + `src/config/quality.ts` | `selfShadowFilterRadius` reserved in TS but the `PAINTING_USE_SHADOW_FILTER` GLSL define and `uShadowFilterRadius` uniform did not exist. | S4 |
| RC-3 | `src/config/quality.ts` | `proceduralTileSize: 1024` used for both gallery and inspection on high preset. | S3 |

### Open follow-ups (deferred, out of scope for v0.06)

- `ProceduralTextureFactory.pruneSizeBelow(threshold)` to reclaim the 1024-resolution cache entry once inspection mode has been entered on an artwork. The plan documents this as future work; current S3 keeps both sizes alive simultaneously, which is correct for desktop and acceptable for the v0.06 risk budget.
- Per-profile `LightProfile.shadowFilterRadius` so future profiles can carry their own PCF radius rather than reading the active preset value. Today `main.ts` hard-binds the inspection radius to `preset.selfShadowFilterRadius`.

---

## 2026-05-17 - v0.05 self-shadow soft-filtering — implemented

The v0.05 plan documented in `plan.md` has been shipped. The PaintingMaterial self-shadow path no longer uses a binary break loop; it now accumulates a smooth weighted occlusion value that is bias-deadzoned, distance-weighted, clamped, and per-profile scaled. The visual outcome is that stain-like dark spots on `gallery-soft` are gone, and `raking-inspection` shows soft surface gradients rather than blotches.

### Shipped changes

| File | Change |
|------|--------|
| `src/config/quality.ts` | Added `selfShadowBias`, `selfShadowSoftness`, `selfShadowMaxOcclusion`, `selfShadowFilterRadius` to `QualityPreset` for all 3 presets. Lowered high-preset `selfShadowStrength` 0.55 → 0.30. |
| `src/materials/PaintingMaterial.ts` | Added uniforms `uShadowBias`, `uShadowSoftness`, `uShadowMaxOcclusion`, `uShadowProfileScale`. Replaced binary GLSL `break` loop with smooth weighted accumulation. Added `setShadowProfileScale()` (uniform-only, no recompile) and `setShadowDebug()` (toggles `PAINTING_DEBUG_SHADOW`). Added a horizon `_grazeMask = smoothstep(0.05, 0.20, tsLight.z)` to fade out shadows near grazing/cutoff angles smoothly. |
| `src/main.ts` | Imports `getLightProfile`; calls `setShadowProfileScale(0.5)` for `display`/`demo` profiles and `1.0` for `inspection` in `applyPreferences()`. Adds `s`/`S` debug key (behind `?debug=1`) to toggle `setShadowDebug()`. |

### Effective values (high preset)

| Quantity | Value | Rationale |
|---------|-------|-----------|
| `selfShadowStrength` | 0.30 (was 0.55) | Display read-back gentler than a 45 % dim. |
| `selfShadowBias` | 0.03 | Deadzone larger than the typical procedural value-noise peak-to-peak. |
| `selfShadowSoftness` | 0.10 | Penumbra width; produces a visibly soft transition. |
| `selfShadowMaxOcclusion` | 0.28 | Hard cap; prevents broad plateaus from looking like stains. |
| `uShadowProfileScale` (display) | 0.5 | Museum-style profiles get half-strength shadows. |
| `uShadowProfileScale` (inspection) | 1.0 | Raking light keeps the full effect. |

Max gallery-soft darkening: `0.30 × 0.28 × 0.5 = 4.2 %` of direct light. Max inspection darkening: `0.30 × 0.28 × 1.0 = 8.4 %`. Both are well below the previous 55 % single-blocker drop and read as surface texture, not stains.

### Validation

- `npm run lint` — clean.
- `npm run build` — clean (typecheck + Vite preview + HTML emitter); only the pre-existing Sass legacy-JS-API deprecation warning is emitted.
- Customer-preview IIFE regenerated (`customer-preview/freyraum-gallery.js` ≈ 558 KB / 142 KB gzip).
- No new npm dependencies.

### Enhancement slots left open (designed in, not enabled)

- **S4 — optional 3-ray PCF lateral filter.** `selfShadowFilterRadius` is in `QualityPreset` and defaults to `0.0`. The plan documents the GLSL chunk to enable when needed; turning it on for `raking-inspection` later is a preset value change plus the documented define.
- **Per-profile `shadowProfileScale` on `LightProfile`.** Currently `main.ts` derives the scale from `displayIntent`. A profile can later carry its own scale value and `main.ts` can read it directly.
- **Animated profile-scale fade.** The current call is instant. Future work can animate the uniform.
- **Authored height-map drop-in.** Works today without any shader change — the procedural fallback path will simply not be hit when an authored height is provided.

### Historical (initial stub)



This entry supersedes the initial stub. The v0.05 plan in `plan.md` has been upgraded to a full technical execution guide; this entry records the code-level findings that drove it.

### Code-level root cause (confirmed)

**File:** `src/materials/PaintingMaterial.ts`  
**Block:** `PAINTING_USE_SELFSHADOW` inside `lightsEndChunk` (lines ≈ 252–288)

The shader marches one ray through the height field toward the key light. On the first step where `_sampleH > _wantedH` it immediately sets `_shadow = 1.0 - uShadowStrength` and breaks. With the current high preset value of `selfShadowStrength: 0.55`, this means a single height-field step that fires reduces direct diffuse and direct specular to **45 %** of their unoccluded values.

Full issue table:

| Issue | Code evidence | Visual consequence |
|-------|--------------|-------------------|
| Binary hard cutoff | `if (_sampleH > _wantedH) { _shadow = 1.0 - uShadowStrength; break; }` | Any blocker → same massive darkening |
| No bias/deadzone | Comparison is `>` with no offset | Procedural height noise (peak-to-peak ≈ 0.04) self-shadows trivially |
| No penumbra softness | No `smoothstep` anywhere in the shadow loop | Transition from lit to shadowed is a hard step — reads as a sharp stain edge |
| No distance weighting | All loop steps produce the same `_shadow = 1 - strength` | Far and near blockers are equally damaging |
| No max-occlusion cap | Shadow can always reach `1 - 0.55 = 0.45` from a single blocker | Cannot restrict gallery-display max darkening |
| Strength too high for display | `selfShadowStrength: 0.55` in the high preset | 55 % dampening is excessive for a normal gallery view |

### v0.05 technical execution plan (summary)

The v0.05 plan in `plan.md` now specifies, file-by-file and line-by-line:

1. **S2 — `src/config/quality.ts`:** Add `selfShadowBias`, `selfShadowSoftness`, `selfShadowMaxOcclusion`, `selfShadowFilterRadius` to `QualityPreset`. Lower high-preset `selfShadowStrength` from 0.55 → 0.30.
2. **S3 — `src/materials/PaintingMaterial.ts`:**
   - New uniforms: `uShadowBias`, `uShadowSoftness`, `uShadowMaxOcclusion`, `uShadowProfileScale`.
   - New method `setShadowProfileScale(scale: number)` — called by `main.ts` on profile switch.
   - New method `setShadowDebug(enabled: boolean)` — compiles `PAINTING_DEBUG_SHADOW`.
   - Replace binary GLSL loop with accumulation loop using `smoothstep(0, softness, excess)`, reciprocal distance weighting, and `clamp(occlusion, 0, maxOcclusion)`.
3. **S4 (optional) — 3-ray PCF-like filter** gated by `selfShadowFilterRadius > 0` and `PAINTING_USE_SHADOW_FILTER` define.
4. **S5 — `src/main.ts`:** Call `setShadowProfileScale(0.5)` for display profiles and `setShadowProfileScale(1.0)` for inspection profiles in `applyPreferences()`.
5. **S6 — `src/main.ts`:** Add `s`/`S` debug key (alongside existing `a`) to call `setShadowDebug()`.

### New GLSL contract (v0.05 target)

```
occlusion = Σ( smoothstep(0, softness, sampleH - wantedH - bias) * (1 / (step + 1)) )
occlusion /= totalWeight
occlusion  = clamp(occlusion, 0, maxOcclusion)
shadow     = 1 - strength * occlusion * profileScale
```

With high-preset defaults (bias=0.03, softness=0.10, maxOcc=0.28, strength=0.30, profileScale=0.5):
- Maximum display darkening: `0.30 × 0.28 × 0.5 = 4.2 %` of direct light — subtle texture, not a stain.
- Inspection: `0.30 × 0.28 × 1.0 = 8.4 %` — soft relief.

Research URLs:

- LearnOpenGL — Parallax Mapping: https://learnopengl.com/Advanced-Lighting/Parallax-Mapping
- Three.js docs — `Material.onBeforeCompile`: https://threejs.org/docs/#api/en/materials/Material.onBeforeCompile
- Three.js parallax map example: https://threejs.org/examples/?q=paralla#webgl_materials_parallaxmap
- GPU Gems 3 — filtered/soft shadow-map concepts: https://developer.nvidia.com/gpugems/gpugems3/part-ii-light-and-shadows/chapter-8-summed-area-variance-shadow-maps
- StackOverflow — soft shadows for parallax occlusion shaders: https://stackoverflow.com/questions/37067278/soft-shadow-for-parallax-occlusion-shader

## 2026-05-17 - v0.04 implementation findings

- **The fake AO vignette is removed in code.** `ProceduralTextureFactory.generateAO()` now emits a neutral near-white AO texture (`237 + valueNoise * 18`) instead of computing `vignette = 1 - min(1, r2 * 0.55)`. This keeps the AO slot available while preventing procedural edge darkening on flat paintings.
- **The procedural checkerboard source is removed in code.** `generateNormal()`, `generateHeight()`, and `generateRoughness()` now use deterministic smoothstep value noise. No `sin/cos` periodic fields remain in those three map generators.
- **The noise path is dependency-free and deterministic.** `valueNoise2d()` interpolates integer lattice hashes from `latticeHash()` using `Math.imul` and unsigned bit mixing. The seed is derived from the existing artwork hash, so procedural maps stay stable across rebuilds and preset switches.
- **Clearcoat is now preset-gated.** `QualityPreset` gained `clearcoatEnabled`, `clearcoatStrength`, and `clearcoatRoughnessValue`; only high enables clearcoat. Balanced and battery keep the material matte and avoid the clearcoat cost.
- **Surface profiles are now functional metadata, not placeholders.** All built-in artworks set `surfaceProfile`, `GalleryManager` calls `PaintingMaterial.applySurfaceProfile()` after the race-protected load, and `InfoPanel` exposes a readable German surface label.
- **The authored map contract now supports future varnish scans.** `PaintingTextureSet`, `PaintingMapRole`, `ResolvedPaintingTextures`, and `TextureManager.preloadTextureSet()` support a `varnish` role that maps to Three.js `clearcoatMap`.
- **A high-preset height fallback gap was fixed.** `GalleryManager.shouldFillRole('height')` now generates a procedural height map whenever bump, parallax, or self-shadow needs it. This is required for reliable high-preset inspection without authored maps.
- **Validation evidence:** after `npm install`, `npm run lint` passes with only the known TypeScript parser warning; `npm run build` passes with only the known Sass legacy JS API warning. The regenerated preview bundle is ≈ 555.05 KB (gzip ≈ 141.43 KB).

## 2026-05-17 - v0.04 plan elevated to full technical execution guide (code audit)

The v0.04 section in `plan.md` has been rewritten from a high-level strategy into a file-by-file, function-by-function implementation guide. The following code-level findings drove the rewrite.

### Bug 1 — Fake AO vignette (confirmed code location)

`src/materials/ProceduralTextureFactory.ts`, `generateAO()`, lines 207–213:
```ts
const vignette = 1 - Math.min(1, r2 * 0.55);
```
`r2` is the squared normalized distance from the texture centre `(0,0)`. At the corners `r2 ≈ 2`, so `vignette ≈ 0`. At the centre `r2 = 0`, so `vignette = 1.0`. The result is a flat painting that is ~55 % darker at its corners than its centre — visible as the reported "dark spots" / vignette. The fix is to replace the vignette formula with a flat neutral value (`≈0.95`) plus value-noise grain. This eliminates all synthetic edge darkening while preserving the texture slot for future authored AO maps.

Active path: `quality.ts high.aoEnabled = true` → `GalleryManager` → `procedural.generate(id, 'ao', 1024)` → `PaintingMaterial.applyTextures()` binds result as `aoMap` at intensity `1.0`.

### Bug 2 — Periodic checkerboard / cross-hatch pattern (confirmed code location)

`generateHeight()` lines 119–121: `Math.abs(Math.sin(y * 0.12)) * 80` = horizontal bands; `Math.abs(Math.sin(x * 0.09)) * 30` = vertical bands. At 1024 px tile size with `RepeatWrapping` the combined result is a clearly visible half-wave grid when the painting is examined under raking light. `Math.abs(sin)` folds the sinusoid into a sawtooth of half-period arches — exactly what brush-stroke channels should NOT look like.

`generateNormal()` lines 95–98: two `sin(x*0.42*f)*cos(y*0.38*f)` octaves and a `sin((x+y)*0.11*f)` diagonal weave create a deterministic 2D lattice that repeats visibly at every resolution.

`generateRoughness()` lines 145–148: same pattern at lower amplitudes.

Fix: all three functions replaced with multi-octave value noise (smoothstep-interpolated integer lattice hash). The new `valueNoise2d()` + `latticeHash()` helpers are pure JS, no external dependency, seeded by the existing `hash(artworkId)`.

### Gap 1 — SurfaceProfile and clearcoat not wired

`artworks.ts` defines `SurfaceProfile` and every `Artwork` has `surfaceProfile?: SurfaceProfile`, but none of the four artwork entries set it. `PaintingMaterial` constructor hard-codes `clearcoat: 0.0` and never reads `surfaceProfile`. `quality.ts` has no clearcoat fields. Fix: add `clearcoatEnabled`, `clearcoatStrength`, `clearcoatRoughnessValue` to `QualityPreset`; add `applySurfaceProfile()` to `PaintingMaterial`; set `surfaceProfile` on all four artworks in `artworks.ts`; call `applySurfaceProfile()` in `GalleryManager` after artwork load.

### Gap 2 — No varnish map role in the texture contract

`PaintingMapRole` and `PaintingTextureSet` do not include a `'varnish'` slot. Three.js 0.166 `MeshPhysicalMaterial.clearcoatMap` accepts a grayscale texture for per-pixel clearcoat intensity. Fix: add `'varnish'` to the role union, the set interface, and the resolved-textures interface. `TextureManager.preloadTextureSet()` will automatically pick it up when added to the roles array.

### Noise algorithm (new, validated)

The `valueNoise2d(x, y, seed)` implementation uses smoothstep fade curves and bilinear interpolation from `latticeHash(ix, iy, seed)`. The hash function is a cascade of LCG multiply + XOR + Murmur-style mix using `Math.imul` (ES2016). Constants: 1664525, 1013904223, 1540483477, 0x45d9f3b. These are standard constants used in WebGL procedural noise implementations and produce good avalanche without any sin/cos dependency.

### File change count

11 files changed, no new npm dependencies, no changes to GLSL. See v0.04 section in `plan.md` for slice-by-slice execution instructions.

## 2026-05-17 - v0.04 photorealism follow-up: initial artifact diagnosis and research

- **The reported "dark spots / vignette" complaint matches the current procedural AO implementation.** `ProceduralTextureFactory.generateAO()` explicitly synthesizes a centre-bright / edge-dark radial mask ("Soft vignetted ambient-occlusion suggestion"). On a flat painting surface this reads less like real occlusion and more like a bug baked into the artwork, especially when no physical frame lip or recess justifies it.
- **The reported checkerboard / unnatural pattern complaint matches the current periodic procedural support maps.** `generateNormal()`, `generateHeight()`, and `generateRoughness()` are built from layered `sin/cos` waves and cross terms. This gives a deterministic fallback but also creates visibly synthetic repetition that can look like a checkerboard or woven shader texture instead of irregular pigment, canvas, or varnish structure.
- **Current v0.03 realism is still "procedural placeholder realism", not scan-grounded painting PBR.** The material is much better than v0.02/v0.01, but the remaining artifacts show that believable close-up painting surfaces likely need authored/scanned support maps or at least far quieter procedural fallback data.
- **Museum/conservation sources separate faithful display light from relief-reveal inspection light.** Raking light is valuable for showing brushwork, deformation, and condition, but it is not the everyday "true appearance" presentation mode. This supports keeping `gallery-soft` as the main lane and `raking-inspection` as the technical lane rather than merging them.
- **Cultural-heritage imaging sources point toward RTI / PTM / photometric surface capture when realism matters.** For future artwork packages, normal/specular/relief capture is a more credible direction than inventing stronger procedural weave.
- **Web PBR guidance still supports the current architecture choice.** Using Three.js `MeshPhysicalMaterial` as the base is the right direction; the problem is not "PBR vs non-PBR" but that the current support maps are too synthetic and that the AO fallback is not physically justified for a flat painting.

Research links captured for v0.04 planning:

- Library of Congress — Digital Imaging Workflow for Treatment Documentation: https://www.loc.gov/preservation/resources/ImageDoc/index.html
- CHS Open Source — Raking Light Photography: https://chsopensource.org/services/1-technical-photography-tp/raking-light-photography-rak/
- Hamilton Kerr Institute — Lighting Techniques: https://www.hki.fitzmuseum.cam.ac.uk/about/services/photographicservices/lightingtechniques
- Smithsonian MCI — Reflectance Transformation Imaging: https://mci.si.edu/reflectance-transformation-imaging
- discoverthreejs — Physically Based Rendering: https://discoverthreejs.com/book/first-steps/physically-based-rendering/
- Three.js MeshPhysicalMaterial clearcoatMap: https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial.clearcoatMap
- Rami James — Physically Based Rendering in Three.js: https://www.ramijames.com/learn-threejs/building-blocks/physically-based-rendering

## 2026-05-17 - v0.03 fresh-clone revalidation audit

- In a fresh checkout, `npm run lint` initially failed with `eslint: not found` because dependencies were not yet installed.
- In the same fresh checkout, `npm run build` initially failed before `npm install` because required packages such as `three` were missing from `node_modules`.
- After `npm install`, `npm run lint` passed successfully. The only output was the already-known `@typescript-eslint` warning that the current TypeScript version (`5.9.3`) is outside the parser's officially supported range; this is non-blocking.
- After `npm install`, `npm run build` passed successfully and regenerated the preview bundle. The build emitted the current non-blocking Dart Sass legacy JS API deprecation warning.
- Re-checking the generated bundle showed the v0.03 shader gates and uniforms (`PAINTING_USE_PARALLAX`, `PAINTING_USE_SELFSHADOW`, `PAINTING_DEBUG_ALBEDO_ONLY`, `uKeyLightDir`) now appear **12** times in `customer-preview/freyraum-gallery.js`. Earlier documentation that said 11 was stale and has been corrected.

## 2026-05-17 - v0.03 implementation findings

- **`geometryLightDirection` is not a Three.js built-in.** The v0.03 plan referenced this identifier inside Slice 5, presumably borrowed from a different engine. Three.js' fragment-shader chunks expose `vViewPosition`, `vNormal`, `vTangent`, and `vBitangent` (the latter two only when `USE_TANGENT` is defined, which happens automatically when the geometry has a tangent attribute *and* the material uses a normal map). For directional information the only correct path is to push a uniform from CPU side. The implementation now uses `uKeyLightDir` in **view space**, transformed each frame in `main.ts` via `worldDir.transformDirection(camera.matrixWorldInverse)` so it matches the space of `vTangent`/`vBitangent`/`vNormal`. Math-space contract is documented at the top of `PaintingMaterial.ts`.
- **Tangent computation must precede first material assignment.** Three.js inspects geometry attributes only when compiling the program. If `geo.computeTangents()` is called *after* the first material attach, `vTangent` varyings stay undeclared even after recompile because `vertexTangents` is sampled from the cached geometry-version snapshot. The implementation calls `computeTangents()` inside `makeArtworkGeometry` so the attribute exists before `new THREE.Mesh(geo, material)`.
- **`USE_TANGENT` requires `flatShading === false`.** Verified against `node_modules/three/src/renderers/webgl/WebGLPrograms.js:294`. Setting `material.flatShading = true` (we do not, but worth recording) would silently drop the varyings and break parallax.
- **Parallax and bump perturbation cannot share a height field amplitude.** The original v0.03 plan kept `bumpStrength = 0.035` on the high preset while also enabling parallax. The same height texture would have driven both UV displacement *and* normal perturbation, producing exaggerated relief. The "single source of truth per preset" rule from the plan was enforced by setting `bumpStrength = 0.0` on the high preset (parallax owns depth) and `parallaxEnabled = false` on the balanced preset (bump owns depth). Battery preset disables both.
- **`vMapUv` vs `vNormalMapUv` agree because both maps use uv0.** Three.js maintains separate varyings per map slot but they collapse to the same value when both maps sample uv channel 0. The parallax injection still uses `pUV` for both samples explicitly so a future move of the normal map to uv1 (e.g. for AO) does not silently desynchronise relief from shading.
- **`SpotLight.target` defaults to a detached `Object3D`.** A `THREE.SpotLight` constructed without an explicit target receives a fresh `Object3D` at world origin, but that target is **not** added to the scene. Animating the spot position works, but if anything ever needed to read `spot.target.position` it would silently disagree with the world. `LightingSetup` now owns a single shared `spotTarget` added to the scene; every spotlight points at it. This is the audited fix for the latent bug introduced by repositioning keys closer to the artwork.
- **Procedural cache must key on resolution.** `ProceduralTextureFactory.generate(id, role)` was unique per artwork+role in v0.02. When v0.03 added per-preset resolutions a user switching from battery (256 px) to high (1024 px) would have continued to receive the 256 px texture. The cache key now includes `tileSize` so each resolution is generated and cached independently.
- **Reduced-motion should not flatten shadows.** The detail-normal contribution is scaled by `uReducedMotionScalar` because animated detail can be a vestibular trigger. Direct-light self-shadow is *not* scaled — shadows are not motion, and silencing them would corrupt the picture's perceived relief in a way that contradicts accessibility intent (clarity, not flattening).
- **Albedo-only QA toggle belongs in a debug lane, not the visitor UI.** Exposing an "no shading" toggle to public visitors would create a fidelity contradiction (the painting suddenly looks different). The implementation gates it behind `?debug=1` URL param and an `a` key press, with a `console.info` line announcing availability when the param is present. The lighting profile selector, by contrast, IS a legitimate visitor choice and lives in `PreferencesPanel` under "Beleuchtung".
- **Inspection overscroll vs safety margin.** v0.02's `PAN_SAFETY_FACTOR = 0.92` multiplied the available pan range by 0.92, leaving an 8 % unreachable band around the artwork. v0.03 replaces this with an additive `INSPECTION_OVERSCROLL = 0.5` (world units) so the viewport centre can reach the artwork edge plus a small breathing margin — this is the formula the plan's "every corner reachable" acceptance criterion was actually asking for.
- **Validation evidence (2026-05-17):** `npm run lint` clean; `npm run build` clean. Customer-preview bundle `freyraum-gallery.js` ≈ 552 KB (gzip ≈ 141 KB), CSS ≈ 15.4 KB (gzip ≈ 3.4 KB). Bundle growth from v0.02 (~528 KB) accounts for the new parallax and self-shadow shader chunks, the lighting profile UI strings, and `?debug=1` plumbing.

## 2026-05-17 - Local preview architecture

- A plain Vite application entry is not sufficient for customer handoff when the site must open directly from `file://`.
- The repository therefore needs two entry paths:
  - `app.html` for development with Vite
  - root `index.html` as a launcher to the committed preview build
- The committed preview should avoid browser module resolution edge cases by using a classic script bundle.

## 2026-05-17 - Gallery interaction limits

- Hardcoded zoom and pan numbers were not robust enough for mixed artwork formats.
- Correct pan behavior must be derived from actual fitted artwork dimensions, viewport aspect ratio, and camera FOV.
- A deep zoom limit must keep the camera in front of the artwork plane to avoid invalid inspection states.
- Hover/rotation control should not disappear at certain zoom levels; instead it should be reduced in strength when close-up inspection is active.

## 2026-05-17 - Side preview fitting

- Fixed-size preview geometry causes visible stretching on portrait, square, and ultra-wide artworks.
- Aspect-ratio-preserving scaling is the minimum acceptable solution for the current preview rail.
- Future refinement may still improve perceived balance by adding framed preview containers or elegant crop rules for extreme formats.

## 2026-05-17 - v0.01 execution outcomes

- Structured artwork metadata can stay local-static while still mapping 1:1 to a future CMS schema. Required fields (`id`, `title`, `subtitle`, `description`, `year`, `medium`, `image`, `dimensions`, `alt`, `credit`, `tags`) cover the info panel, timeline, alt text, and content audit needs. Locale/translation fields are deliberately deferred — adding them now would create dead optional fields and pollute the v0.01 contract.
- The SVG-based embedded artwork generator delivers acceptable "final" v0.01 visuals without binary asset weight or `file://` loading edge cases. Treating it as the final asset pipeline avoided introducing image compression tooling that would not pay off until real customer artwork lands. The metadata-driven generator keeps every artwork's dimensions, palette, and aspect ratio centralized in `config/artworks.ts`.
- Timeline thumbnails need both intrinsic aspect ratio handling **and** a fixed frame size. A pure aspect-ratio approach caused width changes in the scroll strip and unstable focus targets. The implemented compromise — fixed 150 × 95 frame with the artwork rendered inside using its real aspect ratio and a shimmer skeleton — preserves layout while still respecting the artwork shape.
- The system `prefers-reduced-motion` media query is necessary but not sufficient. Users may want reduced motion during a presentation independent of OS settings, so the preferences store also exposes an explicit override that takes precedence and is mirrored to `data-motion` on `<html>` for SCSS to react.
- `prefers-contrast: more` is supported in modern browsers but inconsistent on Linux desktops, so high contrast also has an explicit toggle. The high-contrast theme is implemented as token overrides rather than a parallel stylesheet to keep maintenance cost low.
- A `data-presentation="on"` attribute on `<html>` is the lightest way to express "we are in customer demo mode" to CSS. It avoids JavaScript-driven class juggling and lets future surfaces opt into presentation polish with a single selector.
- Quality presets must be subscribed by every subsystem that owns expensive GPU work. Routing presets through a `QualityPreset` object instead of separate booleans makes future additions (e.g., MSAA, depth-of-field) a single field change rather than a refactor.
- The WebGL fallback must be installed **before** the loading overlay so the customer never sees a hanging spinner. The implementation now detects WebGL first, renders the fallback directly into `#app`, and bails out of the bootstrap chain.
- The fullscreen API is well supported but its exit can be triggered by the browser (e.g., Escape, OS gesture); the implementation listens for `fullscreenchange` so the `aria-pressed` state stays accurate regardless of who initiated the exit.
- The architecture diagram lives as a hand-authored SVG so it renders inline on GitHub without a build step and stays diff-friendly. Automated generation is reserved for a future pass.
- Validation results: `npm run lint` clean; `npm run build` clean; bundle grew from ~511 KB (gzip 129 KB) to ~528 KB (gzip 134 KB), within the v0.01 budget. CSS grew from 4.5 KB to 15.4 KB (gzip 3.4 KB) because of the design system, focus-visible rules, contrast theme, presentation mode, and timeline skeleton.

## 2026-05-17 - v0.01 execution planning

- The remaining v0.01 work should be planned as vertical slices, not horizontal refactors.
- The structured artwork metadata model should be implemented before final assets, thumbnails, accessibility labels, and screenshots because those later slices depend on stable content fields.
- WebGL fallback, quality presets, fullscreen mode, and documentation screenshots are all suitable v0.01 slices, but each should stay narrowly scoped and reserve larger systems for future passes.
- A future CMS should not be implemented in v0.01; v0.01 should only prepare a local static metadata model that can later map to CMS fields.
- Documentation screenshots and architecture diagrams should be treated as a customer handoff slice, not as incidental polish.


## 2026-05-17 - v0.02 shader and WebGPU planning findings

- Realistic painting rendering should not be treated as a single stronger normal map. The future implementation needs a full material texture set: albedo, base normal, detail normal, height/bump, roughness, specular, and optional ambient occlusion. Each map has different color-space rules and performance cost.
- WebGL should remain the production renderer for v0.02 because it is already integrated, broadly available, and compatible with the current file-based customer preview. WebGPU should be introduced only as an experimental, dynamically imported backend probe so unsupported browsers continue on WebGL with no user-visible breakage.
- The most realistic lighting improvement is likely from raking/low-angle inspection profiles plus roughness/specular maps, not from simply raising light intensity. Unclamped highlight strength could wash out the artwork and fight the current bloom pass.
- Performance budgets must be shader-specific. Balanced mode should target no more than roughly 5–6 fragment texture reads for artwork material; battery mode should target roughly 2–3 reads and compile out optional AO/grazing/detail paths with defines where possible.
- Procedural fallback maps are important even when authored maps are planned. They let future contributors build and tune material behavior before final scanned texture assets exist, and they keep the local preview robust when maps are missing.
- A frame-budget monitor should be implemented before adaptive quality. Without rolling FPS data, automatic downgrades would be guesswork and could create unstable quality changes during loading or navigation spikes.
- WebGPU adapter/limit reporting can be useful in development, but it should not run during normal customer preview startup. Requesting adapters or probing limits should be opt-in to avoid startup overhead and permission/browser quirks.
- The existing v0.01 quality preset structure is a good extension point for shader variants. v0.02 should extend it instead of creating a separate material-quality system.
- Documentation must clearly distinguish stable WebGL material work from experimental WebGPU exploration so customer demos are not blocked by emerging browser support.

## 2026-05-17 - v0.02 codebase analysis findings

- `TextureManager.prepareTexture()` sets `SRGBColorSpace` for every texture unconditionally. This must be changed before any non-albedo maps (normal, height, roughness, specular, AO) are loaded — they must use `LinearSRGBColorSpace` otherwise Three.js applies sRGB gamma expansion to linear data, breaking PBR lighting.
- `ArtworkMesh` constructs a `THREE.MeshPhysicalMaterial` inline with hard-coded `roughness: 0.88`, `metalness: 0`, `clearcoat: 0.04`. These values are not owned by any preset or uniform. v0.02 must move all material parameters into `PaintingMaterial` under `QualityPreset` or `PaintingTextureSet` ownership.
- The current `CanvasMaterial` generates only a 128×128 sinusoidal normal map. At segments=240 (high preset) the artwork mesh is detailed enough that a low-resolution repeating normal map will alias visibly at close zoom. v0.02 should upgrade to 256×256 for base normal and 256×256 for detail normal, both tiled at different rates.
- `LightingSetup` has no concept of light profiles or named modes. The spotlight position is hard-coded in the constructor. Adding named profiles via a `LightProfile` interface and `setProfile(id)` method is low-risk and fully backward-compatible because the default profile reproduces the current hardcoded values.
- `QualityPreset` has no shader-level fields. Adding `shaderVariant`, `normalStrength`, `detailNormalStrength`, `bumpStrength`, `specularStrength`, `anisotropyDivisor`, `aoEnabled`, `grazingBoostEnabled`, and `detailNormalEnabled` is a non-breaking additive change — existing consumers of `QualityPreset` that don't read these fields will compile without changes.
- The animation loop in `main.ts` passes `now` (the rAF timestamp) to `lightingSetup.update(now)` but not to any performance measurement system. `FrameBudgetMonitor.tick(now)` should be the first call inside the loop to get the most accurate frame-delta measurement.
- Three.js 0.166 `onBeforeCompile` is the correct and stable pattern for augmenting `MeshPhysicalMaterial` shaders. The chunk names `roughnessmap_fragment`, `normal_fragment_maps`, and `aomap_fragment` exist in 0.166. Any implementor must verify chunk names against `node_modules/three/src/renderers/shaders/ShaderChunk/` before writing string replacements.
- `specularColor` variable availability in the fragment shader depends on the injection point. If injecting before `lights_physical_fragment`, use `specularIntensityFactor` which is set earlier. If injecting after, `specularColor` is available. The exact variable name should be confirmed by reading the Three.js 0.166 chunk source during implementation.
- The `CanvasMaterial` class can be deprecated once `PaintingMaterial` and `ProceduralTextureFactory` are in place. It should not be deleted until Slice 3 is merged and verified.
- Adaptive quality must not trigger during loading or navigation spikes. `FrameBudgetMonitor.markNavigation()` should be called from `GalleryManager.navigate()` and `goTo()` so the slow-frame accumulator resets and prevents false downgrades triggered by artwork-transition cost.

## 2026-05-17 - v0.02 implementation findings

### Shader strategy: native-first

The audited plan recommended an `onBeforeCompile` GLSL injection of roughness, specular, AO, detail normal, bump, and grazing-light. The actual implementation in `PaintingMaterial.ts` is **smaller**: only the detail-normal blend, bump-after-normalMap path, and grazing boost are injected. Albedo / base normal / roughness / specular / AO are wired through native `MeshPhysicalMaterial` properties (`map`, `normalMap`, `roughnessMap`, `specularIntensityMap`, `aoMap`). This is more reliable because:

- Three.js' built-in roughness, specular, and AO chunks are correct and well tested.
- Three.js handles colour-space conversion correctly only when the property is set natively.
- Fewer string replacements means fewer chances of breaking when Three.js updates shader chunks in a future minor.

The same correctness rules from the audited plan still apply (the detail normal is blended in tangent space before `tbn * mapN`, never added to the view-space normal).

### Bump + normal coexistence (the audited correctness fix)

Three.js' `normal_fragment_maps` chunk is structured as `if (USE_NORMALMAP_OBJECTSPACE) … elif (USE_NORMALMAP_TANGENTSPACE) … elif (USE_BUMPMAP)`. With both `normalMap` and `bumpMap` set, the native bump branch is dead code, but Three.js still declares `dHdxy_fwd()` and `perturbNormalArb()` because `USE_BUMPMAP` is defined. We exploit this: after the tangent-space normal branch finishes, our `PAINTING_USE_BUMP` injection calls `perturbNormalArb(-vViewPosition, normal, dHdxy_fwd() * uBumpStrength, faceDirection)`. The native `bumpScale` uniform is left at `1.0` and we drive the strength through our own uniform so the preset can vary it without recompile.

### Aspect-ratio robustness — practical outcomes

- The existing `fitWithinBox`/`updateAspect` machinery already covered all aspect ratios for v0.01 — the v0.02 work added one new aspect-aware quantity: detail-normal tiling. Without aspect-aware tiling, an ultrawide painting (7:3) would show canvas weave stretched 2.33× along U vs V. The fix is `uDetailTiling = vec2(width × density, height × density)` so each UV step covers the same physical distance in both axes. Density is currently `2.0` tiles per world unit and looks correct on all four sample artworks (3:2, 3:4, 1:1, 7:3).
- Frame margin is uniform `0.4` world units on both axes regardless of aspect; the frame box itself is scaled with the same per-axis ratios as the artwork plane.
- Anisotropic filtering capped at `maxAnisotropy / divisor` per preset prevents tilted-view aliasing on landscape and ultrawide artworks (where horizontal raking light makes mip-level discontinuities most visible).

### Texture-resolution handling

- `getTextureSize` reads `naturalWidth/naturalHeight` first, falling back to `width/height` for `ImageBitmap` / `DataTexture` / `CanvasTexture`. This works for every texture type the application creates and is unchanged from v0.01.
- The texture cache key in `TextureManager` is now `${role}::${url}` so the same underlying file loaded as `albedo` vs `normal` does not collide (the two carry different colour spaces).
- `DataTexture` instances from `ProceduralTextureFactory` enable mipmaps and `LinearMipMapLinearFilter`, so the procedural canvas weave does not alias on close zoom or at oblique view angles.

### Lifecycle / async correctness

- `GalleryManager.showArtwork` is now async and uses an `artworkLoadToken` counter — a stale completion is silently dropped. This was the audited race fix; without it, navigating rapidly during a long `preloadTextureSet` could assign the previous artwork's map set to the current artwork.
- `ArtworkMesh.dispose` only disposes geometry and the material; painting textures are never disposed by the material. Disposal is owned by `TextureManager` and `ProceduralTextureFactory`; `main.ts` calls `galleryManager.proceduralFactory.disposeAll()` on `beforeunload`.

### Adaptive quality — guardrails learned during implementation

- The cooldown after a navigation or preset change must be long enough to cover both the artwork texture transition AND the shader recompile spike that happens when `definesChanged` triggers `material.needsUpdate = true`. A 600 ms navigation cooldown plus a 4000 ms post-downgrade hold-off prevents cascade downgrades.
- Manual preset changes must suspend the controller for the rest of the session; otherwise an automatic re-downgrade reverses the user's intent within a few seconds. The first implementation compared only `previousQuality` against the new value, which accidentally made the controller suspend itself on its own downgrade. The corrected implementation adds an explicit `adaptiveQualityWriteInFlight` flag in `main.ts` so only genuine user-initiated quality changes count as manual overrides.
- Quality-preset changes must rebuild the currently visible artwork's resolved map set immediately. Without that extra step, switching from `high`/`balanced` to `battery` could leave roughness/specular/detail maps attached on the current artwork until the user navigated away and back. `GalleryManager.applyPreset()` now re-runs `showArtwork(currentIndex)` (race-protected by `artworkLoadToken`) so preset transitions are correct instantly.
- Per-preset anisotropy changes must update already-cached textures, not just future loads. `TextureManager.setAnisotropyDivisor()` now reapplies the new anisotropy cap across the cache.

### WebGPU probe — what it actually proves

- The probe is informational only and never participates in rendering. With `?backend=webgpu` it logs adapter info and limits on supporting browsers.
- The first implementation attempt kept the probe in `src/rendering/WebGPUPrototype.ts`, but a deep audit showed that the repository's **IIFE file:// preview build cannot rely on Rollup code splitting** for this guarantee. The corrected implementation moves the probe to `public/webgpu-probe.js` and loads it via `import(/* @vite-ignore */ new URL('./webgpu-probe.js', window.location.href).toString())`. That keeps the probe completely out of `customer-preview/freyraum-gallery.js`.
- The probe-result shape uses plain `string`/`number` fields rather than DOM `GPUAdapterInfo` types so it stays serializable across TypeScript DOM-lib versions and is safe to log/persist.

### Validation results (this session)

- `npx tsc --noEmit` — clean.
- `npm run lint` — clean.
- `npm run build` — clean. Output:
  - `customer-preview/style.css` — 15.36 kB / gzip 3.42 kB (unchanged)
  - `customer-preview/freyraum-gallery.js` — 546.50 kB / gzip 139.68 kB (up from ~528 kB / 134 kB in v0.01)
  - `customer-preview/webgpu-probe.js` — 2.32 kB (separate runtime-only experimental probe module)
- The bundle growth is consistent with the budget (~+18 kB raw / +6 kB gzipped). Three.js itself dominates the bundle; the new modules are a small overhead on top.
- Deep preview audit confirmation: `customer-preview/freyraum-gallery.js` contains the runtime `import(new URL('./webgpu-probe.js', window.location.href).toString())` call but does **not** contain the probe implementation (`requestAdapterInfo`, limit enumeration, `initWebGPUPrototype` body). The probe code lives only in `customer-preview/webgpu-probe.js`.
- `Artwork.textureSet?` is the integration point for future authored asset sets. No code changes will be needed when scanned assets become available; only `public/assets/...` files and a `textureSet` value in `artworks.ts`.

## 2026-05-17 - v0.02 final audit findings

- The first v0.02 technical draft was strong structurally but had several implementation-risk gaps: shader-space correctness for detail normals, bump perturbation accuracy, specular chunk-scope assumptions, async artwork-load races, and texture ownership/disposal boundaries. The final audited plan now covers all of these explicitly.
- Dynamic imports in Vite are not the same as "never bundled". The correct requirement for debug tooling is "never eagerly imported or requested" during normal preview use. This wording matters because reviewers otherwise look for a guarantee the bundler cannot provide.
- Stable WebGPU planning should prefer serializable probe-result shapes over exact DOM WebGPU types in the public contract. Browser support and TypeScript DOM libs move independently; a probe object that is easy to log and persist is a more robust plan boundary.
- Texture/asset plans need explicit stale-load protection in interactive galleries. Without an artwork-load token or equivalent cancellation strategy, rapid navigation can produce visually incorrect map assignment even when every individual loader works correctly.
- Resource ownership must be written down in the plan, not inferred during implementation. `TextureManager`/`ProceduralTextureFactory` should own cached textures; materials should only reference them.

## 2026-05-17 - audit validation outcomes

- In this fresh clone, `npm run lint` initially failed because dependencies were not installed (`eslint: not found`). This was an environment/setup issue, not a repository lint failure.
- In this fresh clone, `npm run build` initially failed before `npm install` because required packages such as `three` were not available in `node_modules`. This was also a setup issue.
- After `npm install`, `npm run lint` passed successfully and emitted only the already-known `@typescript-eslint` warning about TypeScript `5.9.3` being outside the parser's officially supported range.
- After `npm install`, `npm run build` passed successfully and regenerated the local preview. The build emitted the current Dart Sass legacy JS API deprecation warning.
- `npm install` reported 2 moderate vulnerabilities in the dependency tree. No dependencies were changed in this audit pass, but the toolchain should be reviewed in a future dependency-maintenance slice.

## 2026-05-17 - v0.03 execution plan finalization

The v0.03 plan was finalized into a code-execution-ready document after reading all 12 source files it references. The following code-level observations were made that directly informed the execution plan:

- `PaintingMaterial` constructor uses `clearcoat: 0.04`, `specularIntensity: 1.0`, `uLightGrazingBoost: 0.6` — these are the exact values that make the default render feel varnished/glossy. All three must be lowered for the matte-canvas goal.
- `ProceduralTextureFactory.generateRoughness` currently outputs values in the `[60..220]` range (a wide range that includes semi-gloss territory). The `generateSpecular` Gaussian blobs peak at `200` over a `12` baseline. Both are too prominent for a matte-first material.
- The current `gallery-soft` key light at `{ x: -10, y: 5, z: 7 }` has an angle from vertical of approximately **68°**. This is theatrical and dramatic but not gallery-appropriate. A true museum 30° key would require `{ x: -1.7, y: 5, z: 2.9 }` (using tan(30°)); a practical 45° compromise that retains enough asymmetry for relief readability during pan/zoom is `{ x: -3, y: 5, z: 4 }`.
- `GalleryManager.getPanLimits` multiplies by `PAN_SAFETY_FACTOR = 0.92`. This is the only thing preventing edge/corner inspection. Replacing with `artworkEdge + INSPECTION_OVERSCROLL (0.5 world units)` is a one-line change.
- `QualityPreset.bumpStrength = 0.012` (high preset) is too subtle for visible parallax depth feel. The execution plan raises this to `0.035`.
- `ArtworkMesh.makeArtworkGeometry` does not call `computeTangents()`. This must be added before parallax is implemented because `vTangent` attribute is required.
- `ProceduralTextureFactory.generate()` cache key is `artworkId::role`. It must be extended to `artworkId::role::tileSize` before the tile size is parametrised to avoid stale cache hits when switching presets.

## 2026-05-17 - v0.03 technical rendering and lighting follow-up findings

- The current v0.02 material already preserves the original artwork as the albedo texture, but the combination of bloom, clearcoat, specular maps, and grazing-light amplification can still change the *perceived* character of the picture. Future work therefore needs an explicit fidelity lane (`albedo-only` vs `shaded`) so the team can prove the shader is not reinterpreting the source art.
- The current relief path is technically correct but visually limited: tangent-space detail normals plus derivative bump perturbation are active, yet the fallback `normal`, `detailNormal`, and `height` maps are only 256 px tiles. This means zoomed inspection quality is bounded by the fallback generator, not by the current artwork image resolution.
- The current procedural system is deterministic, but not yet resolution-aware. `ProceduralTextureFactory` caches by `artworkId::role`; v0.03 should expand this to include preset tier, target tile size, octave recipe, and surface profile so future modular artwork swaps do not depend on the shipped sample assets.
- The requested 3D feeling is better framed as a preset-gated **parallax occlusion mapping style** path, not geometric displacement. For the current Three.js/WebGL production target, the most practical high-end route is tangent-space UV offset from a height field plus a short light-direction self-shadow approximation, with the existing normal+bump path retained as balanced/battery fallback.
- Self-shadowing should modulate direct light only, never darken the albedo texture directly. This preserves picture fidelity while still letting raking light reveal surface depth.
- The current pan limitation is directly caused by `GalleryManager.getPanLimits()` multiplying the free range by `PAN_SAFETY_FACTOR = 0.92`. v0.03 should replace this with explicit inspection-bound math based on visible world size, artwork size, zoom level, and a configurable overscroll margin.
- Future asset swaps must not rely on today's source image sizes. The correct abstraction is an **effective texel density** / surface profile system that chooses authored or procedural support maps based on zoom, display size, and preset, not on hard-coded assumptions about the current images.
- The current lighting presets are useful but too loosely specified for the new goal. `gallery-soft` is artistic, `raking-inspection` reveals relief, but v0.03 should define a more explicit gallery-display contract: artistic key/fill composition, glare-aware placement, and enough asymmetry that surface detail remains readable while the artwork is moved on screen.

### Online lighting research captured for v0.03

The lighting direction above is now backed by online gallery-lighting guidance gathered during this session:

- A **primary lighting angle around 30° from vertical** is commonly recommended for paintings because it reduces glare and reflected hotspots while still modelling the surface.
- **Warm-white lighting around 3000–3500 K** is commonly recommended for painting display because it feels gallery-appropriate and flattering without becoming obviously yellow or cold.
- **High CRI (90–95+)** is preferred in physical gallery installations for faithful colour appearance; in the renderer this should be treated as a visual target for colour-faithful lighting rather than a literal API property.
- **Raking light** is specifically used when the goal is to reveal texture, brushwork, impasto, craquelure, and other surface features. That makes it the right reference model for the v0.03 inspection profile, not for the default display profile.
- The practical implication for Freyraum is to separate **gallery-display lighting** from **relief-inspection lighting** instead of trying to make one light setup solve both perfectly.

### Sources consulted

- [UNION Fine Art Services — Optimal Lighting Angles for Art Installation](https://unionfas.com/optimal-lighting-angles-for-art-installation/)
- [Encore Lighting — Art Gallery Lighting Complete Guidelines](https://encore-lite.com/art-gallery-lighting-guidelines/)
- [ASM Lighting — Museum Lighting Standards & LED Solutions](https://www.asmlighting.com/museum-lighting-standards-led-solutions/)
- [Conserv — Museum Lighting Ultimate Guide](https://conserv.io/museum-lighting/)

## Validation notes

- This audit pass changed markdown documentation only; no runtime source files or dependencies were modified.
- In this session, `npm install`, `npm run lint`, and `npm run build` were executed successfully after dependency installation, so the documented validation notes now reflect an actual fresh-clone audit run.
- Automated code review and CodeQL validation should still be run before finalizing because the repository workflow validates all committed changes.
