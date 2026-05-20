# Review prompt

## v0.18 sidecar text planning note (2026-05-20)

Current artwork-text planning is focused on **Option C: one sidecar text file beside each customer image** (`painting.jpg` + `painting.txt`). Treat `plan.md § v0.18 proposal — Customer sidecar text files for each painting` as the source of truth and `FINDINGS.md § 2026-05-20 — Customer sidecar text files selected for artwork text` as the research log. Generated manifests remain generated; future customer-written painting text should come from matching sidecars, not manual edits to `artworks.json` or `customer-artworks.js`.


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
