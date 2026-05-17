# FREYRAUM customer handoff guide

This document supports presenting FREYRAUM to customers and onboarding new contributors. It includes the v0.01 architecture diagram, the controls surface, and the procedure for refreshing screenshots after visual changes.

## Architecture diagram

![FREYRAUM v0.01 architecture](./assets/architecture.svg)

The diagram captures four horizontal layers and two cross-cutting systems:

- **Customer launcher → preview** (`index.html` → `customer-preview/app.html`) — one-click local demo.
- **Vite dev entry** (`app.html` → `npm run dev`) — module graph and HMR for development.
- **Build pipeline** — TypeScript strict, IIFE bundle for `file://`, HTML emitter with crypto patch.
- **App core** (`src/main.ts`) — rendering, gallery logic, interaction, UI/DOM.
- **Accessibility & preferences** — `utils/preferences.ts` + `utils/webgl.ts` + system media queries.
- **Quality presets** — `config/quality.ts` subscribed by renderer, post-processing, lighting, and the artwork mesh.

## Controls surface

| Surface | Action | Notes |
| --- | --- | --- |
| Mouse wheel / pinch | Zoom in / out | Clamped to artwork-aware safe bounds. |
| Mouse drag / one-finger touch (zoomed) | Pan within bounds | Falls back to subtle hover rotation when not zoomed. |
| Touch swipe (not zoomed) | Navigate artworks | Threshold 50 px. |
| ← / → | Navigate artworks | Disabled in inputs and inside the timeline (timeline owns its own arrows). |
| `+` / `-` | Zoom in / out | Shares the same clamping as wheel zoom. |
| `0` or `R` | Reset view | Restores zoom, pan, and hover rotation to default. |
| `F` | Toggle fullscreen | Mirrors the on-screen Fullscreen button. |
| Timeline thumbnail buttons | Select artwork | Real `<button>` elements. Roving tabindex. Home / End jump to first / last. |
| Settings (gear) | Open preferences | Reduced motion, high contrast, quality preset. Persisted in `localStorage`. |
| Zoom UI rail | Zoom in / out / reset | Same handlers as keyboard. |

## Accessibility modes

| Mode | Effect |
| --- | --- |
| **Reduced motion** | Disables artwork swoop on navigation, freezes the spotlight subtle motion, disables timeline skeleton shimmer, and shortens transition durations. |
| **High contrast** | Strengthens borders, removes most of the glass blur, switches body text to true black, and raises label weight. |
| **WebGL fallback** | Shown when WebGL is unavailable; explains how to enable hardware acceleration. |

## Quality presets

| Preset | Pixel ratio cap | Bloom | Shadows | Geometry segments |
| --- | --- | --- | --- | --- |
| High | 1.8 | 0.12 | yes | 240 |
| Balanced (default) | 1.4 | 0.08 | yes | 120 |
| Battery / iGPU | 1.0 | off | no | 48 |

## Refreshing customer-handoff screenshots

Screenshots are tracked in `docs/assets/` alongside the architecture diagram. They are intentionally not committed to v0.01 because the customer preview now runs from `file://` and can be captured on any contributor's machine without staging infrastructure.

Recommended procedure:

1. Run `npm run build` to rebuild the committed `customer-preview/`.
2. Open `customer-preview/app.html` (or the root `index.html` launcher).
3. Capture screenshots at 1440 × 900 for the marketing-ready landscape view and 1080 × 1920 for the responsive vertical view.
4. Save them in `docs/assets/` with descriptive names (e.g., `screenshot-default.png`, `screenshot-high-contrast.png`, `screenshot-zoom-detail.png`, `screenshot-fullscreen.png`).
5. Reference each new screenshot in this file under a "Visual reference" section.
6. Commit screenshots only after a visual change. Do not commit screenshots that are out of sync with the current preview.

Automating screenshot capture in CI is reserved for a future pass.

## Reviewer checklist

Use this checklist when reviewing a v0.01 release candidate or future PR that touches the customer-facing surface.

