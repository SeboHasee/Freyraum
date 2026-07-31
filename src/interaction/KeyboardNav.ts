import { GalleryManager } from '../gallery/GalleryManager';

const ZOOM_KEY_STEP = 0.6;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

export class KeyboardNav {
  private readonly galleryManager: GalleryManager;
  private readonly keyboardHelp: { open(opener?: HTMLElement): void } | undefined;
  private fullscreenTarget: HTMLElement = document.documentElement;
  private enabled = true;

  constructor(
    galleryManager: GalleryManager,
    keyboardHelp?: { open(opener?: HTMLElement): void }
  ) {
    this.galleryManager = galleryManager;
    this.keyboardHelp = keyboardHelp;
    window.addEventListener('keydown', this.handleKeyDown);
  }

  setFullscreenTarget(target: HTMLElement): void {
    this.fullscreenTarget = target;
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (!this.enabled) return;
    // Ignore shortcuts when the user is editing form fields or focused on
    // an interactive timeline thumbnail (timeline manages its own arrows).
    if (isTypingTarget(e.target)) return;
    if (e.target instanceof HTMLElement && e.target.closest('.timeline')) {
      // Timeline owns ArrowLeft/Right when focused; we still allow zoom/reset/fullscreen.
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') return;
    }

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.galleryManager.navigate(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.galleryManager.navigate(1);
        break;
      case '+':
      case '=':
        e.preventDefault();
        this.galleryManager.addZoomDelta(-ZOOM_KEY_STEP);
        break;
      case '-':
      case '_':
        e.preventDefault();
        this.galleryManager.addZoomDelta(ZOOM_KEY_STEP);
        break;
      case '0':
      case 'r':
      case 'R':
        e.preventDefault();
        this.galleryManager.resetView();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        this.toggleFullscreen();
        break;
      case '?':
        e.preventDefault();
        this.keyboardHelp?.open();
        break;
    }
  };

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  private toggleFullscreen(): void {
    if (!document.fullscreenEnabled) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    } else {
      void this.fullscreenTarget.requestFullscreen().catch(() => undefined);
    }
  }

  dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
  }
}
