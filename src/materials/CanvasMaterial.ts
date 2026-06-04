import * as THREE from 'three';
import type { QualityPreset } from '../config/quality';

type FrameShaderUniforms = {
  uFrameSeed: { value: number };
  uBaseRoughness: { value: number };
};

// v0.72 — Natural-scratch model: replace the v0.71 shiny-scratch (subtractive
// roughness) with additive roughness so scratch marks read as subtle surface
// disruptions rather than mirror-like bright lines. Lower frameRoughness and
// stronger clearcoat (see quality.ts) restore the satin aluminum sheen. Normal
// gradient scale raised 0.085→0.12 for more visible brushed texture depth.
// Anisotropy perturbation reduced 0.40→0.22 rad for more consistent grain.
// Preserves the v0.54 1-D invariant (no `barUV.y` in any FBM call →
// dFBM/dY = 0 → zero cross-bar normal gradient) while adding bounded
// fine-scale detail, split micro/macro scratch lanes, derivative-aware AA
// and (high preset only) per-fragment anisotropy direction perturbation.
//
// Preset branching is controlled by `#define FRAME_DETAIL_HIGH|BALANCED`
// prepended by `onBeforeCompile` (M-06). Battery preset compiles neither
// macro and produces the same program as the v0.54 path.
const FRAME_FRAG_FUNCTIONS = /* glsl */ `
// v0.70 brushed-metal procedural normal & roughness
// barUV.x = world-space position along bar length
// barUV.y = 0..1 normalized across bar width (used only for scratch position)

uniform float uFrameSeed;
uniform float uBaseRoughness;

float frmHash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float frmNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n = i.x + i.y * 57.0;
  return mix(
    mix(frmHash(n),        frmHash(n + 1.0),  f.x),
    mix(frmHash(n + 57.0), frmHash(n + 58.0), f.x),
    f.y
  );
}

// Purely 1-D brushed FBM: yConst is a seed-derived constant so the
// function does NOT vary with barUV.y → dFBM/dY = 0 → zero across-bar
// normal gradient → no banding at any aspect ratio or frame size.
float frmBrushedFbm(float alongX, float yConst) {
  float wx = frmNoise(vec2(alongX * 0.6 + 15.6, yConst));
  float qx = alongX + (wx - 0.5) * 0.30;
  float v = 0.0;
  v += 0.5000 * frmNoise(vec2(qx * 2.5,  yConst));
  v += 0.2500 * frmNoise(vec2(qx * 5.1,  yConst + 1.618));
  v += 0.1250 * frmNoise(vec2(qx * 10.3, yConst + 3.141));
  v += 0.0625 * frmNoise(vec2(qx * 20.7, yConst + 7.389));
  return v;
}

#if defined(FRAME_DETAIL_HIGH) || defined(FRAME_DETAIL_BALANCED)
// v0.69 M-02: fine-scale 1-D brushed FBM. Same invariant as primary
// (no barUV.y), ~4× higher base frequency, tighter domain warp.
// Amplitude is capped in 'frmBrushedNormal' to 0.25× the primary
// scale to preserve subtlety.
float frmBrushedFbm2(float alongX, float yConst) {
  float wx = frmNoise(vec2(alongX * 2.2 + 27.3, yConst + 4.0));
  float qx = alongX + (wx - 0.5) * 0.12;
  float v = 0.0;
  v += 0.5000 * frmNoise(vec2(qx * 9.0,  yConst + 6.28));
  v += 0.2500 * frmNoise(vec2(qx * 18.1, yConst + 9.42));
  v += 0.1250 * frmNoise(vec2(qx * 36.3, yConst + 12.57));
  return v;
}
#endif

// Roughness sparkle grain — also 1-D to avoid cross-bar roughness banding.
float frmRoughnessGrain(vec2 barUV, float seed) {
  float yConst = frmHash(seed * 13.37) * 57.0;
  float wx = frmNoise(vec2(barUV.x * 1.1 + seed * 13.7, yConst));
  float qx = barUV.x + (wx - 0.5) * 0.18;
  float v = 0.0;
  v += 0.5000 * frmNoise(vec2(qx * 28.0,  yConst));
  v += 0.3000 * frmNoise(vec2(qx * 57.0,  yConst + seed * 0.37));
  v += 0.2000 * frmNoise(vec2(qx * 115.0, yConst + seed * 0.71));
  return v;
}

// Sparse isolated scratches: thin lines at random Y positions running
// along the brush direction (barUV.x). barUV.y determines the scratch
// position across the bar width, which is intentional and correct.
float frmScratchLine(vec2 barUV, float density, float localSeed) {
  float seg   = floor(barUV.x * density);
  float sh    = frmHash(seg + localSeed * 137.619);
  if (sh > 0.032) return 0.0;
  float lineY = 0.1 + frmHash(seg + localSeed * 53.27) * 0.8;
  float dist  = abs(barUV.y - lineY);
  float fw    = fwidth(barUV.y);
  float width = max(fw * 0.5, 0.0005 + frmHash(seg + localSeed * 71.33) * 0.0010);
  float inten = 0.030 + frmHash(seg + localSeed * 23.71) * 0.048;
  float segPhase = fract(barUV.x * density);
  float shape = smoothstep(0.12, 0.30, segPhase) * (1.0 - smoothstep(0.65, 0.90, segPhase));
  return smoothstep(width, 0.0, dist) * inten * shape;
}

float frmScratchLayer(vec2 barUV, float seed) {
#if defined(FRAME_DETAIL_HIGH)
  // v0.69 M-03: clustered scratch presence. A coarse per-zone hash
  // (~every 1/3 of bar length) groups scratches into wear families
  // instead of distributing them uniformly. Cluster gain peaks at
  // 2.5× presence in ~40% of zones, never increases roughness impact
  // (the roughness scratch cap in roughnessmap_fragment is unchanged).
  float clusterHash = frmHash(floor(barUV.x * 3.0 + 1.0) * 17.0 + seed * 29.3);
  float clusterGain = 1.0 + smoothstep(0.60, 0.75, clusterHash) * 1.5;
  float a = frmScratchLine(barUV,  8.0, seed);
  float b = frmScratchLine(barUV, 14.0, seed + 5.11);
  float c = frmScratchLine(barUV, 22.0, seed + 11.37);
  return clamp((a * 0.12 + b * 0.10 + c * 0.08) * clusterGain, 0.0, 0.28);
#else
  float a = frmScratchLine(barUV,  8.0, seed);
  float b = frmScratchLine(barUV, 14.0, seed + 5.11);
  float c = frmScratchLine(barUV, 22.0, seed + 11.37);
  return clamp(a * 0.10 + b * 0.08 + c * 0.06, 0.0, 0.22);
#endif
}

// v0.70 S-02: low-frequency wear-zone mask for macro scratch visibility.
// Uses a coarse along-bar zone index with smooth transitions to avoid
// hard on/off blocks.
float frmWearZoneMask(float alongX, float seed) {
  float zonePos = alongX * 1.4 + 0.5;
  float zoneIndex = floor(zonePos);
  float zoneBlend = smoothstep(0.0, 1.0, fract(zonePos));
  float z0 = frmHash(zoneIndex + seed * 43.71);
  float z1 = frmHash(zoneIndex + 1.0 + seed * 43.71);
  float zoneHash = mix(z0, z1, zoneBlend);
  return smoothstep(0.32, 0.82, zoneHash);
}

#if defined(FRAME_MACRO_SCRATCH)
float frmScratchLineMacro(vec2 barUV, float density, float localSeed) {
  float seg = floor(barUV.x * density);
  float sh = frmHash(seg + localSeed * 149.417);
  if (sh > 0.070) return 0.0;
  float lineY = 0.08 + frmHash(seg + localSeed * 61.39) * 0.84;
  float dist = abs(barUV.y - lineY);
  float fw = fwidth(barUV.y);
  float width = max(fw * 0.65, 0.0016 + frmHash(seg + localSeed * 79.81) * 0.0024);
  float inten = 0.055 + frmHash(seg + localSeed * 29.57) * 0.100;
  float segPhase = fract(barUV.x * density);
  float shape = smoothstep(0.10, 0.26, segPhase) * (1.0 - smoothstep(0.70, 0.92, segPhase));
  return smoothstep(width, 0.0, dist) * inten * shape;
}

float frmScratchLayerMacro(vec2 barUV, float seed) {
  float wearMask = frmWearZoneMask(barUV.x, seed);
  float a = frmScratchLineMacro(barUV, 2.0, seed + 2.17);
  float b = frmScratchLineMacro(barUV, 4.2, seed + 7.43);
  float c = frmScratchLineMacro(barUV, 7.0, seed + 13.91);
  return clamp((a * 0.32 + b * 0.26 + c * 0.20) * wearMask, 0.0, 0.35);
}
#endif

// Normal: purely 1-D perturbation along the bar.
// Y gradient is zero by construction (no hy sample).
// Primary scale 0.025 → max ≈ 7° tilt.
// On high/balanced presets a fine-detail layer is added; its contribution
// is attenuated by fwidth(barUV.x) so it vanishes at mid distance,
// removing any shimmer risk (M-05).
vec3 frmBrushedNormal(vec2 barUV, float seed) {
  float yConst = frmHash(seed * 7.31) * 57.0;
  float eps = 0.010;
  float h0 = frmBrushedFbm(barUV.x,       yConst);
  float hx = frmBrushedFbm(barUV.x + eps, yConst);
  float gradX = (h0 - hx) / eps * 0.12;
#if defined(FRAME_DETAIL_HIGH) || defined(FRAME_DETAIL_BALANCED)
  float yConst2 = frmHash(seed * 3.17) * 57.0;
  float h0f = frmBrushedFbm2(barUV.x,       yConst2);
  float hxf = frmBrushedFbm2(barUV.x + eps, yConst2);
  float fw = fwidth(barUV.x);
  float fineAttn = 1.0 - smoothstep(0.004, 0.015, fw);
  #if defined(FRAME_DETAIL_HIGH)
    float fineAmp = 0.022;
  #else
    float fineAmp = 0.016;
  #endif
  gradX += (h0f - hxf) / eps * fineAmp * fineAttn;
#endif
#if defined(FRAME_MACRO_SCRATCH)
  float macroN = frmScratchLayerMacro(barUV, seed);
  #if defined(FRAME_DETAIL_HIGH)
    float macroNormalAmp = 0.025;
  #else
    float macroNormalAmp = 0.014;
  #endif
  gradX += macroN * macroNormalAmp;
#endif
  return normalize(vec3(gradX, 0.0, 1.0));
}
`;

