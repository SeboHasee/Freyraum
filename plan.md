# FREYRAUM Plan

## Active remediation plan — documentation/tooling consolidation (2026-06-21)

### Goals

1. Enforce canonical documentation ownership.
2. Eliminate cross-document runtime/config drift.
3. Preserve historical rationale in archive docs instead of operational docs.
4. Add enforceable freshness and dependency-validation safeguards.

### Active work items

- [ ] Rewrite top-level docs to single-purpose scope.
- [ ] Keep `docs/QUERY_PARAMETERS.md` as the only config reference.
- [ ] Add source-of-truth matrix to `README.md`.
- [ ] Add `CONTRIBUTING.md` freshness and architecture-drift policy.
- [ ] Add documentation authority check script and CI workflow.
- [ ] Run dependency audit and document risky upgrades with migration path.

### Historical context

Long-form historical planning has been moved to:

- `docs/archive/plan-history-2026-06-21.md`

---

## v0.74 — Performance Audit & Optimization Plan (2026-06-21)

> **Phase: Planning only. No code changes.**
> Authored from static analysis of the full source tree at commit HEAD (v0.73 baseline).

---

### Executive Summary

The FREYRAUM gallery runtime is a single-artwork WebGL viewer built on Three.js with a custom PBR painting material, procedural frame shader, post-processing pipeline (bloom + OutputPass), and a staged texture-preloading system. The overall architecture is sound: draw call count is very low (4–15 per frame depending on preset), the scene graph is minimal, and frame-rate-independent smoothing is used throughout. However, several compounding inefficiencies exist across CPU, GPU, memory, and the startup pipeline that limit peak frame stability and constrain headroom for future feature work.

**Main findings:**

| Category | Severity | Location |
|---|---|---|
| Per-frame viewport measurement cascade | High | `GalleryManager.update()` |
| Per-frame redundant `Math.tan`/`degToRad` | High | `GalleryManager` zoom/pan helpers |
| Redundant manual `updateMatrixWorld()` | Medium | `main.ts` animate loop |
| Per-frame GC pressure from `FrameBudgetMonitor.snapshot()` | Medium | `FrameBudgetMonitor.ts` |
| Per-frame `getRendererSnapshot()` `new THREE.Vector2()` | Low | `RendererManager.ts` |
| Frame geometry rebuild on every artwork navigation | High | `ArtworkMesh.updateAspect()` |
| Shadow map render passes on 2–3 spotlights | High (GPU) | `LightingSetup.ts` |
| Transparent side-panel overdraw | Medium (GPU) | `SidePanels.ts` |
| Bloom pass internal ping-pong framebuffers | Medium (GPU) | `PostProcessing.ts` |
| ProceduralTextureFactory CPU buffer GC | Medium | `ProceduralTextureFactory.ts` |
| Startup quality-preset pre-warming (3 full cycles) | Medium | `main.ts` boot |
| `console.debug` calls on artwork navigation | Low | `ArtworkMesh.ts` |

---

### Phase 1: Full System Model

#### 1.1 Rendering Pipeline

```
rAF tick
  ├── GalleryManager.update(now)           // CPU: smoothing + zoom/pan + camera writes
  ├── LightingSetup.update(now)            // CPU: sin animation, spot position write
  ├── camera.updateMatrixWorld()           // CPU: manual matrix rebuild (redundant)
  ├── KEY_LIGHT_WORLD → KEY_LIGHT_VIEW     // CPU: transformDirection call
  ├── material.setKeyLightDirView()        // CPU: uniform write
  └── PostProcessing.render()             // GPU: full render pipeline
        ├── RenderPass                    // GPU draw: 4 scene objects
        ├── UnrealBloomPass (if enabled)  // GPU: 5–7 internal ping-pong passes
        └── OutputPass                   // GPU: color-space conversion pass
```

Shadow maps (high/balanced presets only) are rendered before the RenderPass as an implicit extra pass per shadow-casting light (2–3 spotlights). Each shadow map is a full depth-only render of the entire scene.

#### 1.2 Scene Graph

```
scene
  ├── AmbientLight
  ├── SpotLight × 2–3  (shadow-casting when preset.shadows=true)
  ├── spotTarget (Object3D)
  ├── PointLight (accent, profile-dependent)
  ├── artworkMesh.group
  │     ├── frameMesh   (ExtrudeGeometry + MeshPhysicalMaterial w/ custom shader)
  │     └── artworkMesh (PlaneGeometry + MeshPhysicalMaterial w/ onBeforeCompile)
  ├── leftPanel   (PlaneGeometry × 1, MeshBasicMaterial, transparent)
  └── rightPanel  (PlaneGeometry × 1, MeshBasicMaterial, transparent)
```

Total draw calls per frame (without shadows): 4 objects = 4 draw calls.
With shadows (2 lights): 2 × 4 + 4 = 12 draw calls.
With bloom: adds 5–7 internal passes at downsampled resolutions.

#### 1.3 Update Loop (per-frame CPU work)

Every `requestAnimationFrame` tick in `main.ts` executes:

1. `frameBudget.sample(now)` — 3 linear passes over a 60-element ring buffer
2. `adaptiveQuality.evaluate()` — locked, constant-time no-op after lock check
3. `lightingSetup.update(now)` — one `Math.sin()` + one position write (animated profiles only)
4. `galleryManager.update(now)` — **most expensive CPU work** (see §2.1)
5. `camera.updateMatrixWorld()` — redundant manual call
6. Key-light direction transform — one `copy` + one `transformDirection` (6-multiply dot product)
7. `material.setKeyLightDirView()` — uniform struct write
8. `postProcessing.render()` — compositor render

#### 1.4 Asset Loading Pipeline

Startup sequence:
1. Device capability detection
2. `RendererManager` construction (WebGL context creation)
3. `TextureManager.init()` — queries GPU max anisotropy/texture size
4. `GalleryManager` construction — creates readiness ledger for all artworks
5. **Albedo preload** — `Promise.all` for first N artwork URLs
6. **PBR texture set preload** — per artwork, per role
7. **Procedural map generation** — CPU-side for each artwork × role × tileSize
8. **Quality preset pre-warming** — 3 full preset cycles (high → balanced → battery)
9. **Artwork GPU warming** — render each artwork through full post-processing pipeline
10. **UI chrome pre-build** — force-layout on 15+ DOM selectors

