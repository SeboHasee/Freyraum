# Architecture prompt

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
