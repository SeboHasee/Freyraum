# AI feedback loop
> Last full markdown audit: 2026-05-20 (v0.20.3 technical planning sync).

## v0.20 full-check status note

Treat the shipped background-audio scope (`plan.md § v0.19`) as an active regression boundary in future review loops (importer payload, autoplay handling, lifecycle, controls, diagnostics).

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
