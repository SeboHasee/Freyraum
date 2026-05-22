# DOCUMENTATION RULES
> Last full markdown audit: 2026-05-22 (v0.29 runtime implementation shipped — metallic PBR frame M-01..M-08 completed; lint/build pass).

## v0.29 documentation requirement — preload claims must prove presented frames

Any future documentation that says the gallery is “fully loaded”, “fully preloaded”, “smooth on first use”, or “rendering behind the loading screen” must include the exact readiness boundary. It must state whether the claim covers network fetch, decode, procedural generation, material apply, shader compile, GPU texture upload, final post-processing render, browser presentation, and UI/control prebuild.

v0.29 is marked shipped because runtime code now emits diagnostics proving: RAF started before loader reveal, at least two full-size frames were presented behind the opaque overlay, all artworks were warmed through the final render path, and no post-entry warm queue remained for the target gallery.



## v0.23 documentation requirement — performance claims

Performance documentation must name the coverage boundary. If a fix is capped by artwork count, memory budget, quality preset, or browser API support, state the cap and the fallback behavior. Use `plan.md` for open performance plans and `FINDINGS.md` for source-referenced audit evidence.

## v0.22 — shipped (2026-05-21) — Improved Preloading + Press-to-Start

Current status: shipped. Runtime now preloads albedo plus PBR texture sets for the first 15 artworks under the loading overlay, warms each cached artwork texture set on the GPU before reveal, keeps the branded loader visible for at least 500 ms, and waits for the accessible "Galerie betreten" button before entering the gallery. Validation: `npm run lint` and `npm run build` passed after implementation; `npm audit --audit-level=moderate` still reports the known Vite/esbuild development-server advisory that requires a semver-major upgrade.

## v0.21 — implementation shipped (2026-05-21)

Current status: shipped. The v0.21 plan is implemented in runtime code and documentation: branded progress loading overlay, Three.js LoadingManager progress, pre-reveal GPU warm render + awaited shader prewarm, audio `preload='auto'`, adjacent/idle PBR prefetch, lighting resume clamp, WebGL restore status, max-texture diagnostics, shader precision guard, 16K importer guidance, global pointer tracking, timeline arrows/counter/edge fades/responsive sizing/virtualized large-list rendering, and cleanup for added global listeners. Future-only boundaries remain LOD/tiled streaming for device-limited 16K detail and grouped/page timeline navigation for very large exhibitions.


## v0.20.8 — Complete v0.20 implementation shipped (2026-05-21)

Current status: shipped. The v0.20.7 gap-closure plan is now implemented in code and this file was refreshed during the all-markdown sync. Remaining v0.20 audio/control quality gaps are closed: fade targets clamp to the 0.30 effective-gain ceiling, diagnostics include display percent, preference patching updates non-slider controls during volume drags, sliders expose German percent value text, zero-volume recovery logs stored/recovered values, first-interaction recovery also covers pre-play audio, unmute resumes within `BackgroundAudioManager`, slider fill CSS stores percentages, and the ended-loop fallback fade is shortened to 50 ms. F-09 was confirmed correct and required no code change.

## v0.20 — Full documentation check-up (2026-05-20, audit complete)

## v0.18 — Customer sidecar text shipped (2026-05-20)

Current status: shipped. The importer (`scripts/import-artworks.mjs`) reads same-basename `.txt` sidecars (`.md` accepted as a backup) and merges customer-facing metadata into the generated manifest. Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned. Canonical plan: `plan.md § v0.18`. Research log: `FINDINGS.md § 2026-05-20`. Customer guide: `docs/CUSTOMER_TEXT_GUIDE.md`. Template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.

## Current policy

### Rule

Always document meaningful repository work for future development.

### Required updates for every meaningful implementation

1. Update `plan.md`
   - current scope
   - findings
   - implemented items
   - remaining items
2. Update `CHANGELOG.md`
   - add version/date entry
   - summarize added, changed, and fixed work
3. Update `FINDINGS.md`
   - note technical discoveries, caveats, and validation outcomes
4. Update `README.md`
   - when user-facing setup, controls, architecture summary, or workflow changed
