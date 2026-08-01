/**
 * Main Museum Hub (v0.82) — manifest-driven DOM projective composition.
 *
 * The hub renders the empty museum room (`museum-empty.png`) as the only
 * runtime background and overlays each active artwork as an unframed native
 * `<button>` projected onto calibrated wall planes. Every artwork on the same
 * wall shares the same camera-calibrated planar geometry, so perspective is no
 * longer approximated per slot.
 */

import {
  type MuseumHubResolution,
  type ResolvedHubSlot,
  type ResolvedHubWall,
  sanitizeMuseumHubConfig,
} from '../config/museumHub';
import {
  clonePoint,
  point,
  pointInPolygon,
  polygonsIntersect,
  projectSlotArtwork,
  quadIsConvex,
  quadIsDegenerate,
  type ProjectedArtworkGeometry,
  type Point2D,
} from './projectiveGeometry';
import { createScopedDiagnostics } from '../utils/Diagnostics';

const HUB_BACKGROUND_BASE_URL =
  window.location.protocol === 'file:'
    ? '../customer-artworks/'
    : `${import.meta.env.BASE_URL}`;
const HUB_IMAGE_TIMEOUT_MS = 5000;
const NARROW_PORTRAIT_QUERY = '(max-aspect-ratio: 4/5)';

const isCalibrationRequested = (): boolean => {
  try {
    return new URLSearchParams(window.location.search).get('hubCalibrate') === '1';
  } catch {
    return false;
  }
};

function resolveBackgroundUrl(src: string): string {
  if (window.location.protocol === 'file:') return `${HUB_BACKGROUND_BASE_URL}${src}`;
  return `${HUB_BACKGROUND_BASE_URL}${src.replace(/^Backgrounds\//, 'backgrounds/')}`;
}

