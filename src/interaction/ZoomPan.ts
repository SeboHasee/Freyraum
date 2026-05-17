import { GalleryManager } from '../gallery/GalleryManager';
import { clamp } from '../utils/math';
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
    this.galleryManager.targetZoom = clamp(
      this.galleryManager.targetZoom + e.deltaY * 0.0045,
      -2,
      9
    );
  };

  private handleMouseDown = (e: MouseEvent): void => {
    if (e.button !== 0) return;
    this.isDragging = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.mouseInteraction.setDragging(true);
    this.canvas.style.cursor = 'grabbing';
  };

  private handleMouseMove = (e: MouseEvent): void => {
    if (!this.isDragging) return;
    if (this.galleryManager.targetZoom > 5) return;

    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    const aspect = this.galleryManager.artworkAspect;
    const panLimitX = 8 * (aspect > 1 ? 1.5 : 1);
    const panLimitY = 12 * (aspect < 1 ? 2.0 : 1);

    this.galleryManager.targetPanX = clamp(
      this.galleryManager.targetPanX + dx * 0.004,
      -panLimitX,
      panLimitX
    );
    this.galleryManager.targetPanY = clamp(
      this.galleryManager.targetPanY - dy * 0.004,
      -panLimitY,
      panLimitY
    );
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
