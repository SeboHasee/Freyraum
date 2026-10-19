# FREYRAUM Handoff Guide
> Latest markdown audit: 2026-10-19 (repository-wide documentation review).

This guide covers current handoff and support operations.
Historical release-by-release details are in `CHANGELOG.md` and `docs/archive/`.

## What to hand off

- Current runtime behavior and constraints (reference `README.md`).
- Configuration behavior (`docs/QUERY_PARAMETERS.md`).
- Customer import/update workflow (`docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/CUSTOMER_TEXT_GUIDE.md`).
- Current image-size constraints and the high-resolution publishing roadmap (`docs/IMAGE_MAINTENANCE_GUIDE.md`, `plan.md`).
- Architecture ownership (`ARCHITECTURE_MAP.md`).
- Open active work (`plan.md`) and active findings (`FINDINGS.md`).
- Online editor and save service (`docs/ONLINE_EDITOR_SETUP.md`).
- FREYRAUM Editor desktop app (`docs/DESKTOP_APP.md`).

## Operations handoff (v1.38–v1.40)

- **Online save service:** the owner keeps the Cloudflare account, the Worker
  secrets (shared editor password, session key, GitHub App private key) and
  the repository-only GitHub App. Secrets live only in Cloudflare, never in
  the repository. Rotate the editor password with `wrangler secret put`; edits
  arrive as pull requests from `content/edits` unless `PUBLISH_MODE=auto-merge`.
  Steps: `docs/ONLINE_EDITOR_SETUP.md`.
- **Desktop releases:** builds run in `.github/workflows/desktop-release.yml`.
  Runs started by Copilot/bots need **Approve and run** in the Actions tab.
  Test downloads are the run artifact `FREYRAUM-Editor-Windows`; a release is
  published by **Run workflow** on `main` with "publish" (pre-release
  `desktop-v<version>`) or by pushing a matching `desktop-vX.Y.Z` tag. Raise
  `"version"` in `desktop/package.json` before each release.
- **Signing (future):** builds are unsigned (one-time SmartScreen/Gatekeeper
  warning). Adding the signing secrets listed in `docs/DESKTOP_APP.md` signs
  them without workflow changes; automatic updates require signing first.

## Photo-room controls and current validation (2026-10-19)

- Four configured photo rooms are available: Schlafzimmer, Wohnraum, Wohnbereich,
  and Büro. Cleaned `gallery-*.png` derivatives are displayed while the originals
  remain preserved; the structural pixel regression checks cleanup seams and
  painting removal for each source.
- Run Update Gallery after pulling these changes so all four configured photos are
  staged for the local `file://` preview.
- The photo room reuses the gallery's single artwork timeline and selected-work
  state. It also uses the gallery-style return and zoom/reset controls and the
  shared help, audio, settings, and fullscreen widgets. The room selector is
  distinct from artwork selection.
- The control layout was checked at desktop, tablet, portrait-phone, and
  short-landscape sizes. Its UI changes do not alter the photo camera or
  projective artwork registration. Customer visual acceptance remains separate
  from automated browser checks.
- Passing: `npm run build`, `npm run lint`, `npm run build:typecheck`,
  `npm run test:gallery-room-view`, and
  `FREYRAUM_CHROME_PATH=/usr/bin/google-chrome npm run test:gallery-room-view:browser`.
- The four-room browser run decoded each background and checked control bounds
  at desktop, tablet, portrait phone, and short landscape. Deploy validation,
  front-wall aspect, WebGL resilience, frame-budget, and config-authority checks
  also passed. Build output retains existing classic-script and large-chunk
  warnings; deploy validation reports the existing large Fraktal inbox warning.
- `npm run validate:museum-hub` now passes the former stale timeline assertion
  after its test was corrected to check the active timeline thumbnail. It still
  fails at `scripts/test-museum-hub-geometry.mjs:411` on the wall-left doorway
  height expectation. This separate calibrated-geometry issue remains open; do
  not report the complete museum-hub suite as passing.
- Documentation scope for this update: all 36 repository Markdown files were
  inventoried and checked. Current operational docs and agent prompts were
  refreshed where relevant; the seven dated archive snapshots remain unchanged
  under `DOCUMENTATION_RULES.md`, and the archive index was reviewed.

## Support diagnostics workflow

1. Reproduce issue with exact browser/device context.
2. Collect diagnostics via the documented diagnostics API in `docs/QUERY_PARAMETERS.md` (`exportJson()` preferred).
3. For performance/regression reports, run the tools documented in `docs/REGRESSION_TOOLING.md` (`checkInvariants()`, `startPerf()` / `stopPerf()`, and `checkTier1Thresholds()` where applicable).
4. Confirm whether behavior is expected under current startup mode/config.
5. For publish/update failures, confirm the asset path did not rely on oversized GitHub-tracked originals.
6. For a grey or blank artwork, first classify the route signature: gallery
   generated fallback, hub title placeholder, or blank local `file://` hub wall
   plane. Then check the `source-to-pixel-outcome` diagnostic entry for that
   artwork/route (via the documented diagnostics API); it names the resolved
   candidate and, on failure, the first failed stage (`candidate-selected`,
   `request`, `decode`, `compatibility-check`, `gpu-upload`, or
   `visible-pixel-probe`). Enable verbose diagnostics mode to also capture the
   bounded GPU visible-pixel probe result for an active WebGL path. For the
   photograph-backed museum/editor, inspect the decoded DOM image, visible
   artwork owner and calibrated transform instead. Its source-to-pixel outcome
   has `presentationPath: 'dom'`, native decoded source dimensions and null
   GPU/probe fields: this proves decode, not GPU upload or visible pixels.
   Keep source URLs redacted; inspection-gallery behavior is unchanged.
   In a healthy local-preview hub
   recovery, `candidateMode: "embedded-webgl-fallback"` is now expected when
   the declared image file URL is not WebGL-stable. Preserve the generated
   customer bundle before re-importing, and follow the implemented recovery in
   `docs/archive/plan-history-2026-10-17.md` § v0.93. Do not treat an importer report or a published asset file
   as proof that a browser uploaded visible artwork pixels.
