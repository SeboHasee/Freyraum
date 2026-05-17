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
}

export const QUALITY_PRESETS: Record<QualityPresetId, QualityPreset> = {
  high: {
    id: 'high',
    label: 'Hoch',
    description: 'Volle Detailtiefe für moderne dedizierte GPUs.',
    pixelRatioCap: 1.8,
    bloomStrength: 0.08,
    bloomRadius: 0.36,
    bloomThreshold: 1.2,
    shadows: true,
    artworkSegments: 240,
    shaderVariant: 'painting-high',
    normalStrength: 0.7,
    detailNormalStrength: 0.6,
    // v0.03: parallax handles depth on high; bump is disabled to prevent
    // double-stacking relief amplitude (single source of truth per preset).
    bumpStrength: 0.0,
    specularStrength: 0.4,
    anisotropyDivisor: 1,
    aoEnabled: true,
    grazingBoostEnabled: true,
    detailNormalEnabled: true,
    proceduralTileSize: 1024,
    parallaxEnabled: true,
    parallaxSteps: 12,
    parallaxScale: 0.04,
    selfShadowEnabled: true,
    selfShadowSteps: 8,
    selfShadowStrength: 0.55,
  },
  balanced: {
    id: 'balanced',
    label: 'Ausgewogen',
    description: 'Empfohlen für die meisten Laptops und Tablets.',
    pixelRatioCap: 1.4,
    bloomStrength: 0.06,
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
    parallaxEnabled: false,
    parallaxSteps: 0,
    parallaxScale: 0.0,
    selfShadowEnabled: false,
    selfShadowSteps: 0,
    selfShadowStrength: 0.0,
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
    parallaxEnabled: false,
    parallaxSteps: 0,
    parallaxScale: 0.0,
    selfShadowEnabled: false,
    selfShadowSteps: 0,
    selfShadowStrength: 0.0,
  },
};

export const DEFAULT_QUALITY_PRESET: QualityPresetId = 'balanced';

export function getQualityPreset(id: QualityPresetId): QualityPreset {
  return QUALITY_PRESETS[id] ?? QUALITY_PRESETS[DEFAULT_QUALITY_PRESET];
}
