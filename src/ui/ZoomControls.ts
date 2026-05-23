import type { GalleryManager } from '../gallery/GalleryManager';

const ZOOM_STEP = 0.6;

export class ZoomControls {
  private readonly el: HTMLElement;
  private readonly galleryManager: GalleryManager;

  constructor(container: HTMLElement, galleryManager: GalleryManager) {
    this.galleryManager = galleryManager;

    this.el = document.createElement('div');
    this.el.className = 'zoom-controls';
    this.el.setAttribute('role', 'group');
    this.el.setAttribute('aria-label', 'Zoom-Steuerung');

    const zoomIn = this.createButton('zoom-controls__btn', 'Vergrößern', '＋', () => {
      this.galleryManager.addZoomDelta(-ZOOM_STEP);
    });

    const zoomOut = this.createButton('zoom-controls__btn', 'Verkleinern', '−', () => {
      this.galleryManager.addZoomDelta(ZOOM_STEP);
    });

    const reset = this.createButton('zoom-controls__btn zoom-controls__btn--reset', 'Ansicht zurücksetzen', '⟲', () => {
      this.galleryManager.resetView();
    });

    this.el.append(zoomIn, zoomOut, reset);
    container.appendChild(this.el);
  }

  private createButton(
    className: string,
    ariaLabel: string,
    glyph: string,
    onClick: () => void
  ): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.setAttribute('aria-label', ariaLabel);

    const icon = document.createElement('span');
    icon.className = 'zoom-controls__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = glyph;
    btn.appendChild(icon);

    btn.addEventListener('click', onClick);
    return btn;
  }

  dispose(): void {
    this.el.remove();
  }
}
