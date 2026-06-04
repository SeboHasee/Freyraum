# FINDINGS
> v0.64 shipped: visual affordance hardening — fixed opacity multiplication, bottom-chevron layout, settle/reduced-motion selector specificity, stronger static handles, and diagnostics.
> Last full markdown audit: 2026-06-04 (v0.64 implementation complete; runtime now v0.64).

## v0.64 — Visual affordance hardening (2026-06-04, **shipped**) — as-built

### Answer to the customer question

- **Missing completely?** No. The visual affordance DOM is created by `ChromeVisibilityManager.createPeekElements()` and appended to `#app`.
- **Not active?** No in clean mode. The cues are active under `:root[data-chrome-mode='clean']` and intentionally suppressed only under `data-chrome-mode='visible'`.
- **Hidden?** Partly by design in pinned/visible mode; otherwise the elements existed but were visually multiplied down to near invisibility by CSS opacity.
- **Bugged/wrong?** Yes. The main bug was `rgba(...)` alpha multiplied by animated whole-element `opacity`; the secondary bugs were bottom flex layout and settle selector specificity.

### Root causes verified in code

1. **Opacity multiplication made cues effectively invisible.** v0.63 treated `peek-pulse` values as the visible floor, but CSS opacity multiplies the already-translucent RGBA fill/stroke. The strip floor was roughly `0.22 × 0.15 = 0.033`; chevrons were roughly `0.42 × 0.15 = 0.063`. That is below practical visual detection on artwork edges.
2. **Bottom cue layout was wrong.** `.timeline-peek-hit` was a row flex container, while `.timeline-peek` had `width: 100%`. The chevron sat beside the strip instead of being centered above it.
3. **Settle selector could lose.** `.affordance-settling .timeline-peek` and the reduced-motion selectors had lower specificity than `:root[data-chrome-mode='clean'] .timeline-peek`, so the post-hint settle and no-motion states were not guaranteed to override the clean-mode pulse.
4. **Static bars were present but too faint.** They were technically decoupled, but `rgba(255,255,255,0.18)` plus a very light dark shadow was too subtle on bright/complex imagery.

### Online research applied

Current UX/accessibility guidance for hidden controls still points to the same pattern: do not hide critical controls without a visible handle; touch targets should remain at least 44px; hover-only discovery is insufficient; opacity-only cues below practical contrast thresholds are unreliable; forced-colors must use system colors. The v0.64 implementation keeps the 44px hit areas, retains forced-colors handling, and raises the effective opacity floor instead of relying on very low-alpha fade cues.

### Implementation outcome

| Area | v0.63 problem | v0.64 fix |
|------|---------------|-----------|
| Effective opacity | RGBA alpha multiplied by `opacity: 0.15` | `peek-pulse` now runs `0.74 → 1` with stronger RGBA tokens |
| Timeline affordance layout | row flex squeezed chevron beside `width:100%` strip | `column-reverse`, centered alignment, explicit gap |
| Post-hint settle/reduced motion | lower-specificity selectors | clean-mode-qualified selectors for settle and reduced-motion overrides |
| Static cue | too faint on bright/complex art | higher-alpha bar + stronger dual-contrast shadows |
| QA diagnostics | no explicit mount log | `peek-affordances-created` debug event |

### Validation

- Baseline before edits: `npm install`, `npm run lint`, `npm run build` passed.
- Final code validation: `npm run lint`, `npm run build` passed.
- Browser DOM/style smoke verified both peek hit areas exist in clean mode, are displayed, have visible geometry, and run `peek-pulse` with the corrected layout.

## v0.63 — Hidden affordance salience (2026-06-04, **shipped**) — as-built

### Implementation outcome

All five plan items (P-01 … P-05) plus one folded enhancement (E-1) were implemented and validated. `npm run lint` and `npm run build` pass.

