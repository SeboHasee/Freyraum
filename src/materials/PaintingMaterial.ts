import * as THREE from 'three';
import type { QualityPreset, PaintingShaderVariant } from '../config/quality';
import type { ResolvedPaintingTextures } from './PaintingTextureSet';

/**
 * Realistic painting material for the v0.02 gallery.
 *
 * Strategy (audited): rely on native Three.js `MeshPhysicalMaterial` features
 * for everything Three.js already does correctly:
 *
 * - `map`               → sRGB albedo
 * - `normalMap` / `normalScale` → tangent-space base canvas/brush normal
 * - `roughnessMap`      → roughness variation
 * - `specularIntensityMap` → varnish pooling / specular highlights
 * - `bumpMap` / `bumpScale` → declares `dHdxy_fwd` / `perturbNormalArb` helpers
 * - `aoMap` / `aoMapIntensity` → ambient occlusion (uv1 attribute required)
 *
 * onBeforeCompile is used only for the things Three.js does NOT natively
 * support:
 *
 * 1. Detail-normal blending: combine the base and detail normals in
 *    **tangent space** before Three.js multiplies by the TBN matrix. This is
 *    the audited correctness fix from plan.md §Injection 2.
 * 2. Bump perturbation: when both `normalMap` and `bumpMap` are present,
 *    Three.js' built-in path only applies the normal map. We manually call
 *    `perturbNormalArb(-vViewPosition, normal, dHdxy_fwd(), faceDirection)`
 *    after normal_fragment_maps so both effects coexist correctly.
 * 3. Grazing-light boost: a custom (1 - NdotV)^3 mask added to direct
 *    specular response after `lights_fragment_end`.
 *
 * `#define` compile-out flags ensure battery mode pays zero cost for the
 * detail/bump/AO/grazing paths.
 */

const HEADER_TOKEN = '#include <common>';
const NORMAL_MAPS_TOKEN = '#include <normal_fragment_maps>';
const LIGHTS_END_TOKEN = '#include <lights_fragment_end>';

export interface PaintingUniforms {
  uDetailNormalStrength: { value: number };
  uDetailTiling: { value: THREE.Vector2 };
  uBumpStrength: { value: number };
  uLightGrazingBoost: { value: number };
  uReducedMotionScalar: { value: number };
  tDetailNormal: { value: THREE.Texture | null };
}

export class PaintingMaterial extends THREE.MeshPhysicalMaterial {
  readonly paintingUniforms: PaintingUniforms;
  private currentVariant: PaintingShaderVariant;
  private hasDetailNormal = false;
  private hasBump = false;
  private hasAO = false;
  private grazingEnabled = false;
  private reducedMotion = false;

