import './styles/main.scss';

import { artworks } from './config/artworks';
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
import { Timeline } from './timeline/Timeline';
import { MouseInteraction } from './interaction/MouseInteraction';
import { ZoomPan } from './interaction/ZoomPan';
import { KeyboardNav } from './interaction/KeyboardNav';
import { TouchInteraction } from './interaction/TouchInteraction';

async function main(): Promise<void> {
  const app = document.getElementById('app')!;

  // Loading overlay
  const loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'loading-overlay';
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  loadingOverlay.appendChild(spinner);
  app.appendChild(loadingOverlay);

  // Core setup
  const rendererManager = new RendererManager(app);
  const sceneManager = new SceneManager(rendererManager);
  const postProcessing = new PostProcessing(
    rendererManager.renderer,
    sceneManager.scene,
    sceneManager.camera
  );

  // Texture & lighting
  const textureManager = new TextureManager();
  textureManager.init(rendererManager.renderer);

  const lightingSetup = new LightingSetup(sceneManager.scene);

  // Gallery objects
  const artworkMesh = new ArtworkMesh(sceneManager.scene);
  const sidePanels = new SidePanels(sceneManager.scene);

  // Gallery manager
  const galleryManager = new GalleryManager(
    artworkMesh,
    sidePanels,
    textureManager,
    sceneManager.camera
  );

  // Load all artworks
  await galleryManager.init();

  // Hide loading overlay
  loadingOverlay.classList.add('is-hidden');
  setTimeout(() => loadingOverlay.remove(), 700);

  // UI
  const topbar = new Topbar(app);
  const infoPanel = new InfoPanel(app);
  const navControls = new NavigationControls(app);
  const hintText = new HintText(app);
  const timeline = new Timeline(app);

  // Interaction
  const canvas = rendererManager.renderer.domElement;
  const mouseInteraction = new MouseInteraction(canvas, galleryManager);
  const zoomPan = new ZoomPan(canvas, galleryManager, mouseInteraction);
  const keyboardNav = new KeyboardNav(galleryManager);
  const touchInteraction = new TouchInteraction(canvas, galleryManager);

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
    lightingSetup.update(now);
    galleryManager.update();
    postProcessing.render();
  };

  rafId = requestAnimationFrame(animate);

  // Cleanup on unload
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(rafId);
    mouseInteraction.dispose();
    zoomPan.dispose();
    keyboardNav.dispose();
    touchInteraction.dispose();
    topbar.dispose();
    infoPanel.dispose();
    navControls.dispose();
    hintText.dispose();
    timeline.dispose();
    artworkMesh.dispose();
    sidePanels.dispose();
    textureManager.dispose();
    lightingSetup.dispose();
    postProcessing.dispose();
    sceneManager.dispose();
    rendererManager.dispose();
  });
}

main().catch(console.error);
