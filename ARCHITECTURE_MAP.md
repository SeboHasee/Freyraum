# FREYRAUM architecture map

## v0.19 — Calm background music workflow shipped (2026-05-20)

Architecture addition shipped: importer + runtime audio boundary for calm background music, with format compatibility and accessible mute/volume controls.

Current runtime: **shipped**. Background audio now loads from importer payloads, integrates with preferences/lifecycle, and exposes mute/volume controls in the preferences panel. Canonical reference: `plan.md § v0.19`.

## v0.18 — Customer sidecar text shipped (2026-05-20)

Current status: shipped. The importer (`scripts/import-artworks.mjs`) reads same-basename `.txt` sidecars (`.md` accepted as a backup) and merges customer-facing metadata into the generated manifest. Asset fields (`id`, `image`, `webglImage`, `dimensions`) remain importer-owned. Canonical plan: `plan.md § v0.18`. Research log: `FINDINGS.md § 2026-05-20`. Customer guide: `docs/CUSTOMER_TEXT_GUIDE.md`. Template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.

FREYRAUM is a Vite + strict TypeScript + three.js customer-preview application for an interactive digital museum installation.

## Runtime entry

- `src/main.ts`
  - imports global SCSS
  - validates injected artwork manifests
  - creates renderer, scene, post-processing, lighting, gallery, controls, preferences, diagnostics, and adaptive quality
  - owns the render loop, page lifecycle suspension, resize coordination, and UI wiring

## Core rendering

- `src/core/RendererManager.ts`: WebGL renderer setup, quality preset application, pixel ratio, context-loss diagnostics, shader pre-warm, renderer snapshots, idempotent disposal.
- `src/core/SceneManager.ts`: scene/camera setup and aspect updates.
- `src/core/PostProcessing.ts`: post-processing chain and resize/render ownership.
- `src/rendering/RenderBackend.ts`: progressive rendering capability probes.

## Gallery domain

- `src/gallery/GalleryManager.ts`: active artwork state, navigation, zoom/pan/reset math, art-safe viewport metrics, animation smoothing, diagnostics.
- `src/gallery/ArtworkMesh.ts`: artwork mesh/frame construction.
- `src/gallery/TextureManager.ts`: artwork texture loading, anisotropy, quality-sensitive texture behavior.
- `src/gallery/SidePanels.ts`: side artwork presentation.
- `src/config/artworks.ts`: built-in artwork data and metadata contract.
- `src/config/quality.ts`: quality presets.

## Materials and lighting

- `src/materials/PaintingMaterial.ts`: painting shader/material fidelity.
- `src/materials/PaintingTextureSet.ts`: texture role typing and resolved texture sets.
- `src/materials/ProceduralTextureFactory.ts`: procedural fallback maps.
- `src/materials/CanvasMaterial.ts`: canvas/frame material helpers.
- `src/lighting/LightingSetup.ts` and `src/lighting/LightProfile.ts`: lighting profiles and runtime light setup.

## Interaction and UI

- `src/interaction/CanvasInteraction.ts`: pointer/touch/canvas interaction path. Replaces `MouseInteraction`, `TouchInteraction`, and `ZoomPan` (removed in v0.17).
- `src/interaction/KeyboardNav.ts`: keyboard navigation.
- `src/ui/`: topbar, info panel, preferences, fallback screen, fullscreen, hints, navigation, zoom controls.
- `src/timeline/Timeline.ts`: timeline UI, selection, and scroll behavior.
- `src/styles/main.scss`: global layout, glass chrome, responsive/safe-area styling, motion tokens, quality-aware CSS.

## Utilities

- `src/utils/Diagnostics.ts`: bounded diagnostics buffer, global report API, scoped logging.
- `src/utils/FrameBudgetMonitor.ts` and `src/utils/AdaptiveQualityController.ts`: frame budget sampling and adaptive quality.
- `src/utils/performance.ts`: startup quality and pixel ratio heuristics. `isMobileDevice()` was removed in v0.17; use `detectDeviceCapabilities()` from `device.ts`.
- `src/utils/preferences.ts`: `freyraum.preferences.v1` localStorage schema and document-level data attributes.
- `src/utils/device.ts`: device capability detection and DOM data attributes.
- `src/utils/math.ts`, `texture.ts`, `webgl.ts`, `preferences.ts`: focused helpers.

## Asset/customer workflow

- `scripts/import-artworks.mjs`: imports customer artwork files and customer audio files, validates assets, generates artwork/audio preview payloads, and writes warning-first reports.
- `scripts/run-import-artworks.cjs`: Node version guard and friendly compatibility report.
- `scripts/write-local-preview.mjs`: writes the local customer preview HTML plus artwork/audio stubs.
- `Update Gallery.bat` and `Update Gallery.command`: customer-facing launchers.
- `customer-artworks/`: customer input and processed folders.
- `customer-audio/`: customer audio input folders.
- `customer-preview/`: generated preview bundle and assets.

## Documentation system

- `plan.md`: current and historical implementation plans.
- `FINDINGS.md`: technical findings, decisions, validation notes, regressions.
- `CHANGELOG.md`: concise release/change history.
- `DOCUMENTATION_RULES.md`: required documentation updates.
- `docs/HANDOFF.md`: customer/contributor handoff.
- `.github/copilot-instructions.md` and `.github/prompts/`: AI workflow guidance.
- `docs/architecture/README.md`: deeper architecture notes and subsystem documentation entry point.
- `docs/standards/CODING_GUIDELINES.md`: code, diagnostics, CSS, and dependency maintenance standards.
- `docs/ai-feedback/AI_FEEDBACK_LOOP.md`: audit/review loop for future AI-assisted work.
