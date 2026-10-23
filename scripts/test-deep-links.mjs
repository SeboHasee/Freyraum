import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const result = buildSync({
  entryPoints: [resolve(ROOT, 'src/navigation/deepLink.ts')],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  write: false,
  target: ['es2020'],
});
const { readArtworkDeepLink, buildArtworkDeepLinkSearch } = await import(
  `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`
);

const known = new Set(['fraktal', 'akt-27']);

assert.deepEqual(readArtworkDeepLink('?artwork=fraktal', known), { artworkId: 'fraktal', openGallery: false });
assert.deepEqual(readArtworkDeepLink('?artwork=Fraktal&view=gallery', known), { artworkId: 'fraktal', openGallery: true });
assert.deepEqual(readArtworkDeepLink('?artwork=unknown&view=gallery', known), { artworkId: null, openGallery: false },
  'unknown IDs are ignored');
assert.deepEqual(readArtworkDeepLink('?artwork=%3Cscript%3E', known), { artworkId: null, openGallery: false },
  'IDs outside the importer alphabet are ignored');
assert.deepEqual(readArtworkDeepLink('?view=gallery', known), { artworkId: null, openGallery: false },
  'view=gallery alone does not open anything');
assert.deepEqual(readArtworkDeepLink('', known), { artworkId: null, openGallery: false });

assert.equal(buildArtworkDeepLinkSearch('', 'fraktal', false), '?artwork=fraktal');
assert.equal(buildArtworkDeepLinkSearch('?debug=info', 'akt-27', true), '?debug=info&artwork=akt-27&view=gallery',
  'unrelated parameters are kept');
assert.equal(buildArtworkDeepLinkSearch('?artwork=fraktal&view=gallery', 'fraktal', false), '?artwork=fraktal',
  'leaving the gallery drops view=gallery');
assert.equal(buildArtworkDeepLinkSearch('?artwork=fraktal&view=gallery&debug=1', null, true), '?debug=1');
assert.equal(buildArtworkDeepLinkSearch('', 'bad id', true), '', 'invalid IDs are never written');

// Share button: system share sheet first, clipboard fallback, never throws.
{
  const share = buildSync({
    entryPoints: [resolve(ROOT, 'src/ui/shareLink.ts')],
    bundle: true, format: 'esm', platform: 'browser', write: false, target: ['es2020'],
  });
  const { shareLink, shareLinkFeedback } = await import(
    `data:text/javascript;base64,${Buffer.from(share.outputFiles[0].text).toString('base64')}`
  );
  const withNavigator = async (value, run) => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
    Object.defineProperty(globalThis, 'navigator', { value, configurable: true });
    try { return await run(); } finally {
      if (original) Object.defineProperty(globalThis, 'navigator', original);
      else delete globalThis.navigator;
    }
  };
  const copied = [];
  assert.equal(await withNavigator({ clipboard: { writeText: async (text) => { copied.push(text); } } },
    () => shareLink('https://example.test/?artwork=fraktal', 'Fraktal')), 'copied');
  assert.deepEqual(copied, ['https://example.test/?artwork=fraktal']);
  assert.equal(await withNavigator({ share: async () => {} }, () => shareLink('u', 't')), 'shared');
  assert.equal(await withNavigator({ share: async () => { throw new DOMException('x', 'AbortError'); } },
    () => shareLink('u', 't')), 'cancelled', 'closing the share sheet is not an error');
  assert.equal(await withNavigator({
    share: async () => { throw new DOMException('x', 'NotAllowedError'); },
    clipboard: { writeText: async () => {} },
  }, () => shareLink('u', 't')), 'copied', 'a refused share sheet falls back to copying');
  assert.equal(await withNavigator({}, () => shareLink('u', 't')), 'failed');
  assert.equal(shareLinkFeedback('copied'), 'Link kopiert');
  assert.equal(shareLinkFeedback('shared'), null);
  assert.equal(shareLinkFeedback('cancelled'), null);
}

console.log('Deep-link read/build and share-link checks passed.');
