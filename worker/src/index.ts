/**
 * v1.38 — FREYRAUM save service (Cloudflare Worker).
 *
 * Sits between the deployed placement editor (GitHub Pages) and GitHub:
 *   POST /login    shared password → short-lived session token
 *   POST /publish  save package → validated → one commit on `content/edits`
 *                  → pull request (default) or automatic squash merge
 *   GET  /status   pending pull request, merge commit, deploy run
 *   GET  /history  last 10 published versions of museum-hub.json
 *   POST /restore  republish museum-hub.json from an earlier version
 *
 * Secrets (Cloudflare "Variables and Secrets", never in the repository):
 *   EDITOR_PASSWORD, SESSION_SECRET, GITHUB_APP_PRIVATE_KEY
 * Plain variables (wrangler.toml): ALLOWED_ORIGIN, GITHUB_OWNER, GITHUB_REPO,
 *   GITHUB_APP_ID, GITHUB_INSTALLATION_ID, GITHUB_BRANCH, EDITS_BRANCH,
 *   PUBLISH_MODE ("pull-request" | "auto-merge"), SESSION_HOURS.
 * Optional binding: LOGIN_LIMITS (KV) for login limits shared across instances.
 *
 * Setup guide: docs/ONLINE_EDITOR_SETUP.md
 */
import {
  BACKGROUNDS_DIR,
  INBOX_DIR,
  MUSEUM_HUB_PATH,
  validatePublishPackage,
  type PublishPackage,
} from '../../src/online/publishRules';
import { GitHubClient, GitHubError, type FetchLike } from './github';
import { createSessionToken, LoginLimiter, passwordMatches, verifySessionToken, type KvLike } from './session';

export interface Env {
  EDITOR_PASSWORD?: string;
  SESSION_SECRET?: string;
  GITHUB_APP_ID?: string;
  GITHUB_APP_PRIVATE_KEY?: string;
  GITHUB_INSTALLATION_ID?: string;
  GITHUB_OWNER?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
  EDITS_BRANCH?: string;
  ALLOWED_ORIGIN?: string;
  PUBLISH_MODE?: string;
  SESSION_HOURS?: string;
  DEPLOY_WORKFLOW?: string;
  LOGIN_LIMITS?: KvLike;
}

export interface ServiceDeps {
  fetch: FetchLike;
  now: () => number;
  log: (entry: Record<string, unknown>) => void;
}

/** Hard cap on the request body (the package itself is limited to 40 MB of files). */
const MAX_BODY_BYTES = 60 * 1024 * 1024;

class HttpError extends Error {
  constructor(readonly status: number, message: string, readonly extra: Record<string, unknown> = {}) {
    super(message);
  }
}

