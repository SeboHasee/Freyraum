# FREYRAUM — Customer Picture Guide
> Latest markdown audit: 2026-09-04 (v1.12 full conversation documentation sync).

This guide documents the current customer workflow only.

## One-time setup

1. Install Node.js LTS (18+): https://nodejs.org
2. Keep the FREYRAUM folder locally available.

## Update your gallery

1. Put picture files into `customer-artworks/inbox/`.
2. (Optional) Add matching text sidecars (`.txt`) for metadata.
3. (Optional) Add audio files to `customer-audio/inbox/`.
4. Run:
   - macOS: `Update Gallery.command`
   - Windows: `Update Gallery.bat`
5. Open `index.html` for the one-click launcher, or open
   `customer-preview/app.html` directly.

## Publish to GitHub Pages

To make changes live at https://sebohasee.github.io/Freyraum/:

1. Commit your inbox files and push to `main`:
   ```
   git add customer-artworks/inbox/ customer-audio/inbox/
   git commit -m "chore: update artworks"
   git push origin main
   ```
2. CI runs `npm run import:artworks` and deploys automatically.

See [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md) for the full operator flow.

## Current size limit for publishing

The current publish workflow still commits the source artwork files to GitHub.
That means GitHub’s platform limits apply directly:

- browser uploads: **25 MiB** per file
- regular Git warning: **50 MiB**
- regular Git hard block: **100 MiB**
- GitHub Pages site size: **1 GB**

Until the high-resolution publish workflow from `plan.md` is implemented, keep a
local archive of the original master files and put only GitHub-safe publish
copies into `customer-artworks/inbox/`.

## Supported image formats

- JPG/JPEG
- PNG
- WebP
- GIF
- SVG
- AVIF

## What “Update Gallery” does

- Imports and validates customer artworks.
- Copies usable assets into `customer-preview/images/`.
- Imports optional audio into `customer-preview/audio/`.
- Injects the current museum-hub wall-plane config (`customer-artworks/museum-hub.json`)
  into the preview build.
- Updates:
  - `customer-artworks/artworks.json`
  - `customer-preview/customer-artworks.js`
  - `customer-preview/customer-audio.js`
  - `customer-artworks/last-import-report.txt`

## Museum hub placement

- Double-click **`OPEN_ARTWORK_EDITOR.html`** in the main FREYRAUM folder. This
  opens the separate, file-safe Artwork Placement Editor. You do not need to
  edit a URL or start a development server.
- In the editor:
  1. Choose a wall and artwork in the right sidebar.
  2. Drag the artwork directly in the museum view.
  3. Drag its red corner handle to resize it without changing its proportions.
  4. Check the green usable wall area, then click **Grüne Wandfläche bestätigen**.
  5. Repeat for all walls. Resolve every red warning.
  6. Click **Konfiguration herunterladen** when the button becomes available.
- Replace `customer-artworks/museum-hub.json` with the downloaded file and run
  `Update Gallery.command` or `Update Gallery.bat`.
- The current `customer-artworks/museum-hub.json` format is **version 5**:
  camera, room envelope, calibrated front/left/right wall transforms, drawable
  regions, doorway exclusions, visual tokens, exact artwork IDs, normalized
  wall-local slot placement, and mounted sizes live in the same file.
- The legacy calibration route remains available for developers and is documented
  in `docs/QUERY_PARAMETERS.md`. Customers should use
  `OPEN_ARTWORK_EDITOR.html`. First
  align each green mounting-zone boundary with the visible doorway, corner,
  floor, and ceiling.
  Then select and drag each artwork or enter exact values. Red outlines mean
  export is blocked. Confirm each wall's green boundaries after alignment. Use
  Copy or Download only when all proof rows are green,
  replace `customer-artworks/museum-hub.json`, rerun Update Gallery, and re-import
  that file once to confirm an identical round trip.
- The editor never moves an explicitly assigned work to another wall.
- Older hotspot arrays and v1/v2 slot boxes still load through migration, but
  they should be re-saved from the current calibration flow.
- Each museum room shows at most four works: two on the front wall and one on
  each side wall. Further artworks automatically continue in another room.
- Canonical placement fields are `horizontalPosition`, `centerHeight`,
  `physicalHeight`, and `mountingGap`; the image aspect ratio determines width.
- If a screenshot shows more than four works in one room, preserve that exact
  preview/deployment and its generated `customer-artworks.js` before rerunning
  Update Gallery. It may not match the current checked-in config.

## Troubleshooting

- If Node.js is missing, install Node.js LTS and run again.
- If the report contains warnings, fix the listed files and run update again.
- If preview content looks stale, rerun update and refresh the page.
- If you open the preview in a fresh clone or freshly unzipped folder before
  running update, `customer-preview/customer-artworks.js` and
  `customer-preview/customer-audio.js` may not exist yet. Run
  `Update Gallery.command` / `Update Gallery.bat` once, then reopen the preview.
- If a painting appears as a grey FREYRAUM-style fallback or a hub title
  placeholder, keep the generated `customer-artworks.js` and `images/` output,
  then capture the diagnostics described in `docs/QUERY_PARAMETERS.md`. Local
  `file://` preview now prefers the importer-provided embedded `webglImage`
  whenever a hub wall would otherwise rely on a local file URL, so a persistent
  blank plane means both the primary source and the embedded recovery payload
  need inspection. Open the preview with the debug query documented in
  `docs/QUERY_PARAMETERS.md`, then export the route diagnostics before
  importing again; see `plan.md § v0.93`.

## Related docs

- Text sidecars: `docs/CUSTOMER_TEXT_GUIDE.md`
- Image size limits and operator guidance: `docs/IMAGE_MAINTENANCE_GUIDE.md`
- Query/config reference: `docs/QUERY_PARAMETERS.md`
- Historical release context: `CHANGELOG.md`
