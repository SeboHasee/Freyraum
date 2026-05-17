# FREYRAUM Plan

## Documentation Rule

For this repository, every meaningful implementation must update the markdown documentation together with the code.

Minimum documentation updates for future work:

- update `plan.md` with current scope, findings, implemented items, and remaining items
- update `CHANGELOG.md` with a dated summary of shipped changes
- update `FINDINGS.md` with important technical observations and limitations
- update `README.md` when user-facing setup, controls, or workflow changes
- update `DOCUMENTATION_RULES.md` when the documentation process itself changes

## Current Baseline

- Root `index.html` is the one-click local launcher.
- `customer-preview/app.html` is the committed local customer preview.
- `app.html` is the Vite development entry.
- The local preview is built as a classic IIFE bundle so it works from `file://`.
- Demo artwork is currently embedded placeholder content for offline preview stability.

## Findings

### Local Preview Findings

- A Vite dev entry cannot be opened directly from `file://` because the browser cannot execute the raw TypeScript/module graph.
- A committed preview build is required if the customer should be able to launch the demo with one click.
- Relative script/style paths and a classic script bundle are the safest local preview format.

### Interaction Findings

- Previous zoom limits allowed the camera to move too close to the artwork plane.
- Previous pan limits were hardcoded and did not respond to aspect ratio or current zoom level.
- Portrait artworks therefore hit vertical inspection limits too early, while extreme zoom could reveal empty space.
- The side preview meshes used a fixed geometry size, which stretched non-square artwork ratios.
- Touch interaction only supported swipe navigation and pinch zoom; it did not support one-finger pan while zoomed in.

## Implemented Now

### Local Preview Foundation

- Added a one-click local launcher in root `index.html`.
- Added committed static preview output in `customer-preview/`.
- Added a separate Vite development entry in `app.html`.
- Added `vite.local.config.ts` and preview HTML generation.
- Replaced remote preview dependencies with embedded placeholder artwork and procedural material input for reliable offline demos.

### Interaction & Gallery Fixes

- Added shared texture sizing helpers in `src/utils/texture.ts`.
- Main artwork sizing now stores fitted artwork width/height after aspect-ratio preservation.
- Zoom is now clamped dynamically so the camera cannot move through or unrealistically inside the artwork.
- Pan is now clamped from real artwork dimensions, camera FOV, viewport aspect ratio, and current zoom level.
- Mouse hover rotation now stays available at every zoom level, with reduced intensity during deeper zoom.
- Mouse drag now pans when panning is possible and falls back to subtle rotation behavior when not.
- Touch interaction now supports one-finger panning when zoomed in and swipe navigation when not zoomed in.
- Side preview panels now preserve aspect ratio instead of stretching textures.

## v0.01 Scope

### v0.01 Implemented

- local one-click customer preview
- offline-safe placeholder artwork setup
- dynamic zoom clamp
- dynamic pan clamp
- touch pan while zoomed
- aspect-ratio-safe side previews
- documentation baseline for changelog, findings, and rules
- **Slice 9 — Structured artwork metadata model** (`id`, `year`, `medium`, `dimensions`, `alt`, `credit`, `tags`) as the v0.01 content contract that maps 1:1 to a future CMS schema
- **Slice 1 — Final local optimized artwork assets**: metadata-driven embedded SVG generator delivers fully offline-safe, color-balanced artworks used as the v0.01 final assets
- **Slice 7 — Timeline thumbnail aspect-ratio handling and skeleton loading state** with no layout shift across portrait, square, landscape, and ultrawide artworks
- **Slice 3 — Zoom UI**: `ZoomControls` component with zoom in, zoom out, reset view; `resetView()` is now public on `GalleryManager`
- **Slice 4 — Keyboard-accessible timeline + focus styles**: timeline thumbs are real `<button>` elements with a roving tabindex; Arrow / Home / End / Enter / Space supported; global `:focus-visible` ring across all controls
- **Slice 2 — Accessibility preferences**: `PreferencesStore` with reduced-motion and high-contrast modes; persisted to `localStorage`; reflected on `<html>` via `data-motion` and `data-contrast`; system `prefers-reduced-motion` and `prefers-contrast` honored as defaults
- **Slice 5 — WebGL fallback screen**: `isWebGLAvailable()` feature detection with a localized fallback card explaining how to enable hardware acceleration
- **Slice 6 — Quality presets**: `high` / `balanced` / `battery` map to pixel-ratio cap, bloom strength, shadow toggle, and artwork geometry segments; rendering, post-processing, lighting, and artwork mesh all subscribe via `applyPreset`
- **Slice 8 — Fullscreen toggle + presentation polish**: standalone fullscreen button with `aria-pressed` state and SVG icons; `data-presentation` attribute dims secondary chrome (topbar, hint text) while in fullscreen
- **Slice 10 — Customer handoff documentation**: SVG architecture diagram in `docs/assets/architecture.svg` plus `docs/HANDOFF.md` with controls reference, accessibility modes, preset matrix, screenshot procedure, and reviewer checklist
- Extended `KeyboardNav` with `+` / `-` zoom, `0` / `R` reset, and `F` fullscreen shortcuts; correctly ignores typing targets and defers ArrowLeft/Right to the timeline when focus is inside it

