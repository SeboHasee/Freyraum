# FREYRAUM Copilot instructions

## v0.18 sidecar text planning note (2026-05-20)

Current artwork-text planning is focused on **Option C: one sidecar text file beside each customer image** (`painting.jpg` + `painting.txt`). Treat `plan.md § v0.18 proposal — Customer sidecar text files for each painting` as the source of truth and `FINDINGS.md § 2026-05-20 — Customer sidecar text files selected for artwork text` as the research log. Generated manifests remain generated; future customer-written painting text should come from matching sidecars, not manual edits to `artworks.json` or `customer-artworks.js`.


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
- `scripts/` owns customer artwork import and local preview generation.
- `customer-preview/` is generated preview output; update it only when source changes require rebuilt customer assets.

## Development workflow

1. Understand the task and compare it against current repository patterns.
2. Identify risks, missing context, validation commands, and documentation impact.
3. Implement the smallest complete change.
4. Validate with existing scripts when applicable:
   - `npm install` on a fresh clone before lint/build.
   - `npm run lint`
   - `npm run build`
   - focused script checks such as `node -c scripts/import-artworks.mjs` when touching importer code.
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
