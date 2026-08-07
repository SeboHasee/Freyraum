import type { PaintingMapRole } from '../materials/PaintingTextureSet';

export type ArtworkPresentationId =
  | 'canvas'
  | 'fine-art-paper'
  | 'matte-print'
  | 'satin-print'
  | 'glazed-print';

export interface ArtworkPresentationProfile {
  id: ArtworkPresentationId;
  label: string;
  proceduralRoles: readonly PaintingMapRole[];
  bodyDepth: number;
  backerColor: string;
  baseRoughness: number;
  specularScale: number;
  clearcoatStrength: number;
  clearcoatRoughness: number;
}

export const DEFAULT_ARTWORK_PRESENTATION: ArtworkPresentationId = 'matte-print';

const PAINTING_PROCEDURAL_ROLES: readonly PaintingMapRole[] = [
  'normal',
  'detailNormal',
  'height',
  'roughness',
  'specular',
];

export const ARTWORK_PRESENTATION_PROFILES: Record<ArtworkPresentationId, ArtworkPresentationProfile> = {
  canvas: {
    id: 'canvas',
    label: 'Canvas',
    proceduralRoles: PAINTING_PROCEDURAL_ROLES,
    bodyDepth: 0.05,
    backerColor: '#E6E1D5',
    baseRoughness: 0.92,
    specularScale: 0.42,
    clearcoatStrength: 0,
    clearcoatRoughness: 0.36,
  },
  'fine-art-paper': {
    id: 'fine-art-paper',
    label: 'Fine art paper',
    proceduralRoles: ['roughness'],
    bodyDepth: 0.026,
    backerColor: '#F1ECE2',
    baseRoughness: 0.985,
    specularScale: 0,
    clearcoatStrength: 0,
    clearcoatRoughness: 0.36,
  },
  'matte-print': {
    id: 'matte-print',
    label: 'Matte print',
    proceduralRoles: ['roughness'],
    bodyDepth: 0.03,
    backerColor: '#DDD8CE',
    baseRoughness: 0.96,
    specularScale: 0,
    clearcoatStrength: 0,
    clearcoatRoughness: 0.36,
  },
  'satin-print': {
    id: 'satin-print',
    label: 'Satin print',
    proceduralRoles: ['roughness', 'specular'],
    bodyDepth: 0.03,
    backerColor: '#DDD8CE',
    baseRoughness: 0.82,
    specularScale: 0.82,
    clearcoatStrength: 0,
    clearcoatRoughness: 0.32,
  },
  'glazed-print': {
    id: 'glazed-print',
    label: 'Glazed print',
    proceduralRoles: ['roughness', 'specular', 'varnish'],
    bodyDepth: 0.03,
    backerColor: '#DCD7CD',
    baseRoughness: 0.8,
    specularScale: 0.9,
    clearcoatStrength: 0.12,
    clearcoatRoughness: 0.26,
  },
};

export function normalizeArtworkPresentation(value: unknown): ArtworkPresentationId | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized in ARTWORK_PRESENTATION_PROFILES) {
    return normalized as ArtworkPresentationId;
  }
  return null;
}

export function resolveArtworkPresentation(value: unknown): ArtworkPresentationId {
  return normalizeArtworkPresentation(value) ?? DEFAULT_ARTWORK_PRESENTATION;
}
