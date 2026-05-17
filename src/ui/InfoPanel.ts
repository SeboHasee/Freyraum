import { artworks, type Artwork } from '../config/artworks';

export class InfoPanel {
  private readonly el: HTMLElement;
  private readonly eyebrow: HTMLElement;
  private readonly title: HTMLElement;
  private readonly description: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement('section');
    this.el.className = 'info-panel';
    this.el.setAttribute('aria-live', 'polite');
    this.el.setAttribute('aria-label', 'Artwork information');

    this.eyebrow = document.createElement('p');
    this.eyebrow.className = 'info-panel__eyebrow';

    this.title = document.createElement('h1');
    this.title.className = 'info-panel__title';

    this.description = document.createElement('p');
    this.description.className = 'info-panel__description';

    this.el.appendChild(this.eyebrow);
    this.el.appendChild(this.title);
    this.el.appendChild(this.description);
    container.appendChild(this.el);

    this.update(artworks[0]);
  }

  update(artwork: Artwork, animate = false): void {
    if (animate) {
      this.el.classList.add('is-transitioning');
      setTimeout(() => {
        this.setContent(artwork);
        this.el.classList.remove('is-transitioning');
      }, 200);
    } else {
      this.setContent(artwork);
    }
  }

  private setContent(artwork: Artwork): void {
    this.eyebrow.textContent = artwork.subtitle;
    this.title.textContent = artwork.title;
    this.description.textContent = artwork.description;
  }

  dispose(): void {
    this.el.remove();
  }
}
