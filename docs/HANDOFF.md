# FREYRAUM Handoff Guide
> Latest markdown audit: 2026-10-22 (v1.46 next development round).

This guide covers current handoff and support operations.
Historical release-by-release details are in `CHANGELOG.md` and `docs/archive/`.

## What to hand off

- Current runtime behavior and constraints (reference `README.md`).
- Configuration behavior (`docs/QUERY_PARAMETERS.md`).
- Customer import/update workflow (`docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/CUSTOMER_TEXT_GUIDE.md`).
- Current image-size constraints and the high-resolution publishing roadmap (`docs/IMAGE_MAINTENANCE_GUIDE.md`, `plan.md`).
- Architecture ownership (`ARCHITECTURE_MAP.md`).
- Open active work (`plan.md`) and active findings (`FINDINGS.md`).
- Online editor and save service (`docs/ONLINE_EDITOR_SETUP.md`).
- FREYRAUM Editor desktop app (`docs/DESKTOP_APP.md`).

## Operations handoff (v1.38–v1.40)

- **Online save service:** the owner keeps the Cloudflare account, the Worker
  secrets (shared editor password, session key, GitHub App private key) and
  the repository-only GitHub App. Secrets live only in Cloudflare, never in
  the repository. Rotate the editor password with `wrangler secret put`; edits
  arrive as pull requests from `content/edits` unless `PUBLISH_MODE=auto-merge`.
  Steps: `docs/ONLINE_EDITOR_SETUP.md`.
- **Desktop releases:** builds run in `.github/workflows/desktop-release.yml`.
  Runs started by Copilot/bots need **Approve and run** in the Actions tab.
  Test downloads are the run artifact `FREYRAUM-Editor-Windows`; a release is
  published by **Run workflow** on `main` with "publish" (pre-release
  `desktop-v<version>`) or by pushing a matching `desktop-vX.Y.Z` tag. Raise
  `"version"` in `desktop/package.json` before each release.
- **Signing (future):** builds are unsigned (one-time SmartScreen/Gatekeeper
  warning). Adding the signing secrets listed in `docs/DESKTOP_APP.md` signs
  them without workflow changes; automatic updates require signing first.

## Customer presentation run-through

- **Use the tested local preview as the fallback:** after customer data is current
  via **Update Gallery**, open the project-root `index.html`. Use the live Pages
  URL only after a new post-merge deployment and live smoke succeed.
- Show the museum's four default artworks, enter the interactive gallery for
  selection/navigation, then open **Fotoraum** and demonstrate room selection,
  shared artwork selection, zoom, pan when the enlarged photo bounds allow it,
  and reset.
- If placement editing is in scope, open `OPEN_ARTWORK_EDITOR.html` and explain
  which save target is configured. Do not promise online saving or a signed
  desktop installer unless the owner has separately verified those services.
- Explain that the photo-room camera moves over a still image; it is not a 3D
  orbit/walk-through. Keep the Wohnbereich screenshot identity, customer review
  of all four cleaned room photos, and live deployment acceptance as open gates.

## Support diagnostics workflow

