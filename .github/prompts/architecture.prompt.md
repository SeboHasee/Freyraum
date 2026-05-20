# Architecture prompt

## v0.18 sidecar text planning note (2026-05-20)

Current artwork-text planning is focused on **Option C: one sidecar text file beside each customer image** (`painting.jpg` + `painting.txt`). Treat `plan.md § v0.18 proposal — Customer sidecar text files for each painting` as the source of truth and `FINDINGS.md § 2026-05-20 — Customer sidecar text files selected for artwork text` as the research log. Generated manifests remain generated; future customer-written painting text should come from matching sidecars, not manual edits to `artworks.json` or `customer-artworks.js`.


Use this prompt for architecture analysis or planning.

## Analysis order

1. Map the involved user flow from `src/main.ts` outward.
2. Identify module ownership using `ARCHITECTURE_MAP.md`.
3. Compare against recent implementation decisions in `FINDINGS.md` and `plan.md`.
4. List goals, non-goals, risks, validation needs, and deferred boundaries.

## FREYRAUM priorities

1. Correctness and customer reliability.
2. Maintainability and consistency with existing modules.
3. Rendering fidelity and accessibility.
4. Performance measured with existing diagnostics.
5. Cleverness only when it simplifies the system.

## Expected output

- A concise plan with affected files/modules.
- No speculative implementation details beyond the current architecture.
- Explicit validation and documentation requirements.

## Related prompts

- Refactor implementation: [`refactor.prompt.md`](./refactor.prompt.md)
- Review checklist: [`review.prompt.md`](./review.prompt.md)
- Autonomous loop: [`autonomous-agent.prompt.md`](./autonomous-agent.prompt.md)
