# FREYRAUM Plan

## v0.08 Critical Plan — Imported images must render on the actual 3D paintings

### Status

**Planned as critical follow-up (2026-05-17).** Customer image import now creates
valid manifests and the timeline can show the imported files, but the main 3D
painting surface can still fail to show those same images. This is the highest
priority customer-image issue because the whole feature exists so imported
artworks appear on the 3D paintings with their real aspect ratios.

Observed customer import:

- portrait JPG: `720 × 907`
- portrait JPG: `719 × 991`
- square PNG: `4724 × 4724`

Expected result:

- the timeline thumbnails show the images
- the central 3D painting shows the same active image
- the 3D painting frame and plane match each imported artwork's aspect ratio
- no generated fallback texture is used for successfully imported files

Observed result:

- the images appear in the timeline
- the central 3D painting does not show the imported images
- the 3D painting aspect ratio does not match the imported dimensions

### Initial technical diagnosis

The timeline and the 3D painting use different image paths:

- `Timeline` creates normal DOM `<img>` elements from `artwork.image`.
- `GalleryManager` asks `TextureManager` to load the same URL as a Three.js texture.
- `ArtworkMesh.updateAspect()` currently derives the 3D frame size from the loaded
  texture, not directly from the manifest dimensions.
- `TextureManager` silently creates a generated fallback texture when Three.js
  loading fails. That fallback has its own dimensions, so the 3D painting can show
  the wrong aspect ratio even while the timeline proves the customer image exists.

Most likely failure class: local/customer image loading succeeds for DOM images
but fails or falls back in the WebGL texture path. One concrete suspect is the
global `TextureLoader` cross-origin setting on local `file://` / relative preview
assets. The fix must not rely on guesses; it must add diagnostics that state
whether each active 3D texture came from the customer file or from fallback.

### Goals

- Imported customer images render on the main 3D painting mesh.
- The 3D painting plane and frame use the imported manifest dimensions as the
  source of truth for aspect ratio.
- Texture loading failures are visible in diagnostics and support reports.
- Timeline, info panel, side panels, and central 3D painting all stay in sync.
- The offline `file://` preview remains the primary supported customer workflow.

### Non-goals

- No full CMS or cloud upload system.
- No requirement for customers to provide PBR texture sets.
- No silent fallback for the main feature path unless the UI/report clearly says
  the customer image could not be used as a WebGL texture.

### Proposed vertical slices

| Slice | Deliverable | Acceptance check |
|-------|-------------|------------------|
| S1 | Reproduce and instrument the failure with the three reported customer files. | Diagnostics show manifest dimensions, image URL, texture load start/end, fallback status, and active artwork ID. |
| S2 | Fix local/customer texture loading in `TextureManager`. | Relative `./images/...` files load as real Three.js textures from `customer-preview/images/`; no generated fallback for the reported JPG/PNG files. |
| S3 | Make 3D aspect ratio manifest-driven. | `ArtworkMesh` receives declared artwork dimensions and sizes the plane/frame from `720/907`, `719/991`, and `4724/4724` even before/independent of texture decode metadata. |
| S4 | Add hard validation between manifest, texture, and mesh. | Debug logs expose expected aspect, loaded texture size, computed mesh width/height, and whether fallback was used. |
| S5 | Verify navigation sync. | Clicking every timeline thumbnail updates the central 3D painting, side panels, info panel, active index, and diagnostics consistently. |
| S6 | Update docs and customer support guidance. | Guides say the support person should check runtime diagnostics if timeline works but the 3D painting does not. |

### Detailed logging plan

Add structured diagnostics for the full imported-artwork render path:

- **Boot / manifest**
  - artwork source: built-in vs customer
  - accepted/rejected manifest counts
  - each accepted customer artwork ID, URL, width, height, and aspect
- **TextureManager**
  - load start: role, URL, detected URL class (`data`, relative, `file`, `http`)
  - load success: image width/height, color space, anisotropy, role
  - load failure: URL, role, browser error event summary
  - fallback creation: seed URL, fallback dimensions, reason
  - cross-origin mode used for the load
- **GalleryManager**
  - active index and artwork ID on every navigation
  - whether albedo came from the real customer image or fallback
  - texture-set roles resolved for the current artwork
  - stale-load token discard events
- **ArtworkMesh**
  - declared manifest dimensions
  - texture dimensions, if available
  - computed aspect
  - computed plane width/height
  - computed frame width/height

Normal sessions should still stay quiet. These details should be available via
`?debug=info`, `?debug=verbose`, and
`window.__FREYRAUM_DIAGNOSTICS__.snapshot()`.

### Implementation notes

- Do not let fallback textures silently define customer artwork geometry.
- Prefer manifest dimensions for sizing imported artworks because the importer
  already reads those dimensions before the preview runs.
- Treat a timeline-visible but WebGL-invisible image as a first-class diagnostic
  condition, not as a generic missing-texture warning.
- If the browser/GPU cannot upload a very large source image, log the device
  `MAX_TEXTURE_SIZE` and plan a follow-up downscale step in the importer.

### Required validation

Use the reported import set as the first manual acceptance test:

1. Import the two portrait JPGs and one square PNG.
2. Open the root `index.html` launcher.
3. Confirm each timeline thumbnail appears.
4. Click each timeline item.
5. Confirm the central 3D painting shows the same image.
6. Confirm the central 3D painting frame aspect matches:
   - `720 / 907`
   - `719 / 991`
   - `4724 / 4724`
7. Confirm diagnostics show `fallbackUsed: false` for all three central paintings.
8. Run the existing lint/build checks after the code fix.

## v0.07 Plan — Customer-managed artwork folder and one-click importer

### v0.07 Planning Status

**Implemented with critical follow-up required (2026-05-17).** The v0.07
customer-managed artwork workflow can generate manifests and timeline thumbnails.
A non-technical customer can drop images into `customer-artworks/inbox/` and
double-click `Update Gallery` to refresh the offline preview. However, v0.08 is
required before this workflow is accepted as complete, because customer images
must also render on the central 3D painting with correct aspect ratios.

The diagnostics and logging subsystem (Slice S7) was implemented in an earlier
pass on the same date and is unchanged by this implementation pass.

See `v0.07 Implementation Outcome` below for the file-level summary and importer
test matrix. See the v0.08 critical plan above for the remaining 3D rendering
acceptance work.

### v0.07 Implementation Outcome

| Slice | Deliverable | Status |
|-------|-------------|--------|
| S1 | `docs/CUSTOMER_PICTURE_GUIDE.md` (rewritten for the implemented workflow) | done |
| S2 | Manifest contract (`artworks.json` + `customer-artworks.js`) | done |
| S3 | `scripts/import-artworks.mjs` (zero-dep, JPEG/PNG/GIF/WebP/SVG/AVIF dimensions) | done |
| S4 | Large-file copy-only path; `jimp` upgrade path documented for Phase 4 | done (copy-only) |
| S5 | `src/main.ts` + `scripts/write-local-preview.mjs` integration | done |
| S6 | Plain-language report + macOS/Windows double-click launchers | done |
| S7 | Centralized diagnostics (`src/utils/Diagnostics.ts`) | done (prior pass) |

Files added in the implementation pass:

- `scripts/import-artworks.mjs` — zero-dependency importer.
- `Update Gallery.command` — macOS double-click launcher (chmod +x).
- `Update Gallery.bat` — Windows double-click launcher.
- `customer-artworks/inbox/.gitkeep`, `customer-artworks/processed/.gitkeep`.

Files modified:

- `src/timeline/Timeline.ts` — accepts `readonly Artwork[]` via constructor.
- `src/ui/InfoPanel.ts` — accepts initial `Artwork` via constructor.
- `src/gallery/GalleryManager.ts` — accepts `readonly Artwork[]` via constructor;
  all internal references use `this.artworks`.
- `src/main.ts` — reads `window.__FREYRAUM_ARTWORKS`, validates with
  `sanitizeInjectedArtworks()`, falls back to built-in demo when missing or empty.
- `scripts/write-local-preview.mjs` — injects `<script src="./customer-artworks.js">`
  into `app.html` and writes a `window.__FREYRAUM_ARTWORKS = []` stub when none exists.
- `.gitignore` — excludes customer-generated content but keeps the inbox/processed
  directory placeholders.
- `CHANGELOG.md`, `FINDINGS.md`, `docs/CUSTOMER_PICTURE_GUIDE.md` — updated.

Verified test matrix (importer + sanitizer): landscape 800×400, portrait 300×600,
square 512×512, ultrawide 3200×800, SVG 1024×768, JPEG with SOF0 512×768,
unsupported `.txt` (skipped with friendly text), and empty-inbox fallback.

### v0.07 Current Code Findings

| Finding | Current source | Impact |
|---------|----------------|--------|
| Artwork content is hardcoded | `src/config/artworks.ts` exports `artworks` and currently builds four embedded SVG `data:` images. | Real customer images require developer edits today. |
| Metadata is already structured | `Artwork` has `id`, `title`, `subtitle`, `description`, `year`, `medium`, `image`, `dimensions`, `alt`, `credit`, `tags`, `textureSet?`, `surfaceProfile?`, `surfacePhysics?`. | Good target schema for an auto-generated manifest. |
| Texture loader supports file paths | `TextureManager` uses `THREE.TextureLoader`; `PaintingTextureSet` URLs may be relative paths or data URIs. | Imported images can become normal static files if copied into the built preview. |
| Preview is static/offline | `vite.local.config.ts` emits one IIFE bundle into `customer-preview/`; root `index.html` redirects to `customer-preview/app.html`. | Customer workflow must preserve the double-click `file://` preview. |
| Procedural maps fill missing material maps | `ProceduralTextureFactory` fills normal/height/roughness/specular/AO/varnish gaps. | Customers only need simple picture files; advanced PBR maps can stay optional. |
| Debug logging is ad hoc | `src/main.ts` has hidden `?debug=1` key toggles and `RenderBackend.ts` uses one direct `console.warn()`. | Current diagnostics are too narrow and inconsistent for future debugging/reliability work. |

### v0.07 Online Research Findings

Authoritative/browser-platform findings used for this plan:

- MDN image format guide: common browser-safe formats include JPEG, PNG, GIF, SVG, WebP, and modern AVIF; TIFF and camera RAW are not reliable as direct browser images. Source: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
- MDN File and Directory Entries API: recursive folder reading is useful but non-standard and browser-dependent. Source: https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API
- MDN `<input type="file">` / `webkitdirectory`: folder selection can work in Chromium/Safari-style browsers but is not a universal standard, so a pure in-browser folder picker cannot be the only customer workflow. Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#webkitdirectory
- MDN `createImageBitmap()`: async image decode is available, but orientation and browser behavior must be handled carefully for imported photos. Source: https://developer.mozilla.org/en-US/docs/Web/API/createImageBitmap
- MDN WebGL constants: WebGL has a device-dependent `MAX_TEXTURE_SIZE`; very large camera/scanner images must be downscaled before use as reliable WebGL textures. Source: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#textures

**Conclusion:** for an elderly non-technical customer, the safest architecture is not a browser-only drag-and-drop importer. The most reliable workflow is a local folder plus a one-click desktop/script updater that processes files before the static preview opens. Browser drag-and-drop can be added later as a convenience, but should not be the only path.

### v0.07 Goals

- Customer can manage the gallery by adding/removing images in one folder.
- No TypeScript editing, no terminal, no package manager, no developer tools.
- Accept common image files and preserve all aspect ratios.
- Preserve originals and generate optimized preview copies.
- Keep the existing one-click `index.html` → `customer-preview/app.html` preview.
- Generate metadata automatically when the customer provides only image files.
- Show friendly warnings for formats that browsers may not display directly.
- Add a deep but readable diagnostics system with leveled output, ring-buffered history, and low-noise console behavior.

### v0.07 Non-Goals

- No full CMS, login, remote upload server, or cloud dependency.
- No requirement for customers to author normal/height/roughness/PBR maps.
- No manual metadata entry as a blocker for the first version.
- No destructive edits to original customer files.
- No promise that every proprietary RAW/HEIC/TIFF file displays in every browser without conversion.

### v0.07 Proposed Customer Workflow

1. Customer opens the FREYRAUM folder.
2. Customer opens `customer-artworks/inbox/`.
3. Customer drags image files into that folder.
4. Customer double-clicks `Update Gallery` (`.command` on macOS, `.bat` on Windows, or a clearly named helper app/script).
5. The updater creates optimized files and `customer-artworks/artworks.json`.
6. Customer double-clicks root `index.html` to view the updated gallery.

### v0.07 Proposed Files / Modules

| File / Folder | Purpose |
|---------------|---------|
| `customer-artworks/inbox/` | Customer-managed input folder. Only place the customer needs to touch. |
| `customer-artworks/processed/` | Generated optimized image copies for preview/runtime. |
| `customer-artworks/artworks.json` | Generated manifest consumed by the app. |
| `scripts/import-artworks.mjs` | Node-based importer: scan, validate, read dimensions, copy/convert/resize where available, write manifest, write report. |
| `scripts/update-gallery.mjs` | Friendly wrapper that runs import and preview build. |
| `Update Gallery.bat` | Windows double-click entry point. |
| `Update Gallery.command` | macOS double-click entry point. |
| `src/config/artworks.ts` | Keep built-in fallback/demo artworks. Add loader bridge to generated manifest in implementation pass. |
| `src/config/customerArtworks.ts` | Proposed typed adapter for generated manifest (if JSON import is used at build time). |
| `src/utils/Diagnostics.ts` | Central diagnostics logger: levels, dedupe, ring buffer, global error capture, window debug API. |
| `docs/CUSTOMER_PICTURE_GUIDE.md` | Simple customer instructions. Added in this documentation pass. |

### v0.07 Vertical Slices

#### Slice S1 — Documentation and customer guide

**Status: done in this documentation pass.**

- Add `docs/CUSTOMER_PICTURE_GUIDE.md`.
- Document current limitation: v0.06 still requires developer edits.
- Document planned customer workflow and safe image advice.
- Update all markdown files with this plan and research findings.

#### Slice S2 — Manifest contract

- Define `customer-artworks/artworks.json` schema using the existing `Artwork` shape as the target.
- Required generated fields: `id`, `title`, `subtitle`, `description`, `year`, `medium`, `image`, `dimensions`, `alt`, `credit`, `tags`, `surfaceProfile`.
- Optional future fields: `textureSet`, `surfacePhysics`, sort order override, custom title override.
- Add strict validation and friendly error messages.

#### Slice S3 — One-click importer

- Add a Node script that scans `customer-artworks/inbox/`.
- Accept common browser-safe extensions first: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.gif`, `.svg`.
- Detect risky extensions and warn: `.heic`, `.heif`, `.tif`, `.tiff`, RAW camera extensions.
- Read dimensions automatically.
- Normalize IDs from filenames.
- Generate title/alt/medium fallback text from filenames and dimensions.
- Preserve source files untouched.

#### Slice S4 — Large-file and format hardening

- Generate safe preview copies instead of loading huge originals directly.
- Default long-edge cap: 4096 px for broad WebGL reliability; keep optional high-detail cap behind a setting.
- Query/document `MAX_TEXTURE_SIZE` at runtime and downshift quality if needed.
- Generate thumbnails/side-preview copies separately.
- Handle EXIF orientation consistently or document the chosen browser/library limitation.

#### Slice S5 — App integration

- Load generated customer manifest when present.
- Fall back to built-in demo artworks when no customer manifest exists.
- Keep `ProceduralTextureFactory` fallbacks for all missing material maps.
- Ensure portrait, landscape, square, and ultrawide images preserve aspect ratio in main artwork, side panels, timeline, zoom/pan limits, and material tiling.

#### Slice S6 — Elderly-customer UX polish

- Add a plain-language update report after import.
- Add big success/failure messages: `Gallery updated successfully` / `These files need attention`.
- Avoid scary stack traces for customer-facing failures.
- Keep a backup copy of the previous manifest before replacing it.
- Document exactly which folder the customer can edit and which generated folders they should not touch.

#### Slice S7 — Diagnostics, debugging, and reliability instrumentation

**Status: implemented in this diagnostics pass (2026-05-17).**

- Replace ad hoc `console.*` calls with one centralized diagnostics utility.
- Default console output must stay minimal (`warn` / `error` only), while debug sessions can opt into `info` or `verbose`.
- Keep a ring-buffered in-memory history for later inspection without flooding the console.
- Capture uncaught errors and unhandled promise rejections globally.
- Add subsystem-scoped diagnostics for boot, renderer/backend probe, preferences, texture loading, gallery navigation/load, and adaptive quality.
- Expose a safe developer API on `window.__FREYRAUM_DIAGNOSTICS__` so future bug reports can dump a readable session log.

### v0.07 Performance Budget

| Asset path | Budget / behavior |
|------------|-------------------|
| Original customer files | Preserve untouched; can be very large. |
| Runtime main images | Generate/copy optimized web-safe files; default max long edge 4096 px unless future testing permits higher. |
| Thumbnails / side previews | Generate smaller files to avoid loading full-size images for side panels. |
| GPU texture upload | Must stay below device `MAX_TEXTURE_SIZE`; runtime should fail gracefully if an image exceeds limits. |
| Initial load | Do not preload unlimited huge originals. Preload optimized runtime copies only. |

### v0.07 Accessibility Impact

- Auto-generate usable alt text from title/filename, but allow future simple overrides.
- Keep keyboard navigation and existing controls unchanged.
- Provide large, plain-language instructions in the guide.
- Avoid requiring terminal or code-editor access.

### v0.07 Fallback Behaviour

- If no customer files exist, keep built-in demo artworks.
- If one file fails, import the rest and report the failed file.
- If a file format is unsupported, show a friendly conversion recommendation.
- If dimensions cannot be read, skip the file and report it.
- If generated manifest is invalid, keep the previous valid manifest.

### v0.07 Browser / API Stability Boundaries

- Do not rely only on browser folder drag-and-drop because folder APIs are browser-dependent.
- Treat HEIC/HEIF, TIFF, and RAW as input risks unless a conversion tool is added.
- Treat `createImageBitmap()` as useful but not a complete metadata/orientation solution by itself.
- Treat WebGL `MAX_TEXTURE_SIZE` as device-dependent; never assume all customer images can become GPU textures at original resolution.

### v0.07 Acceptance Checks

1. A non-technical tester can replace artworks by copying files into `customer-artworks/inbox/` and double-clicking the updater.
2. Portrait, square, landscape, and ultrawide images display without stretching.
3. Large phone/camera images are optimized before runtime.
4. Unsupported/risky files produce friendly warnings, not crashes.
5. Root `index.html` still opens the preview by double-click.
6. Built-in demo artworks still load if no customer manifest exists.
7. All markdown docs describe the final customer workflow after implementation.
8. Default runtime console output stays readable and low-noise during normal customer use.
9. `?debug=1` and `?debug=verbose` enable progressively deeper diagnostics without code edits.
10. A developer can inspect the current diagnostics buffer through `window.__FREYRAUM_DIAGNOSTICS__`.

### v0.07 Known Risks

- Image conversion without new dependencies is limited. True HEIC/TIFF/RAW conversion may require platform tools or npm/WASM dependencies.
- Windows/macOS double-click scripts need careful quoting for spaces in paths.
- Very old computers may still struggle with many 4096 px images; importer should allow a lower cap.
- Customer may delete generated folders accidentally; updater should recreate them.

---

## v0.07 Technical Implementation Guide

This section is the complete developer-facing execution guide. Every architectural decision is documented here so the developer can implement v0.07 end-to-end without guessing.

### v0.07 Architecture Decision: How the app loads customer images

**Problem:** The gallery preview is a pre-built IIFE bundle opened from `file://`. A customer drags images into a folder. How does the running bundle pick them up?

Three options were evaluated:

| Option | Description | Works from file:// | Requires rebuild | Customer UX |
|--------|-------------|---------------------|-------------------|-------------|
| A: Rebuild bundle | Importer regenerates artworks, then full `npm run build` bakes them in | ✅ | ✅ every time | Slow (seconds), needs Node.js |
| B: `fetch('artworks.json')` at startup | Runtime JSON fetch | ❌ blocked by browsers on file:// | ❌ | Would need local server |
| C: Global window injection | Importer writes `customer-artworks.js` with `window.__FREYRAUM_ARTWORKS`; app.html includes it | ✅ | ❌ no rebuild | Fast (under 1 second) |

**Decision: Option C — global window injection.**

Reason: Option B is disqualified because `fetch()` is blocked by all major browsers on `file://` URLs for security. Option A works but requires a full rebuild (10–30 seconds) on every update. Option C requires no rebuild, works from `file://` by standard script loading, and the customer sees the update immediately after double-clicking the updater.

**How Option C works:**

1. `scripts/import-artworks.mjs` scans `customer-artworks/inbox/`, copies images to `customer-preview/images/`, and writes `customer-preview/customer-artworks.js` containing:
   ```js
   window.__FREYRAUM_ARTWORKS = [ /* Artwork[] JSON */ ];
   ```
2. `scripts/write-local-preview.mjs` is updated to inject `<script src="./customer-artworks.js"></script>` into `customer-preview/app.html` just before the main IIFE bundle tag.
3. `src/main.ts` reads `(window as any).__FREYRAUM_ARTWORKS` at startup; if it is a non-empty array, it is used instead of the built-in demo artworks. The TypeScript type is `Artwork[] | undefined`.
4. If the customer has not yet run the importer, `window.__FREYRAUM_ARTWORKS` is `undefined` (the script tag will 404 silently or be absent), and the built-in demo artworks load as normal.

**Fallback path:** If `customer-artworks.js` does not exist yet, the app.html `<script src="./customer-artworks.js">` will fail silently (a missing optional script does not throw in HTML). As a safer alternative, `write-local-preview.mjs` can emit a stub `customer-preview/customer-artworks.js` that sets `window.__FREYRAUM_ARTWORKS = []` so no 404 occurs. The app reads `[]` as no artworks → falls back to demo artworks. Both approaches work; the stub is cleaner.

---

### v0.07 Diagnostics and logging architecture

The customer-managed import pipeline is only half of reliability. The other half is being able to diagnose failures quickly without drowning the console in noise.

**Current problem:** logging is scattered and inconsistent. `main.ts` contains a hidden `?debug=1` key toggle for shader-only inspection, `RenderBackend.ts` logs one direct `console.warn()`, and most other critical runtime paths are silent. This is not enough for future debugging, performance audits, customer-machine issue reports, or importer rollout support.

**Decision:** add one centralized diagnostics utility in `src/utils/Diagnostics.ts` and make all major subsystems log through it.

#### Diagnostics goals

- Keep normal customer sessions quiet and professional.
- Keep enough history in memory to inspect failures after they happen.
- Make debug sessions opt-in through URL/localStorage, not hard-coded console spam.
- Use stable scopes and event names so future contributors can grep and compare sessions.
- Deduplicate repeated noise (for example repeated storage failures or repeated fallback image loads).

#### Diagnostics modes

| Mode | Activation | Console threshold | Intended use |
|------|------------|-------------------|--------------|
| `default` | no query, no storage override | `warn` / `error` | normal customer preview |
| `info` | `?debug=1` or `?debug=info` | `info` | developer repro / support session |
| `verbose` | `?debug=verbose` | `debug` | deeper engineering diagnostics |

The diagnostics utility should also persist the chosen mode in `localStorage` so a developer can leave a machine in `info` or `verbose` mode temporarily without editing code.

#### Diagnostics data model

Every entry should contain:

- timestamp
- relative session time in ms
- level (`debug` / `info` / `warn` / `error`)
- scope (`boot`, `gallery`, `texture`, `backend`, `quality`, `preferences`, etc.)
- stable event key
- short readable message
- optional structured metadata object
- repeat count (for deduped entries)

Keep a ring buffer of the latest ~300 entries only. This is deep enough for diagnosis but small enough to stay readable and cheap.

#### Global diagnostics API

Expose a small API for support/debug sessions:

```ts
window.__FREYRAUM_DIAGNOSTICS__.getEntries()
window.__FREYRAUM_DIAGNOSTICS__.print('info')
window.__FREYRAUM_DIAGNOSTICS__.snapshot()
window.__FREYRAUM_DIAGNOSTICS__.clear()
window.__FREYRAUM_DIAGNOSTICS__.setMode('verbose')
```

This API must be read-only with respect to application state except for diagnostics mode and buffer reset.

#### Required runtime integration points

| Scope | Required events |
|-------|-----------------|
| `boot` | startup, missing `#app`, WebGL unavailable, renderer init failure, gallery ready, shutdown, fatal startup failure |
| `preferences` | storage read/write failure, applied preference set |
| `backend` | backend detection, WebGPU probe start/success/failure |
| `texture` | renderer capabilities, texture fallback generation, repeated load failures |
| `gallery` | preset apply, inspection-mode change, artwork load start, stale async load discard, artwork ready |
| `quality` | adaptive downgrade request, manual override suspension |
| `window` | uncaught error, unhandled rejection |

#### Reliability rules for diagnostics

- Diagnostics must never throw.
- Diagnostics must never block rendering or interaction.
- Diagnostics metadata must be serializable; `Error` objects should be normalized.
- Default mode must not spam per-frame or per-pointer-move events.
- Repeated identical warnings within a short window must increment a repeat counter instead of printing every occurrence.
- The diagnostics system itself must be disposable-free and singleton-safe; it should survive for the lifetime of the page.

#### Logging style guide

- Prefer one sentence messages.
- Keep the scope and event stable; change the message only for readability.
- Include metadata only when it helps future debugging (IDs, counts, active preset, current artwork, dimensions, timing).
- Never log per-frame values in `default` or `info` mode.
- Never log user-content blobs or huge objects; summarize them instead.

---

### v0.07 Slice S2 — Manifest contract: `artworks.json` and `customer-artworks.js`

The importer produces two outputs for every update run:

**`customer-artworks/artworks.json`** — Human-readable manifest. The customer or developer can inspect it. Not loaded by the app directly. Structure matches the `Artwork` TypeScript interface from `src/config/artworks.ts`.

```jsonc
[
  {
    "id": "01-sunset-at-lake",
    "title": "Sunset At Lake",
    "subtitle": "Artwork 01",
    "description": "Imported artwork",
    "year": 2025,
    "medium": "Photograph · 3024 × 4032",
    "image": "./images/01-sunset-at-lake.jpg",
    "dimensions": { "width": 3024, "height": 4032 },
    "alt": "Sunset At Lake",
    "credit": "Customer",
    "tags": [],
    "surfaceProfile": "matte-canvas"
  }
]
```

**`customer-preview/customer-artworks.js`** — App-injectable runtime file. Paths must be relative to `customer-preview/`:

```js
window.__FREYRAUM_ARTWORKS = [
  {
    "id": "01-sunset-at-lake",
    "title": "Sunset At Lake",
    "subtitle": "Artwork 01",
    "description": "Imported artwork",
    "year": 2025,
    "medium": "Photograph · 3024 × 4032",
    "image": "./images/01-sunset-at-lake.jpg",
    "dimensions": { "width": 3024, "height": 4032 },
    "alt": "Sunset At Lake",
    "credit": "Customer",
    "tags": [],
    "surfaceProfile": "matte-canvas"
  }
];
```

**Title generation from filename:**
```
01-sunset-at-lake.jpg  →  "Sunset At Lake"
02-portrait of maria.PNG  →  "Portrait Of Maria"
003_forest_path.webp  →  "Forest Path"
```
Algorithm: strip leading digits and separators (`-`, `_`, spaces), strip extension, split on remaining separators, capitalize each word.

**ID generation from filename:**
```
01-sunset-at-lake.jpg  →  "01-sunset-at-lake"
IMG_8847.JPG  →  "img-8847"
```
Algorithm: strip extension, lowercase, replace non-alphanumeric with `-`, collapse repeated `-`.

**`medium` generation:**
```
Portrait · 3024 × 4032   (height > width by >10%)
Landscape · 3024 × 2016  (width > height by >10%)
Square · 2048 × 2048     (ratio within 10%)
Photograph · W × H       (default prefix)
```

**`surfaceProfile` default:** `'matte-canvas'` for all auto-imported artwork unless overridden in a future metadata sidecar.

---

### v0.07 Slice S3 — `scripts/import-artworks.mjs`: exact implementation guide

**File:** `scripts/import-artworks.mjs`  
**Runtime:** Node.js 18+ (ES modules, `node:fs`, `node:path`).  
**No new npm dependencies required** for the first version (dimension reading is zero-dep header parsing). Optional resize via `jimp` (pure-JS, no native binaries).

#### Supported extensions

```js
const SAFE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']);
const RISKY_EXTENSIONS = new Set(['.heic', '.heif', '.tif', '.tiff', '.bmp']);
const RAW_EXTENSIONS = new Set(['.cr2', '.cr3', '.nef', '.arw', '.dng', '.orf', '.rw2', '.raw']);
```

Safe extensions are imported normally. Risky extensions: copy as-is but emit a warning in the report. RAW extensions: skip entirely with a clear message.

#### Zero-dependency image dimension reading

Parse headers directly from a `Buffer` using `fs.readFileSync()`:

```js
function readImageDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  // JPEG: look for SOF0 (0xFFC0) or SOF2 (0xFFC2) marker
  if (buf[0] === 0xFF && buf[1] === 0xD8) {
    let i = 2;
    while (i < buf.length - 4) {
      if (buf[i] !== 0xFF) break;
      const marker = buf[i + 1];
      const segLen = buf.readUInt16BE(i + 2);
      if (marker === 0xC0 || marker === 0xC2 || marker === 0xC1 || marker === 0xC3) {
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      }
      i += 2 + segLen;
    }
    throw new Error('JPEG SOF marker not found');
  }
  // PNG: width at offset 16, height at offset 20 (big-endian uint32)
  if (buf[0] === 0x89 && buf.toString('ascii', 1, 4) === 'PNG') {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // WebP: RIFF + WEBP container
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    if (chunk === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3FFF, height: buf.readUInt16LE(28) & 0x3FFF };
    if (chunk === 'VP8L') {
      const b0 = buf[21], b1 = buf[22], b2 = buf[23];
      return { width: 1 + (buf[20] | ((b0 & 0x3F) << 8)), height: 1 + (((b0 >> 6) | (b1 << 2) | ((b2 & 0x0F) << 10))) };
    }
  }
  // GIF: width at offset 6, height at offset 8 (little-endian uint16)
  if (buf.toString('ascii', 0, 3) === 'GIF') {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  }
  // SVG: return 0×0 with a flag; runtime will treat as vector (no cap needed)
  if (buf.toString('utf8', 0, 5).trimStart().startsWith('<svg') ||
      buf.toString('utf8', 0, 100).includes('<svg')) {
    return { width: 0, height: 0, isSVG: true };
  }
  // AVIF / others: fall back — cannot reliably parse without a library
  throw new Error(`Cannot read dimensions for ${path.basename(filePath)} without a library`);
}
```

#### Complete script outline

```js
import { readdirSync, mkdirSync, cpSync, writeFileSync, existsSync, renameSync } from 'node:fs';
import { join, extname, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const INBOX = join(ROOT, 'customer-artworks', 'inbox');
const PROCESSED = join(ROOT, 'customer-artworks', 'processed');
const MANIFEST_JSON = join(ROOT, 'customer-artworks', 'artworks.json');
const MANIFEST_BACKUP = join(ROOT, 'customer-artworks', 'artworks.json.bak');
const PREVIEW_IMAGES = join(ROOT, 'customer-preview', 'images');
const PREVIEW_JS = join(ROOT, 'customer-preview', 'customer-artworks.js');
const REPORT_FILE = join(ROOT, 'customer-artworks', 'last-import-report.txt');

// 1. Ensure folders exist
mkdirSync(INBOX, { recursive: true });
mkdirSync(PROCESSED, { recursive: true });
mkdirSync(PREVIEW_IMAGES, { recursive: true });

// 2. Scan inbox
const files = readdirSync(INBOX)
  .filter(f => !f.startsWith('.'))
  .sort();

// 3. Process each file
const artworks = [];
const imported = [];
const warnings = [];
const skipped = [];

for (const [i, filename] of files.entries()) {
  const srcPath = join(INBOX, filename);
  const ext = extname(filename).toLowerCase();
  const artworkIndex = String(i + 1).padStart(2, '0');

  if (RAW_EXTENSIONS.has(ext)) {
    skipped.push(`${filename} — camera RAW format, cannot display in browser`);
    continue;
  }
  if (!SAFE_EXTENSIONS.has(ext) && !RISKY_EXTENSIONS.has(ext)) {
    skipped.push(`${filename} — unknown format`);
    continue;
  }

  let dims = { width: 0, height: 0 };
  try {
    dims = readImageDimensions(srcPath);
  } catch (e) {
    warnings.push(`${filename} — could not read dimensions: ${e.message}. Skipping.`);
    continue;
  }

  const id = normalizeId(basename(filename, ext));
  const title = generateTitle(basename(filename, ext));
  const destFilename = id + ext;
  const destPath = join(PREVIEW_IMAGES, destFilename);

  // Copy to preview/images
  cpSync(srcPath, destPath);

  if (RISKY_EXTENSIONS.has(ext)) {
    warnings.push(`${filename} — format may not display in all browsers. Export as JPG if it does not appear.`);
  }

  artworks.push({
    id,
    title,
    subtitle: `Artwork ${artworkIndex}`,
    description: 'Imported artwork',
    year: new Date().getFullYear(),
    medium: generateMedium(dims, ext),
    image: `./images/${destFilename}`,
    dimensions: { width: dims.width, height: dims.height },
    alt: title,
    credit: 'Customer',
    tags: [],
    surfaceProfile: 'matte-canvas',
  });

  imported.push(filename);
}

// 4. Back up previous manifest, write new one
if (existsSync(MANIFEST_JSON)) {
  renameSync(MANIFEST_JSON, MANIFEST_BACKUP);
}
writeFileSync(MANIFEST_JSON, JSON.stringify(artworks, null, 2), 'utf8');

// 5. Write customer-artworks.js for the preview (global injection)
const js = `// Auto-generated by FREYRAUM import-artworks — do not edit manually\nwindow.__FREYRAUM_ARTWORKS = ${JSON.stringify(artworks, null, 2)};\n`;
writeFileSync(PREVIEW_JS, js, 'utf8');

