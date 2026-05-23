import type { QualityPresetId, QualityPreset } from '../config/quality';
import { QUALITY_PRESETS } from '../config/quality';
import type { LightProfileId, LightProfile } from '../lighting/LightProfile';
import { LIGHT_PROFILES } from '../lighting/LightProfile';
import type { PreferencesStore } from '../utils/preferences';
import { gainToDisplayPercent, displayPercentToGain } from '../audio/volumeMapping';

/**
 * Floating preferences panel: motion, contrast, and quality presets.
 * Implemented as a popover-style menu that opens from a trigger button
 * so it never blocks the artwork at rest. All controls are real form
 * controls so screen readers describe them natively.
 *
 * v0.20.2 / v0.20.3 Slice B: panel is built once; only mutable states
 * are patched on each preference update. This prevents full innerHTML
 * replacement from interrupting active pointer/keyboard slider drags.
 * During an active volume-slider drag, structural re-patches are suppressed
 * and the display label is updated in-place without writing to preferences
 * storage; the final effective gain is written on the `change` event.
 */

export class PreferencesPanel {
  private readonly root: HTMLElement;
  private readonly trigger: HTMLButtonElement;
  private readonly panel: HTMLElement;
  private isOpen = false;
  private readonly unsubscribe: () => void;
  private audioStatusMessage: string | null = null;

  // ── In-place patch targets (resolved once after buildPanel) ───────────────
  private motionInput: HTMLInputElement | null = null;
  private contrastInput: HTMLInputElement | null = null;
  private audioMutedInput: HTMLInputElement | null = null;
  private audioVolumeInput: HTMLInputElement | null = null;
  private audioValueLabel: HTMLElement | null = null;
  private audioStatusEl: HTMLElement | null = null;

  // ── Drag-continuity guard (v0.20.2 / v0.20.3 Slice B) ────────────────────
  // While the user is actively dragging the volume slider we suppress the
  // full structural re-patch triggered by the preference subscription, so
  // the control node is never replaced mid-drag.
  private isVolumeDragging = false;

  constructor(container: HTMLElement, private readonly prefs: PreferencesStore) {
    this.root = document.createElement('div');
    this.root.className = 'prefs';

    this.trigger = document.createElement('button');
    this.trigger.type = 'button';
    this.trigger.className = 'prefs__trigger';
    this.trigger.setAttribute('aria-haspopup', 'true');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.setAttribute('aria-controls', 'freyraum-prefs-panel');
    this.trigger.setAttribute('aria-label', 'Einstellungen öffnen');
    this.trigger.innerHTML = `
      <span class="prefs__trigger-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8L4.2 7A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
        </svg>
      </span>
    `;
    this.trigger.addEventListener('click', this.handleToggle);

    this.panel = document.createElement('div');
    this.panel.id = 'freyraum-prefs-panel';
    this.panel.className = 'prefs__panel';
    this.panel.setAttribute('role', 'dialog');
    // v0.17: aria-labelledby points to the static heading id added in buildPanel(),
    // replacing the previous aria-label so screen readers announce the dialog title
    // correctly (WCAG 4.1.2, ARIA dialog role requirements).
    this.panel.setAttribute('aria-labelledby', 'freyraum-prefs-heading');
    // v0.17: aria-modal=true tells assistive technology that background content is
    // inert while this panel is open. Required for WCAG 2.1.2 and 2.4.3 compliance
    // with custom role=dialog implementations.
    // Source: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
    this.panel.setAttribute('aria-modal', 'true');
    this.panel.hidden = true;

    this.buildPanel();

    this.root.append(this.trigger, this.panel);
    container.appendChild(this.root);

    document.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('keydown', this.handleEscape);

    // v0.20.2: patch only mutable states on each preference update (no full rebuild).
    this.unsubscribe = this.prefs.subscribe(() => this.patchPanel());
  }

  // ── Panel construction (called once) ────────────────────────────────────────

