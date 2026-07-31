import { GalleryManager } from '../gallery/GalleryManager';
import { createScopedDiagnostics } from '../utils/Diagnostics';

/**
 * v0.11 — Unified canvas interaction layer.
 *
 * Replaced three previously-separate classes (`MouseInteraction`,
 * `ZoomPan`, `TouchInteraction`, removed in v0.17 dead-code cleanup) with
 * a single gesture coordinator that uses Pointer Events Level 3 when
 * available and Touch Events as a fallback for older Safari. Fixes:
 *
 *   - Bug 2: all touch listeners were passive, so iOS Safari's native
 *     page pinch-zoom always fired in parallel with the custom zoom.
 *     The Pointer Events path scopes gesture ownership via
 *     `touch-action: none` on the canvas; the Touch Events fallback
 *     calls `preventDefault()` inside non-passive `touchmove`/`touchstart`
 *     when a pinch is in progress.
 *
 *   - Bug 3: synthetic mouse events fired after touch on iOS Safari
 *     duplicated tap/click actions. With Pointer Events the browser
 *     emits a single unified event stream. The Touch Events fallback
 *     suppresses the synthetic stream by calling `preventDefault()` on
 *     `touchstart`.
 *
 * Hover rotation is suppressed on coarse-pointer devices because the
 * effect requires a hovering pointer and is meaningless on touch.
 *
 * Online validation sources (W3C Pointer Events L3, MDN `touch-action`,
 * WCAG 2.5.1 Pointer Gestures, 2.5.2 Pointer Cancellation) confirm
 * this design. See `plan.md` § Slice 4.
 */

type GestureState =
  | 'idle'
  | 'panning'
  | 'pinching'
  | 'swipe-candidate'
  | 'cancelled';

interface PointerSlot {
  id: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
}

const SWIPE_THRESHOLD_PX = 50;

export class CanvasInteraction {
  private readonly canvas: HTMLCanvasElement;
  private readonly galleryManager: GalleryManager;
  private readonly diagnostics = createScopedDiagnostics('interaction');
  private readonly usePointerEvents: boolean;
  /** v0.16 — guards against double-dispose (mobile context-loss races
   *  the `beforeunload` cleanup), which previously could remove
   *  pointer-capture listeners twice and leak a no-op handler. */
  private disposed = false;
  private enabled = true;

  private state: GestureState = 'idle';
  private readonly active = new Map<number, PointerSlot>();
  private lastPinchDist = 0;
  /** Tracks whether the most recent gesture started as touch; used to
   *  suppress hover rotation immediately after a tap on touch laptops. */

  constructor(canvas: HTMLCanvasElement, galleryManager: GalleryManager) {
    this.canvas = canvas;
    this.galleryManager = galleryManager;
    this.usePointerEvents = typeof window.PointerEvent === 'function';

    if (this.usePointerEvents) {
      // Pointer Events path — single unified stream for mouse/touch/pen.
      // `touch-action: none` on the canvas (set in main.scss) tells the
      // browser to skip native scroll/zoom for touches inside the canvas.
      // No `passive: false` needed because the browser already cedes the
      // gesture to us when `touch-action: none` is in effect.
      this.canvas.addEventListener('pointerdown', this.onPointerDown);
      this.canvas.addEventListener('pointermove', this.onPointerMove);
      this.canvas.addEventListener('pointerup', this.onPointerUp);
      this.canvas.addEventListener('pointercancel', this.onPointerCancel);
      this.canvas.addEventListener('lostpointercapture', this.onPointerCancel);
      window.addEventListener('pointermove', this.onGlobalPointerMove, { passive: true });
      window.addEventListener('pointerup', this.onGlobalPointerUp, { passive: true });
      window.addEventListener('pointercancel', this.onGlobalPointerCancel, { passive: true });
    } else {
      // Touch Events fallback (older iOS Safari only). Non-passive for
      // touchstart/touchmove because we need `preventDefault()` to own
      // the gesture and suppress synthetic mouse events.
      this.canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
      this.canvas.addEventListener('touchmove', this.onTouchMove, { passive: false });
      this.canvas.addEventListener('touchend', this.onTouchEnd, { passive: true });
      this.canvas.addEventListener('touchcancel', this.onTouchEnd, { passive: true });
      // Click is still useful for panel-click on the rare desktop browser
      // that lacks Pointer Events.
      window.addEventListener('mousemove', this.onLegacyMouseMove, { passive: true });
      window.addEventListener('touchmove', this.onGlobalTouchMove, { passive: false });
    }

    // Wheel zoom remains passive — no preventDefault needed; the canvas
    // is fixed and there is no page scroll to fight.
    this.canvas.addEventListener('wheel', this.onWheel, { passive: true });

    this.diagnostics.info('init', 'Canvas interaction initialised', {
      backend: this.usePointerEvents ? 'pointer-events' : 'touch-events-fallback',
    });
  }

