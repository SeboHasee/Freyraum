import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';
import { buildSync } from 'esbuild';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function loadTsModule(relativePath) {
  const result = buildSync({
    entryPoints: [resolve(ROOT, relativePath)],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    write: false,
    target: ['es2020'],
  });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
}

function decodePng(path) {
  const png = readFileSync(path);
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${path} is a PNG`);
  const dataChunks = [];
  let width = 0;
  let height = 0;
  let channels = 0;
  for (let offset = 8; offset < png.length;) {
    const length = png.readUInt32BE(offset);
    const type = png.toString('ascii', offset + 4, offset + 8);
    const chunk = png.subarray(offset + 8, offset + 8 + length);
    offset += length + 12;
    if (type === 'IHDR') {
      width = chunk.readUInt32BE(0);
      height = chunk.readUInt32BE(4);
      assert.equal(chunk[8], 8, `${path} uses 8-bit color`);
      channels = chunk[9] === 2 ? 3 : chunk[9] === 6 ? 4 : 0;
      assert.ok(channels, `${path} uses RGB or RGBA color`);
    } else if (type === 'IDAT') {
      dataChunks.push(chunk);
    }
  }

  const stride = width * channels;
  const compressed = inflateSync(Buffer.concat(dataChunks));
  const pixels = Buffer.alloc(height * stride);
  let inputOffset = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = compressed[inputOffset++];
    const rowOffset = y * stride;
    for (let x = 0; x < stride; x += 1) {
      const encoded = compressed[inputOffset++];
      const left = x >= channels ? pixels[rowOffset + x - channels] : 0;
      const above = y > 0 ? pixels[rowOffset + x - stride] : 0;
      const upperLeft = y > 0 && x >= channels ? pixels[rowOffset + x - stride - channels] : 0;
      let predictor = 0;
      if (filter === 1) predictor = left;
      else if (filter === 2) predictor = above;
      else if (filter === 3) predictor = Math.floor((left + above) / 2);
      else if (filter === 4) {
        const estimate = left + above - upperLeft;
        const leftDistance = Math.abs(estimate - left);
        const aboveDistance = Math.abs(estimate - above);
        const upperLeftDistance = Math.abs(estimate - upperLeft);
        predictor = leftDistance <= aboveDistance && leftDistance <= upperLeftDistance
          ? left
          : aboveDistance <= upperLeftDistance ? above : upperLeft;
      } else assert.equal(filter, 0, `${path} uses a supported PNG filter`);
      pixels[rowOffset + x] = (encoded + predictor) & 0xff;
    }
  }
  return { width, height, channels, pixels };
}

function countSaturatedArtworkPixels(image, [left, top, right, bottom]) {
  let count = 0;
  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const offset = (y * image.width + x) * image.channels;
      const red = image.pixels[offset];
      const green = image.pixels[offset + 1];
      const blue = image.pixels[offset + 2];
      if (Math.max(red, green, blue) - Math.min(red, green, blue) > 65
        && red > green * 1.05 && red > blue * 1.05) count += 1;
    }
  }
  return count;
}

const [museumHub, geometry, publishRules] = await Promise.all([
  loadTsModule('src/config/museumHub.ts'),
  loadTsModule('src/gallery/galleryRoomViewGeometry.ts'),
  loadTsModule('src/online/publishRules.ts'),
]);
const sourceConfig = JSON.parse(readFileSync(resolve(ROOT, 'customer-artworks/museum-hub.json'), 'utf8'));
const sanitized = museumHub.sanitizeMuseumHubConfig(sourceConfig);
assert.ok(sanitized.config, 'the shipped museum config sanitizes');

const roomViews = sanitized.config.galleryRoomViews ?? [];
assert.deepEqual(roomViews.map(({ id }) => id), ['bedroom', 'wohnraum']);
assert.deepEqual(
  roomViews.map(({ background }) => background.src),
  ['Backgrounds/gallery-bedroom.png', 'Backgrounds/gallery-wohnraum.png']
);

const bedroom = decodePng(resolve(ROOT, 'customer-artworks/Backgrounds/gallery-bedroom.png'));
assert.deepEqual([bedroom.width, bedroom.height], [2000, 1540]);
assert.ok(
  countSaturatedArtworkPixels(bedroom, [765, 270, 1265, 795]) < 100,
  'the dominant bedroom artwork is removed'
);
const livingRoom = decodePng(resolve(ROOT, 'customer-artworks/Backgrounds/gallery-wohnraum.png'));
assert.deepEqual([livingRoom.width, livingRoom.height], [1896, 1424]);
assert.ok(
  countSaturatedArtworkPixels(livingRoom, [810, 300, 1090, 790]) < 100,
  'the dominant living-room artwork is removed'
);

for (const view of roomViews) {
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    const transform = geometry.projectGalleryRoomArtwork(view, 0.75, 750, 1000, width, height);
    const zoomedTransform = geometry.projectGalleryRoomArtwork(
      view,
      0.75,
      750,
      1000,
      width,
      height,
      { scale: 2, offsetX: -width * 0.25, offsetY: -height * 0.25 }
    );
    assert.ok(transform, `${view.id} projects at ${width}x${height}`);
    assert.ok(zoomedTransform, `${view.id} projects while zoomed at ${width}x${height}`);
    assert.equal(transform.width, 750, 'artwork keeps its source width');
    assert.equal(transform.height, 1000, 'artwork keeps its source height');
    assert.match(transform.transform, /^matrix3d\(/, 'artwork uses projective positioning');
    assert.notEqual(zoomedTransform.transform, transform.transform, 'artwork follows the photo camera transform');
  }
}

const localProject = mkdtempSync(join(tmpdir(), 'freyraum-room-view-import-'));
const localArtworks = join(localProject, 'customer-artworks');
const localBackgrounds = join(localArtworks, 'Backgrounds');
const localInbox = join(localArtworks, 'inbox');
const imageBytes = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000b49444154789c636000020000050001a5f645400000000049454e44ae426082',
  'hex'
);
mkdirSync(localBackgrounds, { recursive: true });
mkdirSync(localInbox, { recursive: true });
mkdirSync(join(localProject, 'customer-audio', 'inbox'), { recursive: true });
writeFileSync(join(localBackgrounds, 'gallery-bedroom.png'), imageBytes);
writeFileSync(join(localBackgrounds, 'gallery-wohnraum.png'), imageBytes);
writeFileSync(join(localArtworks, 'museum-hub.json'), JSON.stringify({
  galleryRoomViews: roomViews.map(({ id, background }) => ({ id, background })),
}));
try {
  execFileSync(process.execPath, [resolve(ROOT, 'scripts/import-artworks.mjs'), '--root', localProject], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  const localPreviewBackgrounds = join(localProject, 'customer-preview', 'backgrounds');
  for (const filename of ['gallery-bedroom.png', 'gallery-wohnraum.png']) {
    assert.deepEqual(
      readFileSync(join(localPreviewBackgrounds, filename)),
      imageBytes,
      `Update Gallery stages ${filename} beside the local preview`
    );
  }
  rmSync(join(localBackgrounds, 'gallery-wohnraum.png'));
  const missingReport = execFileSync(
    process.execPath,
    [resolve(ROOT, 'scripts/import-artworks.mjs'), '--root', localProject],
    { cwd: ROOT, encoding: 'utf8' }
  );
  assert.match(missingReport, /gallery room view "wohnraum".*background is missing/);
  assert.equal(
    readdirSync(localPreviewBackgrounds).includes('gallery-wohnraum.png'),
    false,
    'Update Gallery removes a stale staged photo if its configured source disappears'
  );
} finally {
  rmSync(localProject, { recursive: true, force: true });
}

const unsafeConfig = structuredClone(sourceConfig);
unsafeConfig.galleryRoomViews[0].background.src = 'Backgrounds/../private.png';
const safeViews = museumHub.sanitizeMuseumHubConfig(unsafeConfig).config?.galleryRoomViews ?? [];
assert.deepEqual(safeViews.map(({ id }) => id), ['wohnraum'], 'unsafe background paths are ignored');

const editorSource = readFileSync(resolve(ROOT, 'src/hub/MainMuseumHub.ts'), 'utf8');
assert.match(
  editorSource,
  /galleryRoomViews:\s*this\.resolution\.galleryRoomViews/,
  'the placement editor preserves room views when it exports configuration'
);
const roomViewSource = readFileSync(resolve(ROOT, 'src/gallery/GalleryRoomView.ts'), 'utf8');
assert.match(roomViewSource, /setPointerCapture/);
assert.match(roomViewSource, /pointercancel/);
assert.match(roomViewSource, /this\.zoomAt\(/);
assert.match(roomViewSource, /this\.trapFocus\(event\)/);
assert.match(roomViewSource, /this\.resetCamera\(\)/);

const saveConfig = structuredClone(sourceConfig);
const saveContext = {
  currentConfig: saveConfig,
  existingBackgrounds: [
    'Museum_ohne_Bilder.png',
    'museum-empty.png',
    'gallery-bedroom.png',
    'gallery-wohnraum.png',
  ],
  existingInbox: readdirSync(resolve(ROOT, 'customer-artworks/inbox')).filter((name) => !name.startsWith('.')),
};
assert.deepEqual(
  publishRules.validatePublishPackage({ config: saveConfig, files: [] }, saveContext).errors,
  [],
  'configured room photos pass save-package validation'
);
const missingRoomBackgroundConfig = structuredClone(saveConfig);
missingRoomBackgroundConfig.galleryRoomViews[0].background.src = 'Backgrounds/missing-room.png';
assert.ok(
  publishRules.validatePublishPackage(
    { config: missingRoomBackgroundConfig, files: [] },
    saveContext
  ).errors.some((error) => error.includes('Raumansicht-Hintergrund nicht gefunden')),
  'saving a room view with a missing background is rejected'
);

console.log('Gallery room-view config, projection, and editor round-trip checks passed.');
