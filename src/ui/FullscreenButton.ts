/**
 * Fullscreen toggle for the customer presentation. Uses the standard
 * Fullscreen API and stays in sync with browser-initiated exits.
 */

export class FullscreenButton {
  private readonly btn: HTMLButtonElement;
  private readonly target: HTMLElement;

  constructor(container: HTMLElement, target: HTMLElement = document.documentElement) {
    this.target = target;
    this.btn = document.createElement('button');
    this.btn.type = 'button';
    this.btn.className = 'fullscreen-btn';
    this.btn.setAttribute('aria-pressed', 'false');
    this.btn.setAttribute('aria-label', 'Vollbild umschalten');
    this.btn.title = 'Vollbild umschalten (F)';

    this.btn.innerHTML = `
      <span class="fullscreen-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path class="fullscreen-btn__enter" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          <path class="fullscreen-btn__exit" d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
        </svg>
      </span>
    `;

    this.btn.addEventListener('click', this.toggle);
    document.addEventListener('fullscreenchange', this.handleChange);

    container.appendChild(this.btn);
  }

  toggle = (): void => {
    if (!document.fullscreenEnabled) {
      this.btn.setAttribute('aria-disabled', 'true');
      return;
    }
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    } else {
      void this.target.requestFullscreen().catch(() => undefined);
    }
  };

  private handleChange = (): void => {
    const active = Boolean(document.fullscreenElement);
    this.btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    document.documentElement.dataset['presentation'] = active ? 'on' : 'off';
  };

  dispose(): void {
    this.btn.removeEventListener('click', this.toggle);
    document.removeEventListener('fullscreenchange', this.handleChange);
    this.btn.remove();
  }
}
