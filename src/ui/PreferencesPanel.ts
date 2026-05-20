import type { QualityPresetId, QualityPreset } from '../config/quality';
import { QUALITY_PRESETS } from '../config/quality';
import type { LightProfileId, LightProfile } from '../lighting/LightProfile';
import { LIGHT_PROFILES } from '../lighting/LightProfile';
import type { PreferencesStore } from '../utils/preferences';

/**
 * Floating preferences panel: motion, contrast, and quality presets.
 * Implemented as a popover-style menu that opens from a trigger button
 * so it never blocks the artwork at rest. All controls are real form
 * controls so screen readers describe them natively.
 */

export class PreferencesPanel {
  private readonly root: HTMLElement;
  private readonly trigger: HTMLButtonElement;
  private readonly panel: HTMLElement;
  private isOpen = false;
  private readonly unsubscribe: () => void;
  private audioStatusMessage: string | null = null;

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
    this.trigger.title = 'Einstellungen';
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
    // v0.17: aria-labelledby points to the static heading id added in renderPanel(),
    // replacing the previous aria-label so screen readers announce the dialog title
    // correctly (WCAG 4.1.2, ARIA dialog role requirements).
    this.panel.setAttribute('aria-labelledby', 'freyraum-prefs-heading');
    // v0.17: aria-modal=true tells assistive technology that background content is
    // inert while this panel is open. Required for WCAG 2.1.2 and 2.4.3 compliance
    // with custom role=dialog implementations.
    // Source: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
    this.panel.setAttribute('aria-modal', 'true');
    this.panel.hidden = true;

    this.renderPanel();

    this.root.append(this.trigger, this.panel);
    container.appendChild(this.root);

    document.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('keydown', this.handleEscape);

    this.unsubscribe = this.prefs.subscribe(() => this.renderPanel());
  }

  private renderPanel(): void {
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
          value="${Math.round(audioVolume * 100)}"
        />
        <span class="prefs__range-value">${Math.round(audioVolume * 100)}%</span>
      </label>
      ${
        this.audioStatusMessage
          ? `<p class="prefs__note" role="status">${this.audioStatusMessage}</p>`
          : ''
      }
      <h2 class="prefs__heading">Performance</h2>
      <fieldset class="prefs__group">
        <legend class="prefs__legend">Qualitätsstufe</legend>
        ${qualityOptions}
      </fieldset>
    `;

    this.panel.querySelector<HTMLInputElement>('#freyraum-motion')?.addEventListener('change', (e) => {
      this.prefs.setReducedMotion((e.target as HTMLInputElement).checked);
    });

    this.panel.querySelector<HTMLInputElement>('#freyraum-contrast')?.addEventListener('change', (e) => {
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

    this.panel.querySelector<HTMLInputElement>('#freyraum-audio-muted')?.addEventListener('change', (e) => {
      this.prefs.setAudioMuted((e.target as HTMLInputElement).checked);
    });

    const volumeInput = this.panel.querySelector<HTMLInputElement>('#freyraum-audio-volume');
    const volumeValue = this.panel.querySelector<HTMLElement>('.prefs__range-value');
    volumeInput?.addEventListener('input', (e) => {
      const value = Number((e.target as HTMLInputElement).value);
      if (Number.isNaN(value)) return;
      this.prefs.setAudioVolume(value / 100);
      if (volumeValue) volumeValue.textContent = `${Math.round(value)}%`;
    });
  }

  setAudioStatusMessage(message: string | null): void {
    this.audioStatusMessage = message;
    this.renderPanel();
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
