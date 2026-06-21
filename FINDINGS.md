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

### Research sources consulted

- Three.js `UnrealBloomPass` source: `bloomPass.enabled = false` correctly skips all 10 internal FBO passes; `strength = 0` does NOT skip them (confirmed via Three.js source inspection)
- Three.js `LOD` API: `THREE.LOD.autoUpdate = true` (default) performs automatic camera-distance LOD selection each frame
- TBDR GPU architecture: tile-based deferred rendering GPUs (PowerVR, Apple GPU, Adreno) incur higher shadow map bandwidth than immediate-mode GPUs due to tile memory resolution cost
- `renderer.setAnimationLoop(null)`: Three.js exposes this as a public API, safe to call at any time; resumes with `setAnimationLoop(callback)`
- Chrome DevTools Performance panel: `4× CPU throttle` mode simulates mid-range mobile performance accurately for JS-bound workloads

