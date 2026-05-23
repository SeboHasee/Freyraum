# Lessons learned docs
> v0.57 doc-sync: reviewed during open-items audit on 2026-05-23.
> Last full markdown audit: 2026-05-23 (v0.57 plan added: v0.56-B follow-ups planned — keyboard shortcuts, focus/contrast, font optimization).

## v0.47 lesson index update

See `../../LESSONS_LEARNED.md § 2026-05-22 — v0.47 frame realism lessons` for the key rules: align brush direction to frame geometry and keep metal detail restrained for elegant satin behavior.

## v0.45 lesson index update

See `../../LESSONS_LEARNED.md § 2026-05-22 — v0.45 frame realism planning lessons` for the key rules: no visible cadence after GLSL migration, derivative-aware scratch primitives for close zoom, and verifying Three.js shader variable names against installed shader chunks.

## v0.29 lesson index update

See `../../LESSONS_LEARNED.md § 2026-05-22 — v0.29 implementation lessons` for the key rules: metallic PBR upgrades must include IBL + geometry + material + preset wiring, and shipped claims require runtime validation.



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

Canonical lessons live in [`../../LESSONS_LEARNED.md`](../../LESSONS_LEARNED.md).

Use this folder for detailed incident write-ups only when a lesson needs more evidence than the root summary can hold.

Lessons feed the AI audit/review loop described in [`../ai-feedback/AI_FEEDBACK_LOOP.md`](../ai-feedback/AI_FEEDBACK_LOOP.md). The 2026-05-19 audit added lessons for dependency drift, semver-major audit fixes, and stale planned wording in customer docs.

Companion docs:

- Architecture: [`../architecture/README.md`](../architecture/README.md)
- Standards: [`../standards/CODING_GUIDELINES.md`](../standards/CODING_GUIDELINES.md)
- Findings: [`../../FINDINGS.md`](../../FINDINGS.md)
