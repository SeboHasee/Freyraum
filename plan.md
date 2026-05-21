# FREYRAUM Plan
> Last full markdown audit: 2026-05-21 (v0.20.6 audio stabilization + control polish).

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

## v0.20.5 — Complete audio regression recovery plan (planning, 2026-05-21)

### Status

Planning only. The problems below are **not fixed yet**. This section replaces the earlier assumption that v0.20.4 fully solved the audio work.

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
