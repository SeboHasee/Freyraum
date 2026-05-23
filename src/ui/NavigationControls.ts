export class NavigationControls {
  private readonly el: HTMLElement;
  private onPrevCallback: (() => void) | null = null;
  private onNextCallback: (() => void) | null = null;

  constructor(container: HTMLElement) {
    this.el = document.createElement('nav');
    this.el.className = 'nav-controls';
    this.el.setAttribute('aria-label', 'Galerie-Navigation');

    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav-btn';
    prevBtn.setAttribute('aria-label', 'Vorheriges Werk');
    prevBtn.title = 'Vorheriges Werk';
    prevBtn.textContent = '←';
    prevBtn.addEventListener('click', () => this.onPrevCallback?.());

    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-btn';
    nextBtn.setAttribute('aria-label', 'Nächstes Werk');
    nextBtn.title = 'Nächstes Werk';
    nextBtn.textContent = '→';
    nextBtn.addEventListener('click', () => this.onNextCallback?.());

    this.el.appendChild(prevBtn);
    this.el.appendChild(nextBtn);
    container.appendChild(this.el);
  }

  onPrev(cb: () => void): void {
    this.onPrevCallback = cb;
  }

  onNext(cb: () => void): void {
    this.onNextCallback = cb;
  }

  dispose(): void {
    this.el.remove();
  }
}
