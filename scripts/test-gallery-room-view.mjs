import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
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
  return import(
    `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`
  );
}

function decodePng(path) {
  const png = readFileSync(path);
  assert.equal(
    png.subarray(0, 8).toString('hex'),
    '89504e470d0a1a0a',
    `${path} is a PNG`
  );
  const dataChunks = [];
  let width = 0;
  let height = 0;
  let channels = 0;
  for (let offset = 8; offset < png.length; ) {
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
      const upperLeft =
        y > 0 && x >= channels ? pixels[rowOffset + x - stride - channels] : 0;
      let predictor = 0;
      if (filter === 1) predictor = left;
      else if (filter === 2) predictor = above;
      else if (filter === 3) predictor = Math.floor((left + above) / 2);
      else if (filter === 4) {
        const estimate = left + above - upperLeft;
        const leftDistance = Math.abs(estimate - left);
        const aboveDistance = Math.abs(estimate - above);
        const upperLeftDistance = Math.abs(estimate - upperLeft);
        predictor =
          leftDistance <= aboveDistance && leftDistance <= upperLeftDistance
            ? left
            : aboveDistance <= upperLeftDistance
              ? above
              : upperLeft;
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
      if (Math.max(red, green, blue) - Math.min(red, green, blue) > 65)
        count += 1;
    }
  }
  return count;
}

function laplacianVariance(image, bounds) {
  let sum = 0;
  let sumSquares = 0;
  let count = 0;
  const luminanceAt = (x, y) => {
    const offset = (y * image.width + x) * image.channels;
    return image.pixels[offset] * 0.299
      + image.pixels[offset + 1] * 0.587
      + image.pixels[offset + 2] * 0.114;
  };
  for (let y = bounds.top + 1; y < bounds.bottom - 1; y += 1) {
    for (let x = bounds.left + 1; x < bounds.right - 1; x += 1) {
      const laplacian = 4 * luminanceAt(x, y)
        - luminanceAt(x - 1, y)
        - luminanceAt(x + 1, y)
        - luminanceAt(x, y - 1)
        - luminanceAt(x, y + 1);
      sum += laplacian;
      sumSquares += laplacian * laplacian;
      count += 1;
    }
  }
  const mean = sum / count;
  return sumSquares / count - mean * mean;
}

function maxCleanupSeamDelta(image, bounds, source = image, sampleStep = 1) {
  let maximum = 0;
  const compare = (x1, y1, x2, y2) => {
    const first = (y1 * image.width + x1) * image.channels;
    const second = (y2 * image.width + x2) * image.channels;
    for (let channel = 0; channel < 3; channel += 1) {
      const editedDelta = Math.abs(
        image.pixels[first + channel] - image.pixels[second + channel]
      );
      const sourceDelta = Math.abs(
        source.pixels[first + channel] - source.pixels[second + channel]
      );
      maximum = Math.max(maximum, editedDelta - sourceDelta);
    }
  };
  const inset =
    Math.min(bounds.right - bounds.left, bounds.bottom - bounds.top) > 100
      ? 50
      : 8;
  for (let x = bounds.left + inset; x < bounds.right - inset; x += sampleStep) {
    compare(x, bounds.top, x, bounds.top - 1);
    compare(x, bounds.bottom, x, bounds.bottom + 1);
  }
  for (let y = bounds.top + inset; y < bounds.bottom - inset; y += sampleStep) {
    compare(bounds.left, y, bounds.left - 1, y);
    compare(bounds.right, y, bounds.right + 1, y);
  }
  return maximum;
}

function projectCssMatrix(transform, x, y) {
  const matrix = transform
    .replace(/^matrix3d\(|\)$/g, '')
    .split(',')
    .map(Number);
  assert.equal(
    matrix.length,
    16,
    'projected artwork exposes a CSS 3D homography'
  );
  const denominator = matrix[3] * x + matrix[7] * y + matrix[15];
  return {
    x: (matrix[0] * x + matrix[4] * y + matrix[12]) / denominator,
    y: (matrix[1] * x + matrix[5] * y + matrix[13]) / denominator,
  };
}

