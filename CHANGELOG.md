# CHANGELOG
> Latest markdown audit: 2026-09-04 (v1.12 full conversation documentation sync).

## v1.17 — Deterministic curator placement editor (2026-09-04)

- Replaced silent cross-wall fallback with strict wall ownership: invalid
  explicit placement is highlighted and suppressed, never moved into a hallway
  or onto another wall.
- Added explicit stage-space `mountingZone` polygons for every rendered wall.
- Requires explicit curator confirmation of every mounting zone before export;
  checked-in initial zones remain deliberately unconfirmed.
- Upgraded `?hubCalibrate=1` with artwork selection, direct drag, proportional
  resize, canonical numeric fields, keyboard nudging, analytic zone centering,
  editable boundary handles, undo/redo/reset, and live metre/pixel proof.
- Export now emits schema v5 canonical placement fields only and remains blocked
  while any full artwork quad, doorway, wall ownership, overlap, size, or
  export/re-import invariant fails.
- Added valid-only clipboard/download actions and sanitized JSON re-import.
- Added deterministic mounting-zone, wall-ownership, and canonical round-trip
  regression coverage.

## v1.16 — Screen-space doorway and corner guards (2026-09-04)

- Corrected both side works to 50% wall midpoints after the supplied screenshot
  showed 55%/45% still crossing the photographed front-wall seams.
- Replaced the contradictory 1.25 m side-doorway rule with the existing 0.35 m
  calibrated local clearance, while retaining the 4 m local corner guard.
- Added primary-camera regression checks requiring every projected side-artwork
  corner to stay at least 12 px inside both the visible doorway reveal and
  front-wall seam.
- The resolver no longer remounts a visually valid side work onto the front wall
  because of a wall-space rule contradicted by the calibrated photograph.
- Final visual acceptance remains pending a screenshot of the rebuilt artifact.

## v1.15 — Mathematical side-wall orientation validation (2026-09-04)

- Added an explicit rigid-plane alignment result for every projected artwork:
  wall-normal dot product, front-face wall-offset spread, artwork vanishing
  point, wall vanishing point, and residual.
- Invalid orientation is now rejected before rendering or interaction geometry
  is accepted.
- Hub diagnostics export the calculated alignment proof.
- Geometry regression requires side-artwork and wall horizontal edges to share
  a vanishing point within `0.01 px`.
- Verified the current mirrored side works are flush to their walls and converge
  at approximately `(683, 411.90)` on the 1366×768 calibrated stage. No
  camera-facing angle correction was introduced.

## v1.14 — Correct side artworks away from front corners (2026-09-04)

> **Superseded by v1.16:** the next screenshot showed that local wall-space
> clearance alone still allowed both works to cross the photographed seams.

- Used the post-v1.13 customer screenshot to identify both artwork bodies
  crossing the front-wall corner seams.
- Replaced the incorrect 65%/35% positions with mirrored 55%/45% positions,
  centered in the usable side-wall strips.
- Restored the 4 m full-body front-corner guard.
- Synchronized authored config, runtime fallback placement, geometry tests,
  generated preview output, and current documentation.
- Final visual acceptance remains pending a screenshot of this rebuilt artifact.

## v1.13 — Side artworks moved clear of doorways (2026-09-04)

> **Superseded by v1.14:** screenshot evidence showed this movement pushed both
> works into the front-wall corner seams.

- Moved the left side work from 56% to 65% along its rear-to-front wall axis.
- Moved the right side work from 44% to 35% along its front-to-rear wall axis.
- Shifted both centers about 1.1 m toward the front wall while retaining full
  doorway exclusion and a 3 m front-corner safety boundary.
- Reused the same constants for authored slots and runtime fallback remounting.
- Updated the shipping config, geometry regression expectations, and generated
  customer preview.
- The latest pre-fix screenshot confirms four works; final placement acceptance
  remains pending a post-fix screenshot.

## v1.12 — Full documentation sync and reopened visual acceptance (2026-09-04)

### Documentation

- Audited all current Markdown against the v1.05–v1.11 implementation sequence:
  resilient WebGL startup/2D fallback, U/V/N mounting, optical alignment,
  four-work room pagination and legacy reflow, contact-card removal, and
  side-wall doorway/corner constraints.
- Corrected current schema references from museum-hub v4 to v5.
- Documented the latest customer screenshot: `Raum 1 / 2` visibly contains five
  works, contradicting the checked-in four-work page invariant.
- Reopened visual acceptance and added an artifact-provenance handoff procedure.
- Recorded that image/tool availability and account usage budget are separate;
  no billing conclusion should be inferred from a session tool limit.

### Runtime

- No runtime change in this documentation-only release.
- v1.11 remains implemented, but its visual acceptance claim is no longer
  considered closed until the exact customer artifact is reproduced.

## v1.11 — Balanced side-wall doorway/corner placement (2026-09-04)

> **Acceptance update:** implementation shipped, but customer screenshot evidence
> received later on 2026-09-04 reopened the visual incident; see v1.12.

### Changed

- Corrected the over-shift from v1.10 by placing the left work at 56% and the
  right work at 44% along their respective wall axes.
- Balanced both architectural constraints: every side work now retains at least
  1.25 m of uninterrupted wall beside its doorway and at least 4.00 m from the
  perpendicular front-wall corner.
- Added explicit doorway-to-artwork wall-span validation so future placement
  changes cannot satisfy corner clearance by crowding the hallway opening.

### Unchanged

- Four-work 2+1+1 room capacity, overflow pagination, artwork size/height,
  wall-parallel mounting, architecture, camera, lighting, and interactions.

## v1.10 — Side-wall front-corner setback (2026-09-04)

### Changed

- Moved the left side-wall work from 64% to 48% along its rear-to-front wall
  axis, bringing it toward the viewer and away from the front-wall corner.
- Moved the right side-wall work from 36% to 52% along its front-to-rear wall
  axis for the equivalent viewer-facing setback.
- Added deterministic validation requiring side-wall artwork bounds to remain at
  least 4.50 m from their respective front-wall corners while retaining doorway
  clearance.

### Unchanged

- Four-work 2+1+1 room capacity, overflow pagination, artwork size/height,
  wall-parallel orientation, architecture, camera, lighting, and interactions.

## v1.09 — Realistic room density and corner clearance (2026-09-03)

### Changed

- Restored the intended four-artwork room capacity. Exhibitions now paginate
  after four works instead of filling all six visible wall slots at once.
- Replaced the crowded 2+2+2 arrangement with two front-wall works and one
  safely inset work on each side wall.
- Removed the second side-wall slots that could place paintings unrealistically
  close to the front corners.
- Raised the physical lower edges to at least 1.50 m in the current room scale
  and retained stronger projected wall clearance below each work.
- Updated built-in slot mappings so all four default artworks use the complete
  2+1+1 room composition.
- Made spacing validation page-aware because separate room pages intentionally
  reuse the same physical wall coordinates.
- Clamped older `slotsPerPage: 6` configurations to four and reflowed explicit
  excess mappings into new 2+1+1 rooms instead of crashing or retaining crowding.
- Reapplied the complete safe placement template to every migrated batch,
  including the retained first room, and normalized sparse authored room numbers
  to contiguous navigable page indices.

### Unchanged

- Architecture, camera, lighting, materials, wall-relative transforms, artwork
  aspect ratios, selection, interactions, and gallery navigation.

## v1.08 — Optical hub artwork alignment (2026-09-03)

### Changed

- Replaced the single hero centerline with restrained optical centerlines:
  2.02 m on the front wall, 2.10 m on the left, and 2.08 m on the right.
- Reduced hero heights to 1.45–1.72 m and redistributed the side-wall groups
  away from the back corners, preserving source aspect ratios and clear wall
  below every work in the primary wide-angle view.
- Balanced the front focal pair at 29%/71% of its wall and allowed slight
  side-wall asymmetry instead of enforcing camera-visible mirror geometry.
- Removed the separate blurred contact-shadow card. The 22 mm physical body now
  provides the only artwork shadow/contact silhouette.
- Added deterministic projected floor-gap, corner-margin, optical-center,
  doorway, spacing, orientation, and fitted interaction-transform checks.

### Unchanged

- Museum architecture, camera, lighting, materials, post-processing, artwork
  imagery, wall-parallel U/V/N transforms, interaction, and gallery navigation.

## v1.07 — Curated hub exhibition composition (2026-09-03)

### Changed

- Raised the shared visual centerline from 1.55 m to 1.90 m and replaced the
  uniform artwork height with 1.75–2.25 m role-specific physical sizes.
- Refined the back-wall focal pair and mirrored side-wall groups while retaining
  doorway/corner clearance and at least 0.50 m between works.
- Reduced artwork bodies to 22 mm, wall-to-back clearance to 2 mm, and tightened
  the contact card so mounted works read as wall installations rather than
  floating panels.
- Added deterministic validation of the real built-in artwork set alongside the
  customer/full-fixture layout.
- Made aspect-mismatched automatic fallback placement collision-aware so unusual
  source ratios move to overflow pages instead of shrinking or overlapping;
  pairwise interval checks cover non-adjacent wide-work conflicts.
- Persisted final drawable-region fitting into the canonical mount, keeping the
  rendered body and projected interaction quad on one transform.

### Unchanged

- Wall-relative U/V/N orientation, source aspect ratios, exact-ID interaction,
  pagination, gallery transition/navigation, architecture, camera, lighting,
  materials, post-processing, and artwork imagery.

## v1.06 — Wall-relative hub artwork mounting (2026-09-03)

### Changed

- Replaced authored `center`/`anchor`/`uv`/`mountedHeight` duplication in the
  shipping hub config with normalized wall position, visual center height,
  physical height, and mounting gap. Legacy configurations are still migrated.
- Added one shared wall U/V/N mounting frame used by WebGL artwork transforms
  and DOM interaction projection. Side-wall works remain parallel to their
  architecture and are never rotated toward the camera.
- Standardized the hero room at a 1.55 m visual centerline and 1.82 m physical
  height, with mirrored side-wall positions and at least 0.50 m breathing room.
- Defined mounting offset as back clearance: every 4 cm artwork body now keeps
  exactly 6 mm behind it rather than extending through the wall.
- Projected the actual mounted front face for accessible pointer/keyboard
  targets and added deterministic checks for inward normals, orthogonal axes,
  depth clearance, source aspect, doorway clearance, spacing, and collisions.

### Unchanged

- Museum architecture, camera, lighting, materials, post-processing, artwork
  imagery, exact-ID selection, gallery transitions, and gallery navigation.

## v1.05 — Resilient WebGL startup and 2D museum (2026-09-03)

### Changed

- Removed the retained throwaway WebGL preflight and now initialize the real
  renderer through preferred, compatibility, and battery-safe attempts.
- Explicitly release unsuccessful partial contexts and report the selected
  renderer mode/context attributes in diagnostics.
- Isolated hub-renderer failure: its existing DOM artwork controls become a
  visible, paged, touch/keyboard-accessible museum without aborting the gallery.
- Replaced the generic WebGL alert with categorized startup messaging, one-shot
  retry, and a responsive 2D artwork collection containing customer metadata.
- First-run devices use battery quality only when the capability heuristic marks
  them constrained; stored choices remain authoritative. Constrained starts no
  longer compile non-active quality variants.
- Removed external font requests from the generated local preview and added
  self-contained missing-bundle-file messages.

### Compatibility

- Immersive rendering requires WebGL 2 as required by the installed Three.js
  renderer. Browsers without a working implementation retain museum content and
  navigation in 2D rather than receiving a blocking or misleading browser prompt.

## v1.04 — Architectural lighting topology pass (2026-09-02)

### Changed

- Made every hub area source explicitly target the room and added one restrained
  clerestory-sized source so the visible skylight produces local illumination.
- Raised finite-area direct light while reducing non-occluded hemisphere and
  PMREM fill; ACES exposure remains fixed so contrast comes from light topology.
- Enabled the existing sole directional shadow map on the ceiling aperture,
  clerestory returns, cove returns, skylight frame, and doorway headers/jambs.
- Tightened its orthographic coverage to the visible hall instead of the entry
  extension, improving useful shadow-map density without increasing resolution.
- Removed hub surface sine modulation. Smooth plaster, matte ceiling, and satin
  mineral flooring now derive form from geometry and physically coherent light.
- Reduced and recessed the floor shadow gap, lightened doorway plaster so depth
  comes primarily from geometry, and replaced radial artwork halos with smaller
  soft rounded contact cards behind the existing shadow-casting bodies.
- Limited the CSS contrast shade to the header region. High retains the on-demand
  planar floor reflection; balanced now uses PMREM sheen and battery stays off.
- Added renderer diagnostics for light direction/energy, exposure, environment,
  shadow/reflection resources, draw calls, triangles, textures, and programs.

### Performance

- No fullscreen AO, additional shadow map, external asset, dependency, or
  continuous render loop was added.
- The third area light is high/balanced-only and non-shadowing.
- Simplifying hub materials removes derivative procedural fragment work.
- Balanced removes its additional planar reflection render.

### Validation

- `npm install` ✅ (seven existing audit findings remain: one moderate, six high)
- `npm run import:artworks` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅ (existing large-chunk and Sass legacy-API warnings remain)
- `npm run validate:museum-hub` ✅
- `npm run test:frame-budget` ✅
- `npm run docs:check-config-authority` ✅
- Deterministic Three.js direction probe confirmed local `-Z` resolves to
  `(0, -1, 0)` after each area light targets the room.
- Visual comparison was unavailable because the repository does not include
  `pixelmatch`/`pngjs`; browser inspection was also unavailable after the
  Playwright transport closed. Neither missing tool was installed or retried.

## v1.03 — Procedural skylight and PBR hub surfaces (2026-09-02)

### Changed

- Replaced the clerestory's flat luminous cap with a pitched, glazed roof, dark
  ridge, and eighteen instanced rafter segments.
- Added a static procedural atmospheric sky and generated the hub's cached PMREM
  from the same daylight model, with a simpler gradient sky on battery quality.
- Enabled restrained ACES tone mapping for hub architecture while preserving
  explicit untone-mapped artwork and linear reflection-target rendering.
- Added shared non-repeating world-space PBR micro-normal and roughness response
  to hub plaster and pale mineral flooring; battery keeps the plain fallback.
- Replaced flat unlit cove diffusers with restrained emissive PBR materials.
- Rebalanced ambient, directional, and area-light energy and reduced the
  quality-tiered floor reflection after tone mapping.
- Extended deterministic contracts for skylight geometry, glazing, architectural
  exposure, material response, emissive fixtures, and reflection limits.

### Performance

- The hub remains mutation-driven with no continuous animation.
- One cached PMREM is generated only when environment reflections are enabled.
- Repeated skylight rafters remain instanced; no external textures, extra shadow
  maps, SSAO, SSR, bloom, or fullscreen passes were added.
- Battery disables surface micro response, area lights, shadows, environment
  generation, and planar reflections.

## v1.02 — Main Museum Hub architectural redesign (2026-09-02)

### Changed

- Recalibrated the authoritative hub from a compact `7 × 7 × 3.4 m` room to a
  tall `9 × 12 × 5.2 m` hall with a wider 48° architectural camera composition.
- Replaced the two cross-room ceiling panels with longitudinal perimeter light
  channels and a raised central clerestory/light well with instanced dark ribs.
- Updated wall reference quads, safe polygons, room transforms, doorway
  positions, hanging bands, and artwork anchors as one coherent metric model.
- Increased mounted artwork sizes to preserve legibility and curated presence
  in the larger hall while retaining the six-slot composition and exact IDs.
- Shifted the hub toward neutral daylight, cleaner near-white plaster, and a
  pale grey mineral floor. Existing map-free surfaces and restrained reflection
  architecture remain intact.
- Added narrow ceiling contact reveals and further tightened the shared mounting
  shadow so it reads directionally rather than as a halo.
- Updated deterministic geometry validation from square-room assumptions to the
  elongated hall, including wall widths, closure, mirrored doorways, calibration,
  artwork centerline, and luminaire constraints.

### Validation

- `npm install` ✅ (seven existing audit findings remain: one moderate, six high)
- `npm run import:artworks` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run validate:museum-hub` ✅
- `npm run test:frame-budget` ✅
- `npm run docs:check-config-authority` ✅

## v1.01 — Main Museum Hub architectural lighting polish (2026-09-02)

### Changed

- Added two non-shadowing `RectAreaLight` fixtures aligned with the recessed
  ceiling panels on high and balanced quality, creating localized architectural
  gradients without per-artwork lights or another render pass.
- Reduced the broad hemisphere and directional-key energy. The existing key
  remains the sole shadow caster; battery quality omits area fixtures and uses
  the inexpensive directional fill fallback.
- Broadened ceiling coves from narrow strips to integrated 0.48 m luminaires and
  reduced diffuser brightness.
- Tightened and softened the shared artwork mounting-shadow approximation while
  retaining the existing 4 cm shadow-casting artwork body.
- Lifted doorway-pocket plaster from near-charcoal to a subdued warm grey so
  recess geometry remains visible without looking artificially bright.
- Added regression guards for panel size and energy, secondary key intensity,
  doorway visibility, and existing surface constraints.

### Validation

- `npm install` ✅ (seven existing audit findings remain: one moderate, six high)
- `npm run import:artworks` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run validate:museum-hub` ✅
- `npm run test:frame-budget` ✅
- `npm run docs:check-config-authority` ✅
- Automated browser inspection unavailable because the Playwright transport
  closed before navigation; it was not retried.

## v1.00 — Main Museum Hub environment polish (2026-09-02)

### Changed

- Retuned the hub-only architectural profile to warm off-white plaster with
  `0.88` wall roughness and no procedural color modulation.
- Removed repeating normal/roughness maps from hub ceilings and floors while
  preserving the interactive gallery's tactile mapped surface profile.
- Reduced the hub's world-space wall response to imperceptible broad roughness
  variation and softened the preset-gated planar floor reflection.
- Warmed the existing low-energy hub lighting and ceiling diffusers without
  adding lights, shadow maps, render passes, or continuous rendering.
- Extended deterministic hub validation for material roughness, warm wall
  response, and absence of repeating wall, ceiling, and floor maps.

### Validation

- `npm install` ✅ (seven existing audit findings remain: one moderate, six high)
- `npm run import:artworks` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run validate:museum-hub` ✅
- `npm run test:frame-budget` ✅
- `npm run docs:check-config-authority` ✅

## v0.99 — Main Museum Hub plaster + lighting refinement (2026-09-02)

### Changed

- Added an explicit hub surface profile to
  `src/materials/ArchitecturalSurfaceFactory.ts`. Hub walls no longer bind the
  repeating gallery plaster normal/roughness maps; they use a very low-contrast
  world-space color/roughness response whose pattern periods exceed the room.
- Preserved the existing mapped plaster profile for the closer interactive
  gallery, keeping the two routes resource-independent and avoiding a regression
  to the tactile single-artwork wall shipped in v0.98.
- Rebalanced `src/hub/HubRoomRenderer.ts` toward a broad neutral architectural
  wash with weaker directional modeling. The high key remains the only shadow
  caster and the existing on-demand render/reflection quality gates are
  unchanged.
- Extended `scripts/test-museum-hub-geometry.mjs` with deterministic contracts
  for non-repeating hub walls, restrained variation, low directional-light
  energy, and ceiling-led key placement.
- Rebuilt the tracked local preview output to match the shipped runtime.

### Validation

- `npm install` ✅
- `npm run import:artworks` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run validate:museum-hub` ✅
- `npm run test:frame-budget` ✅
- `npm run docs:check-config-authority` ✅

## v0.98 — Wall surface realism + softer artwork-view lighting (2026-09-02)

### Changed

- Retuned `src/materials/ArchitecturalSurfaceFactory.ts` so the neutral-grey
  gallery wall regains visible matte plaster texture: stronger wall normal
  response, stronger plaster roughness breakup, and a calmer ceiling response.
- Softened the fixed close-view lighting in `src/lighting/LightProfile.ts` by
  lowering ambient/direct energy and keeping the two-key setup on softer
  near-gallery angles, reducing the large bright hotspot that was washing out
  the artwork view.
- Lowered the matte artwork sheen floor in `src/materials/PaintingMaterial.ts`
  so matte presentations no longer keep the old `0.08` base specular response;
  satin and glazed presentations still preserve higher sheen than matte works.
- Extended `scripts/test-museum-hub-geometry.mjs` with focused guards for the
  softer lighting-energy contract, visible-but-restrained wall texture, calmer
  ceiling response, and matte-vs-satin specular separation.
- Rebuilt the tracked local preview bundle so
  `/home/runner/work/Freyraum/Freyraum/customer-preview/freyraum-gallery.js`
  matches the shipped runtime behavior.

### Validation

- `npm install` ✅
- `npm run import:artworks` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run validate:museum-hub` ✅
- `npm run test:frame-budget` ✅
- `npm run docs:check-config-authority` ✅

## v0.97 — Neutral gallery wall-lighting rebalance (2026-09-01)

### Changed

- Rebalanced the fixed interactive-gallery lighting in
  `src/lighting/LightProfile.ts` from a single warm dramatic spot into a
  balanced neutral two-key setup, keeping the wall readable as concrete grey
  instead of amber in the single-artwork view.
- Reduced the gallery wall/ceiling surface response in
  `src/materials/ArchitecturalSurfaceFactory.ts` by raising wall roughness and
  lowering plaster normal intensity, so the background reads flatter and less
  cream-tinted under close inspection.
- Neutralized the museum-hub room lights in `src/hub/HubRoomRenderer.ts` so hub
  walls and gallery walls stay aligned on the same cooler concrete-grey look.
- Extended `scripts/test-museum-hub-geometry.mjs` with a lightweight fixed
  gallery-lighting contract: neutral ambient Kelvin, balanced two-key setup,
  and no regression to the old far-left warm spotlight placement.
- Rebuilt the tracked local preview bundle so
  `/home/runner/work/Freyraum/Freyraum/customer-preview/freyraum-gallery.js`,
  `/home/runner/work/Freyraum/Freyraum/customer-preview/style.css`, and
  `/home/runner/work/Freyraum/Freyraum/customer-preview/app.html` match the
  shipped runtime behavior.

### Validation

- `npm install` ✅
- `npm run import:artworks` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run validate:museum-hub` ✅
- `npm run test:frame-budget` ✅
- `npm run docs:check-config-authority` ✅

## v0.96 — Concrete-grey wall retune (2026-09-01)

### Changed

- Changed the authoritative gallery/hub wall token from `#D8DDDB` to the cooler
  concrete-grey `#C7CED4` across checked-in customer config, CSS/HTML shell
  defaults, runtime fallback paths, renderer defaults, and regression
  assertions.
- Retuned the gallery architectural surface palette in
  `src/materials/ArchitecturalSurfaceFactory.ts` so the coupled floor, cove
  light, and artwork-edge tones no longer pull the scene back toward beige.
- Tempered the fixed gallery light profile in `src/lighting/LightProfile.ts`
  from the previous 3000/2700/8000 K mix to a less amber 3600/3400/7200 K
  mix, keeping the single-profile look while making the wall read as modern
  grey instead of cream/orange in the inspection view.
- Rebuilt the tracked local preview bundle so
  `/home/runner/work/Freyraum/Freyraum/customer-preview/freyraum-gallery.js`,
  `/home/runner/work/Freyraum/Freyraum/customer-preview/style.css`, and
  `/home/runner/work/Freyraum/Freyraum/customer-preview/app.html` match the
  shipped runtime behavior.

### Validation

- `npm run import:artworks` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run validate:museum-hub` ✅
- `npm run test:frame-budget` ✅
- `npm run docs:check-config-authority` ✅

## v0.95 — Single-artwork inspection retune (2026-09-01)

### Changed

- Moved the interactive-gallery front wall farther back in
  `src/config/galleryPresentation.ts` so close inspection regains its intended
  hover-tilt freedom without letting the mounted artwork reach the wall plane.
- Replaced the v0.94 zero-overscroll inspection pan with a smaller bounded
  reveal margin in `src/gallery/GalleryManager.ts`, using shared exported
  defaults from `src/gallery/inspectionSafety.ts` so users can pan a little past
  the artwork edge again while the stage still stays visually controlled.
- Kept the revealed wall on the existing authoritative museum-grey token path
  (`#D8DDDB`) rather than introducing a gallery-only wall color override.
- Extended `scripts/test-museum-hub-geometry.mjs` so regressions now assert the
  deeper front-wall setback, the restored bounded pan margin, full close-hover
  tilt at inspection scale, and continued clearance clamping for larger hover
  rotations.
- Rebuilt the tracked local preview bundle so
  `/home/runner/work/Freyraum/Freyraum/customer-preview/freyraum-gallery.js`
  matches the shipped runtime behavior.

### Validation

- `npm install` ✅ *(required in this fresh environment before lint/build)*
- `npm run import:artworks` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run validate:museum-hub` ✅
- `npm run test:frame-budget` ✅
- `npm run docs:check-config-authority` ✅

## v0.94 — Single-artwork inspection wall-clip fix (2026-09-01)

### Changed

- Tightened single-artwork inspection pan bounds in
  `src/gallery/GalleryManager.ts` so close inspection no longer overscrolls past
  the artwork edge into the gallery wall/plane.
- Added shared gallery inspection-safety math in
  `src/gallery/inspectionSafety.ts` and used it to clamp hover tilt against the
  actual front-wall clearance, preventing the mounted artwork from rotating back
  through the stage wall during inspection.
- Exposed the mounted-body back extent from `src/gallery/ArtworkMesh.ts` so the
  clearance guard can account for both the painted plane and its shallow support
  body.
- Extended `scripts/test-museum-hub-geometry.mjs` with focused assertions for
  single-artwork inspection pan bounds and hover-tilt wall clearance.
- Rebuilt the tracked local preview bundle so
  `/home/runner/work/Freyraum/Freyraum/customer-preview/freyraum-gallery.js`
  matches the shipped runtime behavior.

### Validation

- `npm install` ✅ *(required in this fresh environment before lint/build)*
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run validate:museum-hub` ✅
- `npm run test:frame-budget` ✅
- `npm run docs:check-config-authority` ✅

## v0.93 — Local file-preview artwork recovery (2026-09-01)

### Changed

- The museum hub now treats offline `file://` customer image files as a special
  WebGL reliability case: when a slot's declared `image` resolves to a local
  `file-url` and the importer already embedded `webglImage`, the hub now uses
  the embedded artwork bytes up front instead of waiting for a blank post-upload
  plane before recovering.
- Extended hub image load/decode deadlines for inline `data:` artwork sources so
  the local preview can still render real paintings when the tracked preview
  falls back to built-in embedded artworks or when the embedded WebGL recovery
  path is selected.
- Added regression coverage in `scripts/test-museum-hub-geometry.mjs` for the
  new shared file-preview source-selection policy.
- Rebuilt the tracked `customer-preview/freyraum-gallery.js` and
  `customer-preview/app.html` so opening `index.html` locally uses the shipped
  recovery logic immediately.

### Validation

- `npm run import:artworks` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run validate:museum-hub` ✅
- `npm run test:frame-budget` ✅
- `npm run docs:check-config-authority` ✅
- Explicit `file:///home/runner/work/Freyraum/Freyraum/customer-preview/app.html?debug=verbose&hubDebug=1` reproduction ✅
  - with generated customer scripts, hub slots now settle on
    `data-artwork-source-mode="embedded-webgl-fallback"` and show real artwork
    pixels instead of blank grey planes;
  - without generated customer scripts, the built-in embedded artworks still
    reach `ready` in local preview instead of timing out.

## v0.92.1 — Persistent grey-artwork recovery implementation (2026-08-07)

### Changed

- Added a shared, redacted source→decode→GPU→visible-pixels outcome contract
  (`src/utils/sourceToPixelOutcome.ts`) recorded once per artwork per route,
  naming the resolved candidate, embedded-fallback usage, first failed stage,
  elapsed time, source/upload dimensions, and renderer capability, without
  ever logging raw URLs, data URIs, or image bytes.
- Added a shared capability-aware PNG downscale
  (`src/utils/textureUploadCompatibility.ts`) applied before any decoded image
  reaches the GPU in either route, sized against the live
  `renderer.capabilities.maxTextureSize`. A source that already fits is passed
  through unchanged; an oversize source is drawn once into a single bounded
  canvas, preserving aspect ratio and never upscaling.
- Added a bounded GPU visible-pixel probe (`src/utils/sourceToPixelProbe.ts`)
  that renders a bound texture to a cached 4×4 render target and reports only
  pass/fail plus average colour, gated to verbose diagnostics mode so the
  GPU-stalling readback never runs on default visitor traffic.
- Wired both into the interactive gallery (`TextureManager.loadForRole`,
  `loadArtworkAlbedo`) and the museum hub (`HubRoomRenderer.upsertSlot`,
  `imageTexture`, `MainMuseumHub.resolveSlotImage`), so a real
  `Fraktal.png`/`Akt 27.png` load now produces one explicit success record per
  route, and a failure names its first failed stage instead of only showing a
  placeholder.
- Left the current PNG importer, `customer-artworks/museum-hub.json`, and
  `scripts/import-artworks.mjs` untouched, and made no lighting, material, or
  `PaintingMaterial` change (Phase 4 of the v0.92 plan remains future work).

### Validation and residual risk

- `npm run lint`, `npm run build:typecheck`, `npm run build`,
  `npm run validate:museum-hub`, `npm run test:frame-budget`, and
  `npm run docs:check-config-authority` all passed.
- Phase 0 (manual multi-environment reproduction capture) and the Phase 1
  generated-bundle validator were not additionally implemented; the new
  outcome diagnostics make that reproduction available on demand instead.
  `npm audit --audit-level=moderate` still reports the pre-existing
  Vite/esbuild development-server advisory, unrelated to this change.
- An automated code review of this change surfaced one unrelated, pre-existing
  issue: `DestinationRouter.runTransition`'s rollback branch re-enters the
  previous destination without re-running `prepare()`. This is out of scope
  for the pixel-recovery fix and was intentionally left unmodified.

## v0.92 — Persistent grey-artwork recovery plan (2026-08-07)

### Documentation status

- Reopened the artwork-visibility incident after a customer report that grey
  museum artworks persist despite the v0.91 URL repair.
- Recorded the current two-PNG setup, route-specific fallback signatures, and
  the gap between generated-asset existence and source-to-pixel proof.
- Added a staged implementation plan for asset-contract validation, typed
  source/decode/upload outcomes, capability-aware downscaling, and a
  post-visibility gallery fidelity audit.
- No runtime behavior changed in this documentation-only planning update.

## v0.91 — Script-relative customer artwork bundle recovery (2026-08-07)

### Summary

- The customer importer now publishes a backward-compatible
  `window.__FREYRAUM_ARTWORK_BUNDLE__` envelope with bundle ID, generated
  timestamp, artwork records, and a script-derived `assetBaseUrl`, while still
  exposing `window.__FREYRAUM_ARTWORKS` for legacy readers.
- Runtime startup now sanitizes bundle envelopes as well as legacy injected
  arrays, rejects unsafe primary URL schemes, and carries bundle metadata into
  the active artwork manifest.
- Shared artwork-source resolution now distinguishes declared versus resolved
  URLs/types, resolves relative customer image paths against the generated
  bundle base, and applies the same result in both the interactive gallery and
  museum hub.
- Gallery and hub diagnostics now include bundle-aware declared/resolved source
  metadata, and the museum-hub regression fixture covers script-relative bundle
  resolution explicitly.
- Rebuilt `customer-preview/freyraum-gallery.js` so the tracked local preview
  matches the updated runtime/importer contract.

### Validation

- `npm install` ✅ *(existing advisories remain in the dependency tree; no new dependencies were added)*
- `npm run import:artworks` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run validate:museum-hub` ✅
- `npm run test:frame-budget` ✅
- `npm run docs:check-config-authority` ✅
- `node --check scripts/import-artworks.mjs` / `node --check scripts/write-local-preview.mjs` / `node --check scripts/visual-regression.mjs` / `node --check scripts/test-museum-hub-geometry.mjs` ✅
- `npm run validate:visual` ⚠️ *(script requires an explicit mode argument in this repository)*
- `npm run validate:museum-hub:visual` ⚠️ *(compare tooling dependencies `pixelmatch`/`pngjs` are not installed in this repository snapshot)*

## v0.90 — Shared artwork-source fallback contract for hub + gallery (2026-08-07)

### Summary

- Added a shared artwork-source resolver so both runtime routes treat the
  manifest `image` path as primary and optional embedded `webglImage` data as
  an explicit fallback.
- Reworked `MainMuseumHub` slot loading so first-page readiness now waits for an
  explicit decoded result: primary success, embedded fallback success, or a
  declared placeholder failure. Timeouts no longer count as implicit success.
- Added per-slot hub diagnostics/data attributes for resolved source mode,
  readiness state, and fallback reason, and warmed the resolved hub texture with
  `renderer.initTexture(...)` before reveal.
- Changed gallery albedo preload/use to retry the embedded fallback only after a
  declared-image failure, while preserving the generated fallback warning path
  for true final failures.
- Extended museum-hub regression coverage so fixture states now prove that a
  broken declared image can still render through the embedded fallback without
  showing the neutral placeholder.

### Validation

- `npm install` ✅ *(existing advisories remain in the dependency tree; no new dependencies were added)*
- `npm run import:artworks` ✅
- `npm run docs:check-config-authority` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run test:frame-budget` ✅
- `npm run validate:museum-hub` ✅
- `node -c scripts/import-artworks.mjs` ✅

