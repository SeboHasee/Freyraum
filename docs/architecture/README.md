# Architecture docs
> Last full markdown audit: 2026-05-20 (v0.20.1 docs sync + verification).

## v0.20 full-check status

Shipped architecture extension: customer audio-file ingestion plus runtime calm background playback controls.

Current status: **implemented**.

Key implementation anchors: `src/audio/BackgroundAudioManager.ts`, `src/main.ts` audio payload sanitization/orchestration, `src/utils/preferences.ts` audio fields, `src/ui/PreferencesPanel.ts` controls, `scripts/import-artworks.mjs` audio importer flow.

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
