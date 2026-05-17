# FINDINGS

## 2026-05-17 - Local preview architecture

- A plain Vite application entry is not sufficient for customer handoff when the site must open directly from `file://`.
- The repository therefore needs two entry paths:
  - `app.html` for development with Vite
  - root `index.html` as a launcher to the committed preview build
- The committed preview should avoid browser module resolution edge cases by using a classic script bundle.

## 2026-05-17 - Gallery interaction limits

- Hardcoded zoom and pan numbers were not robust enough for mixed artwork formats.
- Correct pan behavior must be derived from actual fitted artwork dimensions, viewport aspect ratio, and camera FOV.
- A deep zoom limit must keep the camera in front of the artwork plane to avoid invalid inspection states.
- Hover/rotation control should not disappear at certain zoom levels; instead it should be reduced in strength when close-up inspection is active.

## 2026-05-17 - Side preview fitting

- Fixed-size preview geometry causes visible stretching on portrait, square, and ultra-wide artworks.
- Aspect-ratio-preserving scaling is the minimum acceptable solution for the current preview rail.
- Future refinement may still improve perceived balance by adding framed preview containers or elegant crop rules for extreme formats.

## 2026-05-17 - v0.01 execution planning

- The remaining v0.01 work should be planned as vertical slices, not horizontal refactors.
- The structured artwork metadata model should be implemented before final assets, thumbnails, accessibility labels, and screenshots because those later slices depend on stable content fields.
- WebGL fallback, quality presets, fullscreen mode, and documentation screenshots are all suitable v0.01 slices, but each should stay narrowly scoped and reserve larger systems for future passes.
- A future CMS should not be implemented in v0.01; v0.01 should only prepare a local static metadata model that can later map to CMS fields.
- Documentation screenshots and architecture diagrams should be treated as a customer handoff slice, not as incidental polish.

## Validation notes

- `npm run build` succeeded after the current interaction and documentation changes.
- `npm run lint` succeeded and still reports only the known TypeScript parser support warning.
