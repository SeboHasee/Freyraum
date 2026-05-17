import { artworks } from '../config/artworks';

export class Timeline {
  private readonly el: HTMLElement;
  private readonly thumbs: HTMLElement[] = [];
  private currentIndex = 0;
  private onSelectCallback: ((index: number) => void) | null = null;

  constructor(container: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'timeline';
    this.el.setAttribute('role', 'navigation');
    this.el.setAttribute('aria-label', 'Artwork timeline');

    artworks.forEach((artwork, i) => {
      const thumb = document.createElement('div');
      thumb.className = 'timeline__thumb';
      thumb.setAttribute('role', 'button');
      thumb.setAttribute('tabindex', '0');
      thumb.setAttribute('aria-label', `Go to ${artwork.title}`);
      thumb.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');

      const img = document.createElement('img');
      img.src = artwork.image;
      img.alt = artwork.title;
      img.loading = 'lazy';

      const label = document.createElement('span');
      label.className = 'timeline__thumb-label';
      label.textContent = artwork.subtitle;

      thumb.appendChild(img);
      thumb.appendChild(label);

      thumb.addEventListener('click', () => this.select(i));
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.select(i);
        }
      });

      this.thumbs.push(thumb);
      this.el.appendChild(thumb);
    });

    this.setActive(0);
    container.appendChild(this.el);
  }

  private select(index: number): void {
    this.onSelectCallback?.(index);
  }

  setActive(index: number): void {
    this.thumbs[this.currentIndex]?.classList.remove('is-active');
    this.thumbs[this.currentIndex]?.setAttribute('aria-pressed', 'false');
    this.currentIndex = index;
    this.thumbs[this.currentIndex]?.classList.add('is-active');
    this.thumbs[this.currentIndex]?.setAttribute('aria-pressed', 'true');

    // Scroll thumbnail into view
    this.thumbs[this.currentIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }

  onSelect(cb: (index: number) => void): void {
    this.onSelectCallback = cb;
  }

  dispose(): void {
    this.el.remove();
  }
}
