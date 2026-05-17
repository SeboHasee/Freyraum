/**
 * Structured artwork metadata model for v0.01 / v0.02.
 *
 * v0.01 keeps a local static data source as the canonical content store.
 * Required fields will map 1:1 to a future CMS schema. Optional CMS-only
 * fields (slug, locale, translations) are reserved for future passes and
 * intentionally not modeled here.
 *
 * v0.02 adds an optional `textureSet` for authored PBR maps. The procedural
 * factory provides fallbacks whenever a slot in the texture set is missing.
 */

import type { PaintingTextureSet } from '../materials/PaintingTextureSet';

/**
 * v0.03 surface character for the painting pipeline. Drives default relief
 * and parallax depth choices when an artwork does not supply explicit
 * `surfacePhysics`. Optional; defaults to `'matte-canvas'` at runtime.
 */
export type SurfaceProfile =
  | 'matte-canvas'
  | 'satin-canvas'
  | 'varnished-oil'
  | 'paper'
  | 'procedural-fallback';

export interface SurfacePhysics {
  /** Multiplier on relief amplitude from all maps (normal/bump/height). 1.0 = default. */
  reliefScale?: number;
  /** Multiplier on parallax depth. 1.0 = default. */
  parallaxDepthScale?: number;
}

export interface ArtworkDimensions {
  /** Pixel width of the rendered artwork asset. */
  width: number;
  /** Pixel height of the rendered artwork asset. */
  height: number;
}

export interface Artwork {
  /** Stable, URL-safe identifier. Required for CMS interop. */
  id: string;
  /** Display title shown in the info panel. */
  title: string;
  /** Short eyebrow label shown above the title. */
  subtitle: string;
  /** Long-form description, plain text. */
  description: string;
  /** Year of creation, used by the info panel and timeline. */
  year: number;
  /** Medium, e.g. "Digital painting · 2400×1600". */
  medium: string;
  /** Image asset reference. Local data URI or relative path. */
  image: string;
  /** Native pixel dimensions of the image asset. */
  dimensions: ArtworkDimensions;
  /** Alt text for assistive technology and image-only views. */
  alt: string;
  /** Credit string (artist, studio, or rights holder). */
  credit: string;
  /** Tag list for future filtering / CMS taxonomies. */
  tags: readonly string[];
  /**
   * Optional authored PBR map set. Any missing role is filled by the
   * procedural factory at runtime. Reserved for future scanned assets.
   */
  textureSet?: PaintingTextureSet;
  /** v0.03: Surface character. Defaults to 'matte-canvas'. */
  surfaceProfile?: SurfaceProfile;
  /** v0.03: Optional physical-scale modifiers for relief and parallax depth. */
  surfacePhysics?: SurfacePhysics;
}