const [museumHub, geometry, publishRules, deviceOrientation] = await Promise.all([
  loadTsModule('src/config/museumHub.ts'),
  loadTsModule('src/gallery/galleryRoomViewGeometry.ts'),
  loadTsModule('src/online/publishRules.ts'),
  loadTsModule('src/gallery/deviceOrientation.ts'),
]);
assert.equal(
  await deviceOrientation.requestDeviceOrientationAccess({
    secureContext: true,
    supported: true,
  }),
  'granted',
  'orientation access works without a separate browser permission API'
);
assert.equal(
  await deviceOrientation.requestDeviceOrientationAccess({
    secureContext: false,
    supported: true,
  }),
  'unavailable',
  'orientation access requires a secure context'
);
assert.equal(
  await deviceOrientation.requestDeviceOrientationAccess({
    secureContext: true,
    supported: false,
  }),
  'unavailable',
  'orientation access degrades when sensors are unavailable'
);
assert.equal(
  await deviceOrientation.requestDeviceOrientationAccess({
    secureContext: true,
    supported: true,
    requestPermission: async () => 'denied',
  }),
  'denied',
  'explicitly denied sensor permission is reported'
);
assert.equal(
  await deviceOrientation.requestDeviceOrientationAccess({
    secureContext: true,
    supported: true,
    requestPermission: async () => {
      throw new Error('permission unavailable');
    },
  }),
  'denied',
  'permission API failures are handled as denial'
);
assert.deepEqual(
  deviceOrientation.normalizeDeviceArtworkTilt(18, 18, 0, 0, 0),
  { tiltX: 1.2, tiltY: 1.2 },
  'device tilt is clamped to a subtle maximum'
);
const rotatedTilt = deviceOrientation.normalizeDeviceArtworkTilt(18, 0, 90, 0, 0);
assert.ok(
  Math.abs(rotatedTilt.tiltX) < 1e-10
    && Math.abs(rotatedTilt.tiltY - 1.2) < 1e-10,
  'device tilt follows the screen axes after rotation'
);
assert.deepEqual(
  deviceOrientation.smoothDeviceArtworkTilt(
    { tiltX: 0, tiltY: 0 },
    { tiltX: 1, tiltY: -1 },
    0
  ),
  { tiltX: 0, tiltY: 0 },
  'orientation smoothing does not jump on a zero-duration frame'
);
const smoothedTilt = deviceOrientation.smoothDeviceArtworkTilt(
  { tiltX: 0, tiltY: 0 },
  { tiltX: 1, tiltY: -1 },
  1 / 60
);
assert.ok(smoothedTilt.tiltX > 0 && smoothedTilt.tiltX < 1);
assert.ok(smoothedTilt.tiltY < 0 && smoothedTilt.tiltY > -1);
const sourceConfig = JSON.parse(
  readFileSync(resolve(ROOT, 'customer-artworks/museum-hub.json'), 'utf8')
);
const sanitized = museumHub.sanitizeMuseumHubConfig(sourceConfig);
assert.ok(sanitized.config, 'the shipped museum config sanitizes');

const roomViews = sanitized.config.galleryRoomViews ?? [];
assert.deepEqual(
  roomViews.map(({ id }) => id),
  ['bedroom', 'wohnraum', 'wohn-bereich', 'buero']
);
assert.deepEqual(
  roomViews.map(({ background }) => background.src),
  [
    'Backgrounds/gallery-bedroom.png',
    'Backgrounds/gallery-wohnraum.png',
    'Backgrounds/gallery-wohn-bereich.png',
    'Backgrounds/gallery-buero.png',
  ]
);
const editedRoomConfig = structuredClone(sourceConfig);
editedRoomConfig.galleryRoomViews[0].placement = {
  u: 0.46,
  v: 0.52,
  height: 0.31,
};
const roundTrippedRooms =
  museumHub.sanitizeMuseumHubConfig(editedRoomConfig).config
    ?.galleryRoomViews ?? [];
assert.deepEqual(
  roundTrippedRooms[0].placement,
  editedRoomConfig.galleryRoomViews[0].placement,
  'edited photo-room position and size survive config sanitization and export round-trip'
);