function allowedOrigins(env: Env): string[] {
  return (env.ALLOWED_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

function json(body: unknown, status: number, origin: string | null, extraHeaders: Record<string, string> = {}): Response {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  };
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function requireConfig(env: Env): Required<Pick<Env, 'EDITOR_PASSWORD' | 'SESSION_SECRET'>> {
  if (!env.EDITOR_PASSWORD || !env.SESSION_SECRET || env.SESSION_SECRET.length < 32) {
    throw new HttpError(503, 'Der Speicherdienst ist noch nicht eingerichtet (Passwort oder SESSION_SECRET fehlt).');
  }
  return { EDITOR_PASSWORD: env.EDITOR_PASSWORD, SESSION_SECRET: env.SESSION_SECRET };
}

function github(env: Env, deps: ServiceDeps): GitHubClient {
  if (!env.GITHUB_APP_ID || !env.GITHUB_APP_PRIVATE_KEY || !env.GITHUB_INSTALLATION_ID || !env.GITHUB_OWNER || !env.GITHUB_REPO) {
    throw new HttpError(503, 'Der Speicherdienst ist noch nicht mit GitHub verbunden.');
  }
  return new GitHubClient({
    owner: env.GITHUB_OWNER,
    repo: env.GITHUB_REPO,
    appId: env.GITHUB_APP_ID,
    privateKey: env.GITHUB_APP_PRIVATE_KEY,
    installationId: env.GITHUB_INSTALLATION_ID,
    fetch: deps.fetch,
    now: deps.now,
  });
}

async function requireSession(request: Request, env: Env, deps: ServiceDeps): Promise<void> {
  const { EDITOR_PASSWORD, SESSION_SECRET } = requireConfig(env);
  const header = request.headers.get('Authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token || !(await verifySessionToken(token, SESSION_SECRET, EDITOR_PASSWORD, deps.now()))) {
    throw new HttpError(401, 'Bitte neu anmelden.');
  }
}

async function readJson(request: Request, limit: number): Promise<unknown> {
  const declared = Number(request.headers.get('Content-Length') ?? '0');
  if (declared > limit) throw new HttpError(413, 'Das Speicherpaket ist zu groß.');
  const text = await request.text();
  if (text.length > limit) throw new HttpError(413, 'Das Speicherpaket ist zu groß.');
  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError(400, 'Die Anfrage ist kein gültiges JSON.');
  }
}

const limiters = new WeakMap<object, LoginLimiter>();
const memoryLimiter = new LoginLimiter(null);

function limiterFor(env: Env): LoginLimiter {
  if (!env.LOGIN_LIMITS) return memoryLimiter;
  let limiter = limiters.get(env.LOGIN_LIMITS);
  if (!limiter) {
    limiter = new LoginLimiter(env.LOGIN_LIMITS);
    limiters.set(env.LOGIN_LIMITS, limiter);
  }
  return limiter;
}

async function handleLogin(request: Request, env: Env, deps: ServiceDeps): Promise<unknown> {
  const { EDITOR_PASSWORD, SESSION_SECRET } = requireConfig(env);
  const client = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const limiter = limiterFor(env);
  const now = deps.now();
  const wait = await limiter.blockedFor(client, now);
  if (wait > 0) {
    throw new HttpError(429, `Zu viele Fehlversuche. Bitte in ${Math.ceil(wait / 60)} Minuten erneut versuchen.`, { retryAfter: wait });
  }
  const body = (await readJson(request, 4096)) as { password?: unknown };
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!(await passwordMatches(password, EDITOR_PASSWORD, SESSION_SECRET))) {
    await limiter.recordFailure(client, now);
    deps.log({ event: 'login-failed', time: new Date(now).toISOString() });
    throw new HttpError(401, 'Das Passwort ist falsch.');
  }
  await limiter.reset(client);
  const hours = Math.min(24, Math.max(1, Number(env.SESSION_HOURS ?? '8') || 8));
  const session = await createSessionToken(SESSION_SECRET, EDITOR_PASSWORD, now, hours);
  return { token: session.token, expiresAt: session.expiresAt, mode: publishMode(env) };
}

function publishMode(env: Env): 'pull-request' | 'auto-merge' {
  return env.PUBLISH_MODE === 'auto-merge' ? 'auto-merge' : 'pull-request';
}

interface PublishOutcome {
  status: 'pending-review' | 'merged';
  commit: string;
  liveCommit: string | null;
  pullRequest: { number: number; url: string };
  files: string[];
}

