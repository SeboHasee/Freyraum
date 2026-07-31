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

Museum-hub frame calibration mode (`src/hub/MainMuseumHub.ts`).

Notes:
- Outlines every framed artwork slot with a dashed border and slot label.
- Drag a frame to move it; drag the corner handle to resize it. Calibration
  manipulates the actual frame bounds, so what you see is what ships.
- On release, the complete `museum-hub.json` schema (version, background,
  visual tokens, frame presets, fallbacks, slots) appears in the on-screen
  copy panel and is logged via diagnostics.
- Paste the JSON into `customer-artworks/museum-hub.json` and re-run the
  gallery update (`npm run import:artworks`) to apply it.
- The legacy `customer-artworks/hub-hotspots.json` array is still migrated
  automatically with a deprecation warning; new exports always use the
  unified `museum-hub.json` format.
- Slot/page navigation is disabled while calibrating.

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