// 6. Write plain-language report
const reportLines = [
  `Gallery update finished — ${new Date().toLocaleString()}`,
  '',
  `Imported (${imported.length}):`,
  ...imported.map(f => `  ✓ ${f}`),
];
if (warnings.length) {
  reportLines.push('', `Needs attention (${warnings.length}):`, ...warnings.map(w => `  ⚠ ${w}`));
}
if (skipped.length) {
  reportLines.push('', `Skipped (${skipped.length}):`, ...skipped.map(s => `  ✗ ${s}`));
}
if (imported.length === 0 && warnings.length === 0) {
  reportLines.push('', 'No valid image files found in customer-artworks/inbox/');
  reportLines.push('Put your pictures in that folder and run Update Gallery again.');
}
const report = reportLines.join('\n');
writeFileSync(REPORT_FILE, report, 'utf8');
console.log(report);
```

---

### v0.07 Slice S4 — Large-file and format hardening

#### Large-image strategy (first version — copy-only, no resize)

For the first implementation version, the importer **copies** images without resizing. Rationale:
- Avoids the complexity of adding `jimp` or `sharp` as a dependency in the first pass.
- Most phone/camera JPEG files are 3–25 MB and typically 3000–8000 px; Three.js `TextureLoader` + WebGL handles these well up to `MAX_TEXTURE_SIZE` on modern devices.
- The `ProceduralTextureFactory` is already responsible for procedural PBR maps, not image resizing.

**Future S4 upgrade path (optional, when resize is needed):**

Add `jimp` as a devDependency (pure JS, no native binaries, works on macOS + Windows without build tools):

```
npm install --save-dev jimp
```

In the importer, after copying, check if `width > MAX_LONG_EDGE || height > MAX_LONG_EDGE` and if so use jimp to downscale to `MAX_LONG_EDGE = 4096`:

```js
import Jimp from 'jimp';

async function processImage(srcPath, destPath, dims, maxLongEdge = 4096) {
  const maxDim = Math.max(dims.width, dims.height);
  if (maxDim > maxLongEdge) {
    const image = await Jimp.read(srcPath);
    const scale = maxLongEdge / maxDim;
    await image
      .resize(Math.round(dims.width * scale), Math.round(dims.height * scale))
      .writeAsync(destPath);
    return { width: Math.round(dims.width * scale), height: Math.round(dims.height * scale) };
  } else {
    cpSync(srcPath, destPath);
    return dims;
  }
}
```

Jimp supports JPEG, PNG, BMP, TIFF, GIF. For WebP resize, a WebP-specific jimp plugin or sharp (if native binaries are available) is needed.

**Runtime WebGL texture-size guard (app side):**

In `src/gallery/TextureManager.ts`, after `init(renderer)` reads `maxAnisotropy`, also read and store `maxTextureSize`:

```ts
init(renderer: THREE.WebGLRenderer): void {
  this.maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  this.maxTextureSize = renderer.capabilities.maxTextureSize; // e.g. 16384 on modern GPU
}
```

Before loading a customer image, log a warning if the declared dimensions exceed `maxTextureSize`. The texture will still load (WebGL silently clamps), but logging helps debugging.

---

### v0.07 Slice S5 — App integration: exact code changes

#### Change 1: `src/main.ts`

Add customer artwork loading just before the gallery is initialized. The `artworks` variable already comes from `src/config/artworks`. Add a check:

```ts
// At the top of main(), after const preferences = new PreferencesStore():
const injected = (window as any).__FREYRAUM_ARTWORKS as typeof artworks | undefined;
const activeArtworks = Array.isArray(injected) && injected.length > 0 ? injected : artworks;
```

Then replace every reference to `artworks` in `main()` with `activeArtworks`. There are at least these usage sites to check:
- `TextureManager.preload(activeArtworks.map(a => a.image))`
- `new GalleryManager(activeArtworks, ...)`
- `new Timeline(activeArtworks, ...)`
- `new InfoPanel(activeArtworks[0], ...)` etc.

Search the file for `artworks` (the imported constant) and replace with `activeArtworks` in the `main()` function body. The import line itself remains unchanged.

**Important:** The `Artwork` interface does not change. The injected data must match that shape exactly, which is guaranteed because the importer outputs the same JSON structure.

#### Change 2: `scripts/write-local-preview.mjs`

Inject the customer artworks script tag into `app.html` and also write a stub `customer-artworks.js` so no 404 occurs:

```js
const html = `<!DOCTYPE html>
<html lang="de">
<head>
  ...existing head...
</head>
<body>
  <div id="app"></div>
  <!-- Customer artwork injection (generated by import-artworks.mjs) -->
  <script src="./customer-artworks.js"></script>
  <script src="./freyraum-gallery.js"></script>
</body>
</html>
`;

// Also write a stub customer-artworks.js if it does not exist yet
const stubPath = 'customer-preview/customer-artworks.js';
if (!existsSync(stubPath)) {
  writeFileSync(stubPath, '// No customer artworks imported yet\nwindow.__FREYRAUM_ARTWORKS = [];\n');
}
```

The `existsSync` guard means that a real imported `customer-artworks.js` from a previous `import-artworks.mjs` run is not overwritten by the stub on rebuild.

#### Change 3: `customer-artworks/inbox/.gitkeep`

Create an empty `.gitkeep` file in `customer-artworks/inbox/` and add `customer-artworks/inbox/*` (but not `.gitkeep`) to `.gitignore`. This ensures the folder exists in the repo but customer images are not committed.

Similarly add `customer-preview/images/` and `customer-preview/customer-artworks.js` to `.gitignore` so generated files are not committed.

#### Change 4: `Update Gallery.command` (macOS) and `Update Gallery.bat` (Windows)

**`Update Gallery.command`** — macOS double-click shell script:
```sh
#!/bin/bash
# FREYRAUM — Update Gallery
# Double-click this file to import your pictures.
cd "$(dirname "$0")"
if ! command -v node &> /dev/null; then
    osascript -e 'display alert "Node.js not found" message "Please install Node.js from https://nodejs.org and try again."'
    exit 1
fi
node scripts/import-artworks.mjs
if [ $? -eq 0 ]; then
    open customer-artworks/last-import-report.txt 2>/dev/null || true
fi
```
After creation, run `chmod +x "Update Gallery.command"` so macOS can execute it.

**`Update Gallery.bat`** — Windows double-click batch file:
```bat
@echo off
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js not found. Please install it from https://nodejs.org
    pause
    exit /b 1
)
node scripts/import-artworks.mjs
if %errorlevel% equ 0 (
    start notepad customer-artworks\last-import-report.txt
) else (
    echo An error occurred. Please contact your support person.
    pause
)
```

**Important macOS note:** When a `.command` file is first run by double-clicking in Finder, macOS Gatekeeper will block it with "cannot be opened because it is from an unidentified developer". The customer (or the developer during setup) must right-click → Open → Open to approve it once. Document this in the guide. After the first approval, future double-clicks work normally.

---

### v0.07 Slice S6 — Report and UX

The plain-language update report is written to `customer-artworks/last-import-report.txt`. The `Update Gallery` scripts open this file automatically after a successful run.

Sample report (success):
```
Gallery update finished — 17.5.2026, 14:32:01

Imported (3):
  ✓ 01-sunset.jpg
  ✓ 02-forest.png
  ✓ 03-portrait.jpg

Open index.html to view the gallery.
```

Sample report (with warnings):
```
Gallery update finished — 17.5.2026, 14:32:01

Imported (2):
  ✓ 01-sunset.jpg
  ✓ 02-forest.png

Needs attention (1):
  ⚠ 03-iphone.heic — format may not display in all browsers. Export as JPG if it does not appear.

Skipped (1):
  ✗ raw-photo.cr2 — camera RAW format, cannot display in browser

Open index.html to view the gallery.
```

The report line `Open index.html to view the gallery.` should always be at the bottom when at least one artwork was imported successfully.

---

### v0.07 Full Implementation Checklist

Developer task list in implementation order:

#### Phase 1 — Script and folder structure (no app changes yet, testable standalone)
- [x] Create `customer-artworks/inbox/` with `.gitkeep`
- [x] Create `customer-artworks/processed/` with `.gitkeep`
- [x] Add `customer-artworks/inbox/*`, `!customer-artworks/inbox/.gitkeep`, `customer-artworks/processed/*`, `!customer-artworks/processed/.gitkeep`, `customer-preview/images/`, `customer-preview/customer-artworks.js` (and generated `artworks.json` / `artworks.json.bak` / `last-import-report.txt`) to `.gitignore`
- [x] Write `scripts/import-artworks.mjs` (scan, copy, dimension-read for JPEG/PNG/GIF/WebP/SVG/AVIF, generate manifest + JS + report)
- [x] Write `Update Gallery.command` and `Update Gallery.bat`
- [x] Run `chmod +x "Update Gallery.command"`
- [x] Test: drop real images into `customer-artworks/inbox/`, run `node scripts/import-artworks.mjs`, verify `customer-artworks/artworks.json` and `customer-preview/customer-artworks.js` are correct

#### Phase 2 — App integration (visible result in preview)
- [x] Update `src/main.ts`: read `window.__FREYRAUM_ARTWORKS`, validate with `sanitizeInjectedArtworks()`, prefer it over built-in artworks
- [x] Refactor `Timeline`, `InfoPanel`, `GalleryManager` to accept the active artworks list via constructor instead of importing the global constant
- [x] Update `scripts/write-local-preview.mjs`: inject `<script src="./customer-artworks.js">` into `app.html` + write stub if not present
- [x] Run `npm run build` to rebuild with the new `main.ts` changes
- [x] Test: run importer, verify `customer-preview/customer-artworks.js` contains the expected manifest

#### Phase 3 — Polish and edge cases
- [x] Test portrait, landscape, square, ultrawide images — verify no stretching
- [x] Test SVG and JPEG dimension parsing
- [x] Test empty inbox — verify the stub manifest is written and demo artworks load
- [x] Test unsupported formats — verify warnings appear, no crash
- [x] Document Gatekeeper approval flow on macOS in `docs/CUSTOMER_PICTURE_GUIDE.md`
- [x] Update `docs/CUSTOMER_PICTURE_GUIDE.md` for the completed implementation
- [x] Update `CHANGELOG.md`, `FINDINGS.md`, `plan.md`

#### Phase 4 — Optional future improvements (not required for v0.07)
- [ ] Add `jimp` for image downscaling (long-edge cap 4096 px)
- [ ] Add optional `artworks-metadata.txt` sidecar for custom titles/descriptions
- [ ] Add per-artwork `surfaceProfile` override in the sidecar
- [ ] Add thumbnail generation for timeline previews
- [ ] Add in-app Preferences Panel option to scan a different folder

---

### v0.07 Developer Setup Notes

**What the customer needs installed:**
- Only Node.js (https://nodejs.org, LTS version). The developer installs this once during setup, and the customer never touches it again.
- No `npm install` required for the v0.07 script (zero npm dependencies in Phase 1). If `jimp` is added in Phase 4, the developer runs `npm install` once on the customer machine.

**First-time developer setup on customer machine:**
1. Install Node.js LTS.
2. Clone or copy the FREYRAUM project folder to the customer's computer.
3. Run `npm install` in the project folder (sets up the dev tools; customers do not need to do this again).
4. Run `npm run build` once to generate `customer-preview/`.
5. On macOS: right-click `Update Gallery.command` → Open → Open (Gatekeeper approval, once only).
6. From then on the customer only uses: drag images → double-click `Update Gallery` → double-click `index.html`.

**Testing the importer:**
```sh
node scripts/import-artworks.mjs
# Then open customer-preview/app.html in a browser, or double-click index.html
```

---

## Documentation Rule

For this repository, every meaningful implementation must update the markdown documentation together with the code.

Minimum documentation updates for future work:

- update `plan.md` with current scope, findings, implemented items, and remaining items
- update `CHANGELOG.md` with a dated summary of shipped changes
- update `FINDINGS.md` with important technical observations and limitations
- update `README.md` when user-facing setup, controls, or workflow changes
- update `DOCUMENTATION_RULES.md` when the documentation process itself changes

## Current Baseline

- Root `index.html` is the one-click local launcher.
- `customer-preview/app.html` is the committed local customer preview.
- `app.html` is the Vite development entry.
- The local preview is built as a classic IIFE bundle so it works from `file://`.
- Demo artwork is currently embedded placeholder content for offline preview stability.

## Findings

### Local Preview Findings

- A Vite dev entry cannot be opened directly from `file://` because the browser cannot execute the raw TypeScript/module graph.
- A committed preview build is required if the customer should be able to launch the demo with one click.
- Relative script/style paths and a classic script bundle are the safest local preview format.

### Interaction Findings

- Previous zoom limits allowed the camera to move too close to the artwork plane.
- Previous pan limits were hardcoded and did not respond to aspect ratio or current zoom level.
- Portrait artworks therefore hit vertical inspection limits too early, while extreme zoom could reveal empty space.
- The side preview meshes used a fixed geometry size, which stretched non-square artwork ratios.
- Touch interaction only supported swipe navigation and pinch zoom; it did not support one-finger pan while zoomed in.

## Implemented Now

### Local Preview Foundation

- Added a one-click local launcher in root `index.html`.
- Added committed static preview output in `customer-preview/`.
- Added a separate Vite development entry in `app.html`.
- Added `vite.local.config.ts` and preview HTML generation.
- Replaced remote preview dependencies with embedded placeholder artwork and procedural material input for reliable offline demos.

### Interaction & Gallery Fixes

- Added shared texture sizing helpers in `src/utils/texture.ts`.
- Main artwork sizing now stores fitted artwork width/height after aspect-ratio preservation.
- Zoom is now clamped dynamically so the camera cannot move through or unrealistically inside the artwork.
- Pan is now clamped from real artwork dimensions, camera FOV, viewport aspect ratio, and current zoom level.
- Mouse hover rotation now stays available at every zoom level, with reduced intensity during deeper zoom.
- Mouse drag now pans when panning is possible and falls back to subtle rotation behavior when not.
- Touch interaction now supports one-finger panning when zoomed in and swipe navigation when not zoomed in.
- Side preview panels now preserve aspect ratio instead of stretching textures.

## v0.01 Scope

### v0.01 Implemented

- local one-click customer preview
- offline-safe placeholder artwork setup
- dynamic zoom clamp
- dynamic pan clamp
- touch pan while zoomed
- aspect-ratio-safe side previews
- documentation baseline for changelog, findings, and rules
- **Slice 9 — Structured artwork metadata model** (`id`, `year`, `medium`, `dimensions`, `alt`, `credit`, `tags`) as the v0.01 content contract that maps 1:1 to a future CMS schema
- **Slice 1 — Final local optimized artwork assets**: metadata-driven embedded SVG generator delivers fully offline-safe, color-balanced artworks used as the v0.01 final assets
- **Slice 7 — Timeline thumbnail aspect-ratio handling and skeleton loading state** with no layout shift across portrait, square, landscape, and ultrawide artworks
- **Slice 3 — Zoom UI**: `ZoomControls` component with zoom in, zoom out, reset view; `resetView()` is now public on `GalleryManager`
- **Slice 4 — Keyboard-accessible timeline + focus styles**: timeline thumbs are real `<button>` elements with a roving tabindex; Arrow / Home / End / Enter / Space supported; global `:focus-visible` ring across all controls
- **Slice 2 — Accessibility preferences**: `PreferencesStore` with reduced-motion and high-contrast modes; persisted to `localStorage`; reflected on `<html>` via `data-motion` and `data-contrast`; system `prefers-reduced-motion` and `prefers-contrast` honored as defaults
- **Slice 5 — WebGL fallback screen**: `isWebGLAvailable()` feature detection with a localized fallback card explaining how to enable hardware acceleration
- **Slice 6 — Quality presets**: `high` / `balanced` / `battery` map to pixel-ratio cap, bloom strength, shadow toggle, and artwork geometry segments; rendering, post-processing, lighting, and artwork mesh all subscribe via `applyPreset`
- **Slice 8 — Fullscreen toggle + presentation polish**: standalone fullscreen button with `aria-pressed` state and SVG icons; `data-presentation` attribute dims secondary chrome (topbar, hint text) while in fullscreen
- **Slice 10 — Customer handoff documentation**: SVG architecture diagram in `docs/assets/architecture.svg` plus `docs/HANDOFF.md` with controls reference, accessibility modes, preset matrix, screenshot procedure, and reviewer checklist
- Extended `KeyboardNav` with `+` / `-` zoom, `0` / `R` reset, and `F` fullscreen shortcuts; correctly ignores typing targets and defers ArrowLeft/Right to the timeline when focus is inside it

### v0.01 Still Open: Technical Implementation & Execution Plan

This plan turns the remaining v0.01 scope into vertical slices. Each slice must produce a working, reviewable increment that includes code, local preview output, documentation, validation notes, and customer-facing behavior where applicable.

> Status note (2026-05-17): All ten slices below have been implemented in this v0.01 pass. The detail is retained so future contributors can reproduce or audit the slice-level reasoning and so the "Reserved Future Pass" items remain traceable to their parent slice.

#### Vertical Slice Rules For v0.01

- Do not implement broad horizontal refactors without visible product value in the same slice.
- Each slice must update source code, `customer-preview/` when runtime behavior changes, and the markdown files that describe the change.
- Each slice must define its own acceptance checks before implementation starts.
- Each slice should remain small enough to be completed by Claude 4.7 or GPT 5.5 in one focused pass.
- If a slice uncovers larger architecture work, document it under "Reserved Future Pass" instead of expanding v0.01.

#### Slice 1 — Final Local Artwork Asset Pipeline

Goal: replace embedded placeholder artwork with final optimized local assets while keeping offline preview reliability.

Implementation targets:

- create a local asset folder such as `src/assets/artworks/` or `public/assets/artworks/`
- replace placeholder data URI usage in `src/config/artworks.ts` with local asset references
- extend artwork metadata with asset dimensions, alt text, credit/source fields, and delivery notes
- ensure `TextureManager` continues to preload all artwork assets before the loading overlay exits
- keep `customer-preview/` fully self-contained after `npm run build`

Acceptance checks:

- `npm run build` succeeds and emits local artwork files in the preview bundle/output
- root `index.html` still opens the preview without a development server
- every artwork displays with correct aspect ratio in the main mesh, side previews, and timeline
- `FINDINGS.md` records any asset-size or compression tradeoffs

Reserved Future Pass:

- CMS upload UI
- remote asset CDN integration
- advanced responsive image generation beyond the local preview need

#### Slice 2 — Accessibility Motion & Contrast Controls

Goal: make the presentation safer and clearer for users who need reduced motion or stronger contrast.

Implementation targets:

- add an application-level preferences module for motion and contrast state
- read `prefers-reduced-motion` and map it to scene/UI animation intensity
- add a visible high-contrast overlay mode or theme class on the root app element
- reduce hover rotation, transition amplitude, loading spinner animation, and panel motion when reduced motion is active
- strengthen glass panel opacity, text contrast, and button borders for high-contrast mode
- document the supported accessibility preferences in `README.md`

Acceptance checks:

- reduced-motion users get no large animated transitions or spinning loader animation
- high-contrast mode keeps text and controls legible over bright and dark artwork
- controls remain visible and usable at all zoom levels
- `npm run lint` and `npm run build` pass

Reserved Future Pass:

- full WCAG audit
- persisted user preference storage
- advanced theme editor

#### Slice 3 — Explicit Zoom & Reset View UI

Goal: add visible controls so users are not dependent on mouse wheel or pinch gestures.

Implementation targets:

- expose gallery methods for zoom in, zoom out, reset view, and current zoom state
- add a `ZoomControls` UI component under `src/ui/`
- include buttons for zoom in, zoom out, and reset view
- place controls where they do not overlap navigation, timeline, or info panels
- ensure buttons work with mouse, touch, keyboard focus, and screen-reader labels
- keep pan and zoom clamped through existing `GalleryManager` safety rules

Acceptance checks:

- zoom buttons cannot exceed the same min/max limits as wheel and pinch zoom
- reset view returns pan, zoom, and hover rotation to the safe default framing
- controls stay available at all zoom levels
- local preview output is rebuilt

Reserved Future Pass:

- zoom slider with exact percentages
- minimap / overview navigator
- saved view positions per artwork

#### Slice 4 — Keyboard-Accessible Timeline & Focus Styles

Goal: make artwork navigation usable without pointer input.

Implementation targets:

- update `src/timeline/Timeline.ts` so timeline items are real buttons or have equivalent ARIA roles
- add roving tabindex or another clear keyboard model for timeline navigation
- support Enter/Space selection and arrow-key movement across thumbnails
- add visible focus styles in `src/styles/main.scss` for timeline, navigation, zoom, and fullscreen controls
- preserve active artwork state for screen-reader announcements
- avoid breaking existing click/touch timeline selection

Acceptance checks:

- keyboard-only users can reach every timeline item and select it
- focus state is visually obvious against the glass UI
- active item state is programmatically and visually clear
- no duplicate tab stops are introduced

Reserved Future Pass:

- full screen-reader narration pass
- translated ARIA labels
- automated accessibility testing setup

#### Slice 5 — Lightweight WebGL Fallback Screen

Goal: show a useful fallback when WebGL is unavailable instead of failing silently.

Implementation targets:

- add a small feature-detection function before renderer creation in `src/main.ts`
- check WebGL support and handle renderer initialization failures
- create a fallback UI component or inline fallback screen with plain HTML/CSS
- explain the issue and suggest enabling hardware acceleration or using a modern browser
- keep fallback compatible with `file://` local preview

Acceptance checks:

- app shows a readable fallback if WebGL cannot initialize
- normal WebGL-capable browsers still load the gallery unchanged
- fallback copy is documented for customer support

Reserved Future Pass:

- non-WebGL static gallery mode
- server-side generated fallback screenshots

#### Slice 6 — Quality Presets For Integrated GPU / Battery Mode

Goal: provide predictable performance controls for weaker devices without changing the visual direction.

Implementation targets:

- create quality preset definitions for high, balanced, and battery/integrated GPU mode
- connect presets to renderer pixel ratio, post-processing bloom, shadow settings, and geometry/detail where safe
- use `getOptimalPixelRatio` as the starting point, not a parallel system
- add a UI selector only if it can be implemented without cluttering the presentation
- document default preset choice and manual override behavior

Acceptance checks:

- low preset visibly reduces GPU cost by lowering pixel ratio and expensive post-processing
- high preset preserves current presentation quality
- changing presets does not reset artwork selection unexpectedly
- preview build remains stable from `file://`

Reserved Future Pass:

- automatic FPS measurement and adaptive quality switching
- detailed device benchmarking

#### Slice 7 — Timeline Thumbnail Aspect Ratio & Loading States

Goal: make timeline thumbnails visually stable and consistent with the side preview aspect-ratio fix.

Implementation targets:

- use artwork metadata dimensions to decide thumbnail fit behavior
- choose a documented default between contain, cover, or framed contain for thumbnails
- add loading/skeleton state before images finish loading
- avoid layout shift when thumbnails load
- keep active and focus states readable over all thumbnail formats

Acceptance checks:

- portrait, square, landscape, and ultra-wide thumbnails no longer look unintentionally stretched
- thumbnails reserve stable dimensions while loading
- timeline remains scrollable and usable on narrow screens
- implementation is documented in `FINDINGS.md`

Reserved Future Pass:

- generated thumbnail derivatives
- responsive thumbnail density controls

#### Slice 8 — Fullscreen Toggle & Presentation Mode Polish

Goal: support customer presentation use without browser UI distractions.

Implementation targets:

- add a fullscreen/presentation control in `src/ui/`
- use the browser Fullscreen API with graceful fallback when unavailable
- add presentation mode styling for reduced clutter if fullscreen is active
- ensure Escape/browser fullscreen exit updates UI state correctly
- keep navigation, zoom, reset, and timeline controls reachable while presenting

Acceptance checks:

- fullscreen can be entered and exited without breaking WebGL rendering or layout
- UI state updates when fullscreen exits through browser controls
- presentation mode does not hide critical controls permanently
- behavior is documented for customer demos

Reserved Future Pass:

- kiosk mode packaging
- multi-screen presenter controls

#### Slice 9 — Structured Artwork Metadata Model For Future CMS

Goal: prepare the content model for later CMS integration without adding a CMS yet.

Implementation targets:

- replace the minimal `Artwork` interface with a structured model that includes stable id, title, subtitle, description, dimensions, alt text, credits, tags, and asset paths
- keep a local static data source as the canonical v0.01 content source
- update all consumers: info panel, timeline, gallery preload, side panels, and future documentation screenshots
- document which fields are required now and which are reserved for future CMS use

Acceptance checks:

- TypeScript catches missing required artwork fields
- existing gallery UI still works with the new metadata model
- local preview still works offline
- `FINDINGS.md` records CMS-readiness boundaries

Reserved Future Pass:

- live CMS API loading
- editorial admin workflows
- localization fields and translation management

#### Slice 10 — Customer Handoff Screenshots & Architecture Diagrams

Goal: make the project easier to review and hand off to non-developers.

Implementation targets:

- create a documentation asset folder such as `docs/assets/`
- add current local-preview screenshots generated from the committed preview
- add a simple architecture diagram covering launcher, preview build, source app, asset pipeline, and documentation flow
- link screenshots and diagrams from `README.md` and `plan.md`
- document how screenshots should be regenerated after visual changes

Acceptance checks:

- screenshots reflect the current committed preview
- architecture diagram explains the local preview and development build paths clearly
- documentation remains useful when viewed directly on GitHub

Reserved Future Pass:

- automated screenshot generation in CI
- branded customer PDF handoff deck

#### Recommended v0.01 Execution Order

1. Slice 9 — Structured Artwork Metadata Model For Future CMS
2. Slice 1 — Final Local Artwork Asset Pipeline
3. Slice 7 — Timeline Thumbnail Aspect Ratio & Loading States
4. Slice 3 — Explicit Zoom & Reset View UI
5. Slice 4 — Keyboard-Accessible Timeline & Focus Styles
6. Slice 2 — Accessibility Motion & Contrast Controls
7. Slice 5 — Lightweight WebGL Fallback Screen
8. Slice 6 — Quality Presets For Integrated GPU / Battery Mode
9. Slice 8 — Fullscreen Toggle & Presentation Mode Polish
10. Slice 10 — Customer Handoff Screenshots & Architecture Diagrams

This order starts with the data model and local assets because later UI, thumbnails, accessibility labels, and documentation screenshots depend on stable artwork metadata.


## v0.04 Implementation and Execution Plan — Photorealistic PBR Painting Materials and Artifact Removal

### v0.04 Status

**Implemented (2026-05-17).** The code audit and execution plan below have been carried out against the current branch. The detailed implementation guide is retained as historical design intent, and this outcome section records the as-built changes, validation evidence, and remaining review notes.

### v0.04 Implementation Outcome

Implemented slices:

1. **Neutral AO fallback** — `ProceduralTextureFactory.generateAO()` no longer computes radial edge darkening. The AO fallback now emits near-white neutral occlusion with subtle value-noise grain, so flat paintings no longer receive synthetic vignette shadows.
2. **Stochastic procedural support maps** — `generateNormal()`, `generateHeight()`, and `generateRoughness()` now use deterministic smoothstep-interpolated value noise instead of `sin/cos` fields. This removes the old checkerboard, horizontal-band, vertical-band, and diagonal-weave cues.
3. **Deterministic value-noise utilities** — added `valueNoise2d()` and `latticeHash()` to `ProceduralTextureFactory`. They are pure TypeScript/JavaScript, use `Math.imul` integer mixing, require no dependency, and remain stable per artwork seed and tile size.
4. **Clearcoat / varnish contract** — `PaintingTextureSet` now supports a `varnish` map role, `TextureManager.preloadTextureSet()` loads authored varnish maps, and `ResolvedPaintingTextures` can pass them into the material.
5. **Preset-gated clearcoat** — `QualityPreset` now exposes `clearcoatEnabled`, `clearcoatStrength`, and `clearcoatRoughnessValue`. Only the high preset enables the clearcoat BxDF; balanced and battery compile/run without it.
6. **Surface-profile material response** — `PaintingMaterial.applySurfaceProfile()` maps `SurfaceProfile` metadata to clearcoat intensity/roughness. Matte and paper profiles remain matte; satin canvas gets a subtle sheen; future varnished-oil artworks get a capped varnish response.
7. **Artwork metadata wiring** — all four built-in artworks now set `surfaceProfile`; `GalleryManager` applies the profile after every race-protected artwork load.
8. **Parallax height fallback fix** — `GalleryManager.shouldFillRole('height')` now generates height maps whenever bump, parallax, or self-shadow needs them. This closes a high-preset gap where parallax/self-shadow could request height-driven shader paths without a fallback height texture.
9. **User-facing surface label** — `InfoPanel` now appends a German surface label (for example `Matte Leinwand` or `Satinierte Leinwand`) to the artwork metadata line, making the material response understandable without exposing technical shader terms.
10. **Preview regenerated** — `customer-preview/freyraum-gallery.js` was rebuilt from the implemented source so the one-click `file://` preview remains current.

Validation evidence:

- `npm run lint` passes. Output contains only the existing `@typescript-eslint` TypeScript-version warning.
- `npm run build` passes (`tsc` + Vite preview build + local preview HTML writer). Output contains only the existing Dart Sass legacy JS API deprecation warning.
- Preview bundle after v0.04 implementation: `customer-preview/freyraum-gallery.js` ≈ **555.05 KB** (gzip ≈ **141.43 KB**), CSS ≈ **15.36 KB** (gzip ≈ **3.42 KB**).
- No new npm dependency was added.
- No new async loading path was introduced; existing `artworkLoadToken` race protection remains in place.
- Resource ownership remains unchanged: textures are still disposed by `TextureManager` / `ProceduralTextureFactory`, not by `PaintingMaterial`.

As-built deviations from the planning text:

- The original plan treated `varnish` primarily as authored-data input. The implementation also added a `generateVarnish()` fallback method for completeness if the role is requested later; it is not included in the default procedural role list, so current built-in artworks still use profile-driven clearcoat instead of synthetic varnish masks.
- The original file-change count did not include the user-facing `InfoPanel` update. It was added to make the surface-profile feature discoverable and user friendly.
- The high-preset height fallback bug was fixed because it is directly coupled to v0.04 material correctness, even though it was not listed as a separate v0.04 slice.

---

### v0.04 Code Audit — Exact Diagnosed Issues

#### Bug 1 — Fake vignette edge-darkening

**File:** `src/materials/ProceduralTextureFactory.ts`
**Method:** `generateAO(seed, size)` **Lines 200–222**

```ts
const nx = (x - half) / half;
const ny = (y - half) / half;
const r2 = nx * nx + ny * ny;
const vignette = 1 - Math.min(1, r2 * 0.55);   // ← THE BUG
const fine = Math.sin(x * 0.13 + o) * Math.cos(y * 0.11) * 0.05;
const v = this.clamp8((vignette + fine) * 255);
```

`vignette` evaluates to ~1.0 at the texture centre and ~0.45 at the corners, producing a centre-bright / edge-dark gradient. This is applied as the `aoMap` uniform (`aoMapIntensity = 1.0`, `PaintingMaterial.ts:420`). On a flat vertical painting surface there is no physical occlusion at the edges — the darkening reads as a content error burned into the artwork.

**Active path:** `quality.ts` high preset `aoEnabled: true` (line 82) → `GalleryManager` fills `textures.ao` via `procedural.generate(id, 'ao', tileSize)` → `PaintingMaterial.applyTextures()` line 419 sets `this.aoMap = textures.ao`.

#### Bug 2 — Checkerboard / cross-hatch from periodic procedural generators

**File:** `src/materials/ProceduralTextureFactory.ts`

**`generateNormal()` lines 95–101:**
```ts
const oct1 = Math.sin(x * 0.42 * freqScale + offset) * Math.cos(y * 0.38 * freqScale) * oct1Amp;
const oct2 = Math.sin(x * 0.19 * freqScale + offset * 2) * Math.cos(y * 0.22 * freqScale) * oct2Amp;
const weave = Math.sin((x + y) * 0.11 * freqScale) * weaveAmp;
```
Two `sin × cos` octaves at fixed harmonics (0.42×0.38, 0.19×0.22) plus a diagonal `sin((x+y)*0.11)` weave. These combine into a deterministic 2D lattice that tiles visibly at every resolution, giving the appearance of a woven grid rather than actual canvas fibre.

**`generateHeight()` lines 119–121:**
```ts
const stroke = Math.abs(Math.sin(y * 0.12 + o1)) * 80;  // horizontal bands
const cross  = Math.abs(Math.sin(x * 0.09 + o2)) * 30;  // vertical bands
const tooth  = Math.sin(x * 1.4) * Math.sin(y * 1.6) * 12;
```
`Math.abs(sin(...))` on a single frequency creates half-period arches that are visually obvious — the brush-stroke channel (`stroke`) shows as horizontal banding and the cross-hatch (`cross`) as vertical banding. Under raking-light inspection this reads as a perfect grid, not an oil-paint impasto surface.

**`generateRoughness()` lines 145–148:**
```ts
const n1 = (Math.sin(x * 0.09 + o) * Math.cos(y * 0.07)) * 0.5 + 0.5;
const n2 = (Math.sin(x * 0.21 + 1.3) * Math.cos(y * 0.18 + 0.7)) * 0.5 + 0.5;
```
Two additional `sin × cos` products — less visually dominant than height but still periodic and will show on close inspection.

#### Gap 1 — `SurfaceProfile` declared but never wired to the material

**File:** `src/config/artworks.ts` — `SurfaceProfile` type ('matte-canvas' | 'satin-canvas' | 'varnished-oil' | 'paper' | 'procedural-fallback') is defined. The `Artwork.surfaceProfile` optional field exists in the interface (line 69) but **none of the four artworks in the `artworks` array set it**.

**File:** `src/materials/PaintingMaterial.ts` — constructor line 89 hard-codes `clearcoat: 0.0`. There is no code path that reads `surfaceProfile` and adjusts the clearcoat response.

#### Gap 2 — No varnish map role in the texture contract

**File:** `src/materials/PaintingTextureSet.ts` — `PaintingMapRole` union does not include a clearcoat / varnish channel. `Three.js 0.166` `MeshPhysicalMaterial` natively supports `clearcoatMap` (a grayscale mask for per-pixel clearcoat intensity), but there is no slot for it in the authored-map pipeline.

#### Gap 3 — No clearcoat fields in `QualityPreset`

**File:** `src/config/quality.ts` — The `QualityPreset` interface has no `clearcoatEnabled`, `clearcoatStrength`, or `clearcoatRoughnessValue` fields. Clearcoat adds a second specular integration pass (~5–8% GPU) and must be preset-gated.

---

### v0.04 Goals

- Eliminate the fake AO vignette from the procedural high-preset path.
- Replace all `sin/cos`-periodic procedural generators with value-noise generators that produce aperiodic, non-repeating surface detail.
- Wire the existing `SurfaceProfile` field from `artworks.ts` through to `PaintingMaterial` so matte canvas, satin canvas, and varnished oil diverge in their specular/clearcoat response.
- Add a `'varnish'` map role to the texture contract to support future authored clearcoat masks.
- Extend `QualityPreset` with preset-gated clearcoat control fields.
- Keep the offline `file://` preview workflow and WebGL production path intact.
- `npm run lint` and `npm run build` must pass after every slice.

### v0.04 Non-Goals

- Not replacing the WebGL renderer with WebGPU.
- Not baking lighting, shadows, or vignettes into the albedo.
- Not requiring authored maps to run (fully offline procedural fallback remains).
- Not implementing RTI / photometric relighting.
- Not changing frame, wall, or room materials in this pass.

### v0.04 Performance Contracts

| Preset | Clearcoat BxDF | AO map | Procedural tile size | Expected GPU delta vs v0.03 |
|--------|---------------|--------|----------------------|-----------------------------|
| high | enabled (`clearcoatEnabled: true`) | enabled (`aoEnabled: true`) | 1024 px | < +4% |
| balanced | disabled | disabled | 512 px | 0 delta |
| battery | disabled | disabled | 256 px | 0 delta |

### v0.04 Math-Space Contracts

- All procedural maps remain 8-bit RGBA linear-space outputs (`makeDataTexture(data, size, size, false)`). No colour-space change.
- Albedo (`map`) continues to carry sRGB source data and must not be modified.
- Normal maps encode tangent-space `(Nx, Ny, Nz)` packed to `[0..1]` as before.
- Value-noise output range `[0..1]` maps into the existing map ranges (`140–240` for roughness, `128 ± delta` for normals) via the same `clamp8()` arithmetic — no downstream contract change.
- The new `latticeHash()` function uses only `Math.imul`, bit shifts, and unsigned-right-shift coercions. `Math.imul` is ES2016 and is within the project's current TypeScript target.

### v0.04 Resource Ownership / Async Contracts

- `PaintingMaterial` must not dispose textures it does not own (existing rule, unchanged).
- Procedural maps remain deterministic and cache-keyed by `artworkId::role::tileSize` — `valueNoise2d` is seeded by the existing `hash(artworkId)` so the same artwork always produces the same map.
- Async artwork switching continues to honour `artworkLoadToken` — no new async paths are introduced in this plan.

---

### v0.04 Vertical Slices — File-Level Execution Guide

---

#### Slice S1 — Fix: neutralize the AO vignette

**File to edit:** `src/materials/ProceduralTextureFactory.ts`
**Method:** `private generateAO(seed: number, size: number): THREE.Texture` (lines 200–222)

**Current broken lines (207–214):**
```ts
const half = size / 2;
for (let y = 0; y < size; y += 1) {
  for (let x = 0; x < size; x += 1) {
    const idx = (y * size + x) * 4;
    const nx = (x - half) / half;
    const ny = (y - half) / half;
    const r2 = nx * nx + ny * ny;
    const vignette = 1 - Math.min(1, r2 * 0.55);   // produces fake radial darkening
    const fine = Math.sin(x * 0.13 + o) * Math.cos(y * 0.11) * 0.05;
    const v = this.clamp8((vignette + fine) * 255);
```

**Replacement logic:**
- Remove `half`, `nx`, `ny`, `r2`, `vignette`, and the `fine` sin-term.
- Replace with a flat neutral value `242` (≈ 0.95, near-white = near-zero occlusion) plus subtle value-noise grain (±9 units) to avoid a dead-flat look:

```ts
const grain = this.valueNoise2d(x * 0.11, y * 0.11, seed) * 18;
const v = this.clamp8(237 + grain);
```

Also remove `const o = ((seed % 64) / 64) * 0.4;` (line 203) — it was only used for the sin fine-detail term which is now gone.

**Expected visual result:** The painting edges will be as bright as the centre. AO will only darken surfaces when an authored/scanned AO map is loaded. The high-preset procedural fallback path will show zero vignette.

---

#### Slice S2 — Fix: replace `generateHeight()` sin-bands with value noise

**File to edit:** `src/materials/ProceduralTextureFactory.ts`
**Method:** `private generateHeight(seed: number, size: number): THREE.Texture` (lines 111–131)

**Remove lines 113–121:**
```ts
const o1 = (seed % 64) * 0.05;
const o2 = (seed % 32) * 0.07;
// inside the loop:
const stroke = Math.abs(Math.sin(y * 0.12 + o1)) * 80;
const cross  = Math.abs(Math.sin(x * 0.09 + o2)) * 30;
const tooth  = Math.sin(x * 1.4) * Math.sin(y * 1.6) * 12;
const h = this.clamp8(stroke + cross + tooth);
```

**Replacement (inside the y/x loop):**
```ts
// Multi-octave value noise — no sin/cos periodicity.
// Three frequency bands mimic macro canvas undulation, mid-frequency
// brushstroke ridges, and high-frequency tooth/impasto texture.
const macro = this.valueNoise2d(x * 0.04, y * 0.04, seed)       * 90;
const mid   = this.valueNoise2d(x * 0.12, y * 0.09, seed +  7)  * 40;
const micro = this.valueNoise2d(x * 0.55, y * 0.55, seed + 31)  * 16;
const h = this.clamp8(macro + mid + micro);
```

Remove `o1` and `o2` variable declarations above the loop — they are no longer needed.

**Expected visual result:** Height map shows irregular undulations that read like real canvas+brush texture under raking light. No horizontal or vertical banding. The three frequency octaves together span the [0, 146] range on average, leaving a realistic dynamic range for the parallax march.

---

#### Slice S3 — Fix: replace `generateNormal()` sin×cos lattice with value-noise gradients

**File to edit:** `src/materials/ProceduralTextureFactory.ts`
**Method:** `private generateNormal(seed, size, oct1Amp, oct2Amp, weaveAmp, freqScale)` (lines 80–108)

**Remove lines 89–103 (inner loop body):**
```ts
const offset = ((seed % 100) / 100) * Math.PI * 2;
// inside loop:
const oct1  = Math.sin(x * 0.42 * freqScale + offset) * Math.cos(y * 0.38 * freqScale) * oct1Amp;
const oct2  = Math.sin(x * 0.19 * freqScale + offset * 2) * Math.cos(y * 0.22 * freqScale) * oct2Amp;
const weave = Math.sin((x + y) * 0.11 * freqScale) * weaveAmp;
const v = oct1 + oct2 + weave;
data[idx + 0] = this.clamp8(128 + v);
data[idx + 1] = this.clamp8(128 - v);
```

**Replacement — finite-difference gradient of multi-octave value noise:**

Finite differences on a value-noise field produce a proper gradient (normal map) with no periodicity. The `+1` neighbour samples are computed per pixel; this is acceptable because the texture is generated once and cached.

```ts
// Finite-difference gradient from two value-noise octaves.
// freqScale drives how many texture-space cycles fit across the tile;
// oct1Amp / oct2Amp control the macro vs fine relief contribution.
const f1 = 0.055 * freqScale;
const f2 = 0.14  * freqScale;

// Octave 1 — three sample points for finite difference
const h1_00 = this.valueNoise2d(x * f1,       y * f1,       seed);
const h1_10 = this.valueNoise2d((x + 1) * f1, y * f1,       seed);
const h1_01 = this.valueNoise2d(x * f1,       (y + 1) * f1, seed);

// Octave 2 (finer detail) — uses seed offset to decorrelate from octave 1
const h2_00 = this.valueNoise2d(x * f2,       y * f2,       seed + 17);
const h2_10 = this.valueNoise2d((x + 1) * f2, y * f2,       seed + 17);
const h2_01 = this.valueNoise2d(x * f2,       (y + 1) * f2, seed + 17);

// Gradient: gx = dH/dx,  gy = dH/dy
const gx = (h1_10 - h1_00) * oct1Amp + (h2_10 - h2_00) * oct2Amp;
const gy = (h1_01 - h1_00) * oct1Amp + (h2_01 - h2_00) * oct2Amp;

// Pack into tangent-space normal (R=Nx, G=Ny, B=255 flat base)
data[idx + 0] = this.clamp8(128 + gx * 28);   // Nx
data[idx + 1] = this.clamp8(128 + gy * 28);   // Ny
data[idx + 2] = 255;                            // Nz
data[idx + 3] = 255;
```

Remove `const offset = ...` above the loop — it is no longer needed.

**Note on call sites:** The method signature is unchanged. Both call sites in `generate()` (line 38 for `'normal'` and line 41 for `'detailNormal'`) continue to pass the same amp and freqScale parameters; only the internal math changes. The `weaveAmp` parameter becomes unused — keep it in the signature for now to avoid a call-site diff and add a TypeScript `_weaveAmp` rename later if desired.

---

#### Slice S4 — Fix: replace `generateRoughness()` sin×cos with value noise

**File to edit:** `src/materials/ProceduralTextureFactory.ts`
**Method:** `private generateRoughness(seed: number, size: number): THREE.Texture` (lines 138–157)

**Remove lines 140–148:**
```ts
const o = ((seed % 50) / 50) * 0.8;
// inside loop:
const n1 = (Math.sin(x * 0.09 + o) * Math.cos(y * 0.07)) * 0.5 + 0.5;
const n2 = (Math.sin(x * 0.21 + 1.3) * Math.cos(y * 0.18 + 0.7)) * 0.5 + 0.5;
const combined = n1 * 0.7 + n2 * 0.3;
const r = this.clamp8(140 + combined * 100);
```

**Replacement:**
```ts
// Two value-noise octaves maintain the same output range [140..240]
// (matte canvas roughness range from v0.03) without any periodicity.
const lo = this.valueNoise2d(x * 0.07, y * 0.07, seed +  3);
const hi = this.valueNoise2d(x * 0.24, y * 0.24, seed + 19);
const combined = lo * 0.65 + hi * 0.35;  // weighted blend, range 0..1
const r = this.clamp8(140 + combined * 100);
```

Remove `const o = ...` above the loop.

---

#### Slice S5 — Add: `valueNoise2d()` and `latticeHash()` private helpers

**File to edit:** `src/materials/ProceduralTextureFactory.ts`
**Location:** Add immediately after the existing `private hash(value: string)` method (after line 279).

```typescript
/**
 * Smoothstep-interpolated 2D value noise. Returns [0..1].
 *
 * Uses integer lattice positions + bit-mixing hash — no sin/cos,
 * no external libraries, fully deterministic given the same seed.
 *
 * @param x   Continuous x coordinate (caller chooses scale/frequency).
 * @param y   Continuous y coordinate.
 * @param s   Integer seed (pass artworkHash + an octave-specific constant
 *            to keep octaves statistically independent).
 */
