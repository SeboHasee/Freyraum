# FREYRAUM Copilot instructions
> Latest markdown audit: 2026-10-17 (v1.40 merge-readiness audit).

## Current context (v1.40)

- Placement editor: `OPEN_ARTWORK_EDITOR.html` → `customer-preview/placement-editor.html`
  (deployed: `placement-editor.html`, typing "bearbeiten" in the gallery); UI modules in `src/hub/editor/`. Placement validity
  everywhere (editor, drag, loader, export) uses `evaluateDisplayedPlacement`
  in `src/config/museumHub.ts`; canonical placements are flagged, never
  relocated. Editor artwork size is compensated by `calibratedWallScaleAt`, so
  wall edits never stretch artwork. Rooms come from `museum-hub.json` `rooms`.
- Saving: online editor → save service in `worker/` with rules shared in
  `src/online/publishRules.ts`; FREYRAUM Editor desktop app in `desktop/`
  writes only through `scripts/local-project/projectStore.ts` and serves only
  allowlisted files at `freyraum://app/`; `file://` download fallback.
- Tests and CI: `docs/REGRESSION_TOOLING.md`. Active work: `plan.md`.
  History: `CHANGELOG.md` and `docs/archive/`.

Use these repository-specific instructions before changing code or docs.

## Repository context first

- Inspect the current architecture before proposing changes: `src/main.ts`, affected modules under `src/`, `package.json`, existing docs, and recent entries in `plan.md`, `FINDINGS.md`, and `CHANGELOG.md`.
- Preserve the current Vite + TypeScript + three.js structure. Do not add dependencies unless the task cannot be solved with existing tools.
- Prefer small, reviewable changes that match existing patterns and keep customer-preview output in sync when runtime or style output changes.

## Architecture boundaries

- `src/main.ts` owns boot orchestration, diagnostics setup, lifecycle handling, UI wiring, resize coordination, preferences, and the render loop.
- `src/core/` owns renderer, scene, and post-processing infrastructure.
- `src/gallery/` owns artwork state, texture loading, mesh construction, navigation, zoom/pan bounds, and artwork layout.
- `src/materials/` owns painting surface fidelity and procedural texture generation.
- `src/ui/`, `src/timeline/`, and `src/interaction/` own DOM controls and user input.
- `src/hub/` owns the museum hub, projection math, and the placement editor (`src/hub/editor/`).
- `src/online/` owns save rules shared by the editor, `worker/`, and the desktop store.
- `worker/` is the Cloudflare save service; `desktop/` is the Electron FREYRAUM Editor (own `package.json`).
- `scripts/` owns customer artwork import, local preview generation, the local project store (`scripts/local-project/`), and the test scripts.
- `customer-preview/` is generated preview output; update it only when source changes require rebuilt customer assets.

## Development workflow

1. Understand the task and compare it against current repository patterns.
2. Identify risks, missing context, validation commands, and documentation impact.
3. Implement the smallest complete change.
4. Validate with existing scripts when applicable:
   - `npm install` on a fresh clone before lint/build.
   - `npm run lint`, `npm run build:typecheck`, `npm run build`
   - the focused tests for the touched area, listed in `docs/REGRESSION_TOOLING.md`
     (geometry, editor drag/rooms/publish, save service, local project, desktop app).
5. Self-review for correctness, edge cases, readability, performance, accessibility, and security.
6. Update docs when meaningful work changes behavior, architecture, workflow, or known lessons.

For full-repository audits, also run dependency/tooling checks that already exist (`npm audit`, lint/build, focused script syntax checks) and document warnings separately from regressions.

## Coding standards

- Keep TypeScript strict and avoid unused locals/parameters.
- Use existing diagnostics helpers instead of ad-hoc console logging for runtime signals.
- Treat reduced motion as a motion-only accessibility setting; do not reduce visual/material fidelity unless explicitly requested.
- Preserve WebGL/customer reliability safeguards: context-loss handling, idempotent disposal, page lifecycle suspension, and texture-memory warnings.
- Keep comments concise and reserved for non-obvious architecture, math, compatibility, or customer-support decisions.

## Documentation expectations

Follow `DOCUMENTATION_RULES.md`. For meaningful implementation work, update `plan.md`, `FINDINGS.md`, `CHANGELOG.md`, and relevant README/docs sections. Record failures and regressions as reusable lessons, not only successes.

When online research is requested, prefer official sources and record source URLs in `FINDINGS.md` with the exact repository decision they support.
