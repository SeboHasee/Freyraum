# FREYRAUM AI rules

Hard constraints for AI-assisted work in this repository.

## Architecture

- Keep `src/main.ts` as the orchestration layer; do not move feature logic there unless it wires existing modules together.
- Keep rendering infrastructure in `src/core/`, gallery/domain behavior in `src/gallery/`, material fidelity in `src/materials/`, and DOM controls in `src/ui/` or `src/timeline/`.
- Keep customer artwork import logic in `scripts/` and preserve friendly Node compatibility errors.
- Do not treat `customer-preview/` as source of truth. It is rebuilt output.

## Forbidden patterns

- Do not add new dependencies for tasks that can be solved with TypeScript, three.js, Vite, or existing utilities.
- Do not bypass `getDiagnostics()` / `createScopedDiagnostics()` with permanent ad-hoc console logging.
- Do not reduce painting material fidelity as a side effect of accessibility or performance work.
- Do not apply CSS containment to popover anchors or hover-scaled control containers without testing overflow paint.
- Do not accept arbitrary injected artwork URLs where a validated data URL is required.

## Required patterns

- Validate injected/customer data defensively and log rejected entries.
- Keep disposal idempotent for lifecycle-sensitive WebGL/input classes.
- Batch resize/layout work through the existing coordinator pattern.
- Preserve reduced-motion behavior as a motion control, not a visual quality control.
- Update documentation for meaningful behavior, workflow, architecture, or regression changes.

## Validation

- Fresh clones need `npm install` before lint/build.
- Use existing scripts: `npm run lint`, `npm run build`, and focused checks for touched scripts.
- If runtime or SCSS changes affect preview output, rebuild and commit the relevant `customer-preview/` output.
