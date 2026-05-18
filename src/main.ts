import './styles/main.scss';

import * as THREE from 'three';

import { artworks as builtInArtworks, type Artwork } from './config/artworks';
import { getQualityPreset } from './config/quality';
import { getLightProfile } from './lighting/LightProfile';
import { RendererManager } from './core/RendererManager';
import { SceneManager } from './core/SceneManager';
import { PostProcessing } from './core/PostProcessing';
import { LightingSetup } from './lighting/LightingSetup';
import { TextureManager } from './gallery/TextureManager';
import { ArtworkMesh } from './gallery/ArtworkMesh';
import { SidePanels } from './gallery/SidePanels';
import { GalleryManager, type ArtworkViewportMetrics } from './gallery/GalleryManager';
import { Topbar } from './ui/Topbar';
import { InfoPanel } from './ui/InfoPanel';
import { NavigationControls } from './ui/NavigationControls';
import { HintText } from './ui/HintText';
import { ZoomControls } from './ui/ZoomControls';
import { FullscreenButton } from './ui/FullscreenButton';
import { PreferencesPanel } from './ui/PreferencesPanel';
import { showFallbackScreen } from './ui/FallbackScreen';
import { Timeline } from './timeline/Timeline';
import { KeyboardNav } from './interaction/KeyboardNav';
import { CanvasInteraction } from './interaction/CanvasInteraction';
import { PreferencesStore } from './utils/preferences';
import { isWebGLAvailable } from './utils/webgl';
import { FrameBudgetMonitor } from './utils/FrameBudgetMonitor';
import { AdaptiveQualityController } from './utils/AdaptiveQualityController';
import { maybeProbeWebGPU } from './rendering/RenderBackend';
import { getDiagnostics } from './utils/Diagnostics';
import { detectDeviceCapabilities, applyDeviceCaps } from './utils/device';
import { suggestStartupQuality } from './utils/performance';

const KEY_LIGHT_WORLD = new THREE.Vector3();
const KEY_LIGHT_VIEW = new THREE.Vector3();

