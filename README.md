# FREYRAUM

FREYRAUM is a Three.js-based immersive digital gallery with a local customer workflow for importing artworks, text metadata, and optional background audio into a file://-safe preview.

## Current project state

- Runtime renderer: WebGL (WebGPU is opt-in probe mode only).
- Startup readiness modes are active (`full`, `entry-balanced` default, `entry-minimal`).
- Render loop keeps rAF alive for measurement but suppresses idle composer renders when gallery state is settled.
- Diagnostics API is available (see `docs/QUERY_PARAMETERS.md`).
- Regression tooling is documented in `docs/REGRESSION_TOOLING.md`.
- Customer updates are handled by `Update Gallery.command` (macOS) or `Update Gallery.bat` (Windows).
- Current publishing still depends on GitHub-tracked customer artwork files; for oversized originals see `docs/IMAGE_MAINTENANCE_GUIDE.md` and `plan.md`.

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
4. Run `Update Gallery.command` / `Update Gallery.bat` (local preview).
5. Open `customer-preview/app.html`.

To publish to GitHub Pages: commit the inbox files and push to `main` — CI
runs the import step automatically and deploys to https://sebohasee.github.io/Freyraum/.

Details:
- [`docs/CUSTOMER_PICTURE_GUIDE.md`](./docs/CUSTOMER_PICTURE_GUIDE.md)
- [`docs/CUSTOMER_TEXT_GUIDE.md`](./docs/CUSTOMER_TEXT_GUIDE.md)
- [`docs/IMAGE_MAINTENANCE_GUIDE.md`](./docs/IMAGE_MAINTENANCE_GUIDE.md)
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)

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
| Image maintenance & size constraints | `docs/IMAGE_MAINTENANCE_GUIDE.md` |
| GitHub Pages deployment | `docs/DEPLOYMENT.md` |
| Contributor workflow & freshness rules | `CONTRIBUTING.md` |
| Technical findings (active/reusable) | `FINDINGS.md` |
| Active engineering work | `plan.md` |
| Regression tooling | `docs/REGRESSION_TOOLING.md` |

## Documentation map

- Overview: [`README.md`](./README.md)
- History: [`CHANGELOG.md`](./CHANGELOG.md)
- Configuration reference (authoritative): [`docs/QUERY_PARAMETERS.md`](./docs/QUERY_PARAMETERS.md)
- Regression tooling: [`docs/REGRESSION_TOOLING.md`](./docs/REGRESSION_TOOLING.md)
- Architecture: [`ARCHITECTURE_MAP.md`](./ARCHITECTURE_MAP.md)
- Contributor workflow: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Deployment / Pages: [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)
- Image maintenance / high-resolution constraints: [`docs/IMAGE_MAINTENANCE_GUIDE.md`](./docs/IMAGE_MAINTENANCE_GUIDE.md)
- Handoff/support: [`docs/HANDOFF.md`](./docs/HANDOFF.md)
- Documentation policy: [`DOCUMENTATION_RULES.md`](./DOCUMENTATION_RULES.md)
- Archive: [`docs/archive/README.md`](./docs/archive/README.md)

## Dependency and tooling status

- See [`docs/DEPENDENCY_MAINTENANCE_PLAN.md`](./docs/DEPENDENCY_MAINTENANCE_PLAN.md) for risky upgrades and migration planning.
- CI/automation safeguards are defined in [`CONTRIBUTING.md`](./CONTRIBUTING.md) and workflow files under `.github/workflows/`.