## v0.89 — Interactive-gallery architectural stage + mounted presentation baseline (2026-08-07)

### Summary

- Added `GalleryPresentationStage` to the main gallery renderer so the
  interactive destination now renders against a compact front wall, floor,
  ceiling, side returns, skirting shadow gap, and ceiling reveal instead of the
  clear-colour/PMREM void.
- Kept the hub untouched on its dedicated v0.87 renderer path while giving the
  gallery stage its own `ArchitecturalSurfaceFactory` instance so hub/gallery
  resource ownership stays independent on preset changes and cleanup.
- Upgraded `ArtworkMesh` from a plane-only presentation to a shallow mounted
  work assembly whose opaque body casts the wall shadow cue while the customer
  image stays shadow-free.
- Introduced optional validated artwork `presentation` metadata for the
  interactive gallery (`canvas`, `fine-art-paper`, `matte-print`,
  `satin-print`, `glazed-print`); legacy `surface` text remains descriptive
  metadata only.
- Rebuilt `customer-preview/freyraum-gallery.js` and reran the importer so the
  committed local preview matches the new runtime/import contract.

### Validation

- `npm install` ✅ *(existing advisories remain in the dependency tree; no new dependencies were added)*
- `npm run import:artworks` ✅
- `npm run docs:check-config-authority` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run test:frame-budget` ✅
- `npm run validate:museum-hub` ✅
- `node -c scripts/import-artworks.mjs` ✅

## v0.87 — Square-room hub architectural quality tiers (2026-08-02)

### Summary

- Rebuilt `HubRoomRenderer` around a complete square-room shell: calibrated
  front/left/right walls, an entry-side enclosure behind the camera, doorway
  passage pockets, dark skirting shadow gaps, recessed ceiling light coves,
  shallow artwork side depth, and soft contact shadows.
- Added `ArchitecturalSurfaceFactory`, a shared procedural material set for
  wall, floor, ceiling, trim, doorway pocket, light-strip, and artwork-edge
  surfaces. Tileable normal/roughness maps are regenerated in place when the
  active quality preset changes.
- Quality presets now control the hub room too: pixel-ratio cap,
  architectural-surface tile size, skylight shadow budget, and floor
  reflection mode (`planar`, `ibl`, `off`). `MainMuseumHub` forwards preset
  changes to the room renderer at runtime.
- High and balanced presets now render an on-demand downscaled planar floor
  reflection with Fresnel/roughness weighting; battery disables hub
  reflections/environment/shadows and falls back to a diffuse mineral floor.
- Rebuilt `customer-preview/freyraum-gallery.js` so the committed local preview
  matches the runtime source.

### Validation

- `npm run import:artworks` ✅
- `npm run docs:check-config-authority` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run test:frame-budget` ✅
- `npm run validate:museum-hub` ✅

## v0.86 — Authoritative 3D museum-hub room pipeline (2026-08-01)

### Summary

- Replaced the hub’s projected DOM artwork rendering with a dedicated 3D room
  scene (`HubRoomRenderer`) that mounts artwork planes onto actual wall-local
  world transforms and renders them through one authoritative camera.
- Kept the existing DOM interaction layer, but changed it into a pure
  screen-space bridge: buttons now use projected bounds + clip paths instead of
  per-slot CSS `matrix3d(...)` transforms.
- Expanded the v4 `museum-hub.json` contract with room envelope, hanging rules,
  wall transforms/drawable regions/exclusion polygons, camera far/lens-shift,
  and normalized slot UV / scale / z-offset metadata.
- Hardened slot resolution so doorway/containment failures first seek the
  nearest valid pose on the same wall and then deterministically fall back to
  the next valid wall bucket before suppressing the slot.
- Preserved selection persistence by stable artwork ID, kept round-trip hub
  return feedback, and extended `?hubDebug=1` diagnostics with projected anchors
  plus world-space quads.
- Closed the remaining fatal-startup white-surface path by forcing the fallback
  screen to inherit the authoritative gallery-wall grey before rendering.
- Upgraded regression tooling:
  - `scripts/test-museum-hub-geometry.mjs` now validates the v4 room schema,
    world-space quad export, fallback wall buckets, perspective foreshortening,
    and the grey fallback path.
  - `scripts/visual-regression.mjs` now asserts that the hub renders through the
    dedicated `.museum-hub__canvas` scene bridge and that interactive overlays
    no longer rely on per-slot transform projection.

### Validation

- `npm run import:artworks` ✅
- `npm run docs:check-config-authority` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run test:frame-budget` ✅
- `npm run validate:museum-hub` ✅
- `FREYRAUM_URL=http://127.0.0.1:4173/app.html FREYRAUM_VISUAL_STATE_FILTER='hub__desktop__room-1,hub__desktop-wide__room-1,hub__phone__left-wall,hub__phone__right-wall,hub__fixture__doorway-left-edge,hub__fixture__doorway-right-edge,hub__desktop__missing-background-fallback,hub__desktop__missing-background-neutral,hub__desktop__selected-return-topbar' node scripts/visual-regression.mjs baseline` ✅
- `FREYRAUM_URL=http://127.0.0.1:4173/app.html FREYRAUM_VISUAL_STATE_FILTER='hub__desktop__room-1,hub__desktop-wide__room-1,hub__phone__left-wall,hub__phone__right-wall,hub__fixture__doorway-left-edge,hub__fixture__doorway-right-edge,hub__desktop__missing-background-fallback,hub__desktop__missing-background-neutral,hub__desktop__selected-return-topbar' node scripts/visual-regression.mjs capture` ✅
- `FREYRAUM_URL=http://127.0.0.1:4173/app.html FREYRAUM_VISUAL_STATE_FILTER='hub__desktop__room-1,hub__desktop-wide__room-1,hub__phone__left-wall,hub__phone__right-wall,hub__fixture__doorway-left-edge,hub__fixture__doorway-right-edge,hub__desktop__missing-background-fallback,hub__desktop__missing-background-neutral,hub__desktop__selected-return-topbar' node scripts/visual-regression.mjs compare` ✅

## v0.85 — Museum-hub realism, selection, and wall-token hardening (2026-08-01)

### Summary

- Reconciled v3 room-local wall planes against the configured photographed
  reference quads at resolve time, keeping room-local anchors authoritative
  while restoring realistic side-wall projection, residual metrics, and
  per-wall convergence checks.
- Replaced the hub’s doorway-avoidance heuristic with a deterministic local
  placement solver that records adjustment/rejection reasons and suppresses
  invalid slots instead of rendering floating invalid buttons.
- Added artwork-ID-based hub selection persistence, synchronized from gallery
  navigation and restored on hub re-entry with persistent `.is-selected` /
  `aria-current` feedback plus focus restoration to the current artwork slot.
- Centralized wall-surface color application across CSS variables, document/app
  shell, fallback, renderer clear color, transition diagnostics, and WebGL
  context restoration.
- Expanded geometry/visual regression tooling with doorway-edge fixtures,
  wall-realism assertions, invalid-slot suppression checks, round-trip
  selection states, transition surface snapshots, and context-restore token
  verification.
- Added a pre-screenshot Playwright hub/background fail-safe: 404 room-image
  URLs are logged with structured URL/status data, downgraded to
  `backgrounds/museum-empty.png` or the neutral museum-grey token, and still
  captured into a per-run `capture-report.json`.

### Validation

- `npm run import:artworks` ✅
- `npm run docs:check-config-authority` ✅
- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:frame-budget` ✅
- `npm run validate:museum-hub` ✅
- `FREYRAUM_URL=http://127.0.0.1:4173/Freyraum/app.html FREYRAUM_VISUAL_STATE_FILTER=missing-background node scripts/visual-regression.mjs capture` ✅ *(after `npm install --no-save playwright` + `npx playwright install chromium`, served via `vite preview`)*.

## v0.84 — Calibrated 3D museum room reconstruction (2026-08-01)

### Summary

- Replaced hub placement with a v3 calibrated camera/room-plane pipeline:
  wall-local metric anchors project through world, camera, NDC, and stage
  pixels before the terminal DOM transform is generated.
- Added local safe polygons, doorway exclusions, hanging bands, and placement
  validity checks. Invalid doorway/hanging placements are solved before render.
- Added a safe hub asset loader wrapper: missing/unshipped background or
  reference paths log structured 404 diagnostics, retry `museum-empty.png`
  once, and degrade to the neutral museum-grey token without aborting.
- Enforced the shared `#D8DDDB` background token across boot shell, gallery,
  hub, fallback, and WebGL clear color.
- Extended `?hubDebug=1`, deterministic hub checks, visual-regression states,
  and CI coverage for the calibrated room contract.

### Validation

- Pending final repository validation for this release.

## v0.83 — Museum-hub plane topology + diagnostics hardening (2026-08-01)

### Summary

- Replaced the shipping two-wall hub topology with four calibrated physical
  wall planes (`wall-left-outer`, `wall-left-inner`, `wall-right-inner`,
  `wall-right-outer`) in both built-in defaults and
  `customer-artworks/museum-hub.json`, while keeping canonical slot IDs stable.
- Updated baseline slot placements and v1 migration wall targeting so legacy
  placements map into the new multi-plane model instead of coarse left/right
  buckets.
- Fixed safe-zone validation coordinate-space drift: containment checks now use
  stage-space projected artwork corners against stage-space wall safe polygons.
- Added contain-style placement fitting/clamping in the resolver so oversized or
  edge-straddling placements are nudged toward valid drawable regions.
- Added read-only `?hubDebug=1` overlay diagnostics (wall/safe polygons,
  projected slot quads/corners, local axes, per-slot homography snapshots)
  without enabling calibration edits.
- Expanded regression hardening:
  - `scripts/test-museum-hub-geometry.mjs` now validates the shipping
    `museum-hub.json` with stage-space containment, doorway exclusions, minimum
    projected-size thresholds, corner tolerances, and homography roundtrip
    bounds.
  - `scripts/visual-regression.mjs` now covers wide desktop + narrow portrait
    wall-focus states, very tall/square/very wide fixture sets, and optional
    debug-overlay capture via `FREYRAUM_VISUAL_INCLUDE_HUB_DEBUG=1`.
  - Added `npm run validate:museum-hub` and wired it into
    `.github/workflows/quality-and-doc-drift.yml`.
- Added runtime wall-color consistency verification snapshots (tokens, CSS vars,
  hub/fallback/transition surfaces, renderer clear color) and normalized the
  local launcher shell’s stale background tone to the authoritative wall token.

### Validation

- `npm run import:artworks` ✅
- `npm run docs:check-config-authority` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run test:frame-budget` ✅
- `npm run validate:museum-hub` ✅
- `npm run validate:visual compare` ⚠️ *(requires Type A optional dependencies and an existing local baseline under `.visual-regression/baseline`)*.

## v0.82 — Wall-plane museum hub projection (2026-08-01)

### Summary

- Replaced the museum hub’s per-slot framed box model with a versioned v2
  wall-plane contract: `museum-hub.json` now stores a fixed stage size,
  calibrated wall quads, safe polygons, wall-local mounted sizes, and exact
  artwork mappings. Legacy `hub-hotspots.json` and v1 box placements migrate
  automatically with provisional recalibration warnings.
- Rebuilt `MainMuseumHub` as a DOM projective renderer: each artwork remains a
  native button but is mapped through a calibrated planar projection, so all
  artworks on a wall share one consistent vanishing geometry instead of
  independent `perspective: 900px` / `rotateY()` transforms.
- Removed visible frames, mats, bevels, and decorative rims from hub artworks.
  Normal runtime states now show raw artwork-to-edge presentation, subtle
  contact shadows, focus-only affordances, and neutral unframed placeholders.
- Upgraded `?hubCalibrate=1` to author wall corners, safe-zone points, and
  wall-local artwork placement/size, with live warnings and restore-last-valid
  recovery.
- Changed the authoritative gallery/hub/WebGL wall token from `#E2E4E3` to
  `#D8DDDB` across config defaults, checked-in customer config, CSS, and
  `RendererManager`.
- Extended regression tooling with museum-hub screenshot states in
  `scripts/visual-regression.mjs` and added
  `scripts/test-museum-hub-geometry.mjs` for geometry/migration assertions.

### Validation

- `npm install` ✅
- `npm run import:artworks` ✅
- `npm run docs:check-config-authority` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run test:frame-budget` ✅
- `node scripts/test-museum-hub-geometry.mjs` ✅

## v0.81 — Manifest-Driven Museum Hub Composition (2026-07-31)

### Summary

- Replaced the baked `museum-target.png` hub with a manifest-driven DOM
  composition over `museum-empty.png`: every active artwork renders as a real
  responsive image inside its own framed native button, so visual bounds and
  hit bounds cannot drift. `museum-target.png` remains in the repository as a
  calibration reference but is no longer shipped to `public/`/`dist/`.
- Introduced the unified customer configuration
  `customer-artworks/museum-hub.json` (version, background, visual tokens,
  frame presets, fallbacks, slots) injected as `window.__FREYRAUM_MUSEUM_HUB`;
  the legacy `hub-hotspots.json` array still works through automatic migration
  with a deprecation warning.
- New exact-ID resolver (`src/config/museumHub.ts`): explicit mappings win,
  unmapped active artworks auto-place by aspect class then stable ID order,
  overflow paginates into additional room pages (four slots per page, no
  six-artwork cap). Invalid or duplicate mappings disable the slot — they can
  never open another artwork. Missing image data shows a neutral placeholder
  bound to the same exact target. Zero valid slots exposes one generic
  gallery-entry action.
- Frames use shared static CSS material presets (matte charcoal default, warm
  oak and dark anodized aluminum optional): roughness/metalness metadata is
  translated once into highlight/shadow strengths; perspective, bevel,
  recessed aperture, and wall-specific static shadows add zero WebGL draw
  calls and no continuous renders.
- Gallery selection is ID-based with a selection generation token: duplicate
  clicks and stale readiness completions cannot change the destination, and
  the 1500 ms readiness fallback (`albedoLoaded && materialApplied &&
  shaderCompiled` preferred) opens the exact requested work procedurally.
- Hub preparation (background fetch + first-page artwork decode + slot layout)
  completes under the loading overlay as the final weighted progress step;
  later room pages decode during idle time and that work cancels when a
  gallery transition begins.
- Rolled out the museum-grey wall token `#E2E4E3` as authoritative
  `--color-gallery-wall` (with `--color-museum-wall` defaulting to it and
  customer-overridable): CSS surfaces, hub gradients (no near-white radial),
  local preview shell, and the WebGL clear color all resolve from one token
  before renderer construction.
- Redesigned the back control: first position in the left topbar group with a
  dedicated `topbar__back-btn` class and lifecycle, 48 px dark filled surface
  with "Zurück zum Museum" (arrow + "Museum" on phones), dual-contrast 3 px
  focus ring, busy/disabled state during transitions, and visibility in clean,
  visible, and presentation chrome modes. The topbar now uses grid regions so
  the control cannot collide with the right utility cluster.
- Narrow-portrait viewports (aspect below 4:5) split each room page into
  left/right wall focus pages with arrows, swipe, counter, and keyboard
  navigation; off-wall frames leave the actionable set entirely. Returning to
  the hub preserves its page and restores focus to the originating slot.
- Calibration mode (`?hubCalibrate=1`) now manipulates the actual frame bounds
  and exports the complete `museum-hub.json` schema.

### Validation

- `npm run import:artworks` ✅
- `npm run docs:check-config-authority` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run test:frame-budget` ✅
- `node --check scripts/import-artworks.mjs` / `node --check scripts/sync-customer-public.mjs` ✅
- Browser matrix: hub composition renders both customer works over the empty
  room; slot click, timeline state, info panel, and gallery `Artwork.id` agree
  for both slots; back button and guarded Escape return with focus restored to
  the originating slot; wall-focus pages ("Linke/Rechte Wand") navigate with
  correct pager disabled states; phone tier shows the short "Museum" label ✅
- Shipped hub-background transfer drops from ~16.2 MB (two PNGs) to ~10.7 MB
  (empty room only); artwork images reuse browser-cached manifest URLs ✅

## v0.80 — Hub Visual Reliability Closure (2026-07-31)

### Summary

- Replaced runtime GitHub attachment dependencies with the committed target and
  empty museum backgrounds.
- Added hub backgrounds to the customer-public sync and Pages artifact
  validation while keeping them out of the JavaScript bundle.
- Calibrated customer hotspots to the supplied 1366 × 768 visual: `fraktal`
  targets the left portrait and `akt-27` targets the centre-right square.
- Calibrated all four built-in hotspot defaults to the visible frames.
- Hid the legacy central entry target whenever artwork hotspots exist and moved
  initial/error focus to the first hotspot.
- Made image fallback selection state-based so relative URLs cannot cause a
  repeated fallback error loop.
- Fixed the idle texture-prefetch sweep recursing synchronously on artworks
  without authored texture sets.
- Prevented Escape from closing Help/Preferences and also returning to the hub.
- Made the gallery canvas an explicit programmatic focus target after hub entry.

### Validation

- `npm run import:artworks` ✅
- `npm run docs:check-config-authority` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run test:frame-budget` ✅
- `node --check scripts/sync-customer-public.mjs` ✅
- Manual Pages-base loading, initial focus, both hotspot selections, back
  navigation, and missing-primary fallback ✅
- Manual canvas focus, Help/Preferences Escape consumption, and unhandled
  Escape back-navigation ✅
- Hotspot calibration used the supplied reference; the local target image was
  not opened for visual inspection ✅

## v0.79 — Hub Hotspot Navigation (2026-07-31)

### Summary

- Added artwork hotspots to the Main Museum Hub: stable slots (`slot-1 … N`)
  map to artwork IDs via one editable config model
  (`src/config/hubHotspots.ts`), with a customer override in
  `customer-artworks/hub-hotspots.json` injected as
  `window.__FREYRAUM_HUB_HOTSPOTS` by the importer.
- Hotspot coordinates are normalized `(cx, cy, w, h)` relative to the hub
  image content box; defaults derive from wall-band/manifest-aspect formulas —
  no image pixels are read.
- Valid hotspot clicks jump the gallery to the target artwork behind a
  1500 ms readiness gate (`materialApplied && shaderCompiled`), then enter;
  timeout entry proceeds on the procedural surface. Missing/invalid IDs use
  `fallback_to_gallery_default` (gallery opens at its current index).
- Added back navigation to the hub: Topbar "Museum" button and guarded Escape.
- Added the `--museum-wall-light: #ECEBE8` background token for the hub base
  fill, image-error state, and hotspot focus-ring backdrop.
- Added a non-dev hotspot calibration mode (config query flag; documented in
  `docs/QUERY_PARAMETERS.md`) with drag/resize and a JSON copy panel.

### Validation

- `npm run docs:check-config-authority` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run test:frame-budget` ✅
- `node --check scripts/import-artworks.mjs` ✅

## v0.78 — Main Museum Hub (2026-07-31)

### Summary

- Changed startup to `Loading Screen → Main Museum Hub → Interactive Gallery`.
- Added a static, responsive museum-room hub using the supplied visual and an
  accessible central-artwork destination target.
- Added a registration-based destination router with transition locking,
  cancellation guards, lifecycle hooks, error recovery, and idempotent disposal.
- Gated gallery pointer, touch, wheel, and keyboard input until gallery entry.
- Preserved the existing gallery initialization, preload, GPU warmup, controls,
  rendering, and artwork behavior after entry.
- Added reduced-motion handling, responsive hub framing, focus restoration, and
  hidden gallery chrome while the hub is active.

### Validation

- `npm run docs:check-config-authority` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run test:frame-budget` ✅
- Manual loading → hub → gallery pointer/focus flow ✅
- Visual comparison was not runnable because the repository does not install its
  optional `pixelmatch`/`pngjs` comparison packages; no dependency was added.

## v0.77 — Fixed gallery presentation and metadata semantics (2026-07-19, **shipped**)

### Summary

- Removed lighting preset controls and persisted lighting preferences; startup and
  runtime now always use the internal dramatic warm/cool configuration.
- Removed metallic artwork frames, frame shaders/materials/geometry, frame quality
  fields, diagnostics, and frame seed/cache paths.
- Removed left/right WebGL preview artworks and their click raycasting while
  preserving timeline, arrow, swipe, and keyboard navigation.
- Kept the timeline visible in desktop and responsive layouts. Clean-chrome
  auto-hide now applies only to artwork information and navigation controls.
- Changed `Surface` to optional customer-facing free text. It is displayed with
  artwork metadata and no longer changes clearcoat or any render setting.
- Matched the WebGL clear color to the light-grey CSS background token.
- Updated visual-regression state generation for the single lighting setup.

### Migration

- Existing generated manifests must be regenerated with `npm run import:artworks`
  to replace `surfaceProfile` with optional `surface` text.
- Stored `lighting` keys from earlier versions are ignored and disappear on the
  next preference write.

### Validation

- Baseline: `npm install`, `npm run lint`, `npm run build`,
  `npm run docs:check-config-authority`, `npm run test:frame-budget` ✅
- Post-change: `npm install`, `npm run lint`, `npm run build`,
  `npm run docs:check-config-authority`, `node -c scripts/import-artworks.mjs`,
  and `npm run test:frame-budget` ✅
- Known non-blocking baseline remains: npm reports 2 tooling vulnerabilities
  (1 moderate, 1 high); Vite reports the existing large-chunk warning; Sass
  reports its legacy JavaScript API deprecation.

## v0.76 — High-resolution asset publishing plan + markdown audit (2026-07-07, **docs-only**)

### Status

**Planning/docs only.** No importer, runtime, or deployment behavior changed in
this update.

### Summary

- Audited the current customer artwork pipeline and confirmed that the repository
  still tracks source artwork files in `customer-artworks/inbox/`.
- Documented the key GitHub constraints that make very large originals
  unreliable in the current workflow: 25 MiB browser uploads, 100 MiB Git hard
  block, 1 GB Pages site size, and no Git LFS support for Pages assets.
- Recorded a new active plan in `plan.md` for a derivative-first publish model:
  keep archival masters outside the Pages repo, commit only GitHub-safe publish
  assets, and stop shipping full-size image bytes inside deployed JS manifests.
- Refreshed the customer/operator markdown set so the current limitation and the
  planned direction are visible from `README.md`,
  `docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/DEPLOYMENT.md`,
  `docs/IMAGE_MAINTENANCE_GUIDE.md`, and `docs/HANDOFF.md`.
- Corrected contributor/documentation validation docs so the verified regression
  gate is `npm run test:frame-budget` rather than a non-existent generic
  `npm run test`.
- Refreshed the remaining non-archive markdown banners that still pointed at the
  2026-06-05 audit so the active audit date is consistent across the operational
  docs set.

### Validation

- `npm install` ✅
- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `npm run docs:check-config-authority` ✅
- `npm run test:frame-budget` ✅

### Files

- `plan.md`
- `FINDINGS.md`
- `README.md`
- `AI_RULES.md`
- `CONTRIBUTING.md`
- `DOCUMENTATION_RULES.md`
- `LESSONS_LEARNED.md`
- `docs/CUSTOMER_PICTURE_GUIDE.md`
- `docs/DEPLOYMENT.md`
- `docs/DEPENDENCY_MAINTENANCE_PLAN.md`
- `docs/ai-feedback/AI_FEEDBACK_LOOP.md`
- `docs/IMAGE_MAINTENANCE_GUIDE.md`
- `docs/HANDOFF.md`
- `docs/lessons-learned/README.md`
- `docs/standards/CODING_GUIDELINES.md`
- `CHANGELOG.md`

## v0.74 — Performance remediation execution (2026-06-21, **shipped**)

### Status

**Shipped.** Completes the reviewer-identified v0.74 Tier 1 gaps and converts more of the regression tooling from passive helpers into runnable gates.

### Summary

- **OPT-1 completed:** `GalleryManager.update()` now measures viewport metrics once for the frame and passes the same metrics/bounds through zoom and pan clamping, avoiding repeated viewport recomputation in the hot path.
- **OPT-2 shipped as standalone frame-geometry cache:** `ArtworkMesh` caches/reuses `frameMesh.geometry` by aspect + bevel state. This does not touch `artworkMesh.geometry`, so it does not conflict with future OPT-9 artwork LOD ownership.
- **OPT-7 completed:** panel-click raycasting now reuses a `THREE.Vector2` scratch instead of allocating on every panel click.
- **T1-C completed:** debug diagnostics are skipped entirely outside verbose mode, support lazy payload factories, and frame/material debug logs now route through diagnostics instead of direct `console.debug`.
- **Phase 0 first step shipped:** the render loop now samples frame budget every rAF but skips `postProcessing.render()` when lighting, gallery animation, readiness work, and dirty-frame cooldowns are all settled.
- **Regression gates improved:** Type A visual regression coverage now spans lighting profile × artwork step × zoom state and checks Type B invariants before every screenshot. Type C tooling exposes Tier 1 threshold checks for GC/min and GC pause P99.

### Validation

- Baseline before edits: `npm install`, `npm run lint`, `npm run build`, `npm run test:frame-budget`, `npm run docs:check-config-authority` ✅
- After runtime edits: `npm run lint`, `npm run build:typecheck` ✅

### Files

- `src/gallery/GalleryManager.ts`
- `src/gallery/ArtworkMesh.ts`
- `src/lighting/LightingSetup.ts`
- `src/main.ts`
- `src/materials/CanvasMaterial.ts`
- `src/utils/Diagnostics.ts`
- `src/utils/PerformanceMetrics.ts`
- `src/utils/performanceTooling.ts`
- `scripts/visual-regression.mjs`
- `plan.md`, `FINDINGS.md`, `docs/REGRESSION_TOOLING.md`, `README.md`, `ARCHITECTURE_MAP.md`, `docs/HANDOFF.md`

## v0.73 — Merge-readiness docs sync (2026-06-05, **shipped**)

### Status

**Shipped.** Documentation and release-status correction only. Runtime code unchanged from current branch baseline.

### Summary

- **Current runtime frame path clarified:** branch runs the v0.69 frame baseline (`customProgramCacheKey: frame-v0.69-*`) with no v0.70+ macro lane in `CanvasMaterial`.
- **Release notes corrected for merge readiness:** top-level status docs now explicitly state that v0.70/v0.71/v0.72 frame work is historical and not active in current runtime.
- **Cross-doc consistency restored:** `README.md`, `FINDINGS.md`, `plan.md`, `ARCHITECTURE_MAP.md`, and `docs/HANDOFF.md` now align on one status statement.
- **Validation rerun:** `npm run lint` ✅, `npm run build` ✅.

### Files

- `CHANGELOG.md`
- `README.md`
- `FINDINGS.md`
- `plan.md`
- `ARCHITECTURE_MAP.md`
- `docs/HANDOFF.md`

## v0.72 — Natural-scratch frame model (2026-06-04, **shipped**)

### Status

**Shipped.** Runtime shader changes validated (lint ✅, build ✅).

### Summary

Addresses "flat and unnatural" frame appearance introduced in v0.71. The v0.71 shiny-scratch model (subtractive roughness) created mirror-like bright strips on a dull-ish base (roughness 0.40/0.48), which read as artificial rather than natural brushed aluminum.

- **Scratch model reverted to additive:** Scratch marks now add a small amount of roughness (+0.025/+0.018 micro, +0.045/+0.032 macro) rather than subtracting it. Scratches disrupt the surface coating → slightly more matte, not shinier.
- **Normal gradient scale:** `0.085` → `0.12` (41% stronger) — brushed texture is more visibly three-dimensional.
- **Base roughness (quality.ts):** high `0.40` → `0.23`; balanced `0.48` → `0.31` — restores the satin-aluminum sheen that was lost in v0.71.
- **Clearcoat (quality.ts):** high `0.12` → `0.28`; balanced `0.08` → `0.16` — a stronger gloss top layer adds visible specular depth and the layered look of anodized/lacquered aluminum.
- **Roughness grain amplitude:** high `±0.07` → `±0.05`; balanced `±0.05` → `±0.035`; battery `±0.04` → `±0.03` — tighter variation keeps the satin base uniform.
- **Anisotropy direction perturbation:** `±23°` → `±12.6°` — more consistent directional grain; less scattered shimmer.
- **Cache key:** `frame-v0.71-*` → `frame-v0.72-*` to force shader recompile.

### Files

- `src/materials/CanvasMaterial.ts`
- `src/config/quality.ts`
- `CHANGELOG.md`

## v0.71 — UE5-inspired metal detail visibility uplift (2026-06-04, **shipped**)

### Status

**Shipped.** Runtime shader changes implemented and validated (lint ✅, build ✅).

### Summary

All changes are in `CanvasMaterial.ts` and `quality.ts`. The core insight from Unreal Engine 5 brushed-metal materials is that **scratches expose raw shiny metal** (lower roughness) rather than making the surface rougher — this creates the dramatic specular-highlight "catch the light" effect at macro viewing distance.

- **Normal gradient scale:** `0.025` → `0.085` (3.4×). Brushed grain ridges/fibers now produce a clearly visible normal tilt (max ~24° instead of ~7°).
- **Fine grain amplitude** (high): `0.006` → `0.022`; (balanced): `0.004` → `0.016` — both ~3.7× stronger.
- **Macro scratch normal amplitude** (high): `0.006` → `0.025`; (balanced): `0.003` → `0.014` — both ~4× stronger.
- **Shiny-scratch roughness model (UE5):** Scratch contributions are now **subtracted** from base roughness instead of added. Scratches expose lower-roughness metal, creating bright specular highlights:
  - High: micro `−0.065`, macro `−0.30`; roughness floor lowered to `0.06`.
  - Balanced: micro `−0.044`, macro `−0.20`; floor `0.08`.
  - Battery: `−0.035`; floor `0.10`.
- **Roughness grain modulation** (high): `±0.02` → `±0.07`; (balanced): `±0.015` → `±0.05` — clearly visible surface micro-variation.
- **Scratch presence/density:** micro threshold `1.8%` → `3.2%`; macro `4%` → `7%` — roughly 2× more scratch occurrences.
- **Scratch line geometry:** micro width 2×, inten 2×; macro inten `0.055..0.155` (was `0.030..0.090`).
- **Macro layer multipliers:** `(a*0.20 + b*0.16 + c*0.13)` → `(a*0.32 + b*0.26 + c*0.20)`, cap `0.35` (was `0.20`).
- **Anisotropy direction perturbation** (high): `±10°` → `±23°` — wider directional fiber shimmer band for visible metallic grain sheen.
- **Base roughness in quality config:** high `0.28` → `0.40`; balanced `0.38` → `0.48` — higher base roughness amplifies the contrast of shiny scratch highlights.
- **Cache key:** `frame-v0.70-*` → `frame-v0.71-*` to force shader recompile.

### Files

- `src/materials/CanvasMaterial.ts`
- `src/config/quality.ts`
- `CHANGELOG.md`



## v0.70 — Macro-visible micro-scratch uplift (2026-06-04, **shipped**)

### Status

**Shipped.** Runtime shader changes implemented and validated.

### Summary

- **S-01 macro lane added.** `CanvasMaterial` now includes a dedicated macro scratch lane (`frmScratchLayerMacro`) with lower densities (`2.0..7.0`), wider profile floor (`0.0016..0.0040`), and stronger per-line intensity.
- **S-02 wear-zone masking added.** New `frmWearZoneMask(alongX, seed)` gates macro scratches through a low-frequency, smoothly interpolated zone hash so wear is clustered but non-blocky.
- **S-03 roughness-vs-normal split.** Macro readability is roughness-led (`high` strongest, `balanced` reduced), while macro normal contribution stays bounded to avoid engraved-groove artifacts.
- **S-04 split attenuation windows.** Micro lane keeps aggressive fade; macro lane uses a slower fade window (`1 - smoothstep(0.006, 0.024, fwidth(vFrameUV.x))`) to survive medium-close views without distance shimmer.
- **S-05 anti-banding invariants preserved.** No `barUV.y` was introduced into FBM/noise paths that drive normal gradients.
- **S-06 compile/cache updates.** Added `FRAME_MACRO_SCRATCH` compile flag for high/balanced presets and bumped cache key from `frame-v0.69-*` to `frame-v0.70-*`.
- **S-07 diagnostics extended.** `[CanvasMaterial] frame-shader-compiled` now logs macro lane enabled/mode, density range, width range, attenuation window, and v0.70 cache key. Added explicit macro-state debug log for reduced/off modes.
- **S-08 validation.** `npm run lint` ✅, `npm run build` ✅.

