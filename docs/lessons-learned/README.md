# Lessons learned docs

## v0.18 sidecar text planning note (2026-05-20)

Current artwork-text planning is focused on **Option C: one sidecar text file beside each customer image** (`painting.jpg` + `painting.txt`). Treat `plan.md § v0.18 proposal — Customer sidecar text files for each painting` as the source of truth and `FINDINGS.md § 2026-05-20 — Customer sidecar text files selected for artwork text` as the research log. Generated manifests remain generated; future customer-written painting text should come from matching sidecars, not manual edits to `artworks.json` or `customer-artworks.js`.


Canonical lessons live in [`../../LESSONS_LEARNED.md`](../../LESSONS_LEARNED.md).

Use this folder for detailed incident write-ups only when a lesson needs more evidence than the root summary can hold.

Lessons feed the AI audit/review loop described in [`../ai-feedback/AI_FEEDBACK_LOOP.md`](../ai-feedback/AI_FEEDBACK_LOOP.md). The 2026-05-19 audit added lessons for dependency drift, semver-major audit fixes, and stale planned wording in customer docs.

Companion docs:

- Architecture: [`../architecture/README.md`](../architecture/README.md)
- Standards: [`../standards/CODING_GUIDELINES.md`](../standards/CODING_GUIDELINES.md)
- Findings: [`../../FINDINGS.md`](../../FINDINGS.md)
