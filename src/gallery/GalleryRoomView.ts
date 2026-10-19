import type { Artwork } from '../config/artworks';
import type { GalleryRoomView as GalleryRoomViewConfig } from '../config/museumHub';
import { resolveArtworkImageSources } from '../utils/artworkImageSources';
import { projectGalleryRoomArtwork } from './galleryRoomViewGeometry';

const MIN_CAMERA_SCALE = 1;
const MAX_CAMERA_SCALE = 4;

interface PhotoPointer {
  x: number;
  y: number;
}

type CameraGesture =
  | { kind: 'pan'; pointerId: number; startX: number; startY: number; offsetX: number; offsetY: number }
  | {
      kind: 'pinch';
      distance: number;
      centerX: number;
      centerY: number;
      scale: number;
      offsetX: number;
      offsetY: number;
    };

function resolveBackgroundUrl(src: string): string {
  const filename = src.replace(/^Backgrounds\//, '');
  return new URL(`${import.meta.env.BASE_URL}backgrounds/${filename}`, window.location.href).href;
}

function pointerDistance(first: PhotoPointer, second: PhotoPointer): number {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function pointerCenter(first: PhotoPointer, second: PhotoPointer): PhotoPointer {
  return { x: (first.x + second.x) * 0.5, y: (first.y + second.y) * 0.5 };
}

export class GalleryRoomView {
  readonly element: HTMLElement;
  private readonly scene: HTMLElement;
  private readonly background: HTMLImageElement;
  private readonly artworkImage: HTMLImageElement;
  private readonly status: HTMLElement;
  private readonly viewSelect: HTMLSelectElement;
  private readonly zoomOutButton: HTMLButtonElement;
  private readonly zoomInButton: HTMLButtonElement;
  private readonly resetButton: HTMLButtonElement;
  private readonly previousArtworkButton: HTMLButtonElement;
  private readonly nextArtworkButton: HTMLButtonElement;
  private readonly closeButton: HTMLButtonElement;
  private readonly resizeObserver: ResizeObserver | null;
  private readonly pointers = new Map<number, PhotoPointer>();
  private views: readonly GalleryRoomViewConfig[];
  private activeView: GalleryRoomViewConfig | null = null;
  private activeArtwork: Artwork | null = null;
  private fallbackUrl: string | null = null;
  private useFallback = false;
  private cameraScale = 1;
  private cameraOffsetX = 0;
  private cameraOffsetY = 0;
  private gesture: CameraGesture | null = null;
  private enabled = false;
  private visible = false;
  private disposed = false;

  constructor(
    container: HTMLElement,
    views: readonly GalleryRoomViewConfig[],
    private readonly onClose: () => void,
    private readonly onVisibilityChange: (visible: boolean) => void,
    private readonly onNavigateArtwork: (direction: -1 | 1) => void
  ) {
    this.views = views;
    const root = document.createElement('section');
    root.className = 'gallery-room-view';
    root.hidden = true;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Fotografische Raumansicht');
    root.setAttribute('aria-hidden', 'true');
    this.element = root;

    const scene = document.createElement('div');
    scene.className = 'gallery-room-view__scene';
    scene.addEventListener('pointerdown', this.onPointerDown);
    scene.addEventListener('pointermove', this.onPointerMove);
    scene.addEventListener('pointerup', this.onPointerEnd);
    scene.addEventListener('pointercancel', this.onPointerEnd);
    scene.addEventListener('lostpointercapture', this.onPointerEnd);
    scene.addEventListener('wheel', this.onWheel, { passive: false });
    scene.addEventListener('dblclick', this.onDoubleClick);
    this.scene = scene;

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
    scene.append(background, artworkImage);

    const controls = document.createElement('div');
    controls.className = 'gallery-room-view__controls';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'Raumansicht-Steuerung');

    const roomControls = document.createElement('div');
    roomControls.className = 'gallery-room-view__room-controls';
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
    roomControls.append(label, select);

    const artworkControls = document.createElement('div');
    artworkControls.className = 'gallery-room-view__artwork-controls';
    const previousArtwork = this.createControlButton('gallery-room-view__artwork-nav', 'Vorheriges Kunstwerk anzeigen', '‹');
    previousArtwork.addEventListener('click', () => this.onNavigateArtwork(-1));
    this.previousArtworkButton = previousArtwork;
    const nextArtwork = this.createControlButton('gallery-room-view__artwork-nav', 'Nächstes Kunstwerk anzeigen', '›');
    nextArtwork.addEventListener('click', () => this.onNavigateArtwork(1));
    this.nextArtworkButton = nextArtwork;

    const zoomControls = document.createElement('div');
    zoomControls.className = 'gallery-room-view__zoom-controls';
    this.zoomOutButton = this.createControlButton('gallery-room-view__zoom-btn', 'Verkleinern', '−');
    this.zoomOutButton.addEventListener('click', () => this.zoomBy(1 / 1.25));
    this.resetButton = this.createControlButton('gallery-room-view__zoom-btn', 'Ansicht zurücksetzen', '⟲');
    this.resetButton.addEventListener('click', () => this.resetCamera());
    this.zoomInButton = this.createControlButton('gallery-room-view__zoom-btn', 'Vergrößern', '+');
    this.zoomInButton.addEventListener('click', () => this.zoomBy(1.25));
    zoomControls.append(previousArtwork, this.zoomOutButton, this.resetButton, this.zoomInButton, nextArtwork);

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'gallery-room-view__close';
    close.textContent = 'Zurück zur Galerie';
    close.setAttribute('aria-label', 'Fotografische Raumansicht schließen und zur Galerie zurückkehren');
    close.addEventListener('click', this.onClose);
    this.closeButton = close;

    controls.append(roomControls, zoomControls, close);

    const status = document.createElement('p');
    status.className = 'gallery-room-view__status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    this.status = status;
    root.append(scene, controls, status);
    container.appendChild(root);

    this.resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(this.handleResize);
    this.resizeObserver?.observe(root);
    window.addEventListener('resize', this.handleResize, { passive: true });
    root.addEventListener('keydown', this.onKeyDown);
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

  setArtwork(artwork: Artwork | null, hasMultipleArtworks = true): void {
    this.activeArtwork = artwork;
    this.previousArtworkButton.hidden = !hasMultipleArtworks;
    this.nextArtworkButton.hidden = !hasMultipleArtworks;
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
      this.resetCamera();
      this.closeButton.focus({ preventScroll: true });
    } else {
      this.pointers.clear();
      this.gesture = null;
    }
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.resizeObserver?.disconnect();
    window.removeEventListener('resize', this.handleResize);
    this.element.removeEventListener('keydown', this.onKeyDown);
    this.scene.removeEventListener('pointerdown', this.onPointerDown);
    this.scene.removeEventListener('pointermove', this.onPointerMove);
    this.scene.removeEventListener('pointerup', this.onPointerEnd);
    this.scene.removeEventListener('pointercancel', this.onPointerEnd);
    this.scene.removeEventListener('lostpointercapture', this.onPointerEnd);
    this.scene.removeEventListener('wheel', this.onWheel);
    this.scene.removeEventListener('dblclick', this.onDoubleClick);
    this.background.removeEventListener('error', this.onBackgroundError);
    this.artworkImage.removeEventListener('load', this.updateArtworkTransform);
    this.artworkImage.removeEventListener('error', this.onArtworkError);
    this.element.remove();
  }

  private createControlButton(className: string, label: string, text: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = text;
    button.setAttribute('aria-label', label);
    return button;
  }

  private setView(id: string): void {
    const view = this.views.find((candidate) => candidate.id === id);
    if (!view || view === this.activeView) return;
    this.activeView = view;
    this.viewSelect.value = view.id;
    this.status.textContent = '';
    this.element.classList.remove('has-error');
    this.background.src = resolveBackgroundUrl(view.background.src);
    this.resetCamera();
  }

  private applyCamera(): void {
    const rect = this.element.getBoundingClientRect();
    const maxOffsetX = Math.max(0, rect.width * (this.cameraScale - 1));
    const maxOffsetY = Math.max(0, rect.height * (this.cameraScale - 1));
    this.cameraOffsetX = Math.min(0, Math.max(-maxOffsetX, this.cameraOffsetX));
    this.cameraOffsetY = Math.min(0, Math.max(-maxOffsetY, this.cameraOffsetY));
    this.scene.style.transform = `translate3d(${this.cameraOffsetX}px, ${this.cameraOffsetY}px, 0) scale(${this.cameraScale})`;
    this.zoomOutButton.disabled = this.cameraScale <= MIN_CAMERA_SCALE;
    this.zoomInButton.disabled = this.cameraScale >= MAX_CAMERA_SCALE;
    this.resetButton.disabled = this.cameraScale === MIN_CAMERA_SCALE
      && this.cameraOffsetX === 0 && this.cameraOffsetY === 0;
    this.updateArtworkTransform();
  }

  private setCamera(scale: number, offsetX: number, offsetY: number): void {
    this.cameraScale = Math.max(MIN_CAMERA_SCALE, Math.min(MAX_CAMERA_SCALE, scale));
    this.cameraOffsetX = offsetX;
    this.cameraOffsetY = offsetY;
    this.applyCamera();
  }

  private zoomAt(scale: number, focusX: number, focusY: number): void {
    const nextScale = Math.max(MIN_CAMERA_SCALE, Math.min(MAX_CAMERA_SCALE, scale));
    const contentX = (focusX - this.cameraOffsetX) / this.cameraScale;
    const contentY = (focusY - this.cameraOffsetY) / this.cameraScale;
    this.setCamera(nextScale, focusX - contentX * nextScale, focusY - contentY * nextScale);
  }

  private zoomBy(factor: number): void {
    const rect = this.element.getBoundingClientRect();
    this.zoomAt(this.cameraScale * factor, rect.width * 0.5, rect.height * 0.5);
  }

  private resetCamera(): void {
    this.setCamera(MIN_CAMERA_SCALE, 0, 0);
  }

  private handleResize = (): void => {
    this.applyCamera();
  };

  private updateArtworkTransform = (): void => {
    if (!this.activeView || !this.activeArtwork || !this.artworkImage.complete) return;
    const width = this.artworkImage.naturalWidth;
    const height = this.artworkImage.naturalHeight;
    if (!(width > 0 && height > 0)) return;
    const rect = this.element.getBoundingClientRect();
    if (!(rect.width > 0 && rect.height > 0)) return;
    const transform = projectGalleryRoomArtwork(
      this.activeView,
      width / height,
      width,
      height,
      rect.width,
      rect.height,
      { scale: this.cameraScale, offsetX: this.cameraOffsetX, offsetY: this.cameraOffsetY }
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

  private onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    const point = this.pointerPosition(event);
    this.pointers.set(event.pointerId, point);
    this.scene.setPointerCapture(event.pointerId);
    event.preventDefault();
    this.beginGesture();
  };

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.pointers.has(event.pointerId)) return;
    this.pointers.set(event.pointerId, this.pointerPosition(event));
    const points = [...this.pointers.entries()];
    if (this.gesture?.kind === 'pan' && points.length === 1 && points[0]![0] === this.gesture.pointerId) {
      const point = points[0]![1];
      this.setCamera(
        this.cameraScale,
        this.gesture.offsetX + point.x - this.gesture.startX,
        this.gesture.offsetY + point.y - this.gesture.startY
      );
      return;
    }
    if (this.gesture?.kind === 'pinch' && points.length >= 2) {
      const first = points[0]![1];
      const second = points[1]![1];
      const center = pointerCenter(first, second);
      const distance = Math.max(1, pointerDistance(first, second));
      const scale = this.gesture.scale * distance / this.gesture.distance;
      const contentX = (this.gesture.centerX - this.gesture.offsetX) / this.gesture.scale;
      const contentY = (this.gesture.centerY - this.gesture.offsetY) / this.gesture.scale;
      this.setCamera(scale, center.x - contentX * scale, center.y - contentY * scale);
    }
  };

  private onPointerEnd = (event: PointerEvent): void => {
    if (!this.pointers.delete(event.pointerId)) return;
    if (this.scene.hasPointerCapture(event.pointerId)) this.scene.releasePointerCapture(event.pointerId);
    this.beginGesture();
  };

  private beginGesture(): void {
    const entries = [...this.pointers.entries()];
    if (entries.length >= 2) {
      const first = entries[0]![1];
      const second = entries[1]![1];
      const center = pointerCenter(first, second);
      this.gesture = {
        kind: 'pinch',
        distance: Math.max(1, pointerDistance(first, second)),
        centerX: center.x,
        centerY: center.y,
        scale: this.cameraScale,
        offsetX: this.cameraOffsetX,
        offsetY: this.cameraOffsetY,
      };
    } else if (entries.length === 1) {
      const [pointerId, point] = entries[0]!;
      this.gesture = {
        kind: 'pan',
        pointerId,
        startX: point.x,
        startY: point.y,
        offsetX: this.cameraOffsetX,
        offsetY: this.cameraOffsetY,
      };
    } else {
      this.gesture = null;
    }
    this.scene.classList.toggle('is-dragging', entries.length > 0);
  }

  private pointerPosition(event: PointerEvent): PhotoPointer {
    const rect = this.element.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  private onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    const rect = this.element.getBoundingClientRect();
    this.zoomAt(
      this.cameraScale * Math.exp(-event.deltaY * 0.001),
      event.clientX - rect.left,
      event.clientY - rect.top
    );
  };

  private onDoubleClick = (): void => {
    this.resetCamera();
  };

  private onKeyDown = (event: KeyboardEvent): void => {
    if (!this.visible) return;
    event.stopPropagation();
    if (event.key === 'Escape') {
      event.preventDefault();
      this.onClose();
      return;
    }
    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      this.zoomBy(1.25);
    } else if (event.key === '-') {
      event.preventDefault();
      this.zoomBy(1 / 1.25);
    } else if (event.key === '0' || event.key === 'Home') {
      event.preventDefault();
      this.resetCamera();
    } else if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  };

  private trapFocus(event: KeyboardEvent): void {
    const focusable = [...this.element.querySelectorAll<HTMLElement>(
      'button:not([hidden]):not(:disabled), select:not(:disabled)'
    )];
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (event.shiftKey && (document.activeElement === first || !this.element.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !this.element.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  }

  private onBackgroundError = (): void => {
    this.showError(`Der Raum „${this.activeView?.name ?? ''}“ konnte nicht geladen werden. Bitte führen Sie „Update Gallery“ erneut aus.`);
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
