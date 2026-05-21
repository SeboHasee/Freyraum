import * as THREE from 'three';
import type { QualityPreset, PaintingShaderVariant } from '../config/quality';
import type { SurfaceProfile } from '../config/artworks';
import type { ResolvedPaintingTextures } from './PaintingTextureSet';

/**
 * Realistic painting material for the v0.02 / v0.03 gallery.
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
 * - `clearcoatMap` / `clearcoat` → optional varnish layer, preset/profile gated
 *
 * onBeforeCompile is used only for the things Three.js does NOT natively
 * support:
 *
 * 1. **v0.03 parallax UV offset** (`PAINTING_USE_PARALLAX`): tangent-space
 *    steep parallax march that produces a `pUV` variable used by relief-only
 *    samples (normal/self-shadow). The actual artwork albedo stays on `vMapUv`
 *    so height-field recesses cannot duplicate or tear the picture. Height convention:
 *    `bumpMap.r = 0.0 → deepest recess`, `1.0 → highest peak`.
 * 2. Detail-normal blending in **tangent space** before TBN multiply.
 * 3. Bump perturbation when both normalMap and bumpMap are present.
 * 4. Grazing-light boost: a custom (1 - NdotV)^3 mask added to direct
 *    specular response.
 * 5. **v0.03 direct-light self-shadow** (`PAINTING_USE_SELFSHADOW`): short
 *    height-march along the tangent-space key-light direction; modulates
 *    `directDiffuse` and `directSpecular` ONLY — never multiplies albedo,
 *    so picture fidelity is preserved.
 * 6. **v0.03 albedo-only debug** (`PAINTING_DEBUG_ALBEDO_ONLY`): replaces all
 *    shading with the raw albedo texture so reviewers can verify the shader
 *    does not change the original picture's essence.
 *
 * `#define` compile-out flags ensure battery mode pays zero cost for the
 * optional paths.
 *
 * Math-space contract:
 *   - vTangent / vBitangent / vNormal varyings: VIEW space (Three.js default).
 *   - uKeyLightDir: VIEW space, supplied per-frame by main.ts.
  *   - pUV: clamped to [0.001, 0.999] and only used for relief maps; albedo
  *     remains on vMapUv to preserve picture fidelity.
 *
 * Resource ownership: textures are owned by TextureManager /
 * ProceduralTextureFactory. This material never disposes textures it
 * references.
 */

const HEADER_TOKEN = '#include <common>';
const MAP_FRAGMENT_TOKEN = '#include <map_fragment>';
const NORMAL_MAPS_TOKEN = '#include <normal_fragment_maps>';
const LIGHTS_END_TOKEN = '#include <lights_fragment_end>';

export interface PaintingUniforms {
  uDetailNormalStrength: { value: number };
  uDetailTiling: { value: THREE.Vector2 };
  uBumpStrength: { value: number };
  uLightGrazingBoost: { value: number };
  uReducedMotionScalar: { value: number };
  tDetailNormal: { value: THREE.Texture | null };
  // v0.03
  uParallaxScale: { value: number };
  uParallaxSteps: { value: number };
  uShadowSteps: { value: number };
  uShadowStrength: { value: number };
  // v0.05 soft self-shadow controls.
  uShadowBias: { value: number };
  uShadowSoftness: { value: number };
  uShadowMaxOcclusion: { value: number };
  uShadowProfileScale: { value: number };
  /**
   * v0.06: UV-space radius of the lateral PCF-like self-shadow filter. `0`
   * disables filtering (single-march path). Activated at runtime by
   * `setShadowFilterRadius()` only when the active light profile is an
   * inspection profile, so gallery viewing never pays the extra texture
   * reads.
   */
  uShadowFilterRadius: { value: number };
  uKeyLightDir: { value: THREE.Vector3 };
  uAlbedoOnly: { value: number };
}

export class PaintingMaterial extends THREE.MeshPhysicalMaterial {
  readonly paintingUniforms: PaintingUniforms;
  private currentVariant: PaintingShaderVariant;
  private hasDetailNormal = false;
  private hasBump = false;
  private hasAO = false;
  private grazingEnabled = false;
  private parallaxEnabledFlag = false;
  private selfShadowEnabledFlag = false;
  private albedoOnlyEnabled = false;
  private shadowDebugEnabled = false;
  /**
   * v0.06: gates the `#define PAINTING_USE_SHADOW_FILTER` define. Toggled
   * exclusively via `setShadowFilterRadius()` from main.ts on light-profile
   * change. Compiling the define in adds 2 lateral rays × N steps texture
   * reads per fragment, so it must stay off on gallery-style profiles.
   */
  private shadowFilterEnabled = false;
  private reducedMotion = false;

