# Dependency & Tooling Maintenance Plan
> Latest markdown audit: 2026-11-03 (timeline/navigation merge review).

## Current dependency risk matrix

| Package / Area | Current | Target | Migration requirements | Risk |
|---|---:|---:|---|---|
| vite | 5.x | latest secure major | Validate build + preview output and plugin compatibility after major bump | High (breaking major) |
| eslint | 8.x (deprecated) | 9.x | Migrate config shape/rules if required by eslint 9 ecosystem updates | Medium |
| @typescript-eslint/* | 7.x | 8.x | Align with installed TypeScript; rerun lint/typecheck and adjust rules if needed | Medium |
| @types/three | installed | evaluate removal | Verify if bundled `three` types fully cover project + examples imports | Medium |

## Upgrade safety gates (required per batch)

Run after each upgrade batch:

```bash
npm run lint
npm run build:typecheck
npm run build
npm run test:frame-budget
npm audit --audit-level=moderate
```

## Notes

- Apply patch/minor updates that pass all gates immediately.
- For major/risky upgrades, stage them in isolated PRs with rollback notes.

## Audit status (2026-11-03)

- Root: `npm audit --omit=dev` → 0 vulnerabilities. Full `npm audit` reports
  22 development-tool findings (15 moderate, 7 high), including vite/esbuild,
  brace-expansion, immutable, js-yaml, nanoid, postcss and source-map-js plus
  affected lint-tool chains. They are pre-existing in the unchanged lockfile,
  not introduced by the timeline/navigation work. Resolve in an isolated
  dependency-maintenance change using the upgrade gates above; do not run
  `npm audit fix --force` as merge polish.
- `desktop/` (last checked 2026-10-17): `npm audit --omit=dev` → 0; 8 moderate `sprintf-js` findings come
  from `electron-builder` (build machine only; see `docs/DESKTOP_APP.md`).
- `worker/` has no own `package.json`; it is bundled with the root esbuild.
- All workflows use Node 22 (Node 20 reached end of life in April 2026).
