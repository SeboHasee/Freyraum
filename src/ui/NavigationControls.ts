export class NavigationControls {
  private readonly el: HTMLElement;
  private onPrevCallback: (() => void) | null = null;
  private onNextCallback: (() => void) | null = null;

  constructor(container: HTMLElement) {
    this.el = document.createElement('nav');
    this.el.className = 'nav-controls';
    this.el.setAttribute('aria-label', 'Gallery navigation');

    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav-btn';
    prevBtn.setAttribute('aria-label', 'Previous artwork');
    prevBtn.textContent = '←';
    prevBtn.addEventListener('click', () => this.onPrevCallback?.());

    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-btn';
    nextBtn.setAttribute('aria-label', 'Next artwork');
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
