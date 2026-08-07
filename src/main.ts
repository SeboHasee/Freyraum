import './styles/main.scss';

import * as THREE from 'three';

import { artworks as builtInArtworks, type Artwork } from './config/artworks';
import { getQualityPreset, type QualityPresetId } from './config/quality';
import { RendererManager } from './core/RendererManager';
import { GalleryPresentationStage } from './core/GalleryPresentationStage';
import { SceneManager } from './core/SceneManager';
import { PostProcessing } from './core/PostProcessing';
import { LightingSetup } from './lighting/LightingSetup';
import { TextureManager } from './gallery/TextureManager';
import { ArtworkMesh } from './gallery/ArtworkMesh';
import { GalleryManager, type ArtworkViewportMetrics, type FullGalleryReadinessResult } from './gallery/GalleryManager';
import { Topbar } from './ui/Topbar';
import { InfoPanel } from './ui/InfoPanel';
import { NavigationControls } from './ui/NavigationControls';
import { HintText } from './ui/HintText';
import { ZoomControls } from './ui/ZoomControls';
import { FullscreenButton } from './ui/FullscreenButton';
import { PreferencesPanel } from './ui/PreferencesPanel';
import { ChromeVisibilityManager } from './ui/ChromeVisibilityManager';
import { AudioControls } from './ui/AudioControls';
import { showFallbackScreen } from './ui/FallbackScreen';
import { Timeline } from './timeline/Timeline';
import { KeyboardNav } from './interaction/KeyboardNav';
import { KeyboardHelp } from './ui/KeyboardHelp';
import { CanvasInteraction } from './interaction/CanvasInteraction';
import { MainMuseumHub } from './hub/MainMuseumHub';
import { resolveMuseumHub } from './config/museumHub';
import { normalizeArtworkPresentation } from './config/presentation';
import { DestinationRouter } from './navigation/DestinationRouter';
import { BackgroundAudioManager, type BackgroundAudioPayload } from './audio/BackgroundAudioManager';
import { PreferencesStore } from './utils/preferences';
import { isWebGLAvailable } from './utils/webgl';
import { FrameBudgetMonitor } from './utils/FrameBudgetMonitor';
import { installPerformanceTooling } from './utils/performanceTooling';
import { AdaptiveQualityController } from './utils/AdaptiveQualityController';
import { maybeProbeWebGPU } from './rendering/RenderBackend';
import { getDiagnostics } from './utils/Diagnostics';
import { detectDeviceCapabilities, applyDeviceCaps, type DeviceCapabilities } from './utils/device';
import { suggestStartupQuality } from './utils/performance';
import {
  resolveStartupReadinessMode,
  computeEntryTargetCount,
  WARM_BUDGET,
  type StartupReadinessMode,
} from './config/startup';

const KEY_LIGHT_WORLD = new THREE.Vector3();
const KEY_LIGHT_VIEW = new THREE.Vector3();
const MIN_LOADING_SCREEN_MS = 500;
// v0.68 P-06: warm-budget defaults are centralised in `config/startup.ts`
// (WARM_BUDGET) so runtime behaviour and diagnostics share one source of truth.
const DEFAULT_GPU_WARM_CRITICAL_COUNT = WARM_BUDGET.defaultPreEntryWarmCount;
const DEFAULT_GPU_WARM_FRAME_BUDGET_MS = WARM_BUDGET.defaultPostRevealFrameBudgetMs;
const DEFAULT_GPU_WARM_BATCH_CAP = WARM_BUDGET.defaultPostRevealBatchCap;
const QUALITY_PREWARM_IDS: readonly QualityPresetId[] = ['high', 'balanced', 'battery'];

/**
 * v0.25 T-01/T-02/T-05: Yields to the browser compositor for one animation
 * frame. Calling this between GPU warm renders lets the GPU flush its pending
 * command queue and allows the browser to paint loading-bar progress updates.
 */
function rafYield(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/**
 * v0.25 T-02/T-05: Drains `frames` consecutive animation frames so the GPU
 * can fully flush any batched upload queue before the next phase begins.
 */
async function rafDrain(frames: number): Promise<void> {
  for (let i = 0; i < frames; i += 1) {
    await rafYield();
  }
}

interface LoadingOverlayControls {
  overlay: HTMLDivElement;
  setProgress(value: number): void;
  setStatus(text: string): void;
  reveal(): Promise<void>;
  dispose(): void;
}

/**
 * Extracts the first numeric component from a computed CSS value or custom
 * property. This keeps viewport measuring resilient when custom properties
 * contain wrappers such as `max(...)`, `calc(...)`, or `env(...)`; invalid
 * values fall back to 0.
 */
function parseCssNumeric(value: string): number {
  const parsed = Number.parseFloat(value);
  if (Number.isFinite(parsed)) return parsed;
  const fallback = value.match(/-?\d+(?:\.\d+)?/);
  return fallback ? Number.parseFloat(fallback[0]) : 0;
}

function isHubDebugEnabled(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('hubDebug') === '1';
  } catch {
    return false;
  }
}

function normalizeCssColorToHex(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const color = new THREE.Color();
  try {
    color.setStyle(trimmed);
    return `#${color.getHexString().toUpperCase()}`;
  } catch {
    return null;
  }
}

function probeClassBackground(className: string): { backgroundColor: string; backgroundImage: string } | null {
  if (!document.body) return null;
  const probe = document.createElement('div');
  probe.className = className;
  probe.style.position = 'fixed';
  probe.style.left = '-10000px';
  probe.style.top = '-10000px';
  probe.style.width = '4px';
  probe.style.height = '4px';
  document.body.appendChild(probe);
  const style = getComputedStyle(probe);
  const snapshot = {
    backgroundColor: style.backgroundColor,
    backgroundImage: style.backgroundImage,
  };
  probe.remove();
  return snapshot;
}

interface WarmProfile {
  criticalRadius: number;
  preEntryWarmCount: number;
  postRevealFrameBudgetMs: number;
  postRevealBatchCap: number;
}

interface UiPrewarmResult {
  elementsMeasured: number;
  temporarilyOpenedPanels: number;
}

function rendererSizeSnapshot(renderer: THREE.WebGLRenderer): { width: number; height: number; pixelRatio: number } {
  const size = new THREE.Vector2();
  renderer.getSize(size);
  return {
    width: size.x,
    height: size.y,
    pixelRatio: renderer.getPixelRatio(),
  };
}

function prewarmInteractiveChrome(
  app: HTMLElement,
  diagnostics: ReturnType<typeof getDiagnostics>
): UiPrewarmResult {
  const selectors = [
    '.topbar',
    '.info-panel',
    '.nav-controls',
    '.nav-btn',
    '.zoom-controls',
    '.zoom-btn',
    '.prefs',
    '.prefs__trigger',
    '.timeline',
    '.timeline__arrow',
    '.timeline__counter',
    '.timeline__thumb',
    '.audio-controls',
    '.audio-controls button',
    '.fullscreen-btn',
  ];
  let elementsMeasured = 0;
  for (const selector of selectors) {
    app.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      void el.offsetWidth;
      void el.offsetHeight;
      void el.getBoundingClientRect();
      void getComputedStyle(el).opacity;
      elementsMeasured += 1;
    });
  }

  let temporarilyOpenedPanels = 0;
  const prefsPanel = app.querySelector<HTMLElement>('.prefs__panel');
  if (prefsPanel?.hidden) {
    prefsPanel.hidden = false;
    prefsPanel.style.visibility = 'hidden';
    prefsPanel.style.pointerEvents = 'none';
    void prefsPanel.offsetHeight;
    prefsPanel.querySelectorAll<HTMLElement>('input, label, fieldset, legend, h2, p').forEach((el) => {
      void el.offsetHeight;
      void getComputedStyle(el).fontSize;
      elementsMeasured += 1;
    });
    prefsPanel.hidden = true;
    prefsPanel.style.removeProperty('visibility');
    prefsPanel.style.removeProperty('pointer-events');
    temporarilyOpenedPanels += 1;
  }

  diagnostics.info('boot', 'ui-prebuild-complete', 'Interactive chrome prebuilt under loading overlay', {
    elementsMeasured,
    temporarilyOpenedPanels,
  });

  return { elementsMeasured, temporarilyOpenedPanels };
}

function deriveWarmProfile(caps: DeviceCapabilities, artworkCount: number): WarmProfile {
  const isPhone =
    caps.layoutTier === 'phone-small' ||
    caps.layoutTier === 'phone-portrait' ||
    caps.layoutTier === 'phone-landscape';
  const isTablet = caps.layoutTier === 'tablet-portrait' || caps.layoutTier === 'tablet-landscape';

  const criticalRadius = isPhone ? 1 : 2;
  let preEntryWarmCount = DEFAULT_GPU_WARM_CRITICAL_COUNT;
  let postRevealFrameBudgetMs = DEFAULT_GPU_WARM_FRAME_BUDGET_MS;
  let postRevealBatchCap = DEFAULT_GPU_WARM_BATCH_CAP;

  if (isPhone) {
    preEntryWarmCount = 4;
    postRevealFrameBudgetMs = 5;
    postRevealBatchCap = 1;
  } else if (isTablet) {
    preEntryWarmCount = 5;
    postRevealFrameBudgetMs = 6;
    postRevealBatchCap = 1;
  } else {
    preEntryWarmCount = 7;
    postRevealFrameBudgetMs = 8;
    postRevealBatchCap = 2;
  }

  if (artworkCount >= 50) {
    preEntryWarmCount = Math.max(3, preEntryWarmCount - 1);
    postRevealBatchCap = 1;
  }

  return {
    criticalRadius,
    preEntryWarmCount: Math.min(artworkCount, preEntryWarmCount),
    postRevealFrameBudgetMs,
    postRevealBatchCap,
  };
}

/**
 * v0.07: validates `window.__FREYRAUM_ARTWORKS` and returns a clean
 * `Artwork[]` or `null`. Each entry is validated for the minimal field set
 * required by the gallery; anything malformed is dropped with a diagnostic
 * note rather than crashing the runtime. This keeps the customer preview
 * resilient even if the import script writes a partially valid manifest.
 */
function sanitizeInjectedArtworks(
  raw: unknown,
  diagnostics: ReturnType<typeof getDiagnostics>
): readonly Artwork[] | null {
  if (raw === undefined || raw === null) return null;
  if (!Array.isArray(raw)) {
    diagnostics.warn('boot', 'artworks-injected-invalid', 'Ignoring injected artworks: not an array', {
      typeOf: typeof raw,
    });
    return null;
  }
  const out: Artwork[] = [];
  const seenIds = new Set<string>();
  let rejected = 0;
  for (const candidate of raw) {
    if (!candidate || typeof candidate !== 'object') {
      rejected++;
      continue;
    }
    const a = candidate as Record<string, unknown>;
    const id = typeof a['id'] === 'string' ? (a['id'] as string).trim() : '';
    const image = typeof a['image'] === 'string' ? (a['image'] as string).trim() : '';
    const dims = a['dimensions'] as { width?: unknown; height?: unknown } | undefined;
    const width = typeof dims?.width === 'number' && Number.isFinite(dims.width) ? dims.width : 0;
    const height = typeof dims?.height === 'number' && Number.isFinite(dims.height) ? dims.height : 0;
    if (!id || !image || width <= 0 || height <= 0 || seenIds.has(id)) {
      rejected++;
      continue;
    }
    seenIds.add(id);
    const title = typeof a['title'] === 'string' && a['title'] ? (a['title'] as string) : id;
    const tagsValue = a['tags'];
    const tags: readonly string[] = Array.isArray(tagsValue)
      ? tagsValue.filter((t): t is string => typeof t === 'string')
      : [];
    // v0.09: accept webglImage only when it is a well-formed data URL so
    // arbitrary script or blob content cannot be injected via the manifest.
    const webglImageRaw = typeof a['webglImage'] === 'string' ? (a['webglImage'] as string) : '';
    const webglImage: string | undefined =
      /^data:image\/[a-zA-Z0-9+.-]+;base64,[A-Za-z0-9+/]/.test(webglImageRaw)
        ? webglImageRaw
        : undefined;
    const rawPresentation =
      typeof a['presentation'] === 'string' ? (a['presentation'] as string) : undefined;
    const presentation = normalizeArtworkPresentation(rawPresentation);
    if (rawPresentation && !presentation) {
      diagnostics.warn('boot', 'artwork-presentation-invalid', 'Ignoring invalid injected artwork presentation', {
        artworkId: id,
        presentation: rawPresentation,
      });
    }
    out.push({
      id,
      title,
      subtitle: typeof a['subtitle'] === 'string' ? (a['subtitle'] as string) : '',
      description: typeof a['description'] === 'string' ? (a['description'] as string) : '',
      year:
        typeof a['year'] === 'number' && Number.isFinite(a['year'])
          ? (a['year'] as number)
          : new Date().getFullYear(),
      medium: typeof a['medium'] === 'string' ? (a['medium'] as string) : '',
      image,
      ...(webglImage ? { webglImage } : {}),
      dimensions: { width, height },
      alt: typeof a['alt'] === 'string' ? (a['alt'] as string) : title,
      credit: typeof a['credit'] === 'string' ? (a['credit'] as string) : '',
      tags,
      surface: typeof a['surface'] === 'string' ? (a['surface'] as string) : '',
      ...(presentation ? { presentation } : {}),
    });
  }
  if (rejected > 0) {
    diagnostics.warn('boot', 'artworks-injected-rejected', 'Some injected artworks were rejected', {
      rejected,
      accepted: out.length,
    });
  }
  return out;
}

