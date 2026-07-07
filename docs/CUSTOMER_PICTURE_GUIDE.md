# FREYRAUM — Customer Picture Guide

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
5. Open `customer-preview/app.html`.

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
- Updates:
  - `customer-artworks/artworks.json`
  - `customer-preview/customer-artworks.js`
  - `customer-preview/customer-audio.js`
  - `customer-artworks/last-import-report.txt`

## Troubleshooting

- If Node.js is missing, install Node.js LTS and run again.
- If the report contains warnings, fix the listed files and run update again.
- If preview content looks stale, rerun update and refresh the page.

## Related docs

- Text sidecars: `docs/CUSTOMER_TEXT_GUIDE.md`
- Query/config reference: `docs/QUERY_PARAMETERS.md`
- Historical release context: `CHANGELOG.md`