#### 1.5 Memory Ownership Model

- `TextureManager` owns all network-loaded textures (URL-keyed cache, never evicted until `dispose()`).
- `ProceduralTextureFactory` owns all generated `DataTexture` instances (artworkId+role+size keyed, never evicted).
- `ArtworkMesh` owns geometry; frame geometry is rebuilt on every artwork navigation.
- Post-processing `EffectComposer` owns 3–4 internal `WebGLRenderTarget` framebuffers at full canvas resolution.

---

### Phase 2: Bottleneck Identification

#### 2.1 CPU Bottlenecks

---

**CPU-1 — Viewport measurement cascade inside `update()` (High)**

*File:* `src/gallery/GalleryManager.ts` — `update()`, `clampZoom()`, `clampPanTargets()`, `getZoomBounds()`, `getViewportMetrics()`

*Root cause:* `update()` calls `clampZoom(this.targetZoom)` which calls `getZoomBounds()` with no argument, triggering `getViewportMetrics()`. It also calls `clampPanTargets()` which calls `getPanLimits()` → `getViewportMetrics()` + `getZoomBounds()` again. Total per-frame: the `viewportMetricsProvider` callback in `main.ts` is invoked 2–4 times per frame. That callback reads three CSS custom properties via `getComputedStyle(document.documentElement)` and calls `getBoundingClientRect()` on up to four cached DOM elements. CSS custom property reads and `getBoundingClientRect()` are layout-triggering on some browsers if layout is dirty.

*Impact:* 2–4 redundant layout reads per frame. On mobile (where layout cost is higher) this can add 0.5–2 ms per frame. Scales with the number of chrome DOM elements observed.

*Frame stability:* Yes — periodic forced-layout can cause jank spikes when CSS layout is invalidated by other DOM changes (e.g. timeline scroll, info panel open).

---

**CPU-2 — Redundant `Math.tan(degToRad(...))` inside per-call helpers (High)**

*File:* `src/gallery/GalleryManager.ts` — `getInspectionMinZoom()` line 1566, `getResetFitZoom()` line 1578, `getPanLimits()` line 1541

*Root cause:* `Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5))` is computed independently in each of three methods that are called on the same frame. The camera FOV (`40°`) never changes at runtime. `Math.tan` of a constant is a constant.

*Impact:* 3 redundant `Math.tan` + `degToRad` computations per frame when any zoom/pan helpers are active. Minor individually, but compounds with CPU-1 since these helpers are always called from the update chain. Scales with animation complexity.

*Frame stability:* Low — these are fast operations, but eliminating them reduces jitter in tight CPU frames.

---

**CPU-3 — Redundant `camera.updateMatrixWorld()` in the render loop (Medium)**

*File:* `src/main.ts` line 1680 — inside the `animate()` function

*Root cause:* `camera.updateMatrixWorld()` is called manually before extracting the key-light view direction. However, `postProcessing.render()` (which calls `composer.render()` → `renderer.render()`) already calls `scene.updateMatrixWorld()` on the camera during the render pass. The manual call happens *before* the render, at a point when the camera position has just been updated by `galleryManager.update()`. If this is intentional (to get the correct matrix for the uniform), the manual call is necessary — but the camera's `matrixAutoUpdate` flag should be set to `false` with the matrix explicitly managed to eliminate the redundant internal update during render. If the camera always auto-updates during render, the pre-render manual call is still redundant because the uniform only needs to be set before the fragment shader runs (during render), not before `postProcessing.render()`.

*Impact:* One matrix multiplication per frame (4×4 matrix inverse). Negligible on desktop, measurable on slow mobile CPUs.

*Frame stability:* Low.

---

**CPU-4 — `FrameBudgetMonitor.sample()` linear scans per frame (Medium)**

*File:* `src/utils/FrameBudgetMonitor.ts` — `sample()`, `countAboveBudget()`, `countSevereFrames()`

*Root cause:* Every frame, `sample()` performs:
- 1 full linear scan to compute rolling average (up to 60 iterations)
- `countAboveBudget()`: another full linear scan
- `countSevereFrames()`: another full linear scan

Total: 3 × 60 = 180 scalar comparisons per frame, returning a new `FrameBudgetSample` object each time (heap allocation). At 60 fps: 10,800 iterations/second and 60 object allocations/second just for budget monitoring.

*Impact:* Minor CPU cost (~0.05–0.1 ms/frame). More significant is the GC pressure from 60 `FrameBudgetSample` object allocations per second — these are short-lived and trigger minor GC every few seconds.

*Frame stability:* GC can cause 1–5 ms hitch frames when the minor heap is collected.

---

**CPU-5 — `console.debug` calls on artwork navigation (Low)**

*File:* `src/gallery/ArtworkMesh.ts` lines 70, 139, 233, 285

*Root cause:* `console.debug` is called unconditionally (not behind a diagnostics mode check) during `ArtworkMesh` construction, frame geometry rebuild, and artwork seed updates. The calls on lines 139 and 233 occur during `makeFrameGeometry()` and `replaceFrameGeometry()`, which are triggered on every artwork navigation. `console.debug` in modern browsers is cheap but not free — it serializes the argument object and sends it to the DevTools pipe.

*Impact:* ~0.1–0.5 ms per navigation in DevTools-attached sessions. Not a hot-path cost per frame, but visible as a navigation spike in profiler traces. In production without DevTools attached the cost is negligible.

*Frame stability:* Low in production; moderate during development.

---

#### 2.2 GPU Bottlenecks

---

**GPU-1 — Shadow map render passes for 2–3 spotlights (High)**

*File:* `src/lighting/LightingSetup.ts`, `src/config/quality.ts`

*Root cause:* On `high` and `balanced` presets, `preset.shadows = true` enables `castShadow` on all spotlights. Three.js renders one depth-only shadow map pass per shadow-casting light, *before* the main render. With 2 spotlights active, the scene is rendered 3 times per frame (2 shadow maps + 1 main pass), before any post-processing. With 3 spotlights: 4 render passes. All scene objects (artwork, frame, side panels) are drawn in each shadow pass even though none of the scene objects are physically large enough to cast interesting inter-object shadows in this constrained scene.

*Impact:* 2× shadow map passes ≈ doubles the base GPU render workload before post-processing. On mobile GPUs, this is one of the most expensive single optimizations available. Scales with light count and shadow map resolution.

