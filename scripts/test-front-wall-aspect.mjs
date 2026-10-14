#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const hub = JSON.parse(readFileSync(resolve(root, 'customer-artworks/museum-hub.json'), 'utf8'));
const bundle = readFileSync(resolve(root, 'customer-preview/customer-artworks.js'), 'utf8');

const pngDimensions = (relativePath) => {
  const bytes = readFileSync(resolve(root, relativePath));
  assert.equal(bytes.readUInt32BE(0), 0x89504e47, `${relativePath} must be a PNG`);
  assert.equal(bytes.readUInt32BE(12), 0x49484452, `${relativePath} must contain an IHDR chunk`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
};

const manifestDimensions = (artworkId) => {
  const artworkStart = bundle.indexOf(`"id": "${artworkId}"`);
  assert.ok(artworkStart >= 0, `generated customer bundle must contain ${artworkId}`);
  const dimensionsStart = bundle.indexOf('"dimensions":', artworkStart);
  const dimensionsEnd = bundle.indexOf('}', dimensionsStart);
  const dimensions = bundle.slice(dimensionsStart, dimensionsEnd);
  const width = Number(dimensions.match(/"width":\s*(\d+)/)?.[1]);
  const height = Number(dimensions.match(/"height":\s*(\d+)/)?.[1]);
  assert.ok(width > 0 && height > 0, `${artworkId} must have native dimensions`);
  return { width, height };
};

const frontSlots = hub.slots.filter(
  (slot) => slot.enabled && slot.placement.wallId === 'wall-front' && slot.artworkId
);
assert.equal(frontSlots.length, 2, 'the front wall must have exactly two enabled artwork slots');

const expectedAssets = new Map([
  ['fraktal', 'customer-artworks/inbox/Fraktal.png'],
  ['akt-27', 'customer-artworks/inbox/Akt 27.png'],
]);

for (const slot of frontSlots) {
  const actual = pngDimensions(expectedAssets.get(slot.artworkId));
  const declared = manifestDimensions(slot.artworkId);
  assert.deepEqual(declared, actual, `${slot.artworkId} generated dimensions must match the source PNG`);
  const ratio = actual.width / actual.height;
  assert.ok(Number.isFinite(ratio) && ratio > 0, `${slot.id} must have a valid native aspect ratio`);
  console.log(`${slot.id}: ${actual.width}x${actual.height} (${ratio.toFixed(6)})`);
}

console.log('PASS: front-wall source and generated native dimensions agree.');
