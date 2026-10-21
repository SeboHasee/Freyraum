# FREYRAUM Plan
> Latest markdown audit: 2026-10-21 (v1.44 photo-room zoom-out drift).

Active engineering work only. Release history: `CHANGELOG.md`. Finished plans:
`docs/archive/plan-history-2026-10-17.md` (v0.74–v1.40) and
`docs/archive/plan-history-2026-06-21.md` (older).

## Photo-room zoom-out drift (v1.44, 2026-10-21)

- [x] Un-anchored camera animations (reset, double-click zoom-out) scale about
      their fixed point; no left/top drift.
- [x] Cached viewport size; no layout reads or redundant button writes per frame.
- [x] Browser assertion for a drift-free double-click zoom-out.
- [ ] `test:mobile-browser` failed in the v1.44 session at "phone-390x844:
      room-01.wall-left.a is fully on screen after its strip tap" (hub
      panorama; v1.44 changed only `GalleryRoomView.ts`). Diagnose before
      merge: headless rAF starvation of the strip snap vs. a real regression.
- [ ] Owner check on a real desktop GPU: zoom smoothness and whether the
      motion layer looks soft during zoom-in (see `FINDINGS.md` v1.44 for the
      split-layer option if it does).

## Desktop photo-room zoom (v1.43, 2026-10-21)

- [x] Double-click toggles zoom at the pointer, like the gallery; help updated.
- [x] Motion-only compositing for the room camera (raster tasks ~515 → ~80).
- [x] Camera frames no longer re-project the artwork or read layout.
- [x] Shared wheel-delta normalisation for gallery and room.
- [x] Gallery trackpad pinch (ctrl+wheel) no longer zooms the browser page.
- [ ] Owner check on a real desktop (Chrome/Edge/Firefox, mouse and trackpad):
      zoom smoothness, and whether the brief softness before the final sharp
      re-raster is acceptable at large zoom steps.

## Mobile experience overhaul (v1.41, 2026-10-21)

- [x] Root-cause the reported phone issues (see `FINDINGS.md` 2026-10-21).
- [x] Shared gesture engine `src/interaction/touchGestures.ts` + pure tests.
- [x] Gallery: 1:1 pan, anchored multiplicative pinch, momentum, double-tap,
      swipe preview and flick navigation.
- [x] Gallery gyro tilt (`DeviceTiltController`, `deviceTilt` preference,
      settings toggle, iOS permission after a tap).
- [x] Photo room: momentum, rubber band, double-tap, visible sensor tilt.
- [x] Hub: remove wall-group hiding; phone panorama with synced artwork strip.
- [x] Phone layout: slim timeline, hidden touch zoom buttons, one-row room header.
- [x] Loading accent token and `theme-color` on every page.
- [x] Photo-room browser suite passes end to end for the first time (39 checks):
      terminal-zoom and edge spring-back waits tolerate headless rAF starvation,
      and wheel/button zoom now stops a running pan glide (`FINDINGS.md`).
- [ ] Real-device acceptance on iOS Safari and Android Chrome (portrait and
      landscape) on the deployed `/Freyraum/` build: gyro feel, flick feel,
      panorama strip, loading and browser-bar colours.
- [ ] Customer confirmation of the loading colour, gyro default and snap style
      (defaults chosen: wall grey; auto on Android / opt-in on iOS; soft snap).
- [x] v1.42 follow-ups: phone "more" menu, info bottom sheet (and the touch
      visibility fix), reduced motion over manual tilt, nav-occlusion keyed to
      chrome mode, `test:mobile-browser`, museum-hub geometry suite repaired,
      photo-room zoom cap decided (keep 6×).
- [x] v1.42 merge readiness: photo-room browser suite green again (synthetic
      drag no longer read as a fling), in-app reduced motion covers the phone
      menu, docs and handoff refreshed.
- [ ] Remaining follow-ups: `docs/HANDOFF.md` → "Ready-to-pick follow-ups".

## Pan-aware cursor and control help (2026-10-20)

- [x] Follow gallery pan capability from `GalleryManager.canPan()` through zoom,
      navigation, and viewport changes; show `grab` while panning is available and
      `grabbing` only after a fine-pointer drag can move the view.
- [x] Show room-view cursor feedback only above fit scale when photo bounds allow
      pan; leave touch-only devices without mouse cursor cues.
- [x] Align gallery and room help with implemented wheel zoom, conditional
      drag-to-pan, gallery swipe navigation at overview, and touch gestures.
