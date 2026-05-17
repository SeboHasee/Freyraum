# FREYRAUM customer handoff guide

This document supports presenting FREYRAUM to customers and onboarding new contributors. It includes the v0.01 architecture diagram, the controls surface, the current reviewer focus for v0.03, and the next follow-up scope for v0.04.

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

## v0.05 planning focus

v0.05 is **planned, not implemented yet**. It addresses the latest visual review: dark spots that move with light direction / artwork angle and look like stains. Current diagnosis points to `PaintingMaterial.ts` self-shadow logic, not albedo or AO.

### Suspected root cause

| Area | Current behavior | Why it looks wrong |
|---|---|---|
| Self-shadow blocker test | First height blocker sets `_shadow = 1.0 - uShadowStrength` and breaks | One tiny/broad blocker can create a full dark patch |
| Bias | No height bias/deadzone | Height noise can shadow itself |
| Softness | No smooth transition | Shadows read as hard dirt spots |
| Filtering | One ray, no PCF-like neighborhood | Broad value-noise regions become blotches |
| Strength | High preset uses `selfShadowStrength: 0.55` | Direct light can drop to 45%, too strong for normal display |

### v0.05 implementation direction

- Add self-shadow bias, softness, max-occlusion, and optional filter-radius preset fields.
- Replace binary break logic with smooth blocker accumulation and distance weighting.
- Keep default gallery display conservative; reserve stronger relief for `raking-inspection` if needed.
- Add debug-only self-shadow toggle behind `?debug=1` for future artifact isolation.
- Keep balanced and battery presets free of self-shadow cost.

### Visual review checklist for the future implementation

- [ ] `gallery-soft` has no moving stain-like dark blobs.
- [ ] `raking-inspection` shows soft local relief, not hard blotches.
- [ ] Self-shadow debug toggle proves the artifact source is controlled.
- [ ] Albedo-only debug still proves source artwork color fidelity.
- [ ] `npm run lint` and `npm run build` pass after source changes.

## v0.04 review focus

v0.04 is **implemented**. Reviewers should evaluate the material-quality pass rather than the former plan.

### What changed

| Area | Shipped change | Reviewer expectation |
|---|---|---|
| Fake AO vignette | `generateAO()` now outputs neutral near-white AO with subtle deterministic noise | High preset should not darken painting corners by default |
| Checkerboard / cross-hatch | `generateNormal()`, `generateHeight()`, and `generateRoughness()` now use value noise instead of periodic `sin/cos` fields | Raking light should reveal irregular surface detail, not a grid |
| Varnish / clearcoat | `QualityPreset` gained clearcoat controls and `PaintingMaterial.applySurfaceProfile()` | High preset can show subtle satin response; balanced/battery stay matte and cheaper |
| Texture contract | `PaintingTextureSet` gained optional `varnish` map role | Future scanned support-map packages can drive per-pixel varnish |
| Artwork metadata | All four artworks set `surfaceProfile` | Info panel and material response agree on surface character |
| User-facing metadata | `InfoPanel` shows German surface labels | Visitors understand the material style without shader/debug terminology |
| Parallax height fallback | High preset generates height fallback whenever parallax/self-shadow needs it | Inspection detail works without authored maps |

### Validation evidence

- `npm run lint` passes with the known TypeScript parser warning only.
- `npm run build` passes with the known Sass legacy JS API warning only.
- `customer-preview/freyraum-gallery.js` was regenerated (≈ 555.05 KB / 141.43 KB gzip).
- No new dependencies were added.
- Offline `file://` preview workflow remains unchanged.

### Visual review checklist

- [ ] Default `gallery-soft` view has no procedural dark radial falloff at artwork edges.
- [ ] `raking-inspection` shows stochastic surface relief, not checkerboard or perfect H/V bands.
- [ ] `tokyo-passage` shows a subtle satin response on high preset and returns to matte in balanced/battery.
- [ ] Info panel surface labels read naturally in German.
- [ ] `?debug=1` + `a` albedo-only comparison still proves source artwork colour fidelity.


## v0.03 review focus

v0.03 is **implemented** in this branch. The execution plan in `plan.md` has been carried out; the as-built outcome (deviations from the original plan, issues found and fixed, and validation evidence) is captured under "v0.03 Implementation Outcome" in the same file. This section now guides a reviewer evaluating the implementation rather than the plan.

The shipped change set covers 9 slices:

| Slice | Target files | Shipped change |
|---|---|---|
| 1 | `artworks.ts`, `quality.ts`, `PaintingMaterial.ts` | `SurfaceProfile`/`SurfacePhysics` types, 7 new quality preset fields, `uAlbedoOnly` debug uniform + `setAlbedoOnly()` |
| 2 | `PaintingMaterial.ts`, `ProceduralTextureFactory.ts` | `clearcoat 0.04→0`, `specularIntensity 1.0→0.3`, `uLightGrazingBoost 0.6→0.25`, roughness `[60..220]→[140..240]`, specular peak `200→90`, baseline `12→6` |
| 3 | `ProceduralTextureFactory.ts`, `GalleryManager.ts` | `generate(id, role, tileSize)` + tileSize-aware cache key + size propagation from preset (1024 / 512 / 256) |
| 4 | `ArtworkMesh.ts`, `PaintingMaterial.ts` | `computeTangents()`, 12-step tangent-space parallax before `map_fragment`, `pUV` propagated to `normal_fragment_maps` |
| 5 | `PaintingMaterial.ts`, `LightingSetup.ts`, `main.ts` | 8-step self-shadow horizon march, view-space `uKeyLightDir` uniform pushed per-frame, `getKeyLightWorldDir()` API |
| 6 | `LightProfile.ts`, `LightingSetup.ts`, `PreferencesPanel.ts`, `utils/preferences.ts` | `gallery-soft` key `{x:-3,y:5,z:4}` (~45°); `raking-inspection` key `{x:-6,y:0,z:1.5}` ambient `0.3`; `displayIntent` field; shared `spotTarget` at origin; lighting profile selector UI |
| 7 | `GalleryManager.ts` | `PAN_SAFETY_FACTOR=0.92` → `INSPECTION_OVERSCROLL=0.5` |
| 8 | `quality.ts` | Per-preset step counts tuned and baked in |
| 9 | All md files | Implementation outcome documented; reviewer guidance updated |

Reviewers should verify:

- **No albedo mutation.** Open the preview with `?debug=1` appended to the URL, then press the `a` key. The render should drop to the raw artwork texture (no shading, no relief). The console logs `[freyraum debug] albedo-only ON/OFF` on every toggle. Switching back to shaded mode must keep the picture content visually identical to the debug render — only the lighting on top changes.
- **Museum-style default lighting.** Default profile is `gallery-soft`; the key now sits at `{x:-3,y:5,z:4}`. The painting should look flattering and warm, not like a debug render, and the asymmetry should be subtle.
- **Relief visible during movement.** On the high preset (default on capable GPUs), panning or zooming the artwork should cause visible micro-shifts in surface relief — the parallax UV march responds to view direction in tangent space.
- **Inspection mode contrast.** Switch to "Streiflicht" in the preferences "Beleuchtung" group. The near-horizontal key should dramatically reveal brush ridges and canvas weave; ambient is intentionally low (0.3) to maximise shadow contrast.
- **Full edge/corner reach.** At maximum zoom (`MIN_CAMERA_Z`), panning should let the viewport centre reach every artwork edge plus a small overscroll. The previous 8 % unreachable band is gone.
- **Preset isolation.** Switch to "Akkusparend" — `PAINTING_USE_PARALLAX`, `PAINTING_USE_SELFSHADOW`, `PAINTING_USE_DETAIL_NORMAL`, and `PAINTING_USE_GRAZING_BOOST` should all be excluded from the compiled fragment shader. Inspect via the browser DevTools `WEBGL_debug_shaders` if needed.
- **Cache isolation.** Switch from battery → high; new procedural maps should be generated at 1024 px, not reused from the 256 px battery cache.
- **Spot target sanity.** Lighting is anchored at world origin via the shared `spotTarget`; reposition the camera or animate the spot — the cone always points at the artwork.

Validation evidence:

1. albedo-only vs shaded comparison via `?debug=1` + `a` key,
2. matte default gallery render,
3. default render during pan/zoom (parallax relief cue visible on high preset),
4. raking-inspection render (brush ridges visible),
5. max-zoom relief quality at 1024 px procedural tile,
6. edge and corner pan reach,
7. `npm run lint` clean, `npm run build` clean (`customer-preview/freyraum-gallery.js` ≈ 552 KB / 141 KB gzip).

Fresh-clone audit note: in a brand-new checkout you must run `npm install` before the validation commands. The latest revalidation pass confirmed that after dependency installation both commands succeed; the current non-blocking outputs are the known `@typescript-eslint` TypeScript-version warning during lint and the Dart Sass legacy JS API deprecation warning during build.

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
