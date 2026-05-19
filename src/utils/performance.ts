import type { QualityPresetId } from '../config/quality';

/**
 * v0.11: mobile-aware DPR cap. On coarse-pointer devices we clamp the
 * effective pixel ratio to at most 1.5 regardless of the requested cap,
 * because high-DPR phones/tablets multiply fragment shading cost very
 * quickly and tend to thermally throttle. The visual quality difference
 * between 1.5× and 2.0× on a small handheld screen is negligible.
 *
 * On fine-pointer devices (desktops, laptops) the original cap applies.
 */
export function getOptimalPixelRatio(cap = 1.8): number {
  const dpr = typeof window.devicePixelRatio === 'number' && window.devicePixelRatio > 0
    ? window.devicePixelRatio
    : 1;
  const coarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
  const effectiveCap = coarse ? Math.min(cap, 1.5) : cap;
  return Math.min(dpr, effectiveCap);
}

/**
 * v0.11 — deprecated viewport-width-only mobile check.
 *
 * Kept for backwards compatibility with callers that have not migrated
 * to `detectDeviceCapabilities()` in `src/utils/device.ts`. New code
 * should use `pointerPrimary === 'coarse'` (capability-based) instead
 * of this function (viewport-only). See `plan.md` § "Bug 4".
 *
 * @deprecated Use `detectDeviceCapabilities()` from `./device.ts`.
 */
export function isMobileDevice(): boolean {
  return window.innerWidth < 768;
}

export function isReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * v0.11 — startup quality heuristic for first-run users on phones.
 *
 * Returns a sensible default `QualityPresetId` based on viewport area
 * and pointer type. Only consulted when no preference has been stored
 * yet; once the user picks a quality, that choice is respected and this
 * heuristic is not re-applied.
 *
 * Thresholds (chosen empirically; documented for reviewers):
 *  - 600_000 px² ≈ 775×775 viewport — typical small phone portrait
 *    (e.g. iPhone SE 375×667 = 250,125; iPhone 13 390×844 = 329,160)
 *  - 800_000 px² ≈ 894×894 viewport — medium phone or low-end tablet
 */
/**
 * v0.16 — progressive capability hints from the browser.
 *
 * `navigator.deviceMemory` (Device Memory API) and
 * `navigator.hardwareConcurrency` (HTML Living Standard) are both
 * optional/quantised: the values are rounded for privacy and may be
 * absent on Safari. We therefore treat them as *hints*, not gates:
 *
 *   - missing or unknown → no decision is made (heuristic stays neutral),
 *   - very low values (≤ 0.5 GB / 2 logical cores) → suggest 'battery',
 *   - moderate values combined with coarse-pointer + small viewport →
 *     suggest 'battery',
 *   - everything else → pass through to the prior viewport-area heuristic.
 *
 * Online validation:
 *   - https://developer.mozilla.org/docs/Web/API/Navigator/deviceMemory
 *   - https://developer.mozilla.org/docs/Web/API/Navigator/hardwareConcurrency
 */
interface NavigatorWithHints {
  readonly deviceMemory?: number;
  readonly hardwareConcurrency?: number;
}

/** Threshold in GB below which we recommend the battery preset. */
const LOW_MEMORY_GB = 0.5;
/** Threshold of logical CPU cores below which we recommend the battery preset. */
const LOW_CORE_COUNT = 2;

export function suggestStartupQuality(): QualityPresetId {
  const dpr = typeof window.devicePixelRatio === 'number' && window.devicePixelRatio > 0
    ? window.devicePixelRatio
    : 1;
  const coarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
  const area = window.innerWidth * window.innerHeight;

  const SMALL_PHONE_AREA = 600_000;
  const MEDIUM_DEVICE_AREA = 800_000;

  // v0.16 — capability hints. The Device Memory API rounds to the
  // nearest 0.25 / 0.5 / 1 / 2 / 4 / 8 GB and is absent on Safari and
  // Firefox, so we only use it when it is present *and* reports a value
  // we trust as low (≤ 0.5 GB). The hardware concurrency value is
  // similarly quantised but available on every modern browser.
  const nav = navigator as NavigatorWithHints;
  const reportedMemory = typeof nav.deviceMemory === 'number' ? nav.deviceMemory : undefined;
  const reportedCores = typeof nav.hardwareConcurrency === 'number'
    ? nav.hardwareConcurrency
    : undefined;

  // Very weak device — always battery, regardless of pointer/viewport.
  if (reportedMemory !== undefined && reportedMemory <= LOW_MEMORY_GB) return 'battery';
  if (reportedCores !== undefined && reportedCores <= LOW_CORE_COUNT) return 'battery';

  // High-DPR coarse-pointer phone: battery preset to avoid thermal throttling
  if (coarse && dpr >= 2 && area < SMALL_PHONE_AREA) return 'battery';
  // Other coarse-pointer devices (mid-range phones, older tablets): balanced
  if (coarse && area < MEDIUM_DEVICE_AREA) return 'balanced';
  // Large tablet or desktop — keep default as balanced; user can raise to high.
  return 'balanced';
}
