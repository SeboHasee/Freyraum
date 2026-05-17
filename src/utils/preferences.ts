import type { QualityPresetId } from '../config/quality';
import { DEFAULT_QUALITY_PRESET, QUALITY_PRESETS } from '../config/quality';
import type { LightProfileId } from '../lighting/LightProfile';
import { DEFAULT_LIGHT_PROFILE, LIGHT_PROFILES } from '../lighting/LightProfile';

/**
 * Central user-preference store for accessibility and performance choices.
 *
 * The store reads system defaults (prefers-reduced-motion, prefers-contrast),
 * then layers persisted user overrides on top. Preferences are mirrored to
 * data attributes on <html> so SCSS can react without JS recalculation.
 */

export type ContrastMode = 'auto' | 'high';

export interface Preferences {
  reducedMotion: boolean;
  highContrast: boolean;
  contrastMode: ContrastMode;
  quality: QualityPresetId;
  /** v0.03: artistic lighting profile (display vs. inspection). */
  lighting: LightProfileId;
}

export type PreferenceListener = (prefs: Preferences) => void;

const STORAGE_KEY = 'freyraum.preferences.v1';

function readStored(): Partial<Preferences> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {
    /* localStorage unavailable (file:// in some browsers); fall back to defaults */
  }
  return {};
}

function writeStored(prefs: Preferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore storage errors */
  }
}

function detectSystemReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

function detectSystemHighContrast(): boolean {
  return window.matchMedia?.('(prefers-contrast: more)')?.matches ?? false;
}

export class PreferencesStore {
  private prefs: Preferences;
  private readonly listeners = new Set<PreferenceListener>();
  private readonly motionMedia = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  private readonly contrastMedia = window.matchMedia?.('(prefers-contrast: more)');

  constructor() {
    const stored = readStored();
    const quality: QualityPresetId =
      stored.quality && stored.quality in QUALITY_PRESETS
        ? (stored.quality as QualityPresetId)
        : DEFAULT_QUALITY_PRESET;

    const lighting: LightProfileId =
      stored.lighting && stored.lighting in LIGHT_PROFILES
        ? (stored.lighting as LightProfileId)
        : DEFAULT_LIGHT_PROFILE;

    const contrastMode: ContrastMode = stored.contrastMode === 'high' ? 'high' : 'auto';

    this.prefs = {
      reducedMotion: stored.reducedMotion ?? detectSystemReducedMotion(),
      highContrast: contrastMode === 'high' ? true : detectSystemHighContrast(),
      contrastMode,
      quality,
      lighting,
    };

    this.motionMedia?.addEventListener?.('change', this.handleSystemMotionChange);
    this.contrastMedia?.addEventListener?.('change', this.handleSystemContrastChange);

    this.applyToDocument();
  }

  private handleSystemMotionChange = (event: MediaQueryListEvent): void => {
    // Only follow system if user hasn't explicitly toggled.
    if (readStored().reducedMotion === undefined) {
      this.prefs.reducedMotion = event.matches;
      this.emit();
    }
  };

  private handleSystemContrastChange = (event: MediaQueryListEvent): void => {
    if (this.prefs.contrastMode === 'auto') {
      this.prefs.highContrast = event.matches;
      this.emit();
    }
  };

  get current(): Preferences {
    return { ...this.prefs };
  }

  setReducedMotion(value: boolean): void {
    this.prefs.reducedMotion = value;
    this.emit();
  }

  setContrastMode(mode: ContrastMode): void {
    this.prefs.contrastMode = mode;
    this.prefs.highContrast = mode === 'high' ? true : detectSystemHighContrast();
    this.emit();
  }

  setQuality(id: QualityPresetId): void {
    if (!(id in QUALITY_PRESETS)) return;
    this.prefs.quality = id;
    this.emit();
  }

  setLighting(id: LightProfileId): void {
    if (!(id in LIGHT_PROFILES)) return;
    this.prefs.lighting = id;
    this.emit();
  }

  subscribe(listener: PreferenceListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    this.applyToDocument();
    writeStored(this.prefs);
    this.listeners.forEach((l) => l(this.current));
  }

  private applyToDocument(): void {
    const root = document.documentElement;
    root.dataset['motion'] = this.prefs.reducedMotion ? 'reduced' : 'full';
    root.dataset['contrast'] = this.prefs.highContrast ? 'high' : 'auto';
    root.dataset['quality'] = this.prefs.quality;
    root.dataset['lighting'] = this.prefs.lighting;
  }

  dispose(): void {
    this.motionMedia?.removeEventListener?.('change', this.handleSystemMotionChange);
    this.contrastMedia?.removeEventListener?.('change', this.handleSystemContrastChange);
    this.listeners.clear();
  }
}
