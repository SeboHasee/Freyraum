# FREYRAUM Handoff Guide

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
6. For a grey artwork, first check the `source-to-pixel-outcome` diagnostic
   entry for that artwork/route (via the documented diagnostics API); it names
   the resolved candidate and, on failure, the first failed stage
   (`candidate-selected`, `request`, `decode`, `compatibility-check`,
   `gpu-upload`, or `visible-pixel-probe`). Enable verbose diagnostics mode to
   also capture the bounded GPU visible-pixel probe result. The implemented
   recovery is canonical in `plan.md § v0.92`. Do not treat an importer report
   or a published asset file as proof that a browser uploaded visible artwork
   pixels.
7. If behavior differs from docs, treat as drift and update canonical docs in the same fix PR.

## Handoff checklist

- [ ] Current behavior validated against runtime code
- [ ] Canonical docs linked (not duplicated)
- [ ] Customer-facing instructions verified end-to-end
- [ ] Asset-size constraints and publish-path assumptions explicitly handed off
- [ ] Known risks and deferred upgrades linked from maintenance docs

## Canonical references

- `README.md`
- `CHANGELOG.md`
- `docs/QUERY_PARAMETERS.md`
- `ARCHITECTURE_MAP.md`
- `CONTRIBUTING.md`
- `docs/DEPENDENCY_MAINTENANCE_PLAN.md`
- `docs/REGRESSION_TOOLING.md`
- `docs/IMAGE_MAINTENANCE_GUIDE.md`
