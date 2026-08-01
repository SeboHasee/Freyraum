import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildSync } from 'esbuild';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..');

async function loadTsModule(relativePath) {
  const entry = resolve(ROOT, relativePath);
  const result = buildSync({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    write: false,
    target: ['es2020'],
  });
  const code = result.outputFiles[0].text;
  const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
  return import(moduleUrl);
}

const museumHub = await loadTsModule('src/config/museumHub.ts');
const geometry = await loadTsModule('src/hub/projectiveGeometry.ts');

const artworks = [
  {
    id: 'portrait-work',
    title: 'Portrait Work',
    image: 'portrait.png',
    dimensions: { width: 900, height: 1200 },
  },
  {
    id: 'square-work',
    title: 'Square Work',
    image: 'square.png',
    dimensions: { width: 1200, height: 1200 },
  },
  {
    id: 'wide-work',
    title: 'Wide Work',
    image: 'wide.png',
    dimensions: { width: 2400, height: 900 },
  },
];

const v1Config = {
  version: 1,
  coverage: 'all-active-artworks',
  background: { src: 'Backgrounds/museum-empty.png', aspect: 1366 / 768 },
  visualTokens: { galleryWall: '#D8DDDB', museumWall: '#D8DDDB' },
  slots: [
    {
      id: 'room-01.wall-left.outer',
      enabled: true,
      selectable: true,
      artworkId: 'portrait-work',
      placement: { cx: 0.185, cy: 0.514, maxW: 0.056, maxH: 0.207, rotateYDeg: 18 },
    },
    {
      id: 'room-01.wall-right.inner',
      enabled: true,
      selectable: true,
      artworkId: 'square-work',
      placement: { cx: 0.625, cy: 0.515, maxW: 0.098, maxH: 0.16, rotateYDeg: -6 },
    },
  ],
};

const migrated = museumHub.resolveMuseumHub(artworks, v1Config, null);
assert.equal(migrated.source, 'v1-migrated');
assert.equal(migrated.slotToArtwork.get('room-01.wall-left.outer'), 'portrait-work');
assert.equal(migrated.slotToArtwork.get('room-01.wall-right.inner'), 'square-work');
assert.ok(migrated.warnings.some((warning) => warning.includes('migrated provisionally')));

const leftWall = migrated.wallById.get('wall-left');
assert.ok(leftWall, 'expected built-in left wall to resolve');
const leftSlot = migrated.pages.flatMap((page) => page.slots).find((slot) => slot.id === 'room-01.wall-left.outer');
assert.ok(leftSlot, 'expected migrated slot to resolve');
const projection = geometry.projectSlotArtwork(leftWall, leftSlot.placement, leftSlot.artworkAspect, migrated.stage);
assert.ok(projection, 'expected projected artwork geometry');
assert.ok(projection.shortEdge >= 84, 'expected readable projected short edge');

const overlapConfig = {
  version: 2,
  coverage: 'all-active-artworks',
  stage: { width: 1366, height: 768 },
  background: { src: 'Backgrounds/museum-empty.png', aspect: 1366 / 768 },
  visualTokens: { galleryWall: '#D8DDDB', museumWall: '#D8DDDB' },
  walls: [
    {
      id: 'wall-left',
      group: 'left',
      planeAspect: 1.55,
      quad: [
        { x: 102, y: 176 },
        { x: 662, y: 192 },
        { x: 708, y: 598 },
        { x: 40, y: 620 },
      ],
      safePolygon: [
        { x: 120, y: 196 },
        { x: 646, y: 210 },
        { x: 688, y: 580 },
        { x: 62, y: 600 },
      ],
    },
  ],
  fallbacks: {
    requireAllMapped: true,
    autoPlaceUnmapped: false,
    overflow: 'paginate',
    invalidMapping: 'disable-slot',
    missingImage: 'placeholder-exact-target',
    selectionTimeoutMs: 1500,
    selectionTimeout: 'open-exact-target-procedural',
  },
  slots: [
    {
      id: 'room-01.wall-left.outer',
      enabled: true,
      selectable: true,
      artworkId: 'portrait-work',
      placement: {
        wallId: 'wall-left',
        center: { x: 0.35, y: 0.55 },
        mountedHeight: 0.34,
      },
    },
    {
      id: 'room-01.wall-left.inner',
      enabled: true,
      selectable: true,
      artworkId: 'wide-work',
      placement: {
        wallId: 'wall-left',
        center: { x: 0.39, y: 0.55 },
        mountedHeight: 0.34,
      },
    },
  ],
};

const overlapped = museumHub.resolveMuseumHub(artworks, overlapConfig, null);
assert.ok(overlapped.warnings.some((warning) => warning.includes('overlaps')), 'expected overlap warning');

console.log('PASS: museum-hub wall-plane geometry migration and overlap checks behave as expected.');
