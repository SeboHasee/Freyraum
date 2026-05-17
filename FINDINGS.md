# FINDINGS

## 2026-05-17 — v0.06 planning: Streifenlicht blockiness root-cause analysis

Three root causes confirmed in source code for the blocky relief artefact under `raking-inspection` at steep camera angles. Full technical execution plan (4 slices, S1–S4) written in `plan.md`. No code has shipped yet for v0.06.

### Confirmed root causes

| # | File | Root cause |
|---|------|------------|
| RC-1 | `src/materials/ProceduralTextureFactory.ts` — `makeDataTexture()` | `anisotropy` is never set on generated `DataTexture` objects (defaults to `1`). Authored textures receive anisotropy via `TextureManager.setAnisotropyDivisor()`. |
| RC-2 | `src/config/quality.ts` | `selfShadowFilterRadius: 0.0` on all presets. The `PAINTING_USE_SHADOW_FILTER` GLSL define and `uShadowFilterRadius` uniform do not yet exist in `PaintingMaterial.ts`. |
| RC-3 | `src/config/quality.ts` | `proceduralTileSize: 1024` on high preset. At maximum inspection zoom the texel grid is visible. Secondary contributor — evaluate after RC-1/RC-2 fixes. |

### Planned fixes (S2–S4 in plan.md)

- **S2:** Add `setAnisotropy(value)` to `ProceduralTextureFactory`; expose `getEffectiveAnisotropy()` on `TextureManager`; wire in `GalleryManager.applyPreset()`.
- **S3:** Add `proceduralInspectionTileSize` to `QualityPreset`; add `setInspectionMode(on)` to `GalleryManager`; wire from `main.ts` on profile switch.
- **S4:** Add `uShadowFilterRadius` uniform + `PAINTING_USE_SHADOW_FILTER` GLSL lateral PCF chunk to `PaintingMaterial`; add `setShadowFilterRadius(radius, enabled)` method; wire from `main.ts` for inspection-only activation.

### Key numbers (S4 cost)

| Path | Self-shadow texture reads | Notes |
|------|---------------------------|-------|
| Gallery (S2+S3 only) | 8 steps × 1 ray = 8 | Identical to v0.05 |
| Inspection (S4 enabled, high) | 8 steps × 3 rays = 24 | One-time recompile on profile switch |

---

## 2026-05-17 - v0.05 self-shadow soft-filtering — implemented

The v0.05 plan documented in `plan.md` has been shipped. The PaintingMaterial self-shadow path no longer uses a binary break loop; it now accumulates a smooth weighted occlusion value that is bias-deadzoned, distance-weighted, clamped, and per-profile scaled. The visual outcome is that stain-like dark spots on `gallery-soft` are gone, and `raking-inspection` shows soft surface gradients rather than blotches.

### Shipped changes

| File | Change |
|------|--------|
| `src/config/quality.ts` | Added `selfShadowBias`, `selfShadowSoftness`, `selfShadowMaxOcclusion`, `selfShadowFilterRadius` to `QualityPreset` for all 3 presets. Lowered high-preset `selfShadowStrength` 0.55 → 0.30. |
| `src/materials/PaintingMaterial.ts` | Added uniforms `uShadowBias`, `uShadowSoftness`, `uShadowMaxOcclusion`, `uShadowProfileScale`. Replaced binary GLSL `break` loop with smooth weighted accumulation. Added `setShadowProfileScale()` (uniform-only, no recompile) and `setShadowDebug()` (toggles `PAINTING_DEBUG_SHADOW`). Added a horizon `_grazeMask = smoothstep(0.05, 0.20, tsLight.z)` to fade out shadows near grazing/cutoff angles smoothly. |
| `src/main.ts` | Imports `getLightProfile`; calls `setShadowProfileScale(0.5)` for `display`/`demo` profiles and `1.0` for `inspection` in `applyPreferences()`. Adds `s`/`S` debug key (behind `?debug=1`) to toggle `setShadowDebug()`. |

### Effective values (high preset)

| Quantity | Value | Rationale |
|---------|-------|-----------|
| `selfShadowStrength` | 0.30 (was 0.55) | Display read-back gentler than a 45 % dim. |
| `selfShadowBias` | 0.03 | Deadzone larger than the typical procedural value-noise peak-to-peak. |
| `selfShadowSoftness` | 0.10 | Penumbra width; produces a visibly soft transition. |
| `selfShadowMaxOcclusion` | 0.28 | Hard cap; prevents broad plateaus from looking like stains. |
| `uShadowProfileScale` (display) | 0.5 | Museum-style profiles get half-strength shadows. |
| `uShadowProfileScale` (inspection) | 1.0 | Raking light keeps the full effect. |

