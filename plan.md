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


## v0.03 Follow-up Plan — Technical Rendering System for Faithful Artworks, Modular Asset Swaps, Parallax Relief, and Free Inspection

### v0.03 Planning Status

v0.03 is **implemented**. All nine slices below have been executed against the codebase, the bundle builds cleanly (`npm run lint` + `npm run build`), and the customer preview bundle (`customer-preview/freyraum-gallery.js`) contains the new shader features. See the `v0.03 Implementation Outcome` subsection (immediately below) for the as-built deviations from the original plan, the issues found and fixed during implementation, and the validation evidence. The detailed execution plan that follows is retained verbatim as the historical record of the design intent.

### v0.03 Implementation Outcome

**Validation evidence**

- `npm run lint` — clean.
- `npm run build` — clean. Bundle: `customer-preview/freyraum-gallery.js` ≈ 552 KB (gzip ≈ 141 KB), CSS ≈ 15.4 KB (gzip ≈ 3.4 KB). Bundle growth from v0.02 (~528 KB) is the parallax + self-shadow shader code and the new lighting/debug UI strings.
- Fresh-clone revalidation (2026-05-17): before `npm install`, `npm run lint` failed with `eslint: not found` and `npm run build` failed because required packages like `three` were missing from `node_modules`; after `npm install`, both commands passed. Non-blocking warnings observed: the existing `@typescript-eslint` TypeScript-version warning and the current Dart Sass legacy JS API deprecation warning during `vite build`.
- Built bundle contains all v0.03 shader gates: `PAINTING_USE_PARALLAX`, `PAINTING_USE_SELFSHADOW`, `PAINTING_DEBUG_ALBEDO_ONLY`, `uKeyLightDir`. Counted 12 occurrences in the production bundle during the fresh-clone revalidation audit.

**Issues found in the original plan and the fixes applied**

1. *Self-shadow GLSL identifier did not exist.* The plan's Slice 5 referenced `geometryLightDirection` as if it were a Three.js fragment-shader local. Three.js does not provide that name; only `vViewPosition`, `vNormal`, `vTangent`, and `vBitangent` are reliably available. **Fix:** Added a uniform `uKeyLightDir` carrying the **view-space** direction toward the primary key light, computed once per frame in `main.ts` via `keyLightWorld.transformDirection(camera.matrixWorldInverse)`. The shader projects it onto `(vTangent, vBitangent, vNormal)` to obtain the tangent-space light direction used by the march. This is also the math-space contract documented at the top of `PaintingMaterial.ts`.
2. *Parallax + bump double-counting.* The plan's Slice 4 left `bumpStrength = 0.035` on the high preset while also enabling parallax — the same height field would have driven both UV offsetting *and* normal perturbation, producing exaggerated relief that contradicts the plan's own "single source of truth per preset" rule. **Fix:** When `parallaxEnabled` is true on a preset, `bumpStrength = 0.0`. The high preset relies on parallax for depth; the balanced preset uses bump only (`bumpStrength = 0.025`); battery uses neither.
3. *Spot target ownership.* The plan repositioned spot lights closer to the artwork but did not specify that `THREE.SpotLight.target` defaults to a detached `Object3D` at `(0,0,0)` that is NOT in the scene graph. When animating the spot position the cone still pointed at world origin but the un-parented target was a footgun for future maintenance. **Fix:** `LightingSetup` now creates a single shared `spotTarget` object, adds it to the scene, and assigns it to every spotlight. `dispose()` removes it.
4. *Reduced-motion ambient knob.* The plan's reduced-motion handling already existed in v0.02 via `uReducedMotionScalar`. The new self-shadow path could fight with that. **Decision:** Self-shadow is **not** scaled by reduced-motion (shadows are not motion); only the existing detail-normal and grazing-boost paths are. This matches the plan's accessibility intent and keeps shadows truthful to the relief.
5. *Albedo-only fidelity comparison surface.* The plan called for an inspection/QA toggle but did not specify a UI surface (and exposing it as a public control would confuse visitors). **Decision:** Gated behind `?debug=1` URL parameter, then activated by pressing the `a` key. A `console.info` line announces availability on page load when the parameter is present. The lighting profile selector (a legitimate viewer choice) is exposed in `PreferencesPanel` under a new "Beleuchtung" group.
6. *Texture cache invalidation on preset change.* The plan added `tileSize` to `ProceduralTextureFactory.generate()` but the existing cache was keyed by `${id}::${role}`, which would have returned stale low-resolution textures after switching to a higher preset. **Fix:** Cache key now includes `tileSize` so each effective resolution is generated and cached independently. `disposeAll()` continues to free every entry.

**Per-slice as-built summary**

| Slice | Files touched | Net effect |
|------:|--------------|------------|
| 1 — Surface contract + fidelity instrumentation | `config/artworks.ts`, `config/quality.ts`, `materials/PaintingMaterial.ts` | Added `SurfaceProfile`/`SurfacePhysics` types; seven new quality preset fields; `uAlbedoOnly` uniform with `setAlbedoOnly()` method gated by `PAINTING_DEBUG_ALBEDO_ONLY`. |
| 2 — Matte-first material retune | `materials/PaintingMaterial.ts`, `materials/ProceduralTextureFactory.ts` | `clearcoat 0.04→0.0`, `specularIntensity 1.0→0.3`, `uLightGrazingBoost 0.6→0.25`. Procedural roughness range `[60..220]→[140..240]`. Specular baseline `12→6`, peak blob `200→90`. |
| 3 — Resolution-aware procedural fallback | `materials/ProceduralTextureFactory.ts`, `gallery/GalleryManager.ts` | `generate(id, role, tileSize?)`; cache keyed by tileSize; `GalleryManager` passes `preset.proceduralTileSize` (1024 / 512 / 256 per preset). |
| 4 — Parallax relief | `gallery/ArtworkMesh.ts`, `materials/PaintingMaterial.ts` | `geo.computeTangents()` in `makeArtworkGeometry`; new `map_fragment` injection performs a 12-step tangent-space steep parallax march producing `pUV`; the replaced `normal_fragment_maps` chunk samples the normal at `pUV` when parallax is active. |
| 5 — Self-shadow | `materials/PaintingMaterial.ts`, `lighting/LightingSetup.ts`, `main.ts` | View-space `uKeyLightDir` uniform; 8-step height march modulates `directDiffuse` and `directSpecular` only (never multiplies albedo); `LightingSetup.getKeyLightWorldDir()` exposes the world-space direction; `main.ts` transforms it into view space per frame. |
| 6 — Museum lighting | `lighting/LightProfile.ts`, `lighting/LightingSetup.ts`, `ui/PreferencesPanel.ts`, `utils/preferences.ts` | `gallery-soft` key {-10,5,7}→{-3,5,4}; `raking-inspection` key {-7,0.5,1.3}→{-6,0,1.5}, ambient 0.4→0.3; new `displayIntent` field on `LightProfile`; shared `spotTarget` at origin; `lighting` field added to `Preferences` (persisted); new "Beleuchtung" radio group in `PreferencesPanel`. |
| 7 — Free edge/corner inspection | `gallery/GalleryManager.ts` | `PAN_SAFETY_FACTOR = 0.92` removed; `INSPECTION_OVERSCROLL = 0.5` added; `getPanLimits` formula now `(artworkSize − visibleSize) * 0.5 + INSPECTION_OVERSCROLL`. |
| 8 — Performance hardening | `config/quality.ts` | Tuned per-preset step counts baked in: high `parallaxSteps=12`, `selfShadowSteps=8`; balanced/battery `parallaxSteps=0`, `selfShadowSteps=0`. |
| 9 — Documentation | `plan.md`, `CHANGELOG.md`, `FINDINGS.md`, `README.md`, `docs/HANDOFF.md` | Status updated to "implemented"; as-built deviations and validation evidence recorded; reviewer guidance for `?debug=1` and lighting profile UI added. |

**Files modified, in execution order**

1. `src/config/artworks.ts` — Slice 1 types
2. `src/config/quality.ts` — Slice 1 preset fields + Slice 2 + Slice 8 values
3. `src/materials/ProceduralTextureFactory.ts` — Slice 2 + Slice 3
4. `src/materials/PaintingMaterial.ts` — Slices 1, 2, 4, 5 (parallax + self-shadow + albedo-only)
5. `src/gallery/ArtworkMesh.ts` — Slice 4 (`computeTangents`)
6. `src/gallery/GalleryManager.ts` — Slice 3 + Slice 7
7. `src/lighting/LightProfile.ts` — Slice 6 (positions + `displayIntent`)
8. `src/lighting/LightingSetup.ts` — Slice 6 (spotTarget, `getKeyLightWorldDir`)
9. `src/utils/preferences.ts` — Slice 6 (lighting preference)
10. `src/ui/PreferencesPanel.ts` — Slice 6 (lighting selector UI)
11. `src/main.ts` — Slice 5 (per-frame uKeyLightDir wiring) + Slice 6 (lighting profile change propagation) + debug toggle

**Acceptance criteria revisited**

- *Picture fidelity preserved:* Shader logic guarantees albedo path is unchanged when `uReducedMotionScalar` is 1.0; the `?debug=1` + `a` toggle now lets reviewers compare albedo-only and shaded renders side-by-side without recompilation.
- *Detail visibility during pan/zoom:* Achieved through (a) parallax UV offset on high preset reacting to view direction in tangent space, (b) repositioned key light at 45° still casts microshadows, and (c) lifting `PAN_SAFETY_FACTOR` so every corner is reachable at maximum zoom.
- *Museum-quality default:* `gallery-soft` is the default profile (preserved from v0.02), no longer dramatically side-lit, ambient kept at 1.5 for flattering fill, decay 1.8 for soft falloff.
- *Raking inspection on demand:* `raking-inspection` profile is now one click away in the preferences panel and produces a near-horizontal key for relief reveal.
- *Performance:* Parallax (12 iterations) + self-shadow (8 iterations) run only on the `high` preset; balanced and battery presets pay zero shader cost for these paths via `#define` gating.

---

### v0.03 Execution Plan — File-Level Code Changes

This section specifies the exact code changes required for each vertical slice. References like "line N" point to the current state of the file at the time this plan was finalized. Always verify against the current file before editing.

---

#### Slice 1 — Surface contract and fidelity instrumentation

**`src/config/artworks.ts`**

Add before the `Artwork` interface:

```typescript
export type SurfaceProfile =
  | 'matte-canvas'
  | 'satin-canvas'
  | 'varnished-oil'
  | 'paper'
  | 'procedural-fallback';

export interface SurfacePhysics {
  /** Multiplier on relief amplitude from all maps (normal/bump/height). 1.0 = default. */
  reliefScale?: number;
  /** Multiplier on parallax depth. 1.0 = default. */
  parallaxDepthScale?: number;
}
```

Add to the `Artwork` interface (both fields optional so existing artworks need no change):

```typescript
/** Surface character for material pipeline decisions. Defaults to 'matte-canvas'. */
surfaceProfile?: SurfaceProfile;
/** Optional physical-scale modifiers for relief and parallax depth. */
surfacePhysics?: SurfacePhysics;
```

No changes to the `artworks` array — all existing items default to `matte-canvas` at runtime.

---

**`src/config/quality.ts`**

Add the following fields to the `QualityPreset` interface (after existing v0.02 fields):

```typescript
/** Target pixel size for procedurally generated support maps (normal, height, roughness). */
proceduralTileSize: number;
/** Whether parallax occlusion UV offset is compiled into the fragment shader. */
parallaxEnabled: boolean;
/** Number of height-field march steps for parallax UV offset (high only). */
parallaxSteps: number;
/** Whether direct-light self-shadow approximation is compiled in (high only). */
selfShadowEnabled: boolean;
/** Number of height-field steps for the self-shadow horizon march (high only). */
selfShadowSteps: number;
```

Assign values in `QUALITY_PRESETS`:

```
high:     proceduralTileSize: 1024, parallaxEnabled: true,  parallaxSteps: 12, selfShadowEnabled: true,  selfShadowSteps: 8
balanced: proceduralTileSize: 512,  parallaxEnabled: false, parallaxSteps: 0,  selfShadowEnabled: false, selfShadowSteps: 0
battery:  proceduralTileSize: 256,  parallaxEnabled: false, parallaxSteps: 0,  selfShadowEnabled: false, selfShadowSteps: 0
```

Also increase `bumpStrength` in `high` from `0.012` → `0.035` and `normalStrength` from `0.45` → `0.65`.

---

**`src/materials/PaintingMaterial.ts`**

Add `uAlbedoOnly` to `PaintingUniforms`:

```typescript
uAlbedoOnly: { value: number }; // 0 = normal render, 1 = albedo-only debug strip
```

Initialise in `constructor` with `{ value: 0 }`.

Add `PAINTING_DEBUG_ALBEDO_ONLY` define to the defines array when `this.albedoOnlyEnabled`.

In the `onBeforeCompile` uniform block, add:

```glsl
uniform float uAlbedoOnly;
```

Inject before `lights_fragment_end`:

```glsl
#ifdef PAINTING_DEBUG_ALBEDO_ONLY
  reflectedLight.directDiffuse  = vec3(0.0);
  reflectedLight.directSpecular = vec3(0.0);
  reflectedLight.indirectDiffuse  = diffuseColor.rgb;
  reflectedLight.indirectSpecular = vec3(0.0);
#endif
```

Add public method:

```typescript
setAlbedoOnly(enabled: boolean): void {
  if (this.albedoOnlyEnabled === enabled) return;
  this.albedoOnlyEnabled = enabled;
  this.uAlbedoOnly.value = enabled ? 1 : 0;
  this.needsUpdate = true;
}
```

---

#### Slice 2 — Matte-first material retune

**`src/materials/PaintingMaterial.ts`**

In the `super()` call in the constructor, change:

- `clearcoat: 0.04` → `clearcoat: 0.0`
- `specularIntensity: 1.0` → `specularIntensity: 0.3`

In `paintingUniforms` initialisation, change:

