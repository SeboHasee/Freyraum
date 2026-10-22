/**
 * v1.46 (B4) — deployed WebP copies of the hub and photo-room photos.
 *
 * `scripts/build-web-images.mjs` appends
 * `window.__FREYRAUM_WEB_BACKGROUNDS = { "Backgrounds/<file>": "./web-images/<name>.webp" }`
 * to the deployed manifest. The copies keep the original pixel size, so wall
 * calibration is unchanged. Visitor views use them; the placement editor and
 * the local `file://` preview keep the original files.
 */
const WEB_BACKGROUND_KEY_PATTERN = /^Backgrounds\/[^/\\]+$/;
const WEB_BACKGROUND_SRC_PATTERN = /^\.\/web-images\/bg-[A-Za-z0-9_-]+-\d+-[0-9a-f]+\.webp$/;

let webBackgrounds: ReadonlyMap<string, string> = new Map();

/** Validates and stores the injected map; invalid entries are dropped. Returns the count. */
export function setWebBackgroundMap(raw: unknown): number {
  const map = new Map<string, string>();
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      if (WEB_BACKGROUND_KEY_PATTERN.test(key) && typeof value === 'string' && WEB_BACKGROUND_SRC_PATTERN.test(value)) {
        map.set(key, value);
      }
    }
  }
  webBackgrounds = map;
  return map.size;
}

/** Deployed WebP URL for a configured background (`Backgrounds/<file>`), or null. */
export function webBackgroundUrl(src: string): string | null {
  const path = webBackgrounds.get(src);
  return path ? `${import.meta.env.BASE_URL}${path.slice(2)}` : null;
}