interface EmbeddedArtworkOptions {
  title: string;
  width: number;
  height: number;
  background: string;
  accent: string;
  secondary: string;
  horizonPercent?: number;
}

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const embeddedArtwork = ({
  title,
  width,
  height,
  background,
  accent,
  secondary,
  horizonPercent = 58,
}: EmbeddedArtworkOptions): string => {
  const maxDimension = Math.max(width, height);
  const minDimension = Math.min(width, height);
  const horizonY = height * (horizonPercent / 100);
  const signatureX = width * 0.06;
  const signatureY = height * 0.92;
  const signatureSize = maxDimension * 0.035;
  const signatureSpacing = maxDimension * 0.004;
  const broadStrokeWidth = maxDimension * 0.012;
  const fineStrokeWidth = maxDimension * 0.005;
  const circleRadius = minDimension * 0.11;
  const safeTitle = escapeXml(title);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${background}"/>
      <stop offset="0.52" stop-color="${secondary}"/>
      <stop offset="1" stop-color="${accent}"/>
    </linearGradient>
    <radialGradient id="light" cx="30%" cy="18%" r="75%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.72"/>
      <stop offset="0.36" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#light)"/>
  <path d="M0 ${horizonY} C ${width * 0.18} ${height * 0.47}, ${width * 0.36} ${height * 0.66}, ${width * 0.55} ${height * 0.54} S ${width * 0.82} ${height * 0.38}, ${width} ${height * 0.5} L ${width} ${height} L 0 ${height} Z" fill="#ffffff" opacity="0.16"/>
  <path d="M${width * 0.08} ${height * 0.2} C ${width * 0.28} ${height * 0.08}, ${width * 0.5} ${height * 0.1}, ${width * 0.78} ${height * 0.24}" fill="none" stroke="#ffffff" stroke-width="${broadStrokeWidth}" stroke-linecap="round" opacity="0.32"/>
  <path d="M${width * 0.16} ${height * 0.82} C ${width * 0.36} ${height * 0.72}, ${width * 0.54} ${height * 0.9}, ${width * 0.86} ${height * 0.72}" fill="none" stroke="#11181d" stroke-width="${fineStrokeWidth}" stroke-linecap="round" opacity="0.18"/>
  <circle cx="${width * 0.72}" cy="${height * 0.26}" r="${circleRadius}" fill="#ffffff" opacity="0.16"/>
  <text x="${signatureX}" y="${signatureY}" fill="#11181d" opacity="0.28" font-size="${signatureSize}" font-family="Inter, Arial, sans-serif" letter-spacing="${signatureSpacing}">${safeTitle}</text>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const artworks: readonly Artwork[] = [
  {
    id: 'electric-storm',
    title: 'Electric Storm',
    subtitle: 'Artwork 01',
    description:
      'Eine ruhige immersive digitale Kunstpräsentation mit realistischer Materialität und hochwertiger Lichtführung.',
    year: 2025,
    medium: 'Digital painting · 2400 × 1600',
    image: embeddedArtwork({
      title: 'Electric Storm',
      width: 2400,
      height: 1600,
      background: '#dfe5e9',
      secondary: '#9fb0ba',
      accent: '#c8b690',
      horizonPercent: 54,
    }),
    dimensions: { width: 2400, height: 1600 },
    alt: 'Abstrakte Landschaft mit weichen Wolken über einem warm getönten Horizont.',
    credit: 'Freyraum Studio',
    tags: ['landscape', 'soft-light', 'warm'],
  },
  {
    id: 'quiet-coastline',
    title: 'Quiet Coastline',
    subtitle: 'Artwork 02',
    description:
      'Minimalistische Küstenkomposition mit fein ausgearbeiteter Materialstruktur.',
    year: 2025,
    medium: 'Digital painting · 1800 × 2400',
    image: embeddedArtwork({
      title: 'Quiet Coastline',
      width: 1800,
      height: 2400,
      background: '#eef1f3',
      secondary: '#c9d4d8',
      accent: '#a6b4ae',
      horizonPercent: 62,
    }),
    dimensions: { width: 1800, height: 2400 },
    alt: 'Hochformatige minimalistische Küstenszene in gedämpften Grautönen.',
    credit: 'Freyraum Studio',
    tags: ['portrait', 'coast', 'minimal'],
  },
  {
    id: 'tokyo-passage',
    title: 'Tokyo Passage',
    subtitle: 'Artwork 03',
    description: 'Cinematische urbane Perspektiven mit dramatischem Streiflicht.',
    year: 2025,
    medium: 'Digital painting · 2100 × 2100',
    image: embeddedArtwork({
      title: 'Tokyo Passage',
      width: 2100,
      height: 2100,
      background: '#e8e3da',
      secondary: '#b8c1c5',
      accent: '#8b9497',
      horizonPercent: 48,
    }),
    dimensions: { width: 2100, height: 2100 },
    alt: 'Quadratische urbane Szene mit dramatischem Streiflicht in kühlen Tönen.',
    credit: 'Freyraum Studio',
    tags: ['square', 'urban', 'cinematic'],
  },
  {
    id: 'golden-desert',
    title: 'Golden Desert',
    subtitle: 'Artwork 04',
    description:
      'Atmosphärische Lichtstimmung kombiniert mit realistischer Leinwandstruktur.',
    year: 2025,
    medium: 'Digital painting · 2800 × 1200',
    image: embeddedArtwork({
      title: 'Golden Desert',
      width: 2800,
      height: 1200,
      background: '#f0ece4',
      secondary: '#d8c7a5',
      accent: '#a98f6d',
      horizonPercent: 57,
    }),
    dimensions: { width: 2800, height: 1200 },
    alt: 'Ultra-breite Wüstenkomposition in goldenen und sandfarbenen Tönen.',
    credit: 'Freyraum Studio',
    tags: ['ultrawide', 'desert', 'warm'],
  },
];