// Replaces #include <normal_fragment_maps> — computes procedural normal using
// bar-local UV varying and transforms from tangent space to view space via tbn.
const FRAME_FRAG_NORMAL_REPLACE = /* glsl */ `
{
  vec3 proceduralN = frmBrushedNormal(vFrameUV, uFrameSeed);
  normal = normalize(tbn * proceduralN);
}
`;

// v0.69 M-05: roughness grain attenuation. The two highest-frequency grain
// octaves (57.0, 115.0) become aliased at mid distance; `fwidth` collapses
// the modulation toward neutral (0.5) as pixel footprint grows.
// Roughness scratch cap (+0.015) is unchanged across all presets so cluster
// gain (M-03) only affects visual presence, not BRDF roughness.
const FRAME_FRAG_ROUGHNESS_REPLACE_HIGH = /* glsl */ `
  float fwR = fwidth(vFrameUV.x);
  float grainAttn = 1.0 - smoothstep(0.003, 0.012, fwR);
  float scratchMicroAttn = 1.0 - smoothstep(0.003, 0.012, fwR);
  float scratchMacroAttn = 1.0 - smoothstep(0.006, 0.024, fwR);
  float roughnessGrain = frmRoughnessGrain(vFrameUV, uFrameSeed);
  // Fade grain modulation to neutral (0.5) at distance — eliminates
  // high-frequency roughness aliasing without preset branching.
  roughnessGrain = mix(0.5, roughnessGrain, grainAttn);
  float roughnessScratchMicro = frmScratchLayer(vFrameUV, uFrameSeed) * scratchMicroAttn;
  float roughnessScratchMacro = frmScratchLayerMacro(vFrameUV, uFrameSeed) * scratchMacroAttn;
  // v0.72: natural scratch model — scratches disrupt the anodized surface
  // → slightly more matte (additive), not shiny.  Grain ±0.05 is tighter
  // to keep the satin surface uniform between scratch marks.
  float roughnessFactor = uBaseRoughness
    + (roughnessGrain - 0.5) * 0.10
    + roughnessScratchMicro * 0.025
    + roughnessScratchMacro * 0.045;
  roughnessFactor = clamp(roughnessFactor, 0.06, 0.76);
`;

