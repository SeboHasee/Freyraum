import { createScopedDiagnostics } from '../utils/Diagnostics';
import type { PreferencesStore } from '../utils/preferences';
import type { NavigationControls } from './NavigationControls';

/**
 * Clean Chrome: auto-hide the artwork information and navigation controls.
 *
 * The timeline remains fixed and visible. This manager centralises reveal/hide
 * logic for the left info panel and navigation controls. Panels reveal on
 * pointer proximity to the relevant screen edge, on keyboard focus, or on an
 * explicit touch tap, and hide again after a dwell delay. The design satisfies
 * WCAG 2.2 SC 1.4.13 (Content on Hover or Focus): the hide timer never starts
 * while the pointer is inside a panel (hoverable), Escape dismisses without
 * moving the pointer (dismissible), and content persists until the pointer and
 * focus leave both the trigger zone and the panel (persistent).
 *
 * All listeners are passive so the handler can never block scrolling. The
 * `alwaysShowChrome` preference disables auto-hide entirely.
 */

// ─── Configuration Constants ─────────────────────────────────────────────────
// Exported so callers can inspect or override them at instantiation time.
export const CHROME_CONFIG = {
  /** px from the left edge of the viewport that triggers info-panel reveal */
  INFO_PANEL_TRIGGER_BAND_PX: 120,

  /** Bottom band (px) that triggers nav-controls reveal. */
  NAV_TRIGGER_BAND_PX: 220,

  /** ms after the pointer leaves ALL trigger zones before a panel hides */
  HIDE_DELAY_MS: 2500,

  /** ms after nav leaves trigger zone before hiding (slightly faster than panels) */
  NAV_HIDE_DELAY_MS: 2000,

  /** ms a touch-revealed panel stays visible before auto-hiding */
  TOUCH_REVEAL_DURATION_MS: 4000,

  /** ms a force-revealed panel stays visible (e.g. after navigation) */
  FORCE_REVEAL_DURATION_MS: 3200,

  /** Dead zone: touch events starting within this distance of the left edge
   *  are ignored to avoid conflict with the iOS system back-swipe gesture. */
  IOS_EDGE_DEAD_ZONE_PX: 22,

  /** Touch hit area for the left-edge peek: max x considered a "left tap". */
  INFO_PANEL_TOUCH_MAX_PX: 80,
} as const;

// ─── Type Definitions ────────────────────────────────────────────────────────
export type PanelId = 'info-panel' | 'nav-controls';
export type RevealReason = 'proximity' | 'focus' | 'touch' | 'forced' | 'preference' | 'hint' | 'keyboard';
export type ChromeMode = 'clean' | 'visible';

interface PanelState {
  id: PanelId;
  el: HTMLElement;
  /** Human-readable label announced to screen readers. */
  label: string;
  revealed: boolean;
  reason: RevealReason | null;
  hideTimerId: ReturnType<typeof setTimeout> | null;
  focusActive: boolean;
  pointerInZone: boolean;
  pointerInPanel: boolean;
  // Bound, per-panel DOM listeners (kept for removeEventListener on dispose).
  onFocusIn: () => void;
  onFocusOut: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export interface ChromeVisibilityManagerOptions {
  /** Called when a panel's revealed state changes (for external observers). */
  onRevealChange?: (panelId: PanelId, revealed: boolean, reason: RevealReason | null) => void;
  /** Override any CHROME_CONFIG value at instantiation time. */
  config?: Partial<typeof CHROME_CONFIG>;
}

// ─── Main Class ──────────────────────────────────────────────────────────────
export class ChromeVisibilityManager {
  private readonly diag = createScopedDiagnostics('chrome-visibility');
  private readonly config: typeof CHROME_CONFIG;
  private readonly options: ChromeVisibilityManagerOptions;

  private readonly infoPanelEl: HTMLElement;
  private readonly prefs: PreferencesStore;
  private readonly appRoot: HTMLElement;

  // DOM elements created and owned by this manager.
  private infoPanelPeekHit: HTMLElement | null = null;
  private srStatusEl: HTMLElement | null = null;

  // Per-panel state (a Map so future panels can be registered dynamically).
  private readonly panels = new Map<PanelId, PanelState>();

  // Bound global handler references (needed for removeEventListener).
  private readonly boundOnPointerMove: (e: PointerEvent) => void;
  private readonly boundOnPointerDown: (e: PointerEvent) => void;
  private readonly boundOnKeyDown: (e: KeyboardEvent) => void;
  private readonly boundOnViewportLeave: () => void;
  private unsubscribePrefs: (() => void) | null = null;
  private initialised = false;

