# FINDINGS

## Active findings — documentation/tooling remediation (2026-06-21)

1. The primary drift source is duplicated status/config/runtime text across operational docs.
2. `docs/QUERY_PARAMETERS.md` already matches current startup/debug/backend/preferences implementation and should remain the sole config authority.
3. Dependency/tooling drift is present:
   - `eslint@8` is deprecated.
   - `@typescript-eslint` 7.x compatibility lags the locked TypeScript version.
   - `npm audit` reports vulnerabilities tied to transitive/tooling dependencies.
4. Lack of contributor-facing freshness rules and CI checks allows drift to re-accumulate.

## Decisions

- Keep historical rationale in `docs/archive/` rather than relying on Git history.
- Keep release history in `CHANGELOG.md`.
- Keep config tables exclusively in `docs/QUERY_PARAMETERS.md`.
- Use contributor policy + CI checks to prevent recurrence.

## Historical context

Long-form historical findings have been moved to:

- `docs/archive/findings-history-2026-06-21.md`

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