- [ ] Build and lint pass (`npm run build`, `npm run lint`).
- [ ] `customer-preview/` is regenerated and committed.
- [ ] Keyboard-only flow reachable: Tab order is logical, focus ring visible everywhere, timeline arrow keys behave.
- [ ] Reduced motion mode is visually distinct (no swoop on artwork change, no spinner rotation).
- [ ] High contrast mode keeps every control legible.
- [ ] Zoom and pan are clamped on every artwork format (portrait, square, landscape, ultrawide).
- [ ] WebGL fallback renders correctly (force-disable WebGL in the browser to verify).
- [ ] Quality preset switching takes effect without resetting artwork selection.
- [ ] Fullscreen toggle and Escape exit both update the on-screen state.


## v0.03 follow-up review focus

v0.03 is currently a plan, not an implemented runtime change. Reviewers should use it to guide the next implementation pass after v0.02:

- **Fidelity:** the source artwork image must remain the stable albedo reference; lighting/material response must not change the picture's essence.
- **Matte surface:** default gallery view should read as rough canvas/dry paint, not shiny plastic or wet varnish.
- **Visible relief:** bump/height/detail maps should be clearly visible in an inspection/raking-light mode.
- **High zoom:** relief detail should remain crisp at maximum zoom without obvious 256 px tile blur or repetition.
- **Free inspection:** close-up pan should allow reaching every edge and corner while preserving reset/escape controls.

Acceptance for v0.03 should include albedo-only comparison screenshots, matte-default screenshots, raking-light screenshots, max-zoom relief screenshots, and edge/corner navigation checks for portrait, square, landscape, and ultrawide artworks.

## v0.02 shader, lighting, and WebGPU review guide

v0.02 is **implemented** in this branch. Future reviewers should evaluate two independent lanes:

**Lane 1 — Stable WebGL material realism (shipped):**
- `PaintingMaterial` (`src/materials/PaintingMaterial.ts`) extends `MeshPhysicalMaterial` and combines native Three.js features (`map`, `normalMap`, `roughnessMap`, `specularIntensityMap`, `bumpMap`, `aoMap`) with a minimal `onBeforeCompile` injection
- Shader variants are driven by `QualityPreset.shaderVariant`: `painting-high` (up to 7 maps), `painting-balanced` (5 maps, no AO, no height), `painting-battery` (albedo + base normal only)
- Compile-time `#define` flags actually emitted by the implementation: `PAINTING_USE_DETAIL_NORMAL`, `PAINTING_USE_BUMP`, `PAINTING_USE_AO`, `PAINTING_USE_GRAZING_BOOST`. Roughness/specular path inclusion is driven natively by Three.js based on whether `roughnessMap`/`specularIntensityMap` are assigned, which the preset controls
- Four light profiles in `src/lighting/LightProfile.ts`: `gallery-soft` (default, animated), `raking-inspection` (still, reveals canvas relief), `museum-neutral` (5500 K dual-key, still), `dramatic-demo` (warm-cool, animated)
- Audited rule honoured: detail normals are blended in tangent space inside the `normal_fragment_maps` replacement, before `tbn * mapN` runs — never added to the final view-space normal
- Audited rule honoured: `PaintingMaterial` does not own cached textures; ownership stays in `TextureManager` and `ProceduralTextureFactory`
- Audited rule honoured: `GalleryManager.showArtwork` uses an `artworkLoadToken` counter so rapid navigation cannot apply stale maps
- Audited rule honoured: bump perturbation is applied explicitly via `perturbNormalArb` after `normal_fragment_maps`, so `normalMap` and `bumpMap` coexist correctly

**Lane 2 — Experimental WebGPU probe (shipped):**
- Activated by `?backend=webgpu` query param or `localStorage.setItem('freyraum.backend', 'webgpu')`
- `RenderBackend.maybeProbeWebGPU()` loads `customer-preview/webgpu-probe.js` via runtime `import()` only when the user opts in. This is intentionally implemented as a copied public module because the main customer preview is emitted as a single IIFE for `file://`, so Rollup code splitting is not the right tool for keeping the probe out of the normal bundle
- `initWebGPUPrototype()` returns a serializable `WebGPUProbeResult` (`supported`, `adapterInfo`, `limits`, `unsupportedFeatures`, `fallbackToWebGL`) and never throws
- Never used to render the gallery; clearly labelled experimental