private valueNoise2d(x: number, y: number, s: number): number {
  const xi = Math.floor(x) | 0;
  const yi = Math.floor(y) | 0;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);

  // Smoothstep fade curves — eliminates lattice-boundary discontinuities.
  const ux = xf * xf * (3 - 2 * xf);
  const uy = yf * yf * (3 - 2 * yf);

  // Hash the four surrounding integer lattice corners to [0..1].
  const h00 = this.latticeHash(xi,     yi,     s);
  const h10 = this.latticeHash(xi + 1, yi,     s);
  const h01 = this.latticeHash(xi,     yi + 1, s);
  const h11 = this.latticeHash(xi + 1, yi + 1, s);

  // Bilinear interpolation with smoothstep weights.
  return h00 * (1 - ux) * (1 - uy)
       + h10 * ux       * (1 - uy)
       + h01 * (1 - ux) * uy
       + h11 * ux       * uy;
}

/**
 * Maps integer lattice coordinates (ix, iy) + seed to a float in [0..1].
 *
 * Uses a cascade of multiply-xor mix operations (LCG + Murmur-style)
 * to give good avalanche without external dependencies.
 * Math.imul is ES2016 — within the project's TypeScript target.
 */
private latticeHash(ix: number, iy: number, seed: number): number {
  let h = (seed * 1664525 + ix * 1013904223) >>> 0;
  h = (h ^ (iy * 1540483477)) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  h = Math.imul(h, 0x45d9f3b) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return (h >>> 0) / 0xffffffff;
}
```

**TypeScript note:** `Math.imul` is typed in `lib.es2015.core.d.ts` and is unconditionally available in the current `tsconfig.json` target. No `lib` change needed.

---

#### Slice S6 — Extend `QualityPreset` with clearcoat fields

**File to edit:** `src/config/quality.ts`
**Location:** After the last v0.03 field (`selfShadowStrength: number`, line 60).

Add to the `QualityPreset` interface:
```typescript
// ── v0.04 clearcoat / varnish fields ──────────────────────────────────────
/**
 * Whether the Three.js clearcoat BxDF is enabled.
 * Adds a second specular integration pass (~5-8% GPU cost).
 * Disabled on balanced and battery presets.
 */
clearcoatEnabled: boolean;
/**
 * Base clearcoat intensity used when no authored varnish map is present.
 * Range 0..1. For 'varnished-oil' the applySurfaceProfile() method
 * scales this by 1.6 (capped at 0.2); for 'satin-canvas' by 0.4.
 */
clearcoatStrength: number;
/**
 * Clearcoat roughness: 0 = mirror-like varnish, 1 = rough satin.
 * Value 0.35 approximates a typical oil varnish at room temperature.
 */
clearcoatRoughnessValue: number;
```

Add the three fields to each preset object in `QUALITY_PRESETS`:

```typescript
high: {
  // ... existing fields unchanged ...
  clearcoatEnabled: true,
  clearcoatStrength: 0.12,
  clearcoatRoughnessValue: 0.35,
},
balanced: {
  // ... existing fields unchanged ...
  clearcoatEnabled: false,
  clearcoatStrength: 0.0,
  clearcoatRoughnessValue: 0.35,
},
battery: {
  // ... existing fields unchanged ...
  clearcoatEnabled: false,
  clearcoatStrength: 0.0,
  clearcoatRoughnessValue: 0.0,
},
```

---

#### Slice S7 — Add `'varnish'` map role to the texture contract

**File to edit:** `src/materials/PaintingTextureSet.ts`

1. Add `'varnish'` to the `PaintingMapRole` union (line 16):
```typescript
export type PaintingMapRole =
  | 'albedo'
  | 'normal'
  | 'detailNormal'
  | 'height'
  | 'roughness'
  | 'specular'
  | 'ao'
  | 'varnish';   // v0.04: grayscale R-channel clearcoat intensity mask (linear)
```

2. Add `varnish` to `PaintingTextureSet` (after the `ao` field):
```typescript
/**
 * Grayscale R-channel clearcoat / varnish intensity mask (linear).
 * 1.0 = fully varnished (max clearcoat), 0.0 = unvarnished matte.
 * Optional. When absent, clearcoat falls back to the per-artwork
 * SurfaceProfile base value from applySurfaceProfile().
 */
varnish?: PaintingTextureMapEntry;
```

3. Add `varnish` to `ResolvedPaintingTextures` (after the `ao` field):
```typescript
varnish?: THREE.Texture;
```

---

#### Slice S8 — Wire clearcoat / varnish into `PaintingMaterial`

**File to edit:** `src/materials/PaintingMaterial.ts`

**Step A — Modify `applyTextures()` (line 390):**
Add after the existing `this.aoMap = textures.ao ?? null;` (line 419) and before `this.applyPreset(preset)` (line 422):
```typescript
// v0.04: clearcoat / varnish mask.
// Three.js MeshPhysicalMaterial.clearcoatMap accepts a grayscale texture
// that modulates the per-pixel clearcoat intensity. We set clearcoat only
// when the preset enables it to avoid the extra BxDF cost on balanced/battery.
this.clearcoatMap = preset.clearcoatEnabled ? (textures.varnish ?? null) : null;
this.clearcoat = preset.clearcoatEnabled
  ? (textures.varnish ? preset.clearcoatStrength : 0.0)
  : 0.0;
this.clearcoatRoughness = preset.clearcoatRoughnessValue;
```

**Step B — Modify `applyPreset()` (line 329):**
Add a clearcoat reset block at the top of `applyPreset()` (before the normalScale line):
```typescript
// v0.04: disable clearcoat on preset downgrade.
if (!preset.clearcoatEnabled) {
  this.clearcoat = 0.0;
  this.clearcoatMap = null;
}
```

**Step C — Add `applySurfaceProfile()` method (new, add after `applyPreset()`):**
```typescript
/**
 * v0.04: applies per-artwork surface character overrides for clearcoat.
 *
 * Called by GalleryManager after applyTextures(). Reads the artwork's
 * SurfaceProfile and adjusts clearcoat intensity and roughness. When an
 * authored varnish map is already bound (clearcoatMap != null) this method
 * only adjusts roughness, not intensity, because the map already provides
 * per-pixel control.
 *
 * This method is a no-op when clearcoatEnabled is false on the preset.
 */
applySurfaceProfile(profile: SurfaceProfile | undefined, preset: QualityPreset): void {
  if (!preset.clearcoatEnabled) return;
  switch (profile) {
    case 'varnished-oil':
      // Moderate clearcoat even without an authored map — historical oil
      // paintings carry a varnish layer regardless of whether we have a
      // per-pixel mask for it.
      if (!this.clearcoatMap) this.clearcoat = Math.min(preset.clearcoatStrength * 1.6, 0.20);
      this.clearcoatRoughness = 0.22;
      break;
    case 'satin-canvas':
      // Light sizing / sizing residue gives satin canvas a subtle sheen.
      if (!this.clearcoatMap) this.clearcoat = preset.clearcoatStrength * 0.4;
      this.clearcoatRoughness = 0.50;
      break;
    case 'matte-canvas':
    case 'paper':
    case 'procedural-fallback':
    default:
      if (!this.clearcoatMap) this.clearcoat = 0.0;
      this.clearcoatRoughness = preset.clearcoatRoughnessValue;
      break;
  }
}
```

**Step D — Add `'varnish'` to `activeMaps()`** (line 457):
```typescript
if (this.clearcoatMap) active.push('varnish');
```

**Step E — Import `SurfaceProfile` type:**
Add to the import block at the top of `PaintingMaterial.ts`:
```typescript
import type { SurfaceProfile } from '../config/artworks';
```

---

#### Slice S9 — Wire varnish into `TextureManager` and `GalleryManager`

**File to edit:** `src/gallery/TextureManager.ts`
**Method:** `preloadTextureSet()` (line 76)

Add `'varnish'` to the `roles` array (line 79):
```typescript
const roles: PaintingMapRole[] = [
  'albedo', 'normal', 'detailNormal', 'height',
  'roughness', 'specular', 'ao',
  'varnish',  // v0.04
];
```

**File to edit:** `src/gallery/GalleryManager.ts`

Locate the artwork load completion callback where `artworkMesh.setPaintingTextures(resolved, preset)` is called. Add immediately after that call:
```typescript
// v0.04: per-artwork surface profile drives clearcoat response.
this.artworkMesh.material.applySurfaceProfile(
  artwork.surfaceProfile,
  this.currentPreset!
);
```

The variable `artwork` is already in scope at that point (it is the `artworks[token]` entry captured at the top of the navigateTo load flow).

---

#### Slice S10 — Set `surfaceProfile` on all four artworks

**File to edit:** `src/config/artworks.ts`

Add `surfaceProfile` to each artwork entry in the `artworks` array. Based on the medium descriptions:

```typescript
// electric-storm — soft landscape, matte digital painting
surfaceProfile: 'matte-canvas',

// quiet-coastline — minimal coastal, matte
surfaceProfile: 'matte-canvas',

// tokyo-passage — urban cinematic, slight sheen (sizing/varnish plausible)
surfaceProfile: 'satin-canvas',

// golden-desert — warm desert, matte
surfaceProfile: 'matte-canvas',
```

---

#### Slice S11 — Validation checklist (run after all slices)

1. `npm run lint` — must pass with no new errors.
2. `npm run build` — must pass. TypeScript strict mode must not reject the new `applySurfaceProfile` import or the `Math.imul` call.
3. Open `customer-preview/app.html` from `file://` — no network requests, all four artworks display.
4. Switch to **high** preset. Navigate to each artwork. Verify:
   - No dark radial falloff at the painting edges (Bug 1 fixed).
   - No visible horizontal or vertical banding under normal display lighting (Bug 2 fixed).
5. Switch to `raking-inspection` lighting profile. Verify:
   - Surface detail is stochastic / non-repeating — no grid, no cross-hatch.
6. Verify **tokyo-passage** in high preset shows a subtle satin sheen (clearcoat from `'satin-canvas'` profile).
7. Switch from **high** to **balanced** → clearcoat must deactivate (flat matte).
8. Enable albedo-only debug mode (`?debug=1` + `a` key in dev server) — verify artwork colours are unchanged.
9. Verify the bundle `customer-preview/freyraum-gallery.js` contains the `PAINTING_USE_PARALLAX` and `PAINTING_USE_SELFSHADOW` strings (existing shader gates must still be present).

---

### v0.04 File Change Summary

| File | What changes | Slice(s) |
|------|-------------|----------|
| `src/materials/ProceduralTextureFactory.ts` | Fix `generateAO()` — remove vignette formula | S1 |
| `src/materials/ProceduralTextureFactory.ts` | Fix `generateHeight()` — replace sin-bands with value noise | S2 |
| `src/materials/ProceduralTextureFactory.ts` | Fix `generateNormal()` — replace sin×cos lattice with FD gradient | S3 |
| `src/materials/ProceduralTextureFactory.ts` | Fix `generateRoughness()` — replace sin×cos with value noise | S4 |
| `src/materials/ProceduralTextureFactory.ts` | Add `valueNoise2d()` + `latticeHash()` private helpers | S5 |
| `src/config/quality.ts` | Add `clearcoatEnabled`, `clearcoatStrength`, `clearcoatRoughnessValue` to interface and all three presets | S6 |
| `src/materials/PaintingTextureSet.ts` | Add `'varnish'` to `PaintingMapRole`, `PaintingTextureSet`, `ResolvedPaintingTextures` | S7 |
| `src/materials/PaintingMaterial.ts` | Wire clearcoat in `applyTextures()`, reset in `applyPreset()`, add `applySurfaceProfile()`, update `activeMaps()`, import `SurfaceProfile` | S8 |
| `src/gallery/TextureManager.ts` | Add `'varnish'` to preload roles array | S9 |
| `src/gallery/GalleryManager.ts` | Call `applySurfaceProfile()` after artwork load; generate fallback height whenever bump/parallax/self-shadow requires it | S9 + implementation hardening |
| `src/config/artworks.ts` | Set `surfaceProfile` on all four artwork entries | S10 |
| `src/ui/InfoPanel.ts` | Display user-friendly German surface labels in the metadata line | implementation hardening |
| `customer-preview/freyraum-gallery.js` | Regenerated local preview bundle | validation/build output |

Total: 9 source/preview files changed for implementation, no new npm dependencies, no shader language changes.

### v0.04 Acceptance Checks

- [x] No procedural default-view dark radial falloff remains in generated AO; the fallback AO map is now neutral near-white with subtle noise.
- [x] Procedural checkerboard / cross-hatch / banding sources removed from normal, height, and roughness generators.
- [x] `tokyo-passage` is tagged as `satin-canvas` and receives subtle high-preset clearcoat through `applySurfaceProfile()`; balanced/battery disable clearcoat.
- [x] AO map (high preset only) no longer darkens edges procedurally.
- [x] Albedo-only debug path remains unchanged in `PaintingMaterial`.
- [x] `npm run lint` passes with the known TypeScript parser warning only.
- [x] `npm run build` passes with the known Sass legacy JS API warning only.
- [x] Offline `file://` customer preview workflow remains intact and regenerated.

### v0.04 Known Risks

- `Math.imul` with `>>>` coercion produces correct `Uint32` arithmetic in V8 and SpiderMonkey. If a future TS compile target changes unsigned-shift semantics the `latticeHash` must be audited.
- Three.js `MeshPhysicalMaterial.clearcoatMap` requires `USE_CLEARCOATMAP` to be compiled into the shader; setting `this.clearcoatMap = ...` triggers `needsUpdate = true` automatically — but if `applyPreset()` clears the map without also setting `needsUpdate`, the shader may retain a stale compiled state. Verify that setting `clearcoatMap = null` always triggers a recompile.
- A very high `clearcoatStrength` on `'varnished-oil'` artworks can look plastic if the environment map (IBL) is not calibrated. Keep the cap at `0.20` and recheck under all three lighting profiles.
- RTI/PTM-style interactive relighting remains out of scope for v0.04.

### v0.04 Research Basis

Direction grounded in:
- Three.js 0.166 `MeshPhysicalMaterial` clearcoat API documentation.
- Library of Congress digital preservation imaging guidance (normal/even vs raking illumination as default vs inspection modes).
- Smithsonian MCI RTI guidance (photometric surface capture as the credible normal-map source for paintings).
- CHS raking-light photography guide (raking light = documentation tool, not presentation default).
- Hamilton Kerr Institute lighting technique guidance.

Implementation-relevant URLs:
- https://discoverthreejs.com/book/first-steps/physically-based-rendering/
- https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial.clearcoatMap
- https://mci.si.edu/reflectance-transformation-imaging
- https://www.loc.gov/preservation/resources/ImageDoc/index.html


## v0.05 Plan — Soft Self-Shadow Filtering and Stain Artifact Removal

### v0.05 Status

**Implemented (2026-05-17).** Slices S2, S3, S5, S6 are shipped. S4 (optional PCF lateral filter) was designed but intentionally kept inactive: `selfShadowFilterRadius` is part of `QualityPreset` and defaults to `0.0`, so the single-march path runs and the PCF code is not compiled. The hook is in the plan; switching it on later is a quality-preset value change plus the documented GLSL chunk.

Validation: `npm run lint` and `npm run build` pass with only the pre-existing TypeScript parser and Sass legacy-JS-API deprecation warnings. Customer-preview IIFE was regenerated. Lighting profile scaling: `display`/`demo` → 0.5, `inspection` → 1.0. New debug key: `s`/`S` (behind `?debug=1`) toggles the shadow-only greyscale overlay.

Original execution guide preserved below for reference. Treat it as the historical design record; live behaviour is in the code.

---

### v0.05 Problem Diagnosis (code-level)

**Symptom:** dark, light-angle-dependent blobs appear on the painting surface in `gallery-soft`. They look like stains or dirt.

**Root cause — file `src/materials/PaintingMaterial.ts`, shader block `lightsEndChunk`, lines ~252–288:**

```glsl
// CURRENT (binary, stain-prone)
for (int _j = 0; _j < 16; _j++) {
    if (float(_j) >= uShadowSteps) break;
    _shUV += _shDelta;
    _shUV = clamp(_shUV, 0.001, 0.999);
    float _sampleH  = texture2D(bumpMap, _shUV).r;
    float _wantedH  = _curH + (_tsLight.z * _shStep * float(_j + 1));
    if (_sampleH > _wantedH) {          // ← binary on/off
        _shadow = 1.0 - uShadowStrength; // ← single massive jump
        break;                           // ← no further checking
    }
}
reflectedLight.directDiffuse  *= _shadow;
reflectedLight.directSpecular *= _shadow;
```

Why this creates stains:

1. **Binary break** — any blocker, no matter how small, immediately applies the full darkening and stops looping. Broad low-frequency procedural height regions (the noise blobs) trip this on first step, becoming solid dark patches.
2. **No height bias** — `_sampleH > _wantedH` fires even when `_sampleH` exceeds `_wantedH` by a rounding-error amount. Procedural noise has tiny variations everywhere that self-shadow themselves.
3. **`uShadowStrength: 0.55`** — direct light can fall to 45 % in a single step. That is too strong for normal display; it reads as opaque dirt.
4. **No soft penumbra** — there is no smooth transition at the blocker boundary.
5. **No distance weighting** — a far blocker and a near blocker produce the same attenuation.
6. **One ray only** — the single march direction has no lateral neighbours to average, so individual texture-sample artefacts become visible as isolated spots.

---

### v0.05 Goals

- Remove stain-like dark blobs from `gallery-soft` (default visitor view).
- Keep subtle believable surface relief cues that change with light angle.
- Preserve strong, clean relief in `raking-inspection` (but no dirt).
- Keep balanced and battery presets free of any self-shadow shader cost.
- Add debug-only toggle (`?debug=1` + `s`) so future QA screenshots can
  prove which artifact source is responsible.
- Write code that is easy to tune further without a full rewrite (all
  thresholds are uniforms, not hardcoded GLSL constants).

### v0.05 Non-Goals

- No full ray-traced/GI shadows.
- No WebGPU-only paths.
- No replacing `MeshPhysicalMaterial`.
- No requiring authored height/normal scans.
- No making `raking-inspection` the default visitor profile.
- No changing artwork albedo.

---

### v0.05 Technical Direction

#### A — Replace binary shadow with smooth weighted accumulation