const bedroom = decodePng(
  resolve(ROOT, 'customer-artworks/Backgrounds/gallery-bedroom.png')
);
assert.deepEqual([bedroom.width, bedroom.height], [2000, 1540]);
const originalBedroom = decodePng(
  resolve(ROOT, 'customer-artworks/Backgrounds/bedroom.png')
);
const bedroomCleanupBounds = { left: 740, top: 230, right: 1315, bottom: 830 };
const bedroomSeamDelta = maxCleanupSeamDelta(
  bedroom,
  bedroomCleanupBounds,
  originalBedroom
);
assert.ok(
  bedroomSeamDelta <= 20,
  `bedroom photo cleanup blends into the surrounding wall without a sharp edge (max delta ${bedroomSeamDelta})`
);
assert.ok(
  countSaturatedArtworkPixels(bedroom, [790, 285, 1260, 770]) < 100,
  'the bedroom painting and surrounding frame are removed'
);
const bedroomWallTexture = laplacianVariance(bedroom, {
  left: 820,
  top: 320,
  right: 1235,
  bottom: 740,
});
const bedroomTextureReference = laplacianVariance(originalBedroom, {
  left: 576,
  top: 264,
  right: 704,
  bottom: 392,
});
assert.ok(
  bedroomWallTexture >= bedroomTextureReference * 0.55
    && bedroomWallTexture <= bedroomTextureReference * 1.8,
  `the bedroom repair retains subtle wall texture without excessive sharpening or grain (repair ${bedroomWallTexture.toFixed(1)}, wall ${bedroomTextureReference.toFixed(1)})`
);
const livingRoom = decodePng(
  resolve(ROOT, 'customer-artworks/Backgrounds/gallery-wohnraum.png')
);
assert.deepEqual([livingRoom.width, livingRoom.height], [1896, 1424]);
const originalLivingRoom = decodePng(
  resolve(ROOT, 'customer-artworks/Backgrounds/Wohnraum.png')
);
const livingRoomCleanupBounds = {
  left: 760,
  top: 245,
  right: 1140,
  bottom: 845,
};
const livingRoomSeamDelta = maxCleanupSeamDelta(
  livingRoom,
  livingRoomCleanupBounds,
  originalLivingRoom
);
assert.ok(
  livingRoomSeamDelta <= 20,
  `living-room photo cleanup blends into the surrounding wall without a sharp edge (max delta ${livingRoomSeamDelta})`
);
assert.ok(
  countSaturatedArtworkPixels(livingRoom, [795, 295, 1100, 800]) < 100,
  'the living-room painting and surrounding frame are removed'
);

const livingArea = decodePng(
  resolve(ROOT, 'customer-artworks/Backgrounds/gallery-wohn-bereich.png')
);
assert.deepEqual([livingArea.width, livingArea.height], [2000, 2000]);
const originalLivingArea = decodePng(
  resolve(ROOT, 'customer-artworks/Backgrounds/Wohnbereich.png')
);
const livingAreaCleanupBounds = {
  left: 880,
  top: 155,
  right: 1415,
  bottom: 840,
};
const livingAreaSeamDelta = maxCleanupSeamDelta(
  livingArea,
  livingAreaCleanupBounds,
  originalLivingArea
);
assert.ok(
  livingAreaSeamDelta <= 20,
  `Wohnbereich photo cleanup blends into the surrounding wall without a sharp edge (max delta ${livingAreaSeamDelta})`
);
assert.ok(
  countSaturatedArtworkPixels(livingArea, [900, 180, 1390, 810]) < 100,
  'the Wohnbereich painting and surrounding frame are removed'
);

const office = decodePng(
  resolve(ROOT, 'customer-artworks/Backgrounds/gallery-buero.png')
);
assert.deepEqual([office.width, office.height], [2000, 1125]);
const originalOffice = decodePng(
  resolve(ROOT, 'customer-artworks/Backgrounds/Büro.png')
);
const officeCleanupBounds = { left: 850, top: 255, right: 1190, bottom: 595 };
const officeSeamDelta = maxCleanupSeamDelta(
  office,
  officeCleanupBounds,
  originalOffice
);
assert.ok(
  officeSeamDelta <= 20,
  `Büro photo cleanup blends into the surrounding wall without a sharp edge (max delta ${officeSeamDelta})`
);
assert.ok(
  countSaturatedArtworkPixels(office, [870, 280, 1170, 580]) < 100,
  'the Büro painting and surrounding frame are removed'
);

