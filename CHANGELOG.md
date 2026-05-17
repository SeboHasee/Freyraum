# CHANGELOG

## Unreleased

### Added (v0.06 implementation — Streifenlicht blockiness reduction)

Three vertical slices shipped against `src/`; root causes RC-1/RC-2/RC-3 from the v0.06 plan were verified in code before implementation and fixed below.

- **S2 — Procedural texture anisotropy.**
  - `src/gallery/TextureManager.ts`: New `getEffectiveAnisotropy()` getter; `setAnisotropyDivisor()` now delegates to it.
  - `src/materials/ProceduralTextureFactory.ts`: New `currentAnisotropy` field (default 1) + `setAnisotropy(value)` method that mutates every cached `DataTexture` in place; `generate()` applies the stored cap to newly created textures.
  - `src/gallery/GalleryManager.ts`: `applyPreset()` now calls `procedural.setAnisotropy(textureManager.getEffectiveAnisotropy())` so authored and procedural textures share the same per-preset cap.

- **S3 — Inspection-only relief-map resolution uplift.**
  - `src/config/quality.ts`: New `QualityPreset.proceduralInspectionTileSize` field — high=`2048`, balanced=`0`, battery=`0`.
  - `src/gallery/GalleryManager.ts`: New `inspectionMode` field + `setInspectionMode(on)` method that re-runs `showArtwork()` when toggled. Module-scope `INSPECTION_ROLES = ['normal','detailNormal','height']` (matches the style of `PROCEDURAL_ROLES`). `showArtwork()` picks `proceduralInspectionTileSize` for inspection roles when `inspectionMode && inspSize > 0`, `proceduralTileSize` otherwise. The factory cache key already includes the effective tile size, so 1024- and 2048-resolution entries coexist without stale-texture risk.
  - `src/main.ts`: `applyPreferences()` calls `galleryManager.setInspectionMode(lightProfile.displayIntent === 'inspection')`.

- **S4 — Lateral self-shadow PCF filter (inspection-only).**
  - `src/config/quality.ts`: High-preset `selfShadowFilterRadius` raised from `0.0` to `0.002` (balanced/battery stay `0.0`). The `selfShadowFilterEnabled` field proposed in the original plan was **not added** — see the plan's "Issues found in the original plan" section; the runtime gate in `main.ts` makes a preset-level boolean dead, and `selfShadowFilterRadius = 0` already disables the path on a preset.
  - `src/materials/PaintingMaterial.ts`: New `uShadowFilterRadius` uniform + `shadowFilterEnabled` instance flag + `setShadowFilterRadius(radius, enabled)` method that writes the uniform unconditionally and only triggers `needsUpdate = true` when the enable flag changes (recompile only on toggle). New GLSL block guarded by `#define PAINTING_USE_SHADOW_FILTER`, inserted inside the existing `#ifdef PAINTING_USE_SELFSHADOW` after the primary-ray `_occlusion` clamp: two companion rays perpendicular to `_shDelta`, each accumulated with the same reciprocal-distance weighting as the primary ray and clamped to `uShadowMaxOcclusion` before the 3-way average. The define is gated on `shadowFilterEnabled && selfShadowActive() && uShadowFilterRadius > 0` so it is never compiled in without the self-shadow path that hosts it.
  - `src/main.ts`: `applyPreferences()` calls `paintingMaterial.setShadowFilterRadius(isInspection ? preset.selfShadowFilterRadius : 0, isInspection && preset.selfShadowFilterRadius > 0)`.

### Validation (v0.06)

- `npm run lint` — clean.
- `npm run build` — typecheck + Vite preview + preview-HTML emitter all pass; only the pre-existing Dart Sass legacy-JS-API deprecation warning is emitted. Bundle: `customer-preview/freyraum-gallery.js` ≈ 562 KB (gzip ≈ 143 KB), up ~9 KB from v0.05 (new GLSL chunk + uniform plumbing).
- Self-shadow texture reads: gallery profile = 8 (unchanged from v0.05); inspection profile = 24 (1 primary ray + 2 lateral rays × 8 steps). Memory uplift on inspection mode on high preset: ≈48 MB GPU per inspected artwork (3 roles × (2048² − 1024²) × 4 bytes).

---

### Added (v0.05 implementation — soft self-shadow filtering)

