# FREYRAUM architecture map
> Last full markdown audit: 2026-05-21 (v0.22 planned — guaranteed jank-free gallery via full PBR pre-load under loading overlay + "Galerie betreten" press-to-start button + GPU warm-all artworks).

## v0.22 — planned (2026-05-21) — Guaranteed Jank-Free Gallery + Press-to-Start

**Status: planned — not yet in runtime code.**

### L-series: Full pre-load + press-to-start

| Gap | Component | Status |
|-----|-----------|--------|
| L-01 | `GalleryManager.init()` — only albedo preloaded; PBR sets 2–N loaded on-demand → jank | **Planned** |
| L-02 | GPU warm render only covers first artwork; artworks 2–N CPU→VRAM stall on first navigation | **Planned** |
| L-03 | Auto-reveal on load complete; no press-to-start button; no user agency | **Planned** |
| L-04 | Idle sweep redundant after L-01; retain as retry for failures; add no-op diagnostics log | **Planned (low)** |
| L-05 | No minimum loading screen duration; branded screen flashes < 100ms on fast LAN/cache | **Planned (low)** |

### M-series: Deep code audit corrections (2026-05-21)

Second-pass audit found 7 additional implementation gaps in the L-series plan:

| Gap | Component | Status |
|-----|-----------|--------|
| M-01 | `LoadingOverlayControls` interface: `reveal(): void` must become `reveal(): Promise<void>` — TypeScript compilation blocker for L-03 | **Planned** |
| M-02 | `createLoadingOverlay()` hint timer runs during ready state and overwrites "Galerie bereit" label after 2 s — `reveal()` must stop timer first | **Planned** |
| M-03 | Audio recovery `pointerdown` listener registered post-reveal, missing the button click gesture — must register before `await reveal()` | **Planned** |
| M-04 | L-01 no preload count limit — 50-artwork gallery loads ~5 600 MB CPU textures → OOM on mobile — add `PBR_PRELOAD_LIMIT = 15` | **Planned** |
| M-05 | `prepareArtworkForWarmRender()` described as async — after L-01 textures are cached; method should be synchronous `warmArtworkForGPU(): void` + add `TextureManager.getForRole()` | **Planned** |
| M-06 | Standalone `renderer.render()` at `main.ts:567` is redundant after L-02 warm loop — remove for small galleries, keep as fallback for large | **Planned (med)** |
| M-07 | Progress bar ranges 92–97% overlap between L-02 loop and existing code — remap: warm=93–97%, prewarm=97–99%, ready=100% | **Planned (low)** |

### Boot sequence architecture after all patches (L+M series)

```
galleryManager.init()          ←→  delay(500ms)        [L-01 + L-05, parallel]
  └─ albedo preload (LoadingManager 0–90%)
  └─ PBR preload ≤ 15 artworks (LoadingManager 90–92%)
  └─ showArtwork(0)
  └─ scheduleFullTextureSetPrefetch() [no-op for loaded; retries failures]
warmArtworkForGPU(0..N-1) + render × N                  [L-02 + M-05, sync]
  └─ progress 93–97%
renderer.prewarm()                                       [awaited, 97–99%]
setProgress(100) → reveal(): Promise<void>               [L-03 + M-01]
  └─ hint timer stopped [M-02]
  └─ startButton shown, focus after transitionend [M-03]
user clicks "Galerie betreten"
  └─ pointerdown captured by pre-registered listener [M-03]
  └─ overlay fades out over 1.3 s
  └─ gallery fully interactive
```

Full implementation patches: `plan.md § v0.22` and `plan.md § v0.22 M-series`.

---

## v0.21 — implementation shipped (2026-05-21)

Current status: shipped. The v0.21 plan is implemented in runtime code and documentation: branded progress loading overlay, Three.js LoadingManager progress, pre-reveal GPU warm render + awaited shader prewarm, audio `preload='auto'`, adjacent/idle PBR prefetch, lighting resume clamp, WebGL restore status, max-texture diagnostics, shader precision guard, 16K importer guidance, global pointer tracking, timeline arrows/counter/edge fades/responsive sizing/virtualized large-list rendering, and cleanup for added global listeners. Future-only boundaries remain LOD/tiled streaming for device-limited 16K detail and grouped/page timeline navigation for very large exhibitions.


