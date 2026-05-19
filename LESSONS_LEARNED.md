# FREYRAUM lessons learned

Use this file for durable lessons that should change future agent behavior.

## 2026-05-19 — CSS containment can break controls that need overflow paint

- Observed in v0.16.1/v0.16.2: applying paint containment around `.prefs` clipped the preferences popover, and applying it around `.nav-controls` clipped hover-scaled buttons.
- Future rule: never add `contain: paint` or `contain: layout paint` to popover anchors, hover-scaled controls, or animation shells unless overflow paint has been verified in the built preview.

## 2026-05-19 — Preview output must be rebuilt after source/style changes

- Several customer-facing fixes require `customer-preview/` to match `src/` and `app.html`.
- Future rule: when runtime or SCSS changes affect shipped behavior, run the existing build and commit the regenerated preview output.

## 2026-05-19 — Fresh clones need dependencies installed before validation

- `npm run lint` and `npm run build` fail in a fresh sandbox before `npm install` because local binaries and packages are unavailable.
- Future rule: treat pre-install validation failures as environment setup failures, then rerun after install.

## 2026-05-19 — Reduced motion is not reduced fidelity

- A prior regression coupled motion preference to painting texture/shader detail.
- Future rule: accessibility motion settings should reduce movement only; quality presets remain responsible for visual fidelity.

## 2026-05-19 — Floating tool versions can create validation noise

- The audit install resolved TypeScript 5.9.x, and lint passed while printing an `@typescript-eslint` supported-version warning.
- Future rule: treat tooling range drift as maintenance debt. Align TypeScript, typescript-eslint, and ESLint in a dedicated upgrade pass rather than mixing it into feature work.

## 2026-05-19 — npm audit fixes may require major tooling upgrades

- `npm audit` currently reports moderate Vite/esbuild dev-server advisories, but npm's available fix points to a semver-major Vite upgrade.
- Future rule: document advisories during audits and reserve forced/major dependency upgrades for focused PRs with full validation.

## 2026-05-19 — Stale planned wording can outlive implementation

- The customer picture guide still described the portrait reset boost as planned even though later versions implemented it.
- Future rule: every audit should search customer-facing docs for "planned", "future", and "follow-up" wording and reconcile it with current source state.

Extended incident documentation belongs in `docs/lessons-learned/`.
