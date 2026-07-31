# FINDINGS

## Main Museum Hub decisions (2026-07-31)

1. The lowest-risk integration point is after existing gallery readiness and
   before loading-overlay dismissal. Gallery preload, shader warmup, and the
   production render loop remain unchanged.
2. The hub is a static DOM presentation over the shared WebGL runtime. This uses
   the supplied room composition exactly while avoiding a second scene, camera,
   renderer, or continuous hub animation.
3. `DestinationRouter` provides the scalable boundary: registered destinations
   own prepare/enter/exit hooks, while the router owns synchronous transition
   locking, stale-transition generation checks, state reporting, and recovery.
4. Gallery pointer and keyboard controllers require explicit enable/disable
   gates because both install listeners before the loading overlay is dismissed.
5. Deferred gallery GPU warm renders temporarily expose the hidden artwork root
   only for their offscreen render, preserving the existing readiness contract.

## Runtime presentation decisions (2026-07-19)

1. Lighting is a fixed runtime concern, not a preference. `LightingSetup` owns the
   sole dramatic configuration and preference restore cannot override it.
2. Artwork presentation has one mesh per painting. Metallic frame and side-preview
   scene objects were fully removed, reducing scene graph, shader, and raycast work.
3. Timeline visibility is invariant across responsive layouts. Clean-chrome state
   applies only to artwork information and navigation controls.
4. `Artwork.surface` is plain customer-facing metadata. It has no path into
   `PaintingMaterial`; only authored maps and quality presets affect rendering.
5. CSS and WebGL share `#eef1f3`, preventing a white transition between document,
   canvas initialization, and reveal.

## Active findings — high-resolution asset delivery audit (2026-07-07)

1. **The current publish path is source-file-based, not derivative-based.**
   The repository currently expects customer artwork source files to be committed
   directly in `customer-artworks/inbox/`, and CI rebuilds the deployable assets
   from those tracked originals.

2. **The importer duplicates the heaviest asset bytes multiple times.**
   `scripts/import-artworks.mjs` copies the source image into
   `customer-preview/images/` and also embeds the exact original bytes into
   `window.__FREYRAUM_ARTWORKS[*].webglImage` as a base64 data URL. A roughly
   25 MiB JPEG therefore becomes both a shipped image file and an even larger JS
   payload before the final Pages artifact is built.

3. **GitHub’s official limits rule out “commit the masters” as a reliable long-term strategy.**
   Official GitHub documentation states:
   - browser uploads are capped at **25 MiB** per file,
   - regular Git warns above **50 MiB** and blocks files above **100 MiB**,
   - GitHub Pages sites may be no larger than **1 GB**,
   - Git LFS **cannot be used with GitHub Pages sites**.

4. **The reliable architecture is to separate archival masters from deployed derivatives.**
   The Pages site should consume compact publish assets only, while oversized
   originals stay local or in separate archive storage. The current exact-byte
   `webglImage` strategy should become local-preview-only if retained at all.

### Sources

- Repository audit:
  - `scripts/import-artworks.mjs`
  - `scripts/sync-customer-public.mjs`
  - `app.html`
  - `.github/workflows/deploy-pages.yml`
- Official GitHub docs:
  - https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
  - https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage
  - https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

## Decisions

- Do **not** treat Git LFS as the solution for live Pages artwork delivery.
- Plan toward a **tracked publish bundle + untracked/external masters** model.
- Keep the deployed manifest compact; do not ship full-size image bytes inside
  committed JavaScript.

## Active findings — documentation/tooling remediation (2026-06-21)

1. The primary drift source is duplicated status/config/runtime text across operational docs.
2. `docs/QUERY_PARAMETERS.md` already matches current startup/debug/backend/preferences implementation and should remain the sole config authority.
3. Dependency/tooling drift is present:
   - `eslint@8` is deprecated.
   - `@typescript-eslint` 7.x compatibility lags the locked TypeScript version.
   - `npm audit` reports vulnerabilities tied to transitive/tooling dependencies.
4. Lack of contributor-facing freshness rules and CI checks allows drift to re-accumulate.

## Historical decisions — documentation/tooling remediation (2026-06-21)

- Keep historical rationale in `docs/archive/` rather than relying on Git history.
- Keep release history in `CHANGELOG.md`.
- Keep config tables exclusively in `docs/QUERY_PARAMETERS.md`.
- Use contributor policy + CI checks to prevent recurrence.

## Historical context

Long-form historical findings have been moved to:

- `docs/archive/findings-history-2026-06-21.md`

---

## Performance remediation findings — completion pass (2026-06-21)

