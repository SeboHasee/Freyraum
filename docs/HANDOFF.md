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


## v0.02 shader, lighting, and WebGPU review guide

v0.02 is a technical rendering pass with a finalised implementation plan. Future reviewers should evaluate two independent lanes:

**Lane 1 — Stable WebGL material realism:**
- `PaintingMaterial` (`src/materials/PaintingMaterial.ts`) extends `MeshPhysicalMaterial` via `onBeforeCompile`
- Shader variants: `painting-high` (7 texture reads), `painting-balanced` (5 reads), `painting-battery` (2 reads)
- Compile-time `#define` flags: `PAINTING_USE_DETAIL_NORMAL`, `PAINTING_USE_BUMP`, `PAINTING_USE_ROUGHNESS_MAP`, `PAINTING_USE_SPECULAR_MAP`, `PAINTING_USE_AO`, `PAINTING_USE_GRAZING_BOOST`
- Four light profiles in `src/lighting/LightProfile.ts`: `gallery-soft`, `raking-inspection`, `museum-neutral`, `dramatic-demo`
- Audited implementation rule: detail normals must be blended in tangent space before the Three.js normal transform; do not add tangent-space detail normals directly to the final view-space normal
- Audited implementation rule: `PaintingMaterial` must not own cached textures; texture ownership stays in `TextureManager` / `ProceduralTextureFactory`
- Audited implementation rule: rapid artwork navigation must be protected by an artwork-load token (or equivalent cancellation guard) so stale maps cannot be applied

**Lane 2 — Experimental WebGPU probe:**
- Activated by `?backend=webgpu` query param or `localStorage.setItem('freyraum.backend', 'webgpu-experimental')`
- Runs `initWebGPUPrototype()` via dynamic import; logs adapter info using a serializable probe-result shape; always falls back to WebGL
- Never used in the customer preview; clearly labeled experimental

**Benchmark procedure:**
1. Build and open `customer-preview/app.html` locally.
2. Add `?debug=material` to the URL to enable the `MaterialInspector` overlay.
3. The overlay shows active preset, shader variant, active map count, pixel ratio, anisotropy, and rolling FPS (1s/5s/30s). The overlay may exist as an async debug chunk in the build, but it must never be requested during normal preview use.
4. Test at least: idle front view, zoomed close inspection, panning while zoomed, rapid navigation.
5. Document device, browser, OS, and measured FPS for each preset in `FINDINGS.md`.

**Light profile comparison procedure:**
1. Switch to `raking-inspection` profile — surface relief should be clearly visible.
2. Switch to `museum-neutral` — flatter light, accurate colour, no dramatic highlights.
3. Switch to `gallery-soft` — current default; subtle slow oscillation.
4. Capture one close-up screenshot per profile under each test.


**Audit-critical release blockers:**
- No stale auxiliary maps after rapid navigation across all artworks
- No visible texture/material leak after repeated navigation and preset switching
- Reduced-motion mode freezes or meaningfully reduces highlight drift and inspection-light motion
- WebGPU probe failure always returns cleanly to the normal WebGL preview path

**Performance acceptance targets:**

| Device class | Target | Notes |
| --- | --- | --- |
| Mid-range discrete GPU | 60 FPS | Balanced preset, post-processing on, detail normal on. |
| High-end discrete GPU | 60 FPS | High preset, 1.8 DPR cap, full 7-map stack. |
| Old integrated GPU | 25 FPS minimum | Battery preset, 2 texture reads, no AO/grazing/detail normal. |

WebGPU must remain labeled experimental and optional until full parity and graceful fallback are verified across browser engines.

## Reserved future-pass items

The following items are intentionally not implemented in v0.01:

- Automated CI screenshot capture.
- Hosted CMS / remote asset CDN.
- WebGPU production renderer parity and VR path after the v0.02 experimental probe.
- Multilingual content pipeline and i18n.
- Analytics, telemetry, and persisted view positions.
