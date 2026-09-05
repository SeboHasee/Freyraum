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
  HUB_MIN_PROJECTED_SHORT_EDGE_PX,
  type MuseumHubResolution,
  type ResolvedHubSlot,
  type ResolvedHubWall,
  sanitizeMuseumHubConfig,
} from '../config/museumHub';
import {
  applyHomography,
  clonePoint,
  point,
  pointInPolygon,
  polygonsIntersect,
  projectRoomDoorwayPolygons,
  projectWorldPoint,
  projectSlotArtwork,
  quadIsConvex,
  quadIsDegenerate,
  type ProjectedArtworkGeometry,
  type Point2D,
  type Quad,
} from './projectiveGeometry';
import { createScopedDiagnostics } from '../utils/Diagnostics';
import {
  redactArtworkImageUrlForLog,
  resolveArtworkImageSources,
  type ArtworkImageSourceCandidate,
} from '../utils/artworkImageSources';
import { loadHubImageAsset } from './hubAssetLoader';
import { HubRoomRenderer, type SlotUpsertResult } from './HubRoomRenderer';
import type { QualityPreset } from '../config/quality';
import {
  getRuntimeProtocol,
  recordSourceToPixelOutcome,
  shouldPreferEmbeddedWebglFallback,
  shouldRetryEmbeddedFallbackAfterPostUploadFailure,
} from '../utils/sourceToPixelOutcome';
import { releaseWebGLContext } from '../utils/webgl';

const HUB_BACKGROUND_BASE_URL =
  window.location.protocol === 'file:'
    ? '../customer-artworks/'
    : `${import.meta.env.BASE_URL}`;
const HUB_IMAGE_TIMEOUT_MS = 5000;
const HUB_INLINE_IMAGE_TIMEOUT_MS = 20000;
const NARROW_PORTRAIT_QUERY = '(max-aspect-ratio: 4/5)';

type SlotImageAttemptFailureReason =
  | 'no-source'
  | 'load-error'
  | 'load-timeout'
  | 'decode-error'
  | 'decode-timeout';

type SlotImageAttemptResult =
  | {
      status: 'ready';
      width: number;
      height: number;
    }
  | {
      status: 'failed';
      reason: SlotImageAttemptFailureReason;
    };

const isCalibrationRequested = (): boolean => {
  try {
    return new URLSearchParams(window.location.search).get('hubCalibrate') === '1';
  } catch {
    return false;
  }
};

