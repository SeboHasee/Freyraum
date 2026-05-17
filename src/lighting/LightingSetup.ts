import * as THREE from 'three';
import type { QualityPreset } from '../config/quality';
import {
  DEFAULT_LIGHT_PROFILE,
  type LightProfile,
  type LightProfileId,
  type KeyLight,
  getLightProfile,
  kelvinToColor,
} from './LightProfile';

/**
 * v0.02 lighting system. Builds a small pool of Three.js light objects and
 * applies the active {@link LightProfile} to them. Profile switches reuse
 * existing lights when possible to avoid scene-graph churn.
 *
 * Animation: only `animateAllowed` profiles animate; inspection and museum
 * profiles stay perfectly still. The accessibility `reducedMotion` flag in
 * the preference store disables animation regardless of profile.
 */
export class LightingSetup {
  private readonly scene: THREE.Scene;
  private readonly ambientLight: THREE.AmbientLight;
  private readonly spots: THREE.SpotLight[] = [];
  private readonly spotTarget: THREE.Object3D;
  private accent: THREE.PointLight | null = null;
  private profile: LightProfile;
  private animate = true;

  constructor(scene: THREE.Scene, preset: QualityPreset, profileId: LightProfileId = DEFAULT_LIGHT_PROFILE) {
    this.scene = scene;
    this.profile = getLightProfile(profileId);

    this.ambientLight = new THREE.AmbientLight(0xffffff, this.profile.ambientIntensity);
    scene.add(this.ambientLight);

    // v0.03: explicit spot target at world origin. New gallery-soft key
    // position is much closer to the artwork (x=-3 vs old -10), so leaving
    // targets undefined would make Three.js aim at (0,0,0) by default but
    // detached targets do not move when we drift the spot in update().
    // Adding the target to the scene anchors it.
    this.spotTarget = new THREE.Object3D();
    this.spotTarget.position.set(0, 0, 0);
    scene.add(this.spotTarget);

    this.applyProfile(this.profile);
    this.applyPreset(preset);
  }

  /** Switches to a different lighting profile. Reuses lights where possible. */
  setProfile(id: LightProfileId): void {
    const next = getLightProfile(id);
    if (next.id === this.profile.id) return;
    this.profile = next;
    this.applyProfile(next);
  }

  applyPreset(preset: QualityPreset): void {
    for (const spot of this.spots) {
      spot.castShadow = preset.shadows;
    }
  }

  setAnimated(animate: boolean): void {
    this.animate = animate;
  }

  update(time: number): void {
    if (!this.animate || !this.profile.animateAllowed) return;
    // Gentle horizontal drift on the primary key light. Drift amplitude is
    // smaller in v0.03 because the new gallery-soft key sits closer to the
    // painting, so a 0.6 unit drift would be too perceptible.
    const primary = this.spots[0];
    if (!primary) return;
    const baseX = this.profile.keys[0]?.position.x ?? -3;
    primary.position.x = baseX + Math.sin(time * 0.0002) * 0.25;
  }

  dispose(): void {
    this.ambientLight.dispose();
    for (const spot of this.spots) {
      this.scene.remove(spot);
      spot.dispose();
    }
    this.spots.length = 0;
    this.scene.remove(this.spotTarget);
    if (this.accent) {
      this.scene.remove(this.accent);
      this.accent.dispose();
      this.accent = null;
    }
  }

  /** Returns the active profile id (used by UI / debug overlay). */
  get profileId(): LightProfileId {
    return this.profile.id;
  }

  /**
   * v0.03: returns a unit-length world-space direction FROM the artwork
   * (world origin) TOWARDS the primary key light. main.ts calls this each
   * frame and feeds the result into PaintingMaterial for self-shadow.
   */
  getKeyLightWorldDir(out?: THREE.Vector3): THREE.Vector3 {
    const target = out ?? new THREE.Vector3();
    const primary = this.spots[0];
    if (!primary) return target.set(0, 0, 1);
    return target.copy(primary.position).normalize();
  }

  private applyProfile(profile: LightProfile): void {
    this.ambientLight.intensity = profile.ambientIntensity;
    kelvinToColor(profile.ambientKelvin, this.ambientLight.color);

    // Match the spotlight count to the profile, reusing or pruning as needed.
    while (this.spots.length < profile.keys.length) {
      const spot = new THREE.SpotLight(0xffffff, 0);
      this.scene.add(spot);
      this.spots.push(spot);
    }
    while (this.spots.length > profile.keys.length) {
      const spot = this.spots.pop()!;
      this.scene.remove(spot);
      spot.dispose();
    }

    profile.keys.forEach((key, i) => this.applyKeyLight(this.spots[i], key));

    // Accent (point light).
    if (profile.accent) {
      if (!this.accent) {
        this.accent = new THREE.PointLight(0xffffff, 0, 30);
        this.scene.add(this.accent);
      }
      kelvinToColor(profile.accent.kelvin, this.accent.color);
      this.accent.intensity = profile.accent.intensity;
      this.accent.position.set(profile.accent.position.x, profile.accent.position.y, profile.accent.position.z);
      this.accent.decay = profile.accent.decay ?? 2.0;
    } else if (this.accent) {
      this.scene.remove(this.accent);
      this.accent.dispose();
      this.accent = null;
    }
  }

  private applyKeyLight(spot: THREE.SpotLight, key: KeyLight): void {
    kelvinToColor(key.kelvin, spot.color);
    spot.intensity = key.intensity;
    spot.distance = 80;
    spot.angle = key.angle ?? 0.42;
    spot.penumbra = key.penumbra ?? 0.9;
    spot.decay = key.decay ?? 1.8;
    spot.position.set(key.position.x, key.position.y, key.position.z);
    // v0.03: aim every spot at the shared target anchored to world origin
    // so the new closer key positions actually illuminate the painting.
    spot.target = this.spotTarget;
  }
}
