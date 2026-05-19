import { type Artwork } from '../config/artworks';

export class InfoPanel {
  private readonly el: HTMLElement;
  private readonly eyebrow: HTMLElement;
  private readonly title: HTMLElement;
  private readonly meta: HTMLElement;
  private readonly description: HTMLElement;
  private readonly credit: HTMLElement;

  constructor(container: HTMLElement, initialArtwork: Artwork) {
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

    this.update(initialArtwork);
  }

  /**
   * v0.15 — content-swap delay for animated `update()` calls.
   *
   * Must be ≥ the CSS transition duration on `.info-panel` (defined as
   * `--dur-content: 0.5s` in `src/styles/main.scss`). Before v0.15 this
   * was hard-coded to 200ms — shorter than the 320ms `--dur-base`
   * transition — so the text content was swapped while the panel was
   * still ~62% visible, causing the old text to flicker through the
   * fade-out. The 20ms tail accounts for browser scheduling jitter.
   *
   * Keep in sync with `--dur-content` in `main.scss`.
   */
  private static readonly CONTENT_SWAP_DELAY_MS = 520;

  update(artwork: Artwork, animate = false): void {
    if (animate) {
      this.el.classList.add('is-transitioning');
      window.setTimeout(() => {
        this.setContent(artwork);
        // One animation frame lets the browser apply the new text layout
        // before we trigger the fade-in transition, preventing a
        // single-frame flash of un-styled / mid-transition content.
        window.requestAnimationFrame(() => {
          this.el.classList.remove('is-transitioning');
        });
      }, InfoPanel.CONTENT_SWAP_DELAY_MS);
    } else {
      this.setContent(artwork);
    }
  }

  /**
   * v0.11 — toggle compact phone-portrait styling. Driven from
   * `main.ts` based on `detectDeviceCapabilities().layoutTier`. The
   * compact layout fills the available width minus safe-area insets and
   * lets the description scroll inside the panel, keeping all info
   * accessible (WCAG SC 1.4.10 Reflow) instead of being clipped.
   */
  setCompact(compact: boolean): void {
    this.el.classList.toggle('info-panel--compact', compact);
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
