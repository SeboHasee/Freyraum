# FREYRAUM — Customer Picture Guide
> Last full markdown audit: 2026-05-22 (v0.47 shipped: frame metal realism retuned with bar-aligned brushing, softer satin highlights, and reduced zebra banding).

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

## v0.19 background music workflow (shipped)

Add calm background music files in:

```text
customer-audio/inbox/
  calm-track.mp3
  calm-track.ogg
  calm-track.m4a
  calm-track.wav
```

- Supported audio types: **MP3**, **OGG**, **M4A**, **WAV**
- Unsupported audio files are listed in the report and ignored (no hard failure)
- If multiple supported files exist, the importer uses deterministic precedence and runtime still performs compatibility probing
- In the website, open the settings gear and use **Ton stummschalten** + **Lautstärke** controls


## UI fix note (v0.16.2 follow-up implemented)

We shipped one more small UI follow-up on 2026-05-19:

- the settings gear has been verified working in the built preview
- the center left/right navigation buttons now have a slightly larger invisible shell so hover effects are no longer cut off

This still does not change your picture workflow or importer behavior.

## UI fix note (v0.16.1 implemented)

On 2026-05-19 we shipped a small UI hotfix:

- The settings gear now opens and works correctly again.
- The center left/right navigation buttons are no longer visually cut off when hovered.

This does not change your picture workflow or importer behavior.

## Performance status note (v0.16 implemented)

The v0.16 performance pass is now live. It does **not** change how customers add pictures; picture quality and the data-URL embedding path are unchanged. What is new and may be visible to customers running the importer:

- **Importer warnings.** The "last-import-report.txt" file now flags very large images: anything wider or taller than 4096 px ("many phones cap textures at this size") and anything that would need ~64 MB or ~128 MB of GPU memory ("performance may be reduced" / "phones may run out of memory and skip the texture"). These are *notices*, not errors — the import still completes — but customers who see them can downscale before shipping to reduce risk on visitor phones.
- **Battery-mode visual polish.** On low-end devices or when "Akkusparend" is active, the glass panels use a slightly less expensive blur. The picture itself is rendered identically; only the chrome paint cost drops.
- **Better resume behaviour.** Switching tabs and returning no longer causes a brief quality downgrade.

The previously planned `ImageBitmapLoader` raster path was explicitly deferred (no Safari benefit against the data-URL embedding the importer already produces). The customer-facing offline `file://` preview and the embedded `webglImage` behaviour remain authoritative.

## Performance planning note (v0.16 final plan — historical)

This section is retained as design history from the planning stage before implementation. v0.16 is now shipped; customer-facing behavior remains unchanged.

One finding directly relevant to this guide was **import-time texture memory warnings**. In the shipped implementation, warnings now trigger when a customer image exceeds 4096 px on a side, or when estimated GPU memory reaches ~64 MB (notice) / ~128 MB (strong warning). This is a proactive safeguard; it does not change how pictures are imported.

The final v0.16 plan also explicitly keeps the current customer-safe image path as a hard boundary: future optimizations like `ImageBitmapLoader` or compressed deployment textures may be added later, but they must **not** break the existing offline `file://` preview or embedded `webglImage` behavior that customers already rely on.

See `plan.md § v0.16 implementation summary` and `FINDINGS.md § 2026-05-19 (implementation completed)` for the shipped importer behavior and rationale.

## Phone and tablet note

v0.11 already implemented the main phone/tablet hardening pass: touch gestures, safe-area handling, responsive breakpoints, compact info-panel mode, and better mobile WebGL reliability are in place. Desktop is still the main polished design, but the current build now works substantially better on phones and tablets than the original release.

## Animation refinement (v0.15 implemented)

The v0.15 elegant animation system is **implemented**. Artwork navigation now feels deliberate and consistent across 60 Hz, 90 Hz, and 120 Hz displays; the info panel no longer flickers when switching artworks; glass panels and timeline thumbnails no longer overshoot their landings. Reduced-motion preference (in-app and OS-level) is fully respected.

