# Refactor prompt
> Last full markdown audit: 2026-05-22 (v0.47 shipped: frame metal realism retuned with bar-aligned brushing, softer satin highlights, and reduced zebra banding).

## v0.29 current context

Latest v0.29 status: metallic frame runtime implementation is shipped (M-01..M-08 complete). Future coding agents should consult `plan.md § v0.29` and `FINDINGS.md § v0.29` for as-built details and validation boundaries.



## v0.23 — Performance/Preloading Planning Audit

This Markdown file was refreshed during the 2026-05-21 all-docs sync. The current runtime is still v0.22; the open performance work is documented in `plan.md § v0.23`, with source-referenced audit notes in `FINDINGS.md § v0.23`. Key boundary: v0.22 improves the first 15 artworks, but large-gallery GPU warming, synchronous procedural map generation, and best-effort idle prefetch remain planned N-series work.

## v0.22 — shipped (2026-05-21) — Improved Preloading + Press-to-Start

Current status: shipped. Runtime now preloads albedo plus PBR texture sets for the first 15 artworks under the loading overlay, warms each cached artwork texture set on the GPU before reveal, keeps the branded loader visible for at least 500 ms, and waits for the accessible "Galerie betreten" button before entering the gallery. Validation: `npm run lint` and `npm run build` passed after implementation; `npm audit --audit-level=moderate` still reports the known Vite/esbuild development-server advisory that requires a semver-major upgrade.

## v0.21 — implementation shipped (2026-05-21)

Current status: shipped. The v0.21 plan is implemented in runtime code and documentation: branded progress loading overlay, Three.js LoadingManager progress, pre-reveal GPU warm render + awaited shader prewarm, audio `preload='auto'`, adjacent/idle PBR prefetch, lighting resume clamp, WebGL restore status, max-texture diagnostics, shader precision guard, 16K importer guidance, global pointer tracking, timeline arrows/counter/edge fades/responsive sizing/virtualized large-list rendering, and cleanup for added global listeners. Future-only boundaries remain LOD/tiled streaming for device-limited 16K detail and grouped/page timeline navigation for very large exhibitions.


## v0.20.8 — Complete v0.20 implementation shipped (2026-05-21)

Current status: shipped. The v0.20.7 gap-closure plan is now implemented in code and this file was refreshed during the all-markdown sync. Remaining v0.20 audio/control quality gaps are closed: fade targets clamp to the 0.30 effective-gain ceiling, diagnostics include display percent, preference patching updates non-slider controls during volume drags, sliders expose German percent value text, zero-volume recovery logs stored/recovered values, first-interaction recovery also covers pre-play audio, unmute resumes within `BackgroundAudioManager`, slider fill CSS stores percentages, and the ended-loop fallback fade is shortened to 50 ms. F-09 was confirmed correct and required no code change.

## v0.18 — Customer sidecar text shipped (2026-05-20)

Current status: shipped. The importer (`scripts/import-artworks.mjs`) reads same-basename `.txt` sidecars (`.md` accepted as a backup) and merges customer-facing metadata into the generated manifest. Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned. Canonical plan: `plan.md § v0.18`. Research log: `FINDINGS.md § 2026-05-20`. Customer guide: `docs/CUSTOMER_TEXT_GUIDE.md`. Template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.

Use this prompt when refactoring FREYRAUM code.

## Goal

Improve structure or maintainability without changing customer-visible behavior unless explicitly requested.

## Required context

- Read the affected files and their nearest collaborators.
- Check `ARCHITECTURE_MAP.md`, `AI_RULES.md`, `DOCUMENTATION_RULES.md`, recent `FINDINGS.md`, and relevant `plan.md` sections.
- Identify existing naming, diagnostics, lifecycle, disposal, and validation patterns before editing.

## Constraints

- Prefer minimal vertical slices.
- Avoid new dependencies.
- Do not remove diagnostics, accessibility guards, generated-preview sync, or WebGL reliability paths.
- Keep public behavior and customer preview compatibility stable.

## Review checklist

- Does the refactor preserve behavior?
- Are ownership boundaries clearer?
- Are validation commands unchanged and passing?
- Did documentation need an update?
- Are any lessons worth recording for future agents?

## Related prompts

- Architecture first: [`architecture.prompt.md`](./architecture.prompt.md)
- Review after changes: [`review.prompt.md`](./review.prompt.md)
- Full autonomous loop: [`autonomous-agent.prompt.md`](./autonomous-agent.prompt.md)
