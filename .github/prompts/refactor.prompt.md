# Refactor prompt

## v0.18 sidecar text planning note (2026-05-20)

Current artwork-text planning is focused on **Option C: one sidecar text file beside each customer image** (`painting.jpg` + `painting.txt`). Treat `plan.md § v0.18 proposal — Customer sidecar text files for each painting` as the source of truth and `FINDINGS.md § 2026-05-20 — Customer sidecar text files selected for artwork text` as the research log. Generated manifests remain generated; future customer-written painting text should come from matching sidecars, not manual edits to `artworks.json` or `customer-artworks.js`.


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
