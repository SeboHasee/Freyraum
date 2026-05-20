# Autonomous agent prompt

## v0.18 sidecar text planning note (2026-05-20)

Current artwork-text planning is focused on **Option C: one sidecar text file beside each customer image** (`painting.jpg` + `painting.txt`). Treat `plan.md § v0.18 proposal — Customer sidecar text files for each painting` as the source of truth and `FINDINGS.md § 2026-05-20 — Customer sidecar text files selected for artwork text` as the research log. Generated manifests remain generated; future customer-written painting text should come from matching sidecars, not manual edits to `artworks.json` or `customer-artworks.js`.


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
