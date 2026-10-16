/**
 * v1.38 — Browser client for the FREYRAUM save service (worker/src/index.ts).
 *
 * Online mode is enabled only when the deployed site ships
 * `editor-online.json` with a `saveServiceUrl` (set by the deploy workflow
 * from the FREYRAUM_SAVE_SERVICE_URL repository variable). The file also
 * carries the commit the page was built from: the editor sends it as
 * `baseCommit` (conflict check) and polls it to see when a publish is live.
 *
 * The session token lives in sessionStorage (closed tab = signed out). A
 * token instead of a cookie because the service runs on another address than
 * GitHub Pages, and browsers increasingly block third-party cookies.
 */
import type { PublishPackage } from '../../online/publishRules';

export interface OnlineSettings {
  commit: string | null;
  builtAt: string | null;
  saveServiceUrl: string | null;
}

export type PublishMode = 'pull-request' | 'auto-merge';

export interface PublishResult {
  status: 'pending-review' | 'merged';
  commit: string;
  liveCommit: string | null;
  pullRequest: { number: number; url: string };
  files: string[];
}

export interface ServiceStatus {
  mode: PublishMode;
  mainCommit: string | null;
  pendingPullRequest: { number: number; url: string } | null;
  pullRequest?: { number: number; state: string; merged: boolean; mergeCommit: string | null; url: string } | null;
  deploy?: { status: string; conclusion: string | null; url: string } | null;
}

export interface HistoryVersion {
  sha: string;
  date: string;
  message: string;
  url: string;
}

export class ServiceError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string | null = null,
    readonly errors: readonly string[] = []
  ) {
    super(message);
  }
}

const SESSION_KEY = 'freyraum.editorSession';

function siteUrl(path: string): string {
  return new URL(`${import.meta.env.BASE_URL}${path}`, window.location.href).href;
}

/** Reads `editor-online.json`; null on file:// or when the file is missing. */
export async function loadOnlineSettings(fetchImpl: typeof fetch = fetch): Promise<OnlineSettings | null> {
  if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') return null;
  try {
    const response = await fetchImpl(siteUrl('editor-online.json'), { cache: 'no-store' });
    if (!response.ok) return null;
    const body = (await response.json()) as Partial<OnlineSettings>;
    const url = typeof body.saveServiceUrl === 'string' && /^https?:\/\//.test(body.saveServiceUrl)
      ? body.saveServiceUrl.replace(/\/+$/, '')
      : null;
    return {
      commit: typeof body.commit === 'string' && /^[0-9a-f]{40}$/.test(body.commit) ? body.commit : null,
      builtAt: typeof body.builtAt === 'string' ? body.builtAt : null,
      saveServiceUrl: url,
    };
  } catch {
    return null;
  }
}

/**
 * Re-downloads the files that carry the gallery state so the following page
 * reload does not show a cached old version (GitHub Pages caches ~10 min).
 */
export async function refreshCachedSiteFiles(fetchImpl: typeof fetch = fetch): Promise<void> {
  await Promise.all(
    ['customer-artworks.js', 'customer-audio.js', 'placement-editor.html', 'app.html', 'index.html'].map((path) =>
      fetchImpl(siteUrl(path), { cache: 'reload' }).catch(() => undefined)
    )
  );
}

interface StoredSession {
  token: string;
  expiresAt: string;
  mode: PublishMode;
}

export class SaveServiceClient {
  private session: StoredSession | null = null;

  private readonly fetchImpl: typeof fetch;

