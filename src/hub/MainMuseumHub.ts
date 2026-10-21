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
  HUB_REFERENCE_BACK_WALL_QUAD,
  HUB_REFERENCE_IMAGE,
  HUB_MIN_PROJECTED_SHORT_EDGE_PX,
  HUB_ROOM_NAME_MAX_LENGTH,
  type HubEditableConfig,
  type MuseumHubResolution,
  type MuseumHubConfig,
  type ResolvedHubPage,
  type ResolvedHubSlot,
  type ResolvedHubWall,
  addRoomToConfig,
  assignArtworkInConfig,
  deleteRoomFromConfig,
  dropUnknownArtworkAssignments,
  evaluateDisplayedPlacement,
  exportHubSlotPlacement,
  hubFixedFieldsSignature,
  moveRoomInConfig,
  projectDisplayedPlacement,
  renameRoomInConfig,
  resolveMuseumHub,
  sanitizeMuseumHubConfig,
} from '../config/museumHub';
import type { Artwork } from '../config/artworks';
import {
  exceedsTapSlop,
  hapticTick,
  isMotionReduced,
  pickSnapTarget,
  rubberBandClamp,
  stepMomentum,
  velocityToReach,
  VelocityTracker,
} from '../interaction/touchGestures';
import {
  nearestPanoramaTarget,
  panForStripFraction,
  panoramaEdgeRoomStep,
  panoramaPanForFraction,
  panoramaPanLimit,
  stripFractionForPan,
} from './hubPanorama';
import { createEditorTabs, type EditorTabs } from './editor/editorTabs';
import { EditorRoomBar } from './editor/roomBar';
import { EditorArtworkLibrary, type LibraryArtwork, type LibraryPlace } from './editor/artworkLibrary';
import { EditorSaveTab } from './editor/saveTab';
import { EditorGalleryRoomViews } from './editor/galleryRoomViews';
import { PlacementController, type PlacementArtwork, type PlacementPlace } from './editor/placementController';
import { EditorToast } from './editor/editorToast';
import {
  countLabel,
  placeLabel,
  roomLabel,
  statusOfIssues,
  wallLabel,
  type CalibrationIssue,
} from './editor/editorText';
import {
  applyHomography,
  clonePoint,
  computeHomographyFromUnitSquare,
  invertMatrix3x3,
  point,
  pointInPolygon,
  polygonsIntersect,
  projectRoomDoorwayPolygons,
  evaluateWallCalibration,
  projectWorldPoint,
  quadIsConvex,
  quadIsDegenerate,
  type ProjectedArtworkGeometry,
  type Point2D,
  type Point3D,
  type Quad,
  deriveWallFrame,
} from './projectiveGeometry';
import { advanceToValid, nearestPolygonEdge, polygonIsSimple, slideToValid } from './constrainedDrag';
import { createScopedDiagnostics } from '../utils/Diagnostics';
import {
  redactArtworkImageUrlForLog,
  resolveArtworkImageSources,
  type ArtworkImageSourceCandidate,
} from '../utils/artworkImageSources';
import { loadHubImageAsset } from './hubAssetLoader';
import type { HubRoomRenderer, HubArtworkPresentationKind, SlotUpsertResult } from './HubRoomRenderer';
import type { QualityPreset } from '../config/quality';
import {
  getRuntimeProtocol,
  recordSourceToPixelOutcome,
  shouldPreferEmbeddedWebglFallback,
  shouldRetryEmbeddedFallbackAfterPostUploadFailure,
  shouldRunVisiblePixelProbe,
} from '../utils/sourceToPixelOutcome';
import { EditorViewport } from './editorViewport';
import { OnlineEditor, type BackgroundOption } from './editor/onlineEditor';
import { usesProjectFolderLayout } from '../online/desktopBridge';
import type { PendingArtwork } from './editor/pendingUploads';
import {
  buildArtworkRatioReport,
  createNativeSourceRect,
  nativeArtworkAspect,
  validateProjectedSourceMapping,
} from './artworkAspect';

const HUB_BACKGROUND_BASE_URL =
  usesProjectFolderLayout()
    ? '../customer-artworks/'
    : `${import.meta.env.BASE_URL}`;
const HUB_IMAGE_TIMEOUT_MS = 5000;
const HUB_INLINE_IMAGE_TIMEOUT_MS = 20000;
const NARROW_PORTRAIT_QUERY = '(max-aspect-ratio: 4/5)';
/** v1.41: width of one thumbnail slot in the phone panorama strip. */
const STRIP_ITEM_PX = 76;
const SHADOW_FEEDBACK_VARIABLES = [
  '--hub-shadow-fill-alpha',
  '--hub-shadow-opacity',
  '--hub-shadow-contact-alpha',
  '--hub-shadow-contact-blur',
  '--hub-shadow-directional-alpha',
  '--hub-shadow-directional-blur',
  '--hub-shadow-ambient-alpha',
  '--hub-shadow-ambient-blur',
] as const;
const SHADOW_FEEDBACK_PROFILES = {
  emphasis: ['0.32', '1', '0.6', '4px', '0.46', '17px', '0.27', '26px'],
  selected: ['0.28', '0.96', '0.54', '3px', '0.4', '14px', '0.23', '24px'],
} as const;

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

const artworkRuntimeInspectionId = (): string | null => {
  try {
    const value = new URLSearchParams(window.location.search).get('artworkDebug');
    return value === '1' ? '__first__' : value;
  } catch {
    return null;
  }
};

function resolveBackgroundUrl(src: string): string {
  const safeSrc = /^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(src) && !src.includes('..')
    ? src
    : 'Backgrounds/museum-empty.png';
  if (usesProjectFolderLayout()) return `${HUB_BACKGROUND_BASE_URL}${safeSrc}`;
  return `${HUB_BACKGROUND_BASE_URL}${safeSrc.replace(/^Backgrounds\//, 'backgrounds/')}`;
}

function setResolvedBackgroundSource(image: HTMLImageElement, src: string): void {
  const resolved = new URL(src, window.location.href);
  if (!['blob:', 'file:', 'freyraum:', 'http:', 'https:'].includes(resolved.protocol)) return;
  Reflect.set(image, 'src', resolved.href);
}

type CalibrationDrag =
  | {
      kind: 'slot';
      slot: ResolvedHubSlot;
      button: HTMLButtonElement;
      captureElement: Element;
      pointerId: number;
      mode: 'move' | 'resize';
      /** Wall-local offset from the grabbed point to the artwork centre. */
      grabOffset: Point2D;
      /** Client position of the press; below the drag threshold it is a click. */
      startClient: Point2D;
      /** True once the pointer passed the drag threshold (undo step recorded). */
      moved: boolean;
      pressedAt: number;
      lastFrameAt: number;
      frameTimes: number[];
      firstMoveAt: number | null;
    }
  | {
      kind: 'wall-point';
      wallId: string;
      pointerId: number;
      captureElement: Element;
      target: 'quad' | 'safe' | 'mounting-zone';
      index: number;
      startPoint: Point2D;
      startQuad?: Quad;
      startSafePolygon?: Point2D[];
      startMountingZone?: Point2D[];
    };

interface SlotView {
  slot: ResolvedHubSlot;
  button: HTMLButtonElement;
  shadowPath: SVGPathElement;
  spotlight: HTMLSpanElement | null;
  image: HTMLImageElement | null;
  imageLoadToken: number;
  /** Immutable ratio captured from the decoded source image. */
  nativeAspectRatio: number | null;
  nativeWidth: number | null;
  nativeHeight: number | null;
  assetRevision: string | null;
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
  private calibrationWallSelect: HTMLSelectElement | null = null;
  private calibrationFields = new Map<string, HTMLInputElement>();
  private calibrationCopyButton: HTMLButtonElement | null = null;
  private calibrationDownloadButton: HTMLButtonElement | null = null;
  private calibrationUndoButton: HTMLButtonElement | null = null;
  private calibrationRedoButton: HTMLButtonElement | null = null;
  private calibrationActionStatus: HTMLParagraphElement | null = null;
  private calibrationArtworkInfo: HTMLParagraphElement | null = null;
  private calibrationGuideToggle: HTMLButtonElement | null = null;
  private calibrationGuidesVisible = true;
  private calibrationRoomBoundaryVisible = false;
  private calibrationEditMode: 'wall' | 'safe' | 'mounting-zone' | 'room-boundary' = 'wall';
  /** "Wandecken bearbeiten": wall corner/edge handles are only shown while on. */
  private wallEditingEnabled = false;
  private artworks: readonly Artwork[];
  private calibrationPanel: HTMLElement | null = null;
  private editorTabs: EditorTabs | null = null;
  private roomBar: EditorRoomBar | null = null;
  private artworkLibrary: EditorArtworkLibrary | null = null;
  private placementController: PlacementController | null = null;
  private editorToast: EditorToast | null = null;
  private saveTab: EditorSaveTab | null = null;
  private galleryRoomEditor: EditorGalleryRoomViews | null = null;
  private calibrationIssues: CalibrationIssue[] = [];
  /** Option A (true) hangs unplaced artworks into extra rooms in the gallery. */
  private autoPlaceUnmappedSetting = false;
  private editorStatusButton: HTMLButtonElement | null = null;
  private editorToolButtons = new Map<string, HTMLButtonElement>();
  private editorViewButtons = new Map<'room' | 'wall', HTMLButtonElement>();
  private zoneConfirmedInput: HTMLInputElement | null = null;
  private editorDetailTitle: HTMLElement | null = null;
  private editorDetailBody: HTMLElement | null = null;
  private removeArtworkButton: HTMLButtonElement | null = null;
  private editorGuide: HTMLElement | null = null;
  private calibrationSvg: SVGSVGElement | null = null;
  private editorViewportSvg: SVGSVGElement | null = null;
  private editorViewport: EditorViewport | null = null;
  private calibrationViewport = { scale: 1, offsetX: 0, offsetY: 0 };
  private calibrationDrag: CalibrationDrag | null = null;
  /** Last artwork move that hit a limit; drives the edge highlight while dragging. */
  private lastSlotDragBlocked: { slotId: string; target: Point2D } | null = null;
  private calibrationMoveRaf = 0;
  private pendingCalibrationMove: PointerEvent | null = null;
  private entranceBoundaryQuad: Quad | null = null;
  private activeCalibrationWallId: string | null = null;
  private activeCalibrationSlotId: string | null = null;
  private lastValidCalibrationSnapshot: string | null = null;
  private initialCalibrationSnapshot: string | null = null;
  private calibrationUndoStack: string[] = [];
  private calibrationRedoStack: string[] = [];
  private calibrationExportValid = false;
  private editorGeometryDirty = false;
  private readonly initialEditorCorners = new Map<string, readonly [Point3D, Point3D, Point3D, Point3D]>();
  private readonly calibrationWallOwnership = new Map<string, string>();
  private activateCallback: (() => void) | null = null;
  private selectSlotCallback: ((slot: ResolvedHubSlot) => void) | null = null;
  private disposed = false;
  private pageCount = 1;
  private viewIndex = 0;
  private narrowMode = false;
  private lastActivatedSlotId: string | null = null;
  private selectedArtworkId: string | null = null;
  private explicitlySelectedArtworkId: string | null = null;
  private lastSelectionSignature: string | null = null;
  private decodedPages = new Set<number>();
  private idleDecodeHandle: number | null = null;
  private idleDecodeNextPage = 1;
  private projectedSlotGeometry = new Map<string, ProjectedArtworkGeometry>();
  private debugProjectionSignatureBySlot = new Map<string, string>();
  private swipeStartX: number | null = null;
  private swipeStartY: number | null = null;
  private swipePointerId: number | null = null;
  // v1.41 phone panorama (narrow portrait, visitor mode): one continuous
  // horizontal camera driven by drag, momentum, rubber-band edges and the
  // artwork strip. Replaces the three wall-focus views that hid artworks.
  private panorama = false;
  private panX = 0;
  private panFrame = 0;
  private panDrag: {
    pointerId: number;
    startX: number;
    startY: number;
    startPan: number;
    startFraction: number;
    source: 'photo' | 'strip';
    dragging: boolean;
  } | null = null;
  private readonly panTracker = new VelocityTracker();
  private suppressClickUntil = 0;
  private strip!: HTMLElement;
  private stripTrack!: HTMLElement;
  private stripViews: SlotView[] = [];
  private stripButtons: HTMLButtonElement[] = [];
  private stripTargets: number[] = [];
  private stripPageIndex = -1;
  private stripActiveIndex = -1;
  private resizeRafId = 0;
  private editorBackgroundObjectUrl: string | null = null;
  /** v1.38 online editing (login, uploads, publish); null outside the editor. */
  private onlineEditor: OnlineEditor | null = null;
  private editorReadOnly = false;
  private editorEditablePanels: HTMLElement[] = [];
  private readonly editorArtworkObjectUrls = new Map<string, string>();
  private readonly defaultBackgroundSrc: string;
  private readonly defaultBackground: MuseumHubResolution['background'];
  private readonly backgroundImage: HTMLImageElement;

  constructor(
    app: HTMLElement,
    resolution: MuseumHubResolution,
    _preset: QualityPreset,
    artworks: readonly Artwork[] = []
  ) {
    this.resolution = resolution;
    this.artworks = artworks;
    this.calibrating = isCalibrationRequested();
    this.debugGeometry = isHubDebugRequested();
    // The editor also shows empty rooms, so its room list can exceed the pages.
    this.pageCount = Math.max(1, resolution.pages.length, this.calibrating ? resolution.rooms.length : 0);
    this.autoPlaceUnmappedSetting = resolution.explicitRooms ? resolution.fallbacks.autoPlaceUnmapped : false;
    this.stageWidth = resolution.stage.width;
    this.stageHeight = resolution.stage.height;
    this.activeCalibrationWallId = resolution.walls[0]?.id ?? null;
    for (const wall of resolution.walls) {
      if (!wall.room) continue;
      this.initialEditorCorners.set(
        wall.id,
        wall.room.corners.map((corner) => ({ ...corner })) as unknown as [Point3D, Point3D, Point3D, Point3D]
      );
    }
    this.entranceBoundaryQuad = this.projectEntranceBoundary();
    this.defaultBackgroundSrc = resolution.background.src;
    this.defaultBackground = { ...resolution.background };

    const hub = document.createElement('section');
    hub.className = 'museum-hub is-photographic';
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
    this.backgroundImage = image;
    image.className = 'museum-hub__image';
    image.alt = '';
    image.decoding = 'async';
    image.draggable = false;
    image.style.objectFit = resolution.background.fit ?? 'contain';
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
    // The photograph and calibrated DOM artworks are the same pixel owners in
    // the editor and museum. An opaque room scene would hide that saved layout.
    this.hubRoomRenderer = null;

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
    const entryFrame = document.createElement('span');
    entryFrame.className = 'museum-hub__destination-frame';
    entryFrame.setAttribute('aria-hidden', 'true');
    const entryLabel = document.createElement('span');
    entryLabel.className = 'museum-hub__destination-label';
    entryLabel.textContent = 'Ausstellung betreten';
    entryButton.append(entryFrame, entryLabel);

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
    pagerPrev.setAttribute('aria-label', 'Vorheriger Raum');
    pagerPrev.textContent = '‹';
    const pagerCounter = document.createElement('span');
    pagerCounter.className = 'museum-hub__pager-counter';
    pagerCounter.setAttribute('aria-live', 'polite');
    const pagerNext = document.createElement('button');
    pagerNext.type = 'button';
    pagerNext.className = 'museum-hub__pager-arrow museum-hub__pager-arrow--next';
    pagerNext.setAttribute('aria-label', 'Nächster Raum');
    pagerNext.textContent = '›';
    pager.append(pagerPrev, pagerCounter, pagerNext);

    stage.appendChild(entryButton);
    visual.appendChild(stage);
    const strip = document.createElement('div');
    strip.className = 'museum-hub__strip';
    strip.hidden = true;
    const stripTrack = document.createElement('div');
    stripTrack.className = 'museum-hub__strip-track';
    stripTrack.setAttribute('role', 'group');
    stripTrack.setAttribute('aria-label', 'Werke in diesem Raum');
    strip.appendChild(stripTrack);
    hub.append(visual, shade, header, description, strip, pager, status);
    app.appendChild(hub);
    this.strip = strip;
    this.stripTrack = stripTrack;

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
    this.syncPanoramaMode();
    this.narrowQuery.addEventListener('change', this.handleNarrowChange);

    this.resizeObserver =
      typeof ResizeObserver === 'function'
        ? new ResizeObserver(() => this.handleResize())
        : null;
    this.resizeObserver?.observe(this.visual);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('blur', this.handleCalibrationBlur);

    hub.addEventListener('pointerdown', this.handleSwipeStart, { passive: true });
    hub.addEventListener('pointerup', this.handleSwipeEnd, { passive: true });
    hub.addEventListener('pointercancel', this.handleSwipeCancel, { passive: true });
    hub.addEventListener('pointerdown', this.handlePanPointerDown);
    hub.addEventListener('pointermove', this.handlePanPointerMove);
    hub.addEventListener('pointerup', this.handlePanPointerUp);
    hub.addEventListener('pointercancel', this.handlePanPointerCancel);
    hub.addEventListener('click', this.handleClickCapture, true);
    hub.addEventListener('keydown', this.handleKeydown);

    if (this.calibrating || this.debugGeometry) {
      this.buildCalibrationOverlay();
      if (this.calibrating) this.buildCalibrationPanel(hub);
      if (this.calibrating) this.fitCalibrationWallsToView();
      this.renderCalibrationOverlay();
    }

    this.imageReady = Promise.all([backgroundReady, this.decodePageImages(0)]).then(() => {
      this.applyView(true);
      this.updateStageScale();
      this.applyAllSlotGeometry();
      this.inspectArtworkRuntime();
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
    if (options.source === 'slot-click') {
      this.explicitlySelectedArtworkId = nextArtworkId;
    } else if (
      options.source !== 'gallery-navigate'
      || this.explicitlySelectedArtworkId !== nextArtworkId
    ) {
      this.explicitlySelectedArtworkId = null;
    }
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
      const current = !!this.selectedArtworkId && view.slot.artworkId === this.selectedArtworkId;
      const selected = !!this.explicitlySelectedArtworkId
        && view.slot.artworkId === this.explicitlySelectedArtworkId;
      view.button.classList.toggle('is-selected', selected);
      view.shadowPath.classList.toggle('is-selected', selected);
      if (view.spotlight) this.syncArtworkSpotlight(view.button, view.spotlight);
      this.syncShadowFeedback(view.shadowPath);
      if (current) selectedView = view;
      if (selected) {
        view.button.setAttribute('aria-current', 'true');
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
      currentWallFocus: this.panorama ? 'panorama' : 'full',
      lastActivatedSlotId: this.lastActivatedSlotId,
      renderedSlots: this.slotViews.length,
    });
  }

  private setButtonsDisabled(disabled: boolean): void {
    this.entryButton.disabled = disabled;
    for (const view of this.slotViews) {
      // Editor places (including empty ones) stay focusable and draggable.
      view.button.disabled = disabled || (!view.slot.selectable && !(this.calibrating && !view.slot.disabledReason));
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
    this.stage.appendChild(rooms);
    this.syncRoomLayers();
    for (const page of this.resolution.pages) {
      for (const slot of page.slots) {
        if (!this.calibrating && !this.debugGeometry && (!slot.selectable || !slot.artworkId)) continue;
        const view = this.buildSlotButton(slot);
        this.roomLayers[slot.pageIndex]?.appendChild(view.button);
        this.slotViews.push(view);
      }
    }
  }

  /** Keeps one DOM room layer per room (the editor adds and deletes rooms). */
  private syncRoomLayers(): void {
    const container = this.stage.querySelector<HTMLElement>('.museum-hub__rooms');
    if (!container) return;
    while (this.roomLayers.length < this.pageCount) {
      const room = document.createElement('div');
      room.className = 'museum-hub__room';
      room.dataset['page'] = String(this.roomLayers.length);
      const shadows = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      shadows.classList.add('museum-hub__shadows');
      shadows.setAttribute('viewBox', `0 0 ${this.stageWidth} ${this.stageHeight}`);
      shadows.setAttribute('preserveAspectRatio', 'none');
      shadows.setAttribute('aria-hidden', 'true');
      room.appendChild(shadows);
      container.appendChild(room);
      this.roomLayers.push(room);
    }
    while (this.roomLayers.length > this.pageCount) this.roomLayers.pop()?.remove();
  }

  private buildSlotButton(slot: ResolvedHubSlot, render = true): SlotView {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'museum-hub__artwork';
    button.dataset['slotId'] = slot.id;
    if (slot.artworkId) button.dataset['artworkId'] = slot.artworkId;
    const shadowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shadowPath.classList.add('museum-hub__shadow-path');
    if (!slot.artworkId) shadowPath.classList.add('is-empty');
    shadowPath.dataset['slotId'] = slot.id;
    this.roomLayers[slot.pageIndex]
      ?.querySelector<SVGSVGElement>('.museum-hub__shadows')
      ?.appendChild(shadowPath);
    const spotlight = slot.selectable && slot.artworkId
      ? document.createElement('span')
      : null;
    spotlight?.classList.add('museum-hub__artwork-light');
    if (spotlight) {
      spotlight.setAttribute('aria-hidden', 'true');
      button.appendChild(spotlight);
    }
    button.addEventListener('pointerenter', (event) => {
      if ((event.pointerType === 'mouse' || event.pointerType === 'pen') && event.buttons === 0) {
        button.classList.add('is-hovered');
        shadowPath.classList.add('is-hovered');
        if (spotlight) this.syncArtworkSpotlight(button, spotlight, event);
        this.syncShadowFeedback(shadowPath);
      }
    });
    button.addEventListener('pointermove', (event) => {
      if (
        spotlight
        && button.classList.contains('is-hovered')
        && (event.pointerType === 'mouse' || event.pointerType === 'pen')
        && event.buttons === 0
      ) {
        this.syncArtworkSpotlight(button, spotlight, event);
      }
    });
    button.addEventListener('pointerleave', () => {
      button.classList.remove('is-hovered');
      shadowPath.classList.remove('is-hovered');
      if (spotlight) this.syncArtworkSpotlight(button, spotlight);
      this.syncShadowFeedback(shadowPath);
    });
    button.addEventListener('focus', () => {
      const keyboardFocus = button.matches(':focus-visible');
      button.classList.toggle('is-focused', keyboardFocus);
      shadowPath.classList.toggle('is-focused', keyboardFocus);
      if (spotlight) this.syncArtworkSpotlight(button, spotlight);
      this.syncShadowFeedback(shadowPath);
    });
    button.addEventListener('blur', () => {
      button.classList.remove('is-focused');
      shadowPath.classList.remove('is-focused');
      if (spotlight) this.syncArtworkSpotlight(button, spotlight);
      this.syncShadowFeedback(shadowPath);
    });

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
    label.textContent = this.calibrating
      ? `${placeLabel(slot.id, slot.placement.wallId)} · ${slot.artworkId ? slot.displayLabel : 'leer'}`
      : this.debugGeometry ? `${slot.id} · ${slot.displayLabel}` : slot.displayLabel;
    button.appendChild(label);

    if (this.calibrating) {
      const place = placeLabel(slot.id, slot.placement.wallId);
      if (!slot.artworkId) {
        // Empty places are dashed placeholders that can be selected and filled.
        button.classList.add('is-empty-slot');
        button.removeAttribute('aria-disabled');
        button.setAttribute('aria-label', `Leerer Platz ${place}. Enter öffnet die Bildauswahl.`);
        const add = document.createElement('span');
        add.className = 'museum-hub__empty-slot-cta';
        add.setAttribute('aria-hidden', 'true');
        const plus = document.createElement('strong');
        plus.textContent = '+ Bild hinzufügen';
        const where = document.createElement('span');
        where.textContent = place;
        add.append(plus, where);
        button.appendChild(add);
      } else {
        button.setAttribute('aria-label', `„${slot.displayLabel}“ auf ${place}. Ziehen oder Pfeiltasten verschieben.`);
      }
      const handle = document.createElement('span');
      handle.className = 'museum-hub__artwork-handle';
      handle.setAttribute('aria-hidden', 'true');
      button.appendChild(handle);
      button.disabled = false;
      button.dataset['dropSlot'] = slot.id;
      button.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        if (this.placementController?.chosenArtwork) {
          this.placementController.choosePlace(slot.id);
        } else if (!slot.artworkId) {
          this.selectCalibrationSlot(slot.id);
          this.placementController?.openPlacePicker(slot.id, button);
        } else {
          this.selectCalibrationSlot(slot.id);
        }
      });
      button.addEventListener('pointerdown', (event) => {
        const target = event.target as HTMLElement | null;
        this.startSlotCalibrationDrag(event, slot, button, target?.classList.contains('museum-hub__artwork-handle') ? 'resize' : 'move');
      });
    } else if (slot.selectable) {
      button.addEventListener('click', () => this.handleSlotClick(slot));
    }

    const view: SlotView = {
      slot,
      button,
      shadowPath,
      spotlight,
      image,
      imageLoadToken: 0,
      nativeAspectRatio: null,
      nativeWidth: null,
      nativeHeight: null,
      assetRevision: null,
      imageState: 'idle',
      resolvedSource: null,
      fallbackReason: null,
      lastUpsertResult: null,
    };
    this.applySlotGeometry(button, slot, false, 1, shadowPath);
    this.syncSlotRenderer(view, render);
    return view;
  }

  private syncShadowFeedback(shadowPath: SVGPathElement): void {
    const selected = shadowPath.classList.contains('is-selected');
    const emphasized = selected
      || shadowPath.classList.contains('is-hovered')
      || shadowPath.classList.contains('is-focused');
    if (!emphasized || this.calibrating || this.debugGeometry) {
      for (const variable of SHADOW_FEEDBACK_VARIABLES) shadowPath.style.removeProperty(variable);
      return;
    }
    const profile = selected
      ? SHADOW_FEEDBACK_PROFILES.selected
      : SHADOW_FEEDBACK_PROFILES.emphasis;
    SHADOW_FEEDBACK_VARIABLES.forEach((variable, index) => {
      shadowPath.style.setProperty(variable, profile[index]);
    });
  }