  constructor(preset: QualityPreset) {
    super({
      roughness: 0.88,
      metalness: 0,
      clearcoat: 0.04,
      specularIntensity: 1.0,
    });

    this.paintingUniforms = {
      uDetailNormalStrength: { value: preset.detailNormalStrength },
      uDetailTiling: { value: new THREE.Vector2(8, 8) },
      uBumpStrength: { value: preset.bumpStrength },
      uLightGrazingBoost: { value: 0.6 },
      uReducedMotionScalar: { value: 1.0 },
      tDetailNormal: { value: null },
    };

    this.currentVariant = preset.shaderVariant;
    this.normalScale.set(preset.normalStrength, preset.normalStrength);
    this.grazingEnabled = preset.grazingBoostEnabled;

    this.onBeforeCompile = (shader) => {
      // Merge our uniforms into the shader's uniform map.
      Object.assign(shader.uniforms, this.paintingUniforms);

      // ── Defines ────────────────────────────────────────────────────────
      // onBeforeCompile is called every time the material recompiles, so we
      // re-derive defines from the current state.
      const defines: string[] = [];
      if (this.detailNormalActive()) defines.push('#define PAINTING_USE_DETAIL_NORMAL');
      if (this.hasBump && this.paintingUniforms.uBumpStrength.value > 0) {
        defines.push('#define PAINTING_USE_BUMP');
      }
      if (this.hasAO) defines.push('#define PAINTING_USE_AO');
      if (this.grazingEnabled) defines.push('#define PAINTING_USE_GRAZING_BOOST');

      // ── Fragment-shader injections ────────────────────────────────────
      let frag = shader.fragmentShader;

      // 1) Uniform declarations at the very top of fragment shader main scope.
      const uniformBlock = /* glsl */ `
uniform float uDetailNormalStrength;
uniform float uBumpStrength;
uniform float uLightGrazingBoost;
uniform float uReducedMotionScalar;
uniform vec2  uDetailTiling;
uniform sampler2D tDetailNormal;
`;
      frag = frag.replace(HEADER_TOKEN, `${HEADER_TOKEN}\n${uniformBlock}`);

      // 2) Replace `normal_fragment_maps` with our tangent-space blend +
      //    optional bump perturbation. This is the correctness-critical fix.
      //
      //    We keep Three.js' object-space and view-space branches intact and
      //    only replace the tangent-space branch (which is the only one the
      //    gallery ever uses, since we always supply a tangent-space normal).
      const blendedNormalChunk = /* glsl */ `
#ifdef USE_NORMALMAP_OBJECTSPACE

	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );

#elif defined( USE_NORMALMAP_TANGENTSPACE )

	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;

	#ifdef PAINTING_USE_DETAIL_NORMAL
		// Sample the detail normal in tangent space at higher tiling.
		vec3 detailN = texture2D( tDetailNormal, vNormalMapUv * uDetailTiling ).xyz * 2.0 - 1.0;
		// Whiteout-style blend: keep base XY, add detail XY scaled by strength,
		// renormalise. uReducedMotionScalar lets accessibility mode flatten
		// the detail contribution without corrupting the normal basis.
		mapN.xy += detailN.xy * uDetailNormalStrength * uReducedMotionScalar;
		mapN = normalize( mapN );
	#endif

	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );

#elif defined( USE_BUMPMAP )

	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );

#endif

#ifdef PAINTING_USE_BUMP
	// Both normalMap and bumpMap are present: Three.js' built-in path skips
	// the bump term, so we apply it ourselves on top of the (possibly
	// detail-blended) view-space normal. uBumpStrength scales the height
	// derivatives — bumpScale on the material is left at 1.0.
	vec2 paintDH = dHdxy_fwd() * uBumpStrength;
	normal = perturbNormalArb( - vViewPosition, normal, paintDH, faceDirection );
#endif
`;
      frag = frag.replace(NORMAL_MAPS_TOKEN, blendedNormalChunk);

      // 3) AO multiplier (Three.js already handles aoMap when material.aoMap
      //    is set — we just guard with our define so it's a no-op for battery).
      //    No injection needed; the native aomap_fragment runs.

      // 4) Grazing-light boost — apply after all lights are accumulated.
      const grazingChunk = /* glsl */ `
${LIGHTS_END_TOKEN}
#ifdef PAINTING_USE_GRAZING_BOOST
	{
		float NdotV = abs( dot( normal, normalize( vViewPosition ) ) );
		float grazingMask = pow( 1.0 - NdotV, 3.0 );
		reflectedLight.directSpecular *= ( 1.0 + grazingMask * uLightGrazingBoost * uReducedMotionScalar );
	}
#endif
`;
      frag = frag.replace(LIGHTS_END_TOKEN, grazingChunk);

      // 5) Prepend defines so they apply globally.
      shader.fragmentShader = defines.join('\n') + '\n' + frag;
    };
  }

  /** True when the detail-normal path should be compiled in. */
  private detailNormalActive(): boolean {
    return (
      this.hasDetailNormal &&
      this.paintingUniforms.uDetailNormalStrength.value > 0 &&
      this.paintingUniforms.uReducedMotionScalar.value > 0
    );
  }