**Aspect-ratio acceptance — every artwork format:**
- Portrait (3:4), square (1:1), landscape (3:2), and ultrawide (7:3) sample artworks all render with:
  - artwork plane and frame both scaled by `fitWithinBox` so the frame margin stays uniform
  - canvas-weave detail-normal tiling driven by world-space dimensions, so weave threads stay square and at uniform physical density in every orientation
  - per-preset anisotropy cap so tilted-view sharpness is preserved without aliasing
  - pan limits and minimum zoom both derived from the fitted artwork dimensions

**Benchmark procedure:**
1. Build and open `customer-preview/app.html` locally.
2. Use the in-app Settings panel (gear button) to switch quality presets. The active preset is mirrored to `localStorage` and to the `data-quality` attribute on `<html>` for easy inspection.
3. Watch the browser's built-in FPS counter (DevTools → Rendering → Frame Rendering Stats) during: idle front view, zoomed close inspection, panning while zoomed, and rapid arrow-key navigation through all four artworks.
4. Document device, browser, OS, and observed FPS for each preset in `FINDINGS.md`.

> Note: the optional `MaterialInspector` HUD described in the original v0.02 plan is intentionally not implemented in this pass. `FrameBudgetMonitor.readSnapshot()` exposes EMA / rolling FPS / cooldown state and is ready to be surfaced behind `?debug=material` in a future debug-tooling pass without runtime changes.

**Light profile comparison procedure:**
1. The default profile is `gallery-soft`. Switch profiles by calling `lightingSetup.setProfile(id)` from the browser console (`__freyraumDebug` could be added in a future pass to surface this in the UI).
2. `raking-inspection` — surface relief should be clearly visible at zoom; canvas weave and brush strokes both cast micro-shadows.
3. `museum-neutral` — flatter dual-key 5500 K light, accurate colour, no dramatic highlights, no animation.
4. `gallery-soft` — current default, subtle slow oscillation, warm key.
5. `dramatic-demo` — warm-cool contrast for marketing screenshots.

**Adaptive quality verification:**
1. Open the preview in `high` preset.
2. Apply artificial GPU load (browser DevTools → Performance → Slow CPU 6× throttle is a useful proxy).
3. After roughly 4 s of sustained under-budget frames outside the navigation cooldown, the preset should automatically downgrade to `balanced`. The preferences popover reflects the change.
4. Once the user manually changes the preset back, the controller suspends for the rest of the session.
5. Sanity-check that the controller does **not** suspend itself on its own automatic downgrade: if sustained pressure continues after the hold-off, it may still downgrade once more from `balanced` to `battery`.

**Audit-critical release blockers — verified in this implementation:**
- No stale auxiliary maps after rapid navigation across all artworks (token guard)
- No visible texture/material leak after repeated navigation and preset switching (textures owned by `TextureManager` + `ProceduralTextureFactory`, only those classes dispose them)
- Switching presets updates the currently visible artwork immediately; `battery` mode does not leave stale roughness/specular/detail work attached until the next navigation
- Reduced-motion mode flattens the detail-normal contribution via `uReducedMotionScalar` without corrupting the normal basis, and freezes light animation
- WebGPU probe failure always returns cleanly to the normal WebGL preview path (probe is fire-and-forget, never participates in rendering)

**Performance acceptance targets:**

| Device class | Target | Notes |
| --- | --- | --- |
| Mid-range discrete GPU | 60 FPS | Balanced preset, post-processing on, detail normal on. |
| High-end discrete GPU | 60 FPS | High preset, 1.8 DPR cap, full 7-map stack. |
| Old integrated GPU | 25 FPS minimum | Battery preset, 2 texture reads, no AO/grazing/detail normal. |

WebGPU stays labelled experimental until full parity and graceful fallback are verified across browser engines in a future pass.

## Reserved future-pass items

The following items are intentionally not implemented in v0.01:

- Automated CI screenshot capture.
- Hosted CMS / remote asset CDN.
- WebGPU production renderer parity and VR path after the v0.02 experimental probe.
- Multilingual content pipeline and i18n.
- Analytics, telemetry, and persisted view positions.
