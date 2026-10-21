import { type Artwork } from '../config/artworks';
import { VelocityTracker, resolveSheetRelease, rubberBand } from '../interaction/touchGestures';

export type InfoSheetState = 'expanded' | 'collapsed' | 'dismissed';

export class InfoPanel {
  private readonly el: HTMLElement;
  private readonly eyebrow: HTMLElement;
  private readonly title: HTMLElement;
  private readonly meta: HTMLElement;
  private readonly description: HTMLElement;
  private readonly credit: HTMLElement;
  /** v1.42 — phone bottom-sheet grab handle (shown only in compact mode). */
  private readonly handle: HTMLButtonElement;
  private compact = false;
  private expanded = false;
  private dragPointerId: number | null = null;
  private dragStartY = 0;
  private dragDy = 0;
  private suppressHandleClick = false;
  private readonly dragVelocity = new VelocityTracker();
  /** Notified when the visitor expands, collapses or swipes the sheet away. */
  onSheetChange: ((state: InfoSheetState) => void) | null = null;

  constructor(container: HTMLElement, initialArtwork: Artwork) {
    this.el = document.createElement('section');
    this.el.className = 'info-panel';
    this.el.setAttribute('aria-live', 'polite');
    this.el.setAttribute('aria-label', 'Informationen zum aktuellen Werk');

    this.eyebrow = document.createElement('p');
    this.eyebrow.className = 'info-panel__eyebrow';

    this.title = document.createElement('h1');
    this.title.className = 'info-panel__title';

    this.meta = document.createElement('p');
    this.meta.className = 'info-panel__meta';

    this.description = document.createElement('p');
    this.description.className = 'info-panel__description';

    this.credit = document.createElement('p');
    this.credit.className = 'info-panel__credit';

    this.handle = document.createElement('button');
    this.handle.type = 'button';
    this.handle.className = 'info-panel__handle';
    this.handle.setAttribute('aria-expanded', 'false');
    this.handle.setAttribute('aria-label', 'Werkinformation vergrößern');
    this.handle.addEventListener('pointerdown', this.onHandlePointerDown);
    this.handle.addEventListener('pointermove', this.onHandlePointerMove);
    this.handle.addEventListener('pointerup', this.onHandlePointerUp);
    this.handle.addEventListener('pointercancel', this.onHandlePointerCancel);
    this.handle.addEventListener('click', this.onHandleClick);

    this.el.append(this.handle, this.eyebrow, this.title, this.meta, this.description, this.credit);
    container.appendChild(this.el);

    this.update(initialArtwork);
  }

  /**
   * v0.15 — content-swap delay for animated `update()` calls.
   *
   * Must be ≥ the CSS transition duration on `.info-panel` (defined as
   * `--dur-content: 0.5s` in `src/styles/main.scss`). Before v0.15 this
   * was hard-coded to 200ms — shorter than the 320ms `--dur-base`
   * transition — so the text content was swapped while the panel was
   * still ~62% visible, causing the old text to flicker through the
   * fade-out. The 20ms tail accounts for browser scheduling jitter.
   *
   * Keep in sync with `--dur-content` in `main.scss`.
   */
  private static readonly CONTENT_SWAP_DELAY_MS = 520;

  update(artwork: Artwork, animate = false): void {
    if (animate) {
      this.el.classList.add('is-transitioning');
      window.setTimeout(() => {
        this.setContent(artwork);
        // One animation frame lets the browser apply the new text layout
        // before we trigger the fade-in transition, preventing a
        // single-frame flash of un-styled / mid-transition content.
        window.requestAnimationFrame(() => {
          this.el.classList.remove('is-transitioning');
        });
      }, InfoPanel.CONTENT_SWAP_DELAY_MS);
    } else {
      this.setContent(artwork);
    }
  }

