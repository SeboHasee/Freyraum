import * as THREE from 'three';
import { PaintingMaterial } from '../materials/PaintingMaterial';
import { fitWithinBox, getTextureSize } from '../utils/texture';
import type { QualityPreset } from '../config/quality';
import type { ResolvedPaintingTextures } from '../materials/PaintingTextureSet';

/**
 * The visible artwork mesh: a possibly subdivided painting plane.
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
  private artworkMesh: THREE.Mesh;
  readonly material: PaintingMaterial;
  private _artworkAspect = 1;
  private _artworkWidth = 4;
  private _artworkHeight = 5.7;
  private currentSegments: number;
  private readonly scene: THREE.Scene;
  /** Density coefficient for detail-normal tiling (tiles per world unit). */
  private readonly detailTilesPerWorldUnit = 2.0;
  /** v0.08: records how the last updateAspect() derived its aspect ratio. */
  private _lastAspectSource: 'manifest' | 'texture' = 'texture';
  /** v0.08: the manifest dimensions used in the last updateAspect() call, if any. */
  private _lastManifestDimensions: { width: number; height: number } | null = null;

  constructor(scene: THREE.Scene, preset: QualityPreset) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.currentSegments = preset.artworkSegments;

    const artGeo = this.makeArtworkGeometry(this.currentSegments);
    this.material = new PaintingMaterial(preset);
    this.artworkMesh = new THREE.Mesh(artGeo, this.material);
    this.group.add(this.artworkMesh);

    scene.add(this.group);
  }

  /**
   * v0.74 Type B tooling — exposes the live artwork plane mesh (read-only) so
   * structural invariant checks can verify geometry ownership, triangle count,
   * material binding, and transform finiteness. Callers must not mutate it.
   */
  getArtworkMeshObject(): THREE.Mesh {
    return this.artworkMesh;
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
    // v0.03: tangents are required for the tangent-space parallax march.
    // Three.js will populate vTangent/vBitangent varyings only when the
    // geometry has a tangent attribute AND the material uses a normalMap.
    geo.computeTangents();
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
   *
   * Frame thickness is added uniformly (0.4 world units on each axis) so the
   * frame margin is visually consistent for any aspect.
   *
   * v0.08: `manifestDimensions` is the primary source of truth when provided.
   * It comes from the artwork manifest written by the importer at import time
   * and is always correct regardless of whether the WebGL texture upload
   * succeeded. Falling back to texture image metadata is kept as a safe
   * default for built-in data-URI artworks that do not declare dimensions.
   */
  updateAspect(texture: THREE.Texture, manifestDimensions?: { width: number; height: number }): void {
    let aspect: number;
    let aspectSource: 'manifest' | 'texture';

    if (
      manifestDimensions &&
      Number.isFinite(manifestDimensions.width) &&
      manifestDimensions.width > 0 &&
      Number.isFinite(manifestDimensions.height) &&
      manifestDimensions.height > 0
    ) {
      aspect = manifestDimensions.width / manifestDimensions.height;
      aspectSource = 'manifest';
    } else {
      const texSize = getTextureSize(texture);
      aspect = texSize.aspect;
      aspectSource = 'texture';
    }

    this._artworkAspect = aspect;

    const { width, height } = fitWithinBox(aspect, 4.2, 5.8);
    this._artworkWidth = width;
    this._artworkHeight = height;

    this.artworkMesh.scale.set(width / 4.0, height / 5.7, 1);

    // v0.08: expose aspect computation for diagnostics in GalleryManager.
    this._lastAspectSource = aspectSource;
    this._lastManifestDimensions = manifestDimensions ?? null;
  }

  /**
   * v0.02 entry point: applies a full painting texture set and updates the
   * mesh aspect from the albedo.
   *
   * `textures.albedo` is mandatory; all other roles are optional and the
   * material/shader compiles them out when missing.
   *
   * v0.08: `manifestDimensions` from the artwork manifest is passed through
   * to `updateAspect()` so the 3D frame uses the declared pixel dimensions as
   * the primary aspect source, not the loaded texture metadata. This ensures
   * correct aspect ratios even when the WebGL texture upload fails and a
   * fallback gradient is substituted.
   */
  setPaintingTextures(
    textures: ResolvedPaintingTextures,
    preset: QualityPreset,
    manifestDimensions?: { width: number; height: number }
  ): void {
    this.updateAspect(textures.albedo, manifestDimensions);

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

  /** v0.08: 'manifest' when aspect came from the declared artwork dimensions, 'texture' when derived from the loaded image. */
  get lastAspectSource(): 'manifest' | 'texture' {
    return this._lastAspectSource;
  }

  /** v0.08: the manifest dimensions that were used for aspect, or null. */
  get lastManifestDimensions(): { width: number; height: number } | null {
    return this._lastManifestDimensions;
  }

  dispose(): void {
    this.scene.remove(this.group);
    this.artworkMesh.geometry.dispose();
    this.material.dispose();
  }
}
