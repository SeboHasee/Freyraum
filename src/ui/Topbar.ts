export class Topbar {
  private readonly el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement('header');
    this.el.className = 'topbar';
    this.el.setAttribute('role', 'banner');
    this.el.innerHTML = `
      <div class="topbar__brand" aria-label="Freyraum">freyraum</div>
      <div class="topbar__badge" role="note">IMMERSIVE DIGITAL EXHIBITION</div>
    `;
    container.appendChild(this.el);
  }

  dispose(): void {
    this.el.remove();
  }
}
