# FINDINGS

## Main Museum Hub environment polish findings (v1.00, 2026-09-02)

1. The hub's already-separated architectural profile is sufficient for premium
   room polish; no scene-manager, camera, route, or gallery rewrite is needed.
2. Removing hub ceiling and floor maps eliminates large-surface repetition and
   also avoids their texture samples. The close gallery remains mapped because
   its viewing distance and tactile target differ.
3. Warm off-white hub plaster at `0.88` roughness retains a broad highlight that
   describes smooth painted material better than the previous `0.965` finish.
4. Procedural wall color modulation is unnecessary at museum viewing distance.
   A `0.004` long-period roughness response is enough to prevent perfectly
   uniform shading without exposing a visible pattern.
5. Existing hemisphere and directional lights can support the target when their
   colors match the warm ceiling diffusers. Additional area lights, bloom, and
   shadow maps would add cost without proportionate benefit.
6. The existing on-demand, downscaled planar reflection remains appropriate,
   but lower strength keeps the floor material noticeable before the effect.

## Main Museum Hub plaster + lighting findings (v0.99, 2026-09-02)

1. The hub and interactive gallery already own independent
   `ArchitecturalSurfaceFactory` instances, so the wall treatment can diverge
   without splitting renderer ownership or changing the shared wall-color token.
2. Reusing the close-gallery plaster maps in the seven-metre hub room made their
   2.6 m repeat period perceptible. Raising texture resolution would sharpen the
   same repetition rather than remove it.
3. The hub now opts into a world-space wall profile with two broad,
   incommensurate scalar waves. Their periods exceed the room envelope and their
   color/roughness amplitudes remain below one and 1.5 percent respectively, so
   the finish breaks perfect CG uniformity without reading as procedural noise.
4. The interactive gallery remains on the mapped plaster profile introduced in
   v0.98. This preserves close-view tactile response while keeping the calmer hub
   wall appropriate to a spacious premium room.
5. The hub light rig did not need more lights or a new post-processing pass.
   Raising the broad hemisphere contribution and lowering/repositioning the two
   directions produces softer architectural modeling while retaining one
   preset-gated shadow caster.
6. Existing performance boundaries remain intact: the hub still renders only on
   mutation, shares one wall material, uses no animated shader state, and keeps
   the existing reflection and shadow quality gates.

## Wall surface realism + softer artwork-view lighting findings (v0.98, 2026-09-02)

1. After v0.97 the shared wall token and overall colour temperature were
   neutral, but the single-artwork wall still read too smooth because the wall
   plaster response had been flattened aggressively to kill the earlier amber
   cast.
2. The washed-out artwork look in the screenshot was not only a wall-colour
   problem. The fixed gallery rig still pushed too much total light into the
   artwork view, and matte presentations still kept a non-trivial base specular
   fallback (`0.08`) even when they had no authored specular path.
3. The shipped wall-material fix stays inside
   `src/materials/ArchitecturalSurfaceFactory.ts`: stronger wall normal response
   plus stronger plaster roughness breakup, while the ceiling remains calmer so
   the whole room does not become noisy.
4. The shipped artwork-view fix is two-part:
   - reduce ambient/direct gallery light energy and keep the two-key geometry on
     softer near-gallery angles in `src/lighting/LightProfile.ts`;
   - lower the base specular fallback in `src/materials/PaintingMaterial.ts` so
     matte presentations stay genuinely matte while satin/glazed works still
     preserve more sheen.
5. Lightweight regression protection is sufficient here. The existing
   `scripts/test-museum-hub-geometry.mjs` harness now asserts the softer
   lighting-energy budget, visible-but-restrained wall texture, calmer ceiling
   response, and matte-vs-satin specular separation without requiring a new
   render harness.

## Neutral gallery wall-lighting rebalance findings (v0.97, 2026-09-01)

1. The remaining beige/amber wall cast after v0.96 was no longer a token-sync
   issue. The shared wall token already resolved correctly, but the interactive
   gallery still lit that wall with one strong warm spotlight from a dramatic
   far-left position, and the wall plaster normal response exaggerated the cast.
2. The correct next fix is therefore not another token-only change. The
   interactive gallery must rebalance its fixed light composition
   (`src/lighting/LightProfile.ts`) and slightly flatten the wall material
   response (`src/materials/ArchitecturalSurfaceFactory.ts`) so the same token
   can read as concrete grey in the presented wall.
3. The shipped gallery-lighting rebalance uses a neutral 5000 K ambient fill,
   a closer 4600 K primary key around the documented ~45° gallery angle, and a
   softer 5200 K counter-fill instead of the previous theatrical single-key
   warm spotlight plus cool accent point light.
4. The hub has its own room-lighting path in `src/hub/HubRoomRenderer.ts`, so
   that lighting also had to be neutralized to keep hub and gallery walls on
   the same visual family.
5. Regression protection can stay deterministic without screenshot baselines:
   `scripts/test-museum-hub-geometry.mjs` now asserts a neutral enough ambient
   Kelvin, the balanced two-key setup, and the absence of the old far-left
   spotlight geometry.

## Concrete-grey wall retune findings (v0.96, 2026-09-01)

1. The screenshot is not a missing-texture problem. The beige/orange look comes
   from the combination of a very light wall token (`#D8DDDB`), a warm-cast
   architectural palette, and the fixed 3000/2700 K gallery lighting mix in the
   interactive inspection route.
2. The visible wall tone is shared across CSS shell backgrounds, WebGL clear
   color, gallery stage materials, and the checked-in customer hub config. A
   convincing concrete-grey fix therefore has to move the authoritative token
   itself instead of changing only one render path.
3. The shipped fix uses the cooler concrete-grey token `#C7CED4` across the
   shared wall-color pipeline (`customer-artworks/museum-hub.json`,
   `src/config/museumHub.ts`, `src/styles/main.scss`, `app.html`,
   `index.html`, `src/main.ts`, `src/core/RendererManager.ts`) so all fallback
   and rendered surfaces stay in sync.
4. The wall still read too warm under the previous coupled palette and 2700 K
   spotlight, so the fix also cools the floor/cove/edge palette in
   `src/materials/ArchitecturalSurfaceFactory.ts` and tempers the fixed gallery
   light profile in `src/lighting/LightProfile.ts` to 3600/3400/7200 K.
5. Regression protection remains lightweight: the existing token-consistency
   checks in `scripts/test-museum-hub-geometry.mjs` and
   `scripts/visual-regression.mjs` now assert the new authoritative token and
   CSS RGB values.

## Single-artwork inspection wall-clearance retune findings (v0.95, 2026-09-01)

1. The bug is in the interactive single-artwork gallery route, not the museum
   hub. The relevant path is `src/gallery/GalleryManager.ts` plus
   `src/gallery/ArtworkMesh.ts` and the front-wall geometry in
   `src/core/GalleryPresentationStage.ts`.
2. The issue appears only during close inspection because the previous pan math
   intentionally allowed additive overscroll past the artwork edge. That exposed
   the front stage wall behind the artwork whenever the user dragged the view to
   an extreme.
3. Hover tilt was a second contributing factor: even at inspection-scale
   rotation values, the mounted artwork could rotate backward farther than the
   current wall clearance and visually intersect the wall plane.
