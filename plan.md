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

#### New file `src/rendering/WebGPUPrototype.ts`

Dynamic-import target so unsupported browsers never parse the module.

```typescript
/**
 * @experimental — never imported by the production WebGL path.
 * Imported only via dynamic import when backend === 'webgpu-experimental'.
 */
export async function initWebGPUPrototype(canvas: HTMLCanvasElement): Promise<WebGPUProbeResult>;

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
  const { initWebGPUPrototype } = await import('./rendering/WebGPUPrototype');
  const result = await initWebGPUPrototype(document.createElement('canvas'));
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

See `src/rendering/RenderBackend.ts` and `src/rendering/WebGPUPrototype.ts` in §TypeScript Contract.

Key constraints:
- `detectBackend()` must never call `navigator.gpu.requestAdapter()` — adapter requests can trigger browser permission prompts or errors. The detection is purely `navigator.gpu !== undefined`.
- The actual `requestAdapter()` call lives inside `WebGPUPrototype.initWebGPUPrototype()` which is only invoked after the user has explicitly opted in via query param or `localStorage`.
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
- `src/rendering/WebGPUPrototype.ts` — new; `initWebGPUPrototype`, `WebGPUProbeResult`.
- `src/main.ts` — add backend detection before `RendererManager` construction; conditional dynamic import.

Acceptance checks:
- Without `?backend=webgpu`, `detectBackend()` always returns `'webgl'` regardless of browser support.
- With `?backend=webgpu` on a supporting browser, probe runs and logs adapter info to console.
- Any WebGPU failure falls back to the normal WebGL boot — no blank screen, no broken UI.
- `npm run build` customer preview never imports `WebGPUPrototype` eagerly.

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