Max gallery-soft darkening: `0.30 × 0.28 × 0.5 = 4.2 %` of direct light. Max inspection darkening: `0.30 × 0.28 × 1.0 = 8.4 %`. Both are well below the previous 55 % single-blocker drop and read as surface texture, not stains.

### Validation

- `npm run lint` — clean.
- `npm run build` — clean (typecheck + Vite preview + HTML emitter); only the pre-existing Sass legacy-JS-API deprecation warning is emitted.
- Customer-preview IIFE regenerated (`customer-preview/freyraum-gallery.js` ≈ 558 KB / 142 KB gzip).
- No new npm dependencies.

### Enhancement slots left open (designed in, not enabled)

- **S4 — optional 3-ray PCF lateral filter.** `selfShadowFilterRadius` is in `QualityPreset` and defaults to `0.0`. The plan documents the GLSL chunk to enable when needed; turning it on for `raking-inspection` later is a preset value change plus the documented define.
- **Per-profile `shadowProfileScale` on `LightProfile`.** Currently `main.ts` derives the scale from `displayIntent`. A profile can later carry its own scale value and `main.ts` can read it directly.
- **Animated profile-scale fade.** The current call is instant. Future work can animate the uniform.
- **Authored height-map drop-in.** Works today without any shader change — the procedural fallback path will simply not be hit when an authored height is provided.

### Historical (initial stub)



This entry supersedes the initial stub. The v0.05 plan in `plan.md` has been upgraded to a full technical execution guide; this entry records the code-level findings that drove it.

### Code-level root cause (confirmed)

**File:** `src/materials/PaintingMaterial.ts`  
**Block:** `PAINTING_USE_SELFSHADOW` inside `lightsEndChunk` (lines ≈ 252–288)

The shader marches one ray through the height field toward the key light. On the first step where `_sampleH > _wantedH` it immediately sets `_shadow = 1.0 - uShadowStrength` and breaks. With the current high preset value of `selfShadowStrength: 0.55`, this means a single height-field step that fires reduces direct diffuse and direct specular to **45 %** of their unoccluded values.

Full issue table:

| Issue | Code evidence | Visual consequence |
|-------|--------------|-------------------|
| Binary hard cutoff | `if (_sampleH > _wantedH) { _shadow = 1.0 - uShadowStrength; break; }` | Any blocker → same massive darkening |
| No bias/deadzone | Comparison is `>` with no offset | Procedural height noise (peak-to-peak ≈ 0.04) self-shadows trivially |
| No penumbra softness | No `smoothstep` anywhere in the shadow loop | Transition from lit to shadowed is a hard step — reads as a sharp stain edge |
| No distance weighting | All loop steps produce the same `_shadow = 1 - strength` | Far and near blockers are equally damaging |
| No max-occlusion cap | Shadow can always reach `1 - 0.55 = 0.45` from a single blocker | Cannot restrict gallery-display max darkening |
| Strength too high for display | `selfShadowStrength: 0.55` in the high preset | 55 % dampening is excessive for a normal gallery view |

### v0.05 technical execution plan (summary)

The v0.05 plan in `plan.md` now specifies, file-by-file and line-by-line:

1. **S2 — `src/config/quality.ts`:** Add `selfShadowBias`, `selfShadowSoftness`, `selfShadowMaxOcclusion`, `selfShadowFilterRadius` to `QualityPreset`. Lower high-preset `selfShadowStrength` from 0.55 → 0.30.
2. **S3 — `src/materials/PaintingMaterial.ts`:**
   - New uniforms: `uShadowBias`, `uShadowSoftness`, `uShadowMaxOcclusion`, `uShadowProfileScale`.
   - New method `setShadowProfileScale(scale: number)` — called by `main.ts` on profile switch.
   - New method `setShadowDebug(enabled: boolean)` — compiles `PAINTING_DEBUG_SHADOW`.
   - Replace binary GLSL loop with accumulation loop using `smoothstep(0, softness, excess)`, reciprocal distance weighting, and `clamp(occlusion, 0, maxOcclusion)`.
3. **S4 (optional) — 3-ray PCF-like filter** gated by `selfShadowFilterRadius > 0` and `PAINTING_USE_SHADOW_FILTER` define.
4. **S5 — `src/main.ts`:** Call `setShadowProfileScale(0.5)` for display profiles and `setShadowProfileScale(1.0)` for inspection profiles in `applyPreferences()`.
5. **S6 — `src/main.ts`:** Add `s`/`S` debug key (alongside existing `a`) to call `setShadowDebug()`.

### New GLSL contract (v0.05 target)

```
occlusion = Σ( smoothstep(0, softness, sampleH - wantedH - bias) * (1 / (step + 1)) )
occlusion /= totalWeight
occlusion  = clamp(occlusion, 0, maxOcclusion)
shadow     = 1 - strength * occlusion * profileScale
```

