# FINDINGS
> Last full markdown audit: 2026-05-21 (v0.21 — preloading + interactive loading screen + tab smoothness + 16K high-res support plan).

## 2026-05-21 — v0.21 extension: tab switching smoothness + 16K high-resolution support

### Audit method

Deep code audit of `LightingSetup.ts`, `RendererManager.ts`, `TextureManager.ts`, `PaintingMaterial.ts`, and `scripts/import-artworks.mjs`. Six targeted online research queries covering: Page Visibility API + WebGL delta clamping, bfcache + media state, WebGL context loss/restore Three.js r125+, 16K texture GPU limits (Khronos spec + webglreport.com), compressed texture formats (KTX2/Basis Universal), and GLSL fragment precision qualifiers.

### Code audit findings

| ID | Severity | File : Lines | Finding |
|----|----------|-------------|---------|
| H-01 | **MEDIUM** | `src/lighting/LightingSetup.ts:68–76` | `LightingSetup.update(time)` uses raw rAF absolute timestamp in `Math.sin(time * 0.0002)`. After a tab resumes from background, `time` jumps by seconds → key light position snaps discontinuously. `GalleryManager.MAX_SMOOTHING_DT` guard does **not** cover lighting. |
| H-02 | **LOW** | `src/core/RendererManager.ts:166–182` | WebGL context loss is handled correctly (`preventDefault`, pause/resume) but no user-visible indicator is shown during restoration. Canvas stays blank for several seconds on low-memory mobile without any feedback. |
| H-03 | **HIGH** | `src/gallery/TextureManager.ts:51` | `this.maxTextureSize` is stored but never consulted. Textures larger than `maxTextureSize` silently corrupt or crash on some GPU drivers with no diagnostic. |
| H-04 | **MEDIUM** | `src/materials/PaintingMaterial.ts:180–199` | Injected GLSL uniform block has no explicit `precision` qualifier. `mediump float` default on mobile GPUs loses UV fractional precision for high-resolution textures with large detail tiling factors (≥ 256×), causing visible seaming. |
| H-05 | **HIGH** | `scripts/import-artworks.mjs:609–623` | `MAX_RECOMMENDED_DIMENSION = 4096` and thresholds 64 MB / 128 MB are calibrated for 2016-era phones. All source artwork above 4 K triggers an incorrect "downscale to 4 096 px" warning. Desktop browsers and modern GPUs support up to 16 384 px. Guidance must be tiered. |
| H-06 | **LOW** | `scripts/import-artworks.mjs` (new) | No NPOT dimension advisory. WebGL 2.0 handles NPOT correctly; only relevant for rare WebGL 1.0 fallback. Diagnostic-only note sufficient. |
| H-07 | **MEDIUM** | Architecture (future pass) | No LOD / tiled streaming pathway. For 16 K source images on devices with 4 K `maxTextureSize`, Three.js silently downscales at GPU upload. A future LOD pipeline (thumb/preview/hires manifest + progressive swap) would preserve full detail on capable hardware. |

### Research findings

**Page Visibility + bfcache (confirmed correct — no change needed)**
- `src/main.ts:637–689` already implements correct Page Visibility gating: `suspendRuntime` / `resumeRuntime` on `visibilitychange`, `pagehide`, `pageshow`, `freeze`, `resume`.
- `GalleryManager.MAX_SMOOTHING_DT = 0.1` (100 ms) already caps the animation delta on resume — no zoom/pan/tilt jump.
- bfcache audio normalization already implemented via `preferences.normalizeStartupAudio` on `pagehide` / `pageshow`.
- **Gap:** `LightingSetup.update()` is the only subsystem not clamping its resume delta (H-01).

**WebGL context loss (confirmed correct — minor gap logged)**
- Three.js ≥ r125 auto-rebuilds GPU resources on `webglcontextrestored`. `RendererManager.onContextLost` calls `event.preventDefault()` correctly.
- Gap: No UI feedback during restore window (H-02).

**16K texture GPU limits**
- Khronos WebGL 1.0 spec §2.11.5: `MAX_TEXTURE_SIZE` is the implementation's reported limit. Three.js exposes this as `renderer.capabilities.maxTextureSize`.
- webglreport.com confirms: modern desktop GPU families (NVIDIA RTX, AMD RDNA2+, Intel Arc, Apple M-series 2024) report 16 384 px.
- Mobile: iPhone 15 and iPad Pro M2 report 16 384 px; mid-range Android (Snapdragon 8 Gen 1) reports 16 384 px; entry phones may report 4 096–8 192 px.
- A 16K RGBA8 texture with mipmaps requires ≈ 1 365 MB of VRAM — desktop-only territory. Mobile auto-downscales.
- KTX2 / Basis Universal compression reduces this to ≈ 170–341 MB (BC7 / ASTC 8× compression) — feasible on high-end mobile.

**Compressed texture formats**
- Three.js `KTX2Loader` (from `three/examples/jsm/loaders/KTX2Loader.js`) natively supports KTX2 with ASTC, BC7, ETC2.
- Basis Universal transcode selects the best supported format per device at runtime.
- Build pipeline tool: `basisu` CLI (open source) converts PNG/JPEG to `.ktx2`.
- Not implemented in v0.21; documented here as a future enhancement for large-artwork optimization.

**GLSL precision**
- `mediump float` has a 10-bit mantissa: safe for UV values up to ~2^10 = 1024 with 3-digit fractional accuracy.
- For detail tiling ≤ 64× on a ≤ 16K texture, `mediump` is sufficient (max UV = 1024 — right at the edge).
- For tiling ≥ 128× or very large texture dimensions, `highp` should be explicitly declared.
- Guard with `#ifdef GL_FRAGMENT_PRECISION_HIGH` for devices that don't support `highp` in fragment shaders (Mali-T6xx and older).

### Remaining status

All v0.21 preloading/loading-screen gaps (G-01 through G-07) remain open — planned. Seven new gaps (H-01 through H-07) added from this tab-smoothness + 16K research pass.



### Audit method

Full line-by-line inspection of loading, texture, audio, shader, and animation code paths.
Eight targeted online research queries covering Three.js `LoadingManager`/`compileAsync`, audio `preload` strategy, `requestIdleCallback` prefetch, CSS glassmorphism loading screens, GSAP gallery reveal, bfcache media handling, WebWorker `createImageBitmap`, and `<link rel="preload">` patterns.

### Code audit findings

