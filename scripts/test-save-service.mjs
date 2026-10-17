#!/usr/bin/env node
/**
 * FREYRAUM — v1.38 save-service tests (`npm run test:save-service`).
 *
 * Bundles `worker/src/index.ts` with esbuild and drives `handleRequest`
 * against an in-memory fake GitHub (git data, contents, pulls, merge).
 * The fake token endpoint verifies the GitHub App JWT signature with a
 * freshly generated RSA key, so the PKCS#1 → PKCS#8 path is covered too.
 */
import assert from 'node:assert/strict';
import { createHash, createVerify, generateKeyPairSync } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..');

const bundle = buildSync({
  entryPoints: [resolve(ROOT, 'worker/src/index.ts')],
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  write: false,
  target: ['es2022'],
});
const worker = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);

const ORIGIN = 'https://sebohasee.github.io';
const SERVICE = 'https://save.example.workers.dev';
const PASSWORD = 'richtiges-passwort';
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const PRIVATE_PEM = privateKey.export({ type: 'pkcs1', format: 'pem' }).toString();

const PNG = Buffer.from('89504e470d0a1a0a0000000d4948445200000001000000010802000000907753de0000000c4944415408d763f8ffff3f0005fe02fea7d6a4ea0000000049454e44ae426082', 'hex');
const JPEG = Buffer.from('ffd8ffe000104a46494600010100000100010000ffd9', 'hex');
const SHIPPING_CONFIG = JSON.parse(readFileSync(resolve(ROOT, 'customer-artworks/museum-hub.json'), 'utf8'));

function sha(text) {
  return createHash('sha1').update(text).digest('hex');
}

/** In-memory GitHub with just the endpoints the save service uses. */
class FakeGitHub {
  constructor() {
    this.blobs = new Map();
    this.trees = new Map();
    this.commits = new Map();
    this.refs = new Map();
    this.pulls = [];
    this.createdCommits = [];
    this.comments = [];
    this.requests = [];
    const files = new Map([
      ['customer-artworks/museum-hub.json', Buffer.from(`${JSON.stringify(SHIPPING_CONFIG, null, 2)}\n`)],
      ['customer-artworks/Backgrounds/museum-empty.png', PNG],
      ['customer-artworks/inbox/Akt 27.png', PNG],
      ['customer-artworks/inbox/Akt 27.txt', Buffer.from('Title: Akt 27\n')],
      ['customer-artworks/inbox/Fraktal.png', PNG],
      ['src/main.ts', Buffer.from('// code\n')],
    ]);
    const tree = this.storeTree(files);
    const root = this.storeCommit({ tree, parents: [], message: 'initial' });
    this.refs.set('main', root);
  }

  storeTree(files) {
    const id = `tree-${sha([...files.entries()].map(([path, content]) => `${path}:${sha(content)}`).sort().join('|'))}`;
    this.trees.set(id, files);
    return id;
  }

  storeCommit(commit) {
    const id = sha(`${commit.tree}:${commit.parents.join(',')}:${commit.message}:${this.commits.size}`);
    this.commits.set(id, commit);
    return id;
  }

  filesAt(commitSha) {
    return this.trees.get(this.commits.get(commitSha).tree);
  }

  commitNewContent(branch, path, content, message) {
    const parent = this.refs.get(branch);
    const files = new Map(this.filesAt(parent));
    files.set(path, Buffer.from(content));
    const id = this.storeCommit({ tree: this.storeTree(files), parents: [parent], message });
    this.refs.set(branch, id);
    return id;
  }

  ancestors(commitSha) {
    const out = [];
    let current = commitSha;
    while (current) {
      out.push(current);
      current = this.commits.get(current)?.parents[0];
    }
    return out;
  }

  touches(commitSha, prefix) {
    const commit = this.commits.get(commitSha);
    const files = this.trees.get(commit.tree);
    const parentFiles = commit.parents[0] ? this.filesAt(commit.parents[0]) : new Map();
    const keys = new Set([...files.keys(), ...parentFiles.keys()]);
    return [...keys].some((key) => (key === prefix || key.startsWith(`${prefix}/`)) && !Buffer.from(files.get(key) ?? '').equals(Buffer.from(parentFiles.get(key) ?? '')));
  }

