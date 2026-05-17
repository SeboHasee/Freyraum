import * as THREE from 'three';
import { PaintingMaterial } from '../materials/PaintingMaterial';
import { CanvasMaterial } from '../materials/CanvasMaterial';
import { fitWithinBox, getTextureSize } from '../utils/texture';
import type { QualityPreset } from '../config/quality';
import type { ResolvedPaintingTextures } from '../materials/PaintingTextureSet';

/**
 * The visible artwork mesh: a frame box behind a (possibly subdivided) plane.
 *
 * v0.02: the inline `MeshPhysicalMaterial` is replaced by {@link PaintingMaterial}.
 * Aspect-ratio handling is unchanged — the base plane is 4×5.7 and the mesh is
 * scaled per artwork via {@link updateAspect}. Detail-normal tiling is supplied
 * to the material in tiles-per-world-unit so canvas threads stay square in any
 * orientation.
 *
 * Audited: ArtworkMesh.dispose() disposes geometry and the material only.
 * It must NOT dispose painting textures — those are owned by TextureManager or
 * ProceduralTextureFactory.
 */
export class ArtworkMesh {
  readonly group: THREE.Group;
  private readonly frameMesh: THREE.Mesh;
  private artworkMesh: THREE.Mesh;
  readonly material: PaintingMaterial;
  private readonly frameMaterial: THREE.MeshPhysicalMaterial;
  private readonly canvasMaterial: CanvasMaterial;
  private _artworkAspect = 1;
  private _artworkWidth = 4;
  private _artworkHeight = 5.7;
  private currentSegments: number;
  private readonly scene: THREE.Scene;
  /** Density coefficient for detail-normal tiling (tiles per world unit). */
  private readonly detailTilesPerWorldUnit = 2.0;

  constructor(scene: THREE.Scene, preset: QualityPreset) {
    this.scene = scene;
    this.canvasMaterial = new CanvasMaterial();
    this.group = new THREE.Group();
    this.currentSegments = preset.artworkSegments;

    const frameGeo = new THREE.BoxGeometry(4.4, 6.2, 0.18);
    this.frameMaterial = this.canvasMaterial.createFrameMaterial();
    this.frameMesh = new THREE.Mesh(frameGeo, this.frameMaterial);
    this.group.add(this.frameMesh);

    const artGeo = this.makeArtworkGeometry(this.currentSegments);
    this.material = new PaintingMaterial(preset);
    this.artworkMesh = new THREE.Mesh(artGeo, this.material);
    this.artworkMesh.position.z = 0.095;
    this.group.add(this.artworkMesh);

    scene.add(this.group);
  }

  /**
   * Creates the artwork plane geometry. Also copies `uv` into `uv1` so the
   * optional AO map works in Three.js ≥ 0.152 (which reads aoMap from uv1).
   */
  private makeArtworkGeometry(segments: number): THREE.PlaneGeometry {
    const geo = new THREE.PlaneGeometry(4, 5.7, segments, segments);
    const uv = geo.getAttribute('uv');
    if (uv && !geo.getAttribute('uv1')) {
      geo.setAttribute('uv1', uv.clone());
    }
    return geo;
  }

  applyPreset(preset: QualityPreset): void {
    // The material always reflects the latest preset, even when segments do not change.
    this.material.applyPreset(preset);

    if (preset.artworkSegments === this.currentSegments) return;
    this.currentSegments = preset.artworkSegments;

    const oldGeo = this.artworkMesh.geometry;
    const newGeo = this.makeArtworkGeometry(this.currentSegments);
    this.artworkMesh.geometry = newGeo;
    oldGeo.dispose();
    this.artworkMesh.scale.set(this._artworkWidth / 4.0, this._artworkHeight / 5.7, 1);
  }

  /**
   * Resizes both the artwork mesh and the frame to match the texture's aspect
   * ratio. Works for every aspect (portrait, landscape, square, ultrawide).
   *
   * Frame thickness is added uniformly (0.4 world units on each axis) so the
   * frame margin is visually consistent for any aspect.
   */
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

  /**
   * v0.02 entry point: applies a full painting texture set and updates the
   * mesh aspect from the albedo.
   *
   * `textures.albedo` is mandatory; all other roles are optional and the
   * material/shader compiles them out when missing.
   */
  setPaintingTextures(textures: ResolvedPaintingTextures, preset: QualityPreset): void {
    this.updateAspect(textures.albedo);

    // Aspect-aware detail-normal tiling. We keep tiles square in world space:
    // U axis uses the artwork width, V axis uses the artwork height. Without
    // this step, ultrawide and portrait artworks would show stretched weave.
    const tiling = new THREE.Vector2(
      this._artworkWidth * this.detailTilesPerWorldUnit,
      this._artworkHeight * this.detailTilesPerWorldUnit
    );

    this.material.applyTextures(textures, tiling, preset);
  }

  /** Backwards-compatible single-texture setter (albedo only). */
  setTexture(texture: THREE.Texture, preset: QualityPreset): void {
    this.setPaintingTextures({ albedo: texture }, preset);
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
    this.material.dispose();
    this.canvasMaterial.dispose();
  }
}
