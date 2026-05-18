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
export function suggestStartupQuality(): QualityPresetId {
  const dpr = typeof window.devicePixelRatio === 'number' && window.devicePixelRatio > 0
    ? window.devicePixelRatio
    : 1;
  const coarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
  const area = window.innerWidth * window.innerHeight;

  const SMALL_PHONE_AREA = 600_000;
  const MEDIUM_DEVICE_AREA = 800_000;

  // High-DPR coarse-pointer phone: battery preset to avoid thermal throttling
  if (coarse && dpr >= 2 && area < SMALL_PHONE_AREA) return 'battery';
  // Other coarse-pointer devices (mid-range phones, older tablets): balanced
  if (coarse && area < MEDIUM_DEVICE_AREA) return 'balanced';
  // Large tablet or desktop — keep default as balanced; user can raise to high.
  return 'balanced';
}
