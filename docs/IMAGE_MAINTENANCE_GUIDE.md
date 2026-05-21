# FREYRAUM — Image Maintenance Guide
> Last full markdown audit: 2026-05-21 (v0.21 shipped — preloading, interactive loading screen, tab/context smoothness, 16K diagnostics, global pointer tracking, timeline scalability).

## v0.21 — implementation shipped (2026-05-21)

Current status: shipped. The v0.21 plan is implemented in runtime code and documentation: branded progress loading overlay, Three.js LoadingManager progress, pre-reveal GPU warm render + awaited shader prewarm, audio `preload='auto'`, adjacent/idle PBR prefetch, lighting resume clamp, WebGL restore status, max-texture diagnostics, shader precision guard, 16K importer guidance, global pointer tracking, timeline arrows/counter/edge fades/responsive sizing/virtualized large-list rendering, and cleanup for added global listeners. Future-only boundaries remain LOD/tiled streaming for device-limited 16K detail and grouped/page timeline navigation for very large exhibitions.


## v0.20.8 — Complete v0.20 implementation shipped (2026-05-21)

Current status: shipped. The v0.20.7 gap-closure plan is now implemented in code and this file was refreshed during the all-markdown sync. Remaining v0.20 audio/control quality gaps are closed: fade targets clamp to the 0.30 effective-gain ceiling, diagnostics include display percent, preference patching updates non-slider controls during volume drags, sliders expose German percent value text, zero-volume recovery logs stored/recovered values, first-interaction recovery also covers pre-play audio, unmute resumes within `BackgroundAudioManager`, slider fill CSS stores percentages, and the ended-loop fallback fade is shortened to 50 ms. F-09 was confirmed correct and required no code change.

## v0.17 implemented — accessibility and dead-code cleanup (2026-05-20)

Image-pipeline unaffected. UI/accessibility changes visible only if using assistive technology:

- The preferences panel (`Anzeige`/`Performance`) is now correctly identified by screen readers via `aria-modal="true"` and `aria-labelledby`.
- Keyboard users now land on the settings gear button after dismissing the panel via outside-click (previously only Escape returned focus).
- Three internal dead-code files and one deprecated function were removed; no customer-facing behavior changed.



Maintenance-relevant UI correction:

- `src/styles/main.scss` now renders the visible nav/settings glass circles on inset `::before` pseudo-elements inside slightly larger transparent button shells.
- This is a follow-up to v0.16.1: containment was part of the problem, but the smallest possible blurred control surface still produced residual edge clipping in customer testing.
- `customer-preview/style.css` was rebuilt, so local/customer preview now includes the follow-up fix.
- Image/import pipeline remains unaffected.

## v0.16.1 implemented — UI containment regression hotfix (2026-05-19)

Maintenance-relevant UI correction:

- `.prefs` and `.nav-controls` were removed from the CSS `contain: layout paint` block in `src/styles/main.scss`.
- Reason: settings popover clipping and nav hover clipping regressions from overly broad containment.
- Impact: settings popover interaction is restored; center nav hover visuals are restored; image/import pipeline is unaffected.

## v0.16 implemented — Deep performance and compatibility pass (2026-05-19)

The v0.16 audit was implemented on 2026-05-19. From a maintenance and importer perspective:

- **Importer warnings.** `scripts/import-artworks.mjs` now emits new warnings in `customer-artworks/last-import-report.txt` when an image exceeds 4096 px on a side, or its GPU footprint (RGBA8 with mip pyramid: `w × h × 4 × 4/3`) exceeds 64 MB (info-level notice) or 128 MB (strong warning). These are advisory; the manifest is still written.
- **Renderer diagnostics for support cases.** When `?debug=1` is set, the console now contains periodic `[renderer] snapshot` entries with draw calls, triangle counts, geometries, textures, program count, pixel ratio, and current preset. Customers reporting performance issues can share their console log; the new entries make it easier to identify undersized phones or oversize textures.
- **Battery preset is now visually softer.** Glass-panel blur is halved on the battery preset (CSS-only — no shader change). Picture quality and the data-URL embedding path are unchanged.
- **Dead-code cleanup resolved in v0.17.** `MouseInteraction`, `TouchInteraction`, and `ZoomPan` were removed after caller-graph validation. All canvas input now routes through `CanvasInteraction.ts`.
- **Manifest contract unchanged.** Nothing in the importer output shape changes; only new warning text may appear in the human-readable report.

