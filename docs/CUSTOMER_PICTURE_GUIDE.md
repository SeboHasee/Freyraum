# FREYRAUM — Customer Picture Guide
> Latest markdown audit: 2026-10-21 (v1.44 photo-room zoom-out drift).

This guide documents the current customer workflow only.

## Choose your way

| You want to… | Use | Section |
|---|---|---|
| work on your computer without installing Node.js (recommended) | the **FREYRAUM Editor** app | "FREYRAUM Editor (App)" |
| edit the live gallery in the browser | the online editor | "Online bearbeiten" |
| work with the folder and scripts only | `Update Gallery` + `OPEN_ARTWORK_EDITOR.html` | the sections below |

The editor itself (rooms, places, dragging) is the same everywhere; see
"Museum hub placement".

## One-time setup (scripts only)

The FREYRAUM Editor app and the online editor need no setup here.

1. Install Node.js LTS (22 recommended): https://nodejs.org
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
- Copies configured inspection-room photos into `customer-preview/backgrounds/`
  so the local gallery can open them after Update Gallery alone. Missing source
  photos are listed as warnings in the import report.
- Injects the current museum-hub wall-plane config (`customer-artworks/museum-hub.json`)
  into the preview build.
- Updates:
  - `customer-artworks/artworks.json`
  - `customer-preview/customer-artworks.js`
  - `customer-preview/customer-audio.js`
  - `customer-artworks/last-import-report.txt`

## Inspect in a photo room

In the gallery, choose **Fotoraum** to show the selected artwork in one of four
photos: **Schlafzimmer**, **Wohnraum**, **Wohnbereich**, or **Büro**. The room
view reuses the gallery's thumbnail timeline, active-work indicator, scrolling,
and count; selecting artwork here or in the gallery changes the same shared
selection. Use the separate room selector to switch photographs and
**Zurück zur Galerie** to leave the photo view.

When zoomed in and the photo bounds allow movement, drag the photo to pan. Use the
mouse wheel, pinch, or grouped zoom buttons to zoom, and **Fotoansicht
zurücksetzen** to restore it. The artwork stays the same configured size on the
wall and grows on screen together with the photo as you zoom. Zoom buttons smoothly
and the mouse wheel bring the artwork center toward the screen center, while pinch
stays anchored to the fingers. Double-click (or double-tap) zooms in at that spot;
double-click again to return to the whole photo, just like the gallery. A nearby mouse gives a very subtle tilt
that eases back to neutral; stronger contact/directional shadows keep the print
attached to the wall. Shared audio, settings, fullscreen, and contextual help
remain available in the room view.

This is a bounded 2D camera over a still photograph—not orbiting or walking
through a 3D room. Run **Update Gallery** after downloading project changes; it
copies the configured source photos from `customer-artworks/Backgrounds/` into
the local preview. If a photo is missing, check the import report and restore
the exact configured source filename. The original room photos are preserved;
the configured `gallery-*.png` derivatives remove their pre-existing paintings
and frames. They retain the available source resolution with gentle sharpening;
upscaled copies would not recover detail absent from the originals.

In the placement editor's **Raum** tab, **Foto-Raum gestalten** lets you select
a configured photo room, adjust its four normalized wall corners, and edit the
artwork's wall-relative position and height. The preview uses the visitor
projection, and accepted changes remain part of undo/redo and the normal
save/export configuration.

## Museum hub placement

- Museum and editor use the same room photograph and calibrated artwork
  projection. The photograph is not replaced by an opaque 3D hall.
- The supplied background exists at
  `customer-artworks/Backgrounds/Museum_ohne_Bilder.png`. Preserve that exact
  spelling in the layout; `museum-ohne-bilder.png` is a different filename.
- All four default paintings are supplied: `Gatrenszene.png` (front-left),
  `Akt 27.png` (front-right, unchanged), `Fraktal.png` (left wall) and
  `Wunderbaum.png` (right wall). Keep the garden file's actual spelling;
  `Gatrenszene.txt` provides its display title “Gartenszene”.
- After downloading project updates or replacing `museum-hub.json`, run
  **Update Gallery.bat** / **Update Gallery.command**, then reopen root
  **index.html**. This regenerates the local customer data; editing source JSON
  alone cannot update its generated copy. The customer confirmed this workflow
  on 2026-10-18. A merged Pages deployment regenerates that data automatically.
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
  assignment; it rejects unreadable files and incompatible fixed camera, 3D
  room shape or wall-model data. Editable wall outlines are not the same as
  changing fixed 3D wall corners. Artwork IDs not in the current artwork list are
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

## FREYRAUM Editor (App)

