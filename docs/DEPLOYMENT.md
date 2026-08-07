# FREYRAUM — GitHub Pages Deployment Guide

This document describes the full operator flow for publishing the gallery to
GitHub Pages at **https://sebohasee.github.io/Freyraum/**.

## One-time repository setup

In the GitHub repository go to **Settings → Pages → Source** and choose
**GitHub Actions**. No branch source is required; the workflow uploads and
deploys the build artifact directly.

---

## Operator flow (end-to-end)

### 1 — Place customer assets

| Asset type | Folder |
|---|---|
| Artwork images (`.jpg`, `.png`, `.webp`, etc.) | `customer-artworks/inbox/` |
| Artwork text sidecars (`.txt`, same basename as the image) | `customer-artworks/inbox/` |
| Background audio (`.mp3`, `.ogg`, `.m4a`, `.wav`) | `customer-audio/inbox/` |

Detailed format requirements are in
[`docs/CUSTOMER_PICTURE_GUIDE.md`](./CUSTOMER_PICTURE_GUIDE.md) and
[`docs/CUSTOMER_TEXT_GUIDE.md`](./CUSTOMER_TEXT_GUIDE.md).

### 2 — Run the importer locally (optional but recommended)

```bash
npm install          # first time only
npm run import:artworks
```

This does exactly what `Update Gallery.bat` / `Update Gallery.command` does,
and additionally syncs the generated output to `public/` so a local
`npm run build` or `npm run dev` includes your assets. The same sync copies the
committed museum backgrounds from `customer-artworks/Backgrounds/` to
`public/backgrounds/` (`museum-target.png` is excluded — it is a calibration
reference asset, not a shipped runtime background).

Open `customer-preview/app.html` to verify the local preview looks correct
before publishing.

> **Note:** `Update Gallery.bat` / `Update Gallery.command` still works for the
> local file-based preview. Use `npm run import:artworks` when you want to
> validate the exact output that CI will build.

### 3 — Commit the inbox files

```bash
git add customer-artworks/inbox/ customer-audio/inbox/
git commit -m "chore: update customer artworks"
git push origin main
```

Commit both the image/audio files **and** any `.txt` sidecar files.
The generated files (`artworks.json`, `customer-artworks.js`, `public/images/`,
etc.) are gitignored and rebuilt by CI every time.

> **Current high-resolution limitation:** this workflow still commits the source
> artwork files themselves. GitHub browser uploads are limited to **25 MiB** per
> file, regular Git blocks files above **100 MiB**, GitHub Pages sites may be no
> larger than **1 GB**, and Git LFS cannot be used for Pages site assets. Until
> the active plan in `plan.md` ships, keep archival masters outside this repo and
> only commit GitHub-safe publish copies.

### 4 — Publishing happens automatically

Pushing to `main` triggers the `Deploy to GitHub Pages` workflow
(`.github/workflows/deploy-pages.yml`), which:

1. Runs `npm run import:artworks` — identical to the local desktop step.
2. Runs `npm run build` — Vite bundles the app with `base: '/Freyraum/'`.
3. Validates that `dist/index.html`, the generated manifests, and both museum
   backgrounds exist.
4. Deploys `dist/` to GitHub Pages.

The live gallery is updated within ~2 minutes of a successful push.

---

## What CI validates before deploying

| Check | Failure message |
|---|---|
| `customer-artworks/inbox` folder exists | `customer-artworks/inbox is missing` |
| `customer-audio/inbox` folder exists | `customer-audio/inbox is missing` |
| Importer generates `public/customer-artworks.js` | `public/customer-artworks.js was not generated` |
| Importer generates `public/customer-audio.js` | `public/customer-audio.js was not generated` |
| Inbox images produce manifest entries | `N image(s) found in inbox but manifest has 0 entries` |
| All manifest images present in `dist/images/` | `images … absent from dist/images/` |
| Audio sources linked → `dist/audio/` non-empty | `dist/audio/ is empty or missing` |
| Build produces `dist/index.html` | `dist/index.html is missing` |
| Hub room background reaches `dist/backgrounds/` (and `museum-target.png` stays excluded) | `dist/backgrounds/… is missing` |

