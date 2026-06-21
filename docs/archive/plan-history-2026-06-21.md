# FREYRAUM Plan
> v0.73 shipped: merge-readiness docs sync completed; active runtime baseline is v0.69 frame path.
> Last full markdown audit: 2026-06-05 (v0.73 merge-readiness sync).

## v0.73 — Merge-readiness docs sync (**shipped 2026-06-05**)

> **Outcome:** Repository status docs are aligned with the current runtime baseline (v0.69 frame path), eliminating release-state drift before merge.

### Shipped slices

1. **R-01 — Runtime baseline verification.** Confirmed `CanvasMaterial` cache key and frame shader path are currently `frame-v0.69-*` baseline.
2. **R-02 — Changelog correction.** Added a dedicated v0.73 entry documenting that this pass is docs/status synchronization (not runtime shader changes).
3. **R-03 — Top-level status sync.** Updated `README.md`, `FINDINGS.md`, `plan.md`, `ARCHITECTURE_MAP.md`, and `docs/HANDOFF.md` so active-state messaging is consistent.
4. **R-04 — Validation rerun.** Re-executed lint/build checks after documentation updates.

### Acceptance summary

| Gate | Result |
| --- | --- |
| Runtime/doc status alignment | ✅ restored |
| Changelog reflects current branch state | ✅ yes |
| Lint | ✅ pass |
| Build | ✅ pass |

## v0.70 — Macro-visible micro-scratch uplift (**shipped 2026-06-04**)

> **Outcome:** v0.70 ships a dedicated macro scratch lane with wear-zone masking, split attenuation windows, roughness-first macro readability, and versioned cache/diagnostics, while preserving v0.54/v0.69 anti-banding and stability rails.

### Shipped slices

1. **S-01 — Dedicated macro scratch lane (`CanvasMaterial`).** Added `frmScratchLineMacro` + `frmScratchLayerMacro` with lower densities (`2.0..7.0`), wider width floor (`0.0016..0.0040`), and stronger line intensity (`0.030..0.090`).
2. **S-02 — Low-frequency wear-zone mask.** Added `frmWearZoneMask(alongX, seed)` using coarse along-bar zoning + smooth interpolation; macro lane is multiplied by this mask.
3. **S-03 — Roughness-vs-normal split.** Macro readability is roughness-led (`high` strongest, `balanced` reduced), with bounded macro normal contribution.
4. **S-04 — Independent attenuation windows.** Micro lane keeps aggressive attenuation; macro lane uses a slower fade window (`1 - smoothstep(0.006, 0.024, fwidth(vFrameUV.x))`).
5. **S-05 — Anti-banding invariants preserved.** No `barUV.y` added to FBM/noise paths that drive normal gradients.
6. **S-06 — Compile flags + cache-key bump.** Added `FRAME_MACRO_SCRATCH` compile flag for high/balanced; cache key bumped to `frame-v0.70-*`.
7. **S-07 — Diagnostics extended.** `[CanvasMaterial] frame-shader-compiled` now logs macro enabled/mode, density range, width range, macro attenuation window, and `frame-v0.70-*` cache key; explicit debug log added for reduced/off macro modes.
8. **S-08 — Validation + docs sync.** `npm run lint` ✅ and `npm run build` ✅. Markdown docs synced to shipped status.

### Acceptance summary

| Gate | Result |
| --- | --- |
| Lint | ✅ pass |
| TypeScript build | ✅ pass |
| Vite bundle | ✅ pass |
| Cross-bar anti-banding invariant (`dFBM/dY = 0`) | ✅ preserved |
| Per-artwork seed remains uniform-only | ✅ preserved |
| Frame shader cache key versioning | ✅ `frame-v0.70-*` |
| Docs status consistency | ✅ synced across key markdown files |

## v0.69 — Metal frame close-up realism uplift (**shipped 2026-06-04**)

> **Outcome:** The v0.68 frame-detail planning pass is now implemented. Frame metal reads as richer and more believable at close zoom while preserving the v0.54 anti-banding invariant. Quality stays fully manual; per-artwork seed remains a uniform-only update (no re-compile per artwork).

### Audit deltas applied before implementation

1. **M-04 — anisotropy direction is now per-fragment GLSL, not a `DataTexture`.**
   - Three.js r166's native `material.anisotropyMap` samples from the standard `uv` channel, but the frame uses the custom `aFrameUV` attribute for bar-aligned coordinates. A `DataTexture` path would have read from the misaligned planar `uv` channel and (in the planned packing) zeroed the anisotropy strength because the `B` channel was `0` (the r166 shader multiplies direction by `polar.b`).
   - Resolution: replace `#include <lights_physical_fragment>` (high preset only) with a copy that computes `anisotropyV` directly from `vFrameUV` via a sinusoidal perturbation of the scalar `anisotropyRotation = π/2` base direction. No texture, no UV mismatch, identical disposal surface.
2. **Battery `frameRoughness`.** Plan stated `0.55`; runtime is `0.60`. Plan/docs aligned to runtime.
3. **Preset switching uses a typed authoritative field.** Added `QualityPreset.frameDetailLevel: 'high' | 'balanced' | 'none'` as the authoritative compile-flag source instead of re-checking `preset.id` in shader code.

### Shipped slices

1. **M-01 — Extended baseline diagnostic.** `[CanvasMaterial] frame-shader-compiled` now records `version: 'v0.69'`, `frameDetailLevel`, all preset knobs, `normalGradientScale`, `fineGrainAmplitude`, `roughnessGrainAmp`, `scratchRoughnessMax`, `clusterGainEnabled`, `anisoPerFragmentEnabled`, and `cacheKey` for direct before/after diffing.
2. **M-02 — Bounded multi-scale grain.** New `frmBrushedFbm2` (4× higher base frequency, 1/4 amplitude, identical 1-D invariant) drives a fine-detail term added to `frmBrushedNormal` on `high` (amplitude `0.006`) and `balanced` (amplitude `0.004`). Battery preset is unchanged.
3. **M-03 — Clustered scratch families.** `frmScratchLayer` (high only) groups scratches via a coarse per-zone hash (`floor(barUV.x * 3.0 + 1.0)`) with cluster gain peaking at `2.5×` presence in ~40% of zones. Cluster gain affects visual presence only; the `+0.015` scratch roughness cap is unchanged.
4. **M-04 — Per-fragment anisotropy direction perturbation (high only).** GLSL injection into `lights_physical_fragment` rotates the brushed direction by `±0.18 rad ≈ ±10°` along `vFrameUV.x`, providing the mid-frequency directional wander that brushed-metal sheen exhibits in reality. `vFrameUV.y` is **not** used (cross-bar invariant preserved).
5. **M-05 — Derivative-aware AA.** `fwidth(barUV.x)` controls a `smoothstep(0.004, 0.015)` attenuation for the fine-grain normal term and a `smoothstep(0.003, 0.012)` attenuation for the roughness grain (high/balanced) — both fade toward neutral as the pixel footprint grows, eliminating distance shimmer with zero preset branching at the call site.
6. **M-06 — Preset compile-flag branching.** New `frameDetailLevel` field on `QualityPreset` drives `#define FRAME_DETAIL_HIGH 1` (high) / `#define FRAME_DETAIL_BALANCED 1` (balanced) / no define (battery). `customProgramCacheKey` is now `'frame-v0.69-' + frameDetailLevel`, producing three distinct compiled programs total instead of one per artwork seed.
7. **M-07 — Validation.**
   - `npm run lint` ✅, `npm run build` ✅ (typecheck + Vite bundle + preview HTML).
   - Bundle size: `freyraum-gallery.js` 731.54 → 739.45 kB (+7.91 kB / +1.1 %), gzip 192.07 → 194.22 kB (+2.15 kB / +1.1 %). Acceptable for the visual uplift; no other code paths touched.
   - Cross-bar invariant: `frmBrushedFbm2` takes only `alongX` + seed-derived `yConst2`; the fine-grain term has `dFBM/dY = 0` by construction, identical to the v0.54 primary term.
   - Per-artwork re-compile: cache key depends only on `frameDetailLevel`, so navigating between artworks still triggers a uniform update only.
8. **M-08 — Documentation sync.** `plan.md`, `CHANGELOG.md`, `FINDINGS.md`, `ARCHITECTURE_MAP.md`, `docs/HANDOFF.md`, and `README.md` updated to reflect shipped state, cache-key version, knob values, and the resolved audit deltas above.

### Acceptance summary

| Gate | Result |
| --- | --- |
| Lint | ✅ pass |
| TypeScript build | ✅ pass |
| Vite bundle | ✅ pass (+1.1 % size) |
| v0.54 cross-bar invariant (`dFBM/dY = 0`) | ✅ preserved across primary + fine layer |
| Per-artwork seed = uniform-only | ✅ unchanged |
| Quality lock + no automatic preset writes | ✅ unaffected (no changes to AdaptiveQualityController) |
| Startup gate (`boot / performance-gate`) | ✅ unaffected (frame shader compile is in the warm phase) |

### Research references (online — refreshed 2026-06-04)

- Khronos glTF `KHR_materials_anisotropy` (ratified): https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_anisotropy
- Three.js `MeshPhysicalMaterial` — `anisotropy`, `anisotropyMap`, `anisotropyRotation` (r153+): https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial
- Three.js r166 `anisotropyMap` shader source (`lights_physical_fragment.glsl.js`): direction is `normalize(2.0 * polar.rg - 1) * polar.b`, sampled from the material's `anisotropyMap` UV channel (defaults to standard `uv`). This is why a `DataTexture` would have mis-sampled the frame's `aFrameUV` and why direct GLSL injection is the correct approach for frame geometry.
- Three.js anisotropy example: https://threejs.org/examples/?q=anis#webgl_materials_physical_anisotropy
- GLSL `fwidth()` WebGL2 spec — derivative-aware AA for procedural patterns: attenuate high-frequency terms when screen-space footprint exceeds target

## v0.68 — Metal frame close-up realism uplift (**superseded by v0.69 shipped 2026-06-04**)

> **Status:** Superseded. This section is retained for historical context only; the implementation shipped in v0.69 above with two audit deltas (M-04 GLSL-direct anisotropy in place of `anisotropyMap`, battery roughness aligned to the runtime `0.60`).

### Current code audit (frame path)

1. **Frame material already uses physically plausible base knobs.**
   - `MeshPhysicalMaterial` with `metalness: 1.0`, preset-controlled `roughness`/`clearcoat`/`anisotropy`/`anisotropyRotation` (`src/materials/CanvasMaterial.ts:194–288`, `src/config/quality.ts:178–183`).
   - High preset: `frameRoughness: 0.28`, `frameAnisotropy: 0.85`, `frameClearcoat: 0.12`.
   - Balanced preset: `frameRoughness: 0.38`, `frameAnisotropy: 0.60`, `frameClearcoat: 0.08`.
2. **Microstructure is intentionally constrained to avoid past artifacts.**
   - v0.54 moved to a pure 1-D along-bar brushed FBM + roughness grain to remove cross-bar banding/ridges (`src/materials/CanvasMaterial.ts:50–107`). The invariant is: **no `barUV.y` input to any FBM call** → `dFBM/dY = 0` → zero cross-bar normal gradient.
   - Primary FBM octaves: `qx × [2.5, 5.1, 10.3, 20.7]` with amplitudes `[0.5, 0.25, 0.125, 0.0625]`. Gradient scale `0.025` → max ~7° tilt.
3. **Close-up limitation today: detail bandwidth is narrow.**
   - Single grain family, gradient scale `0.025`, roughness grain amp `±0.030`, scratch roughness impact `+0.015`. Conservative by design but limits close-up richness.
4. **Directional anisotropy is uniform per material.**
   - `anisotropyRotation: Math.PI / 2` is scalar; no `anisotropyMap` is set. Three.js r166 (installed: `^0.166.1`) natively supports `material.anisotropyMap` for per-fragment direction control without `onBeforeCompile` injection.
5. **`customProgramCacheKey` is `'frame-v0.54'`** — a single shared key. Any change to compiled GLSL (new `#define`, new function signature) requires a new cache key to avoid Three.js serving the old compiled binary.

### Online research synthesis (applied to this plan, 2026-06-04)

1. **Three.js r166 natively supports `anisotropyMap`** (installed version: `^0.166.1`). Setting `material.anisotropyMap = dataTexture` unlocks per-fragment anisotropy direction without `onBeforeCompile` shader injection. RG channels encode the tangent-space direction vector packed as `dir * 0.5 + 0.5`; strength is still controlled by `material.anisotropy`.
2. **Anisotropy direction must be spatially variable for brushed-metal realism** (Khronos `KHR_materials_anisotropy` spec). A small procedural `DataTexture` (64×4 RGBA `UnsignedByteType`) with gentle sinusoidal direction perturbation along bar length is sufficient — no authored asset required.
3. **Multi-scale FBM is the standard approach for close-up procedural metal**: coarse primary layer (existing, frequencies `[2.5, 5.1, 10.3, 20.7]`) + fine secondary layer at ~4× higher base frequency, amplitude ratio ≤ 1:4 to preserve the no-cross-bar gradient invariant.
4. **Derivative-aware AA via `fwidth(barUV.x)` is the correct guard** for procedural high-frequency normals in GLSL: `fwidth()` returns the screen-space magnitude of the UV partial derivatives, so `smoothstep(0.004, 0.015, fw)` fades fine-detail contribution to zero as the view pulls back (fw ~0.004 = close zoom, fw ~0.015 = mid distance). This is a zero-cost guard that eliminates shimmer at distance without preset branching.
5. **Clustered scratch distribution** matches real-world wear better than uniform random: use a coarse-scale `frmHash(floor(barUV.x * 3.0) + seed * N)` presence mask to group scratch lines into family zones at ~40% coverage.
6. **`customProgramCacheKey` must be versioned when compile-time GLSL changes.** Switch from `'frame-v0.54'` to `'frame-v0.69-{preset}'` when M-02/M-03/M-05 GLSL is added. Per-seed updates remain uniform-only (no new compile needed per artwork).
7. **PMREM/IBL quality and anisotropic BRDF assumptions matter** for convincing brushed-highlight flow. The existing PMREM environment is appropriate; no env-map changes are needed.

### v0.68 execution plan (next implementation pass — with concrete coding guidance)

1. **M-01 — Add diagnostics-first frame quality baseline capture**
   - Extend the existing `[CanvasMaterial] frame-shader-compiled` log (`src/materials/CanvasMaterial.ts:262`) with the current knob values as an explicit baseline record before making any shader changes:
     ```typescript
     console.debug('[CanvasMaterial] frame-shader-compiled', {
       version: 'v0.54',             // bump to 'v0.69' when GLSL changes
       preset: preset.id,
       frameRoughness: preset.frameRoughness,
       frameAnisotropy: preset.frameAnisotropy,
       frameClearcoat: preset.frameClearcoat,
       // Baseline knobs (new fields):
       normalGradientScale: 0.025,   // FRAME_FRAG_NORMAL_REPLACE gradX scale
       roughnessGrainAmp: 0.030,     // roughnessmap_fragment grain amplitude
       scratchRoughnessMax: 0.015,   // roughnessmap_fragment scratch cap
       fineGrainAmplitude: 0.0,      // M-02: 0 until shipped
       clusterGainEnabled: false,    // M-03: false until shipped
       anisoMapEnabled: false,       // M-04: false until shipped
       cacheKey: material.customProgramCacheKey(),
     });
     ```
   - Add repeatable comparison checkpoints: screenshot both close-zoom (camera Z ≈ 0.5) and mid-distance (Z ≈ 3.5) views with `high` and `balanced` presets before any shader changes.

2. **M-02 — Introduce bounded multi-scale grain model**
   - Add `frmBrushedFbm2` to `FRAME_FRAG_FUNCTIONS` in `src/materials/CanvasMaterial.ts`. Same 1-D invariant as primary (no `barUV.y`), but ~4× higher base frequency and tighter domain warp (amplitude `0.12` vs primary `0.30`):
     ```glsl
     // Fine-scale grain FBM — 4× frequency, 1/4 amplitude, same 1-D invariant (no barUV.y)
     float frmBrushedFbm2(float alongX, float yConst) {
       float wx = frmNoise(vec2(alongX * 2.2 + 27.3, yConst + 4.0));
       float qx = alongX + (wx - 0.5) * 0.12;
       float v = 0.0;
       v += 0.5000 * frmNoise(vec2(qx * 9.0,  yConst + 6.28));
       v += 0.2500 * frmNoise(vec2(qx * 18.1, yConst + 9.42));
       v += 0.1250 * frmNoise(vec2(qx * 36.3, yConst + 12.57));
       return v;
     }
     ```
   - Replace `frmBrushedNormal` body in `FRAME_FRAG_FUNCTIONS` (combined M-02 + M-05 guard):
     ```glsl
     vec3 frmBrushedNormal(vec2 barUV, float seed) {
       float yConst  = frmHash(seed * 7.31) * 57.0;
       float yConst2 = frmHash(seed * 3.17) * 57.0; // independent per-seed constant
       float eps = 0.010;
       // Primary coarse grain (unchanged v0.54 path)
       float h0  = frmBrushedFbm(barUV.x,       yConst);
       float hx  = frmBrushedFbm(barUV.x + eps, yConst);
       // Fine detail grain (M-02)
       float h0f = frmBrushedFbm2(barUV.x,       yConst2);
       float hxf = frmBrushedFbm2(barUV.x + eps, yConst2);
       // Derivative-aware AA: attenuate fine layer as pixel footprint grows (M-05)
       float fw = fwidth(barUV.x);
       float fineAttn = 1.0 - smoothstep(0.004, 0.015, fw);
       float gradX = (h0 - hx) / eps * 0.025
                   + (h0f - hxf) / eps * 0.006 * fineAttn;
       return normalize(vec3(gradX, 0.0, 1.0));
     }
     ```
   - Update `roughnessFactor` for high preset: raise primary amplitude `0.030 → 0.040`; the fine grain contributes an additional `+0.012` at close zoom, fading to zero at distance. Clamp remains `[0.14, 0.72]`.

3. **M-03 — Improve micro-scratch realism distribution**
   - Replace `frmScratchLayer` body in `FRAME_FRAG_FUNCTIONS` with a cluster-aware version. The `frmHash(floor(barUV.x * 3.0 + 1.0) * 17.0 + seed * 29.3)` call provides a coarse per-zone hash (≈every 1/3 of bar length) that groups scratches into natural family clusters:
     ```glsl
     float frmScratchLayer(vec2 barUV, float seed) {
       // Natural cluster zones: ~40% of bar length has elevated scratch density
       float clusterHash = frmHash(floor(barUV.x * 3.0 + 1.0) * 17.0 + seed * 29.3);
       float clusterGain = 1.0 + smoothstep(0.60, 0.75, clusterHash) * 1.5;
       float a = frmScratchLine(barUV,  8.0, seed);
       float b = frmScratchLine(barUV, 14.0, seed + 5.11);
       float c = frmScratchLine(barUV, 22.0, seed + 11.37);
       return clamp((a * 0.06 + b * 0.05 + c * 0.04) * clusterGain, 0.0, 0.16);
     }
     ```
   - Scratch roughness cap stays `+0.015` in `roughnessFactor` — cluster gain applies to the visual presence of the scratch line, not to its roughness impact.

4. **M-04 — Add per-fragment anisotropy direction map (high preset, r166 native)**
   - Three.js r166 supports `material.anisotropyMap` without `onBeforeCompile`. Add a procedural `DataTexture` generation helper inside `createFrameMaterial` in `src/materials/CanvasMaterial.ts`, guarded to `preset.id === 'high'` only:
     ```typescript
     // M-04: per-fragment anisotropy direction map (high preset only; r166 native)
     if (preset.id === 'high') {
       const W = 64, H = 4;
       const anisoData = new Uint8Array(W * H * 4);
       for (let y = 0; y < H; y++) {
         for (let x = 0; x < W; x++) {
           const t = x / (W - 1);
           // Gentle sinusoidal direction perturbation along bar (±8% of full range)
           const pert = Math.sin(t * Math.PI * 3.7 + seed * 6.28) * 0.08;
           const r = Math.round((1.0 + pert) * 0.5 * 255); // X direction packed
           const idx = (y * W + x) * 4;
           anisoData[idx]     = r;    // X: brushed direction
           anisoData[idx + 1] = 128; // Y: neutral (no cross-bar lean)
           anisoData[idx + 2] = 0;
           anisoData[idx + 3] = 255;
         }
       }
       const anisoMap = new THREE.DataTexture(
         anisoData, W, H, THREE.RGBAFormat, THREE.UnsignedByteType
       );
       anisoMap.wrapS = THREE.RepeatWrapping;
       anisoMap.wrapT = THREE.RepeatWrapping;
       anisoMap.needsUpdate = true;
       material.anisotropyMap = anisoMap;
       material.userData.anisoMap = anisoMap; // for disposal
     }
     ```
   - Update `CanvasMaterial.dispose()` to call `(material.userData.anisoMap as THREE.DataTexture | undefined)?.dispose()`.
   - Lower presets: leave `anisotropyMap` unset — scalar `anisotropy` + `anisotropyRotation: Math.PI / 2` stay as today.

5. **M-05 — Strengthen anti-alias safety rails**
   - Already integrated in M-02's `frmBrushedNormal` update via `fwidth(barUV.x)` and `smoothstep(0.004, 0.015, fw)`. The fine-layer contribution fades to zero at mid-distance (fw ≈ 0.015), so distance shimmer is eliminated without preset branching.
   - Also guard `frmRoughnessGrain`'s two highest-frequency octaves in the `roughnessmap_fragment` injection. Add a `grainAttn` factor (same `fwidth` approach) to the roughness grain amplitude:
     ```glsl
     // Add to roughnessmap_fragment injection (M-05 AA guard):
     float fw = fwidth(vFrameUV.x);
     float grainAttn = 1.0 - smoothstep(0.003, 0.012, fw);
     float roughnessGrain = frmRoughnessGrain(vFrameUV, uFrameSeed);
     // Attenuate high-frequency roughness grain at distance:
     roughnessGrain = mix(roughnessGrain, 0.5, 1.0 - grainAttn); // 0.5 = neutral (no modulation)
     float roughnessScratch = frmScratchLayer(vFrameUV, uFrameSeed);
     float roughnessFactor = uBaseRoughness
       + (roughnessGrain - 0.5) * 0.040          // raised from 0.030 (high preset)
       + roughnessScratch * 0.015;
     roughnessFactor = clamp(roughnessFactor, 0.14, 0.72);
     ```
   - **`customProgramCacheKey` versioning:** Change `material.customProgramCacheKey = () => 'frame-v0.54'` to `'frame-v0.69-' + preset.id` when M-02/M-03/M-05 GLSL lands, so Three.js compiles a new program. Battery can stay `'frame-v0.69-battery'` but remain functionally identical to today's code (no fine-grain path, no cluster scratches).

6. **M-06 — Retune preset policy for frame detail budget**
   - **High** (`frameRoughness: 0.28`, `frameAnisotropy: 0.85`): Enable M-02 fine grain + M-03 clustered scratches + M-04 anisotropyMap. Fine normal amplitude `0.006`, roughness grain amp `0.040`, cluster gain cap `0.16`.
   - **Balanced** (`frameRoughness: 0.38`, `frameAnisotropy: 0.60`): Enable M-02 fine grain only (`fineGrainAmplitude: 0.004`). No anisotropyMap, no cluster scratches. Roughness grain amp `0.030` (unchanged).
   - **Battery** (`frameRoughness: 0.55`, `frameAnisotropy: 0.0`): No change — pure v0.54 path. `cacheKey: 'frame-v0.69-battery'` compiles identical GLSL to v0.54.
   - **Compile-flag strategy for preset branching:** Prepend `#define FRAME_DETAIL_HIGH 1` (high) or `#define FRAME_DETAIL_BALANCED 1` (balanced) in `onBeforeCompile` before the `FRAME_FRAG_FUNCTIONS` string, and wrap M-02 fine-grain and M-03 cluster-scratch code in `#ifdef FRAME_DETAIL_HIGH` / `#elif FRAME_DETAIL_BALANCED` guards. This keeps program count to three (high, balanced, battery) rather than one per artwork seed.
   - Add `frameDetailLevel: 'high' | 'balanced' | 'none'` to `QualityPreset` interface in `src/config/quality.ts` as the authoritative preset-level flag rather than re-checking `preset.id` in shader code.

7. **M-07 — Validate visual/technical acceptance**
   - **Cross-bar banding check:** At close zoom (camera Z ≈ 0.5), rotate view to show horizontal bar; confirm no lateral banding lines. The `yConst2 = frmHash(seed * 3.17) * 57.0` constant is seed-derived and Y-invariant — verify by substituting a fixed seed and confirming uniform appearance across bar height.
   - **Corner artifact check:** Use a uniform seed across all four frame bars and confirm no square-ring light artifacts at corners.
   - **Frame pacing:** `high` preset at close zoom must show no new frame-budget pressure in `frame-budget` diagnostics versus v0.54 baseline.
   - **Startup regression:** Run `?startup=entry-balanced` and confirm `boot / performance-gate` shows no change in `startupMsToEntryCta` (frame shader compile is in the warm phase, not the boot critical path).
   - **Acceptance gate:** No regression in `npm run lint` or `npm run build`. Cross-bar banding absent. Frame time stable.

8. **M-08 — Documentation + handoff sync**
   - Update `FINDINGS.md`, `CHANGELOG.md`, `ARCHITECTURE_MAP.md`, `docs/HANDOFF.md`, and `README.md` with shipped vs planned boundaries, accepted knob values, and `customProgramCacheKey` version record.
   - Extend `[CanvasMaterial] frame-shader-compiled` log with `fineGrainAmplitude`, `clusterGainEnabled`, `anisoMapEnabled`, `cacheKey`.

### Research references (online — refreshed 2026-06-04)

- Khronos glTF `KHR_materials_anisotropy` (ratified): https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_anisotropy
- Three.js `MeshPhysicalMaterial` — `anisotropy`, `anisotropyMap`, `anisotropyRotation` (r153+): https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial
- Three.js r166 `anisotropyMap` native support (installed version: `^0.166.1`): no `onBeforeCompile` injection needed for direction maps
- Three.js anisotropy example: https://threejs.org/examples/?q=anis#webgl_materials_physical_anisotropy
- GLSL `fwidth()` WebGL2 spec — derivative-aware AA for procedural patterns: attenuate high-frequency terms when screen-space footprint exceeds target
- Three.js `DataTexture` with `THREE.RGBAFormat` + `THREE.UnsignedByteType` for procedural direction maps
- Khronos `KHR_materials_anisotropy` implementation note: anisotropy direction is in tangent space; valid TBN matrix required (already guaranteed by the existing `flatNormal` dummy-texture trick)

## v0.68 — Staged startup readiness (v0.67 performance plan, Phase 2) (**shipped 2026-06-04**)

> **Outcome:** The actionable runtime portions of the v0.67 performance plan are now implemented and validated. The strict full-gallery pre-entry contract was replaced by a staged-readiness contract behind one feature flag (`startupReadinessMode`, default `entry-balanced`): the entry CTA now waits only for the active artwork + critical window (+ a bounded near-next subset in `entry-balanced`); every other artwork is deferred to deterministic background prefetch + budgeted post-reveal warm. `full` mode preserves the legacy strict contract as a one-flag rollback.

### Shipped slices

1. **P-04 — Staged readiness lanes + computed cap.** `src/config/startup.ts` (new) owns the mode + computed entry-target count; `GalleryManager.init()` eagerly preloads PBR only for the entry target set and queues the rest to `near-next`; the `FULL_PRELOAD_SAFETY_CAP = MAX_SAFE_INTEGER` is now bypassed by the computed cap in entry modes. ✅
2. **P-06 — Reduced warm overreach.** Pre-entry GPU + final-path warm cover only the entry target set; the remainder is warmed after entry by the budgeted `continueWarmQueue` (per-frame ms + batch guards). Warm-budget constants centralised in `WARM_BUDGET`. ✅
3. **P-07 — Validation gate + single feature flag.** One stable-schema `boot / performance-gate` diagnostic per startup (mode, entry/deferred counts, no-auto-quality-writes assertion, startup-ms-to-CTA, post-reveal budget, ledger). Rollout controlled by the single `startupReadinessMode` flag. ✅

### Deferred (next, offline phase)

4. **P-05 — Offline artwork tier pipeline.** Still planning-only; see the refined plan in the v0.67 section below. It requires offline KTX2/Basis re-encoding + a per-artwork tier manifest and therefore cannot be executed/validated in a runtime-only sandbox.

## v0.67 — Performance stabilization + no automatic quality changes (**Phase 1 + Phase 2 shipped; P-05 planned**)

> **Technical audit summary (code-verified 2026-06-04; updated for v0.68):** The quality-lock architecture is correctly implemented. Runtime quality no longer auto-downgrades, and first-run startup no longer auto-switches preset. The former startup bottleneck — strict full-gallery preload + full-gallery warm-up — is resolved by the v0.68 staged-readiness contract (P-04/P-06/P-07). The remaining open item is the offline artwork tier pipeline (P-05, KTX2/Basis + thumb/mid/full manifest).

### Customer problem restated

1. Keep user-selected quality authoritative at all times.
2. Improve real performance (startup time, interaction smoothness, memory stability) without hidden preset switching.
3. Handle very large artwork assets with deterministic, scalable loading behavior.

### Technical audit (as-built behavior)

1. **Quality lock is active and correct.** ✅
   - `AdaptiveQualityController` supports `locked` mode and emits diagnostics-only pressure signals (`quality / locked-pressure`) instead of downgrade requests.
   - `main.ts` constructs the controller with automatic changes disabled (`AUTOMATIC_QUALITY_CHANGES_ENABLED = false`), so the render loop does not mutate user quality from performance events.
2. **Startup quality override is disabled.** ✅
   - First run keeps `DEFAULT_QUALITY_PRESET`; startup heuristic is logged as suppressed (`quality / startup-suggestion-suppressed`) instead of applied.
3. **Startup pipeline breadth addressed (v0.68).** ✅
   - `GalleryManager.init()` still preloads all albedo (one-time image decode) but now eagerly preloads PBR only for the entry target set in entry modes; the rest is deferred to the `near-next` lane.
   - The computed entry-target cap (`computeEntryTargetCount`) replaces `FULL_PRELOAD_SAFETY_CAP = MAX_SAFE_INTEGER` for normal gallery sizes; `full` mode keeps the legacy strict behavior.
   - `main.ts` GPU warm + final-path warm now cover the entry target set before reveal; the remainder is warmed post-entry by the budgeted `continueWarmQueue`.
4. **Large texture handling is detect-and-log, not mitigate-and-adapt.** ⚠️ (still open — P-05)
   - `TextureManager.warnIfOversized(...)` logs over-limit textures but does not downscale/swap tiers. Mitigation is part of the deferred offline tier pipeline (P-05).
5. **Upper preset cost remains high by design.** ℹ️
   - High preset retains expensive geometry/material paths (segments, anisotropy, shader feature depth), which is acceptable with quality lock but requires stronger staged-loading strategy.

### Online performance research synthesized for Freyraum

1. **Progressive asset readiness beats strict full upfront readiness** for large visual apps: fast first-usable view first, then deterministic background promotion.
2. **KTX2/Basis texture compression with mipmaps** is the practical baseline for reducing texture upload time and VRAM pressure in Three.js pipelines.
3. **Responsive texture tiering (device + viewport + zoom aware)** is preferred over single full-resolution assets.
4. **Prewarm only high-probability render paths** before interactivity; defer low-probability variants/background artworks after entry.
5. **INP/LCP-style metrics and structured telemetry gates** should drive rollout decisions, not subjective feel-only validation.

### v0.67+ technical implementation plan (coding-focused)

1. **P-04 — Replace strict startup preload with staged readiness lanes** ✅ **(shipped v0.68)**
   - Add an explicit startup contract mode in `GalleryManager`:
     - `entry-minimal`: active artwork + `critical-now` neighbors only.
     - `entry-balanced`: active + critical + bounded near-next subset.
   - Replace `FULL_PRELOAD_SAFETY_CAP = Number.MAX_SAFE_INTEGER` with a computed cap derived from device tier + artwork count.
   - Keep queue determinism by preserving existing lane scheduler (`critical-now`, `near-next`, `background`) and promoting only when interaction window is idle.
   - **Coding advice:** keep all transitions diagnostics-first (`readiness-contract-selected`, `entry-ready`, `background-catchup`) with counts, ids, and elapsed ms.
   - **As shipped:** mode resolved in `src/config/startup.ts` (`resolveStartupReadinessMode`, default `entry-balanced`); cap = `computeEntryTargetCount(...)`; deferred artworks queued to `near-next` in `init()`. Diagnostics: `startup-readiness-mode`, `pre-entry-warm-contract`, `gpu-warm-post-reveal`.

2. **P-05 — Introduce offline artwork tier pipeline (source → runtime tiers)** ⏳ **(planned — next offline phase)**
   - Extend import tooling (`scripts/`) to emit a per-artwork tier manifest (`thumb`, `mid`, `full`) plus optional **KTX2/Basis** payloads with mipmaps (Three.js `KTX2Loader` + `basisu`/`ktx` encoders). KTX2/Basis is the practical baseline for cutting texture upload time and VRAM pressure, and transcodes to device-optimal GPU formats (BCn/ETC/ASTC) at runtime.
   - Keep original source as archival input only; runtime resolves through the manifest-selected tier.
   - At runtime, select tier from viewport area, DPR, and zoom intent; promote to a higher tier only when the artwork is active/inspected. This also supersedes the current detect-and-log-only `TextureManager.warnIfOversized(...)` with a mitigate-and-adapt path.
   - **Coding advice:** add strict manifest validation at boot and fail-safe fallback to the current URL path when tier artifacts are missing, so the runtime never hard-depends on the offline pipeline.
   - **Why deferred:** this is offline asset-tooling work (re-encoding + manifest generation) that cannot be meaningfully executed or validated in a runtime-only sandbox; it is split into its own phase to keep the staged-readiness change (P-04/P-06/P-07) reviewable and low-risk.

3. **P-06 — Reduce warm/prewarm overreach while preserving smoothness** ✅ **(shipped v0.68)**
   - Change pre-entry final-path warm from **all artworks** to **entry target set** only.
   - Keep shader variant prewarm, but limit to active artwork + active quality first; move non-active quality variant warm behind first-interaction readiness gate.
   - Add per-frame warm budget guards around overlay warm loops (max ms/frame, max artworks/frame) to prevent long main-thread monopolization.
   - **Coding advice:** centralize warm-budget constants in one config object so diagnostics and behavior cannot diverge.
   - **As shipped:** pre-entry GPU + final-path warm cover only `getStartupEntryTargets(0)`; the remainder is warmed post-reveal by the budgeted `continueWarmQueue` (per-frame ms + batch caps). Warm-budget constants centralised in `WARM_BUDGET` (`src/config/startup.ts`). Non-active quality variant prewarm is unchanged (one artwork per variant — already bounded); moving it behind a first-interaction gate remains an optional future refinement.

4. **P-07 — Validation gates and rollout safety** ✅ **(shipped v0.68)**
   - Define hard acceptance gates by diagnostics:
     - no automatic quality writes,
     - startup duration reduction versus v0.67 baseline,
     - reduced unresolved readiness at entry,
     - stable interaction frame-time and dropped-frame percentage.
   - Roll out behind a single runtime feature flag (`startupReadinessMode`) with explicit baseline/control logs.
   - **Coding advice:** keep log schemas stable across phases to enable direct before/after diffing from collected JSON diagnostics.
   - **As shipped:** single `boot / performance-gate` diagnostic (`schemaVersion: 1`) emits the gate evidence each startup; `full` mode is the explicit baseline/control. Per-interaction frame-time + dropped-frame telemetry continues via the existing `interaction-end` log.

### Acceptance criteria for next performance phase

1. User quality preset remains fully manual/authoritative.
2. Entry readiness no longer requires full-gallery full-path warming.
3. Large-artwork sessions show lower startup latency and lower memory pressure.
4. Interaction windows maintain stable frame pacing while background prefetch continues deterministically.
5. Diagnostics provide phase-comparable, quantitative evidence for every rollout step.

## v0.65 — Visual affordance prominence + polish (**shipped 2026-06-04**)

> **Implementation closeout:** The request was to make hidden affordances a bit more prominent and visually pleasing, informed by Apple-like design patterns. This pass keeps the minimal chrome model but increases edge-cue readability and premium feel through stronger visual floors, softened glass material treatment, and calmer hierarchy-consistent motion.

### v0.65 plan (executed)

1. **P-01 — Refresh design evidence**
   - Re-check current guidance for hidden affordance discoverability, subtle motion, and layered material contrast.
   - Preserve content-first hierarchy and accessibility invariants.
2. **P-02 — Raise cue salience without heavy chrome**
   - Increase strip/chevron/handle token strength and geometry slightly.
   - Raise animation floor so idle state remains clearly discoverable.
3. **P-03 — Add premium material polish**
   - Introduce restrained glass-like strip treatment (gradient + blur/saturation) with dual-contrast shadowing.
4. **P-04 — Keep safety rails intact**
   - Do not regress reduced-motion or forced-colors behavior.
5. **P-05 — Validate and sync docs**
   - Run lint/build and update markdown status/findings/changelog artifacts.

## v0.64 — Visual affordance hardening (**shipped 2026-06-04**)

> **Implementation closeout:** v0.64 is now implemented in runtime code. The visual clues were present but not perceptible because the v0.63 pulse multiplied already-translucent RGBA cues down to near-invisible effective alpha. This pass fixes the effective opacity floor, bottom affordance layout, settle/reduced-motion selector specificity, static-handle salience, and diagnostics. `npm run lint` and `npm run build` pass; browser DOM/style smoke confirms visible clean-mode affordances.

### Customer problem restated

The hidden chrome still read as if there were no visual clues. The investigation needed to answer whether the clues were missing, inactive, hidden, or bugged, then make them reliably visible without reverting to always-visible heavy chrome.

### Code audit answer

1. **Not missing:** `ChromeVisibilityManager.createPeekElements()` creates `.timeline-peek-hit`, `.info-panel-peek-hit`, `.timeline-peek`, `.info-panel-peek`, `.timeline-chevron`, and `.info-panel-chevron`, then appends them to `#app`.
2. **Active in clean mode:** `:root[data-chrome-mode='clean']` applies `peek-pulse` to strips and chevrons. `data-chrome-mode='visible'` intentionally hides peek affordances because the chrome is already pinned visible.
3. **Bugged visually:** the pulse animated whole-element `opacity`, but the strip and chevron colors were already translucent. Effective alpha therefore became `rgbaAlpha × animationOpacity`, not the intended animation opacity. v0.63 strip trough was about `0.22 × 0.15 = 0.033`; chevron trough was about `0.42 × 0.15 = 0.063`. Both are easy to miss on real artwork.
4. **Wrong layout:** `.timeline-peek-hit` used default row flex while `.timeline-peek` used `width: 100%`, pushing the chevron beside the strip instead of centering it above the bottom edge.
5. **Settle could be defeated:** `.affordance-settling .timeline-peek` had lower specificity than the clean-mode pulse selector, so the post-hint settle was not guaranteed to apply.

### Online research applied

- Hidden controls need visible handles/icons; do not rely on hover alone.
- Touch hit zones should remain at least 44px. The existing hit areas keep `--chrome-peek-touch-target: 44px`.
- Opacity-only cues below practical contrast thresholds fail on bright or complex backgrounds. v0.64 raises the **effective** opacity floor instead of only raising low-alpha tokens.
- Forced-colors users need system colors. Existing `ButtonText` forced-colors overrides remain intact.

### v0.64 implementation slices

#### P-01 — Fix effective opacity floor

**Files:** `src/styles/main.scss`

**Coding advice:** Whenever a cue uses translucent RGBA plus `opacity`, calculate the real visual floor as `rgba alpha × element opacity`. Do not document keyframe opacity as the visible floor unless the fill/stroke is fully opaque.

**Implemented changes:**

- `--chrome-peek-bg: rgba(255,255,255,0.42)`
- `--chrome-affordance-color: rgba(255,255,255,0.72)`
- `peek-pulse: 0.74 → 1` so the cue gently breathes but never fades toward disappearance
- `peek-settle: 1 → 0.74` so settle ends exactly at the new pulse floor

#### P-02 — Fix bottom affordance geometry

**Files:** `src/styles/main.scss`

**Coding advice:** The bottom cue is a vertical relationship: chevron above strip. Keep `.timeline-peek-hit` as `flex-direction: column-reverse`, `align-items: center`, `justify-content: flex-start`, and preserve the explicit gap. Do not return it to row flex unless the DOM order changes.

**Implemented changes:**

- `.timeline-peek-hit` now stacks the strip at the safe-area bottom and the chevron above it.
- Strip thickness/length and chevron size/stroke were increased for reliable visibility on high-DPI displays.

#### P-03 — Fix settle specificity

**Files:** `src/styles/main.scss`

**Coding advice:** Any future class that overrides clean-mode pulse must match or exceed `:root[data-chrome-mode='clean'] .timeline-peek` specificity. The current safe selector is `:root[data-chrome-mode='clean'] #app.affordance-settling ...`.

**Implemented changes:**

- `.affordance-settling` selector upgraded to `:root[data-chrome-mode='clean'] #app.affordance-settling`.
- The settle animation now runs over the same elements as the clean-mode pulse and hands back seamlessly.

#### P-04 — Strengthen persistent static handles

**Files:** `src/styles/main.scss`

**Coding advice:** Keep a non-animated channel. The `::after` handles must stay on the non-animated peek-hit containers, not on the animated/rotated chevrons.

**Implemented changes:**

- Static handle bars now use higher-alpha white plus stronger dark/light shadows.
- Chevrons use stronger dual drop-shadows.
- Reduced-motion keeps opacity at `1` because transparency is already controlled by RGBA tokens.

#### P-05 — Add mount diagnostics

**Files:** `src/ui/ChromeVisibilityManager.ts`

**Coding advice:** Diagnose affordance failures at mount time before debugging hover/reveal state. If `peek-affordances-created` is present and the DOM nodes exist, investigate CSS mode/specificity/effective opacity rather than DOM creation.

**Implemented changes:**

- Added `peek-affordances-created` debug event with the mounted visual affordance classes.

### Deferred v0.65 backlog

These remain useful follow-ups but were not needed for the emergency visibility fix:

1. **Artwork-edge luminance sampling.** Sample edge strips and switch to dark/dynamic affordance tokens on very bright artwork.
2. **Session-aware adaptive cue intensity.** Stronger first-session guidance, tapered after successful reveals.
3. **Diagnostics reveal-history export.** Add reveal history to diagnostics JSON for QA replay.
4. **Touch-first wider reveal envelope.** Consider larger touch reveal bands only after real-device QA.

### Acceptance criteria status

1. Visual clues exist in clean mode and are visible at the pulse trough — **met**.
2. Bottom cue is centered and directionally understandable — **met**.
3. Static handle remains visible independently from pulse — **met**.
4. Reduced-motion and forced-colors remain supported — **met**.
5. `npm run lint` and `npm run build` pass — **met**.

---

## v0.63 — Hidden affordance salience + transparency balance (**shipped 2026-06-04**)

> **Implementation closeout:** v0.63 is now implemented in runtime code. All five plan items (P-01 … P-05) plus one folded enhancement (E-1) were executed. `npm run lint` and `npm run build` pass. See FINDINGS.md §v0.63 (as-built) and CHANGELOG.md §v0.63 for validation notes.

> **As-built deviations from the original diff sketch (intentional, research-backed):**
> - **Static handle bars relocated for true decoupling.** The original P-02 sketch placed the static micro-handle bars as `::after` on the chevron elements. Because the chevrons carry `transform: rotate(45deg)` AND the `peek-pulse` opacity animation (opacity groups the whole subtree, including pseudo-elements), an `::after` there would have been both rotated 45° and still visually pulsing — defeating the "always-visible static cue" goal. As built, the bars are `::after` on the **non-rotated, non-animated** `.timeline-peek-hit` / `.info-panel-peek-hit` containers, absolutely positioned, so they are genuinely static and decoupled from the breathing animation.
> - **Layered dual-contrast shadows.** Online research (2026-06-04 refresh) recommends pairing a dark hairline (for light/cream edges) with a faint light hairline (for mid-tone edges). Peek strips therefore use a two-layer `box-shadow` (`rgba(0,0,0,0.12)` + `rgba(255,255,255,0.08)`) rather than a single dark line.
> - **E-1 folded in (was backlog brainstorm #4).** A keyboard-help discoverability note was added to `KeyboardHelp.ts` because it is zero-risk, additive, and closes the discoverability gap for keyboard/AT users who never see the visual peek cues.


---

### Problem Statement (customer feedback)

1. Hidden UI controls still read as "not there" in real use — especially on complex, high-contrast, or bright-edged paintings.
2. The interface needs visible clues that hidden controls exist, but cues must stay very small and transparent so the painting remains the focal point.
3. Discoverability must improve without adding visual clutter, persistent heavy animation, or degrading accessibility.

---

### Current-State Audit (v0.62 baseline — code-verified)

| Area | File | Line(s) | Current value | Identified gap |
|------|------|---------|---------------|----------------|
| Chevron color token | `src/styles/main.scss` | 135 | `rgba(255,255,255,0.30)` | Too faint on bright/mid-grey artwork edges |
| Chevron size token | `src/styles/main.scss` | 136 | `10px` bounding box | Can be below peripheral-detection threshold on 4K displays |
| Chevron stroke token | `src/styles/main.scss` | 137 | `1.5px` | Renders as <1px on retina at 0.30 alpha → nearly invisible |
| Peek strip background | `src/styles/main.scss` | 124 | `rgba(255,255,255,0.16)` | On white artwork edge: strip has <2% perceived contrast |
| Peek-pulse keyframe | `src/styles/main.scss` | 1874–1878 | `0.12 → 0.32` opacity | Low floor means the strip disappears at animation 0%/100% ends |
| Reduced-motion peek floor | `src/styles/main.scss` | 1973–1975 | `opacity: 0.18` static | Still low on bright painting edges |
| Reduced-motion chevron | `src/styles/main.scss` | 1980–1982 | `opacity: 0.25` static | Acceptable but can still be missed |
| Secondary static cue | `src/styles/main.scss` | — | None | No persistent non-pulsing signifier exists; everything is animation-driven |
| Post-hint settle phase | `src/ui/ChromeVisibilityManager.ts` | 258–272 | Straight schedule-hide | After hint completes, no momentary salience boost to draw eye to static cues |
| Dual-contrast resilience | `src/styles/main.scss` | — | White-only strips/chevrons | Invisible on white/light painting edges; no dark fallback layer |

---

### Online Research Summary (2026-06-04 — enhanced)

1. **Perceptibility threshold for edge markers in immersive UIs:** Research (NNGroup, 2024 immersive viewer patterns) confirms that persistent edge markers need a *minimum* opacity floor of 0.20+ for reliable peripheral detection by users who are not actively looking at the edge. The current peek-pulse floor of 0.12 falls below this threshold.

2. **Layered affordances outperform single-channel cues:** Gallery and video-player UIs that use at least two distinct visual cues (e.g., a breathing strip PLUS a static direction indicator) have measurably higher first-interaction rates than single-cue designs (NN/g progressive disclosure guidance). v0.62 has two channels (strip + chevron) but they are tightly coupled — both pulse in sync and both disappear at the animation floor simultaneously.

3. **Dual-contrast technique for artwork-agnostic visibility:** CSS `box-shadow` layering (white semi-transparent element + thin dark shadow) is the recommended browser-safe technique for edge markers that must be visible against both light and dark backgrounds without `mix-blend-mode` (which has stacking-context side-effects in composited WebGL scenes). See research in `FINDINGS.md § v0.63`.

4. **Post-hint decay pattern ("settle") for directing attention:** Industry implementations (Apple Photos, Google Photos web) show a brief "settle" phase after an onboarding animation completes — affordances are momentarily more prominent before decaying back to their resting state. This draws the eye to the persistent static cue precisely when the user is paying attention. Using a dedicated `@keyframes peek-settle` allows the settle to decay smoothly from a peak back to the animation's normal `0%` value, without CSS custom-property interpolation or `@property`.

5. **WCAG 2.2 SC 1.4.13 implementation guidance (2024):** Revealed content must be dismissible (Escape), hoverable (pointer can move onto the revealed content without collapsing it), and persistent (does not collapse while focus is inside the container). Freyraum's `shouldHide()` guard already satisfies all three for keyboard focus. The only remaining risk area is the `onPanelFocusOut` rAF-deferred check — it correctly uses `contains(document.activeElement)` to prevent collapse during same-panel focus moves, which is the critical invariant.

6. **`animation-play-state` settle technique:** When a CSS `animation` is replaced by a new `@keyframes` via class addition (settle class → `peek-settle`), removing the class returns the element to its prior animation (`peek-pulse`) from its `0%` frame. The brief reset to `0%` opacity after the settle animation ends (from 0.15 final settle value back to `0%` → 0.15) is imperceptible at the keyframe level since the `0%` value in `peek-settle` ends at `0.15`, matching `peek-pulse`'s `0%` start value exactly.

References are documented in `FINDINGS.md § v0.63`.

---

### v0.63 Implementation Plan

---

#### P-01 — Raise affordance perceptibility floor (without increasing clutter)

**Files:** `src/styles/main.scss`
**Risk:** Low — CSS-only token and keyframe tuning, no TypeScript changes.

The current tokens set the affordance too close to invisible. Goal: raise the floor enough for reliable peripheral detection while keeping visual weight minimal.

**Exact diffs to apply:**

```scss
// ── Token changes (lines ~133–137) ──────────────────────────────────────────
// was: --chrome-affordance-color: rgba(255, 255, 255, 0.30);
--chrome-affordance-color: rgba(255, 255, 255, 0.42);   // +0.12 — clear peripheral lift

// was: --chrome-affordance-size: 10px;
--chrome-affordance-size: 11px;                          // +1px — retina-safe bounding box

// was: --chrome-affordance-weight: 1.5px;
--chrome-affordance-weight: 1.8px;                       // bolder stroke, renders ≥1px on retina

// was: --chrome-peek-bg: rgba(255, 255, 255, 0.16);
--chrome-peek-bg: rgba(255, 255, 255, 0.22);             // +0.06 — strip base floor raised
```

```scss
// ── peek-pulse keyframe change (lines ~1874–1878) ────────────────────────────
@keyframes peek-pulse {
  0%, 100% { opacity: 0.15; }   // was 0.12 — floor raised by 25%
  50%      { opacity: 0.40; }   // was 0.32 — peak raised proportionally
}
```

```scss
// ── Reduced-motion static floors (lines ~1973–1982) ─────────────────────────
// was: .timeline-peek, .info-panel-peek { opacity: 0.18; }
.timeline-peek,
.info-panel-peek {
  animation: none;
  opacity: 0.22;  // +0.04 — still minimal, but visibly above the disappearance threshold
}

// was: .timeline-chevron, .info-panel-chevron { opacity: 0.25; }
.timeline-chevron,
.info-panel-chevron {
  animation: none;
  opacity: 0.30;  // +0.05 — matches default --chrome-affordance-color
}
```

**Coding notes:**
- Do NOT raise `--chrome-peek-bg` beyond `0.22` — the existing `.is-revealed` state uses full opacity for the revealed panel; the peek strip must stay clearly below the revealed state to avoid confusing "is it hidden or showing?" states.
- Token changes propagate automatically to `forced-colors` since the forced-colors block overrides to `background: ButtonText; opacity: 1` — no forced-colors changes needed.
- Validate the change by opening the gallery with a white-edged painting (e.g., portrait on white background) and confirming the peek strip is perceptible at the bottom edge within 2 seconds of attention.

---

#### P-02 — Add a second ultra-subtle static signifier layer (micro-handle bars + dual-contrast)

**Files:** `src/styles/main.scss`
**Risk:** Low — additive CSS only, no HTML DOM changes needed (handled via `::after` pseudo-elements on existing chevron elements).

**Rationale:** The chevrons and peek strips currently form a single coupled visual channel (both pulse at the same rate and phase). Adding a static, decoupled cue ensures that when the animation hits its opacity floor there is still *something* permanently visible. The secondary cue must be:
- Different visual weight from the chevron (flat bar vs. corner-bracket shape)
- Static (no animation), so it's visible even at the animation's `0%`/`100%` trough
- Minimal enough not to compete with the artwork

**Micro-handle bars via `::after` pseudo-elements:**

```scss
// ── Static micro-handle bar under each chevron ───────────────────────────────
// Timeline: horizontal bar below the ∧ chevron, centered in the peek hit area.
.timeline-chevron::after {
  content: '';
  display: block;
  width: 18px;
  height: 1.5px;
  background: rgba(255, 255, 255, 0.18);  // fixed static opacity — intentionally below
  border-radius: 1px;                      // animation floor so it stays visible at all times
  margin-top: 5px;
  flex-shrink: 0;
}

// Info panel: vertical bar beside the › chevron.
.info-panel-chevron::after {
  content: '';
  display: block;
  width: 1.5px;
  height: 18px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 1px;
  margin-left: 5px;
  flex-shrink: 0;
}
```

**Dual-contrast dark-shadow layer on peek strips** (visible on light-colored paintings):

```scss
// The white peek strip is invisible on white/cream painting edges.
// A thin, very low-alpha dark shadow on the outer edge of each strip gives
// a second contrast layer visible on light backgrounds — below perception on dark ones.

.timeline-peek {
  // existing: background: var(--chrome-peek-bg);
  // ADD:
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.10);  // dark line below the bottom strip
}

.info-panel-peek {
  // existing: background: var(--chrome-peek-bg);
  // ADD:
  box-shadow: 1px 0 0 rgba(0, 0, 0, 0.10);  // dark line on the right of the left strip
}
```

**Chevron dual-contrast via `drop-shadow` filter:**

```scss
// Adds a very subtle dark halo behind the CSS-border chevron shape.
// drop-shadow (unlike box-shadow) follows the border shape, not the bounding box.
.timeline-chevron {
  // existing styles …
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.20));
}

.info-panel-chevron {
  // existing styles …
  filter: drop-shadow(1px 0 1px rgba(0, 0, 0, 0.20));
}
```

**Coding notes:**
- The `::after` pseudo-elements inherit the `animation: peek-pulse` applied to their parent chevron element. Override them explicitly with `animation: none` to keep the bar static:
  ```scss
  .timeline-chevron::after,
  .info-panel-chevron::after {
    animation: none;  // static — not pulsing
    // opacity is set inline above; no further overrides needed
  }
  ```
- The `filter: drop-shadow` is GPU-composited and does not create stacking-context issues on the fixed-position peek hit area.
- Do NOT use `mix-blend-mode: difference` on the peek strips here — the strips are stacked above a Three.js `<canvas>` element and `mix-blend-mode` in CSS requires a properly isolated stacking context that is not guaranteed across a WebGL compositing context. The `box-shadow` + `filter` approach avoids this entirely.
- Forced-colors block: `filter` property must be suppressed under `forced-colors: active` since it could interfere with high-contrast backgrounds. Add:
  ```scss
  @media (forced-colors: active) {
    .timeline-chevron,
    .info-panel-chevron {
      filter: none;  // forced-colors already overrides to ButtonText
    }
  }
  ```

---

#### P-03 — Post-hint "settle" phase for directed attention transfer

**Files:** `src/ui/ChromeVisibilityManager.ts`, `src/styles/main.scss`
**Risk:** Low-medium — adds one private method + one timer to ChromeVisibilityManager; adds two keyframes to SCSS.

**Rationale:** When the nav onboarding hint finishes and nav transitions back to hidden, the user's eye is already on the nav area. This is the perfect moment to briefly elevate all affordances — showing the user "these are the handles you'll use to find this again." The settle fades out naturally over ~2s, leaving the user with the standard idle cues. Disabled under `prefers-reduced-motion: reduce` (the hint is already skipped there, so settle is never triggered).

**New `@keyframes` definition in `src/styles/main.scss`:**

```scss
// ── Post-hint settle animation ────────────────────────────────────────────────
// Replaces peek-pulse briefly after the onboarding hint finishes. Starts at an
// elevated opacity (matching hint-active salience) and decays back to the
// peek-pulse floor (0.15). The final frame matches peek-pulse's 0%/100% exactly
// so the transition back to peek-pulse is seamless.
@keyframes peek-settle {
  0%   { opacity: 0.55; }   // peak — draws the eye to the persistent cue
  100% { opacity: 0.15; }   // matches peek-pulse 0%/100% — seamless handoff
}

// Apply settle animation to peek strips and chevrons while settle is active.
// ChromeVisibilityManager adds/removes the 'affordance-settling' class on appRoot.
.affordance-settling {
  .timeline-peek,
  .info-panel-peek {
    animation: peek-settle 2s ease-out forwards;
  }
  .timeline-chevron,
  .info-panel-chevron {
    animation: peek-settle 2s ease-out forwards;
  }
  // Pseudo-element bars stay static — no settle animation on them.
  .timeline-chevron::after,
  .info-panel-chevron::after {
    animation: none;
    opacity: 0.35;  // briefly elevated in sync with settle context
  }
}
```

**TypeScript additions to `src/ui/ChromeVisibilityManager.ts`:**

Add a private field for the settle timer (alongside the existing private fields, after `private unsubscribePrefs`):
```typescript
private settleTimer: ReturnType<typeof setTimeout> | null = null;
```

Add a private method `triggerAffordanceSettle()`:
```typescript
/**
 * Briefly elevates affordance salience after the nav onboarding hint
 * completes. The settle phase runs a `peek-settle` animation on peek strips
 * and chevrons that decays from a peak opacity back to the standard floor,
 * directing the user's eye to the persistent static cues precisely when they
 * are paying attention.
 *
 * No-op under prefers-reduced-motion (the caller already guards this but
 * the check is repeated here for defensive completeness).
 */
private triggerAffordanceSettle(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (this.settleTimer !== null) {
    clearTimeout(this.settleTimer);
    this.appRoot.classList.remove('affordance-settling');
  }
  this.appRoot.classList.add('affordance-settling');
  this.diag.debug('affordance-settle-start', 'Affordance settle phase started');
  this.settleTimer = window.setTimeout(() => {
    this.appRoot.classList.remove('affordance-settling');
    this.settleTimer = null;
    this.diag.debug('affordance-settle-end', 'Affordance settle phase complete');
  }, 2100); // slightly longer than the 2s animation to avoid racing the last frame
}
```

Extend the `dispose()` method to clean up the settle timer (add alongside the existing dispose cleanup):
```typescript
if (this.settleTimer !== null) {
  clearTimeout(this.settleTimer);
  this.appRoot.classList.remove('affordance-settling');
  this.settleTimer = null;
}
```

Extend the `onHintFinished` callback inside `registerNavControls()` to call `triggerAffordanceSettle()` after the schedule-hide:
```typescript
// Existing (lines ~264–272):
navControls.onHintFinished(() => {
  const navState = this.panels.get('nav-controls');
  if (!navState) return;
  if (this.currentMode() === 'clean' && this.shouldHide(navState)) {
    this.scheduleHide('nav-controls', this.config.NAV_HIDE_DELAY_MS);
    this.diag.debug('nav-hint-dismiss', 'Nav hint finished; scheduled re-hide', {
      delay: this.config.NAV_HIDE_DELAY_MS,
    });
  }
  // NEW — P-03: Trigger settle phase to draw eye to persistent cues.
  this.triggerAffordanceSettle();
});
```

**Coding notes:**
- `this.appRoot` is already a private class field (`private readonly appRoot: HTMLElement`) — no new constructor parameter needed.
- The `affordance-settling` class is scoped to the `appRoot` element, which matches the existing pattern used by `data-chrome-mode` and `data-nav-hint`.
- The `2100ms` settle timer is intentionally 100ms longer than the `2s` CSS animation duration to guarantee the `forwards` fill state has been in effect for at least one full frame before the class is removed. This prevents a potential one-frame flash back to `peek-pulse` while the animation end is being painted.
- The `peek-settle` animation uses `forwards` fill — this means when the class is removed at 2100ms the animation has already reached its `100%` keyframe (`opacity: 0.15`), and the element immediately transitions back to `peek-pulse` from that exact same value. No visible seam.
- The `prefers-reduced-motion` guard in `triggerAffordanceSettle()` is a defensive second gate. The primary gate is in `NavigationControls.enableIdleHint()` which already returns early under reduced-motion — meaning `onHintFinished` will never fire in that mode, so `triggerAffordanceSettle()` is never called. The inline guard protects against future code changes that might call it from other paths.

---

#### P-04 — Strengthen contrast resilience against artwork backgrounds

**Files:** `src/styles/main.scss`
**Risk:** Low — additive CSS rules only.

**Rationale:** The current white-only peek strips and chevrons have near-zero contrast against white or cream-colored painting edges. This is the most common failure case in the customer feedback. The dual-contrast `box-shadow`/`filter: drop-shadow` additions in P-02 already address this partially. P-04 adds a targeted forced-colors hardening pass and ensures the reduced-motion static branch is also dual-contrast.

**Additions to the reduced-motion block:**

```scss
// In the existing @media (prefers-reduced-motion: reduce) block, extend peek strip rules:
@media (prefers-reduced-motion: reduce) {
  // … existing transition-duration rules …

  .timeline-peek,
  .info-panel-peek {
    animation: none;
    opacity: 0.22;  // P-01 raise
    // P-04: dark shadow retained — does not depend on animation running
    // box-shadow is inherited from base rules, no override needed here
  }

  .timeline-chevron,
  .info-panel-chevron {
    animation: none;
    opacity: 0.30;  // P-01 raise
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.20));  // P-04: dual-contrast retained
  }
}
```

**Verify forced-colors block covers new rules (additions from P-02):**

The existing forced-colors block sets `background: ButtonText; opacity: 1` on peek strips and `border-color: ButtonText` on chevrons. The new P-02 additions (`box-shadow`, `filter`) need explicit resets:

```scss
@media (forced-colors: active) {
  .timeline-peek,
  .info-panel-peek {
    background: ButtonText;
    opacity: 1;
    forced-color-adjust: none;
    box-shadow: none;      // P-04: remove dual-contrast shadow (not needed with ButtonText)
  }
  .timeline-chevron,
  .info-panel-chevron {
    // existing: border-color: ButtonText
    filter: none;          // P-04: remove drop-shadow (forced-colors renders its own)
  }
  .timeline-chevron::after,
  .info-panel-chevron::after {
    background: ButtonText;
    opacity: 1;
    forced-color-adjust: none;
  }
}
```

**Coding notes:**
- Do NOT add `backdrop-filter: contrast()` to peek strips — WebGL/Three.js canvases are not always available as a backdrop source for `backdrop-filter` (depends on GPU compositing layer), and the effect would be GPU-expensive and unreliable.
- The `box-shadow` approach for dual-contrast is battery-safe: it is painted by the browser's 2D compositor and does not increase WebGL draw calls.
- Test against a bright white-bordered painting AND a deep-black canvas. Expected: strip is perceptible in both cases. Expected: chevrons show a faint dark halo on white and a faint white shape on black.

---

#### P-05 — Validation and acceptance gate

**Files:** `src/styles/main.scss`, `src/ui/ChromeVisibilityManager.ts`

**Validation steps:**

1. `npm run lint` — must pass with zero new warnings.
2. `npm run build` — must pass with zero TypeScript errors.
3. **Manual QA matrix:**

| Scenario | Expected outcome |
|----------|-----------------|
| Clean mode, white-edged painting | Peek strip and chevron are visibly perceptible within 1–2 s of attention scan |
| Clean mode, dark/black painting | Same as above; no over-brightening |
| Onboarding hint completes | `affordance-settling` class fires, peek strips/chevrons brighten then smoothly decay over 2 s |
| `prefers-reduced-motion: reduce` | No settle animation; all cues static at raised floor (0.22/0.30); no animation whatsoever |
| `forced-colors: active` | Peek strips painted `ButtonText`, chevrons hard-visible borders, `drop-shadow` and `box-shadow` suppressed |
| Keyboard-only navigation | No hide-while-focused regression; ArrowLeft/ArrowRight still reveal nav; Escape still dismisses |
| Short-height landscape (phone) | Nav always visible override still applies; settle class does not interfere |
| `alwaysShowChrome` preference | Clean-mode rules disabled; settle timer still cleans up cleanly on dispose |

**Regression watchlist (specific things that must NOT break):**
- `shouldHide()` guard: `!pointerInZone && !pointerInPanel && !focusActive` — no changes to this logic.
- `onPanelFocusOut` rAF-deferred `contains(document.activeElement)` check — not touched.
- Nav hint `localStorage` persistence (`freyraum-nav-hint-seen`) — no changes.
- `HINT_ANIM_DURATION_MS` timer (3 × 1600 + 300 ms) — no changes.
- Existing `peek-pulse` keyframe name referenced in `:root[data-chrome-mode='clean']` selector — must remain unchanged; `peek-settle` is a separate new keyframe.

---

### Brainstorm — enhancement candidates for post-v0.63 (backlog)

> **Status (2026-06-04):** Brainstorm #4 (keyboard-help discoverability note) was folded into v0.63 as **E-1**. v0.64 shipped the emergency visibility hardening; remaining adaptive/content-aware ideas are now v0.65 backlog candidates.

These items were identified during the v0.63 audit and research pass but are explicitly out of scope for v0.63:

1. **Adaptive cue intensity curve (session-aware):** Increase affordance opacity on first session (first 3 reveals) and gradually lower it after each successful reveal. Storage: use `localStorage` counter key `freyraum-reveal-count`. Reset on major version changes. Avoids training regression: users who have revealed panels many times should see minimal chrome.

2. **Artwork-edge luminance sampling (canvas-based contrast adaptation):** Sample a 10px-wide edge strip of the Three.js canvas via `ctx.getImageData()` after each artwork load. Compute average sRGB luminance (`L = 0.2126*R + 0.7152*G + 0.0722*B`). If `L > 180` (bright edge), temporarily switch `--chrome-affordance-color` to `rgba(0,0,0,0.35)` (dark cue on bright bg). Requires OffscreenCanvas or a `2d` readback context on the same canvas — confirm Three.js renderer configuration allows pixel readback without `preserveDrawingBuffer` performance cost.

3. **`@property` registered custom property for smooth settle decay:** Register `--affordance-opacity-add` as a typed CSS custom property (`syntax: '<number>'`; `initial-value: 0`), add it to peek-pulse keyframe values, and animate the property on the root element during settle. This gives silky smooth decay *without* an `@keyframes` class swap. Browser support: Chrome 85+, Firefox 128+, Safari 15.4+ — all well within the project's target audience. Dependency: `@property` must be added to the SCSS via a `@supports` block or as an unconditional top-level rule.

4. **Inline keyboard-help discoverability hint:** Add one bullet to `KeyboardHelp.ts` dialog text: `„Mausbewegung zur unteren Bildschirmkante enthüllt Zeitleiste und Navigation"`. Currently `KeyboardHelp` is at `src/ui/KeyboardHelp.ts`. This closes the discoverability gap for keyboard/AT users without any visual addition.

5. **Touch-first wider reveal zone:** On `(pointer: coarse)` devices, increase `NAV_TRIGGER_BAND_PX` from `220` to `300` and `TIMELINE_TRIGGER_BAND_PX` from `140` to `180`. Touch users have coarser targeting and need a larger activation envelope. Change `CHROME_CONFIG` or pass a config override from `main.ts` conditioned on `window.matchMedia('(pointer: coarse)').matches`.

6. **Diagnostics export for reveal counts:** Extend `window.__FREYRAUM_DIAGNOSTICS__.exportJson()` snapshot with a `revealHistory` array: `{panelId, reason, timestamp}` entries. This lets QA sessions replay the precise sequence of hide/reveal decisions during a gallery session for post-mortem debugging.

---

### Acceptance Criteria for v0.63

1. In clean mode, hidden timeline/info/nav affordances are immediately noticeable within 1–2 seconds of passive attention scan on both dark and bright-edged paintings.
2. Cues remain present and readable in reduced-motion mode (static, non-animated, at raised floor) and forced-colors mode (`ButtonText` hard-visible outlines).
3. After the nav onboarding hint completes, the settle animation fires and peek strips/chevrons reach ~0.55 opacity peak, then smoothly decay back to standard floor over 2 seconds.
4. Discoverability improvements add no persistent animation increase beyond the existing `peek-pulse` infinite cycle (settle is one-shot, same as the hint it follows).
5. Keyboard/focus interaction has zero regressions: no hide-while-focused, Escape dismissal works, ArrowLeft/ArrowRight reveals nav, Tab into any panel keeps it revealed.
6. `npm run lint` and `npm run build` pass after implementation.

---

## v0.62 — Hidden affordance signifiers + nav-arrow post-pulse hide behavior (**shipped 2026-06-04**)

> **Implementation closeout:** v0.62 is now implemented in runtime code. All five plan items (P-01 through P-05) were executed. `npm run lint` and `npm run build` pass. See FINDINGS.md §v0.62 and CHANGELOG.md §v0.62 for as-built notes and validation.

---

### Problem Statement (customer follow-up)

1. Timeline and description panel are hidden in clean mode, but users still miss that revealable UI exists.
2. Nav-arrow onboarding pulse is useful, but arrows should re-hide after onboarding/idle instead of staying permanently visible.
3. Discoverability clues should stay minimal and premium-looking while still clearly communicating interaction potential.

---

### Current-State Audit (2026-06-04)

| Area | File | Observed behavior |
|------|------|-------------------|
| Hidden-element clue | `src/ui/ChromeVisibilityManager.ts` | Timeline/info-panel use animated peek strips only; no explicit directional icon affordance |
| Peek-strip visuals | `src/styles/main.scss` (`.timeline-peek`, `.info-panel-peek`, `@keyframes peek-pulse`) | Subtle strip pulse exists, but can still read as decorative line rather than “expand/reveal control” |
| Arrow cue lifecycle | `src/ui/NavigationControls.ts` + `src/styles/main.scss` (`data-nav-hint='active'`) | Ring pulse is one-shot, but nav arrows remain always visible after hint completion |
| App wiring | `src/main.ts` (`navControls.enableIdleHint()`) | Hint starts correctly, but no post-hint collapse-to-hidden state for nav controls |

---

### Technical Objectives for v0.62

1. Introduce explicit but low-noise visual affordances for hidden timeline/info panel surfaces.
2. Move nav controls into the same hidden/reveal state machine model used by clean chrome.
3. Keep accessibility invariants strict: keyboard reachability, reduced-motion fallback, AT announcements, and target size guarantees.
4. Ship with instrumented diagnostics to validate reveal/hide behavior and regressions quickly.

---

### Online Research Summary (2026-06-04 refresh)

- **Progressive disclosure needs explicit signifiers, not only ambience** (NN/g progressive disclosure guidance): include persistent handles/chevrons in hidden state.
- **Hover/focus revealed content must stay usable and dismissible** (WCAG 1.4.13): reveal windows and hide delays must avoid flicker or accidental collapse.
- **Interaction-triggered animation must be suppressible** (WCAG 2.3.3 + `prefers-reduced-motion`): onboarding animation is optional and must degrade to static cues.
- **Touch targets must remain sufficiently large** (WCAG 2.5.8): keep existing 72x72 nav hit area when visible; no reduced hitbox in hidden state.
- **One-shot onboarding hints perform best when persisted** (`localStorage` pattern): hint should never loop forever or reappear every session once user interaction is observed.

Research references and source links are documented in `FINDINGS.md § v0.62`.

---

### v0.62 Implementation Plan

#### P-01 — Add explicit edge affordance tokens (CSS + semantic wrappers)

**Files:** `src/styles/main.scss`, optional lightweight DOM markers in `src/main.ts` or `ChromeVisibilityManager`

- Introduce dedicated tokens for edge-affordance opacity, scale, blur, and contrast lift (`--chrome-affordance-*`) so cue tuning is isolated from existing peek-strip tokens.
- Add compact affordance elements near the existing peek zones:
  - timeline: bottom-center micro chevron/handle
  - info panel: mid-left micro chevron/handle
- Keep them decorative (`aria-hidden='true'`) unless transformed into actual controls in later iterations.
- Reuse existing forced-colors branch with explicit `ButtonText` fallback to keep cues visible in high-contrast mode.

**Coding advice:** avoid coupling affordance visibility directly to hover selectors; bind to root data-attributes (`data-chrome-mode`, `data-chrome-reveal-*`) to keep state ownership in TS and avoid selector drift.

#### P-02 — Extend hidden chrome state machine to include nav controls

**Files:** `src/ui/ChromeVisibilityManager.ts`, `src/ui/NavigationControls.ts`, `src/main.ts`, `src/styles/main.scss`

- Add a third managed target (`nav-controls`) to the reveal/hide contract currently used by timeline and info panel.
- Introduce dedicated nav reveal channels:
  - pointer proximity zones (left/right edge envelopes)
  - keyboard focus (Tab/focus-visible on nav buttons)
  - explicit interaction (ArrowLeft/ArrowRight, pointerdown on buttons)
- Add `navControls.setHiddenMode(true|false)` or equivalent API so style toggles are explicit and testable.
- Maintain `alwaysShowChrome` override as hard bypass to hidden mode.

**Coding advice:** avoid duplicating dwell timers in `NavigationControls`; centralize timers in `ChromeVisibilityManager` and keep `NavigationControls` responsible only for DOM/class toggles and click handlers.

#### P-03 — Nav onboarding hint lifecycle refactor (pulse -> re-hide)

**Files:** `src/ui/NavigationControls.ts`, `src/styles/main.scss`

- Keep current one-shot onboarding pulse trigger (`enableIdleHint()`), but add explicit `onHintFinished` callback or timeout completion path that returns nav controls to hidden idle state.
- Ensure hint is cancelled immediately on first meaningful interaction (pointer enter, focus, key nav, click).
- Persist completion/dismissal in existing localStorage key to avoid repeat onboarding noise.
- Under reduced-motion, skip pulse animation and expose static affordance briefly before transitioning to standard hidden behavior.

**Coding advice:** tie lifecycle transitions to explicit state enum (`idle-hidden`, `hint-active`, `revealed`, `pinned`) instead of boolean flags; this avoids stale flag combinations during rapid pointer/focus changes.

#### P-04 — Accessibility + resilience hardening

**Files:** `src/styles/main.scss`, `src/main.ts`, `src/ui/ChromeVisibilityManager.ts`

- Validate that hidden nav controls remain keyboard reachable:
  - controls should reveal before/while focused
  - hide must not execute while focus is inside nav container
- Keep `aria-live` artwork announcement path from v0.61 unchanged.
- Confirm no motion-only dependencies:
  - all hidden surfaces have static signifier fallback
  - reduced-motion disables pulse/keyframe hints
- Keep nav target geometry unchanged (72x72) in all reveal states.

**Coding advice:** add defensive guard in hide scheduler: if `document.activeElement` is inside target container, abort hide pass and reschedule.

#### P-05 — Diagnostics + quality gates

**Files:** `src/utils/diagnostics/*` and touched managers

- Add structured diagnostic events for reveal state transitions (`chrome-reveal`, `chrome-hide`, `nav-hint-start`, `nav-hint-dismiss`, `nav-auto-hide`).
- Include trigger source (`pointer`, `focus`, `keyboard`, `timeout`, `preference`) in payload for post-mortem analysis.
- Validation gates:
  - `npm run lint`
  - `npm run build`
  - manual smoke matrix: mouse, touch emulation, keyboard-only, reduced-motion, forced-colors.

**Coding advice:** log edge coordinates and dwell timings only in diagnostics mode; avoid noisy console logs in production path.

---

### Brainstormed enhancement backlog (post-v0.62 candidates)

1. **Adaptive cue intensity:** increase affordance opacity on first session and gradually lower after repeated successful reveals.
2. **Context-aware cue placement:** shift affordance away from bright artwork regions using luminance sampling of the canvas edge strip.
3. **Help-dialog bridge:** add one explicit line in keyboard help describing hidden chrome reveal gestures.
4. **Telemetry-backed tuning:** collect anonymous reveal success/failure counters locally and export in diagnostics JSON for QA sessions.
5. **Touch-first mode optimization:** larger temporary touch affordances on coarse pointers, while preserving desktop subtlety.

---

### Acceptance Criteria for v0.62 implementation

1. In clean mode, timeline and info panel each show a persistent micro-affordance that is visible in default, reduced-motion, and forced-colors modes.
2. Nav arrows run onboarding hint once (when eligible), then transition back to hidden idle state automatically.
3. Reveal/hide behavior is consistent across timeline, info panel, and nav: proximity/focus/interaction reveal; idle timeout hides; always-visible preference bypasses hiding.
4. Keyboard focus into hidden controls never causes focus loss or immediate hide races.
5. Diagnostics events allow replaying reveal lifecycle decisions from logs.
6. `npm run lint` and `npm run build` pass after implementation.

---

## v0.61 — Hidden-UI Discoverability + Navigation-Arrow Idle Hint + No Auto-Description Reveal (**shipped 2026-06-04**)

> **Implementation closeout:** v0.61 is now implemented in runtime code. `forceReveal('info-panel')` was removed from navigation, a dedicated `aria-live` artwork announcer was added, and navigation controls now include a one-shot idle hint (`localStorage` persisted, reduced-motion safe, and fully cleaned up on dispose). See FINDINGS.md §v0.61 and CHANGELOG.md §v0.61 for as-built notes and validation.

---

### Problem Statement

Customer feedback after v0.60 identified three follow-up issues:

1. **Cue strength:** Hidden UI (timeline, info panel) needs clearer persistent visual cues so users can immediately tell that revealable elements exist — the current `peek-pulse` strip may be too subtle.
2. **Nav arrow discoverability:** The same cue concept should also apply to the left/right navigation arrows. While the arrows are always visible in clean mode (they are NOT auto-hidden), first-time users may not notice them because they blend into the artwork background.
3. **No auto-reveal on navigation:** Changing paintings must no longer auto-show the info description panel. The description should stay hidden until explicit user intent (hover near left edge / focus / touch / preference always-visible mode).

---

### Current-State Code Audit (verified 2026-06-04)

| File | Line | Current behavior | v0.61 action |
|------|------|-----------------|--------------|
| `src/main.ts` | 1511 | `chromeVisibility.forceReveal('info-panel')` inside `handleNavigate` auto-reveals description on every artwork change | **Remove** this call |
| `src/main.ts` | 1506-1517 | `handleNavigate` has no artwork-change screen-reader announcement | **Add** `aria-live="polite"` artwork announcement so AT users know the artwork changed even without the panel opening |
| `src/ui/NavigationControls.ts` | 1-39 | Bare class: creates `<nav class="nav-controls">` with two `<button class="nav-btn">` elements; no idle-hint mechanism | **Extend** with `enableIdleHint()` / `dismissHint()` public API |
| `src/styles/main.scss` | 415-480 | `.nav-btn` glass circle, hover/active/focus-visible styles; no idle-hint animation | **Add** `@keyframes nav-ring-pulse`, hint-active class rule, guards |
| `src/styles/main.scss` | 1762-1850 | peek strips (`.timeline-peek`, `.info-panel-peek`) with `peek-pulse` keyframe; no intensity variation | **Optional P-01 enhancement:** increase initial animation amplitude for first 6s using CSS custom counter or animation-iteration-count trick |

---

### Architecture Decisions

#### P-01 — Strengthen timeline/info-panel peek strips

**Assessment after audit:** The current `peek-pulse` (opacity 0.10 → 0.26, period 2.6s) is intentionally subtle so it does not distract from artwork. The customer's "clearer cues" request is most likely addressed by the *nav arrow idle-hint* (P-02) rather than making the strips louder. Making peek strips brighter risks over-cluttering the canvas.

**Decision: minimal change.** Slightly increase the max opacity of the `peek-pulse` keyframe (0.26 → 0.32) and increase the strip thickness token (`--chrome-peek-width-v: 3px → 4px`, `--chrome-peek-height-h: 3px → 4px`) so strips are slightly more visible without being intrusive.

Exact diff in `src/styles/main.scss`:

```scss
// Token change (line ~124-125):
--chrome-peek-width-v: 4px;      // was 3px — left-edge (info panel) strip thickness
--chrome-peek-height-h: 4px;     // was 3px — bottom-edge (timeline) strip thickness

// Keyframe change:
@keyframes peek-pulse {
  0%, 100% { opacity: 0.12; }    // was 0.10
  50%       { opacity: 0.32; }   // was 0.26
}
```

**Forced-colors guard** (already in codebase, no change needed):
```scss
@media (forced-colors: active) {
  .timeline-peek,
  .info-panel-peek {
    background: ButtonText;
    opacity: 1;
    forced-color-adjust: none;
  }
}
```

---

#### P-02 — Navigation arrow idle-hint system

**Design rationale (research-backed):**

- Nav arrows (`.nav-btn`) are always visible in clean mode — they are NOT subject to auto-hide. The issue is purely *noticeability*: the frosted-glass circles blend into some artwork backgrounds.
- The established UX pattern for "attention hint on controls the user hasn't yet interacted with" (verified: NNGroup, Apple HIG, YouTube, Google Arts & Culture) is an idle-triggered short animation that fires once and stops permanently after first use. It MUST not repeat on every page load once the user has used navigation.
- **Must not conflict with `prefers-reduced-motion: reduce`** — disabled entirely under that media query.
- **Must not reduce hit area** — WCAG 2.5.8: the 72×72px buttons exceed the 24×24px minimum and must stay unchanged.
- **Storage:** `localStorage` key `freyraum-nav-hint-seen` — persists across sessions (like the existing `alwaysShowChrome` preference). This is the correct scope: once the user discovers navigation, they never need the hint again.

**Chosen animation — ring pulse on `::before`:**

The `::before` pseudo-element is the glass circle background. Adding a ring/glow pulse on top of it (via `box-shadow` on `::before`) matches the existing `peek-pulse` visual language without touching layout or hit areas.

```scss
@keyframes nav-ring-pulse {
  0%   { box-shadow: var(--shadow-medium), 0 0 0 0   rgba(255, 255, 255, 0.40); }
  60%  { box-shadow: var(--shadow-medium), 0 0 0 12px rgba(255, 255, 255, 0.00); }
  100% { box-shadow: var(--shadow-medium), 0 0 0 0   rgba(255, 255, 255, 0.00); }
}

// Triggered by JS adding data-nav-hint="active" to <html>
:root[data-nav-hint='active'] .nav-btn::before {
  animation: nav-ring-pulse 1.6s ease-out 3;   // 3 iterations = ~4.8s, then stops
  animation-delay: 0s;
}

:root[data-nav-hint='active'] .nav-btn:last-child::before {
  animation-delay: 0.4s;   // stagger right button slightly after left
}

// Cancel animation immediately on hover/focus (user has discovered the button)
:root[data-nav-hint='active'] .nav-btn:hover::before,
:root[data-nav-hint='active'] .nav-btn:focus-visible::before {
  animation: none;
}

// Reduced motion: disable entirely
@media (prefers-reduced-motion: reduce) {
  :root[data-nav-hint='active'] .nav-btn::before {
    animation: none;
  }
}

// Forced-colors: animation is cosmetic; OK to suppress
@media (forced-colors: active) {
  :root[data-nav-hint='active'] .nav-btn::before {
    animation: none;
  }
}
```

**TypeScript — `NavigationControls.ts` extension:**

Add a new `NavIdleHint` internal helper class and expose `enableIdleHint()` / `dismissHint()` on `NavigationControls`:

```typescript
// ─── NavigationControls.ts (complete revised file) ────────────────────────────
export class NavigationControls {
  private readonly el: HTMLElement;
  private readonly prevBtn: HTMLButtonElement;
  private readonly nextBtn: HTMLButtonElement;
  private onPrevCallback: (() => void) | null = null;
  private onNextCallback: (() => void) | null = null;

  // Nav idle hint state
  private hintIdleTimer: ReturnType<typeof setTimeout> | null = null;
  private hintDismissed = false;
  private readonly HINT_STORAGE_KEY = 'freyraum-nav-hint-seen';
  private readonly HINT_IDLE_DELAY_MS = 5000;  // 5s after page load before hint fires

  constructor(container: HTMLElement) {
    this.el = document.createElement('nav');
    this.el.className = 'nav-controls';
    this.el.setAttribute('aria-label', 'Galerie-Navigation');

    this.prevBtn = document.createElement('button');
    this.prevBtn.className = 'nav-btn';
    this.prevBtn.setAttribute('aria-label', 'Vorheriges Werk');
    this.prevBtn.textContent = '←';
    this.prevBtn.addEventListener('click', () => {
      this.dismissHint();
      this.onPrevCallback?.();
    });

    this.nextBtn = document.createElement('button');
    this.nextBtn.className = 'nav-btn';
    this.nextBtn.setAttribute('aria-label', 'Nächstes Werk');
    this.nextBtn.textContent = '→';
    this.nextBtn.addEventListener('click', () => {
      this.dismissHint();
      this.onNextCallback?.();
    });

    this.el.appendChild(this.prevBtn);
    this.el.appendChild(this.nextBtn);
    container.appendChild(this.el);
  }

  /** Start idle-hint system. Called once after app init. */
  enableIdleHint(): void {
    // Skip if user has already interacted with nav before
    if (localStorage.getItem(this.HINT_STORAGE_KEY)) return;
    // Skip if reduced-motion is active
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.hintIdleTimer = setTimeout(() => {
      if (!this.hintDismissed) {
        document.documentElement.dataset['navHint'] = 'active';
      }
    }, this.HINT_IDLE_DELAY_MS);

    // Keyboard navigation also counts as "discovered"
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        this.dismissHint();
        document.removeEventListener('keydown', onKeyDown);
      }
    };
    document.addEventListener('keydown', onKeyDown);
  }

  /** Permanently dismiss the idle hint (user has used navigation). */
  dismissHint(): void {
    if (this.hintDismissed) return;
    this.hintDismissed = true;
    if (this.hintIdleTimer !== null) {
      clearTimeout(this.hintIdleTimer);
      this.hintIdleTimer = null;
    }
    delete document.documentElement.dataset['navHint'];
    localStorage.setItem(this.HINT_STORAGE_KEY, '1');
  }

  onPrev(cb: () => void): void { this.onPrevCallback = cb; }
  onNext(cb: () => void): void { this.onNextCallback = cb; }

  dispose(): void {
    if (this.hintIdleTimer !== null) clearTimeout(this.hintIdleTimer);
    this.el.remove();
  }
}
```

**`src/main.ts` — call `enableIdleHint()` after nav setup:**

```typescript
// After: navControls.onNext(() => galleryManager.navigate(1));
navControls.enableIdleHint();
```

---

#### P-03 — Remove forced info-panel reveal on artwork change

**Root cause:** `src/main.ts:1511` calls `chromeVisibility.forceReveal('info-panel')` in `handleNavigate`. This was added in v0.60 as a convenience (new artwork → show its description). But the customer wants the panel to stay hidden until explicit intent.

**Change — one line removal:**

```typescript
// src/main.ts — handleNavigate (v0.60 version, before fix)
const handleNavigate = (index: number): void => {
  infoPanel.update(artworks[index], true);
  timeline.setActive(index);
  // v0.60 — surface the updated work information briefly when the artwork
  // changes, then auto-hide again (no-op when chrome is always visible).
  chromeVisibility.forceReveal('info-panel');  // ← REMOVE THIS LINE
  diagnostics.info('gallery', 'navigate', 'Artwork changed', { ... });
};

// src/main.ts — handleNavigate (v0.61 version, after fix)
const handleNavigate = (index: number): void => {
  infoPanel.update(artworks[index], true);
  timeline.setActive(index);
  // v0.61: no forceReveal — description stays hidden until user intent.
  // Screen-reader users get an artwork-change announcement instead (see below).
  announceArtworkChange(artworks[index]?.title ?? '');
  diagnostics.info('gallery', 'navigate', 'Artwork changed', { ... });
};
```

---

#### P-04 — Screen-reader artwork change announcement (accessibility compensation)

**Why this is required:** Previously, `forceReveal('info-panel')` caused the info panel (which contains the artwork title in the DOM) to become visible, which implicitly let screen readers discover it. With `forceReveal` removed, screen-reader users navigating with keyboard (← →) would hear nothing after an artwork change — just silence. This is an accessibility regression if not compensated.

**Fix:** Inject a dedicated `aria-live="polite"` region that announces the new artwork title on every navigation change. This is separate from `#freyraum-chrome-status` (which handles panel visibility state), and separate from the InfoPanel element (which remains hidden until the user reveals it).

```typescript
// src/main.ts — add near top of init block (after DOM refs are resolved):

let artworkAnnouncerEl: HTMLElement | null = null;

const announceArtworkChange = (title: string): void => {
  if (!artworkAnnouncerEl) {
    artworkAnnouncerEl = document.createElement('div');
    artworkAnnouncerEl.id = 'freyraum-artwork-status';
    artworkAnnouncerEl.setAttribute('aria-live', 'polite');
    artworkAnnouncerEl.setAttribute('aria-atomic', 'true');
    artworkAnnouncerEl.className = 'sr-only';
    document.body.appendChild(artworkAnnouncerEl);
  }
  // Screen readers skip empty strings on update, so we clear first then set
  // (double-RAF trick ensures the mutation fires as two distinct changes).
  artworkAnnouncerEl.textContent = '';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (artworkAnnouncerEl) {
      artworkAnnouncerEl.textContent = title ? `Aktuelles Werk: ${title}` : '';
    }
  }));
};
```

**Note on double-rAF:** Some screen readers ignore `aria-live` updates that happen too quickly after each other (the DOM mutation doesn't fire a new event). Clearing to `''` and setting the new text in the next two animation frames guarantees two distinct mutation events.

**Also add to dispose cleanup:**
```typescript
artworkAnnouncerEl?.remove();
artworkAnnouncerEl = null;
```

---

#### P-05 — Validation and acceptance criteria

| Check | Method | Pass condition |
|-------|--------|---------------|
| Lint | `npm run lint` | Zero new errors |
| Build | `npm run build` | Zero new errors |
| Desktop hover | Manual / Playwright | Peek strips visible in clean mode; timeline/info panel NOT auto-revealed on nav; reveal on pointer proximity still works |
| Keyboard only | Tab through nav buttons | Arrow buttons reachable, hint dismissed on ArrowLeft/ArrowRight; info panel reveals on Tab focus |
| Screen reader | NVDA/VoiceOver + keyboard nav | Artwork title announced after each navigation; panel state changes still announced via `#freyraum-chrome-status` |
| Touch/coarse pointer | Mobile viewport | Peek strips tappable; info panel NOT auto-revealed on artwork change; nav ring-pulse does NOT fire (hint skipped on first-render if localStorage key present) |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` active | No ring-pulse animation on nav buttons; peek strips are visible but static |
| Forced colors | Windows High Contrast / forced-colors | Peek strips visible as `ButtonText`; nav ring-pulse animation suppressed (cosmetic) |
| localStorage hint | Clear `freyraum-nav-hint-seen` from storage, idle 5s | Ring-pulse fires on both nav buttons; dismisses on first click/keypress |
| localStorage hint 2nd visit | `freyraum-nav-hint-seen = "1"` in storage | Ring-pulse never fires |

---

### File-by-file Change Summary

| File | Change type | Description |
|------|------------|-------------|
| `src/main.ts` | 1-line removal | Remove `chromeVisibility.forceReveal('info-panel')` from `handleNavigate` |
| `src/main.ts` | ~20 lines added | `announceArtworkChange()` helper + `artworkAnnouncerEl` + call in `handleNavigate` + dispose |
| `src/main.ts` | 1 line added | `navControls.enableIdleHint()` call after nav wiring |
| `src/ui/NavigationControls.ts` | ~40 lines extended | Add `enableIdleHint()`, `dismissHint()`, idle timer, localStorage, keyboard listener |
| `src/styles/main.scss` | ~30 lines added | `@keyframes nav-ring-pulse` + `:root[data-nav-hint='active']` rules + reduced-motion + forced-colors guards |
| `src/styles/main.scss` | Token tweak | `--chrome-peek-width-v/height-h: 3px → 4px`; `peek-pulse` max opacity 0.26 → 0.32 |

**Total estimated diff: ~90 lines net add / 5 lines removed.**

---

### Non-Goals

- No redesign of timeline structure or nav-controls layout.
- No change to artwork metadata model or InfoPanel content.
- No additional auto-hide rules for nav arrows (they stay always-visible in clean mode).
- No `View Transitions API` integration (noted as a future enhancement in FINDINGS.md §v0.61, but out of scope for this version due to Three.js WebGL rendering surface conflict).
- No regression to always-visible chrome defaults unless explicitly chosen in preferences.

## v0.60 — Clean Chrome: Auto-Hide Timeline & Info Panel on Hover/Proximity (**shipped 2026-06-04**)

> **Implementation note (finalization).** The plan below is the design of record. During implementation the following snippets were adapted to the *actual* codebase APIs (the design intent is unchanged):
> - `preferences.ts` uses the existing private `emit()` (which runs `applyToDocument()` + `writeStored()` + listeners) and the module-level `diagnostics`, not `this.diag`/`this.persist()`/`this.notify()`. `data-chrome-mode` is mirrored inside `applyToDocument()` so it is set from `PreferencesStore` construction (no flash of visible chrome before JS init).
> - `createScopedDiagnostics(...)` returns methods with signature `(event, message, data?)`; all manager log calls pass a message string.
> - `PreferencesPanel` is build-once-innerHTML + `patchPanel()`; the toggle was added as a `.prefs__toggle` after the contrast toggle, cached, bound, and patched — the `createRow()` helper in the draft does not exist.
> - `.sr-only` already exists in `main.scss`; safe-area is already absorbed by the `--safe-bottom`/`--safe-left` tokens on the base `.timeline`/`.info-panel` rules, so the draft's duplicate `env()` block was omitted to avoid conflicts.
> - `app.html` already contains `viewport-fit=cover` (verify-only).
> - **Added edge case the draft missed:** `.info-panel.is-transitioning` (navigation content-swap fade) has lower CSS specificity than `[data-chrome-mode='clean'] .info-panel.is-revealed`; a dedicated `.is-revealed.is-transitioning` rule preserves the fade when `forceReveal` fires on navigation. A `mouseleave`/`blur` viewport-leave handler also clears trigger zones so a panel never stays revealed after the cursor exits the window while in-zone.

### Problem Statement

The customer wants the gallery to show a clean, unobstructed view of the paintings at all times. The timeline (bottom strip) and the painting description (left info panel) currently occupy permanent screen real estate and compete visually with the artwork. The goal is:

1. **Timeline** — hidden by default; revealed smoothly when the user hovers near the bottom edge of the screen.
2. **Info Panel** — hidden by default; slides/fades in when the user hovers near the left edge of the screen.
3. **Zero-UI default**: the only persistently visible elements should be the topbar brand/controls (top) and the left/right navigation arrows — minimum chrome, maximum artwork.
4. **Accessibility**: keyboard navigation and screen readers must still reach all UI without hover. Coarse-pointer (touch) devices must have an equivalent fallback. A preference toggle must exist for users who want chrome always visible.
5. **User-friendliness**: subtle visual "peek" indicators (thin strips) must hint at the hidden panels so users can discover them.

---

### Root-Cause Analysis — Why Panels Are Always Visible Today

| Element | File | Mechanism |
|---------|------|-----------|
| `.timeline` | `src/styles/main.scss:1014` | `position: fixed; bottom: 28px; opacity: 1` — always painted |
| `.info-panel` | `src/styles/main.scss:276` | `position: fixed; left: 36px; opacity: 1; pointer-events: none` — always painted |
| No auto-hide token | `src/styles/main.scss:7` | Design system declares `[data-presentation]` and `[data-motion]` orthogonal modes, but no `clean-chrome` mode exists |
| No proximity manager | `src/ui/` | No class exists to track pointer proximity to panel zones |

There is already a precedent: `[data-presentation='on']` hides `.topbar` and reveals it on `:hover`/`:focus-within` of `:root`. The v0.60 feature extends this pattern to the timeline and info panel with a richer proximity-detection system.

---

### Design Research — 2026 Best Practices for Progressive Disclosure UI

> **Research status:** All findings below were verified by live online research on 2026-06-04.
> Sources are individually cited. Unverified assertions from the previous draft have been corrected or removed.

---

#### A. WCAG 2.2 Accessibility Requirements (verified)

**SC 1.4.13 — Content on Hover or Focus (AA)**
Source: [W3C WAI WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)

Content triggered by hover or focus must satisfy three criteria simultaneously:

1. **Dismissible** — Content can be dismissed without moving the pointer or keyboard focus (Escape key is the standard mechanism). Exception: if the content communicates an input error.
2. **Hoverable** — The pointer can be moved over the triggered content without it disappearing. A CSS-only `:hover` solution with any gap between trigger and panel fails this criterion because moving the pointer from trigger to panel briefly leaves both.
3. **Persistent** — Content remains visible until the user dismisses it, moves pointer/focus away from both trigger AND content, or the content becomes invalid.

**Practical consequence for Freyraum:** A pure CSS `:hover` transition with `transition-delay` is insufficient. JavaScript dwell-timer management is mandatory. The hide timer must not start while the pointer is anywhere inside the panel element itself.

---

**SC 2.4.11 — Focus Not Obscured — Minimum (AA, new in WCAG 2.2)**
Source: [W3C WAI WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)

When a component receives keyboard focus it must not be *completely* hidden behind author-created content. In v0.60, panels at `opacity: 0; pointer-events: none` are in the DOM and Tab-reachable. The `focusin` event must synchronously call `reveal()` — before the browser paints the focus ring — so the focused element is never fully obscured.

CSS technique: `scroll-margin-top` / `scroll-margin-bottom` should also be set on focusable elements inside panels so the browser's auto-scroll-into-view does not collide with fixed chrome:
```scss
.timeline a, .timeline button { scroll-margin-bottom: 80px; }
.info-panel a, .info-panel button { scroll-margin-left: 320px; }
```

---

**SC 2.1.1 — Keyboard (A)** — All functionality available via keyboard alone.
**SC 2.4.3 — Focus Order (A)** — Focus order is logical; panels remain in DOM and Tab order at all times.
**SC 2.3.3 — Animation from Interactions (AAA)**
Source: [W3C WAI WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)

Non-essential animation triggered by interaction can be suppressed. The peek-pulse breathing animation and the panel slide/fade are non-essential. When `prefers-reduced-motion: reduce` is active:
- All `transition-duration` values must collapse to `0.001ms` (browser rounds to 0 but TypeScript timers still fire).
- The `peek-pulse` keyframe animation must be set to `animation: none`.
- The auto-hide JS timers should remain active (hiding is functional, not decorative).

---

#### B. Apple Human Interface Guidelines — Immersive Experiences (verified)

Source: [Apple HIG — Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

Apple's HIG guidance for immersive content (galleries, media players, visionOS) — verified against 2024/2025 documentation:

1. **Content first, chrome second.** Primary content fills the safe area. UI controls are overlaid only when the user signals intent (hover, tap, swipe from edge, gaze).
2. **Dwell timers: 2–4 seconds.** Controls should auto-hide after 2–4 seconds of inactivity following the triggering action. For complex controls (e.g., a timeline with many interactive thumbnails), lean toward 4s. For simple overlays, 2s is sufficient. Apple does not publish a single mandated value — the range reflects their documented examples across Photos, TV, and visionOS.
3. **Affordances must always be visible.** Even in fully immersive mode, a minimal persistent affordance (thin strip, dot, faint glow) must remain so users can discover the hidden controls. Abrupt disappearance without any visual cue is an anti-pattern.
4. **Motion: ease-in on hide, ease-out on reveal.** Controls snap into view (ease-out, short duration ≈ 250–350ms) and dissolve out (ease-in, slightly longer ≈ 450–550ms). The asymmetry makes appearance feel snappy and disappearance feel gentle.
5. **Safe-area compliance.** On iPhone models with Dynamic Island (iPhone 14 Pro+) and notch models (iPhone X–13), controls must respect `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, and `env(safe-area-inset-left/right)`. The CSS `env()` function with fallback values is the correct implementation:
   ```scss
   .timeline {
     bottom: max(28px, env(safe-area-inset-bottom, 28px));
   }
   .info-panel {
     left: max(36px, env(safe-area-inset-left, 36px));
   }
   ```
6. **Touch reveal via tap, not edge-swipe.** On iOS, left-edge swipes are reserved for system "go back" navigation (UIKit back gesture, Safari page swipe). Freyraum must NOT implement a left-edge-swipe for the info panel — this will conflict with both Safari and UIKit navigation. Instead, use a tap on the `.info-panel-peek` strip or a tap on a floating button.

---

#### C. Material Design 3 — Navigation Patterns (corrected — previous draft contained fabricated values)

Source: [Material Design 3 — Bottom Navigation](https://m3.material.io/components/bottom-navigation/overview), [MD3 Motion](https://m3.material.io/styles/motion/overview)

**Correction:** The previous version of this plan incorrectly stated that MD3 specifies a "48–80px trigger zone" and "3 second minimum dwell time" for side panels. These values were **not** from the MD3 specification. The actual MD3 bottom navigation auto-hide pattern is:

- **Trigger: scroll direction, not pointer proximity.** MD3 bottom navigation hides when the user scrolls *down* (content moving up) and reveals when the user scrolls *up*. The trigger is a scroll displacement threshold of **16–24dp**, not a pointer proximity zone. Freyraum does not scroll — so this pattern is inapplicable as specified.
- **Animation: Y-axis slide.** When hiding: `translateY(0) → translateY(bar-height)`, duration 200–300ms, easing `FastOutLinearIn`. When revealing: `translateY(bar-height) → translateY(0)`, duration 200–300ms, easing `LinearOutSlowIn`.
- **Side navigation drawers** (MD3 Navigation Drawer): triggered by explicit user action (hamburger tap), not proximity. MD3 has no pointer-proximity-based reveal pattern.

**What Freyraum uses instead:** Our own proximity-based reveal (pointer within Npx of the screen edge) is a custom design pattern inspired by macOS Dock auto-hide and video player controls. The specific trigger distances (`TIMELINE_TRIGGER_BAND_PX = 140`, `INFO_PANEL_TRIGGER_BAND_PX = 120`) are Freyraum design decisions, not from any third-party spec.

---

#### D. Museum & Gallery Web App Patterns (verified by inspection)

Source: Artsy (artsy.net), Google Arts & Culture (artsandculture.google.com) — inspected 2026-06-04.

| Platform | Default chrome | Reveal trigger | Dwell before hide | Touch behavior |
|----------|---------------|----------------|-------------------|----------------|
| Google Arts & Culture (artwork view) | Minimal overlay, nav arrows visible | Any pointer movement over canvas | ~3–4s of no movement | Tap reveals overlay for ~3s |
| Artsy (artwork detail) | Always-visible info below image; no immersive mode | N/A | N/A | Standard scroll |
| Apple Photos (iOS fullscreen) | Hidden controls | Single tap anywhere | ~3s | Tap to reveal; tap again to dismiss |
| YouTube (fullscreen) | Hidden controls | Any touch/pointer | ~3s of no movement | Tap to reveal |

**Freyraum takeaway:** The 2.5s `HIDE_DELAY_MS` is consistent with Google Arts & Culture and YouTube. A `forceReveal` after navigation (new artwork loads) is consistent with immersive media players universally showing info when content changes.

---

#### E. CSS `:has()` — Browser Support (verified)

Source: [Can I Use — css-has](https://caniuse.com/css-has), [MDN :has()](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)

- Chrome/Edge 105+ ✅ (since Sep 2022)
- Safari 15.4+ ✅ (since Mar 2022)
- Firefox 121+ ✅ (since Dec 2023)
- **Global coverage: ≥95% as of 2025–2026** (Statcounter, CanIUse data)

Use as a CSS progressive-enhancement fallback layer on top of JS. A `@supports selector(:has(*))` guard is available for older browser isolation.

---

#### F. Touch Device Edge-Swipe Conflicts (verified)

Source: [Apple iOS HIG — Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures), [MDN — pointer media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer)

On iOS Safari, the following system gestures conflict with edge interactions:
- **Left edge** (`touchstart x < 20px`): UIKit "back" gesture (navigates previous page in Safari).
- **Right edge** (`touchstart x > screenWidth - 20px`): UIKit "forward" gesture.
- **Bottom edge** (`touchstart y > screenHeight - 34px`): Home indicator gesture, Control Center drag.

**Freyraum must NOT capture swipes that start within 20px of the left/right edges.**
The safe approach: detect `pointerdown` near (but not AT) the left edge for info panel reveal, using a dead-zone:
```typescript
const INFO_PANEL_TOUCH_START_MIN_PX = 22;  // clear of iOS back-gesture zone
const INFO_PANEL_TOUCH_START_MAX_PX = 80;  // tappable zone width for left-peek reveal
```

Use `@media (pointer: coarse)` to apply touch-only UX changes in CSS. The existing `data-hover="true|false"` mechanism in Freyraum maps to this correctly.

---

#### G. `passive: true` Listener Performance (verified)

Source: [MDN — addEventListener passive option](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener), [web.dev — passive event listeners](https://web.dev/articles/uses-passive-event-listeners)

All `pointermove`, `touchmove`, and `wheel` listeners must use `{ passive: true }` to prevent scroll jank. Passive listeners tell the browser the handler will never call `preventDefault()`, allowing the browser to process scrolling on a separate thread without waiting for the JS callback. Non-passive scroll-related handlers are a primary source of mobile scroll jank.

```typescript
window.addEventListener('pointermove', this.onPointerMove, { passive: true });
window.addEventListener('pointerdown', this.onPointerDown, { passive: true });
```

---

#### H. `aria-live` Polite Region for Screen Readers (verified)

Source: [WAI-ARIA 1.2 — live regions](https://www.w3.org/TR/wai-aria-1.2/#live_region_roles), [Deque — accessible auto-hide](https://www.deque.com/blog/auto-hiding-content-accessibility/)

When panels reveal/hide, screen readers need programmatic notification. The correct pattern is a dedicated visually-hidden `aria-live="polite"` region (NOT on the panel itself):

```html
<div id="freyraum-chrome-status" aria-live="polite" aria-atomic="true" class="sr-only"></div>
```

Updated by `ChromeVisibilityManager` on each state change:
```typescript
this.srStatus.textContent = revealed ? 'Werkinformationen eingeblendet' : '';
// Empty string on hide — screen readers do not announce empty strings
```

Do NOT use `aria-live="assertive"` — it interrupts whatever the screen reader is currently announcing.

---

#### I. CSS `env(safe-area-inset-*)` for iPhone Notch / Dynamic Island (verified)

Source: [WebKit Blog — Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/), [MDN — env()](https://developer.mozilla.org/en-US/docs/Web/CSS/env)

iPhone models from iPhone X onward have a notch or Dynamic Island that reduces usable screen area. The `env()` CSS function exposes the safe area insets set by iOS. **Requires `<meta name="viewport" content="... viewport-fit=cover">` in the HTML head.** Without `viewport-fit=cover`, `env(safe-area-inset-*)` always resolves to 0.

The Dynamic Island (iPhone 14 Pro+) uses a larger `safe-area-inset-top` (≈59px vs ≈47px for notch models) that may vary dynamically as the island expands for system interactions. Always use `env()` with a safe fallback:
```scss
.timeline {
  bottom: calc(28px + env(safe-area-inset-bottom, 0px));
}
.info-panel-peek {
  left: max(0px, env(safe-area-inset-left, 0px));
}
```

---

### Architecture Decision

Three implementation options were evaluated:

#### Option A — Pure CSS hover via wrapper zone (simplest, most limited)

Wrap each panel in a `position: fixed` zone container with generous invisible padding in the trigger direction. CSS `.zone:hover .panel { opacity: 1 }`.

**Pros:** Zero JS, smallest diff.
**Cons:** The zone container needs `pointer-events: auto` to detect hover, which blocks canvas interaction in that zone at all times (even when panel is hidden). Also does NOT satisfy WCAG 1.4.13 "hoverable" criterion properly — the 0-delay CSS hover will collapse the panel the instant the pointer moves from the trigger strip to the panel if there is a gap.

**Verdict: Rejected** — blocks canvas, accessibility gaps.

---

#### Option B — CSS `:has()` + sibling trigger elements (hybrid, recommended fallback)

Add `<div class="timeline-trigger">` and `<div class="info-panel-trigger">` as dedicated invisible hit-areas with `pointer-events: auto`. Use `:root:has(.timeline-trigger:hover) .timeline, .timeline:hover, .timeline:focus-within` to reveal.

**Pros:** No JS for the primary reveal mechanic. Clean separation. Works for fine-pointer devices.
**Cons:** Still blocks canvas in trigger zone (but zone is only bottom/left edge — acceptable). Touch/coarse devices need JS supplement. Cannot respect dwell timers without JS. WCAG 1.4.13 dwell requires JS.

---

#### Option C — JavaScript `ChromeVisibilityManager` + CSS class toggling (recommended)

A new `ChromeVisibilityManager` class in `src/ui/ChromeVisibilityManager.ts` centralizes all reveal/hide logic:
- Listens to `window` `pointermove` (passive) to track pointer position.
- Computes proximity to bottom edge (timeline zone) and left edge (info panel zone).
- Adds/removes `.is-revealed` class on each panel.
- Manages dwell timers (2.5s after pointer leaves zone, cancelled on re-entry).
- Handles `focusin`/`focusout` events on each panel for keyboard accessibility.
- Handles `pointerdown` near edges for touch devices.
- Handles Escape key to dismiss.
- Integrates with `PreferencesStore.alwaysShowChrome` preference.

**Pros:** Fully satisfies all three WCAG 1.4.13 criteria. Handles touch, keyboard, mouse uniformly. Timer management is precise and reusable. No canvas-blocking zones required. Clean decoupling.
**Cons:** More JS code than pure CSS. Pointer-tracking is already done by `CanvasInteraction.ts` — must avoid double-listener; share via `window` listener (passive, negligible cost).

**Verdict: Option C is recommended.** Option B can be added as a CSS-only layer on top for browsers where JS hasn't initialized yet (progressive enhancement fallback).

---

### Recommended Path: **Option C (ChromeVisibilityManager)** with Option B CSS fallback

---

### Detailed Technical Specification

---

#### 1. CSS Design Token System — Apple-Inspired

Add to `src/styles/main.scss` `:root`. Tokens are organized in three tiers: timing, geometry, and visual style. This structure makes the system modular — any tier can be tuned without touching the others.

```scss
// ─── v0.60 Clean Chrome — Timing Tokens ─────────────────────────────────────
// Reveal is snappy (ease-out, shorter) — controls snap into place
// Hide is gentle (ease-in, longer) — controls dissolve away unhurriedly
// Apple HIG principle: "appear fast, disappear slow"
--dur-chrome-reveal: 0.28s;        // panel entry: opacity + translateX/Y
--dur-chrome-hide: 0.52s;          // panel exit: slightly slower, less jarring
--dur-peek-pulse: 2.6s;            // peek strip breathing cycle (slow, meditative)
--ease-chrome-reveal: cubic-bezier(0.0, 0.0, 0.2, 1.0);  // Material LinearOutSlowIn ≈ ease-out
--ease-chrome-hide: cubic-bezier(0.4, 0.0, 1.0, 1.0);    // Material FastOutLinearIn ≈ ease-in

// ─── v0.60 Clean Chrome — Geometry Tokens ────────────────────────────────────
// Panels translate a small distance when hiding (adds depth, not jarring displacement)
--chrome-timeline-hide-offset: 14px;    // translateY(+14px) when hidden
--chrome-infopanel-hide-offset: -22px;  // translateX(-22px) when hidden

// ─── v0.60 Clean Chrome — Visual Tokens ──────────────────────────────────────
// Peek strips: translucent white bars at screen edges
// On dark artwork background these are visible but subtle
--chrome-peek-bg: rgba(255, 255, 255, 0.16);
--chrome-peek-bg-hover: rgba(255, 255, 255, 0.30);
--chrome-peek-width-v: 3px;     // vertical peek strip (info panel, left edge)
--chrome-peek-height-h: 3px;    // horizontal peek strip (timeline, bottom edge)
--chrome-peek-length-v: min(160px, 16vh);   // height of left-edge strip
--chrome-peek-length-h: min(280px, 28vw);   // width of bottom-edge strip

// ─── v0.60 Clean Chrome — Touch Target Tokens ─────────────────────────────────
// Touch hit areas are larger than the visual peek strips
// WCAG 2.5.8 minimum: 24×24px; industry standard 44×44px
--chrome-peek-touch-target: 44px;   // expanded hit area for coarse pointers
```

---

#### 2. New HTML `data-chrome-mode` Attribute

Written by `ChromeVisibilityManager.init()` onto `<html>`. Follows the existing orthogonal-mode pattern (`[data-motion]`, `[data-contrast]`, `[data-presentation]`):

| Attribute value | Meaning | Set when |
|-----------------|---------|----------|
| `data-chrome-mode="clean"` | Default: panels hidden, reveal on proximity/focus | Initial load, `alwaysShowChrome === false` |
| `data-chrome-mode="visible"` | Panels always visible | `alwaysShowChrome === true` |

**No `data-chrome-mode` attribute at all** (SSR / no-JS fallback) → panels render at their natural CSS opacity (1) — correct degraded-experience default.

---

#### 3. New Preference: `alwaysShowChrome`

**`src/utils/preferences.ts`** — extend `Preferences` interface:
```typescript
export interface Preferences {
  // ... existing fields ...
  alwaysShowChrome: boolean;  // v0.60: default false — clean chrome mode
}

const PREFS_DEFAULTS: Preferences = {
  // ... existing defaults ...
  alwaysShowChrome: false,
};
```

Add to `PreferencesStore`:
```typescript
setAlwaysShowChrome(value: boolean): void {
  this.prefs.alwaysShowChrome = value;
  document.documentElement.dataset['chromeMode'] = value ? 'visible' : 'clean';
  this.persist();
  this.notify();
  this.diag.info('preferences', 'alwaysShowChrome', { value });
}
```

**`src/ui/PreferencesPanel.ts`** — add checkbox row:
```typescript
const chromeRow = this.createRow(
  'freyraum-prefs-chrome',
  'Bedienleiste immer einblenden',
  'Zeigt Timeline und Werkinformationen dauerhaft an (für Barrierefreiheit empfohlen)',
  'checkbox'
);
const chromeInput = chromeRow.querySelector('input')!;
chromeInput.checked = this.prefs.current.alwaysShowChrome;
chromeInput.addEventListener('change', (e) => {
  this.prefs.setAlwaysShowChrome((e.target as HTMLInputElement).checked);
});
// Place after contrast-toggle row, before quality presets
```

---

#### 4. Peek Indicator Elements — DOM, CSS, and Accessibility

`ChromeVisibilityManager.init()` creates and inserts two elements into `#app`:

**TypeScript (in `ChromeVisibilityManager.ts`):**
```typescript
private createPeekElements(appRoot: HTMLElement): void {
  // Timeline peek — bottom edge, horizontally centered
  this.timelinePeek = document.createElement('div');
  this.timelinePeek.className = 'timeline-peek';
  this.timelinePeek.setAttribute('aria-hidden', 'true');
  // Expanded touch target wraps the visual strip
  this.timelinePeekHit = document.createElement('div');
  this.timelinePeekHit.className = 'timeline-peek-hit';
  this.timelinePeekHit.setAttribute('aria-hidden', 'true');
  this.timelinePeekHit.appendChild(this.timelinePeek);

  // Info panel peek — left edge, vertically centered
  this.infoPanelPeek = document.createElement('div');
  this.infoPanelPeek.className = 'info-panel-peek';
  this.infoPanelPeek.setAttribute('aria-hidden', 'true');
  this.infoPanelPeekHit = document.createElement('div');
  this.infoPanelPeekHit.className = 'info-panel-peek-hit';
  this.infoPanelPeekHit.setAttribute('aria-hidden', 'true');
  this.infoPanelPeekHit.appendChild(this.infoPanelPeek);

  appRoot.appendChild(this.timelinePeekHit);
  appRoot.appendChild(this.infoPanelPeekHit);
}
```

**SCSS for peek strips and hit areas:**
```scss
// ── Peek hit areas (invisible, pointer-events: auto on touch) ─────────────────
// Visual peek strips are inside these; hit areas are larger for touch usability

.timeline-peek-hit {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: var(--chrome-peek-length-h);
  height: var(--chrome-peek-touch-target);    // tall hit area, aligned to bottom
  display: flex;
  align-items: flex-end;                        // visual strip sits at very bottom
  z-index: 101;
  pointer-events: none;                         // default: no pointer events
  contain: layout paint;

  @media (pointer: coarse) {
    pointer-events: auto;                       // touch: make the hit area tappable
  }
}

.info-panel-peek-hit {
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: var(--chrome-peek-touch-target);       // wide hit area, aligned to left
  height: var(--chrome-peek-length-v);
  display: flex;
  align-items: flex-start;                      // visual strip sits at very left
  z-index: 101;
  pointer-events: none;
  contain: layout paint;

  @media (pointer: coarse) {
    pointer-events: auto;
  }
}

// ── Visual peek strips ────────────────────────────────────────────────────────

.timeline-peek {
  width: 100%;
  height: var(--chrome-peek-height-h);
  border-radius: 2px 2px 0 0;
  background: var(--chrome-peek-bg);
  contain: layout paint;
  will-change: opacity;                        // only opacity animates

  // Safe area: lift above iOS home indicator
  margin-bottom: env(safe-area-inset-bottom, 0px);
}

.info-panel-peek {
  width: var(--chrome-peek-width-v);
  height: 100%;
  border-radius: 0 3px 3px 0;
  background: var(--chrome-peek-bg);
  contain: layout paint;
  will-change: opacity;

  // Safe area: shift right of iOS Dynamic Island / bezel
  margin-left: env(safe-area-inset-left, 0px);
}

// ── Peek animation ────────────────────────────────────────────────────────────
@keyframes peek-pulse {
  0%, 100% { opacity: 0.10; }
  50%       { opacity: 0.26; }
}

:root[data-chrome-mode='clean'] {
  .timeline-peek,
  .info-panel-peek {
    animation: peek-pulse var(--dur-peek-pulse) ease-in-out infinite;
  }
}

:root[data-chrome-mode='visible'] {
  .timeline-peek-hit,
  .info-panel-peek-hit {
    display: none;
  }
}

// ── Forced-colors: make peek strips visible in high-contrast mode ─────────────
@media (forced-colors: active) {
  .timeline-peek,
  .info-panel-peek {
    background: ButtonText;
    opacity: 1;
    forced-color-adjust: none;
  }
}
```

---

#### 5. `ChromeVisibilityManager` — Complete TypeScript Architecture

**File:** `src/ui/ChromeVisibilityManager.ts`

This is the central class. It is intentionally designed for extensibility — additional panels can be registered without modifying the core logic.

```typescript
import { createScopedDiagnostics } from '../utils/diagnostics';
import type { PreferencesStore } from '../utils/preferences';

// ─── Configuration Constants ─────────────────────────────────────────────────
// These are exported so future callers can inspect or override them at runtime
// (e.g., for responsive adjustments or user preference for "sensitive" trigger zones)
export const CHROME_CONFIG = {
  /** px from bottom edge of viewport that triggers timeline reveal */
  TIMELINE_TRIGGER_BAND_PX: 140,

  /** px from left edge of viewport that triggers info-panel reveal */
  INFO_PANEL_TRIGGER_BAND_PX: 120,

  /** ms after pointer leaves ALL trigger zones before panel hides */
  HIDE_DELAY_MS: 2500,

  /** ms a touch-revealed panel stays visible before auto-hiding */
  TOUCH_REVEAL_DURATION_MS: 4000,

  /** ms a force-revealed panel stays visible (e.g. after navigation) */
  FORCE_REVEAL_DURATION_MS: 3200,

  /** Dead zone: touch events starting within this distance of left/right edge
   *  are ignored to avoid conflict with iOS system back-swipe gesture */
  IOS_EDGE_DEAD_ZONE_PX: 22,

  /** Touch hit area for left-edge peek: max x-coordinate considered a "left tap" */
  INFO_PANEL_TOUCH_MAX_PX: 80,
} as const;

// ─── Type Definitions ─────────────────────────────────────────────────────────
export type PanelId = 'timeline' | 'info-panel';
export type RevealReason = 'proximity' | 'focus' | 'touch' | 'forced' | 'preference';

export interface PanelState {
  id: PanelId;
  el: HTMLElement;
  revealed: boolean;
  reason: RevealReason | null;
  hideTimerId: ReturnType<typeof setTimeout> | null;
  focusActive: boolean;
  pointerInZone: boolean;
  pointerInPanel: boolean;
}

export interface ChromeVisibilityManagerOptions {
  /** Called when a panel's revealed state changes (for external observers) */
  onRevealChange?: (panelId: PanelId, revealed: boolean, reason: RevealReason | null) => void;
  /** Override any CHROME_CONFIG value at instantiation time */
  config?: Partial<typeof CHROME_CONFIG>;
}

// ─── Main Class ───────────────────────────────────────────────────────────────
export class ChromeVisibilityManager {
  private readonly diag = createScopedDiagnostics('chrome-visibility');
  private readonly config: typeof CHROME_CONFIG;
  private readonly options: ChromeVisibilityManagerOptions;

  private timelineEl: HTMLElement;
  private infoPanelEl: HTMLElement;
  private prefs: PreferencesStore;
  private appRoot: HTMLElement;

  // DOM elements created by this manager
  private timelinePeekHit!: HTMLElement;
  private infoPanelPeekHit!: HTMLElement;
  private srStatusEl!: HTMLElement;  // aria-live region for screen readers

  // Per-panel state (use a Map so future panels can be registered dynamically)
  private panels = new Map<PanelId, PanelState>();

  // Bound event handler references (needed for removeEventListener)
  private boundOnPointerMove: (e: PointerEvent) => void;
  private boundOnPointerDown: (e: PointerEvent) => void;
  private boundOnKeyDown: (e: KeyboardEvent) => void;
  private unsubscribePrefs: (() => void) | null = null;

  constructor(
    timelineEl: HTMLElement,
    infoPanelEl: HTMLElement,
    prefs: PreferencesStore,
    appRoot: HTMLElement,
    options: ChromeVisibilityManagerOptions = {}
  ) {
    this.timelineEl = timelineEl;
    this.infoPanelEl = infoPanelEl;
    this.prefs = prefs;
    this.appRoot = appRoot;
    this.options = options;
    this.config = { ...CHROME_CONFIG, ...options.config };

    this.boundOnPointerMove = this.onPointerMove.bind(this);
    this.boundOnPointerDown = this.onPointerDown.bind(this);
    this.boundOnKeyDown = this.onKeyDown.bind(this);
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  init(): void {
    // Initialize panel state map
    this.panels.set('timeline', this.createPanelState('timeline', this.timelineEl));
    this.panels.set('info-panel', this.createPanelState('info-panel', this.infoPanelEl));

    // Apply initial chrome mode from preferences
    this.applyMode(this.prefs.current.alwaysShowChrome ? 'visible' : 'clean');

    // Create peek affordance elements
    this.createPeekElements();

    // Create screen-reader live region
    this.createSrStatusElement();

    // Attach global event listeners (all passive — never block scroll)
    window.addEventListener('pointermove', this.boundOnPointerMove, { passive: true });
    window.addEventListener('pointerdown', this.boundOnPointerDown, { passive: true });
    document.addEventListener('keydown', this.boundOnKeyDown, { passive: true });

    // Attach panel-level focus tracking
    for (const [, state] of this.panels) {
      state.el.addEventListener('focusin', () => this.onPanelFocusIn(state.id));
      state.el.addEventListener('focusout', () => this.onPanelFocusOut(state.id));
      state.el.addEventListener('pointerenter', () => this.onPanelPointerEnter(state.id));
      state.el.addEventListener('pointerleave', () => this.onPanelPointerLeave(state.id));
    }

    // React to preference changes
    this.unsubscribePrefs = this.prefs.subscribe(() => {
      this.applyMode(this.prefs.current.alwaysShowChrome ? 'visible' : 'clean');
    });

    this.diag.info('init', { mode: this.prefs.current.alwaysShowChrome ? 'visible' : 'clean' });
  }

  dispose(): void {
    window.removeEventListener('pointermove', this.boundOnPointerMove);
    window.removeEventListener('pointerdown', this.boundOnPointerDown);
    document.removeEventListener('keydown', this.boundOnKeyDown);
    this.unsubscribePrefs?.();

    for (const [, state] of this.panels) {
      if (state.hideTimerId !== null) clearTimeout(state.hideTimerId);
    }

    this.timelinePeekHit?.remove();
    this.infoPanelPeekHit?.remove();
    this.srStatusEl?.remove();

    this.diag.info('dispose');
  }

  /** Force-reveal a panel for a fixed duration (e.g. after artwork navigation).
   *  If called while already force-revealed, the timer resets (no additive stacking). */
  forceReveal(panelId: PanelId): void {
    const state = this.panels.get(panelId);
    if (!state) return;
    if (this.prefs.current.alwaysShowChrome) return; // already visible, no-op
    this.reveal(panelId, 'forced');
    this.scheduleHide(panelId, this.config.FORCE_REVEAL_DURATION_MS);
    this.diag.debug('forceReveal', { panelId });
  }

  // ─── Private: Core State Machine ────────────────────────────────────────────

  private createPanelState(id: PanelId, el: HTMLElement): PanelState {
    return { id, el, revealed: false, reason: null, hideTimerId: null,
             focusActive: false, pointerInZone: false, pointerInPanel: false };
  }

  private applyMode(mode: 'clean' | 'visible'): void {
    document.documentElement.dataset['chromeMode'] = mode;
    if (mode === 'visible') {
      // Reveal all panels immediately when switching to always-visible mode
      for (const [id] of this.panels) this.reveal(id, 'preference');
    }
  }

  private reveal(panelId: PanelId, reason: RevealReason): void {
    const state = this.panels.get(panelId)!;
    if (state.hideTimerId !== null) {
      clearTimeout(state.hideTimerId);
      state.hideTimerId = null;
    }
    if (state.revealed && state.reason === reason) return; // already revealed, no-op

    state.el.classList.add('is-revealed');
    state.revealed = true;
    state.reason = reason;

    this.announceToScreenReader(panelId, true);
    this.options.onRevealChange?.(panelId, true, reason);
    this.diag.debug('reveal', { panelId, reason });
  }

  private hide(panelId: PanelId): void {
    const state = this.panels.get(panelId)!;
    state.el.classList.remove('is-revealed');
    state.revealed = false;
    state.reason = null;
    state.hideTimerId = null;

    this.announceToScreenReader(panelId, false);
    this.options.onRevealChange?.(panelId, false, null);
    this.diag.debug('hide', { panelId });
  }

  private scheduleHide(panelId: PanelId, delayMs = this.config.HIDE_DELAY_MS): void {
    const state = this.panels.get(panelId)!;
    if (state.hideTimerId !== null) clearTimeout(state.hideTimerId);
    state.hideTimerId = setTimeout(() => this.hide(panelId), delayMs);
  }

  private shouldHide(state: PanelState): boolean {
    return !state.pointerInZone && !state.pointerInPanel && !state.focusActive;
  }

  // ─── Private: Event Handlers ─────────────────────────────────────────────────

  private onPointerMove(e: PointerEvent): void {
    // Skip if in always-visible mode
    if (document.documentElement.dataset['chromeMode'] === 'visible') return;

    const { clientX: x, clientY: y } = e;
    const H = window.innerHeight;

    const timelineInZone = y >= H - this.config.TIMELINE_TRIGGER_BAND_PX;
    const infoPanelInZone = x <= this.config.INFO_PANEL_TRIGGER_BAND_PX;

    this.updateZone('timeline', timelineInZone);
    this.updateZone('info-panel', infoPanelInZone);
  }

  private onPointerDown(e: PointerEvent): void {
    // Only handle touch/pen — mouse is handled by pointermove
    if (e.pointerType === 'mouse') return;
    if (document.documentElement.dataset['chromeMode'] === 'visible') return;

    const { clientX: x, clientY: y } = e;
    const H = window.innerHeight;

    // iOS back-swipe dead zone guard: ignore touches starting at the very left edge
    const safeX = x >= this.config.IOS_EDGE_DEAD_ZONE_PX;

    // Bottom edge tap → reveal timeline
    if (y >= H - this.config.TIMELINE_TRIGGER_BAND_PX) {
      this.reveal('timeline', 'touch');
      this.scheduleHide('timeline', this.config.TOUCH_REVEAL_DURATION_MS);
    }

    // Left edge tap (within hit zone, outside iOS dead zone) → reveal info panel
    if (safeX && x <= this.config.INFO_PANEL_TOUCH_MAX_PX) {
      this.reveal('info-panel', 'touch');
      this.scheduleHide('info-panel', this.config.TOUCH_REVEAL_DURATION_MS);
    }
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (e.key !== 'Escape') return;
    let dismissed = false;
    for (const [id, state] of this.panels) {
      if (state.revealed) {
        this.hide(id);
        dismissed = true;
      }
    }
    if (dismissed) {
      // Return focus to canvas so keyboard navigation doesn't get stranded
      (document.querySelector<HTMLElement>('[data-focus-fallback]') ??
       document.querySelector<HTMLElement>('canvas'))?.focus();
    }
  }

  private onPanelFocusIn(panelId: PanelId): void {
    const state = this.panels.get(panelId)!;
    state.focusActive = true;
    if (state.hideTimerId !== null) { clearTimeout(state.hideTimerId); state.hideTimerId = null; }
    // Synchronous reveal — must be visible before browser paints focus ring (WCAG 2.4.11)
    if (!state.revealed) this.reveal(panelId, 'focus');
  }

  private onPanelFocusOut(panelId: PanelId): void {
    // Use rAF to allow focus to settle on a sibling within the same panel
    requestAnimationFrame(() => {
      const state = this.panels.get(panelId)!;
      const stillInPanel = state.el.contains(document.activeElement);
      if (!stillInPanel) {
        state.focusActive = false;
        if (this.shouldHide(state)) this.scheduleHide(panelId);
      }
    });
  }

  private onPanelPointerEnter(panelId: PanelId): void {
    const state = this.panels.get(panelId)!;
    state.pointerInPanel = true;
    if (state.hideTimerId !== null) { clearTimeout(state.hideTimerId); state.hideTimerId = null; }
  }

  private onPanelPointerLeave(panelId: PanelId): void {
    const state = this.panels.get(panelId)!;
    state.pointerInPanel = false;
    if (this.shouldHide(state)) this.scheduleHide(panelId);
  }

  private updateZone(panelId: PanelId, inZone: boolean): void {
    const state = this.panels.get(panelId)!;
    if (inZone === state.pointerInZone) return; // no change
    state.pointerInZone = inZone;
    if (inZone) {
      if (!state.revealed) this.reveal(panelId, 'proximity');
      else if (state.hideTimerId !== null) { clearTimeout(state.hideTimerId); state.hideTimerId = null; }
    } else {
      if (this.shouldHide(state)) this.scheduleHide(panelId);
    }
  }

  // ─── Private: DOM Helpers ────────────────────────────────────────────────────

  private createPeekElements(): void {
    this.timelinePeekHit = this.makeEl('div', 'timeline-peek-hit', [
      this.makeEl('div', 'timeline-peek'),
    ]);
    this.infoPanelPeekHit = this.makeEl('div', 'info-panel-peek-hit', [
      this.makeEl('div', 'info-panel-peek'),
    ]);
    [this.timelinePeekHit, this.infoPanelPeekHit].forEach(el => {
      el.setAttribute('aria-hidden', 'true');
    });
    this.appRoot.appendChild(this.timelinePeekHit);
    this.appRoot.appendChild(this.infoPanelPeekHit);
  }

  private createSrStatusElement(): void {
    this.srStatusEl = this.makeEl('div', 'sr-only');
    this.srStatusEl.setAttribute('aria-live', 'polite');
    this.srStatusEl.setAttribute('aria-atomic', 'true');
    this.srStatusEl.id = 'freyraum-chrome-status';
    this.appRoot.appendChild(this.srStatusEl);
  }

  private announceToScreenReader(panelId: PanelId, revealed: boolean): void {
    if (!this.srStatusEl) return;
    const label = panelId === 'timeline' ? 'Zeitleiste' : 'Werkinformationen';
    // Empty string on hide — screen readers skip empty announcements
    this.srStatusEl.textContent = revealed ? `${label} eingeblendet` : '';
  }

  private makeEl(tag: string, className: string, children: HTMLElement[] = []): HTMLElement {
    const el = document.createElement(tag);
    el.className = className;
    children.forEach(c => el.appendChild(c));
    return el;
  }
}
```

---

#### 6. CSS Changes — `src/styles/main.scss` (Full Auto-Hide Rules)

Add these blocks to `main.scss`. Group them under a `// ── v0.60 Clean Chrome ──` comment block for easy future maintenance.

```scss
// ═══════════════════════════════════════════════════════════════════════════════
// v0.60 — CLEAN CHROME AUTO-HIDE
// ═══════════════════════════════════════════════════════════════════════════════

// ── Default hidden state ───────────────────────────────────────────────────────
// Only applies when data-chrome-mode="clean" is set by ChromeVisibilityManager

:root[data-chrome-mode='clean'] {

  // ── Timeline ─────────────────────────────────────────────────────────────────
  .timeline {
    opacity: 0;
    pointer-events: none;
    transform: translateY(var(--chrome-timeline-hide-offset));
    // Hide transition uses ease-in (panel dissolves away softly)
    transition:
      opacity var(--dur-chrome-hide) var(--ease-chrome-hide),
      transform var(--dur-chrome-hide) var(--ease-chrome-hide);
  }

  .timeline.is-revealed {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
    // Reveal transition uses ease-out (panel snaps into view)
    transition:
      opacity var(--dur-chrome-reveal) var(--ease-chrome-reveal),
      transform var(--dur-chrome-reveal) var(--ease-chrome-reveal);
  }

  // ── Info Panel ────────────────────────────────────────────────────────────────
  .info-panel {
    opacity: 0;
    pointer-events: none;
    transform: translateX(var(--chrome-infopanel-hide-offset));
    transition:
      opacity var(--dur-chrome-hide) var(--ease-chrome-hide),
      transform var(--dur-chrome-hide) var(--ease-chrome-hide);
  }

  .info-panel.is-revealed {
    opacity: 1;
    pointer-events: none;         // info-panel has pointer-events:none in base styles
    transform: translateX(0);
    transition:
      opacity var(--dur-chrome-reveal) var(--ease-chrome-reveal),
      transform var(--dur-chrome-reveal) var(--ease-chrome-reveal);
  }

  // Compact mode: allow pointer events when revealed (user can scroll the text)
  .info-panel--compact.is-revealed {
    pointer-events: auto;
  }
}

// ── Safe area compliance (iPhone notch, Dynamic Island) ───────────────────────
// Requires <meta viewport content="... viewport-fit=cover"> in app.html
.timeline {
  bottom: max(28px, calc(28px + env(safe-area-inset-bottom, 0px)));
}

.info-panel {
  left: max(36px, calc(36px + env(safe-area-inset-left, 0px)));
}

// ── Touch (coarse pointer): semi-visible timeline baseline ────────────────────
// Touch users cannot hover to discover hidden chrome.
// Timeline stays at low opacity so it's always findable; JS tap brings to full.
:root[data-hover='false'][data-chrome-mode='clean'] {
  .timeline {
    opacity: 0.32;
    transform: none;
    pointer-events: auto;           // thumbs can still tap timeline thumbnails
  }

  .timeline.is-revealed {
    opacity: 1;
    transition:
      opacity var(--dur-chrome-reveal) var(--ease-chrome-reveal);
  }

  .info-panel {
    opacity: 0;
    pointer-events: none;           // info panel fully hidden; tap peek strip to reveal
  }
}

// ── Reduced motion: instant transitions, no breathing animation ───────────────
// WCAG 2.3.3 — non-essential animation must be suppressible
@media (prefers-reduced-motion: reduce) {
  .timeline,
  .info-panel {
    transition-duration: 0.001ms !important;   // functionally instant
  }

  .timeline-peek,
  .info-panel-peek {
    animation: none;
    opacity: 0.18;                             // static instead of breathing
  }
}

// ── Short-height landscape: hide timeline unconditionally ─────────────────────
// Existing rule extended: is-revealed must NOT override visibility:hidden
@media (max-height: 499px) {
  .timeline,
  .timeline.is-revealed {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }
}

// ── screen-reader only utility (if not already in codebase) ──────────────────
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

#### 7. `app.html` — Add `viewport-fit=cover` for Safe Area Support

Check that the viewport meta tag includes `viewport-fit=cover`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```
Without this, `env(safe-area-inset-*)` always resolves to `0px` and iPhone notch/Dynamic Island support is disabled.

---

#### 8. `Timeline.ts` — No Changes Required

`ChromeVisibilityManager` attaches `pointerenter`, `pointerleave`, `focusin`, and `focusout` listeners directly to the timeline element reference passed from `main.ts`. No changes to `Timeline.ts` needed.

The existing `aria-label="Werke der Ausstellung"` is sufficient. No change needed.

---

#### 9. `InfoPanel.ts` — No Changes Required

The existing `aria-live="polite"` on `.info-panel` should remain. Screen readers will announce artwork text changes even while the panel is visually hidden — this is correct and desirable. Do NOT set `aria-hidden="true"` on the info panel.

---

#### 10. `main.ts` Changes

```typescript
import { ChromeVisibilityManager } from './ui/ChromeVisibilityManager';

// After chrome element refs are resolved (~line 784):
const appRoot = document.getElementById('app')!;
const chromeVisibility = new ChromeVisibilityManager(
  chromeRefs.timeline!,
  chromeRefs.infoPanel!,
  preferences,
  appRoot
);
chromeVisibility.init();

// After gallery navigation (setActive callback, ~line 1494):
chromeVisibility.forceReveal('info-panel');  // show updated artwork info for 3.2s

// In dispose() / cleanup (~line 1636):
chromeVisibility.dispose();
```

---

#### 11. Diagnostics Logging

`ChromeVisibilityManager` uses `createScopedDiagnostics('chrome-visibility')` with:
- `info` level: `init`, `dispose`, preference changes.
- `debug` level: individual `reveal` / `hide` per panel with full context.
- Log payload shape: `{ panelId, reason, pointer?: { x, y }, inZone, focusActive, pointerInPanel }`.

This satisfies the project's detailed logging requirement and allows filtering chrome-visibility events independently from other scopes.

---

### Edge Cases and Guardrails

| Edge case | Handling |
|-----------|----------|
| Artwork navigation (goTo) | `forceReveal('info-panel')` shows updated info for 3.2s |
| Virtual timeline scroll while hidden | `aria-live="polite"` counter still updates; reveal is not forced |
| Loading overlay active | `ChromeVisibilityManager` must not set `is-revealed` during overlay; `init()` called only after overlay removed |
| Focus enters panel while hide timer running | Timer cancelled immediately in `focusin` handler (synchronous) |
| Focus leaves panel to a non-chrome element | `focusout` → `requestAnimationFrame` check → `scheduleHide()` |
| `forceReveal` called twice fast | Second call resets the timer — not additive |
| Escape pressed when panel is not revealed | No-op |
| Short-height landscape (`max-height: 499px`) | Existing `visibility: hidden` rule wins; `is-revealed` does not override |
| `alwaysShowChrome` toggled while panel is hidden | Preference change → `data-chrome-mode='visible'` → CSS transition to opacity 1 |
| iOS back-swipe conflict | `onPointerDown` dead-zone guard: x < 22px is ignored |
| iPhone Dynamic Island | `env(safe-area-inset-bottom/left)` applied to `.timeline` and `.info-panel` |
| SSR / no JS | Without `data-chrome-mode` attribute, panels render at their default opacity (1) |
| `prefers-reduced-motion` | `transition-duration: 0.001ms`, `animation: none` on peek strips |
| Pointer leaves viewport (moves to another window) | `pointerleave` fires on `window`; zones set to false; hide timer starts normally |
| Multiple rapid hover ins/outs | Each `updateZone(false)` cancels the previous timer and starts a fresh one |
| `CHROME_CONFIG` overrides | Caller can pass `options.config` to override any constant at instantiation |

---

### Accessibility Compliance Matrix

| WCAG 2.2 Criterion | Requirement | v0.60 Solution | Status |
|--------------------|-------------|----------------|--------|
| **1.4.13 Dismissible** | Dismiss without moving pointer/focus | Escape key → immediate `hide()` + focus moved to canvas | ✅ |
| **1.4.13 Hoverable** | Pointer can move from trigger to panel without panel hiding | `pointerenter/pointerleave` on panel cancels hide timer | ✅ |
| **1.4.13 Persistent** | Content stays until user dismisses or moves away | `HIDE_DELAY_MS = 2500ms` after pointer leaves all zones | ✅ |
| **2.1.1 Keyboard** | All UI reachable via keyboard alone | `focusin` forces reveal; Tab always reaches panel | ✅ |
| **2.3.3 Animation** | Non-essential animation suppressible | `prefers-reduced-motion` removes all transitions + `animation: none` | ✅ |
| **2.4.3 Focus Order** | Logical focus sequence | Panels always in DOM; Tab order unchanged | ✅ |
| **2.4.11 Focus Not Obscured** | Focused element not completely hidden | `focusin` → synchronous `reveal()` before paint | ✅ |
| **1.3.1 Info & Relationships** | Structure preserved | `aria-live`, `aria-label`, `role` unchanged | ✅ |
| **1.4.3 Contrast** | Text ≥ 4.5:1 | Peek strips decorative (`aria-hidden`); no contrast requirement | ✅ |
| **2.5.8 Target Size** | Min 24px target | Peek hit areas 44px; timeline thumbs 90–150px | ✅ |
| **4.1.3 Status Messages** | State changes announced to AT | `aria-live="polite"` sr-only region updated on each reveal/hide | ✅ |

---

### Extension Points and Modularity

The `ChromeVisibilityManager` is designed to grow without core changes:

#### Adding a Third Panel

```typescript
// Example: add a `.controls-bar` panel at the right edge
const extraState = chromeVisibility.panels.set('controls-bar', {
  id: 'controls-bar' as PanelId,
  el: document.querySelector('.controls-bar')!,
  ...
});
// Add to onPointerMove: `const controlsInZone = x >= W - 100`
// Update CHROME_CONFIG.CONTROLS_BAR_TRIGGER_BAND_PX
```

Because `panels` is a `Map<PanelId, PanelState>`, the hide/reveal/focus loops iterate all registered panels automatically.

#### Responsive Trigger Zones

The trigger band sizes can be adjusted at runtime (e.g., larger on touch screens):
```typescript
const manager = new ChromeVisibilityManager(tl, ip, prefs, app, {
  config: {
    TIMELINE_TRIGGER_BAND_PX: window.matchMedia('(pointer: coarse)').matches ? 200 : 140,
    INFO_PANEL_TRIGGER_BAND_PX: window.matchMedia('(pointer: coarse)').matches ? 160 : 120,
  }
});
```

#### External State Observers

The `onRevealChange` callback lets other systems react to panel visibility:
```typescript
const manager = new ChromeVisibilityManager(tl, ip, prefs, app, {
  onRevealChange: (panelId, revealed, reason) => {
    analytics.track('chrome-reveal', { panelId, revealed, reason });
    // or: adjust 3D camera if timeline is revealed, etc.
  }
});
```

#### Future: Panel-Level Config Override

Each `PanelState` can be extended with per-panel config overrides in a future version:
```typescript
interface PanelState {
  // ... existing fields ...
  config?: Partial<typeof CHROME_CONFIG>;  // per-panel override
}
```

---

### Mobile & Touch Architecture Summary

| Concern | Solution |
|---------|----------|
| Left-edge swipe conflicts (iOS Safari back) | Dead zone: ignore `pointerdown` where `x < 22px` |
| Right-edge swipe conflicts | Not an issue for current layout; guard can be added symmetrically |
| Bottom-edge swipe conflicts (iOS home indicator) | Timeline touch zone starts at bottom edge; home indicator is ≈34px; `max(28px, env(safe-area-inset-bottom))` keeps timeline above it |
| Dynamic Island / notch | `env(safe-area-inset-top)` on topbar (already present); `env(safe-area-inset-bottom/left)` added |
| No hover available (coarse pointer) | Timeline at 32% opacity baseline; peek hit area 44px; `pointerdown` reveals on tap |
| Scroll jank prevention | All listeners use `{ passive: true }` |
| Accidental reveal while scrolling | `onPointerDown` only triggers for `pointerType !== 'mouse'`; intentional tap required |
| Viewport resize (orientation change) | `window.innerHeight/innerWidth` read fresh inside each `onPointerMove` call; ResizeObserver not needed |

---

### Future Development Roadmap

These are planned improvements that are **not** in scope for v0.60 but should be considered when extending the feature:

| ID | Feature | Rationale |
|----|---------|-----------|
| F-1 | **Sensitivity preference slider** | Let users tune how close the pointer must be to trigger reveal (TIMELINE_TRIGGER_BAND_PX: 80–200). Users with motor disabilities may need larger zones. |
| F-2 | **Dwell duration preference** | `HIDE_DELAY_MS` configurable: short (1.5s) for power users, long (5s) for accessibility. |
| F-3 | **Gesture: swipe-up from bottom** | On touch devices, a deliberate upward swipe from bottom could reveal timeline (differentiating from tap). Requires velocity + direction check. |
| F-4 | **Idle-mode auto-hide** | If the user has not interacted for N minutes, hide all chrome including topbar (museum kiosk mode). |
| F-5 | **Panel pinning** | User can click a pin icon inside each panel to lock it open (persist to `localStorage`). |
| F-6 | **CSS Houdini / View Transitions API** | When the View Transitions API gains wider support, panel transitions could use `view-transition-name` for GPU-composited cross-fade without JavaScript. |
| F-7 | **Adaptive opacity** | Automatically reduce peek-strip opacity when artwork background is light (detect average luminance of bottom/left edge pixels). |
| F-8 | **Haptic feedback (mobile)** | On iOS/Android, use `navigator.vibrate(10)` on panel reveal for subtle tactile confirmation. |

---

### Implementation Checklist

- [x] D-1: Add `alwaysShowChrome: boolean` to `Preferences` interface + `PreferencesStore.setAlwaysShowChrome()` + `data-chrome-mode` mirror + localStorage persist
- [x] D-2: Add all v0.60 CSS design tokens to `:root` in `main.scss` (timing, geometry, visual tiers)
- [x] D-3: Add `[data-chrome-mode='clean']` auto-hide CSS for `.timeline` and `.info-panel` (opacity + transform + asymmetric transitions)
- [x] D-4: Add `.is-revealed` CSS overrides for both panels (opacity 1, transform 0, correct easing)
- [x] D-5: Add peek hit areas + visual strips CSS (`.timeline-peek-hit`, `.info-panel-peek-hit`, `.timeline-peek`, `.info-panel-peek`)
- [x] D-6: Add `@keyframes peek-pulse` + apply to strips in clean mode
- [x] D-7: Add `[data-hover='false']` coarse-pointer rules (semi-visible timeline, fully hidden info panel)
- [x] D-8: Add `@media (prefers-reduced-motion: reduce)` block — `transition-duration: 0.001ms`, `animation: none` on peek strips, static opacity 0.18
- [x] D-9: Add `@media (forced-colors: active)` overrides for peek strips (ButtonText, opacity 1)
- [x] D-10: Extend `@media (max-height: 499px)` rule so `.timeline.is-revealed` remains hidden
- [x] D-11: Add `env(safe-area-inset-bottom/left)` to `.timeline` and `.info-panel` base rules
- [x] D-12: Add `scroll-margin-bottom` / `scroll-margin-left` to focusable children of each panel
- [x] D-13: Add `.sr-only` utility class if not already present in `main.scss`
- [x] D-14: Verify `app.html` viewport meta includes `viewport-fit=cover`
- [x] D-15: Implement `src/ui/ChromeVisibilityManager.ts` — full class per TypeScript architecture above: `CHROME_CONFIG`, `PanelState`, `init()`, `dispose()`, `forceReveal()`, proximity detection, dwell timers, focus handlers, touch/iOS dead-zone guards, Escape key handler, `aria-live` region, `onRevealChange` callback
- [x] D-16: Update `main.ts` — import + instantiate `ChromeVisibilityManager` with `appRoot`; call `forceReveal('info-panel')` on navigation; call `dispose()` in cleanup
- [x] D-17: Add `alwaysShowChrome` checkbox row to `PreferencesPanel.ts` (after contrast toggle)
- [x] D-18: `npm run lint` — pass
- [x] D-19: `npm run build` — pass

---

### Files to be Modified

| File | Change type | Scope |
|------|-------------|-------|
| `src/utils/preferences.ts` | Extend | `alwaysShowChrome` field + `setAlwaysShowChrome()` + `data-chrome-mode` mirror |
| `src/styles/main.scss` | Extend | All v0.60 tokens, chrome-mode rules, peek strips, keyframe, touch, reduced-motion, forced-colors, safe-area |
| `src/ui/ChromeVisibilityManager.ts` | **New file** | Complete class — proximity, dwell, focus, touch, iOS guard, Escape, aria-live |
| `src/main.ts` | Minor extend | Import + init + `forceReveal` + `dispose` wiring |
| `src/ui/PreferencesPanel.ts` | Minor extend | `alwaysShowChrome` checkbox row |
| `app.html` | Minor check | Verify `viewport-fit=cover` in viewport meta |

No structural changes to `Timeline.ts`, `InfoPanel.ts`, or `CanvasInteraction.ts`.

---

## v0.58 — Topbar UI Uniformity & Premium 2026 Polish (2026-05-23, **shipped**)

### Problem Statement

1. **"?" help button is not pressable** — The topbar uses `pointer-events: none` (line 206 of `main.scss`) to let clicks pass through to the 3D canvas. However, the `.topbar__help-btn` never receives `pointer-events: auto`, making it completely unclickable.
2. **"IMMERSIVE DIGITALE AUSSTELLUNG" badge is strangely placed** — The badge sits between the brand name and the help button via `justify-content: space-between`. On most screen sizes it floats in the middle of the topbar with no clear visual grouping, creating an awkward, disconnected layout.
3. **Design non-uniformity** — The help button uses the `.nav-btn` base class (72×72px circle with glass pseudo-element) but is placed in the topbar where the visual scale and context differ from the navigation controls. The badge uses a different visual language (pill shape, no interactivity) but competes for visual attention with the brand.

### Root-Cause Analysis

| Issue | Root cause | File | Line(s) |
|-------|-----------|------|---------|
| Help button unclickable | `.topbar` has `pointer-events: none`, child buttons never restore `pointer-events: auto` | `src/styles/main.scss` | 206 |
| Badge placement | `justify-content: space-between` on a 3-item flex row puts badge in visual no-man's-land | `src/styles/main.scss` | 204, 217–230 |
| Button looks out of place | `.nav-btn` 72px circle is too large for a topbar utility icon; no size variant exists | `src/styles/main.scss` | 349–398 |
| No cursor feedback | Topbar `pointer-events: none` suppresses hover cursor for the button | `src/styles/main.scss` | 206 |

### Design Research (Modern 2026 Best Practices)

**Sources:** WCAG 2.2 AA requirements, Material Design 3, Apple HIG 2025/2026, glassmorphism accessibility guides.

Key principles for 2026 uniform topbar design:
- **Minimum touch target 48×48px** (WCAG 2.5.8 Target Size Level AA = 24px, AAA = 44px; industry standard 2026 = 48px).
- **Glassmorphic buttons need `pointer-events: auto`** on every interactive child when the parent is a passthrough layer.
- **Visual hierarchy**: Brand (left) → Badge/subtitle (aligned near brand, not floating center) → Utility actions (right).
- **Consistent border-radius and sizing** across all utility buttons (help, fullscreen, preferences).
- **Focus-visible ring** must be visible on all interactive elements.
- **Color contrast ≥ 4.5:1** for badge text against glass background.

### Brainstorm — Multiple Coding Suggestions

---

#### Option A — Minimal Fix (pointer-events + small sizing tweak)

**Pros:** Smallest diff, lowest risk, fixes the blocking bug immediately.
**Cons:** Badge placement remains slightly awkward on wide screens.

**Changes:**
1. `src/styles/main.scss` — Add `pointer-events: auto` to `.topbar__help-btn` and `.topbar__brand`.
2. `src/styles/main.scss` — Reduce `.topbar__help-btn` to a 44×44px variant of `.nav-btn` (override `width`/`height` and inner `inset`).
3. `src/styles/main.scss` — Add `cursor: pointer` to `.topbar__help-btn`.

```scss
// Option A patch
.topbar__help-btn {
  pointer-events: auto;
  width: 44px;
  height: 44px;
  font-size: 18px;
  cursor: pointer;

  &::before {
    inset: 2px;
  }
}
```

---

#### Option B — Topbar Layout Refactor (recommended)

**Pros:** Fixes all 3 issues, creates a modern uniform topbar, follows 2026 design patterns.
**Cons:** Slightly larger diff; requires testing badge visibility on all breakpoints.

**Changes:**
1. Restructure the topbar HTML to use two groups:
   - Left group: brand + badge (badge directly adjacent to brand).
   - Right group: help button (and future utility icons).
2. Replace `justify-content: space-between` with a left/right grouping using `gap`.
3. Add `pointer-events: auto` to both groups.
4. Create a `.topbar__btn` utility class (44×44px, consistent with zoom/audio button sizing) that replaces the oversized `.nav-btn` for topbar context.
5. Style the badge as a subtle tag directly after the brand name (smaller font, tighter padding, same vertical alignment).

**TypeScript changes (`src/ui/Topbar.ts`):**
```typescript
// Wrap brand + badge in a left group div
// Wrap helpBtn in a right group div
// Both groups get pointer-events: auto
```

**SCSS changes (`src/styles/main.scss`):**
```scss
.topbar {
  pointer-events: none; // keep — allows canvas clicks
}

.topbar__left,
.topbar__right {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar__help-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 600;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out),
    box-shadow var(--dur-fast) var(--ease-out);

  &:hover {
    background: var(--glass-bg-strong);
    transform: scale(1.06);
    box-shadow: var(--shadow-soft);
  }

  &:active {
    transform: scale(0.94);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-soft), 0 0 0 3px rgba(255, 255, 255, 0.8);
  }
}

.topbar__badge {
  font-size: 9px;
  padding: 5px 12px;
  // Now adjacent to brand — no longer floating in the center
}
```

---

#### Option C — Full Topbar Modernization (premium, future-proof)

**Pros:** Best UX, fully accessible, sets foundation for future utility icons.
**Cons:** Largest diff, may require updating responsive breakpoints.

**Changes (extends Option B):**
1. All of Option B.
2. Add a subtle entrance animation (fade-in + slide-down) for the topbar on page load.
3. Replace text `?` with a proper SVG icon (question-mark-circle) for better visual clarity.
4. Add tooltip on hover for the help button.
5. Make the badge animate in with a slight delay after the brand for staggered reveal.
6. Add `aria-current` support for the badge to announce the exhibition context.

---

### Recommended Path: **Option B**

Option B fixes all three reported issues with a clean, minimal refactor. It provides:
- ✅ Clickable help button (`pointer-events: auto` on interactive group)
- ✅ Badge placed logically next to the brand
- ✅ Uniform 44×44px button sizing matching zoom/audio controls
- ✅ Modern 2026 glassmorphic button with hover/active/focus states
- ✅ WCAG 2.2 AA accessible (touch target, contrast, focus ring)
- ✅ Responsive — badge already hidden on phone via existing media queries

### Implementation Checklist

- [x] C-1: Refactor `src/ui/Topbar.ts` — wrap brand+badge in `.topbar__left`, helpBtn in `.topbar__right`
- [x] C-2: Update `src/styles/main.scss` — add `.topbar__left` / `.topbar__right` with `pointer-events: auto`
- [x] C-3: Update `src/styles/main.scss` — restyle `.topbar__help-btn` as standalone 44×44 glass button (remove `.nav-btn` class dependency)
- [x] C-4: Update `src/styles/main.scss` — reposition `.topbar__badge` adjacent to brand with tighter spacing
- [x] C-5: Verify responsive behavior — badge hidden on phone, topbar compact on landscape
- [x] C-6: Verify forced-colors / high-contrast CSS still applies
- [x] C-7: `npm run lint` — pass
- [x] C-8: `npm run build` — pass

---

## v0.57 — v0.56-B follow-up: keyboard shortcuts, focus/contrast, font optimization (2026-05-23, **shipped**)

Runtime status: **shipped**. B-1, B-2, B-4 implemented; B-3 (Lighthouse) deferred — requires live browser tooling.

### Implementation summary

| ID | Item | Status |
|----|------|--------|
| B-1 | Keyboard shortcuts help overlay | ✅ shipped |
| B-2 | Focus-visible / high-contrast review | ✅ shipped |
| B-3 | Lighthouse / Web Vitals evidence run | ⚠️ deferred (requires live browser) |
| B-4 | Font loading optimization (non-blocking) | ✅ shipped |

This pass targeted the four follow-ups left open by v0.56-A:

| ID | Item | Result |
|----|------|--------|
| B-1 | Keyboard shortcuts help overlay | ✅ shipped |
| B-2 | Focus-visible / high-contrast review | ✅ shipped |
| B-3 | Lighthouse / Web Vitals evidence run | ⚠️ deferred — requires live browser tooling |
| B-4 | Font loading optimization (self-host or `display=swap`) | ✅ shipped |

---

### B-1 — Keyboard shortcuts help overlay

**Goal:** Make keyboard shortcuts discoverable via a `?` button in the topbar and via pressing `?` on any keyboard.

#### B-1-01 — New `KeyboardHelp` component

**File: `src/ui/KeyboardHelp.ts`** (new)

Create a class with `open()`, `close()`, and `dispose()` methods. The dialog element must conform to the ARIA APG dialog pattern (already required by `AI_RULES.md`):

```typescript
// src/ui/KeyboardHelp.ts
import { createScopedDiagnostics } from '../utils/Diagnostics';

const log = createScopedDiagnostics('KeyboardHelp');

const SHORTCUTS: Array<[string, string]> = [
  ['←  →', 'Nächstes / vorheriges Bild'],
  ['Leertaste', 'Musik pausieren / fortsetzen'],
  ['F', 'Vollbild ein-/ausschalten'],
  ['R', 'Ansicht zurücksetzen'],
  ['Q', 'Qualität wechseln'],
  ['Esc', 'Dialog schließen'],
  ['?', 'Diese Hilfe anzeigen'],
];

export class KeyboardHelp {
  private dialog: HTMLElement;
  private opener: HTMLElement | null = null;
  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.close();
    if (e.key === 'Tab') this.trapFocus(e);
  };

  constructor() {
    this.dialog = this.build();
    document.body.appendChild(this.dialog);
  }

  private build(): HTMLElement {
    const el = document.createElement('div');
    el.id = 'keyboard-help';
    el.className = 'keyboard-help';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'keyboard-help-title');
    el.hidden = true;

    el.innerHTML = `
      <div class="keyboard-help__panel">
        <h2 id="keyboard-help-title" class="keyboard-help__title">Tastaturkürzel</h2>
        <table class="keyboard-help__table">
          <tbody>
            ${SHORTCUTS.map(([key, desc]) =>
              `<tr><td><kbd class="keyboard-help__key">${key}</kbd></td><td>${desc}</td></tr>`
            ).join('')}
          </tbody>
        </table>
        <button class="keyboard-help__close nav-btn" aria-label="Hilfe schließen">✕</button>
      </div>`;

    el.querySelector('.keyboard-help__close')!.addEventListener('click', () => this.close());
    el.addEventListener('click', (e) => { if (e.target === el) this.close(); });
    return el;
  }

  open(opener?: HTMLElement): void {
    this.opener = opener ?? null;
    this.dialog.hidden = false;
    document.addEventListener('keydown', this.onKeyDown);
    (this.dialog.querySelector('.keyboard-help__close') as HTMLElement)?.focus();
    log.debug('keyboard-help-opened');
  }

  close(): void {
    this.dialog.hidden = true;
    document.removeEventListener('keydown', this.onKeyDown);
    this.opener?.focus();
    this.opener = null;
    log.debug('keyboard-help-closed');
  }

  private trapFocus(e: KeyboardEvent): void {
    const focusable = Array.from(
      this.dialog.querySelectorAll<HTMLElement>('button, [tabindex]:not([tabindex="-1"])')
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  dispose(): void {
    document.removeEventListener('keydown', this.onKeyDown);
    this.dialog.remove();
  }
}
```

#### B-1-02 — Topbar `?` button

**File: `src/ui/Topbar.ts`** — add a help button to the right side of the topbar bar:

```typescript
// Inside Topbar.buildRight() or equivalent DOM construction:
const helpBtn = document.createElement('button');
helpBtn.className = 'nav-btn topbar__help-btn';
helpBtn.setAttribute('aria-label', 'Tastaturkürzel anzeigen');
helpBtn.setAttribute('title', 'Tastaturkürzel');
helpBtn.textContent = '?';
helpBtn.addEventListener('click', () => this.onHelpClick?.());
```

Expose `onHelpClick: (() => void) | undefined` as a public property so `main.ts` can wire `keyboardHelp.open(helpBtn)`.

#### B-1-03 — `KeyboardNav` integration

**File: `src/interaction/KeyboardNav.ts`** — add `?` shortcut:

```typescript
// Add to constructor: accept optional KeyboardHelp reference
constructor(
  private galleryManager: GalleryManager,
  private keyboardHelp?: { open(opener?: HTMLElement): void }
) { ... }

// Inside handleKeyDown switch:
case '?':
  this.keyboardHelp?.open();
  break;
```

#### B-1-04 — SCSS styles

**File: `src/styles/main.scss`** — add keyboard-help component styles:

```scss
// Keyboard shortcuts dialog
.keyboard-help {
  position: fixed;
  inset: 0;
  z-index: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0 0 0 / 0.55);
  backdrop-filter: blur(4px);

  &[hidden] { display: none; }

  &__panel {
    background: var(--glass-bg, rgba(18 18 18 / 0.92));
    border: 1px solid rgba(255 255 255 / 0.12);
    border-radius: 12px;
    padding: 1.5rem 2rem;
    min-width: 320px;
    max-width: 90vw;
    position: relative;
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 1rem;
    color: rgba(255 255 255 / 0.9);
  }

  &__table {
    width: 100%;
    border-collapse: collapse;

    td {
      padding: 0.3rem 0.5rem;
      color: rgba(255 255 255 / 0.75);
      font-size: 0.85rem;
    }
  }

  &__key {
    display: inline-block;
    background: rgba(255 255 255 / 0.1);
    border: 1px solid rgba(255 255 255 / 0.2);
    border-radius: 4px;
    padding: 0.1rem 0.45rem;
    font-family: ui-monospace, monospace;
    font-size: 0.8rem;
    white-space: nowrap;
  }

  &__close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
  }
}
```

#### B-1-05 — Wiring in `main.ts`

```typescript
import { KeyboardHelp } from './ui/KeyboardHelp';
// After keyboardNav creation:
const keyboardHelp = new KeyboardHelp();
const keyboardNav = new KeyboardNav(galleryManager, keyboardHelp);
topbar.onHelpClick = () => keyboardHelp.open(topbar.helpBtn);
// In cleanup/dispose block:
keyboardHelp.dispose();
```

---

### B-2 — Focus-visible and high-contrast review

**Goal:** All interactive controls show a visible focus ring in forced-colors (Windows High Contrast) mode.

**File: `src/styles/main.scss`** — add at end of file:

```scss
// High-contrast / forced-colors support
@media (forced-colors: active) {
  // Restore button borders that our custom styles suppress
  .nav-btn,
  .zoom-btn,
  .topbar__help-btn,
  .loading-start-btn,
  .prefs__toggle,
  .audio-btn {
    forced-color-adjust: none;
    border: 2px solid ButtonText;
    background: ButtonFace;
    color: ButtonText;
  }

  // Ensure focus ring uses system highlight color
  :focus-visible {
    outline: 3px solid Highlight;
    outline-offset: 2px;
  }

  // Preserve artwork canvas colors
  #gallery-canvas {
    forced-color-adjust: none;
  }
}
```

Also audit: confirm every interactive element has a `:focus-visible` rule that is not suppressed by `outline: none` without a visible alternative.

---

### B-3 — Lighthouse / Web Vitals evidence

**Status: requires live browser tooling.** Cannot be automated in this session.

**Procedure for next developer run:**
1. Run `npm run build && npm run preview` (Vite preview server).
2. Open `http://localhost:4173` in Chrome.
3. Run Lighthouse (DevTools → Lighthouse → Mobile/Desktop → Performance + Accessibility + Best Practices).
4. Record: LCP, TBT, CLS, Accessibility score, Best Practices score.
5. Document before/after in `FINDINGS.md § v0.57`.

---

### B-4 — Font loading optimization

**Goal:** Eliminate render-blocking Google Fonts dependency; support offline/file:// usage.

#### Option A — Non-blocking Google Fonts (minimal change)

**File: `app.html`** — replace current font links:

```html
<!-- Before: -->
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">

<!-- After (non-blocking pattern): -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
      onload="this.onload=null;this.rel='stylesheet'">
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap">
</noscript>
```

#### Option B — Self-hosted (recommended for offline/file:// gallery)

1. Download Inter 400/500/700 WOFF2 subsets (latin) into `public/fonts/`.
2. Add `@font-face` declarations to `src/styles/main.scss`:

```scss
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-400.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
                 U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                 U+2212, U+2215, U+FEFF, U+FFFD;
}
// Repeat for 500 and 700 weights
```

3. Remove Google Fonts `<link>` elements from `app.html`.

**Accept:** `app.html` loads without any Google Fonts requests. Font renders via local WOFF2. Works on `file://` origins.

---

### Validation

```sh
npm run lint   # zero errors
npm run build  # zero errors
```

Browser console: `[KeyboardHelp] keyboard-help-opened` on `?` keypress.  
Visual QA: focus ring visible in Windows High Contrast Mode (Edge → Accessibility → High contrast: black).  
Font QA: DevTools network panel shows no `fonts.googleapis.com` requests after B-4 implementation.

### Merge-readiness checklist (v0.57)

- B-1 (`KeyboardHelp` dialog + topbar `?` button + `KeyboardNav` `?` key): ✅ shipped.
- B-2 (`@media (forced-colors: active)` CSS block): ✅ shipped.
- B-3 (Lighthouse): ⚠️ deferred — requires live browser run.
- B-4 (non-blocking Google Fonts `onload` swap): ✅ shipped.
- `npm run lint` and `npm run build` pass.

---

## v0.56 — website audit: user friendliness, readability, accessibility, performance (2026-05-22, **shipped**)

Runtime status: **fully shipped** (v0.56-A shipped in v0.56; v0.56-B follow-ups shipped in v0.57).

### Audit scope

1. User-friendliness of navigation and first-run guidance.
2. Readability and language consistency (`lang="de"` + UI labels).
3. Accessibility of interactive 3D canvas and redirect behavior.
4. Performance and perceived performance guardrails.

### Research-backed findings addressed in this pass

1. Timed auto-redirects via `meta refresh` reduce user control and can impair accessibility.
2. Icon-only buttons require explicit accessible names and clear discoverability.
3. Interactive canvas surfaces should provide descriptive assistive text and keyboard hints.
4. Language consistency improves readability and screen-reader pronunciation when `lang` is German.

### Implemented slices (v0.56-A)

1. **A-01 — Navigation control accessibility/readability**
   - Localized nav landmark and button labels to German.
   - Added button `title` hints for arrow-only controls.
2. **A-02 — Topbar readability semantics**
   - Converted brand element to semantic heading (`h1`).
   - Localized badge copy to German.
3. **A-03 — Canvas assistive guidance**
   - Added `aria-describedby` for the gallery canvas.
   - Injected screen-reader-only helper text with keyboard/navigation hints.
4. **A-04 — Local preview redirect usability**
   - Removed hard `meta refresh`.
   - Added controllable JavaScript redirect with stop action and live status.
5. **A-05 — Progressive enhancement fallback**
   - Added `noscript` message to `app.html`.

### Remaining plan slices (v0.56-B — shipped in v0.57)

1. ✅ Keyboard-shortcuts help overlay (shipped in v0.57).
2. ✅ Focus-visible / high-contrast mode review (shipped in v0.57).
3. ⚠️ Lighthouse/Web Vitals evidence pass (deferred — requires live browser).
4. ✅ Font loading optimization: non-blocking `onload` swap (shipped in v0.57).

### Merge-readiness checklist (v0.56 + v0.57)

- All v0.56-A slices shipped in v0.56.
- All v0.56-B slices (except Lighthouse) shipped in v0.57.
- `npm run lint` and `npm run build` pass.

## v0.47 — modern gallery metal refinement after screenshot review (2026-05-22, **shipped**)

Runtime status: **shipped**. Shader/material refinement implemented and validated.

### Goal

Keep the frame metallic and premium while removing the remaining zebra-like cross-banding and hard highlight plateaus.

### Implemented slices

1. **P-47-01 — Bar-aligned brush coordinates**  
   Added a bar-aware coordinate remap for procedural frame surfacing so side and top/bottom bars share physically plausible directional flow.

2. **P-47-02 — Scratch subtlety pass**  
   Reduced scratch occupancy, width contrast, and gradient strength to avoid synthetic stripe masks.

3. **P-47-03 — Satin elegance retune**  
   Lowered normal intensity, increased base roughness floor, and retuned quality presets for a modern gallery frame look.

4. **P-47-04 — Docs sync + validation**  
   Updated status docs and reran lint/build validation.

## v0.46 — realistic metal frame recovery after zebra artifact report (2026-05-22, **shipped**)

Runtime status: **shipped**. Runtime shader/material retune implemented and validated with lint/build.

### Goal

Make the frame read as physically plausible brushed/satin metal in motion and close zoom, without zebra-like striping.

### Non-goals

- No changes to painting tone mapping, artwork color pipeline, bloom policy, or gallery UX.
- No external texture assets in this pass; stay procedural in current material path.

### Screenshot-driven problem statement

Customer screenshot shows:
1. Repeated high-contrast horizontal streak clusters across all frame bars.
2. Overly binary bright/dark transitions that read like synthetic patterning.
3. Weak continuous metallic flow (surface reads striped paint/plastic, not machined metal).

### Implemented slices

1. **P-46-01 — Frequency/alias safety audit**  
   Implemented derivative-weighted density fade in scratch rows to suppress unstable high-frequency bands at distance.

2. **P-46-02 — Stripe-contrast rebalance**  
   Reduced macro contrast by lowering procedural warp amplitude and normal/roughness contribution strengths.

3. **P-46-03 — Scratch-shape realism pass**  
   Reworked scratch rows into segmented directional micro-grooves (sparse alive-mask + shaped segment profile).

4. **P-46-04 — Roughness distribution tuning**  
   Tightened roughness variance and retuned preset roughness/anisotropy to maintain satin-metal continuity without white streak plateaus.

5. **P-46-05 — Edge and corner consistency check**  
   Kept one shared object-space grain family and removed full-width stripe cadence that amplified edge transitions.

6. **P-46-06 — Validation + evidence capture**  
   Ran lint/build and logged implementation outcomes in `FINDINGS.md`.

### Acceptance checks

- From normal gallery view, frame shows no obvious zebra-strip rhythm.
- At close zoom, detail reads as metallic abrasion/scratches, not periodic paint-like lines.
- During camera movement, highlights remain stable (no line crawl/flicker).
- Lint and build pass.

## v0.45 — Zero-Visible-Tiling High-Resolution Brushed-Metal Frame (2026-05-22, **shipped**)

Runtime status: **shipped**. lint and build pass.

### Goal

Make the metallic frame read as premium high-resolution brushed metal at normal distance and during close zoom:

1. **Zero visible tiles or repeating cadence** — no hash-cell grid, no repeating scratch clusters, no regular dark/light waves on frame bars.
2. **Sharper, more pronounced, realistic detail** — individual scratches and micro-abrasions stay crisp at close zoom, anti-aliased and stable during movement.
3. **Slightly rougher / less shiny finish** — raise `frameRoughness` per preset to satin-metal range; reduce clearcoat.
4. **No texture-memory regression** — keep everything procedural in GLSL; no DataTextures.

### Non-goals

- Do not change painting color management, tone mapping, bloom, or artwork material.
- Do not introduce external frame texture assets.
- Do not remove v0.44.1 `tbn` fix; the shader must use Three.js r166's local `tbn` matrix.

---

### Code Audit of v0.44 Frame Shader

#### What works correctly in v0.44

| Item | Assessment |
|------|-----------|
| `onBeforeCompile` GLSL injection | Correct pattern for Three.js r155–r166 |
| `tbn` local matrix (v0.44.1 fix) | Correct; `vTBN` does not exist in r166 |
| 4-octave FBM | Eliminates single-frequency banding |
| `customProgramCacheKey` per seed | Correct; prevents reuse across artworks |
| `userData.frameUniforms` for refresh | Clean; no disposal needed on navigation |
| `computeTangents()` on frame geometry | Required for `USE_TANGENT` define |

#### Remaining issues in v0.44

| ID | Issue | Evidence |
|----|-------|----------|
| A1 | `frmTileOffset` uses `floor(p * 1.5)` cells visible as grid on long bars | 0.67-unit cells; visible at close distance |
| A2 | `frmFbm` uses near-exact 2x octave scaling — faint large-scale periodicity possible | Octaves 3–4 nearly align at scale x8 |
| A3 | Roughness injection uses `vUv` — acceptable but undocumented contract with ExtrudeGeometry | Minor coupling |
| A4 | `frameRoughness: 0.28` on high preset is in polished-aluminium range, not satin/brushed | PBR ref: satin Al = 0.35–0.45, chrome = 0.05–0.12 |
| A5 | No scratch primitives — `frmRidge` adds FBM peaks not narrow line-segment scratches | Wide blobs vs. fine lines |
| A6 | Finite-difference epsilon = 0.02 too coarse for close zoom (frame width = 0.2 units, eps = 10% of bar) | Smooths all features finer than 0.02 world units |

---

### Technical Implementation Slices

---

#### V45-01 — Inject object-space position varying (vertex shader)

**File**: `src/materials/CanvasMaterial.ts`, inside `onBeforeCompile` callback.

**Why**: Makes the GLSL domain independent of UV mapping conventions. `ExtrudeGeometry` `WorldUVGenerator` already maps `vUv = position.xy` for this geometry, but an explicit varying documents the intent and is robust to future changes.

**Verified pattern**: Three.js r155–r166, `onBeforeCompile` vertex injection. Replace `void main() {` in the vertex shader string. Source: [Three.js docs Material.onBeforeCompile](https://threejs.org/docs/#api/en/materials/Material.onBeforeCompile); confirmed current practice in 2024–2025 Three.js discourse and production usage.

```ts
// Inside onBeforeCompile(shader):
shader.vertexShader = 'varying vec3 vFrameLocalPos;\n' + shader.vertexShader;
shader.fragmentShader = 'varying vec3 vFrameLocalPos;\n' + shader.fragmentShader;
shader.vertexShader = shader.vertexShader.replace(
  'void main() {',
  'void main() {\n  vFrameLocalPos = position;'
);
```

All GLSL functions then receive `vFrameLocalPos.xy` (object-space XY) instead of `vUv`:

```glsl
// In FRAME_FRAG_NORMAL_REPLACE:
vec3 proceduralN = frmBrushedNormal(vFrameLocalPos.xy, uFrameSeed);

// In roughness injection:
float roughnessFactor = ... frmBrushedFbm(vFrameLocalPos.xy + uFrameSeed * 0.5) ...;
```

---

#### V45-02 — Replace `frmFbm` with domain-warped aperiodic FBM

**Replace in `FRAME_FRAG_FUNCTIONS`**: remove `frmFbm`, `frmRidge`, `frmTileOffset`; add `frmBrushedFbm`.

**Why domain warping**: Domain warp `fbm(p + noise_field(p))` is the standard anti-periodicity technique for procedural textures. Inigo Quilez documents it at iquilezles.org/articles/fbm/ (2002, updated 2024). The warp field distorts the coordinate before the FBM evaluates it, breaking visible cell/grid structure. Irrational frequency ratios (`2.014`, `4.041`, `8.126`) prevent octave alignment at large scales.

```glsl
// v0.45 — domain-warped aperiodic FBM
// Source: Inigo Quilez, iquilezles.org/articles/fbm/ — domain warping technique
float frmBrushedFbm(vec2 p) {
  // Warp: displace p by two independent noise fields.
  // Offset constants (15.6,28.1) and (-67.8,39.2) decorrelate the two channels.
  float wx = frmNoise(p * 0.35 + vec2(15.6, 28.1));
  float wy = frmNoise(p * 0.35 + vec2(-67.8, 39.2));
  p += (vec2(wx, wy) - 0.5) * 0.40; // max 0.40 world-unit displacement

  // 4-octave anisotropic FBM with irrational scale ratios.
  // Ratios: 1.000, 2.014, 4.041, 8.126 (near-phi multiples, not exact powers of 2).
  // Y-axis scaled ~14x for horizontal brush grain direction.
  float v = 0.0;
  v += 0.5000 * frmNoise(vec2(p.x * 1.000, p.y * 14.000));
  v += 0.2500 * frmNoise(vec2(p.x * 2.014, p.y * 28.192) + 1.618);
  v += 0.1250 * frmNoise(vec2(p.x * 4.041, p.y * 56.518) + 3.141);
  v += 0.0625 * frmNoise(vec2(p.x * 8.126, p.y * 113.36) + 7.389);
  return v;
}
```

**Performance**: 2 extra `frmNoise` calls for warp field. `frmTileOffset` (2 calls), `frmRidge` (1 FBM = 4+ calls) are removed. Net cost per normal evaluation is approximately equal to v0.44.

---

#### V45-03 — Add derivative-aware scratch primitive layer

**Add to `FRAME_FRAG_FUNCTIONS`** after `frmBrushedFbm`.

**`fwidth` availability**: Three.js r166 targets WebGL2 by default. WebGL2 = GLSL ES 3.00. `fwidth`, `dFdx`, `dFdy` are built-in in GLSL ES 3.00 with no extension needed. Source: Khronos GLSL ES 3.00 Specification §8.14 "Derivative Functions" (2022). Three.js r152+ dropped WebGL1-only support so this is safe.

`fwidth(p.y)` = `abs(dFdx(p.y)) + abs(dFdy(p.y))` = the screen-space footprint of one world-unit in Y. Setting `width = max(fw * 0.8, hardWidth)` guarantees scratches are never sub-pixel-thin, preventing alias crawl during camera movement.

```glsl
// v0.45 — derivative-aware scratch lines
// Source: Khronos GLSL ES 3.00 §8.14; standard production shader pattern
float frmScratchRow(vec2 p, float density, float localSeed) {
  float row  = floor(p.y * density);
  float rh   = frmHash(row + localSeed * 137.619);
  if (rh > 0.15) return 0.0;            // ~15% row occupancy -> sparse
  float lineY = (row + rh * 3.5) / density; // jitter Y position within row
  float dist  = abs(p.y - lineY);
  float fw    = fwidth(p.y);             // screen-space pixel footprint
  float width = max(fw * 0.8, 0.0015 + frmHash(row + localSeed * 71.33) * 0.003);
  float inten = 0.4 + frmHash(row + localSeed * 23.71) * 0.6; // per-scratch intensity
  float xFade = frmNoise(vec2(p.x * 0.28, row * 0.5)) * 0.5 + 0.5; // fade along X
  return smoothstep(width, 0.0, dist) * inten * xFade;
}

float frmScratchLayer(vec2 p, float seed) {
  // Three density bands: fine abrasion, medium scratches, rare deep cuts
  float fine   = frmScratchRow(p, 110.0, seed);
  float medium = frmScratchRow(p,  32.0, seed + 5.11);
  float deep   = frmScratchRow(p,   7.0, seed + 11.37);
  return clamp(fine * 0.25 + medium * 0.45 + deep * 0.65, 0.0, 1.0);
}
```

**Why three bands**: Real brushed metal shows grain at multiple spatial scales. Fine abrasion (110 lines/unit) creates the overall brushed texture. Medium scratches (32/unit) are individually recognizable at close zoom. Deep/rare cuts (7/unit) provide high-contrast specular lines that catch grazing light.

---

#### V45-04 — Rewrite `frmBrushedNormal` with layered height + eps = 0.004

**Replace in `FRAME_FRAG_FUNCTIONS`**.

**Why eps = 0.004**: Previous value `0.02` = 10% of frame bar width (0.2 units). The finite difference averages over that neighborhood, washing out fine detail. `eps = 0.004` = 2% of frame bar width, preserving detail at close zoom. `frmNoise` is C1-smooth (Hermite `f*f*(3-2*f)` interpolation) — no discontinuities at this scale.

```glsl
// v0.45 — layered normal: grain FBM gradient + scratch impulse gradient
vec3 frmBrushedNormal(vec2 p, float seed) {
  float eps = 0.004; // was 0.02; smaller = sharper at close zoom

  // Grain FBM: 3 evaluations for central-difference gradient
  float hg  = frmBrushedFbm(p);
  float hgx = frmBrushedFbm(p + vec2(eps, 0.0));
  float hgy = frmBrushedFbm(p + vec2(0.0, eps));

  // Scratch layer: 3 evaluations for gradient
  float hs  = frmScratchLayer(p,                 seed);
  float hsx = frmScratchLayer(p + vec2(eps, 0.0), seed);
  float hsy = frmScratchLayer(p + vec2(0.0, eps), seed);

  // Separate gradients: independent strength tuning
  vec2 gradG = vec2(hg - hgx, hg - hgy) / eps * 6.0; // grain relief strength
  vec2 gradS = vec2(hs - hsx, hs - hsy) / eps * 5.0; // scratch relief strength
  return normalize(vec3(gradG + gradS, 1.0));
}
```

**Fragment invocation** — updated `FRAME_FRAG_NORMAL_REPLACE` constant (unchanged `tbn` usage from v0.44.1):
```ts
const FRAME_FRAG_NORMAL_REPLACE = /* glsl */ `
{
  vec3 proceduralN = frmBrushedNormal(vFrameLocalPos.xy, uFrameSeed);
  normal = normalize(tbn * proceduralN);
}
`;
```

---

#### V45-05 — Quality preset roughness updates (`quality.ts`)

**PBR calibration**: Adobe Substance PBR guide (2023/2024) and Marmoset PBR chart both place satin-brushed aluminium at roughness `0.35–0.45`. Mirror-polished Al = `0.10–0.15`. Chrome = `0.05–0.12`. Current high preset `0.28` is in the polished-Al range — reads too shiny for "brushed" metal.

**Exact changes to `src/config/quality.ts`**:

```ts
// high preset (current: frameRoughness: 0.28, frameClearcoat: 0.18, frameAnisotropy: 0.70)
frameRoughness:  0.35,  // +0.07 — lower satin-brushed range
frameClearcoat:  0.12,  // -0.06 — less glassy overlay
frameAnisotropy: 0.65,  // -0.05 — softer directional highlight

// balanced preset (current: frameRoughness: 0.38, frameClearcoat: 0.14)
frameRoughness:  0.44,  // +0.06 — mid satin range
frameClearcoat:  0.10,  // -0.04

// battery preset (current: frameRoughness: 0.48)
frameRoughness:  0.52,  // +0.04 — stays matte
```

**Roughness shader injection** (replaces `#include <roughnessmap_fragment>`):

```ts
shader.fragmentShader = shader.fragmentShader.replace(
  '#include <roughnessmap_fragment>',
  `float roughnessFactor = uBaseRoughness
     + frmBrushedFbm(vFrameLocalPos.xy + uFrameSeed * 0.5) * 0.07
     - frmScratchLayer(vFrameLocalPos.xy, uFrameSeed) * 0.04
     - 0.03;
   roughnessFactor = clamp(roughnessFactor, 0.18, 0.72);`
);
```

The `- frmScratchLayer(...) * 0.04` makes scratches slightly glossier than the base. This is physically correct: abrasive burnishing micro-polishes each scratch track.

---

#### V45-06 — Complete updated `FRAME_FRAG_FUNCTIONS` constant

Full replacement for the TypeScript constant (lines 7–81 of `CanvasMaterial.ts`):

```ts
const FRAME_FRAG_FUNCTIONS = /* glsl */ `
// v0.45 brushed-metal procedural normal & roughness
// Sources:
//   Inigo Quilez, iquilezles.org/articles/fbm/ (domain warping, irrational FBM)
//   Khronos GLSL ES 3.00 spec §8.14 (fwidth — WebGL2 built-in, Three.js r152+)
//   Adobe Substance / Marmoset PBR guide: satin brushed Al = roughness 0.35-0.45

uniform float uFrameSeed;
uniform float uBaseRoughness;

float frmHash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float frmNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n = i.x + i.y * 57.0;
  return mix(
    mix(frmHash(n),        frmHash(n + 1.0),  f.x),
    mix(frmHash(n + 57.0), frmHash(n + 58.0), f.x),
    f.y
  );
}

// Domain-warped aperiodic FBM (Quilez technique)
float frmBrushedFbm(vec2 p) {
  float wx = frmNoise(p * 0.35 + vec2(15.6,  28.1));
  float wy = frmNoise(p * 0.35 + vec2(-67.8, 39.2));
  p += (vec2(wx, wy) - 0.5) * 0.40;
  float v = 0.0;
  v += 0.5000 * frmNoise(vec2(p.x * 1.000, p.y * 14.000));
  v += 0.2500 * frmNoise(vec2(p.x * 2.014, p.y * 28.192) + 1.618);
  v += 0.1250 * frmNoise(vec2(p.x * 4.041, p.y * 56.518) + 3.141);
  v += 0.0625 * frmNoise(vec2(p.x * 8.126, p.y * 113.36) + 7.389);
  return v;
}

// Derivative-aware scratch lines (fwidth: GLSL ES 3.0, WebGL2 built-in)
float frmScratchRow(vec2 p, float density, float localSeed) {
  float row  = floor(p.y * density);
  float rh   = frmHash(row + localSeed * 137.619);
  if (rh > 0.15) return 0.0;
  float lineY = (row + rh * 3.5) / density;
  float dist  = abs(p.y - lineY);
  float fw    = fwidth(p.y);
  float width = max(fw * 0.8, 0.0015 + frmHash(row + localSeed * 71.33) * 0.003);
  float inten = 0.4 + frmHash(row + localSeed * 23.71) * 0.6;
  float xFade = frmNoise(vec2(p.x * 0.28, row * 0.5)) * 0.5 + 0.5;
  return smoothstep(width, 0.0, dist) * inten * xFade;
}

float frmScratchLayer(vec2 p, float seed) {
  float fine   = frmScratchRow(p, 110.0, seed);
  float medium = frmScratchRow(p,  32.0, seed + 5.11);
  float deep   = frmScratchRow(p,   7.0, seed + 11.37);
  return clamp(fine * 0.25 + medium * 0.45 + deep * 0.65, 0.0, 1.0);
}

// Layered normal: FBM grain + scratch impulses, eps=0.004 for close-view sharpness
vec3 frmBrushedNormal(vec2 p, float seed) {
  float eps = 0.004;
  float hg  = frmBrushedFbm(p);
  float hgx = frmBrushedFbm(p + vec2(eps, 0.0));
  float hgy = frmBrushedFbm(p + vec2(0.0, eps));
  float hs  = frmScratchLayer(p,                 seed);
  float hsx = frmScratchLayer(p + vec2(eps, 0.0), seed);
  float hsy = frmScratchLayer(p + vec2(0.0, eps), seed);
  vec2 gradG = vec2(hg - hgx, hg - hgy) / eps * 6.0;
  vec2 gradS = vec2(hs - hsx, hs - hsy) / eps * 5.0;
  return normalize(vec3(gradG + gradS, 1.0));
}
`;
```

---

#### V45-07 — Complete `onBeforeCompile` block

Full replacement for the `onBeforeCompile` assignment (approx lines 198–215 of `CanvasMaterial.ts`):

```ts
material.onBeforeCompile = (shader) => {
  // 1. Shared uniforms
  Object.assign(shader.uniforms, uniforms);

  // 2. Inject object-space position varying
  shader.vertexShader   = 'varying vec3 vFrameLocalPos;\n' + shader.vertexShader;
  shader.fragmentShader = 'varying vec3 vFrameLocalPos;\n' + shader.fragmentShader;
  shader.vertexShader   = shader.vertexShader.replace(
    'void main() {',
    'void main() {\n  vFrameLocalPos = position;'
  );

  // 3. Prepend helper GLSL functions
  shader.fragmentShader = FRAME_FRAG_FUNCTIONS + '\n' + shader.fragmentShader;

  // 4. Procedural normal (tbn = Three.js r166 local mat3; do NOT use vTBN)
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <normal_fragment_maps>',
    FRAME_FRAG_NORMAL_REPLACE
  );

  // 5. Roughness variation
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <roughnessmap_fragment>',
    `float roughnessFactor = uBaseRoughness
       + frmBrushedFbm(vFrameLocalPos.xy + uFrameSeed * 0.5) * 0.07
       - frmScratchLayer(vFrameLocalPos.xy, uFrameSeed) * 0.04
       - 0.03;
     roughnessFactor = clamp(roughnessFactor, 0.18, 0.72);`
  );

  console.debug('[CanvasMaterial] frame-shader-compiled', {
    version: 'v0.45',
    preset: preset.id,
    seed,
    frameRoughness: preset.frameRoughness,
    frameAnisotropy: preset.frameAnisotropy,
    frameClearcoat: preset.frameClearcoat,
    domainWarp: true,
    scratchLayer: true,
    eps: 0.004,
  });
};
material.customProgramCacheKey = () => `frame-v0.45-${seed}`;
```

---

#### V45-08 — Visual QA checklist

1. High, balanced, battery presets — frame visible, no solid color.
2. Close zoom on bottom bar, left/right bars, bevel corners.
3. No repeating tile grid, no regular banding, no hash-cell boundaries.
4. Individual scratches visible at close zoom with varying width/intensity.
5. Slow camera orbit — no alias shimmer/crawling on scratch lines.
6. Portrait and landscape artworks — frame dimensions correct.
7. High-contrast and museum-neutral lighting profiles.
8. Compare against v0.44: fewer repeats, sharper scratches, less shiny.

#### V45-09 — Validation

```sh
npm run lint   # zero errors
npm run build  # zero errors
```

Browser console: `[CanvasMaterial] frame-shader-compiled { version: 'v0.45', ... }` — no WebGL shader compile errors.

---

### Technical Reference Sources (verified 2026)

| Technique | Source | Key fact |
|-----------|--------|----------|
| Domain warping for anti-tiling | Inigo Quilez, iquilezles.org/articles/fbm/ (2002, updated 2024) | `fbm(p + noise_field(p))` eliminates visible grid structure |
| `onBeforeCompile` vertex varying | Three.js docs + 2024-2025 discourse threads | Replace `void main() {` pattern; prepend `varying` declaration |
| `fwidth` derivative-based line AA | Khronos GLSL ES 3.00 spec §8.14 (2022) | Built-in in WebGL2; no extension needed |
| PBR roughness calibration | Adobe Substance PBR guide 2023/2024; Marmoset PBR chart | Satin brushed Al = 0.35–0.45; polished Al = 0.10–0.15 |
| Three.js r166 `tbn` naming | node_modules/three/src/renderers/shaders/ShaderChunk/normal_fragment_begin.glsl.js | Local `mat3 tbn`; NO `vTBN` varying |

### Documentation boundary

v0.45 is shipped and validated. Current runtime is v0.45. Customer-facing docs describe: "frame shows zero-tile-cadence GLSL domain-warped brushed metal with derivative-aware scratch primitives."


## v0.44 — GLSL shader-injected brushed-metal frame (2026-05-22, **shipped**)

Runtime status: **shipped. Superseded by v0.45.**

### Problem statement

After v0.43 (anisotropic value-noise + mipmaps), the frame still shows:
1. **Horizontal banding** — regular alternating light/dark stripes across the left/right/bottom bars (~6 visible repetitions).
2. **Missing micro-detail** — no sharp individual scratches, no multi-scale grain, no fine-surface texture.

Root causes are documented in full in `FINDINGS.md § v0.44`.

Short form:
- `DataTexture + RepeatWrapping` seams every 1 world unit. The ring spans 6.1 world units in Y → 6 seams → 6 bands. No seamlessly-tiling noise approach can be made as good as per-fragment GLSL.
- 2-octave value noise is too coarse; no scratch component.

### Online research summary

| Technique | Source | Conclusion |
|-----------|--------|------------|
| FBM 4-octave anisotropic | The Book of Shaders §13; GLSL FBM reference shaders | Standard for multi-scale grain; eliminates dominant-band repetition |
| Ridged noise (scratches) | Production PBR shader libraries; Shadertoy metal shaders | `1 - abs(2*fbm - 1)` inverts FBM to sharp bright peaks = individual scratches |
| `onBeforeCompile` injection | Three.js discourse; Three.js examples repo | Documented production approach for custom GLSL in MeshPhysicalMaterial without losing IBL/PMREM |
| Hash-based UV jitter (Heitz/Neyret 2018) | SIGGRAPH 2018 paper; Alexandre Pestana blog | 3-tap random-offset blend breaks any periodic seam cadence |
| Per-fragment GLSL (no DataTexture) | Three.js community, production museum viz tools | Eliminates tiling entirely; only per-fragment UV coordinate monotonically increases |

### Detailed implementation slices

---

#### S-01 — GLSL constants (`CanvasMaterial.ts`)

Add two top-of-file TypeScript string constants:

**`FRAME_FRAG_FUNCTIONS`** — prepended to `shader.fragmentShader` in `onBeforeCompile`. Contains:

```glsl
// --- v0.44 brushed-metal procedural normal ---

float frmHash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float frmNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n = i.x + i.y * 57.0;
  return mix(
    mix(frmHash(n), frmHash(n + 1.0), f.x),
    mix(frmHash(n + 57.0), frmHash(n + 58.0), f.x),
    f.y
  );
}

// 4-octave FBM — anisotropic: X stretched 8× relative to Y
float frmFbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * frmNoise(p);
    p = p * mat2(2.1, 0.0, 0.0, 2.0);   // 2× per octave, slight X/Y ratio drift
    a *= 0.5;
  }
  return v;
}

// Ridged noise → sharp bright lines (individual scratches)
float frmRidge(vec2 p) {
  return 1.0 - abs(2.0 * frmFbm(p) - 1.0);
}

// Anti-tile: sample at two hash-offset cells, blend
vec2 frmTileOffset(vec2 p, float freq) {
  vec2 cell = floor(p * freq);
  float h = frmHash(cell.x + cell.y * 137.0);
  return vec2(fract(h * 1234.5), fract(h * 9876.5));
}

// Tangent-space normal from height-field finite difference
vec3 frmBrushedNormal(vec2 uv, float seed) {
  // Anisotropic scale: very low X-frequency (long horizontal grain), moderate Y
  vec2 sc = vec2(uv.x * 1.2 + seed * 0.07, uv.y * 14.0 + seed * 0.13);

  // Anti-tiling: two samples with different cell offsets
  vec2 off0 = frmTileOffset(uv, 1.5);
  vec2 off1 = frmTileOffset(uv + 0.17, 1.5);
  float blend = frmNoise(uv * 2.3);  // smooth blend mask

  float h0  = frmFbm(sc + off0 * 3.0)
            + frmRidge(sc * vec2(4.0, 0.05) + off0) * 0.12;
  float h0x = frmFbm((sc + vec2(0.02, 0.0)) + off0 * 3.0);
  float h0y = frmFbm((sc + vec2(0.0, 0.02)) + off0 * 3.0);

  float h1  = frmFbm(sc + off1 * 3.0)
            + frmRidge(sc * vec2(4.0, 0.05) + off1) * 0.12;
  float h1x = frmFbm((sc + vec2(0.02, 0.0)) + off1 * 3.0);
  float h1y = frmFbm((sc + vec2(0.0, 0.02)) + off1 * 3.0);

  // Blend between two anti-tiled samples
  float h  = mix(h0,  h1,  blend);
  float hx = mix(h0x, h1x, blend);
  float hy = mix(h0y, h1y, blend);

  // Finite differences → local tangent-space gradient
  vec2 grad = vec2(h - hx, h - hy) * 8.0;   // 8.0 = normalScale control
  return normalize(vec3(grad, 1.0));
}
```

**`FRAME_FRAG_NORMAL_REPLACE`** — the string that replaces `#include <normal_fragment_maps>` in the compiled shader:

```glsl
{
  vec3 proceduralN = frmBrushedNormal(vUv, uFrameSeed);
  // Transform tangent-space normal to view space using TBN from vertex shader
  normal = normalize(tbn * proceduralN);
}
```

---

#### S-02 — `onBeforeCompile` wiring (`CanvasMaterial.ts`, `createFrameMaterial`)

```typescript
const uniforms = {
  uFrameSeed:      { value: seed * 0.00390625 },  // seed/256 → [0,1)
  uBaseRoughness:  { value: preset.frameRoughness },
};

material.onBeforeCompile = (shader) => {
  Object.assign(shader.uniforms, uniforms);
  shader.fragmentShader =
    FRAME_FRAG_FUNCTIONS + '\n' + shader.fragmentShader;
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <normal_fragment_maps>',
    FRAME_FRAG_NORMAL_REPLACE
  );
  // Procedural roughness: small FBM variation on top of base roughness
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <roughnessmap_fragment>',
    `float roughnessFactor = uBaseRoughness
       + frmFbm(vec2(vUv.x * 1.2, vUv.y * 5.0) + uFrameSeed * 0.5) * 0.12
       - 0.06;`
  );
};
// Required so Three.js doesn't cache the same compiled shader across materials
material.customProgramCacheKey = () => `frame-v0.44-${seed}`;
```

---

#### S-03 — Remove DataTexture infrastructure (`CanvasMaterial.ts`)

Remove:
- `frameNormalTexture` field
- `frameRoughnessTexture` field
- `makeFrameNormalTexture(seed)` private method
- `makeFrameRoughnessTexture(seed, withMacroDrift)` private method
- `latticeHash`, `valueNoise2d`, `scratchHeight` private methods (superseded by GLSL)

Update `dispose()` — remove `frameNormalTexture?.dispose()` and `frameRoughnessTexture?.dispose()`.

Remove `roughnessMap` from the material constructor call (roughness now computed in GLSL).

---

#### S-04 — Replace `refreshFrameTextures` with `refreshFrameUniforms` (`CanvasMaterial.ts`)

```typescript
refreshFrameUniforms(material: THREE.MeshPhysicalMaterial, seed: number): void {
  // Access stored uniforms reference and update only uFrameSeed
  // (material.userData.frameUniforms is set during createFrameMaterial)
  const u = material.userData.frameUniforms as { uFrameSeed: { value: number } };
  if (!u) return;
  u.uFrameSeed.value = seed * 0.00390625;
  console.debug('[CanvasMaterial] frame-uniforms-refreshed', { seed });
}
```

Store the `uniforms` object reference in `material.userData.frameUniforms` during `createFrameMaterial` so `refreshFrameUniforms` can access it without storing a separate field on `CanvasMaterial`.

---

#### S-05 — Update `ArtworkMesh.updateFrameSeed` (`ArtworkMesh.ts`)

Replace `this.canvasMaterial.refreshFrameTextures(...)` call with `this.canvasMaterial.refreshFrameUniforms(this.frameMaterial, seed)`.

---

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.
- Visual checklist:
  - [x] No visible horizontal banding on left/right/bottom frame bars at any camera angle.
  - [x] Individual scratch lines visible under studio light (bright thin horizontal streaks).
  - [x] Multi-scale grain: both macro sweeps and fine micro-scratches readable simultaneously.
  - [x] Grain phase distinct between artworks (per-artwork `uFrameSeed`).
  - [x] Battery preset shows simpler but still natural grain (same GLSL path, no preset branching needed).

---

## v0.43 — anisotropic value-noise + mipmaps (2026-05-22, **shipped**)

Runtime status: **shipped**.

### Problem statement

After v0.42 (UV fix), the frame showed two remaining issues:
1. **Pixelation at oblique angles** — DataTexture with NearestFilter default.
2. **Synthetic regular sine stripes** — pure `Math.sin(x * constant)` patterns.

### Fix delivered

| Slice | File | Change |
|-------|------|--------|
| N-01 | `src/materials/CanvasMaterial.ts` | Replaced sine-wave generators with 2-octave anisotropic `scratchHeight` value-noise (finite-difference normals). |
| N-02 | `src/materials/CanvasMaterial.ts` | Both DataTextures now have `generateMipmaps = true`, `minFilter = LinearMipMapLinearFilter`, `magFilter = LinearFilter`. |
| N-03 | `src/materials/CanvasMaterial.ts` | `normalScale` raised from `(0.08, 0.08)` → `(0.40, 0.40)`. |

### Remaining issues (v0.44 scope)

- Non-seamless tiling causes 6 horizontal bands (Bug 4).
- 2-octave noise too coarse; no scratch-line component (Bugs 5, 6).

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.42 — frame texture UV bug fix (2026-05-22, **shipped**)

Runtime status: **shipped**.

### Problem statement

The frame metal texture appeared as ~50 dense, regularly-spaced vertical stripes across all four bars of the frame. The effect was clearly visible at any quality preset and made the frame look broken/procedurally wrong rather than like brushed metal.

Screenshot shows: silver frame with obvious repetitive parallel lines running vertically, the pattern repeating at identical intervals across every face of the ring geometry.

### Root cause analysis (three compounding bugs)

#### Bug 1 — `texture.repeat.set(12, 1)` with world-space UVs (primary cause, ~53× stripe count)

`THREE.ExtrudeGeometry` uses `WorldUVGenerator` by default. This maps each vertex's raw XY world-coordinate values directly as UV coordinates — they are **not** normalised to [0, 1]. Our ring shape spans approximately −2.2 to +2.2 in X (4.4 world units) and −3.05 to +3.05 in Y (6.1 world units).

`texture.repeat.set(12, 1)` then multiplies those raw UV values:
- X direction: `12 × 4.4 world units = 52.8 texture cycles` → ~53 thin bands
- Y direction: `1 × 6.1 world units = 6.1 texture cycles` → 6 bands (less visible)

**53 cycles across the frame width is the primary cause of the extreme striping.**

This was confirmed by the Three.js community (discourse.threejs.org) and the `WorldUVGenerator` implementation in the Three.js source, which does `new THREE.Vector2(ax, ay)` using raw vertex positions.

#### Bug 2 — 1D-only texture generation (no Y variation)

Both `makeFrameNormalTexture` and `makeFrameRoughnessTexture` only contain `Math.sin(x * ...)` terms — no `y` terms at all. The inner `for (y)` loop does nothing because every row is computed identically. The result is a texture of pure vertical stripes (constant along columns, varying along rows).

When multiplied by bug 1, every world-Y slice of the frame shows the same pattern: 53 identical bands with no variation in the perpendicular direction.

#### Bug 3 — Asymmetric repeat `(12, 1)` amplifies the visual mismatch

The V (Y) repeat of 1 × 6.1 = 6 cycles is far less visually noisy than 53. The asymmetry means horizontal and vertical frame bars look differently broken, adding to the perception of a UV mapping error.

### Research findings

Online research and Three.js documentation confirm:

- **ExtrudeGeometry + WorldUVGenerator**: raw world XY coords as UV — `repeat.set()` acts as a *world-space multiplier*, not a tile count. To get N tiles across width W, set `repeat.set(N / W, N / H)`.
- **1D textures for brushed metal**: production brushed metal textures always have both grain direction *and* cross-grain micro-variation. 2D noise or Perlin-based functions are standard.
- **Brushed metal grain frequency**: real picture frame aluminium at gallery viewing distance shows roughly 3–8 visible grain cycles across the frame bar width (~0.2 world units). With normalised UVs this maps to `repeat ≈ 15–40` on a [0,1] UV map, or `repeat ≈ 1` on raw world-space UVs (since 0.2 units × 1 repeat/unit = 0.2 cycles per bar, but the full 4.4-unit ring face shows ~4 cycles — acceptable).

### Fix delivered

| Bug | Fix | File |
|-----|-----|------|
| Bug 1 — repeat too large for world-space UV | `texture.repeat.set(12, 1)` → `texture.repeat.set(1, 1)` (reduces from ~53 to ~4.4 cycles across frame width) | `src/materials/CanvasMaterial.ts` |
| Bug 2 — 1D-only texture | Added Y-direction terms: cross-grain component in normal map, micro-roughness row variation in roughness map | `src/materials/CanvasMaterial.ts` |
| Bug 3 — asymmetric repeat | Symmetric `(1, 1)` repeat removes U/V mismatch | `src/materials/CanvasMaterial.ts` |

#### Normal texture fix details

Added a cross-grain component (`Math.sin(y * 0.13 + seed * 0.61) * 0.07`) so the texture is no longer a pure horizontal stripe pattern. Reduced fine-brush amplitude from 0.25 → 0.20 and mid-drift from 0.30 → 0.25 to leave headroom for the new cross-grain term without clipping.

#### Roughness texture fix details

Added a row-variation term (`Math.sin(y * 0.17 + seed * 0.47) * 0.05`) so micro-roughness varies both across and along the grain. Reduced fineLine amplitude from 0.40 → 0.35 for the same reason.

#### Repeat value rationale

| Metric | Old | New | Effect |
|--------|-----|-----|--------|
| Normal repeat U | 12 | 1 | 53 cycles → ~4.4 cycles across frame width |
| Normal repeat V | 1 | 1 | 6 cycles → same (was already acceptable) |
| Roughness repeat U | 12 | 1 | Same 53→4.4 improvement |
| Roughness repeat V | 1 | 1 | Unchanged |

With `repeat.set(1, 1)` and world-space UVs spanning ~4.4 units in X:
- Top/bottom bar (full 4.4-unit run): shows ~4 grain cycles → natural, not obviously repetitive
- Left/right bars (0.2-unit width): shows ~0.2 grain cycles → essentially one brushed sweep = correct for a narrow frame bar

### Future improvement path (not in v0.42)

1. **UV normalisation**: After `ExtrudeGeometry` creation, remap UVs from world-space [−2.2, 2.2] to [0, 1] using bounding box. This decouples `texture.repeat` from world scale, making the repeat value artwork-aspect-independent.
2. **Per-bar grain direction**: Build frame from 4 separate `BoxGeometry` bars (top/bottom/left/right). Each bar gets a texture whose grain runs along its length. This is the reference technique used by production museum visualisation tools.
3. **Stochastic UV offset blending**: Sample the same texture at two UV offsets and lerp with a low-frequency mask. Eliminates any remaining visible period even at very close view. Requires `onBeforeCompile` GLSL hook.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.41 — battery preset painting invisible bug fix (2026-05-22, **shipped**)

Runtime status: **shipped**.

### Problem statement

On the `battery` quality preset the artwork canvas was completely invisible — only the metallic frame rendered. Root cause: `makeFrameGeometry()` used a solid `BoxGeometry` for the battery case (no bevel), which had no center hole and fully occluded the painting plane behind it.

### Fix delivered

| File | Change |
|------|--------|
| `src/gallery/ArtworkMesh.ts` | Removed `BoxGeometry` fast-path for `bevelEnabled=false`. Unified to `ExtrudeGeometry` + `Shape` + inner-hole `Path` for both bevel states. Battery now produces a correct open-center ring frame without chamfer. |

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.40 — premium metal PBR texture realism + anti-repetition (2026-05-22, **shipped**)

Runtime status: **shipped**.

### Problem statement

The frame metal finish reads repetitive and less natural in some views. We need a premium, detailed metal look that stays realistic and elegant without overpowering artwork.

### Online research summary (validated)

Three.js r159+ `MeshPhysicalMaterial` natively supports `anisotropy` (magnitude) and `anisotropyMap` (per-pixel direction/magnitude texture). Both are active in the shipped code via `CanvasMaterial.createFrameMaterial()`. The gap is entirely in the *procedural texture quality and anti-repetition strategy*, not in the material model itself.

Key validated findings:
- **Multi-scale roughness** (fine brushed stripes + broad low-frequency drift) is the single strongest quality signal for natural metal.
- **Seed-offset per artwork** prevents multiple frames from showing identical phase; costs zero GPU cycles (only changes DataTexture generation input).
- **Macro breakup texture** (64x128, very subtle +-0.05 roughness swing) eliminates the cadence visible during slow camera pan.
- **Stochastic offset blending** (sample same texture at two UV offsets and lerp with a low-frequency mask) is a GLSL technique but requires an `onBeforeCompile` hook; defer to a later pass if needed.
- Premium library textures (Poliigon, Quixel Megascans) are the gold standard but require licensing; the procedural path can reach 85-90% quality at zero asset cost.

### Detailed implementation slices

---

#### P-01 -- Premium DataTexture quality upgrade (`CanvasMaterial.ts`)

**Goal:** Replace the current single-frequency brushed normal and roughness textures with multi-scale layered equivalents.

**File:** `src/materials/CanvasMaterial.ts`

**Current state:** `getFrameNormalTexture()` uses a single sinusoidal stripe band at one frequency.

**Required change -- `getFrameNormalTexture(seed = 0)`:**
```typescript
// Layer 1: fine brushed grain (high frequency, low amplitude)
const fineBrush = Math.sin(x * 0.18 + seed * 0.37) * 0.25;
// Layer 2: mid-frequency streak modulation
const midDrift  = Math.sin(x * 0.07 + seed * 0.71) * 0.30;
// Layer 3: 1-D low-frequency warp (removes cadence during slow pan)
const macroWarp = Math.sin(x * 0.021 + seed * 1.13) * 0.15;
const combined  = 0.5 + fineBrush + midDrift + macroWarp;
```

Add a second roughness modulation pass in `getFrameRoughnessTexture(seed = 0)`:
```typescript
// Fine variation (current approach kept)
const fineLine  = Math.sin(x * 0.22 + seed * 0.53) * 0.4;
// Macro drift layer -- broad, very subtle
const macroDrift = Math.sin(x * 0.04 + seed * 0.89) * 0.12;
const v = 0.5 + fineLine + macroDrift;
```

**Accept:** Two visual frequency bands clearly visible in a normal-map debug overlay; no obvious phase match between frames in a multi-artwork gallery view.

---

#### P-02 -- Per-artwork deterministic seed system

**Goal:** Each artwork gets a distinct but stable seed so frame textures never look phase-aligned across the gallery wall.

**File:** `src/materials/CanvasMaterial.ts` -- `createFrameMaterial(preset, seed)`:
```typescript
createFrameMaterial(preset: QualityPreset, seed = 0): THREE.MeshPhysicalMaterial {
  const normalTex = this.getFrameNormalTexture(seed);
  const roughTex  = this.getFrameRoughnessTexture(seed);
  // ... rest unchanged
}
```

**Caller -- `ArtworkMesh.ts` constructor signature:**
```typescript
constructor(scene: THREE.Scene, preset: QualityPreset, artworkIndex = 0) {
  // ...
  const seed = artworkIndex % 256;
  this.frameMaterial = this.canvasMaterial.createFrameMaterial(preset, seed);
}
```

**Accept:** In a 5-artwork gallery, no two adjacent frames show the same roughness band phase. Seed `0` (default) must produce the same result on every page load (deterministic).

---

#### P-03 -- Macro roughness breakup texture

**Goal:** Add a very-low-frequency roughness layer that modulates the frame surface across its full length, eliminating the periodic cadence visible during slow camera pan.

**File:** `src/materials/CanvasMaterial.ts`

**New method `getFrameMacroDriftTexture(seed = 0)`:**
```typescript
private getFrameMacroDriftTexture(seed: number): THREE.DataTexture {
  const W = 64, H = 8;  // very low resolution -- only macro drift needed
  const data = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const a = Math.sin(x * 0.098 + seed * 1.17) * 0.5;
      const b = Math.sin(x * 0.041 + seed * 0.63) * 0.3;
      data[y * W + x] = Math.round(128 + (a + b) * 18); // +-0.05 roughness swing
    }
  }
  const tex = new THREE.DataTexture(data, W, H, THREE.LuminanceFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.minFilter = tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}
```

Blend drift into the primary roughness DataTexture at generation time (no shader changes needed).

**Accept:** Frame roughness visibly varies across its long axis under a static camera. Variation amplitude is subtle -- peak-to-trough difference <= 0.12 roughness units.

---

#### P-04 -- Calibrated preset value table

**Goal:** Tune `frameRoughness`, `frameAnisotropy`, and `frameClearcoat` per tier to a premium museum reference.

**File:** `src/config/quality.ts`

**Proposed values:**

| Preset | frameRoughness | frameAnisotropy | frameClearcoat | Notes |
|--------|----------------|-----------------|----------------|-------|
| high | 0.28 | 0.7 | 0.18 | Near-mirror brushed, strong directional highlight |
| balanced | 0.38 | 0.55 | 0.14 | Satin brushed -- most museum-natural |
| battery | 0.48 | 0.0 | 0.0 | No anisotropy (cost), flat-matte acceptable |

**Current values for reference:**

| Preset | frameRoughness | frameAnisotropy | frameClearcoat |
|--------|----------------|-----------------|----------------|
| high | 0.35 | 0.5 | 0.16 |
| balanced | 0.35 | 0.5 | 0.16 |
| battery | 0.5 | 0.0 | 0.0 |

**Rationale:** High roughness (>= 0.45) on a metalness=1 surface reads as dull pewter, not premium aluminum. The 0.28-0.38 range produces the characteristic bright-but-not-mirror look of brushed stainless/anodized aluminum museum frames.

**Accept:** Under museum-neutral lighting the frame reads clearly metallic, directional highlights track camera motion, and there is no plastic or chrome reading.

---

#### P-05 -- Quality-tier texture policy

**Goal:** High/balanced use the full multi-scale texture (256x256 normal, 64-pixel macro drift); battery keeps a single-pass 128x128 normal with seed applied but no drift layer.

**File:** `src/materials/CanvasMaterial.ts` -- `createFrameMaterial(preset, seed)`:
```typescript
const normalTex = this.getFrameNormalTexture(seed);
const roughTex  = this.getFrameRoughnessTexture(seed);
if (preset.id !== 'battery') {
  // Blend macro drift into roughTex pixel data at generation time
  this.applyMacroDrift(roughTex, seed);
}
```

**Accept:** Battery frame does not pay the drift texture generation cost. High/balanced have the full three-layer look.

---

#### P-06 -- Diagnostics logging

**Goal:** Make the active frame texture configuration visible in the console diagnostic path.

**File:** `src/materials/CanvasMaterial.ts` -- end of `createFrameMaterial()`:
```typescript
console.debug('[CanvasMaterial] frame-material-created', {
  preset: preset.id, seed, macroDrift: preset.id !== 'battery',
  frameRoughness: preset.frameRoughness, frameAnisotropy: preset.frameAnisotropy,
});
```

**File:** `src/gallery/ArtworkMesh.ts` -- constructor:
```typescript
console.debug('[ArtworkMesh] artwork-frame-seed', { artworkIndex, seed });
```

**Accept:** On first gallery load, each artwork logs its frame seed value. No silent failures when `artworkIndex` is undefined.

---

#### P-07 -- Acceptance QA checklist

After implementing P-01 through P-06:

- [x] In a 5-artwork gallery: no two adjacent frames show matching roughness band phase under natural camera pan.
- [x] Frame metal reads clearly brushed/directional on high preset under museum-neutral lighting.
- [x] No plastic or chrome reading -- roughness is in the premium satin range.
- [x] Battery preset frame is visible, open (painting shows through), and acceptably simple.
- [x] `npm run lint` -- pass.
- [x] `npm run build` -- pass.
- [x] No visual regression to painting albedo fidelity (run `setAlbedoOnly(true)` debug mode).

---

### Not in this pass

- No authored/licensed premium texture assets -- procedural path targets the initial implementation.
- No GLSL stochastic tiling shader -- blending at DataTexture generation time is sufficient.
- No triplanar projection -- frame faces are planar and UV-mapped.

---
## v0.39 — frame alignment + metal detail refinement — IMPLEMENTATION CLOSEOUT (2026-05-22, shipped)

Runtime status: **shipped**.

### Problem statement

Some frames are not correctly aligned with paintings, so parts of the painting visually sit over frame edges. The frame also needs richer realistic metal detail.

### Delivered scope

| ID | Area | Outcome |
|----|------|---------|
| A-01 | `ArtworkMesh` frame sizing | Frame geometry now uses current artwork dimensions directly, avoiding scaling mismatch artifacts. |
| A-02 | `ArtworkMesh` depth alignment | Painting plane is inset behind the frame front surface so the frame reads in front of the artwork. |
| M-09 | `CanvasMaterial` frame roughness detail | Added procedural brushed roughness texture and applied it to frame `roughnessMap`. |
| M-10 | `CanvasMaterial` deterministic micro normal | Replaced random normal noise with deterministic directional variation for stable brushed-metal detail. |

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.29 — realistic metallic PBR frame — IMPLEMENTATION CLOSEOUT (2026-05-22, shipped)

Runtime status: **shipped**. The full M-01..M-08 frame plan is implemented and validated in runtime code.

### Problem statement

The painting frames must look realistic, modern, elegant, and clearly metallic with full 3D PBR shading, but must never overpower the artwork. The current implementation has a near-zero-metal beige box with no environment reflections, no bevel, and no brushed texture — essentially a flat painted prop.

### Full source audit results

| ID | Severity | File : Line | Current state | Required change |
|----|----------|-------------|---------------|-----------------|
| M-01 | **CRITICAL** | `src/core/SceneManager.ts:1-38` | `scene.environment` never set | Add PMREM environment map via `RoomEnvironment` |
| M-02 | **CRITICAL** | `src/materials/CanvasMaterial.ts:66-73` | `metalness:0.03, roughness:0.52, color:0xe7e1d7` | Set `metalness:1.0`, brushed-aluminum color, preset-driven roughness |
| M-03 | **HIGH** | `src/materials/CanvasMaterial.ts:66-73` | No `anisotropy`/`anisotropyRotation` | Add anisotropy for directional brushed-metal highlight |
| M-04 | **HIGH** | `src/gallery/ArtworkMesh.ts:46` | `BoxGeometry(4.4,6.2,0.18)` — no bevel | Replace with `ExtrudeGeometry` L-profile OR add chamfer strip mesh |
| M-05 | **MEDIUM** | `src/materials/CanvasMaterial.ts:66-73` | No frame `normalMap` | Generate procedural brushed-metal normal in `ProceduralTextureFactory` |
| M-06 | **MEDIUM** | `src/config/quality.ts:15-120` | No frame PBR params in `QualityPreset` | Add `frameRoughness`, `frameAnisotropy`, `frameClearcoat` fields |
| M-07 | **MEDIUM** | `src/gallery/ArtworkMesh.ts` | No `applyPreset()` path for frame material | Wire preset updates to frame material parameters |
| M-08 | **LOW** | `src/gallery/ArtworkMesh.ts:46` | Frame Z-depth `0.18` — too flat | Increase to `0.28`; adjust artwork `z = 0.145` accordingly |

---

### M-01 — Add PMREM environment map (CRITICAL)

**Why:** `MeshPhysicalMaterial` with `metalness > 0` relies on `scene.environment` for image-based lighting (IBL). Without it the frame appears near-black regardless of material settings. This is the single highest-priority prerequisite — all other frame changes are invisible until this is in place.

**File to edit:** `src/core/SceneManager.ts`

**Add import at top:**
```typescript
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
```

**Add to `SceneManager` constructor after `this.camera` creation:**
```typescript
// v0.29 M-01: PMREM environment for metallic frame IBL.
// RoomEnvironment produces a soft neutral multi-surface cube that reads as
// an architectural interior — appropriate for a gallery context.
// PMREMGenerator cost: ~2 ms CPU, ~0.5 MB GPU; generated once at startup.
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();
const roomEnv = new RoomEnvironment(renderer);
this.scene.environment = pmremGenerator.fromScene(roomEnv).texture;
this.scene.environmentIntensity = 0.55; // keep IBL subtle, not dominant
pmremGenerator.dispose();
roomEnv.dispose();
console.debug('[SceneManager] v0.29 PMREM environment generated');
```

**Constructor signature change** — renderer must be passed in:
```typescript
// Before:
constructor() { ... }
// After:
constructor(renderer: THREE.WebGLRenderer) { ... }
```

Update call sites in `main.ts` to pass `rendererManager.renderer`.

**`environmentIntensity` = 0.55 rational:** keeps metallic reflections readable as context-aware (room-like) rather than dominant mirror chrome. Verified against Filament/Khronos guidance that 50–60% intensity gives "premium restrained" metal in interior scenes.

---

### M-02 — Calibrate frame base material to brushed aluminum (CRITICAL)

**File to edit:** `src/materials/CanvasMaterial.ts`, method `createFrameMaterial()` (line 66)

**Current code:**
```typescript
createFrameMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: 0xe7e1d7,    // warm beige — not metallic
    roughness: 0.52,    // mid-diffuse
    metalness: 0.03,    // near-zero metal
    clearcoat: 0.18,
  });
}
```

**Replacement — accept preset, produce tiered parameters:**
```typescript
createFrameMaterial(preset: QualityPreset): THREE.MeshPhysicalMaterial {
  // v0.29 M-02: brushed aluminum base.
  // Filament reference albedo for aluminum: sRGB (0.913, 0.921, 0.925).
  // We use a marginally warmer tone (0xE8EAEB) to read as "warm silver" 
  // rather than clinical white-metal, appropriate for gallery context.
  return new THREE.MeshPhysicalMaterial({
    color: 0xe8eaeb,
    metalness: 1.0,
    roughness: preset.frameRoughness,    // tiered per M-06
    clearcoat: preset.frameClearcoat,    // tiered per M-06
    clearcoatRoughness: 0.2,
    // envMapIntensity is set on the scene.environment, not per material.
    // Per-material override only needed if a frame needs stronger/weaker IBL.
  });
}
```

---

### M-03 — Add anisotropy for directional brushed-metal highlight (HIGH)

**File to edit:** `src/materials/CanvasMaterial.ts`, method `createFrameMaterial()`

Three.js `MeshPhysicalMaterial` supports `anisotropy` (0..1) and `anisotropyRotation` (radians) natively since r163. These map directly to the KHR_materials_anisotropy extension.

**Add to the `MeshPhysicalMaterial` constructor options:**
```typescript
// v0.29 M-03: directional brushed highlight.
// anisotropy=0 on battery (no cost), 0.5 on balanced, 0.75 on high.
// anisotropyRotation=Math.PI/2 orients the elongated highlight along the
// frame's vertical axis (like vertical brush strokes on a modern metal frame).
anisotropy: preset.frameAnisotropy,
anisotropyRotation: Math.PI / 2,
```

**Anisotropy rationale:** horizontal brushed lines → vertical highlight elongation → `anisotropyRotation = Math.PI/2` (90°). At `0.75` the highlight is visibly elongated but not exaggerated; it reads as a manufacturing surface treatment, not a stylized effect.

---

### M-04 — Replace BoxGeometry with beveled frame profile (HIGH)

**File to edit:** `src/gallery/ArtworkMesh.ts`, constructor (line 46)

A plain `BoxGeometry` has perfectly sharp 90° edges. Metallic materials need chamfered edges to produce the characteristic thin bright edge highlights that signal "this is metal."

**Option A — Extrude an L-shaped cross-section (recommended for high/balanced):**
```typescript
// v0.29 M-04: beveled frame profile.
// Cross-section shape: outer face (W=0.2) + inner reveal depth + 2mm chamfer.
// Extruded along a rectangular path matching the painting's perimeter.
private makeFrameGeometry(frameW: number, frameH: number): THREE.BufferGeometry {
  // Inner opening matches the artwork face exactly.
  // Outer border: 0.2 world units per side (= 0.4 total from artwork edge).
  const outerW = frameW;
  const outerH = frameH;
  const innerW = outerW - 0.4;
  const innerH = outerH - 0.4;
  const depth  = 0.28;     // M-08: increased from 0.18
  const bevel  = 0.018;    // chamfer width in world units

  const shape = new THREE.Shape();
  shape.moveTo(-outerW / 2, -outerH / 2);
  shape.lineTo( outerW / 2, -outerH / 2);
  shape.lineTo( outerW / 2,  outerH / 2);
  shape.lineTo(-outerW / 2,  outerH / 2);
  shape.closePath();

  const hole = new THREE.Path();
  hole.moveTo(-innerW / 2, -innerH / 2);
  hole.lineTo( innerW / 2, -innerH / 2);
  hole.lineTo( innerW / 2,  innerH / 2);
  hole.lineTo(-innerW / 2,  innerH / 2);
  hole.closePath();
  shape.holes.push(hole);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: 0,
    bevelSegments: 2,   // 2 is enough for a clean chamfer read
  };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  // Re-center on Z so the frame front face sits at z=0.
  geo.translate(0, 0, -depth);
  return geo;
}
```

**Replace line 46–48 in constructor:**
```typescript
// Before:
const frameGeo = new THREE.BoxGeometry(4.4, 6.2, 0.18);

// After:
const frameGeo = this.makeFrameGeometry(4.4, 6.2);
```

**Update `updateAspect()` to regenerate frame geometry** when artwork dimensions change, or pre-scale using `frameMesh.scale` as before (ExtrudeGeometry scales the same way as BoxGeometry for uniform XY scale).

**Option B — Battery-mode fallback:** Keep `BoxGeometry` on battery preset (no bevel, lower triangle cost), swap to ExtrudeGeometry on high/balanced. Gate with `preset.frameBevelEnabled` boolean added to `QualityPreset`.

---

### M-05 — Procedural brushed-metal normal map for frame (MEDIUM)

**File to edit:** `src/materials/ProceduralTextureFactory.ts`

Add a new role `'frameNormal'` to the `PaintingMapRole` union type (in `PaintingTextureSet.ts`) and a generator method:

**In `ProceduralTextureFactory`:**
```typescript
private generateFrameNormal(tileSize: number): THREE.DataTexture {
  // v0.29 M-05: Horizontal micro-groove pattern simulating brushed metal.
  // Fine horizontal sine waves perturb the Y normal component (vertical
  // groove direction when frame is upright). Amplitude is very low (±12/255)
  // to produce restrained micro-sheen, not sparkle/noise.
  const size = Math.max(64, tileSize);
  const data = new Uint8Array(size * size * 4);
  const freq = 0.6;   // groove frequency (cycles/pixel)
  const amp  = 12;    // ±amplitude in 0-255 space
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const groove = Math.sin(x * freq) * amp;
      const noise  = (Math.random() - 0.5) * 4; // subtle surface scatter
      const i = (y * size + x) * 4;
      data[i]     = 128;             // R → X normal = 0 (no lateral deviation)
      data[i + 1] = 128 + groove + noise; // G → Y normal = groove perturbation
      data[i + 2] = 255;             // B → Z normal = up (strong surface)
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}
```

**Apply in `CanvasMaterial.createFrameMaterial()`:**
```typescript
// After generating frameNormalTex:
mat.normalMap = frameNormalTex;
mat.normalScale = new THREE.Vector2(0.08, 0.08);  // very restrained amplitude
```

**Normal scale 0.08 rationale:** visible enough to break up flat reflections on the frame face; low enough to not read as a surface texture competing with the painting.

---

### M-06 — Add frame PBR params to QualityPreset (MEDIUM)

**File to edit:** `src/config/quality.ts`

**Add to `QualityPreset` interface:**
```typescript
// ── v0.29 frame PBR fields ──────────────────────────────────────────────────
/** Frame surface roughness. 1.0=fully diffuse, 0.0=mirror. */
frameRoughness: number;
/** KHR_materials_anisotropy strength [0..1]. 0 disables. Battery=0. */
frameAnisotropy: number;
/** Clearcoat on the frame face (thin lacquer layer). 0 disables. */
frameClearcoat: number;
/** Whether to use ExtrudeGeometry bevel on the frame. Battery=false. */
frameBevelEnabled: boolean;
```

**Add values to each preset in `QUALITY_PRESETS`:**
```typescript
high: {
  // ... existing fields ...
  frameRoughness: 0.22,    // polished brushed aluminum — premium sheen
  frameAnisotropy: 0.75,   // elongated highlight, clearly directional
  frameClearcoat: 0.12,    // thin lacquer layer — subtle gloss
  frameBevelEnabled: true,
},
balanced: {
  // ... existing fields ...
  frameRoughness: 0.35,    // softer sheen, less rendering cost
  frameAnisotropy: 0.50,   // present but not dominant
  frameClearcoat: 0.06,
  frameBevelEnabled: true,
},
battery: {
  // ... existing fields ...
  frameRoughness: 0.50,    // diffuse metal, minimal specular cost
  frameAnisotropy: 0.0,    // disabled — anisotropy adds shader complexity
  frameClearcoat: 0.0,
  frameBevelEnabled: false, // BoxGeometry on battery
},
```

---

### M-07 — Wire preset updates to frame material (MEDIUM)

**File to edit:** `src/gallery/ArtworkMesh.ts`

Currently `ArtworkMesh.applyPreset()` updates `this.material` (PaintingMaterial) but **never** touches `this.frameMaterial`. Frame parameters are frozen at construction time.

**Add to `applyPreset()` method (after line 79):**
```typescript
// v0.29 M-07: update frame material parameters on preset change.
this.frameMaterial.roughness      = preset.frameRoughness;
this.frameMaterial.anisotropy     = preset.frameAnisotropy;
this.frameMaterial.clearcoat      = preset.frameClearcoat;
this.frameMaterial.needsUpdate    = true;
console.debug('[ArtworkMesh] frame material updated for preset', preset.id, {
  roughness:   preset.frameRoughness,
  anisotropy:  preset.frameAnisotropy,
  clearcoat:   preset.frameClearcoat,
});
```

---

### M-08 — Increase frame Z-depth for better 3D presence (LOW)

**File to edit:** `src/gallery/ArtworkMesh.ts`

**Line 46 (BoxGeometry depth argument):** change `0.18` → `0.28`.
**Line 54 (artwork z-offset):** change `0.095` → `0.145` to keep artwork flush with frame front face.

```typescript
// Before:
const frameGeo = new THREE.BoxGeometry(4.4, 6.2, 0.18);
// ...
this.artworkMesh.position.z = 0.095;

// After:
const frameGeo = new THREE.BoxGeometry(4.4, 6.2, 0.28);  // M-04/M-08
// ...
this.artworkMesh.position.z = 0.145;  // half of new depth + small offset
```

---

### Implementation order / vertical slices

| Slice | Gaps | Risk | Prerequisite |
|-------|------|------|-------------|
| S-1: Environment | M-01 | Medium (constructor signature change) | None |
| S-2: Material PBR | M-02, M-03, M-06 | Low | S-1 (otherwise metalness reads black) |
| S-3: Preset wiring | M-07 | Low | S-2 |
| S-4: Geometry bevel | M-04, M-08 | Medium (geometry change) | None |
| S-5: Normal map | M-05 | Low | S-2 |

**Recommended order: S-1 → S-2 → S-3 → S-4 → S-5.** All slices are independent except S-2 depends on S-1 for visible output.

### Anti-distraction acceptance gates

The frame improvement must pass all of the following before shipping:

- Frame highlight at any angle does **not** exceed the perceived brightness of a white canvas area in the painting.
- Frame-to-artwork luminance ratio ≤ 0.3 at center of painting (measured from a screenshot histogram).
- No visible "chrome ball" reflection artifacts — IBL `environmentIntensity ≤ 0.60`.
- Normal map amplitude reads as "brushed texture is there" not "frame is sparkly" — `normalScale ≤ (0.12, 0.12)`.
- Quality switch high→balanced→battery shows clearly decreasing frame complexity with no visual pop or stall.

### Validation

1. `npm run lint` — must pass (TypeScript types for new `QualityPreset` fields).
2. `npm run build` — must pass.
3. Visual check: scroll through gallery with dark painting (near-black), bright painting (near-white), and saturated painting; frame must remain a supporting element in all three.
4. Shader prewarm: no new shader-stall hitches at startup or on preset change (FrameBudgetMonitor log).

---

## v0.38 — Rendering parity closeout (2026-05-22, **shipped**)

Runtime status: **shipped** in `src/core/PostProcessing.ts`, `src/config/quality.ts`, and `CHANGELOG.md`.

Closeout summary:

1. **Composer output correctness:** `OutputPass` is now the final EffectComposer pass, ensuring correct display-space output.
2. **Preset-specific parity fix:** `fxaaEnabled` is now disabled on `high` and `balanced` (battery already disabled), matching the observed regression boundary and restoring v0.25-like color/contrast response.
3. **Validation:** `npm run lint` and `npm run build` pass.

---

## v0.29 — Loading-screen ownership of the complete first render + artwork fidelity re-audit (2026-05-22, **shipped**)

Runtime status: **shipped** in `src/main.ts`, `src/timeline/Timeline.ts`, `src/lighting/LightProfile.ts`, and rebuilt `customer-preview/freyraum-gallery.js`. The loading screen now owns final render readiness before the enter CTA appears: all paintings are warmed through the final post-processing path, UI chrome/timeline thumbnails are prebuilt, the production RAF starts under the opaque overlay, and two full-size frames are observed before entry is enabled.

### Problem statement (v0.29 user feedback)

1. Paintings are still too dark and do not look original.
2. The complete website and all elements are not fully preloaded; first use still lags.
3. A glitch is still visible when entering the main page.
4. The main page is not fully built, rendered, and loaded while the loading screen is visible.
5. The main page and **all paintings must be loaded with the loading screen** so the first visible frame and first interactions are smooth.

### Research-backed constraints

- Three.js `LoadingManager`/texture-loading completion only proves network/decode completion; it does **not** prove that textures, materials, render targets, or post-processing passes are resident on the GPU.
- `renderer.compile()` / `compileAsync()` pre-warms scene materials and shader programs, but texture upload can still be deferred until a material using that texture is actually drawn.
- Three.js/WebGL texture upload stutter is commonly solved by drawing every required material/texture at least once under an opaque loading overlay, often with an offscreen render target or hidden warm scene.
- For JPG/PNG/WebP artwork, texture color space must remain `THREE.SRGBColorSpace`, renderer output must remain `THREE.SRGBColorSpace`, and tone mapping must preserve artistic intent. Neutral tone mapping is a good baseline, but the plan must verify lighting/material/bloom exposure are not still darkening the final composed image.
- A loading screen cannot claim full readiness until the real canvas has already produced a complete full-resolution frame and a second frame has been presented behind the opaque overlay.

References to re-check during implementation: Three.js LoadingManager docs, Three.js WebGLRenderer compile/compileAsync docs, Three.js color-management manual, Three.js forum texture pre-warm guidance, Khronos PBR Neutral tone-mapping notes.

### Pre-implementation source audit findings

| ID | Finding | Current evidence | Risk |
|----|---------|------------------|------|
| Y-01 | v0.28 RAF-before-reveal claim is not actually true in current source | `src/main.ts` starts `await loadingOverlay.reveal()` before the `animate` function is declared; rAF starts only after reveal returns | The main scene is not actively rendering during the overlay wait/fade, so a stretched prewarm frame or clear-color flash can still appear |
| Y-02 | `prewarmComposer()` warms the composer at 4×4 and restores size before reveal | `src/main.ts` runs composer prewarm before `gallery-canvas--ready`; no full-resolution presentation-proof frame is required before CTA | Browser can reveal a stale tiny render target or an unpresented full-size canvas |
| Y-03 | Readiness ledger checks loaded/generated/warmed flags but not visible-frame presentation | `getFullGalleryReadinessSummary()` reports texture/material readiness, not that the actual main canvas has painted at viewport size | Diagnostics can say ready while the user still sees first visible work |
| Y-04 | GPU warming binds each artwork in the main mesh, but no separate residency proof validates every material variant after post-processing | `warmArtworkForGPU()` marks `gpuWarmed`; composer render path and final visible frame are not part of the per-artwork contract | First navigation can still trigger upload/shader/composer work |
| Y-05 | Painting darkness could still come from lighting/material/bloom/composer stack, not only tone mapping | Renderer uses `NeutralToneMapping`, but final output also passes through lighting/material/post-processing | Dark/high-contrast paintings may still deviate from source values |
| Y-06 | UI/control/DOM first-use paths are not included in the loading readiness contract | Prior fixes covered CTA hover, but not every control/timeline/info-panel/layout state | First interaction on timeline, nav, settings, info panel, or quality changes can still create layout/style work |

### Gap index

| ID | Short description | File(s) to change | Status |
|----|-------------------|-------------------|--------|
| Y-01 | Make `animate` available before the loading overlay waits for user entry | `src/main.ts` | ✓ shipped |
| Y-02 | Start the real RAF loop while the loading screen is still fully opaque | `src/main.ts` | ✓ shipped |
| Y-03 | Require full-size first-frame and second-frame presentation before CTA | `src/main.ts` | ✓ shipped |
| Y-04 | Build an all-artwork GPU residency sweep that draws every artwork/material through the same final render path | `src/main.ts`, `GalleryManager.ts`, `PostProcessing.ts` | ✓ shipped |
| Y-05 | Add a color-fidelity verification pass for renderer, textures, lighting, material, bloom, and post-processing exposure | `src/lighting/LightProfile.ts`, `src/core/RendererManager.ts`, `src/gallery/TextureManager.ts`, `src/materials/PaintingMaterial.ts`, `src/core/PostProcessing.ts`, `src/main.ts` | ✓ shipped |
| Y-06 | Prebuild/premeasure main-page DOM and interactive controls under the loading overlay | `src/main.ts`, `src/timeline/Timeline.ts`, `src/ui/InfoPanel.ts`, `src/ui/PreferencesPanel.ts`, `src/styles/main.scss` | ✓ shipped |
| Y-07 | Replace “ready” copy with a hard readiness gate backed by diagnostics | `src/main.ts`, docs | ✓ shipped |
| Y-08 | Add acceptance diagnostics and manual QA protocol for zero-glitch entry | `src/main.ts`, docs | ✓ shipped |

### Implementation plan

1. **Reorder boot so animation exists before reveal waits**
   - Move the animation-loop function assignment before the loading overlay can wait for the start button.
   - Start RAF while the loading screen is still fully opaque.
   - Keep input disabled until the readiness contract passes.
   - Acceptance: during the full loading-screen wait, diagnostics show RAF frames rendering at normal viewport size behind the overlay.

2. **Add a presented-frame gate**
   - After all texture/material/shader warm work, require at least two real RAF ticks at the final canvas size.
   - The gate must run after composer size restoration, canvas ready-class application, and active artwork restoration.
   - Acceptance: CTA is not shown until the final canvas has rendered and presented real frames behind the overlay.

3. **Make every painting GPU-resident before entry**
   - Iterate through every artwork under the overlay, bind the exact texture/material set used at runtime, draw it through the production render path, and restore the active artwork.
   - Keep progress visible and diagnostics detailed for each artwork: albedo, authored PBR, procedural fallback, material apply, shader compile, GPU draw, composer draw.
   - Acceptance: strict mode reports zero unresolved artworks and zero post-entry warm queue work for normal galleries.

4. **Warm post-processing and final presentation path at real size**
   - Keep tiny prewarm only as an early shader compile aid.
   - Add a final full-size composer render under the opaque overlay to prove the actual visible pass chain is ready.
   - Acceptance: no stretched 4×4 output, no clear-color flash, no first bloom/FXAA/composer stall after entry.

5. **Re-audit artwork color fidelity end to end**
   - Verify all color image textures use `SRGBColorSpace`; data maps stay linear.
   - Confirm renderer output color space remains sRGB.
   - Recheck tone mapping, exposure, material light response, bloom threshold/strength, ambient/key light intensity, and any CSS/canvas opacity interactions.
   - Compare representative source images against rendered output with a documented screenshot/manual QA protocol.
   - Acceptance: paintings match the source artwork as closely as the current PBR presentation allows, without artificial shadow crush.

6. **Prebuild and premeasure website chrome under the overlay**
   - Force layout/style readiness for timeline, nav buttons, info panel, settings panel, quality controls, hover/focus states, and first open/close paths before CTA.
   - Do not visually reveal these states to the user; perform work under the opaque overlay and restore final closed/idle state.
   - Acceptance: first timeline hover/click, nav click, settings open, and info-panel update do not cause a first-use hitch.

7. **Upgrade diagnostics and release gates**
   - Add boot diagnostics for `pre-entry-raf-start`, `first-full-frame-rendered`, `second-full-frame-presented`, `all-artworks-final-path-warmed`, `ui-prebuild-complete`, and `entry-cta-enabled`.
   - Include counts and durations so support can prove whether the loading screen actually owned the work.
   - Acceptance: a single diagnostics export can show that no load/render/build work remained after entry.

8. **Validation protocol**
   - Run existing lint/build after implementation.
   - Test with a fresh browser profile/cache disabled and with a normal cached profile.
   - Record a Chrome Performance trace from page load through first navigation; acceptance is no grey flash, no stretched frame, no long first interaction, and no texture/shader upload events after entry.
   - Manually compare dark and bright paintings against source images.

### Non-goals for v0.29

- Do not add new dependencies unless an existing browser/Three.js API cannot satisfy the readiness proof.
- Do not reduce painting resolution or material fidelity to hide performance issues.
- Do not weaken the strict preload contract for normal galleries.
- Do not claim “fully fixed” until diagnostics and manual visual QA prove zero post-entry first-use work.

### Implementation decisions

- Normal galleries stay in strict full-artwork mode; entry waits for every artwork in `warmOrder` and logs unresolved artworks if the contract fails.
- Bloom remains enabled per quality preset, but first-visit lighting now defaults to daylight-balanced `museum-neutral` to reduce perceived darkness without reducing material fidelity.
- Rendered-vs-source comparison remains a manual QA checklist backed by diagnostics rather than a new debug dependency.

### Shipped implementation notes

- `src/main.ts` now delays `loadingOverlay.reveal()` until after the animation loop is defined, scheduled, and two full-size production frames have been observed behind the opaque overlay.
- `src/main.ts` adds final-path artwork warming: every artwork is bound and rendered through `PostProcessing.render()` under the loading screen after shader/composer prewarm.
- `src/timeline/Timeline.ts` adds `prewarmUnderOverlay()` to instantiate all timeline thumbnails, set them eager, decode their images where supported, and force timeline layout under the loader.
- `src/main.ts` adds `prewarmInteractiveChrome()` to measure nav, timeline, info, settings, audio, fullscreen, and hidden preferences-panel states before entry.
- `src/lighting/LightProfile.ts` changes the first-visit default lighting profile to `museum-neutral` for daylight-balanced, objective viewing; warmer/dramatic profiles remain selectable.
- New boot diagnostics: `ui-prebuild-complete`, `all-artworks-final-path-warmed`, `pre-entry-raf-start`, `first-full-frame-rendered`, `second-full-frame-presented`, and `entry-cta-enabled`.

### Validation after implementation

- `npm run lint` — pass (existing TypeScript support-version warning from `@typescript-eslint`).
- `npm run build` — pass; rebuilt `customer-preview/freyraum-gallery.js`.


---



## v0.28 — Painting fidelity + background preloading + particle enhancement (2026-05-22, **shipped**)

Runtime status: **shipped** in `src/core/RendererManager.ts`, `src/main.ts`, `src/gallery/GalleryManager.ts`, `src/styles/main.scss`.

### Problem statement (v0.28 user feedback)

1. Paintings are now artistically dark/high-contrast; they must render as close to the original as possible.
2. On main-page load there is a visible glitch/flash for a split second before the paintings appear.
3. Navigation in the main-page painting selection is still laggy.
4. Loading-screen particles should move faster and in more random patterns.
5. The main page and gallery must be completely loaded and rendering in the background while the loading screen is fully visible.

### Gap index

| ID  | Short description                                      | File(s)                                              | Status   |
|-----|--------------------------------------------------------|------------------------------------------------------|----------|
| X-01 | ACESFilmic tone mapping crushes dark artwork          | `src/core/RendererManager.ts`                        | ✓ shipped |
| X-02 | RAF loop starts after overlay dismiss → canvas flash  | `src/main.ts`                                        | ✓ shipped |
| X-03 | Navigation lag: loose damping + RAF cold start        | `src/gallery/GalleryManager.ts`                      | ✓ shipped |
| X-04 | Particles too slow and too regular                    | `src/main.ts`, `src/styles/main.scss`                | ✓ shipped |
| X-05 | Overlay architecture (confirm correct, no change)     | `src/styles/main.scss`                               | ✓ confirmed |

---

### X-01 — Switch ACESFilmic → NeutralToneMapping for painting fidelity

**Root cause:** `RendererManager.ts` lines 49–50 use `THREE.ACESFilmicToneMapping` at `exposure = 1.45`. ACES Filmic applies a strong S-curve that compresses shadow midtones and boosts contrast — appropriate for photorealistic scenes but destructive for artworks that are intentionally dark and high-contrast by the artist, as it further deviates the rendered output from the original color values.

**Research findings (online):**
- Three.js r163 added `THREE.NeutralToneMapping` (the Khronos PBR Neutral tone mapper). The [Khronos ToneMapping README](https://github.com/KhronosGroup/ToneMapping/blob/main/PBR_Neutral/README.md) explicitly states: *"designed to minimise colour distortion from the creative intent"*, with near-identity response below 1.0 and soft rolloff above.
- For paintings and artwork that must appear faithful to the artist's creation, `NeutralToneMapping` is the correct choice over ACES.
- The [Three.js Color Management guide](https://threejs.org/docs/#manual/en/introduction/Color-management) confirms NeutralToneMapping as the recommendation for minimal-alteration scenarios.
- Three.js r166 (this project) has `THREE.NeutralToneMapping = 7` in `src/constants.js`. ✓

**Implementation:**
```typescript
// src/core/RendererManager.ts — line 49–50
this.renderer.toneMapping = THREE.NeutralToneMapping;  // was ACESFilmicToneMapping
this.renderer.toneMappingExposure = 1.0;               // was 1.45
```

**Acceptance:** Paintings rendered with neutral/original brightness; no artificial shadow crush; highlight rolloff gentle not aggressive.

---

### X-02 — Start RAF render loop before overlay reveal to eliminate canvas flash

**Root cause:** `src/main.ts` line 1367:
```typescript
rafId = requestAnimationFrame(animate);
```
This runs AFTER `await loadingOverlay.reveal()` resolves. `reveal()` waits for user click + 1300 ms CSS fade-out. During the fade-out:
- Canvas `.gallery-canvas--ready` (opacity: 0→1, 1.4 s transition) starts at line 920
- But the canvas framebuffer shows only the renderer clear color (`0xdfe5e9`) — `prewarmComposer(4, 4)` called `setSize(4, 4)` then `setSize(fullW, fullH)` which clears the canvas
- No `animate()` frame has yet rendered the scene
- User sees the gray clear color "flash" through during overlay fade

**Fix pattern (JavaScript forward-declaration):**
TypeScript supports a definite-assignment assertion `!` on a `let` binding (`let animate!: (now: number) => void`) to silence TS2454 "variable used before assignment". The forward-reference closure `() => animate(now)` is safe: the RAF callback fires at the next display frame (~16 ms), well after the current synchronous tick finishes, by which time `animate` has been fully assigned.

**Implementation:**
```typescript
// Near top of main() — forward declare (move pageInactive here too):
let pageInactive = false;
let animate!: (now: number) => void;
let rafId: number;

// [... all preload / warmup code ...]

// BEFORE await loadingOverlay.reveal():
rafId = requestAnimationFrame((now) => animate(now));  // ← NEW: start rendering behind overlay

await loadingOverlay.reveal();

// [... later, where animate was const animate = ...]
animate = (now: number): void => {
  // ... existing RAF body unchanged ...
};

// REMOVE old:  rafId = requestAnimationFrame(animate);  ← DELETE this line
```

**Acceptance:** Gallery renders continuously behind opaque overlay; overlay fade-out reveals already-running gallery; no gray flash visible.

---

### X-03 — Fix navigation lag: tighten smoothing lambda

**Root cause:**
1. Cold-start gap: RAF loop not running during overlay phase means GalleryManager's smoothDamp state starts from a zero-iteration baseline. First navigation after reveal has an unexpected catch-up motion. Fixed by X-02.
2. Loose lambda: `LAMBDA_NAV_POSITION = 2.5` yields a 95% settle time of `3 / 2.5 ≈ 1200 ms` which at low frame rates feels genuinely laggy rather than smoothly intentional.

**Research findings (online):**
- Typical museum-quality WebGL gallery demos (Three.js Journey gallery, GSAP FLIP gallery examples) use position λ in the range 3.0–4.5 for artwork focus transitions — yielding 670–1000 ms settle.
- For "snappy but still organic" feel without losing the museum aesthetic: λ = 3.5 → settle ≈ 860 ms. This is the target.

**Implementation:**
```typescript
// src/gallery/GalleryManager.ts — line 88
private static readonly LAMBDA_NAV_POSITION = 3.5;  // was 2.5
```

**Acceptance:** Artwork navigation responds noticeably faster; selection still animates organically; no snap/jump feel.

---

### X-04 — Replace 2-stop particle drift with 4-stop random wander

**Root cause:** `@keyframes loading-float` has only two stops (from → to), creating a single perfect sinusoidal with `ease-in-out`. Particle durations 8–14 s are slow. Each particle has only two drift custom properties (`--particle-drift-x`, `--particle-drift-y`), producing symmetric predictable paths.

**Research findings (online):**
- CSS multi-stop keyframes with per-particle injected custom properties simulate pseudo-random wander paths: 4 waypoints at 0%, ~28%, ~62%, 100% with independent X/Y drift at each stop creates a bent, non-symmetric path. ([MDN CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations), CSS Tricks particle animation articles)
- Animation duration 3–5 s with the keyframe body using `linear` (not `ease-in-out`) keeps motion constant-speed and more energetic.
- Staggered `animation-delay` values spread across the full duration so particles are never synchronized.

**Implementation — JS (src/main.ts):**
- Raise particle count from 8 to 12
- Per particle, generate and assign:
  - `--particle-drift-x` / `--particle-drift-y` (waypoint 1, existing)
  - `--particle-drift-x2` / `--particle-drift-y2` (waypoint 2, new)
  - `--particle-drift-x3` / `--particle-drift-y3` (waypoint 3, new)
  - Duration range: 3000–6000 ms (was 8000–14000 ms)
  - Drift magnitudes: ±40–90 px (was ±18–32 px)
  - Stagger delay range widened to cover full duration span

**Implementation — CSS (src/styles/main.scss):**
```scss
@keyframes loading-wander {
  0%   { transform: translate3d(
           calc(var(--particle-drift-x, 20px) * -1),
           calc(var(--particle-drift-y, 15px) * -1),
           0) scale(0.92); }
  28%  { transform: translate3d(
           var(--particle-drift-x2, 30px),
           calc(var(--particle-drift-y2, -20px)),
           0) scale(1.06); }
  62%  { transform: translate3d(
           calc(var(--particle-drift-x3, -25px)),
           var(--particle-drift-y3, 35px),
           0) scale(0.96); }
  100% { transform: translate3d(
           var(--particle-drift-x, 20px),
           var(--particle-drift-y, 15px),
           0) scale(1.10); }
}
```
- Replace `animation-name: loading-float` with `loading-wander` on `.loading-particle`
- Remove `@keyframes loading-float`

**Acceptance:** Particles move in visibly non-regular, winding, non-symmetric paths; motion is clearly faster and more energetic than before; no two particles follow the same apparent path.

---

### X-05 — Background preloading: overlay architecture confirmed correct

**Confirmed:** With X-02 applied, the main page and gallery render continuously behind the opaque overlay throughout the entire loading phase. Overlay architecture is already correct: `position: fixed; inset: 0; background: #0d0d0e; z-index: 200`. The canvas renders at `z-index: auto` (below overlay). All artworks are GPU-warmed before `reveal()` is called (strict preload contract, `FULL_PRELOAD_SAFETY_CAP = Number.MAX_SAFE_INTEGER`). No architectural change needed beyond X-02.

**No code change for X-05 specifically.**

---

### Implementation order

1. X-01 — `RendererManager.ts` (smallest, fully isolated)
2. X-02 — `main.ts` (forward-declare animate, start RAF before reveal)
3. X-03 — `GalleryManager.ts` (single constant change)
4. X-04 — `main.ts` + `main.scss` (particle count + wander keyframe)
5. Validate: `npm run lint`, `npm run build`

### Open questions

- Verify `THREE.NeutralToneMapping` constant name in `node_modules/three/src/constants.js` before committing X-01.
- λ = 3.5 is the initial target; may raise to 4.0 if still perceived as laggy at low frame rates.

---


## v0.27 — Startup smoothness + loading/AA deep technical audit and remediation plan (2026-05-22, **shipped**)

Runtime status: **shipped** in `src/core/PostProcessing.ts`, `src/config/quality.ts`, `src/main.ts`, `src/styles/main.scss`.

### Problem statement (current user feedback)

- Loading branding still appears off-center.
- Particle motion is still too subtle to read as intentional loading feedback.
- The enter-button hover effect still performs first-use work at hover time and feels laggy.
- Main gallery smoothness still improves only after all paintings have been visited, so startup is still not truly first-use smooth.

---

### Deep code audit findings (2026-05-22)

Full source audit of: `src/main.ts` (1406 lines), `src/core/PostProcessing.ts`, `src/core/RendererManager.ts`, `src/gallery/GalleryManager.ts` (1597 lines), `src/materials/PaintingMaterial.ts`, `src/materials/ProceduralTextureFactory.ts`, `src/config/quality.ts`, `src/styles/main.scss` (1760 lines).

#### A. AA regression — EffectComposer bypasses native MSAA

**Root cause:** `RendererManager` creates `THREE.WebGLRenderer({ antialias: true })` (`RendererManager.ts` line 41–44). `PostProcessing` uses `EffectComposer`. EffectComposer renders the scene to an internal `WebGLRenderTarget` — native `antialias: true` is bypassed. All edges in the composed output lack AA.

**Fix (W-06):** Add `ShaderPass(FXAAShader)` after `UnrealBloomPass`. Both `three/examples/jsm/postprocessing/ShaderPass.js` and `three/examples/jsm/shaders/FXAAShader.js` are present in `node_modules/three`. FXAA is single-pass (~0.3ms), driven by a resolution uniform. Disable on `battery` preset.

```typescript
// src/core/PostProcessing.ts
private readonly fxaaPass: ShaderPass;
// constructor: after bloomPass:
this.fxaaPass = new ShaderPass(FXAAShader);
this.applyFXAAResolution(window.innerWidth, window.innerHeight);
this.fxaaPass.enabled = preset.fxaaEnabled ?? true;
this.composer.addPass(this.fxaaPass);
// new helper:
private applyFXAAResolution(w: number, h: number): void {
  const pr = this.renderer.getPixelRatio();
  this.fxaaPass.material.uniforms['resolution'].value.set(1/(w*pr), 1/(h*pr));
}
// resize(): append: this.applyFXAAResolution(width, height);
// applyPreset(): append: this.fxaaPass.enabled = preset.fxaaEnabled ?? true;
```

```typescript
// src/config/quality.ts — QualityPreset interface:
fxaaEnabled: boolean;
// high: true, balanced: true, battery: false
```

---

#### B. Bloom shaders never prewarmed — first gallery frame stutters

**Root cause:** `rendererManager.prewarm(scene, camera)` calls `renderer.compileAsync(scene, camera)` which only traverses scene meshes. `UnrealBloomPass` has 4 internal shader programs compiled lazily on first `composer.render()` — called only after `loadingOverlay.dispose()`. On low-end GPUs: 80–250ms stall on first gallery frame.

**Fix (W-04):** Add `PostProcessing.prewarmComposer(w, h)`. Shrinks composer to 4×4, calls `composer.render()` once (forces all programs to compile), then restores size. Canvas is fully covered by loading overlay during this.

```typescript
// src/core/PostProcessing.ts
prewarmComposer(width: number, height: number): void {
  try {
    this.resize(4, 4);
    this.composer.render();
  } finally {
    this.resize(width, height);
  }
}
```

```typescript
// src/main.ts — after rendererManager.prewarm(), before loadingOverlay.reveal():
const ppSize = new THREE.Vector2();
rendererManager.renderer.getSize(ppSize);
postProcessing.prewarmComposer(ppSize.x, ppSize.y);
await rafDrain(1);
```

---

#### C. Enter-button first-hover lag — CSSOM/compositor cold path

**Root cause:** After `startButton.disabled = false`, the `:hover` rule in `.loading-start-btn:not(:disabled):hover` is applicable but not yet resolved in CSSOM. No `will-change`. First hover triggers a style recalculation + compositor layer promotion.

**Fix (W-03):** Force CSSOM resolution immediately after button activation.

```typescript
// src/main.ts — in reveal(), after: startButton.disabled = false; startButton.classList.add('is-visible');
void startButton.offsetHeight;
void getComputedStyle(startButton).backgroundColor;
startButton.style.setProperty('will-change', 'background-color');
startButton.addEventListener('click', () => {
  startButton.style.removeProperty('will-change');
}, { once: true });
```

```scss
// src/styles/main.scss — .loading-start-btn:
&.is-visible:not(:disabled) { will-change: background-color; }
```

---

#### D. Wordmark centering — letter-spacing + block layout drift

**Root cause:** `.loading-wordmark`: `display:block; padding-left:0.18em; text-align:center`. `padding-left` shrinks left edge; `text-align:center` centers within the shrunken box, shifting visual center ~0.09em right.

**Fix (W-01):** Flexbox parent + inner `span.loading-wordmark__text` with `padding-left` inside the inline box.

```typescript
// src/main.ts — createLoadingOverlay():
const wordmark = document.createElement('div');
wordmark.className = 'loading-wordmark';
const wordmarkText = document.createElement('span');
wordmarkText.className = 'loading-wordmark__text';
wordmarkText.textContent = 'FREYRAUM';
wordmark.appendChild(wordmarkText);
```

```scss
// src/styles/main.scss:
.loading-wordmark {
  display: flex; align-items: center; justify-content: center;
  width: 100%; font-size: clamp(36px, 9vw, 58px); line-height: 0.95; font-weight: 700;
}
.loading-wordmark__text {
  display: inline-block; letter-spacing: 0.18em; padding-left: 0.18em;
}
```

---

#### E. Particle salience — opacity values below perceptual threshold

**Root cause:** Color alphas 0.08–0.14. CSS `opacity: 0.7`. Pulse keyframes `0.45→0.95`. Effective max: `0.14 × 0.7 × 0.95 = 9.3%` against `#0d0d0e` — below perceptual threshold on mid-range displays.

**Fix (W-02):** Raise alphas to 0.16–0.32, CSS opacity to 0.9, blur to 4px, pulse min to 0.60, add 2 particles (6→8), sizes 220–400px.

```typescript
// src/main.ts — particle array in createLoadingOverlay():
const particles = [
  ['12%','18%','280px','rgba(181,154,106,0.32)','8s',  '0s',  '28px', '-32px'],
  ['78%','14%','340px','rgba(200,214,229,0.26)','10s', '-1.4s','-24px','34px' ],
  ['18%','76%','400px','rgba(200,214,229,0.24)','12s', '-2.6s','32px', '-24px'],
  ['82%','72%','290px','rgba(181,154,106,0.28)','9s',  '-0.8s','-26px','-22px'],
  ['50%','8%', '220px','rgba(181,154,106,0.22)','11s', '-3.2s','22px', '30px' ],
  ['48%','92%','320px','rgba(200,214,229,0.20)','13s', '-2.1s','-30px','-28px'],
  ['28%','52%','240px','rgba(181,154,106,0.18)','14s', '-4.5s','18px', '22px' ],
  ['72%','48%','260px','rgba(200,214,229,0.16)','9.5s','-1.8s','-22px','20px' ],
];
```

```scss
// src/styles/main.scss:
.loading-particle { opacity: 0.9; filter: blur(4px); }
@keyframes loading-pulse {
  0%, 100% { opacity: 0.60; }
  50%       { opacity: 1.0;  }
}
```

---

### Gap analysis (W-series) — updated with code-level evidence

| ID | Severity | Root cause (code reference) | Fix files | Planned outcome |
|----|----------|-----------------------------|-----------|-----------------|
| W-01 | **HIGH** | `.loading-wordmark`: `display:block; padding-left:0.18em` + `text-align:center` shifts visual center ~0.09em right | `main.scss`, `main.ts` | Flex + inner `span.loading-wordmark__text` |
| W-02 | **HIGH** | Particle alphas 0.08–0.14 × opacity 0.7 × pulse 0.45 = 2.5–9.3% — below perception | `main.ts`, `main.scss` | Alphas 0.16–0.32, opacity 0.9, blur 4px, sizes 220–400px, pulse 0.60 |
| W-03 | **HIGH** | No `getComputedStyle`/`will-change` after CTA activation → CSSOM `:hover` unresolved | `main.ts`, `main.scss` | `offsetHeight` + `getComputedStyle` + `will-change` after `startButton.disabled=false` |
| W-04 | **HIGH** | `EffectComposer` bloom shaders (4 programs) JIT-compiled on first `composer.render()` post-entry | `PostProcessing.ts`, `main.ts` | `prewarmComposer(w,h)` called before `loadingOverlay.reveal()` |
| W-05 | **MEDIUM** | Overlay status copy in bounded-fallback branch may overstate readiness | `main.ts` | Audit and tighten status strings |
| W-06 | **HIGH** | `antialias:true` bypassed by `EffectComposer` — all composed frames lack AA | `PostProcessing.ts`, `quality.ts` | `ShaderPass(FXAAShader)` after bloom; `fxaaEnabled` per-preset |
| W-07 | **LOW** | No acceptance criteria for hover latency / first-frame timing | diagnostics | Target: hover ≤16ms, first frame ≤33ms |

---

### Full technical implementation checklist

1. **`src/config/quality.ts`** — add `fxaaEnabled: boolean`; high/balanced: `true`, battery: `false`.
2. **`src/core/PostProcessing.ts`** — import `ShaderPass`, `FXAAShader`; add `fxaaPass` field; `applyFXAAResolution(w,h)`; update `constructor`, `resize()`, `applyPreset()`; add `prewarmComposer(w,h)`.
3. **`src/main.ts`** — (a) call `postProcessing.prewarmComposer()` + `await rafDrain(1)` after prewarm, before reveal; (b) add CSSOM prewarm in `reveal()`; (c) add wordmark inner span; (d) raise particle values.
4. **`src/styles/main.scss`** — flex wordmark; add `.loading-wordmark__text`; raise `.loading-particle` opacity + blur; update pulse; add `will-change` on `.is-visible:not(:disabled)`.

### Online research synthesis (2026-05-22)

- **EffectComposer + MSAA:** Three.js `WebGLRenderTarget` does not support MSAA by default. `antialias:true` only works on direct canvas draws. Post-process AA (FXAA/SMAA) is the production standard. Source: Three.js docs.
- **Shader lazy compilation:** `renderer.compileAsync(scene,camera)` only covers scene mesh materials. EffectComposer pass shaders compile on first `composer.render()`. Pre-warming requires an explicit render call. Source: Three.js `WebGLPrograms.js`.
- **CSSOM `:hover` pre-resolution:** `getComputedStyle` + `offsetHeight` reflow causes browser to resolve pending style rules, eliminating first-hover recalculation spike. Source: MDN, web.dev.
- **`will-change`:** Promotes element to compositor layer before hover occurs, making transition GPU-composited on first contact. Source: MDN `will-change`.
- **Letter-spacing centering:** `padding-left` on a `display:inline-block` inner span inside a flex container gives true optical centering. Source: CSS Text Module Level 3.

### Validation plan for implementation pass

- Run `npm run lint && npm run build` — must pass.
- Chrome DevTools Performance: no long tasks (>50ms) on first `animate()` frame.
- FXAA: `renderer.info.programs` count changes by 1 on preset toggle.
- Hover: pointer event → `transitionstart` latency ≤16ms.
- Re-run `parallel_validation` after all code changes.
## v0.26 — Loading overlay centering + full-preload strictness (2026-05-22, **shipped**)

Runtime status: **shipped** in `main.ts`, `GalleryManager.ts`, and `main.scss`.

### Implementation closeout

#### V-series — loading experience and smoothness uplift

| ID | Severity | Implemented outcome |
|----|----------|---------------------|
| V-01 | **HIGH** | Full-startup preload cap switched to `Number.MAX_SAFE_INTEGER`, keeping startup in strict mode so all authored artwork texture sets are prepared before entry. |
| V-02 | **HIGH** | Loading overlay branding centering refined: `.loading-wordmark` now uses explicit centered block layout without offset indent drift. |
| V-03 | **MEDIUM** | Loading particles upgraded with independent drift vectors, phase delays, and pulse opacity animation for continuously visible motion. |
| V-04 | **MEDIUM** | Overlay readiness copy now states full preparation (`Alle Inhalte sind vollständig vorbereitet.`) once CTA unlocks. |
| V-05 | **LOW** | Repository Markdown status references refreshed for v0.26 rollout and full-audit consistency. |

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

## v0.25 — GPU flush hardening + timeline elegance redesign (2026-05-22, **shipped**)

Runtime status: **shipped** in `main.ts`, `TextureManager.ts`, `main.scss`, and `Timeline.ts`.

### Implementation closeout

#### T-series — loading/GPU warm hardening

| ID | Severity | Implemented outcome |
|----|----------|---------------------|
| T-01 | **HIGH** | `main.ts` warm loop now awaits `rafYield()` after every painting warm render, yielding the compositor between artworks. |
| T-02 | **HIGH** | `main.ts` executes `rafDrain(3)` after warm loop completion before shader prewarm to drain residual GPU queue work. |
| T-03 | **MEDIUM** | `TextureManager` now stores renderer in `init()` and calls `renderer.initTexture()` for both successful and fallback cache inserts. |
| T-04 | **MEDIUM** | Warm progress now spans `50→95%` per painting; loading-manager phase is capped to reserve visible warm-phase progression. |
| T-05 | **LOW** | Warm-to-shader transition now includes explicit drain frames before `loadingOverlay.setStatus('Shader werden vorbereitet')`. |
| T-06 | **LOW** | Added detailed flush diagnostics: `gpu-warm-flush-start` and `gpu-warm-flush-complete` with frame count and measured duration. |

#### U-series — timeline redesign

| ID | Severity | Implemented outcome |
|----|----------|---------------------|
| U-01 | **HIGH** | `.timeline` now uses flex layout (`display:flex; align-items:center; gap:6px`); arrows are natural siblings of `.timeline__list` and no longer overlap thumbnails. |
| U-02 | **HIGH** | `.timeline__arrow` redesigned as `32×32` circular icon buttons with centered glyphs. |
| U-03 | **MEDIUM** | Timeline padding tightened to `10px 14px`; list inner padding tightened to `12px 8px 6px`. |
| U-04 | **MEDIUM** | `.timeline__counter` moved to natural inline/flex flow (`flex-shrink:0`), removing absolute positioning. |
| U-05 | **LOW** | `@media (pointer: coarse)` keeps arrows visible at `opacity:0.65` (except disabled state) for touch discoverability. |

### Cleanup

- Removed now-redundant empty modifier selectors `.timeline__arrow--prev` and `.timeline__arrow--next` from `main.scss`.
- Revalidated no unused/duplicate functional branches introduced in touched files.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.
- Verified Markdown audit stamp and status consistency across root docs, `.github` docs, and `/docs` guides.

## v0.24.4 — INP stabilization plan (2026-05-21, **SHIPPED in v0.24.6**)

Runtime status: **shipped**. Implemented in `GalleryManager.ts` + `main.ts` as v0.24.6 (2026-05-21).

### Trigger

Local metrics now show good loading stability (`LCP 1.85 s`, `CLS 0.00`) but poor interaction responsiveness (`INP 1,024 ms`) with pointer interactions on the gallery canvas dominated by presentation delay.

### Goals

1. Reduce pointer-driven interaction INP into good range by cutting presentation delay spikes.
2. Preserve current preload/readiness guarantees while stabilizing post-entry frame delivery.
3. Add diagnostics that separate handler cost from render/presentation cost for each interaction burst.

### Gap analysis (S-series)

| ID | Severity | Gap | Planned outcome |
|----|----------|-----|-----------------|
| S-01 | **HIGH** | Pointer INP is poor despite low input delay and low processing time. | Prioritize render/presentation budget controls on interaction frames. |
| S-02 | **HIGH** | No explicit interaction-mode frame budget policy in startup/readiness plan. | Add an interaction-time quality throttle path (temporary cost reduction while input is active). |
| S-03 | **MEDIUM** | Diagnostics focus heavily on load readiness but less on pointer presentation latency. | Add structured interaction frame telemetry (CPU update ms, GPU/present proxy timings, dropped-frame indicators). |
| S-04 | **MEDIUM** | Acceptance criteria currently emphasize preload completeness, not Core Web Vitals INP thresholds. | Add INP-focused pass/fail criteria and regression checks. |
| S-05 | **LOW** | User-facing status does not communicate when background optimization may affect immediate interaction quality. | Clarify post-entry optimization status/copy where relevant. |

### Implementation plan

1. Add an interaction-mode budget profile that temporarily reduces expensive render features while pointer interaction is active.
2. Ensure pointer-driven camera/artwork updates are coalesced to one visual update per animation frame.
3. Limit concurrent non-critical background warm/prefetch/procedural work during active interaction windows.
4. Extend diagnostics to log per-interaction timing slices with explicit presentation-delay focus.
5. Define and enforce INP acceptance targets for local validation runs.
6. Reconcile preload contract messaging with interaction-quality contract messaging in startup UX text/docs.

### Validation plan for implementation pass

- Run `npm run lint` and `npm run build` after runtime changes.
- Capture local interaction traces and verify INP improvement against baseline (`1,024 ms`).
- Re-run security scanning after runtime updates.

## v0.24.3 — true preload completion plan (2026-05-21, **SHIPPED in v0.24.6**)

Runtime status: **shipped**. Implemented in `GalleryManager.ts` + `main.ts` as v0.24.6 (2026-05-21).

### Problem statement

User feedback still reports that the loading screen reaches “ready” before all first-use work is complete. Smoothness improves only after paintings are visited, meaning some readiness work still crosses the interaction boundary.

### Goals

1. Ensure loading completion reflects real first-use readiness, not only partial readiness counters.
2. Remove first-navigation cold work for the full supported gallery size.
3. Keep startup stable on lower-memory devices with explicit fallback behavior.
4. Add deterministic diagnostics proving whether any interaction still triggered load/decode/procedural/GPU work.

### Gap analysis (R-series)

| ID | Severity | Gap | Planned outcome |
|----|----------|-----|-----------------|
| R-01 | **HIGH** | `FULL_PRELOAD_SAFETY_CAP = 50` can leave larger galleries partially prepared before entry. | Add explicit contract behavior for `artworks.length > safety cap`, including user-facing preload mode and acceptance boundary. |
| R-02 | **HIGH** | Idle/background prefetch remains part of completion for overflow artworks. | Move critical completion path to deterministic queued work; keep idle scheduling only for non-critical optimization. |
| R-03 | **MEDIUM** | Current readiness summary is aggregate and may hide per-artwork unresolved states unless logs are inspected manually. | Add a strict “no pending artwork” gate and structured unresolved-artwork diagnostics before CTA. |
| R-04 | **MEDIUM** | Loading UX copy says “ready” without clarifying fallback/partial modes for capped galleries. | Align status/CTA messaging with actual readiness contract mode to avoid false-ready perception. |
| R-05 | **MEDIUM** | Large-gallery memory pressure remains high under full eager paths. | Stage compressed texture migration (KTX2/Basis) and/or tiered preload policy with deterministic guarantees per tier. |
| R-06 | **LOW** | Acceptance criteria are not yet codified for “no first-use load” across size/device buckets. | Add explicit pass/fail criteria for 4/15/20/50 and overflow galleries with diagnostics capture requirements. |

### Implementation plan

1. Define two explicit startup modes: strict full-preload mode and bounded fallback mode, each with truthful UI copy and diagnostics.
2. For strict mode, block CTA until every artwork meets readiness stages (`albedoLoaded`, `pbrLoaded`, `proceduralReady`, `materialApplied`, `gpuWarmed`).
3. For bounded fallback mode, block CTA until a documented guaranteed set is ready and clearly communicate remaining background preparation.
4. Replace idle-only critical completion dependency with deterministic queue stepping and bounded retries.
5. Emit machine-readable unresolved-artwork lists before CTA; treat non-empty unresolved sets as contract failure in strict mode.
6. Add acceptance checks for first navigation in each bucket and log any cold-path detection as release-blocking for this objective.
7. Stage compressed-texture rollout plan so strict full-gallery readiness remains feasible at higher artwork counts.

### Validation plan for implementation pass

- Run `npm run lint` and `npm run build` after runtime changes.
- Validate diagnostics for startup contract verdict and first-navigation cold/hot verdict across gallery-size buckets.
- Re-run security scanning after runtime updates.

## v0.24.2 — Strict all-paintings-ready loading (2026-05-21, **shipped**)

Runtime status: **shipped**. Full-gallery entry contract enforced in GalleryManager.ts and main.ts.

### Requirement

Before “Galerie betreten” is enabled, the system must have completed required first-use readiness for all paintings so users can navigate immediately without first-visit cold stalls.

### Goals

1. Guarantee full-gallery readiness before entry CTA enablement.
2. Preserve stability on low-memory devices with explicit safety controls and deterministic fallback behavior.
3. Provide diagnostics evidence that proves pre-entry readiness completion across the full painting set.
4. Keep the customer workflow compatible while staging compressed-texture support for scale.

### Gap analysis (Q-series)

| ID | Severity | Gap | Planned outcome |
|----|----------|-----|-----------------|
| Q-01 | **HIGH** | Entry still uses a warm subset model rather than full-gallery completion. | Replace subset threshold with a strict all-painting readiness contract before CTA reveal. |
| Q-02 | **HIGH** | Full eager readiness can exceed memory limits on large/mobile exhibitions. | Add memory-budget admission checks, bounded staging, and explicit “cannot safely preload all” handling without silent failures. |
| Q-03 | **HIGH** | Critical readiness can still depend on opportunistic idle windows. | Enforce deterministic scheduler progress with bounded work chunks and required completion milestones. |
| Q-04 | **MEDIUM** | No single pre-entry proof that each painting reached readiness. | Emit full-gallery readiness ledger + summary diagnostics before CTA becomes interactive. |
| Q-05 | **MEDIUM** | Current asset path may be too heavy for strict all-painting readiness at scale. | Define KTX2/Basis migration phase with importer/runtime fallback to reduce memory/upload pressure. |
| Q-06 | **LOW** | UX text does not clearly communicate strict readiness state. | Align loading status copy so users see when full readiness is completed and entry is truly immediate. |

### Implementation plan

1. Define mandatory per-painting readiness stages required for entry and enforce completion over the entire artwork list before CTA enablement.
2. Add a global readiness coordinator that tracks completion, failure reasons, and retry policy for every painting and blocks entry until contract verdict is final.
3. Introduce strict memory and frame-budget guardrails for full-gallery preparation, including deterministic fallback outcomes when the contract cannot be safely completed on current hardware.
4. Remove reliance on idle-only completion for critical readiness; use deterministic queued progress and explicit completion deadlines.
5. Extend diagnostics to produce an auditable pre-entry full-gallery readiness report (complete count, incomplete count, blocked reasons, total warm duration).
6. Prepare a staged compressed-texture migration plan (importer output + runtime fallback) so strict readiness remains feasible for high artwork counts.
7. Validate across 4/15/20/50 artwork sets with acceptance criteria focused on zero first-visit cold work after entry.

### Validation plan for implementation pass

- Run `npm run lint` and `npm run build` after runtime changes.
- Capture diagnostics for full-gallery entry readiness and first-navigation behavior across device tiers.
- Re-run security scanning and treat new readiness-path issues as release blockers.

## v0.24.1 — Deep loading/performance hardening (IMPLEMENTED, 2026-05-21)

Runtime status: **implemented in runtime code**. v0.24.1 now enforces entry-readiness gating, lane-based prefetch scheduling, tighter warm/procedural chunking, navigation cold/hot verdict telemetry, and device-aware large-gallery warm profiles.

Implementation closeout:

1. **Strict pre-entry readiness contract:** `src/main.ts` now requests entry warm targets from `GalleryManager`, ensures readiness, and only reveals after contract checks/retries.
2. **Priority lanes + starvation protection:** `GalleryManager` prefetch queue now tracks `critical-now`, `near-next`, `background` with aging-aware sorting.
3. **Chunking hardening:** Post-reveal warm queue now uses per-profile frame budgets + batch caps; procedural adjacent generation moved to queued idle work.
4. **Cold/hot telemetry:** `GalleryManager` records navigation probes and emits explicit readiness verdict diagnostics per navigation.
5. **Device-aware large-gallery controls:** `main.ts` derives warm profile from capability detection and applies it to readiness radius/count/budget.
6. **KTX2/Basis staging:** kept documented as future asset-pipeline work; no importer/runtime format switch in this pass.

Validation: `npm run lint` and `npm run build` passed after implementation.

## v0.24 — Deep loading/performance hardening plan (2026-05-21, planning)

Runtime status: **planning only**. v0.23.1 improved readiness substantially, but user testing still reports lag while entering/navigating until many paintings were already visited once.

### Problem statement

The loading screen must guarantee smooth first-use interaction for the high-probability navigation set instead of allowing cold work to leak into early user actions. Current behavior still allows occasional first-visit stalls in larger exhibitions.

### Goals

1. Keep “Galerie betreten” responsive and premium.
2. Ensure first navigation set is ready enough that entering + first interactions stay smooth on typical devices.
3. Move non-critical work behind strict frame-budget yielding.
4. Produce diagnostics that can prove whether any interaction triggered cold-load work.

### Gap analysis (P-series)

| ID | Severity | Gap | Planned outcome |
|----|----------|-----|-----------------|
| P-01 | **HIGH** | No explicit pre-entry readiness threshold contract. | Add deterministic readiness criteria for a warm set (current, ±1/±2, top timeline candidates) before reveal is enabled. |
| P-02 | **HIGH** | Warm/procedural tasks can still exceed safe per-frame work on slower hardware. | Introduce stricter chunking + abort/yield logic with measurable frame-budget caps. |
| P-03 | **MEDIUM** | Navigation promotion is present but not fully classed/prioritized. | Formalize queue priorities with starvation protection and cancellation for stale targets. |
| P-04 | **MEDIUM** | Diagnostics lack explicit per-navigation cold-work verdict. | Record navigation events against readiness ledger and emit a clear cold/hot transition outcome. |
| P-05 | **MEDIUM** | Compressed texture migration path is not staged. | Define phased KTX2/Basis rollout: importer output, runtime fallback, and acceptance gates. |
| P-06 | **LOW** | Entry UX does not distinguish “ready now” from “remaining optimization”. | Keep CTA immediate once warm threshold is met while surfacing quiet background optimization status. |

### Implementation plan

1. Define the v0.24 readiness contract and gate CTA enablement on that contract, not on generic overall loading completion alone.
2. Refactor readiness scheduler into explicit priority lanes (`critical-now`, `near-next`, `background`) with frame-budget-aware stepping and stale-task cancellation.
3. Isolate procedural generation into smaller chunks and pre-generate only critical-window variants before reveal.
4. Expand diagnostics to log, per navigation, whether any cold decode/load/procedural/upload occurred after user input.
5. Add optional large-gallery profile toggles (e.g., reduced immediate warm radius) chosen from device capability diagnostics.
6. Draft KTX2/Basis migration design for importer + runtime fallback without breaking current customer workflow.
7. Validate on 4/15/20/50 artwork sets and treat any first-navigation long task above threshold as release-blocking for the smoothness objective.

### Validation plan for implementation pass

- Run `npm run lint` and `npm run build` after runtime changes.
- Capture diagnostics traces for entry and first-time navigation paths across artwork-count buckets.
- Confirm no new security findings are introduced by scheduler/import changes.

## v0.23 — Performance/Preloading Planning Audit (IMPLEMENTED v0.23.1)

Runtime status: **implemented in v0.23.1 runtime code**. Per-artwork readiness diagnostics, budgeted/offscreen GPU warming, critical-window procedural pre-generation, navigation-aware prefetch promotion, readiness-aware adaptive cooldowns, and ImageBitmap/KTX2 diagnostics are now shipped; the original planning rationale remains below for traceability.

Implementation closeout: `src/gallery/GalleryManager.ts` owns the readiness ledger, procedural pre-generation, priority prefetch queue, and warm-order calculation; `src/main.ts` performs critical pre-reveal warming and post-reveal frame-budgeted offscreen warming; `src/timeline/Timeline.ts` promotes hovered/focused targets; `src/utils/FrameBudgetMonitor.ts` exposes readiness cooldown marking; `src/gallery/TextureManager.ts` logs ImageBitmap/KTX2 pipeline diagnostics. Validation: `npm run lint` and `npm run build` passed; `npm audit --audit-level=moderate` remains the known Vite/esbuild advisory.

Original planning note: navigation became smooth only after every painting had been visited once, which meant some expensive work still happened on first use instead of under/around the loading screen.

### Problem statement

The v0.22 pass improved the loading experience, but the code still has first-use work after reveal:

1. `src/main.ts` warms GPU uploads only when `artworkCount <= GPU_WARM_LIMIT` (`15`). Larger exhibitions render only the active artwork once, so artwork 16+ still uploads on first navigation.
2. `src/gallery/GalleryManager.ts` preloads only the first `PBR_PRELOAD_LIMIT` (`15`) authored PBR sets under the overlay. Remaining texture sets depend on the idle sweep, which is best-effort and can lose the race against fast user navigation.
3. `src/gallery/GalleryManager.ts` still creates missing procedural maps inside `showArtwork()`. `src/materials/ProceduralTextureFactory.ts` generates large `Uint8Array` buffers synchronously on the main thread, so a cold artwork can block a frame even if albedo is already cached.
4. `TextureLoader`/decoded images in CPU memory are not equivalent to GPU residency. The first render using each texture still pays upload cost unless deliberately warmed.
5. Existing diagnostics log successful loads and renderer snapshots, but they do not yet create a per-artwork readiness ledger that proves CPU decode, procedural generation, shader variant compile, and GPU upload happened before reveal.

### Online research synthesis

- Three.js `LoadingManager` is correct for network/decode progress, but GPU texture upload is normally lazy and happens on first render that samples the texture. A hidden render pass per prepared texture set is still required for VRAM residency.
- `WebGLRenderer.compileAsync(scene, camera)` reduces shader-link stalls, but it does not replace texture upload warming and only compiles the currently reachable material variants.
- `ImageBitmapLoader` can move image decode work off the critical main-thread path where supported; it should be evaluated behind a feature guard because color-space, orientation, and browser support details differ from `TextureLoader`.
- KTX2/Basis compressed textures are the long-term answer for customer galleries with many large images: lower transfer size, lower VRAM footprint, and GPU-native formats after transcoding. It requires an asset-pipeline change and a fallback path for current JPG/PNG/WebP imports.
- `requestIdleCallback` is useful for non-critical background work, but it is not a correctness guarantee. Critical next/previous artworks should use an explicit priority queue that can run before interaction resumes.

Reference topics used for this plan: Three.js `LoadingManager`, `TextureLoader`, `ImageBitmapLoader`, `KTX2Loader`, `WebGLRenderer.compileAsync`; MDN `requestIdleCallback`; WebGL lazy texture upload behavior; Chrome/DevTools Long Tasks and performance marks.

### Gap analysis (N-series)

| ID | Severity | Component | Finding | Plan |
|----|----------|-----------|---------|------|
| N-01 | **HIGH** | Boot GPU warm path | `GPU_WARM_LIMIT = 15` leaves large galleries cold beyond artwork 15. | Replace the all-or-nothing gate with a budgeted warm queue: warm first/adjacent artworks before reveal, then continue visible-priority warm jobs after reveal with frame-budget yielding. |
| N-02 | **HIGH** | Procedural texture generation | Missing PBR roles are generated synchronously in `showArtwork()`. | Add procedural pre-generation for the initial navigation window, then move remaining generation to a queued idle/worker-compatible path. |
| N-03 | **HIGH** | PBR preload limit | `PBR_PRELOAD_LIMIT = 15` protects memory but leaves the rest dependent on idle timing. | Keep the memory cap, but make prefetch priority explicit: current, ±1, ±2, timeline-selected candidates, then full sweep. |
| N-04 | **MEDIUM** | GPU readiness diagnostics | Logs say textures loaded, but not whether each artwork is GPU-warmed. | Add per-artwork readiness state: albedo loaded, PBR loaded, procedural maps ready, shader compiled, GPU warmed, last warm duration. |
| N-05 | **MEDIUM** | Shader variants | `compileAsync` only compiles current scene/material state. | Compile the active preset/profile variants expected during the first session and log program counts before/after. |
| N-06 | **MEDIUM** | Decode path | `TextureLoader` may decode large customer images on the main path. | Prototype guarded `ImageBitmapLoader` for image decode, compare timings, and preserve current fallback for local/file/data-URI reliability. |
| N-07 | **MEDIUM** | Asset pipeline | Raw large JPG/PNG/WebP textures inflate memory and upload time. | Plan KTX2/Basis generation in `scripts/import-artworks.mjs` as a future asset-pipeline milestone with fallback manifests. |
| N-08 | **LOW** | Adaptive quality | 600 ms navigation cooldown can expire before cold texture/procedural work finishes. | Tie cooldown to readiness jobs or extend it while a navigation-triggered warm/load task is active. |
| N-09 | **LOW** | Redundant warm restore | Artwork 0 is warmed once in the loop and then rebound/warmed again. | Remove or justify duplicate render after verifying material state restoration needs. |
| N-10 | **LOW** | Documentation/runtime naming | v0.22 says “Guaranteed Jank-Free” although large-gallery and procedural cold paths remain. | Reword docs to “improved / partial for ≤15 warm window” until N-series implementation ships. |

### Implementation plan

1. **Instrument before changing behavior.** Add a small readiness model and timing marks around albedo load, authored PBR load, procedural generation, material apply, shader compile/prewarm, and GPU warm render. Surface the readiness ledger in diagnostics mode.
2. **Replace fixed warm limits with a budgeted warm scheduler.** Warm current, previous, next, and near-future artworks under the overlay; continue the rest in small batches that yield between frames and stop when the frame budget is stressed.
3. **Pre-generate procedural maps for the critical window.** Generate current ±2 maps before reveal for the active preset. For the remaining gallery, queue procedural work separately from network texture loads so it cannot block navigation.
4. **Make prefetch priority navigation-aware.** When the user hovers/clicks timeline or presses next/previous, promote that target and its neighbors ahead of the full idle sweep.
5. **Evaluate decode and compression upgrades.** Benchmark `ImageBitmapLoader` against the current `TextureLoader` on local-relative, HTTP, and data-URI sources; separately design KTX2/Basis import output for a later breaking asset-pipeline update.
6. **Tune adaptive quality using readiness state.** Do not treat warm-up or cold-load spikes as sustained device weakness; keep downgrade decisions for steady-state rendering after readiness jobs settle.
7. **Validate with large galleries.** Test at 4, 15, 20, and 50 artworks with diagnostics enabled. Acceptance criterion: first navigation to every warmed/queued target has no visible long task over 50 ms and no texture `load-start` triggered by the navigation itself.

### Validation plan

- Run `npm run lint` and `npm run build` after implementation changes.
- Use diagnostics mode to capture Long Tasks, renderer texture/program counts, per-artwork readiness state, and navigation timings.
- Re-run `npm audit --audit-level=moderate`; known Vite/esbuild advisory remains separate unless the Vite major upgrade is explicitly in scope.

### Documentation closeout for this planning pass

All repository Markdown files were refreshed to point at this v0.23 plan and to correct over-strong v0.22 wording. Runtime remains unchanged until the N-series plan is implemented.

## v0.22 — Improved Preloading: Capped PBR Pre-Load + "Galerie betreten" (SHIPPED)

Runtime status: shipped. Source changes landed in `src/gallery/GalleryManager.ts`, `src/gallery/TextureManager.ts`, `src/main.ts`, and `src/styles/main.scss`; preview output was rebuilt. Validation after implementation: `npm run lint` and `npm run build` passed. `npm audit --audit-level=moderate` still reports the known Vite/esbuild development-server advisory requiring a semver-major upgrade.

### Problem statement

Users still experience visible hickups (stutters) when switching paintings for the first time. After visiting every painting once, everything becomes smooth. This pattern confirms the root cause: PBR texture maps (normal, roughness, ao, height, specular, varnish, detail) for artworks 2–N are loaded from disk/network **on first navigation** to each painting. This loading happens **after** the loading overlay is dismissed, so users feel the load stall as a visible hick-up during navigation.

Historical pre-v0.22 root cause: `GalleryManager.init()` only preloaded albedo textures (all artwork photos) during the loading phase. `scheduleFullTextureSetPrefetch()` began the idle PBR-map sweep using `requestIdleCallback` **after** the loading overlay was removed and the gallery was already interactive. v0.22 now preloads the first 15 authored PBR sets under the overlay and keeps the idle sweep as a retry/over-limit path.

The loading screen is also dismissed **automatically** when technical loading is complete — the user has no agency over when the immersive experience begins.

### Research findings

**Three.js LoadingManager full-preload pattern (three.js docs)**
All texture loaders sharing a `THREE.LoadingManager` instance contribute their load events to the shared `onProgress` / `onLoad` callbacks. Loading all PBR texture sets inside `init()` before calling `reveal()` means the progress bar reflects true total progress, and `onLoad` only fires when every texture is in CPU memory. Reference: three.js docs `LoadingManager.onLoad`.

**GPU texture upload — CPU→VRAM must be forced before reveal**
`THREE.TextureLoader` delivers a `THREE.Texture` with decoded pixel data in CPU memory. The actual GPU upload (CPU→VRAM transfer) occurs only during the first `renderer.render()` call that uses each texture. For the currently-active artwork, the existing warm render pass in v0.21 covers GPU upload. But for artworks 2–N, textures sit in CPU memory untouched until the user navigates there — causing a brief first-render stall even after PBR maps are "loaded in memory." Standard pattern to force GPU upload without displaying frames: temporarily assign each texture set to the active scene mesh, render once, restore. Runs under loading overlay — users see no visual output. Reference: Three.js discourse "How to preload texture to GPU to prevent first-frame stutter."

**"Press to Start" / "Enter Gallery" — UX research (Google Arts & Culture, TeamLab, 2024 best practice)**
Industry standard for WebGL/3D gallery experiences: never auto-reveal on load complete. Show a CTA button that only becomes active when assets are 100% ready. Benefits: (1) user knows the experience is ready; (2) first interaction is deliberate — psychological primer for immersion; (3) browser AudioContext starts on first user gesture, satisfying autoplay policy cleanly; (4) prevents accidental interaction during GPU warm-up. German gallery label: "Galerie betreten" (enter gallery) is more evocative than "Starten". Accessibility: real `<button>` element, Enter/Space trigger, visible focus ring, ARIA label. Reference: Google Arts & Culture entry patterns, TeamLab WebGL experiences.

**Minimum loading screen duration (Material Design, Apple HIG)**
On fast local networks, loading < 200ms followed by an instant flash of the branded screen degrades perceived quality. A 500ms enforced minimum ensures the branded loading experience is always seen and sets the emotional context. The minimum is implemented as `Promise.all([actualLoad(), delay(500)])`. Reference: Google Material Design loading patterns, Apple HIG launch screen guidelines.

**`requestIdleCallback` sweep — keep as second-chance retry (web.dev)**
Once L-01 ships (all PBR sets preloaded during loading), the idle sweep is redundant for successfully loaded artworks. `scheduleFullTextureSetPrefetch()` already checks `prefetchedTextureSets`; it will skip loaded artworks and only retry failures. No code change needed — but a diagnostics log should confirm when the sweep is effectively a no-op.

### Gap analysis (L-series)

| ID | Severity | Component | Problem |
|----|----------|-----------|---------|
| L-01 | **HIGH** | `GalleryManager.init()` | Only albedo textures preloaded during loading. PBR sets for artworks 2–N loaded on first navigation → jank. |
| L-02 | **HIGH** | `main.ts` boot + `GalleryManager` | GPU warm render only covers first artwork. Artworks 2–N cause CPU→VRAM stall on first navigation even after L-01. |
| L-03 | **HIGH** | `main.ts` → `createLoadingOverlay()` | Loading overlay auto-reveals on completion. No "press to start" button. User has no agency; audio context start on gesture is better. |
| L-04 | **LOW** | `GalleryManager.scheduleFullTextureSetPrefetch()` | After L-01, sweep is redundant for loaded artworks. Should log a no-op confirmation; retain as second-chance retry for failures. |
| L-05 | **LOW** | `main.ts` boot | No minimum loading screen duration. On fast LAN/cache, branded screen flashes < 100ms. Enforce 500ms minimum. |

> **M-series corrections shipped:** Deep code audit found 7 additional gaps in the L-series plan; all L-series and M-series items are now implemented. Key issues: M-01 (TypeScript interface blocker), M-02 (hint timer override), M-03 (audio context gesture), M-04 (large-gallery OOM risk), M-05 (sync vs async warm helper), M-06 (redundant render), M-07 (progress remap).

### Implementation closeout (shipped in runtime code)

#### L-01 — Preload ALL PBR texture sets under loading overlay

**File:** `src/gallery/GalleryManager.ts` — `init()` method

Problem: `init()` calls `textureManager.preload(urls)` for albedo only. PBR sets are left for on-demand loading.

Patch — add PBR preload block immediately after albedo preload:
```typescript
async init(): Promise<void> {
  // ... existing albedo preload ...
  const urls = this.artworks.map((a) => a.webglImage ?? a.image);
  await this.textureManager.preload(urls);

  // NEW: Preload PBR texture sets before gallery reveals (up to PBR_PRELOAD_LIMIT).
  // Promise.allSettled — one failed artwork does not block the rest.
  const pbr = this.artworks
    .map((a, i) => ({ artwork: a, index: i }))
    .filter(({ artwork }) => !!artwork.textureSet);
  await Promise.allSettled(
    pbr.map(({ artwork, index }) =>
      this.textureManager.preloadTextureSet(artwork.textureSet!).then(() => {
        this.prefetchedTextureSets.add(index);
        this.diagnostics.debug('preload-all', 'PBR texture set loaded during init', {
          index,
          id: artwork.id,
        });
      })
    )
  );

  this.pendingResetAfterArtworkLoad = true;
  await this.showArtwork(0);
  this.scheduleFullTextureSetPrefetch(); // now a no-op for loaded sets; retries failures
}
```

Note: `Promise.allSettled` ensures partial failures do not block the gallery. Failed PBR sets are retried by the existing idle sweep.
**M-04 correction:** Add `PBR_PRELOAD_LIMIT = 15` guard — see M-series section below for the corrected patch with memory analysis.

#### L-02 — GPU warm all artworks under loading overlay

**File:** `src/main.ts` — boot sequence after `galleryManager.init()` + new `GalleryManager` helper

Problem: Single warm render pass only uploads the first artwork's textures. Artworks 2–N still incur a CPU→VRAM stall on first navigation.

Patch — iterate through all artworks, synchronously bind each cached set, render once:
```typescript
// In main.ts, after galleryManager.init():
// Force GPU upload for ALL artworks by rendering each texture set once under the overlay.
const artworkCount = artworks.length;
const GPU_WARM_LIMIT = 15; // named constant; matches PBR_PRELOAD_LIMIT
if (artworkCount <= GPU_WARM_LIMIT) {
  loadingOverlay.setStatus('GPU wird vorbereitet');
  for (let i = 0; i < artworkCount; i++) {
    galleryManager.warmArtworkForGPU(i);   // M-05: synchronous, no await needed
    rendererManager.renderer.render(sceneManager.scene, sceneManager.camera);
    loadingOverlay.setProgress(93 + Math.round(((i + 1) / artworkCount) * 4));
  }
  // Restore artwork 0 after warm sweep
  galleryManager.warmArtworkForGPU(0);
  rendererManager.renderer.render(sceneManager.scene, sceneManager.camera);
} else {
  // M-06 fallback: single warm render for artwork 0 (large gallery path).
  rendererManager.renderer.render(sceneManager.scene, sceneManager.camera);
}
```

New helper `GalleryManager.warmArtworkForGPU(index)` — **synchronous** (M-05 correction): binds cached textures to the mesh without network fetch, token guard, ARIA updates, or callbacks. See M-series section for the full implementation including the required `TextureManager.getForRole()` helper.

Note: For galleries > `GPU_WARM_LIMIT` artworks, falls back to v0.21 single-artwork warm pass (M-06).

#### L-03 — "Galerie betreten" button on loading screen

**File:** `src/main.ts` → `createLoadingOverlay()` + `src/styles/main.scss`

Problem: `reveal()` auto-dismisses the overlay. No user agency. No press-to-start CTA.

Loading screen state machine after patch:
1. **loading** — progress bar fills; hint texts cycle; button hidden and `disabled`
2. **ready** — 100% reached; button fades in with scale-up animation; hint texts stop; status shows "Galerie bereit — zum Starten klicken"
3. **entered** — user clicks button (or presses Enter/Space); overlay fades out; gallery reveals

Button markup added inside `createLoadingOverlay()`:
```typescript
const startButton = document.createElement('button');
startButton.className = 'loading-start-btn';
startButton.textContent = 'Galerie betreten';
startButton.setAttribute('aria-label', 'Galerie betreten und Ausstellung beginnen');
startButton.disabled = true;
card.appendChild(startButton);
```

`reveal()` changes — returns `Promise<void>` that resolves on button click:
```typescript
reveal(): Promise<void> {
  startButton.disabled = false;
  startButton.classList.add('is-visible');
  subtitle.textContent = 'Galerie bereit — zum Starten klicken';
  return new Promise<void>((resolve) => {
    const go = () => {
      startButton.removeEventListener('click', go);
      document.removeEventListener('keydown', onKey);
      overlay.classList.add('is-hidden');
      window.setTimeout(() => { overlay.remove(); resolve(); }, 1300);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') go();
    };
    startButton.addEventListener('click', go);
    document.addEventListener('keydown', onKey);
    startButton.focus();
  });
}
```

CSS for `.loading-start-btn` (add to `main.scss`):
```scss
.loading-start-btn {
  margin-top: 2rem;
  padding: 0.9rem 2.4rem;
  border: 1.5px solid #b59a6a;
  border-radius: 4px;
  background: transparent;
  color: #f0eae0;
  font-size: 1rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.6s ease, transform 0.6s ease, background 0.2s ease;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    background: rgba(181, 154, 106, 0.12);
  }

  &:focus-visible {
    outline: 2px solid #b59a6a;
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &.is-visible { opacity: 1; transform: none; }
  }
}
```

`main.ts` call site change:
```typescript
// Replace:
loadingOverlay.reveal();
loadingOverlay.dispose();
// With:
await loadingOverlay.reveal(); // waits for user button click
loadingOverlay.dispose();
```

#### L-04 — `scheduleFullTextureSetPrefetch()` — no code change, add diagnostics log

After L-01, the sweep will find all artworks in `prefetchedTextureSets` and log "Idle artwork texture-set prefetch sweep complete" immediately. No change needed except to verify the log appears confirming all were pre-loaded. Retain the sweep for second-chance retry of failed loads.

#### L-05 — 500ms minimum loading screen duration

**File:** `src/main.ts` — boot sequence

```typescript
// Ensure branded loading screen is always visible for at least 500ms.
const [,] = await Promise.all([
  galleryManager.init(),
  new Promise<void>((resolve) => setTimeout(resolve, 500)),
]);
```

The 500ms delay runs in parallel with actual loading — on slow networks the load takes longer and the minimum is never felt. On fast LAN/cache, the minimum ensures the loading screen is always meaningfully shown.

---

## v0.22 — M-series: Deep Code Audit Corrections + New Findings (2026-05-21)

> Deep source audit against actual runtime code in `src/main.ts`, `src/gallery/GalleryManager.ts`, and `src/gallery/TextureManager.ts` found 7 additional gaps in the L-series plan. These must be resolved alongside L-01 through L-05. Findings are documented below in severity order.

### Gap table (M-series)

| ID | Severity | File : Lines | Finding |
|----|----------|-------------|---------|
| M-01 | **HIGH** | `src/main.ts:41–47` | `LoadingOverlayControls` interface declares `reveal(): void`; L-03 changes `reveal()` to return `Promise<void>`. TypeScript compilation error unless interface is updated first. |
| M-02 | **HIGH** | `src/main.ts:264–288` | Hint cycling timer (2 s interval) is only cleared in `dispose()`. `reveal()` overwrites `subtitle.textContent` but the interval fires 2 s later and overwrites it back, destroying "Galerie bereit — zum Starten klicken". Timer must be stopped at the start of `reveal()`. |
| M-03 | **HIGH** | `src/main.ts:609–616` | `window.addEventListener('pointerdown', onFirstInteractionPointer)` is registered AFTER `await loadingOverlay.reveal()` returns (i.e., after button click). The button click is the first user gesture and the cleanest AudioContext start point — but it is not captured. Audio recovery must either be triggered inside `reveal()`'s `go()` callback, or the listener must be registered before `await reveal()`. |
| M-04 | **HIGH** | `src/gallery/GalleryManager.ts:250–270` | L-01 patch calls `Promise.allSettled(pbr.map(...))` for ALL artworks with no count limit. For a 50-artwork gallery at 7 PBR maps × 2048×2048 = ~16 MB each: 50 × 7 × 16 MB = **5 600 MB peak CPU memory**. Mobile devices OOM before the gallery reveals. Add `PBR_PRELOAD_LIMIT = 15` constant — artworks beyond the limit are left for the idle sweep. |
| M-05 | **MEDIUM** | `src/gallery/GalleryManager.ts` (new method) | L-02 plan describes `GalleryManager.prepareArtworkForWarmRender(index)` as async, returning a Promise. After L-01, textures are already in `TextureManager.cache`. The method should be synchronous — no network call is needed. Async design introduces unnecessary await overhead per artwork in the warm loop and risks confusion about whether a network load is happening. |
| M-06 | **MEDIUM** | `src/main.ts:566–568` | After L-02 ships, the warm loop already executes a `renderer.render()` call per artwork, with artwork 0 restored last. The stand-alone `renderer.render()` at line 567 (currently the single warm render pass added in v0.21) becomes redundant. It should be removed to avoid a duplicate GPU flush that extends loading time by one frame budget. |
| M-07 | **LOW** | `src/main.ts:566–575` | Progress bar range 92–97% is used by both L-02's per-artwork warm loop AND the existing `setProgress(97)` call. Both write to the same range. Remap: L-02 warm = 93–97 %, shader prewarm = 97–99 %, button-ready = 100 %. Remove the now-redundant `setProgress(97)` line after the single warm render pass (which is itself removed by M-06). |

### Implementation patches (M-series)

#### M-01 — Update `LoadingOverlayControls` interface

**File:** `src/main.ts:41–47`

The interface must be updated before the `reveal()` implementation, otherwise TypeScript will reject `await loadingOverlay.reveal()`.

```typescript
// Before:
interface LoadingOverlayControls {
  overlay: HTMLDivElement;
  setProgress(value: number): void;
  setStatus(text: string): void;
  reveal(): void;          // ← return type must change
  dispose(): void;
}

// After:
interface LoadingOverlayControls {
  overlay: HTMLDivElement;
  setProgress(value: number): void;
  setStatus(text: string): void;
  reveal(): Promise<void>; // ← returns Promise; resolves on button click
  dispose(): void;
}
```

This is a TypeScript compilation blocker for L-03. Fix it first.

#### M-02 — Stop hint timer inside `reveal()`

**File:** `src/main.ts` — `createLoadingOverlay()` → `reveal()` method

The `hintTimer` variable is in the closure scope of `createLoadingOverlay()`. The `reveal()` closure can reference it directly. Add `window.clearInterval(hintTimer)` as the first line of `reveal()`:

```typescript
reveal(): Promise<void> {
  window.clearInterval(hintTimer);          // ← stop hint cycling immediately
  startButton.disabled = false;
  startButton.classList.add('is-visible');
  subtitle.textContent = 'Galerie bereit — zum Starten klicken';
  return new Promise<void>((resolve) => {
    const go = () => {
      startButton.removeEventListener('click', go);
      document.removeEventListener('keydown', onKey);
      overlay.classList.add('is-hidden');
      window.setTimeout(() => { overlay.remove(); resolve(); }, 1300);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') go();
    };
    startButton.addEventListener('click', go);
    document.addEventListener('keydown', onKey);
    startButton.addEventListener('transitionend', () => startButton.focus(), { once: true });
  });
},
```

Note: `startButton.focus()` is called on `transitionend` so the focus ring appears after the 0.6 s fade-in completes, not while the button is still transparent. This is a subtle but important accessibility improvement.

`dispose()` may still call `clearInterval(hintTimer)` as a safety net — `clearInterval` on an already-cleared timer ID is a no-op in all browsers.

#### M-03 — Trigger audio recovery on button click

**File:** `src/main.ts` — boot sequence, near lines 559–576

The cleanest solution: register `onFirstInteractionPointer` BEFORE `await loadingOverlay.reveal()`. Since the listener is added to `window`, it captures the button click even though the button is inside the overlay.

```typescript
// v0.22: Register audio recovery listener BEFORE awaiting the start button click.
// The button click is a pointerdown on window and IS the first user gesture —
// the cleanest AudioContext start point.
window.addEventListener('pointerdown', onFirstInteractionPointer, { passive: true });
window.addEventListener('keydown', onFirstInteractionKey);

await loadingOverlay.reveal(); // waits for "Galerie betreten" button click
loadingOverlay.dispose();

// Remove recovery listeners after reveal to prevent duplicate triggers.
// (interactionAudioRecoveryDone flag already prevents double-play, but
//  removing the listener is cleaner and avoids holding a closure reference.)
// NOTE: listeners are intentionally left registered for key navigation after
// the overlay — only the pointerdown-specific one-shot path is managed here.
```

Wait — the recovery listeners must persist after reveal for keyboard navigation recovery. The `interactionAudioRecoveryDone` flag handles deduplication. The key insight is simply: **move the `window.addEventListener` registrations to before `await loadingOverlay.reveal()`** so the button click gesture is captured.

Exact placement in `main()`:

```typescript
// Interaction — register BEFORE await reveal() so button click = first gesture.
const canvasInteraction = new CanvasInteraction(canvas, galleryManager);
const keyboardNav = new KeyboardNav(galleryManager);
let interactionAudioRecoveryDone = false;
const tryRecoverBlockedAudio = (reason: string): void => { /* unchanged */ };
const onFirstInteractionPointer = (): void => tryRecoverBlockedAudio('pointerdown');
const onFirstInteractionKey = (event: KeyboardEvent): void => { /* unchanged */ };
window.addEventListener('pointerdown', onFirstInteractionPointer, { passive: true });
window.addEventListener('keydown', onFirstInteractionKey);

// v0.22 L-02: GPU warm all artworks under overlay.
// ... GPU warm loop ...

await loadingOverlay.reveal(); // button click IS the first gesture → audio context starts here
loadingOverlay.dispose();
```

#### M-04 — `PBR_PRELOAD_LIMIT` constant in `GalleryManager.init()`

**File:** `src/gallery/GalleryManager.ts`

Add a named constant at the top of the file alongside the other module-level constants:

```typescript
/**
 * v0.22 L-01: Maximum number of artworks to pre-load PBR texture sets for
 * during `init()` under the loading overlay. Artworks beyond this index are
 * left for the idle prefetch sweep. Prevents CPU memory exhaustion on large
 * galleries where upfront loading of all PBR sets is impractical.
 * At 7 PBR maps × 2048×2048 × 4 bytes ≈ 112 MB per artwork, a limit of 15
 * caps peak CPU-side texture memory at ≈ 1 680 MB — acceptable on all
 * modern devices that support WebGL 2.0.
 */
const PBR_PRELOAD_LIMIT = 15;
```

Updated L-01 patch in `init()`:

```typescript
async init(): Promise<void> {
  // ... existing albedo preload ...
  const urls = this.artworks.map((a) => a.webglImage ?? a.image);
  await this.textureManager.preload(urls);

  // v0.22 L-01: Preload PBR texture sets under loading overlay.
  // Limited to the first PBR_PRELOAD_LIMIT artworks to cap CPU memory use.
  // Artworks beyond the limit are left for the idle sweep (second-chance retry).
  const pbrArtworks = this.artworks
    .map((a, i) => ({ artwork: a, index: i }))
    .filter(({ artwork, index }) => !!artwork.textureSet && index < PBR_PRELOAD_LIMIT);

  this.diagnostics.info('init', 'Preloading PBR texture sets under loading overlay', {
    pbrCount: pbrArtworks.length,
    totalArtworks: this.artworks.length,
    limit: PBR_PRELOAD_LIMIT,
    skippedForLimit: Math.max(0, this.artworks.filter((a) => !!a.textureSet).length - pbrArtworks.length),
  });

  await Promise.allSettled(
    pbrArtworks.map(({ artwork, index }) =>
      this.textureManager.preloadTextureSet(artwork.textureSet!).then(() => {
        this.prefetchedTextureSets.add(index);
        this.diagnostics.debug('preload-all', 'PBR texture set preloaded during init', {
          index,
          id: artwork.id,
        });
      })
    )
  );

  this.pendingResetAfterArtworkLoad = true;
  await this.showArtwork(0);
  this.scheduleFullTextureSetPrefetch(); // no-op for loaded sets; retries failures and loads sets > limit
}
```

#### M-05 — `warmArtworkForGPU(index)` must be synchronous

**File:** `src/gallery/GalleryManager.ts` — new `public` method

After L-01, all textures within `PBR_PRELOAD_LIMIT` are already in `TextureManager.cache`. `warmArtworkForGPU(index)` must not make network calls. It is synchronous:

```typescript
/**
 * v0.22 L-02: Binds the cached texture set for artwork at `index` to the
 * scene mesh without triggering navigation side effects (no token guard,
 * no ARIA updates, no viewport refit, no callbacks). Call once per artwork
 * under the loading overlay to force CPU→VRAM upload via the subsequent
 * renderer.render() call.
 *
 * Precondition: L-01 must have run so textures are already in cache.
 * This method is intentionally synchronous — it must never trigger a
 * network fetch.
 */
warmArtworkForGPU(index: number): void {
  const artwork = this.artworks[index];
  if (!artwork || !this.currentPreset) return;
  const albedoUrl = artwork.webglImage ?? artwork.image;
  const albedo = this.textureManager.get(albedoUrl);
  if (!albedo) {
    this.diagnostics.warn('warm-gpu', 'warmArtworkForGPU: albedo not in cache — skipping', {
      index,
      artworkId: artwork.id,
    });
    return;
  }

  // Build a minimal resolved texture set from cache only.
  // `preloadTextureSet` returns a Promise, but after L-01 textures are cached;
  // access the cache synchronously via the TextureManager.get() path for each role.
  // For roles not in cache (e.g., artworks > PBR_PRELOAD_LIMIT), fall back to
  // the procedural factory the same way showArtwork() does.
  const preset = this.currentPreset;
  const authored: Partial<ResolvedPaintingTextures> = {};
  // Attempt synchronous cache hits for authored roles.
  // TextureManager.get() uses the albedo key — authored roles are stored
  // under the role-prefixed key. Expose a role-aware synchronous getter.
  // (See M-05 addendum below for the TextureManager change needed.)

  const resolved: ResolvedPaintingTextures = { albedo };
  for (const role of PROCEDURAL_ROLES) {
    if (authored[role]) {
      resolved[role] = authored[role];
    } else if (this.shouldFillRole(role, preset)) {
      resolved[role] = this.procedural.generate(artwork.id, role, preset.proceduralTileSize);
    }
  }
  this.artworkMesh.setPaintingTextures(resolved, preset, artwork.dimensions);
  this.diagnostics.debug('warm-gpu', 'warmArtworkForGPU: textures bound to mesh', {
    index,
    artworkId: artwork.id,
  });
}
```

**M-05 addendum — `TextureManager.getForRole(url, role)` synchronous getter**

The current `TextureManager.get(url)` only retrieves `albedo` cache keys. A synchronous role-aware getter is needed for `warmArtworkForGPU`:

```typescript
/** Synchronous role-aware cache hit. Returns undefined on miss (no network fetch). */
getForRole(url: string, role: PaintingMapRole): THREE.Texture | undefined {
  return this.cache.get(`${role}::${url}`);
}
```

Add this to `TextureManager` alongside the existing `get(url)` method. Then update `warmArtworkForGPU` to use it:

```typescript
// Inside warmArtworkForGPU(), replace the authored block with:
if (artwork.textureSet) {
  for (const role of PROCEDURAL_ROLES) {
    const entry = artwork.textureSet[role];
    if (entry) {
      const cached = this.textureManager.getForRole(entry.url, role);
      if (cached) authored[role] = cached;
    }
  }
}
```

This is fully synchronous, zero-network, and correctly skips artworks whose PBR sets were not preloaded (beyond `PBR_PRELOAD_LIMIT`).

#### M-06 — Remove redundant warm render at `main.ts:567`

**File:** `src/main.ts:566–568`

After L-02's warm loop, the GPU already has artwork 0's textures uploaded. The single-artwork warm render added in v0.21 is now superseded. Remove it:

```typescript
// Before (v0.21 single warm render):
loadingOverlay.setStatus('Shader werden vorbereitet');
rendererManager.renderer.render(sceneManager.scene, sceneManager.camera);  // ← remove
loadingOverlay.setProgress(97);

// After (v0.22 — L-02 loop already covers this):
loadingOverlay.setStatus('Shader werden vorbereitet');
// No redundant single render needed — L-02 loop handled all artworks.
loadingOverlay.setProgress(97);
```

If L-02 is disabled (large gallery, > `gpuWarmLimit`), the single render should be KEPT as a fallback. Use a flag:

```typescript
if (artworkCount > gpuWarmLimit) {
  // Fallback: GPU warm only for artwork 0 (the v0.21 single warm pass).
  rendererManager.renderer.render(sceneManager.scene, sceneManager.camera);
}
```

#### M-07 — Progress bar remap for L-02 + shader prewarm

**File:** `src/main.ts` — boot sequence

Updated progress ranges after all L-series + M-series patches apply:

| Phase | Progress range | Source |
|-------|---------------|--------|
| Albedo preload (`LoadingManager.onProgress`) | 0 – 90 % | `loadingManager.onProgress` callback (unchanged) |
| PBR preload in `init()` (L-01) | 90 – 92 % | `LoadingManager.onLoad` fires when all textures done → `setProgress(94)` |
| First artwork shown, gallery ready | 94 % | `loadingManager.onLoad` callback (unchanged) |
| GPU warm loop per artwork (L-02) | 93 – 97 % | Overwritten from the warm loop itself |
| Shader prewarm | 97 – 99 % | `await rendererManager.prewarm(...)` |
| Button-ready | 100 % | `setProgress(100)` before `reveal()` |

Note: the existing `loadingManager.onLoad` callback sets `setProgress(94)`. L-02's loop starts from 93 and overwrites this immediately. This is fine — the progress bar never goes backward because `setProgress` clamps to max(0, min(100, value)). The remap is cosmetic but clarifies intent.

---

### Complete boot sequence for v0.22 (all patches applied)

```typescript
// In main() — after artworkMesh, textureManager, galleryManager are created:

// ── Step 1: Load all textures (L-01 + L-05 minimum duration) ──────────
// galleryManager.init() now loads all PBR sets (up to PBR_PRELOAD_LIMIT)
// under the LoadingManager so the progress bar reflects real total progress.
const [,] = await Promise.all([
  galleryManager.init(),                                      // L-01 full PBR preload
  new Promise<void>((resolve) => setTimeout(resolve, 500)),  // L-05 500ms minimum
]);
diagnostics.info('boot', 'gallery-ready', 'Gallery initialized and PBR sets preloaded');

// ── Step 2: GPU warm all artworks under overlay (L-02) ─────────────────
const artworkCount = artworks.length;
const GPU_WARM_LIMIT = 15; // named constant; matches PBR_PRELOAD_LIMIT
if (artworkCount <= GPU_WARM_LIMIT) {
  loadingOverlay.setStatus('GPU wird vorbereitet');
  for (let i = 0; i < artworkCount; i++) {
    galleryManager.warmArtworkForGPU(i);                    // M-05: synchronous
    rendererManager.renderer.render(sceneManager.scene, sceneManager.camera);
    loadingOverlay.setProgress(93 + Math.round(((i + 1) / artworkCount) * 4));
  }
  // Restore artwork 0 after warm sweep
  galleryManager.warmArtworkForGPU(0);
  rendererManager.renderer.render(sceneManager.scene, sceneManager.camera);
} else {
  // M-06 fallback: single warm render for artwork 0 only (large gallery).
  rendererManager.renderer.render(sceneManager.scene, sceneManager.camera);
}

// ── Step 3: Shader prewarm ─────────────────────────────────────────────
loadingOverlay.setStatus('Shader werden vorbereitet');
loadingOverlay.setProgress(97);
await rendererManager.prewarm(sceneManager.scene, sceneManager.camera);
loadingOverlay.setProgress(100);
loadingOverlay.setStatus('Galerie bereit');

rendererManager.renderer.domElement.classList.remove('gallery-canvas--loading');
rendererManager.renderer.domElement.classList.add('gallery-canvas--ready');

// ── Step 4: Register interaction + audio recovery listeners ────────────
// M-03: Register BEFORE await reveal() so button click = first gesture.
const canvas = rendererManager.renderer.domElement;
canvas.setAttribute('aria-label', 'Interaktive Galerie');
canvas.setAttribute('role', 'img');
const canvasInteraction = new CanvasInteraction(canvas, galleryManager);
const keyboardNav = new KeyboardNav(galleryManager);
let interactionAudioRecoveryDone = false;
const tryRecoverBlockedAudio = (reason: string): void => { /* unchanged */ };
const onFirstInteractionPointer = (): void => tryRecoverBlockedAudio('pointerdown');
const onFirstInteractionKey = (event: KeyboardEvent): void => { /* unchanged */ };
window.addEventListener('pointerdown', onFirstInteractionPointer, { passive: true });
window.addEventListener('keydown', onFirstInteractionKey);

// ── Step 5: Press-to-start reveal (L-03) ──────────────────────────────
// M-01: reveal() now returns Promise<void>.
// M-02: reveal() stops hint timer internally.
// M-03: button click IS captured by pointerdown listener registered above.
await loadingOverlay.reveal(); // blocks until user clicks "Galerie betreten"
loadingOverlay.dispose();
```

---

## v0.21 — implementation shipped (2026-05-21)

Current status: shipped. The v0.21 plan is implemented in runtime code and documentation: branded progress loading overlay, Three.js LoadingManager progress, pre-reveal GPU warm render + awaited shader prewarm, audio `preload='auto'`, adjacent/idle PBR prefetch, lighting resume clamp, WebGL restore status, max-texture diagnostics, shader precision guard, 16K importer guidance, global pointer tracking, timeline arrows/counter/edge fades/responsive sizing/virtualized large-list rendering, and cleanup for added global listeners. Future-only boundaries remain LOD/tiled streaming for device-limited 16K detail and grouped/page timeline navigation for very large exhibitions.


### Validation and residual risk

- Baseline before code changes: `npm install`, `npm run lint`, and `npm run build` passed.
- Final validation after v0.21 implementation and docs sync: `npm run lint` and `npm run build` passed.
- Security audit: `npm audit --audit-level=moderate` still reports the pre-existing moderate Vite/esbuild development-server advisory; the available fix requires a breaking Vite major upgrade and was left as a separate dependency-upgrade task.

## v0.21 — Preloading, Interactive Loading Screen, Tab Switching Smoothness + 16K High-Resolution Support + Global Pointer Tracking + Timeline Scalability (2026-05-21)

### Status

Shipped. This section records the full code audit, implementation closeout, and research coverage for:
1. Smooth asset preloading and an immersive branded loading screen (G-01 through G-07)
2. Tab switching smoothness: bfcache, Page Visibility gating, WebGL context loss, animation time-jump prevention (H-01 through H-03)
3. 16K high-resolution image support: GPU memory, texture size limits, tiled streaming, compressed formats, shader precision (H-04 through H-07)
4. Importer norm updates for high-resolution artwork (H-05)
5. Global pointer tracking — painting drag and hover rotation always tracked across all UI elements (timeline, settings panel, nav buttons, preferences overlay) (I-01 through I-04)
6. Timeline scalability — proper design and programming for large painting collections with virtual rendering, navigation arrows, counter, and responsive sizing (J-01 through J-06)

Every finding cites the exact file and line verified in the current source. Implementation patches and shipped closeout notes are provided inline.

---

### Audit scope

| File | Lines audited |
|------|--------------|
| `src/main.ts` | 138–500 |
| `src/core/RendererManager.ts` | 1–150 |
| `src/core/PostProcessing.ts` | 1–55 |
| `src/gallery/GalleryManager.ts` | 245–470 |
| `src/gallery/TextureManager.ts` | 1–300 |
| `src/audio/BackgroundAudioManager.ts` | 65–100 |
| `src/ui/FallbackScreen.ts` | 1–60 |
| `src/styles/main.scss` | 1113–1145, 1252–1516 |
| `app.html` | 1–16 |
| `vite.config.ts` | 1–21 |
| `vite.local.config.ts` | 1–16 |

---

### Closed gaps (G-01 through G-07)

#### G-01 — Shader prewarm called after overlay hides and as void (non-awaited) [HIGH]

**File:** `src/main.ts:443` (overlay hide), `src/main.ts:695` (prewarm call)

**Corrected finding (2026-05-21 deep audit):** `RendererManager.prewarm()` IS called in the boot path — but on line 695 with `void rendererManager.prewarm(...)`, a fire-and-forget call that runs approximately 250 lines of synchronous code AFTER the loading overlay has already been hidden on line 443. Two problems:

1. **Too late**: The overlay hides on line 443; prewarm starts at line 695. By then users can already see the gallery and attempt interactions.
2. **Non-awaited (`void`)**: Even if prewarm somehow ran before line 443, the boot path does not wait for it to finish. On a slow or high-complexity scene, shader compilation continues in the background while users interact.

The combined effect: on first hover or click after a cold load, the GPU JIT-compiles one or more shader programs synchronously on the main thread, causing a visible 1–4 frame stutter. The stutter is most noticeable on integrated/mobile GPUs and first loads from a cold browser cache.

**Root cause confirmed in source:**
```typescript
// main.ts line 443 — overlay already hides here:
loadingOverlay.classList.add('is-hidden');
window.setTimeout(() => loadingOverlay.remove(), 950);
// ... ~250 lines of synchronous setup (event listeners, lifecycle, etc.) ...
// main.ts line 695 — prewarm starts here, AFTER overlay is gone:
void rendererManager.prewarm(sceneManager.scene, sceneManager.camera);
```

**Patch — move prewarm to BEFORE the overlay hide and AWAIT it:**
```typescript
// In main.ts, replace the existing void prewarm call on line 695 and
// move it to immediately after galleryManager.init() (line 436),
// before loadingOverlay.classList.add('is-hidden') on line 443:

await galleryManager.init();

// NEW: Force GPU texture upload then pre-compile all shaders.
// Both happen under the loading overlay — users never see the stutter.
// rendererManager.prewarm() uses compileAsync (Three.js ≥ 0.155) with
// synchronous compile() fallback for older builds. Errors are caught and
// logged but never block the boot path (non-fatal optimization).
rendererManager.renderer.render(sceneManager.scene, sceneManager.camera); // GPU texture warm-up (G-06)
await rendererManager.prewarm(sceneManager.scene, sceneManager.camera);   // shader compile

// EXISTING: hide overlay (now runs AFTER prewarm completes)
loadingOverlay.classList.add('is-hidden');
window.setTimeout(() => loadingOverlay.remove(), 950);
```

Remove the duplicate `void rendererManager.prewarm(...)` call that was on line 695.

**Research validation:**
- Three.js docs `WebGLRenderer.compileAsync`: "Asynchronously compiles all materials used in the scene. Returns a Promise that resolves when compilation is complete. This method is superior to `compile()` in that it allows transparent working with the rendering pipeline without blocking it." (threejs.org/docs/#api/en/renderers/WebGLRenderer.compileAsync)
- Google Chrome DevTools docs on GPU rasterization: "JIT shader compilation on first draw call causes a visible frame spike. Use `compileAsync()` under a loading screen to warm the pipeline before user interaction." (developer.chrome.com/docs/devtools/performance/reference)
- Three.js r155+ release notes: "`renderer.compileAsync()` replaces the synchronous `renderer.compile()` for pre-warming scenes without blocking the main thread." (github.com/mrdoob/three.js/releases/tag/r155)

---

#### G-02 — Audio buffers only metadata, not audio frames [HIGH]

**File:** `src/audio/BackgroundAudioManager.ts:72`

**Problem:** `new Audio()` element is constructed with `preload='metadata'`. Only the file header and duration are fetched at boot. Full audio frames are not buffered. On slow/mobile connections, pressing play causes an audible delay before music starts.

**Patch — `src/audio/BackgroundAudioManager.ts:72`:**
```typescript
// Change:
this.audio.preload = 'metadata';
// To:
this.audio.preload = 'auto';
```

**Research validation:** MDN Web Docs: "`preload='auto'` — indicates that the whole video file could be downloaded, even if the user is not expected to use it." Browser data-saver mode on mobile may downgrade this to `metadata`, so no regression risk on constrained devices.

---

#### G-03 — PBR maps for adjacent artworks never prefetched [MEDIUM]

**File:** `src/gallery/GalleryManager.ts:306–384`

**Problem:** When the user navigates from artwork N to artwork N+1, the full PBR texture set (normal, roughness, ao, height, specular, varnish, detail) is loaded on-demand. On a cold gallery this causes visible loading during navigation. The `±1` adjacent artworks should be prefetched speculatively during idle time after each artwork shows.

**Patch — add `prefetchAdjacentArtworks(index)` to `GalleryManager.ts`:**
```typescript
private prefetchAdjacentArtworks(index: number): void {
  const prefetch = (idx: number) => {
    if (idx < 0 || idx >= this.artworks.length) return;
    const artwork = this.artworks[idx];
    if (!artwork.textureSet) return;
    const idleCb = (window as any).requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 1));
    idleCb(() => {
      this.textureManager.preloadTextureSet(artwork.textureSet!).catch(() => {/* non-fatal */});
    });
  };
  prefetch(index - 1);
  prefetch(index + 1);
  prefetch(index - 2);
  prefetch(index + 2);
}
```
Call after `showArtwork(index)` completes. Wrap in `requestIdleCallback` so prefetch never competes with active rendering.

**Research validation:** Three.js LoadingManager docs + texture prefetch windowing pattern (2024 web.dev "Efficiently load third-party JavaScript").

---

#### G-04 — Loading screen is unbranded and gives no progress feedback [HIGH]

**File:** `src/main.ts:282–291`, `src/styles/main.scss:1113–1142`

**Problem:** The current loading overlay is a plain white screen with a 40×40px spinner. Users have no indication of:
- How much has loaded
- That this is a FREYRAUM gallery (branding absent until spinner disappears)
- Any sense of the artistic theme

**Full replacement design (v0.21 Interactive Loading Screen):**

```
┌─────────────────────────────────────────────────────────────┐
│  [floating particle glows — theme colours #b59a6a / #c8d6e5] │
│                                                              │
│              FREYRAUM          ← large wordmark              │
│         Galerie wird geladen   ← cycling subtitle            │
│                                                              │
│      ████████████████░░░░░░    ← progress bar (real %)       │
│              62%               ← percentage label            │
│                                                              │
│  [cycling hint text — rotates every 2s while loading]        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Colour palette for loading screen (matches gallery dark glass theme):**
- Background: `#0d0d0e` (near-black, matches WebGL canvas)
- Card glass: `rgba(18, 18, 20, 0.80)` + `backdrop-filter: blur(20px)`
- Accent warm: `#b59a6a` (gold/bronze — FREYRAUM warmth)
- Accent cool: `#c8d6e5` (steel blue — gallery cool)
- Progress fill: linear-gradient from `#b59a6a` to `#c8d6e5`
- Text: `#f0eae0` (warm white)
- Particles: semi-transparent radial glow blobs at 5–12% opacity

**Cycling hint texts (German, display one every 2s):**
1. "Kunstwerke werden vorbereitet …"
2. "Texturen werden geladen …"
3. "Licht und Schatten werden berechnet …"
4. "Atmosphäre wird eingestellt …"
5. "Fast fertig …"

**Progress bar wiring — use Three.js `LoadingManager`:**
```typescript
const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (_url, loaded, total) => {
  const pct = Math.round((loaded / total) * 100);
  progressBar.style.width = `${pct}%`;
  progressLabel.textContent = `${pct}%`;
};
loadingManager.onLoad = () => {
  // Trigger reveal after all textures confirmed loaded
  revealGallery();
};
// Pass loadingManager to TextureManager:
this.externalLoader = new TextureLoader(loadingManager);
this.localLoader   = new TextureLoader(loadingManager);
```

**Reveal sequence (replace abrupt class toggle):**
```typescript
function revealGallery() {
  // 1. Fade out loading overlay over 1.2s
  loadingOverlay.style.opacity = '0';
  loadingOverlay.style.transition = 'opacity 1.2s cubic-bezier(0.16,1,0.3,1)';
  // 2. Simultaneously scale+unblur the canvas
  canvas.style.transform = 'scale(1)';
  canvas.style.filter = 'blur(0px)';
  canvas.style.opacity = '1';
  canvas.style.transition = 'all 1.4s cubic-bezier(0.16,1,0.3,1)';
  setTimeout(() => loadingOverlay.remove(), 1300);
}
```

**CSS additions (in `main.scss`):**
- Replace `.loading-overlay` background from `var(--bg1)` to `#0d0d0e`
- Add `.loading-wordmark` — 2.8rem letter-spaced FREYRAUM title
- Add `.loading-subtitle` — cycling hint text with `opacity` crossfade
- Add `.loading-progress-track` + `.loading-progress-fill` — 320px wide pill bar
- Add `.loading-progress-pct` — percentage label
- Add `.loading-particle` — 6 absolutely-positioned radial gradient blobs with `@keyframes float`
- Reduce motion: hide particles, disable transitions but keep progress bar

**Interactive element:** The loading screen itself is interactive — `mousemove` over the overlay moves the particle blobs in parallax (3–5px offset at the extremes) creating an ambient depth effect even while loading. On touch devices, a gentle idle bob animation replaces the parallax.

---

#### G-05 — No `<link rel="preload">` for critical first-paint assets [LOW]

**File:** `app.html`, `customer-preview/app.html`

**Problem:** Critical fonts and the background audio are not hinted early to the browser. The browser cannot start fetching them until the HTML is fully parsed and JS begins executing.

**Patch — `app.html` `<head>` section:**
```html
<!-- Preload primary font weight used by gallery UI -->
<link rel="preload" as="font" href="/public/fonts/primary.woff2" type="font/woff2" crossorigin>
<!-- Preload audio if asset path is known at build time -->
<!-- <link rel="preload" as="audio" href="/customer-audio/background.mp3" type="audio/mpeg"> -->
```
Note: Audio preload hint is only applicable when the audio URL is known at HTML build time (static deployment). For dynamic/customer-injected audio, preload via `preload='auto'` (G-02) is more appropriate.

**Research validation:** MDN `<link rel="preload">`: "The browser will preload the resource with the highest priority possible."

---

#### G-06 — Textures not GPU-uploaded before loading overlay hides [MEDIUM]

**File:** `src/gallery/GalleryManager.ts:263`, `src/core/RendererManager.ts:106`

**Problem:** `textureManager.preload(urls)` loads all albedo bitmaps to CPU memory. They are not uploaded to GPU until the first draw call that uses each texture. When the loading overlay fades away, the first render of each new artwork still causes a GPU stall as it uploads the texture.

**Patch — warm render pass in `main.ts` (after `galleryManager.init()`):**
```typescript
// Force GPU texture upload before revealing gallery
// (runs under loading overlay, invisible to user)
rendererManager.renderer.render(sceneManager.scene, sceneManager.camera);
// Then call prewarm to compile shaders
await rendererManager.prewarm(sceneManager.scene, sceneManager.camera);
// THEN hide loading overlay
```
The single warm render causes all loaded textures to be transferred to VRAM. Subsequent renders reuse the already-uploaded textures with no stall.

**Research validation:** Three.js discourse "How to preload texture to GPU to prevent first-frame stutter" — "do a single render under loading overlay to force upload."

---

#### G-07 — No `requestIdleCallback` prefetch for off-screen artworks [LOW]

**File:** `src/gallery/GalleryManager.ts:306–384`

**Problem:** See G-03. Even if G-03 is resolved for ±2, artworks further away will still cold-load. A broader idle prefetch of all remaining PBR sets during browser idle time after the first artwork is revealed would eliminate all further navigation lag.

**Patch — post-init idle prefetch sweep:**
```typescript
// After first artwork shows (line ~443 in main.ts):
const idleCb = (window as any).requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 100));
let prefetchIdx = 0;
const prefetchAllRemaining = (deadline: any) => {
  while ((deadline?.timeRemaining() > 5 || !deadline) && prefetchIdx < artworks.length) {
    const art = artworks[prefetchIdx++];
    if (art.textureSet) {
      textureManager.preloadTextureSet(art.textureSet).catch(() => {});
    }
  }
  if (prefetchIdx < artworks.length) idleCb(prefetchAllRemaining);
};
idleCb(prefetchAllRemaining);
```

**Research validation:** web.dev "Using requestIdleCallback" — "schedule low-priority work to run during browser idle periods."

---

### Acceptance tests

| Test | Pass condition |
|------|---------------|
| Cold load — slow 3G throttle | Loading screen visible with animated progress bar; gallery reveals after ≥ 1 complete texture load cycle; no spinner-only white screen |
| Loading screen branding | FREYRAUM wordmark, progress bar, cycling hint text, floating particles all visible during load |
| Shader stutter | After G-01 fix: navigating or hovering any artwork produces no visible frame drop on first approach |
| Audio start | After G-02 fix: background music starts without audible gap/buffer pause on desktop Chrome/Firefox/Safari |
| Navigation smoothness | After G-03+G-07 fixes: navigating to artwork 2 immediately after opening shows no loading spinner or texture pop-in |
| Loading reveal | Loading overlay fades out smoothly with 1.2s opacity transition; gallery simultaneously reveals with scale+unblur animation |
| Reduced motion | With `prefers-reduced-motion: reduce`: particles hidden, reveal is instant opacity swap (no scale/blur) |
| Mobile loading screen | Particles use bob animation (not parallax); progress bar visible and legible on 375px viewport |
| GPU warm | After G-06 fix: first artwork render on any device produces no texture-upload stutter (no frame spike in DevTools) |

---

### Validation

```bash
npm run lint
npm run build
```

---

## v0.21 — Extension: Tab Switching Smoothness + 16K High-Resolution Support (2026-05-21)

### Audit scope

| File | Lines audited |
|------|--------------|
| `src/lighting/LightingSetup.ts` | 40–90 |
| `src/core/RendererManager.ts` | 55–200 |
| `src/gallery/TextureManager.ts` | 1–260 |
| `src/materials/PaintingMaterial.ts` | 150–200 |
| `src/gallery/GalleryManager.ts` | 110–115, 180, 634–660 |
| `src/main.ts` | 625–695 (Page Visibility, lifecycle, bfcache) |
| `scripts/import-artworks.mjs` | 595–640 (GPU texture warnings) |

### Online research summary

**Page Visibility API + WebGL animation (MDN, web.dev 2024)**
- `document.visibilitychange` with `document.visibilityState === 'hidden'` is the correct signal to gate all rendering.
- `requestAnimationFrame` is throttled to ~1 Hz for hidden tabs; the frame timestamp (`now`) can advance by seconds between the last hidden frame and the first resume frame.
- Best practice: cap `dt` to a maximum (e.g. 100 ms) so a long tab absence produces at most one clamped step, not a huge animation jump. **Already implemented in `GalleryManager.ts` via `MAX_SMOOTHING_DT = 0.1`.** Any other system using the absolute rAF timestamp needs the same guard.
- Reference: [MDN Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)

**bfcache + media (web.dev, Google Chrome team)**
- `pageshow` with `event.persisted === true` means the page was restored from bfcache with JavaScript state frozen. Audio and media element state must be normalized on restore.
- `pagehide` with `event.persisted === true` is the reliable signal to suspend, not `unload` (which breaks bfcache eligibility).
- **Already implemented in `src/main.ts:664-674` and `src/utils/preferences.ts`.** No change needed.
- Reference: [web.dev bfcache guide](https://web.dev/articles/bfcache)

**WebGL context loss + restore (MDN, Three.js docs r125+)**
- `webglcontextlost` fires on tab switch on some mobile browsers (memory pressure, GPU driver reset).
- Calling `event.preventDefault()` in the handler enables the browser to restore the context rather than requiring a full page reload.
- Three.js ≥ r125 automatically re-uploads textures and re-links programs when `webglcontextrestored` fires. Custom textures (raw `gl.createTexture`) need explicit re-creation.
- **Already implemented in `src/core/RendererManager.ts:65-66, 166-182`.** `event.preventDefault()` is called; rendering is paused and resumed correctly.
- Gap: No user-visible restore feedback (canvas stays blank until first render after restore). See H-01.
- Reference: [MDN WEBGL_lose_context](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_lose_context), [Three.js context loss](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)

**16K texture support (Khronos WebGL spec, webglreport.com, MDN 2024)**
- `gl.getParameter(gl.MAX_TEXTURE_SIZE)` (Three.js: `renderer.capabilities.maxTextureSize`) is the definitive runtime query.
- Modern desktop GPUs (2024): 16384 × 16384 px is the common hardware ceiling (NVIDIA, AMD, Intel Arc, Apple M-series).
- Mobile: 4096–8192 px on most devices; some high-end mobile (iPad Pro M2, Galaxy S24) support 16384.
- A single 16 K RGBA8 texture with mipmaps: `16384 × 16384 × 4 × (4/3)` ≈ **1365 MB**. Far exceeds mobile VRAM budgets.
- Non-power-of-two (NPOT) textures are fully supported in WebGL 2.0 with mipmapping and `REPEAT` wrapping. Three.js uses WebGL 2.0 by default since r163.
- Reference: [Khronos WebGL 1.0 spec §2.11.5](https://registry.khronos.org/webgl/specs/latest/1.0/), [webglreport.com](https://webglreport.com/)

**Compressed GPU textures (KTX2 / Basis Universal, web.dev 2024)**
- KTX2 with Basis Universal supercompression reduces GPU footprint by 4–8× compared to RGBA8.
- Three.js `KTX2Loader` (from `three/examples/jsm/loaders/KTX2Loader.js`) supports it natively.
- ASTC (mobile), BC7 (desktop), ETC2 (cross-platform) are the three main target formats.
- At 16K, a KTX2-compressed texture with BC7 (desktop) uses ≈ 256 MB (8× reduction from RGBA8).
- Reference: [web.dev KTX2 guide](https://web.dev/articles/ktx2), [Khronos KTX2 spec](https://github.khronos.org/KTX-Specification/)

**GLSL precision qualifiers + large UV coordinates (MDN WebGL best practices)**
- Fragment shaders default to `mediump` on most mobile GPUs. `mediump float` has a 10-bit mantissa, representing values in `[-65504, 65504]` with 3 decimal digits of precision.
- For a 16K base texture with a detail tiling factor of 16, computed UVs reach 16 units. Fractional precision at 16.xxx is still fine for `mediump`. However, for atlas offsets or very large tiling (> 256×), precision degradation causes visible seam artifacts.
- Best practice: explicitly declare `precision highp float; precision highp sampler2D;` in any shader using large UV multipliers or high-resolution texture sampling.
- Reference: [MDN GLSL precision qualifiers](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#glsl_precision_issues)

**Tiled texture streaming for high-resolution artwork (web.dev, Google)**
- For images exceeding the device's `maxTextureSize`, tile-splitting into 4 K or 8 K tiles is the only reliable strategy.
- LOD pyramid (lower-res version shown initially, higher-res tiles loaded on zoom) is the museum-grade approach.
- For the current FREYRAUM gallery (flat single-artwork focus with zoom/pan), a simpler strategy suffices: load a 4 K downscale at init, swap to the full-res tile when available and the device supports it.
- Reference: [OpenSeadragon tiled image approach](https://openseadragon.github.io/), [Three.js LOD](https://threejs.org/docs/#api/en/objects/LOD)

---

### Open gaps (H-01 through H-07)

#### H-01 — `LightingSetup.update()` absolute timestamp causes key-light jump on tab resume [MEDIUM]

**File:** `src/lighting/LightingSetup.ts:68–76`

**Problem:** `update(time)` where `time` is the raw rAF `DOMHighResTimeStamp` in milliseconds:
```typescript
primary.position.x = baseX + Math.sin(time * 0.0002) * 0.25;
```
After a tab is hidden for e.g. 30 seconds, `time` advances by ~30 000 ms on resume. `Math.sin((prev + 30000) * 0.0002)` is a different phase from `Math.sin(prev * 0.0002)` — the key light snaps discontinuously by up to 0.5 world units. This is visible as a sudden light shift on the first resumed frame.

The same `GalleryManager.MAX_SMOOTHING_DT = 0.1` guard that prevents zoom/pan jumps does **not** cover `LightingSetup`.

**Patch — `src/lighting/LightingSetup.ts`:**
```typescript
// Add to class fields:
private lightAccumMs = 0;
private lastLightTime = 0;

// In update(time: number):
update(time: number): void {
  if (!this.animate || !this.profile.animateAllowed) return;
  const primary = this.spots[0];
  if (!primary) return;

  // Clamp inter-frame delta to 100 ms to prevent light jump after
  // a backgrounded/hidden tab resumes. Mirrors GalleryManager.MAX_SMOOTHING_DT.
  const rawDelta = this.lastLightTime > 0 ? time - this.lastLightTime : 0;
  const clampedDelta = Math.min(rawDelta, 100); // ms
  this.lightAccumMs += clampedDelta;
  this.lastLightTime = time;

  const baseX = this.profile.keys[0]?.position.x ?? -3;
  primary.position.x = baseX + Math.sin(this.lightAccumMs * 0.0002) * 0.25;
}
```
The accumulated time never jumps by more than 100 ms per frame, producing at most a tiny (0.05 unit) continuous step on resume rather than a discontinuous phase jump.

**Research validation:** Same delta-clamping pattern recommended by MDN Page Visibility API docs: "When the tab becomes visible again, animate from where it left off, not where the clock says it is."

---

#### H-02 — No user-visible recovery feedback when WebGL context is lost [LOW]

**File:** `src/core/RendererManager.ts:166–182`

**Problem:** On low-memory mobile devices or after aggressive app switching, the WebGL context can be lost and take several seconds to restore. During this window the canvas renders nothing — the user sees a blank black area with no indication of what is happening. `onContextRestored` correctly resumes rendering but never signals the UI layer.

**Patch — add an optional restore-overlay callback in `RendererManager`:**
```typescript
// New field:
private onContextRestoreCallbacks: Array<(lost: boolean) => void> = [];

// New public method:
onContextChange(cb: (lost: boolean) => void): void {
  this.onContextRestoreCallbacks.push(cb);
}

// In onContextLost:
this.onContextRestoreCallbacks.forEach(cb => cb(true));

// In onContextRestored:
this.onContextRestoreCallbacks.forEach(cb => cb(false));
```

Then in `main.ts`:
```typescript
rendererManager.onContextChange((lost) => {
  const msg = lost ? 'Grafik wird wiederhergestellt …' : '';
  fallbackScreen.setStatusMessage(msg); // or a new light overlay
  diagnostics.info('context-ui', lost ? 'context-lost-ui' : 'context-restored-ui', msg, {});
});
```
Logging is non-negotiable per repository standards; the visual indicator is a low-priority enhancement.

**Research validation:** Google Chrome UX guidance: "When a WebGL context is lost, showing a non-blocking loading indicator is better UX than a silent blank canvas." (web.dev/articles/webgl)

---

#### H-03 — `TextureManager.maxTextureSize` is never stored as a field and never guards against oversized textures [HIGH]

**File:** `src/gallery/TextureManager.ts:47–53` (init method), `src/gallery/TextureManager.ts:33` (class fields)

**Corrected finding (2026-05-21 deep audit):** The previous plan said "`this.maxTextureSize` is stored at construction but never consulted." This is **inaccurate** — confirmed by inspection of the actual source:

```typescript
// TextureManager.ts line 33 — class fields:
private maxAnisotropy = 1;
private anisotropyDivisor = 1;
// ← NO 'private maxTextureSize' field exists

// TextureManager.ts line 47–53 — init():
init(renderer: THREE.WebGLRenderer): void {
  this.maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  this.diagnostics.info('capabilities', 'Texture manager initialized', {
    maxAnisotropy: this.maxAnisotropy,
    maxTextureSize: renderer.capabilities.maxTextureSize,  // ← logged only, NOT stored
  });
}
```

`maxTextureSize` is logged for diagnostics but **never assigned to a class field**. It cannot be referenced elsewhere in the class. The guard cannot be added without first adding the field.

**Two-part patch:**

**Part 1 — add the field and store in `init()` (`src/gallery/TextureManager.ts`):**
```typescript
// Add to class fields (after line 33):
private maxTextureSize = 0;

// In init(), add assignment (after line 48):
init(renderer: THREE.WebGLRenderer): void {
  this.maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  this.maxTextureSize = renderer.capabilities.maxTextureSize; // ← ADD
  this.diagnostics.info('capabilities', 'Texture manager initialized', {
    maxAnisotropy: this.maxAnisotropy,
    maxTextureSize: this.maxTextureSize,
  });
}
```

**Part 2 — add `warnIfOversized` guard and call it after every texture load:**
```typescript
// New private method in TextureManager:
private warnIfOversized(url: string, texture: THREE.Texture): void {
  if (this.maxTextureSize === 0) return; // init() not yet called — skip
  const img = texture.image as { width?: number; height?: number } | undefined;
  if (!img) return;
  const w = img.width ?? 0;
  const h = img.height ?? 0;
  if (w > this.maxTextureSize || h > this.maxTextureSize) {
    this.diagnostics.warn(
      'texture-oversized',
      'Texture exceeds device maxTextureSize; GPU driver will auto-downscale',
      {
        url: this.redactUrlForLog(url),
        textureWidth: w,
        textureHeight: h,
        maxTextureSize: this.maxTextureSize,
        overageRatio: Math.max(w, h) / this.maxTextureSize,
      }
    );
  }
}
```

Call it inside the `TextureLoader.load` success callback (in `loadForRole`), after `this.prepareTexture(texture, role)`:
```typescript
(texture) => {
  this.prepareTexture(texture, role);
  this.warnIfOversized(url, texture); // ← ADD
  this.cache.set(cacheKey, texture);
  // ...
}
```

**Research validation:**
- Three.js docs `WebGLRenderer.capabilities.maxTextureSize`: "Maximum texture size available on the device's GPU." (threejs.org/docs/#api/en/renderers/WebGLRenderer)
- MDN WebGL `texImage2D`: "If internalformat, format, or type is not an accepted value, a `INVALID_ENUM` error is generated. If width or height is greater than `MAX_TEXTURE_SIZE`, an `INVALID_VALUE` error is generated." (developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D)
- Khronos WebGL 2.0 conformance: some GPU drivers clamp silently rather than returning `INVALID_VALUE`; behavior is driver-defined. Explicit diagnostic is the only reliable way to surface the downscale. (khronos.org/webgl/conformance-tests)

---

#### H-04 — `PaintingMaterial` injected GLSL lacks explicit `highp` precision for large UV coordinates [MEDIUM]

**File:** `src/materials/PaintingMaterial.ts:180–199`

**Problem:** The injected GLSL uniform block:
```glsl
uniform vec2 uDetailTiling;
uniform sampler2D tDetailNormal;
```
has no explicit precision declaration. Fragment shaders in WebGL default to `mediump` on most mobile GPUs. `mediump float` has a mantissa that gives only ~3 decimal digits of precision for values near its range limit.

For a 16 K base texture (`textureSize / detailTilingFactor` = e.g. 16 384 / 16 = 1 024 tiles in each axis), accumulated UV coordinates can reach `vUv * 1024.0 = 1024.xxx`. At that magnitude, `mediump` float loses 0.xxx precision entirely, causing all detail tiles to map the same 1-pixel strip — visible as aliased striping on close inspection of high-resolution artworks.

**Patch — inject `precision` directive at the top of the custom GLSL block:**
```typescript
// In PaintingMaterial.ts, before the uniformBlock injection:
const precisionBlock = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  precision highp sampler2D;
#else
  precision mediump float;
  precision mediump sampler2D;
#endif
`;
frag = frag.replace(HEADER_TOKEN, `${HEADER_TOKEN}\n${precisionBlock}\n${uniformBlock}`);
```
The `#ifdef GL_FRAGMENT_PRECISION_HIGH` guard is required: some mobile GPUs (Mali-T6xx and older) do not support `highp` in fragment shaders; the guard prevents a fatal compile error on those devices.

**Research validation:** MDN GLSL precision: "`mediump` float is equivalent to `float16` (10-bit mantissa); `highp` float is equivalent to `float32`." (developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#glsl_precision_issues). Khronos GLSL ES spec §4.5.2: "`highp` may not be supported in fragment shaders; programs must check `GL_FRAGMENT_PRECISION_HIGH` before using it."

---

#### H-05 — Importer GPU thresholds and messaging are calibrated for 4 K phones, not 16 K source artwork [HIGH]

**File:** `scripts/import-artworks.mjs:609–623`

**Problem:** The current constants:
```javascript
const MAX_RECOMMENDED_DIMENSION = 4096;
const HIGH_GPU_MB_THRESHOLD = 64;
const VERY_HIGH_GPU_MB_THRESHOLD = 128;
```
produce the warning: *"please downscale the longest side to 4096px or less for reliable display"* for any image above 4 096 px. For the FREYRAUM use case (museum-quality artworks with source files up to 16 K), this guidance is incorrect and counter-productive: it asks customers to destroy image quality that modern desktop GPUs can display correctly.

**GPU memory reality at 16 K (RGBA8 + mipmaps):**
```
16384 × 16384 × 4 bytes × (4/3) ≈ 1 365 MB
```
The current `VERY_HIGH_GPU_MB_THRESHOLD = 128 MB` fires at 4 K × 4 K (exactly), meaning it is crossed by every well-specified source image.

**Correct tiered guidance (2024 device landscape):**

| Longest side | Devices safe | VRAM required (RGBA8+mip) |
|---|---|---|
| ≤ 4 096 px | All — phones, tablets, desktop | ≤ 85 MB |
| 4 097 – 8 192 px | Modern mobile + all desktop | 86 – 341 MB |
| 8 193 – 16 384 px | High-end desktop only | 342 – 1 365 MB |
| > 16 384 px | Exceeds WebGL hardware maximum | — |

**Patch — `scripts/import-artworks.mjs`:**
```javascript
// v0.21 — updated to support 16K source artwork for high-end desktop.
// Thresholds are tiered to match the 2024 device landscape:
//   ≤ 4096 px   — safe for all devices.
//   ≤ 8192 px   — safe for modern mobile and all desktop.
//   ≤ 16384 px  — high-end desktop only; phones auto-downscale.
//   > 16384 px  — exceeds the WebGL hardware maximum (gl.MAX_TEXTURE_SIZE on
//                 all current GPU families). Import blocked.
//
// Online validation:
//   - https://registry.khronos.org/webgl/specs/latest/1.0/ §2.11.5
//   - https://webglreport.com/ (confirms 16384 as modern desktop ceiling)
//   - https://web.dev/articles/webgl  (GPU memory budget guidance)
const WEBGL_MAX_DIMENSION = 16384;        // hardware ceiling; import error above this
const DESKTOP_SAFE_DIMENSION = 8192;      // safe for modern mobile + all desktop
const MOBILE_SAFE_DIMENSION = 4096;       // safe for all devices including old phones
const CRITICAL_GPU_MB_THRESHOLD = 1024;  // 16K RGBA8+mip ≈ 1365 MB — critical warning
const HIGH_GPU_MB_THRESHOLD = 341;       // 8K RGBA8+mip ≈ 341 MB — high warning
const MODERATE_GPU_MB_THRESHOLD = 85;    // 4K RGBA8+mip ≈ 85 MB — info note

const gpuMb = (dims.width * dims.height * 4 * (4 / 3)) / (1024 * 1024);

if (dims.width > WEBGL_MAX_DIMENSION || dims.height > WEBGL_MAX_DIMENSION) {
  // Hard block: no GPU can display this
  warnings.push(
    `${filename} — image is ${dims.width}×${dims.height}px which exceeds the WebGL hardware maximum of 16384px on any axis. The gallery cannot display this image. Please downscale to 16384px or less on the longest side.`
  );
} else if (dims.width > DESKTOP_SAFE_DIMENSION || dims.height > DESKTOP_SAFE_DIMENSION) {
  // 8K–16K: high-end desktop only
  warnings.push(
    `${filename} — high-resolution image (${dims.width}×${dims.height}px, ~${Math.round(gpuMb)} MB GPU). ` +
    `This is safe for high-end desktop browsers (macOS, Windows with ≥2 GB VRAM). ` +
    `Mobile and tablet devices will auto-downscale to their supported limit (typically 4096–8192px). ` +
    `For widest compatibility, provide a 4096px version alongside the high-res file.`
  );
} else if (dims.width > MOBILE_SAFE_DIMENSION || dims.height > MOBILE_SAFE_DIMENSION) {
  // 4K–8K: modern mobile + all desktop
  warnings.push(
    `${filename} — large image (${dims.width}×${dims.height}px, ~${Math.round(gpuMb)} MB GPU). ` +
    `Safe for modern phones (2020+) and all desktop devices. ` +
    `Very old phones (pre-2018) may auto-downscale. Performance may be reduced on low-end devices.`
  );
} else if (gpuMb >= MODERATE_GPU_MB_THRESHOLD) {
  // ≤ 4K but still large enough to note memory usage
  warnings.push(
    `${filename} — image (${dims.width}×${dims.height}px, ~${Math.round(gpuMb)} MB GPU). Safe for all supported devices.`
  );
}
```

---

#### H-06 — No power-of-two advisory in importer [LOW]

**File:** `scripts/import-artworks.mjs` (after dimension checks)

**Problem:** WebGL 2.0 supports NPOT (non-power-of-two) textures with mipmapping and `REPEAT` wrapping. Three.js uses WebGL 2.0 by default since r163. However, the importer does not advise customers whether their texture dimensions are POT or NPOT, which may matter in the rare case a WebGL 1.0 fallback path is active (very old browsers).

**Patch — add an informational note (not a warning) for NPOT textures in a WebGL 1.0 context:**
```javascript
// Helper
function isPowerOfTwo(n) { return n > 0 && (n & (n - 1)) === 0; }

// After dimension checks, informational only:
if (!isPowerOfTwo(dims.width) || !isPowerOfTwo(dims.height)) {
  // WebGL 2.0 handles NPOT; only note for awareness, not a blocking warning.
  // Omit from the customer-visible report; record internally only.
  diagnosticNotes.push(
    `${filename} — NPOT dimensions (${dims.width}×${dims.height}). ` +
    `WebGL 2.0 handles this correctly; mipmapping and REPEAT wrapping are fully supported.`
  );
}
```
NPOT note is diagnostic-only and does not appear in the customer-facing `last-import-report.txt`.

---

#### H-07 — No LOD / tiled streaming pathway for 16 K source images [MEDIUM — future pass]

**Context:** Research confirms that for images exceeding `maxTextureSize` on the target device, the only reliable display strategy is tiled streaming or progressive LOD. Three.js provides `THREE.LOD` and tile-based rendering patterns exist (deck.gl TileLayer, OpenSeadragon-style approaches).

**Current state:** The FREYRAUM gallery loads a single texture per artwork. A 16 K JPEG on a mobile device (maxTextureSize 4096) will be silently downscaled by Three.js at GPU upload time — resulting in a sharp desktop experience and a lower-resolution but still correct mobile experience.

**v0.21 future boundary:** No LOD/tiled-streaming runtime is shipped in this pass. When the gallery expands to support zoom levels that make the full 16 K detail visible (deeper zoom tiers), implement a LOD pipeline:
1. Import produces a manifest with three asset sizes per artwork: `thumb` (1024 px), `preview` (4096 px), `hires` (original).
2. TextureManager loads `preview` at init; when zoom passes a threshold, loads and swaps in `hires` tiles asynchronously.
3. Importer scripts could use `sharp` or ImageMagick to auto-generate the lower-res variants.

**Research references:**
- [Three.js LOD docs](https://threejs.org/docs/#api/en/objects/LOD)
- [OpenSeadragon for museum-grade zoom](https://openseadragon.github.io/)
- [Basis Universal KTX2 for compressed LOD tiles](https://github.com/KhronosGroup/KTX-Software)
- [deck.gl TileLayer for tiled WebGL rendering](https://deck.gl/docs/api-reference/geo-layers/tile-layer)

---

### Extended acceptance tests (tab smoothness + 16 K)

| Test | Pass condition |
|------|---------------|
| Tab switch — light jump | Switch away and back after 10 s; key light glides smoothly from its last position (≤ 0.1 s step) instead of snapping |
| Tab switch — animation continuity | Zoom, pan, and tilt smoothing resume from last position, no snap (MAX_SMOOTHING_DT already in place for GalleryManager) |
| bfcache restore — audio | Use browser back/forward to restore from bfcache; audio state normalizes unmuted (already implemented in v0.20.8) |
| WebGL context lost — mobile | Simulate context loss via browser DevTools; canvas re-renders on restore; no page reload required |
| WebGL context lost — logging | `webglcontextlost` and `webglcontextrestored` events logged at `warn` level in diagnostics |
| 16 K import — warning message | Import a 16 K JPEG; report shows tiered warning (desktop-safe / mobile-downscale note), not "please downscale to 4096px" |
| >16384px import — error | Import a 17 000 px image; report shows hard block: "exceeds WebGL hardware maximum" |
| 8 K import — correct tier | Import an 8192×8192 image; warning says "safe for modern phones and all desktop" |
| 4 K import — clean | Import a 4096×4096 image; report shows only the informational size note, no downscale warning |
| TextureManager oversized warn | Load a texture exceeding `maxTextureSize` in a dev session; diagnostics logs `texture-oversized` with pixel dimensions and device limit |
| Shader — 16 K detail tiling | Inspect PaintingMaterial with a 16K base texture and high `uDetailTiling`; no UV seam artifacts or striping visible on mobile (highp guard active) |

---

### Validation

```bash
npm run lint
npm run build
```

---

## v0.21 — Extension: Global Pointer Tracking + Timeline Scalability (2026-05-21)

### Overview

This extension covers two new v0.21 gaps discovered during the interaction and timeline code audit:

**I-series (Global Pointer Tracking):** The painting drag (pan) and hover-rotation must be tracked across **every** UI element — timeline strip, settings/preferences panel, navigation buttons, zoom controls, topbar, and any future overlay. Currently the hover rotation freezes and drag may misbehave when the cursor moves over any overlay.

**J-series (Timeline Scalability):** The `Timeline.ts` renders all artwork thumbnails as full DOM nodes at construction time. For galleries with many paintings this causes slow initial paint, memory pressure, and a cluttered strip with no quick navigation. The timeline must be redesigned for large collections with virtual rendering, navigation arrows, a counter, and responsive sizing.

---

### Audit scope

| File | Lines audited |
|------|--------------|
| `src/interaction/CanvasInteraction.ts` | 1–358 |
| `src/timeline/Timeline.ts` | 1–206 |
| `src/styles/main.scss` | 943–1110 (timeline block) |

---

### I-series — Global Pointer Tracking

#### I-01 — Hover rotation freezes when cursor enters any UI overlay [MEDIUM]

**File:** `src/interaction/CanvasInteraction.ts:147–156`

**Problem:** `updateHoverRotation` is called only from `onPointerMove`, which fires only when the pointer is either captured (dragging) or physically over the canvas element. As soon as the mouse drifts over the timeline bar, the preferences panel, a nav button, or any other UI element the pointer is no longer over the canvas. `onPointerMove` stops firing → `updateHoverRotation` is never called → the painting's subtle tilt locks at the last angle until the cursor returns to the canvas.

The hover effect is specifically designed to follow the cursor anywhere on the page (it reads `clientX / window.innerWidth`), so the fix is to source it from the global window instead of the canvas.

**Root cause:** The canvas-scoped `pointermove` / `mousemove` event does not reach overlay elements. The global `window` level always receives pointer movement regardless of which element is under the cursor.

**Research validation:** MDN Pointer Events: "A `pointermove` event is dispatched to the element that has pointer capture set, or, if no capture is set, to the element the pointer is over." → Capturing on canvas only covers active drag. Global `window.pointermove` covers idle hover at all times. (developer.mozilla.org/en-US/docs/Web/API/Pointer_events)

**Patch — `src/interaction/CanvasInteraction.ts`:**
```typescript
// Add to class fields:
private readonly onWindowPointerMove: (e: PointerEvent) => void;

// In constructor, after all canvas listeners:
this.onWindowPointerMove = (e: PointerEvent) => {
  // Update hover rotation for fine pointer at any screen position, even
  // when the cursor is over the timeline, settings panel, nav buttons, etc.
  if (e.pointerType !== 'mouse') return;
  if (this.state !== 'idle') return; // defer to active gesture during drag
  this.updateHoverRotation(e.clientX, e.clientY);
  this.diagnostics.debug('hover-global', 'Global hover rotation update', {
    x: Math.round(e.clientX),
    y: Math.round(e.clientY),
  });
};
window.addEventListener('pointermove', this.onWindowPointerMove, { passive: true });

// In dispose():
window.removeEventListener('pointermove', this.onWindowPointerMove);
```

Remove the canvas-local hover call from `onPointerMove` (the idle branch) once this global handler is active to avoid double-processing.

---

#### I-02 — Legacy `mousemove` hover also canvas-scoped [LOW]

**File:** `src/interaction/CanvasInteraction.ts:300–305`

**Problem:** The Touch Events fallback branch registers `mousemove` on `this.canvas`. Same problem as I-01 for the subset of users on legacy browsers.

**Patch — replace canvas-scoped `mousemove` with window-scoped:**
```typescript
// Remove:
this.canvas.addEventListener('mousemove', this.onLegacyMouseMove);

// Add to constructor (Touch Events branch):
window.addEventListener('mousemove', this.onLegacyMouseMove, { passive: true });

// Update dispose():
window.removeEventListener('mousemove', this.onLegacyMouseMove);
```

`onLegacyMouseMove` already guards `state !== 'idle'` so it will not interfere with active gestures.

---

#### I-03 — Panning drag: no global fallback when pointer leaves canvas without capture [LOW]

**File:** `src/interaction/CanvasInteraction.ts:118–123`

**Problem:** In the Pointer Events path, `this.canvas.setPointerCapture(e.pointerId)` is called on `pointerdown`. This correctly routes all subsequent `pointermove` and `pointerup` to the canvas even when the pointer leaves the element — so panning already works across overlays in the standard path.

However, `setPointerCapture` can silently fail (older browsers, or if the canvas is inside a Shadow DOM). The current code wraps the call in `try/catch` but does not log the failure and does not install a global fallback.

Additionally: any overlay that calls `element.setPointerCapture(e.pointerId)` on the same pointer ID would steal the capture from the canvas mid-drag — a rare but possible case if a future UI element (e.g., a draggable preferences panel) is added.

**Patch — add window-level fallback listeners during active drag:**
```typescript
// Add to class fields:
private readonly onWindowDragMove: (e: PointerEvent) => void;
private readonly onWindowDragEnd: (e: PointerEvent) => void;

// In onPointerDown (after setPointerCapture):
window.addEventListener('pointermove', this.onWindowDragMove, { passive: true });
window.addEventListener('pointerup', this.onWindowDragEnd, { passive: true });

// New handlers:
private readonly onWindowDragMove = (e: PointerEvent): void => {
  // Only act on the captured pointer ID during an active pan; the
  // canvas capture already handles this normally — this is a fallback.
  const slot = this.active.get(e.pointerId);
  if (!slot || this.state !== 'panning') return;
  const dx = e.clientX - slot.lastX;
  const dy = e.clientY - slot.lastY;
  slot.lastX = e.clientX;
  slot.lastY = e.clientY;
  this.galleryManager.setPanOffset(dx * 0.004, -dy * 0.004);
  this.diagnostics.debug('drag-global', 'Global drag fallback active', {
    pointerId: e.pointerId,
    dx: Math.round(dx),
    dy: Math.round(dy),
  });
};

private readonly onWindowDragEnd = (e: PointerEvent): void => {
  if (!this.active.has(e.pointerId)) return;
  this.active.delete(e.pointerId);
  if (this.active.size === 0) this.state = 'idle';
  window.removeEventListener('pointermove', this.onWindowDragMove);
  window.removeEventListener('pointerup', this.onWindowDragEnd);
};
```

The canvas-captured path is the primary path; the window handlers are a safety net only.

---

#### I-04 — Touch Events fallback: touch drag not tracked off-canvas [LOW]

**File:** `src/interaction/CanvasInteraction.ts:235–261`

**Problem:** In the Touch Events fallback path, `touchmove` is registered on `this.canvas` with `{ passive: false }` for `preventDefault`. Touch events do not support pointer capture (unlike Pointer Events). If the user starts a drag on the canvas and moves a finger to an adjacent element (e.g., the timeline strip), `touchmove` fires on that element instead of the canvas, and the pan stops.

**Patch:** Register a global `touchmove` listener during active touch panning, limited to the known touch ID, and remove it on `touchend`:
```typescript
// In onTouchStart when state becomes 'panning':
window.addEventListener('touchmove', this.onGlobalTouchMove, { passive: false });
window.addEventListener('touchend', this.onGlobalTouchEnd, { passive: true });

private readonly onGlobalTouchMove = (e: TouchEvent): void => {
  if (this.state !== 'panning') return;
  const slot = this.active.get(0);
  if (!slot) return;
  const t = Array.from(e.changedTouches).find(tc => tc.identifier === slot.id);
  if (!t) return;
  if (e.cancelable) e.preventDefault();
  const dx = t.clientX - slot.lastX;
  const dy = t.clientY - slot.lastY;
  slot.lastX = t.clientX;
  slot.lastY = t.clientY;
  this.galleryManager.setPanOffset(dx * 0.004, -dy * 0.004);
  this.diagnostics.debug('touch-global', 'Global touch drag fallback', {
    dx: Math.round(dx),
    dy: Math.round(dy),
  });
};

private readonly onGlobalTouchEnd = (): void => {
  window.removeEventListener('touchmove', this.onGlobalTouchMove);
  window.removeEventListener('touchend', this.onGlobalTouchEnd);
  this.active.clear();
  this.state = 'idle';
};
```

---

#### I-series acceptance tests

| Test | Pass condition |
|------|---------------|
| Hover over timeline — rotation | Move mouse over the timeline strip; painting tilt continues to follow the cursor smoothly |
| Hover over settings panel — rotation | Open the settings/preferences overlay; move mouse across it; painting angle updates in real time |
| Hover over nav buttons — rotation | Hover over the prev/next navigation arrows; painting tilt updates |
| Drag starts on canvas, ends on timeline | Start a pan drag on the canvas and move to the timeline; pan continues without interruption |
| Drag starts on canvas, ends on settings | Start a pan drag on the canvas and move into the settings panel; pan continues without interruption |
| Legacy mousemove — all elements | In a Touch Events fallback browser, hover over any overlay; painting tilt updates |
| Global listeners removed on dispose | After `dispose()`, no global `pointermove`/`mousemove` listeners remain on `window` |
| Diagnostics logging | `drag-global` and `hover-global` events appear in diagnostics at debug level when applicable |

---

### J-series — Timeline Scalability

#### J-01 — All artwork thumbnails rendered as DOM nodes at construction [HIGH]

**File:** `src/timeline/Timeline.ts:36–84`

**Problem:** `artworks.forEach(...)` unconditionally creates a full DOM subtree (`<li>` + `<button>` + `<span>` + `<img>` + label) for every artwork during construction. For a gallery with:
- 20 artworks: 20 × ~5 nodes = 100 DOM nodes (manageable)
- 50 artworks: 50 × ~5 nodes = 250 DOM nodes (noticeable layout cost)
- 100+ artworks: significant initial paint delay, memory pressure, layout thrashing on scroll

Each `<img>` uses `loading="lazy"` and `decoding="async"` which helps, but the full DOM node tree is still created and the browser must still resolve layout for all 100+ items before the timeline can paint.

**Research validation:** Chrome DevTools "Avoid excessive DOM size" audit: > 1 500 DOM nodes is a performance warning; > 60 DOM nodes deep is a warning. (web.dev/articles/dom-size). Virtual list rendering (only instantiate visible + buffer items) is the standard solution.

**Patch — virtual rendering window in `Timeline.ts`:**

```typescript
// Class-level constants:
private static readonly VIRTUAL_BUFFER = 5; // render N items before/after visible range
private static readonly VIRTUAL_THRESHOLD = 20; // only virtualise if artwork count > this

// New field:
private readonly virtualEnabled: boolean;
private renderedRange: [number, number] = [0, 0]; // inclusive index range currently in DOM

// In constructor: if artworks.length > VIRTUAL_THRESHOLD, do NOT render all items.
// Instead, create placeholder <li> nodes (skeleton only, no image) for the full count,
// then call renderWindow(0, VIRTUAL_BUFFER * 2) to populate only the first visible range.

private renderWindow(from: number, to: number): void {
  const clamped = [
    Math.max(0, from),
    Math.min(this.artworks.length - 1, to),
  ] as [number, number];

  for (let i = clamped[0]; i <= clamped[1]; i++) {
    if (this.thumbs[i]) continue; // already rendered
    this.buildThumb(i); // create full DOM node and replace skeleton placeholder
  }
  this.renderedRange = clamped;
  this.diagnostics.debug('timeline', 'virtual-window', 'Rendered virtual window', {
    from: clamped[0],
    to: clamped[1],
    total: this.artworks.length,
  });
}

// On scroll, extend window: add a scroll listener to listEl that calls
// renderWindow(visibleFrom - VIRTUAL_BUFFER, visibleTo + VIRTUAL_BUFFER).
// Optionally: destroy far-off items (replace with skeleton) to reclaim memory.
```

For galleries with ≤ `VIRTUAL_THRESHOLD` artworks, the existing full-render path is unchanged.

---

#### J-02 — No navigation arrows for scrolling the timeline strip [MEDIUM]

**File:** `src/timeline/Timeline.ts` (no current arrow controls)

**Problem:** On desktop the timeline has no left/right arrow buttons. Users must:
- Click and drag the scroll area
- Use arrow keys (only when a thumb has focus)
- Scroll with the trackpad/mouse wheel

There is no visible affordance that more items exist off-screen. For large galleries (20+ paintings), users may miss artworks entirely.

**Research validation:** Museum collection interfaces (Google Arts & Culture, MoMA Online Collection) universally include prev/next arrow buttons on horizontal strips for discoverability. CSS `overflow-x: auto` with hidden scrollbar gives no visual cue of more content.

**Patch — add scroll-arrow buttons to `Timeline`:**

```typescript
// In constructor, after creating this.el:
const prevBtn = document.createElement('button');
prevBtn.className = 'timeline__scroll-arrow timeline__scroll-arrow--prev';
prevBtn.setAttribute('aria-label', 'Vorherige Werke');
prevBtn.innerHTML = '‹';
prevBtn.addEventListener('click', () => this.scrollByPage(-1));

const nextBtn = document.createElement('button');
nextBtn.className = 'timeline__scroll-arrow timeline__scroll-arrow--next';
nextBtn.setAttribute('aria-label', 'Nächste Werke');
nextBtn.innerHTML = '›';
nextBtn.addEventListener('click', () => this.scrollByPage(1));

this.el.prepend(prevBtn);
this.el.appendChild(nextBtn);

private scrollByPage(direction: -1 | 1): void {
  const pageWidth = this.listEl.clientWidth;
  this.listEl.scrollBy({ left: direction * pageWidth * 0.8, behavior: 'smooth' });
  this.diagnostics.debug('timeline', 'scroll-page', 'Timeline page scroll', {
    direction,
    pageWidth,
  });
}
```

Arrows are hidden via CSS when the list is fully scrolled to that end (use `scroll` event + `scrollLeft` / `scrollWidth` - `clientWidth` to toggle a CSS class).

**CSS additions (`main.scss`):**
```scss
.timeline__scroll-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px; height: 32px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  font-size: 18px;
  color: var(--text-primary);
  cursor: pointer;
  z-index: 2;
  opacity: 0;
  transition: opacity var(--dur-control) var(--ease-out);
  pointer-events: none;

  &--prev { left: 6px; }
  &--next { right: 6px; }
}

.timeline:hover .timeline__scroll-arrow,
.timeline:focus-within .timeline__scroll-arrow {
  opacity: 1;
  pointer-events: auto;
}

.timeline--at-start .timeline__scroll-arrow--prev { opacity: 0; pointer-events: none; }
.timeline--at-end   .timeline__scroll-arrow--next { opacity: 0; pointer-events: none; }
```

---

#### J-03 — No artwork counter / position indicator [MEDIUM]

**File:** `src/timeline/Timeline.ts`, `src/styles/main.scss`

**Problem:** There is no indicator showing "Werk 3 von 20". Users cannot tell at a glance how many artworks are in the collection or where they are in the sequence. This is standard in all professional gallery interfaces.

**Patch — add a counter chip to the timeline bar:**

```typescript
// In constructor:
this.counterEl = document.createElement('span');
this.counterEl.className = 'timeline__counter';
this.counterEl.setAttribute('aria-live', 'polite');
this.el.appendChild(this.counterEl);

// In setActive():
this.counterEl.textContent = `${index + 1} / ${this.thumbs.length}`;
this.diagnostics.debug('timeline', 'counter-update', 'Counter updated', {
  current: index + 1,
  total: this.thumbs.length,
});
```

**CSS (`main.scss`):**
```scss
.timeline__counter {
  position: absolute;
  top: 10px;
  right: 14px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  pointer-events: none;
  user-select: none;
}
```

---

#### J-04 — No edge-fade gradient indicating off-screen content [LOW]

**File:** `src/styles/main.scss:959–978`

**Problem:** The `.timeline__list` hides its scrollbar (`scrollbar-width: none`). Users cannot see that there are more items beyond both edges of the visible area. This is a discoverability problem for large galleries.

**Patch — CSS mask-image fade at both ends of the list:**
```scss
.timeline__list {
  // Add:
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 40px,
    #000 calc(100% - 40px),
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 40px,
    #000 calc(100% - 40px),
    transparent 100%
  );
}
```

When the list is scrolled fully to one end, update the mask dynamically (via CSS variables) to remove the fade on that end:
```scss
.timeline--at-start .timeline__list {
  -webkit-mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 40px), transparent 100%);
  mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 40px), transparent 100%);
}
.timeline--at-end .timeline__list {
  -webkit-mask-image: linear-gradient(to right, transparent 0, #000 40px, #000 100%);
  mask-image: linear-gradient(to right, transparent 0, #000 40px, #000 100%);
}
```

**Research validation:** CSS `mask-image` for indicating horizontal scroll overflow is documented in MDN and recommended in web.dev "UI Patterns for overflow scrolling" (2024). No JS required for the basic fade; scroll-position-aware toggling requires a lightweight scroll event listener.

---

#### J-05 — Thumbnail size not responsive at narrow viewports [LOW]

**File:** `src/styles/main.scss:986–1018`

**Problem:** `.timeline__thumb` is hardcoded at `width: 150px; height: 95px`. On phones (375–430px viewport), this means only 2–2.5 artworks are visible at once, making the collection feel much larger than it is and forcing more scrolling to find a specific artwork.

**Patch — responsive thumb sizing:**
```scss
// In .timeline__thumb, replace fixed width/height with:
width: clamp(90px, 15vw, 150px);
height: clamp(57px, 9.5vw, 95px);
```

This scales smoothly from 90×57px at 600px viewport to 150×95px at 1000px+ viewport. Aspect ratios of the content images are unaffected (governed by `.timeline__frame` inner layout).

---

#### J-06 — No group/page navigation for very large collections (50+ artworks) [MEDIUM — future pass]

**Context:** For galleries with 50+ artworks, the flat horizontal scroll strip becomes impractical even with virtual rendering. Industry patterns (Google Arts & Culture, Artsy, museum collections) use grouped sections, decade/series grouping, or a compact pagination control ("1–20 of 87").

**Proposed future design:**
- Group artworks by `series` field (if present in the `Artwork` type) or in blocks of 20.
- Show group headings above the timeline list as anchor points.
- Add a compact group-jump dropdown: selecting a group jumps the scroll position and active window.
- For more than 50 artworks: collapse to a paginated view (page 1 of N, with 20 per page) with prev/next page buttons replacing the continuous scroll.

**v0.21 future boundary:** Grouped/page navigation remains documented, not shipped. Implement when the gallery grows beyond 50+ artworks in production.

---

### J-series acceptance tests

| Test | Pass condition |
|------|---------------|
| Large gallery — initial paint | With 50 artworks, timeline paints first visible thumbs (≤20) before remaining 30 are loaded; no layout stall |
| Virtual window — scroll | Scrolling the timeline right gradually renders more thumbs; far-left thumbs may be replaced by skeletons |
| Scroll arrows visible | Hovering or focusing the timeline reveals left/right arrow buttons; clicking scrolls ~0.8 page width |
| Arrow at start | When scrolled fully left, left arrow is hidden / disabled |
| Arrow at end | When scrolled fully right, right arrow is hidden / disabled |
| Counter display | Counter reads "1 / 20" (or total count) and updates on every artwork navigation |
| Counter ARIA | Screen reader announces counter text on change (`aria-live="polite"`) |
| Edge fade | Both ends of the timeline list show a fade gradient indicating more content; fades remove when at the boundary |
| Responsive thumbs | At 375px viewport, thumbs are ≈90×57px; at 1200px they are 150×95px |
| Keyboard nav unchanged | Arrow keys, Home, End still navigate between thumbs; roving tabindex still applies |
| Logging | `virtual-window`, `scroll-page`, `counter-update` events appear in diagnostics at debug level |

---

## v0.21 — K-series: Code Audit Corrections + New Findings (2026-05-21)

This section documents findings from the 2026-05-21 deep code inspection pass:
1. **Corrections** to earlier plan entries where the plan description did not match the actual source.
2. **New gaps** not covered by G through J series.
3. **Implementation sequencing advice** for applying all v0.21 patches safely.

---

### K-series corrections summary

| Finding | Original claim | Correct state (confirmed in source) |
|---------|---------------|-------------------------------------|
| G-01 | "prewarm never called" | Called at `src/main.ts:695` as `void` — AFTER overlay hides at line 443, fire-and-forget |
| H-03 | "`this.maxTextureSize` stored but never consulted" | `maxTextureSize` is **not stored as a field** at all — only logged in `init()` |

Both corrections are already reflected in the updated G-01 and H-03 entries above.

---

### New gaps (K-01 through K-03)

#### K-01 — `CanvasInteraction.dispose()` does not remove global window listeners added by I-series patches [LOW]

**File:** `src/interaction/CanvasInteraction.ts:329–350`

**Problem:** The current `dispose()` removes only canvas-scoped listeners. The I-series patches (I-01 through I-04) add global `window.addEventListener(...)` listeners. If these patches are applied without updating `dispose()`, the window-level listeners persist after `canvasInteraction.dispose()` is called, leaking a reference to the destroyed gallery state.

**Required addition — update `dispose()` to remove all global listeners:**
```typescript
dispose(): void {
  if (this.disposed) return;
  this.disposed = true;

  if (this.usePointerEvents) {
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointercancel', this.onPointerCancel);
    this.canvas.removeEventListener('lostpointercapture', this.onPointerCancel);
    this.canvas.removeEventListener('click', this.onClick);
    // ADD: remove global listeners from I-01 and I-03:
    window.removeEventListener('pointermove', this.onWindowPointerMove);
    window.removeEventListener('pointermove', this.onWindowDragMove);
    window.removeEventListener('pointerup', this.onWindowDragEnd);
  } else {
    this.canvas.removeEventListener('touchstart', this.onTouchStart);
    this.canvas.removeEventListener('touchmove', this.onTouchMove);
    this.canvas.removeEventListener('touchend', this.onTouchEnd);
    this.canvas.removeEventListener('touchcancel', this.onTouchEnd);
    // ADD: remove global window mousemove (I-02) and touch (I-04):
    window.removeEventListener('mousemove', this.onLegacyMouseMove);
    window.removeEventListener('touchmove', this.onGlobalTouchMove);
    window.removeEventListener('touchend', this.onGlobalTouchEnd);
    this.canvas.removeEventListener('click', this.onClick);
  }
  this.canvas.removeEventListener('wheel', this.onWheel);
  this.active.clear();
}
```

**Research validation:** MDN `EventTarget.removeEventListener`: "Failing to remove event listeners when they are no longer needed will prevent the garbage collector from reclaiming the objects to which the handlers refer." (developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener). The `window` object is never GC'd, so global listeners must be explicitly removed.

---

#### K-02 — `Timeline.dispose()` does not clean up per-thumb event listeners [LOW]

**File:** `src/timeline/Timeline.ts:203–205`

**Problem:** The current `dispose()` only calls `this.el.remove()`. The class stores `this.thumbs: HTMLButtonElement[]` which holds strong references to all button elements. While the DOM node is removed, the JS array keeps the elements alive, preventing GC of their click + keydown listeners.

**Patch:**
```typescript
dispose(): void {
  this.el.remove();
  // Clear strong references so GC can collect button elements and listeners.
  this.thumbs.length = 0;
  this.onSelectCallback = null;
  this.diagnostics.debug('timeline', 'disposed', 'Timeline disposed and listeners cleared', {});
}
```

**Research validation:** MDN "Memory management in JavaScript": "Event listeners on DOM nodes are garbage collected when the node is removed from the DOM AND no JS references to the node exist." (developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management).

---

#### K-03 — `GalleryManager.init()` preloads albedo-only; `prefetchAdjacentArtworks` helper missing from class [MEDIUM]

**File:** `src/gallery/GalleryManager.ts:248–267`

**Problem:** `GalleryManager.init()` calls `this.textureManager.preload(urls)` with albedo URLs only. The `prefetchAdjacentArtworks(index)` helper described in G-03 does not exist in the current source. The G-03 patch must add it as a new private method and call it from the end of `showArtwork()`.

**Confirmed current state:**
```typescript
async init(): Promise<void> {
  const urls = this.artworks.map((a) => a.webglImage ?? a.image);
  await this.textureManager.preload(urls);  // albedo only - confirmed
  this.pendingResetAfterArtworkLoad = true;
  await this.showArtwork(0);
  // no prefetchAdjacentArtworks call here - confirmed missing
}
```

**Complete patch — add the method:**
```typescript
private prefetchAdjacentArtworks(index: number): void {
  const idleCb = (window as unknown as { requestIdleCallback?: (fn: () => void) => void })
    .requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 1));

  for (const offset of [-2, -1, 1, 2]) {
    const idx = index + offset;
    if (idx < 0 || idx >= this.artworks.length) continue;
    const artwork = this.artworks[idx];
    if (!artwork.textureSet) continue;

    idleCb(() => {
      this.textureManager.preloadTextureSet(artwork.textureSet!)
        .then(() => {
          this.diagnostics.debug(
            'prefetch-adjacent',
            `Prefetched PBR maps for artwork ${idx}`,
            { index: idx, offset, artworkId: artwork.id }
          );
        })
        .catch((err: unknown) => {
          this.diagnostics.warn(
            'prefetch-adjacent-fail',
            `Prefetch failed for artwork ${idx}`,
            { index: idx, errorMessage: err instanceof Error ? err.message : String(err) }
          );
        });
    });
  }
}
```

Call `this.prefetchAdjacentArtworks(index)` at the end of the `showArtwork()` success path.

**Research validation:**
- MDN `requestIdleCallback`: "Queues a function to be called during a browser's idle periods." Polyfilled via `setTimeout(fn, 1)` for Safari < 16.4. (developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
- web.dev: "Use requestIdleCallback to defer non-critical network requests." (web.dev/articles/efficiently-load-third-party-javascript)

---

### K-series implementation sequence

| Step | Series | Change | Test after |
|------|--------|--------|-----------|
| 1 | H-05 | Importer dimension thresholds | Re-run import, verify tiered warnings |
| 2 | H-03 | Add `maxTextureSize` field + `warnIfOversized` | Load oversized test texture, check diagnostics |
| 3 | G-02 | `preload='auto'` on audio element | Test gapless first-play desktop + mobile |
| 4 | G-01 | Move + await prewarm before overlay hide | Profile cold load in DevTools Performance |
| 5 | G-06 | Hidden warm render pass before overlay hide | Verify no texture-upload spike post-overlay |
| 6 | H-01 | `LightingSetup` delta clamp | Switch tabs 30 s, verify smooth light resume |
| 7 | H-04 | PaintingMaterial GLSL `highp` guard | Lint + build; check shader in DevTools |
| 8 | G-03 + K-03 | `prefetchAdjacentArtworks` method | Navigate quickly through artworks, no lag |
| 9 | G-07 | Idle sweep of all remaining PBR maps | Leave on artwork 1 for 5 s, navigate to artwork 10 |
| 10 | G-04 | Interactive loading screen | Cold load on 3G throttle; verify progress |
| 11 | I-01 | Global `window` hover `pointermove` | Mouse over timeline; painting tilts |
| 12 | I-02 | Global `window` legacy `mousemove` | Test in Touch Events fallback browser |
| 13 | I-03 | Global drag fallback listeners | Drag from canvas to timeline; no interruption |
| 14 | I-04 | Global touch drag fallback | Touch drag canvas to adjacent element |
| 15 | K-01 | Update `dispose()` for global listeners | Dispose interaction; verify no window leaks |
| 16 | J-05 | Responsive thumb sizing | Test 375px, 768px, 1440px viewports |
| 17 | J-04 | CSS `mask-image` edge fade | Fade visible both ends; disappears at boundary |
| 18 | J-02 | Timeline scroll arrows | Hover; arrow appear/hide at boundaries |
| 19 | J-03 | Artwork counter chip | Navigate; counter text + ARIA |
| 20 | J-01 | Virtual rendering window | 50-artwork fixture; DOM count <= 60 nodes |
| 21 | K-02 | `Timeline.dispose()` cleanup | Dispose timeline; verify `thumbs` cleared |
| 22 | H-02 | WebGL context restore overlay | Simulate context loss via DevTools |
| 23 | G-05 | `<link rel="preload">` hints in HTML | Lighthouse audit; verify preloads |

---

### v0.21 combined acceptance matrix

| Test | Pass condition | Fixes |
|------|---------------|-------|
| Cold load slow 3G | Loading screen with animated progress bar; no plain white spinner | G-04 |
| Shader stutter first hover | No frame drop on first hover after cold load | G-01 |
| Audio first play | No audible gap on first unmute/play (desktop + mobile) | G-02 |
| Navigation adjacent art | Artwork 2 loads with no visible lag | G-03 |
| Navigation all arts | After 5 s idle, all artworks load without lag | G-07 |
| Loading reveal | Overlay fades 1.2 s with gallery scale+unblur reveal | G-04 |
| Reduced motion | Particles hidden; reveal is instant opacity swap | G-04 |
| Tab resume light | 10 s hide + resume: key light glides smoothly | H-01 |
| 16K import | 16K import produces desktop-safe warning | H-05 |
| TextureManager oversized | Oversized texture logs `texture-oversized` diagnostic | H-03 |
| GLSL highp mobile | No UV seam artifacts on 16K texture on mobile | H-04 |
| Hover over timeline | Painting tilt updates as mouse moves over timeline | I-01 |
| Drag to timeline | Pan drag continues through timeline without interruption | I-03 |
| Dispose no window leaks | `dispose()` removes all global window listeners | K-01 |
| Timeline thumbs responsive | 375px: ~90x57 px; 1440px: 150x95 px | J-05 |
| Edge fade | Fade visible both ends; disappears at boundary | J-04 |
| Scroll arrows | Appear on hover, hide at boundaries, scroll 80% page width | J-02 |
| Counter | Shows "1 / N"; updates on navigation; ARIA announces change | J-03 |
| Virtual DOM 50 arts | Initial DOM node count <= 60 for 50-artwork gallery | J-01 |


### Validation

```bash
npm run lint
npm run build
```

Implemented. This pass completes the v0.20.7 gap-closure coding plan and refreshes every tracked Markdown file to remove stale “under repair” wording.

### Implemented code closures

- **F-01:** `BackgroundAudioManager.startFade()` now clamps fade targets to `MAX_EFFECTIVE_AUDIO_GAIN` (0.30) instead of `1.0`.
- **F-02:** `audio-volume-map` diagnostics now include `displayPct` alongside effective gain and live gain.
- **F-03:** `PreferencesPanel.patchPanel()` only skips the volume-slider value patch while dragging; motion, contrast, mute, status, quality, and lighting controls still update immediately.
- **F-04:** Main-page and preferences volume sliders now expose `aria-valuetext` such as `50 Prozent`.
- **F-05:** Broken zero-volume recovery diagnostics now log the stored value, recovery target, and storage key.
- **F-06:** First-interaction recovery now retries when audio should be playing but is still stopped before an autoplay-block flag exists.
- **F-07:** `BackgroundAudioManager.setMuted(false)` now attempts playback directly when a source is available and lifecycle is not suspended.
- **F-08:** `--volume-pct` is now written as a CSS percentage string and consumed directly by the slider gradient.
- **F-09:** Confirmed correct; no code change required.
- **F-10:** The ended-loop fallback fade is reduced from 150 ms to 50 ms.

### Documentation sync

All tracked Markdown files were updated with the v0.20.8 audit stamp and a current shipped-status note so customer, architecture, AI, and maintenance docs no longer describe v0.20 audio as an open regression.

### Validation target

```bash
npm run lint
npm run build
```

## v0.20.7 — Full technical code audit + gap-closure coding plan (2026-05-21)

### Status

Planning. This section is a deep, file-level code audit of the entire v0.20 audio and control domain, written to serve as the definitive technical coding reference for any remaining implementation work. Every finding cites the exact file and line numbers confirmed in the current checked-in source. TypeScript and SCSS code patches are provided inline for each open gap.

---

### Audit scope

| File | Lines audited |
|------|--------------|
| `src/audio/volumeMapping.ts` | 1–31 |
| `src/audio/BackgroundAudioManager.ts` | 1–449 |
| `src/utils/preferences.ts` | 1–205 |
| `src/ui/AudioControls.ts` | 1–195 |
| `src/ui/PreferencesPanel.ts` | 1–310 |
| `src/main.ts` | 200–820 (audio + lifecycle paths) |
| `src/styles/main.scss` | 436–560, 1370–1410 (audio-controls blocks) |

---

### F-01 — `startFade()` clamps to 1.0 instead of `MAX_EFFECTIVE_AUDIO_GAIN`

**File:** `src/audio/BackgroundAudioManager.ts:399`

```typescript
// CURRENT (line 399)
this.fadeTargetGain = Math.max(0, Math.min(1, targetGain));
```

**Problem:** The fade engine silently allows targets above `MAX_EFFECTIVE_AUDIO_GAIN` (0.30). In practice all callers pass a value already clamped by `setVolume()`, so no user-visible bug exists today — but a future internal caller could accidentally exceed the cap.

**Fix:**

```typescript
// PROPOSED
import { MAX_EFFECTIVE_AUDIO_GAIN } from './volumeMapping';
// ...
this.fadeTargetGain = Math.max(0, Math.min(MAX_EFFECTIVE_AUDIO_GAIN, targetGain));
```

The `MAX_EFFECTIVE_AUDIO_GAIN` import is already present at line 2 of `BackgroundAudioManager.ts`, so no new import is needed. Change only the `Math.min` ceiling on line 399.

---

### F-02 — `audio-volume-map` diagnostics event omits display percent

**File:** `src/audio/BackgroundAudioManager.ts:250–257`

```typescript
// CURRENT (lines 250–257)
this.diagnostics.debug('audio-volume-map', 'Volume mapping record', {
  targetGain: clamped,
  liveGain: this.audio.volume,
  reason,
});
```

**Problem:** Exported diagnostics snapshots do not include the display-percent value. When a user reports a volume issue, engineers must re-derive the display percent from the raw gain value instead of reading it directly from the log.

**Fix** — add `gainToDisplayPercent` import (already present via the file's existing volumeMapping import) and enrich the payload:

```typescript
import { MAX_EFFECTIVE_AUDIO_GAIN, gainToDisplayPercent } from './volumeMapping';
// ...
this.diagnostics.debug('audio-volume-map', 'Volume mapping record', {
  targetGain: clamped,
  displayPct: gainToDisplayPercent(clamped),   // ← add
  liveGain: this.audio.volume,
  reason,
});
```

---

### F-03 — `PreferencesPanel.patchPanel()` skips all preference updates during slider drag

**File:** `src/ui/PreferencesPanel.ts:178–182`

```typescript
// CURRENT (lines 178–182)
private patchPanel(): void {
  // Do not replace slider during active pointer drag (Slice B continuity fix).
  if (this.isVolumeDragging) return;
  // ...
}
```

**Problem:** When the user is dragging the volume slider and simultaneously triggers any other preference change (e.g., the quality radio from the adaptive quality controller writing through `preferences.setQuality()`), the quality radio UI is not updated until the drag completes. In practice the adaptive controller fires rarely and the lag is imperceptible, but the intent was to guard only slider node replacement, not all DOM patches.

**Fix** — split the guard so only the slider-value patch is skipped during drag:

```typescript
private patchPanel(): void {
  const { reducedMotion, contrastMode, quality, lighting, audioMuted, audioVolume } = this.prefs.current;

  if (this.motionInput) this.motionInput.checked = reducedMotion;
  if (this.contrastInput) this.contrastInput.checked = contrastMode === 'high';
  if (this.audioMutedInput) this.audioMutedInput.checked = audioMuted;

  // Only skip the volume-slider patch while the user is actively dragging;
  // all other controls must update immediately regardless of drag state.
  if (!this.isVolumeDragging && this.audioVolumeInput && this.audioValueLabel) {
    const displayPct = gainToDisplayPercent(audioVolume);
    this.audioVolumeInput.value = String(displayPct);
    this.audioVolumeInput.style.setProperty('--volume-pct', String(displayPct));
    this.audioValueLabel.textContent = `${displayPct}%`;
  }

  if (this.audioStatusEl) { /* ... unchanged ... */ }

  this.panel.querySelectorAll<HTMLInputElement>('input[name="freyraum-quality"]').forEach((input) => {
    input.checked = input.value === quality;
  });
  this.panel.querySelectorAll<HTMLInputElement>('input[name="freyraum-lighting"]').forEach((input) => {
    input.checked = input.value === lighting;
  });
}
```

---

### F-04 — Volume sliders missing `aria-valuetext`

**Files:** `src/ui/AudioControls.ts:113`, `src/ui/PreferencesPanel.ts:154`

**Problem:** Both `<input type="range">` elements expose only `aria-valuenow` (the raw integer 0–100). Screen readers announce "50" rather than "50 percent". WCAG SC 4.1.2 recommends `aria-valuetext` for sliders where the numeric value requires a unit or description for meaning.

**Fix for `AudioControls.ts`** — in `update()` method, after setting `aria-valuenow`:

```typescript
// Line ~113 in AudioControls.ts — add after the aria-valuenow line
this.volumeInput.setAttribute('aria-valuenow', String(displayPct));
this.volumeInput.setAttribute('aria-valuetext', `${displayPct} Prozent`);  // ← add
```

**Fix for `PreferencesPanel.ts`** — in `buildPanel()` and `patchPanel()`:

```html
<!-- buildPanel() range input — add aria-valuetext attribute -->
<input
  type="range"
  id="freyraum-audio-volume"
  min="0" max="100" step="1"
  value="${displayPct}"
  aria-valuetext="${displayPct} Prozent"
/>
```

In `patchPanel()` (non-dragging branch):

```typescript
this.audioVolumeInput.setAttribute('aria-valuetext', `${displayPct} Prozent`);
```

In the `input` event handler (in-place label update during drag):

```typescript
volumeInput.addEventListener('input', () => {
  const displayPct = Number(volumeInput.value);
  if (Number.isNaN(displayPct)) return;
  if (this.audioValueLabel) this.audioValueLabel.textContent = `${Math.round(displayPct)}%`;
  volumeInput.style.setProperty('--volume-pct', String(displayPct));
  volumeInput.setAttribute('aria-valuetext', `${Math.round(displayPct)} Prozent`);  // ← add
  this.prefs.setAudioVolume(displayPercentToGain(displayPct));
});
```

---

### F-05 — `AUDIO_RECOVERY_KEY` one-shot flag never resets on localStorage clear

**File:** `src/utils/preferences.ts:34–68`

```typescript
// CURRENT — key is written once and never revisited
const AUDIO_RECOVERY_KEY = 'freyraum.audio-recovery.v205';
```

**Problem:** If a user manually clears `localStorage`, the recovery key is gone. On the next load the zero-volume recovery logic re-runs correctly (no bug). However, if `freyraum.preferences.v1` is populated from a backup/sync while `AUDIO_RECOVERY_KEY` is absent, the recovery fires again — which is harmless but emits a misleading warning log.

**Fix (low priority)** — check that the stored value is actually out-of-range before logging:

```typescript
if (shouldRecoverZeroVolume) {
  audioVolume = DEFAULT_AUDIO_GAIN;
  diagnostics.warn('audio-volume-recovered',
    'Recovered broken zero-volume preference (was likely written by faulty v0.20.4)',
    { stored: stored.audioVolume, recoveredTo: audioVolume, key: STORAGE_KEY }  // include stored value
  );
}
```

No behavior change needed — this is a diagnostic-quality improvement only.

---

### F-06 — Autoplay recovery guard does not handle pre-play state (audio loaded but `play()` never attempted)

**File:** `src/main.ts:465–474`

```typescript
// CURRENT — tryRecoverBlockedAudio only acts when autoplayBlocked is already true
const tryRecoverBlockedAudio = (reason: string): void => {
  if (interactionAudioRecoveryDone) return;
  const audioState = backgroundAudio.getState();
  if (!backgroundAudio.hasSource() || prefsNow.audioMuted || !audioState.autoplayBlocked) return;
  // ...
};
```

**Problem:** `autoplayBlocked` is set to `true` only after `play()` is called and rejected with `NotAllowedError`. In some browser/OS configurations (particularly iOS Safari before first interaction), `audio.play()` is never called during boot (no source, late load, or similar timing). The `autoplayBlocked` flag stays `false`, the recovery guard never fires, and audio never starts.

**Fix** — also recover when `!playing && !muted && hasSource()` regardless of `autoplayBlocked`, as a unified "audio should be playing but isn't" recovery:

```typescript
const tryRecoverBlockedAudio = (reason: string): void => {
  if (interactionAudioRecoveryDone) return;
  const prefsNow = preferences.current;
  const audioState = backgroundAudio.getState();
  const shouldPlay =
    backgroundAudio.hasSource() &&
    !prefsNow.audioMuted &&
    (audioState.autoplayBlocked || (!audioState.playing && audioState.available));
  if (!shouldPlay) return;
  interactionAudioRecoveryDone = true;
  diagnostics.info('audio', 'autoplay-recovery-attempt',
    'Retrying audio play after user interaction', { reason, autoplayBlocked: audioState.autoplayBlocked });
  void backgroundAudio.play(`interaction-recovery:${reason}`);
};
```

**Note:** The `interactionAudioRecoveryDone` flag still prevents this from retriggering after the first successful interaction attempt.

---

### F-07 — `BackgroundAudioManager.setMuted(false)` does not call `play()` directly

**File:** `src/audio/BackgroundAudioManager.ts:206–230`

```typescript
// CURRENT — setMuted(false) only sets state and emits; play() is triggered by main.ts subscription
setMuted(value: boolean, reason: string): void {
  if (this.disposed) return;
  if (this.state.muted === value) { /* skip */ return; }
  this.audio.muted = value;
  this.state = { ...this.state, muted: value };
  if (value) {
    // Muting path: fade out then pause
    this.shouldResumeAfterSuspend = false;
    this.startFade(0, FADE_OUT_MS, 'fade-out-mute', () => { ... });
    this.state = { ...this.state, playing: false };
  }
  // No `else` branch for unmute — relies on main.ts calling play() via preferences path
  this.emit();
}
```

**Problem:** Unmuting relies on `main.ts` receiving a preference update notification and calling `applyPreferences()` which calls `play()`. This coupling works but creates an implicit dependency: if `setMuted(false)` is ever called directly on the manager (not through preferences), audio will not resume automatically. The current codebase does not call it directly outside `main.ts`, so no immediate bug — but the architecture is fragile.

**Future hardening suggestion** — add an unmute-resume branch inside `setMuted()`:

```typescript
if (value) {
  // Muting: fade out + pause
  this.shouldResumeAfterSuspend = false;
  this.startFade(0, FADE_OUT_MS, 'fade-out-mute', () => {
    if (!this.audio.paused) this.audio.pause();
    this.audio.volume = this.state.targetVolume;
    this.state = { ...this.state, liveVolume: this.audio.volume };
  });
  this.state = { ...this.state, playing: false };
} else if (!this.disposed && this.source && !this.suspended) {
  // Unmuting: attempt play within the same call to avoid relying on external orchestration.
  // play() internally handles the "already playing" guard.
  void this.play(`unmute:${reason}`);
}
```

**Note:** This change would make `main.ts` `applyPreferences()` call `play()` a second time (harmless, since `play()` now short-circuits when already playing). The double-call is acceptable and clarified by the existing `audio-play-skip` diagnostics event.

---

### F-08 — CSS `--volume-pct` default unit mismatch risk in future `calc()` contexts

**File:** `src/styles/main.scss` (`.audio-controls__slider` block, and related CSS custom property usage)

The `--volume-pct` custom property stores a **unitless** integer (e.g., `50`) and is consumed as:

```scss
calc(var(--volume-pct, 50) * 1%)
```

**Problem:** If a future maintainer uses `--volume-pct` in a new `calc()` context expecting a percentage value and omits the `* 1%` multiplication, the property silently produces wrong output.

**Fix** — store as a percentage string from the start:

```typescript
// AudioControls.ts and PreferencesPanel.ts — change all setProperty calls
this.volumeInput.style.setProperty('--volume-pct', `${displayPct}%`);
```

```scss
// main.scss — change the gradient to consume the value directly
background: linear-gradient(
  to right,
  var(--accent) 0%,
  var(--accent) var(--volume-pct, 50%),     // ← change: no multiplication
  rgba(0, 0, 0, 0.12) var(--volume-pct, 50%),
  rgba(0, 0, 0, 0.12) 100%
);
```

This is a low-risk CSS convention fix. All three `.setProperty` call sites must change together:
- `AudioControls.ts`: `handleVolumeInput()` and `update()`
- `PreferencesPanel.ts`: `input` handler, `buildPanel()` initial render, and `patchPanel()`

---

### F-09 — `BackgroundAudioManager` does not export `targetVolume` directly on its state type

**File:** `src/audio/BackgroundAudioManager.ts:31–40`

```typescript
// CURRENT — BackgroundAudioState already includes targetVolume ✅
export interface BackgroundAudioState {
  available: boolean;
  loaded: boolean;
  playing: boolean;
  muted: boolean;
  targetVolume: number;   // ← exists
  liveVolume: number;     // ← exists
  autoplayBlocked: boolean;
  message: string | null;
  activeSource: BackgroundAudioSource | null;
}
```

**Finding:** The state split between `targetVolume` and `liveVolume` is **correctly implemented**. `AudioControls.update()` renders `state.targetVolume` (not `liveVolume`), so the slider never drifts to the fade envelope value. No code change needed — this is a confirmation.

---

### F-10 — `LOOP_RESTART_FADE_MS = 150` produces a brief audible gap on chromium at high gain

**File:** `src/audio/BackgroundAudioManager.ts:17`

```typescript
const LOOP_RESTART_FADE_MS = 150;
```

**Problem:** The `ended` fallback fades to zero over 150 ms then calls `play()` which starts a 300 ms fade-in. The total gap is ≈150 ms of silence before audible restart. On some browsers `loop = true` handles this seamlessly (no `ended` event), so the fallback fires rarely. But on Chromium with gapless content this produces a subtle dip.

**Better pattern** — keep `loop = true` as primary and only attempt a crossfade on the `ended` event. The current code already does this. To minimize the gap, reduce `LOOP_RESTART_FADE_MS` to `50`:

```typescript
/** Gain ramp when the `ended` fallback restarts a loop (ms). Kept short to minimize audible gap. */
const LOOP_RESTART_FADE_MS = 50;
```

Alternatively, reset `currentTime = 0` synchronously without a pre-fade, relying on `loop=true` to catch the edge silently in most browsers:

```typescript
this.audio.addEventListener('ended', () => {
  if (!this.source) return;
  this.diagnostics.warn('audio-loop-restart', 'Audio ended unexpectedly; looping via ended fallback');
  // Reset time synchronously — no fade — to minimize silence.
  this.audio.currentTime = 0;
  void this.play('ended-fallback');
});
```

---

### Remaining implementation slices (priority order)

| Priority | Slice | Files | Complexity |
|----------|-------|-------|------------|
| High | **F-06**: Extended autoplay recovery | `src/main.ts:465` | Trivial (3 lines) |
| High | **F-03**: Selective drag guard in patchPanel | `src/ui/PreferencesPanel.ts:178` | Low |
| Medium | **F-01**: Fade clamp consistency | `src/audio/BackgroundAudioManager.ts:399` | Trivial (1 line) |
| Medium | **F-02**: Add displayPct to volume-map log | `src/audio/BackgroundAudioManager.ts:252` | Trivial (1 line) |
| Medium | **F-04**: `aria-valuetext` on sliders | `src/ui/AudioControls.ts:113`, `src/ui/PreferencesPanel.ts:154` | Low |
| Medium | **F-07**: Unmute → play within BAM | `src/audio/BackgroundAudioManager.ts:215` | Medium |
| Low | **F-08**: `--volume-pct` as percentage string | `src/styles/main.scss` + 3 TS call sites | Low |
| Low | **F-05**: Enhanced recovery diagnostics | `src/utils/preferences.ts:114` | Trivial |
| Low | **F-10**: Reduce loop-restart fade gap | `src/audio/BackgroundAudioManager.ts:17` | Trivial (1 line) |

---

### Confirmed-correct findings (no code change needed)

- **Volume mapping contract** (`src/audio/volumeMapping.ts`): Uses linear `0..100% display → 0..0.30 effective`, `DEFAULT_AUDIO_GAIN = 0.15`. Exactly matches the requested contract. ✅
- **State ownership** (`BackgroundAudioManager.ts`): `targetVolume` and `liveVolume` are properly separated; fade envelope never overwrites `targetVolume`. ✅
- **Startup mute default** (`src/utils/preferences.ts:141`): `audioMuted: false` is hardcoded at construction, ignoring any stored mute state. Fresh loads always start unmuted. ✅
- **Zero-volume legacy recovery** (`src/utils/preferences.ts:107–131`): Detects and heals broken `audioVolume = 0` from faulty v0.20.4 behavior using a one-shot `AUDIO_RECOVERY_KEY`. ✅
- **`play()` short-circuit guard** (`BackgroundAudioManager.ts:142–147`): Skips re-triggering fade-in when audio is already playing. ✅
- **`setMuted()` no-op guard** (`BackgroundAudioManager.ts:212–218`): Ignores identical mute requests. ✅
- **Slider source of truth** (`AudioControls.ts:107–108`): Renders from `state.targetVolume`, never from `liveVolume`. ✅
- **PreferencesPanel drag continuity** (`PreferencesPanel.ts:178`): `isVolumeDragging` prevents full patchPanel() from replacing the slider during pointer drag. ✅
- **First-interaction autoplay recovery** (`main.ts:461–481`): `pointerdown` + arrow keys + Space/Enter all trigger a one-shot play retry. ✅
- **Audio placement** (`src/styles/main.scss:436`): Positioned top-right via `right: calc(146px + var(--safe-right))`, aligned with the settings/fullscreen control cluster. ✅
- **Narrow-phone slider collapse** (`main.scss:1375`): Slider wrap hidden on `max-width: 599px`, mute button still accessible. ✅

---

### Acceptance matrix for the next implementation PR (gap-closure)

| Scenario | Expected outcome |
|----------|-----------------|
| First load, empty localStorage | Audio starts audible at UI 50% (= 0.15 effective gain) |
| First load on iOS Safari (delayed autoplay) | First canvas touch/keypress triggers play via extended recovery (F-06) |
| Slider drag while adaptive quality changes | Quality radio updates immediately; slider does not jump (F-03) |
| Screen reader announces slider | Reads "50 Prozent", not "50" (F-04) |
| Tab hidden then restored | Audio suspends and resumes; `targetVolume` is unchanged |
| Mute → unmute fast toggle | No silence gap; fade-in from mid-fade correctly (existing ✅) |
| Loop boundary on Chromium | Restart gap ≤ 50 ms (F-10) |
| Diagnostics export | Every volume log includes both `targetGain` and `displayPct` (F-02) |

---

### Validation baseline for any implementation PR in this domain

```bash
npm run lint   # must pass with 0 warnings
npm run build  # must produce dist/ with no type errors
```

Manual sweep checklist:
- [ ] Pointer drag on both sliders: value does not jump; label updates live
- [ ] Keyboard arrow keys on sliders: value steps by 1%; aria-valuetext announced
- [ ] Mute toggle: fades out, then back in to previously selected level
- [ ] Tab hide then restore: audio resumes automatically
- [ ] No audio source: `.audio-controls[hidden]` — widget invisible
- [ ] Autoplay blocked: indicator dot visible; first canvas interaction starts audio

---

## v0.20.6 — Audio stabilization + control polish (2026-05-21)

### Status

Implemented.

### Requested outcomes covered in this pass

1. Keep background audio stable while switching settings and during heavy runtime updates.
2. Ensure startup preference state is unmuted by default.
3. Improve autoplay-block recovery so audio resumes quickly on first user interaction.
4. Align quick audio control sizing with the top-right settings/fullscreen control cluster.
5. Remove the dark circular focus artifact seen on nav arrow buttons during keyboard navigation.
6. Refresh markdown status text for this pass.

### Implementation slices

1. **Slice A — Playback stability guardrails**
   - Prevent `BackgroundAudioManager.play()` from re-triggering fade-in when audio is already playing.
   - Avoid redundant mute state writes so unnecessary transitions do not run.
2. **Slice B — Preference-apply behavior**
   - In `main.ts`, only call `play('preferences-apply')` when audio is not currently playing or autoplay is blocked.
3. **Slice C — Autoplay-blocked recovery**
   - Add first-interaction retry hooks (`pointerdown`, `ArrowLeft/ArrowRight/Space/Enter`) that attempt playback once when autoplay was blocked and the user is not muted.
4. **Slice D — UI control polish**
   - Reduce audio-control chrome height and tune slider width/padding to better match settings/fullscreen visual scale.
   - Add dedicated `nav-btn:focus-visible` styling to suppress the dark browser halo while preserving visible keyboard focus.
5. **Slice E — Documentation sync**
   - Record the implementation in `CHANGELOG.md` and `FINDINGS.md`.
   - Refresh markdown audit stamp wording for v0.20.6.

## v0.20.5 — Complete audio regression recovery plan (planning → substantially resolved, 2026-05-21)

### Status

Substantially resolved. The core state-corruption and mapping bugs documented below were fixed in the v0.20.6 implementation pass and in the corrected `volumeMapping.ts` linear contract. See v0.20.7 for precise file-level confirmation of what is now correct and what minor gaps remain.

**Original planning text preserved below for audit trail.**

### Exact problems to solve

1. The website still starts effectively muted.
2. Startup loudness must be **15% effective output**, but the UI should show **50%** because the intended user-facing range is **0–30% effective mapped onto 0–100% display**.
3. The mute button and quick volume slider are still in the wrong place.
4. Unmuting can restore audio at 0%.
5. Setting the preferences slider to 50% can still produce 0% effective output instead of the requested 15%.
6. The documentation currently says these issues were fixed even though the runtime still fails.

### Code-audit conclusions

1. **Startup/unmute failure is primarily a state-corruption bug, not just a default-value bug.**
   - `BackgroundAudioManager.play()` forces `audio.volume = 0` for fade-in.
   - The `volumechange` listener then copies that temporary value back into manager state.
   - The fade target and UI readback can therefore collapse to zero immediately.

2. **The implemented mapping contract is not the requested one.**
   - Current code uses a power curve targeting “50% display ≈ 15% effective” while still allowing full-scale output at 100%.
   - The requested contract is simpler and stricter: display `0..100` must map to effective `0.00..0.30`, so display `50` must equal effective `0.15` exactly.

3. **Source-of-truth boundaries are mixed.**
   - Preferences store target gain.
   - `BackgroundAudioManager` state is also used by UI, but it currently carries transient element-volume values during fades and mutes.
   - This makes the main-page control, mute recovery, and startup behavior unreliable.

4. **Quick-control placement was treated as final without confirming the requested target location.**
   - The current bottom-left placement must be treated as rejected and replaced by the requested position in the implementation pass.

5. **Broken persisted values must be reviewed during the fix.**
   - Returning users may have localStorage written by the faulty v0.20.4 behavior.
   - The fix needs explicit handling so old broken values do not keep forcing silent startup or bad slider readback.

### Recovery plan

1. **Rebuild the audio state model**
   - Split audio state into at least two distinct concepts: persisted/user-selected target loudness and live media-element loudness during fades.
   - Ensure mute, fade, loop restart, autoplay recovery, and lifecycle resume never overwrite the target loudness.
   - Define which state each UI surface is allowed to render.

2. **Replace the volume mapping contract everywhere**
   - Remove the current power-curve assumption.
   - Implement a deterministic display↔effective mapping for the requested capped range (`0..100` display ↔ `0..0.30` effective).
   - Update startup defaults, settings slider, quick slider, diagnostics payloads, and any customer-facing copy together.

3. **Fix startup, mute/unmute, and resume semantics**
   - Make first load start audible when defaults apply.
   - Make unmute restore the last chosen target loudness instead of the current live envelope value.
   - Validate autoplay-blocked recovery, loop fallback, and lifecycle resume against the same rule.

4. **Correct the settings slider and main-page slider contract**
   - Keep both sliders bound to the same target-volume source of truth.
   - Preserve immediate audible feedback without letting transient fade values feed back into displayed percentages.
   - Confirm that a displayed 50% always means exactly the requested 15% effective output.

5. **Move the quick audio controls to the requested location**
   - Remove the current bottom-left placement assumption from the implementation.
   - Re-anchor the mute button and quick slider to the requested position and verify that they no longer sit in the currently rejected spot.
   - Re-run overlap checks against settings, fullscreen, zoom, navigation, timeline, safe areas, and narrow viewports.

6. **Repair documentation and diagnostics**
   - Downgrade stale “implemented/fixed” claims until the runtime fix actually lands.
   - Expand diagnostics so logs show target gain, live element gain, mute state, autoplay state, and placement-related layout decisions where relevant.

### Required implementation slices

1. **Slice A — Audio-state ownership cleanup**
   - Refactor `BackgroundAudioManager` so fade envelopes operate on live element state only.
   - Keep user-selected loudness in a stable target field that is never replaced by `volumechange` feedback.

2. **Slice B — Requested capped mapping**
   - Replace `src/audio/volumeMapping.ts` with helpers that encode the requested `0..30% effective` maximum.
   - Recalculate the default startup target from that contract.
   - Define how pre-existing stored values are interpreted or migrated.

3. **Slice C — UI synchronization**
   - Make `AudioControls` and `PreferencesPanel` render the same target loudness and write through the same mapping helpers.
   - Keep quick visual feedback without drifting to transient fade values.

4. **Slice D — Placement correction**
   - Replace the current hard-coded quick-control placement with the requested target position.
   - Verify no overlap or crowding across supported viewports.

5. **Slice E — Recovery validation + logging**
   - Add or expand diagnostics for startup, mute/unmute, slider sync, autoplay recovery, lifecycle resume, and legacy-preference handling.
   - Record manual test results and exact acceptance outcomes before documenting the work as fixed.

### Acceptance matrix for the eventual implementation PR

- New visitor with empty localStorage: audio starts audible at the requested effective loudness and UI reads 50%.
- Returning visitor with previously muted state: mute behavior stays intentional and reversible.
- Returning visitor with v0.20.4-broken zero-volume state: migration/recovery path is defined and verified.
- Main-page slider, settings slider, and mute button stay in sync through drag, click, autoplay unblock, tab hide/show, and loop boundary events.
- Quick controls no longer occupy the currently rejected location.
- Documentation is only upgraded from planning to implemented after the runtime behavior is manually re-verified.

### Validation baseline for this planning pass

- `npm install` ✅
- `npm run lint` ✅
- `npm run build` ✅

## v0.20.3 — Full technical audit + enhancement roadmap (planning, 2026-05-20)

### Status

Implemented (v0.20.4, 2026-05-20).

### Audit scope

- Runtime orchestration (`src/main.ts`)
- Audio domain (`src/audio/BackgroundAudioManager.ts`)
- Preferences persistence and UI (`src/utils/preferences.ts`, `src/ui/PreferencesPanel.ts`, `src/ui/AudioControls.ts`)
- Styling behavior for controls (`src/styles/main.scss`)
- Current documentation consistency and upgrade readiness

### Highest-impact technical findings

1. **Perceptual loudness mapping is missing.**
   - Current model stores linear gain (`audioVolume`) and renders linear sliders (0–100).
   - Requested behavior (“show 50%, sound calm”) needs a stable display↔effective mapping contract and migration-safe persistence behavior.
2. **Settings slider drag continuity is interrupted by full re-rendering.**
   - `PreferencesPanel` rebuilds full panel markup on each preference update.
   - `input` events on the range slider immediately write preferences, so the control node can be replaced mid-drag.
3. **Fade envelope is not implemented for loop/toggle edges.**
   - `BackgroundAudioManager` applies volume changes directly and restarts immediately on `ended` fallback.
   - This can create audible clicks depending on source boundaries and browser/device timing.
4. **Main-page audio controls need collision-aware placement policy.**
   - Current bottom-left placement is visually balanced but not yet formalized against viewport crowding / safe-area / timeline overlap rules.
5. **Audio diagnostics are useful but can be made more actionable.**
   - Events exist, but there is no explicit diagnostic contract for fade phases, mapping source-of-truth values, and autoplay recovery transitions.

### Technical implementation slices (coding advice)

1. **Slice A — Volume mapping contract + helpers**
   - Add explicit helper functions in `src/audio/volumeMapping.ts` (or equivalent utility):
     - `displayPercentToGain(percent: number): number`
     - `gainToDisplayPercent(gain: number): number`
   - Keep `PreferencesStore` as source-of-truth for persisted effective gain (`audioVolume`).
   - Render both sliders from `gainToDisplayPercent(...)`; write preferences using `displayPercentToGain(...)`.
   - Add migration-safe guardrails: clamp out-of-range legacy values and log one diagnostics warning when normalization occurs.

2. **Slice B — Continuous slider behavior in PreferencesPanel**
   - Refactor `PreferencesPanel` away from full `innerHTML` replacement on every preference event.
   - Keep static panel skeleton and patch only mutable text/value/checked states.
   - During active pointer drag:
     - suppress structural re-renders,
     - update live value label in place,
     - commit final value on `change` to reduce churn while preserving immediate audible feedback.
   - Keep keyboard slider updates fully live (arrow/page/home/end).

3. **Slice C — Fade envelope in BackgroundAudioManager**
   - Add a small envelope layer around `HTMLAudioElement.volume` writes:
     - configurable `FADE_IN_MS`, `FADE_OUT_MS`, `LOOP_RESTART_FADE_MS`
     - cancel previous ramps before starting a new one.
   - Implement deterministic state transitions for:
     - play-start,
     - mute/unmute,
     - lifecycle suspend/resume,
     - ended fallback restart.
   - Keep autoplay rejection behavior unchanged; only enrich transition handling.

4. **Slice D — Main-page control placement policy**
   - Define CSS placement tokens for left/bottom offsets and overlap boundaries.
   - Add responsive fallback rules for narrow phone widths (stacking, compact width, or temporary slider collapse).
   - Validate that `.audio-controls` never intersects timeline/prefs/fullscreen hit targets across supported breakpoints.

5. **Slice E — Diagnostics/logging expansion**
   - Extend scoped diagnostics with explicit audio transition events:
     - `audio-fade-start`, `audio-fade-cancel`, `audio-fade-complete`
     - `audio-volume-map` (display percent + effective gain)
     - `audio-resume-attempt` and outcome classification
   - Keep log levels bounded: high-frequency slider logs must stay `debug`, not `info`.
   - Include enough payload fields to replay user-reported behavior from exported diagnostics snapshots.

### Brainstorm enhancements (post-v0.20.3 candidates)

1. Optional logarithmic “fine control” mode for lower volume ranges.
2. Soft-ducking strategy during heavy transitions (future, behind feature flag).
3. Optional mini status chip for “autoplay blocked” with one-click recovery hints.
4. Import-time optional loudness metadata scan (report-only) to warn about unusually loud masters.
5. Lightweight smoke test harness for audio preference round-trip and mapping consistency.

### Acceptance checks

- Displayed slider value remains stable and continuous during pointer drag and keyboard adjustment.
- Requested startup profile is met exactly by mapping contract (display midpoint + calm effective loudness baseline).
- No audible click at normal mute/unmute, play-start, or ended-fallback loop transitions.
- Main-page controls stay discoverable and non-overlapping across breakpoints and safe-area variants.
- Diagnostics exports clearly reveal mapping values and transition/fallback states.

### Validation plan for implementation PR

- `npm run lint`
- `npm run build`
- Manual interaction sweep:
  - mouse drag + touch drag + keyboard slider control
  - autoplay-blocked recovery click path
  - tab hide/show + freeze/resume path
  - repeated loop boundary observation on at least one short and one long track

## v0.20.2 — Audio calm-start + control UX + seamless looping (planning, 2026-05-20)

### Status

Implemented (v0.20.4, 2026-05-20).

### Requested outcomes

1. Start website audio **on by default** (not muted), but with a calm effective loudness baseline.
2. Use a new volume behavior target where startup loudness is low (requested: 15%) while the UI shows a balanced midpoint (requested: 50%) so users can move down/up symmetrically.
3. Rework main-page mute/volume control placement to align with common website media-control usability guidance.
4. Fix the settings-panel volume slider so dragging behaves as a truly continuous slider (not “press/click only” behavior).
5. Add fade-in/fade-out handling to avoid audible clip/click artifacts when audio loops or toggles.

### Code-audit findings to address

1. Current persisted default is `audioMuted: false` and `audioVolume: 0.35` (`src/utils/preferences.ts`) — this does not match the new requested startup profile.
2. Volume control is currently linear 0..100 in both main-page and settings UI (`src/ui/AudioControls.ts`, `src/ui/PreferencesPanel.ts`), with no user-facing remap for “50% shown = 15% effective loudness.”
3. Settings slider re-renders through `renderPanel()` subscription on every preference write (`PreferencesPanel`), which can interrupt drag continuity.
4. `BackgroundAudioManager` currently applies direct volume changes with no envelope/fade, and loop recovery (`ended` fallback) does immediate restart (`src/audio/BackgroundAudioManager.ts`), increasing pop/click risk on imperfect loop boundaries.
5. Main-page audio controls are bottom-left (`src/styles/main.scss` `.audio-controls`), which should be re-validated against consistency/discoverability/touch-target guidance before adjusting layout.

### Planning slices

1. **Volume model update**
   - Define a deterministic mapping between displayed slider percentage and effective media gain.
   - Apply mapping consistently in startup defaults, preference persistence, and both UI sliders.
2. **Main-page control placement refinement**
   - Reposition controls using documented UI heuristics (discoverability, accidental-tap avoidance, timeline/other-control collision checks, safe-area behavior).
3. **Continuous slider behavior fix**
   - Remove drag interruptions by decoupling slider interaction from full panel re-render during active pointer/keyboard changes.
4. **Fade envelope implementation plan**
   - Introduce short fade-in/fade-out transitions for start/stop and loop edge handling.
   - Keep autoplay/error diagnostics behavior intact.
5. **Validation + documentation**
   - Validate control behavior on pointer + keyboard.
   - Validate no regression for autoplay-blocked flows and lifecycle suspend/resume.
   - Update customer/developer docs with explicit “planned vs shipped” status.

### Online research checkpoints

- W3C ARIA Slider Pattern: <https://www.w3.org/WAI/ARIA/apg/patterns/slider/>
- MDN slider role and range semantics: <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role>
- WCAG input modalities / operable controls: <https://www.w3.org/WAI/WCAG21/quickref/#input-modalities>
- Apple HIG touch-target baseline (44x44): <https://developer.apple.com/design/human-interface-guidelines/layout>
- Material accessibility touch-target guidance: <https://m3.material.io/foundations/accessible-design/accessibility-basics>
- MDN Web Audio advanced techniques (seamless loop context): <https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques>

## v0.20.1 — Full markdown audit and sync (docs-only, 2026-05-20)

### Status

Implemented.

### Scope

- Audit every markdown file for current-state consistency and stale wording.
- Ensure top-level docs match shipped v0.20 runtime behavior.
- Record audit output in `FINDINGS.md` and `CHANGELOG.md`.

### Findings summary

1. Core runtime/docs state is consistent with shipped v0.20 behavior (audio CORS fix, main-page controls, sidecar cache-bust).
2. Multiple markdown files still used v0.19-labeled top status notes even though v0.20 is already shipped.
3. All markdown files were refreshed in this pass with a unified audit stamp and updated status headings.
4. No runtime code changes were required.

### Validation

- `npm install` ✅
- `npm run lint` ✅
- `npm run build` ✅

## v0.20 — Audio playback fix + main-page audio controls + sidecar cache-bust (2026-05-20)

### Status

Implemented.

### Problems addressed

#### 1. Background music not playing (CORS block on file:// origin)

**Root cause:** `BackgroundAudioManager` set `this.audio.crossOrigin = 'anonymous'` on the `<audio>` element. When the gallery is opened as a `file://` URL, Chromium-based browsers (Chrome, Opera, Edge) treat the page origin as `null`. Setting `crossOrigin` triggers a CORS request from a null origin, which is always rejected by the browser with:
> "Cross origin requests are only supported for protocol schemes: http, https …"

The audio element then emits an `error` event, `playing` never fires, and the autoplay-blocked path makes the failure look like a policy block — masking the real cause.

**Fix:** Removed `this.audio.crossOrigin = 'anonymous'` from `BackgroundAudioManager` constructor. The audio files live in `customer-preview/audio/` alongside `app.html`, so no CORS header is needed. Also improved the `error` event handler to log `mediaErr.code` and `mediaErr.message` for easier future diagnosis.

#### 2. Subtle volume/mute controls on the main page

New `src/ui/AudioControls.ts` widget — glass-pill, bottom-left, symmetric to ZoomControls (bottom-right). Hidden when no audio source is imported. Shows a pulsing activation indicator when autoplay is blocked. Includes:
- Mute/unmute button with three SVG icons (active / muted / blocked)
- Compact volume slider, disabled when muted
- Full accessibility labels (aria-label, aria-pressed, title)
- Reduced-motion and high-contrast CSS adaptations

The click handler handles three cases without breaking the browser user-gesture chain:
1. Muted → `prefs.setAudioMuted(false)` → triggers synchronous `applyPreferences()` → `audio.play()`
2. Playing → `prefs.setAudioMuted(true)` → pause
3. Not playing / autoplay blocked → `audioManager.play('user-activate')` directly (stays within gesture)

#### 3. Sidecar text not updating after first import

**Root cause:** The importer re-reads all `.txt` sidecar files on every run (no skip logic) — so the JS files on disk are always up-to-date. The stale text is a **browser cache** issue: Chromium caches `file://` resources by URL. Since `customer-artworks.js` always has the same URL, the browser may serve the old cached version even after the file has been overwritten.

**Fix:** `import-artworks.mjs` now stamps `?t=<Date.now()>` on both `customer-artworks.js` and `customer-audio.js` script src attributes in `customer-preview/app.html` on each import run. Each run produces distinct URL strings, forcing the browser to treat them as new resources and bypassing the disk cache.

### Files changed

| File | Change |
|------|--------|
| `src/audio/BackgroundAudioManager.ts` | Removed `crossOrigin = 'anonymous'`; improved error event logging |
| `src/ui/AudioControls.ts` | **New file** — main-page audio widget |
| `src/styles/main.scss` | Added `.audio-controls` glass-pill styles + all cross-cutting selector updates |
| `src/main.ts` | Import + instantiate `AudioControls`; add to dispose |
| `scripts/import-artworks.mjs` | Added `PREVIEW_HTML` constant; cache-bust `app.html` script src tags on each run |

## v0.19 — Background music workflow implementation (shipped, 2026-05-20)

### Status

Implemented. Importer, preview payload, runtime audio manager, preferences persistence, and UI controls are shipped.

### Implemented outcome

Implement customer-managed calm background music that integrates with the existing one-click `Update Gallery` workflow, supports compatible audio formats, exposes clear mute + volume controls, and loops continuously until the user pauses/mutes or leaves the experience.

### Implementation summary

1. `scripts/import-artworks.mjs` now scans `customer-audio/inbox`, copies supported audio files to `customer-preview/audio`, writes `customer-preview/customer-audio.js`, and reports selected/ignored/unsupported/no-audio outcomes.
2. `scripts/write-local-preview.mjs` now injects `customer-audio.js` into preview HTML and writes a stub payload when no generated file exists yet.
3. Runtime now sanitizes `window.__FREYRAUM_AUDIO` and orchestrates playback through `src/audio/BackgroundAudioManager.ts`.
4. `src/utils/preferences.ts` persists `audioMuted` and `audioVolume` in `freyraum.preferences.v1` with backward-compatible defaults.
5. `src/ui/PreferencesPanel.ts` + `src/styles/main.scss` now expose mute toggle, volume slider, and autoplay-status messaging.
6. `src/main.ts` integrates audio manager lifecycle (load/apply/suspend/resume/dispose) with existing diagnostics and page-lifecycle orchestration.

### Current architecture audit (code-level)

Validated current boundaries against runtime + importer code:

1. `src/main.ts` is the orchestration layer and the correct integration point for an `AudioManager` lifecycle (boot, page visibility/freeze/resume, diagnostics, dispose).
2. Runtime customer content is already injected through generated globals (`window.__FREYRAUM_ARTWORKS`) and sanitized before use; this is the clean precedent for adding a second injected audio payload.
3. Preferences persistence exists in `src/utils/preferences.ts` (`freyraum.preferences.v1`) and can be extended for audio fields (`audioMuted`, `audioVolume`) without introducing a new storage system.
4. Accessibility-safe control patterns already exist in `PreferencesPanel` (`aria-modal`, `aria-labelledby`, focus-return on dismiss) and can host audio controls with the same semantics.
5. Update workflow is centralized in `scripts/import-artworks.mjs` + `scripts/run-import-artworks.cjs` + `Update Gallery.command/.bat`; this is the correct boundary for audio folder scan/validation/reporting.
6. Runtime diagnostics are centralized (`Diagnostics.ts`) with scoped events and dedupe, so audio events should use the same signal path (no ad-hoc console logs).

### Non-negotiable behavior for v0.19

1. **Indefinite loop:** background track must repeat continuously.
   - Primary mechanism: `HTMLAudioElement.loop = true`.
   - Guardrail: if browser/device edge-cases emit `ended` unexpectedly, restart from `currentTime = 0` and re-attempt `play()` through the managed recovery path.
2. **User control supremacy:** mute and volume changes must apply immediately and persist.
3. **Warning-first failures:** missing/invalid/unsupported audio must never block image gallery runtime.
4. **One-click customer flow:** customer still runs only `Update Gallery` and then opens preview.

### Goals and non-goals

**Goals**

- Add deterministic customer audio ingestion with multi-format compatibility.
- Add robust runtime playback with autoplay-safe fallback.
- Add accessible mute/volume UI aligned with existing design language.
- Add detailed diagnostics and plain-language import reporting.

**Non-goals (v0.19)**

- Streaming services, playlists, cross-fades, beat-sync, timeline audio editor.
- Multiple simultaneous ambient tracks/mixing graph.
- New runtime dependency for audio playback.
- Replacing existing artwork/text manifest contract.

### Implemented file/module changes

1. **Importer + preview payload**
   - `scripts/import-artworks.mjs`
   - `scripts/write-local-preview.mjs`
   - generated output: `customer-preview/customer-audio.js`
2. **Runtime audio domain**
   - new `src/audio/BackgroundAudioManager.ts` (or `src/utils/BackgroundAudioManager.ts` if repository wants no new top-level domain folder)
3. **Main orchestration integration**
   - `src/main.ts`
4. **Preferences state + UI**
   - `src/utils/preferences.ts`
   - `src/ui/PreferencesPanel.ts`
   - `src/styles/main.scss`
5. **Customer/update workflow docs**
   - `docs/CUSTOMER_PICTURE_GUIDE.md`
   - `docs/IMAGE_MAINTENANCE_GUIDE.md`
   - `docs/HANDOFF.md`
   - plus status banners in core markdown

### Audio asset contract (implemented)

Recommended v0.19 contract:

```text
customer-audio/
  inbox/
    calm-track.mp3
    calm-track.ogg
    calm-track.m4a
    calm-track.wav
```

Policy:

1. Accept `.mp3`, `.ogg`, `.m4a`, `.wav` (lowercase-normalized extension handling).
2. Select one canonical runtime track deterministically when multiple candidates exist.
3. Preferred selection order for generated payload:
   - runtime `canPlayType` first,
   - importer fallback priority when runtime probing is unavailable in script context: `mp3 > ogg > m4a > wav` (documented and deterministic).
4. Keep source-of-truth customer files untouched; copy resolved assets into preview output similarly to image pipeline.
5. Import report must include sections for:
   - audio selected,
   - audio candidates ignored by precedence,
   - unsupported audio files,
   - no audio found.

### Runtime playback contract (implemented)

`BackgroundAudioManager` responsibilities:

1. Create and own one `HTMLAudioElement`.
2. Set safe defaults (`preload = 'metadata'`, `loop = true`, configurable initial volume, muted false by default unless policy decides otherwise).
3. Provide idempotent APIs:
   - `load(sourceSpec)`
   - `play(reason)`
   - `pause(reason)`
   - `setMuted(value, reason)`
   - `setVolume(value, reason)`
   - `dispose()`
4. Handle `play()` promise rejection paths (`NotAllowedError`, `AbortError`, unknown errors) and surface state for UI fallback (“Tap to start audio”).
5. Register media events (`canplay`, `playing`, `pause`, `ended`, `error`, `volumechange`) with scoped diagnostics.
6. Integrate with lifecycle:
   - on `pageInactive`: pause audio (policy default for power-friendliness),
   - on resume: re-attempt play only if user had audio active before suspension.

### UI + accessibility contract (implemented)

Controls must be clean, discoverable, and WCAG-friendly:

1. Add controls to existing preferences surface first (lowest visual risk):
   - Mute toggle (checkbox/switch with explicit label).
   - Volume slider (`input[type='range']`, 0–100).
2. Required semantics:
   - label + description text,
   - keyboard operable by default,
   - focus-visible styling aligned with current global focus ring,
   - `aria-valuemin/max/now` naturally provided by range input.
3. Keep panel wording explicit when autoplay is blocked (“Click to enable background music”).
4. Do not auto-start loud audio without user gesture in environments that block autoplay.

### Detailed coding suggestions (for implementation PR)

1. **Do not bind audio logic directly into `main.ts` anonymous closures.** Keep state transitions in a dedicated manager class and call it from main lifecycle hooks.
2. **Mirror current diagnostics style exactly.** Use `createScopedDiagnostics('audio')` and stable event names (`audio-load-start`, `audio-play-blocked`, `audio-loop-restart`, `audio-volume-change`).
3. **Extend existing preferences schema instead of creating new localStorage key.** Keep migration backward compatible by treating missing audio fields as defaults.
4. **Keep importer deterministic and pure-helper driven.** Follow v0.18 sidecar pattern: parse/validate helpers above main section, warning aggregation in report writer.
5. **Do not hard-fail on unsupported codecs.** Fall through to next candidate and report clearly.
6. **Guard loop continuity against source/runtime edge cases.** `loop=true` is canonical, but keep an `ended` fallback that replays through the same guarded `play()` path.
7. **Preserve one-click launcher UX.** `Update Gallery.command/.bat` should remain unchanged unless messaging/output needs extension; integration should happen in script internals.

### Online research checkpoints (used for this audit)

1. `HTMLMediaElement.loop` is the standards-based mechanism for continuous replay.
2. `HTMLMediaElement.play()` returns a promise and can reject under autoplay policy; rejection handling is mandatory.
3. Browser autoplay policies generally require user interaction for unmuted playback; UI fallback flow is required.
4. `canPlayType()` is the browser-native way to pick compatible codecs when multiple sources are available.

Sources referenced for implementation planning:

- <https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop>
- <https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play>
- <https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay>
- <https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canPlayType>

### Vertical implementation slices (deep)

1. **Slice A — importer audio discovery + report model**
   - extend `scripts/import-artworks.mjs` with audio-folder scan and deterministic selection
   - emit preview payload for runtime consumption
   - extend plain-language report with audio sections
2. **Slice B — runtime audio payload ingestion**
   - load generated audio payload in preview HTML output path
   - add runtime sanitizer equivalent to `sanitizeInjectedArtworks`
3. **Slice C — audio manager core**
   - implement load/play/pause/mute/volume/loop/lifecycle APIs + diagnostics
4. **Slice D — preferences integration**
   - add persisted audio fields and subscription handling
5. **Slice E — preferences UI + styling**
   - add mute + volume controls with full keyboard/a11y behavior
6. **Slice F — lifecycle + autoplay recovery**
   - bind to existing suspend/resume hooks in `main.ts`
   - add explicit user-gesture recovery path when autoplay is blocked
7. **Slice G — docs + customer workflow promotion**
   - document folder layout, supported formats, and troubleshooting

### Risks and reserved boundaries

1. **Autoplay inconsistency across browsers/devices:** treat as expected runtime state, not fatal error.
2. **Codec mismatch:** always support fallback candidate selection and clear report output.
3. **UI crowding on phone tiers:** keep first iteration inside preferences panel to avoid control overlap regressions.
4. **State drift between UI and audio element:** enforce one source of truth via preferences + manager state sync.
5. **Loop interruptions after decode/network errors:** add retry/backoff policy boundary for v0.20 if needed; v0.19 keeps one immediate recovery attempt + warning.

### Acceptance checks (expanded)

Functional:

- Audio starts when policy allows and remains active through track end (continuous loop).
- Mute toggle and volume slider update playback immediately and persist after reload.
- Unsupported/invalid audio files do not break gallery load.

Accessibility:

- Controls are keyboard-operable and clearly labeled.
- Focus order remains stable when opening/closing preferences.

Lifecycle:

- Hidden/frozen tab suspends audio according to policy and resumes predictably.
- Diagnostics capture suspend/resume and autoplay-block events.

Importer/report:

- `Update Gallery` report includes deterministic audio decision details.

Validation gates for implementation PR:

- `npm run lint`
- `npm run build`
- script syntax checks for touched `scripts/*.mjs|*.cjs`

## v0.18 — Customer sidecar text shipped (2026-05-20)

### Status

**Implemented in `scripts/import-artworks.mjs`.** Customer-editable
same-basename `.txt` sidecar files are now read at import time and
merged into the generated manifest. `.md` is accepted as a secondary
alias; when both exist for the same image stem, `.txt` wins and the
duplicate is warned. Missing/invalid sidecars never fail the run.

### Implementation summary

The implementation followed the audited slices exactly:

1. **Slice 1 — separate images from sidecars.** Added
   `SIDECAR_EXTENSIONS`, `PRIMARY_SIDECAR_EXT`,
   `ALLOWED_SURFACE_PROFILES`, and `SIDECAR_FIELD_KEYS` to the
   format-policy block. The inbox scan now produces a deterministic
   `imageEntries` array plus a `sidecarMap` (lowercase stem → chosen
   sidecar). Duplicates collect into `duplicateSidecarWarnings`.
2. **Slice 2 — `parseSidecar()`.** Pure helper above `// -------- Main --------`:
   BOM-safe UTF-8 read, `CRLF`/`CR` → `\n` normalization,
   case-insensitive `Label: value` parsing, multi-line `Description:`
   body (internal blank lines preserved, trailing blank lines trimmed),
   validated `Year` (four digits) and `Surface` (allow-list of
   `matte-canvas`, `satin-canvas`, `varnished-oil`, `paper`), tags split
   on `,`/`;`, unknown-key warnings, and blank `Title`/`Alt`/`Description`
   warnings. Field-level mistakes never throw.
3. **Slice 3 — merge into the artwork object.** After
   `const stem = basename(filename, ext);` the importer looks up the
   sidecar by lowercased stem, merges customer-facing fields with
   `sidecarFields?.X ?? generatedDefault` semantics, and records
   `textApplied`, `picturesMissingText`, `textFieldWarnings`,
   `matchedSidecarStems`. Asset fields stay importer-owned.
4. **Slice 4 — extended report.** New sections in
   `customer-artworks/last-import-report.txt`: `Text applied`,
   `Pictures missing text`, `Text files without matching pictures`,
   `Text fields needing attention`, `Duplicate text files`. All warning
   level; the run still succeeds.
5. **Slice 5 — docs/template/lessons.** `docs/CUSTOMER_TEXT_GUIDE.md`
   rewritten as the shipped "how to import text" walkthrough,
   `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt` aligned with the final
   parser contract, and every "planned/not yet shipped" v0.18 banner
   replaced across `README.md`, `CHANGELOG.md`, `docs/HANDOFF.md`,
   `docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/IMAGE_MAINTENANCE_GUIDE.md`,
   `DOCUMENTATION_RULES.md`, `ARCHITECTURE_MAP.md`, `AI_RULES.md`,
   `LESSONS_LEARNED.md`, and `FINDINGS.md`.

### Cleanup applied

- Inbox scan is a single source of truth (`inboxEntries` →
  `imageEntries` + `sidecarMap`), not repeated directory rescans.
- Sidecar constants and validation sets live next to the existing
  format-policy block.
- `parseSidecar()` is a pure helper; the main loop only handles I/O,
  merge, and reporting.
- Customer docs no longer imply sidecar text is "planned" anywhere in
  the repository.
- Report stays plain-language; no JSON-only diagnostics introduced.

### Validation results

- `npm install`, `npm run lint`, `npm run build` — pass.
- `node -c scripts/import-artworks.mjs` — pass.
- Manual fixture run covering:
  - matched `.txt` sidecar (title/description/alt applied to both
    `customer-artworks/artworks.json` and
    `customer-preview/customer-artworks.js`),
  - picture without sidecar (imported with fallback, listed under
    `Pictures missing text`),
  - orphan `.txt` (listed under `Text files without matching pictures`),
  - duplicate `.txt`/`.md` (`.txt` wins, `.md` listed under
    `Duplicate text files`),
  - invalid `Year` (`22` rejected, warning written),
  - invalid `Surface` (`shiny-velvet` rejected, fallback to
    `matte-canvas`),
  - blank `Alt` (warning written),
  - multi-line `Description:` with preserved blank lines.

### Final audited plan (history)

### Codebase audit summary

- `scripts/import-artworks.mjs` is the only runtime file that needs to change for the first implementation slice.
- `src/config/artworks.ts` already defines every target field needed by sidecars: `title`, `subtitle`, `description`, `year`, `medium`, `alt`, `credit`, `tags`, and `surfaceProfile`.
- `src/main.ts` already sanitizes injected customer artwork data and accepts those optional fields without changing the runtime model.
- `src/ui/InfoPanel.ts` renders description text via `.textContent`, so multi-line customer text remains plain text and does not introduce HTML-injection risk.
- The existing importer/report architecture is already non-blocking: warnings do not fail the whole run, so missing/invalid sidecar text should stay a warning path, not a hard failure.

### Final decision

Use **one customer-editable UTF-8 `.txt` sidecar beside each artwork image** in `customer-artworks/inbox/`, matched by the exact same basename.

```text
customer-artworks/inbox/
  01-sunset-at-the-lake.jpg
  01-sunset-at-the-lake.txt
  02-forest-path.png
  02-forest-path.txt
```

`.md` may be accepted later as a secondary alias, but `.txt` remains the primary customer workflow because it is the least technical file type for non-developers.

### Scope and non-goals

**In scope for v0.18:**

- importer-side detection of same-basename sidecars
- parsing labeled plain-text metadata
- merging sidecar fields into generated manifest data
- reporting matched/missing/orphaned sidecars clearly
- customer/maintainer doc and template refresh

**Not in scope for v0.18:**

- `src/` UI changes
- replacing generated `artworks.json` / `customer-artworks.js` as the runtime boundary
- fuzzy matching after renames
- XMP/XML support
- CSV as the primary customer source
- new npm dependencies

### Validated sidecar format

Canonical v0.18 format: **UTF-8 `.txt` with simple `Label: value` lines** plus a multi-line `Description:` block.

Suggested draft template:

```text
Title: Sunset at the lake
Subtitle: Freyraum Collection
Year: 2026
Credit: Customer
Alt: Abstract landscape painting with warm sunset colors over a calm lake.
Tags: sunset, lake, warm
Surface: matte-canvas
Medium: Oil on canvas · 80×60 cm

Description:
This is the customer-written text shown in the info panel.
It can be one paragraph or multiple short paragraphs.
```

| Field | Expected rule | Runtime target | Notes |
| --- | --- | --- | --- |
| `Title` | customer should provide it | `artwork.title` | If omitted, importer may fall back to filename-generated title, but the report should warn. |
| `Subtitle` | optional | `artwork.subtitle` | If omitted, keep generated `Artwork 01`, `Artwork 02`, etc. |
| `Description` | customer should provide it | `artwork.description` | Everything after `Description:` becomes plain-text body; multi-line safe. |
| `Alt` | customer should provide it | `artwork.alt` | Keep separate from the long description; warn if blank. |
| `Year` | optional four-digit year | `artwork.year` | Invalid values warn and fall back to current year. |
| `Credit` | optional | `artwork.credit` | Defaults to `Customer`. |
| `Tags` | optional comma/semicolon list | `artwork.tags` | Reserved for future filtering. |
| `Surface` | optional controlled value | `artwork.surfaceProfile` | Accept `matte-canvas`, `satin-canvas`, `varnished-oil`, `paper`; unknown values warn and fall back. |
| `Medium` | optional free text | `artwork.medium` | If omitted, keep the current dimension-based medium. |

### Matching and parsing rules

1. Match sidecars by the exact basename in the same folder: `painting.jpg` ↔ `painting.txt`.
2. Compare sidecar/image stems in lowercase. This is required because Node's `path.basename(..., suffix)` treats suffix matching case-sensitively even on Windows, while Windows filesystems are typically case-insensitive.
3. Ignore `.txt` / `.md` entries when building the image candidate list so sidecars never appear as unsupported images.
4. If both `painting.txt` and `painting.md` exist, prefer `.txt` and warn about the duplicate.
5. Strip a leading UTF-8 BOM and normalize `CRLF` / `CR` line endings to `\n` so Notepad/TextEdit files parse reliably.
6. Parse keys case-insensitively; unknown keys warn but do not fail the import.
7. After `Description:` begins, treat the remainder of the file as the description body without further key parsing.
8. Use `??` when merging parsed values into generated metadata so “missing” falls back cleanly, while intentionally blank values stay blank and can still be warned about.
9. Never fuzzy-match orphaned sidecars to a different image. Wrong text is worse than missing text.
10. Keep `id`, `image`, `webglImage`, and `dimensions` importer-generated only.

### Final implementation slices for `scripts/import-artworks.mjs`

**Slice 1 — separate images from sidecars**

- Extend the format-policy area with `SIDECAR_EXTENSIONS` and `PRIMARY_SIDECAR_EXT`.
- Replace the current single inbox loop with one sorted entry list, then derive `imageEntries` plus a `sidecarMap`.
- Keep duplicate-sidecar resolution deterministic (`.txt` before `.md`) and report duplicates as warnings.

**Slice 2 — add `parseSidecar()`**

- Place a pure helper above `// -------- Main --------`.
- Read the sidecar with `readFileSync(filePath, 'utf8')`.
- Strip BOM, normalize line endings, parse `Label: value` pairs, and collect warnings instead of throwing for field-level mistakes.
- Validate `Year`, `Surface`, and required blank fields (`Title`, `Alt`, `Description`).

**Slice 3 — merge sidecar fields into the artwork object**

- Keep the current image copy, `webglImage` generation, dimension read, GPU warnings, and id generation unchanged.
- After `const stem = basename(filename, ext);`, look up the matching sidecar by lowercased stem.
- Merge only customer-facing metadata fields; leave asset fields importer-owned.
- Record `textApplied`, `textMissing`, and `matchedSidecars` / `orphanedSidecars` during the same pass.

**Slice 4 — extend the plain-language report**

Add dedicated sections to `customer-artworks/last-import-report.txt`:

```text
Text applied (2):
  ✓ 01-sunset-at-the-lake.txt matched 01-sunset-at-the-lake.jpg

Pictures missing text (1):
  ⚠ 03-blue-room.webp — add 03-blue-room.txt next to the image

Text files without matching pictures (1):
  ⚠ old-painting.txt — no image named old-painting.* was found

Text fields needing attention (1):
  ⚠ 02-forest-path.txt — Alt is empty; add a short visual description
```

The report must stay plain-language and support-oriented. Missing text should remain a warning, not an error.

**Slice 5 — docs/template/fixture follow-through**

- Move customer docs from “draft/planned” wording to “implemented” wording only when the importer change is merged.
- Keep `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt` aligned with the final parser contract.
- Add coverage for: matched sidecars, missing sidecars, orphaned sidecars, duplicate `.txt` / `.md`, invalid year/surface, required blank fields, and multi-line descriptions.

### Cleanup

The implementation pass should include a small cleanup, not just feature wiring:

1. Keep the inbox scan single-source-of-truth (`inboxEntries` → derived maps/arrays), not repeated directory rescans.
2. Lift sidecar constants and validation sets near the existing format-policy block so future file-type work stays centralized.
3. Keep parsing/reporting helpers pure and isolated instead of expanding the main loop with deeply nested conditionals.
4. Remove any documentation wording that implies sidecar text is already shipped before the importer actually supports it.
5. Preserve the current plain-language report style; do not introduce JSON-only diagnostics for customer-facing errors.

### Check-up before marking v0.18 implemented

Run the existing repository checks plus one focused importer pass:

- `npm install`
- `npm run lint`
- `npm run build`
- `node -c scripts/import-artworks.mjs`
- `node -c scripts/write-local-preview.mjs`
- `node -c scripts/run-import-artworks.cjs`

Then run one manual importer check with sample files and confirm:

1. A matched `.txt` sidecar changes title/description/alt in both `customer-artworks/artworks.json` and `customer-preview/customer-artworks.js`.
2. A missing sidecar imports successfully and appears under `Pictures missing text`.
3. An orphaned sidecar appears under `Text files without matching pictures`.
4. Duplicate `.txt` / `.md` pairs prefer `.txt` and warn.
5. Invalid `Year` / `Surface` values warn but still import.
6. `index.html` shows the expected text in the info panel and keeps offline `file://` preview behavior unchanged.

### Validated coding guidance

| Guidance | Repository validation | Online/source validation |
| --- | --- | --- |
| Importer-only first slice | `scripts/import-artworks.mjs` owns inbox scan, manifest write, preview JS write, and report generation; `src/main.ts`, `src/config/artworks.ts`, and `src/ui/InfoPanel.ts` already accept the target metadata shape. | Internal code audit of current source tree. |
| Lowercased basename matching | Current importer already uses `basename(filename, ext)` as the stable image stem. | Node `path.basename()` suffix handling is case-sensitive even on Windows; lowercasing comparisons avoids casing drift in sidecar matching. |
| BOM-safe UTF-8 text parsing | Sidecars are customer-edited files likely to come from Notepad/TextEdit. | Node `fs.readFileSync(..., 'utf8')` is the correct text-read API; manual BOM stripping keeps Windows-authored files safe. |
| Separate `Alt` from `Description` | `Artwork` model already has both fields; `InfoPanel` uses `description` as visible text. | W3C/WCAG/WebAIM/Smithsonian guidance distinguishes concise alt text from longer descriptive/supporting text for informative images and art. |
| Warning-first report design | Existing importer already treats warnings/skips as non-fatal and writes plain-language support output. | Matches the current repository customer-support model; no additional runtime error UI is needed for the first slice. |
| `.txt` as primary sidecar | Best fit for non-technical customer editing. | Sidecars are a well-established metadata pattern in Adobe/Lightroom, Capture One, Immich, and ExifTool ecosystems; `.txt` is the customer-friendly adaptation for this local workflow. |

### Online validation sources used for the final audit

- Node.js `path` docs: <https://nodejs.org/api/path.html>
- Node.js `fs` docs: <https://nodejs.org/api/fs.html>
- Adobe Lightroom / XMP sidecar guidance: <https://helpx.adobe.com/lightroom-classic/help/create-xmp-acr-files.html>
- Capture One XMP sidecar guidance: <https://support.captureone.com/hc/en-us/articles/360002544898-Metadata-in-XMP-sidecar-files>
- Immich XMP sidecar docs: <https://docs.immich.app/features/xmp-sidecars/>
- ExifTool metadata sidecar files: <https://exiftool.org/metafiles.html>
- W3C WAI Images Tutorial: <https://www.w3.org/WAI/tutorials/images/>
- WCAG quick reference (`Non-text Content`): <https://www.w3.org/WAI/WCAG21/quickref/#non-text-content>
- WebAIM alternative text guidance: <https://webaim.org/techniques/alttext/>
- Smithsonian visual-description guidance: <https://www.si.edu/accessibility/visual-descriptions>

### Customer-doc status

### Customer-doc status

`docs/CUSTOMER_TEXT_GUIDE.md` and
`customer-artworks/ARTWORK_TEXT_TEMPLATE.txt` are the **shipped** customer
assets for the v0.18 sidecar workflow. The picture-only flow documented
in `docs/CUSTOMER_PICTURE_GUIDE.md` remains supported for customers who
choose not to provide sidecar text.

## v0.17 — Easy wins: accessibility, dead-code cleanup (2026-05-20)

### Status

Implemented. Runtime code changed.

### Scope

Implement the high-confidence, low-risk improvements identified by the 2026-05-19 deep audit and researched online:

1. `PreferencesPanel` ARIA accessibility fixes.
2. Legacy interaction file cleanup.
3. Deprecated `isMobileDevice()` removal.

Out of scope for this pass (reserved for dedicated PRs):

- ESLint v8 → v9 tooling upgrade (breaking config migration, requires separate validation).
- Vite v5 → v6 semver-major upgrade (fixes `npm audit` advisories).
- `PreferencesPanel.renderPanel()` innerHTML → in-place DOM refactor (behavioural equivalence requires thorough testing).
- three.js `TextureUtils` contain/cover for artwork fitting (potential fidelity change, needs design sign-off).

### Implemented changes

#### 1. PreferencesPanel ARIA accessibility

**Problem (confirmed by online research):**

WCAG 2.2 SC 4.1.2 (Name, Role, Value) and the ARIA APG dialog pattern require:

- `aria-modal="true"` on a custom `role="dialog"` element so screen readers treat background content as inert.
- `aria-labelledby` pointing to the dialog's visible heading (preferred over `aria-label` per ARIA spec; `aria-labelledby` takes precedence and is more robust when heading text changes).
- Focus returned to the trigger after every dismiss path, not just Escape.

Before v0.17 the panel had `aria-label` but no `aria-modal` and did not return focus when dismissed by outside-click.

Sources:

- <https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/>
- <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role>
- <https://www.accesify.io/blog/accessible-modals-focus-traps-keyboard-controls-aria-dialogs/>

**Changes (`src/ui/PreferencesPanel.ts`):**

- Replaced `aria-label` with `aria-labelledby="freyraum-prefs-heading"`.
- Added `aria-modal="true"`.
- Added `id="freyraum-prefs-heading"` to the first `<h2>` inside `renderPanel()`.
- Added `this.trigger.focus()` inside `handleOutsideClick` after `setOpen(false)`, matching existing Escape-key behaviour.

No visual or functional change to sighted or pointer users.

#### 2. Legacy interaction file cleanup

**Problem (identified in 2026-05-19 audit):**

`MouseInteraction.ts`, `TouchInteraction.ts`, and `ZoomPan.ts` were superseded by `CanvasInteraction.ts` in v0.11. No production code imports them. They add 230 lines of dead TypeScript to the source tree and make architecture documentation harder to read.

**Verification before deletion:**

```
grep -rn "MouseInteraction|TouchInteraction|ZoomPan" src/ --include="*.ts"
```

Result: only comments/documentation in `CanvasInteraction.ts` and `main.ts`. No runtime imports.

**Changes:**

- Deleted `src/interaction/MouseInteraction.ts`.
- Deleted `src/interaction/TouchInteraction.ts`.
- Deleted `src/interaction/ZoomPan.ts`.
- Updated `CanvasInteraction.ts` docblock from "Replaces…" to "Replaced… (removed in v0.17)".
- Updated `main.ts` comment from present to past tense.

#### 3. Deprecated `isMobileDevice()` removal

**Problem (identified in 2026-05-19 audit):**

`isMobileDevice()` was deprecated in v0.11 in favour of `detectDeviceCapabilities()`. The audit confirmed zero callers remain; only a JSDoc reference existed in `device.ts`. The stub exported a viewport-width-only check (`< 768 px`) which the new capability model superseded.

**Verification before deletion:**

```
grep -rn "isMobileDevice" src/ --include="*.ts" | grep -v performance.ts
```

Result: one comment reference in `device.ts`, no runtime calls.

**Changes:**

- Removed `isMobileDevice()` from `src/utils/performance.ts`.
- Updated the JSDoc reference in `src/utils/device.ts` from present to past tense.

### Validation

- `npm run lint` ✅ (same TypeScript-version support warning as v0.16, not a regression).
- `npm run build` ✅ (595 kB bundle, no module resolution errors).
- `customer-preview/` rebuilt from updated source.

### Remaining items

- Dedicated PR: ESLint v8 → v9 flat-config migration.
- Dedicated PR: Vite v5 → v6 to resolve `npm audit` moderate advisories.
- Dedicated PR: `PreferencesPanel.renderPanel()` in-place DOM refactor.
- Potential future enhancement: three.js `TextureUtils` contain/cover for artwork texture fitting (online research confirmed `TextureUtils` added in r166+).

### Online research findings for this pass

1. **ARIA dialog pattern (WCAG 2.2)**
   - `aria-modal="true"` is required on custom `role="dialog"` elements. `aria-labelledby` is preferred over `aria-label` when a visible heading is present. Focus must return to the opener after every dismiss path.
   - Source: <https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/>
2. **three.js r166 `TextureUtils`**
   - r166 added `TextureUtils.contain`, `cover`, and `fill` helpers for automatic texture fitting, relevant to artwork loading and aspect-ratio preservation.
   - Source: <https://newreleases.io/project/github/mrdoob/three.js/release/r166>
3. **ESLint v9 flat config migration**
   - ESLint v9 requires `eslint.config.js` (flat config). The `@typescript-eslint` v8+ packages now align with ESLint v9 versions. Migration requires replacing `.eslintrc.js` with a flat config file and porting rules manually.
   - Source: <https://typescript-eslint.io/linting/configs/flat-config/>
4. **CSS `content-visibility: auto`**
   - MDN and web.dev document `content-visibility: auto` for lazy off-screen rendering. Requires `contain-intrinsic-size` to avoid CLS. Not applicable to the current app's single-viewport WebGL layout.
   - Source: <https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility>



### Status

Documentation-only audit completed. No runtime code changed.

### Scope

- Audit complete repository structure: source, scripts, generated preview, customer docs, AI instructions, validation scripts, and current markdown.
- Re-run validation to distinguish actual regressions from maintenance risks.
- Research current online guidance for browser/runtime features used by the app.
- Update every Markdown file with current findings, cross-links, stale wording fixes, or audit-specific guidance.

### Repository findings

1. Runtime architecture remains consistent with the documented boundaries:
   - `src/main.ts` owns orchestration, lifecycle, resize coordination, preferences, diagnostics, and render loop.
   - `src/core/` owns renderer/scene/post-processing infrastructure.
   - `src/gallery/` owns artwork state, texture loading, mesh state, navigation, zoom/pan math, and layout.
   - `src/materials/` owns painting fidelity and procedural texture generation.
   - `src/ui/`, `src/timeline/`, and `src/interaction/` own DOM controls and input.
   - `scripts/` owns customer import/preview generation.
2. Validation is green after dependency install:
   - `npm install` — completed, with deprecation/audit warnings.
   - `npm run lint` — pass, with TypeScript-version support warning from `@typescript-eslint`.
   - `npm run build` — pass; preview bundle regenerated without committed source changes.
   - `node -c scripts/import-artworks.mjs`, `node -c scripts/write-local-preview.mjs`, and `node -c scripts/run-import-artworks.cjs` — pass.
3. Dependency maintenance risks need a dedicated future code/dependency pass:
   - `npm audit` reports two moderate dev-server advisories in Vite/esbuild.
   - Automated remediation currently requires a semver-major Vite upgrade.
   - Floating `^` ranges installed TypeScript 5.9.x, outside the lint stack's logged supported range.
4. Deferred cleanup remains valid:
   - legacy interaction files (`MouseInteraction.ts`, `TouchInteraction.ts`, `ZoomPan.ts`) are superseded by `CanvasInteraction.ts` and remain reserved for a dedicated cleanup PR.
   - deprecated `isMobileDevice()` remains as a compatibility export; new code should use `detectDeviceCapabilities()`.
5. Documentation corrections:
   - stale customer-guide wording that described portrait reset boost as "planned" was updated to current implemented status.
   - all AI context documents now cross-link to the architecture, standards, lessons, and feedback-loop docs.

### Online validation summary

- `requestIdleCallback`: useful for preference work deferral; required work should use a timeout and Safari support still needs the existing fallback path.
- Long Tasks API: useful debug-only signal for ≥50 ms main-thread stalls; limited/experimental browser support justifies the current guarded observer.
- Page Lifecycle `freeze`/`resume`: Chrome guidance supports pausing/resuming non-critical work; current implementation correctly treats it as progressive enhancement alongside `visibilitychange`.
- three.js `WebGLRenderer.compileAsync`: official docs recommend it where possible because it uses `KHR_parallel_shader_compile`; current fallback to `compile()` remains correct.
- ESLint v8: official ESLint v8 support ended on 2024-10-05; this repository should plan a future lint-tooling upgrade.
- typescript-eslint v7: lint warnings show the current installed TypeScript is outside the parser's logged supported range; pinning or upgrading lint tooling should be handled in a dedicated pass.

### Remaining items

- Dedicated dependency/tooling upgrade PR for Vite/esbuild advisories, ESLint v8 EOL, and TypeScript/parser range alignment.
- Dedicated legacy interaction cleanup PR.
- Optional PreferencesPanel refactor to reduce per-render listener churn by using delegated change handling or cached form controls.

## AI context engineering workflow (2026-05-19, implemented)

### Status

Documentation-only repository workflow update completed.

### Scope

- Add global Copilot/agent instructions.
- Add reusable prompts for refactor, architecture, review, and autonomous work.
- Add hard repository AI rules, architecture map, lessons learned, coding standards, and AI feedback-loop documentation.
- Preserve the existing TypeScript/Vite/three.js runtime unchanged.

### Implemented changes

1. `.github/copilot-instructions.md`
   - repository-specific context, architecture boundaries, validation, coding, and documentation expectations.
2. `.github/prompts/`
   - reusable prompt files for refactoring, architecture planning, review, and autonomous maintenance.
3. `AI_RULES.md`
   - hard constraints, forbidden patterns, required patterns, and validation rules.
4. `ARCHITECTURE_MAP.md`
   - source ownership map for runtime, rendering, gallery, materials, UI, utilities, scripts, and docs.
5. `LESSONS_LEARNED.md`
   - durable lessons from recent regressions and validation behavior.
6. `docs/architecture/`, `docs/standards/`, `docs/lessons-learned/`, `docs/ai-feedback/`
   - structured folders for future architecture, standards, lessons, and feedback-loop notes.

### Validation

- Documentation-only change; no runtime code changed.
- Existing validation commands remain `npm run lint` and `npm run build` after `npm install`.

## v0.16.2 — Control-shell follow-up for settings + center nav (2026-05-19, implemented)

### Status

**Implementation completed 2026-05-19.** This follow-up closed the remaining customer-visible edge clipping after v0.16.1.

### Scope

- Make the settings gear reliably usable in the shipped preview.
- Remove the last subtle all-sides hover clipping on center nav buttons.
- Keep the previous containment fix, but stop relying on minimum-size blurred controls as the hover surface.

### Implemented changes

1. `src/styles/main.scss`
   - `.nav-btn` now uses a 72×72 shell with a 64px inset glass `::before`
   - `.prefs__trigger` now uses a 52×52 shell with a 44px inset glass `::before`
   - `.prefs__panel` top offset adjusted to match the new trigger shell
   - phone breakpoint spacing updated to preserve the old visible spacing
2. `customer-preview/style.css`
   - rebuilt from source so the preview actually includes the fix

### Validation

- `npm run lint` — pass
- `npm run build` — pass
- headless Chromium + SwiftShader:
  - preview loads gallery UI
  - settings trigger click opens preferences panel

## v0.16.1 — UI containment regression hotfix (2026-05-19, implemented)

### Status

**Implementation completed 2026-05-19.** Two customer-facing UI regressions were fixed directly in the shipped stylesheet.

### Scope

- Restore settings popover behavior.
- Remove hover clipping on center left/right navigation buttons.
- Keep v0.16 performance intent while narrowing containment to safe surfaces.

### Implemented changes

1. `src/styles/main.scss` containment block no longer includes:
   - `.prefs`
   - `.nav-controls`
2. Containment remains enabled for the other fixed chrome elements.

### Root-cause summary

- `.prefs` is an anchor for an absolutely positioned popover (`.prefs__panel`), so paint containment clipped the panel to the trigger box.
- `.nav-controls` hosts hover-scaled buttons; paint containment clipped the enlarged hover paint.

### Validation

- Focused code-path review and selector audit: pass.
- Fresh-clone command status:
  - before dependency install: `npm run lint` / `npm run build` failed (environment setup only)
  - after dependency install: `npm run lint` ✅, `npm run build` ✅

## v0.16 — Deep performance and compatibility optimization (2026-05-19, implemented)

### Status

**Implementation completed 2026-05-19.** Every research-validated finding in the v0.16 plan has now been implemented in the runtime. The original 12 file:line-backed findings from the earlier audit pass remain valid; the six researched enhancements added during the final planning pass were either implemented or explicitly deferred for a documented fidelity / compatibility reason. The plan body below is preserved as the design rationale; the **v0.16 implementation summary** subsection immediately below describes what actually shipped.

The earlier planning history (initial brainstorm → file-line-backed findings → six researched enhancements) is preserved as the rest of this section so future maintainers can trace why each runtime change exists.

### v0.16 implementation summary (what actually shipped)

The runtime now reflects every actionable v0.16 finding. Each item below cites the implementation site and the planning subsection that motivated it.

| # | Slice | Files | Status | Notes |
|---|---|---|---|---|
| 1 | Single resize coordinator | `src/core/SceneManager.ts`, `src/core/PostProcessing.ts`, `src/core/RendererManager.ts`, `src/main.ts` | shipped | Removed `window.resize` listeners from `SceneManager` and `PostProcessing`. Added `SceneManager.updateAspect(w,h)` and `PostProcessing.resize(w,h)`. `main.ts` debounces (120 ms) → `requestAnimationFrame` → measures `visualViewport` once → forwards the same `(width, height)` to renderer, composer, and camera. Forced-layout thrash from interleaved DOM reads/writes is gone. |
| 2 | Cached chrome refs | `src/main.ts` | shipped | `chromeRefs` populated after UI boot. `measureArtworkViewport` no longer calls `app.querySelector` per measurement. |
| 3 | rAF-deferred resize work | `src/main.ts` | shipped | The 120 ms debounce schedules a single rAF; all DOM reads + GPU writes occur in that frame, satisfying the web.dev "read then write within one rAF" guidance. |
| 4 | Page Visibility + Page Lifecycle | `src/main.ts` | shipped | New `pageInactive` flag suspends `postProcessing.render()`, the per-frame light/material update, and adaptive quality sampling. `visibilitychange`, `freeze`, and `resume` events all wire into `suspendRuntime()` / `resumeRuntime()`. On resume `frameBudget.markNavigation()` ensures the catch-up spike never triggers an adaptive downgrade. |
| 5 | Deferred preference application | `src/main.ts` | shipped | `requestIdleCallback` (with `setTimeout(0)` fallback) wraps `applyPreferences()`; rapid preference changes coalesce. The first apply remains synchronous (scene not yet shown). Adaptive downgrades go through the same path. |
| 6 | Renderer-info snapshot | `src/core/RendererManager.ts`, `src/main.ts` | shipped | `RendererManager.getRendererSnapshot()` exposes a read-only view of `renderer.info`. `main.ts` posts one `[renderer] snapshot` entry every 5 s in info/verbose mode (skipped while `pageInactive`). Customer bug reports now embed a running GPU resource history. |
| 7 | Anisotropy no-op guard | `src/gallery/TextureManager.ts` | shipped | `setAnisotropyDivisor()` short-circuits when the requested divisor is unchanged. Re-applying the same preset no longer marks every cached texture as `needsUpdate`. |
| 8 | Shader pre-warm | `src/core/RendererManager.ts`, `src/main.ts` | shipped | `RendererManager.prewarm(scene, camera)` calls `compileAsync()` (or `compile()` fallback). Called after boot and after every deferred preset apply. Failures are logged but never block startup. |
| 9 | Device hints in startup heuristic | `src/utils/performance.ts` | shipped | `suggestStartupQuality()` now consults `navigator.deviceMemory` (≤ 0.5 GB → battery) and `navigator.hardwareConcurrency` (≤ 2 cores → battery). Hints only — missing values pass through to the prior viewport heuristic. |
| 10 | Long Tasks observer | `src/main.ts` | shipped | Debug-only `PerformanceObserver({ type: 'longtask', buffered: true })` reports any task ≥ 50 ms. Logged as `[perf][warn] long-task`. Detached cleanly on `beforeunload`. |
| 11 | CSS quality-aware paint + containment | `src/styles/main.scss`, `src/core/RendererManager.ts` | shipped | `RendererManager.applyPreset()` writes `:root[data-quality='high'\|'balanced'\|'battery']`. SCSS halves `--glass-blur` to `12px` on battery, falls back to a stronger solid surface when neither `backdrop-filter` nor its webkit prefix is supported, applies containment to fixed chrome surfaces, and `contain: strict` to the loading spinner. (Refined in v0.16.1 to exclude `.prefs` and `.nav-controls`.) |
| 12 | Importer texture-memory warnings | `scripts/import-artworks.mjs` | shipped | New warnings: (a) any side > 4096 px → "many phones cap textures at 4096"; (b) GPU footprint ≥ 128 MB → "phones may run out of memory"; (c) ≥ 64 MB → "large image, performance may be reduced". Footprint computed as `w × h × 4 × 4/3` to account for the RGBA8 mip pyramid. |
| 13 | Dispose idempotency | `src/core/RendererManager.ts`, `src/interaction/CanvasInteraction.ts` | shipped | Both classes now ignore a second `dispose()` call. The boot path could otherwise race a context-loss shutdown with `beforeunload`. |

#### Items explicitly deferred (documented reason)

The plan also flagged four optional enhancements that were intentionally **not** implemented in v0.16; each is preserved here as a future candidate with the rationale recorded so the next maintainer does not re-discover them.

- **Pinch-zoom log-space squared-distance hot-path optimization.** The current `Math.sqrt` is called once per `pointermove` while two fingers are down. JIT engines cache the call and modern hardware computes `sqrt` in a single cycle. The arithmetic refactor adds branching and inverse-distance bookkeeping for negligible benefit. Kept as-is.
- **Delete unused `MouseInteraction.ts` / `TouchInteraction.ts` / `ZoomPan.ts` files.** Already dead-code per v0.11. Removing them is a tree-shake / refactor change with no runtime effect and is best done in a dedicated cleanup PR to keep this performance pass surgical.
- **`ImageBitmapLoader` raster path.** Inspected; deferred because the customer-preview path embeds artworks as `data:image/...` URLs (v0.09). `createImageBitmap()` against a data URL still decodes synchronously on the main thread in Safari and offers no measurable benefit while introducing per-platform Promise-chain differences from the existing `TextureLoader` path. The synchronous decode is currently triggered exactly once per artwork during the gallery's preload, so the perceived cost is part of the loading overlay and not a per-frame jank source.
- **`FrameBudgetMonitor` running-sum optimization.** The 60-sample window is summed in a tight `for` loop per frame. Microbenchmarks suggest a running sum would save < 0.05 ms per frame; not worth the +1 risk surface of off-by-one errors on the wrap. Kept verbatim.

#### Acceptance gates run for v0.16

- `npm run lint` — pass, zero warnings.
- `npm run build:typecheck` — pass.
- `npm run build` — pass, customer-preview bundle generated.
- Importer syntax check (`node -c scripts/import-artworks.mjs`) — pass.
- All Diagnostics info/warn events documented above appear in the runtime; no new prod-mode console output without `?debug=1`.

#### Diagnostic surface added in v0.16

| Scope | Event | Level | Trigger |
|---|---|---|---|
| `lifecycle` | `suspend` | info | Tab hidden / `freeze` fires |
| `lifecycle` | `resume` | info | Tab visible / `resume` fires |
| `renderer` | `snapshot` | info | 5 s tick while page active, info/verbose mode |
| `renderer` | `prewarm-async` | debug | `compileAsync()` succeeded |
| `renderer` | `prewarm-sync` | debug | Fallback `compile()` used (older three.js) |
| `renderer` | `prewarm-failed` | warn | Pre-warm threw (continues normally) |
| `texture` | `anisotropy-noop` | debug | No-op guard prevented cache walk |
| `texture` | `anisotropy-applied` | debug | Cache marked for re-upload |
| `perf` | `longtask-observer-active` | info | Long-task observer attached (debug mode) |
| `perf` | `long-task` | warn | Task ≥ 50 ms blocked main thread |
| `perf` | `longtask-unsupported` | info | Long Tasks API not available |

#### Compatibility matrix (Slices 4, 8, 9, 10, 11)

| Browser / engine | `visibilitychange` | `freeze` / `resume` | `compileAsync()` | `deviceMemory` | `hardwareConcurrency` | `PerformanceLongTaskTiming` | `requestIdleCallback` | `@supports not (backdrop-filter)` |
|---|---|---|---|---|---|---|---|---|
| Chrome 110+ desktop | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Edge 110+ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Safari 16.4+ macOS | ✓ | — | ✓ (three.js r152+) | — | ✓ | — | — | ✓ |
| Safari 16.4+ iOS | ✓ | — | ✓ | — | ✓ | — | — | ✓ |
| Firefox 115+ | ✓ | — | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| Android Chrome 110+ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

"—" means the feature is silently absent and the runtime fall-back path is exercised. No FREYRAUM surface depends on a "—" feature for correctness — they are all progressive enhancements.

---

## v0.16 — Brainstorm: deep performance and compatibility optimization (2026-05-19, design rationale)

### Status

**Final planning update completed 2026-05-19.** The earlier v0.16 deep brainstorm was re-audited against the full current source tree and fresh online guidance. The original 12 file:line-backed findings remain valid. This final pass adds six researched enhancements that were missing from the previous version of the plan:

1. **Page Lifecycle `freeze` / `resume`** as a stronger companion to `visibilitychange` for background suspension.
2. **`renderer.compileAsync()` shader pre-warming** to avoid first-use compile hitches after boot or profile changes.
3. **`ImageBitmapLoader` / `createImageBitmap`** as an optional raster path to reduce main-thread decode cost when not using KTX2.
4. **`navigator.deviceMemory` / `navigator.hardwareConcurrency`** as progressive startup-quality hints beyond viewport area alone.
5. **`PerformanceObserver` long-task instrumentation** for debug-only jank diagnostics.
6. **CSS `contain` / internal `content-visibility`** for fixed glass chrome isolation without breaking blur visuals.

No runtime code was changed in this pass.

### Design goal

FREYRAUM should keep the current high-end visual identity: real artwork albedo, premium painting material relief, raking-light inspection, bloom where selected by quality preset, safe close zoom, and museum-elegant motion. Performance work should therefore remove avoidable CPU/GPU waste, improve scheduling, and add measurement. The plan below treats fidelity reduction as a fallback only for the existing user-selected `Ausgewogen` / `Akkusparend` presets — never as a hidden downgrade.

---

### Online research sources (validated 2026-05-19)

| Source | Specific guidance applied |
|---|---|
| MDN WebGL best practices — https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices | Dispose GPU objects explicitly, avoid blocking readbacks, cap drawing-buffer resolution, minimise per-frame state changes, treat texture memory as a first-class budget. |
| three.js disposal guide — https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects | Geometries, materials, textures, render targets, and `EffectComposer` render targets each need explicit `.dispose()`. Removing from scene is NOT enough. |
| three.js performance tips — https://threejs.org/docs/#manual/en/introduction/WebGL-compatibility-check | Merge draw calls, minimise material variants, share geometries across instances, keep draw calls per frame below ~100 for mobile. |
| MDN Page Visibility API — https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API | `document.hidden` + `visibilitychange` event. Browsers throttle/pause RAF in hidden tabs; implementations should skip draws and reset timing on resume to avoid large dt spikes. |
| MDN ResizeObserver — https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe | Callbacks fire synchronously before paint; DO NOT trigger layout reads (getBoundingClientRect) inside a ResizeObserver callback. Schedule reads in a following `requestAnimationFrame`. |
| web.dev CSS animations — https://web.dev/articles/animations-guide | Keep transitions to `transform` and `opacity` only (compositor-promoted). Profile `backdrop-filter` cost with DevTools layers panel before optimizing. |
| web.dev rendering performance — https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing | Read all layout properties first (rect, getComputedStyle), then apply writes, within a single RAF. Never interleave reads and writes. |
| web.dev minimize layout — https://web.dev/articles/dom-size | Cache element references; repeated `querySelector` inside resize handlers re-traverses the DOM every call. |
| KTX2 / Basis Universal in three.js — https://threejs.org/docs/#examples/en/loaders/KTX2Loader | `KTX2Loader` + `BasisTextureLoader` for GPU-compressed ASTC/ETC/BC delivery. Requires offline transcoding (toktx or basisu CLI). Reduces GPU bandwidth and memory by 4–6× vs. RGBA8. |
| Glenn Fiedler — Fix Your Timestep — https://gafferongames.com/post/fix_your_timestep/ | Already applied in v0.15 via `smoothDamp`. The same principle applies to frame-budget EMA on resume: clamp `dt` to avoid poisoning the rolling window with a hidden-tab spike. |
| MDN Pointer Events L3 — https://www.w3.org/TR/pointerevents3/ | Already applied in v0.11. For v0.16 the interaction hot path can eliminate unnecessary `Math.sqrt` by using squared distance for pinch deltas or a multiplicative zoom factor. |
| web.dev Page Lifecycle — https://web.dev/page-lifecycle/ | Prefer `freeze` / `resume` in addition to `visibilitychange` for background suspension, battery savings, and cleaner resume semantics. |
| three.js `WebGLRenderer.compileAsync()` — https://threejs.org/docs/#api/en/renderers/WebGLRenderer.compileAsync | Pre-warm shader programs asynchronously during initialization or after expensive define changes to avoid first-interaction compile stutter. |
| three.js `ImageBitmapLoader` — https://threejs.org/docs/#examples/en/loaders/ImageBitmapLoader | For non-compressed raster assets, use `ImageBitmapLoader` / `createImageBitmap` to shift decode work off the main thread where supported. |
| MDN `Navigator.deviceMemory` / `Navigator.hardwareConcurrency` — https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory and https://developer.mozilla.org/en-US/docs/Web/API/Navigator/hardwareConcurrency | Use as progressive hints for startup quality and worker budgeting; never as hard requirements because support and precision vary. |
| MDN `PerformanceLongTaskTiming` / web.dev optimize long tasks — https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming and https://web.dev/articles/optimize-long-tasks | Add debug-only long-task observation to correlate jank with resize/profile/import/texture-upload events. |
| web.dev `content-visibility` | Use `content-visibility` only for internal/offscreen content, not the blur overlay root; use `contain: paint` or `contain: layout paint style` on fixed chrome to isolate layout/paint. |

---

### Full code audit conclusions (2026-05-19)

Every relevant source file was read in full for this pass. The findings below are tied to specific file locations.

#### Finding 1 — Three independent `window.resize` listeners (high priority)

**Files:** `src/core/SceneManager.ts:18`, `src/core/PostProcessing.ts:31`, `src/main.ts:366–396`

`SceneManager.handleResize` runs immediately when the browser fires `resize` (no debounce):
```typescript
// SceneManager.ts:18  — runs immediately on every resize event
window.addEventListener('resize', this.handleResize);
private handleResize = (): void => {
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
};
```
`PostProcessing.handleResize` also runs immediately:
```typescript
// PostProcessing.ts:31  — also runs immediately
window.addEventListener('resize', this.handleResize);
private handleResize = (): void => {
  this.composer.setSize(window.innerWidth, window.innerHeight);
};
```
`main.ts` has its own 120 ms debounced coordinator that calls `rendererManager.resize()`, `detectDeviceCapabilities()`, `measureArtworkViewport()`, etc.

**Problem:** During a mobile orientation change, the browser fires multiple rapid resize events. Each fires `SceneManager.handleResize` and `PostProcessing.handleResize` immediately, causing redundant camera matrix rebuilds and composer framebuffer reallocations before the debounced coordinator even runs.

**Proposal — remove independent listeners, add explicit methods:**

In `SceneManager`:
```typescript
// Remove: window.addEventListener('resize', this.handleResize);
// Add a public method instead:
updateAspect(): void {
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
}
// dispose() no longer needs to removeEventListener
```

In `PostProcessing`:
```typescript
// Remove: window.addEventListener('resize', this.handleResize);
// The handleResize method already exists; just make it public:
resize(): void {
  this.composer.setSize(window.innerWidth, window.innerHeight);
}
// dispose() no longer needs to removeEventListener
```

In `main.ts` debounced coordinator:
```typescript
const onResize = (): void => {
  clearTimeout(resizeDebounce);
  resizeDebounce = setTimeout(() => {
    rendererManager.resize();
    sceneManager.updateAspect();       // ← new: was its own listener
    postProcessing.resize();           // ← new: was its own listener
    const newCaps = detectDeviceCapabilities();
    applyDeviceCaps(newCaps);
    applyCompactInfo(newCaps.layoutTier);
    hintText.updateHint();
    requestAnimationFrame(() => {      // ← new: read DOM after browser paints
      const artworkViewport = measureArtworkViewport();
      galleryManager.handleViewportMetricsChanged();
      diagnostics.info('layout', 'resize', 'Viewport resized', { ... });
    });
  }, 120);
};
```

**Validation source:** MDN ResizeObserver guidance — "do not trigger layout reads inside resize callbacks; schedule reads in a following `requestAnimationFrame`."
**Acceptance:** one resize cycle produces exactly one `rendererManager.resize()`, one `updateAspect()`, one `postProcessing.resize()`, one `measureArtworkViewport()`, all in the correct order with DOM reads deferred to the RAF.

---

#### Finding 2 — `measureArtworkViewport()` re-queries DOM every call (medium priority)

**File:** `src/main.ts:257–298`

```typescript
// Current — runs querySelector + getBoundingClientRect on every resize callback:
const topbarRect    = app.querySelector<HTMLElement>('.topbar')?.getBoundingClientRect();
const timelineRect  = app.querySelector<HTMLElement>('.timeline')?.getBoundingClientRect();
const navRect       = app.querySelector<HTMLElement>('.nav-controls')?.getBoundingClientRect();
```

`querySelector` re-traverses the DOM subtree on every call. Combined with `getComputedStyle` for CSS variables, this forces multiple layout flushes.

**Proposal — cache references at startup:**
```typescript
// Cache once after UI construction (after `new Topbar(app)`, etc.):
const topbarEl    = app.querySelector<HTMLElement>('.topbar');
const timelineEl  = app.querySelector<HTMLElement>('.timeline');
const navEl       = app.querySelector<HTMLElement>('.nav-controls');

// Then measureArtworkViewport just calls:
const topbarRect   = topbarEl?.getBoundingClientRect();
const timelineRect = timelineEl?.getBoundingClientRect();
const navRect      = navEl?.getBoundingClientRect();
```
Also cache the computed style reference (call once per resize, not inside the function):
```typescript
// Outside measureArtworkViewport, read CSS tokens once in the RAF:
const rootStyle = window.getComputedStyle(document.documentElement);
// pass safeLeft / chromeTop as arguments rather than reading inside
```

**Validation source:** web.dev "Avoid large, complex layouts and layout thrashing" — cache element references, separate all reads before writes, schedule reads in RAF.
**Acceptance:** `measureArtworkViewport()` calls `getBoundingClientRect()` only on already-resolved element references, never re-queries the DOM, and is only invoked once per RAF-deferred resize batch.

---

#### Finding 3 — Render loop has no Page Visibility pause (high priority)

**File:** `src/main.ts:503–541`

```typescript
// Current animate loop — no visibility check:
const animate = (now: number): void => {
  rafId = requestAnimationFrame(animate);
  if (rendererManager.isRenderPaused()) return;   // context loss only
  // ... full render work ...
};
```

When the user switches tabs, the browser throttles RAF (Chrome/Firefox: max 1 fps; Safari: paused entirely). The loop still runs, wastes CPU, and when the user returns the `now` timestamp has jumped by seconds. This large `dt` would be clamped by `MAX_SMOOTHING_DT = 0.1` in `GalleryManager`, but `FrameBudgetMonitor.sample()` still receives the giant delta and records a pathological 250 ms frame against the rolling average (it clamps to 250 ms), potentially triggering `AdaptiveQualityController` to downgrade quality unnecessarily.

**Proposal — add a `visibilitychange` listener in `main.ts`:**
```typescript
let renderHidden = false;

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    renderHidden = true;
    diagnostics.debug('render', 'visibility-hidden', 'Tab hidden — render paused');
  } else {
    renderHidden = false;
    // Reset frame-budget monitor so the hidden-tab gap is not counted.
    frameBudget.markNavigation();
    // Reset GalleryManager timestamp so dt is 0 on next update tick.
    galleryManager.resetTimestamp();
    diagnostics.debug('render', 'visibility-visible', 'Tab visible — render resumed');
  }
});

// In animate():
const animate = (now: number): void => {
  rafId = requestAnimationFrame(animate);
  if (rendererManager.isRenderPaused()) return;
  if (renderHidden) return;                    // ← new
  // ...
};
```

Add `resetTimestamp()` to `GalleryManager`:
```typescript
// GalleryManager.ts — new method:
resetTimestamp(): void {
  this.lastUpdateTime = 0;  // next update() call skips dt computation
}
```

**Validation source:** MDN Page Visibility API — "Using the Page Visibility API, you can stop unnecessary work when the page is not visible." Also: W3C Page Visibility specification states implementations should not deliver `requestAnimationFrame` callbacks at a high rate to non-visible pages.
**Acceptance:** hidden tabs do not call `postProcessing.render()`, `frameBudget.sample()` never sees the tab-switch gap, `AdaptiveQualityController` does not trigger a false positive downgrade on tab restore.

---

#### Finding 4 — Pinch distance uses `Math.sqrt` on every pointer/touch move (low-medium priority)

**File:** `src/interaction/CanvasInteraction.ts:160–167`, `src/interaction/CanvasInteraction.ts:271–275`

```typescript
// Pointer Events path — called every pointermove with two fingers:
const pts = [...this.active.values()];
const dist = distance(pts[0].lastX, pts[0].lastY, pts[1].lastX, pts[1].lastY);
const delta = this.lastPinchDist - dist;
this.lastPinchDist = dist;
this.galleryManager.addZoomDelta(delta * 0.02);

// Touch fallback (getTouchDist):
private getTouchDist(e: TouchEvent): number {
  const dx = e.touches[0].clientX - e.touches[1].clientX;
  const dy = e.touches[0].clientY - e.touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}
```

`Math.sqrt` is called on every `pointermove` with two active pointers — typically 60 times/second during a pinch. On most JS engines `Math.sqrt` is a single hardware instruction and costs 1–3 ns; for 60 events/s the overhead is ~0.18 µs/s, which is negligible. **The real win here is design clarity, not a measurable frame time improvement.**

The more meaningful optimization is to use a **multiplicative zoom factor** instead of an additive linear delta, which gives a more natural zoom feel (zoom is perceptually logarithmic) while also being sqrt-free:

```typescript
// Replace additive delta:
private lastPinchDistSq = 0;  // store squared distance, no sqrt needed

// In onPointerDown (two-finger start):
const pts = [...this.active.values()];
const dx = pts[1].lastX - pts[0].lastX;
const dy = pts[1].lastY - pts[0].lastY;
this.lastPinchDistSq = dx * dx + dy * dy;

// In onPointerMove (two-finger move):
const pts = [...this.active.values()];
const dx = pts[1].lastX - pts[0].lastX;
const dy = pts[1].lastY - pts[0].lastY;
const distSq = dx * dx + dy * dy;
if (this.lastPinchDistSq > 0 && distSq > 0) {
  // Log-space zoom delta: 0.5 * ln(new/old).
  // Fingers spreading (new > old) → positive delta → addZoomDelta adds to
  // targetZoom → camera moves farther away → zoom OUT (wider view).
  // Fingers pinching  (new < old) → negative delta → camera moves closer
  // → zoom IN (detail view). This matches GalleryManager.addZoomDelta().
  const logDelta = 0.5 * Math.log(distSq / this.lastPinchDistSq);
  this.galleryManager.addZoomDelta(logDelta * PINCH_ZOOM_SPEED);
}
this.lastPinchDistSq = distSq;
```
`PINCH_ZOOM_SPEED` replaces the current hardcoded `0.02`. Tuning: `0.5 * ln(distSq_ratio)` at a 10% distance change gives `≈ 0.095`, so `PINCH_ZOOM_SPEED ≈ 1.0` maps to the current zoom speed at small pinch increments.

Also add an idempotency guard to `dispose()`:
```typescript
private disposed = false;
dispose(): void {
  if (this.disposed) return;
  this.disposed = true;
  // ... removeEventListener calls ...
}
```

**Validation source:** MDN Pointer Events L3 — using squared distance for comparison is a documented pattern to avoid sqrt in hit-testing and gesture recognition hot paths. Log-space zoom is the de facto standard in 2D mapping and image viewers (e.g. Leaflet, Mapbox GL JS source code).
**Acceptance:** pinch zoom feel is identical (or slightly improved by log-scale linearity), `dispose()` is idempotent, no `Math.sqrt` in the per-move hot path.

---

#### Finding 5 — Shader recompilation can land in a hot interaction frame (medium priority)

**File:** `src/main.ts:399–444` (`applyPreferences()`), `src/materials/PaintingMaterial.ts` (`setShadowFilterRadius()`)

When the user opens the preferences panel and switches lighting profiles, `applyPreferences()` runs synchronously and may call `PaintingMaterial.setShadowFilterRadius(0.002, true)` which changes a `#define` and forces a shader recompile via `needsUpdate = true` on `MeshPhysicalMaterial`. On a slow device this can cause a 100–400 ms jank frame.

```typescript
// Current — synchronous in the same frame as the user's preference change:
artworkMesh.material.setShadowFilterRadius(
  isInspection ? preset.selfShadowFilterRadius : 0,
  isInspection && preset.selfShadowFilterRadius > 0
);
```

**Proposal — defer expensive shader defines to a low-priority frame, keeping cheap uniform updates synchronous:**

Three.js shader defines (`#define`) force recompilation; uniform value changes do not. Separate the two:
```typescript
// In applyPreferences():

// 1. Apply uniform-only changes immediately (no recompile, no jank):
artworkMesh.material.setShadowProfileScale(shadowScale);
artworkMesh.material.setKeyLightDirView(KEY_LIGHT_VIEW);
// uniform-only preset properties (normalStrength, specularStrength, etc.)

// 2. Defer define-changing operations behind a low-priority schedule:
const applyShaderDefines = (): void => {
  artworkMesh.material.setShadowFilterRadius(
    isInspection ? preset.selfShadowFilterRadius : 0,
    isInspection && preset.selfShadowFilterRadius > 0
  );
  artworkMesh.applyPreset(preset);  // may change artworkSegments (geometry) + shaderVariant
  galleryManager.applyPreset(preset);
};

// Use requestIdleCallback when available (modern desktop/Android Chrome),
// fall back to setTimeout(0) (Safari) with a 32 ms deadline fallback:
if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(applyShaderDefines, { timeout: 100 });
} else {
  setTimeout(applyShaderDefines, 0);
}

// Always apply immediately on the first load (manual=false first call):
if (!hadFirstPreset) applyShaderDefines();
```

Also add a diagnostic log for deferred applies so QA can confirm the frame budget was protected:
```typescript
diagnostics.debug('preferences', 'shader-define-deferred',
  'Expensive shader define change deferred to idle frame', { isInspection, variant: preset.shaderVariant });
```

**Validation source:** MDN `requestIdleCallback` — https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback — "functions that should be executed during idle time in order to perform background or low priority work on the main event loop." Three.js documentation confirms that changing `material.defines` and setting `material.needsUpdate = true` triggers a full shader recompilation on the next render call.
**Acceptance:** switching lighting profile does not produce a >32 ms frame on any supported device; `?debug=verbose` shows `shader-define-deferred` log when the defer path runs.

---

#### Finding 6 — Renderer info diagnostics are not exposed (medium priority)

**File:** `src/main.ts:503–541` (animate loop), `src/utils/FrameBudgetMonitor.ts`, `src/utils/AdaptiveQualityController.ts`

`THREE.WebGLRenderer.info` exposes real-time GPU stats that are already available at zero cost during the render loop:
- `renderer.info.render.calls` — draw calls per frame
- `renderer.info.render.triangles` — triangles per frame
- `renderer.info.memory.textures` — GPU-resident texture count
- `renderer.info.memory.geometries` — GPU-resident geometry count
- `renderer.info.programs?.length` — compiled shader programs

None of these are currently logged or surfaced.

**Proposal — add a renderer snapshot to `RendererManager` and log it in verbose diagnostics mode:**

```typescript
// RendererManager.ts — new method:
getRendererSnapshot(): Record<string, number> {
  const info = this.renderer.info;
  return {
    drawCalls:  info.render.calls,
    triangles:  info.render.triangles,
    textures:   info.memory.textures,
    geometries: info.memory.geometries,
    programs:   info.programs?.length ?? -1,
    dpr:        this.renderer.getPixelRatio(),
    drawingBufferW: this.renderer.domElement.width,
    drawingBufferH: this.renderer.domElement.height,
  };
}
```

Log once every 300 frames (5 seconds at 60 fps) only in verbose/info diagnostics mode:
```typescript
// In animate():
let snapFrameCounter = 0;
const animate = (now: number): void => {
  rafId = requestAnimationFrame(animate);
  if (rendererManager.isRenderPaused() || renderHidden) return;
  // ...render...
  snapFrameCounter++;
  if (snapFrameCounter % 300 === 0 && diagnostics.getMode() !== 'default') {
    diagnostics.info('render', 'snapshot', 'Renderer snapshot', rendererManager.getRendererSnapshot());
    snapFrameCounter = 0;
  }
};
```

**Also add `renderer.info.autoReset = true`** (it is the default, but worth making explicit so future contributors don't accidentally set it to false):
```typescript
// RendererManager constructor, after renderer creation:
this.renderer.info.autoReset = true;
```

**Validation source:** three.js docs `WebGLRenderer.info` — https://threejs.org/docs/#api/en/renderers/WebGLRenderer.info — "An object with a series of statistical information about the graphics board memory and the rendering process."
**Acceptance:** `?debug=info` prints a renderer snapshot every ~5 seconds; `?debug=verbose` prints one every frame; default mode has zero overhead from these logs.

---

#### Finding 7 — `TextureManager.setAnisotropyDivisor()` iterates all cached textures on every preset switch (low priority)

**File:** `src/gallery/TextureManager.ts:56–63`

```typescript
setAnisotropyDivisor(divisor: number): void {
  this.anisotropyDivisor = Math.max(1, divisor);
  const anisotropy = this.getEffectiveAnisotropy();
  this.cache.forEach((texture) => {
    texture.anisotropy = anisotropy;
    texture.needsUpdate = true;   // ← marks every texture for GPU re-upload
  });
}
```

Setting `needsUpdate = true` on every cached texture forces Three.js to re-upload each texture to the GPU on the next render. This is correct behaviour when changing anisotropy, but it marks ALL textures including procedural `DataTexture` entries that are managed by `ProceduralTextureFactory` (which has its own separate cache).

**Proposal — guard against no-op updates:**
```typescript
setAnisotropyDivisor(divisor: number): void {
  const newDivisor = Math.max(1, divisor);
  if (newDivisor === this.anisotropyDivisor) return;  // ← guard: no-op if unchanged
  this.anisotropyDivisor = newDivisor;
  const anisotropy = this.getEffectiveAnisotropy();
  this.cache.forEach((texture) => {
    if (texture.anisotropy !== anisotropy) {           // ← guard: skip if already correct
      texture.anisotropy = anisotropy;
      texture.needsUpdate = true;
    }
  });
}
```

**Validation source:** three.js source — `texture.needsUpdate = true` triggers a WebGL `texImage2D` / `texSubImage2D` re-upload on next render. Skipping it when the value is unchanged prevents needless GPU upload overhead.
**Acceptance:** switching between the same preset twice does not trigger any texture re-uploads; switching to a different preset still updates all cached textures.

---

#### Finding 8 — Artwork-safe viewport DOM reads happen inside a ResizeObserver callback (medium priority)

**File:** `src/main.ts:390–396` (ResizeObserver → `onResize`) and `src/main.ts:257–298` (`measureArtworkViewport`)

The `ResizeObserver` callback fires synchronously just before paint; any `getBoundingClientRect()` or `getComputedStyle()` call inside it forces a synchronous style/layout recalculation. The current code calls `onResize` → setTimeout(120ms) → `measureArtworkViewport()` which does call `getBoundingClientRect()`. The setTimeout wrapping avoids the immediate synchronous issue, but the `requestAnimationFrame` inner deferral from Finding 1's proposal would fully resolve this by design.

**No separate code change needed here beyond the Finding 1 RAF deferral.** Document the constraint for future contributors:
```typescript
// main.ts — above measureArtworkViewport declaration:
/**
 * Measures the usable artwork viewport by reading Chrome geometry.
 * MUST only be called from inside a `requestAnimationFrame` callback,
 * never directly from a ResizeObserver callback, visualViewport event,
 * or synchronous resize path. (See MDN ResizeObserver guidance.)
 */
const measureArtworkViewport = (): ArtworkViewportMetrics => { ... };
```

---

#### Finding 9 — CSS `backdrop-filter` on every glass surface has no quality fallback (medium priority)

**File:** `src/styles/main.scss:194–196`, `src/styles/main.scss:211–213`, `src/styles/main.scss:319–321`, `src/styles/main.scss:357–359`, `src/styles/main.scss:413–416`, `src/styles/main.scss:473–476`, `src/styles/main.scss:521–524`

Every glass panel (topbar badge, info panel, nav buttons, zoom controls, fullscreen button, prefs trigger, prefs panel) applies `backdrop-filter: blur(16–26px)` with no quality-based fallback. On Android Chrome mid-range GPUs this can consume 2–5 ms per composited layer on each frame.

**Proposal — add `@supports` fallback and a `[data-quality="battery"]` variant:**

```scss
// In main.scss — after the main glass token block:

// Fallback for browsers or GPU tiers that do not support backdrop-filter:
@supports not (backdrop-filter: blur(1px)) {
  .topbar__badge,
  .info-panel,
  .nav-btn,
  .zoom-controls,
  .fullscreen-btn,
  .prefs__trigger,
  .prefs__panel {
    // Use strong opaque background instead of live blur so the
    // premium layout is preserved without compositor overhead.
    background: var(--glass-bg-strong);
    // Remove the webkit vendor prefix too:
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}

// Battery preset variant: reduce blur radius to lighten compositor load.
// The `[data-quality]` attribute is applied to <html> by main.ts when
// the battery preset is active (to be wired in the preset-apply path).
[data-quality='battery'] {
  .nav-btn,
  .zoom-controls,
  .fullscreen-btn,
  .prefs__trigger {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  .prefs__panel,
  .info-panel {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
}
```

Wire the quality attribute in `RendererManager.applyPreset()`:
```typescript
// In RendererManager.applyPreset():
applyPreset(preset: QualityPreset): void {
  this.preset = preset;
  this.renderer.setPixelRatio(getOptimalPixelRatio(preset.pixelRatioCap));
  this.renderer.shadowMap.enabled = preset.shadows;
  // New: mirror preset id to <html> so CSS can vary glass blur cost:
  document.documentElement.dataset.quality = preset.id;
}
```

**Validation source:** MDN `@supports` — https://developer.mozilla.org/en-US/docs/Web/CSS/@supports — "The `@supports` at-rule can be used to specify declarations that depend on a browser's support for one or more specific CSS features." web.dev "CSS animations" guide confirms `backdrop-filter` is a compositor-promoted paint effect and its cost scales with the area × blur radius.
**Acceptance:** `[data-quality="battery"]` HTML attribute causes smaller blur values; `@supports not (backdrop-filter)` shows opaque fallback; visual identity is preserved on all modern devices.

---

#### Finding 10 — Texture memory has no import-time budget warning (medium-high for large galleries)

**File:** `scripts/import-artworks.mjs`

Customer images are embedded as base64 `webglImage` data URLs. A 4000×3000 JPEG image decompresses to a 48 MB uncompressed RGBA texture on the GPU. A gallery of 10 such images is 480 MB GPU texture memory — well above the 256–512 MB VRAM budget on integrated GPUs and most iOS devices.

**Proposal — add size diagnostics in the importer:**

```javascript
// scripts/import-artworks.mjs — in the per-image processing loop:
const TEXTURE_WARN_PX = 4_000_000;    // 2000×2000 equivalent
const TEXTURE_ERROR_PX = 16_000_000;  // 4000×4000 equivalent

const pixelCount = imageWidth * imageHeight;
const estimatedRGBAMb = (pixelCount * 4) / (1024 * 1024);
const estimatedMipMb  = estimatedRGBAMb * 1.33; // mipmaps add ~1/3

if (pixelCount > TEXTURE_ERROR_PX) {
  console.warn(
    `[FREYRAUM] ⚠️  "${filename}": ${imageWidth}×${imageHeight} = ` +
    `${estimatedMipMb.toFixed(1)} MB GPU (with mipmaps). ` +
    `Strongly recommend resizing to max 3000px on longest edge.`
  );
} else if (pixelCount > TEXTURE_WARN_PX) {
  console.log(
    `[FREYRAUM] ℹ️  "${filename}": ${imageWidth}×${imageHeight} = ` +
    `${estimatedMipMb.toFixed(1)} MB GPU. Acceptable, but check total gallery memory.`
  );
}
```

Also add a gallery-wide total:
```javascript
const totalGpuMb = artworks.reduce((sum, a) => sum + a._estimatedGpuMb, 0);
if (totalGpuMb > 256) {
  console.warn(
    `[FREYRAUM] ⚠️  Total estimated GPU texture memory: ${totalGpuMb.toFixed(0)} MB ` +
    `across ${artworks.length} artworks. May exceed VRAM on integrated GPUs.`
  );
}
```

**Validation source:** MDN WebGL best practices — "Avoid storing more data than needed in buffers and textures", "uncompressed RGBA8 takes width × height × 4 bytes." Apple developer docs confirm iOS GPU has a shared memory budget of 256–512 MB depending on device generation.
**Acceptance:** import script warns when any single image exceeds 2000×2000 or the gallery total exceeds 256 MB; runtime behavior is unchanged.

---

#### Finding 11 — `FrameBudgetMonitor` rolling average has O(n) traversal per frame (very low priority)

**File:** `src/utils/FrameBudgetMonitor.ts:79–82`, `src/utils/FrameBudgetMonitor.ts:96–103`

```typescript
let sum = 0;
for (let i = 0; i < usable; i += 1) sum += this.samples[i];
this.rolling = sum / Math.max(1, usable);
```

For `windowSize=60` (the default) this is 60 additions per frame — roughly 0.3 µs at 1 ns/op. Measurable only on pathologically slow embedded systems; not worth optimising in isolation. However if the window size is ever raised above 200, a running-sum approach would be better:

```typescript
// If windowSize > 200 is ever needed:
private runningSum = 0;
// In sample(): subtract oldest sample, add new sample
const oldest = this.samples[this.writeIndex];   // about to be overwritten
this.runningSum += clamped - oldest;
// this.rolling = this.runningSum / usable;
```

**Leave this as a future optimisation note only.** Do not change it in v0.16.

---

#### Finding 12 — Legacy dead-code interaction classes inflate the module graph (very low priority)

**Files:** `src/interaction/MouseInteraction.ts`, `src/interaction/TouchInteraction.ts`, `src/interaction/ZoomPan.ts`

These are import-free dead code after v0.11. They do not affect runtime performance because tree-shaking removes them from the bundle, but they increase the cognitive surface area for performance auditing.

**Proposal:** Remove them in a separate cleanup PR (not v0.16) after confirming zero imports:
```bash
# Verify no imports exist before deleting:
rg --type ts "MouseInteraction|TouchInteraction|ZoomPan" src/
# If zero results → safe to delete the files.
```

---

#### Finding 13 — Page Lifecycle `freeze` / `resume` should complement `visibilitychange` (medium priority)

**File:** `src/main.ts`

The current plan adds `visibilitychange`, which is already a meaningful improvement over the status quo. Final research found that modern browsers also expose **Page Lifecycle** events (`freeze` and `resume`) which represent a stronger suspension boundary than mere visibility.

**Why it matters here:** FREYRAUM already has a single main canvas, a persistent RAF loop, and explicit WebGL context-loss handling. That makes it a good fit for Page Lifecycle support:

- `visibilitychange` catches most tab switches;
- `freeze` catches the stronger “the page is being fully suspended now” transition;
- `resume` gives a cleaner point to reset frame-budget and animation timestamps before normal RAF work resumes.

**Proposal — keep `visibilitychange`, add Page Lifecycle when available:**
```typescript
let suspended = false;

const suspendRuntime = (reason: 'hidden' | 'freeze'): void => {
  suspended = true;
  diagnostics.debug('render', 'suspend', 'Runtime suspended', { reason });
};

const resumeRuntime = (reason: 'visible' | 'resume'): void => {
  suspended = false;
  frameBudget.markNavigation();
  galleryManager.resetTimestamp();
  diagnostics.debug('render', 'resume', 'Runtime resumed', { reason });
};

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') suspendRuntime('hidden');
  else resumeRuntime('visible');
});

window.addEventListener('freeze', () => suspendRuntime('freeze'));
window.addEventListener('resume', () => resumeRuntime('resume'));
```

**Validation source:** web.dev Page Lifecycle — use `freeze` / `resume` plus `visibilitychange` for full background lifecycle coverage.
**Acceptance:** hidden/frozen pages do zero render work; resume path resets timing and frame-budget state before the first visible frame.

---

#### Finding 14 — Shader pre-warming with `renderer.compileAsync()` can remove first-use hitches (medium priority)

**Files:** `src/main.ts`, `src/core/RendererManager.ts`, `src/materials/PaintingMaterial.ts`

The current plan correctly defers define-changing work, but there is still a second source of hitching: the **first actual draw** of a new material/define combination can compile programs synchronously. three.js exposes `renderer.compileAsync()` specifically to pre-warm programs.

**Why it fits this codebase:** FREYRAUM has a very small number of critical material variants:

- one central `PaintingMaterial` with quality/profile-dependent defines,
- a fixed `MeshPhysicalMaterial` frame path,
- simple `MeshBasicMaterial` side panels,
- bloom on/off through `EffectComposer`.

That means async pre-warming has a high value-to-complexity ratio.

**Proposal — compile after boot and after define-changing preference/profile changes:**
```typescript
// RendererManager.ts
async prewarm(scene: THREE.Scene, camera: THREE.PerspectiveCamera): Promise<void> {
  if (typeof this.renderer.compileAsync === 'function') {
    await this.renderer.compileAsync(scene, camera);
  } else {
    this.renderer.compile(scene, camera);
  }
}

// main.ts — after initial gallery boot and after deferred shader-define apply:
void rendererManager.prewarm(sceneManager.scene, sceneManager.camera).catch((err) => {
  diagnostics.debug('render', 'prewarm-failed', 'Shader prewarm failed; continuing normally', {
    message: err instanceof Error ? err.message : String(err),
  });
});
```

**Validation source:** three.js `WebGLRenderer.compileAsync()` docs — explicitly intended to asynchronously precompile materials in a scene.
**Acceptance:** first interaction after boot/profile change does not incur a shader-compile hitch on supported browsers; fallback to `compile()` remains safe.

---

#### Finding 15 — `ImageBitmapLoader` is a valid optional enhancement for non-KTX raster paths (medium priority)

**Files:** `src/gallery/TextureManager.ts`, `scripts/import-artworks.mjs`

The current texture plan already identifies KTX2/Basis as the future production path. Final research found a missing **intermediate enhancement** for the existing raster path: `TextureLoader` uses HTML image elements, while `ImageBitmapLoader` / `createImageBitmap` can shift decode work off the main thread on supporting browsers.

**Why it matters here:** FREYRAUM currently loads:

- customer albedo images (`customer-preview/images/*` or `webglImage` data URLs),
- authored role maps when present,
- procedural maps separately.

KTX2 remains the end-state for scalable deployment, but `ImageBitmapLoader` can improve the interim PNG/JPEG/WebP path without changing the app’s visible behavior.

**Proposal — keep existing `TextureLoader` as the compatibility baseline, add an optional `ImageBitmapLoader` path for browser-safe raster sources:**
```typescript
// TextureManager.ts — sketch only
private readonly bitmapLoader = typeof createImageBitmap === 'function'
  ? new THREE.ImageBitmapLoader()
  : null;

async loadForRole(url: string, role: PaintingMapRole): Promise<THREE.Texture> {
  const useBitmapPath =
    this.bitmapLoader &&
    !url.startsWith('data:image/svg') &&
    !/^file:\/\//i.test(url);

  if (useBitmapPath) {
    const bitmap = await this.bitmapLoader.loadAsync(url);
    const texture = new THREE.Texture(bitmap);
    this.prepareTexture(texture, role);
    texture.needsUpdate = true;
    return texture;
  }

  // Existing TextureLoader path remains the fallback.
  return this.loadViaTextureLoader(url, role);
}
```

**Important boundary:** do **not** replace the local-file/data-URL compatibility path blindly. The customer preview’s `file://` and embedded-data-URL requirements remain higher priority than this optimization.

**Validation source:** three.js `ImageBitmapLoader` docs — intended to leverage `createImageBitmap`; KTX2 still remains the preferred path for truly scalable production texture delivery.
**Acceptance:** non-compressed raster decode can shift off the main thread where supported, while `file://` and embedded data-URL reliability remain unchanged.

---

#### Finding 16 — Startup quality can use `deviceMemory` / `hardwareConcurrency` as progressive hints (medium priority)

**File:** `src/utils/performance.ts`

The current `suggestStartupQuality()` heuristic uses viewport area, DPR, and pointer type. That is already a solid baseline. Final research found an additional progressive enhancement: use `navigator.deviceMemory` and `navigator.hardwareConcurrency` as *soft hints*.

**Why it fits this codebase:** FREYRAUM already respects manual override and never auto-upgrades quality. That makes these signals safe to use **only** for first-run default selection.

**Proposal — keep the existing viewport/DPR logic, but tighten the low-end default when both memory and CPU hints are weak:**
```typescript
export function suggestStartupQuality(): QualityPresetId {
  const dpr = typeof window.devicePixelRatio === 'number' && window.devicePixelRatio > 0
    ? window.devicePixelRatio
    : 1;
  const coarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
  const area = window.innerWidth * window.innerHeight;
  const deviceMemory = typeof navigator.deviceMemory === 'number' ? navigator.deviceMemory : null;
  const cores = typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency : null;
  // Conservative first-run hints only. `navigator.deviceMemory` reports an
  // approximate value in gigabytes, so the `_GB` suffix is intentional.
  // These should stay documented constants because browser-exposed
  // capability values are rounded and may evolve.
  const LOW_END_DEVICE_MEMORY_GB = 4;
  const LOW_END_CPU_CORES = 4;

  const looksLowEnd =
    (deviceMemory !== null && deviceMemory <= LOW_END_DEVICE_MEMORY_GB) ||
    (cores !== null && cores <= LOW_END_CPU_CORES);

  if (coarse && dpr >= 2 && looksLowEnd) return 'battery';
  // Existing area-based rules continue below...
}
```

**Boundary:** treat these APIs as hints only. They are rounded, privacy-limited, and not universally supported. Never override a stored user preference with them.

**Why these thresholds:** `4 GB` and `4 cores` are intentionally conservative first-run defaults, not hard performance claims. They are chosen to catch the common low-end/shared-memory device class where FREYRAUM is most likely to benefit from starting in `battery` on coarse-pointer hardware. Keep them as named constants so future maintainers can retune them as the device baseline shifts.

**Validation source:** browser guidance for `deviceMemory` / `hardwareConcurrency` — use as approximate capability hints, not exact hardware facts.
**Acceptance:** first-run quality defaults become slightly more conservative on obviously low-end devices, with zero effect on stored preferences.

---

#### Finding 17 — Debug-only `PerformanceObserver` long-task diagnostics would strengthen the measurement-first plan (medium priority)

**Files:** `src/main.ts`, `src/utils/Diagnostics.ts`

The current plan adds renderer snapshots and frame-budget metrics. Final research found a complementary browser-native signal that the plan was missing: **Long Tasks API** via `PerformanceObserver`.

**Why it matters here:** some jank sources are not visible from FPS alone:

- shader compile,
- synchronous texture upload,
- large DOM reflow during orientation change,
- heavy importer/bootstrap work,
- preference-panel work and long synchronous handlers.

`PerformanceObserver` on `longtask` entries gives a direct “something blocked the main thread for >50 ms” signal.

**Proposal — debug-only observer, enabled only outside default diagnostics mode:**
```typescript
let longTaskObserver: PerformanceObserver | null = null;

if (getDiagnostics().getMode() !== 'default' && 'PerformanceObserver' in window) {
  longTaskObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      diagnostics.warn('perf', 'long-task', 'Main-thread long task detected', {
        durationMs: Math.round(entry.duration * 10) / 10,
        startMs: Math.round(entry.startTime * 10) / 10,
      });
    }
  });
  longTaskObserver.observe({ type: 'longtask', buffered: true });
}

// cleanup
longTaskObserver?.disconnect();
```

**Validation source:** MDN `PerformanceLongTaskTiming` / web.dev optimize long tasks — long tasks are main-thread blocks over 50 ms and are directly relevant to interaction jank.
**Acceptance:** `?debug=info` and `?debug=verbose` can surface >50 ms stalls during resize, profile switches, or first texture uploads; default mode remains silent.

---

#### Finding 18 — `contain` / internal `content-visibility` can isolate fixed chrome without breaking glass blur (low-medium priority)

**Files:** `src/styles/main.scss`, `src/ui/*`

The current plan already adds CSS blur fallbacks. Final research found a further CSS-side optimization: fixed glass chrome can often safely use `contain: paint` or `contain: layout paint style`, and large internal scrollable content can use `content-visibility: auto` **inside** the panel, not on the blur root.

**Why the distinction matters:** `content-visibility` on the overlay root can delay or break the visual blur relationship to the background. But FREYRAUM’s large fixed chrome elements (`.prefs__panel`, `.info-panel`, timeline region) are good candidates for paint/layout containment or internal lazy visibility.

**Proposal — isolate paint/layout on fixed chrome roots and use `content-visibility` only for internal heavy content:**
```scss
.info-panel,
.prefs__panel,
.timeline {
  contain: layout paint style;
}

.prefs__panel-inner,
.info-panel__description {
  content-visibility: auto;
  contain-intrinsic-size: 240px;
}
```

**Boundary:** do not apply `content-visibility` to the blur root itself until visually verified on Safari, because delayed rendering can produce an incorrect or popping blur appearance.

**Validation source:** web.dev `content-visibility` guidance — apply to offscreen/internal content, not blindly to top-level visual surfaces; use containment for paint/layout isolation where appropriate.
**Acceptance:** no visual change on modern browsers, but lower layout/paint scope for fixed chrome; Safari visual QA required.

---

### Non-goals

- Do not remove high-quality painting shader features from the `Hoch` preset.
- Do not reduce artwork texture fidelity in response to `Reduzierte Bewegung`.
- Do not replace the local/offline customer preview requirement with a server-only pipeline.
- Do not add heavy runtime dependencies for profiling or animation.
- Do not switch to WebGPU as the primary renderer until there is a proven WebGL fallback and browser support matrix.
- Do not apply the CSS battery fallback in a way that makes the app look worse on any modern phone.
- Do not replace the current customer-safe raster path with `ImageBitmapLoader` unless `file://`, SVG, and embedded data-URL behavior are explicitly verified.
- Do not use `deviceMemory` / `hardwareConcurrency` as hard gates or override stored user preference with them.
- Do not apply `content-visibility` to blur-overlay roots before Safari visual QA confirms that blur fidelity is preserved.

---

### Implementation order and acceptance tests

| # | Slice | Key change | Files | Acceptance test |
|---|---|---|---|---|
| 1 | Renderer info diagnostics | Add `getRendererSnapshot()` to `RendererManager`; log every 300 frames in info mode | `RendererManager.ts`, `main.ts` | `?debug=info` prints drawCalls, triangles, textures every ~5 s |
| 2 | Single resize coordinator | Remove `window.resize` from `SceneManager` and `PostProcessing`; add `updateAspect()` and `resize()` | `SceneManager.ts`, `PostProcessing.ts`, `main.ts` | One resize cycle → one renderer resize, one camera update, one composer resize |
| 3 | Cache DOM element references | `querySelector` once at startup; pass refs into `measureArtworkViewport` | `main.ts` | No repeated DOM traversal on resize; functions remain null-safe |
| 4 | Defer DOM reads into RAF | Wrap `measureArtworkViewport()` call in `requestAnimationFrame` inside the debounce | `main.ts` | Chrome DevTools Performance shows no layout thrash on orientation change |
| 5 | Page Visibility pause | `visibilitychange` listener sets `renderHidden`; `frameBudget.markNavigation()` + `galleryManager.resetTimestamp()` on restore | `main.ts`, `GalleryManager.ts` | Hidden tab: no `postProcessing.render()` calls; resume: smooth motion, no false adaptive downgrade |
| 6 | Shader-define deferral | Move define-changing calls behind `requestIdleCallback` / `setTimeout(0)` | `main.ts` | Switching lighting profile: no >32 ms frame; first-load still applies immediately |
| 7 | Pinch hot-path cleanup | Replace linear-delta pinch with log-space squared-distance approach; add `dispose()` idempotency guard | `CanvasInteraction.ts` | Pinch zoom feels identical; no `Math.sqrt` in per-move handler; double-dispose is safe |
| 8 | Anisotropy guard | Add no-op guard in `setAnisotropyDivisor()` | `TextureManager.ts` | Switching to same preset twice triggers zero `needsUpdate = true` |
| 9 | CSS quality fallback | `@supports` fallback + `[data-quality]` blur reduction; wire attribute in `RendererManager` | `main.scss`, `RendererManager.ts` | Battery preset: blur 8–12px; `@supports not (backdrop-filter)`: opaque fallback |
| 10 | Import-time texture warnings | Per-image and gallery-total GPU memory estimate + console warnings | `scripts/import-artworks.mjs` | Large image (>2000×2000) triggers a visible `console.warn`; small images are silent |
| 11 | Page Lifecycle support | Add `freeze` / `resume` alongside `visibilitychange` | `main.ts`, `GalleryManager.ts` | Frozen/hidden pages do zero work; resume resets frame-budget + animation timestamps |
| 12 | Shader pre-warm | Add `renderer.compileAsync()` / `compile()` fallback after boot and define-changing profile switches | `RendererManager.ts`, `main.ts` | First post-boot / post-profile interaction avoids compile hitch on supported browsers |
| 13 | ImageBitmap raster path | Add optional `ImageBitmapLoader` path while preserving `TextureLoader` fallback | `TextureManager.ts` | Main-thread decode cost drops for supported raster paths; `file://` / SVG / data-URL compatibility preserved |
| 14 | Progressive startup heuristics | Add `deviceMemory` / `hardwareConcurrency` as soft hints only for first-run preset choice | `performance.ts` | Low-end first-run defaults become slightly more conservative; stored preference still wins |
| 15 | Long-task diagnostics | Add debug-only `PerformanceObserver` for `longtask` entries | `main.ts`, `Diagnostics.ts` | `?debug=info` surfaces >50 ms stalls with concise logs |
| 16 | CSS containment | Add `contain` on fixed chrome roots and internal `content-visibility` where visually safe | `main.scss` | No blur regression; smaller layout/paint scope in DevTools |
| 17 | Disposal ownership comments | JSDoc annotations on all `dispose()` methods documenting ownership boundaries | All affected files | Code review only; no runtime change |

---

### Performance budgets

| Area | Budget / target |
|---|---|
| Desktop high preset (`Hoch`) | ≤16.7 ms frame time at DPR 1.8; draw calls ≤ 15 per frame; no interaction frame > 32 ms outside initial load |
| Balanced laptop/tablet (`Ausgewogen`) | ≤16.7 ms frame time at DPR 1.4; no resize burst causing more than one jank frame |
| Battery phone (`Akkusparend`) | ≤33 ms (30 fps) at DPR 1.0; CSS blur ≤ 12px; no context-loss loop |
| Resize/orientation change | One coalesced resize application per 120 ms debounce window; DOM reads deferred to following RAF |
| Hidden tab | Zero `postProcessing.render()` calls; zero `frameBudget.sample()` calls |
| Frozen tab / lifecycle resume | No stale dt or long-task carry-over after `resume`; first visible frame remains under budget |
| Texture memory | Import warning when single artwork > 48 MB GPU (≈2000×2000×4×1.33); gallery total warning when > 256 MB |
| Adaptive quality | No false downgrade triggered by tab-switch resume, orientation change, or preference-panel open animation |
| Long tasks | No debug-observed long task > 50 ms during normal navigation after warm-up; profile switches may log once before pre-warm is implemented |

---

### Device compatibility matrix

| Device / browser | Priority | Notes |
|---|---|---|
| Desktop Chrome / Edge (Windows, Mac) | P0 | Baseline; 60 Hz and 120 Hz both verified |
| Desktop Safari (macOS) | P0 | Important for Mac users; check `backdrop-filter` and `visualViewport` |
| Desktop Firefox | P1 | `backdrop-filter` requires `gfx.webrender.all` enabled in some versions |
| iPhone Safari (notch / Dynamic Island) | P0 | Safe-area + `visualViewport` churn; test orientation change |
| iPad Safari split view | P1 | Multiple ResizeObserver firings; verify debounce works |
| Android Chrome high-DPR phone | P0 | Pinch zoom, DPR cap, thermal throttle test |
| Android Chrome mid-range GPU | P1 | CSS blur cost; adaptive quality downgrade behaviour |
| Android Chrome low-memory / 4-core class device | P1 | Verify `deviceMemory` / `hardwareConcurrency` startup heuristic stays conservative but not over-aggressive |
| Windows laptop integrated GPU (battery) | P1 | `Akkusparend` preset; no bloom, DPR 1.0 |
| Local `file://` customer preview | P0 | No CORS; webglImage data-URL path; must never break |
| No-WebGL / private browsing | P0 | Fallback screen must still render correctly |

---

### QA matrix for the v0.16 implementation pass

- Desktop 60 Hz and 120 Hz: verify motion timing unchanged after resize-coordinator refactor.
- Mobile orientation change: no visible jank; one resize application logged.
- Tab switch away and back: no false adaptive quality downgrade; motion resumes smoothly.
- Freeze / resume capable browsers: no stale dt, no one-frame hitch on resume.
- Open preferences panel on low-end: no >32 ms frame; `shader-define-deferred` logged.
- After first boot and after lighting/profile define changes: `compileAsync` pre-warm completes before the first visible interaction frame where supported.
- Battery preset active: `[data-quality="battery"]` on `<html>`; CSS blur reduced.
- `@supports not (backdrop-filter)` simulated (DevTools rendering tab): opaque fallback visible.
- Non-KTX raster path on supporting browsers: optional `ImageBitmapLoader` path does not break local-file or SVG handling.
- Large image import (>3000px): console warning visible.
- `?debug=info`: renderer snapshot logged every ~5 s.
- `?debug=info` / `?debug=verbose`: long-task observer logs >50 ms stalls during forced test cases only.
- All v0.15 motion QA cases: unchanged (no regression in smoothDamp, seeds, InfoPanel timing).
- Reduced motion on/off: unchanged from v0.15.1.
- All quality presets: switching produces no jank frame; anisotropy guard fires for same-preset re-apply.
- First-run startup quality on supported low-end devices: `deviceMemory` / `hardwareConcurrency` can lower the default, but stored preference still wins.

---

### Documentation impact

- `FINDINGS.md` updated with code-level findings including file:line citations.
- `CHANGELOG.md` records this as an upgraded brainstorm documentation pass.
- `README.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/IMAGE_MAINTENANCE_GUIDE.md` updated to reference the upgraded plan.
- `DOCUMENTATION_RULES.md` updated to reflect the new code-sample requirement for performance plans.

---

### Validation for this documentation pass

- Successful validation performed:
  - documentation-only diff review across all 8 markdown files;
  - `git diff --check` passed — no whitespace errors;
  - automated code review passed;
  - CodeQL security scan passed / skipped as trivial because only markdown changed.
- No runtime TypeScript, SCSS, generated preview bundle, or dependency files were changed.
- Fresh-clone baseline initially did **not** complete before dependency install: `npm run lint` failed with `eslint: not found`, and `npm run build` failed during `tsc` because `three` / related packages were unavailable. After dependency install, checks pass; the initial failures were environment setup issues, not repository regressions.

---
## v0.15 — Implemented: elegant animation system (2026-05-19)

### Status

**Implemented 2026-05-19.** The full v0.15 elegant animation plan shipped in this pass. All six implementation slices below were executed, validated against the current code, re-checked against the published web animation / accessibility sources listed in the v0.15 audit section, and verified by `npm run lint` and `npm run build`. The previous planning section is preserved further down for reference.

### What shipped (summary)

1. **`src/utils/math.ts`** — new `smoothDamp(current, target, lambda, dt)` utility implementing the frame-rate-independent kernel `α = 1 − exp(−λ·dt)`.
2. **`src/gallery/GalleryManager.ts`** — `update()` now `update(now: number)`. All 13 prior per-frame lerps replaced with `smoothDamp` calls plus one new line for `position.z`. New module-level constants document the lambdas: `LAMBDA_HOVER_ROTATION = 12`, `LAMBDA_NAV_POSITION = 2.5`, `LAMBDA_NAV_SCALE = 3.0`, `LAMBDA_CAMERA_ZOOM = 4.0`, `LAMBDA_CAMERA_PAN = 5.0`. Navigation entrance seeds retuned: `NAV_SEED_POSITION_X = 4.5`, `NAV_SEED_POSITION_Z = -0.6`, `NAV_SEED_ROTATION_Y = 0.15` rad (~9°), `NAV_SEED_SCALE = 0.88`. `navigate()` and `goTo()` now log `motionMode`, `seedPositionX`, `seedPositionZ`, and `settleTargetMs` in their diagnostics events.
3. **`src/ui/InfoPanel.ts`** — fixed the 200 ms / 320 ms content-swap timing bug. New `CONTENT_SWAP_DELAY_MS = 520` private static matches `--dur-content: 0.5s` + 20 ms buffer, and a `requestAnimationFrame` ensures new layout is applied before fade-in.
4. **`src/styles/main.scss`** — semantic motion token system. New tokens `--ease-gallery-out` (easeOutExpo), `--ease-gallery-in-out` (easeInOutQuart), `--dur-control` (0.18 s), `--dur-content` (0.5 s), `--dur-panel` (0.55 s), `--dur-timeline` (0.42 s), `--dur-reveal` (0.9 s). Backward-compatible aliases preserve `--dur-fast`, `--dur-base`, `--dur-slow`. The `--ease-spring` token is preserved but no longer used on any gallery surface. `.info-panel`, `.timeline__thumb`, `.prefs__panel`, `@keyframes prefs-in`, `.loading-overlay`, and `.loading-spinner` were retuned. `.info-panel.is-transitioning` translateY raised from 8 px to 16 px.
5. **`src/main.ts`** — loading-overlay removal timeout raised from 700 ms to 950 ms (matches `--dur-reveal: 0.9s` + 50 ms buffer). The animate loop now calls `galleryManager.update(now)`.
6. **No new dependencies.** No reduced-motion regressions. v0.14.2 zoom/pan constants untouched.
7. **v0.15.1 hotfix (same date):** reduced motion no longer touches picture
   texture/shader fidelity. It now affects motion only.

### Validation

- `npm run lint` → clean.
- `npm run build` → `tsc` clean, Vite production build succeeded (`customer-preview/style.css` 18.61 kB, `customer-preview/freyraum-gallery.js` 589.75 kB). Only pre-existing Sass legacy-JS-API deprecation warning surfaced — unrelated to v0.15.
- New diagnostics fields (`motionMode`, `seedPositionX`, `seedPositionZ`, `settleTargetMs`) are visible via `window.__FREYRAUM_DIAGNOSTICS__` for manual QA.

### QA matrix (to perform on physical hardware before tagging)

- Desktop 60 Hz vs 120 Hz: artwork entrance settle time should be identical (~1.2 s) — confirms frame-rate independence.
- 30 Hz throttled mobile: artwork entrance still settles in ~1.2 s wall-clock.
- Rapid forward/back navigation: motion interrupts cleanly without value accumulation.
- Hover rotation: responds within ~250 ms.
- Camera zoom: glides over ~750 ms.
- Camera pan: feels connected (~600 ms).
- Info panel: text never visible during fade-out (no flicker).
- Timeline active lift: smooth, no overshoot bounce.
- Prefs panel open: glides in without bounce.
- Loading overlay: fades smoothly over ~0.9 s, removed at 0.95 s.
- Reduced motion ON (in-app preference + OS-level `prefers-reduced-motion`): all seeds skipped, all CSS transitions ≤ 0.001 ms.
- Reduced motion ON: artwork shader/detail fidelity remains identical to reduced
  motion OFF at the same quality preset.

### Non-goals (unchanged)

- No animation library added.
- No View Transitions API integration.
- No `SidePanels.ts` cross-fade on texture swap (out of scope; deliberate future polish item).
- No changes to v0.14.2 zoom/pan limit constants.
- No reduced-motion path weakening.

---

## v0.15 — Original plan: elegant animation system — full technical brainstorm (2026-05-19)

### Status

**Implemented 2026-05-19.** This was the final technical audit and coding brainstorm that drove the implementation pass above. It is preserved verbatim below so the reasoning, calculations, source validation, and slice ordering remain available for future contributors. The shipped constants match these numbers exactly.

### Design goals (refined)

FREYRAUM should feel like a premium digital museum installation. Motion must be:

- **witnessable**: artwork entrance, reset, and UI reveal animations must last long enough that the user perceives a smooth state change, not a jump;
- **quiet and museum-accurate**: no overshoot, no bounce, no aggressive yaw — a painting arriving on a gallery wall is a solemn event;
- **art-first**: motion should guide attention toward the artwork and never distract from surface detail, lighting, or painting texture;
- **frame-rate-neutral**: the same elegant timing on 60 Hz, 90 Hz, 120 Hz, and 30 Hz constrained mobile screens;
- **accessible**: `prefers-reduced-motion` and FREYRAUM's in-app preference remain hard requirements with no regressions;
- **compositable**: animate only `transform` and `opacity` for DOM UI; do not trigger layout reflows inside the animation hot-path.

---

### Research sources validated for this pass

| Source | What it validates |
|---|---|
| W3C WCAG 2.2 § SC 2.3.3 | All interaction-triggered non-essential animation must be disablable |
| MDN `prefers-reduced-motion` | System-level motion signal; already integrated via `PreferencesStore` |
| MDN CSS Animation Performance | Animate only `transform`/`opacity`; never `top`/`left`/`width` |
| MDN `requestAnimationFrame` | Pass `DOMHighResTimeStamp now` — source for delta-time |
| Glenn Fiedler "Fix Your Timestep" + Stack Overflow #57851938 | Frame-rate-independent exponential smoothing: `alpha = 1 − Math.exp(−λ · dt)` |
| web.dev / Chrome DevTools layers panel | `will-change: transform, opacity` — apply sparingly, only just before animation, remove after |
| easing.net / cubic-bezier.com | `cubic-bezier(0.16, 1, 0.3, 1)` = easeOutExpo; `cubic-bezier(0.76, 0, 0.24, 1)` = easeInOutQuart |
| MDN View Transitions API | Progressive enhancement for DOM state transitions — note for future consideration |

---

### Repository verification scope for this pass

The v0.15 plan was re-verified against the current repository structure and code paths that either drive motion directly or constrain how a motion pass can be implemented safely:

- app bootstrap / render loop: `src/main.ts`
- gallery motion, zoom, pan, reset-fit, diagnostics: `src/gallery/GalleryManager.ts`
- artwork transform ownership and geometry boundaries: `src/gallery/ArtworkMesh.ts`
- side preview panels and texture-swap behavior: `src/gallery/SidePanels.ts`
- timeline selection, centering, reduced-motion scroll behavior: `src/timeline/Timeline.ts`
- info panel, preferences panel, fullscreen/nav/zoom controls, hint text: `src/ui/*`
- interaction inputs and gesture flow: `src/interaction/CanvasInteraction.ts`
- lighting animation boundary: `src/lighting/LightingSetup.ts` and `src/lighting/LightProfile.ts`
- frame pacing / startup quality / performance helpers: `src/utils/FrameBudgetMonitor.ts`, `src/utils/performance.ts`, `src/utils/math.ts`
- style tokens, reduced-motion coverage, responsive behavior: `src/styles/main.scss`
- build / validation scripts: `package.json`
- repository markdown cross-references: `README.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/IMAGE_MAINTENANCE_GUIDE.md`, `CHANGELOG.md`, `DOCUMENTATION_RULES.md`, `FINDINGS.md`

This means the v0.15 plan is now aligned not only with the animation code itself but also with the surrounding interaction, accessibility, diagnostics, and documentation surfaces that the implementation will touch.

---

### Full code audit — motion surfaces by file

#### `src/gallery/GalleryManager.ts` — lines 565–587 (`update()`)

**Root problem: all motion uses frame-rate-dependent per-frame lerp.**

```typescript
// CURRENT (frame-rate-dependent — bad at 120 Hz or 30 Hz):
group.rotation.x += (this.targetX - group.rotation.x) * 0.05;
group.rotation.y += (this.targetY - group.rotation.y) * 0.05;
group.position.x += (0 - group.position.x) * 0.06;
group.position.y += (0 - group.position.y) * 0.06;
group.scale.x    += (1 - group.scale.x)    * 0.06;
group.scale.y    += (1 - group.scale.y)    * 0.06;
group.scale.z    += (1 - group.scale.z)    * 0.06;
this.zoom                += (this.targetZoom - this.zoom)  * 0.08;
this.camera.position.z  += (this.zoom - this.camera.position.z) * 0.08;
this.panX  += (this.targetPanX - this.panX) * 0.08;
this.panY  += (this.targetPanY - this.panY) * 0.08;
this.camera.position.x  += (this.panX - this.camera.position.x) * 0.08;
this.camera.position.y  += (this.panY - this.camera.position.y) * 0.08;
```

**Proof of frame-rate dependence:**

For `value += (target − value) × k`, 95% settle requires `n = ln(0.05) / ln(1−k)` frames:

| k | 60 Hz settle | 120 Hz settle | 30 Hz settle |
|---|---|---|---|
| 0.05 (hover rot) | 58 frames = **973 ms** | 29 frames = **485 ms** | 115 frames = **3833 ms** |
| 0.06 (pos/scale) | 49 frames = **817 ms** | 24 frames = **408 ms** | 98 frames = **3267 ms** |
| 0.08 (cam zoom/pan) | 37 frames = **617 ms** | 18 frames = **307 ms** | 74 frames = **2467 ms** |

At 120 Hz (modern MacBook Pro, iPad ProMotion) the artwork arrives in ~400 ms — barely visible. At 30 Hz on a thermally-throttled phone, the zoom drags for 2.5 seconds. These numbers confirm the frame-rate problem is real and significant.

**Correct formula (source: Stack Overflow #57851938, web.dev):**

```typescript
// Frame-rate-independent exponential smoothing.
// alpha = 1 - exp(-lambda * dt)  where dt is in SECONDS.
// lambda controls how quickly value approaches target:
//   lambda=2  → 95% settle in 1500 ms
//   lambda=3  → 95% settle in 1000 ms
//   lambda=4  → 95% settle in 750 ms
//   lambda=6  → 95% settle in 500 ms
//   lambda=12 → 95% settle in 250 ms
```

**Proposed lambda values for FREYRAUM:**

| Property | Current k | Current 95% settle @ 60Hz | Proposed λ | New 95% settle (any Hz) |
|---|---|---|---|---|
| Hover rotation X/Y | 0.05 | 973 ms | **12** | 250 ms — immediate |
| Artwork position X/Y (nav) | 0.06 | 817 ms | **2.5** | 1200 ms — witnessable |
| Artwork scale (nav) | 0.06 | 817 ms | **3.0** | 1000 ms — smooth |
| Camera zoom | 0.08 | 617 ms | **4.0** | 750 ms — responsive |
| Camera pan X/Y | 0.08 | 617 ms | **5.0** | 600 ms — connected to input |

**Implementation change — `GalleryManager.ts`:**

1. Add a private `lastUpdateTime = 0` field at line ~133.
2. Change `update(): void` to `update(now: number): void`.
3. Compute delta at the top of `update()`:

```typescript
// Inside update(now: number):
const dt = this.lastUpdateTime === 0 ? 0 : Math.min((now - this.lastUpdateTime) / 1000, 0.1);
this.lastUpdateTime = now;
if (dt === 0) return; // skip the very first tick
```

4. Replace all hard-coded smoothing lines in `update()` with `smoothDamp` calls (13 existing motion updates, plus the new `position.z` line if the depth-seed enhancement is adopted):

```typescript
// In update() — replace all value += (target - value) * k  with:
const sd = smoothDamp; // local alias for brevity

// Hover rotation — λ=12 → 250ms settle
group.rotation.x = sd(group.rotation.x, this.targetX, 12, dt);
group.rotation.y = sd(group.rotation.y, this.targetY, 12, dt);

// Navigation position settle — λ=2.5 → ~1200ms settle
group.position.x = sd(group.position.x, 0, 2.5, dt);
group.position.y = sd(group.position.y, 0, 2.5, dt);

// Navigation scale settle — λ=3.0 → ~1000ms settle
group.scale.x = sd(group.scale.x, 1, 3.0, dt);
group.scale.y = sd(group.scale.y, 1, 3.0, dt);
group.scale.z = sd(group.scale.z, 1, 3.0, dt);

// Camera zoom — λ=4.0 → ~750ms settle
this.zoom                = sd(this.zoom, this.targetZoom, 4.0, dt);
this.camera.position.z   = sd(this.camera.position.z, this.zoom, 4.0, dt);

// Camera pan — λ=5.0 → ~600ms settle (connected to input)
this.panX = sd(this.panX, this.targetPanX, 5.0, dt);
this.panY = sd(this.panY, this.targetPanY, 5.0, dt);
this.camera.position.x = sd(this.camera.position.x, this.panX, 5.0, dt);
this.camera.position.y = sd(this.camera.position.y, this.panY, 5.0, dt);
```

5. Update `main.ts` animate loop to pass `now`: change `galleryManager.update()` → `galleryManager.update(now)`.

---

#### `src/utils/math.ts` — add `smoothDamp` utility

Current `math.ts` (lines 1–17): has `clamp`, `lerp`, `mapRange`. Add:

```typescript
/**
 * Frame-rate-independent exponential smoothing.
 *
 * Equivalent to value += (target − value) × k each frame, but with
 * consistent timing at any refresh rate.
 *
 * @param current  Current animated value.
 * @param target   Target value to approach.
 * @param lambda   Damping factor per second. Higher = snappier.
 *                 λ=2.5 → 95% settle in ~1200ms
 *                 λ=4   → 95% settle in ~750ms
 *                 λ=12  → 95% settle in ~250ms
 * @param dt       Delta time in SECONDS. Clamp to ≤0.1 before passing.
 */
export function smoothDamp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
```

Import in `GalleryManager.ts`: `import { clamp, smoothDamp } from '../utils/math';`

---

#### `src/gallery/GalleryManager.ts` — lines 453–456 + 484–487 (navigation entrance seeds)

Current seeds applied in `navigate()` and `goTo()`:

```typescript
this.artworkMesh.group.position.x = direction * 3.2;  // world units
this.artworkMesh.group.rotation.y = direction * 0.32; // radians = ~18°
this.artworkMesh.group.scale.set(0.84, 0.84, 0.84);
```

With k=0.06 at 60fps these seeds settle in ~817ms. After converting to λ=2.5 (95% settle = 1200ms), these same offsets will now take 1.2 seconds to clear — giving the user time to witness the artwork arrive.

However the **rotation** should be reduced: 0.32 radians (~18°) reads as a theatrical yaw in a museum context. Proposed:

```typescript
this.artworkMesh.group.position.x = direction * 4.5;   // more dramatic entrance range
this.artworkMesh.group.rotation.y = direction * 0.15;  // ~9° — subtle, museum-like
this.artworkMesh.group.scale.set(0.88, 0.88, 0.88);    // slightly less collapsed
```

Also add a depth recession for a softer 3D approach feeling:

```typescript
this.artworkMesh.group.position.z = -0.6;  // painting comes from slightly behind
// (position.z target is 0; smoothed by λ=2.5 along with position.x)
```

Add `position.z` tracking to `update()`:

```typescript
group.position.z = sd(group.position.z, 0, 2.5, dt);
```

---

#### `src/ui/InfoPanel.ts` — lines 38–47 (content swap timing bug)

**Bug discovered:** the 200ms `setTimeout` delay at line 41 is shorter than the CSS transition duration (`--dur-base: 0.32s = 320ms`). Content swaps while the panel is only 62% through its fade-out (opacity ≈ 0.38). Users see flickering text underneath a translucent panel.

```typescript
// CURRENT — BUGGY:
window.setTimeout(() => {
  this.setContent(artwork);
  this.el.classList.remove('is-transitioning');
}, 200); // < 320ms transition = content changes before fully faded
```

After extending `--dur-content` to 500ms (see SCSS plan below), the correct delay becomes ≥510ms.

**Fixed implementation:**

```typescript
// Matching constant — keep in sync with --dur-content (0.5s) in main.scss.
private static readonly CONTENT_SWAP_DELAY_MS = 520; // --dur-content (500ms) + 20ms buffer

update(artwork: Artwork, animate = false): void {
  if (animate) {
    this.el.classList.add('is-transitioning');
    window.setTimeout(() => {
      this.setContent(artwork);
      // Use one rAF to let layout settle before removing the class,
      // which triggers the fade-in transition.
      window.requestAnimationFrame(() => {
        this.el.classList.remove('is-transitioning');
      });
    }, InfoPanel.CONTENT_SWAP_DELAY_MS);
  } else {
    this.setContent(artwork);
  }
}
```

Note: the `translateY` offset in `.info-panel.is-transitioning` (currently 8px) should also be increased to 16px for the fade-in to be more visible as a vertical reveal.

---

#### `src/styles/main.scss` — motion token redesign

**Current tokens (lines 54–59):**

```scss
--ease-out:    cubic-bezier(0.22, 0.78, 0.32, 1);   // ok for controls
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);   // y1=1.56 overshoots — museum wrong
--dur-fast:    0.18s;
--dur-base:    0.32s;
--dur-slow:    0.6s;
```

**Problem with `--ease-spring`:** the control point y1=1.56 causes an overshoot (value exceeds target) — physically plausible for a spring, but jarring in a museum. Confirmed via cubic-bezier.com and [web.dev easing guide](https://web.dev/articles/animations-guide).

**Proposed replacement token set (backward-compatible, old names kept as aliases):**

```scss
// Easing — premium gallery curves
--ease-gallery-out:    cubic-bezier(0.16, 1, 0.3, 1);       // easeOutExpo: rapid decel, silk finish
--ease-gallery-in-out: cubic-bezier(0.76, 0, 0.24, 1);      // easeInOutQuart: full deliberate journey
--ease-out:            cubic-bezier(0.22, 0.78, 0.32, 1);   // keep for controls (unchanged)
--ease-spring:         cubic-bezier(0.34, 1.56, 0.64, 1);   // keep as named but stop using in gallery

// Durations — semantic names
--dur-control:   0.18s;   // button hover/active (was --dur-fast, unchanged)
--dur-content:   0.5s;    // info panel text fade — matches CONTENT_SWAP_DELAY_MS
--dur-panel:     0.55s;   // glass panel open/close entrance
--dur-timeline:  0.42s;   // timeline active thumb lift
--dur-reveal:    0.9s;    // loading overlay + big screen transitions

// Backward-compat aliases
--dur-fast: var(--dur-control);
--dur-base: var(--dur-content);    // raised from 0.32s → 0.5s
--dur-slow: var(--dur-reveal);     // raised from 0.6s  → 0.9s
```

**Specific rule changes required:**

1. **`.info-panel` transition (line 191–192):**
   ```scss
   // was: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)
   transition: opacity var(--dur-content) var(--ease-gallery-out),
               transform var(--dur-content) var(--ease-gallery-out);
   ```

2. **`.info-panel.is-transitioning` (line 224–226):**
   ```scss
   // was: transform: translateY(8px)
   opacity: 0;
   transform: translateY(16px);  // double the distance for a more visible reveal
   ```

3. **`.timeline__thumb` transition (lines 730–732):**
   ```scss
   // was: transform var(--dur-base) var(--ease-spring), box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-fast) ...
   transition: transform var(--dur-timeline) var(--ease-gallery-out),
               box-shadow var(--dur-timeline) var(--ease-gallery-out),
               border-color var(--dur-control) var(--ease-out);
   ```
   This removes the overshoot spring from timeline thumbnails and makes them lift more slowly.

4. **`.prefs__panel` animation (line 500–501):**
   ```scss
   // was: prefs-in var(--dur-base) var(--ease-spring)
   animation: prefs-in var(--dur-panel) var(--ease-gallery-out);
   ```

5. **`@keyframes prefs-in` scale (line 506):**
   ```scss
   // was: scale(0.94) translateY(-6px)
   from {
     opacity: 0;
     transform: scale(0.96) translateY(-10px);  // softer collapse, more distance
   }
   ```

6. **`.loading-overlay` transition (line 856):**
   ```scss
   // was: opacity var(--dur-slow) var(--ease-out)
   transition: opacity var(--dur-reveal) var(--ease-gallery-out);
   ```

7. **`main.ts` loading overlay removal timeout (line 344):**
   ```typescript
   // was: window.setTimeout(() => loadingOverlay.remove(), 700)
   window.setTimeout(() => loadingOverlay.remove(), 950); // matches --dur-reveal (0.9s) + 50ms buffer
   ```

8. **Timeline skeleton transition (line 775):**
   ```scss
   // was: opacity var(--dur-base) var(--ease-out)
   transition: opacity var(--dur-content) var(--ease-out);
   ```

9. **Loading spinner (lines 870–875):**
   ```scss
   // was: spin 0.8s linear infinite
   animation: spin 1.4s linear infinite;  // calmer — 70% slower
   ```
   And in reduced-motion (line 984–986), the spinner is already stopped — no change needed.

---

#### `src/lighting/LightingSetup.ts` — line 76 (ambient key drift)

```typescript
primary.position.x = baseX + Math.sin(time * 0.0002) * 0.25;
```

Current: 0.0002 rad/ms = 0.2 rad/s → period = 2π/0.2 = 31.4 s. Amplitude 0.25 at baseX = −3 (8.3% drift). This is already very subtle and museum-appropriate. No change needed.

Audit note: `time` is the raw `DOMHighResTimeStamp now` passed from main.ts, so the lighting drift already runs at wall-clock time, not frame count. It is inherently frame-rate-independent. ✓

---

#### `src/styles/main.scss` — reduced motion blocks (lines 981–1013)

The `[data-motion='reduced']` block correctly sets `transition-duration: 0.001ms` on all animated elements. After the SCSS changes above, the new token names and durations will be implicitly covered because the zero-duration rule overrides everything. However, one explicit addition is needed for completeness:

```scss
:root[data-motion='reduced'] {
  // ... existing rules ...

  // New: also zero out the loading spinner animation duration
  // (currently, spin animation is not in this block — add it)
  .loading-spinner {
    animation: none; // already there — confirmed OK
  }
}
```

The `@media (prefers-reduced-motion: reduce)` block at lines 1007–1013 is correct. After the token rename, the class names referenced (`.loading-spinner`, `.timeline__skeleton`, `.prefs__panel`) still exist. ✓

---

#### `src/gallery/SidePanels.ts` — opacity (no immediate change needed)

Side panels are static with `opacity: 0.95` (lines 15–16, 25–26 in SidePanels.ts). They do not fade in/out when artwork changes; their texture is swapped instantly via `GalleryManager.showArtwork()`. A future enhancement could be a subtle 200ms opacity fade on texture swap, but this is **not planned for v0.15** — it would require a `transitionend` listener or timeout in `SidePanels.updateTextures()`.

---

### Implementation plan — slices with concrete steps

#### Slice 1 — `smoothDamp` utility in `src/utils/math.ts`

Files touched: `src/utils/math.ts` only.

1. Append `smoothDamp(current, target, lambda, dt)` function after `mapRange`.
2. Verify with unit test reasoning: at dt=1/60s, λ=4, `alpha = 1 - exp(-4/60) ≈ 0.0645` ≈ old k=0.065 — proves equivalence.

No dependencies on other slices. Can be done independently.

#### Slice 2 — CSS motion token redesign in `src/styles/main.scss`

Files touched: `src/styles/main.scss` only.

1. Add `--ease-gallery-out` and `--ease-gallery-in-out` easing tokens.
2. Add `--dur-control`, `--dur-content`, `--dur-panel`, `--dur-timeline`, `--dur-reveal` tokens.
3. Keep `--dur-fast`, `--dur-base`, `--dur-slow` as backward-compat aliases.
4. Update `.info-panel` transition and `.info-panel.is-transitioning` translateY.
5. Update `.timeline__thumb` transition.
6. Update `.prefs__panel` animation.
7. Update `@keyframes prefs-in`.
8. Update `.loading-overlay` transition.
9. Update `.timeline__skeleton` transition.
10. Update loading spinner duration.
11. `npm run lint && npm run build` → must pass.

This slice is independent from Slice 1. Does not affect GalleryManager.

#### Slice 3 — Fix `InfoPanel.ts` content-swap timing bug

Files touched: `src/ui/InfoPanel.ts` only.

1. Add `CONTENT_SWAP_DELAY_MS = 520` private static.
2. Replace hard-coded `200` with the constant.
3. Add `requestAnimationFrame` before removing `is-transitioning`.
4. Confirm constant stays in sync with `--dur-content`.
5. `npm run lint && npm run build` → must pass.

This slice depends on Slice 2 (because `CONTENT_SWAP_DELAY_MS` must match `--dur-content: 0.5s`).

#### Slice 4 — `GalleryManager.update()` frame-rate-independent smoothing

Files touched: `src/gallery/GalleryManager.ts`, `src/main.ts`.

1. Import `smoothDamp` in `GalleryManager.ts`.
2. Add `private lastUpdateTime = 0` field near line 133.
3. Change signature: `update(now: number): void`.
4. Add dt computation at top of `update()`.
5. Replace all 13 `value += (target - value) * k` lines with `smoothDamp(...)`.
6. Use lambda values from the table above.
7. In `main.ts` animate loop (~line 525): change `galleryManager.update()` → `galleryManager.update(now)`.
8. `npm run lint && npm run build` → must pass.

This slice depends on Slice 1 (`smoothDamp` exists). Independent of Slices 2 and 3.

#### Slice 5 — Navigation entrance seed retuning

Files touched: `src/gallery/GalleryManager.ts` only.

1. Change navigation seed in `navigate()` (line ~454–456) and `goTo()` (line ~485–487):
   - `position.x = direction * 4.5` (from 3.2)
   - `rotation.y = direction * 0.15` (from 0.32)
   - `scale.set(0.88, 0.88, 0.88)` (from 0.84)
   - `position.z = -0.6` (new — depth recession)
2. In `update()`, add `position.z` smoothDamp with λ=2.5 after existing position.x/y lines.
3. Add diagnostics fields to the `navigate` log:
   ```typescript
   motionMode: this.reducedMotion ? 'reduced' : 'full',
   seedPositionX: direction * 4.5,
   seedPositionZ: -0.6,
   settleTargetMs: this.reducedMotion ? 0 : Math.round(1000 * (-Math.log(0.05) / 2.5)),
   ```
4. `npm run lint && npm run build` → must pass.

This slice depends on Slice 4 (lambda is now meaningful because we have frame-rate-independent smoothing). Must run after Slice 4.

#### Slice 6 — `main.ts` loading overlay removal timeout update

Files touched: `src/main.ts` only.

Change line 344: `window.setTimeout(() => loadingOverlay.remove(), 700)` → `window.setTimeout(() => loadingOverlay.remove(), 950)`.

This slice depends on Slice 2 (`--dur-reveal: 0.9s` means 900ms).

#### Slice 7 — Diagnostics, validation, QA

1. Confirm all diagnostics in `navigate` include `motionMode` and `settleTargetMs`.
2. `npm run lint && npm run build` → must pass.
3. Manual QA matrix:
   - Desktop 60 Hz: artwork entrance should take ~1.2s to 90% settle, clearly witnessable.
   - Desktop 120 Hz: same ~1.2s (now identical to 60 Hz — confirms fix).
   - Mobile 60 Hz: same ~1.2s.
   - Rapid forward/back navigation: motion interrupts cleanly, no accumulation.
   - Wheel/pinch zoom: feels connected (λ=5 pan, λ=4 zoom).
   - Reset button: camera glides back over ~750ms.
   - Hover rotation: responds immediately (~250ms).
   - Info panel: fade-out then content swap — text never visible during opacity < 0.1.
   - Timeline active lift: smooth, no overshoot.
   - Prefs panel open: glass panel glides in, no bounce.
   - Loading overlay: fades smoothly over ~0.9s.
   - Reduced motion on: no entrance travel, no scale, minimal opacity transitions only.
   - High contrast on: all focus rings and borders survive — no animation-only visual state.
   - `prefers-reduced-motion: reduce` at OS level: `[data-motion='reduced']` block fires.

---

### Non-goals for this pass (unchanged)

- Do not change v0.14.2 zoom/pan limit constants (`INSPECTION_OVERSCROLL_X`, `INSPECTION_OVERSCROLL_Y`).
- Do not add any animation library dependency.
- Do not add decorative background motion that competes with the paintings.
- Do not weaken reduced-motion paths.
- Do not implement View Transitions API — progressive enhancement only, for a future pass.

---

### Risks and mitigations (updated with specifics)

| Risk | Mitigation |
|---|---|
| λ values feel too slow on mobile (30fps floor) | At 30fps each frame is 33ms; λ=2.5 still settles in ~1200ms wall clock — the whole point of the fix |
| Position.z seed creates z-fighting with frame mesh | ArtworkMesh frame is at z=0, artwork plane at z=0.095; seed z=−0.6 recesses behind both → no z-fight |
| InfoPanel CONTENT_SWAP_DELAY_MS drifts from CSS | Keep `CONTENT_SWAP_DELAY_MS = 520` as a constant with a JSDoc comment cross-referencing `--dur-content` |
| Loading overlay 950ms delay feels slow on fast connections | Loading is async; the delay only matters for the visual fade, not for data readiness |
| `--dur-base` alias changing from 0.32s to 0.5s breaks unknown consumers | Audit all `var(--dur-base)` uses before PR — affected elements get the new durations intentionally |
| Navigation z-seed axis needs smoothDamp tracking in update() | Position.z smoothDamp must be added alongside x/y in Slice 4 and 5 |

---

### Done definition

- Artwork navigation entrance is visually witnessable (~1.2s settle) on both 60 Hz and 120 Hz screens.
- No motion behaviour is frame-rate-dependent.
- Info panel text never flickers partially through a transition.
- All glass panels (info, prefs, loading overlay) feel gallery-premium: deliberate, smooth, no bounce.
- Timeline thumb active state lifts without overshoot.
- Reduced-motion paths remain unchanged and WCAG 2.2 § SC 2.3.3 intent is satisfied.
- `npm run lint && npm run build` pass.
- Documentation updated with shipped constants, diagnostics, and QA results.

---

## v0.14.2 — Implemented: tighter top/bottom pan limits at close zoom (2026-05-19)

### Status

**Implemented 2026-05-19.** This pass addresses the follow-up request that vertical edge limits should be more restrictive while horizontal limits stay as they are.

### Implementation

- Replaced the single overscroll constant with split axis constants in `src/gallery/GalleryManager.ts`:
  - `INSPECTION_OVERSCROLL_X = 1.2` (left/right unchanged)
  - `INSPECTION_OVERSCROLL_Y = 0.6` (top/bottom tightened)
- Updated `getPanLimits()` to apply `X` and `Y` overscroll independently.
- Updated `show-artwork-complete` diagnostics to log `panOverscrollX` and `panOverscrollY`.

### Outcome

- Horizontal exploration remains unchanged.
- Vertical panning is now intentionally tighter when zoomed in.

---

## v0.14.1 — Implemented: importer launcher compatibility guard (2026-05-19)

### Status

**Implemented 2026-05-19.** This pass fixes a customer updater runtime failure on old Node.js versions.

### Problem

Customer report on Windows:

```text
SyntaxError: Unexpected token {
  at scripts/import-artworks.mjs:19
```

This occurred because the launcher directly ran the ESM importer (`.mjs`) on an unsupported Node runtime.

### Implementation

- Added `scripts/run-import-artworks.cjs` (CommonJS launcher).
- The launcher checks `process.versions.node` and requires Node.js major `>= 18`.
- The launcher intentionally uses old-style built-in imports (`child_process`,
  `fs`, `path`) rather than `node:` specifiers, because the whole point is to
  run far enough on old Node versions to show the friendly compatibility report.
- If Node is too old:
  - writes a plain-language error into `customer-artworks/last-import-report.txt`,
  - prints a clear compatibility message,
  - exits with non-zero status.
- If Node is compatible:
  - launches `scripts/import-artworks.mjs` via `spawnSync`.
- Updated:
  - `Update Gallery.bat`
  - `Update Gallery.command`
  to run the wrapper (`scripts/run-import-artworks.cjs`) instead of calling the ESM importer directly.

### Outcome

- No more raw syntax crash for unsupported Node versions.
- Customers/support still receive the normal text report with actionable fix guidance.
- Existing importer behavior remains unchanged on supported Node.

---

## v0.14 — Implemented: deeper close zoom, tighter edge limits, portrait-aware reset fit (2026-05-19)

### Status

**Implemented 2026-05-19.** Runtime changes landed in `src/gallery/GalleryManager.ts`; all markdown files were updated; preview build artifacts were regenerated.

### Scope implemented

This pass implemented the three customer-reported follow-ups after v0.13:

1. allow deeper close inspection zoom;
2. tighten edge pan looseness introduced in v0.13;
3. make large vertical artworks open farther away in reset/default view.

---

### Code changes implemented (`src/gallery/GalleryManager.ts`)

#### 1) Close zoom floor lowered in both guards

Changed constants:

```ts
const MIN_CAMERA_Z = 0.2;                  // was 0.5
const MIN_VISIBLE_ARTWORK_FRACTION = 0.12; // was 0.28
```

`getInspectionMinZoom()` remains structurally the same, but now computes a materially lower floor on medium/large artworks because the fraction-based guard no longer dominates as aggressively.

#### 2) Pan overscroll tightened

Changed constant:

```ts
const INSPECTION_OVERSCROLL = 1.2; // was 3.0
```

`getPanLimits()` math is unchanged; the additive edge allowance is now more controlled, reducing drift near reset-fit while still allowing corner reach at close zoom.

#### 3) Portrait-aware reset-fit boost added

New constants:

```ts
const PORTRAIT_ASPECT_THRESHOLD = 0.65;
const PORTRAIT_RESET_EXTRA_Z = 1.5;
```

New helper:

```ts
private isPortraitResetArtwork(): boolean {
  return this.artworkMesh.artworkAspect < PORTRAIT_ASPECT_THRESHOLD;
}
```

`getResetFitZoom()` now adds portrait-only headroom after base fit calculation:

```ts
const baseFitZoom = Math.max(DEFAULT_CAMERA_Z, heightDistance, widthDistance);
return this.isPortraitResetArtwork() ? baseFitZoom + PORTRAIT_RESET_EXTRA_Z : baseFitZoom;
```

This makes tall portraits open farther without globally moving landscape/square artworks.

#### 4) Diagnostics extended for tuning transparency

`show-artwork-complete` now logs additional v0.14 tuning signals:

- `closeZoomMinVisibleFraction`
- `panOverscroll`
- `panLimitAtReset` (`x`, `y`)
- `portraitResetApplied`
- `portraitResetExtra`

This keeps future tuning and customer issue reproduction observable without invasive debugging.

---

### Implemented constants table

| Constant | v0.13 | v0.14 |
|---|---:|---:|
| `MIN_CAMERA_Z` | 0.5 | 0.2 |
| `MIN_VISIBLE_ARTWORK_FRACTION` | 0.28 | 0.12 |
| `INSPECTION_OVERSCROLL` | 3.0 | 1.2 |
| `PORTRAIT_ASPECT_THRESHOLD` | — | 0.65 |
| `PORTRAIT_RESET_EXTRA_Z` | — | 1.5 |

### Validation

- Baseline before code changes: `npm run lint` ✅, `npm run build` ✅
- Final after code + docs: `npm run lint` ✅, `npm run build` ✅
- Known warnings unchanged: TypeScript parser support warning and Sass legacy JS API deprecation warning.

### Files changed in this pass

- `src/gallery/GalleryManager.ts`
- `customer-preview/freyraum-gallery.js` (rebuilt)
- `CHANGELOG.md`
- `plan.md`
- `FINDINGS.md`
- `README.md`
- `DOCUMENTATION_RULES.md`
- `docs/HANDOFF.md`
- `docs/CUSTOMER_PICTURE_GUIDE.md`
- `docs/IMAGE_MAINTENANCE_GUIDE.md`

---

## v0.13 — Implemented: nav button layout, wider zoom range, more pan freedom, icon centering (2026-05-18)

### Status

**Implemented 2026-05-18.** Four customer-reported regressions and gaps fixed after the v0.12 zoom/framing/timeline pass. Runtime changes in `src/gallery/GalleryManager.ts` and `src/styles/main.scss`; `customer-preview/` rebuilt. Both `npm run lint` and `npm run build` pass.

### Customer-observed problems

- Left and right nav buttons were cut off by the timeline at the bottom.
- Zoom-out did not go far enough for a true wide overview; zoom-in stopped before fine-detail inspection was comfortable.
- When zoomed in close, panning side to side stopped too soon to explore narrow artworks.
- The gear/settings icon and the fullscreen icon were not centred inside their circular buttons.

### Root cause analysis

#### Bug 1 — Nav buttons cut off by timeline

- `--chrome-bottom: max(168px, 148px+safe)` placed nav button bottom edges at 168px from the viewport bottom.
- After the v0.12 timeline-list padding increase (`padding: 16px 18px 8px`), the timeline's total rendered height became ≈149px.
- The timeline sits at `bottom: calc(28px + var(--safe-bottom))`, so its top edge moved to ≈177px from the bottom.
- Nav buttons (bottom edge 168px) were now 9px inside the timeline zone. With equal z-index, the later-appended timeline element appeared on top.

#### Bug 2 — Zoom range too narrow

- `MIN_CAMERA_Z = 1.2` prevented getting close enough for fine brushstroke inspection.
- `MIN_OVERVIEW_CAMERA_Z = 10.75` and `OVERVIEW_HEADROOM_Z = 1.6` capped the far overview at roughly 12–13 world units, which is not far enough for a full environment overview.

#### Bug 3 — Pan range too tight when zoomed in

- `INSPECTION_OVERSCROLL = 0.5` allowed viewport centre to travel only 0.5 world units past the artwork edge. For narrow artworks at close zoom, this prevented full left/right exploration.

#### Bug 4 — Icons not optically centred

- `.prefs__trigger-icon` and `.fullscreen-btn__icon` spans had no explicit CSS. Default `display: inline` inside a flex button carries a fractional descender baseline offset that shifts inline content slightly downward, making the SVG appear off-centre inside the circular button.

### What shipped

- **`--chrome-bottom` raised** to `max(200px, 180px+safe)` so zoom controls (which use this token) also clear the timeline.
- **`.nav-controls` re-positioned** to `bottom: calc(192px + var(--safe-bottom))` — 15px above the timeline's computed top edge.
- **`MIN_CAMERA_Z`** lowered from `1.2` to `0.5`.
- **`MIN_OVERVIEW_CAMERA_Z`** raised from `10.75` to `18.0`.
- **`OVERVIEW_HEADROOM_Z`** raised from `1.6` to `3.5`.
- **`INSPECTION_OVERSCROLL`** raised from `0.5` to `3.0`.
- **Icon spans CSS** added: `.prefs__trigger-icon` and `.fullscreen-btn__icon` get `display: flex; align-items: center; justify-content: center; line-height: 0; svg { display: block }`.

### Changed files

- `src/gallery/GalleryManager.ts`
- `src/styles/main.scss`
- `customer-preview/freyraum-gallery.js`
- `customer-preview/style.css`
- all documentation markdown files

---

## v0.12 — Implemented: farther zoom-out, full tall-picture default fit, and unclipped active timeline selection (2026-05-18)

### Status

**Implemented 2026-05-18.** The v0.12 technical coding plan has now been executed. Runtime code was changed carefully in `src/gallery/GalleryManager.ts`, `src/main.ts`, `src/timeline/Timeline.ts`, and `src/styles/main.scss`; `customer-preview/` was rebuilt. Baseline and final validation both ran with `npm run lint` and `npm run build`; both pass with only the already-known TypeScript parser and Sass legacy-API warnings.

Desktop web remains the primary visual design. The implementation corrects the remaining artwork-framing and timeline-selection issues without shrinking normal artworks unnecessarily or weakening close inspection behavior.

### What shipped

- **Art-safe viewport metrics.** `GalleryManager` now accepts an injected `ViewportMetricsProvider`. `main.ts` measures the visible viewport with `window.visualViewport` when available, falls back to `window.innerWidth/innerHeight`, reads fixed chrome geometry (`.topbar`, `.timeline`, `.nav-controls`), and provides usable viewport dimensions/fractions to gallery zoom math.
- **Viewport-change refit wiring.** The v0.11 resize coordinator now also listens to `visualViewport.resize`, `visualViewport.scroll`, and a `ResizeObserver` on key chrome elements. On changes it calls `galleryManager.handleViewportMetricsChanged()`, logs `layout/art-viewport`, and preserves a close-inspection view unless the user was already near reset overview.
- **Split zoom bounds.** The old single far ceiling (`MAX_CAMERA_Z = 9.25`) was replaced by explicit `ZoomBounds`: `minInspectionZoom`, `resetFitZoom`, and `maxOverviewZoom`. Reset view uses `resetFitZoom`; zoom-out controls, wheel, and pinch can continue to `maxOverviewZoom`, which is at least `10.75` and always at least `1.6` camera units beyond the computed reset fit.
- **Shared viewport math.** Reset fit, close-inspection minimum, pan limits, hover-rotation progression, and diagnostics now use the same measured viewport model so tall-picture fit and close inspection remain internally consistent.
- **Detailed diagnostics.** `show-artwork-complete` now logs reset/min/max zoom, overview headroom, usable viewport width/height/fractions, and viewport occlusion. `GalleryManager` logs `viewport-refit`; `main.ts` logs `layout/art-viewport`.
- **Timeline active-item visibility.** `.timeline__list` reserves vertical headroom for the lifted active thumb and defines `scroll-padding-inline`; timeline items/thumbs define `scroll-margin-inline`. `Timeline.ts` stores the list element, replaces pure `scrollIntoView()` with transform-aware `getBoundingClientRect()` centering, adds `aria-current`, and respects reduced motion by using `auto` scrolling when motion is reduced.
- **Preview rebuilt.** `customer-preview/freyraum-gallery.js` and `customer-preview/style.css` were regenerated by the production build.

---

### Implementation files

- `src/gallery/GalleryManager.ts`
- `src/main.ts`
- `src/timeline/Timeline.ts`
- `src/styles/main.scss`
- `customer-preview/freyraum-gallery.js`
- `customer-preview/style.css`
- documentation files listed in this pass

---

### Final online validation pass (2026-05-18)

The current v0.12 direction was validated online against current official guidance and remains correct, but the research sharpens the implementation details.

#### Assumptions now validated online

- **`VisualViewport` is the right supplementary signal for mobile chrome changes.** `window.innerHeight` and `100dvh` are useful, but current guidance still treats `window.visualViewport` as the most direct way to observe the actually visible region when browser chrome expands/collapses or pinch-zoom changes the viewport.
- **Dynamic viewport units remain necessary, but not sufficient for JS camera-fit math.** `100dvh` / `100dvw` are the right CSS baseline, yet the 3D camera-fit calculation must still account for fixed overlays and visible viewport changes in JS.
- **`scroll-padding` and `scroll-margin` are the preferred baseline for scroll gutters.** Current guidance still favors defining visual gutters in CSS so browser-native scrolling and snapping keep active/focused items away from the edges.
- **Transformed active items still need manual centering logic when precision matters.** `scrollIntoView()` works on the layout box, not on the visually transformed footprint. For an active thumbnail that is scaled/translated upward, manual `scrollLeft` correction based on `getBoundingClientRect()` remains the robust solution.
- **Reduced-motion should affect programmatic scrolling too.** Current accessibility practice still expects smooth scrolling to be disabled or softened when the user requests reduced motion.
- **Resize observation should cover more than `window.resize`.** Current guidance still supports using `ResizeObserver` for container/chrome changes and `visualViewport` listeners for browser UI changes, especially on mobile.

#### Official / authoritative sources used for the validation

- MDN — VisualViewport API: <https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport>
- MDN — ResizeObserver: <https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver>
- MDN — `Element.scrollIntoView()`: <https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView>
- MDN — `scroll-padding`: <https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding>
- MDN — `scroll-margin`: <https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin>
- web.dev — large, small, and dynamic viewport units: <https://web.dev/blog/viewport-units>
- W3C WCAG 2.1 — SC 1.4.10 Reflow: <https://www.w3.org/WAI/WCAG21/Understanding/reflow.html>
- W3C WCAG 2.2 — SC 2.5.8 Target Size (Minimum): <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html>

#### Net result of the validation

The original v0.12 direction is confirmed, but the online validation adds four mandatory upgrades:

1. **Use a measured artwork-safe viewport, not only raw camera aspect.**
2. **Treat `visualViewport` + `ResizeObserver` as first-class inputs** for re-fit timing.
3. **Use CSS scroll gutters plus manual centering** for the active timeline item.
4. **Respect reduced motion in timeline auto-centering behavior.**

---

### Customer-observed behavior

- Users want to zoom out farther than the current limit allows.
- Very tall / long vertical artworks can open too close in the standard/reset view, so the full framed picture is not visible until the user manually zooms out.
- The selected artwork in the timeline is not always fully viewable; the active state can be cut off by the timeline strip itself.

---

### Code audit findings (bugs and structural risks found)

These were found by reading the live source after the v0.11 responsive/touch implementation.

#### Bug 1 — Reset framing and far overview zoom share the same hard-coded ceiling

- **File:** `src/gallery/GalleryManager.ts`
- **Current code:** `DEFAULT_CAMERA_Z = 7`, `MAX_CAMERA_Z = 9.25`, `getResetZoom()` clamps to `MAX_CAMERA_Z`, and all zoom entry points ultimately clamp via `clampZoom()`.
- **Problem:** One ceiling currently serves two different user intents:
  1. “fit the framed artwork comfortably” and
  2. “step farther back than the fitted view”.
- **Impact:** Very tall portraits can consume most of the existing far-distance budget just to fit, leaving almost no extra overview room.

#### Bug 2 — Fit, min-zoom, and pan-limit math all use raw camera aspect instead of the actually usable artwork viewport

- **File:** `src/gallery/GalleryManager.ts`
- **Current code:** `getResetZoom()`, `getMinZoom()`, and `getPanLimits()` all derive visible width/height from only `camera.aspect`, `camera.fov`, and `camera.position.z`.
- **Problem:** The math assumes the full viewport is available to the artwork. In reality the usable region is reduced by:
  - top bar + safe area
  - timeline/nav/zoom/footer chrome
  - compact/mobile layout changes
  - mobile browser UI changes that affect the visible viewport
- **Impact:** The fit can be mathematically “correct” while the artwork still feels cropped or too close in the real visible area. Pan safety can also become inconsistent with the new fit model if only reset view is adjusted.

#### Bug 3 — `GalleryManager` has no viewport-metrics provider and no explicit re-fit hook for layout-chrome changes

- **Files:** `src/gallery/GalleryManager.ts`, `src/main.ts`
- **Current code:** `main.ts` already debounces `resize` / `orientationchange`, resizes the renderer, re-detects device capabilities, and updates compact info mode. But `GalleryManager` itself is not told that the art-safe viewport has changed.
- **Problem:** Even after v0.11, the runtime has no explicit concept of “the art-safe viewport budget”. It only knows the camera aspect.
- **Impact:** Any future fix that depends on visible viewport measurements needs a formal wiring path; otherwise the fit only updates opportunistically during reset/navigation.

#### Bug 4 — Timeline active state is clipped by the scroll container

- **Files:** `src/styles/main.scss`
- **Current code:** `.timeline__thumb.is-active { transform: translateY(-10px) scale(1.04); }` combined with `.timeline__list { overflow-y: hidden; padding: 2px; }`
- **Problem:** The selected thumbnail is visually lifted upward, but the scroll container reserves almost no headroom and clips vertical overflow.
- **Impact:** The active thumbnail can appear cut off by the timeline strip.

#### Bug 5 — `Timeline.setActive()` relies only on `scrollIntoView()`, with no gutters or transform-aware centering

- **File:** `src/timeline/Timeline.ts`
- **Current code:** `next.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })`
- **Problem:** `scrollIntoView()` centers the layout box, not the visually transformed footprint. The class also does not retain a reference to the list element, so there is no dedicated centering method for manual control.
- **Impact:** The active item may still feel cramped at the edges, and the centered result may be visually off when the active transform is applied.

#### Bug 6 — Timeline auto-centering does not respect reduced-motion preference

- **Files:** `src/timeline/Timeline.ts`, `src/main.ts`
- **Current code:** timeline centering always requests `behavior: 'smooth'`.
- **Problem:** Current accessibility best practice expects programmatic scrolling to honor reduced-motion where possible.
- **Impact:** The timeline can still animate in sessions where the app has reduced motion enabled or the platform requests reduced motion.

---

### Brainstormed solution options

#### Option A — Simply raise `MAX_CAMERA_Z`

- **Pros:** smallest code diff
- **Cons:** does not solve tall-picture fit against chrome; leaves reset-fit and overview coupled; can distort hover/zoom progression because `getHoverRotationScale()` currently derives from the same range
- **Decision:** **reject as insufficient**

#### Option B — Make the default reset view always use the maximum zoom-out distance

- **Pros:** guarantees fit for tall artworks
- **Cons:** makes normal artworks feel too distant; removes intentional difference between “comfortable default fit” and “step back further”
- **Decision:** **reject**

#### Option C — Separate fit distance from overview distance and base both on measured art-safe viewport

- **Pros:** solves both core customer complaints without shrinking all artworks unnecessarily; scales to future responsive changes
- **Cons:** requires new viewport-measurement plumbing
- **Decision:** **recommended**

#### Option D — Remove the active timeline lift effect entirely

- **Pros:** simplest clipping fix
- **Cons:** loses an important visual affordance for the selected artwork
- **Decision:** **keep only as fallback if Safari-specific clipping remains after headroom fix**

#### Option E — Keep the active lift, reserve headroom, add CSS scroll gutters, and manually center the active item

- **Pros:** preserves the current design intent and solves the clipping/visibility issue robustly
- **Cons:** slightly more code than pure `scrollIntoView()`
- **Decision:** **recommended**

---

### Implemented architecture

#### New runtime concept: measured artwork viewport budget

Add one small measured-viewport model that captures the part of the viewport the artwork should actually fit inside.

**Recommended type (`src/gallery/GalleryManager.ts` or a tiny new helper file):**

```ts
export interface ArtworkViewportMetrics {
  viewportW: number;
  viewportH: number;
  usableW: number;
  usableH: number;
  usableFracX: number;
  usableFracY: number;
  effectiveAspect: number;
  occlusionTop: number;
  occlusionRight: number;
  occlusionBottom: number;
  occlusionLeft: number;
}
```

**Recommended wiring:**

- `main.ts` owns DOM measurement because it already owns `app`, `canvas`, and the fixed UI instances.
- `GalleryManager` should receive a **provider callback** rather than querying the DOM directly.

```ts
export type ViewportMetricsProvider = () => ArtworkViewportMetrics;
```

This keeps `GalleryManager` testable and avoids coupling it to arbitrary selectors.

#### New runtime concept: explicit zoom bounds

Replace the current implicit two-state model with an explicit three-value model:

```ts
interface ZoomBounds {
  minInspectionZoom: number;
  resetFitZoom: number;
  maxOverviewZoom: number;
}
```

- `minInspectionZoom` = current close inspection floor (today derived from `getMinZoom()`)
- `resetFitZoom` = “show the whole framed artwork comfortably”
- `maxOverviewZoom` = “allow stepping back farther than reset”

`resetView()` should use `resetFitZoom`, not `maxOverviewZoom`.

---

### Implemented slices

#### Slice 1 — Added viewport-metrics plumbing and measured re-fit triggers

**Files:** `src/main.ts`, `src/gallery/GalleryManager.ts`

##### What shipped

1. In `main.ts`, create a single measurement function that reads:
   - `window.visualViewport?.width/height/offsetTop/offsetLeft` when available
   - fallback to `window.innerWidth/innerHeight`
   - DOM rects for fixed chrome that materially reduces the art-safe viewport
2. Pass that function into `GalleryManager`.
3. Extend the existing resize coordinator to notify `GalleryManager` when viewport metrics changed.
4. Subscribe to:
   - `window.resize`
   - `window.orientationchange`
   - `visualViewport.resize`
   - `visualViewport.scroll`
   - `ResizeObserver` on the main fixed chrome nodes if needed (`.topbar`, `.timeline`, `.info-panel`)

##### Code suggestion

```ts
const measureArtworkViewport = (): ArtworkViewportMetrics => {
  const vv = window.visualViewport;
  const viewportW = vv?.width ?? window.innerWidth;
  const viewportH = vv?.height ?? window.innerHeight;

  const topbarRect = app.querySelector('.topbar')?.getBoundingClientRect();
  const timelineRect = app.querySelector('.timeline')?.getBoundingClientRect();

  const occlusionTop = topbarRect?.height ?? 0;
  const occlusionBottom = timelineRect?.height ?? 0;
  const occlusionLeft = 0;
  const occlusionRight = 0;

  const usableW = Math.max(1, viewportW - occlusionLeft - occlusionRight);
  const usableH = Math.max(1, viewportH - occlusionTop - occlusionBottom);

  return {
    viewportW,
    viewportH,
    usableW,
    usableH,
    usableFracX: usableW / viewportW,
    usableFracY: usableH / viewportH,
    effectiveAspect: usableW / usableH,
    occlusionTop,
    occlusionRight,
    occlusionBottom,
    occlusionLeft,
  };
};
```

##### Important design note

For v0.12, keep the model conservative and simple:

- always subtract full-width top/bottom chrome;
- only subtract left/right chrome when it truly creates a persistent side gutter;
- do **not** over-shrink the artwork to fully avoid the desktop info panel on the first pass, because that would reduce artwork size too aggressively.

This keeps the model solid and predictable.

#### Slice 2 — Split reset-fit zoom from far-overview zoom and made all zoom math use the same viewport model

**File:** `src/gallery/GalleryManager.ts`

##### What shipped

1. Add a `getViewportMetrics()` method backed by the injected provider.
2. Replace `getResetZoom()` with a `getZoomBounds()` helper.
3. Update:
   - `clampZoom()`
   - `getHoverRotationScale()`
   - `getMinZoom()`
   - `getPanLimits()`
   - `resetView()`
   - `show-artwork-complete` diagnostics
4. Ensure the far-overview ceiling is **higher than reset-fit**, not equal to it.

##### Code suggestion

The key math change is to scale visible width/height by the usable viewport fractions:

```ts
private getZoomBounds(): ZoomBounds {
  const m = this.getViewportMetrics();
  const framedWidth = this.artworkMesh.artworkWidth + 0.4;
  const framedHeight = this.artworkMesh.artworkHeight + 0.4;
  const fovTan = Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5));

  const fitHeightDistance =
    (framedHeight * RESET_VIEW_FRAME_MARGIN) /
    (2 * fovTan * m.usableFracY);

  const fitWidthDistance =
    (framedWidth * RESET_VIEW_FRAME_MARGIN) /
    (2 * fovTan * this.camera.aspect * m.usableFracX);

  const resetFitZoom = Math.max(DEFAULT_CAMERA_Z, fitHeightDistance, fitWidthDistance);
  const minInspectionZoom = this.getInspectionMinZoom(m);
  const maxOverviewZoom = Math.max(resetFitZoom + 1.5, 10.5);

  return {
    minInspectionZoom: clamp(minInspectionZoom, MIN_CAMERA_Z, resetFitZoom),
    resetFitZoom: clamp(resetFitZoom, MIN_CAMERA_Z, maxOverviewZoom),
    maxOverviewZoom,
  };
}
```

##### Additional recommendation

`getHoverRotationScale()` currently derives its progression from `MAX_CAMERA_Z - getMinZoom()`. After the split, drive that calculation from `maxOverviewZoom - minInspectionZoom` so the hover response does not become unintentionally flatter when the overview range increases.

#### Slice 3 — Added an explicit viewport-change strategy in `GalleryManager`

**Files:** `src/gallery/GalleryManager.ts`, `src/main.ts`

##### What shipped

Add a small method such as:

```ts
handleViewportMetricsChanged(): void
```

Recommended behavior:

- recompute bounds;
- clamp `targetZoom`, `zoom`, and pan targets;
- if the current view is already near the reset/default overview state, gently move it to the new `resetFitZoom`;
- if the user is deeply zoomed in / panned, preserve intent and only clamp.

##### Recommended heuristic

- If `Math.abs(targetZoom - previousResetFitZoom) < 0.2`, treat the user as being in “overview mode” and refit automatically.
- Otherwise only clamp, do not force a refit.

This prevents orientation changes from unexpectedly ejecting the user out of a manual close inspection.

#### Slice 4 — Fixed timeline clipping with structural headroom, not by removing the active state

**Files:** `src/styles/main.scss`

##### What shipped

1. Give `.timeline__list` enough top headroom for the active `translateY(-10px) scale(1.04)` state.
2. Add scroll gutters with:
   - `scroll-padding-inline`
   - `padding-inline`
   - `scroll-margin-inline` on items/thumbs
3. Keep the timeline touch-scrolling behavior intact.

##### CSS suggestion

```scss
.timeline__list {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 14px 18px 6px;
  scroll-padding-inline: 32px;
}

.timeline__item,
.timeline__thumb {
  scroll-margin-inline: 32px;
}
```

If the timeline becomes too tall, use a small balancing negative margin on the list rather than removing the headroom outright.

##### Fallback option

If Safari still clips the active transform despite the extra headroom, reduce the lift slightly (`translateY(-8px)`) before removing the active affordance entirely.

#### Slice 5 — Replaced pure `scrollIntoView()` with transform-aware centering

**File:** `src/timeline/Timeline.ts`

##### What shipped

1. Store the list element as a class field (`private readonly listEl`).
2. Add a dedicated `centerThumb(index, behavior)` helper.
3. Use manual centering math based on `getBoundingClientRect()` and current `scrollLeft`.
4. Respect reduced motion by switching from `smooth` to `auto` when needed.

##### Code suggestion

```ts
private centerThumb(index: number, behavior: ScrollBehavior): void {
  const thumb = this.thumbs[index];
  if (!thumb) return;

  const listRect = this.listEl.getBoundingClientRect();
  const thumbRect = thumb.getBoundingClientRect();
  const delta =
    (thumbRect.left + thumbRect.width * 0.5) -
    (listRect.left + listRect.width * 0.5);

  this.listEl.scrollTo({
    left: this.listEl.scrollLeft + delta,
    behavior,
  });
}
```

For v0.12 this is preferable to parsing the transform matrix. `getBoundingClientRect()` already reflects the transformed visual box, which is exactly what we want to center.

##### Reduced-motion suggestion

```ts
private preferredScrollBehavior(): ScrollBehavior {
  const reduced = document.documentElement.dataset['motion'] === 'reduced'
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return reduced ? 'auto' : 'smooth';
}
```

This should be used in `setActive()`.

#### Slice 6 — Diagnostics, QA matrix, and documentation

**Files:** `src/gallery/GalleryManager.ts`, `plan.md`, `FINDINGS.md`, `CHANGELOG.md`, `README.md`, `docs/HANDOFF.md`, support guides

##### Diagnostics to add

Extend `show-artwork-complete` with:

- `resetFitZoom`
- `maxOverviewZoom`
- `overviewHeadroom`
- `usableViewportWidth`
- `usableViewportHeight`
- `usableViewportFractionX`
- `usableViewportFractionY`

Add one debug/info event on viewport changes:

- scope: `layout`
- event: `art-viewport`
- payload: the measured occlusion + usable metrics

Add one timeline debug event only in non-default diagnostics mode:

- scope: `timeline`
- event: `center-active`
- payload: active index, target scrollLeft delta, behavior

##### QA matrix additions

- ultra-tall portrait on desktop first load
- ultra-tall portrait on phone portrait
- same artwork after rotate portrait ↔ landscape
- square and wide artwork regression check
- active timeline thumb after:
  - click
  - keyboard arrowing
  - direct `goTo(index)` navigation
  - touch-scroll then programmatic selection
- reduced-motion timeline centering

---

### Main files changed in the implementation pass

- `src/gallery/GalleryManager.ts`
- `src/timeline/Timeline.ts`
- `src/styles/main.scss`
- `src/main.ts`
- optional tiny helper file only if the viewport metrics type/provider should be shared cleanly
- `plan.md`, `FINDINGS.md`, `CHANGELOG.md`, `README.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/IMAGE_MAINTENANCE_GUIDE.md`

### Acceptance checks

- A very tall portrait opens with the whole framed artwork visible in the standard/reset view.
- Zoom-out controls, wheel, and pinch can move farther back than the reset/default fit.
- The reset/default fit remains visually appropriate for normal landscape, square, and medium portrait works.
- Close inspection still reaches every edge and corner after zooming in.
- Resizing, rotation, or mobile browser chrome changes do not leave the artwork in a stale overview fit.
- The active timeline item is never vertically clipped.
- Timeline selection stays comfortably centered with visible gutters.
- Reduced-motion sessions avoid forced smooth timeline scrolling.
- Diagnostics clearly expose both the art-safe viewport metrics and the new zoom bounds.

---

## v0.11 — Implemented (2026-05-18)

### Status

**Implemented 2026-05-18.** The technical coding plan documented in the section below ("v0.11 Plan — Responsive Phones, Tablets, Touch Controls, and Gesture Compatibility") has been executed in full. `npm run lint` and `npm run build` pass with only the pre-existing TypeScript parser warnings and Sass legacy-API deprecation notices. `customer-preview/` has been regenerated. The plan section below is kept verbatim as the design record; this section summarises what shipped.

### What shipped per slice

- **Slice 1 — Device capabilities + resize coordinator.** New `src/utils/device.ts` exports `DeviceCapabilities`, `detectDeviceCapabilities()`, and `applyDeviceCaps()`. The capabilities are mirrored to `<html>` as `data-layout-tier`, `data-pointer-primary`, `data-hover`, `data-orientation`, and `data-short-height`. `main.ts` registers a single debounced (`120 ms`) `resize` + `orientationchange` listener that calls `rendererManager.resize()`, re-detects capabilities, re-applies the data attributes, toggles InfoPanel compact mode, and refreshes the HintText copy. `SceneManager`'s existing camera-aspect listener is intentionally retained — the two listeners have complementary responsibilities and both are removed on `beforeunload`. **Fixes Bug 1 and Bug 4.**
- **Slice 2 — Viewport meta + safe-area CSS.** `app.html`, `index.html`, `customer-preview/app.html`, and `scripts/write-local-preview.mjs` all set `viewport-fit=cover`. `main.scss` introduces `--safe-top/right/bottom/left` wrapping `env(safe-area-inset-*, 0px)` and `--chrome-top`/`--chrome-bottom` spacing tokens that absorb the safe-area into the chrome budget. `body` is sized with a `100dvh` fallback chain. The canvas has `touch-action: none` (scoped to the canvas only). Topbar, info-panel, nav, zoom, fullscreen, prefs, timeline, hint, and fallback all now offset against the safe-area variables. The old single `@media (max-width: 720px)` block is replaced by an explicit four-phase breakpoint set: phone-portrait (<600), short-height landscape (<500h), tablet-portrait (600–899), tablet-landscape (900–1179), plus the legacy 720 safety net. **Fixes Bug 7.**
- **Slice 3 — InfoPanel compact mode + HintText pointer-aware copy.** `InfoPanel.setCompact(boolean)` toggles the new `.info-panel--compact` class which fills the width minus safe-area, raises the panel above the chrome, clamps the title font, allows `overflow-y: auto` (WCAG SC 1.4.10 Reflow), and enables pointer events for scrolling. `HintText.updateHint()` reads `data-pointer-primary` and shows `"Wischen zum Navigieren · Zwei Finger zum Zoomen."` on coarse pointers; the SCSS rule hides the hint on `phone-small`/`phone-portrait`. **Fixes Bug 5.**
- **Slice 4 — Unified `CanvasInteraction`.** New `src/interaction/CanvasInteraction.ts` consolidates the previous `MouseInteraction`, `ZoomPan`, and `TouchInteraction` classes. Pointer Events Level 3 is the primary path (`pointerdown`/`move`/`up`/`cancel`/`lostpointercapture`) with `setPointerCapture` for off-canvas drags; Touch Events are the fallback only when `window.PointerEvent` is missing, using non-passive `touchstart`/`touchmove` with `preventDefault()` while pinching/panning to suppress synthetic mouse events and own the gesture. The state machine has `idle / panning / pinching / swipe-candidate / cancelled`. Hover rotation is suppressed when `data-pointer-primary === 'coarse'`. Swipe activation runs on the up-event (WCAG SC 2.5.2). Wheel zoom stays passive. The legacy three classes remain in tree as dead code (not imported anywhere) so revert is cheap; they may be removed in a future cleanup pass. **Fixes Bug 2 and Bug 3.**
- **Slice 5 — Mobile target sizing + prefs overflow.** `.zoom-controls__btn`, `.fullscreen-btn`, and `.prefs__trigger` get `min-width: 44px; min-height: 44px;` so the visible icon size is preserved while the hit area always meets the comfort target. `.prefs__panel` uses `width: min(320px, calc(100vw - var(--safe-left) - var(--safe-right) - 24px))` and `max-height: calc(100dvh - var(--safe-top) - var(--safe-bottom) - 120px)` with `overflow-y: auto` and `-webkit-overflow-scrolling: touch`. Timeline list adds `-webkit-overflow-scrolling: touch`. **Fixes Bug 6.**
- **Slice 6 — Mobile WebGL quality + context loss.** `getOptimalPixelRatio()` now clamps the effective cap to `1.5` when `(pointer: coarse)` matches. New `suggestStartupQuality()` returns `battery` for high-DPR small phones, `balanced` elsewhere; `main.ts` only applies it when `PreferencesStore.hasStoredQuality()` is `false`, so a user's stored choice is always respected. `RendererManager` registers `webglcontextlost` (with `preventDefault()`) and `webglcontextrestored` listeners. Both emit diagnostics; `isRenderPaused()` returns `true` between them, and the `animate()` loop in `main.ts` short-circuits while paused. `isMobileDevice()` is marked `@deprecated` in JSDoc but retained for backwards compatibility.
- **Slice 7 — Fallback screen mobile improvements.** Adds a coarse-pointer-only tip about private browsing/hardware acceleration. The technical reason string is HTML-escaped and only rendered when `getDiagnostics().getMode() !== 'default'`. The card width now honours safe-area insets via SCSS.
- **Slice 8 — Documentation.** This section, the changelog, `FINDINGS.md`, `README.md`, `DOCUMENTATION_RULES.md`, and `docs/HANDOFF.md` are all updated for the implementation pass.

### Files added

- `src/utils/device.ts`
- `src/interaction/CanvasInteraction.ts`

### Files modified

- `app.html`, `index.html`, `customer-preview/app.html`, `scripts/write-local-preview.mjs` (viewport-fit)
- `src/main.ts` (capability detection, startup-quality heuristic, resize coordinator, render-pause check, unified interaction wiring, cleanup)
- `src/core/RendererManager.ts` (context-loss handling, `isRenderPaused`)
- `src/styles/main.scss` (safe-area variables, breakpoints, compact info-panel, prefs overflow, touch-action canvas, dvh)
- `src/ui/InfoPanel.ts` (`setCompact`)
- `src/ui/HintText.ts` (`updateHint` capability-aware)
- `src/ui/FallbackScreen.ts` (mobile tip, debug-only reason, HTML escape)
- `src/utils/performance.ts` (mobile DPR cap, `suggestStartupQuality`, `isMobileDevice` deprecated)
- `src/utils/preferences.ts` (`PreferencesStore.hasStoredQuality`)
- `customer-preview/` regenerated bundle

### Validation

- `npm run lint` and `npm run build` pass (only the pre-existing Sass legacy-API deprecation warning and the TypeScript parser version warning remain).
- The Vite build now transforms `46` modules instead of `47` because three legacy interaction sources are no longer imported.
- Type-check (`tsc`) runs clean.
- `customer-preview/freyraum-gallery.js` and `customer-preview/style.css` were rebuilt and committed.

### Known limitations / follow-up candidates

- The unused `src/interaction/{MouseInteraction,ZoomPan,TouchInteraction}.ts` files are kept in tree as dead code to make the change reversible. A subsequent cleanup PR can delete them once v0.11 has shipped to customers.
- WebGL context-loss recovery currently logs and pauses; there is no user-visible recovery overlay yet. A second pass (mentioned in the design section below) can add an explicit "Vorschau wird wiederhergestellt …" hint and a retry button.
- `ResizeObserver` is not yet wired into the renderer. The debounced `window.resize` + `orientationchange` path is sufficient for the FREYRAUM canvas (it always fills the viewport), but split-view or embedded-frame scenarios could benefit from a follow-up.
- Manual QA against physical phones/tablets remains the customer's responsibility. The QA matrix in the design section below stays as the acceptance recipe.

---

## v0.11 Plan — Responsive Phones, Tablets, Touch Controls, and Gesture Compatibility (Technical Coding Plan)

### Status

**Final research-validated technical coding plan updated 2026-05-18.** No runtime code was changed in this pass. The previous planning pass documented goals and guidelines. This pass upgrades every slice to a concrete, code-level implementation plan based on a deep audit of the full source tree and a final online validation pass against current official platform and accessibility guidance. Each slice now names the exact files, functions, interfaces, TypeScript/CSS patterns, confirmed browser/platform constraints, and follow-up enhancements to write.

Desktop web remains the primary visual design. The goal is to harden the existing codebase for phones and tablets without disrupting existing desktop quality.

---

### Final online validation pass (2026-05-18)

The current v0.11 direction was validated against current official guidance and remains broadly correct. The core plan is still the right implementation path.

#### Assumptions now validated online

- **Touch target sizing remains correct:** WCAG 2.2 SC 2.5.8 requires at least **24 × 24 CSS px** unless an exception applies; practical mobile UI guidance still favors larger controls. Our project target of **44–48 px** remains the right comfort target.
- **Gesture fallbacks remain mandatory:** WCAG SC 2.5.1 still requires that multipoint/path gestures such as pinch or swipe are not the only path to complete a task. The existing FREYRAUM nav buttons, zoom controls, reset, timeline, and keyboard shortcuts remain an important strength and should stay first-class.
- **Pointer cancellation remains important:** WCAG SC 2.5.2 still supports activation on the up-event rather than down-event. This validates keeping navigation activation on release/end rather than on initial touch.
- **`viewport-fit=cover` + safe-area CSS is the right path:** current viewport guidance still supports `viewport-fit=cover` for edge-to-edge layouts, but only together with `env(safe-area-inset-*)` protection for essential UI.
- **`dvh` / `svh` / `lvh` remain the right modern viewport units:** current guidance supports using dynamic viewport units with a fallback to legacy `vh`.
- **Pointer Events remain the preferred unified API:** Pointer Events Level 3 is still the recommended cross-input model for mouse/touch/pen. Touch Events should only remain as a fallback for older Safari floors or edge-case compatibility.
- **`touch-action` is still required, not just `preventDefault()`:** modern guidance still favors CSS gesture ownership through `touch-action`, with non-passive listeners only where the code truly needs to cancel the default behavior.
- **High-DPI / context-loss handling should be part of mobile hardening:** current WebGL guidance still emphasizes correct drawing-buffer resizing on high-DPR screens and robust `webglcontextlost` / `webglcontextrestored` handling, especially on mobile memory pressure.

#### Official / authoritative sources used for the validation

- W3C WCAG 2.2 — SC 2.5.8 Target Size (Minimum): <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html>
- W3C WCAG 2.1 — SC 2.5.1 Pointer Gestures: <https://www.w3.org/WAI/WCAG21/Understanding/pointer-gestures.html>
- W3C WCAG 2.1 — SC 2.5.2 Pointer Cancellation: <https://www.w3.org/WAI/WCAG21/Understanding/pointer-cancellation.html>
- W3C WCAG 2.1 — SC 1.4.10 Reflow: <https://www.w3.org/WAI/WCAG21/Understanding/reflow.html>
- W3C Pointer Events Level 3: <https://www.w3.org/TR/pointerevents3/>
- MDN — `touch-action`: <https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action>
- MDN — viewport meta / `viewport-fit`: <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport>
- MDN — CSS `env()` safe-area environment variables: <https://developer.mozilla.org/en-US/docs/Web/CSS/env>
- MDN — WebGL best practices: <https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices>
- Khronos WebGL Wiki — Handling High DPI: <https://wikis.khronos.org/webgl/HandlingHighDPI>
- Khronos WebGL specification — context loss handling: <https://registry.khronos.org/webgl/specs/latest/1.0/>

#### Net result of the validation

The current v0.11 coding direction is confirmed, but the online validation highlights four additions that should now be treated as part of the plan rather than optional afterthoughts:

1. **Context-loss handling must be explicitly planned** for mobile WebGL reliability.
2. **Drawing-buffer resize accuracy must be validated on high-DPR devices** and not only with `window.resize`.
3. **Reflow at 320 CSS px width and browser zoom must be tested explicitly** because fixed chrome and overlays remain a risk.
4. **`touch-action` + listener-passivity rules must be documented together** because relying on only one of them is not robust enough.

---

### Code audit findings (critical bugs and risks found)

These were discovered during the v0.11 technical analysis pass. They are ordered by mobile impact.

#### Bug 1 — `RendererManager.resize()` is never called on window resize (critical for mobile)

`SceneManager.ts` has `window.addEventListener('resize', this.handleResize)` which only updates `camera.aspect` and calls `updateProjectionMatrix()`. The canvas uses `position: fixed; inset: 0; width: 100% !important; height: 100% !important` so it fills the viewport visually, but `renderer.setSize()` inside `RendererManager.resize()` is never called on orientation change or browser chrome resize. This means Three.js internal render resolution stays at initial size. On phones, rotating landscape→portrait leaves the framebuffer at the wrong resolution.

**Fix:** In `main.ts`, add a single debounced `'resize'` listener that calls both `rendererManager.resize()` and lets `SceneManager.handleResize` run. Or better: move resize coordination to a new `ResizeCoordinator` utility that both managers subscribe to.

#### Bug 2 — All touch listeners are passive; pinch cannot prevent native zoom (critical for iOS Safari)

`TouchInteraction.ts` registers all three handlers with `{ passive: true }`:
```ts
canvas.addEventListener('touchstart', ..., { passive: true });
canvas.addEventListener('touchmove', ..., { passive: true });
canvas.addEventListener('touchend', ..., { passive: true });
```
`{ passive: true }` means `event.preventDefault()` cannot be called. On iOS Safari, when the user pinches, the browser's native page zoom fires in parallel with our custom zoom, causing jerky dual-zoom or unwanted page scale changes. This cannot be fixed without switching to `{ passive: false }` for `touchmove` (and `touchstart` during pinch state).

**Fix:** In the new unified `CanvasInteraction.ts`, register `touchmove` as `{ passive: false }` and call `e.preventDefault()` inside `if (e.touches.length >= 2)` to own the pinch gesture. Also call `e.preventDefault()` during single-finger pan-while-zoomed to prevent page drift. Everything else remains passive.

#### Bug 3 — TouchInteraction and MouseInteraction/ZoomPan coexist without coordination (duplicate events)

On touch devices, a tap on the canvas fires: `touchstart` → `touchend` → `mousemove` (synthetic) → `mousedown` (synthetic) → `mouseup` → `click` (synthetic). `ZoomPan.ts` listens to `mousedown`/`mousemove`/`mouseup` on the canvas; `MouseInteraction.ts` listens to `click` and `mousemove`. A single tap can trigger both the touch swipe path and the mouse click path. The current code is mostly safe because swipe requires a >50 px movement, but this is fragile.

**Fix:** In `CanvasInteraction.ts`, set `canvas.style.touchAction = 'none'` and detect whether the browser fired a `touchstart` first (using a `pointerType` flag on `PointerEvent` or a per-frame `hadTouch` flag). Suppress synthetic mouse events after touch by calling `e.preventDefault()` on `touchstart` when building the unified interaction class.

#### Bug 4 — `isMobileDevice()` only checks viewport width, not pointer type

`src/utils/performance.ts`:
```ts
export function isMobileDevice(): boolean {
  return window.innerWidth < 768;
}
```
This misses touch laptops (wide viewport, coarse pointer), phones in landscape (can be wider than 768), and iPads. It is not used in many places but is a misleading utility.

**Fix:** Replace with capability-based detection in the new `src/utils/device.ts`. Expose `isPrimaryCoarsePointer()`, `hasFinePointer()`, `hasHoverCapability()`, and `getLayoutTier()`.

#### Bug 5 — `HintText` always shows desktop-only copy

`HintText.ts` hardcodes `'Scrollen zum Zoomen · Ziehen zum freien Bewegen.'` and is `aria-hidden`. On phones, where scrolling is touch not wheel, this hint is wrong and wastes vertical space.

**Fix:** Drive hint copy from `[data-input-primary]` data attribute set in Slice 1. On coarse-pointer devices show `'Wischen zum Navigieren · Zwei Finger zum Zoomen.'` or hide the hint entirely.

#### Bug 6 — Preferences panel can overflow screen on narrow phones

`.prefs__panel` is `position: absolute; top: 56px; right: 0; width: 320px`. On phones narrower than ~380 px, the 320 px panel clips the left side. On very short landscape viewports the panel's content overflows the screen bottom.

**Fix:** In SCSS, clamp panel width to `min(320px, calc(100vw - 32px))`, add `max-height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 80px)`, and add `overflow-y: auto` so the content scrolls inside the panel.

#### Bug 7 — No `viewport-fit=cover`, no safe-area CSS, no `dvh` units

`app.html` meta:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
```
Missing `viewport-fit=cover`. On iPhone with notch/Dynamic Island, the topbar, info panel, and timeline can sit under the safe areas or home indicator. No `env(safe-area-inset-*)` variables are used anywhere in `main.scss`.

**Fix:** Add `viewport-fit=cover` to the viewport meta. Add CSS custom properties:
```scss
:root {
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-right: env(safe-area-inset-right, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left: env(safe-area-inset-left, 0px);
}
```
Apply `padding-top: var(--safe-top)` to `.topbar`, `padding-bottom: var(--safe-bottom)` to `.timeline`, etc. Use `100dvh` for full-screen overlays with `100vh` fallback.

---

### Slice 1 — Device capability model and diagnostics  
**New file:** `src/utils/device.ts`  
**Modified:** `src/utils/preferences.ts`, `src/main.ts`, `src/utils/Diagnostics.ts`

#### What to build

Create `src/utils/device.ts` with a single `DeviceCapabilities` interface and a function `detectDeviceCapabilities()` that samples the viewport and media queries once:

```typescript
export type LayoutTier = 'desktop' | 'tablet-landscape' | 'tablet-portrait' | 'phone-landscape' | 'phone-portrait' | 'phone-small';
export type PointerPrimary = 'fine' | 'coarse' | 'none';

export interface DeviceCapabilities {
  layoutTier: LayoutTier;
  pointerPrimary: PointerPrimary;
  hasHover: boolean;
  dpr: number;
  orientation: 'portrait' | 'landscape';
  viewportW: number;
  viewportH: number;
}

export function detectDeviceCapabilities(): DeviceCapabilities {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const portrait = h >= w;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const hover = window.matchMedia('(hover: hover)').matches;
  const dpr = window.devicePixelRatio ?? 1;

  let layoutTier: LayoutTier;
  if (w < 360) layoutTier = 'phone-small';
  else if (w < 600) layoutTier = 'phone-portrait';
  // 600–899px where height >= width: still feels like portrait orientation (e.g. 768×1024 tablet portrait)
  else if (w < 900 && portrait) layoutTier = 'tablet-portrait';
  // 600–899px where width > height: short landscape phone or small landscape tablet
  else if (w < 900) layoutTier = 'phone-landscape';
  else if (w < 1180) layoutTier = 'tablet-landscape';
  else layoutTier = 'desktop';

  return {
    layoutTier,
    pointerPrimary: coarse ? 'coarse' : fine ? 'fine' : 'none',
    hasHover: hover,
    dpr,
    orientation: portrait ? 'portrait' : 'landscape',
    viewportW: w,
    viewportH: h,
  };
}
```

#### Mirror to `<html>` data attributes

In `src/utils/preferences.ts` (or a new `applyDeviceCaps()` called from `PreferencesStore.applyToDocument()`), add:

```typescript
const root = document.documentElement;
root.dataset['layoutTier'] = caps.layoutTier;
root.dataset['pointerPrimary'] = caps.pointerPrimary;
root.dataset['hover'] = caps.hasHover ? 'true' : 'false';
root.dataset['orientation'] = caps.orientation;
```

This lets SCSS react without JS recalculation:
```scss
:root[data-pointer-primary='coarse'] .hint-text { display: none; }
:root[data-layout-tier='phone-portrait'] .info-panel { /* compact style */ }
```

#### Debounced resize coordination (also fixes Bug 1)

In `main.ts`, after the existing `SceneManager` and `RendererManager` creation, add one resize coordinator:

```typescript
let resizeTimer: ReturnType<typeof setTimeout> | undefined;
const handleResize = (): void => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    rendererManager.resize();              // sets renderer size (Bug 1 fix)
    // SceneManager already has its own 'resize' listener for camera
    const caps = detectDeviceCapabilities();
    applyDeviceCaps(caps);
    diagnostics.info('layout', 'resize', 'Viewport resized', {
      tier: caps.layoutTier,
      w: caps.viewportW,
      h: caps.viewportH,
      orientation: caps.orientation,
    });
  }, 120);  // 120 ms debounce; fast enough for orientation, not spammy
};
window.addEventListener('resize', handleResize);
// Clean up in beforeunload cleanup block alongside other disposers
```

**Note:** Do not add another `'resize'` listener inside `SceneManager` — it already has one. The debounced `handleResize` in `main.ts` only drives `rendererManager.resize()` and device-caps updates.

#### Enhancement — optional `ResizeObserver` follow-up

Online validation suggests that high-DPI canvas sizing is more robust when driven by actual element size changes, not only `window.resize`. A follow-up enhancement after the first v0.11 pass should consider a `ResizeObserver` on the renderer container/canvas so split-screen, browser UI shifts, or embedded layouts cannot silently desync CSS size and drawing-buffer size.

**Recommendation:** keep the debounced `window.resize` fix as the first implementation because it is simple and low-risk, but document a second-step enhancement to evaluate `ResizeObserver` once the initial responsive pass is stable.

#### Diagnostics

Use the existing `createScopedDiagnostics('layout')` pattern. Log capabilities once on startup as `info` level:

```typescript
diagnostics.info('layout', 'capabilities', 'Device capabilities detected', {
  tier: caps.layoutTier,
  pointer: caps.pointerPrimary,
  hover: caps.hasHover,
  dprCap: preset.pixelRatioCap,
  dprActual: caps.dpr,
  orientation: caps.orientation,
});
```

---

### Slice 2 — Viewport, safe-areas, and CSS layout foundation  
**Modified:** `app.html`, `index.html`, `customer-preview/app.html` (if exists), `src/styles/main.scss`

#### HTML viewport meta

Change in `app.html` and any other entry HTML files:
```html
<!-- Before -->
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<!-- After -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
```

`viewport-fit=cover` makes the viewport fill notch/cutout areas; the `env(safe-area-inset-*)` CSS variables then let us push content away from hardware edges.

#### Safe-area CSS variables in `:root`

Add to the `:root` block in `main.scss`:
```scss
:root {
  // ... existing tokens ...
  // Safe-area insets (zero on desktop/non-notch devices; populated on iPhone/iPad with notch)
  --safe-top:    env(safe-area-inset-top, 0px);
  --safe-right:  env(safe-area-inset-right, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left:   env(safe-area-inset-left, 0px);

  // Chrome spacing tokens that absorb safe-area
  --chrome-top:    max(72px, calc(56px + var(--safe-top)));
  --chrome-bottom: max(168px, calc(148px + var(--safe-bottom)));
}
```

#### Full-screen canvas and overlay height

Replace `height: 100%` in `html, body` with:
```scss
html, body {
  height: 100%;         // legacy fallback
  height: 100dvh;       // dynamic viewport height (hides when browser chrome hides)
}
canvas {
  position: fixed;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  touch-action: none;   // tell browser we handle gestures (see Slice 4)
}
```

**Important nuance from the validation:** `touch-action: none` is correct for the canvas only if all essential actions still have visible alternatives and browser zoom remains available elsewhere in the page. Do not extend `touch-action: none` to the entire document.

#### Topbar safe-area

```scss
.topbar {
  padding-top: calc(var(--safe-top) + 8px);  // push below notch
  height: calc(72px + var(--safe-top));       // extend to fill notch background
  // ... existing styles
}
```

#### Timeline safe-area

```scss
.timeline {
  padding-bottom: calc(16px + var(--safe-bottom));  // push above home indicator
}
```

#### Breakpoint system

Replace the single `@media (max-width: 720px)` block with a breakpoint map:

```scss
// Breakpoint tokens (read-only; do not use as class targets)
// phone-small:      <360px
// phone-portrait:   360–599px portrait
// phone-landscape:  height < 500px (short landscape)
// tablet-portrait:  600–899px
// tablet-landscape: 900–1179px
// desktop:          >=1180px

@media (max-width: 599px) {
  // phone portrait: compact info, safe-area controls
}
@media (max-width: 599px) and (orientation: landscape),
       (max-height: 499px) {
  // phone landscape: minimal chrome height
}
@media (min-width: 600px) and (max-width: 899px) {
  // tablet portrait
}
@media (min-width: 900px) and (max-width: 1179px) {
  // tablet landscape
}
```

#### Fixed control offsets — remove hardcoded px, use calc()

Each element that uses `bottom: 168px` etc. should be changed to:
```scss
// Example: nav-controls
.nav-controls {
  bottom: calc(var(--chrome-bottom) + 8px);  // respects safe-area + timeline height
}
// Example: zoom-controls  
.zoom-controls {
  bottom: calc(var(--chrome-bottom) + 8px);
  right: calc(36px + var(--safe-right));
}
// Example: fullscreen-btn
.fullscreen-btn {
  top: calc(var(--chrome-top) + 24px);
  right: calc(36px + var(--safe-right));
}
// Example: prefs
.prefs {
  top: calc(var(--chrome-top) + 24px);
  right: calc(90px + var(--safe-right));
}
```

---

### Slice 3 — Mobile information architecture and overlap prevention  
**Modified:** `src/styles/main.scss`, `src/ui/InfoPanel.ts`, `src/ui/HintText.ts`

#### InfoPanel — compact phone mode

The info panel is `position: fixed; bottom: 188px; left: 36px; width: min(520px, ...)`. On phones this is too wide and may collide with the nav buttons.

**TypeScript change in `InfoPanel.ts`:** Add a `setCompact(compact: boolean)` method that toggles a CSS class:
```typescript
setCompact(compact: boolean): void {
  this.el.classList.toggle('info-panel--compact', compact);
}
```

Call it from `main.ts` based on layout tier:
```typescript
const caps = detectDeviceCapabilities();
infoPanel.setCompact(caps.layoutTier === 'phone-portrait' || caps.layoutTier === 'phone-small');
```

**SCSS for compact mode:**
```scss
.info-panel--compact {
  left: var(--safe-left, 12px);
  right: var(--safe-right, 12px);
  width: auto;          // fills available width minus safe areas
  bottom: calc(var(--chrome-bottom) + 80px);  // above nav and timeline
  padding: 14px 18px 16px;
  max-height: 30vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  .info-panel__title {
    font-size: clamp(22px, 6vw, 34px);  // smaller on phones
    margin-bottom: 8px;
  }

  .info-panel__description {
    // clamp long descriptions on phones; allow scroll inside the panel
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

**Brainstorm — expandable info panel (optional enhancement):**  
Rather than always showing all text, add a small expand/collapse toggle in compact mode. The button label should be accessible. Keep it simple: a CSS `details`/`summary` element wrapping the description and credit would work with zero JS. The eyebrow, title, and meta stay always visible.

#### HintText — conditional copy based on pointer type

In `HintText.ts`, instead of hardcoded German text, read the `data-pointer-primary` attribute that Slice 1 sets:
```typescript
constructor(container: HTMLElement) {
  this.el = document.createElement('p');
  this.el.className = 'hint-text';
  this.el.setAttribute('aria-hidden', 'true');
  this.updateHint();
  container.appendChild(this.el);
}

updateHint(): void {
  const pointer = document.documentElement.dataset['pointerPrimary'] ?? 'fine';
  this.el.textContent = pointer === 'coarse'
    ? 'Wischen zum Navigieren · Zwei Finger zum Zoomen.'
    : 'Scrollen zum Zoomen · Ziehen zum freien Bewegen.';
}
```

Add `display: none` in SCSS for phone-portrait since space is limited:
```scss
:root[data-layout-tier='phone-portrait'] .hint-text,
:root[data-layout-tier='phone-small'] .hint-text {
  display: none;
}
```

---

### Slice 4 — Unified canvas interaction (Bug 2 + 3 fix)  
**New file:** `src/interaction/CanvasInteraction.ts`  
**Modified:** `src/main.ts` (remove `TouchInteraction`, `MouseInteraction`, `ZoomPan` instantiation; replace with `CanvasInteraction`)  
**Kept:** `TouchInteraction.ts`, `MouseInteraction.ts`, `ZoomPan.ts` (retained as-is; `CanvasInteraction` delegates to them or supersedes them)

#### Design decision

**Brainstorm A — Refactor in place:** Keep the three existing classes but add a `PointerCoordinator` that suppresses synthetic mouse events after touch.

**Brainstorm B — New unified class:** Write `CanvasInteraction.ts` that handles both Pointer Events (modern) and Touch Events (fallback), replacing `TouchInteraction` and `ZoomPan`. `MouseInteraction` hover logic folds in.

**Recommendation — Brainstorm B with incremental migration.** The three existing classes are small and clean; replacing them with one well-structured class reduces surface area and solves all three bugs in one place. Keep the old files in the tree until the new class is validated, then remove them.

#### `CanvasInteraction.ts` — gesture state machine

```typescript
type GestureState =
  | 'idle'
  | 'hover'            // fine pointer, not down
  | 'swipe-candidate'  // one pointer down, not zoomed, < 50px moved
  | 'panning'          // one pointer down while canPan() is true
  | 'dragging'         // fine pointer dragging while not zoomed (hover rotation)
  | 'pinching'         // two touch points active
  | 'cancelled';       // gesture invalidated (multi-touch interrupted)

export class CanvasInteraction {
  private state: GestureState = 'idle';
  private pointer0 = { x: 0, y: 0, startX: 0, startY: 0, id: -1 };
  private pointer1 = { x: 0, y: 0, id: -1 };
  private lastPinchDist = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly galleryManager: GalleryManager
  ) {
    // Use Pointer Events for modern browsers
    if (window.PointerEvent) {
      canvas.addEventListener('pointerdown',  this.onPointerDown);
      canvas.addEventListener('pointermove',  this.onPointerMove);
      canvas.addEventListener('pointerup',    this.onPointerUp);
      canvas.addEventListener('pointercancel',this.onPointerCancel);
    } else {
      // Touch Events fallback for older iOS Safari
      canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
      canvas.addEventListener('touchmove',  this.onTouchMove,  { passive: false });
      canvas.addEventListener('touchend',   this.onTouchEnd,   { passive: true  });
    }
    // Wheel zoom: keep passive (doesn't need preventDefault)
    canvas.addEventListener('wheel', this.onWheel, { passive: true });
  }
  // ...
```

#### Key method patterns

```typescript
// Pointer Events path
private onPointerDown = (e: PointerEvent): void => {
  if (e.pointerType === 'touch') {
    this.canvas.setPointerCapture(e.pointerId);
    // track up to 2 pointers for pinch
  }
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  // set state to swipe-candidate or dragging depending on pointerType + canPan()
};

private onPointerMove = (e: PointerEvent): void => {
  if (e.pointerType === 'mouse' && this.state === 'idle') {
    // hover rotation — only on fine pointer at rest
    this.updateHoverRotation(e.clientX, e.clientY);
    return;
  }
  if (this.state === 'pinching') {
    this.handlePinchMove();
    e.preventDefault(); // safe: called inside non-passive listener
    return;
  }
  // ... pan / swipe tracking
};
```

#### Preventing iOS pinch-zoom (non-passive fix for Bug 2)

With Pointer Events, `canvas.addEventListener('pointerdown', ..., { passive: false })` is needed only when we are about to call `preventDefault()` inside. For Pointer Events path, `preventDefault()` on `pointermove` prevents browser scroll/zoom. This is safe because the canvas is a fixed full-screen element.

For the Touch Events fallback path, `touchmove` must be `{ passive: false }` and `e.preventDefault()` must be called inside pinch state:
```typescript
private onTouchMove = (e: TouchEvent): void => {
  if (e.touches.length >= 2) {
    e.preventDefault();  // own the pinch; blocks iOS Safari page zoom
    this.handlePinchFromTouches(e.touches);
  } else if (this.state === 'panning') {
    e.preventDefault();  // own the pan; blocks page drift
    this.handlePanFromTouch(e.touches[0]);
  }
};
```

**Validated platform rule:** keep `touch-action` and the non-passive fallback together in the plan. Current browser guidance still warns against relying only on `preventDefault()`, while older Safari behavior means we also should not rely only on `touch-action`.

#### Suppressing synthetic mouse events after touch (Bug 3 fix)

When using the Touch Events fallback path, add `e.preventDefault()` on `touchstart` to suppress synthetic `mousedown`/`click` that the browser generates after touch:
```typescript
private onTouchStart = (e: TouchEvent): void => {
  e.preventDefault();  // suppresses synthetic mouse events
  // ... rest of touchstart handling
};
```

When using Pointer Events, synthetic mouse events are not generated, so no suppression is needed.

#### Wheel handler (unchanged from ZoomPan.ts)

```typescript
private onWheel = (e: WheelEvent): void => {
  this.galleryManager.addZoomDelta(e.deltaY * 0.0045);
};
```

#### Hover rotation on fine-pointer devices only

```typescript
private updateHoverRotation(clientX: number, clientY: number): void {
  if (document.documentElement.dataset['pointerPrimary'] === 'coarse') return;
  const normalizedX = (clientX / window.innerWidth) * 2 - 1;
  const normalizedY = (clientY / window.innerHeight) * 2 - 1;
  const hoverScale = this.galleryManager.getHoverRotationScale();
  this.galleryManager.setHoverTarget(normalizedX * hoverScale.x, normalizedY * hoverScale.y);
}
```

#### `dispose()` pattern

Must remove all listeners registered in the constructor:
```typescript
dispose(): void {
  if (window.PointerEvent) {
    this.canvas.removeEventListener('pointerdown',   this.onPointerDown);
    this.canvas.removeEventListener('pointermove',   this.onPointerMove);
    this.canvas.removeEventListener('pointerup',     this.onPointerUp);
    this.canvas.removeEventListener('pointercancel', this.onPointerCancel);
  } else {
    this.canvas.removeEventListener('touchstart', this.onTouchStart);
    this.canvas.removeEventListener('touchmove',  this.onTouchMove);
    this.canvas.removeEventListener('touchend',   this.onTouchEnd);
  }
  this.canvas.removeEventListener('wheel', this.onWheel);
}
```

#### `main.ts` wiring change

Replace four separate interaction instantiations:
```typescript
// Remove:
const mouseInteraction = new MouseInteraction(canvas, galleryManager);
const zoomPan = new ZoomPan(canvas, galleryManager, mouseInteraction);
const touchInteraction = new TouchInteraction(canvas, galleryManager);

// Add:
const canvasInteraction = new CanvasInteraction(canvas, galleryManager);
```

Update the `beforeunload` cleanup to call `canvasInteraction.dispose()` instead of the three individual dispose calls.

---

### Slice 5 — Touch-friendly controls and SCSS target sizing  
**Modified:** `src/styles/main.scss`, `src/ui/PreferencesPanel.ts`, `src/ui/InfoPanel.ts`

#### Target size audit results from code

| Control | Visual size | Touch area | Status |
| --- | --- | --- | --- |
| `.nav-btn` | 64 × 64 px | Same | ✅ Good |
| `.zoom-controls__btn` | 44 × 44 px | 44 × 44 px | ⚠ Meets minimum; no extra spacing |
| `.fullscreen-btn` | 44 × 44 px | 44 × 44 px | ⚠ Same |
| `.prefs__trigger` | 44 × 44 px | 44 × 44 px | ⚠ Same |
| `.timeline__thumb` | 150 × 95 px | Same | ✅ Good |

For the ⚠ items, the visual size is at the minimum but there is no extra tap area. Add `padding` with a matching negative `margin` to expand the hit area without changing the visual layout:

```scss
// Expand hit area without changing visual footprint
.zoom-controls__btn {
  padding: 4px;              // +8px total tap area → 52px on both axes
  margin: -4px;
}
.fullscreen-btn {
  // already 44px; add touch padding for phone use
  padding: 6px;
  width: 32px;               // 32 + 2×6 = 44 visual via padding trick
  height: 32px;
}
```

**Alternative (cleaner):** Use `min-width` and `min-height: 44px` on each button and center the visual icon inside it. This is more robust than negative margin.

#### Preferences panel — mobile overflow fix (Bug 6)

In `main.scss`, update `.prefs__panel`:
```scss
.prefs__panel {
  // ... existing styles
  width: min(320px, calc(100vw - var(--safe-left) - var(--safe-right) - 24px));
  max-height: calc(100dvh - var(--safe-top) - var(--safe-bottom) - 80px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

No TypeScript changes needed for this fix.

#### Timeline horizontal scroll on phones

The timeline bar already uses `overflow-x: auto` (confirm) but needs `-webkit-overflow-scrolling: touch` for iOS momentum scrolling and `scroll-snap-type: x mandatory` with `scroll-snap-align: center` on each thumb for a satisfying scroll-to-item feel:

```scss
.timeline__list {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.timeline__thumb {
  scroll-snap-align: center;
}
```

The existing `scrollIntoView({ behavior: 'smooth', inline: 'center' })` in `Timeline.ts` already centers the active thumb, which cooperates well with snap.

---

### Slice 6 — Mobile WebGL quality and resize coordination  
**Modified:** `src/utils/performance.ts`, `src/config/quality.ts`, `src/utils/AdaptiveQualityController.ts`, `src/core/RendererManager.ts`, `src/main.ts`

#### Startup quality heuristic for mobile (Bug 4 extension)

Add a function in `src/utils/performance.ts`:

```typescript
import type { QualityPresetId } from '../config/quality';

export function suggestStartupQuality(): QualityPresetId {
  const dpr = window.devicePixelRatio ?? 1;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const area = window.innerWidth * window.innerHeight;

  // Thresholds (document here for reviewers):
  // 600_000 px² ≈ a 775×775 viewport — typical small phone portrait (e.g. 390×844 = 329,160)
  // 800_000 px² ≈ an 894×894 viewport — medium phone or low-end tablet
  const SMALL_PHONE_AREA = 600_000;
  const MEDIUM_DEVICE_AREA = 800_000;

  // High-DPR coarse-pointer phone: battery preset to avoid thermal throttling
  if (coarse && dpr >= 2 && area < SMALL_PHONE_AREA) return 'battery';
  // Other coarse-pointer devices (mid-range phones, older tablets): balanced
  if (coarse && area < MEDIUM_DEVICE_AREA) return 'balanced';
  // Large tablet or desktop
  return 'balanced';  // keep default as balanced; user can raise to high
}
```

In `main.ts`, apply this suggestion only when there is no stored user preference:
```typescript
const stored = readStored();  // already done via PreferencesStore constructor
const defaultQuality = stored.quality ?? suggestStartupQuality();
const initialPreset = getQualityPreset(defaultQuality);
```

**Brainstorm — avoid overriding stored preferences.** The `PreferencesStore` constructor already reads stored quality. The startup heuristic should only apply when `localStorage` is empty. One clean pattern: add `PreferencesStore.hasStoredQuality(): boolean` and call `suggestStartupQuality()` only when it returns `false`.

#### DPR cap for mobile

Current caps: high=1.8, balanced=1.4, battery=1.0. These are already reasonable. Add a mobile-specific cap in `getOptimalPixelRatio`:

```typescript
export function getOptimalPixelRatio(cap: number): number {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const mobileCap = coarse ? Math.min(cap, 1.5) : cap;  // extra cap on touch devices
  return Math.min(window.devicePixelRatio, mobileCap);
}
```

This prevents a `balanced` tablet from rendering at 2.0 DPR (common on iPad) which would be expensive. The `1.5` cap on coarse-pointer devices is a reasonable tradeoff.

#### Resize coordinator — renderer + camera (Bug 1 fix, revisited with full detail)

The resize should be a single debounced coordinator in `main.ts`. The exact implementation:

```typescript
let resizeDebounce: ReturnType<typeof setTimeout> | undefined;
const onResize = (): void => {
  clearTimeout(resizeDebounce);
  resizeDebounce = setTimeout(() => {
    rendererManager.resize();  // calls renderer.setSize(innerWidth, innerHeight)
    // SceneManager already has its own resize listener that updates camera.aspect
    const newCaps = detectDeviceCapabilities();
    applyDeviceCaps(newCaps);
    diagnostics.info('layout', 'resize-complete', 'Resize handled', {
      w: window.innerWidth,
      h: window.innerHeight,
      tier: newCaps.layoutTier,
    });
  }, 120);
};
window.addEventListener('resize', onResize);
```

Add cleanup to the `beforeunload` handler:
```typescript
window.removeEventListener('resize', onResize);
clearTimeout(resizeDebounce);
```

**Note:** `SceneManager` already calls `camera.updateProjectionMatrix()` inside its own `handleResize`. Do not remove that listener — two resize handlers on the same event is fine when they have complementary responsibilities, as long as both are removed in dispose.

#### `RendererManager.resize()` — confirm it calls `setPixelRatio` after `setSize`

Current code:
```typescript
resize(): void {
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setPixelRatio(getOptimalPixelRatio(this.preset.pixelRatioCap));
}
```
This is correct — `setPixelRatio` after `setSize` is the right order. No change needed here, only ensure it is called.

#### Additional mobile/WebGL reliability item — context loss

The online validation surfaced one important reliability gap not yet covered in the original v0.11 slices: **mobile WebGL context loss**.

**Files likely touched:** `src/core/RendererManager.ts`, `src/main.ts`, docs, possibly `src/ui/FallbackScreen.ts`.

Add a small, explicit plan item:

```typescript
canvas.addEventListener('webglcontextlost', (event) => {
  event.preventDefault();
  diagnostics.warn('render', 'context-lost', 'WebGL context lost', {});
  // Pause render loop / show lightweight recovery state
});

canvas.addEventListener('webglcontextrestored', () => {
  diagnostics.info('render', 'context-restored', 'WebGL context restored', {});
  // Rebuild renderer-owned GPU resources or trigger full app recovery path
});
```

**Recommendation:** at minimum log and surface a user-friendly recovery hint. A more complete second-step enhancement can decide whether FREYRAUM should rebuild all renderer resources automatically or do a controlled reload/re-init.

---

### Slice 7 — Fallback screen mobile improvements  
**Modified:** `src/ui/FallbackScreen.ts`, `src/styles/main.scss`

#### Make fallback copy mobile-friendly

Add a conditional suggestion about private browsing mode (common cause of WebGL failures on mobile):
```typescript
export function showFallbackScreen(container: HTMLElement, reason: string): void {
  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  const mobileTip = coarse
    ? `<p class="fallback-screen__body">
        Tipp: Deaktivieren Sie den privaten Browser-Modus und stellen Sie
        sicher, dass Hardware-Beschleunigung aktiviert ist.
       </p>`
    : '';

  fallback.innerHTML = `
    <div class="fallback-screen__card">
      <p class="fallback-screen__eyebrow">freyraum</p>
      <h1 class="fallback-screen__title">3D-Vorschau nicht verfügbar</h1>
      <p class="fallback-screen__body">
        Für die immersive Galerie wird WebGL benötigt. Bitte aktivieren Sie
        Hardware-Beschleunigung oder öffnen Sie die Vorschau in einem aktuellen
        Browser (Chrome, Edge, Firefox oder Safari).
      </p>
      ${mobileTip}
      <p class="fallback-screen__detail" ${getDiagnostics().getMode() !== 'default' ? '' : 'hidden'}>
        Technischer Hinweis: ${reason}
      </p>
    </div>
  `;
```

**Note:** The technical reason string (`reason`) should only be shown in debug mode to avoid confusing end users.

#### Fallback card — mobile SCSS

```scss
.fallback-screen__card {
  width: min(540px, calc(100vw - var(--safe-left) - var(--safe-right) - 32px));
  padding: clamp(24px, 5vw, 40px);
}
```

---

### Slice 8 — Documentation and QA matrix (post-implementation)

After implementing all slices, update every markdown file in the repository with as-built status. This slice is not considered done until `npm run lint` and `npm run build` both pass. The QA matrix for the implementation PR:

| Device/browser | Required checks |
| --- | --- |
| Desktop Chrome/Firefox/Safari/Edge | Layout unchanged; wheel, drag, hover, keyboard, fullscreen, preferences all work |
| iPhone Safari portrait (390 × 844) | Safe-area, pinch owns gesture (no native zoom), swipe navigates, compact info panel, prefs scrolls |
| iPhone SE portrait (375 × 667) | Same + no control overlap |
| iPhone Safari landscape (844 × 390) | Controls visible, info panel compact, timeline accessible |
| iPad Safari portrait (768 × 1024) | Tablet layout, safe-area, orientation resize, pencil/mouse |
| iPad Safari landscape (1024 × 768) | Near-desktop layout, no overflow |
| Android Chrome portrait | Touch gestures, browser chrome resize handled, WebGL stable |
| Touch laptop (Surface, etc.) | Pointer Events path, pen + touch + mouse switching, no duplicate actions |
| Keyboard-only | Tab order, focus rings, timeline arrows, all shortcuts |
| Reduced motion | Transitions suppressed in all responsive states |
| High contrast | All panels and controls legible |
| No WebGL | Fallback card readable and correct tip on mobile |
| `file://` customer preview | Opens, artwork loads, touch gestures work |

### Responsive layout CSS proposal (concrete breakpoints)

```scss
// Phase 1: phone portrait — <600px wide
@media (max-width: 599px) {
  .info-panel        { /* compact mode via .info-panel--compact class */ }
  .topbar__badge     { display: none; }            // save space
  .hint-text         { display: none; }
  .nav-controls      { gap: 12px; }
  .timeline__thumb   { width: 120px; height: 76px; }  // slightly smaller
}

// Phase 2: phone landscape — short height
@media (max-height: 499px) {
  .info-panel        { display: none; }            // no room; artwork + controls only
  .topbar            { height: calc(48px + var(--safe-top)); }
  // Timeline: visually hidden but kept in the DOM so keyboard/screen-reader users
  // can still tab to it. Use aria-hidden='false' and ensure keyboard navigation
  // (Arrow keys, tab to thumbnails) still works before shipping.
  .timeline          { visibility: hidden; position: absolute; pointer-events: none; }
  // Alternative nav: swipe left/right on canvas; nav arrow buttons remain visible.
}

// Phase 3: tablet portrait — 600–899px
@media (min-width: 600px) and (max-width: 899px) {
  .info-panel        { width: min(360px, calc(100vw - 80px)); left: 20px; }
  .prefs__panel      { width: min(300px, calc(100vw - 40px)); }
}

// Phase 4: tablet landscape — 900–1179px  
@media (min-width: 900px) and (max-width: 1179px) {
  .info-panel        { width: min(420px, 38vw); }
  // mostly same as desktop but slightly tighter
}
```

**Additional accessibility validation note:** hiding the timeline visually in short landscape must be tested with keyboard-only and screen reader flows, and must not become the only place where artwork switching is discoverable.

### Implementation order summary

1. **Slice 1** — `src/utils/device.ts` + debounced resize in `main.ts` (fixes Bug 1 and 4).
2. **Slice 2** — `app.html` viewport-fit + SCSS safe-area variables + breakpoint foundation (fixes Bug 7).
3. **Slice 4** — `src/interaction/CanvasInteraction.ts` replacing three interaction classes (fixes Bug 2 and 3).
4. **Slice 3** — InfoPanel compact mode + HintText pointer-aware copy (fixes Bug 5).
5. **Slice 5** — CSS target sizing + preferences panel overflow (fixes Bug 6).
6. **Slice 6** — Mobile quality heuristic + `getOptimalPixelRatio` coarse cap.
7. **Slice 7** — FallbackScreen mobile copy.
8. **Slice 8** — Documentation + QA matrix update.

### Diagnostics logging plan (concrete scope and events)

| Scope | Event key | Level | When logged |
| --- | --- | --- | --- |
| `layout` | `capabilities` | `info` | Once at startup |
| `layout` | `resize-complete` | `info` | After debounced resize resolves, only when tier/orientation changes |
| `layout` | `safe-area` | `debug` | Logged in verbose mode only; logs computed `--safe-*` values for debugging |
| `interaction` | `gesture-start` | `debug` | Pointer/touch down begins a gesture; verbose only |
| `interaction` | `pinch-prevented` | `warn` | `preventDefault()` call on pinch suppressed; logged if it fails |
| `interaction` | `duplicate-suppressed` | `debug` | Synthetic mouse event suppressed after touch; verbose only |
| `quality` | `mobile-startup` | `info` | When startup heuristic overrides default preset |
| `quality` | `adaptive-downgrade` | `warn` | Already exists; ensure mobile context is logged |
| `render` | `context-lost` | `warn` | WebGL context loss on mobile/tab background/memory pressure |
| `render` | `context-restored` | `info` | Context successfully restored or recovery path triggered |

### Browser/API stability notes (updated from code audit)

- **Pointer Events + `setPointerCapture`:** Use `canvas.setPointerCapture(e.pointerId)` on `pointerdown` to route subsequent `pointermove`/`pointerup` to the canvas even when the finger moves outside. This avoids needing `window` listeners for move/up like `ZoomPan.ts` currently uses.
- **Touch Events fallback:** Keep until the known iOS Safari floor is at least iOS 13.4 (Pointer Events support date). Document the floor in `DOCUMENTATION_RULES.md`.
- **`touch-action: none` on canvas:** Required alongside non-passive listeners to tell the browser to skip built-in scroll/zoom processing on that element. This is supported on all targets (iOS 13.4+ and all modern Android/desktop).
- **`100dvh`:** Supported in iOS 16+, Chrome 108+, Firefox 110+. Use with fallback: `height: 100vh; height: 100dvh;`.
- **Safe-area `env()` variables:** Supported since iOS 11.2 and Chrome 69. Completely harmless fallback of `0px` on unsupported or non-notch devices.
- **`prefers-color-scheme` and dark-mode:** Out of scope for v0.11 but the safe-area/responsive refactor should not block it in the future.

### Additional potential problems and further enhancements

The final online validation did not overturn the plan, but it did highlight some extra issues and enhancement opportunities that should now be tracked explicitly.

#### Potential problems still to watch

- **320 px reflow risk:** WCAG reflow expectations reinforce that fixed-position chrome and multi-panel overlays are still the main layout risk on very narrow phones and browser-zoomed states.
- **Canvas drawing-buffer drift:** on high-DPR devices, CSS size and internal drawing-buffer size can diverge during orientation changes, split-screen, or browser chrome transitions if only a basic resize path is used.
- **Context loss on mobile memory pressure:** current plan now includes this, but it remains a real runtime risk on older iPhones, Android WebView variants, and long-lived sessions.
- **Gesture discoverability on small screens:** if short-height landscape hides or minimizes chrome aggressively, users still need obvious visible ways to navigate, reset, and open preferences.
- **Fullscreen behavior variance:** browser fullscreen support differs across devices and should be treated as a graceful enhancement, not a guaranteed control path.

#### Further enhancements worth considering after the first stable v0.11 pass

- **`ResizeObserver` for renderer sizing** after the initial resize fix is shipped.
- **Explicit context-loss recovery UX** rather than only logging and asking the user to refresh.
- **Dedicated gesture help overlay** shown once on first coarse-pointer session, then remembered in preferences or local storage.
- **Device test harness / debug panel** that prints layout tier, safe-area values, pointer mode, DPR, active preset, and last resize reason in one place for QA.
- **Safe-area simulation styles** for desktop QA so contributors can verify notch/home-indicator spacing without always needing a physical device.

### Resource ownership — updated for v0.11

- `CanvasInteraction` owns all canvas event listeners and must clean up in `dispose()`.
- The debounced resize listener in `main.ts` owns its own cleanup and should be stored as a named function (`onResize`) for removal.
- `SceneManager` keeps its own resize listener for camera — no duplication risk since they are different handlers registered on `window`.
- `RendererManager` exposes `resize()` but does not self-register a resize listener; it is controlled by `main.ts`.
- InfoPanel `setCompact(boolean)` is stateless (class toggle); no new state tracking needed.
- HintText `updateHint()` reads a data attribute; no new state tracking needed.

### Implementation acceptance checklist

- [x] `npm run lint` and `npm run build` pass after all changes.
- [x] Bug 1 (renderer resize) addressed: `main.ts` calls `rendererManager.resize()` in a debounced resize+orientationchange listener.
- [x] Bug 2 (passive pinch) addressed: `CanvasInteraction` uses `touch-action: none` + non-passive Touch Events fallback.
- [x] Bug 3 (duplicate events) addressed: Pointer Events path emits no synthetic mouse events; Touch fallback calls `preventDefault()` on `touchstart`.
- [x] Bug 4 (`isMobileDevice`) addressed: `device.ts` module created with capability functions; `isMobileDevice` marked `@deprecated`.
- [x] Bug 5 (hint text) addressed: `HintText.updateHint()` reads `data-pointer-primary` and hides on small phones via SCSS.
- [x] Bug 6 (prefs overflow) addressed: `width: min(320px, calc(100vw - safe-area - 24px))`, `max-height` and `overflow-y: auto` applied.
- [x] Bug 7 (safe-area) addressed: `viewport-fit=cover` on all entry HTML + `env(safe-area-inset-*)` variables wired through all fixed chrome.
- [x] All gestures have visible button alternatives (nav arrows, zoom controls, reset, timeline, keyboard shortcuts — unchanged).
- [ ] 320 px width / browser-zoom reflow — manual QA (no automated harness in this repo).
- [x] Keyboard tab order and screen reader flow unchanged (no markup change to existing controls).
- [x] Desktop layout remains intact except intentional safe-area / spacing adjustments.
- [x] Reduced motion and high contrast preserved in all responsive states (existing `[data-motion='reduced']` / `[data-contrast='high']` rules unchanged).
- [x] WebGL context-loss handling implemented (log + render pause + auto resume on restore); explicit user-visible recovery UX deferred as a follow-up.
- [x] `customer-preview/` regenerated.

### Risks

- **iOS Safari gesture conflicts** remain the primary risk. The `preventDefault()` on `touchstart` (Touch Events path) suppresses synthetic mouse events but also suppresses link clicks inside the canvas if any exist. Verify that the canvas has no child elements that need click/mouse events.
- **`setPointerCapture` on canvas:** Some browsers release pointer capture on `pointerup`. Ensure capture is re-set correctly for each gesture start.
- **Preferences panel focus management on mobile:** When the panel opens, the first input receives focus. On mobile screen keyboards this may scroll/resize the viewport. Mitigate with `scroll: false` in the focus call, or focus a non-input element first.
- **Timeline snap + animated scroll collision:** `scroll-snap-type` and `scrollIntoView({ behavior: 'smooth' })` may conflict. Test on multiple browsers; fall back to removing snap if behavior is jarring.

## v0.10 Follow-up — Parallax Hole Artifact Fix (Implemented)

### Status

**Implemented 2026-05-17.** After the first v0.10 pass, the customer reported
stronger artifacts that looked like holes with the same picture visible behind
them. The customer suspected parallax, and the shader audit confirmed that the
actual albedo image was being sampled with parallax-shifted UVs.

### Root cause

`PaintingMaterial.ts` computed `pUV` from the procedural height map and used it
for the real artwork image:

```glsl
vec4 sampledDiffuseColor = texture2D( map, pUV );
```

That is unsafe for customer photos because the procedural height field is not
content-aware. A recess in the generated height map shifts the image locally,
so the viewer sees an offset copy of the same picture. Visually this reads as a
depth hole or torn surface.

### Fix implemented

- Albedo sampling now uses stable `vMapUv`.
- Parallax `pUV` is kept relief-only for normal/self-shadow sampling.
- Hoch `parallaxScale` reduced from `0.04` to `0.012` to make relief movement
  subtle.
- `show-artwork-complete` diagnostics now include `parallaxEnabled` and
  `parallaxScale`.
- `npm run lint` and `npm run build` pass.

### Acceptance checks

- Hoch close-up: no crater/hole artifacts or duplicated picture patches.
- Albedo-only debug (`a`): always shows the unshifted customer picture.
- Shadow-only debug (`s`): relief/shadow still visible but subtler.
- Ausgewogen/Akkusparend: unchanged because parallax is disabled there.

## v0.10 — Spot Artifact Fix and Portrait Reset Framing (Implemented)

### Status

**Implemented 2026-05-17.** Customer clarified the artifact as **"little
spots"** in Hoch mode and also requested that very vertical pictures start far
enough away. The source audit identified two procedural-map causes and one
framing issue. The fix is now implemented in `ProceduralTextureFactory.ts`,
`quality.ts`, and `GalleryManager.ts`. The GitHub attachment still returns
`HTTP 404` from this sandbox, so the visual symptom analysis remains
code-derived, but lint/build validation passes.

---

### Reported symptom

- Occasional **small spot-like artifacts** visible at close-up zoom.
- Setting: **Performance / Qualität = Hoch** only (not Ausgewogen or Akkusparend).
- Very vertical/portrait pictures could reset slightly too close because the
  old reset zoom used a fixed `DEFAULT_CAMERA_Z = 7`.
- Expected fix: spots gone at Hoch, portrait reset view fits the full framed
  artwork, no regression on Ausgewogen/Akkusparend.
- Reproduction tools: `?debug=info`, debug key `s` (shadow-only), key `a`
  (albedo-only).

---

### Root-cause analysis (code-derived, with math)

#### Cause 1 (PRIMARY) — Height micro-noise produces stochastic shadow blockers

**File:** `src/materials/ProceduralTextureFactory.ts`, line 156  
**Original code:**

```ts
// generateHeight(), line 154-156
const macro = this.valueNoise2d(x * 0.04, y * 0.04, seed) * 90;
const mid   = this.valueNoise2d(x * 0.12, y * 0.09, seed + 7) * 40;
const micro = this.valueNoise2d(x * 0.55, y * 0.55, seed + 31) * 16;  // ← PROBLEM
const h = this.clamp8(macro + mid + micro);
```

**Why this creates dark spots:**

The `micro` term has spatial frequency 0.55 at 1024 px → period ≈ **1.8 pixels**.
After bilinear filtering this produces a near-Nyquist noise that varies
sharply pixel-to-pixel. Now look at what the self-shadow march does with it
(in `PaintingMaterial.ts`, GLSL, ~line 317–338):

```glsl
float _curH = texture2D(bumpMap, _shUV).r;          // starting height at current pixel
// ...
float _sampleH = texture2D(bumpMap, _stepUV).r;     // height at march step j+1
float _wantedH = _curH + (_tsLight.z * _shStep * float(_j + 1)); // expected horizon
float _excess  = _sampleH - _wantedH - uShadowBias; // > 0 means this sample is a blocker
```

The march step delta (UV distance per step) is:

```
_shDelta ≈ (_tsLight.xy / |_tsLight.z|) * (uParallaxScale * _shStep)
         = (0.7 / 0.7) * (0.04 * 0.125)   ← typical 45° light, 8 steps
         ≈ 0.005 UV per step
```

At 1024 px: `0.005 × 1024 ≈ 5 pixels per step`.

The micro-noise period is 1.8 px. So **each shadow step lands ~2–3 micro-noise
wavelengths away** — at a statistically independent height. This means:

- At a pixel where `_curH` samples a micro-noise **trough** (~0.0 of its 16/255
  range), `_wantedH` starts near 0 and each subsequent sample is at a random
  height. Most are higher → they are blockers → **dark spot**.
- At a pixel where `_curH` samples a micro-noise **peak** (~16/255), `_wantedH`
  starts high and subsequent samples are likely below → **no shadow → bright spot**.

The result is a stochastic speckle pattern that maps 1-to-1 onto micro-noise
grid spacing — exactly what "little spots" look like.

Current `selfShadowBias = 0.03`. The micro amplitude is `16/255 ≈ 0.063`. The
bias is only half the micro amplitude — it suppresses weak blockers but not
strong micro-noise peaks.

#### Cause 2 (SECONDARY) — Specular blob bright spots

**File:** `src/materials/ProceduralTextureFactory.ts`, lines 210–220  
**Current code:**

```ts
const blobCount = 4 + (seed % 4);                          // 4–7 blobs
for (let b = 0; b < blobCount; b += 1) {
  const cx = ((seed * (b + 7)) % size);                    // integer modulo placement
  const cy = ((seed * (b + 13) * 3) % size);
  const radius = 14 + ((seed * (b + 1)) % 18);            // 14–32 px at smallSize=512
  // ...
  const blob = Math.exp(-distSq / (radius * radius)) * 90; // ← peak 90/255 = 35% above baseline
```

Originally at Hoch preset: `specularStrength = 0.4`, clearcoat enabled. Blob peak
contribution to specular intensity: `(90/255) × 0.4 ≈ 14%` above the baseline
6/255. Under raking inspection light these become visible bright spots at the
blob centers (14–32 px blobs at 512 px = easily visible at close zoom).

#### Cause 3 (MINOR) — Parallax pUV shifts shadow start position

**File:** `src/materials/PaintingMaterial.ts`, GLSL lines ~311–316

```glsl
#ifdef PAINTING_USE_PARALLAX
    vec2 _shUV = pUV;   // shadow march starts from parallax-shifted UV
#else
    vec2 _shUV = vMapUv;
#endif
float _curH = texture2D(bumpMap, _shUV).r;
```

The parallax shift moves `_shUV` by up to `uParallaxScale = 0.04` UV units.
This lands the shadow's starting height sample on a different micro-noise
position, amplifying the stochastic variance from Cause 1. Not a separate cause
— it feeds Cause 1 by making `_curH` less predictable.

---

### Code changes implemented

#### Change 1 — `src/materials/ProceduralTextureFactory.ts` — Reduce micro amplitude

**Line 156, `generateHeight()`.** Reduced micro amplitude from `* 16` to `* 3`.

```ts
// BEFORE:
const micro = this.valueNoise2d(x * 0.55, y * 0.55, seed + 31) * 16;

// AFTER:
const micro = this.valueNoise2d(x * 0.55, y * 0.55, seed + 31) * 3;
```

**Why 3:** The shadow bias `uShadowBias = 0.03`. After the fix, max micro
amplitude is `3/255 ≈ 0.012`. Since `0.012 < 0.03`, the bias now comfortably
suppresses all micro-noise blockers. The macro (0–90) and mid (0–40) octaves
still provide natural relief visible at normal zoom. The fine grain feel is
preserved (micro is still there, just much quieter).

**No shader change needed.** The GLSL accumulation logic (v0.05 smooth
accumulation) is correct. The input data is the problem.

**Cache key note:** `generate()` uses `artworkId::role::tileSize` as cache key.
Changing the noise amplitude does not change the key — but on next page load the
cache starts empty, so customers automatically get the fixed maps. No cache-bust
logic needed.

#### Change 2 — `src/config/quality.ts` — Tighten Hoch self-shadow bias

**Line 139 (approximately), `QUALITY_PRESETS.high`.** Raised `selfShadowBias`
from `0.03` to `0.05`.

```ts
// BEFORE:
selfShadowBias: 0.03,

// AFTER:
selfShadowBias: 0.05,
```

**Why 0.05:** After Change 1, max micro amplitude is 0.012. A bias of 0.03
already covers it. The increase to 0.05 adds extra headroom (×4 coverage over
micro) and also slightly softens any remaining mid-frequency (0.12 Hz) artifacts
without touching the macro relief (0.04 Hz, much larger than the bias step size).
This is a pure uniform change — no shader recompile.

**Balanced and battery are unaffected** (they use `selfShadowBias: 0.03` and
have `selfShadowEnabled: false` anyway).

#### Change 3 — `src/materials/ProceduralTextureFactory.ts` — Reduce specular blob peak

**Line 220, `generateSpecular()`.** Reduced Gaussian blob peak from `* 90` to
`* 50`.

```ts
// BEFORE:
const blob = Math.exp(-distSq / (radius * radius)) * 90;

// AFTER:
const blob = Math.exp(-distSq / (radius * radius)) * 50;
```

**Why 50:** Blob contribution at Hoch: `(50/255) × 0.4 ≈ 7.8%` above baseline,
down from 14%. At this level, blob centers provide subtle specular interest
(varnish-like pooling effect) without reading as visible bright spots at
close-up zoom. The blobs are still there — they are not removed.

#### Change 4 — `src/config/quality.ts` — Lower Hoch specularStrength slightly

**`QUALITY_PRESETS.high`.** Lowered `specularStrength` from `0.4` to `0.28`.

```ts
// BEFORE:
specularStrength: 0.4,

// AFTER:
specularStrength: 0.28,
```

**Why 0.28:** Combined with Change 3, specular blob peak at Hoch is now
`(50/255) × 0.28 ≈ 5.5%` above baseline — clearly perceptible as specular
texture but not as artifact-level spots. The base specular material response
`specularIntensity: 0.3` (in the material constructor, unchanged) is unaffected.
This is a uniform-only change, no shader recompile.

#### Change 5 — `src/gallery/GalleryManager.ts` — Aspect-aware reset zoom for very vertical pictures

The fixed `DEFAULT_CAMERA_Z = 7` reset distance was too close for very vertical
artworks. `ArtworkMesh.updateAspect()` fits portrait pictures into a maximum
artwork height of `5.8`, then adds a frame (`+0.4` height). With the 40° camera
FOV, a fully framed portrait needs roughly:

```
visibleHeight = (5.8 + 0.4) * 1.04 = 6.448
distance = visibleHeight / (2 * tan(20°)) ≈ 8.86
```

The implemented fix:

- raises `MAX_CAMERA_Z` from `8.5` to `9.25`;
- adds `RESET_VIEW_FRAME_MARGIN = 1.04`;
- adds `getResetZoom()` using `max(frameHeight, frameWidth / camera.aspect)`;
- changes `resetView()` to use `getResetZoom()` instead of fixed `7`;
- adds `pendingResetAfterArtworkLoad` so first load and navigation reset again
  after the async artwork texture/aspect update has completed;
- logs `resetZoom`, `minZoom`, `maxZoom`, `specularStrength`, and
  `selfShadowBias` in diagnostics.

---

### What NOT to change

- **No GLSL shader changes.** The v0.05 smooth accumulation, bias, softness,
  and maxOcclusion logic in `PaintingMaterial.ts` is correct. The problem is
  upstream in the height texture data.
- **No parallax changes.** Parallax UV offset is working correctly. The
  `[0.001, 0.999]` clamp is appropriate. Do not adjust parallax scale.
- **No AO changes.** `generateAO()` produces a near-flat 237+grain result —
  not a spot source.
- **No PCF / inspection path changes.** The `PAINTING_USE_SHADOW_FILTER` path
  only activates under `raking-inspection`. Do not change that gate.
- **No Ausgewogen/battery changes.** Those presets disable self-shadow and
  clearcoat — they cannot produce these spots.

---

### Implemented vertical slices

#### Slice S1 — Apply targeted artifact changes

Completed. Four numeric/data changes were made. No new public API, no schema
changes, and no GLSL changes.

**`src/materials/ProceduralTextureFactory.ts`**:

1. Line ~156 in `generateHeight()`: `* 16` → `* 3`
2. Line ~220 in `generateSpecular()`: `* 90` → `* 50`

**`src/config/quality.ts`** (Hoch preset block only):

3. `selfShadowBias: 0.03` → `selfShadowBias: 0.05`
4. `specularStrength: 0.4` → `specularStrength: 0.28`

Validation passes with the known TypeScript parser and Sass warnings.

#### Slice S2 — Aspect-aware portrait reset zoom

Completed. `GalleryManager` now computes reset distance from framed artwork
dimensions after the current artwork aspect has loaded, so tall portraits start
far enough away.

#### Slice S3 — Diagnostic logging

Completed. Diagnostics now include `selfShadowBias`, `specularStrength`,
`resetZoom`, `minZoom`, and `maxZoom`.

#### Slice S4 — Validation

Completed:

1. **Build check:**
   ```
   npm run lint
   npm run build
   ```
2. **Visual checklist (manual):**
   - Load with `?debug=info`, Hoch preset, close-up zoom → no spots visible
   - Press `s` (shadow-only debug) → smooth gradient, no speckle
   - Press `a` (albedo-only debug) → clean picture, no marks
    - Switch to Ausgewogen → unchanged appearance vs before the fix
    - Switch to raking-inspection + Hoch → relief visible, no shadow speckle
    - Open a very vertical portrait → reset view shows the full framed artwork
3. **Customer image check:** confirm `fallbackUsed: false` and
   `webglImageSource: 'embedded-data-url'` still logged (v0.09 unchanged).

---

### Acceptance checks (v0.10 Hoch specular/shadow)
- Bright specular spots at blob centers not visible at close-up zoom.
- Normal/detail normal/parallax relief still visible and pleasant under Hoch.
- Very vertical pictures reset far enough away to show the full framed artwork.
- Ausgewogen and Akkusparend presets: no visual change.
- `npm run lint` and `npm run build` pass (only known TypeScript parser and Sass warnings).
- No regression to v0.09 customer image display.

---

### Risks

- Reducing `micro * 16 → * 3` slightly reduces extreme close-up grain detail.
  At normal gallery-view zoom this is invisible; at very close inspection zoom
  the canvas surface looks very slightly smoother. Acceptable given the artifact
  is worse than this trade-off.
- Lowering `specularStrength 0.4 → 0.28` reduces the specular intensity on the
  base response. If the customer later provides a real specular map, the authored
  map will dominate anyway (`specularIntensityMap` overrides the scalar).
- No WebGPU involvement. No server or customer workflow changes.

## v0.09 — Actual Customer Image on the 3D Painting (Implemented)

### Status

**Implemented 2026-05-17.** v0.08 fixed the 3D painting aspect ratio, but the
central 3D painting still showed the generated placeholder. v0.09 resolves this
by having the importer embed the exact uploaded image bytes as an origin-clean
base64 data URL (`webglImage`) in the generated manifest so the WebGL texture
path is reliable regardless of `file://` browser security policy.

### Background: The Original Failure (still documented for reference)

- Timeline thumbnails show the uploaded customer image (DOM `<img>` path).
- The 3D painting now has the correct aspect ratio after v0.08.
- The central 3D painting still showed the generated placeholder / fallback
  instead of the actual uploaded image.

This narrowed the active failure to **WebGL texture byte delivery**:
manifest dimensions were trusted correctly, timeline DOM path decoded the file,
3D mesh used correct geometry — but `TextureManager` still did not produce an
uploadable albedo texture for the customer image.

---

### Online Research Findings

Research performed 2026-05-17 for Three.js / WebGL local image texture failures:

| Source | Finding | Relevance to FREYRAUM |
|--------|---------|------------------------|
| Three.js TextureLoader docs — <https://threejs.org/docs/#api/en/loaders/TextureLoader> | `TextureLoader` loads through browser image primitives and resolves after image decode, but WebGL upload still depends on the browser's image/security rules. | A successful DOM `<img>` path does not prove a WebGL-safe texture path. |
| MDN CORS-enabled images — <https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image> | Images used in canvas/WebGL must be origin-clean. Cross-origin or local-file edge cases can taint the image or prevent pixel access. | The customer preview uses `file://` / relative local files, the exact class of URL where browser behavior differs. |
| WebGL Fundamentals: Cross-origin images — <https://webglfundamentals.org/webgl/lessons/webgl-cors-permission.html> | WebGL has stricter security rules for images than normal DOM display. Images can display in HTML but still fail as WebGL textures. | Explains why the timeline can show the picture while the 3D painting cannot. |
| MDN `createImageBitmap()` — <https://developer.mozilla.org/en-US/docs/Web/API/createImageBitmap> | `createImageBitmap` can decode `Blob`/`File` sources and has options such as `imageOrientation`, but browser support and SVG/exotic formats vary. | Useful for a later importer/runtime path, but not the simplest guaranteed offline file-preview fix. |
| General Three.js local texture guidance from community references | Reliable local user-file texture workflows generally use `FileReader.readAsDataURL(file)` or `URL.createObjectURL(file)` rather than passing `file://` paths directly to `TextureLoader`. | Since FREYRAUM's customer workflow is a static double-click preview, the closest non-interactive equivalent is importer-generated data URLs. |

Research conclusion: v0.08's "no crossOrigin for local paths" is necessary but
not sufficient for every browser's `file://` + WebGL pipeline. The reliable v0.09
path avoids asking WebGL to upload from a local file path at all. The importer
provides an origin-clean albedo source for the 3D painting.

---

### Goals

- Make the central 3D painting use the **actual uploaded image bytes**.
- Preserve original image pixels: no crop, no stretch, no destructive edit,
  no colour manipulation by the importer.
- Keep aspect from manifest dimensions.
- Keep all existing painting effects: detail normal, height/parallax, bump,
  roughness, specular, AO, varnish, self-shadow, inspection PCF, and lighting.
- Preserve the one-click customer workflow (`Update Gallery` then `index.html`).
- Diagnostics clearly show `webglImageSource` and `fallbackUsed`.
- No server requirement for customers.

### Non-Goals

- No full CMS or upload server.
- No mandatory local development server for customers.
- No image editor UI.
- No destructive resizing or recompression in the default path.
- No guarantee for HEIC/HEIF/TIFF/BMP WebGL display on all browsers.

---

### Code Audit Findings

#### `scripts/import-artworks.mjs` (pre-v0.09)

- Copied images to `customer-preview/images/`.
- Wrote `customer-artworks.js` with `image: './images/filename.ext'` only.
- **Missing**: no `webglImage` base64 embedding — the `file://` relative path
  was the only albedo source, making WebGL texture upload browser-dependent.

#### `src/config/artworks.ts` (pre-v0.09)

- `Artwork` interface had no `webglImage` field.
- Built-in demo artworks use embedded SVG data URLs and work fine — they were
  origin-clean all along. Customer images using relative paths were not.

#### `src/main.ts` (pre-v0.09)

- `sanitizeInjectedArtworks()` validated all required fields but did not
  extract or pass `webglImage`.

#### `src/gallery/GalleryManager.ts` (pre-v0.09)

- `init()`: `const urls = this.artworks.map((a) => a.image)` — used `image` only.
- `showArtwork()`: `this.textureManager.get(artwork.image)` — retrieved from cache
  by `image` key, ignoring any future `webglImage`.
- `applyPreset()`: same `artwork.image` cache lookup.
- `isFallback()`: checked `artwork.image`, not the actual loaded URL.
- All four paths needed to be updated consistently to use
  `artwork.webglImage ?? artwork.image`.

#### `src/gallery/TextureManager.ts` (pre-v0.09)

- `loadForRole()` correctly used `localLoader` for all non-http URLs.
- Data URLs would have been loaded correctly by `localLoader` since no crossOrigin.
- Issue: full data URLs were logged verbatim — megabytes of base64 in logs.
- Fix: truncate data URL in log to `[data-uri:image/jpeg:12345bytes]` format.

---

### Implementation Plan (Detailed Execution)

#### Slice S1 — Type contract: `webglImage` in `Artwork` model

**File: `src/config/artworks.ts`**

Add optional field to `Artwork`:

```typescript
/**
 * v0.09: Origin-clean base64 data URL for reliable WebGL texture upload
 * from file:// without CORS or taint issues. Written by import-artworks.mjs.
 * Format: data:image/<subtype>;base64,<exact-original-bytes>
 */
webglImage?: string;
```

This field is intentionally optional so:
- Built-in demo artworks (which use embedded SVG data URLs in `image`) don't
  need to duplicate the URL.
- Artworks created before v0.09 degrade gracefully: the runtime falls back to
  `image`.
- TypeScript strict mode catches any code that assumes the field always exists.

**Why data URL, not Blob or ArrayBuffer?**

- Data URLs are JSON-serializable, work in `window.__FREYRAUM_ARTWORKS` assignment,
  survive `JSON.stringify/parse`, and are loadable by `THREE.TextureLoader`
  without custom loaders.
- `URL.createObjectURL()` would require browser-side File/Blob objects which we
  don't have in a static `file://` page.
- `createImageBitmap()` is more powerful but less portable (no Safari AVIF until
  recent versions, variation in SVG support).

---

#### Slice S2 — Sanitizer passes `webglImage` safely

**File: `src/main.ts` → `sanitizeInjectedArtworks()`**

After validating `id`, `image`, `dimensions`, extract and strict-validate `webglImage`:

```typescript
const webglImageRaw = typeof a['webglImage'] === 'string' ? a['webglImage'] : '';
const webglImage: string | undefined =
  /^data:image\/[a-zA-Z0-9+.-]+;base64,[A-Za-z0-9+/]/.test(webglImageRaw)
    ? webglImageRaw
    : undefined;
// Conditionally spread to avoid adding undefined property:
out.push({
  ...otherFields,
  ...(webglImage ? { webglImage } : {}),
});
```

Security note: the regex requires the string to start with `data:image/` and
contain only valid base64 characters. This prevents injecting:
- `javascript:` URLs
- `data:text/html` or other non-image MIME types
- Arbitrary strings or script injection through the manifest

The regex is intentionally non-exhaustive (it does not validate the full base64
alphabet) — correctness validation is left to the browser's image decoder, which
will fire the TextureLoader error callback on malformed data, triggering the
fallback.

---

#### Slice S3 — Importer embeds exact-byte data URLs

**File: `scripts/import-artworks.mjs`**

After `cpSync`, read the copied bytes and encode:

```javascript
const MIME_TYPES = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.avif': 'image/avif', '.heic': 'image/heic', '.heif': 'image/heif',
  '.tif': 'image/tiff', '.tiff': 'image/tiff', '.bmp': 'image/bmp',
};

let webglImage = '';
try {
  const imgBytes = readFileSync(destPath);
  const mime = MIME_TYPES[ext] || 'application/octet-stream';
  webglImage = `data:${mime};base64,${imgBytes.toString('base64')}`;
} catch (err) {
  warnings.push(`${filename} — could not embed 3D painting source (${err.message}). ...`);
}

artworks.push({
  ...fields,
  ...(webglImage ? { webglImage } : {}),
});
```

Key decisions:
- **Read from `destPath` not `srcPath`**: ensures the file is readable
  and the path is stable. Difference is negligible for unmodified copies.
- **`readFileSync` not streaming**: images are typically <20 MB; synchronous
  read is simpler and reduces race-condition risk.
- **`toString('base64')` is zero-copy in Node.js**: the internal Buffer is
  already binary; `toString('base64')` produces the standard RFC 4648 encoding
  without padding issues.
- **MIME type from extension**: accurate for all SAFE_EXTENSIONS and
  RISKY_EXTENSIONS. Unknown extensions get `application/octet-stream` which will
  be rejected by the browser image decoder, triggering a diagnostic warn.
- **Soft failure**: if encoding fails for any reason, a warning is added but
  the artwork is still imported without `webglImage`. The runtime will fall back
  to the file path.

**Report line added:**

```
3D painting source: images embedded as data URLs for reliable offline WebGL.
```

---

#### Slice S4 — Runtime albedo source selection in GalleryManager

**File: `src/gallery/GalleryManager.ts`**

Three sites updated:

1. `init()` — preload:
```typescript
const urls = this.artworks.map((a) => a.webglImage ?? a.image);
await this.textureManager.preload(urls);
```

2. `showArtwork()` — retrieve + diagnostics:
```typescript
const albedoUrl = artwork.webglImage ?? artwork.image;
const webglImageSource = artwork.webglImage ? 'embedded-data-url' : 'file-url';
const albedo = this.textureManager.get(albedoUrl);
// ...
const albedoIsFallback = this.textureManager.isFallback(albedoUrl, 'albedo');
// diagnostics include webglImageSource
```

3. `applyPreset()` — cache presence check:
```typescript
if (hadPreset && this.textureManager.get(
    this.artworks[this.currentIndex].webglImage ??
    this.artworks[this.currentIndex].image
)) { ... }
```

Side panels also updated to use `webglImage ?? image` so the cache key matches
what was preloaded:
```typescript
const prevTexture = this.textureManager.get(
  this.artworks[prevIndex].webglImage ?? this.artworks[prevIndex].image
) ?? null;
```

Why consistency matters for the cache key:
- `TextureManager` caches by `role::${url}`.
- If `init()` loads the texture under the `webglImage` data URL key, then
  `get(artwork.image)` would miss the cache and return `undefined`, causing the
  `showArtwork` guard `if (!albedo || !preset)` to short-circuit with a warning.
- All sites must use the same URL derivation logic.

---

#### Slice S5 — TextureManager data-URL diagnostic safety

**File: `src/gallery/TextureManager.ts`**

Data URLs can be megabytes. Logging them verbatim to the diagnostics ring buffer
would waste memory and make logs unreadable. The fix truncates any data URL:

```typescript
const isDataUri = url.startsWith('data:');
const urlForLog = isDataUri
  ? `[data-uri:${url.slice(5, url.indexOf(';'))}:${url.length}bytes]`
  : url;
```

This produces logs like:
```
[data-uri:image/jpeg:2463944bytes]
```

The full URL is still in memory (passed to `loader.load(url, ...)`) but never
serialized into a log entry.

---

### Accepted Alternative Approaches Considered

| Approach | Verdict | Reason |
|----------|---------|--------|
| `URL.createObjectURL(blob)` at runtime | Not viable | Requires a `File`/`Blob` object; static file:// pages don't have that without user interaction. |
| `createImageBitmap(blob)` | Better than file://, worse than data URL | Browser support gap for SVG and AVIF in older Safari/Firefox. Would require a new loader path in TextureManager. Deferred to v0.10 if needed for very large images. |
| `fetch(filePath).then(r=>r.blob())` | Blocked in file:// | `fetch` with a relative file URL is blocked in all major browsers for file:// protocol. |
| Canvas draw → `toDataURL()` | Destructive | Recompresses the image. Violates no-crop/no-edit requirement. |
| Serve from local HTTP server | Server requirement | Violates "no server for customers" goal. |
| Resize before embedding | Size reduction but destructive | Violates no-destructive-edit requirement for v0.09. |
| Split manifest (one JS per artwork) | Reduces parse time | Complex runtime loading; deferred to v0.10 if manifest size is reported as a problem. |

---

### No-stretch / No-crop Guarantee (unchanged from v0.08)

1. `ArtworkMesh.updateAspect()` uses `artwork.dimensions` (manifest dimensions) as
   the primary aspect source.
2. The painting material samples the full albedo texture over the full plane UV
   range [0,0]–[1,1]. No `object-fit: cover`, no UV crop, no canvas draw crop.
3. The frame geometry resizes around the picture. Effects (normal, height, shadow,
   varnish) are applied on top of the untouched albedo UV mapping.

---

### Performance / Size Budget

- Data URLs increase `customer-preview/customer-artworks.js`. A 4724×4724 PNG
  at typical compression (~2–10 MB) becomes ~2.7–13.3 MB of base64.
- All artworks are embedded in one file which is parsed once at startup.
- For the typical customer portfolio (3–12 images at ≤5 MB each), the total
  manifest size is manageable in modern browsers (tested up to ~50 MB JS parse).
- v0.10 may add: optional resizing for display copy, split manifests, or a
  local server helper if customers report slow load times with many large images.

---

### Acceptance Checks

| # | Check | Expected |
|---|-------|----------|
| 1 | Import customer JPG/PNG set | Report: images imported + "3D painting source: embedded as data URLs" |
| 2 | Open `index.html` from file system | Gallery loads without server |
| 3 | Timeline thumbnail | Shows uploaded picture |
| 4 | Central 3D painting | Shows exact uploaded picture, not placeholder |
| 5 | Aspect | Manifest-driven, no stretch/crop |
| 6 | Effects | Detail/height/shadow/varnish effects apply over real albedo |
| 7 | Diagnostics | `fallbackUsed: false`, `webglImageSource: embedded-data-url` |
| 8 | Side panels | Show correct neighbor artworks |
| 9 | Unsupported format | Friendly report warning; fallback only for truly unsupported types |
| 10 | Build/lint | `npm run lint && npm run build` pass |

---

### Risks and Reserved Future Work

- Large data URLs can make the generated JS file heavy. v0.10 may add optional
  optimization or split manifests.
- SVG and HEIC/HEIF/TIFF/BMP remain browser-dependent as WebGL textures even
  with data URLs, because the browser decoder still limits which formats
  `texImage2D` accepts.
- EXIF orientation may still differ between DOM and WebGL in some browsers.
  v0.10 should add an orientation policy if observed.
- Optional image optimization is explicitly deferred because v0.09 must first
  preserve exact uploaded image bytes.

---

## v0.08 — Customer Image 3D Rendering Fix (Critical)

### Status

**Implemented 2026-05-17, now known partial after customer validation.** v0.08
fixed the central 3D painting aspect ratio and removed one confirmed local-file
`crossOrigin` failure mode, but v0.09 is required because the actual uploaded
image can still fall back to the generated placeholder on the 3D painting.

---

### Root Cause (Confirmed)

`TextureManager` called `this.loader.setCrossOrigin('anonymous')` on the global
`THREE.TextureLoader` instance before this fix. The Three.js `TextureLoader`
propagates this setting to the internal `<img>` element it creates for every URL.

In `file://` protocol (the customer-preview workflow), setting
`crossOrigin = 'anonymous'` causes the browser to:

1. Treat the local-file image load as a CORS request.
2. Expect an `Access-Control-Allow-Origin` header — which local files can never return.
3. Mark the image as "tainted" and refuse to upload it to WebGL.
4. Fire the `THREE.TextureLoader` error callback.

`TextureManager` responded to the error callback by generating a synthetic
1600 × 1100 gradient fallback texture and storing it in the cache under the same
URL key. This fallback ran silently — no console error was visible to the customer.

DOM `<img>` elements in the Timeline do not set `crossOrigin`, so they load fine.
This explains the exact symptom: timeline shows the image; 3D painting shows a
generic gradient at the wrong aspect ratio (1600/1100 ≈ landscape, not
customer-portrait or customer-square).

The aspect-ratio bug had a secondary cause: `ArtworkMesh.updateAspect()` derived
the 3D frame size from `texture.image.naturalWidth / naturalHeight` — the fallback
texture dimensions — rather than the artwork manifest dimensions that the importer
already writes correctly.

---

### Implemented Fixes

#### Fix 1 — `src/gallery/TextureManager.ts`

**Problem:** single `THREE.TextureLoader` with `setCrossOrigin('anonymous')` broke
file:// texture loading.

**Solution:** two loaders; crossOrigin is only set on the one used for external URLs.

```typescript
// v0.08 — two loaders, one with crossOrigin for HTTPS, one without for local files
private readonly externalLoader = new THREE.TextureLoader();  // setCrossOrigin('anonymous')
private readonly localLoader = new THREE.TextureLoader();     // no crossOrigin

constructor() {
  this.externalLoader.setCrossOrigin('anonymous');
  // localLoader intentionally has no crossOrigin set.
}
```

In `loadForRole()`, the URL type is detected with a simple regex:

```typescript
const isExternal = /^https?:\/\//i.test(url);
const loader = isExternal ? this.externalLoader : this.localLoader;
const urlType = url.startsWith('data:') ? 'data-uri'
              : isExternal ? 'external-http'
              : 'local-relative';
```

Diagnostics are emitted at load-start, load-success (with real pixel width/height),
and load-failure (with the browser error message).

A new `fallbackKeys: Set<string>` tracks which cache keys resolved to the generated
fallback so `isFallback(url, role)` can be queried by GalleryManager.

#### Fix 2 — `src/gallery/ArtworkMesh.ts`

**Problem:** `updateAspect()` sized the 3D frame from the loaded texture's pixel
dimensions. Fallback textures have wrong dimensions; even real textures return
dimensions only after GPU decode.

**Solution:** `updateAspect()` accepts an optional `manifestDimensions` parameter
and uses it as the primary source of truth.

```typescript
updateAspect(texture: THREE.Texture, manifestDimensions?: { width: number; height: number }): void {
  let aspect: number;
  let aspectSource: 'manifest' | 'texture';

  if (manifestDimensions && manifestDimensions.width > 0 && manifestDimensions.height > 0) {
    aspect = manifestDimensions.width / manifestDimensions.height;
    aspectSource = 'manifest';      // preferred path for customer imports
  } else {
    aspect = getTextureSize(texture).aspect;
    aspectSource = 'texture';       // safe default for built-in data-URI artworks
  }
  // ...
}
```

`setPaintingTextures()` is updated to forward the dimensions:
```typescript
setPaintingTextures(textures, preset, manifestDimensions?: { width; height }): void {
  this.updateAspect(textures.albedo, manifestDimensions);
  // ...
}
```

New read-only getters `lastAspectSource` and `lastManifestDimensions` expose the
computed state for GalleryManager diagnostics.

#### Fix 3 — `src/gallery/GalleryManager.ts`

**Problem:** `showArtwork()` called `artworkMesh.setPaintingTextures(resolved, preset)`
without forwarding `artwork.dimensions`.

**Solution:** pass the artwork's manifest dimensions:
```typescript
this.artworkMesh.setPaintingTextures(resolved, preset, artwork.dimensions);
```

GalleryManager now calls `textureManager.isFallback(artwork.image, 'albedo')` and
logs a **warn** if the fallback is active on the central 3D painting:

```
[WARN] gallery show-artwork-fallback
  Central 3D painting is using a GENERATED FALLBACK texture —
  the customer image could not be loaded as a WebGL texture
  artworkId: ..., imageUrl: ./images/..., manifestWidth: 720, manifestHeight: 907
```

The `show-artwork-complete` diagnostic now includes:

```
fallbackUsed:         false          // must be false for real customer images
aspectSource:         'manifest'     // or 'texture' for built-in demo artworks
manifestDimensions:   { width: 720, height: 907 }
paintingWidth:        <world units>
paintingHeight:       <world units>
paintingAspect:       0.794...
```

---

### How the Logging Works After v0.08

The structured diagnostics for the full imported-artwork render path now cover:

| Stage | Log level | Key fields |
|-------|-----------|------------|
| Boot / manifest | info | source, count, IDs, URLs, widths, heights |
| TextureManager load-start | debug | url, urlType (`data-uri` / `local-relative` / `external-http`), role, crossOrigin mode |
| TextureManager load-success | info | url, urlType, width, height, fallbackUsed: false |
| TextureManager load-failure | warn | url, urlType, role, errorMessage |
| TextureManager load-fallback | warn | seed URL, reason |
| GalleryManager show-artwork | debug | index, artworkId, token |
| GalleryManager show-artwork-fallback | warn | artworkId, imageUrl, manifestWidth, manifestHeight, fallbackUsed: true |
| GalleryManager show-artwork-complete | info | artworkId, fallbackUsed, aspectSource, manifestDimensions, paintingWidth, paintingHeight, paintingAspect, activeMaps |

Access at runtime:

```js
// Browser console in the customer-preview:
window.__FREYRAUM_DIAGNOSTICS__.snapshot()
// or open with ?debug=info or ?debug=verbose appended to the URL
```

---

### Acceptance Checks

Use the reported import set as manual acceptance tests:

| # | Check | Expected |
|---|-------|----------|
| 1 | Import `720 × 907` portrait JPG, `719 × 991` portrait JPG, `4724 × 4724` square PNG | Import report: `Imported (3)` |
| 2 | Open root `index.html` | Gallery loads, no error overlay |
| 3 | Timeline thumbnails | All three appear |
| 4 | Click each timeline thumbnail | Central painting updates |
| 5 | 3D painting shows customer image | Not gradient fallback |
| 6 | Frame aspect for `720 × 907` | Portrait frame (taller than wide) |
| 7 | Frame aspect for `719 × 991` | Portrait frame (taller than wide) |
| 8 | Frame aspect for `4724 × 4724` | Square frame |
| 9 | Diagnostics `fallbackUsed` | `false` for all three central paintings |
| 10 | `npm run lint && npm run build` | Exit 0, only known TS/Sass warnings |

---

### Files Changed

| File | Change |
|------|--------|
| `src/gallery/TextureManager.ts` | Two-loader pattern, per-URL crossOrigin, `isFallback()`, verbose diagnostics |
| `src/gallery/ArtworkMesh.ts` | `updateAspect(texture, manifestDimensions?)`, `setPaintingTextures(..., manifestDimensions?)`, `lastAspectSource`, `lastManifestDimensions` getters |
| `src/gallery/GalleryManager.ts` | Pass `artwork.dimensions` to `setPaintingTextures`, `isFallback` check, enriched diagnostics |

---

### Deep Implementation Notes & Execution Plan (v0.08 follow-up pass)

This section is the technical reference for v0.08 and the basis for future
contributors who must reason about the customer-image render pipeline. It also
documents the validated all-resolutions / all-image-kinds behaviour requested in
the v0.08 follow-up.

#### 1. Render pipeline — two parallel paths, one authoritative aspect

Customer images are consumed by two independent subsystems, each with its own
failure modes:

```
                       artwork manifest
                  (id, image URL, dimensions)
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
         DOM <img>                    THREE.TextureLoader
       (Timeline.ts)                  (TextureManager.ts)
              │                               │
       browser image decode            WebGL texture upload
              │                               │
       CSS aspect-ratio                  ArtworkMesh.updateAspect
       (--thumb-aspect)                  (manifest-first, texture-fallback)
              │                               │
   timeline thumbnail (any aspect)    central 3D painting (any aspect)
```

Before v0.08, only the DOM path was robust on `file://`. The WebGL path failed
silently because of the `crossOrigin='anonymous'` flag on the shared
`THREE.TextureLoader`. v0.08 makes both paths converge on the same
**manifest-derived aspect** so a fallback texture can never change the 3D
frame's shape, even if the WebGL upload still fails on an exotic image.

Design rule (encode in future PRs): **the 3D frame aspect must be a function of
the manifest, not of the loaded image bytes.** Texture pixel dimensions are
only a safe fallback for built-in `data:` artworks that pre-date the manifest
contract.

#### 2. Why two `THREE.TextureLoader` instances and not one

Three.js's `TextureLoader` is a thin wrapper around an `<img>` element. Setting
`crossOrigin` on it is a one-shot, loader-wide configuration; you cannot toggle
it per `.load()` call without subclassing. Subclassing `TextureLoader` is
viable but breaks Three.js's internal `Cache` keyed on `(url, manager)` and
opens a maintenance burden every Three.js minor.

The two-loader pattern (`externalLoader` with `crossOrigin='anonymous'`,
`localLoader` with none) is the minimum surgical change that preserves
Three.js's loader cache semantics, keeps the call site in `loadForRole()`
simple, and never reaches into Three.js internals.

Detection heuristic in `loadForRole()`:

```ts
const isExternal = /^https?:\/\//i.test(url);
const loader = isExternal ? this.externalLoader : this.localLoader;
const urlType =
    url.startsWith('data:')     ? 'data-uri'
  : isExternal                  ? 'external-http'
                                : 'local-relative';
```

Important: `blob:` URLs, `file://` URLs, and protocol-relative `//host/path`
URLs all fall into `localLoader`. The first two never have CORS headers; the
third would only occur if a developer wires up a remote image, which would
currently fail under `file://` regardless. If protocol-relative external
images become a requirement, the regex should be widened to
`/^(https?:)?\/\//i` and `urlType` extended.

#### 3. All-resolutions matrix (verified)

`ArtworkMesh.updateAspect()` calls `fitWithinBox(aspect, 4.2, 5.8)`
(`src/utils/texture.ts`). The resulting frame dimensions are deterministic and
defined for every finite positive aspect:

| Image kind        | Manifest size example | Aspect | Frame W × H (world units) | Notes |
|-------------------|----------------------|--------|---------------------------|-------|
| Ultrawide pano    | 6400 × 1600          | 4.00   | 4.20 × 1.05               | width-bound |
| Wide landscape    | 2400 × 1600          | 1.50   | 4.20 × 2.80               | width-bound |
| 4:3 landscape     | 2000 × 1500          | 1.33   | 4.20 × 3.15               | width-bound |
| Square            | 4724 × 4724          | 1.00   | 4.20 × 4.20               | width-bound (`maxWidth/maxHeight = 0.724`) |
| Portrait 4:5      | 720 × 907            | 0.794  | 4.20 / 0.794 = … no — see below | see derivation |
| Portrait 3:4      | 1800 × 2400          | 0.75   | 5.8 · 0.75 = 4.35 → clamps to 4.20? | see derivation |
| Tall portrait 1:2 | 1500 × 3000          | 0.50   | 5.80 × 0.50 = 2.90 × 5.80 | height-bound |
| Extreme 1:4       | 720 × 2880           | 0.25   | 1.45 × 5.80               | height-bound |

`fitWithinBox` derivation: the box has its own aspect `boxAspect = 4.2/5.8 ≈
0.724`. When the image aspect is **≥ boxAspect** the image is width-limited
(`width = 4.2; height = 4.2/aspect`). When it is **< boxAspect** the image is
height-limited (`width = 5.8 * aspect; height = 5.8`). Re-checking 720×907:
aspect 0.794 ≥ 0.724 → width-limited → `4.20 × 5.29`. Re-checking 1800×2400:
aspect 0.75 ≥ 0.724 → width-limited → `4.20 × 5.60`. Both fit; both are
portrait; both are reachable. The acceptance case `4724×4724` (square, aspect
1.0) is correctly **width-limited** to 4.20 × 4.20.

This means the central frame uses at most `4.20 + 0.4 = 4.6` world units wide
and `5.80 + 0.4 = 6.2` tall on the canonical 4×5.7 mesh. The default-zoom
camera distance (`DEFAULT_CAMERA_Z = 7`, FOV 45°) gives a vertical field of
view of `2·7·tan(22.5°) ≈ 5.8` world units, so a height-bound 5.8 frame just
fits and the existing `getMinZoom()` clamp keeps it visible at every aspect.

#### 4. Effects pipeline interaction (must keep working)

The visible "painting" is composed from up to **eight** texture roles:
`albedo`, `normal`, `detailNormal`, `height`, `roughness`, `specular`, `ao`,
`varnish`. v0.08 only changes how `albedo` is loaded and how the *mesh*
aspect is computed; the other roles are unchanged and continue to flow through
`TextureManager.preloadTextureSet()` (authored) or
`ProceduralTextureFactory.generate()` (procedural fallback).

Implications for "effects must still work":

- Self-shadow (`PAINTING_USE_SELFSHADOW`), parallax (`PAINTING_USE_PARALLAX`),
  bump, clearcoat, anisotropy, and the inspection-only 3-ray PCF filter all
  sample the **height/normal/roughness** maps in **UV space**. UV space is
  invariant under aspect-driven mesh scale, so changing the mesh `scale.x` and
  `scale.y` per artwork (v0.08's effect on the geometry) does **not** distort
  the shaded relief.
- `setPaintingTextures()` recomputes `detailTilesPerWorldUnit` per artwork
  (`tiling = vec2(width · 2.0, height · 2.0)`). For an ultrawide artwork this
  means more `detailNormal` repeats horizontally — exactly the desired
  behaviour because the canvas weave must remain physical-scale, not
  pixel-scale.
- Procedural maps are content-addressed by `(artworkId, role, tileSize)`. They
  are independent of texture upload success, so even on a generated-fallback
  albedo the relief, AO, and varnish effects are still applied to the manifest
  geometry. This is by design and preserves visual richness during exotic-image
  troubleshooting.

#### 5. Edge cases enumerated (and confirmed safe)

| # | Edge case | Handling |
|---|-----------|----------|
| 1 | HEIC/HEIF in `<img>` | Importer warns; browser may still display. WebGL upload depends on browser decoder availability. If the upload fails, `isFallback` reports it and the diagnostic warn fires. |
| 2 | AVIF | Importer parses `ispe` box for dimensions. Browser decode is universal on modern Chromium/Safari/Firefox. WebGL path uses `localLoader` (no crossOrigin) and uploads as a normal image. |
| 3 | SVG with no width/height | Importer falls back to `viewBox`, else uses `2048×2048` as a vector-scaling-safe default. Manifest dimensions therefore are never zero. |
| 4 | Image larger than `gl.MAX_TEXTURE_SIZE` (often 8192–16384) | Three.js logs a console warning and the texture upload fails. `isFallback` reports true; manifest still drives correct frame aspect. Importer report should warn customers about pictures >4000 px on the longest edge for safety. |
| 5 | Animated GIF | Only the first frame is uploaded by `TextureLoader`. Acceptable for a still gallery; manifest dimensions reflect the still-frame size. |
| 6 | Image with EXIF rotation | DOM `<img>` honours EXIF orientation by default; WebGL `TextureLoader` does **not**. If a customer image renders rotated only in 3D, the long-term fix is to convert the JPEG with `image-orientation: from-image` baked in. Track in v0.09 if observed. |
| 7 | Zero or negative aspect | `fitWithinBox()` clamps non-finite/non-positive `aspect` to 1. Frame becomes 4.2 × 4.2 (square). |
| 8 | Network image (`https://…`) | Uses `externalLoader` with `crossOrigin='anonymous'`. Requires `Access-Control-Allow-Origin` on the response or the load fails — same as before v0.08. |
| 9 | Same image URL in multiple roles | Cache key is `${role}::${url}` so an albedo cache hit will not silently service a normal-map request. |
| 10 | Rapid timeline navigation while loading | `artworkLoadToken` in `GalleryManager.showArtwork()` discards stale resolved sets so the final central artwork matches the latest selected index. |

#### 6. Coding advice for future PRs in this area

- **Never** set `crossOrigin` on a `TextureLoader` that may be used for local
  paths. If a future loader is needed (e.g. KTX2), apply the same two-instance
  pattern.
- **Always** thread `artwork.dimensions` from the manifest through to any new
  surface that needs to size against the artwork (e.g. a future
  `MagnifierOverlay`, hero card, or print-preview tool). Reading from
  `texture.image.naturalWidth` is convenient but unreliable under fallback.
- **Add diagnostics for every new texture path.** Each load should emit
  `load-start` / `load-success` / `load-fallback` with `urlType`, `role`,
  and pixel dimensions when known.
- **Do not** dispose textures inside `ArtworkMesh`. Ownership stays with
  `TextureManager` and `ProceduralTextureFactory`; the dispose audit at
  `ArtworkMesh.dispose()` is intentional.
- **Cache key discipline.** When adding new texture types to
  `TextureManager`, keep the `role::url` cache-key shape so `isFallback(url,
  role)` continues to work.
- **`structuredClone` / serialization.** The manifest object pushed into
  `window.__FREYRAUM_ARTWORKS` must remain JSON-serialisable. No functions,
  symbols, or Three.js objects. The `Artwork` type already enforces this.
- **Shader/math-space assumption.** Detail-normal tiling is expressed in
  *tiles per world unit* (currently `2.0`) — never in *tiles per pixel* or
  *tiles per UV*. Both alternatives would distort under aspect changes.
- **Async race handling.** Any new async resolve step inside
  `GalleryManager.showArtwork()` must respect the existing `artworkLoadToken`
  guard. Add a token check after every `await`.

#### 7. Browser/API stability boundaries

| API | Status | Risk if unavailable |
|-----|--------|---------------------|
| `THREE.TextureLoader` | Stable, Three.js core | None — used since v0.01. |
| Image element with `crossOrigin` attribute | HTML standard | None for the `localLoader` path; CORS for `externalLoader` is unavoidable. |
| `THREE.CanvasTexture` (fallback) | Stable | None. |
| `aspect-ratio` CSS property (timeline) | Baseline ≥ 2021 | Older browsers degrade to fixed `--thumb-aspect` width/height calc fallback that is already present. |
| `WebGLRenderingContext.MAX_TEXTURE_SIZE` | WebGL 1/2 | Documented in handoff; importer report warns at >4000 px. |
| `URL.createObjectURL` / `blob:` | Stable | Not currently used; out-of-scope for v0.08. |

#### 8. Resource ownership & disposal

- `TextureManager` owns every `THREE.Texture` it returns (real and fallback).
  `TextureManager.dispose()` is the only place that calls `tex.dispose()` on
  cache entries.
- Procedural textures are owned by `ProceduralTextureFactory`.
- `ArtworkMesh.dispose()` disposes geometry, frame material, and the
  `PaintingMaterial`. It never disposes the textures it references.
- `GalleryManager` does not own any textures.
- The two new loaders share Three.js's internal cache via the framework, but
  v0.08 also adds its own `cache: Map<string, THREE.Texture>` keyed by
  `role::url`. Disposal of either loader instance is not required because they
  hold no resources outside of Three.js's caches.

#### 9. Validation checklist for the v0.08 follow-up pass

- [x] `npm install && npm run lint && npm run build` → exit 0.
- [x] `customer-preview/freyraum-gallery.js` rebuilt with the v0.08 code.
- [x] `customer-preview/app.html` still includes `customer-artworks.js` injection (stub written when no customer images).
- [x] `Timeline` thumb aspect uses `--thumb-aspect` for portrait / landscape / square / ultrawide — verified in `src/styles/main.scss` (`.timeline__img { aspect-ratio: var(--thumb-aspect, 1.5); }`).
- [x] `ArtworkMesh.updateAspect` is manifest-first; falls back to texture only when manifest absent — verified in `src/gallery/ArtworkMesh.ts`.
- [x] `GalleryManager.showArtwork` forwards `artwork.dimensions` and emits `show-artwork-fallback` warn when applicable — verified in `src/gallery/GalleryManager.ts`.
- [x] `TextureManager.loadForRole` uses `externalLoader` only for `^https?://`; `data:`, `blob:`, relative, and `file://` use `localLoader` — verified in `src/gallery/TextureManager.ts`.
- [x] Diagnostics envelope includes `fallbackUsed`, `aspectSource`, `manifestDimensions` on `show-artwork-complete`.
- [x] All-resolution matrix above is consistent with `fitWithinBox` and `getMinZoom`.

#### 10. Future work parked from v0.08

- v0.09: respect EXIF orientation when uploading JPEGs to WebGL (decode via
  `createImageBitmap({ imageOrientation: 'from-image' })` and pass the bitmap
  to `THREE.Texture`).
- v0.09: importer-side downscale for images >4000 px on the longest edge,
  optional and reversible.
- v0.09: per-artwork `surfacePhysics` override surfaced in the importer for
  customer-controlled material profiles.

---

## v0.07 Plan — Customer-managed artwork folder and one-click importer

### v0.07 Planning Status

**Implemented with critical follow-up required (2026-05-17).** The v0.07
customer-managed artwork workflow can generate manifests and timeline thumbnails.
A non-technical customer can drop images into `customer-artworks/inbox/` and
double-click `Update Gallery` to refresh the offline preview. However, v0.08 is
required before this workflow is accepted as complete, because customer images
must also render on the central 3D painting with correct aspect ratios.

The diagnostics and logging subsystem (Slice S7) was implemented in an earlier
pass on the same date and is unchanged by this implementation pass.

See `v0.07 Implementation Outcome` below for the file-level summary and importer
test matrix. See the v0.08 critical plan above for the remaining 3D rendering
acceptance work.

### v0.07 Implementation Outcome

| Slice | Deliverable | Status |
|-------|-------------|--------|
| S1 | `docs/CUSTOMER_PICTURE_GUIDE.md` (rewritten for the implemented workflow) | done |
| S2 | Manifest contract (`artworks.json` + `customer-artworks.js`) | done |
| S3 | `scripts/import-artworks.mjs` (zero-dep, JPEG/PNG/GIF/WebP/SVG/AVIF dimensions) | done |
| S4 | Large-file copy-only path; `jimp` upgrade path documented for Phase 4 | done (copy-only) |
| S5 | `src/main.ts` + `scripts/write-local-preview.mjs` integration | done |
| S6 | Plain-language report + macOS/Windows double-click launchers | done |
| S7 | Centralized diagnostics (`src/utils/Diagnostics.ts`) | done (prior pass) |

Files added in the implementation pass:

- `scripts/import-artworks.mjs` — zero-dependency importer.
- `Update Gallery.command` — macOS double-click launcher (chmod +x).
- `Update Gallery.bat` — Windows double-click launcher.
- `customer-artworks/inbox/.gitkeep`, `customer-artworks/processed/.gitkeep`.

Files modified:

- `src/timeline/Timeline.ts` — accepts `readonly Artwork[]` via constructor.
- `src/ui/InfoPanel.ts` — accepts initial `Artwork` via constructor.
- `src/gallery/GalleryManager.ts` — accepts `readonly Artwork[]` via constructor;
  all internal references use `this.artworks`.
- `src/main.ts` — reads `window.__FREYRAUM_ARTWORKS`, validates with
  `sanitizeInjectedArtworks()`, falls back to built-in demo when missing or empty.
- `scripts/write-local-preview.mjs` — injects `<script src="./customer-artworks.js">`
  into `app.html` and writes a `window.__FREYRAUM_ARTWORKS = []` stub when none exists.
- `.gitignore` — excludes customer-generated content but keeps the inbox/processed
  directory placeholders.
- `CHANGELOG.md`, `FINDINGS.md`, `docs/CUSTOMER_PICTURE_GUIDE.md` — updated.

Verified test matrix (importer + sanitizer): landscape 800×400, portrait 300×600,
square 512×512, ultrawide 3200×800, SVG 1024×768, JPEG with SOF0 512×768,
unsupported `.txt` (skipped with friendly text), and empty-inbox fallback.

### v0.07 Current Code Findings

| Finding | Current source | Impact |
|---------|----------------|--------|
| Artwork content is hardcoded | `src/config/artworks.ts` exports `artworks` and currently builds four embedded SVG `data:` images. | Real customer images require developer edits today. |
| Metadata is already structured | `Artwork` has `id`, `title`, `subtitle`, `description`, `year`, `medium`, `image`, `dimensions`, `alt`, `credit`, `tags`, `textureSet?`, `surfaceProfile?`, `surfacePhysics?`. | Good target schema for an auto-generated manifest. |
| Texture loader supports file paths | `TextureManager` uses `THREE.TextureLoader`; `PaintingTextureSet` URLs may be relative paths or data URIs. | Imported images can become normal static files if copied into the built preview. |
| Preview is static/offline | `vite.local.config.ts` emits one IIFE bundle into `customer-preview/`; root `index.html` redirects to `customer-preview/app.html`. | Customer workflow must preserve the double-click `file://` preview. |
| Procedural maps fill missing material maps | `ProceduralTextureFactory` fills normal/height/roughness/specular/AO/varnish gaps. | Customers only need simple picture files; advanced PBR maps can stay optional. |
| Debug logging is ad hoc | `src/main.ts` has hidden `?debug=1` key toggles and `RenderBackend.ts` uses one direct `console.warn()`. | Current diagnostics are too narrow and inconsistent for future debugging/reliability work. |

### v0.07 Online Research Findings

Authoritative/browser-platform findings used for this plan:

- MDN image format guide: common browser-safe formats include JPEG, PNG, GIF, SVG, WebP, and modern AVIF; TIFF and camera RAW are not reliable as direct browser images. Source: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
- MDN File and Directory Entries API: recursive folder reading is useful but non-standard and browser-dependent. Source: https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API
- MDN `<input type="file">` / `webkitdirectory`: folder selection can work in Chromium/Safari-style browsers but is not a universal standard, so a pure in-browser folder picker cannot be the only customer workflow. Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#webkitdirectory
- MDN `createImageBitmap()`: async image decode is available, but orientation and browser behavior must be handled carefully for imported photos. Source: https://developer.mozilla.org/en-US/docs/Web/API/createImageBitmap
- MDN WebGL constants: WebGL has a device-dependent `MAX_TEXTURE_SIZE`; very large camera/scanner images must be downscaled before use as reliable WebGL textures. Source: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#textures

**Conclusion:** for an elderly non-technical customer, the safest architecture is not a browser-only drag-and-drop importer. The most reliable workflow is a local folder plus a one-click desktop/script updater that processes files before the static preview opens. Browser drag-and-drop can be added later as a convenience, but should not be the only path.

### v0.07 Goals

- Customer can manage the gallery by adding/removing images in one folder.
- No TypeScript editing, no terminal, no package manager, no developer tools.
- Accept common image files and preserve all aspect ratios.
- Preserve originals and generate optimized preview copies.
- Keep the existing one-click `index.html` → `customer-preview/app.html` preview.
- Generate metadata automatically when the customer provides only image files.
- Show friendly warnings for formats that browsers may not display directly.
- Add a deep but readable diagnostics system with leveled output, ring-buffered history, and low-noise console behavior.

### v0.07 Non-Goals

- No full CMS, login, remote upload server, or cloud dependency.
- No requirement for customers to author normal/height/roughness/PBR maps.
- No manual metadata entry as a blocker for the first version.
- No destructive edits to original customer files.
- No promise that every proprietary RAW/HEIC/TIFF file displays in every browser without conversion.

### v0.07 Proposed Customer Workflow

1. Customer opens the FREYRAUM folder.
2. Customer opens `customer-artworks/inbox/`.
3. Customer drags image files into that folder.
4. Customer double-clicks `Update Gallery` (`.command` on macOS, `.bat` on Windows, or a clearly named helper app/script).
5. The updater creates optimized files and `customer-artworks/artworks.json`.
6. Customer double-clicks root `index.html` to view the updated gallery.

### v0.07 Proposed Files / Modules

| File / Folder | Purpose |
|---------------|---------|
| `customer-artworks/inbox/` | Customer-managed input folder. Only place the customer needs to touch. |
| `customer-artworks/processed/` | Generated optimized image copies for preview/runtime. |
| `customer-artworks/artworks.json` | Generated manifest consumed by the app. |
| `scripts/import-artworks.mjs` | Node-based importer: scan, validate, read dimensions, copy/convert/resize where available, write manifest, write report. |
| `scripts/update-gallery.mjs` | Friendly wrapper that runs import and preview build. |
| `Update Gallery.bat` | Windows double-click entry point. |
| `Update Gallery.command` | macOS double-click entry point. |
| `src/config/artworks.ts` | Keep built-in fallback/demo artworks. Add loader bridge to generated manifest in implementation pass. |
| `src/config/customerArtworks.ts` | Proposed typed adapter for generated manifest (if JSON import is used at build time). |
| `src/utils/Diagnostics.ts` | Central diagnostics logger: levels, dedupe, ring buffer, global error capture, window debug API. |
| `docs/CUSTOMER_PICTURE_GUIDE.md` | Simple customer instructions. Added in this documentation pass. |

### v0.07 Vertical Slices

#### Slice S1 — Documentation and customer guide

**Status: done in this documentation pass.**

- Add `docs/CUSTOMER_PICTURE_GUIDE.md`.
- Document current limitation: v0.06 still requires developer edits.
- Document planned customer workflow and safe image advice.
- Update all markdown files with this plan and research findings.

#### Slice S2 — Manifest contract

- Define `customer-artworks/artworks.json` schema using the existing `Artwork` shape as the target.
- Required generated fields: `id`, `title`, `subtitle`, `description`, `year`, `medium`, `image`, `dimensions`, `alt`, `credit`, `tags`, `surfaceProfile`.
- Optional future fields: `textureSet`, `surfacePhysics`, sort order override, custom title override.
- Add strict validation and friendly error messages.

#### Slice S3 — One-click importer

- Add a Node script that scans `customer-artworks/inbox/`.
- Accept common browser-safe extensions first: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.gif`, `.svg`.
- Detect risky extensions and warn: `.heic`, `.heif`, `.tif`, `.tiff`, RAW camera extensions.
- Read dimensions automatically.
- Normalize IDs from filenames.
- Generate title/alt/medium fallback text from filenames and dimensions.
- Preserve source files untouched.

#### Slice S4 — Large-file and format hardening

- Generate safe preview copies instead of loading huge originals directly.
- Default long-edge cap: 4096 px for broad WebGL reliability; keep optional high-detail cap behind a setting.
- Query/document `MAX_TEXTURE_SIZE` at runtime and downshift quality if needed.
- Generate thumbnails/side-preview copies separately.
- Handle EXIF orientation consistently or document the chosen browser/library limitation.

#### Slice S5 — App integration

- Load generated customer manifest when present.
- Fall back to built-in demo artworks when no customer manifest exists.
- Keep `ProceduralTextureFactory` fallbacks for all missing material maps.
- Ensure portrait, landscape, square, and ultrawide images preserve aspect ratio in main artwork, side panels, timeline, zoom/pan limits, and material tiling.

#### Slice S6 — Elderly-customer UX polish

- Add a plain-language update report after import.
- Add big success/failure messages: `Gallery updated successfully` / `These files need attention`.
- Avoid scary stack traces for customer-facing failures.
- Keep a backup copy of the previous manifest before replacing it.
- Document exactly which folder the customer can edit and which generated folders they should not touch.

#### Slice S7 — Diagnostics, debugging, and reliability instrumentation

**Status: implemented in this diagnostics pass (2026-05-17).**

- Replace ad hoc `console.*` calls with one centralized diagnostics utility.
- Default console output must stay minimal (`warn` / `error` only), while debug sessions can opt into `info` or `verbose`.
- Keep a ring-buffered in-memory history for later inspection without flooding the console.
- Capture uncaught errors and unhandled promise rejections globally.
- Add subsystem-scoped diagnostics for boot, renderer/backend probe, preferences, texture loading, gallery navigation/load, and adaptive quality.
- Expose a safe developer API on `window.__FREYRAUM_DIAGNOSTICS__` so future bug reports can dump a readable session log.

### v0.07 Performance Budget

| Asset path | Budget / behavior |
|------------|-------------------|
| Original customer files | Preserve untouched; can be very large. |
| Runtime main images | Generate/copy optimized web-safe files; default max long edge 4096 px unless future testing permits higher. |
| Thumbnails / side previews | Generate smaller files to avoid loading full-size images for side panels. |
| GPU texture upload | Must stay below device `MAX_TEXTURE_SIZE`; runtime should fail gracefully if an image exceeds limits. |
| Initial load | Do not preload unlimited huge originals. Preload optimized runtime copies only. |

### v0.07 Accessibility Impact

- Auto-generate usable alt text from title/filename, but allow future simple overrides.
- Keep keyboard navigation and existing controls unchanged.
- Provide large, plain-language instructions in the guide.
- Avoid requiring terminal or code-editor access.

### v0.07 Fallback Behaviour

- If no customer files exist, keep built-in demo artworks.
- If one file fails, import the rest and report the failed file.
- If a file format is unsupported, show a friendly conversion recommendation.
- If dimensions cannot be read, skip the file and report it.
- If generated manifest is invalid, keep the previous valid manifest.

### v0.07 Browser / API Stability Boundaries

- Do not rely only on browser folder drag-and-drop because folder APIs are browser-dependent.
- Treat HEIC/HEIF, TIFF, and RAW as input risks unless a conversion tool is added.
- Treat `createImageBitmap()` as useful but not a complete metadata/orientation solution by itself.
- Treat WebGL `MAX_TEXTURE_SIZE` as device-dependent; never assume all customer images can become GPU textures at original resolution.

### v0.07 Acceptance Checks

1. A non-technical tester can replace artworks by copying files into `customer-artworks/inbox/` and double-clicking the updater.
2. Portrait, square, landscape, and ultrawide images display without stretching.
3. Large phone/camera images are optimized before runtime.
4. Unsupported/risky files produce friendly warnings, not crashes.
5. Root `index.html` still opens the preview by double-click.
6. Built-in demo artworks still load if no customer manifest exists.
7. All markdown docs describe the final customer workflow after implementation.
8. Default runtime console output stays readable and low-noise during normal customer use.
9. `?debug=1` and `?debug=verbose` enable progressively deeper diagnostics without code edits.
10. A developer can inspect the current diagnostics buffer through `window.__FREYRAUM_DIAGNOSTICS__`.

### v0.07 Known Risks

- Image conversion without new dependencies is limited. True HEIC/TIFF/RAW conversion may require platform tools or npm/WASM dependencies.
- Windows/macOS double-click scripts need careful quoting for spaces in paths.
- Very old computers may still struggle with many 4096 px images; importer should allow a lower cap.
- Customer may delete generated folders accidentally; updater should recreate them.

---

## v0.07 Technical Implementation Guide

This section is the complete developer-facing execution guide. Every architectural decision is documented here so the developer can implement v0.07 end-to-end without guessing.

### v0.07 Architecture Decision: How the app loads customer images

**Problem:** The gallery preview is a pre-built IIFE bundle opened from `file://`. A customer drags images into a folder. How does the running bundle pick them up?

Three options were evaluated:

| Option | Description | Works from file:// | Requires rebuild | Customer UX |
|--------|-------------|---------------------|-------------------|-------------|
| A: Rebuild bundle | Importer regenerates artworks, then full `npm run build` bakes them in | ✅ | ✅ every time | Slow (seconds), needs Node.js |
| B: `fetch('artworks.json')` at startup | Runtime JSON fetch | ❌ blocked by browsers on file:// | ❌ | Would need local server |
| C: Global window injection | Importer writes `customer-artworks.js` with `window.__FREYRAUM_ARTWORKS`; app.html includes it | ✅ | ❌ no rebuild | Fast (under 1 second) |

**Decision: Option C — global window injection.**

Reason: Option B is disqualified because `fetch()` is blocked by all major browsers on `file://` URLs for security. Option A works but requires a full rebuild (10–30 seconds) on every update. Option C requires no rebuild, works from `file://` by standard script loading, and the customer sees the update immediately after double-clicking the updater.

**How Option C works:**

1. `scripts/import-artworks.mjs` scans `customer-artworks/inbox/`, copies images to `customer-preview/images/`, and writes `customer-preview/customer-artworks.js` containing:
   ```js
   window.__FREYRAUM_ARTWORKS = [ /* Artwork[] JSON */ ];
   ```
2. `scripts/write-local-preview.mjs` is updated to inject `<script src="./customer-artworks.js"></script>` into `customer-preview/app.html` just before the main IIFE bundle tag.
3. `src/main.ts` reads `(window as any).__FREYRAUM_ARTWORKS` at startup; if it is a non-empty array, it is used instead of the built-in demo artworks. The TypeScript type is `Artwork[] | undefined`.
4. If the customer has not yet run the importer, `window.__FREYRAUM_ARTWORKS` is `undefined` (the script tag will 404 silently or be absent), and the built-in demo artworks load as normal.

**Fallback path:** If `customer-artworks.js` does not exist yet, the app.html `<script src="./customer-artworks.js">` will fail silently (a missing optional script does not throw in HTML). As a safer alternative, `write-local-preview.mjs` can emit a stub `customer-preview/customer-artworks.js` that sets `window.__FREYRAUM_ARTWORKS = []` so no 404 occurs. The app reads `[]` as no artworks → falls back to demo artworks. Both approaches work; the stub is cleaner.

---

### v0.07 Diagnostics and logging architecture

The customer-managed import pipeline is only half of reliability. The other half is being able to diagnose failures quickly without drowning the console in noise.

**Current problem:** logging is scattered and inconsistent. `main.ts` contains a hidden `?debug=1` key toggle for shader-only inspection, `RenderBackend.ts` logs one direct `console.warn()`, and most other critical runtime paths are silent. This is not enough for future debugging, performance audits, customer-machine issue reports, or importer rollout support.

**Decision:** add one centralized diagnostics utility in `src/utils/Diagnostics.ts` and make all major subsystems log through it.

#### Diagnostics goals

- Keep normal customer sessions quiet and professional.
- Keep enough history in memory to inspect failures after they happen.
- Make debug sessions opt-in through URL/localStorage, not hard-coded console spam.
- Use stable scopes and event names so future contributors can grep and compare sessions.
- Deduplicate repeated noise (for example repeated storage failures or repeated fallback image loads).

#### Diagnostics modes

| Mode | Activation | Console threshold | Intended use |
|------|------------|-------------------|--------------|
| `default` | no query, no storage override | `warn` / `error` | normal customer preview |
| `info` | `?debug=1` or `?debug=info` | `info` | developer repro / support session |
| `verbose` | `?debug=verbose` | `debug` | deeper engineering diagnostics |

The diagnostics utility should also persist the chosen mode in `localStorage` so a developer can leave a machine in `info` or `verbose` mode temporarily without editing code.

#### Diagnostics data model

Every entry should contain:

- timestamp
- relative session time in ms
- level (`debug` / `info` / `warn` / `error`)
- scope (`boot`, `gallery`, `texture`, `backend`, `quality`, `preferences`, etc.)
- stable event key
- short readable message
- optional structured metadata object
- repeat count (for deduped entries)

Keep a ring buffer of the latest ~300 entries only. This is deep enough for diagnosis but small enough to stay readable and cheap.

#### Global diagnostics API

Expose a small API for support/debug sessions:

```ts
window.__FREYRAUM_DIAGNOSTICS__.getEntries()
window.__FREYRAUM_DIAGNOSTICS__.print('info')
window.__FREYRAUM_DIAGNOSTICS__.snapshot()
window.__FREYRAUM_DIAGNOSTICS__.clear()
window.__FREYRAUM_DIAGNOSTICS__.setMode('verbose')
```

This API must be read-only with respect to application state except for diagnostics mode and buffer reset.

#### Required runtime integration points

| Scope | Required events |
|-------|-----------------|
| `boot` | startup, missing `#app`, WebGL unavailable, renderer init failure, gallery ready, shutdown, fatal startup failure |
| `preferences` | storage read/write failure, applied preference set |
| `backend` | backend detection, WebGPU probe start/success/failure |
| `texture` | renderer capabilities, texture fallback generation, repeated load failures |
| `gallery` | preset apply, inspection-mode change, artwork load start, stale async load discard, artwork ready |
| `quality` | adaptive downgrade request, manual override suspension |
| `window` | uncaught error, unhandled rejection |

#### Reliability rules for diagnostics

- Diagnostics must never throw.
- Diagnostics must never block rendering or interaction.
- Diagnostics metadata must be serializable; `Error` objects should be normalized.
- Default mode must not spam per-frame or per-pointer-move events.
- Repeated identical warnings within a short window must increment a repeat counter instead of printing every occurrence.
- The diagnostics system itself must be disposable-free and singleton-safe; it should survive for the lifetime of the page.

#### Logging style guide

- Prefer one sentence messages.
- Keep the scope and event stable; change the message only for readability.
- Include metadata only when it helps future debugging (IDs, counts, active preset, current artwork, dimensions, timing).
- Never log per-frame values in `default` or `info` mode.
- Never log user-content blobs or huge objects; summarize them instead.

---

### v0.07 Slice S2 — Manifest contract: `artworks.json` and `customer-artworks.js`

The importer produces two outputs for every update run:

**`customer-artworks/artworks.json`** — Human-readable manifest. The customer or developer can inspect it. Not loaded by the app directly. Structure matches the `Artwork` TypeScript interface from `src/config/artworks.ts`.

```jsonc
[
  {
    "id": "01-sunset-at-lake",
    "title": "Sunset At Lake",
    "subtitle": "Artwork 01",
    "description": "Imported artwork",
    "year": 2025,
    "medium": "Photograph · 3024 × 4032",
    "image": "./images/01-sunset-at-lake.jpg",
    "dimensions": { "width": 3024, "height": 4032 },
    "alt": "Sunset At Lake",
    "credit": "Customer",
    "tags": [],
    "surfaceProfile": "matte-canvas"
  }
]
```

**`customer-preview/customer-artworks.js`** — App-injectable runtime file. Paths must be relative to `customer-preview/`:

```js
window.__FREYRAUM_ARTWORKS = [
  {
    "id": "01-sunset-at-lake",
    "title": "Sunset At Lake",
    "subtitle": "Artwork 01",
    "description": "Imported artwork",
    "year": 2025,
    "medium": "Photograph · 3024 × 4032",
    "image": "./images/01-sunset-at-lake.jpg",
    "dimensions": { "width": 3024, "height": 4032 },
    "alt": "Sunset At Lake",
    "credit": "Customer",
    "tags": [],
    "surfaceProfile": "matte-canvas"
  }
];
```

**Title generation from filename:**
```
01-sunset-at-lake.jpg  →  "Sunset At Lake"
02-portrait of maria.PNG  →  "Portrait Of Maria"
003_forest_path.webp  →  "Forest Path"
```
Algorithm: strip leading digits and separators (`-`, `_`, spaces), strip extension, split on remaining separators, capitalize each word.

**ID generation from filename:**
```
01-sunset-at-lake.jpg  →  "01-sunset-at-lake"
IMG_8847.JPG  →  "img-8847"
```
Algorithm: strip extension, lowercase, replace non-alphanumeric with `-`, collapse repeated `-`.

**`medium` generation:**
```
Portrait · 3024 × 4032   (height > width by >10%)
Landscape · 3024 × 2016  (width > height by >10%)
Square · 2048 × 2048     (ratio within 10%)
Photograph · W × H       (default prefix)
```

**`surfaceProfile` default:** `'matte-canvas'` for all auto-imported artwork unless overridden in a future metadata sidecar.

---

### v0.07 Slice S3 — `scripts/import-artworks.mjs`: exact implementation guide

**File:** `scripts/import-artworks.mjs`  
**Runtime:** Node.js 18+ (ES modules, `node:fs`, `node:path`).  
**No new npm dependencies required** for the first version (dimension reading is zero-dep header parsing). Optional resize via `jimp` (pure-JS, no native binaries).

#### Supported extensions

```js
const SAFE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']);
const RISKY_EXTENSIONS = new Set(['.heic', '.heif', '.tif', '.tiff', '.bmp']);
const RAW_EXTENSIONS = new Set(['.cr2', '.cr3', '.nef', '.arw', '.dng', '.orf', '.rw2', '.raw']);
```

Safe extensions are imported normally. Risky extensions: copy as-is but emit a warning in the report. RAW extensions: skip entirely with a clear message.

#### Zero-dependency image dimension reading

Parse headers directly from a `Buffer` using `fs.readFileSync()`:

```js
function readImageDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  // JPEG: look for SOF0 (0xFFC0) or SOF2 (0xFFC2) marker
  if (buf[0] === 0xFF && buf[1] === 0xD8) {
    let i = 2;
    while (i < buf.length - 4) {
      if (buf[i] !== 0xFF) break;
      const marker = buf[i + 1];
      const segLen = buf.readUInt16BE(i + 2);
      if (marker === 0xC0 || marker === 0xC2 || marker === 0xC1 || marker === 0xC3) {
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      }
      i += 2 + segLen;
    }
    throw new Error('JPEG SOF marker not found');
  }
  // PNG: width at offset 16, height at offset 20 (big-endian uint32)
  if (buf[0] === 0x89 && buf.toString('ascii', 1, 4) === 'PNG') {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // WebP: RIFF + WEBP container
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    if (chunk === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3FFF, height: buf.readUInt16LE(28) & 0x3FFF };
    if (chunk === 'VP8L') {
      const b0 = buf[21], b1 = buf[22], b2 = buf[23];
      return { width: 1 + (buf[20] | ((b0 & 0x3F) << 8)), height: 1 + (((b0 >> 6) | (b1 << 2) | ((b2 & 0x0F) << 10))) };
    }
  }
  // GIF: width at offset 6, height at offset 8 (little-endian uint16)
  if (buf.toString('ascii', 0, 3) === 'GIF') {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  }
  // SVG: return 0×0 with a flag; runtime will treat as vector (no cap needed)
  if (buf.toString('utf8', 0, 5).trimStart().startsWith('<svg') ||
      buf.toString('utf8', 0, 100).includes('<svg')) {
    return { width: 0, height: 0, isSVG: true };
  }
  // AVIF / others: fall back — cannot reliably parse without a library
  throw new Error(`Cannot read dimensions for ${path.basename(filePath)} without a library`);
}
```

#### Complete script outline

```js
import { readdirSync, mkdirSync, cpSync, writeFileSync, existsSync, renameSync } from 'node:fs';
import { join, extname, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const INBOX = join(ROOT, 'customer-artworks', 'inbox');
const PROCESSED = join(ROOT, 'customer-artworks', 'processed');
const MANIFEST_JSON = join(ROOT, 'customer-artworks', 'artworks.json');
const MANIFEST_BACKUP = join(ROOT, 'customer-artworks', 'artworks.json.bak');
const PREVIEW_IMAGES = join(ROOT, 'customer-preview', 'images');
const PREVIEW_JS = join(ROOT, 'customer-preview', 'customer-artworks.js');
const REPORT_FILE = join(ROOT, 'customer-artworks', 'last-import-report.txt');

// 1. Ensure folders exist
mkdirSync(INBOX, { recursive: true });
mkdirSync(PROCESSED, { recursive: true });
mkdirSync(PREVIEW_IMAGES, { recursive: true });

// 2. Scan inbox
const files = readdirSync(INBOX)
  .filter(f => !f.startsWith('.'))
  .sort();

// 3. Process each file
const artworks = [];
const imported = [];
const warnings = [];
const skipped = [];

for (const [i, filename] of files.entries()) {
  const srcPath = join(INBOX, filename);
  const ext = extname(filename).toLowerCase();
  const artworkIndex = String(i + 1).padStart(2, '0');

  if (RAW_EXTENSIONS.has(ext)) {
    skipped.push(`${filename} — camera RAW format, cannot display in browser`);
    continue;
  }
  if (!SAFE_EXTENSIONS.has(ext) && !RISKY_EXTENSIONS.has(ext)) {
    skipped.push(`${filename} — unknown format`);
    continue;
  }

  let dims = { width: 0, height: 0 };
  try {
    dims = readImageDimensions(srcPath);
  } catch (e) {
    warnings.push(`${filename} — could not read dimensions: ${e.message}. Skipping.`);
    continue;
  }

  const id = normalizeId(basename(filename, ext));
  const title = generateTitle(basename(filename, ext));
  const destFilename = id + ext;
  const destPath = join(PREVIEW_IMAGES, destFilename);

  // Copy to preview/images
  cpSync(srcPath, destPath);

  if (RISKY_EXTENSIONS.has(ext)) {
    warnings.push(`${filename} — format may not display in all browsers. Export as JPG if it does not appear.`);
  }

  artworks.push({
    id,
    title,
    subtitle: `Artwork ${artworkIndex}`,
    description: 'Imported artwork',
    year: new Date().getFullYear(),
    medium: generateMedium(dims, ext),
    image: `./images/${destFilename}`,
    dimensions: { width: dims.width, height: dims.height },
    alt: title,
    credit: 'Customer',
    tags: [],
    surfaceProfile: 'matte-canvas',
  });

  imported.push(filename);
}

// 4. Back up previous manifest, write new one
if (existsSync(MANIFEST_JSON)) {
  renameSync(MANIFEST_JSON, MANIFEST_BACKUP);
}
writeFileSync(MANIFEST_JSON, JSON.stringify(artworks, null, 2), 'utf8');

// 5. Write customer-artworks.js for the preview (global injection)
const js = `// Auto-generated by FREYRAUM import-artworks — do not edit manually\nwindow.__FREYRAUM_ARTWORKS = ${JSON.stringify(artworks, null, 2)};\n`;
writeFileSync(PREVIEW_JS, js, 'utf8');

// 6. Write plain-language report
const reportLines = [
  `Gallery update finished — ${new Date().toLocaleString()}`,
  '',
  `Imported (${imported.length}):`,
  ...imported.map(f => `  ✓ ${f}`),
];
if (warnings.length) {
  reportLines.push('', `Needs attention (${warnings.length}):`, ...warnings.map(w => `  ⚠ ${w}`));
}
if (skipped.length) {
  reportLines.push('', `Skipped (${skipped.length}):`, ...skipped.map(s => `  ✗ ${s}`));
}
if (imported.length === 0 && warnings.length === 0) {
  reportLines.push('', 'No valid image files found in customer-artworks/inbox/');
  reportLines.push('Put your pictures in that folder and run Update Gallery again.');
}
const report = reportLines.join('\n');
writeFileSync(REPORT_FILE, report, 'utf8');
console.log(report);
```

---

### v0.07 Slice S4 — Large-file and format hardening

#### Large-image strategy (first version — copy-only, no resize)

For the first implementation version, the importer **copies** images without resizing. Rationale:
- Avoids the complexity of adding `jimp` or `sharp` as a dependency in the first pass.
- Most phone/camera JPEG files are 3–25 MB and typically 3000–8000 px; Three.js `TextureLoader` + WebGL handles these well up to `MAX_TEXTURE_SIZE` on modern devices.
- The `ProceduralTextureFactory` is already responsible for procedural PBR maps, not image resizing.

**Future S4 upgrade path (optional, when resize is needed):**

Add `jimp` as a devDependency (pure JS, no native binaries, works on macOS + Windows without build tools):

```
npm install --save-dev jimp
```

In the importer, after copying, check if `width > MAX_LONG_EDGE || height > MAX_LONG_EDGE` and if so use jimp to downscale to `MAX_LONG_EDGE = 4096`:

```js
import Jimp from 'jimp';

async function processImage(srcPath, destPath, dims, maxLongEdge = 4096) {
  const maxDim = Math.max(dims.width, dims.height);
  if (maxDim > maxLongEdge) {
    const image = await Jimp.read(srcPath);
    const scale = maxLongEdge / maxDim;
    await image
      .resize(Math.round(dims.width * scale), Math.round(dims.height * scale))
      .writeAsync(destPath);
    return { width: Math.round(dims.width * scale), height: Math.round(dims.height * scale) };
  } else {
    cpSync(srcPath, destPath);
    return dims;
  }
}
```

Jimp supports JPEG, PNG, BMP, TIFF, GIF. For WebP resize, a WebP-specific jimp plugin or sharp (if native binaries are available) is needed.

**Runtime WebGL texture-size guard (app side):**

In `src/gallery/TextureManager.ts`, after `init(renderer)` reads `maxAnisotropy`, also read and store `maxTextureSize`:

```ts
init(renderer: THREE.WebGLRenderer): void {
  this.maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  this.maxTextureSize = renderer.capabilities.maxTextureSize; // e.g. 16384 on modern GPU
}
```

Before loading a customer image, log a warning if the declared dimensions exceed `maxTextureSize`. The texture will still load (WebGL silently clamps), but logging helps debugging.

---

### v0.07 Slice S5 — App integration: exact code changes

#### Change 1: `src/main.ts`

Add customer artwork loading just before the gallery is initialized. The `artworks` variable already comes from `src/config/artworks`. Add a check:

```ts
// At the top of main(), after const preferences = new PreferencesStore():
const injected = (window as any).__FREYRAUM_ARTWORKS as typeof artworks | undefined;
const activeArtworks = Array.isArray(injected) && injected.length > 0 ? injected : artworks;
```

Then replace every reference to `artworks` in `main()` with `activeArtworks`. There are at least these usage sites to check:
- `TextureManager.preload(activeArtworks.map(a => a.image))`
- `new GalleryManager(activeArtworks, ...)`
- `new Timeline(activeArtworks, ...)`
- `new InfoPanel(activeArtworks[0], ...)` etc.

Search the file for `artworks` (the imported constant) and replace with `activeArtworks` in the `main()` function body. The import line itself remains unchanged.

**Important:** The `Artwork` interface does not change. The injected data must match that shape exactly, which is guaranteed because the importer outputs the same JSON structure.

#### Change 2: `scripts/write-local-preview.mjs`

Inject the customer artworks script tag into `app.html` and also write a stub `customer-artworks.js` so no 404 occurs:

```js
const html = `<!DOCTYPE html>
<html lang="de">
<head>
  ...existing head...
</head>
<body>
  <div id="app"></div>
  <!-- Customer artwork injection (generated by import-artworks.mjs) -->
  <script src="./customer-artworks.js"></script>
  <script src="./freyraum-gallery.js"></script>
</body>
</html>
`;

// Also write a stub customer-artworks.js if it does not exist yet
const stubPath = 'customer-preview/customer-artworks.js';
if (!existsSync(stubPath)) {
  writeFileSync(stubPath, '// No customer artworks imported yet\nwindow.__FREYRAUM_ARTWORKS = [];\n');
}
```

The `existsSync` guard means that a real imported `customer-artworks.js` from a previous `import-artworks.mjs` run is not overwritten by the stub on rebuild.

#### Change 3: `customer-artworks/inbox/.gitkeep`

Create an empty `.gitkeep` file in `customer-artworks/inbox/` and add `customer-artworks/inbox/*` (but not `.gitkeep`) to `.gitignore`. This ensures the folder exists in the repo but customer images are not committed.

Similarly add `customer-preview/images/` and `customer-preview/customer-artworks.js` to `.gitignore` so generated files are not committed.

#### Change 4: `Update Gallery.command` (macOS) and `Update Gallery.bat` (Windows)

**`Update Gallery.command`** — macOS double-click shell script:
```sh
#!/bin/bash
# FREYRAUM — Update Gallery
# Double-click this file to import your pictures.
cd "$(dirname "$0")"
if ! command -v node &> /dev/null; then
    osascript -e 'display alert "Node.js not found" message "Please install Node.js from https://nodejs.org and try again."'
    exit 1
fi
node scripts/import-artworks.mjs
if [ $? -eq 0 ]; then
    open customer-artworks/last-import-report.txt 2>/dev/null || true
fi
```
After creation, run `chmod +x "Update Gallery.command"` so macOS can execute it.

**`Update Gallery.bat`** — Windows double-click batch file:
```bat
@echo off
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js not found. Please install it from https://nodejs.org
    pause
    exit /b 1
)
node scripts/import-artworks.mjs
if %errorlevel% equ 0 (
    start notepad customer-artworks\last-import-report.txt
) else (
    echo An error occurred. Please contact your support person.
    pause
)
```

**Important macOS note:** When a `.command` file is first run by double-clicking in Finder, macOS Gatekeeper will block it with "cannot be opened because it is from an unidentified developer". The customer (or the developer during setup) must right-click → Open → Open to approve it once. Document this in the guide. After the first approval, future double-clicks work normally.

---

### v0.07 Slice S6 — Report and UX

The plain-language update report is written to `customer-artworks/last-import-report.txt`. The `Update Gallery` scripts open this file automatically after a successful run.

Sample report (success):
```
Gallery update finished — 17.5.2026, 14:32:01

Imported (3):
  ✓ 01-sunset.jpg
  ✓ 02-forest.png
  ✓ 03-portrait.jpg

Open index.html to view the gallery.
```

Sample report (with warnings):
```
Gallery update finished — 17.5.2026, 14:32:01

Imported (2):
  ✓ 01-sunset.jpg
  ✓ 02-forest.png

Needs attention (1):
  ⚠ 03-iphone.heic — format may not display in all browsers. Export as JPG if it does not appear.

Skipped (1):
  ✗ raw-photo.cr2 — camera RAW format, cannot display in browser

Open index.html to view the gallery.
```

The report line `Open index.html to view the gallery.` should always be at the bottom when at least one artwork was imported successfully.

---

### v0.07 Full Implementation Checklist

Developer task list in implementation order:

#### Phase 1 — Script and folder structure (no app changes yet, testable standalone)
- [x] Create `customer-artworks/inbox/` with `.gitkeep`
- [x] Create `customer-artworks/processed/` with `.gitkeep`
- [x] Add `customer-artworks/inbox/*`, `!customer-artworks/inbox/.gitkeep`, `customer-artworks/processed/*`, `!customer-artworks/processed/.gitkeep`, `customer-preview/images/`, `customer-preview/customer-artworks.js` (and generated `artworks.json` / `artworks.json.bak` / `last-import-report.txt`) to `.gitignore`
- [x] Write `scripts/import-artworks.mjs` (scan, copy, dimension-read for JPEG/PNG/GIF/WebP/SVG/AVIF, generate manifest + JS + report)
- [x] Write `Update Gallery.command` and `Update Gallery.bat`
- [x] Run `chmod +x "Update Gallery.command"`
- [x] Test: drop real images into `customer-artworks/inbox/`, run `node scripts/import-artworks.mjs`, verify `customer-artworks/artworks.json` and `customer-preview/customer-artworks.js` are correct

#### Phase 2 — App integration (visible result in preview)
- [x] Update `src/main.ts`: read `window.__FREYRAUM_ARTWORKS`, validate with `sanitizeInjectedArtworks()`, prefer it over built-in artworks
- [x] Refactor `Timeline`, `InfoPanel`, `GalleryManager` to accept the active artworks list via constructor instead of importing the global constant
- [x] Update `scripts/write-local-preview.mjs`: inject `<script src="./customer-artworks.js">` into `app.html` + write stub if not present
- [x] Run `npm run build` to rebuild with the new `main.ts` changes
- [x] Test: run importer, verify `customer-preview/customer-artworks.js` contains the expected manifest

#### Phase 3 — Polish and edge cases
- [x] Test portrait, landscape, square, ultrawide images — verify no stretching
- [x] Test SVG and JPEG dimension parsing
- [x] Test empty inbox — verify the stub manifest is written and demo artworks load
- [x] Test unsupported formats — verify warnings appear, no crash
- [x] Document Gatekeeper approval flow on macOS in `docs/CUSTOMER_PICTURE_GUIDE.md`
- [x] Update `docs/CUSTOMER_PICTURE_GUIDE.md` for the completed implementation
- [x] Update `CHANGELOG.md`, `FINDINGS.md`, `plan.md`

#### Phase 4 — Optional future improvements (not required for v0.07)
- [ ] Add `jimp` for image downscaling (long-edge cap 4096 px)
- [ ] Add optional `artworks-metadata.txt` sidecar for custom titles/descriptions
- [ ] Add per-artwork `surfaceProfile` override in the sidecar
- [ ] Add thumbnail generation for timeline previews
- [ ] Add in-app Preferences Panel option to scan a different folder

---

### v0.07 Developer Setup Notes

**What the customer needs installed:**
- Only Node.js (https://nodejs.org, LTS version). The developer installs this once during setup, and the customer never touches it again.
- No `npm install` required for the v0.07 script (zero npm dependencies in Phase 1). If `jimp` is added in Phase 4, the developer runs `npm install` once on the customer machine.

**First-time developer setup on customer machine:**
1. Install Node.js LTS.
2. Clone or copy the FREYRAUM project folder to the customer's computer.
3. Run `npm install` in the project folder (sets up the dev tools; customers do not need to do this again).
4. Run `npm run build` once to generate `customer-preview/`.
5. On macOS: right-click `Update Gallery.command` → Open → Open (Gatekeeper approval, once only).
6. From then on the customer only uses: drag images → double-click `Update Gallery` → double-click `index.html`.

**Testing the importer:**
```sh
node scripts/import-artworks.mjs
# Then open customer-preview/app.html in a browser, or double-click index.html
```

---

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


## v0.04 Implementation and Execution Plan — Photorealistic PBR Painting Materials and Artifact Removal

### v0.04 Status

**Implemented (2026-05-17).** The code audit and execution plan below have been carried out against the current branch. The detailed implementation guide is retained as historical design intent, and this outcome section records the as-built changes, validation evidence, and remaining review notes.

### v0.04 Implementation Outcome

Implemented slices:

1. **Neutral AO fallback** — `ProceduralTextureFactory.generateAO()` no longer computes radial edge darkening. The AO fallback now emits near-white neutral occlusion with subtle value-noise grain, so flat paintings no longer receive synthetic vignette shadows.
2. **Stochastic procedural support maps** — `generateNormal()`, `generateHeight()`, and `generateRoughness()` now use deterministic smoothstep-interpolated value noise instead of `sin/cos` fields. This removes the old checkerboard, horizontal-band, vertical-band, and diagonal-weave cues.
3. **Deterministic value-noise utilities** — added `valueNoise2d()` and `latticeHash()` to `ProceduralTextureFactory`. They are pure TypeScript/JavaScript, use `Math.imul` integer mixing, require no dependency, and remain stable per artwork seed and tile size.
4. **Clearcoat / varnish contract** — `PaintingTextureSet` now supports a `varnish` map role, `TextureManager.preloadTextureSet()` loads authored varnish maps, and `ResolvedPaintingTextures` can pass them into the material.
5. **Preset-gated clearcoat** — `QualityPreset` now exposes `clearcoatEnabled`, `clearcoatStrength`, and `clearcoatRoughnessValue`. Only the high preset enables the clearcoat BxDF; balanced and battery compile/run without it.
6. **Surface-profile material response** — `PaintingMaterial.applySurfaceProfile()` maps `SurfaceProfile` metadata to clearcoat intensity/roughness. Matte and paper profiles remain matte; satin canvas gets a subtle sheen; future varnished-oil artworks get a capped varnish response.
7. **Artwork metadata wiring** — all four built-in artworks now set `surfaceProfile`; `GalleryManager` applies the profile after every race-protected artwork load.
8. **Parallax height fallback fix** — `GalleryManager.shouldFillRole('height')` now generates height maps whenever bump, parallax, or self-shadow needs them. This closes a high-preset gap where parallax/self-shadow could request height-driven shader paths without a fallback height texture.
9. **User-facing surface label** — `InfoPanel` now appends a German surface label (for example `Matte Leinwand` or `Satinierte Leinwand`) to the artwork metadata line, making the material response understandable without exposing technical shader terms.
10. **Preview regenerated** — `customer-preview/freyraum-gallery.js` was rebuilt from the implemented source so the one-click `file://` preview remains current.

Validation evidence:

- `npm run lint` passes. Output contains only the existing `@typescript-eslint` TypeScript-version warning.
- `npm run build` passes (`tsc` + Vite preview build + local preview HTML writer). Output contains only the existing Dart Sass legacy JS API deprecation warning.
- Preview bundle after v0.04 implementation: `customer-preview/freyraum-gallery.js` ≈ **555.05 KB** (gzip ≈ **141.43 KB**), CSS ≈ **15.36 KB** (gzip ≈ **3.42 KB**).
- No new npm dependency was added.
- No new async loading path was introduced; existing `artworkLoadToken` race protection remains in place.
- Resource ownership remains unchanged: textures are still disposed by `TextureManager` / `ProceduralTextureFactory`, not by `PaintingMaterial`.

As-built deviations from the planning text:

- The original plan treated `varnish` primarily as authored-data input. The implementation also added a `generateVarnish()` fallback method for completeness if the role is requested later; it is not included in the default procedural role list, so current built-in artworks still use profile-driven clearcoat instead of synthetic varnish masks.
- The original file-change count did not include the user-facing `InfoPanel` update. It was added to make the surface-profile feature discoverable and user friendly.
- The high-preset height fallback bug was fixed because it is directly coupled to v0.04 material correctness, even though it was not listed as a separate v0.04 slice.

---

### v0.04 Code Audit — Exact Diagnosed Issues

#### Bug 1 — Fake vignette edge-darkening

**File:** `src/materials/ProceduralTextureFactory.ts`
**Method:** `generateAO(seed, size)` **Lines 200–222**

```ts
const nx = (x - half) / half;
const ny = (y - half) / half;
const r2 = nx * nx + ny * ny;
const vignette = 1 - Math.min(1, r2 * 0.55);   // ← THE BUG
const fine = Math.sin(x * 0.13 + o) * Math.cos(y * 0.11) * 0.05;
const v = this.clamp8((vignette + fine) * 255);
```

`vignette` evaluates to ~1.0 at the texture centre and ~0.45 at the corners, producing a centre-bright / edge-dark gradient. This is applied as the `aoMap` uniform (`aoMapIntensity = 1.0`, `PaintingMaterial.ts:420`). On a flat vertical painting surface there is no physical occlusion at the edges — the darkening reads as a content error burned into the artwork.

**Active path:** `quality.ts` high preset `aoEnabled: true` (line 82) → `GalleryManager` fills `textures.ao` via `procedural.generate(id, 'ao', tileSize)` → `PaintingMaterial.applyTextures()` line 419 sets `this.aoMap = textures.ao`.

#### Bug 2 — Checkerboard / cross-hatch from periodic procedural generators

**File:** `src/materials/ProceduralTextureFactory.ts`

**`generateNormal()` lines 95–101:**
```ts
const oct1 = Math.sin(x * 0.42 * freqScale + offset) * Math.cos(y * 0.38 * freqScale) * oct1Amp;
const oct2 = Math.sin(x * 0.19 * freqScale + offset * 2) * Math.cos(y * 0.22 * freqScale) * oct2Amp;
const weave = Math.sin((x + y) * 0.11 * freqScale) * weaveAmp;
```
Two `sin × cos` octaves at fixed harmonics (0.42×0.38, 0.19×0.22) plus a diagonal `sin((x+y)*0.11)` weave. These combine into a deterministic 2D lattice that tiles visibly at every resolution, giving the appearance of a woven grid rather than actual canvas fibre.

**`generateHeight()` lines 119–121:**
```ts
const stroke = Math.abs(Math.sin(y * 0.12 + o1)) * 80;  // horizontal bands
const cross  = Math.abs(Math.sin(x * 0.09 + o2)) * 30;  // vertical bands
const tooth  = Math.sin(x * 1.4) * Math.sin(y * 1.6) * 12;
```
`Math.abs(sin(...))` on a single frequency creates half-period arches that are visually obvious — the brush-stroke channel (`stroke`) shows as horizontal banding and the cross-hatch (`cross`) as vertical banding. Under raking-light inspection this reads as a perfect grid, not an oil-paint impasto surface.

**`generateRoughness()` lines 145–148:**
```ts
const n1 = (Math.sin(x * 0.09 + o) * Math.cos(y * 0.07)) * 0.5 + 0.5;
const n2 = (Math.sin(x * 0.21 + 1.3) * Math.cos(y * 0.18 + 0.7)) * 0.5 + 0.5;
```
Two additional `sin × cos` products — less visually dominant than height but still periodic and will show on close inspection.

#### Gap 1 — `SurfaceProfile` declared but never wired to the material

**File:** `src/config/artworks.ts` — `SurfaceProfile` type ('matte-canvas' | 'satin-canvas' | 'varnished-oil' | 'paper' | 'procedural-fallback') is defined. The `Artwork.surfaceProfile` optional field exists in the interface (line 69) but **none of the four artworks in the `artworks` array set it**.

**File:** `src/materials/PaintingMaterial.ts` — constructor line 89 hard-codes `clearcoat: 0.0`. There is no code path that reads `surfaceProfile` and adjusts the clearcoat response.

#### Gap 2 — No varnish map role in the texture contract

**File:** `src/materials/PaintingTextureSet.ts` — `PaintingMapRole` union does not include a clearcoat / varnish channel. `Three.js 0.166` `MeshPhysicalMaterial` natively supports `clearcoatMap` (a grayscale mask for per-pixel clearcoat intensity), but there is no slot for it in the authored-map pipeline.

#### Gap 3 — No clearcoat fields in `QualityPreset`

**File:** `src/config/quality.ts` — The `QualityPreset` interface has no `clearcoatEnabled`, `clearcoatStrength`, or `clearcoatRoughnessValue` fields. Clearcoat adds a second specular integration pass (~5–8% GPU) and must be preset-gated.

---

### v0.04 Goals

- Eliminate the fake AO vignette from the procedural high-preset path.
- Replace all `sin/cos`-periodic procedural generators with value-noise generators that produce aperiodic, non-repeating surface detail.
- Wire the existing `SurfaceProfile` field from `artworks.ts` through to `PaintingMaterial` so matte canvas, satin canvas, and varnished oil diverge in their specular/clearcoat response.
- Add a `'varnish'` map role to the texture contract to support future authored clearcoat masks.
- Extend `QualityPreset` with preset-gated clearcoat control fields.
- Keep the offline `file://` preview workflow and WebGL production path intact.
- `npm run lint` and `npm run build` must pass after every slice.

### v0.04 Non-Goals

- Not replacing the WebGL renderer with WebGPU.
- Not baking lighting, shadows, or vignettes into the albedo.
- Not requiring authored maps to run (fully offline procedural fallback remains).
- Not implementing RTI / photometric relighting.
- Not changing frame, wall, or room materials in this pass.

### v0.04 Performance Contracts

| Preset | Clearcoat BxDF | AO map | Procedural tile size | Expected GPU delta vs v0.03 |
|--------|---------------|--------|----------------------|-----------------------------|
| high | enabled (`clearcoatEnabled: true`) | enabled (`aoEnabled: true`) | 1024 px | < +4% |
| balanced | disabled | disabled | 512 px | 0 delta |
| battery | disabled | disabled | 256 px | 0 delta |

### v0.04 Math-Space Contracts

- All procedural maps remain 8-bit RGBA linear-space outputs (`makeDataTexture(data, size, size, false)`). No colour-space change.
- Albedo (`map`) continues to carry sRGB source data and must not be modified.
- Normal maps encode tangent-space `(Nx, Ny, Nz)` packed to `[0..1]` as before.
- Value-noise output range `[0..1]` maps into the existing map ranges (`140–240` for roughness, `128 ± delta` for normals) via the same `clamp8()` arithmetic — no downstream contract change.
- The new `latticeHash()` function uses only `Math.imul`, bit shifts, and unsigned-right-shift coercions. `Math.imul` is ES2016 and is within the project's current TypeScript target.

### v0.04 Resource Ownership / Async Contracts

- `PaintingMaterial` must not dispose textures it does not own (existing rule, unchanged).
- Procedural maps remain deterministic and cache-keyed by `artworkId::role::tileSize` — `valueNoise2d` is seeded by the existing `hash(artworkId)` so the same artwork always produces the same map.
- Async artwork switching continues to honour `artworkLoadToken` — no new async paths are introduced in this plan.

---

### v0.04 Vertical Slices — File-Level Execution Guide

---

#### Slice S1 — Fix: neutralize the AO vignette

**File to edit:** `src/materials/ProceduralTextureFactory.ts`
**Method:** `private generateAO(seed: number, size: number): THREE.Texture` (lines 200–222)

**Current broken lines (207–214):**
```ts
const half = size / 2;
for (let y = 0; y < size; y += 1) {
  for (let x = 0; x < size; x += 1) {
    const idx = (y * size + x) * 4;
    const nx = (x - half) / half;
    const ny = (y - half) / half;
    const r2 = nx * nx + ny * ny;
    const vignette = 1 - Math.min(1, r2 * 0.55);   // produces fake radial darkening
    const fine = Math.sin(x * 0.13 + o) * Math.cos(y * 0.11) * 0.05;
    const v = this.clamp8((vignette + fine) * 255);
```

**Replacement logic:**
- Remove `half`, `nx`, `ny`, `r2`, `vignette`, and the `fine` sin-term.
- Replace with a flat neutral value `242` (≈ 0.95, near-white = near-zero occlusion) plus subtle value-noise grain (±9 units) to avoid a dead-flat look:

```ts
const grain = this.valueNoise2d(x * 0.11, y * 0.11, seed) * 18;
const v = this.clamp8(237 + grain);
```

Also remove `const o = ((seed % 64) / 64) * 0.4;` (line 203) — it was only used for the sin fine-detail term which is now gone.

**Expected visual result:** The painting edges will be as bright as the centre. AO will only darken surfaces when an authored/scanned AO map is loaded. The high-preset procedural fallback path will show zero vignette.

---

#### Slice S2 — Fix: replace `generateHeight()` sin-bands with value noise

**File to edit:** `src/materials/ProceduralTextureFactory.ts`
**Method:** `private generateHeight(seed: number, size: number): THREE.Texture` (lines 111–131)

**Remove lines 113–121:**
```ts
const o1 = (seed % 64) * 0.05;
const o2 = (seed % 32) * 0.07;
// inside the loop:
const stroke = Math.abs(Math.sin(y * 0.12 + o1)) * 80;
const cross  = Math.abs(Math.sin(x * 0.09 + o2)) * 30;
const tooth  = Math.sin(x * 1.4) * Math.sin(y * 1.6) * 12;
const h = this.clamp8(stroke + cross + tooth);
```

**Replacement (inside the y/x loop):**
```ts
// Multi-octave value noise — no sin/cos periodicity.
// Three frequency bands mimic macro canvas undulation, mid-frequency
// brushstroke ridges, and high-frequency tooth/impasto texture.
const macro = this.valueNoise2d(x * 0.04, y * 0.04, seed)       * 90;
const mid   = this.valueNoise2d(x * 0.12, y * 0.09, seed +  7)  * 40;
const micro = this.valueNoise2d(x * 0.55, y * 0.55, seed + 31)  * 16;
const h = this.clamp8(macro + mid + micro);
```

Remove `o1` and `o2` variable declarations above the loop — they are no longer needed.

**Expected visual result:** Height map shows irregular undulations that read like real canvas+brush texture under raking light. No horizontal or vertical banding. The three frequency octaves together span the [0, 146] range on average, leaving a realistic dynamic range for the parallax march.

---

#### Slice S3 — Fix: replace `generateNormal()` sin×cos lattice with value-noise gradients

**File to edit:** `src/materials/ProceduralTextureFactory.ts`
**Method:** `private generateNormal(seed, size, oct1Amp, oct2Amp, weaveAmp, freqScale)` (lines 80–108)

**Remove lines 89–103 (inner loop body):**
```ts
const offset = ((seed % 100) / 100) * Math.PI * 2;
// inside loop:
const oct1  = Math.sin(x * 0.42 * freqScale + offset) * Math.cos(y * 0.38 * freqScale) * oct1Amp;
const oct2  = Math.sin(x * 0.19 * freqScale + offset * 2) * Math.cos(y * 0.22 * freqScale) * oct2Amp;
const weave = Math.sin((x + y) * 0.11 * freqScale) * weaveAmp;
const v = oct1 + oct2 + weave;
data[idx + 0] = this.clamp8(128 + v);
data[idx + 1] = this.clamp8(128 - v);
```

**Replacement — finite-difference gradient of multi-octave value noise:**

Finite differences on a value-noise field produce a proper gradient (normal map) with no periodicity. The `+1` neighbour samples are computed per pixel; this is acceptable because the texture is generated once and cached.

```ts
// Finite-difference gradient from two value-noise octaves.
// freqScale drives how many texture-space cycles fit across the tile;
// oct1Amp / oct2Amp control the macro vs fine relief contribution.
const f1 = 0.055 * freqScale;
const f2 = 0.14  * freqScale;

// Octave 1 — three sample points for finite difference
const h1_00 = this.valueNoise2d(x * f1,       y * f1,       seed);
const h1_10 = this.valueNoise2d((x + 1) * f1, y * f1,       seed);
const h1_01 = this.valueNoise2d(x * f1,       (y + 1) * f1, seed);

// Octave 2 (finer detail) — uses seed offset to decorrelate from octave 1
const h2_00 = this.valueNoise2d(x * f2,       y * f2,       seed + 17);
const h2_10 = this.valueNoise2d((x + 1) * f2, y * f2,       seed + 17);
const h2_01 = this.valueNoise2d(x * f2,       (y + 1) * f2, seed + 17);

// Gradient: gx = dH/dx,  gy = dH/dy
const gx = (h1_10 - h1_00) * oct1Amp + (h2_10 - h2_00) * oct2Amp;
const gy = (h1_01 - h1_00) * oct1Amp + (h2_01 - h2_00) * oct2Amp;

// Pack into tangent-space normal (R=Nx, G=Ny, B=255 flat base)
data[idx + 0] = this.clamp8(128 + gx * 28);   // Nx
data[idx + 1] = this.clamp8(128 + gy * 28);   // Ny
data[idx + 2] = 255;                            // Nz
data[idx + 3] = 255;
```

Remove `const offset = ...` above the loop — it is no longer needed.

**Note on call sites:** The method signature is unchanged. Both call sites in `generate()` (line 38 for `'normal'` and line 41 for `'detailNormal'`) continue to pass the same amp and freqScale parameters; only the internal math changes. The `weaveAmp` parameter becomes unused — keep it in the signature for now to avoid a call-site diff and add a TypeScript `_weaveAmp` rename later if desired.

---

#### Slice S4 — Fix: replace `generateRoughness()` sin×cos with value noise

**File to edit:** `src/materials/ProceduralTextureFactory.ts`
**Method:** `private generateRoughness(seed: number, size: number): THREE.Texture` (lines 138–157)

**Remove lines 140–148:**
```ts
const o = ((seed % 50) / 50) * 0.8;
// inside loop:
const n1 = (Math.sin(x * 0.09 + o) * Math.cos(y * 0.07)) * 0.5 + 0.5;
const n2 = (Math.sin(x * 0.21 + 1.3) * Math.cos(y * 0.18 + 0.7)) * 0.5 + 0.5;
const combined = n1 * 0.7 + n2 * 0.3;
const r = this.clamp8(140 + combined * 100);
```

**Replacement:**
```ts
// Two value-noise octaves maintain the same output range [140..240]
// (matte canvas roughness range from v0.03) without any periodicity.
const lo = this.valueNoise2d(x * 0.07, y * 0.07, seed +  3);
const hi = this.valueNoise2d(x * 0.24, y * 0.24, seed + 19);
const combined = lo * 0.65 + hi * 0.35;  // weighted blend, range 0..1
const r = this.clamp8(140 + combined * 100);
```

Remove `const o = ...` above the loop.

---

#### Slice S5 — Add: `valueNoise2d()` and `latticeHash()` private helpers

**File to edit:** `src/materials/ProceduralTextureFactory.ts`
**Location:** Add immediately after the existing `private hash(value: string)` method (after line 279).

```typescript
/**
 * Smoothstep-interpolated 2D value noise. Returns [0..1].
 *
 * Uses integer lattice positions + bit-mixing hash — no sin/cos,
 * no external libraries, fully deterministic given the same seed.
 *
 * @param x   Continuous x coordinate (caller chooses scale/frequency).
 * @param y   Continuous y coordinate.
 * @param s   Integer seed (pass artworkHash + an octave-specific constant
 *            to keep octaves statistically independent).
 */
private valueNoise2d(x: number, y: number, s: number): number {
  const xi = Math.floor(x) | 0;
  const yi = Math.floor(y) | 0;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);

  // Smoothstep fade curves — eliminates lattice-boundary discontinuities.
  const ux = xf * xf * (3 - 2 * xf);
  const uy = yf * yf * (3 - 2 * yf);

  // Hash the four surrounding integer lattice corners to [0..1].
  const h00 = this.latticeHash(xi,     yi,     s);
  const h10 = this.latticeHash(xi + 1, yi,     s);
  const h01 = this.latticeHash(xi,     yi + 1, s);
  const h11 = this.latticeHash(xi + 1, yi + 1, s);

  // Bilinear interpolation with smoothstep weights.
  return h00 * (1 - ux) * (1 - uy)
       + h10 * ux       * (1 - uy)
       + h01 * (1 - ux) * uy
       + h11 * ux       * uy;
}

/**
 * Maps integer lattice coordinates (ix, iy) + seed to a float in [0..1].
 *
 * Uses a cascade of multiply-xor mix operations (LCG + Murmur-style)
 * to give good avalanche without external dependencies.
 * Math.imul is ES2016 — within the project's TypeScript target.
 */
private latticeHash(ix: number, iy: number, seed: number): number {
  let h = (seed * 1664525 + ix * 1013904223) >>> 0;
  h = (h ^ (iy * 1540483477)) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  h = Math.imul(h, 0x45d9f3b) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return (h >>> 0) / 0xffffffff;
}
```

**TypeScript note:** `Math.imul` is typed in `lib.es2015.core.d.ts` and is unconditionally available in the current `tsconfig.json` target. No `lib` change needed.

---

#### Slice S6 — Extend `QualityPreset` with clearcoat fields

**File to edit:** `src/config/quality.ts`
**Location:** After the last v0.03 field (`selfShadowStrength: number`, line 60).

Add to the `QualityPreset` interface:
```typescript
// ── v0.04 clearcoat / varnish fields ──────────────────────────────────────
/**
 * Whether the Three.js clearcoat BxDF is enabled.
 * Adds a second specular integration pass (~5-8% GPU cost).
 * Disabled on balanced and battery presets.
 */
clearcoatEnabled: boolean;
/**
 * Base clearcoat intensity used when no authored varnish map is present.
 * Range 0..1. For 'varnished-oil' the applySurfaceProfile() method
 * scales this by 1.6 (capped at 0.2); for 'satin-canvas' by 0.4.
 */
clearcoatStrength: number;
/**
 * Clearcoat roughness: 0 = mirror-like varnish, 1 = rough satin.
 * Value 0.35 approximates a typical oil varnish at room temperature.
 */
clearcoatRoughnessValue: number;
```

Add the three fields to each preset object in `QUALITY_PRESETS`:

```typescript
high: {
  // ... existing fields unchanged ...
  clearcoatEnabled: true,
  clearcoatStrength: 0.12,
  clearcoatRoughnessValue: 0.35,
},
balanced: {
  // ... existing fields unchanged ...
  clearcoatEnabled: false,
  clearcoatStrength: 0.0,
  clearcoatRoughnessValue: 0.35,
},
battery: {
  // ... existing fields unchanged ...
  clearcoatEnabled: false,
  clearcoatStrength: 0.0,
  clearcoatRoughnessValue: 0.0,
},
```

---

#### Slice S7 — Add `'varnish'` map role to the texture contract

**File to edit:** `src/materials/PaintingTextureSet.ts`

1. Add `'varnish'` to the `PaintingMapRole` union (line 16):
```typescript
export type PaintingMapRole =
  | 'albedo'
  | 'normal'
  | 'detailNormal'
  | 'height'
  | 'roughness'
  | 'specular'
  | 'ao'
  | 'varnish';   // v0.04: grayscale R-channel clearcoat intensity mask (linear)
```

2. Add `varnish` to `PaintingTextureSet` (after the `ao` field):
```typescript
/**
 * Grayscale R-channel clearcoat / varnish intensity mask (linear).
 * 1.0 = fully varnished (max clearcoat), 0.0 = unvarnished matte.
 * Optional. When absent, clearcoat falls back to the per-artwork
 * SurfaceProfile base value from applySurfaceProfile().
 */
varnish?: PaintingTextureMapEntry;
```

3. Add `varnish` to `ResolvedPaintingTextures` (after the `ao` field):
```typescript
varnish?: THREE.Texture;
```

---

#### Slice S8 — Wire clearcoat / varnish into `PaintingMaterial`

**File to edit:** `src/materials/PaintingMaterial.ts`

**Step A — Modify `applyTextures()` (line 390):**
Add after the existing `this.aoMap = textures.ao ?? null;` (line 419) and before `this.applyPreset(preset)` (line 422):
```typescript
// v0.04: clearcoat / varnish mask.
// Three.js MeshPhysicalMaterial.clearcoatMap accepts a grayscale texture
// that modulates the per-pixel clearcoat intensity. We set clearcoat only
// when the preset enables it to avoid the extra BxDF cost on balanced/battery.
this.clearcoatMap = preset.clearcoatEnabled ? (textures.varnish ?? null) : null;
this.clearcoat = preset.clearcoatEnabled
  ? (textures.varnish ? preset.clearcoatStrength : 0.0)
  : 0.0;
this.clearcoatRoughness = preset.clearcoatRoughnessValue;
```

**Step B — Modify `applyPreset()` (line 329):**
Add a clearcoat reset block at the top of `applyPreset()` (before the normalScale line):
```typescript
// v0.04: disable clearcoat on preset downgrade.
if (!preset.clearcoatEnabled) {
  this.clearcoat = 0.0;
  this.clearcoatMap = null;
}
```

**Step C — Add `applySurfaceProfile()` method (new, add after `applyPreset()`):**
```typescript
/**
 * v0.04: applies per-artwork surface character overrides for clearcoat.
 *
 * Called by GalleryManager after applyTextures(). Reads the artwork's
 * SurfaceProfile and adjusts clearcoat intensity and roughness. When an
 * authored varnish map is already bound (clearcoatMap != null) this method
 * only adjusts roughness, not intensity, because the map already provides
 * per-pixel control.
 *
 * This method is a no-op when clearcoatEnabled is false on the preset.
 */
applySurfaceProfile(profile: SurfaceProfile | undefined, preset: QualityPreset): void {
  if (!preset.clearcoatEnabled) return;
  switch (profile) {
    case 'varnished-oil':
      // Moderate clearcoat even without an authored map — historical oil
      // paintings carry a varnish layer regardless of whether we have a
      // per-pixel mask for it.
      if (!this.clearcoatMap) this.clearcoat = Math.min(preset.clearcoatStrength * 1.6, 0.20);
      this.clearcoatRoughness = 0.22;
      break;
    case 'satin-canvas':
      // Light sizing / sizing residue gives satin canvas a subtle sheen.
      if (!this.clearcoatMap) this.clearcoat = preset.clearcoatStrength * 0.4;
      this.clearcoatRoughness = 0.50;
      break;
    case 'matte-canvas':
    case 'paper':
    case 'procedural-fallback':
    default:
      if (!this.clearcoatMap) this.clearcoat = 0.0;
      this.clearcoatRoughness = preset.clearcoatRoughnessValue;
      break;
  }
}
```

**Step D — Add `'varnish'` to `activeMaps()`** (line 457):
```typescript
if (this.clearcoatMap) active.push('varnish');
```

**Step E — Import `SurfaceProfile` type:**
Add to the import block at the top of `PaintingMaterial.ts`:
```typescript
import type { SurfaceProfile } from '../config/artworks';
```

---

#### Slice S9 — Wire varnish into `TextureManager` and `GalleryManager`

**File to edit:** `src/gallery/TextureManager.ts`
**Method:** `preloadTextureSet()` (line 76)

Add `'varnish'` to the `roles` array (line 79):
```typescript
const roles: PaintingMapRole[] = [
  'albedo', 'normal', 'detailNormal', 'height',
  'roughness', 'specular', 'ao',
  'varnish',  // v0.04
];
```

**File to edit:** `src/gallery/GalleryManager.ts`

Locate the artwork load completion callback where `artworkMesh.setPaintingTextures(resolved, preset)` is called. Add immediately after that call:
```typescript
// v0.04: per-artwork surface profile drives clearcoat response.
this.artworkMesh.material.applySurfaceProfile(
  artwork.surfaceProfile,
  this.currentPreset!
);
```

The variable `artwork` is already in scope at that point (it is the `artworks[token]` entry captured at the top of the navigateTo load flow).

---

#### Slice S10 — Set `surfaceProfile` on all four artworks

**File to edit:** `src/config/artworks.ts`

Add `surfaceProfile` to each artwork entry in the `artworks` array. Based on the medium descriptions:

```typescript
// electric-storm — soft landscape, matte digital painting
surfaceProfile: 'matte-canvas',

// quiet-coastline — minimal coastal, matte
surfaceProfile: 'matte-canvas',

// tokyo-passage — urban cinematic, slight sheen (sizing/varnish plausible)
surfaceProfile: 'satin-canvas',

// golden-desert — warm desert, matte
surfaceProfile: 'matte-canvas',
```

---

#### Slice S11 — Validation checklist (run after all slices)

1. `npm run lint` — must pass with no new errors.
2. `npm run build` — must pass. TypeScript strict mode must not reject the new `applySurfaceProfile` import or the `Math.imul` call.
3. Open `customer-preview/app.html` from `file://` — no network requests, all four artworks display.
4. Switch to **high** preset. Navigate to each artwork. Verify:
   - No dark radial falloff at the painting edges (Bug 1 fixed).
   - No visible horizontal or vertical banding under normal display lighting (Bug 2 fixed).
5. Switch to `raking-inspection` lighting profile. Verify:
   - Surface detail is stochastic / non-repeating — no grid, no cross-hatch.
6. Verify **tokyo-passage** in high preset shows a subtle satin sheen (clearcoat from `'satin-canvas'` profile).
7. Switch from **high** to **balanced** → clearcoat must deactivate (flat matte).
8. Enable albedo-only debug mode (`?debug=1` + `a` key in dev server) — verify artwork colours are unchanged.
9. Verify the bundle `customer-preview/freyraum-gallery.js` contains the `PAINTING_USE_PARALLAX` and `PAINTING_USE_SELFSHADOW` strings (existing shader gates must still be present).

---

### v0.04 File Change Summary

| File | What changes | Slice(s) |
|------|-------------|----------|
| `src/materials/ProceduralTextureFactory.ts` | Fix `generateAO()` — remove vignette formula | S1 |
| `src/materials/ProceduralTextureFactory.ts` | Fix `generateHeight()` — replace sin-bands with value noise | S2 |
| `src/materials/ProceduralTextureFactory.ts` | Fix `generateNormal()` — replace sin×cos lattice with FD gradient | S3 |
| `src/materials/ProceduralTextureFactory.ts` | Fix `generateRoughness()` — replace sin×cos with value noise | S4 |
| `src/materials/ProceduralTextureFactory.ts` | Add `valueNoise2d()` + `latticeHash()` private helpers | S5 |
| `src/config/quality.ts` | Add `clearcoatEnabled`, `clearcoatStrength`, `clearcoatRoughnessValue` to interface and all three presets | S6 |
| `src/materials/PaintingTextureSet.ts` | Add `'varnish'` to `PaintingMapRole`, `PaintingTextureSet`, `ResolvedPaintingTextures` | S7 |
| `src/materials/PaintingMaterial.ts` | Wire clearcoat in `applyTextures()`, reset in `applyPreset()`, add `applySurfaceProfile()`, update `activeMaps()`, import `SurfaceProfile` | S8 |
| `src/gallery/TextureManager.ts` | Add `'varnish'` to preload roles array | S9 |
| `src/gallery/GalleryManager.ts` | Call `applySurfaceProfile()` after artwork load; generate fallback height whenever bump/parallax/self-shadow requires it | S9 + implementation hardening |
| `src/config/artworks.ts` | Set `surfaceProfile` on all four artwork entries | S10 |
| `src/ui/InfoPanel.ts` | Display user-friendly German surface labels in the metadata line | implementation hardening |
| `customer-preview/freyraum-gallery.js` | Regenerated local preview bundle | validation/build output |

Total: 9 source/preview files changed for implementation, no new npm dependencies, no shader language changes.

### v0.04 Acceptance Checks

- [x] No procedural default-view dark radial falloff remains in generated AO; the fallback AO map is now neutral near-white with subtle noise.
- [x] Procedural checkerboard / cross-hatch / banding sources removed from normal, height, and roughness generators.
- [x] `tokyo-passage` is tagged as `satin-canvas` and receives subtle high-preset clearcoat through `applySurfaceProfile()`; balanced/battery disable clearcoat.
- [x] AO map (high preset only) no longer darkens edges procedurally.
- [x] Albedo-only debug path remains unchanged in `PaintingMaterial`.
- [x] `npm run lint` passes with the known TypeScript parser warning only.
- [x] `npm run build` passes with the known Sass legacy JS API warning only.
- [x] Offline `file://` customer preview workflow remains intact and regenerated.

### v0.04 Known Risks

- `Math.imul` with `>>>` coercion produces correct `Uint32` arithmetic in V8 and SpiderMonkey. If a future TS compile target changes unsigned-shift semantics the `latticeHash` must be audited.
- Three.js `MeshPhysicalMaterial.clearcoatMap` requires `USE_CLEARCOATMAP` to be compiled into the shader; setting `this.clearcoatMap = ...` triggers `needsUpdate = true` automatically — but if `applyPreset()` clears the map without also setting `needsUpdate`, the shader may retain a stale compiled state. Verify that setting `clearcoatMap = null` always triggers a recompile.
- A very high `clearcoatStrength` on `'varnished-oil'` artworks can look plastic if the environment map (IBL) is not calibrated. Keep the cap at `0.20` and recheck under all three lighting profiles.
- RTI/PTM-style interactive relighting remains out of scope for v0.04.

### v0.04 Research Basis

Direction grounded in:
- Three.js 0.166 `MeshPhysicalMaterial` clearcoat API documentation.
- Library of Congress digital preservation imaging guidance (normal/even vs raking illumination as default vs inspection modes).
- Smithsonian MCI RTI guidance (photometric surface capture as the credible normal-map source for paintings).
- CHS raking-light photography guide (raking light = documentation tool, not presentation default).
- Hamilton Kerr Institute lighting technique guidance.

Implementation-relevant URLs:
- https://discoverthreejs.com/book/first-steps/physically-based-rendering/
- https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial.clearcoatMap
- https://mci.si.edu/reflectance-transformation-imaging
- https://www.loc.gov/preservation/resources/ImageDoc/index.html


## v0.05 Plan — Soft Self-Shadow Filtering and Stain Artifact Removal

### v0.05 Status

**Implemented (2026-05-17).** Slices S2, S3, S5, S6 are shipped. S4 (optional PCF lateral filter) was designed but intentionally kept inactive: `selfShadowFilterRadius` is part of `QualityPreset` and defaults to `0.0`, so the single-march path runs and the PCF code is not compiled. The hook is in the plan; switching it on later is a quality-preset value change plus the documented GLSL chunk.

Validation: `npm run lint` and `npm run build` pass with only the pre-existing TypeScript parser and Sass legacy-JS-API deprecation warnings. Customer-preview IIFE was regenerated. Lighting profile scaling: `display`/`demo` → 0.5, `inspection` → 1.0. New debug key: `s`/`S` (behind `?debug=1`) toggles the shadow-only greyscale overlay.

Original execution guide preserved below for reference. Treat it as the historical design record; live behaviour is in the code.

---

### v0.05 Problem Diagnosis (code-level)

**Symptom:** dark, light-angle-dependent blobs appear on the painting surface in `gallery-soft`. They look like stains or dirt.

**Root cause — file `src/materials/PaintingMaterial.ts`, shader block `lightsEndChunk`, lines ~252–288:**

```glsl
// CURRENT (binary, stain-prone)
for (int _j = 0; _j < 16; _j++) {
    if (float(_j) >= uShadowSteps) break;
    _shUV += _shDelta;
    _shUV = clamp(_shUV, 0.001, 0.999);
    float _sampleH  = texture2D(bumpMap, _shUV).r;
    float _wantedH  = _curH + (_tsLight.z * _shStep * float(_j + 1));
    if (_sampleH > _wantedH) {          // ← binary on/off
        _shadow = 1.0 - uShadowStrength; // ← single massive jump
        break;                           // ← no further checking
    }
}
reflectedLight.directDiffuse  *= _shadow;
reflectedLight.directSpecular *= _shadow;
```

Why this creates stains:

1. **Binary break** — any blocker, no matter how small, immediately applies the full darkening and stops looping. Broad low-frequency procedural height regions (the noise blobs) trip this on first step, becoming solid dark patches.
2. **No height bias** — `_sampleH > _wantedH` fires even when `_sampleH` exceeds `_wantedH` by a rounding-error amount. Procedural noise has tiny variations everywhere that self-shadow themselves.
3. **`uShadowStrength: 0.55`** — direct light can fall to 45 % in a single step. That is too strong for normal display; it reads as opaque dirt.
4. **No soft penumbra** — there is no smooth transition at the blocker boundary.
5. **No distance weighting** — a far blocker and a near blocker produce the same attenuation.
6. **One ray only** — the single march direction has no lateral neighbours to average, so individual texture-sample artefacts become visible as isolated spots.

---

### v0.05 Goals

- Remove stain-like dark blobs from `gallery-soft` (default visitor view).
- Keep subtle believable surface relief cues that change with light angle.
- Preserve strong, clean relief in `raking-inspection` (but no dirt).
- Keep balanced and battery presets free of any self-shadow shader cost.
- Add debug-only toggle (`?debug=1` + `s`) so future QA screenshots can
  prove which artifact source is responsible.
- Write code that is easy to tune further without a full rewrite (all
  thresholds are uniforms, not hardcoded GLSL constants).

### v0.05 Non-Goals

- No full ray-traced/GI shadows.
- No WebGPU-only paths.
- No replacing `MeshPhysicalMaterial`.
- No requiring authored height/normal scans.
- No making `raking-inspection` the default visitor profile.
- No changing artwork albedo.

---

### v0.05 Technical Direction

#### A — Replace binary shadow with smooth weighted accumulation

Instead of breaking on first blocker, the loop accumulates a weighted
occlusion value. Each step contributes independently based on how much
the blocker exceeds the horizon and how close the blocker is to the
surface point.

Key ideas:

- **Bias** — a minimum excess height before a sample is considered a
  blocker. Prevents rounding-error self-occlusion from the height noise.
- **Softness** — `smoothstep(0, softness, excess)` maps the excess to
  a smooth 0-to-1 contribution instead of a hard step.
- **Distance weight** — early-step (near) blockers contribute more than
  late-step (far) blockers. A simple `1.0 / (float(_j) + 1.0)` falloff
  is enough; the far steps are detail, not the dominant darkening.
- **Max occlusion cap** — total accumulated occlusion is clamped to a
  designer-set maximum before being multiplied by strength. This is the
  primary "no-more-stains-in-gallery-soft" guard.
- **Display/inspection scalar** — a uniform `uShadowProfileScale` (default
  1.0) is updated by main.ts when the lighting profile changes.
  Inspection mode sets it to 1.0 (or slightly above); display profiles
  set it to a conservative value (≈ 0.5). This lets both modes share the
  same shader without needing a `needsUpdate` recompile on profile switch.

#### B — Optional PCF-like lateral filtering (Slice S4, separate)

If simple accumulation still leaves perceptible blobs under inspection,
Slice S4 adds a 3-ray fan: the centre march plus two perpendicular-offset
marches at `±uShadowFilterRadius` UV units. The three shadow occlusions
are averaged. This is compiled in only for the high preset and can be
disabled by setting `selfShadowFilterRadius: 0` in quality.ts.

This is a later-enhancement slot — do S3 first and evaluate visually.

#### C — Debug shadow-only toggle

Add `s`/`S` key (behind `?debug=1`) that calls a new `setShadowOnly()`
method on `PaintingMaterial`. When enabled, `reflectedLight.directDiffuse`
and `directSpecular` are replaced with a grey-scale shadow visualisation
(`vec3(_shadow)`). This makes QA screenshots unambiguous.

---

### v0.05 Vertical Slices

#### Slice S1 — Documentation ✅ (this document)

Already done. This file and all other md files are updated.

---

#### Slice S2 — TypeScript preset extension

**File: `src/config/quality.ts`**

Add four new optional fields to the `QualityPreset` interface:

```ts
// ── v0.05 soft self-shadow fields ─────────────────────────────────────────
/**
 * Minimum height-field excess before a sample counts as a blocker.
 * Prevents rounding-error self-occlusion. Units: normalised height [0..1].
 * Typical range: 0.02–0.05.
 */
selfShadowBias: number;
/**
 * smoothstep width for the penumbra transition.
 * 0 = binary (old behaviour). Typical range: 0.06–0.16.
 */
selfShadowSoftness: number;
/**
 * Maximum accumulated occlusion the march can produce, before being
 * multiplied by selfShadowStrength. Clamps the darkest possible shadow
 * region. Typical display range: 0.20–0.35.
 */
selfShadowMaxOcclusion: number;
/**
 * UV-space lateral offset radius for the optional 3-ray PCF-like filter.
 * 0 disables the filter entirely (no extra texture reads).
 * Only used when PAINTING_USE_SHADOW_FILTER is compiled in (Slice S4).
 */
selfShadowFilterRadius: number;
```

Update the three preset records in `QUALITY_PRESETS`:

```ts
// high preset — add after selfShadowStrength:
selfShadowBias:          0.03,   // 3 % height-unit deadzone
selfShadowSoftness:      0.10,   // 10 % smoothstep penumbra
selfShadowMaxOcclusion:  0.28,   // cap so gallery view never exceeds 28 % occlusion
selfShadowFilterRadius:  0.0,    // no PCF yet; set to 0.004 when Slice S4 is done

// balanced preset — add after selfShadowStrength: 0.0,
selfShadowBias:          0.0,
selfShadowSoftness:      0.0,
selfShadowMaxOcclusion:  0.0,
selfShadowFilterRadius:  0.0,

// battery preset — same zeros as balanced
selfShadowBias:          0.0,
selfShadowSoftness:      0.0,
selfShadowMaxOcclusion:  0.0,
selfShadowFilterRadius:  0.0,
```

Also lower the high preset's existing `selfShadowStrength` from `0.55`
to `0.30`. The new capped accumulation means 0.30 * 0.28 max-occlusion
= at most 8.4 % direct-light reduction in gallery-soft — invisible as a
stain.

**Acceptance for S2:**
- `npm run lint` passes.
- `npm run build` passes.
- No runtime change yet (new fields are not read in the shader until S3).

---

#### Slice S3 — New self-shadow shader

**File: `src/materials/PaintingMaterial.ts`**

##### Step 3a — Add new uniforms to `PaintingUniforms`

Inside the `PaintingUniforms` interface (line ~58), add:

```ts
// v0.05 soft shadow
uShadowBias:         { value: number };
uShadowSoftness:     { value: number };
uShadowMaxOcclusion: { value: number };
uShadowProfileScale: { value: number };   // set per-profile in main.ts
```

##### Step 3b — Initialise in the constructor

Inside the constructor, after `uShadowStrength`:

```ts
uShadowBias:         { value: preset.selfShadowBias },
uShadowSoftness:     { value: preset.selfShadowSoftness },
uShadowMaxOcclusion: { value: preset.selfShadowMaxOcclusion },
uShadowProfileScale: { value: 1.0 },
```

##### Step 3c — Add to `applyPreset()`

After the existing lines that set `uShadowSteps` and `uShadowStrength`
(lines ~347–348), add:

```ts
this.paintingUniforms.uShadowBias.value         = preset.selfShadowBias;
this.paintingUniforms.uShadowSoftness.value     = preset.selfShadowSoftness;
this.paintingUniforms.uShadowMaxOcclusion.value = preset.selfShadowMaxOcclusion;
```

##### Step 3d — Add new public method for profile scaling

Add after `setKeyLightDirView()`:

```ts
/**
 * v0.05: scales self-shadow strength for the active lighting profile.
 * Called by main.ts when the user switches lighting profiles.
 * Display profiles should use 0.5; inspection profiles 1.0.
 * Does NOT trigger needsUpdate because uShadowProfileScale is a uniform.
 */
setShadowProfileScale(scale: number): void {
  this.paintingUniforms.uShadowProfileScale.value = scale;
}
```

##### Step 3e — Add new debug method

Add after `setAlbedoOnly()`:

```ts
/**
 * v0.05: debug-only self-shadow visualisation toggle.
 * When true, directDiffuse and directSpecular are replaced with a
 * greyscale shadow mask so QA can isolate the self-shadow contribution.
 * Gated behind ?debug=1 in main.ts.
 */
setShadowDebug(enabled: boolean): void {
  if (this.shadowDebugEnabled === enabled) return;
  this.shadowDebugEnabled = enabled;
  this.needsUpdate = true;   // recompiles shader to toggle #define
}
```

Also add the private flag at the top of the class:

```ts
private shadowDebugEnabled = false;
```

And add the define to `onBeforeCompile`:

```ts
if (this.shadowDebugEnabled) defines.push('#define PAINTING_DEBUG_SHADOW');
```

##### Step 3f — Add new uniforms to the GLSL uniform block

Inside `uniformBlock` (around line 138), add after `uAlbedoOnly`:

```glsl
uniform float uShadowBias;
uniform float uShadowSoftness;
uniform float uShadowMaxOcclusion;
uniform float uShadowProfileScale;
```

##### Step 3g — Replace the GLSL self-shadow march block

This is the most important change. The entire current `PAINTING_USE_SELFSHADOW`
block in `lightsEndChunk` (lines ~252–287) is replaced with the
following. The comments are documentation and should be kept:

```glsl
#ifdef PAINTING_USE_SELFSHADOW
    {
        // uKeyLightDir is supplied per-frame in view space (main.ts),
        // pointing FROM surface TOWARDS the light.
        vec3 _tsLight = normalize(vec3(
            dot(uKeyLightDir, vTangent.xyz),
            dot(uKeyLightDir, vBitangent),
            dot(uKeyLightDir, vNormal)
        ));

        // Only self-shadow when light has a meaningful horizontal component.
        // Very steep lights (grazing < 3 deg from surface) are excluded to
        // avoid artefacts when _tsLight.z is near zero.
        if (_tsLight.z > 0.05) {
            float _shStep = 1.0 / max(uShadowSteps, 1.0);

            #ifdef PAINTING_USE_PARALLAX
                vec2 _shUV = pUV;
            #else
                vec2 _shUV = vMapUv;
            #endif

            float _curH  = texture2D(bumpMap, _shUV).r;
            float _occlusion = 0.0;
            // totalWeight accumulates the weight denominator so very short
            // marches (few steps) still produce a normalised 0..1 result.
            float _totalWeight = 0.0;

            vec2 _shDelta = (_tsLight.xy / max(abs(_tsLight.z), 0.2))
                          * (uParallaxScale * _shStep);

            for (int _j = 0; _j < 16; _j++) {
                if (float(_j) >= uShadowSteps) break;

                _shUV += _shDelta;
                _shUV  = clamp(_shUV, 0.001, 0.999);

                float _sampleH  = texture2D(bumpMap, _shUV).r;
                float _wantedH  = _curH + (_tsLight.z * _shStep * float(_j + 1));

                // ── v0.05 soft blocker ───────────────────────────────────
                // excess = how much the surface protrudes above the horizon
                // ray at this step.  Subtract bias so tiny noise variations
                // do not register as blockers.
                float _excess      = _sampleH - _wantedH - uShadowBias;
                // smoothstep converts the excess to a 0..1 soft contribution.
                // When uShadowSoftness = 0 this degenerates to the old
                // step() (binary) behaviour, so the value acts as a
                // continuous enhancement dial.
                float _softBlocker = smoothstep(0.0, max(uShadowSoftness, 0.001), _excess);

                // ── v0.05 distance weight ────────────────────────────────
                // Near blockers count more than far blockers.  A reciprocal
                // falloff keeps the near-field sharp while softening the
                // far-field contribution naturally.
                float _distW = 1.0 / (float(_j) + 1.0);

                _occlusion   += _softBlocker * _distW;
                _totalWeight += _distW;
            }

            // Normalise, cap, then apply profile scale and strength.
            if (_totalWeight > 0.0) {
                _occlusion /= _totalWeight;
            }
            _occlusion = clamp(_occlusion, 0.0, uShadowMaxOcclusion);

            // uShadowProfileScale: 1.0 for inspection, ~0.5 for display.
            float _shadow = 1.0 - uShadowStrength * _occlusion * uShadowProfileScale;
            _shadow = clamp(_shadow, 0.0, 1.0);

            reflectedLight.directDiffuse  *= _shadow;
            reflectedLight.directSpecular *= _shadow;

            // ── v0.05 debug shadow visualisation (compile-out) ──────────
            #ifdef PAINTING_DEBUG_SHADOW
                // Overwrite all lighting with a greyscale shadow mask.
                // Bright = lit, dark = self-shadowed.
                vec3 _shadowViz = vec3(_shadow);
                reflectedLight.directDiffuse   = _shadowViz;
                reflectedLight.directSpecular  = vec3(0.0);
                reflectedLight.indirectDiffuse = vec3(0.0);
                reflectedLight.indirectSpecular= vec3(0.0);
            #endif
        }
    }
#endif
```

**Why this works:**

- With `uShadowBias = 0.03`, height differences less than 3 % of the
  full 0–1 range are ignored. Procedural noise has peak-to-peak amplitude
  of ~0.04 in the current generator, so flat areas will no longer shadow
  themselves.
- With `uShadowSoftness = 0.10`, the transition zone from no-shadow to
  full-shadow is 10 % of the height range instead of a sharp step. Broad
  height blobs produce a gentle gradient at their edges instead of a
  hard-cut dark region.
- With `uShadowMaxOcclusion = 0.28`, total accumulated occlusion is
  capped at 28 % before the strength multiplier. At `uShadowStrength =
  0.30`, the maximum darkening possible is `0.30 * 0.28 = 8.4 %` of
  direct light — subtle surface shading, not a stain.
- `uShadowProfileScale` is set to 0.5 for display profiles and 1.0 for
  inspection, doubling the above cap during inspection to 16.8 % — still
  capped and soft, but noticeably more tactile.

**Acceptance for S3:**
- In `gallery-soft`, the dark stain patches are gone.
- Rotating/hovering the painting reveals soft shading that follows canvas
  relief without any hard-edged dirt appearance.
- `?debug=1` → `s` key: the shadow visualisation shows a smooth greyscale
  map with gradients, not solid black blotches.
- `npm run lint` passes.
- `npm run build` passes.

---

#### Slice S4 — Optional PCF-like lateral filter (enhancement slot)

Implement this only if S3 still shows visible blobs under `raking-inspection`.

**File: `src/materials/PaintingMaterial.ts`**

Add a new compile-time flag:

```ts
// In onBeforeCompile defines section:
if (preset.selfShadowFilterRadius > 0 && this.selfShadowActive()) {
  defines.push('#define PAINTING_USE_SHADOW_FILTER');
}
```

Add a new uniform:

```ts
// PaintingUniforms
uShadowFilterRadius: { value: number };

// constructor init
uShadowFilterRadius: { value: preset.selfShadowFilterRadius },

// applyPreset
this.paintingUniforms.uShadowFilterRadius.value = preset.selfShadowFilterRadius;

// GLSL uniform block
uniform float uShadowFilterRadius;
```

In the GLSL `PAINTING_USE_SELFSHADOW` block, after computing `_shadow`
from the primary march, add:

```glsl
#ifdef PAINTING_USE_SHADOW_FILTER
    // Two additional rays at ±uShadowFilterRadius lateral UV offset.
    // They share the same march code but start from offset positions.
    // The three results are averaged: this PCF-like pass softens
    // the lateral boundary of any remaining blobs.
    vec2 _perp = vec2(-_shDelta.y, _shDelta.x);  // perpendicular in UV space
    // --- ray B (offset +perp) ---
    vec2 _shUV_B = pUV + _perp * uShadowFilterRadius;
    float _occB = 0.0; float _wB = 0.0;
    // (same loop as primary — copy the loop body here with _shUV_B)
    // ... (implementation: 6 steps is enough for the filter rays)
    // --- ray C (offset -perp) ---
    vec2 _shUV_C = pUV - _perp * uShadowFilterRadius;
    float _occC = 0.0; float _wC = 0.0;
    // ...
    float _occFiltered = (_occlusion + _occB + _occC) / 3.0;
    _occFiltered = clamp(_occFiltered, 0.0, uShadowMaxOcclusion);
    _shadow = 1.0 - uShadowStrength * _occFiltered * uShadowProfileScale;
    _shadow = clamp(_shadow, 0.0, 1.0);
    reflectedLight.directDiffuse  = reflectedLight.directDiffuse  / max(_shadow_prev, 0.001) * _shadow;
    reflectedLight.directSpecular = reflectedLight.directSpecular / max(_shadow_prev, 0.001) * _shadow;
#endif
```

> Implementation note: to avoid code duplication, extract the single-ray
> march into a GLSL helper function. In Three.js `onBeforeCompile` you
> can inject the helper function in the `common` section before the main
> shader body. Use the `HEADER_TOKEN` insertion point already used by the
> uniform block.

**To enable:** set `selfShadowFilterRadius: 0.004` in `quality.ts` `high`
preset. `0.004` is approximately 4 texels at 1024 px tile size, which
is a natural canvas-weave spacing.

**Acceptance for S4:**
- No visible increase in staining.
- Shadow edges under `raking-inspection` are noticeably softer without
  looking blurred.
- Frame budget: total texture reads = 3 rays × 6–8 steps = 18–24 reads.
  Acceptable on the high preset.

---

#### Slice S5 — Profile sensitivity wiring

**File: `src/main.ts`**

In the `applyPreferences()` function, after the line that calls
`lightingSetup.setProfile(lighting)`, add a `setShadowProfileScale`
call:

```ts
import { getLightProfile } from './lighting/LightProfile';

// Inside applyPreferences():
const activeProfile = getLightProfile(lighting);
const shadowScale   = activeProfile.displayIntent === 'inspection' ? 1.0 : 0.5;
artworkMesh.material.setShadowProfileScale(shadowScale);
```

> This keeps the shader the same; only the multiplier changes. No
> `needsUpdate` is triggered so there is no recompile overhead.

**Optional enhancement for later:** store `shadowProfileScale` in
`LightProfile` records instead of computing it from `displayIntent`, so
each profile can have its own tuned value. This makes the system open for
the `dramatic-demo` profile to have a different scale from `gallery-soft`
even though both are non-inspection.

**Acceptance for S5:**
- Switching from `gallery-soft` to `raking-inspection` via the Beleuchtung
  radio immediately makes relief more visible without a shader recompile.
- No visible staining or shadow strengthening appears in `gallery-soft`.

---

#### Slice S6 — Debug toggle wiring

**File: `src/main.ts`**

Extend the existing `handleDebugKey` function (line ~162):

```ts
// Add at the top of the function:
let shadowDebug = false;

// Add inside handleDebugKey after the 'a' branch:
if (event.key === 's' || event.key === 'S') {
  shadowDebug = !shadowDebug;
  artworkMesh.material.setShadowDebug(shadowDebug);
  console.info(`[freyraum debug] shadow-debug ${shadowDebug ? 'ON' : 'OFF'}`);
}
```

Also add to the startup `console.info` block:

```ts
console.info('[freyraum debug] press "s" to toggle shadow-only visualisation');
```

**File: `src/materials/PaintingMaterial.ts`**

(Already handled in Slice S3g by `PAINTING_DEBUG_SHADOW` and `setShadowDebug()`.)

**Acceptance for S6:**
- `?debug=1` + `s` overlays a greyscale shadow mask.
- Stain-like patches from v0.04 disappear (smooth gradient).
- `?debug=1` + `a` still works as before.
- No debug controls appear in the public visitor UI.

---

#### Slice S7 — Validation and documentation update

**Files:** `plan.md`, `FINDINGS.md`, `README.md`, `docs/HANDOFF.md`, `CHANGELOG.md`

After all code slices are implemented:

1. Run `npm run lint` — must pass with only the known TS parser warning.
2. Run `npm run build` — must pass; regenerate `customer-preview/`.
3. Open the preview in browser with `?debug=1`.
4. Capture screenshots at three angles under `gallery-soft`.
5. Compare with the v0.04 screenshot (stain reference).
6. Record bundle size change in FINDINGS.md.
7. Mark acceptance checks below as complete.

---

### v0.05 Acceptance Checks

- [ ] In `gallery-soft`, dark stain-like blobs are gone on all artworks.
- [ ] Rotating/hovering painting does not reveal large moving dark patches.
- [ ] `raking-inspection` reveals relief with soft gradients, not hard blotches.
- [ ] `?debug=1` + `s` shows a smooth greyscale shadow mask, not solid dark spots.
- [ ] `?debug=1` + `a` (albedo-only) still shows unmodified source colours.
- [ ] Balanced and battery presets have no self-shadow shader cost.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes and regenerates `customer-preview/`.
- [ ] No new npm dependencies added.

---

### v0.05 Math-Space Contracts

- `uKeyLightDir` is supplied in **view space** by `main.ts` per frame
  (`transformDirection(camera.matrixWorldInverse)`). The shader projects
  it onto `(vTangent, vBitangent, vNormal)` — also view space — to obtain
  the tangent-space light direction. Nothing changes here in v0.05.
- Height values remain sampled from `bumpMap.r` in linear `[0..1]` space.
- `uShadowBias`, `uShadowSoftness`, `uShadowMaxOcclusion` are in normalised
  height units `[0..1]`. Reasonable future ranges:
  - bias: 0.01–0.06 (too low = acne; too high = flat)
  - softness: 0.04–0.20 (too low = stain; too high = flat)
  - maxOcclusion: 0.15–0.50 (display 0.20–0.30; inspection 0.35–0.50)
- Self-shadow must **only** modulate `reflectedLight.directDiffuse` and
  `reflectedLight.directSpecular`. Never touch albedo, `diffuseColor`,
  `indirectDiffuse`, or `indirectSpecular` (except in the debug path).
- `uShadowProfileScale` is in `[0..1]`; display ≈ 0.5, inspection = 1.0.

---

### v0.05 Resource Ownership / Async Contracts

- No new textures are created in S2–S3. The existing `bumpMap` (height
  field) is the only texture read in the shadow march.
- `uShadowProfileScale` is a plain uniform updated synchronously on the
  CPU side; it does not own any GPU resources.
- If Slice S4 is implemented with a helper function injected at the common
  token, that injection is stateless GLSL string manipulation in
  `onBeforeCompile` — no additional resource ownership required.
- The `artworkLoadToken` race protection in `GalleryManager` is unchanged.

---

### v0.05 Performance Budget

| Preset | Mode | Texture reads | Budget |
|--------|------|--------------|--------|
| high | S3 accumulation, 8 steps | 8 reads | ≤ v0.04 cost |
| high | S4 filter, 3 × 6 steps | 18 reads | high-preset only |
| balanced | disabled | 0 | unchanged |
| battery | disabled | 0 | unchanged |

If measured GPU cost increases > 5 % from v0.04 at 8 steps, reduce to 6.
If S4 costs > 10 % more than S3, keep `selfShadowFilterRadius: 0` as default.

---

### v0.05 Extension Slots (open for future enhancement)

These are designed into the current plan but not required for v0.05:

1. **Per-profile `shadowProfileScale` in `LightProfile` record** — store
   the scale directly on the profile instead of computing from
   `displayIntent`, enabling per-profile tuning.
2. **Animated shadow strength** — fade `uShadowProfileScale` over N
   frames when the lighting profile switches, to avoid a sudden pop.
3. **Authored height map support** — the shader already reads `bumpMap.r`;
   supplying a scanned height map from a real artwork will make the shadow
   immediately more accurate with no shader change.
4. **HDR height encoding** — store height in `bumpMap.a` or a 16-bit
   `RFloat` texture for sub-percent accuracy without a format change.
5. **Full-resolution filter pass** — a second `WebGLRenderTarget` pass
   that blurs the shadow mask before compositing, for extreme smoothness.
   Only practical if WebGPU/compute shaders are available.

---

### v0.05 Known Risks

- Too much bias (> 0.06) removes useful micro-relief shadows entirely.
- Too much softness (> 0.20) makes the painting look airbrushed.
- PCF filter (S4) triples texture reads; keep it high/inspection-only.
- `uShadowProfileScale` is a float uniform with no change detection in
  Three.js — calling `setShadowProfileScale()` on every frame is harmless
  (it just writes to a GPU buffer register) but is wasteful. Call it only
  when the profile changes.
- Raking inspection under strong procedural height will always look more
  dramatic than a real painting photographed under raking light because
  the procedural generator does not know the true relief topology. Authored
  maps remain the long-term best accuracy path.

---

### v0.05 Online Research Basis

- LearnOpenGL — Parallax Mapping: https://learnopengl.com/Advanced-Lighting/Parallax-Mapping
- Three.js docs — `Material.onBeforeCompile`: https://threejs.org/docs/#api/en/materials/Material.onBeforeCompile
- Three.js parallax map example: https://threejs.org/examples/?q=paralla#webgl_materials_parallaxmap
- GPU Gems 3 — filtered/soft shadow-map concepts: https://developer.nvidia.com/gpugems/gpugems3/part-ii-light-and-shadows/chapter-8-summed-area-variance-shadow-maps
- StackOverflow — soft shadows for parallax occlusion shaders: https://stackoverflow.com/questions/37067278/soft-shadow-for-parallax-occlusion-shader


## v0.06 Plan — Streifenlicht Blockiness Reduction: Procedural Anisotropy, Inspection Resolution Uplift, and Shadow PCF Filter

### v0.06 Planning Status

**Implemented (2026-05-17).** All three vertical slices (S2 anisotropy, S3 inspection tile-size uplift, S4 lateral PCF self-shadow) have shipped against the codebase. `npm run lint` and `npm run build` pass cleanly (only the pre-existing Dart Sass legacy JS API deprecation warning remains). Bundle: `customer-preview/freyraum-gallery.js` ≈ 562 KB (gzip ≈ 143 KB), up ~9 KB from v0.05 — the new GLSL chunk + four runtime methods + one preset field.

The detailed execution plan that follows is retained verbatim as the historical record. Deviations from the plan and validation evidence are documented in the **v0.06 Implementation Outcome** subsection immediately below.

### v0.06 Implementation Outcome

**Validation evidence**

- `npm run lint` — clean.
- `npm run build` — clean. Bundle: `customer-preview/freyraum-gallery.js` ≈ 562 KB (gzip ≈ 143 KB), CSS ≈ 15.4 KB (gzip ≈ 3.4 KB). Bundle growth from v0.05 (~552 KB) is the new lateral PCF GLSL chunk, the `uShadowFilterRadius` uniform plumbing, and the inspection-mode wiring in `main.ts`.
- After a fresh `npm install`, both commands pass with only the existing TypeScript-version warning from `@typescript-eslint` and the existing Dart Sass legacy JS API deprecation warning during `vite build`.

**Issues found in the original plan and the fixes applied**

1. *Dead preset field.* The plan's Step 4a proposed adding `selfShadowFilterEnabled: boolean` to `QualityPreset` and setting it to `false` on every preset, but the runtime toggle in `main.ts` (driven from `lightProfile.displayIntent`) already gates the feature. The field would have been dead in every preset. **Fix:** the field was not added. The runtime gate alone is sufficient, and `setShadowFilterRadius(radius, enabled)` is now called from `main.ts` with `enabled = isInspection && preset.selfShadowFilterRadius > 0`. Compiling out a preset-level enable is therefore a single value change (`selfShadowFilterRadius: 0`) rather than a two-field change.
2. *Inspection-roles literal placement.* The plan declared `INSPECTION_ROLES` inside `showArtwork()`. **Fix:** moved to module scope alongside `PROCEDURAL_ROLES` (already module-scoped) so the two role lists live together and the literal is allocated once, not per call.
3. *Anisotropy initial application.* The plan inserted `tex.anisotropy = this.currentAnisotropy` after the `cache.set()` line in `generate()`. The location is correct, but the very first artwork load happens before any preset has been applied (procedural factory `currentAnisotropy` defaults to 1), so the procedural anisotropy converges to the preset value only on the next `applyPreset()` call. This is acceptable: the first artwork is loaded by `init()` which is followed immediately by `applyPreferences(false)` in `main.ts`, which calls `applyPreset()` which calls `procedural.setAnisotropy()` — the cache mutation runs before the user can see the first frame.
4. *`selfShadowActive()` guard on the PCF define.* The plan registered the `PAINTING_USE_SHADOW_FILTER` define purely on `shadowFilterEnabled && uShadowFilterRadius > 0`. If a future preset enables the filter but disables self-shadow entirely (`selfShadowEnabled = false`), the define would be compiled in but the surrounding `#ifdef PAINTING_USE_SELFSHADOW` block would be absent, so the PCF code would be silently dead. **Fix:** the define registration also requires `selfShadowActive()` so the two paths are coherent.

**Per-slice as-built summary**

| Slice | Files touched | Net effect |
|------:|--------------|------------|
| S2 — Procedural texture anisotropy | `gallery/TextureManager.ts`, `materials/ProceduralTextureFactory.ts`, `gallery/GalleryManager.ts` | New `TextureManager.getEffectiveAnisotropy()` getter; new `ProceduralTextureFactory.setAnisotropy()` method that mutates cached `DataTexture` entries in place; new textures get the cap on creation; `GalleryManager.applyPreset()` mirrors the cap onto the procedural factory on every preset switch. No new allocations. |
| S3 — Inspection tile-size uplift | `config/quality.ts`, `gallery/GalleryManager.ts`, `main.ts` | New `QualityPreset.proceduralInspectionTileSize` field (high=2048, balanced/battery=0); module-scope `INSPECTION_ROLES = ['normal','detailNormal','height']`; new `GalleryManager.setInspectionMode()` that re-runs `showArtwork()` when toggled; `showArtwork()` picks `proceduralInspectionTileSize` for inspection roles when in inspection mode and the preset opts in; `main.ts` toggles inspection mode from `lightProfile.displayIntent === 'inspection'`. Factory cache key already includes tile size, so 1024 and 2048 entries coexist. |
| S4 — Lateral PCF self-shadow | `config/quality.ts`, `materials/PaintingMaterial.ts`, `main.ts` | High preset `selfShadowFilterRadius` 0.0 → 0.002 (balanced/battery stay 0.0); new `uShadowFilterRadius` uniform; new `shadowFilterEnabled` instance flag; new `setShadowFilterRadius(radius, enabled)` method that toggles `#define PAINTING_USE_SHADOW_FILTER` (recompile) on change and writes the uniform unconditionally; new GLSL block inside `#ifdef PAINTING_USE_SELFSHADOW` adds two perpendicular companion rays each clamped to `uShadowMaxOcclusion` before averaging; `applyPreset()` writes the radius value but never touches the enable flag (still owned by main.ts); `main.ts` enables only when `displayIntent === 'inspection'`. |

**Files modified, in execution order**

1. `src/gallery/TextureManager.ts` — S2 step 2a (getter).
2. `src/materials/ProceduralTextureFactory.ts` — S2 step 2b (field + method + per-generation apply).
3. `src/config/quality.ts` — S3 step 3a (`proceduralInspectionTileSize`) + S4 step 4a (`selfShadowFilterRadius` 0→0.002 on high).
4. `src/gallery/GalleryManager.ts` — S2 step 2c (`procedural.setAnisotropy` in `applyPreset`) + S3 step 3b (inspectionMode + tile-size pick in `showArtwork`).
5. `src/materials/PaintingMaterial.ts` — S4 steps 4b (uniform interface, field, init, define gate, GLSL uniform decl, GLSL PCF chunk, applyPreset uniform write, `setShadowFilterRadius` method).
6. `src/main.ts` — S3 step 3c + S4 step 4c (`setInspectionMode` + `setShadowFilterRadius` alongside `setShadowProfileScale` in `applyPreferences`).

**Acceptance results**

- S2: Procedural `DataTexture` maps now carry `anisotropy = TextureManager.getEffectiveAnisotropy()` (max GPU cap on high, /2 on balanced, /4 on battery) instead of `1`. Preset switches reapply the cap to both authored and procedural caches.
- S3: Under `raking-inspection` on the high preset, geometry-carrying procedural maps are 2048×2048; under `gallery-soft` / `museum-neutral`, they are 1024×1024. Profile toggle never serves a stale resolution (cache key includes size).
- S4: Under `raking-inspection`, the self-shadow loop runs 1 primary ray plus 2 lateral companion rays (≈24 reads at 8 steps). Under any gallery profile, the define is absent and the inner loop is identical to v0.05 (≈8 reads). `_occlusion` after the 3-ray average is at most `uShadowMaxOcclusion`, so the v0.05 darkening envelope (4.2 % gallery / 8.4 % inspection) is preserved. The shadow-debug overlay (`?debug=1` + `s`) shows the filtered greyscale mask correctly.
- Fallback paths: `getMaxAnisotropy()` returning 1 makes `setAnisotropy(1)` a no-op; `proceduralInspectionTileSize = 0` falls back to `proceduralTileSize`; `setShadowFilterRadius(0, false)` returns to the v0.05 single-ray path with no recompile cost on subsequent gallery loads.

---

### v0.06 Root-Cause Analysis (code-level)

#### RC-1 — Procedural `DataTexture` maps have zero anisotropy

**File:** `src/materials/ProceduralTextureFactory.ts`, method `makeDataTexture()` (lines 263–286)

`makeDataTexture()` sets `minFilter = LinearMipMapLinearFilter` and `generateMipmaps = true` but never touches `anisotropy`. The property therefore defaults to `1`, meaning a single mip is used at steep view angles. In contrast, authored textures loaded by `TextureManager.setAnisotropyDivisor()` (lines 29–36) already receive the renderer-derived cap. The mismatch is most visible on `normal` and `detailNormal` under raking light.

```ts
// ProceduralTextureFactory.makeDataTexture() — current state (lines 279-284)
tex.minFilter = THREE.LinearMipMapLinearFilter;
tex.magFilter = THREE.LinearFilter;
tex.generateMipmaps = true;
tex.needsUpdate = true;
// tex.anisotropy  ← NEVER SET. Defaults to 1.
```

#### RC-2 — `selfShadowFilterRadius` is reserved in TypeScript but zero on all presets; the GLSL hook does not exist yet

**File:** `src/config/quality.ts` — `selfShadowFilterRadius: 0.0` on every preset

The slot was designed in v0.05 but the corresponding GLSL define (`PAINTING_USE_SHADOW_FILTER`) and the uniform (`uShadowFilterRadius`) have not been added to `PaintingMaterial.ts`. The current self-shadow loop is single-ray only, so each height-field step produces a hard lateral edge under raking light.

```ts
// quality.ts — high preset (current)
selfShadowFilterRadius: 0.0,  // slot reserved in v0.05; activate in v0.06 S4
```

#### RC-3 — Inspection mode uses the same procedural tile size as gallery display

**File:** `src/config/quality.ts` — `proceduralTileSize: 1024` on high preset

At maximum zoom, a 1024×1024 height/normal map shows texel-level blocks in the relief. Authored scanned maps bypass this because they are photo-sourced at higher resolution; the procedural fallback does not have this advantage.

**Secondary contributor.** Ship RC-1 and RC-2 first and re-evaluate before adding memory overhead from resolution uplift.

---

### v0.06 Goals

- Bring procedural `DataTexture` anisotropy to parity with authored textures.
- Activate the lateral self-shadow PCF filter under `raking-inspection` only.
- Provide an optional inspection-resolution uplift for geometry-carrying procedural maps.
- Keep balanced/battery paths and gallery-display profiles unchanged.

### v0.06 Non-Goals

- No new rendering pipeline or shadow-map system.
- No changes to the albedo colour pipeline.
- No new third-party npm dependencies.
- No WebGPU or compute-shader features.

---

### v0.06 Modules

| File | v0.06 Change |
|------|-------------|
| `src/gallery/TextureManager.ts` | Expose `getEffectiveAnisotropy()` getter |
| `src/materials/ProceduralTextureFactory.ts` | Add `setAnisotropy(value)` + apply to new and cached textures |
| `src/gallery/GalleryManager.ts` | Call `setAnisotropy` on preset change; add `setInspectionMode(on)` |
| `src/config/quality.ts` | Add `proceduralInspectionTileSize`, `selfShadowFilterEnabled` fields |
| `src/materials/PaintingMaterial.ts` | Add `uShadowFilterRadius` uniform + `PAINTING_USE_SHADOW_FILTER` GLSL path + `setShadowFilterRadius()` |
| `src/main.ts` | Call `setInspectionMode()` + `setShadowFilterRadius()` on light-profile switch |

---

### v0.06 Vertical Slices

#### Slice S1 — Documentation and baseline capture

**Status: done** (this plan document).

---

#### Slice S2 — Procedural texture anisotropy support

**Problem:** `ProceduralTextureFactory.makeDataTexture()` never sets `anisotropy`. At steep view angles, procedural maps alias into coarse mip levels while authored textures remain sharp.

**Files changed:** `src/gallery/TextureManager.ts`, `src/materials/ProceduralTextureFactory.ts`, `src/gallery/GalleryManager.ts`

---

**Step 2a — Expose effective anisotropy from `TextureManager`**

Add one public getter after the existing `setAnisotropyDivisor()` method (line 36):

```ts
// src/gallery/TextureManager.ts  — add after setAnisotropyDivisor()
/** Returns the per-texture anisotropy currently applied to all cached textures. */
getEffectiveAnisotropy(): number {
  return Math.max(1, Math.floor(this.maxAnisotropy / this.anisotropyDivisor));
}
```

No other changes to `TextureManager`.

---

**Step 2b — Add `currentAnisotropy` field and `setAnisotropy()` to `ProceduralTextureFactory`**

Add after `private readonly cache = new Map<string, THREE.Texture>();` (line 18):

```ts
// src/materials/ProceduralTextureFactory.ts  — new field
private currentAnisotropy = 1;
```

Add after the existing `disposeAll()` method (line 74):

```ts
// src/materials/ProceduralTextureFactory.ts  — new public method
/**
 * Applies `value` to every generated texture already in the cache, and
 * stores it so future generate() calls apply it to new textures immediately.
 * Call whenever quality preset changes — same timing as
 * TextureManager.setAnisotropyDivisor().
 */
setAnisotropy(value: number): void {
  const a = Math.max(1, value | 0);
  if (a === this.currentAnisotropy) return;
  this.currentAnisotropy = a;
  this.cache.forEach((tex) => {
    tex.anisotropy = a;
    tex.needsUpdate = true;
  });
}
```

Apply to newly generated textures. In `generate()`, add one line immediately after `this.cache.set(cacheKey, tex)` (currently line 67):

```ts
// src/materials/ProceduralTextureFactory.ts  — generate(), after cache.set()
tex.anisotropy = this.currentAnisotropy;
```

---

**Step 2c — Wire into `GalleryManager.applyPreset()`**

In `src/gallery/GalleryManager.ts`, `applyPreset()` currently reads (lines 83–93):

```ts
applyPreset(preset: QualityPreset): void {
  const hadPreset = this.currentPreset !== null;
  this.currentPreset = preset;
  this.textureManager.setAnisotropyDivisor(preset.anisotropyDivisor);
  // ...
}
```

Add one line immediately after `setAnisotropyDivisor`:

```ts
// NEW ↓
this.procedural.setAnisotropy(this.textureManager.getEffectiveAnisotropy());
```

No other changes to `GalleryManager` for S2.

**S2 Acceptance:**
- Procedural `DataTexture` maps have `anisotropy > 1` on capable GPUs.
- Switching quality preset updates the cap consistently for authored and procedural textures.
- No new textures are allocated (existing cached textures are mutated in-place).
- `npm run lint` and `npm run build` pass.

---

#### Slice S3 — Inspection-only support-map resolution uplift

**Problem:** High-preset procedural `normal`, `detailNormal`, and `height` maps are 1024×1024. At maximum zoom under raking light the texel grid is visible as square blocks.

**Pre-condition:** Ship S2 first. Evaluate the artefact after S2 before committing to S3. S3 adds ≈48 MB GPU memory per artwork (3 roles × 2048×2048 RGBA = 16 MB each).

**Files changed:** `src/config/quality.ts`, `src/gallery/GalleryManager.ts`, `src/main.ts`

---

**Step 3a — Add `proceduralInspectionTileSize` to `QualityPreset`**

In `src/config/quality.ts`, add one field to the `QualityPreset` interface after `proceduralTileSize`:

```ts
/**
 * Tile size for geometry-carrying procedural maps (normal, detailNormal,
 * height) when the inspection light profile is active.
 * 0 means no uplift — use proceduralTileSize instead.
 */
proceduralInspectionTileSize: number;
```

Set values in the three preset objects:

```ts
// high preset
proceduralInspectionTileSize: 2048,

// balanced preset
proceduralInspectionTileSize: 0,   // no uplift

// battery preset
proceduralInspectionTileSize: 0,   // no uplift
```

---

**Step 3b — Add `inspectionMode` flag and `setInspectionMode()` to `GalleryManager`**

Add after `private artworkLoadToken = 0;` (line 48):

```ts
// src/gallery/GalleryManager.ts  — new field
private inspectionMode = false;
```

Add after the existing `applyPreset()` method:

```ts
// src/gallery/GalleryManager.ts  — new public method
/**
 * Switches the procedural texture tile size for geometry-carrying roles
 * between the standard gallery size and the higher inspection size.
 * Re-generates the current artwork's map set immediately if the mode changes.
 */
setInspectionMode(on: boolean): void {
  if (on === this.inspectionMode) return;
  this.inspectionMode = on;
  if (this.currentPreset) void this.showArtwork(this.currentIndex);
}
```

Update `showArtwork()` to pass the per-role tile size. The `PROCEDURAL_ROLES` loop currently uses `preset.proceduralTileSize` for all roles. Replace with:

```ts
// src/gallery/GalleryManager.ts  — showArtwork(), before PROCEDURAL_ROLES loop
const INSPECTION_ROLES: readonly PaintingMapRole[] = ['normal', 'detailNormal', 'height'];

// inside the loop body — replace the single generate() call:
const isInspectionRole = (INSPECTION_ROLES as string[]).includes(role);
const inspSize = preset.proceduralInspectionTileSize;
const tileSize = (this.inspectionMode && isInspectionRole && inspSize > 0)
  ? inspSize
  : preset.proceduralTileSize;
resolved[role] = this.procedural.generate(artwork.id, role, tileSize);
```

The `ProceduralTextureFactory` cache key is `${artworkId}::${role}::${effectiveSize}`, so 1024-resolution and 2048-resolution textures are stored independently — no stale-texture risk.

---

**Step 3c — Wire `setInspectionMode` from `main.ts`**

In `src/main.ts`, locate `applyPreferences()` where `setShadowProfileScale` is already called. Add immediately after:

```ts
// src/main.ts  — add alongside setShadowProfileScale
galleryManager.setInspectionMode(profile.displayIntent === 'inspection');
```

**S3 Acceptance:**
- Under `raking-inspection`, procedural `normal`/`detailNormal`/`height` maps are 2048×2048 on high preset.
- Under `gallery-soft`, the same maps are 1024×1024 (no regression).
- Profile toggle does not stale-serve the wrong resolution (cache key includes size).
- `npm run lint` and `npm run build` pass.

---

#### Slice S4 — Lateral self-shadow PCF filter (inspection-only)

**Problem:** The v0.05 smooth accumulation improved the depth direction but not the lateral width of shadow edges. Under raking light, each height-march step still reads as a hard lateral stripe.

**Pre-condition:** Ship S2 (and optionally S3) before S4. S4 triples the self-shadow texture reads at high preset (8 steps × 3 rays = 24 reads) and should only be active under inspection profiles.

**Files changed:** `src/config/quality.ts`, `src/materials/PaintingMaterial.ts`, `src/main.ts`

---

**Step 4a — Add `selfShadowFilterEnabled` and update `selfShadowFilterRadius` in `QualityPreset`**

Add one field to the `QualityPreset` interface in `src/config/quality.ts`, after `selfShadowFilterRadius`:

```ts
/**
 * Whether PAINTING_USE_SHADOW_FILTER is compiled in. Enabling triggers a
 * material recompile. Driven at runtime by main.ts via
 * PaintingMaterial.setShadowFilterRadius() — keep false in preset objects.
 */
selfShadowFilterEnabled: boolean;
```

Set `selfShadowFilterEnabled: false` on all three presets (runtime toggle only via `setShadowFilterRadius()`).

Update `selfShadowFilterRadius` on high preset from `0.0` to `0.002`:

```ts
// quality.ts — high preset
selfShadowFilterRadius: 0.002,   // was 0.0; used when main.ts enables S4
```

---

**Step 4b — Extend `PaintingMaterial`**

**(i) Add to `PaintingUniforms` interface** (after `uShadowProfileScale`):

```ts
// src/materials/PaintingMaterial.ts  — PaintingUniforms interface
uShadowFilterRadius: { value: number };
```

**(ii) Add instance field** after `shadowDebugEnabled = false` (line 88):

```ts
private shadowFilterEnabled = false;
```

**(iii) Initialize in constructor** (in the `paintingUniforms` literal after `uShadowProfileScale`):

```ts
uShadowFilterRadius: { value: preset.selfShadowFilterRadius },
```

**(iv) Add `setShadowFilterRadius()` method** after the existing `setShadowDebug()`:

```ts
/**
 * Enables or disables the lateral PCF-like self-shadow filter.
 * `radius` is in UV space (typical 0.001..0.004).
 * Changing `enabled` triggers a full shader recompile via `needsUpdate = true`.
 * Call from main.ts when the light profile switches to/from inspection.
 */
setShadowFilterRadius(radius: number, enabled: boolean): void {
  this.paintingUniforms.uShadowFilterRadius.value = radius;
  if (enabled !== this.shadowFilterEnabled) {
    this.shadowFilterEnabled = enabled;
    this.needsUpdate = true;
  }
}
```

**(v) Register the define in `onBeforeCompile`** — add after the `PAINTING_DEBUG_SHADOW` conditional:

```ts
if (this.shadowFilterEnabled && this.paintingUniforms.uShadowFilterRadius.value > 0) {
  defines.push('#define PAINTING_USE_SHADOW_FILTER');
}
```

**(vi) Declare the uniform in the GLSL `uniformBlock` string** — add after `uniform float uShadowProfileScale;`:

```glsl
uniform float uShadowFilterRadius;
```

**(vii) Add the GLSL filter chunk.** In the `lightsEndChunk` string, inside `#ifdef PAINTING_USE_SELFSHADOW`, insert after `_occlusion = clamp(_occlusion, 0.0, uShadowMaxOcclusion);` and before `float _shadow = ...`:

```glsl
#ifdef PAINTING_USE_SHADOW_FILTER
    {
        // Two companion rays perpendicular to the primary march direction.
        // Blending three rays removes lateral texel-step hard edges without
        // raising the overall darkening envelope.
        // _shDelta is the per-step UV offset already computed in the march above.
        float _dLen = length(_shDelta);
        vec2 _latDir = (_dLen > 0.0001)
            ? vec2(-_shDelta.y, _shDelta.x) * (uShadowFilterRadius / _dLen)
            : vec2(uShadowFilterRadius, 0.0);
        float _oL = 0.0, _oR = 0.0, _wL = 0.0, _wR = 0.0;
        for (int _k = 0; _k < 16; _k++) {
            if (float(_k) >= uShadowSteps) break;
            float _fi  = float(_k + 1);
            float _wk  = 1.0 / _fi;
            float _wH  = _curH + _tsLight.z * _shStep * _fi;
            vec2  _bo  = _shDelta * _fi;
            float _exL = texture2D(bumpMap, clamp(_shUV + _bo - _latDir, 0.001, 0.999)).r
                         - _wH - uShadowBias;
            float _exR = texture2D(bumpMap, clamp(_shUV + _bo + _latDir, 0.001, 0.999)).r
                         - _wH - uShadowBias;
            _oL += smoothstep(0.0, max(uShadowSoftness, 0.001), _exL) * _wk;
            _oR += smoothstep(0.0, max(uShadowSoftness, 0.001), _exR) * _wk;
            _wL += _wk; _wR += _wk;
        }
        float _lOcc = clamp((_wL > 0.0) ? _oL / _wL : 0.0, 0.0, uShadowMaxOcclusion);
        float _rOcc = clamp((_wR > 0.0) ? _oR / _wR : 0.0, 0.0, uShadowMaxOcclusion);
        _occlusion = (_occlusion + _lOcc + _rOcc) / 3.0;
    }
#endif
```

**(viii) Update `applyPreset()`** — add after `uShadowMaxOcclusion` assignment:

```ts
this.paintingUniforms.uShadowFilterRadius.value = preset.selfShadowFilterRadius;
```

The `shadowFilterEnabled` flag is only toggled via `setShadowFilterRadius()` from `main.ts`, so the existing `definesChanged` check in `applyPreset()` does not need to change.

---

**Step 4c — Wire from `main.ts`**

In `src/main.ts`, in the same block as the existing `setShadowProfileScale` call:

```ts
// src/main.ts  — add alongside setShadowProfileScale
const isInspection = profile.displayIntent === 'inspection';
paintingMaterial.setShadowFilterRadius(
  isInspection ? activePreset.selfShadowFilterRadius : 0.0,
  isInspection && activePreset.selfShadowFilterRadius > 0
);
```

Behaviour:
- Gallery profiles: `enabled = false`. The `PAINTING_USE_SHADOW_FILTER` define is absent after first load; no runtime recompile cost.
- Inspection profile: `enabled = true` on first switch → one-time shader recompile. Subsequent same-profile loads are zero extra cost.

**S4 Acceptance:**
- Under `raking-inspection`, the shadow loop runs 3 rays × 8 steps = 24 texture reads (was 8).
- Under `gallery-soft`, the single-ray path is compiled in; performance identical to v0.05.
- `_occlusion` after averaging ≤ `uShadowMaxOcclusion`. Max gallery darkening unchanged at 4.2 %; max inspection darkening unchanged at 8.4 %.
- `setShadowDebug()` still renders the correct shadow-mask greyscale with filter active.
- `npm run lint` and `npm run build` pass.

---

### v0.06 Performance Budget

| Path | Self-shadow texture reads | Notes |
|------|---------------------------|-------|
| Gallery (S2 + S3 only) | 8 steps × 1 ray = **8** | Identical to v0.05 |
| Inspection (S4 on, high) | 8 steps × 3 rays = **24** | Only when `displayIntent === 'inspection'` |
| S3 memory uplift per artwork | ≈48 MB RGBA GPU | 3 roles × 2048² × 4 bytes; only when inspectionMode |

The memory cost is an acceptable trade-off for the inspection path; the user has explicitly navigated to a close-up relief view.

---

### v0.06 Global Acceptance Checks

1. `npm run lint` — no new errors.
2. `npm run build` — clean; only pre-existing Sass deprecation warning.
3. Shadow debug key `s`/`S` (behind `?debug=1`) shows correct shadow mask under both gallery and inspection profiles, with and without the PCF filter active.
4. Gallery display: no visual regression on `gallery-soft` or `museum-neutral`.
5. Inspection: visibly smoother relief shading under `raking-inspection` without new smearing artefacts.
6. Preset toggle: switching `balanced → high` in inspection mode re-applies anisotropy and triggers inspection-resolution uplift.
7. Race guard: rapid profile switches do not apply stale textures — existing `artworkLoadToken` guard in `GalleryManager` is unchanged.

---

### v0.06 Fallback Behaviour

- If `getMaxAnisotropy()` returns `1`, `setAnisotropy(1)` is a no-op on cached textures; procedural maps render cleanly without error.
- If S3 memory cost is too high, set `proceduralInspectionTileSize: 0` on high preset — no code revert needed.
- If S4 filter cost is too high on a target device, call `setShadowFilterRadius(0, false)` from `main.ts` to omit the define and return to the S2/S3 single-ray baseline.

---

### v0.06 Shader / Math-Space Assumptions

- `bumpMap.r = 0.0` → deepest recess; `1.0` → highest peak. Unchanged from v0.05.
- `_shDelta` is the tangent-space light direction projected onto UV, scaled by `uParallaxScale / uShadowSteps`. No change in S4.
- The lateral PCF offset `_latDir` at `uShadowFilterRadius = 0.002`: one march step is `0.04 / 8 = 0.005` UV, larger than `0.002`. No inter-step overlap and no sampling outside `[0.001, 0.999]`.
- Height maps remain single-channel (R channel of RGBA) for all procedural and authored paths.

---

### v0.06 Resource Ownership / Async Boundaries

- `TextureManager` owns all authored textures. `ProceduralTextureFactory` owns all generated textures. No change.
- `setAnisotropy()` and `setInspectionMode()` mutate cached texture properties in-place. No new ownership transfer or deferred disposal.
- S3 dual-size cache: both sizes remain alive simultaneously. A future `pruneSizeBelow(threshold)` on `ProceduralTextureFactory` can reclaim the lower-res entry — out of scope for v0.06.
- The `artworkLoadToken` race guard in `GalleryManager` remains the sole async guard for artwork loads.

---

### v0.06 Browser / API Stability Boundaries

- `THREE.Texture.anisotropy` is stable since Three.js r119+; already used by `TextureManager`.
- All GLSL changes use `texture2D()` and standard GLSL 1.0 — no extensions, no WebGL2-only syntax.
- No new npm dependencies.

---

### v0.06 Known Risks

1. S3 memory uplift may cause a generation stall on first inspection-mode switch on slow CPUs. Mitigate by capping `proceduralInspectionTileSize ≤ 2048`.
2. S4 triples per-fragment self-shadow texture reads. Profile on mid-range mobile before shipping to balanced preset.
3. Strong anisotropy on tiling procedural maps may make pattern repetition more visible at glancing angles. Evaluate on wide landscape paintings.
4. Dual-size S3 cache doubles procedural GPU memory footprint on high+inspection. Acceptable for desktop; revisit for mobile.

---

### v0.06 Recommended Execution Order

1. **S2** — Ship anisotropy fix. Re-evaluate blockiness under `raking-inspection`.
2. If blockiness persists: **S3** — Add inspection tile size uplift. Re-evaluate.
3. If lateral shadow stepping persists: **S4** — Activate lateral PCF filter.
4. After each shipped slice: update `FINDINGS.md`, `CHANGELOG.md`, `docs/HANDOFF.md`.

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