4. The first safe fix (v0.94) proved that zero overscroll plus wall-clearance
   clamping removed the clipping, but it also made inspection feel too tight at
   the artwork edge.
5. The shipped retune is therefore three-part:
   - move the gallery front wall farther back by increasing
     `ARTWORK_WALL_GAP` in `src/config/galleryPresentation.ts`;
   - restore only a smaller bounded inspection reveal margin
     (`DEFAULT_INSPECTION_OVERSCROLL_X = 0.45`,
     `DEFAULT_INSPECTION_OVERSCROLL_Y = 0.24`) through the shared
     `src/gallery/inspectionSafety.ts` helper;
   - keep hover rotation clamped to the actual stage clearance so the mounted
     artwork still remains in front of the wall even when the pointer target or
     zoom level changes.
6. The visible wall color stays on the existing authoritative museum-grey token
   path (`#D8DDDB`). This was a geometry/framing incident, not a
   texture/material/lighting issue, so the correct fix is to reveal the same
   wall more safely rather than inventing a separate inspection-only wall tint.
7. Regression coverage can stay lightweight and deterministic as pure geometry
   assertions. The inspection safety rules are now verified in
   `/home/runner/work/Freyraum/Freyraum/scripts/test-museum-hub-geometry.mjs`
   alongside the existing shared rendering-contract checks, including the deeper
   wall setback, bounded pan margin, full close-hover tilt, and continued clamp
   at larger hover rotations.

## Local file-preview blank-artwork recovery findings (v0.93, 2026-09-01)

> **As-built update:** The shipped local-preview repair is narrower than the
> original retry-after-blank plan. In the museum hub, offline `file://` runs now
> prefer the importer-provided embedded `webglImage` immediately when the
> declared source resolves to a local `file-url`, because that path already
> proved origin-clean and upload-stable in the same environment where the direct
> file image could decode yet still collapse to a blank wall plane. Inline/data
> artwork sources in the hub also get a longer load/decode window so the local
> preview still renders real artwork when it falls back to built-in embedded
> assets or when the embedded recovery path is selected first. Validation:
> `npm run import:artworks`, `npm run lint`, `npm run build:typecheck`,
> `npm run build`, `npm run validate:museum-hub`, `npm run test:frame-budget`,
> `npm run docs:check-config-authority`, plus explicit `file://` reproduction
> with and without generated customer scripts.

1. The customer screenshot shows the museum-hub room rendering correctly while
   every mounted artwork surface stays blank. That is a different failure class
   from the existing title-bearing hub placeholder and from the gallery’s
   branded generated fallback.
2. In the current architecture, that screenshot means the failure happens
   **after** slot mapping and **after** hub geometry: the visible break is at
   the final source→upload→visible-pixels boundary, not at wall selection,
   lighting, or `museum-hub.json`.
3. The local preview already carried the right recovery asset (`webglImage`),
   but the hub/gallery only retried it after request/decode failure. A decoded
   `file://` source that became blank after GPU upload could still be logged as
   success and leave the user looking at empty mounted panels.
4. The bounded visible-pixel probe therefore has to become authoritative in two
   cases only:
   - when verbose diagnostics explicitly ask for proof;
   - when the runtime is the local `file://` preview and the selected candidate
     is a `file-url`.
5. The shipped bounded fix is:
   - keep declared `image` primary for dev/server/Pages and other served
     environments;
   - in the hub's offline `file://` preview only, prefer embedded
     `webglImage` immediately when the primary candidate is a local `file-url`;
   - keep the truthful placeholder/fallback contract unchanged if the embedded
     source also fails;
   - give inline/data hub sources a longer load/decode budget so they are not
     falsely classified as failures in local preview.
6. The gallery had one extra cache/state pitfall: `showArtwork()` still looked up
   albedo by the declared primary URL even after `TextureManager` had selected a
   different winning source. The local-preview repair needed that lookup to
   respect the selected source URL as well.
7. Regression coverage is strongest as a pair:
   - pure shared probe-policy assertions in
     `/home/runner/work/Freyraum/Freyraum/scripts/test-museum-hub-geometry.mjs`;
   - a visual-regression fixture whose primary source decodes but produces a
     blank texture, requiring the embedded fallback to recover the artwork.

## Persistent grey-artwork investigation (v0.92, 2026-08-07)

> **As-built update:** The investigation below drove an implemented fix. See
> "As-built implementation notes" after the numbered findings for what shipped,
> what validated, and the one unrelated issue an automated review surfaced.

1. The current tracked customer setup is two PNG artworks, `Fraktal.png` and
   `Akt 27.png`, normalized as `fraktal` and `akt-27`; the shipping v4 hub
   configuration maps those exact IDs to its front-wall slots. The generated
   bundle/images are deliberately ignored and must be produced before a real
   runtime reproduction.
2. The v0.91 script-relative URL repair is implemented, but the renewed customer
   report invalidates any claim that URL resolution alone fixed this incident.
   Bundle existence and CI asset copying prove delivery intent, not browser
   decode, GPU upload, or a rendered customer pixel.
3. Hub and gallery fallbacks are diagnostic signatures, not generic grey styling.
   A title-bearing hub plane means `MainMuseumHub` exhausted its source
   candidates; a proportional FREYRAUM gallery gradient means `TextureManager`
   constructed a fallback. Neither is fixed by room lights, bloom, or PBR
   tuning.
4. The hub image plane uses `MeshBasicMaterial`; it is independent of lighting
   and the interactive `PaintingMaterial`. If a decoded hub image still renders
   grey, the next boundary to prove is WebGL map binding/upload, not gallery
   brightness.
5. The current fallback payload contains the same original image bytes as the
   primary PNG. It helps path/CORS failures but cannot recover a texture-size or
   decode-resource failure. A shared, bounded capability downscale is therefore
   required before retrying identical bytes.
6. Three.js guidance keeps albedo in `SRGBColorSpace` and puts non-colour
   normal/roughness/height/AO-style data in `NoColorSpace`. The repository’s
   existing non-colour `LinearSRGBColorSpace` usage is a separate gallery
   fidelity correction, not an explanation for a hub placeholder.
7. `PaintingMaterial` has a wired but currently zero `albedoFidelityFill`.
   Assess a conservative source-fidelity floor only after raw albedo and final
   material captures prove that a loaded gallery image is merely too dark. It
   must never be used to hide source failure.

### As-built implementation notes (v0.92)

- Added `src/utils/sourceToPixelOutcome.ts` (shared redacted outcome contract),
  `src/utils/textureUploadCompatibility.ts` (capability-aware downscale, keyed
  off live `renderer.capabilities.maxTextureSize`), and
  `src/utils/sourceToPixelProbe.ts` (bounded 4×4 GPU visible-pixel readback,
  cached per renderer, verbose-diagnostics-only).
- `TextureManager` (gallery route) records one `source-to-pixel-outcome`
  diagnostic per artwork in `loadArtworkAlbedo`, applies the shared downscale in
  `loadForRole` before any `THREE.Texture` reaches the GPU, and stores the
  computed fit per cache entry for reuse.
