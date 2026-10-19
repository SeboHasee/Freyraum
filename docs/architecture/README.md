# Architecture Docs
> Latest markdown audit: 2026-10-19 (repository-wide documentation review).

Use [`../../ARCHITECTURE_MAP.md`](../../ARCHITECTURE_MAP.md) as the canonical architecture source.

This folder is for focused subsystem notes when needed. Keep those notes:

- scoped to one subsystem,
- free of release-history narratives,
- aligned with current code ownership,
- linked from `ARCHITECTURE_MAP.md` when they become authoritative.

Historical architecture rationale belongs in `../archive/`.

The current standalone editor entry points and fixed/editable configuration
boundary are documented in `../../ARCHITECTURE_MAP.md`.
Museum and editor share photograph-backed calibrated DOM artwork; the inspection
gallery remains Three.js. Structural source findings and pending artifact/browser
acceptance are tracked separately in `../../FINDINGS.md` and `../../plan.md`.
