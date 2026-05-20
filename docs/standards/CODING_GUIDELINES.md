# FREYRAUM coding guidelines

## v0.18 — Sidecar text plan ready (2026-05-20)

Technical coding plan: `plan.md § v0.18`. Customer guide: `docs/CUSTOMER_TEXT_GUIDE.md`. Template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`. Only `scripts/import-artworks.mjs` changes.


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