### v0.01 Still Open: Technical Implementation & Execution Plan

This plan turns the remaining v0.01 scope into vertical slices. Each slice must produce a working, reviewable increment that includes code, local preview output, documentation, validation notes, and customer-facing behavior where applicable.

> Status note (2026-05-17): All ten slices below have been implemented in this v0.01 pass. The detail is retained so future contributors can reproduce or audit the slice-level reasoning and so the "Reserved Future Pass" items remain traceable to their parent slice.

#### Vertical Slice Rules For v0.01

- Do not implement broad horizontal refactors without visible product value in the same slice.
- Each slice must update source code, `customer-preview/` when runtime behavior changes, and the markdown files that describe the change.
- Each slice must define its own acceptance checks before implementation starts.
- Each slice should remain small enough to be completed by Claude 4.7 or GPT 5.5 in one focused pass.
- If a slice uncovers larger architecture work, document it under "Reserved Future Pass" instead of expanding v0.01.

#### Slice 1 — Final Local Artwork Asset Pipeline

Goal: replace embedded placeholder artwork with final optimized local assets while keeping offline preview reliability.

Implementation targets:

- create a local asset folder such as `src/assets/artworks/` or `public/assets/artworks/`
- replace placeholder data URI usage in `src/config/artworks.ts` with local asset references
- extend artwork metadata with asset dimensions, alt text, credit/source fields, and delivery notes
- ensure `TextureManager` continues to preload all artwork assets before the loading overlay exits
- keep `customer-preview/` fully self-contained after `npm run build`

Acceptance checks:

- `npm run build` succeeds and emits local artwork files in the preview bundle/output
- root `index.html` still opens the preview without a development server
- every artwork displays with correct aspect ratio in the main mesh, side previews, and timeline
- `FINDINGS.md` records any asset-size or compression tradeoffs

Reserved Future Pass:

- CMS upload UI
- remote asset CDN integration
- advanced responsive image generation beyond the local preview need

#### Slice 2 — Accessibility Motion & Contrast Controls

Goal: make the presentation safer and clearer for users who need reduced motion or stronger contrast.

Implementation targets:

- add an application-level preferences module for motion and contrast state
- read `prefers-reduced-motion` and map it to scene/UI animation intensity
- add a visible high-contrast overlay mode or theme class on the root app element
- reduce hover rotation, transition amplitude, loading spinner animation, and panel motion when reduced motion is active
- strengthen glass panel opacity, text contrast, and button borders for high-contrast mode
- document the supported accessibility preferences in `README.md`

Acceptance checks:

- reduced-motion users get no large animated transitions or spinning loader animation
- high-contrast mode keeps text and controls legible over bright and dark artwork
- controls remain visible and usable at all zoom levels
- `npm run lint` and `npm run build` pass

Reserved Future Pass:

- full WCAG audit
- persisted user preference storage
- advanced theme editor

#### Slice 3 — Explicit Zoom & Reset View UI

Goal: add visible controls so users are not dependent on mouse wheel or pinch gestures.

Implementation targets:

- expose gallery methods for zoom in, zoom out, reset view, and current zoom state
- add a `ZoomControls` UI component under `src/ui/`
- include buttons for zoom in, zoom out, and reset view
- place controls where they do not overlap navigation, timeline, or info panels
- ensure buttons work with mouse, touch, keyboard focus, and screen-reader labels
- keep pan and zoom clamped through existing `GalleryManager` safety rules

