# Dependency & Tooling Maintenance Plan

## Current dependency risk matrix

| Package / Area | Current | Target | Migration requirements | Risk |
|---|---:|---:|---|---|
| vite | 5.x | latest secure major | Validate build + preview output and plugin compatibility after major bump | High (breaking major) |
| eslint | 8.x (deprecated) | 9.x | Migrate config shape/rules if required by eslint 9 ecosystem updates | Medium |
| @typescript-eslint/* | 7.x | 8.x | Align with installed TypeScript; rerun lint/typecheck and adjust rules if needed | Medium |
| @types/three | installed | evaluate removal | Verify if bundled `three` types fully cover project + examples imports | Medium |

## Upgrade safety gates (required per batch)

Run after each upgrade batch:

```bash
npm run lint
npm run build:typecheck
npm run build
npm run test:frame-budget
npm audit --audit-level=moderate
```

## Notes

- Apply patch/minor updates that pass all gates immediately.
- For major/risky upgrades, stage them in isolated PRs with rollback notes.