- `HubRoomRenderer.upsertSlot`/`imageTexture` (hub route) apply the same shared
  downscale before texture creation and return proof data (`SlotUpsertResult`);
  `MainMuseumHub.resolveSlotImage` folds that proof into the same shared
  outcome contract via `recordHubSourceToPixelOutcome`, on both the primary and
  embedded-fallback success paths, and on every terminal failure branch.
- The visible-pixel probe is gated behind `diagnostics.isDebugEnabled()`
  (verbose mode) in both routes: `readRenderTargetPixels` is a synchronous
  GPU-stalling call, so it must not run on default visitor traffic, only for a
  developer/CI proof session.
- The current `Fraktal.png`/`Akt 27.png` importer, manifest, and
  `scripts/import-artworks.mjs` were not touched; `git diff` against the
  importer/customer-artworks paths is empty. No lighting, `PaintingMaterial`,
  or fidelity change was made (Phase 4 stays future work).
- Validation: `npm run lint`, `npm run build:typecheck`, `npm run build`,
  `npm run validate:museum-hub`, `npm run test:frame-budget`, and
  `npm run docs:check-config-authority` all passed against the implemented
  change.
- An automated code review pass over this change surfaced one unrelated,
  pre-existing issue: `DestinationRouter.runTransition`'s rollback branch calls
  `previous.enter()` without first calling `previous.prepare()`, unlike the
  forward-transition path. This is outside the source-to-pixel scope of v0.92
  and was intentionally left unmodified; no runtime change was made for it.



- Three.js colour management:
  <https://threejs.org/manual/en/color-management.html>
- Three.js texture constants:
  <https://threejs.org/docs/#api/en/constants/Textures>
- Three.js texture-size capability:
  <https://threejs.org/docs/#api/en/renderers/WebGLCapabilities.maxTextureSize>
- Three.js texture loading:
  <https://threejs.org/docs/#api/en/loaders/TextureLoader>
- Three.js physical material:
  <https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial>
- MDN `HTMLImageElement.decode()`:
  <https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode>
- MDN CORS-enabled images:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/CORS_enabled_image>

The active implementation sequence and acceptance gates are canonical in
`plan.md § v0.92`.

## Persistent grey-artwork recovery findings (v0.91, 2026-08-07)

1. “Grey plane” identifies a symptom, not one renderer bug. The interactive
   gallery displays `TextureManager.createFallbackTexture()` when an albedo
   source fails; the museum hub displays `HubRoomRenderer.placeholderTexture()`
   after `MainMuseumHub` exhausts its primary and embedded fallback candidates.
   The two signatures must be identified before changing code.
2. The current v0.90 source-fallback contract is correctly bounded: the declared
   `image` is primary and `webglImage` is tried only after primary failure. It
   does not prove the generated artifact, image bytes, browser decode, CORS
   response, or GPU upload is valid; a final grey fallback remains expected when
   both candidates cannot render.
3. Current gallery evidence points first to asset loading, not material/lighting:
   `TextureManager.loadForRole()` creates a deliberate generated fallback after
   a load error, and `GalleryManager` records `show-artwork-fallback`. The
   gallery preserves manifest dimensions for mounted-work aspect, so a correctly
   proportioned grey plane is compatible with a failed image source.
4. Current hub evidence points first to source/decode state, not the painting
   shader: it uses an sRGB `THREE.Texture(image)` on `MeshBasicMaterial`, then
   explicitly maps final failures to a title-bearing placeholder. It also has
   independent five-second load/decode deadlines that need duration evidence on
   constrained devices.
5. The importer emits document-relative `./images/<id>.<ext>` paths into a
   generated classic script. That happens to work only while the document base
   agrees with the script location; it is a plausible cross-environment risk for
   `file://`, Vite development, and Pages under `/Freyraum/`. The preferred
   future repair is script-relative generated asset addressing plus a
   backward-compatible bundle envelope, not making base64 data primary.
6. Three.js research confirms that loader/manager completion is not per-image
   success: `TextureLoader` returns before the image is ready and
   `LoadingManager` completes after failures as well as successes. Future
   diagnostics/tests must record the per-artwork request, decode, map-bind, and
   upload outcome rather than infer success from startup completion.
7. The renderer and albedo settings are a low-probability root cause for missing
   pixels: both renderers output sRGB with `NoToneMapping`, and albedo maps are
   sRGB. Official Three.js guidance instead identifies a later, separate audit:
   non-colour normal/roughness/AO-style maps should use `NoColorSpace`, not be
   used to explain a source image that is absent.
8. `renderer.capabilities.maxTextureSize` must become an active pre-upload
   compatibility decision. The current manager logs an oversized decoded source
   only after it has loaded; it does not yet guarantee a bounded downscaled
   upload on mobile.
9. The first production hardening slice is now shipped: generated customer
   bundles publish a script-derived `assetBaseUrl` through
   `window.__FREYRAUM_ARTWORK_BUNDLE__`, runtime startup accepts that envelope
   as well as the legacy array, and both hub/gallery resolve relative customer
   image paths through the same declared-versus-resolved source candidate.

### Primary-source research for the v0.91 plan

- Three.js `TextureLoader`:
  <https://threejs.org/docs/#api/en/loaders/TextureLoader>
- Three.js `LoadingManager`:
  <https://threejs.org/docs/#api/en/loaders/managers/LoadingManager>
- Three.js colour management:
  <https://threejs.org/manual/en/color-management.html>
- Three.js texture-size capability:
  <https://threejs.org/docs/#api/en/renderers/WebGLCapabilities.maxTextureSize>
- MDN `HTMLImageElement.decode()`:
  <https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode>
- MDN CORS-enabled images:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/CORS_enabled_image>
- Vite static assets:
  <https://vite.dev/guide/assets.html>

The v0.91 source-addressing decision is retained in `plan.md § v0.91` as the
historical implemented slice. The active implementation sequence and acceptance
gates are canonical in `plan.md § v0.92`.

## Grey-artwork planning audit (current-branch evidence only, 2026-08-07)

1. The audited branch state was `copilot/planning-change-startup-flow` at
   `061da51ad4a6348be2e86fa8e440760326ae5615` with a clean working tree. The
   screenshot route is the **museum hub** (`src/hub/MainMuseumHub.ts` plus
   `src/hub/HubRoomRenderer.ts`), not the interactive gallery.
2. The visible titles in the screenshot are most likely **missing-image
   placeholders**, not successful artwork labels. In the current branch, the
   normal hub label pill stays hidden until hover/focus/selected, while the
   `.museum-hub__art-placeholder` becomes visible only when
   `.museum-hub__artwork.has-missing-image` is present. Commit `061da51` made
   that placeholder visibly render.
3. The screenshot data set does **not** match the checked-in customer inputs.
   Current tracked inbox art is only `Fraktal.png` and `Akt 27.png`, and the
   checked-in `customer-artworks/museum-hub.json` explicitly maps only those two
   artworks to the front wall. Screenshot titles such as `Gartenszene` and
   `Zdigital…` do not exist anywhere in the active branch.
4. The clean clone does **not** contain the generated customer-artwork runtime
   files needed to reproduce the screenshot state:
   `customer-preview/customer-artworks.js`, `public/customer-artworks.js`,
   generated preview/public `images/`, and `dist/` are all absent until the
   importer/build steps run locally.