With high-preset defaults (bias=0.03, softness=0.10, maxOcc=0.28, strength=0.30, profileScale=0.5):
- Maximum display darkening: `0.30 × 0.28 × 0.5 = 4.2 %` of direct light — subtle texture, not a stain.
- Inspection: `0.30 × 0.28 × 1.0 = 8.4 %` — soft relief.

Research URLs:

- LearnOpenGL — Parallax Mapping: https://learnopengl.com/Advanced-Lighting/Parallax-Mapping
- Three.js docs — `Material.onBeforeCompile`: https://threejs.org/docs/#api/en/materials/Material.onBeforeCompile
- Three.js parallax map example: https://threejs.org/examples/?q=paralla#webgl_materials_parallaxmap
- GPU Gems 3 — filtered/soft shadow-map concepts: https://developer.nvidia.com/gpugems/gpugems3/part-ii-light-and-shadows/chapter-8-summed-area-variance-shadow-maps
- StackOverflow — soft shadows for parallax occlusion shaders: https://stackoverflow.com/questions/37067278/soft-shadow-for-parallax-occlusion-shader

## 2026-05-17 - v0.04 implementation findings

- **The fake AO vignette is removed in code.** `ProceduralTextureFactory.generateAO()` now emits a neutral near-white AO texture (`237 + valueNoise * 18`) instead of computing `vignette = 1 - min(1, r2 * 0.55)`. This keeps the AO slot available while preventing procedural edge darkening on flat paintings.
- **The procedural checkerboard source is removed in code.** `generateNormal()`, `generateHeight()`, and `generateRoughness()` now use deterministic smoothstep value noise. No `sin/cos` periodic fields remain in those three map generators.
- **The noise path is dependency-free and deterministic.** `valueNoise2d()` interpolates integer lattice hashes from `latticeHash()` using `Math.imul` and unsigned bit mixing. The seed is derived from the existing artwork hash, so procedural maps stay stable across rebuilds and preset switches.
- **Clearcoat is now preset-gated.** `QualityPreset` gained `clearcoatEnabled`, `clearcoatStrength`, and `clearcoatRoughnessValue`; only high enables clearcoat. Balanced and battery keep the material matte and avoid the clearcoat cost.
- **Surface profiles are now functional metadata, not placeholders.** All built-in artworks set `surfaceProfile`, `GalleryManager` calls `PaintingMaterial.applySurfaceProfile()` after the race-protected load, and `InfoPanel` exposes a readable German surface label.
- **The authored map contract now supports future varnish scans.** `PaintingTextureSet`, `PaintingMapRole`, `ResolvedPaintingTextures`, and `TextureManager.preloadTextureSet()` support a `varnish` role that maps to Three.js `clearcoatMap`.
- **A high-preset height fallback gap was fixed.** `GalleryManager.shouldFillRole('height')` now generates a procedural height map whenever bump, parallax, or self-shadow needs it. This is required for reliable high-preset inspection without authored maps.
- **Validation evidence:** after `npm install`, `npm run lint` passes with only the known TypeScript parser warning; `npm run build` passes with only the known Sass legacy JS API warning. The regenerated preview bundle is ≈ 555.05 KB (gzip ≈ 141.43 KB).

## 2026-05-17 - v0.04 plan elevated to full technical execution guide (code audit)

The v0.04 section in `plan.md` has been rewritten from a high-level strategy into a file-by-file, function-by-function implementation guide. The following code-level findings drove the rewrite.

### Bug 1 — Fake AO vignette (confirmed code location)

`src/materials/ProceduralTextureFactory.ts`, `generateAO()`, lines 207–213:
```ts
const vignette = 1 - Math.min(1, r2 * 0.55);
```
`r2` is the squared normalized distance from the texture centre `(0,0)`. At the corners `r2 ≈ 2`, so `vignette ≈ 0`. At the centre `r2 = 0`, so `vignette = 1.0`. The result is a flat painting that is ~55 % darker at its corners than its centre — visible as the reported "dark spots" / vignette. The fix is to replace the vignette formula with a flat neutral value (`≈0.95`) plus value-noise grain. This eliminates all synthetic edge darkening while preserving the texture slot for future authored AO maps.

Active path: `quality.ts high.aoEnabled = true` → `GalleryManager` → `procedural.generate(id, 'ao', 1024)` → `PaintingMaterial.applyTextures()` binds result as `aoMap` at intensity `1.0`.

### Bug 2 — Periodic checkerboard / cross-hatch pattern (confirmed code location)

`generateHeight()` lines 119–121: `Math.abs(Math.sin(y * 0.12)) * 80` = horizontal bands; `Math.abs(Math.sin(x * 0.09)) * 30` = vertical bands. At 1024 px tile size with `RepeatWrapping` the combined result is a clearly visible half-wave grid when the painting is examined under raking light. `Math.abs(sin)` folds the sinusoid into a sawtooth of half-period arches — exactly what brush-stroke channels should NOT look like.