- **Replaced the binary self-shadow GLSL break loop** in `src/materials/PaintingMaterial.ts` with smooth weighted accumulation: `smoothstep(0, softness, sampleH - wantedH - bias)` per step, reciprocal-distance weighted, normalised, clamped to `uShadowMaxOcclusion`, then multiplied by `strength × profileScale × grazeMask`.
- **Added a near-horizon `grazeMask`** (`smoothstep(0.05, 0.20, tsLight.z)`) so the self-shadow fades out smoothly as light approaches grazing, eliminating the previous hard `_tsLight.z > 0.05` cutoff edge.
- **Added 4 new uniforms** to `PaintingMaterial`: `uShadowBias`, `uShadowSoftness`, `uShadowMaxOcclusion`, `uShadowProfileScale`.
- **Added `PaintingMaterial.setShadowProfileScale(scale)`** (uniform-only, no recompile) and **`PaintingMaterial.setShadowDebug(enabled)`** (toggles `PAINTING_DEBUG_SHADOW`).
- **Added `PAINTING_DEBUG_SHADOW` define path** in the fragment shader. When enabled, the self-shadow value is stashed in `indirectDiffuse` and all other lighting terms are zeroed, producing a clean greyscale visualisation of the shadow mask only.
- **Extended `QualityPreset`** (`src/config/quality.ts`) with `selfShadowBias`, `selfShadowSoftness`, `selfShadowMaxOcclusion`, `selfShadowFilterRadius` for all three presets. Lowered high-preset `selfShadowStrength` from 0.55 to 0.30. `selfShadowFilterRadius` is wired through the type system but kept at `0.0` (PCF filter slot reserved for later).
- **Wired `src/main.ts`** to call `setShadowProfileScale(0.5)` for `display`/`demo` light profiles and `1.0` for `inspection`, via the existing `getLightProfile()` lookup. Added an `s`/`S` debug key (behind `?debug=1`) that toggles `setShadowDebug()` alongside the existing `a`/`A` albedo-only key.
- **Updated `plan.md`, `FINDINGS.md`, `README.md`, `docs/HANDOFF.md`** to mark v0.05 as implemented and document the new behaviour, effective values, and the four enhancement slots that remain open (S4 PCF filter; per-profile shadow scale on `LightProfile`; animated profile-scale fade; authored height drop-in).

### Validation (v0.05)

- `npm run lint` — clean.
- `npm run build` — typecheck + Vite preview + preview-HTML emitter all pass; only the pre-existing Sass legacy-JS-API deprecation warning is emitted.
- Customer-preview IIFE regenerated (`customer-preview/freyraum-gallery.js` ≈ 558 KB / 142 KB gzip).
- No new npm dependencies.

### Updated (v0.05 plan — full technical execution guide)

- **Rewrote v0.05 plan in `plan.md`** from a diagnosis stub into a 7-slice, file-by-file, line-by-line technical execution guide for fixing self-shadow stain artifacts.
- **Confirmed code root cause:** `src/materials/PaintingMaterial.ts` `PAINTING_USE_SELFSHADOW` block — binary break on first blocker, no bias, no softness, no max-occlusion cap, `selfShadowStrength: 0.55` causes direct light to drop to 45 % in a single step.
- **Designed new GLSL contract:** smooth weighted accumulation `smoothstep(0, softness, excess) * (1 / (step+1))`, clamped to `maxOcclusion`, then multiplied by `strength * profileScale`. Maximum gallery-soft darkening = 4.2 % of direct light.
- **Specified TypeScript changes:**
  - `src/config/quality.ts`: add `selfShadowBias`, `selfShadowSoftness`, `selfShadowMaxOcclusion`, `selfShadowFilterRadius` to `QualityPreset`; lower high-preset `selfShadowStrength` 0.55 → 0.30.
  - `src/materials/PaintingMaterial.ts`: add `uShadowBias/Softness/MaxOcclusion/ProfileScale` uniforms; add `setShadowProfileScale()` and `setShadowDebug()` methods; add `PAINTING_DEBUG_SHADOW` define path.
  - `src/main.ts`: call `setShadowProfileScale()` on profile switch; add `s`/`S` debug key for shadow-only visualisation.
- **Optional S4 PCF-like filter slot** documented for 3-ray lateral filtering; controlled by `selfShadowFilterRadius > 0`.
- **Extension slots designed in:** per-profile `shadowProfileScale`, animated profile fade, authored height support, HDR height encoding.
- Updated `FINDINGS.md` and `docs/HANDOFF.md` with code-grounded v0.05 technical context.

### Added (v0.05 planning — initial stub)

- Added initial v0.05 plan in `plan.md` for soft self-shadow filtering and stain artifact removal.
- Documented the suspected shader root cause: binary height-field blocker test with no bias, no penumbra softness, no filtering, and strong direct-light attenuation.
- Captured online research directions for parallax/relief self-shadowing, bias/deadzone handling, PCF-like filtering, and Three.js `onBeforeCompile` integration.
- Updated `FINDINGS.md`, `README.md`, `docs/HANDOFF.md`, and `DOCUMENTATION_RULES.md` with the v0.05 diagnosis, review focus, and documentation status.

