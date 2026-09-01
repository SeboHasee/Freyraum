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
  ambientIntensity: number;
  /** Ambient colour temperature — used to subtly tint fill. */
  ambientKelvin: number;
  keys: readonly KeyLight[];
  /** Optional accent point light (e.g. rim, fill). */
  accent?: KeyLight;
}

/** The gallery's single, fixed tempered warm/cool lighting configuration. */
export const DRAMATIC_LIGHT_PROFILE: LightProfile = {
  ambientIntensity: 0.8,
  ambientKelvin: 3600,
  keys: [
    {
      kelvin: 3400,
      intensity: 200,
      position: { x: -9, y: 6, z: 6 },
      angle: 0.4,
      penumbra: 0.8,
      decay: 1.7,
    },
  ],
  accent: {
    kelvin: 7200,
    intensity: 16,
    position: { x: 7, y: -3, z: 5 },
    decay: 2.0,
  },
};

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
