# FREYRAUM — How to import painting text (v0.18 — shipped)
> Last full markdown audit: 2026-05-22 (v0.46 planned: zebra-frame artifact analyzed, realistic-metal research added, implementation plan documented; runtime unchanged until code pass).

## v0.29 customer-facing status note — preload/fidelity follow-up shipped

The v0.29 implementation keeps the loading screen visible until the main page, controls, timeline thumbnails, and every painting have been rendered/prepared behind it. First-visit lighting now uses the daylight-balanced `museum-neutral` profile for more objective painting brightness.



## v0.23 — Performance/Preloading Planning Audit

This Markdown file was refreshed during the 2026-05-21 all-docs sync. The current runtime is still v0.22; the open performance work is documented in `plan.md § v0.23`, with source-referenced audit notes in `FINDINGS.md § v0.23`. Key boundary: v0.22 improves the first 15 artworks, but large-gallery GPU warming, synchronous procedural map generation, and best-effort idle prefetch remain planned N-series work.

## v0.22 — shipped (2026-05-21) — Improved Preloading + Press-to-Start

Current status: shipped. Runtime now preloads albedo plus PBR texture sets for the first 15 artworks under the loading overlay, warms each cached artwork texture set on the GPU before reveal, keeps the branded loader visible for at least 500 ms, and waits for the accessible "Galerie betreten" button before entering the gallery. Validation: `npm run lint` and `npm run build` passed after implementation; `npm audit --audit-level=moderate` still reports the known Vite/esbuild development-server advisory that requires a semver-major upgrade.

## v0.21 — implementation shipped (2026-05-21)

Current status: shipped. The v0.21 plan is implemented in runtime code and documentation: branded progress loading overlay, Three.js LoadingManager progress, pre-reveal GPU warm render + awaited shader prewarm, audio `preload='auto'`, adjacent/idle PBR prefetch, lighting resume clamp, WebGL restore status, max-texture diagnostics, shader precision guard, 16K importer guidance, global pointer tracking, timeline arrows/counter/edge fades/responsive sizing/virtualized large-list rendering, and cleanup for added global listeners. Future-only boundaries remain LOD/tiled streaming for device-limited 16K detail and grouped/page timeline navigation for very large exhibitions.


## v0.20.8 — Complete v0.20 implementation shipped (2026-05-21)

Current status: shipped. The v0.20.7 gap-closure plan is now implemented in code and this file was refreshed during the all-markdown sync. Remaining v0.20 audio/control quality gaps are closed: fade targets clamp to the 0.30 effective-gain ceiling, diagnostics include display percent, preference patching updates non-slider controls during volume drags, sliders expose German percent value text, zero-volume recovery logs stored/recovered values, first-interaction recovery also covers pre-play audio, unmute resumes within `BackgroundAudioManager`, slider fill CSS stores percentages, and the ended-loop fallback fade is shortened to 50 ms. F-09 was confirmed correct and required no code change.

## The idea in one sentence

For each painting file in `customer-artworks/inbox/`, the importer also
reads a matching text file with the **same basename** and the `.txt`
extension.

```text
customer-artworks/inbox/
  01-sunset-at-the-lake.jpg      ← painting
  01-sunset-at-the-lake.txt      ← matching text card
  02-forest-path.png
  02-forest-path.txt
```

The painting still imports if you forget the text card; the importer just
generates a fallback title and lists the picture under
`Pictures missing text` in the report.

---

## Step-by-step workflow

### 1. Put the painting into the inbox

Open `customer-artworks` → `inbox` and place the picture file there.
Supported formats: JPG, PNG, WebP, GIF, SVG, AVIF.

### 2. Create the matching text file

Open Notepad (Windows) or TextEdit (macOS, plain text mode first).

The text file name must match the painting file name exactly — only the
extension changes to `.txt`.

| Painting file | Matching text file |
| --- | --- |
| `01-sunset-at-the-lake.jpg` | `01-sunset-at-the-lake.txt` |
| `02-forest-path.png` | `02-forest-path.txt` |
| `my favourite painting.webp` | `my favourite painting.txt` |

Tip: the importer compares names case-insensitively, so
`Sunset.JPG` + `sunset.txt` is fine.

### 3. Fill in the text card

Copy `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`, rename the copy, and
fill in the fields. At minimum the importer expects `Title`, `Alt`, and
`Description` to be filled in.

```text
Title: Sunset at the lake
Subtitle: Freyraum Collection
Year: 2024
Credit: Your Name
Alt: Warm orange and pink sky reflected in a calm lake at dusk.
Tags: sunset, lake, landscape
Surface: matte-canvas
Medium: Oil on canvas · 60×80 cm

Description:
This painting captures the quiet end of a summer day at the lake near my
childhood home. The warm light on the water always reminded me of how
brief those evenings felt.
```

Everything after `Description:` becomes the visible info-panel text.
Blank lines between paragraphs are preserved.

### 4. Save the text file next to the painting

Save the `.txt` file into the same inbox folder as the image
(`customer-artworks/inbox/`).

UTF-8 is recommended (the default on macOS/Linux and the default on
modern Windows Notepad). The importer also accepts UTF-8 files saved
with a leading BOM — Notepad on older Windows versions adds one
automatically; it is silently stripped.

### 5. Run **Update Gallery**

