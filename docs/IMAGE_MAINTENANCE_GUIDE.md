# FREYRAUM — Image Maintenance Guide

This guide explains how the image system works after the v0.07 importer update.

It is meant for the person who maintains the project folder, supports the customer,
or needs to understand why an image does or does not appear in the gallery.

## Responsive and touch support — final technical status (v0.11)

The v0.11 final technical coding plan (2026-05-18) identifies 7 code-level bugs, validates the proposed fixes against current official browser/accessibility guidance, and maps every fix to specific source files. The customer artwork pipeline (`webglImage` data URLs, aspect-ratio handling, importer, diagnostics) is unaffected by the responsive changes. The implementation preserves all artwork reliability work from v0.07–v0.10 while adding:

- `src/utils/device.ts` — device capability model and layout tier detection
- `src/interaction/CanvasInteraction.ts` — unified Pointer Events + Touch Events (fixes passive-listener pinch bug and synthetic-mouse duplication)
- `viewport-fit=cover` + safe-area CSS — controls no longer hidden under notch/home indicator
- 4-tier SCSS breakpoints — proper phone portrait, phone landscape, tablet portrait, tablet landscape layout states
- Compact info-panel mode on phones
- Debounced resize coordinator — Three.js framebuffer updates correctly on orientation change
- Explicit WebGL context-loss handling and recovery guidance
- Possible later `ResizeObserver` follow-up for high-DPI drawing-buffer accuracy

Support checks after implementation should include phone portrait, phone landscape, tablet portrait, tablet landscape, desktop, keyboard-only, reduced motion, high contrast, and no-WebGL fallback states. The QA matrix is documented in `plan.md`.

## Planned v0.14 tuning status (close zoom, pan edges, large-vertical reset fit)

Planned on 2026-05-19. No runtime code changed in this pass.

Source audit of `src/gallery/GalleryManager.ts` shows:

- closer zoom still depends on both `MIN_CAMERA_Z` and `MIN_VISIBLE_ARTWORK_FRACTION`, so the next pass must tune both together;
- the current pan looseness comes from `INSPECTION_OVERSCROLL = 3.0` being added as a flat constant in `getPanLimits()`;
- large vertical artworks still rely on one global `RESET_VIEW_FRAME_MARGIN = 1.04`, so the next pass should add a portrait-aware reset boost instead of moving every artwork farther away.

## Current v0.13 status (nav buttons, zoom range, pan range, icon centering)

Implemented on 2026-05-18. This pass fixed four customer-reported bugs after the v0.12 zoom/framing/timeline pass:

- left/right nav buttons were cut off by the timeline → fixed with explicit `bottom: calc(192px + var(--safe-bottom))` positioning and `--chrome-bottom` raised to 200px+;
- zoom range was too narrow → `MIN_CAMERA_Z` lowered to 0.5, `MIN_OVERVIEW_CAMERA_Z` raised to 18.0, `OVERVIEW_HEADROOM_Z` raised to 3.5;
- pan range too tight when zoomed in → `INSPECTION_OVERSCROLL` raised to 3.0 world units;
- gear and fullscreen icons not centred → added icon span CSS to clear inline descender gap.

Changed files: `src/gallery/GalleryManager.ts`, `src/styles/main.scss`.

## Previous v0.12 status (zoom / tall-picture framing / timeline visibility)

Implemented on 2026-05-18. This pass focused on three viewing issues rather
than the import pipeline:

- allow a farther zoomed-out overview distance;
- make the standard/reset view fully show very tall artworks;
- keep the active timeline thumbnail fully visible instead of clipping it.

The implementation changed `src/gallery/GalleryManager.ts` for zoom/framing
logic, `src/main.ts` for art-safe viewport measurement and resize/refit wiring,
and `src/timeline/Timeline.ts` + `src/styles/main.scss` for active timeline
visibility. The importer, generated manifests, and `webglImage` path are not
part of this follow-up.

## Quick overview

The gallery is maintained through one input folder:

- `/home/runner/work/Freyraum/Freyraum/customer-artworks/inbox/`

The customer puts image files there and then runs:

- `/home/runner/work/Freyraum/Freyraum/Update Gallery.command` on macOS
- `/home/runner/work/Freyraum/Freyraum/Update Gallery.bat` on Windows

That updater runs:

- `/home/runner/work/Freyraum/Freyraum/scripts/import-artworks.mjs`

The importer scans the inbox, reads each file's dimensions, copies preview-ready
files into the preview folder, generates metadata, and writes the runtime file
the gallery actually reads.

## Current v0.10 rendering fix: Hoch close-up spots and portrait reset zoom

v0.10 is implemented for occasional strange artifacts in close-up view when the
quality / performance setting is **Hoch**, including the parallax follow-up for
hole-like duplicated-picture patches. This is separate from the v0.09
uploaded-image fix: still confirm that the image is not a fallback
(`fallbackUsed: false`) and that `webglImageSource` is correct.

The implemented fix reduces procedural height micro-noise and specular blob
peaks, keeps albedo on stable UVs instead of parallax-shifted UVs, reduces Hoch
parallax scale, raises Hoch self-shadow bias, lowers Hoch specular strength, and
computes reset zoom from the framed artwork dimensions. For support, use
`?debug=info` and inspect `show-artwork-complete` for `resetZoom`, `minZoom`,
`maxZoom`, `parallaxScale`, `specularStrength`, `selfShadowBias`,
`fallbackUsed`, and `webglImageSource`.

## Folder and file roles

### Customer-managed input

- `/home/runner/work/Freyraum/Freyraum/customer-artworks/inbox/`
  - The only folder the customer should edit
  - Add, remove, or rename images here

### Generated files

- `/home/runner/work/Freyraum/Freyraum/customer-artworks/artworks.json`
  - Human-readable generated manifest
- `/home/runner/work/Freyraum/Freyraum/customer-artworks/artworks.json.bak`
  - Backup of the previous manifest
- `/home/runner/work/Freyraum/Freyraum/customer-artworks/last-import-report.txt`
  - Plain-language result of the last import
- `/home/runner/work/Freyraum/Freyraum/customer-preview/images/`
  - Generated working image copies used by the preview
- `/home/runner/work/Freyraum/Freyraum/customer-preview/customer-artworks.js`
  - Runtime injection file that sets `window.__FREYRAUM_ARTWORKS`

### Application fallback

- If no customer images exist, or the generated list is empty, the app falls back
  to the built-in demo artworks from `src/config/artworks.ts`.

## How the maintenance flow works

1. Images are added to `customer-artworks/inbox/`.
2. The updater launches `scripts/import-artworks.mjs`.
3. The importer:
   - scans the inbox
   - ignores hidden files
   - sorts files
   - checks supported extensions
   - reads image dimensions
   - generates stable IDs and titles from file names
   - copies usable files into `customer-preview/images/`
   - writes `artworks.json`
   - writes `customer-artworks.js`
   - writes `last-import-report.txt`
4. `customer-preview/app.html` loads `customer-artworks.js`.
5. `src/main.ts` reads `window.__FREYRAUM_ARTWORKS`.
6. The runtime validates the injected entries with `sanitizeInjectedArtworks()`.
7. The validated list is passed into:
   - `GalleryManager`
   - `Timeline`
   - `InfoPanel`

That means the main artwork view, side panels, timeline, and metadata all come
from the same generated artwork list.

## Supported formats

### Works best

- JPG / JPEG
- PNG
- WebP
- GIF
- SVG
- AVIF

### Risky but still accepted with warnings

- HEIC
- HEIF
- TIFF / TIF
- BMP

These may not display correctly in all browsers. If one fails, convert it to JPG
or PNG and run the updater again.

### Skipped

RAW camera formats are skipped with a clear message in the report, for example:

- CR2 / CR3
- NEF
- ARW
- DNG
- ORF
- RW2
- RAW
- PEF
- SRW

## Naming and ordering rules

The importer builds display titles from file names.

Examples:

- `01-sunset-at-the-lake.jpg` → `Sunset At The Lake`
- `02_forest path.png` → `Forest Path`
- `IMG_8847.JPG` → `Img 8847`

If you want a stable display order, prefix files with numbers:

- `01-...`
- `02-...`
- `03-...`

## Dimensions and aspect ratios

The system is designed to handle:

- portrait
- landscape
- square
- ultrawide
- mixed image sets

The importer records each image's native dimensions in the generated manifest.
The runtime then uses that information to preserve aspect ratio across:

- the main artwork presentation
- the side panels
- the timeline thumbnails
- the info panel metadata
- existing material / lighting / inspection effects

Images are not intentionally stretched to a fixed ratio.

## What to do for common maintenance tasks

### Add new images

1. Copy them into `customer-artworks/inbox/`
2. Run `Update Gallery`
3. Open `customer-artworks/last-import-report.txt`
4. Open `index.html` and verify the result

### Remove images

1. Delete them from `customer-artworks/inbox/`
2. Run `Update Gallery` again

The preview image folder is regenerated, so removed inbox files disappear from
the generated gallery set after the next import.

### Rename images

1. Rename the file in `customer-artworks/inbox/`
2. Run `Update Gallery` again

This changes:

- the generated ID
- the generated title
- the generated output file name

### Reorder images

Rename files with numeric prefixes in the desired order, then run the updater again.

## Where to check when something goes wrong

### First check

- `/home/runner/work/Freyraum/Freyraum/customer-artworks/last-import-report.txt`

This is the main support document. It tells you:

- which files were imported
- which files need attention
- which files were skipped

### If the gallery still looks wrong

Check these files:

- `/home/runner/work/Freyraum/Freyraum/customer-artworks/artworks.json`
- `/home/runner/work/Freyraum/Freyraum/customer-preview/customer-artworks.js`

If the image is missing there, the importer did not accept it.

If it is present there but missing in the browser, the likely reasons are:

- the format is risky and the browser cannot display it
- the source image is too large for that machine/browser
- the file is corrupted

### Critical case: timeline works, 3D painting does not

If the image appears in the timeline but not on the central 3D painting, the
importer and DOM image path probably worked. The failure is likely in the
Three.js/WebGL texture-loading path used by the 3D painting.

For v0.08 this is the highest-priority image-maintenance bug. The planned fix is
documented in `plan.md` under **v0.08 Critical Plan — Imported images must render
on the actual 3D paintings**.

Support should collect:

- `customer-artworks/last-import-report.txt`
- `customer-artworks/artworks.json`
- `customer-preview/customer-artworks.js`
- a debug diagnostics snapshot from `window.__FREYRAUM_DIAGNOSTICS__.snapshot()`

The important diagnostic question is whether the central painting used the real
customer image texture or silently used a generated fallback texture.

### For developer-level debugging

Use:

- `?debug=info`
- `?debug=verbose`

and inspect:

- `window.__FREYRAUM_DIAGNOSTICS__.snapshot()`

The runtime diagnostics system records boot, gallery, texture, and validation events.

## Important maintenance rules

- Only edit files in `customer-artworks/inbox/` for normal image maintenance.
- Do not hand-edit `customer-preview/customer-artworks.js`.
- Do not hand-edit `customer-artworks/artworks.json` unless you are debugging.
- Always run `Update Gallery` after changing the inbox.
- If a file format is unreliable, convert it to JPG or PNG instead of trying to patch the generated files manually.

## Recommended support workflow

When helping a customer:

1. Ask for `customer-artworks/last-import-report.txt`
2. Ask what files they placed into `customer-artworks/inbox/`
3. If needed, inspect `customer-artworks/artworks.json`
4. If needed, inspect `customer-preview/customer-artworks.js`
5. If the file type is risky, convert to JPG/PNG and repeat the import

## Related files

- `/home/runner/work/Freyraum/Freyraum/scripts/import-artworks.mjs`
- `/home/runner/work/Freyraum/Freyraum/scripts/write-local-preview.mjs`
- `/home/runner/work/Freyraum/Freyraum/src/main.ts`
- `/home/runner/work/Freyraum/Freyraum/src/gallery/GalleryManager.ts`
- `/home/runner/work/Freyraum/Freyraum/src/timeline/Timeline.ts`
- `/home/runner/work/Freyraum/Freyraum/src/ui/InfoPanel.ts`
- `/home/runner/work/Freyraum/Freyraum/docs/CUSTOMER_PICTURE_GUIDE.md`
