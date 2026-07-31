/**
 * Main Museum Hub (v0.80) — manifest-driven DOM composition.
 *
 * The hub renders the empty museum room (`museum-empty.png`) as the only
 * runtime background and overlays each active artwork as an actual responsive
 * DOM `<img>` inside its own framed native `<button>`. Visual bounds and hit
 * bounds are the same element, so they cannot drift. No second WebGL scene is
 * created: frames use shared static CSS material presets and perspective
 * transforms, and the composition adds zero WebGL draw calls.
 *
 * Room pages hold up to four artworks; larger exhibitions paginate. Narrow
 * portrait viewports (aspect below 4:5) split each room page into left-wall
 * and right-wall focus views with arrows, swipe, counter, and keyboard
 * navigation.
 */

import {
  frameMaterialStrengths,
  type MuseumHubResolution,
  type ResolvedHubSlot,
} from '../config/museumHub';
import { createScopedDiagnostics } from '../utils/Diagnostics';

const HUB_BACKGROUND_BASE_URL =
  window.location.protocol === 'file:'
    ? '../customer-artworks/'
    : `${import.meta.env.BASE_URL}`;
const HUB_IMAGE_TIMEOUT_MS = 5000;
const NARROW_PORTRAIT_QUERY = '(max-aspect-ratio: 4/5)';

const percent = (value: number): string => `${(value * 100).toFixed(3)}%`;

const isCalibrationRequested = (): boolean => {
  try {
    return new URLSearchParams(window.location.search).get('hubCalibrate') === '1';
  } catch {
    return false;
  }
};

/** Resolves the runtime URL for the configured hub background source. */
function resolveBackgroundUrl(src: string): string {
  if (window.location.protocol === 'file:') return `${HUB_BACKGROUND_BASE_URL}${src}`;
  // Served builds copy `customer-artworks/Backgrounds/` to `backgrounds/`.
  return `${HUB_BACKGROUND_BASE_URL}${src.replace(/^Backgrounds\//, 'backgrounds/')}`;
}

interface CalibrationDrag {
  slot: ResolvedHubSlot;
  button: HTMLButtonElement;
  pointerId: number;
  mode: 'move' | 'resize';
  startX: number;
  startY: number;
  startCx: number;
  startCy: number;
  startW: number;
  startH: number;
}

interface SlotView {
  slot: ResolvedHubSlot;
  button: HTMLButtonElement;
  image: HTMLImageElement | null;
}

export class MainMuseumHub {
  readonly element: HTMLElement;
  private readonly diagnostics = createScopedDiagnostics('hub');
  private readonly resolution: MuseumHubResolution;
  private readonly visual: HTMLElement;
  private readonly roomLayers: HTMLElement[] = [];
  private readonly slotViews: SlotView[] = [];
  private readonly entryButton: HTMLButtonElement;
  private readonly status: HTMLElement;
  private readonly pager: HTMLElement;
  private readonly pagerPrev: HTMLButtonElement;
  private readonly pagerNext: HTMLButtonElement;
  private readonly pagerCounter: HTMLElement;
  private readonly narrowQuery: MediaQueryList;
  private readonly imageReady: Promise<void>;
  private readonly calibrating: boolean;
  private calibrationOutput: HTMLTextAreaElement | null = null;
  private calibrationDrag: CalibrationDrag | null = null;
  private activateCallback: (() => void) | null = null;
  private selectSlotCallback: ((slot: ResolvedHubSlot) => void) | null = null;
  private disposed = false;
  private pageCount = 1;
  /** Current view index: room page, or wall-focus view when narrow. */
  private viewIndex = 0;
  private narrowMode = false;
  private lastActivatedSlotId: string | null = null;
  private decodedPages = new Set<number>();
  private idleDecodeHandle: number | null = null;
  private idleDecodeNextPage = 1;
  private swipeStartX: number | null = null;
  private swipeStartY: number | null = null;
  private resizeRafId = 0;

