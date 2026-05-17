# CHANGELOG

## Unreleased

### Added (v0.03 planning)

- Expanded the v0.03 plan in `plan.md` into a more technical rendering architecture: modular artwork surface contracts, resolution-independent asset selection, preset-based shader tiers, tangent-space parallax occlusion mapping strategy, direct-light self-shadow approximation, matte-first material retuning, and explicit module/file responsibilities.
- Reworked v0.03 findings in `FINDINGS.md` to document the current code-level constraints and the proposed technical direction for modular asset swaps, effective texel-density handling, parallax-style relief, self-shadowing, and inspection camera bounds.
- Updated `README.md` and `docs/HANDOFF.md` so the v0.03 summary and reviewer guidance now reflect the more coding-oriented architecture and acceptance criteria.

### Added (v0.02 implementation)

- **`PaintingMaterial`** (`src/materials/PaintingMaterial.ts`) — extends `MeshPhysicalMaterial` and combines native Three.js features (`map`, `normalMap`, `roughnessMap`, `specularIntensityMap`, `bumpMap`, `aoMap`) with a minimal `onBeforeCompile` injection that does tangent-space detail-normal blending, an explicit `perturbNormalArb` after-pass so `normalMap` and bump coexist correctly, and a grazing-light boost gated by `PAINTING_USE_GRAZING_BOOST`. Reduced-motion mode flattens the detail contribution via the `uReducedMotionScalar` uniform without corrupting the normal basis.
- **`ProceduralTextureFactory`** (`src/materials/ProceduralTextureFactory.ts`) — deterministic procedural generators for albedo, base normal, detail normal, height/bump, roughness, specular (with Gaussian varnish-pooling blobs), and AO maps. Outputs are `DataTexture` instances with mipmaps and `RepeatWrapping`.
- **`PaintingTextureSet`** contract (`src/materials/PaintingTextureSet.ts`) — typed map roles, colour-space hints, and resolved-texture shape. `Artwork.textureSet?` is now optional metadata on every artwork.
- **Role-aware `TextureManager`** (`src/gallery/TextureManager.ts`) — `loadForRole(url, role)` correctly sets `LinearSRGBColorSpace` for non-albedo maps and applies a per-preset anisotropy divisor; `preloadTextureSet(set)` loads a full `PaintingTextureSet` in parallel. Later audit hardening also reapplies anisotropy caps to already-cached textures when the preset changes.
- **`LightProfile` system** (`src/lighting/LightProfile.ts`) — four named profiles: `gallery-soft` (default, animated), `raking-inspection` (reveals canvas relief, still), `museum-neutral` (5500 K dual-key, still), `dramatic-demo` (warm-cool contrast, animated). Includes `kelvinToColor` Tanner-Helland approximation. `LightingSetup` reuses spotlight pool across profile switches.
- **`FrameBudgetMonitor`** (`src/utils/FrameBudgetMonitor.ts`) — rolling 60-frame window, EMA smoothing, cooldown for navigation/preset spikes, clamps pathological frames at 250 ms so tab-switches do not poison the rolling average.
- **`AdaptiveQualityController`** (`src/utils/AdaptiveQualityController.ts`) — one-way `high → balanced → battery` downgrade path with post-downgrade hold-off, ignores cooldown windows, and self-suspends as soon as the user makes a manual preset choice.
- **`RenderBackend` + external WebGPU probe module** (`src/rendering/RenderBackend.ts` + `public/webgpu-probe.js`) — opt-in (`?backend=webgpu` query or `localStorage.freyraum.backend = 'webgpu'`) experimental WebGPU adapter probe. Because the customer preview is built as a single IIFE for `file://`, the probe lives as a copied public ES module and is imported only at runtime; failures always fall back silently to WebGL. Returns a serializable probe-result shape independent of the browser's DOM WebGPU types.
- **Extended `QualityPreset`** (`src/config/quality.ts`) — adds `shaderVariant`, `normalStrength`, `detailNormalStrength`, `bumpStrength`, `specularStrength`, `anisotropyDivisor`, `aoEnabled`, `grazingBoostEnabled`, `detailNormalEnabled` fields. Existing presets (`high`, `balanced`, `battery`) populate all fields with non-breaking defaults.
- **Aspect-ratio-aware detail tiling** — `PaintingMaterial.applyTextures(textures, tilingPerWorldUnit, preset)` receives a per-artwork `uDetailTiling` derived from the artwork's world-space dimensions, so canvas weave stays at uniform physical density on portrait, square, landscape, and ultrawide artworks (no stretched weave on 7:3 ultrawide).
- **`uv1` AO support** — `ArtworkMesh.makeArtworkGeometry` clones `uv` into `uv1` after `PlaneGeometry` construction so Three.js ≥ 0.152's `aoMap` path works.
- **Lifecycle guardrails** — `GalleryManager.showArtwork` is async with an `artworkLoadToken` counter so rapid navigation cannot apply a stale texture set. Adaptive controller automatically suspends when the user changes the preset manually.

### Changed (v0.02)