function parseCssNumeric(value: string): number {
  const parsed = Number.parseFloat(value);
  if (Number.isFinite(parsed)) return parsed;
  const fallback = value.match(/-?\d+(?:\.\d+)?/);
  return fallback ? Number.parseFloat(fallback[0]) : 0;
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
      surfaceProfile:
        a['surfaceProfile'] === 'satin-canvas' ||
        a['surfaceProfile'] === 'varnished-oil' ||
        a['surfaceProfile'] === 'paper' ||
        a['surfaceProfile'] === 'procedural-fallback' ||
        a['surfaceProfile'] === 'matte-canvas'
          ? (a['surfaceProfile'] as Artwork['surfaceProfile'])
          : 'matte-canvas',
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

async function main(): Promise<void> {
  const diagnostics = getDiagnostics();
  diagnostics.installGlobalHandlers();
  diagnostics.info('boot', 'startup', 'Starting FREYRAUM runtime');

  const app = document.getElementById('app');
  if (!app) {
    diagnostics.error('boot', 'missing-app-root', 'Missing #app root element');
    return;
  }

  // Preferences must apply before WebGL bootstrapping so the fallback
  // screen and loading overlay both react to motion/contrast settings.
  const preferences = new PreferencesStore();
  diagnostics.debug('boot', 'preferences-ready', 'Preferences store created', preferences.current);

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

  // v0.11 — startup quality heuristic. Only applied when no stored
  // preference exists, so user choices are always respected after the
  // first session. Suggests `battery` on small high-DPR phones to avoid
  // thermal throttling.
  if (!PreferencesStore.hasStoredQuality()) {
    const suggested = suggestStartupQuality();
    if (suggested !== preferences.current.quality) {
      diagnostics.info('quality', 'startup-suggestion', 'Applying startup quality heuristic', {
        from: preferences.current.quality,
        to: suggested,
        tier: initialCaps.layoutTier,
        pointer: initialCaps.pointerPrimary,
        dpr: initialCaps.dpr,
      });
      preferences.setQuality(suggested);
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
    surfaceProfile: a.surfaceProfile ?? 'matte-canvas',
  }));
  diagnostics.info('boot', 'artworks-source', 'Artwork source resolved', {
    source: customerArtworks && customerArtworks.length > 0 ? 'customer' : 'built-in',
    count: artworks.length,
    artworks: artworkManifest,
    withWebglImage: artworkManifest.filter((a) => a.hasWebglImage).length,
    withoutWebglImage: artworkManifest.filter((a) => !a.hasWebglImage).length,
  });

  if (!isWebGLAvailable()) {
    diagnostics.error('boot', 'webgl-unavailable', 'WebGL is not available in the current browser');
    showFallbackScreen(app, 'WebGL ist im aktuellen Browser nicht verfügbar.');
    return;
  }

  // Loading overlay
  const loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'loading-overlay';
  loadingOverlay.setAttribute('role', 'status');
  loadingOverlay.setAttribute('aria-label', 'Galerie wird geladen');
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  spinner.setAttribute('aria-hidden', 'true');
  loadingOverlay.appendChild(spinner);
  app.appendChild(loadingOverlay);

  // Core setup
  const initialPreset = getQualityPreset(preferences.current.quality);

  let rendererManager: RendererManager;
  try {
    rendererManager = new RendererManager(app, initialPreset);
  } catch (err) {
    diagnostics.error('renderer', 'init-failed', 'RendererManager initialization failed', err);
    loadingOverlay.remove();
    showFallbackScreen(app, err instanceof Error ? err.message : 'WebGL-Renderer konnte nicht initialisiert werden.');
    return;
  }

  const sceneManager = new SceneManager();
  const postProcessing = new PostProcessing(
    rendererManager.renderer,
    sceneManager.scene,
    sceneManager.camera,
    initialPreset
  );

  // Texture & lighting
  const textureManager = new TextureManager();
  textureManager.init(rendererManager.renderer);
  textureManager.setAnisotropyDivisor(initialPreset.anisotropyDivisor);

  const lightingSetup = new LightingSetup(sceneManager.scene, initialPreset);

  // Gallery objects
  const artworkMesh = new ArtworkMesh(sceneManager.scene, initialPreset);
  const sidePanels = new SidePanels(sceneManager.scene);

  const measureArtworkViewport = (): ArtworkViewportMetrics => {
    const visualViewport = window.visualViewport;
    const viewportW = Math.max(1, Math.round(visualViewport?.width ?? window.innerWidth));
    const viewportH = Math.max(1, Math.round(visualViewport?.height ?? window.innerHeight));
    const rootStyle = window.getComputedStyle(document.documentElement);
    const safeLeft = parseCssNumeric(rootStyle.getPropertyValue('--safe-left'));
    const safeRight = parseCssNumeric(rootStyle.getPropertyValue('--safe-right'));
    const chromeTop = parseCssNumeric(rootStyle.getPropertyValue('--chrome-top'));
    const chromeBottom = parseCssNumeric(rootStyle.getPropertyValue('--chrome-bottom'));

    const topbarRect = app.querySelector<HTMLElement>('.topbar')?.getBoundingClientRect();
    const timelineRect = app.querySelector<HTMLElement>('.timeline')?.getBoundingClientRect();
    const navRect = app.querySelector<HTMLElement>('.nav-controls')?.getBoundingClientRect();

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
    sidePanels,
    textureManager,
    sceneManager.camera,
    undefined,
    measureArtworkViewport
  );
  galleryManager.applyPreset(initialPreset);

  // Frame budget + adaptive quality (v0.02)
  const frameBudget = new FrameBudgetMonitor({ budgetMs: 16.7 });
  const adaptiveQuality = new AdaptiveQualityController(preferences.current.quality);
  galleryManager.setFrameBudgetMarker(() => frameBudget.markNavigation());
  let adaptiveQualityWriteInFlight = false;

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
  const hintText = new HintText(app);
  const timeline = new Timeline(app, artworks);

  await galleryManager.init();
  diagnostics.info('boot', 'gallery-ready', 'Gallery initialized', {
    artworkCount: artworks.length,
    quality: preferences.current.quality,
    lighting: preferences.current.lighting,
  });

  loadingOverlay.classList.add('is-hidden');
  window.setTimeout(() => loadingOverlay.remove(), 700);

  // Interaction
  const canvas = rendererManager.renderer.domElement;
  canvas.setAttribute('aria-label', 'Interaktive Galerie');
  canvas.setAttribute('role', 'img');

  // v0.11 — unified canvas interaction replaces MouseInteraction +
  // ZoomPan + TouchInteraction. Uses Pointer Events when available and
  // Touch Events as a fallback. Fixes Bug 2 (passive pinch) and Bug 3
  // (duplicate synthetic mouse events after touch).
  const canvasInteraction = new CanvasInteraction(canvas, galleryManager);
  const keyboardNav = new KeyboardNav(galleryManager);

  // v0.11 — debounced resize coordinator (fixes Bug 1: renderer.setSize
  // was never called on resize). SceneManager keeps its own resize
  // listener for camera.aspect — both run on every resize event and
  // both are removed in the cleanup block.
  let resizeDebounce: ReturnType<typeof setTimeout> | undefined;
  const onResize = (): void => {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      rendererManager.resize();
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
        orientation: newCaps.orientation,
      });
      diagnostics.info('layout', 'art-viewport', 'Artwork-safe viewport measured', artworkViewport);
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
  for (const selector of ['.topbar', '.timeline', '.nav-controls', '.info-panel']) {
    const el = app.querySelector(selector);
    if (el) chromeObserver?.observe(el);
  }

  // Apply current preferences to all subsystems.
  const applyPreferences = (manual: boolean): void => {
    const { reducedMotion, quality, lighting } = preferences.current;
    galleryManager.setReducedMotion(reducedMotion);
    lightingSetup.setAnimated(!reducedMotion);
    lightingSetup.setProfile(lighting);

    // v0.05: self-shadow profile scale. Museum-style display profiles dim
    // the self-shadow contribution to 50%; inspection (raking) profiles get
    // the full effect, since revealing relief is the whole point.
    const lightProfile = getLightProfile(lighting);
    const shadowScale = lightProfile.displayIntent === 'inspection' ? 1.0 : 0.5;
    artworkMesh.material.setShadowProfileScale(shadowScale);

    const preset = getQualityPreset(quality);
    rendererManager.applyPreset(preset);
    postProcessing.applyPreset(preset);
    lightingSetup.applyPreset(preset);
    artworkMesh.applyPreset(preset);
    galleryManager.applyPreset(preset);

    // v0.06: inspection-mode wiring. Drives two cost-gated features that
    // should only run under raking-light inspection profiles:
    //   1. Procedural tile-size uplift for geometry-carrying maps (S3).
    //   2. Lateral PCF self-shadow filter (S4).
    // Gallery-style profiles get the standard tile size and the single-ray
    // shadow path — identical to v0.05 — so the museum-display experience
    // is unchanged.
    const isInspection = lightProfile.displayIntent === 'inspection';
    galleryManager.setInspectionMode(isInspection);
    artworkMesh.material.setShadowFilterRadius(
      isInspection ? preset.selfShadowFilterRadius : 0,
      isInspection && preset.selfShadowFilterRadius > 0
    );

    frameBudget.markPresetChange();
    if (manual) {
      adaptiveQuality.notifyManualPreset(quality);
    }
    diagnostics.debug('preferences', 'applied', 'Applied current preferences', {
      manual,
      reducedMotion,
      quality,
      lighting,
      inspection: isInspection,
    });
  };
  applyPreferences(false);

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
  let previousQuality = preferences.current.quality;
  const unsubscribePreferences = preferences.subscribe(() => {
    const next = preferences.current.quality;
    const manual = next !== previousQuality && !adaptiveQualityWriteInFlight;
    previousQuality = next;
    applyPreferences(manual);
  });

  // Navigation callbacks
  const handleNavigate = (index: number): void => {
    infoPanel.update(artworks[index], true);
    timeline.setActive(index);
    diagnostics.info('gallery', 'navigate', 'Artwork changed', {
      index,
      artworkId: artworks[index]?.id,
      title: artworks[index]?.title,
    });
  };

  galleryManager.onNavigate(handleNavigate);

  navControls.onPrev(() => galleryManager.navigate(-1));
  navControls.onNext(() => galleryManager.navigate(1));

  timeline.onSelect((index: number) => galleryManager.goTo(index));

  // Animation loop
  let rafId: number;
  const animate = (now: number): void => {
    rafId = requestAnimationFrame(animate);
    // v0.11 — skip drawing while the WebGL context is lost on mobile.
    // The render loop keeps requesting frames so that the moment the
    // context is restored, the next tick can resume normally.
    if (rendererManager.isRenderPaused()) return;
    const sample = frameBudget.sample(now);
    const downgrade = adaptiveQuality.evaluate(sample, frameBudget);
    if (downgrade && downgrade !== preferences.current.quality) {
      diagnostics.warn('quality', 'adaptive-downgrade', 'Adaptive quality downgrade triggered', {
        from: preferences.current.quality,
        to: downgrade,
        rollingFps: Math.round(sample.rollingFps * 10) / 10,
        rollingMs: Math.round(sample.rollingMs * 10) / 10,
      });
      // Adaptive downgrade: drive the preference store so listeners pick it up
      // and the user sees the change in the PreferencesPanel.
      adaptiveQualityWriteInFlight = true;
      try {
        preferences.setQuality(downgrade);
      } finally {
        adaptiveQualityWriteInFlight = false;
      }
    }
    lightingSetup.update(now);
    galleryManager.update();

    // v0.03: feed view-space key-light direction into PaintingMaterial so
    // the self-shadow march in tangent space can run. The camera's
    // matrixWorldInverse upper-left transforms world directions to view.
    sceneManager.camera.updateMatrixWorld();
    lightingSetup.getKeyLightWorldDir(KEY_LIGHT_WORLD);
    KEY_LIGHT_VIEW.copy(KEY_LIGHT_WORLD).transformDirection(sceneManager.camera.matrixWorldInverse);
    artworkMesh.material.setKeyLightDirView(KEY_LIGHT_VIEW);

    postProcessing.render();
  };

  rafId = requestAnimationFrame(animate);

  // Cleanup on unload
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(rafId);
    unsubscribePreferences();
    if (debugEnabled) {
      window.removeEventListener('keydown', handleDebugKey);
    }
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', onResize);
    visualViewport?.removeEventListener('resize', onResize);
    visualViewport?.removeEventListener('scroll', onResize);
    chromeObserver?.disconnect();
    clearTimeout(resizeDebounce);
    diagnostics.info('boot', 'shutdown', 'Disposing FREYRAUM runtime');
    preferences.dispose();
    canvasInteraction.dispose();
    keyboardNav.dispose();
    topbar.dispose();
    infoPanel.dispose();
    navControls.dispose();
    zoomControls.dispose();
    fullscreenButton.dispose();
    preferencesPanel.dispose();
    hintText.dispose();
    timeline.dispose();
    artworkMesh.dispose();
    sidePanels.dispose();
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
    showFallbackScreen(app, err instanceof Error ? err.message : 'Unbekannter Fehler beim Initialisieren.');
  }
});
