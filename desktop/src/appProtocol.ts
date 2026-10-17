/**
 * v1.39 — `freyraum://app/…` address of the FREYRAUM Editor desktop app.
 *
 * The URL layout mirrors the project folder, so the editor's relative paths
 * work exactly like the `file://` preview:
 *
 *   freyraum://app/customer-preview/placement-editor.html  → app (bundled editor)
 *   freyraum://app/customer-preview/app.html               → app (gallery preview)
 *   freyraum://app/customer-preview/freyraum-gallery.js    → app
 *   freyraum://app/customer-preview/customer-artworks.js   → project (import output)
 *   freyraum://app/customer-preview/images/<file>          → project
 *   freyraum://app/customer-artworks/Backgrounds/<image>   → project
 *
 * Everything else is refused. Pure module (no Electron) so it can be tested
 * with plain Node.
 */
import { extname, join, resolve } from 'node:path';
import { isInside } from '../../scripts/local-project/projectStore';

export const APP_SCHEME = 'freyraum';
export const APP_ORIGIN = `${APP_SCHEME}://app`;
export const EDITOR_URL = `${APP_ORIGIN}/customer-preview/placement-editor.html?hubCalibrate=1&placementEditor=1`;
export const GALLERY_URL = `${APP_ORIGIN}/customer-preview/app.html`;
export const LOADING_URL = `${APP_ORIGIN}/customer-preview/loading.html`;

/** Files the app ships itself (built from the repository's customer-preview). */
export const BUNDLED_EDITOR_FILES = new Set([
  'placement-editor.html',
  'app.html',
  'loading.html',
  'freyraum-gallery.js',
  'style.css',
  'webgpu-probe.js',
]);

const PROJECT_PREVIEW_FILES = new Set(['customer-artworks.js', 'customer-audio.js']);
const PROJECT_PREVIEW_FOLDERS = new Set(['images', 'audio']);
const BACKGROUND_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.m4a': 'audio/mp4',
  '.wav': 'audio/wav',
};

/**
 * Content Security Policy for every page of the app: only the app's own
 * address; no inline scripts, no remote code, no frames, no form posts.
 */
export const APP_CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' data: blob:",
  "connect-src 'self' data: blob:",
  "worker-src 'self' blob:",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
].join('; ');

export interface AppRequestTarget {
  /** Absolute file path to serve. */
  file: string;
  /** Folder the file must stay inside (also after resolving symbolic links). */
  base: string;
  contentType: string;
  source: 'app' | 'project';
}

export interface AppProtocolFolders {
  /** Folder with the bundled editor files. */
  editorDir: string;
  /** Opened project folder, or null before one was chosen. */
  projectRoot: string | null;
}

function safeSegments(pathname: string): string[] | null {
  const raw = pathname.split('/').slice(1);
  const segments: string[] = [];
  for (const part of raw) {
    let decoded: string;
    try {
      decoded = decodeURIComponent(part);
    } catch {
      return null;
    }
    // eslint-disable-next-line no-control-regex
    if (!decoded || decoded === '.' || decoded === '..' || /[/\\:\u0000-\u001f]/.test(decoded)) return null;
    segments.push(decoded);
  }
  return segments;
}

function target(base: string, segments: readonly string[], source: 'app' | 'project'): AppRequestTarget | null {
  const file = resolve(base, ...segments);
  if (!isInside(resolve(base), file)) return null;
  return {
    file,
    base: resolve(base),
    contentType: CONTENT_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
    source,
  };
}

/** Maps an app address to a file, or null when the address is not allowed. */
export function resolveAppRequest(url: string, folders: AppProtocolFolders): AppRequestTarget | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== `${APP_SCHEME}:` || parsed.host !== 'app' || parsed.username || parsed.password) return null;
  const segments = safeSegments(parsed.pathname);
  if (!segments || segments.length < 2) return null;
  const [top, second, third] = segments;

  if (top === 'customer-preview') {
    if (segments.length === 2 && BUNDLED_EDITOR_FILES.has(second!)) return target(folders.editorDir, [second!], 'app');
    if (!folders.projectRoot) return null;
    if (segments.length === 2 && PROJECT_PREVIEW_FILES.has(second!)) {
      return target(join(folders.projectRoot, 'customer-preview'), [second!], 'project');
    }
    if (segments.length === 3 && PROJECT_PREVIEW_FOLDERS.has(second!)) {
      return target(join(folders.projectRoot, 'customer-preview', second!), [third!], 'project');
    }
    return null;
  }
  if (top === 'customer-artworks' && second === 'Backgrounds' && segments.length === 3 && folders.projectRoot) {
    if (!BACKGROUND_EXTENSIONS.has(extname(third!).toLowerCase())) return null;
    return target(join(folders.projectRoot, 'customer-artworks', 'Backgrounds'), [third!], 'project');
  }
  return null;
}

/** True for addresses the app window may show (the app's own pages). */
export function isAppPageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === `${APP_SCHEME}:` && parsed.host === 'app' && parsed.pathname.startsWith('/customer-preview/');
  } catch {
    return false;
  }
}

/** Only ordinary web links may be handed to the system browser. */
export function isExternalWebUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}
