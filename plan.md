# FREYRAUM Plan
> Latest markdown audit: 2026-10-19 (photographic inspection rooms).

Active engineering work only. Release history: `CHANGELOG.md`. Finished plans:
`docs/archive/plan-history-2026-10-17.md` (v0.74–v1.40) and
`docs/archive/plan-history-2026-06-21.md` (older).

## Photographic inspection rooms (2026-10-19)

- [x] Add a full-screen room-photo mode with a room selector and one selected
      gallery artwork at a time.
- [x] Add previous/next artwork controls that stay synchronized with normal
      gallery navigation and preserve the artwork's source aspect ratio.
- [x] Remove the dominant existing paintings from derived room backgrounds;
      preserve the supplied originals and correct the initial missed masks.
- [x] Use centered `cover` geometry for the photograph and its projective artwork
      placement at both wide and portrait viewport sizes.
- [x] Preserve room-view configuration through editor export/save and validate
      referenced background files in shared publish rules.
- [x] Stage configured room photos during Update Gallery and report missing
      sources so the local file preview works without a developer build.
- [x] Keep the room overlay and fixed controls above the gallery; place controls
      outside the artwork and verify clearance at desktop, tablet, phone and
      short-landscape sizes.
- [x] Add bounded photo pan, wheel/pinch zoom, reset and keyboard controls while
      keeping the projected artwork anchored to the photographed wall. True 3D
      movement remains out of scope for single-photo assets.
- [x] Add structural and browser regressions for config/save/export, importer
      staging and missing-photo warnings, file-preview image decode, room and
      artwork switching, responsive layout, camera gestures and focus return.
- [x] Run local root-index browser checks after Update Gallery and after the
      developer build; document the customer workflow and photo-camera limitation.
- [ ] Customer acceptance of the cleaned photo appearance and placements after
      updating the local preview; deployment acceptance remains separate.

## Selected timeline marker and tilted-image flicker (2026-10-19)

- [x] Remove the collection-wide progress line and make only the active artwork
      visibly marked, preserving the accessible selection state and counter.
- [x] Inspect the imported artwork's presentation and material maps; identify the
      near-coplanar image/backing surfaces as the tilt-sensitive depth-test pair.
- [x] Add a small polygon offset to the image plane while retaining its albedo,
      tilt, and the backing body's wall shadow.
- [x] Stop the backing body from writing depth so its near-coplanar front face
      cannot compete with the image plane; preserve its wall-shadow casting and
      assert both invariants in `test:webgl-resilience`.
- [x] Verify timeline fit/overflow at narrow and wide viewports and validate the
      correction at multiple tilt angles and quality presets.
- [x] Run lint, typecheck, production/local builds, and the focused WebGL depth
      regression; Chromium loaded the rebuilt gallery and processed hover tilts
      without losing its WebGL context.
- [x] Customer confirms the depth-write correction resolves the visual artifact
      (2026-10-19); retain the regression assertion to prevent reintroducing it.

## Reference exhibition defaults (2026-10-18)

- [x] Reopen the index-entry incident: prior direct-app checks did not establish
      that the customer's root-index artifact was fresh.
- [x] Make full builds import current artwork/layout data before bundling; version
      all local-preview scripts/styles and refresh the root launcher destination.
- [x] Reproduce and fix nested HTTP preview URLs: the local bundle's absolute `/`
      base requested backgrounds and editor settings outside `customer-preview/`.
- [x] Recheck root-index `file://` and HTTP paths after the relative-base rebuild:
      exact four mappings, visible painting/background pixels and editor parity pass.
- [x] Map supplied Gartenszene/front-left, Akt/front-right, Fraktal/left and
      Wunderbaum/right, retaining Akt's existing placement and the photograph.
- [x] Curate native-ratio sizes with valid green-zone and doorway clearance.
- [x] Rebuild and verify all four paintings contribute visible pixels, and
      museum/editor projections match exactly.
- [x] Validate geometry, deployment content, save service and local saving.
- [x] Customer confirms the local setup works after Update Gallery.bat and
      supplies the four-painting screenshot (2026-10-18; `docs/HANDOFF.md`).
- [ ] Verify a new post-merge Pages deployment and live smoke; local confirmation
      is not evidence of deployed branch content.

## Active — restore the photograph-backed museum (2026-10-18)

- [x] Gallery artwork entrance starts camera-side of the front wall; retain
      lateral/scale/tilt motion, reduced-motion behavior, and body shadows.
- [x] Artwork timeline shrink-wraps small collections, caps at its existing
      width, and keeps its arrows for scrollable collections.
- [x] Add structural regression checks for wall-side entrance depth, reduced
      motion, shadow casting, responsive item sizing, and overflow arrow state.
- [ ] Existing `validate:museum-hub` doorway-height invariant expects 2.30m but
      current calibrated exclusions measure about 2.692m / 2.486m; keep separate
      from this gallery-view change and resolve with the geometry owner.
- [ ] Customer reports plain white background in the latest deployment. Pages
      run #21 (`c3b8e246`) built and deployed successfully, but its live smoke
      exited before browser checks because the fresh checkout lacked generated
      `artworks.json`; this does not establish the visible result. Background
      artifact and live smoke checks now follow `museum-hub.json` (currently
      `Museum_ohne_Bilder.png`). Verify the next deployment's live smoke.
