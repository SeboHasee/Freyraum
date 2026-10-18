# Contributing
> Latest markdown audit: 2026-10-18 (photograph-backed museum follow-up).

## Validation baseline

Before opening a PR, run:

```bash
npm install
npm run lint
npm run build:typecheck
npm run build
npm run test:frame-budget
```

For artwork/importer/museum-hub/runtime-doc changes also run:

```bash
npm run import:artworks
npm run validate:museum-hub
npm run docs:check-config-authority
```

`npm run build` imports/syncs customer content through `prebuild`; direct
`build:preview` is only a partial build and does not refresh injected layout data.
For stale-index reports test root `index.html`, not only the direct preview:
see `docs/REGRESSION_TOOLING.md`. Keep local Vite base `./` and production
`/Freyraum/` separate.

For editor, save-service or desktop-app changes also run the focused tests in
`docs/REGRESSION_TOOLING.md` → "Automated test commands" (`test:editor-drag`,
`test:editor-rooms`, `test:editor-publish`, `test:save-service`,
`test:local-project`, `test:desktop-app`, `smoke:desktop-package`).

For dependency changes also run:

```bash
npm audit --audit-level=moderate
```

Open the pull request early: CI (`quality-and-doc-drift.yml`) runs only on pull
requests and `main`, and runs started by bots/agents wait for the owner's
**Approve and run** in the Actions tab.

## Documentation freshness policy (required)

Update docs in the same PR when your change affects:

- runtime behavior
- query parameters or localStorage config keys
- startup flow/readiness behavior
- diagnostics output/API
- customer workflow
- architecture ownership/boundaries

If docs are not updated, the PR is incomplete.

When a user reports that a documented or shipped visual recovery still fails,
reopen the incident in `plan.md` and `FINDINGS.md`. Do not keep an unverified
"fixed" claim: reproduce with the current customer bundle and document the
first failed source-to-pixel stage before choosing a rendering change. For a
local blank-artwork report, reproduce the exact `customer-preview/app.html`
`file://` preview with the documented diagnostics query from
`docs/QUERY_PARAMETERS.md`, preserve the generated `customer-artworks.js` plus
matching `images/` evidence, and only then choose a runtime fix.

## Source-of-truth rules

- Configuration tables/keys belong only in `docs/QUERY_PARAMETERS.md`.
- Release history belongs only in `CHANGELOG.md`.
- Architecture ownership belongs in `ARCHITECTURE_MAP.md`.
- Current product overview belongs in `README.md`.

Other docs should link to canonical sources instead of duplicating them.

For museum-layout reports, preserve the exact environment (`file://` customer
preview, Vite dev/build, or deployed Pages), visible room counter, generated
`customer-artworks.js`, injected `museum-hub.json`, and screenshot together.
Passing `validate:museum-hub` proves geometry contracts, not perceptual
acceptance or that the observed artifact was built from the current branch.

When changing the standalone placement editor, verify both
`placement-editor.html` and generated
`customer-preview/placement-editor.html`. Preserve compatible fixed camera/3D
room/wall data and the complete configured model across export/import, while
allowing supported room-count and artwork-assignment changes. Wall quads are
editable, and layout hints do not block saving. Museum and editor must agree on
photograph-backed DOM artwork projection. If importer output changes, confirm
both file-preview entries use fresh cache-busting query strings.

## Architecture drift audit (required when architecture-affecting changes occur)

Verify and document in the PR:

1. Folder structure still matches architecture docs.
2. Ownership map still matches implementation.
3. Rendering pipeline docs still match active code paths.
4. Startup sequence docs still match initialization order.

## Dependency upgrade safety gates

After each dependency-upgrade batch, run and record:

- `npm run lint`
- `npm run build:typecheck`
- `npm run build`
- `npm run test:frame-budget`

If a risky major upgrade is deferred, log it in `docs/DEPENDENCY_MAINTENANCE_PLAN.md`.
