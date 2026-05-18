# DOCUMENTATION RULES

## Rule

Always document meaningful repository work for future development.

## Required updates for every meaningful implementation

1. Update `plan.md`
   - current scope
   - findings
   - implemented items
   - remaining items
2. Update `CHANGELOG.md`
   - add version/date entry
   - summarize added, changed, and fixed work
3. Update `FINDINGS.md`
   - note technical discoveries, caveats, and validation outcomes
4. Update `README.md`
   - when user-facing setup, controls, architecture summary, or workflow changed
5. Update this file
   - only when the documentation policy itself changes

## Quality expectations

- documentation must reflect the code that was actually committed
- documentation should mention remaining limitations, not only successes
- plans should distinguish implemented items from future items
- changelog entries should be concise but specific
- findings should capture reusable technical knowledge for later contributors
- if a user reports a customer-facing feature failure after implementation,
  document it as a first-class follow-up with observed behavior, expected
  behavior, likely failure boundary, diagnostics needed, and acceptance checks

## Additional rule for technical planning documents

When adding future implementation plans for rendering, performance, shaders, WebGPU, asset pipelines, or other high-risk architecture work, document:

- goals and non-goals
- proposed modules/files
- implementation order as vertical slices
- performance budgets and measurement strategy
- accessibility impact
- fallback behavior
- acceptance checks
- known risks and reserved future-pass boundaries
- shader/math-space assumptions when shader code or rendering equations are planned
- resource ownership, disposal boundaries, and async race handling for texture/material pipelines
- browser/API stability boundaries for experimental features and debug-only tooling
- diagnostics/logging design: log levels, signal-to-noise boundaries, retention/buffering strategy, and developer activation path

## Latest documentation pass

- 2026-05-18: v0.11 responsive/touch planning documentation added. Every repository markdown file now references the phone/tablet compatibility plan, online accessibility/browser research, current code audit, implementation slices, diagnostics expectations, and validation matrix. This is a planning-only pass; future runtime implementation must update the same docs with as-built behavior and validation results.
- 2026-05-17: v0.10 implemented the Hoch close-up spot artifact fix and very-vertical-picture reset zoom fix. Documentation now records the procedural height/specular retune, aspect-aware reset zoom math, diagnostics fields, validation results, and remaining manual visual checks.
- 2026-05-17: v0.10 follow-up implemented the parallax hole artifact fix. Documentation now records that albedo must stay on stable artwork UVs while parallax remains relief-only, plus the reduced Hoch parallax scale and new diagnostics.
- 2026-05-17: v0.09 follow-up plan added after customer validation showed that v0.08 fixed the central 3D painting aspect ratio but the actual uploaded image can still fall back to the placeholder. Documentation now records online WebGL/CORS/local-file texture research and points future implementation toward importer-generated exact data URLs for 3D albedo reliability.
- 2026-05-17: v0.08 critical customer-artwork rendering plan added after a report that imported images appeared in the timeline but not on the central 3D painting. All markdown files now point future work toward fixing the WebGL texture path, manifest-driven 3D aspect ratios, and detailed diagnostics.
- 2026-05-17: v0.07 diagnostics/logging pass added a centralized runtime diagnostics system and updated the planning rules so future high-risk work must document diagnostics/logging architecture, signal-to-noise boundaries, and activation paths.
- 2026-05-17: v0.07 customer-picture workflow planning documentation added. This pass added `docs/CUSTOMER_PICTURE_GUIDE.md` and updated every repository markdown file with current limitations, online research findings, and the planned customer-managed artwork-folder importer.
- 2026-05-17: v0.05 planning documentation added for self-shadow smoothing/stain artifact removal. This pass updated every repository markdown file to keep plan, findings, changelog, README, handoff, and documentation policy status aligned.