  constructor(preset: QualityPreset) {
    super({
      roughness: 0.88,
      metalness: 0,
      // v0.03 matte-first retune: was 0.04. Default reads as rough painted
      // surface, not varnished oil.
      clearcoat: 0.0,
      // v0.03 matte-first retune: was 1.0. Specular intensity map (when
      // present) controls the dynamic range, but the base term is muted.
      specularIntensity: 0.3,
    });

    this.paintingUniforms = {
      uDetailNormalStrength: { value: preset.detailNormalStrength },
      uDetailTiling: { value: new THREE.Vector2(8, 8) },
      uBumpStrength: { value: preset.bumpStrength },
      // v0.03 matte-first retune: was 0.6. Lower grazing boost keeps the
      // matte canvas look stable under side-lit profiles.
      uLightGrazingBoost: { value: 0.25 },
      uReducedMotionScalar: { value: 1.0 },
      tDetailNormal: { value: null },
      uParallaxScale: { value: preset.parallaxEnabled ? preset.parallaxScale : 0.0 },
      uParallaxSteps: { value: preset.parallaxSteps },
      uShadowSteps: { value: preset.selfShadowSteps },
      uShadowStrength: { value: preset.selfShadowStrength },
      uShadowBias: { value: preset.selfShadowBias },
      uShadowSoftness: { value: preset.selfShadowSoftness },
      uShadowMaxOcclusion: { value: preset.selfShadowMaxOcclusion },
      // Profile scale is owned by main.ts via setShadowProfileScale().
      // Defaults to 0.5 (display intent) so the shader never reads as a stain
      // even before main.ts wires it.
      uShadowProfileScale: { value: 0.5 },
      uShadowFilterRadius: { value: preset.selfShadowFilterRadius },
      uKeyLightDir: { value: new THREE.Vector3(0, 0, 1) },
      uAlbedoOnly: { value: 0 },
    };

    this.currentVariant = preset.shaderVariant;
    this.normalScale.set(preset.normalStrength, preset.normalStrength);
    this.grazingEnabled = preset.grazingBoostEnabled;
    this.parallaxEnabledFlag = preset.parallaxEnabled;
    this.selfShadowEnabledFlag = preset.selfShadowEnabled;

    this.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.paintingUniforms);

      const defines: string[] = [];
      if (this.detailNormalActive()) defines.push('#define PAINTING_USE_DETAIL_NORMAL');
      if (this.hasBump && this.paintingUniforms.uBumpStrength.value > 0) {
        defines.push('#define PAINTING_USE_BUMP');
      }
      if (this.hasAO) defines.push('#define PAINTING_USE_AO');
      if (this.grazingEnabled) defines.push('#define PAINTING_USE_GRAZING_BOOST');
      if (this.parallaxActive()) defines.push('#define PAINTING_USE_PARALLAX');
      if (this.selfShadowActive()) defines.push('#define PAINTING_USE_SELFSHADOW');
      if (this.albedoOnlyEnabled) defines.push('#define PAINTING_DEBUG_ALBEDO_ONLY');
      if (this.shadowDebugEnabled) defines.push('#define PAINTING_DEBUG_SHADOW');
      // v0.06: gate the lateral PCF self-shadow path. Two compile-time
      // conditions must hold: the runtime flag set by main.ts, and a
      // non-zero radius (a zero radius would degenerate to the single-ray
      // path with extra work, so we just skip the define entirely).
      if (
        this.shadowFilterEnabled &&
        this.selfShadowActive() &&
        this.paintingUniforms.uShadowFilterRadius.value > 0
      ) {
        defines.push('#define PAINTING_USE_SHADOW_FILTER');
      }

      let frag = shader.fragmentShader;