  private buildPanel(): void {
    const { reducedMotion, contrastMode, quality, lighting, audioMuted, audioVolume } = this.prefs.current;

    const qualityOptions = (Object.values(QUALITY_PRESETS) as QualityPreset[])
      .map(
        (preset) => `
          <label class="prefs__radio">
            <input type="radio" name="freyraum-quality" value="${preset.id}" ${
              quality === preset.id ? 'checked' : ''
            } />
            <span class="prefs__radio-label">
              <span class="prefs__radio-title">${preset.label}</span>
              <span class="prefs__radio-desc">${preset.description}</span>
            </span>
          </label>
        `
      )
      .join('');

    const lightingOptions = (Object.values(LIGHT_PROFILES) as LightProfile[])
      .map(
        (profile) => `
          <label class="prefs__radio">
            <input type="radio" name="freyraum-lighting" value="${profile.id}" ${
              lighting === profile.id ? 'checked' : ''
            } />
            <span class="prefs__radio-label">
              <span class="prefs__radio-title">${profile.label}</span>
              <span class="prefs__radio-desc">${profile.description}</span>
            </span>
          </label>
        `
      )
      .join('');

    // v0.20.2: volume is stored as effective gain; display as mapped percent.
    const displayPct = gainToDisplayPercent(audioVolume);

    this.panel.innerHTML = `
      <h2 class="prefs__heading" id="freyraum-prefs-heading">Anzeige</h2>
      <label class="prefs__toggle">
        <input type="checkbox" id="freyraum-motion" ${reducedMotion ? 'checked' : ''} />
        <span class="prefs__toggle-track" aria-hidden="true"></span>
        <span class="prefs__toggle-label">
          <span class="prefs__toggle-title">Reduzierte Bewegung</span>
          <span class="prefs__toggle-desc">Sanftere Übergänge und ruhige Galerie.</span>
        </span>
      </label>
      <label class="prefs__toggle">
        <input type="checkbox" id="freyraum-contrast" ${contrastMode === 'high' ? 'checked' : ''} />
        <span class="prefs__toggle-track" aria-hidden="true"></span>
        <span class="prefs__toggle-label">
          <span class="prefs__toggle-title">Hoher Kontrast</span>
          <span class="prefs__toggle-desc">Stärkere Lesbarkeit über allen Werken.</span>
        </span>
      </label>
      <fieldset class="prefs__group">
        <legend class="prefs__legend">Beleuchtung</legend>
        ${lightingOptions}
      </fieldset>
      <h2 class="prefs__heading">Hintergrundmusik</h2>
      <label class="prefs__toggle">
        <input type="checkbox" id="freyraum-audio-muted" ${audioMuted ? 'checked' : ''} />
        <span class="prefs__toggle-track" aria-hidden="true"></span>
        <span class="prefs__toggle-label">
          <span class="prefs__toggle-title">Ton stummschalten</span>
          <span class="prefs__toggle-desc">Beruhigende Hintergrundmusik ein- oder ausschalten.</span>
        </span>
      </label>
      <label class="prefs__range" for="freyraum-audio-volume">
        <span class="prefs__range-label">Lautstärke</span>
        <input
          type="range"
          id="freyraum-audio-volume"
          min="0"
          max="100"
          step="1"
          value="${displayPct}"
          aria-valuetext="${displayPct} Prozent"
          style="--volume-pct: ${displayPct}%;"
        />
        <span class="prefs__range-value" id="freyraum-audio-volume-label">${displayPct}%</span>
      </label>
      <p class="prefs__note" role="status" id="freyraum-audio-status" ${this.audioStatusMessage ? '' : 'hidden'}>${this.audioStatusMessage ?? ''}</p>
      <h2 class="prefs__heading">Performance</h2>
      <fieldset class="prefs__group">
        <legend class="prefs__legend">Qualitätsstufe</legend>
        ${qualityOptions}
      </fieldset>
    `;

    // Cache mutable DOM references for in-place patching.
    this.motionInput = this.panel.querySelector<HTMLInputElement>('#freyraum-motion');
    this.contrastInput = this.panel.querySelector<HTMLInputElement>('#freyraum-contrast');
    this.audioMutedInput = this.panel.querySelector<HTMLInputElement>('#freyraum-audio-muted');
    this.audioVolumeInput = this.panel.querySelector<HTMLInputElement>('#freyraum-audio-volume');
    this.audioValueLabel = this.panel.querySelector<HTMLElement>('#freyraum-audio-volume-label');
    this.audioStatusEl = this.panel.querySelector<HTMLElement>('#freyraum-audio-status');

    this.bindPanelEvents();
  }

  // ── Event bindings (called once after buildPanel) ────────────────────────────

