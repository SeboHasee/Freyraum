/**
 * Returns one retry URL for an unavailable room image. Keeping this decision
 * pure makes the 404 path deterministic and independently regression-testable.
 */
export function getBackgroundFallbackCandidate(
  primaryUrl: string,
  fallbackUrl: string,
  fallbackAttempted: boolean
): string | null {
  if (fallbackAttempted || !primaryUrl || !fallbackUrl || primaryUrl === fallbackUrl) return null;
  return fallbackUrl;
}
