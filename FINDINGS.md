# FINDINGS
> Latest markdown audit: 2026-10-20 (photo-room screenshot follow-up).

## 2026-10-20 — Wohnbereich clipping reported again

- The user supplied a room-view screenshot at
  [this attachment](https://github.com/user-attachments/assets/a811e3d7-b277-4619-8e17-8815b01046fe).
  It visibly shows the upper part of the selected artwork cut off at the top of the
  viewport while the room selector is on Wohnbereich.
- The screenshot is one rendered artifact; it does not identify its commit, source
  JSON, generated bundle, browser zoom, or camera state. Do not assume it disproves
  or validates the current source calibration until those are matched.
- Reopen visual acceptance despite the passing geometry/browser bounds fixtures.
  Reproduce at the screenshot's 2000×1080 viewport with the matching room config,
  selected artwork, generated runtime, and camera state; then verify the entire
  projected frame and image remain within visible bounds.

## 2026-10-20 — Photo-room framing, cleanup, and image-quality follow-up

- An earlier 2000×1080 Wohnbereich screenshot showed the artwork's top clipped
  because its wall quad began at source y=0.075, above the visible area after
  centered `cover` cropping. On that viewport the current transform placed the
  artwork top about 269 px offscreen. Calibrate the wall quad to the visible wall
  at normalized y=0.23–0.62 and use a 0.72 wall-relative artwork height; keep the
  source aspect ratio and project through the shared visitor/editor geometry.
- Rebuild all four display derivatives from their unchanged source photos with
  expanded masks that include painting frames and their shadows. Blend only in
  an outer feather band; do not blend original painting pixels back into the
  removed region. Structural tests now measure full-color residue and cleanup
  boundary gradients for all four photos.
- Apply a restrained 10% native-size unsharp mask (0.65 px Gaussian radius) to
  the cleaned derivatives. The untouched source photos are 1896–2000 px wide;
  no higher-resolution originals exist in the repository. A tested 2× Lanczos +
  unsharp candidate had nearly identical desktop/phone display pixels (MAE
  0.08–0.48) while expanding each PNG from roughly 1.9–2.9 MB to 8.1–12.6 MB.
  It adds interpolated pixels, not real detail, so retain native dimensions to
  avoid extra download and decode/GPU cost.
- The bedroom's repaired center was smoother than a nearby untouched wall area.
  Add subtle, wall-matched microtexture and bound its measured Laplacian variance
  against the source wall sample, preventing both an overly smooth patch and
  excessive synthetic grain.
- Projection regressions check three artwork aspect ratios (portrait, 3:4, and
  square) at wide desktop, tablet, portrait-phone, and short-landscape sizes;
  browser coverage asserts the complete artwork bounds remain onscreen for every
  configured room. These checks establish geometry, not customer visual approval.
- Normal-size browser captures of all four rooms were reviewed, and the bedroom
  wall's fine texture was refined after that review. Fresh captures were generated
  after rebuilding; customer confirmation remains open because automated tests
  and local screenshots cannot establish an indistinguishable wall repair.

## 2026-10-19 — Four inspection photo rooms and cleanup follow-up

- The uploaded `Wohnbereich.png` and `Büro.png` are now additional photo-room
  sources; visitor/editor configuration remains in `museum-hub.json`, with the
  room names and photo asset paths kept together there.
- Preserve source images and display edited derivatives only. The new derivatives
  remove the colorful center-wall paintings; the existing Schlafzimmer and
  Wohnraum derivatives were regenerated from their untouched source photos after
  the earlier cleanup left visible patching.
- Keep cleanup safeguards image-based: verify artwork pixels are removed and
  compare cleanup-boundary gradients against the unchanged source photo. Passing
  these checks does not replace visual customer review at normal display size.
- Room import/staging, config sanitization, source-ratio projection and the
  responsive file-preview browser check must enumerate all four configured views;
  do not pin future checks to only the original two.
- Validation passed for the four-room config/cleanup/staging test, the root
  `file://` browser test at desktop/tablet/phone/short-landscape sizes, lint,
  typecheck, build, deploy-content validation, front-wall aspect, WebGL resilience,
  frame budget, and config-authority docs check. The separate museum-hub geometry
  test still fails at the known wall-left doorway-height expectation.

## 2026-10-19 — Shared gallery controls in the photo room

- Move the existing timeline DOM node into the photo-room overlay while it is
  visible, then restore it to its original parent. This keeps one selection
  model and allows gallery navigation and room artwork to stay synchronized.
- Reparent the existing help trigger and shared utility controls rather than
  creating parallel controls; select help instructions from the active view.
- Fixed-position timeline and zoom elements retain their shared gallery CSS.
  Verify the combined header, utilities, timeline, and zoom bounds at short
  landscape as well as portrait and desktop sizes.
- The room photograph and projected artwork continue to share only the
  established room-scene camera transform; moving controls does not alter
  projective registration.

## 2026-10-19 — Photographic inspection room view

- Keep the inspection room's audio, settings, and fullscreen widgets as the same
  shared controls used by the gallery; reparent them into the room overlay while
  visible so preferences and audio state are not duplicated.
- Photo pan range is bounded by camera scale and viewport coverage. Raising the
  maximum scale expands useful pan travel while retaining the rule that the photo
  fills the viewport; test both maximum scale and edge clamping.
- Museum-hub artwork buttons carry wall-vector shadow variables. Use a tight
  contact component plus restrained directional/ambient layers so projected art
  reads as attached to its wall rather than floating.
- A clipped museum-hub artwork button is not a reliable owner for an expanded
  drop-shadow. Render the shadow from the same projected quad in a pointer-inert
  SVG layer behind the button, preserving the button's registration and hit shape.
- Room-view wheel and button zoom should share the projectively mapped artwork
  center; pinch remains gesture-centered. Pointer reach can widen responsively
  while preserving the low tilt bound, reduced-motion behavior, and eased return.
- Help content must follow the active view: room-view guidance covers its own
  zoom, pan, reset, exit, and touch gestures rather than claiming gallery shortcuts.
- The previous short-landscape toolbar corner-placement logic was specific to
  the old standalone toolbar. The gallery-aligned header/timeline/zoom layout
  replaces that path, so regression checks should validate each new control
  group's viewport bounds and collisions.
- `npm run validate:museum-hub` currently stops at
  `scripts/test-museum-hub-geometry.mjs:411`: the left doorway-height invariant
  expects 2.30 m, but the current calibrated config does not satisfy that span.
  The obsolete timeline assertion at line 111 was corrected to check the actual
  selected-thumbnail active state; the remaining doorway failure is unrelated to
  photo-room presentation and needs geometry-owner review.

- Update Gallery is the customer-facing local import path; a production build's
  public-background sync is not part of that workflow. Stage each configured
  room photo into `customer-preview/backgrounds/`, the URL base used by the
  nested local preview, and report missing source files instead of leaving a
  silent blank scene.
- The fixed photograph and projected artwork must receive the same bounded
  camera transform. Keep the toolbar in screen space and prevent gestures on
  controls from panning the image. A single still photo supports pan/zoom, not
  real perspective changes; orbit/walking requires room geometry or additional
  viewpoints.
- Browser regression opens root `index.html` as `file://`, verifies all four staged
  photos render, and checks the photo-room header, shared timeline, zoom, and
  utilities stay in viewport at desktop, tablet, phone, and short-landscape sizes,
  plus drag, zoom, pinch, reset, keyboard, and focus return.
- The first living-room removal was a hard rectangle exactly along the artwork
  bounds. Avoid feather-blending from the source *inside* that bounds: it
  reintroduced colored artwork. Fade only in an outer band, interpolating from
  the cleaned edge to unmodified wall pixels beyond it; preserve originals and
  check the seam gradient plus the original-artwork removal mask.
- Camera zoom changes projected screen dimensions but not the artwork's authored
  image dimensions or wall placement. Apply pan/zoom once to the shared scene;
  calculating the artwork projection with that camera as well causes a double
  transform and visible parallax. Hover tilt and scale are deliberately minimal
  and presentation-only; reduced-motion settings disable the effect.
- Zoom buttons use the artwork center mapped through the wall homography as their
  anchor, animating scale and offset together; pointer wheel/pinch retain their
  own focus point. Camera bounds still prevent exposing blank edges, so centering
  is clamped to the valid photograph viewport. Mouse tilt uses a responsive
  proximity radius, low amplitude, and a CSS eased return.
- For cleanup boundaries, compare each dense adjacent-pixel gradient in the
  edited photo to the same source-photo gradient. This separates newly introduced
  cleanup discontinuities from naturally textured wall edges; retain separate
  masks that prove the old painting pixels are removed.
- The placement editor's photo-room preview calls the same geometry projection
  as the visitor view. Keep wall corners normalized and convex, constrain the
  artwork's normalized position/height, and serialize changes through the same
  calibration snapshots so undo/redo and save/export preserve the settings.
- The room photos contain their own dominant paintings. Initial guessed masks
  missed them, especially in `Wohnraum.png`; locate the actual central picture
  region from the source pixels before producing derivatives. Keep the supplied
  originals unchanged and assert the cleaned region remains free of saturated
  painting pixels.
- The room images have different source aspect ratios, so `object-fit: cover`
  must be paired with identical centered-cover math when projecting artwork.
  Use the configured normalized `wallQuad` and wall aspect to preserve artwork's
  natural ratio at desktop and portrait viewport sizes.
- Keep the inspection-room display separate from `MainMuseumHub`: its overlay
  follows the gallery's selected artwork, while editor export and shared save
  validation must preserve and validate the room-photo configuration.

## 2026-10-19 — Photo-room control consistency follow-up

- The room view now reparents the existing gallery timeline rather than
  maintaining previous/next controls and a second artwork selector. Returning to
  the gallery restores that same DOM node, its scroll/active state, and shared
  selection model.
- Use the same prominent back-action style for **Zurück zur Galerie** and the
  **Fotoraum** entry. The room selector is grouped with navigation, not with
  artwork selection; compact phones retain a visible short label.
- Reuse gallery zoom button classes/order and the existing shared help, audio,
  settings, and fullscreen widgets. Help content is selected from the active
  view; escape/focus regression covers modal return and room exit.
- Header/utilities and timeline/zoom collision checks now cover desktop, tablet,
  portrait phone, and short landscape. The zoom group moves above the timeline in
  short landscape; utility groups move below the stacked phone header.
- The UI-only restructuring leaves projective placement and the single
  photo-scene pan/zoom transform unchanged. Browser regression verifies shared
  selection, photo decode/display, room switching, projection registration,
  keyboard/focus behavior and camera gestures.
- Validation after fixing the stale timeline assertion still reports the
  independent doorway-height failure at `scripts/test-museum-hub-geometry.mjs:411`.

## 2026-10-19 — Follow-up: tilted-artwork flicker persists

- The earlier polygon-offset change was incomplete: it biases the painted plane,
  but the backing body's opaque material still writes depth only 0.002 units
  behind it. As the mounted artwork rotates, that nearly coplanar depth pair can
  still contend on limited-precision depth buffers.
- Disable depth writes on the backing material while keeping depth testing and
  `castShadow` enabled. The image plane remains the visible depth-writing surface;
  the backing body still renders its sides and continues to cast the intended
  wall shadow.
- The imported default is `matte-print`, with no procedural normal/height/
  specular maps, so this correction targets the remaining geometry depth overlap,
  not canvas shading or the artwork's source pixels.
- `scripts/test-webgl-resilience.mjs` now guards the image-plane polygon offset,
  the backing material's `depthWrite: false`, and the body's `castShadow: true`.
  Keep all three checks together: removing depth writes fixes the competing
  fragments, while preserving the shadow flag protects the intentional wall shadow.
- The rebuilt gallery loaded in Chromium, processed hover tilts, and retained its
  WebGL context. The customer confirmed the visual artifact is resolved on the
  target display (2026-10-19).

## 2026-10-19 — Selected timeline marker and tilted-image flicker

- The thin line across the timeline was a collection-progress indicator, not the
  artwork selection state. The current artwork already receives `is-active` and
  accessible `aria-current`/`aria-pressed` state; remove the global line and use
  that per-card state for a single underline while retaining the spoken counter.
- The imported tree artwork has no interactive presentation override, so it uses
  the `matte-print` profile: no procedural normal, detail, height, or specular maps.
  The earlier normal-map/specular hypothesis therefore did not explain this report.
- The image plane is drawn only 0.002 units ahead of its backing body. With depth
  testing enabled on both surfaces, limited depth precision can let their fragments
  alternate as a tilted plane moves. Apply a small negative polygon offset to the
  artwork material so it consistently wins depth testing; keep the body as the
  wall-shadow caster. This preserves the original albedo and tilt behavior.
- Chromium verification: only the selected card has an underline and accessible
  current/pressed state; the counter remains intact. At 320/390px the track scrolls
  with arrows, at 1280px four works fit and arrows hide, and a simulated 16-item
  track overflows with arrows. The marker transition is 1µs in reduced-motion mode.
- Captured the imported tree artwork at two tilts in high quality and in balanced
  quality after the change; no page exceptions or WebGL errors occurred. The browser
  reported an unresolved-host warning and a favicon 404 in this environment.

## 2026-10-18 — User follow-up: timeline and tilted-artwork clipping

- The prior adjustment did not resolve either issue for the user. The timeline
  remained an intrinsic-width strip with fixed-size thumbnails, so it did not
  visually use the gallery row. The replacement uses a full-width capped dock,
  evenly distributes fitting thumbnails, and exposes scroll arrows only when
  the track overflows; cards now show both title and subtitle with progress.
- Tilted artwork can cross the camera's near plane during close inspection or
  navigation while the camera is still zoomed in. Use a tighter near plane and
  solve the entrance pose against both the front wall and camera; at normal
  viewing distance the original entrance tilt/depth remain unchanged. The body
  mesh remains the shadow caster.
- Regression coverage checks the depth range at close zoom, preserves the normal
  entrance pose, and exercises both wall and camera clearance throughout the
  transition. Customer confirmation on the actual display remains necessary.
- Production/local builds, lint and typecheck pass. Chromium verified fit states
  for 1–4 artworks at 320/390/500/900/1600px, 12-item overflow arrows, arrow
  scrolling, keyboard focus, selection/progress and reduced-motion transitions.
  The geometry suite reaches its previously recorded unrelated 2.30m doorway
  assertion only after these new pose checks pass.

## 2026-10-18 — Artwork entrance and timeline sizing

- Gallery navigation seeds the artwork group on the camera side of the negative-z
  front wall, then eases its depth back to the mounted origin. Keep this depth
  independent from the body mesh that casts the wall shadow; the photograph-backed
  museum hub is a separate presentation.
- The timeline can shrink-wrap smaller collections by using intrinsic list width;
  once the whole list cannot fit after reclaiming arrow space, its existing
  scrolling and arrow controls remain active. Chromium measurements cover desktop
  counts 1–4 and 12, plus a 320px emulated phone viewport.
- Validation note: `npm run validate:museum-hub` still reaches an existing
  doorway-height invariant that expects 2.30m, while current calibrated config
  converts the left/right doorway spans to approximately 2.692m / 2.486m. This is
  unrelated to the gallery entrance/timeline change and remains unmodified.

## 2026-10-18 — Deployed museum photograph regression report

- Customer reports that the latest deployment shows a plain white museum
  background. The customer's specific browser artifact is unknown, so the exact
  visual root cause remains unverified. Latest Pages run #21
  (`c3b8e2468e0849b1bfe72f87c880ac46f2794483`) deployed successfully, but its
  live smoke job exited before opening a browser because the fresh smoke-job
  checkout lacked generated/ignored `artworks.json`.
- Current source config selects `Backgrounds/Museum_ohne_Bilder.png`, and
  `sync-customer-public.mjs` copies all allowed backgrounds. The earlier Pages
  check's omission of that filename did not itself remove the image and does not
  establish why it was not visible. The artifact gate and live smoke now derive
  expected background paths from `museum-hub.json`, so a future configured
  background is checked without pinning deployment to this filename. The smoke
  job now runs the importer before using its generated manifest.
- Track the next deployment and live smoke as open acceptance in `plan.md`.

## 2026-10-18 — Merge audit and customer-confirmed local room

- Customer: “then I used the update galery .bat and then it worked.” Their
  [supplied screenshot](https://github.com/user-attachments/assets/42d41643-45ca-4140-ba0c-5773ffc5e1aa)
  shows all four intended paintings. Record this as local success after import,
  not as verification of a live deployed commit (no build identity supplied).
- All 36 tracked Markdown files outside `.github/agents` were inventoried.
  Current docs and prompts were reviewed; seven dated archive snapshots remain
  immutable with their index checked. Corrected stale two-image/content-blocker
  claims in README, architecture map, customer guide, handoff and regression docs.
  Query authority, desktop/save-service docs and unchanged prompts remain valid.
- Reinstalled dependencies after the fresh environment's `eslint: not found`.
  Lint/typecheck/full build, geometry, source/generated-layout equality, WebGL
  resilience, frame-budget, docs authority, save-service (15), local-project (12),
  deploy-validator (10), and actual four-image deploy validation pass.
  `npm audit --omit=dev` reports zero vulnerabilities; initial full install reports
  17 existing development-tool advisories. No dependency upgrade was made.
- Production output served at `/Freyraum/app.html` passes exact photograph,
  all four paintings' visible screenshot contribution and editor projection
  parity. Root `file://` smoke also passes. Earlier nested HTTP root-index smoke
  remains recorded below. These are built-artifact tests, not live-site claims.
- Editor rooms passes. A concurrently running publish check timed out waiting
  for the initial enabled Start button; after isolating browser runs it passes
  all login/upload/placement/publish assertions with no page errors. No runtime
  or test timeout change was needed; concurrency is a suspected contributor,
  not an established root cause.
- Isolated editor drag subsequently passes all four edges for each of the four
  paintings and valid export. Desktop installers and the complete visual harness
  were not rerun in this pass; they remain separate CI/deferred gates.
- Actions inspection: desktop run 39156014733 is `action_required`, not passed.
  Latest observed main Pages run 39115237783 failed before build on unknown
  `gartenszene`/`zdigital` IDs (logs retrieved); it imported only two paintings.
  Current branch corrects those inputs and deploy validation passes. A new
  post-merge deployment/live smoke is required; retrying the old commit would
  not test this fix. No open PR was returned by the API during the audit.
- Next-agent entry: `docs/HANDOFF.md`. Deferred work and owner gates: `plan.md`.
  Earlier two-image failures below are historical evidence, not current blockers.
- Deployment review caught a coupled regression: `prebuild` repeats sync during
  the Build step, but the save-service repository variable was scoped only to
  the earlier import step. Pass `FREYRAUM_SAVE_SERVICE_URL` into Build too so
  regenerated `editor-online.json` retains online publishing configuration.
  A build with a non-secret example HTTPS endpoint confirms that public, dist
  and preview settings all preserve it; test-only generated metadata is discarded.
- Merge-audit final validation: secret scan passes; CodeQL reports zero Actions
  and JavaScript alerts. Automated code review is unavailable (missing model);
  a separate read-only review finds no significant issues. This does not waive
  pending owner approval, new Pages deployment/live smoke or deferred visual work.

## 2026-10-18 — Root-index freshness follow-up

- The customer's stale-index report reopens acceptance; earlier direct-app passes
  did not identify their actual artifact. No claim is made about their browser cache.
- Verified build-input risk: `npm run build` previously omitted the importer,
  while injected `__FREYRAUM_MUSEUM_HUB` overrides the compiled JSON fallback.
  A stale generated file therefore wins even after rebuilding the runtime.
  The build now imports and syncs current customer data first, without overriding
  deliberately edited customer layouts.
- Root-index HTTP smoke reproduced another concrete failure: the local bundle's
  default absolute `/` base requested backgrounds and `editor-online.json` at
  the server root instead of under `customer-preview/`. Local Vite output now
  uses `./`; the production `/Freyraum/` base is unchanged.
- Preview runtime/style URLs were unversioned. Both the importer and HTML writer
  now stamp them along with customer data; the root launcher refreshes the preview
  document while preserving query parameters and fragment.
- Generated artwork data is ignored by Git. A fresh checkout/download still needs
  Update Gallery before a double-click preview; the launcher and missing-asset
  message now explain that requirement instead of silently implying source edits
  update generated assets. Exact inputs: `Gatrenszene.png`, `Akt 27.png`,
  `Fraktal.png`, `Wunderbaum.png`.
- Final rebuild passes lint/typecheck, source/generated-layout equality,
  root-index HTTP and `file://` smoke (all four decoded images contribute pixels,
  exact photograph, editor geometry parity). Geometry, save-service (15),
  local-project (12), deploy-validator (10), deploy content, docs authority and
  frame-budget checks also pass. File-fetch probes still warn on `file://`,
  where embedded artwork is verified visible. Existing dependency advisories,
  large artwork/bundle and classic-script warnings are unchanged.
- Root-index screenshot captured at `/tmp/freyraum-root-index-room.png`.
  Image inspection remains unavailable in this session; reference-image aesthetic
  approval is not inferred from automated visibility checks.
- Final secret scan passes and CodeQL reports zero alerts. The automated review
  service is unavailable (missing model); a separate read-only reviewer finds
  no significant issues in the root-index follow-up.

## 2026-10-18 — Reference exhibition with supplied artwork

- The inbox now contains all four genuine paintings. The garden image is named
  `Gatrenszene.png`, so the importer generates `gatrenszene`, not `gartenszene`.
  Preserve that source ID and supply the display title through `Gatrenszene.txt`.
  `Wunderbaum.png` resolves to `wunderbaum`; the old `zdigital` mapping is retired.
- The reference arrangement is front-left Gartenszene (1.62 m), front-right
  Akt 27 (unchanged 1.48 m), left Fraktal (3.6 m) and right Wunderbaum (3.1 m).
  Side-wall perspective requires larger physical heights than the front pair.
  All four pass the shared mounting-zone and doorway checks; narrow projected
  side edges remain advisory, not a reason to stretch the sources.
- Geometry tests initially failed because they pinned the previous exhibition
  and reused its assignments in migration/swap fixtures. Preserve those synthetic
  migration cases separately and validate current production content explicitly.
  Save-service fake repository inventory must also include every newly mapped ID.
- Built `file://` smoke proves visible screenshot pixel contribution for all four
  paintings and exact editor/museum homography parity. Save-service (15), local
  project (12), deploy-validator (10), geometry, front-wall aspect, lint,
  typecheck/build, docs authority, frame-budget and editor rooms pass.
- HTTP smoke also passes all four paintings and exact editor parity. Publishing
  passes after its upload fixture explicitly frees a place in the now-full room
  rather than assuming missing artwork creates an empty place.
- Editor drag passes every edge for all four paintings and exports valid
  placements. Secret scanning passes. The automated review service was unavailable;
  an independent read-only reviewer found no significant issues. CodeQL skipped
  these content/test-only changes as trivial.
- Dependency installation reports existing tooling advisories; no dependency
  upgrades are part of this content change. Fraktal remains a 24.8 MB source;
  the importer warns about large dimensions and device memory. Vite retains
  classic-script and large-bundle warnings. These are separate from layout checks.
- A room screenshot was captured at `/tmp/freyraum-curated-room.png`; image
  inspection was unavailable in this session, so exact visual/customer approval
  is not claimed. Automated visibility and geometry checks are not visual approval.

## 2026-10-18 — Earlier museum presentation baseline and recovery history

The following records the initial two-image state and intermediate checks.
Missing-content blockers were subsequently resolved; see the merge audit above.

- **Implemented and checked by the implementation pass:** `MainMuseumHub`
  always uses `.is-photographic`, keeps its renderer field null and constructs
  no `HubRoomRenderer` or hub canvas. The photograph and DOM artworks have
  opacity 1 in museum and editor; inspection-gallery WebGL is unchanged.
  `main.ts` uses the checked-in museum JSON when injected/legacy config is absent.
- **Correction validation:** built-preview capture at `/tmp/freyraum-after`
  confirms the exact requested photograph and decoded `Fraktal` / `Akt 27` in
  both routes, with no allocated hub canvas. Lint, typecheck, build,
  frame-budget and documentation-authority checks pass; `test:editor-rooms`
  passes all browser cases. These checks do not supply the missing side images.
- **Content-blocked checks:** real `validate:deploy`, four save-service cases and
  the local-project test fail on the shipping missing IDs. `test:editor-publish`
  cannot click the disabled empty side place (`invalid-mapping`).
- **Regression follow-up:** geometry passes after adapting closed-outline/
  legacy-wall expectations and separating production missing mappings from
  complete fixtures. HTTP photographic smoke passes exact-photo, artwork pixel
  contribution and editor-homography parity checks; external Google Fonts DNS
  failures are warnings. Visual capture is still blocked under software Chrome
  by the pre-existing invariant `shadow-casting light count 1 != expected 2`;
  investigation is ongoing, so no successful Type A capture is claimed.
- **Latest targeted results:** HTTP and `file://` deployment smoke pass exact
  background, real artwork pixel deltas, both front images and editor/museum
  projection parity. Geometry, WebGL resilience, the 10 deploy-validator fixture
  cases and syntax checks pass. These fixture passes do not override the real
  shipping-content validation failures above.
- **Transparent-primary recovery implemented; browser assertions verified:**
  the failing blank-primary fixture exposed that DOM decode alone accepted
  invisible artwork. Recovery now uses a conservative alpha check under the
  existing verbose/local-file probe policy: a 4×4 sample accepts nonzero alpha
  immediately; an empty sample triggers native-resolution scanning in tiles of
  at most 128×128 pixels, within a 4,194,304-source-pixel budget (4 MP). Only proven
  all-zero alpha rejects the source (`zero-alpha-source`) and retries fallback.
  Over-budget or unavailable/tainted readback is inconclusive and accepted, so
  sparse valid strokes are not rejected. GPU evidence stays null for DOM.
  Transparent/black/white/faint-alpha, unavailable/tainted readback and sparse
  final-native-pixel method checks pass, as do lint/typecheck/build and the
  front-wall-aspect check.
  The final 4 MP rebuild also passes actual 1200×1600 blank rejection,
  same-size sparse final-pixel alpha-1 acceptance and over-4-MP inconclusive
  acceptance method checks; lint/typecheck/build pass again.
  Post-rebuild `file://` and HTTP blank-primary captures pass the recovery/source
  assertions and produce screenshots: `zero-alpha-source` leads to embedded
  fallback, `presentationPath` is `dom`, decoded fallback dimensions are 600×800,
  and upload dimensions/render maximum/visible probe remain null. The file
  capture command still exits 1 solely for the pre-existing shadow-light-count
  invariant; this is browser recovery proof, not a full visual-suite pass.
  The final rebuilt fixture rejects a transparent 256×256 square before committing
  its ratio, then displays the opaque 600×800 portrait fallback with correct DOM
  dimensions. Geometry method tests also pass black/white acceptance,
  `SecurityError` inconclusive acceptance and different-aspect fallback commit.
  Ordinary primary/fallback,
  neutral, phone and shape/doorway captures work after stale fixture repairs,
  but the full visual suite does not pass. The shadow invariant and software-
  Chrome selection/focus/restore diagnostics remain unresolved investigations.
- **Final review limits:** final parallel validation was attempted after commit
  but reached its tool time limit; it was not retried. Earlier CodeQL reported
  zero findings; the automated reviewer was unavailable. A focused reviewer
  identified the sparse-alpha false-rejection risk, addressed by the conservative
  native-alpha refinement above. This is not a full visual-suite pass.
- **Dependency status:** installation reported 17 initial advisory findings;
  `npm audit --omit=dev` reports zero. No dependency manifests changed.
- **Diagnostic contract:** the shared source-to-pixel outcome has optional
  `presentationPath: 'dom' | 'webgl'`. The hub records `'dom'`, native decoded
  source dimensions and null GPU/probe fields, explicitly describing decode for
  calibrated DOM presentation without WebGL upload. This is not GPU pixel proof;
  source redaction and interactive-gallery diagnostics remain unchanged.
- **Baseline reproduced in `file://` (implementation pass):** the importer has
  only `Akt 27.png` and `Fraktal.png`. Side-slot IDs `gartenszene` and `zdigital`
  exist in neither the customer inventory nor built-ins; resolution reports
  `invalid-mapping` and suppresses those slots, leaving empty editor places.
  No genuine matching side images are in the repository. Preserve the authored
  JSON IDs without substitutes; the owner must supply the missing files.
  Four genuine paintings cannot be accepted until that content is available.
- **Baseline renderer failure:** hub renderer initialization throws
  `Cannot read properties of undefined (reading 'onBeforeCompile')`.
  `ArchitecturalSurfaceFactory` is a suspected location, not a verified root
  cause. The approved photo presentation avoids initializing the opaque room
  renderer rather than repairing unused 3D architecture.
- Baseline screenshots and JSON evidence were reported at
  `/tmp/freyraum-before`; that capture does not prove the correction passes.
  These findings establish a current local baseline, not reproduction of the
  unavailable original customer artifact.
- **Verified structural cause, not an artifact reproduction:** the normal hub
  presented an independent opaque WebGL architectural room, while the editor
  used calibrated DOM artwork over a photograph. These were different visible
  authorities; passing wall/placement math did not prove equivalent pixels.
  The exact customer screenshot-producing bundle/config is unavailable.
- **Approved correction:** museum and editor use the same photograph-backed
  calibrated DOM artwork projection. No opaque WebGL room may cover that plate.
  Keep the Three.js inspection gallery, diagnostics, context-loss recovery and
  bounded source fallbacks; do not label DOM image success as GPU pixel proof.
- **Asset diagnosis corrected:** the tracked
  `customer-artworks/Backgrounds/Museum_ohne_Bilder.png` exists. The audited JSON
  requested `Backgrounds/museum-ohne-bilder.png`; case and separators both differ.
  Reference the actual asset and preserve its calibration rather than inventing
  a replacement background or claiming that it is absent.
- **Current editor contracts:** wall quads are editable with calibration-scale
  compensation; only errors block save/export, not layout hints or unconfirmed
  green zones. Room counts and artwork assignments may change on import;
  unreadable JSON and incompatible fixed camera/3D room/wall models still fail.
- Reviewed all repository Markdown outside dependencies and `.github/agents`;
  archives were reviewed as history and left unchanged. Current architecture,
  query, customer, support, regression and agent rules supersede older restrictive
  editor claims. No tests, lint, build or browser validation were run in this
  documentation portion; the implementation pass separately reproduced the
  baseline and correction checks above. Remaining validation and customer
  acceptance are tracked in `plan.md`.

## 2026-10-17 — Windows installer builds in CI (v1.40)

- The agent sandbox cannot deliver an installer (no file attachments/releases/tags, ~100 MB files, Linux only), so GitHub Actions Windows runners build it and the run artifact is the delivery channel.
- The working branch had **no pull request**, so `pull_request` triggers never fired; a `push` trigger on `copilot/**` branches (with the app paths filter) starts the build from agent pushes. Agent-triggered runs may need owner approval.
- On Windows, `rename` over a file can fail briefly with EPERM/EACCES/EBUSY while antivirus or Explorer holds it; a short synchronous retry (50–800 ms, `Atomics.wait`) is the usual remedy (same idea as graceful-fs) before the existing rollback.
- Tests must build expected paths with `path.resolve/join` like the app; hard-coded `/` paths fail on Windows.
- electron-builder NSIS: `installerLanguages` + `language: "1031"` gives a German installer; `/S` installs/uninstalls silently and `/D=` (last argument, unquoted) sets the folder — used for the CI install/uninstall check. Silent installs do not auto-start the app.
- Playwright `_electron.launch` works on packaged executables (Linux `linux-unpacked`), so the same smoke script covers the packaged Windows app.
- Merge-readiness review: `PendingUploads.clear()` after a successful save revoked the object URLs that `MainMuseumHub` still used for the uploaded artwork images and the pending background, so the editor (kept open while waiting for approval, or after a failed gallery update) showed broken images. `markPublished()` keeps them until reload.
- Node.js 20 reached end of life on 2026-04-30; all workflows now use Node 22 (the version already used by the desktop workflow and local validation).
- The branch already contained `main` (0 commits behind) at merge-readiness time; no merge was needed.
- Sources: https://nodejs.org/en/about/previous-releases, https://www.electron.build/nsis, https://www.electron.build/configuration/nsis, https://docs.github.com/actions/using-workflows/storing-workflow-data-as-artifacts, https://playwright.dev/docs/api/class-electron

## 2026-10-17 — Desktop app for local editing (v1.39)

- **Why Electron.** It ships the same Chromium on every computer (reliable
  WebGL for the three.js editor) and its own Node, so the existing importer runs
  unchanged with `ELECTRON_RUN_AS_NODE=1` and customers need no Node.js.
  Playwright can drive it (`_electron`). Costs: ~100–150 MB installers, unsigned
  builds show a one-time SmartScreen/Gatekeeper warning.
  - *Tauri* (~10 MB) uses the system web view (WKWebView/WebKitGTK WebGL
    differences) and would need a separate Node runtime or a Rust rewrite of the
    importer plus the Rust toolchain.
  - *Browser folder access* (File System Access API) works only in
    Chrome/Edge and cannot run "Update Gallery".
  Sources: <https://www.electronjs.org/docs/latest/tutorial/security>,
  <https://www.electronjs.org/docs/latest/api/protocol#protocolhandlescheme-handler>,
  <https://www.electronjs.org/docs/latest/api/environment-variables#electron_run_as_node>,
  <https://playwright.dev/docs/api/class-electron>.
- **Custom protocol instead of `file://`.** `freyraum://app/` (registered as
  standard + secure) gives the editor a real origin (IndexedDB drafts, fetch,
  CSP) and lets the main process decide exactly which project files are
  readable. The generated `customer-preview/*.html` pages use an inline script,
  so the app build writes its own pages without inline scripts to keep
  `script-src 'self'`.
- **Importer location.** The import scripts found the project relative to the
  script file; inside the packaged app that is the app's resources folder. They
  now accept `--root <folder>`; the app ships `import-artworks.mjs` outside the
  asar archive (`extraResources`) so a plain Node process can read it.
- **Lesson: Playwright and refused navigation.** Calling
  `location.href = …` on a guarded window leaves Playwright waiting for a
  navigation that never finishes; later `page.click` calls time out. The test
  checks the navigation guard last and reads the URL from the main process.
  Opening `https://` links in the test would also launch the system browser, so
  the test uses `file://` URLs for the refusal checks.
- **Audit.** `npm audit` in `desktop/` reports 8 moderate findings, all from
  `sprintf-js` via `global-agent` → `@electron/get` (electron-builder). Build
  machine only; no fix without downgrading. electron 44.9.0, electron-builder
  26.15.3, esbuild 0.28.2, typescript 5.9.3 and @types/node 22.20.5 had no
  advisories in the GitHub advisory database when pinned.
- **Packaged smoke check.** `electron-builder --linux dir` built an app whose
  packaged importer (`resources/importer/`) generated the preview for a fresh
  project folder and opened the editor at `freyraum://app/`.

## 2026-10-16 — Online saving from the deployed editor (v1.38)

- **Pages cannot save.** GitHub Pages only serves files, so a small service with
  its own GitHub credentials is required. A GitHub App limited to Contents + Pull
  requests on this one repository keeps the key off the browser
  (<https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/authenticating-as-a-github-app-installation>).
  One commit per publish uses the Git Data API (blobs → tree → commit → ref)
  (<https://docs.github.com/en/rest/git>).
- **Token instead of cookie.** The service runs on a different site than Pages;
  third-party cookies are increasingly blocked, so the editor sends a bearer
  token kept in `sessionStorage`.
- **Locked-field deviation.** The editor import's `hubFixedFieldsSignature`
  includes background and walls, which would block background uploads. The
  service therefore uses `hubPublishLockedSignature` (version, coverage, stage,
  visual tokens, camera, room, hanging rules, page size, wall ids/roles).
  Changed 3D wall corners are still blocked by the editor's own error.
- **Lesson: unbound `fetch`.** Storing `window.fetch` as a class field and
  calling `this.fetchImpl()` throws "Illegal invocation" in Chrome; the client
  wraps it in an arrow function. The browser test caught it.
- **Lesson: shared CSS hooks.** Reusing `museum-hub__save-primary` /
  `museum-hub__publish-pending` for new buttons and lists broke strict test
  selectors; new online elements use their own classes.
- **Customer content state (corrected 2026-10-18).** The photograph
  `Backgrounds/Museum_ohne_Bilder.png` is tracked; the JSON requested
  `Backgrounds/museum-ohne-bilder.png`. This is a filename-reference mismatch,
  not a missing source asset. See the current presentation finding above.
  `inbox/Fraktal.png` is 24.8 MB (warning above 20 MB; online uploads are
  limited to 15 MB after downscaling).
- **Pages cache.** Pages serves files with a ~10 min cache; after "Online ✓"
  the editor re-fetches the state files with `cache: 'reload'` before reloading.

## 2026-10-15 — Editor rooms and panel (v1.35)

- **Lesson: invisible automatic rooms caused unfixable validation failures.**
  Rooms 2 and 3 were created by the loader for artworks without a place, used
  the old 2.32 m overflow height (outside the calibrated front-wall green
  area), could not be reached in the editor, and could not be changed through
  import. The customer saw errors they had no control to fix. Rooms are now
  explicit data (`rooms`), switchable and editable in the editor, and automatic
  rooms are opt-in (`fallbacks.autoPlaceUnmapped`).
- **Lesson: hints must not block saving.** Export used to stop on layout
  hints such as an unconfirmed green area or a small artwork, so a valid scene
  could not be saved. Only errors that make the file unreadable or the geometry
  broken block export now.
- **Old files.** Files without a room list default to automatic extra rooms,
  so existing deployments render exactly as before; the editor writes the room
  list and `autoPlaceUnmapped: false`.
- **Slot reconciliation.** Room edits go through the same snapshot path as
  undo/redo/import: the snapshot is resolved in editor mode and only changed
  places are rebuilt; the 3D scene redraws once afterwards.
- **Browser tests.** The "Bild ersetzen" and "Datei öffnen" inputs share the
  hidden file-input class; tests must target the Speichern tab's input
  (`#museum-hub-editor-panel-save .museum-hub__file-input`). Empty rooms show a
  "Raum löschen" confirm button instead of "Bilder nicht platzieren".

## 2026-10-14 — Editor geometry authority (v1.34)

- **Shared projection.** Load-time validation used solver-relocated `room`
  projections while the editor used `room-fixed`, so the same JSON could be
  valid in one place and invalid (or moved) in another. The config layer now
  owns `projectDisplayedPlacement`/`evaluateDisplayedPlacement`; the 3D mounting
  frame matches the displayed world quad exactly and its camera projection
  stays within ~2.2 px of the editor's calibration-quad drawing (tested).
- **Wall-height decision.** Calibration rescales walls by width only, so the
  measured heights (front ≈ 2.61 m, right ≈ 5.62 m, left ≈ 6.09 m) differ from
  the nominal 5.2 m. Scaling height separately would make the 3D wall frame
  disagree with the photographed wall and distort physical artwork aspect, so
  the calibrated heights are accepted as authoritative. Consequence: the shipped
  front works at 2.32 m centre height were partly above the wall/green zone;
  valid centre heights on the calibrated front wall are ~0.90–1.70 m, and 1.30 m
  is used. The built-in (uncalibrated) defaults keep 2.32 m.
- **Drag lessons.** Axis-only sliding still stuck on sloped zone edges (front
  artwork could not move left along the slightly skewed bottom edge); the solver
  now also tries rotated directions. Side walls have an on-screen vanishing
  line: pointer positions past it inverted the mapped direction, so the pointer
  is pulled back to just before that line. The browser test found an overlap
  case (front works could be dragged over each other); other artworks in the
  room are now obstacles unless the artwork already overlaps one.
- **Overview handles.** Wall-point drags used window listeners but no
  `lostpointercapture`, and recorded undo history before abort checks.
- **Browser test.** `scripts/test-editor-drag.mjs` must click the loader's
  start button and test only the active room; it uses Shift+arrow (10 cm) to
  prove the artwork stopped at the limit because `horizontalPosition` is
  exported with 0.001 (≈1 cm) precision.
- References for the interaction decisions (could not be fetched in the agent
  sandbox; recorded for maintainers): pointer capture loss
  https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event,
  primary pointers https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary,
  WCAG 2.5.7 Dragging Movements (single-pointer/keyboard alternative)
  https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html.

## 2026-10-14 — Glitchy side-wall artwork drag (v1.33)

Root causes found in `MainMuseumHub` / `projectiveGeometry`:

1. The overlay used `projectSlotArtwork(..., 'room-fixed')`, whose solver
   silently moved the anchor into the hanging band (top ≈ 3.9 m of a 6.1 m
   left wall), while the stored anchor and the WebGL mesh kept the requested
   position. The artwork visually stalled below the top of the green zone.
2. The drag clamp validated with default `'room'` mode, which on the shipped
   side walls fell back to a wall-normalized quad of a different size, so
   accepted/rejected positions did not match what was drawn.
3. Invalid moves were bisected toward the mounting-zone centroid, pulling the
   artwork sideways/down instead of sliding along the blocked edge.
4. No grab offset (centre jumped to the pointer), stale load-time inverse
   homography after wall edits, last move dropped on `pointerup`, and any
   mouse button started a drag.

Decision: one displayed projection is authoritative for drawing, clamping, and
warnings; the green mounting zone and doorways are the editor's hard limits.
Runtime fitting keeps the relocating solver by default.

Sources (drag best practice — pointer capture, grab offset, rAF throttling,
`pointercancel`/`lostpointercapture`, primary-button filtering):
- https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture
- https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
- https://www.w3.org/TR/pointerevents3/
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/drag.md

## 2026-10-14 — Physical artwork size versus wall calibration

1. Normalized source-wall-to-target-wall height conversion made artwork size
   depend on the destination wall dimensions. Transfer now carries the
   canonical physical height unchanged.
2. Fixed-height placements must not enter the legacy shrink ladder. The solver
   may reposition a valid-size artwork, but an artwork that cannot fit retains
   its physical dimensions and is rejected or warned instead of being silently
   resized.
3. WebGL mounting continues to derive width from physical height and the
   decoded native aspect; perspective is applied only by the wall frame and
   camera projection.
4. The editor's calibrated projection previously used normalized wall height
   for its fallback artwork quad. Fixed-size editor projection now uses the
   same physical mounting frame as WebGL, while projected bounds remain
   interaction metadata.
5. Wall-corner dragging mutates the resolved wall's stage-space `quad` only;
   it does not mutate the authored room-space `origin`/axes. The editor must
   therefore use that current quad for DOM projection, while retaining the
   room-space mounting frame as the physical geometry authority. Otherwise
   artwork dimensions remain correct but the artwork appears disconnected from
   the edited wall.

## 2026-10-12 — Main museum versus editor authority

- The supplied target is the main museum presentation, not the placement editor.
- Customer artwork bundles can contain only the currently authored works. The
  museum resolver therefore receives a merged curated inventory so its four-work
  2+1+1 composition remains populated, while the customer gallery timeline stays
  customer-only.
- Presentation mode hides selection borders and labels; the editor retains them
  for calibration and interaction.

## Ratio-safe replacement findings (v1.30, 2026-10-10)

1. A temporary upload must be decoded and confirmed before it mutates the
   selected slot; failed or cancelled replacements must preserve the prior
   valid source.
2. Screen-space projected bounds are interaction geometry, not artwork pixels.
   The editor therefore clips its selection outline to the projected quad and
   reports the native source rectangle separately.
3. Native dimensions and source-rectangle dimensions now share a pure ratio
   contract so DOM and renderer callers cannot silently invent an independent
   artwork width.

## Deterministic editor preview findings (v1.29, 2026-10-10)

1. Wall selection must not invoke camera framing: the projected calibration
   quad is the authoritative editable wall, while framing is an explicit
   viewport action.
2. Calibration must have one visible artwork pixel owner. Hiding WebGL pixels
   prevents a valid DOM homography from being visually contradicted by a
   second renderer.
3. Temporary uploads are decoded before use and retain native dimensions and
   ratio; they are preview replacements, not silently exported customer assets.

## Older findings

Findings up to v1.18 (2026-09-05) are archived in
`docs/archive/findings-history-2026-10-17.md`; earlier ones in
`docs/archive/findings-history-2026-06-21.md`.
