# FREYRAUM Query Parameters & Stored Configuration

This is the **authoritative configuration reference** for runtime query parameters and `localStorage` keys.
No other document should duplicate configuration tables from this file.

Verified against runtime code on 2026-08-07.

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
  wall-corner points and safe-zone points.
- Drag an artwork to move it on its wall plane; drag its corner handle to
  change mounted height. Drag wall/safe handles to recalibrate the wall plane.
- The panel includes an active-wall selector, live overlap/convexity/safe-zone/
  minimum-size warnings, and a restore-last-valid action.
- On release, the complete v3 `museum-hub.json` schema (single calibrated
  camera, metric-like wall planes, doorway exclusions, hanging bands, slot
  anchors, fallback background, visual tokens, and slots) appears in the
  on-screen copy panel and is logged via diagnostics. Exported room planes are
  the runtime-reconciled wall-local values that match the configured reference
  quads used by the photographed room.
- Paste the JSON into `customer-artworks/museum-hub.json` and re-run the
  gallery update (`npm run import:artworks`) to apply it.
- Legacy `customer-artworks/hub-hotspots.json` and v1/v2 box placements still
  migrate automatically with warnings; new exports always use the v3 calibrated-room
  format.
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
  is the primary record to check first; local `file://` sessions now treat a
  blank post-upload probe as a real failure and may retry `webglImage`; see
  `plan.md § v0.93`.
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
