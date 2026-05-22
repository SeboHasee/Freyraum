import type { Artwork } from '../config/artworks';
import { getDiagnostics } from '../utils/Diagnostics';

/**
 * Timeline navigation strip.
 *
 * Each visible thumbnail is a real <button> so it is announced as such by
 * screen readers and inherits browser focus handling. Large collections use a
 * lightweight virtual window: all list positions reserve layout space, while
 * only visible + buffered thumbnails are instantiated.
 */

const VIRTUAL_THRESHOLD = 20;
const RENDER_BUFFER = 5;

export class Timeline {
  private readonly diagnostics = getDiagnostics();
  private readonly el: HTMLElement;
  private readonly listEl: HTMLUListElement;
  private readonly counterEl: HTMLElement;
  private readonly prevButton: HTMLButtonElement;
  private readonly nextButton: HTMLButtonElement;
  private readonly artworks: readonly Artwork[];
  private readonly items: HTMLLIElement[] = [];
  private readonly thumbs: Array<HTMLButtonElement | null> = [];
  private readonly virtualized: boolean;
  private currentIndex = 0;
  private renderedStart = -1;
  private renderedEnd = -1;
  private onSelectCallback: ((index: number) => void) | null = null;
  private onPreviewCallback: ((index: number) => void) | null = null;