- [x] Add structural and generated-preview browser assertions for both help
      contexts, non-pannable overview, pannable zoom, active drag, reset, and
      touch-pointer cursor behavior.
- [x] Clear photo-room pan cursor state after zoom/reset animation targets are
      removed, and make browser checks assert a meaningfully zoomed camera rather
      than an exact serialized transform string.
- [x] Resolve the generated-preview browser timeout at the configured maximum
      photo-camera scale (headless rAF starvation; resolved 2026-10-21, v1.41).
- [x] Complete the production/customer-preview build, focused structural checks,
      lint, typecheck, and documentation-authority checks; full browser-suite
      success remains open pending the maximum-zoom check.
- [x] Complete the final secret scan and parallel validation; no secrets or
      CodeQL alerts were found. The automated review executable was unavailable.

## Museum artwork spotlight and action feedback (2026-10-20)

- [x] Diagnose the visitor CSS feedback gap: the normal museum view hid artwork
      focus/hover outlines and labels, leaving only the shadow emphasis.
- [x] Add a warm, soft radial light clipped inside the existing projected artwork
      button; follow fine-pointer movement and center on focus/selection.
- [x] Keep selected feedback stable, touch hover inactive, reduced motion honored,
      and calibration/debug views free of the visitor spotlight.
- [x] Add exact front-right (`room-01.wall-front.b`, Akt 27) pointer-target and
      same-slot shadow checks, plus front/side neighbor and responsive coverage.
- [x] Reduce the narrow front-wall view scale so the right-front projected center
      and complete hit bounds remain reachable at phone/tablet sizes; artwork
      placement, projective transform, and clip path are unchanged.
- [x] Inventory existing acknowledgement for artwork open, room toggle, timeline,
      audio, fullscreen, disabled and loading/error states; avoid redundant motion.
- [x] Run generated-preview hub checks and capture desktop/tablet/phone normal and
      hover states plus desktop focus, selection, and angled side-wall hover.
- [x] Run structural regression, lint, typecheck, production/customer-preview build,
      front-wall aspect test, and full generated-preview browser suite; keep the
      known doorway geometry failure tracked separately.
- [x] Complete secret scanning and CodeQL validation; the separate read-only
      review found no significant issues, while automated review was unavailable.
      Preserve the existing zoom and geometry gates for their own follow-up.

## Museum spotlight presentation refinement (2026-10-20)

- [x] Trace initial boot and return-to-hub synchronization: gallery artwork ID is
      synchronized for navigation/focus, but its presentation is not user-selected.
- [x] Keep persistent hub selection styling only for explicit slot activation;
      clear that state on hub return while retaining the gallery's current artwork.
- [x] Remove visitor artwork frames and floating title badges; keep accessible
      button names and replace the keyboard frame with a small focus marker.
- [x] Soften the spotlight and keep its projected clipping, hover/focus behavior,
      touch guard, reduced-motion support, and existing shadow geometry.
- [x] Add browser verification for idle/explicit/return states, focus marker,
      no visitor title badges, matching shadow/light, and unchanged geometry;
      capture desktop/tablet/phone states and front/side hover.
- [x] Run structural regression, lint, typecheck, production/customer-preview
      build, and the complete generated-preview browser suite.
- [x] Complete secret scanning and CodeQL validation; the separate read-only
      review found no significant issues, while automated review was unavailable.
      Keep the known museum doorway geometry failure tracked separately.

## Room zoom anchoring and museum hover (2026-10-20)

- [x] Rebuild the generated preview and verify the existing room zoom baseline;
      confirm the old browser coverage checked settled positions, not the in-flight
      artwork path.
- [x] Anchor animated button/wheel zoom to one scene-space artwork center, deriving
      per-frame offsets from the eased scale and constraining them to photo bounds.
- [x] Keep pan/pinch direct, and retarget zoom smoothly after input or viewport
      changes; reduced motion still applies camera targets immediately.
- [x] Add fine-pointer hover and keyboard-focus emphasis to each matching hub SVG
      shadow; keep selection distinct, and preserve the artwork's exact hit target.
- [x] Add browser and structural regression coverage for motion path, shadow state,
      touch-only behavior, and reduced-motion transitions.
- [ ] Complete generated-preview visual review and full validation; record any
      remaining findings before presentation acceptance.

## Mobile and tablet photo-room experience (2026-10-20)

