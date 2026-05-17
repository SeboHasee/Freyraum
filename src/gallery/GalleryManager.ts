import * as THREE from 'three';
import { artworks } from '../config/artworks';
import { ArtworkMesh } from './ArtworkMesh';
import { SidePanels } from './SidePanels';
import { TextureManager } from './TextureManager';
import { ProceduralTextureFactory } from '../materials/ProceduralTextureFactory';
import { clamp } from '../utils/math';
import type { QualityPreset } from '../config/quality';
import type { ResolvedPaintingTextures, PaintingMapRole } from '../materials/PaintingTextureSet';

export type NavigationCallback = (index: number) => void;
export type FrameBudgetMarker = () => void;

const DEFAULT_CAMERA_Z = 7;
const MAX_CAMERA_Z = 8.5;
const MIN_CAMERA_Z = 1.2;
const MIN_VISIBLE_ARTWORK_FRACTION = 0.28;
const PAN_SAFETY_FACTOR = 0.92;

/** Roles that can be filled in by the procedural factory when no authored map exists. */
const PROCEDURAL_ROLES: PaintingMapRole[] = [
  'normal',
  'detailNormal',
  'height',
  'roughness',
  'specular',
  'ao',
];

export class GalleryManager {
  private currentIndex = 0;
  private readonly artworkMesh: ArtworkMesh;
  private readonly sidePanels: SidePanels;
  private readonly textureManager: TextureManager;
  private readonly procedural: ProceduralTextureFactory;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly raycaster = new THREE.Raycaster();
  private reducedMotion = false;
  /** Latest active quality preset. Maintained via `applyPreset`. */
  private currentPreset: QualityPreset | null = null;
  /** Cancellation token for async artwork loads (audited guard). */
  private artworkLoadToken = 0;
  /** Optional callback used to mark navigation events for FrameBudgetMonitor. */
  private frameBudgetNavigationMarker: FrameBudgetMarker | null = null;

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
    camera: THREE.PerspectiveCamera,
    procedural?: ProceduralTextureFactory
  ) {
    this.artworkMesh = artworkMesh;
    this.sidePanels = sidePanels;
    this.textureManager = textureManager;
    this.camera = camera;
    this.procedural = procedural ?? new ProceduralTextureFactory();
  }

  /** Allows main.ts to call `frameBudget.markNavigation()` on every navigation. */
  setFrameBudgetMarker(marker: FrameBudgetMarker | null): void {
    this.frameBudgetNavigationMarker = marker;
  }

  /** Receives preset changes from the preference store. */
  applyPreset(preset: QualityPreset): void {
    const hadPreset = this.currentPreset !== null;
    this.currentPreset = preset;
    this.textureManager.setAnisotropyDivisor(preset.anisotropyDivisor);
    // Rebuild the current artwork's map set so preset-specific roles
    // (detailNormal, height, roughness, specular, AO) are added/removed
    // immediately on quality changes.
    if (hadPreset && this.textureManager.get(artworks[this.currentIndex].image)) {
      void this.showArtwork(this.currentIndex);
    }
  }

  async init(): Promise<void> {
    const urls = artworks.map((a) => a.image);
    await this.textureManager.preload(urls);
    await this.showArtwork(0);
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

  /**
   * Loads the painting texture set for the given artwork and applies it to
   * the artwork mesh. Async + race-protected: rapid navigation cannot apply
   * a stale map set (see audited Lifecycle Guardrails in plan.md).
   */
  private async showArtwork(index: number): Promise<void> {
    const artwork = artworks[index];
    const albedo = this.textureManager.get(artwork.image);

    const token = ++this.artworkLoadToken;
    const preset = this.currentPreset;

    // Side previews use albedo only, even when authored sets exist.
    const prevIndex = (index - 1 + artworks.length) % artworks.length;
    const nextIndex = (index + 1) % artworks.length;
    const prevTexture = this.textureManager.get(artworks[prevIndex].image) ?? null;
    const nextTexture = this.textureManager.get(artworks[nextIndex].image) ?? null;
    this.sidePanels.updateTextures(prevTexture, nextTexture);

    if (!albedo || !preset) {
      // Albedo preload should have populated the cache; if not, give up.
      return;
    }

    // Load any authored maps for this artwork in parallel.
    const authored = await this.textureManager.preloadTextureSet(artwork.textureSet);

    // Audited guard: discard stale loads.
    if (token !== this.artworkLoadToken) return;

    // Fill in missing roles from the procedural factory.
    const resolved: ResolvedPaintingTextures = {
      albedo: authored.albedo ?? albedo,
    };
    for (const role of PROCEDURAL_ROLES) {
      if (authored[role]) {
        resolved[role] = authored[role];
      } else if (this.shouldFillRole(role, preset)) {
        resolved[role] = this.procedural.generate(artwork.id, role);
      }
    }

    this.artworkMesh.setPaintingTextures(resolved, preset);

    this.targetZoom = this.clampZoom(this.targetZoom);
    this.zoom = this.clampZoom(this.zoom);
    this.clampPanTargets();
  }

  /** Selects which procedural fallback roles to generate for the active preset. */
  private shouldFillRole(role: PaintingMapRole, preset: QualityPreset): boolean {
    switch (role) {
      case 'normal':
        return true;
      case 'detailNormal':
        return preset.detailNormalEnabled && preset.detailNormalStrength > 0;
      case 'height':
        return preset.bumpStrength > 0;
      case 'roughness':
        return preset.shaderVariant !== 'painting-battery';
      case 'specular':
        return preset.specularStrength > 0;
      case 'ao':
        return preset.aoEnabled;
      default:
        return false;
    }
  }

  navigate(direction: 1 | -1): void {
    const newIndex = clamp(
      (this.currentIndex + direction + artworks.length) % artworks.length,
      0,
      artworks.length - 1
    );

    if (!this.reducedMotion) {
      this.artworkMesh.group.position.x = direction * 3.2;
      this.artworkMesh.group.rotation.y = direction * 0.32;
      this.artworkMesh.group.scale.set(0.84, 0.84, 0.84);
    }

    this.currentIndex = newIndex;
    void this.showArtwork(newIndex);
    this.frameBudgetNavigationMarker?.();

    this.resetView();
    this.onNavigateCallback?.(this.currentIndex);
  }

  goTo(index: number): void {
    if (index === this.currentIndex) return;
    const direction = index > this.currentIndex ? 1 : -1;
    const diff = index - this.currentIndex;
    this.currentIndex = index;

    if (!this.reducedMotion) {
      this.artworkMesh.group.position.x = (diff > 0 ? 1 : -1) * 3.2;
      this.artworkMesh.group.rotation.y = direction * 0.32;
      this.artworkMesh.group.scale.set(0.84, 0.84, 0.84);
    }

    void this.showArtwork(index);
    this.frameBudgetNavigationMarker?.();
    this.resetView();
    this.onNavigateCallback?.(this.currentIndex);
  }

  setReducedMotion(value: boolean): void {
    this.reducedMotion = value;
    this.artworkMesh.material.setReducedMotion(value);
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

  /** Read-only accessor for the procedural factory (used in dispose). */
  get proceduralFactory(): ProceduralTextureFactory {
    return this.procedural;
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

  resetView(): void {
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
