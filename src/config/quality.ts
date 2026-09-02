/**
 * Quality presets for v0.01.
 *
 * Each preset balances visual fidelity against GPU/battery cost.
 * The presets map to renderer pixel ratio, post-processing strength,
 * shadow toggles, and geometry segment counts. They never change
 * artwork content, only rendering quality.
 */

export type QualityPresetId = 'high' | 'balanced' | 'battery';

/** Painting shader variant. Selects which texture reads are compiled in. */
export type PaintingShaderVariant = 'painting-high' | 'painting-balanced' | 'painting-battery';

export interface QualityPreset {
  id: QualityPresetId;
  label: string;
  description: string;
  pixelRatioCap: number;
  bloomStrength: number;
  bloomRadius: number;
  bloomThreshold: number;
  shadows: boolean;
  artworkSegments: number;

  // ── v0.02 painting shader fields ─────────────────────────────────────────
  /** Painting shader variant. Drives the `#define` flags in PaintingMaterial. */
  shaderVariant: PaintingShaderVariant;
  /** Scalar applied to the base normal map (`normalScale`). */
  normalStrength: number;
  /** Strength of the high-frequency detail normal blend, 0 disables. */
  detailNormalStrength: number;
  /** Height/bump perturbation scalar, 0 disables. */
  bumpStrength: number;
  /** Specular variation strength, 0 disables. */
  specularStrength: number;
  /** Divisor applied to the GPU's max anisotropy for the active artwork. */
  anisotropyDivisor: number;
  /** Whether the ambient-occlusion path is enabled. */
  aoEnabled: boolean;
  /** Whether the grazing-light boost path is enabled. */
  grazingBoostEnabled: boolean;
  /** Whether the detail normal path is enabled at all. */
  detailNormalEnabled: boolean;

  // ── v0.03 procedural fallback and parallax fields ────────────────────────
  /** Target pixel size for procedurally generated support maps. */
  proceduralTileSize: number;
  /**
   * v0.06: Tile size for geometry-carrying procedural maps (`normal`,
   * `detailNormal`, `height`) when the active light profile's
   * `displayIntent === 'inspection'`. `0` disables the uplift and uses
   * `proceduralTileSize` for every role (gallery-style profiles).
   *
   * Memory cost on high preset: 3 roles × (2048² − 1024²) × 4 bytes ≈ 48 MB
   * GPU per inspected artwork. The lower-res entries stay alive in the
   * factory cache so a gallery-mode toggle does not pay the regeneration
   * cost again.
   */
  proceduralInspectionTileSize: number;
  /** Whether parallax occlusion UV offset is compiled into the fragment shader. */
  parallaxEnabled: boolean;
  /** Number of height-field march steps for parallax UV offset. */
  parallaxSteps: number;
  /** Parallax depth (UV-space height-scale). 0 disables. */
  parallaxScale: number;
  /** Whether direct-light self-shadow approximation is compiled in. */
  selfShadowEnabled: boolean;
  /** Number of height-field steps for the self-shadow horizon march. */
  selfShadowSteps: number;
  /** Self-shadow darkening scalar (0..1). */
  selfShadowStrength: number;

  // ── v0.05 self-shadow soft-filtering fields ──────────────────────────────
  /**
   * Height deadzone applied before a sample is counted as a blocker. Prevents
   * self-shadow acne on broad height regions. Typical: 0.02..0.05.
   */
  selfShadowBias: number;
  /**
   * Smoothstep width used to convert the height-excess into a soft blocker
   * weight. Larger = softer penumbra. Typical: 0.05..0.15.
   */
  selfShadowSoftness: number;
  /**
   * Hard cap on accumulated occlusion (0..1) before strength is applied. Keeps
   * broad height plateaus from looking like solid stains. Typical: 0.2..0.4.
   */
  selfShadowMaxOcclusion: number;
  /**
   * Optional lateral PCF-like filter radius in UV space. 0 disables filtering
   * (single-march path). Enables a 3-ray fan when > 0. Typical: 0.0 or 0.0025.
   */
  selfShadowFilterRadius: number;