  constructor(app: HTMLElement, resolution: MuseumHubResolution) {
    this.resolution = resolution;
    this.calibrating = isCalibrationRequested();
    this.pageCount = Math.max(1, resolution.pages.length);

    const hub = document.createElement('section');
    hub.className = 'museum-hub';
    hub.setAttribute('aria-labelledby', 'museum-hub-title');
    hub.style.setProperty('--hub-aspect', String(resolution.background.aspect));
    if (this.calibrating) hub.classList.add('is-calibrating');

    // Room baseline: museum-empty.png is the only runtime room image.
    const image = document.createElement('img');
    image.className = 'museum-hub__image';
    image.alt = '';
    image.decoding = 'async';
    image.draggable = false;
    const backgroundReady = new Promise<void>((resolve) => {
      let settled = false;
      const finish = (): void => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        resolve();
      };
      const timeout = window.setTimeout(() => {
        hub.classList.add('has-image-error');
        finish();
      }, HUB_IMAGE_TIMEOUT_MS);
      image.addEventListener('load', () => {
        hub.classList.remove('has-image-error');
        finish();
      });
      image.addEventListener('error', () => {
        hub.classList.add('has-image-error');
        finish();
      });
    });
    image.src = resolveBackgroundUrl(resolution.background.src);

    const visual = document.createElement('div');
    visual.className = 'museum-hub__visual';
    visual.appendChild(image);

    const shade = document.createElement('div');
    shade.className = 'museum-hub__shade';
    shade.setAttribute('aria-hidden', 'true');

    const header = document.createElement('header');
    header.className = 'museum-hub__header';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'museum-hub__eyebrow';
    eyebrow.textContent = 'FREYRAUM';
    const title = document.createElement('h1');
    title.id = 'museum-hub-title';
    title.className = 'museum-hub__title';
    title.textContent = 'Museum';
    const introduction = document.createElement('p');
    introduction.className = 'museum-hub__introduction';
    introduction.textContent = 'Wählen Sie ein Kunstwerk, um die Ausstellung zu betreten.';
    header.append(eyebrow, title, introduction);

    // Generic gallery-entry action — only exposed when zero valid slots exist.
    const entryButton = document.createElement('button');
    entryButton.className = 'museum-hub__destination';
    entryButton.type = 'button';
    entryButton.setAttribute('aria-describedby', 'museum-hub-entry-description');
    entryButton.innerHTML = `
      <span class="museum-hub__destination-frame" aria-hidden="true"></span>
      <span class="museum-hub__destination-label">Ausstellung betreten</span>
    `;

    const description = document.createElement('p');
    description.id = 'museum-hub-entry-description';
    description.className = 'sr-only';
    description.textContent =
      'Öffnet die interaktive Galerie mit Navigation, Detailansicht und Informationen zu den Kunstwerken.';

    const status = document.createElement('p');
    status.className = 'museum-hub__status sr-only';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    // Pager (arrows + counter) for multi-page exhibitions and wall-focus views.
    const pager = document.createElement('nav');
    pager.className = 'museum-hub__pager';
    pager.setAttribute('aria-label', 'Museumsräume');
    const pagerPrev = document.createElement('button');
    pagerPrev.type = 'button';
    pagerPrev.className = 'museum-hub__pager-arrow museum-hub__pager-arrow--prev';
    pagerPrev.setAttribute('aria-label', 'Vorherige Wand');
    pagerPrev.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';
    const pagerCounter = document.createElement('span');
    pagerCounter.className = 'museum-hub__pager-counter';
    pagerCounter.setAttribute('aria-live', 'polite');
    const pagerNext = document.createElement('button');
    pagerNext.type = 'button';
    pagerNext.className = 'museum-hub__pager-arrow museum-hub__pager-arrow--next';
    pagerNext.setAttribute('aria-label', 'Nächste Wand');
    pagerNext.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>';
    pager.append(pagerPrev, pagerCounter, pagerNext);

    visual.appendChild(entryButton);
    hub.append(visual, shade, header, description, pager, status);
    app.appendChild(hub);

    this.element = hub;
    this.visual = visual;
    this.entryButton = entryButton;
    this.status = status;
    this.pager = pager;
    this.pagerPrev = pagerPrev;
    this.pagerNext = pagerNext;
    this.pagerCounter = pagerCounter;
    this.entryButton.addEventListener('click', this.handleActivate);
    pagerPrev.addEventListener('click', () => this.stepView(-1));
    pagerNext.addEventListener('click', () => this.stepView(1));

    this.buildSlots();
    const hasSelectableSlots = this.resolution.slotToArtwork.size > 0;
    this.entryButton.hidden = hasSelectableSlots;

