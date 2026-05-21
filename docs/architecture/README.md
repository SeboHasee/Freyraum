# Architecture docs
> Last full markdown audit: 2026-05-21 (v0.21 shipped — preloading, interactive loading screen, tab/context smoothness, 16K diagnostics, global pointer tracking, timeline scalability).

## v0.21 — implementation shipped (2026-05-21)

Current status: shipped. The v0.21 plan is implemented in runtime code and documentation: branded progress loading overlay, Three.js LoadingManager progress, pre-reveal GPU warm render + awaited shader prewarm, audio `preload='auto'`, adjacent/idle PBR prefetch, lighting resume clamp, WebGL restore status, max-texture diagnostics, shader precision guard, 16K importer guidance, global pointer tracking, timeline arrows/counter/edge fades/responsive sizing/virtualized large-list rendering, and cleanup for added global listeners. Future-only boundaries remain LOD/tiled streaming for device-limited 16K detail and grouped/page timeline navigation for very large exhibitions.


## v0.20.8 — Complete v0.20 implementation shipped (2026-05-21)

Current status: shipped. The v0.20.7 gap-closure plan is now implemented in code and this file was refreshed during the all-markdown sync. Remaining v0.20 audio/control quality gaps are closed: fade targets clamp to the 0.30 effective-gain ceiling, diagnostics include display percent, preference patching updates non-slider controls during volume drags, sliders expose German percent value text, zero-volume recovery logs stored/recovered values, first-interaction recovery also covers pre-play audio, unmute resumes within `BackgroundAudioManager`, slider fill CSS stores percentages, and the ended-loop fallback fade is shortened to 50 ms. F-09 was confirmed correct and required no code change.

## v0.18 — Customer sidecar text shipped (2026-05-20)

Current status: shipped. The importer (`scripts/import-artworks.mjs`) reads same-basename `.txt` sidecars (`.md` accepted as a backup) and merges customer-facing metadata into the generated manifest. Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned. Canonical plan: `plan.md § v0.18`. Research log: `FINDINGS.md § 2026-05-20`. Customer guide: `docs/CUSTOMER_TEXT_GUIDE.md`. Template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.

Start with [`../../ARCHITECTURE_MAP.md`](../../ARCHITECTURE_MAP.md) for the current repository map.

Use this folder for deeper architecture notes when a future change adds or revises a subsystem. Keep module ownership, validation requirements, and customer-preview impact explicit.

## 2026-05-19 audit notes

- Current root map remains authoritative for module ownership.
- Legacy interaction files are intentionally listed as deferred cleanup, not active architecture.
- Preference persistence, diagnostics, Page Lifecycle handling, and generated preview ownership are now part of the architecture baseline.
- Online platform assumptions are documented in [`../../FINDINGS.md`](../../FINDINGS.md).

## Companion docs

- Standards: [`../standards/CODING_GUIDELINES.md`](../standards/CODING_GUIDELINES.md)
- AI feedback loop: [`../ai-feedback/AI_FEEDBACK_LOOP.md`](../ai-feedback/AI_FEEDBACK_LOOP.md)
- Lessons: [`../../LESSONS_LEARNED.md`](../../LESSONS_LEARNED.md)