- [x] Keep desktop zoom easing and pointer hover tilt unchanged.
- [x] Match the gallery's two-stage frame-independent zoom and pan smoothing for
      button/wheel inputs on all pointer types; retarget active motion smoothly
      without adding lag to direct pinch or pan gestures.
- [x] Add an opt-in touch-device orientation tilt with explicit permission action,
      neutral calibration, screen rotation handling, reduced-motion shutdown, and
      room/page lifecycle cleanup.
- [x] Keep the room controls and complete artwork within portrait, landscape,
      tablet, narrow portrait, and short narrow-landscape browser fixtures.
- [x] Test permission grant, denial, unsupported/insecure access, subtle angle
      bounds, and page-hide suspension/resume without physical sensor hardware.
- [x] Run room-view helper and generated-preview browser regressions, lint,
      typecheck, and production/customer-preview build.
- [ ] Verify the opt-in sensor feel on a physical customer phone; automated
      orientation events cannot prove device-specific sensor calibration or comfort.

## Photo-room control consistency (2026-10-19)

- [x] Use the gallery timeline as the photo-room artwork selector, preserving one
      shared active artwork state and selection indicators.
- [x] Add a prominent gallery-style return action and keep the room selector
      visually distinct from artwork selection.
- [x] Match gallery zoom/reset controls and reuse its contextual help trigger and
      shared audio, settings, and fullscreen controls.
- [x] Make the photo-room entry a primary action with a meaningful compact-phone
      label and a clear active state.
- [x] Reassess desktop, tablet, portrait phone, and short-landscape placement;
      ensure timeline and zoom controls remain within the viewport.
- [x] Extend browser checks for timeline synchronization, focus order, responsive
      bounds, contextual help, and shared control reparenting.
- [x] Preserve the existing photo camera, artwork projection, and room switching.

## Photo-room framing and photo quality (2026-10-20)

- [x] Recalibrate Wohnbereich's visible wall quad and reduce artwork height; the
      configured projection fixtures confirm full-print bounds for tested
      `cover`-cropped viewport cases.
- [x] Retouch all four derivatives from preserved originals, extending cleanup
      to include old frames and shadows and blending only the outside edge.
- [x] Restore subtle wall-matched bedroom texture and add a regression bound
      against an untouched wall sample.
- [x] Apply restrained native-resolution sharpening; test 2× upscaling and reject
      it because it adds no source detail while multiplying image and decode size.
- [x] Cover portrait, 3:4, and square artwork at wide-desktop, tablet, portrait
      phone, and short-landscape aspect ratios in projection/browser regressions.
- [x] Add an actual-browser Wohnbereich check at 2000×1080, assert complete
      artwork bounds, and wait for two paint frames before capturing screenshots.
- [ ] Reproduce the 2026-10-20 Wohnbereich screenshot at 2000×1080 with its exact
      generated bundle, room config, selected artwork, and camera state; verify the
      full frame stays onscreen and correct calibration if the current artifact also
      clips.
- [ ] Customer review of all four room photos at normal display size, including
      confirmation that the Büro frame and all cleanup patches are imperceptible.

## Photographic inspection rooms (2026-10-19)

- [x] Add configured Wohnbereich and Büro photo views, bringing the selector to
      four rooms, and stage all four cleaned derivatives in Update Gallery.
- [x] Rebuild the previous bedroom and Wohnraum cleanups from the untouched
      originals; remove the new photos' paintings and extend artwork-removal,
      cleanup-boundary, import, and responsive browser checks.
- [ ] Customer review of all four cleaned photos and artwork placements after
      Update Gallery; pixel and automated browser checks do not replace visual
      acceptance.
- [x] Add a full-screen room-photo mode with a room selector and one selected
      gallery artwork at a time.
- [x] Use the shared gallery timeline for artwork selection, synchronized with
      normal gallery navigation and preserving the artwork's source aspect ratio.
- [x] Remove the dominant existing paintings from derived room backgrounds;
      preserve the supplied originals and correct the initial missed masks.
- [x] Use centered `cover` geometry for the photograph and its projective artwork
      placement at both wide and portrait viewport sizes.
- [x] Preserve room-view configuration through editor export/save and validate
      referenced background files in shared publish rules.
- [x] Stage configured room photos during Update Gallery and report missing
      sources so the local file preview works without a developer build.
- [x] Keep the room overlay and fixed controls above the gallery; verify room
      controls remain on-screen at desktop, tablet, phone and short-landscape sizes.