  constructor(readonly serviceUrl: string, fetchImpl?: typeof fetch) {
    // Unbound `window.fetch` throws "Illegal invocation" when called as a method.
    this.fetchImpl = fetchImpl ?? ((input, init) => fetch(input, init));
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      const stored = raw ? (JSON.parse(raw) as StoredSession) : null;
      if (stored && typeof stored.token === 'string' && Date.parse(stored.expiresAt) > Date.now()) this.session = stored;
    } catch {
      this.session = null;
    }
  }

  get loggedIn(): boolean {
    return Boolean(this.session && Date.parse(this.session.expiresAt) > Date.now());
  }

  get mode(): PublishMode {
    return this.session?.mode ?? 'pull-request';
  }

  logout(): void {
    this.session = null;
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Storage may be unavailable (private mode); the in-memory state is cleared anyway.
    }
  }

  async login(password: string): Promise<void> {
    const body = await this.request<StoredSession>('POST', '/login', { password }, false);
    this.session = { token: body.token, expiresAt: body.expiresAt, mode: body.mode === 'auto-merge' ? 'auto-merge' : 'pull-request' };
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(this.session));
    } catch {
      // Keep the session in memory only.
    }
  }

  /** Sends the package with upload progress (fetch has no upload progress events). */
  publish(pkg: PublishPackage, onUploadProgress: (fraction: number) => void): Promise<PublishResult> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${this.serviceUrl}/publish`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      if (this.session) xhr.setRequestHeader('Authorization', 'Bearer ' + this.session.token);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) onUploadProgress(event.loaded / event.total);
      };
      xhr.upload.onload = () => onUploadProgress(1);
      xhr.onerror = () => reject(new ServiceError('Keine Verbindung zum Speicherdienst.', 0));
      xhr.onload = () => {
        let body: Record<string, unknown> = {};
        try {
          body = JSON.parse(xhr.responseText || '{}') as Record<string, unknown>;
        } catch {
          body = {};
        }
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(body as unknown as PublishResult);
          return;
        }
        if (xhr.status === 401) this.logout();
        reject(this.errorFrom(xhr.status, body));
      };
      xhr.send(JSON.stringify(pkg));
    });
  }

  status(query: { pr?: number; commit?: string } = {}): Promise<ServiceStatus> {
    const params = new URLSearchParams();
    if (query.pr) params.set('pr', String(query.pr));
    if (query.commit) params.set('commit', query.commit);
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return this.request<ServiceStatus>('GET', `/status${suffix}`);
  }

  async history(): Promise<HistoryVersion[]> {
    return (await this.request<{ versions: HistoryVersion[] }>('GET', '/history')).versions;
  }

  restore(sha: string): Promise<PublishResult> {
    return this.request<PublishResult>('POST', '/restore', { sha });
  }

  private errorFrom(status: number, body: Record<string, unknown>): ServiceError {
    const message = typeof body['error'] === 'string' ? body['error'] : `Speicherdienst-Fehler (${status}).`;
    const errors = Array.isArray(body['errors']) ? body['errors'].filter((entry): entry is string => typeof entry === 'string') : [];
    return new ServiceError(message, status, typeof body['code'] === 'string' ? body['code'] : null, errors);
  }

  private async request<T>(method: string, path: string, body?: unknown, auth = true): Promise<T> {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (auth && this.session) headers['Authorization'] = 'Bearer ' + this.session.token;
    let response: Response;
    try {
      response = await this.fetchImpl(`${this.serviceUrl}${path}`, {
        method,
        headers,
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
    } catch {
      throw new ServiceError('Keine Verbindung zum Speicherdienst.', 0);
    }
    let parsed: Record<string, unknown> = {};
    try {
      parsed = (await response.json()) as Record<string, unknown>;
    } catch {
      parsed = {};
    }
    if (!response.ok) {
      if (response.status === 401 && auth) this.logout();
      throw this.errorFrom(response.status, parsed);
    }
    return parsed as T;
  }
}

/** Polls the deployed version stamp until it reports `commit`. */
export async function waitForLiveCommit(
  commit: string,
  options: { intervalMs?: number; timeoutMs?: number; isCancelled?: () => boolean; fetchImpl?: typeof fetch } = {}
): Promise<boolean> {
  const interval = options.intervalMs ?? 10_000;
  const deadline = Date.now() + (options.timeoutMs ?? 15 * 60_000);
  while (Date.now() < deadline) {
    if (options.isCancelled?.()) return false;
    const settings = await loadOnlineSettings(options.fetchImpl);
    if (settings?.commit === commit) return true;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  return false;
}