Double-click **Update Gallery** in the FREYRAUM folder (or run
`node scripts/import-artworks.mjs` from the repository root).

### 6. Read the report

Open `customer-artworks/last-import-report.txt`. The v0.18 importer
writes dedicated text-card sections:

```text
Text applied (2):
  ✓ 01-sunset-at-the-lake.txt matched 01-sunset-at-the-lake.jpg

Pictures missing text (1):
  ⚠ 03-blue-room.webp — add 03-blue-room.txt next to the image

Text files without matching pictures (1):
  ⚠ old-painting.txt — no image named old-painting.* was found

Text fields needing attention (1):
  ⚠ 02-forest-path.txt — Alt is empty — add a short visual description

Duplicate text files (1):
  ⚠ 01-sunset-at-the-lake.md — duplicate sidecar (also found
    01-sunset-at-the-lake.txt); using 01-sunset-at-the-lake.txt (.txt preferred)
```

These are all **warnings**, never errors: the gallery still updates.

### 7. Open the gallery

Open `index.html`. Your title, subtitle, year, credit, and description
appear in the info panel exactly as you wrote them.

---

## Field reference

```text
Title: (painting title — recommended)
Subtitle: (optional eyebrow line above the title)
Year: (optional four-digit year)
Credit: (optional — defaults to "Customer")
Alt: (recommended short visual description for screen readers)
Tags: (optional comma- or semicolon-separated keywords)
Surface: (optional: matte-canvas, satin-canvas, varnished-oil, paper)
Medium: (optional free-text medium override)

Description:
(recommended main info-panel text)
(can be multiple lines)
(blank lines inside the description are preserved)
```

### Title

The main title shown in the info panel.
If omitted, the importer falls back to a filename-generated title and
warns in the report.

### Subtitle

Optional eyebrow line shown above the title.
If omitted, the importer uses the generated `Artwork 01`, `Artwork 02`,
etc.

### Alt

A concise visual description for assistive technology.
It should describe the visible painting rather than repeating the title.

Good alt text typically mentions subject, colours, composition, mood, and
any visible text. Avoid starting with “image of” or “picture of”.

### Description

The longer visible text shown in the info panel.
The parser keeps it separate from `Alt` and preserves multiple lines and
blank lines between paragraphs.

### Year

Optional four-digit year. Anything other than four digits triggers a
warning and falls back to the current year.

### Credit

Optional artist/studio/rights-holder string.
If omitted, the default is `Customer`.

### Tags

Optional keywords reserved for future filtering. Separate with commas or
semicolons.

### Surface

Optional visual material profile for the 3D painting effect.

| Value | Meaning |
| --- | --- |
| `matte-canvas` | classic matte linen canvas (default) |
| `satin-canvas` | slightly glossy canvas |
| `varnished-oil` | varnished oil painting |
| `paper` | smooth paper |

Unknown values trigger a warning and fall back to `matte-canvas`.

### Medium

Optional free-text medium description. If omitted, the importer keeps
the dimension-based label (`Landscape · 1920 × 1080`, etc.).

---

## How matching works (in plain language)

- The importer looks for a sidecar with **exactly the same basename**
  (case-insensitive) in the same folder as the painting.
- `.txt` is the primary format. `.md` is accepted as a backup.
- If both `painting.txt` and `painting.md` exist, the `.txt` file wins
  and the `.md` is listed under `Duplicate text files`.
- The importer never guesses a match for a renamed image. Wrong text is
  worse than missing text, so an orphaned `.txt` is always reported
  rather than silently attached to a different painting.

---

## What the importer never touches

The importer **always** owns these fields and never reads them from the
sidecar:

- `id` (generated from the filename)
- `image` and `webglImage` (the copied/embedded image bytes)
- `dimensions` (read from the image header)

Sidecars only supply customer-facing text. You can safely rename a
painting + sidecar pair without losing any image data.

---

## Frequently asked questions

**Q: I forgot the `.txt` file. Will my picture still show up?**
Yes. The painting imports with the generated fallback title, current
year, and `Imported artwork` description. The picture is listed under
`Pictures missing text` so you remember to add a text card later.

**Q: I renamed my painting but forgot to rename the sidecar.**
The painting will still import (with fallback text), and the old
sidecar will appear under `Text files without matching pictures`.
Rename the `.txt` file to match the new painting basename and run
**Update Gallery** again.

**Q: My description spans many paragraphs. Will line breaks survive?**
Yes. Everything after `Description:` is taken as the visible body, with
blank lines preserved.

**Q: I use Markdown. Will `**bold**` render in the gallery?**
No. The info panel renders descriptions as plain text on purpose, so the
literal `**` characters appear. Use plain prose; the canvas styling
handles emphasis visually.

**Q: My text shows odd characters at the start (`ï»¿`).**
Re-save the file as UTF-8. Notepad on modern Windows offers UTF-8 in the
Save dialog. The importer already strips the BOM marker automatically;
visible mojibake usually means the file was saved as Windows-1252 or a
similar legacy encoding.

---

## Related docs

- Picture-only workflow (still supported): `docs/CUSTOMER_PICTURE_GUIDE.md`
- Maintainer notes: `docs/IMAGE_MAINTENANCE_GUIDE.md`
- Final v0.18 plan + acceptance: `plan.md § v0.18`
- Research log: `FINDINGS.md § 2026-05-20`
- Copy-paste template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`