5. The hub’s visible artwork surface is much simpler than the gallery shader
   path. The hub resolves a DOM image or fallback payload, then binds it to a
   `THREE.Texture(image)` on a `MeshBasicMaterial`. That makes the first
   debugging target the generated source/URL/fallback state, not a broad
   material rewrite.
6. Color management still needs verification after visibility is restored, but
   it is not the strongest current-branch explanation for the screenshot. The
   hub and gallery both use `renderer.outputColorSpace = THREE.SRGBColorSpace`
   with `NoToneMapping`; the gallery marks albedo textures as sRGB. The current
   non-albedo path uses `LinearSRGBColorSpace`, which should be checked against
   current official Three.js non-color guidance during the later color-pipeline
   phase.

## Shared artwork-source fallback findings (v0.90, 2026-08-07)

1. The grey museum-hub artwork symptom was caused by a real runtime split:
   `MainMuseumHub` used only the declared `image` path, while the interactive
   gallery could still succeed through `webglImage`.
2. The correct bounded fix is not to make `webglImage` primary everywhere.
   The deployable `image` path should stay authoritative, and the embedded data
   URL should be used only as an explicit fallback when the primary source
   fails.
3. Hub readiness must not treat a timeout as success. Every slot needs one of
   three explicit outcomes before reveal: decoded primary image, decoded
   embedded fallback, or declared unavailable placeholder.
4. The hub renderer can stay visually faithful with its existing unlit artwork
   plane so long as the resolved image source is warmed on upload and the slot
   records which source path actually won.
5. Regression coverage is strongest when fixture screenshots keep the same
   visible pixels but intentionally break the declared image path and require the
   embedded fallback to recover the artwork.

## Interactive-gallery stage + mounted presentation findings (v0.89, 2026-08-07)

1. The interactive gallery needed its own compact architectural shell inside the
   existing `SceneManager` scene; the v0.87 hub room was already correct and
   should remain a separate renderer path.
2. Gallery and hub can share one architectural material language without sharing
   live Three.js ownership. Separate `ArchitecturalSurfaceFactory` instances are
   the safe boundary on quality changes, disposal, and context restoration.
3. The mounted-object cue is more reliable when the customer image plane stays
   shadow-free and a separate opaque artwork body casts the wall shadow. This
   preserves colour fidelity while still giving the gallery stage a believable
   near-wall contact cue.
4. `Artwork.surface` remains descriptive prose. A new optional validated
   `presentation` field is the correct place for interactive-gallery defaults,
   and `matte-print` is the safe fallback for legacy imports.
5. A conservative first presentation pass can materially improve the gallery by
   changing which procedural roles are allowed per profile (`canvas` keeps the
   existing relief path; print/paper profiles stay flatter) without adding new
   dependencies, a second artwork pipeline, or speculative frame/glass systems.

## Interactive-gallery architectural presentation findings (v0.88 plan, 2026-08-07)

1. The v0.87 hub’s room-edge fix is already complete and scoped to its dedicated
   `HubRoomRenderer`: entry-side wall extension plus rear closure prevent the
   calibrated hub camera from exposing an open shell. The interactive gallery
   uses a different `SceneManager` scene containing a PMREM environment and
   one painting plane, not a room. A gallery-stage addition is therefore the
   correct bounded response; changing hub geometry, camera clipping, or global
   culling would not solve the active-gallery presentation gap.
2. The current gallery colour path is a suitable fidelity baseline:
   `RendererManager` outputs sRGB with `NoToneMapping`, `TextureManager`
   marks albedo as sRGB and data maps as non-colour, and normal gallery
   material application has zero emissive intensity. Future physical cues must
   be validated against the existing albedo-only debug mode rather than
   compensating for lighting by self-lighting the customer image.
3. `Artwork.surface` is descriptive imported text, not a rendering contract.
   A future media choice must use a separately named optional, validated
   presentation field with a clean `matte-print` default. Inferring a canvas
   effect from arbitrary `surface`, title, tags, or image aspect would apply a
   distracting pattern to photographs and prints.
4. A small number of shared profile detail textures and finite material
   variants is more appropriate than per-artwork shader/map generation. The
   existing loader, readiness ledger, warm-up, prefetch cancellation, and
   texture disposal already provide the correct resource boundary for
   profile-aware fallbacks.
5. The existing quality architecture already protects DPR, shadows, map size,
   anisotropy, shader complexity, post-processing, and hub material quality.
   Gallery-stage shadow/glass/detail decisions should become fields in the
   same explicit high/balanced/battery policy; automatic quality remains
   diagnostic-only because users retain their selected preset.

### Primary-source research recorded for this plan

- Three.js colour-management guidance:
  <https://threejs.org/docs/index.html?q=color#manual/en/introduction/Color-management>
  supports the sRGB-colour versus linear/non-colour texture assignment above.
- Three.js renderer tone-mapping guidance:
  <https://threejs.org/docs/index.html?q=ren#api/en/renderers/WebGLRenderer.toneMapping>
  supports treating tone-map changes as colour-fidelity changes, not a generic
  realism upgrade.
- Three.js physical-material documentation:
  <https://threejs.org/docs/index.html?q=meshphys#api/en/materials/MeshPhysicalMaterial>
  supports using standard roughness, normal, and quality-gated clearcoat before
  extending shaders for a presentation profile.
- Three.js capability documentation:
  <https://threejs.org/docs/index.html?q=capab#api/en/renderers/WebGLCapabilities.maxTextureSize>
  supports retaining the renderer-specific texture-size guard on mobile and
  desktop.
- MDN idle-callback guidance:
  <https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback>
  supports the existing feature-detected, timeout-bounded idle-prefetch
  scheduling with a timer fallback.

## Square-room hub architectural quality findings (v0.87, 2026-08-02)

1. A square hub scene needs an entry-side enclosure behind the calibrated
   camera; otherwise wide desktop and portrait wall-focus views can expose the
   open back of the shell.
2. Architectural hub surfaces should share one small material set with
   tileable procedural maps regenerated in place when quality changes.
   Rebinding maps on the same material instances preserves shader/program reuse
   while still scaling texture cost by preset.
3. An on-demand planar floor reflection is affordable in the static hub
   because the scene only rerenders on mutation. Hiding reflection-sampling
   floor meshes during the mirrored pass prevents feedback, while Fresnel plus
   roughness weighting keeps the effect as satin sheen instead of mirror
   glass.
4. Mounted artwork depth should come from a shadow-casting edge shell plus a
   separate soft contact shadow, not from the transparent image plane itself;
   this keeps artwork imagery color-accurate while still letting the room
   lighting explain the object in space.
5. Runtime quality switches must update the hub renderer as well as
   gallery/post-processing/lighting managers, or users can move between
   destinations with mismatched performance and visual contracts.

## Authoritative 3D museum-hub room findings (v0.86, 2026-08-01)

1. Once a hub scene has real wall-local transforms, the DOM should stop drawing
   the artworks. Keeping DOM buttons only as projected interaction masks avoids
   duplicate perspective systems and makes the camera chain the single source of
   truth.
2. Doorway safety is more robust when fallback stays in authored wall space:
   clamp/solve locally first, then fall through to the next valid wall bucket
   only after same-wall candidates fail. This preserves deterministic behavior
   and keeps warnings explainable.
