export class NavigationControls {
  private readonly el: HTMLElement;
  private readonly prevBtn: HTMLButtonElement;
  private readonly nextBtn: HTMLButtonElement;
  private onPrevCallback: (() => void) | null = null;
  private onNextCallback: (() => void) | null = null;
  private hintIdleTimer: ReturnType<typeof setTimeout> | null = null;
  private hintDismissed = false;
  private hintStarted = false;
  private hintKeydownListener: ((event: KeyboardEvent) => void) | null = null;
  private static readonly HINT_STORAGE_KEY = 'freyraum-nav-hint-seen';
  private static readonly HINT_IDLE_DELAY_MS = 5000;

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

  enableIdleHint(): void {
    if (this.hintStarted) return;
    this.hintStarted = true;
    if (this.readHintSeen()) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.hintIdleTimer = window.setTimeout(() => {
      this.hintIdleTimer = null;
      if (!this.hintDismissed) {
        document.documentElement.dataset['navHint'] = 'active';
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
    delete document.documentElement.dataset['navHint'];
    if (this.hintKeydownListener) {
      document.removeEventListener('keydown', this.hintKeydownListener);
      this.hintKeydownListener = null;
    }
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
    if (this.hintKeydownListener) {
      document.removeEventListener('keydown', this.hintKeydownListener);
      this.hintKeydownListener = null;
    }
    delete document.documentElement.dataset['navHint'];
    this.el.remove();
  }
}
