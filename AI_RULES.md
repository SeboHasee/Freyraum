# FREYRAUM AI rules
> Latest markdown audit: 2026-10-20 (photo-room screenshot follow-up).

## v1.33–v1.40 editor, saving and desktop rules

Current summary: `.github/copilot-instructions.md` § Current context (v1.40).

- One placement truth: every placement check (editor drag, loader, warnings,
  export) goes through `evaluateDisplayedPlacement`; never add a second
  validity rule, and never relocate canonical placements on load.
- Wall calibration edits must not change artwork size or ratio
  (`calibratedWallScaleAt`); keep `referenceQuad` the calibration quad.
- Never stringify or put artwork thumbnails (possibly multi-MB `data:` URLs)
  into DOM attributes or signatures; use `thumbnailKey()`.
- Save rules live once in `src/online/publishRules.ts` (editor, `worker/`,
  desktop store); keep upload IDs in sync with the importer.
- The desktop app writes only through `scripts/local-project/projectStore.ts`;
  the page gets no Node access and reads only the `freyraum://app/` allowlist.
- Object URLs of saved uploads stay alive until reload (`markPublished`), so
  the open editor keeps showing them.

## v1.18 artwork-editor rule

Use `OPEN_ARTWORK_EDITOR.html` for customer placement. Editable wall quads must
update dependent projections together and preserve physical artwork size through
calibration-scale compensation. Room counts and known-artwork assignments may
change on import; reject incompatible fixed camera/3D room/wall models, not
supported editable state. Export preserves rendered and bounds-only walls and
fixed configuration fields. Layout hints never block save/export; real errors do.
Keep customer-data cache busting synchronized across every generated `file://`
entry. Museum and editor share photograph-backed calibrated DOM artwork; never
cover that photograph with an opaque WebGL architectural room.

## v1.12 hub visual-acceptance rule

Treat the v5 museum-hub config and resolved U/V/N geometry as source truth, but
do not call placement fixed from structural tests alone. Preserve the exact
customer artifact, generated bundle, config, room counter, and screenshot;
reopen acceptance whenever visible artwork count or composition disagrees with
the four-work 2+1+1 contract. Never infer billing/usage state from an unavailable
image or browser tool.

## v0.58 topbar/utility-button rule

All topbar utility buttons must be 44×44px standalone glass circles with inline SVG icons (`aria-hidden="true"`), `aria-label`, and an adjacent `role="tooltip"` element connected via `aria-describedby`. Buttons must have `pointer-events: auto` (either directly or via a parent group). Never use the `.nav-btn` class for topbar utility buttons — it is reserved for the 72px navigation controls.

When adding new topbar actions, append them to `.topbar__right`. Maintain `prefers-reduced-motion` support for any transitions or animations.

## v0.57 font rule

All fonts used in the production gallery must be self-hosted in `public/fonts/` with `@font-face` declarations in `main.scss`. Do not use render-blocking `<link rel="stylesheet">` CDN font links in `app.html`. Google Fonts CDN may be used in development `.env.local` setups only.

## v0.47 frame-realism rule

When tuning metallic frames from screenshot feedback, verify brush-direction mapping across all frame bars and prefer subtle satin continuity over high-contrast stripe visibility.

## v0.40 material-fidelity planning rule

When documenting metal/material upgrades, explicitly distinguish shipped runtime behavior from research-only plans, and include anti-repetition constraints (macro variation, per-instance variation, and subtle intensity bounds) before declaring a surface “premium” or “natural.”

## v0.29 preload/fidelity planning rule

When addressing loading-screen smoothness or painting fidelity, do not rely on “loaded” or “compiled” as sufficient proof. Require diagnostics for full-size presented frames, final-path artwork warm coverage, post-processing readiness, UI/control prebuild, and source-vs-render color checks before describing the site as smooth or original-looking.

## v0.93 artwork-recovery rule

For a grey or blank customer artwork, first identify the visible route
signature and prove the same source through request, decode, compatibility, GPU
binding, and visible pixels. When the report is local-only, reproduce the exact
`file://` preview, preserve the generated `customer-preview/customer-artworks.js`
and matching `images/` output, and remember that a healthy local museum-hub
recovery may deliberately choose embedded `webglImage` instead of the declared
file URL. Do not claim a script-relative URL, importer report, or
`LoadingManager` completion resolves the incident by itself. Keep hub
`MeshBasicMaterial` recovery separate from gallery PBR/lighting fidelity, and
preserve the existing PNG importer plus its bounded embedded fallback.

## v0.23 performance documentation rule

When auditing or implementing preload/performance changes, distinguish these states explicitly: fetched/decoded texture, authored PBR set loaded, procedural maps generated, material variant compiled, and texture uploaded to GPU. Do not call a path “fully smooth” or “jank-free” unless diagnostics prove no first-navigation work remains for the target gallery size.

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
