# FREYRAUM Query Parameters & Stored Configuration
> Latest markdown audit: 2026-09-04 (v1.12 full conversation documentation sync).

This is the **authoritative configuration reference** for runtime query parameters and `localStorage` keys.
No other document should duplicate configuration tables from this file.

Verified against runtime code and schema v5 on 2026-09-04.

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
- Production rendering remains WebGL.
- WebGPU path is probe-only (`webgpu-experimental`) and falls back safely.
- Resolution order: query param first; otherwise `localStorage['freyraum.backend'] === 'webgpu'`.

### `?hubCalibrate=1`

Museum-hub wall-plane calibration mode (`src/hub/MainMuseumHub.ts`).

Notes:
- Exposes the projected artwork surfaces plus an SVG calibration overlay for
  wall corners, safe zones, and green authoritative mounting zones.
- Drag an artwork to move it on its wall plane; drag its corner handle to
  change mounted height. Drag wall/safe handles to recalibrate the wall plane.
- Select a work, edit its four canonical values numerically, or nudge it with
  arrow keys (`Shift` for larger steps). “Zwischen Grenzen zentrieren” uses the
  actual green mounting polygon rather than a fixed percentage.
- Green handles define the visible doorway, corner, floor, and ceiling margins.
  The complete projected artwork body is clamped inside that polygon.
- A changed/imported mounting zone is unconfirmed. Align it with the visible
  architecture and press “Aktive Grenzen bestätigen” for every rendered wall;
  export remains disabled until all zones are explicitly confirmed.
- Undo, redo, reset, and restore-last-valid are available. Invalid work is
  highlighted red and remains assigned to its original wall.
- The panel includes an active-wall selector, live overlap/convexity/safe-zone/
  minimum-size warnings, and a restore-last-valid action.
- Copy/download remains disabled until every geometry check and a sanitized
  export/re-import comparison passes. Re-import accepts a local JSON file and
  rejects wall-ownership changes.
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
  composition. Additional works overflow into contiguous virtual rooms.
- Automatic side-wall fallback placement must retain at least 0.35 m in the
  calibrated wall model and 4.00 m from its front corner. Shipping regression
  checks additionally require 12 px against the photographed doorway reveal and
  front-wall seam in the calibrated primary camera.
- Slot/page navigation is disabled while calibrating.

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

### Grey-artwork incident capture

There is no separate query parameter. Use `?debug=verbose&hubDebug=1` when the
museum hub shows missing, blank, or fallback artwork surfaces. Opening the root
`/home/runner/work/Freyraum/Freyraum/index.html` now preserves that query/hash
when it forwards into `customer-preview/app.html`. Relevant current records are:

- `hub:source-to-pixel-outcome` / `texture:source-to-pixel-outcome` — one
  terminal record per artwork per route naming the resolved candidate,
  first failed stage (if any), runtime protocol, source/upload dimensions, and
  the bounded GPU visible-pixel proof result when that proof is required. This
  is the primary record to check first. A healthy local `file://` museum-hub
  recovery can now legitimately end with
  `candidateMode: "embedded-webgl-fallback"` and
  `resolvedUrlType: "data-uri"` even when the declared image file exists,
  because the shipped v0.93 fix prefers the embedded `webglImage` when a local
  `file-url` is not WebGL-stable; see `plan.md § v0.93`.
- `hub:artwork-source-resolved`
- `hub:artwork-image-retry`
- `hub:artwork-image-missing`
- `hub-room:hub-slot-texture-downscaled` / `hub-room:hub-slot-texture-oversized`
- `hub-room:hub-slot-visible-probe-failed`
- `boot:artworks-source`
- `texture:load-fallback`
- `texture:texture-downscaled` / `texture:texture-oversized`
- `gallery:show-artwork-fallback`

Capture the browser Network log and console errors with the export. Do not
include raw `data:image/...` payloads in issue reports; runtime diagnostics
redact them. The route-aware source-to-pixel recovery procedure is in
`plan.md § v0.93`.

## localStorage keys

### `freyraum.preferences.v1`

Stored user preferences (`src/utils/preferences.ts`): quality, motion/contrast settings, audio volume, and chrome visibility mode. Lighting is fixed internally to the dramatic configuration and is not user-configurable.

Invariant: persisted writes force `audioMuted: false`, so each new session starts unmuted.

### `freyraum.diagnostics.mode`

Diagnostics mode persistence (`default` | `info` | `verbose`).

### `freyraum:startup-readiness`

Startup readiness override persistence (`full` | `entry-balanced` | `entry-minimal`).

### `freyraum.backend`

Backend probe persistence (`webgpu` to request probe mode).

### `freyraum-nav-hint-seen`

Navigation onboarding hint dismissal flag (`NavigationControls`).

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
