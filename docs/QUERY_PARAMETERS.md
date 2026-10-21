# FREYRAUM Query Parameters & Stored Configuration
> Latest markdown audit: 2026-10-21 (v1.42 mobile follow-ups).

This is the **authoritative configuration reference** for runtime query parameters and `localStorage` keys.
No other document should duplicate configuration tables from this file.

Schema v5. Editor contracts reviewed on 2026-10-19; presentation acceptance
is tracked in `plan.md`.

## Query parameters

### `?startup=`

Startup readiness mode (`src/config/startup.ts`).

Accepted values:
- `full` (`strict`, `all` aliases)
- `entry-balanced` (`balanced` alias, default)
- `entry-minimal` (`minimal` alias)

Resolution order: query param → `localStorage['freyraum:startup-readiness']` → default `entry-balanced`.

### `?debug=`

Diagnostics verbosity (`src/utils/Diagnostics.ts`).

Accepted values:
- `default` (`0`, `false` aliases)
- `info` (`1`, `true` aliases)
- `verbose` (`2` alias)

Resolution order: query param → `localStorage['freyraum.diagnostics.mode']` → `default`.

### `?backend=webgpu`

Opt-in WebGPU probe flag (`src/rendering/RenderBackend.ts`).

Notes:
- The inspection gallery remains WebGL; museum/editor artwork is calibrated DOM
  over the room photograph, independent of this backend probe.
- WebGPU path is probe-only (`webgpu-experimental`) and falls back safely.
- Resolution order: query param first; otherwise `localStorage['freyraum.backend'] === 'webgpu'`.

### `?hubCalibrate=1`

Museum-hub wall-plane calibration mode (`src/hub/MainMuseumHub.ts`).

Customers do not need to construct this URL. Double-click
`OPEN_ARTWORK_EDITOR.html`, which opens the dedicated
`customer-preview/placement-editor.html` program with the editor mode enabled.
Developers can run `npm run editor`.

Notes:
- Exposes the photograph-backed projected artwork surfaces plus an SVG
  calibration overlay for editable wall outlines, safe zones and green mounting
  zones.
- Drag an artwork to move it on its wall plane; drag its corner handle to
  change mounted height. Blue and green handles adjust safe and mounting zones.
  “Wandecken bearbeiten” enables the selected wall's corner handles.
  `calibratedWallScaleAt` compensates wall edits so artwork size and aspect do
  not stretch; the calibration `referenceQuad` stays separate from the edited quad.
- Select a work, edit its four canonical values numerically, or nudge it with
  arrow keys (`Shift` for larger steps). “Zwischen Grenzen zentrieren” uses the
  actual green mounting polygon rather than a fixed percentage.
- Green handles define the visible doorway, corner, floor, and ceiling margins.
  The complete projected artwork body is clamped inside that polygon.
- A changed/imported mounting zone is unconfirmed. Align it with the visible
  architecture; “Grüne Fläche geprüft ✓” records an optional check.
  An unconfirmed zone is a hint, not a save/export blocker.
- Undo, redo, reset, and restore-last-valid are available. Invalid work is
  highlighted red and remains assigned to its original wall.
- The panel includes an active-wall selector, live overlap/convexity/safe-zone/
  minimum-size warnings, and a restore-last-valid action.
- Copy/download is blocked only by real errors or a failed sanitized
  export/re-import comparison. Outside-zone, doorway, overlap, small-size,
  unconfirmed-zone, empty-room and unplaced-artwork messages are hints.
- Re-import accepts changed room counts/lists and artwork assignments; unknown
  artwork IDs are reported and dropped. Unreadable files and incompatible fixed
  fields (camera, 3D room/wall model and the remaining
  `hubFixedFieldsSignature` fields) are rejected. Editable projected wall quads
  are distinct from changes to fixed 3D wall corners.
- Accepted imports apply supported editable room/assignment, zone and placement
  state. Export preserves the complete configured wall
  inventory—including bounds-only walls—plus all fixed configuration fields.
- On release, the complete v5 `museum-hub.json` schema (single calibrated
  camera, metric-like wall planes, doorway exclusions, hanging bands, slot
  anchors, fallback background, visual tokens, and slots) appears in the
  on-screen copy panel and is logged via diagnostics. Exported room planes are
  the runtime-reconciled wall-local values that match the configured reference
  quads used by the photographed room.
