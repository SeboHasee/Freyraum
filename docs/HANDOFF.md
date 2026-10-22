# FREYRAUM Handoff Guide
> Latest markdown audit: 2026-10-22 (v1.46 merge readiness).

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

## Merge state (v1.41–v1.46, 2026-10-22)

- Branch/PR #27 (`copilot/mobile-view-optimizations`) is ready to merge;
  `main` holds v1.33–v1.40. v1.41–v1.42 rebuilt the phone experience,
  v1.43–v1.44 the desktop room zoom, v1.45 worked through the previous
  handoff, v1.46 cut downloads and finished the phone feel (`CHANGELOG.md`).
- v1.46 in short: deployed manifest without image bytes and WebP size
  variants (`scripts/build-web-images.mjs`, `src/utils/artworkImageSources.ts`),
  WebP background copies (`src/utils/webBackgrounds.ts`; the editor's
  calibration view keeps the PNG), lazy editor chunk
  (`src/hub/editor/editorModules.ts`), info-sheet stops, photo-room swipe,
  landscape timeline rail, tap-to-hide phone chrome (`setPhoneImmersive` in
  `src/main.ts`), zoom readout (`src/ui/ZoomIndicator.ts`), gallery zoom fixed
  point (`GalleryManager.coupledZoomPan`), deep links
  (`src/navigation/deepLink.ts`) with "Link teilen" (`src/ui/shareLink.ts`),
  and `npm test` = all no-browser checks (quality CI runs it). Numbers:
  `FINDINGS.md` (v1.46). Phone visit: 18.6 MB → 4.8 MB.
- Deploy note: CI's `npm ci` installs sharp, so `import:artworks` builds the
  WebP variants; without sharp the site falls back to the originals with a
  `validate:deploy` warning. The customer's "Update Gallery" does not run it.
- Earlier handoff sections are archived in
  `docs/archive/handoff-history-2026-10-22.md` and
  `docs/archive/handoff-history-2026-10-22-v1.46.md`.

### v1.46 validation (2026-10-22)

All run on the branch head; browser suites one at a time:

- `npm run docs:check-config-authority`, `npm run lint`,
  `npm run build:typecheck`, `npm run build`, `npm test`,
  `npm run test:frame-budget`, `npm run validate:museum-hub`,
  `npm run validate:deploy`.
- Photo-room browser suite: 42 checks pass (incl. flick glide, zoom readout).
- `npm run test:mobile-browser` passes (incl. immersive view and landscape
  rail). Known intermittent: the sheet step half → full (90 px handle drag)
  timed out in two runs; reruns passed. The check now prints the sheet stop,
  classes and the element under the handle, so the next failure shows whether
  the drag missed the handle or the stop logic declined it.
- Production-base smoke (`test:deploy-smoke` against a local `/Freyraum/`
  server) passes; it is not deployment evidence.
- One suite run failed while a build and probes ran beside it (lesson 142).

## Next-agent starting point

- Read `plan.md` → "Next development round" (deferred items D1, C5, D2, D4,
  E1/E2/E4/E5, F) and `FINDINGS.md` (2026-10-21/22), then `ARCHITECTURE_MAP.md`.
- New touch surfaces use `src/interaction/touchGestures.ts`; zoom steps use
  its shared curve (`wheelZoomFactor`, `ZOOM_STEP_FACTOR`); utility-control
  placement belongs only to `placeUtilityControls()` in `src/main.ts`.
- Checks: `npm test`, `npm run validate:museum-hub`, and after
  `npm run build` the photo-room browser suite and `npm run test:mobile-browser`
  (`docs/REGRESSION_TOOLING.md`). Run browser suites one at a time with no
  build or probe beside them, and stop stray headless Chrome between runs.
- Measure DOM-camera smoothness with `npm run measure:room-zoom`, not headless
  frame counts (lesson 130). Under SwiftShader, poll end states (lesson 132)
  and wait for transitions with `settleAnimations` (lesson 138).
- Customer decisions with defaults in place: loading colour (wall grey
  `#c7ced4`), gyro default (auto on Android, opt-in on iOS), hub snapping (soft),
  photo-room zoom cap 6×.

## Open items

### Owner and customer gates (cannot be done by an agent)

1. Click **Approve and run** for the CI checks on PR #27, then merge.
2. Live `/Freyraum/` smoke after the post-merge Pages deploy
   (`docs/DEPLOYMENT.md`); only that proves deployed content. Try a shared
   link (`?artwork=<id>&view=gallery`) on the live site too.
3. Real phones (iOS Safari, Android Chrome; portrait and landscape): gyro feel,
   flick feel, hub strip, info sheet stops, tap to hide the controls,
   landscape rail, room swipe and pinch, "Link teilen", loading and
   browser-bar colours.
4. Real desktop GPU (Chrome/Edge/Firefox, mouse and trackpad): zoom feel in
   both views, zoom readout, reset without sideways slide, and whether the
   motion layer looks soft during zoom-in (decides D1).
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
- Fraktal uses a 4096 px (desktop, ~67 MB GPU) or 2048 px (phone, ~17 MB)
  WebP on the deployed site; the local `file://` preview still uses the
  original. The build keeps the large-chunk warning (three.js; entry budget
  1.15 MB in `test:frame-budget`); dev-tool advisories only (0 production).
- Deferred v1.46 items: `plan.md` → "Next development round".

### Ideas for further development (brainstorm)

- Hub panorama: pinch-to-zoom with the shared model; slide the next room's
  photo in during an edge pull (C5).
- Gallery: long-press for artwork details; timeline auto-hide.
- Photo room: background parallax driven by the tilt.
- PWA: manifest + offline cache of the published artworks.
- Accessibility: larger-text layout checks; "reduce chrome" toggle.
- Content: audio guide per artwork, curator-chosen exhibitions, visitor-facing
  metadata sheets.
- Tooling: real-device diagnostics overlay (gyro permission, DPR, safe areas,
  frame time); Lighthouse mobile budget; visual baselines per phone viewport;
  photo-room browser suite split per viewport for parallel CI jobs.

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