`generateNormal()` lines 95–98: two `sin(x*0.42*f)*cos(y*0.38*f)` octaves and a `sin((x+y)*0.11*f)` diagonal weave create a deterministic 2D lattice that repeats visibly at every resolution.

`generateRoughness()` lines 145–148: same pattern at lower amplitudes.

Fix: all three functions replaced with multi-octave value noise (smoothstep-interpolated integer lattice hash). The new `valueNoise2d()` + `latticeHash()` helpers are pure JS, no external dependency, seeded by the existing `hash(artworkId)`.

### Gap 1 — SurfaceProfile and clearcoat not wired

`artworks.ts` defines `SurfaceProfile` and every `Artwork` has `surfaceProfile?: SurfaceProfile`, but none of the four artwork entries set it. `PaintingMaterial` constructor hard-codes `clearcoat: 0.0` and never reads `surfaceProfile`. `quality.ts` has no clearcoat fields. Fix: add `clearcoatEnabled`, `clearcoatStrength`, `clearcoatRoughnessValue` to `QualityPreset`; add `applySurfaceProfile()` to `PaintingMaterial`; set `surfaceProfile` on all four artworks in `artworks.ts`; call `applySurfaceProfile()` in `GalleryManager` after artwork load.

### Gap 2 — No varnish map role in the texture contract

`PaintingMapRole` and `PaintingTextureSet` do not include a `'varnish'` slot. Three.js 0.166 `MeshPhysicalMaterial.clearcoatMap` accepts a grayscale texture for per-pixel clearcoat intensity. Fix: add `'varnish'` to the role union, the set interface, and the resolved-textures interface. `TextureManager.preloadTextureSet()` will automatically pick it up when added to the roles array.

### Noise algorithm (new, validated)

The `valueNoise2d(x, y, seed)` implementation uses smoothstep fade curves and bilinear interpolation from `latticeHash(ix, iy, seed)`. The hash function is a cascade of LCG multiply + XOR + Murmur-style mix using `Math.imul` (ES2016). Constants: 1664525, 1013904223, 1540483477, 0x45d9f3b. These are standard constants used in WebGL procedural noise implementations and produce good avalanche without any sin/cos dependency.

### File change count

11 files changed, no new npm dependencies, no changes to GLSL. See v0.04 section in `plan.md` for slice-by-slice execution instructions.

## 2026-05-17 - v0.04 photorealism follow-up: initial artifact diagnosis and research

- **The reported "dark spots / vignette" complaint matches the current procedural AO implementation.** `ProceduralTextureFactory.generateAO()` explicitly synthesizes a centre-bright / edge-dark radial mask ("Soft vignetted ambient-occlusion suggestion"). On a flat painting surface this reads less like real occlusion and more like a bug baked into the artwork, especially when no physical frame lip or recess justifies it.
- **The reported checkerboard / unnatural pattern complaint matches the current periodic procedural support maps.** `generateNormal()`, `generateHeight()`, and `generateRoughness()` are built from layered `sin/cos` waves and cross terms. This gives a deterministic fallback but also creates visibly synthetic repetition that can look like a checkerboard or woven shader texture instead of irregular pigment, canvas, or varnish structure.
- **Current v0.03 realism is still "procedural placeholder realism", not scan-grounded painting PBR.** The material is much better than v0.02/v0.01, but the remaining artifacts show that believable close-up painting surfaces likely need authored/scanned support maps or at least far quieter procedural fallback data.
- **Museum/conservation sources separate faithful display light from relief-reveal inspection light.** Raking light is valuable for showing brushwork, deformation, and condition, but it is not the everyday "true appearance" presentation mode. This supports keeping `gallery-soft` as the main lane and `raking-inspection` as the technical lane rather than merging them.
- **Cultural-heritage imaging sources point toward RTI / PTM / photometric surface capture when realism matters.** For future artwork packages, normal/specular/relief capture is a more credible direction than inventing stronger procedural weave.
- **Web PBR guidance still supports the current architecture choice.** Using Three.js `MeshPhysicalMaterial` as the base is the right direction; the problem is not "PBR vs non-PBR" but that the current support maps are too synthetic and that the AO fallback is not physically justified for a flat painting.

Research links captured for v0.04 planning:

- Library of Congress — Digital Imaging Workflow for Treatment Documentation: https://www.loc.gov/preservation/resources/ImageDoc/index.html
- CHS Open Source — Raking Light Photography: https://chsopensource.org/services/1-technical-photography-tp/raking-light-photography-rak/
- Hamilton Kerr Institute — Lighting Techniques: https://www.hki.fitzmuseum.cam.ac.uk/about/services/photographicservices/lightingtechniques
- Smithsonian MCI — Reflectance Transformation Imaging: https://mci.si.edu/reflectance-transformation-imaging
- discoverthreejs — Physically Based Rendering: https://discoverthreejs.com/book/first-steps/physically-based-rendering/
- Three.js MeshPhysicalMaterial clearcoatMap: https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial.clearcoatMap
- Rami James — Physically Based Rendering in Three.js: https://www.ramijames.com/learn-threejs/building-blocks/physically-based-rendering