- [x] Audit current Markdown and compare the presentation claims with source;
      review archives as historical evidence without rewriting them.
- [x] Identify structural divergence: the normal museum used an opaque WebGL
      room while the editor projected artwork over a photograph. Geometry tests
      alone could not establish agreement between those presentations.
- [x] Correct the missing-background diagnosis: `Museum_ohne_Bilder.png` exists;
      the JSON's lowercase/hyphenated filename did not match it.
- [x] Reproduce the current `file://` baseline (implementation pass): two imported
      works, missing side-slot mappings and hub renderer initialization failure;
      evidence reported at `/tmp/freyraum-before`.
- [x] Complete the shared photograph-backed, calibrated DOM artwork presentation
      for museum and editor; do not cover the photograph with an opaque room.
- [x] Built-preview capture confirms the exact photograph and both available
      genuine images in museum/editor, opacity 1, and no allocated hub canvas.
- [x] Lint, typecheck, build, frame-budget, documentation-authority and
      editor-rooms browser checks pass (implementation pass).
- [ ] Validate matching generated preview and served artifacts, editable walls,
      warning-only saving, room/assignment import, navigation and renderer recovery.
- [x] Geometry suite and HTTP photographic smoke pass, including actual artwork
      pixel contribution and museum/editor homography parity.
- [x] `file://` smoke, WebGL resilience, 10 deploy-validator fixture cases and
      syntax checks pass; real shipping-content failures remain separate.
- [x] Implement bounded transparent-primary alpha recovery with conservative
      native-alpha scanning; method checks include sparse valid strokes.
- [x] Rebuilt `file://` and HTTP blank-primary recovery/source assertions pass;
      screenshots captured. The visual command still exits 1 on the separate
      pre-existing shadow-light-count invariant, so no full-suite pass is claimed.
- [ ] Resolve/characterize the pre-existing software-Chrome visual-capture
      invariant (`shadow-casting light count 1 != expected 2`); no Type A pass
      is claimed.
- [x] Rerun content-blocked deploy/save-service/local-project checks with all four
      supplied paintings and the new default assignments.
- [x] Record customer's local success and screenshot; original failing artifact
      identity remains unknown. Post-merge live confirmation remains separate.
- [x] **Content blocker resolved:** genuine `Gatrenszene.png` and `Wunderbaum.png`
      are supplied; the requested default uses their exact importer IDs
      `gatrenszene` and `wunderbaum`. All four images pass visible-pixel checks.

No dependency upgrades or high-resolution importer redesign are part of this fix.

## Active — customer-reported timeline and tilted clipping follow-up (2026-10-18)

- [x] Treat the previous timeline and entrance-depth changes as unsuccessful for
      the user; replace assumptions with visible layout and camera-pose fixes.
- [x] Use a full-width timeline dock (capped at 1180px), evenly distribute
      thumbnails when all fit, and retain visible scrolling arrows on overflow.
- [x] Present artwork title/subtitle, stronger selected state, and collection
      progress while preserving keyboard selection and reduced-motion handling.
- [x] Reduce the camera near plane and solve navigation tilt/depth against both
      wall and camera clearance; preserve full entrance motion at normal zoom and
      keep the artwork-body shadow caster unchanged.
- [x] Add responsive fit and tilted-pose regression assertions.
- [x] Run production build and browser checks for 1–4 works, larger collections,
      narrow screens, selection/keyboard controls, and camera/wall clearance.
- [x] Chromium verifies 1–4 works across 320, 390, 500, 900 and 1600px widths,
      12-item arrow scrolling, keyboard focus, selection/progress, and reduced motion.
- [ ] `npm run validate:museum-hub` reaches the previously documented doorway
      height assertion (expected 2.30m vs calibrated values); pose assertions pass
      before that unrelated failure.
- [ ] Confirm the revised timeline and tilted artwork look correct in the user's
      deployed gallery; automated geometry checks do not replace visual approval.

## Merge-readiness handoff (2026-10-18)

- [x] Audit current Markdown, retain dated archives, record customer local success
      and link screenshot evidence in `docs/HANDOFF.md`.
- [x] Recheck lint/typecheck/build, focused non-browser tests, production-base
      and root-file smoke, editor rooms/publish/drag.
- [x] Preserve the save-service variable across the build's automatic import;
      a configured build retains the URL in public/dist/preview settings.
- [ ] Owner approves outstanding Actions checks and creates/merges the PR;
      no open PR was returned during the audit.
- [ ] Confirm new post-merge Pages deploy and live smoke. Older main failure is
      diagnosed in `FINDINGS.md`; it does not validate this branch.

## Product baseline (v1.40; presentation correction above)

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

- [ ] Approve the agent-started Actions runs and merge the v1.33–v1.40 pull request.
- [ ] Install the Windows artifact (`FREYRAUM-Editor-Windows`) on the customer PC:
      choose the project folder, add a picture, "Im Projekt speichern", check the
      gallery preview.
- [ ] Optional: publish the first desktop release (Actions → "Desktop app
      (FREYRAUM Editor)" → **Run workflow** on `main` with "publish", or tag
      `desktop-v1.40.0`).
- [ ] Online saving needs the one-time Cloudflare/GitHub App setup in
      `docs/ONLINE_EDITOR_SETUP.md` before the deployed editor can publish.
- [ ] Side-wall confirmation from a customer screenshot of the deployed
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
