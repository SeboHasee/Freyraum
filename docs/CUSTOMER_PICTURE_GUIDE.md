# Customer picture guide — how to add your own pictures

This guide is written for a non-technical customer. The goal for the next implementation pass is:

> Put picture files into one folder, double-click the preview, and the gallery updates automatically.

## Very short answer

### What works today

The current v0.06 preview does **not yet** have a customer drag-and-drop artwork folder. The pictures are still defined by the developer in `src/config/artworks.ts`, and the local preview is rebuilt into `customer-preview/`.

Today, the safe customer process is:

1. Put your picture files in one normal folder on your computer.
2. Name them clearly, for example:
   - `01-mountain.jpg`
   - `02-sea.png`
   - `03-city.webp`
3. Send that folder to the developer / maintainer.
4. The maintainer adds them to the gallery and rebuilds the preview.

### What should be built next

The planned v0.07 workflow is:

1. Open the FREYRAUM project folder.
2. Open `customer-artworks/inbox/`.
3. Drag your pictures into that folder.
4. Double-click one simple update file, for example `Update Gallery`.
5. Double-click `index.html` to view the finished gallery.

No code editing. No terminal. No metadata typing required.

## Recommended customer folder

Planned folder:

```text
customer-artworks/
  inbox/
    01-picture.jpg
    02-picture.png
    03-picture.webp
  processed/
    ...automatically generated safe web files...
  artworks.json
```

The customer should only touch:

```text
customer-artworks/inbox/
```

Everything else should be generated.

## Which image files should customers use?

Best choices:

- `.jpg` / `.jpeg` — best for photos and scans
- `.png` — best for graphics or transparent images
- `.webp` — good modern web format
- `.avif` — good modern web format, but older devices may be less reliable

Risky formats:

- `.heic` / `.heif` — common from iPhones, but not reliable in every browser
- `.tif` / `.tiff` — often not displayed directly by browsers
- camera RAW files like `.cr2`, `.nef`, `.arw`, `.dng` — not suitable for direct browser viewing

Planned automation should detect risky files and show a friendly message such as:

> This file type may not work in all browsers. Please export it as JPG or PNG.

## Picture size rules for customers

Customers should not need to resize manually. The planned automation should do it.

Still, these are good practical rules:

- Normal photos from phones or cameras are OK.
- Very large images are OK as input, but the updater should create smaller safe web copies.
- The original file should stay untouched.
- The gallery should use optimized copies for speed.

Planned generated sizes:

- main gallery image: max 4096 px on the long side by default
- thumbnail / side preview: smaller generated copy
- optional high-detail copy: only if needed for inspection mode

## File naming for customers

Simple is best:

```text
01-sunset.jpg
02-forest.jpg
03-portrait-of-maria.png
```

Avoid:

```text
IMG_8847 final FINAL 2 copy (new).HEIC
```

The planned updater should still accept messy names, but clean names make the order easier to understand.

## How titles should work

The planned automation should create titles automatically from filenames:

```text
01-sunset-at-lake.jpg → Sunset At Lake
```

Later, if needed, a simple optional text file can override titles:

```text
01-sunset-at-lake.jpg | Sunset at Lake | 2025 | Anna Example
```

But the first version should work without any text file.

## What the gallery should do automatically

The planned v0.07 importer should:

- find all image files in `customer-artworks/inbox/`
- ignore hidden system files like `.DS_Store`
- sort files by filename
- generate safe web copies
- read image width and height
- keep portrait, landscape, square, and ultrawide aspect ratios correct
- create German-friendly fallback metadata
- write an `artworks.json` manifest
- preserve the original files
- show clear warnings for unsupported formats
- never require the customer to edit TypeScript

## If something goes wrong

The customer-friendly updater should write a simple report:

```text
Gallery update finished.

Imported:
- 01-sunset.jpg
- 02-forest.png

Needs attention:
- 03-iphone.heic — please export as JPG if it does not show.
```

## Developer note

The current source of truth is still `src/config/artworks.ts`. This guide documents the desired customer-facing workflow and the immediate manual workaround. The implementation plan is recorded in `plan.md` under **v0.07 Plan — Customer-managed artwork folder and one-click importer**.
