# Autonomous agent prompt
> Latest markdown audit: 2026-10-17 (v1.40 merge-readiness audit).

## Current context

Read `.github/copilot-instructions.md` § Current context (v1.40) first; it is the
single current summary for agents.

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
