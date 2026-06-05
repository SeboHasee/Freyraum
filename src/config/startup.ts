/**
 * v0.68 (v0.67 performance plan, Phase 2) — Staged startup readiness config.
 *
 * Single source of truth for the startup-readiness contract and the
 * warm-budget constants. Centralising these here satisfies the v0.67 P-06
 * coding directive: "centralize warm-budget constants in one config object so
 * diagnostics and behavior cannot diverge."
 *
 * Background (code-verified): before this phase, `main.ts` warmed *every*
 * artwork (`fullWarmTargets = warmOrder`) and `GalleryManager.init()` eagerly
 * preloaded *every* PBR set (`FULL_PRELOAD_SAFETY_CAP = MAX_SAFE_INTEGER`)
 * before the entry CTA could be enabled. That strict full-gallery readiness is
 * the dominant startup cost. The quality lock (Phase 1) makes it safe to defer
 * non-entry work to deterministic background lanes without ever changing the
 * user-selected quality preset.
 *
 * Online research synthesised (web.dev INP, Three.js KTX2 guidance, NN/g
 * progressive-loading): enable interaction as soon as the active + near view is
 * ready, then stream the remainder; yield per frame to protect INP; never block
 * the whole app on a full preload.
 */

import type { LayoutTier } from '../utils/device';

/**
 * Startup readiness contract mode (the single P-07 rollout feature flag).
 *
 * - `full`           Legacy behaviour: warm/preload every artwork before the
 *                    entry CTA is enabled. Kept as a one-flag rollback.
 * - `entry-balanced` Default. Warm the active artwork + critical navigation
 *                    window + a bounded near-next subset before entry; defer
 *                    the rest to background lanes.
 * - `entry-minimal`  Warm only the active artwork + its critical-now neighbours
 *                    before entry; defer everything else to background lanes.
 */
export type StartupReadinessMode = 'full' | 'entry-balanced' | 'entry-minimal';

export const DEFAULT_STARTUP_READINESS_MODE: StartupReadinessMode = 'entry-balanced';

/** localStorage key for a persisted override (e.g. set by QA/diagnostics). */
const STORAGE_KEY = 'freyraum:startup-readiness';
/** URL query parameter for a per-load override (e.g. `?startup=full`). */
const QUERY_KEY = 'startup';

/**
 * Centralised warm-budget constants (P-06). Behaviour and diagnostics both read
 * from this object so they cannot drift apart.
 */
export interface WarmBudgetConfig {
  /** Default number of critical artworks GPU-warmed before entry (desktop). */
  defaultPreEntryWarmCount: number;
  /** Default ms ceiling spent warming per post-reveal animation frame. */
  defaultPostRevealFrameBudgetMs: number;
  /** Default max GPU warm renders per post-reveal animation frame. */
  defaultPostRevealBatchCap: number;
}

export const WARM_BUDGET: WarmBudgetConfig = {
  defaultPreEntryWarmCount: 5,
  defaultPostRevealFrameBudgetMs: 8,
  defaultPostRevealBatchCap: 2,
};

function parseMode(value: string | null | undefined): StartupReadinessMode | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (v === 'full' || v === 'strict' || v === 'all') return 'full';
  if (v === 'entry-balanced' || v === 'balanced') return 'entry-balanced';
  if (v === 'entry-minimal' || v === 'minimal') return 'entry-minimal';
  return null;
}

/**
 * Resolve the active startup readiness mode. Precedence: URL query parameter →
 * persisted localStorage value → safe default. Never throws.
 */
export function resolveStartupReadinessMode(): StartupReadinessMode {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = parseMode(params.get(QUERY_KEY));
    if (fromQuery) return fromQuery;
  } catch {
    // Ignore: malformed location must never break startup.
  }
  try {
    const fromStorage = parseMode(localStorage.getItem(STORAGE_KEY));
    if (fromStorage) return fromStorage;
  } catch {
    // Ignore: storage access can throw in private-mode/sandboxed contexts.
  }
  return DEFAULT_STARTUP_READINESS_MODE;
}

function isPhoneTier(tier: LayoutTier): boolean {
  return tier === 'phone-small' || tier === 'phone-portrait' || tier === 'phone-landscape';
}

/**
 * Compute how many artworks must reach full GPU readiness before the entry CTA
 * is enabled, derived from the readiness mode, device tier, critical navigation
 * radius, and total artwork count.
 *
 * - `full`           → every artwork (legacy strict contract).
 * - `entry-minimal`  → the critical navigation window only (center ± radius).
 * - `entry-balanced` → the critical window plus a bounded near-next subset.
 *
 * The result is always clamped to `[1, artworkCount]`.
 */
export function computeEntryTargetCount(
  mode: StartupReadinessMode,
  layoutTier: LayoutTier,
  artworkCount: number,
  criticalRadius: number
): number {
  if (mode === 'full' || artworkCount <= 1) {
    return Math.max(1, artworkCount);
  }
  const radius = Math.max(1, Math.round(criticalRadius));
  // Critical window = center + `radius` neighbours on each side.
  const criticalWindow = radius * 2 + 1;
  if (mode === 'entry-minimal') {
    return clampCount(criticalWindow, artworkCount);
  }
  // entry-balanced: critical window + a small, device-aware near-next subset.
  const nearNextBonus = isPhoneTier(layoutTier) ? 2 : 4;
  return clampCount(criticalWindow + nearNextBonus, artworkCount);
}

function clampCount(value: number, artworkCount: number): number {
  return Math.max(1, Math.min(artworkCount, Math.round(value)));
}
