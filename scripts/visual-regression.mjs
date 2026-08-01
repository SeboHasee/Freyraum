/**
 * v0.74 Phase 10.3 / Phase 12 — Type A (visual) regression harness.
 *
 * Captures and compares rendered screenshots of the FREYRAUM gallery and main
 * museum hub to gate perceptual-risk changes.
 */
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..');
const BASELINE_DIR = resolve(ROOT, '.visual-regression/baseline');
const CURRENT_DIR = resolve(ROOT, '.visual-regression/current');
const DIFF_DIR = resolve(ROOT, '.visual-regression/diff');

const URL = process.env.FREYRAUM_URL ?? 'http://localhost:5173/app.html';
const DESKTOP_VIEWPORT = { width: 1280, height: 800 };
const WIDE_DESKTOP_VIEWPORT = { width: 1728, height: 960 };
const NARROW_PORTRAIT_VIEWPORT = { width: 420, height: 980 };
const PHONE_VIEWPORT = { width: 390, height: 844 };
const INCLUDE_HUB_DEBUG_CAPTURE = process.env.FREYRAUM_VISUAL_INCLUDE_HUB_DEBUG === '1';
const SHIPPING_HUB_CONFIG = JSON.parse(
  readFileSync(resolve(ROOT, 'customer-artworks/museum-hub.json'), 'utf8')
);
const FIXTURE_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"512\" height=\"512\" viewBox=\"0 0 512 512\"><defs><linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#7089a3\"/><stop offset=\"1\" stop-color=\"#d8dddb\"/></linearGradient></defs><rect width=\"512\" height=\"512\" fill=\"url(#g)\"/><circle cx=\"256\" cy=\"256\" r=\"140\" fill=\"rgba(255,255,255,0.35)\"/></svg>'
)}`;

const ARTWORK_STEPS = [0, 1, 2];
const ZOOM_STATES = ['overview', 'reset', 'inspection'];

const HUB_ASPECT_FIXTURES = {
  portrait: [
    {
      id: 'fixture-portrait',
      title: 'Fixture Portrait',
      image: FIXTURE_IMAGE,
      dimensions: { width: 900, height: 2000 },
    },
    {
      id: 'fixture-square',
      title: 'Fixture Square',
      image: FIXTURE_IMAGE,
      dimensions: { width: 1400, height: 1400 },
    },
    {
      id: 'fixture-landscape',
      title: 'Fixture Landscape',
      image: FIXTURE_IMAGE,
      dimensions: { width: 1800, height: 1000 },
    },
    {
      id: 'fixture-pano',
      title: 'Fixture Pano',
      image: FIXTURE_IMAGE,
      dimensions: { width: 3200, height: 900 },
    },
  ],
  square: [
    {
      id: 'fixture-square-a',
      title: 'Fixture Square A',
      image: FIXTURE_IMAGE,
      dimensions: { width: 1200, height: 1200 },
    },
    {
      id: 'fixture-square-b',
      title: 'Fixture Square B',
      image: FIXTURE_IMAGE,
      dimensions: { width: 1400, height: 1400 },
    },
    {
      id: 'fixture-square-c',
      title: 'Fixture Square C',
      image: FIXTURE_IMAGE,
      dimensions: { width: 1600, height: 1600 },
    },
    {
      id: 'fixture-square-d',
      title: 'Fixture Square D',
      image: FIXTURE_IMAGE,
      dimensions: { width: 1800, height: 1800 },
    },
  ],
  wide: [
    {
      id: 'fixture-wide-a',
      title: 'Fixture Wide A',
      image: FIXTURE_IMAGE,
      dimensions: { width: 2400, height: 1000 },
    },
    {
      id: 'fixture-wide-b',
      title: 'Fixture Wide B',
      image: FIXTURE_IMAGE,
      dimensions: { width: 2800, height: 1000 },
    },
    {
      id: 'fixture-wide-c',
      title: 'Fixture Wide C',
      image: FIXTURE_IMAGE,
      dimensions: { width: 3200, height: 1000 },
    },
    {
      id: 'fixture-wide-d',
      title: 'Fixture Wide D',
      image: FIXTURE_IMAGE,
      dimensions: { width: 3600, height: 1000 },
    },
  ],
};

function hubFixture(artworks) {
  return {
    artworks,
    museumHub: {
      ...SHIPPING_HUB_CONFIG,
      slots: SHIPPING_HUB_CONFIG.slots.map((slot) => ({
        ...slot,
        ...(slot.id === 'room-01.wall-left.outer'
          ? { artworkId: artworks[0].id }
          : slot.id === 'room-01.wall-right.inner'
            ? { artworkId: artworks[1].id }
            : {}),
      })),
    },
  };
}

function fullMappedHubFixture(artworks) {
  const slotIds = SHIPPING_HUB_CONFIG.slots.map((slot) => slot.id);
  return {
    artworks,
    museumHub: {
      ...SHIPPING_HUB_CONFIG,
      slots: SHIPPING_HUB_CONFIG.slots.map((slot, index) => ({
        ...slot,
        ...(artworks[index] ? { artworkId: artworks[index].id } : {}),
      })),
      fallbacks: {
        ...SHIPPING_HUB_CONFIG.fallbacks,
        requireAllMapped: true,
      },
    },
  };
}

function doorwayEdgeFixture(side) {
  const artworks = HUB_ASPECT_FIXTURES.square;
  const fixture = fullMappedHubFixture(artworks);
  fixture.museumHub = {
    ...fixture.museumHub,
    slots: fixture.museumHub.slots.map((slot) => {
      if (side === 'left' && slot.id === 'room-01.wall-left.outer') {
        return {
          ...slot,
          placement: {
            ...slot.placement,
            anchor: { x: 0.06, y: 0.52 },
            mountedHeight: 1.38,
          },
        };
      }
      if (side === 'right' && slot.id === 'room-01.wall-right.outer') {
        return {
          ...slot,
          placement: {
            ...slot.placement,
            anchor: { x: 2.72, y: 0.54 },
            mountedHeight: 1.08,
          },
        };
      }
      return slot;
    }),
  };
  return fixture;
}

function missingBackgroundFixture() {
  return {
    artworks: HUB_ASPECT_FIXTURES.square,
    museumHub: {
      ...SHIPPING_HUB_CONFIG,
      background: { ...SHIPPING_HUB_CONFIG.background, src: 'Backgrounds/missing-room.png' },
      backgroundFallback: { src: 'Backgrounds/museum-empty.png' },
      slots: SHIPPING_HUB_CONFIG.slots.map((slot, index) => ({
        ...slot,
        ...(index < HUB_ASPECT_FIXTURES.square.length ? { artworkId: HUB_ASPECT_FIXTURES.square[index].id } : {}),
      })),
    },
  };
}

const states = [
  {
    name: 'hub__desktop__room-1',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: DESKTOP_VIEWPORT,
    hubSteps: [],
  },
  {
    name: 'hub__desktop-wide__room-1',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: WIDE_DESKTOP_VIEWPORT,
    hubSteps: [],
  },
  {
    name: 'hub__phone__left-wall',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: PHONE_VIEWPORT,
    hubSteps: [],
  },
  {
    name: 'hub__phone__right-wall',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: PHONE_VIEWPORT,
    hubSteps: ['ArrowRight'],
  },
  {
    name: 'hub__portrait-narrow__left-wall',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: NARROW_PORTRAIT_VIEWPORT,
    hubSteps: [],
  },
  {
    name: 'hub__portrait-narrow__right-wall',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: NARROW_PORTRAIT_VIEWPORT,
    hubSteps: ['ArrowRight'],
  },
  {
    name: 'hub__desktop__missing-background-fallback',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: DESKTOP_VIEWPORT,
    hubSteps: [],
    fixture: missingBackgroundFixture(),
    expectBackgroundFallback: true,
    expectHubWarning: {
      scope: 'hub',
      event: 'hub-asset-missing',
      path: 'Backgrounds/missing-room.png',
      httpStatus: 404,
    },
  },
  {
    name: 'hub__fixture__very-tall',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: DESKTOP_VIEWPORT,
    hubSteps: [],
    fixture: hubFixture(HUB_ASPECT_FIXTURES.portrait),
  },
  {
    name: 'hub__fixture__square',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: DESKTOP_VIEWPORT,
    hubSteps: [],
    fixture: hubFixture(HUB_ASPECT_FIXTURES.square),
  },
  {
    name: 'hub__fixture__very-wide',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: DESKTOP_VIEWPORT,
    hubSteps: [],
    fixture: hubFixture(HUB_ASPECT_FIXTURES.wide),
  },
  {
    name: 'hub__fixture__doorway-left-edge',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: DESKTOP_VIEWPORT,
    hubSteps: [],
    fixture: doorwayEdgeFixture('left'),
  },
  {
    name: 'hub__fixture__doorway-right-edge',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: DESKTOP_VIEWPORT,
    hubSteps: [],
    fixture: doorwayEdgeFixture('right'),
  },
  ...(INCLUDE_HUB_DEBUG_CAPTURE
    ? [
        {
          name: 'hub__desktop__debug-overlay',
          query: '?startup=entry-minimal&hubDebug=1&debug=1',
          mode: 'hub',
          viewport: DESKTOP_VIEWPORT,
          hubSteps: [],
        },
      ]
    : []),
  {
    name: 'hub__desktop__selected-return-topbar',
    query: '?startup=entry-minimal',
    mode: 'roundtrip',
    viewport: DESKTOP_VIEWPORT,
    fixture: fullMappedHubFixture(HUB_ASPECT_FIXTURES.square),
    activateArtworkId: 'fixture-square-b',
    galleryNavigationSteps: ['ArrowRight'],
    returnMethod: 'topbar',
    expectedSelectedArtworkId: 'fixture-square-c',
  },
  {
    name: 'hub__desktop__selected-return-escape',
    query: '?startup=entry-minimal',
    mode: 'roundtrip',
    viewport: DESKTOP_VIEWPORT,
    fixture: fullMappedHubFixture(HUB_ASPECT_FIXTURES.square),
    activateArtworkId: 'fixture-square-b',
    galleryNavigationSteps: ['ArrowRight'],
    returnMethod: 'escape',
    expectedSelectedArtworkId: 'fixture-square-c',
  },
  {
    name: 'gallery__desktop__context-restore',
    query: '?startup=entry-minimal',
    mode: 'restore',
    viewport: DESKTOP_VIEWPORT,
    fixture: fullMappedHubFixture(HUB_ASPECT_FIXTURES.square),
    activateArtworkId: 'fixture-square-a',
  },
  ...ARTWORK_STEPS.flatMap((artworkStep) =>
    ZOOM_STATES.map((zoom) => ({
      name: `dramatic__artwork-${artworkStep}__${zoom}`,
      query: '?startup=entry-minimal',
      mode: 'gallery',
      viewport: DESKTOP_VIEWPORT,
      artworkStep,
      zoom,
    }))
  ),
];

const PER_PIXEL_CHANNEL_THRESHOLD = 10 / 255;
const MAX_DIFF_FRACTION = 0.02;

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    console.error(
      'Playwright is not installed. Install the Type A tooling on demand:\n' +
        '  npm i -D playwright pixelmatch pngjs && npx playwright install chromium'
    );
    process.exit(2);
  }
}

async function assertAuthoritativeSurfaces(page, stateName) {
  const surfaces = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const body = getComputedStyle(document.body);
    const app = getComputedStyle(document.getElementById('app'));
    const hub = document.querySelector('.museum-hub');
    const hubStyle = hub ? getComputedStyle(hub) : null;
    return {
      galleryVar: root.getPropertyValue('--color-gallery-wall').trim(),
      museumVar: root.getPropertyValue('--color-museum-wall').trim(),
      body: body.backgroundColor,
      app: app.backgroundColor,
      hub: hubStyle?.backgroundColor ?? null,
    };
  });
  const expected = 'rgb(216, 221, 219)';
  if (
    surfaces.galleryVar.toLowerCase() !== '#d8dddb' ||
    surfaces.museumVar.toLowerCase() !== '#d8dddb' ||
    surfaces.body !== expected ||
    surfaces.app !== expected
  ) {
    throw new Error(`${stateName}: authoritative museum-grey token did not reach root/body/app surfaces`);
  }
}

async function enterGalleryFromHub(page, artworkId) {
  if (artworkId) {
    await page.click(`.museum-hub__artwork[data-artwork-id="${artworkId}"]`);
  } else if (await page.locator('.museum-hub__artwork[data-artwork-id]').count()) {
    await page.locator('.museum-hub__artwork[data-artwork-id]').first().click();
  } else {
    await page.click('.museum-hub__destination');
  }
  await page.waitForSelector("#app[data-experience='gallery']", { timeout: 10_000 });
  await page.waitForTimeout(700);
}

async function assertSurfaceReasons(page, stateName, expectedReasons) {
  const seenReasons = await page.evaluate(() =>
    (window.__FREYRAUM_DIAGNOSTICS__?.getEntries?.() ?? [])
      .filter((entry) => entry.scope === 'surface' && entry.event === 'wall-surface-snapshot')
      .map((entry) => entry.data?.reason)
      .filter(Boolean)
  );
  for (const reason of expectedReasons) {
    if (!seenReasons.includes(reason)) {
      throw new Error(`${stateName}: missing wall-surface snapshot for ${reason}`);
    }
  }
}

async function assertSelectedArtworkState(page, stateName, expectedArtworkId) {
  const snapshot = await page.evaluate((artworkId) => {
    const selected = [...document.querySelectorAll('.museum-hub__artwork.is-selected')]
      .map((el) => el.getAttribute('data-artwork-id'))
      .filter(Boolean);
    const current = [...document.querySelectorAll('.museum-hub__artwork[aria-current="true"]')]
      .map((el) => el.getAttribute('data-artwork-id'))
      .filter(Boolean);
    const activeElement = document.activeElement;
    return {
      selected,
      current,
      activeArtworkId:
        activeElement instanceof HTMLElement ? activeElement.getAttribute('data-artwork-id') : null,
      lifecycleReasons: (window.__FREYRAUM_DIAGNOSTICS__?.getEntries?.() ?? [])
        .filter((entry) => entry.scope === 'hub' && entry.event === 'hub-selection-lifecycle')
        .map((entry) => entry.data?.reason)
        .filter(Boolean),
    };
  }, expectedArtworkId);
  if (snapshot.selected.length !== 1 || snapshot.selected[0] !== expectedArtworkId) {
    throw new Error(`${stateName}: persistent hub selection did not resolve to ${expectedArtworkId}`);
  }
  if (snapshot.current.length !== 1 || snapshot.current[0] !== expectedArtworkId) {
    throw new Error(`${stateName}: aria-current selection did not resolve to ${expectedArtworkId}`);
  }
  if (snapshot.activeArtworkId !== expectedArtworkId) {
    throw new Error(`${stateName}: focus was not restored to the selected artwork ${expectedArtworkId}`);
  }
  if (!snapshot.lifecycleReasons.includes('gallery-navigate') || !snapshot.lifecycleReasons.includes('router-enter-hub')) {
    throw new Error(`${stateName}: hub selection lifecycle diagnostics did not record gallery sync and hub restore`);
  }
}

async function capture(targetDir) {
  const { chromium } = await loadPlaywright();
  mkdirSync(targetDir, { recursive: true });
  const browser = await chromium.launch();
  for (const state of states) {
    const page = await browser.newPage({ viewport: state.viewport, deviceScaleFactor: 1 });
    await page.addInitScript((fixture) => {
      localStorage.setItem('freyraum-nav-hint-seen', '1');
      localStorage.setItem(
        'freyraum.preferences.v1',
        JSON.stringify({
          reducedMotion: true,
          highContrast: false,
          contrastMode: 'auto',
          quality: 'high',
          audioMuted: false,
          audioVolume: 0.15,
          alwaysShowChrome: true,
        })
      );
      if (fixture) {
        window.__FREYRAUM_ARTWORKS = fixture.artworks;
        window.__FREYRAUM_MUSEUM_HUB = fixture.museumHub;
        window.__FREYRAUM_HUB_HOTSPOTS = undefined;
      }
    }, state.fixture ?? null);
    await page.goto(`${URL}${state.query}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.loading-start-btn:not([disabled])', { timeout: 45_000 });
    await page.click('.loading-start-btn');
    await page.waitForSelector('.loading-overlay', { state: 'detached', timeout: 10_000 });

    if (state.mode === 'hub') {
      await page.waitForSelector('.museum-hub:not([hidden])', { timeout: 10_000 });
      if (state.expectBackgroundFallback) {
        await page.waitForFunction(
          () => document.querySelector('.museum-hub__image')?.getAttribute('src')?.includes('museum-empty.png'),
          { timeout: 10_000 }
        );
      }
      if (state.expectHubWarning) {
        const warning = await page.evaluate((expected) => {
          const entries = window.__FREYRAUM_DIAGNOSTICS__?.getEntries?.() ?? [];
          return entries.find(
            (entry) =>
              entry.scope === expected.scope &&
              entry.event === expected.event &&
              entry.data &&
              typeof entry.data === 'object' &&
              entry.data.path === expected.path &&
              entry.data.httpStatus === expected.httpStatus
          ) ?? null;
        }, state.expectHubWarning);
        if (!warning) {
          throw new Error(`${state.name}: missing background fallback warning was not recorded with structured 404 context`);
        }
      }
      for (const step of state.hubSteps) {
        await page.keyboard.press(step);
        await page.waitForTimeout(350);
      }
      await page.waitForTimeout(600);
      await assertAuthoritativeSurfaces(page, state.name);
      await assertSurfaceReasons(page, state.name, ['experience-state:hub']);
    } else if (state.mode === 'gallery') {
      await page.waitForSelector('.museum-hub:not([hidden])', { timeout: 10_000 });
      await enterGalleryFromHub(page, state.activateArtworkId);
      for (let index = 0; index < state.artworkStep; index += 1) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(350);
      }
      if (state.zoom === 'overview') {
        for (let index = 0; index < 5; index += 1) await page.keyboard.press('-');
      } else if (state.zoom === 'inspection') {
        for (let index = 0; index < 7; index += 1) await page.keyboard.press('=');
      }
      await page.waitForTimeout(1600);
      await assertAuthoritativeSurfaces(page, state.name);
      await assertSurfaceReasons(page, state.name, ['experience-state:transitioning', 'experience-state:destination']);
    } else if (state.mode === 'roundtrip') {
      await page.waitForSelector('.museum-hub:not([hidden])', { timeout: 10_000 });
      await enterGalleryFromHub(page, state.activateArtworkId);
      for (const step of state.galleryNavigationSteps ?? []) {
        await page.keyboard.press(step);
        await page.waitForTimeout(400);
      }
      await assertAuthoritativeSurfaces(page, state.name);
      if (state.returnMethod === 'topbar') {
        await page.click('.topbar__back-btn');
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForSelector('.museum-hub:not([hidden])', { timeout: 10_000 });
      await page.waitForTimeout(700);
      await assertAuthoritativeSurfaces(page, state.name);
      await assertSurfaceReasons(page, state.name, [
        'experience-state:hub',
        'experience-state:transitioning',
        'experience-state:destination',
      ]);
      await assertSelectedArtworkState(page, state.name, state.expectedSelectedArtworkId);
    } else if (state.mode === 'restore') {
      await page.waitForSelector('.museum-hub:not([hidden])', { timeout: 10_000 });
      await enterGalleryFromHub(page, state.activateArtworkId);
      const restoreTriggered = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        const gl = canvas?.getContext('webgl2') ?? canvas?.getContext('webgl');
        const extension = gl?.getExtension('WEBGL_lose_context');
        if (!extension) return false;
        extension.loseContext();
        setTimeout(() => extension.restoreContext(), 120);
        return true;
      });
      if (!restoreTriggered) {
        throw new Error(`${state.name}: WEBGL_lose_context extension unavailable`);
      }
      await page.waitForFunction(
        () =>
          (window.__FREYRAUM_DIAGNOSTICS__?.getEntries?.() ?? []).some(
            (entry) => entry.scope === 'surface' && entry.data?.reason === 'renderer-context-restored'
          ),
        { timeout: 10_000 }
      );
      await page.waitForTimeout(800);
      await assertAuthoritativeSurfaces(page, state.name);
      await assertSurfaceReasons(page, state.name, ['renderer-context-lost', 'renderer-context-restored']);
    }

    const invariant = await page.evaluate(() => window.__FREYRAUM_PERF_TOOLS__?.checkInvariants());
    if (!invariant) {
      throw new Error(`${state.name}: performance/invariant tooling was not installed`);
    }
    if (invariant.violations.length > 0) {
      throw new Error(`${state.name}: invariant gate failed: ${invariant.violations.join('; ')}`);
    }
    const file = resolve(targetDir, `${state.name}.png`);
    await page.screenshot({ path: file });
    console.log(`captured ${state.name} → ${file}`);
    await page.close();
  }
  await browser.close();
}

