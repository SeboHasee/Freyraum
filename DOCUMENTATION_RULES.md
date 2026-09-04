# Documentation Rules
> Latest markdown audit: 2026-09-04 (v1.12 full conversation documentation sync).

## Goal

Keep documentation authoritative, minimal, and resistant to drift.

## Canonical ownership

- `README.md` → current product state and navigation map
- `CHANGELOG.md` → historical release history
- `docs/QUERY_PARAMETERS.md` → authoritative configuration reference
- `ARCHITECTURE_MAP.md` → current architecture and ownership
- `CONTRIBUTING.md` → contributor workflow and freshness policy
- `docs/CUSTOMER_*_GUIDE.md` → customer workflows
- `FINDINGS.md` → reusable technical findings (active)
- `plan.md` → active engineering work
- `docs/archive/` → historical rationale and retired long-form context

## Anti-duplication rules

1. Do not duplicate configuration tables outside `docs/QUERY_PARAMETERS.md`.
2. Do not duplicate release history outside `CHANGELOG.md`.
3. Do not embed long historical status sections in operational docs.
4. Prefer links to canonical documents over copied content.
5. When customer feedback reopens a documented visual incident, downgrade the
   prior fixed claim and link the current evidence and active recovery plan.
6. A screenshot is evidence of one rendered artifact, not automatically the
   current source tree. Record its date and visible state, but require the
   matching generated bundle/config/environment before assigning root cause.
7. Keep archived Markdown immutable except for its index; a full audit reviews
   archive discoverability rather than rewriting historical claims.

## Documentation freshness policy

A PR is incomplete unless docs are updated when changes affect:

- runtime behavior
- query parameters or persisted config keys
- startup flow/readiness behavior
- diagnostics output/API
- customer workflow (import/update/view)
- architecture/module ownership

## Required validation for doc/tooling PRs

Run:

```bash
npm run docs:check-config-authority
npm run lint
npm run build:typecheck
npm run build
npm run test:frame-budget
```

For dependency updates also run:

```bash
npm audit --audit-level=moderate
```

## Historical context policy

Do not rely on Git history as the only rationale source.
Preserve valuable historical rationale in `docs/archive/`.
