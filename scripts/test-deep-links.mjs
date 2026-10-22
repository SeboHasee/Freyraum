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

console.log('Deep-link read/build checks passed.');
