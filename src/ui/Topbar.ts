export class Topbar {
  private readonly el: HTMLElement;
  readonly helpBtn: HTMLButtonElement;

  /** Wired by main.ts to open the keyboard-help dialog. */
  onHelpClick: (() => void) | undefined;

  constructor(container: HTMLElement) {
    this.el = document.createElement('header');
    this.el.className = 'topbar';
    this.el.setAttribute('role', 'banner');
    this.el.innerHTML = `
      <h1 class="topbar__brand">freyraum</h1>
      <div class="topbar__badge" role="note">IMMERSIVE DIGITALE AUSSTELLUNG</div>
    `;

    this.helpBtn = document.createElement('button');
    this.helpBtn.className = 'nav-btn topbar__help-btn';
    this.helpBtn.setAttribute('aria-label', 'Tastaturkürzel anzeigen');
    this.helpBtn.setAttribute('title', 'Tastaturkürzel');
    this.helpBtn.textContent = '?';
    this.helpBtn.addEventListener('click', () => this.onHelpClick?.());
    this.el.appendChild(this.helpBtn);

    container.appendChild(this.el);
  }

  dispose(): void {
    this.el.remove();
  }
}
