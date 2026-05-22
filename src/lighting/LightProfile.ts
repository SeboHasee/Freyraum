import * as THREE from 'three';

/**
 * Light profile contract for v0.02 realistic gallery lighting.
 *
 * Each profile describes a complete museum-style lighting state: ambient fill,
 * one or more directional/spot key lights (with Kelvin colour temperature),
 * an optional accent light, and a few preset-derived knobs.
 *
 * Profiles are pure data — they describe lighting goals, not implementation
 * details. {@link LightingSetup} maps these to concrete Three.js objects.
 */

export type LightProfileId =
  | 'gallery-soft'
  | 'raking-inspection'
  | 'museum-neutral'
  | 'dramatic-demo';

export interface KeyLight {
  /** Kelvin colour temperature, converted to RGB at apply time. */
  kelvin: number;
  /** Three.js light intensity. Tune relative to ambient. */
  intensity: number;
  /** World-space position; values in artwork units. */
  position: { x: number; y: number; z: number };
  /** Cone angle in radians (spot lights only). */
  angle?: number;
  /** Penumbra softness [0..1] (spot lights only). */
  penumbra?: number;
  /** Light decay exponent. */
  decay?: number;
}

export interface LightProfile {
  id: LightProfileId;
  label: string;
  description: string;
  ambientIntensity: number;
  /** Ambient colour temperature — used to subtly tint fill. */
  ambientKelvin: number;
  keys: readonly KeyLight[];
  /** Optional accent point light (e.g. rim, fill). */
  accent?: KeyLight;
  /**
   * Whether this profile is allowed to animate. `gallery-soft` opts in to
   * subtle motion; museum-neutral and inspection profiles stay perfectly
   * still so the painting can be examined.
   */
  animateAllowed: boolean;
  /**
   * v0.03: declares the artistic purpose of this profile so callers can
   * pick the right one without coupling to its id. `display` profiles are
   * museum-style — flattering, picture-first. `inspection` profiles use
   * raking angles to maximise relief reveal at the cost of mood.
   */
  displayIntent: 'display' | 'inspection' | 'demo';
}

export const LIGHT_PROFILES: Record<LightProfileId, LightProfile> = {
  'gallery-soft': {
    id: 'gallery-soft',
    label: 'Galerie weich',
    description: 'Warm-soft museum lighting from the upper left.',
    ambientIntensity: 1.5,
    ambientKelvin: 4000,
    keys: [
      {
        kelvin: 3200,
        intensity: 150,
        // v0.03: was {x:-10, y:5, z:7} (~68° from vertical — theatrical
        // side-lighting). Repositioned to ~45° from vertical: museum-
        // appropriate flattering key that still has enough horizontal
        // offset to reveal surface relief during pan/zoom.
        position: { x: -3, y: 5, z: 4 },
        angle: 0.42,
        penumbra: 0.9,
        decay: 1.8,
      },
    ],
    accent: {
      kelvin: 4500,
      intensity: 8,
      position: { x: 5, y: -2, z: 6 },
      decay: 2.0,
    },
    animateAllowed: true,
    displayIntent: 'display',
  },
  'raking-inspection': {
    id: 'raking-inspection',
    label: 'Streiflicht',
    description: 'Near-horizontal grazing light reveals canvas weave and brush relief.',
    // v0.03: was 0.4. Lower ambient maximises shadow contrast for the
    // relief reveal that is this profile's only purpose.
    ambientIntensity: 0.3,
    ambientKelvin: 4000,
    keys: [
      {
        kelvin: 3500,
        intensity: 220,
        // v0.03: was {x:-7, y:0.5, z:1.3}. Now strictly horizontal at
        // y=0, z=1.5, x=-6 → maximum raking angle for relief reveal.
        position: { x: -6, y: 0, z: 1.5 },
        angle: 0.34,
        penumbra: 0.55,
        decay: 1.6,
      },
    ],
    animateAllowed: false,
    displayIntent: 'inspection',
  },
  'museum-neutral': {
    id: 'museum-neutral',
    label: 'Museum neutral',
    description: 'Daylight-balanced even illumination for objective viewing.',
    ambientIntensity: 1.8,
    ambientKelvin: 5500,
    keys: [
      {
        kelvin: 5500,
        intensity: 120,
        position: { x: -6, y: 4, z: 6 },
        angle: 0.5,
        penumbra: 0.95,
        decay: 1.8,
      },
      {
        kelvin: 5500,
        intensity: 80,
        position: { x: 6, y: 4, z: 6 },
        angle: 0.5,
        penumbra: 0.95,
        decay: 1.8,
      },
    ],
    animateAllowed: false,
    displayIntent: 'display',
  },
  'dramatic-demo': {
    id: 'dramatic-demo',
    label: 'Dramatisch',
    description: 'Warm-cool contrast demo lighting for marketing screenshots.',
    ambientIntensity: 0.8,
    ambientKelvin: 3000,
    keys: [
      {
        kelvin: 2700,
        intensity: 200,
        position: { x: -9, y: 6, z: 6 },
        angle: 0.4,
        penumbra: 0.8,
        decay: 1.7,
      },
    ],
    accent: {
      kelvin: 8000,
      intensity: 16,
      position: { x: 7, y: -3, z: 5 },
      decay: 2.0,
    },
    animateAllowed: true,
    displayIntent: 'demo',
  },
};

// v0.29 Y-05: default to the objective, daylight-balanced profile so
// first-time visitors see paintings as close to the source artwork as the
// current PBR material allows. Warmer/dramatic profiles remain selectable.
export const DEFAULT_LIGHT_PROFILE: LightProfileId = 'museum-neutral';

export function getLightProfile(id: LightProfileId): LightProfile {
  return LIGHT_PROFILES[id] ?? LIGHT_PROFILES[DEFAULT_LIGHT_PROFILE];
}

/**
 * Approximate Kelvin → linear-RGB conversion. Uses the well-known Tanner
 * Helland piecewise approximation, then converts to a Three.js Color in
 * linear space. Returns a fresh Color instance.
 */
export function kelvinToColor(kelvin: number, out?: THREE.Color): THREE.Color {
  const t = Math.max(1000, Math.min(40000, kelvin)) / 100;
  let r: number;
  let g: number;
  let b: number;

  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
    b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    b = 255;
  }

  r = Math.max(0, Math.min(255, r)) / 255;
  g = Math.max(0, Math.min(255, g)) / 255;
  b = Math.max(0, Math.min(255, b)) / 255;

  const color = out ?? new THREE.Color();
  color.setRGB(r, g, b);
  return color;
}
