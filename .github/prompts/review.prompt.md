# Review prompt
> v0.56 doc-sync: reviewed during UX/readability/accessibility/performance audit on 2026-05-22.
> Last full markdown audit: 2026-09-04 (v1.12 full conversation documentation sync).

## v1.12 current context

Review hub changes against both the v5 four-work U/V/N contract and the exact
rendered artifact. Passing geometry does not close the current screenshot
mismatch or establish customer visual acceptance.

## v0.29 current context

Latest v0.29 status: metallic frame runtime implementation is shipped (M-01..M-08 complete). Future coding agents should consult `plan.md § v0.29` and `FINDINGS.md § v0.29` for as-built details and validation boundaries.



## v0.23 — Performance/Preloading Planning Audit

This section is retained as historical planning context from the 2026-05-21 all-docs sync (runtime v0.22 at that time). Current branch runtime baseline is documented in `README.md` and `CHANGELOG.md` (v0.73 sync; active frame baseline v0.69).

## v0.22 — shipped (2026-05-21) — Improved Preloading + Press-to-Start

Current status: shipped. Runtime now preloads albedo plus PBR texture sets for the first 15 artworks under the loading overlay, warms each cached artwork texture set on the GPU before reveal, keeps the branded loader visible for at least 500 ms, and waits for the accessible "Galerie betreten" button before entering the gallery. Validation: `npm run lint` and `npm run build` passed after implementation; `npm audit --audit-level=moderate` still reports the known Vite/esbuild development-server advisory that requires a semver-major upgrade.

## v0.21 — implementation shipped (2026-05-21)

Current status: shipped. The v0.21 plan is implemented in runtime code and documentation: branded progress loading overlay, Three.js LoadingManager progress, pre-reveal GPU warm render + awaited shader prewarm, audio `preload='auto'`, adjacent/idle PBR prefetch, lighting resume clamp, WebGL restore status, max-texture diagnostics, shader precision guard, 16K importer guidance, global pointer tracking, timeline arrows/counter/edge fades/responsive sizing/virtualized large-list rendering, and cleanup for added global listeners. Future-only boundaries remain LOD/tiled streaming for device-limited 16K detail and grouped/page timeline navigation for very large exhibitions.


## v0.20.8 — Complete v0.20 implementation shipped (2026-05-21)

Current status: shipped. The v0.20.7 gap-closure plan is now implemented in code and this file was refreshed during the all-markdown sync. Remaining v0.20 audio/control quality gaps are closed: fade targets clamp to the 0.30 effective-gain ceiling, diagnostics include display percent, preference patching updates non-slider controls during volume drags, sliders expose German percent value text, zero-volume recovery logs stored/recovered values, first-interaction recovery also covers pre-play audio, unmute resumes within `BackgroundAudioManager`, slider fill CSS stores percentages, and the ended-loop fallback fade is shortened to 50 ms. F-09 was confirmed correct and required no code change.

## v0.18 — Customer sidecar text shipped (2026-05-20)

Current status: shipped. The importer (`scripts/import-artworks.mjs`) reads same-basename `.txt` sidecars (`.md` accepted as a backup) and merges customer-facing metadata into the generated manifest. Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned. Canonical plan: `plan.md § v0.18`. Research log: `FINDINGS.md § 2026-05-20`. Customer guide: `docs/CUSTOMER_TEXT_GUIDE.md`. Template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.

Use this prompt for self-review or PR review.

## Review focus

- Correctness: Does the change solve the reported problem completely?
- Regression risk: Could it affect rendering fidelity, navigation, preferences, importer output, or customer preview?
- Accessibility: Are `aria-modal`, `aria-labelledby`, keyboard focus return, reduced-motion, touch, viewport, and safe-area behaviors preserved?
- Performance: Are layout reads batched, GPU changes intentional, and diagnostics signal-to-noise controlled?
- Security: Are injected artwork data, URLs, generated files, and browser APIs handled defensively?
- Maintainability: Does the change follow current module ownership and naming patterns?

## Required checks

- Confirm existing lint/build/test scripts that apply to the touched area.
- Verify generated preview assets if runtime/style output changed.
- Confirm docs reflect actual committed behavior.
- Record reusable lessons if the change fixes a regression or exposes a repeated mistake.

## Related prompts

- Architecture context: [`architecture.prompt.md`](./architecture.prompt.md)
- Refactor work: [`refactor.prompt.md`](./refactor.prompt.md)
- Autonomous loop: [`autonomous-agent.prompt.md`](./autonomous-agent.prompt.md)
