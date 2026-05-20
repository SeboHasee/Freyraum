/**
 * v0.11 — Device capability model.
 *
 * Replaces the previous viewport-width-only mobile heuristic
 * (`isMobileDevice()`, removed in v0.17 dead-code cleanup) with a
 * capability-based detection that combines media queries, pointer type,
 * and viewport geometry. The result is mirrored to `<html>` data
 * attributes so SCSS can react without re-running JS, and is consumed by:
 *   - `main.ts`               — resize coordinator + UI compact mode
 *   - `HintText.ts`           — coarse-pointer hint copy
 *   - `performance.ts`        — DPR cap + startup quality heuristic
 *   - `CanvasInteraction.ts`  — hover-rotation suppression on touch
 *
 * Online validation sources (WCAG, MDN, Pointer Events L3, Khronos)
 * confirm this approach. See `plan.md` § "Final online validation pass".
 */

export type LayoutTier =
  | 'desktop'
  | 'tablet-landscape'
  | 'tablet-portrait'
  | 'phone-landscape'
  | 'phone-portrait'
  | 'phone-small';

export type PointerPrimary = 'fine' | 'coarse' | 'none';

export type Orientation = 'portrait' | 'landscape';

export interface DeviceCapabilities {
  layoutTier: LayoutTier;
  pointerPrimary: PointerPrimary;
  hasHover: boolean;
  dpr: number;
  orientation: Orientation;
  viewportW: number;
  viewportH: number;
}

/**
 * Sample current viewport + media queries. Cheap; safe to call in a
 * debounced resize handler. Does not subscribe to media-query changes;
 * callers should re-run this on `resize` and reapply.
 */
export function detectDeviceCapabilities(): DeviceCapabilities {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const portrait = h >= w;
  const coarse = matches('(pointer: coarse)');
  const fine = matches('(pointer: fine)');
  const hover = matches('(hover: hover)');
  const dpr = typeof window.devicePixelRatio === 'number' && window.devicePixelRatio > 0
    ? window.devicePixelRatio
    : 1;

  let layoutTier: LayoutTier;
  if (w < 360) layoutTier = 'phone-small';
  else if (w < 600) layoutTier = 'phone-portrait';
  // 600–899px portrait orientation: typical tablet portrait (e.g. 768×1024).
  else if (w < 900 && portrait) layoutTier = 'tablet-portrait';
  // 600–899px landscape: short landscape phone or small landscape tablet.
  else if (w < 900) layoutTier = 'phone-landscape';
  else if (w < 1180) layoutTier = 'tablet-landscape';
  else layoutTier = 'desktop';

  // Additionally treat any short-height viewport (browser chrome
  // visible, foldable, split-screen) as "phone-landscape" for layout
  // purposes when width is in tablet/desktop range but height is tiny.
  // We keep the raw tier above so logs are still useful, but expose a
  // short-height marker via the data attribute set in `applyDeviceCaps`.

  return {
    layoutTier,
    pointerPrimary: coarse ? 'coarse' : fine ? 'fine' : 'none',
    hasHover: hover,
    dpr,
    orientation: portrait ? 'portrait' : 'landscape',
    viewportW: w,
    viewportH: h,
  };
}

/**
 * Mirror device capabilities to `<html>` data attributes so SCSS can
 * react without JS recomputation. Idempotent; safe to call repeatedly.
 *
 * The set of attributes is intentionally small and stable, so it can be
 * read by tests and by the diagnostics overlay.
 */
export function applyDeviceCaps(caps: DeviceCapabilities): void {
  const root = document.documentElement;
  root.dataset['layoutTier'] = caps.layoutTier;
  root.dataset['pointerPrimary'] = caps.pointerPrimary;
  root.dataset['hover'] = caps.hasHover ? 'true' : 'false';
  root.dataset['orientation'] = caps.orientation;
  // Short-height marker (phone landscape, foldable, split-screen)
  root.dataset['shortHeight'] = caps.viewportH < 500 ? 'true' : 'false';
}

function matches(query: string): boolean {
  try {
    return window.matchMedia?.(query)?.matches ?? false;
  } catch {
    return false;
  }
}
