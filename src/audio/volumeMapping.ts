/** Requested effective-gain ceiling for UI 100%. */
export const MAX_EFFECTIVE_AUDIO_GAIN = 0.3;

/**
 * Convert a display percentage (0–100) to an effective gain (0–1).
 *
 * Use this when writing a slider value back to preferences:
 *   `prefs.setAudioVolume(displayPercentToGain(sliderValue))`
 */
export function displayPercentToGain(percent: number): number {
  const clamped = Math.max(0, Math.min(100, percent));
  return (clamped / 100) * MAX_EFFECTIVE_AUDIO_GAIN;
}

/**
 * Convert an effective gain (0–1) to the displayed slider percentage (0–100).
 *
 * Use this when rendering a stored gain value onto a slider:
 *   `slider.value = String(gainToDisplayPercent(prefs.current.audioVolume))`
 */
export function gainToDisplayPercent(gain: number): number {
  const clamped = Math.max(0, Math.min(MAX_EFFECTIVE_AUDIO_GAIN, gain));
  if (clamped <= 0) return 0;
  return Math.round((clamped / MAX_EFFECTIVE_AUDIO_GAIN) * 100);
}

/**
 * The default calm-startup effective gain.
 * Corresponds to `displayPercentToGain(50)` — slider shows 50%, gain is calm.
 */
export const DEFAULT_AUDIO_GAIN = displayPercentToGain(50);