### Files

- `src/materials/CanvasMaterial.ts`
- `src/config/quality.ts`
- `plan.md`
- `FINDINGS.md`
- `ARCHITECTURE_MAP.md`
- `CHANGELOG.md`
- `README.md`
- `docs/HANDOFF.md`

## v0.69 — Metal frame close-up realism uplift (2026-06-04, **shipped**)

### Status

**Shipped.** Implements the v0.68 frame-detail plan (M-01..M-08) with two audit deltas applied before code: anisotropy direction is computed in GLSL from `vFrameUV` (not via `material.anisotropyMap`) to sidestep the standard-`uv` channel mismatch with the frame's `aFrameUV` attribute, and battery `frameRoughness` documentation aligned to the runtime value (`0.60`).

### Summary

- **M-01 baseline diagnostic.** `[CanvasMaterial] frame-shader-compiled` now records `version: 'v0.69'`, `frameDetailLevel`, `normalGradientScale`, `fineGrainAmplitude`, `roughnessGrainAmp`, `scratchRoughnessMax`, `clusterGainEnabled`, `anisoPerFragmentEnabled`, and `cacheKey`.
- **M-02 multi-scale grain.** New `frmBrushedFbm2` (4× base frequency, 1/4 amplitude, identical 1-D invariant) drives a fine-detail normal term on `high` (amp `0.006`) and `balanced` (amp `0.004`).
- **M-03 clustered scratches (high only).** Coarse per-zone hash (`floor(barUV.x * 3.0 + 1.0)`) groups scratches into wear families with `2.5×` presence peak in ~40 % of zones; the `+0.015` scratch roughness cap is unchanged.
- **M-04 per-fragment anisotropy direction (high only).** GLSL injection in `lights_physical_fragment` rotates the brushed direction by `±0.18 rad ≈ ±10°` along `vFrameUV.x` while preserving the cross-bar invariant.
- **M-05 derivative-aware AA.** `fwidth(vFrameUV.x)` attenuates the fine-grain normal and the roughness-grain modulation toward neutral at mid distance, eliminating shimmer with no preset branching at the call site.
- **M-06 preset compile-flag branching.** Added `QualityPreset.frameDetailLevel: 'high' | 'balanced' | 'none'`. `#define FRAME_DETAIL_HIGH|BALANCED` selects compiled detail level; `customProgramCacheKey` is now `'frame-v0.69-' + frameDetailLevel` (three programs total, not one per artwork seed).
- **M-07 validation.** `npm run lint` ✅, `npm run build` ✅. Bundle: 731.54 → 739.45 kB (+1.1 %), gzip 192.07 → 194.22 kB (+1.1 %). Cross-bar `dFBM/dY = 0` invariant preserved.
- **M-08 documentation.** This entry; `plan.md`, `FINDINGS.md`, `ARCHITECTURE_MAP.md`, `docs/HANDOFF.md`, and `README.md` synced.

### Files

- `src/materials/CanvasMaterial.ts` — multi-scale FBM, cluster scratches, per-preset roughness blocks, per-fragment anisotropy injection, versioned cache key, extended baseline log.
- `src/config/quality.ts` — new `frameDetailLevel` field; `high → 'high'`, `balanced → 'balanced'`, `battery → 'none'`.
- `plan.md`, `CHANGELOG.md`, `FINDINGS.md`, `ARCHITECTURE_MAP.md`, `docs/HANDOFF.md`, `README.md` — synced.

## v0.68 — Metal frame close-up realism plan (2026-06-04, **superseded by v0.69**)

### Status

**Planning/docs only.** No runtime code changes shipped in this update.

### Summary

- Audited current frame shader/material path (`CanvasMaterial`, `ArtworkMesh`, quality presets) with focus on close-zoom realism limits. Key findings: purely 1-D FBM (v0.54 invariant correct), `customProgramCacheKey = 'frame-v0.54'`, no `anisotropyMap` set, roughness grain amplitude `±0.030`.
- Performed online research for anisotropic brushed-metal best practices in realtime PBR. Key findings: Three.js r166 (installed) natively supports `material.anisotropyMap`; `fwidth(barUV.x)` is the correct derivative-aware AA guard for procedural normals; multi-scale FBM with 1:4 amplitude ratio is the standard close-up metal technique.
- **Enhanced plan in `plan.md`** (v0.68 frame-detail section): added concrete GLSL code for M-02 fine-grain FBM (`frmBrushedFbm2`), M-03 clustered scratch layer, M-05 `fwidth` AA integration; added TypeScript API pattern for M-04 `anisotropyMap` `DataTexture` generation; added `customProgramCacheKey` versioning strategy (`'frame-v0.54'` → `'frame-v0.69-{preset}'`); added `#define FRAME_DETAIL_HIGH / BALANCED` compile-flag strategy for preset branching.
- Documented findings and architecture/handoff implications across all markdown files.

### Files (docs only)

- `plan.md` — v0.68 frame-detail section enhanced with concrete GLSL + TypeScript coding guidance
- `FINDINGS.md` — extended with code-verified findings and API research details
- `ARCHITECTURE_MAP.md` — invariants updated with API specifics and cache-key strategy
- `CHANGELOG.md`
- `README.md`
- `docs/HANDOFF.md`

## v0.68 — Staged startup readiness (v0.67 performance plan, Phase 2) (2026-06-04, **shipped**)

### Status

**Shipped.** Implemented in runtime code and validated (`npm run lint` + `npm run build` pass). Executes the actionable runtime portions of the v0.67 performance plan (P-04, P-06, P-07). The offline KTX2/Basis tier pipeline (P-05) remains the next, offline-tooling phase — see `plan.md` (it requires offline asset re-encoding that cannot be executed/validated in a runtime-only sandbox).

### Problem addressed

After the v0.67 Phase 1 quality lock, the dominant remaining startup cost was strategy breadth, not adaptive quality: the entry CTA waited for a strict **full-gallery** contract — every artwork's PBR set preloaded, GPU-warmed, and final-path-warmed under the loading overlay. For large customer galleries this scales linearly and delays first interaction. Online research (web.dev INP, Three.js KTX2 guidance, NN/g progressive loading) is consistent: enable interaction as soon as the active + near view is ready, then stream the remainder while yielding per frame.

### Changes — staged startup readiness (P-04, P-06, P-07)

**`src/config/startup.ts` (new)**
- Single source of truth for the startup readiness contract and warm-budget constants.
- `StartupReadinessMode` = `full` (legacy strict) | `entry-balanced` (new default) | `entry-minimal`, resolved from a single feature flag: `?startup=` query param → `localStorage['freyraum:startup-readiness']` → default. Fail-safe (never throws).
- `computeEntryTargetCount(...)` derives the pre-entry warm count from mode + device tier + critical radius + artwork count (replaces the `MAX_SAFE_INTEGER` cap). `WARM_BUDGET` centralises the per-frame warm-budget constants so behaviour and diagnostics cannot diverge.

**`src/gallery/GalleryManager.ts`**
- `configureStartupReadiness({ mode, entryTargetCount })` + `getStartupEntryTargets()` + `isStagedStartup`.
- `init()` eagerly preloads PBR only for the entry target set in entry modes; every other artwork with a texture set is queued deterministically to the `near-next` lane (it streams in after entry, never blocking the CTA). `full` mode preloads the whole gallery exactly as before.
- `getFullGalleryReadinessSummary()` is mode-aware: `preloadMode` is now `strict | staged | bounded-fallback`, and reports `deferredArtworkCount` (artworks intentionally deferred to background lanes — expected, not a contract failure).

**`src/main.ts`**
- Pre-entry GPU warm + final-path warm now cover only the entry target set (`fullWarmTargets = getStartupEntryTargets(0)`); in `full` mode this is the whole gallery (unchanged). The remaining artworks are warmed after entry by the existing budgeted `continueWarmQueue` (per-frame ms + batch guards), which previously ran as a no-op.
- The unresolved-artwork gate treats deferred artworks as expected (`info`) in staged/bounded modes and a failure (`warn`) only in strict mode.
- New stable-schema `boot / performance-gate` diagnostic (P-07): startup readiness mode, entry/deferred warm counts, no-auto-quality-writes assertion, startup ms to CTA, post-reveal frame budget, and readiness ledger snapshot — phase-comparable evidence for rollout decisions.

### Acceptance criteria met

1. User quality preset remains fully manual/authoritative (unchanged from Phase 1). ✅
2. Entry readiness no longer requires full-gallery full-path warming (entry modes). ✅
3. Remaining artworks complete deterministically after entry via background lanes with per-frame budget guards. ✅
4. `full` mode preserves the legacy strict contract exactly as a one-flag rollback. ✅
5. Phase-comparable quantitative diagnostics emitted for every startup (`performance-gate`). ✅

### Deferred to the next (offline) phase

- **P-05 — offline artwork tier pipeline (source → `thumb`/`mid`/`full` + KTX2/Basis with mipmaps).** Requires offline asset re-encoding (KTX2/Basis tooling) and a per-artwork tier manifest with fail-safe runtime fallback. Tracked in `plan.md`; not implementable/validatable in a runtime-only sandbox.


## v0.67 — Performance stabilization + no automatic quality changes (2026-06-04, **Phase 1 shipped**)

### Status

**Phase 1 shipped.** Implemented in runtime code and validated (`npm run lint` + `npm run build` pass). The large-artwork asset-pipeline / staged-loading work (P-04–P-06) and rollout validation (P-07) remain planning-only and are deferred to future phased PRs — see `plan.md`.

### Problem addressed

Performance settings were changing automatically at runtime (adaptive preset downgrades) and on first run (startup heuristic). The customer wants the selected quality to be authoritative, and performance work to focus on real rendering/asset optimizations rather than hidden preset changes.

### Changes — quality lock (P-01, P-02, P-03)

**`src/utils/AdaptiveQualityController.ts`**
- Added a `locked` constructor flag (default `false`) and an `isLocked` getter.
- In locked mode, `evaluate()` no longer mutates the preset or returns a downgrade. When sustained frame-budget pressure is detected it emits a throttled `quality / locked-pressure` warning (preset, rolling ms/fps, ema, severe-frame count) and returns `null`, keeping diagnostics visibility without changing quality.

**`src/main.ts`**
- Adaptive controller is now constructed locked via `AUTOMATIC_QUALITY_CHANGES_ENABLED = false`, so the render loop never calls `preferences.setQuality(...)` from performance events. Removed the `adaptiveQualityWriteInFlight` write-flag plumbing; every preference quality change is now treated as user-initiated (manual).
- First-run startup heuristic is now diagnostics-only: it keeps the deterministic `DEFAULT_QUALITY_PRESET` and logs `quality / startup-suggestion-suppressed` with what the legacy heuristic would have suggested, instead of applying it. Stored user choices (`hasStoredQuality()`) are unaffected.

### Acceptance criteria met (Phase 1)

1. Runtime never changes the user quality preset automatically. ✅
2. First-run startup does not silently switch preset. ✅
3. Performance mitigation now prefers internal optimization over hidden preset downgrades; diagnostics surface pressure without changing quality. ✅ (asset-pipeline gains tracked under P-04–P-06)


## v0.66 — Affordance discoverability (2026-06-04, **shipped**)

### Status

**Shipped.** Implemented in runtime code and validated (`npm run lint` + `npm run build` pass).

### Problem addressed

Edge affordances (peek strips + chevrons) are too subtle for first-time users who have no prior knowledge they exist. Research (NNGroup, Material Design, Apple HIG) consistently shows hidden-navigation UI needs either (a) larger, higher-contrast cues or (b) a clearly visible secondary entry point that doesn't rely on edge discovery.

### Changes

**CSS — bigger, more visible edge cues (`src/styles/main.scss`)**
- `--chrome-peek-height-h` `7px → 14px` — bottom strip is now unmissable at a glance
- `--chrome-peek-width-v` `7px → 10px` — left strip noticeably wider
- `--chrome-peek-length-h` `min(360px, 36vw) → min(520px, 52vw)` — wider bottom strip
- `--chrome-peek-length-v` `min(220px, 22vh) → min(260px, 26vh)` — taller left strip
- `--chrome-affordance-size` `16px → 22px` — larger chevrons
- `--chrome-affordance-weight` `2.8px → 3.5px` — thicker chevron strokes
- `--chrome-affordance-color` `0.84 → 0.90` — brighter chevron fill
- `--chrome-peek-bg` alpha `0.52 → 0.58`
- `--dur-peek-pulse` `2.6s → 2.0s` — slightly quicker breathing catches the eye faster
- `peek-pulse` floor `0.82 → 0.88` — strip is visibly present even at animation trough
- `peek-settle` final frame aligned to `0.88` (seamless handoff)
- Static handle bars grown from `20×2px → 32×3px` (both axes)

**Topbar secondary entry points (`src/ui/Topbar.ts` + `src/main.ts`)**
- Added `infoBtn` + `timelineBtn` pill-shaped glass buttons in the topbar right group
- Each button shows a recognisable SVG icon + short text label ("Info" / "Zeitleiste")
- On compact phone layouts the text label is hidden (icon-only to save space)
- Buttons hidden in always-visible chrome mode (panels are already pinned open)
- Buttons are aria-labelled and keyboard-focusable
- Wired in `main.ts`: `topbar.onInfoClick → chromeVisibility.forceReveal('info-panel')` and `topbar.onTimelineClick → chromeVisibility.forceReveal('timeline')`

**Forced-colors support**
- `.topbar__chrome-btn` added to the `forced-colors: active` block alongside existing buttons

### Files

- `src/styles/main.scss` — token updates, `.topbar__chrome-btn` style
- `src/ui/Topbar.ts` — `infoBtn`, `timelineBtn`, `onInfoClick`, `onTimelineClick`
- `src/main.ts` — wires topbar buttons to `chromeVisibility.forceReveal`
- `CHANGELOG.md` — this entry

### Validation

- `npm run lint` ✅, `npm run build` ✅



## v0.65 — Visual affordance prominence + polish (2026-06-04, **shipped**)

### Status

**Shipped.** Implemented in runtime CSS and validated (`npm run lint` + `npm run build` pass).

### Research-informed intent (Apple-style)

- Keep content first, controls second: cues stay small and edge-bound.
- Improve discoverability via clearer hierarchy, not noisy UI.
- Use subtle material/light cues (frosted + soft glow) and gentle motion.
- Respect reduced-motion and forced-colors paths already in place.

### Changes

- Raised affordance visibility tokens:
  - `--chrome-peek-bg` `0.42 → 0.52`
  - `--chrome-peek-width-v` / `--chrome-peek-height-h` `6px → 7px`
  - `--chrome-affordance-color` `0.72 → 0.84`
  - `--chrome-affordance-size` `14px → 16px`
  - `--chrome-affordance-weight` `2.4px → 2.8px`
- Increased idle pulse floor in `peek-pulse` (`0.74 → 0.82`) and aligned `peek-settle` final frame to `0.82`.
- Added subtle glass treatment to peek strips (`linear-gradient` + `backdrop-filter: blur(10px) saturate(125%)`) for a more premium, Apple-like material feel.
- Strengthened dual-contrast shadows and added soft cool glow accents on strips, chevrons, and static handles.
- Increased static-handle geometry (`18×1.5 → 20×2` and `1.5×18 → 2×20`) for clearer non-animated signifiers.

### Files

- `src/styles/main.scss` — v0.65 affordance prominence/polish pass.
- `README.md`, `CHANGELOG.md`, `FINDINGS.md`, `plan.md`, `ARCHITECTURE_MAP.md`, `docs/HANDOFF.md` — v0.65 documentation sync.

### Validation

- Baseline before edits: `npm install`, `npm run lint`, `npm run build` ✅.
- After edits: `npm run lint`, `npm run build` ✅.

## v0.64 — Visual affordance hardening (2026-06-04, **shipped**)

### Status

**Shipped.** Implemented in runtime code and validated (`npm run lint` + `npm run build` pass; browser DOM/style smoke confirms clean-mode affordances are mounted, visible, animated, and correctly laid out).

### Root cause analysis

The affordance elements were **not missing**: `ChromeVisibilityManager.createPeekElements()` created `.timeline-peek-hit`, `.info-panel-peek-hit`, `.timeline-peek`, `.info-panel-peek`, `.timeline-chevron`, and `.info-panel-chevron`. They were **active** in clean mode and intentionally hidden only in visible/pinned chrome mode. The failure was visual/CSS:

1. The pulse animated whole-element `opacity` (`0.15 → 0.40`) while the backgrounds/borders were already low-alpha RGBA tokens (`0.22` strip, `0.42` chevron). At the trough the actual effective alpha was roughly `0.22 × 0.15 = 0.033` for strips and `0.42 × 0.15 = 0.063` for chevrons — effectively invisible.
2. The bottom timeline hit area used default row flex. Because `.timeline-peek` was `width: 100%`, the chevron was pushed beside/squeezed by the strip instead of reading as a centered cue above the bottom edge.
3. The post-hint settle selector `.affordance-settling .timeline-peek` and reduced-motion overrides had lower specificity than `:root[data-chrome-mode='clean'] .timeline-peek`, so the intended settle/reduced-motion states could be defeated by the clean-mode pulse rule.

### Changes

- Raised effective visual floors by increasing RGBA tokens and changing `peek-pulse` to `0.74 → 1` (small lift instead of fade-out).
- Increased strip thickness/length and chevron size/stroke for retina-safe visibility.
- Fixed bottom affordance layout with `column-reverse`, centered alignment, and a visible gap between chevron and strip.
- Strengthened static handle bars and dual-contrast shadows so a non-animated marker survives every pulse frame and bright/cream artwork edges.
- Changed settle selector to `:root[data-chrome-mode='clean'] #app.affordance-settling ...`, qualified reduced-motion animation overrides with clean-mode specificity, and aligned `peek-settle` with the new pulse floor (`1 → 0.74`).
- Added `peek-affordances-created` diagnostics logging when the visual affordance DOM is mounted.

### Files

- `src/styles/main.scss` — v0.64 visibility token/floor/layout/specificity fixes.
- `src/ui/ChromeVisibilityManager.ts` — diagnostics log for mounted visual affordances.
- `README.md`, `CHANGELOG.md`, `FINDINGS.md`, `plan.md`, `ARCHITECTURE_MAP.md`, `docs/HANDOFF.md` — documentation sync.

### Validation

- Baseline before edits: `npm install`, `npm run lint`, `npm run build` ✅.
- After code edits: `npm run lint`, `npm run build` ✅.
- Browser smoke: clean-mode affordance DOM exists; bottom/left cues have `display:flex`, `animation: peek-pulse`, visible opacity floor, and corrected bottom layout.

## v0.63 — Hidden affordance salience + transparency balance (2026-06-04, **shipped**)

### Status

**Shipped.** Implemented in runtime code and validated (`npm run lint` + `npm run build` pass).

### Summary

v0.63 makes the hidden-control affordances reliably discoverable on any artwork — including the bright/cream painting edges where the white-only cues previously vanished — while keeping the chrome footprint minimal so the painting stays the focal point.

### Changes