const isHubDebugRequested = (): boolean => {
  try {
    return new URLSearchParams(window.location.search).get('hubDebug') === '1';
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
      target: 'quad' | 'safe' | 'mounting-zone';
      index: number;
    };

interface SlotView {
  slot: ResolvedHubSlot;
  button: HTMLButtonElement;
  image: HTMLImageElement | null;
  imageLoadToken: number;
  imageState: 'idle' | 'loading' | 'ready' | 'missing';
  resolvedSource: ArtworkImageSourceCandidate | null;
  fallbackReason: string | null;
  /** v0.92: GPU-upload/visible-pixel proof from the most recent renderer sync. */
  lastUpsertResult: SlotUpsertResult | null;
}

export class MainMuseumHub {
  readonly element: HTMLElement;
  private readonly diagnostics = createScopedDiagnostics('hub');
  private readonly resolution: MuseumHubResolution;
  private readonly visual: HTMLElement;
  private readonly stage: HTMLElement;
  private readonly hubRoomRenderer: HubRoomRenderer | null;
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
  private readonly debugGeometry: boolean;
  private readonly stageWidth: number;
  private readonly stageHeight: number;
  private readonly resizeObserver: ResizeObserver | null;
  private calibrationOutput: HTMLTextAreaElement | null = null;
  private calibrationWarnings: HTMLUListElement | null = null;
  private calibrationRestoreButton: HTMLButtonElement | null = null;
  private calibrationWallSelect: HTMLSelectElement | null = null;
  private calibrationSlotSelect: HTMLSelectElement | null = null;
  private calibrationFields = new Map<string, HTMLInputElement>();
  private calibrationCopyButton: HTMLButtonElement | null = null;
  private calibrationDownloadButton: HTMLButtonElement | null = null;
  private calibrationUndoButton: HTMLButtonElement | null = null;
  private calibrationRedoButton: HTMLButtonElement | null = null;
  private calibrationActionStatus: HTMLParagraphElement | null = null;
  private calibrationSvg: SVGSVGElement | null = null;
  private calibrationDrag: CalibrationDrag | null = null;
  private activeCalibrationWallId: string | null = null;
  private activeCalibrationSlotId: string | null = null;
  private lastValidCalibrationSnapshot: string | null = null;
  private initialCalibrationSnapshot: string | null = null;
  private calibrationUndoStack: string[] = [];
  private calibrationRedoStack: string[] = [];
  private calibrationExportValid = false;
  private readonly calibrationWallOwnership = new Map<string, string>();
  private activateCallback: (() => void) | null = null;
  private selectSlotCallback: ((slot: ResolvedHubSlot) => void) | null = null;
  private disposed = false;
  private pageCount = 1;
  private viewIndex = 0;
  private narrowMode = false;
  private lastActivatedSlotId: string | null = null;
  private selectedArtworkId: string | null = null;
  private lastSelectionSignature: string | null = null;
  private decodedPages = new Set<number>();
  private idleDecodeHandle: number | null = null;
  private idleDecodeNextPage = 1;
  private projectedSlotGeometry = new Map<string, ProjectedArtworkGeometry>();
  private debugProjectionSignatureBySlot = new Map<string, string>();
  private swipeStartX: number | null = null;
  private swipeStartY: number | null = null;
  private resizeRafId = 0;

  constructor(app: HTMLElement, resolution: MuseumHubResolution, preset: QualityPreset) {
    this.resolution = resolution;
    this.calibrating = isCalibrationRequested();
    this.debugGeometry = isHubDebugRequested();
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
    if (this.debugGeometry) hub.classList.add('is-debug-geometry');

    const visual = document.createElement('div');
    visual.className = 'museum-hub__visual';
    const stage = document.createElement('div');
    stage.className = 'museum-hub__stage';

    const image = document.createElement('img');
    image.className = 'museum-hub__image';
    image.alt = '';
    image.decoding = 'async';
    image.draggable = false;
    const primaryBackgroundUrl = resolveBackgroundUrl(resolution.background.src);
    const fallbackBackgroundUrl = resolveBackgroundUrl(resolution.backgroundFallback.src);
    const backgroundReady = loadHubImageAsset({
      image,
      role: 'background',
      primaryPath: resolution.background.src,
      primaryUrl: primaryBackgroundUrl,
      fallbackPath: resolution.backgroundFallback.src,
      fallbackUrl: fallbackBackgroundUrl,
      timeoutMs: HUB_IMAGE_TIMEOUT_MS,
      diagnostics: this.diagnostics,
      context: {
        hubSource: resolution.source,
        stage: `${resolution.stage.width}x${resolution.stage.height}`,
        selectableSlots: resolution.slotToArtwork.size,
      },
      onNeutralFallback: () => {
        hub.classList.add('has-image-error');
      },
    }).then((outcome) => {
      if (outcome.status === 'neutral-fallback') {
        hub.classList.add('has-image-error');
        return;
      }
      hub.classList.remove('has-image-error');
    }).catch((error: unknown) => {
      hub.classList.add('has-image-error');
      this.diagnostics.warn(
        'hub-asset-loader-unexpected',
        'Hub background loader threw unexpectedly; continuing with neutral museum-grey surface',
        {
          primaryPath: resolution.background.src,
          fallbackPath: resolution.backgroundFallback.src,
          error,
        }
      );
    });
    stage.appendChild(image);
    let hubRoomRenderer: HubRoomRenderer | null = null;
    try {
      hubRoomRenderer = new HubRoomRenderer(stage, resolution, preset);
    } catch (error) {
      const failedCanvas = stage.querySelector('canvas');
      releaseWebGLContext(failedCanvas?.getContext('webgl2') ?? null);
      failedCanvas?.remove();
      hub.classList.add('is-2d');
      this.diagnostics.warn(
        'renderer-fallback',
        'Hub renderer failed; continuing with the accessible DOM museum',
        {
          stage: 'hub-renderer-initialization',
          message: error instanceof Error ? error.message : String(error),
          protocol: window.location.protocol,
        }
      );
    }
    this.hubRoomRenderer = hubRoomRenderer;

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
    for (const { slot } of this.slotViews) {
      this.calibrationWallOwnership.set(slot.id, slot.placement.wallId);
    }
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

    if (this.calibrating || this.debugGeometry) {
      this.buildCalibrationOverlay();
      if (this.calibrating) this.buildCalibrationPanel(hub);
      this.renderCalibrationOverlay();
    }

    this.imageReady = Promise.all([backgroundReady, this.decodePageImages(0)]).then(() => {
      this.applyView(true);
      this.updateStageScale();
      this.applyAllSlotGeometry();
      this.applySelectionState('composition-ready');
      this.scheduleIdlePageDecode();
      if (this.calibrating) this.updateCalibrationOutput(true);
      if (this.debugGeometry) this.emitDebugGeometrySnapshot('composition-ready');
      this.diagnostics.info('composition-ready', 'Hub composition prepared', {
        pages: this.pageCount,
        selectableSlots: this.resolution.slotToArtwork.size,
        source: this.resolution.source,
        debugGeometry: this.debugGeometry,
      });
    });
  }

  onActivate(callback: () => void): void {
    this.activateCallback = callback;
  }

  /** Forwards quality-preset changes to the hub room renderer (v0.87). */
  applyPreset(preset: QualityPreset): void {
    if (this.disposed) return;
    this.hubRoomRenderer?.applyPreset(preset);
  }

  onSelectSlot(callback: (slot: ResolvedHubSlot) => void): void {
    this.selectSlotCallback = callback;
  }

  setSelectedArtworkId(
    artworkId: string | null,
    options: { alignPage?: boolean; restoreFocus?: boolean; source?: string } = {}
  ): void {
    const nextArtworkId =
      artworkId && this.resolution.artworkToSlot.has(artworkId) ? artworkId : null;
    this.selectedArtworkId = nextArtworkId;
    const selectedView = nextArtworkId
      ? this.slotViews.find((view) => view.slot.artworkId === nextArtworkId && !view.button.disabled)
      : undefined;
    if (selectedView && options.alignPage !== false) {
      this.goToPage(selectedView.slot.pageIndex, selectedView.slot);
    }
    this.applySelectionState(options.source ?? 'external-selection-sync', {
      restoreFocus: options.restoreFocus === true,
    });
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
    this.applySelectionState('enter');
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
    const selected = this.selectedArtworkId
      ? this.slotViews.find((view) => view.slot.artworkId === this.selectedArtworkId && !view.button.disabled)
      : undefined;
    if (selected) {
      this.goToPage(selected.slot.pageIndex, selected.slot);
      selected.button.focus({ preventScroll: true });
      this.logSelectionLifecycle('focus-selected-target');
      return;
    }
    const restored = this.lastActivatedSlotId
      ? this.slotViews.find((view) => view.slot.id === this.lastActivatedSlotId && !view.button.disabled)
      : undefined;
    if (restored) {
      this.goToPage(restored.slot.pageIndex, restored.slot);
      restored.button.focus({ preventScroll: true });
      this.logSelectionLifecycle('focus-restored-slot');
      return;
    }
    const firstSelectable = this.slotViews.find((view) => view.slot.selectable);
    (firstSelectable?.button ?? this.entryButton).focus({ preventScroll: true });
    this.logSelectionLifecycle('focus-first-target');
  }

  private applySelectionState(
    reason: string,
    options: { restoreFocus?: boolean } = {}
  ): void {
    let selectedView: SlotView | undefined;
    for (const view of this.slotViews) {
      const selected = !!this.selectedArtworkId && view.slot.artworkId === this.selectedArtworkId;
      view.button.classList.toggle('is-selected', selected);
      if (selected) {
        view.button.setAttribute('aria-current', 'true');
        selectedView = view;
      } else {
        view.button.removeAttribute('aria-current');
      }
    }
    const signature = `${reason}:${this.selectedArtworkId ?? 'none'}:${selectedView?.slot.id ?? 'none'}:${this.viewIndex}`;
    if (this.lastSelectionSignature !== signature) {
      this.lastSelectionSignature = signature;
      this.logSelectionLifecycle(reason);
    }
    if (options.restoreFocus && selectedView) {
      selectedView.button.focus({ preventScroll: true });
    }
  }

  private logSelectionLifecycle(reason: string): void {
    const selectedView = this.selectedArtworkId
      ? this.slotViews.find((view) => view.slot.artworkId === this.selectedArtworkId)
      : undefined;
    this.diagnostics.info('hub-selection-lifecycle', 'Hub selection lifecycle updated', {
      reason,
      selectedArtworkId: this.selectedArtworkId,
      selectedSlotId: selectedView?.slot.id ?? null,
      selectedPageIndex: selectedView?.slot.pageIndex ?? null,
      currentViewIndex: this.viewIndex,
      currentWallFocus: this.element.dataset['wallFocus'] ?? 'full',
      lastActivatedSlotId: this.lastActivatedSlotId,
      renderedSlots: this.slotViews.length,
    });
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
        if (!this.calibrating && !this.debugGeometry && (!slot.selectable || !slot.artworkId)) continue;
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
    label.textContent = this.calibrating || this.debugGeometry ? `${slot.id} · ${slot.displayLabel}` : slot.displayLabel;
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
    const view: SlotView = {
      slot,
      button,
      image,
      imageLoadToken: 0,
      imageState: 'idle',
      resolvedSource: null,
      fallbackReason: null,
      lastUpsertResult: null,
    };
    this.syncSlotRenderer(view);
    return view;
  }

  private applySlotGeometry(button: HTMLButtonElement, slot: ResolvedHubSlot): void {
    const wall = this.resolution.wallById.get(slot.placement.wallId);
    if (!wall) {
      button.classList.add('is-invalid-geometry');
      this.projectedSlotGeometry.delete(slot.id);
      this.hubRoomRenderer?.setSlotHidden(slot.id);
      button.style.width = '0px';
      button.style.height = '0px';
      button.style.clipPath = 'none';
      button.style.removeProperty('--hub-clip-path');
      this.diagnostics.warn('hub-slot-missing-wall', 'Hub slot geometry skipped because the wall is missing', {
        slotId: slot.id,
        wallId: slot.placement.wallId,
      });
      return;
    }
    const projection = projectSlotArtwork(wall, slot.placement, Math.max(0.25, slot.artworkAspect), this.resolution.stage);
    if (!projection) {
      button.classList.add('is-invalid-geometry');
      this.projectedSlotGeometry.delete(slot.id);
      this.hubRoomRenderer?.setSlotHidden(slot.id);
      button.style.width = '0px';
      button.style.height = '0px';
      button.style.clipPath = 'none';
      button.style.removeProperty('--hub-clip-path');
      this.diagnostics.warn('hub-slot-projection-invalid', 'Hub slot projection is invalid and will not render interactively', {
        slotId: slot.id,
        artworkId: slot.artworkId,
        wallId: wall.id,
        projectionRealism: wall.projectionRealism,
      });
      return;
    }
    this.projectedSlotGeometry.set(slot.id, projection);
    button.classList.remove('is-invalid-geometry');
    const bounds = projection.projectedQuad.reduce(
      (accumulator, corner) => ({
        minX: Math.min(accumulator.minX, corner.x),
        maxX: Math.max(accumulator.maxX, corner.x),
        minY: Math.min(accumulator.minY, corner.y),
        maxY: Math.max(accumulator.maxY, corner.y),
      }),
      { minX: Number.POSITIVE_INFINITY, maxX: Number.NEGATIVE_INFINITY, minY: Number.POSITIVE_INFINITY, maxY: Number.NEGATIVE_INFINITY }
    );
    const width = Math.max(1, bounds.maxX - bounds.minX);
    const height = Math.max(1, bounds.maxY - bounds.minY);
    const clipPath = `polygon(${projection.projectedQuad
      .map((corner) => `${(((corner.x - bounds.minX) / width) * 100).toFixed(3)}% ${(((corner.y - bounds.minY) / height) * 100).toFixed(3)}%`)
      .join(', ')})`;
    button.style.left = `${bounds.minX}px`;
    button.style.top = `${bounds.minY}px`;
    button.style.width = `${width}px`;
    button.style.height = `${height}px`;
    button.style.transform = 'none';
    button.style.clipPath = clipPath;
    button.style.setProperty('--hub-clip-path', clipPath);
    const shadow = wall.shadowVector ?? point(wall.group === 'left' ? -10 : 10, 16);
    button.style.setProperty('--hub-shadow-x', `${shadow.x}px`);
    button.style.setProperty('--hub-shadow-y', `${shadow.y}px`);
    const view = this.slotViews.find((candidate) => candidate.slot.id === slot.id);
    if (view) this.syncSlotRenderer(view);
    if (this.debugGeometry) this.logSlotProjection(slot, wall, projection);
  }

  private syncSlotRenderer(view: SlotView): void {
    if (!this.hubRoomRenderer) {
      view.lastUpsertResult = null;
      return;
    }
    const wall = this.resolution.wallById.get(view.slot.placement.wallId);
    if (!wall) return;
    const missingImage =
      view.imageState !== 'ready'
      || !view.image
      || !view.image.complete
      || view.image.naturalWidth <= 0;
    view.lastUpsertResult = this.hubRoomRenderer.upsertSlot(
      view.slot,
      wall,
      view.image,
      missingImage,
      view.resolvedSource?.resolvedUrlType ?? null
    );
  }

  private applyAllSlotGeometry(): void {
    for (const view of this.slotViews) this.applySlotGeometry(view.button, view.slot);
    this.applySelectionState('geometry-refresh');
    if (this.calibrating || this.debugGeometry) this.renderCalibrationOverlay();
  }

  private logSlotProjection(slot: ResolvedHubSlot, wall: ResolvedHubWall, projection: ProjectedArtworkGeometry): void {
    const signature = projection.projectedQuad
      .map((corner) => `${corner.x.toFixed(1)},${corner.y.toFixed(1)}`)
      .join('|');
    if (this.debugProjectionSignatureBySlot.get(slot.id) === signature) return;
    this.debugProjectionSignatureBySlot.set(slot.id, signature);

    const withinSafePolygon = projection.projectedQuad.every((corner) => pointInPolygon(corner, wall.safePolygon));
    this.diagnostics.info('hub-debug-slot-projection', 'Projected slot geometry snapshot', {
      slotId: slot.id,
      wallId: wall.id,
      selectedArtworkId: this.selectedArtworkId,
      localAnchor: slot.placement.anchor ?? null,
      localQuad: projection.localQuad,
      worldQuad: projection.worldQuad ?? null,
      projectedAnchor: projection.projectedAnchor ?? null,
      projectedQuad: projection.projectedQuad,
      homography: wall.homography,
      inverseHomography: wall.inverseHomography,
      withinSafePolygon,
      shortEdgePx: Math.round(projection.shortEdge * 100) / 100,
      placement: projection.placement,
      validity: projection.validity ?? null,
      realism: projection.realism ?? wall.projectionRealism ?? null,
      alignment: projection.alignment ?? null,
    });
  }

  private emitDebugGeometrySnapshot(reason: string): void {
    if (!this.debugGeometry) return;
    const slotDiagnostics = this.slotViews
      .filter(({ slot }) => slot.selectable && !!slot.artworkId)
      .map(({ slot, imageState, resolvedSource, fallbackReason }) => {
        const wall = this.resolution.wallById.get(slot.placement.wallId);
        const projection = this.projectedSlotGeometry.get(slot.id);
        return {
          slotId: slot.id,
          wallId: slot.placement.wallId,
          imageState,
          sourceMode: resolvedSource?.mode ?? null,
          sourceUrlType: resolvedSource?.resolvedUrlType ?? null,
          bundleId: resolvedSource?.bundleId ?? null,
          fallbackReason,
          localQuad: projection?.localQuad ?? null,
          worldQuad: projection?.worldQuad ?? null,
          projectedAnchor: projection?.projectedAnchor ?? null,
          projectedQuad: projection?.projectedQuad ?? null,
          homography: wall?.homography ?? null,
          inverseHomography: wall?.inverseHomography ?? null,
          withinSafePolygon:
            wall && projection
              ? projection.projectedQuad.every((corner) => pointInPolygon(corner, wall.safePolygon))
              : false,
          validity: projection?.validity ?? null,
          alignment: projection?.alignment ?? null,
        };
      });
    this.diagnostics.info('hub-debug-geometry', 'Hub debug geometry snapshot', {
      reason,
      stage: this.resolution.stage,
      visualTokens: this.resolution.visualTokens,
      backgroundState: {
        imageError: this.element.classList.contains('has-image-error'),
      },
      selection: {
        selectedArtworkId: this.selectedArtworkId,
        lastActivatedSlotId: this.lastActivatedSlotId,
      },
      walls: this.resolution.walls.map((wall) => ({
        id: wall.id,
        group: wall.group,
        quad: wall.quad,
        safePolygon: wall.safePolygon,
        referenceQuad: wall.referenceQuad,
        referenceSafePolygon: wall.referenceSafePolygon,
        projectedQuad: wall.projectedQuad,
        projectedSafePolygon: wall.projectedSafePolygon,
        projectedDoorways:
          wall.room && wall.camera
            ? projectRoomDoorwayPolygons(wall.room, wall.camera, this.resolution.stage)
            : [],
        projectionRealism: wall.projectionRealism,
        expectedConvergence: wall.expectedConvergence,
      })),
      slots: slotDiagnostics,
    });
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
      waits.push(this.resolveSlotImage(view));
    }
    return Promise.all(waits).then(() => undefined);
  }

  private async resolveSlotImage(view: SlotView): Promise<void> {
    const sourceRecord = view.slot.artworkId
      ? this.resolution.artworkSourceById.get(view.slot.artworkId) ?? null
      : null;
    const sourcePlan = resolveArtworkImageSources(sourceRecord);
    const runtimeProtocol = getRuntimeProtocol();
    const preferEmbeddedWebgl = shouldPreferEmbeddedWebglFallback(
      {
        runtimeProtocol,
        resolvedUrlType: sourcePlan.primary?.resolvedUrlType ?? null,
        debugEnabled: this.diagnostics.isDebugEnabled(),
      },
      !!sourcePlan.fallback
    );
    const primary = preferEmbeddedWebgl && sourcePlan.fallback ? sourcePlan.fallback : sourcePlan.primary;
    const fallback = preferEmbeddedWebgl ? null : sourcePlan.fallback;
    const primaryUsesEmbeddedFallback = primary?.mode === 'embedded-webgl-fallback';
    const startedAt = this.now();
    if (!primary || !view.image || !view.slot.artworkId) {
      this.setSlotImageState(view, 'missing', null, 'no-source');
      this.diagnostics.warn('artwork-image-missing', 'Hub artwork image is unavailable; neutral placeholder retains exact target', {
        slotId: view.slot.id,
        artworkId: view.slot.artworkId,
        bundleId: sourcePlan.fallback?.bundleId ?? null,
        fallbackReason: 'no-source',
      });
      if (view.slot.artworkId) {
        recordSourceToPixelOutcome(this.diagnostics, {
          route: 'hub',
          artworkId: view.slot.artworkId,
          bundleId: sourcePlan.fallback?.bundleId ?? null,
          runtimeProtocol,
          candidateMode: null,
          resolvedUrlType: null,
          usedEmbeddedFallback: false,
          attemptedEmbeddedFallback: false,
          result: 'failed',
          firstFailedStage: 'candidate-selected',
          failureReason: 'no-source',
          elapsedMs: Math.round(this.now() - startedAt),
          sourceWidth: null,
          sourceHeight: null,
          uploadWidth: null,
          uploadHeight: null,
          downscaleApplied: false,
          rendererMaxTextureSize: this.hubRoomRenderer?.getMaxTextureSize() ?? null,
          visibleProbe: null,
        });
      }
      return;
    }

    this.setSlotImageState(view, 'loading', null, null);

    const primaryResult = await this.loadSlotImageCandidate(view, primary);
    if (primaryResult.status === 'ready') {
      const primaryResolution = this.applyResolvedSlotSource(view, primary, null, 'loaded', primaryResult);
      if (primaryResolution.status === 'ready') {
        this.recordHubSourceToPixelOutcome(view, {
          bundleId: primary.bundleId,
          candidateMode: primary.mode,
          resolvedUrlType: primary.resolvedUrlType,
          usedEmbeddedFallback: primaryUsesEmbeddedFallback,
          attemptedEmbeddedFallback: primaryUsesEmbeddedFallback,
          startedAt,
        });
        return;
      }
      const primaryFailure = `${primary.mode}:${primaryResolution.stage}:${primaryResolution.reason}`;
      const primaryUpsertFailure = view.lastUpsertResult;
      const shouldRetryAfterPrimaryPostUploadFailure = shouldRetryEmbeddedFallbackAfterPostUploadFailure(
        {
          runtimeProtocol,
          resolvedUrlType: primary.resolvedUrlType,
          debugEnabled: this.diagnostics.isDebugEnabled(),
        },
        !!fallback
      );
      if (fallback && shouldRetryAfterPrimaryPostUploadFailure) {
        this.diagnostics.warn('artwork-image-retry', 'Hub artwork source failed after GPU upload; retrying embedded fallback', {
          slotId: view.slot.id,
          artworkId: view.slot.artworkId,
          bundleId: fallback.bundleId,
          declaredImageUrl: redactArtworkImageUrlForLog(primary.declaredUrl),
          fallbackImageUrl: redactArtworkImageUrlForLog(fallback.resolvedUrl),
          declaredImageUrlType: primary.declaredUrlType,
          fallbackImageUrlType: fallback.resolvedUrlType,
          fallbackReason: primaryFailure,
          visibleProbe: primaryUpsertFailure?.visibleProbe ?? null,
        });
        const fallbackResult = await this.loadSlotImageCandidate(view, fallback);
        if (fallbackResult.status === 'ready') {
          const fallbackResolution = this.applyResolvedSlotSource(
            view,
            fallback,
            primaryFailure,
            'fallback-loaded',
            fallbackResult
          );
          if (fallbackResolution.status === 'ready') {
            this.recordHubSourceToPixelOutcome(view, {
              bundleId: fallback.bundleId,
              candidateMode: fallback.mode,
              resolvedUrlType: fallback.resolvedUrlType,
              usedEmbeddedFallback: true,
              attemptedEmbeddedFallback: true,
              startedAt,
            });
            return;
          }
          const fallbackFailure = `${fallback.mode}:${fallbackResolution.stage}:${fallbackResolution.reason}`;
          const fallbackUpsertFailure = view.lastUpsertResult;
          this.setSlotImageState(view, 'missing', null, fallbackFailure);
          this.diagnostics.warn('artwork-image-missing', 'Hub artwork image failed; neutral placeholder retains exact target', {
            slotId: view.slot.id,
            artworkId: view.slot.artworkId,
            bundleId: fallback.bundleId,
            declaredImageUrl: redactArtworkImageUrlForLog(primary.declaredUrl),
            fallbackImageUrl: redactArtworkImageUrlForLog(fallback.resolvedUrl),
            declaredImageUrlType: primary.declaredUrlType,
            fallbackImageUrlType: fallback.resolvedUrlType,
            fallbackReason: fallbackFailure,
            attemptedSources: [
              {
                sourceMode: primary.mode,
                url: redactArtworkImageUrlForLog(primary.resolvedUrl),
                urlType: primary.resolvedUrlType,
              },
              {
                sourceMode: fallback.mode,
                url: redactArtworkImageUrlForLog(fallback.resolvedUrl),
                urlType: fallback.resolvedUrlType,
              },
            ],
            visibleProbe: fallbackUpsertFailure?.visibleProbe ?? null,
          });
          this.recordHubFailedSourceToPixelOutcome(view, {
            bundleId: fallback.bundleId,
            candidateMode: fallback.mode,
            resolvedUrlType: fallback.resolvedUrlType,
            usedEmbeddedFallback: true,
            attemptedEmbeddedFallback: true,
            startedAt,
            stage: fallbackResolution.stage,
            failureReason: fallbackFailure,
            upsert: fallbackUpsertFailure,
          });
          return;
        }
        const fallbackFailure = `${fallback.mode}:${fallbackResult.reason}`;
        this.setSlotImageState(view, 'missing', null, fallbackFailure);
        this.diagnostics.warn('artwork-image-missing', 'Hub artwork image failed; neutral placeholder retains exact target', {
          slotId: view.slot.id,
          artworkId: view.slot.artworkId,
          bundleId: fallback.bundleId,
          declaredImageUrl: redactArtworkImageUrlForLog(primary.declaredUrl),
          fallbackImageUrl: redactArtworkImageUrlForLog(fallback.resolvedUrl),
          declaredImageUrlType: primary.declaredUrlType,
          fallbackImageUrlType: fallback.resolvedUrlType,
          fallbackReason: fallbackFailure,
          attemptedSources: [
            {
              sourceMode: primary.mode,
              url: redactArtworkImageUrlForLog(primary.resolvedUrl),
              urlType: primary.resolvedUrlType,
            },
            {
              sourceMode: fallback.mode,
              url: redactArtworkImageUrlForLog(fallback.resolvedUrl),
              urlType: fallback.resolvedUrlType,
            },
          ],
        });
        this.recordHubFailedSourceToPixelOutcome(view, {
          bundleId: fallback.bundleId,
          candidateMode: fallback.mode,
          resolvedUrlType: fallback.resolvedUrlType,
          usedEmbeddedFallback: false,
          attemptedEmbeddedFallback: true,
          startedAt,
          stage: this.slotAttemptFailureStage(fallbackResult.reason),
          failureReason: fallbackFailure,
          upsert: null,
        });
        return;
      }
      this.setSlotImageState(view, 'missing', null, primaryFailure);
      this.diagnostics.warn('artwork-image-missing', 'Hub artwork image failed; neutral placeholder retains exact target', {
        slotId: view.slot.id,
        artworkId: view.slot.artworkId,
        bundleId: primary.bundleId,
        declaredImageUrl: redactArtworkImageUrlForLog(primary.declaredUrl),
        fallbackImageUrl: fallback ? redactArtworkImageUrlForLog(fallback.resolvedUrl) : null,
        declaredImageUrlType: primary.declaredUrlType,
        fallbackImageUrlType: fallback?.resolvedUrlType ?? null,
        fallbackReason: primaryFailure,
        attemptedSources: [
          {
            sourceMode: primary.mode,
            url: redactArtworkImageUrlForLog(primary.resolvedUrl),
            urlType: primary.resolvedUrlType,
          },
          ...(shouldRetryAfterPrimaryPostUploadFailure && fallback
            ? [
                {
                  sourceMode: fallback.mode,
                  url: redactArtworkImageUrlForLog(fallback.resolvedUrl),
                  urlType: fallback.resolvedUrlType,
                },
              ]
            : []),
        ],
        visibleProbe: primaryUpsertFailure?.visibleProbe ?? null,
      });
      this.recordHubFailedSourceToPixelOutcome(view, {
        bundleId: primary.bundleId,
        candidateMode: primary.mode,
        resolvedUrlType: primary.resolvedUrlType,
        usedEmbeddedFallback: primaryUsesEmbeddedFallback,
        attemptedEmbeddedFallback: primaryUsesEmbeddedFallback,
        startedAt,
        stage: primaryResolution.stage,
        failureReason: primaryFailure,
        upsert: primaryUpsertFailure,
      });
      return;
    }

    const primaryFailure = `${primary.mode}:${primaryResult.reason}`;
    if (fallback) {
      this.diagnostics.warn('artwork-image-retry', 'Hub artwork source failed; retrying embedded fallback', {
        slotId: view.slot.id,
        artworkId: view.slot.artworkId,
        bundleId: fallback.bundleId,
        declaredImageUrl: redactArtworkImageUrlForLog(primary.declaredUrl),
        fallbackImageUrl: redactArtworkImageUrlForLog(fallback.resolvedUrl),
        declaredImageUrlType: primary.declaredUrlType,
        fallbackImageUrlType: fallback.resolvedUrlType,
        fallbackReason: primaryFailure,
      });
      const fallbackResult = await this.loadSlotImageCandidate(view, fallback);
      if (fallbackResult.status === 'ready') {
        const fallbackResolution = this.applyResolvedSlotSource(
          view,
          fallback,
          primaryFailure,
          'fallback-loaded',
          fallbackResult
        );
        if (fallbackResolution.status === 'ready') {
          this.recordHubSourceToPixelOutcome(view, {
            bundleId: fallback.bundleId,
            candidateMode: fallback.mode,
            resolvedUrlType: fallback.resolvedUrlType,
            usedEmbeddedFallback: true,
            attemptedEmbeddedFallback: true,
            startedAt,
          });
          return;
        }
        const fallbackFailure = `${fallback.mode}:${fallbackResolution.stage}:${fallbackResolution.reason}`;
        const fallbackUpsertFailure = view.lastUpsertResult;
        this.setSlotImageState(view, 'missing', null, fallbackFailure);
        this.diagnostics.warn('artwork-image-missing', 'Hub artwork image failed; neutral placeholder retains exact target', {
          slotId: view.slot.id,
          artworkId: view.slot.artworkId,
          bundleId: fallback.bundleId,
          declaredImageUrl: redactArtworkImageUrlForLog(primary.declaredUrl),
          fallbackImageUrl: redactArtworkImageUrlForLog(fallback.resolvedUrl),
          declaredImageUrlType: primary.declaredUrlType,
          fallbackImageUrlType: fallback.resolvedUrlType,
          fallbackReason: fallbackFailure,
          attemptedSources: [
            {
              sourceMode: primary.mode,
              url: redactArtworkImageUrlForLog(primary.resolvedUrl),
              urlType: primary.resolvedUrlType,
            },
            {
              sourceMode: fallback.mode,
              url: redactArtworkImageUrlForLog(fallback.resolvedUrl),
              urlType: fallback.resolvedUrlType,
            },
          ],
          visibleProbe: fallbackUpsertFailure?.visibleProbe ?? null,
        });
        this.recordHubFailedSourceToPixelOutcome(view, {
          bundleId: fallback.bundleId,
          candidateMode: fallback.mode,
          resolvedUrlType: fallback.resolvedUrlType,
          usedEmbeddedFallback: true,
          attemptedEmbeddedFallback: true,
          startedAt,
          stage: fallbackResolution.stage,
          failureReason: fallbackFailure,
          upsert: fallbackUpsertFailure,
        });
        return;
      }
      const fallbackFailure = `${fallback.mode}:${fallbackResult.reason}`;
      this.setSlotImageState(view, 'missing', null, fallbackFailure);
      this.diagnostics.warn('artwork-image-missing', 'Hub artwork image failed; neutral placeholder retains exact target', {
        slotId: view.slot.id,
        artworkId: view.slot.artworkId,
        bundleId: fallback.bundleId,
        declaredImageUrl: redactArtworkImageUrlForLog(primary.declaredUrl),
        fallbackImageUrl: redactArtworkImageUrlForLog(fallback.resolvedUrl),
        declaredImageUrlType: primary.declaredUrlType,
        fallbackImageUrlType: fallback.resolvedUrlType,
        fallbackReason: fallbackFailure,
        attemptedSources: [
          {
            sourceMode: primary.mode,
            url: redactArtworkImageUrlForLog(primary.resolvedUrl),
            urlType: primary.resolvedUrlType,
          },
          {
            sourceMode: fallback.mode,
            url: redactArtworkImageUrlForLog(fallback.resolvedUrl),
            urlType: fallback.resolvedUrlType,
          },
        ],
      });
      this.recordHubFailedSourceToPixelOutcome(view, {
        bundleId: fallback.bundleId,
        candidateMode: fallback.mode,
        resolvedUrlType: fallback.resolvedUrlType,
        usedEmbeddedFallback: false,
        attemptedEmbeddedFallback: true,
        startedAt,
        stage: this.slotAttemptFailureStage(fallbackResult.reason),
        failureReason: fallbackFailure,
        upsert: null,
      });
      return;
    }

    this.setSlotImageState(view, 'missing', null, primaryFailure);
    this.diagnostics.warn('artwork-image-missing', 'Hub artwork image failed; neutral placeholder retains exact target', {
      slotId: view.slot.id,
      artworkId: view.slot.artworkId,
      bundleId: primary.bundleId,
      declaredImageUrl: redactArtworkImageUrlForLog(primary.declaredUrl),
      fallbackImageUrl: null,
      declaredImageUrlType: primary.declaredUrlType,
      fallbackImageUrlType: null,
      fallbackReason: primaryFailure,
      attemptedSources: [
        {
          sourceMode: primary.mode,
          url: redactArtworkImageUrlForLog(primary.resolvedUrl),
          urlType: primary.resolvedUrlType,
        },
      ],
    });
    this.recordHubFailedSourceToPixelOutcome(view, {
      bundleId: primary.bundleId,
      candidateMode: primary.mode,
      resolvedUrlType: primary.resolvedUrlType,
      usedEmbeddedFallback: primaryUsesEmbeddedFallback,
      attemptedEmbeddedFallback: primaryUsesEmbeddedFallback,
      startedAt,
      stage: this.slotAttemptFailureStage(primaryResult.reason),
      failureReason: primaryFailure,
      upsert: null,
    });
  }

  /**
   * v0.92: folds the most recent GPU-upload/visible-pixel proof recorded by
   * `HubRoomRenderer.upsertSlot` (via `syncSlotRenderer`) into the shared
   * source-to-pixel outcome for a successfully resolved hub artwork.
   */
  private recordHubSourceToPixelOutcome(
    view: SlotView,
    options: {
      bundleId: string | null;
      candidateMode: ArtworkImageSourceCandidate['mode'];
      resolvedUrlType: ArtworkImageSourceCandidate['resolvedUrlType'];
      usedEmbeddedFallback: boolean;
      attemptedEmbeddedFallback: boolean;
      startedAt: number;
    }
  ): void {
    if (!view.slot.artworkId) return;
    const upsert = view.lastUpsertResult;
    recordSourceToPixelOutcome(this.diagnostics, {
      route: 'hub',
      artworkId: view.slot.artworkId,
      bundleId: options.bundleId,
      runtimeProtocol: getRuntimeProtocol(),
      candidateMode: options.candidateMode,
      resolvedUrlType: options.resolvedUrlType,
      usedEmbeddedFallback: options.usedEmbeddedFallback,
      attemptedEmbeddedFallback: options.attemptedEmbeddedFallback,
      result: 'success',
      firstFailedStage: null,
      failureReason: null,
      elapsedMs: Math.round(this.now() - options.startedAt),
      sourceWidth: upsert?.fit?.sourceWidth ?? null,
      sourceHeight: upsert?.fit?.sourceHeight ?? null,
      uploadWidth: upsert?.fit?.targetWidth ?? null,
      uploadHeight: upsert?.fit?.targetHeight ?? null,
      downscaleApplied: upsert?.fit?.needsDownscale ?? false,
      rendererMaxTextureSize: this.hubRoomRenderer?.getMaxTextureSize() ?? null,
      visibleProbe: upsert?.visibleProbe ?? null,
    });
  }

  private recordHubFailedSourceToPixelOutcome(
    view: SlotView,
    options: {
      bundleId: string | null;
      candidateMode: ArtworkImageSourceCandidate['mode'] | null;
      resolvedUrlType: ArtworkImageSourceCandidate['resolvedUrlType'] | null;
      usedEmbeddedFallback: boolean;
      attemptedEmbeddedFallback: boolean;
      startedAt: number;
      stage: 'candidate-selected' | 'request' | 'decode' | 'gpu-upload' | 'visible-pixel-probe';
      failureReason: string;
      upsert: SlotUpsertResult | null;
    }
  ): void {
    if (!view.slot.artworkId) return;
    recordSourceToPixelOutcome(this.diagnostics, {
      route: 'hub',
      artworkId: view.slot.artworkId,
      bundleId: options.bundleId,
      runtimeProtocol: getRuntimeProtocol(),
      candidateMode: options.candidateMode,
      resolvedUrlType: options.resolvedUrlType,
      usedEmbeddedFallback: options.usedEmbeddedFallback,
      attemptedEmbeddedFallback: options.attemptedEmbeddedFallback,
      result: 'failed',
      firstFailedStage: options.stage,
      failureReason: options.failureReason,
      elapsedMs: Math.round(this.now() - options.startedAt),
      sourceWidth: options.upsert?.fit?.sourceWidth ?? null,
      sourceHeight: options.upsert?.fit?.sourceHeight ?? null,
      uploadWidth: options.upsert?.fit?.targetWidth ?? null,
      uploadHeight: options.upsert?.fit?.targetHeight ?? null,
      downscaleApplied: options.upsert?.fit?.needsDownscale ?? false,
      rendererMaxTextureSize: this.hubRoomRenderer?.getMaxTextureSize() ?? null,
      visibleProbe: options.upsert?.visibleProbe ?? null,
    });
  }

  private applyResolvedSlotSource(
    view: SlotView,
    source: ArtworkImageSourceCandidate,
    fallbackReason: string | null,
    requestStatus: 'loaded' | 'fallback-loaded',
    dimensions: { width: number; height: number }
  ): { status: 'ready' } | { status: 'failed'; stage: 'gpu-upload' | 'visible-pixel-probe'; reason: string } {
    this.setSlotImageState(view, 'ready', source, fallbackReason);
    const renderFailure = this.getSlotRenderFailure(view);
    if (renderFailure) return { status: 'failed', ...renderFailure };
    this.diagnostics.info('artwork-source-resolved', 'Hub artwork source resolved', {
      slotId: view.slot.id,
      artworkId: view.slot.artworkId,
      bundleId: source.bundleId,
      sourceMode: source.mode,
      declaredImageUrl: redactArtworkImageUrlForLog(source.declaredUrl),
      resolvedImageUrl: redactArtworkImageUrlForLog(source.resolvedUrl),
      declaredImageUrlType: source.declaredUrlType,
      resolvedImageUrlType: source.resolvedUrlType,
      requestStatus,
      decodeStatus: 'decoded',
      textureWidth: dimensions.width,
      textureHeight: dimensions.height,
      fallbackReason,
    });
    return { status: 'ready' };
  }

  private getSlotRenderFailure(
    view: SlotView
  ): { stage: 'gpu-upload' | 'visible-pixel-probe'; reason: string } | null {
    const failureStage = view.lastUpsertResult?.failureStage;
    if (!failureStage) return null;
    return {
      stage: failureStage,
      reason: view.lastUpsertResult?.failureReason ?? 'unknown-failure',
    };
  }

  private slotAttemptFailureStage(
    reason: SlotImageAttemptFailureReason
  ): 'candidate-selected' | 'request' | 'decode' {
    if (reason === 'decode-error' || reason === 'decode-timeout') return 'decode';
    if (reason === 'no-source') return 'candidate-selected';
    return 'request';
  }

  private now(): number {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
  }

  private setSlotImageState(
    view: SlotView,
    imageState: SlotView['imageState'],
    resolvedSource: ArtworkImageSourceCandidate | null,
    fallbackReason: string | null
  ): void {
    view.imageState = imageState;
    view.resolvedSource = resolvedSource;
    view.fallbackReason = fallbackReason;
    view.button.classList.toggle('has-missing-image', imageState === 'missing');
    view.button.dataset['artworkSourceState'] = imageState;
    if (resolvedSource) {
      view.button.dataset['artworkSourceMode'] = resolvedSource.mode;
      view.button.dataset['artworkUrlType'] = resolvedSource.resolvedUrlType;
    } else {
      delete view.button.dataset['artworkSourceMode'];
      delete view.button.dataset['artworkUrlType'];
    }
    if (fallbackReason) {
      view.button.dataset['artworkFallbackReason'] = fallbackReason;
    } else {
      delete view.button.dataset['artworkFallbackReason'];
    }
    this.syncSlotRenderer(view);
  }

  private async loadSlotImageCandidate(
    view: SlotView,
    source: ArtworkImageSourceCandidate
  ): Promise<SlotImageAttemptResult> {
    if (!view.image) return { status: 'failed', reason: 'no-source' };
    const token = ++view.imageLoadToken;
    const image = view.image;
    const timeoutMs = source.resolvedUrlType === 'data-uri' ? HUB_INLINE_IMAGE_TIMEOUT_MS : HUB_IMAGE_TIMEOUT_MS;
    const loadStatus = await new Promise<'loaded' | 'error' | 'timeout'>((resolve) => {
      let settled = false;
      const complete = (status: 'loaded' | 'error' | 'timeout'): void => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        image.removeEventListener('load', handleLoad);
        image.removeEventListener('error', handleError);
        resolve(status);
      };
      const handleLoad = (): void => complete('loaded');
      const handleError = (): void => complete('error');
      const timeout = window.setTimeout(() => complete('timeout'), timeoutMs);
      image.addEventListener('load', handleLoad);
      image.addEventListener('error', handleError);
      image.src = source.resolvedUrl;
      if (image.complete && image.naturalWidth > 0) complete('loaded');
    });
    if (token !== view.imageLoadToken) return { status: 'failed', reason: 'load-timeout' };
    if (loadStatus === 'error') return { status: 'failed', reason: 'load-error' };
    if (loadStatus === 'timeout') return { status: 'failed', reason: 'load-timeout' };
    if (image.naturalWidth <= 0 || image.naturalHeight <= 0) {
      return { status: 'failed', reason: 'load-error' };
    }
    const decodeStatus = await this.decodeSlotImage(image, timeoutMs);
    if (decodeStatus !== 'decoded') {
      return {
        status: 'failed',
        reason: decodeStatus === 'timeout' ? 'decode-timeout' : 'decode-error',
      };
    }
    return {
      status: 'ready',
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
  }

  private async decodeSlotImage(
    image: HTMLImageElement,
    timeoutMs = HUB_IMAGE_TIMEOUT_MS
  ): Promise<'decoded' | 'error' | 'timeout'> {
    if (typeof image.decode !== 'function') return 'decoded';
    return new Promise((resolve) => {
      let settled = false;
      const complete = (status: 'decoded' | 'error' | 'timeout'): void => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        resolve(status);
      };
      const timeout = window.setTimeout(() => complete('timeout'), timeoutMs);
      image.decode().then(
        () => complete('decoded'),
        () => complete('error')
      );
    });
  }

  private handleSlotClick(slot: ResolvedHubSlot): void {
    if (this.entryButton.disabled) return;
    this.setButtonsDisabled(true);
    this.lastActivatedSlotId = slot.id;
    this.setSelectedArtworkId(slot.artworkId, { alignPage: false, source: 'slot-click' });
    this.status.textContent = 'Ausstellung wird geöffnet.';
    this.selectSlotCallback?.(slot);
  }

  // ── View navigation ───────────────────────────────────────────────────────
  // Narrow portrait mode splits every page into three wall-focus views:
  // front (0) → left (1) → right (2).

  private static readonly NARROW_VIEWS_PER_PAGE = 3;
  private static readonly NARROW_WALL_ORDER: readonly ('front' | 'left' | 'right')[] = ['front', 'left', 'right'];

  private get viewCount(): number {
    return this.narrowMode ? this.pageCount * MainMuseumHub.NARROW_VIEWS_PER_PAGE : this.pageCount;
  }

  private stepView(direction: -1 | 1): void {
    const next = this.viewIndex + direction;
    if (next < 0 || next >= this.viewCount) return;
    this.viewIndex = next;
    this.applyView();
  }

  private goToPage(pageIndex: number, slot?: ResolvedHubSlot): void {
    if (this.narrowMode) {
      const wall = Math.max(0, MainMuseumHub.NARROW_WALL_ORDER.indexOf(
        (slot?.wallGroup ?? 'front') as 'front' | 'left' | 'right'
      ));
      this.viewIndex = pageIndex * MainMuseumHub.NARROW_VIEWS_PER_PAGE + wall;
    } else {
      this.viewIndex = pageIndex;
    }
    this.applyView();
  }

  private applyView(initial = false): void {
    if (this.disposed) return;
    this.viewIndex = Math.max(0, Math.min(this.viewCount - 1, this.viewIndex));
    const pageIndex = this.narrowMode
      ? Math.floor(this.viewIndex / MainMuseumHub.NARROW_VIEWS_PER_PAGE)
      : this.viewIndex;
    const wallFocus = this.narrowMode
      ? MainMuseumHub.NARROW_WALL_ORDER[this.viewIndex % MainMuseumHub.NARROW_VIEWS_PER_PAGE]!
      : 'full';
    this.hubRoomRenderer?.setActivePage(pageIndex);

    for (const room of this.roomLayers) {
      const roomPage = Number.parseInt(room.dataset['page'] ?? '0', 10);
      room.classList.toggle('is-active', roomPage === pageIndex);
    }
    this.element.dataset['wallFocus'] = wallFocus;
    if (wallFocus === 'full') {
      this.visual.style.setProperty('--hub-focus-scale', '1');
      this.visual.style.setProperty('--hub-focus-x', '0%');
    } else if (wallFocus === 'front') {
      this.visual.style.setProperty('--hub-focus-scale', '1.45');
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
      const wallLabel = wallFocus === 'front' ? 'Frontwand' : wallFocus === 'left' ? 'Linke Wand' : 'Rechte Wand';
      this.pagerCounter.textContent = this.narrowMode
        ? `Raum ${pageIndex + 1}/${this.pageCount} · ${wallLabel}`
        : `Raum ${pageIndex + 1} / ${this.pageCount}`;
    }
    this.applySelectionState(initial ? 'initial-view' : 'view-change');
    if (!initial) void this.decodePageImages(pageIndex);
  }

  private handleNarrowChange = (): void => {
    const wasNarrow = this.narrowMode;
    this.narrowMode = this.narrowQuery.matches;
    if (wasNarrow !== this.narrowMode) {
      const pageIndex = wasNarrow
        ? Math.floor(this.viewIndex / MainMuseumHub.NARROW_VIEWS_PER_PAGE)
        : this.viewIndex;
      this.viewIndex = this.narrowMode ? pageIndex * MainMuseumHub.NARROW_VIEWS_PER_PAGE : pageIndex;
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
      if (this.debugGeometry) this.emitDebugGeometrySnapshot('resize');
    });
  };

  private updateStageScale(): void {
    const rect = this.visual.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const scale = Math.min(rect.width / this.stageWidth, rect.height / this.stageHeight);
    this.element.style.setProperty('--hub-stage-scale', String(scale));
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (this.calibrating) {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      const slot = this.activeCalibrationSlot;
      const wall = slot ? this.resolution.wallById.get(slot.placement.wallId) : null;
      if (!slot || !wall) return;
      this.recordCalibrationHistory();
      const step = event.shiftKey ? 0.01 : 0.002;
      const current = slot.placement.center;
      const next = point(
        current.x + (event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0),
        current.y + (event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0)
      );
      this.setSlotCenterClampedToMountingZone(slot, wall, next);
      this.applyAllSlotGeometry();
      this.renderCalibrationOverlay();
      this.updateCalibrationOutput(true);
      this.syncCalibrationControls();
      event.preventDefault();
      return;
    }
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

    const heading = document.createElement('h2');
    heading.className = 'museum-hub__calibration-title';
    heading.textContent = 'Artwork Placement Editor';
    const intro = document.createElement('p');
    intro.className = 'museum-hub__calibration-intro';
    intro.textContent = 'Platzieren Sie Ihre Kunstwerke direkt im Museum.';
    const steps = document.createElement('ol');
    steps.className = 'museum-hub__calibration-steps';
    for (const text of [
      'Wand und Kunstwerk auswählen.',
      'Bild ziehen; roten Eckgriff zum Skalieren ziehen.',
      'Grüne Wandfläche prüfen und bestätigen.',
      'Wenn alle Prüfungen grün sind: Konfiguration herunterladen.',
    ]) {
      const item = document.createElement('li');
      item.textContent = text;
      steps.appendChild(item);
    }
    const instructions = document.createElement('p');
    instructions.className = 'museum-hub__calibration-help';
    instructions.textContent =
      'Tipp: Pfeiltasten verschieben fein, Umschalt + Pfeiltaste verschiebt schneller. Rot bedeutet: Position noch ungültig.';

    const controls = document.createElement('div');
    controls.className = 'museum-hub__calibration-controls';

    const selectLabel = document.createElement('label');
    selectLabel.className = 'museum-hub__calibration-label';
    selectLabel.textContent = '1. Wand auswählen';
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

    const slotLabel = document.createElement('label');
    slotLabel.className = 'museum-hub__calibration-label';
    slotLabel.textContent = '2. Kunstwerk auswählen';
    const slotSelect = document.createElement('select');
    slotSelect.className = 'museum-hub__calibration-select';
    for (const { slot } of this.slotViews) {
      if (!slot.artworkId) continue;
      const option = document.createElement('option');
      option.value = slot.id;
      option.textContent = `${slot.displayLabel} · ${slot.placement.wallId}`;
      slotSelect.appendChild(option);
    }
    this.activeCalibrationSlotId = slotSelect.value || null;
    slotSelect.addEventListener('change', () => this.selectCalibrationSlot(slotSelect.value));
    slotLabel.appendChild(slotSelect);

    const numericGrid = document.createElement('div');
    numericGrid.className = 'museum-hub__calibration-numeric-grid';
    const numericFields: readonly [string, string, number, number, number][] = [
      ['horizontalPosition', 'Position links/rechts', 0, 1, 0.001],
      ['centerHeight', 'Höhe der Bildmitte (m)', 0, 8, 0.01],
      ['physicalHeight', 'Bildgröße/Höhe (m)', 0.04, 8, 0.01],
      ['mountingGap', 'Abstand zur Wand (m)', 0.001, 0.03, 0.001],
    ];
    for (const [field, labelText, min, max, step] of numericFields) {
      const label = document.createElement('label');
      label.className = 'museum-hub__calibration-number';
      label.textContent = labelText;
      const input = document.createElement('input');
      input.type = 'number';
      input.min = String(min);
      input.max = String(max);
      input.step = String(step);
      input.addEventListener('change', () => this.applyCalibrationNumber(field, input.valueAsNumber));
      label.appendChild(input);
      numericGrid.appendChild(label);
      this.calibrationFields.set(field, input);
    }

    const actionRow = document.createElement('div');
    actionRow.className = 'museum-hub__calibration-actions';
    const makeAction = (
      text: string,
      action: () => void,
      container: HTMLElement = actionRow
    ): HTMLButtonElement => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'museum-hub__calibration-action';
      button.textContent = text;
      button.addEventListener('click', action);
      container.appendChild(button);
      return button;
    };
    const centerButton = makeAction('Zwischen Grenzen zentrieren', () => this.centerActiveSlotInMountingZone());
    centerButton.title = 'Zentriert den vollständigen Bildkörper im gültigen Wandpolygon.';
    makeAction('Grüne Wandfläche bestätigen', () => this.confirmActiveMountingZone());
    this.calibrationUndoButton = makeAction('Rückgängig', () => this.undoCalibration());
    this.calibrationRedoButton = makeAction('Wiederholen', () => this.redoCalibration());
    makeAction('Ausgangszustand', () => this.resetCalibration());

    const restoreButton = document.createElement('button');
    restoreButton.type = 'button';
    restoreButton.className = 'museum-hub__calibration-restore';
    restoreButton.textContent = 'Letzte gültige Konfiguration wiederherstellen';
    restoreButton.disabled = true;
    restoreButton.addEventListener('click', () => this.restoreLastValidCalibrationSnapshot());

    controls.append(selectLabel, slotLabel, numericGrid, actionRow, restoreButton);

    const warningTitle = document.createElement('p');
    warningTitle.className = 'museum-hub__calibration-label';
    warningTitle.textContent = '3. Automatische Prüfung';
    const warningList = document.createElement('ul');
    warningList.className = 'museum-hub__calibration-warnings';

    const output = document.createElement('textarea');
    output.className = 'museum-hub__calibration-output';
    output.readOnly = true;
    output.rows = 16;
    output.setAttribute('aria-label', 'Museum-Hub-Konfiguration als JSON');

    const exportRow = document.createElement('div');
    exportRow.className = 'museum-hub__calibration-actions';
    this.calibrationCopyButton = makeAction(
      'JSON kopieren',
      () => void this.copyCalibrationJson(),
      exportRow
    );
    this.calibrationDownloadButton = makeAction(
      '4. Konfiguration herunterladen',
      () => this.downloadCalibrationJson(),
      exportRow
    );
    const actionStatus = document.createElement('p');
    actionStatus.className = 'museum-hub__calibration-action-status';
    actionStatus.setAttribute('role', 'status');
    actionStatus.setAttribute('aria-live', 'polite');

    const importLabel = document.createElement('label');
    importLabel.className = 'museum-hub__calibration-import';
    importLabel.textContent = 'Vorhandene Konfiguration öffnen';
    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = 'application/json,.json';
    importInput.addEventListener('change', () => void this.importCalibrationFile(importInput.files?.[0] ?? null));
    importLabel.appendChild(importInput);

    const advanced = document.createElement('details');
    advanced.className = 'museum-hub__calibration-advanced';
    const advancedSummary = document.createElement('summary');
    advancedSummary.textContent = 'Technische JSON-Ansicht';
    advanced.append(advancedSummary, output);

    panel.append(
      heading,
      intro,
      steps,
      instructions,
      controls,
      warningTitle,
      warningList,
      exportRow,
      actionStatus,
      importLabel,
      advanced
    );
    hub.appendChild(panel);
    this.calibrationOutput = output;
    this.calibrationWarnings = warningList;
    this.calibrationActionStatus = actionStatus;
    this.calibrationRestoreButton = restoreButton;
    this.calibrationWallSelect = select;
    this.calibrationSlotSelect = slotSelect;
    this.initialCalibrationSnapshot = JSON.stringify(this.buildCurrentCalibrationConfig(), null, 2);
    if (this.activeCalibrationSlotId) this.selectCalibrationSlot(this.activeCalibrationSlotId);
    else this.syncCalibrationControls();
  }

  private startSlotCalibrationDrag(
    event: PointerEvent,
    slot: ResolvedHubSlot,
    button: HTMLButtonElement,
    mode: 'move' | 'resize'
  ): void {
    event.preventDefault();
    this.selectCalibrationSlot(slot.id);
    this.recordCalibrationHistory();
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
    target: 'quad' | 'safe' | 'mounting-zone',
    index: number
  ): void {
    event.preventDefault();
    this.recordCalibrationHistory();
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
        this.setSlotCenterClampedToMountingZone(
          drag.slot,
          wall,
          point(this.clampLocalX(local.x), this.clampLocalY(local.y))
        );
      } else {
        const localHeight = Math.abs(local.y - drag.slot.placement.center.y) * 2;
        drag.slot.placement.mountedHeight = wall.room
          ? Math.max(0.12, Math.min(wall.room.height, localHeight * wall.room.height))
          : Math.max(0.04, Math.min(0.9, localHeight));
        drag.slot.placement.physicalHeight = drag.slot.placement.mountedHeight;
      }
      this.applySlotGeometry(drag.button, drag.slot);
    } else {
      const wall = this.resolution.wallById.get(drag.wallId);
      if (!wall) return;
      const targetPoints =
        drag.target === 'quad'
          ? wall.quad
          : drag.target === 'safe'
            ? wall.safePolygon
            : wall.mountingZone;
      const targetPoint = targetPoints[drag.index];
      if (!targetPoint) return;
      targetPoint.x = stagePoint.x;
      targetPoint.y = stagePoint.y;
      if (drag.target === 'mounting-zone' || drag.target === 'quad') {
        wall.mountingZoneConfirmed = false;
      }
      this.applyAllSlotGeometry();
    }
    this.renderCalibrationOverlay();
    this.updateCalibrationOutput(false);
    this.syncCalibrationControls();
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
      const active = this.calibrating ? wall.id === activeWallId : true;
      const wallPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      wallPolygon.setAttribute('points', this.pointsToSvg(wall.quad));
      wallPolygon.setAttribute('class', `museum-hub__calibration-wall${active ? ' is-active' : ''}`);
      this.calibrationSvg.appendChild(wallPolygon);

      const safePolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      safePolygon.setAttribute('points', this.pointsToSvg(wall.safePolygon));
      safePolygon.setAttribute('class', `museum-hub__calibration-safe${active ? ' is-active' : ''}`);
      this.calibrationSvg.appendChild(safePolygon);

      const mountingZone = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      mountingZone.setAttribute('points', this.pointsToSvg(wall.mountingZone));
      mountingZone.setAttribute(
        'class',
        `museum-hub__calibration-mounting-zone${active ? ' is-active' : ''}${
          wall.mountingZoneConfirmed ? ' is-confirmed' : ' is-unconfirmed'
        }`
      );
      this.calibrationSvg.appendChild(mountingZone);

      if (this.debugGeometry) {
        this.renderProjectedDoorwayDebugOverlay(wall);
        this.renderWallDebugAxes(wall);
      }
      if (!this.calibrating || !active) continue;
      wall.quad.forEach((corner, index) => this.calibrationSvg!.appendChild(this.createCalibrationHandle(wall.id, 'quad', index, corner, 'museum-hub__calibration-handle')));
      wall.safePolygon.forEach((corner, index) => this.calibrationSvg!.appendChild(this.createCalibrationHandle(wall.id, 'safe', index, corner, 'museum-hub__calibration-handle museum-hub__calibration-handle--safe')));
      wall.mountingZone.forEach((corner, index) =>
        this.calibrationSvg!.appendChild(
          this.createCalibrationHandle(
            wall.id,
            'mounting-zone',
            index,
            corner,
            'museum-hub__calibration-handle museum-hub__calibration-handle--mounting-zone'
          )
        )
      );
    }
    if (this.debugGeometry) {
      this.renderCameraDebugGuides();
      this.renderProjectedSlotDebugOverlay();
    }
  }

  private createCalibrationHandle(
    wallId: string,
    target: 'quad' | 'safe' | 'mounting-zone',
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

  private renderWallDebugAxes(wall: ResolvedHubWall): void {
    if (!this.calibrationSvg || !wall.homography) return;
    const origin = applyHomography(wall.homography, 0.1, 0.1);
    const axisX = applyHomography(wall.homography, 0.28, 0.1);
    const axisY = applyHomography(wall.homography, 0.1, 0.28);
    if (!origin || !axisX || !axisY) return;

    this.appendSvgLine(origin, axisX, 'museum-hub__debug-axis museum-hub__debug-axis--x');
    this.appendSvgLine(origin, axisY, 'museum-hub__debug-axis museum-hub__debug-axis--y');
    this.appendSvgCircle(origin, 'museum-hub__debug-origin', 3.8);
    const realism = wall.projectionRealism;
    const wallLabel = realism
      ? `${wall.id} · ref ${realism.referenceResidualMaxPx.toFixed(1)}px · ${realism.projectedConvergence}`
      : wall.id;
    this.appendSvgLabel(point(origin.x + 8, origin.y - 8), wallLabel, 'museum-hub__debug-wall-label');
  }

  private renderProjectedDoorwayDebugOverlay(wall: ResolvedHubWall): void {
    if (!this.calibrationSvg || !wall.room || !wall.camera) return;
    for (const doorway of projectRoomDoorwayPolygons(wall.room, wall.camera, this.resolution.stage)) {
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', this.pointsToSvg(doorway));
      polygon.setAttribute('class', 'museum-hub__debug-doorway');
      this.calibrationSvg.appendChild(polygon);
    }
  }

  private renderProjectedSlotDebugOverlay(): void {
    if (!this.calibrationSvg) return;
    for (const { slot } of this.slotViews) {
      if (!slot.selectable || !slot.artworkId) continue;
      const wall = this.resolution.wallById.get(slot.placement.wallId);
      const projection = this.projectedSlotGeometry.get(slot.id);
      if (!wall || !projection || !wall.homography) continue;
      const centerStage = applyHomography(wall.homography, slot.placement.center.x, slot.placement.center.y);
      this.calibrationSvg.appendChild(this.createProjectedQuadElement(projection.projectedQuad));
      if (centerStage) {
        this.appendSvgCircle(centerStage, 'museum-hub__debug-slot-center', 3.2);
      }

      projection.projectedQuad.forEach((corner) => this.appendSvgCircle(corner, 'museum-hub__debug-slot-corner', 2.8));
      const labelAnchor = projection.projectedQuad[0];
      if (labelAnchor) {
        const localAnchor = slot.placement.anchor
          ? `L ${slot.placement.anchor.x.toFixed(2)},${slot.placement.anchor.y.toFixed(2)}`
          : `L ${slot.placement.center.x.toFixed(2)},${slot.placement.center.y.toFixed(2)}`;
        const stageAnchor = centerStage
          ? `S ${centerStage.x.toFixed(0)},${centerStage.y.toFixed(0)}`
          : 'S –';
        const projectedAnchor = projection.projectedAnchor
          ? `P ${projection.projectedAnchor.x.toFixed(0)},${projection.projectedAnchor.y.toFixed(0)}`
          : 'P –';
        const selectionState = slot.artworkId && slot.artworkId === this.selectedArtworkId ? 'selected' : 'idle';
        this.appendSvgLabel(
          point(labelAnchor.x + 8, labelAnchor.y - 8),
          `${slot.id} · ${slot.placement.wallId} · ${selectionState} · ${localAnchor} · ${stageAnchor} · ${projectedAnchor} · ${
            projection.validity?.contained && projection.validity.doorwayClear && projection.validity.inHangingBand
              ? 'valid'
              : 'invalid'
          }`,
          'museum-hub__debug-slot-label'
        );
      }
    }
  }

  private renderCameraDebugGuides(): void {
    const camera = this.resolution.camera;
    const horizon = projectWorldPoint(
      camera,
      { x: camera.target.x, y: camera.target.y, z: camera.target.z - 24 },
      this.resolution.stage
    );
    if (horizon) {
      this.appendSvgLine(
        point(0, horizon.y),
        point(this.stageWidth, horizon.y),
        'museum-hub__debug-horizon'
      );
      this.appendSvgLabel(point(12, Math.max(18, horizon.y - 8)), 'camera horizon', 'museum-hub__debug-camera-label');
    }
    for (const wall of this.resolution.walls) {
      if (!wall.room) continue;
      const local = point(wall.room.width / 2, wall.room.height / 2);
      const worldAt = (x: number) => ({
        x: wall.room!.origin.x + wall.room!.axisU.x * x + wall.room!.axisV.x * local.y,
        y: wall.room!.origin.y + wall.room!.axisU.y * x + wall.room!.axisV.y * local.y,
        z: wall.room!.origin.z + wall.room!.axisU.z * x + wall.room!.axisV.z * local.y,
      });
      const origin = projectWorldPoint(camera, worldAt(local.x), this.resolution.stage);
      const vanishing = projectWorldPoint(camera, worldAt(local.x + 40), this.resolution.stage);
      if (origin && vanishing) this.appendSvgLine(origin, vanishing, 'museum-hub__debug-vanishing');
    }
  }

  private createProjectedQuadElement(points: readonly Point2D[]): SVGPolygonElement {
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', this.pointsToSvg(points));
    polygon.setAttribute('class', 'museum-hub__debug-slot-quad');
    return polygon;
  }

  private appendSvgLine(start: Point2D, end: Point2D, className: string): void {
    if (!this.calibrationSvg) return;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('class', className);
    line.setAttribute('x1', start.x.toFixed(2));
    line.setAttribute('y1', start.y.toFixed(2));
    line.setAttribute('x2', end.x.toFixed(2));
    line.setAttribute('y2', end.y.toFixed(2));
    this.calibrationSvg.appendChild(line);
  }

  private appendSvgCircle(position: Point2D, className: string, radius: number): void {
    if (!this.calibrationSvg) return;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('class', className);
    circle.setAttribute('cx', position.x.toFixed(2));
    circle.setAttribute('cy', position.y.toFixed(2));
    circle.setAttribute('r', radius.toFixed(1));
    this.calibrationSvg.appendChild(circle);
  }

  private appendSvgLabel(position: Point2D, text: string, className: string): void {
    if (!this.calibrationSvg) return;
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('class', className);
    label.setAttribute('x', position.x.toFixed(2));
    label.setAttribute('y', position.y.toFixed(2));
    label.textContent = text;
    this.calibrationSvg.appendChild(label);
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
        warnings.push(`Wand ${wall.id}: Die Wandfläche ist ungültig.`);
      }
      if (wall.safePolygon.length < 3) {
        warnings.push(`Wand ${wall.id}: Der Sicherheitsbereich benötigt mindestens drei Punkte.`);
      }
      if (wall.mountingZone.length < 3) {
        warnings.push(`Wand ${wall.id}: Die grüne Wandfläche benötigt mindestens drei Punkte.`);
      } else if (
        wall.mountingZone.length !== 4
        || quadIsDegenerate(wall.mountingZone as unknown as Quad)
        || !quadIsConvex(wall.mountingZone as unknown as Quad)
      ) {
        warnings.push(`Wand ${wall.id}: Die grüne Wandfläche darf sich nicht überkreuzen.`);
      }
      if (!wall.mountingZoneConfirmed) {
        warnings.push(`Wand ${wall.id}: Grüne Wandfläche ausrichten und bestätigen.`);
      }
    }
    const visibleByPage = new Map<number, { slot: ResolvedHubSlot; quad: ProjectedArtworkGeometry }[]>();
    for (const view of this.slotViews) {
      const { slot } = view;
      if (!slot.selectable || !slot.artworkId) continue;
      const wall = this.resolution.wallById.get(slot.placement.wallId);
      if (!wall) {
        warnings.push(`Bild ${slot.id}: Zugewiesene Wand ${slot.placement.wallId} fehlt.`);
        continue;
      }
      const ownedWallId = this.calibrationWallOwnership.get(slot.id);
      if (ownedWallId && slot.placement.wallId !== ownedWallId) {
        warnings.push(`Bild ${slot.id}: Wandzuordnung wurde von ${ownedWallId} zu ${slot.placement.wallId} geändert.`);
      }
      const projection = projectSlotArtwork(wall, slot.placement, slot.artworkAspect, this.resolution.stage);
      if (!projection) {
        warnings.push(`Bild ${slot.id}: Position kann nicht berechnet werden.`);
        continue;
      }
      if (!projection.projectedQuad.every((corner) => pointInPolygon(corner, wall.mountingZone))) {
        warnings.push(`Bild ${slot.id}: Das vollständige Bild liegt außerhalb der grünen Wandfläche.`);
      }
      if (!projection.validity?.doorwayClear) {
        warnings.push(`Bild ${slot.id}: Das Bild überschneidet einen Türbereich.`);
      }
      if (projection.shortEdge < HUB_MIN_PROJECTED_SHORT_EDGE_PX) {
        warnings.push(
          `Bild ${slot.id}: Die sichtbare Kante (${projection.shortEdge.toFixed(1)} px) ist kleiner als ${HUB_MIN_PROJECTED_SHORT_EDGE_PX} px.`
        );
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
            warnings.push(`Raum ${pageIndex + 1}: ${current.slot.id} überschneidet ${next.slot.id}.`);
          }
        }
      }
    }
    return warnings;
  }

  private collectCalibrationProofs(): string[] {
    const proofs: string[] = [];
    const pointToSegmentDistance = (subject: Point2D, start: Point2D, end: Point2D): number => {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const lengthSquared = dx * dx + dy * dy;
      if (lengthSquared <= 1e-9) return Math.hypot(subject.x - start.x, subject.y - start.y);
      const t = Math.max(0, Math.min(1, ((subject.x - start.x) * dx + (subject.y - start.y) * dy) / lengthSquared));
      return Math.hypot(subject.x - (start.x + dx * t), subject.y - (start.y + dy * t));
    };
    for (const { slot } of this.slotViews) {
      if (!slot.selectable || !slot.artworkId) continue;
      const wall = this.resolution.wallById.get(slot.placement.wallId);
      const projection = wall
        ? projectSlotArtwork(wall, slot.placement, slot.artworkAspect, this.resolution.stage)
        : null;
      if (!wall?.room || !projection) continue;
      const zoneDistancePx = Math.min(
        ...projection.projectedQuad.flatMap((corner) =>
          wall.mountingZone.map((edgeStart, index) =>
            pointToSegmentDistance(corner, edgeStart, wall.mountingZone[(index + 1) % wall.mountingZone.length]!)
          )
        )
      );
      const artworkX = projection.localQuad.map((corner) => corner.x);
      const cornerClearanceM = Math.min(
        Math.min(...artworkX),
        wall.room.width - Math.max(...artworkX)
      ) / Math.max(0.001, wall.localCalibrationScale.x);
      const doorwayClearanceM = wall.room.doorwayExclusions.length === 0
        ? null
        : Math.min(...wall.room.doorwayExclusions.map((doorway) => {
          const doorwayX = doorway.map((corner) => corner.x);
          const artworkMin = Math.min(...artworkX);
          const artworkMax = Math.max(...artworkX);
          const doorwayMin = Math.min(...doorwayX);
          const doorwayMax = Math.max(...doorwayX);
          return Math.max(0, artworkMax <= doorwayMin ? doorwayMin - artworkMax : artworkMin - doorwayMax)
            / Math.max(0.001, wall.localCalibrationScale.x);
        }));
      proofs.push(
        `✓ ${slot.displayLabel}: ${wall.id}; mounting-zone ${zoneDistancePx.toFixed(1)} px; `
        + `corner ${cornerClearanceM.toFixed(2)} m`
        + (doorwayClearanceM === null ? '' : `; doorway ${doorwayClearanceM.toFixed(2)} m`)
      );
    }
    return proofs;
  }

  private buildCurrentCalibrationConfig(): unknown {
    return {
      version: 5,
      coverage: 'all-active-artworks',
      stage: this.resolution.stage,
      background: this.resolution.background,
      backgroundFallback: this.resolution.backgroundFallback,
      visualTokens: this.resolution.visualTokens,
      camera: this.resolution.camera,
      room: {
        dimensions: this.resolution.room.dimensions,
        floorY: this.resolution.room.floorY,
        ceilingY: this.resolution.room.ceilingY,
        floorOutline: this.resolution.room.floorOutline.map((corner) => ({
          x: this.round(corner.x),
          z: this.round(corner.z),
        })),
      },
      hangingRules: this.resolution.hangingRules,
      walls: this.resolution.walls.map((wall) => ({
        id: wall.id,
        group: wall.group,
        planeAspect: Math.round(wall.planeAspect * 1000) / 1000,
        quad: wall.quad.map((corner) => this.roundPoint(corner)),
        safePolygon: wall.safePolygon.map((corner) => this.roundPoint(corner)),
        mountingZone: wall.mountingZone.map((corner) => this.roundPoint(corner)),
        mountingZoneConfirmed: wall.mountingZoneConfirmed,
        ...(wall.shadowVector ? { shadowVector: this.roundPoint(wall.shadowVector) } : {}),
        ...(wall.room
          ? {
              room: {
                origin: wall.room.origin,
                axisU: wall.room.axisU,
                axisV: wall.room.axisV,
                width: wall.room.width,
                height: wall.room.height,
                safePolygon: wall.room.safePolygon.map((corner) => this.roundPoint(corner)),
                doorwayExclusions: wall.room.doorwayExclusions.map((polygon) => polygon.map((corner) => this.roundPoint(corner))),
                hangingBand: wall.room.hangingBand,
              },
            }
          : {}),
        ...(wall.transform ? { transform: wall.transform } : {}),
        ...(wall.drawableRegion ? { drawableRegion: wall.drawableRegion } : {}),
        ...(wall.exclusionPolygons ? { exclusionPolygons: wall.exclusionPolygons } : {}),
        ...(wall.hangingBand ? { hangingBand: wall.hangingBand } : {}),
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
          horizontalPosition: this.round(slot.placement.horizontalPosition ?? slot.placement.uv?.x ?? 0),
          centerHeight: this.round(slot.placement.centerHeight ?? slot.placement.anchor?.y ?? 0),
          physicalHeight: this.round(slot.placement.physicalHeight ?? slot.placement.mountedHeight),
          mountingGap: this.round(slot.placement.mountingGap ?? 0.002),
        },
      })),
    };
  }

  private get activeCalibrationSlot(): ResolvedHubSlot | null {
    return this.slotViews.find(({ slot }) => slot.id === this.activeCalibrationSlotId)?.slot ?? null;
  }

  private selectCalibrationSlot(slotId: string): void {
    const view = this.slotViews.find(({ slot }) => slot.id === slotId);
    if (!view) return;
    this.activeCalibrationSlotId = slotId;
    this.activeCalibrationWallId = view.slot.placement.wallId;
    if (this.calibrationSlotSelect) this.calibrationSlotSelect.value = slotId;
    if (this.calibrationWallSelect) this.calibrationWallSelect.value = view.slot.placement.wallId;
    for (const candidate of this.slotViews) {
      candidate.button.classList.toggle('is-calibration-selected', candidate.slot.id === slotId);
    }
    this.syncCalibrationControls();
    this.renderCalibrationOverlay();
  }

  private syncCanonicalPlacement(slot: ResolvedHubSlot, wall: ResolvedHubWall): void {
    if (!wall.room) return;
    const uv = slot.placement.uv ?? point(
      slot.placement.horizontalPosition ?? slot.placement.center.x,
      (slot.placement.centerHeight ?? wall.room.height / 2) / wall.room.height
    );
    slot.placement.uv = point(this.clampLocalX(uv.x), this.clampLocalY(uv.y));
    slot.placement.anchor = point(
      slot.placement.uv.x * wall.room.width,
      slot.placement.uv.y * wall.room.height
    );
    slot.placement.center = point(slot.placement.uv.x, 1 - slot.placement.uv.y);
    slot.placement.horizontalPosition = slot.placement.uv.x;
    slot.placement.centerHeight = slot.placement.anchor.y;
    slot.placement.physicalHeight = slot.placement.mountedHeight;
    slot.placement.mountingGap ??= 0.002;
  }

  private setSlotCenterClampedToMountingZone(
    slot: ResolvedHubSlot,
    wall: ResolvedHubWall,
    requestedCenter: Point2D
  ): boolean {
    if (!wall.room) return false;
    const previous = {
      center: clonePoint(slot.placement.center),
      uv: slot.placement.uv ? clonePoint(slot.placement.uv) : undefined,
      anchor: slot.placement.anchor ? clonePoint(slot.placement.anchor) : undefined,
    };
    const applyCenter = (center: Point2D): boolean => {
      slot.placement.center = point(this.clampLocalX(center.x), this.clampLocalY(center.y));
      slot.placement.uv = point(slot.placement.center.x, 1 - slot.placement.center.y);
      this.syncCanonicalPlacement(slot, wall);
      const projection = projectSlotArtwork(wall, slot.placement, slot.artworkAspect, this.resolution.stage);
      return Boolean(
        projection
        && projection.validity?.doorwayClear
        && projection.projectedQuad.every((corner) => pointInPolygon(corner, wall.mountingZone))
      );
    };
    if (applyCenter(requestedCenter)) return true;
    const zoneCenter = wall.mountingZone.reduce(
      (sum, current) => point(sum.x + current.x, sum.y + current.y),
      point(0, 0)
    );
    zoneCenter.x /= Math.max(1, wall.mountingZone.length);
    zoneCenter.y /= Math.max(1, wall.mountingZone.length);
    const localZoneCenter = this.applyInverseHomography(wall, zoneCenter);
    if (!localZoneCenter || !applyCenter(localZoneCenter)) {
      slot.placement.center = previous.center;
      slot.placement.uv = previous.uv;
      slot.placement.anchor = previous.anchor;
      this.syncCanonicalPlacement(slot, wall);
      return false;
    }
    let invalidWeight = 0;
    let validWeight = 1;
    for (let iteration = 0; iteration < 16; iteration += 1) {
      const weight = (invalidWeight + validWeight) / 2;
      const candidate = point(
        requestedCenter.x + (localZoneCenter.x - requestedCenter.x) * weight,
        requestedCenter.y + (localZoneCenter.y - requestedCenter.y) * weight
      );
      if (applyCenter(candidate)) validWeight = weight;
      else invalidWeight = weight;
    }
    return applyCenter(point(
      requestedCenter.x + (localZoneCenter.x - requestedCenter.x) * validWeight,
      requestedCenter.y + (localZoneCenter.y - requestedCenter.y) * validWeight
    ));
  }

  private syncCalibrationControls(): void {
    const slot = this.activeCalibrationSlot;
    const wall = slot ? this.resolution.wallById.get(slot.placement.wallId) : null;
    if (slot && wall) this.syncCanonicalPlacement(slot, wall);
    const values: Record<string, number> = {
      horizontalPosition: slot?.placement.horizontalPosition ?? 0,
      centerHeight: slot?.placement.centerHeight ?? 0,
      physicalHeight: slot?.placement.physicalHeight ?? 0,
      mountingGap: slot?.placement.mountingGap ?? 0.002,
    };
    for (const [field, input] of this.calibrationFields) {
      input.value = values[field]?.toFixed(field === 'mountingGap' ? 3 : 2) ?? '';
      input.disabled = !slot;
    }
    if (this.calibrationUndoButton) this.calibrationUndoButton.disabled = this.calibrationUndoStack.length === 0;
    if (this.calibrationRedoButton) this.calibrationRedoButton.disabled = this.calibrationRedoStack.length === 0;
  }

  private applyCalibrationNumber(field: string, value: number): void {
    const slot = this.activeCalibrationSlot;
    if (!slot || !Number.isFinite(value)) return;
    const wall = this.resolution.wallById.get(slot.placement.wallId);
    if (!wall?.room) return;
    this.recordCalibrationHistory();
    if (field === 'horizontalPosition') {
      this.setSlotCenterClampedToMountingZone(
        slot,
        wall,
        point(this.clampLocalX(value), slot.placement.center.y)
      );
    } else if (field === 'centerHeight') {
      this.setSlotCenterClampedToMountingZone(
        slot,
        wall,
        point(slot.placement.center.x, 1 - this.clampLocalY(value / wall.room.height))
      );
    } else if (field === 'physicalHeight') {
      slot.placement.mountedHeight = Math.max(0.04, Math.min(wall.room.height, value));
    } else if (field === 'mountingGap') {
      slot.placement.mountingGap = Math.max(0.001, Math.min(0.03, value));
    }
    this.syncCanonicalPlacement(slot, wall);
    this.applyAllSlotGeometry();
    this.renderCalibrationOverlay();
    this.updateCalibrationOutput(true);
    this.syncCalibrationControls();
  }

  private centerActiveSlotInMountingZone(): void {
    const slot = this.activeCalibrationSlot;
    if (!slot) return;
    const wall = this.resolution.wallById.get(slot.placement.wallId);
    if (!wall || wall.mountingZone.length < 3) return;
    const centroid = wall.mountingZone.reduce(
      (sum, current) => point(sum.x + current.x, sum.y + current.y),
      point(0, 0)
    );
    centroid.x /= wall.mountingZone.length;
    centroid.y /= wall.mountingZone.length;
    const local = this.applyInverseHomography(wall, centroid);
    if (!local) return;
    this.recordCalibrationHistory();
    this.setSlotCenterClampedToMountingZone(
      slot,
      wall,
      point(this.clampLocalX(local.x), this.clampLocalY(local.y))
    );
    this.applyAllSlotGeometry();
    this.renderCalibrationOverlay();
    this.updateCalibrationOutput(true);
    this.syncCalibrationControls();
  }

  private confirmActiveMountingZone(): void {
    const wall = this.activeCalibrationWallId
      ? this.resolution.wallById.get(this.activeCalibrationWallId)
      : null;
    if (!wall) return;
    this.recordCalibrationHistory();
    wall.mountingZoneConfirmed = true;
    this.updateCalibrationOutput(true);
    this.renderCalibrationOverlay();
    this.syncCalibrationControls();
  }

  private recordCalibrationHistory(): void {
    const snapshot = JSON.stringify(this.buildCurrentCalibrationConfig(), null, 2);
    if (this.calibrationUndoStack[this.calibrationUndoStack.length - 1] !== snapshot) {
      this.calibrationUndoStack.push(snapshot);
    }
    if (this.calibrationUndoStack.length > 50) this.calibrationUndoStack.shift();
    this.calibrationRedoStack = [];
    this.syncCalibrationControls();
  }

  private undoCalibration(): void {
    const snapshot = this.calibrationUndoStack.pop();
    if (!snapshot) return;
    this.calibrationRedoStack.push(JSON.stringify(this.buildCurrentCalibrationConfig(), null, 2));
    this.applyCalibrationSnapshot(snapshot);
  }

  private redoCalibration(): void {
    const snapshot = this.calibrationRedoStack.pop();
    if (!snapshot) return;
    this.calibrationUndoStack.push(JSON.stringify(this.buildCurrentCalibrationConfig(), null, 2));
    this.applyCalibrationSnapshot(snapshot);
  }

  private resetCalibration(): void {
    if (!this.initialCalibrationSnapshot) return;
    this.recordCalibrationHistory();
    this.applyCalibrationSnapshot(this.initialCalibrationSnapshot);
  }

  private announceCalibrationAction(message: string): void {
    if (this.calibrationActionStatus) this.calibrationActionStatus.textContent = message;
  }

  private async copyCalibrationJson(): Promise<void> {
    if (!this.calibrationExportValid || !this.calibrationOutput) return;
    let copied = false;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(this.calibrationOutput.value);
      copied = true;
    } catch {
      this.calibrationOutput.focus();
      this.calibrationOutput.select();
      try {
        copied = document.execCommand('copy');
      } catch {
        copied = false;
      }
    }
    const message = copied
      ? 'Gültige Museum-Konfiguration wurde kopiert.'
      : 'Kopieren fehlgeschlagen. Bitte den JSON-Text manuell kopieren.';
    this.announceCalibrationAction(message);
  }

  private downloadCalibrationJson(): void {
    if (!this.calibrationExportValid || !this.calibrationOutput) return;
    const url = URL.createObjectURL(new Blob([this.calibrationOutput.value], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'museum-hub.json';
    anchor.click();
    URL.revokeObjectURL(url);
    this.announceCalibrationAction(
      'museum-hub.json wurde heruntergeladen. Ersetzen Sie damit die Datei im Ordner customer-artworks.'
    );
  }

  private async importCalibrationFile(file: File | null): Promise<void> {
    if (!file) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      this.announceCalibrationAction('Import blockiert: Datei enthält kein gültiges JSON.');
      return;
    }
    const sanitized = sanitizeMuseumHubConfig(parsed);
    if (!sanitized.config || sanitized.warnings.length > 0) {
      this.announceCalibrationAction(
        `Import blockiert: ${sanitized.warnings.join(' ') || 'ungültige Konfiguration'}`
      );
      return;
    }
    const ownershipChange = sanitized.config.slots.find((slot) => {
      const ownedWall = this.calibrationWallOwnership.get(slot.id);
      return ownedWall && ownedWall !== slot.placement.wallId;
    });
    if (ownershipChange) {
      this.announceCalibrationAction(
        `Import blockiert: ${ownershipChange.id} muss auf ${
          this.calibrationWallOwnership.get(ownershipChange.id)
        } bleiben.`
      );
      return;
    }
    this.recordCalibrationHistory();
    this.applyCalibrationSnapshot(JSON.stringify(sanitized.config));
    this.announceCalibrationAction('Konfiguration wurde importiert und erneut geprüft.');
  }

  private calibrationRoundTripWarnings(json: string): string[] {
    const sanitized = sanitizeMuseumHubConfig(JSON.parse(json));
    if (!sanitized.config) return ['Exportprüfung fehlgeschlagen: Konfiguration ist ungültig.'];
    const warnings = [...sanitized.warnings];
    const exported = this.buildCurrentCalibrationConfig() as { slots: Array<{ id: string; placement: Record<string, number | string> }> };
    const roundTripById = new Map(sanitized.config.slots.map((slot) => [slot.id, slot]));
    for (const slot of exported.slots) {
      const restored = roundTripById.get(slot.id);
      if (!restored || restored.placement.wallId !== slot.placement['wallId']) {
        warnings.push(`Bild ${slot.id}: Wandzuordnung hat sich bei der Exportprüfung geändert.`);
        continue;
      }
      for (const field of ['horizontalPosition', 'centerHeight', 'physicalHeight', 'mountingGap'] as const) {
        const expected = slot.placement[field];
        const actual = restored.placement[field];
        if (typeof expected !== 'number' || typeof actual !== 'number' || Math.abs(expected - actual) > 0.001) {
          warnings.push(`Bild ${slot.id}: ${field} hat sich bei der Exportprüfung geändert.`);
        }
      }
    }
    return warnings;
  }

  private updateCalibrationOutput(commitLastValid: boolean): void {
    const config = this.buildCurrentCalibrationConfig();
    const json = JSON.stringify(config, null, 2);
    const warnings = [...this.collectCalibrationWarnings(), ...this.calibrationRoundTripWarnings(json)];
    this.calibrationExportValid = warnings.length === 0;
    if (this.calibrationOutput) this.calibrationOutput.value = json;
    if (this.calibrationCopyButton) this.calibrationCopyButton.disabled = !this.calibrationExportValid;
    if (this.calibrationDownloadButton) this.calibrationDownloadButton.disabled = !this.calibrationExportValid;
    if (this.calibrationActionStatus) {
      this.calibrationActionStatus.textContent = this.calibrationExportValid
        ? 'Alles gültig. Die Konfiguration kann jetzt heruntergeladen werden.'
        : 'Speichern ist gesperrt, bis alle Meldungen oben behoben sind.';
    }
    for (const view of this.slotViews) {
      const invalid = warnings.some((warning) => warning.includes(`Bild ${view.slot.id}:`));
      view.button.classList.toggle('is-invalid-calibration', invalid);
      view.button.setAttribute('aria-invalid', String(invalid));
    }
    if (this.calibrationWarnings) {
      this.calibrationWarnings.replaceChildren();
      const entries = warnings.length > 0
        ? warnings
        : [
            'Keine Warnungen — Export und Wandzuordnung sind gültig.',
            ...this.collectCalibrationProofs(),
          ];
      for (const entry of entries) {
        const item = document.createElement('li');
        item.textContent = entry;
        this.calibrationWarnings.appendChild(item);
      }
    }
    if (this.calibrationExportValid && commitLastValid) {
      this.lastValidCalibrationSnapshot = json;
      if (this.calibrationRestoreButton) this.calibrationRestoreButton.disabled = false;
    }
    this.diagnostics.info('hub-calibration', 'Museum hub wall-plane calibration snapshot', { warnings, config });
  }

  private restoreLastValidCalibrationSnapshot(): void {
    if (!this.lastValidCalibrationSnapshot) return;
    this.recordCalibrationHistory();
    this.applyCalibrationSnapshot(this.lastValidCalibrationSnapshot);
  }

  private applyCalibrationSnapshot(snapshot: string): void {
    const sanitized = sanitizeMuseumHubConfig(JSON.parse(snapshot));
    const config = sanitized.config;
    if (!config) return;
    for (const wall of config.walls) {
      const currentWall = this.resolution.wallById.get(wall.id);
      if (!currentWall || !wall.quad) continue;
      const nextQuad = wall.quad;
      currentWall.quad.forEach((corner, index) => {
        corner.x = nextQuad[index]!.x;
        corner.y = nextQuad[index]!.y;
      });
      const nextSafe = wall.safePolygon ?? [];
      currentWall.safePolygon.splice(0, currentWall.safePolygon.length, ...nextSafe.map((corner) => clonePoint(corner)));
      currentWall.mountingZone.splice(
        0,
        currentWall.mountingZone.length,
        ...(wall.mountingZone ?? wall.safePolygon ?? []).map((corner) => clonePoint(corner))
      );
      currentWall.mountingZoneConfirmed = wall.mountingZoneConfirmed === true;
      currentWall.planeAspect = wall.planeAspect;
      if (wall.shadowVector) currentWall.shadowVector = clonePoint(wall.shadowVector);
      if (wall.transform) currentWall.transform = wall.transform;
      currentWall.drawableRegion = wall.drawableRegion;
      currentWall.exclusionPolygons = wall.exclusionPolygons;
      currentWall.hangingBand = wall.hangingBand;
      if (wall.room) {
        currentWall.room = {
          origin: { ...wall.room.origin },
          axisU: { ...wall.room.axisU },
          axisV: { ...wall.room.axisV },
          width: wall.room.width,
          height: wall.room.height,
          safePolygon: wall.room.safePolygon.map(clonePoint),
          doorwayExclusions: wall.room.doorwayExclusions.map((polygon) => polygon.map(clonePoint)),
          hangingBand: { ...wall.room.hangingBand },
        };
      }
    }
    for (const slot of config.slots) {
      const currentSlot = this.slotViews.find((view) => view.slot.id === slot.id)?.slot;
      if (!currentSlot) continue;
      currentSlot.placement.wallId = slot.placement.wallId;
      currentSlot.placement.center = clonePoint(slot.placement.center);
      currentSlot.placement.anchor = slot.placement.anchor ? clonePoint(slot.placement.anchor) : undefined;
      currentSlot.placement.uv = slot.placement.uv ? clonePoint(slot.placement.uv) : undefined;
      currentSlot.placement.mountedHeight = slot.placement.mountedHeight;
      currentSlot.placement.horizontalPosition = slot.placement.horizontalPosition;
      currentSlot.placement.centerHeight = slot.placement.centerHeight;
      currentSlot.placement.physicalHeight = slot.placement.physicalHeight;
      currentSlot.placement.mountingGap = slot.placement.mountingGap;
      currentSlot.placement.targetSizePolicy = slot.placement.targetSizePolicy;
      currentSlot.placement.minScale = slot.placement.minScale;
      currentSlot.placement.maxScale = slot.placement.maxScale;
      currentSlot.placement.zOffset = slot.placement.zOffset;
      currentSlot.placement.provisional = slot.placement.provisional === true;
    }
    this.applyAllSlotGeometry();
    this.renderCalibrationOverlay();
    this.updateCalibrationOutput(true);
    this.syncCalibrationControls();
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
    this.hubRoomRenderer?.dispose();
    this.projectedSlotGeometry.clear();
    this.debugProjectionSignatureBySlot.clear();
    this.slotViews.length = 0;
    this.roomLayers.length = 0;
    this.element.remove();
  }
}