3. A lightweight room model does not need full gallery complexity. Four wall
   meshes plus floor/ceiling geometry are enough to produce believable
   perspective, preserve wall ownership, and keep the hub runtime cheap.
4. Grey-surface regressions hide in fatal-startup paths more often than steady
   state. Re-applying the resolved token to `documentElement`, `body`, `#app`,
   and the fallback screen before rendering closes the last white flash path.
5. Visual hub regressions are easier to catch when the screenshot harness checks
   the architectural contract too: presence of the dedicated hub canvas, lack of
   per-slot transform projection, and projected clip paths together prove the 3D
   scene bridge is still active.

## Museum-hub realism / selection / wall-token hardening findings (v0.85, 2026-08-01)

1. The photographed room should keep one explicit stage-space reference per wall
   even when slot rendering stays camera-driven. Reconciling room-local wall
   dimensions/axes to those reference quads lets the camera chain preserve
   believable perspective without forcing hand-edited slot anchors to be
   rewritten one by one.
2. Doorway avoidance is only stable when every candidate is solved and scored in
   room-local space before projection. Using stage-space or mixed-space fallback
   checks makes doorway-edge results nondeterministic and obscures why a slot
   moved or disappeared.
3. Persistent hub feedback must belong to the current artwork ID, not the last
   focused slot. Gallery navigation can change the selected work after hub entry,
   so hub return/focus restoration has to re-derive page and slot identity from
   immutable artwork/slot maps.
4. Grey-token drift is easiest to catch at lifecycle boundaries rather than only
   at startup. Structured boot/transition/context-restore/fallback surface
   snapshots reveal when CSS variables, document shell, and renderer clear color
   diverge even if the initial boot state looked correct.
5. Visual regression around the hub needs full round trips, not static room
   screenshots alone: doorway-edge fixtures, return-to-hub selected-state checks,
   and context-restore token assertions catch failures that containment-only and
   first-paint-only tests miss.
6. Playwright capture should treat hub background 404s as reportable screenshot
   state, not a terminal failure. Reading the runtime’s structured hub-asset
   diagnostics before each screenshot lets the harness preserve attempted URLs,
   failed URLs, fallback choice (`museum-empty.png` vs neutral grey), and the
   screenshot artifact in one deterministic report.

## Calibrated 3D hub reconstruction findings (v0.84, 2026-08-01)

1. Stage-space quads are useful calibration references, but cannot be the
   authoritative placement model: camera and wall-local geometry must own every
   artwork projection to preserve shared perspective.
2. Doorway and hanging-band constraints are safest before projection, where
   metric-like wall-local dimensions make containment/intersection deterministic.
3. A failed room image requires one distinct fallback attempt followed by a
   neutral token surface; retrying the same URL risks an unbounded error loop.
4. Gallery, hub, boot shell, fallback, and WebGL must resolve the same grey
   token before renderer construction to avoid a white transition surface.
5. `Backgrounds/...` resolves to deployed `/backgrounds/...`, but
   `museum-target.png` is intentionally reference-only and excluded from
   `public/backgrounds/`; missing or unshipped hub asset paths therefore need a
   structured non-fatal 404 downgrade, not a hard failure.

## Museum-hub topology + containment findings (v0.83, 2026-08-01)

1. A single homography is only reliable for one physical wall plane. If a
   config wall quad spans folded room geometry (doorway-side + rear wall),
   artwork perspective drift is unavoidable even when projection math is
   correct.
2. Safe-zone checks are only meaningful when both operands share one coordinate
   space. Comparing wall-local artwork quads against stage-space safe polygons
   silently invalidates containment checks.
3. A robust hub geometry gate must validate the shipping
   `customer-artworks/museum-hub.json`, not only synthetic migration/overlap
   fixtures. Stage-space containment, doorway exclusions, size thresholds, and
   numeric projection tolerances are all required to catch real regressions.
4. Read-only runtime overlays (`?hubDebug=1`) are a safer day-to-day diagnosis
   path than edit-capable calibration mode when the immediate goal is
   observability, not authoring.
5. Wall-color consistency issues are better caught with runtime token/CSS/WebGL
   snapshots than broad restyling. Shell surfaces outside the runtime root can
   still drift and should be normalized explicitly.

## Wall-plane museum hub projection findings (v0.82, 2026-08-01)

1. A fixed photographed room can achieve believable side-wall perspective
   without a second 3D scene when every artwork is projected from one
   calibrated wall plane and the stage itself remains fixed.
2. The crucial abstraction is wall-local authoring, not per-slot screen boxes:
   store one wall quad + safe polygon, then derive each artwork quad from its
   wall-local center, mounted height, and native aspect ratio.
3. v1 slot boxes can migrate safely when the runtime preserves slot IDs and
   artwork IDs, converts screen-space centers back into wall-local coordinates,
   and marks the result provisional for recalibration rather than silently
   reinterpreting the customer layout as final.
4. A calibration mode becomes materially safer once the runtime can validate
   convex wall quads, safe-zone containment, overlap, and projected short-edge
   thresholds before accepting an exported config as the last known good state.
5. Hub visual regression should cover both desktop full-room and narrow-phone
   wall-focus states; otherwise perspective regressions on side walls and mobile
   focus transforms can slip through unchanged gallery baselines.

## Manifest-driven hub composition findings (v0.81, 2026-07-31)

1. Hotspots layered over a baked room photograph and DOM frames composing real
   artwork images cannot coexist: the baked pixels always drift from the
   manifest. Composition over `museum-empty.png` makes the manifest the single
   source of truth, and making the whole visible frame one native `<button>`
   removes the visual-bounds/hit-bounds drift class entirely.
2. Injected non-empty configurations must merge with coverage invariants, not
   replace defaults: unmapped active artworks are auto-placed (aspect class →
   intended use, then stable ID order) and overflow paginates. The former
   six-artwork derivation cap silently orphaned works; the resolver now scales
   `ceil(N / 4)` pages with page-qualified `room-NN.*` slot IDs.
3. Selection readiness must be target-specific and generation-guarded. The
   previous timeout path opened the gallery's *current* index, which could show
   the wrong artwork after rapid clicks; the exact-ID controller re-resolves
   the target on activation, ignores stale completions, and the 1500 ms
   fallback opens the same exact target with its procedural surface.
4. `roughness`/`metalness` can stay canonical material metadata for DOM frames
   when translated once into `--frame-highlight`/`--frame-shadow` strengths
   (`frameMaterialStrengths`). Static wall-specific light direction
   (`--frame-light-x`) fakes coherent room lighting without animation, extra
   draw calls, or per-slot styles.
5. A wall color used by both CSS and WebGL must resolve before renderer
   construction: `resolveMuseumHub` produces validated visual tokens, main.ts
   writes them to CSS custom properties, and `RendererManager` receives the
   same string — hex drift like `#eef1f3` vs `#ecebe8` cannot recur. The
   `#eef1f3` inside `artworks.ts` is artwork SVG content, not a wall surface,
   and intentionally stays.
6. Buttons re-enabled after a transition must recompute contextual disabled
   state (pager arrows at range edges), not blanket-enable. Presentation-mode
   opacity on a parent cannot be overridden by a child, so the always-visible
   back control requires fading sibling groups (`topbar__brand-group`,
   `topbar__right`) instead of the whole `.topbar`.