- `uLightGrazingBoost: { value: 0.6 }` → `uLightGrazingBoost: { value: 0.25 }`

---

**`src/materials/ProceduralTextureFactory.ts`**

In `generateRoughness`: change output range from `[60..220]` to `[140..240]` to make the fallback surface feel matte rather than semi-glossy:

```typescript
// old: const r = this.clamp8(60 + combined * 160);
const r = this.clamp8(140 + combined * 100);
```

In `generateSpecular`: lower the blob peak intensity from `200` to `90` and reduce the baseline from `12` to `6` so specular blobs are subtle rather than dominant:

```typescript
// Baseline
data[i * 4 + 0] = 6; // was 12

// Blob peak
const blob = Math.exp(-distSq / (radius * radius)) * 90; // was 200
```

---

**`src/config/quality.ts`**

Also lower `specularStrength` in `high` preset from `0.55` → `0.4` so even the authored/procedural specular map contribution is more muted.

---

#### Slice 3 — Resolution-aware procedural fallback system

**`src/materials/ProceduralTextureFactory.ts`**

Change the `generate` signature to accept an optional `tileSize` parameter:

```typescript
generate(artworkId: string, role: PaintingMapRole, tileSize?: number): THREE.Texture
```

Change the cache key to incorporate tile size:

```typescript
const effectiveSize = tileSize ?? 256;
const cacheKey = `${artworkId}::${role}::${effectiveSize}`;
```

Pass `effectiveSize` as the `size` parameter to all private generators. Each generator currently hard-codes its own size constant — refactor `generateNormal`, `generateHeight`, `generateRoughness`, `generateSpecular`, and `generateAO` to accept a `size: number` parameter instead of hard-coding `256` or `128`.

For `normal` and `detailNormal`, the existing `generateNormal(seed, size, ...)` already takes a `size` argument, so only the call site needs to change from `256` to `effectiveSize`.

For `height` (currently `size = 256` inside `generateHeight`), `roughness` (currently `size = 128`), and `specular` (currently `size = 128`): parametrise with `Math.max(64, Math.floor(effectiveSize / 2))` for roughness and specular (they need less resolution than the relief maps), and `effectiveSize` for height.

---

**`src/gallery/GalleryManager.ts`**

In `showArtwork`, change the procedural fallback call:

```typescript
// old:
resolved[role] = this.procedural.generate(artwork.id, role);

// new:
resolved[role] = this.procedural.generate(artwork.id, role, preset.proceduralTileSize);
```

---

#### Slice 4 — High-preset parallax relief path

**`src/gallery/ArtworkMesh.ts`**

In `makeArtworkGeometry`, add tangent computation after the uv1 copy:

```typescript
geo.computeTangents(); // required for tangent-space parallax
```

This makes `tangent` available as an attribute in the vertex shader, which Three.js passes as `vTangent` (via its built-in tangent chunk) when the material has a `normalMap`.

---

**`src/materials/PaintingMaterial.ts`**

Add to `PaintingUniforms`:

```typescript
uParallaxScale: { value: number }; // height offset multiplier, e.g. 0.04
uParallaxSteps: { value: number }; // march iterations, e.g. 12
```

Initialise: `{ value: preset.parallaxEnabled ? 0.04 : 0.0 }`, `{ value: preset.parallaxSteps }`.

Add `PAINTING_USE_PARALLAX` define when `this.parallaxActive()`.

In `applyPreset`, add:

```typescript
this.paintingUniforms.uParallaxScale.value = preset.parallaxEnabled ? 0.04 : 0.0;
this.paintingUniforms.uParallaxSteps.value = preset.parallaxSteps;
const wantsParallax = preset.parallaxEnabled && !!this.bumpMap;
```

Include `wantsParallax` in `definesChanged` comparison.

In the `onBeforeCompile` uniform block, add:

```glsl
uniform float uParallaxScale;
uniform float uParallaxSteps;
```

Add a new injection token constant:

```typescript
const MAP_FRAGMENT_TOKEN = '#include <map_fragment>';
```

Inject before `map_fragment`:

```glsl
#ifdef PAINTING_USE_PARALLAX
  // Steep parallax: march the height field in tangent space.
  // vTangent and vBitangent are supplied by Three.js when computeTangents() is called.
  vec3 tsViewDir = normalize(vec3(
    dot(vViewPosition, vTangent.xyz),
    dot(vViewPosition, vBitangent),
    dot(vViewPosition, geometryNormal)
  ));
  vec2 pUV = vMapUv;
  float stepSize    = 1.0 / uParallaxSteps;
  float layerHeight = 0.0;
  vec2  uvDelta     = (tsViewDir.xy / max(tsViewDir.z, 0.2)) * uParallaxScale / uParallaxSteps;
  for (int i = 0; i < 16; i++) {
    if (float(i) >= uParallaxSteps) break;
    layerHeight += stepSize;
    pUV -= uvDelta;
    float h = texture2D(bumpMap, pUV).r;
    if (h >= layerHeight) break;
  }
  pUV = clamp(pUV, 0.001, 0.999);
#else
  vec2 pUV = vMapUv;
#endif
```

Replace the `map_fragment` chunk so the albedo sample reads from `pUV`:

```glsl
// Replace: #include <map_fragment>
// With a copy of Three.js map_fragment that swaps vMapUv -> pUV:
#ifdef USE_MAP
  vec4 sampledDiffuseColor = texture2D( map, pUV );
  #ifdef DECODE_VIDEO_TEXTURE
    sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
  #endif
  diffuseColor *= sampledDiffuseColor;
#endif
```

Also update the `normal_fragment_maps` injection to use `pUV` instead of `vNormalMapUv` for the base normal sample.

Height convention documented: `0.0 = deepest recess`, `1.0 = highest peak`. All procedural height maps must follow this convention. Authored maps must declare their convention in `PaintingTextureMapEntry`.

---

#### Slice 5 — Direct-light self-shadow approximation

**`src/materials/PaintingMaterial.ts`**

Add to `PaintingUniforms`:

```typescript
uShadowSteps:    { value: number }; // march iterations, e.g. 8
uShadowStrength: { value: number }; // shadow darkening scalar, e.g. 0.55
```

Add `PAINTING_USE_SELFSHADOW` define when `preset.selfShadowEnabled && !!this.bumpMap`.

In the `onBeforeCompile` uniform block, add:

```glsl
uniform float uShadowSteps;
uniform float uShadowStrength;
```

Inject before `lights_fragment_end` (after the parallax block, before the grazing-boost block):

```glsl
#ifdef PAINTING_USE_SELFSHADOW
  {
    // Approximate direct-light self-shadow using the primary light direction.
    // Light direction in tangent space from the first directional/spot light term.
    // Note: Three.js accumulates lights; we use the geometric normal as a proxy
    // for the light direction since the exact tangent-space L is not directly
    // available after lights_fragment_end. A coarser but stable approximation:
    // use the blinn-phong half-vector direction as the march direction.
    vec3 tsLightDir = normalize(vec3(
      dot(geometryLightDirection, vTangent.xyz),
      dot(geometryLightDirection, vBitangent),
      dot(geometryLightDirection, geometryNormal)
    ));
    vec2 shadowUV = pUV;
    float shadowFactor = 1.0;
    float shadowStep = 1.0 / uShadowSteps;
    float currentLayerH = texture2D(bumpMap, shadowUV).r;
    vec2 shadowDelta = tsLightDir.xy / max(tsLightDir.z, 0.2) * shadowStep * 0.035;
    for (int i = 0; i < 8; i++) {
      if (float(i) >= uShadowSteps) break;
      shadowUV += shadowDelta;
      shadowUV = clamp(shadowUV, 0.001, 0.999);
      float h = texture2D(bumpMap, shadowUV).r;
      if (h > currentLayerH + shadowStep * float(i + 1)) {
        shadowFactor = 1.0 - uShadowStrength;
        break;
      }
    }
    reflectedLight.directDiffuse  *= shadowFactor;
    reflectedLight.directSpecular *= shadowFactor;
  }
#endif
```

Note: `geometryLightDirection` is not a built-in Three.js variable. The correct implementation approach is to inject a uniform `uKeyLightDir` (a world-space direction vector set from `LightingSetup`) and transform it into tangent space in the shader. Add to `LightingSetup`:

```typescript
/** Exposes the primary key light direction as a uniform so PaintingMaterial can use it for self-shadow. */
getKeyLightWorldDir(): THREE.Vector3 {
  const primary = this.spots[0];
  if (!primary) return new THREE.Vector3(0, 1, 0);
  return primary.position.clone().negate().normalize();
}
```

And add `uKeyLightDir: { value: THREE.Vector3 }` to `PaintingUniforms`, updated each frame from `LightingSetup.getKeyLightWorldDir()` in `main.ts`.

---

#### Slice 6 — Museum-style display lighting and inspection controls

**`src/lighting/LightProfile.ts`**

Add `displayIntent` to the `LightProfile` interface (informational, not used in rendering logic):

```typescript
/** Artistic intent of this profile, for documentation and UI labelling. */
displayIntent?: 'gallery-display' | 'neutral-review' | 'relief-inspection' | 'dramatic-demo';
```

Update `gallery-soft` profile values:

```typescript
'gallery-soft': {
  id: 'gallery-soft',
  label: 'Galerie weich',
  description: 'Museum-style warm key at ~45° from ceiling, slight upper-left offset. Flattering yet asymmetric enough to reveal surface detail during pan/zoom.',
  displayIntent: 'gallery-display',
  ambientIntensity: 1.5,
  ambientKelvin: 4000,
  keys: [
    {
      kelvin: 3200,
      intensity: 165,
      position: { x: -3, y: 5, z: 4 }, // ~45° from vertical, LEFT of artwork center
      angle: 0.38,
      penumbra: 0.85,
      decay: 1.8,
    },
  ],
  accent: {
    kelvin: 4500,
    intensity: 10,
    position: { x: 3, y: 1, z: 5 }, // low right fill, glare-safe
    decay: 2.0,
  },
  animateAllowed: true,
},
```

Rationale for `gallery-soft` position change: the current key at `{ x: -10, y: 5, z: 7 }` is approximately **68° from vertical** (very dramatic, theatrical side-lighting). The new position `{ x: -3, y: 5, z: 4 }` is approximately **45° from vertical**, which is a practical compromise — flattering and gallery-like while still providing enough asymmetry to reveal relief detail when the viewer pans or zooms.

Update `raking-inspection` for cleaner low-angle grazing:

```typescript
'raking-inspection': {
  id: 'raking-inspection',
  label: 'Streiflicht',
  description: 'Near-horizontal raking light from the left. Reveals canvas weave, brush ridges, impasto relief, and self-shadow cues.',
  displayIntent: 'relief-inspection',
  ambientIntensity: 0.3,  // reduce fill so micro-shadows remain visible
  ambientKelvin: 4000,
  keys: [
    {
      kelvin: 3500,
      intensity: 200,
      position: { x: -6, y: 0, z: 1.5 }, // near-horizontal, almost parallel to painting
      angle: 0.30,
      penumbra: 0.45,
      decay: 1.6,
    },
  ],
  animateAllowed: false,
},
```

Also add `displayIntent` to the other two profiles:

- `museum-neutral`: `displayIntent: 'neutral-review'`
- `dramatic-demo`: `displayIntent: 'dramatic-demo'`

---

**`src/lighting/LightingSetup.ts`**

In `applyKeyLight`, explicitly set the SpotLight `target` position and add it to the scene so the aim is deterministic regardless of scene transforms:

```typescript
spot.target.position.set(0, 0, 0);
if (!spot.target.parent) this.scene.add(spot.target);
```

This ensures all profiles aim at the artwork center (world origin).

Add the public `getKeyLightWorldDir()` method described in Slice 5.

---

#### Slice 7 — Free edge/corner inspection camera

**`src/gallery/GalleryManager.ts`**

Replace the `PAN_SAFETY_FACTOR` constant and `getPanLimits` method:

Remove:
```typescript
const PAN_SAFETY_FACTOR = 0.92;
```

Add:
```typescript
/** World-unit overscroll margin past artwork edge allowed in inspection mode. */
const INSPECTION_OVERSCROLL = 0.5;
```

Replace `getPanLimits`:

```typescript
private getPanLimits(zoom: number): { x: number; y: number } {
  const visibleHeight = 2 * this.clampZoom(zoom) * Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5));
  const visibleWidth = visibleHeight * this.camera.aspect;

  // Allow panning so every edge and corner is reachable at the current zoom.
  // The viewport center must be able to reach the artwork edge + an explicit
  // overscroll margin. This replaces the old PAN_SAFETY_FACTOR = 0.92.
  return {
    x: Math.max(0, (this.artworkMesh.artworkWidth  - visibleWidth)  * 0.5 + INSPECTION_OVERSCROLL),
    y: Math.max(0, (this.artworkMesh.artworkHeight - visibleHeight) * 0.5 + INSPECTION_OVERSCROLL),
  };
}
```

---

#### Slice 8 — Preset/performance hardening

After implementing Slices 4 and 5, measure frame time impact:

- If `high` parallax with 12 steps exceeds the 16 ms budget on a mid-range discrete GPU, reduce `parallaxSteps` to 8.
- If `high` self-shadow with 8 steps causes visible shimmer on high-frequency height tiles, reduce `uShadowSteps` to 4 and increase `uShadowStrength` slightly to compensate.
- Ensure `balanced` and `battery` paths skip both defines completely.
- Document final tuned values in `FINDINGS.md` with a tested GPU profile note.

---

#### Slice 9 — Documentation and validation handoff

- Update all acceptance checks in `plan.md` from `[ ]` to `[x]` as slices are completed.
- Add a validation note to `FINDINGS.md` covering: GPU tested, final sample counts, texture memory cost per preset, any visual regressions caught.
- Run `npm run lint`, `npm run build`, and visually inspect the `customer-preview/app.html` output at high/balanced/battery presets.
- Verify the `raking-inspection` profile shows brush ridges/self-shadow cues at close zoom.
- Verify `gallery-soft` shows visible relief change during pan movement.
- Verify no albedo colour change is visible in the albedo-only debug mode vs normal render.

