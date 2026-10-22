#!/usr/bin/env node
/**
 * FREYRAUM — v1.38 tests for `scripts/validate-deploy.mjs`
 * (`npm run test:validate-deploy`). Builds disposable fixture projects in a repository-local
 * folder: a valid one, a background with wrong upper/lower case, a missing
 * artwork image, an unknown artwork ID, and a path outside the project.
 */
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MAX_DEPLOY_MANIFEST_BYTES, isSafeRelativePath, validateDeploy } from './validate-deploy.mjs';

const created = [];
const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108020000009077053e', 'hex');

function fixture({ backgrounds = ['Museum_ohne_Bilder.png', 'museum-empty.png'], hub, manifest, previewImages = ['akt-27.png'], inbox = ['Akt 27.png'], deployManifest, webImageFiles = [] }) {
  const root = mkdtempSync(join(dirname(fileURLToPath(import.meta.url)), '.freyraum-validate-'));
  created.push(root);
  const customer = join(root, 'customer-artworks');
  mkdirSync(join(customer, 'Backgrounds'), { recursive: true });
  mkdirSync(join(customer, 'inbox'), { recursive: true });
  mkdirSync(join(root, 'customer-preview', 'images'), { recursive: true });
  for (const name of backgrounds) writeFileSync(join(customer, 'Backgrounds', name), PNG);
  for (const name of inbox) writeFileSync(join(customer, 'inbox', name), PNG);
  for (const name of previewImages) writeFileSync(join(root, 'customer-preview', 'images', name), PNG);
  if (deployManifest !== undefined) {
    mkdirSync(join(root, 'public'), { recursive: true });
    writeFileSync(join(root, 'public', 'customer-artworks.js'), deployManifest);
    mkdirSync(join(root, 'public', 'web-images'), { recursive: true });
    for (const name of webImageFiles) writeFileSync(join(root, 'public', 'web-images', name), PNG);
  }
  writeFileSync(
    join(customer, 'artworks.json'),
    JSON.stringify(manifest ?? [{ id: 'akt-27', image: './images/akt-27.png' }])
  );
  writeFileSync(
    join(customer, 'museum-hub.json'),
    JSON.stringify(
      hub ?? {
        background: { src: 'Backgrounds/Museum_ohne_Bilder.png' },
        backgroundFallback: { src: 'Backgrounds/museum-empty.png' },
        slots: [{ id: 'room-1.front-left', artworkId: 'akt-27' }],
      }
    )
  );
  return root;
}

const cases = [];
function test(name, fn) {
  cases.push({ name, fn });
}

test('valid project passes', () => {
  const result = validateDeploy(fixture({}));
  assert.deepEqual(result.errors, []);
  assert.equal(result.checked.slots, 1);
});

test('primary photograph filename is case-sensitive even with a valid fallback', () => {
  const result = validateDeploy(fixture({ backgrounds: ['museum_ohne_bilder.png', 'museum-empty.png'] }));
  assert.ok(result.errors.some((error) => error.includes('upper/lower case')), result.errors.join('\n'));
});

test('background with wrong upper/lower case fails', () => {
  const result = validateDeploy(
    fixture({
      backgrounds: ['museum-empty.png', 'Saal.png'],
      hub: {
        background: { src: 'Backgrounds/saal.png' },
        backgroundFallback: { src: 'Backgrounds/museum-empty.png' },
        slots: [],
      },
    })
  );
  assert.ok(result.errors.some((error) => error.includes('upper/lower case')), result.errors.join('\n'));
});

test('missing primary background with a valid fallback only warns', () => {
  const result = validateDeploy(
    fixture({
      hub: {
        background: { src: 'Backgrounds/fehlt.png' },
        backgroundFallback: { src: 'Backgrounds/museum-empty.png' },
        slots: [],
      },
    })
  );
  assert.deepEqual(result.errors, []);
  assert.ok(result.warnings.some((warning) => warning.includes('fehlt.png')));
});

test('missing fallback background fails', () => {
  const result = validateDeploy(
    fixture({
      backgrounds: [],
      hub: { background: { src: 'Backgrounds/a.png' }, backgroundFallback: { src: 'Backgrounds/museum-empty.png' }, slots: [] },
    })
  );
  assert.ok(result.errors.some((error) => error.includes('backgroundFallback.src')));
});

test('missing artwork image fails', () => {
  const result = validateDeploy(fixture({ previewImages: [] }));
  assert.ok(result.errors.some((error) => error.includes('missing from customer-preview/images')), result.errors.join('\n'));
});