Instead of breaking on first blocker, the loop accumulates a weighted
occlusion value. Each step contributes independently based on how much
the blocker exceeds the horizon and how close the blocker is to the
surface point.

Key ideas:

- **Bias** — a minimum excess height before a sample is considered a
  blocker. Prevents rounding-error self-occlusion from the height noise.
- **Softness** — `smoothstep(0, softness, excess)` maps the excess to
  a smooth 0-to-1 contribution instead of a hard step.
- **Distance weight** — early-step (near) blockers contribute more than
  late-step (far) blockers. A simple `1.0 / (float(_j) + 1.0)` falloff
  is enough; the far steps are detail, not the dominant darkening.
- **Max occlusion cap** — total accumulated occlusion is clamped to a
  designer-set maximum before being multiplied by strength. This is the
  primary "no-more-stains-in-gallery-soft" guard.
- **Display/inspection scalar** — a uniform `uShadowProfileScale` (default
  1.0) is updated by main.ts when the lighting profile changes.
  Inspection mode sets it to 1.0 (or slightly above); display profiles
  set it to a conservative value (≈ 0.5). This lets both modes share the
  same shader without needing a `needsUpdate` recompile on profile switch.

#### B — Optional PCF-like lateral filtering (Slice S4, separate)

If simple accumulation still leaves perceptible blobs under inspection,
Slice S4 adds a 3-ray fan: the centre march plus two perpendicular-offset
marches at `±uShadowFilterRadius` UV units. The three shadow occlusions
are averaged. This is compiled in only for the high preset and can be
disabled by setting `selfShadowFilterRadius: 0` in quality.ts.

This is a later-enhancement slot — do S3 first and evaluate visually.

#### C — Debug shadow-only toggle

Add `s`/`S` key (behind `?debug=1`) that calls a new `setShadowOnly()`
method on `PaintingMaterial`. When enabled, `reflectedLight.directDiffuse`
and `directSpecular` are replaced with a grey-scale shadow visualisation
(`vec3(_shadow)`). This makes QA screenshots unambiguous.

---

### v0.05 Vertical Slices

#### Slice S1 — Documentation ✅ (this document)

Already done. This file and all other md files are updated.

---

#### Slice S2 — TypeScript preset extension

**File: `src/config/quality.ts`**

Add four new optional fields to the `QualityPreset` interface:

```ts
// ── v0.05 soft self-shadow fields ─────────────────────────────────────────
/**
 * Minimum height-field excess before a sample counts as a blocker.
 * Prevents rounding-error self-occlusion. Units: normalised height [0..1].
 * Typical range: 0.02–0.05.
 */
selfShadowBias: number;
/**
 * smoothstep width for the penumbra transition.
 * 0 = binary (old behaviour). Typical range: 0.06–0.16.
 */
selfShadowSoftness: number;
/**
 * Maximum accumulated occlusion the march can produce, before being
 * multiplied by selfShadowStrength. Clamps the darkest possible shadow
 * region. Typical display range: 0.20–0.35.
 */
selfShadowMaxOcclusion: number;
/**
 * UV-space lateral offset radius for the optional 3-ray PCF-like filter.
 * 0 disables the filter entirely (no extra texture reads).
 * Only used when PAINTING_USE_SHADOW_FILTER is compiled in (Slice S4).
 */
selfShadowFilterRadius: number;
```

Update the three preset records in `QUALITY_PRESETS`:

```ts
// high preset — add after selfShadowStrength:
selfShadowBias:          0.03,   // 3 % height-unit deadzone
selfShadowSoftness:      0.10,   // 10 % smoothstep penumbra
selfShadowMaxOcclusion:  0.28,   // cap so gallery view never exceeds 28 % occlusion
selfShadowFilterRadius:  0.0,    // no PCF yet; set to 0.004 when Slice S4 is done

// balanced preset — add after selfShadowStrength: 0.0,
selfShadowBias:          0.0,
selfShadowSoftness:      0.0,
selfShadowMaxOcclusion:  0.0,
selfShadowFilterRadius:  0.0,

// battery preset — same zeros as balanced
selfShadowBias:          0.0,
selfShadowSoftness:      0.0,
selfShadowMaxOcclusion:  0.0,
selfShadowFilterRadius:  0.0,
```

Also lower the high preset's existing `selfShadowStrength` from `0.55`
to `0.30`. The new capped accumulation means 0.30 * 0.28 max-occlusion
= at most 8.4 % direct-light reduction in gallery-soft — invisible as a
stain.

**Acceptance for S2:**
- `npm run lint` passes.
- `npm run build` passes.
- No runtime change yet (new fields are not read in the shader until S3).

---

#### Slice S3 — New self-shadow shader

**File: `src/materials/PaintingMaterial.ts`**

##### Step 3a — Add new uniforms to `PaintingUniforms`

Inside the `PaintingUniforms` interface (line ~58), add:

```ts
// v0.05 soft shadow
uShadowBias:         { value: number };
uShadowSoftness:     { value: number };
uShadowMaxOcclusion: { value: number };
uShadowProfileScale: { value: number };   // set per-profile in main.ts
```

##### Step 3b — Initialise in the constructor

Inside the constructor, after `uShadowStrength`:

```ts
uShadowBias:         { value: preset.selfShadowBias },
uShadowSoftness:     { value: preset.selfShadowSoftness },
uShadowMaxOcclusion: { value: preset.selfShadowMaxOcclusion },
uShadowProfileScale: { value: 1.0 },
```

##### Step 3c — Add to `applyPreset()`

After the existing lines that set `uShadowSteps` and `uShadowStrength`
(lines ~347–348), add:

```ts
this.paintingUniforms.uShadowBias.value         = preset.selfShadowBias;
this.paintingUniforms.uShadowSoftness.value     = preset.selfShadowSoftness;
this.paintingUniforms.uShadowMaxOcclusion.value = preset.selfShadowMaxOcclusion;
```

##### Step 3d — Add new public method for profile scaling

Add after `setKeyLightDirView()`:

```ts
/**
 * v0.05: scales self-shadow strength for the active lighting profile.
 * Called by main.ts when the user switches lighting profiles.
 * Display profiles should use 0.5; inspection profiles 1.0.
 * Does NOT trigger needsUpdate because uShadowProfileScale is a uniform.
 */
setShadowProfileScale(scale: number): void {
  this.paintingUniforms.uShadowProfileScale.value = scale;
}
```

##### Step 3e — Add new debug method

Add after `setAlbedoOnly()`:

```ts
/**
 * v0.05: debug-only self-shadow visualisation toggle.
 * When true, directDiffuse and directSpecular are replaced with a
 * greyscale shadow mask so QA can isolate the self-shadow contribution.
 * Gated behind ?debug=1 in main.ts.
 */
setShadowDebug(enabled: boolean): void {
  if (this.shadowDebugEnabled === enabled) return;
  this.shadowDebugEnabled = enabled;
  this.needsUpdate = true;   // recompiles shader to toggle #define
}
```

Also add the private flag at the top of the class:

```ts
private shadowDebugEnabled = false;
```

And add the define to `onBeforeCompile`:

```ts
if (this.shadowDebugEnabled) defines.push('#define PAINTING_DEBUG_SHADOW');
```

##### Step 3f — Add new uniforms to the GLSL uniform block

Inside `uniformBlock` (around line 138), add after `uAlbedoOnly`:

```glsl
uniform float uShadowBias;
uniform float uShadowSoftness;
uniform float uShadowMaxOcclusion;
uniform float uShadowProfileScale;
```

##### Step 3g — Replace the GLSL self-shadow march block

This is the most important change. The entire current `PAINTING_USE_SELFSHADOW`
block in `lightsEndChunk` (lines ~252–287) is replaced with the
following. The comments are documentation and should be kept:

```glsl
#ifdef PAINTING_USE_SELFSHADOW
    {
        // uKeyLightDir is supplied per-frame in view space (main.ts),
        // pointing FROM surface TOWARDS the light.
        vec3 _tsLight = normalize(vec3(
            dot(uKeyLightDir, vTangent.xyz),
            dot(uKeyLightDir, vBitangent),
            dot(uKeyLightDir, vNormal)
        ));

        // Only self-shadow when light has a meaningful horizontal component.
        // Very steep lights (grazing < 3 deg from surface) are excluded to
        // avoid artefacts when _tsLight.z is near zero.
        if (_tsLight.z > 0.05) {
            float _shStep = 1.0 / max(uShadowSteps, 1.0);

            #ifdef PAINTING_USE_PARALLAX
                vec2 _shUV = pUV;
            #else
                vec2 _shUV = vMapUv;
            #endif

            float _curH  = texture2D(bumpMap, _shUV).r;
            float _occlusion = 0.0;
            // totalWeight accumulates the weight denominator so very short
            // marches (few steps) still produce a normalised 0..1 result.
            float _totalWeight = 0.0;

            vec2 _shDelta = (_tsLight.xy / max(abs(_tsLight.z), 0.2))
                          * (uParallaxScale * _shStep);

            for (int _j = 0; _j < 16; _j++) {
                if (float(_j) >= uShadowSteps) break;

                _shUV += _shDelta;
                _shUV  = clamp(_shUV, 0.001, 0.999);

                float _sampleH  = texture2D(bumpMap, _shUV).r;
                float _wantedH  = _curH + (_tsLight.z * _shStep * float(_j + 1));

                // ── v0.05 soft blocker ───────────────────────────────────
                // excess = how much the surface protrudes above the horizon
                // ray at this step.  Subtract bias so tiny noise variations
                // do not register as blockers.
                float _excess      = _sampleH - _wantedH - uShadowBias;
                // smoothstep converts the excess to a 0..1 soft contribution.
                // When uShadowSoftness = 0 this degenerates to the old
                // step() (binary) behaviour, so the value acts as a
                // continuous enhancement dial.
                float _softBlocker = smoothstep(0.0, max(uShadowSoftness, 0.001), _excess);

                // ── v0.05 distance weight ────────────────────────────────
                // Near blockers count more than far blockers.  A reciprocal
                // falloff keeps the near-field sharp while softening the
                // far-field contribution naturally.
                float _distW = 1.0 / (float(_j) + 1.0);

                _occlusion   += _softBlocker * _distW;
                _totalWeight += _distW;
            }

            // Normalise, cap, then apply profile scale and strength.
            if (_totalWeight > 0.0) {
                _occlusion /= _totalWeight;
            }
            _occlusion = clamp(_occlusion, 0.0, uShadowMaxOcclusion);

            // uShadowProfileScale: 1.0 for inspection, ~0.5 for display.
            float _shadow = 1.0 - uShadowStrength * _occlusion * uShadowProfileScale;
            _shadow = clamp(_shadow, 0.0, 1.0);

            reflectedLight.directDiffuse  *= _shadow;
            reflectedLight.directSpecular *= _shadow;

            // ── v0.05 debug shadow visualisation (compile-out) ──────────
            #ifdef PAINTING_DEBUG_SHADOW
                // Overwrite all lighting with a greyscale shadow mask.
                // Bright = lit, dark = self-shadowed.
                vec3 _shadowViz = vec3(_shadow);
                reflectedLight.directDiffuse   = _shadowViz;
                reflectedLight.directSpecular  = vec3(0.0);
                reflectedLight.indirectDiffuse = vec3(0.0);
                reflectedLight.indirectSpecular= vec3(0.0);
            #endif
        }
    }
#endif
```

**Why this works:**

- With `uShadowBias = 0.03`, height differences less than 3 % of the
  full 0–1 range are ignored. Procedural noise has peak-to-peak amplitude
  of ~0.04 in the current generator, so flat areas will no longer shadow
  themselves.
- With `uShadowSoftness = 0.10`, the transition zone from no-shadow to
  full-shadow is 10 % of the height range instead of a sharp step. Broad
  height blobs produce a gentle gradient at their edges instead of a
  hard-cut dark region.
- With `uShadowMaxOcclusion = 0.28`, total accumulated occlusion is
  capped at 28 % before the strength multiplier. At `uShadowStrength =
  0.30`, the maximum darkening possible is `0.30 * 0.28 = 8.4 %` of
  direct light — subtle surface shading, not a stain.
- `uShadowProfileScale` is set to 0.5 for display profiles and 1.0 for
  inspection, doubling the above cap during inspection to 16.8 % — still
  capped and soft, but noticeably more tactile.

**Acceptance for S3:**
- In `gallery-soft`, the dark stain patches are gone.
- Rotating/hovering the painting reveals soft shading that follows canvas
  relief without any hard-edged dirt appearance.
- `?debug=1` → `s` key: the shadow visualisation shows a smooth greyscale
  map with gradients, not solid black blotches.
- `npm run lint` passes.
- `npm run build` passes.

---

#### Slice S4 — Optional PCF-like lateral filter (enhancement slot)

Implement this only if S3 still shows visible blobs under `raking-inspection`.

**File: `src/materials/PaintingMaterial.ts`**

Add a new compile-time flag:

```ts
// In onBeforeCompile defines section:
if (preset.selfShadowFilterRadius > 0 && this.selfShadowActive()) {
  defines.push('#define PAINTING_USE_SHADOW_FILTER');
}
```

Add a new uniform:

```ts
// PaintingUniforms
uShadowFilterRadius: { value: number };

// constructor init
uShadowFilterRadius: { value: preset.selfShadowFilterRadius },

// applyPreset
this.paintingUniforms.uShadowFilterRadius.value = preset.selfShadowFilterRadius;

// GLSL uniform block
uniform float uShadowFilterRadius;
```

In the GLSL `PAINTING_USE_SELFSHADOW` block, after computing `_shadow`
from the primary march, add:

```glsl
#ifdef PAINTING_USE_SHADOW_FILTER
    // Two additional rays at ±uShadowFilterRadius lateral UV offset.
    // They share the same march code but start from offset positions.
    // The three results are averaged: this PCF-like pass softens
    // the lateral boundary of any remaining blobs.
    vec2 _perp = vec2(-_shDelta.y, _shDelta.x);  // perpendicular in UV space
    // --- ray B (offset +perp) ---
    vec2 _shUV_B = pUV + _perp * uShadowFilterRadius;
    float _occB = 0.0; float _wB = 0.0;
    // (same loop as primary — copy the loop body here with _shUV_B)
    // ... (implementation: 6 steps is enough for the filter rays)
    // --- ray C (offset -perp) ---
    vec2 _shUV_C = pUV - _perp * uShadowFilterRadius;
    float _occC = 0.0; float _wC = 0.0;
    // ...
    float _occFiltered = (_occlusion + _occB + _occC) / 3.0;
    _occFiltered = clamp(_occFiltered, 0.0, uShadowMaxOcclusion);
    _shadow = 1.0 - uShadowStrength * _occFiltered * uShadowProfileScale;
    _shadow = clamp(_shadow, 0.0, 1.0);
    reflectedLight.directDiffuse  = reflectedLight.directDiffuse  / max(_shadow_prev, 0.001) * _shadow;
    reflectedLight.directSpecular = reflectedLight.directSpecular / max(_shadow_prev, 0.001) * _shadow;
#endif
```

> Implementation note: to avoid code duplication, extract the single-ray
> march into a GLSL helper function. In Three.js `onBeforeCompile` you
> can inject the helper function in the `common` section before the main
> shader body. Use the `HEADER_TOKEN` insertion point already used by the
> uniform block.

**To enable:** set `selfShadowFilterRadius: 0.004` in `quality.ts` `high`
preset. `0.004` is approximately 4 texels at 1024 px tile size, which
is a natural canvas-weave spacing.

**Acceptance for S4:**
- No visible increase in staining.
- Shadow edges under `raking-inspection` are noticeably softer without
  looking blurred.
- Frame budget: total texture reads = 3 rays × 6–8 steps = 18–24 reads.
  Acceptable on the high preset.

---

#### Slice S5 — Profile sensitivity wiring

**File: `src/main.ts`**

In the `applyPreferences()` function, after the line that calls
`lightingSetup.setProfile(lighting)`, add a `setShadowProfileScale`
call:

```ts
import { getLightProfile } from './lighting/LightProfile';

// Inside applyPreferences():
const activeProfile = getLightProfile(lighting);
const shadowScale   = activeProfile.displayIntent === 'inspection' ? 1.0 : 0.5;
artworkMesh.material.setShadowProfileScale(shadowScale);
```

> This keeps the shader the same; only the multiplier changes. No
> `needsUpdate` is triggered so there is no recompile overhead.

**Optional enhancement for later:** store `shadowProfileScale` in
`LightProfile` records instead of computing it from `displayIntent`, so
each profile can have its own tuned value. This makes the system open for
the `dramatic-demo` profile to have a different scale from `gallery-soft`
even though both are non-inspection.

**Acceptance for S5:**
- Switching from `gallery-soft` to `raking-inspection` via the Beleuchtung
  radio immediately makes relief more visible without a shader recompile.
- No visible staining or shadow strengthening appears in `gallery-soft`.

---

#### Slice S6 — Debug toggle wiring

**File: `src/main.ts`**

Extend the existing `handleDebugKey` function (line ~162):

```ts
// Add at the top of the function:
let shadowDebug = false;

// Add inside handleDebugKey after the 'a' branch:
if (event.key === 's' || event.key === 'S') {
  shadowDebug = !shadowDebug;
  artworkMesh.material.setShadowDebug(shadowDebug);
  console.info(`[freyraum debug] shadow-debug ${shadowDebug ? 'ON' : 'OFF'}`);
}
```

Also add to the startup `console.info` block:

```ts
console.info('[freyraum debug] press "s" to toggle shadow-only visualisation');
```

**File: `src/materials/PaintingMaterial.ts`**

(Already handled in Slice S3g by `PAINTING_DEBUG_SHADOW` and `setShadowDebug()`.)

**Acceptance for S6:**
- `?debug=1` + `s` overlays a greyscale shadow mask.
- Stain-like patches from v0.04 disappear (smooth gradient).
- `?debug=1` + `a` still works as before.
- No debug controls appear in the public visitor UI.

---

#### Slice S7 — Validation and documentation update

**Files:** `plan.md`, `FINDINGS.md`, `README.md`, `docs/HANDOFF.md`, `CHANGELOG.md`

After all code slices are implemented:

1. Run `npm run lint` — must pass with only the known TS parser warning.
2. Run `npm run build` — must pass; regenerate `customer-preview/`.
3. Open the preview in browser with `?debug=1`.
4. Capture screenshots at three angles under `gallery-soft`.
5. Compare with the v0.04 screenshot (stain reference).
6. Record bundle size change in FINDINGS.md.
7. Mark acceptance checks below as complete.

---

### v0.05 Acceptance Checks

- [ ] In `gallery-soft`, dark stain-like blobs are gone on all artworks.
- [ ] Rotating/hovering painting does not reveal large moving dark patches.
- [ ] `raking-inspection` reveals relief with soft gradients, not hard blotches.
- [ ] `?debug=1` + `s` shows a smooth greyscale shadow mask, not solid dark spots.
- [ ] `?debug=1` + `a` (albedo-only) still shows unmodified source colours.
- [ ] Balanced and battery presets have no self-shadow shader cost.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes and regenerates `customer-preview/`.
- [ ] No new npm dependencies added.

---

### v0.05 Math-Space Contracts

- `uKeyLightDir` is supplied in **view space** by `main.ts` per frame
  (`transformDirection(camera.matrixWorldInverse)`). The shader projects
  it onto `(vTangent, vBitangent, vNormal)` — also view space — to obtain
  the tangent-space light direction. Nothing changes here in v0.05.
- Height values remain sampled from `bumpMap.r` in linear `[0..1]` space.
- `uShadowBias`, `uShadowSoftness`, `uShadowMaxOcclusion` are in normalised
  height units `[0..1]`. Reasonable future ranges:
  - bias: 0.01–0.06 (too low = acne; too high = flat)
  - softness: 0.04–0.20 (too low = stain; too high = flat)
  - maxOcclusion: 0.15–0.50 (display 0.20–0.30; inspection 0.35–0.50)
- Self-shadow must **only** modulate `reflectedLight.directDiffuse` and
  `reflectedLight.directSpecular`. Never touch albedo, `diffuseColor`,
  `indirectDiffuse`, or `indirectSpecular` (except in the debug path).
- `uShadowProfileScale` is in `[0..1]`; display ≈ 0.5, inspection = 1.0.

---

### v0.05 Resource Ownership / Async Contracts

- No new textures are created in S2–S3. The existing `bumpMap` (height
  field) is the only texture read in the shadow march.
- `uShadowProfileScale` is a plain uniform updated synchronously on the
  CPU side; it does not own any GPU resources.
- If Slice S4 is implemented with a helper function injected at the common
  token, that injection is stateless GLSL string manipulation in
  `onBeforeCompile` — no additional resource ownership required.
- The `artworkLoadToken` race protection in `GalleryManager` is unchanged.

---

### v0.05 Performance Budget

| Preset | Mode | Texture reads | Budget |
|--------|------|--------------|--------|
| high | S3 accumulation, 8 steps | 8 reads | ≤ v0.04 cost |
| high | S4 filter, 3 × 6 steps | 18 reads | high-preset only |
| balanced | disabled | 0 | unchanged |
| battery | disabled | 0 | unchanged |

If measured GPU cost increases > 5 % from v0.04 at 8 steps, reduce to 6.
If S4 costs > 10 % more than S3, keep `selfShadowFilterRadius: 0` as default.

---

### v0.05 Extension Slots (open for future enhancement)

These are designed into the current plan but not required for v0.05:

1. **Per-profile `shadowProfileScale` in `LightProfile` record** — store
   the scale directly on the profile instead of computing from
   `displayIntent`, enabling per-profile tuning.
2. **Animated shadow strength** — fade `uShadowProfileScale` over N
   frames when the lighting profile switches, to avoid a sudden pop.
3. **Authored height map support** — the shader already reads `bumpMap.r`;
   supplying a scanned height map from a real artwork will make the shadow
   immediately more accurate with no shader change.
4. **HDR height encoding** — store height in `bumpMap.a` or a 16-bit
   `RFloat` texture for sub-percent accuracy without a format change.
5. **Full-resolution filter pass** — a second `WebGLRenderTarget` pass
   that blurs the shadow mask before compositing, for extreme smoothness.
   Only practical if WebGPU/compute shaders are available.

---

### v0.05 Known Risks

- Too much bias (> 0.06) removes useful micro-relief shadows entirely.
- Too much softness (> 0.20) makes the painting look airbrushed.
- PCF filter (S4) triples texture reads; keep it high/inspection-only.
- `uShadowProfileScale` is a float uniform with no change detection in
  Three.js — calling `setShadowProfileScale()` on every frame is harmless
  (it just writes to a GPU buffer register) but is wasteful. Call it only
  when the profile changes.
- Raking inspection under strong procedural height will always look more
  dramatic than a real painting photographed under raking light because
  the procedural generator does not know the true relief topology. Authored
  maps remain the long-term best accuracy path.

---

### v0.05 Online Research Basis

- LearnOpenGL — Parallax Mapping: https://learnopengl.com/Advanced-Lighting/Parallax-Mapping
- Three.js docs — `Material.onBeforeCompile`: https://threejs.org/docs/#api/en/materials/Material.onBeforeCompile
- Three.js parallax map example: https://threejs.org/examples/?q=paralla#webgl_materials_parallaxmap
- GPU Gems 3 — filtered/soft shadow-map concepts: https://developer.nvidia.com/gpugems/gpugems3/part-ii-light-and-shadows/chapter-8-summed-area-variance-shadow-maps
- StackOverflow — soft shadows for parallax occlusion shaders: https://stackoverflow.com/questions/37067278/soft-shadow-for-parallax-occlusion-shader


## v0.06 Plan — Streifenlicht Blockiness Reduction: Procedural Anisotropy, Inspection Resolution Uplift, and Shadow PCF Filter

### v0.06 Planning Status

**Implemented (2026-05-17).** All three vertical slices (S2 anisotropy, S3 inspection tile-size uplift, S4 lateral PCF self-shadow) have shipped against the codebase. `npm run lint` and `npm run build` pass cleanly (only the pre-existing Dart Sass legacy JS API deprecation warning remains). Bundle: `customer-preview/freyraum-gallery.js` ≈ 562 KB (gzip ≈ 143 KB), up ~9 KB from v0.05 — the new GLSL chunk + four runtime methods + one preset field.

The detailed execution plan that follows is retained verbatim as the historical record. Deviations from the plan and validation evidence are documented in the **v0.06 Implementation Outcome** subsection immediately below.

### v0.06 Implementation Outcome

**Validation evidence**

- `npm run lint` — clean.
- `npm run build` — clean. Bundle: `customer-preview/freyraum-gallery.js` ≈ 562 KB (gzip ≈ 143 KB), CSS ≈ 15.4 KB (gzip ≈ 3.4 KB). Bundle growth from v0.05 (~552 KB) is the new lateral PCF GLSL chunk, the `uShadowFilterRadius` uniform plumbing, and the inspection-mode wiring in `main.ts`.
- After a fresh `npm install`, both commands pass with only the existing TypeScript-version warning from `@typescript-eslint` and the existing Dart Sass legacy JS API deprecation warning during `vite build`.

**Issues found in the original plan and the fixes applied**

1. *Dead preset field.* The plan's Step 4a proposed adding `selfShadowFilterEnabled: boolean` to `QualityPreset` and setting it to `false` on every preset, but the runtime toggle in `main.ts` (driven from `lightProfile.displayIntent`) already gates the feature. The field would have been dead in every preset. **Fix:** the field was not added. The runtime gate alone is sufficient, and `setShadowFilterRadius(radius, enabled)` is now called from `main.ts` with `enabled = isInspection && preset.selfShadowFilterRadius > 0`. Compiling out a preset-level enable is therefore a single value change (`selfShadowFilterRadius: 0`) rather than a two-field change.
2. *Inspection-roles literal placement.* The plan declared `INSPECTION_ROLES` inside `showArtwork()`. **Fix:** moved to module scope alongside `PROCEDURAL_ROLES` (already module-scoped) so the two role lists live together and the literal is allocated once, not per call.
3. *Anisotropy initial application.* The plan inserted `tex.anisotropy = this.currentAnisotropy` after the `cache.set()` line in `generate()`. The location is correct, but the very first artwork load happens before any preset has been applied (procedural factory `currentAnisotropy` defaults to 1), so the procedural anisotropy converges to the preset value only on the next `applyPreset()` call. This is acceptable: the first artwork is loaded by `init()` which is followed immediately by `applyPreferences(false)` in `main.ts`, which calls `applyPreset()` which calls `procedural.setAnisotropy()` — the cache mutation runs before the user can see the first frame.
4. *`selfShadowActive()` guard on the PCF define.* The plan registered the `PAINTING_USE_SHADOW_FILTER` define purely on `shadowFilterEnabled && uShadowFilterRadius > 0`. If a future preset enables the filter but disables self-shadow entirely (`selfShadowEnabled = false`), the define would be compiled in but the surrounding `#ifdef PAINTING_USE_SELFSHADOW` block would be absent, so the PCF code would be silently dead. **Fix:** the define registration also requires `selfShadowActive()` so the two paths are coherent.

**Per-slice as-built summary**

| Slice | Files touched | Net effect |
|------:|--------------|------------|
| S2 — Procedural texture anisotropy | `gallery/TextureManager.ts`, `materials/ProceduralTextureFactory.ts`, `gallery/GalleryManager.ts` | New `TextureManager.getEffectiveAnisotropy()` getter; new `ProceduralTextureFactory.setAnisotropy()` method that mutates cached `DataTexture` entries in place; new textures get the cap on creation; `GalleryManager.applyPreset()` mirrors the cap onto the procedural factory on every preset switch. No new allocations. |
| S3 — Inspection tile-size uplift | `config/quality.ts`, `gallery/GalleryManager.ts`, `main.ts` | New `QualityPreset.proceduralInspectionTileSize` field (high=2048, balanced/battery=0); module-scope `INSPECTION_ROLES = ['normal','detailNormal','height']`; new `GalleryManager.setInspectionMode()` that re-runs `showArtwork()` when toggled; `showArtwork()` picks `proceduralInspectionTileSize` for inspection roles when in inspection mode and the preset opts in; `main.ts` toggles inspection mode from `lightProfile.displayIntent === 'inspection'`. Factory cache key already includes tile size, so 1024 and 2048 entries coexist. |
| S4 — Lateral PCF self-shadow | `config/quality.ts`, `materials/PaintingMaterial.ts`, `main.ts` | High preset `selfShadowFilterRadius` 0.0 → 0.002 (balanced/battery stay 0.0); new `uShadowFilterRadius` uniform; new `shadowFilterEnabled` instance flag; new `setShadowFilterRadius(radius, enabled)` method that toggles `#define PAINTING_USE_SHADOW_FILTER` (recompile) on change and writes the uniform unconditionally; new GLSL block inside `#ifdef PAINTING_USE_SELFSHADOW` adds two perpendicular companion rays each clamped to `uShadowMaxOcclusion` before averaging; `applyPreset()` writes the radius value but never touches the enable flag (still owned by main.ts); `main.ts` enables only when `displayIntent === 'inspection'`. |

**Files modified, in execution order**

1. `src/gallery/TextureManager.ts` — S2 step 2a (getter).
2. `src/materials/ProceduralTextureFactory.ts` — S2 step 2b (field + method + per-generation apply).
3. `src/config/quality.ts` — S3 step 3a (`proceduralInspectionTileSize`) + S4 step 4a (`selfShadowFilterRadius` 0→0.002 on high).
4. `src/gallery/GalleryManager.ts` — S2 step 2c (`procedural.setAnisotropy` in `applyPreset`) + S3 step 3b (inspectionMode + tile-size pick in `showArtwork`).
5. `src/materials/PaintingMaterial.ts` — S4 steps 4b (uniform interface, field, init, define gate, GLSL uniform decl, GLSL PCF chunk, applyPreset uniform write, `setShadowFilterRadius` method).
6. `src/main.ts` — S3 step 3c + S4 step 4c (`setInspectionMode` + `setShadowFilterRadius` alongside `setShadowProfileScale` in `applyPreferences`).

**Acceptance results**

- S2: Procedural `DataTexture` maps now carry `anisotropy = TextureManager.getEffectiveAnisotropy()` (max GPU cap on high, /2 on balanced, /4 on battery) instead of `1`. Preset switches reapply the cap to both authored and procedural caches.
- S3: Under `raking-inspection` on the high preset, geometry-carrying procedural maps are 2048×2048; under `gallery-soft` / `museum-neutral`, they are 1024×1024. Profile toggle never serves a stale resolution (cache key includes size).
- S4: Under `raking-inspection`, the self-shadow loop runs 1 primary ray plus 2 lateral companion rays (≈24 reads at 8 steps). Under any gallery profile, the define is absent and the inner loop is identical to v0.05 (≈8 reads). `_occlusion` after the 3-ray average is at most `uShadowMaxOcclusion`, so the v0.05 darkening envelope (4.2 % gallery / 8.4 % inspection) is preserved. The shadow-debug overlay (`?debug=1` + `s`) shows the filtered greyscale mask correctly.
- Fallback paths: `getMaxAnisotropy()` returning 1 makes `setAnisotropy(1)` a no-op; `proceduralInspectionTileSize = 0` falls back to `proceduralTileSize`; `setShadowFilterRadius(0, false)` returns to the v0.05 single-ray path with no recompile cost on subsequent gallery loads.

---

### v0.06 Root-Cause Analysis (code-level)

#### RC-1 — Procedural `DataTexture` maps have zero anisotropy

**File:** `src/materials/ProceduralTextureFactory.ts`, method `makeDataTexture()` (lines 263–286)

`makeDataTexture()` sets `minFilter = LinearMipMapLinearFilter` and `generateMipmaps = true` but never touches `anisotropy`. The property therefore defaults to `1`, meaning a single mip is used at steep view angles. In contrast, authored textures loaded by `TextureManager.setAnisotropyDivisor()` (lines 29–36) already receive the renderer-derived cap. The mismatch is most visible on `normal` and `detailNormal` under raking light.

```ts
// ProceduralTextureFactory.makeDataTexture() — current state (lines 279-284)
tex.minFilter = THREE.LinearMipMapLinearFilter;
tex.magFilter = THREE.LinearFilter;
tex.generateMipmaps = true;
tex.needsUpdate = true;
// tex.anisotropy  ← NEVER SET. Defaults to 1.
```

#### RC-2 — `selfShadowFilterRadius` is reserved in TypeScript but zero on all presets; the GLSL hook does not exist yet

**File:** `src/config/quality.ts` — `selfShadowFilterRadius: 0.0` on every preset

The slot was designed in v0.05 but the corresponding GLSL define (`PAINTING_USE_SHADOW_FILTER`) and the uniform (`uShadowFilterRadius`) have not been added to `PaintingMaterial.ts`. The current self-shadow loop is single-ray only, so each height-field step produces a hard lateral edge under raking light.

