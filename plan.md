# FREYRAUM Plan

## Active tooling maintenance plan — Vite 7 migration (2026-06-21)

### Goals

1. Move the repository off Vite 5 without changing runtime/gallery behavior.
2. Preserve `dist/` and `customer-preview/` output contracts during the upgrade.
3. Record migration decisions, validation results, and rollback boundaries.

### Active work items

- [x] Capture baseline lint/typecheck/build/audit results and artifact sizes on Vite 5.4.21.
- [x] Review Vite 6 + Vite 7 migration guidance against this repository’s actual config usage.
- [x] Upgrade to Vite 7.3.5 and remove the obsolete SCSS modern-API override.
- [x] Preserve customer preview CSS naming via `build.lib.cssFileName: 'style'`.
- [x] Re-run lint/typecheck/build/dist/audit checks and compare output against baseline.
- [x] Document residual risk and rollback guidance in maintenance docs.

### Historical context

Long-form historical planning has been moved to:

- `docs/archive/plan-history-2026-06-21.md`
