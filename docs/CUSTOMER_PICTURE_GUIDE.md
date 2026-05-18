# FREYRAUM — Customer Picture Guide

Welcome! This guide explains how to put your pictures into the FREYRAUM gallery.

You do **not** need to use a code editor, the terminal, or any technical tool.
You only ever touch one folder and one button.

## Phone and tablet note

v0.11 already implemented the main phone/tablet hardening pass: touch gestures, safe-area handling, responsive breakpoints, compact info-panel mode, and better mobile WebGL reliability are in place. Desktop is still the main polished design, but the current build now works substantially better on phones and tablets than the original release.

## Current viewing follow-up

One customer-facing follow-up is now planned as **v0.12**:

- zoom-out should go farther than it does now,
- very tall pictures should already be fully visible in the normal/reset view,
- and the selected picture in the bottom timeline should stay fully visible.

That work is documented for the next implementation pass; the current build may still show these limitations on some artworks/layouts.

## What you need (one-time)

1. **Node.js** (free): install the LTS version from <https://nodejs.org>.
2. The **FREYRAUM** folder (this folder).

Your support person sets these up once. After that, you only do the steps below.

## How to update your gallery

1. Open the FREYRAUM folder.
2. Open the folder called **`customer-artworks`**, then the folder called **`inbox`**.
3. Drag your pictures into the **inbox** folder.
   - You can put in as many pictures as you want.
   - Any size or shape works: portrait, landscape, square, very wide, etc.
4. Go back to the FREYRAUM folder and double-click **`Update Gallery`**:
   - On macOS: `Update Gallery.command`
   - On Windows: `Update Gallery.bat`
5. A short report opens automatically when the update is done.
6. Double-click **`index.html`** (in the FREYRAUM folder) to view the updated gallery.

That's the whole workflow.

## Which file types work best

Best (always works): **JPG**, **PNG**, **WebP**, **GIF**, **SVG**, **AVIF**.

May not show in all browsers (warning, but copied anyway): **HEIC**, **HEIF**, **TIFF**, **BMP**.

Cannot show in any browser (skipped with a clear message): **camera RAW** files
(`.cr2`, `.cr3`, `.nef`, `.arw`, `.dng`, `.orf`, `.rw2`, `.raw`, `.pef`, `.srw`).

If you only have HEIC pictures from your iPhone, ask your support person to convert them
to JPG, or change your iPhone setting to take JPG photos.

## How the gallery picks titles

If your picture is named like this:

| File name                   | Gallery title       |
| --------------------------- | ------------------- |
| `01-sunset-at-the-lake.jpg` | Sunset At The Lake  |
| `02_forest path.png`        | Forest Path         |
| `IMG_8847.JPG`              | Img 8847            |

Numbers and underscores are removed; the rest of the file name becomes the title.

If you want a specific order, start the file names with numbers (`01-`, `02-`, `03-`).

## What the "Update Gallery" button actually does

It runs a small script that:

1. Looks in **`customer-artworks/inbox/`** for your pictures.
2. Reads each picture's size (width × height) and creates a friendly title.
3. Copies a working copy into **`customer-preview/images/`**.
4. Writes a list of all imported pictures into:
   - `customer-artworks/artworks.json` (human-readable)
   - `customer-preview/customer-artworks.js` (used by the gallery)
5. Writes a plain-language report to `customer-artworks/last-import-report.txt`.

Your original picture files are never changed or deleted.

## First-time on macOS (Gatekeeper)

The first time you double-click `Update Gallery.command`, macOS may say
"cannot be opened because it is from an unidentified developer".

Right-click (or Ctrl-click) the file → **Open** → **Open** again.
After this one-time approval, normal double-click works from then on.

## What you should not touch

These are managed by the **Update Gallery** button. If you delete them by accident,
the button will recreate them on the next run:

- `customer-artworks/artworks.json`
- `customer-artworks/artworks.json.bak`
- `customer-artworks/processed/`
- `customer-artworks/last-import-report.txt`
- `customer-preview/images/`
- `customer-preview/customer-artworks.js`

You only need to touch **`customer-artworks/inbox/`**.

## What happens if I do nothing

If you have not added any pictures yet, the gallery still opens and shows
the built-in demo artworks. As soon as you put pictures in the inbox and
run `Update Gallery`, the demos are replaced by your own pictures.

## Common questions

