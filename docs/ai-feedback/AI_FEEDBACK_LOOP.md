# AI feedback loop
> Latest markdown audit: 2026-10-19 (repository-wide documentation review).

## v1.18 placement-editor feedback-loop note

When placement feedback shows that numeric iteration is not converging, stop
guessing and use the standalone editor. Distinguish editable wall quads, zones,
rooms and assignments from the fixed 3D model; reject incompatible hybrid
imports, preserve the complete configuration during export, and require the
customer's exported JSON plus screenshot for final visual acceptance. A source
audit can verify structural museum/editor divergence without reproducing the
exact customer artifact; label that evidence boundary explicitly.

## v1.12 feedback-loop note

Customer screenshots are artifact-specific evidence. If they contradict the
checked-in four-work hub contract, reopen visual acceptance, retain the exact
generated/config bundles and route, and separate tool-availability limitations
from any claim about account usage.

## v0.29 feedback-loop note

When user feedback says a shipped preload/fidelity fix still fails, immediately downgrade the claim to follow-up in docs, audit the current source against the claim, add diagnostics-driven acceptance checks, then flip docs back to shipped only after implementation and validation. v0.29 is the shipped example for painting darkness, loading-screen ownership, entry glitching, and first-use lag.

## v0.93 feedback-loop note

A user screenshot of blank hub planes reopens the incident even when an earlier
artwork-recovery change shipped. The next investigation must use the exact
generated current artwork bundle, distinguish missing generated preview scripts
from a true runtime failure, and reproduce the real `file://` preview before
proposing material or lighting changes. The bounded shipped repair is: served
environments keep the declared `image` primary, while the offline museum hub may
prefer embedded `webglImage` when a local file URL is not WebGL-stable.

FREYRAUM uses repository context engineering so future AI work starts from the current architecture and previous mistakes.

## Loop

1. Inspect architecture and current docs.
2. Plan against existing module boundaries.
3. Implement the smallest complete change.
4. Validate with existing scripts and focused checks.
5. Self-review for correctness, edge cases, performance, readability, security, accessibility, and maintainability.
6. Update docs and lessons when behavior, workflow, or durable rules change.
7. For deep audits, validate current platform/tooling assumptions with online sources and record source URLs in `FINDINGS.md`.

## Files to update

- `.github/copilot-instructions.md`: global AI behavior and repository-specific rules.
- `.github/prompts/`: reusable task prompts.
- `AI_RULES.md`: hard constraints and forbidden patterns.
- `ARCHITECTURE_MAP.md`: high-level source ownership map.
- `LESSONS_LEARNED.md`: repeated mistakes and durable follow-up rules.
- `docs/standards/CODING_GUIDELINES.md`: coding, diagnostics, dependency, lifecycle, and documentation standards.
- `DOCUMENTATION_RULES.md`, `plan.md`, `FINDINGS.md`, `CHANGELOG.md`: implementation-specific records.

## 2026-05-19 audit additions

- Always distinguish docs-only findings from runtime changes.
- Record validation warnings, not only pass/fail status.
- Document online research findings with URLs and note whether runtime fallback behavior already covers partial browser support.

Companion docs:

- Architecture: [`../architecture/README.md`](../architecture/README.md)
- Standards: [`../standards/CODING_GUIDELINES.md`](../standards/CODING_GUIDELINES.md)
- Lessons: [`../../LESSONS_LEARNED.md`](../../LESSONS_LEARNED.md)
