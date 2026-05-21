import type { BackgroundAudioManager, BackgroundAudioState } from '../audio/BackgroundAudioManager';
import type { PreferencesStore } from '../utils/preferences';
import { createScopedDiagnostics } from '../utils/Diagnostics';
import { gainToDisplayPercent, displayPercentToGain } from '../audio/volumeMapping';

const diagnostics = createScopedDiagnostics('audio-controls');

/**
 * Subtle main-page audio widget: mute/unmute button + compact volume slider.
 *
 * Positioned in the top-right control cluster.
 * Hidden when no audio source is available. Shows an activation indicator
 * when browser autoplay policy has blocked the initial play attempt.
 *
 * Design rationale: the widget uses the same glass-pill language as
 * ZoomControls so it feels native to the gallery chrome without drawing
 * attention away from the artwork. Volume slider is hidden on small phones.
 *
 * Click behaviour:
 *   • Audio is playing  → mute (via preferences, persisted)
 *   • Audio is muted    → unmute (via preferences → triggers applyPreferences → play)
 *   • Autoplay blocked  → play() directly within user gesture (unlocks browser policy)
 *   • Not playing       → play() directly within user gesture
 */
export class AudioControls {
  private readonly el: HTMLElement;
  private readonly muteBtn: HTMLButtonElement;
  private readonly volumeInput: HTMLInputElement;
  private readonly unsubscribe: () => void;
  private currentState: BackgroundAudioState;

  constructor(
    container: HTMLElement,
    private readonly prefs: PreferencesStore,
    private readonly audioManager: BackgroundAudioManager,
  ) {
    this.currentState = audioManager.getState();

    this.el = document.createElement('div');
    this.el.className = 'audio-controls';
    this.el.setAttribute('role', 'group');
    this.el.setAttribute('aria-label', 'Hintergrundmusik');

    // ── Mute / play button ────────────────────────────────────────────────────
    this.muteBtn = document.createElement('button');
    this.muteBtn.type = 'button';
    this.muteBtn.className = 'audio-controls__btn';
    this.muteBtn.addEventListener('click', this.handleMuteClick);

    // ── Volume slider ─────────────────────────────────────────────────────────
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'audio-controls__slider-wrap';

    this.volumeInput = document.createElement('input');
    this.volumeInput.type = 'range';
    this.volumeInput.className = 'audio-controls__slider';
    this.volumeInput.min = '0';
    this.volumeInput.max = '100';
    this.volumeInput.step = '1';
    this.volumeInput.setAttribute('aria-label', 'Lautstärke');
    this.volumeInput.addEventListener('input', this.handleVolumeInput);

    sliderWrapper.appendChild(this.volumeInput);
    this.el.append(this.muteBtn, sliderWrapper);
    container.appendChild(this.el);

    this.unsubscribe = audioManager.subscribe((state) => this.update(state));
  }

  // ── State renderer ───────────────────────────────────────────────────────────

  private update(state: BackgroundAudioState): void {
    this.currentState = state;

    // Hide the whole widget when no audio source is imported.
    this.el.hidden = !state.available;

    if (!state.available) return;

    const muted = state.muted;
    const blocked = state.autoplayBlocked;
    const playing = state.playing;

    // Update button classes for CSS-only state styling.
    this.muteBtn.classList.toggle('audio-controls__btn--muted', muted);
    this.muteBtn.classList.toggle('audio-controls__btn--blocked', blocked && !muted);
    this.muteBtn.classList.toggle('audio-controls__btn--playing', playing && !muted);

    // Accessible label and title.
    let label: string;
    if (blocked && !muted) {
      label = 'Klicken zum Aktivieren der Hintergrundmusik';
    } else if (muted) {
      label = 'Ton einschalten';
    } else if (playing) {
      label = 'Ton ausschalten';
    } else {
      label = 'Hintergrundmusik abspielen';
    }
    this.muteBtn.setAttribute('aria-label', label);
    this.muteBtn.title = label;
    this.muteBtn.setAttribute('aria-pressed', playing && !muted ? 'true' : 'false');

    // Speaker SVG icon.
    this.muteBtn.innerHTML = `
      <span class="audio-controls__btn-icon" aria-hidden="true">
        ${muted ? ICON_MUTED : blocked ? ICON_BLOCKED : ICON_ACTIVE}
      </span>
      ${blocked && !muted ? '<span class="audio-controls__indicator" aria-hidden="true"></span>' : ''}
    `;

    // Volume slider value: convert stored effective gain to display percent.
    const displayPct = gainToDisplayPercent(state.targetVolume);
    this.volumeInput.value = String(displayPct);
    this.volumeInput.disabled = muted;
    this.volumeInput.setAttribute('aria-valuenow', String(displayPct));
    this.volumeInput.setAttribute('aria-valuetext', `${displayPct} Prozent`);
    // Update the CSS custom property used for the track fill gradient.
    this.volumeInput.style.setProperty('--volume-pct', `${displayPct}%`);
  }

  // ── Event handlers ───────────────────────────────────────────────────────────

  /**
   * Mute button click — toggles audio on/off, unlocking autoplay when needed.
   *
   * The complete call chain must remain synchronous with the user gesture
   * so that `audio.play()` is invoked while the browser still attributes
   * the call to the click. See main.ts `applyPreferences` for the
   * preferences→audio path; audio changes bypass `requestIdleCallback`.
   */
  private handleMuteClick = (): void => {
    const { muted, playing, autoplayBlocked, available } = this.currentState;
    if (!available) return;

    if (muted) {
      // Unmute: preferences change triggers synchronous applyPreferences → play().
      this.prefs.setAudioMuted(false);
      diagnostics.info('user-unmute', 'User unmuted audio via main-page control');
    } else if (playing) {
      // Mute while playing.
      this.prefs.setAudioMuted(true);
      diagnostics.info('user-mute', 'User muted audio via main-page control');
    } else {
      // Not playing and not muted — autoplay was blocked or audio paused.
      // Call play() directly within this user gesture to unlock the browser policy.
      // (setAudioMuted(false) when already false doesn't produce an audioChanged
      // event in main.ts, so we cannot rely on the preferences path here.)
      void this.audioManager.play('user-activate');
      diagnostics.info('user-activate', 'User activated audio via main-page control', { autoplayBlocked });
    }
  };

  private handleVolumeInput = (): void => {
    const displayPct = Number(this.volumeInput.value);
    if (Number.isNaN(displayPct)) return;
    // Update track fill immediately (visual feedback before state round-trip).
    const roundedDisplayPct = Math.round(displayPct);
    this.volumeInput.style.setProperty('--volume-pct', `${roundedDisplayPct}%`);
    this.volumeInput.setAttribute('aria-valuenow', String(roundedDisplayPct));
    this.volumeInput.setAttribute('aria-valuetext', `${roundedDisplayPct} Prozent`);
    // Convert display percent to effective gain before persisting.
    const gain = displayPercentToGain(displayPct);
    this.prefs.setAudioVolume(gain);
    diagnostics.debug('user-volume', 'User adjusted volume via main-page slider', {
      displayPct,
      gain,
    });
  };

  dispose(): void {
    this.unsubscribe();
    this.el.remove();
  }
}

// =============================================================================
// SVG icon strings
// =============================================================================

const ICON_ACTIVE = `
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>`;

const ICON_MUTED = `
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>`;

const ICON_BLOCKED = `
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="15" y1="12" x2="21" y2="12" stroke-dasharray="2 2"/>
  </svg>`;