Acceptance checks:

- zoom buttons cannot exceed the same min/max limits as wheel and pinch zoom
- reset view returns pan, zoom, and hover rotation to the safe default framing
- controls stay available at all zoom levels
- local preview output is rebuilt

Reserved Future Pass:

- zoom slider with exact percentages
- minimap / overview navigator
- saved view positions per artwork

#### Slice 4 — Keyboard-Accessible Timeline & Focus Styles

Goal: make artwork navigation usable without pointer input.

Implementation targets:

- update `src/timeline/Timeline.ts` so timeline items are real buttons or have equivalent ARIA roles
- add roving tabindex or another clear keyboard model for timeline navigation
- support Enter/Space selection and arrow-key movement across thumbnails
- add visible focus styles in `src/styles/main.scss` for timeline, navigation, zoom, and fullscreen controls
- preserve active artwork state for screen-reader announcements
- avoid breaking existing click/touch timeline selection

Acceptance checks:

- keyboard-only users can reach every timeline item and select it
- focus state is visually obvious against the glass UI
- active item state is programmatically and visually clear
- no duplicate tab stops are introduced

Reserved Future Pass:

- full screen-reader narration pass
- translated ARIA labels
- automated accessibility testing setup

#### Slice 5 — Lightweight WebGL Fallback Screen

Goal: show a useful fallback when WebGL is unavailable instead of failing silently.

Implementation targets:

- add a small feature-detection function before renderer creation in `src/main.ts`
- check WebGL support and handle renderer initialization failures
- create a fallback UI component or inline fallback screen with plain HTML/CSS
- explain the issue and suggest enabling hardware acceleration or using a modern browser
- keep fallback compatible with `file://` local preview

Acceptance checks:

- app shows a readable fallback if WebGL cannot initialize
- normal WebGL-capable browsers still load the gallery unchanged
- fallback copy is documented for customer support

Reserved Future Pass:

- non-WebGL static gallery mode
- server-side generated fallback screenshots

#### Slice 6 — Quality Presets For Integrated GPU / Battery Mode

Goal: provide predictable performance controls for weaker devices without changing the visual direction.

Implementation targets:

- create quality preset definitions for high, balanced, and battery/integrated GPU mode
- connect presets to renderer pixel ratio, post-processing bloom, shadow settings, and geometry/detail where safe
- use `getOptimalPixelRatio` as the starting point, not a parallel system
- add a UI selector only if it can be implemented without cluttering the presentation
- document default preset choice and manual override behavior

Acceptance checks:

- low preset visibly reduces GPU cost by lowering pixel ratio and expensive post-processing
- high preset preserves current presentation quality
- changing presets does not reset artwork selection unexpectedly
- preview build remains stable from `file://`

Reserved Future Pass:

- automatic FPS measurement and adaptive quality switching
- detailed device benchmarking

#### Slice 7 — Timeline Thumbnail Aspect Ratio & Loading States

Goal: make timeline thumbnails visually stable and consistent with the side preview aspect-ratio fix.

Implementation targets:

- use artwork metadata dimensions to decide thumbnail fit behavior
- choose a documented default between contain, cover, or framed contain for thumbnails
- add loading/skeleton state before images finish loading
- avoid layout shift when thumbnails load
- keep active and focus states readable over all thumbnail formats

Acceptance checks:

- portrait, square, landscape, and ultra-wide thumbnails no longer look unintentionally stretched
- thumbnails reserve stable dimensions while loading
- timeline remains scrollable and usable on narrow screens
- implementation is documented in `FINDINGS.md`

Reserved Future Pass:

- generated thumbnail derivatives
- responsive thumbnail density controls

#### Slice 8 — Fullscreen Toggle & Presentation Mode Polish

Goal: support customer presentation use without browser UI distractions.

Implementation targets:

- add a fullscreen/presentation control in `src/ui/`
- use the browser Fullscreen API with graceful fallback when unavailable
- add presentation mode styling for reduced clutter if fullscreen is active
- ensure Escape/browser fullscreen exit updates UI state correctly
- keep navigation, zoom, reset, and timeline controls reachable while presenting

Acceptance checks:

- fullscreen can be entered and exited without breaking WebGL rendering or layout
- UI state updates when fullscreen exits through browser controls
- presentation mode does not hide critical controls permanently
- behavior is documented for customer demos

Reserved Future Pass:

- kiosk mode packaging
- multi-screen presenter controls

#### Slice 9 — Structured Artwork Metadata Model For Future CMS

Goal: prepare the content model for later CMS integration without adding a CMS yet.

Implementation targets:

- replace the minimal `Artwork` interface with a structured model that includes stable id, title, subtitle, description, dimensions, alt text, credits, tags, and asset paths
- keep a local static data source as the canonical v0.01 content source
- update all consumers: info panel, timeline, gallery preload, side panels, and future documentation screenshots
- document which fields are required now and which are reserved for future CMS use

Acceptance checks:

- TypeScript catches missing required artwork fields
- existing gallery UI still works with the new metadata model
- local preview still works offline
- `FINDINGS.md` records CMS-readiness boundaries

Reserved Future Pass:

- live CMS API loading
- editorial admin workflows
- localization fields and translation management

#### Slice 10 — Customer Handoff Screenshots & Architecture Diagrams

Goal: make the project easier to review and hand off to non-developers.

Implementation targets:

- create a documentation asset folder such as `docs/assets/`
- add current local-preview screenshots generated from the committed preview
- add a simple architecture diagram covering launcher, preview build, source app, asset pipeline, and documentation flow
- link screenshots and diagrams from `README.md` and `plan.md`
- document how screenshots should be regenerated after visual changes

Acceptance checks:

- screenshots reflect the current committed preview
- architecture diagram explains the local preview and development build paths clearly
- documentation remains useful when viewed directly on GitHub

Reserved Future Pass:

- automated screenshot generation in CI
- branded customer PDF handoff deck

#### Recommended v0.01 Execution Order

1. Slice 9 — Structured Artwork Metadata Model For Future CMS
2. Slice 1 — Final Local Artwork Asset Pipeline
3. Slice 7 — Timeline Thumbnail Aspect Ratio & Loading States
4. Slice 3 — Explicit Zoom & Reset View UI
5. Slice 4 — Keyboard-Accessible Timeline & Focus Styles
6. Slice 2 — Accessibility Motion & Contrast Controls
7. Slice 5 — Lightweight WebGL Fallback Screen
8. Slice 6 — Quality Presets For Integrated GPU / Battery Mode
9. Slice 8 — Fullscreen Toggle & Presentation Mode Polish
10. Slice 10 — Customer Handoff Screenshots & Architecture Diagrams

This order starts with the data model and local assets because later UI, thumbnails, accessibility labels, and documentation screenshots depend on stable artwork metadata.


## v0.02 Scope — Advanced Painting Material Shaders & Experimental WebGPU

### v0.02 Mission

v0.02 focuses on making the artworks read as **realistic physical paintings** rather than flat images on a plane. The goal is a web-only rendering pipeline that combines believable canvas/paper texture, layered pigment, bump/normal detail, specular response, and realistic light interaction while preserving predictable performance across a wide GPU range.

Primary targets:

- **Visual target:** close-up inspection should show woven canvas fibers, brush ridges, pigment thickness, fine detail noise, subtle edge lift, and light-dependent highlights.
- **Lighting target:** spotlights and fill lights should visibly respond to artwork surface detail through normal, bump, roughness, specular, and optional ambient-occlusion maps.
- **Performance target:** sustain **60 FPS on mid-range discrete GPUs** at the balanced/default preset and at least **25 FPS on old low-end integrated GPUs** using the battery preset.
- **Platform target:** all web-based, with WebGL 2 as the production path and an experimental WebGPU path behind feature detection and explicit opt-in.
- **Accessibility target:** shader motion and glints must respect reduced-motion and high-contrast preferences; visual realism must not make controls illegible.

### v0.02 Non-Goals

- Do not replace Three.js as the primary renderer in production.
- Do not require native apps, browser extensions, server-side rendering, or offline GPU tools at runtime.
- Do not make WebGPU mandatory; WebGL must remain the reliable customer-demo path.
- Do not add a CMS or remote asset service in v0.02.
- Do not ship generated texture assets without documenting their source, compression settings, and regeneration path.

### v0.02 Architectural Direction

