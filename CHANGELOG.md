# CHANGELOG

## Unreleased

### Added

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
