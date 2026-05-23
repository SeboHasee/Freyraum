export class Topbar {
  private readonly el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement('header');
    this.el.className = 'topbar';
    this.el.setAttribute('role', 'banner');
    this.el.innerHTML = `
      <h1 class="topbar__brand">freyraum</h1>
      <div class="topbar__badge" role="note">IMMERSIVE DIGITALE AUSSTELLUNG</div>
    `;
    container.appendChild(this.el);
  }

  dispose(): void {
    this.el.remove();
  }
}
