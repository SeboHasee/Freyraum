export class HintText {
  private readonly el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement('p');
    this.el.className = 'hint-text';
    this.el.setAttribute('aria-hidden', 'true');
    this.el.textContent = 'Scrollen zum Zoomen · Ziehen zum freien Bewegen.';
    container.appendChild(this.el);
  }

  dispose(): void {
    this.el.remove();
  }
}