  json(body, status = 200) {
    return new Response(body === null ? null : JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  }

  async fetch(input, init = {}) {
    const url = new URL(input);
    const method = init.method ?? 'GET';
    const body = init.body ? JSON.parse(init.body) : undefined;
    const headers = init.headers ?? {};
    this.requests.push(`${method} ${url.pathname}`);
    if (url.pathname.startsWith('/app/installations/')) {
      const jwt = headers.Authorization.replace('Bearer ', '');
      const [h, p, s] = jwt.split('.');
      const verifier = createVerify('RSA-SHA256');
      verifier.update(`${h}.${p}`);
      assert.ok(verifier.verify(publicKey, Buffer.from(s, 'base64url')), 'JWT signature must verify');
      assert.equal(JSON.parse(Buffer.from(p, 'base64url').toString()).iss, '12345');
      return this.json({ token: 'installation-token', expires_at: new Date(Date.now() + 3600_000).toISOString() }, 201);
    }
    assert.equal(headers.Authorization, 'Bearer ' + 'installation-token');
    const prefix = '/repos/SeboHasee/Freyraum';
    assert.ok(url.pathname.startsWith(prefix), url.pathname);
    const path = decodeURIComponent(url.pathname.slice(prefix.length));
    let match;
    if (method === 'GET' && (match = /^\/git\/ref\/heads\/(.+)$/.exec(path))) {
      const ref = this.refs.get(match[1]);
      return ref ? this.json({ object: { sha: ref } }) : this.json({ message: 'Not Found' }, 404);
    }
    if (method === 'GET' && path === '/commits') {
      const head = this.refs.get(url.searchParams.get('sha'));
      const filter = url.searchParams.get('path');
      const limit = Number(url.searchParams.get('per_page'));
      const list = this.ancestors(head).filter((id) => this.touches(id, filter)).slice(0, limit);
      return this.json(list.map((id) => ({ sha: id, html_url: `https://github.com/c/${id}`, commit: { message: this.commits.get(id).message, committer: { date: '2026-10-16T00:00:00Z' } } })));
    }
    if (method === 'GET' && (match = /^\/compare\/([0-9a-f]+)\.\.\.([0-9a-f]+)$/.exec(path))) {
      const [, base, head] = match;
      if (base === head) return this.json({ status: 'identical' });
      return this.json({ status: this.ancestors(head).includes(base) ? 'ahead' : 'diverged' });
    }
    if (method === 'GET' && (match = /^\/contents\/(.+)$/.exec(path))) {
      const files = this.filesAt(this.commits.has(url.searchParams.get('ref')) ? url.searchParams.get('ref') : this.refs.get(url.searchParams.get('ref')));
      const target = match[1];
      if (files.has(target)) return new Response(files.get(target), { status: 200 });
      const entries = [...files.keys()].filter((key) => key.startsWith(`${target}/`) && !key.slice(target.length + 1).includes('/'));
      if (entries.length === 0) return this.json({ message: 'Not Found' }, 404);
      return this.json(entries.map((key) => ({ name: key.slice(target.length + 1), type: 'file' })));
    }
    if (method === 'GET' && (match = /^\/git\/commits\/([0-9a-f]+)$/.exec(path))) {
      return this.json({ tree: { sha: this.commits.get(match[1]).tree } });
    }
    if (method === 'POST' && path === '/git/blobs') {
      const content = body.encoding === 'base64' ? Buffer.from(body.content, 'base64') : Buffer.from(body.content, 'utf8');
      const id = `blob-${sha(content)}`;
      this.blobs.set(id, content);
      return this.json({ sha: id }, 201);
    }
    if (method === 'POST' && path === '/git/trees') {
      const files = new Map(this.trees.get(body.base_tree));
      for (const entry of body.tree) files.set(entry.path, this.blobs.get(entry.sha));
      return this.json({ sha: this.storeTree(files) }, 201);
    }
    if (method === 'POST' && path === '/git/commits') {
      const id = this.storeCommit({ tree: body.tree, parents: body.parents, message: body.message });
      this.createdCommits.push(id);
      return this.json({ sha: id }, 201);
    }
    if (method === 'PATCH' && (match = /^\/git\/refs\/heads\/(.+)$/.exec(path))) {
      const current = this.refs.get(match[1]);
      if (!body.force && current && !this.ancestors(body.sha).includes(current)) return this.json({ message: 'not fast forward' }, 422);
      this.refs.set(match[1], body.sha);
      return this.json({ object: { sha: body.sha } });
    }
    if (method === 'POST' && path === '/git/refs') {
      this.refs.set(body.ref.replace('refs/heads/', ''), body.sha);
      return this.json({ object: { sha: body.sha } }, 201);
    }
    if (method === 'GET' && path === '/pulls') {
      const head = url.searchParams.get('head').split(':')[1];
      return this.json(this.pulls.filter((pull) => pull.state === 'open' && pull.head === head));
    }
    if (method === 'POST' && path === '/pulls') {
      const pull = { number: this.pulls.length + 1, html_url: `https://github.com/pull/${this.pulls.length + 1}`, head: body.head, base: body.base, state: 'open', merged: false, merge_commit_sha: null, title: body.title };
      this.pulls.push(pull);
      return this.json(pull, 201);
    }
    if (method === 'POST' && (match = /^\/issues\/(\d+)\/comments$/.exec(path))) {
      this.comments.push({ number: Number(match[1]), body: body.body });
      return this.json({}, 201);
    }
    if (method === 'PUT' && (match = /^\/pulls\/(\d+)\/merge$/.exec(path))) {
      const pull = this.pulls.find((entry) => entry.number === Number(match[1]));
      const headSha = this.refs.get(pull.head);
      assert.equal(body.sha, headSha, 'merge must pin the published commit');
      const id = this.storeCommit({ tree: this.commits.get(headSha).tree, parents: [this.refs.get(pull.base)], message: body.commit_title });
      this.refs.set(pull.base, id);
      Object.assign(pull, { state: 'closed', merged: true, merge_commit_sha: id });
      return this.json({ sha: id, merged: true });
    }
    if (method === 'GET' && (match = /^\/pulls\/(\d+)$/.exec(path))) {
      const pull = this.pulls.find((entry) => entry.number === Number(match[1]));
      return pull ? this.json(pull) : this.json({ message: 'Not Found' }, 404);
    }
    if (method === 'GET' && path.startsWith('/actions/workflows/')) {
      return this.json({ message: 'Resource not accessible by integration' }, 403);
    }
    throw new Error(`Fake GitHub: unexpected ${method} ${path}`);
  }
}

function setup(overrides = {}) {
  const github = new FakeGitHub();
  const logs = [];
  const kvStore = new Map();
  const env = {
    EDITOR_PASSWORD: PASSWORD,
    SESSION_SECRET: 'x'.repeat(48),
    GITHUB_APP_ID: '12345',
    GITHUB_APP_PRIVATE_KEY: PRIVATE_PEM,
    GITHUB_INSTALLATION_ID: '777',
    GITHUB_OWNER: 'SeboHasee',
    GITHUB_REPO: 'Freyraum',
    ALLOWED_ORIGIN: ORIGIN,
    PUBLISH_MODE: 'pull-request',
    LOGIN_LIMITS: {
      async get(key) { return kvStore.get(key) ?? null; },
      async put(key, value) { kvStore.set(key, value); },
    },
    ...overrides,
  };
  const deps = { fetch: (input, init) => github.fetch(input, init), now: () => Date.now(), log: (entry) => logs.push(entry) };
  const call = async (method, path, { body, token, origin = ORIGIN, ip = '203.0.113.1' } = {}) => {
    const headers = { 'CF-Connecting-IP': ip };
    if (origin) headers.Origin = origin;
    if (token) headers.Authorization = 'Bearer ' + token;
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    const response = await worker.handleRequest(
      new Request(`${SERVICE}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }),
      env,
      deps
    );
    const text = await response.text();
    return { status: response.status, body: text ? JSON.parse(text) : null, headers: response.headers };
  };
  const login = async () => {
    const response = await call('POST', '/login', { body: { password: PASSWORD } });
    assert.equal(response.status, 200, JSON.stringify(response.body));
    return response.body.token;
  };
  return { github, env, call, login, logs };
}

function editedConfig(mutate = () => {}) {
  const config = structuredClone(SHIPPING_CONFIG);
  mutate(config);
  return config;
}

function b64(buffer) {
  return Buffer.from(buffer).toString('base64');
}

const cases = [];
const test = (name, fn) => cases.push({ name, fn });

test('requests from another site are refused', async () => {
  const { call } = setup();
  assert.equal((await call('POST', '/login', { body: { password: PASSWORD }, origin: 'https://evil.example' })).status, 403);
  assert.equal((await call('POST', '/login', { body: { password: PASSWORD }, origin: null })).status, 403);
  const preflight = await call('OPTIONS', '/publish');
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), ORIGIN);
});

test('wrong password is refused and limited after 5 attempts', async () => {
  const { call } = setup();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await call('POST', '/login', { body: { password: 'falsch' } });
    assert.equal(response.status, 401);
  }
  const limited = await call('POST', '/login', { body: { password: PASSWORD } });
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('Retry-After')) > 0);
  const otherClient = await call('POST', '/login', { body: { password: PASSWORD }, ip: '198.51.100.7' });
  assert.equal(otherClient.status, 200);
});

test('publishing needs a valid session token', async () => {
  const { call, login, github } = setup();
  assert.equal((await call('POST', '/publish', { body: {} })).status, 401);
  const token = await login();
  const [payload] = token.split('.');
  assert.equal((await call('POST', '/publish', { body: {}, token: `${payload}.AAAA` })).status, 401);
  const status = await call('GET', '/status', { token });
  assert.equal(status.status, 200);
  assert.equal(status.body.mainCommit, github.refs.get('main'));
});

test('changing the password signs everybody out', async () => {
  const { call, login, env } = setup();
  const token = await login();
  env.EDITOR_PASSWORD = 'neues-passwort';
  assert.equal((await call('GET', '/status', { token })).status, 401);
});

test('valid package → exactly one commit with the expected files and a pull request', async () => {
  const { call, login, github, logs } = setup();
  const token = await login();
  const mainBefore = github.refs.get('main');
  const config = editedConfig((cfg) => {
    cfg.background.src = 'Backgrounds/saal-neu.png';
    const empty = cfg.slots.find((slot) => !slot.artworkId) ?? cfg.slots[0];
    empty.artworkId = 'sonnenaufgang';
  });
  const response = await call('POST', '/publish', {
    token,
    body: {
      baseCommit: mainBefore,
      message: 'Neues Bild',
      config,
      files: [
        { path: 'customer-artworks/Backgrounds/saal-neu.png', contentBase64: b64(PNG) },
        { path: 'customer-artworks/inbox/sonnenaufgang.jpg', contentBase64: b64(JPEG) },
        { path: 'customer-artworks/inbox/sonnenaufgang.txt', contentBase64: b64('Title: Sonnenaufgang\nCredit: Maria\n') },
      ],
    },
  });
  assert.equal(response.status, 200, JSON.stringify(response.body));
  assert.equal(response.body.status, 'pending-review');
  assert.equal(github.createdCommits.length, 1, 'exactly one commit');
  const commit = github.commits.get(response.body.commit);
  assert.deepEqual(commit.parents, [mainBefore]);
  assert.equal(github.refs.get('content/edits'), response.body.commit);
  assert.equal(github.refs.get('main'), mainBefore, 'main unchanged in pull-request mode');
  const files = github.filesAt(response.body.commit);
  assert.deepEqual(JSON.parse(files.get('customer-artworks/museum-hub.json').toString()), config);
  assert.ok(files.get('customer-artworks/inbox/sonnenaufgang.jpg').equals(JPEG_CHECK));
  assert.ok(files.has('customer-artworks/Backgrounds/saal-neu.png'));
  assert.equal(files.get('customer-artworks/inbox/sonnenaufgang.txt').toString(), 'Title: Sonnenaufgang\nCredit: Maria\n');
  assert.equal(github.pulls.length, 1);
  assert.deepEqual(response.body.files.sort(), [
    'customer-artworks/Backgrounds/saal-neu.png',
    'customer-artworks/inbox/sonnenaufgang.jpg',
    'customer-artworks/inbox/sonnenaufgang.txt',
    'customer-artworks/museum-hub.json',
  ]);
  assert.ok(logs.some((entry) => entry.event === 'publish' && entry.commit === response.body.commit));

  // A second publish while the first waits for approval stacks on the branch.
  const second = await call('POST', '/publish', { token, body: { baseCommit: mainBefore, config: editedConfig(), files: [] } });
  assert.equal(second.status, 200, JSON.stringify(second.body));
  assert.deepEqual(github.commits.get(second.body.commit).parents, [response.body.commit]);
  assert.equal(github.pulls.length, 1, 'no second pull request');
  assert.equal(github.comments.length, 1);
  assert.ok(github.filesAt(second.body.commit).has('customer-artworks/inbox/sonnenaufgang.jpg'), 'earlier upload kept');
});
const JPEG_CHECK = JPEG;

async function expectRejected(body, pattern) {
  const { call, login, github } = setup();
  const token = await login();
  const response = await call('POST', '/publish', { token, body: { baseCommit: github.refs.get('main'), config: editedConfig(), files: [], ...body } });
  assert.notEqual(response.status, 200, `expected refusal for ${pattern}`);
  const text = JSON.stringify(response.body);
  assert.ok(pattern.test(text), `${pattern} not in ${text}`);
  assert.equal(github.createdCommits.length, 0, 'no commit on refusal');
  return response;
}

test('wrong paths are refused', async () => {
  await expectRejected({ files: [{ path: 'src/main.ts', contentBase64: b64('x') }] }, /Pfad nicht erlaubt/);
  await expectRejected({ files: [{ path: 'customer-artworks/inbox/../../src/a.png', contentBase64: b64(PNG) }] }, /Pfad nicht erlaubt/);
  await expectRejected({ files: [{ path: 'customer-artworks/museum-hub.json', contentBase64: b64('{}') }] }, /Pfad nicht erlaubt/);
  await expectRejected({ files: [{ path: 'customer-artworks/inbox/Gross.png', contentBase64: b64(PNG) }] }, /klein geschrieben/);
});

test('fake image types are refused', async () => {
  await expectRejected({ files: [{ path: 'customer-artworks/inbox/fake.png', contentBase64: b64('<script>alert(1)</script>') }] }, /kein echtes PNG/);
  await expectRejected({ files: [{ path: 'customer-artworks/inbox/fake.png', contentBase64: b64(JPEG) }] }, /kein echtes PNG/);
});

test('files that are too large are refused', async () => {
  const big = Buffer.alloc(16 * 1024 * 1024, 0);
  PNG.copy(big);
  await expectRejected({ files: [{ path: 'customer-artworks/inbox/riesig.png', contentBase64: b64(big) }] }, /zu groß/);
});

test('changed fixed fields are refused', async () => {
  await expectRejected({ config: editedConfig((cfg) => { cfg.camera.verticalFovDeg += 7; }) }, /Feste Einstellungen/);
  await expectRejected({ config: editedConfig((cfg) => { cfg.walls = cfg.walls.slice(1); }) }, /Feste Einstellungen/);
});

test('unknown artwork IDs and existing names are refused', async () => {
  await expectRejected({ config: editedConfig((cfg) => { cfg.slots[0].artworkId = 'gibt-es-nicht'; }) }, /Unbekanntes Bild/);
  await expectRejected({ files: [{ path: 'customer-artworks/inbox/fraktal.png', contentBase64: b64(PNG) }] }, /existiert bereits/);
});

test('a stale editor version is refused', async () => {
  const { call, login, github } = setup();
  const token = await login();
  const opened = github.refs.get('main');
  github.commitNewContent('main', 'customer-artworks/museum-hub.json', `${JSON.stringify(SHIPPING_CONFIG)}\n`, 'other change');
  const response = await call('POST', '/publish', { token, body: { baseCommit: opened, config: editedConfig(), files: [] } });
  assert.equal(response.status, 409);
  assert.match(response.body.error, /Neuere Version vorhanden/);
  assert.equal(github.createdCommits.length, 0);
  // Code-only commits after opening do not count as a conflict.
  const { call: call2, login: login2, github: gh2 } = setup();
  const token2 = await login2();
  const opened2 = gh2.refs.get('main');
  gh2.commitNewContent('main', 'src/main.ts', '// changed\n', 'code change');
  const ok = await call2('POST', '/publish', { token: token2, body: { baseCommit: opened2, config: editedConfig(), files: [] } });
  assert.equal(ok.status, 200, JSON.stringify(ok.body));
});

test('auto-merge mode merges the pull request', async () => {
  const { call, login, github } = setup({ PUBLISH_MODE: 'auto-merge' });
  const token = await login();
  const response = await call('POST', '/publish', { token, body: { baseCommit: github.refs.get('main'), config: editedConfig(), files: [] } });
  assert.equal(response.status, 200, JSON.stringify(response.body));
  assert.equal(response.body.status, 'merged');
  assert.equal(github.refs.get('main'), response.body.liveCommit);
  const status = await call('GET', `/status?pr=${response.body.pullRequest.number}&commit=${response.body.liveCommit}`, { token });
  assert.equal(status.body.pullRequest.merged, true);
  assert.equal(status.body.deploy, null, 'deploy state is optional without Actions permission');
});

test('history lists versions and restore republishes an earlier one', async () => {
  const { call, login, github } = setup({ PUBLISH_MODE: 'auto-merge' });
  const token = await login();
  const first = github.refs.get('main');
  const changed = editedConfig((cfg) => { cfg.slots[0].artworkId = 'akt-27'; cfg.slots[1].artworkId = 'fraktal'; });
  const published = await call('POST', '/publish', { token, body: { baseCommit: first, config: changed, files: [] } });
  assert.equal(published.status, 200, JSON.stringify(published.body));
  const history = await call('GET', '/history', { token });
  assert.equal(history.status, 200);
  assert.ok(history.body.versions.length >= 2);
  assert.equal(history.body.versions[0].sha, published.body.liveCommit);
  const restore = await call('POST', '/restore', { token, body: { sha: first } });
  assert.equal(restore.status, 200, JSON.stringify(restore.body));
  const restored = JSON.parse(github.filesAt(github.refs.get('main')).get('customer-artworks/museum-hub.json').toString());
  assert.deepEqual(restored, SHIPPING_CONFIG);
  const invalid = await call('POST', '/restore', { token, body: { sha: 'f'.repeat(40) } });
  assert.equal(invalid.status, 400);
});

test('editor naming rules match the importer', async () => {
  const rulesBundle = buildSync({
    entryPoints: [resolve(ROOT, 'src/online/publishRules.ts')],
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    write: false,
  });
  const rules = await import(`data:text/javascript;base64,${Buffer.from(rulesBundle.outputFiles[0].text).toString('base64')}`);
  const inbox = readdirSync(resolve(ROOT, 'customer-artworks/inbox'));
  const manifestPath = resolve(ROOT, 'customer-artworks/artworks.json');
  if (existsSync(manifestPath)) {
    const manifestIds = JSON.parse(readFileSync(manifestPath, 'utf8')).map((entry) => entry.id);
    assert.deepEqual(rules.importerArtworkIds(inbox), manifestIds);
  }
  assert.deepEqual(rules.importerArtworkIds(['Bild.png', 'bild.jpg', 'Bild 10.png', 'Bild 2.png']), ['bild-2', 'bild-10', 'bild', 'bild-3']);
  const id = rules.chooseUploadArtworkId('Akt 27.JPG', ['akt-27', 'fraktal']);
  assert.notEqual(id, 'akt-27');
  assert.equal(rules.normalizeArtworkId(id), id);
  assert.ok(rules.importerArtworkIds([...inbox, `${id}.jpg`]).includes(id));
  assert.equal(rules.chooseUploadArtworkId('Sonnen Aufgang!.png', ['akt-27']), 'sonnen-aufgang');
  assert.equal(rules.safeUploadFileName('Mein Saal (Neu).PNG', 'png'), 'mein-saal-neu.png');
  assert.equal(rules.uniqueFileName('saal.png', ['Saal.png']), 'saal-2.png');
  assert.match(rules.buildArtworkSidecar({ title: 'A\nB', credit: 'Maria' }), /^Title: A B\nCredit: Maria\n$/);
});

test('missing configuration reports 503 instead of crashing', async () => {
  const { call } = setup({ EDITOR_PASSWORD: '' });
  assert.equal((await call('POST', '/login', { body: { password: '' } })).status, 503);
});

let failed = 0;
for (const { name, fn } of cases) {
  try {
    await fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`not ok - ${name}\n${error.stack}`);
  }
}
if (failed > 0) process.exit(1);
console.log(`save-service tests passed (${cases.length}).`);