## v0.16 final audited brainstorm — Code-level performance audit (2026-05-19, design history)

This section is retained as design history from the final planning pass before implementation. v0.16 is now shipped; maintenance-relevant outcomes are listed in the implemented section above.

- **Import-time texture memory warnings (`scripts/import-artworks.mjs`):** shipped behavior warns when a customer image exceeds 4096 px on a side, or when estimated GPU memory exceeds ~64 MB / ~128 MB.
- Preserve exact customer image rendering and the `webglImage` data-URL fallback for offline `file://` previews — explicitly documented as a non-goal in the plan.
- `TextureManager.setAnisotropyDivisor()` now has a no-op guard to prevent spurious GPU texture re-uploads on same-preset re-apply.
- CSS glass panels now include `@supports` and `[data-quality='battery']` fallbacks, plus containment where visually safe — no visible downgrade on modern devices.
- Optional `ImageBitmapLoader` support is now documented as an **intermediate enhancement**, not a replacement for the current compatibility path (Finding 15).
- Startup quality now optionally uses `deviceMemory` / `hardwareConcurrency` as first-run hints only; stored preference still wins.
- Debug-only Long Tasks API instrumentation is now part of the runtime diagnostics surface.
- All other resize, render-loop, shader-deferral, lifecycle, and pre-warm changes are runtime-transparent to the image pipeline.

See `plan.md § v0.16 implementation summary` and `FINDINGS.md § 2026-05-19 (implementation completed)` for complete details.

## Implemented v0.15 animation refinement

The v0.15 elegant animation pass was implemented on 2026-05-19. It is independent from the importer / image-manifest pipeline and does not change customer behavior.

Maintenance notes:

- `src/utils/math.ts` now exports `smoothDamp` alongside `lerp` and `clamp`. Use `smoothDamp` for any new frame-rate-independent value smoothing; keep `lerp` for static interpolation.
- All `GalleryManager.update()` motion paths now require `now: number` (a `DOMHighResTimeStamp`) — passed from the `requestAnimationFrame` callback in `src/main.ts`. Any future caller must pass `now`.
- SCSS uses semantic motion tokens (`--dur-content`, `--dur-panel`, `--dur-timeline`, `--dur-reveal`, `--ease-gallery-out`). Backward-compatible aliases (`--dur-base`, `--dur-slow`, `--dur-fast`, `--ease-spring`) still exist for legacy consumers.
- `InfoPanel.CONTENT_SWAP_DELAY_MS` must stay in sync with `--dur-content` in `main.scss`.
- `loadingOverlay.remove()` timeout in `main.ts` must stay in sync with `--dur-reveal`.
- Reduced-motion support is preserved via the existing `[data-motion='reduced']` and `@media (prefers-reduced-motion: reduce)` blocks; no token rename weakens these paths.
- v0.15.1 hotfix: reduced motion must never be used as a shader-fidelity toggle.
  Keep detail-normal/specular/grazing fidelity tied to quality presets only.

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

## Current v0.14.2 status (close zoom, pan edges, large-vertical reset fit)

Implemented on 2026-05-19 in `src/gallery/GalleryManager.ts` (including same-day v0.14.2 vertical pan follow-up).

Shipped values:

- `MIN_CAMERA_Z = 0.2` (was 0.5)
- `MIN_VISIBLE_ARTWORK_FRACTION = 0.12` (was 0.28)
- `INSPECTION_OVERSCROLL = 1.2` (was 3.0)
- `INSPECTION_OVERSCROLL_X = 1.2` (left/right kept)
- `INSPECTION_OVERSCROLL_Y = 0.6` (top/bottom tightened)
- `PORTRAIT_ASPECT_THRESHOLD = 0.65` (new)
- `PORTRAIT_RESET_EXTRA_Z = 1.5` (new)

