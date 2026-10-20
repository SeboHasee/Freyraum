# FREYRAUM
> Latest markdown audit: 2026-10-20 (photo-room screenshot follow-up).

FREYRAUM is a Three.js-based immersive digital gallery with a local customer workflow for importing artworks, text metadata, and optional background audio into a file://-safe preview.

## Place artworks

The default room follows the supplied reference: **Gartenszene** front-left,
**Akt 27** front-right, **Fraktal** on the left side wall and **Wunderbaum** on
the right, over `Museum_ohne_Bilder.png`. The checked-in
`customer-artworks/museum-hub.json` owns this arrangement and its native-ratio sizes.
The source filenames are `Gatrenszene.png`, `Akt 27.png`, `Fraktal.png` and
`Wunderbaum.png` in `customer-artworks/inbox/` (the garden filename is misspelled).
After downloading a project update, run `Update Gallery.bat` / `Update Gallery.command`
before opening the root `index.html`: generated customer data is local, not tracked
in Git. Developer `npm run build` now imports current artwork/config first;
the local preview versions its scripts and stylesheet to avoid old cached output.

The placement editor arranges pictures on the museum walls and in rooms
(add, fill, switch and delete rooms; drag, resize, keyboard nudge, undo/redo).
Every artwork can be dragged to every edge of its green mounting zone; editing
walls never stretches artwork. The same editor runs in three ways:

| Way | Opens | Saves to | Guide |
|---|---|---|---|
| **FREYRAUM Editor app** (Windows/macOS, v1.39–v1.40) | the project folder | directly into the folder ("Im Projekt speichern"), then updates the gallery with its bundled importer | `docs/CUSTOMER_PICTURE_GUIDE.md` → "FREYRAUM Editor (App)"; build/release: `docs/DESKTOP_APP.md` |
| **Online editor** (v1.38) | `placement-editor.html` on the gallery site (type "bearbeiten" in the gallery) | the save service (`worker/`) → a commit on `content/edits` → review → deploy | `docs/ONLINE_EDITOR_SETUP.md` (one-time owner setup) |
| **Local file** | `OPEN_ARTWORK_EDITOR.html` (double-click) | a downloaded `museum-hub.json` to copy into `customer-artworks/` | `docs/CUSTOMER_PICTURE_GUIDE.md` |

Placement rules (wall ownership, complete-quad mounting checks, error-only
save/export blocking, editable wall quads and compatible fixed 3D models) are
the same in all three; see
`ARCHITECTURE_MAP.md` → "Deterministic curator editor".

## Inspect in a photo room

In the inspection gallery, choose **Fotoraum** to open one of four photographs:
**Schlafzimmer**, **Wohnraum**, **Wohnbereich**, or **Büro**. The room view uses
the gallery timeline to select the artwork, so selection stays synchronized
when switching between gallery and room. Use the room selector for a different
photograph and **Zurück zur Galerie** to leave.
Drag to pan, zoom with the wheel/pinch/buttons, and reset the view with the
on-screen control. Zoom buttons bring the projected artwork center toward the
viewport center; wheel and pinch stay anchored to the pointer/gesture. The artwork
keeps its configured size on the photographed wall. Zoom buttons and wheel motion
use the gallery's two-stage, frame-rate-independent camera easing on desktop and
touch devices, with smooth target retargeting during repeated input; active drag
and pinch remain direct. Nearby desktop mouse movement produces a very subtle,
smoothly returning tilt. On touch devices, the **↗** control optionally enables
subtle artwork tilt from phone movement; sensor access is requested only after
that action, and the feature can be disabled again. Unsupported or denied sensors
leave touch controls available. Reduced motion disables sensor tilt. Stronger
contact and directional shadows keep the print attached to the wall. This is a
bounded 2D photo camera, not true 3D orbit or movement.
`customer-artworks/museum-hub.json` owns the room photo and placement data;
in the placement editor's **Raum** tab, **Foto-Raum gestalten** selects a room
and edits its normalized wall corners and artwork position/height with the same
projection preview used by visitors. Save/export preserves those values.
Update Gallery stages configured photos for the local preview. Cleaned room-view
photos remove the pre-existing wall paintings; the original customer photos remain
unchanged. The four source photos are about 2K wide and no higher-resolution
originals are available. Cleaned derivatives receive restrained sharpening at
source resolution; synthetic 2× upscales were rejected because they added no
source detail and increased loading/memory costs.
A user screenshot received 2026-10-20 again appears to crop the top of artwork
in Wohnbereich. The screenshot build/config identity is unknown; see
`FINDINGS.md` and `docs/HANDOFF.md`. Do not treat viewport-fixture passes as
customer visual acceptance.

## Current project state

- The museum and editor share photograph-backed, calibrated DOM artwork;
  the inspection gallery uses WebGL, with an optional full-screen photographic
  room view for one selected artwork (WebGPU is opt-in probe mode only).
- Resilient startup: the real renderer is attempted directly with preferred,
  compatibility, then battery-safe attributes. Failed partial contexts are
  released; no separate detection context is retained.
- Support contract: immersive rendering requires working WebGL 2. If it cannot
  initialize, artwork images, titles, metadata, and descriptions remain
  available in an accessible, responsive 2D museum instead of a blocking alert.
