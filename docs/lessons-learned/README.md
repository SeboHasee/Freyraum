# Lessons learned docs
> Latest markdown audit: 2026-10-18 (photograph-backed museum follow-up).

## 2026-10-18 presentation-authority lessons

See `../../LESSONS_LEARNED.md` Lessons 118–120: shared geometry does not prove
shared visible presentation, a mismatched filename is not a missing asset, and
presentation recovery cannot supply genuinely absent artwork files.
Browser acceptance must use the generated/served artifact; an unavailable
customer bundle cannot be claimed as reproduced.

## v1.40 lesson index update

See `../../LESSONS_LEARNED.md` Lessons 111–117 (2026-10-14…17) for the single
placement truth, calibration-independent artwork size, thumbnail data URLs,
live upload previews, CI triggers/approval, Windows file locks and paths, and
building installers in CI. The wall-following invariant is in
`../../FINDINGS.md § 2026-10-14 — Physical artwork size versus wall calibration`.

## v1.18 lesson index update

See `../../LESSONS_LEARNED.md § 2026-09-05 — Standalone editor reproducibility
lessons` for the fixed/editable import boundary, complete configured-model
export rule, and multi-entry `file://` cache-busting requirement.

## v1.12 lesson index update

See `../../LESSONS_LEARNED.md § 2026-09-04 — Visual artifact provenance
lesson` and Lessons 97–104 for current hub placement, mounting, migration,
clearance, and artifact-verification rules.

## v0.93 lesson index update

See `../../LESSONS_LEARNED.md § 2026-09-01 — Local file-preview artwork
recovery lessons` for the key rules: local `file://` image decode does not
guarantee visible WebGL artwork, and fresh-clone preview investigations must
first confirm the generated customer preview bundle exists.

## v0.47 lesson index update

See `../../LESSONS_LEARNED.md § 2026-05-22 — v0.47 frame realism lessons` for the key rules: align brush direction to frame geometry and keep metal detail restrained for elegant satin behavior.

## v0.45 lesson index update

See `../../LESSONS_LEARNED.md § 2026-05-22 — v0.45 frame realism planning lessons` for the key rules: no visible cadence after GLSL migration, derivative-aware scratch primitives for close zoom, and verifying Three.js shader variable names against installed shader chunks.

## v0.29 lesson index update

See `../../LESSONS_LEARNED.md § 2026-05-22 — v0.29 implementation lessons` for the key rules: metallic PBR upgrades must include IBL + geometry + material + preset wiring, and shipped claims require runtime validation.

Canonical lessons live in [`../../LESSONS_LEARNED.md`](../../LESSONS_LEARNED.md).

Use this folder for detailed incident write-ups only when a lesson needs more evidence than the root summary can hold.

Lessons feed the AI audit/review loop described in [`../ai-feedback/AI_FEEDBACK_LOOP.md`](../ai-feedback/AI_FEEDBACK_LOOP.md). The 2026-05-19 audit added lessons for dependency drift, semver-major audit fixes, and stale planned wording in customer docs.

Companion docs:

- Architecture: [`../architecture/README.md`](../architecture/README.md)
- Standards: [`../standards/CODING_GUIDELINES.md`](../standards/CODING_GUIDELINES.md)
- Findings: [`../../FINDINGS.md`](../../FINDINGS.md)
