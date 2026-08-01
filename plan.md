# FREYRAUM Plan

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
