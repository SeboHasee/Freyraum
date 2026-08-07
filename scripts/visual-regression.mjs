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

const APP_URL = process.env.FREYRAUM_URL ?? 'http://localhost:5173/app.html';
const CAPTURE_REPORT_FILENAME = 'capture-report.json';
const HUB_BACKGROUND_FALLBACK_SRC = 'Backgrounds/museum-empty.png';
const HUB_BACKGROUND_FALLBACK_DEPLOYED_PATH = 'backgrounds/museum-empty.png';
const MUSEUM_GREY_RGB = 'rgb(216, 221, 219)';
const STATE_FILTERS = (process.env.FREYRAUM_VISUAL_STATE_FILTER ?? '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
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
const MISSING_FIXTURE_IMAGE = './images/missing-fixture.png';

const ARTWORK_STEPS = [0, 1, 2];
const ZOOM_STATES = ['overview', 'reset', 'inspection'];

const HUB_ASPECT_FIXTURES = {
  portrait: [
    {
      id: 'fixture-portrait',
      title: 'Fixture Portrait',
      image: MISSING_FIXTURE_IMAGE,
      webglImage: FIXTURE_IMAGE,
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
      image: MISSING_FIXTURE_IMAGE,
      webglImage: FIXTURE_IMAGE,
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
      image: MISSING_FIXTURE_IMAGE,
      webglImage: FIXTURE_IMAGE,
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

function missingFallbackBackgroundFixture() {
  return {
    artworks: HUB_ASPECT_FIXTURES.square,
    museumHub: {
      ...SHIPPING_HUB_CONFIG,
      background: { ...SHIPPING_HUB_CONFIG.background, src: 'Backgrounds/missing-room.png' },
      backgroundFallback: { src: 'Backgrounds/missing-fallback-room.png' },
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
    name: 'hub__desktop__missing-background-neutral',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: DESKTOP_VIEWPORT,
    hubSteps: [],
    fixture: missingFallbackBackgroundFixture(),
    expectHubWarning: {
      scope: 'hub',
      event: 'hub-asset-fallback-failed',
      path: 'Backgrounds/missing-fallback-room.png',
      httpStatus: 404,
    },
    expectNeutralBackgroundFallback: true,
  },
  {
    name: 'hub__fixture__very-tall',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: DESKTOP_VIEWPORT,
    hubSteps: [],
    fixture: hubFixture(HUB_ASPECT_FIXTURES.portrait),
    expectHubArtworkFallback: 'fixture-portrait',
  },
  {
    name: 'hub__fixture__square',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: DESKTOP_VIEWPORT,
    hubSteps: [],
    fixture: hubFixture(HUB_ASPECT_FIXTURES.square),
    expectHubArtworkFallback: 'fixture-square-a',
  },
  {
    name: 'hub__fixture__very-wide',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: DESKTOP_VIEWPORT,
    hubSteps: [],
    fixture: hubFixture(HUB_ASPECT_FIXTURES.wide),
    expectHubArtworkFallback: 'fixture-wide-a',
  },
  {
    name: 'hub__fixture__doorway-left-edge',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: DESKTOP_VIEWPORT,
    hubSteps: [],
    fixture: doorwayEdgeFixture('left'),
    expectHubArtworkFallback: 'fixture-square-a',
  },
  {
    name: 'hub__fixture__doorway-right-edge',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: DESKTOP_VIEWPORT,
    hubSteps: [],
    fixture: doorwayEdgeFixture('right'),
    expectHubArtworkFallback: 'fixture-square-a',
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
    expectHubArtworkFallback: 'fixture-square-a',
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
    expectHubArtworkFallback: 'fixture-square-a',
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

const activeStates = states.filter(
  (state) => STATE_FILTERS.length === 0 || STATE_FILTERS.some((filter) => state.name.includes(filter))
);
if (STATE_FILTERS.length > 0 && activeStates.length === 0) {
  console.error(`No visual-regression states matched FREYRAUM_VISUAL_STATE_FILTER="${STATE_FILTERS.join(',')}".`);
  process.exit(2);
}

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
  if (
    surfaces.galleryVar.toLowerCase() !== '#d8dddb' ||
    surfaces.museumVar.toLowerCase() !== '#d8dddb' ||
    surfaces.body !== MUSEUM_GREY_RGB ||
    surfaces.app !== MUSEUM_GREY_RGB
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

async function assertHubSceneBridge(page, stateName) {
  const snapshot = await page.evaluate(() => {
    const canvas = document.querySelector('.museum-hub__canvas');
    const slots = [...document.querySelectorAll('.museum-hub__artwork[data-artwork-id]')]
      .slice(0, 4)
      .map((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return {
          artworkId: element.getAttribute('data-artwork-id'),
          transform: style.transform,
          clipPath: style.clipPath,
          width: rect.width,
          height: rect.height,
        };
      });
    return {
      hasCanvas: canvas instanceof HTMLCanvasElement,
      slots,
    };
  });
  if (!snapshot.hasCanvas) {
    throw new Error(`${stateName}: hub did not render through the dedicated 3D room canvas`);
  }
  if (snapshot.slots.length === 0) {
    throw new Error(`${stateName}: hub did not expose any interactive slot overlays`);
  }
  for (const slot of snapshot.slots) {
    if (slot.transform && slot.transform !== 'none') {
      throw new Error(`${stateName}: slot ${slot.artworkId} still relies on per-slot transform projection`);
    }
    if (!slot.clipPath || slot.clipPath === 'none') {
      throw new Error(`${stateName}: slot ${slot.artworkId} lost its projected screen-space containment mask`);
    }
    if (slot.width < 12 || slot.height < 12) {
      throw new Error(`${stateName}: slot ${slot.artworkId} projected overlay is implausibly small`);
    }
  }
}

async function assertHubArtworkFallback(page, stateName, expectedArtworkId) {
  const snapshot = await page.evaluate((artworkId) => {
    const element = document.querySelector(`.museum-hub__artwork[data-artwork-id="${artworkId}"]`);
    if (!(element instanceof HTMLElement)) return null;
    return {
      artworkId: element.getAttribute('data-artwork-id'),
      sourceState: element.dataset['artworkSourceState'] ?? null,
      sourceMode: element.dataset['artworkSourceMode'] ?? null,
      fallbackReason: element.dataset['artworkFallbackReason'] ?? null,
      hasMissingImageClass: element.classList.contains('has-missing-image'),
    };
  }, expectedArtworkId);
  if (!snapshot) {
    throw new Error(`${stateName}: fallback artwork slot ${expectedArtworkId} was not rendered`);
  }
  if (snapshot.sourceState !== 'ready') {
    throw new Error(`${stateName}: fallback artwork slot ${expectedArtworkId} did not reach the ready state`);
  }
  if (snapshot.sourceMode !== 'embedded-webgl-fallback') {
    throw new Error(`${stateName}: fallback artwork slot ${expectedArtworkId} did not resolve through the embedded fallback`);
  }
  if (!snapshot.fallbackReason?.startsWith('declared-image:')) {
    throw new Error(`${stateName}: fallback artwork slot ${expectedArtworkId} did not record the declared-image failure reason`);
  }
  if (snapshot.hasMissingImageClass) {
    throw new Error(`${stateName}: fallback artwork slot ${expectedArtworkId} still exposes the missing-image placeholder state`);
  }
}

function getStateHubConfig(state) {
  return state.fixture?.museumHub ?? SHIPPING_HUB_CONFIG;
}

function getStateHubBackgroundConfig(state) {
  const museumHub = getStateHubConfig(state);
  return {
    primarySrc: museumHub.background?.src ?? SHIPPING_HUB_CONFIG.background.src,
    fallbackSrc: museumHub.backgroundFallback?.src ?? HUB_BACKGROUND_FALLBACK_SRC,
  };
}

function resolveHubBackgroundUrl(pageUrl, src) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  const normalized = src.replace(/^Backgrounds\//, 'backgrounds/');
  return new URL(normalized, pageUrl).href;
}

function dedupeStrings(values) {
  return [...new Set(values.filter(Boolean))];
}

function dedupeFailures(failures) {
  const seen = new Set();
  return failures.filter((failure) => {
    const key = `${failure.url ?? ''}::${failure.status ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildFixtureScript(fixture) {
  return `(() => {
    const fixture = ${JSON.stringify(fixture)};
    window.__FREYRAUM_ARTWORKS = fixture.artworks;
    window.__FREYRAUM_MUSEUM_HUB = fixture.museumHub;
    window.__FREYRAUM_HUB_HOTSPOTS = undefined;
  })();`;
}

async function readHubBackgroundSnapshot(page) {
  return await page.evaluate(() => {
    const hub = document.querySelector('.museum-hub');
    const image = document.querySelector('.museum-hub__image');
    const stage = document.querySelector('.museum-hub__stage');
    const stageStyle = stage ? getComputedStyle(stage) : null;
    const entries = window.__FREYRAUM_DIAGNOSTICS__?.getEntries?.() ?? [];
    return {
      hasHub: hub instanceof HTMLElement,
      imageError: hub instanceof HTMLElement ? hub.classList.contains('has-image-error') : false,
      currentImageSrc:
        image instanceof HTMLImageElement ? image.currentSrc || image.getAttribute('src') || image.src || null : null,
      stageBackgroundColor: stageStyle?.backgroundColor ?? null,
      warnings: entries
        .filter(
          (entry) =>
            entry.scope === 'hub' &&
            (entry.event === 'hub-asset-missing' || entry.event === 'hub-asset-fallback-failed')
        )
        .map((entry) => ({
          event: entry.event,
          path: typeof entry.data?.path === 'string' ? entry.data.path : null,
          url: typeof entry.data?.url === 'string' ? entry.data.url : null,
          fallbackPath: typeof entry.data?.fallbackPath === 'string' ? entry.data.fallbackPath : null,
          fallbackUrl: typeof entry.data?.fallbackUrl === 'string' ? entry.data.fallbackUrl : null,
          httpStatus: typeof entry.data?.httpStatus === 'number' ? entry.data.httpStatus : null,
          attempt: typeof entry.data?.attempt === 'string' ? entry.data.attempt : null,
        })),
    };
  });
}

async function forceNeutralHubBackground(page) {
  await page.evaluate(() => {
    const hub = document.querySelector('.museum-hub');
    if (hub instanceof HTMLElement) hub.classList.add('has-image-error');
  });
}

async function ensureHubBackgroundFailSafe(page, state) {
  const { primarySrc, fallbackSrc } = getStateHubBackgroundConfig(state);
  const primaryUrl = resolveHubBackgroundUrl(page.url(), primarySrc);
  const fallbackUrl = resolveHubBackgroundUrl(page.url(), fallbackSrc);
  let snapshot = await readHubBackgroundSnapshot(page);
  if (!snapshot.hasHub) {
    return {
      attemptedUrls: dedupeStrings([primaryUrl]),
      failed: [],
      fallbackUsed: null,
    };
  }

  const failed404s = dedupeFailures(
    snapshot.warnings
      .filter((warning) => warning.httpStatus === 404)
      .map((warning) => ({
        url: warning.url,
        path: warning.path,
        status: warning.httpStatus,
        event: warning.event,
        attempt: warning.attempt,
      }))
  );
  const primaryFailed = failed404s.some((failure) => failure.url === primaryUrl || failure.attempt === 'primary');
  const fallbackFailed = failed404s.some((failure) => failure.url === fallbackUrl || failure.attempt === 'fallback');
  const shouldUseNeutral = primaryFailed && (!fallbackUrl || fallbackUrl === primaryUrl || fallbackFailed);

  if (failed404s.length > 0) {
    for (const failure of failed404s) {
      console.warn(`${state.name}: hub/background asset ${failure.url} returned ${failure.status}`);
    }
    if (shouldUseNeutral) {
      await forceNeutralHubBackground(page);
    } else if (primaryFailed && fallbackUrl) {
      await page.evaluate((expectedFallbackUrl) => {
        const image = document.querySelector('.museum-hub__image');
        if (
          image instanceof HTMLImageElement &&
          image.currentSrc !== expectedFallbackUrl &&
          image.src !== expectedFallbackUrl
        ) {
          image.src = expectedFallbackUrl;
        }
      }, fallbackUrl);
    }
    await page.waitForFunction(
      ({ expectedFallbackUrl, neutral }) => {
        const hub = document.querySelector('.museum-hub');
        const image = document.querySelector('.museum-hub__image');
        const stage = document.querySelector('.museum-hub__stage');
        const stageStyle = stage ? getComputedStyle(stage) : null;
        if (!(hub instanceof HTMLElement)) return false;
        if (neutral) {
          return hub.classList.contains('has-image-error') && stageStyle?.backgroundColor === 'rgb(216, 221, 219)';
        }
        return (
          image instanceof HTMLImageElement &&
          Boolean(expectedFallbackUrl) &&
          (image.currentSrc === expectedFallbackUrl || image.src === expectedFallbackUrl)
        );
      },
      { expectedFallbackUrl: shouldUseNeutral ? null : fallbackUrl, neutral: shouldUseNeutral },
      { timeout: 10_000 }
    );
    snapshot = await readHubBackgroundSnapshot(page);
  }

  if (state.expectHubWarning) {
    const warning = snapshot.warnings.find(
      (entry) =>
        entry.event === state.expectHubWarning.event &&
        entry.path === state.expectHubWarning.path &&
        entry.httpStatus === state.expectHubWarning.httpStatus
    );
    if (!warning) {
      throw new Error(`${state.name}: missing background fail-safe warning was not recorded with structured 404 context`);
    }
  }

  if (state.expectNeutralBackgroundFallback) {
    if (!snapshot.imageError || snapshot.stageBackgroundColor !== MUSEUM_GREY_RGB) {
      throw new Error(`${state.name}: fallback-neutral hub state did not degrade to museum-grey`);
    }
  }

  const attemptedUrls = dedupeStrings([
    primaryUrl,
    ...snapshot.warnings.map((warning) => warning.url),
    primaryFailed ? fallbackUrl : null,
    snapshot.currentImageSrc,
  ]);
  return {
    attemptedUrls,
    failed: failed404s,
    fallbackUsed: snapshot.imageError
      ? 'neutral-grey'
      : snapshot.currentImageSrc?.includes(HUB_BACKGROUND_FALLBACK_DEPLOYED_PATH)
        ? HUB_BACKGROUND_FALLBACK_DEPLOYED_PATH
        : null,
  };
}

async function capture(targetDir) {
  const { chromium } = await loadPlaywright();
  mkdirSync(targetDir, { recursive: true });
  const browser = await chromium.launch();
  const captureReport = [];
  for (const state of activeStates) {
    const page = await browser.newPage({ viewport: state.viewport, deviceScaleFactor: 1 });
    if (state.fixture) {
      await page.route('**/customer-artworks.js', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/javascript',
          body: buildFixtureScript(state.fixture),
        });
      });
    }
    await page.addInitScript(() => {
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
    });
    await page.goto(`${APP_URL}${state.query}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.loading-start-btn:not([disabled])', { timeout: 45_000 });
    await page.click('.loading-start-btn');
    await page.waitForSelector('.loading-overlay', { state: 'detached', timeout: 10_000 });

    if (state.mode === 'hub') {
      await page.waitForSelector('.museum-hub:not([hidden])', { timeout: 10_000 });
      for (const step of state.hubSteps) {
        await page.keyboard.press(step);
        await page.waitForTimeout(350);
      }
      await page.waitForTimeout(600);
      await assertAuthoritativeSurfaces(page, state.name);
      await assertHubSceneBridge(page, state.name);
      if (state.expectHubArtworkFallback) {
        await assertHubArtworkFallback(page, state.name, state.expectHubArtworkFallback);
      }
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
      await assertHubSceneBridge(page, state.name);
      if (state.expectHubArtworkFallback) {
        await assertHubArtworkFallback(page, state.name, state.expectHubArtworkFallback);
      }
      await assertSurfaceReasons(page, state.name, [
        'experience-state:hub',
        'experience-state:transitioning',
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

    const assetCheck = await ensureHubBackgroundFailSafe(page, state);
    const invariant = await page.evaluate(() => window.__FREYRAUM_PERF_TOOLS__?.checkInvariants());
    if (!invariant) {
      throw new Error(`${state.name}: performance/invariant tooling was not installed`);
    }
    if (invariant.violations.length > 0) {
      throw new Error(`${state.name}: invariant gate failed: ${invariant.violations.join('; ')}`);
    }
    const file = resolve(targetDir, `${state.name}.png`);
    await page.screenshot({ path: file });
    captureReport.push({
      state: state.name,
      attemptedUrls: assetCheck.attemptedUrls,
      failed: assetCheck.failed,
      fallbackUsed: assetCheck.fallbackUsed,
      screenshotPath: file,
    });
    console.log(
      `asset-check ${state.name}: attempted=${assetCheck.attemptedUrls.length} failed=${assetCheck.failed.length} fallback=${assetCheck.fallbackUsed ?? 'none'}`
    );
    console.log(`captured ${state.name} → ${file}`);
    await page.close();
  }
  await browser.close();
  const reportPath = resolve(targetDir, CAPTURE_REPORT_FILENAME);
  writeFileSync(reportPath, JSON.stringify(captureReport, null, 2));
  console.log(`capture report → ${reportPath}`);
  return captureReport;
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
  for (const state of activeStates) {
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
} else if (mode === 'capture') {
  await capture(CURRENT_DIR);
  console.log(`\nCapture written to ${CURRENT_DIR}.`);
} else if (mode === 'compare') {
  await compare();
} else {
  console.error('Usage: node scripts/visual-regression.mjs <baseline|capture|compare>');
  process.exit(2);
}