  /**
   * v0.11 — toggle compact phone-portrait styling. Driven from
   * `main.ts` based on `detectDeviceCapabilities().layoutTier`. The
   * compact layout fills the available width minus safe-area insets and
   * lets the description scroll inside the panel, keeping all info
   * accessible (WCAG SC 1.4.10 Reflow) instead of being clipped.
   */
  setCompact(compact: boolean): void {
    this.compact = compact;
    this.el.classList.toggle('info-panel--compact', compact);
    if (!compact) {
      this.cancelDrag();
      this.setExpanded(false, false);
    }
  }

  get isExpanded(): boolean {
    return this.expanded;
  }

  /**
   * v1.42 — phone bottom sheet: expanded shows more of the description and
   * stays open until the visitor collapses or swipes it away.
   */
  setExpanded(expanded: boolean, notify = true): void {
    const next = expanded && this.compact;
    if (next === this.expanded) return;
    this.expanded = next;
    this.el.classList.toggle('is-expanded', next);
    this.handle.setAttribute('aria-expanded', String(next));
    this.handle.setAttribute('aria-label', next ? 'Werkinformation verkleinern' : 'Werkinformation vergrößern');
    if (!next) this.el.scrollTop = 0;
    if (notify) this.onSheetChange?.(next ? 'expanded' : 'collapsed');
  }

  private onHandleClick = (): void => {
    // Pointer drags resolve on pointerup; keyboard and plain taps toggle here.
    if (this.suppressHandleClick) {
      this.suppressHandleClick = false;
      return;
    }
    this.setExpanded(!this.expanded);
  };

  private onHandlePointerDown = (event: PointerEvent): void => {
    if (!this.compact || this.dragPointerId !== null || event.button > 0) return;
    this.dragPointerId = event.pointerId;
    this.dragStartY = event.clientY;
    this.dragDy = 0;
    this.suppressHandleClick = false;
    this.dragVelocity.reset();
    this.dragVelocity.add(event.timeStamp, 0, event.clientY);
    this.handle.setPointerCapture?.(event.pointerId);
  };

  private onHandlePointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.dragPointerId) return;
    this.dragDy = event.clientY - this.dragStartY;
    this.dragVelocity.add(event.timeStamp, 0, event.clientY);
    // The sheet follows the finger down; upward pulls meet rubber-band resistance.
    const shown = this.dragDy < 0 ? rubberBand(this.dragDy, 160) : this.dragDy;
    this.el.classList.add('is-dragging');
    this.el.style.setProperty('--sheet-drag', `${shown.toFixed(1)}px`);
  };

  private onHandlePointerUp = (event: PointerEvent): void => {
    if (event.pointerId !== this.dragPointerId) return;
    this.dragVelocity.add(event.timeStamp, 0, event.clientY);
    const decision = resolveSheetRelease(this.dragDy, this.dragVelocity.velocity(event.timeStamp).y, this.expanded);
    this.cancelDrag();
    if (decision === 'toggle') return; // the following click toggles
    this.suppressHandleClick = true;
    if (decision === 'expand') this.setExpanded(true);
    else if (decision === 'collapse') this.setExpanded(false);
    else if (decision === 'dismiss') this.onSheetChange?.('dismissed');
  };

  private onHandlePointerCancel = (event: PointerEvent): void => {
    if (event.pointerId === this.dragPointerId) this.cancelDrag();
  };

  private cancelDrag(): void {
    if (this.dragPointerId !== null && this.handle.hasPointerCapture?.(this.dragPointerId)) {
      this.handle.releasePointerCapture(this.dragPointerId);
    }
    this.dragPointerId = null;
    this.dragDy = 0;
    this.el.classList.remove('is-dragging');
    this.el.style.removeProperty('--sheet-drag');
  }

  private setContent(artwork: Artwork): void {
    this.eyebrow.textContent = `${artwork.subtitle} · ${artwork.year}`;
    this.title.textContent = artwork.title;
    this.meta.textContent = [artwork.medium, artwork.surface].filter(Boolean).join(' · ');
    this.description.textContent = artwork.description;
    this.credit.textContent = `© ${artwork.credit}`;
  }

  dispose(): void {
    this.cancelDrag();
    this.el.remove();
  }
}
