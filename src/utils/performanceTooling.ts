/**
 * v0.74 Phase 10 — install the regression-validation tooling on `window`.
 *
 * Exposes the Type B (structural invariants) and Type C (performance / GC /
 * frame-variance) measurement tools as console-accessible globals so a
 * measurement session can be run by hand against a production build, exactly as
 * `plan.md § Phase 10` and `docs/REGRESSION_TOOLING.md` require. The tools are
 * passive and opt-in; installing them costs nothing until they are invoked.
 */

import {
  PerformanceMetrics,
  evaluateTier1PerfThresholds,
  type PerfMetricsReport,
  type PerfThresholdResult,
} from './PerformanceMetrics';
import { runInvariants, type InvariantContext, type InvariantResult } from './RuntimeInvariants';
import { getDiagnostics } from './Diagnostics';

export interface PerformanceToolingApi {
  /** Type C — start a frame/GC/variance sampling session. */
  startPerf(): void;
  /** Type C — stop the session and return the metrics report. */
  stopPerf(): PerfMetricsReport;
  /** Type C — read the current report without stopping. */
  perfReport(): PerfMetricsReport;
  /** Type B — evaluate structural invariants for the current scene state. */
  checkInvariants(): InvariantResult;
  /** Phase 14 — evaluate active Tier 1 thresholds against the latest Type C report. */
  checkTier1Thresholds(report?: PerfMetricsReport): PerfThresholdResult;
}

declare global {
  interface Window {
    __FREYRAUM_PERF_TOOLS__?: PerformanceToolingApi;
  }
}

export function installPerformanceTooling(
  getInvariantContext: () => InvariantContext
): PerformanceMetrics {
  const perf = new PerformanceMetrics();
  const diagnostics = getDiagnostics();

  const api: PerformanceToolingApi = {
    startPerf: () => {
      perf.start();
      diagnostics.info('perf-tools', 'perf-start', 'Performance metrics session started');
    },
    stopPerf: () => {
      const report = perf.stop();
      diagnostics.info('perf-tools', 'perf-stop', 'Performance metrics session stopped', report);
      return report;
    },
    perfReport: () => perf.report(),
    checkInvariants: () => {
      const result = runInvariants(getInvariantContext());
      if (result.violations.length > 0) {
        diagnostics.warn('perf-tools', 'invariant-violation', 'Structural invariant violation(s) detected', result);
      } else {
        diagnostics.info('perf-tools', 'invariant-ok', 'All structural invariants hold', result);
      }
      return result;
    },
    checkTier1Thresholds: (report) => {
      const result = evaluateTier1PerfThresholds(report ?? perf.report());
      if (result.violations.length > 0) {
        diagnostics.warn('perf-tools', 'tier1-threshold-failed', 'Tier 1 performance threshold(s) failed', result);
      } else {
        diagnostics.info('perf-tools', 'tier1-threshold-ok', 'Tier 1 performance thresholds passed', result);
      }
      return result;
    },
  };

  if (typeof window !== 'undefined') {
    window.__FREYRAUM_PERF_TOOLS__ = api;
  }
  return perf;
}
