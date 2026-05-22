import * as THREE from 'three';
import type { QualityPreset } from '../config/quality';

// v0.44 — GLSL procedural brushed-metal fragment functions.
// Prepended to shader.fragmentShader in onBeforeCompile so they are available
// in all injection sites below.
const FRAME_FRAG_FUNCTIONS = /* glsl */ `
// v0.44 brushed-metal procedural normal & roughness

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
    mix(frmHash(n), frmHash(n + 1.0), f.x),
    mix(frmHash(n + 57.0), frmHash(n + 58.0), f.x),
    f.y
  );
}

// 4-octave FBM — anisotropic: X stretched relative to Y
float frmFbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * frmNoise(p);
    p = p * mat2(2.1, 0.0, 0.0, 2.0);
    a *= 0.5;
  }
  return v;
}

// Ridged noise → sharp bright lines (individual scratches)
float frmRidge(vec2 p) {
  return 1.0 - abs(2.0 * frmFbm(p) - 1.0);
}

// Anti-tile: per-cell random UV offset (Heitz/Neyret 2018)
vec2 frmTileOffset(vec2 p, float freq) {
  vec2 cell = floor(p * freq);
  float h = frmHash(cell.x + cell.y * 137.0);
  return vec2(fract(h * 1234.5), fract(h * 9876.5));
}

// Tangent-space normal from anisotropic height-field finite difference
vec3 frmBrushedNormal(vec2 uv, float seed) {
  // Low X-frequency = long horizontal grain sweeps; moderate Y-frequency
  vec2 sc = vec2(uv.x * 1.2 + seed * 0.07, uv.y * 14.0 + seed * 0.13);

  // Two anti-tiled samples blended via smooth low-frequency mask
  vec2 off0 = frmTileOffset(uv, 1.5);
  vec2 off1 = frmTileOffset(uv + 0.17, 1.5);
  float blend = frmNoise(uv * 2.3);

  float h0  = frmFbm(sc + off0 * 3.0)
            + frmRidge(sc * vec2(4.0, 0.05) + off0) * 0.12;
  float h0x = frmFbm((sc + vec2(0.02, 0.0)) + off0 * 3.0);
  float h0y = frmFbm((sc + vec2(0.0, 0.02)) + off0 * 3.0);

  float h1  = frmFbm(sc + off1 * 3.0)
            + frmRidge(sc * vec2(4.0, 0.05) + off1) * 0.12;
  float h1x = frmFbm((sc + vec2(0.02, 0.0)) + off1 * 3.0);
  float h1y = frmFbm((sc + vec2(0.0, 0.02)) + off1 * 3.0);

  float h  = mix(h0,  h1,  blend);
  float hx = mix(h0x, h1x, blend);
  float hy = mix(h0y, h1y, blend);

  // Finite differences → tangent-space gradient; 8.0 controls relief strength
  vec2 grad = vec2(h - hx, h - hy) * 8.0;
  return normalize(vec3(grad, 1.0));
}
`;

// Replaces #include <normal_fragment_maps> — computes procedural normal and
// transforms it from tangent space to view space using the vTBN varying
// (present because the frame geometry has tangent attributes and the material
// has a normalMap set, enabling USE_TANGENT in the compiled shader).
const FRAME_FRAG_NORMAL_REPLACE = /* glsl */ `
{
  vec3 proceduralN = frmBrushedNormal(vUv, uFrameSeed);
  normal = normalize(vTBN * proceduralN);
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
  createFrameMaterial(preset: QualityPreset, seed = 0): THREE.MeshPhysicalMaterial {
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

    const uniforms = {
      uFrameSeed:     { value: seed * 0.00390625 },
      uBaseRoughness: { value: preset.frameRoughness },
    };

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xe8eaeb,
      roughness: preset.frameRoughness,
      metalness: 1.0,
      clearcoat: preset.frameClearcoat,
      clearcoatRoughness: 0.2,
      anisotropy: preset.frameAnisotropy,
      anisotropyRotation: Math.PI / 2,
      normalMap: flatNormal,
      normalScale: new THREE.Vector2(0.40, 0.40),
    });

    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      // Prepend helper functions so they are visible at all injection sites.
      shader.fragmentShader = FRAME_FRAG_FUNCTIONS + '\n' + shader.fragmentShader;
      // Replace standard normal-map sampling with our procedural computation.
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <normal_fragment_maps>',
        FRAME_FRAG_NORMAL_REPLACE
      );
      // Replace roughness-map sampling with FBM-driven variation.
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <roughnessmap_fragment>',
        `float roughnessFactor = uBaseRoughness
           + frmFbm(vec2(vUv.x * 1.2, vUv.y * 5.0) + uFrameSeed * 0.5) * 0.12
           - 0.06;`
      );
      console.debug('[CanvasMaterial] frame-shader-compiled', { preset: preset.id, seed });
    };
    // Unique cache key per artwork seed so Three.js compiles distinct programs.
    material.customProgramCacheKey = () => `frame-v0.44-${seed}`;

    // Store uniforms reference for refreshFrameUniforms (seed-only update on navigation).
    material.userData.frameUniforms = uniforms;

    console.debug('[CanvasMaterial] frame-material-created', {
      preset: preset.id, seed,
      frameRoughness: preset.frameRoughness, frameAnisotropy: preset.frameAnisotropy,
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
    const u = material.userData.frameUniforms as
      | { uFrameSeed: { value: number } }
      | undefined;
    if (!u) return;
    u.uFrameSeed.value = seed * 0.00390625;
    console.debug('[CanvasMaterial] frame-uniforms-refreshed', { seed });
  }

  dispose(): void {
    this.normalTexture?.dispose();
    this.frameFlatNormal?.dispose();
  }
}
