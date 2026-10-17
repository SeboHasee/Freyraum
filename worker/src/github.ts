/**
 * v1.38 — Minimal GitHub REST client for the FREYRAUM save service.
 *
 * Authenticates as a GitHub App installation (JWT signed with RS256 via
 * WebCrypto → short-lived installation token). The App needs repository
 * permissions "Contents: read & write" and "Pull requests: read & write";
 * "Actions: read" is optional and only used to show the deploy state.
 */
import { base64UrlEncode } from './session';

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export class GitHubError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

const encoder = new TextEncoder();

function pemBody(pem: string): Uint8Array {
  const base64 = pem.replace(/-----[^-]+-----/g, '').replace(/\\n/g, '').replace(/\s+/g, '');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function derLength(length: number): number[] {
  if (length < 0x80) return [length];
  const bytes: number[] = [];
  let value = length;
  while (value > 0) {
    bytes.unshift(value & 0xff);
    value >>= 8;
  }
  return [0x80 | bytes.length, ...bytes];
}

/**
 * GitHub hands out PKCS#1 keys ("BEGIN RSA PRIVATE KEY"); WebCrypto only
 * imports PKCS#8. Wrap the PKCS#1 structure so no openssl step is needed.
 */
export function privateKeyToPkcs8(pem: string): Uint8Array {
  const body = pemBody(pem);
  if (!/BEGIN RSA PRIVATE KEY/.test(pem)) return body;
  const algorithm = [0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00];
  const octet = [0x04, ...derLength(body.length)];
  const inner = [0x02, 0x01, 0x00, ...algorithm, ...octet];
  const total = inner.length + body.length;
  const out = new Uint8Array(1 + derLength(total).length + total);
  out.set([0x30, ...derLength(total), ...inner]);
  out.set(body, out.length - body.length);
  return out;
}

export async function createAppJwt(appId: string, privateKeyPem: string, nowMs: number): Promise<string> {
  const der = privateKeyToPkcs8(privateKeyPem);
  const key = await crypto.subtle.importKey(
    'pkcs8',
    der.buffer.slice(der.byteOffset, der.byteOffset + der.byteLength) as ArrayBuffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const now = Math.floor(nowMs / 1000);
  const header = base64UrlEncode(encoder.encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' })));
  const payload = base64UrlEncode(encoder.encode(JSON.stringify({ iat: now - 60, exp: now + 540, iss: appId })));
  const signature = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, encoder.encode(`${header}.${payload}`)));
  return `${header}.${payload}.${base64UrlEncode(signature)}`;
}

export interface GitHubConfig {
  owner: string;
  repo: string;
  appId: string;
  privateKey: string;
  installationId: string;
  fetch: FetchLike;
  now: () => number;
}

let cachedToken: { key: string; token: string; expiresAt: number } | null = null;

export class GitHubClient {
  constructor(private readonly config: GitHubConfig) {}

  private async installationToken(): Promise<string> {
    const cacheKey = `${this.config.appId}:${this.config.installationId}`;
    if (cachedToken && cachedToken.key === cacheKey && cachedToken.expiresAt - 5 * 60_000 > this.config.now()) {
      return cachedToken.token;
    }
    const jwt = await createAppJwt(this.config.appId, this.config.privateKey, this.config.now());
    const response = await this.config.fetch(
      `https://api.github.com/app/installations/${encodeURIComponent(this.config.installationId)}/access_tokens`,
      { method: 'POST', headers: this.headers(jwt) }
    );
    if (!response.ok) throw new GitHubError(`GitHub-Anmeldung fehlgeschlagen (${response.status}).`, response.status);
    const body = (await response.json()) as { token: string; expires_at: string };
    cachedToken = { key: cacheKey, token: body.token, expiresAt: Date.parse(body.expires_at) || this.config.now() + 30 * 60_000 };
    return body.token;
  }

  private headers(token: string, accept = 'application/vnd.github+json'): Record<string, string> {
    return {
      Accept: accept,
      Authorization: 'Bearer ' + token,
      'User-Agent': 'freyraum-save-service',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  private repoPath(path: string): string {
    return `https://api.github.com/repos/${encodeURIComponent(this.config.owner)}/${encodeURIComponent(this.config.repo)}${path}`;
  }

  async request<T>(method: string, path: string, body?: unknown, options: { allow404?: boolean; raw?: boolean } = {}): Promise<T | null> {
    const token = await this.installationToken();
    const headers = this.headers(token, options.raw ? 'application/vnd.github.raw+json' : undefined);
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    const response = await this.config.fetch(this.repoPath(path), {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    if (response.status === 404 && options.allow404) return null;
    if (!response.ok) {
      let detail = '';
      try {
        detail = ((await response.json()) as { message?: string }).message ?? '';
      } catch {
        detail = '';
      }
      throw new GitHubError(`GitHub ${method} ${path.split('?')[0]} → ${response.status}${detail ? `: ${detail}` : ''}`, response.status);
    }
    if (options.raw) return (await response.text()) as unknown as T;
    if (response.status === 204) return null;
    return (await response.json()) as T;
  }

  async branchSha(branch: string): Promise<string | null> {
    const ref = await this.request<{ object: { sha: string } }>('GET', `/git/ref/heads/${branchPath(branch)}`, undefined, { allow404: true });
    return ref?.object.sha ?? null;
  }

  async readText(path: string, ref: string): Promise<string | null> {
    return this.request<string>('GET', `/contents/${filePath(path)}?ref=${encodeURIComponent(ref)}`, undefined, { allow404: true, raw: true });
  }

  async listDirectory(path: string, ref: string): Promise<string[]> {
    const entries = await this.request<{ name: string; type: string }[]>(
      'GET',
      `/contents/${filePath(path)}?ref=${encodeURIComponent(ref)}`,
      undefined,
      { allow404: true }
    );
    return Array.isArray(entries) ? entries.filter((entry) => entry.type === 'file').map((entry) => entry.name) : [];
  }

  async latestCommitTouching(path: string, branch: string): Promise<string | null> {
    const commits = await this.request<{ sha: string }[]>(
      'GET',
      `/commits?sha=${encodeURIComponent(branch)}&path=${encodeURIComponent(path)}&per_page=1`
    );
    return commits?.[0]?.sha ?? null;
  }

  /** True when `head` already contains `base` (identical or ahead). */
  async contains(head: string, base: string): Promise<boolean> {
    if (head === base) return true;
    const compare = await this.request<{ status: string }>('GET', `/compare/${base}...${head}`, undefined, { allow404: true });
    return compare?.status === 'identical' || compare?.status === 'ahead';
  }

  async history(path: string, branch: string, count: number): Promise<{ sha: string; date: string; message: string; url: string }[]> {
    const commits = await this.request<{ sha: string; html_url: string; commit: { message: string; committer?: { date?: string }; author?: { date?: string } } }[]>(
      'GET',
      `/commits?sha=${encodeURIComponent(branch)}&path=${encodeURIComponent(path)}&per_page=${count}`
    );
    return (commits ?? []).map((entry) => ({
      sha: entry.sha,
      date: entry.commit.committer?.date ?? entry.commit.author?.date ?? '',
      message: entry.commit.message.split('\n')[0] ?? '',
      url: entry.html_url,
    }));
  }

  /** Writes all files as exactly one commit on top of `parentSha`. */
  async commitFiles(parentSha: string, files: { path: string; content: string; encoding: 'base64' | 'utf-8' }[], message: string): Promise<string> {
    const parent = await this.request<{ tree: { sha: string } }>('GET', `/git/commits/${parentSha}`);
    const tree: { path: string; mode: string; type: string; sha: string }[] = [];
    for (const file of files) {
      const blob = await this.request<{ sha: string }>('POST', '/git/blobs', { content: file.content, encoding: file.encoding });
      tree.push({ path: file.path, mode: '100644', type: 'blob', sha: blob!.sha });
    }
    const newTree = await this.request<{ sha: string }>('POST', '/git/trees', { base_tree: parent!.tree.sha, tree });
    const commit = await this.request<{ sha: string }>('POST', '/git/commits', { message, tree: newTree!.sha, parents: [parentSha] });
    return commit!.sha;
  }

  async setBranch(branch: string, sha: string, exists: boolean, force: boolean): Promise<void> {
    if (exists) await this.request('PATCH', `/git/refs/heads/${branchPath(branch)}`, { sha, force });
    else await this.request('POST', '/git/refs', { ref: `refs/heads/${branch}`, sha });
  }

  async openPullRequest(head: string, base: string): Promise<{ number: number; html_url: string } | null> {
    const pulls = await this.request<{ number: number; html_url: string }[]>(
      'GET',
      `/pulls?state=open&head=${encodeURIComponent(`${this.config.owner}:${head}`)}&base=${encodeURIComponent(base)}`
    );
    return pulls?.[0] ?? null;
  }

  async createPullRequest(head: string, base: string, title: string, body: string): Promise<{ number: number; html_url: string }> {
    const pull = await this.request<{ number: number; html_url: string }>('POST', '/pulls', { title, head, base, body });
    return pull!;
  }

  async comment(issueNumber: number, body: string): Promise<void> {
    await this.request('POST', `/issues/${issueNumber}/comments`, { body });
  }

  async mergePullRequest(number: number, sha: string, title: string): Promise<string> {
    const merged = await this.request<{ sha: string; merged: boolean }>('PUT', `/pulls/${number}/merge`, {
      merge_method: 'squash',
      sha,
      commit_title: title,
    });
    return merged!.sha;
  }

  async pullRequest(number: number): Promise<{ state: string; merged: boolean; merge_commit_sha: string | null; html_url: string } | null> {
    return this.request('GET', `/pulls/${number}`, undefined, { allow404: true });
  }

  /** Latest Pages deploy run for a commit; null without "Actions: read". */
  async deployRun(workflowFile: string, headSha: string): Promise<{ status: string; conclusion: string | null; html_url: string } | null> {
    try {
      const runs = await this.request<{ workflow_runs: { status: string; conclusion: string | null; html_url: string }[] }>(
        'GET',
        `/actions/workflows/${encodeURIComponent(workflowFile)}/runs?head_sha=${encodeURIComponent(headSha)}&per_page=1`,
        undefined,
        { allow404: true }
      );
      return runs?.workflow_runs?.[0] ?? null;
    } catch (error) {
      if (error instanceof GitHubError && error.status === 403) return null;
      throw error;
    }
  }
}

function branchPath(branch: string): string {
  return branch.split('/').map(encodeURIComponent).join('/');
}

function filePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

/** Test hook: forget the cached installation token. */
export function resetGitHubTokenCache(): void {
  cachedToken = null;
}