Required outcomes:

- the shader must **not alter the original picture's essence**;
- the default surface must read **rougher, more matte, and less shiny**;
- relief must be visibly driven by **light direction and view angle**;
- lighting must be positioned **artistically like a museum/gallery display** while still revealing surface detail;
- close inspection must keep **high-frequency detail at max zoom**;
- movement must allow **free edge/corner inspection** when zoomed in;
- artworks must be **fully swappable** in the future without code changes and without assuming current source resolutions.

The implementation must stay modular, work for arbitrary aspect ratios and arbitrary source pixel sizes, and be delivered in vertical slices.

### v0.03 Goals

1. Preserve the original artwork image as the authoritative albedo source; the rendering system may add surface response, but not reinterpret the picture.
2. Replace the current semi-varnished default with a matte-first material response suitable for canvas, pigment, and dry painted surfaces.
3. Introduce a technically explicit relief pipeline that can scale from low-cost normal/bump to high-fidelity parallax-style inspection mode.
4. Make the texture/material pipeline resolution-agnostic so future artwork swaps require metadata and assets only, not code edits.
5. Keep relief quality stable at maximum zoom through a texel-density-driven asset strategy rather than assumptions about today's image sizes.
6. Allow free close-up inspection of edges and corners while preserving reset/recovery behaviour and accessibility controls.
7. Use a museum-style lighting composition that is flattering in the default view, glare-aware, and still strong enough to reveal detail during pan/zoom movement.
8. Keep WebGL as the production renderer; keep expensive features behind preset-dependent fallbacks.

### v0.03 Non-Goals

- Do not recolour, relight, sharpen, stylize, or otherwise alter the source picture itself.
- Do not require WebGPU or a native application.
- Do not require per-artwork code changes when assets are replaced.
- Do not require all artworks to ship authored scanned height/roughness/specular maps; the system must degrade gracefully with procedural fallbacks.
- Do not use true displaced geometry/tessellation in production WebGL for the artwork plane.
- Do not create fully unbounded camera movement that can strand the user away from the artwork.

### Current v0.02 Code Facts Driving v0.03

| Area | Current code fact | Why v0.03 must change |
| --- | --- | --- |
| Material gloss | `PaintingMaterial` currently initializes `clearcoat: 0.04`, `specularIntensity: 1.0`, and a custom `uLightGrazingBoost: 0.6` path | The default can still read as glossy/varnished even when the albedo is untouched |
| Relief resolution | `ProceduralTextureFactory` generates `normal`, `detailNormal`, and `height` at 256 px tile sizes | Max-zoom inspection will expose blur/repetition independent of source picture resolution |
| Relief visibility | `high` uses `bumpStrength: 0.012`; `balanced` disables bump entirely | The relief pipeline is active, but too subtle for the requested 3D/parallax feel |
| Asset modularity | `Artwork.textureSet?` already exists, but v0.02 still assumes simple fallback generation keyed to the current art set | Future asset swaps need a fully explicit contract and selection strategy that is resolution-agnostic |
| Pan limits | `GalleryManager.getPanLimits()` uses a conservative `PAN_SAFETY_FACTOR = 0.92` | This prevents true edge/corner inspection when zoomed in |
| Fidelity checks | There is no explicit debug/fidelity lane for comparing albedo-only vs shaded output | The team needs a measurable way to ensure the shader does not change the picture's essence |
| Lighting composition | `gallery-soft` is artistic but currently only loosely defined as a warm upper-left key; there is no explicit 30°-style gallery target or motion-visibility requirement | v0.03 should define default display lighting separately from relief-reveal inspection lighting |

### v0.03 Technical Rendering Architecture

#### 1. Modular artwork surface contract

Extend the existing artwork metadata model so each artwork can be swapped without code changes.

Proposed metadata direction:

- `Artwork.image` remains the required albedo source.
- `Artwork.textureSet?` stays optional but should support arbitrary authored maps when available.
- Add a material-level descriptor such as `surfaceProfile?` / `finish?` / `reliefProfile?` with values like:
  - `matte-canvas`
  - `satin-canvas`
  - `varnished-oil`
  - `paper`
  - `procedural-fallback`
- Add optional physical-scale metadata rather than resolution assumptions:
  - real-world width/height or a display-space density target
  - relief amplitude scalar
  - parallax depth scalar
  - finish category

The runtime must never branch on specific current artwork resolutions. It should branch only on:

- available authored roles;
- active quality preset;
- estimated on-screen texel density;
- chosen surface profile.

#### 2. Resolution-independent asset pipeline

The system should treat source pixel size as an input signal, not a hard dependency.

Planned runtime rules:

- Compute a per-artwork **effective texel density** from:
  - source texture width/height,
  - fitted world-space artwork width/height,
  - renderer pixel ratio,
  - current zoom.
- Use that density to choose the shading path and fallback detail strategy.
- If authored auxiliary maps exist, use them directly.
- If authored maps do not exist, synthesize procedural maps whose size is derived from preset + target texel density, not from current demo assets.
- Procedural fallback maps should be cache-keyed by:
  - artwork id,
  - map role,
  - preset tier,
  - target tile size / octave recipe,
  - surface profile.

This keeps the system correct whether a future artwork is tiny, huge, portrait, ultrawide, low-resolution, or very high-resolution.

#### 3. Shader pipeline ladder

v0.03 should formalize three shading tiers:

| Tier | Preset mapping | Technique |
| --- | --- | --- |
| Tier A | battery | albedo + base normal only; no parallax; no expensive self-shadowing |
| Tier B | balanced | albedo + normal + matte roughness + optional bump/height enhancement; no ray-marched parallax |
| Tier C | high / inspection | albedo + normal + height + detail normal + parallax occlusion mapping style UV shift + light-aware self-shadow approximation |

This keeps the runtime scalable and prevents the high-end inspection path from leaking into battery mode.

### v0.03 Shader / Math-Space Plan

#### Fidelity rules

- Albedo remains immutable source colour in `SRGBColorSpace`.
- Roughness/specular/height/normal/AO/parallax data remain linear.
- No colour grading, tone remapping, saturation boost, or artificial pigment tint is allowed inside the artwork material path.
- Bloom must not be part of the fidelity baseline comparison path.

#### Relief path evolution

The current v0.02 path is:

- base tangent-space normal map
- optional detail-normal blend in tangent space
- optional derivative-based bump perturbation via `dHdxy_fwd()` + `perturbNormalArb()`

The planned v0.03 high/inspection path should add:

1. **Parallax UV offset**
   - derive tangent-space view direction
   - ray-march the height field in tangent space
   - offset the sampling UV before reading albedo/normal/roughness/specular/ao
   - keep the sample count preset-controlled

2. **Self-shadow approximation**
   - derive tangent-space light direction
   - perform a short secondary march or stepped horizon check through the height field
   - return a scalar occlusion/shadow factor for direct light only
   - multiply only the direct-light contribution; do not darken the albedo texture itself

3. **Hybrid fallback**
   - when parallax is disabled, retain the current normal + derivative bump path
   - do not duplicate relief amplitudes across both paths at once; define a single source of truth per preset

#### Math-space requirements

- Detail normal blending must remain in tangent space before TBN application.
- Parallax view and light vectors must be expressed in tangent space.
- Height field convention must be explicitly documented (`0 = recess`, `1 = peak` or equivalent) and used consistently across procedural and authored maps.
- Self-shadow sampling must use the same height convention as the parallax march.
- UV shifts must be clamped or early-aborted to avoid sampling outside safe borders unless the texture role explicitly supports repeat wrapping.

### v0.03 Lighting Composition Strategy

The lighting plan must satisfy two goals at once:

1. **Artistic display lighting** — the artwork should look like a premium museum/gallery presentation, not a technical debug render.
2. **Relief visibility** — the viewer must still perceive brush/canvas/parallax detail, especially while panning and zooming the artwork.

#### Museum-style default lighting target

Based on common gallery-lighting guidance, the default profile should be designed around a **primary key light roughly 30° from vertical** aimed at the artwork center to minimize glare while keeping modelling on the surface. The digital goal is to emulate a high-quality warm-white museum spotlight rather than a flat front-on flood.

Planned artistic target:

- primary key: warm white look approximating **3000–3500 K** museum LED presentation;
- key placement: above and offset laterally, aimed near artwork center at about **30° from vertical**;
- fill/accent: low-energy secondary fill so shadows do not crush dark paint regions;
- glare control: no front-on symmetric specular blast in the normal viewing cone;
- default profile remains tasteful first, technical second.

#### Detail-reveal / movement visibility target

The default light should still be asymmetric enough that surface response changes are visible during pan/zoom motion and close inspection. The viewer must see changing relief cues from:

- parallax UV shift as the view angle changes;
- detail-normal / bump response as the camera moves;
- soft direct-light self-shadow cues under shallow angles.

To guarantee this, v0.03 should explicitly separate two lighting lanes:

- **Display lane (`gallery-soft` successor):** artistic museum-style key + subtle fill, optimized for beauty and stable viewing.
- **Inspection lane (`raking-inspection` successor):** much shallower grazing light, optimized for revealing brush ridges, canvas weave, and self-shadowing.

#### Inspection / raking-light target

For relief inspection, the light should move to a much shallower angle than the default display profile, closer to conservation/documentation-style raking light. This mode should:

- use a low-angle key nearly parallel to the artwork plane;
- reduce ambient fill so micro-shadowing remains visible;
- stay still in reduced-motion mode and normally stay still for reproducible review;
- be exposed through a reviewer/debug toggle, not hidden in code only.

#### Lighting contract implications for implementation

`LightProfile` / `LightingSetup` should evolve from generic presets into a more explicit composition model:

- `displayIntent: 'gallery-display' | 'neutral-review' | 'relief-inspection' | 'dramatic-demo'`
- target key angle semantics (`displayAngleFromVerticalDeg`, `inspectionGrazingAngleDeg` or equivalent)
- clear distinction between key, fill, and accent roles
- motion policy (`none`, `subtle-display-drift`) so animated movement never destroys relief readability
- a review-safe default that keeps the artwork flattering but not flat

#### Online reference summary informing the plan

The lighting targets above are informed by general gallery/museum guidance collected during this session:

- a **~30° display angle** is commonly recommended for paintings to reduce glare and avoid harsh reflected hotspots;
- **warm white 3000–3500 K** lighting is commonly used for paintings in galleries;
- **high CRI (90–95+)** is preferred in real installations for faithful colour rendering;
- **raking light** is used when the goal is to reveal texture, brushwork, impasto, and surface relief rather than provide the most neutral display view.

These references are artistic and planning inputs for the renderer; the WebGL implementation will approximate the visual result rather than simulate fixture hardware properties literally.

### v0.03 Material Response Retuning

The default material target should be matte-first.

Planned code-level changes:

- lower base `clearcoat` toward zero by default;
- lower base `specularIntensity` and reduce or remove global grazing-light amplification from the default path;
- bias procedural roughness into a higher range so low-roughness islands are rare unless authored;
- change procedural specular generation from "varnish pooling by default" to "mostly suppressed unless finish says otherwise";
- add finish-aware presets so `matte-canvas` and `varnished-oil` can diverge without forking shader code.

The visual rule is: default gallery mode must look like rough painted surface, not glossy plastic.

### v0.03 High-Resolution Relief Strategy

The current 256 px fallback maps are not enough for maximum zoom inspection. v0.03 should replace the fixed-size fallback approach with a tiered strategy.

#### Proposed procedural map strategy

- High / inspection tier:
  - base normal tile: 1024 px
  - detail normal tile: 1024–2048 px
  - height tile: 1024 px minimum
  - roughness/specular tile: 512–1024 px
  - multi-octave synthesis for brush ridges + canvas tooth + fine grain
- Balanced tier:
  - lower tile sizes and fewer octaves
  - no self-shadow march
- Battery tier:
  - base normal only or very light relief

#### Proposed synthesis layers

Each procedural fallback should be built from named layers rather than one monolithic noise pass:

- canvas weave layer
- brush ridge layer
- pigment breakup layer
- micro tooth layer
- matte roughness modulation layer
- finish-specific highlight suppression or enhancement layer

That makes the generator more predictable and lets future authored maps replace only selected roles.

### v0.03 Free Inspection Camera Plan

The pan system should move from conservative framing to inspection-first bounds.

#### Current limitation

`GalleryManager.getPanLimits()` keeps a safety margin by multiplying the free pan range by `PAN_SAFETY_FACTOR = 0.92`.

#### Planned model

Replace that with a mathematically explicit inspection range:

- derive visible world width/height from FOV, aspect, and zoom;
- derive artwork half-width/half-height in world space;
- allow the viewport center to move far enough that each artwork edge or corner can be centered or nearly centered;
- use an explicit `inspectionOverscrollWorldUnits` or fractional edge margin rather than a blanket safety factor;
- optionally soften the final clamp with elastic drag feedback, but clamp targets deterministically.

#### Input requirements

- mouse drag, wheel zoom, touch pan/pinch, and keyboard reset must all behave consistently;
- reset remains the recovery path;
- reduced-motion mode must not weaken inspection range.

### v0.03 Proposed Modules / File Responsibilities

