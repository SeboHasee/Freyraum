# FREYRAUM — Customer Picture Guide

Welcome! This guide explains how to put your pictures into the FREYRAUM gallery.

You do **not** need to use a code editor, the terminal, or any technical tool.
You only ever touch one folder and one button.

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
This issue is now fixed in v0.08. After running `Update Gallery` and opening
the gallery with the latest build, all imported images should appear on the 3D
painting with correct aspect ratios.

If you still see a gradient placeholder instead of your picture after the fix,
this means the WebGL texture upload failed for that specific image. This can
happen if the image file is corrupt, or if it is larger than the GPU's texture
size limit (very rare on modern hardware). To diagnose:

1. Open the gallery in a browser.
2. Open the browser console (F12 → Console tab).
3. Look for any lines that say `show-artwork-fallback` or `load-fallback`.
4. Send the console output and `customer-artworks/last-import-report.txt` to
   your support person.

A developer can also append `?debug=info` to the gallery URL and run
`window.__FREYRAUM_DIAGNOSTICS__.snapshot()` in the browser console to get
a full structured report. Look for `fallbackUsed: true` in the
`show-artwork-complete` entries.

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
