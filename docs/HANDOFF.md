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

## 2026-10-18 Markdown follow-up

All repository Markdown outside dependencies and `.github/agents` was reviewed
for this presentation/editor correction; dated archives remain unchanged.
Current canonical docs supersede old read-only-wall, warning-blocking and
fixed-assignment import claims. The photograph exists; the audited JSON
referenced a different lowercase/hyphenated filename. Tests, builds and browser
acceptance are owned by the implementation pass, not this documentation audit.
That pass reproduced the current `file://` baseline (evidence reported at
`/tmp/freyraum-before`): only two genuine imported works exist; `gartenszene` and
`zdigital` remain unresolved and must be supplied by the owner. Preserve their
JSON IDs with no substitutions. The baseline also throws an `onBeforeCompile`
TypeError during hub renderer initialization; photo presentation avoids that
unused opaque renderer. Neither observation proves the final correction passes.
The implementation pass subsequently captured the built preview at
`/tmp/freyraum-after`: exact photograph and both available paintings visible in
museum/editor, no hub canvas. Lint/typecheck/build/frame/docs-authority and
editor-rooms pass; deploy/save-service/local-project/editor-publish remain
content-blocked. Geometry and HTTP photographic smoke (including pixel
contribution and editor homography parity) now pass. Type A capture remains
blocked by the pre-existing software-Chrome shadow-light-count invariant;
owner acceptance remains open in `plan.md`.
Rebuilt HTTP and `file://` transparent-primary recovery/source assertions pass
and screenshots are captured; the capture command still exits 1 solely for that
shadow invariant. Do not report this as a complete visual-suite pass.

## Handoff checklist

- [ ] Current behavior validated against runtime code
- [ ] Canonical docs linked (not duplicated)
- [ ] Customer-facing instructions verified end-to-end
- [ ] Asset-size constraints and publish-path assumptions explicitly handed off
- [ ] Known risks and deferred upgrades linked from maintenance docs
- [ ] Screenshot-producing artifact and generated bundles preserved for visual incidents

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