  // ---------------------------------------------------------------------------
  // Pointer Events path (modern browsers)
  // ---------------------------------------------------------------------------

  private onPointerDown = (e: PointerEvent): void => {
    if (!this.enabled) return;
    // Mouse-only: reject non-primary buttons.
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    // Capture pointer so we keep receiving move/up even when the finger
    // leaves the canvas (e.g. user drags off-screen on a phone).
    try {
      this.canvas.setPointerCapture(e.pointerId);
    } catch {
      /* ignore — older browsers without pointer capture */
    }

    this.active.set(e.pointerId, {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
    });

    if (this.active.size === 1) {
      this.state = this.galleryManager.canPan() ? 'panning' : 'swipe-candidate';
      this.diagnostics.debug('gesture-start', 'Pointer gesture started', {
        pointerType: e.pointerType,
        state: this.state,
      });
    } else if (this.active.size === 2) {
      const pts = [...this.active.values()];
      this.lastPinchDist = distance(pts[0].lastX, pts[0].lastY, pts[1].lastX, pts[1].lastY);
      this.state = 'pinching';
      this.diagnostics.debug('gesture-start', 'Pinch gesture started', {});
    }
  };

  private onPointerMove = (e: PointerEvent): void => {
    this.handlePointerMove(e);
  };

  private onGlobalPointerMove = (e: PointerEvent): void => {
    if (e.target === this.canvas) return;
    this.handlePointerMove(e);
  };

  private handlePointerMove(e: PointerEvent): void {
    if (!this.enabled) return;
    const slot = this.active.get(e.pointerId);

    // Hover rotation (fine pointer only, no buttons held).
    if (!slot) {
      if (e.pointerType === 'mouse' && this.state === 'idle') {
        this.updateHoverRotation(e.clientX, e.clientY);
      }
      return;
    }

    // Per-frame delta from previous position; then update lastX/lastY.
    const dx = e.clientX - slot.lastX;
    const dy = e.clientY - slot.lastY;
    slot.lastX = e.clientX;
    slot.lastY = e.clientY;

    if (this.state === 'pinching' && this.active.size === 2) {
      const pts = [...this.active.values()];
      const dist = distance(pts[0].lastX, pts[0].lastY, pts[1].lastX, pts[1].lastY);
      const delta = this.lastPinchDist - dist;
      this.lastPinchDist = dist;
      this.galleryManager.addZoomDelta(delta * 0.02);
      return;
    }

    if (this.active.size === 1) {
      if (this.galleryManager.canPan()) {
        this.state = 'panning';
        this.galleryManager.setPanOffset(dx * 0.004, -dy * 0.004);
      }
      // swipe-candidate: do nothing during move; resolved on pointerup.
    }
  }