7. If behavior differs from docs, treat as drift and update canonical docs in the same fix PR.
8. For a hub-layout mismatch, preserve the exact route/environment, visible room
   counter, commit/build identity, generated `customer-artworks.js`, injected
   `museum-hub.json`, resolved slot/page diagnostics, and screenshot before
   regenerating output. Confirm that only the active page group is visible,
   and museum/editor show the same photograph-backed DOM artwork projection.
   The 2026-10-18 source audit verified structural divergence from the former
   opaque WebGL room, not reproduction of the unavailable customer artifact.
9. Do not infer account usage or billing state from unavailable image/browser
   tooling; report the tool limitation independently.
10. For placement support, start from `OPEN_ARTWORK_EDITOR.html`. Preserve the
    exported JSON and exact generated editor. Confirm fixed configuration
    compatibility, complete canonical round trip and fresh cache-busted customer
    bundles before requesting a screenshot. Room/assignment changes are supported;
    green-zone confirmation is optional and hints do not block saving.

## Next-agent starting point (2026-10-19)

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
   pass. The geometry suite remains blocked at the wall-left doorway-height
   expectation (`scripts/test-museum-hub-geometry.mjs:411`), after the stale
   timeline assertion was corrected. Do not claim a complete geometry-suite pass.
5. Post-merge live Pages verification and customer visual acceptance remain
   separate from local/browser checks. See `docs/DEPLOYMENT.md`; avoid relying on
   stale workflow-run IDs from earlier handoffs.
6. Deferred items include software-Chrome visual-harness investigations, existing
   dependency advisories, the large Fraktal source/bundle, missing optional
   text/alt metadata, desktop signing, and online-service setup.

Temporary `/tmp` captures from earlier sessions may not survive a fresh agent.
Regenerate evidence from the matching bundle and record the commit/environment.

## Handoff checklist

- [x] Current behavior validated against runtime code and focused regressions
- [x] Canonical docs linked (not duplicated)
- [x] Local update confirmed by customer; production-build smoke verified
- [x] Asset-size constraints and publish-path assumptions explicitly handed off
- [x] Known risks and deferred upgrades linked from maintenance docs
- [ ] Owner completes CI approval, merge, and new live Pages smoke verification

## 2026-10-19 full Markdown audit matrix

| Class | Reviewed files | Audit outcome |
|---|---|---|
| Canonical (9) | `README.md`, `CHANGELOG.md`, `ARCHITECTURE_MAP.md`, `FINDINGS.md`, `plan.md`, `LESSONS_LEARNED.md`, `AI_RULES.md`, `DOCUMENTATION_RULES.md`, `CONTRIBUTING.md` | Photo-room controls and customer background workflow documented; obsolete timeline-test failure corrected; remaining doorway-height failure recorded |
| Operational (14) | `docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/CUSTOMER_TEXT_GUIDE.md`, `docs/DEPENDENCY_MAINTENANCE_PLAN.md`, `docs/DEPLOYMENT.md`, `docs/DESKTOP_APP.md`, `docs/HANDOFF.md`, `docs/IMAGE_MAINTENANCE_GUIDE.md`, `docs/ONLINE_EDITOR_SETUP.md`, `docs/QUERY_PARAMETERS.md`, `docs/REGRESSION_TOOLING.md`, `docs/ai-feedback/AI_FEEDBACK_LOOP.md`, `docs/architecture/README.md`, `docs/lessons-learned/README.md`, `docs/standards/CODING_GUIDELINES.md` | Customer instructions now describe shared timeline selection, room switching, navigation, zoom/reset, and preserved camera behavior; test instructions match current browser coverage |
| Agent/template (5) | `.github/copilot-instructions.md`, `.github/prompts/architecture.prompt.md`, `.github/prompts/autonomous-agent.prompt.md`, `.github/prompts/refactor.prompt.md`, `.github/prompts/review.prompt.md` | Current context now includes photo-room DOM ownership, shared timeline/utility behavior, focused tests, and the open geometry-suite failure |
| Historical/index (8) | `docs/archive/README.md`, `docs/archive/architecture-map-history-2026-06-21.md`, `docs/archive/findings-history-2026-06-21.md`, `docs/archive/findings-history-2026-10-17.md`, `docs/archive/handoff-history-2026-06-21.md`, `docs/archive/plan-history-2026-06-21.md`, `docs/archive/plan-history-2026-10-17.md`, `docs/archive/readme-history-2026-06-21.md` | Index reviewed and dated; seven historical snapshots remain unchanged under the archive immutability rule; no active work was moved to history |

All 36 tracked Markdown files outside the prohibited agent-instruction directory
were inventoried. The 28 current documents were checked and their audit markers
updated; archived snapshots retain their original dates and claims by design.

## Canonical references

- `README.md`
- `CHANGELOG.md`
- `docs/QUERY_PARAMETERS.md`
- `ARCHITECTURE_MAP.md`
- `CONTRIBUTING.md`
- `docs/DEPENDENCY_MAINTENANCE_PLAN.md`
- `docs/REGRESSION_TOOLING.md`
- `docs/IMAGE_MAINTENANCE_GUIDE.md`
- `docs/ONLINE_EDITOR_SETUP.md`
- `docs/DESKTOP_APP.md`
