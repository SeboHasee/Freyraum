import { GalleryManager } from '../gallery/GalleryManager';
import { clamp } from '../utils/math';

export class TouchInteraction {
  private readonly canvas: HTMLCanvasElement;
  private readonly galleryManager: GalleryManager;
  private touchStartX = 0;
  private touchStartY = 0;
  private lastTouchDist = 0;
  private isSwiping = false;

  constructor(canvas: HTMLCanvasElement, galleryManager: GalleryManager) {
    this.canvas = canvas;
    this.galleryManager = galleryManager;

    this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    this.canvas.addEventListener('touchend', this.handleTouchEnd, { passive: true });
  }

  private handleTouchStart = (e: TouchEvent): void => {
    if (e.touches.length === 1) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.isSwiping = true;
    } else if (e.touches.length === 2) {
      this.isSwiping = false;
      this.lastTouchDist = this.getTouchDist(e);
    }
  };

  private handleTouchMove = (e: TouchEvent): void => {
    if (e.touches.length === 2) {
      const dist = this.getTouchDist(e);
      const delta = this.lastTouchDist - dist;
      this.lastTouchDist = dist;
      this.galleryManager.targetZoom = clamp(
        this.galleryManager.targetZoom + delta * 0.02,
        -2,
        9
      );
    }
  };

  private handleTouchEnd = (e: TouchEvent): void => {
    if (!this.isSwiping || e.changedTouches.length === 0) return;

    const dx = e.changedTouches[0].clientX - this.touchStartX;
    const dy = e.changedTouches[0].clientY - this.touchStartY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) {
        this.galleryManager.navigate(1);
      } else {
        this.galleryManager.navigate(-1);
      }
    }

    this.isSwiping = false;
  };

  private getTouchDist(e: TouchEvent): number {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  dispose(): void {
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
    this.canvas.removeEventListener('touchend', this.handleTouchEnd);
  }
}
