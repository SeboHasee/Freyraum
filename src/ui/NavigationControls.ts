export class NavigationControls {
  private readonly el: HTMLElement;
  private readonly prevBtn: HTMLButtonElement;
  private readonly nextBtn: HTMLButtonElement;
  private onPrevCallback: (() => void) | null = null;
  private onNextCallback: (() => void) | null = null;
  private hintIdleTimer: ReturnType<typeof setTimeout> | null = null;
  private hintAnimationTimer: ReturnType<typeof setTimeout> | null = null;
  private hintDismissed = false;
  private hintStarted = false;
  private hintKeydownListener: ((event: KeyboardEvent) => void) | null = null;
  private onHintStartCallback: (() => void) | null = null;
  private onHintFinishedCallback: (() => void) | null = null;
  private static readonly HINT_STORAGE_KEY = 'freyraum-nav-hint-seen';
  private static readonly HINT_IDLE_DELAY_MS = 5000;
  /** Duration of 3 nav-ring-pulse cycles (3 × 1.6 s) plus a 300 ms buffer. */
  private static readonly HINT_ANIM_DURATION_MS = 3 * 1600 + 300;

  constructor(container: HTMLElement) {
    this.el = document.createElement('nav');
    this.el.className = 'nav-controls';
    this.el.setAttribute('aria-label', 'Galerie-Navigation');

    this.prevBtn = document.createElement('button');
    this.prevBtn.className = 'nav-btn';
    this.prevBtn.setAttribute('aria-label', 'Vorheriges Werk');
    this.prevBtn.textContent = '←';
    this.prevBtn.addEventListener('click', () => {
      this.dismissHint();
      this.onPrevCallback?.();
    });

    this.nextBtn = document.createElement('button');
    this.nextBtn.className = 'nav-btn';
    this.nextBtn.setAttribute('aria-label', 'Nächstes Werk');
    this.nextBtn.textContent = '→';
    this.nextBtn.addEventListener('click', () => {
      this.dismissHint();
      this.onNextCallback?.();
    });

    this.el.appendChild(this.prevBtn);
    this.el.appendChild(this.nextBtn);
    container.appendChild(this.el);
  }

  /**
   * Register a callback that fires when the onboarding hint animation is about
   * to start. Used by ChromeVisibilityManager to reveal nav controls before the
   * ring-pulse runs so users can actually see the animation.
   */
  onHintStart(cb: () => void): void {
    this.onHintStartCallback = cb;
  }

  /**
   * Register a callback that fires when the onboarding hint is finished
   * (animation completed or dismissed by interaction). Used by
   * ChromeVisibilityManager to schedule a hide after the hint cycle.
   */
  onHintFinished(cb: () => void): void {
    this.onHintFinishedCallback = cb;
  }

  /**
   * Toggle the CSS hidden state for the nav controls container. Does not affect
   * any timer or state logic — purely a CSS class switch for the caller's use.
   * ChromeVisibilityManager calls this when registering nav as a managed panel;
   * after that it manages visibility through `.is-revealed` instead.
   */
  setHiddenMode(hidden: boolean): void {
    this.el.classList.toggle('nav-controls--hidden', hidden);
  }

  enableIdleHint(): void {
    if (this.hintStarted) return;
    this.hintStarted = true;
    if (this.readHintSeen()) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.hintIdleTimer = window.setTimeout(() => {
      this.hintIdleTimer = null;
      if (!this.hintDismissed) {
        // Notify ChromeVisibilityManager to reveal the nav container before
        // the ring-pulse animation starts (so the user can see the cue).
        this.onHintStartCallback?.();
        document.documentElement.dataset['navHint'] = 'active';
        // Schedule automatic completion after all 3 ring-pulse cycles finish.
        this.hintAnimationTimer = window.setTimeout(() => {
          this.hintAnimationTimer = null;
          if (!this.hintDismissed) {
            delete document.documentElement.dataset['navHint'];
            this.onHintFinishedCallback?.();
          }
        }, NavigationControls.HINT_ANIM_DURATION_MS);
      }
    }, NavigationControls.HINT_IDLE_DELAY_MS);

    const dismissOnDiscover = (): void => this.dismissHint();
    this.prevBtn.addEventListener('pointerenter', dismissOnDiscover, { once: true });
    this.nextBtn.addEventListener('pointerenter', dismissOnDiscover, { once: true });
    this.prevBtn.addEventListener('focus', dismissOnDiscover, { once: true });
    this.nextBtn.addEventListener('focus', dismissOnDiscover, { once: true });

    this.hintKeydownListener = (event: KeyboardEvent): void => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        this.dismissHint();
      }
    };
    document.addEventListener('keydown', this.hintKeydownListener);
  }

  dismissHint(): void {
    if (this.hintDismissed) return;
    this.hintDismissed = true;
    if (this.hintIdleTimer !== null) {
      clearTimeout(this.hintIdleTimer);
      this.hintIdleTimer = null;
    }
    if (this.hintAnimationTimer !== null) {
      clearTimeout(this.hintAnimationTimer);
      this.hintAnimationTimer = null;
    }
    delete document.documentElement.dataset['navHint'];
    if (this.hintKeydownListener) {
      document.removeEventListener('keydown', this.hintKeydownListener);
      this.hintKeydownListener = null;
    }
    // Notify ChromeVisibilityManager that the hint is done — schedule re-hide.
    this.onHintFinishedCallback?.();
    try {
      localStorage.setItem(NavigationControls.HINT_STORAGE_KEY, '1');
    } catch {
      // Ignore storage quota/privacy mode write failures.
    }
  }

  private readHintSeen(): boolean {
    try {
      return localStorage.getItem(NavigationControls.HINT_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  }

  onPrev(cb: () => void): void {
    this.onPrevCallback = cb;
  }

  onNext(cb: () => void): void {
    this.onNextCallback = cb;
  }

  dispose(): void {
    if (this.hintIdleTimer !== null) {
      clearTimeout(this.hintIdleTimer);
      this.hintIdleTimer = null;
    }
    if (this.hintAnimationTimer !== null) {
      clearTimeout(this.hintAnimationTimer);
      this.hintAnimationTimer = null;
    }
    if (this.hintKeydownListener) {
      document.removeEventListener('keydown', this.hintKeydownListener);
      this.hintKeydownListener = null;
    }
    delete document.documentElement.dataset['navHint'];
    this.el.remove();
  }
}
