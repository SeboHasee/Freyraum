import * as THREE from 'three';
import type { QualityPreset } from '../config/quality';
import { GALLERY_PRESENTATION_CONFIG, type GalleryPresentationConfig } from '../config/galleryPresentation';
import {
  ArchitecturalSurfaceFactory,
  type ArchitecturalPalette,
  type ArchitecturalMaterials,
} from '../materials/ArchitecturalSurfaceFactory';

/**
 * Compact architectural shell for the interactive gallery (v0.89).
 *
 * Lives inside the existing main gallery scene, shares the renderer with the
 * artwork path, and owns its own architectural-surface factory so hub and
 * gallery resources remain independent.
 */
export class GalleryPresentationStage {
  readonly group = new THREE.Group();

  private readonly scene: THREE.Scene;
  private readonly config: GalleryPresentationConfig;
  private readonly surfaceFactory: ArchitecturalSurfaceFactory;
  private readonly materials: ArchitecturalMaterials;
  private disposed = false;

  constructor(
    scene: THREE.Scene,
    palette: ArchitecturalPalette,
    preset: QualityPreset,
    anisotropy: number,
    config: GalleryPresentationConfig = GALLERY_PRESENTATION_CONFIG
  ) {
    this.scene = scene;
    this.config = config;
    this.surfaceFactory = new ArchitecturalSurfaceFactory(preset.hubSurfaceTileSize);
    this.surfaceFactory.setAnisotropy(anisotropy);
    this.materials = this.surfaceFactory.getMaterials(palette);
    this.buildStage();
    this.scene.add(this.group);
  }

  applyPreset(preset: QualityPreset, anisotropy: number): void {
    if (this.disposed) return;
    this.surfaceFactory.setTileSize(preset.hubSurfaceTileSize);
    this.surfaceFactory.setAnisotropy(anisotropy);
  }

  setVisible(visible: boolean): void {
    this.group.visible = visible;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.scene.remove(this.group);
    this.group.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry.dispose();
      }
    });
    this.surfaceFactory.dispose();
  }

  private buildStage(): void {
    const { roomHalfWidth, roomRearZ, artworkWallZ, floorY, ceilingY } = this.config;
    const roomWidth = roomHalfWidth * 2;
    const roomHeight = ceilingY - floorY;
    const roomDepth = roomRearZ - artworkWallZ;
    const centerY = floorY + roomHeight * 0.5;
    const centerZ = artworkWallZ + roomDepth * 0.5;

    const wall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), this.materials.wall);
    wall.position.set(0, centerY, artworkWallZ);
    wall.receiveShadow = true;
    this.group.add(wall);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomDepth), this.materials.floor);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, floorY, centerZ);
    floor.receiveShadow = true;
    this.group.add(floor);

    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomDepth), this.materials.ceiling);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, ceilingY, centerZ);
    ceiling.receiveShadow = true;
    this.group.add(ceiling);

    const leftReturn = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), this.materials.wall);
    leftReturn.rotation.y = Math.PI / 2;
    leftReturn.position.set(-roomHalfWidth, centerY, centerZ);
    leftReturn.receiveShadow = true;
    this.group.add(leftReturn);

    const rightReturn = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), this.materials.wall);
    rightReturn.rotation.y = -Math.PI / 2;
    rightReturn.position.set(roomHalfWidth, centerY, centerZ);
    rightReturn.receiveShadow = true;
    this.group.add(rightReturn);

    this.group.add(
      this.makeSkirting(roomWidth, floorY, artworkWallZ),
      this.makeSideSkirting(-roomHalfWidth, centerZ, roomDepth, floorY, true),
      this.makeSideSkirting(roomHalfWidth, centerZ, roomDepth, floorY, false),
      this.makeFrontReveal(roomWidth, ceilingY, artworkWallZ),
      this.makeLightStrip(roomWidth, ceilingY, artworkWallZ),
      this.makeSideReveal(-roomHalfWidth, centerZ, roomDepth, ceilingY, true),
      this.makeSideReveal(roomHalfWidth, centerZ, roomDepth, ceilingY, false)
    );
  }

  private makeSkirting(width: number, floorY: number, wallZ: number): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, this.config.skirtingHeight, this.config.skirtingDepth),
      this.materials.trim
    );
    mesh.position.set(
      0,
      floorY + this.config.skirtingHeight * 0.5,
      wallZ + this.config.skirtingDepth * 0.5
    );
    return mesh;
  }

  private makeSideSkirting(
    x: number,
    centerZ: number,
    depth: number,
    floorY: number,
    left: boolean
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(this.config.skirtingDepth, this.config.skirtingHeight, depth),
      this.materials.trim
    );
    mesh.position.set(
      x + (left ? this.config.skirtingDepth * 0.5 : -this.config.skirtingDepth * 0.5),
      floorY + this.config.skirtingHeight * 0.5,
      centerZ
    );
    return mesh;
  }

  private makeFrontReveal(width: number, ceilingY: number, wallZ: number): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, this.config.revealDrop, this.config.revealDepth),
      this.materials.trim
    );
    mesh.position.set(
      0,
      ceilingY - this.config.revealDrop * 0.5,
      wallZ + this.config.revealDepth * 0.5
    );
    return mesh;
  }

  private makeSideReveal(
    x: number,
    centerZ: number,
    depth: number,
    ceilingY: number,
    left: boolean
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(this.config.revealDepth, this.config.revealDrop, depth),
      this.materials.trim
    );
    mesh.position.set(
      x + (left ? this.config.revealDepth * 0.5 : -this.config.revealDepth * 0.5),
      ceilingY - this.config.revealDrop * 0.5,
      centerZ
    );
    return mesh;
  }

  private makeLightStrip(width: number, ceilingY: number, wallZ: number): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width - 1.2, this.config.lightStripDepth),
      this.materials.lightStrip
    );
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(
      0,
      ceilingY - this.config.revealDrop + this.config.lightStripLift,
      wallZ + this.config.lightStripDepth * 0.5
    );
    return mesh;
  }
}