## 2026-05-17 - v0.03 fresh-clone revalidation audit

- In a fresh checkout, `npm run lint` initially failed with `eslint: not found` because dependencies were not yet installed.
- In the same fresh checkout, `npm run build` initially failed before `npm install` because required packages such as `three` were missing from `node_modules`.
- After `npm install`, `npm run lint` passed successfully. The only output was the already-known `@typescript-eslint` warning that the current TypeScript version (`5.9.3`) is outside the parser's officially supported range; this is non-blocking.
- After `npm install`, `npm run build` passed successfully and regenerated the preview bundle. The build emitted the current non-blocking Dart Sass legacy JS API deprecation warning.
- Re-checking the generated bundle showed the v0.03 shader gates and uniforms (`PAINTING_USE_PARALLAX`, `PAINTING_USE_SELFSHADOW`, `PAINTING_DEBUG_ALBEDO_ONLY`, `uKeyLightDir`) now appear **12** times in `customer-preview/freyraum-gallery.js`. Earlier documentation that said 11 was stale and has been corrected.

## 2026-05-17 - v0.03 implementation findings

- **`geometryLightDirection` is not a Three.js built-in.** The v0.03 plan referenced this identifier inside Slice 5, presumably borrowed from a different engine. Three.js' fragment-shader chunks expose `vViewPosition`, `vNormal`, `vTangent`, and `vBitangent` (the latter two only when `USE_TANGENT` is defined, which happens automatically when the geometry has a tangent attribute *and* the material uses a normal map). For directional information the only correct path is to push a uniform from CPU side. The implementation now uses `uKeyLightDir` in **view space**, transformed each frame in `main.ts` via `worldDir.transformDirection(camera.matrixWorldInverse)` so it matches the space of `vTangent`/`vBitangent`/`vNormal`. Math-space contract is documented at the top of `PaintingMaterial.ts`.
- **Tangent computation must precede first material assignment.** Three.js inspects geometry attributes only when compiling the program. If `geo.computeTangents()` is called *after* the first material attach, `vTangent` varyings stay undeclared even after recompile because `vertexTangents` is sampled from the cached geometry-version snapshot. The implementation calls `computeTangents()` inside `makeArtworkGeometry` so the attribute exists before `new THREE.Mesh(geo, material)`.
- **`USE_TANGENT` requires `flatShading === false`.** Verified against `node_modules/three/src/renderers/webgl/WebGLPrograms.js:294`. Setting `material.flatShading = true` (we do not, but worth recording) would silently drop the varyings and break parallax.
- **Parallax and bump perturbation cannot share a height field amplitude.** The original v0.03 plan kept `bumpStrength = 0.035` on the high preset while also enabling parallax. The same height texture would have driven both UV displacement *and* normal perturbation, producing exaggerated relief. The "single source of truth per preset" rule from the plan was enforced by setting `bumpStrength = 0.0` on the high preset (parallax owns depth) and `parallaxEnabled = false` on the balanced preset (bump owns depth). Battery preset disables both.
- **`vMapUv` vs `vNormalMapUv` agree because both maps use uv0.** Three.js maintains separate varyings per map slot but they collapse to the same value when both maps sample uv channel 0. The parallax injection still uses `pUV` for both samples explicitly so a future move of the normal map to uv1 (e.g. for AO) does not silently desynchronise relief from shading.
- **`SpotLight.target` defaults to a detached `Object3D`.** A `THREE.SpotLight` constructed without an explicit target receives a fresh `Object3D` at world origin, but that target is **not** added to the scene. Animating the spot position works, but if anything ever needed to read `spot.target.position` it would silently disagree with the world. `LightingSetup` now owns a single shared `spotTarget` added to the scene; every spotlight points at it. This is the audited fix for the latent bug introduced by repositioning keys closer to the artwork.
- **Procedural cache must key on resolution.** `ProceduralTextureFactory.generate(id, role)` was unique per artwork+role in v0.02. When v0.03 added per-preset resolutions a user switching from battery (256 px) to high (1024 px) would have continued to receive the 256 px texture. The cache key now includes `tileSize` so each resolution is generated and cached independently.
- **Reduced-motion should not flatten shadows.** The detail-normal contribution is scaled by `uReducedMotionScalar` because animated detail can be a vestibular trigger. Direct-light self-shadow is *not* scaled — shadows are not motion, and silencing them would corrupt the picture's perceived relief in a way that contradicts accessibility intent (clarity, not flattening).
- **Albedo-only QA toggle belongs in a debug lane, not the visitor UI.** Exposing an "no shading" toggle to public visitors would create a fidelity contradiction (the painting suddenly looks different). The implementation gates it behind `?debug=1` URL param and an `a` key press, with a `console.info` line announcing availability when the param is present. The lighting profile selector, by contrast, IS a legitimate visitor choice and lives in `PreferencesPanel` under "Beleuchtung".
- **Inspection overscroll vs safety margin.** v0.02's `PAN_SAFETY_FACTOR = 0.92` multiplied the available pan range by 0.92, leaving an 8 % unreachable band around the artwork. v0.03 replaces this with an additive `INSPECTION_OVERSCROLL = 0.5` (world units) so the viewport centre can reach the artwork edge plus a small breathing margin — this is the formula the plan's "every corner reachable" acceptance criterion was actually asking for.
- **Validation evidence (2026-05-17):** `npm run lint` clean; `npm run build` clean. Customer-preview bundle `freyraum-gallery.js` ≈ 552 KB (gzip ≈ 141 KB), CSS ≈ 15.4 KB (gzip ≈ 3.4 KB). Bundle growth from v0.02 (~528 KB) accounts for the new parallax and self-shadow shader chunks, the lighting profile UI strings, and `?debug=1` plumbing.

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