  /**
   * Applies a {@link QualityPreset}. Updates uniforms and recompiles the
   * shader only when the defines actually change. Texture assignment is
   * handled by {@link applyTextures}.
   */
  applyPreset(preset: QualityPreset): void {
    this.normalScale.set(preset.normalStrength, preset.normalStrength);

    this.paintingUniforms.uDetailNormalStrength.value = preset.detailNormalStrength;
    this.paintingUniforms.uBumpStrength.value = preset.bumpStrength;

    if (!preset.detailNormalEnabled || preset.detailNormalStrength <= 0) {
      this.paintingUniforms.tDetailNormal.value = null;
    }
    if (preset.shaderVariant === 'painting-battery') {
      this.roughnessMap = null;
    }
    if (preset.specularStrength <= 0) {
      this.specularIntensityMap = null;
    }

    const wantsAO = preset.aoEnabled && !!this.aoMap;
    const wantsDetail =
      preset.detailNormalEnabled &&
      preset.detailNormalStrength > 0 &&
      !!this.paintingUniforms.tDetailNormal.value;
    const wantsBump = preset.bumpStrength > 0 && !!this.bumpMap;
    const wantsGrazing = preset.grazingBoostEnabled;

    const definesChanged =
      wantsAO !== this.hasAO ||
      wantsDetail !== this.detailNormalActive() ||
      wantsBump !== this.hasBump ||
      wantsGrazing !== this.grazingEnabled ||
      preset.shaderVariant !== this.currentVariant;

    this.hasAO = wantsAO;
    this.hasDetailNormal = wantsDetail;
    this.hasBump = wantsBump;
    this.grazingEnabled = wantsGrazing;
    this.currentVariant = preset.shaderVariant;

    // aoMapIntensity is a native uniform; toggle by setting `aoMap` reference.
    if (!wantsAO) {
      this.aoMap = null;
    }
    if (!wantsBump) {
      this.bumpMap = null;
    }

    if (definesChanged) {
      this.needsUpdate = true;
    }
  }

  /**
   * Applies resolved painting textures. Textures are owned by the caller
   * (TextureManager / ProceduralTextureFactory); this material only holds
   * references and never disposes them.
   *
   * `tilingPerWorldUnit` controls how dense the detail-normal weave appears.
   * Pass the artwork's world-space size so the canvas tooth stays at a
   * consistent physical density regardless of aspect ratio.
   */
  applyTextures(
    textures: ResolvedPaintingTextures,
    tilingPerWorldUnit: THREE.Vector2,
    preset: QualityPreset
  ): void {
    this.map = textures.albedo;

    this.normalMap = textures.normal ?? null;

    this.roughnessMap = preset.shaderVariant === 'painting-battery' ? null : (textures.roughness ?? null);
    if (this.roughnessMap) this.roughness = 1.0; // map drives the value

    this.specularIntensityMap = preset.specularStrength > 0 ? (textures.specular ?? null) : null;
    this.specularIntensity = preset.specularStrength > 0 ? preset.specularStrength : 1.0;

    this.paintingUniforms.tDetailNormal.value =
      preset.detailNormalEnabled && preset.detailNormalStrength > 0 ? (textures.detailNormal ?? null) : null;
    this.paintingUniforms.uDetailTiling.value.copy(tilingPerWorldUnit);

    // Height -> bumpMap so Three.js declares the dHdxy_fwd helpers we call
    // explicitly from our injection.
    this.bumpMap = textures.height ?? null;
    this.bumpScale = 1.0;

    this.aoMap = textures.ao ?? null;
    this.aoMapIntensity = 1.0;

    // Re-evaluate defines and trigger recompile if necessary.
    this.applyPreset(preset);
  }

  /** Drives the accessibility flattening hook (1.0 = full, 0.0 = flat). */
  setReducedMotion(reducedMotion: boolean): void {
    if (this.reducedMotion === reducedMotion) return;
    this.reducedMotion = reducedMotion;
    this.paintingUniforms.uReducedMotionScalar.value = reducedMotion ? 0.0 : 1.0;
    // Detail-normal define flips when scalar reaches 0 — trigger recompile.
    this.needsUpdate = true;
  }

  /** Current shader variant id, exposed for debug overlays. */
  get shaderVariant(): PaintingShaderVariant {
    return this.currentVariant;
  }

  /** List of currently active map roles. Useful for the debug overlay. */
  activeMaps(): string[] {
    const active: string[] = ['albedo'];
    if (this.normalMap) active.push('normal');
    if (this.hasDetailNormal) active.push('detailNormal');
    if (this.bumpMap) active.push('height');
    if (this.roughnessMap) active.push('roughness');
    if (this.specularIntensityMap) active.push('specular');
    if (this.aoMap) active.push('ao');
    return active;
  }
}
