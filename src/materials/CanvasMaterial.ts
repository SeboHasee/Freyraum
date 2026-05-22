import * as THREE from 'three';
import type { QualityPreset } from '../config/quality';

// v0.49 — GLSL procedural brushed-metal fragment functions.
// Prepended to shader.fragmentShader in onBeforeCompile so they are available
// in all injection sites below.
const FRAME_FRAG_FUNCTIONS = /* glsl */ `
// v0.49 brushed-metal procedural normal & roughness
// Sources:
//   Inigo Quilez, iquilezles.org/articles/fbm/ (domain warping, irrational FBM)
//   Khronos GLSL ES 3.00 spec §8.14 (fwidth — WebGL2 built-in, Three.js r152+)
//   Adobe Substance / Marmoset PBR guide: satin brushed Al = roughness 0.35-0.45

uniform float uFrameSeed;
uniform float uBaseRoughness;
uniform vec2 uFrameOuterHalf;
uniform vec2 uFrameInnerHalf;

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

// Rectangular-ring local coordinates:
// x = along bar length, y = normalized across-bar width (-1..1).
vec2 frmBarBrushCoords(vec2 p) {
  vec2 absP = abs(p);
  vec2 toOuter = uFrameOuterHalf - absP;
  vec2 toInner = absP - uFrameInnerHalf;
  vec2 edgeDist = min(toOuter, toInner);
  float verticalBar = step(edgeDist.x, edgeDist.y);

  float along = mix(p.x, p.y, verticalBar);
  float acrossNorm = mix(
    (absP.y - uFrameInnerHalf.y) / max(uFrameOuterHalf.y - uFrameInnerHalf.y, 0.0001),
    (absP.x - uFrameInnerHalf.x) / max(uFrameOuterHalf.x - uFrameInnerHalf.x, 0.0001),
    verticalBar
  );
  float across = clamp(acrossNorm, 0.0, 1.0) * 2.0 - 1.0;
  return vec2(along, across);
}

// Domain-warped aperiodic FBM (Quilez technique)
float frmBrushedFbm(vec2 p) {
  vec2 q = frmBarBrushCoords(p);
  float wx = frmNoise(q * 0.20 + vec2(15.6,  28.1));
  float wy = frmNoise(q * 0.20 + vec2(-67.8, 39.2));
  q += (vec2(wx, wy) - 0.5) * 0.06;
  float v = 0.0;
  v += 0.5000 * frmNoise(vec2(q.x * 0.820, q.y * 18.000));
  v += 0.2500 * frmNoise(vec2(q.x * 1.647, q.y * 36.173) + 1.618);
  v += 0.1250 * frmNoise(vec2(q.x * 3.299, q.y * 72.114) + 3.141);
  v += 0.0625 * frmNoise(vec2(q.x * 6.614, q.y * 144.417) + 7.389);
  return v;
}

// Derivative-aware scratch lines (fwidth: GLSL ES 3.0, WebGL2 built-in)
float frmScratchRow(vec2 p, float density, float localSeed) {
  vec2 q = frmBarBrushCoords(p);
  float row  = floor(q.y * density);
  float rh   = frmHash(row + localSeed * 137.619);
  if (rh > 0.030) return 0.0;
  float lineY = (row + 0.22 + rh * 0.56) / density;
  float dist  = abs(q.y - lineY);
  float fw    = fwidth(q.y);
  float width = max(fw * 0.55, 0.0004 + frmHash(row + localSeed * 71.33) * 0.0008);
  float inten = 0.04 + frmHash(row + localSeed * 23.71) * 0.07;
  float densityFade = 1.0 - smoothstep(0.55, 1.25, fw * density);
  float segFreq = 2.50 + density * 0.020;
  float segCell = floor(q.x * segFreq + frmHash(row + localSeed * 19.93) * 2.0);
  float segAlive = step(frmHash(segCell + row * 7.13 + localSeed * 101.77), 0.66);
  float segPhase = fract(q.x * segFreq);
  float segShape = smoothstep(0.08, 0.22, segPhase) * (1.0 - smoothstep(0.74, 0.94, segPhase));
  float xFade = frmNoise(vec2(q.x * 0.45, row * 0.38)) * 0.12 + 0.88;
  return smoothstep(width, 0.0, dist) * inten * xFade * densityFade * segAlive * segShape;
}

float frmScratchLayer(vec2 p, float seed) {
  float fine   = frmScratchRow(p, 72.0, seed);
  float medium = frmScratchRow(p, 28.0, seed + 5.11);
  float deep   = frmScratchRow(p,  9.0, seed + 11.37);
  return clamp(fine * 0.12 + medium * 0.10 + deep * 0.06, 0.0, 0.38);
}

// Layered normal: FBM grain + scratch impulses, eps=0.004 for close-view sharpness
vec3 frmBrushedNormal(vec2 p, float seed) {
  float eps = 0.0035;
  float hg  = frmBrushedFbm(p);
  float hgx = frmBrushedFbm(p + vec2(eps, 0.0));
  float hgy = frmBrushedFbm(p + vec2(0.0, eps));
  float hs  = frmScratchLayer(p,                  seed);
  float hsx = frmScratchLayer(p + vec2(eps, 0.0), seed);
  float hsy = frmScratchLayer(p + vec2(0.0, eps), seed);
  vec2 gradG = vec2(hg - hgx, hg - hgy) / eps * 1.9;
  vec2 gradS = vec2(hs - hsx, hs - hsy) / eps * 1.1;
  return normalize(vec3(gradG + gradS, 1.0));
}
`;

