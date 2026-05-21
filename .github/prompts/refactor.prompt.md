# Refactor prompt
> Last full markdown audit: 2026-05-21 (v0.20.5 audio regression audit + recovery plan).

## v0.20.5 context note

Current repository status includes a live audio follow-up. Do not preserve the current broken volume-state coupling or the current quick-control placement by accident during refactors; consult `plan.md § v0.20.5` first.

## v0.18 — Customer sidecar text shipped (2026-05-20)

Current status: shipped. The importer (`scripts/import-artworks.mjs`) reads same-basename `.txt` sidecars (`.md` accepted as a backup) and merges customer-facing metadata into the generated manifest. Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned. Canonical plan: `plan.md § v0.18`. Research log: `FINDINGS.md § 2026-05-20`. Customer guide: `docs/CUSTOMER_TEXT_GUIDE.md`. Template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.

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