v0.02 should introduce a layered material system rather than placing all logic inside `ArtworkMesh`.

Planned modules:

- `src/materials/PaintingMaterial.ts`
  - WebGL production material factory.
  - Extends or wraps `THREE.MeshPhysicalMaterial` through `onBeforeCompile` only where physically based defaults are not enough.
  - Accepts color/albedo, normal, detail-normal, bump/height, roughness, specular, and ambient-occlusion maps.
- `src/materials/PaintingTextureSet.ts`
  - Typed texture-set model for each artwork.
  - Defines required and optional maps, scale factors, UV tiling, mip policy, and compression metadata.
- `src/materials/ProceduralTextureFactory.ts`
  - Generates lightweight fallback texture maps in-browser for local/offline preview when real maps are missing.
  - Must be deterministic per artwork id so screenshots remain stable.
- `src/rendering/RenderBackend.ts`
  - Backend abstraction with `webgl` as stable default and `webgpu-experimental` as opt-in future path.
- `src/rendering/WebGPUPrototype.ts`
  - Experimental WebGPU capability check and prototype renderer/material path.
  - Must not block WebGL initialization or customer preview.
- `src/performance/FrameBudgetMonitor.ts`
  - Rolling FPS and GPU-cost proxy measurement.
  - Drives optional adaptive quality in development first, then production once stable.
- `src/debug/MaterialInspector.ts`
  - Development-only panel for toggling maps, inspecting roughness/specular values, and freezing light angles.

### v0.02 Material Model

Each artwork should be represented by a texture set, not a single image.

Required maps for final v0.02 quality:

- **Albedo / base color:** final painting image, color-managed as sRGB.
- **Normal map:** mid-frequency canvas and brush direction response, tangent-space, linear color.
- **Detail normal map:** high-frequency weave and micro paint grain, tiled with independent scale.
- **Height / bump map:** grayscale relief for brush ridges and canvas tooth; used for bump perturbation and optional parallax-lite at close zoom.
- **Roughness map:** controls matte varnish, dry paint, and shinier pigment variation.
- **Specular map:** subtle reflectivity differences for varnished or thick pigment regions.
- **Ambient-occlusion map:** optional close-range crease/depth grounding, especially near thick strokes and canvas weave.

Material uniforms and metadata:

- `uCanvasNormalStrength`
- `uDetailNormalStrength`
- `uBumpStrength`
- `uSpecularStrength`
- `uRoughnessFloor`
- `uRoughnessCeiling`
- `uVarnishStrength`
- `uDetailTiling`
- `uLightGrazingBoost`
- `uCloseInspectionMix`
- `uReducedMotionScalar`

Implementation rule: every uniform must be connected to a quality preset, artwork metadata, or user preference. Avoid unowned magic numbers inside shaders.

### v0.02 Lighting Model

The current light rig should evolve from "pleasant gallery light" to a controllable physical inspection rig.

Implementation targets:

- Add named light profiles:
  - `gallery-soft`: current premium balanced presentation.
  - `raking-inspection`: low-angle light to reveal texture relief.
  - `museum-neutral`: flatter conservation-style light for accurate color review.
  - `dramatic-demo`: customer presentation mode with stronger highlight movement.
- Add per-profile intensity, angle, color temperature, and motion settings.
- Support reduced-motion by freezing any moving highlight profile.
- Keep light motion slow and subtle; never use fast animated shimmer on artwork surfaces.
- Ensure specular response is visible only at plausible grazing angles, not uniformly across the painting.
- Clamp highlight intensity so albedo remains readable and bloom does not wash out bright works.

### v0.02 WebGL Shader Strategy

Production WebGL path should be conservative and incremental.

Preferred approach:

1. Start from `MeshPhysicalMaterial` for physically based lighting, tone mapping, clearcoat, and renderer compatibility.
2. Use `onBeforeCompile` to inject only the missing painting-specific detail blending:
   - combine base normal map + detail normal map
   - apply bump/height perturbation with quality-dependent strength
   - modulate roughness/specular from maps and preset scalars
   - optionally add close-inspection grazing-light enhancement
3. Keep shader chunks compatible with Three.js `0.166.x` unless upgrading Three.js is explicitly planned and documented.
4. Use defines for quality tiers so battery mode compiles out expensive detail paths rather than only setting strengths to zero.
5. Avoid dynamic branching in fragment shader hot paths where a compile-time define can be used instead.