## 2026-05-17 - v0.02 implementation findings

### Shader strategy: native-first

The audited plan recommended an `onBeforeCompile` GLSL injection of roughness, specular, AO, detail normal, bump, and grazing-light. The actual implementation in `PaintingMaterial.ts` is **smaller**: only the detail-normal blend, bump-after-normalMap path, and grazing boost are injected. Albedo / base normal / roughness / specular / AO are wired through native `MeshPhysicalMaterial` properties (`map`, `normalMap`, `roughnessMap`, `specularIntensityMap`, `aoMap`). This is more reliable because:

- Three.js' built-in roughness, specular, and AO chunks are correct and well tested.
- Three.js handles colour-space conversion correctly only when the property is set natively.
- Fewer string replacements means fewer chances of breaking when Three.js updates shader chunks in a future minor.

The same correctness rules from the audited plan still apply (the detail normal is blended in tangent space before `tbn * mapN`, never added to the view-space normal).

### Bump + normal coexistence (the audited correctness fix)

Three.js' `normal_fragment_maps` chunk is structured as `if (USE_NORMALMAP_OBJECTSPACE) … elif (USE_NORMALMAP_TANGENTSPACE) … elif (USE_BUMPMAP)`. With both `normalMap` and `bumpMap` set, the native bump branch is dead code, but Three.js still declares `dHdxy_fwd()` and `perturbNormalArb()` because `USE_BUMPMAP` is defined. We exploit this: after the tangent-space normal branch finishes, our `PAINTING_USE_BUMP` injection calls `perturbNormalArb(-vViewPosition, normal, dHdxy_fwd() * uBumpStrength, faceDirection)`. The native `bumpScale` uniform is left at `1.0` and we drive the strength through our own uniform so the preset can vary it without recompile.

### Aspect-ratio robustness — practical outcomes

- The existing `fitWithinBox`/`updateAspect` machinery already covered all aspect ratios for v0.01 — the v0.02 work added one new aspect-aware quantity: detail-normal tiling. Without aspect-aware tiling, an ultrawide painting (7:3) would show canvas weave stretched 2.33× along U vs V. The fix is `uDetailTiling = vec2(width × density, height × density)` so each UV step covers the same physical distance in both axes. Density is currently `2.0` tiles per world unit and looks correct on all four sample artworks (3:2, 3:4, 1:1, 7:3).
- Frame margin is uniform `0.4` world units on both axes regardless of aspect; the frame box itself is scaled with the same per-axis ratios as the artwork plane.
- Anisotropic filtering capped at `maxAnisotropy / divisor` per preset prevents tilted-view aliasing on landscape and ultrawide artworks (where horizontal raking light makes mip-level discontinuities most visible).

### Texture-resolution handling

- `getTextureSize` reads `naturalWidth/naturalHeight` first, falling back to `width/height` for `ImageBitmap` / `DataTexture` / `CanvasTexture`. This works for every texture type the application creates and is unchanged from v0.01.
- The texture cache key in `TextureManager` is now `${role}::${url}` so the same underlying file loaded as `albedo` vs `normal` does not collide (the two carry different colour spaces).
- `DataTexture` instances from `ProceduralTextureFactory` enable mipmaps and `LinearMipMapLinearFilter`, so the procedural canvas weave does not alias on close zoom or at oblique view angles.

### Lifecycle / async correctness

