# FREYRAUM lessons learned
> Last full markdown audit: 2026-05-22 (v0.29 runtime implementation shipped — metallic PBR frame M-01..M-08 completed; lint/build pass).

## 2026-05-22 — v0.29 shipped lessons

### Lesson 68 — Loaded is not presented

A readiness ledger can show textures, materials, shaders, and GPU warm flags while the user still sees a stale canvas or stretched prewarm frame. Future rule: entry readiness must include at least one full-size render and one subsequent presentation interval before the loader CTA appears.

### Lesson 69 — RAF must run while the loader is waiting, not only after it disappears

Starting RAF after `loadingOverlay.reveal()` resolves means the scene is not drawing during the entire user-wait and fade-out window. Future rule: the animation loop must exist and run under the opaque overlay before user entry is possible.

### Lesson 70 — Tiny prewarm renders are not final-frame proof

A 4×4 composer prewarm is useful for shader compilation, but it is not evidence that the final viewport-sized canvas is ready. Future rule: always follow tiny shader prewarm with final-size render/presentation gates before reveal.

### Lesson 71 — Color fidelity is a full pipeline property

Neutral tone mapping and sRGB textures are necessary but not sufficient. Lighting, material response, bloom, exposure, post-processing, and CSS/canvas opacity can still make paintings appear darker than the source. Future rule: dark-artwork complaints require end-to-end visual QA, not only renderer-setting changes.



## 2026-05-22 — v0.28 lessons

### Lesson 65 — NeutralToneMapping for artwork fidelity

`THREE.ACESFilmicToneMapping` applies an aggressive S-curve designed for photorealistic scenes. For artwork galleries where paintings are intentionally dark or high-contrast, this destroys the artist's colour intent. **Future rule:** always use `THREE.NeutralToneMapping` (Khronos PBR Neutral, Three.js r163+) with `exposure = 1.0` when the goal is faithful reproduction of original artwork colours.

### Lesson 66 — Start RAF render loop before overlay dismiss

When a loading overlay fades out with a CSS opacity transition, any canvas below must already be rendering. Starting the RAF loop after the overlay begins fading reveals the clear color (grey flash). **Future rule:** forward-declare the animate function and call `requestAnimationFrame` before `await overlay.reveal()` so the scene is fully pre-rendered behind the opaque overlay during the entire loading phase.

### Lesson 67 — Pre-rendering behind loading screen validates preload contract

With RAF running before reveal, the full gallery (all artworks, textures, shaders) renders continuously behind the loading screen. This makes the preload contract verifiable at runtime: if any artwork is not yet GPU-warmed, it shows as a missing frame behind the overlay rather than after user entry. **Future rule:** always ensure the scene is actively rendering during the loading phase — this proves the preload contract rather than trusting it on faith.




### Lesson 62 — EffectComposer silently bypasses native antialias

`THREE.WebGLRenderer({ antialias: true })` applies MSAA only to direct canvas draws. Once `EffectComposer` is introduced, the pass chain renders to an internal `WebGLRenderTarget` that has no multisample support. The renderer's `antialias` flag becomes a no-op. **Future rule:** whenever `EffectComposer` is used, always add an explicit post-process AA pass (FXAA/SMAA) as the final pass in the chain; never rely on `antialias: true` alone.

### Lesson 63 — compileAsync does not cover EffectComposer pass shaders