  // ── v0.04 clearcoat / varnish fields ─────────────────────────────────────
  /** Whether the Three.js clearcoat BxDF is enabled. Disabled on balanced/battery. */
  clearcoatEnabled: boolean;
  /** Base clearcoat intensity used when no authored varnish map is present. */
  clearcoatStrength: number;
  /** Clearcoat roughness; lower values read glossier, higher values read satin. */
  clearcoatRoughnessValue: number;

  // ── v0.27 post-process AA field ───────────────────────────────────────────
  /**
   * Whether an FXAA ShaderPass is appended after the bloom pass.
   * EffectComposer renders to an internal WebGLRenderTarget which bypasses the
   * renderer's native `antialias: true`. FXAA restores edge quality at ~0.3ms.
   * Disabled on `battery` preset to reduce GPU load.
   */
  fxaaEnabled: boolean;

  // ── v0.30 artwork fidelity field ──────────────────────────────────────────
  /**
   * Unlit albedo contribution mixed through the painting material. This keeps
   * customer artwork closer to its source brightness while the PBR lighting
   * still supplies depth, normals, and varnish response.
   */
  albedoFidelityFill: number;

  // ── v0.87 square museum hub fields ────────────────────────────────────────
  /**
   * Floor gloss strategy for the square hub room. `planar` renders an
   * on-demand mirrored reflection pass into a downscaled render target,
   * `ibl` falls back to environment-map gloss only, `off` keeps the marble
   * fully diffuse.
   */
  hubReflection: 'planar' | 'ibl' | 'off';
  /**
   * Downscale divisor for the hub planar-reflection render target relative to
   * the hub canvas (2 → half resolution). Ignored unless `hubReflection`
   * is `planar`.
   */
  hubReflectionDivisor: number;
  /** Pixel size of the procedurally generated hub surface textures. */
  hubSurfaceTileSize: number;
  /** Whether the hub skylight directional casts shadows. */
  hubShadows: boolean;

}

