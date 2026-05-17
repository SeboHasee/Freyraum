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

## 2026-05-17 - v0.01 execution outcomes

- Structured artwork metadata can stay local-static while still mapping 1:1 to a future CMS schema. Required fields (`id`, `title`, `subtitle`, `description`, `year`, `medium`, `image`, `dimensions`, `alt`, `credit`, `tags`) cover the info panel, timeline, alt text, and content audit needs. Locale/translation fields are deliberately deferred — adding them now would create dead optional fields and pollute the v0.01 contract.
- The SVG-based embedded artwork generator delivers acceptable "final" v0.01 visuals without binary asset weight or `file://` loading edge cases. Treating it as the final asset pipeline avoided introducing image compression tooling that would not pay off until real customer artwork lands. The metadata-driven generator keeps every artwork's dimensions, palette, and aspect ratio centralized in `config/artworks.ts`.
- Timeline thumbnails need both intrinsic aspect ratio handling **and** a fixed frame size. A pure aspect-ratio approach caused width changes in the scroll strip and unstable focus targets. The implemented compromise — fixed 150 × 95 frame with the artwork rendered inside using its real aspect ratio and a shimmer skeleton — preserves layout while still respecting the artwork shape.
- The system `prefers-reduced-motion` media query is necessary but not sufficient. Users may want reduced motion during a presentation independent of OS settings, so the preferences store also exposes an explicit override that takes precedence and is mirrored to `data-motion` on `<html>` for SCSS to react.
- `prefers-contrast: more` is supported in modern browsers but inconsistent on Linux desktops, so high contrast also has an explicit toggle. The high-contrast theme is implemented as token overrides rather than a parallel stylesheet to keep maintenance cost low.
- A `data-presentation="on"` attribute on `<html>` is the lightest way to express "we are in customer demo mode" to CSS. It avoids JavaScript-driven class juggling and lets future surfaces opt into presentation polish with a single selector.
- Quality presets must be subscribed by every subsystem that owns expensive GPU work. Routing presets through a `QualityPreset` object instead of separate booleans makes future additions (e.g., MSAA, depth-of-field) a single field change rather than a refactor.
- The WebGL fallback must be installed **before** the loading overlay so the customer never sees a hanging spinner. The implementation now detects WebGL first, renders the fallback directly into `#app`, and bails out of the bootstrap chain.
- The fullscreen API is well supported but its exit can be triggered by the browser (e.g., Escape, OS gesture); the implementation listens for `fullscreenchange` so the `aria-pressed` state stays accurate regardless of who initiated the exit.
- The architecture diagram lives as a hand-authored SVG so it renders inline on GitHub without a build step and stays diff-friendly. Automated generation is reserved for a future pass.
- Validation results: `npm run lint` clean; `npm run build` clean; bundle grew from ~511 KB (gzip 129 KB) to ~528 KB (gzip 134 KB), within the v0.01 budget. CSS grew from 4.5 KB to 15.4 KB (gzip 3.4 KB) because of the design system, focus-visible rules, contrast theme, presentation mode, and timeline skeleton.

## 2026-05-17 - v0.01 execution planning

- The remaining v0.01 work should be planned as vertical slices, not horizontal refactors.
- The structured artwork metadata model should be implemented before final assets, thumbnails, accessibility labels, and screenshots because those later slices depend on stable content fields.
- WebGL fallback, quality presets, fullscreen mode, and documentation screenshots are all suitable v0.01 slices, but each should stay narrowly scoped and reserve larger systems for future passes.
- A future CMS should not be implemented in v0.01; v0.01 should only prepare a local static metadata model that can later map to CMS fields.
- Documentation screenshots and architecture diagrams should be treated as a customer handoff slice, not as incidental polish.

## Validation notes

- `npm run build` succeeded after the current interaction and documentation changes.
- `npm run lint` succeeded and still reports only the known TypeScript parser support warning.