v0.15.1 hotfix note: **Reduzierte Bewegung now changes movement only**. It does
not lower picture texture/shader quality.

## Current viewing status (v0.17 implemented — 2026-05-20)

**v0.17 easy-wins pass** shipped two non-visual improvements:

- Screen readers now correctly identify the preferences dialog title and treat background content as inert while the panel is open.
- Keyboard users land on the settings gear button after dismissing the panel via outside-click or Escape.

No change to picture display, navigation, zoom, pan, or texture rendering.

## Current viewing status (v0.14.2 implemented)

The customer-facing **v0.14.2 follow-up is implemented**.

What improved in the current build:

- **Closer detail zoom:** close inspection now goes deeper, especially on medium and large artworks.
- **Tighter panning:** edge movement is more controlled (less drifting away from the artwork when near reset view).
- **More restrictive top/bottom panning:** vertical edge movement is intentionally tighter while left/right stays unchanged.
- **Better vertical reset framing:** very tall artworks start farther away in default/reset view for a better first impression.

Technical changes behind this behavior:

- `MIN_CAMERA_Z`: `0.5 → 0.2`
- `MIN_VISIBLE_ARTWORK_FRACTION`: `0.28 → 0.12`
- `INSPECTION_OVERSCROLL`: `3.0 → 1.2`
- `INSPECTION_OVERSCROLL_X = 1.2` and `INSPECTION_OVERSCROLL_Y = 0.6` (v0.14.2 split)
- New portrait reset constants: `PORTRAIT_ASPECT_THRESHOLD = 0.65`, `PORTRAIT_RESET_EXTRA_Z = 1.5`

For support/debugging, `show-artwork-complete` now logs extra v0.14/v0.14.2 tuning data (`closeZoomMinVisibleFraction`, `panOverscrollX`, `panOverscrollY`, `panLimitAtReset`, `portraitResetApplied`, `portraitResetExtra`).


## v0.18 painting text workflow (shipped)

The importer now reads same-basename `.txt` sidecar files for each
painting and uses them in the gallery info panel.

```text
customer-artworks/inbox/
  01-sunset-at-the-lake.jpg      ← painting
  01-sunset-at-the-lake.txt      ← matching text card
```

Customer flow:

1. Copy `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.
2. Rename it to match the painting file name.
3. Fill in `Title:`, `Alt:`, and `Description:` (everything else is optional).
4. Save the `.txt` file next to the painting in the inbox.
5. Run **Update Gallery**.
6. Read the report for `Text applied`, `Pictures missing text`, `Text files without matching pictures`, or `Text fields needing attention`.

Missing or invalid sidecars never fail the import — they appear as
warnings only. For full guidance and a field reference, see
`docs/CUSTOMER_TEXT_GUIDE.md`.

**References:** `plan.md § v0.18`, `FINDINGS.md § 2026-05-20`, `docs/CUSTOMER_TEXT_GUIDE.md`.

## What you need (one-time)

1. **Node.js** (free): install the LTS version from <https://nodejs.org> (**18 or newer**).
2. The **FREYRAUM** folder (this folder).

Your support person sets these up once. After that, you only do the steps below.

## How to update your gallery

1. Open the FREYRAUM folder.
2. Open the folder called **`customer-artworks`**, then **`inbox`**.
3. Drag your pictures into the artwork **inbox** folder.
    - You can put in as many pictures as you want.
    - Any size or shape works: portrait, landscape, square, very wide, etc.
4. (Optional) Open **`customer-audio/inbox`** and add one or more calm background tracks (`.mp3`, `.ogg`, `.m4a`, `.wav`).
5. Go back to the FREYRAUM folder and double-click **`Update Gallery`**:
    - On macOS: `Update Gallery.command`
    - On Windows: `Update Gallery.bat`
6. A short report opens automatically when the update is done.
7. Double-click **`index.html`** (in the FREYRAUM folder) to view the updated gallery.

That's the whole workflow.

## Which file types work best

Best (always works): **JPG**, **PNG**, **WebP**, **GIF**, **SVG**, **AVIF**.

May not show in all browsers (warning, but copied anyway): **HEIC**, **HEIF**, **TIFF**, **BMP**.

Cannot show in any browser (skipped with a clear message): **camera RAW** files
(`.cr2`, `.cr3`, `.nef`, `.arw`, `.dng`, `.orf`, `.rw2`, `.raw`, `.pef`, `.srw`).

If you only have HEIC pictures from your iPhone, ask your support person to convert them
to JPG, or change your iPhone setting to take JPG photos.

## Which background music file types work

Best supported: **MP3**, **OGG**, **M4A**, **WAV**.

Other audio formats are listed under `Unsupported audio files` in the update report and ignored without breaking the gallery.

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
4. Looks in **`customer-audio/inbox/`** for supported background music files and copies them into **`customer-preview/audio/`**.
5. Writes a list of all imported pictures into:
   - `customer-artworks/artworks.json` (human-readable)
   - `customer-preview/customer-artworks.js` (used by the gallery)
   - `customer-preview/customer-audio.js` (used by the gallery for background music)
6. Writes a plain-language report to `customer-artworks/last-import-report.txt`.

Your original picture files are never changed or deleted.

## If you see a Node.js error during Update Gallery

Errors like these mean your installed Node.js is too old:

- `Unexpected token {`
- `Cannot find module 'node:child_process'`

Fix:

1. Install/update Node.js LTS from <https://nodejs.org> (version 18+).
2. Close and reopen the FREYRAUM folder window.
3. Run **Update Gallery** again.

The updater now writes a plain-language report for this case, so support can
see the exact Node.js compatibility issue in
`customer-artworks/last-import-report.txt`.

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
- `customer-preview/audio/`
- `customer-preview/customer-audio.js`

You only need to touch **`customer-artworks/inbox/`** and optionally **`customer-audio/inbox/`**.

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

**The navigation buttons (left/right arrows) look cut off or hidden.**
This was fixed in v0.13. If it still happens, send a screenshot and note the browser/device.

**Very tall pictures look too close when I reset the view.**
This was improved in v0.10 and hardened again in v0.12. Reset view now uses the
framed picture dimensions **and** the measured art-safe viewport after fixed
chrome is considered. If it still looks too close, include:

1. a screenshot of the first/reset view,
2. whether more manual zoom-out is still needed,
3. the `show-artwork-complete` diagnostics entry with `resetZoom`, `minZoom`,
    `maxZoom`, `overviewHeadroom`, and the usable viewport fields.

Large vertical artworks also receive the implemented portrait-aware reset-fit
boost from the later v0.14 pass. If a tall artwork still starts too close, treat
it as a new regression and include the diagnostics fields listed above.

**The selected timeline picture looks cut off.**
This should be fixed by v0.12. If it still happens, please send:

1. a screenshot showing the selected thumbnail,
2. whether it happens after clicking, swiping, or using keyboard arrows,
3. the browser/device used,
4. whether reduced motion is enabled.

If a developer is helping you, they should also capture whether the issue still
appears after the selected item is re-centered in the strip and look for a
`timeline/center-active` entry in non-default diagnostics mode.

## Debug / support tools (developer use)

If something goes wrong inside the running gallery, a developer can
collect a diagnostic report by appending `?debug=info` (or
`?debug=verbose`) to the preview URL and then opening the browser
console. The runtime keeps a leveled, deduplicated session log; a full
snapshot is available via `window.__FREYRAUM_DIAGNOSTICS__.snapshot()`.

Normal customer sessions stay quiet — only warnings and errors are
shown in the console by default.

## For developers

See `plan.md` (section "v0.07 Technical Implementation Guide"),
`ARCHITECTURE_MAP.md`, and `docs/architecture/README.md` for the full
architecture, file layout, and code references. For audits, also check
`FINDINGS.md` and `LESSONS_LEARNED.md`.
