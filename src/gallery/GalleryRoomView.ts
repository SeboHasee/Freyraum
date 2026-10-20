import type { Artwork } from '../config/artworks';
import type { GalleryRoomView as GalleryRoomViewConfig } from '../config/museumHub';
import { resolveArtworkImageSources } from '../utils/artworkImageSources';
import { smoothDamp } from '../utils/math';
import { projectGalleryRoomArtwork } from './galleryRoomViewGeometry';
import {
  normalizeDeviceArtworkTilt,
  requestDeviceOrientationAccess,
  smoothDeviceArtworkTilt,
  type DeviceArtworkTilt,
} from './deviceOrientation';

const MIN_CAMERA_SCALE = 1;
const MAX_CAMERA_SCALE = 6;
const CAMERA_ZOOM_LAMBDA = 4;
const HOVER_TILT_MAX_DEG = 0.14;
const HOVER_INFLUENCE_RADIUS_PX = 900;

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
  private readonly artworkFrame: HTMLDivElement;
  private readonly artworkImage: HTMLImageElement;
  private readonly status: HTMLElement;
  private readonly viewSelect: HTMLSelectElement;
  private readonly zoomOutButton: HTMLButtonElement;
  private readonly zoomInButton: HTMLButtonElement;
  private readonly resetButton: HTMLButtonElement;
  private readonly motionToggleButton: HTMLButtonElement;
  private readonly closeButton: HTMLButtonElement;
  private readonly utilityControls: HTMLDivElement;
  private readonly timelineHost: HTMLDivElement;
  private readonly resizeObserver: ResizeObserver | null;
  private readonly pointers = new Map<number, PhotoPointer>();
  private readonly motionPreference: MediaQueryList;
  private views: readonly GalleryRoomViewConfig[];
  private activeView: GalleryRoomViewConfig | null = null;
  private activeArtwork: Artwork | null = null;
  private fallbackUrl: string | null = null;
  private useFallback = false;
  private cameraScale = 1;
  private cameraOffsetX = 0;
  private cameraOffsetY = 0;
  private artworkCenter: PhotoPointer | null = null;
  private cameraAnimationFrame = 0;
  private cameraAnimationTargetScale: number | null = null;
  private motionTiltEnabled = false;
  private motionPermissionPending = false;
  private motionListenersAttached = false;
  private motionVisibilityListenerAttached = false;
  private motionNeutral: PhotoPointer | null = null;
  private motionTiltCurrent: DeviceArtworkTilt = { tiltX: 0, tiltY: 0 };
  private motionTiltTarget: DeviceArtworkTilt = { tiltX: 0, tiltY: 0 };
  private motionTiltFrame = 0;
  private motionTiltLastFrameAt = 0;
  private motionModeObserver: MutationObserver | null = null;
  private gesture: CameraGesture | null = null;
  private timelineElement: HTMLElement | null = null;
  private timelineOriginalParent: HTMLElement | null = null;
  private timelineOriginalNextSibling: Node | null = null;
  private timelineOriginalLabel: string | null = null;
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
    this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
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
    scene.addEventListener('pointermove', this.onRoomPointerMove);
    scene.addEventListener('pointerleave', this.resetArtworkInteraction);
    scene.addEventListener('pointerup', this.onPointerEnd);
    scene.addEventListener('pointercancel', this.onPointerEnd);
    scene.addEventListener('lostpointercapture', this.onPointerEnd);
    scene.addEventListener('wheel', this.onWheel, { passive: false });
    scene.addEventListener('dblclick', this.onDoubleClick);
    this.scene = scene;

    const artworkFrame = document.createElement('div');
    artworkFrame.className = 'gallery-room-view__artwork-frame';
    artworkFrame.setAttribute('role', 'img');
    artworkFrame.tabIndex = 0;
    artworkFrame.addEventListener('focus', this.onArtworkFocus);
    artworkFrame.addEventListener('blur', this.resetArtworkInteraction);
    this.artworkFrame = artworkFrame;

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
    artworkFrame.appendChild(artworkImage);
    scene.append(background, artworkFrame);

    const header = document.createElement('header');
    header.className = 'gallery-room-view__header';
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'topbar__back-btn gallery-room-view__back';
    close.setAttribute('aria-label', 'Zurück zur Galerie');
    close.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      <span class="topbar__back-btn-label--full">Zurück zur Galerie</span>
      <span class="topbar__back-btn-label--short">Galerie</span>
    `;
    close.addEventListener('click', this.onClose);
    this.closeButton = close;

    const roomControls = document.createElement('label');
    roomControls.className = 'gallery-room-view__room-controls';
    const roomLabel = document.createElement('span');
    roomLabel.className = 'gallery-room-view__room-label';
    roomLabel.textContent = 'Raum';
    const select = document.createElement('select');
    select.className = 'gallery-room-view__select';
    select.setAttribute('aria-label', 'Raumansicht auswählen');
    select.addEventListener('change', () => {
      const selected = this.views.find((view) => view.id === select.value);
      if (selected) this.setView(selected.id);
    });
    this.viewSelect = select;
    roomControls.append(roomLabel, select);
    header.append(close, roomControls);

    const utilityControls = document.createElement('div');
    utilityControls.className = 'gallery-room-view__utilities';
    utilityControls.setAttribute('role', 'group');
    utilityControls.setAttribute('aria-label', 'Weitere Galerieeinstellungen');
    this.utilityControls = utilityControls;
    const zoomControls = document.createElement('div');
    zoomControls.className = 'zoom-controls gallery-room-view__zoom-controls';
    zoomControls.setAttribute('role', 'group');
    zoomControls.setAttribute('aria-label', 'Zoom-Steuerung für den Fotoraum');
    this.zoomInButton = this.createControlButton('zoom-controls__btn', 'Vergrößern', '＋');
    this.zoomInButton.addEventListener('click', () => this.zoomBy(1.25));
    this.zoomOutButton = this.createControlButton('zoom-controls__btn', 'Verkleinern', '−');
    this.zoomOutButton.addEventListener('click', () => this.zoomBy(1 / 1.25));
    this.resetButton = this.createControlButton(
      'zoom-controls__btn zoom-controls__btn--reset',
      'Fotoansicht zurücksetzen',
      '⟲'
    );
    this.resetButton.addEventListener('click', () => this.resetCamera(true));
    this.motionToggleButton = this.createControlButton(
      'zoom-controls__btn gallery-room-view__motion-toggle',
      'Bewegungssteuerung aktivieren',
      '↗'
    );
    this.motionToggleButton.setAttribute('aria-pressed', 'false');
    this.motionToggleButton.addEventListener('click', () => {
      void this.toggleDeviceMotionTilt();
    });
    zoomControls.append(this.zoomInButton, this.zoomOutButton, this.resetButton);
    zoomControls.appendChild(this.motionToggleButton);
    this.motionToggleButton.title =
      'Gerät bewegen, um das Kunstwerk sanft zu neigen. Antippen, um die Bewegungssteuerung zu aktivieren.';

    const timelineHost = document.createElement('div');
    timelineHost.className = 'gallery-room-view__timeline-host';
    this.timelineHost = timelineHost;

    const status = document.createElement('p');
    status.className = 'gallery-room-view__status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    this.status = status;
    root.append(scene, header, utilityControls, timelineHost, zoomControls, status);
    container.appendChild(root);

    this.resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(this.handleResize);
    this.resizeObserver?.observe(root);
    window.addEventListener('resize', this.handleResize, { passive: true });
    this.motionPreference.addEventListener('change', this.onMotionPreferenceChange);
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

  setUtilityControls(controls: readonly HTMLElement[]): void {
    this.utilityControls.replaceChildren(...controls);
  }

  setTimelineElement(timeline: HTMLElement): void {
    this.timelineElement = timeline;
    this.timelineOriginalParent = timeline.parentElement;
    this.timelineOriginalNextSibling = timeline.nextSibling;
    this.timelineOriginalLabel = timeline.getAttribute('aria-label');
    this.updateTimelinePlacement();
  }

  get isVisible(): boolean {
    return this.visible;
  }

  toggle(): void {
    if (!this.enabled) return;
    this.setVisible(!this.visible);
  }

  setArtwork(
    artwork: Artwork | null,
    hasMultipleArtworks = true,
    artworkIndex = 0,
    artworkCount = hasMultipleArtworks ? 2 : 1
  ): void {
    this.resetArtworkInteraction();
    this.artworkCenter = null;
    this.activeArtwork = artwork;
    this.useFallback = false;
    this.fallbackUrl = null;
    if (!artwork) {
      this.artworkFrame.hidden = true;
      this.artworkImage.removeAttribute('src');
      return;
    }
    this.artworkFrame.hidden = false;
    const title = artwork.title || artwork.id;
    this.artworkFrame.setAttribute(
      'aria-label',
      `${artwork.alt || title}${hasMultipleArtworks ? `, ${artworkIndex + 1} von ${artworkCount}` : ''}`
    );
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
    if (!this.visible) this.disableDeviceMotionTilt();
    this.updateTimelinePlacement();
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
    if (this.cameraAnimationFrame) window.cancelAnimationFrame(this.cameraAnimationFrame);
    this.disableDeviceMotionTilt();
    this.resizeObserver?.disconnect();
    window.removeEventListener('resize', this.handleResize);
    this.motionPreference.removeEventListener('change', this.onMotionPreferenceChange);
    this.element.removeEventListener('keydown', this.onKeyDown);
    this.scene.removeEventListener('pointerdown', this.onPointerDown);
    this.scene.removeEventListener('pointermove', this.onPointerMove);
    this.scene.removeEventListener('pointermove', this.onRoomPointerMove);
    this.scene.removeEventListener('pointerleave', this.resetArtworkInteraction);
    this.scene.removeEventListener('pointerup', this.onPointerEnd);
    this.scene.removeEventListener('pointercancel', this.onPointerEnd);
    this.scene.removeEventListener('lostpointercapture', this.onPointerEnd);
    this.scene.removeEventListener('wheel', this.onWheel);
    this.scene.removeEventListener('dblclick', this.onDoubleClick);
    this.artworkFrame.removeEventListener('focus', this.onArtworkFocus);
    this.artworkFrame.removeEventListener('blur', this.resetArtworkInteraction);
    this.background.removeEventListener('error', this.onBackgroundError);
    this.artworkImage.removeEventListener('load', this.updateArtworkTransform);
    this.artworkImage.removeEventListener('error', this.onArtworkError);
    this.element.remove();
  }

  private createControlButton(className: string, label: string, text: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    const icon = document.createElement('span');
    icon.className = 'zoom-controls__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = text;
    button.appendChild(icon);
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
    this.resetCamera(true);
    this.updateArtworkTransform();
  }

  private updateTimelinePlacement(): void {
    const timeline = this.timelineElement;
    if (!timeline) return;
    if (this.visible) {
      timeline.classList.add('gallery-room-view__timeline');
      timeline.setAttribute('aria-label', 'Kunstwerke im Fotoraum auswählen');
      this.timelineHost.appendChild(timeline);
      return;
    }
    timeline.classList.remove('gallery-room-view__timeline');
    if (this.timelineOriginalLabel === null) timeline.removeAttribute('aria-label');
    else timeline.setAttribute('aria-label', this.timelineOriginalLabel);
    const parent = this.timelineOriginalParent;
    if (parent) {
      const nextSibling = this.timelineOriginalNextSibling;
      parent.insertBefore(
        timeline,
        nextSibling?.parentNode === parent ? nextSibling : null
      );
    }
  }

  private applyCamera(): void {
    const rect = this.element.getBoundingClientRect();
    const maxOffsetX = Math.max(0, rect.width * (this.cameraScale - 1));
    const maxOffsetY = Math.max(0, rect.height * (this.cameraScale - 1));
    this.cameraOffsetX = Math.min(0, Math.max(-maxOffsetX, this.cameraOffsetX));
    this.cameraOffsetY = Math.min(0, Math.max(-maxOffsetY, this.cameraOffsetY));
    this.scene.style.transform = `translate3d(${this.cameraOffsetX}px, ${this.cameraOffsetY}px, 0) scale(${this.cameraScale})`;
    this.artworkImage.style.setProperty('--artwork-zoom', String(this.cameraScale));
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
    this.stopCameraAnimation();
    const nextScale = Math.max(MIN_CAMERA_SCALE, Math.min(MAX_CAMERA_SCALE, scale));
    const contentX = (focusX - this.cameraOffsetX) / this.cameraScale;
    const contentY = (focusY - this.cameraOffsetY) / this.cameraScale;
    this.setCamera(nextScale, focusX - contentX * nextScale, focusY - contentY * nextScale);
  }

  private zoomBy(factor: number): void {
    const rect = this.element.getBoundingClientRect();
    const targetScale = Math.max(
      MIN_CAMERA_SCALE,
      Math.min(MAX_CAMERA_SCALE, (this.cameraAnimationTargetScale ?? this.cameraScale) * factor)
    );
    const center = this.artworkCenter;
    if (!center || !(rect.width > 0 && rect.height > 0)) {
      this.zoomAt(targetScale, rect.width * 0.5, rect.height * 0.5);
      return;
    }
    this.animateCamera(
      targetScale,
      rect.width * 0.5 - center.x * targetScale,
      rect.height * 0.5 - center.y * targetScale
    );
  }

  private animateCamera(scale: number, offsetX: number, offsetY: number): void {
    this.stopCameraAnimation();
    this.cameraAnimationTargetScale = scale;
    if (this.motionPreference.matches || document.documentElement.dataset['motion'] === 'reduced') {
      this.cameraAnimationTargetScale = null;
      this.setCamera(scale, offsetX, offsetY);
      return;
    }
    let previousAt = performance.now();
    const tick = (now: number): void => {
      const deltaSeconds = Math.max(0, Math.min(0.1, (now - previousAt) / 1000));
      previousAt = now;
      const nextScale = smoothDamp(this.cameraScale, scale, CAMERA_ZOOM_LAMBDA, deltaSeconds);
      const nextOffsetX = smoothDamp(this.cameraOffsetX, offsetX, CAMERA_ZOOM_LAMBDA, deltaSeconds);
      const nextOffsetY = smoothDamp(this.cameraOffsetY, offsetY, CAMERA_ZOOM_LAMBDA, deltaSeconds);
      const settled = Math.abs(scale - nextScale) < 0.001
        && Math.abs(offsetX - nextOffsetX) < 0.5
        && Math.abs(offsetY - nextOffsetY) < 0.5;
      this.setCamera(
        settled ? scale : nextScale,
        settled ? offsetX : nextOffsetX,
        settled ? offsetY : nextOffsetY
      );
      if (!settled) {
        this.cameraAnimationFrame = window.requestAnimationFrame(tick);
      } else {
        this.cameraAnimationFrame = 0;
        this.cameraAnimationTargetScale = null;
      }
    };
    this.cameraAnimationFrame = window.requestAnimationFrame(tick);
  }

  private resetCamera(animate = false): void {
    this.stopCameraAnimation();
    if (animate) this.animateCamera(MIN_CAMERA_SCALE, 0, 0);
    else this.setCamera(MIN_CAMERA_SCALE, 0, 0);
  }

  private stopCameraAnimation(): void {
    if (this.cameraAnimationFrame) window.cancelAnimationFrame(this.cameraAnimationFrame);
    this.cameraAnimationFrame = 0;
    this.cameraAnimationTargetScale = null;
  }

  private handleResize = (): void => {
    if (this.cameraAnimationTargetScale !== null && this.artworkCenter) {
      this.updateArtworkTransform();
      const rect = this.element.getBoundingClientRect();
      const scale = this.cameraAnimationTargetScale;
      this.animateCamera(
        scale,
        rect.width * 0.5 - this.artworkCenter.x * scale,
        rect.height * 0.5 - this.artworkCenter.y * scale
      );
      return;
    }
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
      rect.height
    );
    if (!transform) {
      this.showError('Die Bildplatzierung in diesem Raum ist ungültig.');
      return;
    }
    this.element.classList.remove('has-error');
    this.status.textContent = '';
    this.artworkFrame.style.width = `${transform.width}px`;
    this.artworkFrame.style.height = `${transform.height}px`;
    this.artworkFrame.style.transform = transform.transform;
    this.artworkCenter = transform.center;
  };

  private onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    this.stopCameraAnimation();
    this.resetArtworkInteraction();
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

  private onRoomPointerMove = (event: PointerEvent): void => {
    if (event.pointerType !== 'mouse' || this.pointers.size > 0 || this.motionTiltEnabled) return;
    if (document.documentElement.dataset['motion'] === 'reduced' || this.motionPreference.matches) {
      this.resetArtworkInteraction();
      return;
    }
    const rect = this.artworkFrame.getBoundingClientRect();
    if (!(rect.width > 0 && rect.height > 0)) return;
    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.5;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const nearestX = Math.max(rect.left, Math.min(rect.right, event.clientX));
    const nearestY = Math.max(rect.top, Math.min(rect.bottom, event.clientY));
    const distance = Math.hypot(event.clientX - nearestX, event.clientY - nearestY);
    const influenceRadius = Math.max(
      300,
      Math.min(HOVER_INFLUENCE_RADIUS_PX, Math.min(this.element.clientWidth, this.element.clientHeight) * 0.6)
    );
    const influence = Math.max(0, 1 - distance / influenceRadius);
    const smoothInfluence = influence * influence * (3 - 2 * influence);
    this.scene.classList.toggle('has-artwork-proximity', smoothInfluence > 0);
    const x = Math.max(-1, Math.min(1, dx / Math.max(rect.width * 0.5, 1)));
    const y = Math.max(-1, Math.min(1, dy / Math.max(rect.height * 0.5, 1)));
    this.artworkImage.style.setProperty('--artwork-tilt-x', `${-y * HOVER_TILT_MAX_DEG * smoothInfluence}deg`);
    this.artworkImage.style.setProperty('--artwork-tilt-y', `${x * HOVER_TILT_MAX_DEG * smoothInfluence}deg`);
  };

  private toggleDeviceMotionTilt = async (): Promise<void> => {
    if (this.motionTiltEnabled) {
      this.disableDeviceMotionTilt();
      return;
    }
    if (this.motionPermissionPending) return;
    if (this.isReducedMotion()) {
      this.showError('Die Bewegungssteuerung ist bei reduzierter Bewegung deaktiviert.');
      return;
    }
    const orientation = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    this.motionPermissionPending = true;
    this.motionToggleButton.disabled = true;
    try {
      const access = await requestDeviceOrientationAccess({
        secureContext: window.isSecureContext,
        supported: typeof orientation === 'function',
        requestPermission: orientation?.requestPermission
          ? () => orientation.requestPermission!()
          : undefined,
      });
      if (!this.visible) return;
      if (access !== 'granted') {
        this.showError(
          access === 'denied'
            ? 'Bewegungszugriff wurde nicht erlaubt. Du kannst das Kunstwerk weiterhin berühren.'
            : 'Bewegungssteuerung ist auf diesem Gerät nicht verfügbar.'
        );
        return;
      }
      this.status.textContent = '';
      this.motionTiltEnabled = true;
      this.motionToggleButton.setAttribute('aria-pressed', 'true');
      this.motionToggleButton.setAttribute('aria-label', 'Bewegungssteuerung deaktivieren');
      document.addEventListener('visibilitychange', this.onMotionVisibilityChange);
      this.motionVisibilityListenerAttached = true;
      this.attachDeviceMotionListeners();
      this.observeMotionPreference();
    } finally {
      this.motionPermissionPending = false;
      this.motionToggleButton.disabled = false;
    }
  };

  private attachDeviceMotionListeners(): void {
    if (!this.motionTiltEnabled || !this.visible || document.hidden || this.motionListenersAttached) return;
    this.motionNeutral = null;
    window.addEventListener('deviceorientation', this.onDeviceOrientation);
    window.addEventListener('orientationchange', this.onDeviceScreenOrientationChange);
    window.screen.orientation?.addEventListener('change', this.onDeviceScreenOrientationChange);
    this.motionListenersAttached = true;
  }

  private detachDeviceMotionListeners(): void {
    if (!this.motionListenersAttached) return;
    window.removeEventListener('deviceorientation', this.onDeviceOrientation);
    window.removeEventListener('orientationchange', this.onDeviceScreenOrientationChange);
    window.screen.orientation?.removeEventListener('change', this.onDeviceScreenOrientationChange);
    this.motionListenersAttached = false;
  }

  private disableDeviceMotionTilt(): void {
    this.motionTiltEnabled = false;
    this.detachDeviceMotionListeners();
    if (this.motionVisibilityListenerAttached) {
      document.removeEventListener('visibilitychange', this.onMotionVisibilityChange);
      this.motionVisibilityListenerAttached = false;
    }
    this.motionModeObserver?.disconnect();
    this.motionModeObserver = null;
    if (this.motionTiltFrame) window.cancelAnimationFrame(this.motionTiltFrame);
    this.motionTiltFrame = 0;
    this.motionTiltLastFrameAt = 0;
    this.motionNeutral = null;
    this.motionTiltCurrent = { tiltX: 0, tiltY: 0 };
    this.motionTiltTarget = { tiltX: 0, tiltY: 0 };
    this.motionToggleButton.setAttribute('aria-pressed', 'false');
    this.motionToggleButton.setAttribute('aria-label', 'Bewegungssteuerung aktivieren');
    this.resetArtworkInteraction();
  }

  private observeMotionPreference(): void {
    if (typeof MutationObserver === 'undefined') return;
    this.motionModeObserver = new MutationObserver(() => {
      if (this.isReducedMotion()) this.disableDeviceMotionTilt();
    });
    this.motionModeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-motion'],
    });
  }

  private isReducedMotion(): boolean {
    return this.motionPreference.matches || document.documentElement.dataset['motion'] === 'reduced';
  }

  private onDeviceOrientation = (event: DeviceOrientationEvent): void => {
    if (!this.motionTiltEnabled || this.pointers.size > 0) return;
    if (this.isReducedMotion()) {
      this.disableDeviceMotionTilt();
      return;
    }
    if (!Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return;
    if (!this.motionNeutral) {
      this.motionNeutral = { x: event.beta!, y: event.gamma! };
      return;
    }
    const screenAngle = window.screen.orientation?.angle ?? 0;
    this.motionTiltTarget = normalizeDeviceArtworkTilt(
      event.beta!,
      event.gamma!,
      screenAngle,
      this.motionNeutral.x,
      this.motionNeutral.y
    );
    if (!this.motionTiltFrame) {
      this.motionTiltLastFrameAt = performance.now();
      this.motionTiltFrame = window.requestAnimationFrame(this.animateDeviceTilt);
    }
  };

  private animateDeviceTilt = (now: number): void => {
    this.motionTiltFrame = 0;
    if (!this.motionTiltEnabled || !this.visible) return;
    const deltaSeconds = Math.min(0.1, Math.max(0, (now - this.motionTiltLastFrameAt) / 1000));
    this.motionTiltLastFrameAt = now;
    this.motionTiltCurrent = smoothDeviceArtworkTilt(
      this.motionTiltCurrent,
      this.motionTiltTarget,
      deltaSeconds
    );
    const active = Math.abs(this.motionTiltCurrent.tiltX) + Math.abs(this.motionTiltCurrent.tiltY) > 0.01;
    this.scene.classList.toggle('has-artwork-proximity', active);
    this.artworkImage.style.setProperty('--artwork-tilt-x', `${this.motionTiltCurrent.tiltX}deg`);
    this.artworkImage.style.setProperty('--artwork-tilt-y', `${this.motionTiltCurrent.tiltY}deg`);
    const settled = Math.abs(this.motionTiltTarget.tiltX - this.motionTiltCurrent.tiltX) < 0.005
      && Math.abs(this.motionTiltTarget.tiltY - this.motionTiltCurrent.tiltY) < 0.005;
    if (!settled) this.motionTiltFrame = window.requestAnimationFrame(this.animateDeviceTilt);
  };

  private onDeviceScreenOrientationChange = (): void => {
    this.motionNeutral = null;
    this.motionTiltTarget = { tiltX: 0, tiltY: 0 };
  };

  private onMotionVisibilityChange = (): void => {
    if (document.hidden) {
      this.detachDeviceMotionListeners();
      if (this.motionTiltFrame) window.cancelAnimationFrame(this.motionTiltFrame);
      this.motionTiltFrame = 0;
      this.motionTiltCurrent = { tiltX: 0, tiltY: 0 };
      this.resetArtworkInteraction();
      return;
    }
    this.attachDeviceMotionListeners();
  };

  private onMotionPreferenceChange = (): void => {
    if (this.isReducedMotion()) this.disableDeviceMotionTilt();
  };

  private onArtworkFocus = (): void => {
    this.artworkImage.style.setProperty('--artwork-tilt-x', '0deg');
    this.artworkImage.style.setProperty('--artwork-tilt-y', '0deg');
  };

  private resetArtworkInteraction = (): void => {
    this.scene.classList.remove('has-artwork-proximity');
    this.artworkImage.style.setProperty('--artwork-tilt-x', '0deg');
    this.artworkImage.style.setProperty('--artwork-tilt-y', '0deg');
  };

  private onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    this.zoomBy(Math.exp(-event.deltaY * 0.001));
  };

  private onDoubleClick = (): void => {
    this.resetCamera(true);
  };

  private onKeyDown = (event: KeyboardEvent): void => {
    if (!this.visible) return;
    if (event.key === 'Escape' && this.element.querySelector('.prefs__panel:not([hidden])')) return;
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
      this.resetCamera(true);
    } else if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  };

  private trapFocus(event: KeyboardEvent): void {
    const focusable = [...this.element.querySelectorAll<HTMLElement>(
      'button:not(:disabled), select:not(:disabled), input:not(:disabled), textarea:not(:disabled), ' +
        '.gallery-room-view__artwork-frame[tabindex="0"]'
    )].filter((element) => !element.closest('[hidden]'));
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
