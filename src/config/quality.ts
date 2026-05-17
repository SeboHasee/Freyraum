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
}

export const QUALITY_PRESETS: Record<QualityPresetId, QualityPreset> = {
  high: {
    id: 'high',
    label: 'Hoch',
    description: 'Volle Detailtiefe für moderne dedizierte GPUs.',
    pixelRatioCap: 1.8,
    bloomStrength: 0.12,
    bloomRadius: 0.4,
    bloomThreshold: 1.1,
    shadows: true,
    artworkSegments: 240,
    shaderVariant: 'painting-high',
    normalStrength: 0.45,
    detailNormalStrength: 0.55,
    bumpStrength: 0.012,
    specularStrength: 0.55,
    anisotropyDivisor: 1,
    aoEnabled: true,
    grazingBoostEnabled: true,
    detailNormalEnabled: true,
  },
  balanced: {
    id: 'balanced',
    label: 'Ausgewogen',
    description: 'Empfohlen für die meisten Laptops und Tablets.',
    pixelRatioCap: 1.4,
    bloomStrength: 0.08,
    bloomRadius: 0.34,
    bloomThreshold: 1.15,
    shadows: true,
    artworkSegments: 120,
    shaderVariant: 'painting-balanced',
    normalStrength: 0.35,
    detailNormalStrength: 0.4,
    bumpStrength: 0.0,
    specularStrength: 0.35,
    anisotropyDivisor: 2,
    aoEnabled: false,
    grazingBoostEnabled: true,
    detailNormalEnabled: true,
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
    normalStrength: 0.22,
    detailNormalStrength: 0.0,
    bumpStrength: 0.0,
    specularStrength: 0.0,
    anisotropyDivisor: 4,
    aoEnabled: false,
    grazingBoostEnabled: false,
    detailNormalEnabled: false,
  },
};

export const DEFAULT_QUALITY_PRESET: QualityPresetId = 'balanced';

export function getQualityPreset(id: QualityPresetId): QualityPreset {
  return QUALITY_PRESETS[id] ?? QUALITY_PRESETS[DEFAULT_QUALITY_PRESET];
}