*Frame stability:* Yes — shadow maps allocated at fixed resolution can cause memory pressure on low-VRAM devices.

---

**GPU-2 — Bloom pass `UnrealBloomPass` internal ping-pong framebuffers (Medium)**

*File:* `src/core/PostProcessing.ts`

*Root cause:* `UnrealBloomPass` allocates 10 internal WebGLRenderTargets (5 for the downsample pyramid, 5 for the upsample pyramid). On `high` preset, `bloomStrength = 0.04` — an extremely low value. The bloom effect at 0.04 strength adds almost no visible contribution to a scene with `bloomThreshold = 1.2` (which means only fragments brighter than 1.2 linear — far beyond what any non-HDR surface in this scene produces). The bloom pass therefore processes 10 framebuffer textures per frame to produce a near-zero contribution.

*Impact:* 10 texture reads/writes at downsampled resolutions per frame for negligible visual output (strength 0.04, threshold 1.2). Each ping-pong blit is a full-screen quad render. On battery preset bloom is correctly disabled (strength 0.0).

*Frame stability:* The 10 FBO blit operations add ~0.3–1 ms GPU time on mid-range hardware. This cost is incurred even if the scene has no bloom-eligible pixels.

---

**GPU-3 — Transparent side-panel alpha blending overhead (Medium)**

*File:* `src/gallery/SidePanels.ts`

*Root cause:* Both side panels use `MeshBasicMaterial` with `transparent: true, opacity: 0.95`. Near-opaque transparent objects (opacity 0.95) are drawn in Three.js's transparency pass (after opaque objects), which bypasses depth-write optimizations and requires the GPU to blend with the framebuffer. The panels are offset to the sides (`x = ±4.9`) and angled, so their contribution to overdraw of the main artwork is minimal — but transparent objects still force a separate render bucket and fragment blending on every pixel they cover, even at opacity 0.95 where the visual difference from opacity 1.0 would be undetectable.

*Impact:* Minor per-frame blending cost for 2 plane meshes at fixed positions. The bigger issue is that transparent objects force Three.js to sort them by distance every frame (though with only 2 transparent objects the sort is trivial). Setting `opacity = 1.0` and `transparent = false` would allow depth write optimization and eliminate the alpha-blend stage.

*Frame stability:* Low — but removing this is a free 1-draw-call optimization.

---

**GPU-4 — Frame geometry rebuild on every artwork navigation (High — CPU+GPU combined)**

*File:* `src/gallery/ArtworkMesh.ts` — `updateAspect()` → `replaceFrameGeometry()`

*Root cause:* When artwork aspect changes on navigation, `updateAspect()` calls `replaceFrameGeometry()` which:
1. Disposes the old `ExtrudeGeometry`
2. Reconstructs `THREE.Shape` + `THREE.Path` (hole)
3. Runs `new THREE.ExtrudeGeometry(shape, options)` — CPU mesh generation
4. Calls `assignFrameBarUVs()` — O(vertexCount) loop over all frame vertices
5. Calls `geometry.computeTangents()` — O(triangleCount) tangent computation
6. Uploads the new geometry to the GPU (buffer upload)

On the `high` preset the frame geometry with bevel is moderately complex. This entire pipeline runs synchronously on the main thread, blocking for 1–5 ms during each artwork navigation.

*Impact:* Navigation stall of 1–5 ms on the main thread. GPU stutter from buffer upload. Geometry is recreated even when transitioning between two artworks of identical aspect ratio.

*Frame stability:* Yes — causes a visible navigation-frame spike in profiler traces.

---

**GPU-5 — Artwork plane vertex count: 180×180 segments on high preset (Medium)**

*File:* `src/config/quality.ts` — `artworkSegments: 180`

*Root cause:* On `high` preset the artwork plane is subdivided into 180×180 quads = 32,400 quads = 64,800 triangles for a single flat rectangle. The high subdivision exists to support the parallax UV offset shader (which needs smooth UV gradients) and the self-shadow march. However, a PlaneGeometry at this resolution sends ~65K vertices through the vertex shader every frame even when the camera is at the default overview distance where individual vertex positions are sub-pixel.

*Impact:* 65K vertex shader invocations per frame for a flat plane. At close zoom, the subdivision is warranted for parallax. At overview distance, it is pure overhead. Fragment shader cost dominates at close distances, so the vertex cost is relatively more significant at overview distance.

*Frame stability:* Moderate — contributes to GPU vertex processing budget.

---

#### 2.3 Memory Bottlenecks

---

**MEM-1 — ProceduralTextureFactory Uint8Array temporaries (Medium)**

*File:* `src/materials/ProceduralTextureFactory.ts` — `generateNormal()`, `generateHeight()`, etc.

*Root cause:* Each procedural map generation allocates a `new Uint8Array(size * size * 4)`. On high preset with `tileSize = 1024`, each role allocates 4 MB of temporary data. With 7 roles × 4 MB = 28 MB of CPU-side temporary buffers per artwork on high preset (though generation is amortized by the cache). In inspection mode (`tileSize = 2048`), the cost quadruples: 3 roles × 16 MB = 48 MB of temporaries for geometry-carrying roles alone. These buffers are GC-eligible after `DataTexture` construction, contributing to major GC pauses if multiple artworks are generated in quick succession during the startup warm sequence.

*Impact:* 28–48 MB of GC-eligible buffer allocations per un-cached artwork. At startup warming 7–15 artworks, this can trigger 1–3 major GC cycles during the loading overlay phase (not user-visible, but can extend startup time by 50–200 ms on constrained devices).

*Frame stability:* Low during runtime (cached), High during startup warmup.

---

**MEM-2 — `FrameBudgetMonitor.snapshot()` per-frame object allocation (Medium)**

*File:* `src/utils/FrameBudgetMonitor.ts` — `snapshot()`, `sample()`

*Root cause:* `sample()` returns `this.snapshot()` which allocates a new `FrameBudgetSample` object (7 numeric + 1 boolean fields) every call. At 60 fps this produces 60 allocations per second. While V8's young-generation GC handles this efficiently in isolation, it compounds with other per-frame allocations (diagnostics objects, etc.) to create background GC pressure.

*Impact:* ~60 × (8 fields × ~8 bytes each) ≈ ~3.8 KB/s in young-generation heap churn. Minor GC collections every 1–3 seconds, each taking 0.5–2 ms.