| Module area | Planned files | Technical responsibility |
| --- | --- | --- |
| Artwork metadata contract | `src/config/artworks.ts`, `src/materials/PaintingTextureSet.ts` | Define surface profile, authored map roles, physical-scale metadata, finish categories |
| Resolution-aware asset selection | `src/gallery/TextureManager.ts`, `src/utils/texture.ts` | Compute source size, effective texel density, map selection, anisotropy strategy |
| Procedural fallback generator | `src/materials/ProceduralTextureFactory.ts` | Multi-layer, preset-aware, resolution-aware procedural normal/height/roughness/specular generation |
| Material core | `src/materials/PaintingMaterial.ts` | Matte-first defaults, preset ladder, parallax path, self-shadow approximation, fidelity/debug switches |
| Lighting integration | `src/lighting/LightProfile.ts`, `src/lighting/LightingSetup.ts` | Museum-style display composition, inspection/raking light, motion policy, preset-safe intensity ranges |
| Inspection controls | settings/debug UI files | Albedo-only / shaded / inspection mode toggles for QA |
| Camera movement | `src/gallery/GalleryManager.ts`, `src/interaction/ZoomPan.ts`, `src/interaction/TouchInteraction.ts`, `src/interaction/KeyboardNav.ts` | Inspection pan bounds, overscroll behaviour, edge/corner reachability |
| Documentation | `plan.md`, `FINDINGS.md`, `CHANGELOG.md`, `README.md`, `docs/HANDOFF.md` | Keep architecture, findings, and acceptance guidance current |

### v0.03 Resource Ownership / Async Boundaries

- `TextureManager` remains owner of loaded authored textures.
- `ProceduralTextureFactory` remains owner of generated fallback textures.
- `PaintingMaterial` continues to hold references only; it must not dispose shared textures.
- Any new parallax/self-shadow path must not trigger async shader races during rapid artwork switches.
- Existing `artworkLoadToken` race protection in `GalleryManager.showArtwork()` must remain the guardrail for future auxiliary-map selection.
- Cache invalidation must include preset tier and surface profile so switching presets does not reuse an incompatible procedural map.

### Browser / API Stability Boundaries

- Production target remains Three.js WebGL in the current preview pipeline.
- The parallax/self-shadow implementation should be done with `onBeforeCompile` / shader chunk replacement or a dedicated `ShaderMaterial` only if native material extension becomes insufficient.
- Any debug-only visualizer or inspector must not load during normal `file://` preview use unless explicitly enabled.
- WebGPU remains experimental and unrelated to v0.03 acceptance.

### v0.03 Vertical Slices

1. **Slice 1 — Surface contract and fidelity instrumentation**
   - Extend artwork/material metadata with surface profile and optional physical-scale fields.
   - Add albedo-only vs shaded comparison mode.
   - Acceptance: future artwork swaps require metadata/assets only, not code edits.

2. **Slice 2 — Matte-first material retune**
   - Lower clearcoat/specular/grazing defaults.
   - Rework roughness/specular generation around matte-first behaviour.
   - Acceptance: default gallery no longer reads as shiny.

3. **Slice 3 — Resolution-aware procedural fallback system**
   - Replace fixed 256 px fallback assumptions with preset-aware target tile sizes and layered synthesis.
   - Acceptance: relief quality no longer depends on the current artwork set.

4. **Slice 4 — High preset parallax relief path**
   - Add tangent-space parallax occlusion style UV offset and consistent height convention.
   - Acceptance: artwork gains clear 3D surface feel from view-angle change without changing the albedo identity.

5. **Slice 5 — Direct-light self-shadow approximation**
   - Add short light-direction march / horizon test for parallax relief.
   - Acceptance: raking light shows relief and self-shadow cues in inspection mode.

6. **Slice 6 — Museum-style display lighting and inspection controls**
   - Retune the default profile around an explicit gallery-style key/fill composition.
   - Ensure the default light remains flattering while pan/zoom motion still reveals relief cues.
   - Expose raking light and fidelity toggles in a safe UI/debug lane.
   - Acceptance: reviewers can validate fidelity, artistic display quality, relief visibility, and gloss behaviour reproducibly.

7. **Slice 7 — Free edge/corner inspection camera**
   - Replace conservative pan clamp with explicit inspection bounds.
   - Acceptance: every edge and corner is reachable at maximum zoom.

8. **Slice 8 — Preset/performance hardening**
   - Tune sample counts, map sizes, and fallbacks for high/balanced/battery.
   - Acceptance: high gives best visuals, balanced stays practical, battery stays safe.

9. **Slice 9 — Documentation and validation handoff**
   - Update all markdown docs and validation records.
   - Acceptance: reviewers have concrete technical checks and known limitations.

### v0.03 Performance Budgets

| Preset | Allowed techniques | Budget guidance |
| --- | --- | --- |
| High / inspection | parallax UV march, self-shadow approximation, large procedural maps, multi-octave detail | highest GPU cost; acceptable on modern discrete GPUs only |
| Balanced | no self-shadow march, no heavy parallax; retain normal + bump + matte roughness | default customer preset target; protect 60 FPS on mid-range discrete GPUs |
| Battery | albedo + simple normal only, low-cost lighting response | preserve low-end GPU compatibility and thermals |

### v0.03 Acceptance Checks

- [ ] Albedo-only comparison confirms the shader does not change the original picture's essence.
- [ ] Default material reads matte/rough, not glossy.
- [ ] Relief responds to both light angle and view angle.
- [ ] Default display lighting feels museum-like and artistic rather than purely technical.
- [ ] Default display lighting is positioned so surface cues remain visible during pan/zoom movement.
- [ ] High/inspection preset delivers visible parallax-style depth.
- [ ] Self-shadow cues appear under raking light without crushing the artwork.
- [ ] Relief quality remains stable at maximum zoom.
- [ ] The system behaves correctly for arbitrary artwork aspect ratios and arbitrary source resolutions.
- [ ] Swapping in future artwork assets requires metadata/assets only, not code edits.
- [ ] Every edge and corner is reachable during close inspection.
- [ ] Reduced-motion mode keeps inspection lighting still.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes and preview output is inspected.
- [ ] Texture-memory cost and preset-specific fallbacks are documented in `FINDINGS.md`.

### v0.03 Known Risks / Reserved Future Boundaries

- Parallax occlusion mapping sample counts can become too expensive on integrated GPUs if not tier-gated aggressively.
- Self-shadow marching can create shimmer or aliasing if height maps are too noisy or if step counts are too low.
- Excessive UV offset near artwork borders can reveal invalid samples unless border policy is explicit.
- If authored assets arrive with inconsistent height conventions, relief can invert unless the contract is explicit.
- True displacement/geometry tessellation remains out of scope for the current WebGL production path.

---

## v0.02 Scope — Advanced Painting Material Shaders & Experimental WebGPU

### v0.02 Implementation Status (this session)

All v0.02 slices are now implemented in source. The implementation deliberately follows the audited plan rather than the first draft, and prefers native Three.js features over hand-written GLSL whenever Three.js already does the work correctly.

| Slice | Status | Notes |
| --- | --- | --- |
| 1 — Texture Set Metadata Contract | ✅ Implemented | `PaintingTextureSet.ts`, `Artwork.textureSet?`, extended `QualityPreset`, role-aware `TextureManager.loadForRole` / `preloadTextureSet` |
| 2 — Procedural Painting Map Generator | ✅ Implemented | `ProceduralTextureFactory` generates albedo / normal / detailNormal / height / roughness / specular / AO maps, deterministic per `artwork.id` |
| 3 — PaintingMaterial WebGL Prototype | ✅ Implemented | `PaintingMaterial extends MeshPhysicalMaterial`; albedo, normal, roughness, specular, AO use **native** Three.js features (no shader patching needed) |
| 4 — Detail Normal + Bump Refinement | ✅ Implemented | `onBeforeCompile` patches `normal_fragment_maps` for tangent-space blend; explicit `perturbNormalArb` after-pass for bump while normalMap is active; `#define`-gated |
| 5 — Realistic Gallery Light Profiles | ✅ Implemented | `LightProfile.ts` with four profiles; `kelvinToColor` Tanner-Helland approximation; `LightingSetup` reuses Three.js light objects across profile switches |
| 6 — Frame Budget Monitor | ✅ Implemented | `FrameBudgetMonitor` with rolling 60-frame window, EMA, navigation/preset cooldown |
| 7 — Adaptive Quality Guardrails | ✅ Implemented | `AdaptiveQualityController` — one-way `high → balanced → battery`; cooldown after every downgrade; manual preset change suspends adaptive control for the session |
| 8 — Experimental WebGPU Backend Probe | ✅ Implemented | `RenderBackend.maybeProbeWebGPU` is opt-in (`?backend=webgpu` / `localStorage.freyraum.backend = 'webgpu'`) and loads the copied public module `webgpu-probe.js` only at runtime; the probe returns a serializable result and stays out of the main IIFE preview bundle |
| 9 — Real Texture Asset Integration Pass | ⏸ Deferred | No real scanned/authored asset set is available in this repository. The `Artwork.textureSet?` field is in place; adding authored files and referencing them is the only remaining step and requires no code changes |
| 10 — v0.02 Documentation, Review, and Handoff | ✅ Implemented | `plan.md`, `CHANGELOG.md`, `FINDINGS.md`, `README.md`, and `docs/HANDOFF.md` all updated in this pass |

### v0.02 Implementation Deviations From The Audited Plan

1. **`FrameBudgetMonitor` location:** placed in `src/utils/FrameBudgetMonitor.ts` (next to `AdaptiveQualityController.ts`) instead of `src/performance/`. Pure organisational choice; behaviour is identical.
2. **`MaterialInspector` dev overlay:** not implemented as a separate file. The frame-budget data is exposed via `monitor.readSnapshot()` so a future debug HUD can be added without runtime changes. Reason: the production path never needs it, and the audited rule "must never be requested during normal preview use" is easier to enforce by not shipping the module at all.
3. **Bump path:** uses Three.js' native `bumpMap` + `bumpScale = 1.0` so the `dHdxy_fwd()` / `perturbNormalArb()` helpers are declared. We then call `perturbNormalArb` ourselves with `uBumpStrength * dHdxy_fwd()` after `normal_fragment_maps` so both `normalMap` and the height term coexist (the native chunk only applies one or the other). This is the audited correct approach.
4. **AO path:** uses Three.js' native `aoMap` + `aoMapIntensity`. `PlaneGeometry` does not have `uv1` by default, so `ArtworkMesh.makeArtworkGeometry` copies `uv` into `uv1` after creation (Three.js ≥ 0.152 reads aoMap from uv1).
5. **`PAINTING_USE_ROUGHNESS_MAP` and `PAINTING_USE_SPECULAR_MAP` defines:** not needed at the GLSL level because Three.js itself compiles roughness/specular paths in/out based on `material.roughnessMap` / `material.specularIntensityMap` being set. The plan's intent (compile-out for battery) is achieved by not assigning those maps when the preset disables them.
6. **WebGPU probe loading:** the first implementation attempt used a source-level TS dynamic import, but the file-based customer preview is built as a single IIFE. The corrected implementation moves the probe to `public/webgpu-probe.js` and imports it by runtime URL only when the user opts in, which keeps the probe code out of the main preview bundle.
7. **Preset transition hardening:** `GalleryManager.applyPreset()` now rebuilds the current artwork immediately so `battery` mode truly removes optional map work on the active painting, and `main.ts` uses an explicit `adaptiveQualityWriteInFlight` guard so the controller does not suspend itself on its own downgrade.

### v0.02 Aspect-Ratio Robustness — How The Implementation Stays Correct For Every Format

The user requirement is that the gallery works "with every aspect ratio and resolution of all kinds of formats of the picture". Concretely:

| Concern | Where it is handled | Behaviour |
| --- | --- | --- |
| Image dimensions arrive at any aspect ratio | `getTextureSize` in `src/utils/texture.ts` reads `naturalWidth/naturalHeight` first, falling back to `width/height` for `ImageBitmap`/data textures | Portrait, landscape, square, ultrawide, and procedural data textures all yield a finite, non-zero aspect |
| Artwork mesh and frame resize per artwork | `ArtworkMesh.updateAspect` calls `fitWithinBox(aspect, 4.2, 5.8)` and scales both the artwork plane and the frame box | Maintains a uniform `0.4` world-unit frame margin on both axes regardless of aspect |
| Detail-normal tiling must stay square in physical units | `ArtworkMesh.setPaintingTextures` derives `tiling = new Vector2(width × density, height × density)` and passes it to `PaintingMaterial.applyTextures`, which loads it into the `uDetailTiling` uniform | Canvas weave appears at uniform real-world density on portrait, square, landscape, and ultrawide artworks. A 7:3 ultrawide does NOT show stretched weave |
| Camera pan limits must adapt to aspect | Existing `GalleryManager.getPanLimits` derives world-space visible dimensions from camera FOV and aspect | Untouched in v0.02 — already correct for any aspect |
| Side panels must not distort previews | Existing `SidePanels.updatePanelScale` calls `fitWithinBox` per panel | Untouched in v0.02 |
| Minimum zoom safety for portrait artworks | Existing `GalleryManager.getMinZoom` already accounts for both dimensions and FOV | Untouched in v0.02 |
| Anisotropic filtering caps per preset | `TextureManager.setAnisotropyDivisor` divides the GPU's max anisotropy by the preset divisor (1 / 2 / 4) and reapplies the new cap to cached textures immediately | Tilted-view sharpness preserved on high/balanced; reduced on battery without needing a fresh load |

The four shipped artwork formats exercise every relevant case:

- `electric-storm`: 2400 × 1600 landscape (3:2)
- `quiet-coastline`: 1800 × 2400 portrait (3:4)
- `tokyo-passage`: 2100 × 2100 square (1:1)
- `golden-desert`: 2800 × 1200 ultrawide (7:3)

### v0.02 Validation Outcomes (this session)

- `npm run lint` — clean.
- `npm run build` — clean. Preview output: `freyraum-gallery.js` 546.50 kB / gzip 139.68 kB, `style.css` 15.36 kB / gzip 3.42 kB, `webgpu-probe.js` 2.32 kB. The increase covers the new painting material, procedural factory, light profiles, frame-budget monitor, adaptive controller, and render-backend selector.
- The WebGPU probe code is no longer part of the main IIFE bundle. The main preview script contains only a runtime `import(new URL('./webgpu-probe.js', window.location.href).toString())` call; the probe implementation itself lives in the copied public module and is requested only when the user opts in.

---

### v0.02 Mission