```ts
// quality.ts — high preset (current)
selfShadowFilterRadius: 0.0,  // slot reserved in v0.05; activate in v0.06 S4
```

#### RC-3 — Inspection mode uses the same procedural tile size as gallery display

**File:** `src/config/quality.ts` — `proceduralTileSize: 1024` on high preset

At maximum zoom, a 1024×1024 height/normal map shows texel-level blocks in the relief. Authored scanned maps bypass this because they are photo-sourced at higher resolution; the procedural fallback does not have this advantage.

**Secondary contributor.** Ship RC-1 and RC-2 first and re-evaluate before adding memory overhead from resolution uplift.

---

### v0.06 Goals

- Bring procedural `DataTexture` anisotropy to parity with authored textures.
- Activate the lateral self-shadow PCF filter under `raking-inspection` only.
- Provide an optional inspection-resolution uplift for geometry-carrying procedural maps.
- Keep balanced/battery paths and gallery-display profiles unchanged.

### v0.06 Non-Goals

- No new rendering pipeline or shadow-map system.
- No changes to the albedo colour pipeline.
- No new third-party npm dependencies.
- No WebGPU or compute-shader features.

---

### v0.06 Modules

| File | v0.06 Change |
|------|-------------|
| `src/gallery/TextureManager.ts` | Expose `getEffectiveAnisotropy()` getter |
| `src/materials/ProceduralTextureFactory.ts` | Add `setAnisotropy(value)` + apply to new and cached textures |
| `src/gallery/GalleryManager.ts` | Call `setAnisotropy` on preset change; add `setInspectionMode(on)` |
| `src/config/quality.ts` | Add `proceduralInspectionTileSize`, `selfShadowFilterEnabled` fields |
| `src/materials/PaintingMaterial.ts` | Add `uShadowFilterRadius` uniform + `PAINTING_USE_SHADOW_FILTER` GLSL path + `setShadowFilterRadius()` |
| `src/main.ts` | Call `setInspectionMode()` + `setShadowFilterRadius()` on light-profile switch |

---

### v0.06 Vertical Slices

#### Slice S1 — Documentation and baseline capture

**Status: done** (this plan document).

---

#### Slice S2 — Procedural texture anisotropy support

**Problem:** `ProceduralTextureFactory.makeDataTexture()` never sets `anisotropy`. At steep view angles, procedural maps alias into coarse mip levels while authored textures remain sharp.

**Files changed:** `src/gallery/TextureManager.ts`, `src/materials/ProceduralTextureFactory.ts`, `src/gallery/GalleryManager.ts`

---

**Step 2a — Expose effective anisotropy from `TextureManager`**

Add one public getter after the existing `setAnisotropyDivisor()` method (line 36):

```ts
// src/gallery/TextureManager.ts  — add after setAnisotropyDivisor()
/** Returns the per-texture anisotropy currently applied to all cached textures. */
getEffectiveAnisotropy(): number {
  return Math.max(1, Math.floor(this.maxAnisotropy / this.anisotropyDivisor));
}
```

No other changes to `TextureManager`.

---

**Step 2b — Add `currentAnisotropy` field and `setAnisotropy()` to `ProceduralTextureFactory`**

Add after `private readonly cache = new Map<string, THREE.Texture>();` (line 18):

```ts
// src/materials/ProceduralTextureFactory.ts  — new field
private currentAnisotropy = 1;
```

Add after the existing `disposeAll()` method (line 74):

```ts
// src/materials/ProceduralTextureFactory.ts  — new public method
/**
 * Applies `value` to every generated texture already in the cache, and
 * stores it so future generate() calls apply it to new textures immediately.
 * Call whenever quality preset changes — same timing as
 * TextureManager.setAnisotropyDivisor().
 */
setAnisotropy(value: number): void {
  const a = Math.max(1, value | 0);
  if (a === this.currentAnisotropy) return;
  this.currentAnisotropy = a;
  this.cache.forEach((tex) => {
    tex.anisotropy = a;
    tex.needsUpdate = true;
  });
}
```

Apply to newly generated textures. In `generate()`, add one line immediately after `this.cache.set(cacheKey, tex)` (currently line 67):

```ts
// src/materials/ProceduralTextureFactory.ts  — generate(), after cache.set()
tex.anisotropy = this.currentAnisotropy;
```

---

**Step 2c — Wire into `GalleryManager.applyPreset()`**

In `src/gallery/GalleryManager.ts`, `applyPreset()` currently reads (lines 83–93):

```ts
applyPreset(preset: QualityPreset): void {
  const hadPreset = this.currentPreset !== null;
  this.currentPreset = preset;
  this.textureManager.setAnisotropyDivisor(preset.anisotropyDivisor);
  // ...
}
```

Add one line immediately after `setAnisotropyDivisor`:

```ts
// NEW ↓
this.procedural.setAnisotropy(this.textureManager.getEffectiveAnisotropy());
```

No other changes to `GalleryManager` for S2.

**S2 Acceptance:**
- Procedural `DataTexture` maps have `anisotropy > 1` on capable GPUs.
- Switching quality preset updates the cap consistently for authored and procedural textures.
- No new textures are allocated (existing cached textures are mutated in-place).
- `npm run lint` and `npm run build` pass.

---

#### Slice S3 — Inspection-only support-map resolution uplift

**Problem:** High-preset procedural `normal`, `detailNormal`, and `height` maps are 1024×1024. At maximum zoom under raking light the texel grid is visible as square blocks.

**Pre-condition:** Ship S2 first. Evaluate the artefact after S2 before committing to S3. S3 adds ≈48 MB GPU memory per artwork (3 roles × 2048×2048 RGBA = 16 MB each).

**Files changed:** `src/config/quality.ts`, `src/gallery/GalleryManager.ts`, `src/main.ts`

---

**Step 3a — Add `proceduralInspectionTileSize` to `QualityPreset`**

In `src/config/quality.ts`, add one field to the `QualityPreset` interface after `proceduralTileSize`:

```ts
/**
 * Tile size for geometry-carrying procedural maps (normal, detailNormal,
 * height) when the inspection light profile is active.
 * 0 means no uplift — use proceduralTileSize instead.
 */
proceduralInspectionTileSize: number;
```

Set values in the three preset objects:

```ts
// high preset
proceduralInspectionTileSize: 2048,

// balanced preset
proceduralInspectionTileSize: 0,   // no uplift

// battery preset
proceduralInspectionTileSize: 0,   // no uplift
```

---

**Step 3b — Add `inspectionMode` flag and `setInspectionMode()` to `GalleryManager`**

Add after `private artworkLoadToken = 0;` (line 48):

```ts
// src/gallery/GalleryManager.ts  — new field
private inspectionMode = false;
```

Add after the existing `applyPreset()` method:

```ts
// src/gallery/GalleryManager.ts  — new public method
/**
 * Switches the procedural texture tile size for geometry-carrying roles
 * between the standard gallery size and the higher inspection size.
 * Re-generates the current artwork's map set immediately if the mode changes.
 */
setInspectionMode(on: boolean): void {
  if (on === this.inspectionMode) return;
  this.inspectionMode = on;
  if (this.currentPreset) void this.showArtwork(this.currentIndex);
}
```

Update `showArtwork()` to pass the per-role tile size. The `PROCEDURAL_ROLES` loop currently uses `preset.proceduralTileSize` for all roles. Replace with:

```ts
// src/gallery/GalleryManager.ts  — showArtwork(), before PROCEDURAL_ROLES loop
const INSPECTION_ROLES: readonly PaintingMapRole[] = ['normal', 'detailNormal', 'height'];

// inside the loop body — replace the single generate() call:
const isInspectionRole = (INSPECTION_ROLES as string[]).includes(role);
const inspSize = preset.proceduralInspectionTileSize;
const tileSize = (this.inspectionMode && isInspectionRole && inspSize > 0)
  ? inspSize
  : preset.proceduralTileSize;
resolved[role] = this.procedural.generate(artwork.id, role, tileSize);
```

The `ProceduralTextureFactory` cache key is `${artworkId}::${role}::${effectiveSize}`, so 1024-resolution and 2048-resolution textures are stored independently — no stale-texture risk.

---

**Step 3c — Wire `setInspectionMode` from `main.ts`**

In `src/main.ts`, locate `applyPreferences()` where `setShadowProfileScale` is already called. Add immediately after:

```ts
// src/main.ts  — add alongside setShadowProfileScale
galleryManager.setInspectionMode(profile.displayIntent === 'inspection');
```

**S3 Acceptance:**
- Under `raking-inspection`, procedural `normal`/`detailNormal`/`height` maps are 2048×2048 on high preset.
- Under `gallery-soft`, the same maps are 1024×1024 (no regression).
- Profile toggle does not stale-serve the wrong resolution (cache key includes size).
- `npm run lint` and `npm run build` pass.

---

#### Slice S4 — Lateral self-shadow PCF filter (inspection-only)

**Problem:** The v0.05 smooth accumulation improved the depth direction but not the lateral width of shadow edges. Under raking light, each height-march step still reads as a hard lateral stripe.

**Pre-condition:** Ship S2 (and optionally S3) before S4. S4 triples the self-shadow texture reads at high preset (8 steps × 3 rays = 24 reads) and should only be active under inspection profiles.

**Files changed:** `src/config/quality.ts`, `src/materials/PaintingMaterial.ts`, `src/main.ts`

---

**Step 4a — Add `selfShadowFilterEnabled` and update `selfShadowFilterRadius` in `QualityPreset`**

Add one field to the `QualityPreset` interface in `src/config/quality.ts`, after `selfShadowFilterRadius`:

```ts
/**
 * Whether PAINTING_USE_SHADOW_FILTER is compiled in. Enabling triggers a
 * material recompile. Driven at runtime by main.ts via
 * PaintingMaterial.setShadowFilterRadius() — keep false in preset objects.
 */
selfShadowFilterEnabled: boolean;
```

Set `selfShadowFilterEnabled: false` on all three presets (runtime toggle only via `setShadowFilterRadius()`).

Update `selfShadowFilterRadius` on high preset from `0.0` to `0.002`:

```ts
// quality.ts — high preset
selfShadowFilterRadius: 0.002,   // was 0.0; used when main.ts enables S4
```

---

**Step 4b — Extend `PaintingMaterial`**

**(i) Add to `PaintingUniforms` interface** (after `uShadowProfileScale`):

```ts
// src/materials/PaintingMaterial.ts  — PaintingUniforms interface
uShadowFilterRadius: { value: number };
```

**(ii) Add instance field** after `shadowDebugEnabled = false` (line 88):

```ts
private shadowFilterEnabled = false;
```

**(iii) Initialize in constructor** (in the `paintingUniforms` literal after `uShadowProfileScale`):

```ts
uShadowFilterRadius: { value: preset.selfShadowFilterRadius },
```

**(iv) Add `setShadowFilterRadius()` method** after the existing `setShadowDebug()`:

```ts
/**
 * Enables or disables the lateral PCF-like self-shadow filter.
 * `radius` is in UV space (typical 0.001..0.004).
 * Changing `enabled` triggers a full shader recompile via `needsUpdate = true`.
 * Call from main.ts when the light profile switches to/from inspection.
 */
setShadowFilterRadius(radius: number, enabled: boolean): void {
  this.paintingUniforms.uShadowFilterRadius.value = radius;
  if (enabled !== this.shadowFilterEnabled) {
    this.shadowFilterEnabled = enabled;
    this.needsUpdate = true;
  }
}
```

**(v) Register the define in `onBeforeCompile`** — add after the `PAINTING_DEBUG_SHADOW` conditional:

```ts
if (this.shadowFilterEnabled && this.paintingUniforms.uShadowFilterRadius.value > 0) {
  defines.push('#define PAINTING_USE_SHADOW_FILTER');
}
```

**(vi) Declare the uniform in the GLSL `uniformBlock` string** — add after `uniform float uShadowProfileScale;`:

```glsl
uniform float uShadowFilterRadius;
```

**(vii) Add the GLSL filter chunk.** In the `lightsEndChunk` string, inside `#ifdef PAINTING_USE_SELFSHADOW`, insert after `_occlusion = clamp(_occlusion, 0.0, uShadowMaxOcclusion);` and before `float _shadow = ...`:

```glsl
#ifdef PAINTING_USE_SHADOW_FILTER
    {
        // Two companion rays perpendicular to the primary march direction.
        // Blending three rays removes lateral texel-step hard edges without
        // raising the overall darkening envelope.
        // _shDelta is the per-step UV offset already computed in the march above.
        float _dLen = length(_shDelta);
        vec2 _latDir = (_dLen > 0.0001)
            ? vec2(-_shDelta.y, _shDelta.x) * (uShadowFilterRadius / _dLen)
            : vec2(uShadowFilterRadius, 0.0);
        float _oL = 0.0, _oR = 0.0, _wL = 0.0, _wR = 0.0;
        for (int _k = 0; _k < 16; _k++) {
            if (float(_k) >= uShadowSteps) break;
            float _fi  = float(_k + 1);
            float _wk  = 1.0 / _fi;
            float _wH  = _curH + _tsLight.z * _shStep * _fi;
            vec2  _bo  = _shDelta * _fi;
            float _exL = texture2D(bumpMap, clamp(_shUV + _bo - _latDir, 0.001, 0.999)).r
                         - _wH - uShadowBias;
            float _exR = texture2D(bumpMap, clamp(_shUV + _bo + _latDir, 0.001, 0.999)).r
                         - _wH - uShadowBias;
            _oL += smoothstep(0.0, max(uShadowSoftness, 0.001), _exL) * _wk;
            _oR += smoothstep(0.0, max(uShadowSoftness, 0.001), _exR) * _wk;
            _wL += _wk; _wR += _wk;
        }
        float _lOcc = clamp((_wL > 0.0) ? _oL / _wL : 0.0, 0.0, uShadowMaxOcclusion);
        float _rOcc = clamp((_wR > 0.0) ? _oR / _wR : 0.0, 0.0, uShadowMaxOcclusion);
        _occlusion = (_occlusion + _lOcc + _rOcc) / 3.0;
    }
#endif
```

**(viii) Update `applyPreset()`** — add after `uShadowMaxOcclusion` assignment:

```ts
this.paintingUniforms.uShadowFilterRadius.value = preset.selfShadowFilterRadius;
```

The `shadowFilterEnabled` flag is only toggled via `setShadowFilterRadius()` from `main.ts`, so the existing `definesChanged` check in `applyPreset()` does not need to change.

---

**Step 4c — Wire from `main.ts`**

In `src/main.ts`, in the same block as the existing `setShadowProfileScale` call:

```ts
// src/main.ts  — add alongside setShadowProfileScale
const isInspection = profile.displayIntent === 'inspection';
paintingMaterial.setShadowFilterRadius(
  isInspection ? activePreset.selfShadowFilterRadius : 0.0,
  isInspection && activePreset.selfShadowFilterRadius > 0
);
```

Behaviour:
- Gallery profiles: `enabled = false`. The `PAINTING_USE_SHADOW_FILTER` define is absent after first load; no runtime recompile cost.
- Inspection profile: `enabled = true` on first switch → one-time shader recompile. Subsequent same-profile loads are zero extra cost.

**S4 Acceptance:**
- Under `raking-inspection`, the shadow loop runs 3 rays × 8 steps = 24 texture reads (was 8).
- Under `gallery-soft`, the single-ray path is compiled in; performance identical to v0.05.
- `_occlusion` after averaging ≤ `uShadowMaxOcclusion`. Max gallery darkening unchanged at 4.2 %; max inspection darkening unchanged at 8.4 %.
- `setShadowDebug()` still renders the correct shadow-mask greyscale with filter active.
- `npm run lint` and `npm run build` pass.

---

### v0.06 Performance Budget

| Path | Self-shadow texture reads | Notes |
|------|---------------------------|-------|
| Gallery (S2 + S3 only) | 8 steps × 1 ray = **8** | Identical to v0.05 |
| Inspection (S4 on, high) | 8 steps × 3 rays = **24** | Only when `displayIntent === 'inspection'` |
| S3 memory uplift per artwork | ≈48 MB RGBA GPU | 3 roles × 2048² × 4 bytes; only when inspectionMode |

The memory cost is an acceptable trade-off for the inspection path; the user has explicitly navigated to a close-up relief view.

---

### v0.06 Global Acceptance Checks

1. `npm run lint` — no new errors.
2. `npm run build` — clean; only pre-existing Sass deprecation warning.
3. Shadow debug key `s`/`S` (behind `?debug=1`) shows correct shadow mask under both gallery and inspection profiles, with and without the PCF filter active.
4. Gallery display: no visual regression on `gallery-soft` or `museum-neutral`.
5. Inspection: visibly smoother relief shading under `raking-inspection` without new smearing artefacts.
6. Preset toggle: switching `balanced → high` in inspection mode re-applies anisotropy and triggers inspection-resolution uplift.
7. Race guard: rapid profile switches do not apply stale textures — existing `artworkLoadToken` guard in `GalleryManager` is unchanged.

---

### v0.06 Fallback Behaviour

- If `getMaxAnisotropy()` returns `1`, `setAnisotropy(1)` is a no-op on cached textures; procedural maps render cleanly without error.
- If S3 memory cost is too high, set `proceduralInspectionTileSize: 0` on high preset — no code revert needed.
- If S4 filter cost is too high on a target device, call `setShadowFilterRadius(0, false)` from `main.ts` to omit the define and return to the S2/S3 single-ray baseline.

---

### v0.06 Shader / Math-Space Assumptions

- `bumpMap.r = 0.0` → deepest recess; `1.0` → highest peak. Unchanged from v0.05.
- `_shDelta` is the tangent-space light direction projected onto UV, scaled by `uParallaxScale / uShadowSteps`. No change in S4.
- The lateral PCF offset `_latDir` at `uShadowFilterRadius = 0.002`: one march step is `0.04 / 8 = 0.005` UV, larger than `0.002`. No inter-step overlap and no sampling outside `[0.001, 0.999]`.
- Height maps remain single-channel (R channel of RGBA) for all procedural and authored paths.

---

### v0.06 Resource Ownership / Async Boundaries

- `TextureManager` owns all authored textures. `ProceduralTextureFactory` owns all generated textures. No change.
- `setAnisotropy()` and `setInspectionMode()` mutate cached texture properties in-place. No new ownership transfer or deferred disposal.
- S3 dual-size cache: both sizes remain alive simultaneously. A future `pruneSizeBelow(threshold)` on `ProceduralTextureFactory` can reclaim the lower-res entry — out of scope for v0.06.
- The `artworkLoadToken` race guard in `GalleryManager` remains the sole async guard for artwork loads.

---

### v0.06 Browser / API Stability Boundaries

- `THREE.Texture.anisotropy` is stable since Three.js r119+; already used by `TextureManager`.
- All GLSL changes use `texture2D()` and standard GLSL 1.0 — no extensions, no WebGL2-only syntax.
- No new npm dependencies.

---

### v0.06 Known Risks

1. S3 memory uplift may cause a generation stall on first inspection-mode switch on slow CPUs. Mitigate by capping `proceduralInspectionTileSize ≤ 2048`.
2. S4 triples per-fragment self-shadow texture reads. Profile on mid-range mobile before shipping to balanced preset.
3. Strong anisotropy on tiling procedural maps may make pattern repetition more visible at glancing angles. Evaluate on wide landscape paintings.
4. Dual-size S3 cache doubles procedural GPU memory footprint on high+inspection. Acceptable for desktop; revisit for mobile.

---

### v0.06 Recommended Execution Order

1. **S2** — Ship anisotropy fix. Re-evaluate blockiness under `raking-inspection`.
2. If blockiness persists: **S3** — Add inspection tile size uplift. Re-evaluate.
3. If lateral shadow stepping persists: **S4** — Activate lateral PCF filter.
4. After each shipped slice: update `FINDINGS.md`, `CHANGELOG.md`, `docs/HANDOFF.md`.

## v0.03 Follow-up Plan — Technical Rendering System for Faithful Artworks, Modular Asset Swaps, Parallax Relief, and Free Inspection

### v0.03 Planning Status

v0.03 is **implemented**. All nine slices below have been executed against the codebase, the bundle builds cleanly (`npm run lint` + `npm run build`), and the customer preview bundle (`customer-preview/freyraum-gallery.js`) contains the new shader features. See the `v0.03 Implementation Outcome` subsection (immediately below) for the as-built deviations from the original plan, the issues found and fixed during implementation, and the validation evidence. The detailed execution plan that follows is retained verbatim as the historical record of the design intent.

### v0.03 Implementation Outcome

**Validation evidence**

- `npm run lint` — clean.
- `npm run build` — clean. Bundle: `customer-preview/freyraum-gallery.js` ≈ 552 KB (gzip ≈ 141 KB), CSS ≈ 15.4 KB (gzip ≈ 3.4 KB). Bundle growth from v0.02 (~528 KB) is the parallax + self-shadow shader code and the new lighting/debug UI strings.
- Fresh-clone revalidation (2026-05-17): before `npm install`, `npm run lint` failed with `eslint: not found` and `npm run build` failed because required packages like `three` were missing from `node_modules`; after `npm install`, both commands passed. Non-blocking warnings observed: the existing `@typescript-eslint` TypeScript-version warning and the current Dart Sass legacy JS API deprecation warning during `vite build`.
- Built bundle contains all v0.03 shader gates: `PAINTING_USE_PARALLAX`, `PAINTING_USE_SELFSHADOW`, `PAINTING_DEBUG_ALBEDO_ONLY`, `uKeyLightDir`. Counted 12 occurrences in the production bundle during the fresh-clone revalidation audit.

**Issues found in the original plan and the fixes applied**

1. *Self-shadow GLSL identifier did not exist.* The plan's Slice 5 referenced `geometryLightDirection` as if it were a Three.js fragment-shader local. Three.js does not provide that name; only `vViewPosition`, `vNormal`, `vTangent`, and `vBitangent` are reliably available. **Fix:** Added a uniform `uKeyLightDir` carrying the **view-space** direction toward the primary key light, computed once per frame in `main.ts` via `keyLightWorld.transformDirection(camera.matrixWorldInverse)`. The shader projects it onto `(vTangent, vBitangent, vNormal)` to obtain the tangent-space light direction used by the march. This is also the math-space contract documented at the top of `PaintingMaterial.ts`.
2. *Parallax + bump double-counting.* The plan's Slice 4 left `bumpStrength = 0.035` on the high preset while also enabling parallax — the same height field would have driven both UV offsetting *and* normal perturbation, producing exaggerated relief that contradicts the plan's own "single source of truth per preset" rule. **Fix:** When `parallaxEnabled` is true on a preset, `bumpStrength = 0.0`. The high preset relies on parallax for depth; the balanced preset uses bump only (`bumpStrength = 0.025`); battery uses neither.
3. *Spot target ownership.* The plan repositioned spot lights closer to the artwork but did not specify that `THREE.SpotLight.target` defaults to a detached `Object3D` at `(0,0,0)` that is NOT in the scene graph. When animating the spot position the cone still pointed at world origin but the un-parented target was a footgun for future maintenance. **Fix:** `LightingSetup` now creates a single shared `spotTarget` object, adds it to the scene, and assigns it to every spotlight. `dispose()` removes it.
4. *Reduced-motion ambient knob.* The plan's reduced-motion handling already existed in v0.02 via `uReducedMotionScalar`. The new self-shadow path could fight with that. **Decision:** Self-shadow is **not** scaled by reduced-motion (shadows are not motion); only the existing detail-normal and grazing-boost paths are. This matches the plan's accessibility intent and keeps shadows truthful to the relief.
5. *Albedo-only fidelity comparison surface.* The plan called for an inspection/QA toggle but did not specify a UI surface (and exposing it as a public control would confuse visitors). **Decision:** Gated behind `?debug=1` URL parameter, then activated by pressing the `a` key. A `console.info` line announces availability on page load when the parameter is present. The lighting profile selector (a legitimate viewer choice) is exposed in `PreferencesPanel` under a new "Beleuchtung" group.
6. *Texture cache invalidation on preset change.* The plan added `tileSize` to `ProceduralTextureFactory.generate()` but the existing cache was keyed by `${id}::${role}`, which would have returned stale low-resolution textures after switching to a higher preset. **Fix:** Cache key now includes `tileSize` so each effective resolution is generated and cached independently. `disposeAll()` continues to free every entry.

**Per-slice as-built summary**

| Slice | Files touched | Net effect |
|------:|--------------|------------|
| 1 — Surface contract + fidelity instrumentation | `config/artworks.ts`, `config/quality.ts`, `materials/PaintingMaterial.ts` | Added `SurfaceProfile`/`SurfacePhysics` types; seven new quality preset fields; `uAlbedoOnly` uniform with `setAlbedoOnly()` method gated by `PAINTING_DEBUG_ALBEDO_ONLY`. |
| 2 — Matte-first material retune | `materials/PaintingMaterial.ts`, `materials/ProceduralTextureFactory.ts` | `clearcoat 0.04→0.0`, `specularIntensity 1.0→0.3`, `uLightGrazingBoost 0.6→0.25`. Procedural roughness range `[60..220]→[140..240]`. Specular baseline `12→6`, peak blob `200→90`. |
| 3 — Resolution-aware procedural fallback | `materials/ProceduralTextureFactory.ts`, `gallery/GalleryManager.ts` | `generate(id, role, tileSize?)`; cache keyed by tileSize; `GalleryManager` passes `preset.proceduralTileSize` (1024 / 512 / 256 per preset). |
| 4 — Parallax relief | `gallery/ArtworkMesh.ts`, `materials/PaintingMaterial.ts` | `geo.computeTangents()` in `makeArtworkGeometry`; new `map_fragment` injection performs a 12-step tangent-space steep parallax march producing `pUV`; the replaced `normal_fragment_maps` chunk samples the normal at `pUV` when parallax is active. |
| 5 — Self-shadow | `materials/PaintingMaterial.ts`, `lighting/LightingSetup.ts`, `main.ts` | View-space `uKeyLightDir` uniform; 8-step height march modulates `directDiffuse` and `directSpecular` only (never multiplies albedo); `LightingSetup.getKeyLightWorldDir()` exposes the world-space direction; `main.ts` transforms it into view space per frame. |
| 6 — Museum lighting | `lighting/LightProfile.ts`, `lighting/LightingSetup.ts`, `ui/PreferencesPanel.ts`, `utils/preferences.ts` | `gallery-soft` key {-10,5,7}→{-3,5,4}; `raking-inspection` key {-7,0.5,1.3}→{-6,0,1.5}, ambient 0.4→0.3; new `displayIntent` field on `LightProfile`; shared `spotTarget` at origin; `lighting` field added to `Preferences` (persisted); new "Beleuchtung" radio group in `PreferencesPanel`. |
| 7 — Free edge/corner inspection | `gallery/GalleryManager.ts` | `PAN_SAFETY_FACTOR = 0.92` removed; `INSPECTION_OVERSCROLL = 0.5` added; `getPanLimits` formula now `(artworkSize − visibleSize) * 0.5 + INSPECTION_OVERSCROLL`. |
| 8 — Performance hardening | `config/quality.ts` | Tuned per-preset step counts baked in: high `parallaxSteps=12`, `selfShadowSteps=8`; balanced/battery `parallaxSteps=0`, `selfShadowSteps=0`. |
| 9 — Documentation | `plan.md`, `CHANGELOG.md`, `FINDINGS.md`, `README.md`, `docs/HANDOFF.md` | Status updated to "implemented"; as-built deviations and validation evidence recorded; reviewer guidance for `?debug=1` and lighting profile UI added. |

**Files modified, in execution order**

1. `src/config/artworks.ts` — Slice 1 types
2. `src/config/quality.ts` — Slice 1 preset fields + Slice 2 + Slice 8 values
3. `src/materials/ProceduralTextureFactory.ts` — Slice 2 + Slice 3
4. `src/materials/PaintingMaterial.ts` — Slices 1, 2, 4, 5 (parallax + self-shadow + albedo-only)
5. `src/gallery/ArtworkMesh.ts` — Slice 4 (`computeTangents`)
6. `src/gallery/GalleryManager.ts` — Slice 3 + Slice 7
7. `src/lighting/LightProfile.ts` — Slice 6 (positions + `displayIntent`)
8. `src/lighting/LightingSetup.ts` — Slice 6 (spotTarget, `getKeyLightWorldDir`)
9. `src/utils/preferences.ts` — Slice 6 (lighting preference)
10. `src/ui/PreferencesPanel.ts` — Slice 6 (lighting selector UI)
11. `src/main.ts` — Slice 5 (per-frame uKeyLightDir wiring) + Slice 6 (lighting profile change propagation) + debug toggle

**Acceptance criteria revisited**

- *Picture fidelity preserved:* Shader logic guarantees albedo path is unchanged when `uReducedMotionScalar` is 1.0; the `?debug=1` + `a` toggle now lets reviewers compare albedo-only and shaded renders side-by-side without recompilation.
- *Detail visibility during pan/zoom:* Achieved through (a) parallax UV offset on high preset reacting to view direction in tangent space, (b) repositioned key light at 45° still casts microshadows, and (c) lifting `PAN_SAFETY_FACTOR` so every corner is reachable at maximum zoom.
- *Museum-quality default:* `gallery-soft` is the default profile (preserved from v0.02), no longer dramatically side-lit, ambient kept at 1.5 for flattering fill, decay 1.8 for soft falloff.
- *Raking inspection on demand:* `raking-inspection` profile is now one click away in the preferences panel and produces a near-horizontal key for relief reveal.
- *Performance:* Parallax (12 iterations) + self-shadow (8 iterations) run only on the `high` preset; balanced and battery presets pay zero shader cost for these paths via `#define` gating.

---

### v0.03 Execution Plan — File-Level Code Changes

This section specifies the exact code changes required for each vertical slice. References like "line N" point to the current state of the file at the time this plan was finalized. Always verify against the current file before editing.

---

#### Slice 1 — Surface contract and fidelity instrumentation

**`src/config/artworks.ts`**

Add before the `Artwork` interface:

```typescript
export type SurfaceProfile =
  | 'matte-canvas'
  | 'satin-canvas'
  | 'varnished-oil'
  | 'paper'
  | 'procedural-fallback';

export interface SurfacePhysics {
  /** Multiplier on relief amplitude from all maps (normal/bump/height). 1.0 = default. */
  reliefScale?: number;
  /** Multiplier on parallax depth. 1.0 = default. */
  parallaxDepthScale?: number;
}
```

Add to the `Artwork` interface (both fields optional so existing artworks need no change):

```typescript
/** Surface character for material pipeline decisions. Defaults to 'matte-canvas'. */
surfaceProfile?: SurfaceProfile;
/** Optional physical-scale modifiers for relief and parallax depth. */
surfacePhysics?: SurfacePhysics;
```

No changes to the `artworks` array — all existing items default to `matte-canvas` at runtime.

---

**`src/config/quality.ts`**

Add the following fields to the `QualityPreset` interface (after existing v0.02 fields):

```typescript
/** Target pixel size for procedurally generated support maps (normal, height, roughness). */
proceduralTileSize: number;
/** Whether parallax occlusion UV offset is compiled into the fragment shader. */
parallaxEnabled: boolean;
/** Number of height-field march steps for parallax UV offset (high only). */
parallaxSteps: number;
/** Whether direct-light self-shadow approximation is compiled in (high only). */
selfShadowEnabled: boolean;
/** Number of height-field steps for the self-shadow horizon march (high only). */
selfShadowSteps: number;
```

Assign values in `QUALITY_PRESETS`:

```
high:     proceduralTileSize: 1024, parallaxEnabled: true,  parallaxSteps: 12, selfShadowEnabled: true,  selfShadowSteps: 8
balanced: proceduralTileSize: 512,  parallaxEnabled: false, parallaxSteps: 0,  selfShadowEnabled: false, selfShadowSteps: 0
battery:  proceduralTileSize: 256,  parallaxEnabled: false, parallaxSteps: 0,  selfShadowEnabled: false, selfShadowSteps: 0
```

Also increase `bumpStrength` in `high` from `0.012` → `0.035` and `normalStrength` from `0.45` → `0.65`.

---

**`src/materials/PaintingMaterial.ts`**

Add `uAlbedoOnly` to `PaintingUniforms`:

```typescript
uAlbedoOnly: { value: number }; // 0 = normal render, 1 = albedo-only debug strip
```

Initialise in `constructor` with `{ value: 0 }`.

Add `PAINTING_DEBUG_ALBEDO_ONLY` define to the defines array when `this.albedoOnlyEnabled`.

In the `onBeforeCompile` uniform block, add:

