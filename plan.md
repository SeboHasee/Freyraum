# FREYRAUM Plan
> Latest markdown audit: 2026-09-04 (v1.12 full conversation documentation sync).

## Implemented — Center side works between doorway and corner (v1.14)

- [x] Use the supplied post-v1.13 screenshot as the placement reference.
- [x] Correct the wrong movement direction from 65%/35% to mirrored 55%/45%.
- [x] Restore the 4 m front-corner full-body guard.
- [x] Synchronize authored, fallback, test, and generated-preview output.
- [ ] Obtain a post-v1.14 screenshot for final visual acceptance.

## Superseded — Move side works away from doorways (v1.13)

- [x] Confirm the latest screenshot contains four works in the 2+1+1 layout.
- [x] Move left/right works from 56%/44% to mirrored 65%/35% positions.
- [x] Apply the same positions to authored slots and runtime fallback remounting.
- [x] Retain full-body doorway validation and a 3 m front-corner guard.
- [x] Update deterministic geometry expectations and generated preview output.
- [x] Post-fix screenshot received; it disproved the placement and reopened work.

## Active — Reconcile customer screenshot with four-work runtime (v1.12)

> **Status update:** a later screenshot confirms four visible works. The
> artifact-count mismatch is no longer reproduced; side-wall visual acceptance
> remains open pending a screenshot of the v1.13 coordinates.

### Required evidence

1. Identify whether the screenshot came from `customer-preview/app.html`, Vite
   dev/build, or deployed GitHub Pages.
2. Preserve the exact generated `customer-artworks.js`, injected
   `museum-hub.json`, artwork manifest, route/query, and commit/build identifier.
3. Export hub diagnostics for active page index, resolved page count, slot IDs,
   artwork IDs, wall IDs, placement anchors, and page-group visibility.
4. Capture the primary-camera state from that same artifact after any fix.

### Acceptance

- At most four visible/selectable works in a room (2 front + 1 left + 1 right).
- Only the active page group is visible.
- Side works remain parallel to their walls, outside doorway/corner clearance,
  and visually credible from the primary camera.
- DOM interaction quads match the rendered mounted faces.
- Customer screenshot approval is required in addition to automated geometry,
  build, resilience, performance, documentation, secret, and security checks.

### Tooling boundary

If browser/image tooling is unavailable in a session, report that limitation
without attributing it to account budget. Continue repository analysis, but keep
visual acceptance open until an actual screenshot can be inspected.

## Implemented — Balanced side-wall placement (v1.11, 2026-09-04)

> **Status update:** Side-wall works are centered within the usable wall segment
> between the hallway opening and the front-wall corner.

### As-built placement

- Left wall: 56% along its rear-to-front U axis.
- Right wall: 44% along its front-to-rear U axis.
- Artwork bounds retain at least 1.25 m from the doorway and 4.00 m from the
  relevant front-wall corner.
- Existing size, centerline, body depth, mounting gap, and wall-parallel
  orientation remain unchanged.

## Implemented — Side-wall front-corner setback (v1.10, 2026-09-04)

> **Status update:** Side-wall works now sit toward the viewer rather than
> visually entering the perpendicular front wall.

### As-built placement

- Left wall: 48% along its rear-to-front U axis.
- Right wall: 52% along its front-to-rear U axis.
- Both retain the existing optical centerlines, 1.45 m height, 22 mm body, and
  2 mm wall-to-back clearance.
- Bounds retain at least 4.50 m from the relevant front-wall corner, alongside
  the existing doorway and general wall-edge checks.

## Implemented — Realistic room density (v1.09, 2026-09-03)

> **Status update:** Each virtual museum room now contains at most four works.
> Overflow creates additional rooms instead of crowding perpendicular walls at
> their shared corners.

### 1. Room composition

- Two front-wall works at 30% and 70%.
- One left-wall work at 56%, balanced between its doorway and front corner.
- One right-wall work at 44%, balanced between its doorway and front corner.
- Front works use a 2.32 m optical centerline; side works use 2.30 m/2.28 m.
- Physical heights are 1.40–1.62 m with at least 1.50 m lower-edge clearance.

### 2. Pagination

- `slotsPerPage` is four in both built-in and shipping configuration.
- The fifth artwork starts a new virtual room page.
- Every overflow room reuses the same tested 2+1+1 placement template.
- Spacing and overlap checks are scoped to the room page currently represented.
- Older six-slot configurations are clamped and reflowed without losing explicit
  artwork mappings.
- Every migrated batch, including room one, is remounted through the 2+1+1
  template, then page indices are normalized for navigation.

### 3. Preserved behavior

Wall-parallel U/V/N mounting, 22 mm bodies, 2 mm mounting gaps, source aspect
ratios, exact-ID selection, pointer/touch/keyboard interaction, and gallery
navigation remain unchanged.

## Implemented — Optical hub artwork alignment (v1.08, 2026-09-03)

> **Status update:** The primary-camera exhibition now uses wall-specific optical
> centerlines, smaller museum-scale works, broader side-wall distribution, and
> only physical edge-cast contact shadows.

### 1. As-built optical composition

- Front: 29%/71%, 2.02 m centerline, 1.72 m/1.62 m heights.
- Left: 53%/78%, 2.10 m centerline, 1.45 m/1.60 m heights.
- Right: 22%/49%, 2.08 m centerline, 1.60 m/1.45 m heights.
- Width remains derived from each source aspect ratio.
- The composition retains at least 1.15 m physical floor clearance, 20 px
  projected floor clearance, 0.65 m corner clearance, and 0.50 m pair spacing.

### 2. Physical contact

- The 22 mm body and 2 mm wall-to-back clearance remain unchanged.
- The separate blurred contact card is removed; the body supplies edge depth and
  participates in the existing architectural shadow map.
- Rendering and DOM interaction continue to share the fitted mounted front face.

### 3. Preserved boundaries

Architecture, camera, lighting, materials, post-processing, artwork imagery,
wall-parallel orientation, selection, paging, and gallery navigation are unchanged.

## Implemented — Curated hub exhibition composition (v1.07, 2026-09-03)

> **Status update:** The wall-relative mounting architecture now uses a higher
> professional viewing line, role-specific physical sizes, and tighter wall
> contact so the exhibition fills the architecture without reading as cards.

### 1. As-built composition

- Front pair: 28% and 72% along the 9 m front wall, at 2.25 m and 2.05 m high.
- Left pair: 58.5% and 84% along the left wall U axis, at 1.75 m and 2.00 m high.
- Right pair: 16% and 41.5%, exactly mirroring the left wall.
- Every work shares a 1.90 m visual centerline.
- Artwork width remains derived from source aspect ratio.
- Explicit curator sizes remain authoritative; unmatched automatic placements
  move to an overflow page when an unusual aspect would violate the 0.50 m gap.

### 2. Physical installation

- Mounted bodies are 22 mm deep.
- Wall-to-back clearance is 2 mm, and the renderer derives the front face from
  clearance plus full body depth.
- Contact cards remain behind the body but now extend only enough to reinforce
  edge contact rather than reading as a separate floating panel.

### 3. Preserved boundaries

The existing U/V/N transform, source-aspect scaling, exact-ID interaction,
pagination, hub-to-gallery transition, architecture, camera, materials, lighting,
and post-processing remain authoritative.

## Implemented — Wall-relative hub artwork mounting (v1.06, 2026-09-03)

> **Status update:** All hero-room artwork transforms now derive from one
> validated wall U/V/N frame. The shipping configuration authors only curator
> controls, physical backs clear their walls, and interaction follows the
> mounted front face.

### 1. As-built placement contract

1. `horizontalPosition` is normalized distance along wall U.
2. `centerHeight` is the visual center above the wall origin in metres.
3. `physicalHeight` sets uniform scale; width is always height multiplied by the
   source artwork aspect ratio.
4. `mountingGap` is wall-to-back clearance, not front-plane offset.
5. Runtime derives metric anchor and legacy center/UV aliases. Older v1–v4
   configurations retain their migration path.

### 2. Curated hero composition

- Front pair: 28% and 72% along the 9 m front wall.
- Left pair: 60% and 85% along the left wall U axis.
- Right pair: 15% and 40%, exactly mirroring the left wall.
- Every work uses a 1.55 m centerline, 1.82 m physical height, 4 cm mounted-body
  depth, and 6 mm wall-to-back clearance.
- Existing safe regions, hanging band, doorway clearance, exact artwork IDs, and
  pagination remain authoritative.

### 3. Shared transform and interaction

- The mounting frame normalizes wall U/V, rejects non-orthogonal axes, derives
  inward N as U×V, and returns wall/back/front centers plus both face quads.
- `HubRoomRenderer` uses the frame directly; no camera-facing rotation exists.
- `MainMuseumHub` projects the frame's mounted front face, keeping DOM click,
  keyboard, touch, selection, and gallery transition targets aligned.
- Deterministic validation covers inward orientation, parallelism, clearance,
  depth, aspect, boundaries, doorways, pair spacing, and exact front-face
  projection.

### 4. Preserved boundaries

Museum architecture, camera, materials, lighting, post-processing, artwork
textures/content, and interactive-gallery navigation are unchanged.

## Implemented — WebGL startup resilience and 2D museum (v1.05, 2026-09-03)

> **Status update:** Renderer capability is now proven by the real renderer,
> failed contexts are released, hub GPU failure recovers locally, and complete
> customer artwork content remains accessible when immersive 3D cannot start.

### 1. As-built scope

1. Preferred, compatibility, and battery renderer attempts replace the boolean
   preflight; unsuccessful partial contexts are explicitly lost.
2. Compatibility modes use DPR 1 and disable shadow allocation.
3. Hub renderer creation has a local recovery boundary and nullable lifecycle;
   the existing DOM projection, paging, selection, keyboard, and swipe paths
   remain active with visible artwork imagery.
4. Fatal renderer recovery provides a responsive 2D artwork collection, accurate
   failure copy, diagnostic-only technical detail, and a controlled retry.
5. Unrelated startup failures use their own category and never claim that WebGL
   is absent.
6. Stored quality choices remain authoritative; constrained first runs use the
   battery preset and skip non-active shader-variant compilation.
7. Local preview startup has no external-font dependency and names missing local
   bundle files directly.
8. The removed probe bounds runtime context pressure to the two real renderers.
   Route-triggered force-loss was deliberately rejected as higher-risk than the
   existing stable context-restoration and texture lifecycle.

### 2. Support boundary

- Three-dimensional gallery rendering requires a working WebGL 2 implementation.
- Browser brand alone does not determine support.
- Museum content remains readable and navigable without immersive rendering.

## Implemented — Architectural lighting topology pass (v1.04, 2026-09-02)

> **Status update:** The hub now derives room depth from explicitly room-facing
> finite area sources, low non-occluded fill, and selective architectural
> participation in the existing single shadow map rather than procedural surface
> gradients or fullscreen ambient occlusion.

### 1. As-built scope

1. Two cove sources and one clerestory source explicitly face downward and create
   local wall/floor response with finite-area attenuation.
2. Hemisphere and sky-PMREM energy are secondary to local/direct illumination;
   architectural ACES exposure remains fixed.
3. Ceiling aperture, cove/clerestory returns, skylight steel, and doorway returns
   cast through the existing one directional shadow map.
4. Hub plaster and ceiling are smooth map-free PBR finishes; the pale floor keeps
   a distinct satin response without procedural color or normal modulation.
5. The floor gap is narrower and recessed, doorway plaster is no longer relied
   upon as a black opening, and artwork uses a tight rounded contact card behind
   its existing 4 cm shadow-casting body.
6. High retains its downscaled on-demand planar floor reflection. Balanced uses
   cached environment sheen; battery keeps reflection and local area lights off.
7. Renderer diagnostics expose light directions and energy plus the bounded GPU
   resource snapshot used for performance review.
8. Fullscreen AO was deliberately not added after the geometry/light correction.

### 2. Performance boundaries

- One existing quality-gated shadow map remains authoritative.
- One non-shadowing area source was added; balanced removes one reflection pass.
- Procedural hub surface fragment work was removed.
- No new dependency, external asset, continuous loop, SSAO, GTAO, bloom, SSR, or
  additional shadow map was introduced.

### 3. Validation

- `npm run import:artworks`
- `npm run lint`
- `npm run build:typecheck`
- `npm run build`
- `npm run validate:museum-hub`
- `npm run validate:museum-hub:visual`
- `npm run test:frame-budget`
- `npm run docs:check-config-authority`

## Implemented — Procedural skylight and PBR hub surfaces (v1.03, 2026-09-02)

> **Status update:** The raised hub clerestory now opens to a static atmospheric
> sky through pitched glazing and instanced steel rafters. Its visible daylight,
> cached environment response, architectural tone mapping, and subtle PBR
> surfaces form one coherent render path.

### 1. As-built scope

1. A local procedural atmosphere replaces the flat clerestory cap; battery uses
   a reduced gradient sphere and no environment generation.
2. Two pitched physical-glass planes, a ridge, and eighteen instanced rafter
   segments form the skylight without downloaded assets.
3. The hub PMREM is generated from the same sky model used in the visible scene.
4. ACES tone mapping is limited to architectural materials; artwork and contact
   shadows remain explicitly untone-mapped.
5. Hub wall, ceiling, and floor materials use shared, non-repeating world-space
   micro-normal and roughness response. Pale floor variation remains restrained.
6. Perimeter diffusers are emissive PBR surfaces, area lights remain secondary,
   and the sole directional key retains quality-gated shadows.
7. The reflection target renders in linear space without tone mapping and blends
   at reduced high/balanced strengths.

### 2. Performance boundaries

- Static mutation-driven rendering remains unchanged.
- No downloaded textures, new dependencies, extra shadow maps, fullscreen
  passes, SSAO, SSR, bloom, or animation were added.
- Battery omits area lights, PMREM, surface-detail shader work, shadows, and
  planar reflection.

### 3. Validation

- `npm run import:artworks`
- `npm run lint`
- `npm run build:typecheck`
- `npm run build`
- `npm run validate:museum-hub`
- `npm run test:frame-budget`
- `npm run docs:check-config-authority`

## Implemented — Main Museum Hub architectural redesign (v1.02, 2026-09-02)

> **Status update:** The hub is now a tall, elongated daylit hall rather than a
> compact square room. Long perimeter luminaires, a raised central clerestory,
> neutral near-white walls, and stronger perspective establish the architectural
> character before surface micro-detail.

### 1. As-built scope

1. The authoritative room is `9 × 12 × 5.2 m`; its camera is positioned at
   `(0, 1.72, 9)`, targets the raised architecture, and uses a 48° vertical FOV.
2. All calibrated wall quads, safe regions, metric transforms, doorway
   exclusions, hanging bands, slot anchors, and normalized UVs are synchronized.
3. Two longitudinal perimeter channels replace the cross-room panels.
4. A raised 0.82 m central clerestory uses simple shared-material planes and one
   nine-instance rib mesh.
5. The hub palette is neutral daylight: clean near-white plaster, a pale grey
   mineral floor, cool-white luminaires, and subdued doorway recesses.
6. Artwork imagery remains unlit. Mounted heights increase only as needed to
   remain legible in the expanded room, while physical depth and exact IDs stay
   unchanged.
7. Camera navigation, route behavior, gallery rendering, artwork assets,
   reflection tiers, and on-demand rendering remain unchanged.

### 2. Performance boundaries

- No new dependencies, textures, shadow maps, fullscreen passes, bloom, SSAO,
  SSR, or animation loops.
- Clerestory ribs use one instanced draw call.
- Existing non-shadowing area lights remain high/balanced-only.
- Battery retains the directional fallback and disables hub reflections/shadows.

### 3. Validation

- `npm run import:artworks`
- `npm run lint`
- `npm run build:typecheck`
- `npm run build`
- `npm run validate:museum-hub`
- `npm run test:frame-budget`
- `npm run docs:check-config-authority`

## Implemented — Main Museum Hub architectural lighting polish (v1.01, 2026-09-02)

> **Status update:** High and balanced hub quality now connect the room's soft
> gradients to two broad recessed ceiling fixtures. Artwork mounting shadows
> are tighter, doorway recesses retain visible depth, and battery quality keeps
> the prior inexpensive light path.

### 1. As-built scope

1. Two non-shadowing rectangular area lights match the room's cove positions
   and dimensions on high/balanced quality.
2. The warm hemisphere wash and directional shadow key remain at reduced energy.
   Battery hides the area lights and enables one restrained directional fill.
3. Ceiling openings are broadened to 0.48 m while retaining their recessed
   returns and low-key diffuser surfaces.
4. Artwork image planes remain unlit and color-faithful. Existing mounted bodies
   retain 4 cm depth; their shared approximate contact shadow is reduced from
   `0.34` to `0.22` opacity and from `1.22×` to `1.10×` extent.
5. Doorway pockets retain their 1.15 m geometry with lighter warm-grey plaster.
6. Camera, navigation, artwork assets, gallery renderer, tone mapping, floor
   reflection hierarchy, and on-demand rendering are unchanged.

### 2. Performance boundaries

- No additional shadow maps, texture maps, fullscreen effects, render passes,
  per-artwork lights, or animation loops.
- Area lights are non-shadowing and omitted from the battery-quality light set.
- The hub still renders only after state mutations.
- One existing directional shadow caster remains quality-gated.

### 3. Validation

- `npm run import:artworks`
- `npm run lint`
- `npm run build:typecheck`
- `npm run build`
- `npm run validate:museum-hub`
- `npm run test:frame-budget`
- `npm run docs:check-config-authority`

## Implemented — Main Museum Hub environment polish (v1.00, 2026-09-02)

> **Status update:** The hub-only architectural profile now presents smooth
> warm off-white plaster, a calm map-free ceiling, and a restrained satin floor.
> The existing low-cost light and reflection architecture is retained with
> softer, fixture-coherent calibration.

### 1. As-built scope

1. Hub walls use `0.88` roughness, no detail maps, no procedural color
   modulation, and only `0.004` long-period roughness variation.
2. Hub ceilings and floors no longer bind repeating architectural detail maps.
   The interactive gallery keeps its existing tactile mapped profile.
3. The floor retains quality-gated planar/IBL/off behavior with reduced planar
   strength rather than adding a new reflection technique.
4. Existing hemisphere plus two-direction lighting is warmed to agree with the
   recessed ceiling diffusers; the high key remains the only shadow caster.
5. Camera, room geometry, route behavior, artwork imagery/mounting, interaction,
   loading, and on-demand rendering are unchanged.

### 2. Performance and acceptance guardrails

- No added dependencies, textures, lights, draw calls, shadow maps, passes, or
  animation loops.
- Hub wall, ceiling, and floor avoid repeating detail maps.
- Artwork remains unlit and color-faithful while mounted bodies and existing
  contact shadows preserve physical separation.
- Deterministic validation protects warm wall response, material roughness,
  restrained light energy, and single-profile surface ownership.

### 3. Validation

- `npm run import:artworks`
- `npm run lint`
- `npm run build:typecheck`
- `npm run build`
- `npm run validate:museum-hub`
- `npm run test:frame-budget`
- `npm run docs:check-config-authority`

## Implemented — Main Museum Hub plaster + lighting refinement (v0.99, 2026-09-02)

> **Status update:** The Main Museum Hub keeps its calibrated room, camera,
> artwork-slot, on-demand rendering, floor-reflection, and quality-preset
> architecture. Its walls now opt into a calm non-repeating world-space plaster
> response, while the close interactive gallery retains its mapped tactile
> plaster. The hub light rig is rebalanced toward a broad neutral wash with
> restrained directional modeling and one shadow caster.

### 1. As-built scope

1. `src/materials/ArchitecturalSurfaceFactory.ts` now accepts an explicit
   `gallery` or `hub` profile.
2. The gallery profile remains the default and preserves the v0.98 plaster
   normal/roughness maps.
3. The hub profile removes repeating wall maps and adds a shared, static
   world-space color/roughness response with periods larger than the room and
   deliberately sub-perceptual amplitudes.
4. `src/hub/HubRoomRenderer.ts` opts into the hub profile and exposes one
   deterministic low-energy lighting contract used by the room.
5. Room geometry, camera calibration, slots, artwork loading, contact shadows,
   environment map, floor reflection, and route transitions are unchanged.

### 2. Performance and acceptance guardrails

- No additional draw calls, textures, lights, render passes, or animation loop.
- One shared hub wall shader program and one preset-gated shadow caster.
- No repeating wall normal/roughness maps in the hub.
- Hub variation remains below visible-noise thresholds and spans beyond the
  seven-metre room envelope.
- Gallery wall texture remains visible but restrained.
- `scripts/test-museum-hub-geometry.mjs` guards the material split and hub light
  energy/placement.

### 3. Validation

- `npm run import:artworks`
- `npm run lint`
- `npm run build:typecheck`
- `npm run build`
- `npm run validate:museum-hub`
- `npm run test:frame-budget`
- `npm run docs:check-config-authority`

## Implemented — Wall surface realism + softer artwork-view lighting (v0.98, 2026-09-02)

> **Status update:** The interactive single-artwork route now keeps the neutral
> grey wall family from v0.96/v0.97, but no longer presents it as a flat bright
> cream-like surface. `src/materials/ArchitecturalSurfaceFactory.ts` restores
> visible matte plaster texture with calmer ceiling response, while
> `src/lighting/LightProfile.ts` lowers the close-view lighting energy and
> `src/materials/PaintingMaterial.ts` lowers the matte sheen floor so bright
> artworks keep more natural contrast instead of washing out. Focused guardrails
> live in `/home/runner/work/Freyraum/Freyraum/scripts/test-museum-hub-geometry.mjs`,
> and validation is recorded in `CHANGELOG.md`.

### 1. Current-state diagnosis

1. The problem is in the **interactive single-artwork gallery route**, not the
   museum-hub artwork recovery path. The relevant implementation area is the
   shared architectural surface factory plus the fixed gallery-lighting profile
   that illuminates the close artwork view.
2. The current wall material was intentionally flattened during v0.97 to remove
   the warm/amber cast:
   - `src/materials/ArchitecturalSurfaceFactory.ts` currently keeps the wall at
     very high roughness with low plaster normal intensity;
   - the plaster detail maps still exist, but they are now visually restrained
     enough that the wall can read too smooth in the close artwork route.
3. The current artwork-view lighting is also still strong for saturated images:
   - `src/lighting/LightProfile.ts` uses one fixed neutral-gallery profile with
     a fairly bright ambient fill plus two direct keys;
   - `src/materials/PaintingMaterial.ts`, `src/config/presentation.ts`, and
     `src/config/quality.ts` can still amplify that light through specular,
     grazing, clearcoat, and roughness interactions depending on presentation
     and quality preset.
4. Because `src/materials/ArchitecturalSurfaceFactory.ts` is reused by both the
   interactive gallery stage and the museum hub, wall-texture changes must keep
   both routes in the same neutral-grey family even if the final tuning becomes
   slightly gallery-biased.

### 2. Scope and guardrails

- **In scope**
  - Increase wall surface realism so the background reads as intentional
    concrete/plaster rather than a flat painted gradient.
  - Reduce artwork washout in the single-artwork view so bright passages keep
    detail and the overall scene feels softer and more natural.
  - Add enough diagnostics/regression protection that future wall/lighting
    retunes do not swing back to amber walls, blown-out artwork highlights, or
    a featureless wall.
- **Out of scope**
  - No new artwork source-loading or blank-artwork recovery work.
  - No new lighting-profile UI or preference surface.
  - No reintroduction of the old theatrical warm spotlight look.
  - No regressions to the existing inspection pan / wall-clearance safety rules.

### 3. As-built implementation

#### A. Rebuild the wall-material balance around visible but restrained texture

1. `src/materials/ArchitecturalSurfaceFactory.ts` was retuned to restore more
   perceptible wall micro/mid-scale breakup without making the wall glossy or
   noisy.
2. The plaster roughness map and normal response were increased together so the
   wall gets clearer tactile variation from roughness breakup plus subtle height
   relief rather than from warmer light.
3. The ceiling remains calmer than the wall, and the neutral floor/trim/cove
   palette was preserved so the added wall texture does not pull the room back
   toward beige.
4. The shared architectural surface factory remained sufficient; no new
   gallery-vs-hub material split was required for this pass.

#### B. Soften the artwork-view lighting before changing artwork color pipelines

1. `src/lighting/LightProfile.ts` was rebalanced so the wall remains neutral
   while the artwork plane is no longer overlit.
2. Washout was reduced by lowering ambient/direct light pressure while keeping
   the existing neutral temperature direction and balanced two-key composition.
3. `src/materials/PaintingMaterial.ts` now keeps matte presentations genuinely
   matte through a lower base specular fallback, while satin/glazed
   presentations still preserve more sheen than matte works.
4. The current mounted-body separation and wall-shadow cue from
   `src/gallery/ArtworkMesh.ts` remain unchanged; the fix improves picture
   lighting without reintroducing contact-shadow artifacts on customer pixels.

#### C. Add proof that the tuning solved the right visual problem

1. `scripts/test-museum-hub-geometry.mjs` now asserts the softer lighting
   contract, visible-but-restrained wall texture, calmer ceiling response, and
   matte-vs-satin specular separation.
2. The existing visual-regression path remains the optional screenshot layer
   when the environment provides the required tooling, but the deterministic
   regression harness now captures the main structural guardrails for this pass.
3. The interactive gallery and hub remain in the same neutral-grey material
   family without reintroducing the earlier warm cast.

### 4. Acceptance criteria

- The single-artwork background wall reads as a neutral grey concrete/plaster
  surface with visible fine texture and roughness variation, not as a smooth
  cream wall.
- The artwork view no longer looks washed out: bright passages keep detail,
  saturated colours keep separation, and the overall light feels softer and more
  natural to the eye.
- The interactive gallery keeps the current neutral-grey wall family and does
  not regress to amber/orange.
- The hub remains visually compatible with the gallery rather than diverging
  into a separate wall language.
- Inspection pan/tilt safety remains intact.

### 5. Validation

- `npm run import:artworks`
- `npm run lint`
- `npm run build:typecheck`
- `npm run build`
- `npm run validate:museum-hub`
- `npm run test:frame-budget`
- `npm run docs:check-config-authority`
- plus explicit screenshot/manual review of the single-artwork route because the
  success criteria are strongly perceptual.

## Implemented — neutral gallery wall-lighting rebalance (v0.97, 2026-09-01)

> **Status update:** The remaining amber wall cast after the concrete-grey token
> retune is now removed at the lighting/material level. The fixed gallery light
> profile in `src/lighting/LightProfile.ts` is now a balanced neutral two-key
> setup instead of a single warm dramatic spot, `src/materials/ArchitecturalSurfaceFactory.ts`
> flattens the wall's plaster response, and `src/hub/HubRoomRenderer.ts` uses a
> matching neutral room-light mix. Focused guardrails live in
> `/home/runner/work/Freyraum/Freyraum/scripts/test-museum-hub-geometry.mjs`,
> and the tracked preview bundle has been rebuilt to keep local customer preview
> output in sync.

## Implemented — concrete-grey wall retune (v0.96, 2026-09-01)

> **Status update:** The app no longer ships the warmer off-white wall baseline
> that made the inspection background read beige/orange. The authoritative
> gallery/hub wall token is now the cooler concrete-grey `#C7CED4`, and the
> coupled architectural palette plus the fixed gallery light profile were
> tempered so the single-artwork view reads as modern grey without splitting the
> wall-color pipeline. Token reach and preview parity remain guarded by
> `/home/runner/work/Freyraum/Freyraum/scripts/test-museum-hub-geometry.mjs`
> and `/home/runner/work/Freyraum/Freyraum/scripts/visual-regression.mjs`.

## Implemented — single-artwork inspection retune (v0.95, 2026-09-01)

> **Status update:** The interactive gallery keeps the v0.94 wall-clearance
> safety rules, but no longer feels locked to the artwork edge. The front wall
> now sits farther back via `src/config/galleryPresentation.ts`, and
> `src/gallery/GalleryManager.ts` again allows a small bounded reveal margin
> using shared defaults from `src/gallery/inspectionSafety.ts`. The revealed
> wall remains the authoritative museum-grey token (`#D8DDDB`), and the focused
> regression coverage in
> `/home/runner/work/Freyraum/Freyraum/scripts/test-museum-hub-geometry.mjs`
> now proves both the restored close-inspection freedom and the retained
> wall-clearance clamp.

## Implemented — single-artwork inspection wall-clip fix (v0.94, 2026-09-01)

> **Status update:** The interactive gallery no longer lets close inspection
> drift or tilt into the front wall. `src/gallery/GalleryManager.ts` now stops
> inspection pan at the artwork edge, and the new
> `src/gallery/inspectionSafety.ts` clamps hover tilt against the real stage
> clearance using the active artwork size plus mounted-body depth from
> `src/gallery/ArtworkMesh.ts`. This keeps detailed inspection fully usable
> without revealing or intersecting the background wall plane. Focused
> regression coverage lives in
> `/home/runner/work/Freyraum/Freyraum/scripts/test-museum-hub-geometry.mjs`,
> and validation is recorded in `CHANGELOG.md`.

## Implemented — file:// local-preview blank-artwork recovery (v0.93, 2026-09-01)

> **Status update:** Root `/home/runner/work/Freyraum/Freyraum/index.html` keeps
> forwarding `location.search` and `location.hash` into
> `customer-preview/app.html`, and the shared visible-pixel proof/retry work
> from the earlier v0.93 slice remains in place. This final local-preview
> repair closes the still-visible blank hub planes by preferring the
> importer-provided embedded `webglImage` immediately when the offline
> `file://` museum hub would otherwise bind a local `file-url`, and by giving
> inline/data hub sources a longer load/decode window so built-in or embedded
> fallback art does not time out first. Regression coverage is extended in
> `/home/runner/work/Freyraum/Freyraum/scripts/test-museum-hub-geometry.mjs`,
> and validation — including explicit `file://` reproduction — is recorded in
> `CHANGELOG.md`.

### 1. Screenshot-backed diagnosis

1. The screenshot is the **museum hub** route
   (`src/hub/MainMuseumHub.ts` + `src/hub/HubRoomRenderer.ts`), not the
   interactive gallery.
2. Room shell, camera, wall ownership, mounted depth, contact shadows, and slot
   selection are all working. The yellow focus outline and six mounted planes
   prove that the hub geometry path is alive; the failure is not a missing room,
   broken camera, or missing slot mapping.
3. The planes in the screenshot are **flat blank panels**, not the current
   explicit placeholder signatures:
   - not `HubRoomRenderer.placeholderTexture(label)`, which would show the
     artwork title and border;
   - not the gallery’s branded FREYRAUM gradient fallback.
4. The checked-in repository currently tracks a two-artwork example
   (`Fraktal.png` / `Akt 27.png` on the front wall), but the screenshot shows a
   larger locally generated bundle with left/front/right-wall mappings. That
   local data difference matters, but the uniform “all planes blank” symptom
   still points to a **route-level visibility failure**, not one isolated bad
   artwork file.
5. Most likely failing boundary: **source selection succeeded far enough to
   mount a real artwork plane, but visible customer pixels did not survive the
   final compatibility/downscale → GPU upload → rendered-output path in the
   local `file://` preview.**

### 2. Current-source evidence behind that diagnosis

1. `/home/runner/work/Freyraum/Freyraum/index.html` is only a launcher. It
   redirects to `./customer-preview/app.html`, so the screenshot reflects the
   static local preview runtime, not the launcher page itself.
2. `/home/runner/work/Freyraum/Freyraum/scripts/import-artworks.mjs` still emits
   embedded `webglImage` data specifically to keep the offline/local WebGL path
   recoverable, and it stamps `customer-preview/app.html` script URLs with
   `?t=...` to avoid stale `file://` cache reads.
3. `MainMuseumHub.resolveSlotImage()` only retries the embedded `webglImage`
   candidate when the primary source fails during **request/decode**. A source
   that loads/decodes but still becomes blank after texture binding stays on the
   nominal “ready” path.
4. `HubRoomRenderer.upsertSlot()` binds the image texture once a decoded image
   exists. Its bounded visible-pixel probe is currently advisory-only: it can
   warn in verbose diagnostics, but it does not demote the slot to failure or
   trigger a fallback retry.
5. `MainMuseumHub.recordHubSourceToPixelOutcome()` and
   `TextureManager.recordAlbedoOutcome()` currently still record terminal
   `result: 'success'` on the happy path even when a verbose visible-pixel probe
   could prove that the bound texture did not produce the real artwork pixels.
6. The launcher currently drops `location.search` / `location.hash` when it
   redirects into `customer-preview/app.html`, which makes local support capture
   harder because `?debug=verbose&hubDebug=1` does not survive a root
   `index.html` launch.

### 3. Decision and first implementation-PR scope

- Fix the **local file-preview artwork visibility** problem first: the user must
  see the actual artwork texture on the wall instead of a blank grey plane.
- Keep importer-owned `image`, `webglImage`, `dimensions`, and
  `customer-artworks/museum-hub.json` semantics intact unless the failing path
  proves one of them is insufficient.
- Do **not** mask the issue with lighting, bloom, tone mapping, material, or
  geometry changes. The screenshot already shows that the room presentation is
  present; the missing piece is the artwork texture visibility.
- Keep the declared `image` asset authoritative for dev/server/Pages. Any
  offline-specific recovery must stay narrowly scoped to the proven local
  `file://` failure mode.

### 4. Planned implementation slices

1. **Make the local failure reproducible from the supported launcher path**
   - Forward `location.search` and `location.hash` from root `index.html` into
     `customer-preview/app.html` so local support/debug runs keep
     `?debug=verbose&hubDebug=1`.
   - Record explicit preview context in diagnostics: protocol, bundle id,
     winning candidate mode, and whether the bound source was a `file-url` or an
     embedded data fallback.
2. **Promote visible-pixel proof from advisory to authoritative**
   - If the bounded probe runs and fails, do not log terminal success for that
     candidate.
   - Classify the first failed stage as `gpu-upload` or
     `visible-pixel-probe`, not `success`.
   - Keep the expensive readback off normal served traffic unless it is required
     to recover the local preview path.
3. **Add one bounded post-upload recovery step before blank planes are shown**
   - When a decoded primary `file-url` candidate reaches a blank/no-visible-pixel
     outcome in the hub or gallery, retry the embedded `webglImage` candidate
     through the same compatibility/downscale path.
   - If that retry succeeds, record the file-based candidate as failed at the
     GPU-visible stage and the embedded candidate as the actual winner.
   - If both candidates fail, fall through to the existing truthful
     placeholder/fallback path.
4. **Keep file:// recovery shared and explicit**
   - Isolate the local-preview decision in shared helpers instead of drifting the
     hub and gallery into separate one-off fixes.
   - Do not make embedded data the primary source everywhere; keep the current
     declared-image contract for server-backed environments.
