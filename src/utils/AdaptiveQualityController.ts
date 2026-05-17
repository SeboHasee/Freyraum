import type { QualityPresetId } from '../config/quality';
import type { FrameBudgetMonitor, FrameBudgetSample } from './FrameBudgetMonitor';
import { createScopedDiagnostics } from './Diagnostics';

/**
 * Adaptive quality controller for v0.02.
 *
 * Monitors the {@link FrameBudgetMonitor} and, when sustained frame budget
 * overruns are detected outside of cooldown, asks the host application to
 * downgrade the preset by one step (`high → balanced → battery`).
 *
 * Hard rules (audited):
 *  - Never downgrade during the cooldown window after a navigation/preset
 *    change. Texture-upload spikes must not be treated as real load.
 *  - Never override the user's manual choice. The controller exposes
 *    {@link suspendForUserOverride} for when the user changes quality in the
 *    PreferencesPanel.
 *  - Never upgrade automatically. v0.02 intentionally has a one-way
 *    degradation path. Restoring quality is a user-initiated action.
 *  - Stop after reaching `battery`.
 */

export type DowngradeRequestHandler = (next: QualityPresetId) => void;

const DOWNGRADE_PATH: Record<QualityPresetId, QualityPresetId | null> = {
  high: 'balanced',
  balanced: 'battery',
  battery: null,
};

export class AdaptiveQualityController {
  private readonly diagnostics = createScopedDiagnostics('quality');
  private current: QualityPresetId;
  private suspended = false;
  /** Hold-off after a downgrade so the next decision has a clean window. */
  private holdOffUntil = 0;
  private readonly holdOffMs: number;

  constructor(initial: QualityPresetId, holdOffMs = 4000) {
    this.current = initial;
    this.holdOffMs = holdOffMs;
  }

  /** Called once per frame with the latest sample. Returns the next preset to apply, if any. */
  evaluate(sample: FrameBudgetSample, monitor: FrameBudgetMonitor): QualityPresetId | null {
    if (this.suspended) return null;
    if (sample.inCooldown) return null;

    const now = typeof performance !== 'undefined' ? performance.now() : 0;
    if (now < this.holdOffUntil) return null;
    if (!sample.belowBudget) return null;

    const next = DOWNGRADE_PATH[this.current];
    if (!next) return null;

    this.diagnostics.warn('downgrade', 'Adaptive quality controller requested a downgrade', {
      from: this.current,
      to: next,
      rollingMs: Math.round(sample.rollingMs * 10) / 10,
      rollingFps: Math.round(sample.rollingFps * 10) / 10,
      emaMs: Math.round(sample.emaMs * 10) / 10,
    });
    this.current = next;
    this.holdOffUntil = now + this.holdOffMs;
    monitor.markPresetChange();
    return next;
  }

  /** Called by the host when the user manually changes the preset. */
  notifyManualPreset(id: QualityPresetId): void {
    this.current = id;
    // A manual change is the user re-claiming control. Suspend until next session.
    this.suspended = true;
    this.diagnostics.info('manual-override', 'Adaptive quality suspended after manual preset change', { preset: id });
  }

  /** True when the controller has been suspended by a manual override. */
  get isSuspended(): boolean {
    return this.suspended;
  }

  /** Hard override used by tests; not part of the public preference path. */
  suspendForUserOverride(): void {
    this.suspended = true;
  }
}