- `GalleryManager.showArtwork` is now async and uses an `artworkLoadToken` counter — a stale completion is silently dropped. This was the audited race fix; without it, navigating rapidly during a long `preloadTextureSet` could assign the previous artwork's map set to the current artwork.
- `ArtworkMesh.dispose` only disposes geometry and the material; painting textures are never disposed by the material. Disposal is owned by `TextureManager` and `ProceduralTextureFactory`; `main.ts` calls `galleryManager.proceduralFactory.disposeAll()` on `beforeunload`.

### Adaptive quality — guardrails learned during implementation

- The cooldown after a navigation or preset change must be long enough to cover both the artwork texture transition AND the shader recompile spike that happens when `definesChanged` triggers `material.needsUpdate = true`. A 600 ms navigation cooldown plus a 4000 ms post-downgrade hold-off prevents cascade downgrades.
- Manual preset changes must suspend the controller for the rest of the session; otherwise an automatic re-downgrade reverses the user's intent within a few seconds. The first implementation compared only `previousQuality` against the new value, which accidentally made the controller suspend itself on its own downgrade. The corrected implementation adds an explicit `adaptiveQualityWriteInFlight` flag in `main.ts` so only genuine user-initiated quality changes count as manual overrides.
- Quality-preset changes must rebuild the currently visible artwork's resolved map set immediately. Without that extra step, switching from `high`/`balanced` to `battery` could leave roughness/specular/detail maps attached on the current artwork until the user navigated away and back. `GalleryManager.applyPreset()` now re-runs `showArtwork(currentIndex)` (race-protected by `artworkLoadToken`) so preset transitions are correct instantly.
- Per-preset anisotropy changes must update already-cached textures, not just future loads. `TextureManager.setAnisotropyDivisor()` now reapplies the new anisotropy cap across the cache.

### WebGPU probe — what it actually proves

- The probe is informational only and never participates in rendering. With `?backend=webgpu` it logs adapter info and limits on supporting browsers.
- The first implementation attempt kept the probe in `src/rendering/WebGPUPrototype.ts`, but a deep audit showed that the repository's **IIFE file:// preview build cannot rely on Rollup code splitting** for this guarantee. The corrected implementation moves the probe to `public/webgpu-probe.js` and loads it via `import(/* @vite-ignore */ new URL('./webgpu-probe.js', window.location.href).toString())`. That keeps the probe completely out of `customer-preview/freyraum-gallery.js`.
- The probe-result shape uses plain `string`/`number` fields rather than DOM `GPUAdapterInfo` types so it stays serializable across TypeScript DOM-lib versions and is safe to log/persist.

### Validation results (this session)

- `npx tsc --noEmit` — clean.
- `npm run lint` — clean.
- `npm run build` — clean. Output:
  - `customer-preview/style.css` — 15.36 kB / gzip 3.42 kB (unchanged)
  - `customer-preview/freyraum-gallery.js` — 546.50 kB / gzip 139.68 kB (up from ~528 kB / 134 kB in v0.01)
  - `customer-preview/webgpu-probe.js` — 2.32 kB (separate runtime-only experimental probe module)
- The bundle growth is consistent with the budget (~+18 kB raw / +6 kB gzipped). Three.js itself dominates the bundle; the new modules are a small overhead on top.
- Deep preview audit confirmation: `customer-preview/freyraum-gallery.js` contains the runtime `import(new URL('./webgpu-probe.js', window.location.href).toString())` call but does **not** contain the probe implementation (`requestAdapterInfo`, limit enumeration, `initWebGPUPrototype` body). The probe code lives only in `customer-preview/webgpu-probe.js`.
- `Artwork.textureSet?` is the integration point for future authored asset sets. No code changes will be needed when scanned assets become available; only `public/assets/...` files and a `textureSet` value in `artworks.ts`.

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

## 2026-05-17 - v0.03 execution plan finalization

The v0.03 plan was finalized into a code-execution-ready document after reading all 12 source files it references. The following code-level observations were made that directly informed the execution plan:

- `PaintingMaterial` constructor uses `clearcoat: 0.04`, `specularIntensity: 1.0`, `uLightGrazingBoost: 0.6` — these are the exact values that make the default render feel varnished/glossy. All three must be lowered for the matte-canvas goal.
- `ProceduralTextureFactory.generateRoughness` currently outputs values in the `[60..220]` range (a wide range that includes semi-gloss territory). The `generateSpecular` Gaussian blobs peak at `200` over a `12` baseline. Both are too prominent for a matte-first material.
- The current `gallery-soft` key light at `{ x: -10, y: 5, z: 7 }` has an angle from vertical of approximately **68°**. This is theatrical and dramatic but not gallery-appropriate. A true museum 30° key would require `{ x: -1.7, y: 5, z: 2.9 }` (using tan(30°)); a practical 45° compromise that retains enough asymmetry for relief readability during pan/zoom is `{ x: -3, y: 5, z: 4 }`.
- `GalleryManager.getPanLimits` multiplies by `PAN_SAFETY_FACTOR = 0.92`. This is the only thing preventing edge/corner inspection. Replacing with `artworkEdge + INSPECTION_OVERSCROLL (0.5 world units)` is a one-line change.
- `QualityPreset.bumpStrength = 0.012` (high preset) is too subtle for visible parallax depth feel. The execution plan raises this to `0.035`.
- `ArtworkMesh.makeArtworkGeometry` does not call `computeTangents()`. This must be added before parallax is implemented because `vTangent` attribute is required.
- `ProceduralTextureFactory.generate()` cache key is `artworkId::role`. It must be extended to `artworkId::role::tileSize` before the tile size is parametrised to avoid stale cache hits when switching presets.