## v0.21 — Preloading, Interactive Loading Screen, Tab Smoothness + 16K High-Resolution Support + Global Pointer Tracking + Timeline Scalability (shipped, 2026-05-21)

Current status: **shipped**. Boot-path and tab-lifecycle gaps identified by code audit and online research:

### G-series: Preloading + Loading Screen

| Gap | Component | Status |
|-----|-----------|--------|
| G-01 | `RendererManager.prewarm()` called post-overlay-hide as fire-and-forget `void` — not awaited before overlay hides | Shipped in v0.21 |
| G-02 | Audio `preload='metadata'` instead of `'auto'` | Shipped in v0.21 |
| G-03 | PBR maps lazy-loaded per artwork, no adjacent prefetch | Shipped in v0.21 |
| G-04 | Loading screen is unbranded white spinner | Shipped in v0.21 |
| G-05 | No `<link rel="preload">` for fonts in `<head>` | Shipped in v0.21 |
| G-06 | Textures not GPU-uploaded before overlay hides | Shipped in v0.21 |
| G-07 | No idle sweep of remaining artwork PBR sets | Shipped in v0.21 |

### H-series: Tab Smoothness + 16K High-Resolution Support

| Gap | Component | Status |
|-----|-----------|--------|
| H-01 | `LightingSetup.update()` uses absolute rAF timestamp → key-light jump on tab resume | Shipped in v0.21 |
| H-02 | No user-visible indicator during WebGL context restoration | Shipped in v0.21 |
| H-03 | `TextureManager.maxTextureSize` **not stored as field** (only logged); no oversized-texture diagnostic | Shipped in v0.21 |
| H-04 | `PaintingMaterial` injected GLSL lacks `highp` precision guard for large UV tiling | Shipped in v0.21 |
| H-05 | Importer warns ">4096px downscale" for all large images; 16K norm not reflected | Shipped in v0.21 |
| H-06 | No NPOT dimension note in importer | Shipped in v0.21 |
| H-07 | No LOD / tiled streaming for images exceeding device `maxTextureSize` | Open — future pass |

### I-series: Global Pointer Tracking

| Gap | Component | Status |
|-----|-----------|--------|
| I-01 | Hover rotation only updates when cursor is over the canvas — freezes over timeline / settings / nav overlays | Shipped in v0.21 |
| I-02 | Touch Events fallback `mousemove` canvas-scoped only — same hover freeze in legacy browsers | Shipped in v0.21 |
| I-03 | `setPointerCapture` failure unlogged; no global drag fallback if capture is stolen by an overlay | Shipped in v0.21 |
| I-04 | Touch Events path: `touchmove` canvas-scoped; touch drag interrupted if finger exits to adjacent element | Shipped in v0.21 |

### J-series: Timeline Scalability

| Gap | Component | Status |
|-----|-----------|--------|
| J-01 | All thumbnails rendered as full DOM nodes at construction — no virtual windowing | Shipped in v0.21 |
| J-02 | No scroll-arrow buttons for mouse-click navigation of the timeline strip | Shipped in v0.21 |
| J-03 | No artwork counter ("3 / 20") in the timeline bar | Shipped in v0.21 |
| J-04 | No CSS `mask-image` edge fade to indicate off-screen content | Shipped in v0.21 |
| J-05 | Timeline thumbnail size hardcoded at 150×95px — not responsive | Shipped in v0.21 |
| J-06 | No group/page navigation for 50+ artwork galleries | Open — future pass |

### K-series: Code Audit Corrections (2026-05-21)

| Gap | Component | Status |
|-----|-----------|--------|
| K-01 | `CanvasInteraction.dispose()` must remove global `window` listeners added by I-series patches | Shipped in v0.21 |
| K-02 | `Timeline.dispose()` retains `this.thumbs` array — prevents GC of button element listeners | Shipped in v0.21 |
| K-03 | `prefetchAdjacentArtworks()` method does not exist; G-03 patch must add it | Shipped in v0.21 |

