# FREYRAUM — Customer Text Guide

This guide explains how to attach text metadata to artworks.

## Core rule

Each image may have a matching `.txt` file with the same basename in `customer-artworks/inbox/`.

Example:

```text
customer-artworks/inbox/
  01-sunset.jpg
  01-sunset.txt
```

## Steps

1. Copy `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`.
2. Rename it to match your image basename.
3. Fill at least `Title`, `Alt`, and `Description`.
4. Save it next to the image in `customer-artworks/inbox/`.
5. Run `Update Gallery.command` or `Update Gallery.bat`.
6. Check `customer-artworks/last-import-report.txt`.

## Sidecar behavior

- `.txt` is primary.
- `.md` is accepted as secondary fallback.
- Missing/invalid sidecars create warnings, not hard import failures.
- `Surface` accepts any plain text, is shown with the artwork metadata, and does not alter canvas, material, or render settings.

Example:

```text
Surface: Ölfarbe auf grober Leinwand
```

## Common report sections

- Text applied
- Pictures missing text
- Text files without matching pictures
- Text fields needing attention
- Duplicate text files

## Related docs

- Picture workflow: `docs/CUSTOMER_PICTURE_GUIDE.md`
- Museum hub mapping: `customer-artworks/museum-hub.json` (framed slots →
  artwork IDs, normalized placement, visual tokens, frame presets; see the
  canonical config reference for the on-screen calibration workflow)
- Canonical config reference: `docs/QUERY_PARAMETERS.md`
- Historical release context: `CHANGELOG.md`
