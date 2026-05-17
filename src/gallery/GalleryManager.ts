import * as THREE from 'three';
import { artworks } from '../config/artworks';
import { ArtworkMesh } from './ArtworkMesh';
import { SidePanels } from './SidePanels';
import { TextureManager } from './TextureManager';
import { clamp } from '../utils/math';

export type NavigationCallback = (index: number) => void;

const DEFAULT_CAMERA_Z = 7;
const MAX_CAMERA_Z = 8.5;
const MIN_CAMERA_Z = 1.2;
const MIN_VISIBLE_ARTWORK_FRACTION = 0.28;
const PAN_SAFETY_FACTOR = 0.92;

export class GalleryManager {
  private currentIndex = 0;
  private readonly artworkMesh: ArtworkMesh;
  private readonly sidePanels: SidePanels;
  private readonly textureManager: TextureManager;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly raycaster = new THREE.Raycaster();

  private targetX = 0;
  private targetY = 0;
  zoom = DEFAULT_CAMERA_Z;
  targetZoom = DEFAULT_CAMERA_Z;
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

  addZoomDelta(delta: number): void {
    this.targetZoom = this.clampZoom(this.targetZoom + delta);
    this.clampPanTargets();
  }

  setPanOffset(deltaX: number, deltaY: number): void {
    const { x, y } = this.getPanLimits(this.targetZoom);
    this.targetPanX = clamp(this.targetPanX + deltaX, -x, x);
    this.targetPanY = clamp(this.targetPanY + deltaY, -y, y);
  }

  canPan(): boolean {
    const { x, y } = this.getPanLimits(this.targetZoom);
    return x > 0.01 || y > 0.01;
  }

  getHoverRotationScale(): { x: number; y: number } {
    const zoomRange = Math.max(0.001, MAX_CAMERA_Z - this.getMinZoom());
    const zoomProgress = (this.clampZoom(this.targetZoom) - this.getMinZoom()) / zoomRange;

    return {
      x: 0.03 + zoomProgress * 0.13,
      y: 0.018 + zoomProgress * 0.062,
    };
  }

  private showArtwork(index: number): void {
    const artwork = artworks[index];
    const texture = this.textureManager.get(artwork.image);
    if (texture) {
      this.artworkMesh.setTexture(texture);
    }

    const prevIndex = (index - 1 + artworks.length) % artworks.length;
    const nextIndex = (index + 1) % artworks.length;
    const prevTexture = this.textureManager.get(artworks[prevIndex].image) ?? null;
    const nextTexture = this.textureManager.get(artworks[nextIndex].image) ?? null;
    this.sidePanels.updateTextures(prevTexture, nextTexture);

    this.targetZoom = this.clampZoom(this.targetZoom);
    this.zoom = this.clampZoom(this.zoom);
    this.clampPanTargets();
  }

  navigate(direction: 1 | -1): void {
    const newIndex = clamp(
      (this.currentIndex + direction + artworks.length) % artworks.length,
      0,
      artworks.length - 1
    );

    this.artworkMesh.group.position.x = direction * 3.2;
    this.artworkMesh.group.rotation.y = direction * 0.32;
    this.artworkMesh.group.scale.set(0.84, 0.84, 0.84);

    this.currentIndex = newIndex;
    this.showArtwork(newIndex);

    this.resetView();
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
    this.resetView();
    this.onNavigateCallback?.(this.currentIndex);
  }

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

    this.targetZoom = this.clampZoom(this.targetZoom);
    this.clampPanTargets();

    group.rotation.x += (this.targetX - group.rotation.x) * 0.05;
    group.rotation.y += (this.targetY - group.rotation.y) * 0.05;

    group.position.x += (0 - group.position.x) * 0.06;
    group.position.y += (0 - group.position.y) * 0.06;
    group.scale.x += (1 - group.scale.x) * 0.06;
    group.scale.y += (1 - group.scale.y) * 0.06;
    group.scale.z += (1 - group.scale.z) * 0.06;

    this.zoom += (this.targetZoom - this.zoom) * 0.08;
    this.camera.position.z += (this.zoom - this.camera.position.z) * 0.08;

    this.panX += (this.targetPanX - this.panX) * 0.08;
    this.panY += (this.targetPanY - this.panY) * 0.08;
    this.camera.position.x += (this.panX - this.camera.position.x) * 0.08;
    this.camera.position.y += (this.panY - this.camera.position.y) * 0.08;
  }

  private resetView(): void {
    this.targetPanX = 0;
    this.targetPanY = 0;
    this.targetZoom = this.clampZoom(DEFAULT_CAMERA_Z);
    this.targetX = 0;
    this.targetY = 0;
  }

  private clampZoom(value: number): number {
    return clamp(value, this.getMinZoom(), MAX_CAMERA_Z);
  }

  private clampPanTargets(): void {
    const limits = this.getPanLimits(this.targetZoom);
    this.targetPanX = clamp(this.targetPanX, -limits.x, limits.x);
    this.targetPanY = clamp(this.targetPanY, -limits.y, limits.y);
  }

  private getPanLimits(zoom: number): { x: number; y: number } {
    const visibleHeight = 2 * this.clampZoom(zoom) * Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5));
    const visibleWidth = visibleHeight * this.camera.aspect;

    return {
      x: Math.max(0, ((this.artworkMesh.artworkWidth - visibleWidth) * 0.5) * PAN_SAFETY_FACTOR),
      y: Math.max(0, ((this.artworkMesh.artworkHeight - visibleHeight) * 0.5) * PAN_SAFETY_FACTOR),
    };
  }

  private getMinZoom(): number {
    const requiredVisibleHeight = Math.max(
      this.artworkMesh.artworkHeight * MIN_VISIBLE_ARTWORK_FRACTION,
      (this.artworkMesh.artworkWidth * MIN_VISIBLE_ARTWORK_FRACTION) / this.camera.aspect
    );

    const fittedDistance = requiredVisibleHeight /
      (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5)));

    return clamp(Math.max(MIN_CAMERA_Z, fittedDistance), MIN_CAMERA_Z, DEFAULT_CAMERA_Z);
  }
}
