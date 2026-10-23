# FREYRAUM handoff history — v1.45/v1.46 sections (2026-10-22)
> Archived 2026-10-22 when PR #27 was made merge-ready. Immutable; current
> state lives in `docs/HANDOFF.md`.

## v1.46 next development round (2026-10-22)

- Done: B1 web manifest without image bytes, B2 WebP size variants
  (`scripts/build-web-images.mjs`, runtime choice in
  `src/utils/artworkImageSources.ts`), B3 lazy editor chunk + bundle budget,
  C1 info-sheet stops, C2 photo-room swipe, C3 landscape rail, C4
  tap-to-hide phone chrome, C6 flick test, D3 zoom readout
  (`src/ui/ZoomIndicator.ts`), D5 gallery zoom fixed point
  (`GalleryManager.coupledZoomPan`), E3 deep links
  (`src/navigation/deepLink.ts`) with "Link teilen" (`src/ui/shareLink.ts`),
  `npm test` = all no-browser checks (quality CI runs it),
  B4a WebP background copies
  (`validate:deploy` checks them; the editor's calibration view keeps the
  original PNG). Numbers: `FINDINGS.md` (v1.46).
- Next in order: D1 split-layer raster, C5, D2, D4, E (except E3), F;
  B4b deliberately skipped (four artworks share URLs with the gallery, so the
  saving is small and the hub readiness gate would need rework); G needs the
  customer. Checklist: `plan.md` →
  "Next development round".
- Known intermittent: the mobile suite's sheet step half → full (90 px
  handle drag) timed out in two v1.46 runs; reruns passed. The check now
  prints the sheet stop, classes and the element under the handle before and
  after the drag, so the next failure shows whether the drag missed the
  handle or the stop logic declined it.
- Deploy note: CI's `npm ci` installs sharp, so `import:artworks` builds the
  WebP variants; without sharp the site falls back to the originals with a
  `validate:deploy` warning. The customer's "Update Gallery" does not run it.

## Next-agent starting point (v1.41–v1.45, 2026-10-22)

- Same branch/PR #27 (`copilot/mobile-view-optimizations`); `main` holds
  v1.33–v1.40. v1.41–v1.42 rebuilt the phone experience, v1.43–v1.44 the
  desktop room zoom, v1.45 worked through this handoff (`CHANGELOG.md`).
- Read `FINDINGS.md` (2026-10-21/22) and `ARCHITECTURE_MAP.md` (touch gestures,
  device tilt, hub panorama, phone menu, info sheet). New touch surfaces use
  `src/interaction/touchGestures.ts`; zoom steps use its shared curve
  (`wheelZoomFactor`, `ZOOM_STEP_FACTOR`); utility-control placement belongs
  only to `placeUtilityControls()` in `src/main.ts`.
- Checks for this area: `npm run test:touch-gestures`,
  `npm run test:gallery-room-view`, `npm run validate:museum-hub`, and after
  `npm run build` the photo-room browser suite and `npm run test:mobile-browser`
  (`docs/REGRESSION_TOOLING.md`). Run browser suites one at a time and stop
  stray headless Chrome between runs.
- Measure DOM-camera smoothness with `npm run measure:room-zoom`, not headless
  frame counts (lesson 130). Under SwiftShader, poll end states instead of
  trusting stability windows (lesson 132); hold past the 100 ms velocity window
  when a test needs a plain drag, not a fling (lesson 129).
- Customer decisions with defaults in place: loading colour (wall grey
  `#c7ced4`), gyro default (auto on Android, opt-in on iOS), hub snapping (soft),
  photo-room zoom cap 6×.
- Earlier handoff sections (2026-10-20/21 validation history, audit matrices)
  are archived in `docs/archive/handoff-history-2026-10-22.md`.

### v1.45 validation (2026-10-22)

- **Source and bundle:** branch head after commit `f27f013`, plus the browser
  suite constant fix (lesson 133). Local preview bundle `bundle-d98e87c7c0f0`.
- **Passed (run one at a time):** `npm run lint`, `npm run build:typecheck`,
  `npm run build`, `npm run test:touch-gestures`, `npm run test:gallery-room-view`,
  `npm run validate:museum-hub`, `npm run docs:check-config-authority`,
  `npm run test:mobile-browser` (strip-reach check now polls; announcement
  check passes), and the photo-room browser suite (41 checks, including drift,
  Shift+arrow and Shift+double-click).
- **First suite run failed and was diagnosed:** the photo-room suite expected
  the old wheel rate 0.001 while the code uses the shared 0.0012 (lesson 133).
- Owner gates and open work: "Open items" below.