    // Narrow-portrait wall-focus mode. matchMedia drives mode switching;
    // the actual geometry is pure CSS custom-property transforms, so a
    // resize only recalculates the shared background/overlay transform.
    this.narrowQuery = window.matchMedia(NARROW_PORTRAIT_QUERY);
    this.narrowMode = this.narrowQuery.matches;
    this.narrowQuery.addEventListener('change', this.handleNarrowChange);
    window.addEventListener('resize', this.handleResize);

    // Swipe + keyboard navigation between views.
    hub.addEventListener('pointerdown', this.handleSwipeStart, { passive: true });
    hub.addEventListener('pointerup', this.handleSwipeEnd, { passive: true });
    hub.addEventListener('keydown', this.handleKeydown);

    if (this.calibrating) this.buildCalibrationPanel(hub);

    // First-page artwork presentation must be complete before the loading
    // overlay is dismissed; later pages decode lazily.
    this.imageReady = Promise.all([backgroundReady, this.decodePageImages(0)]).then(() => {
      this.applyView(true);
      this.scheduleIdlePageDecode();
      this.diagnostics.info('composition-ready', 'Hub composition prepared', {
        pages: this.pageCount,
        selectableSlots: this.resolution.slotToArtwork.size,
        source: this.resolution.source,
      });
    });
  }

  onActivate(callback: () => void): void {
    this.activateCallback = callback;
  }

  onSelectSlot(callback: (slot: ResolvedHubSlot) => void): void {
    this.selectSlotCallback = callback;
  }

  /** Critical hub preparation awaited under the loading overlay. */
  prepare(): Promise<void> {
    return this.imageReady;
  }

  enter(): void {
    if (this.disposed) return;
    this.element.hidden = false;
    this.element.classList.remove('is-exiting');
    this.setButtonsDisabled(false);
    this.status.textContent = '';
    this.scheduleIdlePageDecode();
    // Preserve page state and restore focus to the originating slot.
    requestAnimationFrame(() => this.focusInitialTarget());
  }

  async exit(reducedMotion: boolean): Promise<void> {
    if (this.disposed) return;
    // A gallery transition begins: cancel low-priority hub work immediately.
    this.cancelIdlePageDecode();
    this.setButtonsDisabled(true);
    this.status.textContent = 'Ausstellung wird geöffnet.';
    this.element.classList.add('is-exiting');
    if (!reducedMotion) {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 520));
    }
    if (!this.disposed) this.element.hidden = true;
  }

  showError(): void {
    if (this.disposed) return;
    this.element.hidden = false;
    this.element.classList.remove('is-exiting');
    this.setButtonsDisabled(false);
    this.status.textContent = 'Die Ausstellung konnte nicht geöffnet werden. Bitte versuchen Sie es erneut.';
    this.focusInitialTarget();
  }

  focusInitialTarget(): void {
    const restored = this.lastActivatedSlotId
      ? this.slotViews.find((view) => view.slot.id === this.lastActivatedSlotId && !view.button.disabled)
      : undefined;
    if (restored) {
      this.goToPage(restored.slot.pageIndex, restored.slot);
      restored.button.focus({ preventScroll: true });
      return;
    }
    const firstSelectable = this.slotViews.find((view) => view.slot.selectable);
    (firstSelectable?.button ?? this.entryButton).focus({ preventScroll: true });
  }

  private setButtonsDisabled(disabled: boolean): void {
    this.entryButton.disabled = disabled;
    for (const view of this.slotViews) {
      view.button.disabled = disabled || !view.slot.selectable;
    }
    if (disabled) {
      this.pagerPrev.disabled = true;
      this.pagerNext.disabled = true;
    } else {
      this.pagerPrev.disabled = this.viewIndex === 0;
      this.pagerNext.disabled = this.viewIndex === this.viewCount - 1;
    }
  }

  private handleActivate = (): void => {
    if (this.entryButton.disabled) return;
    this.setButtonsDisabled(true);
    this.activateCallback?.();
  };

  // ── Composition ───────────────────────────────────────────────────────────

  private buildSlots(): void {
    const rooms = document.createElement('div');
    rooms.className = 'museum-hub__rooms';
    for (const page of this.resolution.pages) {
      const room = document.createElement('div');
      room.className = 'museum-hub__room';
      room.dataset['page'] = String(page.pageIndex);
      for (const slot of page.slots) {
        const view = this.buildSlotButton(slot);
        room.appendChild(view.button);
        this.slotViews.push(view);
      }
      rooms.appendChild(room);
      this.roomLayers.push(room);
    }
    this.visual.appendChild(rooms);
  }

  private buildSlotButton(slot: ResolvedHubSlot): SlotView {
    const preset = this.resolution.framePresets[slot.framePreset]
      ?? this.resolution.framePresets['matte-charcoal']!;
    const strengths = frameMaterialStrengths(preset);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'museum-hub__frame';
    button.dataset['slotId'] = slot.id;
    if (slot.artworkId) button.dataset['artworkId'] = slot.artworkId;
    this.applySlotGeometry(button, slot);
    button.style.setProperty('--frame-color', preset.color);
    button.style.setProperty('--frame-highlight', String(strengths.highlight));
    button.style.setProperty('--frame-shadow', String(strengths.shadow));
    // Wall-specific static light direction matches the room photograph.
    button.style.setProperty('--frame-light-x', slot.placement.rotateYDeg >= 0 ? '1' : '-1');

    const shell = document.createElement('span');
    shell.className = 'museum-hub__frame-shell';
    shell.setAttribute('aria-hidden', 'true');
    const aperture = document.createElement('span');
    aperture.className = 'museum-hub__frame-aperture';

    let image: HTMLImageElement | null = null;
    if (slot.selectable && slot.artworkId) {
      button.setAttribute(
        'aria-label',
        `Kunstwerk „${slot.displayLabel}“ in der Ausstellung öffnen`
      );
      image = document.createElement('img');
      image.className = 'museum-hub__art';
      image.alt = '';
      image.decoding = 'async';
      image.draggable = false;
      // Missing image data shows a neutral placeholder but retains the exact
      // valid target ID (placeholder-exact-target).
      image.addEventListener('error', () => {
        button.classList.add('has-missing-image');
        this.diagnostics.warn('artwork-image-missing', 'Hub artwork image failed; neutral placeholder retains exact target', {
          slotId: slot.id,
          artworkId: slot.artworkId,
        });
      });
      aperture.appendChild(image);
      const placeholder = document.createElement('span');
      placeholder.className = 'museum-hub__art-placeholder';
      placeholder.textContent = slot.displayLabel;
      aperture.appendChild(placeholder);
    } else {
      button.disabled = true;
      button.classList.add('is-disabled-slot');
      button.setAttribute('aria-label', 'Nicht verfügbarer Ausstellungsplatz');
      button.setAttribute('aria-disabled', 'true');
    }

    shell.appendChild(aperture);
    button.appendChild(shell);

    const label = document.createElement('span');
    label.className = 'museum-hub__frame-label';
    label.setAttribute('aria-hidden', 'true');
    label.textContent = this.calibrating ? `${slot.id} · ${slot.displayLabel}` : slot.displayLabel;
    button.appendChild(label);

    if (this.calibrating) {
      const handle = document.createElement('span');
      handle.className = 'museum-hub__frame-handle';
      handle.setAttribute('aria-hidden', 'true');
      button.appendChild(handle);
      button.disabled = false;
      button.addEventListener('pointerdown', (event) => this.startCalibrationDrag(event, slot, button));
    } else if (slot.selectable) {
      button.addEventListener('click', () => this.handleSlotClick(slot));
    }

    return { slot, button, image };
  }

  /**
   * Positions the frame button from normalized placement. The button box is
   * the maximum slot bounds; the artwork keeps its own aspect via a
   * contain-fit inner box, so unusual ratios get a neutral inset mat rather
   * than cropping.
   */
  private applySlotGeometry(button: HTMLButtonElement, slot: ResolvedHubSlot): void {
    const { placement, artworkAspect } = slot;
    // The visual box is `aspect` wide for every 1 unit of height, so a
    // horizontal fraction represents `aspect` × the same vertical fraction.
    const boxAspect = this.resolution.background.aspect;
    let w = placement.maxW;
    let h = placement.maxH;
    if (slot.artworkId) {
      const slotPixelAspect = (placement.maxW * boxAspect) / placement.maxH;
      if (artworkAspect < slotPixelAspect) {
        w = (placement.maxH * artworkAspect) / boxAspect;
      } else {
        h = (placement.maxW * boxAspect) / artworkAspect;
      }
    }
    button.style.left = percent(placement.cx - w / 2);
    button.style.top = percent(placement.cy - h / 2);
    button.style.width = percent(w);
    button.style.height = percent(h);
    button.style.setProperty('--frame-rotate-y', `${placement.rotateYDeg}deg`);
  }

  /**
   * Decodes later room pages one at a time during browser idle periods so a
   * page preview or overflow navigation shows no image pop-in. Cancelled when
   * a gallery transition begins and rescheduled on hub re-entry.
   */
  private scheduleIdlePageDecode(): void {
    if (this.disposed || this.idleDecodeHandle !== null) return;
    while (this.idleDecodeNextPage < this.pageCount && this.decodedPages.has(this.idleDecodeNextPage)) {
      this.idleDecodeNextPage += 1;
    }
    if (this.idleDecodeNextPage >= this.pageCount) return;
    const requestIdle =
      typeof window.requestIdleCallback === 'function'
        ? (cb: () => void): number => window.requestIdleCallback(cb, { timeout: 4000 })
        : (cb: () => void): number => window.setTimeout(cb, 600);
    this.idleDecodeHandle = requestIdle(() => {
      this.idleDecodeHandle = null;
      if (this.disposed) return;
      const page = this.idleDecodeNextPage;
      this.idleDecodeNextPage += 1;
      void this.decodePageImages(page).then(() => this.scheduleIdlePageDecode());
    });
  }

  private cancelIdlePageDecode(): void {
    if (this.idleDecodeHandle === null) return;
    if (typeof window.cancelIdleCallback === 'function') {
      window.cancelIdleCallback(this.idleDecodeHandle);
    } else {
      window.clearTimeout(this.idleDecodeHandle);
    }
    this.idleDecodeHandle = null;
  }

  /** Lazily decodes the artwork images of one room page. */
  private decodePageImages(pageIndex: number): Promise<void> {
    if (this.decodedPages.has(pageIndex)) return Promise.resolve();
    this.decodedPages.add(pageIndex);
    const waits: Promise<void>[] = [];
    for (const view of this.slotViews) {
      if (view.slot.pageIndex !== pageIndex || !view.image || !view.slot.artworkId) continue;
      const artworkSrc = this.artworkImageSrc(view.slot);
      if (!artworkSrc) {
        view.button.classList.add('has-missing-image');
        continue;
      }
      view.image.src = artworkSrc;
      waits.push(
        new Promise<void>((resolve) => {
          const timeout = window.setTimeout(resolve, HUB_IMAGE_TIMEOUT_MS);
          const done = (): void => {
            window.clearTimeout(timeout);
            resolve();
          };
          if (view.image!.complete && view.image!.naturalWidth > 0) {
            done();
            return;
          }
          view.image!.addEventListener('load', done, { once: true });
          view.image!.addEventListener('error', done, { once: true });
        })
      );
    }
    return Promise.all(waits).then(() => undefined);
  }

  private artworkImageSrc(slot: ResolvedHubSlot): string | null {
    const src = slot.artworkId ? this.resolution.artworkImageById.get(slot.artworkId) : undefined;
    return src ?? null;
  }

  private handleSlotClick(slot: ResolvedHubSlot): void {
    if (this.entryButton.disabled) return;
    this.setButtonsDisabled(true);
    this.lastActivatedSlotId = slot.id;
    this.status.textContent = 'Ausstellung wird geöffnet.';
    this.selectSlotCallback?.(slot);
  }

  // ── View navigation (room pages + narrow wall-focus views) ───────────────

  private get viewCount(): number {
    return this.narrowMode ? this.pageCount * 2 : this.pageCount;
  }

  private stepView(direction: -1 | 1): void {
    const next = this.viewIndex + direction;
    if (next < 0 || next >= this.viewCount) return;
    this.viewIndex = next;
    this.applyView();
  }

  private goToPage(pageIndex: number, slot?: ResolvedHubSlot): void {
    if (this.narrowMode) {
      const wall = slot && slot.placement.cx >= 0.5 ? 1 : 0;
      this.viewIndex = pageIndex * 2 + wall;
    } else {
      this.viewIndex = pageIndex;
    }
    this.applyView();
  }

  private applyView(initial = false): void {
    if (this.disposed) return;
    this.viewIndex = Math.max(0, Math.min(this.viewCount - 1, this.viewIndex));
    const pageIndex = this.narrowMode ? Math.floor(this.viewIndex / 2) : this.viewIndex;
    const wallFocus = this.narrowMode ? (this.viewIndex % 2 === 0 ? 'left' : 'right') : 'full';

    for (const room of this.roomLayers) {
      const roomPage = Number.parseInt(room.dataset['page'] ?? '0', 10);
      room.classList.toggle('is-active', roomPage === pageIndex);
    }
    // Wall-focus transform: pure CSS custom properties on the shared visual.
    this.element.dataset['wallFocus'] = wallFocus;
    if (wallFocus === 'full') {
      this.visual.style.setProperty('--hub-focus-scale', '1');
      this.visual.style.setProperty('--hub-focus-x', '0%');
    } else {
      this.visual.style.setProperty('--hub-focus-scale', '1.9');
      this.visual.style.setProperty('--hub-focus-x', wallFocus === 'left' ? '24%' : '-24%');
    }
    // In wall-focus views the other wall's frames leave the actionable set so
    // partially visible edge targets can never overlap or mislead.
    for (const view of this.slotViews) {
      const slotWall = view.slot.placement.cx < 0.5 ? 'left' : 'right';
      view.button.classList.toggle('is-off-wall', wallFocus !== 'full' && slotWall !== wallFocus);
    }

    const showPager = this.viewCount > 1;
    this.pager.hidden = !showPager;
    if (showPager) {
      this.pagerPrev.disabled = this.viewIndex === 0;
      this.pagerNext.disabled = this.viewIndex === this.viewCount - 1;
      this.pagerCounter.textContent = this.narrowMode
        ? `Raum ${pageIndex + 1}/${this.pageCount} · ${wallFocus === 'left' ? 'Linke' : 'Rechte'} Wand`
        : `Raum ${pageIndex + 1} / ${this.pageCount}`;
    }
    if (!initial) void this.decodePageImages(pageIndex);
  }

  private handleNarrowChange = (): void => {
    const wasNarrow = this.narrowMode;
    this.narrowMode = this.narrowQuery.matches;
    if (wasNarrow !== this.narrowMode) {
      const pageIndex = wasNarrow ? Math.floor(this.viewIndex / 2) : this.viewIndex;
      this.viewIndex = this.narrowMode ? pageIndex * 2 : pageIndex;
      this.applyView();
    }
  };

  /** Debounced-in-RAF recalculation of the shared view transform only. */
  private handleResize = (): void => {
    if (this.resizeRafId !== 0) return;
    this.resizeRafId = requestAnimationFrame(() => {
      this.resizeRafId = 0;
      this.applyView();
    });
  };

  private handleKeydown = (event: KeyboardEvent): void => {
    if (this.calibrating) return;
    if (event.key === 'ArrowLeft') {
      this.stepView(-1);
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      this.stepView(1);
      event.preventDefault();
    }
  };

  private handleSwipeStart = (event: PointerEvent): void => {
    if (this.calibrating) return;
    this.swipeStartX = event.clientX;
    this.swipeStartY = event.clientY;
  };

  private handleSwipeEnd = (event: PointerEvent): void => {
    if (this.swipeStartX === null || this.swipeStartY === null) return;
    const dx = event.clientX - this.swipeStartX;
    const dy = event.clientY - this.swipeStartY;
    this.swipeStartX = null;
    this.swipeStartY = null;
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    this.stepView(dx < 0 ? 1 : -1);
  };

  // ── Calibration mode (?hubCalibrate=1) ───────────────────────────────────
  // Calibration manipulates the actual frame bounds (the same buttons users
  // click) and exports the complete museum-hub.json schema. Paste the JSON
  // into `customer-artworks/museum-hub.json` and re-run the gallery update.

  private buildCalibrationPanel(hub: HTMLElement): void {
    const panel = document.createElement('div');
    panel.className = 'museum-hub__calibration';
    const heading = document.createElement('p');
    heading.className = 'museum-hub__calibration-title';
    heading.textContent = 'Rahmen-Kalibrierung — JSON in customer-artworks/museum-hub.json einfügen';
    const output = document.createElement('textarea');
    output.className = 'museum-hub__calibration-output';
    output.readOnly = true;
    output.rows = 12;
    output.setAttribute('aria-label', 'Museum-Hub-Konfiguration als JSON');
    panel.append(heading, output);
    hub.appendChild(panel);
    this.calibrationOutput = output;
    this.updateCalibrationOutput();
  }

  private startCalibrationDrag(
    event: PointerEvent,
    slot: ResolvedHubSlot,
    button: HTMLButtonElement
  ): void {
    event.preventDefault();
    const target = event.target as HTMLElement | null;
    this.calibrationDrag = {
      slot,
      button,
      pointerId: event.pointerId,
      mode: target?.classList.contains('museum-hub__frame-handle') ? 'resize' : 'move',
      startX: event.clientX,
      startY: event.clientY,
      startCx: slot.placement.cx,
      startCy: slot.placement.cy,
      startW: slot.placement.maxW,
      startH: slot.placement.maxH,
    };
    button.setPointerCapture(event.pointerId);
    button.addEventListener('pointermove', this.handleCalibrationMove);
    button.addEventListener('pointerup', this.handleCalibrationEnd);
    button.addEventListener('pointercancel', this.handleCalibrationEnd);
  }

  private handleCalibrationMove = (event: PointerEvent): void => {
    const drag = this.calibrationDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const rect = this.visual.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const dx = (event.clientX - drag.startX) / rect.width;
    const dy = (event.clientY - drag.startY) / rect.height;
    const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));
    if (drag.mode === 'move') {
      drag.slot.placement.cx = clamp01(drag.startCx + dx);
      drag.slot.placement.cy = clamp01(drag.startCy + dy);
    } else {
      drag.slot.placement.maxW = clamp01(Math.max(0.02, drag.startW + dx * 2));
      drag.slot.placement.maxH = clamp01(Math.max(0.02, drag.startH + dy * 2));
    }
    this.applySlotGeometry(drag.button, drag.slot);
  };

  private handleCalibrationEnd = (event: PointerEvent): void => {
    const drag = this.calibrationDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    this.calibrationDrag = null;
    drag.button.removeEventListener('pointermove', this.handleCalibrationMove);
    drag.button.removeEventListener('pointerup', this.handleCalibrationEnd);
    drag.button.removeEventListener('pointercancel', this.handleCalibrationEnd);
    this.updateCalibrationOutput();
  };

  private updateCalibrationOutput(): void {
    const round = (value: number): number => Math.round(value * 1000) / 1000;
    const config = {
      version: 1,
      coverage: 'all-active-artworks',
      background: {
        src: this.resolution.background.src,
        aspect: Math.round(this.resolution.background.aspect * 1e6) / 1e6,
      },
      visualTokens: this.resolution.visualTokens,
      framePresets: this.resolution.framePresets,
      fallbacks: {
        requireAllMapped: true,
        autoPlaceUnmapped: true,
        overflow: 'paginate',
        invalidMapping: 'disable-slot',
        missingImage: 'placeholder-exact-target',
        selectionTimeoutMs: this.resolution.selectionTimeoutMs,
        selectionTimeout: 'open-exact-target-procedural',
      },
      slots: this.slotViews.map(({ slot }) => ({
        id: slot.id,
        enabled: slot.disabledReason !== 'explicitly-disabled',
        selectable: slot.selectable,
        ...(slot.artworkId ? { artworkId: slot.artworkId } : {}),
        placement: {
          cx: round(slot.placement.cx),
          cy: round(slot.placement.cy),
          maxW: round(slot.placement.maxW),
          maxH: round(slot.placement.maxH),
          rotateYDeg: round(slot.placement.rotateYDeg),
        },
      })),
    };
    const json = JSON.stringify(config, null, 2);
    if (this.calibrationOutput) this.calibrationOutput.value = json;
    this.diagnostics.info('frame-calibration', 'Museum hub calibration snapshot', { config });
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.cancelIdlePageDecode();
    if (this.resizeRafId !== 0) cancelAnimationFrame(this.resizeRafId);
    this.narrowQuery.removeEventListener('change', this.handleNarrowChange);
    window.removeEventListener('resize', this.handleResize);
    this.element.removeEventListener('pointerdown', this.handleSwipeStart);
    this.element.removeEventListener('pointerup', this.handleSwipeEnd);
    this.element.removeEventListener('keydown', this.handleKeydown);
    this.entryButton.removeEventListener('click', this.handleActivate);
    this.activateCallback = null;
    this.selectSlotCallback = null;
    this.slotViews.length = 0;
    this.roomLayers.length = 0;
    this.element.remove();
  }
}
