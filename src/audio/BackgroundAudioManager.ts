import { createScopedDiagnostics } from '../utils/Diagnostics';
import { DEFAULT_AUDIO_GAIN, MAX_EFFECTIVE_AUDIO_GAIN, gainToDisplayPercent } from './volumeMapping';

// =============================================================================
// Fade-envelope constants (v0.20.2 / v0.20.3 Slice C)
// =============================================================================
// Short fades are applied at every volume transition to eliminate audible
// click/pop artefacts at loop boundaries and mute/unmute edges.
// All durations are in milliseconds; keep them short enough to be imperceptible
// as latency while still covering the transition artefact window.

/** Gain ramp duration when starting playback or unmuting (ms). */
const FADE_IN_MS = 300;
/** Gain ramp duration when pausing or muting (ms). */
const FADE_OUT_MS = 200;
/** Gain ramp when the `ended` fallback restarts a loop (ms). Kept short to minimize audible gap. */
const LOOP_RESTART_FADE_MS = 50;

export interface BackgroundAudioSource {
  src: string;
  ext: string;
  mime: string;
  filename: string;
}

export interface BackgroundAudioPayload {
  sources: readonly BackgroundAudioSource[];
  selectedByImporter?: BackgroundAudioSource;
}

export interface BackgroundAudioState {
  available: boolean;
  loaded: boolean;
  playing: boolean;
  muted: boolean;
  targetVolume: number;
  liveVolume: number;
  autoplayBlocked: boolean;
  message: string | null;
  activeSource: BackgroundAudioSource | null;
}

export class BackgroundAudioManager {
  private readonly diagnostics = createScopedDiagnostics('audio');
  private readonly audio = new Audio();
  private source: BackgroundAudioSource | null = null;
  private disposed = false;
  private suspended = false;
  private shouldResumeAfterSuspend = false;
  private state: BackgroundAudioState = {
    available: false,
    loaded: false,
    playing: false,
    muted: false,
    targetVolume: DEFAULT_AUDIO_GAIN,
    liveVolume: DEFAULT_AUDIO_GAIN,
    autoplayBlocked: false,
    message: null,
    activeSource: null,
  };
  private readonly listeners = new Set<(state: BackgroundAudioState) => void>();

  // ── Fade envelope state (v0.20.2 / v0.20.3 Slice C) ─────────────────────
  private fadeRafHandle: number | null = null;
  private fadeStartTime = 0;
  private fadeStartGain = 0;
  private fadeTargetGain = 0;
  private fadeDurationMs = 0;
  private fadeOnComplete: (() => void) | null = null;

  constructor() {
    this.audio.preload = 'metadata';
    this.audio.loop = true;
    // Startup invariant: always boot unmuted. Keep the media element in sync
    // with the initial state so the UI mute icon cannot start in a stale state.
    this.audio.defaultMuted = false;
    this.audio.removeAttribute('muted');
    this.audio.muted = false;
    this.audio.volume = DEFAULT_AUDIO_GAIN;
    // NOTE: Do NOT set crossOrigin here.
    // When app.html is opened as a file:// URL, Chromium treats the page
    // origin as `null`. Setting crossOrigin = 'anonymous' causes the browser
    // to issue a CORS request, which always fails from a null origin, blocking
    // all audio playback. The audio files are co-located in the same directory
    // so no CORS header is needed.
    this.bindEvents();
  }

  load(payload: BackgroundAudioPayload | null): void {
    if (this.disposed) return;
    // Re-assert startup invariant on every source load so browser-level element
    // state cannot drift into muted=true before first user interaction.
    if (this.audio.muted !== this.state.muted) {
      this.diagnostics.warn('audio-load-mute-desync', 'Repairing muted state desync before loading source', {
        expectedMuted: this.state.muted,
        actualMuted: this.audio.muted,
      });
      this.audio.muted = this.state.muted;
    }
    const chosen = this.pickPlayableSource(payload);
    if (!chosen) {
      this.audio.removeAttribute('src');
      this.audio.load();
      this.state = {
        ...this.state,
        available: false,
        loaded: false,
        playing: false,
        autoplayBlocked: false,
        message: null,
        activeSource: null,
      };
      this.emit();
      this.diagnostics.info('audio-load-empty', 'No background audio source available');
      return;
    }

    this.source = chosen;
    this.audio.src = chosen.src;
    this.audio.load();
    this.state = {
      ...this.state,
      available: true,
      loaded: false,
      playing: false,
      autoplayBlocked: false,
      message: null,
      activeSource: chosen,
    };
    this.emit();
    this.diagnostics.info('audio-load-start', 'Background audio source selected', {
      file: chosen.filename,
      ext: chosen.ext,
      mime: chosen.mime,
    });
  }