/** Validates the package and writes it as one commit; shared by /publish and /restore. */
async function publish(
  pkg: unknown,
  env: Env,
  deps: ServiceDeps,
  options: { message: string; checkBase: boolean }
): Promise<PublishOutcome> {
  const gh = github(env, deps);
  const mainBranch = env.GITHUB_BRANCH || 'main';
  const editsBranch = env.EDITS_BRANCH || 'content/edits';
  const mainSha = await gh.branchSha(mainBranch);
  if (!mainSha) throw new HttpError(502, `Branch ${mainBranch} wurde nicht gefunden.`);

  if (options.checkBase) {
    const baseCommit = (pkg as Partial<PublishPackage> | null)?.baseCommit;
    if (typeof baseCommit !== 'string' || !/^[0-9a-f]{40}$/.test(baseCommit)) {
      throw new HttpError(409, 'Version des Editors unbekannt – bitte neu laden.', { code: 'stale' });
    }
    const latestContent = await gh.latestCommitTouching('customer-artworks', mainBranch);
    if (latestContent && !(await gh.contains(baseCommit, latestContent))) {
      throw new HttpError(409, 'Neuere Version vorhanden – bitte neu laden.', { code: 'stale' });
    }
  }

  const openPull = await gh.openPullRequest(editsBranch, mainBranch);
  const editsSha = await gh.branchSha(editsBranch);
  // A publish that still waits for approval is extended, not overwritten, so
  // its uploaded pictures stay in the pull request.
  const parentSha = openPull && editsSha ? editsSha : mainSha;

  const [currentConfigText, backgrounds, inbox] = await Promise.all([
    gh.readText(MUSEUM_HUB_PATH, mainSha),
    gh.listDirectory(BACKGROUNDS_DIR.replace(/\/$/, ''), parentSha),
    gh.listDirectory(INBOX_DIR.replace(/\/$/, ''), parentSha),
  ]);
  let currentConfig: unknown = null;
  try {
    currentConfig = currentConfigText ? JSON.parse(currentConfigText) : null;
  } catch {
    currentConfig = null;
  }
  const validation = validatePublishPackage(pkg, {
    currentConfig,
    existingBackgrounds: backgrounds,
    existingInbox: inbox,
  });
  if (validation.errors.length > 0 || !validation.configText) {
    throw new HttpError(422, 'Das Speicherpaket wurde abgelehnt.', { errors: validation.errors });
  }

  const files = ((pkg as PublishPackage).files ?? []).map((file) => ({
    path: file.path,
    content: file.contentBase64,
    encoding: 'base64' as const,
  }));
  const commitFiles = [{ path: MUSEUM_HUB_PATH, content: validation.configText, encoding: 'utf-8' as const }, ...files];
  const time = new Date(deps.now()).toISOString();
  const commitMessage = `${options.message} (${time})`;
  const commit = await gh.commitFiles(parentSha, commitFiles, commitMessage);
  await gh.setBranch(editsBranch, commit, Boolean(editsSha), !openPull);

  const fileList = commitFiles.map((file) => file.path);
  const body = [
    'Automatisch vom FREYRAUM-Editor erstellt.',
    '',
    `Zeit: ${time}`,
    '',
    'Dateien:',
    ...fileList.map((path) => `- \`${path}\``),
  ].join('\n');
  let pull = openPull;
  if (pull) await gh.comment(pull.number, `Weitere Veröffentlichung: ${commit}\n\n${body}`);
  else pull = await gh.createPullRequest(editsBranch, mainBranch, 'Editor: Änderungen veröffentlichen', body);

  let status: PublishOutcome['status'] = 'pending-review';
  let liveCommit: string | null = null;
  if (publishMode(env) === 'auto-merge') {
    liveCommit = await gh.mergePullRequest(pull.number, commit, `${options.message} (#${pull.number})`);
    status = 'merged';
  }
  deps.log({ event: 'publish', time, commit, pullRequest: pull.html_url, status, liveCommit, files: fileList });
  return { status, commit, liveCommit, pullRequest: { number: pull.number, url: pull.html_url }, files: fileList };
}

async function handleStatus(url: URL, env: Env, deps: ServiceDeps): Promise<unknown> {
  const gh = github(env, deps);
  const mainBranch = env.GITHUB_BRANCH || 'main';
  const editsBranch = env.EDITS_BRANCH || 'content/edits';
  const number = Number(url.searchParams.get('pr') ?? '');
  const commitParam = url.searchParams.get('commit') ?? '';
  const result: Record<string, unknown> = { mode: publishMode(env), mainCommit: await gh.branchSha(mainBranch) };
  const open = await gh.openPullRequest(editsBranch, mainBranch);
  result['pendingPullRequest'] = open ? { number: open.number, url: open.html_url } : null;
  if (Number.isInteger(number) && number > 0) {
    const pull = await gh.pullRequest(number);
    result['pullRequest'] = pull
      ? { number, state: pull.state, merged: pull.merged, mergeCommit: pull.merge_commit_sha, url: pull.html_url }
      : null;
  }
  if (/^[0-9a-f]{40}$/.test(commitParam)) {
    const run = await gh.deployRun(env.DEPLOY_WORKFLOW || 'deploy-pages.yml', commitParam);
    result['deploy'] = run ? { status: run.status, conclusion: run.conclusion, url: run.html_url } : null;
  }
  return result;
}