Each successful workflow run also writes a **CI diagnostic summary** to the
job summary page (visible on the Actions run page) with:

- Number of inbox image files found
- Number of artworks imported into the manifest
- Number of inbox audio files found
- Number of audio sources linked
- Sample IDs of the first 5 imported artworks

---

## Verification checklist (post-deploy)

After the workflow completes:

- [ ] Root URL loads: **https://sebohasee.github.io/Freyraum/**
- [ ] At least one custom artwork image is visible in the gallery.
- [ ] At least one intended customer painting—not a grey generated fallback—is
      visible in both the interactive gallery and museum hub.
- [ ] Artwork title/description text (from `.txt` sidecar) is shown.
- [ ] Background audio plays (if audio files were committed).
- [ ] Museum hub loads and its artwork hotspots align with the visible works.
- [ ] Browser console shows no 404 errors for `customer-artworks.js`, artwork
      images, or museum backgrounds.

### If an artwork is grey after deployment

1. Record whether the symptom is in the interactive gallery (generated
   FREYRAUM-style fallback) or the museum hub (title-bearing placeholder).
2. Download or preserve the exact deployed `customer-artworks.js` and matching
   `images/` directory before rerunning the importer.
3. Open the same deployed URL with `?debug=verbose&hubDebug=1`, export
   diagnostics, and save Network/console evidence for the failed artwork.
4. Confirm the published image request resolves under `/Freyraum/images/` and
   returns an image with a non-zero decoded size. Do not try to compensate by
   changing lighting, material, or customer metadata.
5. Follow the route-aware recovery process in `plan.md § v0.91`; it covers
   missing/stale bundles, relative-path resolution, fallback payloads, CORS,
   decode deadlines, and texture-size limits.

---

## File ownership summary

| File / folder | Owned by | Committed? |
|---|---|---|
| `customer-artworks/inbox/*.jpg` etc. | Customer (operator) | ✅ Yes |
| `customer-artworks/inbox/*.txt` | Customer (operator) | ✅ Yes |
| `customer-audio/inbox/*.mp3` etc. | Customer (operator) | ✅ Yes |
| `customer-artworks/Backgrounds/*.png` | Hub visual source | ✅ Yes |
| `customer-artworks/artworks.json` | Importer (generated) | ❌ No |
| `customer-preview/images/` | Importer (generated) | ❌ No |
| `customer-preview/backgrounds/` | Vite copy (generated) | ❌ No |
| `customer-preview/customer-artworks.js` | Importer (generated) | ❌ No |
| `public/images/` | Sync script (generated) | ❌ No |
| `public/backgrounds/` | Sync script (generated) | ❌ No |
| `public/customer-artworks.js` | Sync script (generated) | ❌ No |
| `dist/` | Vite build (generated) | ❌ No |

Because the committed customer sources currently live in `customer-artworks/inbox/`,
this deployment model inherits GitHub’s file-size limits directly. The active
high-resolution roadmap is documented in `plan.md` and summarised for operators
in `docs/IMAGE_MAINTENANCE_GUIDE.md`.

---

## Root cause of pre-v0.75 missing assets

Before v0.75 the deployment workflow skipped `npm run import:artworks`.
Because `public/customer-artworks.js` was never generated, Vite had no
customer data to bundle, and `window.__FREYRAUM_ARTWORKS` was never set in the
deployed HTML — so the runtime fell back silently to the built-in placeholder
artworks. In addition, `customer-artworks/inbox/*` was gitignored, so customer
files could not be committed to the repository at all.

Both gaps are fixed in v0.75: inbox files are no longer gitignored, the
importer runs as a mandatory CI step, and `app.html` now loads the customer
injection scripts before the main module.
