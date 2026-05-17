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

See [`plan.md`](./plan.md) for findings, the local-preview fix, and the future customer-showcase plan.