const FRAME_FRAG_ROUGHNESS_REPLACE_BALANCED = /* glsl */ `
  float fwR = fwidth(vFrameUV.x);
  float grainAttn = 1.0 - smoothstep(0.003, 0.012, fwR);
  float scratchMicroAttn = 1.0 - smoothstep(0.003, 0.012, fwR);
  float scratchMacroAttn = 1.0 - smoothstep(0.006, 0.024, fwR);
  float roughnessGrain = frmRoughnessGrain(vFrameUV, uFrameSeed);
  roughnessGrain = mix(0.5, roughnessGrain, grainAttn);
  float roughnessScratchMicro = frmScratchLayer(vFrameUV, uFrameSeed) * scratchMicroAttn;
  float roughnessScratchMacro = frmScratchLayerMacro(vFrameUV, uFrameSeed) * scratchMacroAttn;
  // v0.72: natural scratch model, reduced vs high.
  float roughnessFactor = uBaseRoughness
    + (roughnessGrain - 0.5) * 0.07
    + roughnessScratchMicro * 0.018
    + roughnessScratchMacro * 0.032;
  roughnessFactor = clamp(roughnessFactor, 0.08, 0.74);
`;

const FRAME_FRAG_ROUGHNESS_REPLACE_NONE = /* glsl */ `
  float roughnessGrain = frmRoughnessGrain(vFrameUV, uFrameSeed);
  float roughnessScratch = frmScratchLayer(vFrameUV, uFrameSeed);
  // v0.72: natural additive scratch model for battery preset.
  float roughnessFactor = uBaseRoughness
    + (roughnessGrain - 0.5) * 0.06
    + roughnessScratch * 0.020;
  roughnessFactor = clamp(roughnessFactor, 0.10, 0.72);
`;