      // 1) Uniform declarations.
      const uniformBlock = /* glsl */ `
 #ifdef GL_FRAGMENT_PRECISION_HIGH
 precision highp float;
 precision highp int;
 #else
 precision mediump float;
 precision mediump int;
 #endif
uniform float uDetailNormalStrength;
uniform float uBumpStrength;
uniform float uLightGrazingBoost;
uniform float uReducedMotionScalar;
uniform vec2  uDetailTiling;
uniform sampler2D tDetailNormal;
uniform float uParallaxScale;
uniform float uParallaxSteps;
uniform float uShadowSteps;
uniform float uShadowStrength;
uniform float uShadowBias;
uniform float uShadowSoftness;
uniform float uShadowMaxOcclusion;
uniform float uShadowProfileScale;
uniform float uShadowFilterRadius;
uniform vec3  uKeyLightDir;
uniform float uAlbedoOnly;
`;
      frag = frag.replace(HEADER_TOKEN, `${HEADER_TOKEN}\n${uniformBlock}`);

      // 2) Parallax march before map_fragment. Produces `pUV` for relief-only
      //    samples. v0.10 follow-up: albedo intentionally remains on vMapUv.
      //    Offsetting customer-image UVs by procedural height made recesses
      //    look like crater/holes showing a displaced copy of the same picture.
      //
      //    vTangent / vBitangent are populated by Three.js when the geometry
      //    has a tangent attribute (we call geo.computeTangents() in
      //    ArtworkMesh) AND the material uses a normalMap (always true here).
      //    They are in VIEW space, matching vViewPosition and vNormal.
      const parallaxChunk = /* glsl */ `
#ifdef PAINTING_USE_PARALLAX
    vec3 _tsViewDir = normalize(vec3(
        dot(vViewPosition, vTangent.xyz),
        dot(vViewPosition, vBitangent),
        dot(vViewPosition, vNormal)
    ));
    vec2 pUV = vMapUv;
    float _stepSize = 1.0 / max(uParallaxSteps, 1.0);
    float _layerH = 0.0;
    // tsViewDir points FROM surface TOWARDS camera, so we march in -xy.
    vec2 _uvDelta = (-_tsViewDir.xy / max(abs(_tsViewDir.z), 0.2)) * (uParallaxScale * _stepSize);
    for (int _i = 0; _i < 16; _i++) {
        if (float(_i) >= uParallaxSteps) break;
        _layerH += _stepSize;
        pUV += _uvDelta;
        float _h = texture2D(bumpMap, pUV).r;
        if (_h >= _layerH) break;
    }
    pUV = clamp(pUV, 0.001, 0.999);
#else
    vec2 pUV = vMapUv;
#endif

#ifdef USE_MAP
    vec4 sampledDiffuseColor = texture2D( map, vMapUv );
    #ifdef DECODE_VIDEO_TEXTURE
        sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
    #endif
    diffuseColor *= sampledDiffuseColor;
#endif
`;
      frag = frag.replace(MAP_FRAGMENT_TOKEN, parallaxChunk);

      // 3) Replace `normal_fragment_maps` with tangent-space blend + bump.
      //    When parallax is active we sample the normal at `pUV` so the
      //    surface lighting follows the offset; otherwise we use vNormalMapUv
      //    as before (which equals vMapUv for our geometry).
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

    #ifdef PAINTING_USE_PARALLAX
        vec2 _normalUV = pUV;
    #else
        vec2 _normalUV = vNormalMapUv;
    #endif

    vec3 mapN = texture2D( normalMap, _normalUV ).xyz * 2.0 - 1.0;

    #ifdef PAINTING_USE_DETAIL_NORMAL
        vec3 detailN = texture2D( tDetailNormal, _normalUV * uDetailTiling ).xyz * 2.0 - 1.0;
        mapN.xy += detailN.xy * uDetailNormalStrength;
        mapN = normalize( mapN );
    #endif

    mapN.xy *= normalScale;
    normal = normalize( tbn * mapN );

#elif defined( USE_BUMPMAP )

    normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );

#endif

#ifdef PAINTING_USE_BUMP
    vec2 paintDH = dHdxy_fwd() * uBumpStrength;
    normal = perturbNormalArb( - vViewPosition, normal, paintDH, faceDirection );
#endif
`;
      frag = frag.replace(NORMAL_MAPS_TOKEN, blendedNormalChunk);

      // 4) Lights end: self-shadow + grazing boost + albedo-only override.
      //    Order matters:
      //      a. Self-shadow attenuates direct light (must run before grazing
      //         so the grazing boost sees the attenuated specular).
      //      b. Grazing boost.
      //      c. Albedo-only debug — overrides everything when enabled.
      const lightsEndChunk = /* glsl */ `
