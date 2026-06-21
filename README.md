# FREYRAUM

FREYRAUM is a Three.js-based immersive digital gallery with a local customer workflow for importing artworks, text metadata, and optional background audio into a file://-safe preview.

## Current project state

- Runtime renderer: WebGL (WebGPU is opt-in probe mode only).
- Startup readiness modes are active (`full`, `entry-balanced` default, `entry-minimal`).
- Diagnostics API is available (see `docs/QUERY_PARAMETERS.md`).
- Customer updates are handled by `Update Gallery.command` (macOS) or `Update Gallery.bat` (Windows).

Historical release details are maintained in [`CHANGELOG.md`](./CHANGELOG.md).

## Quick start (developers)

```bash
npm install
npm run lint
npm run build:typecheck
npm run build
npm run dev
```

## Customer update workflow

1. Add images to `customer-artworks/inbox/`.
2. (Optional) Add sidecar text cards (`.txt`) with the same basename.
3. (Optional) Add audio files to `customer-audio/inbox/`.
4. Run `Update Gallery.command` / `Update Gallery.bat`.
5. Open `customer-preview/app.html`.

Details:
- [`docs/CUSTOMER_PICTURE_GUIDE.md`](./docs/CUSTOMER_PICTURE_GUIDE.md)
- [`docs/CUSTOMER_TEXT_GUIDE.md`](./docs/CUSTOMER_TEXT_GUIDE.md)

## Configuration and diagnostics

All query parameters and persistent runtime configuration keys are documented in:

- [`docs/QUERY_PARAMETERS.md`](./docs/QUERY_PARAMETERS.md)

Do not duplicate config tables in other docs.

## Repository source-of-truth matrix

| Topic | Canonical document |
|---|---|
| Current product state | `README.md` |
| Release history | `CHANGELOG.md` |
| Query parameters & persisted config | `docs/QUERY_PARAMETERS.md` |
| Architecture & ownership | `ARCHITECTURE_MAP.md` |
| Customer workflow | `docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/CUSTOMER_TEXT_GUIDE.md` |
| Contributor workflow & freshness rules | `CONTRIBUTING.md` |
| Technical findings (active/reusable) | `FINDINGS.md` |
| Active engineering work | `plan.md` |

## Documentation map

- Overview: [`README.md`](./README.md)
- History: [`CHANGELOG.md`](./CHANGELOG.md)
- Configuration reference (authoritative): [`docs/QUERY_PARAMETERS.md`](./docs/QUERY_PARAMETERS.md)
- Architecture: [`ARCHITECTURE_MAP.md`](./ARCHITECTURE_MAP.md)
- Contributor workflow: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Handoff/support: [`docs/HANDOFF.md`](./docs/HANDOFF.md)
- Documentation policy: [`DOCUMENTATION_RULES.md`](./DOCUMENTATION_RULES.md)
- Archive: [`docs/archive/README.md`](./docs/archive/README.md)

## Dependency and tooling status

- See [`docs/DEPENDENCY_MAINTENANCE_PLAN.md`](./docs/DEPENDENCY_MAINTENANCE_PLAN.md) for risky upgrades and migration planning.
- CI/automation safeguards are defined in [`CONTRIBUTING.md`](./CONTRIBUTING.md) and workflow files under `.github/workflows/`.