function sanitizeInjectedAudio(
  raw: unknown,
  diagnostics: ReturnType<typeof getDiagnostics>
): BackgroundAudioPayload | null {
  if (raw === undefined || raw === null || typeof raw !== 'object') return null;
  const payload = raw as Record<string, unknown>;
  const rawSources = Array.isArray(payload['sources']) ? (payload['sources'] as unknown[]) : [];
  const sources = rawSources
    .map((source) => source as Record<string, unknown>)
    .filter(
      (source) =>
        source &&
        typeof source['src'] === 'string' &&
        typeof source['ext'] === 'string' &&
        typeof source['mime'] === 'string' &&
        typeof source['filename'] === 'string',
    )
    .map((source) => ({
      src: (source['src'] as string).trim(),
      ext: (source['ext'] as string).trim().toLowerCase(),
      mime: (source['mime'] as string).trim().toLowerCase(),
      filename: (source['filename'] as string).trim(),
    }))
    .filter(
      (source) =>
        source.src.startsWith('./audio/') &&
        /^audio\/[a-z0-9.+-]+$/.test(source.mime) &&
        ['.mp3', '.ogg', '.m4a', '.wav'].includes(source.ext),
    );

  if (sources.length === 0) return null;

  const selectedRaw =
    payload['selectedByImporter'] && typeof payload['selectedByImporter'] === 'object'
      ? (payload['selectedByImporter'] as Record<string, unknown>)
      : null;
  const selectedByImporter = selectedRaw
    ? sources.find(
        (source) =>
          source.src === selectedRaw['src'] &&
          source.ext === selectedRaw['ext'] &&
          source.mime === selectedRaw['mime'] &&
          source.filename === selectedRaw['filename'],
      )
    : undefined;

  diagnostics.info('boot', 'audio-source-resolved', 'Background audio payload resolved', {
    sources: sources.map((source) => ({
      file: source.filename,
      ext: source.ext,
      mime: source.mime,
    })),
    selectedByImporter: selectedByImporter?.filename ?? null,
  });

  return {
    sources,
    ...(selectedByImporter ? { selectedByImporter } : {}),
  };
}

function applyResolvedWallSurfaceColor(
  app: HTMLElement,
  tokens: { galleryWall: string; museumWall: string },
  rendererManager?: RendererManager
): { galleryWall: string; museumWall: string } {
  const galleryWall = normalizeCssColorToHex(tokens.galleryWall) ?? tokens.galleryWall.trim();
  const museumWall = normalizeCssColorToHex(tokens.museumWall) ?? galleryWall;
  document.documentElement.style.setProperty('--color-gallery-wall', galleryWall);
  document.documentElement.style.setProperty('--color-museum-wall', museumWall);
  document.documentElement.style.backgroundColor = galleryWall;
  document.body.style.backgroundColor = galleryWall;
  app.style.backgroundColor = galleryWall;
  rendererManager?.setWallClearColor(galleryWall);
  return { galleryWall, museumWall };
}

function resolveRuntimeFallbackSurfaceColor(): string {
  const rootGalleryWall = normalizeCssColorToHex(
    getComputedStyle(document.documentElement).getPropertyValue('--color-gallery-wall')
  );
  return rootGalleryWall ?? '#D8DDDB';
}

function verifyMuseumWallColorConsistency(
  diagnostics: ReturnType<typeof getDiagnostics>,
  reason: string,
  tokens: { galleryWall: string; museumWall: string },
  rendererManager: RendererManager | null,
  museumHubElement: HTMLElement | null,
  loadingOverlayElement: HTMLElement | null,
  appElement: HTMLElement
): void {
  const rootStyle = getComputedStyle(document.documentElement);
  const resolvedGalleryVar = rootStyle.getPropertyValue('--color-gallery-wall').trim();
  const resolvedMuseumVar = rootStyle.getPropertyValue('--color-museum-wall').trim();
  const clearColor = rendererManager?.renderer.getClearColor(new THREE.Color()) ?? null;
  const clearHex = clearColor ? `#${clearColor.getHexString().toUpperCase()}` : null;
  const hubStyle = museumHubElement ? getComputedStyle(museumHubElement) : null;
  const fallbackProbe = probeClassBackground('fallback-screen');
  const bodyStyle = getComputedStyle(document.body);
  const appStyle = getComputedStyle(appElement);
  const loadingStyle = loadingOverlayElement ? getComputedStyle(loadingOverlayElement) : null;

  const expectedGalleryHex = normalizeCssColorToHex(tokens.galleryWall);
  const expectedMuseumHex = normalizeCssColorToHex(tokens.museumWall);
  const galleryVarHex = normalizeCssColorToHex(resolvedGalleryVar);
  const museumVarHex = normalizeCssColorToHex(resolvedMuseumVar);
  const hubBackgroundHex = normalizeCssColorToHex(hubStyle?.backgroundColor ?? null);
  const fallbackBackgroundHex = normalizeCssColorToHex(fallbackProbe?.backgroundColor ?? null);
  const bodyBackgroundHex = normalizeCssColorToHex(bodyStyle.backgroundColor);
  const appBackgroundHex = normalizeCssColorToHex(appStyle.backgroundColor);

  const mismatchSignals: string[] = [];
  if (expectedGalleryHex && clearHex && clearHex !== expectedGalleryHex) mismatchSignals.push(`renderer-clear(${clearHex}) != token.galleryWall(${expectedGalleryHex})`);
  if (expectedGalleryHex && galleryVarHex && galleryVarHex !== expectedGalleryHex) mismatchSignals.push(`--color-gallery-wall(${galleryVarHex}) != token.galleryWall(${expectedGalleryHex})`);
  if (expectedMuseumHex && museumVarHex && museumVarHex !== expectedMuseumHex) mismatchSignals.push(`--color-museum-wall(${museumVarHex}) != token.museumWall(${expectedMuseumHex})`);
  if (expectedMuseumHex && hubBackgroundHex && hubBackgroundHex !== expectedMuseumHex) mismatchSignals.push(`hub-background(${hubBackgroundHex}) != token.museumWall(${expectedMuseumHex})`);
  if (expectedGalleryHex && fallbackBackgroundHex && fallbackBackgroundHex !== expectedGalleryHex) mismatchSignals.push(`fallback-background(${fallbackBackgroundHex}) != token.galleryWall(${expectedGalleryHex})`);
  if (expectedGalleryHex && appBackgroundHex && appBackgroundHex !== expectedGalleryHex) mismatchSignals.push(`app-background(${appBackgroundHex}) != token.galleryWall(${expectedGalleryHex})`);

  const payload = {
    reason,
    tokens,
    rootVariables: {
      gallery: resolvedGalleryVar,
      museum: resolvedMuseumVar,
      galleryHex: galleryVarHex,
      museumHex: museumVarHex,
    },
    rendererClearHex: clearHex,
    surfaces: {
      hubBackgroundColor: hubStyle?.backgroundColor ?? null,
      hubBackgroundImage: hubStyle?.backgroundImage ?? null,
      loadingOverlayBackgroundColor: loadingStyle?.backgroundColor ?? null,
      loadingOverlayBackgroundImage: loadingStyle?.backgroundImage ?? null,
      fallbackProbeBackgroundColor: fallbackProbe?.backgroundColor ?? null,
      fallbackProbeBackgroundImage: fallbackProbe?.backgroundImage ?? null,
      bodyBackgroundColor: bodyStyle.backgroundColor,
      bodyBackgroundImage: bodyStyle.backgroundImage,
      bodyBackgroundHex,
      appBackgroundColor: appStyle.backgroundColor,
      appBackgroundImage: appStyle.backgroundImage,
      appBackgroundHex,
    },
    mismatchSignals,
  };
  if (mismatchSignals.length > 0) {
    diagnostics.warn('surface', 'wall-surface-snapshot-mismatch', 'Museum wall/clear-color consistency mismatch detected', payload);
  } else {
    diagnostics.info('surface', 'wall-surface-snapshot', 'Museum wall/clear-color surfaces resolved consistently', payload);
  }
}

function createLoadingOverlay(app: HTMLElement): LoadingOverlayControls {
  const hints = [
    'Kunstwerke werden vorbereitet …',
    'Texturen werden geladen …',
    'Licht und Schatten werden berechnet …',
    'Atmosphäre wird eingestellt …',
    'Fast fertig …',
  ];
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'polite');
  overlay.setAttribute('aria-label', 'Museum wird geladen');

  // v0.28 X-04 — 12 particles, 3-6 s duration, 4-waypoint random wander.
  // Each particle gets three independent drift vectors (dx1/dy1 through dx3/dy3)
  // injected as CSS custom properties, driven by the `loading-wander` keyframe
  // in main.scss. Larger drift magnitudes (±40–90 px) and shorter durations
  // produce visibly faster, non-regular motion.
  interface ParticleDef {
    x: string; y: string; size: string; color: string;
    duration: string; delay: string;
    dx1: string; dy1: string;
    dx2: string; dy2: string;
    dx3: string; dy3: string;
  }
  const particles: ParticleDef[] = [
    { x: '10%', y: '14%', size: '280px', color: 'rgba(181,154,106,0.32)', duration: '4.2s', delay: '0s',    dx1:  '52px', dy1: '-44px', dx2: '-68px', dy2:  '38px', dx3:  '44px', dy3: '-58px' },
    { x: '78%', y: '12%', size: '340px', color: 'rgba(200,214,229,0.26)', duration: '3.6s', delay: '-1.4s', dx1: '-48px', dy1:  '60px', dx2:  '72px', dy2: '-46px', dx3: '-56px', dy3:  '42px' },
    { x: '16%', y: '74%', size: '400px', color: 'rgba(200,214,229,0.24)', duration: '5.1s', delay: '-2.8s', dx1:  '64px', dy1: '-52px', dx2: '-40px', dy2:  '76px', dx3:  '58px', dy3: '-38px' },
    { x: '84%', y: '70%', size: '290px', color: 'rgba(181,154,106,0.28)', duration: '3.9s', delay: '-0.7s', dx1: '-62px', dy1:  '42px', dx2:  '48px', dy2: '-72px', dx3: '-44px', dy3:  '66px' },
    { x: '50%', y: '6%',  size: '220px', color: 'rgba(181,154,106,0.22)', duration: '4.7s', delay: '-3.5s', dx1:  '44px', dy1:  '68px', dx2: '-76px', dy2: '-40px', dx3:  '60px', dy3:  '52px' },
    { x: '46%', y: '90%', size: '320px', color: 'rgba(200,214,229,0.20)', duration: '3.3s', delay: '-2.1s', dx1: '-58px', dy1: '-62px', dx2:  '82px', dy2:  '44px', dx3: '-48px', dy3: '-70px' },
    { x: '26%', y: '50%', size: '240px', color: 'rgba(181,154,106,0.18)', duration: '5.8s', delay: '-4.4s', dx1:  '70px', dy1:  '46px', dx2: '-44px', dy2: '-80px', dx3:  '38px', dy3:  '64px' },
    { x: '74%', y: '46%', size: '260px', color: 'rgba(200,214,229,0.16)', duration: '4.4s', delay: '-1.9s', dx1: '-46px', dy1:  '72px', dx2:  '60px', dy2: '-48px', dx3: '-68px', dy3:  '56px' },
    { x: '34%', y: '28%', size: '200px', color: 'rgba(181,154,106,0.20)', duration: '3.8s', delay: '-0.5s', dx1:  '58px', dy1: '-76px', dx2: '-50px', dy2:  '60px', dx3:  '76px', dy3: '-42px' },
    { x: '62%', y: '32%', size: '310px', color: 'rgba(200,214,229,0.22)', duration: '5.4s', delay: '-3.1s', dx1: '-72px', dy1: '-48px', dx2:  '44px', dy2:  '84px', dx3: '-60px', dy3: '-52px' },
    { x: '8%',  y: '44%', size: '350px', color: 'rgba(181,154,106,0.16)', duration: '4.0s', delay: '-1.2s', dx1:  '46px', dy1:  '84px', dx2: '-80px', dy2: '-44px', dx3:  '52px', dy3:  '68px' },
    { x: '90%', y: '36%', size: '230px', color: 'rgba(200,214,229,0.18)', duration: '5.6s', delay: '-2.5s', dx1: '-84px', dy1:  '52px', dx2:  '66px', dy2: '-76px', dx3: '-50px', dy3:  '46px' },
  ];
  particles.forEach((p) => {
    const particle = document.createElement('span');
    particle.className = 'loading-particle';
    particle.setAttribute('aria-hidden', 'true');
    particle.style.setProperty('--particle-x', p.x);
    particle.style.setProperty('--particle-y', p.y);
    particle.style.setProperty('--particle-size', p.size);
    particle.style.setProperty('--particle-color', p.color);
    particle.style.setProperty('--particle-duration', p.duration);
    particle.style.setProperty('--particle-delay', p.delay);
    particle.style.setProperty('--particle-drift-x', p.dx1);
    particle.style.setProperty('--particle-drift-y', p.dy1);
    particle.style.setProperty('--particle-drift-x2', p.dx2);
    particle.style.setProperty('--particle-drift-y2', p.dy2);
    particle.style.setProperty('--particle-drift-x3', p.dx3);
    particle.style.setProperty('--particle-drift-y3', p.dy3);
    overlay.appendChild(particle);
  });

  const card = document.createElement('div');
  card.className = 'loading-card';
  const wordmark = document.createElement('div');
  wordmark.className = 'loading-wordmark';
  // v0.27 W-01: inner span carries letter-spacing + padding-left so the
  // flex parent can center the inline box without optical drift.
  const wordmarkText = document.createElement('span');
  wordmarkText.className = 'loading-wordmark__text';
  wordmarkText.textContent = 'FREYRAUM';
  wordmark.appendChild(wordmarkText);
  const subtitle = document.createElement('div');
  subtitle.className = 'loading-subtitle';
  subtitle.textContent = 'Museum wird geladen';
  const track = document.createElement('div');
  track.className = 'loading-progress-track';
  const fill = document.createElement('div');
  fill.className = 'loading-progress-fill';
  track.appendChild(fill);
  const pct = document.createElement('div');
  pct.className = 'loading-progress-pct';
  pct.textContent = '0%';
  const hint = document.createElement('div');
  hint.className = 'loading-hint';
  hint.textContent = hints[0];
  const startButton = document.createElement('button');
  startButton.className = 'loading-start-btn';
  startButton.textContent = 'Museum betreten';
  startButton.setAttribute('aria-label', 'Museum betreten und Ausstellungen entdecken');
  startButton.disabled = true;
  card.append(wordmark, subtitle, track, pct, hint, startButton);
  overlay.appendChild(card);
  app.appendChild(overlay);

  let hintIndex = 0;
  const hintTimer = window.setInterval(() => {
    hintIndex = (hintIndex + 1) % hints.length;
    hint.textContent = hints[hintIndex];
  }, 2000);

  return {
    overlay,
    setProgress(value: number): void {
      const clamped = Math.max(0, Math.min(100, Math.round(value)));
      fill.style.width = `${clamped}%`;
      pct.textContent = `${clamped}%`;
    },
    setStatus(text: string): void {
      subtitle.textContent = text;
      overlay.setAttribute('aria-label', text);
    },
    reveal(): Promise<void> {
      window.clearInterval(hintTimer);
      startButton.disabled = false;
      startButton.classList.add('is-visible');
      // v0.27 W-03: Force CSSOM resolution of the :hover rule and compositor
      // layer promotion immediately after the button becomes interactive.
      // This eliminates the style-recalc spike on first pointer contact.
      void startButton.offsetHeight;
      void getComputedStyle(startButton).backgroundColor;
      startButton.style.setProperty('will-change', 'background-color');
      startButton.addEventListener('click', () => {
        startButton.style.removeProperty('will-change');
      }, { once: true });
      subtitle.textContent = 'Museum bereit — zum Starten klicken';
      hint.textContent = 'Alle Inhalte sind vollständig vorbereitet.';
      overlay.setAttribute('aria-label', 'Museum bereit — zum Starten klicken');
      return new Promise<void>((resolve) => {
        let entered = false;
        const go = (): void => {
          if (entered) return;
          entered = true;
          startButton.disabled = true;
          startButton.removeEventListener('click', go);
          document.removeEventListener('keydown', onKey);
          overlay.classList.add('is-hidden');
          window.setTimeout(() => {
            overlay.remove();
            resolve();
          }, 1300);
        };
        const onKey = (event: KeyboardEvent): void => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          go();
        };
        startButton.addEventListener('click', go);
        document.addEventListener('keydown', onKey);
        startButton.addEventListener('transitionend', () => startButton.focus(), { once: true });
        window.setTimeout(() => startButton.focus(), 650);
      });
    },
    dispose(): void {
      window.clearInterval(hintTimer);
    },
  };
}

