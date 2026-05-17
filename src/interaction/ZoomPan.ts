import { GalleryManager } from '../gallery/GalleryManager';
import { MouseInteraction } from './MouseInteraction';

export class ZoomPan {
  private readonly canvas: HTMLCanvasElement;
  private readonly galleryManager: GalleryManager;
  private readonly mouseInteraction: MouseInteraction;
  private isDragging = false;
  private lastX = 0;
  private lastY = 0;

  constructor(
    canvas: HTMLCanvasElement,
    galleryManager: GalleryManager,
    mouseInteraction: MouseInteraction
  ) {
    this.canvas = canvas;
    this.galleryManager = galleryManager;
    this.mouseInteraction = mouseInteraction;

    this.canvas.addEventListener('wheel', this.handleWheel, { passive: true });
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  private handleWheel = (e: WheelEvent): void => {
    this.galleryManager.addZoomDelta(e.deltaY * 0.0045);
  };

  private handleMouseDown = (e: MouseEvent): void => {
    if (e.button !== 0) return;
    this.isDragging = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.mouseInteraction.setDragging(true);
    this.canvas.style.cursor = this.galleryManager.canPan() ? 'grabbing' : 'grab';
  };

  private handleMouseMove = (e: MouseEvent): void => {
    if (!this.isDragging) return;

    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    if (this.galleryManager.canPan()) {
      this.galleryManager.setPanOffset(dx * 0.004, -dy * 0.004);
      return;
    }

    const hoverScale = this.galleryManager.getHoverRotationScale();
    const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
    const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
    this.galleryManager.setHoverTarget(normalizedX * hoverScale.x, normalizedY * hoverScale.y);
  };

  private handleMouseUp = (): void => {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.mouseInteraction.setDragging(false);
    this.canvas.style.cursor = '';
  };

  dispose(): void {
    this.canvas.removeEventListener('wheel', this.handleWheel);
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }
}
