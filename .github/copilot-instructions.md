# FREYRAUM Copilot instructions
> Last full markdown audit: 2026-05-22 (v0.29 planning pass — realistic, elegant metallic PBR frame roadmap documented; lint/build pass).

## v0.29 current context

Latest planning status: loading-screen/full-render ownership and artwork color fidelity are shipped work. Future coding agents should consult `plan.md § v0.29` and `FINDINGS.md § v0.29` for the shipped readiness diagnostics and validation boundaries.



## v0.23 — Performance/Preloading Planning Audit

This Markdown file was refreshed during the 2026-05-21 all-docs sync. The current runtime is still v0.22; the open performance work is documented in `plan.md § v0.23`, with source-referenced audit notes in `FINDINGS.md § v0.23`. Key boundary: v0.22 improves the first 15 artworks, but large-gallery GPU warming, synchronous procedural map generation, and best-effort idle prefetch remain planned N-series work.

## v0.22 — shipped (2026-05-21) — Improved Preloading + Press-to-Start

Current status: shipped. Runtime now preloads albedo plus PBR texture sets for the first 15 artworks under the loading overlay, warms each cached artwork texture set on the GPU before reveal, keeps the branded loader visible for at least 500 ms, and waits for the accessible "Galerie betreten" button before entering the gallery. Validation: `npm run lint` and `npm run build` passed after implementation; `npm audit --audit-level=moderate` still reports the known Vite/esbuild development-server advisory that requires a semver-major upgrade.

## v0.21 — implementation shipped (2026-05-21)

Current status: shipped. The v0.21 plan is implemented in runtime code and documentation: branded progress loading overlay, Three.js LoadingManager progress, pre-reveal GPU warm render + awaited shader prewarm, audio `preload='auto'`, adjacent/idle PBR prefetch, lighting resume clamp, WebGL restore status, max-texture diagnostics, shader precision guard, 16K importer guidance, global pointer tracking, timeline arrows/counter/edge fades/responsive sizing/virtualized large-list rendering, and cleanup for added global listeners. Future-only boundaries remain LOD/tiled streaming for device-limited 16K detail and grouped/page timeline navigation for very large exhibitions.


## v0.20.8 — Complete v0.20 implementation shipped (2026-05-21)

Current status: shipped. The v0.20.7 gap-closure plan is now implemented in code and this file was refreshed during the all-markdown sync. Remaining v0.20 audio/control quality gaps are closed: fade targets clamp to the 0.30 effective-gain ceiling, diagnostics include display percent, preference patching updates non-slider controls during volume drags, sliders expose German percent value text, zero-volume recovery logs stored/recovered values, first-interaction recovery also covers pre-play audio, unmute resumes within `BackgroundAudioManager`, slider fill CSS stores percentages, and the ended-loop fallback fade is shortened to 50 ms. F-09 was confirmed correct and required no code change.

## v0.18 — Customer sidecar text shipped (2026-05-20)

Current status: shipped. The importer (`scripts/import-artworks.mjs`) reads same-basename `.txt` sidecars (`.md` accepted as a backup) and merges customer-facing metadata into the generated manifest. Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned. Canonical plan: `plan.md § v0.18`. Research log: `FINDINGS.md § 2026-05-20`. Customer guide: `docs/CUSTOMER_TEXT_GUIDE.md`. Template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.

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
