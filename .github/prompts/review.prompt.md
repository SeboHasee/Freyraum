# Review prompt
> Last full markdown audit: 2026-05-21 (v0.20.8 — complete v0.20 implementation + markdown sync).

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
