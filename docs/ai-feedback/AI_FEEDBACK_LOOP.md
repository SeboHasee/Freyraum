# AI feedback loop
> Last full markdown audit: 2026-05-22 (v0.40 premium metal PBR research documented; lint/build pass).

## v0.29 feedback-loop note

When user feedback says a shipped preload/fidelity fix still fails, immediately downgrade the claim to follow-up in docs, audit the current source against the claim, add diagnostics-driven acceptance checks, then flip docs back to shipped only after implementation and validation. v0.29 is the shipped example for painting darkness, loading-screen ownership, entry glitching, and first-use lag.



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

FREYRAUM uses repository context engineering so future AI work starts from the current architecture and previous mistakes.

## Loop

1. Inspect architecture and current docs.
2. Plan against existing module boundaries.
3. Implement the smallest complete change.
4. Validate with existing scripts and focused checks.
5. Self-review for correctness, edge cases, performance, readability, security, accessibility, and maintainability.
6. Update docs and lessons when behavior, workflow, or durable rules change.
7. For deep audits, validate current platform/tooling assumptions with online sources and record source URLs in `FINDINGS.md`.

## Files to update

- `.github/copilot-instructions.md`: global AI behavior and repository-specific rules.
- `.github/prompts/`: reusable task prompts.
- `AI_RULES.md`: hard constraints and forbidden patterns.
- `ARCHITECTURE_MAP.md`: high-level source ownership map.
- `LESSONS_LEARNED.md`: repeated mistakes and durable follow-up rules.
- `docs/standards/CODING_GUIDELINES.md`: coding, diagnostics, dependency, lifecycle, and documentation standards.
- `DOCUMENTATION_RULES.md`, `plan.md`, `FINDINGS.md`, `CHANGELOG.md`: implementation-specific records.

## 2026-05-19 audit additions

- Always distinguish docs-only findings from runtime changes.
- Record validation warnings, not only pass/fail status.
- Document online research findings with URLs and note whether runtime fallback behavior already covers partial browser support.

Companion docs:

- Architecture: [`../architecture/README.md`](../architecture/README.md)
- Standards: [`../standards/CODING_GUIDELINES.md`](../standards/CODING_GUIDELINES.md)
- Lessons: [`../../LESSONS_LEARNED.md`](../../LESSONS_LEARNED.md)