5. **Add regression coverage for the exact screenshot class**
   - Add a local-preview/file-URL validation path that opens
     `/home/runner/work/Freyraum/Freyraum/index.html` or
     `/home/runner/work/Freyraum/Freyraum/customer-preview/app.html`.
   - Assert that mapped hub artworks show visible customer pixels and never
     settle on blank untextured planes.
   - Include a fixture where the declared file-based source is present but the
     embedded fallback must rescue WebGL visibility.

### 5. Files likely to change in the implementation PR

- `/home/runner/work/Freyraum/Freyraum/index.html`
- `/home/runner/work/Freyraum/Freyraum/src/utils/sourceToPixelOutcome.ts`
- `/home/runner/work/Freyraum/Freyraum/src/utils/sourceToPixelProbe.ts`
- `/home/runner/work/Freyraum/Freyraum/src/utils/artworkImageSources.ts`
- `/home/runner/work/Freyraum/Freyraum/src/gallery/TextureManager.ts`
- `/home/runner/work/Freyraum/Freyraum/src/hub/MainMuseumHub.ts`
- `/home/runner/work/Freyraum/Freyraum/src/hub/HubRoomRenderer.ts`
- `/home/runner/work/Freyraum/Freyraum/scripts/visual-regression.mjs` and/or a
  focused local-preview validator
- `/home/runner/work/Freyraum/Freyraum/docs/QUERY_PARAMETERS.md`,
  `/home/runner/work/Freyraum/Freyraum/docs/CUSTOMER_PICTURE_GUIDE.md`,
  `/home/runner/work/Freyraum/Freyraum/FINDINGS.md`, and
  `/home/runner/work/Freyraum/Freyraum/CHANGELOG.md`

### 6. Acceptance criteria for the fix

- Opening `/home/runner/work/Freyraum/Freyraum/index.html` locally on a customer
  machine still launches the committed preview, but the wall artworks show the
  **real pictures** instead of blank grey planes.
- A route may not record terminal `source-to-pixel-outcome.result = 'success'`
  when the visible result is a blank plane.
- The fallback from file-based source to embedded `webglImage` is exercised only
  when the file-based candidate fails at the GPU-visible boundary or earlier.
- Dev/server/Pages rendering continues to prefer the declared `image` source.
- Implementation validation uses the repository’s existing command set:
  `npm run import:artworks`, `npm run lint`, `npm run build:typecheck`,
  `npm run build`, `npm run validate:museum-hub`,
  `npm run test:frame-budget`, and `npm run docs:check-config-authority`,
  plus an explicit local `file://` preview check.

## Implemented — Verified pixel-recovery plan for persistent grey artworks (v0.92, 2026-08-07)

> **Status update:** Phases 2 and 3 are implemented in runtime code. Both routes
> now record a shared, redacted `SourceToPixelOutcome` (`src/utils/sourceToPixelOutcome.ts`)
> naming the resolved candidate, timings, source/upload dimensions, and terminal
> result, and both routes apply a shared capability-aware downscale
> (`src/utils/textureUploadCompatibility.ts`) before any decoded image is bound
> to the GPU, using the live `renderer.capabilities.maxTextureSize` rather than
> a new quality-tier field. A bounded, verbose-mode-only GPU visible-pixel probe
> (`src/utils/sourceToPixelProbe.ts`) proves the bound texture renders non-empty
> pixels without ever reading back full image bytes. The current `Fraktal.png`
> and `Akt 27.png` importer setup (`customer-artworks/inbox/`,
> `customer-artworks/museum-hub.json`, `scripts/import-artworks.mjs`) was left
> untouched; no lighting, material, or `PaintingMaterial` change was made
> (Phase 4 remains future work, gated on this proof). `npm run lint`,
> `npm run build:typecheck`, `npm run build`, `npm run validate:museum-hub`,
> `npm run test:frame-budget`, and `npm run docs:check-config-authority` all
> passed. An automated code review of this change flagged one unrelated,
> pre-existing issue — `DestinationRouter.runTransition`'s rollback path
> re-enters the previous destination without re-running `prepare()` — which is
> out of scope for this pixel-recovery change and was intentionally left
> unmodified. See `FINDINGS.md § v0.92` for the as-built detail and validation
> log.

### What is known, and what is not

1. The checked-in current setup has two PNG inputs in
   `customer-artworks/inbox/`: `Fraktal.png` and `Akt 27.png`. Their normalized
   IDs (`fraktal`, `akt-27`) are the two active front-wall mappings in
   `customer-artworks/museum-hub.json`.
2. A hub title-bearing grey plane is not a lighting symptom. It is the explicit
   final state from `MainMuseumHub` after primary and embedded source candidates
   fail to load or decode, and `HubRoomRenderer.placeholderTexture()` is bound.
   A proportional FREYRAUM gradient in the gallery is similarly a deliberate
   `TextureManager` fallback.
3. The current branch resolves generated `./images/...` paths against the
   generated bundle script, retains an optional embedded `webglImage` retry, and
   validates that manifest image files reach `dist/images/`. Those checks prove
   packaging intent, not that the deployed browser decoded, uploaded, and drew
   the actual customer pixels.
4. The hub displays a source image through an unlit `MeshBasicMaterial`; changing
   gallery lighting, bloom, or `PaintingMaterial` cannot restore a hub
   placeholder. The interactive gallery has a separate material/colour pipeline
   that must be assessed only after its albedo source is proven present.

### Decision

Implement one shared **source-to-pixel outcome** for both routes. It must record
the selected candidate, request/decode dimensions and duration, compatibility
decision, GPU binding proof, and terminal result without exposing source bytes.
The selected candidate must be downscaled only when it exceeds the active
renderer/quality texture limit, then retried once through the existing embedded
fallback before a truthful placeholder is shown. This works with the existing
PNG importer setup; it does not require a new artwork format, manual manifest
editing, a dependency, or a lighting workaround.

### Implementation phases

#### Phase 0 — Reproduce with the current artwork bundle

1. Run the normal importer and retain the generated
   `customer-preview/customer-artworks.js`, `images/`, and
   `customer-artworks/last-import-report.txt` before changing any sources.
2. Exercise that same generated bundle in local `file://` preview, Vite
   development, and the Pages-base build. For each of `fraktal` and `akt-27`,
   capture the resolved primary URL, fallback availability, request result,
   decode result, natural dimensions, `MAX_TEXTURE_SIZE`, quality preset,
   browser/device, diagnostics export, Network evidence, and console errors.
3. Classify the visible state before choosing a repair: hub title placeholder,
   gallery generated gradient, source pixels that are merely too dark, or a
   decoded source that becomes grey only after WebGL binding.

**Exit criterion:** one first failing stage is recorded for a real current
artwork in the original failing environment. A screenshot, importer success, or
LoadingManager completion alone is not evidence.

**Status: not performed as a separate manual pass.** No headless-browser
capture across `file://`/Vite/Pages-base was run in this sandbox. Instead, the
Phase 2 `source-to-pixel-outcome` diagnostic (below) makes this reproduction
step available on demand in any real environment going forward, so a future
regression can be triaged without a bespoke investigation.

#### Phase 1 — Make the current importer output a verifiable asset contract

1. Preserve the v0.91 script-relative bundle envelope and legacy array fallback,
   but add a focused generated-bundle validator that checks every normalized
   artwork ID, declared source, fallback policy, and image file across preview,
   public, and built output.
2. Make importer/public-sync/build failures identify the artwork ID and expected
   file rather than allowing a runtime grey placeholder to be the first signal.
3. Add coverage for the actual two-artwork layout as well as synthetic
   primary-failure/fallback cases; do not rely only on data-URI fixtures.

**Acceptance criterion:** the generated current bundle maps `fraktal` and
`akt-27` to existing, decodable PNG files in all three supported delivery modes.

#### Phase 2 — Replace ambiguous success with shared source-to-pixel outcomes

1. Introduce a shared, redacted outcome contract for declared source, embedded
   fallback, compatibility downscale, final placeholder, and upload-suspect
   states. Include candidate type, resolved URL type, bundle ID, stage, elapsed
   time, source/upload dimensions, and renderer capability.
2. Change gallery texture loading so a generated texture cannot erase the
   original albedo failure before the explicit outcome is recorded.
3. Change hub candidate loading so request and decode timing belong to one
   candidate token; delayed events from an abandoned primary cannot settle the
   fallback attempt.
4. After texture initialization, add a bounded developer/CI source-to-pixel
   probe for the visible map binding. The probe must report only pass/fail and
   compact colour/size metadata, never customer image bytes or data URIs.

**Acceptance criterion:** each grey surface has one diagnostic record naming the
first failed stage, while a real current artwork has a recorded successful
source-to-pixel result in both routes.

**Status: implemented (v0.92).** `src/utils/sourceToPixelOutcome.ts` defines the
shared contract; `TextureManager.loadArtworkAlbedo`/`recordAlbedoOutcome`
(gallery) and `MainMuseumHub.resolveSlotImage`/`recordHubSourceToPixelOutcome`
(hub) record one terminal outcome per artwork naming the first failed stage on
failure, or full source-to-pixel proof on success. The bounded visible-pixel
probe (`src/utils/sourceToPixelProbe.ts`) runs through `HubRoomRenderer.upsertSlot`
and `TextureManager`'s verbose-mode probe call, gated to verbose diagnostics
mode so it never adds a GPU-stalling readback to default visitor traffic.
Candidate-token race safety (item 3) and the importer bundle validator
(Phase 1) were already covered by the v0.91 shared candidate resolution and
existing importer checks; no changes were needed there.

#### Phase 3 — Make decoded images compatible with the active device

1. Use the live renderer capability and an explicit quality-tier cap before
   committing an oversized source to GPU memory. Preserve the original texture
   when it fits.
2. For an oversize source, create one bounded derived raster with browser
   image-resize APIs and a feature-detected canvas fallback. Release temporary
   decode resources promptly and never upscale.
3. Apply the same compatibility policy to the hub and gallery, including the
   embedded fallback. A retry with identical over-limit bytes is not a recovery.

**Acceptance criterion:** an over-limit PNG produces either visible downscaled
customer pixels or a specific unsupported diagnostic, never an unexplained grey
plane.

**Status: implemented (v0.92).** `src/utils/textureUploadCompatibility.ts`
(`planTextureUploadFit`/`createCompatibleTextureImage`) computes the fit
against the live `renderer.capabilities.maxTextureSize`, draws one bounded
canvas downscale only when required, and never upscales. Both
`TextureManager.loadForRole` (gallery) and `HubRoomRenderer.imageTexture`
(hub) apply it — including on the embedded fallback candidate, since both
routes route every candidate through the same loader/texture path — before the
image is bound to the GPU, and log a `texture-downscaled`/`hub-slot-texture-downscaled`
diagnostic when a downscale was applied.

#### Phase 4 — Audit fidelity only after pixels are proven

1. Keep `SRGBColorSpace` for albedo and renderer output. Correct non-colour PBR
   data maps to the installed Three.js `NoColorSpace` contract, with a
   side-by-side visual baseline.
2. Use the existing raw-albedo debug path to compare source, unshaded albedo,
   and final gallery material output. Evaluate the currently disabled
   `albedoFidelityFill` only against that evidence; do not assign a brightness
   value or retune lights to hide an absent source.
3. Keep the hub artwork material unlit unless the new probe proves a bound
   source is not visible. Any hub room-light adjustment is a separate scene
   presentation decision, not an image-recovery fix.

**Acceptance criterion:** source pixels, raw albedo, and final output retain
recognizable colour and detail for the current PNGs; material work never turns a
missing image into a false success.

**Status: future work, intentionally not started.** This v0.92 change proves
and repairs the source→decode→GPU→visible-pixels path only. It applies no
lighting, material, or fidelity change. Phase 4 remains gated on live evidence
from the new outcome/probe records above.

### Verification and documentation gates

- `npm run import:artworks`, `npm run lint`, `npm run build:typecheck`,
  `npm run build`, `npm run validate:museum-hub`,
  `npm run test:frame-budget`, and `npm run docs:check-config-authority`.
- Focused importer and bundle checks for the current two PNGs, broken primary
  with working fallback, missing fallback, delayed decode, and oversized source.
- Visual capture across `file://`, Vite, Pages-base, desktop, and a constrained
  device/quality profile. A valid artwork may not show a hub placeholder or
  gallery generated fallback.
- Update `FINDINGS.md`, `README.md`, `CHANGELOG.md`, customer/deployment/handoff
  guidance, architecture, regression tooling, and engineering rules together.

### Primary research

- Three.js colour management:
  <https://threejs.org/manual/en/color-management.html>
- Three.js texture colour-space constants:
  <https://threejs.org/docs/#api/en/constants/Textures>
- Three.js `TextureLoader`:
  <https://threejs.org/docs/#api/en/loaders/TextureLoader>
- Three.js `MeshPhysicalMaterial` emissive map/intensity:
  <https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial>
- Three.js texture-size capability:
  <https://threejs.org/docs/#api/en/renderers/WebGLCapabilities.maxTextureSize>
- MDN image decode:
  <https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode>
- MDN CORS-enabled images:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/CORS_enabled_image>

## Implemented but insufficient — Route-aware source-addressing recovery (v0.91, 2026-08-07)

> **Status update:** The root source-addressing repair from this plan is now
> implemented. Generated customer bundles publish a script-derived
> `assetBaseUrl` through `window.__FREYRAUM_ARTWORK_BUNDLE__`, runtime startup
> sanitizes bundle envelopes as well as the legacy artwork array, and both hub
> and gallery now consume shared declared-versus-resolved artwork source
> candidates. The remaining future work below is limited to deeper failure
> typing, CORS/upload proofing, and oversized-image downscale hardening.

### Incident assessment

The phrase “grey plane” is not a sufficient root cause in this application.
There are two independently rendered destinations with two intentional
fallbacks:

| Visible signature | Route and current code path | What it proves |
|---|---|---|
| A neutral grey/tan gradient, often with a faint `FREYRAUM` mark, while the mounted work keeps the correct aspect ratio | Interactive gallery: `TextureManager.createFallbackTexture()` → `GalleryManager` → `ArtworkMesh` / `PaintingMaterial` | An albedo source did not produce a usable texture. The geometry can still be correct because `Artwork.dimensions` sets its aspect ratio before the texture succeeds. |
| A grey wall-coloured plane that shows the artwork title as a placeholder | Museum hub: `MainMuseumHub.setSlotImageState(..., 'missing')` → `HubRoomRenderer.placeholderTexture()` | Both declared source resolution and the embedded fallback have failed, timed out, or were unavailable for that slot. |
| A flat but image-free material without either deliberate fallback signature | Either destination after a nominal load | This is a second class of failure: material-map binding, GPU upload, CORS/tainted texture upload, context restoration, or scene composition. It must not be treated as a URL 404 without proof. |

The active branch already contains the v0.90 declared-image → `webglImage`
fallback contract. That reduces the impact of a bad primary URL, but it cannot
repair a generated bundle that is missing/corrupt, an unsupported image, a
failed embedded payload, an external origin that denies CORS, a decode timeout,
or a device that cannot upload the source dimensions. A recurring grey state
after v0.90 is therefore an **incident to trace**, not evidence that lighting,
PBR realism, or tone mapping should be rewritten.

#### Source-backed hypotheses, ranked

| Rank | Hypothesis | Current evidence | Required proof before implementing the corresponding repair |
|---|---|---|---|
| 1 | The failing environment has a stale, incomplete, or mismatched generated customer bundle. | The importer produces `customer-preview/customer-artworks.js` and `images/`; the sync script copies them to `public/`; the clean clone does not retain those generated artifacts. Previous screenshot titles did not match the checked-in inbox. | Preserve the exact `customer-artworks.js`, its paired image directory, entry URL, build commit, and browser Network log from the failing environment. |
| 2 | A document-relative `./images/<id>.<ext>` URL resolves differently in `file://`, Vite development, or Pages under `/Freyraum/`. | The importer writes document-relative URLs; the same generated manifest is consumed from three distinct script locations. | Record both the manifest URL and the browser-resolved request URL for one failed primary source in each environment. |
| 3 | The primary asset fails and its `webglImage` fallback is absent, sanitized out, corrupt, too large, or unsupported. | `sanitizeInjectedArtworks()` only retains a valid base64 image data URI; both routes intentionally end at a placeholder after final fallback failure. | Export the injected record and verify that its primary URL and fallback payload independently decode in the failing browser. |
| 4 | An external artwork URL is loaded without a valid CORS response, so decoding appears successful but WebGL upload is rejected. | `TextureManager` correctly selects `crossOrigin='anonymous'` for HTTP(S) and a no-CORS loader for local/data URLs, but browser upload failures can surface only in DevTools. | Correlate the Network response headers with console `texImage2D`/security errors and an attempted texture upload. |
| 5 | The fixed five-second hub load/decode deadline or an oversized image causes a false final failure on a constrained device. | `MainMuseumHub` times both load and `HTMLImageElement.decode()`; `TextureManager` observes `maxTextureSize` but currently only warns after loading. | Capture elapsed load/decode times, decoded dimensions, `maxTextureSize`, device memory class, and final slot state. |
| 6 | Colour management or shader binding is the primary failure. | The gallery renderer and hub renderer use `SRGBColorSpace` output and `NoToneMapping`; albedo maps are assigned sRGB. The hub uses a simple `MeshBasicMaterial`. | First prove a real source reaches the material map but does not produce source pixels. Only then compare raw albedo, final material, and a shader/map-binding inspection. |

### Research conclusions and repository decisions

