# Contributing

## Validation baseline

Before opening a PR, run:

```bash
npm install
npm run lint
npm run build:typecheck
npm run build
npm run test:frame-budget
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

## Source-of-truth rules

- Configuration tables/keys belong only in `docs/QUERY_PARAMETERS.md`.
- Release history belongs only in `CHANGELOG.md`.
- Architecture ownership belongs in `ARCHITECTURE_MAP.md`.
- Current product overview belongs in `README.md`.

Other docs should link to canonical sources instead of duplicating them.

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