*Frame stability:* Minor GC hitches.

---

**MEM-3 — `new THREE.Vector2()` in `getRendererSnapshot()` (Low)**

*File:* `src/core/RendererManager.ts` line 148

*Root cause:* `getRendererSnapshot()` creates `new THREE.Vector2()` to call `renderer.getSize(size)`, then reads x/y from it. This method is called from a 5-second `setInterval` in diagnostics mode. Minor allocation, but unnecessary since `renderer.getSize()` can accept a reused vector.

*Impact:* Negligible — 1 allocation every 5 seconds.

---

**MEM-4 — `new THREE.Vector2()` in raycaster panel detection (Low)**

*File:* `src/gallery/GalleryManager.ts` line 1439

*Root cause:* `checkPanelClick()` creates `new THREE.Vector2(...)` per invocation. This is triggered by pointer click events, not per-frame, so the allocation rate is very low.

*Impact:* Negligible — event-driven, not per-frame.

---

**MEM-5 — Fallback texture 1600×1100 canvas allocation (Low)**

*File:* `src/gallery/TextureManager.ts` — `createFallbackTexture()`

*Root cause:* When a texture URL fails to load, a 1600×1100 canvas is created (`1600×1100×4 = ~7 MB RGBA`) and converted to a `CanvasTexture`. The canvas itself is kept alive as the texture's image source. If multiple artworks fail to load (e.g., first run before assets are available), multiple 7 MB canvas instances exist simultaneously.

*Impact:* 7 MB per failed texture. If all built-in artworks fail (e.g., before import), could hold several hundred MB of canvas memory simultaneously. The canvas is not explicitly disposed separately from the texture; it lives until the `TextureManager.dispose()` call.

*Frame stability:* Startup memory spike if many fallbacks are generated.

---

#### 2.4 Pipeline Bottlenecks

---

**PIPE-1 — Quality preset pre-warming: 3 full render cycles (Medium)**

*File:* `src/main.ts` — startup sequence (v0.55 quality preset warm)

*Root cause:* The startup sequence pre-warms shader programs for `high`, `balanced`, and `battery` presets by fully applying each preset (changing renderer state, material defines, pixel ratio), rendering a warm frame, then restoring the active preset. This compiles ~6–9 distinct shader programs (2 per preset × 3 presets for frame + painting materials). The full preset switch includes `applyPreset()` calls on renderer, post-processing, lighting, artwork mesh, and gallery manager.

*Impact:* 3 full preset cycles add ~200–600 ms to the startup sequence depending on device GPU shader compiler speed. However, this time is hidden under the loading overlay, so it does not affect perceived startup time. It does extend the time before the entry CTA becomes enabled.

*Frame stability:* No runtime impact — startup-only.

---

**PIPE-2 — `prewarmInteractiveChrome()` forced layout (Low)**

*File:* `src/main.ts` — `prewarmInteractiveChrome()`

*Root cause:* This function queries `offsetWidth`, `offsetHeight`, `getBoundingClientRect()`, and `getComputedStyle()` on 15+ CSS selectors, plus temporarily unhides the preferences panel and forces its layout. All of this runs synchronously on the main thread during the loading overlay phase.

*Impact:* 5–20 ms of forced layout during startup, hidden under the loading overlay. Low priority.

---

### Phase 3: Root Cause Summary Table

| ID | Issue | File | Root Cause | Severity | Affects Frame Stability | Scales With |
|---|---|---|---|---|---|---|
| CPU-1 | Viewport measurement cascade | `GalleryManager.ts` | `viewportMetricsProvider` called 2–4×/frame via `getZoomBounds`/`getViewportMetrics` | High | Yes | Scene complexity |
| CPU-2 | `Math.tan(degToRad(...))` per helper | `GalleryManager.ts` | FOV constant recomputed 3× per frame | High | Low | None |
| CPU-3 | Manual `updateMatrixWorld()` | `main.ts` | Redundant call before render; Three.js already updates during render | Medium | Low | None |
| CPU-4 | `FrameBudgetMonitor` 3× linear scans | `FrameBudgetMonitor.ts` | Rolling sum/count done as O(N) linear pass each | Medium | Yes (GC) | Window size |
| CPU-5 | `console.debug` on navigation | `ArtworkMesh.ts` | No diagnostics-mode guard on calls | Low | Low | None |
| GPU-1 | Shadow map passes per spotlight | `LightingSetup.ts` | 2–3 lights × castShadow = 2–3 extra render passes | High | Yes | Light count |
| GPU-2 | Bloom at strength 0.04 still runs | `PostProcessing.ts` | `UnrealBloomPass` always processes 10 FBO blits even at near-zero strength | Medium | No | None |
| GPU-3 | Side panels transparent alpha blend | `SidePanels.ts` | `opacity: 0.95, transparent: true` enables alpha pass unnecessarily | Medium | Low | None |
| GPU-4 | Frame geometry rebuild on navigation | `ArtworkMesh.ts` | Full `ExtrudeGeometry` + UV + tangent reconstruction every artwork change | High | Yes | Vertex count |
| GPU-5 | 65K triangle artwork plane on high | `quality.ts` | `artworkSegments: 180` always active regardless of camera distance | Medium | No | Viewport resolution |
| MEM-1 | Procedural texture Uint8Array GC | `ProceduralTextureFactory.ts` | 28 MB per artwork in CPU buffers, GC-eligible after DataTexture creation | Medium | Yes (startup) | Artwork count |
| MEM-2 | `FrameBudgetSample` per-frame alloc | `FrameBudgetMonitor.ts` | New object allocated on every `sample()` call | Medium | Yes (minor GC) | Frame rate |
| MEM-3 | `new THREE.Vector2()` in snapshot | `RendererManager.ts` | Unnecessary allocation in periodic diagnostic function | Low | No | None |
| MEM-4 | `new THREE.Vector2()` in raycaster | `GalleryManager.ts` | Per-click allocation for hit-testing | Low | No | None |
| MEM-5 | 7 MB canvas per fallback texture | `TextureManager.ts` | 1600×1100 canvas created and held per failed texture URL | Low | No | Failed loads |
| PIPE-1 | 3-preset startup pre-warming | `main.ts` | Full preset cycle × 3 for shader variant compilation | Medium | No | Preset count |
| PIPE-2 | Force-layout in chrome prewarm | `main.ts` | 15+ DOM measurements during startup | Low | No | DOM element count |

