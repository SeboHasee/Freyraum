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
  - `RendererManager`, `SceneManager`, `GalleryPresentationStage`, post-processing pipeline
- `src/gallery/`
  - Gallery state, artwork switching, preload/warm orchestration, texture usage,
    and mounted-work composition
- `src/materials/`
  - Painting and frame material behavior, procedural texture generation, and
    shared architectural hub-shell materials/detail maps
- `src/config/`
  - Startup and quality/runtime config models
  - `galleryPresentation.ts`: compact interactive-gallery stage envelope and
    mounted-work spacing constants
  - `presentation.ts`: validated interactive-gallery presentation profiles
  - `museumHub.ts`: unified museum-hub schema, v1/legacy migration, calibrated
    wall-plane contract (stage + multi-plane wall quads + stage-space safe
    polygons + wall-local slot placement), reference-quad room reconciliation,
    wall-realism gating, exact-ID slot resolver (auto-placement + paginated
    overflow), deterministic local placement fitting, and visual-token
    resolution
- `src/hub/`
  - `projectiveGeometry.ts`: camera/room projection math, room-plane/reference
    reconciliation, doorway-safe deterministic placement solving, polygon
    checks, and projected hub interaction geometry
  - `HubRoomRenderer`: on-demand WebGL hub room shell, page groups, floor
    reflection, shadow/environment setup, and quality-preset-driven hub surface
    fidelity
  - `MainMuseumHub`: DOM/accessibility shell over the backdrop + 3D room scene,
    room/wall paging, idle later-page decode, background fallback/calibration
    flow, persistent artwork-ID selection state, declared-image/embedded-fallback
    slot state, and read-only geometry/source diagnostics overlay
- `src/navigation/`
  - `DestinationRouter`: hub↔gallery transition ownership and cancellation
- `src/ui/`, `src/timeline/`, `src/interaction/`
  - UI controls, timeline, interaction handling
- `src/utils/`
  - `artworkImageSources.ts`: shared declared-image/embedded-fallback source
    plan used by both gallery and hub
  - Diagnostics, preferences, performance and utility primitives
- `src/rendering/`
  - Backend detection/probe boundary (WebGL production, optional WebGPU probe)

## Startup sequence ownership

1. `main.ts` resolves startup mode, the museum-hub configuration
   (`resolveMuseumHub`: injected → legacy-migrated → built-in), applies the
   resolved wall-surface color path (CSS vars + shell + renderer clear color),
   and initializes managers with that authoritative value.
2. `GalleryManager` applies startup readiness contract and preload/warm strategy.
3. `RendererManager` prewarms renderer pipeline.
4. `MainMuseumHub` prepares the hub (background fallback + room scene +
   first-page artwork primary/fallback decode) under the loading overlay via
   `DestinationRouter.startAt('hub')`.
5. UI entry flow continues after readiness gates are satisfied.

## Active artwork-recovery boundary

The v0.91 source-addressing layer is current runtime behavior. The active v0.92
plan extends it with a shared source-to-pixel outcome and capability-aware
derived texture path; it is not implemented yet. Keep hub `MeshBasicMaterial`
image recovery separate from interactive-gallery PBR fidelity work. See
`plan.md § v0.92` for the staged implementation and `FINDINGS.md` for evidence.

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
