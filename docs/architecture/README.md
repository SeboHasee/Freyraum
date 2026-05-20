# Architecture docs

## v0.18 sidecar text planning note (2026-05-20)

Current artwork-text planning is focused on **Option C: one sidecar text file beside each customer image** (`painting.jpg` + `painting.txt`). Treat `plan.md § v0.18 proposal — Customer sidecar text files for each painting` as the source of truth and `FINDINGS.md § 2026-05-20 — Customer sidecar text files selected for artwork text` as the research log. Generated manifests remain generated; future customer-written painting text should come from matching sidecars, not manual edits to `artworks.json` or `customer-artworks.js`.


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
