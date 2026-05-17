/**
 * Quality presets for v0.01.
 *
 * Each preset balances visual fidelity against GPU/battery cost.
 * The presets map to renderer pixel ratio, post-processing strength,
 * shadow toggles, and geometry segment counts. They never change
 * artwork content, only rendering quality.
 */

export type QualityPresetId = 'high' | 'balanced' | 'battery';

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
  },
};

export const DEFAULT_QUALITY_PRESET: QualityPresetId = 'balanced';

export function getQualityPreset(id: QualityPresetId): QualityPreset {
  return QUALITY_PRESETS[id] ?? QUALITY_PRESETS[DEFAULT_QUALITY_PRESET];
}