// v0.69 M-04: per-fragment anisotropy direction perturbation (high preset only).
// Replaces `#include <lights_physical_fragment>` so we can compute the
// brushed direction from `vFrameUV` directly. This sidesteps the r166
// native `anisotropyMap` path entirely (which would sample from the
// standard `uv` channel — not aligned with our `aFrameUV` attribute) and
// avoids the need to author a DataTexture. The base direction matches the
// scalar `anisotropyRotation = π/2` orientation (vec2(0, 1)); a gentle
// sinusoidal perturbation along the bar simulates the natural mid-frequency
// wander of brushed grain.
const FRAME_FRAG_LIGHTS_PHYSICAL_REPLACE = /* glsl */ `
PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );

vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );

material.roughness = max( roughnessFactor, 0.0525 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );

#ifdef IOR
material.ior = ior;
#ifdef USE_SPECULAR
float specularIntensityFactor = specularIntensity;
vec3 specularColorFactor = specularColor;
#ifdef USE_SPECULAR_COLORMAP
specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
#endif
material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
#else
float specularIntensityFactor = 1.0;
vec3 specularColorFactor = vec3( 1.0 );
material.specularF90 = 1.0;
#endif
material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
material.specularF90 = 1.0;
#endif

#ifdef USE_CLEARCOAT
material.clearcoat = clearcoat;
material.clearcoatRoughness = clearcoatRoughness;
material.clearcoatF0 = vec3( 0.04 );
material.clearcoatF90 = 1.0;
#ifdef USE_CLEARCOATMAP
material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
#endif
material.clearcoat = saturate( material.clearcoat );
material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
material.clearcoatRoughness += geometryRoughness;
material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif

#ifdef USE_DISPERSION
material.dispersion = dispersion;
#endif

#ifdef USE_IRIDESCENCE
material.iridescence = iridescence;
material.iridescenceIOR = iridescenceIOR;
#ifdef USE_IRIDESCENCEMAP
material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
material.iridescenceThickness = ( iridescenceThicknessMaximum - iridescenceThicknessMinimum ) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
#else
material.iridescenceThickness = iridescenceThicknessMaximum;
#endif
#endif

#ifdef USE_SHEEN
material.sheenColor = sheenColor;
#ifdef USE_SHEENCOLORMAP
material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
#endif
material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
#ifdef USE_SHEEN_ROUGHNESSMAP
material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
#endif
#endif

#ifdef USE_ANISOTROPY
{
  // v0.69 M-04: per-fragment anisotropy direction perturbation.
  // Base direction matches the scalar 'anisotropyRotation = π/2'
  // (i.e. tangent-space vec2(0, 1)). A bar-aligned sinusoidal wander
  // (±0.18 rad ≈ ±10°) provides the directional micro-variance that
  // brushed-metal sheen exhibits in reality without breaking the
  // 1-D cross-bar invariant (vFrameUV.y is *not* used here).
  float angleBase = 1.5707963; // π/2
  float anglePert = sin(vFrameUV.x * 3.7 + uFrameSeed * 6.2831853) * 0.22;
  float ang = angleBase + anglePert;
  vec2 anisotropyV = vec2(cos(ang), sin(ang)) * length(anisotropyVector);
  material.anisotropy = length( anisotropyV );
  if( material.anisotropy == 0.0 ) {
    anisotropyV = vec2( 1.0, 0.0 );
  } else {
    anisotropyV /= material.anisotropy;
    material.anisotropy = saturate( material.anisotropy );
  }
  material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
  material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
  material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
}
#endif
`;

