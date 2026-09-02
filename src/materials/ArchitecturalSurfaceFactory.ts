import * as THREE from 'three';

/**
 * Architectural surface factory for the museum hub and interactive gallery.
 *
 * Owns the small set of shared, physically plausible materials the hub room
 * shell is built from (plaster walls, mineral floor, ceiling, dark trim,
 * doorway pocket) plus the deterministic procedural detail maps behind them.
 *
 * Design constraints:
 *  - One material instance per surface role; every mesh with the same role
 *    shares the instance so the hub keeps a handful of shader programs.
 *  - The close gallery keeps tileable tactile detail, while the hub uses
 *    subtle world-space PBR response without repeating detail maps.
 *  - Geometry UVs are authored in metres (see `HubRoomRenderer`); the factory
 *    applies real-world tile periods through `texture.repeat` for gallery
 *    plaster and floor grain.
 *  - The factory owns disposal of everything it creates.
 */

/** Real-world tile period (metres) for the plaster detail maps. */
const PLASTER_TILE_PERIOD_M = 2.6;
/** Real-world tile period (metres) for the floor detail maps. */
const FLOOR_TILE_PERIOD_M = 1.9;

/** Surface palette derived from the authoritative gallery-wall token. */
export interface ArchitecturalPalette {
  /** Authoritative wall token (e.g. `#C7CED4`). */
  wall: string;
}

export interface ArchitecturalMaterials {
  wall: THREE.MeshStandardMaterial;
  ceiling: THREE.MeshStandardMaterial;
  floor: THREE.MeshStandardMaterial;
  /** Dark powder-coated trim: skirting shadow gap, doorway jambs, cove frames. */
  trim: THREE.MeshStandardMaterial;
  /** Dim plaster used inside doorway pockets so openings read as passages. */
  pocket: THREE.MeshStandardMaterial;
  /** Neutral-white emissive PBR strip inside the ceiling light coves. */
  lightStrip: THREE.MeshStandardMaterial;
  /** Neutral gesso-like side faces for artwork canvas edges. */
  artworkEdge: THREE.MeshStandardMaterial;
}

export type ArchitecturalSurfaceProfile = 'gallery' | 'hub';

/** Public contract for the hub's deliberately calm, non-repeating wall response. */
export const HUB_WALL_SURFACE_PROFILE = Object.freeze({
  wallColor: '#f3f3ef',
  wallRoughness: 0.88,
  ceilingRoughness: 0.92,
  floorRoughness: 0.61,
  colorVariation: 0,
  roughnessVariation: 0.012,
  wallNormalStrength: 0.018,
  floorNormalStrength: 0.026,
  floorColorVariation: 0.012,
  minimumPatternPeriodM: 14.2,
});

type DetailRole = 'plasterNormal' | 'plasterRoughness' | 'floorNormal' | 'floorRoughness';

export class ArchitecturalSurfaceFactory {
  private readonly textureCache = new Map<string, THREE.DataTexture>();
  private materials: ArchitecturalMaterials | null = null;
  private tileSize: number;
  private anisotropy = 1;
  private readonly surfaceProfile: ArchitecturalSurfaceProfile;
  private hubSurfaceDetailEnabled = true;

  constructor(tileSize: number, surfaceProfile: ArchitecturalSurfaceProfile = 'gallery') {
    this.tileSize = Math.max(64, tileSize | 0);
    this.surfaceProfile = surfaceProfile;
  }