  private bindPanelEvents(): void {
    this.motionInput?.addEventListener('change', (e) => {
      this.prefs.setReducedMotion((e.target as HTMLInputElement).checked);
    });

    this.contrastInput?.addEventListener('change', (e) => {
      this.prefs.setContrastMode((e.target as HTMLInputElement).checked ? 'high' : 'auto');
    });

    this.panel.querySelectorAll<HTMLInputElement>('input[name="freyraum-quality"]').forEach((input) => {
      input.addEventListener('change', () => {
        if (input.checked) {
          this.prefs.setQuality(input.value as QualityPresetId);
        }
      });
    });

    this.panel.querySelectorAll<HTMLInputElement>('input[name="freyraum-lighting"]').forEach((input) => {
      input.addEventListener('change', () => {
        if (input.checked) {
          this.prefs.setLighting(input.value as LightProfileId);
        }
      });
    });

    this.audioMutedInput?.addEventListener('change', (e) => {
      this.prefs.setAudioMuted((e.target as HTMLInputElement).checked);
    });

    if (this.audioVolumeInput) {
      const volumeInput = this.audioVolumeInput;

      // Drag-continuity guards: suppress structural re-patches during pointer drag.
      volumeInput.addEventListener('pointerdown', () => { this.isVolumeDragging = true; });
      volumeInput.addEventListener('pointerup', () => { this.isVolumeDragging = false; });
      volumeInput.addEventListener('pointercancel', () => { this.isVolumeDragging = false; });

      // `input` fires on every rAF-rate update during drag (and on keyboard steps).
      // We update the display label immediately for responsive visual feedback and
      // apply the mapped gain directly for audible feedback, but we skip the full
      // patchPanel() re-render while dragging is active.
      volumeInput.addEventListener('input', () => {
        const displayPct = Number(volumeInput.value);
        if (Number.isNaN(displayPct)) return;
        // Live display label update.
        if (this.audioValueLabel) {
          this.audioValueLabel.textContent = `${Math.round(displayPct)}%`;
        }
        // Update track fill CSS variable immediately.
        const roundedDisplayPct = Math.round(displayPct);
        volumeInput.style.setProperty('--volume-pct', `${roundedDisplayPct}%`);
        volumeInput.setAttribute('aria-valuetext', `${roundedDisplayPct} Prozent`);
        // Write gain to preferences (triggers audio immediately; patchPanel is
        // suppressed by isVolumeDragging for pointer events).
        this.prefs.setAudioVolume(displayPercentToGain(displayPct));
      });

      // `change` fires once on pointer-release (and on keyboard confirmation).
      // At this point dragging is already false, so patchPanel() will run when
      // the next preference notification arrives.
      volumeInput.addEventListener('change', () => {
        this.isVolumeDragging = false;
        const displayPct = Number(volumeInput.value);
        if (!Number.isNaN(displayPct)) {
          this.prefs.setAudioVolume(displayPercentToGain(displayPct));
        }
      });
    }
  }

  // ── In-place patch (called on every preference update) ───────────────────────

  private patchPanel(): void {
    const { reducedMotion, contrastMode, quality, lighting, audioMuted, audioVolume } = this.prefs.current;

    if (this.motionInput) this.motionInput.checked = reducedMotion;
    if (this.contrastInput) this.contrastInput.checked = contrastMode === 'high';
    if (this.audioMutedInput) this.audioMutedInput.checked = audioMuted;

    // Do not patch slider value during active pointer drag (Slice B continuity fix).
    if (!this.isVolumeDragging && this.audioVolumeInput && this.audioValueLabel) {
      const displayPct = gainToDisplayPercent(audioVolume);
      this.audioVolumeInput.value = String(displayPct);
      this.audioVolumeInput.style.setProperty('--volume-pct', `${displayPct}%`);
      this.audioVolumeInput.setAttribute('aria-valuetext', `${displayPct} Prozent`);
      this.audioValueLabel.textContent = `${displayPct}%`;
    }

    // Patch audio status message.
    if (this.audioStatusEl) {
      if (this.audioStatusMessage) {
        this.audioStatusEl.textContent = this.audioStatusMessage;
        this.audioStatusEl.removeAttribute('hidden');
      } else {
        this.audioStatusEl.setAttribute('hidden', '');
      }
    }

    // Patch quality radios.
    this.panel.querySelectorAll<HTMLInputElement>('input[name="freyraum-quality"]').forEach((input) => {
      input.checked = input.value === quality;
    });

    // Patch lighting radios.
    this.panel.querySelectorAll<HTMLInputElement>('input[name="freyraum-lighting"]').forEach((input) => {
      input.checked = input.value === lighting;
    });
  }

  setAudioStatusMessage(message: string | null): void {
    this.audioStatusMessage = message;
    // Always apply immediately even during drag (status is not a slider).
    if (this.audioStatusEl) {
      if (message) {
        this.audioStatusEl.textContent = message;
        this.audioStatusEl.removeAttribute('hidden');
      } else {
        this.audioStatusEl.setAttribute('hidden', '');
      }
    }
  }

  private handleToggle = (): void => {
    this.setOpen(!this.isOpen);
  };

  private handleOutsideClick = (event: MouseEvent): void => {
    if (!this.isOpen) return;
    if (this.root.contains(event.target as Node)) return;
    this.setOpen(false);
    // v0.17: return focus to the trigger so keyboard users land on a known
    // control after an outside-click dismiss (previously only Escape did this).
    // WCAG SC 2.4.3 (Focus Order) and APG dialog pattern.
    this.trigger.focus();
  };

  private handleEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.isOpen) {
      this.setOpen(false);
      this.trigger.focus();
    }
  };

  private setOpen(open: boolean): void {
    this.isOpen = open;
    this.trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    this.panel.hidden = !open;
    if (open) {
      this.panel.querySelector<HTMLInputElement>('input')?.focus();
    }
  }

  dispose(): void {
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleEscape);
    this.unsubscribe();
    this.root.remove();
  }
}