---

### Phase 4: Optimization Strategies (No Implementation)

---

#### OPT-1 — Cache `fovTan` and memoize `getZoomBounds` result per frame

**Type:** Memoization / caching strategy

**Target:** `CPU-1`, `CPU-2`

**Approach:** Cache the result of `Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5))` as a class property updated only when FOV changes (never in this runtime). Cache `getZoomBounds()` results for the duration of one `update()` call — compute once, pass as a parameter to `clampZoom`, `clampPanTargets`, `getPanLimits`, and the smoothing block. Cache `getViewportMetrics()` result at the top of `update()` and pass it to all callers within the same tick.

**Expected gain:**
- CPU: eliminate 2–4 `getBoundingClientRect` + CSS property reads per frame (estimated −0.5–2 ms/frame on mobile)
- CPU: eliminate 2 redundant `Math.tan` calls per frame

**Risk:** Low — FOV is constant; viewport metrics need to be re-read at the start of each frame (once) to stay current. No visual change.

**Requires architectural change:** No.

---

#### OPT-2 — Cache frame geometry by aspect ratio; skip rebuild when aspect is unchanged

**Type:** Caching strategy + conditional execution

**Target:** `GPU-4`

**Approach:** In `ArtworkMesh.updateAspect()`, compare the incoming aspect ratio against the currently built geometry's aspect. If the delta is below a precision threshold (e.g., `< 0.001`), skip `replaceFrameGeometry()`. Additionally, maintain a small LRU cache (2–3 entries) of pre-built frame geometries keyed by rounded aspect ratio. When navigating between artworks with similar proportions (e.g., landscape formats), the cached geometry can be swapped in without CPU reconstruction or GPU re-upload.

**Expected gain:**
- CPU: eliminate 1–5 ms geometry reconstruction spike per navigation for matching aspects
- GPU: eliminate geometry buffer re-upload for common aspect groups

**Risk:** Low — geometric precision threshold is configurable; worst case is a cache miss falling back to the current behavior. No visual change.

**Requires architectural change:** No — local to `ArtworkMesh`.

---

#### OPT-3 — Replace rolling-sum linear scan with incremental accumulator in `FrameBudgetMonitor`

**Type:** Data structure redesign

**Target:** `CPU-4`, `MEM-2`

**Approach:** Maintain a running sum alongside the ring buffer so `rolling = (sum - oldest + newest) / windowSize` rather than iterating all samples. Similarly, maintain running counts for `aboveBudget` and `severeFrames`. Update them in O(1) when inserting a new sample (subtract the value being overwritten, add the new value). For `snapshot()`, return a pre-allocated, mutated result object stored on the class instance instead of allocating a new `FrameBudgetSample` each call — the caller reads a `readonly` snapshot before the next `sample()` call overwrites it.

**Expected gain:**
- CPU: from O(180) to O(1) per frame (eliminate 180 comparisons/frame)
- Memory: eliminate 60 heap allocations/second (60 fps × 1 object/frame)

**Risk:** Low — pure refactor of internal bookkeeping. External interface unchanged.

**Requires architectural change:** No.

---

#### OPT-4 — Disable or conditionally skip bloom when near-zero effective contribution

**Type:** Render pass reduction

**Target:** `GPU-2`

**Approach:** On the high/balanced presets, `bloomStrength` is 0.04/0.03 with `bloomThreshold = 1.2`. Because the scene uses `THREE.NoToneMapping` and standard PBR materials, no surface in the scene will produce fragments with linear luminance > 1.2 under the current lighting setup (which is not HDR). The bloom pass therefore processes 10 framebuffers per frame for a result of effectively zero. Two complementary approaches:

1. Set `bloomPass.enabled = false` when `bloomStrength * max(1 - bloomThreshold, 0) < epsilon` (a threshold below which the output is visually indistinguishable from no bloom).
2. Alternatively, reduce `bloomStrength` to 0 on balanced as well — the current 0.03 value is below perceptual threshold on a calibrated display.

**Expected gain:**
- GPU: eliminate 10 fullscreen quad renders per frame on high preset (~0.3–1 ms GPU/frame)

**Risk:** Low — if the bloom effect is genuinely below the perceptual threshold, disabling it produces no visual change. To verify, compare screenshots at `bloomStrength = 0.04` vs. `0.0` on a 4K display at maximum zoom.

**Requires architectural change:** No.

---

#### OPT-5 — Remove shadow maps or constrain to a single key light

**Type:** Render pass reduction

**Target:** `GPU-1`

**Approach:** The FREYRAUM scene renders a single artwork on a near-infinite gallery background. The artwork plane and frame are both flat or near-flat — they cannot receive meaningful self-shadowing from the other spotlight. Shadow maps in this context primarily affect soft floor/wall shadows that are not rendered (no floor geometry). Consider:

1. Reduce to one shadow-casting light (the primary key) on high preset only.
2. On balanced, disable shadow maps entirely and rely on the existing ambient + indirect PBR path.
3. Alternatively, reduce shadow map resolution from Three.js default (1024) to 512 for the lights that are shadow-casting — this halves the shadow map fill rate.

**Expected gain:**
- GPU: 1 fewer render pass per light disabled. With 2 lights and shadows both disabled: 2 fewer full-scene render passes = 50–66% reduction in base scene render cost before post-processing.

**Risk:** Medium — disabling the second spotlight's shadow may change lighting feel. Shadow maps add soft contact shadows on the frame edges that may be subtly noticeable. Mitigate by toggling between shadow-on and shadow-off screenshots at the gallery-soft profile before committing.

**Requires architectural change:** No — `preset.shadows` flag already gates this.

---

#### OPT-6 — Make side panels opaque (`transparent: false, opacity: 1.0`)

**Type:** GPU state optimization

**Target:** `GPU-3`

**Approach:** Change `SidePanels` materials to `transparent: false` (or `opacity: 1.0` — Three.js automatically sets `transparent: false` when opacity reaches 1.0). This moves the panels from the transparent render bucket (sorted by distance, alpha-blended) to the opaque bucket (depth-sorted, no blend cost). The visual difference at `opacity = 0.95 → 1.0` is imperceptible on printed fine-art images against a light gallery background.

