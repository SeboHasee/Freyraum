import * as THREE from 'three';
import type { QualityPreset } from '../config/quality';

type FrameShaderUniforms = {
  uFrameSeed: { value: number };
  uBaseRoughness: { value: number };
};

// v0.53 — GLSL procedural brushed-metal fragment functions.
// Root-cause fix: the FBM was varying height in the ACROSS direction (Y),
// which creates visible parallel ridges no matter the frequency.
// Real brushed metal is optically flat — the brushed appearance comes
// entirely from anisotropic specular reflection, not surface bumps.
// v0.53: height varies only ALONG the bar (X), with negligible Y gradient.
// Roughness sparkle (fine along-direction variation) handles the grain shimmer.
const FRAME_FRAG_FUNCTIONS = /* glsl */ `
// v0.53 brushed-metal procedural normal & roughness
// barUV.x = world-space position along bar length (~-2.2 to 2.2)
// barUV.y = 0..1 normalized across bar width

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

// Height varies ONLY along the bar (X direction).
// Y (across) frequency is kept very low (< 2) so its gradient is negligible
// and produces no visible horizontal/vertical line ridges.
float frmBrushedFbm(vec2 barUV) {
  // Domain warp in X only to break periodicity along bar
  float wx = frmNoise(vec2(barUV.x * 0.6 + 15.6, barUV.y * 0.4 + 28.1));
  float qx = barUV.x + (wx - 0.5) * 0.30;
  float v = 0.0;
  v += 0.5000 * frmNoise(vec2(qx * 2.5,  barUV.y * 0.7));
  v += 0.2500 * frmNoise(vec2(qx * 5.1,  barUV.y * 1.4) + 1.618);
  v += 0.1250 * frmNoise(vec2(qx * 10.3, barUV.y * 2.8) + 3.141);
  v += 0.0625 * frmNoise(vec2(qx * 20.7, barUV.y * 5.6) + 7.389);
  return v;
}

// Fine roughness grain running along the brush direction.
// High X frequency creates the characteristic shimmer/sparkle of satin metal.
// Very low Y frequency — no across variation = no lines.
float frmRoughnessGrain(vec2 barUV, float seed) {
  float wx = frmNoise(vec2(barUV.x * 1.1 + seed * 13.7, barUV.y * 0.3 + seed * 7.3));
  float qx = barUV.x + (wx - 0.5) * 0.18;
  float v = 0.0;
  v += 0.5000 * frmNoise(vec2(qx * 28.0, barUV.y * 1.5));
  v += 0.3000 * frmNoise(vec2(qx * 57.0, barUV.y * 3.0) + seed * 0.37);
  v += 0.2000 * frmNoise(vec2(qx * 115.0, barUV.y * 6.0) + seed * 0.71);
  return v;
}

// Sparse isolated scratches: each is a random segment along the bar length.
// Scratches run ALONG the brush direction (X), not across.
// Very sparse (< 2% of possible scratch slots) so they never look like a grid.
float frmScratchLine(vec2 barUV, float density, float localSeed) {
  // Divide bar into X segments
  float seg   = floor(barUV.x * density);
  float sh    = frmHash(seg + localSeed * 137.619);
  if (sh > 0.018) return 0.0;  // only ~1.8% of segments have a scratch
  // Random Y position for this scratch within the bar
  float lineY = 0.1 + frmHash(seg + localSeed * 53.27) * 0.8;
  float dist  = abs(barUV.y - lineY);
  float fw    = fwidth(barUV.y);
  float width = max(fw * 0.5, 0.0003 + frmHash(seg + localSeed * 71.33) * 0.0006);
  float inten = 0.015 + frmHash(seg + localSeed * 23.71) * 0.025;
  // Scratch is a partial segment (not the full width)
  float segPhase = fract(barUV.x * density);
  float shape = smoothstep(0.12, 0.30, segPhase) * (1.0 - smoothstep(0.65, 0.90, segPhase));
  return smoothstep(width, 0.0, dist) * inten * shape;
}

float frmScratchLayer(vec2 barUV, float seed) {
  float a = frmScratchLine(barUV,  8.0, seed);
  float b = frmScratchLine(barUV, 14.0, seed + 5.11);
  float c = frmScratchLine(barUV, 22.0, seed + 11.37);
  return clamp(a * 0.06 + b * 0.05 + c * 0.04, 0.0, 0.14);
}

// Normal: nearly flat surface with very slight FBM perturbation.
// The brushed-metal visual effect is provided by the anisotropy parameter,
// NOT by surface bumps. Keep gradient very small to avoid visible ridges.
vec3 frmBrushedNormal(vec2 barUV, float seed) {
  float eps = 0.010;
  float h0 = frmBrushedFbm(barUV);
  float hx = frmBrushedFbm(barUV + vec2(eps, 0.0));
  float hy = frmBrushedFbm(barUV + vec2(0.0, eps));
  // 0.08 multiplier = nearly flat; just enough for subtle grain micro-texture
  vec2 grad = vec2(h0 - hx, h0 - hy) / eps * 0.08;
  return normalize(vec3(grad, 1.0));
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _frameBounds?: { outerHalf: THREE.Vector2; innerHalf: THREE.Vector2 }
  ): THREE.MeshPhysicalMaterial {
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

      // 3. Prepend helper GLSL functions
      shader.fragmentShader = FRAME_FRAG_FUNCTIONS + '\n' + shader.fragmentShader;

      // 4. Procedural normal (tbn = Three.js r166 local mat3; do NOT use vTBN)
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <normal_fragment_maps>',
        FRAME_FRAG_NORMAL_REPLACE
      );

      // 5. Roughness variation: fine grain running along brush direction.
      // frmRoughnessGrain has high X frequency / low Y frequency = sparkle, no lines.
      // Scratches deepen roughness very slightly where they exist.
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <roughnessmap_fragment>',
         `float roughnessGrain = frmRoughnessGrain(vFrameUV, uFrameSeed);
          float roughnessScratch = frmScratchLayer(vFrameUV, uFrameSeed);
          float roughnessFactor = uBaseRoughness
            + (roughnessGrain - 0.5) * 0.030
            + roughnessScratch * 0.015;
          roughnessFactor = clamp(roughnessFactor, 0.15, 0.70);`
      );

      console.debug('[CanvasMaterial] frame-shader-compiled', {
        version: 'v0.53',
        preset: preset.id,
        seed,
        frameRoughness: preset.frameRoughness,
        frameAnisotropy: preset.frameAnisotropy,
        frameClearcoat: preset.frameClearcoat,
        coordinateMode: 'vertex-attribute-barUV',
        normalApproach: 'nearly-flat-along-only',
        roughnessGrain: 'along-direction-sparkle',
      });
    };
    // Unique cache key per artwork seed so Three.js compiles distinct programs.
    material.customProgramCacheKey = () => `frame-v0.53-${seed}`;

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _material: THREE.MeshPhysicalMaterial,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _frameBounds: { outerHalf: THREE.Vector2; innerHalf: THREE.Vector2 }
  ): void {
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
