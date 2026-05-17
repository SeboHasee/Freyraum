import { GalleryManager } from '../gallery/GalleryManager';

export class MouseInteraction {
  private readonly canvas: HTMLCanvasElement;
  private readonly galleryManager: GalleryManager;
  private isDragging = false;

  constructor(canvas: HTMLCanvasElement, galleryManager: GalleryManager) {
    this.canvas = canvas;
    this.galleryManager = galleryManager;

    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('click', this.handleClick);
  }

  setDragging(dragging: boolean): void {
    this.isDragging = dragging;
  }

  private handleMouseMove = (e: MouseEvent): void => {
    if (this.isDragging) return;
    if (this.galleryManager.targetZoom > 5) return;

    const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
    const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;

    this.galleryManager.setHoverTarget(normalizedX * 0.16, normalizedY * 0.08);
  };

  private handleClick = (e: MouseEvent): void => {
    if (!this.isDragging) {
      this.galleryManager.handlePanelClick(e, this.canvas);
    }
  };

  dispose(): void {
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('click', this.handleClick);
  }
}
