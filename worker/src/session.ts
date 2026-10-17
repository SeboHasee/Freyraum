/**
 * v1.38 — Session tokens, password check, and login rate limiting for the
 * FREYRAUM save service. WebCrypto only (Cloudflare Workers and Node 20+).
 */

export interface KvLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

const encoder = new TextEncoder();

export function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]!);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64UrlDecode(text: string): Uint8Array {
  const padded = text.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (text.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

async function hmac(secret: string, message: string): Promise<Uint8Array> {
  const key = await hmacKey(secret);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
}

export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) diff |= a[index]! ^ b[index]!;
  return diff === 0;
}

/** Compares passwords via HMAC digests so timing does not leak the length or prefix. */
export async function passwordMatches(candidate: string, expected: string, secret: string): Promise<boolean> {
  if (!expected) return false;
  const [a, b] = await Promise.all([hmac(secret, `pw:${candidate}`), hmac(secret, `pw:${expected}`)]);
  return constantTimeEqual(a, b);
}

/**
 * Tokens are signed with the session secret *and* the password, so changing
 * the password signs everybody out.
 */
function tokenSecret(sessionSecret: string, password: string): string {
  return `${sessionSecret}\u0000${password}`;
}

export async function createSessionToken(
  sessionSecret: string,
  password: string,
  nowMs: number,
  lifetimeHours: number
): Promise<{ token: string; expiresAt: string }> {
  const nonce = new Uint8Array(12);
  crypto.getRandomValues(nonce);
  const exp = Math.floor(nowMs / 1000) + Math.round(lifetimeHours * 3600);
  const payload = base64UrlEncode(encoder.encode(JSON.stringify({ v: 1, exp, n: base64UrlEncode(nonce) })));
  const signature = base64UrlEncode(await hmac(tokenSecret(sessionSecret, password), payload));
  return { token: `${payload}.${signature}`, expiresAt: new Date(exp * 1000).toISOString() };
}

export async function verifySessionToken(
  token: string,
  sessionSecret: string,
  password: string,
  nowMs: number
): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return false;
  try {
    const expected = await hmac(tokenSecret(sessionSecret, password), parts[0]);
    if (!constantTimeEqual(expected, base64UrlDecode(parts[1]))) return false;
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[0]))) as { v?: number; exp?: number };
    return payload.v === 1 && typeof payload.exp === 'number' && payload.exp * 1000 > nowMs;
  } catch {
    return false;
  }
}

export const LOGIN_MAX_FAILURES = 5;
export const LOGIN_WINDOW_SECONDS = 15 * 60;

interface AttemptRecord {
  failures: number;
  resetAt: number;
}

/**
 * Failed-login limiter. Uses the optional `LOGIN_LIMITS` KV namespace when
 * bound (shared across Worker instances); otherwise an in-memory map per
 * instance, which still slows down guessing from one client.
 */
export class LoginLimiter {
  private readonly memory = new Map<string, AttemptRecord>();

  constructor(private readonly kv: KvLike | null) {}

  private async read(key: string, nowMs: number): Promise<AttemptRecord> {
    let record: AttemptRecord | null = null;
    if (this.kv) {
      try {
        const raw = await this.kv.get(`login:${key}`);
        record = raw ? (JSON.parse(raw) as AttemptRecord) : null;
      } catch {
        record = null;
      }
    } else {
      record = this.memory.get(key) ?? null;
    }
    if (!record || record.resetAt <= nowMs) return { failures: 0, resetAt: nowMs + LOGIN_WINDOW_SECONDS * 1000 };
    return record;
  }

  private async write(key: string, record: AttemptRecord): Promise<void> {
    if (this.kv) {
      await this.kv.put(`login:${key}`, JSON.stringify(record), { expirationTtl: LOGIN_WINDOW_SECONDS });
      return;
    }
    if (this.memory.size > 10_000) this.memory.clear();
    this.memory.set(key, record);
  }

  /** Seconds to wait before another attempt is allowed, or 0. */
  async blockedFor(key: string, nowMs: number): Promise<number> {
    const record = await this.read(key, nowMs);
    return record.failures >= LOGIN_MAX_FAILURES ? Math.max(1, Math.ceil((record.resetAt - nowMs) / 1000)) : 0;
  }

  async recordFailure(key: string, nowMs: number): Promise<void> {
    const record = await this.read(key, nowMs);
    await this.write(key, { failures: record.failures + 1, resetAt: record.resetAt });
  }

  async reset(key: string): Promise<void> {
    if (this.kv) await this.kv.put(`login:${key}`, JSON.stringify({ failures: 0, resetAt: 0 }), { expirationTtl: 60 });
    else this.memory.delete(key);
  }
}
