# Dependency & Tooling Maintenance Plan

## Current dependency risk matrix

| Package / Area | Current | Target | Migration requirements | Risk |
|---|---:|---:|---|---|
| vite | 7.3.5 | keep patched on 7.x; evaluate 8.x separately | Vite 7 migration shipped; Vite 8 requires separate Rolldown/Oxc validation | Low to Medium |
| eslint | 8.x (deprecated) | 9.x | Migrate config shape/rules if required by eslint 9 ecosystem updates | Medium |
| @typescript-eslint/* | 7.x | 8.x | Align with installed TypeScript; rerun lint/typecheck and adjust rules if needed | Medium |
| @types/three | installed | evaluate removal | Verify if bundled `three` types fully cover project + examples imports | Medium |

## Completed on 2026-06-21 — Vite major migration

- Upgraded `vite` from the Vite 5 line to `7.3.5`.
- Removed the obsolete `css.preprocessorOptions.scss.api` override from `/home/runner/work/Freyraum/Freyraum/vite.config.ts`.
- Added `build.lib.cssFileName: 'style'` in `/home/runner/work/Freyraum/Freyraum/vite.local.config.ts` so `scripts/write-local-preview.mjs` and generated customer-preview HTML keep the existing `./style.css` contract.
- Validation after the upgrade:
  - `npm run lint` ✅
  - `npm run build:typecheck` ✅
  - `npm run build` ✅
  - `npx vite build` ✅
  - `npm run test --if-present` ✅ (no tests defined)
  - `npm audit --audit-level=moderate` ✅
- Residual risk: plain `npm audit` still reports one low-severity `esbuild` dev-server advisory in the current Vite 7 transitive tree; `npm audit fix` did not apply a non-breaking update in this repository state.

## Rollback guidance

- Revert the Vite 7 package-lock/package.json change together with the related config changes in `vite.config.ts` and `vite.local.config.ts`.
- After rollback, rerun:
  - `npm install`
  - `npm run lint`
  - `npm run build:typecheck`
  - `npm run build`
  - `npx vite build`
  - `npm audit --audit-level=moderate`

## Upgrade safety gates (required per batch)

Run after each upgrade batch:

```bash
npm run lint
npm run build:typecheck
npm run build
npm run test --if-present
npm audit --audit-level=moderate
```

## Notes

- Apply patch/minor updates that pass all gates immediately.
- For major/risky upgrades, stage them in isolated PRs with rollback notes.