${LIGHTS_END_TOKEN}

#ifdef PAINTING_USE_SELFSHADOW
    {
        // uKeyLightDir is supplied per-frame in view space, pointing FROM
        // surface TOWARDS the light source.
        vec3 _tsLight = normalize(vec3(
            dot(uKeyLightDir, vTangent.xyz),
            dot(uKeyLightDir, vBitangent),
            dot(uKeyLightDir, vNormal)
        ));
        // Smoothly fade the whole effect out below the horizon so changing
        // light angles do not produce a hard cutoff edge.
        float _grazeMask = smoothstep(0.05, 0.20, _tsLight.z);
        if (_grazeMask > 0.0) {
            float _shStep = 1.0 / max(uShadowSteps, 1.0);
            #ifdef PAINTING_USE_PARALLAX
                vec2 _shUV = pUV;
            #else
                vec2 _shUV = vMapUv;
            #endif
            float _curH = texture2D(bumpMap, _shUV).r;
            // March towards the light projection in UV space. Scale chosen
            // so 8 steps cover roughly the same UV distance as parallax.
            vec2 _shDelta = (_tsLight.xy / max(abs(_tsLight.z), 0.2)) * (uParallaxScale * _shStep);

            // v0.05: smooth weighted accumulation. Each step contributes
            // smoothstep(excess) instead of a binary break, weighted by an
            // inverse-distance fall-off so far steps cannot dominate. The
            // result is clamped to uShadowMaxOcclusion, preventing broad
            // height plateaus from forming solid dark patches ("stains").
            float _occlusion = 0.0;
            float _totalWeight = 0.0;
            for (int _j = 0; _j < 16; _j++) {
                if (float(_j) >= uShadowSteps) break;
                vec2 _stepUV = clamp(_shUV + _shDelta * float(_j + 1), 0.001, 0.999);
                float _sampleH = texture2D(bumpMap, _stepUV).r;
                float _wantedH = _curH + (_tsLight.z * _shStep * float(_j + 1));
                float _excess = _sampleH - _wantedH - uShadowBias;
                float _softBlocker = smoothstep(0.0, max(uShadowSoftness, 0.001), _excess);
                float _distW = 1.0 / (float(_j) + 1.0);
                _occlusion   += _softBlocker * _distW;
                _totalWeight += _distW;
            }
            _occlusion = (_totalWeight > 0.0) ? (_occlusion / _totalWeight) : 0.0;
            _occlusion = clamp(_occlusion, 0.0, uShadowMaxOcclusion);

            #ifdef PAINTING_USE_SHADOW_FILTER
                {
                    // v0.06: two companion rays perpendicular to the primary
                    // march direction. Averaging three rays removes lateral
                    // texel-step hard edges under raking light without raising
                    // the overall darkening envelope (each ray is clamped to
                    // uShadowMaxOcclusion before averaging).
                    float _dLen = length(_shDelta);
                    vec2 _latDir = (_dLen > 0.0001)
                        ? vec2(-_shDelta.y, _shDelta.x) * (uShadowFilterRadius / _dLen)
                        : vec2(uShadowFilterRadius, 0.0);
                    float _oL = 0.0, _oR = 0.0, _wTot = 0.0;
                    for (int _k = 0; _k < 16; _k++) {
                        if (float(_k) >= uShadowSteps) break;
                        float _fi  = float(_k + 1);
                        float _wk  = 1.0 / _fi;
                        float _wH  = _curH + _tsLight.z * _shStep * _fi;
                        vec2  _bo  = _shDelta * _fi;
                        float _exL = texture2D(bumpMap, clamp(_shUV + _bo - _latDir, 0.001, 0.999)).r
                                     - _wH - uShadowBias;
                        float _exR = texture2D(bumpMap, clamp(_shUV + _bo + _latDir, 0.001, 0.999)).r
                                     - _wH - uShadowBias;
                        _oL   += smoothstep(0.0, max(uShadowSoftness, 0.001), _exL) * _wk;
                        _oR   += smoothstep(0.0, max(uShadowSoftness, 0.001), _exR) * _wk;
                        _wTot += _wk;
                    }
                    float _lOcc = clamp((_wTot > 0.0) ? _oL / _wTot : 0.0, 0.0, uShadowMaxOcclusion);
                    float _rOcc = clamp((_wTot > 0.0) ? _oR / _wTot : 0.0, 0.0, uShadowMaxOcclusion);
                    _occlusion = (_occlusion + _lOcc + _rOcc) / 3.0;
                }
            #endif

            float _shadow = 1.0 - uShadowStrength * _occlusion * uShadowProfileScale * _grazeMask;
            #ifdef PAINTING_DEBUG_SHADOW
                // Stash the greyscale mask in indirectDiffuse so the debug
                // override below can pick it up unambiguously.
                reflectedLight.indirectDiffuse = vec3(_shadow);
            #endif
            reflectedLight.directDiffuse  *= _shadow;
            reflectedLight.directSpecular *= _shadow;
        } else {
            #ifdef PAINTING_DEBUG_SHADOW
                reflectedLight.indirectDiffuse = vec3(1.0);
            #endif
        }
    }
