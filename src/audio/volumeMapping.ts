/**
 * Volume display ↔ effective-gain mapping utilities.
 *
 * ## Rationale (v0.20.2 / v0.20.3)
 *
 * Human loudness perception is not linear. A linear slider labelled "50%"
 * that maps directly to 0.50 gain sounds too loud for ambient background
 * music. The requested startup profile is: show "50%" on the slider while
 * the effective audio gain is calm (~15% of maximum).
 *
 * ## Mapping contract
 *
 * We use a power-curve: `gain = (displayPercent / 100) ^ POWER`
 *
 * The constant POWER is chosen so that the midpoint (50%) maps to the
 * requested calm baseline (~15% effective gain):
 *
 *   0.5 ^ POWER = 0.15  →  POWER = log(0.15) / log(0.5) ≈ 2.74
 *
 * Key points:
 *   displayPercent=0    → gain=0.000  (silence)
 *   displayPercent=25   → gain=0.024  (very quiet)
 *   displayPercent=50   → gain=0.152  (calm ambient baseline)
 *   displayPercent=75   → gain=0.441  (moderate)
 *   displayPercent=100  → gain=1.000  (maximum)
 *
 * ## Source of truth
 *
 * `PreferencesStore` persists the effective gain (0..1) as `audioVolume`.
 * Both UI sliders (main-page AudioControls and PreferencesPanel) display
 * the mapped percent and write back via `displayPercentToGain()`.
 *
 * ## Migration
 *
 * Legacy stored values that fall outside [0..1] are clamped before the
 * inverse mapping is applied. The store already enforces this clamp, so
 * no additional migration code is needed here.
 *
 * Sources:
 *   https://www.dr-lex.be/info-stuff/volumecontrols.html
 *   https://webaudio.github.io/web-audio-api/#dom-audioparam-value
 */

/**
 * Power exponent for the display↔gain curve.
 * Chosen so that 50% display maps to ~15% effective gain.
 */
const POWER = 2.74;

/**
 * Convert a display percentage (0–100) to an effective gain (0–1).
 *
 * Use this when writing a slider value back to preferences:
 *   `prefs.setAudioVolume(displayPercentToGain(sliderValue))`
 */
export function displayPercentToGain(percent: number): number {
  const clamped = Math.max(0, Math.min(100, percent));
  if (clamped <= 0) return 0;
  if (clamped >= 100) return 1;
  return Math.pow(clamped / 100, POWER);
}

/**
 * Convert an effective gain (0–1) to the displayed slider percentage (0–100).
 *
 * Use this when rendering a stored gain value onto a slider:
 *   `slider.value = String(gainToDisplayPercent(prefs.current.audioVolume))`
 */
export function gainToDisplayPercent(gain: number): number {
  const clamped = Math.max(0, Math.min(1, gain));
  if (clamped <= 0) return 0;
  if (clamped >= 1) return 100;
  return Math.round(100 * Math.pow(clamped, 1 / POWER));
}

/**
 * The default calm-startup effective gain.
 * Corresponds to `displayPercentToGain(50)` — slider shows 50%, gain is calm.
 */
export const DEFAULT_AUDIO_GAIN = displayPercentToGain(50);