Behavior changes:

- Close inspection can move substantially nearer on larger artworks.
- Pan is less loose near reset-fit while still allowing corner inspection; vertical pan is additionally tighter in v0.14.2.
- Portrait artworks (aspect ratio below 0.65) receive an additive reset-distance boost, so they open farther away without globally changing non-portrait framing.

Diagnostics additions in `show-artwork-complete`:

- `closeZoomMinVisibleFraction`
- `panOverscrollX`
- `panOverscrollY`
- `panLimitAtReset`
- `portraitResetApplied`
- `portraitResetExtra`

Validation: `npm run lint` and `npm run build` pass; preview rebuilt.

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


## Painting text maintenance — v0.18 sidecar workflow (shipped)

The sidecar-text workflow is live in v0.18.

Maintainer model:

- `customer-artworks/inbox/<image-base>.txt` is the customer-editable text source of truth for each painting.
- `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt` is the copy-paste template.
- `docs/CUSTOMER_TEXT_GUIDE.md` is the customer-facing how-to guide.

Importer behavior (implemented in `scripts/import-artworks.mjs`):

1. The inbox scan separates image files from sidecar files (`.txt`, `.md`).
2. Sidecars match images by lowercase basename in the same folder. When both `.txt` and `.md` exist for the same stem, `.txt` wins and `.md` is reported under `Duplicate text files`.
3. The parser reads labeled text fields case-insensitively (`Title`, `Subtitle`, `Year`, `Credit`, `Alt`, `Tags`, `Surface`, `Medium`) and treats everything after `Description:` as the multi-line description body, preserving blank lines between paragraphs.
4. Sidecar metadata merges into the generated manifest via `??` fallback; asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned.
5. The plain-language report gains `Text applied`, `Pictures missing text`, `Text files without matching pictures`, `Text fields needing attention`, and `Duplicate text files` sections.

Maintenance rules:

- Treat image and sidecar as a pair during rename/delete/move.
- Never edit `artworks.json` or `customer-artworks.js` to fix customer text; edit the sidecar and rerun the importer.
- The importer never fuzzy-matches orphaned text files after renames — an orphan stays an orphan until the customer renames it back.
- The offline `file://` preview and `webglImage` reliability path remain unchanged.

See `plan.md § v0.18` and `FINDINGS.md § 2026-05-20` for the final audited technical plan and acceptance checks.

## Quick overview

The gallery is maintained through one input folder:

- `/home/runner/work/Freyraum/Freyraum/customer-artworks/inbox/`

The customer puts image files there and then runs:

- `/home/runner/work/Freyraum/Freyraum/Update Gallery.command` on macOS
- `/home/runner/work/Freyraum/Freyraum/Update Gallery.bat` on Windows

That updater runs:

- `/home/runner/work/Freyraum/Freyraum/scripts/run-import-artworks.cjs` (launcher)
- which then runs `/home/runner/work/Freyraum/Freyraum/scripts/import-artworks.mjs`

The launcher is deliberately written with legacy CommonJS built-in module names
(`child_process`, `fs`, `path`), not newer `node:` specifiers, so old Node
versions can still reach the Node 18+ compatibility report.

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
2. The updater launches `scripts/run-import-artworks.cjs`.
3. The launcher verifies Node.js major version (requires 18+). If Node is too old, it writes a plain-language compatibility error to `customer-artworks/last-import-report.txt` and exits cleanly.
4. If Node is compatible, the launcher runs `scripts/import-artworks.mjs`.
5. The importer:
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
6. `customer-preview/app.html` loads `customer-artworks.js`.
7. `src/main.ts` reads `window.__FREYRAUM_ARTWORKS`.
8. The runtime validates the injected entries with `sanitizeInjectedArtworks()`.
9. The validated list is passed into:
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
- `/home/runner/work/Freyraum/Freyraum/ARCHITECTURE_MAP.md`
- `/home/runner/work/Freyraum/Freyraum/docs/architecture/README.md`
- `/home/runner/work/Freyraum/Freyraum/docs/ai-feedback/AI_FEEDBACK_LOOP.md`
