# FREYRAUM coding guidelines
> v0.58 shipped: topbar UI uniformity, help button fix, badge layout, premium 2026 micro-interactions.
> Last full markdown audit: 2026-06-04 (v0.65 documentation sync; runtime now v0.65).

## v0.29 rendering/preload coding guideline

For any future startup smoothness fix, separate and log: fetch/decode, CPU cache, procedural generation, material binding, shader compile, GPU upload draw, final composer render, browser presentation, and UI/control prebuild. Do not enable user entry until the final render path has presented full-size frames behind the opaque loader.



## v0.23 performance coding guideline

For gallery performance work, measure and log each expensive phase separately: network/decode, procedural generation, material apply, shader compile, GPU upload, and navigation frame time. Prefer budgeted queues that yield between frames over unbounded synchronous loops, and keep local/file/data-URI customer-preview compatibility when evaluating `ImageBitmapLoader` or compressed texture pipelines.

## v0.22 — shipped (2026-05-21) — Improved Preloading + Press-to-Start

Current status: shipped. Runtime now preloads albedo plus PBR texture sets for the first 15 artworks under the loading overlay, warms each cached artwork texture set on the GPU before reveal, keeps the branded loader visible for at least 500 ms, and waits for the accessible "Galerie betreten" button before entering the gallery. Validation: `npm run lint` and `npm run build` passed after implementation; `npm audit --audit-level=moderate` still reports the known Vite/esbuild development-server advisory that requires a semver-major upgrade.

## v0.21 — implementation shipped (2026-05-21)

Current status: shipped. The v0.21 plan is implemented in runtime code and documentation: branded progress loading overlay, Three.js LoadingManager progress, pre-reveal GPU warm render + awaited shader prewarm, audio `preload='auto'`, adjacent/idle PBR prefetch, lighting resume clamp, WebGL restore status, max-texture diagnostics, shader precision guard, 16K importer guidance, global pointer tracking, timeline arrows/counter/edge fades/responsive sizing/virtualized large-list rendering, and cleanup for added global listeners. Future-only boundaries remain LOD/tiled streaming for device-limited 16K detail and grouped/page timeline navigation for very large exhibitions.


## v0.20.8 — Complete v0.20 implementation shipped (2026-05-21)

Current status: shipped. The v0.20.7 gap-closure plan is now implemented in code and this file was refreshed during the all-markdown sync. Remaining v0.20 audio/control quality gaps are closed: fade targets clamp to the 0.30 effective-gain ceiling, diagnostics include display percent, preference patching updates non-slider controls during volume drags, sliders expose German percent value text, zero-volume recovery logs stored/recovered values, first-interaction recovery also covers pre-play audio, unmute resumes within `BackgroundAudioManager`, slider fill CSS stores percentages, and the ended-loop fallback fade is shortened to 50 ms. F-09 was confirmed correct and required no code change.

## v0.18 — Customer sidecar text shipped (2026-05-20)

Current status: shipped. The importer (`scripts/import-artworks.mjs`) reads same-basename `.txt` sidecars (`.md` accepted as a backup) and merges customer-facing metadata into the generated manifest. Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned. Canonical plan: `plan.md § v0.18`. Research log: `FINDINGS.md § 2026-05-20`. Customer guide: `docs/CUSTOMER_TEXT_GUIDE.md`. Template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.

Read this with [`../../AI_RULES.md`](../../AI_RULES.md), [`../../ARCHITECTURE_MAP.md`](../../ARCHITECTURE_MAP.md), and [`../ai-feedback/AI_FEEDBACK_LOOP.md`](../ai-feedback/AI_FEEDBACK_LOOP.md).

## TypeScript

- Keep strict TypeScript clean.
- Prefer explicit domain types for artwork, quality, diagnostics, and viewport data.
- Avoid `any`; the ESLint rule currently warns, but new code should use safer types.

## Diagnostics

- Use `getDiagnostics()` or `createScopedDiagnostics()` for runtime logging.
- Keep logs actionable and bounded. Prefer structured data that helps customer support reproduce rendering or importer issues.
- Do not log secrets or raw user file contents.
- Document new diagnostics scopes, activation paths, and support workflows in `FINDINGS.md` or customer docs.

## Rendering and performance

- Preserve painting material fidelity unless the task explicitly changes artistic output.
- Batch layout reads/writes and GPU resize work through the existing resize coordinator.
- Treat shader pre-warm, lifecycle suspension, adaptive quality, and context-loss handling as reliability features.
- Measure before adding complex optimizations.

## CSS/UI

- Keep glass chrome readable with fallback paths.
- Avoid paint containment on elements that host popovers, overflow animation, or scaled controls.
- Preserve safe-area, responsive, keyboard, touch, and reduced-motion behavior.

## Accessibility

- Every custom `role="dialog"` element must have `aria-modal="true"`, `aria-labelledby` (pointing to a stable heading id), and focus returned to the opener on all dismiss paths.
- Reference: <https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/>



- Follow `DOCUMENTATION_RULES.md`.
- Record regressions, validation failures, and deferred boundaries in `FINDINGS.md` or `LESSONS_LEARNED.md`.

## Dependencies and tooling

- Run `npm audit` during full-repo audits and document package path, severity, and fix scope.
- Do not force semver-major dependency upgrades as part of unrelated docs or feature work.
- Keep TypeScript, typescript-eslint, ESLint, Vite, and Sass version drift visible until a dedicated tooling pass resolves it.

## Event listeners and lifecycle

- Prefer explicit `dispose()` cleanup for persistent listeners, observers, timers, and WebGL resources.
- Short-lived listeners attached to replaced DOM nodes are acceptable but should not become a hot path.
- Browser APIs with partial support must keep feature detection and fallback behavior.

## Companion docs

- Architecture: [`../architecture/README.md`](../architecture/README.md)
- Lessons: [`../../LESSONS_LEARNED.md`](../../LESSONS_LEARNED.md)
- AI feedback: [`../ai-feedback/AI_FEEDBACK_LOOP.md`](../ai-feedback/AI_FEEDBACK_LOOP.md)