7. In narrow wall-focus views, the scaled shared visual keeps edge slivers of
   the other wall inside the viewport; those frames must leave the actionable
   set (`is-off-wall`: `visibility: hidden` + `pointer-events: none`) or they
   become misleading partial targets.
8. `customer-preview/audio/` was generated importer output missing from
   `.gitignore` (unlike `images/`); importer runs on clean machines would
   otherwise commit customer audio artifacts.

## Hub visual reliability findings (2026-07-31)

1. GitHub user-attachment URLs are not a reliable production asset contract.
   The committed museum backgrounds now flow through
   `scripts/sync-customer-public.mjs` into `public/backgrounds/` and the Pages
   artifact.
2. Importing the 5.8 MB and 11.2 MB backgrounds with `new URL(...,
   import.meta.url)` works for the Pages build but makes Vite library mode
   inline both files, growing `customer-preview/freyraum-gallery.js` from about
   0.7 MB to 23.3 MB. Runtime base paths plus copied static files avoid that
   regression.
3. Relative asset URLs must not be compared to `HTMLImageElement.src`, which
   returns an absolute URL. Fallback selection uses explicit state so a failed
   fallback cannot create an error/reassignment loop.
4. The customer hotspot seed values were wall-band placeholders, not artwork
   bounds. Calibration from the supplied 1366 × 768 reference places `fraktal`
   at `(0.185, 0.514, 0.056, 0.207)` and `akt-27` at
   `(0.625, 0.515, 0.098, 0.160)`. The local target image was not visually
   inspected.
5. A generic central destination must not overlap artwork-specific hotspots.
   It remains only as the no-hotspot fallback; artwork hotspots own focus and
   activation whenever they exist.
6. The idle texture-prefetch sweep must advance its cursor before invoking a
   callback-capable scheduler. Missing authored texture sets complete
   synchronously; advancing afterward caused unbounded recursion during startup.
7. Visibility checks in a later bubbling listener cannot determine whether an
   earlier listener already closed an overlay. Escape-owning components consume
   the event, and global keyboard navigation ignores default-prevented events.
8. A canvas requires an explicit `tabindex="-1"` to be a reliable
   programmatic focus destination without joining sequential Tab navigation.

## Hub hotspot navigation decisions (2026-07-31)

1. `.museum-hub__visual` is a fixed 16:9 content box with `object-fit: fill`,
   so normalized hotspot coordinates map 1:1 to CSS percentages inside the
   visual — no `object-fit: cover` inversion and no image-pixel reads are
   needed. The existing `.museum-hub__destination` button already uses this
   percentage-positioning pattern.
2. Slot→artwork mapping resolves by artwork ID string (importer IDs are
   `normalizeId(stem)` + `uniqueId`, e.g. `Akt 27.png` → `akt-27`), so
   customer re-imports do not silently shift hotspot targets. `@order:<n>`
   covers customers who prefer positional mapping.
3. The readiness gate reuses the existing 6-stage ledger: `materialApplied &&
   shaderCompiled` is the minimal interactive contract, and the 1500 ms
   timeout is safe because the procedural fallback material always provides a
   paintable surface (`GalleryManager.whenArtworkInteractive`).
4. Injection reuses the Option-C pattern: hotspots are appended to
   `customer-preview/customer-artworks.js` as `window.__FREYRAUM_HUB_HOTSPOTS`,
   so no new script tag, sync entry, or cache-busting path is required.
5. Escape-to-hub must be guarded in `main.ts` (open keyboard-help/preferences
   panels, `document.fullscreenElement`) because existing Escape handlers do
   not call `preventDefault`/`stopPropagation`.

## Main Museum Hub decisions (2026-07-31)

1. The lowest-risk integration point is after existing gallery readiness and
   before loading-overlay dismissal. Gallery preload, shader warmup, and the
   production render loop remain unchanged.
2. The hub is a static DOM presentation over the shared WebGL runtime. This uses
   the supplied room composition exactly while avoiding a second scene, camera,
   renderer, or continuous hub animation.
3. `DestinationRouter` provides the scalable boundary: registered destinations
   own prepare/enter/exit hooks, while the router owns synchronous transition
   locking, stale-transition generation checks, state reporting, and recovery.
4. Gallery pointer and keyboard controllers require explicit enable/disable
   gates because both install listeners before the loading overlay is dismissed.
5. Deferred gallery GPU warm renders temporarily expose the hidden artwork root
   only for their offscreen render, preserving the existing readiness contract.

## Runtime presentation decisions (2026-07-19)

1. Lighting is a fixed runtime concern, not a preference. `LightingSetup` owns the
   sole dramatic configuration and preference restore cannot override it.
2. Artwork presentation has one mesh per painting. Metallic frame and side-preview
   scene objects were fully removed, reducing scene graph, shader, and raycast work.
3. Timeline visibility is invariant across responsive layouts. Clean-chrome state
   applies only to artwork information and navigation controls.
4. `Artwork.surface` is plain customer-facing metadata. It has no path into
   `PaintingMaterial`; only authored maps and quality presets affect rendering.
5. CSS and WebGL share `#eef1f3`, preventing a white transition between document,
   canvas initialization, and reveal.

## Active findings — high-resolution asset delivery audit (2026-07-07)

1. **The current publish path is source-file-based, not derivative-based.**
   The repository currently expects customer artwork source files to be committed
   directly in `customer-artworks/inbox/`, and CI rebuilds the deployable assets
   from those tracked originals.

2. **The importer duplicates the heaviest asset bytes multiple times.**
   `scripts/import-artworks.mjs` copies the source image into
   `customer-preview/images/` and also embeds the exact original bytes into
   `window.__FREYRAUM_ARTWORKS[*].webglImage` as a base64 data URL. A roughly
   25 MiB JPEG therefore becomes both a shipped image file and an even larger JS
   payload before the final Pages artifact is built.

3. **GitHub’s official limits rule out “commit the masters” as a reliable long-term strategy.**
   Official GitHub documentation states:
   - browser uploads are capped at **25 MiB** per file,
   - regular Git warns above **50 MiB** and blocks files above **100 MiB**,
   - GitHub Pages sites may be no larger than **1 GB**,
   - Git LFS **cannot be used with GitHub Pages sites**.

4. **The reliable architecture is to separate archival masters from deployed derivatives.**
   The Pages site should consume compact publish assets only, while oversized
   originals stay local or in separate archive storage. The current exact-byte
   `webglImage` strategy should become local-preview-only if retained at all.

### Sources

- Repository audit:
  - `scripts/import-artworks.mjs`
  - `scripts/sync-customer-public.mjs`
  - `app.html`
  - `.github/workflows/deploy-pages.yml`
- Official GitHub docs:
  - https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
  - https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage
  - https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

## Decisions

- Do **not** treat Git LFS as the solution for live Pages artwork delivery.
- Plan toward a **tracked publish bundle + untracked/external masters** model.
- Keep the deployed manifest compact; do not ship full-size image bytes inside
  committed JavaScript.

## Active findings — documentation/tooling remediation (2026-06-21)

