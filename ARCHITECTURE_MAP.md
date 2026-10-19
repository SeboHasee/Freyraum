# FREYRAUM Architecture Map
> Latest markdown audit: 2026-10-19 (photographic inspection rooms).

This file documents the current architecture and ownership boundaries only.
Historical implementation narratives belong in `CHANGELOG.md` or `docs/archive/`.

## Runtime architecture

- `src/main.ts`
  - Boot orchestration
  - Lifecycle handling
  - UI wiring
  - Render-loop coordination and idle render suppression
- `src/core/`
  - `RendererManager`, `SceneManager`, `GalleryPresentationStage`, post-processing pipeline
- `src/gallery/`
  - Gallery state, artwork switching, preload/warm orchestration, texture usage,
    and mounted-work composition
- `src/materials/`
  - Painting and frame material behavior, procedural texture generation, and
    shared architectural materials. `ArchitecturalSurfaceFactory` selects
    smooth light-driven PBR plaster and satin-mineral hub finishes, and mapped
    tactile plaster for the closer interactive gallery.
- `src/config/`
  - Startup and quality/runtime config models
  - `galleryPresentation.ts`: compact interactive-gallery stage envelope and
    mounted-work spacing constants
  - `presentation.ts`: validated interactive-gallery presentation profiles
  - `museumHub.ts`: unified museum-hub schema, v1/legacy migration, calibrated
    wall-plane contract (stage + multi-plane wall quads + stage-space safe
    polygons + canonical normalized-U/center-height/physical-height/mounting-gap
    slot placement), reference-quad room reconciliation, wall-realism gating,
    exact-ID slot resolver (four-work 2+1+1 pages + paginated overflow),
    contiguous page-index normalization, v1–v4 legacy reflow, deterministic
    local placement/spacing validation, side-wall doorway/front-corner
    local clearance gates (0.35 m doorway / 4.00 m front corner), projected
    doorway/corner-seam guards, and visual-token resolution
- `src/hub/`
  - `projectiveGeometry.ts`: camera/room projection math, room-plane/reference
    reconciliation, doorway-safe deterministic placement solving, polygon
    checks, validated U/V/N artwork mounting frames, and mounted-front-face
    projection for hub interaction geometry
  - `HubRoomRenderer`: retained source infrastructure, not instantiated by
    `MainMuseumHub` (its renderer field remains null; no hub canvas is allocated).
    Museum and editor always use `.is-photographic`; photograph and artwork
    opacity remain 1. It must not place an opaque
    architectural scene over the customer photograph. The baseline
    `onBeforeCompile` initialization failure is not claimed repaired.
  - `MainMuseumHub`: photograph-backed DOM artwork presentation shared with
    the placement editor, with calibrated homographies and accessible controls,
    room/wall paging, idle later-page decode, background fallback/calibration
    flow, persistent artwork-ID selection state, declared-image/embedded-fallback
    slot state, offline `file://` hub source preference/decode deadlines for
    local customer preview reliability, and read-only geometry/source
    diagnostics overlay
  - `GalleryRoomView`: optional inspection-gallery overlay that covers the
    viewport with one of four configured room photographs and projects one
    selected artwork into its normalized wall quad; it temporarily reparents the
    gallery's authoritative timeline and shared help/audio/settings/fullscreen controls,
    restoring them when closed. Room choice remains separate from artwork
    selection. Its photo camera and overlay controls do not change the calibrated
    artwork projection or the museum's separate photo-backed presentation.

## Current hub-layout acceptance boundary

The visible room is the customer photograph; artwork and editor overlays share
the resolved v5 calibrated projection and page-scoped placement authority.
The Three.js inspection gallery remains a separate presentation. A screenshot
from a generated or deployed artifact is not
assumed to match that state unless the matching `customer-artworks.js`,
`museum-hub.json`, route, and build are preserved. The customer confirmed the
local four-painting room after Update Gallery and supplied a screenshot;
post-merge live verification remains open in `plan.md`. The initial two-image
baseline and obsolete IDs are historical findings, not current content blockers.
Current exact source names/defaults are in `README.md`.

