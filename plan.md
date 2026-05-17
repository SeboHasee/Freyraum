# FREYRAUM Local Customer Preview Plan

## Findings

- The previous root `index.html` was a Vite development entry.
- It referenced `/src/main.ts`, which is TypeScript source code and requires Vite to transform imports, SCSS, and TypeScript before the browser can run it.
- When opened directly with a double click (`file://`), the browser cannot resolve the Vite `/src/main.ts` entry or bare module imports such as `three`, so the page appears blank.
- The application itself is not the issue; the problem is the distribution method.

## Immediate Fix

- Keep the Vite/TypeScript source application in `app.html` for development and production builds.
- Convert root `index.html` into a local one-click launcher.
- Build the customer-ready static version into `customer-preview/`.
- Use an IIFE/classic-script bundle for the customer preview because ES module bundles can be blocked or behave inconsistently when opened directly from `file://`.
- Post-process the generated preview bundle to replace non-security `Math.random()` calls inherited from bundled dependencies with `crypto.getRandomValues`-backed randomness where available.
- Commit `customer-preview/` so a downloaded ZIP can be opened locally without installing Node.js.

## How to Show the Website to a Customer

1. Download or copy the repository folder.
2. Double-click `index.html` in the repository root.
3. The browser opens `customer-preview/app.html` automatically.
4. If the redirect is blocked, click the visible “FREYRAUM Vorschau öffnen” button.

## Important Notes

- The preview works without a local web server because it uses a classic `<script src="./freyraum-gallery.js">` bundle instead of a browser ES module entry.
- The customer preview no longer depends on remote demo images. Artwork placeholders are embedded as SVG data URIs so the first customer demo can open offline.
- Future customer/offline demos should replace the embedded placeholders with optimized local brand-approved artwork assets in `src/assets/` or `public/assets/`.
- WebGL support is required. Very old browsers or disabled GPU acceleration can still prevent the 3D scene from rendering.

## Future Implementation Plan

- Replace embedded SVG placeholders with final local optimized artwork assets for the customer presentation.
- Add compressed texture variants for production delivery.
- Add a small preflight screen that checks WebGL support and shows a friendly fallback message.
- Add quality presets for integrated GPUs and battery-saving devices.
- Add CMS-ready data loading while keeping a local JSON fallback for demos.
- Add a deployment target such as GitHub Pages or Netlify for customer links.
- Add automated visual smoke testing for the customer preview build.

## Verification Notes

- `npm run build` generates `customer-preview/freyraum-gallery.js`, `customer-preview/style.css`, and `customer-preview/app.html`.
- `customer-preview/app.html` uses a classic script tag and relative paths, so it is safe for local `file://` opening.
- The build pipeline is split into `build:typecheck`, `build:preview`, and `build:preview-html` for easier debugging. The main `npm run build` chain intentionally uses `&&`, so `build:preview-html` only runs after type checking and preview bundling succeed.
- A headless Chromium smoke test against `file:///home/runner/work/Freyraum/Freyraum/customer-preview/app.html` produced a non-blank screenshot at `/tmp/freyraum-local-preview-offline.png`.
- `npm run lint` passes; it only prints a known TypeScript parser support warning from the current dependency versions.
