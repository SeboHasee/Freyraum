import * as THREE from 'three';
import { CanvasMaterial } from '../materials/CanvasMaterial';
import { fitWithinBox, getTextureSize } from '../utils/texture';
import type { QualityPreset } from '../config/quality';

export class ArtworkMesh {
  readonly group: THREE.Group;
  private readonly frameMesh: THREE.Mesh;
  private artworkMesh: THREE.Mesh;
  private readonly artworkMaterial: THREE.MeshPhysicalMaterial;
  private readonly frameMaterial: THREE.MeshPhysicalMaterial;
  private readonly canvasMaterial: CanvasMaterial;
  private _artworkAspect = 1;
  private _artworkWidth = 4;
  private _artworkHeight = 5.7;
  private currentSegments: number;
  private readonly scene: THREE.Scene;

  constructor(scene: THREE.Scene, preset: QualityPreset) {
    this.scene = scene;
    this.canvasMaterial = new CanvasMaterial();
    this.group = new THREE.Group();
    this.currentSegments = preset.artworkSegments;

    const frameGeo = new THREE.BoxGeometry(4.4, 6.2, 0.18);
    this.frameMaterial = this.canvasMaterial.createFrameMaterial();
    this.frameMesh = new THREE.Mesh(frameGeo, this.frameMaterial);
    this.group.add(this.frameMesh);

    const artGeo = new THREE.PlaneGeometry(4, 5.7, this.currentSegments, this.currentSegments);
    this.artworkMaterial = new THREE.MeshPhysicalMaterial({
      roughness: 0.88,
      metalness: 0,
      clearcoat: 0.04,
    });
    this.artworkMesh = new THREE.Mesh(artGeo, this.artworkMaterial);
    this.artworkMesh.position.z = 0.095;
    this.group.add(this.artworkMesh);

    scene.add(this.group);

    this.canvasMaterial.loadNormalTexture().then((normalTex) => {
      this.artworkMaterial.normalMap = normalTex;
      this.artworkMaterial.normalScale.set(0.12, 0.12);
      this.artworkMaterial.needsUpdate = true;
    });
  }

  applyPreset(preset: QualityPreset): void {
    if (preset.artworkSegments === this.currentSegments) return;
    this.currentSegments = preset.artworkSegments;

    const oldGeo = this.artworkMesh.geometry;
    const newGeo = new THREE.PlaneGeometry(4, 5.7, this.currentSegments, this.currentSegments);
    this.artworkMesh.geometry = newGeo;
    oldGeo.dispose();
    // Re-apply current scale to the new geometry.
    this.artworkMesh.scale.set(this._artworkWidth / 4.0, this._artworkHeight / 5.7, 1);
  }

  updateAspect(texture: THREE.Texture): void {
    const { aspect } = getTextureSize(texture);
    this._artworkAspect = aspect;

    const { width, height } = fitWithinBox(aspect, 4.2, 5.8);
    this._artworkWidth = width;
    this._artworkHeight = height;

    this.artworkMesh.scale.set(width / 4.0, height / 5.7, 1);

    const frameW = width + 0.4;
    const frameH = height + 0.4;
    this.frameMesh.scale.set(frameW / 4.4, frameH / 6.2, 1);
  }

  setTexture(texture: THREE.Texture): void {
    this.artworkMaterial.map = texture;
    this.artworkMaterial.needsUpdate = true;
    this.updateAspect(texture);
  }

  get artworkAspect(): number {
    return this._artworkAspect;
  }

  get artworkWidth(): number {
    return this._artworkWidth;
  }

  get artworkHeight(): number {
    return this._artworkHeight;
  }

  dispose(): void {
    this.scene.remove(this.group);
    this.frameMesh.geometry.dispose();
    this.artworkMesh.geometry.dispose();
    this.frameMaterial.dispose();
    this.artworkMaterial.dispose();
    this.canvasMaterial.dispose();
  }
}
