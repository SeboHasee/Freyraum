import { createScopedDiagnostics } from '../utils/Diagnostics';

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
  volume: number;
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
    volume: 0.35,
    autoplayBlocked: false,
    message: null,
    activeSource: null,
  };
  private readonly listeners = new Set<(state: BackgroundAudioState) => void>();

  constructor() {
    this.audio.preload = 'metadata';
    this.audio.loop = true;
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
    this.shouldResumeAfterSuspend = true;
    try {
      await this.audio.play();
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
      return false;
    }
  }

  pause(reason: string): void {
    if (this.disposed || !this.source) return;
    this.shouldResumeAfterSuspend = false;
    if (!this.audio.paused) this.audio.pause();
    this.state = { ...this.state, playing: false };
    this.emit();
    this.diagnostics.info('audio-pause', `Background audio paused (${reason})`, { reason });
  }

  setMuted(value: boolean, reason: string): void {
    if (this.disposed) return;
    this.audio.muted = value;
    this.state = { ...this.state, muted: value };
    if (value) {
      this.shouldResumeAfterSuspend = false;
      if (!this.audio.paused) this.audio.pause();
      this.state = { ...this.state, playing: false };
    }
    this.emit();
    this.diagnostics.info('audio-mute-change', `Background audio mute changed (${reason})`, {
      reason,
      muted: value,
    });
  }

  setVolume(value: number, reason: string): void {
    if (this.disposed) return;
    const clamped = Math.max(0, Math.min(1, value));
    this.audio.volume = clamped;
    this.state = { ...this.state, volume: clamped };
    this.emit();
    this.diagnostics.info('audio-volume-change', `Background audio volume changed (${reason})`, {
      reason,
      volume: clamped,
    });
  }

  handleSuspend(reason: string): void {
    if (this.disposed || this.suspended) return;
    this.suspended = true;
    this.shouldResumeAfterSuspend = !this.audio.paused && !this.state.muted;
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
      void this.play(`resume:${reason}`);
    }
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
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
      this.audio.currentTime = 0;
      void this.play('ended-fallback');
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
      this.state = {
        ...this.state,
        muted: this.audio.muted,
        volume: this.audio.volume,
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

  private emit(): void {
    const snapshot = { ...this.state };
    this.listeners.forEach((listener) => listener(snapshot));
  }
}