  private syncArtworkSpotlight(
    button: HTMLButtonElement,
    spotlight: HTMLSpanElement,
    pointer?: PointerEvent
  ): void {
    if (this.calibrating || this.debugGeometry) {
      button.classList.remove('is-illuminated');
      return;
    }
    const selected = button.classList.contains('is-selected');
    const focused = button.classList.contains('is-focused');
    const hovered = button.classList.contains('is-hovered');
    if (!selected && !focused && !hovered) {
      button.classList.remove('is-illuminated');
      return;
    }
    if (selected) {
      spotlight.style.setProperty('--hub-light-x', '50%');
      spotlight.style.setProperty('--hub-light-y', '42%');
    } else if (pointer && hovered) {
      const bounds = button.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((pointer.clientX - bounds.left) / bounds.width) * 100));
      const y = Math.max(0, Math.min(100, ((pointer.clientY - bounds.top) / bounds.height) * 100));
      spotlight.style.setProperty('--hub-light-x', `${x.toFixed(2)}%`);
      spotlight.style.setProperty('--hub-light-y', `${y.toFixed(2)}%`);
    } else if (focused) {
      spotlight.style.setProperty('--hub-light-x', '50%');
      spotlight.style.setProperty('--hub-light-y', '42%');
    }
    button.classList.add('is-illuminated');
  }

  private applySlotGeometry(
    button: HTMLButtonElement,
    slot: ResolvedHubSlot,
    syncRenderer = true,
    aspectOverride?: number,
    shadowPath?: SVGPathElement
  ): void {
    const wall = this.resolution.wallById.get(slot.placement.wallId);
    if (!wall) {
      button.classList.add('is-invalid-geometry');
      this.projectedSlotGeometry.delete(slot.id);
      this.hubRoomRenderer?.setSlotHidden(slot.id);
      button.style.width = '0px';
      button.style.height = '0px';
      button.style.clipPath = 'none';
      button.style.removeProperty('--hub-clip-path');
      (shadowPath ?? this.slotViews.find((candidate) => candidate.slot.id === slot.id)?.shadowPath)
        ?.removeAttribute('d');
      this.diagnostics.warn('hub-slot-missing-wall', 'Hub slot geometry skipped because the wall is missing', {
        slotId: slot.id,
        wallId: slot.placement.wallId,
      });
      return;
    }
    const view = this.slotViews.find((candidate) => candidate.slot.id === slot.id);
    const projectedShadow = shadowPath ?? view?.shadowPath;
    const projection = this.projectDisplayedSlot(slot, wall, aspectOverride);
    if (!projection) {
      button.classList.add('is-invalid-geometry');
      this.projectedSlotGeometry.delete(slot.id);
      this.hubRoomRenderer?.setSlotHidden(slot.id);
      button.style.width = '0px';
      button.style.height = '0px';
      button.style.clipPath = 'none';
      button.style.removeProperty('--hub-clip-path');
      projectedShadow?.removeAttribute('d');
      this.diagnostics.warn('hub-slot-projection-invalid', 'Hub slot projection is invalid and will not render interactively', {
        slotId: slot.id,
        artworkId: slot.artworkId,
        wallId: wall.id,
        projectionRealism: wall.projectionRealism,
      });
      return;
    }
    this.projectedSlotGeometry.set(slot.id, projection);
    projectedShadow?.setAttribute(
      'd',
      `M${projection.projectedQuad.map(({ x, y }) => `${x.toFixed(3)},${y.toFixed(3)}`).join(' L')} Z`
    );
    button.classList.remove('is-invalid-geometry');
    // Same rule as evaluateDisplayedPlacement: flag (never move) invalid placements.
    button.classList.toggle(
      'is-placement-invalid',
      projection.validity?.doorwayClear === false
        || !(wall.mountingZone.length >= 3 && projection.projectedQuad.every((corner) => pointInPolygon(corner, wall.mountingZone)))
    );
    const bounds = projection.bounds;
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
    button.style.setProperty('--hub-artwork-transform', projection.cssMatrix3d);
    const image = button.querySelector<HTMLImageElement>('.museum-hub__art');
    if (image) {
      image.style.width = `${projection.sourceWidth}px`;
      image.style.height = `${projection.sourceHeight}px`;
      image.style.inset = '0 auto auto 0';
    }
    const shadow = wall.shadowVector ?? point(wall.group === 'left' ? -10 : 10, 16);
    button.style.setProperty('--hub-shadow-x', `${shadow.x}px`);
    button.style.setProperty('--hub-shadow-y', `${shadow.y}px`);
    projectedShadow?.style.setProperty('--hub-shadow-x', `${shadow.x}px`);
    projectedShadow?.style.setProperty('--hub-shadow-y', `${shadow.y}px`);
    if (view && syncRenderer) this.syncSlotRenderer(view);
    if (this.debugGeometry) this.logSlotProjection(slot, wall, projection);
  }

  /**
   * The single projection used for the visible editor overlay, drag clamping,
   * and editor warnings. Using one path keeps what the user sees, what is
   * validated, and what the 3D renderer mounts identical.
   */
  private projectDisplayedSlot(
    slot: ResolvedHubSlot,
    wall: ResolvedHubWall,
    aspectOverride?: number
  ): ProjectedArtworkGeometry | null {
    const view = this.slotViews.find((candidate) => candidate.slot.id === slot.id);
    const decodedAspect = view?.image && view.image.complete && view.image.naturalWidth > 0 && view.image.naturalHeight > 0
      ? view.image.naturalWidth / view.image.naturalHeight
      : null;
    return projectDisplayedPlacement(
      wall,
      slot.placement,
      decodedAspect ?? aspectOverride ?? this.presentationAspectForSlot(slot),
      this.resolution.stage
    );
  }

  /** Aspect used by the displayed projection (decoded image first, like the 3D renderer). */
  private displayedAspectForSlot(slot: ResolvedHubSlot): number {
    const view = this.slotViews.find((candidate) => candidate.slot.id === slot.id);
    return view?.image && view.image.complete && view.image.naturalWidth > 0 && view.image.naturalHeight > 0
      ? view.image.naturalWidth / view.image.naturalHeight
      : this.presentationAspectForSlot(slot);
  }

  private syncAllSlotRenderers(): void {
    if (!this.hubRoomRenderer) return;
    for (const view of this.slotViews) {
      if (this.projectedSlotGeometry.has(view.slot.id)) this.syncSlotRenderer(view, false);
    }
    this.hubRoomRenderer.renderFrame();
  }

  private syncSlotRenderer(view: SlotView, render = true): void {
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
    const presentationKind: HubArtworkPresentationKind = missingImage ? 'placeholder' : 'artwork';
    const presentationAspect = this.presentationAspectForView(view, presentationKind);
    view.lastUpsertResult = this.hubRoomRenderer.upsertSlot(
      view.slot,
      wall,
      view.image,
      missingImage,
      view.resolvedSource?.resolvedUrlType ?? null,
      presentationKind,
      presentationAspect,
      render
    );
  }

  private presentationAspectForSlot(slot: ResolvedHubSlot): number {
    const view = this.slotViews.find((candidate) => candidate.slot.id === slot.id);
    return view ? this.presentationAspectForView(view, view.imageState === 'ready' ? 'artwork' : 'placeholder') : 1;
  }

  private presentationAspectForView(view: SlotView, kind: HubArtworkPresentationKind): number {
    if (kind === 'placeholder') return 1;
    return Math.max(Number.EPSILON, view.nativeAspectRatio ?? view.slot.artworkAspect);
  }

  /**
   * Re-projects every slot. The 3D scene is synced in one batch and rendered
   * once; pass `syncRenderer = false` during wall/zone drags so only the 2D
   * overlay updates and the 3D scene is redrawn once on release.
   */
  private applyAllSlotGeometry(syncRenderer = true): void {
    for (const view of this.slotViews) this.applySlotGeometry(view.button, view.slot, false);
    if (syncRenderer) this.syncAllSlotRenderers();
    this.applySelectionState('geometry-refresh');
    if ((this.calibrating || this.debugGeometry) && !this.calibrationDrag) this.renderCalibrationOverlay();
  }

  private inspectArtworkRuntime(): void {
    const requestedId = artworkRuntimeInspectionId();
    if (!requestedId) return;
    const view = this.slotViews.find(({ slot }) =>
      requestedId === '__first__' ? Boolean(slot.artworkId && slot.selectable) : slot.artworkId === requestedId || slot.id === requestedId
    );
    if (!view) {
      console.warn('[Freyraum artwork-debug] slot not found', { requestedId });
      return;
    }
    const image = view.image;
    const element = view.button;
    const computed = getComputedStyle(element);
    const imageComputed = image ? getComputedStyle(image) : null;
    const rect = element.getBoundingClientRect();
    const imageRect = image?.getBoundingClientRect() ?? null;
    const renderer = this.hubRoomRenderer?.inspectArtwork(view.slot.id) ?? null;
    const canvas = this.element.querySelector<HTMLCanvasElement>('.museum-hub__canvas canvas, canvas');
    const canvasRect = canvas?.getBoundingClientRect() ?? null;
    const canvasStyle = canvas ? getComputedStyle(canvas) : null;
    const imageVisible = Boolean(
      image &&
      image.complete &&
      image.naturalWidth > 0 &&
      imageRect &&
      imageRect.width > 0 &&
      imageRect.height > 0 &&
      imageComputed &&
      imageComputed.display !== 'none' &&
      imageComputed.visibility !== 'hidden' &&
      Number(imageComputed.opacity) > 0
    );
    const webglVisible = Boolean(
      canvas &&
      canvasRect &&
      canvasRect.width > 0 &&
      canvasRect.height > 0 &&
      canvasStyle &&
      canvasStyle.display !== 'none' &&
      canvasStyle.visibility !== 'hidden' &&
      Number(canvasStyle.opacity) > 0
    );
    const probeRect = imageRect ?? rect;
    let hitStack: string[] = [];
    if (probeRect.width > 0 && probeRect.height > 0) {
      hitStack = document
        .elementsFromPoint(probeRect.left + probeRect.width / 2, probeRect.top + probeRect.height / 2)
        .slice(0, 8)
        .map((node) => node.tagName.toLowerCase() + (node.className ? `.${String(node.className).replace(/\s+/g, '.')}` : ''));
    }
    const topHit = hitStack[0] ?? '';
    const visibleOwner = imageVisible && topHit.startsWith('img.')
      ? 'DOM'
      : webglVisible && topHit.startsWith('canvas')
        ? 'WebGL'
        : imageVisible && webglVisible
          ? 'hybrid'
          : imageVisible
            ? 'DOM'
            : webglVisible
              ? 'WebGL'
              : 'unknown';
    const ratio = (width: number, height: number): number | null =>
      width > 0 && height > 0 ? width / height : null;
    const sourceRatio = ratio(image?.naturalWidth ?? 0, image?.naturalHeight ?? 0);
    const canonicalWidth = view.slot.placement.mountedHeight * view.slot.artworkAspect;
    const canonicalHeight = view.slot.placement.mountedHeight;
    const localRatio = ratio(renderer?.localGeometry.width ?? 0, renderer?.localGeometry.height ?? 0);
    const worldRatio = ratio(renderer?.worldDimensions.width ?? 0, renderer?.worldDimensions.height ?? 0);
    const domWidth = imageRect?.width ?? rect.width;
    const domHeight = imageRect?.height ?? rect.height;
    const domRatio = ratio(domWidth, domHeight);
    const textureRatio = ratio(renderer?.texture?.width ?? 0, renderer?.texture?.height ?? 0);
    const presentationKind = renderer?.presentationKind ?? (imageVisible ? 'artwork' : 'placeholder');
    const presentationRatio = presentationKind === 'placeholder'
      ? 1
      : sourceRatio ?? Math.max(Number.EPSILON, view.slot.artworkAspect);
    const uvValues = renderer?.texture?.uv ?? [];
    const uvPairs = Array.from({ length: Math.floor(uvValues.length / 2) }, (_, index) => [
      uvValues[index * 2],
      uvValues[index * 2 + 1],
    ]);
    const uvMin = uvPairs.length
      ? [Math.min(...uvPairs.map(([u]) => u)), Math.min(...uvPairs.map(([, v]) => v))]
      : null;
    const uvMax = uvPairs.length
      ? [Math.max(...uvPairs.map(([u]) => u)), Math.max(...uvPairs.map(([, v]) => v))]
      : null;
    const stages: Array<[string, number | null]> = [
      ...(presentationKind === 'artwork'
        ? [['source-to-canonical', sourceRatio && ratio(canonicalWidth, canonicalHeight)] as [string, number | null]]
        : []),
      ['presentation-to-three-local', localRatio],
      ['three-local-to-world', worldRatio],
      ['presentation-to-dom', domRatio],
      ['presentation-to-texture', textureRatio],
    ];
    const brokenStage = stages.find(([, value]) =>
      value === null || Math.abs(value - presentationRatio) > 0.001
    )?.[0] ?? null;
    const verdict = brokenStage
      ? `ASPECT PIPELINE: BROKEN AT ${brokenStage}`
      : 'ASPECT PIPELINE: CONSISTENT — NO GEOMETRIC DISTORTION FOUND';
    const report = {
      artworkId: view.slot.artworkId,
      presentationKind,
      presentationRatio,
      source: {
        naturalWidth: image?.naturalWidth ?? 0,
        naturalHeight: image?.naturalHeight ?? 0,
        ratio: sourceRatio,
      },
      canonical: { width: canonicalWidth, height: canonicalHeight, ratio: ratio(canonicalWidth, canonicalHeight) },
      threeJsLocalGeometry: {
        width: renderer?.localGeometry.width ?? 0,
        height: renderer?.localGeometry.height ?? 0,
        ratio: localRatio,
      },
      threeJsWorld: {
        width: renderer?.worldDimensions.width ?? 0,
        height: renderer?.worldDimensions.height ?? 0,
        ratio: worldRatio,
      },
      dom: {
        tag: element.tagName,
        rectWidth: domWidth,
        rectHeight: domHeight,
        rectRatio: domRatio,
        cssTransform: imageComputed?.transform ?? computed.transform,
      },
      texture: {
        width: renderer?.texture?.width ?? 0,
        height: renderer?.texture?.height ?? 0,
        ratio: textureRatio,
        uvMin,
        uvMax,
      },
      visibleOwner,
      ownerEvidence: { imageVisible, webglVisible, topHit, hitStack },
      verdict,
    };
    console.log(`[Freyraum artwork-debug] ${JSON.stringify(report)}`);
    (window as Window & { __freyraumArtworkDebug?: typeof report }).__freyraumArtworkDebug = report;
  }

  private logSlotProjection(slot: ResolvedHubSlot, wall: ResolvedHubWall, projection: ProjectedArtworkGeometry): void {
    const signature = projection.projectedQuad
      .map((corner) => `${corner.x.toFixed(1)},${corner.y.toFixed(1)}`)
      .join('|');
    if (this.debugProjectionSignatureBySlot.get(slot.id) === signature) return;
    this.debugProjectionSignatureBySlot.set(slot.id, signature);

    const withinSafePolygon = projection.projectedQuad.every((corner) => pointInPolygon(corner, wall.safePolygon));
    const sourceMapping = computeHomographyFromUnitSquare(projection.projectedQuad);
    const sourceMappingReport = sourceMapping
      ? validateProjectedSourceMapping(
          { width: projection.sourceWidth, height: projection.sourceHeight },
          projection.projectedQuad,
          (x, y) => applyHomography(
            sourceMapping,
            x / projection.sourceWidth,
            y / projection.sourceHeight
          )
        )
      : null;
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
      sourceRectangle: {
        width: projection.sourceWidth,
        height: projection.sourceHeight,
        ratio: projection.sourceWidth / projection.sourceHeight,
      },
      sourceMapping: sourceMappingReport,
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
        referenceCalibration:
          wall.id === 'wall-front' && wall.projectedQuad
            ? evaluateWallCalibration(
              wall.projectedQuad,
              HUB_REFERENCE_BACK_WALL_QUAD,
              HUB_REFERENCE_IMAGE,
              this.resolution.stage
            )
            : null,
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
      // Views kept across editor room changes are already loaded or loading.
      if (view.imageState !== 'idle') continue;
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
          presentationPath: this.hubRoomRenderer ? 'webgl' : 'dom',
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
        this.diagnostics.warn('artwork-image-retry', 'Hub artwork source failed validation; retrying embedded fallback', {
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
   * Records DOM decoding separately from any renderer upload/probe evidence;
   * a decoded photograph-backed artwork must not claim WebGL pixel proof.
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
      presentationPath: this.hubRoomRenderer ? 'webgl' : 'dom',
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
      sourceWidth: upsert?.fit?.sourceWidth ?? view.image?.naturalWidth ?? null,
      sourceHeight: upsert?.fit?.sourceHeight ?? view.image?.naturalHeight ?? null,
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
      presentationPath: this.hubRoomRenderer ? 'webgl' : 'dom',
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

  private probeSlotSourceAlpha(image: HTMLImageElement): boolean | null {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 4;
      canvas.height = 4;
      const context = canvas.getContext('2d');
      if (!context) return null;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 0) return true;
      }

      // Downsampling can miss sparse strokes. Only reject after native-resolution
      // confirmation; larger sources stay inconclusive to bound diagnostic work.
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      if (width <= 0 || height <= 0 || width * height > 4_194_304) return null;
      canvas.width = Math.min(128, width);
      canvas.height = Math.min(128, height);
      for (let y = 0; y < height; y += canvas.height) {
        for (let x = 0; x < width; x += canvas.width) {
          const tileWidth = Math.min(canvas.width, width - x);
          const tileHeight = Math.min(canvas.height, height - y);
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, x, y, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
          const tile = context.getImageData(0, 0, tileWidth, tileHeight).data;
          for (let i = 3; i < tile.length; i += 4) {
            if (tile[i] > 0) return true;
          }
        }
      }
      return false;
    } catch {
      // Tainted cross-origin/file canvases cannot prove that a DOM image is empty.
      return null;
    }
  }

  private applyResolvedSlotSource(
    view: SlotView,
    source: ArtworkImageSourceCandidate,
    fallbackReason: string | null,
    requestStatus: 'loaded' | 'fallback-loaded',
    dimensions: { width: number; height: number }
  ): { status: 'ready' } | { status: 'failed'; stage: 'gpu-upload' | 'visible-pixel-probe'; reason: string } {
    // Match the existing diagnostic/file-preview policy without claiming GPU proof.
    if (
      !this.hubRoomRenderer &&
      view.image &&
      shouldRunVisiblePixelProbe({
        runtimeProtocol: getRuntimeProtocol(),
        resolvedUrlType: source.resolvedUrlType,
        debugEnabled: this.diagnostics.isDebugEnabled(),
      }) &&
      this.probeSlotSourceAlpha(view.image) === false
    ) {
      return { status: 'failed', stage: 'visible-pixel-probe', reason: 'zero-alpha-source' };
    }
    const nativeAspectRatio = nativeArtworkAspect(dimensions);
    if (!Number.isFinite(nativeAspectRatio) || nativeAspectRatio <= 0) {
      return { status: 'failed', stage: 'visible-pixel-probe', reason: 'invalid-native-aspect-ratio' };
    }
    if (view.nativeAspectRatio !== null && Math.abs(view.nativeAspectRatio - nativeAspectRatio) > 1e-9) {
      this.diagnostics.warn('artwork-native-aspect-changed', 'Artwork source changed its immutable native aspect ratio', {
        slotId: view.slot.id,
        previousAspectRatio: view.nativeAspectRatio,
        nextAspectRatio: nativeAspectRatio,
      });
      return { status: 'failed', stage: 'visible-pixel-probe', reason: 'native-aspect-ratio-changed' };
    }
    const previousArtworkAspect = view.slot.artworkAspect;
    view.slot.artworkAspect = nativeAspectRatio;
    this.setSlotImageState(view, 'ready', source, fallbackReason);
    const renderFailure = this.getSlotRenderFailure(view);
    if (renderFailure) {
      // Do not commit the ratio until the decoded source has passed rendering.
      // This lets an embedded fallback be selected without poisoning the slot
      // with a source that failed GPU upload or the visible-pixel probe.
      view.slot.artworkAspect = previousArtworkAspect;
      this.setSlotImageState(view, 'missing', null, `${source.mode}:${renderFailure.stage}:${renderFailure.reason}`);
      return { status: 'failed', ...renderFailure };
    }
    view.nativeAspectRatio ??= nativeAspectRatio;
    view.nativeWidth ??= dimensions.width;
    view.nativeHeight ??= dimensions.height;
    view.slot.artworkAspect = view.nativeAspectRatio;
    view.button.dataset['nativeAspectRatio'] = view.nativeAspectRatio.toPrecision(12);
    // The renderer was synchronized while resolving the source, but the DOM
    // projection was still calculated with the manifest ratio. Reproject both
    // paths after the decoded native ratio becomes authoritative.
    this.applySlotGeometry(view.button, view.slot);
    this.inspectArtworkRuntime();
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

  private async replaceCalibrationArtwork(file: File): Promise<void> {
    const slot = this.activeCalibrationSlot;
    const view = slot ? this.slotViews.find((candidate) => candidate.slot.id === slot.id) : null;
    if (!view?.image || !slot?.artworkId) {
      this.announceCalibrationAction('Zuerst ein Bild auf einem Platz wählen.');
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const previousUrl = this.editorArtworkObjectUrls.get(slot.id);
    const probe = new Image();
    try {
      probe.src = objectUrl;
      await probe.decode();
      const width = probe.naturalWidth;
      const height = probe.naturalHeight;
      const aspect = width > 0 && height > 0 ? nativeArtworkAspect({ width, height }) : 0;
      if (!Number.isFinite(aspect) || aspect <= 0) throw new Error('invalid-image-dimensions');
      const accepted = window.confirm(
        `${slot.displayLabel} in der Vorschau durch ${file.name} ersetzen?\n\n` +
        `${width} × ${height} px · Seitenverhältnis ${aspect.toFixed(4)}\n\n` +
        'Bei „Abbrechen“ bleibt das aktuelle Bild.'
      );
      if (!accepted) {
        URL.revokeObjectURL(objectUrl);
        this.announceCalibrationAction('Ersetzen abgebrochen; das aktuelle Bild bleibt.');
        return;
      }
      view.imageLoadToken += 1;
      view.image.src = objectUrl;
      await view.image.decode();
      view.nativeWidth = width;
      view.nativeHeight = height;
      view.nativeAspectRatio = aspect;
      view.slot.artworkAspect = aspect;
      view.assetRevision = `${file.name}:${file.size}:${file.lastModified}:${width}x${height}`;
      view.imageState = 'ready';
      view.resolvedSource = null;
      view.fallbackReason = 'editor-upload-preview';
      view.button.dataset['artworkSourceState'] = 'ready';
      view.button.dataset['artworkSourceMode'] = 'editor-upload-preview';
      this.editorArtworkObjectUrls.set(slot.id, objectUrl);
      if (previousUrl) URL.revokeObjectURL(previousUrl);
      this.applySlotGeometry(view.button, view.slot);
      this.updateCalibrationArtworkInfo();
      this.renderCalibrationOverlay();
      this.updateCalibrationOutput(true);
      this.announceCalibrationAction(
        `Vorschau von ${slot.displayLabel} ersetzt: ${width} × ${height} px, Seitenverhältnis ${aspect.toFixed(4)}. Nur Vorschau, wird nicht gespeichert.`
      );
    } catch {
      URL.revokeObjectURL(objectUrl);
      this.announceCalibrationAction('Das Ersatzbild konnte nicht gelesen werden; das bisherige Bild bleibt.');
    }
  }

  private updateCalibrationArtworkInfo(): void {
    if (!this.calibrationArtworkInfo) return;
    const slot = this.activeCalibrationSlot;
    const view = slot ? this.slotViews.find((candidate) => candidate.slot.id === slot.id) : null;
    if (!slot || !view) {
      this.calibrationArtworkInfo.textContent = 'Ein Bild wählen, um Pixelmaße und Seitenverhältnis zu sehen.';
      return;
    }
    const width = view.nativeWidth ?? view.image?.naturalWidth ?? 0;
    const height = view.nativeHeight ?? view.image?.naturalHeight ?? 0;
    const aspect = view.nativeAspectRatio ?? (width > 0 && height > 0 ? nativeArtworkAspect({ width, height }) : slot.artworkAspect);
    const source = view.fallbackReason === 'editor-upload-preview' ? 'temporäre Vorschau' : 'Originaldatei';
    const physicalHeight = slot.placement.physicalHeight ?? slot.placement.mountedHeight;
    const wallRoom = this.resolution.wallById.get(slot.placement.wallId)?.room ?? null;
    const sourceRect = width > 0 && height > 0
      ? createNativeSourceRect({ width, height }, Math.max(1, physicalHeight))
      : null;
    const report = sourceRect
      ? buildArtworkRatioReport(
          { width, height },
          { width: physicalHeight * aspect, height: physicalHeight },
          sourceRect,
          view.lastUpsertResult?.fit
            ? { width: view.lastUpsertResult.fit.targetWidth, height: view.lastUpsertResult.fit.targetHeight }
            : null
        )
      : null;
    this.calibrationArtworkInfo.textContent =
      `${slot.artworkId ?? 'leer'} · ${width > 0 && height > 0 ? `${width} × ${height} px` : 'Maße werden geladen'} · ` +
      `Seitenverhältnis ${aspect.toFixed(4)} · Quellrechteck ${report?.domSource.toFixed(4) ?? '—'} · ` +
      `${report?.status === 'valid' ? 'Verhältnis korrekt' : 'Verhältnis prüfen'} · ${source}` +
      // Wall size comes from the calibrated (measured) wall, not the nominal room height.
      (wallRoom ? ` · Wand ${wallRoom.width.toFixed(2)} × ${wallRoom.height.toFixed(2)} m (kalibriert)` : '');
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
    this.applySlotGeometry(view.button, view.slot);
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
  // One view per room (page). In narrow portrait visitor mode the room is a
  // continuous horizontal panorama instead of separate wall-focus views
  // (v1.41): every artwork stays visible and tappable wherever it appears.

  private get viewCount(): number {
    return this.pageCount;
  }

  private stepView(direction: -1 | 1): void {
    const next = this.viewIndex + direction;
    if (next < 0 || next >= this.viewCount) return;
    this.viewIndex = next;
    this.applyView();
    if (this.panorama) this.setPan(0);
  }

  private goToPage(pageIndex: number, slot?: ResolvedHubSlot): void {
    const changed = this.viewIndex !== pageIndex;
    this.viewIndex = pageIndex;
    this.applyView();
    if (!this.panorama) return;
    const index = slot ? this.stripViews.findIndex((view) => view.slot.id === slot.id) : -1;
    if (index >= 0) {
      this.stripActiveIndex = index;
      const target = this.stripTargets[index] ?? 0;
      if (changed || this.element.hidden) this.setPan(target);
      else this.glidePanTo(target);
      this.syncStripState();
    } else if (changed) {
      this.setPan(0);
    }
  }

  /** Room (page) currently shown. */
  private currentPageIndex(): number {
    return this.viewIndex;
  }

  private applyView(initial = false): void {
    if (this.disposed) return;
    this.viewIndex = Math.max(0, Math.min(this.viewCount - 1, this.viewIndex));
    const pageIndex = this.viewIndex;
    this.hubRoomRenderer?.setActivePage(pageIndex);

    for (const room of this.roomLayers) {
      const roomPage = Number.parseInt(room.dataset['page'] ?? '0', 10);
      room.classList.toggle('is-active', roomPage === pageIndex);
    }

    const showPager = this.viewCount > 1;
    this.pager.hidden = !showPager;
    this.element.classList.toggle('has-pager', showPager);
    if (showPager) {
      this.pagerPrev.disabled = this.viewIndex === 0;
      this.pagerNext.disabled = this.viewIndex === this.viewCount - 1;
      this.pagerCounter.textContent = `Raum ${pageIndex + 1} / ${this.pageCount}`;
    }
    if (this.panorama) {
      this.rebuildStrip(pageIndex);
      this.setPan(this.panX);
    }
    this.applySelectionState(initial ? 'initial-view' : 'view-change');
    if (!initial) void this.decodePageImages(pageIndex);
    if (this.calibrating) this.refreshEditorPanels();
  }

  private handleNarrowChange = (): void => {
    const wasPanorama = this.panorama;
    this.narrowMode = this.narrowQuery.matches;
    this.syncPanoramaMode();
    if (wasPanorama !== this.panorama) {
      this.panX = 0;
      this.applyView();
    }
  };

  private syncPanoramaMode(): void {
    this.panorama = this.narrowMode && !this.calibrating;
    this.element.classList.toggle('is-panorama', this.panorama);
    this.strip.hidden = !this.panorama;
    if (!this.panorama) {
      this.stopPanAnimation();
      this.panDrag = null;
      this.panX = 0;
      this.visual.style.removeProperty('--hub-pan-x');
      this.stripPageIndex = -1;
      this.updateOffscreenAccessibility();
    }
  }

  // ── Phone panorama camera ────────────────────────────────────────────────

  private panLimit(): number {
    return panoramaPanLimit(this.visual.offsetWidth, this.element.clientWidth);
  }

  private setPan(pan: number, allowOverscroll = false): void {
    if (!this.panorama) return;
    const limit = this.panLimit();
    this.panX = allowOverscroll ? pan : Math.max(-limit, Math.min(limit, pan));
    this.visual.style.setProperty('--hub-pan-x', `${this.panX.toFixed(2)}px`);
    this.syncStripState();
  }

  private stopPanAnimation(): void {
    if (this.panFrame) cancelAnimationFrame(this.panFrame);
    this.panFrame = 0;
  }

  /** Momentum (and spring-back) from `velocity` px/s; settles inside the limits. */
  private runPanMomentum(velocity: number): void {
    this.stopPanAnimation();
    if (isMotionReduced()) {
      this.setPan(this.panX + velocity / 4.2);
      this.updateOffscreenAccessibility();
      return;
    }
    let currentVelocity = velocity;
    let previousAt = performance.now();
    const tick = (now: number): void => {
      const dt = Math.max(0, Math.min(0.05, (now - previousAt) / 1000));
      previousAt = now;
      const limit = this.panLimit();
      const step = stepMomentum({ position: this.panX, velocity: currentVelocity }, dt, -limit, limit);
      currentVelocity = step.velocity;
      this.setPan(step.position, !step.settled);
      if (step.settled) {
        this.panFrame = 0;
        this.updateOffscreenAccessibility();
        return;
      }
      this.panFrame = requestAnimationFrame(tick);
    };
    this.panFrame = requestAnimationFrame(tick);
  }

  private glidePanTo(target: number): void {
    const limit = this.panLimit();
    const clamped = Math.max(-limit, Math.min(limit, target));
    if (isMotionReduced()) {
      this.stopPanAnimation();
      this.setPan(clamped);
      this.updateOffscreenAccessibility();
      return;
    }
    this.runPanMomentum(velocityToReach(this.panX, clamped));
  }

  /** Photo x fraction (0 = left edge) of the slot's projected centre. */
  private slotCenterFraction(view: SlotView): number | null {
    const quad = this.projectedSlotGeometry.get(view.slot.id)?.projectedQuad;
    if (!quad || !(this.stageWidth > 0)) return null;
    const x = quad.reduce((sum, corner) => sum + corner.x, 0) / quad.length;
    return x / this.stageWidth;
  }

  private rebuildStrip(pageIndex: number): void {
    const width = this.visual.offsetWidth;
    const limit = this.panLimit();
    const entries = this.slotViews
      .filter((view) => view.slot.pageIndex === pageIndex && view.slot.artworkId && view.slot.selectable)
      .map((view) => ({ view, fraction: this.slotCenterFraction(view) }))
      .filter((entry): entry is { view: SlotView; fraction: number } => entry.fraction !== null)
      .sort((a, b) => a.fraction - b.fraction);
    this.stripTargets = entries.map((entry) => panoramaPanForFraction(entry.fraction, width, limit));
    const views = entries.map((entry) => entry.view);
    const sameViews = pageIndex === this.stripPageIndex
      && views.length === this.stripViews.length
      && views.every((view, index) => view === this.stripViews[index]);
    if (!sameViews) {
      this.stripViews = views;
      this.stripPageIndex = pageIndex;
      this.stripActiveIndex = -1;
      this.stripButtons = views.map((view, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'museum-hub__strip-item';
        button.setAttribute('aria-label', view.button.getAttribute('aria-label') ?? `Kunstwerk ${index + 1}`);
        const thumb = document.createElement('span');
        thumb.className = 'museum-hub__strip-thumb';
        thumb.setAttribute('aria-hidden', 'true');
        button.appendChild(thumb);
        button.addEventListener('click', () => this.handleStripClick(index));
        return button;
      });
      this.stripTrack.replaceChildren(...this.stripButtons);
    }
    this.stripButtons.forEach((button, index) => {
      const source = this.stripViews[index]?.image?.currentSrc || this.stripViews[index]?.image?.src || '';
      const thumb = button.firstElementChild as HTMLElement | null;
      if (thumb && source && thumb.dataset['src'] !== source) {
        thumb.dataset['src'] = source;
        thumb.style.backgroundImage = `url("${source.replace(/"/g, '%22')}")`;
      }
    });
    this.strip.hidden = !this.panorama || views.length === 0;
  }

  private syncStripState(): void {
    if (!this.panorama || this.stripButtons.length === 0) return;
    const fraction = stripFractionForPan(this.panX, this.stripTargets);
    this.stripTrack.style.transform = `translate3d(${(-(fraction + 0.5) * STRIP_ITEM_PX).toFixed(2)}px, 0, 0)`;
    const focused = this.stripActiveIndex >= 0
      ? this.stripActiveIndex
      : nearestPanoramaTarget(this.panX, this.stripTargets);
    this.stripButtons.forEach((button, index) => {
      const active = index === focused;
      button.classList.toggle('is-centered', active);
      if (active) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
      this.stripViews[index]?.button.classList.toggle('is-strip-focus', active);
    });
  }

  /** First tap glides to and selects the artwork; a second tap opens it. */
  private handleStripClick(index: number): void {
    const view = this.stripViews[index];
    if (!view || view.button.disabled) return;
    if (this.stripActiveIndex === index) {
      this.handleSlotClick(view.slot);
      return;
    }
    this.stripActiveIndex = index;
    this.setSelectedArtworkId(view.slot.artworkId, { alignPage: false, source: 'hub-strip' });
    this.glidePanTo(this.stripTargets[index] ?? this.panX);
    this.syncStripState();
    hapticTick();
  }

  /** Keyboard arrows in the panorama move artwork by artwork, then room by room. */
  private stepPanoramaArtwork(direction: -1 | 1): void {
    const current = this.stripActiveIndex >= 0
      ? this.stripActiveIndex
      : nearestPanoramaTarget(this.panX, this.stripTargets);
    const next = current + direction;
    if (next >= 0 && next < this.stripTargets.length) {
      this.stripActiveIndex = next;
      this.glidePanTo(this.stripTargets[next]!);
      this.syncStripState();
      return;
    }
    this.stepRoomFromEdge(direction);
  }

  /** Enters the neighbouring room at the matching edge (spatial continuity). */
  private stepRoomFromEdge(direction: -1 | 1): boolean {
    const next = this.viewIndex + direction;
    if (next < 0 || next >= this.viewCount) return false;
    this.stopPanAnimation();
    this.viewIndex = next;
    this.applyView();
    this.stripActiveIndex = -1;
    const limit = this.panLimit();
    this.setPan(direction > 0 ? limit : -limit);
    this.updateOffscreenAccessibility();
    hapticTick();
    return true;
  }

  /**
   * Artworks completely outside the viewport leave the tab order and the
   * accessibility tree; visibility is measured, never derived from walls.
   */
  private updateOffscreenAccessibility(): void {
    const viewportWidth = this.element.clientWidth;
    for (const view of this.slotViews) {
      let offscreen = false;
      if (this.panorama && view.slot.pageIndex === this.viewIndex) {
        const rect = view.button.getBoundingClientRect();
        const hubRect = this.element.getBoundingClientRect();
        offscreen = rect.width > 0 && (rect.right <= hubRect.left || rect.left >= hubRect.left + viewportWidth);
      }
      if (offscreen) {
        view.button.tabIndex = -1;
        view.button.setAttribute('aria-hidden', 'true');
      } else if (view.button.getAttribute('aria-hidden') === 'true') {
        view.button.removeAttribute('tabindex');
        view.button.removeAttribute('aria-hidden');
      }
    }
  }

  private handlePanPointerDown = (event: PointerEvent): void => {
    if (!this.panorama || this.calibrating) return;
    if (!event.isPrimary) {
      this.handlePanPointerCancel();
      return;
    }
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('.museum-hub__pager')) return;
    this.stopPanAnimation();
    this.panTracker.reset();
    this.panTracker.add(event.timeStamp, event.clientX, event.clientY);
    this.panDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPan: this.panX,
      startFraction: stripFractionForPan(this.panX, this.stripTargets),
      source: target?.closest('.museum-hub__strip') ? 'strip' : 'photo',
      dragging: false,
    };
  };

  private handlePanPointerMove = (event: PointerEvent): void => {
    const drag = this.panDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    this.panTracker.add(event.timeStamp, event.clientX, event.clientY);
    if (!drag.dragging) {
      if (!exceedsTapSlop(dx, dy)) return;
      if (Math.abs(dy) > Math.abs(dx) * 1.2) {
        this.panDrag = null;
        return;
      }
      drag.dragging = true;
      this.stripActiveIndex = -1;
      this.element.classList.add('is-panning', 'has-panned');
      try {
        this.element.setPointerCapture(event.pointerId);
      } catch {
        // Synthetic or already-released pointers cannot be captured.
      }
    }
    if (drag.source === 'strip' && this.stripTargets.length > 1) {
      this.setPan(panForStripFraction(drag.startFraction - dx / STRIP_ITEM_PX, this.stripTargets));
      return;
    }
    const limit = this.panLimit();
    this.setPan(rubberBandClamp(drag.startPan + dx, -limit, limit, this.element.clientWidth), true);
  };

  private handlePanPointerUp = (event: PointerEvent): void => {
    const drag = this.panDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    this.panDrag = null;
    this.element.classList.remove('is-panning');
    if (!drag.dragging) return;
    this.suppressClickUntil = performance.now() + 400;
    const velocity = this.panTracker.velocity(event.timeStamp).x;
    const limit = this.panLimit();
    if (drag.source === 'strip') {
      const fraction = stripFractionForPan(this.panX, this.stripTargets) - (velocity * 0.18) / STRIP_ITEM_PX;
      const index = Math.max(0, Math.min(this.stripTargets.length - 1, Math.round(fraction)));
      this.glidePanTo(this.stripTargets[index] ?? this.panX);
      return;
    }
    const edgeStep = panoramaEdgeRoomStep(this.panX, limit, Math.min(72, this.element.clientWidth * 0.16));
    if (edgeStep !== 0 && this.stepRoomFromEdge(edgeStep === 1 ? 1 : -1)) return;
    const snap = pickSnapTarget(this.panX, velocity, this.stripTargets, {
      softRadius: this.element.clientWidth * 0.16,
      min: -limit,
      max: limit,
    });
    this.runPanMomentum(snap === null ? velocity : velocityToReach(this.panX, snap));
  };

  private handlePanPointerCancel = (): void => {
    const drag = this.panDrag;
    this.panDrag = null;
    this.element.classList.remove('is-panning');
    if (drag?.dragging) this.runPanMomentum(0);
  };

  /** A drag that ends over an artwork must never open it. */
  private handleClickCapture = (event: MouseEvent): void => {
    if (performance.now() >= this.suppressClickUntil) return;
    this.suppressClickUntil = 0;
    event.preventDefault();
    event.stopPropagation();
  };

  private handleResize = (): void => {
    if (this.resizeRafId !== 0) return;
    this.resizeRafId = requestAnimationFrame(() => {
      this.resizeRafId = 0;
      this.updateStageScale();
      this.applyView();
      this.applyAllSlotGeometry();
      if (this.calibrating) this.applyCalibrationViewport();
      if (this.calibrating) {
        this.editorViewport?.resize(this.stageWidth, this.stageHeight);
        this.renderEditorViewportHandles();
      }
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
      if (this.editorReadOnly) return;
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      // Panel controls (tabs, lists, dialogs) keep their own arrow-key behaviour.
      if (event.target instanceof Node && this.calibrationPanel?.contains(event.target)) return;
      if (
        event.target instanceof HTMLInputElement
        || event.target instanceof HTMLSelectElement
        || event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (event.target instanceof HTMLButtonElement) {
        // Arrow keys move a focused artwork; other buttons keep native behaviour.
        const focusedView = this.slotViews.find((candidate) => candidate.button === event.target);
        if (!focusedView) return;
        if (focusedView.slot.id !== this.activeCalibrationSlotId) this.selectCalibrationSlot(focusedView.slot.id);
      }
      if (!this.activeCalibrationSlot) return;
      // Real distances: 1 cm per step, 10 cm with Shift. A held key produces
      // one undo entry (auto-repeat events do not record history).
      const step = event.shiftKey ? 0.1 : 0.01;
      this.nudgeActiveArtwork(
        event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0,
        event.key === 'ArrowUp' ? step : event.key === 'ArrowDown' ? -step : 0,
        !event.repeat
      );
      event.preventDefault();
      return;
    }
    if (event.key === 'ArrowLeft') {
      if (this.panorama) this.stepPanoramaArtwork(-1);
      else this.stepView(-1);
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      if (this.panorama) this.stepPanoramaArtwork(1);
      else this.stepView(1);
      event.preventDefault();
    }
  };

  /**
   * Swipe navigation tracks only the primary pointer that started the gesture
   * (like CanvasInteraction): a second finger, a non-left mouse button, or a
   * cancelled gesture can never trigger a room change.
   */
  private handleSwipeStart = (event: PointerEvent): void => {
    if (this.panorama) return;
    if (!event.isPrimary) {
      this.handleSwipeCancel();
      return;
    }
    if (this.calibrating || (event.pointerType === 'mouse' && event.button !== 0)) return;
    this.swipePointerId = event.pointerId;
    this.swipeStartX = event.clientX;
    this.swipeStartY = event.clientY;
  };

  private handleSwipeEnd = (event: PointerEvent): void => {
    if (this.swipeStartX === null || this.swipeStartY === null || event.pointerId !== this.swipePointerId) return;
    const dx = event.clientX - this.swipeStartX;
    const dy = event.clientY - this.swipeStartY;
    this.handleSwipeCancel();
    if (this.calibrating || Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    this.stepView(dx < 0 ? 1 : -1);
  };

  private handleSwipeCancel = (): void => {
    this.swipePointerId = null;
    this.swipeStartX = null;
    this.swipeStartY = null;
  };

  // ── Calibration mode (?hubCalibrate=1) ───────────────────────────────────

  private buildCalibrationOverlay(): void {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('museum-hub__calibration-svg');
    svg.setAttribute('viewBox', `0 0 ${this.stageWidth} ${this.stageHeight}`);
    svg.setAttribute('aria-hidden', 'true');
    this.stage.appendChild(svg);
    this.calibrationSvg = svg;
    this.editorViewport = new EditorViewport({
      width: this.stageWidth,
      height: this.stageHeight,
      margin: 64,
    });
    const viewportSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    viewportSvg.classList.add('museum-hub__editor-viewport');
    viewportSvg.setAttribute('viewBox', `0 0 ${this.stageWidth} ${this.stageHeight}`);
    viewportSvg.setAttribute('aria-label', 'Wandecken am Eingang');
    viewportSvg.style.pointerEvents = 'none';
    this.stage.appendChild(viewportSvg);
    this.editorViewportSvg = viewportSvg;
    this.editorViewport.frameAllWalls(
      this.resolution.walls
        .filter((wall) => wall.room && wall.id !== 'wall-rear')
        .map((wall) => wall.room!)
    );
    this.renderEditorViewportHandles();
  }

  private buildCalibrationPanel(hub: HTMLElement): void {
    const panel = document.createElement('div');
    panel.className = 'museum-hub__calibration';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', 'calibration-title');
    this.calibrationPanel = panel;
    this.onlineEditor = new OnlineEditor({
      configJson: () => JSON.stringify(this.buildCurrentCalibrationConfig(), null, 2),
      backgroundSrc: () => this.resolution.background.src,
      backgroundAspect: () => this.resolution.background.aspect,
      exportValid: () => this.calibrationExportValid,
      knownArtworkIds: () => this.artworks.map((artwork) => artwork.id),
      addArtwork: (entry) => this.addUploadedArtwork(entry),
      removeArtwork: (id) => this.removeUploadedArtwork(id),
      useBackground: (option) => this.useEditorBackground(option),
      applyConfig: (json) => {
        this.recordCalibrationHistory();
        this.applyCalibrationSnapshot(json);
      },
      setReadOnly: (readOnly) => this.setEditorReadOnly(readOnly),
      announce: (message) => this.announceCalibrationAction(message),
      openSaveTab: () => this.editorTabs?.select('save'),
    });

    const makeAction = (
      text: string,
      action: () => void,
      container: HTMLElement,
      className = 'museum-hub__calibration-action'
    ): HTMLButtonElement => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = className;
      button.textContent = text;
      button.addEventListener('click', action);
      container.appendChild(button);
      return button;
    };
    const makeSection = (titleText: string, id: string): HTMLElement => {
      const section = document.createElement('section');
      section.className = 'museum-hub__editor-section';
      section.setAttribute('aria-labelledby', id);
      const title = document.createElement('h3');
      title.id = id;
      title.textContent = titleText;
      section.appendChild(title);
      return section;
    };
    const makeRow = (container: HTMLElement): HTMLDivElement => {
      const row = document.createElement('div');
      row.className = 'museum-hub__editor-actions';
      container.appendChild(row);
      return row;
    };

    // ── Header, first-time guide, and room switcher ─────────────────────────
    const header = document.createElement('div');
    header.className = 'museum-hub__calibration-header';
    const heading = document.createElement('h2');
    heading.id = 'calibration-title';
    heading.className = 'museum-hub__calibration-title';
    heading.textContent = 'Bilder-Editor';
    const helpButton = makeAction('?', () => this.showEditorGuide(true), header, 'museum-hub__editor-icon-button');
    helpButton.setAttribute('aria-label', 'Kurzanleitung anzeigen');
    header.prepend(heading);

    const guide = document.createElement('section');
    guide.className = 'museum-hub__editor-guide';
    guide.setAttribute('aria-labelledby', 'editor-guide-title');
    guide.hidden = true;
    const guideTitle = document.createElement('h3');
    guideTitle.id = 'editor-guide-title';
    guideTitle.textContent = 'So geht es';
    const guideSteps = document.createElement('ol');
    for (const text of [
      'Raum wählen oder mit „+ Neuer Raum“ anlegen.',
      'Im Bereich „Bilder“ Kunstwerke auf die Plätze ziehen und im Bild verschieben.',
      'Im Bereich „Speichern“ die Konfiguration herunterladen.',
    ]) {
      const item = document.createElement('li');
      item.textContent = text;
      guideSteps.appendChild(item);
    }
    guide.append(guideTitle, guideSteps);
    makeAction('Verstanden', () => this.hideEditorGuide(), guide, 'museum-hub__calibration-action is-primary');
    this.editorGuide = guide;

    this.roomBar = new EditorRoomBar(
      {
        onSelect: (pageIndex) => this.goToRoom(pageIndex),
        onAdd: () => this.addRoom(false),
        onDuplicate: () => this.addRoom(true),
        onDelete: (target) => this.deleteCurrentRoom(target),
        onRename: (name) => this.renameCurrentRoom(name),
        onMove: (delta) => this.moveCurrentRoom(delta),
      },
      HUB_ROOM_NAME_MAX_LENGTH
    );

    // ── Tab "Raum": rooms, wall check, wall tools ───────────────────────────
    const roomTab = document.createElement('div');
    roomTab.appendChild(this.roomBar.manager);

    const wallSection = makeSection('Wände prüfen', 'editor-wall-title');
    const wallHint = document.createElement('p');
    wallHint.className = 'museum-hub__editor-hint';
    wallHint.textContent = 'Alle Räume teilen dieselben Wände und grünen Flächen. Bilder müssen im grünen Bereich hängen.';
    const selectLabel = document.createElement('label');
    selectLabel.className = 'museum-hub__calibration-label';
    selectLabel.textContent = 'Wand';
    const select = document.createElement('select');
    select.className = 'museum-hub__calibration-select';
    for (const wall of this.resolution.walls) {
      const option = document.createElement('option');
      option.value = wall.id;
      option.textContent = wallLabel(wall.id);
      select.appendChild(option);
    }
    if (this.entranceBoundaryQuad) {
      const option = document.createElement('option');
      option.value = 'wall-rear';
      option.textContent = 'Eingangsbereich (nur Raumform)';
      select.appendChild(option);
    }
    if (this.activeCalibrationWallId) select.value = this.activeCalibrationWallId;
    select.addEventListener('change', () => {
      this.activeCalibrationWallId = select.value;
      this.calibrationRoomBoundaryVisible = select.value === 'wall-rear';
      this.calibrationEditMode = this.calibrationRoomBoundaryVisible ? 'room-boundary' : 'wall';
      // Selection is deliberately independent from camera framing. The
      // projected calibration quad is the only authoritative wall surface.
      this.renderCalibrationOverlay();
      this.syncEditorToolState();
      this.announceCalibrationAction(`Ausgewählt: ${wallLabel(select.value)}.`);
    });
    selectLabel.appendChild(select);
    this.calibrationWallSelect = select;

    const confirmLabel = document.createElement('label');
    confirmLabel.className = 'museum-hub__editor-check';
    const confirmInput = document.createElement('input');
    confirmInput.type = 'checkbox';
    confirmInput.addEventListener('change', () => this.setActiveMountingZoneConfirmed(confirmInput.checked));
    confirmLabel.append(confirmInput, 'Grüne Fläche geprüft ✓');
    this.zoneConfirmedInput = confirmInput;

    const toolRow = makeRow(wallSection);
    toolRow.setAttribute('role', 'group');
    toolRow.setAttribute('aria-label', 'Wandwerkzeuge');
    const wallTool = makeAction('Wandecken bearbeiten', () => this.toggleEditorTool('wall'), toolRow);
    wallTool.title = 'Zeigt die orangen Eckpunkte. Ecke ziehen formt die Wand, Kante ziehen verschiebt die ganze Wand.';
    const zoneTool = makeAction('Grüne Fläche bearbeiten', () => this.toggleEditorTool('mounting-zone'), toolRow);
    zoneTool.title = 'Zeigt die grünen Eckpunkte des Bereichs, in dem Bilder hängen dürfen.';
    makeAction('Zurücksetzen', () => this.resetSelectedCalibrationBoundary(), toolRow);
    this.editorToolButtons.set('wall', wallTool);
    this.editorToolButtons.set('mounting-zone', zoneTool);

    const viewGroup = document.createElement('div');
    viewGroup.className = 'museum-hub__editor-segmented';
    viewGroup.setAttribute('role', 'group');
    viewGroup.setAttribute('aria-label', 'Ansicht');
    const viewLabel = document.createElement('span');
    viewLabel.className = 'museum-hub__calibration-label';
    viewLabel.textContent = 'Ansicht:';
    viewGroup.appendChild(viewLabel);
    const viewRoom = makeAction('Ganzer Raum', () => this.setEditorView('room'), viewGroup);
    const viewWall = makeAction('Ausgewählte Wand', () => this.setEditorView('wall'), viewGroup);
    this.editorViewButtons.set('room', viewRoom);
    this.editorViewButtons.set('wall', viewWall);
    wallSection.append(wallHint, selectLabel, confirmLabel, toolRow, viewGroup);

    const roomAdvanced = document.createElement('details');
    roomAdvanced.className = 'museum-hub__calibration-advanced';
    const roomAdvancedSummary = document.createElement('summary');
    roomAdvancedSummary.textContent = 'Erweitert';
    roomAdvanced.appendChild(roomAdvancedSummary);
    const advancedRow = makeRow(roomAdvanced);
    const safeTool = makeAction('Sicherheitsbereich bearbeiten', () => this.toggleEditorTool('safe'), advancedRow);
    const entranceTool = makeAction('Eingangsbereich bearbeiten', () => {
      this.calibrationRoomBoundaryVisible = true;
      if (this.calibrationWallSelect) this.calibrationWallSelect.value = 'wall-rear';
      this.activeCalibrationWallId = 'wall-rear';
      this.toggleEditorTool('room-boundary', true);
      this.announceCalibrationAction('Eingangsbereich: nur Raumform, hier hängen keine Bilder.');
    }, advancedRow);
    this.editorToolButtons.set('safe', safeTool);
    this.editorToolButtons.set('room-boundary', entranceTool);
    const boundaryToggle = makeAction('Raumgrenze anzeigen', () => {
      this.calibrationRoomBoundaryVisible = !this.calibrationRoomBoundaryVisible;
      boundaryToggle.setAttribute('aria-pressed', String(this.calibrationRoomBoundaryVisible));
      this.renderCalibrationOverlay();
      this.announceCalibrationAction(
        this.calibrationRoomBoundaryVisible ? 'Raumgrenze wird angezeigt.' : 'Raumgrenze ausgeblendet.'
      );
    }, advancedRow);
    boundaryToggle.setAttribute('aria-pressed', 'false');
    makeAction('Gesamte Geometrie zurücksetzen', () => this.resetCalibration(), advancedRow);

    const legend = document.createElement('section');
    legend.className = 'museum-hub__calibration-legend';
    legend.setAttribute('aria-labelledby', 'calibration-legend-title');
    const legendTitle = document.createElement('h4');
    legendTitle.id = 'calibration-legend-title';
    legendTitle.textContent = 'Was das Bild zeigt';
    legend.appendChild(legendTitle);
    const legendItems: readonly [string, string, string][] = [
      ['wall-corner', 'Orange Punkte', 'eine Wandecke verschieben.'],
      ['wall-edge', 'Orange Kanten', 'die ganze Wand verschieben.'],
      ['safe-area', 'Blaue Fläche', 'Sicherheitsbereich.'],
      ['mounting-area', 'Grüne Fläche', 'hier dürfen Bilder hängen.'],
      ['entrance-boundary', 'Violette Fläche', 'Eingangsbereich, nur Raumform.'],
    ];
    for (const [kind, label, description] of legendItems) {
      const item = document.createElement('div');
      item.className = `museum-hub__calibration-legend-item museum-hub__calibration-legend-item--${kind}`;
      const swatch = document.createElement('span');
      swatch.className = 'museum-hub__calibration-legend-swatch';
      swatch.setAttribute('aria-hidden', 'true');
      const text = document.createElement('span');
      const strong = document.createElement('strong');
      strong.textContent = `${label}: `;
      text.append(strong, description);
      item.append(swatch, text);
      legend.appendChild(item);
    }
    roomAdvanced.append(legend, this.buildBackgroundControls());
    roomTab.append(wallSection, roomAdvanced);
    const previewArtwork = this.artworks[0] ?? null;
    const previewArtworkSource = previewArtwork
      ? resolveArtworkImageSources(this.resolution.artworkSourceById.get(previewArtwork.id) ?? null).primary?.resolvedUrl ?? ''
      : '';
    this.galleryRoomEditor = new EditorGalleryRoomViews({
      views: this.resolution.galleryRoomViews,
      artwork: previewArtwork,
      artworkSrc: previewArtworkSource,
      resolveBackground: resolveBackgroundUrl,
      onHistory: () => this.recordCalibrationHistory(),
      onChange: (views) => {
        this.resolution.galleryRoomViews = views;
        this.updateCalibrationOutput(true);
      },
    });
    roomTab.appendChild(this.galleryRoomEditor.element);

    // ── Tab "Bilder": places, selected artwork, library ────────────────────
    const artworkTab = document.createElement('div');
    this.placementController = new PlacementController({
      currentPlaces: () => this.currentPlacementPlaces(),
      artworks: () => this.placementArtworks(),
      sceneElement: (slotId) => {
        const view = this.slotViews.find((candidate) => candidate.slot.id === slotId);
        return view && view.slot.pageIndex === this.currentPageIndex() ? view.button : null;
      },
      assign: (slotId, artworkId) => this.assignArtwork(slotId, artworkId),
      unplace: (artworkId) => {
        const slotId = this.slotViews.find((view) => view.slot.artworkId === artworkId)?.slot.id;
        if (slotId) this.assignArtwork(slotId, null);
      },
      selectPlace: (slotId) => this.selectCalibrationSlot(slotId),
      placeInNewRoom: (artworkId) => this.placeArtworkInNewRoom(artworkId),
      showArtwork: (artworkId) => {
        const view = this.slotViews.find((candidate) => candidate.slot.artworkId === artworkId);
        if (!view) return;
        this.selectCalibrationSlot(view.slot.id);
        view.button.focus({ preventScroll: true });
      },
      announce: (message) => this.announceCalibrationAction(message),
    });
    this.placementController.onChange(() => this.artworkLibrary?.syncPlacementState());
    this.editorToast = new EditorToast();
    this.element.appendChild(this.editorToast.element);
    this.artworkLibrary = new EditorArtworkLibrary({
      onAutoFill: () => this.autoFillCurrentRoom(),
    }, this.placementController);

    const detail = document.createElement('section');
    detail.className = 'museum-hub__editor-section museum-hub__editor-detail';
    detail.setAttribute('aria-labelledby', 'editor-detail-title');
    const detailTitle = document.createElement('h3');
    detailTitle.id = 'editor-detail-title';
    const detailBody = document.createElement('p');
    detailBody.className = 'museum-hub__editor-hint';
    this.editorDetailTitle = detailTitle;
    this.editorDetailBody = detailBody;

    const numericGrid = document.createElement('div');
    numericGrid.className = 'museum-hub__calibration-numeric-grid';
    const numericFields: readonly [string, string, number, number, number][] = [
      ['horizontalPosition', 'Von links (m)', 0, 20, 0.01],
      ['centerHeight', 'Höhe der Bildmitte (m)', 0, 8, 0.01],
      ['physicalHeight', 'Bildhöhe (m)', 0.04, 8, 0.01],
      ['mountingGap', 'Wandabstand (cm)', 0.1, 3, 0.1],
    ];
    for (const [field, labelText, min, max, step] of numericFields) {
      const label = document.createElement('label');
      label.className = 'museum-hub__calibration-number';
      label.textContent = labelText;
      const input = document.createElement('input');
      input.type = 'number';
      input.inputMode = 'decimal';
      input.min = String(min);
      input.max = String(max);
      input.step = String(step);
      input.addEventListener('change', () => this.applyCalibrationNumber(field, input.valueAsNumber));
      label.appendChild(input);
      numericGrid.appendChild(label);
      this.calibrationFields.set(field, input);
    }
    const sizeHint = document.createElement('p');
    sizeHint.className = 'museum-hub__editor-hint';
    sizeHint.textContent = 'Die Breite folgt dem Bildformat.';

    const detailActions = document.createElement('div');
    detailActions.className = 'museum-hub__editor-actions';
    makeAction('Im grünen Bereich zentrieren', () => this.centerActiveSlotInMountingZone(), detailActions);
    this.removeArtworkButton = makeAction('Bild entfernen', () => {
      const slot = this.activeCalibrationSlot;
      if (slot?.artworkId) this.assignArtwork(slot.id, null);
    }, detailActions);
    const artworkUpload = document.createElement('label');
    artworkUpload.className = 'museum-hub__calibration-action museum-hub__calibration-import';
    artworkUpload.textContent = 'Bild ersetzen (Vorschau)';
    artworkUpload.title = 'Nur zur Vorschau im Editor; die Datei im Ordner customer-artworks bleibt unverändert.';
    const artworkInput = document.createElement('input');
    artworkInput.type = 'file';
    artworkInput.accept = 'image/*';
    artworkInput.className = 'museum-hub__file-input';
    artworkInput.addEventListener('change', () => {
      const file = artworkInput.files?.[0];
      if (file) void this.replaceCalibrationArtwork(file);
      artworkInput.value = '';
    });
    artworkUpload.appendChild(artworkInput);
    detailActions.appendChild(artworkUpload);

    const artworkDetails = document.createElement('details');
    artworkDetails.className = 'museum-hub__calibration-advanced';
    const artworkDetailsSummary = document.createElement('summary');
    artworkDetailsSummary.textContent = 'Bilddetails';
    const artworkInfo = document.createElement('p');
    artworkInfo.className = 'museum-hub__calibration-artwork-info';
    artworkInfo.textContent = 'Bild auswählen, um Pixelmaße und Seitenverhältnis zu sehen.';
    this.calibrationArtworkInfo = artworkInfo;
    artworkDetails.append(artworkDetailsSummary, artworkInfo);
    detail.append(detailTitle, detailBody, numericGrid, sizeHint, detailActions, artworkDetails);
    artworkTab.append(this.artworkLibrary.places, detail, this.onlineEditor.uploadSection, this.artworkLibrary.library);

    // ── Tab "Speichern" ──────────────────────────────────────────────────────
    this.saveTab = new EditorSaveTab({
      onDownload: () => this.downloadCalibrationJson(),
      onCopy: () => void this.copyCalibrationJson(),
      onImport: (file) => void this.importCalibrationFile(file),
      onRestore: () => this.restoreLastValidCalibrationSnapshot(),
      onDiagnostics: () => this.downloadArtworkDiagnostics(),
      onAutoPlaceChange: (enabled) => this.setAutoPlaceUnmapped(enabled),
      onIssueSelect: (issue) => this.openCalibrationIssue(issue),
    });
    this.saveTab.element.prepend(this.onlineEditor.publishSection);

    this.editorTabs = createEditorTabs('museum-hub-editor', 'Editor-Bereiche', [
      { id: 'room', label: 'Raum', panel: roomTab },
      { id: 'artworks', label: 'Bilder', panel: artworkTab },
      { id: 'save', label: 'Speichern', panel: this.saveTab.element },
    ]);
    this.editorTabs.select('artworks');

    // ── Always-visible bottom bar ───────────────────────────────────────────
    const bottomBar = document.createElement('div');
    bottomBar.className = 'museum-hub__editor-bottom';
    const actionStatus = document.createElement('p');
    actionStatus.className = 'museum-hub__calibration-action-status';
    actionStatus.setAttribute('role', 'status');
    actionStatus.setAttribute('aria-live', 'polite');
    const bottomActions = document.createElement('div');
    bottomActions.className = 'museum-hub__editor-actions';
    this.calibrationUndoButton = makeAction('↶ Rückgängig', () => this.undoCalibration(), bottomActions);
    this.calibrationRedoButton = makeAction('↷ Wiederholen', () => this.redoCalibration(), bottomActions);
    this.calibrationGuideToggle = makeAction('Hilfslinien aus', () => {
      this.calibrationGuidesVisible = !this.calibrationGuidesVisible;
      this.calibrationGuideToggle!.textContent = this.calibrationGuidesVisible ? 'Hilfslinien aus' : 'Hilfslinien ein';
      this.calibrationGuideToggle!.setAttribute('aria-pressed', String(!this.calibrationGuidesVisible));
      this.calibrationSvg?.classList.toggle('is-guides-hidden', !this.calibrationGuidesVisible);
    }, bottomActions);
    this.calibrationGuideToggle.setAttribute('aria-pressed', 'false');
    this.editorStatusButton = makeAction('Status', () => this.editorTabs?.select('save', true), bottomActions, 'museum-hub__editor-status');
    bottomBar.append(actionStatus, bottomActions);

    panel.append(header, guide, this.roomBar.switcher, this.editorTabs.list, ...this.editorTabs.panels, bottomBar);
    hub.appendChild(panel);
    this.calibrationOutput = this.saveTab.output;
    this.calibrationActionStatus = actionStatus;
    this.calibrationCopyButton = this.saveTab.copyButton;
    this.calibrationDownloadButton = this.saveTab.downloadButton;
    this.editorEditablePanels = [roomTab, artworkTab, bottomActions];
    this.initialCalibrationSnapshot = JSON.stringify(this.buildCurrentCalibrationConfig(), null, 2);
    void this.onlineEditor.init(this.initialCalibrationSnapshot);
    const first = this.firstSlotOfPage(this.currentPageIndex());
    if (first) this.selectCalibrationSlot(first.slot.id);
    else this.syncCalibrationControls();
    this.syncEditorToolState();
    this.showEditorGuide(false);
    actionStatus.textContent = `${this.currentRoomLabel()} von ${this.pageCount} geöffnet.`;
  }

  private buildBackgroundControls(): HTMLElement {
    const backgroundControls = document.createElement('div');
    backgroundControls.className = 'museum-hub__calibration-background';
    const librarySelect = document.createElement('select');
    librarySelect.className = 'museum-hub__calibration-select museum-hub__background-library';
    const libraryLabel = document.createElement('label');
    libraryLabel.className = 'museum-hub__calibration-label';
    libraryLabel.textContent = 'Hintergrund';
    libraryLabel.appendChild(librarySelect);
    const backgroundLabel = document.createElement('label');
    backgroundLabel.className = 'museum-hub__calibration-label';
    backgroundLabel.textContent = 'Neuen Hintergrund vom Computer wählen';
    const backgroundInput = document.createElement('input');
    backgroundInput.type = 'file';
    backgroundInput.accept = 'image/png,image/jpeg,image/webp';
    backgroundInput.className = 'museum-hub__background-input';
    const backgroundInfo = document.createElement('span');
    backgroundInfo.className = 'museum-hub__calibration-background-info';
    backgroundInfo.setAttribute('role', 'status');
    const fitSelect = document.createElement('select');
    fitSelect.className = 'museum-hub__calibration-select';
    fitSelect.setAttribute('aria-label', 'Einpassung des Referenzbilds');
    for (const fit of ['contain', 'cover'] as const) {
      const option = document.createElement('option');
      option.value = fit;
      option.textContent = fit === 'contain' ? 'Bild vollständig zeigen' : 'Fläche vollständig füllen';
      fitSelect.appendChild(option);
    }
    fitSelect.value = this.resolution.background.fit ?? 'contain';
    const resetBackground = document.createElement('button');
    resetBackground.type = 'button';
    resetBackground.className = 'museum-hub__calibration-action';
    resetBackground.textContent = 'Hintergrund zurücksetzen';
    const updateBackgroundInfo = (): void => {
      const { src, width = 0, height = 0 } = this.resolution.background;
      const pending = this.onlineEditor?.pendingBackgroundUrl(src)
        ? this.onlineEditor.desktopMode ? ' · Wird mit gespeichert' : ' · Wird mit veröffentlicht'
        : '';
      backgroundInfo.textContent = width > 0 && height > 0
        ? `${src} · ${width}×${height}px · ${(width / height).toFixed(3)}${pending}`
        : src;
    };
    const fillLibrary = (): void => {
      const options = this.onlineEditor?.backgroundOptions() ?? [];
      const current = this.resolution.background.src;
      librarySelect.replaceChildren();
      for (const entry of options) {
        const option = document.createElement('option');
        option.value = entry.src;
        option.textContent = `${entry.src.replace(/^Backgrounds\//, '')}${entry.pending ? ' (neu)' : ''}`;
        librarySelect.appendChild(option);
      }
      if (!options.some((entry) => entry.src === current)) {
        const option = document.createElement('option');
        option.value = current;
        option.textContent = `${current.replace(/^Backgrounds\//, '')} (fehlt im Projekt)`;
        librarySelect.prepend(option);
      }
      librarySelect.value = current;
      libraryLabel.hidden = options.length === 0;
      updateBackgroundInfo();
    };
    this.refreshBackgroundControls = fillLibrary;
    fillLibrary();
    librarySelect.addEventListener('change', () => {
      const option = this.onlineEditor?.backgroundOptions().find((entry) => entry.src === librarySelect.value);
      if (option) this.useEditorBackground(option);
    });
    backgroundInput.addEventListener('change', () => {
      const file = backgroundInput.files?.[0];
      backgroundInput.value = '';
      if (!file || !this.onlineEditor) return;
      backgroundInfo.textContent = `${file.name} wird vorbereitet…`;
      void this.onlineEditor.uploadBackground(file).then(
        (message) => {
          fillLibrary();
          backgroundInfo.textContent = message;
        },
        () => {
          fillLibrary();
          backgroundInfo.textContent = `${file.name} konnte nicht gelesen werden. Bitte ein JPG-, PNG- oder WebP-Bild wählen.`;
        }
      );
    });
    fitSelect.addEventListener('change', () => {
      this.resolution.background.fit = fitSelect.value as 'contain' | 'cover';
      this.backgroundImage.style.objectFit = this.resolution.background.fit;
      this.updateCalibrationOverlayGeometry();
      this.updateCalibrationOutput(true);
    });
    resetBackground.addEventListener('click', () => {
      if (this.editorBackgroundObjectUrl) URL.revokeObjectURL(this.editorBackgroundObjectUrl);
      this.editorBackgroundObjectUrl = null;
      for (const objectUrl of this.editorArtworkObjectUrls.values()) URL.revokeObjectURL(objectUrl);
      this.editorArtworkObjectUrls.clear();
      this.recordCalibrationHistory();
      this.resolution.background = { ...this.defaultBackground };
      backgroundInput.value = '';
      this.backgroundImage.src = resolveBackgroundUrl(this.defaultBackgroundSrc);
      this.backgroundImage.style.objectFit = this.resolution.background.fit ?? 'contain';
      this.element.style.setProperty('--hub-aspect', String(this.resolution.background.aspect));
      fitSelect.value = this.resolution.background.fit ?? 'contain';
      fillLibrary();
      this.updateCalibrationOverlayGeometry();
      this.updateCalibrationOutput(true);
    });
    backgroundLabel.appendChild(backgroundInput);
    const fitLabel = document.createElement('label');
    fitLabel.className = 'museum-hub__calibration-label';
    fitLabel.textContent = 'Einpassung';
    fitLabel.appendChild(fitSelect);
    backgroundControls.append(libraryLabel, backgroundLabel, fitLabel, backgroundInfo, resetBackground);
    return backgroundControls;
  }

  private refreshBackgroundControls: (() => void) | null = null;

  /** Switches the editor background (library entry or pending upload). */
  private useEditorBackground(option: BackgroundOption): void {
    if (!(option.width > 0 && option.height > 0)) return;
    this.recordCalibrationHistory();
    this.resolution.background = {
      ...this.resolution.background,
      src: option.src,
      aspect: option.width / option.height,
      width: option.width,
      height: option.height,
    };
    setResolvedBackgroundSource(this.backgroundImage, option.url ?? resolveBackgroundUrl(option.src));
    this.backgroundImage.style.objectFit = this.resolution.background.fit ?? 'contain';
    this.element.style.setProperty('--hub-aspect', String(this.resolution.background.aspect));
    this.updateCalibrationOverlayGeometry();
    this.updateCalibrationOutput(true);
    this.refreshBackgroundControls?.();
  }

  /** Adds an uploaded (not yet published) artwork to the editor library. */
  private addUploadedArtwork(entry: PendingArtwork): void {
    if (this.artworks.some((artwork) => artwork.id === entry.id)) return;
    const artwork: Artwork = {
      id: entry.id,
      title: entry.title,
      subtitle: '',
      description: '',
      year: new Date().getFullYear(),
      medium: '',
      image: entry.objectUrl,
      dimensions: { width: entry.width, height: entry.height },
      alt: entry.title,
      credit: entry.credit,
      tags: [],
    };
    this.artworks = [...this.artworks, artwork];
    this.syncArtworkCatalog();
  }

  /** Removes an uploaded artwork again, including any place showing it. */
  private removeUploadedArtwork(id: string): void {
    if (!this.artworks.some((artwork) => artwork.id === id)) return;
    const slotId = this.resolution.artworkToSlot.get(id);
    if (slotId) this.assignArtwork(slotId, null);
    this.artworks = this.artworks.filter((artwork) => artwork.id !== id);
    this.syncArtworkCatalog();
  }

  private syncArtworkCatalog(): void {
    const imageById = new Map<string, string>();
    const sourceById = new Map<string, MuseumHubResolution['artworkSourceById'] extends ReadonlyMap<string, infer V> ? V : never>();
    for (const artwork of this.artworks) {
      imageById.set(artwork.id, artwork.image);
      sourceById.set(artwork.id, {
        image: artwork.image,
        webglImage: artwork.webglImage ?? null,
        dimensions: artwork.dimensions,
        ...(artwork.imageSourceContext ? { imageSourceContext: artwork.imageSourceContext } : {}),
      });
    }
    this.resolution.artworkCatalog = this.artworks.map((artwork, index) => ({
      id: artwork.id,
      title: artwork.title,
      index,
      aspect: artwork.dimensions.height > 0 ? artwork.dimensions.width / artwork.dimensions.height : 1,
    }));
    this.resolution.artworkImageById = imageById;
    this.resolution.artworkSourceById = sourceById;
    this.updateCalibrationOutput(false);
  }

  /** Without a login the online editor is a read-only preview. */
  private setEditorReadOnly(readOnly: boolean): void {
    this.editorReadOnly = readOnly;
    this.element.classList.toggle('is-editor-readonly', readOnly);
    for (const element of [this.visual, ...this.editorEditablePanels]) {
      element.inert = readOnly;
    }
    if (readOnly) this.handleCalibrationBlur();
  }

  // ── Editor tools, view, and guide ─────────────────────────────────────────

  /** Wall corner/edge handles are only interactive while wall editing is on. */
  private isWallCornerEditing(): boolean {
    return this.calibrationEditMode === 'wall' && this.wallEditingEnabled;
  }

  private toggleEditorTool(tool: 'wall' | 'safe' | 'mounting-zone' | 'room-boundary', forceOn = false): void {
    const active = tool === 'wall' ? this.wallEditingEnabled : this.calibrationEditMode === tool;
    const enable = forceOn || !active;
    if (this.activeCalibrationWallId === 'wall-rear' && tool !== 'room-boundary' && enable) {
      // Rendered-wall tools need a rendered wall; fall back to the artwork's wall.
      this.activeCalibrationWallId = this.activeCalibrationSlot?.placement.wallId ?? this.resolution.walls[0]?.id ?? null;
      this.calibrationRoomBoundaryVisible = false;
      if (this.calibrationWallSelect && this.activeCalibrationWallId) this.calibrationWallSelect.value = this.activeCalibrationWallId;
    }
    this.calibrationEditMode = enable ? tool : 'wall';
    this.wallEditingEnabled = enable && tool === 'wall';
    if (tool === 'room-boundary') this.calibrationRoomBoundaryVisible = enable;
    this.renderCalibrationOverlay();
    this.renderEditorViewportHandles();
    this.syncEditorToolState();
    const wallName = wallLabel(this.activeCalibrationWallId ?? '');
    const messages: Record<typeof tool, string> = {
      wall: `Wandecken bearbeiten: ${wallName}. Orange Ecke ziehen formt die Wand, Kante ziehen verschiebt sie.`,
      'mounting-zone': `Grüne Fläche bearbeiten: ${wallName}. Grüne Punkte ziehen.`,
      safe: `Sicherheitsbereich bearbeiten: ${wallName}. Blaue Punkte ziehen.`,
      'room-boundary': 'Eingangsbereich bearbeiten: violette Punkte ziehen.',
    };
    this.announceCalibrationAction(enable ? messages[tool] : 'Bearbeitung beendet. Bilder können verschoben werden.');
    if (enable && (tool === 'wall' || tool === 'room-boundary')) this.focusCalibrationWall();
  }

  private syncEditorToolState(): void {
    for (const [tool, button] of this.editorToolButtons) {
      const active = tool === 'wall' ? this.wallEditingEnabled : this.calibrationEditMode === tool;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-active', active);
    }
    const wall = this.activeCalibrationWallId ? this.resolution.wallById.get(this.activeCalibrationWallId) : null;
    if (this.zoneConfirmedInput) {
      this.zoneConfirmedInput.checked = wall?.mountingZoneConfirmed === true;
      this.zoneConfirmedInput.disabled = !wall;
    }
    this.element.classList.toggle('is-wall-editing', this.wallEditingEnabled);
  }

  private setEditorView(mode: 'room' | 'wall'): void {
    if (mode === 'wall' && this.activeCalibrationWallId && this.activeCalibrationWallId !== 'wall-rear') {
      this.fitCalibrationWallsToView(this.activeCalibrationWallId ?? undefined);
    } else {
      this.fitCalibrationWallsToView();
      mode = 'room';
    }
    this.applyAllSlotGeometry();
    this.renderCalibrationOverlay();
    this.renderEditorViewportHandles();
    for (const [key, button] of this.editorViewButtons) {
      button.setAttribute('aria-pressed', String(key === mode));
      button.classList.toggle('is-active', key === mode);
    }
    this.announceCalibrationAction(mode === 'wall' ? `Ansicht: ${wallLabel(this.activeCalibrationWallId ?? '')}.` : 'Ansicht: ganzer Raum.');
  }

  private static readonly GUIDE_STORAGE_KEY = 'freyraum.placementEditor.guideSeen';

  private showEditorGuide(force: boolean): void {
    if (!this.editorGuide) return;
    let seen = false;
    try {
      seen = window.localStorage.getItem(MainMuseumHub.GUIDE_STORAGE_KEY) === '1';
    } catch {
      seen = false;
    }
    if (!force && seen) return;
    this.editorGuide.hidden = false;
    if (force) this.editorGuide.querySelector<HTMLButtonElement>('button')?.focus();
  }

  private hideEditorGuide(): void {
    if (!this.editorGuide) return;
    this.editorGuide.hidden = true;
    try {
      window.localStorage.setItem(MainMuseumHub.GUIDE_STORAGE_KEY, '1');
    } catch {
      // Storage can be unavailable for file:// pages; the guide then shows again next time.
    }
    this.calibrationPanel?.querySelector<HTMLButtonElement>('.museum-hub__editor-icon-button')?.focus();
  }

  private startSlotCalibrationDrag(
    event: PointerEvent,
    slot: ResolvedHubSlot,
    button: HTMLButtonElement,
    mode: 'move' | 'resize'
  ): void {
    if (this.calibrationDrag || !this.isPrimaryPointerDown(event)) return;
    event.preventDefault();
    const pressedAt = performance.now();
    // An artwork chosen in the list (or a place drag) is dropped here instead
    // of starting a move.
    if (this.placementController?.handleSceneSlotPress(slot.id)) return;
    // Press stays cheap: mark the selection now and refresh the overlay and
    // panels after the next frame. The undo step is recorded only once the
    // pointer actually moves past the drag threshold.
    this.selectCalibrationSlot(slot.id, { deferred: true });
    button.focus({ preventScroll: true });
    const wall = this.resolution.wallById.get(slot.placement.wallId);
    const startPoint = this.pointerEventToStage(event);
    // Keep the grabbed point under the pointer instead of snapping the
    // artwork centre to it, which made the first move jump.
    const grabLocal = wall && startPoint ? this.applyInverseHomography(wall, startPoint) : null;
    const grabOffset = grabLocal && mode === 'move'
      ? point(slot.placement.center.x - grabLocal.x, slot.placement.center.y - grabLocal.y)
      : point(0, 0);
    this.calibrationDrag = {
      kind: 'slot',
      slot,
      button,
      pointerId: event.pointerId,
      captureElement: button,
      mode,
      grabOffset,
      startClient: point(event.clientX, event.clientY),
      moved: false,
      pressedAt,
      lastFrameAt: pressedAt,
      frameTimes: [],
      firstMoveAt: null,
    };
    try {
      button.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic or already-released pointers cannot be captured; window
      // listeners below still end the drag.
    }
    button.addEventListener('pointermove', this.handleCalibrationMove as EventListener);
    button.addEventListener('pointerup', this.handleCalibrationEnd as EventListener);
    button.addEventListener('pointercancel', this.handleCalibrationEnd as EventListener);
    button.addEventListener('lostpointercapture', this.handleCalibrationEnd as EventListener);
    this.recordEditorTiming('pressHandlerMs', performance.now() - pressedAt);
  }

  private startWallPointCalibrationDrag(
    event: PointerEvent,
    wallId: string,
    target: 'quad' | 'safe' | 'mounting-zone',
    index: number
  ): void {
    if (this.calibrationDrag || !this.isPrimaryPointerDown(event)) return;
    event.preventDefault();
    this.activeCalibrationWallId = wallId;
    if (this.calibrationWallSelect) this.calibrationWallSelect.value = wallId;
    const element = event.currentTarget as SVGCircleElement;
    // Capture on the visible handle itself. The overview handles live in the
    // editor SVG, which is intentionally layered above the projected overlay.
    const captureElement = element;
    const wall = this.resolution.wallById.get(wallId);
    const currentQuad = wall?.quad ?? (wallId === 'wall-rear' ? this.entranceBoundaryQuad : null);
    if (!currentQuad) return;
    const startPoint = this.pointerEventToStage(event);
    if (!startPoint) return;
    this.recordCalibrationHistory();
    this.calibrationDrag = {
      kind: 'wall-point',
      wallId,
      pointerId: event.pointerId,
      captureElement,
      target,
      index,
      startPoint,
      startQuad: currentQuad.map((corner) => point(corner.x, corner.y)) as unknown as Quad,
      startSafePolygon: wall?.safePolygon.map((corner) => point(corner.x, corner.y)),
      startMountingZone: wall?.mountingZone.map((corner) => point(corner.x, corner.y)),
    };
    captureElement.setPointerCapture(event.pointerId);
    captureElement.addEventListener('pointerup', this.handleCalibrationEnd as EventListener);
    captureElement.addEventListener('pointercancel', this.handleCalibrationEnd as EventListener);
    captureElement.addEventListener('lostpointercapture', this.handleCalibrationEnd as EventListener);
    window.addEventListener('pointermove', this.handleCalibrationMove as EventListener);
    window.addEventListener('pointerup', this.handleCalibrationEnd as EventListener);
    window.addEventListener('pointercancel', this.handleCalibrationEnd as EventListener);
  }

  private startWallTranslateDrag = (event: PointerEvent, wallId: string): void => {
    if (this.calibrationDrag || !this.isPrimaryPointerDown(event)) return;
    if (!this.calibrating) return;
    event.preventDefault();
    this.activeCalibrationWallId = wallId;
    if (this.calibrationWallSelect) this.calibrationWallSelect.value = wallId;
    const wall = this.resolution.wallById.get(wallId);
    const currentQuad = wall?.quad ?? (wallId === 'wall-rear' ? this.entranceBoundaryQuad : null);
    const startPoint = this.pointerEventToStage(event);
    if (!currentQuad || !startPoint) return;
    const element = event.currentTarget as SVGPolygonElement;
    const captureElement = this.calibrationSvg ?? element;
    this.recordCalibrationHistory();
    this.calibrationDrag = {
      kind: 'wall-point',
      wallId,
      pointerId: event.pointerId,
      captureElement,
      target: 'quad',
      index: -1,
      startPoint,
      startQuad: currentQuad.map((corner) => point(corner.x, corner.y)) as unknown as Quad,
      startSafePolygon: wall?.safePolygon.map((corner) => point(corner.x, corner.y)),
      startMountingZone: wall?.mountingZone.map((corner) => point(corner.x, corner.y)),
    };

    captureElement.setPointerCapture(event.pointerId);
    captureElement.addEventListener('pointerup', this.handleCalibrationEnd as EventListener);
    captureElement.addEventListener('pointercancel', this.handleCalibrationEnd as EventListener);
    captureElement.addEventListener('lostpointercapture', this.handleCalibrationEnd as EventListener);
    window.addEventListener('pointermove', this.handleCalibrationMove as EventListener);
    window.addEventListener('pointerup', this.handleCalibrationEnd as EventListener);
    window.addEventListener('pointercancel', this.handleCalibrationEnd as EventListener);
  };

  private translateWall(wallId: string, dx: number, dy: number): void {
    const wall = this.resolution.wallById.get(wallId);
    if (!wall) return;
    this.recordCalibrationHistory();
    const clamped = this.clampWallDelta(wall.quad, point(dx, dy));
    wall.quad = wall.quad.map((corner) => point(corner.x + clamped.x, corner.y + clamped.y)) as unknown as Quad;
    wall.safePolygon.forEach((corner) => {
      corner.x += clamped.x;
      corner.y += clamped.y;
    });
    wall.mountingZone.forEach((corner) => {
      corner.x += clamped.x;
      corner.y += clamped.y;
    });
    const refitMessage = this.refitSlotsOnWall(wallId);
    this.applyAllSlotGeometry();
    this.updateCalibrationOverlayGeometry();
    this.updateCalibrationOutput(true);
    if (refitMessage) this.announceCalibrationAction(refitMessage);
  }

  /**
   * After a wall or green-zone edit, pulls each artwork on the wall back to the
   * nearest valid position inside the new zone (keeping its physical size), or
   * marks it invalid when no position fits. Returns an announcement, if any.
   */
  private refitSlotsOnWall(wallId: string): string | null {
    const wall = this.resolution.wallById.get(wallId);
    if (!wall?.room) return null;
    const moved: string[] = [];
    const invalid: string[] = [];
    for (const view of this.slotViews) {
      const { slot } = view;
      if (slot.placement.wallId !== wallId || !slot.artworkId || !slot.selectable) continue;
      this.syncCanonicalPlacement(slot, wall);
      if (this.isSlotPlacementInsideMountingZone(slot, wall)) continue;
      const original = clonePoint(slot.placement.center);
      const applyCenter = (center: Point2D): boolean => {
        slot.placement.center = point(this.clampLocalX(center.x), this.clampLocalY(center.y));
        slot.placement.uv = point(slot.placement.center.x, 1 - slot.placement.center.y);
        this.syncCanonicalPlacement(slot, wall);
        return this.isSlotPlacementInsideMountingZone(slot, wall);
      };
      const refit = this.findNearestValidSlotCenter(wall, original, applyCenter);
      if (refit && applyCenter(refit)) {
        moved.push(slot.id);
      } else {
        applyCenter(original);
        invalid.push(slot.id);
      }
    }
    const parts: string[] = [];
    if (moved.length) parts.push(`Zurück in die grüne Fläche verschoben: ${moved.join(', ')}.`);
    if (invalid.length) parts.push(`Passt nicht in die grüne Fläche und ist markiert: ${invalid.join(', ')}.`);
    return parts.length ? parts.join(' ') : null;
  }

  /** Only the primary mouse button / first touch or pen contact starts a drag. */
  private isPrimaryPointerDown(event: PointerEvent): boolean {
    return event.isPrimary !== false && event.button === 0;
  }

  private pointerEventToStage(event: PointerEvent): Point2D | null {
    const rect = this.visual.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    const displayX = ((event.clientX - rect.left) / rect.width) * this.stageWidth;
    const displayY = ((event.clientY - rect.top) / rect.height) * this.stageHeight;
    return point(
      (displayX - this.calibrationViewport.offsetX) / this.calibrationViewport.scale,
      (displayY - this.calibrationViewport.offsetY) / this.calibrationViewport.scale
    );
  }

  private handleCalibrationMove = (event: PointerEvent): void => {
    // Use the newest coalesced sample so the frame lands on the latest
    // pointer position even when the browser batched several moves.
    const coalesced = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : [];
    const latest = coalesced[coalesced.length - 1];
    this.pendingCalibrationMove = latest && latest.pointerId === event.pointerId ? latest : event;
    if (this.calibrationMoveRaf !== 0) return;
    this.calibrationMoveRaf = requestAnimationFrame(() => {
      this.calibrationMoveRaf = 0;
      const pending = this.pendingCalibrationMove;
      this.pendingCalibrationMove = null;
      if (pending) this.applyCalibrationMove(pending);
    });
  };

  private applyCalibrationMove = (event: PointerEvent): void => {
    const drag = this.calibrationDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const stagePoint = this.pointerEventToStage(event);
    if (!stagePoint) return;
    if (drag.kind === 'slot') {
      if (!drag.moved) {
        // Below the threshold the press is a click (select only).
        const distance = Math.hypot(event.clientX - drag.startClient.x, event.clientY - drag.startClient.y);
        if (distance < MainMuseumHub.DRAG_THRESHOLD_PX) return;
        drag.moved = true;
        this.recordCalibrationHistory();
        drag.button.classList.add('is-dragging');
        this.element.classList.add('is-dragging-artwork');
      }
      const frameAt = performance.now();
      if (drag.firstMoveAt === null) {
        drag.firstMoveAt = frameAt;
      } else {
        drag.frameTimes.push(frameAt - drag.lastFrameAt);
      }
      drag.lastFrameAt = frameAt;
      const wall = this.resolution.wallById.get(drag.slot.placement.wallId);
      if (!wall) return;
      const local = wall.inverseHomography
        ? this.applyInverseHomography(wall, stagePoint, true)
        : null;
      if (!local) return;
      if (drag.mode === 'move') {
        this.setSlotCenterClampedToMountingZone(
          drag.slot,
          wall,
          point(local.x + drag.grabOffset.x, local.y + drag.grabOffset.y)
        );
      } else {
        this.lastSlotDragBlocked = null;
        this.setSlotHeightClampedToMountingZone(drag.slot, wall, Math.abs(local.y - drag.slot.placement.center.y) * 2);
      }
      this.applySlotGeometry(drag.button, drag.slot, false);
      this.renderDragLimitHighlight(drag.slot, wall);
      if (drag.mode === 'move' && drag.slot.artworkId) {
        this.placementController?.sceneDragHover(event.clientX, event.clientY, drag.slot.id, drag.button);
      }
    } else {
      const wall = this.resolution.wallById.get(drag.wallId);
      const wallQuad = wall?.quad ?? (drag.wallId === 'wall-rear' ? this.entranceBoundaryQuad : null);
      if (!wallQuad) return;
      if (drag.target === 'quad') {
        if (!drag.startQuad) return;
        const mutableQuad = wallQuad as unknown as Point2D[];
        let delta = point(stagePoint.x - drag.startPoint.x, stagePoint.y - drag.startPoint.y);
        if (drag.index < 0) delta = this.clampWallDelta(drag.startQuad, delta);
        const startQuad = drag.startQuad;
        const quadWithCorner = (corner: Point2D): Quad =>
          startQuad.map((source, index) => (index === drag.index ? corner : point(source.x, source.y))) as unknown as Quad;
        let candidate: Quad;
        if (drag.index >= 0) {
          // Stop at the limit (degenerate/non-convex quad) and slide along it
          // from the current valid corner instead of freezing the handle.
          const source = startQuad[drag.index]!;
          const target = this.clampDisplayPoint(point(source.x + delta.x, source.y + delta.y));
          const current = point(mutableQuad[drag.index]!.x, mutableQuad[drag.index]!.y);
          const isValidCorner = (corner: Point2D): boolean => {
            const quad = quadWithCorner(corner);
            return !quadIsDegenerate(quad) && quadIsConvex(quad);
          };
          const result = slideToValid(current, target, isValidCorner);
          candidate = quadWithCorner(result.startValid ? result.point : target);
        } else {
          candidate = startQuad.map((source) => point(source.x + delta.x, source.y + delta.y)) as unknown as Quad;
        }
        if (drag.index >= 0) {
          const clamped = candidate[drag.index];
          mutableQuad[drag.index].x = clamped.x;
          mutableQuad[drag.index].y = clamped.y;
        } else {
          for (let index = 0; index < wallQuad.length; index += 1) {
            mutableQuad[index].x = candidate[index].x;
            mutableQuad[index].y = candidate[index].y;
          }
        }
        if (drag.wallId === 'wall-rear') {
          this.entranceBoundaryQuad = mutableQuad as unknown as Quad;
        } else if (wall && drag.startQuad) {
          const startHomography = computeHomographyFromUnitSquare(drag.startQuad);
          const nextHomography = computeHomographyFromUnitSquare(candidate);
          const inverseStart = startHomography ? invertMatrix3x3(startHomography) : null;
          const remap = (source: Point2D): Point2D => {
            if (!startHomography || !nextHomography || !inverseStart) return clonePoint(source);
            const normalized = applyHomography(inverseStart, source.x, source.y);
            return normalized ? (applyHomography(nextHomography, normalized.x, normalized.y) ?? clonePoint(source)) : clonePoint(source);
          };
          if (drag.startSafePolygon) {
            wall.safePolygon.splice(0, wall.safePolygon.length, ...drag.startSafePolygon.map(remap));
          }
          if (drag.startMountingZone) {
            wall.mountingZone.splice(0, wall.mountingZone.length, ...drag.startMountingZone.map(remap));
          }
        }
      } else if (wall) {
      const targetPoints = drag.target === 'safe' ? wall.safePolygon : wall.mountingZone;
      const targetPoint = targetPoints[drag.index];
      if (!targetPoint) return;
      const target = this.clampDisplayPoint(stagePoint);
      const current = point(targetPoint.x, targetPoint.y);
      // Green-zone and safe-area points must keep a simple (non-crossing)
      // polygon on the wall; a 4-point zone must stay convex. Blocked moves
      // slide along the limit like artwork and wall-corner drags.
      const keepInsideWall = pointInPolygon(current, wall.quad);
      const isValidPoint = (candidatePoint: Point2D): boolean => {
        const polygon = targetPoints.map((existing, index) => (index === drag.index ? candidatePoint : existing));
        if (!polygonIsSimple(polygon)) return false;
        if (polygon.length === 4 && !quadIsConvex(polygon as unknown as Quad)) return false;
        return !keepInsideWall || pointInPolygon(candidatePoint, wall.quad);
      };
      const result = slideToValid(current, target, isValidPoint);
      const next = result.startValid ? result.point : target;
      targetPoint.x = next.x;
      targetPoint.y = next.y;
      if (drag.target === 'mounting-zone') {
        wall.mountingZoneConfirmed = false;
      }
      }
      if (wall) this.applyAllSlotGeometry(false);
    }
    if (drag.kind !== 'slot') {
      this.updateCalibrationOverlayGeometry();
      this.updateCalibrationOutput(false);
      this.syncCalibrationControls();
    }
  };

  private pointsBounds(points: readonly Point2D[]): { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number } {
    const xs = points.map((value) => value.x);
    const ys = points.map((value) => value.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    return {
      minX,
      minY,
      maxX: Math.max(...xs),
      maxY: Math.max(...ys),
      width: Math.max(1, Math.max(...xs) - minX),
      height: Math.max(1, Math.max(...ys) - minY),
    };
  }

  private fitCalibrationWallsToView(selectedWallId?: string): void {
    const walls = selectedWallId
      ? this.resolution.walls.filter((wall) => wall.id === selectedWallId)
      : this.resolution.walls;
    const points = walls.flatMap((wall) => [wall.quad, wall.safePolygon, wall.mountingZone]).flat();
    if (!points.length) return;
    const bounds = this.pointsBounds(points);
    const margin = 32;
    const scale = Math.min(
      1,
      (this.stageWidth - margin * 2) / Math.max(1, bounds.width),
      (this.stageHeight - margin * 2) / Math.max(1, bounds.height)
    );
    this.calibrationViewport = {
      scale,
      offsetX: (this.stageWidth - bounds.width * scale) / 2 - bounds.minX * scale,
      offsetY: (this.stageHeight - bounds.height * scale) / 2 - bounds.minY * scale,
    };
    this.applyCalibrationViewport();
  }

  private renderEditorViewportHandles(): void {
    const svg = this.editorViewportSvg;
    const viewport = this.editorViewport;
    if (!svg) return;
    svg.replaceChildren();
    if (!viewport) return;
    // Entrance-edge corner handles belong to "Wandecken bearbeiten" only.
    if (this.calibrating && !this.wallEditingEnabled) return;
    if (viewport.viewMode === 'wall-edit') {
      // The projected calibration SVG remains the sole editable wall surface.
      // Do not draw a second orthographic wall rectangle over it.
      return;
    }
    // The overview must use the existing projected walls, not a second
    // centered 3D room. The shared front-wall corners are already represented
    // by the existing calibration overlay; only entrance-side corners belong
    // in this overview layer.
    for (const wall of this.resolution.walls) {
      if (wall.id !== 'wall-left' && wall.id !== 'wall-right') continue;
      if (this.calibrating && wall.id !== this.activeCalibrationWallId) continue;
      // Existing projected quads are ordered around each wall. The entrance
      // edge is the off-screen pair: left wall 0/3, right wall 1/2.
      const entranceCornerIndices = wall.id === 'wall-left' ? [0, 3] : [1, 2];
      const frontCornerIndices = wall.id === 'wall-left' ? [1, 2] : [0, 3];
      entranceCornerIndices.forEach((cornerIndex) => {
        const corner = wall.quad[cornerIndex];
        const frontCornerIndex = cornerIndex === entranceCornerIndices[0]
          ? frontCornerIndices[0]
          : frontCornerIndices[1];
        svg.appendChild(this.createProjectedWallCornerHandle(
          wall.id,
          cornerIndex,
          corner,
          wall.quad[frontCornerIndex]
        ));
      });
    }
  }

  private createProjectedWallCornerHandle(
    wallId: string,
    cornerIndex: number,
    corner: Point2D,
    edgeStart?: Point2D
  ): SVGCircleElement {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const display = this.projectedEdgePoint(edgeStart ?? corner, corner);
    circle.setAttribute('cx', display.x.toFixed(2));
    circle.setAttribute('cy', display.y.toFixed(2));
    circle.setAttribute('r', '22');
    circle.setAttribute('class', 'museum-hub__editor-viewport-corner is-edge-anchored');
    circle.setAttribute('tabindex', '0');
    circle.setAttribute('role', 'button');
    circle.style.pointerEvents = 'all';
    circle.setAttribute('aria-label', `${wallLabel(wallId)}: Ecke am Eingang ${cornerIndex + 1}`);
    circle.addEventListener('pointerdown', (event) =>
      this.startWallPointCalibrationDrag(event, wallId, 'quad', cornerIndex)
    );
    return circle;
  }

  private projectedEdgePoint(start: Point2D, end: Point2D): Point2D {
    const startDisplay = this.displayPoint(start);
    const endDisplay = this.displayPoint(end);
    const margin = 24;
    const minX = margin;
    const maxX = this.stageWidth - margin;
    const minY = margin;
    const maxY = this.stageHeight - margin;
    if (
      endDisplay.x >= minX && endDisplay.x <= maxX
      && endDisplay.y >= minY && endDisplay.y <= maxY
    ) {
      return endDisplay;
    }
    const dx = endDisplay.x - startDisplay.x;
    const dy = endDisplay.y - startDisplay.y;
    const candidates: Array<{ t: number; point: Point2D }> = [];
    if (Math.abs(dx) > 1e-6) {
      for (const x of [minX, maxX]) {
        const t = (x - startDisplay.x) / dx;
        const y = startDisplay.y + dy * t;
        if (t > 0 && t <= 1 && y >= minY && y <= maxY) candidates.push({ t, point: { x, y } });
      }
    }
    if (Math.abs(dy) > 1e-6) {
      for (const y of [minY, maxY]) {
        const t = (y - startDisplay.y) / dy;
        const x = startDisplay.x + dx * t;
        if (t > 0 && t <= 1 && x >= minX && x <= maxX) candidates.push({ t, point: { x, y } });
      }
    }
    return candidates.sort((a, b) => a.t - b.t)[0]?.point ?? {
      x: Math.min(maxX, Math.max(minX, endDisplay.x)),
      y: Math.min(maxY, Math.max(minY, endDisplay.y)),
    };
  }

  private applyCalibrationViewport(): void {
    const { scale, offsetX, offsetY } = this.calibrationViewport;
    const transform = `matrix(${scale} 0 0 ${scale} ${offsetX} ${offsetY})`;
    this.calibrationSvg?.style.setProperty('transform', transform);
    const rooms = this.stage.querySelector<HTMLElement>('.museum-hub__rooms');
    rooms?.style.setProperty('transform', transform);
  }

  private displayPoint(value: Point2D): Point2D {
    return point(
      value.x * this.calibrationViewport.scale + this.calibrationViewport.offsetX,
      value.y * this.calibrationViewport.scale + this.calibrationViewport.offsetY
    );
  }

  private clampDisplayPoint(value: Point2D): Point2D {
    const margin = 18;
    const display = this.displayPoint(value);
    const canonical = point(
      (Math.min(this.stageWidth - margin, Math.max(margin, display.x)) - this.calibrationViewport.offsetX) / this.calibrationViewport.scale,
      (Math.min(this.stageHeight - margin, Math.max(margin, display.y)) - this.calibrationViewport.offsetY) / this.calibrationViewport.scale
    );
    return point(
      Math.min(this.stageWidth, Math.max(0, canonical.x)),
      Math.min(this.stageHeight, Math.max(0, canonical.y))
    );
  }

  private clampWallDelta(points: readonly Point2D[], delta: Point2D): Point2D {
    const margin = 18;
    const display = points.map((value) => this.displayPoint(point(value.x + delta.x, value.y + delta.y)));
    const minX = Math.min(...display.map((value) => value.x));
    const maxX = Math.max(...display.map((value) => value.x));
    const minY = Math.min(...display.map((value) => value.y));
    const maxY = Math.max(...display.map((value) => value.y));
    const dx = minX < margin
      ? margin - minX
      : maxX > this.stageWidth - margin
        ? this.stageWidth - margin - maxX
        : 0;
    const dy = minY < margin
      ? margin - minY
      : maxY > this.stageHeight - margin
        ? this.stageHeight - margin - maxY
        : 0;
    return point(delta.x + dx / this.calibrationViewport.scale, delta.y + dy / this.calibrationViewport.scale);
  }

  private updateCalibrationOverlayGeometry(): void {
    if (!this.calibrationSvg) return;
    for (const wall of this.resolution.walls) {
      const polygon = this.calibrationSvg.querySelector<SVGPolygonElement>(
        `[data-calibration-wall="${wall.id}"]`
      );
      polygon?.setAttribute('points', this.pointsToSvg(wall.quad));
      const label = this.calibrationSvg.querySelector<SVGTextElement>(
        `[data-calibration-wall-label="${wall.id}"]`
      );
      if (label) {
        const center = wall.quad.reduce((sum, corner) => point(sum.x + corner.x, sum.y + corner.y), point(0, 0));
        center.x /= wall.quad.length;
        center.y /= wall.quad.length;
        label.setAttribute('x', center.x.toFixed(2));
        label.setAttribute('y', center.y.toFixed(2));
      }
      wall.quad.forEach((corner, index) => {
        const next = wall.quad[(index + 1) % wall.quad.length]!;
        const edge = this.calibrationSvg!.querySelector<SVGLineElement>(
          `[data-calibration-edge-hit="${wall.id}:${index}"]`
        );
        edge?.setAttribute('x1', corner.x.toFixed(2));
        edge?.setAttribute('y1', corner.y.toFixed(2));
        edge?.setAttribute('x2', next.x.toFixed(2));
        edge?.setAttribute('y2', next.y.toFixed(2));
      });
      this.calibrationSvg
        .querySelector<SVGPolygonElement>(`[data-calibration-safe="${wall.id}"]`)
        ?.setAttribute('points', this.pointsToSvg(wall.safePolygon));
      this.calibrationSvg
        .querySelector<SVGPolygonElement>(`[data-calibration-mounting-zone="${wall.id}"]`)
        ?.setAttribute('points', this.pointsToSvg(wall.mountingZone));
      wall.quad.forEach((corner, index) => {
        this.calibrationSvg!.querySelector<SVGCircleElement>(
          `[data-calibration-corner-hit="${wall.id}:${index}"]`
        )?.setAttribute('cx', corner.x.toFixed(2));
        this.calibrationSvg!.querySelector<SVGCircleElement>(
          `[data-calibration-corner-hit="${wall.id}:${index}"]`
        )?.setAttribute('cy', corner.y.toFixed(2));
        const handle = this.calibrationSvg!.querySelector<SVGCircleElement>(
          `[data-calibration-handle="${wall.id}:quad:${index}"]`
        );
        handle?.setAttribute('cx', corner.x.toFixed(2));
        handle?.setAttribute('cy', corner.y.toFixed(2));
      });
      const editablePolygons: readonly (readonly ['safe' | 'mounting-zone', Point2D[]])[] = [
        ['safe', wall.safePolygon],
        ['mounting-zone', wall.mountingZone],
      ];
      for (const [target, points] of editablePolygons) {
        points.forEach((corner, index) => {
          const handle = this.calibrationSvg!.querySelector<SVGCircleElement>(
            `[data-calibration-handle="${wall.id}:${target}:${index}"]`
          );
          handle?.setAttribute('cx', corner.x.toFixed(2));
          handle?.setAttribute('cy', corner.y.toFixed(2));
        });
      }
    }
    const envelope = this.calibrationSvg.querySelector<SVGPolygonElement>(
      '[data-calibration-envelope="wall-rear"]'
    );
    if (envelope && this.entranceBoundaryQuad) {
      envelope.setAttribute('points', this.pointsToSvg(this.entranceBoundaryQuad));
      this.entranceBoundaryQuad.forEach((corner, index) => {
        const cornerHit = this.calibrationSvg!.querySelector<SVGCircleElement>(
          `[data-calibration-corner-hit="wall-rear:${index}"]`
        );
        cornerHit?.setAttribute('cx', corner.x.toFixed(2));
        cornerHit?.setAttribute('cy', corner.y.toFixed(2));
        const next = this.entranceBoundaryQuad![(index + 1) % this.entranceBoundaryQuad!.length]!;
        const edge = this.calibrationSvg!.querySelector<SVGLineElement>(
          `[data-calibration-edge-hit="wall-rear:${index}"]`
        );
        edge?.setAttribute('x1', corner.x.toFixed(2));
        edge?.setAttribute('y1', corner.y.toFixed(2));
        edge?.setAttribute('x2', next.x.toFixed(2));
        edge?.setAttribute('y2', next.y.toFixed(2));
        const handle = this.calibrationSvg!.querySelector<SVGCircleElement>(
          `[data-calibration-handle="wall-rear:quad:${index}"]`
        );
        handle?.setAttribute('cx', corner.x.toFixed(2));
        handle?.setAttribute('cy', corner.y.toFixed(2));
      });
    }
  }

  private handleCalibrationEnd = (event: PointerEvent): void => {
    const drag = this.calibrationDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (this.calibrationMoveRaf !== 0) {
      cancelAnimationFrame(this.calibrationMoveRaf);
      this.calibrationMoveRaf = 0;
    }
    // Commit the release position (or the last coalesced move) so the drop
    // lands exactly where the pointer was released instead of one frame behind.
    const finalMove = event.type === 'pointerup' ? event : this.pendingCalibrationMove;
    this.pendingCalibrationMove = null;
    if (finalMove) this.applyCalibrationMove(finalMove);
    this.calibrationDrag = null;
    const currentTarget = drag.captureElement;
    currentTarget?.removeEventListener('pointermove', this.handleCalibrationMove as EventListener);
    currentTarget?.removeEventListener('pointerup', this.handleCalibrationEnd as EventListener);
    currentTarget?.removeEventListener('pointercancel', this.handleCalibrationEnd as EventListener);
    currentTarget?.removeEventListener('lostpointercapture', this.handleCalibrationEnd as EventListener);
    window.removeEventListener('pointermove', this.handleCalibrationMove as EventListener);
    window.removeEventListener('pointerup', this.handleCalibrationEnd as EventListener);
    window.removeEventListener('pointercancel', this.handleCalibrationEnd as EventListener);
    this.lastSlotDragBlocked = null;
    let refitMessage: string | null = null;
    if (drag.kind === 'slot') {
      drag.button.classList.remove('is-dragging');
      this.element.classList.remove('is-dragging-artwork');
      if (!drag.moved) {
        // A click: nothing changed, so skip the renderer, validation, and
        // export rebuild; only finish the deferred selection refresh.
        this.flushDeferredSelectionRefresh();
        this.recordEditorTiming('releaseHandlerMs', 0);
        if (!drag.slot.artworkId && drag.mode === 'move') {
          this.placementController?.openPlacePicker(drag.slot.id, drag.button);
        }
        return;
      }
      // Released over another place of this room: swap the two artworks and
      // keep both places' positions (the move itself is discarded).
      const swapSlotId = drag.slot.artworkId && drag.mode === 'move'
        ? this.placementController?.sceneDragHover(event.clientX, event.clientY, drag.slot.id, drag.button) ?? null
        : null;
      this.placementController?.sceneDragEnd();
      if (swapSlotId && drag.slot.artworkId) {
        const snapshot = this.calibrationUndoStack.pop();
        if (snapshot) this.applyCalibrationSnapshot(snapshot);
        this.assignArtwork(swapSlotId, drag.slot.artworkId);
        return;
      }
      const releaseStartedAt = performance.now();
      const view = this.slotViews.find((candidate) => candidate.slot.id === drag.slot.id);
      if (view) this.syncSlotRenderer(view);
      this.flushDeferredSelectionRefresh(false);
      this.renderCalibrationOverlay();
      this.updateCalibrationOutput(true);
      this.announceSlotPosition(drag.slot);
      const frames = drag.frameTimes;
      this.recordEditorTiming('releaseHandlerMs', performance.now() - releaseStartedAt);
      this.recordEditorTiming('pressToFirstMoveMs', (drag.firstMoveAt ?? drag.pressedAt) - drag.pressedAt);
      if (frames.length) {
        this.recordEditorTiming('dragFrameAvgMs', frames.reduce((sum, value) => sum + value, 0) / frames.length);
        this.recordEditorTiming('dragFrameMaxMs', Math.max(...frames));
      }
      this.diagnostics.info('hub-editor-timing', 'Placement editor drag timing', { ...this.editorTimings });
      return;
    } else {
      // Wall/zone drags deferred 3D updates; re-fit artworks and render once.
      refitMessage = this.refitSlotsOnWall(drag.wallId);
      this.applyAllSlotGeometry();
    }
    this.renderCalibrationOverlay();
    this.updateCalibrationOutput(true);
    if (refitMessage) this.announceCalibrationAction(refitMessage);
  };

  private handleCalibrationBlur = (): void => {
    if (!this.calibrationDrag) return;
    const drag = this.calibrationDrag;
    if (this.calibrationMoveRaf !== 0) {
      cancelAnimationFrame(this.calibrationMoveRaf);
      this.calibrationMoveRaf = 0;
    }
    this.pendingCalibrationMove = null;
    this.calibrationDrag = null;
    this.lastSlotDragBlocked = null;
    const element = drag.captureElement;
    element.removeEventListener('pointermove', this.handleCalibrationMove as EventListener);
    element.removeEventListener('pointerup', this.handleCalibrationEnd as EventListener);
    element.removeEventListener('pointercancel', this.handleCalibrationEnd as EventListener);
    element.removeEventListener('lostpointercapture', this.handleCalibrationEnd as EventListener);
    window.removeEventListener('pointermove', this.handleCalibrationMove as EventListener);
    window.removeEventListener('pointerup', this.handleCalibrationEnd as EventListener);
    window.removeEventListener('pointercancel', this.handleCalibrationEnd as EventListener);
    if (element && 'releasePointerCapture' in element) {
      try {
        (element as Element & { releasePointerCapture(pointerId: number): void }).releasePointerCapture(drag.pointerId);
      } catch {
        // Capture may already have been released by the browser.
      }
    }
    if (drag.kind === 'wall-point') {
      this.refitSlotsOnWall(drag.wallId);
      this.applyAllSlotGeometry();
    } else {
      drag.button.classList.remove('is-dragging');
      this.element.classList.remove('is-dragging-artwork');
      this.placementController?.sceneDragEnd();
      this.flushDeferredSelectionRefresh(false);
      const view = this.slotViews.find((candidate) => candidate.slot.id === drag.slot.id);
      if (view) this.syncSlotRenderer(view);
    }
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
      wallPolygon.dataset.calibrationWall = wall.id;
      wallPolygon.setAttribute('class', `museum-hub__calibration-wall${active ? ' is-active' : ''}`);
      const wallLabelText = wallLabel(wall.id);
      wallPolygon.setAttribute('aria-label', wallLabelText);
      this.calibrationSvg.appendChild(wallPolygon);
      const wallEditing = this.calibrating && active && this.isWallCornerEditing();
      if (!this.calibrating || wallEditing) {
        // Labels only for the wall being edited, and only while "Wandecken bearbeiten" is on.
        const wallLabelElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const wallCenter = wall.quad.reduce((sum, corner) => point(sum.x + corner.x, sum.y + corner.y), point(0, 0));
        wallCenter.x /= wall.quad.length;
        wallCenter.y /= wall.quad.length;
        wallLabelElement.setAttribute('x', wallCenter.x.toFixed(2));
        wallLabelElement.setAttribute('y', wallCenter.y.toFixed(2));
        wallLabelElement.setAttribute('class', `museum-hub__calibration-wall-label${active ? ' is-active' : ''}`);
        wallLabelElement.dataset.calibrationWallLabel = wall.id;
        wallLabelElement.textContent = wallLabelText;
        this.calibrationSvg.appendChild(wallLabelElement);
      }
      if (wallEditing) {
        wall.quad.forEach((corner, index) => {
          const next = wall.quad[(index + 1) % wall.quad.length]!;
          this.calibrationSvg!.appendChild(this.createCalibrationEdgeHitTarget(wall.id, index, corner, next));
        });
        wall.quad.forEach((corner, index) => {
          this.calibrationSvg!.appendChild(this.createCalibrationCornerHitTarget(wall.id, index, corner));
        });
      }
      if (this.calibrating) {
        wallPolygon.setAttribute('tabindex', '0');
        wallPolygon.setAttribute('role', 'button');
        wallPolygon.addEventListener('pointerdown', (event) => {
          if (!this.wallEditingEnabled) return;
          this.calibrationEditMode = 'wall';
          this.activeCalibrationWallId = wall.id;
          if (this.calibrationWallSelect) this.calibrationWallSelect.value = wall.id;
          this.announceCalibrationAction(`Wandecken bearbeiten: ${wallLabel(wall.id)}.`);
          this.renderCalibrationOverlay();
          this.startWallTranslateDrag(event, wall.id);
        });
        wallPolygon.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.activeCalibrationWallId = wall.id;
            if (this.calibrationWallSelect) this.calibrationWallSelect.value = wall.id;
            this.syncEditorToolState();
            this.renderCalibrationOverlay();
            return;
          }
          if (!this.wallEditingEnabled) return;
          const distance = event.shiftKey ? 10 : 1;
          if (event.key === 'ArrowLeft') this.translateWall(wall.id, -distance, 0);
          else if (event.key === 'ArrowRight') this.translateWall(wall.id, distance, 0);
          else if (event.key === 'ArrowUp') this.translateWall(wall.id, 0, -distance);
          else if (event.key === 'ArrowDown') this.translateWall(wall.id, 0, distance);
          else return;
          event.preventDefault();
        });
      }
      if (wallEditing) {
        wall.quad.forEach((corner, index) => this.calibrationSvg!.appendChild(
          this.createCalibrationHandle(wall.id, 'quad', index, corner, 'museum-hub__calibration-handle museum-hub__calibration-handle--wall')
        ));
      }

      const safePolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      safePolygon.setAttribute('points', this.pointsToSvg(wall.safePolygon));
      safePolygon.dataset.calibrationSafe = wall.id;
      safePolygon.setAttribute('class', `museum-hub__calibration-safe${active ? ' is-active' : ''}`);
      this.calibrationSvg.appendChild(safePolygon);

      const mountingZone = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      mountingZone.setAttribute('points', this.pointsToSvg(wall.mountingZone));
      mountingZone.dataset.calibrationMountingZone = wall.id;
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
      if (this.calibrationEditMode === 'safe') {
        wall.safePolygon.forEach((corner, index) => this.calibrationSvg!.appendChild(this.createCalibrationHandle(wall.id, 'safe', index, corner, 'museum-hub__calibration-handle museum-hub__calibration-handle--safe')));
      }
      if (this.calibrationEditMode === 'mounting-zone') wall.mountingZone.forEach((corner, index) =>
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
    if (this.calibrating && this.calibrationRoomBoundaryVisible && this.entranceBoundaryQuad) {
      const envelope = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      envelope.dataset.calibrationEnvelope = 'wall-rear';
      envelope.setAttribute('points', this.pointsToSvg(this.entranceBoundaryQuad));
      envelope.setAttribute('class', 'museum-hub__calibration-envelope');
      envelope.setAttribute('tabindex', '0');
      envelope.setAttribute('role', 'button');
      envelope.setAttribute('aria-label', 'Eingangsbereich – nur Raumform, keine Bilder');
      envelope.addEventListener('pointerdown', (event) => {
        this.activeCalibrationWallId = 'wall-rear';
        if (this.calibrationWallSelect) this.calibrationWallSelect.value = 'wall-rear';
        this.announceCalibrationAction('Eingangsbereich: nur Raumform, hier hängen keine Bilder.');
        this.renderCalibrationOverlay();
        this.startWallTranslateDrag(event, 'wall-rear');
      });
      envelope.addEventListener('keydown', (event) => {
        this.activeCalibrationWallId = 'wall-rear';
        if (this.calibrationWallSelect) this.calibrationWallSelect.value = 'wall-rear';
        const distance = event.shiftKey ? 10 : 1;
        if (event.key === 'ArrowLeft') this.translateEnvelope(-distance, 0);
        else if (event.key === 'ArrowRight') this.translateEnvelope(distance, 0);
        else if (event.key === 'ArrowUp') this.translateEnvelope(0, -distance);
        else if (event.key === 'ArrowDown') this.translateEnvelope(0, distance);
        else return;
        event.preventDefault();
      });
      this.calibrationSvg.appendChild(envelope);
      this.entranceBoundaryQuad.forEach((corner, index) => {
        const next = this.entranceBoundaryQuad![(index + 1) % this.entranceBoundaryQuad!.length]!;
        this.calibrationSvg!.appendChild(this.createCalibrationEdgeHitTarget('wall-rear', index, corner, next));
      });
      this.entranceBoundaryQuad.forEach((corner, index) => {
        this.calibrationSvg!.appendChild(this.createCalibrationCornerHitTarget('wall-rear', index, corner));
      });
      this.entranceBoundaryQuad.forEach((corner, index) => {
        this.calibrationSvg!.appendChild(
          this.createCalibrationHandle(
            'wall-rear',
            'quad',
            index,
            corner,
            'museum-hub__calibration-handle museum-hub__calibration-handle--envelope'
          )
        );
      });
    }
    if (this.debugGeometry) {
      this.renderCameraDebugGuides();
      this.renderProjectedSlotDebugOverlay();
    }
    if (this.calibrating && !this.calibrationDrag) this.renderEditorViewportHandles();
    this.applyCalibrationViewport();
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
    handle.dataset.calibrationHandle = `${wallId}:${target}:${index}`;
    handle.setAttribute('cx', position.x.toFixed(2));
    handle.setAttribute('cy', position.y.toFixed(2));
    handle.setAttribute('r', '5');
    handle.setAttribute('tabindex', '0');
    handle.setAttribute('role', 'button');
    handle.setAttribute(
      'aria-label',
      target === 'quad'
        ? `${wallLabel(wallId)}: Ecke ${index + 1}. Ziehen formt die Wand.`
        : `${target === 'safe' ? 'Sicherheitsbereich' : 'Grüne Fläche'}: Punkt ${index + 1}. Ziehen passt den Bereich an.`
    );
    handle.addEventListener('pointerdown', (event) => this.startWallPointCalibrationDrag(event, wallId, target, index));
    return handle;
  }

  private createCalibrationEdgeHitTarget(
    wallId: string,
    index: number,
    start: Point2D,
    end: Point2D
  ): SVGLineElement {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.dataset.calibrationEdgeHit = `${wallId}:${index}`;
    line.setAttribute('x1', start.x.toFixed(2));
    line.setAttribute('y1', start.y.toFixed(2));
    line.setAttribute('x2', end.x.toFixed(2));
    line.setAttribute('y2', end.y.toFixed(2));
    line.setAttribute('class', 'museum-hub__calibration-edge-hit');
    line.setAttribute('tabindex', '0');
    line.setAttribute('role', 'button');
    line.setAttribute(
      'aria-label',
      `${wallLabel(wallId)}: Kante ${index + 1}. Ziehen verschiebt die ganze Wand.`
    );
    line.addEventListener('pointerdown', (event) => this.startWallTranslateDrag(event, wallId));
    return line;
  }

  private createCalibrationCornerHitTarget(
    wallId: string,
    index: number,
    position: Point2D
  ): SVGCircleElement {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.dataset.calibrationCornerHit = `${wallId}:${index}`;
    circle.setAttribute('cx', position.x.toFixed(2));
    circle.setAttribute('cy', position.y.toFixed(2));
    circle.setAttribute('r', '12');
    circle.setAttribute('class', 'museum-hub__calibration-corner-hit');
    circle.style.pointerEvents = 'all';
    circle.setAttribute('tabindex', '0');
    circle.setAttribute('role', 'button');
    circle.setAttribute(
      'aria-label',
      `${wallLabel(wallId)}: Ecke ${index + 1}. Ziehen formt die Wand.`
    );
    circle.addEventListener('pointerdown', (event) =>
      this.startWallPointCalibrationDrag(event, wallId, 'quad', index)
    );
    return circle;
  }

  private projectEntranceBoundary(): Quad | null {
    const rear = this.resolution.configuredWalls.find(
      (wall) => wall.id === 'wall-rear' && wall.role === 'bounds-only'
    );
    const transform = rear?.transform;
    if (!transform) return null;
    const corners: Point3D[] = [
      transform.origin,
      {
        x: transform.origin.x + transform.axisU.x * transform.width,
        y: transform.origin.y + transform.axisU.y * transform.width,
        z: transform.origin.z + transform.axisU.z * transform.width,
      },
      {
        x: transform.origin.x + transform.axisU.x * transform.width + transform.axisV.x * transform.height,
        y: transform.origin.y + transform.axisU.y * transform.width + transform.axisV.y * transform.height,
        z: transform.origin.z + transform.axisU.z * transform.width + transform.axisV.z * transform.height,
      },
      {
        x: transform.origin.x + transform.axisV.x * transform.height,
        y: transform.origin.y + transform.axisV.y * transform.height,
        z: transform.origin.z + transform.axisV.z * transform.height,
      },
    ];
    const projected = corners.map((corner) => projectWorldPoint(this.resolution.camera, corner, this.resolution.stage));
    return projected.every((corner): corner is Point2D => corner !== null)
      ? (projected as unknown as Quad)
      : null;
  }

  private translateEnvelope(dx: number, dy: number): void {
    if (!this.entranceBoundaryQuad) return;
    this.recordCalibrationHistory();
    const clamped = this.clampWallDelta(this.entranceBoundaryQuad, point(dx, dy));
    this.entranceBoundaryQuad = this.entranceBoundaryQuad.map((corner) =>
      point(corner.x + clamped.x, corner.y + clamped.y)
    ) as unknown as Quad;
    this.updateCalibrationOverlayGeometry();
    this.updateCalibrationOutput(true);
  }

  private renderWallDebugAxes(wall: ResolvedHubWall): void {
    // Use the current (possibly edited) quad; the resolved homography is load-time only.
    const homography = computeHomographyFromUnitSquare(wall.quad) ?? wall.homography;
    if (!this.calibrationSvg || !homography) return;
    const origin = applyHomography(homography, 0.1, 0.1);
    const axisX = applyHomography(homography, 0.28, 0.1);
    const axisY = applyHomography(homography, 0.1, 0.28);
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
      const homography = wall ? computeHomographyFromUnitSquare(wall.quad) ?? wall.homography : null;
      if (!wall || !projection || !homography) continue;
      const centerStage = applyHomography(homography, slot.placement.center.x, slot.placement.center.y);
      const displayedValid = evaluateDisplayedPlacement(wall, slot.placement, this.displayedAspectForSlot(slot), this.resolution.stage).valid;
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
            displayedValid ? 'valid' : 'invalid'
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

  private appendSvgLine(start: Point2D, end: Point2D, className: string): SVGLineElement | null {
    if (!this.calibrationSvg) return null;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('class', className);
    line.setAttribute('x1', start.x.toFixed(2));
    line.setAttribute('y1', start.y.toFixed(2));
    line.setAttribute('x2', end.x.toFixed(2));
    line.setAttribute('y2', end.y.toFixed(2));
    this.calibrationSvg.appendChild(line);
    return line;
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

  private applyInverseHomography(
    wall: ResolvedHubWall,
    stagePoint: Point2D,
    limitToWallSide = false
  ): Point2D | null {
    // Invert the *current* (possibly edited) wall quad. The resolved
    // inverseHomography is computed once at load, so after calibration edits it
    // no longer matches the projection used to draw the artwork.
    const currentHomography = computeHomographyFromUnitSquare(wall.quad);
    const inverse = (currentHomography ? invertMatrix3x3(currentHomography) : null) ?? wall.inverseHomography;
    if (!inverse) return null;
    const [a, b, c, d, e, f, g, h, i] = inverse;
    if (limitToWallSide) {
      // A strongly receding side wall has a vanishing line on screen. Pointer
      // positions past it map "behind" the wall and flip direction, which made
      // e.g. dragging the left-wall artwork to the right edge of the screen go
      // nowhere. Pull such points back along the ray from the wall centre to
      // just before the vanishing line, where they map far beyond the wall in
      // the intended direction (the caller then clamps to the zone limit).
      const center = wall.quad.reduce(
        (sum, corner) => point(sum.x + corner.x / wall.quad.length, sum.y + corner.y / wall.quad.length),
        point(0, 0)
      );
      const centerDenominator = g * center.x + h * center.y + i;
      const pointerDenominator = g * stagePoint.x + h * stagePoint.y + i;
      const minimum = 0.02 * Math.abs(centerDenominator);
      if (Math.abs(centerDenominator) > 1e-12 && pointerDenominator * Math.sign(centerDenominator) < minimum) {
        const t = (0.98 * centerDenominator) / (centerDenominator - pointerDenominator);
        stagePoint = point(center.x + (stagePoint.x - center.x) * t, center.y + (stagePoint.y - center.y) * t);
      }
    }
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

  /**
   * Validation messages for the editor. Errors (broken wall shape, missing
   * wall, unprojectable placement) block export; layout hints (outside the
   * green area, doorway, small on screen, overlap, unconfirmed green area,
   * empty room, unplaced artworks) never block export.
   */
  private collectCalibrationIssues(): CalibrationIssue[] {
    const issues: CalibrationIssue[] = [];
    for (const wall of this.resolution.walls) {
      const name = wallLabel(wall.id);
      if (quadIsDegenerate(wall.quad) || !quadIsConvex(wall.quad)) {
        issues.push({ level: 'error', wallId: wall.id, text: `${name}: Die Wandfläche ist ungültig.` });
      }
      if (wall.safePolygon.length < 3) {
        issues.push({ level: 'error', wallId: wall.id, text: `${name}: Der Sicherheitsbereich benötigt mindestens drei Punkte.` });
      }
      if (wall.mountingZone.length < 3) {
        issues.push({ level: 'error', wallId: wall.id, text: `${name}: Die grüne Wandfläche benötigt mindestens drei Punkte.` });
      } else if (
        wall.mountingZone.length !== 4
        || quadIsDegenerate(wall.mountingZone as unknown as Quad)
        || !quadIsConvex(wall.mountingZone as unknown as Quad)
      ) {
        issues.push({ level: 'error', wallId: wall.id, text: `${name}: Die grüne Wandfläche darf sich nicht überkreuzen.` });
      }
      if (!wall.mountingZoneConfirmed) {
        issues.push({ level: 'hint', wallId: wall.id, text: `${name}: Grüne Fläche noch nicht als geprüft markiert.` });
      }
    }
    const visibleByPage = new Map<number, { slot: ResolvedHubSlot; quad: ProjectedArtworkGeometry }[]>();
    const artworkCountByPage = new Map<number, number>();
    for (const view of this.slotViews) {
      const { slot } = view;
      if (!slot.selectable || !slot.artworkId) continue;
      artworkCountByPage.set(slot.pageIndex, (artworkCountByPage.get(slot.pageIndex) ?? 0) + 1);
      const base = { slotId: slot.id, pageIndex: slot.pageIndex, wallId: slot.placement.wallId };
      const wall = this.resolution.wallById.get(slot.placement.wallId);
      if (!wall) {
        issues.push({ ...base, level: 'error', text: `Zugewiesene Wand ${slot.placement.wallId} fehlt.` });
        continue;
      }
      const ownedWallId = this.calibrationWallOwnership.get(slot.id);
      if (ownedWallId && slot.placement.wallId !== ownedWallId) {
        issues.push({ ...base, level: 'error', text: `Wandzuordnung wurde von ${wallLabel(ownedWallId)} zu ${wallLabel(slot.placement.wallId)} geändert.` });
      }
      const evaluation = evaluateDisplayedPlacement(wall, slot.placement, this.displayedAspectForSlot(slot), this.resolution.stage);
      const projection = evaluation.projection;
      if (!projection) {
        issues.push({ ...base, level: 'error', text: 'Position kann nicht berechnet werden.' });
        continue;
      }
      if (!evaluation.insideMountingZone) {
        issues.push({ ...base, level: 'hint', text: 'Das Bild liegt nicht vollständig in der grünen Wandfläche.' });
      }
      if (!evaluation.doorwayClear) {
        issues.push({ ...base, level: 'hint', text: 'Das Bild überschneidet einen Türbereich.' });
      }
      if (projection.shortEdge < HUB_MIN_PROJECTED_SHORT_EDGE_PX) {
        issues.push({
          ...base,
          level: 'hint',
          text: `Das Bild wirkt klein (${projection.shortEdge.toFixed(0)} px, empfohlen mindestens ${HUB_MIN_PROJECTED_SHORT_EDGE_PX} px).`,
        });
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
            issues.push({
              level: 'hint',
              slotId: current.slot.id,
              pageIndex,
              text: `überschneidet ${placeLabel(next.slot.id, next.slot.placement.wallId)}.`,
            });
          }
        }
      }
    }
    for (let pageIndex = 0; pageIndex < this.pageCount; pageIndex += 1) {
      if ((artworkCountByPage.get(pageIndex) ?? 0) === 0) {
        issues.push({ level: 'hint', pageIndex, text: 'Der Raum ist leer und wird in der Galerie übersprungen.' });
      }
    }
    const unplaced = this.unplacedArtworkIds().length;
    if (unplaced > 0) {
      issues.push({
        level: 'hint',
        text: this.autoPlaceUnmappedSetting
          ? `${countLabel(unplaced, 'Bild wird', 'Bilder werden')} in der Galerie automatisch in zusätzliche Räume gehängt.`
          : `${countLabel(unplaced, 'Bild ist', 'Bilder sind')} nicht platziert und in der Galerie unsichtbar.`,
      });
    }
    return issues;
  }

  /** "Raum 2 · Frontwand links: " prefix for a message. */
  private issuePrefix(issue: CalibrationIssue): string {
    const parts: string[] = [];
    if (issue.pageIndex !== undefined) parts.push(this.roomLabelFor(issue.pageIndex));
    if (issue.slotId) parts.push(placeLabel(issue.slotId, issue.wallId));
    return parts.length > 0 ? `${parts.join(' · ')}: ` : '';
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
      const projection = wall ? this.projectDisplayedSlot(slot, wall) : null;
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
        wallThickness: this.resolution.room.wallThickness,
        floorOutline: this.resolution.room.floorOutline.map((corner) => ({
          x: this.round(corner.x),
          z: this.round(corner.z),
        })),
      },
      hangingRules: this.resolution.hangingRules,
      walls: this.resolution.configuredWalls.map((sourceWall) => {
        const wall = this.resolution.wallById.get(sourceWall.id);
        if (!wall) {
          return sourceWall.id === 'wall-rear' && this.entranceBoundaryQuad
            ? { ...sourceWall, quad: this.entranceBoundaryQuad.map((corner) => this.roundPoint(corner)) }
            : sourceWall;
        }
        return {
          id: wall.id,
          group: wall.group,
          ...(sourceWall.role ? { role: sourceWall.role } : {}),
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
        };
      }),
      fallbacks: { ...this.resolution.fallbacks, autoPlaceUnmapped: this.autoPlaceUnmappedSetting },
      slotsPerPage: this.resolution.slotsPerPage,
      ...(this.resolution.galleryRoomViews.length > 0
        ? { galleryRoomViews: this.resolution.galleryRoomViews }
        : {}),
      rooms: this.resolution.rooms.map((room) => (room.name ? { id: room.id, name: room.name } : { id: room.id })),
      slots: this.slotViews.map(({ slot }) => ({
        id: slot.id,
        enabled: slot.disabledReason !== 'explicitly-disabled',
        selectable: slot.selectable,
        ...(slot.artworkId ? { artworkId: slot.artworkId } : {}),
        placement: exportHubSlotPlacement(slot.placement),
      })),
    };
  }

  private get activeCalibrationSlot(): ResolvedHubSlot | null {
    return this.slotViews.find(({ slot }) => slot.id === this.activeCalibrationSlotId)?.slot ?? null;
  }

  private selectCalibrationSlot(slotId: string, options: { deferred?: boolean } = {}): void {
    const view = this.slotViews.find(({ slot }) => slot.id === slotId);
    if (!view) return;
    // Selecting a place in another room (list, message, keyboard) opens that room.
    if (view.slot.pageIndex !== this.currentPageIndex()) this.goToPage(view.slot.pageIndex, view.slot);
    const previousWallId = this.activeCalibrationWallId;
    const changed = this.activeCalibrationSlotId !== slotId;
    this.activeCalibrationSlotId = slotId;
    if (this.calibrationEditMode !== 'room-boundary') {
      this.activeCalibrationWallId = view.slot.placement.wallId;
      if (this.calibrationWallSelect) this.calibrationWallSelect.value = view.slot.placement.wallId;
    }
    if (changed) {
      for (const candidate of this.slotViews) {
        candidate.button.classList.toggle('is-calibration-selected', candidate.slot.id === slotId);
      }
    }
    if (options.deferred) {
      // Pressing an artwork only marks it; the overlay (when the wall
      // changed) follows in the next frame and the panels after the drag.
      if (changed || previousWallId !== this.activeCalibrationWallId) {
        this.scheduleDeferredSelectionRefresh(previousWallId !== this.activeCalibrationWallId);
      }
      return;
    }
    this.cancelDeferredSelectionRefresh();
    this.syncCalibrationControls();
    this.updateCalibrationArtworkInfo();
    this.renderCalibrationOverlay();
    this.syncEditorToolState();
    this.refreshEditorPanels();
  }

  private static readonly DRAG_THRESHOLD_PX = 3;

  private deferredSelectionRaf = 0;
  private deferredSelectionPending = false;
  private deferredSelectionWallChanged = false;
  private readonly editorTimings: Record<string, number> = {};

  private scheduleDeferredSelectionRefresh(wallChanged: boolean): void {
    this.deferredSelectionPending = true;
    this.deferredSelectionWallChanged ||= wallChanged;
    if (this.deferredSelectionRaf !== 0) return;
    this.deferredSelectionRaf = requestAnimationFrame(() => {
      this.deferredSelectionRaf = 0;
      if (!this.deferredSelectionPending) return;
      if (this.calibrationDrag?.kind === 'slot') {
        // During a drag only the green zone of a newly selected wall is
        // needed; controls and panels follow on release.
        if (this.deferredSelectionWallChanged) {
          this.deferredSelectionWallChanged = false;
          this.renderCalibrationOverlay();
        }
        return;
      }
      this.flushDeferredSelectionRefresh();
    });
  }

  private cancelDeferredSelectionRefresh(): void {
    if (this.deferredSelectionRaf !== 0) cancelAnimationFrame(this.deferredSelectionRaf);
    this.deferredSelectionRaf = 0;
    this.deferredSelectionPending = false;
    this.deferredSelectionWallChanged = false;
  }

  /** Runs the selection refresh postponed by an artwork press. */
  private flushDeferredSelectionRefresh(renderOverlay = true): void {
    if (!this.deferredSelectionPending) return;
    this.cancelDeferredSelectionRefresh();
    this.syncCalibrationControls();
    this.updateCalibrationArtworkInfo();
    if (renderOverlay) this.renderCalibrationOverlay();
    this.syncEditorToolState();
    this.refreshEditorPanels();
  }

  /** Editor input timings for diagnostics and the browser drag test. */
  private recordEditorTiming(name: string, value: number): void {
    this.editorTimings[name] = Math.round(value * 10) / 10;
    this.element.dataset['editorTiming'] = JSON.stringify(this.editorTimings);
  }

  // ── Rooms and artwork assignment (v1.35) ──────────────────────────────────

  private roomLabelFor(pageIndex: number): string {
    return roomLabel(pageIndex, this.resolution.rooms[pageIndex]?.name);
  }

  private currentRoomLabel(): string {
    return this.roomLabelFor(this.currentPageIndex());
  }

  private firstSlotOfPage(pageIndex: number): SlotView | undefined {
    const views = this.slotViews.filter((view) => view.slot.pageIndex === pageIndex);
    return views.find((view) => view.slot.artworkId) ?? views[0];
  }

  private unplacedArtworkIds(): string[] {
    const placed = new Set(this.slotViews.map((view) => view.slot.artworkId).filter((id): id is string => Boolean(id)));
    return this.resolution.artworkCatalog.filter((entry) => !placed.has(entry.id)).map((entry) => entry.id);
  }

  private goToRoom(pageIndex: number, announce = true): void {
    if (pageIndex < 0 || pageIndex >= this.pageCount) return;
    this.goToPage(pageIndex);
    const first = this.firstSlotOfPage(pageIndex);
    if (first) this.selectCalibrationSlot(first.slot.id);
    else this.refreshEditorPanels();
    if (announce) this.announceCalibrationAction(`${this.currentRoomLabel()} von ${this.pageCount} geöffnet.`);
  }

  private currentEditableConfig(): MuseumHubConfig & HubEditableConfig {
    return this.buildCurrentCalibrationConfig() as MuseumHubConfig & HubEditableConfig;
  }

  /**
   * Applies a room/assignment change as one undo step, rebuilds the affected
   * places, and opens the requested room.
   */
  private applyRoomChange(config: HubEditableConfig, focus: { roomId?: string; slotId?: string }, message: string): void {
    if (this.calibrationDrag) return;
    this.recordCalibrationHistory();
    this.applyCalibrationSnapshot(JSON.stringify(config));
    const slotView = focus.slotId ? this.slotViews.find((view) => view.slot.id === focus.slotId) : undefined;
    if (slotView) {
      this.selectCalibrationSlot(slotView.slot.id);
    } else if (focus.roomId) {
      const pageIndex = this.resolution.rooms.findIndex((room) => room.id === focus.roomId);
      if (pageIndex >= 0) this.goToRoom(pageIndex, false);
    }
    this.announceCalibrationAction(message);
  }

  private addRoom(duplicate: boolean): void {
    const current = this.resolution.rooms[this.currentPageIndex()];
    const name = duplicate ? `${current?.name || this.currentRoomLabel()} (Kopie)` : undefined;
    const result = addRoomToConfig(this.currentEditableConfig(), {
      afterRoomId: current?.id,
      templateRoomId: current?.id,
      ...(name ? { name } : {}),
    });
    this.applyRoomChange(result.config, { roomId: result.roomId }, '');
    this.announceCalibrationAction(
      `${this.currentRoomLabel()} von ${this.pageCount} ${duplicate ? 'als Kopie' : 'neu'} angelegt. Leere Plätze sind gestrichelt; im Bereich „Bilder“ Kunstwerke zuweisen.`
    );
    this.editorTabs?.select('artworks');
  }

  private deleteCurrentRoom(artworkTarget: 'unplaced' | 'previous'): void {
    const pageIndex = this.currentPageIndex();
    const room = this.resolution.rooms[pageIndex];
    if (!room) return;
    const label = this.roomLabelFor(pageIndex);
    const result = deleteRoomFromConfig(this.currentEditableConfig(), room.id, artworkTarget);
    if (!result) {
      this.announceCalibrationAction('Der einzige Raum kann nicht gelöscht werden.');
      return;
    }
    const moved = result.movedArtworkIds.length;
    const unplaced = result.unplacedArtworkIds.length;
    this.applyRoomChange(
      result.config,
      { roomId: result.targetRoomId ?? undefined },
      `${label} gelöscht.${moved > 0 ? ` ${countLabel(moved, 'Bild', 'Bilder')} verschoben.` : ''}${
        unplaced > 0 ? ` ${countLabel(unplaced, 'Bild ist', 'Bilder sind')} jetzt nicht platziert.` : ''
      }`
    );
  }

  private renameCurrentRoom(name: string): void {
    const room = this.resolution.rooms[this.currentPageIndex()];
    if (!room || room.name === name.trim()) return;
    this.applyRoomChange(
      renameRoomInConfig(this.currentEditableConfig(), room.id, name),
      { roomId: room.id },
      name.trim() ? `Raum umbenannt in „${name.trim()}“.` : 'Raumname entfernt.'
    );
  }

  private moveCurrentRoom(delta: -1 | 1): void {
    const room = this.resolution.rooms[this.currentPageIndex()];
    if (!room) return;
    const next = moveRoomInConfig(this.currentEditableConfig(), room.id, delta);
    if (!next) return;
    this.applyRoomChange(next, { roomId: room.id }, '');
    this.announceCalibrationAction(`Raum ist jetzt ${this.currentRoomLabel()} von ${this.pageCount}.`);
  }

  /** Puts an artwork into a place (swapping if it hangs elsewhere) or empties the place. */
  private assignArtwork(slotId: string, artworkId: string | null): void {
    const target = this.slotViews.find((view) => view.slot.id === slotId);
    if (!target) return;
    if (artworkId && target.slot.artworkId === artworkId) return;
    const result = assignArtworkInConfig(this.currentEditableConfig(), slotId, artworkId);
    if (!result) return;
    const place = `${this.roomLabelFor(target.slot.pageIndex)} · ${placeLabel(slotId, target.slot.placement.wallId)}`;
    const title = (id: string | null): string =>
      this.resolution.artworkCatalog.find((entry) => entry.id === id)?.title ?? id ?? '';
    let message: string;
    if (!artworkId) {
      message = `„${title(result.replacedArtworkId)}“ von ${place} entfernt; es ist jetzt nicht platziert.`;
    } else if (result.swappedWithSlotId && result.replacedArtworkId) {
      message = `„${title(artworkId)}“ und „${title(result.replacedArtworkId)}“ getauscht.`;
    } else if (result.replacedArtworkId) {
      message = `„${title(artworkId)}“ hängt jetzt auf ${place}; „${title(result.replacedArtworkId)}“ ist nicht platziert.`;
    } else {
      message = `„${title(artworkId)}“ hängt jetzt auf ${place}.`;
    }
    this.applyRoomChange(result.config, { slotId }, message);
    this.editorToast?.show(
      artworkId
        ? `${title(artworkId)} → ${place}${result.swappedWithSlotId && result.replacedArtworkId ? ` (getauscht mit ${title(result.replacedArtworkId)})` : ''}`
        : `${title(result.replacedArtworkId)} → nicht platziert`,
      () => this.undoCalibration()
    );
  }

  private currentPlacementPlaces(): PlacementPlace[] {
    const pageIndex = this.currentPageIndex();
    return this.slotViews
      .filter((view) => view.slot.pageIndex === pageIndex && !view.slot.disabledReason)
      .map((view) => ({
        slotId: view.slot.id,
        label: placeLabel(view.slot.id, view.slot.placement.wallId),
        artworkId: view.slot.artworkId,
      }));
  }

  private placementArtworks(): PlacementArtwork[] {
    const pageIndex = this.currentPageIndex();
    const slotByArtwork = new Map(
      this.slotViews.filter((view) => view.slot.artworkId).map((view) => [view.slot.artworkId!, view.slot])
    );
    return this.resolution.artworkCatalog.map((entry) => {
      const slot = slotByArtwork.get(entry.id);
      return {
        id: entry.id,
        title: entry.title,
        thumbnail: this.artworkThumbnailUrl(entry.id),
        slotId: slot?.id ?? null,
        location: !slot ? 'unplaced' : slot.pageIndex === pageIndex ? 'here' : 'other',
        placeText: slot ? `${this.roomLabelFor(slot.pageIndex)} · ${placeLabel(slot.id, slot.placement.wallId)}` : null,
      };
    });
  }

  private artworkThumbnailUrl(artworkId: string | null): string | null {
    if (!artworkId) return null;
    const plan = resolveArtworkImageSources(this.resolution.artworkSourceById.get(artworkId) ?? null);
    return (plan.fallback ?? plan.primary)?.resolvedUrl ?? null;
  }

  /** "+ Neuer Raum" from the artwork menu: adds a room and hangs the artwork in its first place. */
  private placeArtworkInNewRoom(artworkId: string): void {
    const current = this.resolution.rooms[this.currentPageIndex()];
    const added = addRoomToConfig(this.currentEditableConfig(), { afterRoomId: current?.id, templateRoomId: current?.id });
    const firstSlotId = added.config.slots.find((slot) => slot.id.startsWith(`${added.roomId}.`))?.id;
    const assigned = firstSlotId ? assignArtworkInConfig(added.config, firstSlotId, artworkId) : null;
    const config = assigned?.config ?? added.config;
    const title = this.resolution.artworkCatalog.find((entry) => entry.id === artworkId)?.title ?? artworkId;
    this.applyRoomChange(config, firstSlotId ? { slotId: firstSlotId } : { roomId: added.roomId }, '');
    const message = `${title} → ${this.currentRoomLabel()} (neu)`;
    this.announceCalibrationAction(`Neuer Raum angelegt. ${message}.`);
    this.editorToast?.show(message, () => this.undoCalibration());
  }

  private autoFillCurrentRoom(): void {
    const pageIndex = this.currentPageIndex();
    const empty = this.slotViews.filter(
      (view) => view.slot.pageIndex === pageIndex && !view.slot.artworkId && !view.slot.disabledReason
    );
    const unplaced = this.unplacedArtworkIds();
    if (empty.length === 0 || unplaced.length === 0) return;
    let config: HubEditableConfig = this.currentEditableConfig();
    let filled = 0;
    for (const view of empty) {
      const artworkId = unplaced[filled];
      if (!artworkId) break;
      const result = assignArtworkInConfig(config, view.slot.id, artworkId);
      if (!result) continue;
      config = result.config;
      filled += 1;
    }
    this.applyRoomChange(
      config,
      { slotId: empty[0]?.slot.id },
      `${countLabel(filled, 'leerer Platz', 'leere Plätze')} in ${this.roomLabelFor(pageIndex)} gefüllt.`
    );
  }

  private setAutoPlaceUnmapped(enabled: boolean): void {
    if (this.autoPlaceUnmappedSetting === enabled) return;
    this.recordCalibrationHistory();
    this.autoPlaceUnmappedSetting = enabled;
    this.updateCalibrationOutput(true);
    this.announceCalibrationAction(
      enabled
        ? 'Nicht platzierte Bilder werden in der Galerie automatisch in zusätzliche Räume gehängt.'
        : 'Nicht platzierte Bilder bleiben in der Galerie unsichtbar.'
    );
  }

  private setActiveMountingZoneConfirmed(confirmed: boolean): void {
    const wall = this.activeCalibrationWallId ? this.resolution.wallById.get(this.activeCalibrationWallId) : null;
    if (!wall || wall.mountingZoneConfirmed === confirmed) return;
    this.recordCalibrationHistory();
    wall.mountingZoneConfirmed = confirmed;
    this.updateCalibrationOutput(true);
    this.renderCalibrationOverlay();
    this.syncCalibrationControls();
    this.syncEditorToolState();
    this.announceCalibrationAction(
      `${wallLabel(wall.id)}: grüne Fläche ${confirmed ? 'als geprüft markiert' : 'nicht mehr als geprüft markiert'}.`
    );
  }

  /** Opens the room, place, or wall of a validation message. */
  private openCalibrationIssue(issue: CalibrationIssue): void {
    if (issue.slotId && this.slotViews.some((view) => view.slot.id === issue.slotId)) {
      this.selectCalibrationSlot(issue.slotId);
      this.editorTabs?.select('artworks');
      this.slotViews.find((view) => view.slot.id === issue.slotId)?.button.focus({ preventScroll: true });
    } else if (issue.pageIndex !== undefined) {
      this.goToRoom(issue.pageIndex, false);
      this.editorTabs?.select('artworks');
    } else if (issue.wallId) {
      this.activeCalibrationWallId = issue.wallId;
      if (this.calibrationWallSelect) this.calibrationWallSelect.value = issue.wallId;
      this.renderCalibrationOverlay();
      this.syncEditorToolState();
      this.editorTabs?.select('room');
    } else {
      this.editorTabs?.select('artworks');
    }
    this.announceCalibrationAction(`${this.issuePrefix(issue)}${issue.text}`);
  }

  /** Refreshes the room bar, place cards, artwork list, and detail heading. */
  private refreshEditorPanels(): void {
    if (!this.calibrating || !this.roomBar || !this.artworkLibrary) return;
    const pageIndex = this.currentPageIndex();
    const issuesByPage = new Map<number, CalibrationIssue[]>();
    const issuesBySlot = new Map<string, CalibrationIssue[]>();
    for (const issue of this.calibrationIssues) {
      if (issue.pageIndex !== undefined) {
        const list = issuesByPage.get(issue.pageIndex) ?? [];
        list.push(issue);
        issuesByPage.set(issue.pageIndex, list);
      }
      if (issue.slotId) {
        const list = issuesBySlot.get(issue.slotId) ?? [];
        list.push(issue);
        issuesBySlot.set(issue.slotId, list);
      }
    }
    this.roomBar.update(
      this.resolution.rooms.map((room, index) => {
        const issues = issuesByPage.get(index) ?? [];
        return {
          id: room.id,
          name: room.name,
          artworkCount: this.slotViews.filter((view) => view.slot.pageIndex === index && view.slot.artworkId).length,
          status: statusOfIssues(issues),
          issueCount: issues.length,
        };
      }),
      pageIndex
    );
    const thumbnail = (artworkId: string | null): string | null => this.artworkThumbnailUrl(artworkId);
    const titleOf = (artworkId: string | null): string | null =>
      artworkId ? this.resolution.artworkCatalog.find((entry) => entry.id === artworkId)?.title ?? artworkId : null;
    const places: LibraryPlace[] = this.slotViews
      .filter((view) => view.slot.pageIndex === pageIndex && !view.slot.disabledReason)
      .map((view) => ({
        slotId: view.slot.id,
        label: placeLabel(view.slot.id, view.slot.placement.wallId),
        artworkId: view.slot.artworkId,
        title: titleOf(view.slot.artworkId),
        thumbnail: thumbnail(view.slot.artworkId),
        status: statusOfIssues(issuesBySlot.get(view.slot.id) ?? []),
      }));
    const slotByArtwork = new Map(
      this.slotViews.filter((view) => view.slot.artworkId).map((view) => [view.slot.artworkId!, view.slot])
    );
    const artworks: LibraryArtwork[] = this.resolution.artworkCatalog.map((entry) => {
      const slot = slotByArtwork.get(entry.id);
      return {
        id: entry.id,
        title: entry.title,
        thumbnail: thumbnail(entry.id),
        slotId: slot?.id ?? null,
        location: !slot ? 'unplaced' : slot.pageIndex === pageIndex ? 'here' : 'other',
        placeText: slot ? `${this.roomLabelFor(slot.pageIndex)} · ${placeLabel(slot.id, slot.placement.wallId)}` : null,
      };
    });
    this.artworkLibrary.update({
      roomTitle: this.currentRoomLabel(),
      places,
      artworks,
      activeSlotId: this.activeCalibrationSlotId,
    });
    this.placementController?.refreshHighlights();
    const active = this.activeCalibrationSlot;
    if (this.editorDetailTitle && this.editorDetailBody) {
      this.editorDetailTitle.textContent = active
        ? `Gewählt: ${placeLabel(active.id, active.placement.wallId)}`
        : 'Kein Platz gewählt';
      this.editorDetailBody.textContent = active
        ? active.artworkId
          ? `„${titleOf(active.artworkId)}“ in ${this.roomLabelFor(active.pageIndex)}.`
          : 'Leerer Platz. Ein Bild aus der Liste unten anklicken oder hierher ziehen.'
        : 'Einen Platz oder ein Bild wählen.';
    }
    if (this.removeArtworkButton) this.removeArtworkButton.disabled = !active?.artworkId;
    if (this.editorStatusButton) {
      const status = statusOfIssues(this.calibrationIssues);
      const errors = this.calibrationIssues.filter((issue) => issue.level === 'error').length;
      const hints = this.calibrationIssues.length - errors;
      this.editorStatusButton.className = `museum-hub__editor-status is-${status}`;
      this.editorStatusButton.textContent = errors > 0
        ? countLabel(errors, 'Fehler', 'Fehler')
        : hints > 0 ? countLabel(hints, 'Hinweis', 'Hinweise') : 'Alles bereit';
      this.editorStatusButton.setAttribute('aria-label', `Status: ${this.editorStatusButton.textContent}. Speichern öffnen.`);
    }
  }

  /**
   * Brings the slot views in line with a snapshot's rooms and assignments:
   * removes places that no longer exist or changed artwork, adds new ones,
   * moves places between rooms, and rebuilds the room layers once.
   */
  private reconcileSlotInventory(config: MuseumHubConfig): void {
    const next = resolveMuseumHub(this.artworks, config, undefined, { editor: true, autoPlaceUnmapped: false });
    const nextSlots = next.pages.flatMap((page) => page.slots);
    const nextById = new Map(nextSlots.map((slot) => [slot.id, slot]));
    for (let index = this.slotViews.length - 1; index >= 0; index -= 1) {
      const view = this.slotViews[index]!;
      const target = nextById.get(view.slot.id);
      if (
        target
        && target.artworkId === view.slot.artworkId
        && target.selectable === view.slot.selectable
        && target.disabledReason === view.slot.disabledReason
      ) {
        view.slot.pageIndex = target.pageIndex;
        continue;
      }
      view.imageLoadToken += 1;
      view.button.remove();
      view.shadowPath.remove();
      this.hubRoomRenderer?.removeSlot(view.slot.id, false);
      this.projectedSlotGeometry.delete(view.slot.id);
      const objectUrl = this.editorArtworkObjectUrls.get(view.slot.id);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      this.editorArtworkObjectUrls.delete(view.slot.id);
      this.slotViews.splice(index, 1);
    }
    this.pageCount = Math.max(1, next.rooms.length);
    this.resolution.rooms = next.rooms;
    this.resolution.explicitRooms = true;
    this.syncRoomLayers();
    const existing = new Map(this.slotViews.map((view) => [view.slot.id, view]));
    const ordered: SlotView[] = [];
    for (const slot of nextSlots) {
      let view = existing.get(slot.id);
      if (!view) {
        view = this.buildSlotButton(slot, false);
        if (!this.calibrationWallOwnership.has(slot.id)) this.calibrationWallOwnership.set(slot.id, slot.placement.wallId);
      }
      ordered.push(view);
      this.roomLayers[view.slot.pageIndex]
        ?.querySelector<SVGSVGElement>('.museum-hub__shadows')
        ?.appendChild(view.shadowPath);
      this.roomLayers[view.slot.pageIndex]?.appendChild(view.button);
    }
    this.slotViews.splice(0, this.slotViews.length, ...ordered);
    const pages: ResolvedHubPage[] = [];
    for (let pageIndex = 0; pageIndex < this.pageCount; pageIndex += 1) {
      pages.push({ pageIndex, slots: ordered.filter((view) => view.slot.pageIndex === pageIndex).map((view) => view.slot) });
    }
    this.resolution.pages = pages;
    const slotToArtwork = new Map<string, string>();
    const artworkToSlot = new Map<string, string>();
    for (const { slot } of ordered) {
      if (!slot.selectable || !slot.artworkId) continue;
      slotToArtwork.set(slot.id, slot.artworkId);
      artworkToSlot.set(slot.artworkId, slot.id);
    }
    this.resolution.slotToArtwork = slotToArtwork;
    this.resolution.artworkToSlot = artworkToSlot;
    this.resolution.unplacedArtworkIds = this.unplacedArtworkIds();
    this.applyView();
    this.decodedPages.clear();
    for (let pageIndex = 0; pageIndex < this.pageCount; pageIndex += 1) void this.decodePageImages(pageIndex);
    if (this.activeCalibrationSlotId && !this.slotViews.some((view) => view.slot.id === this.activeCalibrationSlotId)) {
      this.activeCalibrationSlotId = null;
    }
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
    slot.placement.physicalHeight ??= slot.placement.mountedHeight;
    slot.placement.mountedHeight = slot.placement.physicalHeight;
    slot.placement.mountingGap ??= 0.002;
  }

  private isSlotPlacementInsideMountingZone(slot: ResolvedHubSlot, wall: ResolvedHubWall): boolean {
    return evaluateDisplayedPlacement(wall, slot.placement, this.displayedAspectForSlot(slot), this.resolution.stage).valid;
  }

  /**
   * Resizes around the fixed centre. When the requested size would leave the
   * mounting zone, it stops at the largest valid size between the previous
   * and requested height instead of overshooting.
   */
  private setSlotHeightClampedToMountingZone(
    slot: ResolvedHubSlot,
    wall: ResolvedHubWall,
    requestedLocalHeight: number
  ): void {
    const toMetres = (localHeight: number): number => wall.room
      ? Math.max(0.12, Math.min(wall.room.height, localHeight * wall.room.height))
      : Math.max(0.04, Math.min(0.9, localHeight));
    const applyHeight = (height: number): boolean => {
      slot.placement.mountedHeight = height;
      slot.placement.physicalHeight = height;
      return this.isSlotPlacementInsideMountingZone(slot, wall);
    };
    const previousHeight = slot.placement.physicalHeight ?? slot.placement.mountedHeight;
    const requestedHeight = toMetres(requestedLocalHeight);
    if (applyHeight(requestedHeight) || !applyHeight(previousHeight)) {
      applyHeight(requestedHeight);
      return;
    }
    let valid = previousHeight;
    let invalid = requestedHeight;
    for (let iteration = 0; iteration < 16; iteration += 1) {
      const middle = (valid + invalid) / 2;
      if (applyHeight(middle)) valid = middle;
      else invalid = middle;
    }
    applyHeight(valid);
  }

  /**
   * Moves a slot toward `requestedCenter` (wall-local unit coordinates) while
   * keeping the complete displayed artwork inside the green mounting zone and
   * clear of doorways. Blocked motion stops at the limit and slides along it
   * (shared `slideToValid` solver) instead of being pulled toward the zone
   * centroid, so every reachable edge of the zone, including the top, can be
   * reached. Returns false when no valid position exists (placement unchanged).
   */
  private setSlotCenterClampedToMountingZone(
    slot: ResolvedHubSlot,
    wall: ResolvedHubWall,
    requestedCenter: Point2D
  ): boolean {
    if (!wall.room) return false;
    const room = wall.room;
    const previous = {
      center: clonePoint(slot.placement.center),
      uv: slot.placement.uv ? clonePoint(slot.placement.uv) : undefined,
      anchor: slot.placement.anchor ? clonePoint(slot.placement.anchor) : undefined,
    };
    const restorePrevious = (): void => {
      slot.placement.center = previous.center;
      slot.placement.uv = previous.uv;
      slot.placement.anchor = previous.anchor;
      this.syncCanonicalPlacement(slot, wall);
    };
    // Other artworks in the same room act as obstacles, unless the moved
    // artwork already overlaps one (then it may be dragged free).
    const obstacles = this.slotViews
      .filter(({ slot: other }) => other.id !== slot.id && other.pageIndex === slot.pageIndex && other.selectable && other.artworkId)
      .map(({ slot: other }) => this.projectedSlotGeometry.get(other.id)?.projectedQuad)
      .filter((quad): quad is Quad => Boolean(quad));
    const overlapsObstacle = (): boolean => {
      if (obstacles.length === 0) return false;
      const own = this.projectDisplayedSlot(slot, wall);
      return Boolean(own && obstacles.some((quad) => polygonsIntersect(own.projectedQuad, quad)));
    };
    const placeCenter = (center: Point2D): void => {
      slot.placement.center = point(this.clampLocalX(center.x), this.clampLocalY(center.y));
      slot.placement.uv = point(slot.placement.center.x, 1 - slot.placement.center.y);
      this.syncCanonicalPlacement(slot, wall);
    };
    placeCenter(previous.center);
    const avoidOverlap = !overlapsObstacle();
    const applyCenter = (center: Point2D): boolean => {
      placeCenter(center);
      return this.isSlotPlacementInsideMountingZone(slot, wall) && (!avoidOverlap || !overlapsObstacle());
    };
    const metricDistance = (a: Point2D, b: Point2D): number =>
      Math.hypot((a.x - b.x) * room.width, (a.y - b.y) * room.height);
    const target = point(this.clampLocalX(requestedCenter.x), this.clampLocalY(requestedCenter.y));
    let start = point(this.clampLocalX(previous.center.x), this.clampLocalY(previous.center.y));

    if (!applyCenter(start) && !applyCenter(target)) {
      // The current placement is already invalid (e.g. after a wall edit):
      // start from the closest valid point between the zone centre and the
      // request so the artwork re-enters the zone near where it was.
      const refit = this.findNearestValidSlotCenter(wall, target, applyCenter);
      if (!refit) {
        restorePrevious();
        this.lastSlotDragBlocked = null;
        return false;
      }
      start = refit;
    }
    const result = slideToValid(start, target, applyCenter, { distance: metricDistance });
    applyCenter(result.point);
    this.lastSlotDragBlocked = result.blocked ? { slotId: slot.id, target } : null;
    return true;
  }

  /**
   * Nearest valid centre on the segment from `preferred` toward the zone
   * centre, or null when even the zone centre cannot host the artwork.
   */
  private findNearestValidSlotCenter(
    wall: ResolvedHubWall,
    preferred: Point2D,
    applyCenter: (center: Point2D) => boolean
  ): Point2D | null {
    if (wall.mountingZone.length < 3) return null;
    const zoneCenter = wall.mountingZone.reduce(
      (sum, current) => point(sum.x + current.x / wall.mountingZone.length, sum.y + current.y / wall.mountingZone.length),
      point(0, 0)
    );
    const localZoneCenter = this.applyInverseHomography(wall, zoneCenter);
    if (!localZoneCenter || !applyCenter(localZoneCenter)) return null;
    // advanceToValid walks from the valid zone centre toward the preferred
    // point and returns the last valid position before the boundary.
    return advanceToValid(localZoneCenter, preferred, applyCenter);
  }

  private syncCalibrationControls(): void {
    const slot = this.activeCalibrationSlot;
    const wall = slot ? this.resolution.wallById.get(slot.placement.wallId) : null;
    if (slot && wall) this.syncCanonicalPlacement(slot, wall);
    // Shown in metres from the wall's left edge and centimetres from the wall.
    const wallWidth = wall?.room?.width ?? 1;
    const values: Record<string, number> = {
      horizontalPosition: (slot?.placement.horizontalPosition ?? 0) * wallWidth,
      centerHeight: slot?.placement.centerHeight ?? 0,
      physicalHeight: slot?.placement.physicalHeight ?? 0,
      mountingGap: (slot?.placement.mountingGap ?? 0.002) * 100,
    };
    for (const [field, input] of this.calibrationFields) {
      input.value = slot ? values[field]?.toFixed(field === 'mountingGap' ? 1 : 2) ?? '' : '';
      input.disabled = !slot;
      if (field === 'horizontalPosition') input.max = wallWidth.toFixed(2);
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
        point(this.clampLocalX(value / wall.room.width), slot.placement.center.y)
      );
    } else if (field === 'centerHeight') {
      this.setSlotCenterClampedToMountingZone(
        slot,
        wall,
        point(slot.placement.center.x, 1 - this.clampLocalY(value / wall.room.height))
      );
    } else if (field === 'physicalHeight') {
      slot.placement.physicalHeight = Math.max(0.04, Math.min(wall.room.height, value));
      slot.placement.mountedHeight = slot.placement.physicalHeight;
    } else if (field === 'mountingGap') {
      slot.placement.mountingGap = Math.max(0.001, Math.min(0.03, value / 100));
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

  /**
   * Moves the active artwork by a real wall distance in metres (`up` is
   * positive). Falls back to wall-normalized units for walls without a room.
   */
  private nudgeActiveArtwork(rightMetres: number, upMetres: number, recordHistory = true): void {
    const slot = this.activeCalibrationSlot;
    if (!slot) return;
    const wall = this.resolution.wallById.get(slot.placement.wallId);
    if (!wall) return;
    if (recordHistory) this.recordCalibrationHistory();
    const width = wall.room?.width ?? 1;
    const height = wall.room?.height ?? 1;
    this.setSlotCenterClampedToMountingZone(
      slot,
      wall,
      point(slot.placement.center.x + rightMetres / width, slot.placement.center.y - upMetres / height)
    );
    this.lastSlotDragBlocked = null;
    this.applyAllSlotGeometry();
    this.renderCalibrationOverlay();
    this.updateCalibrationOutput(true);
    this.syncCalibrationControls();
    this.announceSlotPosition(slot);
  }

  /** Screen-reader announcement of the artwork position in real units. */
  private announceSlotPosition(slot: ResolvedHubSlot): void {
    const wall = this.resolution.wallById.get(slot.placement.wallId);
    const room = wall?.room;
    const fromLeft = room ? (slot.placement.horizontalPosition ?? 0) * room.width : null;
    const centerHeight = slot.placement.centerHeight;
    const valid = wall ? this.isSlotPlacementInsideMountingZone(slot, wall) : false;
    this.announceCalibrationAction(
      fromLeft !== null && centerHeight !== undefined
        ? `${placeLabel(slot.id, slot.placement.wallId)}: ${fromLeft.toFixed(2)} m von links, Mitte ${centerHeight.toFixed(2)} m hoch${valid ? '' : ' (außerhalb der grünen Fläche)'}.`
        : `${placeLabel(slot.id, slot.placement.wallId)} verschoben.`
    );
  }

  /**
   * While an artwork drag is blocked, highlights the green-zone edges (or the
   * doorway) that stopped it. Cleared on release by the overlay re-render.
   */
  private renderDragLimitHighlight(slot: ResolvedHubSlot, wall: ResolvedHubWall): void {
    const svg = this.calibrationSvg;
    if (!svg) return;
    svg.querySelectorAll('[data-calibration-limit]').forEach((element) => element.remove());
    const blocked = this.lastSlotDragBlocked;
    if (!blocked || blocked.slotId !== slot.id || !wall.room) return;
    const probe: ResolvedHubSlot = {
      ...slot,
      placement: { ...slot.placement, uv: point(blocked.target.x, 1 - blocked.target.y) },
    };
    this.syncCanonicalPlacement(probe, wall);
    const evaluation = evaluateDisplayedPlacement(wall, probe.placement, this.displayedAspectForSlot(slot), this.resolution.stage);
    if (!evaluation.projection) return;
    const edges = new Set<string>();
    for (const corner of evaluation.projection.projectedQuad) {
      if (pointInPolygon(corner, wall.mountingZone)) continue;
      const edge = nearestPolygonEdge(corner, wall.mountingZone);
      if (!edge) continue;
      const key = `${edge[0].x},${edge[0].y}`;
      if (edges.has(key)) continue;
      edges.add(key);
      const line = this.appendSvgLine(edge[0], edge[1], 'museum-hub__calibration-limit');
      line?.setAttribute('data-calibration-limit', 'zone-edge');
    }
    if (!evaluation.doorwayClear && wall.camera) {
      for (const doorway of projectRoomDoorwayPolygons(wall.room, wall.camera, this.resolution.stage)) {
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', this.pointsToSvg(doorway));
        polygon.setAttribute('class', 'museum-hub__calibration-limit museum-hub__calibration-limit--doorway');
        polygon.setAttribute('data-calibration-limit', 'doorway');
        svg.appendChild(polygon);
      }
    }
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

  /** Restores the opened wall shapes and green areas; rooms and assignments stay. */
  private resetCalibration(): void {
    if (!this.initialCalibrationSnapshot) return;
    const initial = JSON.parse(this.initialCalibrationSnapshot) as MuseumHubConfig;
    const current = this.currentEditableConfig();
    this.recordCalibrationHistory();
    this.editorGeometryDirty = false;
    for (const wall of this.resolution.walls) this.restoreInitialEditorWall(wall.id);
    this.applyCalibrationSnapshot(JSON.stringify({ ...current, walls: initial.walls, background: initial.background }));
    this.announceCalibrationAction('Wände und grüne Flächen wurden zurückgesetzt. Räume und Bilder bleiben erhalten.');
  }

  private restoreInitialEditorWall(wallId: string): void {
    const wall = this.resolution.wallById.get(wallId);
    const initial = this.initialEditorCorners.get(wallId);
    if (!wall?.room || !initial) return;
    initial.forEach((corner, index) => {
      wall.room!.corners[index].x = corner.x;
      wall.room!.corners[index].y = corner.y;
      wall.room!.corners[index].z = corner.z;
    });
    const frame = deriveWallFrame(wall.room.corners);
    if (!frame) return;
    wall.room.origin = { ...frame.origin };
    wall.room.axisU = { ...frame.axisU };
    wall.room.axisV = { ...frame.axisV };
    wall.room.width = frame.width;
    wall.room.height = frame.height;
  }

  private resetSelectedCalibrationBoundary(): void {
    const wallId = this.activeCalibrationWallId;
    if (!wallId || !this.initialCalibrationSnapshot) return;
    const initial = JSON.parse(this.initialCalibrationSnapshot) as {
      walls: Array<{ id: string; quad: Quad; safePolygon?: Point2D[]; mountingZone?: Point2D[]; mountingZoneConfirmed?: boolean }>;
    };
    const current = this.buildCurrentCalibrationConfig() as MuseumHubConfig;
    const initialWall = initial.walls.find((wall) => wall.id === wallId);
    const currentWall = current.walls.find((wall) => wall.id === wallId);
    this.recordCalibrationHistory();
    if (wallId === 'wall-rear') {
      const initialBoundary = initialWall?.quad;
      if (initialBoundary) {
        this.entranceBoundaryQuad = initialBoundary.map((corner) => clonePoint(corner)) as unknown as Quad;
        this.renderCalibrationOverlay();
        this.updateCalibrationOutput(true);
      }
      this.announceCalibrationAction('Eingangsbereich zurückgesetzt.');
      return;
    }
    if (!initialWall || !currentWall) {
      return;
    }
    this.restoreInitialEditorWall(wallId);
    currentWall.quad = initialWall.quad.map((corner) => clonePoint(corner)) as unknown as Quad;
    currentWall.safePolygon = (initialWall.safePolygon ?? []).map((corner) => clonePoint(corner));
    currentWall.mountingZone = (initialWall.mountingZone ?? []).map((corner) => clonePoint(corner));
    currentWall.mountingZoneConfirmed = initialWall.mountingZoneConfirmed;
    this.applyCalibrationSnapshot(JSON.stringify(current));
    this.announceCalibrationAction(`${wallLabel(wallId)} zurückgesetzt.`);
  }

  private focusCalibrationWall(): void {
    if (!this.calibrationSvg || !this.activeCalibrationWallId) return;
    const wall = this.calibrationSvg.querySelector<SVGPolygonElement>(
      `[data-calibration-wall="${this.activeCalibrationWallId}"], [data-calibration-envelope="${this.activeCalibrationWallId}"]`
    );
    wall?.focus();
  }

  private announceCalibrationAction(message: string): void {
    if (this.calibrationActionStatus) this.calibrationActionStatus.textContent = message;
  }

  private async copyCalibrationJson(): Promise<void> {
    if (!this.calibrationExportValid || !this.calibrationOutput) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    let copied = false;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(this.calibrationOutput.value);
      copied = true;
    } catch {
      const details = this.calibrationOutput.closest('details');
      if (details && !details.open) {
        details.open = true;
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      }
      this.calibrationOutput.focus();
      this.calibrationOutput.select();
      try {
        copied = document.execCommand('copy');
      } catch {
        copied = false;
      }
      if (copied) trigger?.focus();
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

  private downloadArtworkDiagnostics(): void {
    const selectedView = this.activeCalibrationSlotId
      ? this.slotViews.find((view) => view.slot.id === this.activeCalibrationSlotId) ?? null
      : null;
    const entries = this.slotViews
      .filter(({ slot }) => slot.selectable && slot.artworkId)
      .map((view) => {
        const wall = this.resolution.wallById.get(view.slot.placement.wallId);
        const projection = this.projectedSlotGeometry.get(view.slot.id) ?? null;
        const renderer = this.hubRoomRenderer?.inspectArtwork(view.slot.id) ?? null;
        const width = view.nativeWidth ?? view.image?.naturalWidth ?? 0;
        const height = view.nativeHeight ?? view.image?.naturalHeight ?? 0;
        const native = width > 0 && height > 0 ? width / height : null;
        const physicalHeight = view.slot.placement.physicalHeight ?? view.slot.placement.mountedHeight;
        return {
          slotId: view.slot.id,
          artworkId: view.slot.artworkId,
          wallId: view.slot.placement.wallId,
          source: {
            state: view.imageState,
            mode: view.resolvedSource?.mode ?? null,
            urlType: view.resolvedSource?.resolvedUrlType ?? null,
            fallbackReason: view.fallbackReason,
            revision: view.assetRevision,
            nativeWidth: width,
            nativeHeight: height,
            nativeAspect: native,
          },
          physical: {
            width: native === null ? null : physicalHeight * native,
            height: physicalHeight,
            ratio: native,
          },
          projection: projection
            ? {
                projectedQuad: projection.projectedQuad,
                bounds: projection.bounds,
                sourceWidth: projection.sourceWidth,
                sourceHeight: projection.sourceHeight,
                sourceRatio: projection.sourceWidth / projection.sourceHeight,
                cssMatrix3d: projection.cssMatrix3d,
                wallProjection: wall?.quad ?? null,
              }
            : null,
          dom: {
            buttonRect: view.button.getBoundingClientRect().toJSON(),
            imageRect: view.image?.getBoundingClientRect().toJSON() ?? null,
            imageNaturalWidth: view.image?.naturalWidth ?? 0,
            imageNaturalHeight: view.image?.naturalHeight ?? 0,
            computedTransform: view.image ? getComputedStyle(view.image).transform : null,
            visible: Boolean(view.image && getComputedStyle(view.image).opacity !== '0'),
          },
          webgl: renderer,
        };
      });
    const diagnostics = {
      schemaVersion: 1,
      createdAt: new Date().toISOString(),
      appVersion: document.documentElement.dataset['version'] ?? null,
      bundleId: selectedView?.resolvedSource?.bundleId ?? null,
      runtime: {
        url: window.location.href,
        protocol: window.location.protocol,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        devicePixelRatio: window.devicePixelRatio,
        webglAvailable: Boolean(this.hubRoomRenderer),
        maxTextureSize: this.hubRoomRenderer?.getMaxTextureSize() ?? null,
      },
      selection: {
        wallId: this.activeCalibrationWallId,
        slotId: this.activeCalibrationSlotId,
        artworkId: selectedView?.slot.artworkId ?? null,
        mode: this.calibrating ? 'calibration' : 'gallery',
      },
      entries,
      validation: {
        exportValid: this.calibrationExportValid,
        issues: this.collectCalibrationIssues(),
      },
    };
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const url = URL.createObjectURL(new Blob([JSON.stringify(diagnostics, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `freyraum-artwork-diagnostics-${stamp}.json`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    this.announceCalibrationAction('Diagnose-Datei wurde heruntergeladen.');
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
    let sanitized = sanitizeMuseumHubConfig(parsed);
    if (!sanitized.config) {
      this.announceCalibrationAction(
        `Import blockiert: ${sanitized.warnings.join(' ') || 'ungültige Konfiguration'}`
      );
      return;
    }
    const baselineConfig = this.initialCalibrationSnapshot
      ? sanitizeMuseumHubConfig(JSON.parse(this.initialCalibrationSnapshot)).config
      : sanitizeMuseumHubConfig(this.buildCurrentCalibrationConfig()).config;
    // Rooms, room count, and artwork assignment may differ; only the fixed
    // camera/room/wall model must match the opened editor.
    if (!baselineConfig || hubFixedFieldsSignature(sanitized.config) !== hubFixedFieldsSignature(baselineConfig)) {
      this.announceCalibrationAction(
        'Import blockiert: Kamera, Raumform, Wandmodell oder andere feste Editor-Einstellungen weichen ab.'
      );
      return;
    }
    const baselineWalls = new Map(baselineConfig.walls.map((wall) => [wall.id, wall]));
    const changedRenderedWall = sanitized.config.walls.find((wall) => {
      if (wall.role === 'bounds-only') return false;
      const baseline = baselineWalls.get(wall.id);
      const quad = wall.quad;
      const baselineQuad = baseline?.quad;
      return (
        !baseline ||
        !quad ||
        !baselineQuad ||
        quad.length !== baselineQuad.length ||
        quad.some(
          (corner, index) =>
            Math.abs(corner.x - baselineQuad[index]!.x) > 1e-6 ||
            Math.abs(corner.y - baselineQuad[index]!.y) > 1e-6
        )
      );
    });
    if (changedRenderedWall) {
      this.announceCalibrationAction(
        `Import blockiert: Form von ${wallLabel(changedRenderedWall.id)} weicht von der geöffneten Wandkalibrierung ab.`
      );
      return;
    }
    const unexpectedBoundsWall = sanitized.config.walls.find(
      (wall) => wall.role === 'bounds-only' && wall.id !== 'wall-rear'
    );
    if (unexpectedBoundsWall) {
      this.announceCalibrationAction(
        `Import blockiert: ${unexpectedBoundsWall.id} ist kein unterstützter Raumgrenzbereich.`
      );
      return;
    }
    const known = new Set(this.resolution.artworkCatalog.map((entry) => entry.id));
    const dropped = dropUnknownArtworkAssignments(sanitized.config, known);
    sanitized = { ...sanitized, config: dropped.config };
    this.recordCalibrationHistory();
    this.applyCalibrationSnapshot(JSON.stringify(sanitized.config), false);
    this.goToRoom(0, false);
    this.announceCalibrationAction(
      `Konfiguration mit ${countLabel(this.pageCount, 'Raum', 'Räumen')} importiert und geprüft.${
        dropped.droppedArtworkIds.length > 0
          ? ` Unbekannte Kunstwerke entfernt: ${dropped.droppedArtworkIds.join(', ')}.`
          : ''
      }`
    );
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
    const issues: CalibrationIssue[] = [
      ...this.collectCalibrationIssues(),
      ...this.calibrationRoundTripWarnings(json).map((text): CalibrationIssue => ({ level: 'error', text })),
    ];
    if (this.editorGeometryDirty) {
      issues.push({
        level: 'error',
        text: 'Geänderte 3D-Wandecken können in v5 noch nicht gespeichert werden. „Zurücksetzen“ stellt die Wände wieder her.',
      });
    }
    this.calibrationIssues = issues;
    // Only real errors block saving; layout hints never do.
    this.calibrationExportValid = !issues.some((issue) => issue.level === 'error');
    if (this.calibrationOutput) this.calibrationOutput.value = json;
    if (this.calibrationCopyButton) this.calibrationCopyButton.disabled = !this.calibrationExportValid;
    if (this.calibrationDownloadButton) this.calibrationDownloadButton.disabled = !this.calibrationExportValid;
    for (const view of this.slotViews) {
      const level = statusOfIssues(issues.filter((issue) => issue.slotId === view.slot.id));
      view.button.classList.toggle('is-invalid-calibration', level !== 'ok');
      view.button.classList.toggle('is-calibration-error', level === 'error');
      view.button.setAttribute('aria-invalid', String(level === 'error'));
    }
    this.saveTab?.update({
      issues: issues.map((issue) => ({ ...issue, prefix: this.issuePrefix(issue) })),
      exportValid: this.calibrationExportValid,
      autoPlace: this.autoPlaceUnmappedSetting,
      unplacedCount: this.unplacedArtworkIds().length,
      proofs: this.calibrationExportValid ? this.collectCalibrationProofs() : [],
    });
    if (this.calibrationExportValid && commitLastValid) {
      this.lastValidCalibrationSnapshot = json;
      this.saveTab?.setRestoreAvailable(true);
    }
    this.refreshEditorPanels();
    this.onlineEditor?.notifyChange();
    this.diagnostics.info('hub-calibration', 'Museum hub wall-plane calibration snapshot', { issues, config });
  }

  private restoreLastValidCalibrationSnapshot(): void {
    if (!this.lastValidCalibrationSnapshot) return;
    this.recordCalibrationHistory();
    this.applyCalibrationSnapshot(this.lastValidCalibrationSnapshot);
  }

  private applyCalibrationSnapshot(snapshot: string, applyRenderedWallGeometry = true): void {
    const sanitized = sanitizeMuseumHubConfig(JSON.parse(snapshot));
    const config = sanitized.config;
    if (!config) return;
    const activeBackgroundSrc = this.resolution.background.src;
    const activeBackgroundObjectUrl = this.editorBackgroundObjectUrl;
    const shouldRevokeBackgroundObjectUrl =
      Boolean(activeBackgroundObjectUrl && config.background.src !== activeBackgroundSrc);
    for (const wall of config.walls) {
      if (wall.id === 'wall-rear' && wall.quad && wall.quad.length === 4) {
        if (applyRenderedWallGeometry) {
          this.entranceBoundaryQuad = wall.quad.map((corner) => clonePoint(corner)) as unknown as Quad;
        }
        continue;
      }
      const currentWall = this.resolution.wallById.get(wall.id);
      if (!currentWall) continue;
      if ((wall.role === 'bounds-only') !== !currentWall.room) continue;
      if (applyRenderedWallGeometry && wall.quad && wall.quad.length === currentWall.quad.length) {
        currentWall.quad = wall.quad.map((corner) => clonePoint(corner)) as unknown as Quad;
      }
      if (!applyRenderedWallGeometry && wall.role !== 'bounds-only') {
        // Keep guide polygons paired with the fixed rendered quad. Imported
        // polygons use the import's coordinate space and cannot be copied
        // safely when rendered geometry is intentionally preserved.
        currentWall.mountingZoneConfirmed = wall.mountingZoneConfirmed === true;
        continue;
      }
      if (!applyRenderedWallGeometry) continue;
      const nextSafe = wall.safePolygon ?? [];
      currentWall.safePolygon.splice(0, currentWall.safePolygon.length, ...nextSafe.map((corner) => clonePoint(corner)));
      currentWall.mountingZone.splice(
        0,
        currentWall.mountingZone.length,
        ...(wall.mountingZone ?? wall.safePolygon ?? []).map((corner) => clonePoint(corner))
      );
      currentWall.mountingZoneConfirmed = wall.mountingZoneConfirmed === true;
    }
    this.resolution.background = { ...config.background };
    this.resolution.galleryRoomViews = config.galleryRoomViews ?? [];
    this.galleryRoomEditor?.refresh(this.resolution.galleryRoomViews);
    const safeBackgroundObjectUrl =
      activeBackgroundObjectUrl?.startsWith('blob:') ? activeBackgroundObjectUrl : null;
    setResolvedBackgroundSource(
      this.backgroundImage,
      this.onlineEditor?.pendingBackgroundUrl(config.background.src)
        ?? (safeBackgroundObjectUrl && config.background.src === activeBackgroundSrc
          ? safeBackgroundObjectUrl
          : resolveBackgroundUrl(config.background.src))
    );
    if (shouldRevokeBackgroundObjectUrl && activeBackgroundObjectUrl) {
      URL.revokeObjectURL(activeBackgroundObjectUrl);
      this.editorBackgroundObjectUrl = null;
    }
    this.backgroundImage.style.objectFit = config.background.fit ?? 'contain';
    this.element.style.setProperty('--hub-aspect', String(config.background.aspect));
    if (this.calibrating) {
      this.autoPlaceUnmappedSetting = config.fallbacks.autoPlaceUnmapped === true;
      if (!this.calibrationDrag) this.reconcileSlotInventory(config);
    }
    for (const slot of config.slots) {
      const currentSlot = this.slotViews.find((view) => view.slot.id === slot.id)?.slot;
      if (!currentSlot) continue;
      if (slot.placement.wallId !== currentSlot.placement.wallId) {
        this.diagnostics.warn(
          'hub-calibration-wall-ownership',
          'Calibration snapshot slot skipped because wall ownership is immutable',
          {
            slotId: slot.id,
            expectedWallId: currentSlot.placement.wallId,
            receivedWallId: slot.placement.wallId,
          }
        );
        continue;
      }
      const wall = this.resolution.wallById.get(slot.placement.wallId);
      if (!wall?.room) continue;
      currentSlot.placement.horizontalPosition =
        slot.placement.horizontalPosition ?? currentSlot.placement.horizontalPosition;
      currentSlot.placement.centerHeight =
        slot.placement.centerHeight ?? currentSlot.placement.centerHeight;
      currentSlot.placement.physicalHeight =
        slot.placement.physicalHeight ?? currentSlot.placement.physicalHeight;
      currentSlot.placement.mountingGap = slot.placement.mountingGap;
      currentSlot.placement.mountedHeight =
        currentSlot.placement.physicalHeight ?? currentSlot.placement.mountedHeight;
      currentSlot.placement.uv = point(
        currentSlot.placement.horizontalPosition ?? currentSlot.placement.center.x,
        (currentSlot.placement.centerHeight ?? wall.room.height / 2) / wall.room.height
      );
      this.syncCanonicalPlacement(currentSlot, wall);
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
    window.removeEventListener('blur', this.handleCalibrationBlur);
    this.element.removeEventListener('pointerdown', this.handleSwipeStart);
    this.element.removeEventListener('pointerup', this.handleSwipeEnd);
    this.element.removeEventListener('pointercancel', this.handleSwipeCancel);
    this.element.removeEventListener('pointerdown', this.handlePanPointerDown);
    this.element.removeEventListener('pointermove', this.handlePanPointerMove);
    this.element.removeEventListener('pointerup', this.handlePanPointerUp);
    this.element.removeEventListener('pointercancel', this.handlePanPointerCancel);
    this.element.removeEventListener('click', this.handleClickCapture, true);
    this.stopPanAnimation();
    this.element.removeEventListener('keydown', this.handleKeydown);
    this.entryButton.removeEventListener('click', this.handleActivate);
    this.activateCallback = null;
    this.selectSlotCallback = null;
    if (this.editorBackgroundObjectUrl) URL.revokeObjectURL(this.editorBackgroundObjectUrl);
    this.editorBackgroundObjectUrl = null;
    this.onlineEditor?.dispose();
    this.onlineEditor = null;
    this.hubRoomRenderer?.dispose();
    this.projectedSlotGeometry.clear();
    this.debugProjectionSignatureBySlot.clear();
    this.slotViews.length = 0;
    this.roomLayers.length = 0;
    this.element.remove();
  }
}
