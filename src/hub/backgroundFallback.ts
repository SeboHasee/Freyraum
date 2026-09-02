/**
 * Returns one retry URL for an unavailable room image. Keeping this decision
 * pure makes the 404 path deterministic and independently regression-testable.
 */
const REFERENCE_ONLY_HUB_ASSET_PATHS = new Set(['Backgrounds/museum-target.png']);

function normalizeHubAssetPath(path: string): string {
  return path
    .trim()
    .replace(/^[./]+/, '')
    .replace(/^backgrounds\//i, 'Backgrounds/');
}

export function getBackgroundFallbackCandidate(
  primaryUrl: string,
  fallbackUrl: string,
  fallbackAttempted: boolean
): string | null {
  if (fallbackAttempted || !primaryUrl || !fallbackUrl || primaryUrl === fallbackUrl) return null;
  return fallbackUrl;
}

export function isHubAssetNotFoundStatus(status: number | null): boolean {
  return status === 404;
}

export function isReferenceOnlyHubAssetPath(path: string): boolean {
  if (!path.trim()) return false;
  return REFERENCE_ONLY_HUB_ASSET_PATHS.has(normalizeHubAssetPath(path));
}
