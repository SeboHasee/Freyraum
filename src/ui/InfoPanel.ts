import { artworks, type Artwork } from '../config/artworks';

export class InfoPanel {
  private readonly el: HTMLElement;
  private readonly eyebrow: HTMLElement;
  private readonly title: HTMLElement;
  private readonly meta: HTMLElement;
  private readonly description: HTMLElement;
  private readonly credit: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement('section');
    this.el.className = 'info-panel';
    this.el.setAttribute('aria-live', 'polite');
    this.el.setAttribute('aria-label', 'Informationen zum aktuellen Werk');

    this.eyebrow = document.createElement('p');
    this.eyebrow.className = 'info-panel__eyebrow';

    this.title = document.createElement('h1');
    this.title.className = 'info-panel__title';

    this.meta = document.createElement('p');
    this.meta.className = 'info-panel__meta';

    this.description = document.createElement('p');
    this.description.className = 'info-panel__description';

    this.credit = document.createElement('p');
    this.credit.className = 'info-panel__credit';

    this.el.append(this.eyebrow, this.title, this.meta, this.description, this.credit);
    container.appendChild(this.el);

    this.update(artworks[0]);
  }

  update(artwork: Artwork, animate = false): void {
    if (animate) {
      this.el.classList.add('is-transitioning');
      window.setTimeout(() => {
        this.setContent(artwork);
        this.el.classList.remove('is-transitioning');
      }, 200);
    } else {
      this.setContent(artwork);
    }
  }

  private setContent(artwork: Artwork): void {
    this.eyebrow.textContent = `${artwork.subtitle} · ${artwork.year}`;
    this.title.textContent = artwork.title;
    this.meta.textContent = `${artwork.medium} · ${this.surfaceLabel(artwork.surfaceProfile)}`;
    this.description.textContent = artwork.description;
    this.credit.textContent = `© ${artwork.credit}`;
  }

  private surfaceLabel(profile: Artwork['surfaceProfile']): string {
    switch (profile) {
      case 'satin-canvas':
        return 'Satinierte Leinwand';
      case 'varnished-oil':
        return 'Firnis / Öl';
      case 'paper':
        return 'Papier';
      case 'procedural-fallback':
        return 'Neutrale Studienoberfläche';
      case 'matte-canvas':
      default:
        return 'Matte Leinwand';
    }
  }

  dispose(): void {
    this.el.remove();
  }
}