  /**
   * Returns the shared material set, creating it on first use. Repeated calls
   * return the same instances so all shell meshes share shader programs.
   */
  getMaterials(palette: ArchitecturalPalette): ArchitecturalMaterials {
    if (this.materials) return this.materials;

    const wallColor = this.surfaceProfile === 'hub'
      ? new THREE.Color(HUB_WALL_SURFACE_PROFILE.wallColor)
      : new THREE.Color(palette.wall);
    const ceilingColor = wallColor.clone().multiplyScalar(1.04);
    const floorColor = this.surfaceProfile === 'hub'
      ? new THREE.Color('#d2d4d3')
      : wallColor.clone().multiplyScalar(0.82).lerp(new THREE.Color('#aab2ba'), 0.18);

    const plasterNormal = this.surfaceProfile === 'gallery'
      ? this.detailTexture('plasterNormal')
      : null;
    const plasterRoughness = this.surfaceProfile === 'gallery'
      ? this.detailTexture('plasterRoughness')
      : null;
    const floorNormal = this.surfaceProfile === 'gallery'
      ? this.detailTexture('floorNormal')
      : null;
    const floorRoughness = this.surfaceProfile === 'gallery'
      ? this.detailTexture('floorRoughness')
      : null;

    const wall = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: this.surfaceProfile === 'hub'
        ? HUB_WALL_SURFACE_PROFILE.wallRoughness
        : 0.965,
      metalness: 0.0,
      normalMap: this.surfaceProfile === 'gallery' ? plasterNormal : null,
      normalScale: new THREE.Vector2(
        this.surfaceProfile === 'gallery' ? 0.14 : 0,
        this.surfaceProfile === 'gallery' ? 0.14 : 0
      ),
      roughnessMap: plasterRoughness,
    });
    if (this.surfaceProfile === 'hub') this.applyHubSurfaceResponse(wall, 'wall');

    const ceiling = new THREE.MeshStandardMaterial({
      color: ceilingColor,
      roughness: this.surfaceProfile === 'hub'
        ? HUB_WALL_SURFACE_PROFILE.ceilingRoughness
        : 0.97,
      metalness: 0.0,
      normalMap: plasterNormal,
      normalScale: new THREE.Vector2(
        this.surfaceProfile === 'gallery' ? 0.06 : 0,
        this.surfaceProfile === 'gallery' ? 0.06 : 0
      ),
    });
    if (this.surfaceProfile === 'hub') this.applyHubSurfaceResponse(ceiling, 'ceiling');

    const floor = new THREE.MeshStandardMaterial({
      color: floorColor,
      roughness: this.surfaceProfile === 'hub'
        ? HUB_WALL_SURFACE_PROFILE.floorRoughness
        : 0.62,
      metalness: 0.0,
      normalMap: floorNormal,
      normalScale: new THREE.Vector2(
        this.surfaceProfile === 'gallery' ? 0.22 : 0,
        this.surfaceProfile === 'gallery' ? 0.22 : 0
      ),
      roughnessMap: floorRoughness,
      envMapIntensity: 0.5,
    });
    if (this.surfaceProfile === 'hub') this.applyHubSurfaceResponse(floor, 'floor');

    // Dark powder-coated metal, intentionally not pure black so edges keep
    // form under grazing light.
    const trim = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#31363a'),
      roughness: 0.58,
      metalness: 0.32,
    });

    const pocket = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.surfaceProfile === 'hub' ? '#70736f' : '#565b5e'),
      roughness: this.surfaceProfile === 'hub' ? 0.94 : 0.96,
      metalness: 0.0,
    });

    const lightStripColor = new THREE.Color(this.surfaceProfile === 'hub' ? '#eef3f1' : '#e8edef');
    const lightStrip = new THREE.MeshStandardMaterial({
      color: lightStripColor,
      emissive: lightStripColor,
      emissiveIntensity: this.surfaceProfile === 'hub' ? 0.72 : 0.56,
      roughness: 0.48,
      metalness: 0,
    });

    const artworkEdge = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d8dde1'),
      roughness: 0.9,
      metalness: 0.0,
    });

    this.materials = { wall, ceiling, floor, trim, pocket, lightStrip, artworkEdge };
    return this.materials;
  }

  /**
   * Applies a new detail-map tile size (quality preset change). Regenerates
   * the cached maps at the new resolution and rebinds them on the shared
   * materials in place, so meshes keep their material instances.
   */
  setTileSize(tileSize: number): void {
    const next = Math.max(64, tileSize | 0);
    if (next === this.tileSize) return;
    this.tileSize = next;
    if (!this.materials) return;
    const previous = [...this.textureCache.values()];
    this.textureCache.clear();
    if (this.surfaceProfile === 'gallery') {
      this.materials.wall.normalMap = this.detailTexture('plasterNormal');
      this.materials.wall.roughnessMap = this.detailTexture('plasterRoughness');
    }

    if (this.surfaceProfile === 'gallery') {
      this.materials.ceiling.normalMap = this.detailTexture('plasterNormal');
      this.materials.floor.normalMap = this.detailTexture('floorNormal');
      this.materials.floor.roughnessMap = this.detailTexture('floorRoughness');
    }
    this.materials.wall.needsUpdate = true;
    this.materials.ceiling.needsUpdate = true;
    this.materials.floor.needsUpdate = true;
    for (const texture of previous) texture.dispose();
  }

  /** Disables the hub's derivative-based micro response on the battery preset. */
  setHubSurfaceDetailEnabled(enabled: boolean): void {
    if (this.surfaceProfile !== 'hub' || this.hubSurfaceDetailEnabled === enabled) return;
    this.hubSurfaceDetailEnabled = enabled;
    if (!this.materials) return;
    this.materials.wall.needsUpdate = true;
    this.materials.ceiling.needsUpdate = true;
    this.materials.floor.needsUpdate = true;
  }

  /** Caps sampler anisotropy on every generated map (guarded by caller). */
  setAnisotropy(value: number): void {
    const a = Math.max(1, value | 0);
    if (a === this.anisotropy) return;
    this.anisotropy = a;
    this.textureCache.forEach((texture) => {
      texture.anisotropy = a;
      texture.needsUpdate = true;
    });
  }

  dispose(): void {
    this.textureCache.forEach((texture) => texture.dispose());
    this.textureCache.clear();
    if (this.materials) {
      for (const material of Object.values(this.materials)) material.dispose();
      this.materials = null;
    }
  }

  // ── Detail-map generation ──────────────────────────────────────────────────

  /** Adds restrained, non-repeating world-space PBR response to hub surfaces. */
  private applyHubSurfaceResponse(
    material: THREE.MeshStandardMaterial,
    role: 'wall' | 'ceiling' | 'floor'
  ): void {
    const profile = HUB_WALL_SURFACE_PROFILE;
    material.userData.architecturalSurfaceProfile = `hub-world-space-${role}`;
    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          '#include <common>\nvarying vec3 vArchitecturalWorldPosition;'
        )
        .replace(
          '#include <begin_vertex>',
          [
            '#include <begin_vertex>',
            'vArchitecturalWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;',
          ].join('\n')
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          [
            '#include <common>',
            'varying vec3 vArchitecturalWorldPosition;',
            'float architecturalSurfaceField(vec3 p) {',
            '  float broad = sin(dot(p, vec3(0.31, 0.17, 0.23)) + 0.7);',
            '  float cross = sin(dot(p, vec3(-0.19, 0.29, 0.13)) + 2.1);',
            '  float micro = sin(dot(p, vec3(5.3, -3.7, 4.1)) + broad * 0.8);',
            '  return broad * 0.55 + cross * 0.30 + micro * 0.15;',
            '}',
          ].join('\n')
        )
        .replace(
          '#include <roughnessmap_fragment>',
          [
            '#include <roughnessmap_fragment>',
            this.hubSurfaceDetailEnabled
              ? `roughnessFactor = clamp(roughnessFactor + architecturalSurfaceField(vArchitecturalWorldPosition) * ${profile.roughnessVariation.toFixed(4)}, 0.0, 1.0);`
              : '',
          ].join('\n')
        )
        .replace(
          '#include <normal_fragment_maps>',
          [
            '#include <normal_fragment_maps>',
            this.hubSurfaceDetailEnabled
              ? `float architecturalHeight = architecturalSurfaceField(vArchitecturalWorldPosition) * ${
                  role === 'floor'
                    ? profile.floorNormalStrength.toFixed(4)
                    : role === 'wall'
                      ? profile.wallNormalStrength.toFixed(4)
                      : (profile.wallNormalStrength * 0.45).toFixed(4)
                };`
              : '',
            this.hubSurfaceDetailEnabled
              ? 'normal = perturbNormalArb(-vViewPosition, normal, vec2(dFdx(architecturalHeight), dFdy(architecturalHeight)), faceDirection);'
              : '',
          ].join('\n')
        );
      if (role === 'floor' && this.hubSurfaceDetailEnabled) {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <color_fragment>',
          [
            '#include <color_fragment>',
            `diffuseColor.rgb *= 1.0 + architecturalSurfaceField(vArchitecturalWorldPosition * vec3(0.42, 1.0, 0.42)) * ${profile.floorColorVariation.toFixed(4)};`,
          ].join('\n')
        );
      }
    };
    material.customProgramCacheKey = () =>
      `freyraum-hub-${role}-world-space-v3-${this.hubSurfaceDetailEnabled ? 'detail' : 'plain'}`;
  }

  private detailTexture(role: DetailRole): THREE.DataTexture {
    const key = `${role}::${this.tileSize}`;
    const cached = this.textureCache.get(key);
    if (cached) return cached;

    let texture: THREE.DataTexture;
    switch (role) {
      case 'plasterNormal':
        texture = this.generateNormal(11, 1.9, 0.42, 0.05);
        texture.repeat.setScalar(1 / PLASTER_TILE_PERIOD_M);
        break;
      case 'plasterRoughness':
        // Matte mineral plaster: high roughness with clearer trowel breakup.
        texture = this.generateGrayscale(29, 220, 34, 0.62);
        texture.repeat.setScalar(1 / PLASTER_TILE_PERIOD_M);
        break;
      case 'floorNormal':
        texture = this.generateNormal(53, 3.4, 0.5, 0.02);
        texture.repeat.setScalar(1 / FLOOR_TILE_PERIOD_M);
        break;
      case 'floorRoughness':
      default:
        // Microcement: satin base with subtle trowel-band variation.
        texture = this.generateGrayscale(71, 152, 30, 0.85);
        texture.repeat.setScalar(1 / FLOOR_TILE_PERIOD_M);
        break;
    }
    texture.anisotropy = this.anisotropy;
    this.textureCache.set(key, texture);
    return texture;
  }

  /**
   * Tileable two-octave tangent-space normal map derived from a smooth height
   * field. `bump` is the height amplitude in UV units; the resulting slopes
   * are normalized so deflection stays gentle — architectural plaster and
   * microcement must read through lighting response, never as visible noise.
   */
  private generateNormal(
    seed: number,
    freqScale: number,
    microWeight: number,
    bump: number
  ): THREE.DataTexture {
    const size = this.tileSize;
    const f1 = 4 * freqScale;
    const f2 = 13 * freqScale;

    // Pass 1: height field (resolution-independent, tileable).
    const heights = new Float32Array(size * size);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const u = x / size;
        const v = y / size;
        heights[y * size + x] =
          this.tileNoise(u, v, f1, seed) * (1 - microWeight) +
          this.tileNoise(u, v, f2, seed + 7) * microWeight;
      }
    }

    // Pass 2: wrapped central differences → tangent-space normals.
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y += 1) {
      const yPrev = (y - 1 + size) % size;
      const yNext = (y + 1) % size;
      for (let x = 0; x < size; x += 1) {
        const idx = (y * size + x) * 4;
        const xPrev = (x - 1 + size) % size;
        const xNext = (x + 1) % size;
        // Slope in UV space: Δh / (2/size).
        const slopeX = (heights[y * size + xNext] - heights[y * size + xPrev]) * size * 0.5;
        const slopeY = (heights[yNext * size + x] - heights[yPrev * size + x]) * size * 0.5;
        const nx = -slopeX * bump;
        const ny = -slopeY * bump;
        const inv = 1 / Math.sqrt(nx * nx + ny * ny + 1);
        data[idx + 0] = clamp8(128 + nx * inv * 127);
        data[idx + 1] = clamp8(128 + ny * inv * 127);
        data[idx + 2] = clamp8(128 + inv * 127);
        data[idx + 3] = 255;
      }
    }
    return this.makeTexture(data, size);
  }

  /** Tileable grayscale map around `base` with `spread` amplitude. */
  private generateGrayscale(
    seed: number,
    base: number,
    spread: number,
    macroWeight: number
  ): THREE.DataTexture {
    const size = this.tileSize;
    const data = new Uint8Array(size * size * 4);

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = (y * size + x) * 4;
        const u = x / size;
        const v = y / size;
        const macro = this.tileNoise(u, v, 3, seed) - 0.5;
        const micro = this.tileNoise(u, v, 17, seed + 13) - 0.5;
        const value = clamp8(base + (macro * macroWeight + micro * (1 - macroWeight)) * 2 * spread);
        data[idx + 0] = value;
        data[idx + 1] = value;
        data[idx + 2] = value;
        data[idx + 3] = 255;
      }
    }
    return this.makeTexture(data, size);
  }

  private makeTexture(data: Uint8Array, size: number): THREE.DataTexture {
    const texture = new THREE.DataTexture(
      data as unknown as ArrayBufferView<ArrayBuffer>,
      size,
      size,
      THREE.RGBAFormat,
      THREE.UnsignedByteType
    );
    // Non-color data: normal/roughness maps must stay linear.
    texture.colorSpace = THREE.LinearSRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * Periodic (tileable) value noise: lattice indices wrap at `freq` so the
   * texture repeats seamlessly across UV space.
   */
  private tileNoise(u: number, v: number, freq: number, seed: number): number {
    const x = u * freq;
    const y = v * freq;
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const ux = xf * xf * (3 - 2 * xf);
    const uy = yf * yf * (3 - 2 * yf);
    const p = (ix: number, iy: number): number =>
      this.latticeHash(((ix % freq) + freq) % freq, ((iy % freq) + freq) % freq, seed);
    const h00 = p(xi, yi);
    const h10 = p(xi + 1, yi);
    const h01 = p(xi, yi + 1);
    const h11 = p(xi + 1, yi + 1);
    return h00 * (1 - ux) * (1 - uy) + h10 * ux * (1 - uy) + h01 * (1 - ux) * uy + h11 * ux * uy;
  }

  private latticeHash(ix: number, iy: number, seed: number): number {
    let h = (seed * 1664525 + ix * 1013904223) >>> 0;
    h = (h ^ (iy * 1540483477)) >>> 0;
    h = (h ^ (h >>> 16)) >>> 0;
    h = Math.imul(h, 0x45d9f3b) >>> 0;
    h = (h ^ (h >>> 16)) >>> 0;
    return (h >>> 0) / 0xffffffff;
  }
}

function clamp8(value: number): number {
  if (value < 0) return 0;
  if (value > 255) return 255;
  return value | 0;
}
