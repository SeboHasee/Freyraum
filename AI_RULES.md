# FREYRAUM AI rules
> Last full markdown audit: 2026-05-21 (v0.20.5 audio regression audit + recovery plan).

## v0.20.5 — Audio bugfix constraints after failed follow-up (2026-05-21)

The current audio implementation is **not** a finished precedent. Until the next fix lands:

- Do **not** treat the current power-curve mapping in `src/audio/volumeMapping.ts` as canonical; the requested contract is `display 0..100 ↔ effective 0..0.30`.
- Do **not** let `HTMLMediaElement.volume` feedback overwrite the persisted/user-selected target loudness. Fade envelopes and mute transitions must operate on live element state only.
- Do **not** render quick-control slider values from transient fade state; both sliders must reflect the same target loudness source of truth.
- Do **not** preserve the current bottom-left quick-control placement as if it were approved.
- Keep detailed diagnostics when touching audio state transitions, because startup-muted and unmute-at-0 regressions are now confirmed failure modes.

## v0.20.3 — Audio implementation planning constraints (2026-05-20)

Implemented in v0.20.4.

## v0.20 — Audio workflow reliability shipped (2026-05-20)

Background-audio workflow is now implemented. Preserve one-click customer launchers, warning-first importer behavior for invalid audio assets, and diagnostics-backed autoplay/lifecycle handling for ongoing maintenance.

## v0.18 — Customer sidecar text shipped (2026-05-20)

Current status: shipped. The importer (`scripts/import-artworks.mjs`) reads same-basename `.txt` sidecars (`.md` accepted as a backup) and merges customer-facing metadata into the generated manifest. Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned. Canonical plan: `plan.md § v0.18`. Research log: `FINDINGS.md § 2026-05-20`. Customer guide: `docs/CUSTOMER_TEXT_GUIDE.md`. Template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.

Hard constraints for AI-assisted work in this repository.

## Architecture

- Keep `src/main.ts` as the orchestration layer; do not move feature logic there unless it wires existing modules together.
- Keep rendering infrastructure in `src/core/`, gallery/domain behavior in `src/gallery/`, material fidelity in `src/materials/`, and DOM controls in `src/ui/` or `src/timeline/`.
- Keep customer artwork/audio import logic in `scripts/` and preserve friendly Node compatibility errors.
- Do not treat `customer-preview/` as source of truth. It is rebuilt output.

## Forbidden patterns

- Do not add new dependencies for tasks that can be solved with TypeScript, three.js, Vite, or existing utilities.
- Do not bypass `getDiagnostics()` / `createScopedDiagnostics()` with permanent ad-hoc console logging.
- Do not reduce painting material fidelity as a side effect of accessibility or performance work.
- Do not apply CSS containment to popover anchors or hover-scaled control containers without testing overflow paint.
- Do not accept arbitrary injected artwork URLs where a validated data URL is required.
- Do not use `isMobileDevice()` (removed in v0.17). Use `detectDeviceCapabilities()` from `src/utils/device.ts` instead.
- Do not import `MouseInteraction`, `TouchInteraction`, or `ZoomPan` (removed in v0.17). Use `CanvasInteraction` for all canvas input.

## Required patterns

- Validate injected/customer data defensively and log rejected entries.
- Keep disposal idempotent for lifecycle-sensitive WebGL/input classes.
- Batch resize/layout work through the existing coordinator pattern.
- Preserve reduced-motion behavior as a motion control, not a visual quality control.
- Update documentation for meaningful behavior, workflow, architecture, or regression changes.
- Every custom `role="dialog"` element must have `aria-modal="true"`, `aria-labelledby` (pointing to a stable heading id), and focus returned to the opener on every dismiss path. Reference: ARIA APG dialog pattern.

## Validation

- Fresh clones need `npm install` before lint/build.
- Use existing scripts: `npm run lint`, `npm run build`, and focused checks for touched scripts.
- If runtime or SCSS changes affect preview output, rebuild and commit the relevant `customer-preview/` output.

## Audit and dependency rules

- Treat `npm audit` findings as maintenance signals unless the task is a dependency/security fix; document severity, package path, and whether an available fix is semver-major.
- Do not apply `npm audit fix --force` automatically. Major tooling upgrades need a dedicated PR with lint/build/customer-preview validation.
- If lint prints supported-version warnings, document the resolved package versions and align the toolchain in a focused pass instead of suppressing warnings.
- For browser APIs with partial support (`requestIdleCallback`, Long Tasks API, Page Lifecycle), keep runtime feature detection and fallback behavior documented in `FINDINGS.md`.

See `LESSONS_LEARNED.md` and `docs/lessons-learned/` for the incidents that justify these rules.
