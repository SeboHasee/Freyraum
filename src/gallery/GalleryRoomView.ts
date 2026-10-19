import type { Artwork } from '../config/artworks';
import type { GalleryRoomView as GalleryRoomViewConfig } from '../config/museumHub';
import { resolveArtworkImageSources } from '../utils/artworkImageSources';
import { projectGalleryRoomArtwork } from './galleryRoomViewGeometry';

function resolveBackgroundUrl(src: string): string {
  const path = src.replace(/^Backgrounds\//, 'backgrounds/');
  return new URL(`${import.meta.env.BASE_URL}${path}`, window.location.href).href;
}

export class GalleryRoomView {
  readonly element: HTMLElement;
  private readonly background: HTMLImageElement;
  private readonly artworkImage: HTMLImageElement;
  private readonly status: HTMLElement;
  private readonly viewSelect: HTMLSelectElement;
  private readonly closeButton: HTMLButtonElement;
  private readonly resizeObserver: ResizeObserver | null;
  private views: readonly GalleryRoomViewConfig[];
  private activeView: GalleryRoomViewConfig | null = null;
  private activeArtwork: Artwork | null = null;
  private fallbackUrl: string | null = null;
  private useFallback = false;
  private enabled = false;
  private visible = false;
  private disposed = false;

  constructor(
    container: HTMLElement,
    views: readonly GalleryRoomViewConfig[],
    private readonly onClose: () => void,
    private readonly onVisibilityChange: (visible: boolean) => void
  ) {
    this.views = views;
    const root = document.createElement('section');
    root.className = 'gallery-room-view';
    root.hidden = true;
    root.setAttribute('aria-label', 'Fotografische Raumansicht');
    this.element = root;

    const background = document.createElement('img');
    background.className = 'gallery-room-view__background';
    background.alt = '';
    background.draggable = false;
    background.decoding = 'async';
    background.addEventListener('error', this.onBackgroundError);
    this.background = background;

    const artworkImage = document.createElement('img');
    artworkImage.className = 'gallery-room-view__artwork';
    artworkImage.alt = '';
    artworkImage.draggable = false;
    artworkImage.decoding = 'async';
    artworkImage.addEventListener('load', this.updateArtworkTransform);
    artworkImage.addEventListener('error', this.onArtworkError);
    this.artworkImage = artworkImage;

    const controls = document.createElement('div');
    controls.className = 'gallery-room-view__controls';
    const label = document.createElement('label');
    label.className = 'gallery-room-view__label';
    label.textContent = 'Raum';
    const select = document.createElement('select');
    select.className = 'gallery-room-view__select';
    select.setAttribute('aria-label', 'Raumansicht auswählen');
    select.addEventListener('change', () => {
      const selected = this.views.find((view) => view.id === select.value);
      if (selected) this.setView(selected.id);
    });
    this.viewSelect = select;

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'gallery-room-view__close';
    close.textContent = 'Zurück zur Galerie';
    close.setAttribute('aria-label', 'Fotografische Raumansicht schließen und zur Galerie zurückkehren');
    close.addEventListener('click', this.onClose);
    this.closeButton = close;
    label.appendChild(select);
    controls.append(label, close);

    const status = document.createElement('p');
    status.className = 'gallery-room-view__status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    this.status = status;
    root.append(background, artworkImage, controls, status);
    container.appendChild(root);

    this.resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(this.updateArtworkTransform);
    this.resizeObserver?.observe(root);
    window.addEventListener('resize', this.updateArtworkTransform, { passive: true });
    this.setViews(views);
  }

  setViews(views: readonly GalleryRoomViewConfig[]): void {
    this.views = views;
    const previousId = this.activeView?.id;
    this.viewSelect.replaceChildren(...views.map((view) => {
      const option = document.createElement('option');
      option.value = view.id;
      option.textContent = view.name;
      return option;
    }));
    const next = views.find((view) => view.id === previousId) ?? views[0] ?? null;
    this.viewSelect.disabled = views.length < 2;
    if (next) this.setView(next.id);
    else {
      this.activeView = null;
      this.setVisible(false);
      this.background.removeAttribute('src');
      this.artworkImage.removeAttribute('src');
    }
    this.element.classList.toggle('gallery-room-view--single', views.length < 2);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled && this.views.length > 0;
    if (!this.enabled) this.setVisible(false);
  }

  toggle(): void {
    if (!this.enabled) return;
    this.setVisible(!this.visible);
  }

  setArtwork(artwork: Artwork | null): void {
    this.activeArtwork = artwork;
    this.useFallback = false;
    this.fallbackUrl = null;
    if (!artwork) {
      this.artworkImage.removeAttribute('src');
      return;
    }
    this.artworkImage.alt = artwork.title ? `Ausgewähltes Kunstwerk: ${artwork.title}` : 'Ausgewähltes Kunstwerk';
    const sources = resolveArtworkImageSources(artwork);
    this.fallbackUrl = sources.fallback?.resolvedUrl ?? null;
    const nextUrl = sources.primary?.resolvedUrl ?? this.fallbackUrl;
    if (nextUrl) this.artworkImage.src = nextUrl;
    else this.showError('Das ausgewählte Kunstwerk ist nicht verfügbar.');
    this.updateArtworkTransform();
  }

  setVisible(visible: boolean): void {
    this.visible = visible && this.enabled && this.activeView !== null;
    this.element.hidden = !this.visible;
    this.element.setAttribute('aria-hidden', String(!this.visible));
    this.onVisibilityChange(this.visible);
    if (this.visible) {
      this.status.textContent = '';
      this.closeButton.focus({ preventScroll: true });
      this.updateArtworkTransform();
    }
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.resizeObserver?.disconnect();
    window.removeEventListener('resize', this.updateArtworkTransform);
    this.background.removeEventListener('error', this.onBackgroundError);
    this.artworkImage.removeEventListener('load', this.updateArtworkTransform);
    this.artworkImage.removeEventListener('error', this.onArtworkError);
    this.element.remove();
  }

  private setView(id: string): void {
    const view = this.views.find((candidate) => candidate.id === id);
    if (!view || view === this.activeView) return;
    this.activeView = view;
    this.viewSelect.value = view.id;
    this.status.textContent = '';
    this.background.src = resolveBackgroundUrl(view.background.src);
    this.updateArtworkTransform();
  }

  private updateArtworkTransform = (): void => {
    if (!this.activeView || !this.activeArtwork || !this.artworkImage.complete) return;
    const width = this.artworkImage.naturalWidth;
    const height = this.artworkImage.naturalHeight;
    if (!(width > 0 && height > 0)) return;
    const rect = this.element.getBoundingClientRect();
    const transform = projectGalleryRoomArtwork(
      this.activeView,
      width / height,
      width,
      height,
      rect.width,
      rect.height
    );
    if (!transform) {
      this.showError('Die Bildplatzierung in diesem Raum ist ungültig.');
      return;
    }
    this.element.classList.remove('has-error');
    this.status.textContent = '';
    this.artworkImage.style.width = `${transform.width}px`;
    this.artworkImage.style.height = `${transform.height}px`;
    this.artworkImage.style.transform = transform.transform;
  };

  private onBackgroundError = (): void => {
    this.showError(`Der Raum „${this.activeView?.name ?? ''}“ konnte nicht geladen werden.`);
  };

  private onArtworkError = (): void => {
    if (!this.useFallback && this.fallbackUrl && this.artworkImage.src !== this.fallbackUrl) {
      this.useFallback = true;
      this.artworkImage.src = this.fallbackUrl;
      return;
    }
    this.showError('Das ausgewählte Kunstwerk konnte nicht geladen werden.');
  };

  private showError(message: string): void {
    this.status.textContent = message;
    this.element.classList.add('has-error');
  }
}
