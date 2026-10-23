# FREYRAUM Plan
> Latest markdown audit: 2026-10-22 (v1.46 merge readiness).

Active engineering work only. Release history: `CHANGELOG.md`. Finished plans:
`docs/archive/plan-history-2026-10-22.md` (v1.41–v1.44 and 2026-10-18…20),
`docs/archive/plan-history-2026-10-17.md` (v0.74–v1.40) and
`docs/archive/plan-history-2026-06-21.md` (older).

## Next development round (v1.46, 2026-10-22) — ready to merge

Delivered on PR #27 (details: `CHANGELOG.md` v1.46, numbers: `FINDINGS.md`):
B1 web manifest without image bytes, B2 WebP size variants, B3 lazy editor
chunk, B4a WebP background copies (phone visit 18.6 → 4.8 MB), C1 info-sheet
stops, C2 photo-room swipe, C3 landscape rail, C4 tap-to-hide phone chrome,
C6 flick test, D3 zoom readout, D5 gallery zoom fixed point, E3 deep links +
"Link teilen", `npm test` in CI. The full round and the v1.45 handoff
checklist: `docs/archive/plan-history-2026-10-22-v1.46.md`.

- [ ] A Owner gates: approve CI on PR #27 and merge; live `/Freyraum/` check
      (`docs/DEPLOYMENT.md`); real-phone and real-GPU desktop pass (see
      "Open — acceptance" below).
- [ ] G Content from the customer (see "Open — acceptance").

Deferred to the next round, best decided after real-device feedback:

- [ ] D1 Split-layer raster for the room camera (target: fewer double-click
      redraws than 41/31, `npm run measure:room-zoom`); judge softness on a
      real GPU first — headless screenshots cannot show it (`FINDINGS.md` v1.44).
- [ ] C5 Hub pinch zoom + edge preview of the neighbouring wall on phones.
- [ ] D2 Per-frame room repaint (`syncPanCursor` toggles, shared paint layer);
      D4 pointer-anchored wheel modifier.
- [ ] E1 200 % text checks; E2 "reduce chrome" setting; E4 on-device
      diagnostics overlay; E5 characterise the shadow-light harness stop.
- [ ] F CI split for browser suites, visual baselines, Lighthouse budget,
      dev-tool upgrades (`docs/DEPENDENCY_MAINTENANCE_PLAN.md`); PWA.
- [ ] Phone polish ideas from the handoff not yet built: timeline auto-hide,
      room parallax.
- [ ] Mobile suite: the sheet step half → full timed out in two runs (reruns
      passed); the check now prints the sheet state — diagnose on the next
      failure (`docs/HANDOFF.md`).
- Not planned: B4b lazy hub artwork loading — four artworks already share one
  URL with the gallery, so the saving is small and the hub readiness gate
  would need rework. Revisit when a room holds many more works.

## Product baseline (v1.40; later releases in `CHANGELOG.md`)

- Three.js inspection gallery and photograph-backed museum/editor with rooms of
  2 front + 1 left + 1 right works, built from `customer-artworks/museum-hub.json`.
- Placement editor (`OPEN_ARTWORK_EDITOR.html` → `customer-preview/placement-editor.html`,
  deployed `placement-editor.html`): stable drag on all walls (v1.33), one placement truth
  for editor/loader/3D (v1.34), user-controlled rooms (v1.35), wall resizing
  never stretches artwork (v1.37).
- Three ways to save: online editor → save service (`worker/`, v1.38);
  FREYRAUM Editor desktop app (`desktop/`, v1.39); `file://` download fallback.
- Windows installer + portable `.exe` built, tested and smoke-tested in CI on
  every pull request (v1.40). Desktop app version: `desktop/package.json` (1.40.0).

## Open — acceptance (needs the customer/owner)

Consolidated from the archived plans; one entry per gate.

- [ ] Approve the agent-started Actions runs and merge PR #27 (v1.41–v1.46,
      branch `copilot/mobile-view-optimizations`; `main` holds v1.33–v1.40).
- [ ] Post-merge Pages deploy plus live `/Freyraum/` smoke
      (`docs/DEPLOYMENT.md`); local or fixture passes are not deployment evidence.
      Includes the old "plain white background" report and side-wall
      confirmation from a deployed screenshot (evidence rules: `docs/HANDOFF.md`
      → "Support diagnostics workflow", step 8).
- [ ] Real phones (iOS Safari, Android Chrome; portrait/landscape): gyro feel
      and calibration, flick feel, hub strip, info sheet stops, tap to hide
      the controls, landscape timeline rail, room swipe, "Link teilen" share
      sheet, loading and browser-bar colours, timeline and tilted artwork.
- [ ] Real desktop GPU (Chrome/Edge/Firefox, mouse and trackpad): zoom feel in
      both views, softness during zoom-in, new shared zoom curve, zoom
      readout, reset without sideways slide.
- [ ] Customer review of the four cleaned room photos (incl. Büro frame and
      cleanup patches), placements, hub shadows and controls at normal size.
- [ ] Customer confirms defaults: loading colour wall grey, gyro auto on
      Android / opt-in on iOS, soft hub snapping.
- [ ] Content: Wunderbaum text, Akt 27 / Fraktal alt texts, real descriptions
      instead of the placeholder text in the sidecar files.
- [ ] Install the Windows artifact (`FREYRAUM-Editor-Windows`) on the customer PC:
      choose the project folder, add a picture, "Im Projekt speichern", check the
      gallery preview.
- [ ] Optional: publish the first desktop release (Actions → "Desktop app
      (FREYRAUM Editor)" → **Run workflow** on `main` with "publish", or tag
      `desktop-v1.40.0`).
- [ ] Online saving needs the one-time Cloudflare/GitHub App setup in
      `docs/ONLINE_EDITOR_SETUP.md` before the deployed editor can publish.

## Open — engineering follow-ups

- [ ] Reproduce the 2026-10-20 Wohnbereich top-clipping screenshot at
      2000×1080 with its exact bundle, room, artwork and camera state; fix the
      calibration only if the current artifact also clips.
- [ ] Characterize the software-Chrome visual-harness stop at the runtime
      invariant `shadow-casting light count 1 != expected 2` (E5 above).
- [ ] Re-verify editor parity on the generated preview and served artifacts
      (editable walls, warning-only saving, room/assignment import, renderer
      recovery) with `test:editor-rooms` / `test:editor-publish`.

## Open — later improvements

- [ ] Code signing (Windows certificate, Apple Developer ID) — removes the
      one-time SmartScreen/Gatekeeper warning; prerequisite for automatic
      updates (`electron-updater`). See `docs/DESKTOP_APP.md`.
- [ ] Dev-tool dependency upgrades (vite/esbuild, eslint) per
      `docs/DEPENDENCY_MAINTENANCE_PLAN.md`; production dependencies currently
      report 0 vulnerabilities.
- [ ] High-resolution asset delivery (below).

## Open — high-resolution asset delivery beyond GitHub upload limits (2026-07-07)

> **Status (v1.46):** Phase 2 is done for the deployed site — the web
> manifest no longer embeds `webglImage` (local `file://` keeps it) and the
> runtime loads WebP derivatives. Phase 3's manifest budget is in
> `validate:deploy`. Still open: originals are still copied to `dist/images/`
> (fallback only), so Phases 1 and 4 (masters outside Git, >25 MiB uploads)
> remain.

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