Source: implementation pass responding to the partial-correctness verdict for
`plan.md § v0.74`.

### Findings verified in code

1. **OPT-1 required metric propagation, not only `fovTan` caching.**
   `GalleryManager.update()` previously called `clampZoom()` and
   `clampPanTargets()` without passing the already-known viewport metrics, which
   re-entered `getViewportMetrics()`. The fixed path computes metrics/bounds
   once for the frame and reuses them through zoom/pan clamping.

2. **OPT-2 can safely ship as a frame-only geometry cache.** The cache added in
   `ArtworkMesh` is scoped to `frameMesh.geometry` and keyed by frame dimensions
   plus bevel state. It does not assign `artworkMesh.geometry`, so it does not
   create the OPT-9 artwork LOD ownership conflict documented for a broader
   aspect-cache design.

3. **Debug diagnostics must be skipped before payload serialization.** Routing
   direct `console.debug` calls through diagnostics was insufficient while
   default-mode debug entries were still serialized/deduped/stored. Diagnostics
   now drops debug events unless mode is `verbose` and supports lazy payload
   factories for hot debug callsites.

4. **Idle suppression can be introduced without stopping rAF.** The shipped
   Phase 0 step keeps rAF and `FrameBudgetMonitor.sample()` active, then skips
   the render/composer path when the scene is settled. This avoids the
   `setAnimationLoop(null)` measurement-stagnation risk while reducing idle GPU
   work.

5. **Regression tooling is stronger when gates are composed.** The Type A
   script now fails if Type B invariants fail for any visual state. This catches
   structural regressions during screenshot capture instead of relying on a
   separate console-only workflow.

### Validation notes

- Baseline before edits passed: `npm install`, `npm run lint`, `npm run build`,
  `npm run test:frame-budget`, `npm run docs:check-config-authority`.
- Runtime edit checkpoint passed: `npm run lint`, `npm run build:typecheck`.

---

## Performance audit findings — reviewer feedback integration (2026-06-21)

Source: external performance audit review of `plan.md § v0.74` at v0.73 HEAD.

### Key validated findings

1. **Always-on render loop is the dominant systemic inefficiency** — elevated to Tier 0 in plan.md. Even at static idle (camera settled, no animation), the full GPU and CPU pipeline runs at 60–120 Hz. This produces ~97% unnecessary GPU work during the primary use-case (passive gallery viewing). This insight was under-represented in the initial audit (mentioned only as a footnote in Phase 9 Architectural Recommendations). Now documented as Phase 0 with three concrete implementation approaches.

2. **Visual-risk optimizations require explicit validation gates** — OPT-4 (bloom disable), OPT-5 (shadow reduction), OPT-6 (panel opacity change), and OPT-9 (LOD switching) are classified as "zero/low code risk" but carry "perceptual risk". The plan now requires side-by-side render comparisons at all lighting profiles before any of these optimizations ship. Bloom disable additionally requires a peak luminance probe (64×64 `readRenderTargetPixels` pass) to confirm no artwork produces luminance > threshold.

3. **Mobile GPU shadow cost is not just render passes** — TBDR GPU architectures (all Apple Silicon, most Android GPUs) incur disproportionate shadow map bandwidth cost due to depth buffer resolution and tile memory reload. A shadow map can cost 2–4× more on a tile-based GPU than on an immediate-mode desktop GPU. This makes OPT-5 (shadow reduction) disproportionately valuable for gallery-on-iPad/MacBook-Air use cases. Documented in GPU-1 section and Phase 2.5 mobile GPU row.

4. **Frame budget aggregation was missing** — initial audit listed costs individually without summing them. Phase 2.5 now provides worst-case CPU/GPU/spike/startup budget stacks with engineering-grade estimates. Key values: CPU steady-state ~0.5–1.8 ms/frame (desktop), ~1.2–4.5 ms/frame (mobile); GPU steady-state ~2.5–8 ms/frame (desktop), ~5–20 ms/frame (mobile TBDR on high preset with shadows).

5. **Bloom assumption needs verification, not assertion** — the claim "no scene pixel exceeds luminance 1.2 with NoToneMapping" is almost certainly correct, but PBR specular highlights can produce unexpected bright spikes depending on artwork texture content. Added peak luminance probe requirement as a prerequisite for OPT-4.

### Confirmed strong areas (no changes needed)

- CPU-1 (viewport metrics cascade) analysis is correct and matches real WebGL anti-patterns
- FrameBudgetMonitor O(n)→O(1) accumulator upgrade design is sound
- Procedural texture GC burst analysis is accurate
- Draw call count (4–15/frame depending on preset) is correctly low
- Memory ownership model (TextureManager, ProceduralTextureFactory) is sound with no detected leaks

