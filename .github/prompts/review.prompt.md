# Review prompt

## v0.18 — Final audited sidecar-text plan (2026-05-20)

Current status: planned, not implemented yet. Canonical plan: `plan.md § v0.18`. Research log: `FINDINGS.md § 2026-05-20`. Customer guide draft: `docs/CUSTOMER_TEXT_GUIDE.md`. Template draft: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`. The current runtime still uses generated importer text until `scripts/import-artworks.mjs` is updated.

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
