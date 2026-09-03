# FREYRAUM

FREYRAUM is a Three.js-based immersive digital gallery with a local customer workflow for importing artworks, text metadata, and optional background audio into a file://-safe preview.

## Current project state

- Runtime renderer: WebGL (WebGPU is opt-in probe mode only).
- Resilient startup: the real renderer is attempted directly with preferred,
  compatibility, then battery-safe attributes. Failed partial contexts are
  released; no separate detection context is retained.
- Support contract: immersive rendering requires working WebGL 2. If it cannot
  initialize, artwork images, titles, metadata, and descriptions remain
  available in an accessible, responsive 2D museum instead of a blocking alert.
- Startup flows from the loading screen into a manifest-driven Main Museum Hub:
  the customer room backdrop remains the environmental plate, while a dedicated
  on-demand WebGL room scene renders calibrated front/left/right walls inside a
  tall 9 × 12 × 5.2 m architectural hall plus an entry enclosure behind the
  camera, doorway passage pockets, floor/ceiling shadow gaps, longitudinal
  perimeter luminaires, a pitched glazed skylight with procedural atmospheric
  sky, mounted artwork depth, and soft directional contact shadows.
- Hub interaction DOM is now only the screen-space accessibility bridge. Slots
  resolve by exact `Artwork.id` from `customer-artworks/museum-hub.json`; the
  shipping v5 hub contract persists camera far/lens-shift, room envelope,
  hanging rules, wall transforms/drawable regions/exclusion polygons, and
  canonical wall-relative artwork placement (`horizontalPosition`,
  `centerHeight`, `physicalHeight`, `mountingGap`). Runtime U/V/N mounting
  frames derive the metric anchor, preserve source aspect ratio, point every
  artwork into the room, and project the actual mounted front face for the DOM
  interaction bridge. Larger exhibitions paginate into additional room pages,
  and narrow-portrait viewports split each room into left/right wall focus pages.
- Quality presets now also drive the hub room pixel ratio, architectural
  detail resolution, skylight shadowing, and floor reflection strategy
  (`planar`, `ibl`, `off`). The hub uses smooth near-white PBR plaster and a
  distinct pale satin-mineral floor; physical geometry and local light create
  their form while the closer gallery retains its tactile mapped plaster profile.
- Startup readiness modes are active (`full`, `entry-balanced` default, `entry-minimal`).
- Render loop keeps rAF alive for measurement but suppresses idle composer renders when gallery state is settled.
- The interactive gallery now mounts artworks inside a compact architectural stage
  (front display wall, floor, ceiling, side returns, shadow gap, and ceiling
  reveal) while keeping the hub on its independent v0.87 room renderer.
- The interactive-gallery wall now keeps visible but restrained matte plaster
  texture, with a calmer ceiling response so the room reads tactile rather than
  flat.
- Single-artwork inspection now keeps a small deliberate grey-wall reveal margin
  at extreme pan and clamps hover tilt against the deeper front-wall clearance,
  so detailed inspection regains some travel without letting the mounted work
  intersect the stage wall behind it.
- Lighting still uses one fixed balanced neutral-gallery configuration, but the
  single-artwork view now runs at a softer ambient/direct energy balance and a
  lower matte-sheen baseline so bright artworks no longer wash out as easily.
- The hub keeps a separate daylight architectural rig: three explicitly
  downward-facing local area sources connect the coves/skylight to wall and
  floor illumination, a restrained sky-aligned key casts architectural shadows,
  and low environment/hemisphere levels supply only soft fill. Battery uses a
  simple gradient sky and inexpensive directional fallback.
- Interactive-gallery artworks render as shallow mounted objects with no default
  decorative frame or side-preview mesh.
- The timeline remains visible across desktop and responsive layouts; only descriptive chrome auto-hides.
- Artwork `Surface` metadata is optional free text and never changes material or
  render settings.
- Artwork `Presentation` metadata is optional, validated, and affects only the
  interactive-gallery mounting profile (`canvas`, `fine-art-paper`,
  `matte-print`, `satin-print`, `glazed-print`; default `matte-print`).
- Hub and gallery now share one artwork-source contract: the declared
  `image` asset stays primary for served environments, while the offline
  `file://` museum-hub preview may prefer embedded `webglImage` data when the
  declared customer image resolves to a local file URL that is less reliable
  for WebGL upload.
- Generated `customer-artworks.js` now also publishes
  `window.__FREYRAUM_ARTWORK_BUNDLE__` with a script-derived `assetBaseUrl`,
  so the same imported customer image bundle resolves consistently in the local
  file preview, Vite dev, and GitHub Pages builds.
- A grey or blank artwork is a source-to-pixel incident, not a lighting issue.
  The gallery's generated fallback, the hub's title-bearing placeholder, and a
  blank local `file://` wall plane are distinct states from a real decoded
  image; both routes record one shared, redacted `source-to-pixel-outcome`
  diagnostic per artwork (see `src/utils/sourceToPixelOutcome.ts`) naming the
  first failed stage or confirming full source→decode→GPU→pixels proof, and
  both apply a shared capability-aware downscale
  (`src/utils/textureUploadCompatibility.ts`) before any decoded image reaches
  the GPU. Do not compensate missing artwork pixels with room lighting or
  metadata; the implemented local-preview recovery is `plan.md § v0.93`.
- CSS and WebGL share one authoritative concrete-grey wall token (`#C7CED4`,
  `--color-gallery-wall`) resolved before renderer construction, so gallery,
  hub, fallback surfaces, and the WebGL clear color can never drift apart.
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
npm run validate:museum-hub
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
