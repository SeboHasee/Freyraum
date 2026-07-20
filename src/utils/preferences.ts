import type { QualityPresetId } from '../config/quality';
import { DEFAULT_QUALITY_PRESET, QUALITY_PRESETS } from '../config/quality';
import { createScopedDiagnostics } from './Diagnostics';
import { DEFAULT_AUDIO_GAIN, MAX_EFFECTIVE_AUDIO_GAIN } from '../audio/volumeMapping';

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
  /** v0.19: background audio mute state. */
  audioMuted: boolean;
  /** v0.19+: background audio effective gain (0..0.30). */
  audioVolume: number;
  /** v0.60: when true, timeline + info panel stay permanently visible
   *  (disables clean-chrome auto-hide). Default false. */
  alwaysShowChrome: boolean;
}

export type PreferenceListener = (prefs: Preferences) => void;

const STORAGE_KEY = 'freyraum.preferences.v1';
const diagnostics = createScopedDiagnostics('preferences');

function readStored(): Partial<Preferences> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {
    diagnostics.warn('storage-read-failed', 'Could not read stored preferences; falling back to defaults');
  }
  return {};
}

function writeStored(prefs: Preferences): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...prefs,
        // Startup invariant: every fresh open must begin unmuted.
        audioMuted: false,
      } satisfies Preferences)
    );
  } catch {
    diagnostics.warn('storage-write-failed', 'Could not persist preferences to localStorage');
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

    const contrastMode: ContrastMode = stored.contrastMode === 'high' ? 'high' : 'auto';

    let audioVolume =
      typeof stored.audioVolume === 'number' && Number.isFinite(stored.audioVolume)
        ? Math.max(0, Math.min(MAX_EFFECTIVE_AUDIO_GAIN, stored.audioVolume))
        : DEFAULT_AUDIO_GAIN;

    const shouldNormalizeZeroVolume =
      typeof stored.audioVolume === 'number' &&
      Number.isFinite(stored.audioVolume) &&
      stored.audioVolume <= 0;

    if (shouldNormalizeZeroVolume) {
      audioVolume = DEFAULT_AUDIO_GAIN;
      diagnostics.warn('audio-volume-normalized', 'Normalized stored zero-volume state to startup default', {
        key: STORAGE_KEY,
        stored: stored.audioVolume,
        normalizedTo: audioVolume,
      });
    }

    this.prefs = {
      reducedMotion: stored.reducedMotion ?? detectSystemReducedMotion(),
      highContrast: contrastMode === 'high' ? true : detectSystemHighContrast(),
      contrastMode,
      quality,
      audioMuted: false, // always start unmuted regardless of stored state
      audioVolume,
      alwaysShowChrome: stored.alwaysShowChrome === true,
    };

    const shouldNormalizeMutedPreference = stored.audioMuted !== false;
    if (shouldNormalizeZeroVolume || shouldNormalizeMutedPreference) {
      writeStored(this.prefs);
      diagnostics.info('audio-startup-normalized', 'Normalized persisted startup audio state', {
        storedMuted: stored.audioMuted,
        storedVolume: stored.audioVolume,
        normalizedMuted: this.prefs.audioMuted,
        normalizedVolume: this.prefs.audioVolume,
      });
    }

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

  setAudioMuted(value: boolean): void {
    this.prefs.audioMuted = value;
    this.emit();
  }

  setAudioVolume(value: number): void {
    this.prefs.audioVolume = Math.max(0, Math.min(MAX_EFFECTIVE_AUDIO_GAIN, value));
    this.emit();
  }

  /**
   * v0.60 — toggle clean-chrome mode. When `false` (default) the timeline and
   * info panel auto-hide and reveal on pointer proximity / focus. When `true`
   * they stay permanently visible (accessibility / kiosk preference). The
   * `data-chrome-mode` attribute is mirrored to <html> by `applyToDocument()`
   * so SCSS reacts without extra JS, and the choice is persisted.
   */
  setAlwaysShowChrome(value: boolean): void {
    if (this.prefs.alwaysShowChrome === value) return;
    this.prefs.alwaysShowChrome = value;
    diagnostics.info('always-show-chrome', 'Clean-chrome preference changed', { value });
    this.emit();
  }

  normalizeStartupAudio(reason: string, notifyListeners = true): void {
    const normalizedVolume = this.prefs.audioVolume > 0 ? this.prefs.audioVolume : DEFAULT_AUDIO_GAIN;
    const changed = this.prefs.audioMuted || this.prefs.audioVolume !== normalizedVolume;
    this.prefs = {
      ...this.prefs,
      audioMuted: false,
      audioVolume: normalizedVolume,
    };

    if (changed) {
      diagnostics.info('audio-startup-reset', 'Reset audio to startup defaults', {
        reason,
        audioMuted: this.prefs.audioMuted,
        audioVolume: this.prefs.audioVolume,
      });
    } else {
      diagnostics.debug('audio-startup-reset-skip', 'Startup audio already matches required defaults', {
        reason,
        audioMuted: this.prefs.audioMuted,
        audioVolume: this.prefs.audioVolume,
      });
    }

    if (notifyListeners) {
      this.emit();
      return;
    }

    writeStored(this.prefs);
  }

  /**
   * v0.11 — returns `true` if the user has previously set a quality
   * preference (i.e. localStorage holds an explicit `quality` value).
   * Used by `main.ts` to decide whether to apply the mobile startup
   * quality heuristic. Once the user has chosen, their choice is
   * respected and the heuristic is not re-applied.
   */
  static hasStoredQuality(): boolean {
    return readStored().quality !== undefined;
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
    // v0.60: mirror clean-chrome mode so SCSS auto-hide rules apply from the
    // very first paint (set during construction, before ChromeVisibilityManager
    // initialises) — prevents a flash of always-visible chrome on load.
    root.dataset['chromeMode'] = this.prefs.alwaysShowChrome ? 'visible' : 'clean';
  }

  dispose(): void {
    this.motionMedia?.removeEventListener?.('change', this.handleSystemMotionChange);
    this.contrastMedia?.removeEventListener?.('change', this.handleSystemContrastChange);
    this.listeners.clear();
  }
}