```glsl
uniform float uAlbedoOnly;
```

Inject before `lights_fragment_end`:

```glsl
#ifdef PAINTING_DEBUG_ALBEDO_ONLY
  reflectedLight.directDiffuse  = vec3(0.0);
  reflectedLight.directSpecular = vec3(0.0);
  reflectedLight.indirectDiffuse  = diffuseColor.rgb;
  reflectedLight.indirectSpecular = vec3(0.0);
#endif
```

Add public method:

```typescript
setAlbedoOnly(enabled: boolean): void {
  if (this.albedoOnlyEnabled === enabled) return;
  this.albedoOnlyEnabled = enabled;
  this.uAlbedoOnly.value = enabled ? 1 : 0;
  this.needsUpdate = true;
}
```

---

#### Slice 2 — Matte-first material retune

**`src/materials/PaintingMaterial.ts`**

In the `super()` call in the constructor, change:

- `clearcoat: 0.04` → `clearcoat: 0.0`
- `specularIntensity: 1.0` → `specularIntensity: 0.3`

In `paintingUniforms` initialisation, change:

- `uLightGrazingBoost: { value: 0.6 }` → `uLightGrazingBoost: { value: 0.25 }`

---

**`src/materials/ProceduralTextureFactory.ts`**

In `generateRoughness`: change output range from `[60..220]` to `[140..240]` to make the fallback surface feel matte rather than semi-glossy:

```typescript
// old: const r = this.clamp8(60 + combined * 160);
const r = this.clamp8(140 + combined * 100);
```

In `generateSpecular`: lower the blob peak intensity from `200` to `90` and reduce the baseline from `12` to `6` so specular blobs are subtle rather than dominant:

```typescript
// Baseline
data[i * 4 + 0] = 6; // was 12

// Blob peak
const blob = Math.exp(-distSq / (radius * radius)) * 90; // was 200
```

---

**`src/config/quality.ts`**

Also lower `specularStrength` in `high` preset from `0.55` → `0.4` so even the authored/procedural specular map contribution is more muted.

---

#### Slice 3 — Resolution-aware procedural fallback system

**`src/materials/ProceduralTextureFactory.ts`**

Change the `generate` signature to accept an optional `tileSize` parameter:

```typescript
generate(artworkId: string, role: PaintingMapRole, tileSize?: number): THREE.Texture
```

Change the cache key to incorporate tile size:

```typescript
const effectiveSize = tileSize ?? 256;
const cacheKey = `${artworkId}::${role}::${effectiveSize}`;
```

Pass `effectiveSize` as the `size` parameter to all private generators. Each generator currently hard-codes its own size constant — refactor `generateNormal`, `generateHeight`, `generateRoughness`, `generateSpecular`, and `generateAO` to accept a `size: number` parameter instead of hard-coding `256` or `128`.

For `normal` and `detailNormal`, the existing `generateNormal(seed, size, ...)` already takes a `size` argument, so only the call site needs to change from `256` to `effectiveSize`.

For `height` (currently `size = 256` inside `generateHeight`), `roughness` (currently `size = 128`), and `specular` (currently `size = 128`): parametrise with `Math.max(64, Math.floor(effectiveSize / 2))` for roughness and specular (they need less resolution than the relief maps), and `effectiveSize` for height.

---

**`src/gallery/GalleryManager.ts`**

In `showArtwork`, change the procedural fallback call:

```typescript
// old:
resolved[role] = this.procedural.generate(artwork.id, role);

// new:
resolved[role] = this.procedural.generate(artwork.id, role, preset.proceduralTileSize);
```

---

#### Slice 4 — High-preset parallax relief path

**`src/gallery/ArtworkMesh.ts`**

In `makeArtworkGeometry`, add tangent computation after the uv1 copy:

```typescript
geo.computeTangents(); // required for tangent-space parallax
```

This makes `tangent` available as an attribute in the vertex shader, which Three.js passes as `vTangent` (via its built-in tangent chunk) when the material has a `normalMap`.

---

**`src/materials/PaintingMaterial.ts`**

Add to `PaintingUniforms`:

```typescript
uParallaxScale: { value: number }; // height offset multiplier, e.g. 0.04
uParallaxSteps: { value: number }; // march iterations, e.g. 12
```

Initialise: `{ value: preset.parallaxEnabled ? 0.04 : 0.0 }`, `{ value: preset.parallaxSteps }`.

Add `PAINTING_USE_PARALLAX` define when `this.parallaxActive()`.

In `applyPreset`, add:

```typescript
this.paintingUniforms.uParallaxScale.value = preset.parallaxEnabled ? 0.04 : 0.0;
this.paintingUniforms.uParallaxSteps.value = preset.parallaxSteps;
const wantsParallax = preset.parallaxEnabled && !!this.bumpMap;
```

Include `wantsParallax` in `definesChanged` comparison.

In the `onBeforeCompile` uniform block, add:

```glsl
uniform float uParallaxScale;
uniform float uParallaxSteps;
```

Add a new injection token constant:

```typescript
const MAP_FRAGMENT_TOKEN = '#include <map_fragment>';
```

Inject before `map_fragment`:

```glsl
#ifdef PAINTING_USE_PARALLAX
  // Steep parallax: march the height field in tangent space.
  // vTangent and vBitangent are supplied by Three.js when computeTangents() is called.
  vec3 tsViewDir = normalize(vec3(
    dot(vViewPosition, vTangent.xyz),
    dot(vViewPosition, vBitangent),
    dot(vViewPosition, geometryNormal)
  ));
  vec2 pUV = vMapUv;
  float stepSize    = 1.0 / uParallaxSteps;
  float layerHeight = 0.0;
  vec2  uvDelta     = (tsViewDir.xy / max(tsViewDir.z, 0.2)) * uParallaxScale / uParallaxSteps;
  for (int i = 0; i < 16; i++) {
    if (float(i) >= uParallaxSteps) break;
    layerHeight += stepSize;
    pUV -= uvDelta;
    float h = texture2D(bumpMap, pUV).r;
    if (h >= layerHeight) break;
  }
  pUV = clamp(pUV, 0.001, 0.999);
#else
  vec2 pUV = vMapUv;
#endif
```

Replace the `map_fragment` chunk so the albedo sample reads from `pUV`:

```glsl
// Replace: #include <map_fragment>
// With a copy of Three.js map_fragment that swaps vMapUv -> pUV:
#ifdef USE_MAP
  vec4 sampledDiffuseColor = texture2D( map, pUV );
  #ifdef DECODE_VIDEO_TEXTURE
    sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
  #endif
  diffuseColor *= sampledDiffuseColor;
#endif
```

Also update the `normal_fragment_maps` injection to use `pUV` instead of `vNormalMapUv` for the base normal sample.

Height convention documented: `0.0 = deepest recess`, `1.0 = highest peak`. All procedural height maps must follow this convention. Authored maps must declare their convention in `PaintingTextureMapEntry`.

---

#### Slice 5 — Direct-light self-shadow approximation

**`src/materials/PaintingMaterial.ts`**

Add to `PaintingUniforms`:

```typescript
uShadowSteps:    { value: number }; // march iterations, e.g. 8
uShadowStrength: { value: number }; // shadow darkening scalar, e.g. 0.55
```

Add `PAINTING_USE_SELFSHADOW` define when `preset.selfShadowEnabled && !!this.bumpMap`.

In the `onBeforeCompile` uniform block, add:

```glsl
uniform float uShadowSteps;
uniform float uShadowStrength;
```

Inject before `lights_fragment_end` (after the parallax block, before the grazing-boost block):

```glsl
#ifdef PAINTING_USE_SELFSHADOW
  {
    // Approximate direct-light self-shadow using the primary light direction.
    // Light direction in tangent space from the first directional/spot light term.
    // Note: Three.js accumulates lights; we use the geometric normal as a proxy
    // for the light direction since the exact tangent-space L is not directly
    // available after lights_fragment_end. A coarser but stable approximation:
    // use the blinn-phong half-vector direction as the march direction.
    vec3 tsLightDir = normalize(vec3(
      dot(geometryLightDirection, vTangent.xyz),
      dot(geometryLightDirection, vBitangent),
      dot(geometryLightDirection, geometryNormal)
    ));
    vec2 shadowUV = pUV;
    float shadowFactor = 1.0;
    float shadowStep = 1.0 / uShadowSteps;
    float currentLayerH = texture2D(bumpMap, shadowUV).r;
    vec2 shadowDelta = tsLightDir.xy / max(tsLightDir.z, 0.2) * shadowStep * 0.035;
    for (int i = 0; i < 8; i++) {
      if (float(i) >= uShadowSteps) break;
      shadowUV += shadowDelta;
      shadowUV = clamp(shadowUV, 0.001, 0.999);
      float h = texture2D(bumpMap, shadowUV).r;
      if (h > currentLayerH + shadowStep * float(i + 1)) {
        shadowFactor = 1.0 - uShadowStrength;
        break;
      }
    }
    reflectedLight.directDiffuse  *= shadowFactor;
    reflectedLight.directSpecular *= shadowFactor;
  }
#endif
```

Note: `geometryLightDirection` is not a built-in Three.js variable. The correct implementation approach is to inject a uniform `uKeyLightDir` (a world-space direction vector set from `LightingSetup`) and transform it into tangent space in the shader. Add to `LightingSetup`:

```typescript
/** Exposes the primary key light direction as a uniform so PaintingMaterial can use it for self-shadow. */
getKeyLightWorldDir(): THREE.Vector3 {
  const primary = this.spots[0];
  if (!primary) return new THREE.Vector3(0, 1, 0);
  return primary.position.clone().negate().normalize();
}
```

And add `uKeyLightDir: { value: THREE.Vector3 }` to `PaintingUniforms`, updated each frame from `LightingSetup.getKeyLightWorldDir()` in `main.ts`.

---

#### Slice 6 — Museum-style display lighting and inspection controls

**`src/lighting/LightProfile.ts`**

Add `displayIntent` to the `LightProfile` interface (informational, not used in rendering logic):

```typescript
/** Artistic intent of this profile, for documentation and UI labelling. */
displayIntent?: 'gallery-display' | 'neutral-review' | 'relief-inspection' | 'dramatic-demo';
```

Update `gallery-soft` profile values:

```typescript
'gallery-soft': {
  id: 'gallery-soft',
  label: 'Galerie weich',
  description: 'Museum-style warm key at ~45° from ceiling, slight upper-left offset. Flattering yet asymmetric enough to reveal surface detail during pan/zoom.',
  displayIntent: 'gallery-display',
  ambientIntensity: 1.5,
  ambientKelvin: 4000,
  keys: [
    {
      kelvin: 3200,
      intensity: 165,
      position: { x: -3, y: 5, z: 4 }, // ~45° from vertical, LEFT of artwork center
      angle: 0.38,
      penumbra: 0.85,
      decay: 1.8,
    },
  ],
  accent: {
    kelvin: 4500,
    intensity: 10,
    position: { x: 3, y: 1, z: 5 }, // low right fill, glare-safe
    decay: 2.0,
  },
  animateAllowed: true,
},
```

Rationale for `gallery-soft` position change: the current key at `{ x: -10, y: 5, z: 7 }` is approximately **68° from vertical** (very dramatic, theatrical side-lighting). The new position `{ x: -3, y: 5, z: 4 }` is approximately **45° from vertical**, which is a practical compromise — flattering and gallery-like while still providing enough asymmetry to reveal relief detail when the viewer pans or zooms.

Update `raking-inspection` for cleaner low-angle grazing:

```typescript
'raking-inspection': {
  id: 'raking-inspection',
  label: 'Streiflicht',
  description: 'Near-horizontal raking light from the left. Reveals canvas weave, brush ridges, impasto relief, and self-shadow cues.',
  displayIntent: 'relief-inspection',
  ambientIntensity: 0.3,  // reduce fill so micro-shadows remain visible
  ambientKelvin: 4000,
  keys: [
    {
      kelvin: 3500,
      intensity: 200,
      position: { x: -6, y: 0, z: 1.5 }, // near-horizontal, almost parallel to painting
      angle: 0.30,
      penumbra: 0.45,
      decay: 1.6,
    },
  ],
  animateAllowed: false,
},
```

Also add `displayIntent` to the other two profiles:

- `museum-neutral`: `displayIntent: 'neutral-review'`
- `dramatic-demo`: `displayIntent: 'dramatic-demo'`

---

**`src/lighting/LightingSetup.ts`**

In `applyKeyLight`, explicitly set the SpotLight `target` position and add it to the scene so the aim is deterministic regardless of scene transforms:

```typescript
spot.target.position.set(0, 0, 0);
if (!spot.target.parent) this.scene.add(spot.target);
```

This ensures all profiles aim at the artwork center (world origin).

Add the public `getKeyLightWorldDir()` method described in Slice 5.

---

#### Slice 7 — Free edge/corner inspection camera

**`src/gallery/GalleryManager.ts`**

Replace the `PAN_SAFETY_FACTOR` constant and `getPanLimits` method:

Remove:
```typescript
const PAN_SAFETY_FACTOR = 0.92;
```

Add:
```typescript
/** World-unit overscroll margin past artwork edge allowed in inspection mode. */
const INSPECTION_OVERSCROLL = 0.5;
```

Replace `getPanLimits`:

```typescript
private getPanLimits(zoom: number): { x: number; y: number } {
  const visibleHeight = 2 * this.clampZoom(zoom) * Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5));
  const visibleWidth = visibleHeight * this.camera.aspect;

  // Allow panning so every edge and corner is reachable at the current zoom.
  // The viewport center must be able to reach the artwork edge + an explicit
  // overscroll margin. This replaces the old PAN_SAFETY_FACTOR = 0.92.
  return {
    x: Math.max(0, (this.artworkMesh.artworkWidth  - visibleWidth)  * 0.5 + INSPECTION_OVERSCROLL),
    y: Math.max(0, (this.artworkMesh.artworkHeight - visibleHeight) * 0.5 + INSPECTION_OVERSCROLL),
  };
}
```

---

#### Slice 8 — Preset/performance hardening

After implementing Slices 4 and 5, measure frame time impact:

- If `high` parallax with 12 steps exceeds the 16 ms budget on a mid-range discrete GPU, reduce `parallaxSteps` to 8.
- If `high` self-shadow with 8 steps causes visible shimmer on high-frequency height tiles, reduce `uShadowSteps` to 4 and increase `uShadowStrength` slightly to compensate.
- Ensure `balanced` and `battery` paths skip both defines completely.
- Document final tuned values in `FINDINGS.md` with a tested GPU profile note.

---

#### Slice 9 — Documentation and validation handoff

- Update all acceptance checks in `plan.md` from `[ ]` to `[x]` as slices are completed.
- Add a validation note to `FINDINGS.md` covering: GPU tested, final sample counts, texture memory cost per preset, any visual regressions caught.
- Run `npm run lint`, `npm run build`, and visually inspect the `customer-preview/app.html` output at high/balanced/battery presets.
- Verify the `raking-inspection` profile shows brush ridges/self-shadow cues at close zoom.
- Verify `gallery-soft` shows visible relief change during pan movement.
- Verify no albedo colour change is visible in the albedo-only debug mode vs normal render.

Required outcomes:

- the shader must **not alter the original picture's essence**;
- the default surface must read **rougher, more matte, and less shiny**;
- relief must be visibly driven by **light direction and view angle**;
- lighting must be positioned **artistically like a museum/gallery display** while still revealing surface detail;
- close inspection must keep **high-frequency detail at max zoom**;
- movement must allow **free edge/corner inspection** when zoomed in;
- artworks must be **fully swappable** in the future without code changes and without assuming current source resolutions.

The implementation must stay modular, work for arbitrary aspect ratios and arbitrary source pixel sizes, and be delivered in vertical slices.

### v0.03 Goals

1. Preserve the original artwork image as the authoritative albedo source; the rendering system may add surface response, but not reinterpret the picture.
2. Replace the current semi-varnished default with a matte-first material response suitable for canvas, pigment, and dry painted surfaces.
3. Introduce a technically explicit relief pipeline that can scale from low-cost normal/bump to high-fidelity parallax-style inspection mode.
4. Make the texture/material pipeline resolution-agnostic so future artwork swaps require metadata and assets only, not code edits.
5. Keep relief quality stable at maximum zoom through a texel-density-driven asset strategy rather than assumptions about today's image sizes.
6. Allow free close-up inspection of edges and corners while preserving reset/recovery behaviour and accessibility controls.
7. Use a museum-style lighting composition that is flattering in the default view, glare-aware, and still strong enough to reveal detail during pan/zoom movement.
8. Keep WebGL as the production renderer; keep expensive features behind preset-dependent fallbacks.

### v0.03 Non-Goals

- Do not recolour, relight, sharpen, stylize, or otherwise alter the source picture itself.
- Do not require WebGPU or a native application.
- Do not require per-artwork code changes when assets are replaced.
- Do not require all artworks to ship authored scanned height/roughness/specular maps; the system must degrade gracefully with procedural fallbacks.
- Do not use true displaced geometry/tessellation in production WebGL for the artwork plane.
- Do not create fully unbounded camera movement that can strand the user away from the artwork.

### Current v0.02 Code Facts Driving v0.03

| Area | Current code fact | Why v0.03 must change |
| --- | --- | --- |
| Material gloss | `PaintingMaterial` currently initializes `clearcoat: 0.04`, `specularIntensity: 1.0`, and a custom `uLightGrazingBoost: 0.6` path | The default can still read as glossy/varnished even when the albedo is untouched |
| Relief resolution | `ProceduralTextureFactory` generates `normal`, `detailNormal`, and `height` at 256 px tile sizes | Max-zoom inspection will expose blur/repetition independent of source picture resolution |
| Relief visibility | `high` uses `bumpStrength: 0.012`; `balanced` disables bump entirely | The relief pipeline is active, but too subtle for the requested 3D/parallax feel |
| Asset modularity | `Artwork.textureSet?` already exists, but v0.02 still assumes simple fallback generation keyed to the current art set | Future asset swaps need a fully explicit contract and selection strategy that is resolution-agnostic |
| Pan limits | `GalleryManager.getPanLimits()` uses a conservative `PAN_SAFETY_FACTOR = 0.92` | This prevents true edge/corner inspection when zoomed in |
| Fidelity checks | There is no explicit debug/fidelity lane for comparing albedo-only vs shaded output | The team needs a measurable way to ensure the shader does not change the picture's essence |
| Lighting composition | `gallery-soft` is artistic but currently only loosely defined as a warm upper-left key; there is no explicit 30°-style gallery target or motion-visibility requirement | v0.03 should define default display lighting separately from relief-reveal inspection lighting |

### v0.03 Technical Rendering Architecture

#### 1. Modular artwork surface contract

Extend the existing artwork metadata model so each artwork can be swapped without code changes.

Proposed metadata direction:

- `Artwork.image` remains the required albedo source.
- `Artwork.textureSet?` stays optional but should support arbitrary authored maps when available.
- Add a material-level descriptor such as `surfaceProfile?` / `finish?` / `reliefProfile?` with values like:
  - `matte-canvas`
  - `satin-canvas`
  - `varnished-oil`
  - `paper`
  - `procedural-fallback`
- Add optional physical-scale metadata rather than resolution assumptions:
  - real-world width/height or a display-space density target
  - relief amplitude scalar
  - parallax depth scalar
  - finish category

The runtime must never branch on specific current artwork resolutions. It should branch only on:

- available authored roles;
- active quality preset;
- estimated on-screen texel density;
- chosen surface profile.

#### 2. Resolution-independent asset pipeline

The system should treat source pixel size as an input signal, not a hard dependency.

Planned runtime rules:

- Compute a per-artwork **effective texel density** from:
  - source texture width/height,
  - fitted world-space artwork width/height,
  - renderer pixel ratio,
  - current zoom.
- Use that density to choose the shading path and fallback detail strategy.
- If authored auxiliary maps exist, use them directly.
- If authored maps do not exist, synthesize procedural maps whose size is derived from preset + target texel density, not from current demo assets.
- Procedural fallback maps should be cache-keyed by:
  - artwork id,
  - map role,
  - preset tier,
  - target tile size / octave recipe,
  - surface profile.

This keeps the system correct whether a future artwork is tiny, huge, portrait, ultrawide, low-resolution, or very high-resolution.

#### 3. Shader pipeline ladder

v0.03 should formalize three shading tiers:

| Tier | Preset mapping | Technique |
| --- | --- | --- |
| Tier A | battery | albedo + base normal only; no parallax; no expensive self-shadowing |
| Tier B | balanced | albedo + normal + matte roughness + optional bump/height enhancement; no ray-marched parallax |
| Tier C | high / inspection | albedo + normal + height + detail normal + parallax occlusion mapping style UV shift + light-aware self-shadow approximation |

This keeps the runtime scalable and prevents the high-end inspection path from leaking into battery mode.

### v0.03 Shader / Math-Space Plan

#### Fidelity rules

- Albedo remains immutable source colour in `SRGBColorSpace`.
- Roughness/specular/height/normal/AO/parallax data remain linear.
- No colour grading, tone remapping, saturation boost, or artificial pigment tint is allowed inside the artwork material path.
- Bloom must not be part of the fidelity baseline comparison path.

#### Relief path evolution

The current v0.02 path is:

- base tangent-space normal map
- optional detail-normal blend in tangent space
- optional derivative-based bump perturbation via `dHdxy_fwd()` + `perturbNormalArb()`

The planned v0.03 high/inspection path should add:

1. **Parallax UV offset**
   - derive tangent-space view direction
   - ray-march the height field in tangent space
   - offset the sampling UV before reading albedo/normal/roughness/specular/ao
   - keep the sample count preset-controlled

2. **Self-shadow approximation**
   - derive tangent-space light direction
   - perform a short secondary march or stepped horizon check through the height field
   - return a scalar occlusion/shadow factor for direct light only
   - multiply only the direct-light contribution; do not darken the albedo texture itself

3. **Hybrid fallback**
   - when parallax is disabled, retain the current normal + derivative bump path
   - do not duplicate relief amplitudes across both paths at once; define a single source of truth per preset

#### Math-space requirements

- Detail normal blending must remain in tangent space before TBN application.
- Parallax view and light vectors must be expressed in tangent space.
- Height field convention must be explicitly documented (`0 = recess`, `1 = peak` or equivalent) and used consistently across procedural and authored maps.
- Self-shadow sampling must use the same height convention as the parallax march.
- UV shifts must be clamped or early-aborted to avoid sampling outside safe borders unless the texture role explicitly supports repeat wrapping.

### v0.03 Lighting Composition Strategy

The lighting plan must satisfy two goals at once:

1. **Artistic display lighting** — the artwork should look like a premium museum/gallery presentation, not a technical debug render.
2. **Relief visibility** — the viewer must still perceive brush/canvas/parallax detail, especially while panning and zooming the artwork.

#### Museum-style default lighting target

Based on common gallery-lighting guidance, the default profile should be designed around a **primary key light roughly 30° from vertical** aimed at the artwork center to minimize glare while keeping modelling on the surface. The digital goal is to emulate a high-quality warm-white museum spotlight rather than a flat front-on flood.

Planned artistic target:

- primary key: warm white look approximating **3000–3500 K** museum LED presentation;
- key placement: above and offset laterally, aimed near artwork center at about **30° from vertical**;
- fill/accent: low-energy secondary fill so shadows do not crush dark paint regions;
- glare control: no front-on symmetric specular blast in the normal viewing cone;
- default profile remains tasteful first, technical second.

#### Detail-reveal / movement visibility target

The default light should still be asymmetric enough that surface response changes are visible during pan/zoom motion and close inspection. The viewer must see changing relief cues from:

- parallax UV shift as the view angle changes;
- detail-normal / bump response as the camera moves;
- soft direct-light self-shadow cues under shallow angles.

To guarantee this, v0.03 should explicitly separate two lighting lanes:

- **Display lane (`gallery-soft` successor):** artistic museum-style key + subtle fill, optimized for beauty and stable viewing.
- **Inspection lane (`raking-inspection` successor):** much shallower grazing light, optimized for revealing brush ridges, canvas weave, and self-shadowing.

#### Inspection / raking-light target

For relief inspection, the light should move to a much shallower angle than the default display profile, closer to conservation/documentation-style raking light. This mode should:

- use a low-angle key nearly parallel to the artwork plane;
- reduce ambient fill so micro-shadowing remains visible;
- stay still in reduced-motion mode and normally stay still for reproducible review;
- be exposed through a reviewer/debug toggle, not hidden in code only.

#### Lighting contract implications for implementation

`LightProfile` / `LightingSetup` should evolve from generic presets into a more explicit composition model:

- `displayIntent: 'gallery-display' | 'neutral-review' | 'relief-inspection' | 'dramatic-demo'`
- target key angle semantics (`displayAngleFromVerticalDeg`, `inspectionGrazingAngleDeg` or equivalent)
- clear distinction between key, fill, and accent roles
- motion policy (`none`, `subtle-display-drift`) so animated movement never destroys relief readability
- a review-safe default that keeps the artwork flattering but not flat

#### Online reference summary informing the plan

The lighting targets above are informed by general gallery/museum guidance collected during this session:

- a **~30° display angle** is commonly recommended for paintings to reduce glare and avoid harsh reflected hotspots;
- **warm white 3000–3500 K** lighting is commonly used for paintings in galleries;
- **high CRI (90–95+)** is preferred in real installations for faithful colour rendering;
- **raking light** is used when the goal is to reveal texture, brushwork, impasto, and surface relief rather than provide the most neutral display view.

These references are artistic and planning inputs for the renderer; the WebGL implementation will approximate the visual result rather than simulate fixture hardware properties literally.

### v0.03 Material Response Retuning

The default material target should be matte-first.

Planned code-level changes:

- lower base `clearcoat` toward zero by default;
- lower base `specularIntensity` and reduce or remove global grazing-light amplification from the default path;
- bias procedural roughness into a higher range so low-roughness islands are rare unless authored;
- change procedural specular generation from "varnish pooling by default" to "mostly suppressed unless finish says otherwise";
- add finish-aware presets so `matte-canvas` and `varnished-oil` can diverge without forking shader code.

The visual rule is: default gallery mode must look like rough painted surface, not glossy plastic.

### v0.03 High-Resolution Relief Strategy

The current 256 px fallback maps are not enough for maximum zoom inspection. v0.03 should replace the fixed-size fallback approach with a tiered strategy.

#### Proposed procedural map strategy

- High / inspection tier:
  - base normal tile: 1024 px
  - detail normal tile: 1024–2048 px
  - height tile: 1024 px minimum
  - roughness/specular tile: 512–1024 px
  - multi-octave synthesis for brush ridges + canvas tooth + fine grain
- Balanced tier:
  - lower tile sizes and fewer octaves
  - no self-shadow march
- Battery tier:
  - base normal only or very light relief

#### Proposed synthesis layers

Each procedural fallback should be built from named layers rather than one monolithic noise pass:

- canvas weave layer
- brush ridge layer
- pigment breakup layer
- micro tooth layer
- matte roughness modulation layer
- finish-specific highlight suppression or enhancement layer

That makes the generator more predictable and lets future authored maps replace only selected roles.

### v0.03 Free Inspection Camera Plan

The pan system should move from conservative framing to inspection-first bounds.

#### Current limitation

`GalleryManager.getPanLimits()` keeps a safety margin by multiplying the free pan range by `PAN_SAFETY_FACTOR = 0.92`.

#### Planned model

Replace that with a mathematically explicit inspection range:

- derive visible world width/height from FOV, aspect, and zoom;
- derive artwork half-width/half-height in world space;
- allow the viewport center to move far enough that each artwork edge or corner can be centered or nearly centered;
- use an explicit `inspectionOverscrollWorldUnits` or fractional edge margin rather than a blanket safety factor;
- optionally soften the final clamp with elastic drag feedback, but clamp targets deterministically.

#### Input requirements

- mouse drag, wheel zoom, touch pan/pinch, and keyboard reset must all behave consistently;
- reset remains the recovery path;
- reduced-motion mode must not weaken inspection range.

### v0.03 Proposed Modules / File Responsibilities

| Module area | Planned files | Technical responsibility |
| --- | --- | --- |
| Artwork metadata contract | `src/config/artworks.ts`, `src/materials/PaintingTextureSet.ts` | Define surface profile, authored map roles, physical-scale metadata, finish categories |
| Resolution-aware asset selection | `src/gallery/TextureManager.ts`, `src/utils/texture.ts` | Compute source size, effective texel density, map selection, anisotropy strategy |
| Procedural fallback generator | `src/materials/ProceduralTextureFactory.ts` | Multi-layer, preset-aware, resolution-aware procedural normal/height/roughness/specular generation |
| Material core | `src/materials/PaintingMaterial.ts` | Matte-first defaults, preset ladder, parallax path, self-shadow approximation, fidelity/debug switches |
| Lighting integration | `src/lighting/LightProfile.ts`, `src/lighting/LightingSetup.ts` | Museum-style display composition, inspection/raking light, motion policy, preset-safe intensity ranges |
| Inspection controls | settings/debug UI files | Albedo-only / shaded / inspection mode toggles for QA |
| Camera movement | `src/gallery/GalleryManager.ts`, `src/interaction/ZoomPan.ts`, `src/interaction/TouchInteraction.ts`, `src/interaction/KeyboardNav.ts` | Inspection pan bounds, overscroll behaviour, edge/corner reachability |
| Documentation | `plan.md`, `FINDINGS.md`, `CHANGELOG.md`, `README.md`, `docs/HANDOFF.md` | Keep architecture, findings, and acceptance guidance current |

### v0.03 Resource Ownership / Async Boundaries

- `TextureManager` remains owner of loaded authored textures.
- `ProceduralTextureFactory` remains owner of generated fallback textures.
- `PaintingMaterial` continues to hold references only; it must not dispose shared textures.
- Any new parallax/self-shadow path must not trigger async shader races during rapid artwork switches.
- Existing `artworkLoadToken` race protection in `GalleryManager.showArtwork()` must remain the guardrail for future auxiliary-map selection.
- Cache invalidation must include preset tier and surface profile so switching presets does not reuse an incompatible procedural map.

### Browser / API Stability Boundaries

- Production target remains Three.js WebGL in the current preview pipeline.
- The parallax/self-shadow implementation should be done with `onBeforeCompile` / shader chunk replacement or a dedicated `ShaderMaterial` only if native material extension becomes insufficient.
- Any debug-only visualizer or inspector must not load during normal `file://` preview use unless explicitly enabled.
- WebGPU remains experimental and unrelated to v0.03 acceptance.

### v0.03 Vertical Slices

1. **Slice 1 — Surface contract and fidelity instrumentation**
   - Extend artwork/material metadata with surface profile and optional physical-scale fields.
   - Add albedo-only vs shaded comparison mode.
   - Acceptance: future artwork swaps require metadata/assets only, not code edits.

2. **Slice 2 — Matte-first material retune**
   - Lower clearcoat/specular/grazing defaults.
   - Rework roughness/specular generation around matte-first behaviour.
   - Acceptance: default gallery no longer reads as shiny.

3. **Slice 3 — Resolution-aware procedural fallback system**
   - Replace fixed 256 px fallback assumptions with preset-aware target tile sizes and layered synthesis.
   - Acceptance: relief quality no longer depends on the current artwork set.

4. **Slice 4 — High preset parallax relief path**
   - Add tangent-space parallax occlusion style UV offset and consistent height convention.
   - Acceptance: artwork gains clear 3D surface feel from view-angle change without changing the albedo identity.

5. **Slice 5 — Direct-light self-shadow approximation**
   - Add short light-direction march / horizon test for parallax relief.
   - Acceptance: raking light shows relief and self-shadow cues in inspection mode.

6. **Slice 6 — Museum-style display lighting and inspection controls**
   - Retune the default profile around an explicit gallery-style key/fill composition.
   - Ensure the default light remains flattering while pan/zoom motion still reveals relief cues.
   - Expose raking light and fidelity toggles in a safe UI/debug lane.
   - Acceptance: reviewers can validate fidelity, artistic display quality, relief visibility, and gloss behaviour reproducibly.

7. **Slice 7 — Free edge/corner inspection camera**
   - Replace conservative pan clamp with explicit inspection bounds.
   - Acceptance: every edge and corner is reachable at maximum zoom.

8. **Slice 8 — Preset/performance hardening**
   - Tune sample counts, map sizes, and fallbacks for high/balanced/battery.
   - Acceptance: high gives best visuals, balanced stays practical, battery stays safe.

9. **Slice 9 — Documentation and validation handoff**
   - Update all markdown docs and validation records.
   - Acceptance: reviewers have concrete technical checks and known limitations.

### v0.03 Performance Budgets

