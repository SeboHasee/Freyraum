export class Topbar {
  private readonly el: HTMLElement;
  readonly helpBtn: HTMLButtonElement;

  /** Wired by main.ts to open the keyboard-help dialog. */
  onHelpClick: (() => void) | undefined;

  constructor(container: HTMLElement) {
    this.el = document.createElement('header');
    this.el.className = 'topbar';
    this.el.setAttribute('role', 'banner');

    // Left group: brand + badge (logically grouped, pointer-events: auto)
    const leftGroup = document.createElement('div');
    leftGroup.className = 'topbar__left';
    leftGroup.innerHTML = `
      <h1 class="topbar__brand">freyraum</h1>
      <div class="topbar__badge" role="note">IMMERSIVE DIGITALE AUSSTELLUNG</div>
    `;
    this.el.appendChild(leftGroup);

    // Right group: utility actions (pointer-events: auto)
    const rightGroup = document.createElement('div');
    rightGroup.className = 'topbar__right';

    this.helpBtn = document.createElement('button');
    this.helpBtn.className = 'topbar__help-btn';
    this.helpBtn.setAttribute('aria-label', 'Tastaturkürzel anzeigen');
    this.helpBtn.setAttribute('aria-describedby', 'topbar-help-tooltip');
    this.helpBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    this.helpBtn.addEventListener('click', () => this.onHelpClick?.());

    // Accessible tooltip
    const tooltip = document.createElement('span');
    tooltip.id = 'topbar-help-tooltip';
    tooltip.className = 'topbar__tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.textContent = 'Tastaturkürzel';

    rightGroup.appendChild(this.helpBtn);
    rightGroup.appendChild(tooltip);
    this.el.appendChild(rightGroup);

    container.appendChild(this.el);
  }

  dispose(): void {
    this.el.remove();
  }
}