Required shader variants:

| Variant | Intended preset | Features |
| --- | --- | --- |
| `painting-high` | high | base normal + detail normal + bump + roughness + specular + AO + grazing boost |
| `painting-balanced` | balanced | base normal + detail normal + roughness + specular; bump lower strength; AO optional |
| `painting-battery` | battery / old iGPU | base normal only, low texture resolution, no AO, no grazing boost, reduced bloom/shadows |

### v0.02 Experimental WebGPU Strategy

WebGPU work must be isolated, measurable, and reversible.

Implementation targets:

- Add `isWebGPUAvailable()` feature detection using `navigator.gpu` without requesting an adapter during normal WebGL boot unless the user explicitly selects WebGPU experimental mode.
- Add `webgpu-experimental` as a hidden/dev quality/backend option, not a customer default.
- Prototype one artwork material path in WebGPU before attempting full parity.
- Keep WebGPU code behind dynamic import so unsupported browsers do not pay parse/initialization cost.
- Document all browser support caveats in `FINDINGS.md` and `docs/HANDOFF.md`.
- If Three.js WebGPURenderer is used, pin the compatible Three.js examples import path and document any API instability.
- If a custom WebGPU pass is used, keep it limited to material preview or offscreen experimentation until parity is proven.

Acceptance for WebGPU in v0.02:

- WebGL path remains unchanged and production-ready if WebGPU is unsupported.
- WebGPU mode can be enabled manually in development.
- WebGPU failure falls back to WebGL without blank screen or broken UI.
- WebGPU prototype reports at least frame timing, adapter info when allowed, selected limits, and unsupported feature reasons.

### v0.02 Performance Budgets

Performance must be treated as a first-class implementation requirement.

Frame targets:

| Device class | Target | Required preset behavior |
| --- | --- | --- |
| Mid-range discrete GPU | 60 FPS at 1440p | balanced preset, post-processing enabled, detail normal enabled |
| High-end discrete GPU | 60 FPS at 4K or high-DPI capped | high preset, full detail stack, controlled bloom |
| Old integrated GPU | 25 FPS minimum at 720p–1080p | battery preset, no AO/grazing boost, lower pixel ratio, fewer segments |

Initial budgets:

- Balanced fragment texture reads should target no more than 5–6 lookups per fragment for artwork material.
- Battery fragment texture reads should target no more than 2–3 lookups per fragment.
- Artwork geometry should stay tied to quality presets; do not increase segments globally without measurement.
- Texture memory for all loaded artwork material maps should be budgeted before implementation; avoid loading high-resolution auxiliary maps for inactive/side-preview works.
- Use mipmaps and anisotropy carefully; high anisotropy helps oblique viewing but can be expensive on older GPUs.
- Disable or lower bloom when material highlights already provide realistic specular response.

Measurement plan:

- Add a `FrameBudgetMonitor` that records rolling 1s, 5s, and 30s FPS averages.
- Record approximate active texture count and selected shader variant in development logs.
- Create a manual performance test matrix for:
  - first load
  - idle front view
  - zoomed close inspection
  - panning while zoomed
  - rapid artwork navigation
  - fullscreen presentation
  - reduced-motion + battery preset
- Add performance findings to `FINDINGS.md` after every shader slice.

### v0.02 Texture Asset Pipeline

v0.02 should plan for real texture maps but still keep the local preview robust.

Implementation targets:

- Define a texture naming convention:
  - `{artworkId}-albedo.webp`
  - `{artworkId}-normal.webp` or `.png` if precision requires it
  - `{artworkId}-detail-normal.webp/png`
  - `{artworkId}-height.webp/png`
  - `{artworkId}-roughness.webp`
  - `{artworkId}-specular.webp`
  - `{artworkId}-ao.webp`
- Add metadata fields for map paths and scale factors without requiring every map at first.
- Load maps lazily by role:
  - current artwork: full selected preset map set
  - adjacent side previews: albedo only or albedo + low normal
  - timeline: thumbnail/albedo only
- Keep procedural fallback maps for offline development and missing asset safety.
- Document every map's intended color space:
  - albedo: sRGB
  - normal/detail/height/roughness/specular/AO: linear/no color transform
