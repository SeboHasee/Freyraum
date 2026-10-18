# FREYRAUM Handoff Guide
> Latest markdown audit: 2026-10-18 (photograph-backed museum follow-up).

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

## Next-agent starting point (2026-10-18)

1. Read `README.md` → "Place artworks", active `plan.md`, and the latest
   `FINDINGS.md` before changing geometry or mappings. All four genuine source
   images now exist; the old `gartenszene`/`zdigital` content blockers are resolved.
   Do not restore those obsolete IDs or rename the actual `Gatrenszene.png`.
2. The customer confirmed the local setup works after **Update Gallery.bat** and
   provided [this screenshot](https://github.com/user-attachments/assets/42d41643-45ca-4140-ba0c-5773ffc5e1aa)
   on 2026-10-18. It shows the requested arrangement. It is local evidence,
   not evidence that the branch has deployed; its build identity was not supplied.
3. Generated customer globals are ignored by Git. After a fresh download or JSON
   change run Update Gallery; developers use full `npm run build` (imports first).
   Injected config intentionally wins over the compiled fallback. Preserve that
   customer authority. Local output uses relative URLs; production uses `/Freyraum/`.
4. Merge checks and known limitations live in `docs/REGRESSION_TOOLING.md` and
   `FINDINGS.md`. Root `file://` and production-base HTTP smoke verify decoded
   images, visible screenshot contribution and editor projection parity.
   Do not conflate those checks with a complete Type A visual-suite pass.
5. Before merging, inspect/approve outstanding Actions checks. The observed desktop
   run [39156014733](https://github.com/SeboHasee/Freyraum/actions/runs/39156014733)
   requires owner approval. No open PR was returned by the API during this audit;
   this task does not create or merge one.
6. The latest observed main Pages run
   [39115237783](https://github.com/SeboHasee/Freyraum/actions/runs/39115237783)
   failed on the obsolete `gartenszene`/`zdigital` IDs. Those inputs are corrected
   here and current deploy validation passes. Do not rerun that old commit and
   expect new content; merge and verify the new deploy plus live smoke instead.
   See `docs/DEPLOYMENT.md` for the operator checklist.
7. Deferred, not silently fixed: software-Chrome shadow/selection/restore visual
   harness investigations, dev-tool advisories, large Fraktal source/bundle,
   missing optional text/alt metadata, desktop signing and online-service setup.
   Do not redesign high-resolution delivery or upgrade dependencies incidentally.

Temporary `/tmp` captures from earlier sessions may not survive a fresh agent.
Regenerate evidence from the matching bundle and record the commit/environment.

## Handoff checklist

- [x] Current behavior validated against runtime code and focused regressions
- [x] Canonical docs linked (not duplicated)
- [x] Local update confirmed by customer; production-build smoke verified
- [x] Asset-size constraints and publish-path assumptions explicitly handed off
- [x] Known risks and deferred upgrades linked from maintenance docs
- [ ] Owner completes CI approval, merge, and new live Pages smoke verification

## 2026-10-17 full Markdown audit matrix

| Class | Reviewed files | Audit outcome |
|---|---|---|
| Canonical | `README.md`, `CHANGELOG.md`, `ARCHITECTURE_MAP.md`, `FINDINGS.md`, `plan.md`, `LESSONS_LEARNED.md`, `AI_RULES.md`, `DOCUMENTATION_RULES.md`, `CONTRIBUTING.md` | v1.33–v1.40 (drag, placement truth, rooms, online saving, desktop app, Windows CI) synchronized; `plan.md` reduced to active work, older plan/findings archived |
| Operational | `docs/CUSTOMER_PICTURE_GUIDE.md`, `CUSTOMER_TEXT_GUIDE.md`, `DEPENDENCY_MAINTENANCE_PLAN.md`, `DEPLOYMENT.md`, `DESKTOP_APP.md`, `HANDOFF.md`, `IMAGE_MAINTENANCE_GUIDE.md`, `ONLINE_EDITOR_SETUP.md`, `QUERY_PARAMETERS.md`, `REGRESSION_TOOLING.md`, `ai-feedback/AI_FEEDBACK_LOOP.md`, `architecture/README.md`, `lessons-learned/README.md`, `standards/CODING_GUIDELINES.md` | Three save paths, test command table, operations handoff synchronized; repeated v0.18–v0.23 status blocks removed |
| Agent/template | `.github/copilot-instructions.md`, `.github/prompts/*.prompt.md` | One current-context block in copilot-instructions; prompts link to it |
| Historical | `docs/archive/README.md` and its dated snapshots | Two 2026-10-17 snapshots added (plan, findings); older snapshots unchanged |

Historical snapshots retain their original dates and claims by design.

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
