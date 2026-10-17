# FREYRAUM coding guidelines
> Latest markdown audit: 2026-10-17 (v1.40 merge-readiness audit).

## v1.18 placement-editor guideline

Keep derived wall projection read-only unless the resolution and renderer are
rebuilt atomically. Apply imported data only after fixed camera/room/wall,
fallback, pagination, inventory, assignment, and slot-policy state matches.
Export from the complete configured model, including bounds-only walls. Preserve
native keyboard behavior in form controls and cache-bust customer bundles in
every generated file-preview entry.

## v1.12 hub-layout guideline

Keep authored/resolved hub transforms in the shared wall U/V/N frame and keep
rendered faces, accessibility projection, and hit targets on the same fitted
quad. Preserve the four-work 2+1+1 page cap, overflow migration, and side-wall
doorway/front-corner clearance checks. A passing geometry test does not close a
customer visual incident without checking the exact reported artifact.

## v0.29 rendering/preload coding guideline

For any future startup smoothness fix, separate and log: fetch/decode, CPU cache, procedural generation, material binding, shader compile, GPU upload draw, final composer render, browser presentation, and UI/control prebuild. Do not enable user entry until the final render path has presented full-size frames behind the opaque loader.

## v0.93 artwork visibility guideline

Keep customer image recovery as an explicit, bounded source-to-pixel state
machine: candidate request, decode, compatibility decision, texture upload/map
binding, and final visible result. Redact URLs and never log image bytes. Retry
the embedded source only once; when both candidates exceed a device texture
limit, derive one bounded raster instead of retrying the same bytes or silently
displaying a grey fallback. For local-preview regressions, validate the actual
`file://` launcher or `customer-preview/app.html` bundle, not only Vite dev or
Pages output; the shipped hub exception that prefers embedded `webglImage` is
bounded to that offline case.

## v0.23 performance coding guideline

For gallery performance work, measure and log each expensive phase separately: network/decode, procedural generation, material apply, shader compile, GPU upload, and navigation frame time. Prefer budgeted queues that yield between frames over unbounded synchronous loops, and keep local/file/data-URI customer-preview compatibility when evaluating `ImageBitmapLoader` or compressed texture pipelines.

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