The **FREYRAUM Editor** app is the easiest way to place pictures on your own
computer. It saves straight into your FREYRAUM project folder and updates the
gallery for you. **Node.js is not needed.**

1. **Installieren.** Download the newest version from the project's GitHub
   Releases page (`desktop-v…`). Before a release exists, test builds are under
   **Actions → "Desktop app (FREYRAUM Editor)" → a green run → Artifacts →
   FREYRAUM-Editor-Windows** (a zip; GitHub login needed). The installer is
   German, needs no admin rights and creates "FREYRAUM Editor" shortcuts;
   uninstalling never removes your project folder.
   - **Windows:** `FREYRAUM-Editor-Setup-….exe` (installs the app) or
     `…-portable.exe` (runs without installing).
     The first start may show "Der Computer wurde durch Windows geschützt".
     Click **Weitere Informationen → Trotzdem ausführen**. This happens once.
   - **Mac:** `…-arm64.dmg` for Macs with an Apple chip, `…-x64.dmg` for Intel
     Macs. Drag the app into *Programme*. Open it the first time with
     **Rechtsklick → Öffnen → Öffnen**. This happens once.
2. **Projektordner wählen.** On the first start the app asks for your
   FREYRAUM folder – the one that contains `customer-artworks` and
   `Update Gallery`. The app remembers it. To switch, use
   **Datei → Projektordner öffnen…**.
3. **Bearbeiten.** Everything works like in the browser editor:
   - **New picture:** **Bilder → Bild hinzufügen** (title, artist, then the picture).
     It appears in the list straight away and can be placed.
   - **New background:** **Raum → Erweitert → Hintergrund**.
   - If the app closes unexpectedly, it offers "Entwurf wiederherstellen" next time.
4. **Im Projekt speichern.** In the **Speichern** tab, press
   **Im Projekt speichern**. The status reads
   "Wird gespeichert… → Galerie wird aktualisiert… → Gespeichert ✓".
   - New pictures go to `customer-artworks/inbox/` (with a text file for title
     and artist), backgrounds to `customer-artworks/Backgrounds/`, and the layout
     to `customer-artworks/museum-hub.json`.
   - The previous layout is kept; **Frühere Version wiederherstellen** lists the
     last 10 saved layouts.
   - Errors block saving; hints do not.
5. **Online stellen.** The app saves **only on your computer**
   ("Lokal gespeichert – noch nicht online"). To put the changes online, publish
   as usual: commit and push the project folder, for example with GitHub Desktop
   (see "Publish to GitHub Pages" above).

Useful menu items: **Datei → Im Explorer/Finder zeigen**, **Datei →
Galerie-Vorschau öffnen** (the gallery as visitors see it), **Datei → Galerie
aktualisieren**, **Hilfe → Neue Version herunterladen…**.

If the app says "Neuere Version vorhanden – bitte neu laden", the layout file
was changed outside the app (for example by a Git pull). Use **Ansicht → Neu
laden**; your draft stays and can be restored.

If you open `OPEN_ARTWORK_EDITOR.html` in a browser instead, the editor still
works, but it can only download `museum-hub.json`; copy it into
`customer-artworks/` yourself and run Update Gallery.

## Online bearbeiten

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

- If Node.js is missing, install Node.js LTS and run again – or use the FREYRAUM Editor app, which does not need Node.js.
- If the report contains warnings, fix the listed files and run update again.
- If preview content looks stale, rerun update and refresh the page.
- If you open the preview in a fresh clone or freshly unzipped folder before
  running update, `customer-preview/customer-artworks.js` and
  `customer-preview/customer-audio.js` may not exist yet. Run
  `Update Gallery.command` / `Update Gallery.bat` once, then reopen the preview.
- If a painting appears as a grey FREYRAUM-style fallback or a hub title
  placeholder, keep the generated `customer-artworks.js` and `images/` output,
  then capture the diagnostics described in `docs/QUERY_PARAMETERS.md`.
  Distinguish museum/editor DOM images from the WebGL inspection gallery:
  decoded DOM images need a visible calibrated surface, while gallery textures
  also require GPU upload and pixel evidence. Preserve the exact route, room,
  background, config and screenshot before importing again.

## Related docs

- Desktop app (site owner: build, release, signing): `docs/DESKTOP_APP.md`
- Online editing setup (site owner): `docs/ONLINE_EDITOR_SETUP.md`
- Text sidecars: `docs/CUSTOMER_TEXT_GUIDE.md`
- Image size limits and operator guidance: `docs/IMAGE_MAINTENANCE_GUIDE.md`
- Query/config reference: `docs/QUERY_PARAMETERS.md`
- Historical release context: `CHANGELOG.md`