5. Update this file
   - only when the documentation policy itself changes

### Quality expectations

- documentation must reflect the code that was actually committed
- documentation should mention remaining limitations, not only successes
- plans should distinguish implemented items from future items
- changelog entries should be concise but specific
- findings should capture reusable technical knowledge for later contributors
- if a user reports a customer-facing feature failure after implementation,
  document it as a first-class follow-up with observed behavior, expected
  behavior, likely failure boundary, diagnostics needed, and acceptance checks

### Additional rule for technical planning documents

When adding future implementation plans for rendering, performance, shaders, WebGPU, asset pipelines, or other high-risk architecture work, document:

- goals and non-goals
- proposed modules/files
- implementation order as vertical slices
- performance budgets and measurement strategy
- accessibility impact
- fallback behavior
- acceptance checks
- known risks and reserved future-pass boundaries
- shader/math-space assumptions when shader code or rendering equations are planned
- resource ownership, disposal boundaries, and async race handling for texture/material pipelines
- browser/API stability boundaries for experimental features and debug-only tooling
- diagnostics/logging design: log levels, signal-to-noise boundaries, retention/buffering strategy, and developer activation path
- performance planning must explicitly state measurement strategy, fidelity-preservation boundaries, compatibility/fallback behavior, and resource ownership/disposal assumptions

## Latest documentation pass

- 2026-05-21 (documentation): v0.20.5 audio regression audit completed. Re-ran `npm install`, `npm run lint`, and `npm run build`; confirmed that the current runtime still fails the reported startup-volume, mute/unmute, slider-sync, and control-placement expectations. Added a detailed recovery plan to `plan.md`, logged root causes and acceptance checks in `FINDINGS.md`, and refreshed repository markdown so docs no longer claim the current audio behavior is fully fixed. No runtime code changed.

- 2026-05-20 (documentation): v0.20.3 technical planning hardening completed. Audited `src/main.ts`, `BackgroundAudioManager`, `PreferencesStore`, `PreferencesPanel`, `AudioControls`, and related SCSS boundaries; expanded `plan.md` with implementation-ready coding slices (volume mapping contract, slider continuity refactor, fade envelope transitions, control-placement policy, diagnostics expansion). Logged deep findings in `FINDINGS.md`, updated top-level status docs, and refreshed markdown audit stamp text across all `.md` files. No runtime code changed.

- 2026-05-20 (documentation): v0.20.2 audio UX follow-up planning sync completed. Added a dedicated planning section for calm-start audio defaults, UI-vs-effective volume mapping, control-placement refinement, settings-slider continuity, and fade envelope handling. Logged code-audit and online research findings in `FINDINGS.md`. Updated top-level status notes and refreshed markdown audit stamp across all `.md` files. No runtime code changed.

- 2026-05-20 (documentation): v0.20.1 full markdown audit completed. Every repository markdown file was re-checked and updated with a shared audit stamp plus refreshed top status notes to keep v0.20 context consistent. Validation rerun in this audit session: `npm install`, `npm run lint`, `npm run build`. No runtime code changed.

- 2026-05-20 (implemented): v0.19 background-audio workflow shipped. Added importer audio ingestion (`customer-audio/inbox`), generated preview payload (`customer-preview/customer-audio.js`), preview HTML/stub wiring, runtime `BackgroundAudioManager` with diagnostics + loop fallback + autoplay handling + lifecycle suspend/resume integration, persisted `audioMuted`/`audioVolume` preferences, and preferences-panel mute/volume controls with status messaging. Validated with `npm run lint` and `npm run build`.