export class CanvasMaterial {
  private normalTexture: THREE.Texture | null = null;
  // v0.44: flat dummy normal map — ensures TANGENTSPACE_NORMALMAP / USE_TANGENT
  // shader defines are present so the vTBN varying is emitted.
  private frameFlatNormal: THREE.DataTexture | null = null;

  async loadNormalTexture(): Promise<THREE.Texture> {
    if (this.normalTexture) return this.normalTexture;

    const canvas = document.createElement('canvas');
    // 128×128 keeps procedural generation cheap while repeating cleanly across the artwork surface.
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      const texture = new THREE.Texture();
      this.normalTexture = texture;
      return texture;
    }

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let y = 0; y < canvas.height; y += 1) {
      for (let x = 0; x < canvas.width; x += 1) {
        const fiberX = Math.sin(x * 0.42) * 10;
        const fiberY = Math.cos(y * 0.38) * 10;
        const weave = Math.sin((x + y) * 0.11) * 4;
        const value = fiberX + fiberY + weave;
        const index = (y * canvas.width + x) * 4;

        data[index] = 128 + value;
        data[index + 1] = 128 - value;
        data[index + 2] = 255;
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(18, 18);
    texture.needsUpdate = true;
    this.normalTexture = texture;

    return texture;
  }

  createArtworkMaterial(
    normalTexture: THREE.Texture,
    map?: THREE.Texture
  ): THREE.MeshPhysicalMaterial {
    const mat = new THREE.MeshPhysicalMaterial({
      map: map ?? null,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(0.12, 0.12),
      roughness: 0.88,
      metalness: 0,
      clearcoat: 0.04,
    });
    return mat;
  }

  // ── v0.44 GLSL-injected brushed-metal frame ──────────────────────────────

  /**
   * Creates the frame material with `onBeforeCompile` GLSL injection.
   * Each artwork receives a distinct seed (passed as `uFrameSeed` uniform)
   * so grain phase varies across the gallery without regenerating any buffer.
   * DataTexture generation has been removed — normal and roughness are now
   * computed entirely per-fragment in GLSL (no tiling boundary, no seams).
   */
  createFrameMaterial(
    preset: QualityPreset,
    seed = 0,
    _frameBounds?: { outerHalf: THREE.Vector2; innerHalf: THREE.Vector2 }
  ): THREE.MeshPhysicalMaterial {
    void _frameBounds;
    // Minimal 1×1 flat normal map: required so Three.js emits the
    // TANGENTSPACE_NORMALMAP and USE_TANGENT shader defines, which make the
    // vTBN varying available in the fragment shader for our GLSL injection.
    const flatNormal = new THREE.DataTexture(
      new Uint8Array([128, 128, 255, 255]),
      1, 1, THREE.RGBAFormat
    );
    flatNormal.needsUpdate = true;
    this.frameFlatNormal?.dispose();
    this.frameFlatNormal = flatNormal;

    const uniforms: FrameShaderUniforms = {
      uFrameSeed:     { value: seed * 0.00390625 },
      uBaseRoughness: { value: preset.frameRoughness },
    };

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xd6d8db,
      roughness: preset.frameRoughness,
      metalness: 1.0,
      clearcoat: preset.frameClearcoat,
      clearcoatRoughness: 0.28,
      anisotropy: preset.frameAnisotropy,
      anisotropyRotation: Math.PI / 2,
      normalMap: flatNormal,
      normalScale: new THREE.Vector2(1.0, 1.0),
    });

    material.onBeforeCompile = (shader) => {
      // 1. Shared uniforms
      Object.assign(shader.uniforms, uniforms);

      // 2. Inject bar-local UV varying from the aFrameUV vertex attribute
      shader.vertexShader = 'attribute vec2 aFrameUV;\nvarying vec2 vFrameUV;\n' + shader.vertexShader;
      shader.fragmentShader = 'varying vec2 vFrameUV;\n' + shader.fragmentShader;
      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        'void main() {\n  vFrameUV = aFrameUV;'
      );

      // 3. M-06: preset detail level compile-flag.  Three distinct programs
      // (one per `frameDetailLevel`) — per-artwork seed remains a uniform.
      let detailDefine = '';
      if (preset.frameDetailLevel === 'high') {
        detailDefine = '#define FRAME_DETAIL_HIGH 1\n';
      } else if (preset.frameDetailLevel === 'balanced') {
        detailDefine = '#define FRAME_DETAIL_BALANCED 1\n';
      }
      const macroDefine =
        preset.frameDetailLevel === 'high' || preset.frameDetailLevel === 'balanced'
          ? '#define FRAME_MACRO_SCRATCH 1\n'
          : '';

      // 4. Prepend helper GLSL functions
      shader.fragmentShader = detailDefine + macroDefine + FRAME_FRAG_FUNCTIONS + '\n' + shader.fragmentShader;

      // 5. Procedural normal (tbn = Three.js r166 local mat3; do NOT use vTBN)
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <normal_fragment_maps>',
        FRAME_FRAG_NORMAL_REPLACE
      );

      // 6. Roughness variation: per-preset block.  Scratches deepen roughness
      // very slightly where they exist.  M-05 attenuates the high-frequency
      // grain term as pixel footprint grows (high/balanced only).
      let roughnessReplace: string;
      if (preset.frameDetailLevel === 'high') {
        roughnessReplace = FRAME_FRAG_ROUGHNESS_REPLACE_HIGH;
      } else if (preset.frameDetailLevel === 'balanced') {
        roughnessReplace = FRAME_FRAG_ROUGHNESS_REPLACE_BALANCED;
      } else {
        roughnessReplace = FRAME_FRAG_ROUGHNESS_REPLACE_NONE;
      }
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <roughnessmap_fragment>',
        roughnessReplace
      );

      // 7. M-04: per-fragment anisotropy direction perturbation (high only).
      // Replaces the entire `lights_physical_fragment` include with a copy
      // that computes anisotropyV procedurally from vFrameUV instead of
      // sampling an anisotropyMap from the (mis-aligned) standard uv channel.
      if (preset.frameDetailLevel === 'high') {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <lights_physical_fragment>',
          FRAME_FRAG_LIGHTS_PHYSICAL_REPLACE
        );
      }

      // 8. M-01: extended baseline log — explicit knob record for diff/audit.
      const cacheKey = 'frame-v0.72-' + preset.frameDetailLevel;
      const fineGrainAmplitude =
        preset.frameDetailLevel === 'high'
          ? 0.022
          : preset.frameDetailLevel === 'balanced'
            ? 0.016
            : 0.0;
      const roughnessGrainAmp = preset.frameDetailLevel === 'high' ? 0.10 : preset.frameDetailLevel === 'balanced' ? 0.07 : 0.06;
      const macroEnabled = preset.frameDetailLevel === 'high' || preset.frameDetailLevel === 'balanced';
      const macroStrengthMode =
        preset.frameDetailLevel === 'high'
          ? 'full'
          : preset.frameDetailLevel === 'balanced'
            ? 'reduced'
            : 'off';
      if (macroStrengthMode !== 'full') {
        console.debug('[CanvasMaterial] frame-macro-lane-state', {
          preset: preset.id,
          mode: macroStrengthMode,
        });
      }
      console.debug('[CanvasMaterial] frame-shader-compiled', {
        version: 'v0.72',
        preset: preset.id,
        frameDetailLevel: preset.frameDetailLevel,
        seed,
        frameRoughness: preset.frameRoughness,
        frameAnisotropy: preset.frameAnisotropy,
        frameClearcoat: preset.frameClearcoat,
        // Baseline knobs (v0.72 — natural-scratch model, lower roughness, stronger normals):
        normalGradientScale: 0.12,
        fineGrainAmplitude,
        roughnessGrainAmp,
        scratchRoughnessMode: 'natural-additive (scratches = slightly more matte)',
        scratchMicroRoughnessAmp: preset.frameDetailLevel === 'high' ? 0.025 : preset.frameDetailLevel === 'balanced' ? 0.018 : 0.020,
        scratchMacroRoughnessAmp: preset.frameDetailLevel === 'high' ? 0.045 : preset.frameDetailLevel === 'balanced' ? 0.032 : 'off',
        anisoDirectionPerturbation: '±0.22 rad (±12.6°)',
        macroLaneEnabled: macroEnabled,
        macroLaneStrengthMode: macroStrengthMode,
        macroDensityRange: macroEnabled ? '2.0..7.0' : 'off',
        macroWidthRange: macroEnabled ? '0.0016..0.0040' : 'off',
        macroAttenuationWindow: macroEnabled ? '1-smoothstep(0.006,0.024,fwidth(vFrameUV.x))' : 'off',
        clusterGainEnabled: preset.frameDetailLevel === 'high',
        anisoPerFragmentEnabled: preset.frameDetailLevel === 'high',
        coordinateMode: 'vertex-attribute-barUV',
        normalApproach: 'pure-1D-along-only-yConst-per-seed',
        roughnessGrain: 'pure-1D-along-direction',
        cacheKey,
      });
    };
    // Unique cache key per frame detail level so Three.js compiles distinct
    // programs for the three GLSL variants.  Per-artwork seed only updates a
    // uniform → no re-compile per artwork.  Battery (`none`) compiles GLSL
    // functionally equivalent to the v0.54 path.
    const cacheKey = 'frame-v0.72-' + preset.frameDetailLevel;
    material.customProgramCacheKey = () => cacheKey;

    // Store uniforms reference for refreshFrameUniforms (seed-only update on navigation).
    material.userData.frameUniforms = uniforms;

    console.debug('[CanvasMaterial] frame-material-created', {
      preset: preset.id, seed,
      frameRoughness: preset.frameRoughness, frameAnisotropy: preset.frameAnisotropy,
      coordinateMode: 'vertex-attribute-barUV',
    });

    return material;
  }

  /**
   * Updates only the `uFrameSeed` uniform for an existing frame material.
   * Called by ArtworkMesh when navigating to a different artwork. No texture
   * disposal or regeneration — the GLSL reads the new seed immediately on the
   * next frame.
   */
  refreshFrameUniforms(material: THREE.MeshPhysicalMaterial, seed: number): void {
    const u = material.userData.frameUniforms as FrameShaderUniforms | undefined;
    if (!u) return;
    u.uFrameSeed.value = seed * 0.00390625;
    console.debug('[CanvasMaterial] frame-uniforms-refreshed', { seed });
  }

  refreshFramePresetUniforms(material: THREE.MeshPhysicalMaterial, preset: QualityPreset): void {
    const u = material.userData.frameUniforms as FrameShaderUniforms | undefined;
    if (!u) return;
    u.uBaseRoughness.value = preset.frameRoughness;
    console.debug('[CanvasMaterial] frame-preset-uniforms-refreshed', {
      preset: preset.id,
      frameRoughness: preset.frameRoughness,
    });
  }

  refreshFrameGeometryUniforms(
    _material: THREE.MeshPhysicalMaterial,
    _frameBounds: { outerHalf: THREE.Vector2; innerHalf: THREE.Vector2 }
  ): void {
    void _material;
    void _frameBounds;
    // v0.53: No-op. Frame coordinates are now baked into the geometry attribute
    // (aFrameUV) and no longer depend on runtime uniforms. The geometry itself
    // is rebuilt when aspect changes, which regenerates the attribute.
    console.debug('[CanvasMaterial] frame-geometry-uniforms-noop (v0.53 attribute-based)');
  }

  dispose(): void {
    this.normalTexture?.dispose();
    this.frameFlatNormal?.dispose();
  }
}
