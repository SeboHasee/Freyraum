export function getOptimalPixelRatio(cap = 1.8): number {
  return Math.min(window.devicePixelRatio, cap);
}

export function isMobileDevice(): boolean {
  return window.innerWidth < 768;
}

export function isReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
