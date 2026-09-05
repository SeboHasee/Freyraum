# FREYRAUM Handoff Guide
> Latest markdown audit: 2026-09-05 (v1.18 artwork-editor conversation sync).

This guide covers current handoff and support operations.
Historical release-by-release details are in `CHANGELOG.md` and `docs/archive/`.

## What to hand off

- Current runtime behavior and constraints (reference `README.md`).
- Configuration behavior (`docs/QUERY_PARAMETERS.md`).
- Customer import/update workflow (`docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/CUSTOMER_TEXT_GUIDE.md`).
- Current image-size constraints and the high-resolution publishing roadmap (`docs/IMAGE_MAINTENANCE_GUIDE.md`, `plan.md`).
- Architecture ownership (`ARCHITECTURE_MAP.md`).
- Open active work (`plan.md`) and active findings (`FINDINGS.md`).

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
   bounded GPU visible-pixel probe result. In a healthy local-preview hub
   recovery, `candidateMode: "embedded-webgl-fallback"` is now expected when
   the declared image file URL is not WebGL-stable. Preserve the generated
   customer bundle before re-importing, and follow the implemented recovery in
   `plan.md § v0.93`. Do not treat an importer report or a published asset file
   as proof that a browser uploaded visible artwork pixels.
7. If behavior differs from docs, treat as drift and update canonical docs in the same fix PR.
8. For a hub-layout mismatch, preserve the exact route/environment, visible room
   counter, commit/build identity, generated `customer-artworks.js`, injected
   `museum-hub.json`, resolved slot/page diagnostics, and screenshot before
   regenerating output. Confirm that only the active page group is visible.
9. Do not infer account usage or billing state from unavailable image/browser
   tooling; report the tool limitation independently.
10. For placement support, start from `OPEN_ARTWORK_EDITOR.html`. Preserve the
    exported JSON and exact generated editor. Confirm fixed configuration
    compatibility, complete canonical round trip, fresh cache-busted customer
    bundles, and explicit green-zone confirmation before requesting a screenshot.

## Handoff checklist

- [ ] Current behavior validated against runtime code
- [ ] Canonical docs linked (not duplicated)
- [ ] Customer-facing instructions verified end-to-end
- [ ] Asset-size constraints and publish-path assumptions explicitly handed off
- [ ] Known risks and deferred upgrades linked from maintenance docs
- [ ] Screenshot-producing artifact and generated bundles preserved for visual incidents

## 2026-09-05 full Markdown audit matrix

| Class | Reviewed files | Audit outcome |
|---|---|---|
| Canonical | `README.md`, `CHANGELOG.md`, `ARCHITECTURE_MAP.md`, `FINDINGS.md`, `plan.md`, `LESSONS_LEARNED.md`, `AI_RULES.md`, `DOCUMENTATION_RULES.md`, `CONTRIBUTING.md` | Current v1.18 editor, deterministic placement, and open customer acceptance synchronized |
| Operational | `docs/CUSTOMER_PICTURE_GUIDE.md`, `CUSTOMER_TEXT_GUIDE.md`, `DEPENDENCY_MAINTENANCE_PLAN.md`, `DEPLOYMENT.md`, `HANDOFF.md`, `IMAGE_MAINTENANCE_GUIDE.md`, `QUERY_PARAMETERS.md`, `REGRESSION_TOOLING.md`, `ai-feedback/AI_FEEDBACK_LOOP.md`, `architecture/README.md`, `lessons-learned/README.md`, `standards/CODING_GUIDELINES.md` | Standalone editor workflow, fixed/editable boundary, exact round trip, cache behavior, and validation synchronized; unaffected policies re-reviewed |
| Agent/template | `.github/copilot-instructions.md`, `.github/prompts/architecture.prompt.md`, `autonomous-agent.prompt.md`, `refactor.prompt.md`, `review.prompt.md` | Current v1.18 editor safeguards and acceptance boundary synchronized |
| Historical | `docs/archive/README.md` and its five `*-history-2026-06-21.md` snapshots | Index reviewed on 2026-09-05; snapshots intentionally unchanged |

All 32 repository Markdown files were reviewed. Historical snapshots retain
their original dates and claims by design.

## Canonical references

- `README.md`
- `CHANGELOG.md`
- `docs/QUERY_PARAMETERS.md`
- `ARCHITECTURE_MAP.md`
- `CONTRIBUTING.md`
- `docs/DEPENDENCY_MAINTENANCE_PLAN.md`
- `docs/REGRESSION_TOOLING.md`
- `docs/IMAGE_MAINTENANCE_GUIDE.md`