- [x] Add bounded photo pan, wheel/pinch zoom, reset and keyboard controls while
      keeping the projected artwork anchored to the photographed wall. True 3D
      movement remains out of scope for single-photo assets.
- [x] Add structural and browser regressions for config/save/export, importer
      staging and missing-photo warnings, file-preview image decode, room and
      artwork switching, responsive layout, camera gestures and focus return.
- [x] Soften the cleaned-photo patch boundaries without modifying the source
      photographs; guard artwork removal and edge gradients in pixel regressions.
- [x] Preserve the artwork's fixed wall-space dimensions and exact projective
      camera transform, with bounded keyboard-focusable hover response and
      layered contact/directional shadows that respect reduced motion.
- [x] Rebuild the room controls around clear room/artwork/camera groups using
      project glass/focus tokens and responsive touch-sized actions.
- [x] Extend the local `file://` browser regression for artwork size, registration,
      hover/focus, shadow, reduced-motion, menu labels and layout breakpoints.
- [x] Run local root-index browser checks after Update Gallery and after the
      developer build; document the customer workflow and photo-camera limitation.
- [x] Apply the photo camera only to the shared room scene; keep the artwork's
      projection in scene-local coordinates and test corner registration across
      all configured rooms, four viewport sizes, maximum zoom and varied pans.
- [x] Add a labeled photo-room editor with room selection, normalized wall-corner
      and artwork placement/size inputs, shared-projection preview, validity
      checks, editor history, and config export/save round-trip.
- [x] Reduce hover tilt and scale response; soften directional shadows so the
      artwork reads as wall-mounted, including reduced-motion behavior.
- [x] Make zoom buttons ease toward the projectively mapped artwork center, retain
      pointer/gesture-centered wheel and pinch zoom, and skip camera animation for
      reduced-motion users.
- [x] Extend mouse proximity beyond the image with responsive reach, barely
      perceptible tilt, and a smooth return to neutral; increase wall-contact and
      directional shadows and normalize icon centering.
- [x] Compare every cleanup-boundary pixel gradient against its unchanged source
      neighbor and retain artwork-removal pixel checks.
- [ ] Customer acceptance of the cleaned photo appearance and placements after
      updating the local preview; deployment acceptance remains separate.
- [ ] Review the retouched photos at full resolution and normal display size;
      visual approval remains a separate customer acceptance step.
- [ ] Verify live deployment after merge and retain the photo-view limitation:
      true orbit/walking needs 3D room assets or additional viewpoints.
- [x] Expand the photo-room camera zoom/pan reach and move the shared volume,
      settings, and fullscreen controls into the room overlay.
- [x] Strengthen layered, wall-directed shadows on projected museum-hub artwork.
- [x] Render hub wall shadows in a non-interactive SVG sibling derived from the
      exact projected quad, keeping the clipped artwork and its hit target intact.
- [x] Center wheel zoom on the projected artwork, widen responsive pointer reach,
      and ease artwork/camera returns without changing room registration.
- [x] Emphasize the photo-room toggle and add view-specific help with accurate
      keyboard, mouse, wheel, and touch guidance.
- [x] Previously position the standalone toolbar in a clear short-landscape
      corner; this path was superseded by the gallery-aligned controls above.
- [x] Extend browser coverage and optional captures for hub shadow visibility,
      control states, contextual help, camera behavior, and responsive layouts.
- [ ] Review saved browser captures and approve hub shadows and controls visually
      at desktop, tablet, portrait-phone, and short-landscape sizes.

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
- [ ] `validate:museum-hub` fails at
      `scripts/test-museum-hub-geometry.mjs:411`: wall-left doorway-height
      expects 2.30 m, which the calibrated config does not satisfy. The stale
      timeline assertion is corrected; resolve the remaining geometry invariant
      separately with its owner.
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
- [ ] `npm run validate:museum-hub` now passes the corrected timeline-state
      assertion but fails at `scripts/test-museum-hub-geometry.mjs:411` on the
      existing wall-left doorway-height expectation (2.30 m vs calibrated config).
      Photo-room browser/structural regressions pass independently.
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

- [ ] Approve the agent-started Actions runs and merge PR #27 (v1.41–v1.42
      mobile, branch `copilot/mobile-view-optimizations`; `main` already holds
      v1.33–v1.40), then check the live Pages build on a phone.
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
