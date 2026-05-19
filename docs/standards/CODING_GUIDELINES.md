# FREYRAUM coding guidelines

## TypeScript

- Keep strict TypeScript clean.
- Prefer explicit domain types for artwork, quality, diagnostics, and viewport data.
- Avoid `any`; the ESLint rule currently warns, but new code should use safer types.

## Diagnostics

- Use `getDiagnostics()` or `createScopedDiagnostics()` for runtime logging.
- Keep logs actionable and bounded. Prefer structured data that helps customer support reproduce rendering or importer issues.
- Do not log secrets or raw user file contents.

## Rendering and performance

- Preserve painting material fidelity unless the task explicitly changes artistic output.
- Batch layout reads/writes and GPU resize work through the existing resize coordinator.
- Treat shader pre-warm, lifecycle suspension, adaptive quality, and context-loss handling as reliability features.
- Measure before adding complex optimizations.

## CSS/UI

- Keep glass chrome readable with fallback paths.
- Avoid paint containment on elements that host popovers, overflow animation, or scaled controls.
- Preserve safe-area, responsive, keyboard, touch, and reduced-motion behavior.

## Documentation

- Follow `DOCUMENTATION_RULES.md`.
- Record regressions, validation failures, and deferred boundaries in `FINDINGS.md` or `LESSONS_LEARNED.md`.