- `ArtworkMesh` now owns a `PaintingMaterial` instead of an inline `MeshPhysicalMaterial`. The inline async normal-texture load from `CanvasMaterial.loadNormalTexture` is replaced by the procedural factory applying a fresh, deterministic per-artwork normal map.
- `GalleryManager` constructor now accepts an optional `ProceduralTextureFactory` (defaults to a new instance) and exposes `proceduralFactory` for shutdown disposal.
- `main.ts` now wires `FrameBudgetMonitor`, `AdaptiveQualityController`, and the WebGPU probe into the boot path. The animation loop samples the frame budget every frame and feeds adaptive decisions back through `preferences.setQuality(...)` so the UI stays consistent. A dedicated `adaptiveQualityWriteInFlight` guard now prevents the controller from suspending itself on its own automatic downgrade.
- `LightingSetup` constructor signature accepts an optional `LightProfileId`. The default profile reproduces v0.01 visuals.
- Quality-preset changes now rebuild the currently displayed artwork's full resolved map set immediately, so switching to `battery` really removes detail-normal / height / roughness / specular / AO work from the active material instead of only affecting the next navigation.

### Removed (v0.02)

- The lazy `CanvasMaterial.loadNormalTexture()` call from `ArtworkMesh`. Procedural normal maps are now generated synchronously by `ProceduralTextureFactory.generate(id, 'normal')`, eliminating a small async race during artwork construction. `CanvasMaterial` is still used for the frame material and may be retired in a future pass.

### Earlier "Unreleased" entries (v0.02 planning, kept for traceability)

- Replaced the v0.02 high-level plan in `plan.md` with a code-grounded final implementation plan: exact TypeScript interfaces for `PaintingTextureSet`, `PaintingMaterial`, `LightProfile`, `FrameBudgetMonitor`, `RenderBackend`, and `WebGPUPrototype`; GLSL injection patterns for Three.js 0.166; procedural texture generation algorithms; `QualityPreset` field additions; and changes to `ArtworkMesh`, `TextureManager`, `GalleryManager`, `LightingSetup`, and `main.ts`.
- Updated `FINDINGS.md` with codebase analysis findings from the v0.02 planning pass.
- Updated `docs/HANDOFF.md` with v0.02 shader controls, light profile descriptions, WebGPU probe instructions, and benchmark procedure.
- Completed a final v0.02 documentation audit: corrected shader-space and bump/specular implementation guidance, added async-load/disposal guardrails, added a validation matrix and risk register, and clarified WebGPU/debug-chunk boundaries.

- Structured artwork metadata model (`Artwork.id`, `year`, `medium`, `dimensions`, `alt`, `credit`, `tags`) in `src/config/artworks.ts` to prepare for future CMS integration
- `PreferencesStore` (`src/utils/preferences.ts`) with reduced-motion and high-contrast modes plus quality-preset persistence in `localStorage`
- Quality preset definitions (`src/config/quality.ts`) for `high` / `balanced` / `battery` modes, applied to renderer pixel ratio, bloom, shadows, and artwork geometry segments
- WebGL availability detection (`src/utils/webgl.ts`) and localized `FallbackScreen` UI component shown when WebGL or the renderer cannot initialize
- `ZoomControls` UI component (zoom in / out / reset) with ARIA labels and tooltips
- `FullscreenButton` UI component using the Fullscreen API with `aria-pressed` syncing on browser-initiated exits
- `PreferencesPanel` popover-style settings dialog with accessible toggles (reduced motion, high contrast) and a radio group for quality presets
- Public `GalleryManager.resetView()` and `setReducedMotion()` so UI and preferences can drive gallery behavior directly
- Keyboard shortcuts in `KeyboardNav`: `+` / `-` zoom, `0` or `R` reset view, `F` fullscreen
- Customer handoff documentation: `docs/HANDOFF.md` plus self-contained SVG architecture diagram at `docs/assets/architecture.svg`
- Info panel now displays year, medium, and credit fields from the structured metadata model

### Changed

- Timeline thumbnails are real `<button>` elements with a roving tabindex; Arrow / Home / End keys navigate, Enter / Space activate
- Timeline thumbnails reserve their artwork's intrinsic aspect ratio inside a fixed frame and use a shimmer skeleton until the image finishes loading, eliminating layout shift
- Renderer, post-processing, lighting, and artwork mesh now accept a `QualityPreset` and expose `applyPreset()` so quality switches at runtime
- SCSS rebuilt as a small design system: design tokens, universal `:focus-visible` ring, `data-motion="reduced"` and `data-contrast="high"` themes, presentation-mode chrome dimming, and responsive adjustments for narrow viewports
- Info panel now uses semantic `<h1>` plus meta and credit lines, with `aria-live="polite"` for artwork change announcements

### Fixed

- Navigation slide-in animation is suppressed in reduced-motion mode so users no longer see large positional swings on artwork change
- Spotlight subtle animation freezes when reduced motion is active, avoiding ambient motion during inspection

## v0.01 - 2026-05-17

### Added

- shared texture sizing helper for consistent image fitting
- documentation baseline files: plan, changelog, findings, and documentation rules
- dynamic zoom and pan safety calculations based on artwork size and camera framing
- touch panning while zoomed in

### Changed

- main artwork zoom now stops before the camera can move unrealistically through the artwork plane
- pan limits now respond to artwork aspect ratio, viewport size, and zoom level
- hover rotation remains available across zoom levels with reduced intensity during close inspection
- side preview panels now preserve artwork aspect ratio instead of stretching
- README now documents controls and repository documentation expectations

### Fixed

- users could previously zoom so deep that the view could move into invalid inspection space
- portrait artworks previously hit vertical inspection limits too early because pan limits were hardcoded
- inactive side preview artworks were stretched by fixed panel geometry

## v0.00 - 2026-05-17

### Added

- one-click root launcher for local customer preview
- committed `customer-preview/` static output
- separate Vite `app.html` development entry
- local preview build pipeline and preview HTML generator
- offline-safe embedded placeholder artworks and procedural normal texture

### Fixed

- blank screen when opening the downloaded repository locally via `index.html`