- Paste the JSON into `customer-artworks/museum-hub.json` and re-run the
  gallery update (`npm run import:artworks`) to apply it.
- Legacy `customer-artworks/hub-hotspots.json` and v1–v4 placements still
  migrate automatically with warnings; new exports always use the v5
  calibrated-room format. Canonical artwork mounting uses
  `horizontalPosition`, `centerHeight`, `physicalHeight`, and `mountingGap`.
- A resolved page contains at most four works in the 2-front + 1-left + 1-right
  composition. Explicit `rooms` are user-controlled; unplaced works stay hidden
  unless `fallbacks.autoPlaceUnmapped` enables automatic extra rooms. Legacy
  files without a room list retain automatic overflow.
- Optional `galleryRoomViews` entries provide full-screen photo scenes in the
  inspection gallery. Each entry stores an ID/name, a `Backgrounds/` image path
  with its source dimensions, a normalized four-corner `wallQuad`, `wallAspect`,
  and normalized artwork placement (`u`, `v`, `height`). The gallery shows the
  currently selected artwork and lets visitors switch works and room photos.
  Room-view settings are preserved by editor export/save; unlike museum wall
  geometry, they are currently configured in `museum-hub.json`.
- Automatic side-wall fallback placement must retain at least 0.35 m in the
  calibrated wall model and 4.00 m from its front corner. Shipping regression
  checks additionally require 12 px against the photographed doorway reveal and
  front-wall seam in the calibrated primary camera.
- Artwork activation into the inspection gallery is disabled while calibrating;
  the room bar still switches editable rooms.

### `?hubDebug=1`

Read-only museum-hub geometry diagnostics overlay (`src/hub/MainMuseumHub.ts`).

Notes:
- Keeps normal interaction/navigation enabled (unlike calibration mode).
- Reuses the SVG overlay layer to show:
  - wall quads
  - wall safe polygons
  - projected doorway-void polygons
  - per-slot projected quads and corner markers
  - wall-local axis guides plus local/stage anchor labels
  - camera horizon and wall-family vanishing-direction guides
  - containment, doorway, hanging-band, and orientation validity flags
  - per-wall reference residual / convergence summaries
- Emits per-slot diagnostics snapshots (wall id, local/projected quads,
  calibrated camera chain, selected artwork state, validity result, source
  mode, bundle ID, declared/resolved URL type, image state, and fallback
  reason) and a full hub geometry snapshot once composition is ready.
- Runtime navigation also logs selection lifecycle and wall-surface snapshots, so
  `?hubDebug=1` sessions can correlate geometry, current artwork ownership, and
  transition background state.

### `?artworkDebug=1` or `?artworkDebug=<slot-or-artwork-id>`

Development-only live artwork inspection (`src/hub/MainMuseumHub.ts`).

Notes:
- Run it against the generated file preview, for example
  `customer-preview/placement-editor.html?artworkDebug=1`.
- The first selectable artwork is inspected for `1`; an exact slot or artwork
  ID can be supplied to select another work.
- The report is logged as `[Freyraum artwork-debug]` and exposed as
  `window.__freyraumArtworkDebug`.
- The console payload is one JSON object containing source, canonical, live
  Three.js local/world, DOM, texture UV bounds, visible-owner evidence, and
  exactly one `ASPECT PIPELINE:` verdict.
- It reads the live DOM node with `getBoundingClientRect()` and
  `getComputedStyle()`, and reads the live Three.js mesh, geometry, world
  matrix, texture, and UV attributes. It does not alter artwork sizing.
- The report also identifies the active presentation (`artwork` or
  `placeholder`) and bound texture kind. A placeholder uses its own square
  presentation ratio; a decoded artwork uses its native decoded ratio.

### Grey-artwork incident capture

There is no separate query parameter. Use `?debug=verbose&hubDebug=1` when the
museum hub shows missing, blank, or fallback artwork surfaces. Opening the root
`/home/runner/work/Freyraum/Freyraum/index.html` now preserves that query/hash
when it forwards into `customer-preview/app.html`. Relevant current records are:

- `hub:source-to-pixel-outcome` / `texture:source-to-pixel-outcome` — one
  terminal record per artwork per route naming the resolved candidate,
  first failed stage (if any), runtime protocol, source/upload dimensions, and
  the bounded GPU visible-pixel proof result when required by active WebGL
  presentation. For the photograph-backed DOM hub,
  inspect decoded image dimensions, calibrated transform and visible DOM owner;
  do not interpret image decode as proof of GPU upload. The shared outcome's
  optional `presentationPath` is `'dom'` or `'webgl'`. The hub records `'dom'`,
  native decoded source dimensions and null GPU/probe fields, explicitly
  reporting decode for calibrated DOM presentation with no WebGL upload.
  Source redaction and inspection-gallery diagnostics remain unchanged.
  Under the existing verbose/local-file probe policy, DOM recovery can also
  reject a proven all-zero-alpha source (`visible-pixel-probe`,
  `zero-alpha-source`). This conservative source-alpha check is not GPU proof;
  unavailable, tainted or over-budget readback is inconclusive rather than failure.
  A healthy local `file://` museum-hub
  recovery can now legitimately end with
  `candidateMode: "embedded-webgl-fallback"` and
  `resolvedUrlType: "data-uri"` even when the declared image file exists,
  because the shipped v0.93 fix prefers the embedded `webglImage` when a local
  `file-url` is not WebGL-stable; see `docs/archive/plan-history-2026-10-17.md` § v0.93.
- `hub:artwork-source-resolved`
- `hub:artwork-image-retry`
- `hub:artwork-image-missing`
- `hub-room:hub-slot-texture-downscaled` / `hub-room:hub-slot-texture-oversized`
  (retained WebGL renderer paths)
- `hub-room:hub-slot-visible-probe-failed` (retained WebGL renderer paths)
- `boot:artworks-source`
- `texture:load-fallback`
- `texture:texture-downscaled` / `texture:texture-oversized`
- `gallery:show-artwork-fallback`

Capture the browser Network log and console errors with the export. Do not
include raw `data:image/...` payloads in issue reports; runtime diagnostics
redact them. The route-aware source-to-pixel recovery procedure is in
`docs/archive/plan-history-2026-10-17.md` § v0.93.

## localStorage keys

### `freyraum.preferences.v1`

Stored user preferences (`src/utils/preferences.ts`): quality, motion/contrast settings, audio volume, chrome visibility mode, and `deviceTilt` (`auto` | `on` | `off`, default `auto`; v1.41 motion-sensor artwork tilt in the gallery — `auto` enables it on touch devices that need no permission; v1.42: reduced motion disables it in every mode and a stored `on` resumes afterwards). Lighting is fixed internally to the dramatic configuration and is not user-configurable.

Invariant: persisted writes force `audioMuted: false`, so each new session starts unmuted.

### `freyraum.diagnostics.mode`

Diagnostics mode persistence (`default` | `info` | `verbose`).

### `freyraum:startup-readiness`

Startup readiness override persistence (`full` | `entry-balanced` | `entry-minimal`).

### `freyraum.backend`

Backend probe persistence (`webgpu` to request probe mode).

### `freyraum-nav-hint-seen`

Navigation onboarding hint dismissal flag (`NavigationControls`).

### `freyraum.placementEditor.guideSeen`

`'1'` after the placement editor's first-use guide was shown (`MainMuseumHub`).

## sessionStorage and IndexedDB (editor)

- `sessionStorage['freyraum.editorSession']`: online-editor session token from
  the save service (8 h, cleared with the tab; `src/hub/editor/onlineClient.ts`).
- IndexedDB `freyraum-editor` → store `drafts`, key `current`: the unsaved
  editor draft (layout + pending uploads) offered as "Entwurf
  wiederherstellen" (`src/hub/editor/pendingUploads.ts`).

## Debug API

When diagnostics are enabled, `window.__FREYRAUM_DIAGNOSTICS__` exposes:

- `getMode()`
- `setMode(mode)`
- `getEntries()`
- `clear()`
- `print(level?)`
- `snapshot()`
- `summarize()`
- `exportJson()`

## Related docs

- Overview: `README.md`
- Architecture: `ARCHITECTURE_MAP.md`
- Contributor freshness policy: `CONTRIBUTING.md`