1. Reproduce issue with exact browser/device context.
2. Collect diagnostics via the documented diagnostics API in `docs/QUERY_PARAMETERS.md` (`exportJson()` preferred).
3. For performance/regression reports, run the tools documented in `docs/REGRESSION_TOOLING.md` (`checkInvariants()`, `startPerf()` / `stopPerf()`, and `checkTier1Thresholds()` where applicable).
4. Confirm whether behavior is expected under current startup mode/config.
5. For publish/update failures, confirm the asset path did not rely on oversized GitHub-tracked originals.
6. For a grey or blank artwork, first classify the route signature: gallery
   generated fallback, hub title placeholder, or blank local `file://` hub wall
   plane. Then check the `source-to-pixel-outcome` diagnostic entry for that
   artwork/route (via the documented diagnostics API); it names the resolved
   candidate and, on failure, the first failed stage (`candidate-selected`,
   `request`, `decode`, `compatibility-check`, `gpu-upload`, or
   `visible-pixel-probe`). Enable verbose diagnostics mode to also capture the
   bounded GPU visible-pixel probe result for an active WebGL path. For the
   photograph-backed museum/editor, inspect the decoded DOM image, visible
   artwork owner and calibrated transform instead. Its source-to-pixel outcome
   has `presentationPath: 'dom'`, native decoded source dimensions and null
   GPU/probe fields: this proves decode, not GPU upload or visible pixels.
   Keep source URLs redacted; inspection-gallery behavior is unchanged.
   In a healthy local-preview hub
   recovery, `candidateMode: "embedded-webgl-fallback"` is now expected when
   the declared image file URL is not WebGL-stable. Preserve the generated
   customer bundle before re-importing, and follow the implemented recovery in
   `docs/archive/plan-history-2026-10-17.md` § v0.93. Do not treat an importer report or a published asset file
   as proof that a browser uploaded visible artwork pixels.
7. If behavior differs from docs, treat as drift and update canonical docs in the same fix PR.
8. For a hub-layout mismatch, preserve the exact route/environment, visible room
   counter, commit/build identity, generated `customer-artworks.js`, injected
   `museum-hub.json`, resolved slot/page diagnostics, and screenshot before
   regenerating output. Confirm that only the active page group is visible,
   and museum/editor show the same photograph-backed DOM artwork projection.
   The 2026-10-18 source audit verified structural divergence from the former
   opaque WebGL room, not reproduction of the unavailable customer artifact.
9. Do not infer account usage or billing state from unavailable image/browser
   tooling; report the tool limitation independently.
10. For placement support, start from `OPEN_ARTWORK_EDITOR.html`. Preserve the
    exported JSON and exact generated editor. Confirm fixed configuration
    compatibility, complete canonical round trip and fresh cache-busted customer
    bundles before requesting a screenshot. Room/assignment changes are supported;
    green-zone confirmation is optional and hints do not block saving.

## v1.46 next development round (2026-10-22)

- Done: B1 web manifest without image bytes, B2 WebP size variants
  (`scripts/build-web-images.mjs`, runtime choice in
  `src/utils/artworkImageSources.ts`), B3 lazy editor chunk + bundle budget,
  C1 info-sheet stops, C2 photo-room swipe, B4a WebP background copies
  (`validate:deploy` checks them; the editor's calibration view keeps the
  original PNG). Numbers: `FINDINGS.md` (v1.46).
- Next in order: D1 split-layer raster, C3–C6, B4b (lazy hub artworks),
  D2–D5, E, F; G needs the customer. Checklist: `plan.md` →
  "Next development round".
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

- Timeline auto-hide with the rest of the phone chrome; refit via
  `galleryManager.handleViewportMetricsChanged()`.
- Short-landscape phone side rail instead of top/bottom bars.
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

## Handoff checklist

- [x] Current behavior validated against runtime code and focused regressions
- [x] Canonical docs linked (not duplicated)
- [x] Local update confirmed by customer (2026-10-18)
- [x] Done items removed from follow-up lists; history archived (2026-10-22)
- [x] Asset-size constraints and publish-path assumptions explicitly handed off
- [x] Known risks and deferred upgrades linked from maintenance docs
- [ ] Owner completes CI approval, merge, and new live Pages smoke verification

## Canonical references

- `README.md`
- `CHANGELOG.md`
- `docs/QUERY_PARAMETERS.md`
- `ARCHITECTURE_MAP.md`
- `CONTRIBUTING.md`
- `docs/DEPENDENCY_MAINTENANCE_PLAN.md`
- `docs/REGRESSION_TOOLING.md`
- `docs/IMAGE_MAINTENANCE_GUIDE.md`
- `docs/ONLINE_EDITOR_SETUP.md`
- `docs/DESKTOP_APP.md`
