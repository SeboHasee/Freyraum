# FREYRAUM — Image Maintenance Guide

This guide documents the **current** image workflow, the verified GitHub limits
that affect it, and the planned direction for reliable high-resolution support.

## Current repository behavior

- Customer artwork source files are currently committed in
  `customer-artworks/inbox/`.
- `scripts/import-artworks.mjs` copies accepted images into
  `customer-preview/images/`.
- The importer also embeds the exact original bytes into
  `window.__FREYRAUM_ARTWORKS[*].webglImage` as a base64 data URL so the local
  `file://` preview can upload textures to WebGL reliably.
- `scripts/sync-customer-public.mjs` copies the generated preview assets into
  `public/` for the Vite/GitHub Pages build.
- GitHub Pages CI runs `npm run import:artworks` before `npm run build`.

## Why very large originals are not reliable today

The current workflow sends the source image files through GitHub itself, so the
platform limits apply directly:

- **25 MiB** maximum per file when uploading in the GitHub browser UI
- **50 MiB** Git warning threshold
- **100 MiB** Git hard block
- **1 GB** maximum published GitHub Pages site size
- **Git LFS cannot be used for GitHub Pages site assets**

There is also a repository-specific scaling problem: the importer currently
duplicates large image bytes across the tracked source file, generated image
copies, and a base64-expanded JavaScript payload. A single large artwork can
therefore consume much more than its original file size across the working and
deploy pipeline.

## Current safe operating rule

Until the planned high-resolution workflow ships:

1. Keep the full archival/master images **outside this repository**.
2. Put only **GitHub-safe publish copies** into `customer-artworks/inbox/`.
3. If a non-technical operator may publish through the GitHub web UI, treat
   **25 MiB per committed file** as the practical maximum.
4. Use the importer warnings as the first compatibility check:
   - above **4096 px** longest side → older phones may downscale
   - above **8192 px** → high-memory / desktop-oriented territory
   - above **16384 px** → not reliable for WebGL at all

## Reliable target architecture (planned)

The active plan in `plan.md` moves FREYRAUM to a safer two-tier model:

- **Masters/originals:** local or separate archive storage, not part of the
  GitHub Pages runtime path
- **Publish bundle:** GitHub-tracked derivatives plus compact metadata only
- **Local preview fallback:** if `webglImage` is retained, keep it local-only so
  the deployed Pages manifest does not carry full-size image bytes
- **Budget gates:** enforce per-file and total-site size limits before publish

## Maintainer checklist

- Verify whether the operator is trying to publish a master/original file or a
  web-safe derivative.
- Check `customer-artworks/last-import-report.txt` for 4K/8K/16K warnings.
- If GitHub upload or deployment fails, check the offending file size before
  debugging the runtime.
- If you change the image workflow, update:
  - `plan.md`
  - `FINDINGS.md`
  - `README.md`
  - `docs/CUSTOMER_PICTURE_GUIDE.md`
  - `docs/DEPLOYMENT.md`
  - `docs/HANDOFF.md`

## Sources

- Repository files:
  - `scripts/import-artworks.mjs`
  - `scripts/sync-customer-public.mjs`
  - `.github/workflows/deploy-pages.yml`
- Official GitHub docs:
  - https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
  - https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage
  - https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

## Related docs

- `docs/CUSTOMER_PICTURE_GUIDE.md`
- `docs/CUSTOMER_TEXT_GUIDE.md`
- `docs/DEPLOYMENT.md`
- `plan.md`
- `FINDINGS.md`