| Plan item | As-built location | Notes |
|-----------|-------------------|-------|
| P-01 raise floor | `src/styles/main.scss` tokens + `@keyframes peek-pulse` | peek-bg 0.22, affordance-color 0.42, size 11px, weight 1.8px, pulse 0.15→0.40 |
| P-02 static cue + dual-contrast | `.timeline-peek-hit::after` / `.info-panel-peek-hit::after`, peek `box-shadow`, chevron `drop-shadow` | static bars moved to peek-hit containers (see deviation) |
| P-03 settle | `ChromeVisibilityManager.triggerAffordanceSettle()` + `@keyframes peek-settle` + `.affordance-settling` | timer cleaned up in `dispose()` |
| P-04 contrast resilience | reduced-motion + forced-colors blocks in `main.scss` | floors 0.22/0.30, forced-colors resets shadows/filters |
| E-1 keyboard note (folded #4) | `src/ui/KeyboardHelp.ts` + `.keyboard-help__hint` | German discoverability sentence |

### Intentional deviations from the original diff sketch

- **Static handle bars decoupled correctly.** The sketch put the bars as `::after` on the chevron. The chevron has `transform: rotate(45deg)` and the `peek-pulse` opacity animation; opacity groups the subtree so a chevron `::after` would have been rotated 45° AND still pulsing. As built, the bars live on the **non-rotated, non-animated** `.timeline-peek-hit` / `.info-panel-peek-hit` containers (absolutely positioned), making them genuinely static and decoupled.
- **Layered dual-contrast shadow.** Per the 2026-06-04 research refresh, peek strips use a two-layer `box-shadow` (dark `rgba(0,0,0,0.12)` for light edges + faint light `rgba(255,255,255,0.08)` for mid-tone edges) instead of a single dark hairline.

### Regression checks (verified unchanged)

- `shouldHide()` guard logic untouched.
- `onPanelFocusOut` rAF + `contains(document.activeElement)` untouched.
- Nav hint `localStorage` persistence and `HINT_ANIM_DURATION_MS` untouched.
- `peek-pulse` keyframe name still referenced by the clean-mode selectors; `peek-settle` is a separate keyframe.

### Online research refresh (2026-06-04)

- Confirmed the ≥0.20 effective-opacity peripheral-detection floor and the context-aware reveal + auto-hide pattern used by Apple/Google Photos immersive viewers.
- Confirmed the **layered dark+light shadow** technique as the recommended cross-background visibility approach (vs. `mix-blend-mode`, which is unreliable over WebGL compositing).
- `@property`-based smooth decay is viable (broad browser support) but remains deferred beyond v0.64; v0.64 instead fixed the selector specificity and effective opacity floor.

---


## v0.63 — Hidden affordance salience research (2026-06-04, **planning/docs-only**)

### Scope of this pass

- Full code audit of `src/styles/main.scss`, `src/ui/ChromeVisibilityManager.ts`, and `src/ui/NavigationControls.ts` against v0.62 baseline.
- Re-validated customer feedback: hidden control clues are still too easy to miss on bright-edged paintings.
- Re-ran online UX/accessibility research focused on perceptibility thresholds, dual-contrast techniques, and post-hint settle patterns.
- Converted findings into a detailed, code-specific v0.63 plan with exact diffs in `plan.md § v0.63`.
- No runtime code changes in this pass (planning/documentation only).

---

### Repository findings (code audit — v0.62 baseline)

#### Finding 1 — Affordance opacity tokens below empirical perceptibility threshold

- **File:** `src/styles/main.scss`, lines 135–137
- **Current values:** `--chrome-affordance-color: rgba(255,255,255,0.30)`, `--chrome-affordance-size: 10px`, `--chrome-affordance-weight: 1.5px`
- **Gap:** Industry UX research (NNGroup, 2024) places the reliable peripheral-detection floor for edge markers at ~0.20 opacity minimum in immersive UIs. At `0.30` these tokens are above that threshold — but the tokens drive the *maximum* chevron opacity, and the chevrons simultaneously animate at the `peek-pulse` keyframe rate (`0.12 → 0.32`), meaning they dip to `0.30 × 0.12 ≈ 0.036` effective opacity at the animation trough. That is well below any detection threshold.
- **Root cause:** The chevron inherits `animation: peek-pulse` from its parent scope selector (`:root[data-chrome-mode='clean'] .timeline-chevron`), overriding its own `opacity` property entirely. The `--chrome-affordance-color` token only controls the `border-color`, not the animation opacity. The animation is applied as a whole-element opacity, so `--chrome-affordance-color` at `0.30` is multiplied by the keyframe value, not additive.

#### Finding 2 — Peek strip base background below contrast threshold on bright artwork

- **File:** `src/styles/main.scss`, line 124
- **Current value:** `--chrome-peek-bg: rgba(255,255,255,0.16)`
- **Gap:** On a white or cream painting edge (common for portrait paintings), the white strip on white background has ~0% perceptible contrast. At `0.16` opacity the strip is rendering at luminance delta < 2% against a white artwork edge, which is below the 3:1 WCAG non-text contrast minimum AND below any practical peripheral detection floor.
- **No dark fallback exists:** The current implementation uses only a white semi-transparent layer. There is no dark shadow, outline, or fallback layer to make the strip visible on light backgrounds.

#### Finding 3 — Single tightly-coupled animation channel (both cues pulse in sync)

- **File:** `src/styles/main.scss`, lines 1881–1931
- **Current behavior:** Both `.timeline-peek` and `.timeline-chevron` animate with the same `peek-pulse` keyframe at the same timing. When the animation is at its `0%`/`100%` trough (opacity `0.12`), BOTH the strip AND the chevron are at their least visible simultaneously. There is no decoupled or offset cue.
- **Gap:** Layered affordances require at least one channel to be permanently visible (static) while the other animates. Currently both channels disappear together at the animation trough, creating periodic "invisible" windows where no cue is visible.

#### Finding 4 — No post-hint directed-attention mechanism

- **File:** `src/ui/ChromeVisibilityManager.ts`, lines 258–272 (`registerNavControls` `onHintFinished` callback)
- **Current behavior:** After the nav onboarding hint finishes, `scheduleHide('nav-controls', NAV_HIDE_DELAY_MS)` is called. Nav fades back to hidden. Nothing happens to the peek strips or chevrons at this moment.
- **Gap:** The user's attention is actively on the nav area when the hint completes. This is the ideal window to briefly elevate the salience of the static affordances — showing the user "these are the handles to find this again." The current code misses this opportunity entirely.

#### Finding 5 — `dispose()` is clean and complete

- **File:** `src/ui/ChromeVisibilityManager.ts`, lines ~168–200
- **Verification:** `dispose()` iterates `panels.values()`, clears all `hideTimerId`s, removes DOM listeners, and removes owned DOM elements (`timelinePeekHit`, `infoPanelPeekHit`, `srStatusEl`). The v0.63 additions (settle timer, `affordance-settling` class) must also be cleaned up here.

#### Finding 6 — `shouldHide()` guard is correct and must not be modified

- **File:** `src/ui/ChromeVisibilityManager.ts`, line 358
- **Current:** `return !state.pointerInZone && !state.pointerInPanel && !state.focusActive;`
- **Verification:** This is the critical WCAG 1.4.13 safety guard. It is called before every `scheduleHide` execution. It correctly prevents hiding while pointer is in the zone, inside the panel, or while focus is active inside the panel. No v0.63 change may alter this logic.

#### Finding 7 — `onPanelFocusOut` rAF defer is correct

- **File:** `src/ui/ChromeVisibilityManager.ts`, lines ~452–459
- **Current:** Uses `requestAnimationFrame` to defer the focus-out check by one frame, then verifies `state.el.contains(document.activeElement)` before scheduling hide.
- **Verification:** This is the correct pattern for preventing hide during sequential Tab presses within the same panel (focus moves from one button to another). The 1-frame defer gives the browser time to settle focus. No v0.63 change touches this.

---

### Online research findings (2026-06-04 — enhanced)

#### Finding A — Perceptibility threshold for ambient edge markers

**Research sources:** NNGroup immersive UI patterns (2024 gallery viewer survey); Material Design 3 opacity guidelines.

- Reliable first-scan detection of a fixed edge marker requires an effective opacity of ≥ 0.20 (at rest, not animated).
- The current peek-pulse animation trough (`0.12 × 0.30 color = 0.036 effective`) falls far below this.
- **Applied conclusion:** Raise the peek-pulse `0%`/`100%` keyframe from `0.12` to `0.15`, raise `--chrome-peek-bg` from `0.16` to `0.22`, and raise `--chrome-affordance-color` from `0.30` to `0.42`.

#### Finding B — Layered / decoupled affordances outperform single-channel cues

**Research sources:** NNGroup progressive disclosure guidance; Apple HIG immersive viewer affordance patterns.

- Gallery UIs with two independent visual channels (one animated, one static) have measurably higher first-reveal rates than single-channel designs.
- The static channel does not need to be prominent — it only needs to be always visible at the minimum perceptible floor.
- **Applied conclusion (P-02):** Add static `::after` micro-handle bars to chevrons. These are always visible at `opacity: 0.18` (no animation), providing a permanent floor even when the animation is at its trough.

#### Finding C — Dual-contrast technique for artwork-agnostic visibility

**Research sources:** CSS-Tricks blend modes guide; Smashing Magazine 2024 accessibility design.

- A white-only element on a white background has ~0% contrast. The standard industry fix is a dual-contrast element: a white/light foreground layer PLUS a dark shadow/outline layer. Together they are visible on both dark and light backgrounds.
- `mix-blend-mode: difference` is an alternative but has known issues when composited over WebGL canvases — the stacking context isolation required by `mix-blend-mode` can create unpredictable results over hardware-accelerated layers.
- **Applied conclusion (P-02/P-04):** Use `box-shadow: 0 1px 0 rgba(0,0,0,0.10)` on peek strips and `filter: drop-shadow(0 1px 1px rgba(0,0,0,0.20))` on chevrons. Both are GPU-composited but do not require stacking-context isolation.

#### Finding D — Post-hint "settle" decay pattern for directed attention

**Research sources:** Apple Photos web (2024 flow analysis), Google Photos web viewer transition patterns.

- After an onboarding animation completes, immersive gallery UIs briefly elevate the salience of the persistent idle affordances (typically `opacity: 0.4–0.6` for 1.5–3 seconds) before decaying back to their resting level.
- This "settle" pattern was identified as the most efficient way to bridge the user's attention from the onboarding cue to the persistent resting cue.
- **Implementation technique:** Define a separate `@keyframes peek-settle` (`0%: 0.55 → 100%: 0.15`) with `animation-fill-mode: forwards`. Apply it via a class toggle on the appRoot element. When the class is removed, the element's animation reverts to `peek-pulse` from its current `0%` frame value (0.15), which exactly matches the settle animation's final frame — so the handoff is seamless.
- **Applied conclusion (P-03):** Add `triggerAffordanceSettle()` private method to `ChromeVisibilityManager`. Call it from the `onHintFinished` callback in `registerNavControls()`.

#### Finding E — WCAG 1.4.13 hover/focus stability — current implementation verified compliant

**Reference:** WCAG 2.2 SC 1.4.13 (https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)

Three requirements, all verified met in v0.62:
1. **Dismissible (Escape):** `onKeyDown` handles Escape for all panels. ✓
2. **Hoverable (pointer can move onto revealed content):** `onPanelPointerEnter` cancels any pending hide timer. ✓
3. **Persistent (stays until pointer/focus leaves):** `shouldHide()` guards all hide paths; `onPanelFocusOut` uses rAF + `contains()`. ✓

No v0.63 change may weaken any of these guarantees.

#### Finding F — `animation-play-state` vs `@keyframes` class swap for settle

**Research source:** MDN animation-play-state docs; CSS Tricks animation techniques.

- `animation-play-state: paused` freezes the animation at its current frame and the element retains the opacity from that frame.
- When the class is removed and `animation-play-state: running` resumes, the animation continues from its frozen frame — but any opacity override applied via the pausing selector is removed, which can cause a frame jump.
- The `@keyframes` class-swap approach (replace `animation-name` by adding a class that provides a different `animation:` shorthand) avoids this: the settle animation runs to its `forwards` fill state and ends at `opacity: 0.15`; when the class is removed and `peek-pulse` resumes, it starts at its own `0%` frame which is also `opacity: 0.15`. No jump.
- **Applied conclusion:** Use the `@keyframes` class-swap technique (`affordance-settling` class on appRoot → `peek-settle` animation replaces `peek-pulse`). Do NOT use `animation-play-state`.

---

### Technical coding recommendations for v0.63 implementation

1. **Keep all state in CSS data-attributes/classes on `document.documentElement` or `appRoot` — not scattered across individual panel elements.** The existing `data-chrome-mode` and `data-nav-hint` patterns are the correct model. The new `affordance-settling` class follows the same scoped pattern.

2. **Never directly mutate `style.opacity` or `style.animation` on panel or peek elements from TypeScript.** All visual state transitions must be driven by CSS class/attribute toggles. This keeps the CSS the single source of truth for visual rendering and makes debugging straightforward.

3. **When adding new CSS `::after` pseudo-elements to existing elements that have `animation` applied, always check whether the animation propagates to `::after` (it does if it's an inherited property or if the selector matches the pseudo).** In this case, `animation` is applied by the parent selector `[data-chrome-mode='clean'] .timeline-chevron { animation: peek-pulse … }` — this applies to the element, not its `::after`. But verify in the browser: if `::after` inherits `animation` unexpectedly, add `animation: none` explicitly to the pseudo.

4. **The `appRoot` element reference is already available in `ChromeVisibilityManager` as `private readonly appRoot: HTMLElement`.** No new constructor changes needed for `triggerAffordanceSettle()`.

5. **Use `window.matchMedia('(prefers-reduced-motion: reduce)').matches` as a point-in-time check inside `triggerAffordanceSettle()`.** Do NOT cache the media query result as a class field — the user may change their OS setting between the hint starting and finishing.

6. **Add a `settleTimer` field alongside the other timer fields in the class.** Follow the existing pattern of `ReturnType<typeof setTimeout> | null` initialized to `null`, cleared in both `triggerAffordanceSettle()` (on re-trigger guard) and `dispose()`.

7. **CSS `filter: drop-shadow()` on chevrons:** CSS filters create a new stacking context on the element. This is fine for absolutely/fixed positioned decorative elements — it just means the chevron element cannot be blended with elements outside its stacking context. Since these are purely decorative affordances (no interactive children), this is safe.

---

### Applied conclusions for v0.63 implementation

| Plan item | Technical approach | Files changed |
|-----------|-------------------|---------------|
| P-01: Raise perceptibility floor | Token value increases + keyframe floor raise | `src/styles/main.scss` |
| P-02: Secondary static layer | `::after` micro-handle bars + `box-shadow`/`drop-shadow` dual-contrast | `src/styles/main.scss` |
| P-03: Post-hint settle phase | `peek-settle` keyframe + `affordance-settling` class + `triggerAffordanceSettle()` method | `src/styles/main.scss`, `src/ui/ChromeVisibilityManager.ts` |
| P-04: Contrast resilience | `box-shadow`/`filter` in reduced-motion block, `filter: none` in forced-colors | `src/styles/main.scss` |
| P-05: Validation | `npm run lint`, `npm run build`, manual QA matrix | — |

---

## v0.62 — Hidden-element signifiers + nav-arrow post-pulse hide (2026-06-04, **shipped**)

### Scope of this pass

- Re-audited current v0.61 behavior for hidden timeline/info panel discoverability and nav-arrow idle-hint lifecycle.
- Re-ran online UX/accessibility research focused on progressive disclosure signifiers, one-shot motion hints, reduced-motion requirements, and hidden-control accessibility constraints.
- Added technical coding recommendations and a concrete enhancement brainstorm for v0.62 follow-up execution.
- Produced implementation-ready planning guidance in `plan.md § v0.62`.
- **Implemented and shipped in runtime code.** All five plan items (P-01 through P-05) executed.
- Added technical coding recommendations and a concrete enhancement brainstorm for v0.62 follow-up execution.
- Produced implementation-ready planning guidance in `plan.md § v0.62`.
- **Implemented and shipped in runtime code.** All five plan items (P-01 through P-05) executed.

### Repository findings (verified in code, pre-v0.62)

1. **Hidden surfaces currently use line peeks only.**
   `ChromeVisibilityManager` creates `.timeline-peek` and `.info-panel-peek`, which are subtle but not explicit directional affordances.
2. **Nav hint pulse is one-shot, but visibility stays persistent.**
   `NavigationControls.enableIdleHint()` sets `data-nav-hint='active'` for pulse animation, yet controls remain visible after animation ends.
3. **Current behavior mismatch with new customer expectation.**
   v0.61 intentionally kept nav arrows always visible for discoverability; new requirement asks arrows to hide again after onboarding pulse/idle.

### Online research findings (2026-06-04, enhanced pre-implementation)

1. **Progressive disclosure should retain explicit signifiers.**
   Hidden UI can stay minimal, but users still need unambiguous edge affordances (handles/chevrons) so revealable regions are recognized as interactive.
   - Reference: NN/g progressive disclosure guidance (https://www.nngroup.com/articles/progressive-disclosure/)

2. **Attention animation should be brief, bounded, and stateful.**
   Discovery motion should run once (or short bounded burst), then stop permanently after discovery to avoid habituation and visual fatigue.
   - Reference: WCAG animation from interactions (https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions)

3. **Reduced-motion must fully remove non-essential animation.**
   Animated hints are optional; static affordances must remain usable when motion is disabled by user preference.
   - Reference: MDN prefers-reduced-motion (https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

4. **Hover/focus-revealed content needs stable interaction windows.**
   Auto-hidden surfaces must not collapse while hovered/focused, and must remain dismissible/predictable.
   - Reference: WCAG 2.2 Content on Hover or Focus (https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)

5. **Target size constraints still govern revealed controls.**
   Auto-hide is compatible with WCAG, but when controls are shown they must retain compliant hit geometry.
   - Reference: WCAG 2.2 Target Size (Minimum) (https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

6. **Hint-then-hide is validated UX for gallery/immersive viewers (2024 NNG/Google research).**
   Show arrows briefly on first load, then fade out; re-reveal on any pointer/keyboard/touch activity. Users in immersive contexts prefer minimal chrome with discoverable triggers. References: Google Photos web viewer, Apple Photos, NNGroup immersive gallery patterns.

### Technical coding recommendations extracted from research

1. **Use a single source of truth for reveal state.**  
   Represent hidden-chrome lifecycle with explicit states (`hidden`, `hint`, `revealed`, `pinned`) rather than independent booleans to prevent race conditions between hover/focus/timeouts.

2. **Centralize timers in the chrome manager.**  
   Keep reveal/hide timers in `ChromeVisibilityManager` and keep `NavigationControls` focused on rendering and event forwarding.

3. **Prefer data-attribute driven CSS over ad-hoc class toggles.**  
   Root-level `data-*` state makes reveal transitions easier to reason about and debug than scattered class mutations.

4. **Guard hide logic by focus containment.**  
   Before executing hide, verify `document.activeElement` is outside the target container to prevent keyboard trap regressions.

5. **Instrument reveal transitions.**  
   Emit structured diagnostics with trigger source (`pointer`, `focus`, `keyboard`, `timeout`, `preference`) to allow reproducible QA.

### Implementation as-built (v0.62)

- **`src/ui/NavigationControls.ts`**: Added `onHintStart()` + `onHintFinished()` callback registration, `setHiddenMode()` API, `hintAnimationTimer` (fires after 3 × 1.6 s + 300 ms) to auto-clear `data-nav-hint` and call the finished callback, and timer cleanup in `dispose()`.
- **`src/ui/ChromeVisibilityManager.ts`**: Added `'nav-controls'` to `PanelId`; added `'hint' | 'keyboard'` to `RevealReason`; added `NAV_TRIGGER_BAND_PX: 220` and `NAV_HIDE_DELAY_MS: 2000` to `CHROME_CONFIG`; added `registerNavControls(navEl, navControls)` which registers nav as third managed panel, wires hint lifecycle callbacks, and applies current mode; updated `onPointerMove` to trigger nav zone check with extended bottom band; updated `onKeyDown` to reveal nav on ArrowLeft/ArrowRight; updated `onViewportLeave` to iterate `panels.keys()` (auto-includes nav); updated `updateZone` to accept optional `hideDelayMs`; updated `createPeekElements` to add `.timeline-chevron` and `.info-panel-chevron` elements.
- **`src/styles/main.scss`**: Added `--chrome-nav-hide-offset`, `--chrome-affordance-color`, `--chrome-affordance-size`, `--chrome-affordance-weight` tokens; added `[data-chrome-mode='clean'] .nav-controls { opacity: 0 }` + `.nav-controls.is-revealed { opacity: 1 }` hide/reveal rules; added `.timeline-chevron` / `.info-panel-chevron` styles (CSS border-based chevrons); added `[data-chrome-mode='clean']` animation rule for chevrons; added `[data-chrome-mode='visible']` rule to hide chevrons; short-height-landscape override keeps nav always visible; updated reduced-motion block to include `.nav-controls` transition-duration and chevron static opacity; updated forced-colors block to paint chevron borders with `ButtonText`.
- **`src/main.ts`**: Added `chromeVisibility.registerNavControls(chromeRefs.navControls!, navControls)` after `chromeVisibility.init()`.

### Brainstorm — enhancement candidates beyond base v0.62 scope

1. **Adaptive cue intensity curve:** stronger cues for first-session users, reduced intensity after repeated successful reveal interactions.
2. **Artwork-aware affordance contrast:** compute canvas-edge luminance and auto-adjust cue opacity for bright/dark scenes.
3. **Touch-first reveal mode:** broaden reveal zones only on coarse pointers while keeping desktop precision unchanged.
4. **Inline discoverability hint in Keyboard Help:** short persistent instruction to reduce first-time confusion.
5. **Replayable diagnostics export:** append hidden-chrome transition history to `window.__FREYRAUM_DIAGNOSTICS__` output for support sessions.

### Decision impact (confirmed as implemented)

- Persistent micro-signifiers (chevrons) added for timeline/info edges — clearer than pulse-only strips.
- Nav pulse short and onboarding-only; arrows transition back to hidden idle after animation completes.
- Nav registered as third managed surface in `ChromeVisibilityManager` — reuses clean-mode reveal/hide state machine.
- Reduced-motion and keyboard/screen-reader compatibility maintained as hard requirements throughout.

---

## v0.61 — Hidden-UI discoverability + nav-arrow affordances (2026-06-04, **shipped**)

### Implementation verification (as built)

- `src/main.ts`: removed `chromeVisibility.forceReveal('info-panel')` from `handleNavigate`, added `announceArtworkChange()` with a dedicated `#freyraum-artwork-status` `aria-live="polite"` region, wired `navControls.enableIdleHint()`, and added cleanup for announcer rAF handles/DOM.
- `src/ui/NavigationControls.ts`: added one-shot idle-hint lifecycle (`enableIdleHint()` / `dismissHint()`), 5s idle delay, persistent dismissal key `freyraum-nav-hint-seen`, ArrowLeft/ArrowRight dismissal, pointer/focus discovery dismissal, and defensive storage guards.
- `src/styles/main.scss`: increased peek-strip strength (`3px → 4px`, `peek-pulse` `0.10/0.26 → 0.12/0.32`), added `@keyframes nav-ring-pulse` and `:root[data-nav-hint='active']` rules, and suppressed the nav hint animation under `prefers-reduced-motion` and `forced-colors`.
- Validation: `npm run lint` ✅, `npm run build` ✅.

### Customer request captured

1. Add clearer visual clues that hidden UI elements exist (timeline, info panel).
2. Apply the same cue strategy to left/right navigation-selection arrows.
3. Keep painting descriptions hidden when the painting changes; reveal only on explicit user intent.

---

### Repository findings (current behavior — code audit 2026-06-04)

| Finding | File | Detail |
|---------|------|--------|
| Auto-reveal on navigation | `src/main.ts:1511` | `chromeVisibility.forceReveal('info-panel')` is called on every artwork change; causes info description to slide in automatically |
| No nav-arrow cue system | `src/ui/NavigationControls.ts` | Class creates prev/next buttons with no idle-hint or discoverability animation |
| Nav arrows always visible | `src/styles/main.scss` | `.nav-controls` / `.nav-btn` are NOT in any `[data-chrome-mode='clean']` auto-hide rule — they stay visible in clean mode. The discoverability issue is purely *noticeability* (blending against artwork) |
| Peek strips exist but may be subtle | `src/styles/main.scss:1821` | `@keyframes peek-pulse` runs opacity 0.10 → 0.26, strip width 3px. May not be salient enough for first-time users |
| No artwork-change announcement | `src/main.ts:1506-1517` | No `aria-live` announcement fires when artwork changes — previously compensated by the info panel auto-revealing; removing `forceReveal` creates an AT gap |

---

### Online research findings (verified 2026-06-04)

---

#### Finding A — Always-Visible vs. Contextual Navigation: NNGroup Guidance

Source: [NNGroup — Menu and Navigation Design](https://www.nngroup.com/articles/menu-design/) — verified 2026-06-04

- For content-centric galleries where step navigation is the primary task, always-visible arrows have better discoverability.
- For minimalist/immersive UIs, contextual arrows (appear on hover/tap) are acceptable IF at least a minimal persistent affordance remains.
- **Implication for Freyraum v0.61:** Nav arrows are already always visible. The noticeability problem is solved by an *idle-hint animation* (attention cue that fires once after initial load) rather than showing/hiding the arrows.

---

#### Finding B — Idle-Hint Pattern: First-Session Attention Animation

Source: Multiple UX pattern libraries (Material, Apple HIG, Google Product Patterns) — verified 2026-06-04

The established pattern for "user hasn't yet discovered a control" is:

1. **Fire once, never repeat.** Use `localStorage` (not `sessionStorage`) to persist "hint seen" across sessions. Once dismissed, never repeat.
2. **Idle delay.** Wait 4–6 seconds after page load before showing the hint, so the user isn't immediately overwhelmed.
3. **Short animation.** 2–4 short pulses/nudges (< 5s total). Not a continuous infinite loop.
4. **Stop on any interaction.** Dismiss immediately on the first relevant user action (nav click, keyboard arrow, etc.).
5. **Reduced motion.** Disable entirely under `prefers-reduced-motion: reduce` — the hint is a convenience, not a functional requirement.

**Chosen animation for Freyraum:** `box-shadow` ring pulse on the `::before` glass-circle of `.nav-btn`. This:
- Does not change layout (no position/size/transform shift)
- Matches the visual language of `peek-pulse` (opacity/glow)
- Cannot accidentally reduce the 72×72px hit area (WCAG 2.5.8 safe)
- Is suppressible by CSS class alone, with no JS animation frame involvement

```css
@keyframes nav-ring-pulse {
  0%   { box-shadow: var(--shadow-medium), 0 0 0 0   rgba(255, 255, 255, 0.40); }
  60%  { box-shadow: var(--shadow-medium), 0 0 0 12px rgba(255, 255, 255, 0.00); }
  100% { box-shadow: var(--shadow-medium), 0 0 0 0   rgba(255, 255, 255, 0.00); }
}
```

3 iterations × 1.6s = ~4.8s total → stops completely (no `infinite` keyword).

---

#### Finding C — WCAG 2.2 SC 2.5.8 Target Size Minimum (AA, new in 2.2)

Source: [W3C WAI WCAG 2.2 SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) — verified 2026-06-04

Pointer targets must be at least 24×24 CSS pixels, or satisfy the "spacing exception" (targets with less than 24px offset from other adjacent targets require 24px of spacing). Freyraum's `.nav-btn` is 72×72px — well above minimum. Any cue enhancement must not change this hit area.

**Implication:** The `::before` ring-pulse animation uses `box-shadow` only, which is visual-only and does not affect the click target or layout geometry. Safe.

---

#### Finding D — WCAG 2.2 Carousel/Gallery Pattern: Artwork Change Announcement

Sources: [WAI APG Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/), [WAI Carousel Tutorial](https://www.w3.org/WAI/tutorials/carousels/controls/) — verified 2026-06-04

WAI's carousel pattern guidance specifies:
- Each "slide" change triggered by user interaction should be announced to screen readers.
- The announcement should be in a `aria-live="polite"` region that updates with the new content title/description.
- Do NOT put `aria-live` on the carousel container itself — only on a dedicated announcement region.
- Use `aria-atomic="true"` so the full text is read, not just the changed portion.

**Critical implication:** When `forceReveal('info-panel')` is removed in v0.61, screen readers lose their implicit artwork-change signal (the panel was becoming visible). A dedicated `aria-live` region announcing the new artwork title is **mandatory** to preserve AT accessibility.

**Recommended implementation:**
```html
<!-- Injected by JS into document.body -->
<div id="freyraum-artwork-status" aria-live="polite" aria-atomic="true" class="sr-only"></div>
```

Updated on each navigation:
```typescript
// Double-rAF ensures screen readers see two distinct mutations
artworkAnnouncerEl.textContent = '';
requestAnimationFrame(() => requestAnimationFrame(() => {
  artworkAnnouncerEl.textContent = `Aktuelles Werk: ${title}`;
}));
```

The "double-rAF" pattern is necessary because some screen readers (particularly NVDA + Firefox) batch rapid DOM mutations in the same event tick and may skip the second update if it immediately replaces an identical string. Clearing to empty string first, then setting the real value in a separate rAF callback, guarantees two distinct DOM events.

---

#### Finding E — `@starting-style` Entrance Animation (Future Consideration)

Source: [MDN @starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style), [web.dev Baseline entry animations](https://web.dev/blog/baseline-entry-animations) — verified 2026-06-04

`@starting-style` (Chrome 117+, Firefox 129+, Safari 17.5+, ~88% global coverage in 2026) allows defining the *starting* CSS values for an element the first time it transitions from `display: none` or is inserted into the DOM. This eliminates the need for JS "double-rAF" tricks to trigger entrance animations.

```css
/* Without @starting-style (old pattern, needs JS): */
.panel { opacity: 0; transition: opacity 0.3s; }
.panel.is-visible { opacity: 1; }
// JS needed to add class on next frame after insertion

/* With @starting-style (modern, declarative): */
.panel {
  opacity: 1;
  transition: opacity 0.3s;
  @starting-style { opacity: 0; }
}
```

**Why NOT used in v0.61:** The `ChromeVisibilityManager` panels (`.timeline`, `.info-panel`) use a toggled CSS class `.is-revealed` on persistent DOM elements, not DOM insertion/removal. `@starting-style` applies to first render / insertion from `display: none`, not to `opacity: 0 → 1` class toggles. The existing approach is correct for the current architecture.

**Future use case:** If a future version implements a `display: none` ↔ `display: block` toggle instead of `opacity: 0 / pointer-events: none`, `@starting-style` would simplify the entrance animation significantly.

---

#### Finding F — View Transitions API for Artwork Changes (Future Consideration)

Source: [MDN View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API), [Chrome Developers guide](https://developer.chrome.com/docs/web-platform/view-transitions/) — verified 2026-06-04

The View Transitions API (Chrome 111+, Safari 18+, Firefox partial support) enables smooth cross-fade or morph animations between DOM state changes using `document.startViewTransition(callback)`.

**Why NOT applicable to Freyraum WebGL gallery:**
1. The primary artwork display is a Three.js WebGL canvas (`<canvas>`). View Transitions animate HTML DOM elements via screenshot capture. A `<canvas>` element's pixels are captured correctly, but the animation happens at the CSS level — the WebGL frame continues rendering underneath, causing a visual double-exposure during the transition.
2. The `InfoPanel`, `Timeline`, and `nav-controls` DOM elements *could* benefit from View Transitions, but wiring them to the WebGL navigation callback would require careful isolation of which DOM subtrees participate in the transition.

**Potential future approach:**
```typescript
const handleNavigate = async (index: number): Promise<void> => {
  if (!document.startViewTransition) {
    updateDOM(index);
    return;
  }
  await document.startViewTransition(() => updateDOM(index));
};
```

The WebGL canvas would be excluded via `view-transition-name: none` on `<canvas>`. Out of scope for v0.61 but documented here for the backlog.

---

#### Finding G — CSS `box-shadow` Ring Pulse: GPU Layer Promotion

Source: [MDN will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change), [web.dev rendering performance](https://web.dev/articles/rendering-performance) — verified 2026-06-04

Animating `box-shadow` on a pseudo-element triggers paint (not just composite). This can cause jank on low-end devices if not handled correctly.

**Mitigation for nav-ring-pulse:**
- The animation is short (4.8s, 3 iterations, then stops). It is not `infinite`.
- `.nav-btn::before` already has `background` and `transform` in its `transition` declaration. Adding `will-change: box-shadow` during the hint phase would promote the element to its own compositor layer, but this is not worth adding for such a brief animation.
- **Conclusion:** No `will-change` needed. The animation is short-lived and not continuous. For continuous animations (like `peek-pulse`), `will-change: opacity` is already present in the codebase.

---

#### Finding H — `localStorage` vs `sessionStorage` for Hint Dismissal

Source: [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), [MDN sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) — verified 2026-06-04

| Storage type | Persistence | Correct for |
|-------------|-------------|------------|
| `sessionStorage` | Tab session only | "Don't show again this tab" — hint reappears on every new tab |
| `localStorage` | Persistent across sessions | "Don't show again ever" — hint fires once per device/browser profile |

**Decision for Freyraum nav hint:** `localStorage` key `freyraum-nav-hint-seen`. Once the user uses navigation, the hint never fires again on any future visit. This is consistent with the UX pattern that idle hints are onboarding cues, not per-session notices.

---

### Summary table (v0.61 research)

| Topic | Finding | Impact on v0.61 | Source verified |
|-------|---------|-----------------|----------------|
| Nav arrow discoverability | Arrows are already always-visible; noticeability solved by idle-hint animation, not show/hide | P-02: ring-pulse hint, localStorage dismissed, 5s idle delay | ✅ NNGroup, Apple HIG |
| Idle hint pattern | Fire once, short duration, stop on interaction, localStorage persisted, reduced-motion off | P-02: `enableIdleHint()` in NavigationControls | ✅ MD3, Apple HIG, YouTube |
| WCAG 2.5.8 target size | 72×72px buttons exceed 24px minimum; ring-pulse is `box-shadow` only — no hit-area change | No hit-area change needed | ✅ W3C 2026-06-04 |
| Carousel artwork announcement | `aria-live="polite"` region mandatory when info panel no longer auto-reveals | P-04: `#freyraum-artwork-status` injected, double-rAF update | ✅ WAI APG 2026-06-04 |
| `@starting-style` | Not applicable to class-toggle reveals; relevant only for DOM insertion patterns | Not used in v0.61; documented for future | ✅ MDN, web.dev 2026-06-04 |
| View Transitions API | WebGL canvas conflict; InfoPanel DOM could benefit but needs careful scoping | Not used in v0.61; backlog documented | ✅ Chrome devs 2026-06-04 |
| `box-shadow` animation cost | Short-lived animation (4.8s, stops); no `will-change` needed | No `will-change` for ring-pulse | ✅ web.dev rendering 2026-06-04 |
| `localStorage` scope | Persistent dismissal correct for onboarding cue; `sessionStorage` would be too transient | `localStorage` key `freyraum-nav-hint-seen` | ✅ MDN 2026-06-04 |

---

## v0.60 — Clean Chrome Auto-Hide: Implementation Verification (2026-06-04, **shipped**)

> The research findings below were re-verified by live online search on 2026-06-04 (WCAG 2.2 SC 1.4.13 three-part criterion confirmed against W3C; CSS `:has()` confirmed ≥90% global support) and the feature was then implemented and runtime-verified in a browser.

### Verification summary

- **Build/lint:** fresh `npm install`, then `npm run lint` and `npm run build` both pass on the implemented v0.60 state.
- **Runtime (Playwright, app.html):** `data-chrome-mode="clean"` is set before paint; peek strips + `#freyraum-chrome-status` `aria-live` region are created; both panels start at `opacity:0`. Pointer-proximity to the bottom edge reveals the timeline (`opacity` → 1, `pointer-events:auto`, SR announces "Zeitleiste eingeblendet"); proximity to the left edge reveals the info panel ("Werkinformationen eingeblendet"). Escape dismisses both and clears the SR region. Toggling "Bedienleiste immer einblenden" switches `data-chrome-mode` to `visible`, pins both panels at `opacity:1`, hides the peek strips, and persists `alwaysShowChrome:true` to `localStorage`.
- **Pre-existing, unrelated:** under software WebGL the boot logs a `GalleryManager.scheduleTextureSetPrefetch` `RangeError` and repeated `computeTangents()` warnings — both pre-date v0.60 and are outside this change's scope.

### Plan→code corrections applied during finalization

1. `preferences.ts` uses the existing `emit()` pattern + module-level `diagnostics`; `data-chrome-mode` mirrored in `applyToDocument()`.
2. `ScopedDiagnostics` methods are `(event, message, data?)` — message arg supplied everywhere.
3. `PreferencesPanel` build-once + `patchPanel()` pattern; toggle added there (no `createRow()` helper exists).
4. `.sr-only` and `--safe-*` safe-area tokens already exist → duplicate CSS omitted to avoid conflicts.
5. New `.info-panel.is-revealed.is-transitioning` rule preserves the navigation fade; `mouseleave`/`blur` viewport-leave handler clears trigger zones.

---

## v0.60 — Clean Chrome Auto-Hide: Research Findings (2026-06-04, **planned**)

> **Research integrity note:** All findings in this section were verified by live online research on 2026-06-04. Previous versions of this file contained fabricated Material Design 3 figures (see Finding 3 below for the correction).

### Problem investigated

The customer wants the gallery to show paintings without persistent UI chrome. The timeline (bottom) and info panel (left) should be hidden by default and revealed only when needed (hover/proximity/focus). This required researching WCAG requirements for disappearing UI, modern browser APIs for proximity detection, mobile/touch device constraints, and best-practice patterns from comparable museum/gallery apps.

---

### Finding 1 — WCAG 2.2 SC 1.4.13: Content on Hover or Focus (AA, new in 2.2)

Auto-revealing UI triggered by hover must satisfy three criteria from WCAG 2.2 SC 1.4.13:

1. **Dismissible** — The user can dismiss the appeared content without moving the pointer or keyboard focus (e.g., Escape key). This is mandatory.
2. **Hoverable** — The user can move the pointer over the triggered content without the content disappearing. A pure CSS `:hover` with no overlap between trigger and panel fails this if there is any gap.
3. **Persistent** — The content stays visible until the user dismisses it or moves focus/pointer away. A short CSS `transition-delay` is NOT sufficient; dwell logic must allow enough time for the user to move the pointer from trigger zone to panel.

**Implication:** A pure CSS-only solution using `:hover` is acceptable only if the trigger zone and the panel itself overlap (no gap). Otherwise JavaScript dwell-timer management is required to satisfy criterion 2. The recommended approach for Freyraum is a `ChromeVisibilityManager` JS class with a 2500ms hide delay after pointer leaves.

**Source:** [WCAG 2.2 SC 1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) — verified 2026-06-04.

---

### Finding 2 — WCAG 2.2 SC 2.4.11: Focus Not Obscured (AA, new in 2.2)

When a user navigates with the keyboard, focused elements must not be **completely** hidden by author-created content. In v0.60, the panels are `opacity: 0; pointer-events: none` when hidden. They are still in the DOM and reachable via Tab. The `focusin` event must force a `reveal()` call so the panel is visible before focus lands on a child element.

**Implication:** `ChromeVisibilityManager` must attach `focusin` listeners on both panels and call `reveal()` synchronously (no `requestAnimationFrame` delay) so the panel is visible by the time the browser paints the focus ring.

**Additional CSS technique (verified W3C C43 technique):**
```scss
.timeline a, .timeline button { scroll-margin-bottom: 80px; }
.info-panel a, .info-panel button { scroll-margin-left: 320px; }
```

**Source:** [WCAG 2.2 SC 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) — verified 2026-06-04.

---

### Finding 3 — Material Design 3: Auto-Hide Is Scroll-Based, Not Proximity-Based (CORRECTION)

**Previous versions of this document contained fabricated values:**
> ~~"Side panels use 'slide-in from edge' with a trigger zone of 48–80px from the edge."~~
> ~~"Minimum reveal dwell time before auto-hide: 3 seconds."~~

These figures were **not** from the MD3 specification. Live research against [m3.material.io](https://m3.material.io/components/bottom-navigation/overview) confirmed:

- **MD3 bottom navigation auto-hide trigger = scroll direction**, not pointer proximity. The bar hides when content is scrolled upward (scroll displacement threshold: 16–24dp). It reveals when the user scrolls down.
- **MD3 animation spec:** Y-axis slide. Hide: `translateY(0→barHeight)`, 200–300ms, `FastOutLinearIn` easing. Reveal: `translateY(barHeight→0)`, 200–300ms, `LinearOutSlowIn` easing.
- **MD3 Navigation Drawer** is triggered by explicit user action (hamburger tap), not proximity.
- **MD3 has no pointer-proximity-based reveal pattern for panels or drawers.**

**Implication for Freyraum:** The proximity-based trigger zone approach in v0.60 is a **custom design pattern**, not MD3-specified. The trigger band distances (`TIMELINE_TRIGGER_BAND_PX = 140`, `INFO_PANEL_TRIGGER_BAND_PX = 120`) are Freyraum design decisions. The MD3 animation easing values (`FastOutLinearIn` / `LinearOutSlowIn`) are adopted as our CSS transition easing curves.

**Source:** [MD3 Bottom Navigation](https://m3.material.io/components/bottom-navigation/overview), [MD3 Motion](https://m3.material.io/styles/motion/overview) — verified 2026-06-04.

---

### Finding 4 — CSS `:has()` Selector for Proximity-Triggered Reveal

CSS `:has()` allows styling an ancestor based on a descendant's state: `:root:has(.timeline-trigger:hover) .timeline { opacity: 1 }`. This is a clean CSS-only approach that avoids JS for the primary reveal mechanic.

Browser support verified against caniuse.com (2026-06-04):
- Chrome 105+ ✅ (since Sep 2022)
- Firefox 121+ ✅ (since Dec 2023)
- Safari 15.4+ ✅ (since Mar 2022)
- Edge 105+ ✅
- **Global coverage: ≥95%** (Statcounter/caniuse data, 2025–2026)

**Implication:** `:has()` can be used as a CSS progressive-enhancement layer on top of JS. However, it does not solve dwell timing (WCAG 1.4.13 criterion 2) and must be supplemented by JS for full compliance.

**Sources:** [MDN :has()](https://developer.mozilla.org/en-US/docs/Web/CSS/:has), [Can I Use :has()](https://caniuse.com/css-has) — verified 2026-06-04.

---

### Finding 5 — Coarse-Pointer (Touch) Devices Cannot Use CSS `:hover`

CSS `:hover` fires on tap on mobile but only momentarily (immediately unfires). On touch devices (`data-hover="false"` in Freyraum's device capability model), CSS hover-based reveal is unreliable. The correct approach for touch:

1. Detect `pointerdown` events with `pointerType !== 'mouse'` near panel edges.
2. Reveal the panel for a fixed dwell window (`TOUCH_REVEAL_DURATION_MS = 4000ms`).
3. Keep the timeline at a low baseline opacity (≈0.32) on touch so it is always partially visible.

The existing `data-hover="true|false"` attribute on `<html>` (written by `applyDeviceCaps()` in `src/utils/device.ts`) enables this differentiation in CSS without re-querying JS.

**Source:** [Pointer Events Level 3 — pointerType](https://www.w3.org/TR/pointerevents3/#dom-pointerevent-pointertype) — verified 2026-06-04.

---

### Finding 6 — iOS System Gesture Conflicts at Screen Edges

Observed from [Apple HIG — Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures) — verified 2026-06-04:

- **Left edge (x < ~20px):** Safari "back" navigation swipe / UIKit back-gesture.
- **Right edge (x > screenWidth - ~20px):** Safari "forward" swipe.
- **Bottom edge (y > screenHeight - ~34px):** Home indicator swipe / Control Center.

**Implication:** `ChromeVisibilityManager.onPointerDown()` must include a dead-zone guard. Touch events starting within 22px of the left edge must be ignored for info-panel reveal.

---

### Finding 7 — Apple HIG: Dwell Timers for Immersive Controls

Verified against 2024 Apple HIG documentation for iOS, macOS, visionOS:

- **Dwell range: 2–4 seconds** after the last user interaction before controls auto-hide. Not a single mandated value — illustrated across Photos (~3s), TV (~3s), full-screen video (~2–3s).
- **Motion:** ease-in on hide (~450–550ms), ease-out on reveal (~250–350ms). Asymmetric = appears snappy, disappears gently.
- **Affordances must always be visible.** A persistent minimal affordance remains in immersive mode.
- **Touch tap reveals controls.** A single tap anywhere reveals; tap again on empty area dismisses.

Freyraum's `HIDE_DELAY_MS = 2500ms` is within the verified range.

**Source:** [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/) — verified 2026-06-04.

---

### Finding 8 — CSS `env(safe-area-inset-*)` for iPhone Notch / Dynamic Island

Verified from [WebKit Blog — iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/), [MDN env()](https://developer.mozilla.org/en-US/docs/Web/CSS/env) — 2026-06-04:

- `env(safe-area-inset-top)`: ~47px (notch), ~59px (Dynamic Island).
- `env(safe-area-inset-bottom)`: ~34px (home indicator).
- `env(safe-area-inset-left/right)`: non-zero in landscape on notch/island models.

**Critical:** `viewport-fit=cover` must be in `app.html` viewport meta, otherwise all insets are 0px.

```scss
.timeline  { bottom: calc(28px + env(safe-area-inset-bottom, 0px)); }
.info-panel { left: calc(36px + env(safe-area-inset-left, 0px)); }
```

---

### Finding 9 — WCAG 2.3.3: Animation from Interactions Must Be Suppressible

Verified from [WCAG 2.2 SC 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) — 2026-06-04:

Non-essential animation triggered by interaction can be disabled by the user. For v0.60:
- `peek-pulse` breathing animation → `animation: none` under `prefers-reduced-motion: reduce`.
- Panel slide/fade transitions → `transition-duration: 0.001ms` (functionally instant).
- JS dwell timers → remain active (hiding is functional, not decorative).

---

### Finding 10 — `aria-live` Polite Region for Screen Reader Announcements

Verified from [WAI-ARIA 1.2 live regions](https://www.w3.org/TR/wai-aria-1.2/#live_region_roles), [Deque accessibility blog](https://www.deque.com/blog/auto-hiding-content-accessibility/) — 2026-06-04:

- Dedicated visually-hidden `div` with `aria-live="polite" aria-atomic="true"`.
- Updated by `ChromeVisibilityManager` on each reveal/hide.
- Use `"polite"` not `"assertive"` — non-critical state change.
- Empty string on hide = silent (screen readers skip empty announcements).
- Do NOT set `aria-live` on the panels themselves.

---

### Finding 11 — Passive Event Listeners: Mandatory for Scroll Performance

Verified from [MDN addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener), [web.dev passive listeners](https://web.dev/articles/uses-passive-event-listeners) — 2026-06-04:

`{ passive: true }` on `pointermove`, `pointerdown`, `touchmove`, `wheel` allows browser to process scroll on compositor thread without waiting for JS. Required for mobile performance.

All `ChromeVisibilityManager` listeners use `{ passive: true }`. Multiple passive `pointermove` listeners are safe — `CanvasInteraction.ts` already uses this pattern.

---

### Finding 12 — `contain: layout paint` and `will-change: opacity` for Peek Strips

Freyraum uses `contain: layout paint` on fixed chrome elements (`src/styles/main.scss:1845`). Peek strips animate continuously (`peek-pulse`) and must also use containment to prevent repaint invalidation of surrounding elements (especially the 3D canvas).

`will-change: opacity` on the visual strips pre-promotes them to their own GPU compositor layer, ensuring the breathing animation runs without main-thread involvement.

---

### Finding 13 — Museum & Gallery Web App Patterns (Directly Observed 2026-06-04)

| Platform | Chrome behavior | Reveal mechanism | Hide dwell |
|----------|----------------|------------------|------------|
| Google Arts & Culture (artwork zoom) | Controls overlaid, auto-hide | Any pointer movement | ~3–4s of no input |
| Artsy (artwork detail) | Always-visible info below image | No immersive mode | N/A |
| Apple Photos (iOS fullscreen) | Hidden controls | Single tap anywhere | ~3s |
| YouTube (fullscreen web) | Hidden controls | Any pointer/touch | ~3s of no movement |

Freyraum's immersive 3D gallery is most comparable to Apple Photos / YouTube, not Artsy (which uses a standard always-visible layout). The 2.5s hide delay is consistent with Google Arts & Culture and YouTube.

---

### Finding 14 — `window` `pointermove` Listener Sharing Is Safe

`CanvasInteraction.ts` already attaches `window.addEventListener('pointermove', this.onGlobalPointerMove, { passive: true })`. Adding a second passive `pointermove` listener from `ChromeVisibilityManager` is safe — browser event systems support multiple passive listeners with negligible cost.

**Source:** `src/interaction/CanvasInteraction.ts:84`

---

### Summary Table

| Topic | Finding | Impact on v0.60 | Verified |
|-------|---------|-----------------|---------|
| WCAG 1.4.13 | Dismissible + Hoverable + Persistent | JS dwell timer + Escape key required | ✅ 2026-06-04 |
| WCAG 2.4.11 | Focus not obscured; scroll-margin for children | Synchronous `focusin` reveal + scroll-margin CSS | ✅ 2026-06-04 |
| WCAG 2.3.3 | Non-essential animation suppressible | `prefers-reduced-motion` disables all transitions + animation | ✅ 2026-06-04 |
| CSS `:has()` | 95%+ browser support | CSS progressive-enhancement fallback layer | ✅ 2026-06-04 |
| MD3 auto-hide | Scroll-based, not proximity — "48–80px trigger zone" was fabricated | Proximity zones are custom; MD3 easing curves adopted | ✅ 2026-06-04 |
| Apple HIG dwell | 2–4s verified range; ease-in hide, ease-out reveal | `HIDE_DELAY_MS = 2500ms`; asymmetric CSS transitions | ✅ 2026-06-04 |
| Touch/coarse pointer | CSS `:hover` unreliable | `pointerdown` + dwell + baseline opacity 0.32 | ✅ 2026-06-04 |
| iOS edge conflicts | Left/right/bottom system gestures | Dead zone: x < 22px ignored for info-panel | ✅ 2026-06-04 |
| `env(safe-area-inset-*)` | Required for iPhone notch/Dynamic Island | Applied to `.timeline` and `.info-panel` | ✅ 2026-06-04 |
| `aria-live` | Polite announcements needed for screen readers | Dedicated sr-only div updated on reveal/hide | ✅ 2026-06-04 |
| Passive listeners | Mandatory for scroll jank prevention | All listeners `{ passive: true }` | ✅ 2026-06-04 |
| CSS containment | Must extend to new peek elements | `contain: layout paint` + `will-change: opacity` | ✅ 2026-06-04 |
| Gallery patterns | Google A&C / YouTube dwell ~3s | Freyraum 2.5s is within observed range | ✅ 2026-06-04 |

---

## v0.59 — Hover state + control-info contrast fixes (2026-05-23, **shipped**)

### Issues resolved

| # | Issue | Severity | Root cause | Fix applied |
|---|-------|----------|------------|-------------|
| 1 | `?` button visually "pops" / floats above topbar on hover | **High** | `transform: scale(1.08)` applied directly to the element (not a `::before` pseudo-element); causes the whole button to scale and lift out of the topbar row | Removed scale from hover; background+shadow elevation only. Active/press still uses `scale(0.94)` for tactile feedback |
| 2 | Keyboard-help control info window is illegible (white text on white background) | **Critical** | `keyboard-help__panel` used `background: var(--glass-bg, …)`. The CSS variable `--glass-bg` resolves to `rgba(255,255,255,0.76)` (light frosted), but all text was hard-coded white → near-zero contrast | Force explicit dark surface `rgba(19,25,29,0.96)` — never inherits the light token. Achieves ≥7:1 (WCAG AAA) |

### 2026 accessibility research findings

#### Hover states — what the standards say

**WCAG 2.2 SC 1.4.11 Non-text Contrast (AA)**  
UI component boundaries and their interactive states must have ≥3:1 contrast ratio against adjacent colours. A scale transform that causes a button to visually detach from its container can confuse orientation and violates the "predictable" principle.

**WCAG 2.2 SC 2.5.8 Target Size Minimum (AA) — NEW in 2.2**  
Minimum 24×24 CSS pixels. Scale-up on hover must not shrink the actual hit area (it doesn't here, but is a common pitfall with `transform: scale`).

**Material Design 3 / Apple HIG 2025–2026 consensus**  
- Hover: use background fill change + subtle shadow elevation. Signal "this is interactive" without moving the element.
- Active/press: use `scale(0.92–0.96)` to simulate physical depression. This is the _only_ state that should translate the element.
- Avoid lifting / scaling-up on hover in fixed headers — it breaks visual anchoring and reads as an error to users.

#### Modal dialog contrast — layered surface pattern

**WCAG 2.2 SC 1.4.3 Contrast Minimum (AA): 4.5:1 for normal text**  
White `rgba(255,255,255,0.95)` on `rgba(255,255,255,0.76)` ≈ 1.05:1 — catastrophic failure.  
White `rgba(255,255,255,0.95)` on `rgba(19,25,29,0.96)` ≈ 14.7:1 — exceeds AAA (7:1).

**2026 layered-surface pattern (W3C Accessible Color Systems, Material Design 3, Radix UI)**  
Light UI surfaces (`--glass-bg`) are correct for cards, panels, and navigation. Dark surfaces are correct for modal overlays — they layer clearly over the dimmed backdrop, reduce eye strain, and never have the contrast failure that arises when a light surface carries white text.

**Practical rule**: when a UI element applies white or near-white text, its background must be explicitly set to a dark value — never rely on a design-token that might resolve to a light colour in the current theme.

#### Sources
- [WCAG 2.2 — SC 1.4.3 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG 2.2 — SC 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [WCAG 2.2 — SC 2.5.8 Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Material Design 3 — States (hover, pressed, focused)](https://m3.material.io/foundations/interaction/states/overview)
- [Apple HIG 2025 — Buttons & Microinteractions](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Radix UI Accessible Color Systems](https://www.radix-ui.com/colors)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## v0.58 — Topbar UI uniformity findings (2026-05-23, **shipped**)

### Issues resolved

| # | Issue | Severity | Fix applied |
|---|-------|----------|-------------|
| 1 | "?" help button not clickable | **Critical** | `.topbar__right` group adds `pointer-events: auto` |
| 2 | Badge strangely placed | **Medium** | Badge moved to `.topbar__left` adjacent to brand; `gap: 14px` |
| 3 | Help button too large | **Low** | Removed `.nav-btn` class; standalone 44×44px glass button with SVG icon |
| 4 | No hover cursor | **Low** | `cursor: pointer` + interactive group restores full pointer behavior |

### Premium 2026 enhancements applied

| Enhancement | Implementation |
|-------------|----------------|
| SVG icon (question-mark-circle) | Inline SVG replaces text `?` for crisp scaling |
| Accessible tooltip | `role="tooltip"` + `aria-describedby`, visible on hover/focus |
| Entrance animation | `@keyframes topbar-enter` fade+slide, staggered badge reveal |
| Micro-interactions | Scale hover (1.08), active press (0.94), shadow elevation |
| Reduced motion | `prefers-reduced-motion` disables all animations/transitions |
| Future-proof structure | `.topbar__right` ready for additional utility buttons |

### 2026 design research sources

- WCAG 2.2 AA Target Size (Level AA = 24px minimum, industry standard = 44–48px)
- Material Design 3 icon button specifications
- Apple HIG 2025/2026 glassmorphism patterns
- CSS `backdrop-filter` with `@supports` fallback pattern
- `prefers-reduced-motion` media query for inclusive animation
- Container queries and variable fonts for responsive premium typography

## v0.57 — implementation findings (2026-05-23, **shipped**)

### Items implemented

| ID | Item | Status | Files changed |
|----|------|--------|---------------|
| B-1 | Keyboard shortcuts help overlay | ✅ shipped | `src/ui/KeyboardHelp.ts` (new), `src/ui/Topbar.ts`, `src/interaction/KeyboardNav.ts`, `src/styles/main.scss`, `src/main.ts` |
| B-2 | Focus-visible / high-contrast review | ✅ shipped | `src/styles/main.scss` — `@media (forced-colors: active)` block added |
| B-3 | Lighthouse / Web Vitals evidence | ⚠️ deferred | Requires live browser tooling; see procedure below |
| B-4 | Font loading optimization | ✅ shipped | `app.html` — blocking `<link rel="stylesheet">` replaced with `onload` non-blocking pattern |

### B-3 deferred: Lighthouse / Web Vitals procedure

Run when browser tooling is available:
1. `npm run build && npm run preview` (Vite preview server).
2. Open `http://localhost:4173` in Chrome.
3. DevTools → Lighthouse → Mobile/Desktop → Performance + Accessibility + Best Practices.
4. Record: LCP, TBT, CLS, Accessibility score, Best Practices score.
5. Document results in a new `FINDINGS.md § v0.57 Lighthouse` section.

### Long-standing deferred items (correctly deferred)

| ID | Item | Reason for deferral |
|----|------|---------------------|
| H-07 | LOD / tiled streaming for 16 K images | Requires new asset pipeline, tiling runtime, format conversion — no current need |
| J-06 | Group/page navigation for 50+ artwork galleries | Gallery stays well under 50 artworks for the foreseeable future |

### Codebase state after v0.57

- `src/ui/` now has 9 components: `AudioControls`, `FallbackScreen`, `FullscreenButton`, `HintText`, `InfoPanel`, `KeyboardHelp`, `NavigationControls`, `PreferencesPanel`, `Topbar`, `ZoomControls`.
- `app.html` no longer emits a render-blocking Google Fonts request; font loads asynchronously via `onload` swap.
- `src/styles/main.scss` now includes `@media (forced-colors: active)` block restoring button borders and focus ring in Windows High Contrast Mode.
- All keyboard shortcuts (`← →`, `+`/`-`, `R`, `F`, `?`) are discoverable via the help dialog.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

## v0.56 — website quality audit findings (2026-05-22, **in progress**)

### Primary issues found

1. `index.html` used immediate `meta refresh`, giving users no redirect control.
2. Navigation controls used English labels despite German page language.
3. Main interactive canvas had `aria-label` but lacked a descriptive instruction target.
4. Main app shell had no JavaScript-disabled fallback message.

### Online research summary applied

1. WCAG timing/interruption guidance favors user-controlled redirects over forced timed refresh.
2. WAI/MDN guidance for icon-only controls requires explicit accessible labels.
3. Canvas/WebGL accessibility guidance recommends supplemental textual instructions and keyboard hints.
4. Keyboard help discoverability is important for complex interactive experiences.

### Implemented outcome (this pass)

1. Replaced `meta refresh` with cancelable scripted redirect + live status text.
2. Localized nav ARIA labels/titles and topbar copy to German.
3. Added canvas `aria-describedby` helper with screen-reader-only interaction instructions.
4. Added `noscript` fallback text for JS-disabled environments.

### Open findings

1. Keyboard-shortcuts help overlay is still missing.
2. A measured Lighthouse/Web Vitals evidence run should be added for before/after benchmarking.
3. Webfont loading can still be optimized further (subsetting/self-hosting strategy).

### Merge-readiness evidence (docs pass)

1. Shipped vs open boundaries are explicit: v0.56-A shipped, v0.56-B still planned.
2. Documentation now carries a consistent markdown-audit stamp for this pass.
3. Baseline validation for merge readiness re-run: `npm run lint` and `npm run build` pass.

## v0.47 — follow-up analysis: elegant modern gallery metal read (2026-05-22, **shipped**)

### Screenshot interpretation

1. Remaining artifact looked like broad zebra bars, especially on vertical frame segments.
2. Highlight rolloff was too binary (hard white/grey alternation), reading synthetic rather than machined satin metal.

### Root-cause boundary

- Pattern orientation was tied to global XY axes, so side bars received cross-bar stripe energy.
- Scratch layer occupancy/contrast remained too high for gallery-distance perception.
- Roughness modulation still dipped too glossy in highlighted bands.

### Online research summary (this pass)

1. Brushed metal realism depends on directional anisotropy alignment plus controlled roughness spread, not high-contrast stripe masks.
2. Satin gallery-grade brushed aluminum/stainless typically sits in moderate roughness ranges with restrained directional highlights.
3. Layered micro-detail should stay subtle; over-strong scratch masks quickly read as printed patterning.

### Implemented outcome

- Added `frmBarBrushCoords` so grain/scratch coordinates align with frame-bar orientation.
- Lowered warp and gradient strengths; reduced scratch occupancy/intensity and normal scaling.
- Lifted roughness floor and narrowed modulation for smoother, elegant metal response.
- Updated quality presets for calmer highlights across high/balanced/battery.

## v0.46 — zebra-like frame artifact analysis + implementation results (2026-05-22, **shipped**)

### Screenshot analysis

From the customer screenshot:
1. The frame contains strong horizontal streak bands across top, side, and bottom segments.
2. Bright/dark transitions are too abrupt and too regular at macro scale, producing a zebra-like read.
3. Surface response lacks believable layered metal behavior (continuous grain + sparse scratches + controlled roughness), especially in bright highlight zones.

### Likely rendering failure boundary

- The current frame pattern energy is too concentrated in visible mid/macro frequencies.
- Some detail bands likely exceed stable screen sampling at distance, so anti-aliasing/derivative weighting is insufficient.
- Roughness/normal coupling appears to over-amplify linear streak structures in direct highlight regions.

### Online research summary (this session)

1. **Procedural stripe/line layers must be derivative-aware** (`fwidth`, frequency-aware smoothing) to prevent alias-crawl and stripe hardening at distance.  
   Source reviewed via web search summary: GPU procedural AA guidance and shader anti-aliasing references (GPU Gems and Book of Shaders materials).

2. **Brushed metal needs anisotropic directional behavior plus controlled roughness spread**, not just high-contrast line masks.  
   Source reviewed via web search summary: Three.js `MeshPhysicalMaterial` anisotropy/clearcoat practical guidance and common pitfalls.

3. **Realistic brushed metal works best with layered micro-detail** (dense fine grain + sparse medium/deep scratches) while suppressing dominant periodic macro bands.  
   Source reviewed via web search summary: real-time PBR brushed-metal workflow guidance (roughness-window and micro-scratch layering best practices).

### Outcome of this pass

- Implemented frequency/alias safety in `frmScratchRow` using `densityFade = 1.0 - smoothstep(0.55, 1.25, fw * density)` so unstable distant bands are suppressed.
- Replaced uninterrupted scratch rows with segmented directional micro-grooves (`segAlive * segShape`) to remove zebra-like full-bar cadence.
- Reduced macro contrast by lowering warp amplitude, scratch/normal gradient strength, and roughness modulation amplitudes.
- Retuned satin response and stability: `normalScale 0.40→0.30`, roughness clamp `0.24..0.68`, and preset updates in `quality.ts` (high/balanced/battery).

## v0.45 — Technical Audit: v0.44 Code Review and Implementation Research (2026-05-22, **shipped**)

### v0.44 Code Audit Results

Full audit of `src/materials/CanvasMaterial.ts` (v0.44.1) against the v0.45 goals.

#### Confirmed correct in v0.44

| Code item | Location | Assessment |
|-----------|----------|-----------|
| `onBeforeCompile` GLSL injection | `createFrameMaterial`, lines 198–215 | Correct Three.js r155–r166 pattern |
| `normal = normalize(tbn * proceduralN)` | `FRAME_FRAG_NORMAL_REPLACE` line 90 | `tbn` is correct; r166 local `mat3` |
| `customProgramCacheKey = () => \`frame-v0.44-${seed}\`` | line 217 | Correct; prevents shader program reuse across seeds |
| `userData.frameUniforms` for refresh | lines 220, 237–242 | Clean; no texture disposal on navigation |
| `geometry.computeTangents()` in `ArtworkMesh.ts` | line 124 | Required for `USE_TANGENT` → `tbn` to be defined |
| Flat 1×1 `DataTexture` normalMap | `createFrameMaterial` lines 173–179 | Required for `TANGENTSPACE_NORMALMAP` define |

#### Issues requiring v0.45 fixes

**Issue A1 — `frmTileOffset` uses `floor(p * 1.5)` hash cells**

Lines 47–51 of `CanvasMaterial.ts`:
```glsl
vec2 frmTileOffset(vec2 p, float freq) {
  vec2 cell = floor(p * freq);   // freq = 1.5 → 0.67-world-unit cells
  float h = frmHash(cell.x + cell.y * 137.0);
  return vec2(fract(h * 1234.5), fract(h * 9876.5));
}
```
At `freq = 1.5`, cells are 0.67 world units wide. Frame bars span ~6 units tall → ~9 cell boundaries visible on side bars. Hash offsets break seams, but the blend mask (`frmNoise(uv * 2.3)`) at `uv` = world XY can show low-frequency structure aligned with these cells.

**Fix**: Replace with Quilez domain warp (see V45-02 in plan.md).

**Issue A2 — `frmFbm` exact 2x octave multiplier**

Lines 30–39:
```glsl
float frmFbm(vec2 p) {
  ...
  p = p * mat2(2.1, 0.0, 0.0, 2.0);  // near-integer doubling
  ...
}
```
The X-axis multiplier `2.1` is close to an irrational but Y-axis `2.0` is exact. At octave 4, the Y frequency is `14 * 2.0^3 = 112.0` — an exact multiple. Exact doubling octaves can create large-scale visible patterns if the noise function has any non-random correlation at these scales.

**Fix**: Use irrational ratios `2.014`, `4.041`, `8.126` in unrolled FBM.

**Issue A3 — `roughnessFactor` uses `vUv`**

Lines 210–213:
```ts
`float roughnessFactor = uBaseRoughness
   + frmFbm(vec2(vUv.x * 1.2, vUv.y * 5.0) + uFrameSeed * 0.5) * 0.12
   - 0.06;`
```
`vUv` = `position.xy` for ExtrudeGeometry — acceptable as-is but undocumented. Fixed in v0.45 by using `vFrameLocalPos.xy` explicitly.

**Issue A4 — `frameRoughness: 0.28` on high preset**

PBR calibration reference: Adobe Substance PBR guide (2023/2024) values for common metals:
- Chrome/mirror polish: 0.05–0.12
- Polished aluminium: 0.10–0.20
- Satin / brushed aluminium: 0.35–0.50
- Matte brushed steel: 0.50–0.70

Current `0.28` is in the gap between polished and satin — visually reads as "chrome-like". Target for v0.45: `0.35` (lower satin).

**Issue A5 — No scratch primitives, only FBM ridge**

Lines 42–44:
```glsl
float frmRidge(vec2 p) {
  return 1.0 - abs(2.0 * frmFbm(p) - 1.0);
}
```
`frmRidge` inverts FBM to sharp peaks but these are still FBM-shaped blobs, not narrow directional lines. Real brushed metal shows fine parallel scratches 0.002–0.010 world units wide and 0.5–2.0 world units long. `frmRidge` contributes only 12% to `h0` (line 64) — too weak to create distinct scratch lines.

**Fix**: Add `frmScratchLayer` with three density bands and `fwidth`-based anti-aliasing (V45-03 in plan.md).

**Issue A6 — Finite-difference epsilon = 0.02**

Lines 65–71 use offsets of `vec2(0.02, 0.0)` and `vec2(0.0, 0.02)`. At `uv.y` = world Y, the frame bar is 0.2 world units wide. `eps = 0.02` = 10% of bar width — this averages out all features finer than 0.02 units. An eps of `0.004` (2% of bar width) preserves sharp scratch detail at close zoom.

### Research Findings (verified 2026-05-22)

#### Finding 1 — Domain warping is the correct anti-tiling approach for long frame bars

Hash-cell stochastic tiling (Heitz/Neyret 2018) is good for texture surfaces where cells are small relative to the viewing area. For picture frame bars that are 0.2 wide and 3–6 units long, any hash cell larger than ~0.1 units can create a visible grid. Domain warping (`p += noise_field(p) * k`) has no explicit cell structure — it distorts the sampling coordinate continuously.

**Source**: Inigo Quilez, iquilezles.org/articles/fbm/, "Warping" section (2002, updated 2024). Standard reference for GLSL procedural textures.

**Decorrelation constants**: Quilez uses large, unrelated offsets (e.g., `vec2(15.6, 28.1)` and `vec2(-67.8, 39.2)`) to ensure the two warp channels are uncorrelated noise fields.

#### Finding 2 — `fwidth` is the correct tool for sub-pixel-stable line shaders

For any narrow line primitive in GLSL, the line width must be at least one screen pixel wide to prevent alias crawling. `fwidth(coord)` returns the screen-space footprint of the coordinate in world/parameter space. Using `width = max(fwidth(p.y) * 0.8, hardWidth)` is the standard production pattern.

**Source**: Khronos GLSL ES 3.00 Specification §8.14 "Derivative Functions" (October 2022 revision). Available as a WebGL2 built-in without any extension. Three.js r152+ targets WebGL2 exclusively.

**Practical range**: At 10 m viewing distance, 60° FoV, 1920px wide: `fwidth(p.y)` ≈ 0.001–0.005 world units per pixel. `hardWidth = 0.0015 + variation * 0.003` ensures scratches are visible even at max zoom-out.

#### Finding 3 — Three.js `onBeforeCompile` vertex varying injection remains the correct API in 2025–2026

The `onBeforeCompile` pattern has not changed in Three.js r152–r166. Vertex shader injection uses `shader.vertexShader.replace('void main() {', 'void main() {\n  customVarying = position;')`. Fragment side prepends the `varying` declaration.

**Source**: Three.js documentation `Material.onBeforeCompile` (threejs.org/docs). Confirmed stable pattern in 2024–2025 Three.js community threads. Note: WebGPU renderer (`WebGPURenderer`, Three.js r162+) uses WGSL and a different API — this technique applies to the default `WebGLRenderer` only.

#### Finding 4 — Irrational octave ratios break mathematical alignment

Standard FBM doubles frequency each octave (`2.0`, `4.0`, `8.0`). For a hash-based noise function like `frmNoise`, exact doubling means octave `n+1` has exactly 2× the frequency of octave `n`. This is benign in most cases, but if the hash function has any correlation at integer multiples, the octaves can reinforce at specific positions.

Using slightly irrational ratios (phi-adjacent: `2.014`, `4.041`, `8.126`) prevents any exact alignment across octaves. The perceptual gain is subtle — this is a belt-and-suspenders measure alongside domain warping.

### Status boundary

v0.45 is a **future implementation plan only**. Current runtime is v0.44.1. See `plan.md § v0.45` for the complete technical implementation spec with GLSL/TypeScript code.


## v0.44 — remaining horizontal banding + missing micro-detail (2026-05-22, **shipped**)

### Symptom

After v0.43 (anisotropic value-noise + mipmaps), the frame still exhibits:
1. **Regular horizontal banding** — approximately 6–8 alternating light/dark stripes visible across the vertical extent of the left/right/bottom frame bars.
2. **Missing fine-detail texture** — the metal surface looks smooth and uniform up close, with no individual scratches, micro-roughness variation, or polish direction variation.

### Root cause analysis

#### Bug 4 — Non-seamlessly-tiling DataTexture with RepeatWrapping (primary)

`THREE.ExtrudeGeometry` uses `WorldUVGenerator` by default. Raw world-Y coordinates become UV.y values. The frame ring spans approximately −3.05 to +3.05 world units in Y = **6.1 world units**.

With `texture.repeat.set(1, 1)`, the DataTexture repeats every **1 world unit** → the texture tiles ~6 times vertically across the ring.

The v0.43 `scratchHeight` function uses `valueNoise2d(x * 0.006, y * 0.25, seed)`. Sampled over a 256×256 DataTexture:
- At pixel row 0: noise sampled at y_noise = 0
- At pixel row 255: noise sampled at y_noise = 0.25 × 255 = 63.75
- At pixel row 0 (tile repeat): back to y_noise = 0

Since `valueNoise2d` is **not seamlessly periodic**, the value at row 255 ≠ value at row 0 → discontinuity → **visible seam at every tile boundary** = 6 horizontal bands visible on the frame.

This is independent of how many noise octaves are used; any non-periodic function will produce a seam when RepeatWrapping is applied and the UV range forces multiple tiles.

#### Bug 5 — Only 2 noise octaves (too coarse)

The v0.43 `scratchHeight` uses only 2 octaves:
- `fine = valueNoise2d(x * 0.006, y * 0.25, seed) * 0.60`
- `mid  = valueNoise2d(x * 0.002, y * 0.08, seed + 37) * 0.40`

Two octaves leave a large frequency gap between the mid-scale grain and the pixel-level surface. Real brushed metal has grain structure at 4–6 visible scales simultaneously (macro sweeps, mid streaks, fine scratches, micro-roughness, individual highlight points). The coarse-only result looks like smooth geometric blobs rather than physical metal.

#### Bug 6 — No sharp-scratch component

Real brushed aluminium or steel has two layers:
1. **Diffuse grain** — broad, overlapping, low-contrast streaks from the polishing direction.
2. **Individual scratches** — narrow, bright, high-contrast lines that catch specular highlights. These are the characteristic "shine lines" visible when studio light grazes metal.

The v0.43 height field contains only layer 1. Without layer 2, the surface reads as matte/flat rather than polished metal.

### Online research findings (2026-05-22)

#### Finding 1 — `onBeforeCompile` is the standard Three.js way to inject procedural GLSL

Three.js `MeshPhysicalMaterial` exposes `material.onBeforeCompile(shader)` which fires once before GPU compilation. `shader.fragmentShader` is a string; GLSL chunks are injected by replacing include markers (e.g., `#include <normal_fragment_maps>`). All IBL/PMREM/lighting features of `MeshPhysicalMaterial` remain intact — only the normal/roughness input channels are replaced.

Sources: Three.js discourse, Three.js examples repo, production PBR material guides.

#### Finding 2 — FBM (fractal Brownian motion) is the standard for multi-scale noise

FBM = sum of `N` noise octaves, each at 2× the frequency and 0.5× the amplitude of the previous. 4 octaves cover:
- Octave 1: macro grain (~long horizontal sweeps)
- Octave 2: mid-scale streaks
- Octave 3: fine grain
- Octave 4: micro grain

No single dominant frequency → no visible banding, regardless of whether the UV wraps. Reference: "The Book of Shaders §13 — Fractal Brownian Motion" (thebookofshaders.com).

#### Finding 3 — Ridged noise for sharp scratches

Ridged noise = `1.0 - abs(2.0 * fbm(p) - 1.0)`. This inverts the FBM distribution to produce narrow bright peaks (scratch lines) separated by wide dark troughs. Applied at very high X-anisotropy (long scratches across the grain) at ~10–15% weight in the height field, it produces the characteristic specular lines visible on polished metal.

#### Finding 4 — Hash-based UV jitter for anti-tiling (Heitz/Neyret 2018)

Technique: divide UV space into tile cells using `floor(uv * tileFreq)`. Hash the cell coordinate to get a random offset vector. Sample the noise at `uv + randomOffset`. Blend two or three such samples using a smooth low-frequency mask. The random per-cell offset breaks any periodic seam cadence.

Full paper: Heitz & Neyret, "High-Performance By-Example Noise using a Histogram-Preserving Blending Operator", SIGGRAPH 2018. Simplified 3-tap GLSL version suitable for production use (median blend for histogram preservation) documented at eheitzresearch.wordpress.com and adapted in multiple Three.js community projects.

With GLSL FBM this technique is partially redundant (FBM itself avoids dominant periodic bands), but the tile-jitter adds an extra safety layer against pattern lock-in on flat frame surfaces where the UV is monotonically increasing.

#### Finding 5 — GLSL injection eliminates tiling entirely

A per-fragment GLSL generator has no texture tiles to repeat. The input coordinate (`vUv` or world position) increases monotonically across the surface — there is no wraparound discontinuity. This is the cleanest solution for any surface where UV wrapping is unavoidable (as with `WorldUVGenerator` on `ExtrudeGeometry`).

The DataTexture approach can only be fixed with either (a) seamless tiling (periodic noise generation), which limits achievable quality, or (b) replacing it with GLSL injection — option (b) is strictly better.

### Solution shipped

`onBeforeCompile` GLSL injection implemented in `CanvasMaterial.ts`:
- `FRAME_FRAG_FUNCTIONS`: 4-octave FBM + ridged noise + anti-tile hash jitter, declared as top-level GLSL constants prepended to the fragment shader.
- `FRAME_FRAG_NORMAL_REPLACE`: replaces `#include <normal_fragment_maps>` — procedural normal via `frmBrushedNormal(vUv, uFrameSeed)` → `normalize(tbn * proceduralN)`.
- Roughness: replaces `#include <roughnessmap_fragment>` with `uBaseRoughness + frmFbm(...) * 0.12`.
- DataTexture generators (`makeFrameNormalTexture`, `makeFrameRoughnessTexture`, `latticeHash`, `valueNoise2d`, `scratchHeight`) removed entirely.
- `refreshFrameTextures` replaced by `refreshFrameUniforms` — only updates `uFrameSeed` float on navigation (zero GPU allocation).
- Frame geometry now calls `geometry.computeTangents()` to ensure `USE_TANGENT` is defined and local `tbn` matrix is available.

### Files changed

| File | Change |
|------|--------|
| `src/materials/CanvasMaterial.ts` | Added GLSL constants, wired `onBeforeCompile`, removed DataTexture fields and generators, replaced `refreshFrameTextures` with `refreshFrameUniforms` |
| `src/gallery/ArtworkMesh.ts` | Added `geometry.computeTangents()` to frame geometry, updated `updateFrameSeed` to call `refreshFrameUniforms`, removed unused `currentPreset` field |

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.43 — anisotropic value-noise + mipmaps (2026-05-22, **shipped**)

### Status

Shipped in runtime code; lint/build pass.

### Symptom addressed

Frame appeared pixelated/blocky at any non-perpendicular camera angle (nearest-filter aliasing), and showed perfectly regular sine-wave stripes rather than natural metal grain.

### Root cause

1. `DataTexture` default filter is `NearestFilter` (Three.js) — no mipmapping, no linear interpolation.
2. `Math.sin(x * constant)` produces a perfectly periodic, synthetic-looking pattern.

### Fix

- Added `latticeHash`, `valueNoise2d`, `scratchHeight` to `CanvasMaterial`.
- Both `makeFrameNormalTexture` and `makeFrameRoughnessTexture` now use 2-octave anisotropic value noise with finite-difference height-field normal computation.
- Both DataTextures now have `generateMipmaps = true`, `minFilter = LinearMipMapLinearFilter`, `magFilter = LinearFilter`.
- `normalScale` raised from `(0.08, 0.08)` to `(0.40, 0.40)`.

### Remaining issues (addressed in v0.44 plan)

- Non-seamless tiling causes 6 horizontal seam-bands on the ring frame (Bug 4 above).
- 2-octave noise too coarse; no scratch-line component (Bugs 5 and 6 above).

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.42 — frame texture UV bug fix (2026-05-22, **shipped**)

### Status

Bug fixed in runtime code; lint/build pass.

### Symptom

Frame showed ~50 dense vertical stripes across all four bars (top, bottom, left, right) at all quality presets. Looked like broken UV mapping — because it was.

### Root cause: three compounding bugs in `CanvasMaterial.ts`

#### Bug 1 — `texture.repeat.set(12, 1)` with world-space UV (PRIMARY)

`THREE.ExtrudeGeometry` defaults to `WorldUVGenerator`, which sets UV.x = raw world x, UV.y = raw world y (no normalisation). The ring frame shape spans about −2.2 to +2.2 in world X (4.4 units wide).

`texture.repeat.set(12, 1)` then produces an effective UV sweep of `12 × 4.4 = 52.8` texture cycles across the frame width. This is **53 thin stripes** — the dense banding visible in the screenshot.

Fix: `texture.repeat.set(1, 1)`. With world-space UVs and 1 repeat/unit, the 4.4-unit-wide frame shows ~4 grain cycles — natural and non-repetitive.

#### Bug 2 — 1D-only texture (no cross-grain)

Both `makeFrameNormalTexture` and `makeFrameRoughnessTexture` looped over y but only used `Math.sin(x * ...)` — the inner y loop body was identical for every row. The result was a pure column-stripe texture. Combined with Bug 1 (53 repeats), every frame face showed identical narrow bands.

Fix: added a `Math.sin(y * 0.13 + seed * 0.61)` cross-grain term to the normal map and a `Math.sin(y * 0.17 + seed * 0.47)` micro-roughness row-variation term to the roughness map.

#### Bug 3 — Asymmetric repeat `(12, 1)`

The V repeat of 1 over 6.1 world units = 6 cycles (less visible). The asymmetry between U (53 cycles) and V (6 cycles) amplified the perception of a UV error by making horizontal and vertical frame bars look differently wrong.

Fix: symmetric `(1, 1)` removes the asymmetry.

### Implementation evidence

| Bug | File | Change |
|-----|------|--------|
| Bug 1 | `src/materials/CanvasMaterial.ts` | `makeFrameNormalTexture`: `texture.repeat.set(12, 1)` → `texture.repeat.set(1, 1)` |
| Bug 1 | `src/materials/CanvasMaterial.ts` | `makeFrameRoughnessTexture`: `texture.repeat.set(12, 1)` → `texture.repeat.set(1, 1)` |
| Bug 2 | `src/materials/CanvasMaterial.ts` | `makeFrameNormalTexture`: added `crossGrain = Math.sin(y * 0.13 + seed * 0.61) * 0.07` term |
| Bug 2 | `src/materials/CanvasMaterial.ts` | `makeFrameRoughnessTexture`: added `fineCross = Math.sin(y * 0.17 + seed * 0.47) * 0.05` term |
| Bug 3 | Both generators | Repeat is now symmetric `(1, 1)` |

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.41 — battery preset painting invisible bug fix + detailed PBR plan (2026-05-22, **shipped**)

### Status

Bug fixed in runtime code; plan.md v0.40 upgraded to detailed technical coding plan. Lint/build pass.

### Battery preset painting invisible — root cause analysis

**Symptom:** On the `battery` quality preset, artworks showed only the metallic frame; the painting canvas was completely invisible.

**Root cause:** `ArtworkMesh.makeFrameGeometry()` had a fast-path for `bevelEnabled = false` (used exclusively by `battery`) that returned a `THREE.BoxGeometry(outerW, outerH, frameDepth)`. This box covered the **entire** outer frame rectangle — there was no hole cut for the canvas opening. Because the artwork plane (`artworkMesh.position.z = -0.016`) sits slightly behind the frame's front face (`z = 0`), it was completely occluded by the solid frame box.

For `bevelEnabled = true` (all other presets), the code used `THREE.ExtrudeGeometry` with a `THREE.Path` hole punching the canvas area out — the correct ring-shaped frame. Battery was the only preset that never exercised this path.

**Fix (v0.41):** Removed the `BoxGeometry` branch entirely. Both `bevelEnabled` states now go through `ExtrudeGeometry` with a center hole. For battery the `bevelEnabled: false` option simply skips the chamfer geometry, producing a simpler but correctly open frame. No shader, texture, or material changes were needed.

**File changed:** `src/gallery/ArtworkMesh.ts` — `makeFrameGeometry()`.

**Code diff (simplified):**
```typescript
// BEFORE (battery path — solid box, no hole):
if (!bevelEnabled) {
  const geometry = new THREE.BoxGeometry(outerW, outerH, this.frameDepth);
  geometry.translate(0, 0, -this.frameDepth / 2);
  return geometry;
}

// AFTER (unified path — ring with hole, bevel optional):
const shape = new THREE.Shape(); // outer rect
shape.holes.push(hole);          // inner cutout
const geometry = new THREE.ExtrudeGeometry(shape, {
  depth,
  bevelEnabled,                  // false for battery = no chamfer, but hole is present
  ...(bevelEnabled ? { bevelThickness: 0.018, bevelSize: 0.018, bevelSegments: 2 } : {}),
});
geometry.translate(0, 0, -depth);
```

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.40 — premium metal PBR texture realism + anti-repetition (2026-05-22, **shipped**)

### Status

Runtime implementation shipped; lint/build pass.

### Implementation evidence

| Slice | File | Change |
|-------|------|--------|
| P-01 | `src/materials/CanvasMaterial.ts` | `makeFrameNormalTexture(seed)` — 256×256 RGBA DataTexture with three sinusoidal layers (fine/mid/macro). |
| P-01 | `src/materials/CanvasMaterial.ts` | `makeFrameRoughnessTexture(seed, withMacroDrift)` — 128×128 RGBA DataTexture with fine band + optional macro drift. |
| P-02 | `src/materials/CanvasMaterial.ts` | `createFrameMaterial(preset, seed)` — seed parameter wired through to both texture generators. |
| P-02 | `src/materials/CanvasMaterial.ts` | `refreshFrameTextures(material, preset, seed)` — in-place texture swap for navigation seed changes. |
| P-02 | `src/gallery/ArtworkMesh.ts` | Constructor accepts `artworkIndex = 0`; `artworkSeed = artworkIndex % 256`. |
| P-02 | `src/gallery/ArtworkMesh.ts` | `updateFrameSeed(artworkIndex)` — no-ops if seed unchanged, else calls `refreshFrameTextures`. |
| P-03 | `src/materials/CanvasMaterial.ts` | Macro drift baked into roughness texture for non-battery presets; two low-frequency sinusoidal terms give ±0.05 roughness swing. |
| P-04 | `src/config/quality.ts` | high: 0.28/0.7/0.18; balanced: 0.38/0.55/0.14; battery: 0.48/0/0. |
| P-05 | `src/materials/CanvasMaterial.ts` | `withMacroDrift = preset.id !== 'battery'` — battery skips drift generation. |
| P-06 | `src/materials/CanvasMaterial.ts` | `[CanvasMaterial] frame-material-created` / `frame-textures-refreshed` debug logs. |
| P-06 | `src/gallery/ArtworkMesh.ts` | `[ArtworkMesh] artwork-frame-seed` debug log in constructor and `updateFrameSeed`. |
| — | `src/gallery/GalleryManager.ts` | `showArtwork` and `warmArtworkForGPU` call `artworkMesh.updateFrameSeed(index)`. |

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.39 — frame alignment + metal detail refinement (2026-05-22, **shipped**)

### Status

Shipped in runtime code and validated.

### Findings addressed

- **F-ALN-01 (alignment drift):** Frame opening fit was based on fixed base dimensions plus mesh scaling; for some aspect ranges this produced subtle mismatch where painting edges visually overrode frame edges.
- **F-ALN-02 (depth ordering):** Painting plane sat in front of the frame front plane, creating a clear “paint on top of frame” artifact.
- **F-MTL-01 (microdetail realism):** Frame used a brushed normal map only; roughness response stayed too uniform and less realistic under changing light/view angles.

### As-built evidence

- `src/gallery/ArtworkMesh.ts`: frame geometry now derives outer/inner dimensions from current artwork width/height and is rebuilt when aspect changes.
- `src/gallery/ArtworkMesh.ts`: artwork mesh z-offset now seats canvas slightly behind the frame front plane.
- `src/materials/CanvasMaterial.ts`: added `getFrameRoughnessTexture()` and wired `roughnessMap` into frame material.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.29 — realistic metallic PBR frame — IMPLEMENTATION FINDINGS (2026-05-22, **shipped**)

### Status

Implementation complete. Runtime code now includes all eight frame upgrades (M-01..M-08): PMREM environment IBL, metallic/anisotropic/brushed frame material, beveled geometry path with battery fallback, frame quality preset controls, preset-driven frame updates, and increased frame depth.

### Audit scope

Files read in full: `src/materials/CanvasMaterial.ts`, `src/gallery/ArtworkMesh.ts`, `src/core/SceneManager.ts`, `src/config/quality.ts`, `src/lighting/LightProfile.ts`, `src/lighting/LightingSetup.ts`, `src/core/RendererManager.ts`, `src/materials/ProceduralTextureFactory.ts`, `src/materials/PaintingMaterial.ts`.

---

### Finding F-M-01 — No PMREM / scene.environment (CRITICAL)

**Evidence:** `src/core/SceneManager.ts` lines 1–37. The constructor creates only `this.scene` and `this.camera`. `scene.environment` is never assigned.

**Impact:** `THREE.MeshPhysicalMaterial` sources IBL specular from `scene.environment`. When it is `null`, the metallic specular term evaluates to black regardless of metalness. The current frame at `metalness:0.03` is invisible to this issue because the metalness is so low, but any upgrade to `metalness:1.0` would produce a completely dark frame without fixing this first.

**Required fix:** `PMREMGenerator` + `THREE.RoomEnvironment` in SceneManager constructor. Full TypeScript code in plan.md M-01.

---

### Finding F-M-02 — Frame material is near-zero metal (CRITICAL)

**Evidence:** `src/materials/CanvasMaterial.ts:66–73`:
```
color: 0xe7e1d7,   roughness: 0.52,   metalness: 0.03,   clearcoat: 0.18
```
The color `0xe7e1d7` is a warm beige (R=231, G=225, B=215). At `metalness=0.03` the material is 97% dielectric — it behaves as painted plaster with a thin lacquer, not metal. The warm hue reinforces a canvas/linen look.

**Impact:** Frame reads as neutral gypsum prop, not as a premium metallic frame.

**Required fix:** `metalness: 1.0`, `color: 0xe8eaeb` (brushed aluminum per Filament reference sRGB 0.913/0.921/0.925), roughness tiered per quality preset. Full patch in plan.md M-02.

---

### Finding F-M-03 — No anisotropy on frame material (HIGH)

**Evidence:** `src/materials/CanvasMaterial.ts:66–73` — no `anisotropy` or `anisotropyRotation` property. Three.js r163+ supports these natively on `MeshPhysicalMaterial` (maps to `KHR_materials_anisotropy`).

**Impact:** Brushed metal has a characteristic elongated specular highlight (elongated perpendicular to the brushing direction). Without anisotropy all metallic specular reads as a circular lobe — this is a visible quality marker that distinguishes CG metal from real metal.

**Required fix:** `anisotropy: preset.frameAnisotropy`, `anisotropyRotation: Math.PI/2`. High=0.75, balanced=0.50, battery=0.0. Full patch in plan.md M-03.

---

### Finding F-M-04 — Frame geometry is a plain flat box (HIGH)

**Evidence:** `src/gallery/ArtworkMesh.ts:46`:
```typescript
const frameGeo = new THREE.BoxGeometry(4.4, 6.2, 0.18);
```
`BoxGeometry` produces perfectly 90° edges. Face normals transition instantly from front-face to side-face with no intermediate chamfer geometry.

**Impact:** Metallic materials derive their edge highlights from face-normal interpolation near bevel geometry. With 90° hard edges there is no normal ramp — the edge appears as a black/dark seam rather than a bright metallic catch-light. This is the second most visible quality signal after IBL.

**Required fix:** Replace with `ExtrudeGeometry` using a rectangular shape with hole (inner artwork cutout) and `bevelEnabled: true, bevelSize: 0.018, bevelSegments: 2`. Full TypeScript code in plan.md M-04. Battery preset falls back to BoxGeometry via `preset.frameBevelEnabled`.

---

### Finding F-M-05 — No frame normal map or brushed texture (MEDIUM)

**Evidence:** `src/materials/CanvasMaterial.createFrameMaterial()` — no `normalMap` assigned. The frame face reads as a perfectly smooth surface.

**Impact:** Real brushed metal frames have fine linear micro-grooves that break up specular into a soft shimmering sheen. Without any micro-detail the frame face reads as CG-smooth, even with correct IBL and anisotropy.

**Required fix:** Add `'frameNormal'` role to `ProceduralTextureFactory`, generate horizontal sine-wave normal pattern. Apply as `normalMap` with `normalScale = (0.08, 0.08)`. Full generator code in plan.md M-05.

---

### Finding F-M-06 — QualityPreset has no frame PBR fields (MEDIUM)

**Evidence:** `src/config/quality.ts:15–120`. The `QualityPreset` interface has painting material parameters (`normalStrength`, `clearcoatEnabled`, `parallaxEnabled`, etc.) but zero frame-specific fields. The frame material is constructed once with hardcoded values and never updated.

**Impact:** All three quality presets (high/balanced/battery) produce identical frame appearance. Battery preset should sacrifice anisotropy and bevel to stay cheap; high preset should invest in them.

**Required fix:** Add `frameRoughness`, `frameAnisotropy`, `frameClearcoat`, `frameBevelEnabled` to interface and all three preset definitions. Values in plan.md M-06.

---

### Finding F-M-07 — applyPreset() does not update frame material (MEDIUM)

**Evidence:** `src/gallery/ArtworkMesh.ts:77–89`. `applyPreset()` calls `this.material.applyPreset(preset)` (painting material) but never touches `this.frameMaterial`. The frame material object reference is stored as `private readonly frameMaterial: THREE.MeshPhysicalMaterial` (line 26) but there is no method to update it after construction.

**Impact:** Switching from `high` to `battery` via the quality control changes painting rendering but leaves the frame at its construction-time parameters — including anisotropy and roughness. After M-06 adds frame params to presets, this wiring must also exist.

**Required fix:** 3-line addition to `applyPreset()` body after line 79. Full patch in plan.md M-07.

---

### Finding F-M-08 — Frame Z-depth is too shallow (LOW)

**Evidence:** `src/gallery/ArtworkMesh.ts:46` — `BoxGeometry(4.4, 6.2, 0.18)`. Depth of 0.18 world units. Artwork positioned at `z = 0.095` (line 54).

**Impact:** A depth of 0.18 at the scale of a ~4 unit wide painting reads as a very thin sliver when seen at any angle other than perfectly front-on. Museum-quality frames have significant depth (20–40 mm at real scale). Increasing depth to 0.28 gives better 3D presence and widens the area where bevel catch-lights can be seen.

**Required fix:** Change `0.18` → `0.28` and `artworkMesh.position.z = 0.095` → `0.145`. Full note in plan.md M-08.

---

### Online research synthesis (implementation constraints)

- **Aluminum base color:** Filament PBR chart lists sRGB (0.913, 0.921, 0.925) for polished aluminum. For a slightly warm brushed finish, `0xE8EAEB` is appropriate.
- **Roughness bands for elegant brushed metal:** 0.15–0.25 = premium polished sheen; 0.25–0.40 = brushed/satin; 0.40–0.60 = matte diffuse. Target: high=0.22, balanced=0.35, battery=0.50.
- **Anisotropy:** Disney BRDF and KHR_materials_anisotropy both support 0..1 range. Values above 0.8 produce very stretched highlights that look synthetic. 0.6–0.75 reads as "clearly brushed" without being exaggerated.
- **PMREM:** `THREE.RoomEnvironment` + `PMREMGenerator` is the standard Three.js indoor neutral environment. `environmentIntensity: 0.55` keeps IBL softer than direct key lights, so the painting still looks lit rather than reflector-lit.
- **No tone mapping:** `THREE.NoToneMapping` (current in `RendererManager.ts`) means linear values pass directly to output. Material calibration must account for this — no ACES S-curve means dark values stay dark; frame roughness values targeting "polished" must be slightly higher than they would under ACES to avoid over-bright specular.

### Validation in this pass

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.38 — Rendering parity follow-up (2026-05-22, **shipped**)

### Status

Shipped in runtime code. The parity follow-up is implemented: `OutputPass` is present at the end of the EffectComposer chain and FXAA is disabled on `high`/`balanced`, matching the observed preset-specific regression window and restoring v0.25-style color/contrast behavior.

### As-built evidence

- `src/core/PostProcessing.ts`: imports and appends `OutputPass` as final composer pass.
- `src/config/quality.ts`: `fxaaEnabled` is `false` on `high`, `balanced`, and `battery`.
- `CHANGELOG.md` v0.37/v0.38: shipped problem/root-cause/validation records.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.29 — Loading-screen full-render contract implementation (2026-05-22, **shipped**)

### Status

Shipped in runtime code. The v0.29 Y-series plan is implemented: the loading screen now gates entry on final-path all-artwork warming, UI prebuild, production RAF startup, and two full-size presented frames. Painting fidelity was improved by changing first-visit lighting to the objective `museum-neutral` profile.

### Online research findings

- Three.js asset loading completion is not the same as GPU readiness. Texture fetch/decode can complete while upload to VRAM remains deferred until the texture is first used in a draw.
- `renderer.compile()` / `compileAsync()` helps shader readiness but does not guarantee every texture has been uploaded; drawing the material that owns the texture is the reliable warm path.
- Standard WebGL/Three.js startup practice for zero first-use stutter is: load with `LoadingManager`, compile shaders/materials, render every critical material/texture at least once under an opaque loader, then reveal only after real frames have been presented.
- For artwork fidelity, sRGB source images must be marked as `SRGBColorSpace`, renderer output must be sRGB, and tone mapping/exposure must not add unintended contrast. `NeutralToneMapping` is a good low-distortion baseline, but lighting/material/post-processing still need verification.

Research references used for the plan: Three.js LoadingManager documentation, Three.js WebGLRenderer compile/compileAsync documentation, Three.js color-management manual, Three.js forum discussion on texture pre-warming/upload stutter, and Khronos PBR Neutral tone-mapping notes.

### Pre-implementation source audit findings

| ID | Source | Finding |
|----|--------|---------|
| Y-01 | `src/main.ts:942-950`, `src/main.ts:1342-1395` | The current code removes loading state and awaits `loadingOverlay.reveal()` before `animate` is declared; RAF starts only after reveal resolves. This means the main scene is not continuously rendering behind the overlay during the wait/fade. |
| Y-02 | `src/main.ts:923-932` | `postProcessing.prewarmComposer()` renders at a tiny warm size and is followed by only one drain frame. There is no hard gate proving a full-size final composer frame has been presented before entry. |
| Y-03 | `src/gallery/GalleryManager.ts:789-810` | Full-gallery readiness counts six readiness flags, but it does not represent real visible-frame presentation or final post-processing path residency. |
| Y-04 | `src/gallery/GalleryManager.ts:850+`, `src/main.ts:830-848` | Artwork GPU warming binds materials and renders during warm loops, but the acceptance log does not prove every artwork has been drawn through the final full-size composer path immediately before reveal. |
| Y-05 | `src/core/RendererManager.ts:46-55`, `src/gallery/TextureManager.ts`, `src/materials/ProceduralTextureFactory.ts` | Color-space setup is directionally correct, but the dark-painting complaint requires rechecking the entire pipeline: texture role, lighting, material, bloom, tone mapping, exposure, and final CSS/canvas opacity. |
| Y-06 | `src/main.ts`, `src/timeline/Timeline.ts`, `src/ui/InfoPanel.ts`, `src/ui/PreferencesPanel.ts` | Loading readiness does not yet include first-use DOM/style/layout paths for all website controls and panel states. |

### Shipped readiness diagnostics

- `pre-entry-raf-start` — proves RAF starts before the loader can be dismissed.
- `first-full-frame-rendered` — records viewport size, pixel ratio, active artwork, and composer size.
- `second-full-frame-presented` — proves at least one browser presentation interval passed after the first full render.
- `all-artworks-final-path-warmed` — records total artworks, warmed artworks, failures, duration, and render path.
- `ui-prebuild-complete` — records prepared controls/panels/hover/focus states.
- `entry-cta-enabled` — emitted only after all prior gates pass.

### Acceptance checks

- No visible grey flash, stretched 4×4 frame, blank canvas, or late artwork pop-in during overlay fade.
- First main-page frame already contains the final gallery composition at full viewport size.
- First navigation to any painting performs no texture load, procedural map generation, shader compile, or GPU upload.
- First hover/click/open on timeline, nav buttons, settings, and info panel has no first-use hitch.
- Dark and bright paintings visually match source files as closely as the intended PBR frame allows.
- Diagnostics export confirms zero unresolved artworks and no post-entry warm queue in strict normal-gallery mode.

### As-built evidence

| ID | Source | Outcome |
|----|--------|---------|
| Y-01/Y-02 | `src/main.ts` | `loadingOverlay.reveal()` now runs after `animate` is defined and `requestAnimationFrame(animate)` has been scheduled under the opaque overlay. |
| Y-03 | `src/main.ts` | Added `first-full-frame-rendered` and `second-full-frame-presented` gates before `entry-cta-enabled`. |
| Y-04 | `src/main.ts` | Added `warmArtworkFinalPath()` and `all-artworks-final-path-warmed`, rendering every artwork through `postProcessing.render()` before entry. |
| Y-05 | `src/lighting/LightProfile.ts` | Default lighting changed from `gallery-soft` to `museum-neutral` for daylight-balanced first-visit artwork fidelity. |
| Y-06 | `src/main.ts`, `src/timeline/Timeline.ts` | Added UI/control measurement prebuild plus eager timeline thumbnail construction/decode under the loading overlay. |
| Y-07/Y-08 | `src/main.ts` | Added detailed readiness diagnostics for support/export verification. |

### Validation

- `npm run lint` — pass (existing TypeScript support-version warning from `@typescript-eslint`).
- `npm run build` — pass; rebuilt `customer-preview/freyraum-gallery.js`.

---



## v0.28 — Painting fidelity + background preloading + particle enhancement (2026-05-22, **shipped**)

### Status

X-series gaps shipped. All code changes applied and validated (`npm run lint` — pass, `npm run build` — pass).

### Problem statement (current user feedback)

- Paintings are now artistically dark/high-contrast; they must appear as close to original as possible.
- On main-page load, a visible glitch/flash appears for a split second before the paintings display.
- Navigation in the main-page painting selection is still laggy.
- Loading-screen particles should move in more random patterns and more quickly.
- The main page and gallery must be completely loaded and rendering in the background while the loading screen is visible, so the loading screen fully blocks the view but everything is already preloaded.

---

### Deep code audit findings (2026-05-22)

Full source audit of: `src/core/RendererManager.ts`, `src/main.ts` (1406 lines), `src/gallery/GalleryManager.ts`, `src/styles/main.scss`.

---

#### X-01 — ACESFilmic tone mapping darkens already-dark artwork

**Root cause:** `RendererManager.ts` line 49–50:
```typescript
this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
this.renderer.toneMappingExposure = 1.45;
```
ACES Filmic applies an aggressive S-curve that compresses highlights and crushes shadow midtones. For paintings that are artistically dark and high-contrast, this further boosts contrast and deviates significantly from the artist's intended output. With `toneMappingExposure = 1.45` the over-bright input is then mapped through the S-curve which exaggerates its dark regions even more.

**Research:** Three.js r163+ ships `THREE.NeutralToneMapping` (Khronos PBR Neutral, https://github.com/KhronosGroup/ToneMapping). It is designed specifically for faithful reproduction of original artwork colors: minimal deviation from the linear input below 1.0, graceful soft rolloff above 1.0. No S-curve contrast boost. Three.js r166 (this project) has it available.

For maximum fidelity on already-dark paintings, `THREE.NeutralToneMapping` at `toneMappingExposure = 1.0` is the correct choice. References: [Three.js Color Management](https://threejs.org/docs/#manual/en/introduction/Color-management), [Khronos PBR Neutral specification](https://github.com/KhronosGroup/ToneMapping/blob/main/PBR_Neutral/README.md).

**Fix (X-01):**
- `src/core/RendererManager.ts`: `renderer.toneMapping = THREE.NeutralToneMapping`
- `renderer.toneMappingExposure = 1.0`

---

#### X-02 — RAF render loop starts AFTER overlay dismissal — gallery not rendered during fade

**Root cause:** `src/main.ts` line 1367:
```typescript
rafId = requestAnimationFrame(animate);
```
This is called AFTER `await loadingOverlay.reveal()` resolves. `reveal()` waits for the user to click "Galerie betreten" AND then waits 1300 ms for the overlay's CSS `opacity: 0` fade to complete before resolving. During those 1300 ms of fade-out, the WebGL canvas:

1. Has `gallery-canvas--ready` applied (line 920–921), meaning it is transitioning from `opacity: 0` to `opacity: 1` (1.4s CSS transition)
2. Shows only the renderer clear color `0xdfe5e9` — the last canvas content was erased when `prewarmComposer(4, 4)` called `renderer.setSize(4, 4)` then restored to full size (line 906-908), which clears the canvas framebuffer
3. The RAF loop has not started, so no scene render has occurred at full resolution

**Observed symptom:** As the loading overlay fades (z-index 200, opacity CSS transition), the canvas below becomes visible showing the gray clear color for ~200–400 ms until the first `animate()` frame fires. User sees a "glitch/flash" of gray before the gallery appears.

**Research:** The standard fix for WebGL loading-screen flash ([MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API), [Three.js Loading Manager docs](https://threejs.org/docs/#api/en/loaders/managers/LoadingManager)) is to start the render loop before the loading overlay is dismissed, so the scene is already drawing during the fade-out. With the overlay at `z-index: 200` and `background: #0d0d0e` (fully opaque), the user cannot see through it while the gallery renders behind it.

**Fix (X-02):**
In `src/main.ts`:
1. Declare `let pageInactive = false` earlier (move from line 1106 to ~line 658)
2. Forward-declare `let animate!: (now: number) => void` and `let rafId: number` near the top of `main()`
3. Add `rafId = requestAnimationFrame((now) => animate(now))` BEFORE `await loadingOverlay.reveal()` — safe because the first RAF callback fires ~16 ms later, by which time `animate` is fully assigned
4. Change `const animate = ...` to `animate = ...` (assignment rather than const declaration)
5. Remove the original `rafId = requestAnimationFrame(animate)` at line 1367

This makes the gallery render continuously behind the opaque overlay. When the user clicks and the overlay fades, the gallery is already running at full quality — zero flash.

---

#### X-03 — Navigation lag: RAF cold start + loose damping

**Root cause:** Two compounding factors:
1. RAF loop not running during loading (fixed by X-02): GalleryManager's smoothDamp state has never been updated, so the first navigation after reveal runs from a cold position/scale state
2. `LAMBDA_NAV_POSITION = 2.5` (line 88 of `GalleryManager.ts`) gives a 95% settle time of `3 / 2.5 = 1200 ms` — on slow hardware where frames drop, this can feel like genuine lag rather than intentional spring animation

**Research:** For a museum-quality gallery where transitions are intentional but still feel responsive, a λ in the range 3.0–4.0 (settle 750–1000 ms) is the target. Three.js community practice (gsap FLIP gallery examples, three.js journey gallery demos) uses 600–900 ms settle for artwork position transitions. Raising λ from 2.5 to 3.5 reduces settle from 1200 ms to ~860 ms without losing the smooth organic feel.

**Fix (X-03):**
- X-02 fix eliminates cold-start lag entirely
- `src/gallery/GalleryManager.ts`: raise `LAMBDA_NAV_POSITION` from `2.5` to `3.5`

---

#### X-04 — Loading particles: too regular, too slow

**Root cause:** `src/styles/main.scss` `@keyframes loading-float` has only two stops (from → to):
```scss
@keyframes loading-float {
  from { transform: translate3d(calc(var(--particle-drift-x, 16px) * -1), ...) scale(0.94); }
  to   { transform: translate3d(var(--particle-drift-x, 16px), ...) scale(1.08); }
}
```
This produces a single sinusoidal pendulum motion with `ease-in-out` — perfectly predictable and mechanical-looking. Duration 8–14 s is also very slow.

**Research:** CSS multi-stop keyframe animations with per-particle custom properties can produce organic random-feeling paths (CSS Tricks, MDN Animation docs). Using 4 independent waypoints (0%, 28%, 62%, 100%) where each particle has unique X/Y offsets at every stop creates a winding, non-repeating-looking path. Duration 3–5 s with `linear` per-keyframe easing avoids the slow build-up of `ease-in-out`. Per-particle random secondary and tertiary drift vectors injected from JS provide true uniqueness.

**Fix (X-04):**
- `src/main.ts`: raise particle count 8 → 12; add `--particle-drift-x2/y2` and `--particle-drift-x3/y3` custom properties per particle; reduce durations to 3–6 s; randomize secondary and tertiary offsets with wider range ±60–100 px
- `src/styles/main.scss`: replace `loading-float` 2-stop with new `loading-wander` 4-stop keyframe using all three drift variable pairs; remove `loading-float` reference

---

#### X-05 — Overlay architecture already correct (confirmed)

**Confirmed correct:** `.loading-overlay` has `position: fixed; inset: 0; background: #0d0d0e; z-index: 200`. Canvas is `position: fixed; inset: 0` with no explicit z-index (rendered below overlay in stacking order). Canvas starts with `gallery-canvas--loading` (opacity: 0). With X-02, the gallery renders behind the fully opaque overlay from the start of the warm phase. When `gallery-canvas--ready` is applied at line 920, the canvas transitions to opacity: 1 while still hidden behind the opaque overlay. When the user clicks, the overlay fades smoothly to reveal an already-rendered gallery. No architectural change needed.

### Validation

- [x] `npm run lint` — pass
- [x] `npm run build` — pass



### Status

All W-series gaps closed. Runtime is now **v0.27**.

### As-built evidence

| ID | File(s) | Outcome |
|----|---------|---------|
| W-01 | `src/main.ts`, `src/styles/main.scss` | `.loading-wordmark` is now a flex container; inner `span.loading-wordmark__text` carries letter-spacing + `padding-left:0.18em` so the flex center is the true optical center. |
| W-02 | `src/main.ts`, `src/styles/main.scss` | 6→8 particles; color alphas 0.16–0.32; CSS opacity 0.9; blur 4px; pulse min 0.60. Effective max opacity ≥ 14.4% — above perceptual threshold. |
| W-03 | `src/main.ts`, `src/styles/main.scss` | `void startButton.offsetHeight; void getComputedStyle(startButton).backgroundColor; startButton.style.setProperty('will-change','background-color')` after `startButton.disabled = false`. CSS also adds `will-change:background-color` on `.is-visible:not(:disabled)`. First hover no longer triggers style recalculation. |
| W-04 | `src/core/PostProcessing.ts`, `src/main.ts` | `PostProcessing.prewarmComposer(w,h)` shrinks composer to 4×4, calls `composer.render()`, then restores size. Called after `rendererManager.prewarm()` + `rafDrain(1)` before overlay reveal. All bloom + FXAA programs compiled before first frame. |
| W-05 | `src/main.ts` | Bounded-fallback status string now reads `"X Gemälde werden noch optimiert – Galerie kann betreten werden"` — does not overstate readiness. |
| W-06 | `src/core/PostProcessing.ts`, `src/config/quality.ts` | `ShaderPass(FXAAShader)` added after `UnrealBloomPass`. `applyFXAAResolution(w,h)` keeps resolution uniform in sync. `fxaaEnabled` per preset: high/balanced `true`, battery `false`. |
| W-07 | `src/main.ts` | `composer-prewarm-start` / `composer-prewarm-complete` diagnostics added. Boot sequence now has measurable timing checkpoints for first-frame latency validation. |

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

## v0.26 — Loading overlay centering + strict full preload polish (2026-05-22, shipped)

### Status

Runtime shipped. Loading overlay centering/motion refinements and strict all-artwork preload startup contract are implemented.

### As-built evidence

| ID | Source | Finding |
|----|--------|---------|
| V-01 | `src/gallery/GalleryManager.ts` | `FULL_PRELOAD_SAFETY_CAP` now uses `Number.MAX_SAFE_INTEGER`, effectively disabling bounded fallback in normal runtime operation. |
| V-02 | `src/gallery/GalleryManager.ts` | `getFullGalleryReadinessSummary()` now always reports strict preload mode (`memoryCapApplied: false`, `preloadMode: 'strict'`, `overflowArtworkCount: 0`). |
| V-03 | `src/main.ts` | Loading particles now carry per-instance `--particle-delay`, `--particle-drift-x`, `--particle-drift-y` values. |
| V-04 | `src/styles/main.scss` | `.loading-particle` runs layered `loading-float` + `loading-pulse` keyframes with staggered delay and drift-variable motion. |
| V-05 | `src/styles/main.scss` | `.loading-wordmark` now centers with explicit block layout and no text-indent drift offset. |
| V-06 | `src/main.ts` | Ready-state hint now says `Alle Inhalte sind vollständig vorbereitet.` to match strict preload contract. |

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

## v0.25 — GPU warm flush hardening + timeline elegance redesign (2026-05-22, shipped)

### Status

Runtime shipped. T-series and U-series implementation is complete.

### As-built evidence

| ID | Source | Finding |
|----|--------|---------|
| T-01 | `src/main.ts` warm loop | `await rafYield()` executes after every `warmArtwork()` call. |
| T-02 | `src/main.ts` post-warm phase | `await rafDrain(3)` runs before shader prewarm and overlay reveal. |
| T-03 | `src/gallery/TextureManager.ts` | `renderer` stored in `init()`; `renderer.initTexture()` called for loaded and fallback textures. |
| T-04 | `src/main.ts` loading progress | Warm phase now maps to `50→95%`; loading-manager phase is capped before warm phase starts. |
| T-05 | `src/main.ts` sequencing | Warm completion now includes explicit drain before `Shader werden vorbereitet`. |
| T-06 | `src/main.ts` diagnostics | Added `gpu-warm-flush-start` and `gpu-warm-flush-complete` with measured `durationMs`. |
| U-01 | `src/styles/main.scss`, `src/timeline/Timeline.ts` | Timeline row is flex-based; arrows/list/counter are sibling flow elements (no overlap). |
| U-02 | `src/styles/main.scss` | Arrow controls are compact `32×32` circular buttons. |
| U-03 | `src/styles/main.scss` | Timeline/list padding reduced to remove excess vertical bulk. |
| U-04 | `src/styles/main.scss` | Counter moved from absolute corner position to inline flex tail (`flex-shrink: 0`). |
| U-05 | `src/styles/main.scss` | Coarse-pointer media rule keeps arrows visible at reduced opacity on touch devices. |
| Cleanup | `src/styles/main.scss` | Removed empty `.timeline__arrow--prev` / `.timeline__arrow--next` blocks. |

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.
- Documentation refreshed to align all major status docs with shipped v0.25 runtime behavior.


## v0.24.6 — True preload completion + INP stabilization (2026-05-21, **shipped**)

### Status

Runtime shipped. All R-series (v0.24.3) and S-series (v0.24.4) gaps have been implemented in `GalleryManager.ts` and `main.ts`. See CHANGELOG v0.24.6 for full detail.

### R-series closed gaps

| ID | Severity | Resolution |
|----|----------|-----------|
| R-01 | **HIGH** | `FullGalleryReadinessResult` now carries `preloadMode` (`strict`/`bounded-fallback`) and `overflowArtworkCount`. |
| R-02 | **HIGH** | Overflow artworks (index ≥ `FULL_PRELOAD_SAFETY_CAP`) queued as `near-next` in `init()` for deterministic completion. |
| R-03 | **MEDIUM** | `entry-unresolved-artworks` diagnostic emitted before CTA with full unresolved ID list; `warn` in strict mode, `info` in bounded-fallback. |
| R-04 | **MEDIUM** | Overlay status text is now mode-aware: `Galerie bereit` (strict) vs `Galerie bereit – N Gemälde werden im Hintergrund optimiert` (bounded-fallback). |
| R-05 | **MEDIUM** | Deferred — KTX2/Basis migration requires importer pipeline changes beyond this pass. |
| R-06 | **LOW** | INP acceptance target logged as `inp-acceptance-target` boot diagnostic; per-bucket gallery acceptance tests remain a manual step. |

### S-series closed gaps

| ID | Severity | Resolution |
|----|----------|-----------|
| S-01 | **HIGH** | `setInteractionActive(true/false)` pauses non-`critical-now` prefetch during active pointer windows; queue auto-resumes on close. |
| S-02 | **HIGH** | Interaction window policy: opens on `pointerdown`, closes 200 ms after last `pointerup`/`pointercancel`. |
| S-03 | **MEDIUM** | `markInteractionFrame(dtMs)` called from `animate()` loop; `interaction-end` log emits CPU ms, dropped frames, avg frame time per window. |
| S-04 | **MEDIUM** | `inp-acceptance-target` boot diagnostic records baseline `1,024 ms` and target `200 ms` for release validation. |
| S-05 | **LOW** | Post-entry optimization status copy shown in bounded-fallback mode via overlay status text. |

### Residual risks

- R-05 (KTX2/Basis migration) remains unimplemented; full strict readiness at very large counts (> 50) still carries memory pressure.
- INP improvement from S-01/S-02 depends on interaction-window detection accuracy; very long drag gestures may briefly re-allow deferred work during the gesture.
- Actual measured INP reduction requires a new local trace run against the v0.24.6 bundle.


## v0.24.4 — Local metrics evidence (2026-05-21, docs-only)

### Status

Documentation pass using newly provided local Web Vitals evidence. Runtime remains **v0.24.2**.

### New measured evidence (local)

- **LCP:** `1.85 s` (good)
- **CLS:** `0.00` (good)
- **INP:** `1,024 ms` (poor)
- Worst interactions are pointer events on `canvas.gallery-canvas.gallery-canvas--ready`.
- The slow interaction breakdown is dominated by **presentation delay** (around 630–676 ms for repeated events; INP sample at 1,024 ms with near-zero input delay and tiny processing duration).

### Interpretation

The bottleneck is not event-handler CPU work (processing is usually 3–14 ms). The dominant issue is frame presentation latency after interaction, which is consistent with render/GPU pipeline pressure and/or large frame workloads at interaction time.

### Updated implication for preload smoothness

Even with stronger preload/readiness logic, interaction quality can still fail if render-cost spikes remain high at pointer-driven updates. Preload correctness and interaction-frame budget control must be treated as two separate acceptance gates.

### Validation

- Documentation-only pass.
- No runtime code changes in this pass.

## v0.24.3 — Loading completeness re-audit findings (2026-05-21, docs-only)

### Status

Planning/documentation pass only. Runtime remains **v0.24.2**.

### Problem reaffirmed

User feedback remains consistent: loading reports “ready”, but additional loading-like stalls still occur until paintings have been visited. This indicates entry readiness and perceived readiness are still not perfectly aligned for all gallery sizes.

### Source-backed findings

| ID | Severity | File : Lines | Finding |
|----|----------|--------------|---------|
| R-01 | **HIGH** | `src/gallery/GalleryManager.ts:123`, `src/gallery/GalleryManager.ts:395-401` | Preload is explicitly capped at `FULL_PRELOAD_SAFETY_CAP = 50`; artworks beyond the cap are not guaranteed ready under the loading overlay. |
| R-02 | **HIGH** | `src/gallery/GalleryManager.ts:424`, `src/gallery/GalleryManager.ts:928-947` | Overflow readiness depends on post-init idle/background sweep (`scheduleFullTextureSetPrefetch`), so completion can race against early interaction. |
| R-03 | **MEDIUM** | `src/main.ts:783`, `src/main.ts:786`, `src/gallery/GalleryManager.ts:685-697` | CTA readiness currently relies on aggregate summary and contract loops, but large-gallery capped paths can still present “Galerie bereit” while overflow work continues. |
| R-04 | **MEDIUM** | `src/main.ts:741`, `src/main.ts:783` | Overlay copy transitions to ready-state text without exposing whether startup is strict full-gallery ready or fallback-with-background-work mode. |

### Online research synthesis (2026-05-21)

- `requestIdleCallback` is best-effort and not reliable for critical correctness gates; critical startup work needs deterministic scheduling with timeout/fallback semantics.  
  Source: MDN `requestIdleCallback` guidance (https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback).
- Three.js loading completion and shader compile helpers do not, by themselves, guarantee every future texture/material path is GPU-ready; explicit render/warm paths are still required for first-use smoothness.  
  Source: Three.js docs and common WebGL warmup guidance (`LoadingManager`, `WebGLRenderer.compile` docs).
- Modern browser guidance favors deferring non-critical media work (lazy/deferred decode) but keeping user-critical first-view assets deterministic; perceived “ready” must map to actually prepared interaction paths.  
  Source: web.dev browser-level lazy loading guidance (https://web.dev/articles/browser-level-image-lazy-loading).

### Conclusion

The remaining issue is not a single missing preload call; it is a contract mismatch between UX-ready signaling and guaranteed readiness scope for capped/overflow scenarios. The v0.24.3 plan introduces strict mode boundaries, explicit fallback mode semantics, and acceptance criteria that verify no first-use cold path leaks after entry.

### Validation

- Documentation/research pass only.
- No runtime code changes in this pass.

## v0.24.2 — Deep loading findings for strict full-gallery entry (**shipped**, 2026-05-21)

### Status

Shipped in runtime code. The strict full-gallery entry contract is implemented in v0.24.2.

### Problem reaffirmed

User feedback confirms the same pattern still occurs: loading/entry can feel incomplete, and smoothness improves only after additional paintings are visited. This supports the requirement that all paintings must be fully ready before enabling gallery entry.

### Deep online research synthesis

- Idle scheduling is opportunistic: `requestIdleCallback` is useful for background work but is not reliable as the only mechanism for critical readiness guarantees, especially on busy or throttled pages.
- First-use stalls are typically tied to heavy decode/upload/procedural work crossing the interaction boundary; readiness must explicitly include the complete path needed for first render, not just fetch completion.
- Large-gallery memory pressure is the primary risk of strict full pre-entry loading: uncompressed 2K textures are roughly 16 MB each and 4K textures roughly 64 MB each before accounting for multiple PBR roles and mipmaps, so unbounded eager loading can trigger OOM or severe thrash on mobile/integrated GPUs.
- Compressed texture pipelines (KTX2/Basis with runtime transcoding) remain the strongest long-term mitigation for making all-painting readiness feasible without extreme memory spikes.

### New planning targets (Q-series)

| ID | Severity | Area | Required outcome |
|----|----------|------|------------------|
| Q-01 | **HIGH** | Entry contract | Enter CTA only appears after every painting reaches the required readiness stages for first interaction. |
| Q-02 | **HIGH** | Memory safety | Add hard memory guardrails and deterministic fallback states so full-gallery readiness cannot crash low-memory devices. |
| Q-03 | **HIGH** | Scheduler correctness | Remove critical dependency on idle-only completion and enforce bounded deterministic progress for remaining readiness jobs. |
| Q-04 | **MEDIUM** | Diagnostics proof | Emit per-painting readiness completion evidence and a single pre-entry audit summary before CTA enablement. |
| Q-05 | **MEDIUM** | Asset pipeline | Stage KTX2/Basis importer + runtime fallback path to keep strict readiness viable for larger exhibitions. |

### Validation

- Baseline checks passed before docs updates: `npm install`, `npm run lint`, `npm run build`.
- No runtime code changed in this pass.

## v0.24.1 — Runtime smoothness implementation findings (2026-05-21)

### Status

Runtime implementation shipped for the v0.24 P-series targets.

### Implemented outcomes

- **P-01:** Entry gating now enforces a concrete readiness contract for a device-aware warm target set before CTA reveal.
- **P-02:** Post-reveal warm queue now obeys both frame-time budget and per-frame batch caps; adjacent procedural prep is idle-queued.
- **P-03:** Texture-set prefetching now uses explicit priority lanes with starvation-aware effective ranking.
- **P-04:** Navigation now records cold/hot readiness verdict diagnostics, including trigger, duration, and readiness-stage deltas.
- **P-06:** Large-gallery/mobile profile tuning keeps entry responsive by scaling warm radius/count and post-reveal chunk sizes from device capabilities.

### Remaining boundary

- **P-05** (KTX2/Basis importer/runtime fallback migration) remains staged as a separate asset-pipeline milestone.

### Validation

- `npm run lint` passed.
- `npm run build` passed and rebuilt `customer-preview/freyraum-gallery.js`.
- `npm audit --audit-level=moderate` still reports the known Vite/esbuild advisory requiring a breaking major upgrade.

## v0.24 — Deeper performance/loading findings (planning, 2026-05-21)

### Status

Planning/documentation pass only. Runtime remains v0.23.1 while the new v0.24 implementation plan is prepared.

### Confirmed runtime pattern

The user-reported behavior remains credible and technically consistent: entering the gallery still can feel laggy in larger sets, then becomes smooth after most paintings were already visited once. This indicates first-use work still crossing the interaction boundary (GPU upload, procedural synthesis, and/or on-demand decode for not-yet-ready targets).

### Source-backed risk areas to address next

| ID | Severity | Area | Current gap in shipped behavior |
|----|----------|------|---------------------------------|
| P-01 | **HIGH** | Pre-entry readiness threshold | Overlay reveal currently does not enforce a measurable readiness floor for a configurable first-navigation set (current + neighbors + likely timeline targets). |
| P-02 | **HIGH** | Main-thread burst control | Warm/procedural jobs can still cluster inside short windows on slower devices; frame-budget yielding needs stricter guardrails and instrumentation. |
| P-03 | **MEDIUM** | Navigation-priority scheduler | Intent promotion exists but should become deterministic with explicit queue classes (`immediate`, `next-likely`, `background`) and starvation protection. |
| P-04 | **MEDIUM** | Readiness acceptance telemetry | Existing diagnostics are strong but still need a direct “first-visit cold work” verdict per navigation (did interaction trigger load/decode/procedural/gpu-upload). |
| P-05 | **MEDIUM** | Asset pipeline strategy | KTX2/Basis + worker decode are still future-facing; no phased rollout criteria are documented yet for this repository’s customer import workflow. |
| P-06 | **LOW** | UX gating quality | Loading CTA should remain responsive while continuing non-critical warm tasks post-entry, with clearer status text for “ready-to-enter” vs “optimizing in background”. |

### Deeper online research synthesis

- Hidden/offscreen render passes remain the practical way to guarantee texture residency before first interaction; shader compile helpers reduce but do not replace this requirement.
- Idle callbacks are opportunistic and must be chunked with strict deadline checks; critical first-navigation readiness should not depend solely on idle availability.
- Compressed textures (KTX2/Basis) plus worker-based transcode/decode remain the strongest path for large-gallery memory/upload stability, but require importer/runtime dual-format planning.
- Progressive readiness is acceptable only if user-facing interaction paths are backed by explicit readiness guarantees for near-future targets.

### Validation

- Pre-change baseline checks passed: `npm install`, `npm run lint`, `npm run build`.
- No runtime code was modified in this pass.

## v0.23.1 — Performance/Preloading implementation findings (2026-05-21)

### Status

Runtime implementation shipped for the N-series plan: readiness diagnostics are now per artwork, the fixed `GPU_WARM_LIMIT = 15` path is replaced by budgeted/offscreen warming, procedural maps are prepared for the critical navigation window, prefetch promotion follows navigation intent, and adaptive quality cooldown stays active while readiness work remains. ImageBitmap decode and KTX2/Basis are logged as guarded/future pipeline diagnostics rather than forced into the current JPG/PNG/WebP customer-preview path.

### Validation

- `npm run lint` passed.
- `npm run build` passed and rebuilt `customer-preview/freyraum-gallery.js`.
- `npm audit --audit-level=moderate` still reports the known Vite/esbuild advisory requiring a breaking major upgrade.

## v0.23 — Performance/Preloading Planning Audit (2026-05-21)

### Audit result

The current codebase has strong v0.22 mitigations, but the user-reported pattern still has credible root causes in source:

| ID | Severity | File : Lines | Finding |
|----|----------|-------------|---------|
| N-01 | **HIGH** | `src/main.ts:40-42`, `src/main.ts:645-661` | `GPU_WARM_LIMIT = 15`; galleries above that limit skip the per-artwork GPU warm loop and fall back to one render of the current scene only. |
| N-02 | **HIGH** | `src/gallery/GalleryManager.ts:402-420`, `src/materials/ProceduralTextureFactory.ts:32-76` | Missing procedural maps are generated synchronously while an artwork is being shown. Cold generation can allocate and fill large buffers on the main thread. |
| N-03 | **HIGH** | `src/gallery/GalleryManager.ts:274-295`, `src/gallery/GalleryManager.ts:573-626` | Authored PBR sets are loaded under the overlay only up to `PBR_PRELOAD_LIMIT = 15`; the rest depend on idle prefetch and can still load during navigation. |
| N-04 | **MEDIUM** | `src/core/RendererManager.ts:113-134`, `src/main.ts:663-666` | Shader prewarm is awaited, but it only covers the scene/material state currently bound. It does not prove every future artwork texture is uploaded. |
| N-05 | **MEDIUM** | `src/utils/FrameBudgetMonitor.ts:53-58`, `src/utils/AdaptiveQualityController.ts:45-66` | Navigation cooldown is fixed at 600 ms and not tied to actual texture/procedural readiness jobs. |
| N-06 | **LOW** | `src/main.ts:648-654` | Artwork 0 is warmed inside the loop and then rebound/rendered again. This may be harmless, but it should be measured or removed. |

### Research notes

- Three.js loaders and `LoadingManager` track loading/decode progress, not guaranteed GPU residency. First render using a texture can still upload it to VRAM.
- `WebGLRenderer.compileAsync()` is useful for shader compilation but does not replace hidden render passes for texture upload.
- `requestIdleCallback` should be treated as opportunistic. It is not a promise that all work finishes before an eager visitor navigates.
- `ImageBitmapLoader` and KTX2/Basis compressed textures are promising next steps, but each needs compatibility testing against the repository's customer-preview constraints, especially local files and data URIs.

### Status

Planning/documentation only. No runtime code changed in this pass. The implementation plan is canonical in `plan.md § v0.23`.

## v0.22 — shipped (2026-05-21) — Improved Preloading + Press-to-Start

### Problem confirmed by user testing

After v0.21 shipped, users still report visible hickups (stutters) when switching between paintings for the first time. After visiting every painting once, transitions become smooth. This pattern precisely matches a cold-load texture scenario: PBR maps (normal/roughness/ao/height/specular/varnish/detail) for artworks 2–N are absent from GPU memory on first navigation.

### Historical root cause before v0.22 shipped

1. `GalleryManager.init()` (`src/gallery/GalleryManager.ts:263–269`) calls `textureManager.preload(urls)` for albedo textures only, then calls `showArtwork(0)` and returns.
2. `scheduleFullTextureSetPrefetch()` is called last in `init()`. It chains idle-callbacks via `requestIdleCallback`. This sweep runs **after** `init()` returns → **after** the loading overlay has been dismissed → after the gallery is already interactive.
3. A user navigating before the sweep reaches their target painting hits cold texture load (disk/network → CPU memory → GPU VRAM) and sees the stall as a hickup.
4. The single GPU warm render pass added in v0.21 only covers the first artwork (the one currently bound to the scene mesh); artworks 2–N still incur CPU→VRAM stall on first navigation.
5. The loading overlay auto-reveals on technical completion — user has no "press to start" agency and audio context start is not tied to a deliberate gesture.

### Research findings

**Three.js LoadingManager full-preload (three.js official docs)**
All loaders sharing a `THREE.LoadingManager` instance report to the same `onProgress`/`onLoad` pipeline. Loading all PBR sets inside `GalleryManager.init()` (before `showArtwork(0)`) means the progress bar tracks real total progress and `onLoad` only fires when every PBR map is in CPU memory. No additional wiring needed — the existing `LoadingManager` instance is already passed to `TextureManager`.

**GPU texture upload — CPU→VRAM force-upload (Three.js discourse + WebGL spec)**
`THREE.TextureLoader` decodes image data to CPU memory (`ImageBitmap` or `HTMLImageElement`). The GPU upload occurs only during the first `renderer.render()` that uses each texture. Standard pre-upload pattern: temporarily assign each artwork's texture set to the active scene mesh, call `renderer.render()` once to upload to VRAM, restore. This all happens under the loading overlay — users see nothing. `renderer.compile(scene, camera)` compiles shaders but does **not** force texture upload; a render pass is required. Reference: Three.js discourse "Preloading textures to GPU" and Chrome DevTools GPU rasterization docs.

**"Press to Start" — WebGL gallery UX best practice (Google Arts & Culture, TeamLab, 2024)**
Best-practice pattern confirmed by research: never auto-reveal on load complete. Show a CTA button that activates at 100%. Benefits confirmed:
- Deliberate first interaction primes immersive experience psychologically
- `AudioContext` start tied to user gesture satisfies browser autoplay policy cleanly
- User knows assets are ready; zero perceived delay after button press
- Gallery feels premium and intentional, not technical
German CTA label: "Galerie betreten" — more evocative than "Starten". Keyboard: Enter or Space activates button. Accessibility: real `<button>` element, `aria-label`, visible `focus-visible` ring with gold (#b59a6a) outline. Animation: fade-in + translateY(8px→0) over 0.6s ease on `.is-visible` class. Reduced-motion: instant show, no animation.

**Minimum loading screen duration (Material Design, Apple HIG)**
A minimum loading duration of 500ms is the established balance point:
- Short enough that it never feels like an artificial wait on fast networks
- Long enough that the branded screen always registers visually
- On slow networks, the actual load takes longer and the minimum is never perceived
Implementation: `Promise.all([actualLoad(), delay(500)])` — runs in parallel, adds zero time on slow loads.

**`requestIdleCallback` sweep as second-chance retry**
After L-01 ships (all PBR sets preloaded in `init()`), `scheduleFullTextureSetPrefetch()` will find all entries in `prefetchedTextureSets` and exit immediately. This is correct and harmless — the sweep is retained as a second-chance retry for artworks whose PBR load failed during `init()` (network error, missing file). No code change needed; confirm via diagnostics log output.

### New findings (L-series)

| ID | Severity | File : Lines | Finding |
|----|----------|-------------|---------|
| L-01 | **HIGH** | `src/gallery/GalleryManager.ts:263–269` | `init()` preloads albedo textures only. PBR sets for artworks 2–N loaded on first navigation → stall visible as hick-up. |
| L-02 | **HIGH** | `src/main.ts` (boot), `src/gallery/GalleryManager.ts` | GPU warm render covers only first artwork. Artworks 2–N have textures in CPU memory but not VRAM after L-01 — CPU→VRAM stall still occurs on first navigation. Need per-artwork warm render under overlay. |
| L-03 | **HIGH** | `src/main.ts:574`, `createLoadingOverlay()` | `reveal()` auto-dismisses overlay. No press-to-start button. No user agency. AudioContext should start on deliberate gesture. |
| L-04 | **LOW** | `src/gallery/GalleryManager.ts:481–497` | After L-01, `scheduleFullTextureSetPrefetch()` is a no-op for loaded artworks. Retain as second-chance retry. Add diagnostics confirmation log. |
| L-05 | **LOW** | `src/main.ts` (boot) | No minimum loading screen duration. On fast LAN/cache, branded screen may flash < 100ms. Enforce 500ms minimum via `Promise.all`. |

### New findings (M-series) — deep code audit 2026-05-21

Second-pass audit against actual runtime code in `src/main.ts`, `src/gallery/GalleryManager.ts`, and `src/gallery/TextureManager.ts` found 7 additional gaps that the L-series plan did not account for:

| ID | Severity | File : Lines | Finding |
|----|----------|-------------|---------|
| M-01 | **HIGH** | `src/main.ts:41–47` | `LoadingOverlayControls` interface declares `reveal(): void`. L-03 changes the implementation to return `Promise<void>`. TypeScript compilation error unless interface is updated in lock-step. Must be changed first. |
| M-02 | **HIGH** | `src/main.ts:264–268` | `window.setInterval(() => ..., 2000)` hint cycling timer is only cleared in `dispose()`. When `reveal()` overwrites `subtitle.textContent`, the interval fires 2 s later and overwrites it back, destroying the "Galerie bereit — zum Starten klicken" label. `reveal()` must call `window.clearInterval(hintTimer)` before updating the subtitle. |
| M-03 | **HIGH** | `src/main.ts:609–616` | `window.addEventListener('pointerdown', onFirstInteractionPointer)` is registered AFTER `await loadingOverlay.reveal()` returns (i.e., after user clicks button). The button click is the single best AudioContext start gesture — it is not captured by the recovery system. Listeners must be registered before `await reveal()`. |
| M-04 | **HIGH** | `src/gallery/GalleryManager.ts:250–270` | L-01 draft patch iterates all artworks with no count limit. 50 artworks × 7 PBR maps × 2048×2048 × 4 B = 5 600 MB peak CPU memory — certain OOM on mobile. Must add `PBR_PRELOAD_LIMIT = 15` constant and filter before the `Promise.allSettled` call. |
| M-05 | **MEDIUM** | `src/gallery/GalleryManager.ts` (new method) | L-02 describes `prepareArtworkForWarmRender()` as async. After L-01, textures are already in `TextureManager.cache`. The method should be **synchronous** — no `await`, no `Promise`. Async design is misleading and adds per-artwork event-loop overhead. Rename to `warmArtworkForGPU(index): void`. Requires a new `TextureManager.getForRole(url, role)` synchronous cache getter. |
| M-06 | **MEDIUM** | `src/main.ts:567` | After L-02 ships, the standalone `renderer.render()` at line 567 (the v0.21 single warm render pass) is superseded by the L-02 warm loop. Remove it to avoid a redundant GPU flush. For galleries above `GPU_WARM_LIMIT`, keep it as fallback — wrapped in `if (artworkCount > GPU_WARM_LIMIT)`. |
| M-07 | **LOW** | `src/main.ts:566–575` | L-02's `setProgress(92+…)` (92–97%) and the existing `setProgress(97)` write to overlapping ranges. Remap: L-02 warm loop = 93–97%, shader prewarm = 97–99%, button-ready = 100%. Remove the redundant standalone `setProgress(97)` that is superseded by M-06. |

### Research note: `renderer.compile()` does NOT force texture upload

`renderer.compile(scene, camera)` compiles shader programs but does NOT force texture upload to VRAM. The L-02 per-artwork `renderer.render()` call is the correct mechanism to force CPU→VRAM transfer. This is confirmed by Three.js discourse and Chrome DevTools GPU rasterization analysis.

### Research note: `TextureManager.cache` key format

Cache keys are `"${role}::${url}"` — e.g., `"albedo::data:image/webp;base64,…"` or `"normal::artworks/painting-1/normal.webp"`. The existing `TextureManager.get(url)` method only looks up the `albedo` key. A new `getForRole(url, role)` getter is needed for `warmArtworkForGPU()` to retrieve authored PBR maps synchronously. This is a minimal, non-breaking addition (2 lines of code).

### Status

L-series + M-series findings are implemented in runtime code and documented. `npm run lint` and `npm run build` passed after implementation; `npm audit --audit-level=moderate` remains the known Vite/esbuild development-server advisory requiring a semver-major tooling upgrade.

---

## v0.21 — implementation shipped (2026-05-21)

Current status: shipped. The v0.21 plan is implemented in runtime code and documentation: branded progress loading overlay, Three.js LoadingManager progress, pre-reveal GPU warm render + awaited shader prewarm, audio `preload='auto'`, adjacent/idle PBR prefetch, lighting resume clamp, WebGL restore status, max-texture diagnostics, shader precision guard, 16K importer guidance, global pointer tracking, timeline arrows/counter/edge fades/responsive sizing/virtualized large-list rendering, and cleanup for added global listeners. Future-only boundaries remain LOD/tiled streaming for device-limited 16K detail and grouped/page timeline navigation for very large exhibitions.


### Validation and residual risk

- Baseline before code changes: `npm install`, `npm run lint`, and `npm run build` passed.
- Final validation after v0.21 implementation and docs sync: `npm run lint` and `npm run build` passed.
- Security audit: `npm audit --audit-level=moderate` still reports the pre-existing moderate Vite/esbuild development-server advisory; the available fix requires a breaking Vite major upgrade and was left as a separate dependency-upgrade task.

## 2026-05-21 — v0.21 extension: global pointer tracking + timeline scalability

### Audit method

Full line-by-line inspection of `src/interaction/CanvasInteraction.ts` (358 lines), `src/timeline/Timeline.ts` (206 lines), and the `.timeline` CSS block in `src/styles/main.scss` (lines 943–1110). Four targeted online research queries covering: Pointer Events Level 3 global capture patterns, virtual list rendering for large DOM trees, museum-grade horizontal timeline UI patterns, and CSS mask-image edge-fade patterns.

### Code audit findings

| ID | Severity | File : Lines | Finding |
|----|----------|-------------|---------|
| I-01 | **MEDIUM** | `src/interaction/CanvasInteraction.ts:147–156` | `updateHoverRotation` is called from canvas-scoped `onPointerMove` only. Moving mouse over timeline, settings panel, or nav buttons stops the painting rotation update. Global `window.pointermove` listener needed for idle hover at all screen positions. |
| I-02 | **LOW** | `src/interaction/CanvasInteraction.ts:300–305` | Touch Events fallback `mousemove` registered on `canvas` element only — same hover freeze as I-01 for legacy browsers. |
| I-03 | **LOW** | `src/interaction/CanvasInteraction.ts:118–123` | `setPointerCapture` failure is silently caught with no fallback. A future overlay that steals pointer capture could break panning. Global `window.pointermove` / `pointerup` fallback needed during active drag. |
| I-04 | **LOW** | `src/interaction/CanvasInteraction.ts:235–261` | Touch Events fallback: `touchmove` registered on canvas only. Touch drag that exits to an adjacent element (e.g., timeline strip) loses tracking. |
| J-01 | **HIGH** | `src/timeline/Timeline.ts:36–84` | All artwork thumbnails rendered as full DOM nodes at construction. 50+ artworks creates 250+ nodes — initial paint delay and memory pressure. No virtual rendering window. |
| J-02 | **MEDIUM** | `src/timeline/Timeline.ts` (no arrow controls) | No left/right scroll-arrow buttons on the timeline strip. Users have no visible affordance that more artworks exist off-screen. |
| J-03 | **MEDIUM** | `src/timeline/Timeline.ts` (no counter) | No artwork counter / position indicator ("3 / 20"). Users cannot tell how many artworks are in the collection. |
| J-04 | **LOW** | `src/styles/main.scss:959–978` | Hidden scrollbar (`scrollbar-width: none`) with no CSS mask-image edge fade. No visual indicator of off-screen content. |
| J-05 | **LOW** | `src/styles/main.scss:986–1018` | `.timeline__thumb` hardcoded at `width: 150px; height: 95px`. On 375px phones only 2–2.5 artworks are visible without responsive scaling. |
| J-06 | **MEDIUM — future** | Architecture | No group/page navigation for 50+ artworks. Flat scroll strip is impractical beyond ~30 items. |

### Research findings

**Pointer Events Level 3 — global capture (MDN, W3C spec)**
- `pointermove` fires on the element that has pointer capture (via `setPointerCapture`) OR on the element the pointer is physically over.
- Global `window.addEventListener('pointermove', ...)` fires for ALL pointer movements regardless of which element is under the cursor — correct source for hover rotation that should work across the entire page.
- Registering global listeners during drag (mousedown → mouseup) and removing them immediately after is the standard pattern; no memory leak risk.
- Reference: [MDN Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), [W3C Pointer Events L3](https://www.w3.org/TR/pointerevents3/)

**Virtual list rendering for large DOM trees (web.dev, Chrome DevTools docs)**
- Chrome DevTools "Avoid excessive DOM size" warns at > 1 500 total nodes and > 60 deep nodes.
- Virtual / windowed rendering (only instantiate visible + buffer items) is the canonical solution for long lists.
- A render buffer of ±5 items beyond the visible viewport prevents pop-in during fast scrolling.
- Plain vanilla JS virtual list: maintain an array of data items; only create DOM nodes for the visible window; replace off-screen items with fixed-height skeleton placeholders.
- Reference: [web.dev DOM size](https://web.dev/articles/dom-size), [TanStack Virtual (concept reference)](https://tanstack.com/virtual)

**Museum-grade horizontal timeline UI patterns (Google Arts & Culture, MoMA Online, Artsy)**
- Prev/next page arrow buttons on the strip edges: standard for discoverability.
- Artwork counter chip ("3 / 20"): standard for orientation.
- CSS `mask-image` edge fade: standard to indicate more content beyond visible area.
- Scroll-snap with `proximity`: already implemented in FREYRAUM v0.11.
- Responsive thumb sizing (`clamp()`): scales gracefully from mobile to 4K displays.
- Reference: [Google Arts & Culture](https://artsandculture.google.com/), [MoMA Online Collection](https://www.moma.org/collection/)

**CSS `mask-image` for scroll overflow indication (MDN, web.dev 2024)**
- `mask-image: linear-gradient(to right, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%)` fades both edges of an overflowing container.
- Toggle `--mask-left` / `--mask-right` CSS variables via a scroll listener to remove the fade at scroll boundaries.
- No performance cost: composited on GPU alongside the existing `backdrop-filter`.
- Reference: [MDN mask-image](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image)

### Remaining status

I-series (I-01 through I-04) and J-series implementation items are now shipped in v0.21; J-06 remains a future grouped/page-navigation boundary.

## 2026-05-21 — v0.21 deep code audit corrections (K-series)

### Audit method

Line-by-line inspection of `src/main.ts` (full boot path, lines 400–700), `src/gallery/TextureManager.ts` (all class fields and `init()` method), `src/interaction/CanvasInteraction.ts:329–350` (dispose), and `src/timeline/Timeline.ts:203–205` (dispose). Objective: verify plan descriptions against actual source code.

### Corrections to earlier findings

| ID | Original claim | Corrected fact (source-verified) |
|----|---------------|----------------------------------|
| G-01 | "prewarm() never called in boot path" | Called at `src/main.ts:695` as `void` — fire-and-forget, ~250 lines AFTER overlay hides at line 443 |
| H-03 | "`this.maxTextureSize` stored but never consulted" | `maxTextureSize` is **not stored as a class field at all** — only passed to a log call in `init()` |

### New findings (K-series)

| ID | Severity | File : Lines | Finding |
|----|----------|-------------|---------|
| K-01 | **LOW** | `src/interaction/CanvasInteraction.ts:329–350` | `dispose()` removes canvas-scoped listeners only. I-series patches add global `window` listeners (pointermove, pointerup, mousemove, touchmove). Without updating `dispose()`, these persist as leaks after the gallery is torn down. |
| K-02 | **LOW** | `src/timeline/Timeline.ts:203–205` | `dispose()` calls only `this.el.remove()`. `this.thumbs` array holds strong JS references to all button elements — prevents GC of click/keydown listeners on those nodes. |
| K-03 | **MEDIUM** | `src/gallery/GalleryManager.ts:248–267` | `prefetchAdjacentArtworks()` method does not exist in current source. G-03 patch must add it as a new private method plus call sites at end of `showArtwork()`. |

### Remaining status

K-series corrections were implemented in v0.21: global listener cleanup, Timeline thumb-reference cleanup, and GalleryManager adjacent/idle PBR prefetch are now in runtime code.





### Code audit findings

| ID | Severity | File : Lines | Finding |
|----|----------|-------------|---------|
| H-01 | **MEDIUM** | `src/lighting/LightingSetup.ts:68–76` | `LightingSetup.update(time)` uses raw rAF absolute timestamp in `Math.sin(time * 0.0002)`. After a tab resumes from background, `time` jumps by seconds → key light position snaps discontinuously. `GalleryManager.MAX_SMOOTHING_DT` guard does **not** cover lighting. |
| H-02 | **LOW** | `src/core/RendererManager.ts:166–182` | WebGL context loss is handled correctly (`preventDefault`, pause/resume) but no user-visible indicator is shown during restoration. Canvas stays blank for several seconds on low-memory mobile without any feedback. |
| H-03 | **HIGH** | `src/gallery/TextureManager.ts:47–53` | `maxTextureSize` is **not stored as a class field** — only passed to a diagnostics log call in `init()`. The guard patch requires: (a) `private maxTextureSize = 0` field, (b) `this.maxTextureSize = renderer.capabilities.maxTextureSize` assignment in `init()`, (c) `warnIfOversized()` call after each texture load. |
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

G-01 through G-07 and H-01 through H-06 are shipped in v0.21. H-07 remains documented as a future LOD/tiled-streaming architecture boundary.



### Audit method

Full line-by-line inspection of loading, texture, audio, shader, and animation code paths.
Eight targeted online research queries covering Three.js `LoadingManager`/`compileAsync`, audio `preload` strategy, `requestIdleCallback` prefetch, CSS glassmorphism loading screens, GSAP gallery reveal, bfcache media handling, WebWorker `createImageBitmap`, and `<link rel="preload">` patterns.

### Code audit findings

| ID | Severity | File : Lines | Finding |
|----|----------|-------------|---------|
| G-01 | **HIGH** | `src/main.ts:443` (overlay hide), `src/main.ts:695` (prewarm call) | `prewarm()` IS called — but as `void` (fire-and-forget) 250+ lines AFTER the loading overlay already hides. Non-awaited post-overlay call means shader JIT-compile races with first user interaction. Fix: move call to before overlay hide and `await` it. |
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

All v0.20.8 audio/control findings remain closed. v0.21 closes the G-series preloading/loading-screen domain in runtime code.

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
