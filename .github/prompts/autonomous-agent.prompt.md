# Autonomous agent prompt
> Last full markdown audit: 2026-05-21 (v0.20.5 audio regression audit + recovery plan).

## v0.20.5 context note

Audio importer support is shipped, but runtime audio behavior still has open regressions. Protect the importer path, and treat startup loudness, mute recovery, slider sync, and quick-control placement as unresolved until the v0.20.5 recovery plan is implemented.

## v0.18 — Customer sidecar text shipped (2026-05-20)

Current status: shipped. The importer (`scripts/import-artworks.mjs`) reads same-basename `.txt` sidecars (`.md` accepted as a backup) and merges customer-facing metadata into the generated manifest. Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned. Canonical plan: `plan.md § v0.18`. Research log: `FINDINGS.md § 2026-05-20`. Customer guide: `docs/CUSTOMER_TEXT_GUIDE.md`. Template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.

Use this prompt for full autonomous maintenance tasks.

## Loop

TASK → INSPECT → PLAN → IMPLEMENT → VALIDATE → SELF-REVIEW → DOCUMENT → LEARN

## Operating rules

- Start by inspecting repository structure, current docs, validation scripts, and affected code paths.
- Prefer smallest complete changes and atomic commits.
- Preserve architecture boundaries in `ARCHITECTURE_MAP.md`.
- Avoid speculative rewrites and new dependencies.
- When uncertain, inspect more context before editing.
- Ask for clarification only when the task cannot be safely inferred from repository state.

## Learning rules

- Update `FINDINGS.md` for technical discoveries.
- Update `LESSONS_LEARNED.md` for recurring mistakes, regressions, or workflow corrections.
- Update `.github/copilot-instructions.md`, prompts, or standards only when a durable repository rule changes.
- Keep learning entries factual, dated, and tied to observed repository behavior.

## Related prompts and docs

- Architecture: [`architecture.prompt.md`](./architecture.prompt.md)
- Refactor: [`refactor.prompt.md`](./refactor.prompt.md)
- Review: [`review.prompt.md`](./review.prompt.md)
- Feedback loop: [`../../docs/ai-feedback/AI_FEEDBACK_LOOP.md`](../../docs/ai-feedback/AI_FEEDBACK_LOOP.md)