async function main(): Promise<void> {
  const bootStartedAt = performance.now();
  const diagnostics = getDiagnostics();
  const hubDebugEnabled = isHubDebugEnabled();
  diagnostics.installGlobalHandlers();
  diagnostics.info('boot', 'startup', 'Starting FREYRAUM runtime');
  if (hubDebugEnabled) {
    diagnostics.info('boot', 'hub-debug-enabled', 'Museum hub debug overlay requested via ?hubDebug=1');
  }

  const app = document.getElementById('app');
  if (!app) {
    diagnostics.error('boot', 'missing-app-root', 'Missing #app root element');
    return;
  }
  app.dataset['experience'] = 'loading';

  // Preferences must apply before WebGL bootstrapping so the fallback
  // screen and loading overlay both react to motion/contrast settings.
  const preferences = new PreferencesStore();
  diagnostics.debug('boot', 'preferences-ready', 'Preferences store created', preferences.current);
  const backgroundAudio = new BackgroundAudioManager();

  // v0.11 — capability-based device detection. Mirrored to <html> data
  // attributes so SCSS, HintText, and CanvasInteraction can react
  // without re-running the detection. Logged once for diagnostics so
  // bug reports always include the device tier.
  const initialCaps = detectDeviceCapabilities();
  applyDeviceCaps(initialCaps);
  diagnostics.info('layout', 'capabilities', 'Device capabilities detected', {
    tier: initialCaps.layoutTier,
    pointer: initialCaps.pointerPrimary,
    hover: initialCaps.hasHover,
    orientation: initialCaps.orientation,
    viewportW: initialCaps.viewportW,
    viewportH: initialCaps.viewportH,
    dpr: initialCaps.dpr,
  });

  // v0.11 / v0.67 — startup quality heuristic is now diagnostics-only.
  // Per the v0.67 quality-lock model, first-run startup must NOT silently
  // switch the preset. We keep a deterministic default (the preference
  // store's DEFAULT_QUALITY_PRESET) and only log what the legacy heuristic
  // would have suggested, so the signal is still visible in diagnostics
  // without changing the user's preset. Stored user choices are unaffected.
  if (!PreferencesStore.hasStoredQuality()) {
    const suggested = suggestStartupQuality();
    if (suggested !== preferences.current.quality) {
      diagnostics.info('quality', 'startup-suggestion-suppressed', 'Startup quality heuristic suppressed (quality lock); keeping deterministic default', {
        kept: preferences.current.quality,
        wouldSuggest: suggested,
        tier: initialCaps.layoutTier,
        pointer: initialCaps.pointerPrimary,
        dpr: initialCaps.dpr,
      });
    }
  }

  // v0.07: customer-managed artworks injected at runtime by
  // `scripts/import-artworks.mjs` via `customer-preview/customer-artworks.js`
  // (Option C: global window injection, see plan.md v0.07).
  const injected = (window as unknown as { __FREYRAUM_ARTWORKS?: unknown }).__FREYRAUM_ARTWORKS;
  const customerArtworks = sanitizeInjectedArtworks(injected, diagnostics);
  const artworks: readonly Artwork[] =
    customerArtworks && customerArtworks.length > 0 ? customerArtworks : builtInArtworks;
  const artworkManifest = artworks.map((a) => ({
    id: a.id,
    hasWebglImage: !!a.webglImage,
    webglImageSource: a.webglImage ? 'embedded-data-url' : 'file-url',
    dimensions: a.dimensions,
    surface: a.surface ?? null,
    presentation: a.presentation ?? null,
  }));
  diagnostics.info('boot', 'artworks-source', 'Artwork source resolved', {
    source: customerArtworks && customerArtworks.length > 0 ? 'customer' : 'built-in',
    count: artworks.length,
    artworks: artworkManifest,
    withWebglImage: artworkManifest.filter((a) => a.hasWebglImage).length,
    withoutWebglImage: artworkManifest.filter((a) => !a.hasWebglImage).length,
  });

  // v0.81 — unified museum-hub configuration: injected customer
  // `museum-hub.json` → migrated legacy hotspot array → built-in default.
  // Resolved once against the active artwork manifest with exact-ID maps,
  // full-manifest coverage, and paginated overflow (no slot cap).
  const injectedMuseumHub = (window as unknown as { __FREYRAUM_MUSEUM_HUB?: unknown })
    .__FREYRAUM_MUSEUM_HUB;
  const injectedLegacyHotspots = (window as unknown as { __FREYRAUM_HUB_HOTSPOTS?: unknown })
    .__FREYRAUM_HUB_HOTSPOTS;
  const museumHubResolution = resolveMuseumHub(artworks, injectedMuseumHub, injectedLegacyHotspots);
  diagnostics.info('boot', 'museum-hub-resolved', 'Museum hub configuration resolved', {
    source: museumHubResolution.source,
    pages: museumHubResolution.pages.length,
    selectableSlots: museumHubResolution.slotToArtwork.size,
    unmappedArtworkCount: museumHubResolution.unmappedArtworkCount,
    disabledSlots: museumHubResolution.pages
      .flatMap((page) => page.slots)
      .filter((slot) => !slot.selectable)
      .map((slot) => ({ slotId: slot.id, reason: slot.disabledReason })),
    warnings: museumHubResolution.warnings,
  });

  // v0.81 — central visual-token resolver: one resolved wall color reaches
  // CSS custom properties and the WebGL clear color before renderer
  // construction. Validated customer overrides come from museum-hub.json.
  const visualTokens = museumHubResolution.visualTokens;
  const resolvedWallTokens = applyResolvedWallSurfaceColor(app, visualTokens);
  diagnostics.info('boot', 'visual-tokens-resolved', 'Wall color tokens resolved', resolvedWallTokens);

  const injectedAudio = (window as unknown as { __FREYRAUM_AUDIO?: unknown }).__FREYRAUM_AUDIO;
  const customerAudio = sanitizeInjectedAudio(injectedAudio, diagnostics);
  backgroundAudio.load(customerAudio);

  if (!isWebGLAvailable()) {
    diagnostics.error('boot', 'webgl-unavailable', 'WebGL is not available in the current browser');
    showFallbackScreen(app, 'WebGL ist im aktuellen Browser nicht verfügbar.', resolvedWallTokens.galleryWall);
    return;
  }

  const loadingOverlay = createLoadingOverlay(app);
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = (_url, loaded, total) => {
    loadingOverlay.setStatus('Texturen werden geladen');
    // v0.25 T-04: cap texture-loading phase at 45% so the warm loop (50%→95%)
    // has visible room to animate the progress bar per painting.
    loadingOverlay.setProgress(total > 0 ? (loaded / total) * 40 : 8);
  };
  loadingManager.onProgress = (_url, loaded, total) => {
    loadingOverlay.setProgress(total > 0 ? Math.min(48, (loaded / total) * 48) : 35);
  };
  loadingManager.onLoad = () => {
    loadingOverlay.setStatus('Galerie wird vorbereitet');
    loadingOverlay.setProgress(50);
  };
  loadingManager.onError = (url) => {
    diagnostics.warn('boot', 'loading-manager-error', 'Asset failed during loading-manager preload', {
      url: url.startsWith('data:') ? `[data-uri:${url.length}bytes]` : url,
    });
  };

  // Core setup
  const initialPreset = getQualityPreset(preferences.current.quality);

  let rendererManager: RendererManager;
  try {
    rendererManager = new RendererManager(app, initialPreset, resolvedWallTokens.galleryWall);
  } catch (err) {
    diagnostics.error('renderer', 'init-failed', 'RendererManager initialization failed', err);
    loadingOverlay.dispose();
    loadingOverlay.overlay.remove();
    showFallbackScreen(
      app,
      err instanceof Error ? err.message : 'WebGL-Renderer konnte nicht initialisiert werden.',
      resolvedWallTokens.galleryWall
    );
    return;
  }
  applyResolvedWallSurfaceColor(app, resolvedWallTokens, rendererManager);
  rendererManager.renderer.domElement.classList.add('gallery-canvas', 'gallery-canvas--loading');
  let museumHub: MainMuseumHub | null = null;
  const restoreStatus = document.createElement('div');
  restoreStatus.className = 'webgl-restore-status';
  restoreStatus.setAttribute('role', 'status');
  restoreStatus.setAttribute('aria-live', 'polite');
  restoreStatus.textContent = 'Grafik wird wiederhergestellt …';
  app.appendChild(restoreStatus);
  let restoreStatusTimer: ReturnType<typeof setTimeout> | undefined;
  let restoreSceneManager: SceneManager | null = null;
  let restoreTextureManager: TextureManager | null = null;
  let restoreGalleryManager: GalleryManager | null = null;
  let galleryStage: GalleryPresentationStage | null = null;
  rendererManager.onContextChange((state) => {
    if (state === 'lost') {
      clearTimeout(restoreStatusTimer);
      restoreStatus.classList.add('is-visible');
      diagnostics.warn('renderer', 'context-restore-visible', 'Showing WebGL restore status');
      verifyMuseumWallColorConsistency(
        diagnostics,
        'renderer-context-lost',
        resolvedWallTokens,
        rendererManager,
        museumHub?.element ?? null,
        loadingOverlay.overlay,
        app
      );
      return;
    }
    applyResolvedWallSurfaceColor(app, resolvedWallTokens, rendererManager);
    if (galleryStage && restoreTextureManager) {
      galleryStage.applyPreset(
        getQualityPreset(preferences.current.quality),
        restoreTextureManager.getEffectiveAnisotropy()
      );
    }
    restoreStatus.textContent = 'Grafik wiederhergestellt';
    diagnostics.info('renderer', 'context-restore-hidden', 'WebGL restore status will hide');
    restoreGalleryManager?.markRenderDirty(8);
    if (restoreSceneManager) {
      void rendererManager.prewarm(restoreSceneManager.scene, restoreSceneManager.camera);
    }
    verifyMuseumWallColorConsistency(
      diagnostics,
      'renderer-context-restored',
      resolvedWallTokens,
      rendererManager,
      museumHub?.element ?? null,
      loadingOverlay.overlay,
      app
    );
    restoreStatusTimer = setTimeout(() => {
      restoreStatus.classList.remove('is-visible');
      restoreStatus.textContent = 'Grafik wird wiederhergestellt …';
    }, 1200);
  });

  const sceneManager = new SceneManager(rendererManager.renderer);
  restoreSceneManager = sceneManager;
  const postProcessing = new PostProcessing(
    rendererManager.renderer,
    sceneManager.scene,
    sceneManager.camera,
    initialPreset
  );

  // Texture & lighting
  const textureManager = new TextureManager(loadingManager);
  restoreTextureManager = textureManager;
  textureManager.init(rendererManager.renderer);
  textureManager.setAnisotropyDivisor(initialPreset.anisotropyDivisor);

  galleryStage = new GalleryPresentationStage(
    sceneManager.scene,
    { wall: resolvedWallTokens.galleryWall },
    initialPreset,
    textureManager.getEffectiveAnisotropy()
  );
  const lightingSetup = new LightingSetup(sceneManager.scene, initialPreset);

  // Gallery objects
  const artworkMesh = new ArtworkMesh(sceneManager.scene, initialPreset);

  // v0.74 Phase 10 — install the Type B (structural invariants) and Type C
  // (performance / GC / frame-variance) regression tooling on `window`. Passive
  // and opt-in; see docs/REGRESSION_TOOLING.md. The context provider reads live
  // scene handles each time the invariants are evaluated.
  installPerformanceTooling(() => ({
    scene: sceneManager.scene,
    artworkMesh: artworkMesh.getArtworkMeshObject(),
    lights: lightingSetup.getLights(),
    expectedShadowCasterCount: lightingSetup.getExpectedShadowCasterCount(),
  }));

  // v0.16 — cache DOM chrome refs once. Previously `measureArtworkViewport`
  // called `app.querySelector` three times per measurement; on mobile
  // orientation changes the resize listener fires repeatedly and each
  // call walked the DOM tree. The chrome elements are created during
  // boot (`Topbar`, `Timeline`, `NavigationControls`, `InfoPanel`) and
  // never re-parented, so caching is safe.
  const chromeRefs: {
    topbar: HTMLElement | null;
    timeline: HTMLElement | null;
    navControls: HTMLElement | null;
    infoPanel: HTMLElement | null;
  } = {
    topbar: null,
    timeline: null,
    navControls: null,
    infoPanel: null,
  };

  const measureArtworkViewport = (): ArtworkViewportMetrics => {
    const visualViewport = window.visualViewport;
    const viewportW = Math.max(1, Math.round(visualViewport?.width ?? window.innerWidth));
    const viewportH = Math.max(1, Math.round(visualViewport?.height ?? window.innerHeight));
    const rootStyle = window.getComputedStyle(document.documentElement);
    const safeLeft = parseCssNumeric(rootStyle.getPropertyValue('--safe-left'));
    const safeRight = parseCssNumeric(rootStyle.getPropertyValue('--safe-right'));
    const chromeTop = parseCssNumeric(rootStyle.getPropertyValue('--chrome-top'));
    const chromeBottom = parseCssNumeric(rootStyle.getPropertyValue('--chrome-bottom'));

    const topbarRect = chromeRefs.topbar?.getBoundingClientRect();
    const timelineRect = chromeRefs.timeline?.getBoundingClientRect();
    const navRect = chromeRefs.navControls?.getBoundingClientRect();

    // Clamp to the visible viewport so a stale/transitioning fixed header rect
    // cannot make the usable-artwork area negative during mobile chrome changes.
    const topbarOcclusion = topbarRect ? Math.max(0, Math.min(viewportH, topbarRect.bottom)) : 0;
    const bottomOcclusion = [timelineRect, navRect]
      .filter((rect): rect is DOMRect => !!rect)
      .reduce((max, rect) => Math.max(max, viewportH - Math.max(0, rect.top)), 0);

    const occlusionTop = Math.max(chromeTop, topbarOcclusion);
    const occlusionBottom = Math.max(chromeBottom, bottomOcclusion);
    const occlusionLeft = safeLeft;
    const occlusionRight = safeRight;
    const usableW = Math.max(1, viewportW - occlusionLeft - occlusionRight);
    const usableH = Math.max(1, viewportH - occlusionTop - occlusionBottom);

    return {
      viewportW,
      viewportH,
      usableW,
      usableH,
      usableFracX: usableW / viewportW,
      usableFracY: usableH / viewportH,
      effectiveAspect: usableW / usableH,
      occlusionTop,
      occlusionRight,
      occlusionBottom,
      occlusionLeft,
    };
  };

  // Gallery manager
  const galleryManager = new GalleryManager(
    artworks,
    artworkMesh,
    textureManager,
    sceneManager.camera,
    undefined,
    measureArtworkViewport
  );
  restoreGalleryManager = galleryManager;
  galleryManager.applyPreset(initialPreset);
  const warmProfile = deriveWarmProfile(initialCaps, artworks.length);
  galleryManager.configureReadinessProfile({ criticalRadius: warmProfile.criticalRadius });
  // v0.68 (v0.67 P-04/P-07) — staged startup readiness contract. A single
  // feature flag (`startupReadinessMode`, default `entry-balanced`) decides
  // whether every artwork is warmed before the entry CTA (`full`, legacy) or
  // only the active artwork + critical window (+ a bounded near-next subset),
  // with the remainder deterministically deferred to background prefetch lanes.
  const startupReadinessMode: StartupReadinessMode = resolveStartupReadinessMode();
  const entryTargetCount = computeEntryTargetCount(
    startupReadinessMode,
    initialCaps.layoutTier,
    artworks.length,
    warmProfile.criticalRadius
  );
  galleryManager.configureStartupReadiness({ mode: startupReadinessMode, entryTargetCount });
  diagnostics.info('boot', 'startup-readiness-mode', 'Resolved startup readiness contract', {
    mode: startupReadinessMode,
    entryTargetCount,
    artworkCount: artworks.length,
    criticalRadius: warmProfile.criticalRadius,
    layoutTier: initialCaps.layoutTier,
  });
  diagnostics.info('boot', 'warm-profile', 'Applied device-aware warm profile', {
    artworkCount: artworks.length,
    layoutTier: initialCaps.layoutTier,
    pointer: initialCaps.pointerPrimary,
    dpr: initialCaps.dpr,
    profile: warmProfile,
  });

  // Frame budget + adaptive quality (v0.02)
  // v0.67 — quality lock: the adaptive controller runs in locked/diagnostics-only
  // mode. It never changes the user's selected preset at runtime; it only
  // surfaces sustained frame-budget pressure as diagnostics. Performance
  // mitigation must come from internal optimizations, not hidden downgrades.
  const AUTOMATIC_QUALITY_CHANGES_ENABLED = false;
  const frameBudget = new FrameBudgetMonitor({ budgetMs: 16.7 });
  const adaptiveQuality = new AdaptiveQualityController(
    preferences.current.quality,
    4000,
    !AUTOMATIC_QUALITY_CHANGES_ENABLED
  );
  galleryManager.setFrameBudgetMarker(() => frameBudget.markNavigation());
  let pageInactive = false;
  let rafId: number;

  // Experimental WebGPU probe (opt-in, dynamic import, fire-and-forget).
  void maybeProbeWebGPU();

  // UI
  const topbar = new Topbar(app);
  const infoPanel = new InfoPanel(app, artworks[0]);
  // v0.11 — compact mode toggled by layout tier (re-evaluated on resize).
  const applyCompactInfo = (tier: string): void => {
    infoPanel.setCompact(tier === 'phone-portrait' || tier === 'phone-small');
  };
  applyCompactInfo(initialCaps.layoutTier);
  const navControls = new NavigationControls(app);
  const zoomControls = new ZoomControls(app, galleryManager);
  const fullscreenButton = new FullscreenButton(app, document.documentElement);
  const preferencesPanel = new PreferencesPanel(app, preferences);
  // v0.20.5 — subtle main-page audio controls (mute/volume, top-right cluster).
  // Hidden when no audio source exists.
  const audioControls = new AudioControls(app, preferences, backgroundAudio);
  const hintText = new HintText(app);
  const timeline = new Timeline(app, artworks);
  museumHub = new MainMuseumHub(app, museumHubResolution, initialPreset);
  museumHub.setSelectedArtworkId(artworks[galleryManager.index]?.id ?? null, {
    alignPage: false,
    source: 'boot-gallery-selection',
  });
  verifyMuseumWallColorConsistency(
    diagnostics,
    'post-hub-composition-create',
    resolvedWallTokens,
    rendererManager,
    museumHub.element,
    loadingOverlay.overlay,
    app
  );
  const unsubscribeAudioState = backgroundAudio.subscribe((state) => {
    preferencesPanel.setAudioStatusMessage(state.message);
  });

  // v0.16 — populate cached chrome refs now that all chrome elements are in
  // the DOM. `measureArtworkViewport` reads from this object instead of
  // doing `app.querySelector` per call.
  chromeRefs.topbar = app.querySelector<HTMLElement>('.topbar');
  chromeRefs.timeline = app.querySelector<HTMLElement>('.timeline');
  chromeRefs.navControls = app.querySelector<HTMLElement>('.nav-controls');
  chromeRefs.infoPanel = app.querySelector<HTMLElement>('.info-panel');

  // v0.60 — Clean Chrome: auto-hide the timeline and info panel, revealing them
  // on pointer proximity, keyboard focus, or touch tap. `data-chrome-mode` is
  // already mirrored to <html> by PreferencesStore (set during construction),
  // so the panels start hidden behind the loading overlay with no visible flash.
  // v0.61 removes forced info-panel reveal on artwork changes.
  const chromeVisibility = new ChromeVisibilityManager(
    chromeRefs.infoPanel!,
    preferences,
    app
  );
  chromeVisibility.init();
  // v0.62 — register nav controls as a third managed chrome surface.
  // Nav is now auto-hidden in clean mode and participates in the same
  // proximity/focus/keyboard reveal lifecycle as the timeline and info panel.
  if (chromeRefs.navControls) {
    chromeVisibility.registerNavControls(chromeRefs.navControls, navControls);
  }

  await Promise.all([
    galleryManager.init(),
    new Promise<void>((resolve) => window.setTimeout(resolve, MIN_LOADING_SCREEN_MS)),
  ]);
  diagnostics.info('boot', 'gallery-ready', 'Gallery initialized', {
    artworkCount: artworks.length,
    quality: preferences.current.quality,
    lighting: 'dramatic',
  });

  // Interaction
  const canvas = rendererManager.renderer.domElement;
  canvas.tabIndex = -1;
  canvas.setAttribute('aria-label', 'Interaktive Galerie');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-describedby', 'freyraum-canvas-help');
  const canvasA11yHelp = document.createElement('p');
  canvasA11yHelp.id = 'freyraum-canvas-help';
  canvasA11yHelp.className = 'sr-only';
  canvasA11yHelp.textContent =
    'Interaktive 3D-Galerie. Navigation: Pfeiltasten links und rechts oder die Navigationsbuttons. Zoomen: Plus- und Minus-Buttons.';
  app.appendChild(canvasA11yHelp);
  let artworkAnnouncerEl: HTMLElement | null = null;
  let artworkAnnouncerRafA: number | null = null;
  let artworkAnnouncerRafB: number | null = null;
  const clearArtworkAnnouncerFrames = (): void => {
    if (artworkAnnouncerRafA !== null) {
      cancelAnimationFrame(artworkAnnouncerRafA);
      artworkAnnouncerRafA = null;
    }
    if (artworkAnnouncerRafB !== null) {
      cancelAnimationFrame(artworkAnnouncerRafB);
      artworkAnnouncerRafB = null;
    }
  };
  const announceArtworkChange = (title: string): void => {
    if (!artworkAnnouncerEl) {
      artworkAnnouncerEl = document.createElement('div');
      artworkAnnouncerEl.id = 'freyraum-artwork-status';
      artworkAnnouncerEl.className = 'sr-only';
      artworkAnnouncerEl.setAttribute('aria-live', 'polite');
      artworkAnnouncerEl.setAttribute('aria-atomic', 'true');
      app.appendChild(artworkAnnouncerEl);
    }
    clearArtworkAnnouncerFrames();
    artworkAnnouncerEl.textContent = '';
    const announcementText = title ? `Aktuelles Werk: ${title}` : 'Aktuelles Werk gewechselt';
    artworkAnnouncerRafA = requestAnimationFrame(() => {
      artworkAnnouncerRafA = null;
      artworkAnnouncerRafB = requestAnimationFrame(() => {
        artworkAnnouncerRafB = null;
        if (artworkAnnouncerEl) {
          artworkAnnouncerEl.textContent = announcementText;
        }
      });
    });
  };

  // v0.11 — unified canvas interaction replaced MouseInteraction,
  // ZoomPan, and TouchInteraction (removed in v0.17 dead-code cleanup).
  // Uses Pointer Events when available and Touch Events as a fallback.
  // Fixed Bug 2 (passive pinch) and Bug 3 (duplicate synthetic mouse
  // events after touch).
  const canvasInteraction = new CanvasInteraction(canvas, galleryManager);
  const keyboardHelp = new KeyboardHelp();
  const keyboardNav = new KeyboardNav(galleryManager, keyboardHelp);
  canvasInteraction.setEnabled(false);
  keyboardNav.setEnabled(false);
  topbar.onHelpClick = () => keyboardHelp.open(topbar.helpBtn);
  // The topbar info button is a secondary discovery path for the auto-hidden
  // information panel, so users are not dependent on edge affordances.
  topbar.onInfoClick = () => chromeVisibility.forceReveal('info-panel');
  // v0.20.6 — autoplay-recovery helper: if browser blocks initial autoplay,
  // retry once on first trusted user interaction while keeping user mute
  // preference authoritative.
  let interactionAudioRecoveryDone = false;
  const tryRecoverBlockedAudio = (reason: string): void => {
    if (interactionAudioRecoveryDone) return;
    const prefsNow = preferences.current;
    const audioState = backgroundAudio.getState();
    const shouldPlay =
      backgroundAudio.hasSource() &&
      !prefsNow.audioMuted &&
      (audioState.autoplayBlocked || (!audioState.playing && audioState.available));
    if (!shouldPlay) return;
    interactionAudioRecoveryDone = true;
    diagnostics.info('audio', 'autoplay-recovery-attempt', 'Retrying audio play after user interaction', {
      reason,
      autoplayBlocked: audioState.autoplayBlocked,
    });
    void backgroundAudio.play(`interaction-recovery:${reason}`);
  };
  const onFirstInteractionPointer = (): void => tryRecoverBlockedAudio('pointerdown');
  const onFirstInteractionKey = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === ' ' || event.key === 'Enter') {
      tryRecoverBlockedAudio(`keydown:${event.key}`);
    }
  };
  window.addEventListener('pointerdown', onFirstInteractionPointer, { passive: true });
  window.addEventListener('keydown', onFirstInteractionKey);

  // v0.24.4 S-01/S-02: Interaction window tracking for INP-aware prefetch throttling.
  // When a pointer interaction starts, we signal GalleryManager to pause non-critical
  // background prefetch so the main thread stays free for render/present cycles.
  // The window closes 200 ms after the last pointerup/cancel (interaction cooldown).
  let interactionWindowTimer: ReturnType<typeof setTimeout> | undefined;
  const INTERACTION_WINDOW_COOLDOWN_MS = 200;
  const openInteractionWindow = (): void => {
    if (interactionWindowTimer !== undefined) {
      clearTimeout(interactionWindowTimer);
      interactionWindowTimer = undefined;
    }
    galleryManager.setInteractionActive(true);
  };
  const scheduleInteractionWindowClose = (): void => {
    if (interactionWindowTimer !== undefined) clearTimeout(interactionWindowTimer);
    interactionWindowTimer = setTimeout(() => {
      interactionWindowTimer = undefined;
      galleryManager.setInteractionActive(false);
    }, INTERACTION_WINDOW_COOLDOWN_MS);
  };
  const onInteractionPointerDown = (): void => openInteractionWindow();
  const onInteractionPointerUp = (): void => scheduleInteractionWindowClose();
  window.addEventListener('pointerdown', onInteractionPointerDown, { passive: true });
  window.addEventListener('pointerup', onInteractionPointerUp, { passive: true });
  window.addEventListener('pointercancel', onInteractionPointerUp, { passive: true });

  const artworkCount = artworks.length;
  const warmRenderTarget = new THREE.WebGLRenderTarget(4, 4, {
    depthBuffer: true,
    stencilBuffer: false,
  });
  const warmArtwork = (index: number, reason: string): boolean => {
    const start = performance.now();
    if (!galleryManager.warmArtworkForGPU(index, reason)) return false;
    const wasVisible = artworkMesh.group.visible;
    artworkMesh.group.visible = true;
    const previousTarget = rendererManager.renderer.getRenderTarget();
    rendererManager.renderer.setRenderTarget(warmRenderTarget);
    rendererManager.renderer.render(sceneManager.scene, sceneManager.camera);
    rendererManager.renderer.setRenderTarget(previousTarget);
    artworkMesh.group.visible = wasVisible;
    galleryManager.markGpuWarmed(index, performance.now() - start, reason);
    return true;
  };
  const warmArtworkFinalPath = (index: number, reason: string): boolean => {
    const start = performance.now();
    if (!galleryManager.warmArtworkForGPU(index, reason)) return false;
    const wasVisible = artworkMesh.group.visible;
    artworkMesh.group.visible = true;
    postProcessing.render();
    artworkMesh.group.visible = wasVisible;
    galleryManager.markGpuWarmed(index, performance.now() - start, reason);
    diagnostics.debug('boot', 'artwork-final-path-warm', 'Artwork rendered through final post-processing path under loading overlay', {
      index,
      artworkId: artworks[index]?.id,
      reason,
      durationMs: Math.round((performance.now() - start) * 10) / 10,
      renderer: rendererSizeSnapshot(rendererManager.renderer),
    });
    return true;
  };
  const warmOrder = galleryManager.getBudgetedWarmOrder(0);

  // v0.68 (v0.67 P-04/P-06): The pre-entry warm contract covers only the entry
  // target set (active artwork + critical window, and in `entry-balanced` a
  // bounded near-next subset). In legacy `full` mode the entry target set is the
  // whole gallery (`fullWarmTargets === warmOrder`), so behaviour is unchanged.
  // The artworks beyond `fullWarmTargets` are warmed deterministically *after*
  // entry by the budgeted `continueWarmQueue` (per-frame ms + batch guards).
  const fullWarmTargets = galleryManager.getStartupEntryTargets(0);
  const deferredWarmCount = Math.max(0, warmOrder.length - fullWarmTargets.length);
  diagnostics.info('boot', 'pre-entry-warm-contract', 'Pre-entry GPU warm contract resolved', {
    mode: startupReadinessMode,
    warmOrderLength: warmOrder.length,
    entryWarmCount: fullWarmTargets.length,
    deferredWarmCount,
    entryTargets: fullWarmTargets,
  });
  await galleryManager.ensureEntryReadiness(fullWarmTargets, 'overlay-entry-readiness-contract');
  loadingOverlay.setStatus('GPU wird vorbereitet');
  loadingOverlay.setProgress(50);
  for (let i = 0; i < fullWarmTargets.length; i += 1) {
    // v0.24.2 Q-06: Show per-artwork preparation progress in status text.
    loadingOverlay.setStatus(`Gemälde ${i + 1} / ${fullWarmTargets.length} wird vorbereitet`);
    warmArtwork(fullWarmTargets[i], 'overlay-entry-readiness-contract');
    // v0.25 T-04: spread progress across the 50%→95% range so the bar
    // animates visibly during warm; one increment per painting.
    loadingOverlay.setProgress(50 + Math.round(((i + 1) / Math.max(1, fullWarmTargets.length)) * 45));
    // v0.25 T-01: yield one RAF so the browser compositor flushes pending
    // GPU commands between paintings instead of batching the entire warm loop.
    await rafYield();
  }

  // v0.24.2 Q-03: Deterministic completion pass — retry any entry-target painting
  // that did not reach full readiness in the first sweep (transient fetch
  // failures, OOM-evicted textures, etc.). The contract covers the entry target
  // set; deferred artworks are completed post-entry by the background lanes.
  let entryContract = galleryManager.getEntryReadinessContract(fullWarmTargets);
  let entryContractPass = 0;
  const maxEntryContractPasses = Math.max(2, fullWarmTargets.length + 1);
  while (!entryContract.ready && entryContractPass < maxEntryContractPasses) {
    entryContractPass += 1;
    loadingOverlay.setStatus('Zusätzliche Vorbereitung läuft');
    await galleryManager.ensureEntryReadiness(entryContract.pendingIndices, `overlay-contract-retry-${entryContractPass}`);
    entryContract.pendingIndices.forEach((index) => warmArtwork(index, `overlay-contract-retry-${entryContractPass}`));
    entryContract = galleryManager.getEntryReadinessContract(fullWarmTargets);
  }
  if (!entryContract.ready) {
    diagnostics.warn('boot', 'entry-contract-unresolved', 'Full-gallery entry readiness contract could not be fully satisfied before reveal', {
      pendingIndices: entryContract.pendingIndices,
      targetIndices: entryContract.targetIndices,
      attempts: entryContractPass,
      maxAttempts: maxEntryContractPasses,
    });
  }
  galleryManager.warmArtworkForGPU(galleryManager.index, 'restore-active-after-overlay-warm');

  // v0.24.2 Q-04 / v0.24.3 R-01/R-03: Pre-entry diagnostics summary — log full gallery
  // readiness ledger before CTA is enabled, including preload mode and unresolved list.
  const fullReadinessSummary: FullGalleryReadinessResult = galleryManager.getFullGalleryReadinessSummary();
  diagnostics.info('boot', 'full-gallery-ready', 'Entry readiness contract resolved; enabling entry CTA', {
    artworkCount,
    fullyReadyCount: fullReadinessSummary.fullyReadyCount,
    pendingCount: fullReadinessSummary.pendingCount,
    gpuWarmedCount: fullReadinessSummary.gpuWarmedCount,
    pbrLoadedCount: fullReadinessSummary.pbrLoadedCount,
    proceduralReadyCount: fullReadinessSummary.proceduralReadyCount,
    memoryCapApplied: fullReadinessSummary.memoryCapApplied,
    preloadMode: fullReadinessSummary.preloadMode,
    deferredArtworkCount: fullReadinessSummary.deferredArtworkCount,
    overflowArtworkCount: fullReadinessSummary.overflowArtworkCount,
    entryContractPasses: entryContractPass,
    entryContractMaxPasses: maxEntryContractPasses,
  });

  // v0.24.3 R-03 / v0.68 P-04: Structured unresolved-artwork gate. In `strict`
  // (legacy `full`) mode every artwork must be ready, so a non-empty list is a
  // contract failure (warn). In `staged` / `bounded-fallback` modes the deferred
  // artworks are expected to complete post-entry via background lanes (info).
  if (fullReadinessSummary.pendingCount > 0) {
    const severity = fullReadinessSummary.preloadMode === 'strict' ? 'warn' : 'info';
    diagnostics[severity]('boot', 'entry-unresolved-artworks', 'Pre-entry unresolved artworks detected', {
      pendingCount: fullReadinessSummary.pendingCount,
      unresolvedArtworkIds: fullReadinessSummary.unresolvedArtworkIds,
      preloadMode: fullReadinessSummary.preloadMode,
      deferredArtworkCount: fullReadinessSummary.deferredArtworkCount,
      overflowArtworkCount: fullReadinessSummary.overflowArtworkCount,
      contractSatisfied: fullReadinessSummary.preloadMode !== 'strict',
    });
  }

  // v0.24.4 S-04: Emit INP acceptance diagnostic so local validation can confirm
  // post-entry interaction responsiveness against the 200 ms INP "good" threshold.
  diagnostics.info('boot', 'inp-acceptance-target', 'INP acceptance criteria: interaction presentation delay must stay below 200 ms (Core Web Vitals "good" threshold)', {
    baseline_inp_ms: 1024,
    target_inp_ms: 200,
    preloadMode: fullReadinessSummary.preloadMode,
    artworkCount,
    note: 'Measure with Chrome DevTools Performance > Interactions panel or CrUX field data after deploy.',
  });

  diagnostics.info('boot', 'gpu-warm-complete', 'Pre-entry GPU warm finished; entry target set warmed before reveal', {
    artworkCount,
    mode: startupReadinessMode,
    entryWarmCount: fullWarmTargets.length,
    deferredWarmCount,
    warmOrder,
    frameBudgetMs: warmProfile.postRevealFrameBudgetMs,
    batchCap: warmProfile.postRevealBatchCap,
  });

  // v0.25 T-05/T-02/T-06: Drain 3 consecutive RAF frames between warm-loop end
  // and shader prewarm so the GPU fully flushes its upload queue before the
  // next phase begins and CTA cannot activate while the GPU is still working.
  // Emit start/complete diagnostics with duration for release validation.
  const warmFlushFrames = 3;
  const warmFlushStart = performance.now();
  diagnostics.info('boot', 'gpu-warm-flush-start', 'Starting post-warm GPU drain frames before shader prewarm', {
    frames: warmFlushFrames,
    artworkCount,
    pendingCount: fullReadinessSummary.pendingCount,
    preloadMode: fullReadinessSummary.preloadMode,
  });
  await rafDrain(warmFlushFrames);
  diagnostics.info('boot', 'gpu-warm-flush-complete', 'Post-warm GPU drain frames completed', {
    frames: warmFlushFrames,
    durationMs: performance.now() - warmFlushStart,
    artworkCount,
    pendingCount: fullReadinessSummary.pendingCount,
    preloadMode: fullReadinessSummary.preloadMode,
  });

  loadingOverlay.setStatus('Shader werden vorbereitet');
  loadingOverlay.setProgress(97);
  await rendererManager.prewarm(sceneManager.scene, sceneManager.camera);
  galleryManager.markAllShaderCompiled('boot-prewarm');
  // v0.55: Prewarm non-active quality variants (high/balanced/battery) under
  // the loading overlay so frame + painting shader permutations are compiled
  // before entry. This avoids first-switch JIT stalls while keeping startup
  // cost bounded by warming only one representative artwork per variant.
  const activeQualityId = preferences.current.quality;
  const qualityVariants = QUALITY_PREWARM_IDS.filter((id) => id !== activeQualityId);
  if (qualityVariants.length > 0) {
    const variantWarmIndex = galleryManager.index;
    const variantWarmStart = performance.now();
    diagnostics.info('boot', 'quality-variant-prewarm-start', 'Prewarming non-active quality shader variants under loading overlay', {
      activeQuality: activeQualityId,
      variants: qualityVariants,
      artworkIndex: variantWarmIndex,
      artworkId: artworks[variantWarmIndex]?.id,
    });
    for (const qualityId of qualityVariants) {
      const variantStart = performance.now();
      const variantPreset = getQualityPreset(qualityId);
      rendererManager.applyPreset(variantPreset);
      postProcessing.applyPreset(variantPreset);
      lightingSetup.applyPreset(variantPreset);
      artworkMesh.applyPreset(variantPreset);
      galleryManager.applyPreset(variantPreset);
      galleryStage?.applyPreset(variantPreset, textureManager.getEffectiveAnisotropy());
      galleryManager.warmArtworkForGPU(variantWarmIndex, `overlay-quality-variant-${qualityId}`);
      await rendererManager.prewarm(sceneManager.scene, sceneManager.camera);
      diagnostics.debug('boot', 'quality-variant-prewarmed', 'Quality shader variant prewarmed', {
        quality: qualityId,
        artworkIndex: variantWarmIndex,
        artworkId: artworks[variantWarmIndex]?.id,
        durationMs: Math.round((performance.now() - variantStart) * 10) / 10,
        renderer: rendererSizeSnapshot(rendererManager.renderer),
      });
      await rafYield();
    }
    const activePreset = getQualityPreset(activeQualityId);
    rendererManager.applyPreset(activePreset);
    postProcessing.applyPreset(activePreset);
    lightingSetup.applyPreset(activePreset);
    artworkMesh.applyPreset(activePreset);
    galleryManager.applyPreset(activePreset);
    galleryStage?.applyPreset(activePreset, textureManager.getEffectiveAnisotropy());
    galleryManager.warmArtworkForGPU(galleryManager.index, 'restore-active-after-quality-variant-prewarm');
    await rendererManager.prewarm(sceneManager.scene, sceneManager.camera);
    diagnostics.info('boot', 'quality-variant-prewarm-complete', 'All non-active quality shader variants prewarmed under loading overlay', {
      activeQuality: activeQualityId,
      variantsWarmed: qualityVariants,
      durationMs: Math.round((performance.now() - variantWarmStart) * 10) / 10,
      renderer: rendererSizeSnapshot(rendererManager.renderer),
    });
  }
  // v0.27 W-04: Force-compile all EffectComposer pass shaders (bloom + FXAA)
  // before the overlay is dismissed. UnrealBloomPass has 4 internal programs
  // that compile lazily on the first composer.render(); this call drives that
  // compilation while the canvas is still covered by the loading overlay.
  const ppSize = new THREE.Vector2();
  rendererManager.renderer.getSize(ppSize);
  diagnostics.info('boot', 'composer-prewarm-start', 'Starting EffectComposer shader prewarm (bloom+FXAA passes)');
  postProcessing.prewarmComposer(ppSize.x, ppSize.y);
  diagnostics.info('boot', 'composer-prewarm-complete', 'EffectComposer shader prewarm complete');
  await rafDrain(1);

  loadingOverlay.setStatus('Finale Darstellung wird vorbereitet');
  loadingOverlay.setProgress(98);
  const finalPathStart = performance.now();
  let finalPathWarmed = 0;
  for (let i = 0; i < fullWarmTargets.length; i += 1) {
    if (warmArtworkFinalPath(fullWarmTargets[i], 'overlay-final-path-warm')) finalPathWarmed += 1;
    await rafYield();
  }
  warmArtworkFinalPath(galleryManager.index, 'restore-active-after-final-path-warm');
  diagnostics.info('boot', 'all-artworks-final-path-warmed', 'Entry target artworks rendered through final post-processing path under loading overlay', {
    artworkCount,
    mode: startupReadinessMode,
    warmed: finalPathWarmed,
    targetCount: fullWarmTargets.length,
    deferredWarmCount,
    durationMs: Math.round((performance.now() - finalPathStart) * 10) / 10,
    renderer: rendererSizeSnapshot(rendererManager.renderer),
  });

  loadingOverlay.setStatus('Bedienelemente werden vorbereitet');
  const timelinePrewarm = await timeline.prewarmUnderOverlay();
  const uiPrewarm = prewarmInteractiveChrome(app, diagnostics);
  diagnostics.info('boot', 'entry-prebuild-complete', 'Main page, controls, timeline, and final render path are prebuilt under loading overlay', {
    timeline: timelinePrewarm,
    ui: uiPrewarm,
    artworkCount,
  });

  loadingOverlay.setProgress(99);
  // v0.24.3 R-04 / v0.27 W-05 / v0.68 P-04: Align status text with the actual
  // preload contract.
  // - strict (legacy full): all artworks fully prepared before entry.
  // - staged: entry target set ready; remaining artworks stream in post-entry.
  // - bounded-fallback: overflow artworks still completing in background.
  if (fullReadinessSummary.preloadMode === 'bounded-fallback') {
    loadingOverlay.setStatus(`${fullReadinessSummary.overflowArtworkCount} Gemälde werden noch optimiert – Galerie kann betreten werden`);
  } else if (fullReadinessSummary.preloadMode === 'staged' && deferredWarmCount > 0) {
    loadingOverlay.setStatus('Galerie bereit – weitere Gemälde werden im Hintergrund vorbereitet');
  } else {
    loadingOverlay.setStatus('Galerie bereit');
  }
  rendererManager.renderer.domElement.classList.remove('gallery-canvas--loading');
  rendererManager.renderer.domElement.classList.add('gallery-canvas--ready');
  // v0.29 Y-01/Y-02: reveal is intentionally delayed until after the real RAF
  // loop is defined, started, and observed presenting full-size frames below.
  // v0.68 P-04/P-06: warmCursor starts after the entry target set. In `full`
  // mode that equals warmOrder.length (queue is a no-op). In entry modes the
  // budgeted post-reveal queue warms the deferred remainder with per-frame
  // ms + batch guards so the main thread stays responsive (protects INP).
  let warmCursor = fullWarmTargets.length;
  const continueWarmQueue = (): void => {
    if (warmCursor >= warmOrder.length) {
      warmRenderTarget.dispose();
      galleryManager.warmArtworkForGPU(galleryManager.index, 'restore-active-after-budget-warm');
      diagnostics.info('boot', 'gpu-warm-post-reveal', 'Post-reveal budgeted warm queue complete; all artworks warmed', {
        artworkCount,
        mode: startupReadinessMode,
        warmed: warmOrder.length,
        deferredWarmCount,
        readinessLedger: galleryManager.getReadinessLedger(),
      });
      return;
    }
    const start = performance.now();
    let warmedThisFrame = 0;
    while (
      warmCursor < warmOrder.length &&
      warmedThisFrame < warmProfile.postRevealBatchCap &&
      performance.now() - start < warmProfile.postRevealFrameBudgetMs
    ) {
      warmArtwork(warmOrder[warmCursor], 'post-reveal-budget');
      warmCursor += 1;
      warmedThisFrame += 1;
    }
    galleryManager.warmArtworkForGPU(galleryManager.index, 'restore-active-between-budget-warm');
    diagnostics.debug('boot', 'gpu-warm-frame', 'Budgeted GPU warm frame completed', {
      warmedThisFrame,
      warmCursor,
      total: warmOrder.length,
    });
    requestAnimationFrame(continueWarmQueue);
  };
  requestAnimationFrame(continueWarmQueue);

  // v0.16 — unified, RAF-deferred resize coordinator. Replaces the
  // v0.11 design where SceneManager and PostProcessing each owned their
  // own `window.resize` listener that ran synchronously (no debounce or
  // RAF). On mobile orientation changes the browser fires many rapid
  // resize events, so the v0.11 design re-allocated framebuffers and
  // rebuilt camera matrices several times per orientation flip. The
  // coordinator below:
  //
  //   1. Debounces all viewport-change sources (120 ms — empirically
  //      enough to bridge the back-to-back resize/visualViewport storm).
  //   2. Schedules the actual work in a single `requestAnimationFrame`
  //      so DOM reads in `measureArtworkViewport` and `getBoundingClientRect`
  //      observe stable post-layout values, and writes happen in the
  //      same frame, avoiding forced layout thrash.
  //   3. Forwards a measured `(width, height)` to every layer
  //      (`RendererManager.resize`, `PostProcessing.resize`,
  //      `SceneManager.updateAspect`) so all three agree on the same
  //      viewport rectangle for the frame.
  //
  // Online validation:
  //   - https://developer.mozilla.org/docs/Web/API/Window/resize_event
  //   - https://developer.mozilla.org/docs/Web/API/ResizeObserver
  //   - https://developer.mozilla.org/docs/Web/API/Window/requestAnimationFrame
  let resizeDebounce: ReturnType<typeof setTimeout> | undefined;
  let resizeRafId = 0;
  const runResize = (): void => {
    resizeRafId = 0;
    const visualViewport = window.visualViewport;
    const measuredW = Math.max(
      1,
      Math.round(visualViewport?.width ?? window.innerWidth)
    );
    const measuredH = Math.max(
      1,
      Math.round(visualViewport?.height ?? window.innerHeight)
    );
    rendererManager.resize(measuredW, measuredH);
    postProcessing.resize(measuredW, measuredH);
    sceneManager.updateAspect(measuredW, measuredH);
    const newCaps = detectDeviceCapabilities();
    applyDeviceCaps(newCaps);
    applyCompactInfo(newCaps.layoutTier);
    hintText.updateHint();
    const artworkViewport = measureArtworkViewport();
    galleryManager.handleViewportMetricsChanged();
    diagnostics.info('layout', 'resize', 'Viewport resized', {
      tier: newCaps.layoutTier,
      w: newCaps.viewportW,
      h: newCaps.viewportH,
      measuredW,
      measuredH,
      orientation: newCaps.orientation,
    });
    diagnostics.info('layout', 'art-viewport', 'Artwork-safe viewport measured', artworkViewport);
  };
  const onResize = (): void => {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      if (resizeRafId !== 0) return;
      resizeRafId = requestAnimationFrame(runResize);
    }, 120);
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  const visualViewport = window.visualViewport;
  visualViewport?.addEventListener('resize', onResize);
  visualViewport?.addEventListener('scroll', onResize);
  const chromeObserver = typeof ResizeObserver === 'function'
    ? new ResizeObserver(onResize)
    : null;
  for (const el of [chromeRefs.topbar, chromeRefs.timeline, chromeRefs.navControls, chromeRefs.infoPanel]) {
    if (el) chromeObserver?.observe(el);
  }

  // Apply current preferences to all subsystems.
  const applyPreferences = (manual: boolean): void => {
    const { reducedMotion, quality, audioMuted, audioVolume } = preferences.current;
    galleryManager.setReducedMotion(reducedMotion);
    lightingSetup.setAnimated(!reducedMotion);
    backgroundAudio.setVolume(audioVolume, 'preferences-apply');
    backgroundAudio.setMuted(audioMuted, 'preferences-apply');
    const audioState = backgroundAudio.getState();
    if (!audioMuted && backgroundAudio.hasSource() && (!audioState.playing || audioState.autoplayBlocked)) {
      void backgroundAudio.play('preferences-apply');
    }

    artworkMesh.material.setShadowProfileScale(0.5);

    const preset = getQualityPreset(quality);
    rendererManager.applyPreset(preset);
    postProcessing.applyPreset(preset);
    lightingSetup.applyPreset(preset);
    artworkMesh.applyPreset(preset);
    galleryManager.applyPreset(preset);
    galleryStage?.applyPreset(preset, textureManager.getEffectiveAnisotropy());
    // v0.87 — hub room renderer follows the same quality preset (pixel-ratio
    // cap, surface tile size, skylight shadows, floor-reflection strategy).
    museumHub?.applyPreset(preset);

    // v0.06: inspection-mode wiring. Drives two cost-gated features that
    // should only run under raking-light inspection profiles:
    //   1. Procedural tile-size uplift for geometry-carrying maps (S3).
    //   2. Lateral PCF self-shadow filter (S4).
    // Gallery-style profiles get the standard tile size and the single-ray
    // shadow path — identical to v0.05 — so the museum-display experience
    // is unchanged.
    galleryManager.setInspectionMode(false);
    artworkMesh.material.setShadowFilterRadius(0, false);

    frameBudget.markPresetChange();
    galleryManager.markRenderDirty(6);
    if (manual) {
      adaptiveQuality.notifyManualPreset(quality);
    }
    diagnostics.debug('preferences', 'applied', 'Applied current preferences', {
      manual,
      reducedMotion,
      quality,
      lighting: 'dramatic',
      audioMuted,
      audioVolume,
      inspection: false,
    });
  };
  applyPreferences(false);

  // v0.16 — Page Visibility + Page Lifecycle integration.
  //
  // The render loop keeps requesting frames so RAF reschedules naturally,
  // but `postProcessing.render()` and the per-frame light/material update
  // are gated behind `pageInactive`. When the tab/window is hidden or
  // frozen we skip the entire render pipeline and emit a single log entry.
  // On resume we (a) clear the frame budget cooldown so the next sample
  // is not classified as "below budget", (b) reset its `lastNow`
  // baseline (handled implicitly by the 250 ms clamp inside
  // `FrameBudgetMonitor.sample`), and (c) call `markNavigation()` so the
  // brief catch-up spike does not trigger an adaptive quality downgrade.
  //
  // Online validation:
  //   - https://developer.mozilla.org/docs/Web/API/Page_Visibility_API
  //   - https://developer.chrome.com/articles/page-lifecycle-api
  //   - https://wicg.github.io/page-lifecycle/
  // (pageInactive is forward-declared above near the adaptive quality controller)
  const suspendRuntime = (reason: string): void => {
    if (pageInactive) return;
    pageInactive = true;
    backgroundAudio.handleSuspend(reason);
    diagnostics.info('lifecycle', 'suspend', `Runtime suspended (${reason})`, {
      reason,
      visibility: typeof document !== 'undefined' ? document.visibilityState : 'unknown',
    });
  };
  const resumeRuntime = (reason: string): void => {
    if (!pageInactive) return;
    pageInactive = false;
    backgroundAudio.handleResume(reason);
    // Mark a cooldown so the immediate post-resume frame spike doesn't
    // cause an adaptive quality downgrade.
    frameBudget.markNavigation();
    galleryManager.markRenderDirty(6);
    diagnostics.info('lifecycle', 'resume', `Runtime resumed (${reason})`, {
      reason,
      visibility: typeof document !== 'undefined' ? document.visibilityState : 'unknown',
    });
  };
  const onVisibilityChange = (): void => {
    if (document.visibilityState === 'hidden') suspendRuntime('visibilitychange-hidden');
    else if (document.visibilityState === 'visible') resumeRuntime('visibilitychange-visible');
  };
  const onPageHide = (event: PageTransitionEvent): void => {
    preferences.normalizeStartupAudio(event.persisted ? 'pagehide-bfcache' : 'pagehide-close', false);
    diagnostics.info('audio', 'startup-audio-persisted', 'Persisted startup audio defaults during page hide', {
      persisted: event.persisted,
    });
  };
  const onPageShow = (event: PageTransitionEvent): void => {
    if (!event.persisted) return;
    diagnostics.info('audio', 'startup-audio-restore', 'Restoring startup audio defaults after bfcache resume', {
      persisted: event.persisted,
    });
    preferences.normalizeStartupAudio('pageshow-bfcache');
  };
  // Page Lifecycle: 'freeze' fires before the browser may purge memory of a
  // hidden tab; 'resume' fires when that tab becomes visible again. The
  // events are non-standard on older browsers; the listeners are no-ops
  // when the events never fire. We treat them as a stronger version of
  // visibilitychange — if a freeze actually happens the GPU context may
  // also be lost, and `RendererManager.isRenderPaused()` will keep the
  // pipeline paused until it is restored.
  const onPageFreeze = (): void => suspendRuntime('page-lifecycle-freeze');
  const onPageResume = (): void => resumeRuntime('page-lifecycle-resume');
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);
  window.addEventListener('freeze', onPageFreeze as EventListener);
  window.addEventListener('resume', onPageResume as EventListener);

  // v0.16 — debug-only Long Tasks observer. Reports any task that blocks
  // the main thread for more than 50 ms (the Long Tasks API definition).
  // Disabled outside diagnostics mode because the observer itself imposes
  // a small cost and would spam normal users' consoles.
  //
  // Online validation:
  //   - https://developer.mozilla.org/docs/Web/API/PerformanceLongTaskTiming
  //   - https://w3c.github.io/longtasks/
  let longTaskObserver: PerformanceObserver | null = null;
  if (diagnostics.getMode() !== 'default' && typeof PerformanceObserver === 'function') {
    try {
      longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          diagnostics.warn('perf', 'long-task', 'Long task blocked the main thread', {
            duration: Math.round(entry.duration),
            startTime: Math.round(entry.startTime),
            name: entry.name,
          });
        }
      });
      longTaskObserver.observe({ type: 'longtask', buffered: true });
      diagnostics.info('perf', 'longtask-observer-active', 'Long Tasks API observer attached');
    } catch (err) {
      diagnostics.info('perf', 'longtask-unsupported', 'Long Tasks API not available', {
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // v0.16 — periodic renderer-info snapshot for info/verbose diagnostics.
  // Posts a `[renderer] snapshot` entry every 5 s containing draw calls,
  // triangle count, geometry/texture/program counts, pixel ratio, and the
  // active preset. Customer bug reports that include the diagnostics dump
  // now contain a running GPU resource history.
  let rendererSnapshotTimer: ReturnType<typeof setInterval> | undefined;
  if (diagnostics.getMode() !== 'default') {
    rendererSnapshotTimer = setInterval(() => {
      if (pageInactive) return;
      diagnostics.info('renderer', 'snapshot', 'Renderer info snapshot', rendererManager.getRendererSnapshot());
    }, 5000);
  }

  // v0.03: hidden albedo-only debug toggle via `?debug=1`. When enabled,
  // pressing 'a' on the keyboard strips all shading so reviewers can verify
  // the shader preserves the picture's fidelity. Not exposed in normal UI to
  // avoid confusing public visitors.
  const debugEnabled = getDiagnostics().getMode() !== 'default';
  let albedoOnly = false;
  let shadowDebug = false;
  const handleDebugKey = (event: KeyboardEvent): void => {
    if (!debugEnabled) return;
    if (event.key === 'a' || event.key === 'A') {
      albedoOnly = !albedoOnly;
      artworkMesh.material.setAlbedoOnly(albedoOnly);
      diagnostics.info('debug', 'albedo-toggle', `Albedo-only ${albedoOnly ? 'ON' : 'OFF'}`);
    } else if (event.key === 's' || event.key === 'S') {
      // v0.05: shadow-only greyscale visualisation. Lets reviewers isolate
      // the self-shadow contribution from albedo/lighting when diagnosing
      // stain-like artefacts.
      shadowDebug = !shadowDebug;
      artworkMesh.material.setShadowDebug(shadowDebug);
      diagnostics.info('debug', 'shadow-toggle', `Shadow-only ${shadowDebug ? 'ON' : 'OFF'}`);
    }
  };
  if (debugEnabled) {
    window.addEventListener('keydown', handleDebugKey);
    diagnostics.info('debug', 'controls', 'Debug controls active: press "a" for albedo-only, "s" for shadow-only', {
      mode: diagnostics.getMode(),
    });
  }
  let previousPrefs = preferences.current;
  // v0.16 — defer expensive shader-define / preset recomputation to an
  // idle slot so a click on a preferences radio button does not stall the
  // next paint. The very first apply (above) remains synchronous because
  // the scene has not yet been shown. Subsequent applies coalesce: if
  // multiple preference changes fire in quick succession, only the last
  // applyPreferences call runs. Adaptive-quality downgrades use the same
  // path so a downgrade never lands mid-frame.
  //
  // Online validation:
  //   - https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback
  //   - https://wicg.github.io/requestidlecallback/
  type IdleCancelHandle = number;
  type IdleScheduler = (cb: () => void) => IdleCancelHandle;
  type IdleCanceller = (h: IdleCancelHandle) => void;
  const scheduleIdle: IdleScheduler =
    typeof (window as unknown as { requestIdleCallback?: unknown }).requestIdleCallback === 'function'
      ? (cb): IdleCancelHandle =>
          (
            window as unknown as {
              requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
            }
          ).requestIdleCallback(cb, { timeout: 200 })
      : (cb): IdleCancelHandle => window.setTimeout(cb, 0);
  const cancelIdle: IdleCanceller =
    typeof (window as unknown as { cancelIdleCallback?: unknown }).cancelIdleCallback === 'function'
      ? (h): void =>
          (window as unknown as { cancelIdleCallback: (h: number) => void }).cancelIdleCallback(h)
      : (h): void => window.clearTimeout(h);
  let pendingApplyHandle: IdleCancelHandle | null = null;
  // Epsilon for volume comparison: prevents spurious preference updates from
  // floating-point rounding when converting between 0-100 slider values and
  // the 0.0-1.0 audio volume range used by HTMLMediaElement.
  const VOLUME_CHANGE_EPSILON = 1e-6;
  const unsubscribePreferences = preferences.subscribe(() => {
    const nextPrefs = preferences.current;
    // v0.67 — quality lock: automatic runtime quality changes are disabled, so
    // every quality change in the preference store is user-initiated (manual).
    const manual = nextPrefs.quality !== previousPrefs.quality;
    const audioChanged =
      nextPrefs.audioMuted !== previousPrefs.audioMuted ||
      Math.abs(nextPrefs.audioVolume - previousPrefs.audioVolume) > VOLUME_CHANGE_EPSILON;
    previousPrefs = nextPrefs;
    if (audioChanged) {
      // Audio changes are applied synchronously so autoplay-sensitive
      // user gestures (mute toggle / volume slider) are not lost behind
      // idle-callback deferral.
      if (pendingApplyHandle !== null) {
        cancelIdle(pendingApplyHandle);
        pendingApplyHandle = null;
      }
      applyPreferences(manual);
      return;
    }
    if (pendingApplyHandle !== null) {
      cancelIdle(pendingApplyHandle);
    }
    pendingApplyHandle = scheduleIdle(() => {
      pendingApplyHandle = null;
      applyPreferences(manual);
      // After a preset change, a fresh batch of shader programs may have
      // been requested. Pre-warm them so the next interaction does not
      // stall on JIT compile.
      void rendererManager.prewarm(sceneManager.scene, sceneManager.camera);
    });
  });

  // Navigation callbacks
  const handleNavigate = (index: number): void => {
    infoPanel.update(artworks[index], true);
    timeline.setActive(index);
    announceArtworkChange(artworks[index]?.title ?? '');
    museumHub?.setSelectedArtworkId(artworks[index]?.id ?? null, {
      alignPage: false,
      source: 'gallery-navigate',
    });
    diagnostics.info('gallery', 'navigate', 'Artwork changed', {
      index,
      artworkId: artworks[index]?.id,
      title: artworks[index]?.title,
    });
  };

  galleryManager.onNavigate(handleNavigate);

  navControls.onPrev(() => galleryManager.navigate(-1));
  navControls.onNext(() => galleryManager.navigate(1));
  navControls.enableIdleHint();

  timeline.onSelect((index: number) => galleryManager.goTo(index));
  timeline.onPreview((index: number) => galleryManager.promotePrefetchWindow(index, 'timeline-preview'));

  const destinationRouter = new DestinationRouter({
    onStateChange: (state) => {
      app.dataset['experience'] = state === 'destination' ? 'gallery' : state;
      applyResolvedWallSurfaceColor(app, resolvedWallTokens, rendererManager);
      verifyMuseumWallColorConsistency(
        diagnostics,
        `experience-state:${state}`,
        resolvedWallTokens,
        rendererManager,
        museumHub?.element ?? null,
        loadingOverlay.overlay.isConnected ? loadingOverlay.overlay : null,
        app
      );
      diagnostics.info('navigation', 'experience-state', 'Experience state changed', { state });
    },
    onTransitionError: (destination, error) => {
      museumHub?.showError();
      diagnostics.error(
        'navigation',
        'destination-transition-failed',
        `Failed to enter destination "${destination.id}"`,
        error
      );
    },
  });
  destinationRouter.register({
    id: 'hub',
    label: 'Main Museum Hub',
    prepare: () => museumHub.prepare(),
    enter: () => {
      artworkMesh.group.visible = false;
      galleryStage?.setVisible(false);
      canvasInteraction.setEnabled(false);
      keyboardNav.setEnabled(false);
      museumHub.setSelectedArtworkId(artworks[galleryManager.index]?.id ?? null, {
        alignPage: true,
        source: 'router-enter-hub',
      });
      museumHub.enter();
    },
    exit: () => museumHub.exit(preferences.current.reducedMotion),
  });
  destinationRouter.register({
    id: 'gallery',
    label: 'Interaktive Galerie',
    prepare: async () => {
      artworkMesh.group.visible = true;
      galleryStage?.setVisible(true);
      galleryManager.resetView();
      await rafYield();
    },
    enter: () => {
      canvasInteraction.setEnabled(true);
      keyboardNav.setEnabled(true);
      canvas.focus({ preventScroll: true });
      diagnostics.info('navigation', 'gallery-entered', 'Existing interactive gallery entered from museum hub', {
        artworkId: artworks[galleryManager.index]?.id,
      });
    },
    exit: () => {
      canvasInteraction.setEnabled(false);
      keyboardNav.setEnabled(false);
    },
  });
  museumHub.onActivate(() => {
    void destinationRouter.navigate('gallery');
  });

  // v0.81 — exact-ID selection controller. The slot's artwork ID is resolved
  // again on activation against an immutable ID→index map; the readiness gate
  // prefers `albedoLoaded && materialApplied && shaderCompiled` and falls back
  // after the configured timeout to the same exact target with its procedural
  // surface. A selection generation token ignores stale completions, and there
  // is no fallback to the gallery's previous/current artwork.
  const artworkIndexById = new Map<string, number>();
  artworks.forEach((artwork, index) => artworkIndexById.set(artwork.id, index));
  let hubSelectionGeneration = 0;
  museumHub.onSelectSlot((slot) => {
    const generation = ++hubSelectionGeneration;
    const targetArtworkId = slot.artworkId;
    const targetIndex = targetArtworkId !== null ? artworkIndexById.get(targetArtworkId) : undefined;
    if (targetArtworkId === null || targetIndex === undefined) {
      // Disabled/invalid slots are non-interactive buttons, so this path only
      // guards against inconsistent state. It never opens another artwork.
      diagnostics.warn('navigation', 'hub-slot-invalid', 'Hub slot activation without a valid exact target; ignoring', {
        slotId: slot.id,
        artworkId: targetArtworkId,
      });
      museumHub.showError();
      return;
    }
    diagnostics.info('navigation', 'hub-slot-select', 'Hub frame selected', {
      slotId: slot.id,
      artworkId: targetArtworkId,
      artworkIndex: targetIndex,
      generation,
    });
    // Commit the exact target and promote its albedo/PBR work to the
    // critical queue before waiting on readiness.
    galleryManager.goTo(targetIndex);
    galleryManager.promotePrefetchWindow(targetIndex, 'hub-slot');
    void galleryManager
      .whenArtworkInteractive(targetIndex, museumHubResolution.selectionTimeoutMs)
      .then((verdict) => {
        if (generation !== hubSelectionGeneration) {
          diagnostics.info('navigation', 'hub-slot-stale-readiness', 'Ignoring stale hub readiness completion', {
            slotId: slot.id,
            artworkId: targetArtworkId,
            generation,
            currentGeneration: hubSelectionGeneration,
          });
          return;
        }
        if (verdict === 'timeout') {
          diagnostics.warn('navigation', 'hub-slot-readiness-timeout', 'Hub readiness gate timed out; entering exact target with procedural surface', {
            slotId: slot.id,
            artworkId: targetArtworkId,
            timeoutMs: museumHubResolution.selectionTimeoutMs,
          });
        }
        // Re-assert the committed target before entering: duplicate clicks
        // and stale completions cannot change the destination.
        if (galleryManager.index !== targetIndex) galleryManager.goTo(targetIndex);
        void destinationRouter.navigate('gallery');
      });
  });

  // v0.81 — back navigation to the museum hub: promoted Topbar control and
  // guarded Escape share one idempotent router action. The hub keeps its page
  // state and restores focus to the originating slot. During navigation the
  // control exposes a busy/disabled state to suppress duplicate activation.
  const navigateBackToHub = (): void => {
    hubSelectionGeneration += 1;
    topbar.setBackBusy(true);
    void destinationRouter.navigate('hub').finally(() => topbar.setBackBusy(false));
  };
  topbar.onBackClick = navigateBackToHub;
  keyboardNav.onEscape = () => {
    if (document.querySelector('.keyboard-help:not([hidden])')) return;
    if (document.querySelector('.prefs__panel:not([hidden])')) return;
    navigateBackToHub();
  };

  // Animation loop
  const animate = (now: number): void => {
    rafId = requestAnimationFrame(animate);
    // v0.11 — skip drawing while the WebGL context is lost on mobile.
    // The render loop keeps requesting frames so that the moment the
    // context is restored, the next tick can resume normally.
    if (rendererManager.isRenderPaused()) return;
    // v0.16 — skip the render path while the page is hidden or frozen.
    // The browser already throttles rAF to ~1 Hz for hidden tabs, but
    // skipping the postprocessing composer + per-frame light/material
    // updates avoids waking the GPU just to redraw an off-screen canvas.
    if (pageInactive) return;
    if (galleryManager.hasReadinessWork()) {
      frameBudget.markReadinessWork();
    }
    const sample = frameBudget.sample(now);
    // v0.24.4 S-03: Record per-frame CPU time into the interaction telemetry
    // accumulator while a pointer interaction window is open.
    galleryManager.markInteractionFrame(sample.dtMs);
    const downgrade = adaptiveQuality.evaluate(sample, frameBudget);
    // v0.67 — quality lock: the controller is locked, so `evaluate` only emits
    // diagnostics and always returns null here. This guard is retained as a
    // safety net so that, if automatic changes are ever re-enabled, the write
    // path still flows through the preference store the user can observe.
    if (downgrade && downgrade !== preferences.current.quality) {
      diagnostics.warn('quality', 'adaptive-downgrade', 'Adaptive quality downgrade triggered', {
        from: preferences.current.quality,
        to: downgrade,
        rollingFps: Math.round(sample.rollingFps * 10) / 10,
        rollingMs: Math.round(sample.rollingMs * 10) / 10,
        severeFrameCount: sample.severeFrameCount,
      });
      preferences.setQuality(downgrade);
    }
    const lightingChanged = lightingSetup.update(now);
    // v0.15 — pass DOMHighResTimeStamp so GalleryManager.update() can
    // compute a frame-rate-independent dt for exponential smoothing.
    const galleryChanged = galleryManager.update(now);
    if (!lightingChanged && !galleryChanged && !galleryManager.hasReadinessWork()) {
      return;
    }

    // v0.03: feed view-space key-light direction into PaintingMaterial so
    // the self-shadow march in tangent space can run. The camera's
    // matrixWorldInverse upper-left transforms world directions to view.
    sceneManager.camera.updateMatrixWorld();
    lightingSetup.getKeyLightWorldDir(KEY_LIGHT_WORLD);
    KEY_LIGHT_VIEW.copy(KEY_LIGHT_WORLD).transformDirection(sceneManager.camera.matrixWorldInverse);
    artworkMesh.material.setKeyLightDirView(KEY_LIGHT_VIEW);

    postProcessing.render();
  };

  // v0.29 Y-01/Y-02 — start the real production render loop while the loading
  // overlay is still opaque and before the enter CTA can be clicked.
  rafId = requestAnimationFrame(animate);
  diagnostics.info('boot', 'pre-entry-raf-start', 'Production RAF started under loading overlay before entry CTA', {
    artworkCount,
    renderer: rendererSizeSnapshot(rendererManager.renderer),
  });
  await rafYield();
  diagnostics.info('boot', 'first-full-frame-rendered', 'First full-size production frame rendered under loading overlay', {
    activeArtwork: artworks[galleryManager.index]?.id,
    renderer: rendererSizeSnapshot(rendererManager.renderer),
  });
  await rafYield();
  diagnostics.info('boot', 'second-full-frame-presented', 'Second full-size production frame presented under loading overlay; entry CTA may now be enabled', {
    activeArtwork: artworks[galleryManager.index]?.id,
    renderer: rendererSizeSnapshot(rendererManager.renderer),
  });
  diagnostics.info('boot', 'entry-cta-enabled', 'Loading screen readiness gate complete; enabling entry CTA', {
    artworkCount,
    pendingCount: fullReadinessSummary.pendingCount,
    finalPathWarmed,
    timelinePrewarm,
    uiPrewarm,
    renderer: rendererSizeSnapshot(rendererManager.renderer),
  });

  // v0.68 (v0.67 P-07): Stable-schema performance gate. Emits one structured,
  // phase-comparable record so before/after rollout decisions are driven by
  // quantitative diagnostics, not subjective feel. Keep this schema stable
  // across phases to enable direct JSON diffing of collected diagnostics.
  diagnostics.info('boot', 'performance-gate', 'Startup performance gate (v0.67 P-07 acceptance evidence)', {
    schemaVersion: 1,
    startupReadinessMode,
    artworkCount,
    // Gate 1: user quality preset must remain manual/authoritative.
    automaticQualityChangesEnabled: AUTOMATIC_QUALITY_CHANGES_ENABLED,
    activeQuality: preferences.current.quality,
    // Gate 2: entry readiness must not require full-gallery full-path warming.
    entryWarmCount: fullWarmTargets.length,
    deferredWarmCount,
    preloadMode: fullReadinessSummary.preloadMode,
    // Gate 3 evidence: startup latency to CTA enablement.
    startupMsToEntryCta: Math.round((performance.now() - bootStartedAt) * 10) / 10,
    // Gate 4 evidence: post-entry budgeted warm guards (frame pacing safety).
    postRevealFrameBudgetMs: warmProfile.postRevealFrameBudgetMs,
    postRevealBatchCap: warmProfile.postRevealBatchCap,
    // Gate 5: readiness ledger snapshot for unresolved/deferred accounting.
    fullyReadyCount: fullReadinessSummary.fullyReadyCount,
    pendingCount: fullReadinessSummary.pendingCount,
    deferredArtworkCount: fullReadinessSummary.deferredArtworkCount,
  });

  artworkMesh.group.visible = false;
  galleryStage?.setVisible(false);
  // v0.81 — hub base fetch + first-page artwork decode + slot layout complete
  // under the overlay (the last weighted progress step), so the first hub
  // paint has zero image pop-in and zero layout shift after reveal.
  loadingOverlay.setStatus('Museum wird vorbereitet');
  await destinationRouter.startAt('hub');
  loadingOverlay.setProgress(100);
  await loadingOverlay.reveal();
  loadingOverlay.dispose();
  museumHub.focusInitialTarget();

  // Cleanup on unload
  window.addEventListener('beforeunload', () => {
    preferences.normalizeStartupAudio('beforeunload-close', false);
    cancelAnimationFrame(rafId);
    if (resizeRafId !== 0) cancelAnimationFrame(resizeRafId);
    if (pendingApplyHandle !== null) cancelIdle(pendingApplyHandle);
    longTaskObserver?.disconnect();
    if (rendererSnapshotTimer !== undefined) clearInterval(rendererSnapshotTimer);
    if (restoreStatusTimer !== undefined) clearTimeout(restoreStatusTimer);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
    window.removeEventListener('freeze', onPageFreeze as EventListener);
    window.removeEventListener('resume', onPageResume as EventListener);
    unsubscribePreferences();
    unsubscribeAudioState();
    if (debugEnabled) {
      window.removeEventListener('keydown', handleDebugKey);
    }
    window.removeEventListener('pointerdown', onFirstInteractionPointer);
    window.removeEventListener('keydown', onFirstInteractionKey);
    window.removeEventListener('pointerdown', onInteractionPointerDown);
    window.removeEventListener('pointerup', onInteractionPointerUp);
    window.removeEventListener('pointercancel', onInteractionPointerUp);
    if (interactionWindowTimer !== undefined) clearTimeout(interactionWindowTimer);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', onResize);
    visualViewport?.removeEventListener('resize', onResize);
    visualViewport?.removeEventListener('scroll', onResize);
    chromeObserver?.disconnect();
    clearTimeout(resizeDebounce);
    diagnostics.info('boot', 'shutdown', 'Disposing FREYRAUM runtime');
    destinationRouter.dispose();
    preferences.dispose();
    canvasInteraction.dispose();
    chromeVisibility.dispose();
    keyboardNav.dispose();
    keyboardHelp.dispose();
    topbar.dispose();
    infoPanel.dispose();
    clearArtworkAnnouncerFrames();
    artworkAnnouncerEl?.remove();
    artworkAnnouncerEl = null;
    navControls.dispose();
    zoomControls.dispose();
    fullscreenButton.dispose();
    preferencesPanel.dispose();
    audioControls.dispose();
    hintText.dispose();
    timeline.dispose();
    restoreStatus.remove();
    backgroundAudio.dispose();
    galleryManager.dispose();
    artworkMesh.dispose();
    galleryStage?.dispose();
    textureManager.dispose();
    galleryManager.proceduralFactory.disposeAll();
    lightingSetup.dispose();
    postProcessing.dispose();
    sceneManager.dispose();
    rendererManager.dispose();
  });
}

main().catch((err) => {
  getDiagnostics().error('boot', 'startup-failed', 'Fatal startup failure', err);
  const app = document.getElementById('app');
  if (app) {
    const resolvedGalleryWall = resolveRuntimeFallbackSurfaceColor();
    document.documentElement.style.backgroundColor = resolvedGalleryWall;
    document.body.style.backgroundColor = resolvedGalleryWall;
    app.style.backgroundColor = resolvedGalleryWall;
    showFallbackScreen(app, err instanceof Error ? err.message : 'Unbekannter Fehler beim Initialisieren.', resolvedGalleryWall);
  }
});