  private onPointerUp = (e: PointerEvent): void => {
    if (!this.enabled) return;
    const slot = this.active.get(e.pointerId);
    this.active.delete(e.pointerId);
    try {
      this.canvas.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    if (this.state === 'pinching' && this.active.size < 2) {
      // One finger left after pinch ends — fall back to panning state.
      this.state = this.galleryManager.canPan() ? 'panning' : 'swipe-candidate';
      return;
    }

    if (this.state === 'swipe-candidate' && slot && this.active.size === 0) {
      this.resolveSwipe(slot, e.clientX, e.clientY);
    }

    if (this.active.size === 0) {
      this.state = 'idle';
    }
  };

  private onGlobalPointerUp = (e: PointerEvent): void => {
    if (e.target === this.canvas) return;
    this.onPointerUp(e);
  };

  private onPointerCancel = (e: PointerEvent): void => {
    if (!this.enabled) return;
    this.active.delete(e.pointerId);
    if (this.active.size === 0) {
      this.state = 'idle';
      this.diagnostics.debug('gesture-cancel', 'Pointer gesture cancelled', {});
    }
  };

  private onGlobalPointerCancel = (e: PointerEvent): void => {
    if (e.target === this.canvas) return;
    this.onPointerCancel(e);
  };

  // ---------------------------------------------------------------------------
  // Touch Events fallback (older iOS Safari)
  // ---------------------------------------------------------------------------

  private onTouchStart = (e: TouchEvent): void => {
    if (!this.enabled) return;
    // Suppress synthetic mouse/click events that the browser would emit
    // after this touch sequence finishes (Bug 3).
    if (e.cancelable) e.preventDefault();

    if (e.touches.length === 1) {
      const t = e.touches[0];
      this.active.clear();
      this.active.set(0, { id: 0, startX: t.clientX, startY: t.clientY, lastX: t.clientX, lastY: t.clientY });
      this.state = this.galleryManager.canPan() ? 'panning' : 'swipe-candidate';
    } else if (e.touches.length === 2) {
      this.state = 'pinching';
      this.lastPinchDist = this.getTouchDist(e);
    }
  };

  private onTouchMove = (e: TouchEvent): void => {
    if (!this.enabled) return;
    if (e.touches.length >= 2) {
      // Own the pinch gesture (Bug 2). Browser must not run native zoom.
      if (e.cancelable) e.preventDefault();
      const dist = this.getTouchDist(e);
      const delta = this.lastPinchDist - dist;
      this.lastPinchDist = dist;
      this.galleryManager.addZoomDelta(delta * 0.02);
      this.state = 'pinching';
      return;
    }

    if (e.touches.length !== 1) return;
    const slot = this.active.get(0);
    if (!slot) return;
    const t = e.touches[0];
    const dx = t.clientX - slot.lastX;
    const dy = t.clientY - slot.lastY;
    slot.lastX = t.clientX;
    slot.lastY = t.clientY;

    if (this.galleryManager.canPan()) {
      // Own the pan when zoomed so the page does not drift.
      if (e.cancelable) e.preventDefault();
      this.galleryManager.setPanOffset(dx * 0.004, -dy * 0.004);
      this.state = 'panning';
    }
  };

  private onGlobalTouchMove = (e: TouchEvent): void => {
    if (e.target === this.canvas || this.state === 'idle') return;
    this.onTouchMove(e);
  };

  private onTouchEnd = (e: TouchEvent): void => {
    if (!this.enabled) return;
    if (this.state === 'swipe-candidate' && e.changedTouches.length > 0) {
      const slot = this.active.get(0);
      if (slot) this.resolveSwipe(slot, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
    if (e.touches.length === 0) {
      this.active.clear();
      this.state = 'idle';
    }
  };

  private getTouchDist(e: TouchEvent): number {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // ---------------------------------------------------------------------------
  // Shared handlers
  // ---------------------------------------------------------------------------

  private onWheel = (e: WheelEvent): void => {
    if (!this.enabled) return;
    this.galleryManager.addZoomDelta(e.deltaY * 0.0045);
  };

  private onLegacyMouseMove = (e: MouseEvent): void => {
    if (!this.enabled) return;
    // Used only in the Touch Events fallback path on browsers without
    // Pointer Events. Updates hover rotation on fine-pointer desktops.
    if (this.state !== 'idle') return;
    this.updateHoverRotation(e.clientX, e.clientY);
  };

  private updateHoverRotation(clientX: number, clientY: number): void {
    // WCAG SC 2.5.1 — gesture fallbacks. Hover rotation is an
    // enhancement, not the only path to interact, so suppressing it on
    // coarse-pointer devices is safe and removes a confusing micro-motion.
    if (document.documentElement.dataset['pointerPrimary'] === 'coarse') return;
    const normalizedX = (clientX / window.innerWidth) * 2 - 1;
    const normalizedY = (clientY / window.innerHeight) * 2 - 1;
    const hoverScale = this.galleryManager.getHoverRotationScale();
    this.galleryManager.setHoverTarget(normalizedX * hoverScale.x, normalizedY * hoverScale.y);
  }

  private resolveSwipe(slot: PointerSlot, endX: number, endY: number): void {
    const dx = endX - slot.startX;
    const dy = endY - slot.startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD_PX) {
      // WCAG SC 2.5.2 — activate on up-event (the swipe is resolved here,
      // on pointerup/touchend), not on initial pointer down.
      this.galleryManager.navigate(dx < 0 ? 1 : -1);
      this.diagnostics.debug('swipe', 'Swipe resolved', { direction: dx < 0 ? 'next' : 'prev' });
    }
  }

  setEnabled(enabled: boolean): void {
    if (this.enabled === enabled) return;
    this.enabled = enabled;
    if (!enabled) {
      this.active.clear();
      this.state = 'idle';
      this.galleryManager.setHoverTarget(0, 0);
    }
  }

  dispose(): void {
    // v0.16 — dispose idempotency. See `disposed` field.
    if (this.disposed) return;
    this.disposed = true;
    if (this.usePointerEvents) {
      this.canvas.removeEventListener('pointerdown', this.onPointerDown);
      this.canvas.removeEventListener('pointermove', this.onPointerMove);
      this.canvas.removeEventListener('pointerup', this.onPointerUp);
      this.canvas.removeEventListener('pointercancel', this.onPointerCancel);
      this.canvas.removeEventListener('lostpointercapture', this.onPointerCancel);
      window.removeEventListener('pointermove', this.onGlobalPointerMove);
      window.removeEventListener('pointerup', this.onGlobalPointerUp);
      window.removeEventListener('pointercancel', this.onGlobalPointerCancel);
    } else {
      this.canvas.removeEventListener('touchstart', this.onTouchStart);
      this.canvas.removeEventListener('touchmove', this.onTouchMove);
      this.canvas.removeEventListener('touchend', this.onTouchEnd);
      this.canvas.removeEventListener('touchcancel', this.onTouchEnd);
      window.removeEventListener('mousemove', this.onLegacyMouseMove);
      window.removeEventListener('touchmove', this.onGlobalTouchMove);
    }
    this.canvas.removeEventListener('wheel', this.onWheel);
    this.active.clear();
  }
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}