#endif

#ifdef PAINTING_USE_GRAZING_BOOST
    {
        float NdotV = abs( dot( normal, normalize( vViewPosition ) ) );
        float grazingMask = pow( 1.0 - NdotV, 3.0 );
        reflectedLight.directSpecular *= ( 1.0 + grazingMask * uLightGrazingBoost );
    }
#endif

#ifdef PAINTING_DEBUG_ALBEDO_ONLY
    // Strip all shading so reviewers can verify the shader is not
    // re-interpreting the picture. Uses indirectDiffuse so tone mapping and
    // colour-space conversion still run normally (the post-pipeline expects
    // a linear value here).
    reflectedLight.directDiffuse  = vec3(0.0);
    reflectedLight.directSpecular = vec3(0.0);
    reflectedLight.indirectDiffuse  = diffuseColor.rgb;
    reflectedLight.indirectSpecular = vec3(0.0);
#endif

#ifdef PAINTING_DEBUG_SHADOW
    // v0.05: greyscale self-shadow visualisation. White = unshadowed, black =
    // maximum attenuation. The shadow value was stashed into indirectDiffuse
    // by the self-shadow block above. When the self-shadow block is compiled
    // out, this falls back to fully white (no shadow).
    #ifndef PAINTING_USE_SELFSHADOW
        reflectedLight.indirectDiffuse = vec3(1.0);
    #endif
    reflectedLight.directDiffuse   = vec3(0.0);
    reflectedLight.directSpecular  = vec3(0.0);
    reflectedLight.indirectSpecular = vec3(0.0);
