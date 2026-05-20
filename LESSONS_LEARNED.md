# FREYRAUM lessons learned

## v0.18 sidecar text planning note (2026-05-20)

Current artwork-text planning is focused on **Option C: one sidecar text file beside each customer image** (`painting.jpg` + `painting.txt`). Treat `plan.md § v0.18 proposal — Customer sidecar text files for each painting` as the source of truth and `FINDINGS.md § 2026-05-20 — Customer sidecar text files selected for artwork text` as the research log. Generated manifests remain generated; future customer-written painting text should come from matching sidecars, not manual edits to `artworks.json` or `customer-artworks.js`.


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

## 2026-05-20 — Custom role=dialog elements need explicit aria-modal + aria-labelledby

- `PreferencesPanel` had `role="dialog"` and `aria-label` but no `aria-modal="true"`. Screen readers were not treating background content as inert while the panel was open.
- Additionally, `handleOutsideClick` closed the panel but did not return focus to the trigger — only the Escape path did. WCAG SC 2.4.3 requires focus to return to the opener on any dismiss path.
- Future rule: every custom `role="dialog"` element needs `aria-modal="true"`, `aria-labelledby` pointing to a stable heading id, and focus returned to the trigger on every dismiss path (Escape, outside-click, close button).
- Source: <https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/>

## 2026-05-20 — Verify caller graphs before every dead-code cleanup

- Three interaction files (`MouseInteraction.ts`, `TouchInteraction.ts`, `ZoomPan.ts`) and one deprecated export (`isMobileDevice()`) were confirmed caller-free by grep before deletion. No runtime errors resulted.
- Future rule: before removing any exported symbol, grep all source and test files for its name; proceed only when no non-comment match is found.

Extended incident documentation belongs in `docs/lessons-learned/`.

