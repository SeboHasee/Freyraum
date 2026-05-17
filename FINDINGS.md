# FINDINGS

## 2026-05-17 - Local preview architecture

- A plain Vite application entry is not sufficient for customer handoff when the site must open directly from `file://`.
- The repository therefore needs two entry paths:
  - `app.html` for development with Vite
  - root `index.html` as a launcher to the committed preview build
- The committed preview should avoid browser module resolution edge cases by using a classic script bundle.

## 2026-05-17 - Gallery interaction limits

- Hardcoded zoom and pan numbers were not robust enough for mixed artwork formats.
- Correct pan behavior must be derived from actual fitted artwork dimensions, viewport aspect ratio, and camera FOV.
- A deep zoom limit must keep the camera in front of the artwork plane to avoid invalid inspection states.
- Hover/rotation control should not disappear at certain zoom levels; instead it should be reduced in strength when close-up inspection is active.

## 2026-05-17 - Side preview fitting

- Fixed-size preview geometry causes visible stretching on portrait, square, and ultra-wide artworks.
- Aspect-ratio-preserving scaling is the minimum acceptable solution for the current preview rail.
- Future refinement may still improve perceived balance by adding framed preview containers or elegant crop rules for extreme formats.

## 2026-05-17 - v0.01 execution outcomes

- Structured artwork metadata can stay local-static while still mapping 1:1 to a future CMS schema. Required fields (`id`, `title`, `subtitle`, `description`, `year`, `medium`, `image`, `dimensions`, `alt`, `credit`, `tags`) cover the info panel, timeline, alt text, and content audit needs. Locale/translation fields are deliberately deferred — adding them now would create dead optional fields and pollute the v0.01 contract.
- The SVG-based embedded artwork generator delivers acceptable "final" v0.01 visuals without binary asset weight or `file://` loading edge cases. Treating it as the final asset pipeline avoided introducing image compression tooling that would not pay off until real customer artwork lands. The metadata-driven generator keeps every artwork's dimensions, palette, and aspect ratio centralized in `config/artworks.ts`.
- Timeline thumbnails need both intrinsic aspect ratio handling **and** a fixed frame size. A pure aspect-ratio approach caused width changes in the scroll strip and unstable focus targets. The implemented compromise — fixed 150 × 95 frame with the artwork rendered inside using its real aspect ratio and a shimmer skeleton — preserves layout while still respecting the artwork shape.
- The system `prefers-reduced-motion` media query is necessary but not sufficient. Users may want reduced motion during a presentation independent of OS settings, so the preferences store also exposes an explicit override that takes precedence and is mirrored to `data-motion` on `<html>` for SCSS to react.
- `prefers-contrast: more` is supported in modern browsers but inconsistent on Linux desktops, so high contrast also has an explicit toggle. The high-contrast theme is implemented as token overrides rather than a parallel stylesheet to keep maintenance cost low.
- A `data-presentation="on"` attribute on `<html>` is the lightest way to express "we are in customer demo mode" to CSS. It avoids JavaScript-driven class juggling and lets future surfaces opt into presentation polish with a single selector.
- Quality presets must be subscribed by every subsystem that owns expensive GPU work. Routing presets through a `QualityPreset` object instead of separate booleans makes future additions (e.g., MSAA, depth-of-field) a single field change rather than a refactor.
- The WebGL fallback must be installed **before** the loading overlay so the customer never sees a hanging spinner. The implementation now detects WebGL first, renders the fallback directly into `#app`, and bails out of the bootstrap chain.
- The fullscreen API is well supported but its exit can be triggered by the browser (e.g., Escape, OS gesture); the implementation listens for `fullscreenchange` so the `aria-pressed` state stays accurate regardless of who initiated the exit.
- The architecture diagram lives as a hand-authored SVG so it renders inline on GitHub without a build step and stays diff-friendly. Automated generation is reserved for a future pass.
- Validation results: `npm run lint` clean; `npm run build` clean; bundle grew from ~511 KB (gzip 129 KB) to ~528 KB (gzip 134 KB), within the v0.01 budget. CSS grew from 4.5 KB to 15.4 KB (gzip 3.4 KB) because of the design system, focus-visible rules, contrast theme, presentation mode, and timeline skeleton.