**Can I add more than four pictures?**
Yes. There is no limit. The timeline at the bottom of the gallery shows
every picture and scrolls if needed.

**Can I mix portrait and landscape and ultrawide pictures?**
Yes. Each picture keeps its own shape; the gallery does not stretch or
crop your pictures. If the timeline shape looks right but the big 3D painting
shape looks wrong, send the files listed in the troubleshooting question below
to your support person.

**My picture is huge (50 MB, 8000 pixels wide). Will it work?**
Most modern computers and browsers handle that. Very old computers may
struggle. If a picture does not appear, try exporting it at around
4000 pixels on the longest edge.

**My picture is HEIC and does not show. What do I do?**
Open the picture in Preview (macOS) or Photos (Windows), then export
it as JPG. Replace the file in the inbox with the JPG copy and run
`Update Gallery` again.

**I see scary messages in the report. What do I do?**
Send the report (`customer-artworks/last-import-report.txt`) to your
support person. The report is written in plain language and they can
read it without seeing the gallery.

**My pictures show in the timeline, but not on the big 3D painting.**
v0.09 is implemented: `Update Gallery` now embeds the exact uploaded image bytes
into the gallery data for the 3D painting (`webglImage`), which avoids the
unreliable local-file WebGL upload path.

If you still see a gradient placeholder instead of your picture:

1. Open the gallery in a browser.
2. Open the browser console (F12 → Console tab).
3. Look for any lines that say `show-artwork-fallback` or `load-fallback`.
4. Send the console output and `customer-artworks/last-import-report.txt` to
   your support person.

If the picture is HEIC, HEIF, TIFF, BMP, or a complex SVG, converting it to JPG
or PNG is the safest temporary workaround.

A developer can also append `?debug=info` to the gallery URL and run:

- `window.__FREYRAUM_DIAGNOSTICS__.snapshot()` for the full structured report
- `window.__FREYRAUM_DIAGNOSTICS__.summarize()` for a compact event summary
- `window.__FREYRAUM_DIAGNOSTICS__.exportJson()` to copy/paste full JSON logs

Look for `fallbackUsed: true` in the `show-artwork-complete` entries.

**I see strange artifacts only when quality is set to Hoch.**
This was addressed in v0.10 by retuning the Hoch procedural surface maps,
making parallax relief-only so it cannot shift the actual picture, and lowering
shadow/specular/parallax values. Please send your support person:

1. a screenshot,
2. the selected quality setting,
3. the selected lighting setting,
4. whether the artifact disappears when quality is changed to **Ausgewogen**,
5. whether it changes when the URL uses `?debug=info` and the developer presses
   `a` (albedo-only) or `s` (shadow-only).

This helps distinguish image-content issues from high-quality shader effects
if a new artifact appears.

If the artifact looks like a hole with the same picture behind it, include the
`show-artwork-complete` diagnostics entry and check `parallaxScale`; v0.10
expects Hoch to use the reduced value `0.012`.

**Very tall pictures look too close when I reset the view.**
This was also addressed in v0.10. Reset view now uses the framed picture
dimensions, so very vertical pictures should start farther away and show the
whole framed artwork. If it still looks too close, send a screenshot and the
`show-artwork-complete` diagnostics entry with `resetZoom`, `minZoom`, and
`maxZoom`.

There is now also a tracked v0.12 follow-up because some especially tall / long
vertical pictures can still feel too close in the standard view. If that
happens, include:

1. a screenshot of the first/reset view,
2. whether more manual zoom-out is still needed,
3. the `show-artwork-complete` diagnostics entry.

**The selected timeline picture looks cut off.**
This is also tracked for the next pass (v0.12). Please send:

1. a screenshot showing the selected thumbnail,
2. whether it happens after clicking, swiping, or using keyboard arrows,
3. the browser/device used.

## Debug / support tools (developer use)

If something goes wrong inside the running gallery, a developer can
collect a diagnostic report by appending `?debug=info` (or
`?debug=verbose`) to the preview URL and then opening the browser
console. The runtime keeps a leveled, deduplicated session log; a full
snapshot is available via `window.__FREYRAUM_DIAGNOSTICS__.snapshot()`.

Normal customer sessions stay quiet — only warnings and errors are
shown in the console by default.

## For developers

See `plan.md` (section "v0.07 Technical Implementation Guide") for the
full architecture, file layout, and code references.
