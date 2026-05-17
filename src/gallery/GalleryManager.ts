import * as THREE from 'three';
import { artworks } from '../config/artworks';
import { ArtworkMesh } from './ArtworkMesh';
import { SidePanels } from './SidePanels';
import { TextureManager } from './TextureManager';
import { clamp } from '../utils/math';

export type NavigationCallback = (index: number) => void;

export class GalleryManager {
  private currentIndex = 0;
  private readonly artworkMesh: ArtworkMesh;
  private readonly sidePanels: SidePanels;
  private readonly textureManager: TextureManager;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly raycaster = new THREE.Raycaster();

  // Transition state
  private targetX = 0;
  private targetY = 0;
  zoom = 7;
  targetZoom = 7;
  panX = 0;
  panY = 0;
  targetPanX = 0;
  targetPanY = 0;

  private onNavigateCallback: NavigationCallback | null = null;

  constructor(
    artworkMesh: ArtworkMesh,
    sidePanels: SidePanels,
    textureManager: TextureManager,
    camera: THREE.PerspectiveCamera
  ) {
    this.artworkMesh = artworkMesh;
    this.sidePanels = sidePanels;
    this.textureManager = textureManager;
    this.camera = camera;
  }

  async init(): Promise<void> {
    const urls = artworks.map((a) => a.image);
    await this.textureManager.preload(urls);
    this.showArtwork(0);
  }

  private showArtwork(index: number): void {
    const artwork = artworks[index];
    const texture = this.textureManager.get(artwork.image);
    if (texture) {
      this.artworkMesh.setTexture(texture);
    }

    // Update side panels
    const prevIndex = (index - 1 + artworks.length) % artworks.length;
    const nextIndex = (index + 1) % artworks.length;
    const prevTexture = this.textureManager.get(artworks[prevIndex].image) ?? null;
    const nextTexture = this.textureManager.get(artworks[nextIndex].image) ?? null;
    this.sidePanels.updateTextures(prevTexture, nextTexture);
  }

  navigate(direction: 1 | -1): void {
    const newIndex = clamp(
      (this.currentIndex + direction + artworks.length) % artworks.length,
      0,
      artworks.length - 1
    );

    // Transition: slide from direction
    this.artworkMesh.group.position.x = direction * 3.2;
    this.artworkMesh.group.rotation.y = direction * 0.32;
    this.artworkMesh.group.scale.set(0.84, 0.84, 0.84);

    this.currentIndex = newIndex;
    this.showArtwork(newIndex);

    // Reset pan and zoom on navigation
    this.targetPanX = 0;
    this.targetPanY = 0;
    this.targetZoom = 7;

    this.onNavigateCallback?.(this.currentIndex);
  }

  goTo(index: number): void {
    if (index === this.currentIndex) return;
    const direction = index > this.currentIndex ? 1 : -1;
    const diff = index - this.currentIndex;
    this.currentIndex = index;

    this.artworkMesh.group.position.x = (diff > 0 ? 1 : -1) * 3.2;
    this.artworkMesh.group.rotation.y = direction * 0.32;
    this.artworkMesh.group.scale.set(0.84, 0.84, 0.84);

    this.showArtwork(index);

    this.targetPanX = 0;
    this.targetPanY = 0;
    this.targetZoom = 7;

    this.onNavigateCallback?.(this.currentIndex);
  }

  // x is horizontal mouse offset → drives rotation.y (yaw)
  // y is vertical mouse offset  → drives rotation.x (pitch)
  setHoverTarget(x: number, y: number): void {
    this.targetY = x;
    this.targetX = y;
  }

  onNavigate(cb: NavigationCallback): void {
    this.onNavigateCallback = cb;
  }

  get index(): number {
    return this.currentIndex;
  }

  get artworkAspect(): number {
    return this.artworkMesh.artworkAspect;
  }

  handlePanelClick(event: MouseEvent, canvas: HTMLCanvasElement): void {
    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    this.raycaster.setFromCamera(mouse, this.camera);
    const meshes = this.sidePanels.getMeshes();
    const intersects = this.raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const side = intersects[0].object.userData['side'];
      if (side === 'left') this.navigate(-1);
      else if (side === 'right') this.navigate(1);
    }
  }

  update(): void {
    const group = this.artworkMesh.group;

    // Lerp group rotation back to targets
    group.rotation.x += (this.targetX - group.rotation.x) * 0.05;
    group.rotation.y += (this.targetY - group.rotation.y) * 0.05;

    // Lerp transition position/scale back to origin
    group.position.x += (0 - group.position.x) * 0.06;
    group.position.y += (0 - group.position.y) * 0.06;
    group.scale.x += (1 - group.scale.x) * 0.06;
    group.scale.y += (1 - group.scale.y) * 0.06;
    group.scale.z += (1 - group.scale.z) * 0.06;

    // Camera zoom
    this.zoom += (this.targetZoom - this.zoom) * 0.08;
    this.camera.position.z += (this.zoom - this.camera.position.z) * 0.08;

    // Camera pan
    this.panX += (this.targetPanX - this.panX) * 0.08;
    this.panY += (this.targetPanY - this.panY) * 0.08;
    this.camera.position.x += (this.panX - this.camera.position.x) * 0.08;
    this.camera.position.y += (this.panY - this.camera.position.y) * 0.08;
  }
}
