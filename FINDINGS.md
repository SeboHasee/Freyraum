# FINDINGS

## Active findings — documentation/tooling remediation (2026-06-21)

1. The primary drift source is duplicated status/config/runtime text across operational docs.
2. `docs/QUERY_PARAMETERS.md` already matches current startup/debug/backend/preferences implementation and should remain the sole config authority.
3. Dependency/tooling drift is present:
   - `eslint@8` is deprecated.
   - `@typescript-eslint` 7.x compatibility lags the locked TypeScript version.
   - `npm audit` reports vulnerabilities tied to transitive/tooling dependencies.
4. Lack of contributor-facing freshness rules and CI checks allows drift to re-accumulate.

## Decisions

- Keep historical rationale in `docs/archive/` rather than relying on Git history.
- Keep release history in `CHANGELOG.md`.
- Keep config tables exclusively in `docs/QUERY_PARAMETERS.md`.
- Use contributor policy + CI checks to prevent recurrence.

## Historical context

Long-form historical findings have been moved to:

- `docs/archive/findings-history-2026-06-21.md`
