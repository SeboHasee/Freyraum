import './styles/main.scss';

import { artworks } from './config/artworks';
import { getQualityPreset } from './config/quality';
import { RendererManager } from './core/RendererManager';
import { SceneManager } from './core/SceneManager';
import { PostProcessing } from './core/PostProcessing';
import { LightingSetup } from './lighting/LightingSetup';
import { TextureManager } from './gallery/TextureManager';
import { ArtworkMesh } from './gallery/ArtworkMesh';
import { SidePanels } from './gallery/SidePanels';
import { GalleryManager } from './gallery/GalleryManager';
import { Topbar } from './ui/Topbar';
import { InfoPanel } from './ui/InfoPanel';
import { NavigationControls } from './ui/NavigationControls';
import { HintText } from './ui/HintText';
import { ZoomControls } from './ui/ZoomControls';
import { FullscreenButton } from './ui/FullscreenButton';
import { PreferencesPanel } from './ui/PreferencesPanel';
import { showFallbackScreen } from './ui/FallbackScreen';
import { Timeline } from './timeline/Timeline';
import { MouseInteraction } from './interaction/MouseInteraction';
import { ZoomPan } from './interaction/ZoomPan';
import { KeyboardNav } from './interaction/KeyboardNav';
import { TouchInteraction } from './interaction/TouchInteraction';
import { PreferencesStore } from './utils/preferences';
import { isWebGLAvailable } from './utils/webgl';
import { FrameBudgetMonitor } from './utils/FrameBudgetMonitor';
import { AdaptiveQualityController } from './utils/AdaptiveQualityController';
import { maybeProbeWebGPU } from './rendering/RenderBackend';

async function main(): Promise<void> {
  const app = document.getElementById('app');
  if (!app) return;

  // Preferences must apply before WebGL bootstrapping so the fallback
  // screen and loading overlay both react to motion/contrast settings.
  const preferences = new PreferencesStore();

  if (!isWebGLAvailable()) {
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

  // Gallery manager
  const galleryManager = new GalleryManager(
    artworkMesh,
    sidePanels,
    textureManager,
    sceneManager.camera
  );
  galleryManager.applyPreset(initialPreset);

  await galleryManager.init();

  loadingOverlay.classList.add('is-hidden');
  window.setTimeout(() => loadingOverlay.remove(), 700);

  // Frame budget + adaptive quality (v0.02)
  const frameBudget = new FrameBudgetMonitor({ budgetMs: 16.7 });
  const adaptiveQuality = new AdaptiveQualityController(preferences.current.quality);
  galleryManager.setFrameBudgetMarker(() => frameBudget.markNavigation());

  // Experimental WebGPU probe (opt-in, dynamic import, fire-and-forget).
  void maybeProbeWebGPU();

  // UI
  const topbar = new Topbar(app);
  const infoPanel = new InfoPanel(app);
  const navControls = new NavigationControls(app);
  const zoomControls = new ZoomControls(app, galleryManager);
  const fullscreenButton = new FullscreenButton(app, document.documentElement);
  const preferencesPanel = new PreferencesPanel(app, preferences);
  const hintText = new HintText(app);
  const timeline = new Timeline(app);

  // Interaction
  const canvas = rendererManager.renderer.domElement;
  canvas.setAttribute('aria-label', 'Interaktive Galerie');
  canvas.setAttribute('role', 'img');

  const mouseInteraction = new MouseInteraction(canvas, galleryManager);
  const zoomPan = new ZoomPan(canvas, galleryManager, mouseInteraction);
  const keyboardNav = new KeyboardNav(galleryManager);
  const touchInteraction = new TouchInteraction(canvas, galleryManager);

  // Apply current preferences to all subsystems.
  const applyPreferences = (manual: boolean): void => {
    const { reducedMotion, quality } = preferences.current;
    galleryManager.setReducedMotion(reducedMotion);
    lightingSetup.setAnimated(!reducedMotion);

    const preset = getQualityPreset(quality);
    rendererManager.applyPreset(preset);
    postProcessing.applyPreset(preset);
    lightingSetup.applyPreset(preset);
    artworkMesh.applyPreset(preset);
    galleryManager.applyPreset(preset);

    frameBudget.markPresetChange();
    if (manual) {
      adaptiveQuality.notifyManualPreset(quality);
    }
  };
  applyPreferences(false);
  let previousQuality = preferences.current.quality;
  const unsubscribePreferences = preferences.subscribe(() => {
    const next = preferences.current.quality;
    const manual = next !== previousQuality;
    previousQuality = next;
    applyPreferences(manual);
  });

  // Navigation callbacks
  const handleNavigate = (index: number): void => {
    infoPanel.update(artworks[index], true);
    timeline.setActive(index);
  };

  galleryManager.onNavigate(handleNavigate);

  navControls.onPrev(() => galleryManager.navigate(-1));
  navControls.onNext(() => galleryManager.navigate(1));

  timeline.onSelect((index: number) => galleryManager.goTo(index));

  // Animation loop
  let rafId: number;
  const animate = (now: number): void => {
    rafId = requestAnimationFrame(animate);
    const sample = frameBudget.sample(now);
    const downgrade = adaptiveQuality.evaluate(sample, frameBudget);
    if (downgrade && downgrade !== preferences.current.quality) {
      // Adaptive downgrade: drive the preference store so listeners pick it up
      // and the user sees the change in the PreferencesPanel.
      preferences.setQuality(downgrade);
    }
    lightingSetup.update(now);
    galleryManager.update();
    postProcessing.render();
  };

  rafId = requestAnimationFrame(animate);

  // Cleanup on unload
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(rafId);
    unsubscribePreferences();
    preferences.dispose();
    mouseInteraction.dispose();
    zoomPan.dispose();
    keyboardNav.dispose();
    touchInteraction.dispose();
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
  console.error(err);
  const app = document.getElementById('app');
  if (app) {
    showFallbackScreen(app, err instanceof Error ? err.message : 'Unbekannter Fehler beim Initialisieren.');
  }
});