- 2026-05-20 (implemented): v0.18 customer sidecar text shipped. `scripts/import-artworks.mjs` now reads same-basename `.txt` sidecars (`.md` accepted as backup, `.txt` wins on duplicates) and merges customer-facing fields (`title`, `subtitle`, `description`, `year`, `medium`, `alt`, `credit`, `tags`, `surfaceProfile`) into the generated manifest. Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned. `customer-artworks/last-import-report.txt` gained `Text applied`, `Pictures missing text`, `Text files without matching pictures`, `Text fields needing attention`, and `Duplicate text files` sections. `docs/CUSTOMER_TEXT_GUIDE.md` rewritten as the shipped how-to-import-text walkthrough. `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt` aligned with the shipped parser contract. All v0.18 banners across `README.md`, `CHANGELOG.md`, `plan.md`, `FINDINGS.md`, `docs/HANDOFF.md`, `docs/IMAGE_MAINTENANCE_GUIDE.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, `DOCUMENTATION_RULES.md`, `ARCHITECTURE_MAP.md`, `AI_RULES.md`, and `LESSONS_LEARNED.md` updated from "planned" to "shipped". Validated `npm run lint`, `npm run build`, and a fixture importer run covering matched/missing/orphan/duplicate sidecars plus invalid `Year`/`Surface`/blank `Alt`/multi-line `Description`.

- 2026-05-20 (documentation): v0.18 sidecar-text plan finalized after a complete codebase audit. Revalidated the importer-only implementation path against `scripts/import-artworks.mjs`, `src/main.ts`, `src/config/artworks.ts`, `src/ui/InfoPanel.ts`, and current online Node/accessibility/metadata guidance. Cleaned the plan, added explicit cleanup/check-up sections, corrected customer-facing docs so they no longer imply the workflow is already shipped, and refreshed all Markdown files to point at the final audited plan state. Runtime behavior unchanged.

- 2026-05-20 (implemented): v0.17 easy wins shipped. Three PreferencesPanel ARIA fixes: added `aria-modal="true"`, replaced `aria-label` with `aria-labelledby` pointing to a stable heading id, and added `trigger.focus()` on outside-click dismiss. Removed legacy interaction dead code (`MouseInteraction.ts`, `TouchInteraction.ts`, `ZoomPan.ts`) and deprecated `isMobileDevice()`. Validated `npm run lint` and `npm run build`. Updated `plan.md`, `FINDINGS.md`, `CHANGELOG.md`, `README.md`, `ARCHITECTURE_MAP.md`, `LESSONS_LEARNED.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/IMAGE_MAINTENANCE_GUIDE.md`, and all AI guidance docs.

 Reviewed source architecture, scripts, generated preview behavior, dependency/tooling health, diagnostics, accessibility, customer docs, and every Markdown file. Online validation covered `requestIdleCallback`, Long Tasks API, Page Lifecycle `freeze`/`resume`, three.js `compileAsync`, typescript-eslint support, and ESLint v8 EOL. Validation passed after install (`npm run lint`, `npm run build`, and focused script syntax checks); `npm audit` reports two moderate Vite/esbuild dev-server advisories requiring a dedicated semver-major tooling upgrade pass. All Markdown files were refreshed with cross-links, stale wording fixes, or audit notes. No runtime code changed.

- 2026-05-19 (documentation): AI context engineering workflow added. New files: `.github/copilot-instructions.md`, `.github/prompts/refactor.prompt.md`, `.github/prompts/architecture.prompt.md`, `.github/prompts/review.prompt.md`, `.github/prompts/autonomous-agent.prompt.md`, `AI_RULES.md`, `ARCHITECTURE_MAP.md`, `LESSONS_LEARNED.md`, `docs/architecture/README.md`, `docs/standards/CODING_GUIDELINES.md`, `docs/lessons-learned/README.md`, and `docs/ai-feedback/AI_FEEDBACK_LOOP.md`. Updated `plan.md`, `FINDINGS.md`, `CHANGELOG.md`, and `README.md` to reference the new context-engineering layer. No runtime code changed.

- 2026-05-19 (implemented): v0.16.2 control-shell follow-up shipped. `src/styles/main.scss` now gives `.nav-btn` and `.prefs__trigger` larger transparent shells and renders the visible glass circles on inset `::before` pseudo-elements, preventing the residual all-sides hover clipping that remained after v0.16.1. `.prefs__panel` top offset and phone-breakpoint spacing were adjusted accordingly, and `customer-preview/style.css` was rebuilt. Updated markdown coverage: `plan.md`, `FINDINGS.md`, `CHANGELOG.md`, `README.md`, `DOCUMENTATION_RULES.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/IMAGE_MAINTENANCE_GUIDE.md`. Validated with `npm run lint`, `npm run build`, and headless Chromium + SwiftShader verification of the live settings trigger.

- 2026-05-19 (implemented): v0.16.1 UI containment regression hotfix shipped. `src/styles/main.scss` containment scope was narrowed to exclude `.prefs` (settings popover anchor) and `.nav-controls` (hover-scaled center navigation container). This restores settings-panel usability and removes hover clipping on center left/right buttons. Updated markdown coverage: `plan.md`, `FINDINGS.md`, `CHANGELOG.md`, `README.md`, `DOCUMENTATION_RULES.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/IMAGE_MAINTENANCE_GUIDE.md`. Fresh-clone baseline initially failed before dependency install, then validation passed after install (`npm run lint`, `npm run build`).

- 2026-05-19 (implemented): v0.16 deep performance and compatibility pass shipped. Runtime changes: removed `window.resize` listeners from `SceneManager` and `PostProcessing`; added `SceneManager.updateAspect`, `PostProcessing.resize`, `RendererManager.prewarm`, `RendererManager.getRendererSnapshot`. `main.ts` now runs a single debounced + rAF resize coordinator, caches chrome refs, gates the render loop on `visibilitychange` / `freeze` / `resume`, defers preference applies via `requestIdleCallback`, attaches a debug-only Long Tasks observer, and posts a periodic renderer snapshot. `TextureManager.setAnisotropyDivisor` short-circuits on no-op. `RendererManager.applyPreset` writes `:root[data-quality]`. SCSS halves `--glass-blur` on battery, falls back to a solid surface when `backdrop-filter` is unsupported, and applies containment to fixed chrome surfaces (`contain: strict` on the spinner; refined in v0.16.1 to exclude `.prefs` and `.nav-controls`). `scripts/import-artworks.mjs` warns on >4096 px sides and >64 MB / >128 MB GPU footprint. `RendererManager.dispose` and `CanvasInteraction.dispose` are now idempotent. All v0.16 docs (`plan.md`, `FINDINGS.md`, `CHANGELOG.md`, `README.md`, `DOCUMENTATION_RULES.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/IMAGE_MAINTENANCE_GUIDE.md`) updated. Validated with `npm run lint`, `npm run build`, and `node -c scripts/import-artworks.mjs`.

- 2026-05-19 (final): v0.16 received its final audit update. The plan was re-validated against the full current source tree and expanded with six missed researched enhancements: Page Lifecycle `freeze` / `resume`, `renderer.compileAsync()` shader pre-warm, optional `ImageBitmapLoader` raster decode path, `deviceMemory` / `hardwareConcurrency` startup hints, debug-only Long Tasks API instrumentation, and CSS `contain` / internal `content-visibility`. Validation notes now also record sandbox baseline failures caused by missing dependencies. No runtime code changed in that pass.

- 2026-05-19 (updated): v0.16 deep brainstorm upgraded from high-level audit to code-sample-backed, file:line-anchored plan. 12 numbered findings with TypeScript/SCSS code samples, online validation sources, and acceptance tests. GPU resource ownership map added. Device compatibility matrix and QA matrix added. `FINDINGS.md` fully rewritten with code-level anchors. All other markdown updated. No runtime code changed. (Supersedes the 2026-05-19 entry below.)

- 2026-05-19: v0.15.1 reduced-motion fidelity hotfix documented. `Reduzierte Bewegung` no longer reduces picture texture/shader fidelity. `PaintingMaterial` no longer gates detail-normal or grazing/specular strength by reduced-motion state, and `GalleryManager.setReducedMotion()` now controls motion only. Updated `plan.md`, `FINDINGS.md`, `CHANGELOG.md`, `README.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, and `docs/IMAGE_MAINTENANCE_GUIDE.md`. Validated with `npm run lint` and `npm run build`.

