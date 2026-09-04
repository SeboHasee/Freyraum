# Contributing
> Latest markdown audit: 2026-09-04 (v1.12 full conversation documentation sync).

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

For dependency changes also run:

```bash
npm audit --audit-level=moderate
```

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
