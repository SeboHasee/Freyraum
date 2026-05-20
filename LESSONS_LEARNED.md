# FREYRAUM lessons learned
> Last full markdown audit: 2026-05-20 (v0.20.3 technical planning sync).

## 2026-05-20 — Volume UX changes need explicit mapping contracts

- The current audio system stores linear gain and exposes linear sliders, but product requests now require “balanced display” behavior with calmer effective startup loudness.
- Future rule: whenever UX wording and technical gain model diverge, define explicit forward + inverse mapping helpers and reuse them across defaults, persistence, UI rendering, and diagnostics.

## 2026-05-20 — High-frequency controls should avoid full DOM re-render loops

- Preferences slider continuity risk is caused by full panel `innerHTML` replacement on each preference change.
- Future rule: for range sliders and other high-frequency controls, keep stable DOM nodes and patch values in place; avoid replacing active controls during pointer drag.

## v0.20 implementation note — audio reliability shipped (2026-05-20)

Lesson carried forward from this pass: once customer-facing workflows ship, all markdown banners must be flipped from planned to implemented in the same PR to avoid stale guidance.

## v0.18 — Customer sidecar text shipped (2026-05-20)

Current status: shipped. The importer (`scripts/import-artworks.mjs`) reads same-basename `.txt` sidecars (`.md` accepted as a backup) and merges customer-facing metadata into the generated manifest. Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned. Canonical plan: `plan.md § v0.18`. Research log: `FINDINGS.md § 2026-05-20`. Customer guide: `docs/CUSTOMER_TEXT_GUIDE.md`. Template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.

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

## 2026-05-20 — Planned customer workflows must stay clearly labeled as planned

- Draft guides and templates for future customer workflows can easily read like shipped behavior if they use present-tense instructions.
- Future rule: whenever documentation describes an unimplemented workflow, mark it as draft/not-yet-shipped in the intro and repeat the current runtime behavior so customers are not misled.

## 2026-05-20 — Promote draft docs in the same pass as the implementation

- v0.18 shipped sidecar text by updating `scripts/import-artworks.mjs` and then immediately rewriting `docs/CUSTOMER_TEXT_GUIDE.md`, `ARTWORK_TEXT_TEMPLATE.txt`, README, CHANGELOG, HANDOFF, IMAGE_MAINTENANCE_GUIDE, CUSTOMER_PICTURE_GUIDE, DOCUMENTATION_RULES, ARCHITECTURE_MAP, AI_RULES, and FINDINGS from "planned" to "shipped" wording.
- Future rule: when an audit produces draft customer docs ahead of code, the implementation PR must also flip all "planned/not yet shipped" wording in one pass so customers and contributors never see stale labels next to live behavior.

## 2026-05-20 — Sidecar parsing must distinguish "omitted" from "blank"

- v0.18 uses `??` to merge sidecar values so an omitted field falls back cleanly while a blank field still warns. Mixing the two cases hides typos (blank `Title` looks the same as a deleted line).
- Future rule: when adding optional customer-edited fields, separate "present but blank" (warn) from "omitted entirely" (silent fallback). Use `Object.prototype.hasOwnProperty.call(fields, key)` for the distinction, not `!fields[key]`.

Extended incident documentation belongs in `docs/lessons-learned/`.