## Done since the previous handoff (v1.42–v1.45)

All earlier "ready-to-pick" items below are finished and removed from the
lists (details in `CHANGELOG.md`):

- Phone "more" menu, info bottom sheet, reduced motion over manual tilt,
  nav occlusion keyed to chrome mode, phone browser suite (v1.42).
- `validate:museum-hub` doorway-height failure repaired; suite passes (v1.42).
- Photo-room browser suite green end to end, incl. terminal zoom (v1.41–v1.42).
- Room double-click zoom toggle, motion-only compositing, wheel-delta
  normalisation, gallery ctrl+wheel (v1.43); zoom-out drift fixed (v1.44).
- Phone strip-reach flake fixed and side-wall reachability proven (v1.45).
- Shared zoom curve for gallery and room, trackpad-pinch gain, Shift+double-click
  step-out, Shift+arrow panning, `aria-live` strip announcement
  ("Bild 3 von 8"), `npm run measure:room-zoom` (v1.45).

## Open items

### Owner and customer gates (cannot be done by an agent)

1. Click **Approve and run** for the CI checks on PR #27, then merge.
2. Live `/Freyraum/` smoke after the post-merge Pages deploy
   (`docs/DEPLOYMENT.md`); only that proves deployed content. The
   production-base browser smoke has not been run for this branch either.
3. Real phones (iOS Safari, Android Chrome; portrait and landscape): gyro feel,
   flick feel, hub strip, info sheet pull and rubber-band scrolling, room pinch,
   loading and browser-bar colours.
4. Real desktop GPU (Chrome/Edge/Firefox, mouse and trackpad): zoom feel in
   both views and whether the motion layer looks soft during zoom-in.
5. Customer review of the four cleaned room photos, hub shadows and controls at
   normal display size; confirm the defaults listed above.
6. Content: missing optional Wunderbaum text, empty alt texts for Akt 27 and
   Fraktal, and placeholder ("Lorem ipsum") descriptions in the sidecar texts.
7. Desktop app: install the Windows artifact on the customer PC; optional first
   release; online-save setup (`docs/ONLINE_EDITOR_SETUP.md`); signing later.

### Engineering (tracked in `plan.md`)

- Wohnbereich top-clipping screenshot (2026-10-20): reproduce with the exact
  bundle/room/camera state; current local artifacts do not clip.
- Software-Chrome visual harness stops at the runtime invariant
  `shadow-casting light count 1 != expected 2`; no Type A capture is claimed.
- Fraktal now uses a 4096 px (desktop, ~67 MB GPU) or 2048 px (phone,
  ~17 MB) WebP on the deployed site; the local `file://` preview still uses
  the original. The build keeps the large-chunk warning (three.js; entry
  budget 1.15 MB in `test:frame-budget`); 17 development-tool dependency
  advisories (0 production).

### Ready-to-pick follow-ups (small, scoped)

- Done (v1.46): phone immersive view — single tap hides topbar, timeline,
  nav and info sheet together and refits the gallery
  (`setPhoneImmersive` in `src/main.ts`, `CanvasInteraction.onSingleTap`).
- Done (v1.46): touch short-landscape side rail (CSS in `main.scss` C3
  block; `Timeline.ts` follows the list's flex direction; the extended
  `phoneTouchQuery` in `src/main.ts` covers landscape phones).
- Photo room on phones: optional background parallax driven by the tilt
  (the room swipe is done, v1.46).
- A flick assertion in the photo-room browser suite (fast drag → glide →
  spring-back inside the photo).
- Split the photo-room browser suite per viewport for parallel CI jobs.
- Room camera: split-layer raster (sharp during zoom), pointer-anchored wheel
  modifier, a 1×–6× zoom indicator shared with the gallery, and a gallery
  reset drift check (`FINDINGS.md` v1.44/v1.45).

### Ideas for further development (brainstorm)

- Hub panorama: pinch-to-zoom with the shared model; slide the next room's
  photo in during an edge pull; deep links to an artwork.
- Gallery: long-press for artwork details; share sheet (`navigator.share`).
- PWA: manifest + offline cache of the published artworks.
- Phone performance: lazy decode for off-screen hub artworks and WebP room
  photos (artwork derivatives and the editor split are done, v1.46).
- Accessibility: larger-text layout checks; "reduce chrome" toggle.
- Content: audio guide per artwork, curator-chosen exhibitions, visitor-facing
  metadata sheets.
- Tooling: real-device diagnostics overlay (gyro permission, DPR, safe areas,
  frame time); Lighthouse mobile budget; visual baselines per phone viewport.