### Added (v0.04 implementation)

- **Photorealistic procedural fallback pass.** Replaced the v0.03 `sin/cos` procedural normal, height, and roughness generators with deterministic value-noise maps so raking light no longer exposes checkerboard, cross-hatch, horizontal-band, or vertical-band artifacts.
- **Neutral AO fallback.** Removed the procedural AO radial vignette and replaced it with near-white neutral occlusion plus subtle value-noise grain. Default/high-preset paintings no longer get fake dark edges from fallback AO.
- **Clearcoat / varnish pipeline.** Added `clearcoatEnabled`, `clearcoatStrength`, and `clearcoatRoughnessValue` to quality presets; high enables subtle clearcoat, balanced and battery disable it.
- **Authored varnish map contract.** Added optional `varnish` role to `PaintingMapRole`, `PaintingTextureSet`, `ResolvedPaintingTextures`, and `TextureManager.preloadTextureSet()`.
- **Surface-profile wiring.** `PaintingMaterial.applySurfaceProfile()` now applies per-artwork matte/satin/varnish behavior, and `GalleryManager` calls it after race-protected artwork loads.
- **Artwork metadata update.** All four artworks now declare `surfaceProfile`; `tokyo-passage` is `satin-canvas`, the others are `matte-canvas`.
- **User-friendly surface labels.** `InfoPanel` now adds German material labels such as `Matte Leinwand` and `Satinierte Leinwand` to the artwork metadata line.
- **High-preset height fallback fix.** Procedural height maps are generated whenever bump, parallax, or self-shadow needs them, so high-preset parallax/self-shadow no longer depends on authored maps.
- Regenerated `customer-preview/freyraum-gallery.js` for the one-click local preview.
- Updated `plan.md`, `FINDINGS.md`, `README.md`, and `docs/HANDOFF.md` with implementation outcome, review notes, and validation evidence.

### Updated (v0.04 plan — full technical execution guide)

- **Rewrote v0.04 plan in `plan.md`** from a high-level strategy into an 11-slice, file-by-file technical execution guide. The new plan documents exact method names, line numbers, before/after code snippets, TypeScript constraints, and per-slice acceptance checks.
- **Confirmed Bug 1 root cause:** `ProceduralTextureFactory.generateAO()` line 211 `const vignette = 1 - Math.min(1, r2 * 0.55)` — a radial formula that evaluates to ~0 at texture corners and 1.0 at centre, producing fake edge darkening that is visible on the painting surface.
- **Confirmed Bug 2 root cause:** `generateHeight()` lines 119–120 use `Math.abs(Math.sin(y*0.12))` and `Math.abs(Math.sin(x*0.09))` creating perfect horizontal and vertical banding. `generateNormal()` lines 95–98 use `sin×cos` products at fixed harmonics creating a visible 2D grid. `generateRoughness()` lines 145–148 same pattern at lower amplitude.
- **Designed value-noise replacement:** `valueNoise2d(x, y, seed)` using smoothstep-interpolated 2D integer lattice hash (`latticeHash()` with LCG/Murmur-style constants and `Math.imul`). No external dependency, seeded per-artwork, fully deterministic.
- **Designed clearcoat / varnish pipeline:** `QualityPreset` gains `clearcoatEnabled` / `clearcoatStrength` / `clearcoatRoughnessValue`; `PaintingTextureSet` gains `'varnish'` map role; `PaintingMaterial` gains `applySurfaceProfile()` that reads the per-artwork `SurfaceProfile` and sets Three.js native clearcoat properties; `GalleryManager` calls `applySurfaceProfile()` after every artwork load.
- **Documented 11-file change scope with no new npm dependencies and no GLSL changes.**
- Updated `FINDINGS.md` with code-grounded diagnosis including exact line numbers for every diagnosed issue.
- Updated `docs/HANDOFF.md` v0.04 section with implementation-level summary.
- Updated `README.md` v0.04 section with reference to the new execution plan.

### Added (v0.04 planning — initial)

- Added a new `v0.04` follow-up plan in `plan.md` focused on removing the current vignette-like darkening, replacing the checkerboard-looking procedural surface, and moving the painting material toward a more photorealistic layered PBR workflow.
- Recorded the code-grounded diagnosis that the current dark radial falloff comes from the procedural AO fallback and that the synthetic checker pattern comes from the periodic `sin/cos` procedural normal/height/roughness generators.
- Captured web research sources in `FINDINGS.md` for museum/conservation lighting practice, RTI/photometric surface capture, and practical Three.js PBR guidance.
- Updated `README.md` and `docs/HANDOFF.md` so the next follow-up scope is visible to contributors and reviewers.

