export function getOptimalPixelRatio(): number {
  return Math.min(window.devicePixelRatio, 1.8);
}

export function isMobileDevice(): boolean {
  return window.innerWidth < 768;
}

export function isReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