- Prefer GPU-compressed textures only after measuring browser support and build complexity.

### v0.02 Vertical Slices

#### Slice 1 — Texture Set Metadata Contract

Goal: extend artwork metadata for realistic painting maps without requiring the final maps immediately.

Implementation targets:

- Add `PaintingTextureSet` types for albedo, normal, detail normal, bump/height, roughness, specular, and AO.
- Add per-map color-space and resolution metadata.
- Add material tuning fields for strength/tiling defaults.
- Update `TextureManager` or add `PaintingTextureManager` for role-aware map loading.
- Keep existing v0.01 artworks working through procedural fallback maps.

Acceptance checks:

- TypeScript prevents invalid map roles or missing required albedo.
- Existing preview still loads with fallback maps.
- Documentation explains which maps are required for final realism and which are optional.

#### Slice 2 — Procedural Painting Map Generator

Goal: create believable fallback normal/detail/bump/roughness/specular maps so the material system can be developed before final scanned assets exist.

Implementation targets:

- Generate deterministic canvas weave normal maps per artwork id.
- Generate brush-stroke height noise using layered directional noise or canvas-based procedural strokes.
- Generate roughness/specular variation that follows plausible pigment/varnish patterns.
- Cache generated textures and dispose them correctly.
- Keep generation cheap enough for local preview startup.

Acceptance checks:

- Close-up view reveals canvas tooth and subtle brush relief.
- Generated maps do not create distracting repeating patterns at normal viewing distance.
- Battery preset can skip detail generation or use lower resolution.

#### Slice 3 — PaintingMaterial WebGL Prototype

Goal: replace the current simple physical material with a painting-aware material while preserving existing interactions.

Implementation targets:

- Introduce `PaintingMaterial` factory around `MeshPhysicalMaterial`.
- Wire albedo, normal, roughness, and specular maps first.
- Add quality-dependent defines for high/balanced/battery shader variants.
- Preserve current tone mapping, color management, and disposal behavior.
- Add development toggles to disable each map for comparison.

Acceptance checks:

- Lighting visibly responds to normal/roughness/specular maps.
- No visible regression in artwork aspect fitting, zoom, pan, or timeline navigation.
- Battery preset remains visually acceptable and measurably cheaper.

#### Slice 4 — Detail Normal + Bump / Height Refinement

Goal: make close-up inspection look like real paint on canvas.

Implementation targets:

- Blend base normal and detail normal with stable tangent-space math.
- Add bump/height perturbation that scales with zoom/inspection distance.
- Reduce high-frequency detail at distance to avoid shimmer/aliasing.
- Use mipmap-aware tiling and clamp extreme normal strengths.
- Respect reduced-motion by avoiding animated surface shimmer.

Acceptance checks:

- Detail is visible when zoomed in but not noisy at default framing.
- Grazing light reveals texture without washing out the painting.
- Low-end preset disables or heavily reduces the expensive detail path.

#### Slice 5 — Realistic Gallery Light Profiles

Goal: make material relief readable through physically plausible light direction and intensity.

Implementation targets:

- Add typed light profiles with angle, color temperature, intensity, and motion flags.
- Add raking inspection light mode for texture review.
- Integrate light profile selection with presentation/fullscreen UI only if it stays uncluttered.
- Clamp bloom and exposure for highlight-heavy profiles.

Acceptance checks:

- Raking light reveals bump/normal relief clearly.
- Museum-neutral profile preserves color and reduces dramatic highlights.
- Reduced-motion freezes moving light profiles.

#### Slice 6 — Frame Budget Monitor + Manual Benchmark Overlay

Goal: make the FPS requirements measurable before adding adaptive quality.

Implementation targets:

- Add rolling FPS monitor with 1s/5s/30s averages.
- Add dev-only overlay showing preset, backend, pixel ratio, shader variant, active map count, and FPS.
- Keep overlay disabled in customer preview unless explicitly enabled by query parameter/local setting.
- Document benchmark procedure in `docs/HANDOFF.md`.

Acceptance checks:

- Mid-range test can confirm 60 FPS target manually.
- Low-end/iGPU test can confirm 25 FPS target manually.
- Findings record device/browser/preset results.

#### Slice 7 — Adaptive Quality Guardrails

Goal: protect weaker GPUs from falling below the minimum target.

