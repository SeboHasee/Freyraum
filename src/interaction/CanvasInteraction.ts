import { GalleryManager } from '../gallery/GalleryManager';
import { createScopedDiagnostics } from '../utils/Diagnostics';
import {
  DoubleTapDetector,
  exceedsTapSlop,
  hapticTick,
  normalizeWheelDelta,
  resolveSwipeDirection,
  VelocityTracker,
} from './touchGestures';

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
  | 'pending'
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
  private lastPinchCenter = { x: 0, y: 0 };
  private pointerDragStarted = false;
  /** v1.41 — release velocity for pan momentum and swipe flicks. */
  private readonly velocity = new VelocityTracker();
  private readonly doubleTap = new DoubleTapDetector();
  /** A pinch ended with one finger still down: ignore it until release. */
  private pinchTail = false;

  constructor(canvas: HTMLCanvasElement, galleryManager: GalleryManager) {
    this.canvas = canvas;
    this.galleryManager = galleryManager;
    this.usePointerEvents = typeof window.PointerEvent === 'function';
    this.galleryManager.setPanAvailabilityListener((canPan) => {
      this.canvas.classList.toggle('is-pan-available', canPan);
      this.syncPanCursor();
    });

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
      this.canvas.addEventListener('pointerleave', this.onPointerLeave);
      window.addEventListener('pointermove', this.onGlobalPointerMove, { passive: true });
      window.addEventListener('pointerup', this.onGlobalPointerUp, { passive: true });
      window.addEventListener('pointercancel', this.onGlobalPointerCancel, { passive: true });
      this.canvas.addEventListener('dblclick', this.onDoubleClick);
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

    // v1.43: non-passive only so a trackpad pinch (ctrl+wheel) zooms the
    // artwork instead of the browser page; plain wheels have no page scroll
    // to fight and are not prevented.
    this.canvas.addEventListener('wheel', this.onWheel, { passive: false });

    this.diagnostics.info('init', 'Canvas interaction initialised', {
      backend: this.usePointerEvents ? 'pointer-events' : 'touch-events-fallback',
    });
  }

  // ---------------------------------------------------------------------------
  // Pointer Events path (modern browsers)
  //
  // v1.41 — shared touch model with the photo room: a press only becomes a
  // drag after TAP_SLOP_PX; zoomed-in drags pan 1:1 under the finger and
  // coast with momentum/rubber-band after release; pinch zoom multiplies the
  // camera distance anchored between the fingers; at the fitted view the
  // artwork follows a horizontal swipe and navigates on distance or flick.
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
    this.pointerDragStarted = false;

    if (this.active.size === 1) {
      this.pinchTail = false;
      this.velocity.reset();
      this.velocity.add(e.timeStamp, e.clientX, e.clientY);
      this.state = 'pending';
      this.diagnostics.debug('gesture-start', 'Pointer gesture started', {
        pointerType: e.pointerType,
        state: this.state,
      });
    } else if (this.active.size === 2) {
      const pts = [...this.active.values()];
      this.lastPinchDist = distance(pts[0].lastX, pts[0].lastY, pts[1].lastX, pts[1].lastY);
      this.lastPinchCenter = this.localPoint((pts[0].lastX + pts[1].lastX) / 2, (pts[0].lastY + pts[1].lastY) / 2);
      if (this.state === 'swipe-candidate') this.galleryManager.setSwipePreview(0);
      this.state = 'pinching';
      this.galleryManager.beginDirectGesture();
      this.diagnostics.debug('gesture-start', 'Pinch gesture started', {});
    }
    this.syncPanCursor();
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
    this.canvas.classList.toggle(
      'is-fine-pointer',
      e.pointerType === 'mouse' || e.pointerType === 'pen'
    );
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

    if (this.state === 'pinching' && this.active.size >= 2) {
      const pts = [...this.active.values()];
      const dist = Math.max(1, distance(pts[0].lastX, pts[0].lastY, pts[1].lastX, pts[1].lastY));
      const center = this.localPoint((pts[0].lastX + pts[1].lastX) / 2, (pts[0].lastY + pts[1].lastY) / 2);
      const factor = dist / Math.max(1, this.lastPinchDist);
      this.lastPinchDist = dist;
      // Two-finger translation pans; the spread zooms around the midpoint.
      this.galleryManager.panByPixels(center.x - this.lastPinchCenter.x, center.y - this.lastPinchCenter.y);
      this.galleryManager.zoomByFactorAt(factor, center.x, center.y);
      this.lastPinchCenter = center;
      this.syncPanCursor();
      return;
    }

    if (this.active.size !== 1 || this.pinchTail) return;
    this.velocity.add(e.timeStamp, e.clientX, e.clientY);

    if (this.state === 'pending') {
      if (!exceedsTapSlop(e.clientX - slot.startX, e.clientY - slot.startY)) return;
      if (this.galleryManager.canPan()) {
        this.state = 'panning';
        this.galleryManager.beginDirectGesture();
        // Include the slop distance so the content stays under the finger.
        this.galleryManager.panByPixels(e.clientX - slot.startX - dx, e.clientY - slot.startY - dy);
      } else {
        this.state = 'swipe-candidate';
      }
    }

    if (this.state === 'panning') {
      this.pointerDragStarted ||= dx !== 0 || dy !== 0;
      this.galleryManager.panByPixels(dx, dy);
    } else if (this.state === 'swipe-candidate') {
      const totalX = e.clientX - slot.startX;
      const totalY = e.clientY - slot.startY;
      this.galleryManager.setSwipePreview(Math.abs(totalX) > Math.abs(totalY) ? totalX : 0);
    }
    this.syncPanCursor();
  }

  private onPointerLeave = (): void => {
    if (this.active.size === 0) this.canvas.classList.remove('is-fine-pointer');
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (!this.enabled) return;
    const slot = this.active.get(e.pointerId);
    if (!slot) return;
    this.active.delete(e.pointerId);
    try {
      this.canvas.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    if (this.state === 'pinching' && this.active.size >= 1) {
      if (this.active.size >= 2) {
        const pts = [...this.active.values()];
        this.lastPinchDist = distance(pts[0].lastX, pts[0].lastY, pts[1].lastX, pts[1].lastY);
        this.lastPinchCenter = this.localPoint((pts[0].lastX + pts[1].lastX) / 2, (pts[0].lastY + pts[1].lastY) / 2);
        return;
      }
      // One finger left after the pinch: finish the pinch without a jump and
      // ignore the remaining finger until it lifts.
      this.galleryManager.endDirectGesture(0, 0);
      this.pinchTail = true;
      this.state = 'cancelled';
      this.pointerDragStarted = false;
      this.syncPanCursor();
      return;
    }

    if (this.active.size === 0) {
      this.velocity.add(e.timeStamp, e.clientX, e.clientY);
      const velocity = this.velocity.velocity(e.timeStamp);
      if (this.state === 'panning') {
        this.galleryManager.endDirectGesture(velocity.x, velocity.y);
      } else if (this.state === 'swipe-candidate') {
        this.resolveSwipe(slot, e.clientX, e.clientY, velocity.x);
      } else if (this.state === 'pending' && !this.pinchTail) {
        this.handleTap(e);
      }
      this.state = 'idle';
      this.pinchTail = false;
      this.pointerDragStarted = false;
    }
    this.syncPanCursor();
  };

  private handleTap(e: PointerEvent): void {
    // Mouse double-clicks arrive through `dblclick`; touch/pen use the detector.
    if (e.pointerType === 'mouse') return;
    if (!this.doubleTap.tap(e.timeStamp, e.clientX, e.clientY)) return;
    const point = this.localPoint(e.clientX, e.clientY);
    this.galleryManager.toggleZoomAt(point.x, point.y);
    hapticTick();
  }

  private onDoubleClick = (e: MouseEvent): void => {
    if (!this.enabled) return;
    const point = this.localPoint(e.clientX, e.clientY);
    this.galleryManager.toggleZoomAt(point.x, point.y);
  };

  private localPoint(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  private onGlobalPointerUp = (e: PointerEvent): void => {
    if (e.target === this.canvas) return;
    this.onPointerUp(e);
  };

  private onPointerCancel = (e: PointerEvent): void => {
    if (!this.enabled) return;
    if (!this.active.delete(e.pointerId)) return;
    if (this.active.size === 0) {
      if (this.state === 'swipe-candidate') this.galleryManager.setSwipePreview(0);
      this.galleryManager.endDirectGesture(0, 0);
      this.state = 'idle';
      this.pinchTail = false;
      this.pointerDragStarted = false;
      this.diagnostics.debug('gesture-cancel', 'Pointer gesture cancelled', {});
    }
    this.syncPanCursor();
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
    this.canvas.classList.remove('is-fine-pointer');
    // Suppress synthetic mouse/click events that the browser would emit
    // after this touch sequence finishes (Bug 3).
    if (e.cancelable) e.preventDefault();

    if (e.touches.length === 1) {
      const t = e.touches[0];
      this.active.clear();
      this.active.set(0, { id: 0, startX: t.clientX, startY: t.clientY, lastX: t.clientX, lastY: t.clientY });
      this.velocity.reset();
      this.velocity.add(e.timeStamp, t.clientX, t.clientY);
      this.state = this.galleryManager.canPan() ? 'panning' : 'swipe-candidate';
      if (this.state === 'panning') this.galleryManager.beginDirectGesture();
    } else if (e.touches.length === 2) {
      this.state = 'pinching';
      this.galleryManager.beginDirectGesture();
      this.lastPinchDist = this.getTouchDist(e);
    }
  };

  private onTouchMove = (e: TouchEvent): void => {
    if (!this.enabled) return;
    if (e.touches.length >= 2) {
      // Own the pinch gesture (Bug 2). Browser must not run native zoom.
      if (e.cancelable) e.preventDefault();
      const dist = Math.max(1, this.getTouchDist(e));
      const factor = dist / Math.max(1, this.lastPinchDist);
      this.lastPinchDist = dist;
      const center = this.localPoint(
        (e.touches[0].clientX + e.touches[1].clientX) / 2,
        (e.touches[0].clientY + e.touches[1].clientY) / 2
      );
      this.galleryManager.zoomByFactorAt(factor, center.x, center.y);
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

    this.velocity.add(e.timeStamp, t.clientX, t.clientY);
    if (this.state === 'panning') {
      // Own the pan when zoomed so the page does not drift.
      if (e.cancelable) e.preventDefault();
      this.galleryManager.panByPixels(dx, dy);
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
      if (slot) {
        this.resolveSwipe(
          slot,
          e.changedTouches[0].clientX,
          e.changedTouches[0].clientY,
          this.velocity.velocity(e.timeStamp).x
        );
      }
    }
    if (e.touches.length === 0) {
      const velocity = this.velocity.velocity(e.timeStamp);
      this.galleryManager.endDirectGesture(
        this.state === 'panning' ? velocity.x : 0,
        this.state === 'panning' ? velocity.y : 0
      );
      this.active.clear();
      this.state = 'idle';
      this.pointerDragStarted = false;
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
    if (e.ctrlKey) e.preventDefault();
    this.galleryManager.addZoomDelta(normalizeWheelDelta(e.deltaY, e.deltaMode, window.innerHeight) * 0.0045);
  };

  private onLegacyMouseMove = (e: MouseEvent): void => {
    if (!this.enabled) return;
    this.canvas.classList.add('is-fine-pointer');
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

  private resolveSwipe(slot: PointerSlot, endX: number, endY: number, velocityX = 0): void {
    const dx = endX - slot.startX;
    const dy = endY - slot.startY;
    // WCAG SC 2.5.2 — activate on up-event (the swipe is resolved here,
    // on pointerup/touchend), not on initial pointer down. v1.41: a fast
    // flick navigates before the distance threshold.
    const direction = resolveSwipeDirection(dx, dy, velocityX, SWIPE_THRESHOLD_PX);
    if (direction !== 0) {
      this.galleryManager.clearSwipePreview();
      this.galleryManager.navigate(direction);
      hapticTick();
      this.diagnostics.debug('swipe', 'Swipe resolved', { direction: direction > 0 ? 'next' : 'prev' });
    } else {
      this.galleryManager.setSwipePreview(0);
    }
  }

  setEnabled(enabled: boolean): void {
    if (this.enabled === enabled) return;
    this.enabled = enabled;
    if (!enabled) {
      this.active.clear();
      this.galleryManager.endDirectGesture(0, 0);
      this.galleryManager.setSwipePreview(0);
      this.pinchTail = false;
      this.state = 'idle';
      this.galleryManager.setHoverTarget(0, 0);
    }
    this.syncPanCursor();
  }

  private syncPanCursor(): void {
    this.canvas.classList.toggle(
      'is-panning',
      this.enabled && this.state === 'panning' && this.galleryManager.canPan()
        && this.pointerDragStarted
    );
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
      this.canvas.removeEventListener('pointerleave', this.onPointerLeave);
      window.removeEventListener('pointermove', this.onGlobalPointerMove);
      window.removeEventListener('pointerup', this.onGlobalPointerUp);
      window.removeEventListener('pointercancel', this.onGlobalPointerCancel);
      this.canvas.removeEventListener('dblclick', this.onDoubleClick);
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
    this.canvas.classList.remove('is-fine-pointer', 'is-pan-available', 'is-panning');
    this.galleryManager.setPanAvailabilityListener(null);
  }
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}