  // v0.63 — Post-hint affordance "settle" phase timer. Briefly elevates the
  // salience of the idle peek strips/chevrons after the nav onboarding hint
  // completes, then decays back to the resting peek-pulse floor.
  private settleTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    infoPanelEl: HTMLElement,
    prefs: PreferencesStore,
    appRoot: HTMLElement,
    options: ChromeVisibilityManagerOptions = {}
  ) {
    this.infoPanelEl = infoPanelEl;
    this.prefs = prefs;
    this.appRoot = appRoot;
    this.options = options;
    this.config = { ...CHROME_CONFIG, ...options.config };

    this.boundOnPointerMove = this.onPointerMove.bind(this);
    this.boundOnPointerDown = this.onPointerDown.bind(this);
    this.boundOnKeyDown = this.onKeyDown.bind(this);
    this.boundOnViewportLeave = this.onViewportLeave.bind(this);
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  init(): void {
    if (this.initialised) return;
    this.initialised = true;

    this.panels.set('info-panel', this.createPanelState('info-panel', this.infoPanelEl, 'Werkinformationen'));

    this.applyMode(this.currentMode());
    this.createPeekElements();
    this.createSrStatusElement();

    // All global listeners are passive — they never call preventDefault().
    window.addEventListener('pointermove', this.boundOnPointerMove, { passive: true });
    window.addEventListener('pointerdown', this.boundOnPointerDown, { passive: true });
    document.addEventListener('keydown', this.boundOnKeyDown, { passive: true });
    // When the cursor leaves the viewport entirely (other window/monitor) the
    // pointermove stream stops, so clear both trigger zones explicitly to avoid
    // a panel staying revealed because its last sample was still in-zone.
    document.addEventListener('mouseleave', this.boundOnViewportLeave, { passive: true });
    window.addEventListener('blur', this.boundOnViewportLeave, { passive: true });

    for (const state of this.panels.values()) {
      state.el.addEventListener('focusin', state.onFocusIn);
      state.el.addEventListener('focusout', state.onFocusOut);
      state.el.addEventListener('pointerenter', state.onPointerEnter);
      state.el.addEventListener('pointerleave', state.onPointerLeave);
    }

    this.unsubscribePrefs = this.prefs.subscribe(() => this.applyMode(this.currentMode()));

    this.diag.info('init', 'ChromeVisibilityManager initialised', { mode: this.currentMode() });
  }

  dispose(): void {
    if (!this.initialised) return;
    this.initialised = false;

    window.removeEventListener('pointermove', this.boundOnPointerMove);
    window.removeEventListener('pointerdown', this.boundOnPointerDown);
    document.removeEventListener('keydown', this.boundOnKeyDown);
    document.removeEventListener('mouseleave', this.boundOnViewportLeave);
    window.removeEventListener('blur', this.boundOnViewportLeave);
    this.unsubscribePrefs?.();
    this.unsubscribePrefs = null;

    for (const state of this.panels.values()) {
      if (state.hideTimerId !== null) clearTimeout(state.hideTimerId);
      state.el.removeEventListener('focusin', state.onFocusIn);
      state.el.removeEventListener('focusout', state.onFocusOut);
      state.el.removeEventListener('pointerenter', state.onPointerEnter);
      state.el.removeEventListener('pointerleave', state.onPointerLeave);
    }
    this.panels.clear();

    this.infoPanelPeekHit?.remove();
    this.srStatusEl?.remove();
    this.infoPanelPeekHit = null;
    this.srStatusEl = null;

    // v0.63 — clear the settle timer and remove the settle class so no dangling
    // timer fires after teardown and no stale class is left on appRoot.
    if (this.settleTimer !== null) {
      clearTimeout(this.settleTimer);
      this.appRoot.classList.remove('affordance-settling');
      this.settleTimer = null;
    }

    this.diag.info('dispose', 'ChromeVisibilityManager disposed');
  }

  /**
   * Force-reveal a panel for a fixed duration (e.g. after artwork navigation).
   * Calling it again while already force-revealed resets the timer rather than
   * stacking additional time. No-op in always-visible mode.
   */
  forceReveal(panelId: PanelId): void {
    if (!this.initialised) return;
    if (this.currentMode() === 'visible') return; // already visible
    const state = this.panels.get(panelId);
    if (!state) return;
    this.reveal(panelId, 'forced');
    this.scheduleHide(panelId, this.config.FORCE_REVEAL_DURATION_MS);
    this.diag.debug('force-reveal', 'Panel force-revealed', { panelId });
  }

  /**
   * Register the navigation controls as a third managed chrome surface.
   *
   * After registration the nav container:
   * - starts hidden in clean mode (CSS `[data-chrome-mode='clean'] .nav-controls`
   *   hides it; `.is-revealed` shows it);
   * - reveals on bottom proximity (NAV_TRIGGER_BAND_PX), keyboard focus, and
   *   ArrowLeft/ArrowRight key presses;
   * - participates in the onboarding hint lifecycle via the `navControls`
   *   callbacks: the hint reveals the nav, and on completion the nav is
   *   scheduled back to hidden.
   *
   * Must be called after `init()`.
   */
  registerNavControls(navEl: HTMLElement, navControls: NavigationControls): void {
    if (!this.initialised) {
      this.diag.warn('register-nav', 'registerNavControls called before init() — ignored');
      return;
    }
    if (this.panels.has('nav-controls')) {
      this.diag.warn('register-nav', 'Nav controls already registered — ignored');
      return;
    }

    const state = this.createPanelState('nav-controls', navEl, 'Navigation');
    this.panels.set('nav-controls', state);

    // Attach per-panel DOM listeners consistent with timeline/info-panel setup.
    navEl.addEventListener('focusin', state.onFocusIn);
    navEl.addEventListener('focusout', state.onFocusOut);
    navEl.addEventListener('pointerenter', state.onPointerEnter);
    navEl.addEventListener('pointerleave', state.onPointerLeave);

    // Apply current mode: in visible mode reveal immediately; in clean mode the
    // CSS already hides the element so no JS action is needed here.
    if (this.currentMode() === 'visible') {
      this.reveal('nav-controls', 'preference');
    }

    // ── Hint lifecycle wiring ────────────────────────────────────────────────
    // When the onboarding pulse is about to start, reveal the nav so the user
    // can see the ring animation even though the nav is otherwise hidden.
    navControls.onHintStart(() => {
      this.reveal('nav-controls', 'hint');
      this.diag.debug('nav-hint-start', 'Nav controls revealed for onboarding hint');
    });

    // When the hint finishes (animation complete or dismissed by interaction),
    // schedule nav back to hidden idle — but only if no pointer/focus holds it.
    navControls.onHintFinished(() => {
      const navState = this.panels.get('nav-controls');
      if (!navState) return;
      if (this.currentMode() === 'clean' && this.shouldHide(navState)) {
        this.scheduleHide('nav-controls', this.config.NAV_HIDE_DELAY_MS);
        this.diag.debug('nav-hint-dismiss', 'Nav hint finished; scheduled re-hide', {
          delay: this.config.NAV_HIDE_DELAY_MS,
        });
      }
      // v0.63 (P-03): briefly elevate the persistent idle affordances so the
      // user's eye is guided from the onboarding hint to the resting cues.
      this.triggerAffordanceSettle();
    });

    this.diag.info('register-nav', 'Nav controls registered as managed chrome surface', {
      mode: this.currentMode(),
    });
  }

  /**
   * v0.63 (P-03) — Briefly elevate affordance salience after the nav onboarding
   * hint completes. Adds the `affordance-settling` class to `appRoot`, which
   * swaps the peek strips/chevrons onto the one-shot `peek-settle` animation
   * (decays from a peak opacity back to the resting peek-pulse floor), directing
   * the user's eye to the persistent static cues precisely when they are paying
   * attention. The class is removed slightly after the animation ends so the
   * `forwards` fill hands back to `peek-pulse` seamlessly.
   *
   * No-op under prefers-reduced-motion. The caller path already skips the hint
   * (so `onHintFinished` never fires) under reduced motion, but the check is
   * repeated here as a defensive gate against future callers.
   */
  private triggerAffordanceSettle(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Re-trigger guard: cancel any in-flight settle before restarting.
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
    }, 2100); // 100ms past the 2s animation so the forwards fill is fully painted
  }

  // ─── Private: Core State Machine ───────────────────────────────────────────

  private currentMode(): ChromeMode {
    return this.prefs.current.alwaysShowChrome ? 'visible' : 'clean';
  }

  private createPanelState(id: PanelId, el: HTMLElement, label: string): PanelState {
    return {
      id,
      el,
      label,
      revealed: false,
      reason: null,
      hideTimerId: null,
      focusActive: false,
      pointerInZone: false,
      pointerInPanel: false,
      onFocusIn: () => this.onPanelFocusIn(id),
      onFocusOut: () => this.onPanelFocusOut(id),
      onPointerEnter: () => this.onPanelPointerEnter(id),
      onPointerLeave: () => this.onPanelPointerLeave(id),
    };
  }

  private applyMode(mode: ChromeMode): void {
    document.documentElement.dataset['chromeMode'] = mode;
    if (mode === 'visible') {
      // Reveal all panels immediately and cancel any pending hide timers.
      for (const id of this.panels.keys()) this.reveal(id, 'preference');
    } else {
      // Switching back to clean mode: hide everything that is not pinned by
      // active pointer/focus so the artwork is unobstructed again.
      for (const state of this.panels.values()) {
        if (this.shouldHide(state)) this.hide(state.id);
      }
    }
  }

  private reveal(panelId: PanelId, reason: RevealReason): void {
    const state = this.panels.get(panelId);
    if (!state) return;
    if (state.hideTimerId !== null) {
      clearTimeout(state.hideTimerId);
      state.hideTimerId = null;
    }
    if (state.revealed && state.reason === reason) return; // already revealed for this reason

    state.el.classList.add('is-revealed');
    state.revealed = true;
    state.reason = reason;

    this.announceToScreenReader(state, true);
    this.options.onRevealChange?.(panelId, true, reason);
    this.diag.debug('reveal', 'Panel revealed', { panelId, reason });
  }

  private hide(panelId: PanelId): void {
    const state = this.panels.get(panelId);
    if (!state) return;
    if (state.hideTimerId !== null) {
      clearTimeout(state.hideTimerId);
      state.hideTimerId = null;
    }
    if (!state.revealed) return;

    state.el.classList.remove('is-revealed');
    state.revealed = false;
    state.reason = null;

    this.announceToScreenReader(state, false);
    this.options.onRevealChange?.(panelId, false, null);
    this.diag.debug('hide', 'Panel hidden', { panelId });
  }

  private scheduleHide(panelId: PanelId, delayMs: number = this.config.HIDE_DELAY_MS): void {
    const state = this.panels.get(panelId);
    if (!state) return;
    if (state.hideTimerId !== null) clearTimeout(state.hideTimerId);
    state.hideTimerId = setTimeout(() => this.hide(panelId), delayMs);
  }

  private shouldHide(state: PanelState): boolean {
    return !state.pointerInZone && !state.pointerInPanel && !state.focusActive;
  }

  // ─── Private: Event Handlers ───────────────────────────────────────────────

  private onPointerMove(e: PointerEvent): void {
    if (this.currentMode() === 'visible') return;
    // Mouse/pen hover drives proximity; touch is handled via onPointerDown taps.
    if (e.pointerType === 'touch') return;

    const x = e.clientX;
    const y = e.clientY;
    const h = window.innerHeight;

    this.updateZone('info-panel', x <= this.config.INFO_PANEL_TRIGGER_BAND_PX);
    // Nav controls share the bottom proximity zone with an extended band that
    // covers the button height above the timeline strip.
    if (this.panels.has('nav-controls')) {
      this.updateZone('nav-controls', y >= h - this.config.NAV_TRIGGER_BAND_PX, this.config.NAV_HIDE_DELAY_MS);
    }
  }

  private onPointerDown(e: PointerEvent): void {
    if (e.pointerType === 'mouse') return; // mouse handled by pointermove
    if (this.currentMode() === 'visible') return;

    const x = e.clientX;
    // Left-edge tap (clear of the iOS back-swipe dead zone) → reveal info panel.
    if (x >= this.config.IOS_EDGE_DEAD_ZONE_PX && x <= this.config.INFO_PANEL_TOUCH_MAX_PX) {
      this.reveal('info-panel', 'touch');
      this.scheduleHide('info-panel', this.config.TOUCH_REVEAL_DURATION_MS);
    }
  }

  private onViewportLeave(): void {
    if (this.currentMode() === 'visible') return;
    // Clear ALL registered trigger zones; iterating over the panels map means
    // nav controls are included without needing a hard-coded list.
    for (const id of this.panels.keys()) {
      this.updateZone(id, false);
    }
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (this.currentMode() === 'visible') return;

    // ArrowLeft/ArrowRight: briefly reveal nav controls so the user can see
    // the button they are activating (P-02 keyboard reveal channel).
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && this.panels.has('nav-controls')) {
      this.reveal('nav-controls', 'keyboard');
      this.scheduleHide('nav-controls', this.config.NAV_HIDE_DELAY_MS);
      this.diag.debug('nav-keyboard-reveal', 'Nav controls revealed by keyboard', { key: e.key });
    }

    if (e.key !== 'Escape') return;

    let dismissed = false;
    for (const state of this.panels.values()) {
      // Only dismiss panels the user is not actively focused inside — Escape
      // there should bubble to the panel's own handlers first.
      if (state.revealed && !state.el.contains(document.activeElement)) {
        this.hide(state.id);
        dismissed = true;
      }
    }
    if (dismissed) {
      this.diag.debug('escape-dismiss', 'Chrome dismissed via Escape');
    }
  }

  private onPanelFocusIn(panelId: PanelId): void {
    const state = this.panels.get(panelId);
    if (!state) return;
    state.focusActive = true;
    if (state.hideTimerId !== null) {
      clearTimeout(state.hideTimerId);
      state.hideTimerId = null;
    }
    // Synchronous reveal so the focused element is visible before the browser
    // paints the focus ring (WCAG 2.2 SC 2.4.11 Focus Not Obscured).
    if (this.currentMode() === 'clean') this.reveal(panelId, 'focus');
  }

  private onPanelFocusOut(panelId: PanelId): void {
    // Defer one frame so focus can settle on a sibling within the same panel.
    requestAnimationFrame(() => {
      const state = this.panels.get(panelId);
      if (!state) return;
      if (state.el.contains(document.activeElement)) return; // still inside
      state.focusActive = false;
      if (this.currentMode() === 'clean' && this.shouldHide(state)) this.scheduleHide(panelId);
    });
  }

  private onPanelPointerEnter(panelId: PanelId): void {
    const state = this.panels.get(panelId);
    if (!state) return;
    state.pointerInPanel = true;
    if (state.hideTimerId !== null) {
      clearTimeout(state.hideTimerId);
      state.hideTimerId = null;
    }
  }

  private onPanelPointerLeave(panelId: PanelId): void {
    const state = this.panels.get(panelId);
    if (!state) return;
    state.pointerInPanel = false;
    if (this.currentMode() === 'clean' && this.shouldHide(state)) this.scheduleHide(panelId);
  }

  private updateZone(panelId: PanelId, inZone: boolean, hideDelayMs?: number): void {
    const state = this.panels.get(panelId);
    if (!state) return;
    if (inZone === state.pointerInZone) return; // no change
    state.pointerInZone = inZone;
    if (inZone) {
      this.reveal(panelId, 'proximity');
    } else if (this.shouldHide(state)) {
      this.scheduleHide(panelId, hideDelayMs);
    }
  }

  // ─── Private: DOM Helpers ──────────────────────────────────────────────────

  private createPeekElements(): void {
    // The chevron elements are purely decorative affordances (aria-hidden) that
    // sit inside the peek hit areas to signal the direction of the hidden panel.
    const infoPanelChevron = this.makeEl('div', 'info-panel-chevron');
    this.infoPanelPeekHit = this.makeEl('div', 'info-panel-peek-hit', [
      this.makeEl('div', 'info-panel-peek'),
      infoPanelChevron,
    ]);
    this.infoPanelPeekHit.setAttribute('aria-hidden', 'true');
    this.appRoot.appendChild(this.infoPanelPeekHit);
    this.diag.debug('peek-affordances-created', 'Visual chrome affordances mounted', {
      infoPanel: ['info-panel-peek', 'info-panel-chevron'],
    });
  }

  private createSrStatusElement(): void {
    this.srStatusEl = this.makeEl('div', 'sr-only');
    this.srStatusEl.id = 'freyraum-chrome-status';
    this.srStatusEl.setAttribute('aria-live', 'polite');
    this.srStatusEl.setAttribute('aria-atomic', 'true');
    this.appRoot.appendChild(this.srStatusEl);
  }

  private announceToScreenReader(state: PanelState, revealed: boolean): void {
    if (!this.srStatusEl) return;
    // Empty string on hide — screen readers skip empty announcements, so we do
    // not spam "ausgeblendet" on every dwell-timeout.
    this.srStatusEl.textContent = revealed ? `${state.label} eingeblendet` : '';
  }

  private makeEl(tag: string, className: string, children: HTMLElement[] = []): HTMLElement {
    const el = document.createElement(tag);
    el.className = className;
    for (const child of children) el.appendChild(child);
    return el;
  }
}
