# Lessons learned docs
> Last full markdown audit: 2026-05-21 (v0.20.7 — full technical audit + gap-closure coding plan).

## v0.20.5 status

Current lesson for this pass: never document an audio fix as complete until startup loudness, mute recovery, slider synchronization, and placement are re-tested in the live preview. Use `LESSONS_LEARNED.md` for the detailed follow-up rules from this audit.

## v0.18 — Customer sidecar text shipped (2026-05-20)

Current status: shipped. The importer (`scripts/import-artworks.mjs`) reads same-basename `.txt` sidecars (`.md` accepted as a backup) and merges customer-facing metadata into the generated manifest. Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned. Canonical plan: `plan.md § v0.18`. Research log: `FINDINGS.md § 2026-05-20`. Customer guide: `docs/CUSTOMER_TEXT_GUIDE.md`. Template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.

Canonical lessons live in [`../../LESSONS_LEARNED.md`](../../LESSONS_LEARNED.md).

Use this folder for detailed incident write-ups only when a lesson needs more evidence than the root summary can hold.

Lessons feed the AI audit/review loop described in [`../ai-feedback/AI_FEEDBACK_LOOP.md`](../ai-feedback/AI_FEEDBACK_LOOP.md). The 2026-05-19 audit added lessons for dependency drift, semver-major audit fixes, and stale planned wording in customer docs.

Companion docs:

- Architecture: [`../architecture/README.md`](../architecture/README.md)
- Standards: [`../standards/CODING_GUIDELINES.md`](../standards/CODING_GUIDELINES.md)
- Findings: [`../../FINDINGS.md`](../../FINDINGS.md)
