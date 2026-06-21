# FREYRAUM Architecture Map

This file documents the current architecture and ownership boundaries only.
Historical implementation narratives belong in `CHANGELOG.md` or `docs/archive/`.

## Runtime architecture

- `src/main.ts`
  - Boot orchestration
  - Lifecycle handling
  - UI wiring
  - Render-loop coordination and idle render suppression
- `src/core/`
  - `RendererManager`, `SceneManager`, post-processing pipeline
- `src/gallery/`
  - Gallery state, artwork switching, preload/warm orchestration, texture usage
- `src/materials/`
  - Painting and frame material behavior, procedural texture generation
- `src/config/`
  - Startup and quality/runtime config models
- `src/ui/`, `src/timeline/`, `src/interaction/`
  - UI controls, timeline, interaction handling
- `src/utils/`
  - Diagnostics, preferences, performance and utility primitives
- `src/rendering/`
  - Backend detection/probe boundary (WebGL production, optional WebGPU probe)

## Startup sequence ownership

1. `main.ts` resolves startup mode and initializes managers.
2. `GalleryManager` applies startup readiness contract and preload/warm strategy.
3. `RendererManager` prewarms renderer pipeline.
4. UI entry flow continues after readiness gates are satisfied.

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