**Expected gain:**
- GPU: eliminate alpha-blend for 2 meshes per frame; free up depth-write optimization for those fragments
- CPU: eliminate per-frame transparent-object sort for side panels

**Risk:** Very low — 5% opacity reduction (0.95 → 1.0) is below perceptual threshold on fine-art display devices.

**Requires architectural change:** No.

---

#### OPT-7 — Pre-allocate reusable scratch vectors in `GalleryManager` and `RendererManager`

**Type:** Memory reuse strategy

**Target:** `MEM-3`, `MEM-4`

**Approach:** Store a `private readonly _tmpVec2 = new THREE.Vector2()` on `GalleryManager` and `RendererManager`, reusing it across calls to `renderer.getSize()` and `new THREE.Vector2()` raycaster coordinates. This is a standard pattern in performance-sensitive Three.js code.

**Expected gain:**
- Memory: eliminate 1 allocation every 5 seconds (diagnostics timer) and 1 per panel-click event
- GC: negligible improvement

**Risk:** Very low — isolated, private, never exposed.

**Requires architectural change:** No.

---

#### OPT-8 — Guard `console.debug` calls with diagnostics mode check

**Type:** Update loop optimization

**Target:** `CPU-5`

**Approach:** Replace unconditional `console.debug(...)` calls in `ArtworkMesh.ts` with a guard matching the pattern used elsewhere in the codebase: check `getDiagnostics().getMode() !== 'default'` or use the existing `diagnostics.debug(...)` helper (which is already no-op in default mode). The four calls on lines 70, 139, 233, 285 are all in code paths triggered on every artwork navigation.

**Expected gain:**
- CPU: ~0.1–0.5 ms per navigation in DevTools-attached sessions eliminated
- Code quality: consistent diagnostic level control across the codebase

**Risk:** None — diagnostics-mode check is already used universally everywhere else.

**Requires architectural change:** No.

---

#### OPT-9 — LOD for artwork plane vertex count (distance-based)

**Type:** GPU optimization / LOD

**Target:** `GPU-5`

**Approach:** Maintain two `PlaneGeometry` instances: one at full `artworkSegments` (180 on high) for close inspection, and one at a reduced count (e.g., 24 segments) for overview distance. Switch between them based on camera Z distance crossing a threshold (e.g., camera.position.z > 10.0 → use low LOD; < 6.0 → use high LOD with hysteresis). The parallax and self-shadow effects are barely perceptible at Z > 10.0 (overview distance). This is conceptually similar to the existing `artworkSegments` system, extended to support runtime switching.

**Expected gain:**
- GPU: at overview distance, reduce vertex count from ~65K to ~1.2K triangles = ~50× reduction in vertex processing
- The fragment shader cost dominates at close distances, so this primarily helps overview zoom

**Risk:** Medium — geometry swap causes a single-frame stall similar to the current preset-change path. Hysteresis band required to prevent thrashing. Visual change: none at overview distance (parallax/shadow are below perceptual threshold at z > 10).

**Requires architectural change:** Minor — `ArtworkMesh` would maintain two geometry instances.

---

#### OPT-10 — Procedural texture generation off-thread via `OffscreenCanvas` / Worker

**Type:** CPU offloading / memory optimization

**Target:** `MEM-1`, `PIPE-1`

**Approach:** The procedural map generators in `ProceduralTextureFactory` are pure CPU math with no DOM dependencies. Move the pixel-generation loops into a dedicated Web Worker. The worker returns a `SharedArrayBuffer` (or `Transferable` `ArrayBuffer`) directly uploadable as a `DataTexture` on the main thread. This eliminates the 28–48 MB GC-eligible buffer allocation from the main thread heap and shifts the generation work off the frame budget entirely.

**Expected gain:**
- CPU: remove procedural generation work from the loading sequence's main-thread blocking
- Memory: large Uint8Array temporaries no longer live in the main thread's young generation

**Risk:** High complexity — Web Workers require message-passing protocol design; texture upload must still happen on the main thread. `SharedArrayBuffer` requires appropriate COOP/COEP headers. This is a significant architectural addition and should be Tier 3 unless the startup CPU block is measured as user-visible.

**Requires architectural change:** Yes — new Worker file + message protocol.

---

### Phase 5: GPU Deep Analysis

#### Draw Call Pattern

| Preset | Shadow Passes | Scene Draw Calls | Post-Process Passes | Total GPU Passes |
|---|---|---|---|---|
| High | 2 (2 spotlights) | 4 | 3 (Render + Bloom + Output) | 9 |
| Balanced | 2 (2 spotlights) | 4 | 2 (Render + Output) | 8 |
| Battery | 0 | 4 | 2 (Render + Output) | 6 |

Shadow passes constitute the largest single multiplier on GPU workload.

#### Material Switching

- Only 2 unique materials in the scene: `MeshPhysicalMaterial` (artwork + frame, both via `onBeforeCompile`) and `MeshBasicMaterial` (side panels).
- No material switching between frames during normal operation.
- On quality preset change: shader recompilation triggered for both artwork and frame materials, which can cause a 50–200 ms GPU stall on the first frame after the switch.

#### Texture Binding

- Active textures per frame on high preset: albedo + normal + detailNormal + height + roughness + specular + ao + varnish = up to 8 textures for the artwork plane. Frame material uses no texture maps (procedural, uniform-driven). Side panels use 1 texture each = 2 more.
- Total: up to 10 unique texture binds per scene render. Well within the GPU's texture unit limit (typically 16–32).
- No texture thrashing detected — all textures are resident in GPU VRAM after the warm pass.

#### Shader Complexity Analysis

**Painting shader (high preset):**
- `MeshPhysicalMaterial` with clearcoat, specular, normal, and emissive — one of Three.js's most complex built-in fragment shaders
- `onBeforeCompile` adds: parallax UV march (10 steps × 1 texture read = 10 dynamic texture reads), self-shadow march (6 steps × 1 texture read = 6 dynamic texture reads), detail normal blend, grazing boost
- Total per-fragment texture reads on high: albedo(1) + normal(1) + detailNormal(1) + height(1) + roughness(1) + specular(1) + ao(1) + varnish(1) + parallax samples(10) + shadow march(6) = ~23 texture reads per fragment
- At 1920×1080 with 1.6× pixel ratio = ~3.3M fragments → ~76M texture reads per frame for the artwork plane alone

