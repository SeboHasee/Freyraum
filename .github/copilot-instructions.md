# FREYRAUM Copilot instructions
> Latest markdown audit: 2026-10-21 (v1.45 handoff implementation).

## Current context (v1.42)

- Museum and editor share photograph-backed DOM artwork; `MainMuseumHub` does
  not construct a `HubRoomRenderer`. Inspection-gallery WebGL remains separate.
  Current defaults and exact source filenames: `README.md` → "Place artworks".
- Inspection-gallery photo room uses configured background photos and projects
  the current gallery artwork. It reparents the single gallery timeline and
  shared help/audio/settings/fullscreen controls while open, then restores them;
  room selection stays separate from artwork selection. It has four configured
  views: Schlafzimmer, Wohnraum, Wohnbereich, and Büro. Their cleaned derivatives
  preserve the original source photos. Keep photo-room artwork inside the viewport
  across aspect ratios; preserve the room camera and projective registration when
  adjusting UI. Room camera frames must stay composite-only (scene transform +
  motion-only `.is-camera-moving`); never re-project or read layout per frame
  (v1.43, lesson 130); un-anchored zoom-outs scale about their fixed point (v1.44, lesson 131). A 2026-10-20 user screenshot again shows apparent top clipping in
  Wohnbereich; its build/config identity is unknown, so treat visual acceptance as
  open and compare the matching generated artifact before assigning cause. See
  `README.md` → "Inspect in a photo room" and
  `ARCHITECTURE_MAP.md`.
- Mobile (v1.41): all touch surfaces share `src/interaction/touchGestures.ts`
  (momentum, rubber band, snapping, tap slop, double tap). Gallery gyro tilt runs
  through `src/gallery/DeviceTiltController.ts` → `GalleryManager.setHoverTarget`.
  Narrow-portrait hub is a continuous panorama with an artwork strip
  (`src/hub/hubPanorama.ts`); never hide hub artworks by wall group. Phones
  (v1.42): utilities sit in `src/ui/PhoneUtilityMenu.ts` (placed by
  `placeUtilityControls` in `main.ts`); the compact info panel is a bottom sheet. Pure tests:
  `npm run test:touch-gestures`. Real-device acceptance is open (`docs/HANDOFF.md`).
- Local data is generated/ignored: after project updates run Update Gallery;
  full `npm run build` imports via `prebuild`. Local Vite base must remain `./`,
  production `/Freyraum/`. Root-index and production-base smoke are distinct.
  Customer confirmed the local four-painting room after Update Gallery;
  post-merge Pages/live acceptance is still separate. Next steps: `docs/HANDOFF.md`.
- Placement editor: `OPEN_ARTWORK_EDITOR.html` → `customer-preview/placement-editor.html`
  (deployed: `placement-editor.html`, typing "bearbeiten" in the gallery); UI modules in `src/hub/editor/`. Placement validity
  everywhere (editor, drag, loader, export) uses `evaluateDisplayedPlacement`
  in `src/config/museumHub.ts`; canonical placements are flagged, never
  relocated. Editor artwork size is compensated by `calibratedWallScaleAt`, so
  wall edits never stretch artwork. Rooms come from `museum-hub.json` `rooms`.
- Saving: online editor → save service in `worker/` with rules shared in
  `src/online/publishRules.ts`; FREYRAUM Editor desktop app in `desktop/`
  writes only through `scripts/local-project/projectStore.ts` and serves only
  allowlisted files at `freyraum://app/`; `file://` download fallback.
- Tests and CI: `docs/REGRESSION_TOOLING.md`. Active work: `plan.md`.
  Photo-room checks: `npm run test:gallery-room-view` and
  `npm run test:gallery-room-view:browser`. The latter checks file-photo display,
  shared selection, focus and control bounds across desktop/tablet/phone/short
  landscape. Phone suite: `npm run test:mobile-browser` (panorama, chrome
  coverage, phone menu, info sheet). `npm run validate:museum-hub` passes; it
  checks curated customer values as ranges. History: `CHANGELOG.md` and `docs/archive/`.

Use these repository-specific instructions before changing code or docs.

## Repository context first

- Inspect the current architecture before proposing changes: `src/main.ts`, affected modules under `src/`, `package.json`, existing docs, and recent entries in `plan.md`, `FINDINGS.md`, and `CHANGELOG.md`.
- Preserve the current Vite + TypeScript + three.js structure. Do not add dependencies unless the task cannot be solved with existing tools.
- Prefer small, reviewable changes that match existing patterns and keep customer-preview output in sync when runtime or style output changes.

## Architecture boundaries

- `src/main.ts` owns boot orchestration, diagnostics setup, lifecycle handling, UI wiring, resize coordination, preferences, and the render loop.
- `src/core/` owns renderer, scene, and post-processing infrastructure.
- `src/gallery/` owns artwork state, texture loading, mesh construction, navigation, zoom/pan bounds, and artwork layout.
- `src/materials/` owns painting surface fidelity and procedural texture generation.
- `src/ui/`, `src/timeline/`, and `src/interaction/` own DOM controls and user input.
- `src/hub/` owns the museum hub, projection math, and the placement editor (`src/hub/editor/`).
- `src/online/` owns save rules shared by the editor, `worker/`, and the desktop store.
- `worker/` is the Cloudflare save service; `desktop/` is the Electron FREYRAUM Editor (own `package.json`).
- `scripts/` owns customer artwork import, local preview generation, the local project store (`scripts/local-project/`), and the test scripts.
- `customer-preview/` is generated preview output; update it only when source changes require rebuilt customer assets.

## Development workflow

1. Understand the task and compare it against current repository patterns.
2. Identify risks, missing context, validation commands, and documentation impact.
3. Implement the smallest complete change.
4. Validate with existing scripts when applicable:
   - `npm install` on a fresh clone before lint/build.
   - `npm run lint`, `npm run build:typecheck`, `npm run build`
   - the focused tests for the touched area, listed in `docs/REGRESSION_TOOLING.md`
     (geometry, editor drag/rooms/publish, save service, local project, desktop app).
5. Self-review for correctness, edge cases, readability, performance, accessibility, and security.
6. Update docs when meaningful work changes behavior, architecture, workflow, or known lessons.

For full-repository audits, also run dependency/tooling checks that already exist (`npm audit`, lint/build, focused script syntax checks) and document warnings separately from regressions.

## Coding standards

- Keep TypeScript strict and avoid unused locals/parameters.
- Use existing diagnostics helpers instead of ad-hoc console logging for runtime signals.
- Treat reduced motion as a motion-only accessibility setting; do not reduce visual/material fidelity unless explicitly requested.
- Preserve WebGL/customer reliability safeguards: context-loss handling, idempotent disposal, page lifecycle suspension, and texture-memory warnings.
- Keep comments concise and reserved for non-obvious architecture, math, compatibility, or customer-support decisions.

## Documentation expectations

Follow `DOCUMENTATION_RULES.md`. For meaningful implementation work, update `plan.md`, `FINDINGS.md`, `CHANGELOG.md`, and relevant README/docs sections. Record failures and regressions as reusable lessons, not only successes.

When online research is requested, prefer official sources and record source URLs in `FINDINGS.md` with the exact repository decision they support.