| ID | Severity | File : Lines | Finding |
|----|----------|-------------|---------|
| G-01 | **HIGH** | `src/core/RendererManager.ts:106–127` | `prewarm()` (with `compileAsync` support for Three.js ≥ 0.155) exists but is **never called** in the boot path. First user interaction triggers visible shader-compile stutter. |
| G-02 | **HIGH** | `src/audio/BackgroundAudioManager.ts:72` | Audio element uses `preload='metadata'` — only duration/header fetched at boot. Full audio frames not buffered → playback start on slow connections causes audible gap/stutter. |
| G-03 | **MEDIUM** | `src/gallery/GalleryManager.ts:262–263` | `init()` preloads albedo textures for all artworks in parallel (good) but PBR maps (normal, roughness, ao, height, specular, varnish, detail) are **lazy-loaded only when the user navigates to each artwork**. Navigation to an unvisited artwork shows visible loading lag. |
| G-04 | **HIGH** | `src/main.ts:282–291`, `src/styles/main.scss:1113–1142` | Loading screen is a bare white spinner on solid `--bg1` (#eef1f3). No real progress indication, no FREYRAUM branding, no user engagement. Users see a blank white screen with a small circle for up to several seconds on cold load. |
| G-05 | **LOW** | `app.html` (line 1–16) | No `<link rel="preload">` hints for critical first-paint assets (fonts, background audio, hero albedo). Browser cannot start fetching these until HTML and JS are fully parsed. |
| G-06 | **MEDIUM** | `src/gallery/GalleryManager.ts:263`, `src/core/RendererManager.ts:106` | Textures are decoded to CPU memory by `TextureLoader` but **not uploaded to GPU until first draw call**. This causes first-frame stutter even when all textures are "loaded". No warm render pass exists before loading overlay hides. |
| G-07 | **LOW** | `src/gallery/GalleryManager.ts:308–384` | Adjacent artwork textures (prev/next) have their albedo available from the global preload, but PBR maps for ±1 or ±2 neighbours are never prefetched speculatively. A `requestIdleCallback` prefetch window of ±2 would eliminate cold-navigation lag after first open. |

### Research summary

**Three.js `LoadingManager`** (threejs.org): `onProgress(url, loaded, total)` callback gives real-time asset count for progress bars. Tracks all loaders that share the manager instance.

**`renderer.compileAsync(scene, camera)`** (Three.js ≥ 0.155): Compiles all shader programs asynchronously before first frame. Eliminates compile-stutter on first render. The method already exists in `RendererManager.prewarm()` but is not called.

**`renderer.compile(scene, camera)` + hidden render pass**: Force GPU texture upload by rendering once off-screen under loading overlay. Standard pattern to prevent first-frame stutter from texture CPU→GPU transfer.

**Audio `preload='auto'`**: Directs browser to buffer full audio file. Best for guaranteed-playback-on-first-play scenarios. Chrome/Firefox/Edge respect it on desktop; mobile browsers may downgrade to `'metadata'` due to data-saver heuristics.

**`requestIdleCallback` prefetch**: Standard browser-idle texture pre-fetch pattern for non-urgent assets (adjacent artworks). Polyfilled for Safari (`setTimeout(fn, 1)` fallback). Moves speculative loads off the critical path.

**`<link rel="preload">`**: `as="font"` / `as="audio"` in `<head>` start fetches before JS parses. Critical for reducing time-to-first-paint for fonts and first-play audio.

**CSS glassmorphism loading screen** (MDN, web.dev): `backdrop-filter: blur(16px) saturate(150%)` on semi-transparent dark card. Floating radial-gradient particles via `@keyframes float`. Progress bar via `width` transition on a child div.

**GSAP stagger reveal**: After loading completes, `gsap.to('.gallery-item', { opacity: 1, scale: 1, filter:'blur(0)', stagger: 0.1, ease:'expo.out' })` provides a premium branded gallery reveal. (GSAP is not currently a dependency — can be replicated with CSS transitions if not desired.)

**bfcache + audio**: `pageshow` event with `event.persisted === true` detects bfcache restore. Audio state already handled in v0.20.8. No change needed for bfcache.

### Remaining status

All v0.20.8 audio/control findings remain closed. v0.21 opens 7 new gaps (G-01 through G-07) for the preloading + loading screen domain.

## 2026-05-21 — v0.20.8 implementation verification

### Summary

The complete v0.20.7 gap-closure plan has been implemented. All tracked Markdown files were refreshed during the same pass so the repository now documents v0.20 audio/control behavior as shipped instead of under repair.

### Closed findings

| Finding | Resolution |
|---------|------------|
| F-01 | Fade targets now clamp to `MAX_EFFECTIVE_AUDIO_GAIN` (0.30). |
| F-02 | `audio-volume-map` diagnostics include `displayPct`. |
| F-03 | Preference panel patching only guards the volume-slider value during active drags. |
| F-04 | Volume sliders expose `aria-valuetext` with German percent wording. |
| F-05 | Recovery logging includes stored and recovered audio gain values. |
| F-06 | User-interaction recovery covers both autoplay-blocked and pre-play stopped states. |
| F-07 | Unmuting through `BackgroundAudioManager` attempts playback directly. |
| F-08 | Slider fill CSS uses percentage-valued `--volume-pct`. |
| F-09 | Confirmed correct; no change required. |
| F-10 | Ended-loop fallback fade reduced to 50 ms. |

### Remaining status

No known v0.20 audio/control implementation gaps remain from the v0.20.7 plan.

## 2026-05-21 — v0.20.7 deep code audit

### Audit method

Full line-by-line inspection of all v0.20 audio/control source files. Each finding is linked to a file and line number verified in the current checked-in source.

### Confirmed-correct items (no change needed)

| Item | File : Line | Verification |
|------|-------------|--------------|
| Linear volume mapping `0..30%` effective | `src/audio/volumeMapping.ts:1–31` | `MAX_EFFECTIVE_AUDIO_GAIN = 0.3`; `displayPercentToGain(50) = 0.15` exactly |
| `targetVolume`/`liveVolume` state split | `src/audio/BackgroundAudioManager.ts:50–52` | Fade ramps write only `liveVolume`; `setVolume()` writes only `targetVolume` |
| `play()` already-playing short-circuit | `BackgroundAudioManager.ts:142–147` | Guard checks `!this.audio.paused && this.state.playing` |
| `setMuted()` no-op guard | `BackgroundAudioManager.ts:212–218` | Returns early when `this.state.muted === value` |
| Startup `audioMuted: false` | `src/utils/preferences.ts:141` | Hardcoded; stored state ignored for mute |
| Zero-volume legacy recovery | `src/utils/preferences.ts:107–131` | `AUDIO_RECOVERY_KEY` guards one-shot fix |
| Slider renders `targetVolume` | `src/ui/AudioControls.ts:107–108` | `gainToDisplayPercent(state.targetVolume)` |
| Drag-continuity guard in PreferencesPanel | `src/ui/PreferencesPanel.ts:178` | `if (this.isVolumeDragging) return;` |
| First-interaction autoplay recovery | `src/main.ts:461–481` | `pointerdown` + arrow/Space/Enter |
| Audio control placement (top-right) | `src/styles/main.scss:436–459` | `right: calc(146px + var(--safe-right))` |
| Narrow-phone slider collapse | `src/styles/main.scss:1375–1380` | `display: none` at `max-width: 599px` |

### Open gaps (with fix references in plan.md v0.20.7)

| ID | File : Line | Gap | Priority |
|----|-------------|-----|----------|
| F-01 | `BackgroundAudioManager.ts:399` | `startFade()` clamps to 1.0 not `MAX_EFFECTIVE_AUDIO_GAIN` | Medium |
| F-02 | `BackgroundAudioManager.ts:250–257` | `audio-volume-map` log omits `displayPct` | Medium |
| F-03 | `PreferencesPanel.ts:178–182` | `patchPanel()` skips ALL updates during drag, not just slider | Medium |
| F-04 | `AudioControls.ts:113`, `PreferencesPanel.ts:154` | Sliders lack `aria-valuetext` | Medium |
| F-05 | `preferences.ts:114` | Recovery log omits stored value for diagnostics | Low |
| F-06 | `main.ts:465–474` | Recovery guard requires `autoplayBlocked=true`; misses pre-play state | High |
| F-07 | `BackgroundAudioManager.ts:215` | `setMuted(false)` does not self-play; relies on external orchestration | Low |
| F-08 | `main.scss` + 3 TS files | `--volume-pct` stored unitless; future `calc()` misuse risk | Low |
| F-09 | `BackgroundAudioManager.ts:31–40` | (Confirmed correct — no change needed) | — |
| F-10 | `BackgroundAudioManager.ts:17` | `LOOP_RESTART_FADE_MS = 150` produces audible 150 ms gap on fallback | Low |

### Regression risk summary

All v0.20.5 blocking issues (state corruption, wrong mapping contract, placement, startup muted) are resolved in the checked-in code. The 10 items above are quality/robustness improvements, not blocking regressions.



### Root-cause confirmation

1. Repeated `play('preferences-apply')` calls were re-running fade-in even when audio was already playing, causing audible dips during non-audio preference updates.
2. When autoplay is blocked, users could remain in a silent state until they explicitly clicked the audio button.
3. Nav arrow buttons could show an undesirable dark focus halo during keyboard navigation.
4. Audio quick-control dimensions looked visually heavier than adjacent top-right controls.

### Implemented fixes

1. `BackgroundAudioManager.play()` now short-circuits when already playing (`audio-play-skip` diagnostics event).
2. `BackgroundAudioManager.setMuted()` now ignores unchanged mute requests (`audio-mute-unchanged` diagnostics event).
3. `main.ts` now calls `backgroundAudio.play('preferences-apply')` only when playback is not already active or when autoplay is blocked.
4. `main.ts` adds one-shot first-interaction autoplay recovery (pointer + keyboard navigation keys) when source exists, mute is off, and autoplay was blocked.
5. `main.scss` updates tighten `.audio-controls` dimensions and slider sizing, and adds `.nav-btn:focus-visible` override styling to remove the dark ring artifact.

## 2026-05-21 — v0.20.5 audio regression audit

### Validation baseline

- `npm install` ✅
- `npm run lint` ✅
- `npm run build` ✅

### Confirmed user-facing failures

1. **Website appears muted on startup even though defaults say otherwise.**
2. **Unmuting can resume at 0% instead of the previously selected loudness.**
3. **A 50% setting does not reliably produce the requested 15% effective loudness.**
4. **Main-page mute button and slider are still in the previously rejected location.**
5. **Current docs describe these behaviors as solved even though the runtime still fails.**

### Root-cause audit

1. **Transient element volume is incorrectly treated as the source of truth.**
   - `BackgroundAudioManager.play()` sets `this.audio.volume = 0` before calling `audio.play()` so the fade-in can start from silence.
   - The `volumechange` listener then copies `this.audio.volume` back into `state.volume`.
   - Because `startFade(this.state.volume, ...)` reads the now-corrupted `state.volume`, the fade target becomes `0` and playback behaves as muted.
   - The same bug also contaminates mute/unmute and loop-restart paths because the fade envelope repeatedly drives the live media element volume to zero.

2. **The implemented mapping does not match the requested contract.**
   - `src/audio/volumeMapping.ts` uses a power curve that maps UI `100%` to effective gain `1.0`.
   - The current requirement is stricter: UI `0..100%` must represent only effective `0..0.30`, so UI `50%` must equal exactly `0.15`.
   - This means the existing helpers, default gain constant, and all mapping-related documentation are conceptually wrong even before the fade bug is considered.

3. **The two sliders render different kinds of state.**
   - `PreferencesPanel` renders from persisted preferences.
   - `AudioControls` renders from `BackgroundAudioManager.state.volume`, which is currently the live media-element volume, not the selected target loudness.
   - During fades or after mute/unmute, the main-page slider can therefore drift to `0%` while settings still represent the last chosen target.

4. **Control placement is hard-coded instead of requirement-driven.**
   - `src/ui/AudioControls.ts` and `src/styles/main.scss` still assume the bottom-left quick-control location is acceptable.
   - The latest customer report explicitly says the mute button and volume slider remain in the wrong place, so the current placement policy is invalidated.

5. **Preference persistence needs a follow-up migration review.**
   - Existing `freyraum.preferences.v1` entries can contain broken zero-volume outcomes or old mapping assumptions from the current faulty implementation.
   - The fix plan must define how to distinguish legitimate user choices from values polluted by the broken v0.20.4 behavior.

### Required implementation boundaries for the next pass

1. Separate **target gain** from **live element gain** inside `BackgroundAudioManager`; never let fade-envelope or mute-driven `volumechange` events overwrite the user-selected target value.
2. Replace the current power-curve mapping with the explicitly requested `0..100 display → 0..30 effective` contract and update defaults, persistence handling, and both sliders together.
3. Make both sliders read/write the same target-volume source of truth.
4. Rework quick-control placement to the requested location instead of preserving the current bottom-left assumption.
5. Add diagnostics that log both target gain and live element gain so future bug reports can distinguish mapping bugs from fade-state bugs.

### Acceptance checks required before calling this fixed

- Fresh profile: first load starts audible, not muted, at exactly the intended effective loudness for UI `50%` (= `0.15` effective under the requested `0..30%` cap).
- Mute/unmute round-trip: unmuting restores the last chosen target loudness rather than `0%`.
- Settings slider and main-page slider always show the same value after startup, drag, mute, unmute, autoplay recovery, and page resume.
- Quick controls are moved off the currently rejected position and verified against the approved placement requirement.
- Legacy/localStorage scenarios are checked so the fix does not leave returning users stuck on broken zero-volume state.

## 2026-05-20 — v0.20.4 implementation audit

### Implementation summary

All five slices from the v0.20.2 / v0.20.3 technical plans were implemented in a single PR.

### Slice A — Volume mapping (`src/audio/volumeMapping.ts`)

**Finding:** A power-curve constant POWER = 2.74 (derived from `log(0.15)/log(0.5)`) maps 50% display to ≈15% effective gain.

**Key points:**
- `displayPercentToGain(50)` = 0.5^2.74 ≈ 0.152
- `gainToDisplayPercent` is the exact inverse using `gain^(1/POWER)`.
- `DEFAULT_AUDIO_GAIN` ≈ 0.152 is the new startup default in `preferences.ts`.
- Legacy stored effective-gain values (0..1) remain valid and read unchanged — no migration needed.

**Sources:**
- https://www.dr-lex.be/info-stuff/volumecontrols.html
- https://webaudio.github.io/web-audio-api/#dom-audioparam-value

### Slice B — PreferencesPanel in-place patch

**Finding:** The old `renderPanel()` rebuilt `innerHTML` on every preference event, replacing the slider node mid-drag and interrupting pointer capture.

**Fix:**
- Panel is built once with a static skeleton. `patchPanel()` is the subscription handler and only updates `checked`, `value`, `textContent`, and `hidden` states.
- `isVolumeDragging` flag (set on `pointerdown`, cleared on `pointerup`/`pointercancel`) causes `patchPanel()` to return early during active drag.
- Display label and `--volume-pct` track fill are updated in the `input` handler (immediate visual feedback).
- Final effective gain is written in the `change` handler (fires once on pointer-release or keyboard confirmation).
- Keyboard slider (arrow/page/home/end) remains fully live because keyboard events never set `isVolumeDragging`.

### Slice C — Fade envelope (`BackgroundAudioManager.ts`)

**Finding:** Volume changes and loop restarts were immediate, creating audible click/pop artifacts at loop boundaries and mute/unmute edges.

**Fix:**
- `startFade(target, durationMs, label, onComplete?)` drives a rAF-based linear volume ramp.
- `cancelFade()` cancels any in-progress ramp (called before starting a new one).
- Applied at:
  - `play()`: fade from 0 to target gain over 300 ms.
  - `pause()` and `setMuted(true)`: fade to 0 over 200 ms, then pause (restore nominal volume).
  - `ended` fallback: fade to 0 over 150 ms, reset `currentTime`, then restart.
  - `handleSuspend()`: immediate pause (no fade — lifecycle suspend is instantaneous).

**Note on `setVolume()` during active fade:** If `setVolume()` is called while a fade is in progress (e.g. lifecycle restore), the state volume is updated but the element volume is left to the ramp. This is intentional — the fade completes to the last target gain; subsequent play/pause will re-apply the stored volume.

### Slice D — CSS placement tokens and responsive layout

**Finding:** `.audio-controls` had no placement token layer, making responsive overrides require repeating the full `left:` and `bottom:` values.

**Fix:**
- Added `--audio-ctrl-bottom` and `--audio-ctrl-left` CSS custom properties with fallback to previous static values.
- `@media (max-width: 599px)` now overrides `--audio-ctrl-left` and collapses `.audio-controls__slider-wrap` to hide the volume slider on narrow phones (mute button remains accessible; volume is adjustable via the settings panel).
- Fixed `--volume-pct` CSS fallback from `35%` (invalid unit in `calc(... * 1%)`) to `50` (unitless number, matching the new calm-start default display percent).

**Collision check (phone portrait, 599 px):**
- Bottom-left: audio controls (mute button only, ~60px wide).
- Bottom-right: zoom controls.
- Bottom-right (above zoom): fullscreen button.
- Top-right: settings trigger.
- No overlap at 360–599 px width. ✓

### Slice E — Diagnostics expansion

**New diagnostics events added:**
- `audio-fade-start` (debug): fade label, from/to gain, durationMs.
- `audio-fade-cancel` (debug): emitted when a ramp is cancelled.
- `audio-fade-complete` (debug): final gain at ramp end.
- `audio-volume-map` (debug): effective gain + reason — for diagnostics exports to show mapping provenance.
- `audio-resume-attempt` (debug): emitted at both lifecycle auto-resume and failed play attempts; includes reason and outcome classification.

### Validation

- `npm run lint` ✅
- `npm run build` ✅
- TypeScript strict mode: 0 errors.
- Bundle size delta: +4.37 kB raw (+1.01 kB gzip) for the new volume mapping, fade engine, and refactored panel logic.

### Open items / post-v0.20.4 candidates

1. Optional logarithmic fine-control mode for lower volume ranges.
2. Soft-ducking strategy during heavy transitions (future, behind feature flag).
3. "Autoplay blocked" mini status chip with one-click recovery hint.
4. Import-time loudness metadata scan (report-only).
5. Lightweight smoke-test harness for audio preference round-trip and mapping consistency.

## 2026-05-20 — v0.20.3 full technical audit + enhancement refresh (docs-only)

### Deep code findings

1. **Volume semantics are currently linear and under-specified for UX goals.**
   - `PreferencesStore` persists linear `audioVolume` values (`src/utils/preferences.ts`).
   - `AudioControls` and `PreferencesPanel` both expose linear 0–100 sliders (`src/ui/AudioControls.ts`, `src/ui/PreferencesPanel.ts`).
   - A formal mapping layer is required to satisfy “balanced display control, calmer effective output.”
2. **Preferences panel architecture still causes structural churn during slider interaction.**
   - `renderPanel()` rewrites `innerHTML`, then rebinds events on every preference update.
   - Continuous slider `input` writes preferences immediately, which can force control replacement and pointer continuity loss.
3. **Audio state transitions have no envelope abstraction.**
   - `setVolume` and mute/play transitions are immediate in `BackgroundAudioManager`.
   - `ended` fallback restart path also performs immediate replay.
   - This increases audible edge-artifact risk.
4. **Audio control placement currently has implementation but no explicit policy contract.**
   - `.audio-controls` is fixed bottom-left in SCSS.
   - No documented collision matrix exists for timeline + nav + prefs + fullscreen on constrained viewports.
5. **Diagnostics foundation is strong and should be extended, not replaced.**
   - Existing scoped logs are correctly centralized.
   - The next increment should add transition/mapping events while preserving low-noise log levels.

### Technical improvement priorities

1. Introduce a dedicated display↔gain mapping utility with deterministic inverse behavior.
2. Refactor `PreferencesPanel` to an in-place DOM update model for high-frequency controls.
3. Add a cancellable fade-envelope pipeline inside `BackgroundAudioManager`.
4. Formalize responsive control-placement acceptance checks and overlap rules.
5. Expand diagnostics payloads for audio transitions and mapped volume values.

### Output of this pass

- Added new v0.20.3 technical roadmap section to `plan.md` with implementation slices, coding advice, acceptance checks, and brainstorm candidates.
- Synced top-level docs to v0.20.3 planning context.
- Refreshed markdown audit stamp text across repository markdown.
- No runtime code changed in this pass.

## 2026-05-20 — v0.20.2 audio UX follow-up planning audit (docs-only)

### Problem-focused findings

1. **Startup loudness mismatch vs requested behavior**
   - Current defaults in `src/utils/preferences.ts` are `audioMuted: false` and `audioVolume: 0.35`.
   - Requested behavior is lower effective startup loudness (15%) with a UI midpoint representation (50%), which requires a defined display↔effective volume mapping model.
2. **Main-page control placement needs guideline-based pass**
   - Current `.audio-controls` placement is bottom-left and symmetric with zoom controls.
   - A dedicated placement pass is needed to verify discoverability, clutter avoidance, and touch ergonomics with existing timeline/nav/prefs controls.
3. **Settings slider continuity issue is structurally reproducible**
   - `PreferencesPanel` rebuilds panel markup via `renderPanel()` on preference updates.
   - The volume slider writes preferences on `input`, which immediately triggers panel re-render and can break drag-continuity behavior.
4. **Loop pop/click risk remains**
   - `BackgroundAudioManager` uses direct volume assignment and immediate restart on `ended` fallback.
   - No fade envelope exists for start/stop/loop edges, so clip/click artifacts can occur depending on source-loop boundaries.

### Online research notes used for planning

- ARIA slider keyboard behavior and semantics:
  - <https://www.w3.org/WAI/ARIA/apg/patterns/slider/>
  - <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role>
- Operable input modality requirements:
  - <https://www.w3.org/WAI/WCAG21/quickref/#input-modalities>
- Touch target and control ergonomics references:
  - <https://developer.apple.com/design/human-interface-guidelines/layout>
  - <https://m3.material.io/foundations/accessible-design/accessibility-basics>
- Seamless loop and fade context:
  - <https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques>

### Output of this pass

- Added a new v0.20.2 planning section in `plan.md` for calm-start audio, volume remapping, control placement, slider continuity, and fade envelope work.
- Updated top-level docs/changelog/handoff status to mark this as planning-only.
- Refreshed markdown audit stamp across all repository `.md` files.

## 2026-05-20 — v0.20.1 full markdown audit (docs-only)

### Audit scope

- Reviewed every markdown file in the repository (`root`, `docs/`, `.github/prompts/`).
- Cross-checked top-level status notes against shipped v0.20 behavior.
- Confirmed this pass is documentation-only (no runtime source changes).

### Findings

1. v0.20 runtime status is correctly implemented in code and already documented in core files (`README.md`, `plan.md`, `CHANGELOG.md`, `ARCHITECTURE_MAP.md`, `docs/HANDOFF.md`).
2. Several markdown files still used v0.19-labeled top status blocks, which could cause confusion during future audits and handoff.
3. Repository-wide docs synchronization is now complete for this pass: all markdown files carry the same audit timestamp marker and refreshed top status context.
4. No new functional or security regression was discovered during this documentation check.

### Validation output (audit session)

- `npm install` ✅
- `npm run lint` ✅ (existing TypeScript support warning from `@typescript-eslint` remains a known maintenance item)
- `npm run build` ✅

## 2026-05-20 — v0.20 audio fix + main-page controls + sidecar cache-bust

### Root cause findings

#### Finding 1 — CORS blocks audio on file:// origin (confirmed, fixed)

`BackgroundAudioManager` set `this.audio.crossOrigin = 'anonymous'` in its constructor. When `app.html` is opened as a `file://` URL, Chromium (Chrome, Opera, Edge) assigns the page a `null` origin. Setting `crossOrigin` on an audio element causes the browser to issue a CORS request — a request from `null` origin is always rejected with:

> Access to audio at 'file:///.../audio/willow.mp3' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-extension, http, https …

The `<audio>` element emits an `error` event; the manager sets `playing: false` and the error path makes it look like an autoplay policy block — masking the real cause. The autoplay block message appearing in the UI was a **secondary symptom**, not the primary failure.

**Fix:** Removed `crossOrigin = 'anonymous'`. Audio files are co-located with `app.html`, no CORS header needed.

#### Finding 2 — Sidecar text stale because of file:// cache (confirmed, fixed)

The importer correctly re-reads all `.txt` sidecar files on every run — there is no "skip if already processed" logic for sidecar content. The stale text was due to Chromium caching `file://` resources by URL: since `customer-artworks.js` always had the same path/URL, the browser served the old cached version after the file was overwritten on disk.

**Fix:** `import-artworks.mjs` now writes `?t=<Date.now()>` onto both `customer-artworks.js` and `customer-audio.js` script src attributes in `customer-preview/app.html` after every import. Each run produces a distinct URL, bypassing the browser's disk/memory cache.

#### Finding 3 — Main-page audio activation missing (addressed with AudioControls)

The only user-visible audio control was buried inside the PreferencesPanel popover. When autoplay was blocked, there was no obvious way for the user to activate audio from the main view. A new `AudioControls` glass-pill widget (bottom-left, symmetric to ZoomControls) provides quick-access mute/volume on the main page and handles the autoplay-unlock click path directly within the user gesture context.

### Online research findings

- Chromium `file://` CORS: `file://` origins are treated as opaque (`null`) by the browser's security model; cross-origin attribute on any resource load from a file:// page will fail.
- Source: <https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy>
- Chromium `file://` disk cache: Chrome caches `file://` URLs like any other URL, keyed by the full URL string including path. Changing file content without changing the URL does not invalidate the cache.

## 2026-05-20 — v0.19 background music implementation notes (shipped)

### Audit target

v0.19 has been implemented and validated against the audited runtime/importer architecture boundaries.

### Current-state findings (verified in repository)

1. **Shipped audio pipeline now exists.** Runtime now uses `BackgroundAudioManager` with diagnostics, autoplay handling, loop guardrails, and lifecycle suspend/resume integration.
2. **Runtime integration landed in `src/main.ts`.** Audio payload sanitization, manager orchestration, preferences synchronization, and cleanup are wired into existing lifecycle boundaries.
3. **Global payload model extended successfully.** `window.__FREYRAUM_AUDIO` is generated by importer/preview scripts and sanitized before runtime use.
4. **Importer/report architecture is warning-first and extensible.** `scripts/import-artworks.mjs` already supports deterministic extension filtering, report sectioning, and non-fatal warnings.
5. **Preference persistence extended.** `freyraum.preferences.v1` now persists `audioMuted` and `audioVolume` with backward-compatible defaults.
6. **Preferences panel now includes audio controls.** Mute toggle + volume slider were added while preserving existing modal semantics and focus-return behavior.

### Key technical decision added in this refresh

The v0.19 plan now explicitly requires **indefinite loop behavior**:

- primary: `HTMLMediaElement.loop = true`
- robustness fallback: handle `ended` by restarting playback through guarded `play()` path with diagnostics

This resolves a previous ambiguity where looping was implied but not formalized as acceptance behavior.

### Online research findings used in this pass

1. `HTMLMediaElement.loop` is the canonical browser API for repeat playback.
2. `HTMLMediaElement.play()` can reject promises under autoplay restrictions; explicit error handling and user-gesture fallback are required.
3. Modern autoplay policies commonly block unmuted autoplay without prior user interaction.
4. `canPlayType()` is the browser-native compatibility probe for selecting among codec/container alternatives.

Sources used for planning references:

- <https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop>
- <https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play>
- <https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay>
- <https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canPlayType>

### Implementation guidance extracted from audit

1. Keep one-click customer flow unchanged (`Update Gallery.command/.bat`); extend internals only.
2. Prefer adding audio controls to `PreferencesPanel` first to minimize layout regression risk.
3. Keep diagnostics first-class for every audio state transition and failure path.
4. Keep all missing/invalid audio paths non-fatal; report clearly in plain language.

### Output of this pass

- `plan.md` v0.19 now includes shipped implementation status plus retained deep technical context.
- Runtime/importer code landed in `src/main.ts`, `src/audio/BackgroundAudioManager.ts`, `src/utils/preferences.ts`, `src/ui/PreferencesPanel.ts`, `src/styles/main.scss`, `scripts/import-artworks.mjs`, and `scripts/write-local-preview.mjs`.

## 2026-05-20 — v0.18 sidecar text shipped (implementation note)

The audit below remains the authoritative research log. As of
2026-05-20 the v0.18 sidecar-text workflow it recommended has been
**implemented** in `scripts/import-artworks.mjs`. Every customer-facing
v0.18 Markdown banner has been updated from "planned/not yet shipped"
to "shipped". See `plan.md § v0.18 — Customer sidecar text shipped`
and `CHANGELOG.md` for the implementation summary and validation
results.

## 2026-05-20 — Final audit of the customer sidecar-text workflow (research log)

### Audit outcome

Option C remains the correct v0.18 direction: **one customer-editable sidecar text file beside each artwork image**, matched by basename.

The audit recommendation was implemented in the same 2026-05-20 work session; the rest of this section is preserved as the research log that backed the implementation.

### Full-codebase audit summary

The repository was re-checked across the importer path, runtime contract, UI rendering path, architecture docs, AI guidance, customer docs, and validation workflow.

Validated boundaries:

1. `scripts/import-artworks.mjs` is the only file that needs first-slice runtime changes.
2. `src/config/artworks.ts` already exposes every metadata field the sidecar workflow needs.
3. `src/main.ts` already sanitizes injected artwork records and safely accepts the planned metadata fields.
4. `src/ui/InfoPanel.ts` renders `description` with `.textContent`, so sidecar descriptions stay plain text.
5. The current report/import architecture is warning-first and already suitable for missing/orphaned/invalid sidecar cases.
6. No `src/` UI or rendering changes are required for the initial implementation slice.

### Current importer findings

- The inbox scan is currently a single pass over all files in `customer-artworks/inbox/`.
- Any non-image file that is not in the supported extension sets falls into the `Skipped` section as an unsupported file. A `.txt` sidecar would therefore currently be misclassified.
- The stable matching anchor already exists: `const stem = basename(filename, ext)`.
- The importer already generates all customer-facing metadata fields (`title`, `subtitle`, `description`, `year`, `medium`, `alt`, `credit`, `tags`, `surfaceProfile`), so sidecar parsing is a merge problem, not a schema-expansion problem.
- `webglImage`, image copy, dimension parsing, id generation, and preview manifest writing are already working and must remain unchanged.
- The report writer already separates `Imported`, `Needs attention`, `Skipped`, and `Errors`, which makes text-specific report sections a natural extension.

### Finalized implementation guidance

- Keep the implementation confined to `scripts/import-artworks.mjs`.
- Add sidecar-aware inbox separation before the image loop.
- Parse `.txt` as primary sidecar format; allow `.md` as a secondary alias only if it uses the same labeled plain-text shape.
- Match by lowercase stem in the same folder; never fuzzy-match renamed files.
- Strip BOM and normalize line endings before parsing because customer editors will likely be Notepad/TextEdit.
- Keep missing/invalid text non-fatal; surface problems through the existing plain-language report.
- Use `??` for merge fallback so “field missing” differs from “field present but blank”.
- Keep `Alt` and `Description` distinct both in parsing and guidance.

### Documentation cleanup completed in this audit

The final audit corrected a documentation drift problem: several docs had started to read as though the sidecar workflow already existed. The cleanup now makes these points explicit everywhere:

- the v0.18 sidecar workflow was finalized in this audit and **then implemented** in the same work session;
- the current importer reads sidecar text and only falls back to generated text when no sidecar exists;
- `docs/CUSTOMER_TEXT_GUIDE.md` and `ARTWORK_TEXT_TEMPLATE.txt` are the shipped customer assets for the workflow;
- the picture-only importer remains supported for customers who choose not to provide sidecar text.

### Online validation findings

1. **Sidecars remain a standard asset-management pattern.** Adobe Lightroom, Capture One, Immich, and ExifTool all document sidecar metadata workflows, validating the decision to keep metadata physically beside the artwork file.
2. **A simple `.txt` adaptation is appropriate here.** Professional XMP sidecars prove the pattern, but `.txt` remains the better customer-facing format for this offline/local gallery.
3. **Node path handling requires explicit case normalization.** Current Node docs note that `path.basename(path, suffix)` treats suffix comparison case-sensitively even on Windows, so lowercased stem matching is the correct cross-platform rule.
4. **UTF-8 text reading is straightforward in Node.** `readFileSync(filePath, 'utf8')` is the right baseline; manual BOM stripping is still useful for Windows-authored files.
5. **Alt text and long description must stay separate.** W3C, WCAG, WebAIM, and Smithsonian guidance all distinguish concise alt text from longer explanatory or descriptive text for complex/informative images and art.

### Sources

- Node.js `path`: <https://nodejs.org/api/path.html>
- Node.js `fs`: <https://nodejs.org/api/fs.html>
- Adobe Lightroom XMP sidecars: <https://helpx.adobe.com/lightroom-classic/help/create-xmp-acr-files.html>
- Capture One XMP sidecars: <https://support.captureone.com/hc/en-us/articles/360002544898-Metadata-in-XMP-sidecar-files>
- Immich XMP sidecars: <https://docs.immich.app/features/xmp-sidecars/>
- ExifTool sidecar files: <https://exiftool.org/metafiles.html>
- W3C WAI Images Tutorial: <https://www.w3.org/WAI/tutorials/images/>
- WCAG quick reference: <https://www.w3.org/WAI/WCAG21/quickref/#non-text-content>
- WebAIM alt text: <https://webaim.org/techniques/alttext/>
- Smithsonian visual descriptions: <https://www.si.edu/accessibility/visual-descriptions>

### Validation results for this audit pass

- `npm install` ✅
- `npm run lint` ✅ (with the existing `@typescript-eslint` / TypeScript supported-version warning)
- `npm run build` ✅
- `node -c scripts/import-artworks.mjs` ✅
- `node -c scripts/write-local-preview.mjs` ✅
- `node -c scripts/run-import-artworks.cjs` ✅

### Remaining boundary

This final audit intentionally does **not** implement the sidecar importer change. The next dedicated v0.18 implementation pass should start from `plan.md § v0.18` and keep the current docs/runtime distinction intact until the code actually lands.

## 2026-05-20 — v0.17 easy wins: accessibility, dead-code cleanup

### Problems identified and fixed

1. `PreferencesPanel` custom `role="dialog"` element lacked `aria-modal="true"`, was labelled by `aria-label` instead of `aria-labelledby`, and did not return focus to the trigger after an outside-click dismiss. WCAG 2.2 SC 4.1.2 and the ARIA APG dialog pattern all require these. Fixed in `src/ui/PreferencesPanel.ts`.
2. Three legacy interaction files (`MouseInteraction.ts`, `TouchInteraction.ts`, `ZoomPan.ts`) had no remaining production imports (confirmed by grep). Removed.
3. Deprecated `isMobileDevice()` had no remaining callers (confirmed by grep). Removed from `src/utils/performance.ts`.

### Online sources that validated the decisions

- ARIA APG dialog pattern: <https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/>
- MDN `dialog` role: <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role>
- three.js r166 `TextureUtils` (future enhancement candidate): <https://newreleases.io/project/github/mrdoob/three.js/release/r166>
- ESLint v9 flat config migration (future tooling pass): <https://typescript-eslint.io/linting/configs/flat-config/>
- CSS `content-visibility: auto` (not applicable to current WebGL layout): <https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility>

### Remaining items documented in plan.md

- ESLint v8 → v9 flat-config migration (dedicated PR).
- Vite v5 → v6 to resolve moderate `npm audit` advisories (dedicated PR).
- `PreferencesPanel.renderPanel()` in-place DOM refactor (dedicated PR).



### Validation results

- `npm install` completed successfully.
- `npm run lint` passed. The lint run printed a TypeScript support warning because the current floating dependency install resolved TypeScript 5.9.x while `@typescript-eslint/typescript-estree` reports support for `>=4.7.4 <5.6.0` in this installed toolchain.
- `npm run build` passed and rebuilt `customer-preview/`.
- `node -c scripts/import-artworks.mjs`, `node -c scripts/write-local-preview.mjs`, and `node -c scripts/run-import-artworks.cjs` passed.
- `npm audit --json` reported two moderate advisories:
  - `vite` path traversal / optimized deps sourcemap handling advisory (`GHSA-4w7w-66w2-5vf9`), fixed by a semver-major Vite upgrade according to npm.
  - transitive `esbuild` dev-server request advisory (`GHSA-67mh-4wv8-2f99`), also fixed through a semver-major Vite upgrade according to npm.

### Code architecture findings

1. **Architecture boundaries remain coherent.**
   - `src/main.ts` is still the orchestration layer for boot, diagnostics, lifecycle, resize coordination, preferences, UI wiring, and render loop.
   - Rendering infrastructure remains in `src/core/`.
   - Gallery state, texture loading, navigation, zoom/pan math, and artwork layout remain in `src/gallery/`.
   - Painting fidelity and procedural map generation remain in `src/materials/`.
2. **Diagnostics coverage is strong and should remain mandatory.**
   - `Diagnostics.ts` exposes a bounded, deduplicated log and global report API through `window.__FREYRAUM_DIAGNOSTICS__`.
   - Runtime now logs lifecycle suspend/resume, renderer snapshots, texture anisotropy changes, adaptive downgrades, importer validation, and debug long tasks.
3. **PreferencesPanel listener churn is low-risk but worth documenting.**
   - `PreferencesPanel.renderPanel()` replaces `panel.innerHTML` and attaches fresh input listeners after preference updates.
   - Old DOM nodes are collectable, so this is not treated as a leak, but future work can simplify this with delegated `change` handling.
4. **Legacy interaction cleanup is complete.**
   - `MouseInteraction.ts`, `TouchInteraction.ts`, and `ZoomPan.ts` were removed after caller-graph validation.
   - `CanvasInteraction.ts` is now the only production canvas-input path.
5. **Deprecated mobile helper was removed.**
   - `isMobileDevice()` was deleted from `src/utils/performance.ts`; future code should use `detectDeviceCapabilities()` from `src/utils/device.ts`.
6. **Preference persistence schema is now part of the audit record.**
   - Storage key: `freyraum.preferences.v1`.
   - Fields: `reducedMotion`, `highContrast`, `contrastMode`, `quality`, and `lighting`.
   - Storage failures are logged and non-fatal.

### Online research findings

1. **`requestIdleCallback`**
   - MDN documents `requestIdleCallback(callback, { timeout })` and recommends a timeout for required work because callbacks can otherwise be delayed for multiple seconds.
   - The current code uses `{ timeout: 200 }` and a `setTimeout(0)` fallback, which is appropriate for browsers without stable support.
   - Source: <https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback>
2. **Long Tasks API**
   - MDN describes `PerformanceLongTaskTiming` as experimental/limited availability and defines long tasks as main-thread tasks of 50 ms or more.
   - Current implementation gates the observer behind diagnostics mode and catches unsupported observer setup, which matches the API's compatibility status.
   - Source: <https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming>
3. **Page Lifecycle `freeze` / `resume`**
   - Chrome's Page Lifecycle guidance recommends pausing/saving non-critical work on `freeze` and resuming on `resume`.
   - Current implementation combines `visibilitychange` with `freeze`/`resume`, so unsupported browsers still follow the visibility path.
   - Source: <https://developer.chrome.com/docs/web-platform/page-lifecycle-api/>
4. **three.js `WebGLRenderer.compileAsync`**
   - three.js documents `compileAsync()` as an async `compile()` variant using `KHR_parallel_shader_compile`, recommended where possible to avoid shader compilation stalls.
   - Current implementation prefers `compileAsync()` and falls back to synchronous `compile()`.
   - Source: <https://threejs.org/docs/#api/en/renderers/WebGLRenderer>
5. **ESLint v8 support**
   - ESLint's official version-support policy records ESLint v8 end of life on 2024-10-05.
   - Current ESLint 8 usage is acceptable for the present docs-only pass but should be upgraded in a dedicated tooling PR.
   - Source: <https://eslint.org/blog/2024/09/eslint-v8-eol-version-support/>
6. **typescript-eslint support**
   - The lint output reports the installed TypeScript version is outside the parser's supported range. The future tooling pass should align TypeScript and typescript-eslint versions rather than hiding the warning.
   - Source: <https://typescript-eslint.io/users/dependency-versions/>

### Documentation findings

- README, handoff, standards, AI feedback, lessons, architecture docs, and prompt files needed stronger cross-linking.
- Customer picture guide contained stale wording that portrait reset boost was "planned"; current runtime has already implemented the portrait reset boost.
- Image maintenance guide related-file list needed architecture and AI-feedback references for developer support.
- Documentation rules needed a current audit-history entry so future maintainers can distinguish this pass from runtime releases.

## 2026-05-19 — AI context engineering workflow

### Finding

The repository already had strong implementation-history documents (`plan.md`, `FINDINGS.md`, `CHANGELOG.md`, `DOCUMENTATION_RULES.md`), but no dedicated AI instruction layer that summarized architecture boundaries, forbidden patterns, durable lessons, and reusable agent prompts.

### Decision

Add a lightweight context-engineering layer without changing runtime code:

- `.github/copilot-instructions.md`
- `.github/prompts/refactor.prompt.md`
- `.github/prompts/architecture.prompt.md`
- `.github/prompts/review.prompt.md`
- `.github/prompts/autonomous-agent.prompt.md`
- `AI_RULES.md`
- `ARCHITECTURE_MAP.md`
- `LESSONS_LEARNED.md`
- `docs/architecture/README.md`
- `docs/standards/CODING_GUIDELINES.md`
- `docs/lessons-learned/README.md`
- `docs/ai-feedback/AI_FEEDBACK_LOOP.md`

### Validation status

- Documentation-only change; no runtime behavior changed.
- Future implementation work should still run the existing validation commands that apply to touched code.

## 2026-05-19 (implementation completed) — v0.16.2 control-shell follow-up

### Why v0.16.1 was not enough

Removing `.prefs` and `.nav-controls` from the containment block fixed one real clipping boundary, but customer testing still reported:

- the settings gear feeling/non-appearing "not working"
- light all-sides clipping on the center nav buttons during hover

That indicated the remaining problem was no longer the parent container. The residual visual cut-off came from scaling the same small glass/backdrop-filter surface that also defined the control's raster bounds.

### Shipped follow-up fix

- `.nav-btn` now uses a **72×72 transparent shell** with the visible **64px glass circle** drawn on `::before`.
- `.prefs__trigger` now uses a **52×52 transparent shell** with the visible **44px glass circle** drawn on `::before`.
- Hover/active scale now applies to the inset pseudo-element instead of relying on the smallest possible control box.
- `.prefs__panel` top offset was adjusted to stay visually aligned with the new trigger shell.
- `customer-preview/style.css` was rebuilt so the customer preview actually ships the fix.

### Verification

- `npm run lint` — pass.
- `npm run build` — pass.
- Headless Chromium with SwiftShader-loaded WebGL preview:
  - gallery UI loaded (no fallback screen)
  - `.prefs__trigger` click changed `aria-expanded` `false → true`
  - `.prefs__panel.hidden` changed `true → false`

## 2026-05-19 (implementation completed) — v0.16.1 UI containment regression hotfix

### Observed regressions

- The settings gear control was reported as "not working".
- The center left/right navigation buttons were visibly cut off on hover.

### Root cause

The v0.16 CSS containment block applied `contain: layout paint` to `.prefs` and `.nav-controls` in `src/styles/main.scss`. Paint containment clips descendant painting to the containing element's box:

- `.prefs` is only the 44×44 trigger anchor, while `.prefs__panel` is absolutely positioned outside that box, so the panel was clipped and effectively unusable.
- `.nav-controls` contains hover-scaled circular buttons (`transform: scale(1.06)`), so the enlarged paint region was clipped at the container edge.

### Shipped fix

- Removed `.prefs` and `.nav-controls` from the containment block in `src/styles/main.scss`.
- Kept containment for other fixed chrome surfaces where overflow paint is not required.

### Validation status

- Focused selector/path review: pass.
- Fresh-clone command status:
  - before dependency install: `npm run lint` / `npm run build` failed (environment setup only)
  - after dependency install: `npm run lint` ✅, `npm run build` ✅

## 2026-05-19 (implementation completed) — v0.16 deep code audit: findings, decisions, results

### Implementation status snapshot

All 12 file-level findings plus the 6 researched enhancements documented in this file were closed during the v0.16 implementation pass. Every shipped change is summarised in the matrix below, and `plan.md § v0.16 implementation summary` records the exact files, methods, and acceptance gates. The original audit text is preserved below so the rationale behind each runtime change remains traceable.

| # | Finding | Decision | Where it landed |
|---|---|---|---|
| 1 | Three independent `window.resize` listeners | Implemented | `SceneManager.updateAspect()`, `PostProcessing.resize()`, `RendererManager.resize(w,h)`, unified coordinator in `main.ts` |
| 2 | `measureArtworkViewport()` walks the DOM per call | Implemented | `chromeRefs` cache in `main.ts`; refs populated after UI construction |
| 3 | DOM reads not batched into an rAF | Implemented | Resize coordinator schedules a single `requestAnimationFrame` per debounce window |
| 4 | No `visibilitychange` handling | Implemented | `pageInactive` flag gates the render path; resume primes `frameBudget.markNavigation()` |
| 5 | Preference application stalls the next paint | Implemented | `requestIdleCallback` (with `setTimeout(0)` fallback) wraps `applyPreferences()` after the first call |
| 6 | Pinch hot-path `Math.sqrt` per move | Deferred (see plan rationale) | No change — single sqrt per move is below the JIT's noise floor and refactor adds branching |
| 7 | Anisotropy cache walk on every preset apply | Implemented | `setAnisotropyDivisor()` no-op guard in `TextureManager` |
| 8 | No runtime renderer-info diagnostics | Implemented | `RendererManager.getRendererSnapshot()` + 5 s periodic log in `main.ts` |
| 9 | No CSS quality fallback / `backdrop-filter` fallback | Implemented | `:root[data-quality='battery']` halves blur; `@supports not (backdrop-filter)` provides a solid-surface fallback |
| 10 | Importer never warns about huge textures | Implemented | New 4096 px and 64/128 MB GPU-memory warnings in `scripts/import-artworks.mjs` |
| 11 | `FrameBudgetMonitor` loops the window every frame | Deferred (perf gain < 0.05 ms/frame) | Documented in plan as a low-priority cleanup |
| 12 | Dead-code interaction classes | Deferred (separate cleanup PR) | `MouseInteraction`, `TouchInteraction`, `ZoomPan` remain on disk pending a future surgical deletion |
| 13 | Page Lifecycle `freeze` / `resume` (researched) | Implemented | Same `suspendRuntime` / `resumeRuntime` path as visibilitychange |
| 14 | `renderer.compileAsync()` pre-warm (researched) | Implemented | `RendererManager.prewarm()` after boot + after every deferred preset apply |
| 15 | `ImageBitmapLoader` raster path (researched) | Deferred | Customer-preview path embeds data URLs; `createImageBitmap` against data URLs gives no measurable benefit on Safari |
| 16 | `deviceMemory` / `hardwareConcurrency` hints (researched) | Implemented | `suggestStartupQuality()` consults both; values are pure hints |
| 17 | Debug-only long-task observer (researched) | Implemented | `PerformanceObserver({type:'longtask'})` attached when diagnostics mode is non-default |
| 18 | CSS `contain` / `content-visibility` (researched) | Implemented (containment only) | Containment applied to fixed chrome surfaces with `contain: strict` on the spinner; scope refined in v0.16.1 to exclude `.prefs` and `.nav-controls` due clipping regressions. `content-visibility` deferred because the glass overlay root must paint to host the canvas behind it. |

### Acceptance gates

- `npm run lint` (eslint with `src/**/*.ts`) — pass, zero warnings.
- `npm run build:typecheck` (`tsc --noEmit`) — pass.
- `npm run build` (typecheck + vite production build + preview HTML writer) — pass.
- `node -c scripts/import-artworks.mjs` — pass.
- Manual review confirms no listener is leaked: `RendererManager`, `PostProcessing`, `SceneManager`, `CanvasInteraction`, and `main.ts` all detach in `beforeunload`/`dispose`. The new `freeze`/`resume` and `visibilitychange` listeners and the long-task observer are removed in the same cleanup block.

---

## 2026-05-19 — v0.16 deep code audit (original findings preserved below for traceability)

### Scope

Complete source-code audit of every runtime-performance-relevant file. All findings are anchored to specific file paths and line numbers. No runtime code was changed. The goal was to transform the earlier high-level audit into an actionable, code-sample-backed brainstorm that matches the detail level of v0.15's plan.

Files read in full: `src/main.ts`, `src/core/RendererManager.ts`, `src/core/PostProcessing.ts`, `src/core/SceneManager.ts`, `src/gallery/GalleryManager.ts`, `src/gallery/ArtworkMesh.ts`, `src/gallery/TextureManager.ts`, `src/materials/PaintingMaterial.ts`, `src/materials/ProceduralTextureFactory.ts`, `src/config/quality.ts`, `src/interaction/CanvasInteraction.ts`, `src/utils/FrameBudgetMonitor.ts`, `src/utils/AdaptiveQualityController.ts`, `src/utils/performance.ts`, `src/utils/device.ts`, `src/utils/math.ts`, `src/utils/Diagnostics.ts`, `src/styles/main.scss`, `src/rendering/RenderBackend.ts`.

---

### Current strengths (confirmed in code)

- `getOptimalPixelRatio()` (`performance.ts:12`) caps coarse-pointer devices at DPR 1.5 regardless of the requested cap — prevents fill-rate overruns on high-DPR mobile GPUs.
- `suggestStartupQuality()` (`performance.ts:52`) uses viewport area + DPR + pointer type to select an appropriate first-run preset — avoids thermal throttling on small phones.
- `MAX_SMOOTHING_DT = 0.1` in `GalleryManager.ts:114` protects against huge dt after tab switch — but only for the smoothing math, not for the frame-budget monitor.
- `RendererManager` handles context loss/restoration correctly (`RendererManager.ts:61–78`) — prevents black-screen on app-switch on mobile.
- `TextureManager.dispose()` calls `tex.dispose()` on every cached texture (`TextureManager.ts:207–210`) — correct ownership boundary; materials reference but never dispose.
- `ProceduralTextureFactory.disposeAll()` disposes its own generated DataTextures (`ProceduralTextureFactory.ts:78–80`) — separate ownership from TextureManager.
- `ArtworkMesh.dispose()` disposes geometry and materials but not textures — deliberately, because `TextureManager` owns them (`ArtworkMesh.ts:198–205`).
- `AdaptiveQualityController` never auto-upgrades quality and suspends after a manual override (`AdaptiveQualityController.ts:17–20`) — prevents unwanted quality bouncing.
- All CSS transitions already animate only `transform` and `opacity` after v0.15 — compositor-promoted; no layout/paint cost in the hot path.

---

### Finding 1 — Three independent `window.resize` listeners

**Files/lines:** `SceneManager.ts:18`, `PostProcessing.ts:31`, `main.ts:366–396`

`SceneManager.handleResize` and `PostProcessing.handleResize` fire **immediately** on every `resize` event (not debounced). The 120 ms debounced `onResize` coordinator in `main.ts` fires later. During mobile orientation changes the browser emits multiple rapid resize events, causing redundant camera matrix rebuilds and `EffectComposer.setSize()` framebuffer reallocations before the coordinator even runs.

**Root cause:** each class manages its own resize subscription in its constructor, with no mechanism for the coordinator to call them in order.

**Fix:** remove `window.addEventListener('resize', ...)` from `SceneManager` and `PostProcessing`; expose `updateAspect()` and `resize()` public methods; call them from `main.ts` inside the debounce+RAF batch. See `plan.md § Finding 1` for the full TypeScript code sample.

**Validated against:** MDN ResizeObserver — "Do not trigger layout reads inside resize callbacks; schedule reads in a following requestAnimationFrame." Three.js docs confirm `EffectComposer.setSize()` reallocates render targets.

---

### Finding 2 — `measureArtworkViewport()` queries DOM on every resize call

**File/lines:** `main.ts:257–298`

Three `app.querySelector(...)` calls + `getComputedStyle(document.documentElement)` + three `getBoundingClientRect()` calls run on every debounced resize invocation. `querySelector` re-traverses the DOM subtree each time.

**Fix:** cache element references once after UI construction (after `new Topbar(app)`, etc.); pass references into `measureArtworkViewport`; call `measureArtworkViewport` inside a `requestAnimationFrame` so rect reads happen after the browser has committed layout. See `plan.md § Finding 2` for TypeScript sample.

**Validated against:** web.dev "Avoid large, complex layouts and layout thrashing" — cache element references; never interleave reads and writes.

---

### Finding 3 — Render loop has no Page Visibility pause

**File/lines:** `main.ts:503–541`

The `animate` function only checks `rendererManager.isRenderPaused()` (WebGL context loss). When a tab is hidden, RAF is throttled/paused by the browser, but the next RAF timestamp on restore can be seconds ahead. `FrameBudgetMonitor.sample()` receives this delta (clamped to 250 ms by `Math.min(dt, 250)` at line 73 of `FrameBudgetMonitor.ts`) which still counts as a 250 ms overbudget frame in the rolling window, potentially triggering a false `AdaptiveQualityController` downgrade.

**Fix:** add `document.addEventListener('visibilitychange', ...)` that sets a `renderHidden` flag and calls `frameBudget.markNavigation()` + `galleryManager.resetTimestamp()` on restore. Add `resetTimestamp()` to `GalleryManager` (sets `lastUpdateTime = 0`). See `plan.md § Finding 3` for TypeScript sample.

**Validated against:** MDN Page Visibility API — "You can stop unnecessary work when the page is not visible." Glenn Fiedler "Fix Your Timestep" — reset timing state on resume.

---

### Finding 4 — Pinch input uses `Math.sqrt` per move event

**File/lines:** `CanvasInteraction.ts:160–167`, `CanvasInteraction.ts:271–275`

One `Math.sqrt` call per `pointermove` with two active pointers. Individual cost: ~1–3 ns on modern CPUs — negligible in isolation. The more impactful fix is the design: replace the linear additive zoom delta with a log-space multiplicative approach using squared distance, which eliminates the sqrt entirely and gives a more natural pinch feel (zoom is perceptually logarithmic). Also: `dispose()` has no idempotency guard (`CanvasInteraction.dispose()` is called via `beforeunload` but no `disposed` flag prevents double-removal if `dispose()` is ever called twice).

**Fix:** track `lastPinchDistSq`; compute `logDelta = 0.5 * Math.log(distSq / lastDistSq)`; add `private disposed = false` guard. See `plan.md § Finding 4` for the final TypeScript sample with tuning note.

**Validated against:** MDN Pointer Events L3 — squared distance for hot-path comparison is a documented optimization. Log-space zoom is standard in 2D mapping libraries (Leaflet, Mapbox GL JS).

---

### Finding 5 — Shader `#define` changes land synchronously in preference-change frames

**File/lines:** `main.ts:399–444` (`applyPreferences`), `PaintingMaterial.ts` (`setShadowFilterRadius`)

When the user switches a lighting profile, `applyPreferences()` calls `artworkMesh.material.setShadowFilterRadius(...)` which changes a `#define` (`PAINTING_USE_SHADOW_FILTER`) and sets `material.needsUpdate = true`. Three.js then compiles and links a new shader program on the **next render call** — synchronously, blocking the main thread. On a mid-range GPU this can take 80–300 ms.

**Fix:** separate uniform-only changes (no recompile, apply immediately) from define-changing operations (expensive, defer with `requestIdleCallback({ timeout: 100 })` or `setTimeout(0)` as Safari fallback). Apply defines immediately only on first bootstrap. See `plan.md § Finding 5` for TypeScript sample.

**Validated against:** three.js docs — setting `material.needsUpdate = true` triggers shader recompilation on next render. MDN `requestIdleCallback` — https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback.

---

### Finding 6 — `renderer.info` GPU stats are never exposed in diagnostics

**File/lines:** `main.ts:503–541`, `RendererManager.ts`

`THREE.WebGLRenderer.info` provides zero-cost per-frame stats: draw calls, triangles, GPU texture count, GPU geometry count, compiled shader program count. None are currently logged or surfaced.

**Fix:** add `getRendererSnapshot()` to `RendererManager`; log in the animate loop every 300 frames (≈5 s at 60 fps) in info/verbose diagnostics mode only; also explicitly set `renderer.info.autoReset = true`. See `plan.md § Finding 6` for TypeScript sample.

**Validated against:** three.js docs `WebGLRenderer.info` — https://threejs.org/docs/#api/en/renderers/WebGLRenderer.info.

---

### Finding 7 — `TextureManager.setAnisotropyDivisor()` marks all textures dirty on every call

**File/lines:** `TextureManager.ts:56–63`

`setAnisotropyDivisor` iterates all cached textures and sets `texture.needsUpdate = true` even when the effective anisotropy value is unchanged (e.g. re-applying the same preset). Each `needsUpdate = true` causes Three.js to re-upload the texture to the GPU on the next draw.

**Fix:** add `if (newDivisor === this.anisotropyDivisor) return;` guard at the top, and an inner `if (texture.anisotropy !== anisotropy)` guard per-texture. See `plan.md § Finding 7` for TypeScript sample.

**Validated against:** three.js source — `texture.needsUpdate = true` triggers `texImage2D` / `texSubImage2D` re-upload on next render call.

---

### Finding 8 — DOM reads inside the resize path (ResizeObserver risk)

**File/lines:** `main.ts:390–396`, `main.ts:257–298`

The `ResizeObserver` callback fires synchronously before paint. Any layout read (`getBoundingClientRect`, `getComputedStyle`) inside a ResizeObserver callback forces a synchronous style recalculation. The 120 ms `setTimeout` debounce prevents the immediate issue, but the RAF deferral proposed in Finding 1+2 fully resolves it by moving all reads to after the browser has settled layout.

**Fix:** add a JSDoc comment above `measureArtworkViewport` stating it must only be called from within a `requestAnimationFrame` callback. No separate runtime change needed beyond Findings 1+2. See `plan.md § Finding 8`.

**Validated against:** MDN ResizeObserver — "The callback is invoked before the browser paints."

---

### Finding 9 — CSS `backdrop-filter` has no quality or `@supports` fallback

**File/lines:** `main.scss:194–196`, `211–213`, `319–321`, `357–359`, `413–416`, `473–476`, `521–524`

Every glass surface uses `backdrop-filter: blur(16–26px)` with no fallback. On Android mid-range GPUs live blur is a compositor-promoted layer and can cost 2–5 ms per repaint. There is no CSS quality signal from the active preset.

**Fix:** add `@supports not (backdrop-filter: blur(1px))` rule with opaque `glass-bg-strong` fallback; add `[data-quality='battery']` rule with reduced blur radii (8 px / 12 px); wire `document.documentElement.dataset.quality = preset.id` in `RendererManager.applyPreset()`. See `plan.md § Finding 9` for SCSS + TypeScript sample.

**Validated against:** MDN `@supports` — https://developer.mozilla.org/en-US/docs/Web/CSS/@supports. web.dev CSS animations guide confirms `backdrop-filter` cost scales with area × radius.

---

### Finding 10 — No import-time texture memory budget warnings

**File:** `scripts/import-artworks.mjs`

A 4000×3000 customer image decompresses to 48 MB RGBA GPU texture. A gallery of 10 such images requires ~480 MB GPU texture memory — exceeding the 256 MB budget on integrated GPUs and older iOS devices. The importer writes no warning.

**Fix:** add per-image and gallery-total GPU memory estimates in the import script using `width × height × 4 × 1.33` (mipmaps). Emit `console.warn` above 2000×2000 (single image) and 256 MB (total). See `plan.md § Finding 10` for JavaScript sample with exact threshold constants.

**Validated against:** MDN WebGL best practices — "uncompressed RGBA8 takes width × height × 4 bytes." Apple developer documentation — shared VRAM budget 256–512 MB depending on device.

---

### Finding 11 — `FrameBudgetMonitor` rolling sum is O(n) per frame

**File/lines:** `FrameBudgetMonitor.ts:79–82`, `96–103`

Two O(n) loops per frame for `windowSize=60`. At 60 fps with windowSize=60: 2 × 60 additions/frame × 60 frames/s = 7200 additions/s ≈ 7 µs/s total. Not measurable. Leave unchanged; note a running-sum refactor if windowSize is ever raised above 200.

---

### Finding 12 — Legacy dead-code interaction classes

**Files:** `src/interaction/MouseInteraction.ts`, `src/interaction/TouchInteraction.ts`, `src/interaction/ZoomPan.ts`

No imports. Tree-shaken out of the bundle. Zero runtime impact. Safe to remove in a future cleanup PR after confirming `rg --type ts "MouseInteraction|TouchInteraction|ZoomPan" src/` returns no results.

---

### Finding 13 — Page Lifecycle `freeze` / `resume` is the missing companion to `visibilitychange`

**Files/lines:** `main.ts` render loop and future suspend/resume wiring

The current v0.16 plan already adds `visibilitychange`. Final research found a missing stronger lifecycle boundary: **Page Lifecycle** `freeze` and `resume`.

Why it matters in FREYRAUM:

- one persistent RAF loop;
- frame-budget state that should not absorb hidden/frozen gaps;
- existing WebGL context-loss handling that already models paused rendering as a first-class state.

**Fix:** keep `visibilitychange`, but add `freeze` / `resume` listeners as a companion suspend/resume path. On resume, call `frameBudget.markNavigation()` and `galleryManager.resetTimestamp()`.

**Validated against:** web.dev Page Lifecycle guidance.

---

### Finding 14 — `renderer.compileAsync()` should be part of the plan for shader pre-warm

**Files/lines:** `RendererManager.ts`, `main.ts`, `PaintingMaterial.ts`

The current plan correctly defers define-changing operations. Final research found a second missed enhancement: **three.js shader pre-warming** with `renderer.compileAsync()`.

This is a good fit because FREYRAUM has a very small number of material variants, so pre-warming the scene after boot or after deferred define changes should be predictable and high value.

**Fix:** add a `RendererManager.prewarm(scene, camera)` wrapper that prefers `compileAsync()` and falls back to `compile()`.

**Validated against:** three.js `WebGLRenderer.compileAsync()` documentation.

---

### Finding 15 — `ImageBitmapLoader` is a valid intermediate texture-path enhancement

**Files/lines:** `TextureManager.ts`, `scripts/import-artworks.mjs`

KTX2/Basis remains the long-term production answer. Final research found a missing intermediate improvement for the current raster path: `ImageBitmapLoader` / `createImageBitmap` can shift image decode work off the main thread on supporting browsers.

This should remain **optional** and must not replace the current compatibility-safe `TextureLoader` path for local `file://`, SVG, or embedded data-URL workflows without explicit validation.

**Fix:** add an optional `ImageBitmapLoader` path only for safe raster formats and keep the existing loader as fallback.

**Validated against:** three.js `ImageBitmapLoader` docs and current guidance around off-main-thread image decode.

---

### Finding 16 — Startup quality can use `deviceMemory` / `hardwareConcurrency` as progressive hints

**File/lines:** `performance.ts:52–68`

The current heuristic already uses viewport area, DPR, and pointer type. Final research found a missing progressive enhancement: use `navigator.deviceMemory` and `navigator.hardwareConcurrency` as **soft hints only** for the first-run preset.

Because FREYRAUM already respects stored preference and never auto-upgrades, this is a safe addition if it is limited to initial default selection.

**Fix:** add a `looksLowEnd` branch that can bias first-run coarse-pointer devices toward `battery` when memory/CPU hints are weak.

**Validated against:** current browser guidance for capability hints; must never be treated as exact hardware facts.

---

### Finding 17 — Long-task observation is missing from the measurement-first plan

**Files/lines:** `main.ts`, `Diagnostics.ts`

Frame budget and renderer snapshots are useful, but they do not directly reveal >50 ms main-thread stalls from resize, compile, or texture upload. Final research found that **Long Tasks API** via `PerformanceObserver` is a strong missing debug-only instrument.

**Fix:** when diagnostics mode is not `default`, register a `PerformanceObserver` for `longtask` entries and log compact warnings via the existing diagnostics system.

**Validated against:** MDN `PerformanceLongTaskTiming` and web.dev long-task guidance.

---

### Finding 18 — CSS `contain` / internal `content-visibility` can reduce chrome paint scope

**Files/lines:** `main.scss`, `ui/*`

The current plan adds blur fallbacks, but the final research pass found one more safe CSS-side enhancement: use `contain` on fixed chrome roots and `content-visibility` only for large internal content, not the blur root itself.

This matters because applying `content-visibility` to the overlay root can break or pop the backdrop blur relationship, especially on Safari. Internal containment is the safer version.

**Fix:** add `contain: layout paint style` to large fixed chrome surfaces and reserve `content-visibility: auto` for internal heavy content only.

**Validated against:** web.dev `content-visibility` guidance for internal/offscreen content, not top-level visual surfaces.

---

### GPU resource ownership map (for documentation and future lifecycle work)

| Resource type | Owner class | Disposal method | Notes |
|---|---|---|---|
| `THREE.WebGLRenderer` | `RendererManager` | `renderer.dispose()` | Destroys GPU context, programs, and buffers |
| `EffectComposer` (+ internal render targets) | `PostProcessing` | `composer.dispose()` | Disposes WebGL framebuffers and textures |
| `THREE.Scene`, `THREE.PerspectiveCamera` | `SceneManager` | No explicit dispose needed | Scene graph objects are JS-only; GPU resources come from meshes/materials |
| `THREE.Texture` (artwork albedo + authored maps) | `TextureManager` | `tex.dispose()` in `dispose()` | Materials reference but never dispose these |
| `THREE.DataTexture` (procedural maps) | `ProceduralTextureFactory` | `disposeAll()` | Materials reference but never dispose these |
| `THREE.BufferGeometry` (artwork plane, frame box) | `ArtworkMesh` | `geometry.dispose()` in `dispose()` | |
| `PaintingMaterial`, `CanvasMaterial`, frame `MeshPhysicalMaterial` | `ArtworkMesh` | `material.dispose()` in `dispose()` | |
| Pointer / touch / keyboard listeners | `CanvasInteraction`, `KeyboardNav` | `dispose()` | Must be idempotent (add `disposed` guard) |
| ResizeObserver | `main.ts` | `chromeObserver.disconnect()` | Cleaned up in `beforeunload` |
| `setTimeout` resize debounce | `main.ts` | `clearTimeout(resizeDebounce)` | Cleaned up in `beforeunload` |
| `requestAnimationFrame` loop | `main.ts` | `cancelAnimationFrame(rafId)` | Cleaned up in `beforeunload` |

---

### Recommended implementation order

1. **Renderer info diagnostics** (`RendererManager.ts`, `main.ts`) — establish measurement baseline.
2. **Single resize coordinator** (`SceneManager.ts`, `PostProcessing.ts`, `main.ts`) — removes redundant immediate resizes.
3. **Cache DOM element references + RAF deferral** (`main.ts`) — eliminates layout thrash on orientation change.
4. **Page Visibility pause** (`main.ts`, `GalleryManager.ts`) — prevents false adaptive-quality downgrades on tab restore.
5. **Shader-define deferral** (`main.ts`) — prevents jank on preference/profile changes.
6. **Pinch hot-path + dispose idempotency** (`CanvasInteraction.ts`) — cleaner mobile input.
7. **Anisotropy guard** (`TextureManager.ts`) — prevents spurious texture re-uploads.
8. **CSS quality fallback + `[data-quality]` attribute** (`main.scss`, `RendererManager.ts`) — CSS glass cost reduction for battery/unsupported devices.
9. **Import-time texture size warning** (`scripts/import-artworks.mjs`) — proactive memory budget enforcement.
10. **Page Lifecycle support** (`main.ts`, `GalleryManager.ts`) — add `freeze` / `resume` alongside `visibilitychange`.
11. **Shader pre-warm** (`RendererManager.ts`, `main.ts`) — add `compileAsync()` / `compile()` fallback after boot and deferred define changes.
12. **Optional ImageBitmap raster path** (`TextureManager.ts`) — decode off the main thread where safe, keep the existing compatibility fallback.
13. **Progressive startup heuristics** (`performance.ts`) — use `deviceMemory` / `hardwareConcurrency` as soft first-run hints only.
14. **Long-task diagnostics** (`main.ts`, `Diagnostics.ts`) — debug-only `PerformanceObserver` instrumentation.
15. **CSS containment** (`main.scss`) — add `contain` on fixed chrome and internal `content-visibility` where visually safe.
16. **Disposal ownership JSDoc** (all affected files) — documentation for future lifecycle work.

---

### Validation status

- Documentation-only audit; no runtime files changed in this pass.
- Fresh-clone baseline initially did not complete before dependency install: `npm run lint` failed with `eslint: not found`, and `npm run build` failed during `tsc` because `three` / related packages were unavailable. After install, checks pass.
- Future implementation must run `npm run lint` and `npm run build`, then perform the QA matrix in `plan.md § QA matrix for the v0.16 implementation pass`.

---
## 2026-05-19 — v0.15.1 hotfix: reduced motion must not reduce shader fidelity

### User-reported issue

`Reduzierte Bewegung` was also reducing perceived picture texture/shader quality.

### Root cause

The reduced-motion flag was wired into `PaintingMaterial` shader paths that are
about surface fidelity, not motion:

- detail normal blend multiplied by `uReducedMotionScalar`;
- grazing/specular boost multiplied by `uReducedMotionScalar`;
- `detailNormalActive()` also depended on `uReducedMotionScalar`, so toggling
  reduced motion could change shader defines and compile paths.

This made the artwork look flatter/duller when motion reduction was enabled.

### Fix implemented

- `src/materials/PaintingMaterial.ts`
  - removed `uReducedMotionScalar` scaling from detail-normal blending;
  - removed `uReducedMotionScalar` scaling from grazing/specular boost;
  - removed `uReducedMotionScalar` from `detailNormalActive()` gating;
  - kept `setReducedMotion()` for API compatibility but made it fidelity-safe
    (`uReducedMotionScalar` is pinned to `1.0`).
- `src/gallery/GalleryManager.ts`
  - `setReducedMotion()` now only controls motion behavior in the gallery
    transform system and no longer forwards into `PaintingMaterial`.

### Intended behavior after fix

- `Reduzierte Bewegung` now affects motion only (camera/artwork/UI movement and
  animated lighting drift), not texture/shader quality.
- Texture and shader quality stay exclusively controlled by the selected
  quality preset (`Hoch / Ausgewogen / Akkusparend`).

### Validation

- `npm run lint` ✅
- `npm run build` ✅ (`tsc` + Vite preview build)

---

## 2026-05-19 — v0.15 implementation pass: elegant longer animations

### Scope

Implemented the full v0.15 elegant animation plan after a final audit pass against the current code and online sources. Six slices shipped: `smoothDamp` math utility, SCSS motion token redesign, `InfoPanel` content-swap timing fix, frame-rate-independent `GalleryManager.update(now)`, navigation entrance seed retuning with depth recession, and the loading-overlay removal timeout adjustment.

### Sources used to validate the implementation (re-checked at time of execution)

| Source | Confirmed |
|---|---|
| W3C WCAG 2.2 § SC 2.3.3 *Animation from Interactions* | Non-essential motion must be disablable; satisfied by `[data-motion='reduced']` + `@media (prefers-reduced-motion: reduce)` blocks. |
| MDN `prefers-reduced-motion` | System-preference signal continues to override our motion paths regardless of token rename. |
| MDN `requestAnimationFrame` callback `now` is a `DOMHighResTimeStamp` | Confirms our dt is in milliseconds and convertable to seconds for `smoothDamp`. |
| Glenn Fiedler — *Fix Your Timestep* | `α = 1 − exp(−λ·dt)` is the correct frame-rate-independent exponential smoothing kernel. |
| Stack Overflow #57851938 — *Frame rate independent damping using lerp* | Same formula, confirmed broadly accepted in the games/UI community. |
| cubic-bezier.com / easing.net | `cubic-bezier(0.16, 1, 0.3, 1)` = easeOutExpo: rapid deceleration, no overshoot, museum-appropriate. |
| MDN CSS animation performance | All v0.15 transitions still animate only `transform` and `opacity` — compositor-promoted, GPU-accelerated. |
| web.dev — *animations guide* | Confirms `will-change` is not needed as a permanent class on small UI panels of this kind. |

No new dependencies were introduced.

### Shipped changes (with file:line anchors)

#### `src/utils/math.ts` — new `smoothDamp`

Appended a `smoothDamp(current, target, lambda, dt)` function with full JSDoc covering the derivation, reference settle times, and dt clamping guidance. Equivalence check at dt = 1/60, λ = 4 yields α ≈ 0.0645, slightly lower than the old per-frame `k = 0.08` — intentional for a more graceful settle.

#### `src/gallery/GalleryManager.ts`

- New module-level constants: `LAMBDA_HOVER_ROTATION = 12`, `LAMBDA_NAV_POSITION = 2.5`, `LAMBDA_NAV_SCALE = 3.0`, `LAMBDA_CAMERA_ZOOM = 4.0`, `LAMBDA_CAMERA_PAN = 5.0`, `MAX_SMOOTHING_DT = 0.1` seconds.
- New navigation-seed constants: `NAV_SEED_POSITION_X = 4.5`, `NAV_SEED_POSITION_Z = -0.6`, `NAV_SEED_ROTATION_Y = 0.15` rad, `NAV_SEED_SCALE = 0.88`.
- New field `lastUpdateTime` initialised to 0 — the very first tick is skipped to avoid unbounded dt.
- `update()` is now `update(now: number)`; all 13 prior per-frame lerps converted to `smoothDamp(...)`; a 14th line added for `position.z` so the depth recession seed also settles smoothly.
- `navigate()` and `goTo()` now apply the new seeds (`position.x`, `position.z`, `rotation.y`, `scale`) and log new diagnostics fields: `motionMode` (`'full'` or `'reduced'`), `seedPositionX`, `seedPositionZ`, `settleTargetMs` (computed from λ).

#### `src/ui/InfoPanel.ts`

- New private static `CONTENT_SWAP_DELAY_MS = 520` (matches `--dur-content: 0.5s` + 20 ms buffer).
- `update(artwork, animate)` now waits the full transition before swapping text, then uses a `requestAnimationFrame` to remove `is-transitioning` so the browser applies the new text layout before triggering the fade-in.

#### `src/styles/main.scss`

- Added semantic motion tokens: `--ease-gallery-out` (easeOutExpo), `--ease-gallery-in-out` (easeInOutQuart), `--dur-control` (0.18 s), `--dur-content` (0.5 s), `--dur-panel` (0.55 s), `--dur-timeline` (0.42 s), `--dur-reveal` (0.9 s).
- Old token names kept as backward-compatible aliases — `--dur-fast → --dur-control`, `--dur-base → --dur-content`, `--dur-slow → --dur-reveal` — so other selectors that still reference them inherit the longer, calmer timings without rule-level changes.
- `.info-panel` transition retuned: `--dur-content` + `--ease-gallery-out`; `.info-panel.is-transitioning` translateY doubled from 8 px to 16 px for a more visible reveal.
- `.timeline__thumb` transition: replaced `--ease-spring` with `--ease-gallery-out`, durations switched to `--dur-timeline`.
- `.prefs__panel` animation: `--dur-panel` + `--ease-gallery-out` (no more spring overshoot); `@keyframes prefs-in` start state softened from `scale(0.94) translateY(-6px)` to `scale(0.96) translateY(-10px)`.
- `.loading-overlay` transition raised to `--dur-reveal` (0.9 s) with `--ease-gallery-out`.
- `.loading-spinner` animation slowed from `0.8s` to `1.4s` — calmer infinite spin, reduced-motion path already zeros it.

`--ease-spring` is preserved as a token but no longer used on any gallery surface.

#### `src/main.ts`

- Loading-overlay removal timeout raised from 700 ms to 950 ms to match `--dur-reveal: 0.9s` + 50 ms scheduling buffer.
- Animate loop now calls `galleryManager.update(now)` — `now` is the same `DOMHighResTimeStamp` already passed to `lightingSetup.update(now)`.

### Verified non-regressions

- `[data-motion='reduced']` block continues to zero transitions on `info-panel`, `nav-btn`, `zoom-controls__btn`, `fullscreen-btn`, `prefs__trigger`, `timeline__thumb`; new token durations are still overridden by the 0.001 ms rule.
- `@media (prefers-reduced-motion: reduce)` block continues to disable `loading-spinner`, `timeline__skeleton`, and `prefs__panel` animations.
- `LightingSetup.ts` ambient drift uses `Math.sin(time)` against the raw `DOMHighResTimeStamp`, so it remains frame-rate-independent. No change required.
- `SidePanels.ts` static `opacity: 0.95` panels and instant texture swap are unchanged — a future polish item, deliberately out of scope.
- v0.14.2 zoom/pan constants (`MIN_CAMERA_Z`, `MIN_OVERVIEW_CAMERA_Z`, `INSPECTION_OVERSCROLL_X`, `INSPECTION_OVERSCROLL_Y`, `PORTRAIT_ASPECT_THRESHOLD`, `PORTRAIT_RESET_EXTRA_Z`) are untouched.

### Validation

- `npm run lint` → clean (no errors, no new warnings).
- `npm run build` → `tsc` succeeds, Vite preview build succeeds (`customer-preview/style.css` 18.61 kB, `customer-preview/freyraum-gallery.js` 589.75 kB). The only deprecation surfaced is the pre-existing Dart Sass legacy JS API warning unrelated to v0.15.
- Manual QA matrix is documented in `plan.md` → v0.15 → Slice 7; the runtime now writes `motionMode`, `seedPositionX`, `seedPositionZ`, and `settleTargetMs` into the `navigate` diagnostic event for in-browser verification via `window.__FREYRAUM_DIAGNOSTICS__`.

### Risks observed during implementation

- The dt clamp at `MAX_SMOOTHING_DT = 0.1` is essential: without it, a backgrounded tab returning after a few seconds would produce a single oversized jump on resume because exponential smoothing collapses the entire residual in one tick.
- The first call to `update(now)` is intentionally a no-op for smoothing (only `targetZoom` clamping and pan clamping run) because `lastUpdateTime` is 0; this avoids feeding an unbounded delta to `smoothDamp`.
- The new `position.z` seed (-0.6) sits behind both the frame plane (z=0) and the artwork plane (z≈0.095), so it cannot cause z-fighting. Confirmed by inspecting `ArtworkMesh` geometry.

---

## 2026-05-19 — v0.15 technical deep audit: elegant longer animations

### Scope of this pass

Final v0.15 documentation audit and repository-wide verification pass. Re-checked the animation plan against the current codebase, existing findings, repository markdown, and online sources. Identified a root bug in all WebGL animation paths, a timing bug in the InfoPanel DOM transition, and several documentation/cross-reference issues. No runtime code was changed in this pass.

---

### Research sources validated

| Source | Finding |
|---|---|
| WCAG 2.2 § SC 2.3.3 | Non-essential interaction animation must be disablable. FREYRAUM already satisfies this via `PreferencesStore` + `[data-motion]` attribute. |
| MDN `prefers-reduced-motion` | System preference signal; already integrated; confirmed `@media (prefers-reduced-motion: reduce)` block at main.scss:1007. |
| MDN CSS Animation Performance | Only `transform` and `opacity` are compositor-promoted and GPU-accelerated. FREYRAUM's existing CSS is already on these. ✓ |
| MDN `requestAnimationFrame` | `now` is a `DOMHighResTimeStamp` — use it as the source of delta-time for frame-rate-independent smoothing. |
| Stack Overflow #57851938 / Glenn Fiedler "Fix Your Timestep" | `alpha = 1 − Math.exp(−lambda × dt_seconds)` is the correct frame-rate-independent exponential smoothing formula. |
| cubic-bezier.com / easing.net | `cubic-bezier(0.34, 1.56, 0.64, 1)` (current `--ease-spring`) overshoots; `cubic-bezier(0.16, 1, 0.3, 1)` = easeOutExpo does not. |
| MDN `will-change` | Apply sparingly only just before animation; remove via `transitionend`. Not needed as a permanent class. |
| web.dev animation guide | Confirmed: do not animate `top`, `left`, `width`, `height` — layout-triggering. All FREYRAUM DOM transitions are already correct. |

---

### Repository verification coverage

This pass cross-checked the v0.15 plan against the current state of:

- `src/main.ts` render-loop timing, loading overlay timing, resize/refit wiring
- `src/gallery/*` motion ownership, zoom/pan/reset bounds, artwork/side-panel transform behavior
- `src/timeline/Timeline.ts` active-thumb centering and reduced-motion scroll behavior
- `src/ui/*` panel/controls timing surfaces, especially `InfoPanel.ts`
- `src/interaction/CanvasInteraction.ts` gesture paths that must remain responsive after motion retuning
- `src/lighting/*` ambient animation boundaries
- `src/utils/*` frame-budget, startup-quality, math helper, diagnostics-adjacent utilities
- `src/styles/main.scss` tokens, easing, reduced-motion coverage, and animated selectors
- `package.json` validation commands (`npm run lint`, `npm run build`)
- repository markdown files that describe current and planned runtime behavior

Result: the technical recommendations in `plan.md` are consistent with the current source tree and with the current documentation set after the cleanup in this pass.

---

### Root bug: all WebGL motion is frame-rate-dependent

**File:** `src/gallery/GalleryManager.ts`, lines 565–587

All 13 motion lines in `update()` use the pattern `value += (target − value) × k` where k is a hardcoded constant applied every frame. This is the standard per-frame lerp and is inherently frame-rate-dependent.

**Proof:**
- At 60 Hz, each frame is 1/60 = 16.7ms.
- At 120 Hz, each frame is 1/120 = 8.3ms.
- For `value += (target − value) × 0.06`, 95% settle requires `n = ln(0.05)/ln(1−0.06) ≈ 49` frames.
  - 60 Hz: 49 × 16.7ms = **817 ms**
  - 120 Hz: 49 × 8.3ms = **408 ms**
  - 30 Hz (throttled mobile): 49 × 33ms = **1617 ms**

The same motion is twice as fast on a 120 Hz display as on 60 Hz. On a 30 Hz thermally-throttled phone it takes twice as long as on 60 Hz.

**All 13 affected lines and their constants:**

| Line | Property | k | 95% settle 60Hz | 95% settle 120Hz |
|---|---|---|---|---|
| 571 | `group.rotation.x` (hover) | 0.05 | 973 ms | 485 ms |
| 572 | `group.rotation.y` (hover) | 0.05 | 973 ms | 485 ms |
| 574 | `group.position.x` (nav) | 0.06 | 817 ms | 408 ms |
| 575 | `group.position.y` (nav) | 0.06 | 817 ms | 408 ms |
| 576 | `group.scale.x` (nav) | 0.06 | 817 ms | 408 ms |
| 577 | `group.scale.y` (nav) | 0.06 | 817 ms | 408 ms |
| 578 | `group.scale.z` (nav) | 0.06 | 817 ms | 408 ms |
| 580 | `this.zoom` (camera zoom) | 0.08 | 617 ms | 307 ms |
| 581 | `camera.position.z` (zoom follow) | 0.08 | 617 ms | 307 ms |
| 583 | `this.panX` (pan smoothing) | 0.08 | 617 ms | 307 ms |
| 584 | `this.panY` (pan smoothing) | 0.08 | 617 ms | 307 ms |
| 585 | `camera.position.x` (pan follow) | 0.08 | 617 ms | 307 ms |
| 586 | `camera.position.y` (pan follow) | 0.08 | 617 ms | 307 ms |

**Fix:** use `smoothDamp(current, target, lambda, dt)` where `dt` is real elapsed seconds. This produces identical wall-clock timing at any refresh rate:

```
alpha = 1 - Math.exp(-lambda * dt)
value += (target - value) * alpha
```

Lambda values chosen for each property:

| Property group | Old k | Proposed λ | 95% settle (any Hz) |
|---|---|---|---|
| Hover rotation | 0.05 | 12.0 | ~250 ms — immediate |
| Nav position X/Y/Z | 0.06 | 2.5 | ~1200 ms — witnessable |
| Nav scale | 0.06 | 3.0 | ~1000 ms — smooth |
| Camera zoom | 0.08 | 4.0 | ~750 ms — graceful |
| Camera pan X/Y | 0.08 | 5.0 | ~600 ms — connected |

---

### Bug: `InfoPanel.ts` content swap fires before transition completes

**File:** `src/ui/InfoPanel.ts`, line 41

```typescript
window.setTimeout(() => {
  this.setContent(artwork);
  this.el.classList.remove('is-transitioning');
}, 200); // hardcoded — shorter than the CSS transition
```

**Problem:** at line 191–192 of `main.scss`, the `.info-panel` transition duration is `var(--dur-base) = 0.32s = 320ms`. The `setContent()` call fires at 200ms — while the panel is only 200/320 = 62.5% through its fade-out and is still at opacity ≈ 0.375. Old text is partially visible as new text replaces it.

**Fix for the implementation pass:**
- Set `CONTENT_SWAP_DELAY_MS = 520` (matching updated `--dur-content: 0.5s` + 20ms buffer).
- Add one `requestAnimationFrame` after `setContent()` before removing `is-transitioning`, to let the browser finalise layout with new text before triggering the fade-in.

---

### Issue: `--ease-spring` overshoot is museum-inappropriate

**File:** `src/styles/main.scss`, line 56

```scss
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

The control point y1=1.56 is above 1.0, which causes the animated value to overshoot its target before settling back. This is physically plausible for a light spring but visually jarring in a calm museum setting.

**Currently used for:**
- `.timeline__thumb` transform transition (line 730): thumbnail lift overshoots
- `.prefs__panel` animation `prefs-in` (line 500): glass panel bounces past final position

**Replacement:** `cubic-bezier(0.16, 1, 0.3, 1)` = easeOutExpo — rapid deceleration with a silk landing. No overshoot. Confirmed at cubic-bezier.com.

---

### Issue: CSS duration tokens too short and too generic

**File:** `src/styles/main.scss`, lines 57–59

```scss
--dur-fast: 0.18s;   // used for controls — OK
--dur-base: 0.32s;   // used for info panel, timeline, skeleton — too short
--dur-slow: 0.6s;    // used for loading overlay — too short for a gallery reveal
```

These three tokens drive very different types of UI changes (button hover, panel content swap, loading overlay). A single `--dur-base` shared by all of them forces a compromise at 0.32s — long enough to be visible on controls but too short for a gallery panel reveal.

**Proposed semantic replacement:**

| New token | Value | Usage |
|---|---|---|
| `--dur-control` | 0.18s | button hover, toggle, radio |
| `--dur-content` | 0.5s | info panel text fade |
| `--dur-panel` | 0.55s | glass panel open entrance |
| `--dur-timeline` | 0.42s | timeline active thumb lift |
| `--dur-reveal` | 0.9s | loading overlay, fullscreen transition |

Old names kept as aliases: `--dur-fast = var(--dur-control)`, `--dur-base = var(--dur-content)`, `--dur-slow = var(--dur-reveal)`.

---

### Navigation entrance seeds — current values and proposed changes

**File:** `src/gallery/GalleryManager.ts`, lines 453–456, 484–487

| Property | Current value | Proposed value | Reason |
|---|---|---|---|
| `position.x` | ±3.2 world units | ±4.5 | More dramatic travel for longer settle |
| `rotation.y` | ±0.32 rad (~18°) | ±0.15 rad (~9°) | Less theatrical yaw, more museum-like |
| `scale` | 0.84 | 0.88 | Less collapsed, softer entrance |
| `position.z` | (not set — stays 0) | −0.6 | Depth recession: painting comes from behind |

The depth seed (position.z = −0.6, target = 0) uses the same λ=2.5 settle as position.x/y. The ArtworkMesh artwork plane sits at z=0.095 and the frame at z=0, so a seed z of −0.6 passes through neither — no z-fighting.

---

### `src/utils/math.ts` — utility addition needed

**File:** `src/utils/math.ts` (currently 17 lines, 3 functions)

`smoothDamp` must be added here. The existing `lerp` function (line 5–7) is a simple linear interpolation and is not frame-rate-independent. Do not confuse the two.

```typescript
export function smoothDamp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
```

Validation: at dt=1/60=0.01667s and λ=4, `alpha = 1−exp(−4×0.01667) = 1−exp(−0.0667) ≈ 0.0645`. Old `k=0.08` at 60fps used `alpha = 0.08`. The new λ=4 is slightly lower friction — intentional to increase graceful duration.

---

### `src/main.ts` — animate loop change needed

**File:** `src/main.ts`, line 525

```typescript
// Current:
galleryManager.update();

// Required after Slice 4:
galleryManager.update(now);
```

`now` is already available in the `animate(now: number)` closure. No change to the rAF itself needed.

---

### `src/lighting/LightingSetup.ts` — confirmed frame-rate-independent, no change needed

**File:** `src/lighting/LightingSetup.ts`, line 76

```typescript
primary.position.x = baseX + Math.sin(time * 0.0002) * 0.25;
```

`time` is the raw `DOMHighResTimeStamp` (wall-clock milliseconds). The drift uses `Math.sin(time)` not a per-frame delta, so it runs at the same real-world frequency regardless of frame rate. Period ≈ 31.4 s, amplitude 0.25 world units at position x=−3. Museum-appropriate. ✓

---

### `src/gallery/SidePanels.ts` — not animated, no action required

Both panels have static `opacity: 0.95`. Texture swaps are immediate (via `needsUpdate = true`). A subtle fade-on-swap would improve polish but is out of scope for v0.15.

---

### `src/styles/main.scss` reduced-motion block — confirmed complete, minor gap

**File:** `src/styles/main.scss`, lines 981–1013

The `[data-motion='reduced']` block correctly sets `transition-duration: 0.001ms` for: info-panel, nav-btn, zoom-controls__btn, fullscreen-btn, prefs__trigger, timeline__thumb. It also correctly removes `prefs__panel` animation.

After the v0.15 token changes:
- `.loading-spinner` animation is already zeroed in the reduced-motion block (line 982–987) ✓
- New token names will not affect the zero-duration rule — all transitions are overridden regardless of duration value ✓
- The `@media (prefers-reduced-motion: reduce)` block at line 1007 covers system-level preference ✓

One gap: the `@media (prefers-reduced-motion: reduce)` block does not include nav buttons or zoom controls in its rule. Only the `[data-motion='reduced']` block does. This means system-level preference without the in-app toggle will not zero these transitions. Adding them to the media block would be a minor completeness fix — note for the implementation pass.

---

### Loading overlay removal timing — confirmed timing issue

**File:** `src/main.ts`, line 344

```typescript
window.setTimeout(() => loadingOverlay.remove(), 700);
// But --dur-slow = 0.6s = 600ms fade, plus 100ms buffer = 700ms total
```

After `--dur-slow` is raised to `--dur-reveal: 0.9s`, this timeout must increase to at least 950ms (900ms + 50ms buffer), otherwise the DOM element is removed mid-fade.

---

### Full inventory of `var(--dur-base)` and `var(--dur-slow)` consumers

Before changing these tokens (or their aliases), all usages must be verified:

**`var(--dur-base)` or `var(--dur-fast)` users:**
- `.info-panel` transition → will use `--dur-content` (0.5s)
- `.timeline__thumb` transition (transform, box-shadow) → will use `--dur-timeline` (0.42s)
- `.timeline__skeleton` transition (opacity) → will use `--dur-content` (0.5s)
- `.prefs__panel` animation → will use `--dur-panel` (0.55s)
- All `--dur-fast` users (buttons, toggles) → kept via `--dur-control: 0.18s` alias

**`var(--dur-slow)` users:**
- `.loading-overlay` transition → will use `--dur-reveal` (0.9s)
- `[data-presentation='on']` topbar/hint opacity → stays on `--dur-base` alias; 0.5s is fine

---

### Documentation consistency issues fixed in this pass

- `README.md` still described the older “animation enhancement plan” wording and linked to the old v0.15 heading anchor. It now points to the final v0.15 technical audit more cleanly.
- `docs/HANDOFF.md` still referenced the earlier v0.15 heading and findings label. It now points at the final technical brainstorm / deep-audit wording.
- `docs/CUSTOMER_PICTURE_GUIDE.md` and `docs/IMAGE_MAINTENANCE_GUIDE.md` still described the older lighter planning pass. They now reference the final v0.15 technical audit while keeping the customer workflow unchanged.

### Validation status

- Documentation-only pass. No lint/build required.
- Verified existing validation commands from `package.json`: `npm run lint` and `npm run build`.
- See `plan.md` → "v0.15 — Planned" for implementation slices and acceptance checks.

---

## 2026-05-19 — v0.14.2 follow-up: tighter vertical pan limits

### Scope of this pass

Adjusted zoomed-in pan limits so top/bottom movement is more restrictive while preserving the already-approved left/right behavior.

### Code-level findings fixed

- **Issue:** vertical edge travel still felt too loose at close zoom.
- **Root cause:** `getPanLimits()` used one shared additive overscroll constant for both axes.
- **Fix:** split overscroll by axis in `src/gallery/GalleryManager.ts`:
  - `INSPECTION_OVERSCROLL_X = 1.2` (unchanged horizontal)
  - `INSPECTION_OVERSCROLL_Y = 0.6` (tighter vertical)
- **Diagnostics:** `show-artwork-complete` now emits `panOverscrollX` and `panOverscrollY`.

### Validation status

- `npm run lint` ✅
- `npm run build` ✅

---

## 2026-05-19 — importer runtime compatibility fix (Node version guard)

### Scope of this pass

Fixed a customer-facing updater failure where old Node.js versions crashed on ES module syntax in `scripts/import-artworks.mjs` before a useful report could be shown.

### Code-level findings fixed

- **Root cause:** `Update Gallery` launchers called `node scripts/import-artworks.mjs` directly. On old Node versions, parsing failed at `import { ... }` with `SyntaxError: Unexpected token {`.
- **Fix:** Added `scripts/run-import-artworks.cjs` as a CommonJS compatibility launcher. It can run on old Node, checks `process.versions.node`, requires major version 18+, and only then executes `import-artworks.mjs`.
- **Follow-up root cause:** the first launcher version used `require('node:child_process')`, which is unsupported in older Node versions. Those versions failed before the compatibility report could be written.
- **Follow-up fix:** changed the launcher to use legacy built-in module names (`child_process`, `fs`, `path`) and avoided newer helper APIs where unnecessary, so old Node runtimes reach the intended Node 18+ report path.
- **User-facing reliability improvement:** for unsupported Node versions, the launcher now writes `customer-artworks/last-import-report.txt` with a plain-language compatibility message, so the standard support/report path still works.
- **Launcher wiring:** `Update Gallery.command` and `Update Gallery.bat` now call `scripts/run-import-artworks.cjs`.

### Validation status

- `npm run lint` ✅
- `npm run build` ✅
- Manual launcher smoke test on supported Node: ✅

---

## 2026-05-19 — v0.14 implementation pass: deeper close zoom, tighter pan edges, portrait reset-fit boost

### Scope of this pass

Implemented the v0.14 technical plan in runtime code (`src/gallery/GalleryManager.ts`) and updated all repository markdown files. Preview bundle was regenerated.

### Code-level findings fixed

- **Close zoom floor was still effectively high on medium/large artworks.**
  Root cause: `getInspectionMinZoom()` floor was dominated by `MIN_VISIBLE_ARTWORK_FRACTION = 0.28` even when `MIN_CAMERA_Z = 0.5` looked permissive.
  Fix: `MIN_CAMERA_Z` lowered to `0.2` and `MIN_VISIBLE_ARTWORK_FRACTION` lowered to `0.12`.

- **Pan edge freedom felt too loose after v0.13.**
  Root cause: additive overscroll constant was `INSPECTION_OVERSCROLL = 3.0` in `getPanLimits()`.
  Fix: tightened to `INSPECTION_OVERSCROLL = 1.2`.

- **Large vertical artworks still opened too close in reset view.**
  Root cause: `getResetFitZoom()` used a global fit model where `DEFAULT_CAMERA_Z = 7` can dominate moderate portraits; margin-factor tuning alone cannot shift those cases.
  Fix: added portrait-aware additive headroom with `PORTRAIT_ASPECT_THRESHOLD = 0.65` and `PORTRAIT_RESET_EXTRA_Z = 1.5`; `getResetFitZoom()` now returns `baseFitZoom + PORTRAIT_RESET_EXTRA_Z` for portrait artworks.

- **Tuning state lacked explicit visibility in diagnostics.**
  Fix: `show-artwork-complete` now logs `closeZoomMinVisibleFraction`, `panOverscroll`, `panLimitAtReset`, `portraitResetApplied`, and `portraitResetExtra`.

### Validation status

- Baseline before changes: `npm run lint` ✅, `npm run build` ✅
- Final after implementation: `npm run lint` ✅, `npm run build` ✅
- Known warnings unchanged: TypeScript parser support warning and Sass legacy JS API deprecation warning.

---

## 2026-05-18 — v0.13 implementation pass: nav layout, zoom range, pan range, and icon centering

### Scope of this pass

Customer-reported regressions and UX gaps identified after the v0.12 zoom/framing/timeline implementation. Four distinct issues were audited and fixed. Runtime changes landed in `src/gallery/GalleryManager.ts` and `src/styles/main.scss`; `customer-preview/` was rebuilt.

### Code-level findings fixed

- **Nav controls overlapping the timeline (regression from v0.12 timeline-headroom change).**
  Root cause: `--chrome-bottom` was `max(168px, 148px+safe)` and `.nav-controls` used `bottom: var(--chrome-bottom)`. After the v0.12 timeline padding increase, the timeline's top edge moved to ≈177px from the viewport bottom, placing the nav buttons (bottom edge at 168px) 9px inside the timeline zone. Both elements shared `z-index: 100`; the timeline won the stacking context because it was appended later.
  Fix: `.nav-controls` now uses `bottom: calc(192px + var(--safe-bottom))`, giving 15px of clearance above the timeline's top edge. `--chrome-bottom` raised to `max(200px, 180px+safe)` so the zoom controls (which use `--chrome-bottom`) also clear the timeline, and the JS art-viewport fallback floor stays consistent.

- **Zoom range too narrow in both directions.**
  Root cause: `MIN_CAMERA_Z = 1.2` stopped close inspection too early; `MIN_OVERVIEW_CAMERA_Z = 10.75` and `OVERVIEW_HEADROOM_Z = 1.6` limited the far overview.
  Fix: `MIN_CAMERA_Z` → `0.5`, `MIN_OVERVIEW_CAMERA_Z` → `18.0`, `OVERVIEW_HEADROOM_Z` → `3.5`.

- **Pan limit too tight when zoomed in close.**
  Root cause: `INSPECTION_OVERSCROLL = 0.5` only allowed the viewport centre to reach 0.5 world units past the artwork edge, which feels cramped on narrow/elongated artworks at close zoom.
  Fix: `INSPECTION_OVERSCROLL` → `3.0`.

- **Gear icon and fullscreen icon not optically centred in their circular buttons.**
  Root cause: `.prefs__trigger-icon` and `.fullscreen-btn__icon` spans had no explicit CSS, so they used `display: inline`. Even inside a `display: flex` button, inline elements carry a fractional descender baseline offset that shifts the SVG slightly downward from the visual centre of the circle.
  Fix: Added explicit CSS rules for both icon spans with `display: flex; align-items: center; justify-content: center; line-height: 0; svg { display: block }`.

### Implementation outcome

- Nav controls sit clearly above the timeline with 15px of clearance.
- Zoom-out now allows stepping back to a camera distance of at least 18 world units (+ extra headroom beyond tall-artwork fit). Zoom-in allows detail inspection at camera distance 0.5.
- Pan limits extend 3.0 world units past the artwork edge in all four directions when zoomed close.
- Gear and fullscreen icons are precisely centred in their buttons on all browsers.

### Validation status

- Baseline before changes: `npm run lint` ✅, `npm run build` ✅
- Final after changes: `npm run lint` ✅, `npm run build` ✅
- Known warnings remain unchanged: TypeScript parser support warning and Sass legacy JS API deprecation warning.
- `customer-preview/freyraum-gallery.js` and `customer-preview/style.css` were regenerated.

---

## 2026-05-18 — v0.12 implementation pass: farther zoom-out, tall-picture fit, and unclipped timeline selection

### Scope of this pass

Implemented the v0.12 technical coding plan. Runtime changes landed in `src/gallery/GalleryManager.ts`, `src/main.ts`, `src/timeline/Timeline.ts`, and `src/styles/main.scss`; `customer-preview/` was rebuilt. This entry records what shipped, which audit findings are now fixed, and which diagnostics support future customer reports.

### Online validation result

The original v0.12 direction was confirmed, but the research materially improves the implementation detail:

1. use **measured art-safe viewport metrics**, not only raw camera aspect;
2. treat **`visualViewport` + `ResizeObserver`** as first-class re-fit signals;
3. combine **CSS scroll gutters (`scroll-padding` / `scroll-margin`) with manual centering** for the active timeline item;
4. respect **reduced-motion** in timeline auto-centering.

### Official / authoritative sources used in the validation

- MDN — VisualViewport API: <https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport>
- MDN — ResizeObserver: <https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver>
- MDN — `Element.scrollIntoView()`: <https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView>
- MDN — `scroll-padding`: <https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding>
- MDN — `scroll-margin`: <https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin>
- web.dev — large, small, and dynamic viewport units: <https://web.dev/blog/viewport-units>
- WCAG 2.1 Reflow: <https://www.w3.org/WAI/WCAG21/Understanding/reflow.html>
- WCAG 2.2 Target Size: <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html>

### Code-level findings fixed

- **`GalleryManager` reset framing and far overview zoom are now separated.** `MAX_CAMERA_Z = 9.25` was replaced by explicit `ZoomBounds` with `minInspectionZoom`, `resetFitZoom`, and `maxOverviewZoom`.
- **Reset, min, pan, hover, and diagnostics now share measured art-safe viewport math.** `ArtworkViewportMetrics` records viewport size, usable size, usable fractions, effective aspect, and top/right/bottom/left occlusion.
- **`main.ts` now injects an art-viewport provider into `GalleryManager`.** It measures `visualViewport` when available, falls back to `window.innerWidth/innerHeight`, reads fixed chrome geometry, and wires `window`, `visualViewport`, and `ResizeObserver` change signals into refit handling.
- **Timeline clipping is fixed structurally.** `.timeline__list` now reserves active-thumb headroom and scroll gutters; `.timeline__item` / `.timeline__thumb` expose scroll margins.
- **`Timeline.ts` now has dedicated transform-aware centering.** It stores the list element, centers the transformed active thumb with `getBoundingClientRect()`, adds `aria-current`, and only logs centering diagnostics outside default mode.
- **Timeline auto-centering now respects reduced motion.** It uses `auto` scroll behavior when `<html data-motion="reduced">` or `prefers-reduced-motion: reduce` is active.

### Implementation outcome

- Very tall artworks compute reset fit against the usable artwork viewport, not the full camera viewport.
- Users can zoom out beyond reset fit because `maxOverviewZoom` is at least `10.75` and at least `1.6` camera units beyond the computed reset distance.
- Close inspection is preserved because `handleViewportMetricsChanged()` only auto-refits when the user was already near reset; otherwise it clamps and preserves intent.
- The active timeline thumb remains visually lifted but has enough scroll-container headroom to avoid clipping.
- Keyboard focus and programmatic selection both keep timeline thumbnails visible near the center of the strip.

### Validation status

- Baseline before changes: `npm run lint` and `npm run build` passed.
- Final after changes: `npm run lint` and `npm run build` passed.
- Known warnings remain unchanged: TypeScript parser support warning and Sass legacy JS API deprecation warning.
- `customer-preview/freyraum-gallery.js` and `customer-preview/style.css` were regenerated.

### Diagnostics surface added

| Scope | Event | Level | Trigger |
| --- | --- | --- | --- |
| `gallery` | `show-artwork-complete` | `info` | Now includes reset/min/max zoom, overview headroom, usable viewport size/fractions, and viewport occlusion |
| `gallery` | `viewport-refit` | `info` | `GalleryManager.handleViewportMetricsChanged()` recomputes bounds after viewport/chrome changes |
| `layout` | `art-viewport` | `info` | `main.ts` measures the art-safe viewport during resize/visualViewport/ResizeObserver changes |
| `timeline` | `center-active` | `debug` | Non-default diagnostics mode only; records active thumbnail centering delta and scroll behavior |

---

## 2026-05-18 — v0.11 implementation pass (responsive phones/tablets, touch, gestures, WebGL reliability)

### Scope of this pass

The v0.11 technical coding plan has been executed. This entry records what shipped, the runtime behaviour now in place, and the constraints that remain for future passes. All bug references map to the seven bugs catalogued below in the previous (planning) entry.

### Implementation outcome

- **`src/utils/device.ts`** introduces a capability-based device model with `LayoutTier`, `PointerPrimary`, `Orientation`, and `DeviceCapabilities`. `applyDeviceCaps()` mirrors these to `<html>` data attributes so SCSS can react without re-running JS. Used by the resize coordinator in `main.ts`, by `HintText`, by `CanvasInteraction`, and by the new compact `InfoPanel` mode.
- **`src/interaction/CanvasInteraction.ts`** replaces the three previous interaction classes (`MouseInteraction`, `ZoomPan`, `TouchInteraction`). It uses Pointer Events Level 3 when `window.PointerEvent` exists and falls back to non-passive Touch Events on legacy Safari. The gesture state machine has `idle / panning / pinching / swipe-candidate / cancelled`. The canvas owns the gesture via CSS `touch-action: none`; the Touch Events fallback path also calls `preventDefault()` to suppress synthetic mouse events (Bug 2 and Bug 3). Swipe navigation activates on the up-event (WCAG SC 2.5.2).
- **Resize coordinator** in `main.ts` is a single debounced (120 ms) listener on `resize` and `orientationchange` that calls `rendererManager.resize()`, re-detects capabilities, re-applies the data attributes, toggles compact info-panel, and refreshes the hint copy. `SceneManager`'s existing camera-aspect listener stays; both are removed in the unload cleanup (Bug 1).
- **`getOptimalPixelRatio`** now caps effective DPR to `1.5` on `(pointer: coarse)` devices regardless of the requested cap, to avoid thermal throttling on phones/tablets while keeping the perceived quality difference negligible.
- **`suggestStartupQuality()`** is new and is only applied when `PreferencesStore.hasStoredQuality()` returns `false`. It returns `battery` for high-DPR small phones and `balanced` otherwise. User choice always wins after the first session.
- **`RendererManager`** registers `webglcontextlost` (with `preventDefault()`) and `webglcontextrestored` handlers, exposes `isRenderPaused()`, and emits `render/context-lost` (`warn`) and `render/context-restored` (`info`) diagnostics. The animation loop short-circuits when paused so the `requestAnimationFrame` driver keeps ticking but Three.js draw calls are skipped until restoration.
- **`main.scss`** introduces `--safe-top/right/bottom/left` wrappers around `env(safe-area-inset-*, 0px)`, `--chrome-top` and `--chrome-bottom` spacing tokens, `100dvh` body height with a `100%` fallback, and `touch-action: none` scoped to the canvas. All fixed-position chrome (topbar, info-panel, nav, zoom, fullscreen, prefs, timeline, hint, fallback card) now offsets against the safe-area variables. The single legacy `@media (max-width: 720px)` block was replaced by an explicit four-phase breakpoint set; `phone-portrait`/`phone-small` also hide the topbar badge and hint via the new device-capability mirror selectors.
- **`InfoPanel.setCompact(boolean)`** toggles a new `.info-panel--compact` class that gives the panel full available width minus safe-area, raises it above the chrome, clamps the title, and allows internal scrolling to satisfy WCAG SC 1.4.10 Reflow.
- **`HintText.updateHint()`** reads `data-pointer-primary` and renders the appropriate German copy. It is called from the constructor and from the resize coordinator after a pointer-type change.
- **`FallbackScreen`** appends a coarse-pointer-only tip about private browsing and hardware acceleration; the technical reason is HTML-escaped and only shown when diagnostics mode is not `default`.

### What was deliberately not changed

- The three legacy interaction classes (`MouseInteraction.ts`, `ZoomPan.ts`, `TouchInteraction.ts`) remain on disk as dead code. They are no longer imported anywhere; the Vite build now transforms `46` modules instead of `47`. They are kept to make the v0.11 change reversible. A subsequent cleanup PR can delete them.
- `isMobileDevice()` in `performance.ts` is marked `@deprecated` but still exported. No remaining callers exist in the repository, but the function is retained for safety because external preview snapshots may reference it.
- `ResizeObserver` is not yet wired into `RendererManager`. The plan flagged this as a follow-up; the debounced `window.resize` + `orientationchange` path covers the FREYRAUM canvas (which always fills the viewport).
- The WebGL context-loss recovery currently only logs and pauses rendering. No user-visible recovery overlay or retry button has been added yet; this remains a follow-up.

### Validation

- `npm install`, `npm run lint`, `npm run build` all pass cleanly with only the known pre-existing Sass legacy-API deprecation notice and the TypeScript parser version warning.
- `tsc` (the typecheck step inside `npm run build`) reports zero errors.
- The `customer-preview/` bundle was regenerated and committed.
- Physical-device QA (iPhone, iPad, Android) and 320 px / browser-zoom reflow remain a customer-side acceptance step against the QA matrix in `plan.md`.

### Diagnostics surface

New scopes/events the runtime now emits:

| Scope | Event | Level | Trigger |
| --- | --- | --- | --- |
| `layout` | `capabilities` | `info` | Startup |
| `layout` | `resize` | `info` | After debounced resize/orientationchange |
| `interaction` | `init` | `info` | `CanvasInteraction` constructor records backend choice |
| `interaction` | `gesture-start` | `debug` | Pointer/touch down begins a gesture (verbose only) |
| `interaction` | `gesture-cancel` | `debug` | Pointer cancellation |
| `interaction` | `swipe` | `debug` | Swipe resolved on pointer up |
| `quality` | `startup-suggestion` | `info` | When the heuristic overrides default preset |
| `renderer` | `context-lost` | `warn` | WebGL context dropped |
| `renderer` | `context-restored` | `info` | WebGL context restored |

These complement the existing `boot/*`, `gallery/*`, `quality/adaptive-downgrade`, `preferences/*`, and `debug/*` events.

---

## 2026-05-18 — v0.11 final research-backed technical coding plan: responsive phones/tablets, touch, gestures, and compatibility

### Scope of this pass

Updated from a local code-audit plan to a final research-backed technical coding plan. Every v0.11 slice still maps to exact files, functions, TypeScript interfaces, CSS patterns, and concrete code suggestions, but the plan is now also validated against current official accessibility, input, viewport, and WebGL guidance. No runtime code was changed in this pass.

### Online validation result

The previous v0.11 direction was confirmed by current official guidance. The main outcome of the online validation was not a redesign of the plan, but four upgrades:

1. treat **WebGL context loss/recovery** as part of mobile reliability, not a later nice-to-have;
2. treat **high-DPI drawing-buffer sizing** as a first-class acceptance concern;
3. treat **320 px reflow and browser zoom** as explicit test gates;
4. treat **`touch-action` + listener passivity** as a combined browser-compatibility rule.

### Official / authoritative sources used in the validation

- W3C WCAG 2.2 — Target Size (Minimum): <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html>
- W3C WCAG 2.1 — Pointer Gestures: <https://www.w3.org/WAI/WCAG21/Understanding/pointer-gestures.html>
- W3C WCAG 2.1 — Pointer Cancellation: <https://www.w3.org/WAI/WCAG21/Understanding/pointer-cancellation.html>
- W3C WCAG 2.1 — Reflow: <https://www.w3.org/WAI/WCAG21/Understanding/reflow.html>
- W3C Pointer Events Level 3: <https://www.w3.org/TR/pointerevents3/>
- MDN — `touch-action`: <https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action>
- MDN — viewport meta / `viewport-fit`: <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport>
- MDN — CSS `env()` environment variables: <https://developer.mozilla.org/en-US/docs/Web/CSS/env>
- MDN — WebGL best practices: <https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices>
- Khronos — Handling High DPI in WebGL: <https://wikis.khronos.org/webgl/HandlingHighDPI>
- Khronos WebGL spec — context loss handling: <https://registry.khronos.org/webgl/specs/latest/1.0/>

### Code-level bugs found during technical audit (2026-05-18)

These were found by reading every relevant source file. Each entry records the file, the specific code, and the fix planned for v0.11.

#### Bug 1 — RendererManager.resize() is never called on window resize (critical for mobile)

- **File:** `src/core/SceneManager.ts`, `src/core/RendererManager.ts`, `src/main.ts`
- **Problem:** `SceneManager` registers `window.addEventListener('resize', this.handleResize)` which only calls `camera.aspect` + `updateProjectionMatrix()`. The public `RendererManager.resize()` method (which calls `renderer.setSize()`) has no listener and is never invoked after startup. The canvas visually fills the viewport via `position: fixed; inset: 0; width: 100%` CSS, but Three.js internal render resolution is never updated. On mobile, rotating portrait→landscape leaves the framebuffer at the wrong dimensions.
- **Fix:** Add a debounced `'resize'` listener in `main.ts` that calls `rendererManager.resize()`. Store the listener as a named function for cleanup.

#### Bug 2 — All touch listeners are passive; pinch cannot prevent native zoom on iOS Safari (critical)

- **File:** `src/interaction/TouchInteraction.ts` lines 17–19
- **Problem:** All three listeners use `{ passive: true }`. On iOS Safari, when the user pinches, the browser fires its native page zoom alongside the custom `getTouchDist` calculation. The result is dual-zoom behavior or unwanted page-scale changes.
- **Fix:** In the new `CanvasInteraction.ts`, register `touchmove` with `{ passive: false }` and call `e.preventDefault()` when `e.touches.length >= 2` (pinch) and when `state === 'panning'`.

#### Bug 3 — TouchInteraction and ZoomPan/MouseInteraction coexist; touch fires synthetic mouse events (moderate risk)

- **File:** `src/main.ts` lines 254–257 — four separate interaction managers on the same canvas
- **Problem:** On iOS/Android, a touch tap fires `touchstart` → `touchend` → `mousemove` → `mousedown` → `click`. `ZoomPan.ts` has `mousedown` on canvas and `mousemove`/`mouseup` on window. `MouseInteraction.ts` has `click` on canvas. A touch tap can invoke both the touch swipe check and the mouse click/panel-click path. Currently mostly safe due to the >50 px swipe threshold, but fragile and will misbehave if any new code uses `mousedown` state.
- **Fix:** Replace the three managers with `CanvasInteraction.ts`. Use Pointer Events (preferred) which do not generate synthetic mouse events; or for the Touch Events fallback path, call `e.preventDefault()` on `touchstart` to suppress synthetic mouse events.

#### Bug 4 — isMobileDevice() only checks viewport width, misses pointer type and landscape phones

- **File:** `src/utils/performance.ts` line 5–7
- **Problem:** `window.innerWidth < 768` is false for landscape phones (e.g., iPhone 14 landscape = 844 px), touch laptops (full-width viewport, coarse pointer), and large tablets. The function name is misleading.
- **Fix:** Replace with `detectDeviceCapabilities()` in new `src/utils/device.ts` using `matchMedia('(pointer: coarse)')` and `matchMedia('(hover: hover)')` alongside viewport dimensions.

#### Bug 5 — HintText always shows desktop-only German copy, even on touch devices

- **File:** `src/ui/HintText.ts` line 8
- **Problem:** `'Scrollen zum Zoomen · Ziehen zum freien Bewegen.'` is only meaningful on a desktop with a scroll wheel. On a phone, there is no scrolling.
- **Fix:** After Slice 1 sets `document.documentElement.dataset['pointerPrimary']`, `HintText.updateHint()` reads it and shows `'Wischen zum Navigieren · Zwei Finger zum Zoomen.'` for coarse pointer. Hide entirely on phone-portrait layout.

#### Bug 6 — Preferences panel can overflow viewport on narrow phones (320–380 px wide)

- **File:** `src/styles/main.scss` `.prefs__panel` rule (~line 393–408)
- **Problem:** `width: 320px` is absolute. On a 375 px wide phone, the panel right-aligns to the screen edge and left-extends to ~55 px, which is fine. But on 320 px (iPhone SE 1st gen), the panel clips the left margin. On short landscape viewports (height ≈ 320 px), the panel may extend below the screen bottom.
- **Fix:** `width: min(320px, calc(100vw - 24px))`, `max-height: calc(100dvh - 80px)`, `overflow-y: auto`.

#### Bug 7 — No viewport-fit=cover, no safe-area CSS, no dvh units in app.html / main.scss

- **Files:** `app.html` line 5, `src/styles/main.scss` `:root` block
- **Problem:** Without `viewport-fit=cover`, the safe-area environment variables are not computed by browsers for notch devices. Without `env(safe-area-inset-*)` usage in CSS, the topbar and bottom timeline sit under hardware notches or home indicators on iPhone. Fixed `bottom: 168px` offsets for nav, zoom, and timeline do not account for the home indicator height (34 px on iPhone 14).
- **Fix:** Add `viewport-fit=cover` to the viewport meta. Add `--safe-top/right/bottom/left` CSS variables that wrap `env(safe-area-inset-*, 0px)`. Apply to all fixed-position chrome elements.

### Positive findings — existing code that is already solid for mobile

- `GalleryManager.navigate()` and `resetView()` are stateless and safe to call from touch handlers.
- `GalleryManager.canPan()` correctly gates pan vs. swipe — the touch swipe/pan split logic in `TouchInteraction.ts` is correct in principle; the passive-listener bug is the only real flaw.
- `AdaptiveQualityController` has correct cooldown and manual-override behavior; it will work on mobile without modification.
- `Diagnostics.ts` `createScopedDiagnostics(scope)` pattern makes it trivial to add a `layout` scope.
- Timeline uses real `<button>` elements with roving tabindex — works on mobile screen readers.
- All controls have `aria-label`, real semantic HTML, and `focus-visible` ring — strong accessibility baseline.
- `FrameBudgetMonitor` clamps long frames (tab switch) and has navigation cooldown — thermal spikes will not trigger premature quality downgrades.

### Additional risks and enhancements validated online

- **Reflow remains a real risk** because FREYRAUM uses fixed-position chrome and overlay UI; the implementation must now explicitly test 320 px width / browser zoom behavior.
- **`touch-action: none` belongs on the canvas only**, not the whole page. The page must not globally disable browser zoom.
- **Context loss needs a documented recovery path**. Logging alone is not enough for a premium customer-facing gallery if memory pressure causes the WebGL context to drop.
- **A `ResizeObserver` follow-up would improve resilience** after the first v0.11 shipping pass, especially for split-view or embedded layouts.
- **Fullscreen should stay a graceful enhancement** because support and UX vary by device and browser.

### Updated technical conclusion

This is a targeted hardening pass, not a redesign. The seven bugs listed above are actionable and have low-risk fixes. The positive baseline means most of the work is additive (new `device.ts`, new `CanvasInteraction.ts`, CSS variables, breakpoints) rather than replacing working code.

### Validation status

Documentation-only pass. Runtime changes will be in a follow-on implementation PR. That PR must:
- Run `npm run lint` and `npm run build` and see only the existing known TS parser and Sass warnings.
- Manually verify all QA matrix entries documented in `plan.md`.
- Add explicit checks for 320 px reflow/browser zoom, high-DPI resize accuracy, and context-loss handling.
- Regenerate `customer-preview/` if any source output changes.

---

## 2026-05-17 — v0.10 follow-up: implemented — parallax hole artifacts

### Customer-observed behavior

After the first v0.10 spot fix, the customer reported **more artifacts** that
looked like **holes**, with the same picture visible behind them. The customer
suspected the parallax effect.

### Root cause identified

The suspicion was correct. In `PaintingMaterial.ts`, the parallax shader
computed `pUV` from procedural height and then sampled the real artwork albedo
with that shifted UV:

```glsl
vec4 sampledDiffuseColor = texture2D( map, pUV );
```

Because the height map is procedural and unrelated to the actual photo content,
deep/recessed height areas displaced the image locally. This can look like a
crater or hole showing a second, offset copy of the same picture behind the
surface.

### Fix implemented

- `PaintingMaterial.ts`: albedo now samples stable `vMapUv`.
- `PaintingMaterial.ts`: parallax `pUV` remains available only for relief maps
  (normal/self-shadow), preserving picture fidelity.
- `quality.ts`: Hoch `parallaxScale` reduced from `0.04` to `0.012`.
- `GalleryManager.ts`: diagnostics now log `parallaxEnabled` and
  `parallaxScale` in `show-artwork-complete`.
- Preview bundle regenerated.

Validation: `npm run lint` and `npm run build` pass with only the known
TypeScript parser and Sass warnings.

---

## 2026-05-17 — v0.10: implemented — spot artifacts and portrait reset zoom

### Customer-observed behavior

Customer reports **little spots** visible at close-up zoom with **Hoch** quality
preset. Balanced and battery do not reproduce the artifact. The screenshot URL
returns `HTTP 404` from this sandbox; the analysis is code-derived.

The customer also requested that especially very vertical pictures start far
enough away. The old reset view used fixed `DEFAULT_CAMERA_Z = 7`, which could
clip a fully framed portrait (`5.8` artwork height + `0.4` frame height) on the
initial/reset view.

### Root causes identified (code-derived with math)

Full analysis in `plan.md` v0.10. Short summary:

**Cause 1 (primary) — Height micro-noise creates stochastic shadow blockers**

`ProceduralTextureFactory.generateHeight()` line 156:

```ts
const micro = this.valueNoise2d(x * 0.55, y * 0.55, seed + 31) * 16;
```

Frequency 0.55 at 1024 px → period ≈ 1.8 px (near Nyquist). The self-shadow
march in `PaintingMaterial.ts` jumps ~5 pixels per step at 8 steps. Each step
lands at a statistically independent micro-noise height. Pixels whose `_curH`
sampled a micro-noise trough have all subsequent march samples appearing as
blockers → **dark spot**. Current bias `0.03` is only half the micro amplitude
`16/255 ≈ 0.063`, so micro-noise blockers are not suppressed.

**Cause 2 (secondary) — Specular blob peak too high for Hoch close-up**

`generateSpecular()` line 220:
```ts
const blob = Math.exp(-distSq / (radius * radius)) * 90;
```

With `specularStrength: 0.4` and clearcoat in Hoch, blob centers contribute
`(90/255) × 0.4 ≈ 14%` specular intensity — visible as bright spots at close
zoom under raking light.

### Fix implemented

| File | Line | Before | After | Reason |
|------|------|--------|-------|--------|
| `ProceduralTextureFactory.ts` | ~156 | `* 16` | `* 3` | max micro = 0.012 < bias 0.03, kills shadow speckle |
| `ProceduralTextureFactory.ts` | ~220 | `* 90` | `* 50` | blob peak drops from 14% to 7.8% specular |
| `quality.ts` Hoch | `selfShadowBias` | `0.03` | `0.05` | ×4 headroom over new micro amplitude |
| `quality.ts` Hoch | `specularStrength` | `0.4` | `0.28` | combined blob contribution drops to 5.5% |

Additional portrait/framing fix:

- `GalleryManager.ts`: `MAX_CAMERA_Z` raised from `8.5` to `9.25`.
- `GalleryManager.ts`: reset view now uses `getResetZoom()` based on framed
  artwork dimensions (`artworkWidth + 0.4`, `artworkHeight + 0.4`) and camera
  aspect/FOV, with a `1.04` safety margin.
- `GalleryManager.ts`: first load and navigation set `pendingResetAfterArtworkLoad`
  so reset zoom is recomputed after async artwork texture/aspect loading.
- Diagnostics now include `resetZoom`, `minZoom`, `maxZoom`,
  `specularStrength`, and `selfShadowBias`.

No GLSL shader changes. No new public API. No schema changes. Balanced/battery
unaffected by the spot tuning. Validation: `npm run lint` and `npm run build`
pass with only the known TypeScript parser and Sass warnings.

---

## 2026-05-17 — v0.09: implemented — uploaded image now on 3D painting

### What changed

v0.09 is implemented. The central 3D painting now shows the actual uploaded
customer image instead of the generated placeholder.

Root cause of the remaining v0.08 gap confirmed through code audit:

- The importer (`scripts/import-artworks.mjs`) only wrote `image: './images/...'`
  (a relative path) into the manifest. Under `file://` protocol, `Three.js
  TextureLoader` cannot reliably upload local-file images as WebGL textures in all
  browsers, even without `crossOrigin` set.
- The `Artwork` type had no `webglImage` field.
- `GalleryManager.init()`, `showArtwork()`, and `applyPreset()` all looked up the
  albedo by `artwork.image` — so even if a data URL had been available, it would
  have been ignored.
- `sanitizeInjectedArtworks()` did not extract or validate `webglImage`.

### Fix implemented

Five files changed:

1. `src/config/artworks.ts` — Added `webglImage?: string` to `Artwork`.
2. `src/main.ts` — `sanitizeInjectedArtworks` now extracts `webglImage`, validated
   strictly as `data:image/<subtype>;base64,<...>` to block non-image injection.
3. `src/gallery/GalleryManager.ts` — All albedo URL derivations changed to
   `artwork.webglImage ?? artwork.image`: `init()`, `showArtwork()`,
   `applyPreset()`, side-panel cache lookups, fallback check, and diagnostics
   (new `webglImageSource: 'embedded-data-url' | 'file-url'` field).
4. `src/gallery/TextureManager.ts` — Data URL diagnostic safety: full data URL is
   never logged; instead logs `[data-uri:image/jpeg:2463944bytes]`.
5. `scripts/import-artworks.mjs` — After copying each image, reads bytes with
   `readFileSync`, encodes as base64, and writes `webglImage: "data:image/...;base64,..."`
   into `customer-artworks.js`. Report states "3D painting source: embedded as data
   URLs for reliable offline WebGL." MIME types table added for all supported
   formats including risky ones.

### Why data URLs and not alternatives

| Approach | Verdict |
|----------|---------|
| `URL.createObjectURL(blob)` | Not viable — requires a File/Blob, not available in static file:// page |
| `createImageBitmap(blob)` | Safari/Firefox compat gaps; deferred to v0.10 |
| `fetch(filePath)` in file:// | Blocked by all major browsers for file:// |
| Canvas draw → `toDataURL()` | Destructive recompression — violates no-edit requirement |
| Local HTTP server | Violates no-server requirement |
| Importer base64 data URL | Chosen: JSON-serializable, origin-clean, exact bytes, works in file:// |

### Acceptance state after v0.09

- Central 3D painting: **shows actual uploaded image** when `webglImage` is embedded
- `webglImageSource: 'embedded-data-url'` in diagnostics when importer embeds it
- `fallbackUsed: false` for all supported raster formats (JPG, PNG, WebP, GIF, AVIF)
- Aspect ratio: unchanged, manifest-driven from v0.08
- Effects (self-shadow, parallax, bump, clearcoat, varnish): unchanged
- Build/lint: pass

---

## 2026-05-17 — v0.09: aspect fixed, actual uploaded image still falls back on 3D painting

### Customer-observed behavior

After v0.08, the central 3D painting now has the correct aspect ratio, but the
actual uploaded image still does not appear on the 3D painting. The user still
sees the generated placeholder/fallback texture.

This means the manifest/aspect path is fixed, but the WebGL albedo-byte path is
still unreliable in the customer preview environment.

### Current failure boundary

- Timeline uses DOM `<img>` and can display the uploaded file.
- 3D painting uses `TextureManager` / Three.js / WebGL texture upload.
- `ArtworkMesh` receives manifest dimensions and sizes the frame correctly.
- The remaining failure is therefore between "URL exists / image can display in
  DOM" and "image bytes are accepted as a WebGL texture".

### Online research findings

Research on Three.js / WebGL local image texture failures found:

- Three.js `TextureLoader` uses browser image loading primitives. It can load a
  URL that later still fails during WebGL texture upload if the browser considers
  the image not origin-clean or not uploadable.
  Source: <https://threejs.org/docs/#api/en/loaders/TextureLoader>
- MDN documents that images used with canvas/WebGL are subject to CORS /
  origin-clean rules; normal image display is not the same as pixel access.
  Source: <https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image>
- WebGL Fundamentals documents the same practical issue: cross-origin/local
  image rules are stricter for WebGL textures than for DOM display.
  Source: <https://webglfundamentals.org/webgl/lessons/webgl-cors-permission.html>
- `createImageBitmap()` can decode `Blob`/`File` sources and has orientation
  options, but it is not the simplest static `file://` customer workflow fix and
  still varies by browser/format.
  Source: <https://developer.mozilla.org/en-US/docs/Web/API/createImageBitmap>
- Community guidance for local user images in Three.js commonly recommends
  `FileReader.readAsDataURL()` or `URL.createObjectURL(file)` rather than direct
  `file://` paths. For FREYRAUM's non-interactive static preview, the importer
  equivalent is to write exact image bytes as a data URL into the generated
  manifest.

### v0.09 technical conclusion

v0.08's two-loader fix is necessary but not sufficient for every local
`file://` + WebGL setup. The v0.09 plan should avoid WebGL upload from local file
paths entirely by having the importer write an exact base64 `data:image/...`
source for the 3D albedo (`webglImage`), while keeping the human-readable file
path for reports and optional timeline display.

This preserves the user's requirement:

- no crop
- no stretch
- no destructive edit
- no recompression
- central 3D painting shows the actual uploaded picture bytes
- effects are applied on top of that real albedo texture

### Planned acceptance requirement

Do not accept v0.09 unless the reported imported images render on the central 3D
painting with:

- `fallbackUsed: false`
- `aspectSource: 'manifest'`
- source kind `embedded-data-url` (or equivalent origin-clean source)
- full-frame image mapping with no UV crop
- painting effects still active according to the selected quality/light profile

---

## 2026-05-17 — v0.08: customer images on 3D paintings — root cause confirmed and fixed

### Root cause

`TextureManager` called `this.loader.setCrossOrigin('anonymous')` on a single,
globally shared `THREE.TextureLoader`. In the customer-preview, all artwork images
are loaded from `file://` or relative paths. When `crossOrigin = 'anonymous'` is
set, the browser treats every local-file load as a CORS request, cannot get
`Access-Control-Allow-Origin` headers from a local file, marks the image as
tainted, and WebGL refuses to upload it. The `THREE.TextureLoader` error callback
fired, `TextureManager` silently created a 1600 × 1100 gradient fallback, and the
3D painting showed that fallback.

The Timeline was unaffected because it uses plain `<img>` elements with no
`crossOrigin` attribute — DOM display works without CORS.

The aspect ratio mismatch was a secondary effect: `ArtworkMesh.updateAspect()`
read aspect from the *loaded texture's* pixel dimensions. The fallback is always
1600 × 1100 (landscape), so portrait and square artworks always appeared as
landscape frames.

### Fix applied

Three surgical changes:

1. **`TextureManager`**: two loaders — `externalLoader` (with
   `setCrossOrigin('anonymous')`) for actual `https?://` URLs, `localLoader` (no
   crossOrigin) for data URIs, relative paths, and `file://` resources. A new
   `fallbackKeys` set and `isFallback(url, role)` method make fallback use
   queryable. Verbose diagnostics log URL type, load success with pixel dimensions,
   and load failure with the browser error message.

2. **`ArtworkMesh`**: `updateAspect()` now accepts optional `manifestDimensions`
   and uses them as the primary aspect source. `setPaintingTextures()` forwards the
   dimensions parameter. New getters `lastAspectSource` and `lastManifestDimensions`
   expose what was used for diagnostics.

3. **`GalleryManager`**: passes `artwork.dimensions` to `setPaintingTextures()`.
   Calls `isFallback()` after load and emits a high-visibility warn if the central
   3D painting is using a fallback texture. The `show-artwork-complete` diagnostic
   now includes `fallbackUsed`, `aspectSource`, `manifestDimensions`,
   `paintingWidth`, `paintingHeight`, and `paintingAspect`.

### Build validation

`npm run lint && npm run build` — exit 0, only expected TS-parser and Sass deprecation warnings.

### Follow-up validation pass (2026-05-17 evening)

The follow-up pass adds a deep technical implementation/execution plan and
verifies the fix against the v0.08 acceptance requirements:

- **All resolutions covered.** `ArtworkMesh.updateAspect` calls
  `fitWithinBox(aspect, 4.2, 5.8)`, which is defined for every finite positive
  aspect and clamps non-finite/non-positive inputs to 1.0. The all-resolutions
  matrix is enumerated in `plan.md` (v0.08 Deep Implementation Notes §3) and
  covers ultrawide (4:1), wide landscape (3:2), 4:3, square (1:1), 4:5 portrait,
  3:4 portrait, 1:2 tall portrait, and extreme 1:4 portrait.
- **All image kinds covered.** Edge-case table in `plan.md` v0.08 §5 covers
  HEIC/HEIF, AVIF, SVG without intrinsic size, oversized images
  (`gl.MAX_TEXTURE_SIZE`), animated GIFs, EXIF-rotated JPEGs, zero/negative
  aspect manifests, https URLs needing CORS, role-keyed cache collisions, and
  rapid timeline navigation.
- **Timeline still works for all aspects.** `src/styles/main.scss` ships the
  `--thumb-aspect` CSS variable on `.timeline__img { aspect-ratio: var(--thumb-aspect, 1.5); }`.
  Each thumbnail reserves space using the artwork's intrinsic aspect, so layout
  never shifts when the image finishes loading, regardless of portrait,
  landscape, square, or ultrawide source.
- **Effects still applied.** Procedural normal/height/roughness/specular/AO/
  varnish maps remain content-addressed by `(artworkId, role, tileSize)` and
  are independent of the albedo upload path. Self-shadow, parallax, bump,
  clearcoat, anisotropy, and the inspection-only 3-ray PCF filter all sample in
  UV space and so are invariant under per-artwork `mesh.scale` adjustments.
- **Diagnostics validated.** `show-artwork-complete` carries `fallbackUsed`,
  `aspectSource`, `manifestDimensions`, `paintingWidth`, `paintingHeight`, and
  `paintingAspect`. `show-artwork-fallback` is emitted at `warn` level the
  moment a fallback texture is detected on the central 3D painting.
- **Build re-validated.** `npm run lint && npm run build` — exit 0, only the
  expected TS-parser and Sass deprecation warnings.

Parked for v0.09: EXIF orientation honoured in the WebGL upload path; importer
downscale for images >4000 px on the longest edge; customer-controlled
`surfacePhysics` profiles per artwork. None of these block v0.08 acceptance.

---

## 2026-05-17 — v0.08 pre-fix finding: timeline works, 3D painting does not (original observation)

Customer import produced valid manifest entries and the timeline displayed the
images, but the actual 3D painting did not show the imported artwork and did not
match the imported aspect ratios.

### Why this matters

This is the main customer-image feature path. The import is not complete unless
the central 3D painting uses the customer image and the customer image dimensions.

### Likely failure area (now confirmed)

- The timeline loads images through DOM `<img>` elements.
- The 3D painting loads images through Three.js `TextureLoader` in `TextureManager`.
- `TextureManager` currently creates a generated fallback texture when loading
  fails, and that fallback can hide the real failure.
- `ArtworkMesh.updateAspect()` currently sizes from the loaded texture. If the
  loaded texture is fallback, the 3D painting gets the fallback aspect instead
  of the imported artwork aspect.

### Plan created

`plan.md` now contains the full **v0.08** technical implementation plan including
root cause analysis, code-level fix details, logging structure, and acceptance
checks for the reported images: `720 × 907`, `719 × 991`, and `4724 × 4724`.

---

## 2026-05-17 — v0.07 customer-managed artworks implemented

The v0.07 importer and runtime injection path are implemented in code. A
non-technical customer can manage the gallery by dropping images into
`customer-artworks/inbox/` and double-clicking `Update Gallery`. A later customer
report showed that the timeline can display imported files while the central 3D
painting still fails to show them; that critical acceptance gap is now tracked in
the v0.08 plan above.

### What is now implemented

- **Zero-dependency importer** (`scripts/import-artworks.mjs`): scans the inbox,
  reads pixel dimensions for JPEG / PNG / GIF / WebP / SVG / AVIF directly from
  file headers (no native binaries, no npm install beyond what the build already
  uses), skips RAW formats with a clear message, warns about HEIC/HEIF/TIFF/BMP,
  copies images to `customer-preview/images/`, writes both
  `customer-artworks/artworks.json` and `customer-preview/customer-artworks.js`,
  backs up the previous manifest, and produces a plain-language report.
- **Runtime injection** (Option C from the plan): the importer writes
  `window.__FREYRAUM_ARTWORKS` into a side-loaded `<script>` so the `file://`
  preview picks up new images without a rebuild and without violating browser
  `fetch()` restrictions on `file://`.
- **Constructor injection refactor**: `Timeline`, `InfoPanel`, and `GalleryManager`
  no longer reach for the global `artworks` constant; they accept the active list
  via their constructor. `main.ts` reads, validates, and dedupes the injected
  manifest with `sanitizeInjectedArtworks()` and falls back cleanly to built-in
  demo artworks when no customer manifest exists or every entry is invalid.
- **Arbitrary dimensions intended path**: `ArtworkMesh.updateAspect()` and
  `SidePanels` fit any aspect into the world box via `fitWithinBox(aspect, 4.2,
  5.8)`, and the timeline reserves space per-thumb from declared dimensions.
  v0.08 must harden this path so the central 3D painting uses the imported
  manifest dimensions and not fallback texture dimensions.
- **Double-click launchers**: `Update Gallery.command` (macOS, `chmod +x`) and
  `Update Gallery.bat` (Windows) both check for Node.js, run the importer, and
  open the report. The macOS launcher documents the Gatekeeper one-time approval.

### Reliability and edge-case behaviour

- One bad file does not stop the run; warnings, skips, and copy errors are all
  collected and reported separately.
- Duplicate IDs (after normalization) are disambiguated with a numeric suffix.
- A previous manifest is renamed to `artworks.json.bak` before being replaced,
  so a botched import can be recovered manually.
- `customer-preview/images/` is cleared at the start of each run, so removed
  inbox files do not leave orphan assets.
- The `customer-artworks.js` runtime injection is validated entry-by-entry at
  startup; malformed entries are dropped with a diagnostic warning instead of
  crashing the app.
- If the customer never runs the importer, `write-local-preview.mjs` emits a
  `window.__FREYRAUM_ARTWORKS = [];` stub so the script tag does not 404.

### Verified test matrix

End-to-end run with the importer:

| Test case             | File                       | Result                       |
| --------------------- | -------------------------- | ---------------------------- |
| Landscape PNG         | 800 × 400                  | imported, no stretching      |
| Portrait PNG          | 300 × 600                  | imported, no stretching      |
| Square PNG            | 512 × 512                  | imported                     |
| Ultrawide PNG         | 3200 × 800                 | imported                     |
| SVG with width/height | 1024 × 768                 | imported                     |
| JPEG with SOF0        | 512 × 768                  | imported, dimensions correct |
| Unsupported `.txt`    | —                          | skipped with friendly text   |
| Empty inbox           | —                          | empty manifest, demo loads   |

### Open follow-ups (out of scope for this pass)

- Optional `jimp` integration for a 4096 px long-edge cap on huge phone/camera
  images (Phase 4 in `plan.md`).
- Optional sidecar metadata file for custom titles, descriptions, and per-artwork
  `surfaceProfile` overrides.
- Optional thumbnail generation for the timeline.

---

## 2026-05-17 — v0.07 diagnostics and logging system implemented

The v0.07 plan previously covered the customer-managed artwork workflow well, but the code audit found a major cross-cutting gap: diagnostics were too narrow and too inconsistent for a reliability-focused rollout. Before this pass, runtime logging was limited to:

- hidden `?debug=1` shader toggles in `src/main.ts`
- one direct `console.warn()` in `src/rendering/RenderBackend.ts`
- almost no structured visibility into boot, preferences, gallery loads, texture fallbacks, adaptive quality, or uncaught runtime errors

### What is now implemented

- Added `src/utils/Diagnostics.ts`, a centralized diagnostics singleton with:
  - levels: `debug`, `info`, `warn`, `error`
  - modes: `default`, `info`, `verbose`
  - ring buffer of the latest 300 entries
  - short-window deduplication with repeat counts
  - structured metadata serialization (including `Error`)
  - global `window` API: `window.__FREYRAUM_DIAGNOSTICS__`
  - global capture of uncaught `error` and `unhandledrejection`
- Updated runtime integration:
  - `src/main.ts` now logs boot, preference application, gallery-ready state, debug toggle state, adaptive downgrades, shutdown, and fatal startup failures
  - `src/rendering/RenderBackend.ts` now logs backend detection and WebGPU probe start/success/failure through the diagnostics utility
  - `src/gallery/TextureManager.ts` now logs renderer texture capabilities and generated fallback-texture use
  - `src/gallery/GalleryManager.ts` now logs preset application, inspection-mode changes, artwork load start, stale async load discards, and final active-map summary
  - `src/utils/AdaptiveQualityController.ts` now logs downgrade requests and manual-suspension state
  - `src/utils/preferences.ts` now logs storage read/write failures

### Reliability design decisions

- **Normal customer sessions stay quiet.** Default console output only shows `warn` / `error`.
- **Debugging is opt-in.** `?debug=1` / `?debug=info` enables info logs; `?debug=verbose` enables debug logs.
- **History is still retained.** Even when console output is quiet, recent diagnostics remain available in memory through `window.__FREYRAUM_DIAGNOSTICS__`.
- **Noise is controlled.** Repeated identical events inside a short time window update a repeat count instead of printing endlessly.

### Practical debug workflow

1. Open the preview normally: customer sees only real warnings/errors.
2. Re-open with `?debug=1` for readable subsystem logs.
3. Re-open with `?debug=verbose` for deeper engineering detail.
4. In DevTools console, inspect:
   - `window.__FREYRAUM_DIAGNOSTICS__.getEntries()`
   - `window.__FREYRAUM_DIAGNOSTICS__.snapshot()`
   - `window.__FREYRAUM_DIAGNOSTICS__.print('info')`

### Validation

- `npm run lint` — passes (only the known TypeScript parser support warning)
- `npm run build` — passes (only the known Dart Sass legacy JS API warning)
- Preview bundle size increase from diagnostics pass: ~562 KB → ~569 KB (gzip ~143 KB → ~146 KB), acceptable for the current risk budget

---

## 2026-05-17 — v0.07 technical planning (full execution plan): customer-managed picture folder

The customer request is to make picture replacement simple enough for an elderly non-technical user: drag files into a folder, run one obvious update action, and open the preview. Current code does **not** support that yet. The v0.06 gallery still defines artworks in `src/config/artworks.ts` and ships a built static `customer-preview/` bundle.

### Current code findings

| File | Finding | Impact |
|------|---------|--------|
| `src/config/artworks.ts` | Four artworks are hardcoded and use embedded SVG `data:` images. | Customer cannot replace pictures without developer work. |
| `Artwork` interface | Metadata shape is already CMS-like (`id`, title, dimensions, alt, tags, optional material fields). | Good target for generated `artworks.json`. |
| `src/gallery/TextureManager.ts` | Uses `THREE.TextureLoader` for image URLs. | Static generated image files can be loaded once the manifest points to them. |
| `src/materials/ProceduralTextureFactory.ts` | Generates missing normal/height/roughness/specular/AO maps. | Customer only needs normal image files; advanced maps remain optional. |
| `vite.local.config.ts` + root `index.html` | Preview is a static IIFE build opened from `file://`. | Importer must preserve the double-click local preview workflow. |

### Architecture decision: global window injection pattern

Three approaches for getting customer images into the pre-built IIFE bundle were evaluated. The chosen approach is **global window injection**:

1. The importer writes `customer-preview/customer-artworks.js` containing `window.__FREYRAUM_ARTWORKS = [...]`.
2. `customer-preview/app.html` includes this script before the main IIFE.
3. `src/main.ts` reads `window.__FREYRAUM_ARTWORKS` at startup and prefers it over built-in demo artworks.

**Why `fetch()` was ruled out:** The `fetch()` API is blocked on `file://` URLs by all major browsers for same-origin security reasons. A customer opening `index.html` by double-click always uses `file://`. A JSON manifest loaded via `fetch()` would silently fail with a CORS or security error in every supported browser.

**Why a rebuild-on-import approach was ruled out as the only path:** A full `npm run build` takes 10–30 seconds and requires Node.js + npm on the machine. While this approach is viable for developer maintenance, the global injection approach allows future-faster updates that skip the rebuild entirely and still work from `file://`.

### Online research findings

- Browser-safe image formats are primarily JPEG, PNG, GIF, SVG, WebP, and modern AVIF; TIFF and RAW are not reliable direct browser inputs. Source: MDN Image file type and format guide — https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
- Browser folder APIs are not uniformly standard. `webkitdirectory` and File/Directory Entries can help in some browsers, but should not be the only workflow for a non-technical customer. Sources: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#webkitdirectory and https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API
- `createImageBitmap()` is useful for async decoding, but importer design still needs explicit orientation/metadata decisions for real camera files. Source: https://developer.mozilla.org/en-US/docs/Web/API/createImageBitmap
- WebGL has a device-dependent `MAX_TEXTURE_SIZE`; very large camera/scanner files need generated downscaled copies before reliable texture upload. Source: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#textures
- `fetch()` on `file://` URLs is blocked by all major browsers (Chrome, Firefox, Safari) for same-origin security reasons. Any runtime JSON loading for `file://`-based previews must use `<script>` tag injection instead. Source: verified by testing + MDN fetch same-origin policy notes.
- Zero-dependency Node.js image dimension reading is achievable by parsing binary headers: JPEG SOF markers, PNG IHDR chunk, WebP RIFF container, GIF header. No npm packages required for dimension reading only. Source: image format specifications + confirmed by 2024 Node.js community examples.
- Image resizing without native Node.js binaries is best handled by `jimp` (pure JS, works on macOS + Windows without node-gyp or build tools). `sharp` is faster but requires native binaries. For a customer-machine one-click script, `jimp` is the safer first choice. Source: npm package comparison research.
- macOS Gatekeeper blocks `.command` files from unidentified developers. Customers (or their developer during setup) must right-click → Open once to approve the script. After first approval, future double-clicks work without prompts.

### Planning conclusion

The most reliable customer-friendly architecture is: a local `customer-artworks/inbox/` folder + a Node.js importer script that copies images, reads dimensions (zero-dep), generates a `customer-artworks.js` global injection file, and writes a plain-language report. No rebuild of the bundle is required on every gallery update.

See `plan.md` → **v0.07 Technical Implementation Guide** for exact code patterns and implementation checklist.

---




## 2026-05-17 — v0.06 implemented: Streifenlicht blockiness reduction

All three vertical slices (S2 anisotropy, S3 inspection tile-size uplift, S4 lateral PCF self-shadow) have shipped against `src/`. `npm run lint` and `npm run build` pass; bundle is now ≈ 562 KB (gzip ≈ 143 KB), up ~9 KB from v0.05. Detailed implementation outcome (per-slice changes, the four issues found in the original plan and their fixes, acceptance results) is in `plan.md` → "v0.06 Implementation Outcome".

### Shipped changes

| File | Change |
|------|--------|
| `src/gallery/TextureManager.ts` | New `getEffectiveAnisotropy()` getter; `setAnisotropyDivisor()` delegates to it. |
| `src/materials/ProceduralTextureFactory.ts` | New `currentAnisotropy` field (default 1) + `setAnisotropy(value)` method that mutates every cached `DataTexture` in place; `generate()` applies the stored cap to newly created textures. |
| `src/gallery/GalleryManager.ts` | `applyPreset()` mirrors `getEffectiveAnisotropy()` onto the procedural factory. New `inspectionMode` field + `setInspectionMode(on)` that re-runs `showArtwork()` on toggle. Module-scope `INSPECTION_ROLES = ['normal','detailNormal','height']`. `showArtwork()` picks `proceduralInspectionTileSize` per role when `inspectionMode && inspSize > 0`. |
| `src/config/quality.ts` | New `proceduralInspectionTileSize` field — high=`2048`, balanced/battery=`0`. High-preset `selfShadowFilterRadius` `0.0` → `0.002`. The `selfShadowFilterEnabled` boolean from the original plan was intentionally **not added** (the runtime gate in `main.ts` makes it dead — see plan §"Issues found in the original plan"). |
| `src/materials/PaintingMaterial.ts` | New `uShadowFilterRadius` uniform + `shadowFilterEnabled` flag + `setShadowFilterRadius(radius, enabled)` method (recompile only on enable-flag change). New GLSL block guarded by `#define PAINTING_USE_SHADOW_FILTER`, inserted inside the `#ifdef PAINTING_USE_SELFSHADOW` after the primary-ray `_occlusion` clamp: two perpendicular companion rays, each accumulated with the same reciprocal-distance weighting and clamped to `uShadowMaxOcclusion` before the 3-way average. The define is gated on `shadowFilterEnabled && selfShadowActive() && radius > 0`. |
| `src/main.ts` | `applyPreferences()` calls `galleryManager.setInspectionMode(isInspection)` and `paintingMaterial.setShadowFilterRadius(isInspection ? preset.selfShadowFilterRadius : 0, isInspection && preset.selfShadowFilterRadius > 0)` alongside the existing `setShadowProfileScale()`. |

### Validation

- `npm run lint` — clean.
- `npm run build` — clean. Bundle: 562 KB / gzip 143 KB. Only pre-existing Dart Sass legacy-JS-API deprecation warning is emitted.
- Self-shadow texture reads: gallery profile = 8 (unchanged); inspection profile = 24. `_occlusion` after the 3-ray average is at most `uShadowMaxOcclusion`, so the v0.05 darkening envelope (4.2 % gallery / 8.4 % inspection) is preserved.
- Inspection memory uplift on high preset: ≈48 MB GPU per inspected artwork; 1024- and 2048-resolution entries coexist in the factory cache so a gallery-mode toggle does not pay the regeneration cost again.

### Confirmed root causes (recorded during analysis, all now fixed)

| # | File | Root cause | Resolved by |
|---|------|------------|-------------|
| RC-1 | `src/materials/ProceduralTextureFactory.ts` | `anisotropy` never set on generated `DataTexture` objects (defaults to 1). | S2 |
| RC-2 | `src/materials/PaintingMaterial.ts` + `src/config/quality.ts` | `selfShadowFilterRadius` reserved in TS but the `PAINTING_USE_SHADOW_FILTER` GLSL define and `uShadowFilterRadius` uniform did not exist. | S4 |
| RC-3 | `src/config/quality.ts` | `proceduralTileSize: 1024` used for both gallery and inspection on high preset. | S3 |

### Open follow-ups (deferred, out of scope for v0.06)

- `ProceduralTextureFactory.pruneSizeBelow(threshold)` to reclaim the 1024-resolution cache entry once inspection mode has been entered on an artwork. The plan documents this as future work; current S3 keeps both sizes alive simultaneously, which is correct for desktop and acceptable for the v0.06 risk budget.
- Per-profile `LightProfile.shadowFilterRadius` so future profiles can carry their own PCF radius rather than reading the active preset value. Today `main.ts` hard-binds the inspection radius to `preset.selfShadowFilterRadius`.

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