async function compare() {
  let pixelmatch;
  let PNG;
  try {
    pixelmatch = (await import('pixelmatch')).default;
    PNG = (await import('pngjs')).PNG;
  } catch {
    console.error(
      'pixelmatch/pngjs not installed. Install the Type A compare tooling:\n' +
        '  npm i -D pixelmatch pngjs'
    );
    process.exit(2);
  }
  if (!existsSync(BASELINE_DIR)) {
    console.error(`No baseline at ${BASELINE_DIR}. Run "baseline" first.`);
    process.exit(2);
  }
  await capture(CURRENT_DIR);
  mkdirSync(DIFF_DIR, { recursive: true });

  let failed = 0;
  for (const state of states) {
    const basePath = resolve(BASELINE_DIR, `${state.name}.png`);
    const curPath = resolve(CURRENT_DIR, `${state.name}.png`);
    if (!existsSync(basePath)) {
      console.warn(`skip ${state.name}: no baseline image`);
      continue;
    }
    const base = PNG.sync.read(readFileSync(basePath));
    const cur = PNG.sync.read(readFileSync(curPath));
    if (base.width !== cur.width || base.height !== cur.height) {
      console.error(`FAIL ${state.name}: dimension mismatch`);
      failed += 1;
      continue;
    }
    const { width, height } = base;
    const diff = new PNG({ width, height });
    const mismatched = pixelmatch(base.data, cur.data, diff.data, width, height, {
      threshold: PER_PIXEL_CHANNEL_THRESHOLD,
    });
    writeFileSync(resolve(DIFF_DIR, `${state.name}.png`), PNG.sync.write(diff));
    const fraction = mismatched / (width * height);
    const verdict = fraction < MAX_DIFF_FRACTION ? 'PASS' : 'FAIL';
    if (verdict === 'FAIL') failed += 1;
    console.log(
      `${verdict} ${state.name}: ${(fraction * 100).toFixed(3)}% differing ` +
        `(limit ${(MAX_DIFF_FRACTION * 100).toFixed(1)}%)`
    );
  }
  if (failed > 0) {
    console.error(`\nType A gate FAILED for ${failed} state(s).`);
    process.exit(1);
  }
  console.log('\nType A gate PASSED.');
}

const mode = process.argv[2];
if (mode === 'baseline') {
  await capture(BASELINE_DIR);
  console.log(`\nBaseline written to ${BASELINE_DIR}.`);
} else if (mode === 'compare') {
  await compare();
} else {
  console.error('Usage: node scripts/visual-regression.mjs <baseline|compare>');
  process.exit(2);
}
