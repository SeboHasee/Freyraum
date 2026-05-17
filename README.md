# Freyraum

A premium interactive digital museum installation built by a high-end creative technology studio.

## One-click local customer preview

Double-click the root `index.html` file.

It opens the committed static customer preview at:

```text
customer-preview/app.html
```

This path is designed to work locally without running a development server.

The customer preview is built as a classic browser script, not a Vite module entry, so it can run from `file://` when opened by double-clicking.

> Note: The current customer preview uses embedded placeholder artwork, so the initial demo can open offline. Replace these placeholders with final local artwork assets before a real customer presentation.

## Current interaction behavior

- mouse wheel / pinch: zoom with dynamic safety limits
- mouse drag / one-finger touch while zoomed: pan within artwork bounds
- mouse move: subtle artwork hover reaction at every zoom level
- left/right arrows and side previews: navigate artworks
- touch swipe when not zoomed in: navigate artworks

## Developer workflow

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build the local customer preview:

```bash
npm run build
```

The build is split into smaller scripts for debugging:

```bash
npm run build:typecheck
npm run build:preview
npm run build:preview-html
```

Lint source files:

```bash
npm run lint
```

## Documentation

This repository now follows a documentation-first rule for future development.

- [`plan.md`](./plan.md) — current plan, implemented work, and next-step scope
- [`CHANGELOG.md`](./CHANGELOG.md) — shipped changes by version/date
- [`FINDINGS.md`](./FINDINGS.md) — technical findings, caveats, and validation notes
- [`DOCUMENTATION_RULES.md`](./DOCUMENTATION_RULES.md) — required documentation process for future work
