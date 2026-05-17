import { GalleryManager } from '../gallery/GalleryManager';

export class KeyboardNav {
  private readonly galleryManager: GalleryManager;

  constructor(galleryManager: GalleryManager) {
    this.galleryManager = galleryManager;
    window.addEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.galleryManager.navigate(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.galleryManager.navigate(1);
        break;
    }
  };

  dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
  }
}
