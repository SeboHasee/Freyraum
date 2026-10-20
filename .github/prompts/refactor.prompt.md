# Refactor prompt
> Latest markdown audit: 2026-10-20 (photo-room screenshot follow-up).

## Current context

Read `.github/copilot-instructions.md` § Current context (v1.40) first; it is the
single current summary for agents.

Use this prompt when refactoring FREYRAUM code.

## Goal

Improve structure or maintainability without changing customer-visible behavior unless explicitly requested.

## Required context

- Read the affected files and their nearest collaborators.
- Check `ARCHITECTURE_MAP.md`, `AI_RULES.md`, `DOCUMENTATION_RULES.md`, recent `FINDINGS.md`, and relevant `plan.md` sections.
- Identify existing naming, diagnostics, lifecycle, disposal, and validation patterns before editing.

## Constraints

- Prefer minimal vertical slices.
- Avoid new dependencies.
- Do not remove diagnostics, accessibility guards, generated-preview sync, or WebGL reliability paths.
- Keep public behavior and customer preview compatibility stable.

## Review checklist

- Does the refactor preserve behavior?
- Are ownership boundaries clearer?
- Are validation commands unchanged and passing?
- Did documentation need an update?
- Are any lessons worth recording for future agents?

## Related prompts

- Architecture first: [`architecture.prompt.md`](./architecture.prompt.md)
- Review after changes: [`review.prompt.md`](./review.prompt.md)
- Full autonomous loop: [`autonomous-agent.prompt.md`](./autonomous-agent.prompt.md)