## 2026-05-17 - v0.01 execution planning

- The remaining v0.01 work should be planned as vertical slices, not horizontal refactors.
- The structured artwork metadata model should be implemented before final assets, thumbnails, accessibility labels, and screenshots because those later slices depend on stable content fields.
- WebGL fallback, quality presets, fullscreen mode, and documentation screenshots are all suitable v0.01 slices, but each should stay narrowly scoped and reserve larger systems for future passes.
- A future CMS should not be implemented in v0.01; v0.01 should only prepare a local static metadata model that can later map to CMS fields.
- Documentation screenshots and architecture diagrams should be treated as a customer handoff slice, not as incidental polish.


## 2026-05-17 - v0.02 shader and WebGPU planning findings

- Realistic painting rendering should not be treated as a single stronger normal map. The future implementation needs a full material texture set: albedo, base normal, detail normal, height/bump, roughness, specular, and optional ambient occlusion. Each map has different color-space rules and performance cost.
- WebGL should remain the production renderer for v0.02 because it is already integrated, broadly available, and compatible with the current file-based customer preview. WebGPU should be introduced only as an experimental, dynamically imported backend probe so unsupported browsers continue on WebGL with no user-visible breakage.
- The most realistic lighting improvement is likely from raking/low-angle inspection profiles plus roughness/specular maps, not from simply raising light intensity. Unclamped highlight strength could wash out the artwork and fight the current bloom pass.
- Performance budgets must be shader-specific. Balanced mode should target no more than roughly 5–6 fragment texture reads for artwork material; battery mode should target roughly 2–3 reads and compile out optional AO/grazing/detail paths with defines where possible.
- Procedural fallback maps are important even when authored maps are planned. They let future contributors build and tune material behavior before final scanned texture assets exist, and they keep the local preview robust when maps are missing.
- A frame-budget monitor should be implemented before adaptive quality. Without rolling FPS data, automatic downgrades would be guesswork and could create unstable quality changes during loading or navigation spikes.
- WebGPU adapter/limit reporting can be useful in development, but it should not run during normal customer preview startup. Requesting adapters or probing limits should be opt-in to avoid startup overhead and permission/browser quirks.
- The existing v0.01 quality preset structure is a good extension point for shader variants. v0.02 should extend it instead of creating a separate material-quality system.
- Documentation must clearly distinguish stable WebGL material work from experimental WebGPU exploration so customer demos are not blocked by emerging browser support.

## 2026-05-17 - v0.02 codebase analysis findings

