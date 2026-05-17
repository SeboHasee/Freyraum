import { artworks } from '../config/artworks';

/**
 * Timeline navigation strip.
 *
 * Each thumbnail is a real <button> so it is announced as such by screen
 * readers and inherits browser focus handling. Arrow keys move focus
 * between thumbs using a roving tabindex (only the active thumb is in
 * the tab order). Home/End jump to the first / last artwork.
 *
 * Each thumbnail reserves space using the artwork's intrinsic aspect
 * ratio so layout never shifts when the image finishes loading. A small
 * skeleton placeholder fills the frame until the image fires `load`.
 */

export class Timeline {
  private readonly el: HTMLElement;
  private readonly thumbs: HTMLButtonElement[] = [];
  private currentIndex = 0;
  private onSelectCallback: ((index: number) => void) | null = null;

  constructor(container: HTMLElement) {
    this.el = document.createElement('nav');
    this.el.className = 'timeline';
    this.el.setAttribute('aria-label', 'Werke der Ausstellung');

    const list = document.createElement('ul');
    list.className = 'timeline__list';
    list.setAttribute('role', 'list');
    this.el.appendChild(list);

    artworks.forEach((artwork, i) => {
      const item = document.createElement('li');
      item.className = 'timeline__item';

      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = 'timeline__thumb';
      thumb.setAttribute('aria-label', `${artwork.subtitle}: ${artwork.title}`);
      thumb.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      thumb.setAttribute('data-index', String(i));
      thumb.tabIndex = i === 0 ? 0 : -1;

      const aspect = artwork.dimensions.width / artwork.dimensions.height;
      const frame = document.createElement('span');
      frame.className = 'timeline__frame';
      frame.style.setProperty('--thumb-aspect', String(aspect.toFixed(4)));

      const skeleton = document.createElement('span');
      skeleton.className = 'timeline__skeleton';
      skeleton.setAttribute('aria-hidden', 'true');
      frame.appendChild(skeleton);

      const img = document.createElement('img');
      img.className = 'timeline__img';
      img.src = artwork.image;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('load', () => {
        frame.classList.add('is-loaded');
      });
      img.addEventListener('error', () => {
        frame.classList.add('is-loaded', 'is-error');
      });
      frame.appendChild(img);

      const label = document.createElement('span');
      label.className = 'timeline__thumb-label';
      label.textContent = artwork.subtitle;

      thumb.append(frame, label);
      thumb.addEventListener('click', () => this.select(i));
      thumb.addEventListener('keydown', this.handleThumbKey);

      this.thumbs.push(thumb);
      item.appendChild(thumb);
      list.appendChild(item);
    });

    this.setActive(0);
    container.appendChild(this.el);
  }

  private handleThumbKey = (event: KeyboardEvent): void => {
    const target = event.currentTarget as HTMLButtonElement;
    const index = Number(target.dataset['index'] ?? '0');

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        this.focusThumb((index + 1) % this.thumbs.length);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        this.focusThumb((index - 1 + this.thumbs.length) % this.thumbs.length);
        break;
      case 'Home':
        event.preventDefault();
        this.focusThumb(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusThumb(this.thumbs.length - 1);
        break;
      case 'Enter':
      case ' ': {
        // Native <button> dispatches click for Enter and Space automatically,
        // so we only need to prevent the page from scrolling on Space. The
        // click handler will fire select() once via the synthetic click.
        if (event.key === ' ') event.preventDefault();
        break;
      }
    }
  };

  private focusThumb(index: number): void {
    const thumb = this.thumbs[index];
    if (!thumb) return;
    this.thumbs.forEach((t, i) => {
      t.tabIndex = i === index ? 0 : -1;
    });
    thumb.focus();
  }

  private select(index: number): void {
    this.onSelectCallback?.(index);
  }

  setActive(index: number): void {
    const prev = this.thumbs[this.currentIndex];
    if (prev) {
      prev.classList.remove('is-active');
      prev.setAttribute('aria-pressed', 'false');
    }
    this.currentIndex = index;
    const next = this.thumbs[this.currentIndex];
    if (next) {
      next.classList.add('is-active');
      next.setAttribute('aria-pressed', 'true');
      // Keep the active item in the tab order so Tab returns to the current selection.
      this.thumbs.forEach((t, i) => {
        t.tabIndex = i === index ? 0 : -1;
      });
      next.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }

  onSelect(cb: (index: number) => void): void {
    this.onSelectCallback = cb;
  }

  dispose(): void {
    this.el.remove();
  }
}