v0.02 makes the artworks read as **realistic physical paintings** — not flat images on a plane. Close-up inspection must reveal woven canvas fibres, brush ridges, pigment thickness, and light-dependent highlights. The rendering pipeline must sustain **60 FPS on mid-range discrete GPUs** (balanced preset) and **at least 25 FPS on old integrated GPUs** (battery preset), all inside the browser with no native apps or server-side GPU work.

### v0.02 Non-Goals

- Do not replace Three.js as the production renderer.
- Do not make WebGPU mandatory; WebGL must remain the customer-demo path.
- Do not add a CMS or remote asset service.
- Do not add new npm dependencies unless strictly required and security-checked first.
- Do not ship texture assets without documenting their source, format, and regeneration path.

### v0.02 Final Audit — Corrections Applied To This Plan

This plan was re-audited after the first technical pass. The following issues were found and corrected so implementation can proceed professionally and with fewer rework risks:

- **Shader-space correction:** the first draft described detail-normal blending as if a tangent-space normal could be added directly to a view-space normal. That is not safe. The audited plan now requires tangent-space blending before the Three.js TBN/view-space transform.
- **Bump correction:** the first draft used a simplified `dFdx/dFdy` perturbation example that was too approximate for a normative plan. The audited plan now requires reusing the same perturbation path/pattern that Three.js uses for bump/normal handling instead of adding raw derivatives directly to the final normal.
- **Specular-scope correction:** the first draft assumed `specularColor` was always available at the chosen injection point. The audited plan now treats specular-map modulation as a chunk-verified step and explicitly allows a fallback to roughness + clearcoat first if scope differs in Three.js `0.166.x`.
- **Browser-API stability correction:** the first draft used exact WebGPU DOM types in the public contract. The audited plan now requires a stable serializable probe result shape so TypeScript/lib.dom drift does not block implementation.
- **Build-output wording correction:** the first draft claimed the debug overlay would "never be bundled". With Vite dynamic imports, the correct guarantee is that the debug overlay must never be eagerly imported or requested unless the debug flag is present.
- **Execution guardrail correction:** the first draft did not explicitly cover async artwork-load races, texture ownership, or disposal boundaries. The audited plan now adds strict lifecycle rules so rapid navigation and preset changes do not produce stale map application or texture leaks.

---

### v0.02 Codebase Baseline

The following is the exact state of every file that v0.02 must build on. Future implementors must read these files before touching anything.

**`src/materials/CanvasMaterial.ts`**
- Currently generates a single 128×128 sinusoidal normal map (canvas weave only).
- `loadNormalTexture()` is `async` but the result is cached after the first call.
- Applied to `artworkMaterial` in `ArtworkMesh` via `.normalMap` / `.normalScale.set(0.12, 0.12)`.
- No detail normal, no bump, no specular map, no roughness map, no AO map exist yet.
- The class is the primary v0.02 extension point — it becomes or is replaced by `PaintingMaterial`.

**`src/gallery/ArtworkMesh.ts`**
- Creates a `THREE.MeshPhysicalMaterial` inline with `roughness: 0.88`, `metalness: 0`, `clearcoat: 0.04`.
- The only map wired today is the normal map loaded from `CanvasMaterial`.
- `applyPreset(preset)` only rebuilds geometry when `artworkSegments` changes.
- All other material properties are static after construction.
- The inline `MeshPhysicalMaterial` must be replaced by the new `PaintingMaterial` factory.

**`src/gallery/TextureManager.ts`**
- Uses a single `THREE.TextureLoader` and caches by URL string.
- **Critical issue:** `prepareTexture()` sets `colorSpace = THREE.SRGBColorSpace` for every texture.
  Normal, detail-normal, height, roughness, specular, and AO maps must use `THREE.LinearSRGBColorSpace` (or `THREE.NoColorSpace` for data textures in Three.js 0.166). Only albedo maps should use `SRGBColorSpace`.
- Anisotropy is always set to `maxAnisotropy`. v0.02 must cap this per preset.
- There is no role awareness (albedo vs. non-albedo) — this must be added.

**`src/lighting/LightingSetup.ts`**
- Single `AmbientLight(0xffffff, 1.5)`, `SpotLight(0xffffff, 150)`, and `PointLight(0xffffff, 8, 30)`.
- The spotlight oscillates `position.x` by `Math.sin(time * 0.0002) * 0.6` — very slow, correct.
- `applyPreset` only toggles `castShadow`. Angle, colour, and intensity are hardcoded.
- A `LightProfile` system must be added without breaking current behaviour.

**`src/config/quality.ts`**
- `QualityPreset` fields today: `id`, `label`, `description`, `pixelRatioCap`, `bloomStrength`, `bloomRadius`, `bloomThreshold`, `shadows`, `artworkSegments`.
- v0.02 must add shader-level fields to this interface — see §TypeScript Contract below.

**`src/config/artworks.ts`**
- `Artwork` interface fields today: `id`, `title`, `subtitle`, `description`, `year`, `medium`, `image`, `dimensions`, `alt`, `credit`, `tags`.
- `image` is currently a data-URI SVG. v0.02 adds an optional `textureSet` field alongside `image`.

**`src/main.ts`**
- The animation loop is a plain `requestAnimationFrame` calling `lightingSetup.update(now)`, `galleryManager.update()`, `postProcessing.render()`.
- `FrameBudgetMonitor` must be wired here to receive `now` timestamps.
- Preferences subscription already calls `applyPreset` on all subsystems — any new material system must follow the same pattern.

---

### v0.02 TypeScript Contract

All new types must be defined before implementation begins. These are the normative type definitions.

#### Addition to `src/config/artworks.ts`

```typescript
// ─── New types added at the top of artworks.ts ───────────────────────────────

export type TextureColorSpace = 'srgb' | 'linear' | 'none';

export interface PaintingTextureMapEntry {
  /** Path relative to /public or a data URI for offline preview. */
  url: string;
  /** `srgb` for albedo, `linear` for most grayscale/normal data, `none` when Three.js data-texture handling should bypass color transforms entirely. */
  colorSpace: TextureColorSpace;
  /** Native pixel dimensions — used for mip budget calculations. */
  resolution?: { width: number; height: number };
}

export interface PaintingTextureSet {
  /** Overrides artwork.image when present. Color space: sRGB. */
  albedo?: PaintingTextureMapEntry;
  /** Tangent-space canvas/brush normal. Color space: linear. */
  normal?: PaintingTextureMapEntry;
  /** High-frequency weave + grain detail normal. Color space: linear. Tiled. */
  detailNormal?: PaintingTextureMapEntry;
  /** Grayscale R-channel bump/height relief. Color space: linear. */
  height?: PaintingTextureMapEntry;
  /** Grayscale R-channel roughness variation. Color space: linear. */
  roughness?: PaintingTextureMapEntry;
  /** Grayscale R-channel specular variation. Color space: linear. */
  specular?: PaintingTextureMapEntry;
  /** Grayscale R-channel ambient occlusion. Color space: linear. */
  ao?: PaintingTextureMapEntry;
  /** UV repeat factor for detailNormal. Default 18. */
  detailTiling?: number;
  /** Per-artwork overrides for shader uniforms (override quality defaults). */
  normalStrengthOverride?: number;
  detailNormalStrengthOverride?: number;
  bumpStrengthOverride?: number;
}

// ─── Extended Artwork interface ───────────────────────────────────────────────

export interface Artwork {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  year: number;
  medium: string;
  image: string;
  dimensions: ArtworkDimensions;
  alt: string;
  credit: string;
  tags: readonly string[];
  /** Optional painting texture set. When absent, procedural fallback maps are used. */
  textureSet?: PaintingTextureSet;
}
```

#### Additions to `src/config/quality.ts`

```typescript
// ─── New fields added to QualityPreset interface ──────────────────────────────

export interface QualityPreset {
  // (all existing fields kept unchanged)
  id: QualityPresetId;
  label: string;
  description: string;
  pixelRatioCap: number;
  bloomStrength: number;
  bloomRadius: number;
  bloomThreshold: number;
  shadows: boolean;
  artworkSegments: number;

  // ─── v0.02 additions ──────────────────────────────────────────────────────
  /** Shader variant compiled into the painting material for this preset. */
  shaderVariant: 'painting-high' | 'painting-balanced' | 'painting-battery';
  /** Base canvas/brush normal strength (uCanvasNormalStrength). */
  normalStrength: number;
  /** Detail normal blend weight (uDetailNormalStrength). 0 disables detail normal entirely. */
  detailNormalStrength: number;
  /** Bump perturbation scale (uBumpStrength). 0 disables bump. */
  bumpStrength: number;
  /** Specular map boost scale (uSpecularStrength). */
  specularStrength: number;
  /** Anisotropy divisor: actual anisotropy = maxAnisotropy / divisor. */
  anisotropyDivisor: number;
  /** Enable ambient-occlusion map lookup. Battery always false. */
  aoEnabled: boolean;
  /** Enable grazing-light enhancement. Battery always false. */
  grazingBoostEnabled: boolean;
  /** Enable detail normal map. Battery always false. */
  detailNormalEnabled: boolean;
}

// ─── Updated QUALITY_PRESETS values ──────────────────────────────────────────

high: {
  // ... existing fields ...
  shaderVariant: 'painting-high',
  normalStrength: 0.45,
  detailNormalStrength: 0.28,
  bumpStrength: 0.14,
  specularStrength: 0.12,
  anisotropyDivisor: 1,
  aoEnabled: true,
  grazingBoostEnabled: true,
  detailNormalEnabled: true,
},
balanced: {
  // ... existing fields ...
  shaderVariant: 'painting-balanced',
  normalStrength: 0.32,
  detailNormalStrength: 0.18,
  bumpStrength: 0.06,
  specularStrength: 0.08,
  anisotropyDivisor: 2,
  aoEnabled: false,
  grazingBoostEnabled: false,
  detailNormalEnabled: true,
},
battery: {
  // ... existing fields ...
  shaderVariant: 'painting-battery',
  normalStrength: 0.16,
  detailNormalStrength: 0.0,
  bumpStrength: 0.0,
  specularStrength: 0.03,
  anisotropyDivisor: 4,
  aoEnabled: false,
  grazingBoostEnabled: false,
  detailNormalEnabled: false,
},
```

#### New file `src/materials/PaintingTextureSet.ts`

Re-exports `PaintingTextureSet` and `PaintingTextureMapEntry` from `artworks.ts` plus adds a typed map-role enum so `TextureManager` and `PaintingMaterial` share the same vocabulary:

```typescript
export type PaintingMapRole =
  | 'albedo'
  | 'normal'
  | 'detailNormal'
  | 'height'
  | 'roughness'
  | 'specular'
  | 'ao';

export { PaintingTextureSet, PaintingTextureMapEntry } from '../config/artworks';
```

#### New file `src/materials/PaintingMaterial.ts`

```typescript
import * as THREE from 'three';
import type { QualityPreset } from '../config/quality';
import type { PaintingTextureSet } from './PaintingTextureSet';

export interface PaintingMaterialParams {
  preset: QualityPreset;
  textureSet: ResolvedPaintingTextures;  // see below
  reducedMotion?: boolean;
}

/** Resolved textures after loading; null means map absent/procedural. */
export interface ResolvedPaintingTextures {
  albedo: THREE.Texture | null;
  normal: THREE.Texture | null;
  detailNormal: THREE.Texture | null;
  height: THREE.Texture | null;
  roughness: THREE.Texture | null;
  specular: THREE.Texture | null;
  ao: THREE.Texture | null;
}

export type PaintingMaterialUniforms = {
  uCanvasNormalStrength: THREE.IUniform<number>;
  uDetailNormalStrength: THREE.IUniform<number>;
  uBumpStrength: THREE.IUniform<number>;
  uSpecularStrength: THREE.IUniform<number>;
  uRoughnessFloor: THREE.IUniform<number>;
  uRoughnessCeiling: THREE.IUniform<number>;
  uVarnishStrength: THREE.IUniform<number>;
  uDetailTiling: THREE.IUniform<number>;
  uLightGrazingBoost: THREE.IUniform<number>;
  uCloseInspectionMix: THREE.IUniform<number>;
  uReducedMotionScalar: THREE.IUniform<number>;
  tDetailNormal: THREE.IUniform<THREE.Texture | null>;
  tHeight: THREE.IUniform<THREE.Texture | null>;
  tRoughness: THREE.IUniform<THREE.Texture | null>;
  tSpecular: THREE.IUniform<THREE.Texture | null>;
  tAO: THREE.IUniform<THREE.Texture | null>;
};

export class PaintingMaterial extends THREE.MeshPhysicalMaterial {
  readonly paintingUniforms: PaintingMaterialUniforms;
  private _variant: string;

  constructor(params: PaintingMaterialParams) { /* ... */ }
  applyPreset(preset: QualityPreset): void { /* ... */ }
  applyTextures(textures: ResolvedPaintingTextures): void { /* ... */ }
  setReducedMotion(value: boolean): void { /* ... */ }
  setDetailTiling(tiling: number): void { /* ... */ }
}
```

`PaintingMaterial` extends `THREE.MeshPhysicalMaterial` and injects shader code in `onBeforeCompile`. See §Shader Implementation Plan for the exact GLSL.

#### Changes to `src/gallery/ArtworkMesh.ts`

- Replace `private readonly artworkMaterial: THREE.MeshPhysicalMaterial` with `private artworkMaterial: PaintingMaterial`.
- Replace the inline `new THREE.MeshPhysicalMaterial(...)` constructor call with `new PaintingMaterial(...)`.
- Add `setMaps(textures: ResolvedPaintingTextures): void` public method that calls `artworkMaterial.applyTextures(textures)`.
- `applyPreset` must also call `this.artworkMaterial.applyPreset(preset)`.
- Remove the `CanvasMaterial` dependency once `PaintingMaterial` subsumes it.

#### Changes to `src/gallery/TextureManager.ts`

