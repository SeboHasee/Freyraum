# Architecture prompt
> Last full markdown audit: 2026-05-20 (v0.20.1 docs sync + verification).

## v0.20 full-check context note

Current repository status includes a **shipped** background-music workflow (`plan.md § v0.19`).
Treat importer/runtime/preferences integration as active architecture constraints in analysis.

## v0.18 — Customer sidecar text shipped (2026-05-20)

Current status: shipped. The importer (`scripts/import-artworks.mjs`) reads same-basename `.txt` sidecars (`.md` accepted as a backup) and merges customer-facing metadata into the generated manifest. Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned. Canonical plan: `plan.md § v0.18`. Research log: `FINDINGS.md § 2026-05-20`. Customer guide: `docs/CUSTOMER_TEXT_GUIDE.md`. Template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.

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
