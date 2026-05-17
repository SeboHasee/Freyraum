# FREYRAUM Plan

## Documentation Rule

For this repository, every meaningful implementation must update the markdown documentation together with the code.

Minimum documentation updates for future work:

- update `plan.md` with current scope, findings, implemented items, and remaining items
- update `CHANGELOG.md` with a dated summary of shipped changes
- update `FINDINGS.md` with important technical observations and limitations
- update `README.md` when user-facing setup, controls, or workflow changes
- update `DOCUMENTATION_RULES.md` when the documentation process itself changes

## Current Baseline

- Root `index.html` is the one-click local launcher.
- `customer-preview/app.html` is the committed local customer preview.
- `app.html` is the Vite development entry.
- The local preview is built as a classic IIFE bundle so it works from `file://`.
- Demo artwork is currently embedded placeholder content for offline preview stability.

## Findings

### Local Preview Findings

- A Vite dev entry cannot be opened directly from `file://` because the browser cannot execute the raw TypeScript/module graph.
- A committed preview build is required if the customer should be able to launch the demo with one click.
- Relative script/style paths and a classic script bundle are the safest local preview format.

### Interaction Findings

- Previous zoom limits allowed the camera to move too close to the artwork plane.
- Previous pan limits were hardcoded and did not respond to aspect ratio or current zoom level.
- Portrait artworks therefore hit vertical inspection limits too early, while extreme zoom could reveal empty space.
- The side preview meshes used a fixed geometry size, which stretched non-square artwork ratios.
- Touch interaction only supported swipe navigation and pinch zoom; it did not support one-finger pan while zoomed in.

## Implemented Now

### Local Preview Foundation

- Added a one-click local launcher in root `index.html`.
- Added committed static preview output in `customer-preview/`.
- Added a separate Vite development entry in `app.html`.
- Added `vite.local.config.ts` and preview HTML generation.
- Replaced remote preview dependencies with embedded placeholder artwork and procedural material input for reliable offline demos.

### Interaction & Gallery Fixes

- Added shared texture sizing helpers in `src/utils/texture.ts`.
- Main artwork sizing now stores fitted artwork width/height after aspect-ratio preservation.
- Zoom is now clamped dynamically so the camera cannot move through or unrealistically inside the artwork.
- Pan is now clamped from real artwork dimensions, camera FOV, viewport aspect ratio, and current zoom level.
- Mouse hover rotation now stays available at every zoom level, with reduced intensity during deeper zoom.
- Mouse drag now pans when panning is possible and falls back to subtle rotation behavior when not.
- Touch interaction now supports one-finger panning when zoomed in and swipe navigation when not zoomed in.
- Side preview panels now preserve aspect ratio instead of stretching textures.

## v0.01 Scope

### v0.01 Implemented

- local one-click customer preview
- offline-safe placeholder artwork setup
- dynamic zoom clamp
- dynamic pan clamp
- touch pan while zoomed
- aspect-ratio-safe side previews
- documentation baseline for changelog, findings, and rules

### v0.01 Still Open But Realistic In One Pass With Claude 4.7 Or GPT 5.5

- replace placeholder artworks with final local optimized assets
- add reduced-motion mode and higher-contrast overlay treatment
- add explicit zoom UI controls and reset-view control
- add focus styles and keyboard-accessible timeline selection
- add a lightweight WebGL support fallback screen
- add quality presets for integrated GPU / battery-saving mode
- add timeline thumbnail aspect-ratio handling and loading states
- add fullscreen toggle and presentation mode polish
- add structured artwork metadata model for future CMS integration
- add documentation screenshots or architecture diagrams for customer handoff

## Future Phases After v0.01

- advanced canvas shader refinement
- content management integration
- multilingual content pipeline
- audio narration and accessibility audio layer
- analytics and multi-gallery support
- experimental WebGPU / VR path

## Verification Notes

- `npm run build` should regenerate the committed local customer preview.
- `npm run lint` should remain clean except for the known TypeScript parser support warning from current dependency versions.
- Interaction fixes should be manually tested in both `npm run dev` and by opening root `index.html` locally.
