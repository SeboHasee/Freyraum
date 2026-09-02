export class Topbar {
  private readonly el: HTMLElement;
  readonly helpBtn: HTMLButtonElement;
  readonly infoBtn: HTMLButtonElement;
  readonly backBtn: HTMLButtonElement;

  /** Wired by main.ts to open the keyboard-help dialog. */
  onHelpClick: (() => void) | undefined;
  /** Wired by main.ts to force-reveal the Info panel. */
  onInfoClick: (() => void) | undefined;
  /** Wired by main.ts to navigate back to the museum hub. */
  onBackClick: (() => void) | undefined;

  constructor(container: HTMLElement) {
    this.el = document.createElement('header');
    this.el.className = 'topbar';
    this.el.setAttribute('role', 'banner');

    // Left group: back-to-museum action first, then brand + badge.
    const leftGroup = document.createElement('div');
    leftGroup.className = 'topbar__left';

    // v0.81 — primary back-to-hub navigation. Dedicated class and lifecycle
    // (not a `topbar__chrome-btn`): it stays visible in clean-chrome,
    // visible-chrome, and presentation modes, and is first in the gallery
    // focus order after the canvas. DestinationRouter handles the transition.
    this.backBtn = document.createElement('button');
    this.backBtn.className = 'topbar__back-btn';
    this.backBtn.setAttribute('aria-label', 'Zurück zum Museum');
    this.backBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      <span class="topbar__back-btn-label topbar__back-btn-label--full">Zurück zum Museum</span>
      <span class="topbar__back-btn-label topbar__back-btn-label--short">Museum</span>
    `;
    this.backBtn.addEventListener('click', () => {
      if (this.backBtn.disabled) return;
      this.onBackClick?.();
    });

    const brandGroup = document.createElement('div');
    brandGroup.className = 'topbar__brand-group';
    brandGroup.innerHTML = `
      <h1 class="topbar__brand">freyraum</h1>
      <div class="topbar__badge" role="note">IMMERSIVE DIGITALE AUSSTELLUNG</div>
    `;
    leftGroup.appendChild(this.backBtn);
    leftGroup.appendChild(brandGroup);
    this.el.appendChild(leftGroup);

    // Right group: utility actions (pointer-events: auto)
    const rightGroup = document.createElement('div');
    rightGroup.className = 'topbar__right';

    // v0.66 — Info panel toggle: visible shortcut so edge affordance is not the
    // only path to discover the panel.
    this.infoBtn = document.createElement('button');
    this.infoBtn.className = 'topbar__chrome-btn';
    this.infoBtn.setAttribute('aria-label', 'Werkinformationen einblenden');
    this.infoBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span class="topbar__chrome-btn-label">Info</span>
    `;
    this.infoBtn.addEventListener('click', () => this.onInfoClick?.());

    this.helpBtn = document.createElement('button');
    this.helpBtn.className = 'topbar__help-btn';
    this.helpBtn.setAttribute('aria-label', 'Tastaturkürzel anzeigen');
    this.helpBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    this.helpBtn.addEventListener('click', () => this.onHelpClick?.());

    rightGroup.appendChild(this.infoBtn);
    rightGroup.appendChild(this.helpBtn);
    this.el.appendChild(rightGroup);

    container.appendChild(this.el);
  }

  /**
   * v0.81 — busy/disabled state while a hub↔gallery transition runs, so
   * duplicate activations are suppressed and assistive tech sees the state.
   */
  setBackBusy(busy: boolean): void {
    this.backBtn.disabled = busy;
    this.backBtn.setAttribute('aria-busy', busy ? 'true' : 'false');
  }

  dispose(): void {
    this.el.remove();
  }
}
