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
    polygons + wall-local slot placement), reference-quad room reconciliation,
    wall-realism gating, exact-ID slot resolver (auto-placement + paginated
    overflow), deterministic local placement fitting, and visual-token
    resolution
- `src/hub/`
  - `projectiveGeometry.ts`: camera/room projection math, room-plane/reference
    reconciliation, doorway-safe deterministic placement solving, polygon
    checks, and projected hub interaction geometry
  - `HubRoomRenderer`: on-demand 9 × 12 × 5.2 m WebGL hall, pitched glazed
    skylight over a raised clerestory, procedural atmospheric sky and matching
    cached low-energy PMREM, longitudinal perimeter channels, page groups,
    high-only planar floor reflection, three quality-gated downward area sources,
    one architectural shadow map, and preset-driven rendering fidelity
  - `MainMuseumHub`: DOM/accessibility shell over the backdrop + 3D room scene,
    room/wall paging, idle later-page decode, background fallback/calibration
    flow, persistent artwork-ID selection state, declared-image/embedded-fallback
    slot state, offline `file://` hub source preference/decode deadlines for
    local customer preview reliability, and read-only geometry/source
    diagnostics overlay
- `src/navigation/`
  - `DestinationRouter`: hub↔gallery transition ownership and cancellation
- `src/ui/`, `src/timeline/`, `src/interaction/`
  - UI controls, timeline, interaction handling
- `src/utils/`
  - `artworkImageSources.ts`: shared declared-image/embedded-fallback source
    plan used by both gallery and hub
  - `sourceToPixelOutcome.ts`: shared, redacted source→decode→GPU→visible-pixels
    outcome contract recorded once per artwork per route (gallery and hub)
  - `textureUploadCompatibility.ts`: shared capability-aware downscale applied
    before any decoded image reaches the GPU in either route
  - `sourceToPixelProbe.ts`: bounded, verbose-mode-only GPU visible-pixel
    readback probe
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

The v0.93 artwork-recovery contract is current runtime behavior. Gallery and
hub share the same declared-image versus embedded-fallback source plan, shared
source-to-pixel diagnostics, visible-pixel proof, and capability-aware texture
upload path. Served environments keep the declared `image` source primary. The
bounded local-preview exception lives in `MainMuseumHub`: when the runtime is
the offline `file://` preview and the declared hub artwork resolves to a local
`file-url`, the hub may prefer the importer-provided embedded `webglImage`
immediately because that is the WebGL-stable path proven by the v0.93 fix. Keep
this recovery separate from interactive-gallery PBR/lighting fidelity work. See
`plan.md § v0.93` and `FINDINGS.md` for the incident evidence and support
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
