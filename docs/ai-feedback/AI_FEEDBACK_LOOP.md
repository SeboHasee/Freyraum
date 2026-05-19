# AI feedback loop

FREYRAUM uses repository context engineering so future AI work starts from the current architecture and previous mistakes.

## Loop

1. Inspect architecture and current docs.
2. Plan against existing module boundaries.
3. Implement the smallest complete change.
4. Validate with existing scripts and focused checks.
5. Self-review for correctness, edge cases, performance, readability, security, accessibility, and maintainability.
6. Update docs and lessons when behavior, workflow, or durable rules change.

## Files to update

- `.github/copilot-instructions.md`: global AI behavior and repository-specific rules.
- `.github/prompts/`: reusable task prompts.
- `AI_RULES.md`: hard constraints and forbidden patterns.
- `ARCHITECTURE_MAP.md`: high-level source ownership map.
- `LESSONS_LEARNED.md`: repeated mistakes and durable follow-up rules.
- `DOCUMENTATION_RULES.md`, `plan.md`, `FINDINGS.md`, `CHANGELOG.md`: implementation-specific records.