This is a high shader ALU and texture read count. The parallax and self-shadow texture reads use dynamic UV offsets (non-trivially vectorizable) which can stress the texture sampler pipeline on mobile GPUs.

**Frame shader (high preset):**
- `MeshPhysicalMaterial` with clearcoat + anisotropy (M-04 override in `lights_physical_fragment`)
- `onBeforeCompile` adds: procedural normal (FBM + fine FBM + scratch lines), roughness grain + attenuation, anisotropy direction perturbation
- FBM: 4 octaves × 2 `frmNoise` calls × 4 `frmHash` calls each = ~32 hash evaluations per primary FBM call
- Fine-grain FBM: additional 3 octaves × ~24 hash calls
- Scratch layer (high): 3 `frmScratchLine` calls, each with 5 `frmHash` calls = 15 hash calls
- Total per-fragment ALU: heavy, but the frame occupies a small fraction of screen pixels (border region only)
- `fwidth(barUV.x)` calls require screen-space derivatives — available as a built-in but consumes a DDX/DDY quad operation

**Overdraw analysis:**
- No overdraw detected for the main artwork plane (it is the background, behind nothing).
- Side panels are offset to the sides; their projection does not overlap the artwork at default FOV (40°).
- The frame ring overlaps the artwork plane edges (design intent) — 1× overdraw on the frame border pixels.

#### Render Ordering

Three.js default opaque-then-transparent ordering is used. The frame ring is opaque; the artwork plane is opaque (no transparency). Side panels are transparent (see OPT-6). No issues with render ordering for visual correctness.

---

### Phase 6: CPU Optimization Deep Analysis

#### Main Loop Structure

The `animate(now)` function in `main.ts` runs unconditionally at display refresh rate (60–120 Hz). The gate `if (pageInactive) return` prevents render when the tab is hidden. The gate `if (rendererManager.isRenderPaused()) return` prevents render when the WebGL context is lost. Both are correct.

Within the render-eligible path, the loop runs all of: budget sampling, quality evaluation, lighting update, gallery update, key-light transform, material uniform write, and the render pipeline. There is no dirty flag or idle throttling — the full pipeline runs at every frame even when nothing is animating (camera at rest, no user input, no lighting animation if `reducedMotion` is set or profile is non-animated).

#### Redundant Recalculations

1. `Math.tan(THREE.MathUtils.degToRad(40 * 0.5))` = `Math.tan(0.3490658...)` = `0.36397...` — a constant never computed once (CPU-2).
2. `getViewportMetrics()` reads computed CSS properties and BoundingClientRect on each of 4 DOM elements — called 2–4× per frame (CPU-1).
3. `getZoomBounds()` recalculates min/max zoom from scratch each call — called inside `clampZoom()` and `getPanLimits()` in the same update tick (CPU-1 cascade).

#### Update Frequency

- `LightingSetup.update()`: only animates if `animateAllowed && !reducedMotion`. When animation is disabled, returns immediately — correct.
- `GalleryManager.update()`: always runs target clamping even when all targets match current values (no dirty flag to skip unchanged properties). On a fully settled scene with no user input, 10 `smoothDamp()` calls run per frame returning the current value unchanged.

#### Event System Efficiency

- Pointer events use a `Map<number, PointerSlot>` keyed by `pointerId` — O(1) lookups. Correct.
- Preference subscription uses a simple Set of callbacks iterated on change — correct, not hot.
- Resize uses a 120 ms debounce + single rAF — correct.

#### State Mutation Patterns

- `adaptiveQuality.evaluate()` acquires `performance.now()` on every call even when locked (always returns null). Minor — 1 `performance.now()` call per frame.
- `FrameBudgetMonitor.sample()` acquires `performance.now()` inside `snapshot()` — additional timing call inside an already-timed call.

---

### Phase 7: Memory and GC Analysis

#### Allocation-Heavy Code Paths

| Path | Allocation | Frequency | GC Impact |
|---|---|---|---|
| `FrameBudgetMonitor.sample()` | `FrameBudgetSample` object (8 fields) | 60×/second | Minor GC every 2–5s |
| `ProceduralTextureFactory.generate()` | `Uint8Array` 1–16 MB per role | Per new artwork | Major GC during startup |
| `GalleryManager.checkPanelClick()` | `new THREE.Vector2()` | Per pointer click | Negligible |
| `RendererManager.getRendererSnapshot()` | `new THREE.Vector2()` | Every 5s (diag mode) | Negligible |
| `diagnostics.*` calls | `{}` argument objects | Per diagnostic event | Minor (non-default mode only) |

#### Long-lived vs Short-lived Object Imbalance

**Long-lived (correctly retained):**
- All textures in `TextureManager.cache` — correct; these are expensive to reload
- All procedural textures in `ProceduralTextureFactory.cache` — correct; generation is expensive
- `EffectComposer` internal render targets — correct; framebuffer reallocation is expensive

**Short-lived and GC-eligible:**
- `FrameBudgetSample` objects — 60/second, should be pooled or mutated in-place
- Procedural `Uint8Array` temporaries — unavoidable but can be pooled across calls for the same tile size

#### Caching Opportunities

- `Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5))` — cache as module-level constant or class property
- `getZoomBounds()` result — cache for the duration of one `update()` call
- `getViewportMetrics()` result — cache for the duration of one `update()` call (already fresher than needed given 120 ms resize debounce)

---

### Phase 8: Prioritized Optimization Roadmap

#### Tier 1 — Critical Impact, Low Risk

| # | Optimization | Target | Expected CPU Gain | Expected GPU Gain | Memory Gain | Complexity | Risk |
|---|---|---|---|---|---|---|---|
| T1-A | Cache `fovTan` constant; memoize viewport metrics per-frame | CPU-1, CPU-2 | −0.5–2 ms/frame on mobile | None | None | Low | None |
| T1-B | Incremental rolling stats in `FrameBudgetMonitor` | CPU-4, MEM-2 | −0.05 ms/frame | None | −3.8 KB/s heap churn | Low | None |
| T1-C | Guard `console.debug` behind diagnostics mode | CPU-5 | −0.1–0.5 ms/navigation | None | None | Very Low | None |
| T1-D | Pre-allocate scratch vectors (Vector2) | MEM-3, MEM-4 | Negligible | None | Minor | Very Low | None |
| T1-E | Make side panels opaque (`transparent: false`) | GPU-3 | Negligible | Minor blend elimination | None | Very Low | None |

