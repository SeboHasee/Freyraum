# FREYRAUM plan history — v1.45 handoff and v1.46 round (2026-10-22)
> Archived 2026-10-22 when PR #27 was made merge-ready. Immutable; the open
> items were carried into `plan.md` → "Next development round".

## Next development round (v1.46, 2026-10-22)

Order: A → B1–B3 → C1–C2 → D1 → C3–C6 → B4, D2–D5 → E → F → G.

- [ ] A Owner gates: approve CI on PR #27 and merge; live `/Freyraum/` check
      (`docs/DEPLOYMENT.md`); real-phone and real-GPU desktop pass.
- [x] B1 Deployed manifest without embedded image bytes (70.8 MB → 19 KB);
      `validate:deploy` budget (2 MiB, no `webglImage`/`data:image/`).
- [x] B2 WebP size variants (640/1280/2048/≤4096) built by
      `scripts/build-web-images.mjs` during `import:artworks` sync; one
      display size per device (phones/≤4 GB: 2048) and the smallest for
      timeline thumbnails; same-origin textures reuse the image cache.
- [x] B3 Placement-editor UI is a lazy chunk (`src/hub/editor/editorModules.ts`,
      74 KB); visitor bundle budget in `test:frame-budget`.
- [x] C1 Info sheet peek/half/full stops (`resolveSheetStop` →
      `pickSnapTarget`); `overscroll-behavior: contain`.
- [x] C2 Photo-room touch swipe between rooms at the fitted zoom (gallery
      swipe rule; dropdown stays); neighbour photos preloaded.
- [ ] D1 Split-layer raster (target: fewer double-click redraws than 41/31).
- [x] C4 Phone immersive view: a single tap on the artwork hides topbar,
      timeline, nav and info sheet together; the gallery refits through
      `handleViewportMetricsChanged()` (usable height 660 → 844 px at 390×844).
- [x] C3 Touch phones in landscape: right-hand timeline rail, utilities in
      the phone menu, immersive tap; artwork area 744×118 → 744×334 px at
      844×390 (the desktop `--chrome-bottom` of 200 px no longer applies).
- [ ] C5 hub pinch + edge preview.
- [x] C6 Photo-room flick test: a fast one-finger flick keeps moving after
      release and stops exactly at the pan limit.
- [x] B4a Background photos as same-size WebP copies (hub 11.2 MB → 176 KB;
      visit 19.9 → 6.0 MB desktop, 18.6 → 4.8 MB phone).
- [ ] B4b Lazy hub artwork loading for off-screen phone panorama artworks.
- [x] D3 Zoom readout (`src/ui/ZoomIndicator.ts`, gallery + photo room,
      polite announcement); D5 gallery reset drift fixed (`coupledZoomPan`:
      pan shares the zoom λ during zoom moves; pure fixed-point check).
- [x] E3 Deep links `?artwork=<id>&view=gallery` (`src/navigation/deepLink.ts`,
      `npm run test:deep-links`) and a "Link teilen" button in the artwork
      information (`src/ui/shareLink.ts`; share sheet, clipboard fallback).
- [ ] D2 per-frame repaint; D4 pointer-anchored wheel modifier.
- [ ] E (200 % text, reduce chrome, device overlay, shadow-light
      harness stop), F (CI split, baselines, Lighthouse, dev-tool upgrades),
      G (content; needs the customer).

## Handoff implementation (v1.45, 2026-10-22)

- [x] 0.1 Phone strip-reach flake diagnosed (rAF starvation) and fixed in the
      test; pure side-wall reachability sweep in `test:touch-gestures`.
- [x] 0.2 Stale handoff validation note superseded; starting points merged.
- [x] 0.3 Validation recorded in `docs/HANDOFF.md` → "v1.45 validation".
- [x] 1.1 `npm run measure:room-zoom` and baseline (`FINDINGS.md` v1.45).
- [ ] 1.2 Split-layer raster for the room camera (target: double-click).
- [x] 1.3 Shared multiplicative zoom curve + trackpad pinch gain.
- [x] 1.4 Shift+double-click step-out. [ ] Gallery reset drift check.
- [x] 1.5 Shift+arrow pan. [ ] Pointer-anchored wheel modifier. [ ] Zoom indicator.
- [x] 2.6 Strip position announcement. [ ] Larger-text checks. [ ] Reduce-chrome toggle.
- [ ] 2.1 Bottom-sheet snap points; 2.2 room swipe/parallax; 2.3 landscape
      side rail; 2.4 timeline auto-hide; 2.5 hub pinch/edge preview/deep links;
      2.7 flick/snap/swipe browser checks.
- [ ] Phase 3 (responsive images, Fraktal size, lazy hub decode, editor
      bundle split, PWA), phase 4 (CI split, baselines, Lighthouse, device
      overlay, old issues), phase 5 (content; needs customer input).
