# CHANGELOG

## v0.01 - 2026-05-17

### Added

- shared texture sizing helper for consistent image fitting
- documentation baseline files: plan, changelog, findings, and documentation rules
- dynamic zoom and pan safety calculations based on artwork size and camera framing
- touch panning while zoomed in

### Changed

- main artwork zoom now stops before the camera can move unrealistically through the artwork plane
- pan limits now respond to artwork aspect ratio, viewport size, and zoom level
- hover rotation remains available across zoom levels with reduced intensity during close inspection
- side preview panels now preserve artwork aspect ratio instead of stretching
- README now documents controls and repository documentation expectations

### Fixed

- users could previously zoom so deep that the view could move into invalid inspection space
- portrait artworks previously hit vertical inspection limits too early because pan limits were hardcoded
- inactive side preview artworks were stretched by fixed panel geometry

## v0.00 - 2026-05-17

### Added

- one-click root launcher for local customer preview
- committed `customer-preview/` static output
- separate Vite `app.html` development entry
- local preview build pipeline and preview HTML generator
- offline-safe embedded placeholder artworks and procedural normal texture

### Fixed

- blank screen when opening the downloaded repository locally via `index.html`
