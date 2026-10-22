# FREYRAUM Handoff history (archived 2026-10-22)
> Immutable snapshot moved out of `docs/HANDOFF.md` during the v1.45 handoff
> completion audit. Claims are as they were; open items were carried forward to
> `docs/HANDOFF.md` → "Open items" and `plan.md`. Use current canonical docs for
> navigation.

## Photo-room controls and validation history (2026-10-20, partly superseded)

Current status lives in "Next-agent starting point (v1.43–v1.45)" below.

- **Reopened screenshot issue:** the user-supplied
  [Wohnbereich capture](https://github.com/user-attachments/assets/a811e3d7-b277-4619-8e17-8815b01046fe)
  shows the selected artwork clipped at the viewport top. The reported image does
  not identify its build/config/camera state; match those before attributing cause.
  Although the configured geometry/browser fixtures pass whole-artwork bounds,
  do not claim customer-visible framing is fixed until this capture is reproduced
  or superseded by a verified current-build screenshot.
- **Current-build replay:** on 2026-10-20, `npm run build` generated the local
  preview with bundle `bundle-d98e87c7c0f0` from source revision `8d0c4a5`.
  The file-preview browser test passed at 2000×1080 with Wohnbereich selected and
  the camera reset; the entire artwork and controls remain within the viewport.
  Captures now wait two animation frames: an immediate capture had only the
  neutral wall color, while the synchronized capture contains photo pixels
  (sampled mean absolute RGB difference 10.12 from the centered-cover source crop).
  The screenshot is `/tmp/freyraum-presentation-sync-20261020/room-wohn-bereich-2000x1080.png`.
  This is a current local artifact, not a reproduction of the customer's unknown
  bundle/browser zoom/camera state, so the reported screenshot remains open.
- Four configured photo rooms are available: Schlafzimmer, Wohnraum, Wohnbereich,
  and Büro. Cleaned `gallery-*.png` derivatives are displayed while the originals
  remain preserved; structural pixel regressions check cleanup seams and
  painting/frame removal for each source. Wohnbereich's wall quad was recalibrated
  to the visible wall after centered `cover` cropping, and projection/browser tests
  check whole-artwork bounds across portrait, 3:4, and square artwork ratios.
- Upscaling was evaluated and rejected: the available sources are 1896–2000 px
  wide, and a 2× Lanczos candidate increased PNG/download and decoded image costs
  without adding source detail. The cleaned derivatives retain source dimensions
  with gentle native-size sharpening.
- Run Update Gallery after pulling these changes so all four configured photos are
  staged for the local `file://` preview.
- The photo room reuses the gallery's single artwork timeline and selected-work
  state. It also uses the gallery-style return and zoom/reset controls and the
  shared help, audio, settings, and fullscreen widgets. The room selector is
  distinct from artwork selection.
- The control layout and complete artwork bounds were checked at desktop, tablet,
  portrait-phone, and short-landscape sizes. Normal-size browser captures of all
  four rooms were reviewed; the bedroom repair received subtle wall-matched
  microtexture after its center appeared smoother than the nearby wall. Fresh
  captures were generated after rebuilding; customer acceptance remains open.
- Passing: `npm run build`, `npm run lint`, `npm run build:typecheck`,
  `npm run test:gallery-room-view`, and the browser suite's cursor, four-photo
  decode, and responsive control/bounds checks.
- **Browser-suite terminal zoom (resolved 2026-10-21):** the former timeout at
  `scale(5.99…)` vs. `6` was headless SwiftShader starving `requestAnimationFrame`,
  not a camera bug; the wait now allows 90 s. The complete suite passed on
  2026-10-21 (39 checks). See `FINDINGS.md` 2026-10-21.
- The four-room browser run decoded each background and checked full artwork and
  control bounds at desktop, tablet, portrait phone, short landscape, and the
  reported 2000×1080 viewport. Deploy validation, deploy-content tests, front-wall
  aspect, WebGL resilience, frame-budget, photo-room, and config-authority checks
  passed. `npm audit --omit=dev --audit-level=moderate` reports no production
  vulnerabilities; the full dependency audit reports 17 existing development-tool
  advisories (1 moderate, 16 high), with no dependency changes made.
- Build output retains classic-script and large-chunk warnings. Import reports the
  existing large Fraktal asset (about 97 MB decoded on GPU), missing optional
  Wunderbaum text, and empty alt fields for Akt 27 and Fraktal. The full Type A
  visual harness could not run because optional Playwright tooling is not installed.
- Static deployment validation passed, but the production-base browser smoke and
  post-merge live Pages smoke were not run. The branch is not deployed; static
  content checks and the tested root `file://` preview do not establish live status.
- *(Superseded 2026-10-21, v1.42: the doorway-height failure in
  `validate:museum-hub` was repaired; the suite passes. Kept for history.)*
- The earlier full Markdown audit covered 36 current documents and left seven dated
  archive snapshots unchanged. This targeted follow-up updates the relevant active
  handoff, tooling, plan, findings, and changelog documents only.

## Next-agent starting point (2026-10-21, v1.42 merge readiness)

1. Branch state: v1.41 mobile overhaul + v1.42 follow-ups are complete and
   validated locally; PR #27 is ready for the owner to approve the Actions
   runs (**Approve and run**) and merge (`main` already holds v1.33–v1.40).
   After merge, check the live `/Freyraum/` Pages build on a phone
   (`docs/DEPLOYMENT.md`).
2. Read `CHANGELOG.md` → v1.42 and v1.41, `FINDINGS.md` 2026-10-21 and
   `ARCHITECTURE_MAP.md` (touch gestures, device tilt, hub panorama, phone
   menu, info sheet). New touch surfaces must use
   `src/interaction/touchGestures.ts`; utility-control placement belongs only
   to `placeUtilityControls()` in `src/main.ts`.
3. Checks for this area: `npm run test:touch-gestures`,
   `npm run test:gallery-room-view`, `npm run validate:museum-hub`, and after
   `npm run build` the photo-room browser suite and `npm run test:mobile-browser`
   (`docs/REGRESSION_TOOLING.md`). Run the browser suites one at a time and kill
   stray headless Chrome between runs; both passed on 2026-10-21.
4. Browser tests drive real release physics: CDP press/move/release arrive
   within milliseconds and read as a fling. Hold past the 100 ms velocity window
   before releasing when a test needs a plain drag (`LESSONS_LEARNED.md` 129).
5. Open customer decisions (defaults in place): loading colour (wall grey
   `#c7ced4`), gyro default (auto on Android, opt-in on iOS), hub snapping (soft).
6. Real-device acceptance is the main open gate: iOS Safari + Android Chrome,
   portrait/landscape, deployed `/Freyraum/` build.

## Previous next-agent starting point (2026-10-20)

1. Read `README.md`, active `plan.md`, latest `FINDINGS.md`, and
   `docs/REGRESSION_TOOLING.md` before changing the photo room or hub. The current
   photo-room view shares the gallery's selected artwork and timeline; it is a
   bounded 2D camera and must not change the artwork's projective registration.
2. The customer confirmed the local four-artwork museum after **Update
   Gallery.bat** on 2026-10-18 and supplied
   [a screenshot](https://github.com/user-attachments/assets/42d41643-45ca-4140-ba0c-5773ffc5e1aa).
   This is local evidence, not proof of a live deployed build.
3. Generated customer globals are ignored by Git. After a fresh download or JSON
   change run Update Gallery; developers use full `npm run build` (imports first).
   Injected config intentionally wins over the compiled fallback. Local output
   uses relative URLs; production uses `/Freyraum/`.
4. Focused photo-room structural and browser tests, lint, typecheck, and build
   pass. (Superseded 2026-10-21: the geometry suite was blocked at the
   doorway-height expectation then; since v1.42 `validate:museum-hub` passes.)
5. Post-merge live Pages verification and customer visual acceptance remain
   separate from local/browser checks. See `docs/DEPLOYMENT.md`; avoid relying on
   stale workflow-run IDs from earlier handoffs.
6. Deferred items include software-Chrome visual-harness investigations, existing
   dependency advisories, the large Fraktal source/bundle, missing optional
   text/alt metadata, desktop signing, and online-service setup.

Temporary `/tmp` captures from earlier sessions may not survive a fresh agent.
Regenerate evidence from the matching bundle and record the commit/environment.

## 2026-10-21 merge-readiness audit

All current Markdown files (28 plus the archive index) were rechecked for the
v1.41–v1.42 mobile state and their audit markers set to "v1.42 merge
readiness"; archived snapshots stay unchanged. Stale claims fixed: the
geometry-suite "blocked" notes (now passing), the merge gate (PR #27; `main`
holds v1.33–v1.40) and the photo-room suite status (green again, lesson 129).

## 2026-10-20 full Markdown audit matrix

| Class | Reviewed files | Audit outcome |
|---|---|---|
| Canonical (9) | `README.md`, `CHANGELOG.md`, `ARCHITECTURE_MAP.md`, `FINDINGS.md`, `plan.md`, `LESSONS_LEARNED.md`, `AI_RULES.md`, `DOCUMENTATION_RULES.md`, `CONTRIBUTING.md` | Current photo-room framing caveat, interaction-help details, and pan-cursor behavior are recorded; geometry-suite status remains documented |
| Operational (14) | `docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/CUSTOMER_TEXT_GUIDE.md`, `docs/DEPENDENCY_MAINTENANCE_PLAN.md`, `docs/DEPLOYMENT.md`, `docs/DESKTOP_APP.md`, `docs/HANDOFF.md`, `docs/IMAGE_MAINTENANCE_GUIDE.md`, `docs/ONLINE_EDITOR_SETUP.md`, `docs/QUERY_PARAMETERS.md`, `docs/REGRESSION_TOOLING.md`, `docs/ai-feedback/AI_FEEDBACK_LOOP.md`, `docs/architecture/README.md`, `docs/lessons-learned/README.md`, `docs/standards/CODING_GUIDELINES.md` | Customer photo-room guidance distinguishes zoomed panning from wheel/pinch/button zoom; handoff and regression tooling clarify that fixture success does not replace visual acceptance |
| Agent/template (5) | `.github/copilot-instructions.md`, `.github/prompts/architecture.prompt.md`, `.github/prompts/autonomous-agent.prompt.md`, `.github/prompts/refactor.prompt.md`, `.github/prompts/review.prompt.md` | Current repository context and prompts refreshed; Copilot guidance records the open screenshot uncertainty |
| Historical/index (8) | `docs/archive/README.md`, `docs/archive/architecture-map-history-2026-06-21.md`, `docs/archive/findings-history-2026-06-21.md`, `docs/archive/findings-history-2026-10-17.md`, `docs/archive/handoff-history-2026-06-21.md`, `docs/archive/plan-history-2026-06-21.md`, `docs/archive/plan-history-2026-10-17.md`, `docs/archive/readme-history-2026-06-21.md` | Index reviewed and dated; seven historical snapshots remain unchanged under the archive immutability rule; no active work was moved to history |

All 36 tracked Markdown files outside the prohibited agent-instruction directory
were inventoried. The 29 current documents (including the archive index) were
checked and their audit markers updated; archived snapshots retain their original
dates and claims by design.

The merge-readiness follow-up rechecked the README, customer picture guide,
changelog, active plan/findings, handoff, and regression instructions against the
current cursor behavior and browser test. Archived snapshots remain immutable.
