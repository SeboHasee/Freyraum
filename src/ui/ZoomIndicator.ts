/**
 * v1.46 D3 — transient zoom readout ("150 %") shared by the gallery and the
 * photo room. Callers report the *target* magnification (1 = fitted view);
 * the badge appears only when that value changes, fades after a short idle
 * time and announces the settled value once through a polite live region.
 * Text is written only when the rounded percentage changes, so reporting on
 * every camera frame stays cheap and never reads layout.
 */
const VISIBLE_MS = 1100;
const ANNOUNCE_DELAY_MS = 650;

export function formatZoomPercent(magnification: number): number {
  if (!Number.isFinite(magnification) || magnification <= 0) return 100;
  return Math.round(magnification * 100);
}

export class ZoomIndicator {
  readonly element: HTMLElement;
  private readonly badge: HTMLElement;
  private readonly live: HTMLElement;
  private baseline: number | null = null;
  private shownPercent: number | null = null;
  private hideTimer = 0;
  private announceTimer = 0;

  constructor(container: HTMLElement, extraClass = '') {
    const root = document.createElement('div');
    root.className = `zoom-indicator${extraClass ? ` ${extraClass}` : ''}`;
    const badge = document.createElement('span');
    badge.className = 'zoom-indicator__badge';
    badge.setAttribute('aria-hidden', 'true');
    const live = document.createElement('span');
    live.className = 'sr-only';
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', 'polite');
    root.append(badge, live);
    container.appendChild(root);
    this.element = root;
    this.badge = badge;
    this.live = live;
  }

  /** Reports the target magnification; the first report after `rebase()` is silent. */
  report(magnification: number): void {
    const percent = formatZoomPercent(magnification);
    if (this.baseline === null) {
      this.baseline = percent;
      return;
    }
    if (percent === this.baseline && this.shownPercent === null) return;
    if (percent === this.shownPercent) return;
    this.shownPercent = percent;
    this.badge.textContent = `${percent}\u202f%`;
    this.element.classList.add('is-visible');
    window.clearTimeout(this.hideTimer);
    this.hideTimer = window.setTimeout(this.fade, VISIBLE_MS);
    window.clearTimeout(this.announceTimer);
    this.announceTimer = window.setTimeout(() => {
      this.live.textContent = `Zoom ${percent} Prozent`;
    }, ANNOUNCE_DELAY_MS);
  }

  /** Forgets the baseline (view opened, refit, artwork change) and hides the badge. */
  rebase(): void {
    this.baseline = null;
    this.hide();
  }

  hide(): void {
    window.clearTimeout(this.hideTimer);
    window.clearTimeout(this.announceTimer);
    this.fade();
  }

  dispose(): void {
    this.hide();
    this.element.remove();
  }

  private fade = (): void => {
    if (this.shownPercent !== null) this.baseline = this.shownPercent;
    this.shownPercent = null;
    this.element.classList.remove('is-visible');
  };
}