## 2026-05-17 - v0.03 technical rendering and lighting follow-up findings

- The current v0.02 material already preserves the original artwork as the albedo texture, but the combination of bloom, clearcoat, specular maps, and grazing-light amplification can still change the *perceived* character of the picture. Future work therefore needs an explicit fidelity lane (`albedo-only` vs `shaded`) so the team can prove the shader is not reinterpreting the source art.
- The current relief path is technically correct but visually limited: tangent-space detail normals plus derivative bump perturbation are active, yet the fallback `normal`, `detailNormal`, and `height` maps are only 256 px tiles. This means zoomed inspection quality is bounded by the fallback generator, not by the current artwork image resolution.
- The current procedural system is deterministic, but not yet resolution-aware. `ProceduralTextureFactory` caches by `artworkId::role`; v0.03 should expand this to include preset tier, target tile size, octave recipe, and surface profile so future modular artwork swaps do not depend on the shipped sample assets.
- The requested 3D feeling is better framed as a preset-gated **parallax occlusion mapping style** path, not geometric displacement. For the current Three.js/WebGL production target, the most practical high-end route is tangent-space UV offset from a height field plus a short light-direction self-shadow approximation, with the existing normal+bump path retained as balanced/battery fallback.
- Self-shadowing should modulate direct light only, never darken the albedo texture directly. This preserves picture fidelity while still letting raking light reveal surface depth.
- The current pan limitation is directly caused by `GalleryManager.getPanLimits()` multiplying the free range by `PAN_SAFETY_FACTOR = 0.92`. v0.03 should replace this with explicit inspection-bound math based on visible world size, artwork size, zoom level, and a configurable overscroll margin.
- Future asset swaps must not rely on today's source image sizes. The correct abstraction is an **effective texel density** / surface profile system that chooses authored or procedural support maps based on zoom, display size, and preset, not on hard-coded assumptions about the current images.
- The current lighting presets are useful but too loosely specified for the new goal. `gallery-soft` is artistic, `raking-inspection` reveals relief, but v0.03 should define a more explicit gallery-display contract: artistic key/fill composition, glare-aware placement, and enough asymmetry that surface detail remains readable while the artwork is moved on screen.

### Online lighting research captured for v0.03

The lighting direction above is now backed by online gallery-lighting guidance gathered during this session:

- A **primary lighting angle around 30° from vertical** is commonly recommended for paintings because it reduces glare and reflected hotspots while still modelling the surface.
- **Warm-white lighting around 3000–3500 K** is commonly recommended for painting display because it feels gallery-appropriate and flattering without becoming obviously yellow or cold.
- **High CRI (90–95+)** is preferred in physical gallery installations for faithful colour appearance; in the renderer this should be treated as a visual target for colour-faithful lighting rather than a literal API property.
- **Raking light** is specifically used when the goal is to reveal texture, brushwork, impasto, craquelure, and other surface features. That makes it the right reference model for the v0.03 inspection profile, not for the default display profile.
- The practical implication for Freyraum is to separate **gallery-display lighting** from **relief-inspection lighting** instead of trying to make one light setup solve both perfectly.

### Sources consulted

- [UNION Fine Art Services — Optimal Lighting Angles for Art Installation](https://unionfas.com/optimal-lighting-angles-for-art-installation/)
- [Encore Lighting — Art Gallery Lighting Complete Guidelines](https://encore-lite.com/art-gallery-lighting-guidelines/)
- [ASM Lighting — Museum Lighting Standards & LED Solutions](https://www.asmlighting.com/museum-lighting-standards-led-solutions/)
- [Conserv — Museum Lighting Ultimate Guide](https://conserv.io/museum-lighting/)

## Validation notes

- This audit pass changed markdown documentation only; no runtime source files or dependencies were modified.
- In this session, `npm install`, `npm run lint`, and `npm run build` were executed successfully after dependency installation, so the documented validation notes now reflect an actual fresh-clone audit run.
- Automated code review and CodeQL validation should still be run before finalizing because the repository workflow validates all committed changes.