| Authoritative source | Finding | Decision for FREYRAUM |
|---|---|---|
| [Three.js `TextureLoader`](https://threejs.org/docs/#api/en/loaders/TextureLoader) and [source](https://github.com/mrdoob/three.js/blob/r166/src/loaders/TextureLoader.js) | `TextureLoader.load()` returns a `Texture` before its image is available; individual `onError` handling is necessary to distinguish a loaded texture from a request that merely settled. | Keep explicit per-artwork success/failure outcomes. Do not use loading-overlay completion as proof that customer pixels were uploaded. |
| [Three.js `LoadingManager`](https://threejs.org/docs/#api/en/loaders/managers/LoadingManager) and [source](https://github.com/mrdoob/three.js/blob/r166/src/loaders/LoadingManager.js) | Manager completion includes items that errored; `onError` identifies a failed URL. | Log and test source success per artwork rather than treating manager completion as readiness. |
| [Three.js colour-management manual](https://threejs.org/manual/en/color-management.html) | Colour/albedo maps use `SRGBColorSpace`; normal, roughness, AO, and other non-colour maps use `NoColorSpace`. A colour-space defect changes an image's appearance; it does not normally remove its pixels. | Retain the current albedo sRGB contract. Audit non-colour role assignment separately after image visibility is restored; do not use colour changes to mask source failure. |
| [Three.js `WebGLCapabilities.maxTextureSize`](https://threejs.org/docs/#api/en/renderers/WebGLCapabilities.maxTextureSize) | The usable maximum is queried from the current renderer/device, not inferred from source dimensions or desktop hardware. | Promote the existing observation into a pre-upload, quality-tier-aware compatibility guard with an explicit resize/fallback outcome. |
| [MDN: `HTMLImageElement.decode()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode) | Decode is asynchronous and may reject; it must be tied to the same image/source attempt that initiated it. | Preserve explicit decode states, measure duration, and avoid declaring a final placeholder without recording which candidate and stage timed out. |
| [MDN: CORS-enabled images](https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/CORS_enabled_image) | Cross-origin images require both a suitable server response and `crossOrigin` before requesting the image for canvas/WebGL use. | Keep separate local and external loaders. Add a precise external-origin/CORS diagnostic rather than applying `crossOrigin` to `file://` or data URLs. |
| [Vite static-asset guide](https://vite.dev/guide/assets.html) | Public assets are copied verbatim, and base-path-safe references must account for a subpath deployment. | Make generated customer image resolution relative to the generated manifest script, not implicitly to whichever document happens to load it. |

### Options considered

| Option | Benefits | Risks / rejected scope | Decision |
|---|---|---|---|
| Retune room lights, PBR material, bloom, or tone mapping | May improve an image that is already visible. | Cannot make an absent image appear; hides the real failure; regresses colour fidelity. | Reject for the recovery PR. |
| Make `webglImage` the primary source everywhere | Bypasses one path-resolution class. | Duplicates large bytes in JS, weakens deployable-asset verification, and can still fail/overload memory. | Reject. Keep it as bounded fallback. |
| Replace the hub material with `PaintingMaterial` or a custom shader | Unifies visual treatment. | Adds shader complexity to the route whose visible plane already uses an unlit texture map. | Reject until a real hub source is demonstrably bound but invisible. |
| Add a CSS/DOM `<img>` over every plane | Could mask a WebGL issue. | Creates two competing render/perspective systems and does not fix the gallery route. | Reject. |
| Make manifest URLs absolute from the generated script location; retain a visible source/fallback state machine | Works for file preview, Vite dev, and Pages without guessing the document base; makes artifacts auditable. | Requires a backward-compatible injected-manifest upgrade and focused fixture coverage. | **Recommended.** |
| Add a per-artwork, capability-aware decode/downscale path | Prevents dimensions beyond `MAX_TEXTURE_SIZE` from becoming blank on constrained GPUs. | Must preserve original pixels on capable devices and bound CPU/heap cost. | **Recommended, but only after artifact/path repair is proven or as an independently tested hardening slice.** |

### Recommended implementation sequence

#### Phase 0 — Capture a reproducible failing artifact before code changes

1. Identify the affected destination from the visible signature table and record:
   browser/version, OS/device, protocol (`file:`, Vite dev, built Pages),
   viewport/DPR, quality preset, and exact URL.
2. Save the generated `customer-artworks.js`, matching `images/` directory, and
   the customer inbox input that generated them. Do not debug from a manifest
   regenerated after the failure.
3. Export `window.__FREYRAUM_DIAGNOSTICS__.exportJson()` with
   `?debug=verbose&hubDebug=1`, the DevTools Network HAR, and console errors.
4. For one failing artwork, create a source-to-pixel record: artwork ID, manifest
   `image`, fallback presence, script URL, document URL, resolved primary/fallback
   URL, request status/content type, decode result/duration/dimensions,
   `maxTextureSize`, selected material map, and final placeholder reason.
5. Re-run the same captured artifact in `customer-preview/app.html`, Vite dev,
   and a built Pages-base preview. This separates an artifact error from a
   environment-resolution error before a fix is chosen.

**Exit criterion:** the team can point to a single first failed stage for at
least one grey artwork. A screenshot alone does not satisfy this phase.

#### Phase 1 — Make generated customer image addressing script-relative ✅ shipped

**Scope:** `scripts/import-artworks.mjs`, `src/main.ts`,
`src/utils/artworkImageSources.ts`, `src/gallery/TextureManager.ts`,
`src/hub/MainMuseumHub.ts`, importer/hub fixtures, and the generated-preview
build path.

1. Evolve the generated injection from a bare array to a backward-compatible
   bundle envelope, for example `window.__FREYRAUM_ARTWORK_BUNDLE__`, containing
   a schema version, bundle identifier, generated timestamp, script-derived
   `assetBaseUrl`, and the existing artwork records. Keep
   `window.__FREYRAUM_ARTWORKS`/the existing array contract readable during the
   migration so old previews do not hard-fail.
2. In the generated classic script, compute `assetBaseUrl` from
   `document.currentScript.src` while that script is executing, with
   `location.href` only as a documented fallback. Generate each image URL from
   `new URL('images/<encoded-filename>', assetBaseUrl).href`; do not derive it
   later from the document URL.
3. Add a shared `resolveArtworkImageSourceUrl()` boundary that returns a
   structured candidate with `declaredUrl`, `resolvedUrl`, `mode`, `urlType`, and
   bundle ID. Both `TextureManager` and `MainMuseumHub` must consume this one
   resolved candidate type; neither may independently reinterpret `./images`.
4. Preserve filename case and URL-encode each path component at importer time.
   Validate that generated image filenames are unique after normalization, and
   surface a specific import error rather than allowing a later 404.
5. Extend `sanitizeInjectedArtworks()` to validate the envelope/base URL without
   accepting arbitrary non-image schemes. Retain only `https:`, `http:`,
   `file:`, `data:image/`, and same-origin relative sources permitted by the
   existing customer workflow.
6. Update the public sync/build verifier to compare manifest records with
   `customer-preview/images/`, `public/images/`, and `dist/images/`; fail with
   artwork ID plus expected filename if any declared source is absent.

**Why this is the preferred fix:** it removes reliance on the document's base
path while retaining a small, statically served asset bundle. It correctly
resolves from `file:///.../customer-preview/customer-artworks.js`,
`http://localhost/.../customer-artworks.js`, and
`https://host/Freyraum/customer-artworks.js` without adding a dependency or
making base64 payloads primary.

**Acceptance criteria:** for one fixture each in front/left/right hub walls and
the gallery, the logged resolved primary URL is inside the exact generated
bundle and returns an image with non-zero dimensions in all three environments.

#### Phase 2 — Replace ambiguous texture fallback state with typed outcomes

**Scope:** `src/gallery/TextureManager.ts`, `src/gallery/GalleryManager.ts`,
`src/hub/MainMuseumHub.ts`, `src/hub/HubRoomRenderer.ts`, and
`src/utils/Diagnostics.ts`.

1. Refactor gallery albedo loading around a discriminated
   `ArtworkTextureLoadOutcome`: `loaded`, `primary-failed-fallback-loaded`, or
   `final-fallback`. Include artwork ID, bundle ID, declared/resolved URL,
   source mode, request/decode/upload stage, dimensions, elapsed milliseconds,
   `maxTextureSize`, colour space, and a redacted error.
2. Do not make `TextureManager.loadForRole()` silently erase an albedo failure
   before `loadArtworkAlbedo()` can describe it. Keep generated textures for
   optional PBR roles, but give the customer-visible albedo path its explicit
   outcome and one bounded embedded-fallback retry.
3. Change `MainMuseumHub.loadSlotImageCandidate()` to return the same essential
   request/decode timing metadata. Keep the five-second deadline only as a
   recorded candidate failure; when a source is still pending, prevent a stale
   event from resolving a later fallback attempt by using a new image element or
   an abortable source token per candidate.
4. Make `HubRoomRenderer.upsertSlot()` report a `HubTextureBindingOutcome` after
   map assignment and `renderer.initTexture()`. This bridges the current gap
   between DOM image decode and visible WebGL plane binding.
5. Add one developer-only source-state overlay/table (or enrich the existing
   `?hubDebug=1` output) that explicitly labels `primary`, `embedded fallback`,
   `final placeholder`, `CORS/upload suspect`, and `oversize guarded`. Never
   show a long customer-facing URL or data URI.

**Acceptance criteria:** a grey artwork has one exported diagnostic record that
names the exact first failed stage. A successful LoadingManager completion is
never accepted as evidence that an artwork texture is visible.

#### Phase 3 — Handle external CORS, decoding, and texture-size limits safely

**Scope:** `src/gallery/TextureManager.ts`, `src/hub/MainMuseumHub.ts`,
`src/config/quality.ts`, and the diagnostics/fixture harness.

1. For HTTP(S) candidates, log the loader's `crossOrigin` policy and classify
   failures as request/decode versus post-load upload suspect. Require customer
   external hosts to return an appropriate `Access-Control-Allow-Origin`; do not
   weaken local/data/file handling by globally forcing anonymous CORS.
2. Add a small, opt-in developer proof that renders a successfully bound source
   to a controlled target and detects a map-binding/upload failure before it is
   mistaken for a missing asset. Keep this diagnostic out of normal rendering.
3. Before uploading an image whose dimensions exceed the active
   `renderer.capabilities.maxTextureSize` or the quality-tier cap, create one
   bounded derived image using `createImageBitmap` resize options where available,
   with an `OffscreenCanvas`/canvas fallback. Record source and uploaded
   dimensions, do not upscale, and release temporary bitmaps/canvases promptly.
4. Define caps in `src/config/quality.ts` rather than implicit device checks:
   high `min(maxTextureSize, 8192)`, balanced `min(maxTextureSize, 4096)`, and
   battery `min(maxTextureSize, 2048)` are starting values subject to device
   validation. Preserve the original on devices that fit the cap.
5. Keep the embedded `webglImage` fallback bounded to one attempt. If it is too
   large to decode/upload, return a truthful final placeholder diagnostic instead
   of retrying indefinitely or consuming unbounded memory.

**Acceptance criteria:** a 4096+ fixture on a constrained simulated capability
has either a verified downscaled image or a diagnosable explicit unsupported
state—never an unexplained grey plane.

#### Phase 4 — Audit colour/material only after source pixels are proven

1. Add a developer-only raw-albedo mode that bypasses gallery physical response,
   plus final-material and UV/map-bound snapshots. Use it to distinguish a
   colour/material issue from source absence.
2. Retain `SRGBColorSpace` for albedo and renderer output. Audit
   `PaintingTextureSet` non-colour roles against the pinned Three.js version and
   move normal/roughness/AO/height-style data to `NoColorSpace` only with
   side-by-side visual regression evidence.
3. Do not modify hub `MeshBasicMaterial`, lighting, bloom, tone mapping, or room
   geometry in this incident PR unless Phase 2 proves a map reaches that material
   and remains invisible.

### Required verification and release gates

| Layer | Required proof |
|---|---|
| Importer | `npm run import:artworks` generates a bundle report with stable IDs, encoded filenames, source dimensions, and primary/fallback availability. |
| Static bundle | A focused artifact validator proves every manifest source exists in preview, `public`, and `dist`, with the same relative/script-derived resolution. |
| Hub | `npm run validate:museum-hub` includes primary-success, primary-failure/fallback-success, final-placeholder, delayed-decode, and oversize cases. |
| Gallery | Fixtures assert that `GalleryManager` reports a non-generated albedo outcome for valid artwork and an explicit final fallback for invalid artwork. |
| Visual | `npm run validate:visual` compares hub and gallery fixtures across desktop and phone sizes; a valid fixture may not display a placeholder, title-only plane, or generated fallback. |
| Manual environments | Verify `customer-preview/app.html` over `file://`, Vite dev, and built Pages-base output with the exact captured customer bundle. |
| Baseline quality | `npm run lint`, `npm run build:typecheck`, `npm run build`, `npm run test:frame-budget`, and `npm run docs:check-config-authority` pass. |

### Definition of done

- The original captured incident reproduces before the repair and displays the
  supplied paintings after it in its original environment.
- Every visible intended artwork has a recorded source outcome and a real albedo
  texture on its visible mesh; a fallback is never mistaken for success.
- The hub and gallery share source URL semantics and fallback reporting.
- `file://`, Vite development, and Pages-base builds resolve the same generated
  customer images without manual URL edits.
- External CORS, decode timeout, missing-file, and oversized-image failures are
  explicit and bounded.
- Colour/material work is only accepted after raw source pixels are visible.
- Customer, deployment, diagnostics, architecture, findings, plan, and
  regression documentation remain synchronized with the implementation.

## Planned — Evidence-based recovery plan for grey museum-hub artworks before realism (2026-08-07)

> **Planning/docs only.** No runtime code, importer code, generated assets, or
> implementation PR were created in this planning pass.
>
> **Verified branch snapshot:** `copilot/planning-change-startup-flow` at
> `061da51ad4a6348be2e86fa8e440760326ae5615`; `git status --branch --porcelain=v1`
> was clean during the audit.

### 1. Executive diagnosis

| Rank | Candidate cause | Confidence | Evidence | How to prove/disprove |
|---|---|---:|---|---|
| 1 | The failing runtime is using a generated customer manifest / image bundle that does not match the actual shipped preview or Pages assets, so hub `image` URLs fail and slots enter the explicit missing-image state. | High | The screenshot titles (`Gartenszene`, `Zdigital…`) do not exist anywhere in the checked-in inbox, built-in artwork list, or checked-in `museum-hub.json`. The clean clone currently has no `customer-preview/customer-artworks.js`, no `public/customer-artworks.js`, no generated `images/`, and no `dist/` output. Both runtime entries depend on those generated files for customer art. | Capture the exact failing `customer-artworks.js` (preview or deployed), the generated `images/` folder, and the resolved browser requests in the failing environment; compare filenames, IDs, and timestamps against the active branch’s importer output. |
| 2 | The hub is reaching the explicit **primary failed + fallback missing/failed** path, not a generic “material looks flat” state. | High | `MainMuseumHub.setSlotImageState(..., 'missing', ...)` is the only path that adds `.has-missing-image`; `HubRoomRenderer.upsertSlot(..., missingImage)` then binds `placeholderTexture(label)` instead of the artwork texture. The latest commit (`061da51`) also made the DOM missing-image placeholder visibly render. | In a failing session, inspect each slot’s `artworkSourceState`, `artworkSourceMode`, `artworkFallbackReason`, diagnostics entries, and final `HubRoomRenderer` texture key before changing materials or lighting. |
| 3 | The generated artifact that produced the screenshot is stale, external, or otherwise not the same runtime/data state as the clean current branch. | High | The current checked-in inbox contains only `Fraktal.png` and `Akt 27.png`; the checked-in `customer-artworks/museum-hub.json` explicitly maps only `fraktal` and `akt-27` onto the front wall pair. The screenshot shows more artworks, including side-wall titles that are not present in the branch. | Record the exact environment: Vite dev, built `dist/`, `customer-preview/app.html`, or deployed Pages. Save the generated customer manifest used by that environment and compare it to the branch inputs. |
| 4 | Relative-path / base-path / casing / encoding differences between Vite dev, GitHub Pages, and `file://` preview are breaking the declared customer `image` URLs. | Medium | The importer writes relative `./images/<id>.<ext>` paths; the dev entry loads `/customer-artworks.js`; the Pages build uses base `/Freyraum/`; the preview entry loads `./customer-artworks.js`. The screenshot data set is external to the clone, so environment-specific path resolution is still open. | For each traced artwork, log: requested URL, final URL, protocol, HTTP/file status, content type, decoded dimensions, and whether the request came from dev, Pages, or `file://`. |
| 5 | The embedded `webglImage` fallback is absent, sanitized away, stale, or also failing in the screenshot environment. | Medium | Current hub code retries `webglImage` before declaring `missing`, and current importer writes `webglImage` from the copied preview image bytes. A visible missing-image state therefore means the embedded fallback either was not present in the active generated artifact or did not survive load/decode. | Inspect the active `window.__FREYRAUM_ARTWORKS` entries in the failing runtime and compare them to the importer contract. Confirm whether `sanitizeInjectedArtworks()` preserved each `webglImage`. |
| 6 | Material/shader assignment or color-management is the primary blocker for the screenshot. | Low | The screenshot route is the museum hub, whose visible artwork plane is a simple `MeshBasicMaterial` fed from `HubRoomRenderer.imageTexture()` or `placeholderTexture()`, not the interactive gallery’s `PaintingMaterial` shader path. The visible result is placeholder-grey, not “wrong but still image-bearing”. | Only investigate this after a real image is proven to arrive on the hub artwork plane. Use raw albedo vs final-shaded debug comparisons on both hub and gallery paths. |

#### Proven facts

- The screenshot route is the **museum hub / selection room**, not the
  interactive gallery:
  `src/hub/MainMuseumHub.ts` builds the “Museum” header and DOM shell, while
  `src/hub/HubRoomRenderer.ts` builds the square room, wall-mounted artwork
  planes, and hub-specific WebGL canvas.
- The current clone has **no generated customer-artwork injection state**:
  `customer-preview/customer-artworks.js` is absent, `public/customer-artworks.js`
  is absent, generated preview `images/` are absent, and `dist/` is absent.
- The current checked-in customer inputs do **not** match the screenshot:
  `customer-artworks/inbox/Fraktal.png`,
  `customer-artworks/inbox/Akt 27.png`, and
  `customer-artworks/museum-hub.json` only prove a two-artwork front-wall setup.
- The latest commit did **not** restore artwork images. It made the
  missing-image placeholder more visible:
  `.museum-hub__artwork.has-missing-image .museum-hub__art-placeholder` changed
  from `display: none` to `display: flex` in `src/styles/main.scss`.
- The normal hover/selection label (`.museum-hub__artwork-label`) is hidden by
  default and only appears on hover, focus, or selected state. Multiple visible
  titles in the screenshot are therefore more consistent with the **missing-image
  placeholder path** than with the normal label path.
- The current tracked inbox images are not oversized enough to prove a GPU limit
  failure by themselves: `Akt 27.png` is 3150 × 3150 and `Fraktal.png` is
  3780 × 5046. `maxTextureSize` pressure remains a future-proofing concern, not a
  proven cause for the checked-in assets.

#### Likely explanations

- The screenshot environment is loading a generated customer manifest whose
  declared image URLs do not resolve to real shipped files in that environment.
- The same generated artifact either lacks valid `webglImage` fallbacks or uses a
  stale pre-v0.90-style bundle that never reaches the fallback recovery path.

#### Unverified hypotheses

- A GitHub Pages base-path or pathname-casing mismatch.
- A stale `file://` preview loading an old `customer-artworks.js`.
- A decode failure specific to the embedded fallback payload.
- A DOM/canvas layering problem after the hub slot already reached `ready`.
- A hub-to-gallery divergence where one route uses newer generated data than the
  other.

#### Prior-session claims that do not match the active branch

- The custom instructions mention `plan.md § v0.29` and `FINDINGS.md § v0.29`,
  but no such current sections exist in the active branch. Treat those mentions as
  historical context, not as authoritative architecture.
- Changelog/plan statements about “preview rebuilt” describe a prior generated
  state, but the clean checked-out branch does not currently contain the generated
  customer JS or generated preview images. Those claims remain historical until the
  importer is run again in the current environment.

### 2. Current rendering and asset architecture map

#### Current-state truth table

| Area | Current implementation | Source file(s) | Proven? | Notes |
|---|---|---|---|---|
| Screenshot runtime | Museum hub / selection room (`MainMuseumHub` + `HubRoomRenderer`) | `src/hub/MainMuseumHub.ts`, `src/hub/HubRoomRenderer.ts`, `src/styles/main.scss` | Partially | The route is proven. The exact environment (Vite dev / Pages / preview / other) is not, because the screenshot titles do not match the checked-in branch state. |
| Visible title source | `ResolvedHubSlot.displayLabel` is written into three places: hidden hover label, DOM missing-image placeholder, and WebGL placeholder texture | `src/hub/MainMuseumHub.ts`, `src/hub/HubRoomRenderer.ts`, `src/styles/main.scss` | Yes | The screenshot most strongly matches the missing-image placeholder path, not the hover label path. |
| Visible artwork image source | Hub WebGL plane texture on `HubRoomRenderer.artworkMesh.material.map` | `src/hub/HubRoomRenderer.ts` | Yes | The DOM `<img class="museum-hub__art">` is not the primary visible art surface. |
| Artwork manifest source | `window.__FREYRAUM_ARTWORKS` when generated customer data exists; otherwise built-in `src/config/artworks.ts` | `app.html`, `customer-preview/app.html`, `src/main.ts`, `src/config/artworks.ts`, `scripts/import-artworks.mjs` | Yes | The clean clone currently falls back to built-ins because generated customer JS is absent. |
| Texture loader | Hub: DOM `HTMLImageElement` load/decode → `THREE.Texture(image)`; gallery: `TextureManager` + `TextureLoader` + generated fallback texture | `src/hub/MainMuseumHub.ts`, `src/hub/HubRoomRenderer.ts`, `src/gallery/TextureManager.ts` | Yes | The screenshot route is on the simpler hub path. |
| Active material/shader | Hub: `MeshBasicMaterial`; gallery: `PaintingMaterial` (`MeshPhysicalMaterial` subclass + `onBeforeCompile`) | `src/hub/HubRoomRenderer.ts`, `src/gallery/ArtworkMesh.ts`, `src/materials/PaintingMaterial.ts` | Yes | This makes a hub-specific material/shader bug less likely than an asset/source failure. |
| Fallback material/texture | Hub: `placeholderTexture(label)` plus optional DOM missing-image placeholder; gallery: generated gradient fallback | `src/hub/HubRoomRenderer.ts`, `src/hub/MainMuseumHub.ts`, `src/styles/main.scss`, `src/gallery/TextureManager.ts` | Yes | The screenshot is consistent with hub fallback/placeholder behavior. |
| Generated preview path | Importer writes preview JS/images/audio, then sync copies those to `public/` for Vite/Pages | `scripts/import-artworks.mjs`, `scripts/sync-customer-public.mjs`, `scripts/write-local-preview.mjs`, `app.html`, `customer-preview/app.html` | Yes | In the active clean clone, those generated customer-artwork files are missing; the current preview/public state is therefore incomplete. |

#### Current branch runtime inventory

- **Active branch:** `copilot/planning-change-startup-flow`
- **HEAD:** `061da51ad4a6348be2e86fa8e440760326ae5615`
- **Uncommitted changes during audit:** none
- **Recent relevant commits:**
  - `061da51` — “Fix hub placeholder visibility and warm lookup”
  - `81a8704` — “Regenerate preview bundle for artwork fallback fix”
- **Checked-in generated customer preview state:** only the runtime bundle shell is
  tracked (`customer-preview/app.html`, `customer-preview/freyraum-gallery.js`,
  `customer-preview/style.css`, `customer-preview/webgpu-probe.js`). The generated
  customer artwork JS and image assets are absent from the clone.

#### Actual file/function flow

##### A. Customer-imported artwork flow (preview / dev / Pages)

1. **Source artwork file**
   - `customer-artworks/inbox/<filename>`
2. **Importer discovery**
   - `scripts/import-artworks.mjs`
   - reads dimensions, copies the source to `customer-preview/images/<id>.<ext>`,
     derives `id`, `title`, and metadata, and embeds `webglImage` from the copied
     bytes when possible
3. **Generated manifest record**
   - writes `customer-artworks/artworks.json`
   - writes `customer-preview/customer-artworks.js` as
     `window.__FREYRAUM_ARTWORKS = [...]`
   - optional `window.__FREYRAUM_MUSEUM_HUB = {...}` injection from
     `customer-artworks/museum-hub.json`
4. **Runtime artwork object**
   - `src/main.ts` → `sanitizeInjectedArtworks()` → `artworks`
5. **Resolved browser URL / embedded payload**
   - `src/utils/artworkImageSources.ts` → `resolveArtworkImageSources()`
   - primary = `image`
   - fallback = `webglImage` when present and distinct
6. **Hub path**
   - `src/config/museumHub.ts` → `resolveMuseumHub()` → `artworkSourceById`
   - `src/hub/MainMuseumHub.ts` → `resolveSlotImage()` →
     `loadSlotImageCandidate()` → `decodeSlotImage()` →
     `setSlotImageState()` → `syncSlotRenderer()`
   - `src/hub/HubRoomRenderer.ts` → `upsertSlot()` →
     `imageTexture()` or `placeholderTexture(label)` →
     `renderer.initTexture()` → visible pixels on `.museum-hub__canvas`
7. **Interactive gallery path**
   - `src/gallery/GalleryManager.ts` → `init()` →
     `TextureManager.preloadArtworkAlbedos()` →
     `showArtwork()` → `ArtworkMesh.setPaintingTextures()` →
     `PaintingMaterial.applyTextures()` → main gallery canvas

##### B. Clean-clone observed branch flow (current audit)

1. `app.html` expects `/customer-artworks.js` and `/customer-audio.js`.
2. The clean clone currently has neither generated file under `public/`.
3. `src/main.ts` therefore falls back to `src/config/artworks.ts`.
4. `customer-preview/app.html` expects `./customer-artworks.js` and
   `./customer-audio.js`, but those generated files are also absent in the clean
   clone until `scripts/write-local-preview.mjs` or the importer is run.
5. The screenshot titles cannot therefore come from the clean-clone runtime state.

##### C. Screenshot-specific trace blockers that must be resolved first

- The screenshot titles are not present in:
  - `src/config/artworks.ts`
  - `customer-artworks/inbox/`
  - `customer-artworks/museum-hub.json`
- The screenshot shows side-wall titled placeholders, but the checked-in
  `customer-artworks/museum-hub.json` only explicitly maps two front-wall artworks.
- Conclusion: the later implementation agent must first capture the **actual
  failing generated customer manifest + image bundle** from the runtime that
  produced the screenshot before claiming any root cause inside the current
  checked-in source tree.

### 3. Recommended implementation strategy

> **Strict first implementation PR scope:** stop after **A + B + the minimum
> visibility-proof pieces of C**. Do not mix geometry/material realism into the
> first repair PR.

#### A — Restore artwork image rendering

- **Goals**
  - Reproduce the exact failing customer-artwork runtime.
  - Trace one real artwork per front/left/right wall from source file to final hub
    pixels.
  - Fix only the first proven failure in that chain.
- **Exact files likely to change**
  - `src/hub/MainMuseumHub.ts`
  - `src/hub/HubRoomRenderer.ts`
  - `src/main.ts`
  - `src/utils/artworkImageSources.ts`
  - `scripts/import-artworks.mjs`
  - `scripts/sync-customer-public.mjs`
  - `app.html`
  - `customer-preview/app.html`
- **Implementation steps**
  1. Capture the exact failing generated artifact:
     `customer-preview/customer-artworks.js` or `public/customer-artworks.js`,
     plus the matching `images/` folder and the runtime entry path that used it.
  2. For at least one front-wall, one left-wall, one right-wall, and one
     long-title artwork, record: source filename, generated manifest entry,
     primary image URL, fallback presence, actual requested URL, request status,
     decoded dimensions, resolved hub slot ID, and final hub texture key.
  3. Compare the same artwork across:
     - Vite dev (`app.html`)
     - built production output (`dist/app.html`)
     - `customer-preview/app.html`
     - `file://` preview when applicable
  4. Fix the first proven defect only:
     - missing/stale generated file
     - wrong base/relative path
     - casing / encoding mismatch
     - sanitized-away fallback
     - state/retry bug between load, decode, and slot sync
  5. Keep the hub renderer on its current simple `MeshBasicMaterial` path until
     the asset pipeline is proven correct.
- **Interfaces / data-model changes**
  - Prefer dev-only diagnostic state first.
  - Do not change the customer-facing artwork schema unless the failing artifact
    proves that an importer-owned field is missing or ambiguous.
- **Importer / generated-preview implications**
  - Treat `image`, `webglImage`, and `dimensions` as importer-owned.
  - If the fix touches generated asset layout, update both preview generation and
    `public/` sync together.
- **Risk**
  - Fixing one environment path can regress another (`file://` vs Pages).
- **Rollback plan**
  - Isolate path-resolution and fallback changes behind narrow helpers so the old
    source-selection behavior can be restored quickly if another environment breaks.
- **Test / validation plan**
  - `npm run import:artworks`
  - `npm run validate:museum-hub`
  - `npm run validate:visual`
  - manual cross-environment request/decode verification
- **Acceptance criteria**
  - Every visible hub artwork that has a valid manifest image shows the real image.
  - No slot with a valid recoverable source reaches `.has-missing-image`.
  - The failing screenshot can be re-created pre-fix and shown resolved post-fix.
- **Desktop/mobile impact**
  - Must stay neutral or positive; no new passes or heavy materials in this phase.
- **Prerequisite phase(s)**
  - None.

#### B — Add diagnostics and automated regression gates

- **Goals**
  - Make every future grey-artwork regression explainable in one inspection pass.
  - Prevent “title visible, artwork missing” regressions from landing silently.
- **Exact files likely to change**
  - `src/hub/MainMuseumHub.ts`
  - `src/hub/HubRoomRenderer.ts`
  - `src/gallery/TextureManager.ts`
  - `src/utils/Diagnostics.ts`
  - `scripts/test-museum-hub-geometry.mjs`
  - `scripts/visual-regression.mjs`
  - `docs/QUERY_PARAMETERS.md`
  - `docs/REGRESSION_TOOLING.md`
- **Implementation steps**
  1. Add one developer-only per-artwork diagnostic record with, at minimum:
     artwork ID, title, source mode, manifest image, resolved image URL, request
     outcome/status, decode outcome, decoded size, `maxTextureSize`,
     downscaled-flag, cache key, texture color space, texture-uploaded flag,
     active mesh/material identifiers, map-assigned flag, shader/material variant,
     and fallback reason.
  2. Expose a developer-only debug view or keyboard/query toggle that can show:
     unlit source albedo, final shaded artwork, UV visualization, detail/normal
     response, fallback state, and missing-image state.
  3. Add automated checks that fail when:
     - a manifest image is missing from preview/public/dist bundles
     - a selected artwork reaches visible state without a valid color texture
     - fallback renders when a valid image was expected
     - customer preview and production diverge in artwork image behavior
  4. Add a guard that explicitly flags visible missing-image placeholders when the
     corresponding slot is supposed to have a recoverable source.
- **Interfaces / data-model changes**
  - New dev-only diagnostics API surface is expected.
- **Importer / generated-preview implications**
  - May add importer report fields or manifest consistency checks, but should not
    change customer-editable metadata fields.
- **Risk**
  - Diagnostics can become noisy unless they are structured and per-slot.
- **Rollback plan**
  - Keep diagnostics opt-in and non-blocking in normal runtime mode.
- **Test / validation plan**
  - `npm run validate:museum-hub`
  - `npm run validate:visual`
  - developer debug-mode manual checks
- **Acceptance criteria**
  - A grey artwork can be explained from one diagnostic snapshot without guessing.
  - CI/local regression tooling fails before a silent placeholder regression ships.
- **Desktop/mobile impact**
  - Dev-only; zero visible impact when disabled.
- **Prerequisite phase(s)**
  - A.

#### C — Verify color management and texture lifecycle

- **Goals**
  - Prove that the correct image is also treated as the correct kind of data.
  - Align hub/gallery texture lifecycle, GPU upload, restore, and color-space rules.
- **Exact files likely to change**
  - `src/gallery/TextureManager.ts`
  - `src/hub/HubRoomRenderer.ts`
  - `src/materials/PaintingMaterial.ts`
  - `src/materials/ArchitecturalSurfaceFactory.ts`
  - `src/core/RendererManager.ts`
  - `src/main.ts`
- **Implementation steps**
  1. Verify renderer output settings on both hub and gallery paths:
     `outputColorSpace`, `toneMapping`, and exposure.
  2. Confirm that customer artwork albedo stays sRGB and that non-color data maps
     use the correct Three.js non-color treatment for the pinned Three.js version.
     The current code uses `LinearSRGBColorSpace` for non-albedo maps; this must
     be checked against current official guidance before material work.
  3. Verify that any `PaintingMaterial` shader customization still preserves
     Three.js decode/output handling once real images are visible.
  4. Add explicit logs for texture upload, active color space, and context-restore
     rebind on both hub and gallery paths.
  5. Add a capability-aware plan for image downscaling before GPU upload when
     `renderer.capabilities.maxTextureSize` is smaller than the source image.
- **Interfaces / data-model changes**
  - No customer schema change expected.
  - Diagnostic records should gain explicit color-space and upload fields.
- **Importer / generated-preview implications**
  - None unless importer-side downscale variants are later proven necessary.
- **Risk**
  - Incorrect color-space changes can “fix” grey placeholders while introducing
    color shifts elsewhere.
- **Rollback plan**
  - Treat color-space changes as isolated, reversible commits with before/after
    albedo screenshots.
- **Test / validation plan**
  - manual albedo-vs-final comparisons
  - `npm run build`
  - `npm run validate:visual`
- **Acceptance criteria**
  - Raw source colors remain faithful after shading.
  - Context restore rebinds the active texture correctly.
  - Downscale logic only activates when device capabilities require it.
- **Desktop/mobile impact**
  - High value on constrained devices; no unnecessary overhead on desktop.
- **Prerequisite phase(s)**
  - A, B.

#### D — Refine room geometry and composition

- **Goals**
  - Move the interactive gallery from “compact stage” toward a complete premium
    interior without rewriting the hub shell or adding high-poly architecture.
- **Exact files likely to change**
  - `src/core/GalleryPresentationStage.ts`
  - `src/config/galleryPresentation.ts`
  - `src/hub/HubRoomRenderer.ts`
  - `src/config/museumHub.ts`
  - `src/lighting/LightingSetup.ts`
- **Implementation steps**
  1. Separate geometry work into:
     - correctness fixes (normals, culling, z-fighting, camera bounds)
     - realism improvements (returns, reveals, depth transitions, composition)
     - intentional deferrals (furniture, free-roam, decorative assets)
  2. Keep the v0.87 hub shell as the authoritative museum-room route unless a
     correctness defect is proven there.
  3. Focus most geometry refinement on the interactive gallery stage:
     side returns, wall/ceiling/floor transitions, selective bevel cues, and
     camera composition.
  4. Do not use `DoubleSide` as a realism shortcut; fix normals and orientation.
- **Interfaces / data-model changes**
  - Only add new stage constants when a geometry change needs one stable name.
- **Importer / generated-preview implications**
  - Generated preview bundle must be regenerated after runtime geometry changes.
- **Risk**
  - Geometry scope can sprawl into an expensive room rebuild.
- **Rollback plan**
  - Keep hub and gallery geometry changes in separate commits/phases.
- **Test / validation plan**
  - `npm run validate:visual`
  - manual wide desktop / portrait / phone checks
- **Acceptance criteria**
  - The room reads as intentional architecture, not a blockout or open shell.
- **Desktop/mobile impact**
  - Geometry additions must be silhouette-driven and low-poly.
- **Prerequisite phase(s)**
  - A, B, C.

#### E — Build realistic architectural materials

- **Goals**
  - Give walls, floor, ceiling, trim, recesses, and dark details restrained,
    physically plausible differentiation that does not compete with the art.
- **Exact files likely to change**
  - `src/materials/ArchitecturalSurfaceFactory.ts`
  - `src/config/quality.ts`
  - `src/core/GalleryPresentationStage.ts`
  - `src/hub/HubRoomRenderer.ts`
- **Implementation steps**
  1. Keep **MeshStandardMaterial / MeshPhysicalMaterial first**.
  2. Walls: use warm neutral plaster with shared subtle normal/roughness detail.
  3. Floor: prefer one restrained premium surface with controlled reflection,
     anti-shimmer filtering, and reuse across tiers.
  4. Ceiling/reveals/trim: use rougher plaster and muted dark painted detail,
     not pure black or noisy procedural patterns.
  5. Only move to `onBeforeCompile` or a custom material if the standard PBR path
     proves insufficient after side-by-side comparisons.
- **Interfaces / data-model changes**
  - None required for the first architectural material pass.
- **Importer / generated-preview implications**
  - Preview bundle regeneration only.
- **Risk**
  - Over-detail can flatten the room or distract from the artwork.
- **Rollback plan**
  - Keep surface-role recipe changes isolated per material role.
- **Test / validation plan**
  - `npm run validate:visual`
  - manual grazing-light review on desktop and phone
- **Acceptance criteria**
  - Surfaces feel materially distinct while remaining visually quiet.
- **Desktop/mobile impact**
  - Reuse small shared maps; avoid unique heavy textures.
- **Prerequisite phase(s)**
  - D.

#### F — Build physical artwork surface profiles

- **Goals**
  - Use the existing validated `presentation` contract as the backbone for
    believable canvas, paper, matte-print, satin-print, and glazed-print behavior.
- **Exact files likely to change**
  - `src/config/presentation.ts`
  - `src/gallery/ArtworkMesh.ts`
  - `src/materials/PaintingMaterial.ts`
  - `scripts/import-artworks.mjs`
  - customer-facing picture/text docs if metadata guidance changes
- **Implementation steps**
  1. Keep the existing profile list:
     `canvas`, `fine-art-paper`, `matte-print`, `satin-print`, `glazed-print`.
  2. Define per-profile roughness/specular/clearcoat/detail expectations.
  3. Keep source image color untouched; physicality must come from roughness,
     normal, clearcoat, body depth, wall gap, and optional frame/backing detail.
  4. Prefer shared reusable detail resources or bounded procedural equivalents,
     not per-artwork unique PBR bundles.
  5. If frames remain, use simple shared geometry and restrained materials.
- **Interfaces / data-model changes**
  - The current `presentation` field is already the correct compatibility layer.
  - Legacy records should continue to default to `matte-print`.
- **Importer / generated-preview implications**
  - Only documentation/import validation changes if new presentation rules are
    added; avoid changing sidecar field names.
- **Risk**
  - Over-strong canvas/glaze cues can alter the identity of the supplied artwork.
- **Rollback plan**
  - Keep profile tuning data-driven in `src/config/presentation.ts`.
- **Test / validation plan**
  - manual close-view and normal-view checks
  - `npm run validate:visual`
- **Acceptance criteria**
  - Physical response is believable and subtle at normal distance and stable at
    close inspection.
- **Desktop/mobile impact**
  - Profile detail scales down by preset without breaking presentation semantics.
- **Prerequisite phase(s)**
  - C, E.

#### G — Tune lighting and image quality

- **Goals**
  - Reveal room geometry and surface response while preserving artwork fidelity.
- **Exact files likely to change**
  - `src/lighting/LightingSetup.ts`
  - `src/hub/HubRoomRenderer.ts`
  - `src/core/PostProcessing.ts`
  - `src/core/RendererManager.ts`
- **Implementation steps**
  1. Tune the existing restrained warm/cool rigs before adding new lights.
  2. Keep white walls and artwork highlights below blowout.
  3. Re-evaluate bloom only after raw albedo comparisons prove it does not wash
     out the artwork.
  4. Keep tone mapping unchanged unless side-by-side image checks prove a better
     fidelity result than the current `NoToneMapping` baseline.
- **Interfaces / data-model changes**
  - None expected.
- **Importer / generated-preview implications**
  - Preview bundle regeneration only.
- **Risk**
  - Lighting changes can hide asset bugs or alter artwork brightness.
- **Rollback plan**
  - Capture albedo/final before/after screenshots for each lighting change.
- **Test / validation plan**
  - `npm run validate:visual`
  - manual source-image fidelity review
- **Acceptance criteria**
  - Room lighting improves realism without becoming a color-management regression.
- **Desktop/mobile impact**
  - Prefer static or on-demand lighting changes; no heavy dynamic effects.
- **Prerequisite phase(s)**
  - C, D, E, F.

#### H — Performance hardening, tier fallbacks, and disposal

- **Goals**
  - Keep the refined result smooth and memory-safe across desktop, tablet, and mobile.
- **Exact files likely to change**
  - `src/config/quality.ts`
  - `src/gallery/TextureManager.ts`
  - `src/gallery/GalleryManager.ts`
  - `src/hub/HubRoomRenderer.ts`
  - `src/materials/ArchitecturalSurfaceFactory.ts`
  - `src/utils/PerformanceMetrics.ts`
- **Implementation steps**
  1. Add capability-aware upload caps based on `renderer.capabilities.maxTextureSize`.
  2. Bound anisotropy, procedural-map sizes, clearcoat/glaze features, and shadow
     budgets by preset.
  3. Keep preload windows bounded and explicit.
  4. Avoid per-frame allocations and per-artwork unique shader programs.
  5. Verify disposal and context-restore behavior for active, adjacent, and
     preloaded textures.
- **Interfaces / data-model changes**
  - Quality preset fields may need explicit artwork-resolution caps and
    per-surface detail toggles.
- **Importer / generated-preview implications**
  - None unless importer-side variant generation is later proven necessary.
- **Risk**
  - Aggressive downscaling or low-tier pruning can silently change the art.
- **Rollback plan**
  - Preserve the current quality architecture and add new limits incrementally.
- **Test / validation plan**
  - `npm run test:frame-budget`
  - `npm run validate:visual`
  - manual mobile/high-DPR checks
- **Acceptance criteria**
  - High-quality features degrade gracefully instead of failing abruptly on mobile.
- **Desktop/mobile impact**
  - This phase owns the final desktop/mobile differentiation.
- **Prerequisite phase(s)**
  - A through G.

##### Recommended quality-tier behavior

| Feature | High | Balanced | Battery/Low |
|---|---|---|---|
| Artwork image resolution cap | `min(source, maxTextureSize, 8192)` | `min(source, maxTextureSize, 4096)` | `min(source, maxTextureSize, 2048)` |
| DPR / render-resolution cap | keep current `pixelRatioCap: 1.6` | keep current `pixelRatioCap: 1.25` | keep current `pixelRatioCap: 1.0` |
| Artwork canvas/paper microdetail | full eligible profile detail | reduced profile detail | off except essential base roughness |
| Clearcoat / glaze | enabled only for eligible glazed/satin profiles | off by default | off |
| Floor / wall normal detail | full shared maps (`hubSurfaceTileSize: 1024`) | reduced shared maps (`512`) | coarse shared maps (`256`) |
| Anisotropy cap | `maxAnisotropy / 1` | `maxAnisotropy / 2` | `maxAnisotropy / 4` |
| Dynamic shadows | enabled | enabled | disabled |
| Shadow map size / update policy | 2048, on-demand updates only | 1024, on-demand updates only | off |
| Post-processing | only restrained, fidelity-validated effects | minimal or off | off |
| Texture preload window | active + near critical window + background sweep | active + one-step adjacent window + near-next queue | active first, one-at-a-time idle adjacent prefetch |

#### I — Documentation and customer-preview synchronization

- **Goals**
  - Keep architecture, diagnostics, deployment, and preview behavior documented in
    lock-step with the implementation.
- **Exact files likely to change**
  - `plan.md`
  - `FINDINGS.md`
  - `CHANGELOG.md`
  - `README.md`
  - `docs/DEPLOYMENT.md`
  - `docs/REGRESSION_TOOLING.md`
  - customer-facing picture/text docs if importer behavior changes
- **Implementation steps**
  1. Update plan/findings/changelog immediately when the first image-visibility PR
     lands.
  2. Document the exact developer diagnostics and the customer-preview /
     production parity checks.
  3. Regenerate the tracked preview bundle (`customer-preview/freyraum-gallery.js`,
     `customer-preview/style.css`, and `customer-preview/app.html`) only when
     source runtime files actually change.
  4. Do **not** commit generated `customer-preview/customer-artworks.js`,
     `public/customer-artworks.js`, or generated `images/` output.
- **Interfaces / data-model changes**
  - Documentation only.
- **Importer / generated-preview implications**
  - Preview bundle regeneration must stay tied to source runtime changes, not to
    customer data changes alone.
- **Risk**
  - Documentation drift can mislead later debugging.
- **Rollback plan**
  - Keep docs aligned with the same implementation PRs that change behavior.
- **Test / validation plan**
  - `npm run docs:check-config-authority`
- **Acceptance criteria**
  - Later contributors can reproduce the fixed pipeline and the preview/deploy
    workflow from docs alone.
- **Desktop/mobile impact**
  - None.
- **Prerequisite phase(s)**
  - A through H.

### 4. Brainstorming decision matrix

| Topic | Option A | Option B | Option C | Recommended option | Why |
|---|---|---|---|---|---|
| Artwork visibility diagnosis | Instrument the hub image/fallback pipeline first | Start with gallery shader/material changes | Judge only from screenshots | A | The screenshot route is the hub, and its placeholder path is explicit and measurable. |
| Artwork rendering material | Keep hub on `MeshBasicMaterial` until assets are proven | Move hub to `PaintingMaterial` immediately | Custom hub shader | A | Removes shader complexity from the first repair. |
| Canvas detail | Shared reusable detail resource or bounded procedural equivalent | Per-artwork unique weave textures | Displacement/tessellation | A | Matches current architecture and mobile constraints. |
| Wall material detail | `MeshStandardMaterial` with shared subtle normal/roughness maps | `onBeforeCompile` enhancement | Fully custom wall shader | A | Lowest risk, highest reuse, enough for restrained realism. |
| Floor material detail | Restrained microcement / stone with bounded reflection tiers | Highly glossy polished stone | SSR-driven floor | A | Premium look without unstable reflection cost. |
| Frames | Simple shared geometry if frames remain | Frameless-only forever | Unique textured frames per artwork | A | Shared geometry is believable and cheap; unique texture sets are not. |
| Lighting | Tune the existing restrained rigs | Add many per-artwork spotlights | Heavy bloom/SSR/SSAO-driven mood lighting | A | Keeps the art primary and preserves performance. |
| Mobile quality fallback | Explicit preset-gated feature reduction | Hidden automatic downgrades | Same desktop path everywhere | A | The repository already uses explicit quality presets and should keep them authoritative. |

### 5. File-by-file change map

| File | Responsibility | Why it changes | Type | Regenerate generated output? |
|---|---|---|---|---|
| `src/hub/MainMuseumHub.ts` | Hub slot source resolution, load/decode state, diagnostics bridge | First repair target for request/decode/fallback proof and slot-level diagnostics | Runtime | Yes, preview bundle if source changes |
| `src/hub/HubRoomRenderer.ts` | Visible hub artwork plane, placeholder texture, hub WebGL canvas | Needed for map-assignment diagnostics, placeholder-state proof, and any hub-only image-surface fixes | Runtime | Yes, preview bundle if source changes |
| `src/utils/artworkImageSources.ts` | Shared declared-image / embedded-fallback source planning | Needed if source selection or logging metadata must become more explicit | Runtime | Yes, preview bundle if source changes |
| `src/main.ts` | Boot-time artwork-source resolution and diagnostics | Needed if environment/source capture must be surfaced at startup | Runtime | Yes, preview bundle if source changes |
| `scripts/import-artworks.mjs` | Customer source discovery, manifest generation, preview asset generation | Needed only if the failing artifact proves a generation mismatch, stale field, or missing fallback payload | Importer | No committed generated customer-artwork output; regenerate locally |
| `scripts/sync-customer-public.mjs` | Copy preview-generated customer assets to `public/` for Vite/Pages | Needed if production asset copying is the proven failure | Importer/build | No committed generated customer-artwork output; regenerate locally |
| `app.html` | Dev / production entry ordering for generated customer JS | Change only if base/path ordering is the proven bug | Runtime entry | Rebuild `dist/` |
| `customer-preview/app.html` | File-based preview entry | Change only if preview-specific path/cache behavior is proven wrong | Preview entry | Re-run preview HTML generation |
| `src/gallery/TextureManager.ts` | Gallery albedo/data-map load, color space, fallback textures, size warnings | Needed for cross-route color/lifecycle parity and future downscale work | Runtime | Yes, preview bundle if source changes |
| `src/gallery/GalleryManager.ts` | Gallery readiness, preload, and active artwork application | Needed for gallery-side diagnostics and parity once the hub is fixed | Runtime | Yes, preview bundle if source changes |
| `src/gallery/ArtworkMesh.ts` | Interactive artwork assembly/body depth | Needed in later physicality phases | Runtime | Yes, preview bundle if source changes |
| `src/materials/PaintingMaterial.ts` | Interactive artwork shading and debug modes | Needed after visibility is proven for albedo/final/UV/profile checks | Runtime | Yes, preview bundle if source changes |
| `src/materials/ArchitecturalSurfaceFactory.ts` | Shared room/stage material recipes | Needed for restrained realism phases | Runtime | Yes, preview bundle if source changes |
| `src/core/GalleryPresentationStage.ts` | Interactive-gallery architectural shell | Needed for later geometry realism work | Runtime | Yes, preview bundle if source changes |
| `src/lighting/LightingSetup.ts` | Interactive-gallery light rig | Needed for later lighting tuning | Runtime | Yes, preview bundle if source changes |
| `src/config/quality.ts` | Explicit quality-tier feature policy | Needed for final tier caps and fallbacks | Runtime config | Yes, preview bundle if source changes |
| `src/config/presentation.ts` | Validated artwork surface profile contract | Existing compatibility point for later artwork-surface tuning | Runtime config | Yes, preview bundle if source changes |
| `scripts/test-museum-hub-geometry.mjs` | Structural hub regression gate | Needed to fail slot/source regressions deterministically | Test | No |
| `scripts/visual-regression.mjs` | Pixel/regression harness for hub/gallery/preview parity | Needed for screenshot-based proof and divergence detection | Test | No |
| `docs/QUERY_PARAMETERS.md` | Authoritative diagnostics/query reference | Update if new debug toggles or APIs are added | Documentation | No |
| `docs/REGRESSION_TOOLING.md` | Regression gate documentation | Update when new artwork-source diagnostics/tests land | Documentation | No |
| `docs/DEPLOYMENT.md` | Customer asset generation and Pages deployment flow | Update if the proven fix changes how generated assets are validated or synced | Documentation | No |
| `README.md`, `CHANGELOG.md`, `plan.md`, `FINDINGS.md` | Current state, release history, active plan, reusable findings | Update when the implementation lands | Documentation | No |
| `customer-preview/freyraum-gallery.js`, `customer-preview/style.css` | Tracked generated preview runtime bundle | Should only change after runtime source changes, never as manual edits | Generated output | Yes, when runtime source changes |

### 6. Validation matrix

#### Existing script validation

| Command | Why it matters for this roadmap | When to run |
|---|---|---|
| `npm install` | Ensures the same dependency graph as CI before reproduction and validation | Before any implementation validation |
| `npm run import:artworks` | Regenerates the customer manifest, preview JS, preview images, and `public/` sync state | Before reproducing customer-artwork failures or validating Pages/dev/preview parity |
| `npm run lint` | Protects TypeScript/ESLint runtime changes | For implementation PRs that touch runtime/importer/tests |
| `npm run build:typecheck` | Verifies strict TypeScript across hub/gallery/importer-adjacent code | For implementation PRs |
| `npm run build` | Produces both tracked preview bundle and Vite production build | For any runtime/importer change |
| `npm run validate:museum-hub` | Structural gate for wall geometry, slot placement, fallback contracts, and wall token reach | For any hub/image-pipeline change |
| `npm run test:frame-budget` | Guards existing performance-tooling behavior and is part of the repository baseline | For implementation PRs |
| `npm run validate:visual` | Pixel/regression gate for hub/gallery output | For image-pipeline, geometry, lighting, and material changes |
| `npm run docs:check-config-authority` | Keeps docs aligned if diagnostics/query docs change | For any plan/docs or debug-surface update |

#### Required manual validation

- **Development runtime**
  - `app.html` under Vite dev
  - verify `/customer-artworks.js` and `/customer-audio.js` injection behavior
- **Built production output**
  - `dist/app.html` / Pages-equivalent path
  - verify `/Freyraum/` base-path asset resolution
- **Customer preview**
  - `customer-preview/app.html`
  - verify generated JS, generated images, and timestamped file-path updates after import
- **Supported `file://` mode**
  - only for the customer-preview path
  - confirm browser can decode and display the customer artwork image without network assumptions
- **Viewport/device coverage**
  - desktop
  - wide desktop
  - tablet
  - phone portrait
  - phone landscape
  - simulated high-DPR
- **Interaction/state coverage**
  - first load
  - active artwork navigation
  - image cache/prefetch behavior
  - missing-image behavior
  - oversized-image behavior
  - quality-preset changes
  - WebGL context restore
  - developer albedo / UV / fallback debug modes

#### Manual acceptance checks per environment

1. The hub and gallery both load the same intended artwork IDs.
2. Every visible artwork surface shows the actual customer image, not a placeholder.
3. No URL resolves to HTML, 404, or the wrong asset type.
4. Customer preview and production show the same image/fallback behavior.
5. Context restore rebinds the active artwork texture.
6. Lower quality tiers reduce cost, not correctness.

### 7. Definition of done

The later implementation is **not complete** unless all of the following are true:

- Every intended artwork visibly displays the correct supplied image.
- No artwork title overlay substitutes for an image.
- The active artwork always has a verifiable successful request/decode path and an
  assigned color texture on the visible render surface.
- Missing assets have an explicit, developer-readable diagnostic reason.
- Artwork source colors remain faithful after shading.
- The museum hub and the interactive gallery no longer diverge silently in source
  resolution or fallback behavior.
- Room geometry reads as a complete premium interior rather than a blockout.
- Walls, floor, ceiling, frames/backers, and artwork surfaces have intentionally
  differentiated, physically plausible response.
- Material detail supports the art and never obscures it.
- High-quality features degrade gracefully on mobile and constrained GPUs.
- Existing navigation, loading, accessibility, importer, and customer-preview
  workflows do not regress.
- All relevant validation gates pass.
- Documentation and generated preview bundle output are synchronized only when
  source runtime changes require regeneration.

#### Strict non-goals for the first repair PR

- no renderer/framework migration
- no new dependency without proof that existing Three.js/WebGL cannot do the job
- no default GI / SSR / heavy SSAO path
- no high-poly room rebuild
- no per-artwork unique heavy PBR bundles
- no persistent visible title text over artwork as a fallback UX
- no “grey placeholder but no diagnostics” behavior

#### Immediate recommendation for the next implementation agent

1. Reproduce the failing screenshot with the **actual generated customer manifest**
   that produced it.
2. Prove one full hub source-to-pixel trace on the failing environment.
3. Ship one small PR containing:
   - the proven hub image-pipeline fix
   - the minimal diagnostics needed to explain failures
   - regression gates that fail before grey placeholders silently return
4. Defer room/material realism to later measured phases.

## Implemented — Shared artwork-source fallback contract for hub + gallery (v0.90, 2026-08-07)

This slice closes the verified hub placeholder failure without changing the
architectural room work:

- added one shared artwork-source resolver so both hub and gallery treat the
  manifest `image` as the primary source and optional `webglImage` data as an
  explicit fallback;
- changed the hub image gate from timeout-as-success to explicit states
  (`ready`, `missing`, fallback retry) and recorded the resolved source mode on
  each projected slot;
- kept the neutral placeholder path only for declared unavailable/final-failure
  states, while warming the resolved hub texture on upload;
- aligned gallery albedo preload/use with the same contract by retrying the
  embedded fallback only after a declared-image failure instead of silently
  preferring it up front;
- extended regression coverage so museum-hub fixture states now prove that a
  missing declared image can still render through the embedded fallback without
  dropping into placeholder mode.

Validation is recorded in `CHANGELOG.md`.

## Implemented — Interactive-gallery architectural stage + mounted presentation baseline (v0.89, 2026-08-07)

This shipping slice narrows the broader v0.88 gallery audit to one safe,
reviewable implementation that materially fixes the interactive gallery without
disturbing the hub:

- added `GalleryPresentationStage` to the existing main gallery renderer so the
  interactive path now has a real front wall, floor, ceiling, side returns,
  skirting shadow gap, and ceiling reveal;
- kept hub and gallery architectural resources independent by giving the gallery
  stage its own `ArchitecturalSurfaceFactory` instance while reusing the same
  material language;
- upgraded `ArtworkMesh` from a plane-only presentation to a shallow mounted
  work assembly whose opaque body casts the near-wall shadow cue while the
  customer image itself stays shadow-free;
- introduced an optional validated `presentation` metadata field
  (`canvas`, `fine-art-paper`, `matte-print`, `satin-print`, `glazed-print`)
  that affects only the interactive-gallery mounting/material defaults; legacy
  free-text `surface` remains descriptive metadata only;
- kept the existing PMREM/no-tone-map colour path, hub renderer, navigation
  model, and conservative post-processing contract unchanged.

Explicitly deferred from the broader v0.88 master plan:

- default decorative frames;
- separate transparent glazing meshes;
- a full profile-specific procedural-texture cache redesign;
- a larger lighting/tone-mapping overhaul beyond the existing single-rig
  shadow-budget tuning.

Validation is recorded in `CHANGELOG.md`.

## Superseded planning baseline — Premium interactive-gallery architectural presentation (v0.88, 2026-08-07)

> **Phase: planning/docs only.** This entry describes a future implementation.
> It does not change the runtime, imported customer artwork, generated preview,
> or current v0.87 hub baseline.

### Mission and scoped outcome

Make the **interactive gallery destination** read as a restrained, physically
believable museum presentation while keeping supplied artwork colour faithful,
navigation smooth, and the high/balanced/battery quality contract intentional.
The result must add an architectural context, material separation, mounted
artwork depth, and controlled lighting without introducing a free-roam game,
asset-heavy room, expensive screen-space effects, or a second artwork pipeline.

This plan deliberately distinguishes the two current destinations:

| Destination | Current state | v0.88 responsibility |
|---|---|---|
| Museum hub | v0.87 already renders a complete 7 × 7 × 3.4 m room shell, entry enclosure, doorway pockets, skirting, coves, mounted edges, contact shadows, shared architectural materials, and tiered reflections. | Preserve it. Do not duplicate or replace its shell; retain its current on-demand rendering and v0.87 visual-regression coverage. |
| Interactive gallery | `SceneManager` provides a clear-colour/PMREM presentation space and `ArtworkMesh` renders one physical-material plane. It has no wall, floor, ceiling, returns, or mounted-object body. | Add a small gallery presentation stage and profile-aware artwork construction within the existing main-gallery renderer. |

The reported “cut-off room” appearance is therefore not a v0.87 hub topology
defect. In the active gallery path it is principally a missing-architecture
problem: the camera can reveal clear colour/IBL space around a single painting
plane because there is no shell to light, shade, or terminate the view. Camera
near/far values (`0.1`/`100`) and ordinary frustum culling are not currently
the cause. The implementation must prove this assessment with before/after
captures before changing projection or disabling culling.

The requested v0.29 headings are not present in the current `plan.md` or
`FINDINGS.md`; the auditable current baseline is v0.87 and is the controlling
architecture for this plan.

### Audit record

| Area | Current implementation | Consequence for the future change |
|---|---|---|
| Renderer | `RendererManager` uses native antialiasing, sRGB output, `NoToneMapping`, exposure `1`, PCF-soft shadows, capped DPR, shader prewarming, diagnostics, and WebGL context loss/restoration. | Retain one gallery renderer and its recovery path. Validate a neutral colour-management decision before retuning lights; do not introduce a second renderer or a global tone-map switch casually. |
| Main scene | `SceneManager` has a 40° camera at z=7, near/far `0.1`/`100`, plus a PMREM `RoomEnvironment` at intensity `0.55`; it has no visible architectural geometry. | Add stage geometry to this scene through a core-owned component. Keep the PMREM as low-cost indirect/reflection support, not as a substitute for real walls. |
| Gallery lighting/post | `LightingSetup` supplies one animated warm spotlight, ambient fill, and optional cool point accent. `PostProcessing` has the existing low-strength bloom/FXAA pipeline. | Rebalance the existing limited light rig around real receiving surfaces. Do not add per-artwork spotlights, SSR, SSAO, real-time GI, or a default multi-pass effect. |
| Hub room | `HubRoomRenderer.buildEntryShell()` extends walls past the calibrated camera and closes the rear; its visible shell has correctly oriented faces rather than a `DoubleSide` workaround. | Reuse its architectural lessons and surface language, but keep hub and gallery renderer lifetimes/resource ownership independent. |
| Architecture materials | `ArchitecturalSurfaceFactory` already creates shared plaster, microcement, ceiling, trim, pocket, strip, and canvas-edge materials plus tileable procedural normal/roughness maps. | Generalise recipes or factory inputs only as needed so a gallery-stage material set is internally shared and disposable; do not share live Three.js resource ownership across renderer contexts. |
| Artwork mesh | `ArtworkMesh` is a segmented plane with aspect-aware scale and tangents. It has no backing, spacer, mount, frame, glazing, or receiving wall. | Evolve its one group into an optional physical mounted-work assembly while retaining its public texture/aspect contract and one active main artwork. |
| Painting surface | `PaintingMaterial` is a `MeshPhysicalMaterial` with authored maps, procedural fallbacks, preset defines, optional clearcoat/parallax/self-shadow, and an albedo-only debug mode. `emissiveMap` is bound but its normal effective intensity is `0`. | Make surface selection explicit and media-appropriate. Preserve the zero-emissive display path and albedo-only comparison; never use emissive fill to hide incorrect lighting. |
| Texture flow | `TextureManager` assigns sRGB to albedo and linear/no-colour treatment to data maps, warns above `MAX_TEXTURE_SIZE`, applies preset anisotropy, uploads/warm-ups resources, and owns disposal. `GalleryManager` has staged loading, readiness, adjacent/idle prefetch, cancellation, and context-restore work. | Keep this contract. Surface improvements must use shared small detail maps and must neither make customer imagery self-lit nor regress target-specific readiness. |
| Quality | `high`, `balanced`, and `battery` already control DPR, shadows, procedural-map size, shader paths, post-processing, hub surface quality/reflection, and coarse-pointer DPR. Automatic downgrades intentionally only diagnose pressure; they do not override a visitor’s selected preset. | Add only explicit gallery-stage/profile gates to this one policy. Preserve manual quality selection and lower-tier intentional fallbacks. |
| Customer flow | Sidecars supply free-text `surface`; importer-owned fields remain `id`, image data, `webglImage`, and dimensions. `surface` is display metadata and currently has no render effect. Generated preview files are ignored except the committed bundle when source runtime changes require regeneration. | Add a separately named, validated presentation contract. Do not infer render behaviour from arbitrary legacy `surface` prose or regenerate generated output for documentation-only work. |
| UX and lifecycle | German UI text, focus restoration, keyboard/touch navigation, reduced-motion handling, preload overlay, audio, responsive chrome, timeline virtualization, and suspend/resume logic are established. | Keep interactions and semantics unchanged. Route gallery-stage visibility and cleanup through existing lifecycle points; visual material work must not add reflection flicker, animated noise, or inaccessible controls. |

### Research basis and implementation decisions

The future implementation should use the following primary-source guidance,
recorded with the specific repository decision it supports:

| Primary source | Repository decision |
|---|---|
| [Three.js colour management](https://threejs.org/docs/index.html?q=color#manual/en/introduction/Color-management) | Continue to mark customer albedo/base-colour textures as `SRGBColorSpace` and keep normal, roughness, AO, height, and other data maps uncoloured/linear. Never decide a map’s colour space from its filename. |
| [Three.js WebGLRenderer](https://threejs.org/docs/index.html?q=ren#api/en/renderers/WebGLRenderer.toneMapping) | Validate output colour space and tone mapping as one controlled change. The current no-tone-map baseline is defensible for source-art fidelity; adopt a curve only if side-by-side albedo checks demonstrate that it preserves the supplied image better than neutral lighting calibration. |
| [Three.js MeshPhysicalMaterial](https://threejs.org/docs/index.html?q=meshphys#api/en/materials/MeshPhysicalMaterial) | Use standard physical-material roughness, normal, specular, and clearcoat controls before adding custom shader code. Reserve clearcoat/glazing for explicitly selected media profiles and gate it by quality. |
| [Three.js WebGLCapabilities](https://threejs.org/docs/index.html?q=capab#api/en/renderers/WebGLCapabilities.maxTextureSize) | Continue capability-aware source/map selection and reject or warn about texture dimensions beyond the renderer’s supported maximum rather than assuming desktop-size limits on mobile. |
| [Three.js `compileAsync`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.compileAsync) | Extend the existing prewarm sequence to the finite gallery-stage/profile variants so a newly selected work does not hitch while its material compiles. |
| [MDN `requestIdleCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) | Continue feature-detected, timeout-bounded idle work with a timer fallback; use it only for cancellable non-critical profile/map preparation, never for the selected artwork’s readiness path. |

No additional runtime dependency is justified. Three.js, browser canvas/image
decoding, the existing procedural-map factory, and the existing diagnostics are
sufficient for the scoped work.

### Non-negotiable design rules

1. **Artwork wins over effect.** Albedo stays the supplied source image; all
   physical cues come from restrained lighting, normal/roughness response,
   actual edge depth, and optional profile metadata. A visible weave, strong
   Fresnel overlay, broad dark self-shadow, or colour shift is a defect.
2. **One architectural language.** The interactive stage should visually relate
   to the v0.87 hub: warm/off-white mineral plaster, a restrained microcement
   or stone-like floor, ceiling separation, muted dark reveals, and controlled
   reflectivity. It must not impersonate a different room or use pure-black
   voids.
3. **Geometry earns its cost.** Add geometry only where it establishes a
   silhouette, light break, contact shadow, or visible architectural boundary.
   Use correct front-facing inward normals and normal bounding volumes; do not
   set `DoubleSide`, disable culling globally, or build unseen exterior walls to
   conceal an orientation error.
4. **One resource owner per renderer.** The hub and gallery use distinct
   renderers. Each scene may obtain the same material recipe, but each factory
   instance owns and disposes its own Three.js textures/materials.
5. **Finite, shared variants.** At most the documented presentation profiles
   and quality variants may compile. There must be no unique custom shader
   program, unique high-resolution PBR map bundle, or per-frame allocation for
   every artwork.
6. **Quality degrades gracefully.** A lower tier removes nonessential surface
   cues, shadows, and glazing before it compromises an image’s aspect, loading
   correctness, focusability, navigation, or clear error state.

### Delivery sequence

#### Phase 0 — Establish visual, colour, and performance baselines

1. Capture the current interactive-gallery and hub states before modifying
   geometry: wide desktop, standard desktop, narrow portrait, phone landscape,
   high-DPR desktop/phone, first entry, next/previous navigation, closest
   supported inspection zoom, return to hub, each quality preset, and simulated
   context restore.
2. Record, in diagnostics mode, gallery renderer snapshots for each state:
   drawing-buffer dimensions/pixel ratio, draw calls, triangles, geometries,
   textures, programs, and the selected preset. Treat these as comparison
   evidence, not universal hard-coded budgets.
3. Use the existing albedo-only debug mode to capture at least one supplied
   customer work and one fallback work. Record the output as the colour-fidelity
   control for light/tone-map decisions.
4. Inspect the active gallery camera frustum and all proposed stage bounds at
   extreme aspect ratios before implementation. Confirm that the current
   `0.1`/`100` near/far range contains the compact stage and that no existing
   object is erroneously culled. Change projection or a mesh bounding volume
   only when the evidence identifies it as the actual cause.
5. Establish the presentation-stage specification in one typed, named
   configuration rather than scattering dimensions and offsets through
   `main.ts`, scene construction, and shaders. Name physical intents
   (wall offset, return depth, ceiling height, reveal depth, artwork wall gap,
   maximum visible span) and calculate dependent bounds from them.
6. Confirm with a visual-design checkpoint that the scoped stage is sufficient.
   If it cannot make normal gallery views read as a coherent room without
   expanding into a free-roam environment, stop and revise the scope rather
   than quietly adding a large architectural subsystem.

#### Phase 1 — Add a compact, complete gallery presentation stage

**Likely files:** new `src/core/GalleryPresentationStage.ts`; targeted updates
to `src/core/SceneManager.ts`, `src/lighting/LightingSetup.ts`,
`src/main.ts`, `src/config/quality.ts`, and
`src/materials/ArchitecturalSurfaceFactory.ts`.

1. Create a core-owned stage component attached to the existing
   `SceneManager.scene`. It owns stage groups, architecture materials,
   quality application, visibility, resize-independent camera bounds,
   destruction, and no DOM/UI events.
2. Construct an intentionally small interior around the fixed inspection
   camera:
   - a continuous front display wall behind the mounted work;
   - a floor and ceiling meeting that wall with no clear-colour seam;
   - shallow left/right returns extending far enough beyond the camera
     position to cover wide desktop and portrait view cones;
   - an entry-side/rear closure only where it can appear through the
     supported inspection camera/view cone;
   - a slim base shadow gap and one recessed ceiling/cove reveal where their
     silhouette and grazing light explain depth.
3. Build all visible interior faces with outward geometry orientation chosen so
   their front faces point into the room. Use single-sided walls/floor/ceiling
   and correctly oriented `ShapeGeometry`/plane bases; use narrow box or
   simple extruded pieces only for visible returns, cove lips, skirting, and
   artwork bodies. Retain back-face culling and normal frustum culling.
4. Keep the room deliberately architectural rather than theatrical:
   - no doorway, pillar, or recess unless it is visible in the fixed gallery
     composition and clarifies scale;
   - no large invisible exterior shell;
   - no dense wall/floor tessellation;
   - no camera motion, orbit controls, or navigation-model change.
5. Mark stage surfaces as shadow receivers and limit shadow casters to the
   mounted-work body and documented small architectural elements. Ensure the
   artwork texture plane itself does not create a translucent or detached
   shadow artefact.
6. On gallery/hub route transitions, show the stage only for the gallery
   destination. It must not consume visible draw work underneath the hub.
   Route its preset rebind, dirty render request, and disposal through the
   existing `main.ts` orchestration without moving lifecycle ownership into the
   stage.
7. During resize, retain the existing single resize coordinator. Do not add
   competing window listeners; stage geometry remains metric and only the
   existing camera aspect/projection updates.
8. Dispose all stage geometries, materials, maps, and optional render targets
   idempotently on application cleanup. Rebuild/rebind only the resources
   required after a renderer context restoration, then prewarm before an
   interactive frame.

**Phase acceptance:** Every supported gallery aspect shows intentional floor,
wall, ceiling, and edge terminations. No edge exposes clear colour, a
back-facing plane, a missing ceiling, or a cardboard-box exterior. The hub
keeps its independently calibrated v0.87 shell unchanged.

#### Phase 2 — Reuse a restrained architectural surface system

1. Evolve `ArchitecturalSurfaceFactory` from hub-specific material ownership
   into a recipe-driven factory that can make a small stage-local set:
   `plasterWall`, `ceilingPlaster`, `microcementFloor`, `shadowReveal`,
   `trim`, and `artworkEdge`. Retain the hub’s current material names/outputs
   through a compatible adapter or explicitly migrate all hub callers in one
   reviewable change.
2. Create one tileable, low-frequency/micro-detail normal-and-roughness source
   per applicable surface role and quality size. Reuse it across surfaces with
   metric UV mapping; do not create a large image texture per wall or use
   procedural noise in every fragment.
3. Tune material roles by physical response, not arbitrary dark colour:
   - **plaster:** warm neutral base, high roughness, very small normal strength,
     barely perceptible broad tonal/roughness variation;
   - **floor:** restrained microcement/stone response with a moderate-to-high
     roughness floor and low normal amplitude; no wet, mirror-like, or
     alias-prone reflection;
   - **ceiling:** a slightly distinct rough plaster that catches cove light
     without reading as a dark lid;
   - **reveals/trim:** very dark charcoal/brown-grey painted material with
     visible roughness and edge response, never unlit pure black;
   - **artwork edge/backer:** muted canvas/board or optional frame material
     that receives light and casts the mounting shadow.
4. Use texture map colour-space rules consistently: only artistic/base-colour
   maps are sRGB; normal, roughness, AO, height, and procedural detail maps
   are non-colour data. Configure repeat wrapping, mipmaps, minification
   filtering, and anisotropy once at factory creation.
5. Keep map scales in scene/world units so a wall return, floor, and portrait
   work do not reveal stretched or visibly repeating detail. Verify at phone
   DPR and camera motion that detail neither shimmers nor forms a procedural
   grid.
6. Keep planar floor reflection confined to the static hub. The gallery stage
   should initially use the existing PMREM/roughness response only; add no
   gallery reflection render pass unless a later measured visual need justifies
   its own budget and lifecycle.

**Phase acceptance:** Architectural planes separate under light through
roughness, normal response, reveals, and restrained value contrast. Detail is
not recognisable as a repeated texture at normal viewing distance.

#### Phase 3 — Add explicit, backwards-compatible artwork presentation profiles

**Likely files:** `src/config/artworks.ts`, a new typed presentation-profile
module under `src/materials/` or `src/config/`, `src/gallery/ArtworkMesh.ts`,
`src/materials/PaintingMaterial.ts`, `src/materials/ProceduralTextureFactory.ts`,
`src/gallery/GalleryManager.ts`, `scripts/import-artworks.mjs`, and the
customer text guide/template.

1. Introduce an optional typed `presentation` field separate from the existing
   descriptive `Artwork.surface` string. `surface` remains display metadata and
   is never silently reinterpreted as rendering input.
2. Validate a small closed vocabulary in sidecars/import output. The default
   for absent or invalid data is `matte-print`: it preserves legacy artwork
   appearance and uses no synthetic canvas weave, no clearcoat, no frame, and
   no glass. Warn in the import report when a supplied presentation value is
   invalid, but do not fail otherwise valid artwork imports.
3. Support only these initial visual profiles:

| Profile | Surface response | Default physical construction | Lower-tier fallback |
|---|---|---|---|
| `canvas` | Subtle shared weave/detail normal plus low-frequency roughness variation; high roughness and restrained specular. | Stretched canvas edge/backer, tiny wall gap, physical cast/contact cue. | Keep the matte body; reduce/disable weave normal before altering albedo. |
| `fine-art-paper` | High roughness, faint non-directional paper grain, no varnish. | Thin paper/board backing and wall gap. | Flat matte normal/roughness response. |
| `matte-print` | Near-flat high-roughness print response with no invented media pattern. | Thin mount/backer and wall gap. | Identical visual intent with simplified geometry/maps. |
| `satin-print` | Moderately lower roughness with controlled, broad specular response. | Thin mount/backer and wall gap. | Matte-leaning roughness; no extra shader path. |
| `glazed-print` | Protected image with very restrained angle-dependent highlight. | Optional glazing only when explicitly selected; no default frame. | Reuse satin/clearcoat response, then matte response on battery. |

4. Make any frame an explicit presentation option, defaulting to `none` to
   preserve the current unframed interactive-gallery language. If selected,
   offer only a small shared-material vocabulary (for example slim
   powder-coated metal or restrained stained wood), built from four reusable
   rails with shallow bevel/highlight geometry. Do not restore side-preview
   meshes or make a frame mandatory.
5. Change `ArtworkMesh` from a texture plane alone to a group with stable
   subparts: image surface, shallow opaque backing/edge body, wall spacer, an
   optional shared-material frame, and an optional glazing layer. Reuse unit
   geometries and scale them per artwork aspect; update them atomically with
   the existing aspect calculation and retain one active work in the main
   gallery.
6. Let actual stage-wall shadowing provide the primary mounting cue. Use one
   subtle, shared contact-shadow card only if shadow quality is off or cannot
   provide a stable near-wall cue; it must sit behind the body, fade at its
   edges, and never darken the customer image.
7. Apply glass conservatively:
   - high may use a separate, thin shared-material glazing mesh only for
     explicitly glazed work, with depth ordering and opacity/roughness tuned
     against an albedo-only comparison;
   - balanced should prefer the material’s low-strength clearcoat response
     over an extra transparent draw;
   - battery uses no separate glass and no reflective overlay.
   Reject a treatment if it creates a grey veil, hides image detail, flickers,
   or produces a strong artificial Fresnel band.
8. Bind a profile through a finite material parameter set. Authored maps remain
   authoritative; profile defaults fill only missing roles. Avoid profile
   inference from title, medium, tags, image aspect, or arbitrary customer
   prose.
9. Refactor generic procedural fallback maps into shared profile-safe detail
   resources. Canvas-only directional weave must never bind to photographs,
   digital art, paper, or generic matte prints. Detail tiling stays
   aspect-aware in world units so it is neither stretched nor unstable while
   zooming.
10. Keep custom shader work minimal. Use `MeshPhysicalMaterial` map/roughness/
    normal/clearcoat support first. Restrict the existing custom detail-normal
    path to a fixed profile/quality matrix. Do not enable generic parallax or
    height-march self-shadow as a default canvas effect; retain such relief
    only if a measured, profile-specific high-tier experiment passes close
    inspection and mobile fallback review. The initial production default is
    normal/roughness detail without true displacement.
11. Preserve the `a` albedo-only debug comparison. The normal gallery path must
    leave `emissiveIntensity` at zero and must not use the albedo as a
    self-lighting workaround. Any changed material must be checked against
    albedo-only output for source hue, luminance, crop, and aspect fidelity.

**Phase acceptance:** A canvas, paper print, matte print, satin print, and
glazed print can each look like a mounted object under the same gallery light
without imposing canvas artefacts or reflections on the others. Existing
artwork imports continue to display as clean, unframed matte works.

#### Phase 4 — Preserve and strengthen texture/loading discipline

1. Keep `TextureManager` as the only owner of customer texture loading,
   colour-space assignment, filtering, anisotropy, capability diagnostics,
   fallback textures, upload, and disposal. Do not have profile components
   independently load or dispose customer albedo/PBR maps.
2. Select the existing `webglImage`/image source according to the current
   fallback contract, verify decoded dimensions against
   `renderer.capabilities.maxTextureSize`, and continue reporting oversize
   sources with artwork ID, decoded dimensions, selected source, preset, and
   limit. Never assume a desktop 16K limit on a phone.
3. Keep authored normal/roughness/specular/AO/height maps opt-in and correctly
   classified as non-colour data. Apply a profile’s shared fallback only for a
   missing role; do not overwrite a supplied authored map.
4. Reuse one small procedural texture bundle per
   `profile × quality-map-size` rather than generating a unique set for each
   artwork ID. Maintain a bounded cache and dispose superseded bundles when
   changing quality or shutting down.
5. Preserve current staged albedo-first loading, critical queue promotion,
   readiness ledger, GPU warm render, shader prewarm, adjacent prefetch,
   interaction deferral, stale-generation cancellation, and exact-ID hub
   selection behaviour. The selected work must remain renderable with the
   default profile while optional authored/profile resources are still pending.
6. Prewarm only the stage plus finite profile variants that can actually be
   shown for the active preset. Schedule speculative profile/map generation in
   the existing cancellable idle lane with its timeout/fallback, never ahead of
   visible navigation or initial entry.
7. Do not introduce an image-resizing or derivative-generation system in this
   work. The active high-resolution asset-delivery plan owns publish derivatives
   and source-size policy. This work may document expected texture targets and
   diagnostics, but must not duplicate source artwork bytes, mutate supplied
   imagery, or add a new image-processing dependency.

**Phase acceptance:** No selected artwork flashes untextured, changes colour
space, uses a wrong target after rapid hub selection, or produces an avoidable
navigation hitch because a profile resource compiled or decoded synchronously.

#### Phase 5 — Calibrate controlled gallery lighting and image quality

1. Before changing intensities, compare the current sRGB/no-tone-map renderer
   output with the albedo-only references from Phase 0. Keep
   `NoToneMapping` as the initial target because the project has LDR customer
   art and current documentation records colour-shift risk. Only adopt an
   alternate tone map after documented visual evidence shows better source
   fidelity across artwork and architecture; never choose it merely because it
   sounds more cinematic.
2. Replace the current flat appearance through a bounded light hierarchy:
   - one carefully aimed warm key/track spotlight for the displayed work and
     wall plane;
   - one low-intensity broad ceiling/cove fill that separates ceiling, wall,
     and floor without creating a hotspot;
   - the existing PMREM plus restrained ambient/environment contribution for
     stable dark-frame/reveal readability;
   - at most one non-shadowing cool/neutral accent where it visibly explains
     a return or prevents recesses from crushing.
3. Retain a single shadow-casting key light in the interactive gallery. Tune
   its target, cone, decay/distance, normal bias, and map resolution against
   the actual mounted body/wall instead of adding a shadow-casting light for
   each work. The light should create a soft near-wall cue, not a detached
   rectangle or harsh floor shadow.
4. Explicitly gate shadow maps through quality settings: high uses one
   documented 1024-pixel map; balanced uses one documented 512-pixel map;
   battery disables gallery shadows. Confirm the actual values after device
   testing and put them in the single `QualityPreset` policy, not local light
   constants.
5. Keep bloom at the established extremely low/disabled settings and verify
   that white plaster does not bloom, clip, or make UI contrast unreliable.
   Do not add SSR, SSAO, real-time GI, volumetrics, dynamic probe updates, or
   a high-cost post-processing pass as a default path.
6. Ensure reduced motion stops only animated presentation behaviour. It must
   not reduce image resolution, turn realistic materials into placeholders, or
   introduce pulsing light/noise. Stage lighting should normally settle into a
   stable still image.

**Phase acceptance:** White walls retain separation without blown highlights,
reveals/frames retain form without crushed black, floor response is controlled,
and source artwork remains legible and attractive rather than self-lit.

#### Phase 6 — Extend one capability-aware quality policy

Add documented gallery-stage fields to `QualityPreset` rather than creating
ad-hoc device checks. The exact field names can follow repository conventions,
but their behaviour must be equivalent to this matrix:

| Control | High | Balanced | Battery |
|---|---|---|---|
| Effective DPR cap | Existing `1.6`, including existing coarse-pointer cap | Existing `1.25` | Existing `1.0` |
| Gallery key shadow | Enabled, one 1024 map | Enabled, one 512 map | Disabled |
| Architecture/detail-map tier | Shared full detail at a documented bounded tile size | Smaller shared detail map | Minimal/shared map or flat high-roughness material |
| Texture anisotropy | `min(device maximum, 4)` | `min(device maximum, 2)` | `1` |
| Artwork micro-detail | Profile-safe normal/roughness only; no default relief march | Reduced normal/roughness detail | No procedural microdetail |
| Clearcoat/glazing | Explicit profile only; controlled clearcoat or thin glazing | Clearcoat-style response only where it is visually necessary | Disabled |
| Gallery floor reflection | PMREM/roughness only | PMREM/roughness only | Diffuse/no reflection |
| Extra post-processing | Existing conservative policy only | Existing conservative policy only | Existing disabled/minimal policy |

1. Preserve the current `MAX_TEXTURE_SIZE` check, device max-anisotropy
   protection, coarse-pointer DPR cap, and manual quality lock. Do not introduce
   user-agent sniffing or silently lower a visitor’s selected preset.
2. When a preset changes, apply it atomically to renderer, post-processing,
   lights, `ArtworkMesh`/material, `GalleryManager`, gallery stage, and hub.
   Request the existing dirty frames and prewarm only necessary programs.
3. Add diagnostics for active profile, stage/material detail tier, selected
   shadow strategy/map size, anisotropy cap, glazing state, effective DPR, and
   profile fallback reason. Extend the renderer snapshot only with inexpensive
   static fields.
4. Establish comparison budgets from Phase 0. Review draw calls, triangles,
   texture count/memory implications, program count, and interaction frame
   timing at every tier. If the compact stage or selected profile exceeds its
   agreed measured budget, simplify geometry/material variants before lowering
   artwork resolution.
5. Retain no per-frame geometry rebuild, texture allocation, shader-define
   mutation, random noise update, or dynamic reflection target. Quality changes
   may rebind/recreate bounded static resources outside a frame-critical
   interaction path.

#### Phase 7 — Integrate safely with existing orchestration and recovery

1. Keep `main.ts` as the sole owner of boot sequencing, preferences,
   diagnostics, resize coordination, render-loop routing, lifecycle suspension,
   hub/gallery destination registration, and disposal. New stage/profile
   classes expose narrow methods such as apply preset, apply presentation, mark
   visible, restore resources, and dispose; they do not install global
   listeners.
2. Preserve the existing destination behaviour: entering gallery shows the
   current exact target, resets only the existing inspection view as today,
   enables current input, and focuses the canvas; returning to hub hides the
   artwork/stage, restores hub selection/focus, and changes no German copy.
3. Update context-loss/restoration coordination so stage materials and selected
   profile resources are re-applied before the first restored render. Retain
   clear-colour token reconciliation, loading/error notices, current artwork
   target, quality choice, and diagnostic events.
4. Keep page visibility/freeze suspension and the existing dirty-render policy.
   No background idle task may mutate or render stage resources while a gallery
   transition, pointer interaction, hidden page, context loss, or disposal is
   active.
5. Maintain keyboard, touch, pinch/pan, timeline, topbar back action,
   preferences, fullscreen, audio, reduced motion, high contrast, clean chrome,
   focus outlines, and loading overlay semantics unchanged unless a narrow
   integration test proves an adjustment is necessary.

### File-impact map for the implementation PR

| File or area | Intended responsibility |
|---|---|
| `src/core/GalleryPresentationStage.ts` (new) | Gallery-only shell group, stage-local architecture resources, preset/visibility/cleanup API. |
| `src/core/SceneManager.ts` | Own scene/camera attachment and disposal ordering only; retain camera/PMREM authority. |
| `src/materials/ArchitecturalSurfaceFactory.ts` | Shared surface recipes/maps with renderer-local ownership; preserve hub outputs. |
| `src/lighting/LightingSetup.ts` | Bounded key/fill/accent calibration and one-shadow-map policy. |
| `src/config/quality.ts` | Single explicit stage/profile quality matrix. |
| `src/config/artworks.ts` and a typed profile module | Optional validated presentation metadata without redefining descriptive `surface`. |
| `src/gallery/ArtworkMesh.ts` | Aspect-synchronised mounted-work group, backer/spacer/optional frame/glaze geometry, and cleanup. |
| `src/materials/PaintingMaterial.ts` | Finite profile parameters and conservative physical-map binding; retain albedo-only debug and zero-emissive default. |
| `src/materials/ProceduralTextureFactory.ts` | Shared profile-safe fallback detail bundles, bounded caching, no universal canvas treatment. |
| `src/gallery/TextureManager.ts`, `src/gallery/GalleryManager.ts` | Existing loading/resource ownership plus profile-aware fallback, warm-up, diagnostics, and cancellation. |
| `src/main.ts` | Wiring only: route visibility, current-profile application, preset fan-out, context restore, and disposal. |
| `scripts/import-artworks.mjs` | Validate/pass optional presentation metadata while retaining nonfatal sidecars and importer-owned asset fields. |
| `docs/CUSTOMER_TEXT_GUIDE.md`, `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt` | Explain the optional presentation field, valid values, defaults, and examples only if the importer contract ships. |
| `README.md`, `ARCHITECTURE_MAP.md`, `FINDINGS.md`, `plan.md`, `CHANGELOG.md` | Update current behaviour/ownership, durable decisions, implementation status, and release history when runtime work ships. |
| `customer-preview/` | Regenerate only if importer/runtime/preview source changes make the generated local-preview output stale; never regenerate for this planning entry alone. |

### Validation plan for the implementation PR

1. Start from a clean checkout with `npm install`. Do not claim a fresh install
   if package installation cannot complete; record the exact failure.
2. Run the existing required gates:
   - `npm run import:artworks` when importer/manifest behaviour changes;
   - `npm run docs:check-config-authority`;
   - `npm run lint`;
   - `npm run build:typecheck`;
   - `npm run build`;
   - `npm run test:frame-budget`;
   - `npm run validate:museum-hub`;
   - `npm run validate:museum-hub:visual` and the applicable filtered
     `scripts/visual-regression.mjs` baseline/capture/compare workflow when
     browser tooling and baselines are available;
   - `node -c scripts/import-artworks.mjs` if the importer changes.
3. Extend visual regression intentionally rather than relying on one screenshot:
   - gallery desktop, wide desktop, narrow portrait, phone portrait/landscape,
     and one high-DPR capture;
   - initial loading/press-to-start, first gallery entry, rapid next/previous
     navigation, timeline selection, close inspection zoom/pan, and return to
     hub;
   - each quality tier, one explicit canvas/paper/matte/satin/glazed fixture,
     and a legacy artwork without presentation metadata;
   - context loss/restoration with the selected profile/stage visible;
   - existing hub room, doorway-edge, wall-focus, and selection-return states
     unchanged.
4. Check manual accessibility/UX at each applicable visual state: German text
   unchanged, focus ring visible over wall/floor, keyboard navigation and
   Escape/back focus restoration intact, controls readable above the stage,
   touch targets unobstructed, high contrast viable, reduced motion static, and
   loading/error states still explicit.
5. Compare renderer diagnostics to the Phase 0 baseline for high, balanced,
   and battery: effective pixel ratio/resolution, calls, triangles, geometry,
   texture/program counts, and interaction frame-time pressure. Describe
   texture-memory and shader-read trade-offs qualitatively; do not invent
   hardware-wide millisecond or memory claims.
6. Verify colour/material behaviour manually with albedo-only debug: source
   crop/aspect/hue/luminance remain credible, normal/roughness cues do not
   alter pixels, glass does not veil art, and no generic weave appears on
   non-canvas media.
7. Scan every changed/created file for secrets before commit. Review disposal,
   context restoration, stale async work, map colour-space assignment, shader
   compile variants, and user-provided metadata validation before requesting
   review.

### Explicit deferrals and rejection criteria

- Do not add HDRI downloads, a new asset pipeline, texture compression
  dependency, automatic artwork resizing, external 3D assets, free roaming,
  orbit controls, real-time global illumination, SSR, SSAO, volumetrics,
  default depth-of-field, or heavy bloom.
- Do not use true high-density displacement or universal parallax; profile
  detail must remain normal/roughness-led unless a later high-tier experiment
  proves a close-up benefit without mobile instability.
- Do not add a default decorative frame, glazing, canvas weave, or speculative
  material profile. Existing customer imports must remain intentionally clean.
- Do not change customer originals, base64/image delivery policy, or GitHub
  Pages size strategy in this work; coordinate with the active high-resolution
  asset-delivery plan instead.
- Reject any implementation that fixes an apparent opening by globally enabling
  `DoubleSide`, disabling frustum culling, adding invisible giant geometry, or
  hiding it with an opaque post-process/background gradient.

### Pull-request evidence and definition of done

The implementation PR must state:

1. the gallery-versus-hub root cause of the former unfinished-edge appearance;
2. the architectural material and mounted-artwork profile decisions;
3. exact lighting/shadow/tone-map decision and colour-fidelity evidence;
4. quality-tier safeguards, rendering/texture implications, and mobile
   fallbacks;
5. changed files and their ownership boundaries;
6. every validation command/result plus unavailable checks and exact reasons;
7. intentionally deferred work from the list above.

Visual acceptance checklist:

- [ ] The interactive gallery reads as a complete, intentionally bounded
  architectural presentation at desktop, tablet, and phone aspect ratios.
- [ ] Floor, walls, ceiling, returns, and reveals have subtle believable
  separation without texture repetition, missing faces, or clear-colour gaps.
- [ ] Artworks read as mounted physical works, not flat self-lit images.
- [ ] Canvas, paper, matte, satin, and optional glazing remain restrained and
  never obscure, recolour, or pattern the supplied art.
- [ ] All colour/data maps use correct colour-space treatment and albedo-only
  comparison confirms image fidelity.
- [ ] High-quality material/shadow/glass cues reduce deliberately through
  balanced and battery presets without breaking loading or navigation.
- [ ] Hub geometry, customer import compatibility, timeline/input/accessibility,
  loading states, lifecycle handling, and context recovery show no regression.

## Implemented — Square-room hub architectural quality tiers (v0.87, 2026-08-02)

- The hub room now renders as a complete 7 × 7 × 3.4 m square shell:
  calibrated front/left/right walls, an entry enclosure behind the camera, dim
  doorway passage pockets, base skirting shadow gaps, recessed ceiling light
  coves, shallow artwork side depth, and soft contact shadows.
- `ArchitecturalSurfaceFactory` now owns the shared
  wall/floor/ceiling/trim/pocket/light-strip/artwork-edge materials plus
  tileable procedural normal/roughness maps keyed by
  `QualityPreset.hubSurfaceTileSize`.
- Quality presets now apply to the hub renderer at runtime: pixel-ratio cap,
  surface tile size, hub skylight shadows, and floor reflection mode. High and
  balanced use downscaled on-demand planar reflections; battery downgrades to a
  diffuse, no-reflection, no-shadow hub floor path.
- The committed local preview bundle (`customer-preview/freyraum-gallery.js`)
  was regenerated so the file:// workflow matches the runtime source.

### Validation boundary

- Required repository gates for this change were `npm run import:artworks`,
  `npm run docs:check-config-authority`, `npm run lint`,
  `npm run build:typecheck`, `npm run build`, `npm run test:frame-budget`, and
  `npm run validate:museum-hub`.

## Implemented — Authoritative 3D museum-hub room pipeline (v0.86, 2026-08-01)

- The hub now owns a dedicated 3D room scene with wall meshes, floor/ceiling
  surfaces, and wall-mounted artwork planes rendered through one camera instead
  of projecting artwork images with per-slot DOM transforms.
- The shipping `museum-hub.json` contract is now v4: camera far/lens-shift,
  room envelope, global hanging rules, wall transforms/drawable regions/
  exclusion polygons, and normalized slot UV/scale/z-offset metadata are all
  persisted in the authored config.
- Slot resolution now enforces doorway exclusion and drawable-region
  containment before projection, then deterministically falls back to the next
  valid wall bucket when a wall becomes unusable.
- The DOM layer remains only for interaction, focus, and accessibility: slot
  buttons derive their clip path + bounds from projected quads while the 3D
  scene owns visible artwork perspective.
- `?hubDebug=1` now exposes projected anchors/world quads alongside the existing
  wall/safe-zone/doorway diagnostics, and the fatal fallback screen path now
  inherits the authoritative grey token before it renders.
- Regression coverage now hard-fails on the v4 room contract, fallback wall
  buckets, perspective foreshortening, neutral-grey fallback, and the presence
  of the dedicated `.museum-hub__canvas` scene bridge.

### Validation boundary

- Required repository gates remain
  `npm run import:artworks`, `npm run docs:check-config-authority`,
  `npm run lint`, `npm run build:typecheck`, `npm run build`,
  `npm run test:frame-budget`, `npm run validate:museum-hub`, and filtered
  `scripts/visual-regression.mjs baseline|capture|compare` runs against a local
  HTTP server serving `customer-preview/`.

## Implemented — Museum-hub realism, selection, and wall-token hardening (v0.85, 2026-08-01)

- The hub now treats configured stage quads/safe polygons as photographed
  reference surfaces while reconciling stored room-local wall planes to those
  references at resolve time. Slot anchors, hanging bands, doorway exclusions,
  and mounted heights are scaled with the calibrated room model before any slot
  projection runs.
- `solveRoomArtworkPlacement()` is now a deterministic room-local solver: it
  scores stable safe-region and doorway-clear candidates, shrinks only when
  necessary, and records an explicit adjustment/rejection outcome. Slots whose
  calibrated projection still fails are suppressed from the runtime DOM instead
  of rendering as floating invalid buttons.
- Hub selection is artwork-ID based instead of focus-only. Gallery navigation
  continuously synchronizes the current artwork back into the hub, reselects the
  matching slot/page on return, restores focus to that selected slot, and keeps
  hover/focus/selected affordances visually aligned.
- One wall-surface application path now owns CSS variables, document/app shell
  backgrounds, renderer clear color, fallback background override, transition
  diagnostics, and WebGL context-restore reapplication. Transition boundaries
  emit structured wall-surface snapshots for regression tooling.
- Regression coverage now includes doorway-edge placement fixtures,
  wall-realism/residual gates, invalid-slot suppression checks, persistent
  selection round trips, transition-surface diagnostics, and WebGL restore
  token verification.
- The Playwright screenshot harness now performs a pre-screenshot hub/background
  fail-safe audit, records attempted/failed asset URLs plus fallback outcome in
  `capture-report.json`, downgrades 404 room images to `museum-empty.png` or
  the neutral wall token, and keeps screenshot capture running.

### Validation boundary

- Required repository gates remain
  `npm run import:artworks`, `npm run docs:check-config-authority`,
  `npm run lint`, `npm run build:typecheck`, `npm run build`,
  `npm run test:frame-budget`, `npm run validate:museum-hub`, and
  `npm run validate:museum-hub:visual`.
- `node scripts/visual-regression.mjs capture` is now the no-baseline capture
  path; `FREYRAUM_VISUAL_STATE_FILTER` can scope it to targeted screenshot
  states such as missing-background fail-safe checks.

## Implemented — Calibrated 3D museum room reconstruction (v0.84, 2026-08-01)

- Replaced the hub's runtime placement path with one camera-calibrated
  wall-local → world → camera → NDC → stage projection chain.
- Shipping config now carries v3 room planes, local doorway voids, hanging
  bands, metric-like anchors, and a bounded room-background fallback.
- Hub asset loads now flow through one safe wrapper that records structured 404
  diagnostics, downgrades missing shipped/reference assets to `museum-empty.png`
  or the neutral wall token, and keeps validation running.
- Debug rendering and deterministic regression checks cover validity flags,
  horizon/vanishing guides, grey-token reach, and the missing-asset path.
- Remaining validation evidence is recorded in `CHANGELOG.md`.

## Completed — Museum-hub plane topology + diagnostics hardening (v0.83, 2026-08-01)

### Decisions

- The shipping hub geometry now models four physical wall planes
  (`wall-left-outer`, `wall-left-inner`, `wall-right-inner`,
  `wall-right-outer`) instead of two coarse left/right quads.
- Canonical slot IDs remain stable, but baseline/default/customer slot
  placements are remapped to the correct physical plane. v1 migration now
  resolves legacy placements through this four-plane topology.
- Safe-zone validation now compares projected stage-space artwork corners to
  stage-space `safePolygon` coordinates (the previous local-vs-stage mismatch
  is removed).
- Resolver fitting now applies an explicit contain-style policy and clamps slot
  placements toward valid drawable regions before emitting geometry warnings.
- Added read-only `?hubDebug=1` overlay/diagnostics (wall quads, safe polygons,
  projected quads, slot centers/corners, local axis guides, per-slot
  homography/containment snapshots) without enabling calibration edits.
- Added `npm run validate:museum-hub`, expanded visual-regression hub state
  coverage (wide desktop, narrow portrait wall focus, extreme aspect fixtures),
  optional debug-overlay capture, and CI execution of the geometry gate.
- Local launcher shell now uses the authoritative gallery wall token baseline so
  startup shell tone matches runtime wall surfaces.

### Validation boundary

- Required repository gates remain
  `npm run docs:check-config-authority`, `npm run lint`,
  `npm run build:typecheck`, `npm run build`, and `npm run test:frame-budget`.
- Focused hub checks are now `npm run validate:museum-hub` and
  `npm run validate:visual compare` (with optional
  `FREYRAUM_VISUAL_INCLUDE_HUB_DEBUG=1` diagnostic capture).

## Completed — Wall-plane museum hub projection (v0.82, 2026-08-01)

### Decisions

- The museum hub now uses a versioned v2 wall-plane contract in
  `customer-artworks/museum-hub.json`: fixed stage size, calibrated wall quads,
  safe polygons, wall-local mounted sizes, and exact `Artwork.id` slot mapping.
- Slot geometry is derived from wall-local placement through shared planar
  projection, not per-slot `rotateY()` or contain-fit frame boxes. Native
  artwork aspect is preserved on the wall plane and every artwork on the same
  wall shares one projection model.
- Museum hub artworks are unframed in normal runtime states. Frame shells,
  aperture mats, bevels, and decorative rims were removed; only subtle contact
  shadowing plus focus-only affordances remain.
- `?hubCalibrate=1` now edits wall corners, safe-zone points, and slot
  placement/size directly against the projected stage, exports full v2 JSON,
  surfaces overlap/convexity/safe-zone/size warnings, and can restore the last
  valid configuration snapshot.
- `#D8DDDB` is the authoritative wall token across CSS fallback surfaces,
  customer config, hub composition, and the WebGL clear color.
- Regression coverage now includes hub screenshots in `scripts/visual-regression.mjs`
  plus a dedicated geometry script (`scripts/test-museum-hub-geometry.mjs`) for
  migration, projection, and overlap assertions.

### Validation boundary

- Required repository gates remain `npm run docs:check-config-authority`,
  `npm run lint`, `npm run build:typecheck`, `npm run build`, and
  `npm run test:frame-budget`.
- Focused hub checks additionally include `node scripts/test-museum-hub-geometry.mjs`,
  browser calibration review, and hub visual-regression baseline/compare runs.

## Completed — Manifest-Driven Museum Hub Composition (v0.81, 2026-07-31)

### Decisions

- The hub is a DOM composition: `museum-empty.png` is the only runtime room
  image and every active `Artwork.id` receives exactly one selectable framed
  slot unless explicitly disabled. The complete visible frame is one native
  `<button>` (visual bounds = hit bounds). No second WebGL scene: frames use
  shared static CSS material presets and perspective transforms, with
  roughness/metalness translated once into highlight/shadow strengths so a
  future WebGL upgrade stays possible.
- One customer configuration: `customer-artworks/museum-hub.json`
  (`window.__FREYRAUM_MUSEUM_HUB` via the existing generated customer script).
  The v0.79/v0.80 `hub-hotspots.json` array is temporarily migrated with a
  deprecation warning; `src/config/hubHotspots.ts` was replaced by
  `src/config/museumHub.ts`.
- Resolution contract: exact `Artwork.id` values are authoritative and produce
  immutable slot→artwork / artwork→slot maps. Explicit mappings first,
  deterministic aspect-aware placement second (portrait/landscape/
  square/panoramic intended-use matching, then stable ID order), paginated
  overflow last (`room-NN.*` page-qualified slot IDs, four per page, no cap).
  Duplicate slot IDs / duplicate artwork mappings are rejected; invalid
  explicit mappings disable that slot and never open another artwork; missing
  image data shows a neutral placeholder retaining the exact valid target;
  zero valid slots exposes one generic gallery-entry action.
- Selection is ID-based with a generation/abort token owned by the hub
  controller in `main.ts`: the target ID resolves again on activation, its
  albedo/PBR work is promoted to the critical queue, readiness prefers
  `albedoLoaded && materialApplied && shaderCompiled`, and the 1500 ms timeout
  enters the same exact target with its procedural surface. Stale completions
  are ignored; there is no fallback to the gallery's previous/current artwork.
- The design coordinate space stays exact 1366:768 (`--hub-aspect` from config)
  with `contain`-fit artwork inside apertures; centers align to the eye-level
  band (`cy ≈ 0.515`); the customer profile maps `fraktal` to
  `room-01.wall-left.outer` and `akt-27` to `room-01.wall-right.inner`, and the
  built-in fallback maps all four defaults across the baseline inventory (the
  fourth slot is a panoramic placement over the empty right wall).
- `#E2E4E3` is the final wall color: `--color-gallery-wall` is authoritative,
  `--color-museum-wall` defaults to it (validated customer override allowed via
  `visualTokens`), hub edge gradients derive from the token, and the resolved
  value is passed into `RendererManager` (no independent `0xeef1f3`). The
  loading screen intentionally stays dark.
- Back control: first in the left topbar grid region, dedicated
  `topbar__back-btn` class/lifecycle (never shares chrome-btn hide rules),
  48 px dark filled desktop surface / 44–48 px phone target with short
  "Museum" label, dual-contrast 3 px focus ring, `aria-label="Zurück zum
  Museum"`, busy/disabled state during navigation, visible in clean, visible,
  and presentation modes. Return runs through one idempotent router action
  shared with guarded Escape and restores focus to the source hub slot.
- Loading: hub preparation starts at construction (parallel with gallery
  startup); background + first-page decode complete under the overlay as the
  final weighted progress step; later pages decode via idle callbacks that
  cancel when a gallery transition begins; `museum-target.png` is excluded
  from the public sync (reference asset only).
- Narrow portrait (aspect < 4:5) splits room pages into wall-focus views
  driven purely by CSS custom-property transforms on the one shared visual
  box; off-wall frames leave the actionable set (`is-off-wall`). Resize only
  recalculates the shared transform in a debounced animation frame.

### Validation boundary

- Automated: importer, doc-authority, lint, typecheck, build, frame-budget,
  script syntax checks. Browser matrix: exact-ID routing for both customer
  slots, back/Escape focus restoration, wall-focus paging, phone labels,
  token reach (CSS custom property + body gradient + renderer parameter).
- Future-only: responsive AVIF/WebP hub derivatives (current assets are the
  committed PNG masters), automated projected-bound screenshot matrix, and a
  WebGL frame-material upgrade path.

## Completed — Hub Visual Reliability Closure (2026-07-31)

### Decisions

- The hub uses the committed `museum-target.png` and `museum-empty.png` assets,
  not GitHub attachment URLs. `file://` preview resolves the committed source
  folder directly; hosted builds receive `/backgrounds/` through the existing
  customer-public sync step.
- Customer hotspots were calibrated from the supplied 1366 × 768 reference
  image without inspecting the local target image. `fraktal` maps to the
  left-hand portrait and `akt-27` maps to the centre-right square.
- Built-in hotspot defaults use the same four visible artwork bounds. Generic
  wall-band derivation remains the fallback for other manifests.
- When artwork hotspots exist, the legacy central entry target is hidden and
  initial/error focus moves to the first artwork hotspot, including after the
  press-to-start overlay releases focus.
- The idle authored-texture sweep skips artworks without authored sets and
  advances before scheduling, preventing synchronous callback recursion.
- Dialog and preferences Escape handlers consume the key before global
  back-navigation, and the gallery canvas is an explicit programmatic focus
  target after hub entry.
- Hub backgrounds remain separate files. They must not be imported as Vite
  module assets because library mode inlines them into the local-preview
  JavaScript bundle.

### Validation boundary

- Validate importer/public sync, both Vite outputs, hosted and `file://` path
  selection, exact hotspot placement, focus behavior, and missing-image
  fallback without opening the prohibited local target image for inspection.

## Completed — Hub Hotspot Navigation (2026-07-31)

### Decisions

- Hub hotspots map stable ordinal slots (`slot-1 … slot-N`) to artwork IDs by
  exact ID string (never by index), with `@order:<n>` as an opt-in positional
  alias. One editable config model lives in `src/config/hubHotspots.ts`; the
  customer override is `customer-artworks/hub-hotspots.json`, injected as
  `window.__FREYRAUM_HUB_HOTSPOTS` by `scripts/import-artworks.mjs`.
- Hotspot coordinates are normalized `(cx, cy, w, h)` in `[0, 1]` relative to
  the hub image content box (`.museum-hub__visual` is a fixed 16:9 box with
  `object-fit: fill`, so CSS percentages map 1:1 — no image pixels are read).
  Defaults derive deterministically from the wall-band formula and manifest
  aspect metadata; unmatched manifests fall back to order-derived hotspots.
- Missing/invalid artwork IDs use `fallback_to_gallery_default`: the slot stays
  visible and clicking it enters the gallery at its current index with a
  `hub-hotspot-fallback` diagnostic. Nothing blocks or error-screens.
- Valid selections jump the gallery via `goTo` + prefetch promotion behind a
  readiness gate (`materialApplied && shaderCompiled`, 1500 ms timeout, then
  entry proceeds on the procedural surface with a
  `hub-hotspot-readiness-timeout` diagnostic).
- Back navigation: Topbar "Museum" button and Escape (guarded against open
  dialogs/panels and fullscreen) route through `destinationRouter.navigate('hub')`.
- Background token `--museum-wall-light: #ECEBE8` is the hub base fill
  (letterbox area, image-error state, hotspot focus-ring backdrop).
- Non-dev calibration: a config query flag (see `docs/QUERY_PARAMETERS.md`)
  enables drag-to-move / corner-resize with a live JSON copy panel that
  round-trips into `customer-artworks/hub-hotspots.json`.

### Validation boundary

- Hotspot coordinates were derived from scene/layout data and manifest
  metadata only; fine placement against the hub photograph is expected to go
  through the calibration flow, not code changes.

## Completed — Main Museum Hub (2026-07-31)

### Decisions

- Startup is `loading → hub → gallery`; the existing gallery remains the only
  initial registered destination.
- The supplied museum-room image is a static hub backdrop. Its central artwork
  is the accessible pointer/keyboard entry target for the existing gallery.
- A small destination registry owns transition locking, prepare/enter/exit hooks,
  state reporting, error recovery, and disposal. Future rooms register against
  the same contract instead of adding navigation branches to `main.ts`.
- Gallery assets retain the existing staged preload and GPU-warm contract.
  Gallery canvas, keyboard, swipe, zoom, and pan input stay disabled in the hub.
- The transition is a short fade only; reduced-motion mode switches immediately.
  No free-roam, orbit, or cinematic camera system is introduced.

### Validation boundary

Required gates are config-authority, lint, typecheck/build, frame-budget
equivalence, visual review, secret scanning, and parallel code/security review.

## Completed — fixed presentation cleanup (2026-07-19)

### Decisions

- Keep one internal dramatic lighting configuration; remove selection and
  persistence rather than retaining dormant profile branches.
- Render only the painting plane. Frame geometry, materials, preset fields, and
  diagnostics have no supported runtime path.
- Keep the timeline fixed and interactive in all responsive layouts. Clean-chrome
  manages the information panel and navigation controls only.
- Treat `Artwork.surface` as optional display text. Authored texture maps and
  quality presets remain the only inputs to painting material behavior.
- Remove side-preview meshes and canvas click raycasting; retain primary
  timeline, arrows, swipe, and keyboard navigation.
- Use `#eef1f3` for both the CSS foreground background and WebGL clear color.

### Validation boundary

Required gates are lint, typecheck/build, importer syntax, config-authority check,
and frame-budget equivalence. Regenerate customer manifests to migrate imported
surface metadata.

## Active plan — high-resolution asset delivery beyond GitHub upload limits (2026-07-07)

> **Phase: Planning/docs only.** No importer, runtime, or deployment behavior
> changed in this pass.

### Problem summary

The current GitHub Pages workflow requires the original customer artwork files to
be committed in `customer-artworks/inbox/`, then:

1. `scripts/import-artworks.mjs` copies them into `customer-preview/images/`.
2. The importer embeds the exact original bytes again as base64
   `webglImage` data URLs in `customer-preview/customer-artworks.js`.
3. `scripts/sync-customer-public.mjs` copies the generated assets into
   `public/` for the Vite/Pages build.

That architecture is not reliable for very large originals:

- GitHub browser uploads are limited to **25 MiB** per file.
- Regular Git warns above **50 MiB** and blocks files above **100 MiB**.
- GitHub Pages published sites may be no larger than **1 GB**.
- Git LFS is **not usable for GitHub Pages site assets**.
- One large image is effectively duplicated across tracked source files,
  generated image files, and a base64-expanded JS payload.

### Decision

Adopt a **two-tier asset model** for high-resolution artwork support:

1. **Master/original images live outside the Pages repo** (local operator
   archive or separate storage).
2. **GitHub-tracked assets become a publish bundle** of web-safe derivatives and
   compact metadata only.
3. **GitHub Pages builds only from the publish bundle**.
4. **`file://` reliability fallbacks remain local-only** and must not ship as
   full-size base64 payloads in the deployed manifest.

### Rejected approaches

| Approach | Why it is rejected |
|---|---|
| Keep exact original files in `customer-artworks/inbox/` and commit them | Still hits GitHub browser upload limits, 100 MiB Git hard block, and Pages 1 GB site ceiling. |
| “Just use Git LFS” for published artwork assets | GitHub’s own documentation says Git LFS cannot be used with GitHub Pages sites. |
| Keep embedding exact original bytes in committed `customer-artworks.js` | Base64 expands file size and duplicates the heaviest assets inside JS, making deploy artifacts and startup payloads scale poorly. |

### Execution plan

#### Phase 1 — Split masters from published assets

- Define a **local-only master artwork source** for high-resolution originals.
- Define a **tracked publish bundle** for the GitHub-safe derivatives that are
  actually deployed.
- Update ownership/docs so operators know which files are archival inputs and
  which files belong in Git.

#### Phase 2 — Change the importer contract

- Make the importer generate publish-ready derivatives from the master files.
- Stop shipping full-size `webglImage` payloads in the committed/deployed
  manifest.
- Keep any `file://` compatibility fallback local-only, so local preview
  reliability is preserved without bloating Pages artifacts.
- Extend the import report with source size, published size, and total site-size
  budget warnings.

#### Phase 3 — Add enforceable budget gates

- Add validation that fails when tracked publish assets exceed the agreed upload
  budget.
- Add a total published-site budget gate so the Pages artifact stays comfortably
  below the 1 GB ceiling.
- Add a manifest/JS budget gate so customer metadata cannot silently become a
  giant transport for image bytes.

#### Phase 4 — Update the customer publishing workflow

- Keep masters in a local/external archive.
- Run the local updater to produce GitHub-safe publish assets.
- Commit and push only the publish bundle that is intended for Pages.
- Document the fallback path for archival storage separately from the Pages
  runtime path.

### Acceptance criteria

- A customer can start from a source image that is **larger than 25 MiB** and
  still publish the gallery successfully to GitHub Pages.
- No GitHub-tracked publish file needs to exceed the browser-upload-safe budget.
- The deployed Pages site stays below GitHub’s site-size limit.
- Local preview remains reliable when opened from `file://`.

### Validation targets for the implementation PR

- `npm run lint`
- `npm run build:typecheck`
- `npm run build`
- `npm run docs:check-config-authority`
- `npm run test:frame-budget`

## Active remediation plan — documentation/tooling consolidation (2026-06-21)

### Goals

1. Enforce canonical documentation ownership.
2. Eliminate cross-document runtime/config drift.
3. Preserve historical rationale in archive docs instead of operational docs.
4. Add enforceable freshness and dependency-validation safeguards.

### Active work items

- [ ] Rewrite top-level docs to single-purpose scope.
- [ ] Keep `docs/QUERY_PARAMETERS.md` as the only config reference.
- [ ] Add source-of-truth matrix to `README.md`.
- [ ] Add `CONTRIBUTING.md` freshness and architecture-drift policy.
- [ ] Add documentation authority check script and CI workflow.
- [ ] Run dependency audit and document risky upgrades with migration path.

### Historical context

Long-form historical planning has been moved to:

- `docs/archive/plan-history-2026-06-21.md`

---

## v0.74 — Performance remediation completion execution (2026-06-21)

> **Phase: Shipped runtime/tooling remediation.** This addendum corrects the
> partial execution verdict against the original v0.74 plan and records what was
> completed in this pass.

### Execution verdict update

The reviewer-identified gaps are addressed as follows:

| Item | Status | Execution record |
|---|---|---|
| Phase 0 / Tier 0 idle render | Shipped first step | rAF remains alive for sampling and convergence tracking, but `postProcessing.render()` is skipped once lighting, gallery animation, readiness work, and dirty-frame cooldowns are all settled. |
| OPT-1 viewport metrics | Complete | `GalleryManager.update()` now computes metrics/bounds once per frame and passes them through target zoom/pan clamping. Cached `fovTan` remains in place. |
| OPT-2 frame geometry cache | Shipped | Cache is scoped to `frameMesh.geometry` by aspect + bevel state. It does not write `artworkMesh.geometry`, so the previous OPT-2/OPT-9 conflict rationale does not apply to this implementation. |
| OPT-3 rolling stats | Already complete | Existing O(1) `FrameBudgetMonitor` behavior retained and covered by `npm run test:frame-budget`. |
| OPT-4/5/6 | Deferred | Still visual-risk changes; require Type A approval with the expanded matrix before shipping. |
| OPT-7 vector reuse | Complete | `RendererManager` snapshot scratch remains; `GalleryManager.handlePanelClick()` now reuses a scratch `THREE.Vector2`. |
| OPT-8 / T1-C diagnostics | Complete | Debug entries are not stored, serialized, deduped, or printed unless diagnostics mode is `verbose`; lazy payload factories avoid object construction on skipped debug paths. |
| OPT-9 | Deferred | Still requires Type A plus artwork-geometry ownership design. |
| OPT-10 | Deferred | Tier 3 startup work remains dependent on startup measurements. |

### Tooling/gate upgrades

- `scripts/visual-regression.mjs` now captures a deterministic lighting profile × artwork step × zoom matrix instead of only default/debug entry states.
- The visual regression script runs Type B invariant checks before every screenshot and fails the run on violations.
- `PerformanceMetrics` now exposes Tier 1 threshold evaluation for GC events/minute and GC pause P99 through `window.__FREYRAUM_PERF_TOOLS__.checkTier1Thresholds()`.
- Type A remains an on-demand browser gate because it requires Playwright/browser dependencies, but its matrix and invariant enforcement are no longer only documented.

### Remaining boundaries

- Visual-risk GPU changes (bloom, shadow, panel transparency, LOD/parallax) remain intentionally unshipped until the expanded Type A matrix is baselined and compared in a browser.
- GPU active time, true GC profiling, and parallax texture-read thresholds still require browser/GPU instrumentation beyond static CI.
- Future OPT-9 LOD work must provide an active `maxArtworkTriangles` invariant threshold when the LOD path exists.

---

## v0.74 — Performance Audit & Optimization Plan (2026-06-21)

> **Phase: Planning only. No code changes.**
> Authored from static analysis of the full source tree at commit HEAD (v0.73 baseline).

---

### Executive Summary

The FREYRAUM gallery runtime is a single-artwork WebGL viewer built on Three.js with a custom PBR painting material, procedural frame shader, post-processing pipeline (bloom + OutputPass), and a staged texture-preloading system. The overall architecture is sound: draw call count is very low (4–15 per frame depending on preset), the scene graph is minimal, and frame-rate-independent smoothing is used throughout. However, several compounding inefficiencies exist across CPU, GPU, memory, and the startup pipeline that limit peak frame stability and constrain headroom for future feature work.

**Main findings:**

| Category | Severity | Location |
|---|---|---|
| Per-frame viewport measurement cascade | High | `GalleryManager.update()` |
| Per-frame redundant `Math.tan`/`degToRad` | High | `GalleryManager` zoom/pan helpers |
| Redundant manual `updateMatrixWorld()` | Medium | `main.ts` animate loop |
| Per-frame GC pressure from `FrameBudgetMonitor.snapshot()` | Medium | `FrameBudgetMonitor.ts` |
| Per-frame `getRendererSnapshot()` `new THREE.Vector2()` | Low | `RendererManager.ts` |
| Frame geometry rebuild on every artwork navigation | High | `ArtworkMesh.updateAspect()` |
| Shadow map render passes on 2–3 spotlights | High (GPU) | `LightingSetup.ts` |
| Transparent side-panel overdraw | Medium (GPU) | `SidePanels.ts` |
| Bloom pass internal ping-pong framebuffers | Medium (GPU) | `PostProcessing.ts` |
| ProceduralTextureFactory CPU buffer GC | Medium | `ProceduralTextureFactory.ts` |
| Startup quality-preset pre-warming (3 full cycles) | Medium | `main.ts` boot |
| `console.debug` calls on artwork navigation | Low | `ArtworkMesh.ts` |

---

### Phase 0: Architectural Root Cause — Always-On Render Loop (Tier 0)

> **Elevated from Phase 9 footnote to Tier 0.** Static analysis and reviewer consensus confirm this is the single largest systemic inefficiency in the runtime — larger in total impact than all Tier 1–2 micro-optimizations combined.

#### 0.1 The Core Inefficiency

The render loop (`animate()` in `main.ts`) runs **unconditionally at display refresh rate** (60–120 Hz) regardless of scene state. During the primary use-case — a user passively viewing a static painting — every frame executes:

- Full shadow map passes (2–3× base scene render cost)
- Full bloom pipeline (10 FBO blits at near-zero contribution on high preset)
- Full PBR fragment shading across the artwork plane (~76M texture reads/frame on high preset)
- Full CPU update chain (`smoothDamp` × 10, viewport metrics cascade 2–4×, `FrameBudgetMonitor` scans)
- Continuous GC pressure from `FrameBudgetSample` allocation (60 objects/second)

None of this work produces any change to the rendered image when:
- The camera is fully settled (no in-progress animation, no user input)
- No lighting animation is running (`reducedMotion = true` or non-animated profile)
- No texture load or quality preset change is pending

**Output is identical to the previous frame, but the full GPU and CPU budget is consumed anyway.**

#### 0.2 Why This Is Tier 0 (Not Tier 3)

| Factor | Assessment |
|---|---|
| Impact magnitude | Eliminating idle rendering removes ~90–97% of all GPU + CPU work during static viewing |
| Relative to Tier 1+2 combined | Single change outweighs all micro-optimizations for typical usage (static viewing dominant) |
| Battery / thermal | GPU fan, device warmth, and battery drain are directly proportional to idle render rate |
| Implementation risk | Moderate — Three.js and the browser RAF model support this cleanly |
| Prerequisite for future work | Dirty-flag system enables animation budget accounting and power-profile reporting |

The previous "Tier 3" classification reflected implementation effort, not impact. Approach A below is incremental and low-risk.

#### 0.3 Root Cause: No Render Suppression When Settled

`animate()` has two correct early exits:

```typescript
if (pageInactive) return;                        // ✓ tab-hidden
if (rendererManager.isRenderPaused()) return;    // ✓ context-lost
```

There is no exit for **"nothing has changed since the last frame"**. Even when all `smoothDamp` targets equal their current values, all 10 calls execute, their results are written to camera/pan/tilt state, and `postProcessing.render()` follows unconditionally.

`adaptiveQuality.evaluate()` is already locked (correct no-op), but the actual render is not gated.

#### 0.4 Architecture Decision Rule

> **One primary architecture; one fallback; one emergency mode. Do not co-implement all three simultaneously.**

Engineers reading the three approaches below should treat them as a **staged deployment sequence**, not a menu of equally valid options:

| Role | Approach | When to use |
|---|---|---|
| **Primary** | Approach A — Dirty-flag + frame cooldown | Ship first; lowest coupling risk; keeps rAF alive (safe for smoothDamp convergence tracking) |
| **Fallback** | Approach C — rAF throttle | One-day interim while Approach A is designed; remove once Approach A is stable |
| **Emergency / future** | Approach B — `setAnimationLoop(null)` loop suspension | Only after Approach A is fully validated; introduces FrameBudgetMonitor coupling (see Phase 13) |

Shipping Approach A and Approach B together creates a conflict: Approach A keeps rAF running for convergence tracking; Approach B stops it entirely. **Design one primary model per release.** The natural progression is C (quick win) → A (production) → optionally B (maximum power saving, Tier 3).

#### 0.4 Implementation Approaches

---

**Approach A — Dirty-Flag + Frame Cooldown (Recommended first step; lowest risk)**

Introduce a minimal `_dirtyFrames` counter in `GalleryManager` (or a thin `AnimationStateTracker` class):

```typescript
// src/gallery/AnimationStateTracker.ts  (new file, ~40 lines)
export class AnimationStateTracker {
  private _remaining = 0;

  /** Call from any state-change source (input, navigation, texture load, resize) */
  markDirty(frames = 4): void {
    this._remaining = Math.max(this._remaining, frames);
  }

  /** Call once per RAF tick; returns true if this frame should render */
  consume(): boolean {
    if (this._remaining > 0) { this._remaining--; return true; }
    return false;
  }

  /** Force at least one more dirty frame regardless of current count */
  nudge(): void { this._remaining = Math.max(this._remaining, 1); }
}
```

In `main.ts animate()`:

```typescript
// After existing early-exit guards, before galleryManager.update():
const shouldRender = animState.consume();
if (!shouldRender) {
  frameBudget.sample(now);  // keep timing stats accurate
  return;
}
```

**Where to call `markDirty()`:**

| Source | Where to insert `markDirty()` | Frames hint |
|---|---|---|
| Pointer/touch/keyboard input | `pointerdown`, `pointermove`, `keydown` handlers | 4 |
| Navigation (`navigateTo`, `goNext`, `goPrev`) | `GalleryManager` navigation methods | 8 |
| Zoom/pan target change | Any setter that changes `targetZoom`, `targetPanX/Y` | 4 |
| Texture load completion | `TextureManager` load callback | 2 |
| Quality preset change | `applyPreset()` | 4 |
| Window resize | Resize debounce handler | 4 |
| Lighting animation | `LightingSetup.update()` on animated ticks | 2 |
| Startup warm phase | Always-on until first interaction | ∞ |

**Convergence detection for `smoothDamp`:**

Add a shared helper to detect when a `smoothDamp` value has converged:

```typescript
function isSettled(
  current: number, target: number, velocity: number,
  posEps = 1e-4, velEps = 1e-4,
): boolean {
  return Math.abs(target - current) < posEps && Math.abs(velocity) < velEps;
}
```

When *all* animated values in `GalleryManager` are settled and `_dirtyFrames === 0`, the render loop naturally sleeps.

---

**Approach B — `renderer.setAnimationLoop(null)` + Event-Driven Restart**

Fully stop the RAF loop after an idle timeout; restart on next user input. This produces zero GPU work during sleep:

```typescript
// src/core/RenderLoopController.ts  (new file, ~60 lines)
export class RenderLoopController {
  private _active = true;
  private _idleTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly _renderer: THREE.WebGLRenderer,
    private readonly _tick: XRFrameRequestCallback,
  ) {}

  wake(idleTimeoutMs = 2000): void {
    if (!this._active) {
      this._active = true;
      this._renderer.setAnimationLoop(this._tick);
    }
    // Reset idle countdown
    if (this._idleTimer) clearTimeout(this._idleTimer);
    this._idleTimer = setTimeout(() => this._sleep(), idleTimeoutMs);
  }

  private _sleep(): void {
    this._renderer.setAnimationLoop(null);
    this._active = false;
  }
}
```

Attach `controller.wake()` to all input entry points: `pointermove`, `pointerdown`, `keydown`, `wheel`, timeline scroll, info panel open, audio playback resume.

**Trade-offs vs Approach A:**
- Approach B eliminates even the rAF overhead during sleep (stronger savings)
- Approach B requires wrapping every input event source correctly (missing one = stale render after interaction)
- Approach A is safer for first implementation — it still runs rAF but skips the GPU render
- Recommended sequence: **ship Approach A first**, validate, then optionally escalate to B

---

**Approach C — rAF Throttle (Simplest, for quick-win interim)**

```typescript
const IDLE_FPS = 5;
const IDLE_INTERVAL = 1000 / IDLE_FPS;
let lastRenderTime = 0;
let isRenderIdle = false;  // set by dirty-flag logic

function animate(now: number) {
  requestAnimationFrame(animate);
  if (isRenderIdle && now - lastRenderTime < IDLE_INTERVAL) return;
  lastRenderTime = now;
  // ... full render path
}
```

This reduces idle cost by ~92% (60 → 5 fps equivalent GPU work) without eliminating it. Suitable as a one-hour interim fix while Approach A is being implemented properly.

#### 0.5 Interaction with Existing Features

| Feature | Impact | Notes |
|---|---|---|
| WebGL context loss/restore | None | `isRenderPaused()` guard is orthogonal |
| PageInactive guard | None | Tab-hidden path unchanged |
| AdaptiveQualityController (locked) | None | Lock mode is already a no-op |
| Background audio | None | Audio does not require visual rendering |
| Loading overlay | Dirty-on during boot | `markDirty(∞)` or always-on flag until entry CTA clicked |
| Quality preset pre-warming | Dirty-on during warm | Ensure warm frames are not suppressed |
| GPU texture warming | Dirty-on during warm | Same as above |
| Timeline scroll | `markDirty()` on scroll | Timeline DOM scroll is not the render loop |

#### 0.6 Expected Savings Summary

| Scenario | Current frames/s | After Approach A | GPU savings |
|---|---|---|---|
| Static idle viewing (dominant use case) | 60–120 | 0–3 (tail) | ~97% |
| Active zoom/pan | 60–120 | 60–120 | 0% |
| Navigation transition + settle | 60–120 for ~500 ms | 60–120 for ~500 ms + tail | ~0% active, ~95% settled |
| Artwork fully loaded, zero input | 60–120 | 0–1 keepalive | ~98% |

This single architectural change is the highest-leverage optimization available and should be the **first item designed** even if implemented incrementally via Approach C → A → B.

---

### Phase 1: Full System Model

#### 1.1 Rendering Pipeline

```
rAF tick
  ├── GalleryManager.update(now)           // CPU: smoothing + zoom/pan + camera writes
  ├── LightingSetup.update(now)            // CPU: sin animation, spot position write
  ├── camera.updateMatrixWorld()           // CPU: manual matrix rebuild (redundant)
  ├── KEY_LIGHT_WORLD → KEY_LIGHT_VIEW     // CPU: transformDirection call
  ├── material.setKeyLightDirView()        // CPU: uniform write
  └── PostProcessing.render()             // GPU: full render pipeline
        ├── RenderPass                    // GPU draw: 4 scene objects
        ├── UnrealBloomPass (if enabled)  // GPU: 5–7 internal ping-pong passes
        └── OutputPass                   // GPU: color-space conversion pass
```

Shadow maps (high/balanced presets only) are rendered before the RenderPass as an implicit extra pass per shadow-casting light (2–3 spotlights). Each shadow map is a full depth-only render of the entire scene.

#### 1.2 Scene Graph

```
scene
  ├── AmbientLight
  ├── SpotLight × 2–3  (shadow-casting when preset.shadows=true)
  ├── spotTarget (Object3D)
  ├── PointLight (accent, profile-dependent)
  ├── artworkMesh.group
  │     ├── frameMesh   (ExtrudeGeometry + MeshPhysicalMaterial w/ custom shader)
  │     └── artworkMesh (PlaneGeometry + MeshPhysicalMaterial w/ onBeforeCompile)
  ├── leftPanel   (PlaneGeometry × 1, MeshBasicMaterial, transparent)
  └── rightPanel  (PlaneGeometry × 1, MeshBasicMaterial, transparent)
```

Total draw calls per frame (without shadows): 4 objects = 4 draw calls.
With shadows (2 lights): 2 × 4 + 4 = 12 draw calls.
With bloom: adds 5–7 internal passes at downsampled resolutions.

#### 1.3 Update Loop (per-frame CPU work)

Every `requestAnimationFrame` tick in `main.ts` executes:

1. `frameBudget.sample(now)` — 3 linear passes over a 60-element ring buffer
2. `adaptiveQuality.evaluate()` — locked, constant-time no-op after lock check
3. `lightingSetup.update(now)` — one `Math.sin()` + one position write (animated profiles only)
4. `galleryManager.update(now)` — **most expensive CPU work** (see §2.1)
5. `camera.updateMatrixWorld()` — redundant manual call
6. Key-light direction transform — one `copy` + one `transformDirection` (6-multiply dot product)
7. `material.setKeyLightDirView()` — uniform struct write
8. `postProcessing.render()` — compositor render

#### 1.4 Asset Loading Pipeline

Startup sequence:
1. Device capability detection
2. `RendererManager` construction (WebGL context creation)
3. `TextureManager.init()` — queries GPU max anisotropy/texture size
4. `GalleryManager` construction — creates readiness ledger for all artworks
5. **Albedo preload** — `Promise.all` for first N artwork URLs
6. **PBR texture set preload** — per artwork, per role
7. **Procedural map generation** — CPU-side for each artwork × role × tileSize
8. **Quality preset pre-warming** — 3 full preset cycles (high → balanced → battery)
9. **Artwork GPU warming** — render each artwork through full post-processing pipeline
10. **UI chrome pre-build** — force-layout on 15+ DOM selectors

#### 1.5 Memory Ownership Model

- `TextureManager` owns all network-loaded textures (URL-keyed cache, never evicted until `dispose()`).
- `ProceduralTextureFactory` owns all generated `DataTexture` instances (artworkId+role+size keyed, never evicted).
- `ArtworkMesh` owns geometry; frame geometry is rebuilt on every artwork navigation.
- Post-processing `EffectComposer` owns 3–4 internal `WebGLRenderTarget` framebuffers at full canvas resolution.

---

### Phase 2: Bottleneck Identification

#### 2.1 CPU Bottlenecks

---

**CPU-1 — Viewport measurement cascade inside `update()` (High)**

*File:* `src/gallery/GalleryManager.ts` — `update()`, `clampZoom()`, `clampPanTargets()`, `getZoomBounds()`, `getViewportMetrics()`

*Root cause:* `update()` calls `clampZoom(this.targetZoom)` which calls `getZoomBounds()` with no argument, triggering `getViewportMetrics()`. It also calls `clampPanTargets()` which calls `getPanLimits()` → `getViewportMetrics()` + `getZoomBounds()` again. Total per-frame: the `viewportMetricsProvider` callback in `main.ts` is invoked 2–4 times per frame. That callback reads three CSS custom properties via `getComputedStyle(document.documentElement)` and calls `getBoundingClientRect()` on up to four cached DOM elements. CSS custom property reads and `getBoundingClientRect()` are layout-triggering on some browsers if layout is dirty.

*Impact:* 2–4 redundant layout reads per frame. On mobile (where layout cost is higher) this can add 0.5–2 ms per frame. Scales with the number of chrome DOM elements observed.

*Frame stability:* Yes — periodic forced-layout can cause jank spikes when CSS layout is invalidated by other DOM changes (e.g. timeline scroll, info panel open).

---

**CPU-2 — Redundant `Math.tan(degToRad(...))` inside per-call helpers (High)**

*File:* `src/gallery/GalleryManager.ts` — `getInspectionMinZoom()` line 1566, `getResetFitZoom()` line 1578, `getPanLimits()` line 1541

*Root cause:* `Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5))` is computed independently in each of three methods that are called on the same frame. The camera FOV (`40°`) never changes at runtime. `Math.tan` of a constant is a constant.

*Impact:* 3 redundant `Math.tan` + `degToRad` computations per frame when any zoom/pan helpers are active. Minor individually, but compounds with CPU-1 since these helpers are always called from the update chain. Scales with animation complexity.

*Frame stability:* Low — these are fast operations, but eliminating them reduces jitter in tight CPU frames.

---

**CPU-3 — Redundant `camera.updateMatrixWorld()` in the render loop (Medium)**

*File:* `src/main.ts` line 1680 — inside the `animate()` function

*Root cause:* `camera.updateMatrixWorld()` is called manually before extracting the key-light view direction. However, `postProcessing.render()` (which calls `composer.render()` → `renderer.render()`) already calls `scene.updateMatrixWorld()` on the camera during the render pass. The manual call happens *before* the render, at a point when the camera position has just been updated by `galleryManager.update()`. If this is intentional (to get the correct matrix for the uniform), the manual call is necessary — but the camera's `matrixAutoUpdate` flag should be set to `false` with the matrix explicitly managed to eliminate the redundant internal update during render. If the camera always auto-updates during render, the pre-render manual call is still redundant because the uniform only needs to be set before the fragment shader runs (during render), not before `postProcessing.render()`.

*Impact:* One matrix multiplication per frame (4×4 matrix inverse). Negligible on desktop, measurable on slow mobile CPUs.

*Frame stability:* Low.

---

**CPU-4 — `FrameBudgetMonitor.sample()` linear scans per frame (Medium)**

*File:* `src/utils/FrameBudgetMonitor.ts` — `sample()`, `countAboveBudget()`, `countSevereFrames()`

*Root cause:* Every frame, `sample()` performs:
- 1 full linear scan to compute rolling average (up to 60 iterations)
- `countAboveBudget()`: another full linear scan
- `countSevereFrames()`: another full linear scan

Total: 3 × 60 = 180 scalar comparisons per frame, returning a new `FrameBudgetSample` object each time (heap allocation). At 60 fps: 10,800 iterations/second and 60 object allocations/second just for budget monitoring.

*Impact:* Minor CPU cost (~0.05–0.1 ms/frame). More significant is the GC pressure from 60 `FrameBudgetSample` object allocations per second — these are short-lived and trigger minor GC every few seconds.

*Frame stability:* GC can cause 1–5 ms hitch frames when the minor heap is collected.

---

**CPU-5 — `console.debug` calls on artwork navigation (Low)**

*File:* `src/gallery/ArtworkMesh.ts` lines 70, 139, 233, 285

*Root cause:* `console.debug` is called unconditionally (not behind a diagnostics mode check) during `ArtworkMesh` construction, frame geometry rebuild, and artwork seed updates. The calls on lines 139 and 233 occur during `makeFrameGeometry()` and `replaceFrameGeometry()`, which are triggered on every artwork navigation. `console.debug` in modern browsers is cheap but not free — it serializes the argument object and sends it to the DevTools pipe.

*Impact:* ~0.1–0.5 ms per navigation in DevTools-attached sessions. Not a hot-path cost per frame, but visible as a navigation spike in profiler traces. In production without DevTools attached the cost is negligible.

*Frame stability:* Low in production; moderate during development.

---

#### 2.2 GPU Bottlenecks

---

**GPU-1 — Shadow map render passes for 2–3 spotlights (High)**

*File:* `src/lighting/LightingSetup.ts`, `src/config/quality.ts`

*Root cause:* On `high` and `balanced` presets, `preset.shadows = true` enables `castShadow` on all spotlights. Three.js renders one depth-only shadow map pass per shadow-casting light, *before* the main render. With 2 spotlights active, the scene is rendered 3 times per frame (2 shadow maps + 1 main pass), before any post-processing. With 3 spotlights: 4 render passes. All scene objects (artwork, frame, side panels) are drawn in each shadow pass even though none of the scene objects are physically large enough to cast interesting inter-object shadows in this constrained scene.

*Impact:* 2× shadow map passes ≈ doubles the base GPU render workload before post-processing. On mobile GPUs, this is one of the most expensive single optimizations available. Scales with light count and shadow map resolution.

*Mobile GPU note:* Mobile GPU shadow cost is not just extra passes — shadow maps incur **texture bandwidth saturation** on tile-based deferred rendering (TBDR) architectures (all iOS GPUs, many Android GPUs). The shadow map depth texture must be fully resolved to memory and re-fetched during the lighting pass, causing disproportionate bandwidth spikes even at low shadow map resolutions. A 1024×1024 shadow map on a tile-based GPU can cost 2–4× more than on an immediate-mode desktop GPU, not just 2× more render passes.

**Additional TBDR nuance — smaller render targets and shadow resolution:**  
Tile-based GPUs tile the screen into ~32×32 pixel bins and render each bin entirely in on-chip memory before flushing to DRAM. A key implication: *reducing the shadow map render target size has disproportionate benefit on TBDR compared to immediate-mode GPUs*. On a desktop GPU, halving shadow map resolution (1024→512) saves ~75% of fill rate cost. On a TBDR GPU, the same reduction additionally cuts the tile memory footprint required for the depth render, which can reduce the number of tile passes (or eliminate overflowing the tile buffer entirely) — yielding savings well beyond the naïve ×4 area ratio. Shadow resolution reduction (Approach B in OPT-5) is therefore a **higher-priority win on Apple Silicon and Android TBDR devices** than on desktop and should be validated and shipped early in Step 5 for mobile targets.

*Frame stability:* Yes — shadow maps allocated at fixed resolution can cause memory pressure on low-VRAM devices.

---

**GPU-2 — Bloom pass `UnrealBloomPass` internal ping-pong framebuffers (Medium)**

*File:* `src/core/PostProcessing.ts`

*Root cause:* `UnrealBloomPass` allocates 10 internal WebGLRenderTargets (5 for the downsample pyramid, 5 for the upsample pyramid). On `high` preset, `bloomStrength = 0.04` — an extremely low value. The bloom effect at 0.04 strength adds almost no visible contribution to a scene with `bloomThreshold = 1.2` (which means only fragments brighter than 1.2 linear — far beyond what any non-HDR surface in this scene produces). The bloom pass therefore processes 10 framebuffer textures per frame to produce a near-zero contribution.

*Impact:* 10 texture reads/writes at downsampled resolutions per frame for negligible visual output (strength 0.04, threshold 1.2). Each ping-pong blit is a full-screen quad render. On battery preset bloom is correctly disabled (strength 0.0).

*Frame stability:* The 10 FBO blit operations add ~0.3–1 ms GPU time on mid-range hardware. This cost is incurred even if the scene has no bloom-eligible pixels.

*Validation requirement (before disabling):* Because `THREE.NoToneMapping` is used and materials are not HDR, the assumption that "no scene pixel exceeds luminance 1.2" is almost certainly correct — but must be verified. Specular highlights on PBR artwork materials can produce luminance spikes depending on artwork texture content. **Required validation step:** measure peak scene luminance (histogram or max-pixel probe) across all artworks and all quality presets before committing to bloom disable. A single bright specular spike could produce a visible artifact if bloom was previously masking it. A one-frame luminance probe via `readRenderTargetPixels` into a small downsampled buffer (e.g., 64×64) is sufficient.

---

**GPU-3 — Transparent side-panel alpha blending overhead (Medium)**

*File:* `src/gallery/SidePanels.ts`

*Root cause:* Both side panels use `MeshBasicMaterial` with `transparent: true, opacity: 0.95`. Near-opaque transparent objects (opacity 0.95) are drawn in Three.js's transparency pass (after opaque objects), which bypasses depth-write optimizations and requires the GPU to blend with the framebuffer. The panels are offset to the sides (`x = ±4.9`) and angled, so their contribution to overdraw of the main artwork is minimal — but transparent objects still force a separate render bucket and fragment blending on every pixel they cover, even at opacity 0.95 where the visual difference from opacity 1.0 would be undetectable.

*Impact:* Minor per-frame blending cost for 2 plane meshes at fixed positions. The bigger issue is that transparent objects force Three.js to sort them by distance every frame (though with only 2 transparent objects the sort is trivial). Setting `opacity = 1.0` and `transparent = false` would allow depth write optimization and eliminate the alpha-blend stage.

*Frame stability:* Low — but removing this is a free 1-draw-call optimization.

*Validation requirement (before committing):* The visual difference between `opacity: 0.95` and `opacity: 1.0` is sub-perceptual on calibrated displays, but must be validated via **side-by-side render comparison at all exposure levels and all lighting profiles** (gallery-soft, raking, spotlight). If any profile produces a noticeable hard edge where the panel meets the background, consider keeping `opacity: 0.99` with `transparent: false` (Three.js transparently handles this — setting opacity < 1 forces transparent mode, so the exact threshold is `opacity === 1.0`). Alternative: add a soft gradient to the panel texture instead of relying on material opacity.

---

**GPU-4 — Frame geometry rebuild on every artwork navigation (High — CPU+GPU combined)**

*File:* `src/gallery/ArtworkMesh.ts` — `updateAspect()` → `replaceFrameGeometry()`

*Root cause:* When artwork aspect changes on navigation, `updateAspect()` calls `replaceFrameGeometry()` which:
1. Disposes the old `ExtrudeGeometry`
2. Reconstructs `THREE.Shape` + `THREE.Path` (hole)
3. Runs `new THREE.ExtrudeGeometry(shape, options)` — CPU mesh generation
4. Calls `assignFrameBarUVs()` — O(vertexCount) loop over all frame vertices
5. Calls `geometry.computeTangents()` — O(triangleCount) tangent computation
6. Uploads the new geometry to the GPU (buffer upload)

On the `high` preset the frame geometry with bevel is moderately complex. This entire pipeline runs synchronously on the main thread, blocking for 1–5 ms during each artwork navigation.

*Impact:* Navigation stall of 1–5 ms on the main thread. GPU stutter from buffer upload. Geometry is recreated even when transitioning between two artworks of identical aspect ratio.

*Frame stability:* Yes — causes a visible navigation-frame spike in profiler traces.

---

**GPU-5 — Artwork plane vertex count: 180×180 segments on high preset (Medium)**

*File:* `src/config/quality.ts` — `artworkSegments: 180`

*Root cause:* On `high` preset the artwork plane is subdivided into 180×180 quads = 32,400 quads = 64,800 triangles for a single flat rectangle. The high subdivision exists to support the parallax UV offset shader (which needs smooth UV gradients) and the self-shadow march. However, a PlaneGeometry at this resolution sends ~65K vertices through the vertex shader every frame even when the camera is at the default overview distance where individual vertex positions are sub-pixel.

*Impact:* 65K vertex shader invocations per frame for a flat plane. At close zoom, the subdivision is warranted for parallax. At overview distance, it is pure overhead. Fragment shader cost dominates at close distances, so the vertex cost is relatively more significant at overview distance.

*Frame stability:* Moderate — contributes to GPU vertex processing budget.

---

#### 2.3 Memory Bottlenecks

---

**MEM-1 — ProceduralTextureFactory Uint8Array temporaries (Medium)**

*File:* `src/materials/ProceduralTextureFactory.ts` — `generateNormal()`, `generateHeight()`, etc.

*Root cause:* Each procedural map generation allocates a `new Uint8Array(size * size * 4)`. On high preset with `tileSize = 1024`, each role allocates 4 MB of temporary data. With 7 roles × 4 MB = 28 MB of CPU-side temporary buffers per artwork on high preset (though generation is amortized by the cache). In inspection mode (`tileSize = 2048`), the cost quadruples: 3 roles × 16 MB = 48 MB of temporaries for geometry-carrying roles alone. These buffers are GC-eligible after `DataTexture` construction, contributing to major GC pauses if multiple artworks are generated in quick succession during the startup warm sequence.

*Impact:* 28–48 MB of GC-eligible buffer allocations per un-cached artwork. At startup warming 7–15 artworks, this can trigger 1–3 major GC cycles during the loading overlay phase (not user-visible, but can extend startup time by 50–200 ms on constrained devices).

*Frame stability:* Low during runtime (cached), High during startup warmup.

---

**MEM-2 — `FrameBudgetMonitor.snapshot()` per-frame object allocation (Medium)**

*File:* `src/utils/FrameBudgetMonitor.ts` — `snapshot()`, `sample()`

*Root cause:* `sample()` returns `this.snapshot()` which allocates a new `FrameBudgetSample` object (7 numeric + 1 boolean fields) every call. At 60 fps this produces 60 allocations per second. While V8's young-generation GC handles this efficiently in isolation, it compounds with other per-frame allocations (diagnostics objects, etc.) to create background GC pressure.

*Impact:* ~60 × (8 fields × ~8 bytes each) ≈ ~3.8 KB/s in young-generation heap churn. Minor GC collections every 1–3 seconds, each taking 0.5–2 ms.

*Frame stability:* Minor GC hitches.

---

**MEM-3 — `new THREE.Vector2()` in `getRendererSnapshot()` (Low)**

*File:* `src/core/RendererManager.ts` line 148

*Root cause:* `getRendererSnapshot()` creates `new THREE.Vector2()` to call `renderer.getSize(size)`, then reads x/y from it. This method is called from a 5-second `setInterval` in diagnostics mode. Minor allocation, but unnecessary since `renderer.getSize()` can accept a reused vector.

*Impact:* Negligible — 1 allocation every 5 seconds.

---

**MEM-4 — `new THREE.Vector2()` in raycaster panel detection (Low)**

*File:* `src/gallery/GalleryManager.ts` line 1439

*Root cause:* `checkPanelClick()` creates `new THREE.Vector2(...)` per invocation. This is triggered by pointer click events, not per-frame, so the allocation rate is very low.

*Impact:* Negligible — event-driven, not per-frame.

---

**MEM-5 — Fallback texture 1600×1100 canvas allocation (Low)**

*File:* `src/gallery/TextureManager.ts` — `createFallbackTexture()`

*Root cause:* When a texture URL fails to load, a 1600×1100 canvas is created (`1600×1100×4 = ~7 MB RGBA`) and converted to a `CanvasTexture`. The canvas itself is kept alive as the texture's image source. If multiple artworks fail to load (e.g., first run before assets are available), multiple 7 MB canvas instances exist simultaneously.

*Impact:* 7 MB per failed texture. If all built-in artworks fail (e.g., before import), could hold several hundred MB of canvas memory simultaneously. The canvas is not explicitly disposed separately from the texture; it lives until the `TextureManager.dispose()` call.

*Frame stability:* Startup memory spike if many fallbacks are generated.

---

#### 2.4 Pipeline Bottlenecks

---

**PIPE-1 — Quality preset pre-warming: 3 full render cycles (Medium)**

*File:* `src/main.ts` — startup sequence (v0.55 quality preset warm)

*Root cause:* The startup sequence pre-warms shader programs for `high`, `balanced`, and `battery` presets by fully applying each preset (changing renderer state, material defines, pixel ratio), rendering a warm frame, then restoring the active preset. This compiles ~6–9 distinct shader programs (2 per preset × 3 presets for frame + painting materials). The full preset switch includes `applyPreset()` calls on renderer, post-processing, lighting, artwork mesh, and gallery manager.

*Impact:* 3 full preset cycles add ~200–600 ms to the startup sequence depending on device GPU shader compiler speed. However, this time is hidden under the loading overlay, so it does not affect perceived startup time. It does extend the time before the entry CTA becomes enabled.

*Frame stability:* No runtime impact — startup-only.

---

**PIPE-2 — `prewarmInteractiveChrome()` forced layout (Low)**

*File:* `src/main.ts` — `prewarmInteractiveChrome()`

*Root cause:* This function queries `offsetWidth`, `offsetHeight`, `getBoundingClientRect()`, and `getComputedStyle()` on 15+ CSS selectors, plus temporarily unhides the preferences panel and forces its layout. All of this runs synchronously on the main thread during the loading overlay phase.

*Impact:* 5–20 ms of forced layout during startup, hidden under the loading overlay. Low priority.

---

### Phase 2.5: Worst-Case Frame Budget Stack

> Addresses the missing "frame budget aggregation" gap. Provides engineering-planning-grade estimates for CPU, GPU, and spike scenarios.

All values are static-analysis estimates at 1920×1080, mid-range discrete GPU (GTX 1060-class) or M-series integrated GPU. Measure via Chrome DevTools Performance panel and WebGL Inspector for device-specific baselines before implementing Tier 2/Tier 3 items.

#### CPU Frame Budget (Steady-State, High Preset, Settled State)

| Task | Estimated Cost | Bottleneck |
|---|---|---|
| `frameBudget.sample()` — 3× O(60) linear scan | ~0.05–0.10 ms | Algorithmic |
| `adaptiveQuality.evaluate()` (locked, no-op) | ~0.01 ms | Lock check |
| `lightingSetup.update()` (animated profile) | ~0.01–0.02 ms | Sin + position write |
| `galleryManager.update()` full path | ~0.3–1.5 ms | Viewport cascade 2–4× |
| `camera.updateMatrixWorld()` (redundant) | ~0.01 ms | Matrix multiply |
| Key-light direction transform | ~0.01 ms | `transformDirection` |
| `material.setKeyLightDirView()` | ~0.01 ms | Uniform write |
| JS/rAF overhead (closures, GC minor) | ~0.05–0.15 ms | V8 |
| **CPU steady-state total (desktop)** | **~0.5–1.8 ms/frame** | |
| **CPU steady-state total (mobile)** | **~1.2–4.5 ms/frame** | Layout reads scale up |

#### GPU Frame Budget (Steady-State, High Preset)

| Task | Estimated Cost | Bottleneck |
|---|---|---|
| Shadow map pass × 2 spotlights | ~0.5–2.0 ms | Full scene × 2 |
| Main scene render — RenderPass | ~0.5–1.5 ms | Fragment dominated |
| Painting shader (~23 tex reads/fragment) | ~1.0–3.0 ms | Texture bandwidth |
| Frame shader (FBM + scratch, border pixels only) | ~0.1–0.3 ms | ALU |
| Bloom pass UnrealBloom 10× FBO blits | ~0.3–1.0 ms | Bandwidth |
| OutputPass (color space, 1 quad) | ~0.05–0.1 ms | Bandwidth |
| **GPU steady-state total (desktop)** | **~2.5–8.0 ms/frame** | |
| **GPU steady-state total (mobile TBDR)** | **~5.0–20 ms/frame** | Shadow bandwidth ×2–4 |

> ⚠️ **These ranges depend heavily on shadow and bloom state.** The desktop range of 2.5–8 ms reflects the `high` preset with 2 shadow-casting lights and bloom enabled. On `battery` preset (no shadows, no bloom) the same device sees ~1.0–3.5 ms. Similarly, the mobile TBDR range of 5–20 ms is for the `high` preset with TBDR shadow bandwidth cost; with shadows disabled the mobile range drops to ~2–8 ms. Do not interpret either baseline as a fixed hardware floor — it is a preset-configuration floor.

At 60 fps (16.7 ms budget): desktop is well within budget; mobile high preset can approach the limit.
At 120 fps (8.3 ms budget): mobile high preset exceeds budget. Shadow maps are the primary constraint.

#### Navigation Spike Budget (Per Artwork Transition)

| Event | Additional CPU | Additional GPU | Duration |
|---|---|---|---|
| `replaceFrameGeometry()` (aspect change) | +1–5 ms | — | 1 tick |
| `assignFrameBarUVs()` | +0.3–1 ms | — | 1 tick |
| `computeTangents()` | +0.2–0.5 ms | — | 1 tick |
| GPU geometry buffer upload | — | +0.5–2 ms | 1 tick |
| New artwork texture decode (JPEG) | +5–30 ms | — | Background (async) |
| **Navigation spike total (worst case)** | **+2–7 ms** | **+0.5–2 ms** | **1–3 frames** |

#### Startup Spike Budget

| Phase | Estimated Duration | Device Factor |
|---|---|---|
| WebGL context creation + driver init | 50–200 ms | GPU driver |
| Albedo preload × 15 artworks | 200–2000 ms | Network |
| PBR texture set preload | 500–3000 ms | Network + decode |
| Procedural texture generation × 15 artworks | 100–500 ms | CPU (main thread) |
| Quality preset pre-warming × 3 cycles | 200–600 ms | Shader compilation |
| GPU artwork warming × 15 | 50–300 ms | Render passes |
| Chrome prewarm forced layout | 5–20 ms | DOM |
| **Total startup (15 artworks, fast device)** | **~1.5–4 seconds** | |
| **Total startup (15 artworks, slow mobile)** | **~4–12 seconds** | Risk of visible delay |

#### Engineering Planning Summary

Tier 0 (idle render elimination) alone recovers ~97% of steady-state GPU budget.
After Tier 0, the most expensive remaining line item is shadow map passes (GPU-1) at ~0.5–2.0 ms/frame active, and the viewport measurement cascade (CPU-1) at ~0.3–1.5 ms/frame.
Navigation spikes (+2–7 ms) are the next most user-visible issue after idle rendering is resolved.

---

### Phase 3: Root Cause Summary Table

| ID | Issue | File | Root Cause | Severity | Affects Frame Stability | Scales With |
|---|---|---|---|---|---|---|
| CPU-1 | Viewport measurement cascade | `GalleryManager.ts` | `viewportMetricsProvider` called 2–4×/frame via `getZoomBounds`/`getViewportMetrics` | High | Yes | Scene complexity |
| CPU-2 | `Math.tan(degToRad(...))` per helper | `GalleryManager.ts` | FOV constant recomputed 3× per frame | High | Low | None |
| CPU-3 | Manual `updateMatrixWorld()` | `main.ts` | Redundant call before render; Three.js already updates during render | Medium | Low | None |
| CPU-4 | `FrameBudgetMonitor` 3× linear scans | `FrameBudgetMonitor.ts` | Rolling sum/count done as O(N) linear pass each | Medium | Yes (GC) | Window size |
| CPU-5 | `console.debug` on navigation | `ArtworkMesh.ts` | No diagnostics-mode guard on calls | Low | Low | None |
| GPU-1 | Shadow map passes per spotlight | `LightingSetup.ts` | 2–3 lights × castShadow = 2–3 extra render passes | High | Yes | Light count |
| GPU-2 | Bloom at strength 0.04 still runs | `PostProcessing.ts` | `UnrealBloomPass` always processes 10 FBO blits even at near-zero strength | Medium | No | None |
| GPU-3 | Side panels transparent alpha blend | `SidePanels.ts` | `opacity: 0.95, transparent: true` enables alpha pass unnecessarily | Medium | Low | None |
| GPU-4 | Frame geometry rebuild on navigation | `ArtworkMesh.ts` | Full `ExtrudeGeometry` + UV + tangent reconstruction every artwork change | High | Yes | Vertex count |
| GPU-5 | 65K triangle artwork plane on high | `quality.ts` | `artworkSegments: 180` always active regardless of camera distance | Medium | No | Viewport resolution |
| MEM-1 | Procedural texture Uint8Array GC | `ProceduralTextureFactory.ts` | 28 MB per artwork in CPU buffers, GC-eligible after DataTexture creation | Medium | Yes (startup) | Artwork count |
| MEM-2 | `FrameBudgetSample` per-frame alloc | `FrameBudgetMonitor.ts` | New object allocated on every `sample()` call | Medium | Yes (minor GC) | Frame rate |
| MEM-3 | `new THREE.Vector2()` in snapshot | `RendererManager.ts` | Unnecessary allocation in periodic diagnostic function | Low | No | None |
| MEM-4 | `new THREE.Vector2()` in raycaster | `GalleryManager.ts` | Per-click allocation for hit-testing | Low | No | None |
| MEM-5 | 7 MB canvas per fallback texture | `TextureManager.ts` | 1600×1100 canvas created and held per failed texture URL | Low | No | Failed loads |
| PIPE-1 | 3-preset startup pre-warming | `main.ts` | Full preset cycle × 3 for shader variant compilation | Medium | No | Preset count |
| PIPE-2 | Force-layout in chrome prewarm | `main.ts` | 15+ DOM measurements during startup | Low | No | DOM element count |

---

### Phase 4: Optimization Strategies (No Implementation)

---

#### OPT-1 — Cache `fovTan` and memoize `getZoomBounds` result per frame

**Type:** Memoization / caching strategy

**Target:** `CPU-1`, `CPU-2`

**Root problem:** `getViewportMetrics()` reads CSS custom properties and `getBoundingClientRect()` 2–4 times per frame (called from multiple helpers within the same `update()` tick). `Math.tan(degToRad(camera.fov * 0.5))` is recomputed 3× per frame despite being a constant.

---

**Approach A — FrameContext pattern (Recommended; cleanest architecture)**

Compute all per-frame invariants once at the top of `update()` and pass them as a typed context object through the call chain:

```typescript
// src/gallery/types.ts  (add to existing or new file)
interface FrameContext {
  readonly fovTan: number;         // Math.tan(degToRad(fov * 0.5))
  readonly viewportMetrics: ViewportMetrics;
  readonly zoomBounds: ZoomBounds;
  readonly timestamp: number;
}

// In GalleryManager.update(now: number):
const ctx: FrameContext = {
  fovTan: this._fovTan,            // cached class property (see Approach B)
  viewportMetrics: this._viewportMetricsProvider(),   // called ONCE
  zoomBounds: this._computeZoomBounds(viewportMetrics, fovTan),  // called ONCE
  timestamp: now,
};
// Pass ctx to clampZoom(ctx), clampPanTargets(ctx), getPanLimits(ctx), etc.
```

This eliminates all re-entrancy by construction — each helper receives what it needs rather than computing it internally.

---

**Approach B — Class-level cache with invalidation (Easier to retrofit)**

Cache `fovTan` as a class property updated on construction (FOV never changes at runtime):

```typescript
// In GalleryManager constructor:
private readonly _fovTan = Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5));
```

Cache `viewportMetrics` at the top of `update()` using a local variable:

```typescript
update(now: number): void {
  const metrics = this._viewportMetricsProvider();  // ONCE per tick
  const bounds = this._getZoomBoundsWithMetrics(metrics);  // ONCE per tick
  this._clampZoom(this.targetZoom, bounds);         // pass bounds
  this._clampPanTargets(metrics, bounds);            // pass both
  // ... rest of update
}
```

This avoids touching the call signatures deeply — metrics and bounds are local variables passed explicitly only where needed.

---

**Approach C — Memoize-by-frame-count (Minimal change, no refactor)**

Attach a `_lastMetricsFrame` counter and return the cached value if the frame count is unchanged:

```typescript
private _cachedMetrics: ViewportMetrics | null = null;
private _cachedMetricsFrame = -1;

private getViewportMetricsCached(frame: number): ViewportMetrics {
  if (frame !== this._cachedMetricsFrame) {
    this._cachedMetrics = this._viewportMetricsProvider();
    this._cachedMetricsFrame = frame;
  }
  return this._cachedMetrics!;
}
```

This requires threading a `frameNumber` counter (incrementing in `animate()`), but is otherwise a drop-in replacement with zero signature changes.

**Expected gain (all approaches):**
- CPU: eliminate 1–3 additional `getBoundingClientRect` + CSS property reads per frame
- CPU: eliminate 2 redundant `Math.tan` calls per frame
- Estimated: −0.5–2 ms/frame on mobile; −0.1–0.3 ms/frame on desktop

**Risk:** Low. FOV is constant; viewport metrics need to be re-read at the start of each frame (once) to stay current. No visual change.

**Validation:** None required — purely computational; output is mathematically identical.

---

#### OPT-2 — Cache frame geometry by aspect ratio; skip rebuild when aspect is unchanged

**Type:** Caching strategy + conditional execution

**Target:** `GPU-4`

**Root problem:** `replaceFrameGeometry()` runs a full `ExtrudeGeometry` + UV + tangent pipeline (~1–5 ms CPU + GPU buffer upload) on every artwork navigation, even when the next artwork has an identical or nearly identical aspect ratio to the current one.

---

**Approach A — Equality skip guard (Quickest win)**

In `ArtworkMesh.updateAspect()`, compare the incoming aspect ratio against the last-built one before triggering a rebuild:

```typescript
private _lastBuiltAspect = -1;
private readonly ASPECT_THRESHOLD = 0.002;  // ~0.2% difference

updateAspect(aspect: number): void {
  if (Math.abs(aspect - this._lastBuiltAspect) < this.ASPECT_THRESHOLD) {
    // Aspect is the same; only update the artwork plane scale, not the frame geometry
    this._artworkMesh.scale.set(aspect, 1, 1);
    return;
  }
  this._lastBuiltAspect = aspect;
  this.replaceFrameGeometry(aspect);
}
```

Expected win: eliminates the rebuild for same-format artworks (common in a gallery of prints).

---

**Approach B — Small LRU aspect cache (Better coverage)**

Maintain a cache of 3–5 pre-built frame geometries keyed by rounded aspect ratio:

```typescript
private readonly _geoCache = new Map<number, THREE.BufferGeometry>();
private readonly GEO_CACHE_SIZE = 4;
private readonly ASPECT_ROUND = 100;  // round to 2 decimal places (0.01 precision)

private getOrBuildGeometry(aspect: number): THREE.BufferGeometry {
  const key = Math.round(aspect * this.ASPECT_ROUND);
  if (this._geoCache.has(key)) return this._geoCache.get(key)!;
  
  const geo = this._buildFrameGeometry(aspect);  // existing build logic
  
  // Evict oldest if at capacity
  if (this._geoCache.size >= this.GEO_CACHE_SIZE) {
    const oldestKey = this._geoCache.keys().next().value;
    this._geoCache.get(oldestKey)!.dispose();  // free GPU buffer
    this._geoCache.delete(oldestKey);
  }
  this._geoCache.set(key, geo);
  return geo;
}
```

Expected win: eliminates both CPU rebuild and GPU buffer re-upload for aspect ratios seen before. Handles portrait/landscape/square common groupings with 4 cache slots.

**Disposal requirement:** On `ArtworkMesh.dispose()`, iterate `_geoCache` and call `.dispose()` on all cached geometries to prevent VRAM leak.

---

**Approach C — Pre-build all aspect geometries at startup**

During the startup warm sequence (after `TextureManager` resolves all artwork manifests), pre-build and GPU-upload a frame geometry for each distinct aspect ratio in the artwork collection:

```typescript
// In main.ts startup sequence, after manifest load:
const uniqueAspects = [...new Set(artworks.map(a => Math.round(a.aspect * 100) / 100))];
for (const aspect of uniqueAspects) {
  artworkMesh.preWarmAspect(aspect);  // builds and uploads geometry
}
```

Expected win: zero rebuild cost at navigation time for all pre-warmed aspects. Best for collections with known artwork aspect ratios.

**Trade-off:** Pre-warming N aspects adds N × (~1–5 ms CPU + ~0.5 ms GPU) to startup time. For a gallery of 15 artworks with 10 distinct aspects, this is ~15–75 ms — acceptable under the loading overlay.

**Risk (all approaches):** Low — aspect equality threshold is configurable. Worst case: cache miss falls back to current behavior. No visual change.

**Validation:** Confirm via profiler that navigation frames no longer show the `computeTangents` spike.

---

#### OPT-3 — Replace rolling-sum linear scan with incremental accumulator in `FrameBudgetMonitor`

**Type:** Data structure redesign

**Target:** `CPU-4`, `MEM-2`

**Approach:** Maintain a running sum alongside the ring buffer so that `rolling average = (sum - oldest + newest) / windowSize` rather than iterating all samples. Similarly, maintain running counts for `aboveBudget` and `severeFrames`. Update them in O(1) when inserting a new sample:

```typescript
// Replace current linear-scan fields with accumulators:
private _sum = 0;
private _aboveCount = 0;
private _severeCount = 0;
private _head = 0;  // ring buffer write pointer

sample(now: number): FrameBudgetSample {
  const delta = now - this._lastTime;
  this._lastTime = now;

  // Remove oldest slot from accumulators
  const oldest = this._buffer[this._head];
  if (oldest !== undefined) {
    this._sum -= oldest.delta;
    if (oldest.delta > this._budget) this._aboveCount--;
    if (oldest.delta > this._budget * 2) this._severeCount--;
  }

  // Add new sample
  const entry = { delta, timestamp: now };
  this._buffer[this._head] = entry;
  this._head = (this._head + 1) % this._windowSize;
  this._sum += delta;
  if (delta > this._budget) this._aboveCount++;
  if (delta > this._budget * 2) this._severeCount++;

  // Return mutated snapshot (reuse pre-allocated object)
  this._snapshot.avgDelta = this._sum / Math.min(this._count, this._windowSize);
  this._snapshot.aboveBudgetCount = this._aboveCount;
  this._snapshot.severeCount = this._severeCount;
  return this._snapshot;
}
```

For `snapshot()`, return a pre-allocated, mutated result object stored on the class instance (`this._snapshot: FrameBudgetSample`). The returned reference is stable; callers must not hold it across ticks. This matches the "single owner reads once" contract already in use in `main.ts`.

**Expected gain:**
- CPU: from O(180) to O(1) per frame (eliminate 180 comparisons/frame → 0)
- Memory: eliminate 60 heap allocations/second (60 fps × 1 `FrameBudgetSample` object/frame)
- GC: eliminate minor GC hitches from object churn (~0.5–2 ms every 2–5 seconds)

**Risk:** Low — pure refactor of internal bookkeeping. External interface (`sample()`, `getSnapshot()`, etc.) unchanged.

**Validation:** No visual change. Verify output values are numerically equivalent via a unit test comparing old vs new path for the same input sequence.

---

#### OPT-4 — Disable or conditionally skip bloom when near-zero effective contribution

**Type:** Render pass reduction

**Target:** `GPU-2`

**Root problem:** `UnrealBloomPass` always processes 10 internal FBO ping-pong blits per frame even when `bloomStrength = 0.04` and `bloomThreshold = 1.2`. Because the scene uses `THREE.NoToneMapping` and no surface produces linear luminance > 1.2, the bloom output is effectively zero. The 10 blits are wasted bandwidth.

**⚠ Validation requirement (must precede implementation):**  
The assumption "no scene pixel exceeds luminance 1.2" is almost certainly correct given `THREE.NoToneMapping` and non-HDR materials — but specular highlights in artwork PBR textures can produce bright spikes depending on artwork content. **Before disabling bloom:** probe peak scene luminance across all artworks and all presets. A practical measurement approach:

```typescript
// One-time diagnostic pass (run at startup, not per-frame):
async function measurePeakLuminance(renderer, scene, camera): Promise<number> {
  const rt = new THREE.WebGLRenderTarget(64, 64);  // small sample
  renderer.setRenderTarget(rt);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);

  const pixels = new Uint8Array(64 * 64 * 4);
  renderer.readRenderTargetPixels(rt, 0, 0, 64, 64, pixels);
  rt.dispose();

  let maxLum = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    // sRGB to linear approximation for quick check
    const r = (pixels[i] / 255) ** 2.2;
    const g = (pixels[i+1] / 255) ** 2.2;
    const b = (pixels[i+2] / 255) ** 2.2;
    maxLum = Math.max(maxLum, 0.2126 * r + 0.7152 * g + 0.0722 * b);
  }
  return maxLum;
}
```

If all artworks return `maxLum < 0.8` (safely below the 1.2 threshold), bloom can be safely disabled. If any artwork returns `maxLum > 1.0`, investigate before disabling.

---

**Approach A — Static disable at preset level (Simplest)**

Set `bloomStrength: 0` on `high` and `balanced` presets. Three.js `UnrealBloomPass` checks `this.strength` at the start of each render — but does **not** skip its FBO processing when strength is zero. The actual skip requires `bloomPass.enabled = false`:

```typescript
// In PostProcessing.ts applyPreset():
if (preset.bloomStrength === 0) {
  this._bloomPass.enabled = false;
} else {
  this._bloomPass.enabled = true;
  this._bloomPass.strength = preset.bloomStrength;
}
```

**Important:** `bloomPass.enabled = false` causes the `EffectComposer` to skip the pass entirely, including all 10 internal FBO reads/writes. Simply setting `strength = 0` does NOT achieve this.

---

**Approach B — Dynamic enable/disable based on measured scene luminance**

Run the peak luminance probe above on first artwork load and re-evaluate after each artwork navigation. Cache the result per artwork:

```typescript
private _bloomEligibleByArtwork = new Map<string, boolean>();

async checkBloomEligibility(artworkId: string): Promise<void> {
  const peak = await measurePeakLuminance(this._renderer, this._scene, this._camera);
  const eligible = peak > this._bloomThreshold * 0.8;  // 20% headroom
  this._bloomEligibleByArtwork.set(artworkId, eligible);
  this._bloomPass.enabled = eligible && this._preset.bloomEnabled;
}
```

This adapts dynamically to artwork content and is the safest approach if peak luminance is uncertain.

---

**Approach C — Remove bloom pass from composer entirely on battery preset; keep as disabled-by-default on balanced/high**

On `battery` preset: bloom is already strength 0. Ensure `enabled = false` is explicitly set.
On `balanced` preset: default to `enabled = false`; provide a developer flag to re-enable for testing.
On `high` preset: default to `enabled = false` pending luminance measurement; enable only if artwork content warrants it.

This minimizes the default GPU cost while preserving the bloom infrastructure for future use.

**Expected gain:**
- GPU: eliminate 10 fullscreen quad renders per frame on high/balanced preset (~0.3–1 ms GPU/frame)

**Risk:** Low conditional on luminance validation. If bloom is removed while a rare artwork has specular spikes > 1.2, those spikes would become visible hard points rather than bloomed soft glows. Mitigated by Approach B.

---

#### OPT-5 — Remove shadow maps or constrain to a single key light

**Type:** Render pass reduction

**Target:** `GPU-1`

**Root problem:** 2–3 shadow-casting spotlights produce 2–3 full depth-only render passes per frame before the main render. The scene geometry is near-flat (single artwork plane + frame ring); inter-object shadowing is imperceptible because no geometry casts meaningful shadows across other geometry at typical gallery distances.

**⚠ Validation requirement (visual-risk optimization):**  
Shadow maps do contribute subtle contact shadows along frame edges and faint floor-plane softness at certain lighting profiles. **Required validation:** side-by-side render comparison at every lighting profile (gallery-soft, raking, spotlight, museum) across 5+ representative artworks at all zoom levels. Compare screenshots at:
- `shadows: true` (current)
- `shadows: false` (proposed balanced/battery)
- `shadowCastingLights: 1` (proposed high preset, key light only)

Do not commit shadow changes without explicit sign-off on these comparisons.

**Mobile GPU bandwidth note:** On tile-based deferred rendering (TBDR) GPUs — all Apple Silicon, most Android (Adreno 6xx+, Mali-G series) — shadow map cost includes depth buffer resolution + reload to tile memory. This can produce 2–4× more cost than a comparable desktop GPU pass. Shadow maps are a disproportionate cost on the mobile GPU class most commonly used in gallery environments (iPad, MacBook Air M-series). Even a reduction from 2 lights to 1 shadow-casting light can save ~50% of shadow GPU budget on these devices.

---

**Approach A — Per-preset shadow light count via `shadowCastingLightCount` field (Recommended)**

Replace the current binary `preset.shadows: boolean` with a count:

```typescript
// In QualityPreset interface:
interface QualityPreset {
  // ...existing fields...
  shadowCastingLightCount: 0 | 1 | 2;  // replaces shadows: boolean
}

// Preset values:
high:     shadowCastingLightCount: 1   // key light only (was: 2)
balanced: shadowCastingLightCount: 0   // was: 2 (shadows: true)
battery:  shadowCastingLightCount: 0   // already correct
```

In `LightingSetup.applyPreset()`:

```typescript
applyPreset(preset: QualityPreset): void {
  const count = preset.shadowCastingLightCount;
  this._spotlights.forEach((light, i) => {
    light.castShadow = i < count;
  });
}
```

This granular control enables profile-specific tuning: inspection profile could use `shadowCastingLightCount: 1` for raking shadow detail while gallery-soft uses `0`.

---

**Approach B — Shadow map resolution reduction (Complementary, not alternative)**

Reduce shadow map resolution from Three.js default (1024×1024) to 512×512 for all shadow-casting lights. This halves the shadow map fill rate and quarterns the bandwidth:

```typescript
// In LightingSetup setup():
light.shadow.mapSize.set(512, 512);     // was: default 1024
light.shadow.camera.near = 0.5;        // tighter frustum = better depth precision
light.shadow.camera.far = 20;
light.shadow.bias = -0.001;
```

512×512 is sufficient for the contact shadows visible at gallery distances — the artwork is not large enough for high-resolution shadow detail to matter.

Expected GPU win: ~75% reduction in shadow texture bandwidth (4× smaller area) with minimal visual degradation.

---

**Approach C — PCF shadow soft-clamp + single key light on all presets**

For the `high` preset, keep one shadow-casting spotlight at 512×512 with `THREE.PCFSoftShadowMap`. This produces a soft shadow halo around the frame bottom edge that is consistent with the museum lighting intention:

```typescript
// In RendererManager constructor or applyPreset():
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = preset.shadowCastingLightCount > 0;
```

`PCFSoftShadowMap` uses 4-tap filtering — slightly more expensive per texel, but at half resolution the net cost is lower than 2× PCF `BasicShadowMap` at full resolution.

**Expected gain:**
- GPU: Approach A (1 light): −50% shadow render passes on high
- GPU: Approach A (0 lights) on balanced: −100% shadow passes = ~0.5–2 ms/frame freed
- GPU: Approach B (512×512): −75% shadow bandwidth
- Combined A+B: largest single GPU win available short of Tier 0

**Risk:** Medium — shadow appearance change is the most perceptually noticeable visual change in this optimization set. Side-by-side validation is required before shipping.

---

#### OPT-6 — Make side panels opaque (`transparent: false, opacity: 1.0`)

**Type:** GPU state optimization

**Target:** `GPU-3`

**Approach:** Change `SidePanels` materials to `transparent: false` (or `opacity: 1.0` — Three.js automatically sets `transparent: false` when opacity reaches 1.0). This moves the panels from the transparent render bucket (sorted by distance, alpha-blended) to the opaque bucket (depth-sorted, no blend cost).

```typescript
// In SidePanels.ts createMaterial():
material.transparent = false;
material.opacity = 1.0;
// Note: Three.js requires needsUpdate = true on material after toggling transparent
material.needsUpdate = true;
```

**Validation requirement (perceptual risk, not code risk):**  
The visual difference at `opacity = 0.95 → 1.0` is below the perceptual threshold on calibrated displays — but this **must be validated via side-by-side render comparison at all lighting profiles and at all zoom levels** (especially close inspection mode where the panel texture fill is visible). If any profile shows a perceptible edge where the panel joins the background at the current 0.95 opacity, the fix is to add a soft gradient or vignette to the panel texture itself (image-based feathering rather than material opacity). Do not ship this change without the comparison.

**Expected gain:**
- GPU: eliminate alpha-blend for 2 panel meshes per frame
- CPU: eliminate per-frame transparent-object sort for side panels
- Code: simplifies render bucket; consistent with depth-write optimization

**Risk:** Very low — 5% opacity shift is sub-perceptual, but requires sign-off.

---

#### OPT-7 — Pre-allocate reusable scratch vectors in `GalleryManager` and `RendererManager`

**Type:** Memory reuse strategy

**Target:** `MEM-3`, `MEM-4`

**Approach:** Store a `private readonly _tmpVec2 = new THREE.Vector2()` on `GalleryManager` and `RendererManager`, reusing it across calls to `renderer.getSize()` and `new THREE.Vector2()` raycaster coordinates. This is a standard pattern in performance-sensitive Three.js code.

**Expected gain:**
- Memory: eliminate 1 allocation every 5 seconds (diagnostics timer) and 1 per panel-click event
- GC: negligible improvement

**Risk:** Very low — isolated, private, never exposed.

**Requires architectural change:** No.

---

#### OPT-8 — Guard `console.debug` calls with diagnostics mode check

**Type:** Update loop optimization

**Target:** `CPU-5`

**Approach:** Replace unconditional `console.debug(...)` calls in `ArtworkMesh.ts` with a guard matching the pattern used elsewhere in the codebase: check `getDiagnostics().getMode() !== 'default'` or use the existing `diagnostics.debug(...)` helper (which is already no-op in default mode). The four calls on lines 70, 139, 233, 285 are all in code paths triggered on every artwork navigation.

**Expected gain:**
- CPU: ~0.1–0.5 ms per navigation in DevTools-attached sessions eliminated
- Code quality: consistent diagnostic level control across the codebase

**Risk:** None — diagnostics-mode check is already used universally everywhere else.

**Requires architectural change:** No.

---

#### OPT-9 — LOD for artwork plane vertex count (distance-based)

**Type:** GPU optimization / LOD

**Target:** `GPU-5`

**Root problem:** The artwork plane uses `artworkSegments: 180` (65K triangles) even at overview distance where vertex-level detail is sub-pixel. The high tessellation exists to support the parallax UV march and self-shadow march in the fragment shader — both of which are imperceptible at camera distances > 10 units.

**⚠ Validation requirement:**  
Must validate that: (1) parallax and self-shadow effects at overview zoom are already below perceptual threshold before enabling LOD, and (2) the geometry swap transition has no visible pop. Side-by-side screenshot comparison at the LOD threshold distance (proposed: Z ≈ 10) at maximum parallax strength.

---

**Approach A — Two-level explicit geometry swap with hysteresis (Recommended)**

Maintain two `PlaneGeometry` instances in `ArtworkMesh`:

```typescript
private _hiResGeo: THREE.PlaneGeometry;   // artworkSegments = 180
private _loResGeo: THREE.PlaneGeometry;   // artworkSegments = 24 (1.1K triangles)
private _currentLOD: 'hi' | 'lo' = 'hi';

private readonly LOD_SWITCH_HI = 6.0;   // switch to hi-res when Z < 6.0
private readonly LOD_SWITCH_LO = 8.0;   // switch to lo-res when Z > 8.0

updateLOD(cameraZ: number): void {
  const targetLOD = cameraZ < this.LOD_SWITCH_HI ? 'hi' : 
                    cameraZ > this.LOD_SWITCH_LO ? 'lo' : this._currentLOD;
  if (targetLOD === this._currentLOD) return;
  
  this._currentLOD = targetLOD;
  const geo = targetLOD === 'hi' ? this._hiResGeo : this._loResGeo;
  this._artworkMesh.geometry = geo;
  // Geometry swap is instantaneous — no upload, both are already on GPU
}
```

The hysteresis band (6.0–8.0) prevents thrashing when the camera hovers near the threshold.

---

**Approach B — Three.js `THREE.LOD` node (Standard API)**

Three.js provides a built-in `THREE.LOD` class:

```typescript
const lod = new THREE.LOD();
lod.addLevel(artworkMeshHi, 0);    // hi-res: distance 0
lod.addLevel(artworkMeshLo, 8.0);  // lo-res: distance 8.0

// Three.js automatically switches LOD in renderer.render()
// when renderer.info is accessed
scene.add(lod);
```

This leverages Three.js's built-in distance computation but requires restructuring `ArtworkMesh` to use a `THREE.LOD` container. Slightly more overhead than Approach A (LOD tree traversal), but integrates cleanly with the scene graph.

**Note:** `THREE.LOD.autoUpdate` must be `true` (default) for automatic LOD selection.

---

**Approach C — Conditional parallax/shadow shader disable at overview distance**

Instead of switching geometry, disable the parallax and self-shadow marching loops in the fragment shader when the camera is far enough:

```glsl
// In artwork onBeforeCompile shader injection:
uniform float uParallaxStrength;  // 0.0 at overview distance, 1.0 at close zoom

// In parallax march loop:
#if defined(USE_PARALLAX)
  if (uParallaxStrength > 0.01) {
    // ... parallax loop
  }
#endif
```

Drive `uParallaxStrength` from `main.ts` based on camera Z: lerp from 0→1 as Z goes from 8→4 units. This eliminates the ~16 dynamic texture samples at overview distance while keeping the same mesh tessellation.

**Trade-off:** Fragment shader cost reduction without geometry swap stall; no pop artifact at all. But vertex count is unchanged (65K triangles still processed). Approach A + C combined achieves the most.

**Expected gain:**
- GPU: at overview distance (typical starting position), reduce vertex count from ~65K to ~1.2K triangles = ~98% reduction in vertex shader work
- GPU: Approach C also eliminates ~16 dynamic texture reads/fragment at overview

**Risk:** Medium — geometry swap (Approach A) causes a single-frame stall on first switch. Hysteresis band required. No visible change at correct threshold distances.

---

#### OPT-10 — Procedural texture generation off-thread via `OffscreenCanvas` / Worker

**Type:** CPU offloading / memory optimization

**Target:** `MEM-1`, `PIPE-1`

**Approach:** The procedural map generators in `ProceduralTextureFactory` are pure CPU math with no DOM dependencies. Move the pixel-generation loops into a dedicated Web Worker. The worker returns a `SharedArrayBuffer` (or `Transferable` `ArrayBuffer`) directly uploadable as a `DataTexture` on the main thread. This eliminates the 28–48 MB GC-eligible buffer allocation from the main thread heap and shifts the generation work off the frame budget entirely.

**Expected gain:**
- CPU: remove procedural generation work from the loading sequence's main-thread blocking
- Memory: large Uint8Array temporaries no longer live in the main thread's young generation

**Risk:** High complexity — Web Workers require message-passing protocol design; texture upload must still happen on the main thread. `SharedArrayBuffer` requires appropriate COOP/COEP headers. This is a significant architectural addition and should be Tier 3 unless the startup CPU block is measured as user-visible.

**Requires architectural change:** Yes — new Worker file + message protocol.

---

### Phase 5: GPU Deep Analysis

#### Draw Call Pattern

| Preset | Shadow Passes | Scene Draw Calls | Post-Process Passes | Total GPU Passes |
|---|---|---|---|---|
| High | 2 (2 spotlights) | 4 | 3 (Render + Bloom + Output) | 9 |
| Balanced | 2 (2 spotlights) | 4 | 2 (Render + Output) | 8 |
| Battery | 0 | 4 | 2 (Render + Output) | 6 |

Shadow passes constitute the largest single multiplier on GPU workload.

#### Material Switching

- Only 2 unique materials in the scene: `MeshPhysicalMaterial` (artwork + frame, both via `onBeforeCompile`) and `MeshBasicMaterial` (side panels).
- No material switching between frames during normal operation.
- On quality preset change: shader recompilation triggered for both artwork and frame materials, which can cause a 50–200 ms GPU stall on the first frame after the switch.

#### Texture Binding

- Active textures per frame on high preset: albedo + normal + detailNormal + height + roughness + specular + ao + varnish = up to 8 textures for the artwork plane. Frame material uses no texture maps (procedural, uniform-driven). Side panels use 1 texture each = 2 more.
- Total: up to 10 unique texture binds per scene render. Well within the GPU's texture unit limit (typically 16–32).
- No texture thrashing detected — all textures are resident in GPU VRAM after the warm pass.

#### Shader Complexity Analysis

**Painting shader (high preset):**
- `MeshPhysicalMaterial` with clearcoat, specular, normal, and emissive — one of Three.js's most complex built-in fragment shaders
- `onBeforeCompile` adds: parallax UV march (10 steps × 1 texture read = 10 dynamic texture reads), self-shadow march (6 steps × 1 texture read = 6 dynamic texture reads), detail normal blend, grazing boost
- Total per-fragment texture reads on high: albedo(1) + normal(1) + detailNormal(1) + height(1) + roughness(1) + specular(1) + ao(1) + varnish(1) + parallax samples(10) + shadow march(6) = ~23 texture reads per fragment
- At 1920×1080 with 1.6× pixel ratio = ~3.3M fragments → ~76M texture reads per frame for the artwork plane alone

This is a high shader ALU and texture read count. The parallax and self-shadow texture reads use dynamic UV offsets (non-trivially vectorizable) which can stress the texture sampler pipeline on mobile GPUs.

**Frame shader (high preset):**
- `MeshPhysicalMaterial` with clearcoat + anisotropy (M-04 override in `lights_physical_fragment`)
- `onBeforeCompile` adds: procedural normal (FBM + fine FBM + scratch lines), roughness grain + attenuation, anisotropy direction perturbation
- FBM: 4 octaves × 2 `frmNoise` calls × 4 `frmHash` calls each = ~32 hash evaluations per primary FBM call
- Fine-grain FBM: additional 3 octaves × ~24 hash calls
- Scratch layer (high): 3 `frmScratchLine` calls, each with 5 `frmHash` calls = 15 hash calls
- Total per-fragment ALU: heavy, but the frame occupies a small fraction of screen pixels (border region only)
- `fwidth(barUV.x)` calls require screen-space derivatives — available as a built-in but consumes a DDX/DDY quad operation

**Overdraw analysis:**
- No overdraw detected for the main artwork plane (it is the background, behind nothing).
- Side panels are offset to the sides; their projection does not overlap the artwork at default FOV (40°).
- The frame ring overlaps the artwork plane edges (design intent) — 1× overdraw on the frame border pixels.

#### Render Ordering

Three.js default opaque-then-transparent ordering is used. The frame ring is opaque; the artwork plane is opaque (no transparency). Side panels are transparent (see OPT-6). No issues with render ordering for visual correctness.

---

### Phase 6: CPU Optimization Deep Analysis

#### Main Loop Structure

The `animate(now)` function in `main.ts` runs unconditionally at display refresh rate (60–120 Hz). The gate `if (pageInactive) return` prevents render when the tab is hidden. The gate `if (rendererManager.isRenderPaused()) return` prevents render when the WebGL context is lost. Both are correct.

Within the render-eligible path, the loop runs all of: budget sampling, quality evaluation, lighting update, gallery update, key-light transform, material uniform write, and the render pipeline. There is no dirty flag or idle throttling — the full pipeline runs at every frame even when nothing is animating (camera at rest, no user input, no lighting animation if `reducedMotion` is set or profile is non-animated).

#### Redundant Recalculations

1. `Math.tan(THREE.MathUtils.degToRad(40 * 0.5))` = `Math.tan(0.3490658...)` = `0.36397...` — a constant never computed once (CPU-2).
2. `getViewportMetrics()` reads computed CSS properties and BoundingClientRect on each of 4 DOM elements — called 2–4× per frame (CPU-1).
3. `getZoomBounds()` recalculates min/max zoom from scratch each call — called inside `clampZoom()` and `getPanLimits()` in the same update tick (CPU-1 cascade).

#### Update Frequency

- `LightingSetup.update()`: only animates if `animateAllowed && !reducedMotion`. When animation is disabled, returns immediately — correct.
- `GalleryManager.update()`: always runs target clamping even when all targets match current values (no dirty flag to skip unchanged properties). On a fully settled scene with no user input, 10 `smoothDamp()` calls run per frame returning the current value unchanged.

#### Event System Efficiency

- Pointer events use a `Map<number, PointerSlot>` keyed by `pointerId` — O(1) lookups. Correct.
- Preference subscription uses a simple Set of callbacks iterated on change — correct, not hot.
- Resize uses a 120 ms debounce + single rAF — correct.

#### State Mutation Patterns

- `adaptiveQuality.evaluate()` acquires `performance.now()` on every call even when locked (always returns null). Minor — 1 `performance.now()` call per frame.
- `FrameBudgetMonitor.sample()` acquires `performance.now()` inside `snapshot()` — additional timing call inside an already-timed call.

---

### Phase 7: Memory and GC Analysis

#### Allocation-Heavy Code Paths

| Path | Allocation | Frequency | GC Impact |
|---|---|---|---|
| `FrameBudgetMonitor.sample()` | `FrameBudgetSample` object (8 fields) | 60×/second | Minor GC every 2–5s |
| `ProceduralTextureFactory.generate()` | `Uint8Array` 1–16 MB per role | Per new artwork | Major GC during startup |
| `GalleryManager.checkPanelClick()` | `new THREE.Vector2()` | Per pointer click | Negligible |
| `RendererManager.getRendererSnapshot()` | `new THREE.Vector2()` | Every 5s (diag mode) | Negligible |
| `diagnostics.*` calls | `{}` argument objects | Per diagnostic event | Minor (non-default mode only) |

#### Long-lived vs Short-lived Object Imbalance

**Long-lived (correctly retained):**
- All textures in `TextureManager.cache` — correct; these are expensive to reload
- All procedural textures in `ProceduralTextureFactory.cache` — correct; generation is expensive
- `EffectComposer` internal render targets — correct; framebuffer reallocation is expensive

**Short-lived and GC-eligible:**
- `FrameBudgetSample` objects — 60/second, should be pooled or mutated in-place
- Procedural `Uint8Array` temporaries — unavoidable but can be pooled across calls for the same tile size

#### Caching Opportunities

- `Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5))` — cache as module-level constant or class property
- `getZoomBounds()` result — cache for the duration of one `update()` call
- `getViewportMetrics()` result — cache for the duration of one `update()` call (already fresher than needed given 120 ms resize debounce)

---

### Phase 8: Prioritized Optimization Roadmap

#### Tier 0 — Architectural Priority (Highest Impact, Moderate Complexity)

| # | Optimization | Target | Expected CPU Gain | Expected GPU Gain | Complexity | Risk |
|---|---|---|---|---|---|---|
| T0-A | Dirty-flag + frame cooldown idle render suppression (Approach A) | Phase 0 | ~97% reduction at idle | ~97% reduction at idle | Medium | Low-Medium |
| T0-B | rAF throttle interim (Approach C, quick win) | Phase 0 | ~92% reduction at idle | ~92% reduction at idle | Very Low | Low |

> T0-A should be designed first and implemented as a complete feature; T0-B can ship as a one-day interim while T0-A is being built.

#### Tier 1 — Critical Impact, Low Risk

| # | Optimization | Target | Expected CPU Gain | Expected GPU Gain | Memory Gain | Complexity | Risk |
|---|---|---|---|---|---|---|---|
| T1-A | Cache `fovTan` constant; memoize viewport metrics per-frame | CPU-1, CPU-2 | −0.5–2 ms/frame on mobile | None | None | Low | None |
| T1-B | Incremental rolling stats in `FrameBudgetMonitor` | CPU-4, MEM-2 | −0.05 ms/frame | None | −3.8 KB/s heap churn | Low | None |
| T1-C | Guard `console.debug` behind diagnostics mode | CPU-5 | −0.1–0.5 ms/navigation | None | None | Very Low | None |
| T1-D | Pre-allocate scratch vectors (Vector2) | MEM-3, MEM-4 | Negligible | None | Minor | Very Low | None |
| T1-E | Make side panels opaque (`transparent: false`) | GPU-3 | Negligible | Minor blend elimination | None | Very Low | None |

#### Tier 2 — Medium Impact, Moderate Complexity

| # | Optimization | Target | Expected CPU Gain | Expected GPU Gain | Memory Gain | Complexity | Risk |
|---|---|---|---|---|---|---|---|
| T2-A | Cache frame geometry by aspect ratio (skip rebuild on match) | GPU-4 | −1–5 ms/navigation | Eliminate GPU buffer upload | None | Medium | Low |
| T2-B | Disable bloom when effective contribution is below threshold | GPU-2 | None | −0.3–1 ms/frame GPU | None | Low | Low |
| T2-C | Reduce to 1 shadow-casting spotlight on balanced; disable on battery (already done) | GPU-1 | None | −25–50% base render cost | None | Low | Medium |
| T2-D | Eliminate redundant `updateMatrixWorld()` call | CPU-3 | ~0.01 ms/frame | None | None | Low | Low |

#### Tier 3 — Nice to Have, Architectural Refinement

| # | Optimization | Target | Expected CPU Gain | Expected GPU Gain | Memory Gain | Complexity | Risk |
|---|---|---|---|---|---|---|---|
| T3-A | Distance-based LOD for artwork plane vertex count | GPU-5 | Minor | −50× vertex count at overview | None | Medium | Medium |
| T3-B | Procedural texture generation via Web Worker | MEM-1, PIPE-1 | Remove from main thread during startup | None | Reduce main-thread GC | High | High |
| T3-C | Remove transparent side panel alpha channel entirely | GPU-3 | None | Eliminate alpha sort bucket | None | Very Low | None |
| T3-D | Dirty-flag update throttle (skip smoothDamp when settled) | CPU (frame idle) | −0.1 ms/frame at rest | None | None | Low | Low |

---

### Phase 9: Final Performance Report

#### Executive Summary

The FREYRAUM gallery runtime is well-architected for its use case: one artwork at a time, minimal scene graph, careful texture ownership. Draw call count is excellent (4–15 depending on preset). The primary optimization targets are:

1. **Per-frame CPU waste** in the viewport measurement cascade (CPU-1) and `FrameBudgetMonitor` linear scans (CPU-4) — both are purely algorithmic and carry no visual risk.
2. **GPU shadow map cost** (GPU-1) — shadow maps for 2–3 spotlights double the scene render cost for a single-object, flat-geometry scene where inter-object shadows are imperceptible.
3. **Navigation spike** from frame geometry rebuild (GPU-4) — affecting perceived responsiveness on navigation.
4. **Bloom at sub-perceptual strength** (GPU-2) — 10 framebuffer operations per frame for negligible visual output.

#### CPU Profile Summary

- **Heaviest per-frame path:** `galleryManager.update()` → `getViewportMetrics()` cascade (2–4 BoundingClientRect reads per frame)
- **Second heaviest:** `FrameBudgetMonitor.sample()` linear scans (O(3×60) per frame)
- **Both are fixable with zero visual risk**
- All other per-frame CPU costs are minor (lighting sin animation, smoothDamp, matrix transform)

#### GPU Profile Summary

- **Heaviest cost:** Shadow map render passes (2–3× render pass multiplier on high/balanced)
- **Second:** Bloom pass 10 ping-pong blits at near-zero contribution (high/balanced)
- **Third:** PBR painting material at ~23 texture reads/fragment under parallax+shadow (expected and correct for fidelity)
- **All of the above are presently accepted costs for the intended visual output** — the shadow and bloom optimizations require explicit acceptance testing to confirm no visible regression

#### Memory Profile Summary

- **No memory leaks detected** — ownership is clear, disposal is tracked
- **Primary GC pressure:** `FrameBudgetSample` (60 objects/second) and procedural Uint8Array temporaries during startup warmup
- **Both are addressable with Tier 1/Tier 2 changes**

#### Optimization Roadmap (Priority Order)

1. **T1-B** — `FrameBudgetMonitor` incremental stats + object reuse (minimal code, maximum GC win)
2. **T1-A** — Viewport metrics memoization + `fovTan` constant (best CPU/frame ratio)
3. **T1-C** — `console.debug` diagnostics guard (code quality + minor profiling improvement)
4. **T1-D / T1-E** — Vector2 reuse + side panel opacity (free wins)
5. **T2-A** — Frame geometry aspect cache (meaningful navigation smoothness improvement)
6. **T2-B** — Conditional bloom disable (free GPU frames on high/balanced)
7. **T2-C** — Shadow map count reduction on balanced (significant GPU win, needs visual validation)
8. **T2-D** — Eliminate redundant `updateMatrixWorld()` (trivial correctness check first)
9. **T3-D** — Dirty-flag idle throttle (reduces GPU/CPU when no animation is active)
10. **T3-A** — LOD vertex count (meaningful for overview distance; architectural)
11. **T3-B** — Worker-based procedural generation (only if startup time is measured as user-visible)

#### Architectural Recommendations

1. **Introduce a `FrameState` object** (pooled or mutated) computed once per tick and passed through the `update(now, frameState)` call chain — eliminates the `getViewportMetrics()` cascade by design.
2. **Adopt a dirty-render model** for the RAF loop: skip `postProcessing.render()` entirely when no animation is in progress (camera settled, no lighting animation, no user input for N frames). The `FrameBudgetMonitor` or a separate `AnimationStateMonitor` can track this. This is the single highest-impact architectural change available: it reduces GPU consumption to zero during idle gallery viewing.
3. **Explicit shadow map budget**: add a `shadowCastingLightCount: 0 | 1 | 2` field to `QualityPreset` rather than deriving it from `preset.shadows: boolean`. This enables per-profile tuning (e.g., inspection profile can enable 2 lights for raking shadow detail; gallery-soft only needs 1).
4. **Consider `renderer.setAnimationLoop(null)` + demand rendering** for a future "sleep when idle" feature. When the gallery is idle (user not interacting, no audio-driven effect, no animation), stop the RAF loop entirely and restart it on the next input event or `setTimeout` keepalive.

---

---

### Phase 10: Profiling Validation Plan

> **Run this baseline before implementing any Tier 1–3 optimization.** The data from Phase 10 turns planning estimates into confirmed measurements and prevents optimizing non-bottlenecks.

#### 10.1 Baseline Measurements (Before Any Change)

**Step 1 — Chrome DevTools Performance Trace (CPU baseline)**

1. Open gallery in Chrome with **DevTools → Performance → CPU: 4× slowdown** (simulates mid-range mobile)
2. Click record, interact with the gallery for 30 seconds: zoom in, navigate 5 artworks, zoom out, idle for 10 seconds
3. Stop recording; export trace as `.json`
4. Identify from the trace:
   - Frames per second (top bar)
   - Long tasks (> 50 ms marked in red)
   - `animate()` self-time and total-time per frame
   - `galleryManager.update()` contribution
   - `FrameBudgetMonitor.sample()` contribution
   - GC events (grey bars in the timeline)

**Step 2 — WebGL Frame Time Breakdown (GPU baseline)**

Use the **Spector.js** browser extension (spector.js.org) or Chrome DevTools **WebGL** inspector:

1. Capture one frame at static idle state → record GPU time per draw call and post-process pass
2. Capture one frame during active zoom → same
3. Capture one navigation frame → identify geometry rebuild spike

Record:
- Shadow map pass time (×2 lights)
- Main render pass time
- Bloom pass time (×10 blits)
- OutputPass time
- Total frame GPU time

**Step 3 — FPS + Frame Variance Measurement**

```typescript
// Add temporarily to diagnostics/debug mode only:
const frameTimes: number[] = [];
function animate(now: number) {
  requestAnimationFrame(animate);
  frameTimes.push(now);
  if (frameTimes.length > 120) frameTimes.shift();
  if (frameTimes.length >= 2) {
    const deltas = frameTimes.slice(1).map((t, i) => t - frameTimes[i]);
    const avg = deltas.reduce((a, b) => a + b) / deltas.length;
    const max = Math.max(...deltas);
    diagnostics.record('frameAvgMs', avg);
    diagnostics.record('frameMaxMs', max);  // jank detection
  }
}
```

Target: `frameAvgMs < 16.7` (60 fps), `frameMaxMs < 33` (no frame > 30 ms).

**Step 4 — Memory Snapshot (Heap Timeline)**

1. Chrome DevTools → Memory → Heap snapshot at startup completion
2. Chrome DevTools → Memory → Allocation timeline during 60 seconds of normal use
3. Identify:
   - Retained size of `TextureManager` cache
   - `FrameBudgetSample` objects in heap (should appear as frequent small allocations)
   - Any unexpected retained references

#### 10.2 Per-Optimization Measurement Protocol

For each Tier 1+ optimization, record:

| Metric | Before | After | Delta | Pass/Fail |
|---|---|---|---|---|
| CPU frame time (avg, ms) | | | | |
| CPU frame time (P99, ms) | | | | |
| GPU frame time (avg, ms) | | | | |
| Navigation spike (P99, ms) | | | | |
| GC events per minute | | | | |
| Peak JS heap (MB) | | | | |
| FPS at 4× CPU throttle | | | | |

**Pass criteria (suggested):**
- CPU avg: must not increase
- Navigation spike: must decrease (for navigation-related opts)
- GPU avg: must decrease (for GPU-related opts)
- No new long tasks (> 50 ms) introduced

#### 10.3 Visual Validation Protocol (For Perceptual-Risk Optimizations)

For OPT-4 (bloom), OPT-5 (shadows), OPT-6 (panels), OPT-9 (LOD):

1. Take a reference screenshot at: all lighting profiles × all artwork formats × full zoom + overview zoom = ~30–50 combinations
2. Apply the optimization
3. Take the same set of screenshots
4. Compare programmatically (`pixelmatch` or `resemblejs`) and visually
5. Record maximum pixel difference and affected region
6. **Pass criterion:** max pixel difference < 2% of pixels differ by > 10/255 on any comparison

For shadow changes additionally:
- Compare specifically the frame edge shadow softness at close zoom
- Compare the floor/wall shadow fade (if present) at all profiles

#### 10.4 Device Coverage for Performance Testing

| Device Class | Representative Device | Why |
|---|---|---|
| Desktop high-end | Chrome on MacBook M3 Pro | Primary customer device |
| Desktop mid-range | Chrome on Windows GTX 1060 | Baseline performance |
| Mobile high-end | Safari iOS on iPhone 15 | TBDR GPU, common |
| Mobile mid-range | Chrome on Android (Pixel 6a) | Adreno TBDR, shadow cost |
| Tablet | Safari iOS on iPad Pro M2 | Gallery kiosk target |

Shadow map and bloom savings will be disproportionately larger on mobile TBDR devices.

---

### Phase 11: Safe Rollout Sequence

> Sequenced implementation order accounting for risk, dependencies, and measurement gates. Each step must pass the Phase 10 measurement protocol before the next step begins.

#### Step 1 — CPU micro-optimizations (Zero visual risk, no measurement gate required)

```
T1-B: FrameBudgetMonitor incremental O(1) stats + snapshot object reuse
T1-A: fovTan cached constant + viewport metrics memoized per frame (Approach B)
T1-C: console.debug → diagnostics guard in ArtworkMesh.ts
T1-D: Pre-allocate scratch Vector2 instances
```

**Verification:** Run Chrome Performance trace; confirm `FrameBudgetMonitor.sample()` self-time drops from ~0.05 ms to < 0.01 ms. Confirm no GC events from `FrameBudgetSample` in 60-second trace. No visual comparison needed.

#### Step 2 — GC stabilization + object reuse

```
MEM-2: Pool or mutate FrameBudgetSample (part of T1-B above)
MEM-3/4: Reuse scratch Vector2 instances (T1-D above)
```

**Verification:** Heap allocation timeline shows no `FrameBudgetSample` churn. Minor GC frequency reduced.

#### Step 3 — Navigation spike reduction (CPU, low visual risk)

```
T2-A: Frame geometry aspect cache (Approach A equality skip first, then Approach B LRU)
T2-D: Eliminate redundant camera.updateMatrixWorld() call
```

**Verification:** Navigation profiler trace shows no `computeTangents` spike on same-aspect transitions. No visual change. Chrome Performance → Main thread shows clean 16 ms frames after navigation.

#### Step 4 — T0 idle render architecture (Highest impact, ship after Steps 1–3 are stable)

```
T0-B: rAF throttle (Approach C) as interim — ship first
T0-A: AnimationStateTracker dirty-flag system — design and test in isolation
     - Unit test: markDirty() → consume() → settle flow
     - Integration test: zoom/pan/navigation all trigger markDirty correctly
     - Regression: no input goes unrendered
```

**Verification:** Chrome Performance trace during 10-second idle after navigation shows near-zero main thread activity (no rAF callbacks executing render work). FPS counter shows 0–2 renders/second at idle. Device GPU temperature (measured via battery API) decreases within 30 seconds of idle.

#### Step 5 — GPU reductions (Requires visual validation gate before shipping)

```
T2-B: Bloom disable (bloomPass.enabled = false on balanced/high)
  → Prerequisites: peak luminance probe across all artworks (§OPT-4)
  → Validation: screenshot comparison all presets all artworks ✓

T2-C: Shadow map reduction
  → Start with: shadow map resolution 1024 → 512 (lowest visual risk)
  → Then: shadowCastingLightCount: 1 on high preset
  → Then: shadowCastingLightCount: 0 on balanced preset
  → Validation: shadow comparison all profiles all artworks ✓ with sign-off

T1-E: Side panels transparent → opaque
  → Validation: side-by-side at all profiles ✓
```

**Ship order within Step 5:** bloom first (least visual risk after luminance check), then panels, then shadows.

#### Step 6 — Architectural refinements (Design first; implement after Step 4 is stable)

```
T3-D: Dirty-flag update throttle (skip smoothDamp when settled) — extends T0-A
T3-A: Distance-based LOD for artwork plane (Approach A + C combined)
  → Prerequisites: confirm parallax imperceptible at LOD switch distance
  → Validation: no visible geometry pop at threshold distance
T3-B: Procedural texture Web Worker (only if startup time measured as user-visible on slow mobile)
```

#### Rollout Risk Summary

| Step | Visual Risk | CPU Risk | GPU Risk | Rollback Complexity |
|---|---|---|---|---|
| 1 (CPU micro) | None | None | None | Trivial |
| 2 (GC) | None | None | None | Trivial |
| 3 (navigation) | None | Low | None | Trivial |
| 4 (idle render) | None | Medium | None | Low (remove flag) |
| 5 (GPU reduce) | Medium | None | Medium | Low (toggle flag) |
| 6 (architectural) | Low-Medium | Low | Medium | Medium |

All GPU reductions (Step 5) should be gated behind quality preset flags so they can be independently toggled without a code deploy.

---

---

### Phase 12: Performance Regression Risk Model

> **Gating decisions in Phase 11 (rollout sequence) require a shared classification of what kind of regression each optimization can cause.** Without explicit risk types, reviewers and engineers will apply inconsistent hold/ship criteria to different optimizations.

#### 12.1 Regression Type Definitions

| Type | Name | Description | Detection method |
|---|---|---|---|
| **Type A** | Visual regression | A rendered pixel is perceptibly different from the baseline render | Screenshot comparison (pixelmatch/resemblejs); human sign-off |
| **Type B** | Structural regression | Scene graph, geometry, or buffer state diverges from expected invariants after an optimization | Profiler geometry-inspector; scene object count; WebGL buffer state audit |
| **Type C** | Behavioral regression | System logic (FrameBudgetMonitor, AdaptiveQualityController, idle state machine) operates on incorrect assumptions after an optimization | Unit tests on internal state machines; diagnostic overlay values checked at known scenarios |

#### 12.2 Optimization → Regression Type Matrix

| Optimization | Primary risk type | Secondary risk type | Notes |
|---|---|---|---|
| OPT-4 bloom disable | Type A | — | Bright specular pixels may become hard points rather than soft glows |
| OPT-5 shadow reduction | Type A | — | Contact shadows along frame edge; floor plane softness |
| OPT-6 side panels opaque | Type A | — | Hard edge where panel meets background at 0.95→1.0 opacity |
| OPT-9 LOD vertex count | Type A | Type B | Geometry pop at LOD threshold; mesh swap must not corrupt UV layout |
| OPT-2 aspect cache | Type B | — | Stale cached geometry used for wrong artwork if LRU eviction logic is wrong |
| OPT-1 fovTan + metrics cache | Type B | — | Stale viewport metrics if cache invalidation frame-count is mismanaged |
| OPT-3 FrameBudgetMonitor O(1) | Type C | — | Incremental accumulator drifts if oldest-slot removal has an off-by-one |
| Phase 0 (Approach A) dirty-flag | Type C | — | Input events that forget `markDirty()` produce stale renders |
| Phase 0 (Approach B) loop suspend | Type C | Type B | FrameBudgetMonitor rolling average stagnates during sleep; AdaptiveQualityController sees stale data |

#### 12.3 Gating Criteria by Type

**Type A — Visual regression gate (required before ship):**
- Automated pixel comparison across all lighting profiles × 5+ artworks × full/overview zoom
- Pass criterion: < 2% of pixels differ by > 10/255 (same as Phase 10.3)
- Additional manual sign-off at close inspection zoom for shadow and bloom changes
- **No Type A risk optimization ships without this gate, even if performance gains are significant**

**Type B — Structural regression gate (required before ship):**
- Verify scene object count and geometry vertex count are unchanged for same-aspect consecutive navigations (OPT-2)
- Verify `getViewportMetrics()` returns a value consistent with visible DOM layout at each frame the cache is read (OPT-1 Approach B)
- Verify LOD mesh has correct UVs and tangents after swap (OPT-9)
- May be validated via unit tests or a short diagnostic mode script

**Type C — Behavioral regression gate (required before ship):**
- `FrameBudgetMonitor` O(1) path: construct a 60-frame test sequence; compare rolling average, EMA, above-budget count, and severe-frame count to the O(N) reference path. Must be numerically identical.
- Dirty-flag system: write a unit test covering: (1) markDirty → consume returns true, (2) consecutive consume returns false after frames expire, (3) markDirty during active cooldown extends cooldown correctly, (4) all input event handlers and GalleryManager navigation methods call markDirty
- Loop suspension (Approach B): verify FrameBudgetMonitor rolling average resets to a neutral value (budget baseline) on loop resume, not stale sleep-period values

---

### Phase 13: Cross-Optimization Dependency Map

> Some optimizations interact — applying one changes the assumptions or visible output of another. This map documents the known interaction chains so engineers sequence them correctly and avoid cascading regressions.

#### 13.1 Dependency Map

```
[OPT-5 shadow reduction]
  → affects perceived contrast and local darkening at frame edges
  → COUPLING: reduces the apparent dark area surrounding the artwork
  → This makes high-frequency bloom (if re-enabled) more visually noticeable
  → Rule: validate OPT-4 (bloom) and OPT-5 (shadow) TOGETHER in Step 5,
    not independently. Shadow-off + bloom-off is a compound visual state;
    shadow-off + bloom-on is a different visual state than shadow-on + bloom-on.

[OPT-9 LOD vertex count]
  → switches artworkMesh geometry from 65K to ~1.2K triangles at overview distance
  → COUPLING: high-preset parallax (parallaxEnabled=true, parallaxSteps=10) runs
    in the FRAGMENT shader, not the vertex shader; it is driven by UV coordinates
    not vertex count. Reducing vertex count does NOT disable parallax fragment cost.
  → Rule: OPT-9 Approach A (geometry swap) must be paired with OPT-9 Approach C
    (uParallaxStrength fade to 0 at LOD distance) to capture both GPU savings.
    Shipping Approach A alone without C delivers only vertex shader savings; the
    dominant per-fragment parallax cost at overview distance is NOT eliminated.

[Phase 0 idle render / Approach B loop suspension]
  → stops setAnimationLoop; FrameBudgetMonitor.sample() is not called during sleep
  → COUPLING: FrameBudgetMonitor.rolling, .ema, and .belowBudget values stagnate
    at whatever was measured before sleep. AdaptiveQualityController (currently
    locked) reads these values; while the lock is active this is a no-op, but if
    the lock is ever lifted the controller will see artificially stable budget
    numbers during wake-up (the first few active frames after wake will be
    unexpectedly expensive due to shader/state warmup).
  → Rule: if Approach B (loop suspension) is implemented, FrameBudgetMonitor must
    receive a reset/cool-down call on loop-resume so its rolling average rebuilds
    from current frames, not from pre-sleep values. Alternatively, gate
    AdaptiveQualityController's decision logic on "frames since last wake > N".

[Phase 0 dirty-flag / Approach A]
  → skips postProcessing.render() on settled frames
  → COUPLING: FrameBudgetMonitor.sample(now) is still called on every rAF tick
    (the plan specifies this in §0.4 Approach A, "frameBudget.sample(now) to keep
    timing stats accurate"). This is correct and intentional; the monitor measures
    real wall-clock time not render time, so it should still run on skipped frames.
  → Rule: do NOT move frameBudget.sample() inside the "shouldRender" guard when
    implementing Approach A. The sample call must remain unconditional.

[OPT-5 shadow resolution (1024→512)]
  → reduces shadow map render target size by 4×
  → COUPLING: Three.js PCFSoftShadowMap uses a 4-sample PCF kernel; at 512×512
    the kernel footprint covers a larger world-space area than at 1024×1024, which
    softens shadow edges more. This is usually perceptually BETTER for a gallery
    lighting context (softer contact shadows) but must be validated per the Type A
    gate. Do not assume the softening is invisible.
  → Rule: include shadow softness comparison at close zoom in the OPT-5 visual
    gate, specifically the frame edge shadow on high preset.

[OPT-2 frame geometry aspect cache + OPT-9 LOD swap]
  → both manipulate artworkMesh.geometry assignments
  → COUPLING: if OPT-9 is implemented as Approach A (explicit hiRes/loRes geo swap),
    and OPT-2 is implemented as LRU aspect cache, they both compete to assign
    artworkMesh.geometry. The LOD swap is driven by camera distance; the aspect
    cache swap is driven by navigation. Assigning geometry from both systems
    simultaneously will cause thrashing or corruption.
  → Rule: if both are shipped, the LOD system must wrap the aspect-cached geometry
    (LOD selects between aspect-cached-hi and aspect-cached-lo), not the raw
    PlaneGeometry. Design the combined architecture before implementing either.
```

#### 13.2 Safe Implementation Ordering Derived from Dependencies

Based on the coupling map above, the following sequencing constraints apply:

1. **OPT-4 and OPT-5 must be validated as a pair in Step 5** (not independently committed).
2. **OPT-9 Approach A requires OPT-9 Approach C** to deliver meaningful GPU savings at overview; ship them together.
3. **Phase 0 Approach B requires FrameBudgetMonitor reset on wake**; do not ship without it.
4. **Phase 0 Approach A requires `frameBudget.sample()` to remain unconditional**; never move it inside the render guard.
5. **OPT-2 and OPT-9** must be designed jointly if both are targeted; the geometry ownership model must resolve the conflict before code is written.

---

### Phase 14: Measurement Success Criteria per Tier

> Optimization success is currently measured as "CPU/GPU metric must not increase" (Phase 10.2 pass criteria). This is insufficient for gating decisions — it defines the floor but not the target. Each tier needs an explicit success threshold to differentiate "good enough to ship" from "further work needed".

#### 14.1 Tier 0 — Idle Render Elimination

| Metric | Threshold to pass | Notes |
|---|---|---|
| FPS at static idle (> 3 s since last input) | ≤ 3 frames/second | Measured via diagnostics overlay in production build |
| GPU active time at idle (Chrome GPU panel) | < 5% of 16.7 ms | Excludes OS compositor overhead |
| FPS variance reduction (σ over 60-frame window) | ≥ 80% reduction vs baseline | σ at idle should approach 0 when render is suppressed |
| Max frame time spike after first user input (wake) | < 50 ms | First active frame after idle sleep may be expensive |
| FrameBudgetMonitor rolling average at idle | Must not drift to artificially low values | Stagnation is acceptable; artificial reduction is not |

#### 14.2 Tier 1 — CPU Micro-Optimizations

| Metric | Threshold to pass | Notes |
|---|---|---|
| `FrameBudgetMonitor.sample()` self-time (Chrome Perf) | < 0.01 ms/frame | Down from ~0.05–0.10 ms |
| GC events (minor collections) per minute at steady state | ≤ 4/minute | Down from ~12–20/minute from `FrameBudgetSample` churn |
| GC pause duration (P99) | < 1 ms | Down from ~0.5–2 ms |
| `galleryManager.update()` total time (4× CPU throttle) | ≤ 1.5 ms/frame | `getViewportMetrics()` cascade eliminated |
| CPU frame avg (4× CPU throttle, high preset, settled) | ≤ 2.5 ms/frame | Baseline ~1.2–4.5 ms |
| Regressions | Zero | No new long tasks; no GC event increase |

#### 14.3 Tier 2 — GPU Reductions

| Metric | Threshold to pass | Notes |
|---|---|---|
| GPU frame avg (desktop, high preset, active zoom) | Reduction ≥ stated estimate | Bloom off: −0.3–1 ms; shadow 1-light: −25–50% base cost |
| GPU frame avg (mobile TBDR, high preset) | Reduction ≥ 2× desktop percentage gain | TBDR bandwidth benefit is higher; measure separately |
| Navigation frame max spike (CPU, P99) | ≤ 5 ms | Down from ~2–7 ms; frame geo cache must deliver this |
| Visual comparison (all lighting profiles × artworks) | ≤ 2% pixels differ by > 10/255 | Type A gate; no exceptions |
| Shadow softness delta (close zoom, frame edge) | Human sign-off required | Type A gate |

#### 14.4 Tier 3 — Architectural Refinements

| Metric | Threshold to pass | Notes |
|---|---|---|
| Vertex count at overview distance (LOD active) | ≤ 2,000 triangles | Down from 65K; verifiable via renderer.info |
| Parallax texture reads at overview (Chrome GPU trace) | ≤ 2 reads/fragment | Approach C (uParallaxStrength=0) must be confirmed active |
| Startup time on slow mobile (4G + mid-range device) | < 8 seconds to entry CTA | Procedural Worker only if this threshold is measured as exceeded |
| LOD transition: no pop visible | Human sign-off at LOD switch camera Z | Type A gate for geometry swap |
| LOD + aspect cache: no geometry assignment conflict | Zero TypeB regressions | Structural gate; verified via renderer.info.render.triangles stability |

#### 14.5 FPS Variance as a First-Class Metric

> FPS average is not sufficient to describe frame stability. A scene delivering 60 fps average with P99 spikes of 80 ms is worse for gallery UX than 55 fps with P99 < 22 ms.

| Metric | Baseline (pre-optimization) | Target (post Tier 0+1) | Measurement |
|---|---|---|---|
| FPS variance σ at static idle | ~0 (render suppressed) or ~3 if unsuppressed | ~0 | Chrome rAF timestamps |
| FPS variance σ during active zoom/pan | ~2–5 fps | ≤ 2 fps | Chrome Performance trace |
| P99 frame time (all scenarios) | Currently unmeasured | < 25 ms (desktop), < 33 ms (mobile) | Phase 10.3 instrument |
| Max GC pause in 60-second session | Currently unmeasured | < 2 ms (P99) | Chrome Memory timeline |

These criteria replace the subjective "must not increase" pass condition with engineering-grade acceptance thresholds. Record all metrics in the Phase 10.2 measurement table before and after each Tier.

---

### Phase 15: Execution Record (2026-06-21)

> Execution pass against this plan. Canonical guide: this file. Constraint: the
> CI/sandbox has no interactive WebGL browser session, so Type A (visual) and
> live GPU/GC measurement gates cannot be exercised here. Per the plan's own
> safety rule, optimizations whose required gate cannot be run were **not
> shipped** and are recorded as deferred/rejected below.

#### Tooling alignment shipped (Phase 10 / Phase 12 hooks)

This closes the previously-missing "regression model → tooling" mapping. See
`docs/REGRESSION_TOOLING.md`.

| Regression type | Tool shipped |
|---|---|
| Type A — pixel diff | `scripts/visual-regression.mjs` (Playwright + pixelmatch; Phase 10.3 < 2% / 10-of-255 threshold) |
| Type B — invariants | `src/utils/RuntimeInvariants.ts` (geometry ownership, triangle ceiling, material binding, shadow-caster count, scene consistency) |
| Type C — GC/behavior | `src/utils/PerformanceMetrics.ts` (frame σ, P99, FPS σ, GC/min, GC pause P99, long tasks, heap); `scripts/test-frame-budget.mjs` equivalence gate |

Both runtime tools are exposed via `window.__FREYRAUM_PERF_TOOLS__` and are
passive/opt-in (zero production cost until invoked).

#### Optimizations shipped (zero visual risk; Phase 11 Step 1–2)

| ID | Change | Validation run |
|---|---|---|
| OPT-3 / T1-B | `FrameBudgetMonitor` O(1) incremental accumulators + reused snapshot objects (removes 3× O(60) scans and ~60 allocs/s) | `npm run test:frame-budget` — numerically identical to O(N) reference across 435 frames |
| OPT-1 / T1-A | Cached `tan(fov/2)` in `GalleryManager` (was recomputed 2–3×/frame) | typecheck/lint; output mathematically identical (FOV constant at runtime) |
| T1-C | `ArtworkMesh` `console.debug` → diagnostics pipeline (suppressed unless verbose) | lint/typecheck |
| OPT-7 / T1-D | Reused scratch `Vector2` in `RendererManager.getRendererSnapshot()` | lint/typecheck |

Validation baseline + post-change: `npm run lint`, `npm run build:typecheck`,
and `npm run build:preview` all pass.

#### Deferred / Rejected during execution phase due to regression risk

These require the Type A visual gate and/or live GPU/GC profiling, which cannot
be performed in this non-interactive sandbox. They are **not** shipped; the
tooling above is in place so they can be executed and gated in a follow-up with
a real browser session.

| ID | Reason |
|---|---|
| Phase 0 / T0-A,B,C (idle render suppression) | Behavioral (Type C) change requiring interactive input-coverage validation (every input path must `markDirty`); cannot verify no-stale-render in sandbox |
| OPT-4 / T2-B (bloom disable) | Type A gate + peak-luminance probe required; no browser session |
| OPT-5 / T2-C (shadow reduction) | Type A gate + per-profile shadow sign-off required |
| OPT-6 / T1-E (side panels opaque) | Type A gate required (panel/background seam at opacity 0.95→1.0) |
| OPT-2 / T2-A (frame geometry aspect cache) | Type B structural gate feasible, but navigation-spike benefit is unmeasurable without profiling; deferred to keep geometry ownership single-writer until OPT-9 design lands (Phase 13 §13.1) |
| OPT-9 / T3-A (LOD) | Type A + Phase 13 coupling (must pair geometry swap with `uParallaxStrength=0`; must co-design with OPT-2 geometry ownership) |
| T2-D (redundant `updateMatrixWorld`) | Deferred: requires confirming no consumer depends on the extra world-matrix refresh that frame; low benefit, not worth unguarded change |

---

*Audit completed and enhanced 2026-06-21. Phases 12–14 added 2026-06-21 based on reviewer feedback: Phase 0 architecture decision rule, GPU-1/2.5 TBDR qualifier, regression risk model, cross-optimization coupling map, and measurement success criteria per tier. No runtime profiling was performed — all estimates are derived from code structure analysis. Implement Phase 10 (Profiling Validation Plan) before starting any Tier 1+ code changes to establish measured baselines.*