### Added (v0.03 validation audit)

- Re-ran a fresh-clone validation audit for the implemented v0.03 work. Documented that `npm run lint` and `npm run build` initially fail until `npm install` is run in a fresh checkout, then both commands pass cleanly aside from the already-known `@typescript-eslint` TypeScript-version warning and the current Dart Sass legacy JS API deprecation warning.
- Corrected the `plan.md` validation note that counted built-bundle shader-gate occurrences: the current production bundle contains **12** occurrences of `PAINTING_USE_PARALLAX`, `PAINTING_USE_SELFSHADOW`, `PAINTING_DEBUG_ALBEDO_ONLY`, and `uKeyLightDir`, not 11.
- Synced `README.md`, `FINDINGS.md`, and `docs/HANDOFF.md` with the fresh-clone audit so reviewer guidance now reflects the latest revalidation pass.

### Added (v0.03 implementation)

- **Matte-first painting material.** `PaintingMaterial` retuned for museum-quality default: `clearcoat 0.04→0.0`, `specularIntensity 1.0→0.3`, `uLightGrazingBoost 0.6→0.25`. Procedural roughness output range shifted from `[60..220]` to `[140..240]`; procedural specular baseline lowered from `12→6` and Gaussian blob peak lowered from `200→90` so varnish patches read as subtle highlights instead of dominant specular reflections.
- **Resolution-aware procedural fallback.** `ProceduralTextureFactory.generate(id, role, tileSize?)` parametrised on output resolution. Per-preset tile sizes baked into `quality.ts`: high `1024`, balanced `512`, battery `256`. Cache key includes `tileSize` so preset changes regenerate maps rather than returning stale low-resolution tiles.
- **Tangent-space parallax relief.** Added `geo.computeTangents()` to `ArtworkMesh.makeArtworkGeometry` so `vTangent`/`vBitangent` varyings populate. `PaintingMaterial` injects a steep parallax march before `map_fragment` that produces a `pUV` variable used by both the albedo and normal samples. New uniforms: `uParallaxScale`, `uParallaxSteps`. Gated by `#define PAINTING_USE_PARALLAX` and enabled only on the high preset (12 march iterations, UV depth scale `0.04`). When parallax is active, `bumpStrength` is set to `0.0` to prevent double-counting relief amplitude.
- **Direct-light self-shadow approximation.** Short height-march along the tangent-space key-light direction modulates `directDiffuse` and `directSpecular` only (the indirect / albedo path is untouched, so the original picture's colour is preserved). New uniforms: `uShadowSteps`, `uShadowStrength`, `uKeyLightDir`. `LightingSetup.getKeyLightWorldDir()` returns the world-space direction; `main.ts` transforms it into view space each frame and pushes it into the material. Gated by `#define PAINTING_USE_SELFSHADOW`, high preset only (8 march iterations, strength `0.55`).
- **Albedo-only fidelity QA toggle.** Hidden behind `?debug=1` URL parameter, then activated with the `a` keyboard key. Strips all shading (`directDiffuse = 0`, `directSpecular = 0`, `indirectDiffuse = diffuseColor`) so reviewers can verify the shader does not change the picture's essence. Console logs availability and current state. Gated by `#define PAINTING_DEBUG_ALBEDO_ONLY`.
- **Museum lighting reposition.** `gallery-soft` primary key moved from `{x:-10,y:5,z:7}` (~68° from vertical — theatrical side-light) to `{x:-3,y:5,z:4}` (~45° — flattering museum-style key that still reveals surface relief during pan/zoom). Horizontal drift amplitude lowered from 0.6 to 0.25 to match the new closer position. `raking-inspection` key moved to strictly horizontal `{x:-6,y:0,z:1.5}`; ambient lowered `0.4→0.3` to maximise shadow contrast. New `displayIntent: 'display' | 'inspection' | 'demo'` field on `LightProfile`.
- **Explicit spotlight target.** `LightingSetup` now creates a shared `THREE.Object3D` at world origin, adds it to the scene, and assigns it to every spotlight's `target`. Closes a latent bug where animating the spot position would have left the detached default target unmoved.
- **Lighting profile UI selector.** New `lighting: LightProfileId` field added to `Preferences` (persisted in localStorage and mirrored to `data-lighting` on `<html>`). New "Beleuchtung" radio group rendered in `PreferencesPanel` listing all four profiles with their German labels and descriptions. Selection is propagated through `applyPreferences` to `LightingSetup.setProfile()`.
- **Free corner inspection.** Replaced `PAN_SAFETY_FACTOR = 0.92` (which forced an artificial 8 % margin) with `INSPECTION_OVERSCROLL = 0.5` (an additive overscroll past the artwork edge). At maximum zoom the viewport centre can now reach any corner of the painting plus a small breathing margin, satisfying the v0.03 acceptance criterion of *every detail reachable*.
- **Surface contract types.** Added `SurfaceProfile` (`'matte-canvas' | 'satin-canvas' | 'varnished-oil' | 'paper' | 'procedural-fallback'`) and `SurfacePhysics` (`reliefScale?`, `parallaxDepthScale?`) to `src/config/artworks.ts`. Both are optional so existing artworks need no change. Reserved for future per-artwork tuning when scanned assets land.
- **Plan finalisation marker.** `plan.md` v0.03 section now reads "implemented" with an "Implementation Outcome" subsection documenting validation evidence, as-built deviations from the original plan, the issues found and fixed during implementation, and a per-slice summary. The original execution plan is retained verbatim below as the historical design record.

### Added (v0.03 plan finalized as execution plan)

- Replaced the v0.03 "planning status" header in `plan.md` with a full implementation-ready execution plan. Every slice now has exact file locations, type additions, method signatures, constant changes, shader injection tokens, GLSL code blocks, and rationale for each decision. A developer can open any target file and apply changes directly without interpreting architectural intent.
- The nine slices and their specific code targets:
  - **Slice 1 — Surface contract + fidelity**: `SurfaceProfile` and `SurfacePhysics` types added to `artworks.ts`; `uAlbedoOnly` uniform + `setAlbedoOnly()` added to `PaintingMaterial`; new quality preset fields `proceduralTileSize`, `parallaxEnabled`, `parallaxSteps`, `selfShadowEnabled`, `selfShadowSteps`.
  - **Slice 2 — Matte-first retune**: `clearcoat 0.04→0.0`, `specularIntensity 1.0→0.3`, `uLightGrazingBoost 0.6→0.25`; roughness procedural range shifted to `[140..240]`; specular blob peak `200→90`.
  - **Slice 3 — Resolution-aware procedural**: `generate()` gains `tileSize?` parameter; cache key extended; generators parametrised; `GalleryManager` passes `preset.proceduralTileSize`.
  - **Slice 4 — Parallax relief**: tangent computation added to `ArtworkMesh.makeArtworkGeometry`; steep parallax march injected before `map_fragment`; `pUV` variable shadows `vMapUv` for all map reads; gate: `PAINTING_USE_PARALLAX`.
  - **Slice 5 — Self-shadow**: short height-march along tangent-space key-light direction; `uKeyLightDir` uniform updated from `LightingSetup.getKeyLightWorldDir()` each frame; modulates `directDiffuse`/`directSpecular` only; gate: `PAINTING_USE_SELFSHADOW`.
  - **Slice 6 — Museum lighting**: `gallery-soft` key repositioned from `{x:-10,y:5,z:7}` (~68° from vertical) to `{x:-3,y:5,z:4}` (~45° from vertical, flattering + detail-revealing); `raking-inspection` key moved to near-horizontal `{x:-6,y:0,z:1.5}`; ambient reduced to 0.3; `displayIntent` field added to `LightProfile`; SpotLight target explicitly set to world origin.
  - **Slice 7 — Free inspection camera**: `PAN_SAFETY_FACTOR=0.92` removed; `INSPECTION_OVERSCROLL=0.5` replaces it; `getPanLimits` now uses `artworkEdge + overscroll` so every corner is reachable.
  - **Slice 8 — Performance hardening**: post-implementation tuning of parallax step counts and shadow step counts per preset.
  - **Slice 9 — Documentation handoff**: acceptance check completion, FINDINGS update with GPU profile and texture memory cost.

### Added (v0.03 planning)

- Expanded the v0.03 plan in `plan.md` into a more technical rendering architecture: modular artwork surface contracts, resolution-independent asset selection, preset-based shader tiers, museum-style display lighting, tangent-space parallax occlusion mapping strategy, direct-light self-shadow approximation, matte-first material retuning, and explicit module/file responsibilities.
- Reworked v0.03 findings in `FINDINGS.md` to document the current code-level constraints plus the researched lighting direction for gallery-display key placement, raking inspection light, motion-visible relief, modular asset swaps, effective texel-density handling, parallax-style relief, and self-shadowing.
- Updated `README.md` and `docs/HANDOFF.md` so the v0.03 summary and reviewer guidance now reflect the refined lighting architecture and acceptance criteria.

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
