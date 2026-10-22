import { type Artwork } from '../config/artworks';
import { VelocityTracker, resolveSheetStop, rubberBand } from '../interaction/touchGestures';

export type InfoSheetState = 'expanded' | 'collapsed' | 'peek' | 'dismissed';

/** v1.46 (C1) — phone sheet stops, lowest first. `half` is the reveal default. */
export type InfoSheetStop = 'peek' | 'half' | 'full';
const SHEET_STOPS: readonly InfoSheetStop[] = ['peek', 'half', 'full'];
/** Mirrors `.info-panel--compact` max-heights in `main.scss`. */
const SHEET_HALF_VH = 0.32;
const SHEET_FULL_VH = 0.68;
const SHEET_TOP_CLEARANCE_PX = 88;

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
  private stop: InfoSheetStop = 'half';
  private dragPointerId: number | null = null;
  private dragStartY = 0;
  private dragDy = 0;
  private dragStops: readonly number[] = [];
  private suppressHandleClick = false;
  private readonly dragVelocity = new VelocityTracker();
  /** Notified when the visitor expands, collapses or swipes the sheet away. */
  onSheetChange: ((state: InfoSheetState) => void) | null = null;

  constructor(container: HTMLElement, initialArtwork: Artwork) {
    this.el = document.createElement('section');
    this.el.className = 'info-panel';
    this.el.setAttribute('aria-live', 'polite');
    this.el.setAttribute('aria-label', 'Informationen zum aktuellen Werk');
    this.el.dataset['sheetStop'] = 'half';

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
      this.setStop('half', false);
    }
  }

  get isExpanded(): boolean {
    return this.stop === 'full';
  }

  get sheetStop(): InfoSheetStop {
    return this.stop;
  }

  /**
   * v1.42 — phone bottom sheet: expanded (full) shows more of the description
   * and stays open until the visitor collapses or swipes it away. `false`
   * returns to the half stop, the reveal default.
   */
  setExpanded(expanded: boolean, notify = true): void {
    this.setStop(expanded ? 'full' : 'half', notify);
  }

  /** v1.46 (C1) — peek shows only the title; half and full scroll inside. */
  setStop(stop: InfoSheetStop, notify = true): void {
    const next: InfoSheetStop = this.compact ? stop : 'half';
    if (next === this.stop) return;
    if (next === 'peek') this.el.style.setProperty('--sheet-peek-height', `${this.measurePeekHeight().toFixed(1)}px`);
    this.stop = next;
    this.el.dataset['sheetStop'] = next;
    this.el.classList.toggle('is-expanded', next === 'full');
    this.el.classList.toggle('is-peek', next === 'peek');
    this.handle.setAttribute('aria-expanded', String(next === 'full'));
    this.handle.setAttribute('aria-label', next === 'full' ? 'Werkinformation verkleinern' : 'Werkinformation vergrößern');
    if (next !== 'full') this.el.scrollTop = 0;
    if (notify) this.onSheetChange?.(next === 'full' ? 'expanded' : next === 'peek' ? 'peek' : 'collapsed');
  }

  /** Handle, eyebrow and title stay visible in the peek stop. */
  private measurePeekHeight(): number {
    const paddingBottom = Number.parseFloat(getComputedStyle(this.el).paddingBottom) || 0;
    return this.title.offsetTop + this.title.offsetHeight + paddingBottom;
  }

  /** Current stop heights (px), measured once per drag. */
  private measureStopHeights(): number[] {
    const viewport = window.innerHeight;
    const rect = this.el.getBoundingClientRect();
    const content = this.el.scrollHeight;
    const peek = this.measurePeekHeight();
    const half = Math.max(peek, Math.min(content, viewport * SHEET_HALF_VH));
    const full = Math.max(half, Math.min(content, viewport * SHEET_FULL_VH, rect.bottom - SHEET_TOP_CLEARANCE_PX));
    return [peek, half, full];
  }

  private onHandleClick = (): void => {
    // Pointer drags resolve on pointerup; keyboard and plain taps step here.
    if (this.suppressHandleClick) {
      this.suppressHandleClick = false;
      return;
    }
    this.setStop(this.stop === 'half' ? 'full' : 'half');
  };

  private onHandlePointerDown = (event: PointerEvent): void => {
    if (!this.compact || this.dragPointerId !== null || event.button > 0) return;
    this.dragPointerId = event.pointerId;
    this.dragStartY = event.clientY;
    this.dragDy = 0;
    this.dragStops = this.measureStopHeights();
    this.suppressHandleClick = false;
    this.dragVelocity.reset();
    this.dragVelocity.add(event.timeStamp, 0, event.clientY);
    this.handle.setPointerCapture?.(event.pointerId);
  };

  private onHandlePointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.dragPointerId) return;
    this.dragDy = event.clientY - this.dragStartY;
    this.dragVelocity.add(event.timeStamp, 0, event.clientY);
    // The sheet grows and shrinks with the finger between the peek and full
    // stops; above full it meets rubber-band resistance, below peek it slides
    // down to signal the dismiss.
    const [peek = 0, , full = 0] = this.dragStops;
    const start = this.dragStops[SHEET_STOPS.indexOf(this.stop)] ?? peek;
    const height = start - this.dragDy;
    const shownHeight = height > full ? full + rubberBand(height - full, 160) : Math.max(peek, height);
    const slide = height < peek ? peek - height : 0;
    this.el.classList.add('is-dragging');
    this.el.style.setProperty('--sheet-drag-height', `${shownHeight.toFixed(1)}px`);
    this.el.style.setProperty('--sheet-drag', `${slide.toFixed(1)}px`);
  };

  private onHandlePointerUp = (event: PointerEvent): void => {
    if (event.pointerId !== this.dragPointerId) return;
    this.dragVelocity.add(event.timeStamp, 0, event.clientY);
    const release = resolveSheetStop(
      SHEET_STOPS.indexOf(this.stop),
      this.dragStops,
      this.dragDy,
      this.dragVelocity.velocity(event.timeStamp).y
    );
    this.cancelDrag();
    if (release.kind === 'toggle') return; // the following click steps
    this.suppressHandleClick = true;
    if (release.kind === 'dismiss') this.onSheetChange?.('dismissed');
    else this.setStop(SHEET_STOPS[release.index] ?? 'half');
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
    this.el.style.removeProperty('--sheet-drag-height');
  }

  private setContent(artwork: Artwork): void {
    this.eyebrow.textContent = `${artwork.subtitle} · ${artwork.year}`;
    this.title.textContent = artwork.title;
    this.meta.textContent = [artwork.medium, artwork.surface].filter(Boolean).join(' · ');
    this.description.textContent = artwork.description;
    this.credit.textContent = `© ${artwork.credit}`;
    if (this.stop === 'peek') {
      this.el.style.setProperty('--sheet-peek-height', `${this.measurePeekHeight().toFixed(1)}px`);
    }
  }

  dispose(): void {
    this.cancelDrag();
    this.el.remove();
  }
}