- **P-01 — Perceptibility floor raised.** `--chrome-peek-bg` 0.16 → 0.22, `--chrome-affordance-color` 0.30 → 0.42, `--chrome-affordance-size` 10 → 11px, `--chrome-affordance-weight` 1.5 → 1.8px. The `peek-pulse` keyframe floor 0.12 → 0.15 and peak 0.32 → 0.40 (NN/g ≥0.20 peripheral-detection threshold).
- **P-02 — Decoupled static handle bars + dual-contrast.** New always-visible static micro-handle bars rendered as `::after` on the non-rotated, non-animated `.timeline-peek-hit` / `.info-panel-peek-hit` containers, so at least one marker is perceptible even at the animation trough. Peek strips gain a layered dual-contrast `box-shadow` (dark + light hairline) and chevrons gain a `drop-shadow` halo for visibility on both light and dark edges.
- **P-03 — Post-hint "settle" phase.** After the nav onboarding hint completes, `ChromeVisibilityManager.triggerAffordanceSettle()` adds an `affordance-settling` class to the app root that swaps peek strips/chevrons onto a one-shot `peek-settle` animation (0.55 → 0.15, `forwards`), guiding the eye to the persistent cues, then handing back to `peek-pulse` seamlessly. Reduced-motion safe (no-op) and cleaned up on `dispose()`.
- **P-04 — Contrast resilience.** Reduced-motion static floors raised (peek 0.18 → 0.22, chevrons 0.25 → 0.30) with `drop-shadow` retained; forced-colors block resets `box-shadow`/`filter` and renders the new static bars as `ButtonText`.
- **E-1 (folded backlog #4) — Keyboard-help discoverability note.** Added a German note to the `Tastaturkürzel` dialog explaining that moving the mouse to a screen edge reveals the hidden chrome, closing the discoverability gap for keyboard/AT users.

### Files

- `src/styles/main.scss` — tokens, `peek-pulse`/`peek-settle` keyframes, static handle bars, dual-contrast shadows, settle class, reduced-motion + forced-colors hardening, keyboard-help hint style.
- `src/ui/ChromeVisibilityManager.ts` — `settleTimer` field, `triggerAffordanceSettle()`, `onHintFinished` wiring, `dispose()` cleanup.
- `src/ui/KeyboardHelp.ts` — discoverability hint paragraph.

### Validation

- `npm run lint` — pass (zero new warnings).
- `npm run build` — pass (zero TypeScript errors).

### As-built notes

- Static bars were attached to the peek-hit containers (not the chevron `::after` as originally sketched) because the chevrons are rotated 45° and carry the pulse animation, which would have rotated and re-animated the "static" cue.
- Dual-contrast uses a layered dark+light shadow per the 2026-06-04 research refresh (more robust on mid-tone edges than a single dark line).

### Deferred beyond v0.64

Session-aware adaptive cue intensity, artwork-edge luminance sampling, `@property` settle decay, touch-first wider reveal envelope, and diagnostics reveal-history export remain backlog after the v0.64 emergency visibility hardening. See `plan.md § v0.64` for the shipped fix and its v0.65 backlog.


## v0.62 — Hidden affordance signifiers + nav-arrow post-pulse hide behavior (2026-06-04, **shipped**)

### Status

**Shipped.** Implemented in runtime code and validated (`npm run lint` + `npm run build` pass).

### Summary

v0.62 completes the discoverability and progressive-disclosure follow-up. Nav arrows now participate in the same auto-hide lifecycle as the timeline and info panel, with a clean hint-then-hide onboarding flow. Micro-chevron affordances are added at both peek zones to give users an explicit directional cue that hidden UI surfaces exist and can be revealed.

### Changes

- **P-01 — Micro-affordance chevrons (CSS + DOM):**
  - Added `--chrome-affordance-color`, `--chrome-affordance-size`, `--chrome-affordance-weight` tokens.
  - `ChromeVisibilityManager.createPeekElements()` now appends `.timeline-chevron` (∧ upward) and `.info-panel-chevron` (› rightward) decorative elements inside each peek hit area.
  - Chevrons breathe with the existing `peek-pulse` animation in clean mode; static opacity 0.25 under `prefers-reduced-motion`; `ButtonText` border color under `forced-colors`.
  - Hidden in visible mode (no need for affordance when chrome is always shown).

- **P-02 — Nav controls as third managed chrome surface:**
  - `ChromeVisibilityManager`: added `'nav-controls'` to `PanelId`, `'hint' | 'keyboard'` to `RevealReason`, `NAV_TRIGGER_BAND_PX: 220` and `NAV_HIDE_DELAY_MS: 2000` to `CHROME_CONFIG`.
  - New public method `registerNavControls(navEl, navControls)` registers nav as a third managed panel with bottom-proximity, keyboard-focus, ArrowLeft/ArrowRight reveal channels.
  - `onPointerMove` extended to check nav zone with the extended bottom band.
  - `onKeyDown` reveals nav on ArrowLeft/ArrowRight and schedules hide after `NAV_HIDE_DELAY_MS`.
  - `onViewportLeave` now iterates `panels.keys()` (auto-includes nav).
  - `updateZone` accepts optional `hideDelayMs` for per-panel hide timing.
  - CSS: `[data-chrome-mode='clean'] .nav-controls { opacity: 0; pointer-events: none; transform: translateX(-50%) translateY(var(--chrome-nav-hide-offset)); }` and `.nav-controls.is-revealed { opacity: 1; ... }` with reveal/hide transitions.
  - Short-height landscape override keeps nav fully visible (it is the only navigation surface in that context).

- **P-03 — Nav hint lifecycle: hint → reveal → ring-pulse → re-hide:**
  - `NavigationControls`: added `onHintStart()` + `onHintFinished()` callback registration, `hintAnimationTimer` (fires at 3 × 1.6 s + 300 ms buffer to auto-dismiss hint and trigger re-hide), `HINT_ANIM_DURATION_MS` constant, `setHiddenMode()` API.
  - `dismissHint()` now clears `hintAnimationTimer` and immediately calls `onHintFinishedCallback`.
  - `dispose()` cleans up `hintAnimationTimer`.
  - Flow: nav starts hidden → 5 s idle → `onHintStart` fires (ChromeVis reveals nav) → ring-pulse animation × 3 → `onHintFinished` fires (ChromeVis schedules re-hide after 2 s) → nav returns to hidden idle.

- **P-04 — Accessibility + resilience hardening:**
  - `shouldHide()` guard is unchanged (checks `!pointerInZone && !pointerInPanel && !focusActive`); nav inherits this focus-containment protection.
  - Keyboard reachability: nav reveals before/during keyboard focus (`focusin` → `reveal('nav-controls', 'focus')`).
  - `aria-live` artwork announcement path from v0.61 unchanged.
  - Reduced-motion: `.nav-controls` transition-duration collapsed to 0.001ms; chevrons static; nav-ring-pulse suppressed (already was).
  - Forced-colors: peek strips and chevrons painted with `ButtonText`.

- **P-05 — Diagnostics events:**
  - `nav-hint-start`, `nav-hint-dismiss`, `nav-keyboard-reveal`, `nav-auto-hide` diagnostic events added via `this.diag.debug(...)` in `ChromeVisibilityManager`.
  - All reveal/hide paths already emit `reveal`/`hide` debug events with `panelId` and `reason` payload.

- **`src/main.ts`**: Added `chromeVisibility.registerNavControls(chromeRefs.navControls!, navControls)` immediately after `chromeVisibility.init()`.

### Online research enhancements applied

- **Hint-then-hide pattern validated** (NNGroup, Google Photos, Apple Photos): users in immersive gallery contexts prefer minimal chrome with discoverable triggers; one-shot animation + hide is the recommended onboarding pattern.
- **Chevron affordances recommended** (NNGroup progressive disclosure): persistent directional cues outperform pulse-only strips for first-time discoverability of hidden panels.
- **Micro-affordance opacity tuned** at 0.30 default with `peek-pulse` breathing — below the distraction threshold but above the "invisible" threshold for peripheral vision.

### Validation

- `npm run lint` — pass
- `npm run build` — pass
- Manual smoke matrix: mouse proximity, keyboard ArrowLeft/ArrowRight, Tab focus into nav, onboarding hint flow, always-show override, reduced-motion flag, short-height landscape.

## v0.61 — Discoverability + navigation-arrow cue follow-up (2026-06-04, **shipped**)

### Status

Shipped in runtime code and validated.

### Summary

Implemented the full v0.61 follow-up after the v0.60 clean-chrome rollout:

- **P-01 — Strengthen peek strips:** Increased strip thickness (`3px → 4px`) and pulse amplitude (`0.10/0.26 → 0.12/0.32`) for clearer discoverability.
- **P-02 — Nav arrow idle-hint system:** Added one-shot `nav-ring-pulse` onboarding hint with 5s idle delay and persistent dismissal (`localStorage` key `freyraum-nav-hint-seen`), including dismissal on click, keyboard arrows, hover, or focus.
- **P-03 — Remove forced info-panel reveal on navigation:** Removed `chromeVisibility.forceReveal('info-panel')` from `handleNavigate`, so descriptions stay hidden until explicit reveal intent.
- **P-04 — Screen-reader artwork announcement:** Added a dedicated `#freyraum-artwork-status` `aria-live="polite"` announcer updated on every navigation with a double-rAF mutation pattern.

### Documentation updates

- `plan.md`: v0.61 status promoted to shipped with implementation closeout summary.
- `FINDINGS.md`: v0.61 section promoted to shipped and extended with as-built verification notes.
- `README.md`: top status banner updated to reflect v0.61 as current shipped state.

### Validation

- `npm run lint` — pass
- `npm run build` — pass

## v0.60 — Clean Chrome: Auto-Hide Timeline & Info Panel (2026-06-04, **shipped**)

### Status

**Shipped.** Design research verified against live sources; plan finalized after correcting code-snippet/API mismatches against the actual codebase; implemented, runtime-verified in a browser, and `npm run lint` + `npm run build` pass.

### Summary

v0.60 introduces progressive-disclosure chrome: the timeline (bottom strip) and the painting info panel (left side) are hidden by default, revealing smoothly when the user moves the pointer near the respective screen edge or gives them keyboard focus. A subtle peek strip at each edge signals discoverability. A new "Bedienleiste immer einblenden" preference toggle in the settings panel restores the previous always-visible behaviour for users who prefer it.

### Changes

- **New:** `src/ui/ChromeVisibilityManager.ts` — proximity detection, dwell timers (`HIDE_DELAY_MS` 2.5s), focus tracking, touch tap fallback with iOS back-swipe dead zone, viewport-leave handling, Escape dismiss, `aria-live` screen-reader region, decorative peek strips, `forceReveal()` on navigation, full `dispose()`.
- **Extend:** `src/utils/preferences.ts` — add `alwaysShowChrome` preference (persisted); mirror `data-chrome-mode="clean|visible"` to `<html>` from `applyToDocument()` (set during construction, so there is no flash of visible chrome before JS init).
- **Extend:** `src/styles/main.scss` — clean-chrome design tokens; `[data-chrome-mode='clean']` auto-hide rules for `.timeline` / `.info-panel` with asymmetric reveal/hide easing; `.is-revealed` overrides; `.timeline-peek` / `.info-panel-peek` strips + 44px touch hit areas; `peek-pulse` keyframe; `[data-hover='false']` coarse-pointer rules; reduced-motion, forced-colors, and short-height-landscape guards; navigation `.is-transitioning` fade-compat rule.
- **Extend:** `src/ui/PreferencesPanel.ts` — add "Bedienleiste immer einblenden" toggle (after the contrast toggle), with in-place patch support.
- **Minor extend:** `src/main.ts` — init `ChromeVisibilityManager` after chrome refs resolve; `forceReveal('info-panel')` on navigation; `dispose()` in cleanup.

### Plan finalization corrections (verified against the real codebase)

- `preferences.ts` uses the existing private `emit()` + module-level `diagnostics` (not the plan's `this.diag`/`this.persist()`/`this.notify()`); `data-chrome-mode` is mirrored in `applyToDocument()`.
- `ScopedDiagnostics` methods take `(event, message, data?)` — three arguments; all manager log calls supply a message string.
- `PreferencesPanel` is build-once + `patchPanel()`; the toggle was added to that pattern (the plan's `createRow()` helper does not exist).
- `.sr-only` already exists; safe-area is already absorbed by the `--safe-*` tokens on the base `.timeline` / `.info-panel` rules, so the plan's duplicate `env()` block was intentionally omitted to avoid conflicts.
- `app.html` already includes `viewport-fit=cover` (verify-only).

---

## v0.59 — Hover-state float fix + keyboard-help contrast (2026-05-23, **shipped**)

### Status

Shipped. Two reported UI issues fixed; WCAG 2.2 AA compliance restored.

### Fixed

- **High:** `topbar__help-btn` no longer floats/pops above the topbar row on hover.  
  Root cause: `transform: scale(1.08)` applied directly to the element caused it to lift and visually detach. Fix: removed the scale transform from hover; background brightening (`--glass-bg-strong`) + shadow elevation (`--shadow-medium`) now signal interactivity without any layout disruption. Active/press state retains `scale(0.94)` for tactile feedback.
- **Critical:** Keyboard-help control info window is now legible (dark text area, not white-on-white).  
  Root cause: `keyboard-help__panel` used `background: var(--glass-bg)` which resolves to `rgba(255,255,255,0.76)` (light frosted), but all text was hard-coded white → ~1.05:1 contrast (WCAG failure). Fix: panel now always uses `rgba(19,25,29,0.96)` — an explicit dark surface that never inherits the light token. Contrast: ≥14.7:1 for title (WCAG AAA), ≥11:1 for body text (WCAG AAA), both far exceeding the 4.5:1 AA minimum.

### Design principles applied (2026 best practices)

- **WCAG 2.2 SC 1.4.3** — text contrast ≥4.5:1 (AA). Fixed dialog achieves AAA.
- **WCAG 2.2 SC 1.4.11** — non-text contrast ≥3:1. Hover state changes remain clearly distinguishable.
- **Material Design 3 / Apple HIG 2025 consensus** — hover = background + shadow; active/press = scale-down only. No scale-up on hover in fixed headers.
- **Layered-surface pattern** — light UI (`--glass-bg`) for ambient surfaces; explicit dark surface for modal overlays. White text belongs on dark backgrounds, never light.

### Changed

- `src/styles/main.scss § .topbar__help-btn`: removed `transform: scale(1.08)` and `transform` from `transition`; hover now uses background+shadow only. Updated section header to v0.59.
- `src/styles/main.scss § .keyboard-help__panel`: replaced `background: var(--glass-bg, rgba(18 18 18 / 0.92))` with `background: rgba(19, 25, 29, 0.96)`. Bumped text opacities to 0.95/0.82; `__key` gets explicit `color` and stronger border; `__close` gets explicit colour with hover state.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.58 — Topbar UI Uniformity & Premium 2026 Polish (2026-05-23, **shipped**)

### Status

Shipped. All three reported issues fixed; premium 2026 enhancements applied.

### Fixed

- **Critical:** "?" help button now fully clickable — `pointer-events: auto` applied to interactive groups.
- **Medium:** Badge repositioned adjacent to brand (left group) instead of floating in center void.
- **Low:** Help button restyled as standalone 44×44px glass button (no longer uses oversized 72px `.nav-btn`).

### Added

- `src/ui/Topbar.ts`: Restructured into `.topbar__left` (brand + badge) and `.topbar__right` (help button) groups with proper pointer-events.
- SVG question-mark-circle icon replaces text `?` for better visual clarity and scalability.
- Accessible tooltip (`role="tooltip"`, `aria-describedby`) on help button — visible on hover and focus.
- Topbar entrance animation (fade-in + slide-down) with staggered badge reveal for premium feel.
- `prefers-reduced-motion` support — all topbar animations and transitions disabled for users who prefer reduced motion.
- Micro-interactions: scale hover (1.08), active press (0.94), border-color elevation, box-shadow progression.
- Focus-visible ring using `--focus-ring` variable for consistent accessibility.

### Design Principles (2026 Premium UI)

- WCAG 2.2 AA: 44×44px touch targets, 4.5:1 contrast, focus-visible ring on all interactive elements.
- Glassmorphism with `backdrop-filter` + graceful degradation via `@supports`.
- Clear visual hierarchy: Brand (left) → Badge (left, adjacent) → Utility actions (right).
- `prefers-reduced-motion` respected for all animations.
- Future-proof structure: `.topbar__right` group ready for additional utility icons (settings, notifications, etc.).
- Forced-colors / Windows High Contrast Mode support preserved.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.57 — v0.56-B follow-ups: keyboard shortcuts, focus/contrast, font optimization (2026-05-23, **shipped**)

### Status

Shipped. Runtime code updated; lint and build pass.

### Added

- `src/ui/KeyboardHelp.ts` (new): ARIA `role="dialog"` keyboard shortcuts overlay with focus-trap, `Escape` to close, backdrop click to close, and `opener` focus-restore on close.
- `src/ui/Topbar.ts`: `?` button (`topbar__help-btn`) in the topbar; exposes `helpBtn` and `onHelpClick` callback for wiring.
- `src/interaction/KeyboardNav.ts`: accepts optional `KeyboardHelp` reference; `?` key opens the help overlay.
- `src/styles/main.scss § v0.57`: `.keyboard-help` component styles and `@media (forced-colors: active)` block restoring button borders and focus ring in Windows High Contrast Mode.
- `src/main.ts`: `KeyboardHelp` import, creation, topbar wiring (`onHelpClick`), and `dispose()` call in cleanup.

### Changed

- `app.html`: replaced blocking `<link rel="stylesheet">` for Google Fonts with non-blocking `onload` pattern (+ `<noscript>` fallback). Render-blocking Google Fonts request eliminated.

### Deferred (requires live browser tooling)

- B-3 (Lighthouse / Web Vitals): requires `npm run build && npm run preview` + Chrome DevTools Lighthouse. Documented in `FINDINGS.md § v0.57`.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

## v0.56.1 — merge-ready markdown synchronization (2026-05-22, **shipped**)

### Status

Shipped. Documentation-only pass; runtime code unchanged.

### Changed

- Refreshed markdown audit stamp wording to align with the current v0.56-A shipped status and v0.56-B open follow-ups.
- Added explicit merge-readiness snapshots/checklists in `plan.md`, `README.md`, and `FINDINGS.md`.
- Clarified that repository state is ready for merge/commit of documentation updates.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

## v0.56 — UX/readability/accessibility audit pass A (2026-05-22, **shipped**)

### Status

Shipped. Runtime shell/accessibility code updated; lint and build pass.

### Added

- `src/main.ts`: canvas assistive description via `aria-describedby` + screen-reader-only help text.
- `src/styles/main.scss`: reusable `.sr-only` utility class.
- `app.html`: `noscript` fallback notice for non-JS environments.
- `index.html`: redirect status message and user-controlled auto-redirect cancel button.

### Changed

- `src/ui/NavigationControls.ts`: localized nav labels/titles to German for language consistency and clearer screen-reader output.
- `src/ui/Topbar.ts`: semantic heading for brand and German badge copy.
- `index.html`: removed forced `meta refresh` redirect in favor of cancellable JavaScript redirect flow.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

## v0.53 — flat-normal brushed metal redesign (2026-05-22, **shipped**)

### Status

Shipped. Runtime code updated; lint and build pass.

### Root cause of visible lines (v0.51–v0.52)

Any FBM with a Y-component gradient (`barUV.y * N` where N > ~2) creates
visible ridges in the normal map that the eye sees as parallel lines.
Raising the frequency (v0.52) made this **worse** — more, finer lines.
The approach was physically wrong: real brushed metal is optically flat.
The "brushed" appearance comes from anisotropic specular reflection
spreading highlights along the brush direction, not from surface bumps.

### Changed

- `src/materials/CanvasMaterial.ts`:
  - `frmBrushedFbm`: height now varies ONLY along bar (X direction).
    Y frequency kept below 6 so gradient is negligible. No across ridges.
  - Added `frmRoughnessGrain`: high X frequency (28–115 cycles/unit),
    very low Y frequency. Creates fine sparkle/shimmer along brush direction
    without any visible lines.
  - `frmScratchLayer` replaced by `frmScratchLine`: scratches now run
    ALONG the bar (X segments), placed at random Y positions. Sparse (1.8%).
  - `frmBrushedNormal`: gradient multiplier 0.8 → 0.08 (nearly flat surface).
    Epsilon 0.001 → 0.010 (correct scale for low-frequency height function).
  - Roughness fragment uses `frmRoughnessGrain` ± 0.030, not FBM bumps.
  - Version bumped to v0.53.
- `src/config/quality.ts`:
  - high: `frameAnisotropy` 0.45 → 0.85, `frameRoughness` 0.44 → 0.28.
  - balanced: `frameAnisotropy` 0.30 → 0.60, `frameRoughness` 0.53 → 0.38.
  - battery: unchanged (anisotropy=0, roughness=0.60).

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.


  45° miter cut to assign vertices cleanly to one bar.
- `src/materials/CanvasMaterial.ts`: shader injection rewired to consume
  `vFrameUV` varying instead of object-space position. Removed
  `frmBarBrushCoords()`, `uFrameOuterHalf`, `uFrameInnerHalf` uniforms.
  `refreshFrameGeometryUniforms()` is now a no-op (geometry rebuild handles
  aspect changes). Cache key updated to `frame-v0.52-*`.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

## v0.50 — corner blend smoothing (2026-05-22, superseded by v0.52)

### Changed

- Smoothstep corner blending and normalScale 0.22 — superseded.

## v0.49 — simpler frame edges + finer metal detail (2026-05-22, **shipped**)

### Status

Shipped. Runtime code updated; lint and build pass.

### Added

- `src/gallery/ArtworkMesh.ts`: detailed debug log for frame geometry replacement (bevel params + artwork dimensions).
- `src/materials/CanvasMaterial.ts`: extended shader compile logging for fine-detail retune diagnostics.

### Changed

- `src/gallery/ArtworkMesh.ts`: simplified beveled frame edge profile (`bevelThickness`/`bevelSize` 0.012 and `bevelSegments` 1) for cleaner, less busy corners.
- `src/materials/CanvasMaterial.ts`: v0.49 brushed-metal shader retune toward finer micro-detail (denser but thinner scratches, lower normal amplitude, calmer roughness modulation, smaller epsilon for sharper micro relief, cache key `frame-v0.49-*`).

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

## v0.48 — frame UV mapping correction + metal continuity (2026-05-22, **shipped**)

### Status

Shipped. Runtime code updated; lint and build pass.

### Added

- `src/materials/CanvasMaterial.ts`: frame shader uniforms `uFrameOuterHalf` and `uFrameInnerHalf` for explicit rectangular-ring bounds.
- `src/gallery/ArtworkMesh.ts`: `getFrameBounds(...)` helper and runtime refresh hook for frame-geometry bounds after aspect updates.

### Changed

- `src/materials/CanvasMaterial.ts`: replaced origin-dominance bar coordinate mapping with edge-aware bar-local coordinates (`frmBarBrushCoords`) to avoid stretched/wrong-looking frame UV behavior across different artwork aspects.
- `src/materials/CanvasMaterial.ts`: frame program cache key bumped to `frame-v0.48-*`.
- `src/gallery/ArtworkMesh.ts`: `createFrameMaterial(...)` now receives frame bounds and updates shader bounds when frame geometry is rebuilt.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

## v0.47 — modern gallery metal frame realism retune (2026-05-22, **shipped**)

### Status

Shipped. Runtime code updated; lint and build pass.

### Added

- Bar-aware brush coordinate remap (`frmBarBrushCoords`) so procedural grain/scratches follow frame bar direction instead of global scene axes.
- Softer directional scratch layering tuned for satin gallery metal (lower occupancy/intensity and lower normal contribution).

### Changed

- `src/materials/CanvasMaterial.ts`: v0.47 shader/material retune (reduced warp strength, lower normal scale, darker silver base color, tighter roughness shaping, cache key `frame-v0.47-*`).
- `src/config/quality.ts`: v0.47 preset retune (`high roughness/anisotropy 0.44/0.45`, `balanced 0.53/0.30`, `battery roughness 0.60`) for an elegant, less harsh highlight response.
- Markdown status banners refreshed to v0.47 shipped.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

## v0.46 — realistic metal frame zebra recovery (2026-05-22, **shipped**)

### Status

Shipped. Runtime code updated; lint and build pass.

### Added

- Derivative-aware scratch density fade (`fw * density`) to suppress unstable high-frequency bands at distance.
- Directional segmented scratch primitives replacing long uninterrupted stripe rows.
- Lower macro-contrast procedural normal/roughness coupling for satin continuity in highlight zones.

### Changed

- `src/materials/CanvasMaterial.ts`: v0.46 procedural retune (reduced warp amplitude, rebalanced octave bands, sparse micro-groove scratches, lower normal strength, tighter roughness variance, cache key `frame-v0.46-*`).
- `src/config/quality.ts`: v0.46 satin retune (`high roughness 0.38 anisotropy 0.60`, `balanced roughness 0.47 anisotropy 0.50`, `battery roughness 0.54`).
- Updated top markdown status sections to v0.46 shipped state.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

## v0.45 — Zero-Visible-Tiling High-Resolution Brushed-Metal Frame (2026-05-22, **shipped**)

### Status

Shipped. Runtime code updated; lint and build pass.

### Problem (remaining after v0.44)

The v0.44 GLSL frame path still showed:
1. **Visible hash-cell grid** on long bars — `frmTileOffset` used 0.67-unit cells, ~9 visible boundaries on side bars.
2. **Large-scale periodicity** — `frmFbm` used near-exact 2x octave scaling; Y-axis exact-integer multiples could produce faint large-scale structure.
3. **Blobs instead of scratches** — `frmRidge` produced wide blobs; no fine individual scratch primitives.
4. **Eps too coarse** — finite-difference epsilon 0.02 = 10% of frame bar width, washing out close-zoom detail.
5. **Too shiny** — `frameRoughness: 0.28` is in polished-aluminium range, not satin/brushed.

### Changes shipped

| Slice | File | Change |
|-------|------|--------|
| V45-01 | `src/materials/CanvasMaterial.ts` | `onBeforeCompile` now injects `vFrameLocalPos` object-space position varying in vertex shader; all GLSL uses `vFrameLocalPos.xy` instead of `vUv`. |
| V45-02 | `src/materials/CanvasMaterial.ts` | `FRAME_FRAG_FUNCTIONS`: replaced `frmFbm + frmRidge + frmTileOffset` with `frmBrushedFbm` — domain-warped aperiodic FBM (Quilez technique) with 4 irrational-ratio octaves. Eliminates hash-cell grid and near-integer octave alignment. |
| V45-03 | `src/materials/CanvasMaterial.ts` | Added `frmScratchRow` + `frmScratchLayer`: three density bands (fine 110/unit, medium 32/unit, deep 7/unit) with `fwidth`-based AA. Scratches are sub-pixel-stable. |
| V45-04 | `src/materials/CanvasMaterial.ts` | `frmBrushedNormal` rewritten: layered FBM + scratch gradients, eps = 0.004 (was 0.02) for close-zoom sharpness. |
| V45-05 | `src/config/quality.ts` | high: 0.28→0.35, clearcoat 0.18→0.12, anisotropy 0.70→0.65; balanced: 0.38→0.44, clearcoat 0.14→0.10; battery: 0.48→0.52 (satin-brushed Al range). |
| V45-06 | `src/materials/CanvasMaterial.ts` | `customProgramCacheKey` bumped to `frame-v0.45-${seed}`. Roughness injection uses `vFrameLocalPos.xy`. |

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.
- Browser console: `[CanvasMaterial] frame-shader-compiled { version: 'v0.45', domainWarp: true, scratchLayer: true, eps: 0.004, ... }` — no WebGL errors.


## v0.44 — GLSL shader-injection brushed-metal (2026-05-22, **shipped**)

### Status

Shipped. Runtime code updated; lint and build pass.

### Problem (remaining after v0.43)

The frame still showed visible horizontal banding (6–8 regular light/dark stripes across the bottom/side bars) and lacked micro-detail (no individual scratches, no fine-grain surface texture). Both issues trace to the `DataTexture + RepeatWrapping` approach: any non-seamlessly-tiling DataTexture produces a visible seam every time the texture tile repeats, and the v0.43 value-noise texture is not seamlessly periodic.

### Root cause (see FINDINGS.md § v0.44)

`THREE.ExtrudeGeometry` uses `WorldUVGenerator` → raw world-Y coordinate as UV.y. The frame ring spans ~6.1 world units in Y. With `texture.repeat.set(1,1)`, the DataTexture repeats every 1 world unit → ~6 tiles vertically → 6 seams = 6 visible horizontal bands.

### Changes shipped

| Slice | File | Change |
|-------|------|--------|
| S-01 | `src/materials/CanvasMaterial.ts` | Added `FRAME_FRAG_FUNCTIONS` GLSL constant: `frmHash`, `frmNoise`, `frmFbm` (4-octave), `frmRidge`, `frmTileOffset`, `frmBrushedNormal`. Added `FRAME_FRAG_NORMAL_REPLACE` GLSL constant. Added `uniform float uFrameSeed; uniform float uBaseRoughness;` declarations. |
| S-02 | `src/materials/CanvasMaterial.ts` | `createFrameMaterial()` now sets `onBeforeCompile` that prepends GLSL, replaces `#include <normal_fragment_maps>` with procedural brushed normal, and replaces `#include <roughnessmap_fragment>` with FBM-driven roughness. Sets `customProgramCacheKey` per artwork seed. |
| S-03 | `src/materials/CanvasMaterial.ts` | Removed `makeFrameNormalTexture`, `makeFrameRoughnessTexture`, `latticeHash`, `valueNoise2d`, `scratchHeight` private methods. Removed `frameNormalTexture`, `frameRoughnessTexture` fields. Removed `roughnessMap` from material constructor. |
| S-04 | `src/materials/CanvasMaterial.ts` | Replaced `refreshFrameTextures()` with `refreshFrameUniforms(material, seed)` — updates only the `uFrameSeed` float uniform; no texture disposal or re-upload. |
| S-05 | `src/gallery/ArtworkMesh.ts` | `updateFrameSeed()` now calls `refreshFrameUniforms` instead of `refreshFrameTextures`. Removed unused `currentPreset` field. |
| S-06 | `src/gallery/ArtworkMesh.ts` | `makeFrameGeometry()` now calls `geometry.computeTangents()` so `USE_TANGENT` is defined in the compiled shader and local `tbn` matrix is available available for the GLSL injection. |

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.43 — anisotropic value-noise frame textures + mipmaps (2026-05-22, **shipped**)

### Status

Shipped in runtime code; lint/build pass.

### Fixed

- **Pixelation:** Both frame `DataTexture` objects previously used Three.js's default `NearestFilter` for min/mag filtering. At oblique camera angles nearest-neighbour sampling picks the closest texel, producing visible blocky squares. **Fixed:** `generateMipmaps = true`, `minFilter = LinearMipMapLinearFilter`, `magFilter = LinearFilter` added to both `makeFrameNormalTexture` and `makeFrameRoughnessTexture`.

- **Synthetic regular stripes:** Pure `Math.sin(x * constant)` waves produce perfectly regular, equally-spaced stripes — the frame looked synthetic. **Fixed:** replaced both generators with a 2-octave anisotropic value-noise height field (`scratchHeight`): very low X-frequency (long horizontal streaks, low Y-frequency (cross-section fine detail), seeded per artwork.

### Changed

- `src/materials/CanvasMaterial.ts` — added `latticeHash`, `valueNoise2d`, `scratchHeight` helpers.
- `src/materials/CanvasMaterial.ts` — `makeFrameNormalTexture`: replaced sine layers with finite-difference height-field from `scratchHeight`; both Nx (R) and Ny (G) channels populated; mipmaps enabled.
- `src/materials/CanvasMaterial.ts` — `makeFrameRoughnessTexture`: replaced sine layers with anisotropic value noise; mipmaps enabled.
- `src/materials/CanvasMaterial.ts` — `createFrameMaterial`: `normalScale` raised from `0.08 → 0.40`.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.42 — frame texture UV bug fix (2026-05-22, **shipped**)

### Status

Bug fix shipped in runtime code; lint/build pass.

### Fixed

- **Frame texture UV bug — ~53 dense vertical stripes eliminated.** Three compounding bugs in `CanvasMaterial.ts` caused the extreme stripe artifact visible in the screenshot:
  1. `texture.repeat.set(12, 1)` with world-space UV coordinates. `THREE.ExtrudeGeometry` uses `WorldUVGenerator` which maps raw world XY values directly as UV (not normalised 0–1). The ring shape spans ~4.4 world units in X. `repeat.set(12, 1)` therefore produced `12 × 4.4 = 52.8` texture cycles — ~53 thin bands. **Fixed:** `texture.repeat.set(1, 1)`. With world-space UVs and 1 repeat/unit the frame now shows ~4 grain cycles across its width — natural and non-repetitive.
  2. 1D-only texture generation. Both `makeFrameNormalTexture` and `makeFrameRoughnessTexture` only used `Math.sin(x * ...)` — no Y variation. Every row was identical, so the texture was a pure column-stripe pattern. **Fixed:** added a cross-grain Y term to the normal map (`Math.sin(y * 0.13 + seed * 0.61) * 0.07`) and a row-variation term to the roughness map (`Math.sin(y * 0.17 + seed * 0.47) * 0.05`).
  3. Asymmetric repeat `(12, 1)` amplified the mismatch between U and V axes. **Fixed:** symmetric `(1, 1)`.

### Changed

- `src/materials/CanvasMaterial.ts` — `makeFrameNormalTexture(seed)`: `repeat.set(12, 1)` → `repeat.set(1, 1)`; added cross-grain Y layer; reduced fine-brush amplitude 0.25→0.20, mid-drift 0.30→0.25 for headroom.
- `src/materials/CanvasMaterial.ts` — `makeFrameRoughnessTexture(seed, withMacroDrift)`: `repeat.set(12, 1)` → `repeat.set(1, 1)`; added row micro-roughness Y term; reduced fineLine amplitude 0.40→0.35.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.40 — premium metal PBR texture realism + anti-repetition (2026-05-22, **shipped**)

### Status

Runtime implementation shipped; lint/build pass.

### Added

- **Multi-scale seeded frame normal map (P-01):** `CanvasMaterial.makeFrameNormalTexture(seed)` now generates a 256×256 DataTexture with three layered sinusoidal bands (fine brushed grain, mid-frequency streak, low-frequency warp). Each band has a distinct spatial frequency visible in a normal-map debug overlay.
- **Multi-scale seeded frame roughness map (P-01):** `CanvasMaterial.makeFrameRoughnessTexture(seed, withMacroDrift)` generates a 128×128 DataTexture with a fine variation band plus an optional macro drift layer (P-03) for non-battery presets.
- **Per-artwork deterministic seed system (P-02):** `ArtworkMesh` constructor accepts `artworkIndex` (default 0); seed = `artworkIndex % 256` is passed to `CanvasMaterial.createFrameMaterial(preset, seed)` so each artwork's frame phase is distinct and stable across page loads.
- **Seed refresh on navigation (P-02):** `ArtworkMesh.updateFrameSeed(artworkIndex)` regenerates frame textures in-place (via `CanvasMaterial.refreshFrameTextures`) when navigating to a different artwork. Called from both `GalleryManager.showArtwork` and `GalleryManager.warmArtworkForGPU`.
- **Macro roughness breakup layer (P-03):** Baked into `makeFrameRoughnessTexture` for high/balanced presets. Two low-frequency sinusoidal terms produce a ±0.05 roughness swing across the frame's long axis, eliminating the periodic cadence visible during slow camera pan.
- **Quality-tier texture policy (P-05):** High/balanced use the full three-layer normal and two-layer roughness with macro drift. Battery uses seeded textures (no drift layer) to keep generation cost low.
- **Diagnostics logging (P-06):** `[CanvasMaterial] frame-material-created` and `frame-textures-refreshed` log the active preset, seed, macro-drift flag, and key PBR values. `[ArtworkMesh] artwork-frame-seed` logs the artwork index and computed seed.

### Changed

- **Preset values (P-04):** Frame PBR values tuned to a premium museum reference (see table below). Previous values were set in v0.39.
  | Preset | frameRoughness | frameAnisotropy | frameClearcoat |
  |--------|----------------|-----------------|----------------|
  | high | 0.28 (was 0.22) | 0.7 (was 0.75) | 0.18 (was 0.2) |
  | balanced | 0.38 (was 0.35) | 0.55 (was 0.5) | 0.14 (was 0.16) |
  | battery | 0.48 (was 0.5) | 0.0 | 0.0 |
- `src/materials/CanvasMaterial.ts` — replaced `getFrameNormalTexture()` / `getFrameRoughnessTexture()` with `makeFrameNormalTexture(seed)` / `makeFrameRoughnessTexture(seed, withMacroDrift)`. Added `refreshFrameTextures(material, preset, seed)` for in-place texture swap on navigation.
- `src/gallery/ArtworkMesh.ts` — constructor now accepts `artworkIndex = 0`; added `updateFrameSeed(artworkIndex)` method; `applyPreset` now stores `currentPreset` for use by the seed refresh path.
- `src/gallery/GalleryManager.ts` — `showArtwork` and `warmArtworkForGPU` now call `artworkMesh.updateFrameSeed(index)` before binding textures.
- `src/config/quality.ts` — frame roughness/anisotropy/clearcoat values updated per P-04 table.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.41 — battery preset painting invisible bug fix (2026-05-22, **shipped**)

### Status

Bug fix shipped in runtime code; lint/build pass.

### Fixed

- **Battery preset painting invisible:** On the lowest performance tier, artworks showed only the frame — the painting canvas was completely invisible. Root cause: `ArtworkMesh.makeFrameGeometry()` used a `BoxGeometry` (solid rectangle, no hole) for the battery `bevelEnabled=false` path, which fully covered and occluded the painting plane behind it. Fixed by unifying both bevel states to use `ExtrudeGeometry` with an inner `Path` hole, as the high/balanced path already did. Battery gets `bevelEnabled:false` (no chamfer) but has the correct open center.

### Changed

- `src/gallery/ArtworkMesh.ts` — `makeFrameGeometry()` refactored: removed `BoxGeometry` fast-path, unified to single `ExtrudeGeometry` + shape-with-hole path for all presets.
- Upgraded `plan.md § v0.40` from high-level docs-only plan to detailed technical coding plan with TypeScript code samples (P-01 through P-07).
- Updated `FINDINGS.md § v0.41` with complete battery bug root-cause analysis and fix diff.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.39 — frame alignment + metal detail refinement (2026-05-22, **shipped**)

### Status

Runtime implementation shipped.

### Changed

- **`src/gallery/ArtworkMesh.ts`:** Reworked frame geometry sizing to be artwork-aspect-aware at geometry build time instead of post-scale distortion.
- **`src/gallery/ArtworkMesh.ts`:** Paintings are now inset behind the frame front face to prevent the “painting sits on top of frame” look.
- **`src/materials/CanvasMaterial.ts`:** Added deterministic brushed roughness detail map and applied it as `roughnessMap` to frame material for richer metallic micro-surface response.
- **`src/materials/CanvasMaterial.ts`:** Refined frame normal microvariation generator to deterministic directional detail.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.29 — realistic metallic PBR frame (2026-05-22, **shipped**)

### Status

Runtime implementation shipped. All frame pipeline gaps M-01..M-08 are now closed in source.

### Added

- PMREM environment IBL setup in `SceneManager` with `RoomEnvironment`.
- New frame PBR preset fields in `quality.ts`: `frameRoughness`, `frameAnisotropy`, `frameClearcoat`, `frameBevelEnabled`.
- Brushed-metal frame material in `CanvasMaterial` (`metalness:1.0`, anisotropy, procedural brushed normal map).
- Beveled frame geometry path in `ArtworkMesh` plus battery fallback box geometry.

### Changed

- `main.ts` now passes renderer into `SceneManager` for PMREM generation.
- `ArtworkMesh.applyPreset()` now updates frame material and swaps frame geometry when preset bevel policy changes.
- Frame depth increased from `0.18` to `0.28`; artwork Z offset adjusted to `0.145`.
- Markdown status updated to reflect shipped v0.29 runtime implementation.

### Key implementation outcomes

- Metallic frame reflections now read through stable room IBL instead of black specular.
- Frame finish now reads as brushed metal, not matte plaster.
- High/balanced presets now render beveled frame catch-lights; battery keeps cheaper box geometry.
- Preset switching now updates frame shading and geometry deterministically.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.38 — Disable FXAA on high/balanced to restore v0.25 image response (2026-05-22, **shipped**)

### Problem

Even after fixing EffectComposer output conversion, users still reported that only the two upper-tier presets (`high`, `balanced`) looked too dark with altered overall contrast/colors compared to v0.25. `battery` remained unaffected.

### Root cause

The regression window starts at v0.27, where FXAA was introduced and enabled only on `high` and `balanced`. `battery` keeps FXAA disabled. The user-observed split exactly matched this preset gate.

### Changed

- **`src/config/quality.ts`:** Set `fxaaEnabled` to `false` on `high` and `balanced` (already `false` on `battery`).

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.37 — Fix darkness/contrast shift on high and balanced presets (2026-05-22, **shipped**)

### Problem

Paintings appeared too dark with altered contrast and colors on the "high" and "balanced" quality presets (but NOT on "battery"). The issue was introduced in v0.27 when FXAA was added via EffectComposer. When bloom or FXAA passes are active, the final ShaderPass writes linear-space values directly to the sRGB canvas without proper gamma conversion. Battery mode was unaffected because only RenderPass is active, and `renderer.render()` handles color space conversion internally.

### Root cause

Three.js r166 requires an `OutputPass` at the end of the EffectComposer chain to apply tone mapping and linear→sRGB color space conversion. Without it, any active ShaderPass (bloom/FXAA) as the last enabled pass outputs uncorrected linear values to the display — causing darker, lower-contrast, hue-shifted rendering.

### Changed

- **`src/core/PostProcessing.ts`:** Added `OutputPass` (from `three/examples/jsm/postprocessing/OutputPass.js`) as the final pass in the EffectComposer chain. This ensures correct color space output regardless of which passes are enabled.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.36 — Raise lighting to match v0.26 brightness (2026-05-22, **shipped**)

### Problem

Paintings appeared too dark after removing ACES tone mapping. The old light values were tuned for ACES at exposure 1.45 which effectively multiplied brightness by ~1.45x. Without that boost, scenes were underlit.

### Changed

- **`src/lighting/LightProfile.ts`:** Raised museum-neutral ambient 0.8 → 1.4, keys 60/40 → 90/60. Raised gallery-soft ambient 0.6 → 1.0, key 100 → 150, accent 5 → 8. Compensates for the removed ACES exposure boost so paintings render at v0.26-equivalent brightness.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.35 — Remove ACES tone mapping (2026-05-22, **shipped**)

### Status

Shipped. Runtime code implemented and validated; lint and build pass.

### Problem

ACESFilmicToneMapping washes out textures, reduces contrast, and shifts hues. The scene does not use HDR rendering, so tone mapping is unnecessary and harmful to source artwork fidelity.

### Changed

- **`src/core/RendererManager.ts`:** Switched from `THREE.ACESFilmicToneMapping` (exposure 1.45) to `THREE.NoToneMapping` (exposure 1.0). Colours now pass through unchanged from the shader to the canvas.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.34 — Revert shaders and lighting to v0.27 state (2026-05-22, **shipped**)

### Status

Shipped. All rendering reverted to pre-v0.28 state; lint and build pass.

### Problem

Versions v0.28–v0.33 progressively broke the painting rendering: switched tone mapping away from ACESFilmic, injected an emissive albedo-fill that flattened paintings, reduced normal strength to near-zero, disabled grazing boost, and repeatedly tweaked lighting. Result: everything looked flat and too dark.

### Changed

- **`src/core/RendererManager.ts`:** Restored `THREE.ACESFilmicToneMapping` with `toneMappingExposure = 1.45` (was NoToneMapping/1.0 since v0.32).
- **`src/config/quality.ts`:** Restored `normalStrength` to 0.7/0.45/0.25 (high/balanced/battery), `detailNormalStrength` to 0.6/0.4/0.0, re-enabled `grazingBoostEnabled` on high and balanced, set `albedoFidelityFill` to 0.0 across all presets (disables the v0.30 emissive bypass).
- **`src/lighting/LightProfile.ts`:** Restored museum-neutral (ambient 0.8, keys 60/40) and gallery-soft (ambient 0.6, key 100) to values appropriate for ACESFilmic at 1.45 exposure.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.33 — Flat painting surface + frame lighting fix (2026-05-22, **shipped**)

### Status

Shipped. Runtime code implemented and validated; lint and build pass.

### Problem

1. Paintings on high/balanced still had non-uniform brightness (normal maps created contrast variation across the surface despite high emissive fill).
2. Frame looked dark/unshaded because scene lighting was too low.

### Root cause

Battery preset looked correct because it has zero normal influence → uniform light response. Higher presets had normalStrength 0.7/0.45 which caused directional-light–driven brightness variation across the painting.

### Changed

- **`src/config/quality.ts`:** Reduced `normalStrength` from 0.7/0.45 → 0.05/0.05 and `detailNormalStrength` from 0.6/0.4 → 0.03/0.03 on high/balanced. Disabled `grazingBoostEnabled` on both. Painting surface now responds uniformly to lighting (like battery) while still keeping parallax/self-shadow structures for subtle depth.
- **`src/lighting/LightProfile.ts`:** Raised museum-neutral ambient 1.2 → 2.2 and keys 25/18 → 70/50. gallery-soft ambient 1.0 → 1.6 and key 30 → 80. Frame now receives adequate illumination.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.32 — Source-faithful colour reproduction (2026-05-22, **shipped**)

### Status

Shipped. Runtime code implemented and validated; lint and build pass.

### Problem

Paintings on the site appeared much higher contrast and darker than the original source files: highlights blown out to white, purple/blue tones crushed to near-black, reds over-saturated.

### Changed

- **`src/core/RendererManager.ts`:** Switched from `NeutralToneMapping` to `NoToneMapping` (identity pass-through). Any tone-mapping curve, even the mild Khronos PBR Neutral, applies an S-curve that increases contrast and shifts colour away from the source. With the albedo-fill path keeping total luminance in [0,1], no rolloff is needed. Exposure reset to 1.0.
- **`src/config/quality.ts`:** Raised `albedoFidelityFill` from 0.38/0.34/0.28 → 0.72 across all presets. The emissive (unlit) channel now dominates, reproducing the source image faithfully while the remaining lit contribution adds only subtle dimensionality.
- **`src/lighting/LightProfile.ts`:** Dramatically reduced museum-neutral key lights (100/70 → 25/18) and ambient (2.8 → 1.2). gallery-soft key (150 → 30) and ambient (1.8 → 1.0). This prevents directional lighting from pushing colour values above 1.0 and introducing contrast.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.31 — Painting brightness & contrast correction (2026-05-22, **shipped**)

### Status

Shipped. Runtime code implemented and validated; lint and build pass.

### Changed

- **`src/config/quality.ts`:** Raised `albedoFidelityFill` from 0.20/0.18/0.14 → 0.38/0.34/0.28 across high/balanced/battery presets so more of the original source brightness passes through unlit.
- **`src/lighting/LightProfile.ts`:** Raised museum-neutral ambient from 2.2 → 2.8 and reduced key-light intensities from 130/90 → 100/70 to flatten contrast.
- **`src/core/RendererManager.ts`:** Raised tone-mapping exposure from 1.0 → 1.1 to lift overall image brightness.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.30 — Painting fidelity + smoother frame pacing (2026-05-22, **shipped**)

### Status

Shipped. Runtime code implemented and validated; lint and build pass.

### Changed

- **`src/materials/PaintingMaterial.ts` + `src/config/quality.ts`:** Adds a subtle albedo-fidelity fill so paintings keep more of the source image brightness while retaining PBR depth/varnish response.
- **`src/lighting/LightProfile.ts`:** Brightens display lighting for `gallery-soft` and `museum-neutral` so default viewing is less dark.
- **`src/config/quality.ts`:** Reduces default GPU pressure by lowering high/balanced DPR caps, bloom strength, high geometry density, and high parallax/self-shadow steps.
- **`src/utils/FrameBudgetMonitor.ts` + `src/utils/AdaptiveQualityController.ts` + `src/main.ts`:** Treats repeated severe hitch frames as a downgrade signal and logs the severe-frame count for diagnostics.
- **Preview output:** Rebuilt `customer-preview/freyraum-gallery.js`.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---

## v0.29 — Loading-screen full-render contract (2026-05-22, **shipped**)

### Status

Shipped. Runtime code implemented and validated; lint and build pass.

### Changed

- **`src/main.ts`:** Delays loading-overlay reveal until after the production RAF loop is scheduled under the opaque overlay and two full-size frames are observed.
- **`src/main.ts`:** Adds final-path all-artwork warming: every painting is bound and rendered through the real post-processing composer before entry.
- **`src/main.ts`:** Adds UI chrome prebuild for nav, timeline, info panel, settings panel, audio controls, fullscreen button, and hidden preferences-panel layout.
- **`src/timeline/Timeline.ts`:** Adds `prewarmUnderOverlay()` to instantiate all thumbnails, switch them to eager loading, decode images where supported, and premeasure timeline layout.
- **`src/lighting/LightProfile.ts`:** Changes first-visit default lighting from `gallery-soft` to `museum-neutral` for more objective, daylight-balanced artwork fidelity.
- **Diagnostics:** Adds `ui-prebuild-complete`, `all-artworks-final-path-warmed`, `pre-entry-raf-start`, `first-full-frame-rendered`, `second-full-frame-presented`, and `entry-cta-enabled`.
- **Preview output:** Rebuilt `customer-preview/freyraum-gallery.js`.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---



## v0.28 — Painting fidelity + background preloading + particle enhancement (2026-05-22, **shipped**)

### Status

Shipped. X-01..X-04 implemented and validated; lint and build pass.

### Changed

- **`src/core/RendererManager.ts` (X-01):** Switched `THREE.ACESFilmicToneMapping → THREE.NeutralToneMapping`; reduced `toneMappingExposure 1.45 → 1.0`. Restores faithful colour representation for artistically dark/high-contrast paintings — near-identity below 1.0, gentle rolloff above.
- **`src/main.ts` (X-02):** Forward-declared `animate` and started `requestAnimationFrame((now) => animate(now))` before `await loadingOverlay.reveal()`. Gallery now renders continuously behind the opaque overlay; eliminates canvas grey-flash visible during overlay fade-out. Main page and gallery are fully pre-rendered while the loading screen is visible.
- **`src/gallery/GalleryManager.ts` (X-03):** Raised `LAMBDA_NAV_POSITION 2.5 → 3.5`. Reduces 95% settle time from ~1200 ms to ~860 ms for snappier, still-organic painting navigation. Combined with X-02, RAF cold-start lag on first navigation is eliminated.
- **`src/main.ts` + `src/styles/main.scss` (X-04):** Increased loading particle count 8 → 12; reduced duration range 8–14 s → 3–6 s; added 3-waypoint per-particle random drift custom properties (`--particle-drift-x2/y2/x3/y3`); replaced `loading-float` 2-stop keyframe with `loading-wander` 4-stop wander keyframe for visibly non-regular, faster particle motion.
- **X-05 (no code change):** Confirmed existing overlay architecture (`position: fixed; background: #0d0d0e; z-index: 200`) fully blocks the canvas view. With X-02, everything is pre-rendered behind the overlay throughout loading.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

---


## v0.27 — Startup smoothness + loading/AA remediation (2026-05-22, **shipped**)

### Summary

Implementation pass completing all W-series gaps identified in the deep code audit. FXAA AA restores edge quality bypassed by EffectComposer. Bloom shaders are now pre-compiled before overlay dismiss. Enter CTA hover cold path is eliminated. Wordmark is optically centered via flex layout. Particles are visually salient with raised alphas, opacity, blur, and count.

### Changed

- **`src/config/quality.ts`** (`QualityPreset` interface + presets): added `fxaaEnabled: boolean`; `high: true`, `balanced: true`, `battery: false`.
- **`src/core/PostProcessing.ts`**: imported `ShaderPass` + `FXAAShader`; added `fxaaPass` field and `applyFXAAResolution(w,h)` helper; FXAA pass appended after bloom in constructor; `resize()` now updates FXAA resolution uniform; `applyPreset()` toggles `fxaaPass.enabled`; added `prewarmComposer(w,h)` method (shrink to 4×4 → render → restore).
- **`src/main.ts`** (`createLoadingOverlay`): particle count raised 6→8, all color alphas raised to 0.16–0.32, sizes to 220–400px with updated drift offsets (W-02).
- **`src/main.ts`** (`createLoadingOverlay`): wordmark now uses flex parent + inner `span.loading-wordmark__text` carrying letter-spacing and padding-left (W-01).
- **`src/main.ts`** (`reveal`): `offsetHeight` + `getComputedStyle` + `will-change` injected after `startButton.disabled = false` to eliminate CSSOM `:hover` cold path (W-03).
- **`src/main.ts`** (boot sequence): `postProcessing.prewarmComposer()` + `rafDrain(1)` called after `rendererManager.prewarm()` and before `loadingOverlay.reveal()`; `composer-prewarm-start`/`composer-prewarm-complete` diagnostics emitted (W-04).
- **`src/main.ts`** (boot sequence): bounded-fallback status string tightened to state explicitly that artworks are still being optimised rather than overstating readiness (W-05).
- **`src/styles/main.scss`** (`.loading-wordmark`): replaced `display:block` + `padding-left` + `text-align:center` with `display:flex; align-items:center; justify-content:center`; letter-spacing and padding-left moved to new `.loading-wordmark__text` inner span (W-01).
- **`src/styles/main.scss`** (`.loading-start-btn`): added `&.is-visible:not(:disabled) { will-change: background-color }` for compositor layer pre-promotion (W-03).
- **`src/styles/main.scss`** (`.loading-particle`): opacity raised `0.7→0.9`, blur raised `2px→4px` (W-02).
- **`src/styles/main.scss`** (`@keyframes loading-pulse`): minimum opacity raised `0.45→0.60` (W-02).
- **Markdown docs**: all audit banners and v0.27 status sections updated to shipped.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.
## v0.26 — Loading overlay centering + strict full preload polish (2026-05-22, **shipped**)

### Summary

Loading screen polish and startup smoothness were refined so branding is centered, particles remain visibly animated, and startup preload stays in strict all-artworks mode before entry.

### Changed

- **`src/gallery/GalleryManager.ts`**: `FULL_PRELOAD_SAFETY_CAP` is now `Number.MAX_SAFE_INTEGER`, keeping full-startup preload in strict mode for normal galleries and preventing bounded fallback behavior.
- **`src/gallery/GalleryManager.ts`** (`getFullGalleryReadinessSummary`): reports strict-mode preload summary (`memoryCapApplied: false`, `preloadMode: 'strict'`, `overflowArtworkCount: 0`) to align with the new all-artworks preload contract.
- **`src/main.ts`** (`createLoadingOverlay`): particle config expanded with per-particle delay and drift vectors to drive richer overlay motion.
- **`src/main.ts`** (`reveal`): final hint copy now confirms full readiness (`Alle Inhalte sind vollständig vorbereitet.`).
- **`src/styles/main.scss`** (`.loading-wordmark`): removed indent drift and enforced explicit centered block layout.
- **`src/styles/main.scss`** (`.loading-particle`): added multi-track animation (float + pulse), staggered delays, and drift-variable keyframes for continuously animated particles.
- **Markdown docs**: audit banner and top status references refreshed for v0.26 across repository Markdown files.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

## v0.25 — GPU warm flush hardening + timeline elegance redesign (2026-05-22, **shipped**)

### Summary

Two persistent user-reported issues fixed:

1. **GPU flush / loading screen**: warm loop now yields one RAF frame between each painting render (`rafYield()`), allowing the GPU to flush its command queue and the browser to paint incremental progress bar updates. Three drain frames added after the warm loop and before shader prewarm. `renderer.initTexture()` called immediately after each decoded texture is cached. Loading progress now spans 50 %→95 % during the warm phase (previously 93 %→97 %, invisible).

2. **Timeline arrow elegance**: arrows redesigned as `32 × 32 px` glass circles and made natural flex siblings of the scroll list (removing `position: absolute` overlap). Counter moved to inline flex tail. Padding tightened. Touch devices show arrows at 65 % opacity always.

### Changed

#### T-series — GPU warm / loading screen

- **`main.ts`** (`rafYield`, `rafDrain`): Added `rafYield()` (one RAF frame) and `rafDrain(n)` (n frames) helpers at module scope (T-01, T-02, T-05).
- **`main.ts`** (warm loop): `await rafYield()` after each `warmArtwork()` call so the browser compositor flushes GPU commands between paintings (T-01).
- **`main.ts`** (warm loop progress): range changed from `93%→97%` to `50%→95%`; loading-manager texture-phase caps lowered accordingly (`onProgress` → 48 %, `onLoad` → 50 %) so the warm loop has visible room to animate (T-04).
- **`main.ts`** (post-warm drain): `await rafDrain(3)` inserted between warm-loop end and shader prewarm step, draining the GPU upload queue before the next phase and before "Galerie betreten" is enabled (T-02, T-05).
- **`main.ts`** (flush diagnostics): added `gpu-warm-flush-start` and `gpu-warm-flush-complete` diagnostics around `rafDrain(3)` with frame count and measured flush duration in ms (T-06).
- **`TextureManager.ts`** (`init`): renderer reference now stored as `this.renderer` (T-03).
- **`TextureManager.ts`** (`loadForRole`): `this.renderer?.initTexture(texture)` called immediately after every successful or fallback texture cache insertion to proactively upload the texture to the GPU (T-03).

#### U-series — Timeline elegance redesign

- **`main.scss`** (`.timeline`): `display: flex; align-items: center; gap: 6px` added so arrows and counter are natural flex row siblings; padding reduced to `10px 14px` (U-01, U-03).
- **`main.scss`** (`.timeline__list`): `flex: 1 1 0; min-width: 0` added so the list fills available space between the arrows; padding reduced to `12px 8px 6px` (U-01, U-03).
- **`main.scss`** (`.timeline__arrow`): `position: absolute` removed; resized to `32 × 32 px`; `border-radius: 50%`; `display: flex; align-items: center; justify-content: center` for glyph centering (U-01, U-02).
- **`main.scss`** (`.timeline__arrow--prev`, `--next`): removed redundant absolute-position offset logic and cleaned up now-empty modifier blocks (U-01 cleanup).
- **`main.scss`** (`.timeline__counter`): `position: absolute` removed; `flex-shrink: 0` added; counter now sits at the tail of the flex row (U-04).
- **`main.scss`** (`@media (pointer: coarse)`): new rule in `.timeline__arrow` shows arrows at `opacity: 0.65` always on touch/stylus devices so they are discoverable without hover (U-05).

### Validation

- `npm run lint` — clean (0 errors, 0 warnings in project code).
- `npm run build` — clean (TypeScript typecheck + Vite bundle).
- Runtime: v0.25.


## v0.24.6 — True preload completion + INP stabilization (2026-05-21, **shipped**)

### Changed

#### v0.24.3 R-series — True preload completion

- **GalleryManager.ts** (`FullGalleryReadinessResult`): Extended interface with three new fields: `preloadMode` (`'strict' | 'bounded-fallback'`), `unresolvedArtworkIds` (list of artwork IDs not yet at all 6 readiness stages), `overflowArtworkCount` (artworks beyond safety cap).
- **GalleryManager.ts** (`getFullGalleryReadinessSummary()`): Populates new fields. `preloadMode` is `'strict'` when `artworks.length ≤ FULL_PRELOAD_SAFETY_CAP`; `'bounded-fallback'` when gallery exceeds the cap. `unresolvedArtworkIds` enumerates every pending artwork by ID (R-01, R-03).
- **GalleryManager.ts** (`init()`): Overflow artworks (index ≥ `FULL_PRELOAD_SAFETY_CAP`) are now enqueued as `near-next` prefetch jobs immediately after the strict preload pass, giving them a deterministic completion path instead of relying solely on the opportunistic idle sweep (R-02).
- **main.ts**: Pre-CTA log (`full-gallery-ready`) now includes `preloadMode`, `overflowArtworkCount` (R-01).
- **main.ts**: Added `entry-unresolved-artworks` diagnostic before CTA enablement that lists every unresolved artwork ID; severity is `warn` in strict mode (contract failure) and `info` in bounded-fallback mode (expected) (R-03).
- **main.ts**: Added `inp-acceptance-target` boot diagnostic recording the INP baseline (`1,024 ms`) and good-range target (`200 ms`) for release validation (S-04).
- **main.ts**: Loading overlay "ready" text is now mode-aware: strict mode shows `Galerie bereit`; bounded-fallback mode shows `Galerie bereit – N Gemälde werden im Hintergrund optimiert` (R-04).

#### v0.24.4 S-series — INP stabilization

- **GalleryManager.ts**: Added `setInteractionActive(active: boolean)` public method. While active, non-`critical-now` prefetch queue jobs are deferred — the queue runner exits when it encounters a deferred job and is restarted automatically on `setInteractionActive(false)`. This keeps the main thread free for render/present cycles during pointer windows (S-01, S-02).
- **GalleryManager.ts**: Added `markInteractionFrame(dtMs: number)` public method. Accumulates per-frame CPU time, frame count, and dropped-frame count (dt > 33 ms) for the current interaction window (S-03).
- **GalleryManager.ts**: `setInteractionActive(false)` emits a structured `interaction-end` diagnostic with `durationMs`, `frameCount`, `avgFrameMs`, `droppedFrames`, `droppedFramePct` for every closed interaction window (S-03).
- **main.ts**: Added window-level `pointerdown`/`pointerup`/`pointercancel` listeners that open/close an interaction window via `galleryManager.setInteractionActive()`. Window closes after a 200 ms cooldown following the last pointer-up/cancel (S-01, S-02).
- **main.ts** (`animate()`): Calls `galleryManager.markInteractionFrame(sample.dtMs)` every frame so interaction-window telemetry is accurate (S-03).
- **main.ts** (`beforeunload`): Cleans up the three new interaction listeners and the cooldown timer (S-01).

### Closes plan gaps

- **R-01** ✅ `preloadMode` + `overflowArtworkCount` expose the active preload contract to diagnostics and UX.
- **R-02** ✅ Overflow artworks queued as `near-next` for deterministic post-init completion.
- **R-03** ✅ Structured unresolved-artwork list logged before CTA; severity differentiated by mode.
- **R-04** ✅ Loading status text aligned with preload mode.
- **R-05** — deferred; KTX2/Basis migration requires importer pipeline work beyond this pass.
- **R-06** — acceptance criteria captured via `inp-acceptance-target` diagnostic; gallery-size bucket tests remain a manual validation step.
- **S-01** ✅ Interaction-mode prefetch throttle: non-`critical-now` jobs paused during active pointer windows.
- **S-02** ✅ Interaction window policy implemented with 200 ms cooldown.
- **S-03** ✅ Per-interaction frame telemetry: CPU ms, dropped frames, avg frame time logged on every window close.
- **S-04** ✅ INP acceptance target emitted as boot diagnostic.
- **S-05** ✅ Post-entry optimization status copy visible in bounded-fallback mode.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.
- `npm audit` — known moderate Vite/esbuild advisory (pre-existing, unrelated).


## v0.24.5 — Diagnostics recursion hardening (2026-05-21)

### Fixed

- Hardened `src/utils/Diagnostics.ts` serialization to safely handle circular references and non-serializable values (`function`, `symbol`, `bigint`) without recursive crashes.
- Added re-entrancy guards around global `error` and `unhandledrejection` handlers so diagnostics cannot recursively log their own failures.
- Wrapped diagnostics print path in fail-safe guards so console/group logging failures no longer crash runtime.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.

## v0.24.3 — Loading completeness re-audit + remediation plan (docs-only, 2026-05-21)

### Changed

- Added a new v0.24.3 root-cause findings section in `FINDINGS.md` focused on why “ready” can still precede full first-use smoothness in capped/overflow gallery scenarios.
- Added a new v0.24.3 remediation plan in `plan.md` (R-series) defining strict vs fallback preload modes, deterministic completion requirements, and acceptance criteria.
- Updated `README.md` top status to reflect current runtime truth (`v0.24.2 shipped`, `v0.24.3 planning/docs-only`) and linked the new plan/findings sections.
- Refreshed markdown audit stamp across repository Markdown files.

### Validation and residual risk

- Documentation-only pass; no runtime code changed.
- Runtime preload-completeness fix remains pending implementation of the v0.24.3 plan.

## v0.24.2 — Strict full-gallery entry contract (2026-05-21)

### Changed

- **GalleryManager.ts**: Replaced `PBR_PRELOAD_LIMIT = 15` with `FULL_PRELOAD_SAFETY_CAP = 50`. All authored PBR texture sets are now preloaded during `init()` under the loading overlay — not just the first 15. Artworks beyond the safety cap (extreme exhibitions) fall back to the idle prefetch sweep.
- **GalleryManager.ts**: Exported new `FullGalleryReadinessResult` interface and added `getFullGalleryReadinessSummary()` method that aggregates per-artwork readiness ledger into a concise pre-entry audit report (total, fullyReadyCount, gpuWarmedCount, pbrLoadedCount, proceduralReadyCount, memoryCapApplied).
- **main.ts**: Removed the device-capped `entryWarmTargets` warm model. The pre-entry GPU warm loop now iterates over the complete `warmOrder` (all artworks in priority order). "Galerie betreten" is only enabled after every artwork has been GPU-warmed.
- **main.ts**: Loading overlay now shows `Gemälde X / Y wird vorbereitet` for each artwork during the full warm pass, so users see deterministic per-painting progress.
- **main.ts**: Entry readiness contract now covers all artworks (`fullWarmTargets = warmOrder`), not the former subset. Retry loop resolves remaining stragglers.
- **main.ts**: `getFullGalleryReadinessSummary()` is logged with event `full-gallery-ready` immediately before CTA enablement, providing a machine-readable pre-entry diagnostics proof.
- **main.ts**: `warmCursor` starts at `warmOrder.length` post-reveal; `continueWarmQueue` exits on first RAF tick and disposes the warm render target immediately.

### Closes plan gaps

- **Q-01** ✅ Strict all-paintings-ready contract before CTA (no more subset warm model).
- **Q-02** ✅ Memory guardrail: `FULL_PRELOAD_SAFETY_CAP = 50` prevents unbounded preload on extreme galleries.
- **Q-03** ✅ Deterministic completion: sequential `ensureEntryReadiness` with bounded retry loop (no idle-only dependency).
- **Q-04** ✅ Pre-entry diagnostics: `full-gallery-ready` log with per-stage counts before reveal.
- **Q-06** ✅ UX status text shows painting-by-painting progress.

### Validation

- `npm run lint` — pass.
- `npm run build` — pass.
- `npm audit` — known moderate Vite/esbuild advisory (pre-existing, unrelated).



## v0.24.1 — Runtime smoothness hardening (2026-05-21)

### Changed

- Implemented a strict pre-entry readiness contract: CTA reveal now waits for a device-aware warm target set to finish critical readiness stages.
- Added device-capability warm profiles (radius, pre-entry warm count, post-reveal frame budget, batch caps) to balance smoothness and responsiveness on large/mobile galleries.
- Refactored prefetch scheduling to explicit lanes (`critical-now`, `near-next`, `background`) with starvation-aware queue ranking.
- Deferred adjacent procedural pre-generation into queued idle chunks to reduce bursty same-frame main-thread work.
- Added per-navigation cold/hot readiness verdict diagnostics to prove whether interactions still triggered cold readiness work.

### Validation and residual risk

- `npm run lint` passed.
- `npm run build` passed and rebuilt `customer-preview/freyraum-gallery.js`.
- `npm audit --audit-level=moderate` remains the known Vite/esbuild advisory requiring a semver-major tooling upgrade.

## v0.24 — Deep loading/performance planning + full markdown refresh (docs-only, 2026-05-21)

### Changed

- Added a new v0.24 plan focused on eliminating remaining first-visit gallery lag after entry.
- Consolidated deeper online research notes for render/upload scheduling, idle-work chunking, and compressed/deferred texture pipeline options.
- Refreshed all repository Markdown files with the new v0.24 audit stamp and updated cross-references.

### Validation and residual risk

- Documentation-only pass; no runtime code changed.
- Baseline repository validation before docs updates: `npm install`, `npm run lint`, and `npm run build` passed.
- Runtime smoothness fix remains pending implementation of the v0.24 plan.

## v0.23.1 — Performance/Preloading implementation (2026-05-21)

### Changed

- Added a per-artwork readiness ledger covering albedo, authored PBR, procedural maps, material apply, shader compile, and GPU warm state.
- Replaced the fixed `GPU_WARM_LIMIT = 15` fallback with a budgeted warm order that prepares the critical navigation window before reveal and continues safely through an offscreen render target after entry.
- Pre-generates procedural maps for current ±2 artworks, promotes next/previous/timeline targets ahead of the idle sweep, and keeps adaptive-quality cooldown active while readiness work is pending.
- Added startup diagnostics for ImageBitmap decode support, future KTX2/Basis importer planning, and 4/15/20/50 artwork validation buckets.

### Validation and residual risk

- Baseline before changes: `npm install`, `npm run lint`, and `npm run build` passed.
- Post-implementation validation: `npm run lint` and `npm run build` passed.
- `npm audit --audit-level=moderate` still reports the known Vite/esbuild development-server advisory; the available automated remediation requires a semver-major tooling upgrade and remains a separate maintenance task.

## v0.23 — Performance/Preloading Planning Audit (docs-only, 2026-05-21)

### Changed

- Refreshed all Markdown files to document the remaining navigation-stutter root causes after v0.22.
- Added the N-series performance/preloading plan to `plan.md`.
- Added source-referenced findings to `FINDINGS.md` covering large-gallery GPU warm gaps, synchronous procedural generation, idle-prefetch limits, shader/readiness diagnostics, and adaptive-quality cooldown timing.

### Validation and residual risk

- Documentation-only pass; no runtime code changed.
- Runtime validation is deferred to the N-series implementation pass. Known `npm audit --audit-level=moderate` Vite/esbuild advisory remains a separate tooling upgrade.

## v0.22 — Improved Preloading: Capped PBR Pre-Load + "Galerie betreten" (SHIPPED)

**Status: shipped in runtime code, rebuilt preview output, and all Markdown docs.**

### Fixed

- Preloaded authored PBR texture sets during `GalleryManager.init()` under the loading overlay, capped by `PBR_PRELOAD_LIMIT = 15` to avoid large-gallery memory spikes.
- Added synchronous `GalleryManager.warmArtworkForGPU(index)` plus `TextureManager.getForRole(url, role)` so cached texture sets can be bound without network fetches and uploaded to GPU via hidden render passes.
- Warmed every artwork up to `GPU_WARM_LIMIT = 15` before reveal; larger galleries keep the single-artwork fallback and continue idle PBR prefetching.
- Replaced automatic overlay dismissal with an accessible "Galerie betreten" button. `LoadingOverlayControls.reveal()` now returns `Promise<void>`, stops hint cycling, focuses the CTA, and resolves only after user entry.
- Registered audio recovery listeners before the start-button gesture, preserving the first click/Enter/Space as a browser-compatible AudioContext start opportunity.
- Added a 500 ms minimum branded loading duration and remapped progress: GPU warm 93–97%, shader prewarm 97–99%, ready 100%.

### Validation and residual risk

- Baseline before changes: `npm install`, `npm run lint`, and `npm run build` passed.
- Post-implementation validation: `npm run lint` and `npm run build` passed.
- `npm audit --audit-level=moderate` still reports the known Vite/esbuild development-server advisory; available automated remediation requires a semver-major tooling upgrade and remains a separate maintenance task.

## v0.21 — implementation shipped (2026-05-21)

Current status: shipped. The v0.21 plan is implemented in runtime code and documentation: branded progress loading overlay, Three.js LoadingManager progress, pre-reveal GPU warm render + awaited shader prewarm, audio `preload='auto'`, adjacent/idle PBR prefetch, lighting resume clamp, WebGL restore status, max-texture diagnostics, shader precision guard, 16K importer guidance, global pointer tracking, timeline arrows/counter/edge fades/responsive sizing/virtualized large-list rendering, and cleanup for added global listeners. Future-only boundaries remain LOD/tiled streaming for device-limited 16K detail and grouped/page timeline navigation for very large exhibitions.


### Validation and residual risk

- Baseline before code changes: `npm install`, `npm run lint`, and `npm run build` passed.
- Final validation after v0.21 implementation and docs sync: `npm run lint` and `npm run build` passed.
- Security audit: `npm audit --audit-level=moderate` still reports the pre-existing moderate Vite/esbuild development-server advisory; the available fix requires a breaking Vite major upgrade and was left as a separate dependency-upgrade task.

## v0.21 — Preloading, Interactive Loading Screen, Tab Smoothness + 16K High-Resolution Support + Global Pointer Tracking + Timeline Scalability (2026-05-21, shipped)

### Shipped (original scope — G-01 through G-07)

- **Interactive loading screen:** Replace plain white spinner with dark-themed FREYRAUM branded overlay: wordmark, real-progress bar wired to Three.js `LoadingManager`, cycling German hint texts, floating ambient particle glows, and an elegant scale+unblur gallery reveal on completion.
- **Shader prewarm:** Move `RendererManager.prewarm()` call to BEFORE loading overlay hides and `await` it — currently called as fire-and-forget `void` AFTER the overlay hides at `src/main.ts:695`. Fix eliminates first-interaction shader-compile stutter (G-01, corrected 2026-05-21).
- **Audio full preload:** Change `BackgroundAudioManager` audio element from `preload='metadata'` to `preload='auto'` so audio frames are buffered at boot — eliminates audible gap on first play (G-02).
- **Adjacent artwork prefetch:** After artwork N is shown, speculatively prefetch PBR maps for artworks N±1 and N±2 using `requestIdleCallback` — eliminates cold-navigation lag (G-03).
- **GPU texture warm pass:** Perform a hidden render pass after all textures load but before the overlay hides — forces CPU→GPU texture upload so first artwork render has no stall (G-06).
- **Idle full-prefetch sweep:** After first artwork reveals, use `requestIdleCallback` to progressively preload all remaining artwork PBR maps during browser idle time (G-07).
- **`<link rel="preload">` hints:** Add font preload hints to `app.html` `<head>` (G-05).

### Shipped / documented (extension — H-01 through H-07)

- **LightingSetup delta clamp (H-01):** Prevent key-light position jump on tab resume by clamping the inter-frame delta to 100 ms in `LightingSetup.update()`, matching the existing `GalleryManager.MAX_SMOOTHING_DT` pattern.
- **WebGL context restore UI (H-02):** Add optional callback in `RendererManager.onContextChange()` so `main.ts` can show a brief "Grafik wird wiederhergestellt …" status during context loss on mobile.
- **TextureManager oversized-texture guard (H-03):** Add `private maxTextureSize = 0` field (currently not stored), assign in `init()`, and emit `diagnostics.warn('texture-oversized', …)` when a loaded texture exceeds the device limit (H-03 corrected 2026-05-21: field was never stored, only logged).
- **PaintingMaterial GLSL highp precision guard (H-04):** Inject `#ifdef GL_FRAGMENT_PRECISION_HIGH / precision highp float` block into PaintingMaterial shader to prevent UV seaming on high-resolution artworks with large detail tiling factors on mobile.
- **Importer 16K norm update (H-05):** Replace single `MAX_RECOMMENDED_DIMENSION = 4096` with a four-tier threshold system (≤ 4096 all-safe / ≤ 8192 modern-mobile+desktop / ≤ 16384 high-end-desktop / > 16384 hard-block). Updated GPU memory thresholds: 85 MB / 341 MB / 1024 MB.
- **Importer NPOT diagnostic (H-06):** Add silent internal note for NPOT dimensions (not customer-visible). WebGL 2.0 handles NPOT correctly; note is advisory for future WebGL 1.0 fallback awareness.
- **LOD/tiled streaming (H-07, future):** Document the LOD pipeline architecture (thumb/preview/hires manifest + progressive swap) for when zoom depth requires full 16K detail. Documented as a future boundary; no runtime implementation in this pass.

### Shipped (extension — I-01 through I-04: global pointer tracking)

- **Global hover rotation (I-01):** Register `window.addEventListener('pointermove', ...)` for hover rotation so the painting tilt tracks the cursor even when it is over the timeline strip, settings/preferences panel, nav buttons, topbar, or any other overlay element.
- **Legacy mousemove global (I-02):** Move the Touch Events fallback `mousemove` listener from the canvas to `window` — same hover-rotation fix for legacy browsers.
- **Global drag fallback (I-03):** Add window-level `pointermove` / `pointerup` listeners during active canvas panning as a safety net for cases where `setPointerCapture` is silently not honoured by an overlay element.
- **Touch drag off-canvas (I-04):** In the Touch Events fallback path, register a global `touchmove` listener during active panning so a finger that drifts over the timeline or another overlay does not interrupt the drag.

### Shipped / documented (extension — J-01 through J-06: timeline scalability)

- **Virtual rendering window (J-01):** For galleries with > 20 artworks, only instantiate DOM nodes for visible + ±5 buffer thumbnails; remaining positions hold skeleton placeholders. Extends the render window on scroll.
- **Timeline scroll arrows (J-02):** Add left/right arrow buttons that appear on hover over the timeline; each click scrolls by ~80% of the visible width; arrows auto-hide when at the respective scroll boundary.
- **Artwork counter (J-03):** Add a "3 / 20" counter chip in the top-right corner of the timeline bar, updated on every navigation, with `aria-live="polite"` for screen readers.
- **Edge fade gradients (J-04):** Apply CSS `mask-image` linear gradient on both ends of the timeline list so users see a fade indicating more content; fade adjusts dynamically at scroll boundaries.
- **Responsive thumb sizing (J-05):** Replace fixed `150×95px` with `clamp(90px, 15vw, 150px)` × `clamp(57px, 9.5vw, 95px)` so thumbs scale from mobile to 4K.
- **Group/page navigation (J-06, future):** Document the grouped/paginated timeline design for 50+ artwork galleries. Documented as a future boundary; no runtime implementation in this pass.

### Source audit corrections + new gaps (K-series, 2026-05-21)

- **G-01 corrected:** Plan previously stated "prewarm never called". Source shows it IS called at `src/main.ts:695` but as `void` (non-awaited) ~250 lines after the overlay already hides. Fix requires moving the `await`-ed call to before `loadingOverlay.classList.add('is-hidden')`.
- **H-03 corrected:** Plan previously stated "`maxTextureSize` stored but never consulted". Source shows `TextureManager` has NO `private maxTextureSize` field — the value is only logged in `init()`. Fix requires adding the field before `warnIfOversized()` can be implemented.
- **K-01 (new):** `CanvasInteraction.dispose()` must be updated to remove global `window` listeners added by I-01..I-04 patches.
- **K-02 (new):** `Timeline.dispose()` must clear `this.thumbs` array to allow GC of button elements and their listeners.
- **K-03 (new):** `prefetchAdjacentArtworks()` method does not exist in `GalleryManager` — G-03 patch must add it as a new private method.

### Runtime code shipped in this pass.



## v0.20.8 — Complete v0.20 implementation + markdown sync (2026-05-21)

### Fixed

- Closed the remaining v0.20.7 audio/control gaps: capped fade targets, enriched volume diagnostics, selective preferences slider patching, percent-aware slider accessibility text, recovery diagnostics, extended first-interaction playback recovery, manager-local unmute playback, percentage-valued slider CSS, and shorter loop fallback fade.

### Changed

- Refreshed every tracked Markdown file with the v0.20.8 shipped-status audit so docs no longer describe v0.20 audio as an open regression.

## v0.20.7 — Full technical audit + gap-closure coding plan (2026-05-21, docs-only)

### Changed

- Performed a full line-by-line code audit of all v0.20 audio and control source files.
- Confirmed that all v0.20.5 blocking regressions (state corruption, wrong mapping contract, startup muted, control placement) are resolved in the current codebase.
- Added 10 new technical findings (F-01 through F-10) with file:line references and TypeScript/SCSS code patches to `plan.md`.
- Reclassified v0.20.5 status from "planning only" to "substantially resolved".
- Updated `FINDINGS.md` with a new audit section listing confirmed-correct items and open gaps with priority ratings.
- Refreshed all markdown audit stamps to v0.20.7.

### Runtime code changed in this pass.

## v0.20.6 — Audio stabilization + UI polish (2026-05-21)

### Fixed

- Prevented audio cut-offs during settings changes by skipping redundant `play()` transitions when background audio is already playing.
- Hardened mute handling to ignore no-op mute writes, reducing unnecessary envelope transitions.
- Added first-interaction autoplay recovery retry (`pointerdown`, arrow keys, Space/Enter) when autoplay was blocked and mute is off.
- Kept startup mute preference default unmuted (`audioMuted: false`) so fresh loads do not persist muted state.
- Removed the dark circular keyboard-focus artifact on nav arrow buttons with explicit `.nav-btn:focus-visible` styling.

### Changed

- Refined `.audio-controls` sizing/padding and slider width in `src/styles/main.scss` so the audio control visually aligns better with settings/fullscreen controls.
- Updated markdown status stamp/context to v0.20.6.

## v0.20.5 — Audio regression audit + recovery plan (2026-05-21, docs-only)

### Changed

- Reclassified the v0.20.4 audio pass as incomplete after a fresh code audit against the reported customer failures.
- Added a new recovery plan for the remaining audio bugs in `plan.md`.
- Logged confirmed root causes and acceptance coverage in `FINDINGS.md`.
- Refreshed repository markdown so docs no longer claim the current audio behavior is fully fixed.

### Confirmed issues

- `BackgroundAudioManager.play()` and the `volumechange` listener currently overwrite the stored target gain with transient fade-to-zero values, which can make startup, autoplay recovery, and unmute behave like 0% volume.
- `src/audio/volumeMapping.ts` currently implements the wrong mapping contract for the stated requirement; UI `50%` should equal `15%` effective gain because the intended effective range is `0..30%`, not `0..100%`.
- Main-page audio controls are still documented and implemented in the same bottom-left position even though that placement has been reported as wrong.

## v0.20.4 — Volume mapping, slider continuity, fade envelope, responsive layout (2026-05-20)

### Added

- **`src/audio/volumeMapping.ts`** — new volume display↔gain mapping utility.
  - `displayPercentToGain(percent)`: power-curve mapping so 50% display → ~15% effective gain (calm ambient baseline).
  - `gainToDisplayPercent(gain)`: deterministic inverse.
  - `DEFAULT_AUDIO_GAIN` constant (≈ 0.152) used as the new startup default.
  - Source: https://www.dr-lex.be/info-stuff/volumecontrols.html

### Changed

- **`src/utils/preferences.ts`** — default `audioVolume` changed from `0.35` (linear 35%) to `DEFAULT_AUDIO_GAIN` (≈ 0.152, mapped from display 50%). First-launch audio is now calm by default. Legacy stored values continue to be read as effective gain with no migration needed.
- **`src/audio/BackgroundAudioManager.ts`** — added rAF-based fade envelope (Slice C):
  - `startFade(target, durationMs, label, onComplete?)` drives a per-frame volume ramp.
  - `cancelFade()` stops any in-progress ramp before starting a new one.
  - `FADE_IN_MS = 300` applied on `play()` start.
  - `FADE_OUT_MS = 200` applied on `pause()` and `setMuted(true)`.
  - `LOOP_RESTART_FADE_MS = 150` applied before the `ended`-fallback loop restart.
  - Added diagnostics events: `audio-fade-start`, `audio-fade-cancel`, `audio-fade-complete`, `audio-volume-map`, `audio-resume-attempt`.
- **`src/ui/PreferencesPanel.ts`** — refactored to in-place DOM patch model (Slice B):
  - Panel is built once (`buildPanel()`); `patchPanel()` only updates mutable states (checked, value, textContent).
  - `isVolumeDragging` guard: structural re-patches are suppressed while the user drags the slider. Display label and track fill are updated in-place.
  - `pointerdown`/`pointerup`/`pointercancel` guard lifecycle is complete; keyboard slider updates remain fully live.
  - Volume slider now uses `displayPercentToGain`/`gainToDisplayPercent` mapping.
  - Audio status element uses `hidden` attribute pattern instead of conditional re-render.
- **`src/ui/AudioControls.ts`** — volume slider now uses `gainToDisplayPercent` for display and `displayPercentToGain` on input; sets `--volume-pct` CSS property for track fill.
- **`src/styles/main.scss`** — Slice D placement and responsive improvements:
  - `.audio-controls` now uses `--audio-ctrl-bottom` and `--audio-ctrl-left` CSS tokens (fall back to previous values); responsive overrides only need to change tokens.
  - Fixed `--volume-pct` CSS default from `35%` (invalid unit in `calc`) to `50` (unitless, matching new default display percent).
  - `@media (max-width: 599px)` now collapses `.audio-controls__slider-wrap` to keep the control compact and non-overlapping on narrow phones.

### Validation

- `npm run lint` ✅
- `npm run build` ✅

## v0.20.3 — Technical plan hardening + markdown sync (2026-05-20, docs-only)

### Planned

- Expanded the latest audio-focused roadmap into a deeper technical implementation plan:
  - formal volume display↔effective-gain mapping contract,
  - PreferencesPanel in-place slider continuity refactor guidance,
  - BackgroundAudioManager fade-envelope transition model,
  - responsive control-placement policy and diagnostics expansion.
- Added explicit coding-slice sequencing and acceptance checks for the next implementation PR.

### Documentation

- Added v0.20.3 technical audit findings to `FINDINGS.md`.
- Added v0.20.3 technical planning section to `plan.md`.
- Updated top-level status references in `README.md`, `docs/HANDOFF.md`, and `DOCUMENTATION_RULES.md`.
- Refreshed markdown audit stamp text across repository `.md` files.

## v0.20.2 — Audio UX follow-up plan (2026-05-20, docs-only planning pass)

### Planned

- Define a new startup-volume behavior: audio enabled by default with calm effective loudness and a display mapping where UI `50%` corresponds to the requested lower baseline.
- Rework main-page mute/volume control placement according to discoverability, accessibility, and touch-target guidance.
- Fix settings-panel volume slider continuity so dragging remains continuous and does not degrade to click-step behavior.
- Add fade-in/fade-out handling to reduce clip/click artifacts at loop/toggle boundaries.

### Documentation

- Added v0.20.2 planning detail to `plan.md`.
- Logged supporting code-audit and online UX findings in `FINDINGS.md`.
- Updated top-level status notes in `README.md` and `docs/HANDOFF.md`.
- Refreshed markdown audit stamp across all repository `.md` files.

## v0.20.1 — Full markdown audit and sync (2026-05-20, docs-only)

### Changed

- Completed a full markdown consistency pass across all repository `.md` files.
- Added a shared audit stamp to every markdown file and refreshed top status labels to align with shipped v0.20 state.
- Updated customer/developer guidance phrasing where stale v0.19-only wording remained.

### Validation

- `npm install` ✅
- `npm run lint` ✅
- `npm run build` ✅

## v0.20 — Audio playback fix + main-page controls + sidecar cache-bust (2026-05-20)

### Fixed

- **Audio not playing on file:// origin:** Removed `crossOrigin = 'anonymous'` from `BackgroundAudioManager`. Chromium-family browsers treat `file://` pages as `null` origin; the CORS attribute triggered a rejected cross-origin request that silently blocked all audio loading. Audio now loads and plays correctly when the gallery is opened locally.
- **Sidecar text stale after re-import:** `import-artworks.mjs` now updates `customer-preview/app.html` on every import run, stamping `?t=<timestamp>` on the `customer-artworks.js` and `customer-audio.js` script src attributes. This forces Chromium's `file://` cache to treat each run as a new resource URL, ensuring updated sidecar text is always applied.

### Added

- **Main-page audio controls** (`src/ui/AudioControls.ts`): subtle glass-pill widget fixed to bottom-left, symmetric to ZoomControls. Shows mute/unmute button and compact volume slider. Hidden when no audio source is imported. Pulsing indicator appears when autoplay is blocked — clicking activates playback within the user gesture. Full accessibility labels (aria-label, aria-pressed, title) and reduced-motion / high-contrast adaptations.
- Improved `BackgroundAudioManager` error event handler to log `MediaError.code` and `MediaError.message` for easier future diagnosis.

## v0.19 — Background audio workflow (2026-05-20, implemented)

### Added / Changed

- `scripts/import-artworks.mjs` now imports customer audio from `customer-audio/inbox`, copies supported files to `customer-preview/audio`, emits `customer-preview/customer-audio.js`, and writes report sections for selected/ignored/unsupported/no-audio outcomes.
- `scripts/write-local-preview.mjs` now injects `customer-audio.js` into preview HTML and writes a fallback audio stub when no generated file exists yet.
- Added `src/audio/BackgroundAudioManager.ts` for runtime audio ownership (source selection, autoplay handling, loop fallback, diagnostics, lifecycle suspend/resume, disposal).
- `src/main.ts` now sanitizes injected audio payloads, wires manager lifecycle into existing runtime lifecycle hooks, and syncs UI status messaging.
- `src/utils/preferences.ts` now persists `audioMuted` + `audioVolume` in `freyraum.preferences.v1`.
- `src/ui/PreferencesPanel.ts` and `src/styles/main.scss` now include mute + volume controls and autoplay status note rendering.

### Documentation

- Updated v0.19 status across repository markdown files from planned to implemented and added shipped workflow details to customer/developer docs.

### Validation

- `npm run lint` ✅
- `npm run build` ✅

## v0.18 — Customer painting text sidecars (2026-05-20, implemented)

Implementation pass. The importer (`scripts/import-artworks.mjs`) now
reads same-basename `.txt` sidecar files (with `.md` as a secondary
alias) and merges customer-edited metadata into the generated manifest.
Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain
importer-owned. No new dependencies; no `src/` runtime changes.

### Added

- `scripts/import-artworks.mjs`:
  - Sidecar constants `SIDECAR_EXTENSIONS`, `PRIMARY_SIDECAR_EXT`,
    `ALLOWED_SURFACE_PROFILES`, `SIDECAR_FIELD_KEYS` lifted to the
    format-policy block.
  - Inbox scan separated into `imageEntries` and a deterministic
    `sidecarMap` (`.txt` preferred over `.md`); duplicates collected
    into `duplicateSidecarWarnings`.
  - Pure `parseSidecar(filePath)` helper: BOM-safe UTF-8 read,
    `CRLF`/`CR` normalization, case-insensitive `Label: value` parsing,
    multi-line `Description:` body with preserved internal blank lines,
    validated `Year` (four digits) and `Surface` (allow-listed),
    tags split on `,`/`;`, and field-level warnings (unknown keys,
    blank `Title`/`Alt`/`Description`).
  - Sidecar fields merged into the artwork object using `??` semantics
    so omitted falls back cleanly while blank still warns.
  - Orphaned sidecars (text without matching picture) computed from
    `imageStems` after the image loop.
- `customer-artworks/last-import-report.txt` gains plain-language
  sections: `Text applied`, `Pictures missing text`,
  `Text files without matching pictures`, `Text fields needing attention`,
  `Duplicate text files`. Missing/invalid text never fails the run.

### Documentation

- `docs/CUSTOMER_TEXT_GUIDE.md` rewritten as the shipped step-by-step
  "how to import text" walkthrough (template copy → rename → fill →
  save → run Update Gallery → read report).
- `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt` updated to reflect
  shipped behaviour and softer "recommended" wording (vs. "required",
  since missing text is non-fatal).
- All v0.18-referenced Markdown updated from "planned/not yet shipped"
  to "implemented" (`README.md`, `docs/HANDOFF.md`,
  `docs/IMAGE_MAINTENANCE_GUIDE.md`,
  `docs/CUSTOMER_PICTURE_GUIDE.md`, `DOCUMENTATION_RULES.md`,
  `ARCHITECTURE_MAP.md`, `AI_RULES.md`, `LESSONS_LEARNED.md`,
  `FINDINGS.md`, `plan.md`).

### Validation

- `npm install`, `npm run lint`, `npm run build` ✅
- `node -c scripts/import-artworks.mjs` ✅
- Manual importer pass over a fixture inbox (matched, missing, orphan,
  duplicate `.txt`/`.md`, invalid `Year`, invalid `Surface`, blank `Alt`,
  multi-line description) verified the expected report sections.

## v0.18 — Final audited sidecar-text plan (2026-05-20)

Planning/docs only. The sidecar-text workflow was fully audited in
`plan.md § v0.18` and `FINDINGS.md § 2026-05-20` ahead of the
implementation pass above.

## Unreleased

### Historical note (v0.19 planning audit — 2026-05-20)

- The pre-implementation v0.19 planning audit has been superseded by the shipped implementation entry above.

### Documentation (v0.18 final audited plan — 2026-05-20)

- Completed a full codebase audit focused on the planned sidecar-text importer change.
- Revalidated the coding guidance against `scripts/import-artworks.mjs`, `src/main.ts`, `src/config/artworks.ts`, and `src/ui/InfoPanel.ts`, plus current Node/accessibility/metadata sources.
- Finalized the v0.18 plan with explicit implementation slices, cleanup, and check-up steps.
- Updated repository markdown to mark the sidecar workflow as planned/not-yet-shipped and to point every v0.18 reference at the final audit sources.
- Current runtime behavior is unchanged: the importer still generates fallback text until the dedicated implementation pass lands.

### Changed / Fixed (v0.17 easy wins — 2026-05-20)

**PreferencesPanel ARIA accessibility:**

- Added `aria-modal="true"` to the preferences panel element (WCAG 4.1.2, ARIA APG dialog pattern).
- Replaced `aria-label` with `aria-labelledby` pointing to the panel's first heading (more robust per ARIA spec).
- Added static `id="freyraum-prefs-heading"` to the heading generated inside `renderPanel()` so the `aria-labelledby` reference is stable across re-renders.
- `handleOutsideClick` now returns focus to the trigger after dismissing the panel, matching the existing Escape-key path (WCAG SC 2.4.3 Focus Order).

**Dead-code removal:**

- Deleted `src/interaction/MouseInteraction.ts`, `TouchInteraction.ts`, and `ZoomPan.ts`. These three files were superseded by `CanvasInteraction.ts` in v0.11 and confirmed to have no remaining production imports.
- Removed deprecated `isMobileDevice()` from `src/utils/performance.ts`. No callers remained; `detectDeviceCapabilities()` in `device.ts` is the correct replacement.
- Updated comments in `CanvasInteraction.ts`, `main.ts`, and `device.ts` from present to past tense to match the removal.

Validation: `npm run lint` ✅, `npm run build` ✅, `customer-preview/` rebuilt.



- Completed a documentation-only deep audit across runtime architecture, scripts, dependency health, diagnostics, accessibility, customer docs, and AI guidance.
- Revalidated current platform/tooling assumptions online: `requestIdleCallback`, Long Tasks API, Page Lifecycle `freeze`/`resume`, three.js `WebGLRenderer.compileAsync`, typescript-eslint support, and ESLint v8 support status.
- Documented validation output: `npm install`, `npm run lint`, `npm run build`, and focused script syntax checks pass; `npm audit` reports two moderate Vite/esbuild dev-server advisories requiring a semver-major Vite upgrade to auto-fix.
- Recorded the lint-time TypeScript 5.9.x / `@typescript-eslint` v7 supported-version warning caused by floating dependency ranges.
- Refreshed every Markdown file with cross-links, stale wording fixes, audit notes, or workflow guidance.

### Documentation (AI context engineering workflow — 2026-05-19)

- Added repository-level AI guidance: `.github/copilot-instructions.md`, `.github/prompts/architecture.prompt.md`, `.github/prompts/refactor.prompt.md`, `.github/prompts/review.prompt.md`, `.github/prompts/autonomous-agent.prompt.md`, `AI_RULES.md`, `ARCHITECTURE_MAP.md`, and `LESSONS_LEARNED.md`.
- Added docs folders for architecture, standards, lessons learned, and AI feedback so future agent work starts from repository structure and previous regressions.
- Documented hard constraints around diagnostics, reduced motion, CSS containment, customer-preview rebuilds, injected artwork validation, and validation workflow.

### Fixed (v0.16.2 control-shell follow-up — 2026-05-19)

- Completed the settings/nav regression fix with a stronger CSS control-shell approach after the earlier containment-only fix proved incomplete in customer testing.
- `.nav-btn` now uses a larger 72×72 transparent shell with the visible 64px glass circle rendered on `::before`; hover scale now has spare pixels and is no longer lightly clipped at the edge.
- `.prefs__trigger` now uses a larger 52×52 transparent shell with the visible 44px glass circle rendered on `::before`; the gear control has a slightly larger hit area and no longer feels clipped.
- `.prefs` and `.nav-controls` remain excluded from the containment block from v0.16.1.
- Rebuilt `customer-preview/style.css` so the shipped preview matches the source fix.
- Validation: `npm run lint` ✅, `npm run build` ✅, and headless Chromium + SwiftShader confirmed the real built preview opens the settings panel (`aria-expanded false→true`, `panel.hidden true→false`).

### Fixed (v0.16.1 UI containment regression hotfix — 2026-05-19)

- Fixed a settings-popover regression where the gear/settings control appeared broken because the popover anchor (`.prefs`) was paint-contained; the absolute panel was clipped to the trigger box boundary.
- Fixed center left/right navigation button hover clipping where scaled hover states were cut off because `.nav-controls` was paint-contained.
- Updated `src/styles/main.scss` containment block to exclude `.prefs` and `.nav-controls`, while keeping containment on the other fixed chrome surfaces.
- Updated all repository markdown files to document this regression and the follow-up v0.16.2 control-shell hardening.
- Validation status: initial fresh-clone checks failed before dependency install (environment setup), then full checks passed after install (`npm run lint`, `npm run build`).


### Implemented (v0.16 deep performance and compatibility optimization — 2026-05-19)

This release implements every actionable finding from the v0.16 audit while preserving 100% of FREYRAUM's museum-grade fidelity. There are no changes to material shading, painting relief, raking-light inspection, or motion behaviour; all changes are restricted to scheduling, GPU resource lifetime, runtime measurement, capability progressive enhancement, and CSS paint-cost reduction on the existing battery preset.

Runtime changes:

- **Single resize coordinator.** Removed `window.resize` listeners from `SceneManager` and `PostProcessing`. New public methods `SceneManager.updateAspect(w, h)` and `PostProcessing.resize(w, h)` are driven exclusively from `main.ts`. The coordinator debounces all resize sources for 120 ms, then runs all DOM reads and GPU writes inside a single `requestAnimationFrame`, eliminating forced-layout thrash on mobile orientation changes.
- **Cached chrome refs.** `main.ts` populates `chromeRefs` (topbar, timeline, nav controls, info panel) once after UI construction. `measureArtworkViewport` no longer calls `app.querySelector` per resize.
- **Page Visibility + Page Lifecycle.** New `pageInactive` flag suspends `postProcessing.render()`, the per-frame light/material updates, and adaptive-quality sampling when the tab is hidden or frozen. `visibilitychange`, `freeze`, and `resume` events all route through `suspendRuntime` / `resumeRuntime`. On resume, `frameBudget.markNavigation()` guards against an adaptive downgrade caused by the catch-up spike.
- **Deferred preference application.** Repeated preference changes coalesce via `requestIdleCallback` (with `setTimeout(0)` fallback). The first apply remains synchronous because the scene is not yet shown. Adaptive downgrades route through the same path so they never land mid-frame.
- **Shader pre-warm.** New `RendererManager.prewarm(scene, camera)` calls three.js's `compileAsync()` (or falls back to `compile()`) after boot and after every deferred preset apply. Failures are logged but never block startup.
- **Anisotropy no-op guard.** `TextureManager.setAnisotropyDivisor()` short-circuits when the divisor is unchanged, preventing a GPU texture re-upload on every preference re-apply.
- **Renderer-info snapshot.** New `RendererManager.getRendererSnapshot()` exposes a read-only view of `renderer.info`. `main.ts` logs one `[renderer] snapshot` entry every 5 s in info/verbose diagnostics mode, providing a running GPU resource history in customer bug reports.
- **Progressive startup hints.** `suggestStartupQuality()` now consults `navigator.deviceMemory` (≤ 0.5 GB → battery) and `navigator.hardwareConcurrency` (≤ 2 cores → battery). Missing values pass through to the prior viewport-area heuristic.
- **Long Tasks observer.** Debug-only `PerformanceObserver({ type: 'longtask', buffered: true })` logs any task ≥ 50 ms as `[perf][warn] long-task`. Detached on `beforeunload`.
- **Dispose idempotency.** `RendererManager.dispose()` and `CanvasInteraction.dispose()` guard against double-invocation that previously could race a context-loss shutdown with `beforeunload`.

CSS changes (battery preset paint cost + compatibility fallback):

- **Quality data attribute.** `RendererManager.applyPreset()` writes `:root[data-quality='high'|'balanced'|'battery']` so SCSS can react without a JS round-trip.
- **Battery glass blur halved.** `:root[data-quality='battery']` sets `--glass-blur: 12px` (was 26px). Blur cost is O(r²); the visual style survives, the pixel cost drops by ~75%.
- **`backdrop-filter` fallback.** `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` replaces the glass surfaces with a solid `--glass-bg-strong` so older Firefox / embedded WebViews remain legible.
- **CSS containment on fixed chrome.** `contain: layout paint` was added across fixed-position chrome in v0.16 and later refined in v0.16.1 by excluding `.prefs` and `.nav-controls` to avoid popover/hover clipping regressions. The spinner adds `contain: strict`.

Importer changes (`scripts/import-artworks.mjs`):

- **GPU texture-memory warnings.** New warnings on import: (a) any side larger than 4096 px ("many phones cap textures at 4096"); (b) GPU footprint ≥ 128 MB ("phones may run out of memory and skip the texture"); (c) ≥ 64 MB ("performance may be reduced on low-end phones"). Footprint computed as `width × height × 4 × 4/3` to account for the RGBA8 mip pyramid.

Diagnostic surface (new info-mode entries):

- `[lifecycle] suspend` / `resume`
- `[renderer] snapshot` (5 s while active)
- `[renderer] prewarm-async` / `prewarm-sync` / `prewarm-failed`
- `[texture] anisotropy-noop` / `anisotropy-applied` (debug level)
- `[perf] longtask-observer-active` / `long-task` / `longtask-unsupported`

Acceptance gates:

- `npm run lint` ✅
- `npm run build:typecheck` ✅
- `npm run build` ✅
- `node -c scripts/import-artworks.mjs` ✅

Explicitly deferred (documented rationale in `plan.md § v0.16 implementation summary`):

- Pinch-zoom log-space squared-distance refactor (negligible measurable benefit).
- `ImageBitmapLoader` raster path (no Safari benefit against data URLs).
- `FrameBudgetMonitor` running-sum optimization (< 0.05 ms/frame benefit, +1 risk).
- Deletion of dead-code `MouseInteraction.ts` / `TouchInteraction.ts` / `ZoomPan.ts` (left for a dedicated cleanup PR).
- `content-visibility` on the glass overlay root (cannot be applied without breaking the blur layer behind it).

### Documentation (v0.16 final audited brainstorm — 2026-05-19)

- Re-audited the full source tree against the already-upgraded v0.16 plan and confirmed the original 12 findings still stand.
- Added 6 missed enhancements to the plan and findings: Page Lifecycle `freeze` / `resume`, `renderer.compileAsync()` shader pre-warm, optional `ImageBitmapLoader` raster path, `deviceMemory` / `hardwareConcurrency` first-run hints, debug-only Long Tasks API instrumentation, and CSS `contain` / internal `content-visibility`.
- Expanded the online validation section and implementation-order tables to include the new enhancements and their boundaries.
- Updated validation notes to record the fresh-clone baseline failure before dependency install (`eslint: not found`, `three` / related packages unavailable during `tsc`) so future implementers do not confuse environment setup issues with repo regressions.
- Updated `FINDINGS.md`, `README.md`, `DOCUMENTATION_RULES.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, and `docs/IMAGE_MAINTENANCE_GUIDE.md` to reflect the final v0.16 plan state.
- No runtime code, generated preview bundle, dependencies, or quality preset behavior changed in this pass.

### Fixed (v0.15.1 reduced-motion fidelity hotfix — 2026-05-19)

- Fixed an unintended coupling where `Reduzierte Bewegung` also reduced
  painting texture/shader fidelity.
- `PaintingMaterial` no longer scales detail-normal blending or grazing/specular
  response with reduced-motion state.
- `detailNormalActive()` no longer depends on reduced-motion scalar, avoiding
  reduced-motion-triggered shader-path degradation.
- `GalleryManager.setReducedMotion()` now only controls motion behavior and no
  longer forwards reduced-motion state into `PaintingMaterial`.
- Result: reduced motion now changes motion only; visual fidelity remains tied
  exclusively to the selected quality preset.
- Validation: `npm run lint` ✅, `npm run build` ✅.

### Implemented (v0.15 elegant animation system — 2026-05-19)

- **Frame-rate-independent motion.** Added `smoothDamp(current, target, lambda, dt)` to `src/utils/math.ts`. Converted all 13 frame-rate-dependent per-frame lerps in `GalleryManager.update()` to lambda-driven smoothing (`α = 1 − exp(−λ·dt)`), plus a 14th line for the new `position.z` depth recession. Motion now settles in the same wall-clock time on 30/60/90/120 Hz displays.
- **`GalleryManager.update(now: number)`.** Receives `DOMHighResTimeStamp` from the animate loop; clamps `dt` to ≤ 0.1 s to survive backgrounded tabs.
- **Navigation entrance seeds retuned.** `NAV_SEED_POSITION_X = 4.5` (was 3.2), `NAV_SEED_POSITION_Z = -0.6` (new depth recession), `NAV_SEED_ROTATION_Y = 0.15` rad / ~9° (was 0.32 rad / ~18°), `NAV_SEED_SCALE = 0.88` (was 0.84). Applied in `navigate()` and `goTo()`.
- **Lambda constants documented.** `LAMBDA_HOVER_ROTATION = 12`, `LAMBDA_NAV_POSITION = 2.5`, `LAMBDA_NAV_SCALE = 3.0`, `LAMBDA_CAMERA_ZOOM = 4.0`, `LAMBDA_CAMERA_PAN = 5.0`. Settle-time table: hover ≈ 250 ms, position ≈ 1200 ms, scale ≈ 1000 ms, zoom ≈ 750 ms, pan ≈ 600 ms.
- **New diagnostics on `navigate` / `goTo`.** `motionMode` (`'full'` | `'reduced'`), `seedPositionX`, `seedPositionZ`, `settleTargetMs`.
- **Fixed `InfoPanel.ts` content-swap timing bug.** `CONTENT_SWAP_DELAY_MS = 520` (was hardcoded 200 ms, shorter than the previous 320 ms CSS transition). Added `requestAnimationFrame` between `setContent()` and removing `is-transitioning` so layout is applied before fade-in.
- **Semantic SCSS motion tokens.** New: `--ease-gallery-out` (easeOutExpo `cubic-bezier(0.16, 1, 0.3, 1)`), `--ease-gallery-in-out` (easeInOutQuart), `--dur-control` (0.18 s), `--dur-content` (0.5 s), `--dur-panel` (0.55 s), `--dur-timeline` (0.42 s), `--dur-reveal` (0.9 s). Backward-compat aliases preserved: `--dur-fast → --dur-control`, `--dur-base → --dur-content`, `--dur-slow → --dur-reveal`. `--ease-spring` preserved but no longer used on gallery surfaces.
- **Retuned animated surfaces.** `.info-panel` transition → `--dur-content` + `--ease-gallery-out`; `.info-panel.is-transitioning` translateY 8 px → 16 px; `.timeline__thumb` transition → `--dur-timeline` + `--ease-gallery-out` (no more spring overshoot); `.prefs__panel` animation → `--dur-panel` + `--ease-gallery-out`; `@keyframes prefs-in` softened from `scale(0.94) translateY(-6px)` to `scale(0.96) translateY(-10px)`; `.loading-overlay` → `--dur-reveal` + `--ease-gallery-out`; `.loading-spinner` slowed from 0.8 s to 1.4 s.
- **`main.ts` adjustments.** `loadingOverlay.remove()` timeout raised from 700 ms to 950 ms (matches `--dur-reveal: 0.9s` + 50 ms buffer). Animate loop calls `galleryManager.update(now)`.
- **No new dependencies.** No reduced-motion regressions. v0.14.2 zoom/pan constants untouched.
- **Validation:** `npm run lint` ✅, `npm run build` ✅, preview bundles rebuilt.

### Documentation (v0.15 final documentation audit cleanup — 2026-05-19)

- Final-cleaned the v0.15 documentation set so the plan, findings, README, handoff, and image/customer guides all point to the same final technical audit wording.
- Added explicit repository-verification coverage to `plan.md` and `FINDINGS.md` so the v0.15 plan now states which code areas and markdown surfaces were re-checked.
- Fixed remaining documentation inaccuracies, including stale README/HANDOFF references and the “9 hard-coded lerp lines” wording in `plan.md`.
- Kept the v0.15 pass documentation-only; no runtime code changed.

### Documentation (v0.15 animation technical brainstorm — 2026-05-19)

- Completely replaced the initial animation planning section in `plan.md` with a full technical brainstorm.
- Identified and documented a root bug: all 13 WebGL motion paths in `GalleryManager.update()` use frame-rate-dependent per-frame lerp (`value += (target - value) × k`), causing artwork navigation to take ~408ms on 120 Hz screens vs ~817ms on 60 Hz.
- Specified the fix: add `smoothDamp(current, target, lambda, dt)` to `src/utils/math.ts` using the frame-rate-independent formula `1 − Math.exp(−lambda × dt)`.
- Provided exact lambda values for each property (hover=12, nav position=2.5, nav scale=3.0, camera zoom=4.0, camera pan=5.0) with 95% settle times.
- Identified and documented a timing bug in `InfoPanel.ts`: `setTimeout` delay of 200ms fires before the 320ms CSS transition completes, causing text to change while still partially visible.
- Specified the SCSS redesign: new semantic tokens (`--dur-control`, `--dur-content`, `--dur-panel`, `--dur-timeline`, `--dur-reveal`), new easing curves (`--ease-gallery-out: cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-gallery-in-out`), removal of overshoot `--ease-spring` from timeline/panel uses.
- Documented all `var(--dur-base)` and `var(--dur-slow)` consumers to avoid silent regressions when aliases change.
- Documented the loading overlay removal timeout in `main.ts` that must be raised from 700ms to 950ms after the `--dur-reveal` change.
- Added specific navigation entrance seed values: `position.x ±4.5`, `rotation.y ±0.15`, scale `0.88`, new `position.z −0.6` depth recession.
- Validated all findings against published sources: Stack Overflow #57851938, MDN, WCAG 2.2, web.dev, cubic-bezier.com.
- No runtime code was changed in this documentation pass.

### Documentation (v0.15 animation enhancement initial plan — 2026-05-19)

- Added a detailed research-backed plan for smoother, longer, more elegant animations that fit the modern art-gallery style.
- Documented 2026 guidance for accessible motion, `prefers-reduced-motion`, compositor-friendly animation, `requestAnimationFrame`, and duration ranges.
- Audited current motion surfaces in `src/styles/main.scss`, `src/gallery/GalleryManager.ts`, `src/main.ts`, `src/lighting/LightingSetup.ts`, and `src/utils/preferences.ts`.
- Planned a future implementation path for semantic motion tokens, frame-rate-independent WebGL smoothing, refined artwork navigation, smoother reset/zoom/pan, UI transition retuning, diagnostics, and reduced-motion safeguards.
- No runtime code was changed in this documentation pass.

### Implemented (v0.14.2 vertical pan tightening — 2026-05-19)

- Kept horizontal close-pan behavior unchanged (`INSPECTION_OVERSCROLL_X = 1.2`) because left/right edge reach was already approved.
- Tightened vertical close-pan behavior (`INSPECTION_OVERSCROLL_Y = 0.6`) so top/bottom movement is more restrictive when zoomed in.
- `getPanLimits()` now uses axis-specific overscroll constants (`X` and `Y`) instead of one shared value.
- `show-artwork-complete` diagnostics now logs `panOverscrollX` and `panOverscrollY`.
- Updated all markdown files for this follow-up and rebuilt validation artifacts via normal build flow.

### Fixed (importer launcher compatibility / Node version guard — 2026-05-19)

- Added `scripts/run-import-artworks.cjs` as a CommonJS launcher for the customer importer flow.
- `Update Gallery.command` and `Update Gallery.bat` now call the launcher instead of invoking `import-artworks.mjs` directly.
- The launcher checks Node.js major version before loading ESM importer code and requires Node.js 18+.
- Follow-up hardening: the launcher now uses legacy built-in module names (`child_process`, `fs`, `path`) instead of `node:` specifiers, so very old Node versions can reach the friendly version check/report instead of failing with `Cannot find module 'node:child_process'`.
- On unsupported Node versions, it writes a plain-language compatibility error to `customer-artworks/last-import-report.txt` and exits with a clear message instead of showing a raw `Unexpected token {` stack trace.
- Updated customer and maintainer documentation (`README.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, `docs/IMAGE_MAINTENANCE_GUIDE.md`) with Node 18+ requirement and troubleshooting.

### Implemented (v0.14 zoom/pan/reset-fit follow-up — 2026-05-19)

- **Deeper close zoom on medium/large artworks.** `MIN_CAMERA_Z` changed from `0.5` to `0.2` and `MIN_VISIBLE_ARTWORK_FRACTION` from `0.28` to `0.12`, lowering the practical close-inspection floor where fraction-driven limits previously dominated.
- **Tighter edge pan behavior.** `INSPECTION_OVERSCROLL` reduced from `3.0` to `1.2`, reducing reset-proximate drift while preserving close-inspection edge reach.
- **Portrait-aware reset-fit distance.** Added `PORTRAIT_ASPECT_THRESHOLD = 0.65` and `PORTRAIT_RESET_EXTRA_Z = 1.5`; `getResetFitZoom()` now adds portrait-only headroom after base fit computation.
- **Expanded runtime diagnostics for v0.14 tuning.** `show-artwork-complete` now logs `closeZoomMinVisibleFraction`, `panOverscroll`, `panLimitAtReset`, `portraitResetApplied`, and `portraitResetExtra`.
- Rebuilt `customer-preview/freyraum-gallery.js`.
- Updated `plan.md`, `FINDINGS.md`, `README.md`, `DOCUMENTATION_RULES.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, and `docs/IMAGE_MAINTENANCE_GUIDE.md` with implemented v0.14 details.

### Implemented (v0.13 nav/zoom/pan/icon fixes — 2026-05-18)

- **Nav controls no longer cut off by timeline.** `.nav-controls` bottom position changed from `bottom: var(--chrome-bottom)` (168px) to `bottom: calc(192px + var(--safe-bottom))`, placing the buttons 15px above the timeline's top edge. `--chrome-bottom` was updated from `max(168px, 148px+safe)` to `max(200px, 180px+safe)` to keep zoom controls and artwork fit measurements in sync.
- **Wider zoom range both directions.** `MIN_CAMERA_Z` lowered from `1.2` to `0.5` (closer inspection); `MIN_OVERVIEW_CAMERA_Z` raised from `10.75` to `18.0` and `OVERVIEW_HEADROOM_Z` raised from `1.6` to `3.5` (farther overview).
- **More horizontal pan room when zoomed in.** `INSPECTION_OVERSCROLL` raised from `0.5` to `3.0` world units, so narrow or elongated artworks can be panned well past the edge when close.
- **Gear and fullscreen icons now optically centred.** Added `.prefs__trigger-icon` and `.fullscreen-btn__icon` CSS rules (`display: flex; align-items: center; justify-content: center; line-height: 0; svg { display: block }`) to eliminate the fractional inline descender gap that offset the icons downward inside their circular buttons.
- Rebuilt `customer-preview/freyraum-gallery.js` and `customer-preview/style.css`.
- Updated `plan.md`, `FINDINGS.md`, `README.md`, `DOCUMENTATION_RULES.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, and `docs/IMAGE_MAINTENANCE_GUIDE.md` with v0.13 details.

### Implemented (v0.12 zoom/framing/timeline — 2026-05-18)

- Added `ArtworkViewportMetrics` / `ViewportMetricsProvider` to `GalleryManager` so reset, min, pan, hover, and diagnostics math can use the measured art-safe viewport instead of only raw camera aspect.
- Split the old far zoom ceiling into explicit `ZoomBounds`: `minInspectionZoom`, `resetFitZoom`, and `maxOverviewZoom`. Reset now uses the fitted distance while zoom-out controls can continue to a farther overview distance.
- Extended `main.ts` with `measureArtworkViewport()`, `visualViewport` listeners, and `ResizeObserver` coverage for fixed chrome. Viewport/chrome changes now call `galleryManager.handleViewportMetricsChanged()` and emit `layout/art-viewport` diagnostics.
- Updated timeline selection so the active thumbnail keeps its lifted visual state without clipping: CSS headroom + scroll gutters in `main.scss`, transform-aware manual centering in `Timeline.ts`, `aria-current`, reduced-motion-aware scroll behavior, and non-default `timeline/center-active` diagnostics.
- Extended `show-artwork-complete` diagnostics with reset/min/max zoom, overview headroom, usable viewport size/fractions, and viewport occlusion.
- Rebuilt `customer-preview/freyraum-gallery.js` and `customer-preview/style.css`.
- Updated `plan.md`, `FINDINGS.md`, `README.md`, `DOCUMENTATION_RULES.md`, `docs/HANDOFF.md`, `docs/CUSTOMER_PICTURE_GUIDE.md`, and `docs/IMAGE_MAINTENANCE_GUIDE.md` with deep v0.12 implementation notes and validation status.

### Documentation (v0.12 final research-backed technical coding plan — 2026-05-18)

- Rewrote the v0.12 section in `plan.md` from a short planning note into a full technical coding plan with exact files, code-level bugs, brainstormed solution options, recommended architecture, TypeScript interface suggestions, scroll/viewport formulas, diagnostics additions, and an implementation slice order.
- Added the 2026 online validation result and official source list for `VisualViewport`, `ResizeObserver`, `scrollIntoView`, `scroll-padding`, `scroll-margin`, dynamic viewport units, WCAG Reflow, and WCAG Target Size.

### Added (v0.11 implementation — 2026-05-18)

- New `src/utils/device.ts` module exporting `DeviceCapabilities`, `LayoutTier`, `PointerPrimary`, `Orientation`, `detectDeviceCapabilities()`, and `applyDeviceCaps()`. Capabilities are mirrored to `<html>` data attributes (`data-layout-tier`, `data-pointer-primary`, `data-hover`, `data-orientation`, `data-short-height`) so SCSS can react without re-running JS.
- New `src/interaction/CanvasInteraction.ts` consolidates mouse/touch/wheel input. Pointer Events Level 3 is the primary path with `setPointerCapture` and `lostpointercapture` cleanup; non-passive Touch Events serve as a fallback for older Safari. The gesture state machine has explicit `idle`, `panning`, `pinching`, `swipe-candidate`, and `cancelled` states. Hover rotation is suppressed on coarse pointers.
- New `suggestStartupQuality()` in `src/utils/performance.ts` returns `battery` for high-DPR small phones and `balanced` otherwise. `main.ts` only applies it on first run (when no quality is stored yet), so user choices are respected on every subsequent session.
- New `PreferencesStore.hasStoredQuality()` static helper for the startup heuristic.
- New `RendererManager.isRenderPaused()`; `RendererManager` now registers `webglcontextlost` (with `preventDefault()`) and `webglcontextrestored` listeners, emits diagnostics, and the render loop in `main.ts` short-circuits while the context is lost.
- New `InfoPanel.setCompact(boolean)` method + `.info-panel--compact` SCSS rule for phone-portrait/phone-small layout tiers.
- New `HintText.updateHint()` reads `<html data-pointer-primary>` and renders coarse-pointer-appropriate German copy (`"Wischen zum Navigieren · Zwei Finger zum Zoomen."`).
- New diagnostics scopes/events: `layout/capabilities`, `layout/resize`, `interaction/init`, `interaction/gesture-start`, `interaction/gesture-cancel`, `interaction/swipe`, `quality/startup-suggestion`, `renderer/context-lost`, `renderer/context-restored`.
- Safe-area CSS variables (`--safe-top/right/bottom/left`) and chrome-spacing tokens (`--chrome-top`, `--chrome-bottom`) added to `:root`, with `100dvh` body height and `touch-action: none` scoped to the canvas.
- Four-phase responsive breakpoint set in `main.scss`: phone-portrait (<600), short-height landscape (<500h), tablet-portrait (600–899), tablet-landscape (900–1179), plus device-capability mirror selectors.

### Changed (v0.11 — 2026-05-18)

- `getOptimalPixelRatio()` now clamps to `1.5` on `(pointer: coarse)` devices irrespective of the requested cap, to avoid thermal throttling on mobile while keeping perceived quality similar.
- `app.html`, `index.html`, `customer-preview/app.html`, and `scripts/write-local-preview.mjs` all use `viewport-fit=cover` so notch/safe-area insets are populated.
- All fixed-position chrome (topbar, info-panel, nav, zoom controls, fullscreen button, prefs trigger, prefs panel, timeline, hint, fallback card) offset against the new safe-area variables.
- `.prefs__panel` width is now `min(320px, 100vw - safe-area - 24px)` with `max-height: calc(100dvh - safe-area - 120px)` and `overflow-y: auto`, fixing the panel-overflow issue on narrow phones and short landscape viewports.
- `.zoom-controls__btn`, `.fullscreen-btn`, and `.prefs__trigger` get `min-width: 44px; min-height: 44px;` to keep the WCAG comfort target.
- `main.ts` introduces a single debounced (120 ms) `resize`+`orientationchange` listener that calls `rendererManager.resize()`, re-detects capabilities, re-applies them, toggles compact info-panel, and refreshes the hint copy. `SceneManager`'s existing camera-aspect listener is intentionally retained.
- `FallbackScreen` shows a coarse-pointer-only tip about private browsing/hardware acceleration. The technical reason is now HTML-escaped and only rendered when diagnostics mode is not `default`.

### Fixed (v0.11 — 2026-05-18)

- **Bug 1 — `RendererManager.resize()` never called on window resize.** The renderer drawing-buffer is now resized through the new debounced coordinator in `main.ts`.
- **Bug 2 — All touch listeners passive; iOS Safari native pinch always fired.** `CanvasInteraction` uses `touch-action: none` on the canvas, and the Touch Events fallback path is non-passive so `preventDefault()` can own pinch and pan gestures.
- **Bug 3 — Synthetic mouse events duplicated tap actions.** Pointer Events do not emit a synthetic stream; the Touch Events fallback calls `preventDefault()` on `touchstart` and the shared `click` handler short-circuits when the most recent input was touch.
- **Bug 4 — `isMobileDevice()` width-only heuristic was misleading.** Replaced by `detectDeviceCapabilities()`. The old function is retained but marked `@deprecated`.
- **Bug 5 — HintText showed desktop-only copy on touch devices.** Now reads the data attribute and shows coarse-pointer copy or hides on small phones.
- **Bug 6 — Preferences panel overflowed narrow phones / short landscape.** Fluid width with `min(...)` and bounded `max-height` with internal scrolling.
- **Bug 7 — No `viewport-fit=cover` / safe-area / `dvh`.** Added across HTML, the preview generator, and SCSS.

### Validation (v0.11)

- `npm install`, `npm run lint`, `npm run build` all pass with only the pre-existing Sass legacy-API deprecation notice and the TypeScript parser version warning.
- Vite now transforms 46 modules (down from 47) because the three superseded interaction files are no longer imported.
- `customer-preview/` was regenerated and committed.
- Post-implementation audit: cleaned two redundant `calc(var(--chrome-bottom) + 0px)` expressions in `main.scss` → simplified to `var(--chrome-bottom)` (no visual change; `.nav-controls` and `.zoom-controls`). Updated `docs/HANDOFF.md` priority headline from "v0.10 validation" to "v0.11 responsive/touch".

### Known follow-ups (v0.11)

- Delete the now-unused `src/interaction/{MouseInteraction,ZoomPan,TouchInteraction}.ts` files in a subsequent cleanup PR.
- Add an explicit user-visible WebGL context-loss recovery hint (currently only logged + render paused).
- Optional `ResizeObserver` integration in `RendererManager` for embedded/split-view scenarios.
- Physical-device QA against iPhone, iPad, and Android per the QA matrix in `plan.md`.

### Documentation (v0.11 final research-backed technical coding plan — 2026-05-18)

- Upgraded the v0.11 plan from a high-level goal document to a full technical coding plan with concrete TypeScript interfaces, code patterns, CSS snippets, and file-level action items.
- Identified and documented **7 code-level bugs** found during deep source audit: `RendererManager.resize()` never called on window resize; all touch listeners passive preventing iOS pinch-own; `TouchInteraction`/`ZoomPan`/`MouseInteraction` coexisting without synthetic-mouse suppression; `isMobileDevice()` checking only width; `HintText` hardcoded desktop copy; preferences panel overflow on narrow phones; missing `viewport-fit=cover` and safe-area CSS.
- Planned new `src/utils/device.ts` with `DeviceCapabilities` interface, `detectDeviceCapabilities()`, `LayoutTier` type, and `PointerPrimary` type.
- Planned new `src/interaction/CanvasInteraction.ts` with Pointer Events primary path, Touch Events fallback, gesture state machine, non-passive pinch fix, synthetic-mouse suppression, `setPointerCapture`, and proper `dispose()`.
- Documented all CSS changes: `viewport-fit=cover`, `env(safe-area-inset-*)` variables, `100dvh` with fallback, new 4-tier SCSS breakpoints, `touch-action: none` on canvas, compact info-panel mode, preferences panel `max-height` + `overflow-y: auto`.
- Finalized the v0.11 plan with online validation against W3C WCAG 2.2/2.1, W3C Pointer Events Level 3, MDN viewport/touch-action/env guidance, MDN WebGL best practices, and Khronos WebGL High-DPI/context-loss guidance.
- Added further validated risks/enhancements: explicit 320 px reflow testing, WebGL context-loss handling, optional `ResizeObserver` follow-up for drawing-buffer sizing, and caution that `touch-action: none` must stay scoped to the canvas.
- Updated `FINDINGS.md` with detailed per-bug root cause, file references, and fix descriptions.
- Updated all other markdown files to reference the technical plan pass.


### Fixed (v0.10 follow-up — parallax hole artifacts — 2026-05-17)

- Fixed the newly reported crater/hole artifacts in Hoch mode. Root cause:
  `PaintingMaterial` used parallax-shifted `pUV` for the actual albedo image,
  so procedural height recesses could show a displaced copy of the same picture,
  reading like holes with image content behind them.
- Albedo sampling now stays on the original `vMapUv`; parallax `pUV` is kept
  relief-only for normal/self-shadow sampling so the customer picture remains
  spatially stable.
- Hoch `parallaxScale` lowered from `0.04` to `0.012` to keep relief movement
  subtle and prevent crater-like offsets.
- Diagnostics now include `parallaxEnabled` and `parallaxScale` in
  `show-artwork-complete`.
- Validation: `npm run lint` and `npm run build` pass with only known warnings.

### Fixed (v0.10 — spot artifacts and portrait reset zoom — 2026-05-17)

- Deep source audit identified two root causes for "little spots" in Hoch mode.
  **Primary:** `generateHeight()` micro-noise amplitude too high for the
  self-shadow march step size, creating stochastic dark speckle.
  **Secondary:** `generateSpecular()` blob peak too high for Hoch close-up under
  clearcoat/raking light, creating bright spots.
- Implemented exact line-level changes from `plan.md`:
  - `ProceduralTextureFactory.ts` ~line 156: `* 16` → `* 3`
  - `ProceduralTextureFactory.ts` ~line 220: `* 90` → `* 50`
  - `quality.ts` Hoch `selfShadowBias`: `0.03` → `0.05`
  - `quality.ts` Hoch `specularStrength`: `0.4` → `0.28`
- Fixed reset framing for very vertical pictures: `GalleryManager` now computes
  reset zoom from the framed artwork dimensions and camera aspect/FOV, raises
  max zoom-out distance to `9.25`, and recomputes reset zoom after async artwork
  aspect loading on first load/navigation.
- Diagnostics now log `resetZoom`, `minZoom`, `maxZoom`, `specularStrength`,
  and `selfShadowBias`.
- No GLSL shader changes. No new public API. Balanced/battery unaffected by the
  spot tuning.
- Validation: `npm run lint` and `npm run build` pass with only known warnings.

### Fixed (v0.09 — actual uploaded image on 3D painting — 2026-05-17)

The central 3D painting now shows the actual customer-uploaded image instead of
the generated placeholder. Root cause was that the importer only wrote a relative
file path (`./images/...`) into the manifest — `Three.js TextureLoader` cannot
reliably upload local-file images as WebGL textures in all browsers when opened
via `file://`, even without `crossOrigin` set.

- **`scripts/import-artworks.mjs`**: after copying each image, reads the file
  bytes with `readFileSync`, encodes them as base64, and writes `webglImage:
  "data:image/<mime>;base64,<bytes>"` into `customer-artworks.js`. The exact
  original bytes are preserved — no crop, no scale, no recompression. A MIME
  type lookup table is added for all supported extensions. The import report
  states "3D painting source: embedded as data URLs for reliable offline WebGL."
- **`src/config/artworks.ts`**: added optional `webglImage?: string` to the
  `Artwork` interface.
- **`src/main.ts`**: `sanitizeInjectedArtworks()` now extracts `webglImage` from
  injected artwork objects. Only strings that match `data:image/...;base64,...`
  are accepted to block non-image content injection.
- **`src/gallery/GalleryManager.ts`**: all albedo URL derivations updated to
  `artwork.webglImage ?? artwork.image`: `init()` preload, `showArtwork()`
  cache lookup, `applyPreset()` cache presence check, side-panel lookups,
  fallback check. Diagnostics now include `webglImageSource:
  'embedded-data-url' | 'file-url'` in every `show-artwork-complete` log entry.
- **`src/gallery/TextureManager.ts`**: data URL diagnostic safety — full data
  URLs are never serialized into log entries. Instead logs
  `[data-uri:image/jpeg:2463944bytes]` showing only MIME type and byte count.

### Documentation (v0.09 — 2026-05-17)

- **`plan.md`**: replaced the v0.09 planning section with a full
  implementation and execution plan covering: code audit findings, detailed
  per-file change specs with code excerpts, analysis of alternative approaches
  (createObjectURL, createImageBitmap, fetch, canvas, server), security rationale
  for the data URL regex in the sanitizer, cache key consistency requirement,
  performance / size budget, and acceptance checks.
- **`FINDINGS.md`**: added v0.09 implemented section documenting what changed,
  why data URLs were chosen over alternatives, and the updated acceptance state.
- **`docs/HANDOFF.md`**: updated customer picture replacement status to mark
  v0.09 as implemented; updated acceptance checklist.

### Planned (v0.09 planning pass — 2026-05-17)

- Added a full v0.09 plan to `plan.md` after customer validation showed v0.08
  fixed the 3D painting aspect ratio but not the actual albedo image upload path.
- Documented the updated failure boundary: timeline DOM `<img>` displays the
  uploaded picture, `ArtworkMesh` sizes correctly from manifest dimensions, but
  the WebGL texture path can still fall back to the generated placeholder.
- Added online research findings to `FINDINGS.md` covering Three.js
  `TextureLoader`, CORS/origin-clean image rules, WebGL image texture security,
  `createImageBitmap`, and local user-image loading patterns.
- Planned the v0.09 technical direction: importer-generated exact base64
  `data:image/...` source (`webglImage`) for the central 3D painting albedo so
  WebGL no longer depends on `file://` image upload behavior.
- Updated customer/support docs to mark the remaining issue as v0.09 work rather
  than a completed v0.08 success state.

### Documentation (v0.08 deep implementation notes pass — 2026-05-17)

- **`plan.md`**: added "Deep Implementation Notes & Execution Plan" section to the
  v0.08 entry covering (1) the two-path render pipeline and the manifest-first
  aspect rule, (2) rationale for the two-loader pattern and the URL detection
  regex, (3) a verified all-resolutions matrix derived from `fitWithinBox(4.2,
  5.8)` covering ultrawide / wide / 4:3 / square / 4:5 portrait / 3:4 portrait /
  1:2 tall portrait / 1:4 extreme portrait, (4) how every shader effect
  (self-shadow, parallax, bump, clearcoat, anisotropy, inspection PCF) is
  invariant under the new per-artwork mesh scale, (5) enumerated edge cases
  (HEIC, AVIF, SVG, oversize >`MAX_TEXTURE_SIZE`, animated GIF, EXIF rotation,
  zero/negative aspect, CORS https, cache key collisions, rapid navigation),
  (6) coding advice for future PRs in this area, (7) browser/API stability
  boundaries, (8) resource ownership & disposal contract, (9) validation
  checklist later superseded by the v0.09 customer finding, and (10) parked
  future work for v0.09.
- **`FINDINGS.md`**: documented the follow-up validation pass; all resolutions,
  all image kinds, timeline behaviour, and effect application confirmed.
- **`docs/HANDOFF.md`**: marked v0.08 as shipped; added link to the Deep
  Implementation Notes section in `plan.md`.
- **`docs/CUSTOMER_PICTURE_GUIDE.md`**: confirmed the timeline-vs-3D-painting
  question is resolved for v0.08; added a short note on what the customer can
  expect after `Update Gallery`.

### Fixed (v0.08 — customer artwork 3D rendering — 2026-05-17)

Critical partial fix: imported customer images now drive the central 3D painting
aspect ratio correctly, and one confirmed local-file `crossOrigin` failure mode
was removed. Later customer validation showed the actual albedo bytes can still
fall back to the placeholder in the affected `file://` WebGL path; that remaining
issue is tracked as v0.09 above. The v0.08 root cause was `TextureManager`
setting `crossOrigin = 'anonymous'` on the `THREE.TextureLoader` used for all
textures — in `file://` protocol this caused local images to be treated as failed
CORS requests, silently substituting a 1600 × 1100 gradient fallback while the DOM
Timeline continued to display the images correctly.

- **`src/gallery/TextureManager.ts`**: replaced the single shared
  `THREE.TextureLoader` with two loaders — `externalLoader` (with
  `setCrossOrigin('anonymous')`) for actual `https?://` URLs, `localLoader` (no
  `crossOrigin`) for data URIs, relative paths, and `file://` resources. The URL
  type is detected per-load so both paths share the same cache key and anisotropy
  management. Added `isFallback(url, role)` and a `fallbackKeys` set so callers
  can detect silent fallback use. Added verbose diagnostics: load-start (with URL
  type and crossOrigin mode), load-success (with pixel dimensions), and
  load-failure (with browser error message).
- **`src/gallery/ArtworkMesh.ts`**: `updateAspect()` now accepts optional
  `manifestDimensions: { width, height }` and uses these as the primary source
  of truth for the 3D plane and frame aspect ratio. Texture metadata remains a
  safe fallback for built-in data-URI artworks. `setPaintingTextures()` updated to
  accept and forward `manifestDimensions`. New read-only getters `lastAspectSource`
  and `lastManifestDimensions` expose what was used for diagnostics.
- **`src/gallery/GalleryManager.ts`**: `showArtwork()` now passes
  `artwork.dimensions` to `setPaintingTextures()`. After each texture load it
  calls `isFallback()` and emits a high-visibility `warn` log when the central
  3D painting uses the fallback. The `show-artwork-complete` info log now includes
  `fallbackUsed`, `aspectSource`, `manifestDimensions`, `paintingWidth`,
  `paintingHeight`, and `paintingAspect`.
- **`plan.md`**: v0.08 section rewritten as a full technical implementation plan
  with root cause analysis, code snippets, logging table, acceptance checks, and
  changed-files summary.
- **`FINDINGS.md`**: v0.08 findings updated with confirmed root cause, applied fix
  summary, and build validation result.

### Planned fix (v0.08 critical customer artwork rendering — 2026-05-17)

- Added a critical plan to `plan.md` for the case where imported customer images
  appear in the timeline but not on the central 3D painting.
- Documented the likely failure boundary between DOM thumbnail loading and
  Three.js/WebGL texture loading.
- Added planned diagnostics for manifest dimensions, texture load success/failure,
  fallback texture usage, and computed 3D painting/frame aspect ratios.
- Marked the acceptance requirement: imported images must appear on the central
  3D painting with `fallbackUsed: false` and correct dimensions-derived aspect.

### Added (v0.07 customer-managed artworks — 2026-05-17)

The v0.07 importer and runtime injection path are implemented. A non-technical
customer can generate a customer artwork manifest by dropping images into one
folder and double-clicking one button. Final acceptance of the customer artwork
feature now depends on the v0.08 critical follow-up above: imported images must
also render on the central 3D painting with correct aspect ratios.

- Added `scripts/import-artworks.mjs` — zero-dependency Node 18+ importer that:
  - scans `customer-artworks/inbox/` for image files (sorted naturally)
  - reads pixel dimensions from JPEG / PNG / GIF / WebP / SVG / AVIF (HEIC) headers
  - skips RAW formats with a friendly message, warns about risky formats
  - copies images into `customer-preview/images/<id>.<ext>`
  - writes `customer-artworks/artworks.json` (human-readable manifest, with `.bak` of the previous run)
  - writes `customer-preview/customer-artworks.js` for runtime global injection
  - writes `customer-artworks/last-import-report.txt` in plain language
- Added `Update Gallery.command` (macOS) and `Update Gallery.bat` (Windows) — double-click
  launchers that run the importer and open the report. Both check for Node.js up front
  and print a friendly install hint if missing.
- Added `customer-artworks/inbox/` and `customer-artworks/processed/` with `.gitkeep`
  placeholders. All customer-generated content is excluded from version control via
  `.gitignore`.
- Updated `scripts/write-local-preview.mjs` to inject
  `<script src="./customer-artworks.js">` into `customer-preview/app.html` and to
  write a `window.__FREYRAUM_ARTWORKS = [];` stub when no customer artworks exist yet,
  so the `file://` preview never 404s the injection.
- Refactored to support arbitrary-length, arbitrary-aspect artwork lists:
  - `src/timeline/Timeline.ts`, `src/ui/InfoPanel.ts`, `src/gallery/GalleryManager.ts`
    no longer import the global `artworks` constant; they accept `readonly Artwork[]`
    (or a single `Artwork`) via their constructor.
  - `src/main.ts` now reads `window.__FREYRAUM_ARTWORKS`, validates every entry with
    `sanitizeInjectedArtworks()` (drops malformed entries, dedupes IDs, normalizes
    `surfaceProfile`, falls back gracefully), and uses the customer list when non-empty.
  - When no customer artworks are present, the built-in demo artworks load unchanged.
- Existing `ArtworkMesh.updateAspect()` and `SidePanels.fitWithinBox()` are the
  intended aspect-ratio path for portrait, landscape, square, and ultrawide
  artworks. v0.08 must ensure the central 3D painting uses real imported textures
  and manifest dimensions instead of generated fallback texture dimensions.
- Added `docs/CUSTOMER_PICTURE_GUIDE.md` (rewritten for the implemented workflow,
  including macOS Gatekeeper note, file-type matrix, and FAQ).
- Updated `.gitignore` for `customer-artworks/inbox/*` (except `.gitkeep`),
  `customer-artworks/processed/*` (except `.gitkeep`),
  `customer-artworks/artworks.json`, `customer-artworks/artworks.json.bak`,
  `customer-artworks/last-import-report.txt`, `customer-preview/images/`, and
  `customer-preview/customer-artworks.js`.

### Validation (v0.07 customer importer)

- `npm run lint` — passes with no new warnings.
- `npm run build` — passes; only the pre-existing Dart Sass legacy-JS-API warning is emitted.
- Importer end-to-end tested with portrait (300×600), landscape (800×400),
  square (512×512), ultrawide (3200×800), SVG (1024×768), and JPEG (512×768) files,
  plus one unsupported `.txt` skipped with a friendly message and an empty-inbox run
  that falls back to built-in artworks.

### Added (v0.07 diagnostics and logging system — 2026-05-17)

- Added `src/utils/Diagnostics.ts`, a centralized diagnostics/logger singleton with:
  - modes: `default`, `info`, `verbose`
  - levels: `debug`, `info`, `warn`, `error`
  - ring-buffered session history (300 entries)
  - short-window deduplication with repeat counts
  - structured metadata serialization
  - global error / unhandled-rejection capture
  - global developer API on `window.__FREYRAUM_DIAGNOSTICS__`
- Replaced ad hoc runtime logging with structured diagnostics in:
  - `src/main.ts`
  - `src/rendering/RenderBackend.ts`
  - `src/gallery/TextureManager.ts`
  - `src/gallery/GalleryManager.ts`
  - `src/utils/AdaptiveQualityController.ts`
  - `src/utils/preferences.ts`
- Kept normal console output intentionally low-noise (`warn` / `error` only) while enabling deeper logs through `?debug=1` / `?debug=verbose`.
- Updated `plan.md`, `FINDINGS.md`, `README.md`, `docs/HANDOFF.md`, and `DOCUMENTATION_RULES.md` to document the new diagnostics architecture and reliability guidance.

### Validation (v0.07 diagnostics)

- `npm run lint` — passes; only the pre-existing `@typescript-eslint` TypeScript-version support warning is emitted.
- `npm run build` — passes; only the pre-existing Dart Sass legacy-JS-API warning is emitted.

### Updated (v0.07 full technical execution plan — 2026-05-17)

The v0.07 plan has been expanded from a documentation-only pass into a complete technical implementation and execution guide.

- Documented the exact architecture decision: **global window injection** pattern (`window.__FREYRAUM_ARTWORKS`) is chosen over `fetch()` (blocked on `file://`) and full-rebuild-on-import (slow, unnecessary for every update).
- Added `v0.07 Technical Implementation Guide` to `plan.md`: exact architecture table, Slice S2 manifest schema, Slice S3 complete Node.js script outline with zero-dep dimension reading for JPEG/PNG/WebP/GIF/SVG, Slice S4 large-file strategy and jimp upgrade path, Slice S5 exact code changes for `main.ts` and `write-local-preview.mjs`, Slice S6 report format with sample output, full implementation checklist (Phase 1–4), and developer setup notes.
- Updated `FINDINGS.md` with: architecture decision rationale (why `fetch()` is ruled out on `file://`), global injection pattern, `jimp` vs `sharp` research, zero-dep dimension reading feasibility, macOS Gatekeeper `.command` approval note.
- Updated `docs/CUSTOMER_PICTURE_GUIDE.md` to mark the guide as ready for the next implementation pass.

### Added (v0.07 planning documentation pass — 2026-05-17)

- Added `docs/CUSTOMER_PICTURE_GUIDE.md`, a plain-language guide explaining the current limitation and the planned simple customer workflow: drag pictures into `customer-artworks/inbox/`, run one updater, then open `index.html`.
- Added a full v0.07 plan in `plan.md` for a customer-managed artwork-folder pipeline with one-click import/build automation, generated `artworks.json`, safe optimized copies, large-file handling, fallback demo artworks, and elderly-customer UX requirements.
- Documented online research findings for browser image format support, folder import limitations, EXIF/orientation caveats, and WebGL texture-size limits.
- Updated `README.md`, `FINDINGS.md`, `docs/HANDOFF.md`, and `DOCUMENTATION_RULES.md` to reference the new guide and plan.

### Validation (v0.07 planning docs)

- Documentation-only change. No runtime code changed.
- No new dependencies.

---



### Added (v0.06 implementation — Streifenlicht blockiness reduction)

Three vertical slices shipped against `src/`; root causes RC-1/RC-2/RC-3 from the v0.06 plan were verified in code before implementation and fixed below.

- **S2 — Procedural texture anisotropy.**
  - `src/gallery/TextureManager.ts`: New `getEffectiveAnisotropy()` getter; `setAnisotropyDivisor()` now delegates to it.
  - `src/materials/ProceduralTextureFactory.ts`: New `currentAnisotropy` field (default 1) + `setAnisotropy(value)` method that mutates every cached `DataTexture` in place; `generate()` applies the stored cap to newly created textures.
  - `src/gallery/GalleryManager.ts`: `applyPreset()` now calls `procedural.setAnisotropy(textureManager.getEffectiveAnisotropy())` so authored and procedural textures share the same per-preset cap.

- **S3 — Inspection-only relief-map resolution uplift.**
  - `src/config/quality.ts`: New `QualityPreset.proceduralInspectionTileSize` field — high=`2048`, balanced=`0`, battery=`0`.
  - `src/gallery/GalleryManager.ts`: New `inspectionMode` field + `setInspectionMode(on)` method that re-runs `showArtwork()` when toggled. Module-scope `INSPECTION_ROLES = ['normal','detailNormal','height']` (matches the style of `PROCEDURAL_ROLES`). `showArtwork()` picks `proceduralInspectionTileSize` for inspection roles when `inspectionMode && inspSize > 0`, `proceduralTileSize` otherwise. The factory cache key already includes the effective tile size, so 1024- and 2048-resolution entries coexist without stale-texture risk.
  - `src/main.ts`: `applyPreferences()` calls `galleryManager.setInspectionMode(lightProfile.displayIntent === 'inspection')`.

- **S4 — Lateral self-shadow PCF filter (inspection-only).**
  - `src/config/quality.ts`: High-preset `selfShadowFilterRadius` raised from `0.0` to `0.002` (balanced/battery stay `0.0`). The `selfShadowFilterEnabled` field proposed in the original plan was **not added** — see the plan's "Issues found in the original plan" section; the runtime gate in `main.ts` makes a preset-level boolean dead, and `selfShadowFilterRadius = 0` already disables the path on a preset.
  - `src/materials/PaintingMaterial.ts`: New `uShadowFilterRadius` uniform + `shadowFilterEnabled` instance flag + `setShadowFilterRadius(radius, enabled)` method that writes the uniform unconditionally and only triggers `needsUpdate = true` when the enable flag changes (recompile only on toggle). New GLSL block guarded by `#define PAINTING_USE_SHADOW_FILTER`, inserted inside the existing `#ifdef PAINTING_USE_SELFSHADOW` after the primary-ray `_occlusion` clamp: two companion rays perpendicular to `_shDelta`, each accumulated with the same reciprocal-distance weighting as the primary ray and clamped to `uShadowMaxOcclusion` before the 3-way average. The define is gated on `shadowFilterEnabled && selfShadowActive() && uShadowFilterRadius > 0` so it is never compiled in without the self-shadow path that hosts it.
  - `src/main.ts`: `applyPreferences()` calls `paintingMaterial.setShadowFilterRadius(isInspection ? preset.selfShadowFilterRadius : 0, isInspection && preset.selfShadowFilterRadius > 0)`.

### Validation (v0.06)

- `npm run lint` — clean.
- `npm run build` — typecheck + Vite preview + preview-HTML emitter all pass; only the pre-existing Dart Sass legacy-JS-API deprecation warning is emitted. Bundle: `customer-preview/freyraum-gallery.js` ≈ 562 KB (gzip ≈ 143 KB), up ~9 KB from v0.05 (new GLSL chunk + uniform plumbing).
- Self-shadow texture reads: gallery profile = 8 (unchanged from v0.05); inspection profile = 24 (1 primary ray + 2 lateral rays × 8 steps). Memory uplift on inspection mode on high preset: ≈48 MB GPU per inspected artwork (3 roles × (2048² − 1024²) × 4 bytes).

---

### Added (v0.05 implementation — soft self-shadow filtering)

- **Replaced the binary self-shadow GLSL break loop** in `src/materials/PaintingMaterial.ts` with smooth weighted accumulation: `smoothstep(0, softness, sampleH - wantedH - bias)` per step, reciprocal-distance weighted, normalised, clamped to `uShadowMaxOcclusion`, then multiplied by `strength × profileScale × grazeMask`.
- **Added a near-horizon `grazeMask`** (`smoothstep(0.05, 0.20, tsLight.z)`) so the self-shadow fades out smoothly as light approaches grazing, eliminating the previous hard `_tsLight.z > 0.05` cutoff edge.
- **Added 4 new uniforms** to `PaintingMaterial`: `uShadowBias`, `uShadowSoftness`, `uShadowMaxOcclusion`, `uShadowProfileScale`.
- **Added `PaintingMaterial.setShadowProfileScale(scale)`** (uniform-only, no recompile) and **`PaintingMaterial.setShadowDebug(enabled)`** (toggles `PAINTING_DEBUG_SHADOW`).
- **Added `PAINTING_DEBUG_SHADOW` define path** in the fragment shader. When enabled, the self-shadow value is stashed in `indirectDiffuse` and all other lighting terms are zeroed, producing a clean greyscale visualisation of the shadow mask only.
- **Extended `QualityPreset`** (`src/config/quality.ts`) with `selfShadowBias`, `selfShadowSoftness`, `selfShadowMaxOcclusion`, `selfShadowFilterRadius` for all three presets. Lowered high-preset `selfShadowStrength` from 0.55 to 0.30. `selfShadowFilterRadius` is wired through the type system but kept at `0.0` (PCF filter slot reserved for later).
- **Wired `src/main.ts`** to call `setShadowProfileScale(0.5)` for `display`/`demo` light profiles and `1.0` for `inspection`, via the existing `getLightProfile()` lookup. Added an `s`/`S` debug key (behind `?debug=1`) that toggles `setShadowDebug()` alongside the existing `a`/`A` albedo-only key.
- **Updated `plan.md`, `FINDINGS.md`, `README.md`, `docs/HANDOFF.md`** to mark v0.05 as implemented and document the new behaviour, effective values, and the four enhancement slots that remain open (S4 PCF filter; per-profile shadow scale on `LightProfile`; animated profile-scale fade; authored height drop-in).

### Validation (v0.05)

- `npm run lint` — clean.
- `npm run build` — typecheck + Vite preview + preview-HTML emitter all pass; only the pre-existing Sass legacy-JS-API deprecation warning is emitted.
- Customer-preview IIFE regenerated (`customer-preview/freyraum-gallery.js` ≈ 558 KB / 142 KB gzip).
- No new npm dependencies.

### Updated (v0.05 plan — full technical execution guide)

- **Rewrote v0.05 plan in `plan.md`** from a diagnosis stub into a 7-slice, file-by-file, line-by-line technical execution guide for fixing self-shadow stain artifacts.
- **Confirmed code root cause:** `src/materials/PaintingMaterial.ts` `PAINTING_USE_SELFSHADOW` block — binary break on first blocker, no bias, no softness, no max-occlusion cap, `selfShadowStrength: 0.55` causes direct light to drop to 45 % in a single step.
- **Designed new GLSL contract:** smooth weighted accumulation `smoothstep(0, softness, excess) * (1 / (step+1))`, clamped to `maxOcclusion`, then multiplied by `strength * profileScale`. Maximum gallery-soft darkening = 4.2 % of direct light.
- **Specified TypeScript changes:**
  - `src/config/quality.ts`: add `selfShadowBias`, `selfShadowSoftness`, `selfShadowMaxOcclusion`, `selfShadowFilterRadius` to `QualityPreset`; lower high-preset `selfShadowStrength` 0.55 → 0.30.
  - `src/materials/PaintingMaterial.ts`: add `uShadowBias/Softness/MaxOcclusion/ProfileScale` uniforms; add `setShadowProfileScale()` and `setShadowDebug()` methods; add `PAINTING_DEBUG_SHADOW` define path.
  - `src/main.ts`: call `setShadowProfileScale()` on profile switch; add `s`/`S` debug key for shadow-only visualisation.
- **Optional S4 PCF-like filter slot** documented for 3-ray lateral filtering; controlled by `selfShadowFilterRadius > 0`.
- **Extension slots designed in:** per-profile `shadowProfileScale`, animated profile fade, authored height support, HDR height encoding.
- Updated `FINDINGS.md` and `docs/HANDOFF.md` with code-grounded v0.05 technical context.

### Added (v0.05 planning — initial stub)

- Added initial v0.05 plan in `plan.md` for soft self-shadow filtering and stain artifact removal.
- Documented the suspected shader root cause: binary height-field blocker test with no bias, no penumbra softness, no filtering, and strong direct-light attenuation.
- Captured online research directions for parallax/relief self-shadowing, bias/deadzone handling, PCF-like filtering, and Three.js `onBeforeCompile` integration.
- Updated `FINDINGS.md`, `README.md`, `docs/HANDOFF.md`, and `DOCUMENTATION_RULES.md` with the v0.05 diagnosis, review focus, and documentation status.

### Added (v0.04 implementation)

- **Photorealistic procedural fallback pass.** Replaced the v0.03 `sin/cos` procedural normal, height, and roughness generators with deterministic value-noise maps so raking light no longer exposes checkerboard, cross-hatch, horizontal-band, or vertical-band artifacts.
- **Neutral AO fallback.** Removed the procedural AO radial vignette and replaced it with near-white neutral occlusion plus subtle value-noise grain. Default/high-preset paintings no longer get fake dark edges from fallback AO.
- **Clearcoat / varnish pipeline.** Added `clearcoatEnabled`, `clearcoatStrength`, and `clearcoatRoughnessValue` to quality presets; high enables subtle clearcoat, balanced and battery disable it.
- **Authored varnish map contract.** Added optional `varnish` role to `PaintingMapRole`, `PaintingTextureSet`, `ResolvedPaintingTextures`, and `TextureManager.preloadTextureSet()`.
- **Surface-profile wiring.** `PaintingMaterial.applySurfaceProfile()` now applies per-artwork matte/satin/varnish behavior, and `GalleryManager` calls it after race-protected artwork loads.
- **Artwork metadata update.** All four artworks now declare `surfaceProfile`; `tokyo-passage` is `satin-canvas`, the others are `matte-canvas`.
- **User-friendly surface labels.** `InfoPanel` now adds German material labels such as `Matte Leinwand` and `Satinierte Leinwand` to the artwork metadata line.
- **High-preset height fallback fix.** Procedural height maps are generated whenever bump, parallax, or self-shadow needs them, so high-preset parallax/self-shadow no longer depends on authored maps.
- Regenerated `customer-preview/freyraum-gallery.js` for the one-click local preview.
- Updated `plan.md`, `FINDINGS.md`, `README.md`, and `docs/HANDOFF.md` with implementation outcome, review notes, and validation evidence.

### Updated (v0.04 plan — full technical execution guide)

- **Rewrote v0.04 plan in `plan.md`** from a high-level strategy into an 11-slice, file-by-file technical execution guide. The new plan documents exact method names, line numbers, before/after code snippets, TypeScript constraints, and per-slice acceptance checks.
- **Confirmed Bug 1 root cause:** `ProceduralTextureFactory.generateAO()` line 211 `const vignette = 1 - Math.min(1, r2 * 0.55)` — a radial formula that evaluates to ~0 at texture corners and 1.0 at centre, producing fake edge darkening that is visible on the painting surface.
- **Confirmed Bug 2 root cause:** `generateHeight()` lines 119–120 use `Math.abs(Math.sin(y*0.12))` and `Math.abs(Math.sin(x*0.09))` creating perfect horizontal and vertical banding. `generateNormal()` lines 95–98 use `sin×cos` products at fixed harmonics creating a visible 2D grid. `generateRoughness()` lines 145–148 same pattern at lower amplitude.
- **Designed value-noise replacement:** `valueNoise2d(x, y, seed)` using smoothstep-interpolated 2D integer lattice hash (`latticeHash()` with LCG/Murmur-style constants and `Math.imul`). No external dependency, seeded per-artwork, fully deterministic.
- **Designed clearcoat / varnish pipeline:** `QualityPreset` gains `clearcoatEnabled` / `clearcoatStrength` / `clearcoatRoughnessValue`; `PaintingTextureSet` gains `'varnish'` map role; `PaintingMaterial` gains `applySurfaceProfile()` that reads the per-artwork `SurfaceProfile` and sets Three.js native clearcoat properties; `GalleryManager` calls `applySurfaceProfile()` after every artwork load.
- **Documented 11-file change scope with no new npm dependencies and no GLSL changes.**
- Updated `FINDINGS.md` with code-grounded diagnosis including exact line numbers for every diagnosed issue.
- Updated `docs/HANDOFF.md` v0.04 section with implementation-level summary.
- Updated `README.md` v0.04 section with reference to the new execution plan.

### Added (v0.04 planning — initial)

- Added a new `v0.04` follow-up plan in `plan.md` focused on removing the current vignette-like darkening, replacing the checkerboard-looking procedural surface, and moving the painting material toward a more photorealistic layered PBR workflow.
- Recorded the code-grounded diagnosis that the current dark radial falloff comes from the procedural AO fallback and that the synthetic checker pattern comes from the periodic `sin/cos` procedural normal/height/roughness generators.
- Captured web research sources in `FINDINGS.md` for museum/conservation lighting practice, RTI/photometric surface capture, and practical Three.js PBR guidance.
- Updated `README.md` and `docs/HANDOFF.md` so the next follow-up scope is visible to contributors and reviewers.

### Added (v0.03 validation audit)

- Re-ran a fresh-clone validation audit for the implemented v0.03 work. Documented that `npm run lint` and `npm run build` initially fail until `npm install` is run in a fresh checkout, then both commands pass cleanly aside from the already-known `@typescript-eslint` TypeScript-version warning and the current Dart Sass legacy JS API deprecation warning.
- Corrected the `plan.md` validation note that counted built-bundle shader-gate occurrences: the current production bundle contains **12** occurrences of `PAINTING_USE_PARALLAX`, `PAINTING_USE_SELFSHADOW`, `PAINTING_DEBUG_ALBEDO_ONLY`, and `uKeyLightDir`, not 11.
- Synced `README.md`, `FINDINGS.md`, and `docs/HANDOFF.md` with the fresh-clone audit so reviewer guidance now reflects the latest revalidation pass.

### Added (v0.03 implementation)

- **Matte-first painting material.** `PaintingMaterial` retuned for museum-quality default: `clearcoat 0.04→0.0`, `specularIntensity 1.0→0.3`, `uLightGrazingBoost 0.6→0.25`. Procedural roughness output range shifted from `[60..220]` to `[140..240]`; procedural specular baseline lowered from `12→6` and Gaussian blob peak lowered from `200→90` so varnish patches read as subtle highlights instead of dominant specular reflections.
- **Resolution-aware procedural fallback.** `ProceduralTextureFactory.generate(id, role, tileSize?)` parametrised on output resolution. Per-preset tile sizes baked into `quality.ts`: high `1024`, balanced `512`, battery `256`. Cache key includes `tileSize` so preset changes regenerate maps rather than returning stale low-resolution tiles.
- **Tangent-space parallax relief.** Added `geo.computeTangents()` to `ArtworkMesh.makeArtworkGeometry` so `vTangent`/`vBitangent` varyings populate. `PaintingMaterial` injects a steep parallax march before `map_fragment` that produces a `pUV` variable used by both the albedo and normal samples. New uniforms: `uParallaxScale`, `uParallaxSteps`. Gated by `#define PAINTING_USE_PARALLAX` and enabled only on the high preset (12 march iterations, UV depth scale `0.04`). When parallax is active, `bumpStrength` is set to `0.0` to prevent double-counting relief amplitude.
- **Direct-light self-shadow approximation.** Short height-march along the tangent-space key-light direction modulates `directDiffuse` and `directSpecular` only (the indirect / albedo path is untouched, so the original picture's colour is preserved). New uniforms: `uShadowSteps`, `uShadowStrength`, `uKeyLightDir`. `LightingSetup.getKeyLightWorldDir()` returns the world-space direction; `main.ts` transforms it into view space each frame and pushes it into the material. Gated by `#define PAINTING_USE_SELFSHADOW`, high preset only (8 march iterations, strength `0.55`).
- **Albedo-only fidelity QA toggle.** Hidden behind `?debug=1` URL parameter, then activated with the `a` keyboard key. Strips all shading (`directDiffuse = 0`, `directSpecular = 0`, `indirectDiffuse = diffuseColor`) so reviewers can verify the shader does not change the picture's essence. Console logs availability and current state. Gated by `#define PAINTING_DEBUG_ALBEDO_ONLY`.
- **Museum lighting reposition.** `gallery-soft` primary key moved from `{x:-10,y:5,z:7}` (~68° from vertical — theatrical side-light) to `{x:-3,y:5,z:4}` (~45° — flattering museum-style key that still reveals surface relief during pan/zoom). Horizontal drift amplitude lowered from 0.6 to 0.25 to match the new closer position. `raking-inspection` key moved to strictly horizontal `{x:-6,y:0,z:1.5}`; ambient lowered `0.4→0.3` to maximise shadow contrast. New `displayIntent: 'display' | 'inspection' | 'demo'` field on `LightProfile`.
- **Explicit spotlight target.** `LightingSetup` now creates a shared `THREE.Object3D` at world origin, adds it to the scene, and assigns it to every spotlight's `target`. Closes a latent bug where animating the spot position would have left the detached default target unmoved.
- **Lighting profile UI selector.** New `lighting: LightProfileId` field added to `Preferences` (persisted in localStorage and mirrored to `data-lighting` on `<html>`). New "Beleuchtung" radio group rendered in `PreferencesPanel` listing all four profiles with their German labels and descriptions. Selection is propagated through `applyPreferences` to `LightingSetup.setProfile()`.
- **Free corner inspection.** Replaced `PAN_SAFETY_FACTOR = 0.92` (which forced an artificial 8 % margin) with `INSPECTION_OVERSCROLL = 0.5` (an additive overscroll past the artwork edge). At maximum zoom the viewport centre can now reach any corner of the painting plus a small breathing margin, satisfying the v0.03 acceptance criterion of *every detail reachable*.
- **Surface contract types.** Added `SurfaceProfile` (`'matte-canvas' | 'satin-canvas' | 'varnished-oil' | 'paper' | 'procedural-fallback'`) and `SurfacePhysics` (`reliefScale?`, `parallaxDepthScale?`) to `src/config/artworks.ts`. Both are optional so existing artworks need no change. Reserved for future per-artwork tuning when scanned assets land.
- **Plan finalisation marker.** `plan.md` v0.03 section now reads "implemented" with an "Implementation Outcome" subsection documenting validation evidence, as-built deviations from the original plan, the issues found and fixed during implementation, and a per-slice summary. The original execution plan is retained verbatim below as the historical design record.

### Added (v0.03 plan finalized as execution plan)

- Replaced the v0.03 "planning status" header in `plan.md` with a full implementation-ready execution plan. Every slice now has exact file locations, type additions, method signatures, constant changes, shader injection tokens, GLSL code blocks, and rationale for each decision. A developer can open any target file and apply changes directly without interpreting architectural intent.
- The nine slices and their specific code targets:
  - **Slice 1 — Surface contract + fidelity**: `SurfaceProfile` and `SurfacePhysics` types added to `artworks.ts`; `uAlbedoOnly` uniform + `setAlbedoOnly()` added to `PaintingMaterial`; new quality preset fields `proceduralTileSize`, `parallaxEnabled`, `parallaxSteps`, `selfShadowEnabled`, `selfShadowSteps`.
  - **Slice 2 — Matte-first retune**: `clearcoat 0.04→0.0`, `specularIntensity 1.0→0.3`, `uLightGrazingBoost 0.6→0.25`; roughness procedural range shifted to `[140..240]`; specular blob peak `200→90`.
  - **Slice 3 — Resolution-aware procedural**: `generate()` gains `tileSize?` parameter; cache key extended; generators parametrised; `GalleryManager` passes `preset.proceduralTileSize`.
  - **Slice 4 — Parallax relief**: tangent computation added to `ArtworkMesh.makeArtworkGeometry`; steep parallax march injected before `map_fragment`; `pUV` variable shadows `vMapUv` for all map reads; gate: `PAINTING_USE_PARALLAX`.
  - **Slice 5 — Self-shadow**: short height-march along tangent-space key-light direction; `uKeyLightDir` uniform updated from `LightingSetup.getKeyLightWorldDir()` each frame; modulates `directDiffuse`/`directSpecular` only; gate: `PAINTING_USE_SELFSHADOW`.
  - **Slice 6 — Museum lighting**: `gallery-soft` key repositioned from `{x:-10,y:5,z:7}` (~68° from vertical) to `{x:-3,y:5,z:4}` (~45° from vertical, flattering + detail-revealing); `raking-inspection` key moved to near-horizontal `{x:-6,y:0,z:1.5}`; ambient reduced to 0.3; `displayIntent` field added to `LightProfile`; SpotLight target explicitly set to world origin.
  - **Slice 7 — Free inspection camera**: `PAN_SAFETY_FACTOR=0.92` removed; `INSPECTION_OVERSCROLL=0.5` replaces it; `getPanLimits` now uses `artworkEdge + overscroll` so every corner is reachable.
  - **Slice 8 — Performance hardening**: post-implementation tuning of parallax step counts and shadow step counts per preset.
  - **Slice 9 — Documentation handoff**: acceptance check completion, FINDINGS update with GPU profile and texture memory cost.

### Added (v0.03 planning)

- Expanded the v0.03 plan in `plan.md` into a more technical rendering architecture: modular artwork surface contracts, resolution-independent asset selection, preset-based shader tiers, museum-style display lighting, tangent-space parallax occlusion mapping strategy, direct-light self-shadow approximation, matte-first material retuning, and explicit module/file responsibilities.
- Reworked v0.03 findings in `FINDINGS.md` to document the current code-level constraints plus the researched lighting direction for gallery-display key placement, raking inspection light, motion-visible relief, modular asset swaps, effective texel-density handling, parallax-style relief, and self-shadowing.
- Updated `README.md` and `docs/HANDOFF.md` so the v0.03 summary and reviewer guidance now reflect the refined lighting architecture and acceptance criteria.

### Added (v0.02 implementation)

- **`PaintingMaterial`** (`src/materials/PaintingMaterial.ts`) — extends `MeshPhysicalMaterial` and combines native Three.js features (`map`, `normalMap`, `roughnessMap`, `specularIntensityMap`, `bumpMap`, `aoMap`) with a minimal `onBeforeCompile` injection that does tangent-space detail-normal blending, an explicit `perturbNormalArb` after-pass so `normalMap` and bump coexist correctly, and a grazing-light boost gated by `PAINTING_USE_GRAZING_BOOST`. Reduced-motion mode flattens the detail contribution via the `uReducedMotionScalar` uniform without corrupting the normal basis.
- **`ProceduralTextureFactory`** (`src/materials/ProceduralTextureFactory.ts`) — deterministic procedural generators for albedo, base normal, detail normal, height/bump, roughness, specular (with Gaussian varnish-pooling blobs), and AO maps. Outputs are `DataTexture` instances with mipmaps and `RepeatWrapping`.
- **`PaintingTextureSet`** contract (`src/materials/PaintingTextureSet.ts`) — typed map roles, colour-space hints, and resolved-texture shape. `Artwork.textureSet?` is now optional metadata on every artwork.
- **Role-aware `TextureManager`** (`src/gallery/TextureManager.ts`) — `loadForRole(url, role)` correctly sets `LinearSRGBColorSpace` for non-albedo maps and applies a per-preset anisotropy divisor; `preloadTextureSet(set)` loads a full `PaintingTextureSet` in parallel. Later audit hardening also reapplies anisotropy caps to already-cached textures when the preset changes.
- **`LightProfile` system** (`src/lighting/LightProfile.ts`) — four named profiles: `gallery-soft` (default, animated), `raking-inspection` (reveals canvas relief, still), `museum-neutral` (5500 K dual-key, still), `dramatic-demo` (warm-cool contrast, animated). Includes `kelvinToColor` Tanner-Helland approximation. `LightingSetup` reuses spotlight pool across profile switches.
- **`FrameBudgetMonitor`** (`src/utils/FrameBudgetMonitor.ts`) — rolling 60-frame window, EMA smoothing, cooldown for navigation/preset spikes, clamps pathological frames at 250 ms so tab-switches do not poison the rolling average.
- **`AdaptiveQualityController`** (`src/utils/AdaptiveQualityController.ts`) — one-way `high → balanced → battery` downgrade path with post-downgrade hold-off, ignores cooldown windows, and self-suspends as soon as the user makes a manual preset choice.
- **`RenderBackend` + external WebGPU probe module** (`src/rendering/RenderBackend.ts` + `public/webgpu-probe.js`) — opt-in (`?backend=webgpu` query or `localStorage.freyraum.backend = 'webgpu'`) experimental WebGPU adapter probe. Because the customer preview is built as a single IIFE for `file://`, the probe lives as a copied public ES module and is imported only at runtime; failures always fall back silently to WebGL. Returns a serializable probe-result shape independent of the browser's DOM WebGPU types.
- **Extended `QualityPreset`** (`src/config/quality.ts`) — adds `shaderVariant`, `normalStrength`, `detailNormalStrength`, `bumpStrength`, `specularStrength`, `anisotropyDivisor`, `aoEnabled`, `grazingBoostEnabled`, `detailNormalEnabled` fields. Existing presets (`high`, `balanced`, `battery`) populate all fields with non-breaking defaults.
- **Aspect-ratio-aware detail tiling** — `PaintingMaterial.applyTextures(textures, tilingPerWorldUnit, preset)` receives a per-artwork `uDetailTiling` derived from the artwork's world-space dimensions, so canvas weave stays at uniform physical density on portrait, square, landscape, and ultrawide artworks (no stretched weave on 7:3 ultrawide).
- **`uv1` AO support** — `ArtworkMesh.makeArtworkGeometry` clones `uv` into `uv1` after `PlaneGeometry` construction so Three.js ≥ 0.152's `aoMap` path works.
- **Lifecycle guardrails** — `GalleryManager.showArtwork` is async with an `artworkLoadToken` counter so rapid navigation cannot apply a stale texture set. Adaptive controller automatically suspends when the user changes the preset manually.

### Changed (v0.02)

- `ArtworkMesh` now owns a `PaintingMaterial` instead of an inline `MeshPhysicalMaterial`. The inline async normal-texture load from `CanvasMaterial.loadNormalTexture` is replaced by the procedural factory applying a fresh, deterministic per-artwork normal map.
- `GalleryManager` constructor now accepts an optional `ProceduralTextureFactory` (defaults to a new instance) and exposes `proceduralFactory` for shutdown disposal.
- `main.ts` now wires `FrameBudgetMonitor`, `AdaptiveQualityController`, and the WebGPU probe into the boot path. The animation loop samples the frame budget every frame and feeds adaptive decisions back through `preferences.setQuality(...)` so the UI stays consistent. A dedicated `adaptiveQualityWriteInFlight` guard now prevents the controller from suspending itself on its own automatic downgrade.
- `LightingSetup` constructor signature accepts an optional `LightProfileId`. The default profile reproduces v0.01 visuals.
- Quality-preset changes now rebuild the currently displayed artwork's full resolved map set immediately, so switching to `battery` really removes detail-normal / height / roughness / specular / AO work from the active material instead of only affecting the next navigation.

### Removed (v0.02)

- The lazy `CanvasMaterial.loadNormalTexture()` call from `ArtworkMesh`. Procedural normal maps are now generated synchronously by `ProceduralTextureFactory.generate(id, 'normal')`, eliminating a small async race during artwork construction. `CanvasMaterial` is still used for the frame material and may be retired in a future pass.

### Earlier "Unreleased" entries (v0.02 planning, kept for traceability)

- Replaced the v0.02 high-level plan in `plan.md` with a code-grounded final implementation plan: exact TypeScript interfaces for `PaintingTextureSet`, `PaintingMaterial`, `LightProfile`, `FrameBudgetMonitor`, `RenderBackend`, and `WebGPUPrototype`; GLSL injection patterns for Three.js 0.166; procedural texture generation algorithms; `QualityPreset` field additions; and changes to `ArtworkMesh`, `TextureManager`, `GalleryManager`, `LightingSetup`, and `main.ts`.
- Updated `FINDINGS.md` with codebase analysis findings from the v0.02 planning pass.
- Updated `docs/HANDOFF.md` with v0.02 shader controls, light profile descriptions, WebGPU probe instructions, and benchmark procedure.
- Completed a final v0.02 documentation audit: corrected shader-space and bump/specular implementation guidance, added async-load/disposal guardrails, added a validation matrix and risk register, and clarified WebGPU/debug-chunk boundaries.

- Structured artwork metadata model (`Artwork.id`, `year`, `medium`, `dimensions`, `alt`, `credit`, `tags`) in `src/config/artworks.ts` to prepare for future CMS integration
- `PreferencesStore` (`src/utils/preferences.ts`) with reduced-motion and high-contrast modes plus quality-preset persistence in `localStorage`
- Quality preset definitions (`src/config/quality.ts`) for `high` / `balanced` / `battery` modes, applied to renderer pixel ratio, bloom, shadows, and artwork geometry segments
- WebGL availability detection (`src/utils/webgl.ts`) and localized `FallbackScreen` UI component shown when WebGL or the renderer cannot initialize
- `ZoomControls` UI component (zoom in / out / reset) with ARIA labels and tooltips
- `FullscreenButton` UI component using the Fullscreen API with `aria-pressed` syncing on browser-initiated exits
- `PreferencesPanel` popover-style settings dialog with accessible toggles (reduced motion, high contrast) and a radio group for quality presets
- Public `GalleryManager.resetView()` and `setReducedMotion()` so UI and preferences can drive gallery behavior directly
- Keyboard shortcuts in `KeyboardNav`: `+` / `-` zoom, `0` or `R` reset view, `F` fullscreen
- Customer handoff documentation: `docs/HANDOFF.md` plus self-contained SVG architecture diagram at `docs/assets/architecture.svg`
- Info panel now displays year, medium, and credit fields from the structured metadata model

### Changed

- Timeline thumbnails are real `<button>` elements with a roving tabindex; Arrow / Home / End keys navigate, Enter / Space activate
- Timeline thumbnails reserve their artwork's intrinsic aspect ratio inside a fixed frame and use a shimmer skeleton until the image finishes loading, eliminating layout shift
- Renderer, post-processing, lighting, and artwork mesh now accept a `QualityPreset` and expose `applyPreset()` so quality switches at runtime
- SCSS rebuilt as a small design system: design tokens, universal `:focus-visible` ring, `data-motion="reduced"` and `data-contrast="high"` themes, presentation-mode chrome dimming, and responsive adjustments for narrow viewports
- Info panel now uses semantic `<h1>` plus meta and credit lines, with `aria-live="polite"` for artwork change announcements

### Fixed

- Navigation slide-in animation is suppressed in reduced-motion mode so users no longer see large positional swings on artwork change
- Spotlight subtle animation freezes when reduced motion is active, avoiding ambient motion during inspection

## v0.01 - 2026-05-17

### Added

- shared texture sizing helper for consistent image fitting
- documentation baseline files: plan, changelog, findings, and documentation rules
- dynamic zoom and pan safety calculations based on artwork size and camera framing
- touch panning while zoomed in

### Changed

- main artwork zoom now stops before the camera can move unrealistically through the artwork plane
- pan limits now respond to artwork aspect ratio, viewport size, and zoom level
- hover rotation remains available across zoom levels with reduced intensity during close inspection
- side preview panels now preserve artwork aspect ratio instead of stretching
- README now documents controls and repository documentation expectations

### Fixed

- users could previously zoom so deep that the view could move into invalid inspection space
- portrait artworks previously hit vertical inspection limits too early because pan limits were hardcoded
- inactive side preview artworks were stretched by fixed panel geometry

## v0.00 - 2026-05-17

### Added

- one-click root launcher for local customer preview
- committed `customer-preview/` static output
- separate Vite `app.html` development entry
- local preview build pipeline and preview HTML generator
- offline-safe embedded placeholder artworks and procedural normal texture

### Fixed

- blank screen when opening the downloaded repository locally via `index.html`