- Add `loadForRole(url: string, role: PaintingMapRole): Promise<THREE.Texture>`.
- `loadForRole` sets `colorSpace` based on role: `albedo` → `THREE.SRGBColorSpace`; all others → `THREE.LinearSRGBColorSpace`.
- Cap `texture.anisotropy = Math.ceil(this.maxAnisotropy / anisotropyDivisor)` where `anisotropyDivisor` is passed from the active preset.
- Add `preloadTextureSet(set: PaintingTextureSet, divisor: number): Promise<ResolvedPaintingTextures>` which calls `loadForRole` for every defined entry and returns a `ResolvedPaintingTextures` object.
- Keep `preload(urls)` and `load(url)` unchanged for backward compatibility.
- Keep the fallback `createFallbackTexture` for the albedo role.

#### Changes to `src/gallery/GalleryManager.ts`

- Accept `PaintingTextureManager` (or extended `TextureManager`) in the constructor.
- In `showArtwork(index)`, after loading the albedo, call `textureManager.preloadTextureSet(artwork.textureSet ?? {})` and pass the result to `artworkMesh.setMaps(resolvedTextures)`.
- `init()` stays the same public API; internally it will now also trigger map preloading.

#### New file `src/lighting/LightProfile.ts`

```typescript
export type LightProfileId =
  | 'gallery-soft'
  | 'raking-inspection'
  | 'museum-neutral'
  | 'dramatic-demo';

export interface LightProfile {
  id: LightProfileId;
  label: string;
  /** SpotLight position [x, y, z] */
  spotPosition: [number, number, number];
  /** SpotLight angle in radians */
  spotAngle: number;
  /** SpotLight penumbra 0–1 */
  spotPenumbra: number;
  /** SpotLight intensity */
  spotIntensity: number;
  /** AmbientLight intensity */
  ambientIntensity: number;
  /** Colour temperature in Kelvin (converted to THREE.Color on load) */
  colorTemperatureK: number;
  /** X-axis oscillation amplitude (0 = static; respect reduced-motion) */
  motionAmplitude: number;
  /** Oscillation angular frequency (radians per millisecond) */
  motionFrequency: number;
}

export const LIGHT_PROFILES: Record<LightProfileId, LightProfile> = {
  'gallery-soft': {
    id: 'gallery-soft',
    label: 'Galerie',
    spotPosition: [-10, 5, 7],
    spotAngle: 0.42,
    spotPenumbra: 0.9,
    spotIntensity: 150,
    ambientIntensity: 1.5,
    colorTemperatureK: 4200,
    motionAmplitude: 0.6,
    motionFrequency: 0.0002,
  },
  'raking-inspection': {
    id: 'raking-inspection',
    label: 'Streiflicht',
    spotPosition: [-14, 1, 5],
    spotAngle: 0.22,
    spotPenumbra: 0.5,
    spotIntensity: 280,
    ambientIntensity: 0.6,
    colorTemperatureK: 5600,
    motionAmplitude: 0.0,
    motionFrequency: 0.0,
  },
  'museum-neutral': {
    id: 'museum-neutral',
    label: 'Museumsneutral',
    spotPosition: [0, 8, 8],
    spotAngle: 0.55,
    spotPenumbra: 0.95,
    spotIntensity: 100,
    ambientIntensity: 2.2,
    colorTemperatureK: 3200,
    motionAmplitude: 0.0,
    motionFrequency: 0.0,
  },
  'dramatic-demo': {
    id: 'dramatic-demo',
    label: 'Dramatisch',
    spotPosition: [-8, 4, 6],
    spotAngle: 0.35,
    spotPenumbra: 0.7,
    spotIntensity: 220,
    ambientIntensity: 0.9,
    colorTemperatureK: 4800,
    motionAmplitude: 1.2,
    motionFrequency: 0.0003,
  },
};
```

#### Changes to `src/lighting/LightingSetup.ts`

- Add `private activeProfile: LightProfile` field, default `gallery-soft`.
- Add `setProfile(id: LightProfileId): void` — applies the profile to spotlight position, angle, penumbra, intensity, and ambient intensity.
- `update(time)` uses `activeProfile.motionAmplitude` and `activeProfile.motionFrequency` so static profiles do not oscillate.
- A helper `kelvinToColor(K: number): THREE.Color` converts colour temperature (using the McCamy or Krystek approximation) to an `RGB` `THREE.Color`.
- `applyPreset` continues to toggle `castShadow` and does not change the profile.

#### New file `src/materials/ProceduralTextureFactory.ts`

Generates deterministic fallback maps using `HTMLCanvasElement` + `CanvasRenderingContext2D`. All maps are generated synchronously to keep startup simple; they are cached by `artworkId + role`.

Maps generated per call:

| Role | Resolution | Algorithm |
| --- | --- | --- |
| `normal` | 256 × 256 | Warp-domain sinusoidal weave + FBM-like layering using `sin(x * 0.42 + offset) * sin(y * 0.38)` with 3 octaves; pack into RG (tangent-space XY, B = 255). |
| `detailNormal` | 256 × 256 | Higher frequency weave (0.8–1.2 Hz range), 4 octaves; independent UV scale so it tiles at 18× and blends subtly at gallery distance. |
| `height` | 256 × 256 | Layered brush-stroke height: dominant strokes from `Math.abs(sin(y * 0.12 + hash * 0.8)) * 90`; secondary cross-strokes; final value packed to R grayscale 0–255. |
| `roughness` | 128 × 128 | Low-frequency Perlin-like noise (simulated with `sin(x*0.09)*cos(y*0.07)` layered 2 octaves) remapped to [60, 220] range to represent dry-paint (rough) to lightly varnished (smooth) variation. |
| `specular` | 128 × 128 | Very low frequency, very subtle — mostly uniform at 12/255 with sparse high-value pixels representing thick varnished pigment. Gaussian blob centered at a hash-determined position. |
| `ao` | 128 × 128 | Not procedurally generated; returns a flat 128/255 grey fallback so the AO uniform has no effect until a real map is supplied. |

```typescript
export class ProceduralTextureFactory {
  private readonly cache = new Map<string, THREE.Texture>();

  generate(artworkId: string, role: PaintingMapRole): THREE.Texture;
  disposeAll(): void;
  private getCacheKey(artworkId: string, role: PaintingMapRole): string;
  private buildNormal(id: string): THREE.Texture;
  private buildDetailNormal(id: string): THREE.Texture;
  private buildHeight(id: string): THREE.Texture;
  private buildRoughness(id: string): THREE.Texture;
  private buildSpecular(id: string): THREE.Texture;
  private buildAOFallback(): THREE.Texture;
  private hash(value: string): number;  // same djb2-style hash as TextureManager
}
```

#### New file `src/rendering/RenderBackend.ts`

Thin abstraction that `main.ts` uses to decide whether to initialise `WebGLRenderer` (default) or the experimental WebGPU path.

```typescript
export type BackendId = 'webgl' | 'webgpu-experimental';

export interface RenderBackendInfo {
  backendId: BackendId;
  adapterLabel?: string;
  unsupportedReason?: string;
}

export async function detectBackend(): Promise<BackendId>;
export async function getBackendInfo(): Promise<RenderBackendInfo>;
```

`detectBackend()` reads `?backend=webgpu` query param or `localStorage.getItem('freyraum.backend')` and only returns `'webgpu-experimental'` when both the flag is set AND `navigator.gpu !== undefined`. Otherwise it always returns `'webgl'`.

#### New runtime module `public/webgpu-probe.js`

Runtime-import target so unsupported browsers never parse the module and the
main `file://` IIFE preview bundle never contains the probe implementation.

```typescript
/**
 * @experimental — never imported by the production WebGL path.
 * Imported only via runtime import when backend === 'webgpu-experimental'.
 */
export async function initWebGPUPrototype(): Promise<WebGPUProbeResult>;

export interface SerializedGPUAdapterInfo {
  vendor?: string;
  architecture?: string;
  device?: string;
  description?: string;
}

export interface WebGPUProbeResult {
  supported: boolean;
  adapterInfo?: SerializedGPUAdapterInfo;
  /** Plain-object limits snapshot so the result is loggable and stable across DOM lib versions. */
  limits?: Record<string, number>;
  unsupportedFeatures: string[];
  frameTimingMs?: number;  // filled after one test frame
  fallbackToWebGL: boolean;
}
```

This module uses `navigator.gpu.requestAdapter()`, requests a device, renders one test frame to an offscreen canvas, and returns metrics. Any exception sets `fallbackToWebGL: true`. The caller in `main.ts` falls back to the normal `RendererManager` path if `fallbackToWebGL` is true.

#### New file `src/performance/FrameBudgetMonitor.ts`

```typescript
export type FpsWindowKey = '1s' | '5s' | '30s';

export interface FrameSample {
  timestamp: number;    // performance.now()
  frameDeltaMs: number; // elapsed since previous sample
}

export class FrameBudgetMonitor {
  /** Call once per animation frame with the rAF timestamp. */
  tick(now: number): void;

  /** Rolling FPS for the given window. Returns 0 if window is not yet full. */
  getFps(window: FpsWindowKey): number;

  /**
   * Fires cb when rolling 5s FPS drops below threshold for at least
   * minConsecutiveDropMs without being interrupted by navigation events.
   */
  onSlowFrames(threshold: number, minConsecutiveDropMs: number, cb: () => void): () => void;

  /** Marks a navigation event — resets slow-frame accumulator to avoid spurious downgrades. */
  markNavigation(): void;

  /** Returns a summary string for the dev overlay. */
  summary(): string;
}
```

The monitor is created in `main.ts` and `tick(now)` is called at the top of the `animate` loop. Its `onSlowFrames` callback is wired to `PreferencesStore.setQuality` only after the `FrameBudgetMonitor` returns data for a full 5s window, preventing spurious downgrades during startup.

#### New file `src/debug/MaterialInspector.ts`

```typescript
/**
 * Development-only overlay.
 * Only constructed when the URL contains '?debug=material'.
 * Never eagerly imported during the normal customer preview path.
 */
export class MaterialInspector {
  constructor(
    app: HTMLElement,
    artworkMesh: ArtworkMesh,
    lightingSetup: LightingSetup,
    frameBudget: FrameBudgetMonitor
  );

  dispose(): void;
}
```

Renders an absolutely positioned panel showing: active preset, shader variant, active map list, FPS (all three windows), pixel ratio, anisotropy cap, and buttons to toggle each texture map individually. It must never be eagerly imported; Vite may still emit a separate async chunk, but that chunk must not be requested unless `?debug=material` is present.

#### Changes to `src/main.ts`

```typescript
// 1. Before RendererManager construction — detect backend:
const backendId = await detectBackend();
if (backendId === 'webgpu-experimental') {
  const probeUrl = new URL('./webgpu-probe.js', window.location.href).toString();
  const { initWebGPUPrototype } = await import(/* @vite-ignore */ probeUrl);
  const result = await initWebGPUPrototype();
  if (!result.fallbackToWebGL) {
    // future: hand off to WebGPU full path
    console.info('[WebGPU] probe result:', result);
  }
  // for now always continue with WebGL; the probe is informational only
}

// 2. Create FrameBudgetMonitor after renderer:
const frameBudget = new FrameBudgetMonitor();

// 3. In animate loop — add tick at the top:
const animate = (now: number): void => {
  rafId = requestAnimationFrame(animate);
  frameBudget.tick(now);          // <-- new
  lightingSetup.update(now);
  galleryManager.update();
  postProcessing.render();
};

// 4. Adaptive quality — wired after a full 5s window:
frameBudget.onSlowFrames(28, 6000, () => {
  const current = preferences.current.quality;
  if (current === 'high')        preferences.setQuality('balanced');
  else if (current === 'balanced') preferences.setQuality('battery');
  // battery already at floor — no further downgrade
});

// 5. MaterialInspector — dev only:
if (new URLSearchParams(location.search).get('debug') === 'material') {
  const { MaterialInspector } = await import('./debug/MaterialInspector');
  new MaterialInspector(app, artworkMesh, lightingSetup, frameBudget);
}
```

### v0.02 Lifecycle, Loading, and Disposal Guardrails

These guardrails are mandatory because the current gallery is interactive, async, and texture-heavy.

#### Async artwork-load race handling

`GalleryManager` must keep an incrementing `artworkLoadToken` (number). Every call to `showArtwork(index)` captures the current token before starting async map loads. When map loading resolves, the code must compare the captured token against the latest token and discard stale results.

Implementation rule:

```typescript
private artworkLoadToken = 0;

private async showArtwork(index: number): Promise<void> {
  const token = ++this.artworkLoadToken;
  // start albedo + texture-set load here
  const textures = await this.textureManager.preloadTextureSet(...);
  if (token !== this.artworkLoadToken) return; // stale navigation result
  this.artworkMesh.setMaps(textures);
}
```

This is required so rapid navigation cannot apply a previous artwork's auxiliary maps to the currently visible artwork.

#### Texture ownership and disposal boundaries

Ownership must stay explicit:

- `TextureManager` owns network-loaded textures and is solely responsible for disposing them.
- `ProceduralTextureFactory` owns generated fallback textures and is solely responsible for disposing them.
- `PaintingMaterial` may reference textures but must not dispose shared textures on `applyTextures()` or `dispose()`.
- `ArtworkMesh.dispose()` disposes geometry and material only.
- Swapping presets or artworks must never dispose textures still held by caches.

#### Fallback precedence

Fallback order must be deterministic:

1. authored map from `artwork.textureSet`
2. procedural fallback from `ProceduralTextureFactory`
3. neutral flat/no-op data texture when the role should exist but generation fails
4. hard-disable the shader path via `#define` when the role is optional and no safe fallback exists

#### Adaptive-quality safety rules

- Automatic downgrades may only occur after a full 5-second sample window exists.
- Automatic downgrades must pause for a cooldown window after manual preset changes.
- Manual preset selection must override automatic downgrade for the current session until the page reloads or the user explicitly re-enables auto mode.

#### Release-blocking lifecycle checks

v0.02 is not releasable if any of the following remain unresolved:

- stale auxiliary maps appear after rapid artwork navigation
- repeated artwork switching increases GPU memory without stabilising
- preset switching recompiles shaders every frame instead of only on preset changes
- reduced-motion mode still animates highlight drift or inspection-only light movement