test('artwork image with wrong upper/lower case fails', () => {
  const result = validateDeploy(fixture({ previewImages: ['Akt-27.png'] }));
  assert.ok(result.errors.some((error) => error.includes('upper/lower case')), result.errors.join('\n'));
});

test('unknown artwork ID fails', () => {
  const result = validateDeploy(
    fixture({
      hub: {
        background: { src: 'Backgrounds/museum-empty.png' },
        backgroundFallback: { src: 'Backgrounds/museum-empty.png' },
        slots: [{ id: 'room-1.front-left', artworkId: 'gibt-es-nicht' }],
      },
    })
  );
  assert.ok(result.errors.some((error) => error.includes('unknown artwork ID "gibt-es-nicht"')));
});

test('paths outside the project fail', () => {
  const result = validateDeploy(
    fixture({
      manifest: [{ id: 'akt-27', image: '../../etc/passwd' }],
      hub: {
        background: { src: 'Backgrounds/../../secret.png' },
        backgroundFallback: { src: 'Backgrounds/museum-empty.png' },
        slots: [],
      },
    })
  );
  assert.ok(result.errors.some((error) => error.includes('not inside images/')));
  assert.ok(result.errors.some((error) => error.includes('background.src')));
  assert.equal(isSafeRelativePath('https://example.com/a.png'), false);
  assert.equal(isSafeRelativePath('/abs.png'), false);
  assert.equal(isSafeRelativePath('Backgrounds/ok.png'), true);
});

const WEB_MAP = 'window.__FREYRAUM_WEB_IMAGES = {"akt-27":[{"src":"./web-images/akt-27-640-abc123.webp","width":640,"height":640}]};\n';

test('deployed manifest with metadata only passes', () => {
  const result = validateDeploy(fixture({
    deployManifest: 'window.__FREYRAUM_ARTWORKS = [{"id":"akt-27","image":"./images/akt-27.png"}];\n' + WEB_MAP,
    webImageFiles: ['akt-27-640-abc123.webp'],
  }));
  assert.deepEqual(result.errors, []);
  assert.ok(!result.warnings.some((warning) => warning.includes('public/customer-artworks.js')));
});

test('deployed manifest without web image variants warns', () => {
  const result = validateDeploy(fixture({
    deployManifest: 'window.__FREYRAUM_ARTWORKS = [{"id":"akt-27","image":"./images/akt-27.png"}];\n',
  }));
  assert.deepEqual(result.errors, []);
  assert.ok(result.warnings.some((warning) => warning.includes('no web image variants')), result.warnings.join('\n'));
});

test('missing web image variant file fails', () => {
  const result = validateDeploy(fixture({
    deployManifest: 'window.__FREYRAUM_ARTWORKS = [{"id":"akt-27","image":"./images/akt-27.png"}];\n' + WEB_MAP,
  }));
  assert.ok(result.errors.some((error) => error.includes('akt-27-640-abc123.webp')), result.errors.join('\n'));
});

test('deployed manifest with embedded image bytes fails', () => {
  const result = validateDeploy(fixture({
    deployManifest: 'window.__FREYRAUM_ARTWORKS = [{"id":"akt-27","webglImage":"data:image/png;base64,iVBORw0KGgo="}];\n',
  }));
  assert.ok(result.errors.some((error) => error.includes('embeds image bytes')), result.errors.join('\n'));
});

test('oversized deployed manifest fails', () => {
  const result = validateDeploy(fixture({
    deployManifest: `window.__FREYRAUM_PAD = "${'x'.repeat(MAX_DEPLOY_MANIFEST_BYTES + 1)}";\n`,
  }));
  assert.ok(result.errors.some((error) => error.includes('public/customer-artworks.js is')), result.errors.join('\n'));
});

test('inbox names that differ only in case fail', () => {
  const result = validateDeploy(fixture({ inbox: ['Akt 27.png', 'akt 27.png'] }));
  // Case-insensitive file systems cannot hold both; skip there.
  if (result.errors.length === 0) return;
  assert.ok(result.errors.some((error) => error.includes('differ only in upper/lower case')));
});

let failed = 0;
for (const { name, fn } of cases) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`not ok - ${name}\n${error.stack}`);
  }
}
for (const dir of created) rmSync(dir, { recursive: true, force: true });
if (failed > 0) process.exit(1);
console.log(`validate:deploy tests passed (${cases.length}).`);