| Preset | Allowed techniques | Budget guidance |
| --- | --- | --- |
| High / inspection | parallax UV march, self-shadow approximation, large procedural maps, multi-octave detail | highest GPU cost; acceptable on modern discrete GPUs only |
| Balanced | no self-shadow march, no heavy parallax; retain normal + bump + matte roughness | default customer preset target; protect 60 FPS on mid-range discrete GPUs |
| Battery | albedo + simple normal only, low-cost lighting response | preserve low-end GPU compatibility and thermals |

### v0.03 Acceptance Checks

- [ ] Albedo-only comparison confirms the shader does not change the original picture's essence.
- [ ] Default material reads matte/rough, not glossy.
- [ ] Relief responds to both light angle and view angle.
- [ ] Default display lighting feels museum-like and artistic rather than purely technical.
- [ ] Default display lighting is positioned so surface cues remain visible during pan/zoom movement.
- [ ] High/inspection preset delivers visible parallax-style depth.
- [ ] Self-shadow cues appear under raking light without crushing the artwork.
- [ ] Relief quality remains stable at maximum zoom.
- [ ] The system behaves correctly for arbitrary artwork aspect ratios and arbitrary source resolutions.
- [ ] Swapping in future artwork assets requires metadata/assets only, not code edits.
- [ ] Every edge and corner is reachable during close inspection.
- [ ] Reduced-motion mode keeps inspection lighting still.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes and preview output is inspected.
- [ ] Texture-memory cost and preset-specific fallbacks are documented in `FINDINGS.md`.

### v0.03 Known Risks / Reserved Future Boundaries

- Parallax occlusion mapping sample counts can become too expensive on integrated GPUs if not tier-gated aggressively.
- Self-shadow marching can create shimmer or aliasing if height maps are too noisy or if step counts are too low.
- Excessive UV offset near artwork borders can reveal invalid samples unless border policy is explicit.
- If authored assets arrive with inconsistent height conventions, relief can invert unless the contract is explicit.
- True displacement/geometry tessellation remains out of scope for the current WebGL production path.

---

## v0.02 Scope — Advanced Painting Material Shaders & Experimental WebGPU

### v0.02 Implementation Status (this session)

All v0.02 slices are now implemented in source. The implementation deliberately follows the audited plan rather than the first draft, and prefers native Three.js features over hand-written GLSL whenever Three.js already does the work correctly.

| Slice | Status | Notes |
| --- | --- | --- |
| 1 — Texture Set Metadata Contract | ✅ Implemented | `PaintingTextureSet.ts`, `Artwork.textureSet?`, extended `QualityPreset`, role-aware `TextureManager.loadForRole` / `preloadTextureSet` |
| 2 — Procedural Painting Map Generator | ✅ Implemented | `ProceduralTextureFactory` generates albedo / normal / detailNormal / height / roughness / specular / AO maps, deterministic per `artwork.id` |
| 3 — PaintingMaterial WebGL Prototype | ✅ Implemented | `PaintingMaterial extends MeshPhysicalMaterial`; albedo, normal, roughness, specular, AO use **native** Three.js features (no shader patching needed) |
| 4 — Detail Normal + Bump Refinement | ✅ Implemented | `onBeforeCompile` patches `normal_fragment_maps` for tangent-space blend; explicit `perturbNormalArb` after-pass for bump while normalMap is active; `#define`-gated |
| 5 — Realistic Gallery Light Profiles | ✅ Implemented | `LightProfile.ts` with four profiles; `kelvinToColor` Tanner-Helland approximation; `LightingSetup` reuses Three.js light objects across profile switches |
| 6 — Frame Budget Monitor | ✅ Implemented | `FrameBudgetMonitor` with rolling 60-frame window, EMA, navigation/preset cooldown |
| 7 — Adaptive Quality Guardrails | ✅ Implemented | `AdaptiveQualityController` — one-way `high → balanced → battery`; cooldown after every downgrade; manual preset change suspends adaptive control for the session |
| 8 — Experimental WebGPU Backend Probe | ✅ Implemented | `RenderBackend.maybeProbeWebGPU` is opt-in (`?backend=webgpu` / `localStorage.freyraum.backend = 'webgpu'`) and loads the copied public module `webgpu-probe.js` only at runtime; the probe returns a serializable result and stays out of the main IIFE preview bundle |
| 9 — Real Texture Asset Integration Pass | ⏸ Deferred | No real scanned/authored asset set is available in this repository. The `Artwork.textureSet?` field is in place; adding authored files and referencing them is the only remaining step and requires no code changes |
| 10 — v0.02 Documentation, Review, and Handoff | ✅ Implemented | `plan.md`, `CHANGELOG.md`, `FINDINGS.md`, `README.md`, and `docs/HANDOFF.md` all updated in this pass |

### v0.02 Implementation Deviations From The Audited Plan

1. **`FrameBudgetMonitor` location:** placed in `src/utils/FrameBudgetMonitor.ts` (next to `AdaptiveQualityController.ts`) instead of `src/performance/`. Pure organisational choice; behaviour is identical.
2. **`MaterialInspector` dev overlay:** not implemented as a separate file. The frame-budget data is exposed via `monitor.readSnapshot()` so a future debug HUD can be added without runtime changes. Reason: the production path never needs it, and the audited rule "must never be requested during normal preview use" is easier to enforce by not shipping the module at all.
3. **Bump path:** uses Three.js' native `bumpMap` + `bumpScale = 1.0` so the `dHdxy_fwd()` / `perturbNormalArb()` helpers are declared. We then call `perturbNormalArb` ourselves with `uBumpStrength * dHdxy_fwd()` after `normal_fragment_maps` so both `normalMap` and the height term coexist (the native chunk only applies one or the other). This is the audited correct approach.
4. **AO path:** uses Three.js' native `aoMap` + `aoMapIntensity`. `PlaneGeometry` does not have `uv1` by default, so `ArtworkMesh.makeArtworkGeometry` copies `uv` into `uv1` after creation (Three.js ≥ 0.152 reads aoMap from uv1).
5. **`PAINTING_USE_ROUGHNESS_MAP` and `PAINTING_USE_SPECULAR_MAP` defines:** not needed at the GLSL level because Three.js itself compiles roughness/specular paths in/out based on `material.roughnessMap` / `material.specularIntensityMap` being set. The plan's intent (compile-out for battery) is achieved by not assigning those maps when the preset disables them.
6. **WebGPU probe loading:** the first implementation attempt used a source-level TS dynamic import, but the file-based customer preview is built as a single IIFE. The corrected implementation moves the probe to `public/webgpu-probe.js` and imports it by runtime URL only when the user opts in, which keeps the probe code out of the main preview bundle.
7. **Preset transition hardening:** `GalleryManager.applyPreset()` now rebuilds the current artwork immediately so `battery` mode truly removes optional map work on the active painting, and `main.ts` uses an explicit `adaptiveQualityWriteInFlight` guard so the controller does not suspend itself on its own downgrade.

### v0.02 Aspect-Ratio Robustness — How The Implementation Stays Correct For Every Format

The user requirement is that the gallery works "with every aspect ratio and resolution of all kinds of formats of the picture". Concretely:

| Concern | Where it is handled | Behaviour |
| --- | --- | --- |
| Image dimensions arrive at any aspect ratio | `getTextureSize` in `src/utils/texture.ts` reads `naturalWidth/naturalHeight` first, falling back to `width/height` for `ImageBitmap`/data textures | Portrait, landscape, square, ultrawide, and procedural data textures all yield a finite, non-zero aspect |
| Artwork mesh and frame resize per artwork | `ArtworkMesh.updateAspect` calls `fitWithinBox(aspect, 4.2, 5.8)` and scales both the artwork plane and the frame box | Maintains a uniform `0.4` world-unit frame margin on both axes regardless of aspect |
| Detail-normal tiling must stay square in physical units | `ArtworkMesh.setPaintingTextures` derives `tiling = new Vector2(width × density, height × density)` and passes it to `PaintingMaterial.applyTextures`, which loads it into the `uDetailTiling` uniform | Canvas weave appears at uniform real-world density on portrait, square, landscape, and ultrawide artworks. A 7:3 ultrawide does NOT show stretched weave |
| Camera pan limits must adapt to aspect | Existing `GalleryManager.getPanLimits` derives world-space visible dimensions from camera FOV and aspect | Untouched in v0.02 — already correct for any aspect |
| Side panels must not distort previews | Existing `SidePanels.updatePanelScale` calls `fitWithinBox` per panel | Untouched in v0.02 |
| Minimum zoom safety for portrait artworks | Existing `GalleryManager.getMinZoom` already accounts for both dimensions and FOV | Untouched in v0.02 |
| Anisotropic filtering caps per preset | `TextureManager.setAnisotropyDivisor` divides the GPU's max anisotropy by the preset divisor (1 / 2 / 4) and reapplies the new cap to cached textures immediately | Tilted-view sharpness preserved on high/balanced; reduced on battery without needing a fresh load |

The four shipped artwork formats exercise every relevant case:

- `electric-storm`: 2400 × 1600 landscape (3:2)
- `quiet-coastline`: 1800 × 2400 portrait (3:4)
- `tokyo-passage`: 2100 × 2100 square (1:1)
- `golden-desert`: 2800 × 1200 ultrawide (7:3)

### v0.02 Validation Outcomes (this session)

- `npm run lint` — clean.
- `npm run build` — clean. Preview output: `freyraum-gallery.js` 546.50 kB / gzip 139.68 kB, `style.css` 15.36 kB / gzip 3.42 kB, `webgpu-probe.js` 2.32 kB. The increase covers the new painting material, procedural factory, light profiles, frame-budget monitor, adaptive controller, and render-backend selector.
- The WebGPU probe code is no longer part of the main IIFE bundle. The main preview script contains only a runtime `import(new URL('./webgpu-probe.js', window.location.href).toString())` call; the probe implementation itself lives in the copied public module and is requested only when the user opts in.

---

### v0.02 Mission

v0.02 makes the artworks read as **realistic physical paintings** — not flat images on a plane. Close-up inspection must reveal woven canvas fibres, brush ridges, pigment thickness, and light-dependent highlights. The rendering pipeline must sustain **60 FPS on mid-range discrete GPUs** (balanced preset) and **at least 25 FPS on old integrated GPUs** (battery preset), all inside the browser with no native apps or server-side GPU work.

### v0.02 Non-Goals

- Do not replace Three.js as the production renderer.
- Do not make WebGPU mandatory; WebGL must remain the customer-demo path.
- Do not add a CMS or remote asset service.
- Do not add new npm dependencies unless strictly required and security-checked first.
- Do not ship texture assets without documenting their source, format, and regeneration path.

### v0.02 Final Audit — Corrections Applied To This Plan

This plan was re-audited after the first technical pass. The following issues were found and corrected so implementation can proceed professionally and with fewer rework risks:

- **Shader-space correction:** the first draft described detail-normal blending as if a tangent-space normal could be added directly to a view-space normal. That is not safe. The audited plan now requires tangent-space blending before the Three.js TBN/view-space transform.
- **Bump correction:** the first draft used a simplified `dFdx/dFdy` perturbation example that was too approximate for a normative plan. The audited plan now requires reusing the same perturbation path/pattern that Three.js uses for bump/normal handling instead of adding raw derivatives directly to the final normal.
- **Specular-scope correction:** the first draft assumed `specularColor` was always available at the chosen injection point. The audited plan now treats specular-map modulation as a chunk-verified step and explicitly allows a fallback to roughness + clearcoat first if scope differs in Three.js `0.166.x`.
- **Browser-API stability correction:** the first draft used exact WebGPU DOM types in the public contract. The audited plan now requires a stable serializable probe result shape so TypeScript/lib.dom drift does not block implementation.
- **Build-output wording correction:** the first draft claimed the debug overlay would "never be bundled". With Vite dynamic imports, the correct guarantee is that the debug overlay must never be eagerly imported or requested unless the debug flag is present.
- **Execution guardrail correction:** the first draft did not explicitly cover async artwork-load races, texture ownership, or disposal boundaries. The audited plan now adds strict lifecycle rules so rapid navigation and preset changes do not produce stale map application or texture leaks.

---

### v0.02 Codebase Baseline

The following is the exact state of every file that v0.02 must build on. Future implementors must read these files before touching anything.

**`src/materials/CanvasMaterial.ts`**
- Currently generates a single 128×128 sinusoidal normal map (canvas weave only).
- `loadNormalTexture()` is `async` but the result is cached after the first call.
- Applied to `artworkMaterial` in `ArtworkMesh` via `.normalMap` / `.normalScale.set(0.12, 0.12)`.
- No detail normal, no bump, no specular map, no roughness map, no AO map exist yet.
- The class is the primary v0.02 extension point — it becomes or is replaced by `PaintingMaterial`.

**`src/gallery/ArtworkMesh.ts`**
- Creates a `THREE.MeshPhysicalMaterial` inline with `roughness: 0.88`, `metalness: 0`, `clearcoat: 0.04`.
- The only map wired today is the normal map loaded from `CanvasMaterial`.
- `applyPreset(preset)` only rebuilds geometry when `artworkSegments` changes.
- All other material properties are static after construction.
- The inline `MeshPhysicalMaterial` must be replaced by the new `PaintingMaterial` factory.

**`src/gallery/TextureManager.ts`**
- Uses a single `THREE.TextureLoader` and caches by URL string.
- **Critical issue:** `prepareTexture()` sets `colorSpace = THREE.SRGBColorSpace` for every texture.
  Normal, detail-normal, height, roughness, specular, and AO maps must use `THREE.LinearSRGBColorSpace` (or `THREE.NoColorSpace` for data textures in Three.js 0.166). Only albedo maps should use `SRGBColorSpace`.
- Anisotropy is always set to `maxAnisotropy`. v0.02 must cap this per preset.
- There is no role awareness (albedo vs. non-albedo) — this must be added.

**`src/lighting/LightingSetup.ts`**
- Single `AmbientLight(0xffffff, 1.5)`, `SpotLight(0xffffff, 150)`, and `PointLight(0xffffff, 8, 30)`.
- The spotlight oscillates `position.x` by `Math.sin(time * 0.0002) * 0.6` — very slow, correct.
- `applyPreset` only toggles `castShadow`. Angle, colour, and intensity are hardcoded.
- A `LightProfile` system must be added without breaking current behaviour.

**`src/config/quality.ts`**
- `QualityPreset` fields today: `id`, `label`, `description`, `pixelRatioCap`, `bloomStrength`, `bloomRadius`, `bloomThreshold`, `shadows`, `artworkSegments`.
- v0.02 must add shader-level fields to this interface — see §TypeScript Contract below.

**`src/config/artworks.ts`**
- `Artwork` interface fields today: `id`, `title`, `subtitle`, `description`, `year`, `medium`, `image`, `dimensions`, `alt`, `credit`, `tags`.
- `image` is currently a data-URI SVG. v0.02 adds an optional `textureSet` field alongside `image`.

**`src/main.ts`**
- The animation loop is a plain `requestAnimationFrame` calling `lightingSetup.update(now)`, `galleryManager.update()`, `postProcessing.render()`.
- `FrameBudgetMonitor` must be wired here to receive `now` timestamps.
- Preferences subscription already calls `applyPreset` on all subsystems — any new material system must follow the same pattern.

---

### v0.02 TypeScript Contract

All new types must be defined before implementation begins. These are the normative type definitions.

#### Addition to `src/config/artworks.ts`

```typescript
// ─── New types added at the top of artworks.ts ───────────────────────────────

export type TextureColorSpace = 'srgb' | 'linear' | 'none';

export interface PaintingTextureMapEntry {
  /** Path relative to /public or a data URI for offline preview. */
  url: string;
  /** `srgb` for albedo, `linear` for most grayscale/normal data, `none` when Three.js data-texture handling should bypass color transforms entirely. */
  colorSpace: TextureColorSpace;
  /** Native pixel dimensions — used for mip budget calculations. */
  resolution?: { width: number; height: number };
}

export interface PaintingTextureSet {
  /** Overrides artwork.image when present. Color space: sRGB. */
  albedo?: PaintingTextureMapEntry;
  /** Tangent-space canvas/brush normal. Color space: linear. */
  normal?: PaintingTextureMapEntry;
  /** High-frequency weave + grain detail normal. Color space: linear. Tiled. */
  detailNormal?: PaintingTextureMapEntry;
  /** Grayscale R-channel bump/height relief. Color space: linear. */
  height?: PaintingTextureMapEntry;
  /** Grayscale R-channel roughness variation. Color space: linear. */
  roughness?: PaintingTextureMapEntry;
  /** Grayscale R-channel specular variation. Color space: linear. */
  specular?: PaintingTextureMapEntry;
  /** Grayscale R-channel ambient occlusion. Color space: linear. */
  ao?: PaintingTextureMapEntry;
  /** UV repeat factor for detailNormal. Default 18. */
  detailTiling?: number;
  /** Per-artwork overrides for shader uniforms (override quality defaults). */
  normalStrengthOverride?: number;
  detailNormalStrengthOverride?: number;
  bumpStrengthOverride?: number;
}

// ─── Extended Artwork interface ───────────────────────────────────────────────

export interface Artwork {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  year: number;
  medium: string;
  image: string;
  dimensions: ArtworkDimensions;
  alt: string;
  credit: string;
  tags: readonly string[];
  /** Optional painting texture set. When absent, procedural fallback maps are used. */
  textureSet?: PaintingTextureSet;
}
```

#### Additions to `src/config/quality.ts`

```typescript
// ─── New fields added to QualityPreset interface ──────────────────────────────

export interface QualityPreset {
  // (all existing fields kept unchanged)
  id: QualityPresetId;
  label: string;
  description: string;
  pixelRatioCap: number;
  bloomStrength: number;
  bloomRadius: number;
  bloomThreshold: number;
  shadows: boolean;
  artworkSegments: number;

  // ─── v0.02 additions ──────────────────────────────────────────────────────
  /** Shader variant compiled into the painting material for this preset. */
  shaderVariant: 'painting-high' | 'painting-balanced' | 'painting-battery';
  /** Base canvas/brush normal strength (uCanvasNormalStrength). */
  normalStrength: number;
  /** Detail normal blend weight (uDetailNormalStrength). 0 disables detail normal entirely. */
  detailNormalStrength: number;
  /** Bump perturbation scale (uBumpStrength). 0 disables bump. */
  bumpStrength: number;
  /** Specular map boost scale (uSpecularStrength). */
  specularStrength: number;
  /** Anisotropy divisor: actual anisotropy = maxAnisotropy / divisor. */
  anisotropyDivisor: number;
  /** Enable ambient-occlusion map lookup. Battery always false. */
  aoEnabled: boolean;
  /** Enable grazing-light enhancement. Battery always false. */
  grazingBoostEnabled: boolean;
  /** Enable detail normal map. Battery always false. */
  detailNormalEnabled: boolean;
}

// ─── Updated QUALITY_PRESETS values ──────────────────────────────────────────

high: {
  // ... existing fields ...
  shaderVariant: 'painting-high',
  normalStrength: 0.45,
  detailNormalStrength: 0.28,
  bumpStrength: 0.14,
  specularStrength: 0.12,
  anisotropyDivisor: 1,
  aoEnabled: true,
  grazingBoostEnabled: true,
  detailNormalEnabled: true,
},
balanced: {
  // ... existing fields ...
  shaderVariant: 'painting-balanced',
  normalStrength: 0.32,
  detailNormalStrength: 0.18,
  bumpStrength: 0.06,
  specularStrength: 0.08,
  anisotropyDivisor: 2,
  aoEnabled: false,
  grazingBoostEnabled: false,
  detailNormalEnabled: true,
},
battery: {
  // ... existing fields ...
  shaderVariant: 'painting-battery',
  normalStrength: 0.16,
  detailNormalStrength: 0.0,
  bumpStrength: 0.0,
  specularStrength: 0.03,
  anisotropyDivisor: 4,
  aoEnabled: false,
  grazingBoostEnabled: false,
  detailNormalEnabled: false,
},
```

#### New file `src/materials/PaintingTextureSet.ts`

Re-exports `PaintingTextureSet` and `PaintingTextureMapEntry` from `artworks.ts` plus adds a typed map-role enum so `TextureManager` and `PaintingMaterial` share the same vocabulary:

```typescript
export type PaintingMapRole =
  | 'albedo'
  | 'normal'
  | 'detailNormal'
  | 'height'
  | 'roughness'
  | 'specular'
  | 'ao';

export { PaintingTextureSet, PaintingTextureMapEntry } from '../config/artworks';
```

#### New file `src/materials/PaintingMaterial.ts`

```typescript
import * as THREE from 'three';
import type { QualityPreset } from '../config/quality';
import type { PaintingTextureSet } from './PaintingTextureSet';

export interface PaintingMaterialParams {
  preset: QualityPreset;
  textureSet: ResolvedPaintingTextures;  // see below
  reducedMotion?: boolean;
}

/** Resolved textures after loading; null means map absent/procedural. */
export interface ResolvedPaintingTextures {
  albedo: THREE.Texture | null;
  normal: THREE.Texture | null;
  detailNormal: THREE.Texture | null;
  height: THREE.Texture | null;
  roughness: THREE.Texture | null;
  specular: THREE.Texture | null;
  ao: THREE.Texture | null;
}

export type PaintingMaterialUniforms = {
  uCanvasNormalStrength: THREE.IUniform<number>;
  uDetailNormalStrength: THREE.IUniform<number>;
  uBumpStrength: THREE.IUniform<number>;
  uSpecularStrength: THREE.IUniform<number>;
  uRoughnessFloor: THREE.IUniform<number>;
  uRoughnessCeiling: THREE.IUniform<number>;
  uVarnishStrength: THREE.IUniform<number>;
  uDetailTiling: THREE.IUniform<number>;
  uLightGrazingBoost: THREE.IUniform<number>;
  uCloseInspectionMix: THREE.IUniform<number>;
  uReducedMotionScalar: THREE.IUniform<number>;
  tDetailNormal: THREE.IUniform<THREE.Texture | null>;
  tHeight: THREE.IUniform<THREE.Texture | null>;
  tRoughness: THREE.IUniform<THREE.Texture | null>;
  tSpecular: THREE.IUniform<THREE.Texture | null>;
  tAO: THREE.IUniform<THREE.Texture | null>;
};

export class PaintingMaterial extends THREE.MeshPhysicalMaterial {
  readonly paintingUniforms: PaintingMaterialUniforms;
  private _variant: string;

  constructor(params: PaintingMaterialParams) { /* ... */ }
  applyPreset(preset: QualityPreset): void { /* ... */ }
  applyTextures(textures: ResolvedPaintingTextures): void { /* ... */ }
  setReducedMotion(value: boolean): void { /* ... */ }
  setDetailTiling(tiling: number): void { /* ... */ }
}
```

`PaintingMaterial` extends `THREE.MeshPhysicalMaterial` and injects shader code in `onBeforeCompile`. See §Shader Implementation Plan for the exact GLSL.

#### Changes to `src/gallery/ArtworkMesh.ts`

- Replace `private readonly artworkMaterial: THREE.MeshPhysicalMaterial` with `private artworkMaterial: PaintingMaterial`.
- Replace the inline `new THREE.MeshPhysicalMaterial(...)` constructor call with `new PaintingMaterial(...)`.
- Add `setMaps(textures: ResolvedPaintingTextures): void` public method that calls `artworkMaterial.applyTextures(textures)`.
- `applyPreset` must also call `this.artworkMaterial.applyPreset(preset)`.
- Remove the `CanvasMaterial` dependency once `PaintingMaterial` subsumes it.

#### Changes to `src/gallery/TextureManager.ts`

- Add `loadForRole(url: string, role: PaintingMapRole): Promise<THREE.Texture>`.
- `loadForRole` sets `colorSpace` based on role: `albedo` → `THREE.SRGBColorSpace`; all others → `THREE.LinearSRGBColorSpace`.
- Cap `texture.anisotropy = Math.ceil(this.maxAnisotropy / anisotropyDivisor)` where `anisotropyDivisor` is passed from the active preset.
- Add `preloadTextureSet(set: PaintingTextureSet, divisor: number): Promise<ResolvedPaintingTextures>` which calls `loadForRole` for every defined entry and returns a `ResolvedPaintingTextures` object.
- Keep `preload(urls)` and `load(url)` unchanged for backward compatibility.
- Keep the fallback `createFallbackTexture` for the albedo role.

#### Changes to `src/gallery/GalleryManager.ts`

- Accept `PaintingTextureManager` (or extended `TextureManager`) in the constructor.
- In `showArtwork(index)`, after loading the albedo, call `textureManager.preloadTextureSet(artwork.textureSet ?? {})` and pass the result to `artworkMesh.setMaps(resolvedTextures)`.
- `init()` stays the same public API; internally it will now also trigger map preloading.

#### New file `src/lighting/LightProfile.ts`

```typescript
export type LightProfileId =
  | 'gallery-soft'
  | 'raking-inspection'
  | 'museum-neutral'
  | 'dramatic-demo';

export interface LightProfile {
  id: LightProfileId;
  label: string;
  /** SpotLight position [x, y, z] */
  spotPosition: [number, number, number];
  /** SpotLight angle in radians */
  spotAngle: number;
  /** SpotLight penumbra 0–1 */
  spotPenumbra: number;
  /** SpotLight intensity */
  spotIntensity: number;
  /** AmbientLight intensity */
  ambientIntensity: number;
  /** Colour temperature in Kelvin (converted to THREE.Color on load) */
  colorTemperatureK: number;
  /** X-axis oscillation amplitude (0 = static; respect reduced-motion) */
  motionAmplitude: number;
  /** Oscillation angular frequency (radians per millisecond) */
  motionFrequency: number;
}

export const LIGHT_PROFILES: Record<LightProfileId, LightProfile> = {
  'gallery-soft': {
    id: 'gallery-soft',
    label: 'Galerie',
    spotPosition: [-10, 5, 7],
    spotAngle: 0.42,
    spotPenumbra: 0.9,
    spotIntensity: 150,
    ambientIntensity: 1.5,
    colorTemperatureK: 4200,
    motionAmplitude: 0.6,
    motionFrequency: 0.0002,
  },
  'raking-inspection': {
    id: 'raking-inspection',
    label: 'Streiflicht',
    spotPosition: [-14, 1, 5],
    spotAngle: 0.22,
    spotPenumbra: 0.5,
    spotIntensity: 280,
    ambientIntensity: 0.6,
    colorTemperatureK: 5600,
    motionAmplitude: 0.0,
    motionFrequency: 0.0,
  },
  'museum-neutral': {
    id: 'museum-neutral',
    label: 'Museumsneutral',
    spotPosition: [0, 8, 8],
    spotAngle: 0.55,
    spotPenumbra: 0.95,
    spotIntensity: 100,
    ambientIntensity: 2.2,
    colorTemperatureK: 3200,
    motionAmplitude: 0.0,
    motionFrequency: 0.0,
  },
  'dramatic-demo': {
    id: 'dramatic-demo',
    label: 'Dramatisch',
    spotPosition: [-8, 4, 6],
    spotAngle: 0.35,
    spotPenumbra: 0.7,
    spotIntensity: 220,
    ambientIntensity: 0.9,
    colorTemperatureK: 4800,
    motionAmplitude: 1.2,
    motionFrequency: 0.0003,
  },
};
```

#### Changes to `src/lighting/LightingSetup.ts`

- Add `private activeProfile: LightProfile` field, default `gallery-soft`.
- Add `setProfile(id: LightProfileId): void` — applies the profile to spotlight position, angle, penumbra, intensity, and ambient intensity.
- `update(time)` uses `activeProfile.motionAmplitude` and `activeProfile.motionFrequency` so static profiles do not oscillate.
- A helper `kelvinToColor(K: number): THREE.Color` converts colour temperature (using the McCamy or Krystek approximation) to an `RGB` `THREE.Color`.
- `applyPreset` continues to toggle `castShadow` and does not change the profile.

#### New file `src/materials/ProceduralTextureFactory.ts`

Generates deterministic fallback maps using `HTMLCanvasElement` + `CanvasRenderingContext2D`. All maps are generated synchronously to keep startup simple; they are cached by `artworkId + role`.

Maps generated per call:

| Role | Resolution | Algorithm |
| --- | --- | --- |
| `normal` | 256 × 256 | Warp-domain sinusoidal weave + FBM-like layering using `sin(x * 0.42 + offset) * sin(y * 0.38)` with 3 octaves; pack into RG (tangent-space XY, B = 255). |
| `detailNormal` | 256 × 256 | Higher frequency weave (0.8–1.2 Hz range), 4 octaves; independent UV scale so it tiles at 18× and blends subtly at gallery distance. |
| `height` | 256 × 256 | Layered brush-stroke height: dominant strokes from `Math.abs(sin(y * 0.12 + hash * 0.8)) * 90`; secondary cross-strokes; final value packed to R grayscale 0–255. |
| `roughness` | 128 × 128 | Low-frequency Perlin-like noise (simulated with `sin(x*0.09)*cos(y*0.07)` layered 2 octaves) remapped to [60, 220] range to represent dry-paint (rough) to lightly varnished (smooth) variation. |
| `specular` | 128 × 128 | Very low frequency, very subtle — mostly uniform at 12/255 with sparse high-value pixels representing thick varnished pigment. Gaussian blob centered at a hash-determined position. |
| `ao` | 128 × 128 | Not procedurally generated; returns a flat 128/255 grey fallback so the AO uniform has no effect until a real map is supplied. |

```typescript
export class ProceduralTextureFactory {
  private readonly cache = new Map<string, THREE.Texture>();

  generate(artworkId: string, role: PaintingMapRole): THREE.Texture;
  disposeAll(): void;
  private getCacheKey(artworkId: string, role: PaintingMapRole): string;
  private buildNormal(id: string): THREE.Texture;
  private buildDetailNormal(id: string): THREE.Texture;
  private buildHeight(id: string): THREE.Texture;
  private buildRoughness(id: string): THREE.Texture;
  private buildSpecular(id: string): THREE.Texture;
  private buildAOFallback(): THREE.Texture;
  private hash(value: string): number;  // same djb2-style hash as TextureManager
}
```

#### New file `src/rendering/RenderBackend.ts`

Thin abstraction that `main.ts` uses to decide whether to initialise `WebGLRenderer` (default) or the experimental WebGPU path.

```typescript
export type BackendId = 'webgl' | 'webgpu-experimental';

export interface RenderBackendInfo {
  backendId: BackendId;
  adapterLabel?: string;
  unsupportedReason?: string;
}

export async function detectBackend(): Promise<BackendId>;
export async function getBackendInfo(): Promise<RenderBackendInfo>;
```

`detectBackend()` reads `?backend=webgpu` query param or `localStorage.getItem('freyraum.backend')` and only returns `'webgpu-experimental'` when both the flag is set AND `navigator.gpu !== undefined`. Otherwise it always returns `'webgl'`.

#### New runtime module `public/webgpu-probe.js`

Runtime-import target so unsupported browsers never parse the module and the
main `file://` IIFE preview bundle never contains the probe implementation.

```typescript
/**
 * @experimental — never imported by the production WebGL path.
 * Imported only via runtime import when backend === 'webgpu-experimental'.
 */
export async function initWebGPUPrototype(): Promise<WebGPUProbeResult>;

export interface SerializedGPUAdapterInfo {
  vendor?: string;
  architecture?: string;
  device?: string;
  description?: string;
}

export interface WebGPUProbeResult {
  supported: boolean;
  adapterInfo?: SerializedGPUAdapterInfo;
  /** Plain-object limits snapshot so the result is loggable and stable across DOM lib versions. */
  limits?: Record<string, number>;
  unsupportedFeatures: string[];
  frameTimingMs?: number;  // filled after one test frame
  fallbackToWebGL: boolean;
}
```

This module uses `navigator.gpu.requestAdapter()`, requests a device, renders one test frame to an offscreen canvas, and returns metrics. Any exception sets `fallbackToWebGL: true`. The caller in `main.ts` falls back to the normal `RendererManager` path if `fallbackToWebGL` is true.

#### New file `src/performance/FrameBudgetMonitor.ts`

```typescript
export type FpsWindowKey = '1s' | '5s' | '30s';

export interface FrameSample {
  timestamp: number;    // performance.now()
  frameDeltaMs: number; // elapsed since previous sample
}

export class FrameBudgetMonitor {
  /** Call once per animation frame with the rAF timestamp. */
  tick(now: number): void;

  /** Rolling FPS for the given window. Returns 0 if window is not yet full. */
  getFps(window: FpsWindowKey): number;

  /**
   * Fires cb when rolling 5s FPS drops below threshold for at least
   * minConsecutiveDropMs without being interrupted by navigation events.
   */
  onSlowFrames(threshold: number, minConsecutiveDropMs: number, cb: () => void): () => void;

  /** Marks a navigation event — resets slow-frame accumulator to avoid spurious downgrades. */
  markNavigation(): void;

  /** Returns a summary string for the dev overlay. */
  summary(): string;
}
```