**Plan corrections:**
- G-01 description updated: prewarm IS called but as fire-and-forget `void`, AFTER overlay hides
- H-03 description updated: `maxTextureSize` is not stored as a field — only logged in `init()`

Full plan: `plan.md § v0.21`. Research details: `FINDINGS.md § 2026-05-21`.



## v0.20.8 — Complete v0.20 implementation shipped (2026-05-21)

Current status: shipped. The v0.20.7 gap-closure plan is now implemented in code and this file was refreshed during the all-markdown sync. Remaining v0.20 audio/control quality gaps are closed: fade targets clamp to the 0.30 effective-gain ceiling, diagnostics include display percent, preference patching updates non-slider controls during volume drags, sliders expose German percent value text, zero-volume recovery logs stored/recovered values, first-interaction recovery also covers pre-play audio, unmute resumes within `BackgroundAudioManager`, slider fill CSS stores percentages, and the ended-loop fallback fade is shortened to 50 ms. F-09 was confirmed correct and required no code change.

## v0.20.3 planning boundary — audio UX technical hardening (2026-05-20)

Implemented in v0.20.4. Previous planned status was:

> Planned (not yet shipped): the next audio pass should preserve current module boundaries while adding:
> - mapping helpers between displayed volume percent and effective gain,
> - an in-place PreferencesPanel update strategy for continuous slider drag,
> - fade-envelope transitions in `BackgroundAudioManager`,
> - responsive placement policy for `.audio-controls` with documented overlap checks.

All four items are now shipped. See `FINDINGS.md § 2026-05-20 (v0.20.4)`.

## v0.20 — Audio CORS fix + main-page AudioControls (2026-05-20)

**CORS fix:** `BackgroundAudioManager` no longer sets `crossOrigin = 'anonymous'`. This was blocking all audio on `file://` origins (Chromium null-origin CORS rejection). Canonical reference: `plan.md § v0.20`, `FINDINGS.md § 2026-05-20 (v0.20)`.

**AudioControls:** `src/ui/AudioControls.ts` is the quick-control component instantiated by `main.ts`. The original bottom-left placement is now explicitly disputed by `v0.20.5`, so treat location and displayed-volume behavior as active follow-up areas rather than settled architecture.

**Sidecar cache-bust:** `import-artworks.mjs` now stamps `?t=<timestamp>` on `customer-artworks.js` + `customer-audio.js` script src tags in `app.html` after every import, bypassing Chromium's file:// disk cache.

## v0.20 — Audio workflow reliability shipped (2026-05-20)

Architecture addition shipped: importer + runtime audio boundary for calm background music, with format compatibility and accessible mute/volume controls.

Current runtime: **shipped**. Background audio now loads from importer payloads, integrates with preferences/lifecycle, and exposes mute/volume controls in the preferences panel and via the new main-page `AudioControls` widget (v0.20). Canonical reference: `plan.md § v0.19`.

## v0.18 — Customer sidecar text shipped (2026-05-20)

Current status: shipped. The importer (`scripts/import-artworks.mjs`) reads same-basename `.txt` sidecars (`.md` accepted as a backup) and merges customer-facing metadata into the generated manifest. Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned. Canonical plan: `plan.md § v0.18`. Research log: `FINDINGS.md § 2026-05-20`. Customer guide: `docs/CUSTOMER_TEXT_GUIDE.md`. Template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.

FREYRAUM is a Vite + strict TypeScript + three.js customer-preview application for an interactive digital museum installation.

## Runtime entry

- `src/main.ts`
  - imports global SCSS
  - validates injected artwork manifests
  - creates renderer, scene, post-processing, lighting, gallery, controls, preferences, diagnostics, and adaptive quality
  - owns the render loop, page lifecycle suspension, resize coordination, and UI wiring

## Core rendering