  subscribe(listener: (state: BackgroundAudioState) => void): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => this.listeners.delete(listener);
  }

  getState(): BackgroundAudioState {
    return { ...this.state };
  }

  hasSource(): boolean {
    return !!this.source;
  }

  async play(reason: string): Promise<boolean> {
    if (this.disposed || !this.source || this.suspended || this.state.muted) return false;
    if (this.audio.muted !== this.state.muted) {
      this.diagnostics.warn('audio-play-mute-desync', 'Repairing muted state desync before play', {
        reason,
        expectedMuted: this.state.muted,
        actualMuted: this.audio.muted,
      });
      this.audio.muted = this.state.muted;
    }
    if (!this.audio.paused && this.state.playing) {
      this.shouldResumeAfterSuspend = true;
      this.diagnostics.debug('audio-play-skip', 'Play request ignored because audio is already playing', { reason });
      return true;
    }
    this.shouldResumeAfterSuspend = true;
    // Start from zero gain for a clean fade-in; set volume before play() so
    // any buffered samples output at the faded level.
    this.cancelFade();
    this.audio.volume = 0;
    this.state = { ...this.state, liveVolume: 0 };
    try {
      await this.audio.play();
      // Fade in to the persisted target gain over FADE_IN_MS.
      this.startFade(this.state.targetVolume, FADE_IN_MS, 'fade-in');
      this.state = {
        ...this.state,
        playing: true,
        autoplayBlocked: false,
        message: null,
      };
      this.emit();
      this.diagnostics.info('audio-play', `Background audio playing (${reason})`, { reason });
      return true;
    } catch (error) {
      // Restore volume so the element is in a defined state after a failed play.
      this.audio.volume = this.state.targetVolume;
      this.state = { ...this.state, liveVolume: this.audio.volume };
      const name = error instanceof Error ? error.name : 'UnknownError';
      const blocked = name === 'NotAllowedError';
      this.state = {
        ...this.state,
        playing: false,
        autoplayBlocked: blocked,
        message: blocked ? 'Klicken Sie auf Ton aktivieren, um Hintergrundmusik zu starten.' : 'Hintergrundmusik konnte nicht gestartet werden.',
      };
      this.emit();
      this.diagnostics.warn(
        blocked ? 'audio-play-blocked' : 'audio-play-failed',
        blocked ? 'Background audio blocked by autoplay policy' : 'Background audio failed to start',
        {
          reason,
          error,
        },
      );
      // v0.20.3 Slice E: log autoplay-resume-attempt classification
      this.diagnostics.debug('audio-resume-attempt', 'Play attempt outcome', {
        reason,
        blocked,
        success: false,
      });
      return false;
    }
  }

  pause(reason: string): void {
    if (this.disposed || !this.source) return;
    this.shouldResumeAfterSuspend = false;
    // Fade out then pause to avoid click artefacts.
    this.startFade(0, FADE_OUT_MS, 'fade-out', () => {
      if (!this.audio.paused) this.audio.pause();
      // Restore nominal volume so the element is ready for next play().
      this.audio.volume = this.state.targetVolume;
      this.state = { ...this.state, liveVolume: this.audio.volume };
    });
    this.state = { ...this.state, playing: false };
    this.emit();
    this.diagnostics.info('audio-pause', `Background audio paused (${reason})`, { reason });
  }

  setMuted(value: boolean, reason: string): void {
    if (this.disposed) return;
    if (this.state.muted === value && this.audio.muted === value) {
      this.diagnostics.debug('audio-mute-unchanged', 'Mute request ignored because state is unchanged', {
        reason,
        muted: value,
      });
      return;
    }
    if (this.state.muted === value && this.audio.muted !== value) {
      this.diagnostics.warn('audio-mute-state-desync', 'Repairing muted state desync between manager and audio element', {
        reason,
        expectedMuted: value,
        actualMuted: this.audio.muted,
      });
    }
    this.audio.muted = value;
    this.state = { ...this.state, muted: value };
    if (value) {
      // Muting: fade out then pause (same path as pause()).
      this.shouldResumeAfterSuspend = false;
      this.startFade(0, FADE_OUT_MS, 'fade-out-mute', () => {
        if (!this.audio.paused) this.audio.pause();
        this.audio.volume = this.state.targetVolume;
        this.state = { ...this.state, liveVolume: this.audio.volume };
      });
      this.state = { ...this.state, playing: false };
    } else if (!this.disposed && this.source && !this.suspended) {
      void this.play(`unmute:${reason}`);
    }
    this.emit();
    this.diagnostics.info('audio-mute-change', `Background audio mute changed (${reason})`, {
      reason,
      muted: value,
    });
  }

  setVolume(value: number, reason: string): void {
    if (this.disposed) return;
    const clamped = Math.max(0, Math.min(MAX_EFFECTIVE_AUDIO_GAIN, value));
    if (this.fadeRafHandle !== null) {
      this.fadeTargetGain = clamped;
    } else if (!this.state.muted) {
      this.audio.volume = clamped;
      this.state = { ...this.state, liveVolume: clamped };
    }
    this.state = { ...this.state, targetVolume: clamped };
    this.emit();
    this.diagnostics.info('audio-volume-change', `Background audio volume changed (${reason})`, {
      reason,
      targetGain: clamped,
      liveGain: this.audio.volume,
    });
    // v0.20.3 Slice E: explicit mapping log so diagnostics exports show both
    // the stored effective gain and the corresponding display percent.
    this.diagnostics.debug('audio-volume-map', 'Volume mapping record', {
      targetGain: clamped,
      displayPct: gainToDisplayPercent(clamped),
      liveGain: this.audio.volume,
      reason,
    });
  }

  handleSuspend(reason: string): void {
    if (this.disposed || this.suspended) return;
    this.suspended = true;
    this.shouldResumeAfterSuspend = !this.audio.paused && !this.state.muted;
    this.cancelFade();
    if (!this.audio.paused) this.audio.pause();
    this.state = { ...this.state, playing: false };
    this.emit();
    this.diagnostics.info('audio-lifecycle-suspend', `Background audio suspended (${reason})`, {
      reason,
      resumeEligible: this.shouldResumeAfterSuspend,
    });
  }

  handleResume(reason: string): void {
    if (this.disposed || !this.suspended) return;
    this.suspended = false;
    this.diagnostics.info('audio-lifecycle-resume', `Background audio resumed (${reason})`, {
      reason,
      resumeEligible: this.shouldResumeAfterSuspend,
    });
    if (this.shouldResumeAfterSuspend && !this.state.muted) {
      // v0.20.3 Slice E: explicit resume-attempt classification
      this.diagnostics.debug('audio-resume-attempt', 'Attempting auto-resume after lifecycle resume', {
        reason,
      });
      void this.play(`resume:${reason}`);
    }
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.cancelFade();
    this.listeners.clear();
    this.audio.pause();
    this.audio.removeAttribute('src');
    this.audio.load();
  }

  private bindEvents(): void {
    this.audio.addEventListener('canplay', () => {
      this.state = { ...this.state, loaded: true };
      this.emit();
      this.diagnostics.info('audio-canplay', 'Background audio can play');
    });
    this.audio.addEventListener('playing', () => {
      this.state = { ...this.state, playing: true, autoplayBlocked: false, message: null };
      this.emit();
      this.diagnostics.info('audio-playing', 'Background audio playing event');
    });
    this.audio.addEventListener('pause', () => {
      this.state = { ...this.state, playing: false };
      this.emit();
      this.diagnostics.debug('audio-pause-event', 'Background audio pause event');
    });
    this.audio.addEventListener('ended', () => {
      if (!this.source) return;
      this.diagnostics.warn('audio-loop-restart', 'Audio ended unexpectedly while loop is enabled; restarting');
      // Brief fade to zero before restart to mask any loop-boundary click.
      this.startFade(0, LOOP_RESTART_FADE_MS, 'fade-out-loop', () => {
        this.audio.currentTime = 0;
        void this.play('ended-fallback');
      });
    });
    this.audio.addEventListener('error', () => {
      const mediaErr = this.audio.error;
      this.state = {
        ...this.state,
        playing: false,
        message: 'Hintergrundmusik konnte nicht geladen werden.',
      };
      this.emit();
      this.diagnostics.warn('audio-error', 'Background audio element emitted an error event', {
        code: mediaErr?.code,
        message: mediaErr?.message,
      });
    });
    this.audio.addEventListener('volumechange', () => {
      if (this.audio.muted !== this.state.muted) {
        this.diagnostics.warn('audio-volumechange-mute-desync', 'Repairing muted state desync during volumechange', {
          expectedMuted: this.state.muted,
          actualMuted: this.audio.muted,
        });
        this.audio.muted = this.state.muted;
      }
      this.state = {
        ...this.state,
        muted: this.state.muted,
        liveVolume: this.audio.volume,
      };
      this.emit();
    });
  }

  private pickPlayableSource(payload: BackgroundAudioPayload | null): BackgroundAudioSource | null {
    if (!payload || !Array.isArray(payload.sources) || payload.sources.length === 0) {
      return null;
    }
    const sourceList = payload.sources.filter(
      (source) =>
        !!source &&
        typeof source.src === 'string' &&
        typeof source.ext === 'string' &&
        typeof source.mime === 'string' &&
        typeof source.filename === 'string',
    );
    if (sourceList.length === 0) return null;

    const canProbeRuntime = typeof this.audio.canPlayType === 'function';
    if (canProbeRuntime) {
      for (const source of sourceList) {
        const support = this.audio.canPlayType(source.mime);
        if (support === 'probably' || support === 'maybe') {
          return source;
        }
      }
      return null;
    }

    if (payload.selectedByImporter) {
      const importerMatch = sourceList.find((source) => source.src === payload.selectedByImporter?.src);
      if (importerMatch) return importerMatch;
    }
    return sourceList[0];
  }

  // ==========================================================================
  // Fade envelope engine (v0.20.2 / v0.20.3 Slice C)
  // ==========================================================================

  /**
   * Start a volume ramp from the current element volume to `targetGain`
   * over `durationMs` milliseconds using requestAnimationFrame.
   * Any in-progress fade is cancelled before the new one begins.
   */
  private startFade(
    targetGain: number,
    durationMs: number,
    label: string,
    onComplete?: () => void,
  ): void {
    this.cancelFade();
    this.fadeStartGain = this.audio.volume;
    this.fadeTargetGain = Math.max(0, Math.min(MAX_EFFECTIVE_AUDIO_GAIN, targetGain));
    this.fadeDurationMs = durationMs;
    this.fadeOnComplete = onComplete ?? null;
    this.fadeStartTime = 0; // reset; set on first tick
    this.fadeRafHandle = requestAnimationFrame(this.tickFade);
    this.diagnostics.debug('audio-fade-start', 'Volume fade started', {
      label,
      from: this.fadeStartGain,
      to: this.fadeTargetGain,
      durationMs,
    });
  }

  /** Cancel any in-progress volume ramp without invoking its callback. */
  private cancelFade(): void {
    if (this.fadeRafHandle !== null) {
      cancelAnimationFrame(this.fadeRafHandle);
      this.fadeRafHandle = null;
      this.fadeOnComplete = null;
      this.diagnostics.debug('audio-fade-cancel', 'Volume fade cancelled');
    }
  }

  /** rAF tick: advance the volume ramp by one frame. */
  private readonly tickFade = (now: number): void => {
    if (this.fadeStartTime === 0) {
      this.fadeStartTime = now;
    }
    const elapsed = now - this.fadeStartTime;
    const t = this.fadeDurationMs > 0 ? Math.min(1, elapsed / this.fadeDurationMs) : 1;
    const gain = this.fadeStartGain + (this.fadeTargetGain - this.fadeStartGain) * t;
    this.audio.volume = Math.max(0, Math.min(1, gain));
    this.state = { ...this.state, liveVolume: this.audio.volume };
    this.emit();

    if (t < 1) {
      this.fadeRafHandle = requestAnimationFrame(this.tickFade);
    } else {
      this.fadeRafHandle = null;
      this.diagnostics.debug('audio-fade-complete', 'Volume fade completed', {
        gain: this.fadeTargetGain,
      });
      const cb = this.fadeOnComplete;
      this.fadeOnComplete = null;
      cb?.();
    }
  };

  private emit(): void {
    const snapshot = { ...this.state };
    this.listeners.forEach((listener) => listener(snapshot));
  }
}