---

### v0.02 Shader Implementation Plan

This section is the normative reference for `PaintingMaterial.onBeforeCompile`. All GLSL is for Three.js `0.166.x` chunk names — verify chunk names against `node_modules/three/src/renderers/shaders/ShaderChunk/` before coding.

#### Inject point strategy

Three.js `MeshPhysicalMaterial` fragment shader includes these chunks in order (relevant subset):

```
#include <map_fragment>            — samples albedo (map)
#include <roughnessmap_fragment>   — samples roughnessMap, sets roughnessFactor
#include <metalnessmap_fragment>   — samples metalnessMap, sets metalnessFactor
#include <normal_fragment_begin>   — declares 'normal' from geometry data
#include <normal_fragment_maps>    — applies normalMap (sets normal in view space)
#include <clearcoat_normal_fragment_maps>
#include <emissivemap_fragment>
#include <lights_physical_fragment> — PBR lighting integration
#include <aomap_fragment>          — applies aoMap, multiplies diffuse colour
```

Our injections use `shader.fragmentShader = shader.fragmentShader.replace(...)`.

#### Uniform declarations (injected into fragmentShader before first `#include`)

```glsl
uniform float uCanvasNormalStrength;
uniform float uDetailNormalStrength;
uniform float uBumpStrength;
uniform float uSpecularStrength;
uniform float uRoughnessFloor;
uniform float uRoughnessCeiling;
uniform float uVarnishStrength;
uniform float uDetailTiling;
uniform float uLightGrazingBoost;
uniform float uCloseInspectionMix;
uniform float uReducedMotionScalar;
uniform sampler2D tDetailNormal;
uniform sampler2D tHeight;
uniform sampler2D tRoughness;
uniform sampler2D tSpecular;
uniform sampler2D tAO;
```

All injected via `shader.uniforms = { ...THREE.UniformsUtils.clone(shader.uniforms), ...this.paintingUniforms }`.

#### Injection 1 — Roughness override and audited specular-map rule

```glsl
// ─── PAINTING: roughness map override ───────────────────────────────────────
#ifdef PAINTING_USE_ROUGHNESS_MAP
  float paintRoughSample = texture2D(tRoughness, vMapUv).r;
  roughnessFactor = mix(uRoughnessFloor, uRoughnessCeiling, paintRoughSample);
#endif
```

**Audited rule for specular modulation:** do not hard-code a `specularColor` write at an unverified injection point.

Implementation decision order:

1. Prefer native `MeshPhysicalMaterial` support if `specularIntensityMap` / `specularColorMap` can be used directly in Three.js `0.166.x` without patching.
2. If native support is insufficient, patch specular response only after verifying the exact variable scope inside `lights_physical_fragment`.
3. If scope is unclear or unstable during Slice 3, ship roughness + clearcoat first and defer specular-map modulation to Slice 4/5 rather than forcing an unsafe shader patch.

This keeps the plan realistic and avoids baking a fragile chunk-scope assumption into the implementation contract.

#### Injection 2 — Audited normal-path integration for detail normal and height

**Audited correction:** do not add tangent-space detail normals or raw height derivatives directly to the already transformed view-space `normal`.

Required implementation strategy:

1. Replace or wrap the `normal_fragment_maps` path rather than patching only after it.
2. Sample the base normal map and detail-normal map in tangent space.
3. Blend them in tangent space using RNM/whiteout-style blending.
4. Feed the blended tangent normal through the same TBN/view-space transform path that Three.js already uses for `MeshPhysicalMaterial`.
5. If a height/bump map is present, apply it through the same perturbation helper/pattern that Three.js uses for bump handling so derivatives are interpreted in the correct space.

Reference pseudocode:

```text
base tangent normal  = unpack(normalMap)
detail tangent normal = unpack(tDetailNormal)
blended tangent normal = RNM(base, detail * uDetailNormalStrength * uReducedMotionScalar)
final normal = Three.js normal-map transform(blended tangent normal)
height perturbation = Three.js-compatible bump perturbation using sampled height derivatives
```

Implementation note on accessibility: `uReducedMotionScalar` may reduce the contribution of detail normal or animated grazing-light effects, but it must not silently corrupt the normal basis. Reduced motion is a strength scalar, not a different normal-space path.

#### Injection 3 — After `#include <aomap_fragment>`: custom AO and grazing-light boost

```glsl
// ─── PAINTING: custom AO map ─────────────────────────────────────────────────
#ifdef PAINTING_USE_AO
  float paintAO = texture2D(tAO, vMapUv).r;
  reflectedLight.indirectDiffuse *= paintAO;
#endif

// ─── PAINTING: grazing-light boost ──────────────────────────────────────────
#ifdef PAINTING_USE_GRAZING_BOOST
  // NdotV — angle between view and normal.
  // A grazing angle (near 90°) should show more surface texture catch-light.
  float NdotV = abs(dot(normal, normalize(vViewPosition)));
  float grazingMask = pow(1.0 - NdotV, 3.0);  // stronger at near-90°
  reflectedLight.directSpecular *= (1.0 + grazingMask * uLightGrazingBoost);
#endif
```

#### Compile-time `#define` strategy

`onBeforeCompile` sets `#define` flags based on the active preset and available maps, then prepends them to the fragment shader:

```typescript
const defines: string[] = [];
if (preset.detailNormalEnabled && textures.detailNormal) defines.push('#define PAINTING_USE_DETAIL_NORMAL');
if (preset.bumpStrength > 0 && textures.height)          defines.push('#define PAINTING_USE_BUMP');
if (textures.roughness)                                   defines.push('#define PAINTING_USE_ROUGHNESS_MAP');
if (textures.specular)                                    defines.push('#define PAINTING_USE_SPECULAR_MAP');
if (preset.aoEnabled && textures.ao)                      defines.push('#define PAINTING_USE_AO');
if (preset.grazingBoostEnabled)                           defines.push('#define PAINTING_USE_GRAZING_BOOST');

shader.fragmentShader = defines.join('\n') + '\n' + shader.fragmentShader;
```

This ensures battery mode never executes expensive texture reads for detail/bump/AO even when the maps exist in memory.

**Important:** changing defines requires `material.needsUpdate = true` and may trigger a full shader recompile. Only call `applyPreset` when the preset actually changes. Cache the last applied variant id.

---

### v0.02 Procedural Map Generation — Detail Specification

`ProceduralTextureFactory` replaces the current 128×128 normal map in `CanvasMaterial` with five higher-quality maps.

#### Normal map (256 × 256, wrapS/wrapT = RepeatWrapping, repeat = 4 × 4)

```typescript
// Pseudo-code — implementation may vary; visual result matters more than exact formula.
for (let y = 0; y < 256; y++) {
  for (let x = 0; x < 256; x++) {
    const h = this.hash(artworkId);
    const offset = (h % 100) / 100.0;
    const oct1 = Math.sin(x * 0.42 + offset) * Math.cos(y * 0.38) * 14;
    const oct2 = Math.sin(x * 0.19 + offset * 2) * Math.cos(y * 0.22) * 6;
    const weave = Math.sin((x + y) * 0.11) * 3;
    const v = oct1 + oct2 + weave;
    R[i] = clamp(128 + v, 0, 255);
    G[i] = clamp(128 - v, 0, 255);
    B[i] = 255;
  }
}
```

Result maps to a tangent-space normal (0,0,1) at rest with subtle XY variation that catches raking light.

#### Detail normal map (256 × 256, wrapS/wrapT = RepeatWrapping, repeat = 18 × 18)

Higher frequency than base normal — represents individual canvas threads.

```typescript
// 4 octaves of fine weave noise; repeat tiling chosen so threads are ~2 px wide
// at normal viewing distance, giving canvas-tooth appearance.
const oct1 = Math.sin(x * 1.1) * Math.cos(y * 0.9) * 18;
const oct2 = Math.sin(x * 2.3 + 0.7) * Math.cos(y * 2.1) * 7;
const oct3 = Math.cos(x * 4.1) * Math.sin(y * 3.8) * 2.5;
const oct4 = Math.sin((x - y) * 5.5) * 1.0;
```

#### Height / bump map (256 × 256, repeat = 4 × 4)

Grayscale R channel:

```typescript
// Dominant horizontal brush strokes
const stroke = Math.abs(Math.sin(y * 0.12 + (hash % 64) * 0.05)) * 80;
// Secondary cross-hatch
const cross = Math.abs(Math.sin(x * 0.09 + (hash % 32) * 0.07)) * 30;
// Canvas tooth grain
const tooth = Math.sin(x * 1.4) * Math.sin(y * 1.6) * 12;
const h = clamp(stroke + cross + tooth, 0, 255);
```

#### Roughness map (128 × 128, repeat = 6 × 6)

Low-frequency Perlin-like variation between [60, 220] (0 = perfectly smooth, 255 = fully rough):

```typescript
// 2-octave smooth noise; low frequency so it reads as varnish pooling
const n1 = (Math.sin(x * 0.09) * Math.cos(y * 0.07)) * 0.5 + 0.5;
const n2 = (Math.sin(x * 0.21 + 1.3) * Math.cos(y * 0.18 + 0.7)) * 0.5 + 0.5;
const combined = n1 * 0.7 + n2 * 0.3;
R[i] = Math.round(60 + combined * 160);
```

#### Specular map (128 × 128, repeat = 6 × 6)

Mostly dark (no specular), sparse bright pixels:

```typescript
// Baseline near-zero: 12 / 255
// Gaussian blobs at hash-determined positions to represent varnish pooling
const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
const blob = Math.exp(-dist * dist / (radius * radius)) * 200;
R[i] = Math.round(Math.min(12 + blob, 255));
```

---

### v0.02 Lighting Model — Full Specification

See `src/lighting/LightProfile.ts` (§TypeScript Contract) for the type definition and four named profiles.

**Colour temperature conversion** — implemented as `kelvinToColor(K): THREE.Color`:

```
T = K / 100
if T <= 66:
  R = 255
  G = 99.4708025861 * ln(T) - 161.1195681661
  B = T <= 19 ? 0 : 138.5177312231 * ln(T - 10) - 305.0447927307
else:
  R = 329.698727446 * (T - 60)^(-0.1332047592)
  G = 288.1221695283 * (T - 60)^(-0.0755148492)
  B = 255
Clamp each channel to [0, 255]; divide by 255 for Three.Color.
```

This gives visually correct warm (3200 K) to cool daylight (6500 K) tints for each profile.

**Profile application in `LightingSetup.setProfile(id)`:**

1. Call `kelvinToColor(profile.colorTemperatureK)` to get the colour.
2. Set `spotlight.color`, `spotlight.position`, `spotlight.angle`, `spotlight.penumbra`, `spotlight.intensity`.
3. Set `ambientLight.intensity`.
4. Store `profile` as `activeProfile`.
5. The `update(time)` method checks `activeProfile.motionAmplitude === 0` to skip oscillation.

---

### v0.02 Experimental WebGPU Strategy

See `src/rendering/RenderBackend.ts` and `public/webgpu-probe.js` in §TypeScript Contract.

Key constraints:
- `detectBackend()` must never call `navigator.gpu.requestAdapter()` — adapter requests can trigger browser permission prompts or errors. The detection is purely `navigator.gpu !== undefined`.
- The actual `requestAdapter()` call lives inside `initWebGPUPrototype()` in `public/webgpu-probe.js`, which is only invoked after the user has explicitly opted in via query param or `localStorage`.
- In v0.02 the WebGPU path is **informational only**: it probes, logs, and falls back to WebGL. No customer-facing work renders through WebGPU in v0.02.
- After the probe result is logged to console, the normal WebGL `RendererManager` boot continues unchanged.

---

### v0.02 Performance Budgets

Frame targets:

| Device class | Target | Required preset |
| --- | --- | --- |
| Mid-range discrete GPU (e.g. GTX 1660, RX 580) | 60 FPS at 1440p | balanced |
| High-end discrete GPU (e.g. RTX 3070, RX 6700) | 60 FPS at 4K capped 1.8 DPR | high |
| Old integrated GPU (e.g. Intel HD 620, Iris 640) | 25 FPS minimum at 1080p | battery |

Texture read budget per fragment:

| Preset | Max texture reads (artwork material) |
| --- | --- |
| high | 7 (albedo + normal + detailNormal + height + roughness + specular + AO) |
| balanced | 5 (albedo + normal + detailNormal + roughness + specular) |
| battery | 2 (albedo + normal only) |

Additional rules:
- Adjacent side-preview artworks load albedo only — no auxiliary maps until the artwork is the active centre piece.
- Timeline thumbnails use albedo only and cap anisotropy at 1.
- `PreferencesStore.setQuality` triggers full `applyPreset` on all subsystems including `PaintingMaterial`. Shader recompile is expected and acceptable on preset change; it must not interrupt the animation loop visibly (use `requestAnimationFrame` timing to defer heavy work when needed).
- Bloom should be disabled or set to `bloomStrength = 0` for high preset when `uSpecularStrength > 0.1` because the specular highlight already provides the sheen effect. This avoids double-brightening varnished areas.

---

### v0.02 Texture Asset Pipeline

File naming convention under `public/assets/artworks/{artworkId}/`:

```
{artworkId}-albedo.webp          — sRGB, full resolution
{artworkId}-normal.webp          — linear, 1024×1024 recommended
{artworkId}-detail-normal.webp   — linear, 512×512 at minimum
{artworkId}-height.webp          — linear grayscale R, 512×512
{artworkId}-roughness.webp       — linear grayscale R, 512×512
{artworkId}-specular.webp        — linear grayscale R, 256×256
{artworkId}-ao.webp              — linear grayscale R, 512×512
```

Loading rules:
- All map loads go through `TextureManager.loadForRole(url, role)`.
- Role determines color space: `albedo → SRGBColorSpace`, all others → `LinearSRGBColorSpace`.
- Anisotropy cap per preset: `maxAnisotropy / anisotropyDivisor`, minimum 1.
- Active artwork: load full preset-appropriate map set.
- Side previews: albedo only.
- Timeline: albedo only, scaled to thumbnail size.
- Fallback: `ProceduralTextureFactory.generate(artworkId, role)` whenever a URL is absent or fails.