#### Tier 2 — Medium Impact, Moderate Complexity

| # | Optimization | Target | Expected CPU Gain | Expected GPU Gain | Memory Gain | Complexity | Risk |
|---|---|---|---|---|---|---|---|
| T2-A | Cache frame geometry by aspect ratio (skip rebuild on match) | GPU-4 | −1–5 ms/navigation | Eliminate GPU buffer upload | None | Medium | Low |
| T2-B | Disable bloom when effective contribution is below threshold | GPU-2 | None | −0.3–1 ms/frame GPU | None | Low | Low |
| T2-C | Reduce to 1 shadow-casting spotlight on balanced; disable on battery (already done) | GPU-1 | None | −25–50% base render cost | None | Low | Medium |
| T2-D | Eliminate redundant `updateMatrixWorld()` call | CPU-3 | ~0.01 ms/frame | None | None | Low | Low |

#### Tier 3 — Nice to Have, Architectural Refinement

| # | Optimization | Target | Expected CPU Gain | Expected GPU Gain | Memory Gain | Complexity | Risk |
|---|---|---|---|---|---|---|---|
| T3-A | Distance-based LOD for artwork plane vertex count | GPU-5 | Minor | −50× vertex count at overview | None | Medium | Medium |
| T3-B | Procedural texture generation via Web Worker | MEM-1, PIPE-1 | Remove from main thread during startup | None | Reduce main-thread GC | High | High |
| T3-C | Remove transparent side panel alpha channel entirely | GPU-3 | None | Eliminate alpha sort bucket | None | Very Low | None |
| T3-D | Dirty-flag update throttle (skip smoothDamp when settled) | CPU (frame idle) | −0.1 ms/frame at rest | None | None | Low | Low |

---

### Phase 9: Final Performance Report

#### Executive Summary

The FREYRAUM gallery runtime is well-architected for its use case: one artwork at a time, minimal scene graph, careful texture ownership. Draw call count is excellent (4–15 depending on preset). The primary optimization targets are:

1. **Per-frame CPU waste** in the viewport measurement cascade (CPU-1) and `FrameBudgetMonitor` linear scans (CPU-4) — both are purely algorithmic and carry no visual risk.
2. **GPU shadow map cost** (GPU-1) — shadow maps for 2–3 spotlights double the scene render cost for a single-object, flat-geometry scene where inter-object shadows are imperceptible.
3. **Navigation spike** from frame geometry rebuild (GPU-4) — affecting perceived responsiveness on navigation.
4. **Bloom at sub-perceptual strength** (GPU-2) — 10 framebuffer operations per frame for negligible visual output.

#### CPU Profile Summary

- **Heaviest per-frame path:** `galleryManager.update()` → `getViewportMetrics()` cascade (2–4 BoundingClientRect reads per frame)
- **Second heaviest:** `FrameBudgetMonitor.sample()` linear scans (O(3×60) per frame)
- **Both are fixable with zero visual risk**
- All other per-frame CPU costs are minor (lighting sin animation, smoothDamp, matrix transform)

#### GPU Profile Summary

- **Heaviest cost:** Shadow map render passes (2–3× render pass multiplier on high/balanced)
- **Second:** Bloom pass 10 ping-pong blits at near-zero contribution (high/balanced)
- **Third:** PBR painting material at ~23 texture reads/fragment under parallax+shadow (expected and correct for fidelity)
- **All of the above are presently accepted costs for the intended visual output** — the shadow and bloom optimizations require explicit acceptance testing to confirm no visible regression

#### Memory Profile Summary

- **No memory leaks detected** — ownership is clear, disposal is tracked
- **Primary GC pressure:** `FrameBudgetSample` (60 objects/second) and procedural Uint8Array temporaries during startup warmup
- **Both are addressable with Tier 1/Tier 2 changes**

#### Optimization Roadmap (Priority Order)

1. **T1-B** — `FrameBudgetMonitor` incremental stats + object reuse (minimal code, maximum GC win)
2. **T1-A** — Viewport metrics memoization + `fovTan` constant (best CPU/frame ratio)
3. **T1-C** — `console.debug` diagnostics guard (code quality + minor profiling improvement)
4. **T1-D / T1-E** — Vector2 reuse + side panel opacity (free wins)
5. **T2-A** — Frame geometry aspect cache (meaningful navigation smoothness improvement)
6. **T2-B** — Conditional bloom disable (free GPU frames on high/balanced)
7. **T2-C** — Shadow map count reduction on balanced (significant GPU win, needs visual validation)
8. **T2-D** — Eliminate redundant `updateMatrixWorld()` (trivial correctness check first)
9. **T3-D** — Dirty-flag idle throttle (reduces GPU/CPU when no animation is active)
10. **T3-A** — LOD vertex count (meaningful for overview distance; architectural)
11. **T3-B** — Worker-based procedural generation (only if startup time is measured as user-visible)

#### Architectural Recommendations

1. **Introduce a `FrameState` object** (pooled or mutated) computed once per tick and passed through the `update(now, frameState)` call chain — eliminates the `getViewportMetrics()` cascade by design.
2. **Adopt a dirty-render model** for the RAF loop: skip `postProcessing.render()` entirely when no animation is in progress (camera settled, no lighting animation, no user input for N frames). The `FrameBudgetMonitor` or a separate `AnimationStateMonitor` can track this. This is the single highest-impact architectural change available: it reduces GPU consumption to zero during idle gallery viewing.
3. **Explicit shadow map budget**: add a `shadowCastingLightCount: 0 | 1 | 2` field to `QualityPreset` rather than deriving it from `preset.shadows: boolean`. This enables per-profile tuning (e.g., inspection profile can enable 2 lights for raking shadow detail; gallery-soft only needs 1).
4. **Consider `renderer.setAnimationLoop(null)` + demand rendering** for a future "sleep when idle" feature. When the gallery is idle (user not interacting, no audio-driven effect, no animation), stop the RAF loop entirely and restart it on the next input event or `setTimeout` keepalive.

---

*Audit completed 2026-06-21. Scope: static analysis of src/ at v0.73 HEAD. No runtime profiling was performed — all estimates are derived from code structure analysis. Actual measurements via Chrome DevTools Performance panel and WebGL Inspector are recommended before implementing Tier 2/Tier 3 items.*
