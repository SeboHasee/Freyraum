# FREYRAUM Query Parameters & Stored Configuration

> Verified against runtime code on 2026-06-21.

This page documents runtime configuration knobs resolved from URL query parameters and `localStorage`.

## Query parameters

### `?startup=`
Startup readiness mode (`src/config/startup.ts`).

Accepted values:
- `full` (`strict`, `all` aliases): full pre-entry warm contract
- `entry-balanced` (`balanced` alias): default
- `entry-minimal` (`minimal` alias): smallest pre-entry target set

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
- WebGPU path is probe-only (`webgpu-experimental`) and still falls back safely.
- Query param is checked first; otherwise `localStorage['freyraum.backend'] === 'webgpu'` is used.

## localStorage keys

### `freyraum.preferences.v1`
Stored user preferences (`src/utils/preferences.ts`): quality, lighting, motion/contrast settings, audio volume, and chrome visibility mode.

Important invariant: writes always persist `audioMuted: false` so each new session starts unmuted.

### `freyraum.diagnostics.mode`
Diagnostics mode persistence (`default` | `info` | `verbose`).

### `freyraum:startup-readiness`
Startup readiness override persistence (`full` | `entry-balanced` | `entry-minimal`).

### `freyraum.backend`
Backend probe opt-in persistence (`webgpu` to request probe mode).

### `freyraum-nav-hint-seen`
Navigation onboarding hint dismissal flag set by `NavigationControls`.

## Debug API

When diagnostics are enabled, `window.__FREYRAUM_DIAGNOSTICS__` exposes:
- `getMode()`
- `setMode(mode)`
- `print(level?)`
- `snapshot()`
- `summarize()`
- `exportJson()`

See also: `README.md` diagnostics section and `ARCHITECTURE_MAP.md`.