type CalibrationDrag =
  | {
      kind: 'slot';
      slot: ResolvedHubSlot;
      button: HTMLButtonElement;
      pointerId: number;
      mode: 'move' | 'resize';
    }
  | {
      kind: 'wall-point';
      wallId: string;
      pointerId: number;
      target: 'quad' | 'safe';
      index: number;
    };

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
  private readonly stage: HTMLElement;
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
  private readonly stageWidth: number;
  private readonly stageHeight: number;
  private readonly resizeObserver: ResizeObserver | null;
  private calibrationOutput: HTMLTextAreaElement | null = null;
  private calibrationWarnings: HTMLUListElement | null = null;
  private calibrationRestoreButton: HTMLButtonElement | null = null;
  private calibrationWallSelect: HTMLSelectElement | null = null;
  private calibrationSvg: SVGSVGElement | null = null;
  private calibrationDrag: CalibrationDrag | null = null;
  private activeCalibrationWallId: string | null = null;
  private lastValidCalibrationSnapshot: string | null = null;
  private activateCallback: (() => void) | null = null;
  private selectSlotCallback: ((slot: ResolvedHubSlot) => void) | null = null;
  private disposed = false;
  private pageCount = 1;
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
    this.stageWidth = resolution.stage.width;
    this.stageHeight = resolution.stage.height;
    this.activeCalibrationWallId = resolution.walls[0]?.id ?? null;

    const hub = document.createElement('section');
    hub.className = 'museum-hub';
    hub.setAttribute('aria-labelledby', 'museum-hub-title');
    hub.style.setProperty('--hub-aspect', String(resolution.background.aspect));
    hub.style.setProperty('--hub-stage-width', `${this.stageWidth}px`);
    hub.style.setProperty('--hub-stage-height', `${this.stageHeight}px`);
    hub.style.setProperty('--hub-stage-scale', '1');
    if (this.calibrating) hub.classList.add('is-calibrating');

    const visual = document.createElement('div');
    visual.className = 'museum-hub__visual';
    const stage = document.createElement('div');
    stage.className = 'museum-hub__stage';

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
    stage.appendChild(image);

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

    stage.appendChild(entryButton);
    visual.appendChild(stage);
    hub.append(visual, shade, header, description, pager, status);
    app.appendChild(hub);

    this.element = hub;
    this.visual = visual;
    this.stage = stage;
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

    this.narrowQuery = window.matchMedia(NARROW_PORTRAIT_QUERY);
    this.narrowMode = this.narrowQuery.matches;
    this.narrowQuery.addEventListener('change', this.handleNarrowChange);

    this.resizeObserver =
      typeof ResizeObserver === 'function'
        ? new ResizeObserver(() => this.handleResize())
        : null;
    this.resizeObserver?.observe(this.visual);
    window.addEventListener('resize', this.handleResize);

    hub.addEventListener('pointerdown', this.handleSwipeStart, { passive: true });
    hub.addEventListener('pointerup', this.handleSwipeEnd, { passive: true });
    hub.addEventListener('keydown', this.handleKeydown);

    if (this.calibrating) {
      this.buildCalibrationOverlay();
      this.buildCalibrationPanel(hub);
      this.renderCalibrationOverlay();
    }

    this.imageReady = Promise.all([backgroundReady, this.decodePageImages(0)]).then(() => {
      this.applyView(true);
      this.updateStageScale();
      this.applyAllSlotGeometry();
      this.scheduleIdlePageDecode();
      if (this.calibrating) this.updateCalibrationOutput(true);
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
    requestAnimationFrame(() => this.focusInitialTarget());
  }

  async exit(reducedMotion: boolean): Promise<void> {
    if (this.disposed) return;
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
    this.stage.appendChild(rooms);
  }

  private buildSlotButton(slot: ResolvedHubSlot): SlotView {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'museum-hub__artwork';
    button.dataset['slotId'] = slot.id;
    if (slot.artworkId) button.dataset['artworkId'] = slot.artworkId;

    let image: HTMLImageElement | null = null;
    if (slot.selectable && slot.artworkId) {
      button.setAttribute('aria-label', `Kunstwerk „${slot.displayLabel}“ in der Ausstellung öffnen`);
      image = document.createElement('img');
      image.className = 'museum-hub__art';
      image.alt = '';
      image.decoding = 'async';
      image.draggable = false;
      image.addEventListener('error', () => {
        button.classList.add('has-missing-image');
        this.diagnostics.warn('artwork-image-missing', 'Hub artwork image failed; neutral placeholder retains exact target', {
          slotId: slot.id,
          artworkId: slot.artworkId,
        });
      });
      button.appendChild(image);
      const placeholder = document.createElement('span');
      placeholder.className = 'museum-hub__art-placeholder';
      placeholder.textContent = slot.displayLabel;
      button.appendChild(placeholder);
    } else {
      button.disabled = true;
      button.classList.add('is-disabled-slot');
      button.setAttribute('aria-label', 'Nicht verfügbarer Ausstellungsplatz');
      button.setAttribute('aria-disabled', 'true');
    }

    const label = document.createElement('span');
    label.className = 'museum-hub__artwork-label';
    label.setAttribute('aria-hidden', 'true');
    label.textContent = this.calibrating ? `${slot.id} · ${slot.displayLabel}` : slot.displayLabel;
    button.appendChild(label);

    if (this.calibrating) {
      const handle = document.createElement('span');
      handle.className = 'museum-hub__artwork-handle';
      handle.setAttribute('aria-hidden', 'true');
      button.appendChild(handle);
      button.disabled = false;
      button.addEventListener('pointerdown', (event) => {
        const target = event.target as HTMLElement | null;
        this.startSlotCalibrationDrag(event, slot, button, target?.classList.contains('museum-hub__artwork-handle') ? 'resize' : 'move');
      });
    } else if (slot.selectable) {
      button.addEventListener('click', () => this.handleSlotClick(slot));
    }

    this.applySlotGeometry(button, slot);
    return { slot, button, image };
  }

  private applySlotGeometry(button: HTMLButtonElement, slot: ResolvedHubSlot): void {
    const wall = this.resolution.wallById.get(slot.placement.wallId);
    if (!wall) {
      button.classList.add('is-invalid-geometry');
      return;
    }
    const projection = projectSlotArtwork(wall, slot.placement, Math.max(0.25, slot.artworkAspect), this.resolution.stage);
    if (!projection) {
      button.classList.add('is-invalid-geometry');
      return;
    }
    button.classList.remove('is-invalid-geometry');
    button.style.left = '0px';
    button.style.top = '0px';
    button.style.width = `${projection.sourceWidth}px`;
    button.style.height = `${projection.sourceHeight}px`;
    button.style.transform = projection.cssMatrix3d;
    const shadow = wall.shadowVector ?? point(wall.group === 'left' ? -10 : 10, 16);
    button.style.setProperty('--hub-shadow-x', `${shadow.x}px`);
    button.style.setProperty('--hub-shadow-y', `${shadow.y}px`);
  }

  private applyAllSlotGeometry(): void {
    for (const view of this.slotViews) this.applySlotGeometry(view.button, view.slot);
  }

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

  // ── View navigation ───────────────────────────────────────────────────────

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
      const wall = slot?.wallGroup === 'right' ? 1 : 0;
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
    this.element.dataset['wallFocus'] = wallFocus;
    if (wallFocus === 'full') {
      this.visual.style.setProperty('--hub-focus-scale', '1');
      this.visual.style.setProperty('--hub-focus-x', '0%');
    } else {
      this.visual.style.setProperty('--hub-focus-scale', '1.9');
      this.visual.style.setProperty('--hub-focus-x', wallFocus === 'left' ? '24%' : '-24%');
    }
    for (const view of this.slotViews) {
      view.button.classList.toggle('is-off-wall', wallFocus !== 'full' && view.slot.wallGroup !== wallFocus);
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

  private handleResize = (): void => {
    if (this.resizeRafId !== 0) return;
    this.resizeRafId = requestAnimationFrame(() => {
      this.resizeRafId = 0;
      this.updateStageScale();
      this.applyView();
      this.applyAllSlotGeometry();
      if (this.calibrating) this.renderCalibrationOverlay();
    });
  };

  private updateStageScale(): void {
    const rect = this.visual.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const scale = Math.min(rect.width / this.stageWidth, rect.height / this.stageHeight);
    this.element.style.setProperty('--hub-stage-scale', String(scale));
  }

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

  private buildCalibrationOverlay(): void {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('museum-hub__calibration-svg');
    svg.setAttribute('viewBox', `0 0 ${this.stageWidth} ${this.stageHeight}`);
    svg.setAttribute('aria-hidden', 'true');
    this.stage.appendChild(svg);
    this.calibrationSvg = svg;
  }

  private buildCalibrationPanel(hub: HTMLElement): void {
    const panel = document.createElement('div');
    panel.className = 'museum-hub__calibration';

    const heading = document.createElement('p');
    heading.className = 'museum-hub__calibration-title';
    heading.textContent = 'Hub-Kalibrierung — Wände, Safe-Zonen und Bildgrößen in customer-artworks/museum-hub.json speichern';

    const controls = document.createElement('div');
    controls.className = 'museum-hub__calibration-controls';

    const selectLabel = document.createElement('label');
    selectLabel.className = 'museum-hub__calibration-label';
    selectLabel.textContent = 'Aktive Wand';
    const select = document.createElement('select');
    select.className = 'museum-hub__calibration-select';
    for (const wall of this.resolution.walls) {
      const option = document.createElement('option');
      option.value = wall.id;
      option.textContent = `${wall.id} (${wall.group})`;
      select.appendChild(option);
    }
    if (this.activeCalibrationWallId) select.value = this.activeCalibrationWallId;
    select.addEventListener('change', () => {
      this.activeCalibrationWallId = select.value;
      this.renderCalibrationOverlay();
    });
    selectLabel.appendChild(select);

    const restoreButton = document.createElement('button');
    restoreButton.type = 'button';
    restoreButton.className = 'museum-hub__calibration-restore';
    restoreButton.textContent = 'Letzte gültige Konfiguration wiederherstellen';
    restoreButton.disabled = true;
    restoreButton.addEventListener('click', () => this.restoreLastValidCalibrationSnapshot());

    controls.append(selectLabel, restoreButton);

    const warningTitle = document.createElement('p');
    warningTitle.className = 'museum-hub__calibration-label';
    warningTitle.textContent = 'Prüfungen';
    const warningList = document.createElement('ul');
    warningList.className = 'museum-hub__calibration-warnings';

    const output = document.createElement('textarea');
    output.className = 'museum-hub__calibration-output';
    output.readOnly = true;
    output.rows = 16;
    output.setAttribute('aria-label', 'Museum-Hub-Konfiguration als JSON');

    panel.append(heading, controls, warningTitle, warningList, output);
    hub.appendChild(panel);
    this.calibrationOutput = output;
    this.calibrationWarnings = warningList;
    this.calibrationRestoreButton = restoreButton;
    this.calibrationWallSelect = select;
  }

  private startSlotCalibrationDrag(
    event: PointerEvent,
    slot: ResolvedHubSlot,
    button: HTMLButtonElement,
    mode: 'move' | 'resize'
  ): void {
    event.preventDefault();
    this.calibrationDrag = {
      kind: 'slot',
      slot,
      button,
      pointerId: event.pointerId,
      mode,
    };
    button.setPointerCapture(event.pointerId);
    button.addEventListener('pointermove', this.handleCalibrationMove as EventListener);
    button.addEventListener('pointerup', this.handleCalibrationEnd as EventListener);
    button.addEventListener('pointercancel', this.handleCalibrationEnd as EventListener);
  }

  private startWallPointCalibrationDrag(
    event: PointerEvent,
    wallId: string,
    target: 'quad' | 'safe',
    index: number
  ): void {
    event.preventDefault();
    const element = event.currentTarget as SVGCircleElement;
    this.calibrationDrag = {
      kind: 'wall-point',
      wallId,
      pointerId: event.pointerId,
      target,
      index,
    };
    element.setPointerCapture(event.pointerId);
    element.addEventListener('pointermove', this.handleCalibrationMove as EventListener);
    element.addEventListener('pointerup', this.handleCalibrationEnd as EventListener);
    element.addEventListener('pointercancel', this.handleCalibrationEnd as EventListener);
  }

  private pointerEventToStage(event: PointerEvent): Point2D | null {
    const rect = this.visual.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    return point(
      Math.min(this.stageWidth, Math.max(0, ((event.clientX - rect.left) / rect.width) * this.stageWidth)),
      Math.min(this.stageHeight, Math.max(0, ((event.clientY - rect.top) / rect.height) * this.stageHeight))
    );
  }

  private handleCalibrationMove = (event: PointerEvent): void => {
    const drag = this.calibrationDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const stagePoint = this.pointerEventToStage(event);
    if (!stagePoint) return;
    if (drag.kind === 'slot') {
      const wall = this.resolution.wallById.get(drag.slot.placement.wallId);
      if (!wall) return;
      const local = wall.inverseHomography
        ? this.applyInverseHomography(wall, stagePoint)
        : null;
      if (!local) return;
      if (drag.mode === 'move') {
        drag.slot.placement.center = point(this.clampLocalX(local.x), this.clampLocalY(local.y));
      } else {
        drag.slot.placement.mountedHeight = Math.max(0.04, Math.min(0.9, Math.abs(local.y - drag.slot.placement.center.y) * 2));
      }
      this.applySlotGeometry(drag.button, drag.slot);
    } else {
      const wall = this.resolution.wallById.get(drag.wallId);
      if (!wall) return;
      const targetPoints = drag.target === 'quad' ? wall.quad : wall.safePolygon;
      const targetPoint = targetPoints[drag.index];
      if (!targetPoint) return;
      targetPoint.x = stagePoint.x;
      targetPoint.y = stagePoint.y;
      this.applyAllSlotGeometry();
    }
    this.renderCalibrationOverlay();
    this.updateCalibrationOutput(false);
  };

  private handleCalibrationEnd = (event: PointerEvent): void => {
    const drag = this.calibrationDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    this.calibrationDrag = null;
    const currentTarget = event.currentTarget as Element | null;
    currentTarget?.removeEventListener('pointermove', this.handleCalibrationMove as EventListener);
    currentTarget?.removeEventListener('pointerup', this.handleCalibrationEnd as EventListener);
    currentTarget?.removeEventListener('pointercancel', this.handleCalibrationEnd as EventListener);
    this.renderCalibrationOverlay();
    this.updateCalibrationOutput(true);
  };

  private renderCalibrationOverlay(): void {
    if (!this.calibrationSvg) return;
    this.calibrationSvg.replaceChildren();
    const activeWallId = this.activeCalibrationWallId;
    for (const wall of this.resolution.walls) {
      const active = wall.id === activeWallId;
      const wallPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      wallPolygon.setAttribute('points', this.pointsToSvg(wall.quad));
      wallPolygon.setAttribute('class', `museum-hub__calibration-wall${active ? ' is-active' : ''}`);
      wallPolygon.addEventListener('pointerdown', () => {
        this.activeCalibrationWallId = wall.id;
        if (this.calibrationWallSelect) this.calibrationWallSelect.value = wall.id;
        this.renderCalibrationOverlay();
      });
      this.calibrationSvg.appendChild(wallPolygon);

      const safePolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      safePolygon.setAttribute('points', this.pointsToSvg(wall.safePolygon));
      safePolygon.setAttribute('class', `museum-hub__calibration-safe${active ? ' is-active' : ''}`);
      this.calibrationSvg.appendChild(safePolygon);

      if (!active) continue;
      wall.quad.forEach((corner, index) => this.calibrationSvg!.appendChild(this.createCalibrationHandle(wall.id, 'quad', index, corner, 'museum-hub__calibration-handle')));
      wall.safePolygon.forEach((corner, index) => this.calibrationSvg!.appendChild(this.createCalibrationHandle(wall.id, 'safe', index, corner, 'museum-hub__calibration-handle museum-hub__calibration-handle--safe')));
    }
  }

  private createCalibrationHandle(
    wallId: string,
    target: 'quad' | 'safe',
    index: number,
    position: Point2D,
    className: string
  ): SVGCircleElement {
    const handle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    handle.setAttribute('class', className);
    handle.setAttribute('cx', position.x.toFixed(2));
    handle.setAttribute('cy', position.y.toFixed(2));
    handle.setAttribute('r', '8');
    handle.addEventListener('pointerdown', (event) => this.startWallPointCalibrationDrag(event, wallId, target, index));
    return handle;
  }

  private pointsToSvg(points: readonly Point2D[]): string {
    return points.map((current) => `${current.x.toFixed(2)},${current.y.toFixed(2)}`).join(' ');
  }

  private applyInverseHomography(wall: ResolvedHubWall, stagePoint: Point2D): Point2D | null {
    if (!wall.inverseHomography) return null;
    const [a, b, c, d, e, f, g, h, i] = wall.inverseHomography;
    const denominator = g * stagePoint.x + h * stagePoint.y + i;
    if (Math.abs(denominator) <= 1e-6) return null;
    return point(
      (a * stagePoint.x + b * stagePoint.y + c) / denominator,
      (d * stagePoint.x + e * stagePoint.y + f) / denominator
    );
  }

  private clampLocalX(value: number): number {
    return Math.min(1, Math.max(0, value));
  }

  private clampLocalY(value: number): number {
    return Math.min(1, Math.max(0, value));
  }

  private collectCalibrationWarnings(): string[] {
    const warnings: string[] = [];
    for (const wall of this.resolution.walls) {
      if (quadIsDegenerate(wall.quad) || !quadIsConvex(wall.quad)) {
        warnings.push(`Wall ${wall.id}: the calibrated wall quad must remain convex and non-degenerate.`);
      }
      if (wall.safePolygon.length < 3) {
        warnings.push(`Wall ${wall.id}: the safe polygon needs at least three points.`);
      }
    }
    const visibleByPage = new Map<number, { slot: ResolvedHubSlot; quad: ProjectedArtworkGeometry }[]>();
    for (const view of this.slotViews) {
      const { slot } = view;
      if (!slot.selectable || !slot.artworkId) continue;
      const wall = this.resolution.wallById.get(slot.placement.wallId);
      if (!wall) {
        warnings.push(`Slot ${slot.id}: wall ${slot.placement.wallId} is missing.`);
        continue;
      }
      const projection = projectSlotArtwork(wall, slot.placement, slot.artworkAspect, this.resolution.stage);
      if (!projection) {
        warnings.push(`Slot ${slot.id}: projected geometry is invalid.`);
        continue;
      }
      if (!projection.localQuad.every((corner) => pointInPolygon(corner, wall.safePolygon))) {
        warnings.push(`Slot ${slot.id}: artwork extends outside the wall safe zone.`);
      }
      if (projection.shortEdge < 84) {
        warnings.push(`Slot ${slot.id}: projected short edge ${projection.shortEdge.toFixed(1)}px is below 84px.`);
      }
      const pageList = visibleByPage.get(slot.pageIndex) ?? [];
      pageList.push({ slot, quad: projection });
      visibleByPage.set(slot.pageIndex, pageList);
    }
    for (const [pageIndex, entries] of visibleByPage) {
      for (let index = 0; index < entries.length; index += 1) {
        const current = entries[index]!;
        for (let nextIndex = index + 1; nextIndex < entries.length; nextIndex += 1) {
          const next = entries[nextIndex]!;
          if (polygonsIntersect(current.quad.projectedQuad, next.quad.projectedQuad)) {
            warnings.push(`Page ${pageIndex + 1}: ${current.slot.id} overlaps ${next.slot.id}.`);
          }
        }
      }
    }
    return warnings;
  }

  private buildCurrentCalibrationConfig(): unknown {
    return {
      version: 2,
      coverage: 'all-active-artworks',
      stage: this.resolution.stage,
      background: this.resolution.background,
      visualTokens: this.resolution.visualTokens,
      walls: this.resolution.walls.map((wall) => ({
        id: wall.id,
        group: wall.group,
        planeAspect: Math.round(wall.planeAspect * 1000) / 1000,
        quad: wall.quad.map((corner) => this.roundPoint(corner)),
        safePolygon: wall.safePolygon.map((corner) => this.roundPoint(corner)),
        ...(wall.shadowVector ? { shadowVector: this.roundPoint(wall.shadowVector) } : {}),
      })),
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
          wallId: slot.placement.wallId,
          center: this.roundPoint(slot.placement.center),
          mountedHeight: this.round(slot.placement.mountedHeight),
          ...(slot.placement.provisional ? { provisional: true } : {}),
        },
      })),
    };
  }

  private updateCalibrationOutput(commitLastValid: boolean): void {
    const config = this.buildCurrentCalibrationConfig();
    const warnings = this.collectCalibrationWarnings();
    const json = JSON.stringify(config, null, 2);
    if (this.calibrationOutput) this.calibrationOutput.value = json;
    if (this.calibrationWarnings) {
      this.calibrationWarnings.replaceChildren();
      const entries = warnings.length > 0 ? warnings : ['Keine Warnungen — Konfiguration erfüllt alle Kalibrierungsprüfungen.'];
      for (const entry of entries) {
        const item = document.createElement('li');
        item.textContent = entry;
        this.calibrationWarnings.appendChild(item);
      }
    }
    if (warnings.length === 0 && commitLastValid) {
      this.lastValidCalibrationSnapshot = json;
      if (this.calibrationRestoreButton) this.calibrationRestoreButton.disabled = false;
    }
    this.diagnostics.info('hub-calibration', 'Museum hub wall-plane calibration snapshot', { warnings, config });
  }

  private restoreLastValidCalibrationSnapshot(): void {
    if (!this.lastValidCalibrationSnapshot) return;
    const sanitized = sanitizeMuseumHubConfig(JSON.parse(this.lastValidCalibrationSnapshot));
    const config = sanitized.config;
    if (!config) return;
    for (const wall of config.walls) {
      const currentWall = this.resolution.wallById.get(wall.id);
      if (!currentWall) continue;
      currentWall.quad.forEach((corner, index) => {
        corner.x = wall.quad[index]!.x;
        corner.y = wall.quad[index]!.y;
      });
      const nextSafe = wall.safePolygon ?? [];
      currentWall.safePolygon.splice(0, currentWall.safePolygon.length, ...nextSafe.map((corner) => clonePoint(corner)));
      currentWall.planeAspect = wall.planeAspect;
      if (wall.shadowVector) currentWall.shadowVector = clonePoint(wall.shadowVector);
    }
    for (const slot of config.slots) {
      const currentSlot = this.slotViews.find((view) => view.slot.id === slot.id)?.slot;
      if (!currentSlot) continue;
      currentSlot.placement.wallId = slot.placement.wallId;
      currentSlot.placement.center = clonePoint(slot.placement.center);
      currentSlot.placement.mountedHeight = slot.placement.mountedHeight;
      currentSlot.placement.provisional = slot.placement.provisional === true;
    }
    this.applyAllSlotGeometry();
    this.renderCalibrationOverlay();
    this.updateCalibrationOutput(true);
  }

  private round(value: number): number {
    return Math.round(value * 1000) / 1000;
  }

  private roundPoint(value: Point2D): Point2D {
    return point(this.round(value.x), this.round(value.y));
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.cancelIdlePageDecode();
    if (this.resizeRafId !== 0) cancelAnimationFrame(this.resizeRafId);
    this.resizeObserver?.disconnect();
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
