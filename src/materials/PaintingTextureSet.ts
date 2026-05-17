/**
 * v0.02 painting texture set contract.
 *
 * A painting texture set extends a single artwork with the optional PBR maps
 * required for the realistic painting material. Every field is optional;
 * the {@link ProceduralTextureFactory} fills the gaps so the gallery can run
 * with no authored maps at all.
 */

import type * as THREE from 'three';

export type TextureColorSpace = 'srgb' | 'linear' | 'none';

/** All map roles understood by the v0.02 painting pipeline. */
export type PaintingMapRole =
  | 'albedo'
  | 'normal'
  | 'detailNormal'
  | 'height'
  | 'roughness'
  | 'specular'
  | 'ao';

export interface PaintingTextureMapEntry {
  /** Path relative to /public or a data URI for offline preview. */
  url: string;
  /**
   * `srgb` for albedo, `linear` for grayscale/normal data, `none` to use
   * Three.js' raw data-texture handling and bypass colour transforms.
   */
  colorSpace: TextureColorSpace;
  /** Native pixel dimensions of the texture asset, used for mip budgeting. */
  resolution?: { width: number; height: number };
}

export interface PaintingTextureSet {
  /** Albedo (sRGB). Replaces `Artwork.image` when present. */
  albedo?: PaintingTextureMapEntry;
  /** Tangent-space canvas/brush base normal (linear). */
  normal?: PaintingTextureMapEntry;
  /** High-frequency weave detail normal (linear, tiled). */
  detailNormal?: PaintingTextureMapEntry;
  /** Grayscale R-channel bump/height relief (linear). */
  height?: PaintingTextureMapEntry;
  /** Grayscale R-channel roughness variation (linear). */
  roughness?: PaintingTextureMapEntry;
  /** Grayscale R-channel specular intensity / varnish pooling (linear). */
  specular?: PaintingTextureMapEntry;
  /** Optional baked AO (linear). */
  ao?: PaintingTextureMapEntry;
}

/** Resolved (loaded) painting textures, ready for the material to consume. */
export interface ResolvedPaintingTextures {
  albedo: THREE.Texture;
  normal?: THREE.Texture;
  detailNormal?: THREE.Texture;
  height?: THREE.Texture;
  roughness?: THREE.Texture;
  specular?: THREE.Texture;
  ao?: THREE.Texture;
}