  constructor(container: HTMLElement, artworks: readonly Artwork[]) {
    this.artworks = artworks;
    this.virtualized = artworks.length > VIRTUAL_THRESHOLD;
    this.el = document.createElement('nav');
    this.el.className = 'timeline';
    this.el.setAttribute('aria-label', 'Werke der Ausstellung');

    this.prevButton = this.createArrowButton('prev', 'Vorherige Werke anzeigen', '‹');
    this.nextButton = this.createArrowButton('next', 'Weitere Werke anzeigen', '›');

    this.counterEl = document.createElement('div');
    this.counterEl.className = 'timeline__counter';
    this.counterEl.setAttribute('aria-live', 'polite');

    const list = document.createElement('ul');
    list.className = 'timeline__list';
    list.setAttribute('role', 'list');
    this.listEl = list;

    this.el.append(this.prevButton, list, this.nextButton, this.counterEl);

    artworks.forEach((_artwork, i) => {
      const item = document.createElement('li');
      item.className = 'timeline__item';
      item.dataset['index'] = String(i);
      this.items.push(item);
      this.thumbs.push(null);
      list.appendChild(item);
    });

    if (this.virtualized) {
      this.renderWindowAround(0);
      this.diagnostics.info('timeline', 'virtualization-enabled', 'Timeline virtual rendering enabled', {
        artworkCount: artworks.length,
        threshold: VIRTUAL_THRESHOLD,
        buffer: RENDER_BUFFER,
      });
    } else {
      artworks.forEach((_artwork, i) => this.ensureThumb(i));
    }

    this.prevButton.addEventListener('click', this.onPrevPage);
    this.nextButton.addEventListener('click', this.onNextPage);
    this.listEl.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    container.appendChild(this.el);
    this.setActive(0);
    this.updateScrollState();
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => this.centerThumb(0, 'auto')));
  }

  private createArrowButton(direction: 'prev' | 'next', label: string, text: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `timeline__arrow timeline__arrow--${direction}`;
    button.setAttribute('aria-label', label);
    button.textContent = text;
    return button;
  }

  private ensureThumb(index: number): HTMLButtonElement | null {
    if (index < 0 || index >= this.artworks.length) return null;
    const existing = this.thumbs[index];
    if (existing) return existing;

    const artwork = this.artworks[index];
    const item = this.items[index];
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'timeline__thumb';
    thumb.setAttribute('aria-label', `${artwork.subtitle}: ${artwork.title}`);
    thumb.setAttribute('aria-pressed', index === this.currentIndex ? 'true' : 'false');
    thumb.setAttribute('aria-current', index === this.currentIndex ? 'true' : 'false');
    thumb.setAttribute('data-index', String(index));
    thumb.tabIndex = index === this.currentIndex ? 0 : -1;

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
    img.addEventListener('load', () => frame.classList.add('is-loaded'));
    img.addEventListener('error', () => frame.classList.add('is-loaded', 'is-error'));
    frame.appendChild(img);

    const label = document.createElement('span');
    label.className = 'timeline__thumb-label';
    label.textContent = artwork.subtitle;

    thumb.append(frame, label);
    thumb.addEventListener('click', () => this.select(index));
    thumb.addEventListener('pointerenter', () => this.preview(index));
    thumb.addEventListener('focus', () => this.preview(index));
    thumb.addEventListener('keydown', this.handleThumbKey);

    this.thumbs[index] = thumb;
    item.replaceChildren(thumb);
    return thumb;
  }

  private unmountThumb(index: number): void {
    if (index === this.currentIndex) return;
    const thumb = this.thumbs[index];
    if (!thumb || thumb.matches(':focus-within')) return;
    thumb.removeEventListener('keydown', this.handleThumbKey);
    this.thumbs[index] = null;
    this.items[index]?.replaceChildren();
  }

  private handleThumbKey = (event: KeyboardEvent): void => {
    const target = event.currentTarget as HTMLButtonElement;
    const index = Number(target.dataset['index'] ?? '0');

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        this.focusThumb((index + 1) % this.artworks.length);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        this.focusThumb((index - 1 + this.artworks.length) % this.artworks.length);
        break;
      case 'Home':
        event.preventDefault();
        this.focusThumb(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusThumb(this.artworks.length - 1);
        break;
      case 'Enter':
      case ' ': {
        if (event.key === ' ') event.preventDefault();
        break;
      }
    }
  };

  private focusThumb(index: number): void {
    if (this.virtualized) this.renderWindowAround(index);
    const thumb = this.ensureThumb(index);
    if (!thumb) return;
    this.thumbs.forEach((t, i) => {
      if (t) t.tabIndex = i === index ? 0 : -1;
    });
    thumb.focus();
    this.centerThumb(index, this.preferredScrollBehavior());
  }

  private select(index: number): void {
    this.onSelectCallback?.(index);
  }

  private preview(index: number): void {
    this.onPreviewCallback?.(index);
  }

  setActive(index: number): void {
    const prev = this.thumbs[this.currentIndex];
    if (prev) {
      prev.classList.remove('is-active');
      prev.setAttribute('aria-pressed', 'false');
      prev.setAttribute('aria-current', 'false');
    }
    this.currentIndex = index;
    if (this.virtualized) this.renderWindowAround(index);
    const next = this.ensureThumb(this.currentIndex);
    if (next) {
      next.classList.add('is-active');
      next.setAttribute('aria-pressed', 'true');
      next.setAttribute('aria-current', 'true');
      this.thumbs.forEach((t, i) => {
        if (t) t.tabIndex = i === index ? 0 : -1;
      });
      this.centerThumb(index, this.preferredScrollBehavior());
    }
    this.updateCounter();
    this.updateScrollState();
  }

  private renderWindowAround(index: number): void {
    const visible = Math.max(4, Math.ceil(this.listEl.clientWidth / this.approxThumbPitch()) || 4);
    const start = Math.max(0, index - RENDER_BUFFER);
    const end = Math.min(this.artworks.length - 1, index + visible + RENDER_BUFFER);
    this.renderWindow(start, end);
  }

  private renderWindowFromScroll(): void {
    if (!this.virtualized) return;
    const pitch = this.approxThumbPitch();
    const visible = Math.max(4, Math.ceil(this.listEl.clientWidth / pitch) || 4);
    const first = Math.max(0, Math.floor(this.listEl.scrollLeft / pitch) - RENDER_BUFFER);
    const last = Math.min(this.artworks.length - 1, first + visible + RENDER_BUFFER * 2);
    this.renderWindow(first, last);
  }

  private renderWindow(start: number, end: number): void {
    if (start === this.renderedStart && end === this.renderedEnd) return;
    for (let i = start; i <= end; i += 1) this.ensureThumb(i);
    for (let i = 0; i < this.thumbs.length; i += 1) {
      if (i < start || i > end) this.unmountThumb(i);
    }
    this.renderedStart = start;
    this.renderedEnd = end;
  }

  private approxThumbPitch(): number {
    const sample = this.thumbs.find(Boolean);
    if (!sample) return 162;
    return sample.getBoundingClientRect().width + 12;
  }

  private centerThumb(index: number, behavior: ScrollBehavior): void {
    if (this.virtualized) this.renderWindowAround(index);
    const thumb = this.ensureThumb(index);
    if (!thumb) return;

    const listRect = this.listEl.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    if (listRect.width <= 0 || thumbRect.width <= 0) return;

    const delta = (thumbRect.left + thumbRect.width * 0.5) - (listRect.left + listRect.width * 0.5);
    if (Math.abs(delta) < 1) return;

    const targetLeft = this.listEl.scrollLeft + delta;
    this.listEl.scrollTo({ left: targetLeft, behavior });

    if (this.diagnostics.getMode() !== 'default') {
      this.diagnostics.debug('timeline', 'center-active', 'Centered active timeline thumbnail', {
        index,
        delta: Math.round(delta),
        targetLeft: Math.round(targetLeft),
        behavior,
      });
    }
  }

  private onPrevPage = (): void => {
    this.listEl.scrollBy({ left: -this.listEl.clientWidth * 0.8, behavior: this.preferredScrollBehavior() });
  };

  private onNextPage = (): void => {
    this.listEl.scrollBy({ left: this.listEl.clientWidth * 0.8, behavior: this.preferredScrollBehavior() });
  };

  private onScroll = (): void => {
    this.renderWindowFromScroll();
    this.updateScrollState();
  };

  private onResize = (): void => {
    if (this.virtualized) this.renderWindowAround(this.currentIndex);
    this.updateScrollState();
  };

  private updateCounter(): void {
    this.counterEl.textContent = `${this.currentIndex + 1} / ${this.artworks.length}`;
  }

  private updateScrollState(): void {
    this.updateCounter();
    const maxLeft = Math.max(0, this.listEl.scrollWidth - this.listEl.clientWidth - 1);
    const atStart = this.listEl.scrollLeft <= 1;
    const atEnd = this.listEl.scrollLeft >= maxLeft;
    this.prevButton.disabled = atStart;
    this.nextButton.disabled = atEnd;
    this.el.classList.toggle('timeline--at-start', atStart);
    this.el.classList.toggle('timeline--at-end', atEnd);
  }

  private preferredScrollBehavior(): ScrollBehavior {
    if (document.documentElement.dataset.motion === 'reduced') return 'auto';
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    } catch {
      return 'smooth';
    }
  }

  async prewarmUnderOverlay(): Promise<{ thumbsReady: number; imagesDecoded: number; imagesFailed: number }> {
    const decodePromises: Array<Promise<'decoded' | 'failed'>> = [];
    for (let i = 0; i < this.artworks.length; i += 1) {
      const thumb = this.ensureThumb(i);
      if (!thumb) continue;
      const img = thumb.querySelector<HTMLImageElement>('.timeline__img');
      if (!img) continue;
      img.loading = 'eager';
      void thumb.offsetWidth;
      void thumb.getBoundingClientRect();
      if (typeof img.decode === 'function') {
        decodePromises.push(img.decode().then(() => 'decoded' as const).catch(() => 'failed' as const));
      }
    }
    void this.el.offsetHeight;
    void this.listEl.scrollWidth;
    void getComputedStyle(this.el).opacity;
    const decoded = await Promise.allSettled(decodePromises);
    let imagesDecoded = 0;
    let imagesFailed = 0;
    decoded.forEach((result) => {
      if (result.status === 'fulfilled' && result.value === 'decoded') imagesDecoded += 1;
      else imagesFailed += 1;
    });
    this.updateScrollState();
    this.diagnostics.info('timeline', 'prewarm-under-overlay', 'Timeline DOM and thumbnail images prebuilt under loading overlay', {
      thumbsReady: this.thumbs.filter(Boolean).length,
      imagesDecoded,
      imagesFailed,
      virtualized: this.virtualized,
    });
    return {
      thumbsReady: this.thumbs.filter(Boolean).length,
      imagesDecoded,
      imagesFailed,
    };
  }

  onSelect(cb: (index: number) => void): void {
    this.onSelectCallback = cb;
  }

  onPreview(cb: (index: number) => void): void {
    this.onPreviewCallback = cb;
  }

  dispose(): void {
    this.prevButton.removeEventListener('click', this.onPrevPage);
    this.nextButton.removeEventListener('click', this.onNextPage);
    this.listEl.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    this.thumbs.forEach((thumb) => thumb?.removeEventListener('keydown', this.handleThumbKey));
    this.thumbs.length = 0;
    this.items.length = 0;
    this.el.remove();
  }
}
