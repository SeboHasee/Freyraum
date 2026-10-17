#!/usr/bin/env node
/**
 * FREYRAUM — v1.39 local project store tests (`npm run test:local-project`).
 *
 * Bundles `scripts/local-project/projectStore.ts` with esbuild and drives it
 * against a temporary copy of the project (no browser, no Electron):
 *   - folder check, version fingerprint, stale-version refusal;
 *   - wrong paths, fake images, too-large files, overwrites and symbolic
 *     links leaving the project are refused, and nothing is written then;
 *   - a valid save writes the background, artwork + text file and
 *     museum-hub.json, keeps a history copy, and restore works;
 *   - only the last 10 history copies are kept;
 *   - the importer runs with `--root` and assigns the same artwork ID the
 *     editor chose for the upload.
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..');

async function bundle(entry) {
  const output = buildSync({
    entryPoints: [resolve(ROOT, entry)],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    target: ['node18'],
  });
  return import(`data:text/javascript;base64,${Buffer.from(output.outputFiles[0].text).toString('base64')}`);
}

const store = await bundle('scripts/local-project/projectStore.ts');
const rules = await bundle('src/online/publishRules.ts');

const PNG = Buffer.from('89504e470d0a1a0a0000000d4948445200000001000000010802000000907753de0000000c4944415408d763f8ffff3f0005fe02fea7d6a4ea0000000049454e44ae426082', 'hex');

const TEMP = mkdtempSync(join(tmpdir(), 'freyraum-local-project-'));
const PROJECT = join(TEMP, 'FREYRAUM');
mkdirSync(PROJECT);
cpSync(join(ROOT, 'customer-artworks'), join(PROJECT, 'customer-artworks'), { recursive: true });
if (existsSync(join(ROOT, 'customer-audio'))) cpSync(join(ROOT, 'customer-audio'), join(PROJECT, 'customer-audio'), { recursive: true });
writeFileSync(join(PROJECT, 'package.json'), '{ "name": "freyraum" }\n');
rmSync(join(PROJECT, 'customer-artworks', 'history'), { recursive: true, force: true });

const HUB = join(PROJECT, 'customer-artworks', 'museum-hub.json');
const ORIGINAL_HUB = readFileSync(HUB, 'utf8');
const ORIGINAL_CONFIG = JSON.parse(ORIGINAL_HUB);
// A complete customer project has its background file; the repository may not
// (it is a large customer asset), so the copy gets a small stand-in.
const ORIGINAL_BACKGROUND = join(PROJECT, 'customer-artworks', ...ORIGINAL_CONFIG.background.src.split('/'));
if (!existsSync(ORIGINAL_BACKGROUND)) writeFileSync(ORIGINAL_BACKGROUND, PNG);

function b64(buffer) {
  return Buffer.from(buffer).toString('base64');
}

function snapshot() {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else out.push(`${relative(TEMP, path)}:${statSync(path).size}`);
    }
  };
  walk(TEMP);
  return out.sort().join('\n');
}

function expectError(fn, code, pattern) {
  try {
    fn();
  } catch (error) {
    assert.ok(error instanceof store.ProjectStoreError, `expected ProjectStoreError, got ${error}`);
    assert.equal(error.code, code, `${error.message} ${error.errors?.join(' | ')}`);
    if (pattern) assert.match([error.message, ...error.errors].join('\n'), pattern);
    return error;
  }
  assert.fail(`expected ${code} error`);
}

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  ✓ ${name}`);
}

console.log('local project store');

test('project folder check', () => {
  assert.equal(store.checkProjectFolder(PROJECT).ok, true);
  assert.equal(store.checkProjectFolder(join(TEMP, 'missing')).ok, false);
  const noPackage = join(TEMP, 'no-package');
  mkdirSync(join(noPackage, 'customer-artworks'), { recursive: true });
  assert.match(store.checkProjectFolder(noPackage).reason, /package\.json/);
  rmSync(noPackage, { recursive: true });
  assert.equal(store.checkProjectFolder(ROOT).ok, true);
});

const info = store.readProjectInfo(PROJECT);
test('project info and fingerprint', () => {
  assert.equal(info.version, createHash('sha256').update(readFileSync(HUB)).digest('hex'));
  assert.equal(info.hasMuseumHub, true);
  assert.equal(info.previewStale, true, 'no preview yet → import needed');
});

test('stale version is refused', () => {
  const before = snapshot();
  expectError(() => store.saveToProject(PROJECT, { baseVersion: 'f'.repeat(64), config: ORIGINAL_CONFIG }), 'stale', /Neuere Version vorhanden/);
  expectError(() => store.saveToProject(PROJECT, { baseVersion: null, config: ORIGINAL_CONFIG }), 'stale');
  assert.equal(snapshot(), before);
});

test('wrong paths, fake images, too-large files and overwrites are refused; nothing is written', () => {
  const before = snapshot();
  const cases = [
    [{ path: '../evil.png', contentBase64: b64(PNG) }, /Pfad nicht erlaubt/],
    [{ path: 'customer-artworks/inbox/../../evil.png', contentBase64: b64(PNG) }, /Pfad nicht erlaubt/],
    [{ path: 'src/main.ts', contentBase64: b64('x') }, /Pfad nicht erlaubt/],
    [{ path: 'customer-artworks/museum-hub.json', contentBase64: b64('{}') }, /Pfad nicht erlaubt/],
    [{ path: 'customer-artworks/inbox/fake.png', contentBase64: b64('not an image') }, /kein echtes PNG/],
    [{ path: 'customer-artworks/inbox/huge.png', contentBase64: b64(Buffer.concat([PNG, Buffer.alloc(16 * 1024 * 1024)])) }, /zu groß/],
    [{ path: 'customer-artworks/inbox/fraktal.png', contentBase64: b64(PNG) }, /existiert bereits/],
    [{ path: 'customer-artworks/Backgrounds/museum-empty.png', contentBase64: b64(PNG) }, /existiert bereits/],
  ];
  for (const [file, pattern] of cases) {
    expectError(() => store.saveToProject(PROJECT, { baseVersion: info.version, config: ORIGINAL_CONFIG, files: [file] }), 'invalid', pattern);
  }
  const locked = structuredClone(ORIGINAL_CONFIG);
  locked.camera.verticalFovDeg = 60;
  expectError(() => store.saveToProject(PROJECT, { baseVersion: info.version, config: locked }), 'invalid', /Feste Einstellungen/);
  assert.equal(snapshot(), before);
  assert.equal(readFileSync(HUB, 'utf8'), ORIGINAL_HUB);
});

test('a staging failure removes every temporary file (all-or-nothing)', () => {
  const blocker = join(PROJECT, 'customer-artworks', 'inbox', 'zzz-blocker.png');
  mkdirSync(blocker);
  const before = snapshot();
  const config = structuredClone(ORIGINAL_CONFIG);
  config.slots[2].artworkId = 'zzz-blocker';
  expectError(
    () =>
      store.saveToProject(PROJECT, {
        baseVersion: info.version,
        config,
        files: [
          { path: 'customer-artworks/Backgrounds/zwischenstand.png', contentBase64: b64(PNG) },
          { path: 'customer-artworks/inbox/zzz-blocker.png', contentBase64: b64(PNG) },
        ],
      }),
    'conflict'
  );
  assert.equal(snapshot(), before);
  assert.equal(readFileSync(HUB, 'utf8'), ORIGINAL_HUB);
  rmSync(blocker, { recursive: true });
});

if (process.platform !== 'win32') {
  test('a symbolic link leaving the project is refused', () => {
    const outside = join(TEMP, 'outside');
    mkdirSync(outside);
    const backgrounds = join(PROJECT, 'customer-artworks', 'Backgrounds');
    const moved = join(TEMP, 'backgrounds-original');
    cpSync(backgrounds, moved, { recursive: true });
    rmSync(backgrounds, { recursive: true });
    symlinkSync(outside, backgrounds, 'dir');
    const config = structuredClone(ORIGINAL_CONFIG);
    config.background.src = 'Backgrounds/raus.png';
    expectError(
      () =>
        store.saveToProject(PROJECT, {
          baseVersion: info.version,
          config,
          files: [{ path: 'customer-artworks/Backgrounds/raus.png', contentBase64: b64(PNG) }],
        }),
      'invalid',
      /Pfad nicht erlaubt/
    );
    assert.deepEqual(readdirSync(outside), []);
    rmSync(backgrounds);
    cpSync(moved, backgrounds, { recursive: true });
    rmSync(moved, { recursive: true });
    rmSync(outside, { recursive: true });
  });
}

const uploadId = rules.chooseUploadArtworkId('Mein Bild.png', ['fraktal', 'akt-27']);
let saved;
test('a valid save writes background, artwork, text file and museum-hub.json', () => {
  assert.equal(uploadId, 'mein-bild');
  const config = structuredClone(ORIGINAL_CONFIG);
  config.background = { ...config.background, src: 'Backgrounds/neuer-raum.png', width: 1, height: 1, aspect: 1 };
  config.slots[2].artworkId = uploadId;
  saved = store.saveToProject(
    PROJECT,
    {
      baseVersion: info.version,
      config,
      files: [
        { path: 'customer-artworks/Backgrounds/neuer-raum.png', contentBase64: b64(PNG) },
        { path: `customer-artworks/inbox/${uploadId}.png`, contentBase64: b64(PNG) },
        { path: `customer-artworks/inbox/${uploadId}.txt`, contentBase64: b64(rules.buildArtworkSidecar({ title: 'Mein Bild', credit: 'Test' })) },
      ],
    },
    new Date('2026-10-17T10:00:00.000Z')
  );
  assert.deepEqual(saved.files, [
    'customer-artworks/Backgrounds/neuer-raum.png',
    `customer-artworks/inbox/${uploadId}.png`,
    `customer-artworks/inbox/${uploadId}.txt`,
    'customer-artworks/museum-hub.json',
  ]);
  assert.ok(readFileSync(join(PROJECT, 'customer-artworks', 'Backgrounds', 'neuer-raum.png')).equals(PNG));
  assert.match(readFileSync(join(PROJECT, 'customer-artworks', 'inbox', `${uploadId}.txt`), 'utf8'), /^Title: Mein Bild\nCredit: Test\n/);
  const written = JSON.parse(readFileSync(HUB, 'utf8'));
  assert.equal(written.background.src, 'Backgrounds/neuer-raum.png');
  assert.equal(written.slots[2].artworkId, uploadId);
  assert.equal(saved.version, store.projectVersion(PROJECT));
  assert.equal(saved.backup, 'museum-hub-20261017T100000000Z.json');
  assert.equal(readFileSync(join(PROJECT, 'customer-artworks', 'history', saved.backup), 'utf8'), ORIGINAL_HUB);
  const leftovers = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(join(dir, entry.name));
      else if (entry.name.endsWith('.freyraum-tmp')) leftovers.push(entry.name);
    }
  };
  walk(PROJECT);
  assert.deepEqual(leftovers, []);
});

test('the old version is stale after a save', () => {
  expectError(() => store.saveToProject(PROJECT, { baseVersion: info.version, config: ORIGINAL_CONFIG }), 'stale');
});

test('history lists the current file first and restore works', () => {
  const history = store.listHistory(PROJECT);
  assert.equal(history[0].id, 'current');
  assert.equal(history[0].current, true);
  assert.equal(history[1].id, saved.backup);
  expectError(() => store.restoreFromHistory(PROJECT, '../museum-hub.json', saved.version), 'not-found');
  expectError(() => store.restoreFromHistory(PROJECT, 'museum-hub-20000101T000000000Z.json', saved.version), 'not-found');
  expectError(() => store.restoreFromHistory(PROJECT, saved.backup, info.version), 'stale');
  const restored = store.restoreFromHistory(PROJECT, saved.backup, saved.version, new Date('2026-10-17T10:05:00.000Z'));
  assert.equal(JSON.stringify(JSON.parse(readFileSync(HUB, 'utf8'))), JSON.stringify(ORIGINAL_CONFIG));
  assert.equal(restored.backup, 'museum-hub-20261017T100500000Z.json');
  // Uploaded files stay; only the layout went back.
  assert.ok(existsSync(join(PROJECT, 'customer-artworks', 'inbox', `${uploadId}.png`)));
  // Go forward again to the saved layout for the import check below.
  const forward = store.restoreFromHistory(PROJECT, restored.backup, restored.version, new Date('2026-10-17T10:06:00.000Z'));
  assert.equal(JSON.parse(readFileSync(HUB, 'utf8')).slots[2].artworkId, uploadId);
  saved = forward;
});

test('only the last 10 history copies are kept', () => {
  let version = saved.version;
  for (let index = 0; index < 12; index += 1) {
    const config = JSON.parse(readFileSync(HUB, 'utf8'));
    config.slots[0].placement.horizontalPosition = 0.3 + index * 0.001;
    version = store.saveToProject(PROJECT, { baseVersion: version, config }, new Date(Date.UTC(2026, 9, 17, 11, index))).version;
  }
  const backups = readdirSync(join(PROJECT, 'customer-artworks', 'history'));
  assert.equal(backups.length, store.HISTORY_LIMIT);
  assert.equal(backups.sort()[0], 'museum-hub-20261017T110200000Z.json');
  saved = { ...saved, version };
});

test('a briefly locked file (Windows) is retried; other errors are not', () => {
  const lock = (code) => Object.assign(new Error(code), { code });
  let calls = 0;
  store.renameWithRetry('a', 'b', () => {
    calls += 1;
    if (calls < 3) throw lock('EBUSY');
  });
  assert.equal(calls, 3);
  calls = 0;
  assert.throws(() => store.renameWithRetry('a', 'b', () => {
    calls += 1;
    throw lock('ENOENT');
  }), /ENOENT/);
  assert.equal(calls, 1);
  calls = 0;
  assert.throws(() => store.renameWithRetry('a', 'b', () => {
    calls += 1;
    throw lock('EPERM');
  }), /EPERM/);
  assert.equal(calls, 6);
});

const importResult = await store.runProjectImport(PROJECT, { importerPath: join(ROOT, 'scripts', 'import-artworks.mjs') });
test('the importer runs with --root and keeps the upload ID', () => {
  assert.equal(importResult.ok, true, importResult.output);
  assert.match(importResult.report, /FREYRAUM — Gallery update finished/);
  const previewJs = readFileSync(join(PROJECT, 'customer-preview', 'customer-artworks.js'), 'utf8');
  assert.match(previewJs, new RegExp(`"id": "${uploadId}"`));
  assert.match(previewJs, /"src": "Backgrounds\/neuer-raum\.png"/);
  assert.ok(existsSync(join(PROJECT, 'customer-preview', 'images', `${uploadId}.png`)));
  assert.equal(store.previewNeedsImport(PROJECT), false);
  // The repository itself was not touched.
  assert.ok(!existsSync(join(ROOT, 'customer-artworks', 'inbox', `${uploadId}.png`)));
});

rmSync(TEMP, { recursive: true, force: true });
console.log(`\n${passed} local project store checks passed.`);
