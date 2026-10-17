# FREYRAUM Plan
> Latest markdown audit: 2026-10-17 (v1.40 merge-readiness audit).

Active engineering work only. Release history: `CHANGELOG.md`. Finished plans:
`docs/archive/plan-history-2026-10-17.md` (v0.74–v1.40) and
`docs/archive/plan-history-2026-06-21.md` (older).

## Current state (v1.40)

- Gallery and main museum hub (three.js) with rooms of 2 front + 1 left + 1
  right works, built from `customer-artworks/museum-hub.json`.
- Placement editor (`OPEN_ARTWORK_EDITOR.html` → `customer-preview/placement-editor.html`,
  deployed `placement-editor.html`): stable drag on all walls (v1.33), one placement truth
  for editor/loader/3D (v1.34), user-controlled rooms (v1.35), wall resizing
  never stretches artwork (v1.37).
- Three ways to save: online editor → save service (`worker/`, v1.38);
  FREYRAUM Editor desktop app (`desktop/`, v1.39); `file://` download fallback.
- Windows installer + portable `.exe` built, tested and smoke-tested in CI on
  every pull request (v1.40). Desktop app version: `desktop/package.json` (1.40.0).

## Open — acceptance (needs the customer/owner)

- [ ] Approve the agent-started Actions runs and merge the v1.33–v1.40 pull request.
- [ ] Install the Windows artifact (`FREYRAUM-Editor-Windows`) on the customer PC:
      choose the project folder, add a picture, "Im Projekt speichern", check the
      gallery preview.
- [ ] Optional: publish the first desktop release (Actions → "Desktop app
      (FREYRAUM Editor)" → **Run workflow** on `main` with "publish", or tag
      `desktop-v1.40.0`).
- [ ] Online saving needs the one-time Cloudflare/GitHub App setup in
      `docs/ONLINE_EDITOR_SETUP.md` before the deployed editor can publish.
- [ ] Side-wall visual acceptance from a customer screenshot of the deployed
      gallery (evidence rules: `docs/HANDOFF.md` step 8).

## Open — later improvements

- [ ] Code signing (Windows certificate, Apple Developer ID) — removes the
      one-time SmartScreen/Gatekeeper warning; prerequisite for automatic
      updates (`electron-updater`). See `docs/DESKTOP_APP.md`.
- [ ] Dev-tool dependency upgrades (vite/esbuild, eslint) per
      `docs/DEPENDENCY_MAINTENANCE_PLAN.md`; production dependencies currently
      report 0 vulnerabilities.
- [ ] High-resolution asset delivery (below).

## Open — high-resolution asset delivery beyond GitHub upload limits (2026-07-07)

> **Phase: Planning/docs only.** No importer, runtime, or deployment behavior
> changed in this pass.

### Problem summary

The current GitHub Pages workflow requires the original customer artwork files to
be committed in `customer-artworks/inbox/`, then:

1. `scripts/import-artworks.mjs` copies them into `customer-preview/images/`.
2. The importer embeds the exact original bytes again as base64
   `webglImage` data URLs in `customer-preview/customer-artworks.js`.
3. `scripts/sync-customer-public.mjs` copies the generated assets into
   `public/` for the Vite/Pages build.

That architecture is not reliable for very large originals:

- GitHub browser uploads are limited to **25 MiB** per file.
- Regular Git warns above **50 MiB** and blocks files above **100 MiB**.
- GitHub Pages published sites may be no larger than **1 GB**.
- Git LFS is **not usable for GitHub Pages site assets**.
- One large image is effectively duplicated across tracked source files,
  generated image files, and a base64-expanded JS payload.

### Decision

Adopt a **two-tier asset model** for high-resolution artwork support:

1. **Master/original images live outside the Pages repo** (local operator
   archive or separate storage).
2. **GitHub-tracked assets become a publish bundle** of web-safe derivatives and
   compact metadata only.
3. **GitHub Pages builds only from the publish bundle**.
4. **`file://` reliability fallbacks remain local-only** and must not ship as
   full-size base64 payloads in the deployed manifest.

### Rejected approaches

| Approach | Why it is rejected |
|---|---|
| Keep exact original files in `customer-artworks/inbox/` and commit them | Still hits GitHub browser upload limits, 100 MiB Git hard block, and Pages 1 GB site ceiling. |
| “Just use Git LFS” for published artwork assets | GitHub’s own documentation says Git LFS cannot be used with GitHub Pages sites. |
| Keep embedding exact original bytes in committed `customer-artworks.js` | Base64 expands file size and duplicates the heaviest assets inside JS, making deploy artifacts and startup payloads scale poorly. |

### Execution plan

#### Phase 1 — Split masters from published assets

- Define a **local-only master artwork source** for high-resolution originals.
- Define a **tracked publish bundle** for the GitHub-safe derivatives that are
  actually deployed.
- Update ownership/docs so operators know which files are archival inputs and
  which files belong in Git.

#### Phase 2 — Change the importer contract

- Make the importer generate publish-ready derivatives from the master files.
- Stop shipping full-size `webglImage` payloads in the committed/deployed
  manifest.
- Keep any `file://` compatibility fallback local-only, so local preview
  reliability is preserved without bloating Pages artifacts.
- Extend the import report with source size, published size, and total site-size
  budget warnings.

#### Phase 3 — Add enforceable budget gates

- Add validation that fails when tracked publish assets exceed the agreed upload
  budget.
- Add a total published-site budget gate so the Pages artifact stays comfortably
  below the 1 GB ceiling.
- Add a manifest/JS budget gate so customer metadata cannot silently become a
  giant transport for image bytes.

#### Phase 4 — Update the customer publishing workflow

- Keep masters in a local/external archive.
- Run the local updater to produce GitHub-safe publish assets.
- Commit and push only the publish bundle that is intended for Pages.
- Document the fallback path for archival storage separately from the Pages
  runtime path.

### Acceptance criteria

- A customer can start from a source image that is **larger than 25 MiB** and
  still publish the gallery successfully to GitHub Pages.
- No GitHub-tracked publish file needs to exceed the browser-upload-safe budget.
- The deployed Pages site stays below GitHub’s site-size limit.
- Local preview remains reliable when opened from `file://`.

### Validation targets for the implementation PR

- `npm run lint`
- `npm run build:typecheck`
- `npm run build`
- `npm run docs:check-config-authority`
- `npm run test:frame-budget`