- 2026-05-19: v0.15 elegant animation system implemented and documented across all repository markdown. `src/utils/math.ts` exports new `smoothDamp`. `src/gallery/GalleryManager.ts` uses frame-rate-independent smoothing with documented lambda constants and retuned navigation entrance seeds, plus a new `position.z` recession. `src/ui/InfoPanel.ts` content-swap timing bug fixed via `CONTENT_SWAP_DELAY_MS = 520` + `requestAnimationFrame`. `src/styles/main.scss` introduces semantic motion tokens (`--ease-gallery-out`, `--ease-gallery-in-out`, `--dur-control`, `--dur-content`, `--dur-panel`, `--dur-timeline`, `--dur-reveal`) with backward-compatible aliases; `--ease-spring` overshoot removed from gallery surfaces. `src/main.ts` loading-overlay removal timeout raised to 950 ms; animate loop passes `now` into `galleryManager.update`. New diagnostics fields (`motionMode`, `seedPositionX`, `seedPositionZ`, `settleTargetMs`) on navigation events. Validated with `npm run lint` and `npm run build`; preview bundles rebuilt.

- 2026-05-19: v0.15 final documentation audit cleanup completed. `plan.md` and `FINDINGS.md` now explicitly state repository-verification coverage, and all v0.15-facing markdown (`README.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/IMAGE_MAINTENANCE_GUIDE.md`, `CHANGELOG.md`) now use the final technical-audit wording and updated cross-references. No runtime code was changed.
- 2026-05-19: v0.15 technical deep audit documented. `plan.md` now contains the complete brainstorm with file:line citations, calculated 95% settle times for all 13 GalleryManager smoothing constants, exact lambda values, TypeScript code samples for `smoothDamp`, full SCSS token redesign diff, 7-slice implementation roadmap with acceptance checks. `FINDINGS.md` documents all discovered bugs: frame-rate-dependent lerp in GalleryManager.update() with proof math, InfoPanel 200ms timing bug, ease-spring overshoot, loading overlay removal timing, and a gap in the prefers-reduced-motion CSS block. All findings validated against Stack Overflow #57851938, MDN, WCAG 2.2, web.dev, and cubic-bezier.com. No runtime code was changed.
- 2026-05-19: v0.15 animation enhancement planning documented. `plan.md` defines a research-backed motion system plan for smoother, longer, more elegant animations; `FINDINGS.md` records 2026 accessibility/performance guidance and current motion-code audit results. No runtime code was changed.
- 2026-05-19: v0.14.2 implemented. `src/gallery/GalleryManager.ts` now uses axis-specific pan overscroll constants to keep horizontal behavior (`INSPECTION_OVERSCROLL_X = 1.2`) while tightening vertical limits (`INSPECTION_OVERSCROLL_Y = 0.6`). Diagnostics changed from `panOverscroll` to `panOverscrollX`/`panOverscrollY`. All markdown files were updated.
- 2026-05-19: importer compatibility fix documented. Added `scripts/run-import-artworks.cjs` launcher and updated both `Update Gallery` launchers to guard Node version before loading ESM importer code. Follow-up hardening changed the launcher from `node:` built-in specifiers to legacy built-in names (`child_process`, `fs`, `path`) so old Node versions can reach the friendly report. Docs now explicitly require Node.js 18+ and include troubleshooting for `Unexpected token {` from old Node runtimes.
- 2026-05-19: v0.14 implemented. `src/gallery/GalleryManager.ts` now ships deeper close zoom (`MIN_CAMERA_Z` 0.5→0.2 and `MIN_VISIBLE_ARTWORK_FRACTION` 0.28→0.12), tighter pan overscroll (`INSPECTION_OVERSCROLL` 3.0→1.2), and portrait-aware reset-fit headroom (`PORTRAIT_ASPECT_THRESHOLD` 0.65 + `PORTRAIT_RESET_EXTRA_Z` 1.5 added after base fit). `show-artwork-complete` diagnostics was extended with v0.14 tuning fields. Preview bundle rebuilt and all markdown files updated.
- 2026-05-18: v0.13 implemented. Documentation now records the four customer-reported bugs fixed: nav controls overlapping the timeline (CSS bottom calculation), zoom range expanded in both directions (MIN_CAMERA_Z 0.5, MIN_OVERVIEW_CAMERA_Z 18, OVERVIEW_HEADROOM_Z 3.5), pan range expanded when close (INSPECTION_OVERSCROLL 3.0), gear and fullscreen icons precisely centred (new icon-span CSS). `--chrome-bottom` updated to 200px+ baseline. All markdown files updated.
- 2026-05-18: v0.12 implemented. Documentation now records the shipped art-safe viewport metrics provider, split reset-fit/far-overview zoom bounds, shared reset/min/pan/hover viewport math, viewport-change refit strategy using `window` + `visualViewport` + `ResizeObserver`, timeline headroom/scroll-gutter/manual-centering behavior, reduced-motion scroll behavior, diagnostics additions, rebuilt customer preview, and final `npm run lint` / `npm run build` validation.
- 2026-05-18: v0.12 planning was upgraded into a final research-backed technical coding plan. Documentation records the exact `GalleryManager` zoom/fit coupling, the need for an injected art-safe viewport metrics provider, the requirement to keep reset/min/pan math on one shared model, the timeline headroom/scroll-gutter/manual-centering strategy, reduced-motion scroll behavior, and the official 2026 viewport/scroll/accessibility sources used to validate the plan.
- 2026-05-18: v0.11 implemented. Responsive phones/tablets, unified Pointer Events / Touch fallback (`CanvasInteraction`), capability-based device detection (`src/utils/device.ts`), safe-area + `100dvh` CSS, four-phase breakpoints, compact info-panel, fluid prefs panel, mobile DPR cap + startup quality heuristic, and WebGL `webglcontextlost` / `webglcontextrestored` handling. All seven planned bugs addressed; `npm run lint` and `npm run build` pass; `customer-preview/` regenerated. Documentation now records implementation outcome, diagnostics surface, and known follow-ups (cleanup of unused legacy interaction files, user-visible context-loss recovery UX, optional `ResizeObserver`, manual physical-device QA).
- 2026-05-18: v0.11 final technical coding plan validated against current official web guidance. Deep source audit identified 7 bugs. Every slice now maps to exact files, TypeScript patterns, CSS snippets, a gesture state machine design, and online-validated browser/platform constraints. Documentation now also records official sources, reflow/high-DPI/context-loss risks, and further enhancements such as `ResizeObserver` follow-up and explicit recovery UX.
- 2026-05-17: v0.10 implemented the Hoch close-up spot artifact fix and very-vertical-picture reset zoom fix. Documentation now records the procedural height/specular retune, aspect-aware reset zoom math, diagnostics fields, validation results, and remaining manual visual checks.
- 2026-05-17: v0.10 follow-up implemented the parallax hole artifact fix. Documentation now records that albedo must stay on stable artwork UVs while parallax remains relief-only, plus the reduced Hoch parallax scale and new diagnostics.
- 2026-05-17: v0.09 follow-up plan added after customer validation showed that v0.08 fixed the central 3D painting aspect ratio but the actual uploaded image can still fall back to the placeholder. Documentation now records online WebGL/CORS/local-file texture research and points future implementation toward importer-generated exact data URLs for 3D albedo reliability.
- 2026-05-17: v0.08 critical customer-artwork rendering plan added after a report that imported images appeared in the timeline but not on the central 3D painting. All markdown files now point future work toward fixing the WebGL texture path, manifest-driven 3D aspect ratios, and detailed diagnostics.
- 2026-05-17: v0.07 diagnostics/logging pass added a centralized runtime diagnostics system and updated the planning rules so future high-risk work must document diagnostics/logging architecture, signal-to-noise boundaries, and activation paths.
- 2026-05-17: v0.07 customer-picture workflow planning documentation added. This pass added `docs/CUSTOMER_PICTURE_GUIDE.md` and updated every repository markdown file with current limitations, online research findings, and the planned customer-managed artwork-folder importer.
- 2026-05-17: v0.05 planning documentation added for self-shadow smoothing/stain artifact removal. This pass updated every repository markdown file to keep plan, findings, changelog, README, handoff, and documentation policy status aligned.