- `src/core/RendererManager.ts`: WebGL renderer setup, quality preset application, pixel ratio, context-loss diagnostics, shader pre-warm, renderer snapshots, idempotent disposal.
- `src/core/SceneManager.ts`: scene/camera setup and aspect updates.
- `src/core/PostProcessing.ts`: post-processing chain and resize/render ownership.
- `src/rendering/RenderBackend.ts`: progressive rendering capability probes.

## Gallery domain

- `src/gallery/GalleryManager.ts`: active artwork state, navigation, zoom/pan/reset math, art-safe viewport metrics, animation smoothing, diagnostics.
- `src/gallery/ArtworkMesh.ts`: artwork mesh/frame construction.
- `src/gallery/TextureManager.ts`: artwork texture loading, anisotropy, quality-sensitive texture behavior.
- `src/gallery/SidePanels.ts`: side artwork presentation.
- `src/config/artworks.ts`: built-in artwork data and metadata contract.
- `src/config/quality.ts`: quality presets.

## Materials and lighting

- `src/materials/PaintingMaterial.ts`: painting shader/material fidelity.
- `src/materials/PaintingTextureSet.ts`: texture role typing and resolved texture sets.
- `src/materials/ProceduralTextureFactory.ts`: procedural fallback maps.
- `src/materials/CanvasMaterial.ts`: canvas/frame material helpers.
- `src/lighting/LightingSetup.ts` and `src/lighting/LightProfile.ts`: lighting profiles and runtime light setup.

## Interaction and UI

- `src/interaction/CanvasInteraction.ts`: pointer/touch/canvas interaction path. Replaces `MouseInteraction`, `TouchInteraction`, and `ZoomPan` (removed in v0.17).
- `src/interaction/KeyboardNav.ts`: keyboard navigation.
- `src/ui/`: topbar, info panel, preferences, fallback screen, fullscreen, hints, navigation, zoom controls.
- `src/timeline/Timeline.ts`: timeline UI, selection, and scroll behavior.
- `src/styles/main.scss`: global layout, glass chrome, responsive/safe-area styling, motion tokens, quality-aware CSS.

## Utilities

- `src/utils/Diagnostics.ts`: bounded diagnostics buffer, global report API, scoped logging.
- `src/utils/FrameBudgetMonitor.ts` and `src/utils/AdaptiveQualityController.ts`: frame budget sampling and adaptive quality.
- `src/utils/performance.ts`: startup quality and pixel ratio heuristics. `isMobileDevice()` was removed in v0.17; use `detectDeviceCapabilities()` from `device.ts`.
- `src/utils/preferences.ts`: `freyraum.preferences.v1` localStorage schema and document-level data attributes.
- `src/utils/device.ts`: device capability detection and DOM data attributes.
- `src/utils/math.ts`, `texture.ts`, `webgl.ts`, `preferences.ts`: focused helpers.

## Asset/customer workflow

- `scripts/import-artworks.mjs`: imports customer artwork files and customer audio files, validates assets, generates artwork/audio preview payloads, and writes warning-first reports.
- `scripts/run-import-artworks.cjs`: Node version guard and friendly compatibility report.
- `scripts/write-local-preview.mjs`: writes the local customer preview HTML plus artwork/audio stubs.
- `Update Gallery.bat` and `Update Gallery.command`: customer-facing launchers.
- `customer-artworks/`: customer input and processed folders.
- `customer-audio/`: customer audio input folders.
- `customer-preview/`: generated preview bundle and assets.

## Documentation system

- `plan.md`: current and historical implementation plans.
- `FINDINGS.md`: technical findings, decisions, validation notes, regressions.
- `CHANGELOG.md`: concise release/change history.
- `DOCUMENTATION_RULES.md`: required documentation updates.
- `docs/HANDOFF.md`: customer/contributor handoff.
- `.github/copilot-instructions.md` and `.github/prompts/`: AI workflow guidance.
- `docs/architecture/README.md`: deeper architecture notes and subsystem documentation entry point.
- `docs/standards/CODING_GUIDELINES.md`: code, diagnostics, CSS, and dependency maintenance standards.
- `docs/ai-feedback/AI_FEEDBACK_LOOP.md`: audit/review loop for future AI-assisted work.
