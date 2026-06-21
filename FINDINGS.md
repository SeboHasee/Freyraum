# FINDINGS

## Active findings — Vite 7 migration (2026-06-21)

1. **Baseline before changes**
   - `npm install` was required on the fresh clone.
   - `npm run lint`, `npm run build:typecheck`, `npm run build`, and `npx vite build` passed on Vite `5.4.21`.
   - `npm audit --audit-level=moderate` failed with Vite 5 transitive advisories (`launch-editor` high severity via `vite <=5.4.8`, `esbuild` moderate severity via `vite <=6.4.2`).
   - Baseline build outputs were effectively:
     - `customer-preview/style.css` `41.05 kB`
     - `customer-preview/freyraum-gallery.js` `739.43 kB` (`194.22 kB` gzip)
     - `dist/assets/app-*.css` `41.05 kB`
     - `dist/assets/app-*.js` `740.79 kB` (`195.21 kB` gzip)
2. **Repository-specific migration impact**
   - `vite.config.ts` did not use custom plugins, SSR settings, `resolve.conditions`, or optimizer overrides, so the Vite 6/7 breaking changes there were not applicable.
   - The explicit `css.preprocessorOptions.scss.api = 'modern-compiler'` override was no longer needed after the Vite 6/7 Sass migration and could be removed.
   - `vite.local.config.ts` uses library mode and `scripts/write-local-preview.mjs` hard-codes `./style.css`, so Vite 6+ CSS file-name changes required `build.lib.cssFileName = 'style'` to preserve the customer-preview contract.
3. **Post-upgrade results**
   - Upgrading to Vite `7.3.5` kept `npm run lint`, `npm run build:typecheck`, `npm run build`, and `npx vite build` green.
   - Post-upgrade output stayed equivalent for production-relevant files:
     - `customer-preview/style.css` `41.02 kB` (`-32 B`)
     - `customer-preview/freyraum-gallery.js` `740008 B` (`-116 B`)
     - `dist/assets/app-*.css` `41.02 kB` (`-30 B`)
     - `dist/assets/app-*.js` `740841 B` (`+51 B`)
   - A lightweight HTTP smoke test confirmed `customer-preview/app.html`, `customer-preview/style.css`, `customer-preview/freyraum-gallery.js`, and `dist/app.html` all served successfully after the upgrade.
   - `npm audit --audit-level=moderate` now passes; `npm audit` still reports one **low** severity `esbuild` dev-server advisory with no non-breaking fix applied by `npm audit fix`.
4. **CI verification boundary**
   - The local workflow file `.github/workflows/quality-and-doc-drift.yml` still matches the executed validation commands (`npm ci`, docs check, lint, typecheck, build, audit).
   - The GitHub Actions API for `SeboHasee/Freyraum` exposed only the Copilot cloud-agent workflow during this task, so no remote run history was available for `quality-and-doc-drift.yml`.

## Decisions

- Land the security-relevant Vite major bump as an isolated tooling change with no gallery/runtime feature work.
- Stop at Vite 7.3.5 for this PR; Vite 8’s Rolldown/Oxc migration is a separate modernization step, not a required companion change for restoring repository health.
- Preserve the `customer-preview/style.css` filename explicitly instead of rewriting customer-preview HTML generation.

## Historical context

Long-form historical findings have been moved to:

- `docs/archive/findings-history-2026-06-21.md`