// Replaces #include <normal_fragment_maps> — computes procedural normal using
// object-space position varying and transforms it from tangent space to view
// space using Three.js r166's local tbn matrix.
const FRAME_FRAG_NORMAL_REPLACE = /* glsl */ `
{
  vec3 proceduralN = frmBrushedNormal(vFrameLocalPos.xy, uFrameSeed);
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
    frameBounds?: { outerHalf: THREE.Vector2; innerHalf: THREE.Vector2 }
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

    const bounds = frameBounds ?? {
      outerHalf: new THREE.Vector2(2.2, 3.05),
      innerHalf: new THREE.Vector2(2.01, 2.86),
    };

    const uniforms = {
      uFrameSeed:     { value: seed * 0.00390625 },
      uBaseRoughness: { value: preset.frameRoughness },
      uFrameOuterHalf: { value: bounds.outerHalf.clone() },
      uFrameInnerHalf: { value: bounds.innerHalf.clone() },
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
      normalScale: new THREE.Vector2(0.14, 0.14),
    });

    material.onBeforeCompile = (shader) => {
      // 1. Shared uniforms
      Object.assign(shader.uniforms, uniforms);

      // 2. Inject object-space position varying
      shader.vertexShader   = 'varying vec3 vFrameLocalPos;\n' + shader.vertexShader;
      shader.fragmentShader = 'varying vec3 vFrameLocalPos;\n' + shader.fragmentShader;
      shader.vertexShader   = shader.vertexShader.replace(
        'void main() {',
        'void main() {\n  vFrameLocalPos = position;'
      );

      // 3. Prepend helper GLSL functions
      shader.fragmentShader = FRAME_FRAG_FUNCTIONS + '\n' + shader.fragmentShader;

      // 4. Procedural normal (tbn = Three.js r166 local mat3; do NOT use vTBN)
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <normal_fragment_maps>',
        FRAME_FRAG_NORMAL_REPLACE
      );

      // 5. Roughness variation using object-space position
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <roughnessmap_fragment>',
         `float roughnessFactor = uBaseRoughness
            + frmBrushedFbm(vFrameLocalPos.xy * vec2(0.82, 1.08) + uFrameSeed * 0.27) * 0.012
            - frmScratchLayer(vFrameLocalPos.xy, uFrameSeed) * 0.006
            + 0.020;
          roughnessFactor = clamp(roughnessFactor, 0.40, 0.76);`
      );

      console.debug('[CanvasMaterial] frame-shader-compiled', {
        version: 'v0.49',
        preset: preset.id,
        seed,
        frameRoughness: preset.frameRoughness,
        frameAnisotropy: preset.frameAnisotropy,
        frameClearcoat: preset.frameClearcoat,
        domainWarp: true,
        barBrushCoords: true,
        scratchLayer: true,
        fineDetailRetune: true,
        frameOuterHalf: [bounds.outerHalf.x, bounds.outerHalf.y],
        frameInnerHalf: [bounds.innerHalf.x, bounds.innerHalf.y],
        eps: 0.0035,
      });
    };
    // Unique cache key per artwork seed so Three.js compiles distinct programs.
    material.customProgramCacheKey = () => `frame-v0.49-${seed}`;

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

  refreshFrameGeometryUniforms(
    material: THREE.MeshPhysicalMaterial,
    frameBounds: { outerHalf: THREE.Vector2; innerHalf: THREE.Vector2 }
  ): void {
    const u = material.userData.frameUniforms as
      | {
          uFrameOuterHalf: { value: THREE.Vector2 };
          uFrameInnerHalf: { value: THREE.Vector2 };
        }
      | undefined;
    if (!u) return;
    u.uFrameOuterHalf.value.copy(frameBounds.outerHalf);
    u.uFrameInnerHalf.value.copy(frameBounds.innerHalf);
    console.debug('[CanvasMaterial] frame-geometry-uniforms-refreshed', {
      outerHalf: [frameBounds.outerHalf.x, frameBounds.outerHalf.y],
      innerHalf: [frameBounds.innerHalf.x, frameBounds.innerHalf.y],
    });
  }

  dispose(): void {
    this.normalTexture?.dispose();
    this.frameFlatNormal?.dispose();
  }
}