- Startup flows from the loading screen into a manifest-driven Main Museum Hub.
  The customer photograph is the visible room; no opaque WebGL room covers it.
  Museum and editor artwork pixels use the same calibrated DOM projection.
  The source photograph `customer-artworks/Backgrounds/Museum_ohne_Bilder.png`
  exists; the former lowercase/hyphenated JSON reference was incorrect.
- Hub DOM owns artwork pixels as well as accessible interaction. Slots
  resolve by exact `Artwork.id` from `customer-artworks/museum-hub.json`; the
  shipping v5 hub contract persists camera far/lens-shift, room envelope,
  hanging rules, wall transforms/drawable regions/exclusion polygons, and
  canonical wall-relative artwork placement (`horizontalPosition`,
  `centerHeight`, `physicalHeight`, `mountingGap`). Runtime U/V/N mounting
  frames derive the metric anchor, preserve source aspect ratio, point every
  artwork into the room, and supply calibrated geometry for DOM projection.
  Each room uses a maximum of four works—two on the front
  wall and one safely inset on each side wall—with no oversized backing cards.
  Larger exhibitions paginate into additional room pages,
  and narrow-portrait viewports split each room into left/right wall focus pages.
- **Local confirmation (2026-10-18):** the customer reports the intended setup
  works after running `Update Gallery.bat` and supplies a four-painting screenshot.
  Root-index and production-build smoke checks confirm all four images and the
  photograph are visible, with matching editor geometry. Live acceptance still
  requires the post-merge Pages deployment and smoke job; see `docs/HANDOFF.md`.
- Startup readiness modes are active (`full`, `entry-balanced` default, `entry-minimal`).
- Render loop keeps rAF alive for measurement but suppresses idle composer renders when gallery state is settled.
- The interactive gallery now mounts artworks inside a compact architectural stage
  (front display wall, floor, ceiling, side returns, shadow gap, and ceiling
  reveal), separately from the photograph-backed museum.
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
  image. Redacted source diagnostics must distinguish DOM image decode/display
  from the gallery's source→decode→GPU→pixels proof
  (`src/utils/sourceToPixelOutcome.ts`). Capability-aware downscaling
  (`src/utils/textureUploadCompatibility.ts`) still protects GPU upload paths.
  Do not compensate missing artwork pixels with room lighting or
  metadata; the implemented local-preview recovery is `docs/archive/plan-history-2026-10-17.md` § v0.93.
- CSS and WebGL share one authoritative concrete-grey wall token (`#C7CED4`,
  `--color-gallery-wall`) resolved before renderer construction, so gallery,
  hub, fallback surfaces, and the WebGL clear color can never drift apart.
- Diagnostics API is available (see `docs/QUERY_PARAMETERS.md`).
- Regression tooling is documented in `docs/REGRESSION_TOOLING.md`.
- Customer updates are handled by `Update Gallery.command` (macOS) or `Update Gallery.bat` (Windows).
- Current publishing still depends on GitHub-tracked customer artwork files; for oversized originals see `docs/IMAGE_MAINTENANCE_GUIDE.md` and `plan.md`.

Historical release details are maintained in [`CHANGELOG.md`](./CHANGELOG.md).
Active visual follow-up is tracked in [`plan.md`](./plan.md).

## Quick start (developers)

```bash
npm install
npm run lint
npm run build:typecheck
npm run build
npm run validate:museum-hub
npm run dev
```

All test commands, what they prove and which CI workflow runs them:
[`docs/REGRESSION_TOOLING.md`](./docs/REGRESSION_TOOLING.md) → "Automated test commands".
Desktop app development: [`docs/DESKTOP_APP.md`](./docs/DESKTOP_APP.md).

## Customer update workflow

1. Add images to `customer-artworks/inbox/`.
2. (Optional) Add sidecar text cards (`.txt`) with the same basename.
3. (Optional) Add audio files to `customer-audio/inbox/`.
4. Run `Update Gallery.command` / `Update Gallery.bat` (local preview) — the
   FREYRAUM Editor app does this for you.
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
| Online editor / save service setup | `docs/ONLINE_EDITOR_SETUP.md` |
| Desktop app build, release, security | `docs/DESKTOP_APP.md` |
| Lessons learned | `LESSONS_LEARNED.md` |
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
- Desktop app (build, release, signing, security): [`docs/DESKTOP_APP.md`](./docs/DESKTOP_APP.md)
- Online editor setup (save service): [`docs/ONLINE_EDITOR_SETUP.md`](./docs/ONLINE_EDITOR_SETUP.md)
- Lessons learned: [`LESSONS_LEARNED.md`](./LESSONS_LEARNED.md)
- Image maintenance / high-resolution constraints: [`docs/IMAGE_MAINTENANCE_GUIDE.md`](./docs/IMAGE_MAINTENANCE_GUIDE.md)
- Handoff/support: [`docs/HANDOFF.md`](./docs/HANDOFF.md)
- Documentation policy: [`DOCUMENTATION_RULES.md`](./DOCUMENTATION_RULES.md)
- Archive: [`docs/archive/README.md`](./docs/archive/README.md)

## Dependency and tooling status

- See [`docs/DEPENDENCY_MAINTENANCE_PLAN.md`](./docs/DEPENDENCY_MAINTENANCE_PLAN.md) for risky upgrades and migration planning.
- CI/automation safeguards are defined in [`CONTRIBUTING.md`](./CONTRIBUTING.md) and workflow files under `.github/workflows/`.