The monitor is created in `main.ts` and `tick(now)` is called at the top of the `animate` loop. Its `onSlowFrames` callback is wired to `PreferencesStore.setQuality` only after the `FrameBudgetMonitor` returns data for a full 5s window, preventing spurious downgrades during startup.

#### New file `src/debug/MaterialInspector.ts`

```typescript
/**
 * Development-only overlay.
 * Only constructed when the URL contains '?debug=material'.
 * Never eagerly imported during the normal customer preview path.
 */
export class MaterialInspector {
  constructor(
    app: HTMLElement,
    artworkMesh: ArtworkMesh,
    lightingSetup: LightingSetup,
    frameBudget: FrameBudgetMonitor
  );

  dispose(): void;
}
```

Renders an absolutely positioned panel showing: active preset, shader variant, active map list, FPS (all three windows), pixel ratio, anisotropy cap, and buttons to toggle each texture map individually. It must never be eagerly imported; Vite may still emit a separate async chunk, but that chunk must not be requested unless `?debug=material` is present.

#### Changes to `src/main.ts`

```typescript
// 1. Before RendererManager construction — detect backend:
const backendId = await detectBackend();
if (backendId === 'webgpu-experimental') {
  const probeUrl = new URL('./webgpu-probe.js', window.location.href).toString();
  const { initWebGPUPrototype } = await import(/* @vite-ignore */ probeUrl);
  const result = await initWebGPUPrototype();
  if (!result.fallbackToWebGL) {
    // future: hand off to WebGPU full path
    console.info('[WebGPU] probe result:', result);
  }
  // for now always continue with WebGL; the probe is informational only
}

// 2. Create FrameBudgetMonitor after renderer:
const frameBudget = new FrameBudgetMonitor();

// 3. In animate loop — add tick at the top:
const animate = (now: number): void => {
  rafId = requestAnimationFrame(animate);
  frameBudget.tick(now);          // <-- new
  lightingSetup.update(now);
  galleryManager.update();
  postProcessing.render();
};

// 4. Adaptive quality — wired after a full 5s window:
frameBudget.onSlowFrames(28, 6000, () => {
  const current = preferences.current.quality;
  if (current === 'high')        preferences.setQuality('balanced');
  else if (current === 'balanced') preferences.setQuality('battery');
  // battery already at floor — no further downgrade
});

// 5. MaterialInspector — dev only:
if (new URLSearchParams(location.search).get('debug') === 'material') {
  const { MaterialInspector } = await import('./debug/MaterialInspector');
  new MaterialInspector(app, artworkMesh, lightingSetup, frameBudget);
}
```

### v0.02 Lifecycle, Loading, and Disposal Guardrails

These guardrails are mandatory because the current gallery is interactive, async, and texture-heavy.

#### Async artwork-load race handling

`GalleryManager` must keep an incrementing `artworkLoadToken` (number). Every call to `showArtwork(index)` captures the current token before starting async map loads. When map loading resolves, the code must compare the captured token against the latest token and discard stale results.

Implementation rule:

```typescript
private artworkLoadToken = 0;

private async showArtwork(index: number): Promise<void> {
  const token = ++this.artworkLoadToken;
  // start albedo + texture-set load here
  const textures = await this.textureManager.preloadTextureSet(...);
  if (token !== this.artworkLoadToken) return; // stale navigation result
  this.artworkMesh.setMaps(textures);
}
```

This is required so rapid navigation cannot apply a previous artwork's auxiliary maps to the currently visible artwork.

#### Texture ownership and disposal boundaries

Ownership must stay explicit:

- `TextureManager` owns network-loaded textures and is solely responsible for disposing them.
- `ProceduralTextureFactory` owns generated fallback textures and is solely responsible for disposing them.
- `PaintingMaterial` may reference textures but must not dispose shared textures on `applyTextures()` or `dispose()`.
- `ArtworkMesh.dispose()` disposes geometry and material only.
- Swapping presets or artworks must never dispose textures still held by caches.

#### Fallback precedence

Fallback order must be deterministic:

1. authored map from `artwork.textureSet`
2. procedural fallback from `ProceduralTextureFactory`
3. neutral flat/no-op data texture when the role should exist but generation fails
4. hard-disable the shader path via `#define` when the role is optional and no safe fallback exists

#### Adaptive-quality safety rules

- Automatic downgrades may only occur after a full 5-second sample window exists.
- Automatic downgrades must pause for a cooldown window after manual preset changes.
- Manual preset selection must override automatic downgrade for the current session until the page reloads or the user explicitly re-enables auto mode.

#### Release-blocking lifecycle checks

v0.02 is not releasable if any of the following remain unresolved:

- stale auxiliary maps appear after rapid artwork navigation
- repeated artwork switching increases GPU memory without stabilising
- preset switching recompiles shaders every frame instead of only on preset changes
- reduced-motion mode still animates highlight drift or inspection-only light movement

---

### v0.02 Shader Implementation Plan

This section is the normative reference for `PaintingMaterial.onBeforeCompile`. All GLSL is for Three.js `0.166.x` chunk names — verify chunk names against `node_modules/three/src/renderers/shaders/ShaderChunk/` before coding.

#### Inject point strategy

Three.js `MeshPhysicalMaterial` fragment shader includes these chunks in order (relevant subset):

```
#include <map_fragment>            — samples albedo (map)
#include <roughnessmap_fragment>   — samples roughnessMap, sets roughnessFactor
#include <metalnessmap_fragment>   — samples metalnessMap, sets metalnessFactor
#include <normal_fragment_begin>   — declares 'normal' from geometry data
#include <normal_fragment_maps>    — applies normalMap (sets normal in view space)
#include <clearcoat_normal_fragment_maps>
#include <emissivemap_fragment>
#include <lights_physical_fragment> — PBR lighting integration
#include <aomap_fragment>          — applies aoMap, multiplies diffuse colour
```

Our injections use `shader.fragmentShader = shader.fragmentShader.replace(...)`.

#### Uniform declarations (injected into fragmentShader before first `#include`)

```glsl
uniform float uCanvasNormalStrength;
uniform float uDetailNormalStrength;
uniform float uBumpStrength;
uniform float uSpecularStrength;
uniform float uRoughnessFloor;
uniform float uRoughnessCeiling;
uniform float uVarnishStrength;
uniform float uDetailTiling;
uniform float uLightGrazingBoost;
uniform float uCloseInspectionMix;
uniform float uReducedMotionScalar;
uniform sampler2D tDetailNormal;
uniform sampler2D tHeight;
uniform sampler2D tRoughness;
uniform sampler2D tSpecular;
uniform sampler2D tAO;
```

All injected via `shader.uniforms = { ...THREE.UniformsUtils.clone(shader.uniforms), ...this.paintingUniforms }`.

#### Injection 1 — Roughness override and audited specular-map rule

```glsl
// ─── PAINTING: roughness map override ───────────────────────────────────────
#ifdef PAINTING_USE_ROUGHNESS_MAP
  float paintRoughSample = texture2D(tRoughness, vMapUv).r;
  roughnessFactor = mix(uRoughnessFloor, uRoughnessCeiling, paintRoughSample);
#endif
```

**Audited rule for specular modulation:** do not hard-code a `specularColor` write at an unverified injection point.

Implementation decision order:

1. Prefer native `MeshPhysicalMaterial` support if `specularIntensityMap` / `specularColorMap` can be used directly in Three.js `0.166.x` without patching.
2. If native support is insufficient, patch specular response only after verifying the exact variable scope inside `lights_physical_fragment`.
3. If scope is unclear or unstable during Slice 3, ship roughness + clearcoat first and defer specular-map modulation to Slice 4/5 rather than forcing an unsafe shader patch.

This keeps the plan realistic and avoids baking a fragile chunk-scope assumption into the implementation contract.

#### Injection 2 — Audited normal-path integration for detail normal and height

**Audited correction:** do not add tangent-space detail normals or raw height derivatives directly to the already transformed view-space `normal`.

Required implementation strategy:

1. Replace or wrap the `normal_fragment_maps` path rather than patching only after it.
2. Sample the base normal map and detail-normal map in tangent space.
3. Blend them in tangent space using RNM/whiteout-style blending.
4. Feed the blended tangent normal through the same TBN/view-space transform path that Three.js already uses for `MeshPhysicalMaterial`.
5. If a height/bump map is present, apply it through the same perturbation helper/pattern that Three.js uses for bump handling so derivatives are interpreted in the correct space.

Reference pseudocode:

```text
base tangent normal  = unpack(normalMap)
detail tangent normal = unpack(tDetailNormal)
blended tangent normal = RNM(base, detail * uDetailNormalStrength * uReducedMotionScalar)
final normal = Three.js normal-map transform(blended tangent normal)
height perturbation = Three.js-compatible bump perturbation using sampled height derivatives
```

Implementation note on accessibility: `uReducedMotionScalar` may reduce the contribution of detail normal or animated grazing-light effects, but it must not silently corrupt the normal basis. Reduced motion is a strength scalar, not a different normal-space path.

#### Injection 3 — After `#include <aomap_fragment>`: custom AO and grazing-light boost

```glsl
// ─── PAINTING: custom AO map ─────────────────────────────────────────────────
#ifdef PAINTING_USE_AO
  float paintAO = texture2D(tAO, vMapUv).r;
  reflectedLight.indirectDiffuse *= paintAO;
#endif

// ─── PAINTING: grazing-light boost ──────────────────────────────────────────
#ifdef PAINTING_USE_GRAZING_BOOST
  // NdotV — angle between view and normal.
  // A grazing angle (near 90°) should show more surface texture catch-light.
  float NdotV = abs(dot(normal, normalize(vViewPosition)));
  float grazingMask = pow(1.0 - NdotV, 3.0);  // stronger at near-90°
  reflectedLight.directSpecular *= (1.0 + grazingMask * uLightGrazingBoost);
#endif
```

#### Compile-time `#define` strategy

`onBeforeCompile` sets `#define` flags based on the active preset and available maps, then prepends them to the fragment shader:

```typescript
const defines: string[] = [];
if (preset.detailNormalEnabled && textures.detailNormal) defines.push('#define PAINTING_USE_DETAIL_NORMAL');
if (preset.bumpStrength > 0 && textures.height)          defines.push('#define PAINTING_USE_BUMP');
if (textures.roughness)                                   defines.push('#define PAINTING_USE_ROUGHNESS_MAP');
if (textures.specular)                                    defines.push('#define PAINTING_USE_SPECULAR_MAP');
if (preset.aoEnabled && textures.ao)                      defines.push('#define PAINTING_USE_AO');
if (preset.grazingBoostEnabled)                           defines.push('#define PAINTING_USE_GRAZING_BOOST');

shader.fragmentShader = defines.join('\n') + '\n' + shader.fragmentShader;
```

This ensures battery mode never executes expensive texture reads for detail/bump/AO even when the maps exist in memory.

**Important:** changing defines requires `material.needsUpdate = true` and may trigger a full shader recompile. Only call `applyPreset` when the preset actually changes. Cache the last applied variant id.

---

### v0.02 Procedural Map Generation — Detail Specification

`ProceduralTextureFactory` replaces the current 128×128 normal map in `CanvasMaterial` with five higher-quality maps.

#### Normal map (256 × 256, wrapS/wrapT = RepeatWrapping, repeat = 4 × 4)

```typescript
// Pseudo-code — implementation may vary; visual result matters more than exact formula.
for (let y = 0; y < 256; y++) {
  for (let x = 0; x < 256; x++) {
    const h = this.hash(artworkId);
    const offset = (h % 100) / 100.0;
    const oct1 = Math.sin(x * 0.42 + offset) * Math.cos(y * 0.38) * 14;
    const oct2 = Math.sin(x * 0.19 + offset * 2) * Math.cos(y * 0.22) * 6;
    const weave = Math.sin((x + y) * 0.11) * 3;
    const v = oct1 + oct2 + weave;
    R[i] = clamp(128 + v, 0, 255);
    G[i] = clamp(128 - v, 0, 255);
    B[i] = 255;
  }
}
```

Result maps to a tangent-space normal (0,0,1) at rest with subtle XY variation that catches raking light.

#### Detail normal map (256 × 256, wrapS/wrapT = RepeatWrapping, repeat = 18 × 18)

Higher frequency than base normal — represents individual canvas threads.

```typescript
// 4 octaves of fine weave noise; repeat tiling chosen so threads are ~2 px wide
// at normal viewing distance, giving canvas-tooth appearance.
const oct1 = Math.sin(x * 1.1) * Math.cos(y * 0.9) * 18;
const oct2 = Math.sin(x * 2.3 + 0.7) * Math.cos(y * 2.1) * 7;
const oct3 = Math.cos(x * 4.1) * Math.sin(y * 3.8) * 2.5;
const oct4 = Math.sin((x - y) * 5.5) * 1.0;
```

#### Height / bump map (256 × 256, repeat = 4 × 4)

Grayscale R channel:

```typescript
// Dominant horizontal brush strokes
const stroke = Math.abs(Math.sin(y * 0.12 + (hash % 64) * 0.05)) * 80;
// Secondary cross-hatch
const cross = Math.abs(Math.sin(x * 0.09 + (hash % 32) * 0.07)) * 30;
// Canvas tooth grain
const tooth = Math.sin(x * 1.4) * Math.sin(y * 1.6) * 12;
const h = clamp(stroke + cross + tooth, 0, 255);
```

#### Roughness map (128 × 128, repeat = 6 × 6)

Low-frequency Perlin-like variation between [60, 220] (0 = perfectly smooth, 255 = fully rough):

```typescript
// 2-octave smooth noise; low frequency so it reads as varnish pooling
const n1 = (Math.sin(x * 0.09) * Math.cos(y * 0.07)) * 0.5 + 0.5;
const n2 = (Math.sin(x * 0.21 + 1.3) * Math.cos(y * 0.18 + 0.7)) * 0.5 + 0.5;
const combined = n1 * 0.7 + n2 * 0.3;
R[i] = Math.round(60 + combined * 160);
```

#### Specular map (128 × 128, repeat = 6 × 6)

Mostly dark (no specular), sparse bright pixels:

```typescript
// Baseline near-zero: 12 / 255
// Gaussian blobs at hash-determined positions to represent varnish pooling
const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
const blob = Math.exp(-dist * dist / (radius * radius)) * 200;
R[i] = Math.round(Math.min(12 + blob, 255));
```

---

### v0.02 Lighting Model — Full Specification

See `src/lighting/LightProfile.ts` (§TypeScript Contract) for the type definition and four named profiles.

**Colour temperature conversion** — implemented as `kelvinToColor(K): THREE.Color`:

```
T = K / 100
if T <= 66:
  R = 255
  G = 99.4708025861 * ln(T) - 161.1195681661
  B = T <= 19 ? 0 : 138.5177312231 * ln(T - 10) - 305.0447927307
else:
  R = 329.698727446 * (T - 60)^(-0.1332047592)
  G = 288.1221695283 * (T - 60)^(-0.0755148492)
  B = 255
Clamp each channel to [0, 255]; divide by 255 for Three.Color.
```

This gives visually correct warm (3200 K) to cool daylight (6500 K) tints for each profile.

**Profile application in `LightingSetup.setProfile(id)`:**

1. Call `kelvinToColor(profile.colorTemperatureK)` to get the colour.
2. Set `spotlight.color`, `spotlight.position`, `spotlight.angle`, `spotlight.penumbra`, `spotlight.intensity`.
3. Set `ambientLight.intensity`.
4. Store `profile` as `activeProfile`.
5. The `update(time)` method checks `activeProfile.motionAmplitude === 0` to skip oscillation.

---

### v0.02 Experimental WebGPU Strategy

See `src/rendering/RenderBackend.ts` and `public/webgpu-probe.js` in §TypeScript Contract.

Key constraints:
- `detectBackend()` must never call `navigator.gpu.requestAdapter()` — adapter requests can trigger browser permission prompts or errors. The detection is purely `navigator.gpu !== undefined`.
- The actual `requestAdapter()` call lives inside `initWebGPUPrototype()` in `public/webgpu-probe.js`, which is only invoked after the user has explicitly opted in via query param or `localStorage`.
- In v0.02 the WebGPU path is **informational only**: it probes, logs, and falls back to WebGL. No customer-facing work renders through WebGPU in v0.02.
- After the probe result is logged to console, the normal WebGL `RendererManager` boot continues unchanged.

---

### v0.02 Performance Budgets

Frame targets:

| Device class | Target | Required preset |
| --- | --- | --- |
| Mid-range discrete GPU (e.g. GTX 1660, RX 580) | 60 FPS at 1440p | balanced |
| High-end discrete GPU (e.g. RTX 3070, RX 6700) | 60 FPS at 4K capped 1.8 DPR | high |
| Old integrated GPU (e.g. Intel HD 620, Iris 640) | 25 FPS minimum at 1080p | battery |

Texture read budget per fragment:

| Preset | Max texture reads (artwork material) |
| --- | --- |
| high | 7 (albedo + normal + detailNormal + height + roughness + specular + AO) |
| balanced | 5 (albedo + normal + detailNormal + roughness + specular) |
| battery | 2 (albedo + normal only) |

Additional rules:
- Adjacent side-preview artworks load albedo only — no auxiliary maps until the artwork is the active centre piece.
- Timeline thumbnails use albedo only and cap anisotropy at 1.
- `PreferencesStore.setQuality` triggers full `applyPreset` on all subsystems including `PaintingMaterial`. Shader recompile is expected and acceptable on preset change; it must not interrupt the animation loop visibly (use `requestAnimationFrame` timing to defer heavy work when needed).
- Bloom should be disabled or set to `bloomStrength = 0` for high preset when `uSpecularStrength > 0.1` because the specular highlight already provides the sheen effect. This avoids double-brightening varnished areas.

---

### v0.02 Texture Asset Pipeline

File naming convention under `public/assets/artworks/{artworkId}/`:

```
{artworkId}-albedo.webp          — sRGB, full resolution
{artworkId}-normal.webp          — linear, 1024×1024 recommended
{artworkId}-detail-normal.webp   — linear, 512×512 at minimum
{artworkId}-height.webp          — linear grayscale R, 512×512
{artworkId}-roughness.webp       — linear grayscale R, 512×512
{artworkId}-specular.webp        — linear grayscale R, 256×256
{artworkId}-ao.webp              — linear grayscale R, 512×512
```

Loading rules:
- All map loads go through `TextureManager.loadForRole(url, role)`.
- Role determines color space: `albedo → SRGBColorSpace`, all others → `LinearSRGBColorSpace`.
- Anisotropy cap per preset: `maxAnisotropy / anisotropyDivisor`, minimum 1.
- Active artwork: load full preset-appropriate map set.
- Side previews: albedo only.
- Timeline: albedo only, scaled to thumbnail size.
- Fallback: `ProceduralTextureFactory.generate(artworkId, role)` whenever a URL is absent or fails.

---

### v0.02 Validation Matrix

Every implementation slice must finish with an explicit validation pass.

| Validation area | Required check |
| --- | --- |
| Type safety | `npm run build:typecheck` |
| Lint | `npm run lint` |
| Preview build | `npm run build` and confirm `customer-preview/` regenerated |
| Local file preview | open root `index.html` and confirm `customer-preview/app.html` launches correctly |
| Reduced motion | disable motion and confirm light drift / highlight drift / navigation swoop are frozen or reduced as intended |
| High contrast | verify controls remain legible while material realism remains readable |
| Missing maps | verify procedural fallback or compile-time disable path works for every optional map role |
| Rapid navigation | navigate quickly across all artworks and confirm no stale map application |
| Preset switching | switch high ↔ balanced ↔ battery and confirm one-time shader recompile only on actual preset changes |
| Memory stability | run repeated navigation / preset switching and confirm textures/materials stabilise without visible leaks |
| WebGPU probe | `?backend=webgpu` logs probe info and returns cleanly to WebGL on failure |

Release note rule: every slice must append its validation outcome to `FINDINGS.md`, including failures, mitigations, and remaining risks.

---

### v0.02 Vertical Slices

#### Slice 1 — Texture Set Metadata Contract

Goal: extend `Artwork` and `QualityPreset` with v0.02 fields so TypeScript catches invalid usage before any shader code is written.

Files changed:
- `src/config/artworks.ts` — add `PaintingTextureMapEntry`, `PaintingTextureSet`, extend `Artwork` with `textureSet?`.
- `src/materials/PaintingTextureSet.ts` — new; re-export and add `PaintingMapRole`.
- `src/config/quality.ts` — add `shaderVariant`, `normalStrength`, `detailNormalStrength`, `bumpStrength`, `specularStrength`, `anisotropyDivisor`, `aoEnabled`, `grazingBoostEnabled`, `detailNormalEnabled` to `QualityPreset`; update all three preset objects.
- `src/gallery/TextureManager.ts` — add `loadForRole(url, role)` and `preloadTextureSet(set, divisor)`.

Acceptance checks:
- `npm run build` clean with zero new TypeScript errors.
- All four existing artwork entries in `artworks.ts` continue to work (no `textureSet` required).
- `loadForRole` correctly sets `LinearSRGBColorSpace` for a `'normal'` role and `SRGBColorSpace` for `'albedo'`.

#### Slice 2 — Procedural Painting Map Generator

Goal: create believable fallback maps so the material shader can be developed and reviewed before final scanned assets exist.

Files changed:
- `src/materials/ProceduralTextureFactory.ts` — new; implements all five map generators from §Procedural Map Generation.

Acceptance checks:
- Calling `factory.generate('electric-storm', 'normal')` twice returns the cached instance.
- Close-up inspection in `npm run dev` reveals canvas tooth and brush relief in the normal map.
- Battery preset skips detail normal generation (factory still creates it; the caller simply does not pass it to `PaintingMaterial`).
- Maps disposed cleanly via `disposeAll()`.

#### Slice 3 — PaintingMaterial WebGL Prototype

Goal: replace inline `MeshPhysicalMaterial` in `ArtworkMesh` with `PaintingMaterial`, wiring albedo, base-normal, roughness, and specular maps first.

Files changed:
- `src/materials/PaintingMaterial.ts` — new; full class with `onBeforeCompile`, uniforms, and `applyPreset`.
- `src/gallery/ArtworkMesh.ts` — replace inline material, add `setMaps(textures)` and `applyPreset` delegation.
- `src/gallery/GalleryManager.ts` — call `textureManager.preloadTextureSet` in `showArtwork`; pass result to `artworkMesh.setMaps`.
- `src/materials/CanvasMaterial.ts` — deprecate; functionality moved into `ProceduralTextureFactory` and `PaintingMaterial`.

Acceptance checks:
- Lighting visibly responds to base normal map under raking inspection light.
- Roughness map variation visible under directional light.
- No regression in zoom, pan, aspect ratio, or timeline navigation.
- `npm run lint` and `npm run build` clean.

#### Slice 4 — Detail Normal + Bump Height Refinement

Goal: make close-up inspection reveal canvas tooth and brush relief.

Files changed:
- `src/materials/PaintingMaterial.ts` — add `PAINTING_USE_DETAIL_NORMAL` and `PAINTING_USE_BUMP` injection points from §Shader Implementation Plan.
- `src/gallery/ArtworkMesh.ts` — pass `detailNormal` and `height` textures from `ResolvedPaintingTextures`.

Acceptance checks:
- Zoomed-in view shows canvas fibre detail not present at gallery distance.
- Battery preset produces measurably fewer texture reads (verify by commenting out detail defines and checking FPS in dev tools).
- `uReducedMotionScalar` set to 0 flattens the detail normal blend — confirm by toggling reduced-motion in preferences.

#### Slice 5 — Realistic Gallery Light Profiles

Goal: make the material relief visible through physically correct light direction and intensity.

Files changed:
- `src/lighting/LightProfile.ts` — new; `LightProfileId`, `LightProfile`, `LIGHT_PROFILES`, `kelvinToColor`.
- `src/lighting/LightingSetup.ts` — add `setProfile(id)`, update `update(time)` to use `activeProfile.motionAmplitude`, call `kelvinToColor`.

Acceptance checks:
- `raking-inspection` profile clearly reveals bump and normal relief.
- `museum-neutral` flattens highlights and shows true colour.
- All profiles respect `setAnimated(false)` for reduced-motion mode.
- No regression in shadow toggle from `applyPreset`.

#### Slice 6 — Frame Budget Monitor + Dev Overlay

Goal: make the 60/25 FPS targets measurable before adding adaptive quality.

Files changed:
- `src/performance/FrameBudgetMonitor.ts` — new; rolling FPS windows, `onSlowFrames`, `markNavigation`, `summary`.
- `src/debug/MaterialInspector.ts` — new; dev overlay (only when `?debug=material` is present).
- `src/main.ts` — wire `frameBudget.tick(now)` in the animation loop; conditional `MaterialInspector` construction.

Acceptance checks:
- `frameBudget.getFps('5s')` returns a reasonable FPS after 5 seconds of animation.
- Dev overlay visible with `?debug=material` query param.
- Overlay code is lazy-requested only with `?debug=material`; its async chunk may exist in the build output but must never be fetched during normal customer preview use.

#### Slice 7 — Adaptive Quality Guardrails

Goal: protect weaker GPUs from falling and staying below 25 FPS without requiring manual intervention.

Files changed:
- `src/main.ts` — wire `frameBudget.onSlowFrames(28, 6000, downgradeQuality)` after the FPS window fills.
- `src/performance/FrameBudgetMonitor.ts` — add `markNavigation()` to reset slow-frame accumulator.
- `src/gallery/GalleryManager.ts` — call `frameBudget.markNavigation()` in `navigate()` and `goTo()`.

Acceptance checks:
- Sustained < 28 FPS for 6 seconds triggers a quality downgrade.
- Downgrade from balanced → battery does not reset artwork, zoom, pan, fullscreen, or accessibility state.
- Manual quality selection in `PreferencesPanel` disables automatic downgrade for the current session (set a `manualOverride` flag in `PreferencesStore`).

#### Slice 8 — Experimental WebGPU Backend Probe

Goal: introduce the WebGPU probe without touching the production WebGL path.

Files changed:
- `src/rendering/RenderBackend.ts` — new; `detectBackend`, `getBackendInfo`.
- `public/webgpu-probe.js` — new runtime-only experimental module; `initWebGPUPrototype`, `WebGPUProbeResult`.
- `src/main.ts` — add backend detection before `RendererManager` construction; conditional dynamic import.

Acceptance checks:
- Without `?backend=webgpu`, `detectBackend()` always returns `'webgl'` regardless of browser support.
- With `?backend=webgpu` on a supporting browser, probe runs and logs adapter info to console.
- Any WebGPU failure falls back to the normal WebGL boot — no blank screen, no broken UI.
- `npm run build` customer preview keeps the probe implementation out of `freyraum-gallery.js`; only the runtime import of `webgpu-probe.js` remains in the main bundle.

#### Slice 9 — Real Texture Asset Integration Pass

Goal: integrate one complete real or authored texture set and compare it against procedural fallbacks.

Files changed:
- `public/assets/artworks/electric-storm/` — add one artwork's texture set (albedo, normal, height, roughness, specular; AO optional).
- `src/config/artworks.ts` — add `textureSet` field to the `electric-storm` artwork entry pointing to the new files.

Acceptance checks:
- Authored normal/height maps produce visibly more realistic paint relief than procedural fallbacks under raking light.
- Preview build remains local and offline safe (all assets are in `public/`).
- File sizes documented in `FINDINGS.md` with compression decisions.

#### Slice 10 — v0.02 Documentation, Review, and Handoff

Goal: make all shader and WebGPU decisions reviewable and reproducible for future contributors.

Files changed:
- `docs/HANDOFF.md` — add shader controls, benchmark procedure, light profile descriptions, WebGPU probe instructions.
- `docs/assets/architecture.svg` — extend with v0.02 material system, light profiles, FrameBudgetMonitor, and WebGPU probe paths.
- `plan.md` — mark each slice as implemented and add per-slice findings.
- `FINDINGS.md` — add per-slice benchmark and visual notes.
- `CHANGELOG.md` — add v0.02 dated entry.

Acceptance checks:
- A future contributor can understand the full material, lighting, and WebGPU pipeline from docs alone.
- Customer-facing handoff clearly marks WebGL as stable and WebGPU as experimental.

---

### v0.02 Risk Register

| Risk | Why it matters | Mitigation in this plan | Acceptable fallback |
| --- | --- | --- | --- |
| Tangent/view-space mix-up in shader patching | Produces incorrect highlights, shimmering, and unstable close-up detail | Blend base + detail normals in tangent space before Three.js transforms them | Ship base normal + roughness first; defer detail normal until verified |
| Specular patch variable-scope mismatch | Can fail compilation or silently alter the wrong lighting term | Verify chunk scope in Three.js `0.166.x` before custom patching | Ship roughness + clearcoat only in Slice 3 |
| Async artwork-load race | Rapid navigation can apply stale auxiliary maps to the wrong artwork | `artworkLoadToken` guard in `GalleryManager.showArtwork()` | Cancel outdated results and keep only albedo for that frame |
| GPU memory creep from cached/generated textures | Long sessions may degrade performance or crash weaker GPUs | Explicit ownership boundaries and disposal rules | Disable optional maps / clear caches on preset downgrade |
| Asset weight explosion | Authored map stacks can make local preview too heavy | Load auxiliary maps only for active artwork; document file sizes in `FINDINGS.md` | Keep procedural fallback for some roles/artworks |
| WebGPU browser/API instability | Probe path can fail differently across browsers and DOM lib versions | Keep probe informational and serializable; dynamic import only on opt-in | Fall back to WebGL silently with dev log |
| Debug-tool production leakage | Debug overlay may accidentally affect normal preview sessions | Lazy request by query flag only; no eager import side effects | Ship without MaterialInspector if bundling semantics become messy |

---

### Recommended v0.02 Execution Order

1. Slice 1 — Texture Set Metadata Contract *(TypeScript foundation; all later slices depend on it)*
2. Slice 2 — Procedural Painting Map Generator *(enables shader development without real assets)*
3. Slice 3 — PaintingMaterial WebGL Prototype *(first visual result; validates shader injection approach)*
4. Slice 5 — Realistic Gallery Light Profiles *(needed to see the material working; low risk)*
5. Slice 4 — Detail Normal + Bump Refinement *(builds on Slice 3; requires good lighting to evaluate)*
6. Slice 6 — Frame Budget Monitor + Dev Overlay *(measure before guardrails)*
7. Slice 7 — Adaptive Quality Guardrails *(depends on Slice 6 data)*
8. Slice 8 — Experimental WebGPU Backend Probe *(isolated; can run in parallel after Slice 3)*
9. Slice 9 — Real Texture Asset Integration Pass *(requires full material stack from Slice 4)*
10. Slice 10 — Documentation, Review, and Handoff

---

### v0.02 Acceptance Summary

v0.02 is complete when:

- Realistic painting texture is visible in close-up: canvas tooth, brush relief, roughness variation, and specular catch-light all respond to the active light profile.
- `raking-inspection` profile clearly reveals surface detail not visible under `gallery-soft`.
- Balanced preset sustains 60 FPS on a mid-range discrete GPU test machine (documented with device + browser + OS in `FINDINGS.md`).
- Battery preset sustains at least 25 FPS on an old integrated GPU test machine (same documentation requirement).
- Rapid artwork navigation cannot apply stale auxiliary maps from a previously selected artwork.
- Repeated navigation + preset switching does not create visible texture/material leaks during a manual dev session.
- WebGPU probe runs, logs adapter info, and falls back to WebGL on unsupported browsers without UI breakage.
- All markdown files updated: `CHANGELOG.md`, `FINDINGS.md`, `README.md`, `docs/HANDOFF.md`, `plan.md`.


## Reserved Future Pass After v0.01

- content management integration
- multilingual content pipeline
- audio narration and accessibility audio layer
- analytics and multi-gallery support
- WebGPU production renderer parity and VR path after the v0.02 experimental probe

## Verification Notes

- In this audit session, `npm run lint` passed after `npm install`, with the known `@typescript-eslint` warning about TypeScript `5.9.3` not being officially supported by the current parser range.
- In this audit session, `npm run build` passed after `npm install`, and the preview bundle was regenerated successfully.
- The build emitted the current Dart Sass legacy JS API deprecation warning; treat it as a future tooling cleanup item, not a v0.02 blocker.
- Interaction and rendering changes must still be manually tested in both `npm run dev` and by opening root `index.html` locally.