- `TextureManager.prepareTexture()` sets `SRGBColorSpace` for every texture unconditionally. This must be changed before any non-albedo maps (normal, height, roughness, specular, AO) are loaded — they must use `LinearSRGBColorSpace` otherwise Three.js applies sRGB gamma expansion to linear data, breaking PBR lighting.
- `ArtworkMesh` constructs a `THREE.MeshPhysicalMaterial` inline with hard-coded `roughness: 0.88`, `metalness: 0`, `clearcoat: 0.04`. These values are not owned by any preset or uniform. v0.02 must move all material parameters into `PaintingMaterial` under `QualityPreset` or `PaintingTextureSet` ownership.
- The current `CanvasMaterial` generates only a 128×128 sinusoidal normal map. At segments=240 (high preset) the artwork mesh is detailed enough that a low-resolution repeating normal map will alias visibly at close zoom. v0.02 should upgrade to 256×256 for base normal and 256×256 for detail normal, both tiled at different rates.
- `LightingSetup` has no concept of light profiles or named modes. The spotlight position is hard-coded in the constructor. Adding named profiles via a `LightProfile` interface and `setProfile(id)` method is low-risk and fully backward-compatible because the default profile reproduces the current hardcoded values.
- `QualityPreset` has no shader-level fields. Adding `shaderVariant`, `normalStrength`, `detailNormalStrength`, `bumpStrength`, `specularStrength`, `anisotropyDivisor`, `aoEnabled`, `grazingBoostEnabled`, and `detailNormalEnabled` is a non-breaking additive change — existing consumers of `QualityPreset` that don't read these fields will compile without changes.
- The animation loop in `main.ts` passes `now` (the rAF timestamp) to `lightingSetup.update(now)` but not to any performance measurement system. `FrameBudgetMonitor.tick(now)` should be the first call inside the loop to get the most accurate frame-delta measurement.
- Three.js 0.166 `onBeforeCompile` is the correct and stable pattern for augmenting `MeshPhysicalMaterial` shaders. The chunk names `roughnessmap_fragment`, `normal_fragment_maps`, and `aomap_fragment` exist in 0.166. Any implementor must verify chunk names against `node_modules/three/src/renderers/shaders/ShaderChunk/` before writing string replacements.
- `specularColor` variable availability in the fragment shader depends on the injection point. If injecting before `lights_physical_fragment`, use `specularIntensityFactor` which is set earlier. If injecting after, `specularColor` is available. The exact variable name should be confirmed by reading the Three.js 0.166 chunk source during implementation.
- The `CanvasMaterial` class can be deprecated once `PaintingMaterial` and `ProceduralTextureFactory` are in place. It should not be deleted until Slice 3 is merged and verified.
- Adaptive quality must not trigger during loading or navigation spikes. `FrameBudgetMonitor.markNavigation()` should be called from `GalleryManager.navigate()` and `goTo()` so the slow-frame accumulator resets and prevents false downgrades triggered by artwork-transition cost.

## 2026-05-17 - v0.02 final audit findings

- The first v0.02 technical draft was strong structurally but had several implementation-risk gaps: shader-space correctness for detail normals, bump perturbation accuracy, specular chunk-scope assumptions, async artwork-load races, and texture ownership/disposal boundaries. The final audited plan now covers all of these explicitly.
- Dynamic imports in Vite are not the same as "never bundled". The correct requirement for debug tooling is "never eagerly imported or requested" during normal preview use. This wording matters because reviewers otherwise look for a guarantee the bundler cannot provide.
- Stable WebGPU planning should prefer serializable probe-result shapes over exact DOM WebGPU types in the public contract. Browser support and TypeScript DOM libs move independently; a probe object that is easy to log and persist is a more robust plan boundary.
- Texture/asset plans need explicit stale-load protection in interactive galleries. Without an artwork-load token or equivalent cancellation strategy, rapid navigation can produce visually incorrect map assignment even when every individual loader works correctly.
- Resource ownership must be written down in the plan, not inferred during implementation. `TextureManager`/`ProceduralTextureFactory` should own cached textures; materials should only reference them.

## 2026-05-17 - audit validation outcomes

- In this fresh clone, `npm run lint` initially failed because dependencies were not installed (`eslint: not found`). This was an environment/setup issue, not a repository lint failure.
- In this fresh clone, `npm run build` initially failed before `npm install` because required packages such as `three` were not available in `node_modules`. This was also a setup issue.
- After `npm install`, `npm run lint` passed successfully and emitted only the already-known `@typescript-eslint` warning about TypeScript `5.9.3` being outside the parser's officially supported range.
- After `npm install`, `npm run build` passed successfully and regenerated the local preview. The build emitted the current Dart Sass legacy JS API deprecation warning.
- `npm install` reported 2 moderate vulnerabilities in the dependency tree. No dependencies were changed in this audit pass, but the toolchain should be reviewed in a future dependency-maintenance slice.

## Validation notes

- This audit pass changed markdown documentation only; no runtime source files or dependencies were modified.
- In this session, `npm install`, `npm run lint`, and `npm run build` were executed successfully after dependency installation, so the documented validation notes now reflect an actual fresh-clone audit run.
- Automated code review and CodeQL validation should still be run before finalizing because the repository workflow validates all committed changes.