export const QUALITY_PRESETS: Record<QualityPresetId, QualityPreset> = {
  high: {
    id: 'high',
    label: 'Hoch',
    description: 'Volle Detailtiefe für moderne dedizierte GPUs.',
    pixelRatioCap: 1.6,
    bloomStrength: 0.04,
    bloomRadius: 0.36,
    bloomThreshold: 1.2,
    shadows: true,
    artworkSegments: 180,
    shaderVariant: 'painting-high',
    normalStrength: 0.7,
    detailNormalStrength: 0.6,
    // v0.03: parallax handles depth on high; bump is disabled to prevent
    // double-stacking relief amplitude (single source of truth per preset).
    bumpStrength: 0.0,
    specularStrength: 0.28,
    anisotropyDivisor: 1,
    aoEnabled: true,
    grazingBoostEnabled: true,
    detailNormalEnabled: true,
    proceduralTileSize: 1024,
    proceduralInspectionTileSize: 2048,
    parallaxEnabled: true,
    parallaxSteps: 10,
    parallaxScale: 0.012,
    selfShadowEnabled: true,
    selfShadowSteps: 6,
    // v0.05: lowered from 0.55. Combined with the new soft accumulation,
    // max-occlusion cap, and display-profile scale, this reads as surface
    // texture rather than a stain on gallery-soft / museum-neutral profiles.
    selfShadowStrength: 0.3,
    selfShadowBias: 0.05,
    selfShadowSoftness: 0.1,
    selfShadowMaxOcclusion: 0.28,
    // v0.06: lateral PCF radius. 0 on gallery-style profiles (single ray);
    // main.ts activates the 3-ray fan only when `displayIntent === 'inspection'`
    // by calling `setShadowFilterRadius(0.002, true)`.
    selfShadowFilterRadius: 0.002,
    clearcoatEnabled: true,
    clearcoatStrength: 0.12,
    clearcoatRoughnessValue: 0.35,
    // v0.38: disable FXAA on high to restore v0.25 contrast/color fidelity.
    fxaaEnabled: false,
    albedoFidelityFill: 0.0,
    hubReflection: 'planar',
    hubReflectionDivisor: 2,
    hubSurfaceTileSize: 1024,
    hubShadows: true,
    // v0.53: high anisotropy (0.85) + semi-gloss roughness (0.28) for realistic
    // satin brushed-metal. Directional sheen is provided by anisotropy, not bumps.
  },
  balanced: {
    id: 'balanced',
    label: 'Ausgewogen',
    description: 'Empfohlen für die meisten Laptops und Tablets.',
    pixelRatioCap: 1.25,
    bloomStrength: 0.03,
    bloomRadius: 0.3,
    bloomThreshold: 1.25,
    shadows: true,
    artworkSegments: 120,
    shaderVariant: 'painting-balanced',
    normalStrength: 0.45,
    detailNormalStrength: 0.4,
    bumpStrength: 0.025,
    specularStrength: 0.3,
    anisotropyDivisor: 2,
    aoEnabled: false,
    grazingBoostEnabled: true,
    detailNormalEnabled: true,
    proceduralTileSize: 512,
    proceduralInspectionTileSize: 0,
    parallaxEnabled: false,
    parallaxSteps: 0,
    parallaxScale: 0.0,
    selfShadowEnabled: false,
    selfShadowSteps: 0,
    selfShadowStrength: 0.0,
    selfShadowBias: 0.03,
    selfShadowSoftness: 0.1,
    selfShadowMaxOcclusion: 0.28,
    selfShadowFilterRadius: 0.0,
    clearcoatEnabled: false,
    clearcoatStrength: 0.0,
    clearcoatRoughnessValue: 0.35,
    // v0.38: disable FXAA on balanced to restore v0.25 contrast/color fidelity.
    fxaaEnabled: false,
    albedoFidelityFill: 0.0,
    hubReflection: 'ibl',
    hubReflectionDivisor: 3,
    hubSurfaceTileSize: 512,
    hubShadows: true,
    // v0.53: moderate anisotropy (0.60) + semi-gloss roughness (0.38).
  },
  battery: {
    id: 'battery',
    label: 'Akkusparend',
    description: 'Für integrierte GPUs und Akkubetrieb.',
    pixelRatioCap: 1.0,
    bloomStrength: 0.0,
    bloomRadius: 0.28,
    bloomThreshold: 1.2,
    shadows: false,
    artworkSegments: 48,
    shaderVariant: 'painting-battery',
    normalStrength: 0.25,
    detailNormalStrength: 0.0,
    bumpStrength: 0.0,
    specularStrength: 0.0,
    anisotropyDivisor: 4,
    aoEnabled: false,
    grazingBoostEnabled: false,
    detailNormalEnabled: false,
    proceduralTileSize: 256,
    proceduralInspectionTileSize: 0,
    parallaxEnabled: false,
    parallaxSteps: 0,
    parallaxScale: 0.0,
    selfShadowEnabled: false,
    selfShadowSteps: 0,
    selfShadowStrength: 0.0,
    selfShadowBias: 0.03,
    selfShadowSoftness: 0.1,
    selfShadowMaxOcclusion: 0.28,
    selfShadowFilterRadius: 0.0,
    clearcoatEnabled: false,
    clearcoatStrength: 0.0,
    clearcoatRoughnessValue: 0.0,
    fxaaEnabled: false,
    albedoFidelityFill: 0.0,
    hubReflection: 'off',
    hubReflectionDivisor: 4,
    hubSurfaceTileSize: 256,
    hubShadows: false,
    // v0.47: matte gallery-safe fallback for low-power hardware.
  },
};

export const DEFAULT_QUALITY_PRESET: QualityPresetId = 'balanced';

export function getQualityPreset(id: QualityPresetId): QualityPreset {
  return QUALITY_PRESETS[id] ?? QUALITY_PRESETS[DEFAULT_QUALITY_PRESET];
}
