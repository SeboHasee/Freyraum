import * as THREE from 'three';
import { CanvasMaterial } from '../materials/CanvasMaterial';

export class ArtworkMesh {
  readonly group: THREE.Group;
  private readonly frameMesh: THREE.Mesh;
  private readonly artworkMesh: THREE.Mesh;
  private readonly artworkMaterial: THREE.MeshPhysicalMaterial;
  private readonly frameMaterial: THREE.MeshPhysicalMaterial;
  private readonly canvasMaterial: CanvasMaterial;
  private _artworkAspect = 1;

  constructor(scene: THREE.Scene) {
    this.canvasMaterial = new CanvasMaterial();
    this.group = new THREE.Group();

    const frameGeo = new THREE.BoxGeometry(4.4, 6.2, 0.18);
    this.frameMaterial = this.canvasMaterial.createFrameMaterial();
    this.frameMesh = new THREE.Mesh(frameGeo, this.frameMaterial);
    this.group.add(this.frameMesh);

    const artGeo = new THREE.PlaneGeometry(4, 5.7, 240, 240);
    this.artworkMaterial = new THREE.MeshPhysicalMaterial({
      roughness: 0.88,
      metalness: 0,
      clearcoat: 0.04,
    });
    this.artworkMesh = new THREE.Mesh(artGeo, this.artworkMaterial);
    this.artworkMesh.position.z = 0.095;
    this.group.add(this.artworkMesh);

    scene.add(this.group);

    // Load normal texture asynchronously and apply when ready
    this.canvasMaterial.loadNormalTexture().then((normalTex) => {
      this.artworkMaterial.normalMap = normalTex;
      this.artworkMaterial.normalScale.set(0.12, 0.12);
      this.artworkMaterial.needsUpdate = true;
    });
  }

  updateAspect(texture: THREE.Texture): void {
    const img = texture.image as HTMLImageElement | ImageBitmap;
    let imgW = 1;
    let imgH = 1;

    if ('naturalWidth' in img) {
      imgW = img.naturalWidth || img.width || 1;
      imgH = img.naturalHeight || img.height || 1;
    } else {
      imgW = img.width || 1;
      imgH = img.height || 1;
    }

    const imageAspect = imgW / imgH;
    this._artworkAspect = imageAspect;

    const maxW = 4.2;
    const maxH = 5.8;

    let w: number;
    let h: number;

    if (imageAspect >= maxW / maxH) {
      w = maxW;
      h = maxW / imageAspect;
    } else {
      h = maxH;
      w = maxH * imageAspect;
    }

    // Update artwork geometry scale
    this.artworkMesh.scale.set(w / 4.0, h / 5.7, 1);

    // Update frame to match
    const frameW = w + 0.4;
    const frameH = h + 0.4;
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

  dispose(): void {
    this.frameMesh.geometry.dispose();
    this.artworkMesh.geometry.dispose();
    this.frameMaterial.dispose();
    this.artworkMaterial.dispose();
    this.canvasMaterial.dispose();
  }
}