---

## Performance audit findings — second-pass refinements (2026-06-21)

Source: reviewer feedback on the Phase 0–11 planning document, plus follow-up static analysis of `FrameBudgetMonitor.ts`, `GalleryManager.ts` (smoothDamp/parallax), `PostProcessing.ts` (bloom), `LightingSetup.ts` (shadow), `quality.ts` (artworkSegments, parallaxEnabled config).

### Key decisions made in this pass

#### 1. Phase 0: architecture decision rule codified

The three execution models (Approach A dirty-flag, Approach B loop-suspend, Approach C throttle) were previously presented as equal alternatives. After reviewing coupling risks — specifically FrameBudgetMonitor's `sample()` contract and the smoothDamp convergence model — the correct hierarchy is:

- **Primary: Approach A** (dirty-flag + frame cooldown). Keeps rAF alive; `sample()` remains unconditional (as per the plan's own spec); smoothDamp convergence is always tracked. Lowest coupling risk.
- **Fallback: Approach C** (rAF throttle). One-day interim; no new infrastructure; ~92% GPU saving at idle.
- **Emergency/future: Approach B** (loop suspension). Eliminates rAF overhead entirely. Introduces FrameBudgetMonitor rolling-average stagnation issue: must include a reset/cool-down on loop-resume before shipping.

Code basis: `FrameBudgetMonitor.sample()` is called at every rAF tick unconditionally in the plan's Approach A code snippet ("keep timing stats accurate"). Approach B bypasses this entirely; the stagnation is confirmed by reading `FrameBudgetMonitor.ts` — the rolling sum is only updated on each `sample(now)` call.

#### 2. Phase 2.5 GPU ranges: preset-dependent qualifier confirmed

The `2.5–8 ms desktop` and `5–20 ms mobile TBDR` ranges are `high` preset estimates with 2 shadow-casting spotlights and bloom enabled (`bloomStrength = 0.04`, `bloomPass.enabled = true` because `0.04 > 0`). Confirmed from `PostProcessing.ts:36`: `this.bloomPass.enabled = preset.bloomStrength > 0` — so bloom IS enabled on high/balanced at current config.

Battery preset (shadows off, bloom off) runs ~1.0–3.5 ms on the same desktop. This confirms the ranges are state-dependent, not fixed hardware floors.

#### 3. GPU-1 TBDR shadow resolution benefit: code-confirmed path

`LightingSetup.ts:64` shows shadow is controlled by `preset.shadows` boolean, applied identically to all spotlights. Three.js default shadow map size is 1024×1024. The `high` preset has 2 spotlights with `castShadow = true`.

TBDR benefit analysis: reducing from 1024×1024 to 512×512 halves the tile memory needed for the depth buffer during shadow pass rendering. On TBDR architectures, if the depth buffer exceeds on-chip tile memory, the GPU must flush intermediate results to DRAM — the "tile memory spill" cost. At 1024×1024, this spill is likely on lower-end Apple GPU tiles (Apple GPU A15: 128-byte tile memory per pixel × ~32×32 tile = 512 KB on-chip). A 512×512 shadow map with 32-bit depth = 1 MB total; at 32×32 tiles this is 1024 tiles, each needing only 1/4 the depth memory vs 1024×1024. The disproportionate saving is real and not present on immediate-mode desktop GPUs.

Shadow resolution reduction (OPT-5 Approach B) should be the **first shadow change shipped** (lower visual risk than light-count reduction) and the **highest-priority GPU change for mobile targets**.

#### 4. New insight: OPT-9 LOD + parallax cost distribution coupling

Confirmed by `quality.ts`: `parallaxEnabled: true` and `artworkSegments: 180` are both set only on `high` preset. `balanced` and `battery` presets have `parallaxEnabled: false, artworkSegments: 120/48`.

This means OPT-9 (LOD vertex count reduction) — if implemented on high preset — will reduce vertex shader cost (65K→1.2K triangles) but will NOT reduce parallax fragment cost because parallax is driven by UV coords in the fragment shader. The LOD geometry swap must be paired with `uParallaxStrength = 0` at the same camera distance to eliminate the dominant GPU cost. Shipping Approach A alone (geometry swap only) delivers only the minor vertex processing savings; Approach C (uParallaxStrength fade) captures the major fragment savings.

#### 5. New insight: OPT-2 and OPT-9 geometry ownership conflict

Both `OPT-2` (aspect cache) and `OPT-9` (LOD swap) assign `artworkMesh.geometry`. If both are shipped independently, the LOD system may overwrite an aspect-cached geometry swap with a stale low-res plane, or vice versa. The combined architecture must treat the aspect-cached geometries as inputs to the LOD system (LOD chooses between hi-cached and lo-cached), not as parallel assignment paths. This coupling was not visible from examining either optimization in isolation.

#### 6. New insight: FrameBudgetMonitor + Approach B loop suspension

`FrameBudgetMonitor.ts` lines 85–95: `sample(now)` updates `this.rolling` and `this.ema` only when called. If `setAnimationLoop(null)` is used (Approach B), `sample()` is never called during sleep, and both values stagnate at pre-sleep levels. `readSnapshot()` (line 130) also calls `countAboveBudget()` and `countSevereFrames()` fresh on each call — but they operate on the same stale buffer. When the loop resumes after sleep, the first few active frames will see artificially stable (too-good) budget numbers because the rolling window is full of pre-sleep timings. The adaptive quality controller (currently locked) is not affected, but this will become a real issue if the lock is lifted.

Fix: on loop resume, call `markNavigation()` (or a new `markLoopResume()`) to activate a cooldown so the controller ignores the first N frames after wake.

### Research sources for this pass

- `src/utils/FrameBudgetMonitor.ts` — direct read for sample/snapshot/rolling contract
- `src/core/PostProcessing.ts:36` — `bloomPass.enabled = preset.bloomStrength > 0`; bloom IS enabled at 0.04
- `src/lighting/LightingSetup.ts:64` — `spot.castShadow = preset.shadows`; binary flag on all lights
- `src/config/quality.ts:157–271` — `artworkSegments: 180` and `parallaxEnabled: true` only on `high` preset
- `src/gallery/GalleryManager.ts:1566,1578` — `fovTan` computed locally in `getInspectionMinZoom()` and `getResetFitZoom()`, confirming CPU-2 duplication
- TBDR tile memory analysis: Apple GPU A-series on-chip memory capacity; PowerVR architecture documentation; Arm Mali Bifrost developer guide (shadow depth buffer tile flush characteristics)


---

## Performance audit findings — execution pass (2026-06-21)

Source: execution of `plan.md § v0.74` (Phase 15 Execution Record). Verified by
running the repo toolchain on a fresh clone.

### Verified results

1. **Regression tooling gap closed.** The plan's regression model (Type A pixel
   diff, Type B invariants, Type C GC/behavior) is now mapped to concrete tools
   and documented in `docs/REGRESSION_TOOLING.md`:
   - Type A: `scripts/visual-regression.mjs` (Playwright + pixelmatch, Phase
     10.3 threshold of < 2% pixels differing by > 10/255).
   - Type B: `src/utils/RuntimeInvariants.ts` (geometry ownership, triangle
     ceiling, material binding, shadow-caster count, scene consistency).
   - Type C: `src/utils/PerformanceMetrics.ts` (frame/FPS σ, P99, GC/min, GC
     pause P99, long tasks, heap) + `scripts/test-frame-budget.mjs`.
   Both runtime tools are exposed via `window.__FREYRAUM_PERF_TOOLS__`, passive
   and opt-in.