const projectiveGeometry = await loadTsModule('src/hub/projectiveGeometry.ts');
for (const view of roomViews) {
  for (const [width, height] of [
    [2000, 1080],
    [1920, 1080],
    [1440, 900],
    [1024, 768],
    [844, 390],
    [390, 844],
  ]) {
    for (const artworkAspect of [0.5625, 0.75, 1]) {
      const artworkWidth = artworkAspect * 1000;
      const transform = geometry.projectGalleryRoomArtwork(
        view,
        artworkAspect,
        artworkWidth,
        1000,
        width,
        height
      );
      assert.ok(
        transform,
        `${view.id} projects at ${width}x${height} with aspect ${artworkAspect}`
      );
      assert.equal(
        transform.width,
        artworkWidth,
        'artwork keeps its source width'
      );
      assert.equal(transform.height, 1000, 'artwork keeps its source height');
      assert.match(
        transform.transform,
        /^matrix3d\(/,
        'artwork uses projective positioning'
      );
      let normalizedWidth =
        (view.placement.height * artworkAspect) / view.wallAspect;
      let normalizedHeight = view.placement.height;
      if (normalizedWidth > 0.88) {
        const reduction = 0.88 / normalizedWidth;
        normalizedWidth *= reduction;
        normalizedHeight *= reduction;
      }
      const centerU = Math.max(
        normalizedWidth * 0.5,
        Math.min(1 - normalizedWidth * 0.5, view.placement.u)
      );
      const centerV = Math.max(
        normalizedHeight * 0.5,
        Math.min(1 - normalizedHeight * 0.5, view.placement.v)
      );
      const localCorners = [
        [centerU - normalizedWidth * 0.5, centerV - normalizedHeight * 0.5],
        [centerU + normalizedWidth * 0.5, centerV - normalizedHeight * 0.5],
        [centerU + normalizedWidth * 0.5, centerV + normalizedHeight * 0.5],
        [centerU - normalizedWidth * 0.5, centerV + normalizedHeight * 0.5],
      ];
      const sourceCorners = [
        [0, 0],
        [artworkWidth, 0],
        [artworkWidth, 1000],
        [0, 1000],
      ];
      const wallHomography = projectiveGeometry.computeHomographyFromUnitSquare(
        view.wallQuad
      );
      const coverScale = Math.max(
        width / view.background.width,
        height / view.background.height
      );
      const coverOffsetX = (width - view.background.width * coverScale) * 0.5;
      const coverOffsetY = (height - view.background.height * coverScale) * 0.5;
      const cameraStates = [
        { scale: 1, offsetX: 0, offsetY: 0 },
        { scale: 6, offsetX: -width * 2.5, offsetY: -height * 2.5 },
        { scale: 2.25, offsetX: -width * 0.4, offsetY: -height * 0.2 },
        { scale: 3, offsetX: -width * 0.8, offsetY: -height * 0.65 },
      ];
      for (const [x, y] of sourceCorners) {
        const cornerIndex = sourceCorners.findIndex(
          (corner) => corner[0] === x && corner[1] === y
        );
        const basePoint = projectCssMatrix(transform.transform, x, y);
        assert.ok(
          basePoint.x >= -1 &&
            basePoint.x <= width + 1 &&
            basePoint.y >= -1 &&
            basePoint.y <= height + 1,
          `${view.id} complete artwork remains inside the ${width}x${height} viewport`
        );
        const artworkCenter = projectCssMatrix(
          transform.transform,
          artworkWidth * 0.5,
          500
        );
        const wallPoint = projectiveGeometry.applyHomography(
          wallHomography,
          localCorners[cornerIndex][0],
          localCorners[cornerIndex][1]
        );
        const expected = {
          x: coverOffsetX + wallPoint.x * view.background.width * coverScale,
          y: coverOffsetY + wallPoint.y * view.background.height * coverScale,
        };
        assert.ok(
          Math.abs(basePoint.x - expected.x) < 0.01 &&
            Math.abs(basePoint.y - expected.y) < 0.01,
          `${view.id} artwork corner aligns with the photographed wall at ${width}x${height}`
        );
        const expectedCenterWallPoint = projectiveGeometry.applyHomography(
          wallHomography,
          centerU,
          centerV
        );
        const expectedCenter = {
          x:
            coverOffsetX +
            expectedCenterWallPoint.x * view.background.width * coverScale,
          y:
            coverOffsetY +
            expectedCenterWallPoint.y * view.background.height * coverScale,
        };
        assert.ok(
          Math.abs(transform.center.x - expectedCenter.x) < 0.01 &&
            Math.abs(transform.center.y - expectedCenter.y) < 0.01 &&
            Math.abs(artworkCenter.x - expectedCenter.x) < 0.01 &&
            Math.abs(artworkCenter.y - expectedCenter.y) < 0.01,
          `${view.id} computes the projective artwork center from the same wall homography`
        );
        for (const camera of cameraStates) {
          const displayed = {
            x: camera.offsetX + basePoint.x * camera.scale,
            y: camera.offsetY + basePoint.y * camera.scale,
          };
          const expectedDisplayed = {
            x: camera.offsetX + expected.x * camera.scale,
            y: camera.offsetY + expected.y * camera.scale,
          };
          assert.ok(
            Math.abs(displayed.x - expectedDisplayed.x) < 0.01 &&
              Math.abs(displayed.y - expectedDisplayed.y) < 0.01,
            `${view.id} artwork corner stays on the wall at camera scale ${camera.scale}`
          );
        }
      }
    }
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
writeFileSync(join(localBackgrounds, 'gallery-wohn-bereich.png'), imageBytes);
writeFileSync(join(localBackgrounds, 'gallery-buero.png'), imageBytes);
writeFileSync(
  join(localArtworks, 'museum-hub.json'),
  JSON.stringify({
    galleryRoomViews: roomViews.map(({ id, background }) => ({
      id,
      background,
    })),
  })
);
try {
  execFileSync(
    process.execPath,
    [resolve(ROOT, 'scripts/import-artworks.mjs'), '--root', localProject],
    {
      cwd: ROOT,
      encoding: 'utf8',
    }
  );
  const localPreviewBackgrounds = join(
    localProject,
    'customer-preview',
    'backgrounds'
  );
  for (const filename of [
    'gallery-bedroom.png',
    'gallery-wohnraum.png',
    'gallery-wohn-bereich.png',
    'gallery-buero.png',
  ]) {
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
  assert.match(
    missingReport,
    /gallery room view "wohnraum".*background is missing/
  );
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
const safeViews =
  museumHub.sanitizeMuseumHubConfig(unsafeConfig).config?.galleryRoomViews ??
  [];
assert.deepEqual(
  safeViews.map(({ id }) => id),
  ['wohnraum', 'wohn-bereich', 'buero'],
  'unsafe background paths are ignored'
);

const editorSource = readFileSync(
  resolve(ROOT, 'src/hub/MainMuseumHub.ts'),
  'utf8'
);
assert.match(
  editorSource,
  /galleryRoomViews:\s*this\.resolution\.galleryRoomViews/,
  'the placement editor preserves room views when it exports configuration'
);
assert.match(
  editorSource,
  /new EditorGalleryRoomViews/,
  'the room tab exposes the photo-room editor'
);
assert.match(
  editorSource,
  /this\.galleryRoomEditor\?\.refresh/,
  'room-view edits restore through editor snapshots'
);
const roomEditorSource = readFileSync(
  resolve(ROOT, 'src/hub/editor/galleryRoomViews.ts'),
  'utf8'
);
assert.match(
  roomEditorSource,
  /projectGalleryRoomArtwork/,
  'the editor preview uses visitor-view projection math'
);
assert.match(
  roomEditorSource,
  /quadIsConvex/,
  'the editor rejects invalid wall boundaries'
);
const roomViewSource = readFileSync(
  resolve(ROOT, 'src/gallery/GalleryRoomView.ts'),
  'utf8'
);
assert.match(roomViewSource, /setPointerCapture/);
assert.match(roomViewSource, /pointercancel/);
assert.match(
  roomViewSource,
  /MAX_CAMERA_SCALE = 6/,
  'photo-room zoom supports expanded pan travel'
);
assert.match(roomViewSource, /CAMERA_ZOOM_LAMBDA = 4/);
assert.match(roomViewSource, /CAMERA_PAN_LAMBDA = 5/);
assert.match(roomViewSource, /smoothDamp\(this\.cameraZoom, nextTargetScale, CAMERA_ZOOM_LAMBDA/);
assert.match(roomViewSource, /smoothDamp\(this\.cameraScale, this\.cameraZoom, CAMERA_ZOOM_LAMBDA/);
assert.match(roomViewSource, /interface CameraZoomAnchor/);
assert.match(
  roomViewSource,
  /anchorScreenX - anchor\.contentX \* nextScale/,
  'animated artwork-centered zoom derives offsets from one scene-space anchor'
);
assert.match(roomViewSource, /cameraAnimationTargetOffsetX/);
assert.doesNotMatch(roomViewSource, /CAMERA_ZOOM_DURATION_MS/);
assert.match(roomViewSource, /requestAnimationFrame\(tick\)/);
assert.match(roomViewSource, /requestDeviceOrientationAccess/);
assert.match(roomViewSource, /deviceorientation/);
assert.match(roomViewSource, /this\.disableDeviceMotionTilt\(\)/);
assert.match(roomViewSource, /this\.zoomAt\(/);
assert.match(
  roomViewSource,
  /this\.zoomBy\(wheelZoomFactor\(normalizeWheelDelta\(event\.deltaY, event\.deltaMode, window\.innerHeight\), event\.ctrlKey\)\)/,
  'wheel zoom targets the artwork like the zoom buttons'
);
assert.match(roomViewSource, /HOVER_INFLUENCE_RADIUS_PX = 900/);
assert.match(
  roomViewSource,
  /this\.resetCamera\(true\)/,
  'room changes ease the camera back to neutral'
);
assert.match(roomViewSource, /this\.trapFocus\(event\)/);
assert.match(roomViewSource, /this\.resetCamera\(\)/);
assert.match(
  roomViewSource,
  /input:not\(:disabled\)/,
  'room dialog focus order includes utility form controls'
);
const hubStyles = readFileSync(resolve(ROOT, 'src/styles/main.scss'), 'utf8');
{
  const wheelRate = (path) =>
    readFileSync(resolve(ROOT, path), 'utf8').match(/const WHEEL_ZOOM_PER_PX = ([0-9.]+);/)?.[1];
  assert.equal(
    wheelRate('scripts/test-gallery-room-view-browser.mjs'),
    wheelRate('src/interaction/touchGestures.ts'),
    'browser suite mirrors the shared WHEEL_ZOOM_PER_PX wheel curve'
  );
}
const helpSource = readFileSync(resolve(ROOT, 'src/ui/KeyboardHelp.ts'), 'utf8');
assert.match(helpSource, /Mit dem Mausrad zoomen/);
assert.match(helpSource, /Bei vergrößerter Ansicht verschieben; in der Übersicht horizontal zum nächsten Bild wechseln/);
assert.match(helpSource, /Bei vergrößerter Ansicht das Foto verschieben/);
assert.match(helpSource, /Mit dem Mausrad auf das Kunstwerk zoomen/);
assert.match(helpSource, /An der Stelle eine Stufe herauszoomen/, 'help lists Shift+double-click step-out');
assert.match(helpSource, /Vergrößertes Foto verschieben/, 'help lists Shift+arrow panning');
assert.match(roomViewSource, /if \(event\.shiftKey\) this\.zoomOutStepAt\(/, 'Shift+double-click zooms out one step');
assert.match(roomViewSource, /event\.shiftKey && event\.key\.startsWith\('Arrow'\)/, 'Shift+arrows pan the zoomed photo');
assert.match(
  hubStyles,
  /\.gallery-room-view__scene\.is-fine-pointer\.is-pan-available\s*\{\s*cursor:\s*grab/,
  'photo-room grab cursor requires an actual fine-pointer event and available pan range'
);
assert.match(hubStyles, /\.gallery-room-view__scene\.is-fine-pointer\.is-dragging\s*\{\s*cursor:\s*grabbing/);
assert.match(roomViewSource, /event\.pointerType === 'mouse' \|\| event\.pointerType === 'pen'/);
assert.match(roomViewSource, /classList\.toggle\('is-pan-available', canPan\)/);
assert.match(roomViewSource, /classList\.toggle\('is-dragging', canPan && this\.pointerDragStarted\)/);
assert.match(editorSource, /shadowPath\.classList\.toggle\('is-selected', selected\)/);
assert.match(editorSource, /explicitlySelectedArtworkId/);
assert.match(editorSource, /options\.source === 'slot-click'/);
assert.match(editorSource, /options\.source !== 'gallery-navigate'/);
assert.match(editorSource, /button\.matches\(':focus-visible'\)/);
assert.match(editorSource, /event\.pointerType === 'mouse'/);
assert.match(editorSource, /event\.pointerType === 'pen'/);
assert.match(editorSource, /shadowPath\.classList\.add\('is-hovered'\)/);
assert.match(editorSource, /button\.classList\.add\('is-hovered'\)/);
assert.match(editorSource, /shadowPath\.classList\.toggle\('is-focused', keyboardFocus\)/);
assert.match(editorSource, /this\.syncArtworkSpotlight\(button, spotlight, event\)/);
assert.match(editorSource, /button\.classList\.contains\('is-selected'\)/);
assert.match(editorSource, /private syncArtworkSpotlight\(/);
assert.match(editorSource, /spotlight\.style\.setProperty\('--hub-light-x', '50%'\)/);
assert.match(editorSource, /this\.syncShadowFeedback\(view\.shadowPath\)/);
assert.match(editorSource, /private syncShadowFeedback\(shadowPath: SVGPathElement\)/);
assert.match(editorSource, /SHADOW_FEEDBACK_PROFILES\.selected/);
assert.match(editorSource, /this\.calibrating \|\| this\.debugGeometry/);
assert.match(
  hubStyles,
  /\.museum-hub__shadow-path\s*\{[^}]*drop-shadow\([^}]*drop-shadow\([^}]*drop-shadow/s,
  'museum-hub shadow SVG receives contact, directional, and ambient wall shadows'
);
assert.match(hubStyles, /--hub-shadow-fill-alpha/);
assert.match(hubStyles, /--hub-shadow-directional-alpha/);
assert.match(hubStyles, /\.museum-hub__artwork-light\s*\{[^}]*radial-gradient/s);
assert.match(hubStyles, /pointer-events:\s*none/);
assert.match(hubStyles, /\.museum-hub__artwork::before\s*\{[^}]*border-radius:\s*50%/s);
assert.doesNotMatch(
  hubStyles,
  /\.museum-hub__artwork\.is-hovered \.museum-hub__artwork-label/,
  'visitor hover does not reveal a floating artwork-name badge'
);
assert.doesNotMatch(
  hubStyles,
  /\.museum-hub__artwork\.is-hovered::before/,
  'pointer hover does not draw an artwork frame or marker'
);
assert.match(
  hubStyles,
  /\.museum-hub:not\(\.is-calibrating\):not\(\.is-debug-geometry\)[\s\S]*?\.museum-hub__artwork\.is-illuminated/,
  'spotlight remains visitor-only'
);
assert.match(
  hubStyles,
  /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.museum-hub__shadow-path,\s*\.museum-hub__artwork-light\s*\{\s*transition:\s*none;/,
  'museum shadow and spotlight transitions respect reduced motion'
);
assert.doesNotMatch(
  hubStyles,
  /\.museum-hub__artwork\s*\{[^}]*filter\s*:/s,
  'the clipped artwork hit target does not own the expanded shadow filter'
);
assert.match(
  editorSource,
  /projectedQuad\.map\(\(\{ x, y \}\)/,
  'the SVG shadow follows the exact projected artwork quad'
);

const saveConfig = structuredClone(sourceConfig);
const saveContext = {
  currentConfig: saveConfig,
  existingBackgrounds: [
    'Museum_ohne_Bilder.png',
    'museum-empty.png',
    'gallery-bedroom.png',
    'gallery-wohnraum.png',
    'gallery-wohn-bereich.png',
    'gallery-buero.png',
    'gallery-wohn-bereich.png',
    'gallery-buero.png',
  ],
  existingInbox: readdirSync(resolve(ROOT, 'customer-artworks/inbox')).filter(
    (name) => !name.startsWith('.')
  ),
};
assert.deepEqual(
  publishRules.validatePublishPackage(
    { config: saveConfig, files: [] },
    saveContext
  ).errors,
  [],
  'configured room photos pass save-package validation'
);
const missingRoomBackgroundConfig = structuredClone(saveConfig);
missingRoomBackgroundConfig.galleryRoomViews[0].background.src =
  'Backgrounds/missing-room.png';
assert.ok(
  publishRules
    .validatePublishPackage(
      { config: missingRoomBackgroundConfig, files: [] },
      saveContext
    )
    .errors.some((error) =>
      error.includes('Raumansicht-Hintergrund nicht gefunden')
    ),
  'saving a room view with a missing background is rejected'
);

console.log(
  'Gallery room-view config, projection, and editor round-trip checks passed.'
);
