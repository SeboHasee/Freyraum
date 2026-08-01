# FREYRAUM Query Parameters & Stored Configuration

This is the **authoritative configuration reference** for runtime query parameters and `localStorage` keys.
No other document should duplicate configuration tables from this file.

Verified against runtime code on 2026-06-21.

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
  anchors, fallback background, visual tokens, and slots) appears in the on-screen
  copy panel and is logged via diagnostics.
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
  - per-slot projected quads and corner markers
  - wall-local axis guides
  - camera horizon and wall-family vanishing-direction guides
  - containment, doorway, hanging-band, and orientation validity flags
- Emits per-slot diagnostics snapshots (wall id, local/projected quads,
  calibrated camera chain, and validity result) and a full hub geometry
  snapshot once composition is ready.

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