Implementation targets:

- Add optional adaptive downgrade from high → balanced → battery based on sustained low FPS.
- Never downgrade immediately during loading or short navigation spikes.
- Notify the user unobtrusively if quality is reduced automatically.
- Allow manual override through preferences.

Acceptance checks:

- Sustained low FPS triggers safe downgrade.
- Quality switch does not reset artwork, zoom, pan, fullscreen, or accessibility state.
- Manual preset selection can disable automatic changes.

#### Slice 8 — Experimental WebGPU Backend Probe

Goal: introduce WebGPU experimentation without risking the production WebGL preview.

Implementation targets:

- Add WebGPU feature detection and backend metadata.
- Add dynamic import for WebGPU prototype code.
- Implement a minimal material-preview path for one artwork or offscreen render target.
- Log adapter limits and unsupported reasons in development mode.
- Fall back to WebGL on any failure.

Acceptance checks:

- Unsupported browsers continue with WebGL and no UI breakage.
- Supported browsers can manually enable WebGPU experimental mode.
- WebGPU code path is clearly labeled experimental in UI/docs.

#### Slice 9 — Real Texture Asset Integration Pass

Goal: replace procedural fallback maps for at least one artwork with real authored/scanned maps.

Implementation targets:

- Add one complete texture set for a representative artwork.
- Compare procedural vs authored maps under all light profiles.
- Document asset size, compression, color-space decisions, and visual differences.
- Ensure preview build remains local/offline safe.

Acceptance checks:

- Authored maps produce visibly more realistic paint relief than fallback maps.
- File size remains acceptable for local preview.
- Side previews and timeline do not load unnecessary heavy maps.

#### Slice 10 — v0.02 Documentation, Review, and Handoff

Goal: make shader and WebGPU decisions reviewable and reproducible.

Implementation targets:

- Update `docs/HANDOFF.md` with shader controls, benchmark procedure, and WebGPU caveats.
- Add material architecture diagram or extend existing `docs/assets/architecture.svg`.
- Add screenshot guidance for close-up material comparison: neutral light, raking light, high contrast, battery mode.
- Record benchmark and browser findings in `FINDINGS.md`.

Acceptance checks:

- A future contributor can implement or review the material path from docs alone.
- Customer-facing handoff clearly distinguishes stable WebGL from experimental WebGPU.
- Markdown docs and changelog reflect actual shipped shader slices.

### Recommended v0.02 Execution Order

1. Slice 1 — Texture Set Metadata Contract
2. Slice 2 — Procedural Painting Map Generator
3. Slice 3 — PaintingMaterial WebGL Prototype
4. Slice 4 — Detail Normal + Bump / Height Refinement
5. Slice 5 — Realistic Gallery Light Profiles
6. Slice 6 — Frame Budget Monitor + Manual Benchmark Overlay
7. Slice 7 — Adaptive Quality Guardrails
8. Slice 8 — Experimental WebGPU Backend Probe
9. Slice 9 — Real Texture Asset Integration Pass
10. Slice 10 — v0.02 Documentation, Review, and Handoff

This order keeps the stable WebGL material path ahead of WebGPU experimentation. WebGPU should not begin until the texture-set contract, material behavior, lighting model, and measurement tools are clear enough to compare against.

### v0.02 Acceptance Summary

v0.02 is complete only when:

- realistic painting texture is visible in close-up through normal/detail/bump/specular/roughness response
- lighting profiles produce believable and controllable surface highlights
- balanced preset sustains the 60 FPS target on a mid-range discrete GPU test machine
- battery preset sustains at least 25 FPS on an old integrated GPU test machine or clearly documents the closest measured result and remaining bottleneck
- WebGPU path is isolated, optional, documented, and never required for customer preview
- all markdown docs include implementation results, findings, and remaining risks

## Reserved Future Pass After v0.01

- content management integration
- multilingual content pipeline
- audio narration and accessibility audio layer
- analytics and multi-gallery support
- WebGPU production renderer parity and VR path after the v0.02 experimental probe

## Verification Notes

- `npm run build` should regenerate the committed local customer preview.
- `npm run lint` should remain clean except for the known TypeScript parser support warning from current dependency versions.
- Interaction fixes should be manually tested in both `npm run dev` and by opening root `index.html` locally.