#endif
`;
      frag = frag.replace(LIGHTS_END_TOKEN, lightsEndChunk);

      shader.fragmentShader = defines.join('\n') + '\n' + frag;
    };
  }

  private detailNormalActive(): boolean {
    return (
      this.hasDetailNormal &&
      this.paintingUniforms.uDetailNormalStrength.value > 0
    );
  }

  private parallaxActive(): boolean {
    return this.parallaxEnabledFlag && !!this.bumpMap && this.paintingUniforms.uParallaxScale.value > 0;
  }

  private selfShadowActive(): boolean {
    return this.selfShadowEnabledFlag && !!this.bumpMap && this.paintingUniforms.uShadowStrength.value > 0;
  }

  applyPreset(preset: QualityPreset): void {
    this.normalScale.set(preset.normalStrength, preset.normalStrength);
    this.clearcoatRoughness = preset.clearcoatRoughnessValue;

    if (!preset.clearcoatEnabled) {
      this.clearcoat = 0.0;
      if (this.clearcoatMap) {
        this.clearcoatMap = null;
        this.needsUpdate = true;
      }
    }

    this.paintingUniforms.uDetailNormalStrength.value = preset.detailNormalStrength;
    this.paintingUniforms.uBumpStrength.value = preset.bumpStrength;
    this.paintingUniforms.uParallaxScale.value = preset.parallaxEnabled ? preset.parallaxScale : 0.0;
    this.paintingUniforms.uParallaxSteps.value = preset.parallaxSteps;
    this.paintingUniforms.uShadowSteps.value = preset.selfShadowSteps;
    this.paintingUniforms.uShadowStrength.value = preset.selfShadowStrength;
    this.paintingUniforms.uShadowBias.value = preset.selfShadowBias;
    this.paintingUniforms.uShadowSoftness.value = preset.selfShadowSoftness;
    this.paintingUniforms.uShadowMaxOcclusion.value = preset.selfShadowMaxOcclusion;
    // v0.06: keep the uniform in sync with the preset. The enable flag is
    // owned by main.ts (driven from the light profile's displayIntent) and
    // toggled via setShadowFilterRadius(), so applyPreset only writes the
    // numeric radius.
    this.paintingUniforms.uShadowFilterRadius.value = preset.selfShadowFilterRadius;

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
    const wantsParallax = preset.parallaxEnabled && !!this.bumpMap && preset.parallaxScale > 0;
    const wantsSelfShadow = preset.selfShadowEnabled && !!this.bumpMap && preset.selfShadowStrength > 0;

    const definesChanged =
      wantsAO !== this.hasAO ||
      wantsDetail !== this.detailNormalActive() ||
      wantsBump !== this.hasBump ||
      wantsGrazing !== this.grazingEnabled ||
      wantsParallax !== this.parallaxEnabledFlag ||
      wantsSelfShadow !== this.selfShadowEnabledFlag ||
      preset.shaderVariant !== this.currentVariant;

    this.hasAO = wantsAO;
    this.hasDetailNormal = wantsDetail;
    this.hasBump = wantsBump;
    this.grazingEnabled = wantsGrazing;
    this.parallaxEnabledFlag = wantsParallax;
    this.selfShadowEnabledFlag = wantsSelfShadow;
    this.currentVariant = preset.shaderVariant;

    if (!wantsAO) {
      this.aoMap = null;
    }
    if (!wantsBump && !wantsParallax && !wantsSelfShadow) {
      // bumpMap doubles as the height field for parallax/self-shadow, so we
      // only release it when no path needs it.
      this.bumpMap = null;
    }

    if (definesChanged) {
      this.needsUpdate = true;
    }
  }

  /**
   * v0.04: applies per-artwork surface character to the clearcoat response.
   * Authored varnish maps own per-pixel intensity; profiles then tune roughness.
   */
  applySurfaceProfile(profile: SurfaceProfile | undefined, preset: QualityPreset): void {
    if (!preset.clearcoatEnabled) {
      this.clearcoat = 0.0;
      if (this.clearcoatMap) {
        this.clearcoatMap = null;
        this.needsUpdate = true;
      }
      return;
    }

    switch (profile) {
      case 'varnished-oil':
        if (!this.clearcoatMap) this.clearcoat = Math.min(preset.clearcoatStrength * 1.6, 0.2);
        this.clearcoatRoughness = 0.22;
        break;
      case 'satin-canvas':
        if (!this.clearcoatMap) this.clearcoat = preset.clearcoatStrength * 0.4;
        this.clearcoatRoughness = 0.5;
        break;
      case 'matte-canvas':
      case 'paper':
      case 'procedural-fallback':
      default:
        if (!this.clearcoatMap) this.clearcoat = 0.0;
        this.clearcoatRoughness = preset.clearcoatRoughnessValue;
        break;
    }
  }

  applyTextures(
    textures: ResolvedPaintingTextures,
    tilingPerWorldUnit: THREE.Vector2,
    preset: QualityPreset
  ): void {
    this.map = textures.albedo;

    this.normalMap = textures.normal ?? null;

    this.roughnessMap = preset.shaderVariant === 'painting-battery' ? null : (textures.roughness ?? null);
    if (this.roughnessMap) this.roughness = 1.0;

    this.specularIntensityMap = preset.specularStrength > 0 ? (textures.specular ?? null) : null;
    this.specularIntensity = preset.specularStrength > 0 ? preset.specularStrength : 0.3;

    this.paintingUniforms.tDetailNormal.value =
      preset.detailNormalEnabled && preset.detailNormalStrength > 0 ? (textures.detailNormal ?? null) : null;
    this.paintingUniforms.uDetailTiling.value.copy(tilingPerWorldUnit);

    // Height map drives parallax (v0.03), self-shadow (v0.03), AND the bump
    // perturbation path. We keep it bound whenever ANY of those three paths
    // is requested by the preset.
    const needsHeight =
      preset.bumpStrength > 0 ||
      (preset.parallaxEnabled && preset.parallaxScale > 0) ||
      preset.selfShadowEnabled;
    this.bumpMap = needsHeight ? (textures.height ?? null) : null;
    this.bumpScale = 1.0;

    this.aoMap = textures.ao ?? null;
    this.aoMapIntensity = 1.0;

    const nextClearcoatMap = preset.clearcoatEnabled ? (textures.varnish ?? null) : null;
    const clearcoatMapChanged = nextClearcoatMap !== this.clearcoatMap;
    this.clearcoatMap = nextClearcoatMap;
    this.clearcoat = preset.clearcoatEnabled && textures.varnish ? preset.clearcoatStrength : 0.0;
    this.clearcoatRoughness = preset.clearcoatRoughnessValue;
    if (clearcoatMapChanged) {
      this.needsUpdate = true;
    }

    this.applyPreset(preset);
  }

  setReducedMotion(reducedMotion: boolean): void {
    if (this.reducedMotion === reducedMotion) return;
    this.reducedMotion = reducedMotion;
    // v0.15.1 fix: reduced motion must not lower picture/shader fidelity.
    // This flag is retained for API compatibility, but all fidelity paths
    // (detail-normal and grazing/specular response) remain quality-preset
    // controlled only.
    this.paintingUniforms.uReducedMotionScalar.value = 1.0;
  }

  /**
   * v0.03: assigns the key-light direction in VIEW space, called per-frame
   * by main.ts. The shader uses it to march the height field for the
   * self-shadow approximation.
   */
  setKeyLightDirView(dir: THREE.Vector3): void {
    this.paintingUniforms.uKeyLightDir.value.copy(dir);
  }

  /**
   * v0.03: enables the albedo-only debug render, which strips all shading
   * and shows only the raw artwork texture. Used for fidelity QA.
   */
  setAlbedoOnly(enabled: boolean): void {
    if (this.albedoOnlyEnabled === enabled) return;
    this.albedoOnlyEnabled = enabled;
    this.paintingUniforms.uAlbedoOnly.value = enabled ? 1 : 0;
    this.needsUpdate = true;
  }

  /**
   * v0.05: per-profile dimming of the self-shadow contribution. Museum-style
   * `display` profiles call this with 0.5; `inspection` (raking) profiles
   * call this with 1.0. The shader multiplies the accumulated occlusion by
   * this scalar, so changing it is a uniform update and does not recompile.
   *
   * Open for enhancement: future profiles can carry their own scale value
   * via `LightProfile.shadowProfileScale` and main.ts can read it here.
   */
  setShadowProfileScale(scale: number): void {
    this.paintingUniforms.uShadowProfileScale.value = Math.max(0, Math.min(2, scale));
  }

  /**
   * v0.05: enables the shadow-only debug overlay. Renders the self-shadow
   * mask as greyscale (white = unshadowed, black = full attenuation). This
   * recompiles the shader because it toggles a `#define`.
   */
  setShadowDebug(enabled: boolean): void {
    if (this.shadowDebugEnabled === enabled) return;
    this.shadowDebugEnabled = enabled;
    this.needsUpdate = true;
  }

  /**
   * v0.06: enables or disables the lateral PCF-like self-shadow filter.
   * `radius` is in UV space (typical 0.001..0.004 — must stay well below
   * `parallaxScale / shadowSteps` to avoid lateral overlap between steps).
   *
   * Changing `enabled` triggers a full shader recompile via
   * `needsUpdate = true` because it adds/removes the
   * `#define PAINTING_USE_SHADOW_FILTER` define. Changing only `radius`
   * while `enabled` is unchanged is a cheap uniform write.
   *
   * Call from main.ts on light-profile change:
   *   inspection profile → setShadowFilterRadius(preset.selfShadowFilterRadius, true)
   *   gallery profile    → setShadowFilterRadius(0, false)
   */
  setShadowFilterRadius(radius: number, enabled: boolean): void {
    this.paintingUniforms.uShadowFilterRadius.value = Math.max(0, radius);
    if (enabled !== this.shadowFilterEnabled) {
      this.shadowFilterEnabled = enabled;
      this.needsUpdate = true;
    }
  }

  get shaderVariant(): PaintingShaderVariant {
    return this.currentVariant;
  }

  activeMaps(): string[] {
    const active: string[] = ['albedo'];
    if (this.normalMap) active.push('normal');
    if (this.hasDetailNormal) active.push('detailNormal');
    if (this.bumpMap) active.push('height');
    if (this.roughnessMap) active.push('roughness');
    if (this.specularIntensityMap) active.push('specular');
    if (this.aoMap) active.push('ao');
    if (this.clearcoatMap || this.clearcoat > 0) active.push('varnish');
    return active;
  }
}