`renderer.compileAsync(scene, camera)` traverses `scene.traverse()` which only reaches user mesh objects. `EffectComposer` pass shaders (e.g. UnrealBloomPass's 4 internal programs) are stored on the `EffectComposer` passes themselves, not in the scene graph. They compile lazily on the first `composer.render()`. **Future rule:** always call an explicit `prewarmComposer()` (render at minimal size while covered) before the loading overlay is dismissed, any time an `EffectComposer` with multi-pass bloom or other heavy passes is used.

### Lesson 64 — Pseudo-class :hover rules must be CSSOM-resolved before user interaction

After enabling a previously-disabled button, the browser has not yet resolved applicable `:hover` pseudo-class styles or promoted the element to a compositor layer. First hover triggers style recalculation + layer promotion. **Future rule:** force CSSOM resolution with `void element.offsetHeight; void getComputedStyle(element).propertyName;` and set `will-change` immediately after the button becomes interactive, then remove `will-change` after first click.



### Lesson 60 — Loaded is not the same as GPU-ready

`TextureLoader`/`LoadingManager` success means the browser has fetched and decoded enough image data for a `THREE.Texture`; it does not prove that texture has been uploaded to GPU memory. Future performance plans must separately track CPU-loaded, material-bound, shader-compiled, and GPU-warmed states. **Future rule:** never describe a gallery as jank-free only because textures are preloaded; require proof that first navigation does not trigger texture load, procedural generation, shader compile, or GPU upload.

### Lesson 61 — Fixed warm limits must be documented as partial coverage

`GPU_WARM_LIMIT = 15` and `PBR_PRELOAD_LIMIT = 15` are valid memory guardrails, but they also define the exact point where large galleries return to best-effort warming. **Future rule:** when a performance fix has a count or memory cap, docs must state what happens beyond the cap and include a follow-up plan for budgeted continuation.

## v0.22 — shipped (2026-05-21) — Improved Preloading + Press-to-Start

**Status: shipped in runtime code and documentation.**

## 2026-05-21 — Idle-prefetch-after-reveal does not prevent first-navigation jank

- Scheduling texture prefetch via `requestIdleCallback` **after** the gallery is revealed is insufficient for users who navigate immediately. The idle callbacks fire when the browser is idle, which may be several seconds after the first navigation attempt. Users who navigate quickly will hit cold PBR texture loads and see visible stutter.
- Pre-v0.22 root cause: `GalleryManager.init()` only preloaded albedo textures, then returned. The idle sweep started too late; v0.22 moved capped PBR preload and GPU warm-up under the loading overlay.
- Future rule: **any texture set that must be available without jank must be fully loaded under the loading overlay, before `reveal()` is called.** Idle-time prefetch is appropriate only as a second-chance retry for failures or for assets that are genuinely optional (e.g., off-screen artworks in a 50+ collection where upfront loading is impractical).

## 2026-05-21 — GPU warm render must cover all artworks, not just the first

- A single `renderer.render(scene, camera)` call uploads only the textures currently bound to the active scene mesh. This covers artwork 0 only. Artworks 1–N still incur a CPU→VRAM stall on first navigation.
- Future rule: **if zero-stall first render is required for all artworks, iterate through all artworks under the loading overlay**, temporarily bind each texture set to the mesh, render once, restore. Guard with a max-artwork count (e.g., 15) so the warm sweep does not extend the loading screen excessively for large galleries.

## 2026-05-21 — "Press to Start" is not just UX polish — it solves audio + GPU timing

- Auto-revealing the gallery on technical loading completion creates three problems: (1) user may not be looking when the reveal happens; (2) browser AudioContext start is not tied to a user gesture, risking autoplay policy failures; (3) GPU warm-up render passes may still be in progress at reveal time.
- A "press to start" / "Galerie betreten" button solves all three: it is the user's deliberate first gesture, it cleanly starts the AudioContext, and it happens after all warm passes complete.
- Future rule: **loading screens for immersive WebGL/audio experiences should always require a deliberate user action to enter, not auto-reveal.** This is an industry standard for gallery, game, and experience-driven web applications.

## 2026-05-21 — Audio gesture listeners must be registered BEFORE the press-to-start await

- In the v0.22 plan (M-03), audio recovery `pointerdown` listeners were originally placed after `await loadingOverlay.reveal()`. This means the button click is not captured by the audio recovery path — the listener is registered AFTER the gesture has already happened.
- The button click on the "Galerie betreten" overlay IS the first user gesture and the optimal AudioContext start point. Registering listeners post-reveal misses this window entirely.
- Future rule: **any listener that must capture the first user gesture (for audio context, autoplay recovery, etc.) must be registered before `await reveal()`, not after.** The `await` is a blocking yield point — code after it runs only after the gesture.

## 2026-05-21 — TypeScript interface changes are compilation blockers, not implementation details

- The `LoadingOverlayControls` interface at `main.ts:45` declares `reveal(): void`. Changing the implementation to return `Promise<void>` without updating the interface is a TypeScript compilation error, not just a type mismatch. It will block the entire build.
- Future rule: **whenever a method return type changes (especially from `void` to `Promise<void>` or vice versa), update the interface declaration first**, before writing any call-site code that depends on the new type. Interface changes are always step 1, not step N.

## 2026-05-21 — Preload limits must account for peak CPU memory, not just GPU memory

- The v0.22 L-01 plan draft iterated all artworks without a count limit. For a 50-artwork gallery with 7 PBR maps per artwork at 2048×2048 (16 MB each uncompressed), peak CPU memory before GPU upload would be 5 600 MB. This OOMs any mobile device and most mid-range desktops.
- GPU memory (VRAM) is the concern usually discussed in WebGL performance planning. CPU memory (heap) is equally finite and silently causes browser tab crashes.
- Future rule: **any preload strategy that decodes a bounded number of textures into CPU memory must calculate worst-case peak heap usage before choosing a limit.** For multi-map PBR sets, the per-artwork cost is 7× a single texture. Use `PBR_PRELOAD_LIMIT = 15` as a named constant with a comment stating the memory derivation.

## 2026-05-21 — Synchronous cache reads are always preferable to async re-loads

- The v0.22 L-02 plan described `prepareArtworkForWarmRender()` as async. After L-01 runs, all textures within `PBR_PRELOAD_LIMIT` are already in `TextureManager.cache` with keys `"${role}::${url}"`. A cache hit is synchronous — no network, no Promise needed.
- An unnecessary `async/await` around a synchronous operation wastes one event-loop microtask turn per artwork in the warm loop (15 artworks = 15 microtask yields), adds confusing `await` syntax at the call site, and misleads readers into thinking network I/O might occur.
- Future rule: **a method that only reads from an in-memory cache must be synchronous.** Reserve `async`/`Promise` for methods that may trigger I/O (network, file system, IndexedDB). Add a JSDoc precondition comment when a method requires callers to have pre-populated the cache.

## 2026-05-21 — Interval timers must be stopped when their output is superseded

- `createLoadingOverlay()` starts a 2 s hint-cycling interval. `reveal()` overwrites `subtitle.textContent` to "Galerie bereit — zum Starten klicken". But the interval still fires 2 s later, overwriting the ready-state message back to a cycling hint.
- Future rule: **any DOM text element that is set to a terminal (final/permanent) value must have its update interval cleared at that point.** Do not rely on `dispose()` — `dispose()` is called after user interaction, which may be many seconds after the terminal value is set.

## 2026-05-21 — `renderer.render()` is the only mechanism to force CPU→VRAM texture upload

- `renderer.compile(scene, camera)` compiles shader programs but does NOT trigger texture upload. `texture.needsUpdate = true` marks a texture for re-upload but upload still only occurs during the next render that uses the texture. There is no direct WebGL API to upload a texture outside of a draw call.
- Future rule: **to guarantee a texture is in VRAM before user interaction, it must be bound to the active scene mesh and the scene must be rendered at least once.** This must happen under the loading overlay so users see no visual artifact from the intermediate bind.

## 2026-05-21 — implementation shipped (2026-05-21)

Current status: shipped. The v0.21 plan is implemented in runtime code and documentation: branded progress loading overlay, Three.js LoadingManager progress, pre-reveal GPU warm render + awaited shader prewarm, audio `preload='auto'`, adjacent/idle PBR prefetch, lighting resume clamp, WebGL restore status, max-texture diagnostics, shader precision guard, 16K importer guidance, global pointer tracking, timeline arrows/counter/edge fades/responsive sizing/virtualized large-list rendering, and cleanup for added global listeners. Future-only boundaries remain LOD/tiled streaming for device-limited 16K detail and grouped/page timeline navigation for very large exhibitions.


## 2026-05-21 — Always verify plan descriptions against actual source before documenting patches

- The v0.21 K-series pass found two critical factual errors in the existing plan: G-01 claimed prewarm was "never called" when it was called (just at the wrong time and as `void`); H-03 claimed `maxTextureSize` was "stored but never consulted" when it was never stored as a field at all.
- Patch code that depends on a field that doesn't exist, or that moves code that doesn't exist, will fail immediately on implementation.
- Future rule: **before writing a plan entry that says "X is stored but not used" or "Y is never called", run a grep for the exact symbol and read the relevant lines.** Do not rely on second-order inference. Document the exact line numbers and the exact code pattern you found.

## 2026-05-21 — Delta clamping must cover every time-driven subsystem

- `GalleryManager` has `MAX_SMOOTHING_DT = 0.1` to prevent zoom/pan jumps after a backgrounded tab. `LightingSetup` uses an absolute `DOMHighResTimeStamp` directly, so the guard never applied to it — the key light could snap discontinuously on resume.
- Future rule: **every subsystem that advances a value based on `requestAnimationFrame` timestamp must clamp its inter-frame delta**, either using the shared `MAX_SMOOTHING_DT` constant or its own equivalent guard. Never assume that gating in one file covers related files.

## 2026-05-21 — Stored capabilities must be actively guarded

- **Corrected from v0.21 audit:** `TextureManager` does **NOT** store `renderer.capabilities.maxTextureSize` as a class field — only passes it to a diagnostics log call in `init()`. It was never assigned to `this.maxTextureSize`. A capability that is only logged, not stored, cannot guard anything.
- Future rule: **every stored device capability should have a corresponding runtime guard** — at minimum a diagnostic warning — so mismatches are surfaced before they corrupt the render. And verify the field actually exists before writing plan patches that reference it.

## 2026-05-21 — Importer thresholds age with the device landscape

- `import-artworks.mjs` was last calibrated in v0.16 against 2016-era phone limits (4096 px, 64 MB). By 2024, the same hardware ceiling is 16 384 px on all modern desktop GPUs and many flagship phones. The v0.16 guidance was actively harmful: it told customers to destroy 16K source images that modern browsers can display correctly.
- Future rule: **hardware threshold constants in the importer must include a citation to the source spec and the year they were verified.** When the device landscape changes, outdated thresholds must be updated alongside the guidance text.

## 2026-05-21 — GLSL precision must be declared for high-resolution UV work

- Default fragment shader precision is `mediump` on mobile GPUs. For a 16K base texture with 128× detail tiling, computed UVs can reach values where `mediump float` loses fractional bits, causing visible seaming. Three.js does not inject `highp` on behalf of `onBeforeCompile` patches.
- Future rule: **any injected GLSL block that operates on UV coordinates with large multipliers must explicitly declare `precision highp float;`** under a `#ifdef GL_FRAGMENT_PRECISION_HIGH` guard. Never rely on the default fragment precision when UV values may exceed single-digit ranges.



## 2026-05-21 — `void` and post-sequence placement defeat optimizations

- **Corrected from v0.21 audit:** `RendererManager.prewarm()` was called in the boot path — but as a fire-and-forget `void` call, approximately 250 lines after the loading overlay already hides. Two separate bugs: (1) wrong placement (post-overlay), and (2) non-awaited (`void`). Both must be fixed.
- Future rule: every performance utility (prewarm, prefetch, warm render) must have a call site in the boot sequence documented alongside its definition. The call must be `await`-ed if the optimization only helps when complete before user interaction.

## 2026-05-21 — Loading screens should brand and inform, not just block

- The v0.21 audit found the loading screen was a plain white spinner with no FREYRAUM branding, no progress indication, and no user engagement. Users seeing a white screen with a small spinner have no context that the experience will be immersive.
- Future rule: loading screens must show brand identity (wordmark/logo), real progress feedback (not just a spinner), and at minimum a hint of the visual theme before the gallery reveals.



## 2026-05-21 — Close plans in code and docs together

- The v0.20.7 plan contained actionable source-level patches and customer-facing wording risks. Completing the plan required both code changes and an all-markdown status refresh so shipped behavior and docs stayed aligned.
- When a regression-recovery plan is complete, remove or supersede “under repair” guidance from AI prompts, customer guides, architecture notes, and maintenance docs in the same pass.

## 2026-05-21 — Never let live fade volume overwrite the user target

- The v0.20.4 follow-up introduced a critical audio-state bug: `BackgroundAudioManager.play()` starts from `audio.volume = 0`, and the `volumechange` listener then feeds that transient value back into the shared state.
- Future rule: keep **target loudness** separate from **live element loudness**. UI rendering, persistence, and mute recovery must use the target value; fade envelopes may only control the live element value.

## 2026-05-21 — Volume mappings must match the exact product contract

- The existing power-curve implementation matched only one example point (50% → ~15%) but not the full stated requirement (`0..30% effective mapped to 0..100% display`).
- Future rule: whenever a user defines a bounded display range, encode the entire mapping contract explicitly and verify both midpoint and endpoints before documenting it as fixed.

## 2026-05-20 — Volume UX changes need explicit mapping contracts

- The current audio system stores linear gain and exposes linear sliders, but product requests now require “balanced display” behavior with calmer effective startup loudness.
- Future rule: whenever UX wording and technical gain model diverge, define explicit forward + inverse mapping helpers and reuse them across defaults, persistence, UI rendering, and diagnostics.

## 2026-05-20 — High-frequency controls should avoid full DOM re-render loops

- Preferences slider continuity risk is caused by full panel `innerHTML` replacement on each preference change.
- Future rule: for range sliders and other high-frequency controls, keep stable DOM nodes and patch values in place; avoid replacing active controls during pointer drag.

## v0.20 implementation note — audio reliability shipped (2026-05-20)

Lesson carried forward from this pass: once customer-facing workflows ship, all markdown banners must be flipped from planned to implemented in the same PR to avoid stale guidance.

## v0.18 — Customer sidecar text shipped (2026-05-20)

Current status: shipped. The importer (`scripts/import-artworks.mjs`) reads same-basename `.txt` sidecars (`.md` accepted as a backup) and merges customer-facing metadata into the generated manifest. Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned. Canonical plan: `plan.md § v0.18`. Research log: `FINDINGS.md § 2026-05-20`. Customer guide: `docs/CUSTOMER_TEXT_GUIDE.md`. Template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.

Use this file for durable lessons that should change future agent behavior.

## 2026-05-19 — CSS containment can break controls that need overflow paint

- Observed in v0.16.1/v0.16.2: applying paint containment around `.prefs` clipped the preferences popover, and applying it around `.nav-controls` clipped hover-scaled buttons.
- Future rule: never add `contain: paint` or `contain: layout paint` to popover anchors, hover-scaled controls, or animation shells unless overflow paint has been verified in the built preview.

## 2026-05-19 — Preview output must be rebuilt after source/style changes

- Several customer-facing fixes require `customer-preview/` to match `src/` and `app.html`.
- Future rule: when runtime or SCSS changes affect shipped behavior, run the existing build and commit the regenerated preview output.

## 2026-05-19 — Fresh clones need dependencies installed before validation

- `npm run lint` and `npm run build` fail in a fresh sandbox before `npm install` because local binaries and packages are unavailable.
- Future rule: treat pre-install validation failures as environment setup failures, then rerun after install.

## 2026-05-19 — Reduced motion is not reduced fidelity

- A prior regression coupled motion preference to painting texture/shader detail.
- Future rule: accessibility motion settings should reduce movement only; quality presets remain responsible for visual fidelity.

## 2026-05-19 — Floating tool versions can create validation noise

- The audit install resolved TypeScript 5.9.x, and lint passed while printing an `@typescript-eslint` supported-version warning.
- Future rule: treat tooling range drift as maintenance debt. Align TypeScript, typescript-eslint, and ESLint in a dedicated upgrade pass rather than mixing it into feature work.

## 2026-05-19 — npm audit fixes may require major tooling upgrades

- `npm audit` currently reports moderate Vite/esbuild dev-server advisories, but npm's available fix points to a semver-major Vite upgrade.
- Future rule: document advisories during audits and reserve forced/major dependency upgrades for focused PRs with full validation.

## 2026-05-20 — Custom role=dialog elements need explicit aria-modal + aria-labelledby

- `PreferencesPanel` had `role="dialog"` and `aria-label` but no `aria-modal="true"`. Screen readers were not treating background content as inert while the panel was open.
- Additionally, `handleOutsideClick` closed the panel but did not return focus to the trigger — only the Escape path did. WCAG SC 2.4.3 requires focus to return to the opener on any dismiss path.
- Future rule: every custom `role="dialog"` element needs `aria-modal="true"`, `aria-labelledby` pointing to a stable heading id, and focus returned to the trigger on every dismiss path (Escape, outside-click, close button).
- Source: <https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/>

## 2026-05-20 — Verify caller graphs before every dead-code cleanup

- Three interaction files (`MouseInteraction.ts`, `TouchInteraction.ts`, `ZoomPan.ts`) and one deprecated export (`isMobileDevice()`) were confirmed caller-free by grep before deletion. No runtime errors resulted.
- Future rule: before removing any exported symbol, grep all source and test files for its name; proceed only when no non-comment match is found.

## 2026-05-20 — Planned customer workflows must stay clearly labeled as planned

- Draft guides and templates for future customer workflows can easily read like shipped behavior if they use present-tense instructions.
- Future rule: whenever documentation describes an unimplemented workflow, mark it as draft/not-yet-shipped in the intro and repeat the current runtime behavior so customers are not misled.

## 2026-05-20 — Promote draft docs in the same pass as the implementation

- v0.18 shipped sidecar text by updating `scripts/import-artworks.mjs` and then immediately rewriting `docs/CUSTOMER_TEXT_GUIDE.md`, `ARTWORK_TEXT_TEMPLATE.txt`, README, CHANGELOG, HANDOFF, IMAGE_MAINTENANCE_GUIDE, CUSTOMER_PICTURE_GUIDE, DOCUMENTATION_RULES, ARCHITECTURE_MAP, AI_RULES, and FINDINGS from "planned" to "shipped" wording.
- Future rule: when an audit produces draft customer docs ahead of code, the implementation PR must also flip all "planned/not yet shipped" wording in one pass so customers and contributors never see stale labels next to live behavior.

## 2026-05-20 — Sidecar parsing must distinguish "omitted" from "blank"

- v0.18 uses `??` to merge sidecar values so an omitted field falls back cleanly while a blank field still warns. Mixing the two cases hides typos (blank `Title` looks the same as a deleted line).
- Future rule: when adding optional customer-edited fields, separate "present but blank" (warn) from "omitted entirely" (silent fallback). Use `Object.prototype.hasOwnProperty.call(fields, key)` for the distinction, not `!fields[key]`.

Extended incident documentation belongs in `docs/lessons-learned/`.
