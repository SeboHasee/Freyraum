# DOCUMENTATION RULES

## Rule

Always document meaningful repository work for future development.

## Required updates for every meaningful implementation

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

## Quality expectations

- documentation must reflect the code that was actually committed
- documentation should mention remaining limitations, not only successes
- plans should distinguish implemented items from future items
- changelog entries should be concise but specific
- findings should capture reusable technical knowledge for later contributors
- if a user reports a customer-facing feature failure after implementation,
  document it as a first-class follow-up with observed behavior, expected
  behavior, likely failure boundary, diagnostics needed, and acceptance checks

## Additional rule for technical planning documents

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

- 2026-05-19: v0.16 performance audit and optimization roadmap documented. `plan.md` now contains a measurement-first, fidelity-preserving roadmap for resize consolidation, batched viewport measurement, visibility-aware rendering, interaction hot-path cleanup, shader-change scheduling, texture-memory scalability, CSS paint profiling, and resource ownership. `FINDINGS.md`, `CHANGELOG.md`, `README.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, and `docs/IMAGE_MAINTENANCE_GUIDE.md` were updated. No runtime code changed.

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