Full builds run the importer/sync through `prebuild`; injected customer JSON
remains authoritative over the compiled fallback. Local-preview output uses
relative `./` URLs, production `/Freyraum/`. The Pages workflow imports/builds
from committed sources and publishes `dist/app.html` as its index, not the
repository's local-preview launcher.

## Deterministic curator editor

`MainMuseumHub` owns the curator editor documented in
`docs/QUERY_PARAMETERS.md` and mutates only the in-memory
resolved model. `museumHub.ts` owns schema sanitization, wall ownership,
mounting-zone containment, and canonical v5 placement. Each rendered wall has an
explicit stage-space `mountingZone`; every projected artwork corner must remain
inside it for valid placement. Layout warnings do not block export; only errors
(broken geometry, missing wall, failed projection or round-trip failure) do.
Export is accepted only after
sanitize/re-import preserves wall ID plus all four canonical placement fields.
`placement-editor.html` is the served editor entry,
`customer-preview/placement-editor.html` is its generated file-safe build, and
`OPEN_ARTWORK_EDITOR.html` is the customer-facing one-click launcher. All three
reuse the same runtime and schema rather than maintaining a second placement
implementation.

Editor state is deliberately split into fixed and editable data. Wall quads,
safe/mounting zones and canonical placements are editable; calibration-scale
compensation preserves artwork size. Room lists/counts and artwork assignments
may differ on import; unknown artwork IDs are reported and dropped. Import
still requires compatible fixed camera, 3D room/wall model and other fields
covered by `hubFixedFieldsSignature`; it is not an arbitrary scene import.
The editable 2D quad is not permission to rewrite the fixed 3D wall corners.
Export starts
from the complete configured wall inventory so bounds-only walls and fixed
fields survive the round trip. `scripts/import-artworks.mjs` and
`scripts/write-local-preview.mjs` cache-bust customer data, runtime and styles in
both file entries.
- `src/navigation/`
  - `DestinationRouter`: hub↔gallery transition ownership and cancellation
- `src/ui/`, `src/timeline/`, `src/interaction/`
  - UI controls, timeline, interaction handling
- `src/utils/`
  - `artworkImageSources.ts`: shared declared-image/embedded-fallback source
    plan used by both gallery and hub
  - `sourceToPixelOutcome.ts`: redacted route-aware outcome diagnostics;
    optional `presentationPath` distinguishes `'dom'` from `'webgl'`. Hub DOM
    outcomes retain native decoded dimensions with null GPU/probe fields and
    explicitly report no WebGL upload; this is not GPU visible-pixel proof.
    Source redaction and interactive-gallery behavior are preserved.
  - `textureUploadCompatibility.ts`: shared capability-aware downscale applied
    before any decoded image reaches the GPU in either route
  - `sourceToPixelProbe.ts`: bounded, verbose-mode-only GPU visible-pixel
    readback probe
  - Diagnostics, preferences, performance and utility primitives
- `src/rendering/`
  - Backend detection/probe boundary (WebGL production, optional WebGPU probe)
  - `webgl.ts`: real-renderer retry ladder (`preferred` → `compatibility` →
    `battery`), typed failure, context diagnostics, and explicit release of
    unsuccessful contexts. It does not allocate a separate preflight context.
  - `FallbackScreen`: categorized recovery UI. Renderer failures retain a
    keyboard/screen-reader-friendly 2D artwork collection; unrelated startup
    failures are not described as WebGL absence.

## Editor modules, saving and desktop app (v1.35–v1.40)

- `src/hub/editor/`: editor UI split out of `MainMuseumHub` — tabs
  (`editorTabs`), texts/labels (`editorText`), toast, room bar (`roomBar`),
  artwork library and thumbnails (`artworkLibrary`, `thumbnails` →
  `thumbnailKey()`), placement drag/keyboard (`placementController`), and the
  save tab with its three targets (`saveTab`, `onlineEditor`: `online` |
  `desktop` | `download`). Pending uploads and drafts (IndexedDB) live in
  `pendingUploads`; the save-service HTTP client in `onlineClient`.
- `src/config/museumHub.ts` → `evaluateDisplayedPlacement` /
  `projectDisplayedPlacement`: the single placement-validity authority for
  editor, drags, loader warnings and export. `projectiveGeometry.ts` →
  `calibratedWallScaleAt` keeps artwork size independent of wall edits.