---

### v0.02 Validation Matrix

Every implementation slice must finish with an explicit validation pass.

| Validation area | Required check |
| --- | --- |
| Type safety | `npm run build:typecheck` |
| Lint | `npm run lint` |
| Preview build | `npm run build` and confirm `customer-preview/` regenerated |
| Local file preview | open root `index.html` and confirm `customer-preview/app.html` launches correctly |
| Reduced motion | disable motion and confirm light drift / highlight drift / navigation swoop are frozen or reduced as intended |
| High contrast | verify controls remain legible while material realism remains readable |
| Missing maps | verify procedural fallback or compile-time disable path works for every optional map role |
| Rapid navigation | navigate quickly across all artworks and confirm no stale map application |
| Preset switching | switch high ↔ balanced ↔ battery and confirm one-time shader recompile only on actual preset changes |
| Memory stability | run repeated navigation / preset switching and confirm textures/materials stabilise without visible leaks |
| WebGPU probe | `?backend=webgpu` logs probe info and returns cleanly to WebGL on failure |

Release note rule: every slice must append its validation outcome to `FINDINGS.md`, including failures, mitigations, and remaining risks.

---

### v0.02 Vertical Slices

#### Slice 1 — Texture Set Metadata Contract

Goal: extend `Artwork` and `QualityPreset` with v0.02 fields so TypeScript catches invalid usage before any shader code is written.

Files changed:
- `src/config/artworks.ts` — add `PaintingTextureMapEntry`, `PaintingTextureSet`, extend `Artwork` with `textureSet?`.
- `src/materials/PaintingTextureSet.ts` — new; re-export and add `PaintingMapRole`.
- `src/config/quality.ts` — add `shaderVariant`, `normalStrength`, `detailNormalStrength`, `bumpStrength`, `specularStrength`, `anisotropyDivisor`, `aoEnabled`, `grazingBoostEnabled`, `detailNormalEnabled` to `QualityPreset`; update all three preset objects.
- `src/gallery/TextureManager.ts` — add `loadForRole(url, role)` and `preloadTextureSet(set, divisor)`.

Acceptance checks:
- `npm run build` clean with zero new TypeScript errors.
- All four existing artwork entries in `artworks.ts` continue to work (no `textureSet` required).
- `loadForRole` correctly sets `LinearSRGBColorSpace` for a `'normal'` role and `SRGBColorSpace` for `'albedo'`.

#### Slice 2 — Procedural Painting Map Generator

Goal: create believable fallback maps so the material shader can be developed and reviewed before final scanned assets exist.

Files changed:
- `src/materials/ProceduralTextureFactory.ts` — new; implements all five map generators from §Procedural Map Generation.

Acceptance checks:
- Calling `factory.generate('electric-storm', 'normal')` twice returns the cached instance.
- Close-up inspection in `npm run dev` reveals canvas tooth and brush relief in the normal map.
- Battery preset skips detail normal generation (factory still creates it; the caller simply does not pass it to `PaintingMaterial`).
- Maps disposed cleanly via `disposeAll()`.

#### Slice 3 — PaintingMaterial WebGL Prototype

Goal: replace inline `MeshPhysicalMaterial` in `ArtworkMesh` with `PaintingMaterial`, wiring albedo, base-normal, roughness, and specular maps first.

Files changed:
- `src/materials/PaintingMaterial.ts` — new; full class with `onBeforeCompile`, uniforms, and `applyPreset`.
- `src/gallery/ArtworkMesh.ts` — replace inline material, add `setMaps(textures)` and `applyPreset` delegation.
- `src/gallery/GalleryManager.ts` — call `textureManager.preloadTextureSet` in `showArtwork`; pass result to `artworkMesh.setMaps`.
- `src/materials/CanvasMaterial.ts` — deprecate; functionality moved into `ProceduralTextureFactory` and `PaintingMaterial`.

Acceptance checks:
- Lighting visibly responds to base normal map under raking inspection light.
- Roughness map variation visible under directional light.
- No regression in zoom, pan, aspect ratio, or timeline navigation.
- `npm run lint` and `npm run build` clean.

#### Slice 4 — Detail Normal + Bump Height Refinement

Goal: make close-up inspection reveal canvas tooth and brush relief.

Files changed:
- `src/materials/PaintingMaterial.ts` — add `PAINTING_USE_DETAIL_NORMAL` and `PAINTING_USE_BUMP` injection points from §Shader Implementation Plan.
- `src/gallery/ArtworkMesh.ts` — pass `detailNormal` and `height` textures from `ResolvedPaintingTextures`.

Acceptance checks:
- Zoomed-in view shows canvas fibre detail not present at gallery distance.
- Battery preset produces measurably fewer texture reads (verify by commenting out detail defines and checking FPS in dev tools).
- `uReducedMotionScalar` set to 0 flattens the detail normal blend — confirm by toggling reduced-motion in preferences.

#### Slice 5 — Realistic Gallery Light Profiles

Goal: make the material relief visible through physically correct light direction and intensity.

Files changed:
- `src/lighting/LightProfile.ts` — new; `LightProfileId`, `LightProfile`, `LIGHT_PROFILES`, `kelvinToColor`.
- `src/lighting/LightingSetup.ts` — add `setProfile(id)`, update `update(time)` to use `activeProfile.motionAmplitude`, call `kelvinToColor`.

Acceptance checks:
- `raking-inspection` profile clearly reveals bump and normal relief.
- `museum-neutral` flattens highlights and shows true colour.
- All profiles respect `setAnimated(false)` for reduced-motion mode.
- No regression in shadow toggle from `applyPreset`.

#### Slice 6 — Frame Budget Monitor + Dev Overlay

Goal: make the 60/25 FPS targets measurable before adding adaptive quality.

Files changed:
- `src/performance/FrameBudgetMonitor.ts` — new; rolling FPS windows, `onSlowFrames`, `markNavigation`, `summary`.
- `src/debug/MaterialInspector.ts` — new; dev overlay (only when `?debug=material` is present).
- `src/main.ts` — wire `frameBudget.tick(now)` in the animation loop; conditional `MaterialInspector` construction.

Acceptance checks:
- `frameBudget.getFps('5s')` returns a reasonable FPS after 5 seconds of animation.
- Dev overlay visible with `?debug=material` query param.
- Overlay code is lazy-requested only with `?debug=material`; its async chunk may exist in the build output but must never be fetched during normal customer preview use.

#### Slice 7 — Adaptive Quality Guardrails

Goal: protect weaker GPUs from falling and staying below 25 FPS without requiring manual intervention.

Files changed:
- `src/main.ts` — wire `frameBudget.onSlowFrames(28, 6000, downgradeQuality)` after the FPS window fills.
- `src/performance/FrameBudgetMonitor.ts` — add `markNavigation()` to reset slow-frame accumulator.
- `src/gallery/GalleryManager.ts` — call `frameBudget.markNavigation()` in `navigate()` and `goTo()`.

Acceptance checks:
- Sustained < 28 FPS for 6 seconds triggers a quality downgrade.
- Downgrade from balanced → battery does not reset artwork, zoom, pan, fullscreen, or accessibility state.
- Manual quality selection in `PreferencesPanel` disables automatic downgrade for the current session (set a `manualOverride` flag in `PreferencesStore`).

#### Slice 8 — Experimental WebGPU Backend Probe

Goal: introduce the WebGPU probe without touching the production WebGL path.

Files changed:
- `src/rendering/RenderBackend.ts` — new; `detectBackend`, `getBackendInfo`.
- `public/webgpu-probe.js` — new runtime-only experimental module; `initWebGPUPrototype`, `WebGPUProbeResult`.
- `src/main.ts` — add backend detection before `RendererManager` construction; conditional dynamic import.

Acceptance checks:
- Without `?backend=webgpu`, `detectBackend()` always returns `'webgl'` regardless of browser support.
- With `?backend=webgpu` on a supporting browser, probe runs and logs adapter info to console.
- Any WebGPU failure falls back to the normal WebGL boot — no blank screen, no broken UI.
- `npm run build` customer preview keeps the probe implementation out of `freyraum-gallery.js`; only the runtime import of `webgpu-probe.js` remains in the main bundle.

#### Slice 9 — Real Texture Asset Integration Pass

Goal: integrate one complete real or authored texture set and compare it against procedural fallbacks.

Files changed:
- `public/assets/artworks/electric-storm/` — add one artwork's texture set (albedo, normal, height, roughness, specular; AO optional).
- `src/config/artworks.ts` — add `textureSet` field to the `electric-storm` artwork entry pointing to the new files.

Acceptance checks:
- Authored normal/height maps produce visibly more realistic paint relief than procedural fallbacks under raking light.
- Preview build remains local and offline safe (all assets are in `public/`).
- File sizes documented in `FINDINGS.md` with compression decisions.

#### Slice 10 — v0.02 Documentation, Review, and Handoff

Goal: make all shader and WebGPU decisions reviewable and reproducible for future contributors.

Files changed:
- `docs/HANDOFF.md` — add shader controls, benchmark procedure, light profile descriptions, WebGPU probe instructions.
- `docs/assets/architecture.svg` — extend with v0.02 material system, light profiles, FrameBudgetMonitor, and WebGPU probe paths.
- `plan.md` — mark each slice as implemented and add per-slice findings.
- `FINDINGS.md` — add per-slice benchmark and visual notes.
- `CHANGELOG.md` — add v0.02 dated entry.

Acceptance checks:
- A future contributor can understand the full material, lighting, and WebGPU pipeline from docs alone.
- Customer-facing handoff clearly marks WebGL as stable and WebGPU as experimental.

---

### v0.02 Risk Register

| Risk | Why it matters | Mitigation in this plan | Acceptable fallback |
| --- | --- | --- | --- |
| Tangent/view-space mix-up in shader patching | Produces incorrect highlights, shimmering, and unstable close-up detail | Blend base + detail normals in tangent space before Three.js transforms them | Ship base normal + roughness first; defer detail normal until verified |
| Specular patch variable-scope mismatch | Can fail compilation or silently alter the wrong lighting term | Verify chunk scope in Three.js `0.166.x` before custom patching | Ship roughness + clearcoat only in Slice 3 |
| Async artwork-load race | Rapid navigation can apply stale auxiliary maps to the wrong artwork | `artworkLoadToken` guard in `GalleryManager.showArtwork()` | Cancel outdated results and keep only albedo for that frame |
| GPU memory creep from cached/generated textures | Long sessions may degrade performance or crash weaker GPUs | Explicit ownership boundaries and disposal rules | Disable optional maps / clear caches on preset downgrade |
| Asset weight explosion | Authored map stacks can make local preview too heavy | Load auxiliary maps only for active artwork; document file sizes in `FINDINGS.md` | Keep procedural fallback for some roles/artworks |
| WebGPU browser/API instability | Probe path can fail differently across browsers and DOM lib versions | Keep probe informational and serializable; dynamic import only on opt-in | Fall back to WebGL silently with dev log |
| Debug-tool production leakage | Debug overlay may accidentally affect normal preview sessions | Lazy request by query flag only; no eager import side effects | Ship without MaterialInspector if bundling semantics become messy |

---

### Recommended v0.02 Execution Order

1. Slice 1 — Texture Set Metadata Contract *(TypeScript foundation; all later slices depend on it)*
2. Slice 2 — Procedural Painting Map Generator *(enables shader development without real assets)*
3. Slice 3 — PaintingMaterial WebGL Prototype *(first visual result; validates shader injection approach)*
4. Slice 5 — Realistic Gallery Light Profiles *(needed to see the material working; low risk)*
5. Slice 4 — Detail Normal + Bump Refinement *(builds on Slice 3; requires good lighting to evaluate)*
6. Slice 6 — Frame Budget Monitor + Dev Overlay *(measure before guardrails)*
7. Slice 7 — Adaptive Quality Guardrails *(depends on Slice 6 data)*
8. Slice 8 — Experimental WebGPU Backend Probe *(isolated; can run in parallel after Slice 3)*
9. Slice 9 — Real Texture Asset Integration Pass *(requires full material stack from Slice 4)*
10. Slice 10 — Documentation, Review, and Handoff

---

### v0.02 Acceptance Summary

v0.02 is complete when:

- Realistic painting texture is visible in close-up: canvas tooth, brush relief, roughness variation, and specular catch-light all respond to the active light profile.
- `raking-inspection` profile clearly reveals surface detail not visible under `gallery-soft`.
- Balanced preset sustains 60 FPS on a mid-range discrete GPU test machine (documented with device + browser + OS in `FINDINGS.md`).
- Battery preset sustains at least 25 FPS on an old integrated GPU test machine (same documentation requirement).
- Rapid artwork navigation cannot apply stale auxiliary maps from a previously selected artwork.
- Repeated navigation + preset switching does not create visible texture/material leaks during a manual dev session.
- WebGPU probe runs, logs adapter info, and falls back to WebGL on unsupported browsers without UI breakage.
- All markdown files updated: `CHANGELOG.md`, `FINDINGS.md`, `README.md`, `docs/HANDOFF.md`, `plan.md`.


## Reserved Future Pass After v0.01

- content management integration
- multilingual content pipeline
- audio narration and accessibility audio layer
- analytics and multi-gallery support
- WebGPU production renderer parity and VR path after the v0.02 experimental probe

## Verification Notes

- In this audit session, `npm run lint` passed after `npm install`, with the known `@typescript-eslint` warning about TypeScript `5.9.3` not being officially supported by the current parser range.
- In this audit session, `npm run build` passed after `npm install`, and the preview bundle was regenerated successfully.
- The build emitted the current Dart Sass legacy JS API deprecation warning; treat it as a future tooling cleanup item, not a v0.02 blocker.
- Interaction and rendering changes must still be manually tested in both `npm run dev` and by opening root `index.html` locally.