async function handleHistory(env: Env, deps: ServiceDeps): Promise<unknown> {
  const gh = github(env, deps);
  return { versions: await gh.history(MUSEUM_HUB_PATH, env.GITHUB_BRANCH || 'main', 10) };
}

async function handleRestore(request: Request, env: Env, deps: ServiceDeps): Promise<unknown> {
  const body = (await readJson(request, 4096)) as { sha?: unknown };
  const sha = typeof body?.sha === 'string' ? body.sha : '';
  if (!/^[0-9a-f]{40}$/.test(sha)) throw new HttpError(400, 'Ungültige Version.');
  const gh = github(env, deps);
  const versions = await gh.history(MUSEUM_HUB_PATH, env.GITHUB_BRANCH || 'main', 10);
  if (!versions.some((version) => version.sha === sha)) {
    throw new HttpError(400, 'Nur die letzten 10 veröffentlichten Versionen können wiederhergestellt werden.');
  }
  const text = await gh.readText(MUSEUM_HUB_PATH, sha);
  let config: unknown = null;
  try {
    config = text ? JSON.parse(text) : null;
  } catch {
    config = null;
  }
  if (!config) throw new HttpError(422, 'Diese Version kann nicht gelesen werden.');
  return publish({ baseCommit: null, config, files: [] }, env, deps, {
    message: `Editor: frühere Version ${sha.slice(0, 7)} wiederherstellen`,
    checkBase: false,
  });
}

export async function handleRequest(request: Request, env: Env, deps: ServiceDeps): Promise<Response> {
  const origins = allowedOrigins(env);
  const origin = (request.headers.get('Origin') ?? '').replace(/\/+$/, '');
  // Only our own site may call the service; browsers always send Origin on
  // cross-origin fetches, so a missing or foreign Origin is refused.
  if (!origin || !origins.includes(origin)) {
    return json({ error: 'Zugriff nur von der Galerie-Seite erlaubt.' }, 403, null);
  }
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Max-Age': '600',
        Vary: 'Origin',
      },
    });
  }
  const url = new URL(request.url);
  const route = `${request.method} ${url.pathname.replace(/\/+$/, '') || '/'}`;
  try {
    let body: unknown;
    switch (route) {
      case 'POST /login':
        body = await handleLogin(request, env, deps);
        break;
      case 'POST /publish': {
        await requireSession(request, env, deps);
        const pkg = await readJson(request, MAX_BODY_BYTES);
        const message = typeof (pkg as { message?: unknown })?.message === 'string'
          ? String((pkg as { message: string }).message).replace(/[\r\n]+/g, ' ').slice(0, 100)
          : '';
        body = await publish(pkg, env, deps, { message: `Editor: ${message || 'Änderungen veröffentlicht'}`, checkBase: true });
        break;
      }
      case 'GET /status':
        await requireSession(request, env, deps);
        body = await handleStatus(url, env, deps);
        break;
      case 'GET /history':
        await requireSession(request, env, deps);
        body = await handleHistory(env, deps);
        break;
      case 'POST /restore':
        await requireSession(request, env, deps);
        body = await handleRestore(request, env, deps);
        break;
      default:
        throw new HttpError(404, 'Unbekannte Adresse.');
    }
    return json(body, 200, origin);
  } catch (error) {
    if (error instanceof HttpError) {
      const headers: Record<string, string> = {};
      if (typeof error.extra['retryAfter'] === 'number') headers['Retry-After'] = String(error.extra['retryAfter']);
      return json({ error: error.message, ...error.extra }, error.status, origin, headers);
    }
    deps.log({ event: 'error', route, message: error instanceof Error ? error.message : String(error) });
    if (error instanceof GitHubError) {
      const conflict = error.status === 409 || error.status === 422;
      return json(
        { error: conflict ? 'Neuere Version vorhanden – bitte neu laden.' : 'GitHub hat die Änderung nicht angenommen. Bitte später erneut versuchen.', code: conflict ? 'stale' : 'github' },
        conflict ? 409 : 502,
        origin
      );
    }
    return json({ error: 'Interner Fehler im Speicherdienst.' }, 500, origin);
  }
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env, {
      fetch: (input, init) => fetch(input, init),
      now: () => Date.now(),
      log: (entry) => console.log(JSON.stringify(entry)),
    });
  },
};