- `src/online/`: `publishRules.ts` (allowed paths, names, image signatures,
  sizes, locked fields — shared by editor, `worker/` and the desktop store),
  `desktopBridge.ts` (typed access to the desktop preload API), and
  `hiddenEditorEntry.ts` ("bearbeiten" / long-press into the editor).
- `worker/` (Cloudflare Worker, built by tests with esbuild, deployed with
  `wrangler`): login (HMAC session), publish to `content/edits` via a GitHub
  App, status/history/restore. Setup: `docs/ONLINE_EDITOR_SETUP.md`.
- `scripts/local-project/projectStore.ts`: all desktop writes — validation via
  `publishRules`, stale-version refusal, temporary files + rename (with
  Windows lock retry) and rollback, history of 10 versions, restore.
- `desktop/` (Electron, own `package.json`): `main.ts` (window, menu, IPC,
  project folder, runs the bundled importer with `ELECTRON_RUN_AS_NODE`),
  `appProtocol.ts` (`freyraum://app/` allowlist mapping to the bundled editor
  and project files), `preload.ts` (narrow bridge), `settings.ts`. Packaging
  and release: `desktop/package.json` `build` + `.github/workflows/desktop-release.yml`;
  details in `docs/DESKTOP_APP.md`.

## Startup sequence ownership

1. `main.ts` resolves startup mode, the museum-hub configuration
   (injected → legacy-migrated → checked-in museum JSON fallback), applies the
   resolved wall-surface color path (CSS vars + shell + renderer clear color),
   and initializes managers with that authoritative value.
2. `GalleryManager` applies startup readiness contract and preload/warm strategy.
3. `RendererManager` prewarms renderer pipeline.
4. `MainMuseumHub` prepares the hub (photograph/background fallback +
   first-page artwork primary/fallback decode) under the loading overlay via
   the calibrated DOM artwork controls. The normal museum and editor must not
   depend on successful rendering of an opaque architectural room.
   `DestinationRouter.startAt('hub')`.
5. UI entry flow continues after readiness gates are satisfied.

## Active artwork-recovery boundary

Gallery and hub retain the declared-image versus embedded-fallback source plan
and redacted diagnostics. The photograph-backed hub uses DOM artwork pixels;
GPU upload limits and visible-pixel probes apply only to active WebGL paths,
not as a requirement for successful DOM presentation.
Served environments keep the declared `image` source primary. The
bounded local-preview exception lives in `MainMuseumHub`: when the runtime is
the offline `file://` preview and the declared hub artwork resolves to a local
`file-url`, the hub may prefer the importer-provided embedded `webglImage`
immediately for bounded local-preview recovery inherited from v0.93. Keep
this recovery separate from interactive-gallery PBR/lighting fidelity work. See
`docs/archive/plan-history-2026-10-17.md` § v0.93 and `FINDINGS.md` for the incident evidence and support
workflow.

## Render-loop behavior

- rAF remains active so frame-budget sampling, readiness work, and animation
  convergence keep progressing.
- `FrameBudgetMonitor.sample()` runs before render gating.
- `postProcessing.render()` is skipped when lighting is static, gallery motion is
  settled, no readiness work is pending, and dirty-frame cooldowns are consumed.
- Dirty-frame hints are emitted by navigation, zoom/pan/hover input, preference
  changes, viewport changes, artwork/material readiness updates, and lifecycle
  resume.

For exact config keys and query behavior, use only `docs/QUERY_PARAMETERS.md`.

## Architecture drift audit checklist

When changing architecture-sensitive areas, verify all of the following:

1. Folder/module ownership still matches this map.
2. Startup sequence docs still match initialization order in `main.ts` + `GalleryManager`.
3. Rendering pipeline docs still match active runtime code paths.
4. Any ownership change is reflected here in the same PR.

## Related docs

- Overview: `README.md`
- History: `CHANGELOG.md`
- Config reference: `docs/QUERY_PARAMETERS.md`
- Contributor process: `CONTRIBUTING.md`
- Archived context: `docs/archive/README.md`