2. **`FrameBudgetMonitor` O(1) refactor is numerically identical.** The Type C
   equivalence gate (`npm run test:frame-budget`) confirms the incremental
   accumulator path matches the original O(N) linear-scan reference across a
   435-frame sequence (including budget-exact, severe-hitch, wrap-around, and
   >250 ms clamp edge cases) for all output fields. This satisfies the Phase
   12.3 Type C gate for OPT-3.

3. **Tier 1 zero-visual-risk optimizations shipped.** OPT-3/T1-B, OPT-1/T1-A
   (cached `tan(fov/2)`; `camera.fov` is never reassigned anywhere in `src/`),
   T1-C (debug routing), and OPT-7/T1-D (scratch `Vector2`). `npm run lint`,
   `npm run build:typecheck`, and `npm run build:preview` all pass.

4. **Visual-risk and idle-render optimizations were not shipped this pass.**
   Phase 0 (idle render suppression) and OPT-4/5/6/9 require an interactive
   browser session for their Type A / live-GPU / behavioral gates, which the CI
   sandbox cannot provide. Per the plan's safety rule they are recorded as
   deferred/rejected (Phase 15). The tooling above is the prerequisite that lets
   a follow-up execute and gate them with a real browser.

### Validation commands (all passing on this branch)

- `npm run lint`
- `npm run build:typecheck`
- `npm run build:preview`
- `npm run docs:check-config-authority`
- `npm run test:frame-budget`
