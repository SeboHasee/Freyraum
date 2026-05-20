# FREYRAUM — Draft guide for painting text sidecars (planned v0.18)

> Status: **planned, not live yet**. The current importer still ignores `.txt` sidecar files. This guide documents the finalized v0.18 workflow so the future implementation and customer wording stay aligned. Today, continue using the shipped picture-only workflow in `docs/CUSTOMER_PICTURE_GUIDE.md`.

This draft guide explains how the **planned** sidecar-text workflow will work once v0.18 is implemented.

You will not need a code editor, terminal, or technical tool.
You will only need a plain text editor (Windows: Notepad — macOS: TextEdit in plain-text mode).

---

## Planned idea in one sentence

For each painting file in `customer-artworks/inbox/`, the future v0.18 importer will also read a matching text file with the **same basename** and the `.txt` extension.

```text
customer-artworks/inbox/
  01-sunset-at-the-lake.jpg      ← painting
  01-sunset-at-the-lake.txt      ← matching text card
  02-forest-path.png
  02-forest-path.txt
```

---

## Planned workflow (after v0.18 implementation)

### 1. Put the painting in the inbox

Open `customer-artworks` → `inbox` and place the picture file there.

### 2. Create a text file with the same name

Open Notepad (Windows) or TextEdit (macOS, switched to plain text first).

The text file name must match the picture file name exactly, only the extension changes to `.txt`.

| Picture file | Matching text file |
| --- | --- |
| `01-sunset-at-the-lake.jpg` | `01-sunset-at-the-lake.txt` |
| `02-forest-path.png` | `02-forest-path.txt` |
| `my favourite painting.webp` | `my favourite painting.txt` |

### 3. Fill in the text card

Copy the template below and fill in the fields.
The planned workflow expects the customer to provide at least `Title:`, `Alt:`, and `Description:`.

```text
Title: Sunset at the lake
Subtitle: Freyraum Collection
Year: 2024
Credit: Your Name
Alt: Warm orange and pink sky reflected in a calm lake at dusk.
Tags: sunset, lake, landscape
Surface: matte-canvas
Medium: Oil on canvas · 60×80 cm

Description:
This painting captures the quiet end of a summer day at the lake near my childhood home.
The warm light on the water always reminded me of how brief those evenings felt.
```

### 4. Save the text file next to the image

Save the `.txt` file into the same inbox folder as the image:
`customer-artworks/inbox/`

### 5. Run Update Gallery

After the future v0.18 implementation ships, double-click **Update Gallery** in the FREYRAUM folder.

### 6. Read the report

After implementation, the report is planned to include text-specific sections such as:

- **Text applied** — the text card was matched and used.
- **Pictures missing text** — the picture imported with fallback text because no sidecar existed.
- **Text files without matching pictures** — a text card exists but no image with the same basename was found.
- **Text fields needing attention** — a sidecar file parsed, but one or more fields need correction.

### 7. Open the gallery

After implementation, `index.html` should show the sidecar text in the info panel.

---

## Planned text-card format reference

```text
Title: (painting title — customer should provide)
Subtitle: (optional eyebrow line above the title)
Year: (optional four-digit year)
Credit: (optional — defaults to "Customer")
Alt: (customer should provide a short visual description)
Tags: (optional comma-separated keywords)
Surface: (optional: matte-canvas, satin-canvas, varnished-oil, paper)
Medium: (optional free-text medium override)

Description:
(customer should provide the main info-panel text here)
(can be multiple lines)
(blank lines inside the description are preserved)
```

---

## Field guide

### Title
The main title shown in the info panel.
If omitted, the planned importer will fall back to a filename-generated title and warn in the report.

### Subtitle
Optional short line above the title.
If omitted, the importer should keep the generated `Artwork 01`, `Artwork 02`, etc.

### Alt
A concise visual description for assistive technology.
It should describe the visible painting rather than repeating the title.

Good alt text usually mentions subject, colours, composition, mood, and visible text where relevant.
Avoid starting with “image of” or “picture of”.

### Description
The longer visible text shown in the info panel.
The parser is planned to keep it separate from `Alt` and preserve multiple lines.

### Year
Optional four-digit year.
Invalid values should warn and fall back to the current year.

### Credit
Optional artist/studio/rights-holder string.
If omitted, the planned default is `Customer`.

### Tags
Optional keywords reserved for future filtering.

### Surface
Optional visual material profile for the 3D painting effect.

Allowed values:

| Value | Meaning |
| --- | --- |
| `matte-canvas` | classic matte linen canvas |
| `satin-canvas` | slightly glossy canvas |
| `varnished-oil` | varnished oil painting |
| `paper` | smooth paper |

### Medium
Optional free-text medium description.
If omitted, the importer should keep the current dimension-based label.

---

## Planned report behavior

The future implementation is expected to stay forgiving:

- missing text should **not** fail the whole import;
- invalid text fields should warn in plain language;
- orphaned text files should be listed clearly;
- the current offline `file://` preview and `webglImage` workflow should remain unchanged.

---

## What is true today

- The current importer does **not** yet read `.txt` sidecars.
- The current shipped customer workflow is still picture-only.
- The importer still generates fallback metadata automatically.
- This guide and `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt` are draft assets for the upcoming v0.18 implementation.

---

## Related docs

- Current shipped workflow: `docs/CUSTOMER_PICTURE_GUIDE.md`
- Final audited plan: `plan.md § v0.18`
- Research log: `FINDINGS.md § 2026-05-20`
- Draft template: `customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`
