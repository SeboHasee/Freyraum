# FREYRAUM — Customer Picture Guide
> Latest markdown audit: 2026-10-14 (v1.32 wall-following artwork placement sync).

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
- The editor panel on the right has three tabs (all German), in workflow order:
  1. **Raum** — the room bar (*Raum 1 von 1*, ◀ ▶, coloured room chips),
     **+ Neuer Raum**, **Raum duplizieren**, **Raum löschen** (asks whether the
     room's artworks move to the previous room or become *Nicht platziert*),
     an optional room name, and **◀ Früher / Später ▶** to change the order
     visitors walk through. Below: the wall check with
     **Wandecken bearbeiten**, **Grüne Fläche bearbeiten**, **Zurücksetzen**,
     the optional tick **Grüne Fläche geprüft ✓**, the view switch
     **Ganzer Raum / Ausgewählte Wand**, and a collapsed **Erweitert** section
     (safe area, entrance area, room boundary, reset all geometry, background).
  2. **Bilder** (main tab) — the four places of the current room (front left,
     front right, left wall, right wall; empty places are dashed), the selected
     artwork's values in metres/centimetres, **Im grünen Bereich zentrieren**,
     **Bild entfernen**, **Bild ersetzen (Vorschau)**, and the list of all
     artworks grouped into *In diesem Raum*, *In anderen Räumen* and
     *Nicht platziert*.
     - Click an empty place, then click an artwork to hang it there (or drag
       the artwork from the list onto a place). Dragging one place onto another
       swaps the two artworks. **Leere Plätze automatisch füllen** fills the
       room's empty places with unplaced artworks.
     - Drag the artwork directly in the museum view; it stops at the green
       area, a doorway, or another artwork and slides along the limit. Arrow
       keys move a focused artwork 1 cm, 10 cm with Shift. Drag the red corner
       to resize it; the width follows the artwork's proportions.
     - Selecting an artwork that hangs in another room opens that room.
  3. **Speichern** — a status card (*Alles bereit*, *N Hinweise* or
     *N Fehler*), every message with its room and place (click it to jump
     there), **Konfiguration herunterladen**, **JSON kopieren**,
     **Datei öffnen**, **Letzte gültige Version wiederherstellen**, the setting
     for unplaced artworks, and **Erweitert: Diagnose und JSON**.
- The bar at the bottom of the panel always shows **↶ Rückgängig**,
  **↷ Wiederholen**, **Hilfslinien aus/ein**, and a status dot that opens the
  Speichern tab. Each room or artwork change is one undo step.
- **What blocks saving:** only real errors — a broken wall shape or green
  area, an artwork without its wall, a position that cannot be calculated, or
  a failed export check. Layout hints never block saving: outside the green
  area, near a doorway, overlapping, smaller than 72 px on screen, green area
  not ticked as checked, an empty room, or unplaced artworks.
- **Rooms are your decision.** Each room holds up to four artworks (two on the
  front wall, one on each side wall) and shares the same walls and green areas.
  A new room copies the current room's layout without artworks. Empty rooms are
  skipped in the gallery.
- **Unplaced artworks** stay hidden in the gallery by default and are always
  listed under *Nicht platziert*. In the Speichern tab you can instead let the
  gallery hang them automatically in extra rooms (the old behaviour).
- A short guide is shown once; the **?** button shows it again. Volume,
  settings and fullscreen icons are hidden while the editor is open.
- Replace `customer-artworks/museum-hub.json` with the downloaded file and run
  `Update Gallery.command` or `Update Gallery.bat`.
- Reopening the generated editor after an update loads cache-busted artwork and
  audio bundles, so it does not intentionally reuse the previous import.
- The current `customer-artworks/museum-hub.json` format is **version 5**:
  camera, room envelope, calibrated front/left/right wall transforms, drawable
  regions, doorway exclusions, visual tokens, exact artwork IDs, normalized
  wall-local slot placement, and mounted sizes live in the same file.
- The legacy calibration route remains available for developers and is documented
  in `docs/QUERY_PARAMETERS.md`. Customers should use
  `OPEN_ARTWORK_EDITOR.html`. First
  align each green mounting-zone boundary with the visible doorway, corner,
  floor, and ceiling.
  Then select and drag each artwork or enter exact values. Red outlines mark
  errors that block saving; amber marks layout hints. Use Copy or Download,
  replace `customer-artworks/museum-hub.json`, rerun Update Gallery, and re-import
  that file once to confirm an identical round trip.
- The editor never moves an explicitly assigned work to another wall.
- Loading never moves a saved position. If a saved artwork no longer fits the
  green area, it keeps its place, gets a dashed red outline, and is listed as a
  warning so you can move it yourself. After changing a wall or green area,
  artworks are pulled back inside automatically when possible.
- Wall corner handles appear only while **Wandecken bearbeiten** is on. Blue
  safe-zone and green mounting-zone handles are editable. **Datei öffnen**
  accepts files with a different number of rooms or a different artwork
  assignment; it rejects unreadable files and files whose camera, room shape or
  walls differ. Artwork IDs that are not in the current artwork list are
  reported and dropped; the rest is imported.
- Older hotspot arrays and v1/v2 slot boxes still load through migration, but
  they should be re-saved from the current calibration flow.
- Each museum room shows at most four works: two on the front wall and one on
  each side wall. Files saved by the editor list their rooms (`rooms`); older
  files without that list still continue further artworks automatically in
  extra rooms, exactly as before.
- Canonical placement fields are `horizontalPosition`, `centerHeight`,
  `physicalHeight`, and `mountingGap`; the image aspect ratio determines width.
- If a screenshot shows more than four works in one room, preserve that exact
  preview/deployment and its generated `customer-artworks.js` before rerunning
  Update Gallery. It may not match the current checked-in config.

## Online bearbeiten (v1.38)

Once the site owner has set up the save service (`docs/ONLINE_EDITOR_SETUP.md`), you can edit
the gallery directly on the website. No GitHub account is needed.

1. **Öffnen.** Open the gallery and use any of these:
   - type `bearbeiten` on the keyboard;
   - press and hold the FREYRAUM logo or the room title for 1.5 seconds;
   - open `…/Freyraum/bearbeiten/`.
2. **Anmelden.** The editor opens in the **Speichern** tab with "Bearbeiten anmelden".
   - Enter the password.
   - Without a login the editor is only a preview.
   - The login lasts until you close the tab (at most 8 hours).
3. **Bearbeiten.**
   - Rooms, walls and placing work as before.
   - **New picture:** go to **Bilder → Bild hinzufügen**. Enter a title and the artist, then drop a picture or choose one.
     - Large pictures are scaled down to 4096 px; your original stays on your computer.
     - The picture appears in the list straight away and can be placed.
   - **New background:** go to **Raum → Erweitert → Hintergrund**. Choose an existing background or a new one from your computer.
     - If its format differs, the editor asks you to check the walls.
   - Your work is kept in the browser. After a crash the editor offers "Entwurf wiederherstellen".
4. **Veröffentlichen.**
   - **Speichern** lists everything under "Wird veröffentlicht".
   - Press **Veröffentlichen**. Errors block publishing; hints do not.
   - The progress reads "Wird hochgeladen… → Wird geprüft… → Wird veröffentlicht (~2 Min) → Online ✓". With approval mode it shows "Wartet auf Freigabe" until the owner approves.
   - The editor then reloads with the published state.
5. **Rückgängig.** **Speichern → Frühere Version wiederherstellen** lists the last 10 published layouts.

If the editor says "Neuere Version vorhanden – bitte neu laden", someone else
published in the meantime. Reload the page; your draft stays in the browser.
"Konfiguration herunterladen" stays available as a backup.

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

- Online editing setup (site owner): `docs/ONLINE_EDITOR_SETUP.md`
- Text sidecars: `docs/CUSTOMER_TEXT_GUIDE.md`
- Image size limits and operator guidance: `docs/IMAGE_MAINTENANCE_GUIDE.md`
- Query/config reference: `docs/QUERY_PARAMETERS.md`
- Historical release context: `CHANGELOG.md`