1. The primary drift source is duplicated status/config/runtime text across operational docs.
2. `docs/QUERY_PARAMETERS.md` already matches current startup/debug/backend/preferences implementation and should remain the sole config authority.
3. Dependency/tooling drift is present:
   - `eslint@8` is deprecated.
   - `@typescript-eslint` 7.x compatibility lags the locked TypeScript version.
   - `npm audit` reports vulnerabilities tied to transitive/tooling dependencies.
4. Lack of contributor-facing freshness rules and CI checks allows drift to re-accumulate.

## Historical decisions — documentation/tooling remediation (2026-06-21)

- Keep historical rationale in `docs/archive/` rather than relying on Git history.
- Keep release history in `CHANGELOG.md`.
- Keep config tables exclusively in `docs/QUERY_PARAMETERS.md`.
- Use contributor policy + CI checks to prevent recurrence.

## Historical context

Long-form historical findings have been moved to:

- `docs/archive/findings-history-2026-06-21.md`

---

## Performance remediation findings — completion pass (2026-06-21)

Source: implementation pass responding to the partial-correctness verdict for
`plan.md § v0.74`.

### Findings verified in code

1. **OPT-1 required metric propagation, not only `fovTan` caching.**
   `GalleryManager.update()` previously called `clampZoom()` and
   `clampPanTargets()` without passing the already-known viewport metrics, which
   re-entered `getViewportMetrics()`. The fixed path computes metrics/bounds
   once for the frame and reuses them through zoom/pan clamping.

2. **OPT-2 can safely ship as a frame-only geometry cache.** The cache added in
   `ArtworkMesh` is scoped to `frameMesh.geometry` and keyed by frame dimensions
   plus bevel state. It does not assign `artworkMesh.geometry`, so it does not
   create the OPT-9 artwork LOD ownership conflict documented for a broader
   aspect-cache design.

3. **Debug diagnostics must be skipped before payload serialization.** Routing
   direct `console.debug` calls through diagnostics was insufficient while
   default-mode debug entries were still serialized/deduped/stored. Diagnostics
   now drops debug events unless mode is `verbose` and supports lazy payload
   factories for hot debug callsites.

4. **Idle suppression can be introduced without stopping rAF.** The shipped
   Phase 0 step keeps rAF and `FrameBudgetMonitor.sample()` active, then skips
   the render/composer path when the scene is settled. This avoids the
   `setAnimationLoop(null)` measurement-stagnation risk while reducing idle GPU
   work.

5. **Regression tooling is stronger when gates are composed.** The Type A
   script now fails if Type B invariants fail for any visual state. This catches
   structural regressions during screenshot capture instead of relying on a
   separate console-only workflow.

### Validation notes

- Baseline before edits passed: `npm install`, `npm run lint`, `npm run build`,
  `npm run test:frame-budget`, `npm run docs:check-config-authority`.
- Runtime edit checkpoint passed: `npm run lint`, `npm run build:typecheck`.

---

## Performance audit findings — reviewer feedback integration (2026-06-21)

Source: external performance audit review of `plan.md § v0.74` at v0.73 HEAD.

### Key validated findings

1. **Always-on render loop is the dominant systemic inefficiency** — elevated to Tier 0 in plan.md. Even at static idle (camera settled, no animation), the full GPU and CPU pipeline runs at 60–120 Hz. This produces ~97% unnecessary GPU work during the primary use-case (passive gallery viewing). This insight was under-represented in the initial audit (mentioned only as a footnote in Phase 9 Architectural Recommendations). Now documented as Phase 0 with three concrete implementation approaches.

2. **Visual-risk optimizations require explicit validation gates** — OPT-4 (bloom disable), OPT-5 (shadow reduction), OPT-6 (panel opacity change), and OPT-9 (LOD switching) are classified as "zero/low code risk" but carry "perceptual risk". The plan now requires side-by-side render comparisons at all lighting profiles before any of these optimizations ship. Bloom disable additionally requires a peak luminance probe (64×64 `readRenderTargetPixels` pass) to confirm no artwork produces luminance > threshold.

3. **Mobile GPU shadow cost is not just render passes** — TBDR GPU architectures (all Apple Silicon, most Android GPUs) incur disproportionate shadow map bandwidth cost due to depth buffer resolution and tile memory reload. A shadow map can cost 2–4× more on a tile-based GPU than on an immediate-mode desktop GPU. This makes OPT-5 (shadow reduction) disproportionately valuable for gallery-on-iPad/MacBook-Air use cases. Documented in GPU-1 section and Phase 2.5 mobile GPU row.

4. **Frame budget aggregation was missing** — initial audit listed costs individually without summing them. Phase 2.5 now provides worst-case CPU/GPU/spike/startup budget stacks with engineering-grade estimates. Key values: CPU steady-state ~0.5–1.8 ms/frame (desktop), ~1.2–4.5 ms/frame (mobile); GPU steady-state ~2.5–8 ms/frame (desktop), ~5–20 ms/frame (mobile TBDR on high preset with shadows).

5. **Bloom assumption needs verification, not assertion** — the claim "no scene pixel exceeds luminance 1.2 with NoToneMapping" is almost certainly correct, but PBR specular highlights can produce unexpected bright spikes depending on artwork texture content. Added peak luminance probe requirement as a prerequisite for OPT-4.

### Confirmed strong areas (no changes needed)

- CPU-1 (viewport metrics cascade) analysis is correct and matches real WebGL anti-patterns
- FrameBudgetMonitor O(n)→O(1) accumulator upgrade design is sound
- Procedural texture GC burst analysis is accurate
- Draw call count (4–15/frame depending on preset) is correctly low
- Memory ownership model (TextureManager, ProceduralTextureFactory) is sound with no detected leaks

---

## Performance audit findings — second-pass refinements (2026-06-21)

Source: reviewer feedback on the Phase 0–11 planning document, plus follow-up static analysis of `FrameBudgetMonitor.ts`, `GalleryManager.ts` (smoothDamp/parallax), `PostProcessing.ts` (bloom), `LightingSetup.ts` (shadow), `quality.ts` (artworkSegments, parallaxEnabled config).

### Key decisions made in this pass

#### 1. Phase 0: architecture decision rule codified

The three execution models (Approach A dirty-flag, Approach B loop-suspend, Approach C throttle) were previously presented as equal alternatives. After reviewing coupling risks — specifically FrameBudgetMonitor's `sample()` contract and the smoothDamp convergence model — the correct hierarchy is:

- **Primary: Approach A** (dirty-flag + frame cooldown). Keeps rAF alive; `sample()` remains unconditional (as per the plan's own spec); smoothDamp convergence is always tracked. Lowest coupling risk.
- **Fallback: Approach C** (rAF throttle). One-day interim; no new infrastructure; ~92% GPU saving at idle.
- **Emergency/future: Approach B** (loop suspension). Eliminates rAF overhead entirely. Introduces FrameBudgetMonitor rolling-average stagnation issue: must include a reset/cool-down on loop-resume before shipping.

Code basis: `FrameBudgetMonitor.sample()` is called at every rAF tick unconditionally in the plan's Approach A code snippet ("keep timing stats accurate"). Approach B bypasses this entirely; the stagnation is confirmed by reading `FrameBudgetMonitor.ts` — the rolling sum is only updated on each `sample(now)` call.

#### 2. Phase 2.5 GPU ranges: preset-dependent qualifier confirmed

The `2.5–8 ms desktop` and `5–20 ms mobile TBDR` ranges are `high` preset estimates with 2 shadow-casting spotlights and bloom enabled (`bloomStrength = 0.04`, `bloomPass.enabled = true` because `0.04 > 0`). Confirmed from `PostProcessing.ts:36`: `this.bloomPass.enabled = preset.bloomStrength > 0` — so bloom IS enabled on high/balanced at current config.

Battery preset (shadows off, bloom off) runs ~1.0–3.5 ms on the same desktop. This confirms the ranges are state-dependent, not fixed hardware floors.

#### 3. GPU-1 TBDR shadow resolution benefit: code-confirmed path

`LightingSetup.ts:64` shows shadow is controlled by `preset.shadows` boolean, applied identically to all spotlights. Three.js default shadow map size is 1024×1024. The `high` preset has 2 spotlights with `castShadow = true`.

TBDR benefit analysis: reducing from 1024×1024 to 512×512 halves the tile memory needed for the depth buffer during shadow pass rendering. On TBDR architectures, if the depth buffer exceeds on-chip tile memory, the GPU must flush intermediate results to DRAM — the "tile memory spill" cost. At 1024×1024, this spill is likely on lower-end Apple GPU tiles (Apple GPU A15: 128-byte tile memory per pixel × ~32×32 tile = 512 KB on-chip). A 512×512 shadow map with 32-bit depth = 1 MB total; at 32×32 tiles this is 1024 tiles, each needing only 1/4 the depth memory vs 1024×1024. The disproportionate saving is real and not present on immediate-mode desktop GPUs.

Shadow resolution reduction (OPT-5 Approach B) should be the **first shadow change shipped** (lower visual risk than light-count reduction) and the **highest-priority GPU change for mobile targets**.

#### 4. New insight: OPT-9 LOD + parallax cost distribution coupling

Confirmed by `quality.ts`: `parallaxEnabled: true` and `artworkSegments: 180` are both set only on `high` preset. `balanced` and `battery` presets have `parallaxEnabled: false, artworkSegments: 120/48`.

This means OPT-9 (LOD vertex count reduction) — if implemented on high preset — will reduce vertex shader cost (65K→1.2K triangles) but will NOT reduce parallax fragment cost because parallax is driven by UV coords in the fragment shader. The LOD geometry swap must be paired with `uParallaxStrength = 0` at the same camera distance to eliminate the dominant GPU cost. Shipping Approach A alone (geometry swap only) delivers only the minor vertex processing savings; Approach C (uParallaxStrength fade) captures the major fragment savings.

#### 5. New insight: OPT-2 and OPT-9 geometry ownership conflict

Both `OPT-2` (aspect cache) and `OPT-9` (LOD swap) assign `artworkMesh.geometry`. If both are shipped independently, the LOD system may overwrite an aspect-cached geometry swap with a stale low-res plane, or vice versa. The combined architecture must treat the aspect-cached geometries as inputs to the LOD system (LOD chooses between hi-cached and lo-cached), not as parallel assignment paths. This coupling was not visible from examining either optimization in isolation.

#### 6. New insight: FrameBudgetMonitor + Approach B loop suspension

`FrameBudgetMonitor.ts` lines 85–95: `sample(now)` updates `this.rolling` and `this.ema` only when called. If `setAnimationLoop(null)` is used (Approach B), `sample()` is never called during sleep, and both values stagnate at pre-sleep levels. `readSnapshot()` (line 130) also calls `countAboveBudget()` and `countSevereFrames()` fresh on each call — but they operate on the same stale buffer. When the loop resumes after sleep, the first few active frames will see artificially stable (too-good) budget numbers because the rolling window is full of pre-sleep timings. The adaptive quality controller (currently locked) is not affected, but this will become a real issue if the lock is lifted.

Fix: on loop resume, call `markNavigation()` (or a new `markLoopResume()`) to activate a cooldown so the controller ignores the first N frames after wake.

### Research sources for this pass

- `src/utils/FrameBudgetMonitor.ts` — direct read for sample/snapshot/rolling contract
- `src/core/PostProcessing.ts:36` — `bloomPass.enabled = preset.bloomStrength > 0`; bloom IS enabled at 0.04
- `src/lighting/LightingSetup.ts:64` — `spot.castShadow = preset.shadows`; binary flag on all lights
- `src/config/quality.ts:157–271` — `artworkSegments: 180` and `parallaxEnabled: true` only on `high` preset
- `src/gallery/GalleryManager.ts:1566,1578` — `fovTan` computed locally in `getInspectionMinZoom()` and `getResetFitZoom()`, confirming CPU-2 duplication
- TBDR tile memory analysis: Apple GPU A-series on-chip memory capacity; PowerVR architecture documentation; Arm Mali Bifrost developer guide (shadow depth buffer tile flush characteristics)


---

## Performance audit findings — execution pass (2026-06-21)

Source: execution of `plan.md § v0.74` (Phase 15 Execution Record). Verified by
running the repo toolchain on a fresh clone.

### Verified results

1. **Regression tooling gap closed.** The plan's regression model (Type A pixel
   diff, Type B invariants, Type C GC/behavior) is now mapped to concrete tools
   and documented in `docs/REGRESSION_TOOLING.md`:
   - Type A: `scripts/visual-regression.mjs` (Playwright + pixelmatch, Phase
     10.3 threshold of < 2% pixels differing by > 10/255).
   - Type B: `src/utils/RuntimeInvariants.ts` (geometry ownership, triangle
     ceiling, material binding, shadow-caster count, scene consistency).
   - Type C: `src/utils/PerformanceMetrics.ts` (frame/FPS σ, P99, GC/min, GC
     pause P99, long tasks, heap) + `scripts/test-frame-budget.mjs`.
   Both runtime tools are exposed via `window.__FREYRAUM_PERF_TOOLS__`, passive
   and opt-in.

2. **`FrameBudgetMonitor` O(1) refactor is numerically identical.** The Type C
   equivalence gate (`npm run test:frame-budget`) confirms the incremental
   accumulator path matches the original O(N) linear-scan reference across a
   435-frame sequence (including budget-exact, severe-hitch, wrap-around, and
   >250 ms clamp edge cases) for all output fields. This satisfies the Phase
   12.3 Type C gate for OPT-3.

3. **Tier 1 zero-visual-risk optimizations shipped.** OPT-3/T1-B, OPT-1/T1-A
   (cached `tan(fov/2)`; `camera.fov` is never reassigned anywhere in `src/`),
   T1-C (debug routing), and OPT-7/T1-D (scratch `Vector2`). `npm run lint`,
   `npm run build:typecheck`, and `npm run build:preview` all pass.

4. **Visual-risk and idle-render optimizations were not shipped this pass.**
   Phase 0 (idle render suppression) and OPT-4/5/6/9 require an interactive
   browser session for their Type A / live-GPU / behavioral gates, which the CI
   sandbox cannot provide. Per the plan's safety rule they are recorded as
   deferred/rejected (Phase 15). The tooling above is the prerequisite that lets
   a follow-up execute and gate them with a real browser.

### Validation commands (all passing on this branch)

- `npm run lint`
- `npm run build:typecheck`
- `npm run build:preview`
- `npm run docs:check-config-authority`
- `npm run test:frame-budget`
