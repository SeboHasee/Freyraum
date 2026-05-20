# FREYRAUM — How to add text to your paintings

This guide explains how to write a short text card for each painting so that
the gallery shows your own title, description, and other details.

You do **not** need a code editor, terminal, or technical tool.
You only need a plain text editor (Windows: Notepad — macOS: TextEdit).

---

## The idea in one sentence

For each painting file you put in the inbox, you also create a matching text
file with the **exact same name** but ending in `.txt`.

```
customer-artworks/inbox/
  01-sunset-at-the-lake.jpg      ← your painting
  01-sunset-at-the-lake.txt      ← your text card for that painting
  02-forest-path.png
  02-forest-path.txt
```

When you run **Update Gallery**, the importer reads both files together and
fills in the painting's title, description, and other details from the text card.

---

## Step-by-step

### 1. Put your painting in the inbox

Open `customer-artworks` → `inbox` and drop your picture file in there.

### 2. Create a text file with the same name

Open Notepad (Windows) or TextEdit (macOS, switch to plain text first).

**Important:** the text file name must match the picture file name exactly,
only the ending changes to `.txt`.

| Picture file | Matching text file |
|---|---|
| `01-sunset-at-the-lake.jpg` | `01-sunset-at-the-lake.txt` |
| `02-forest-path.png` | `02-forest-path.txt` |
| `my favourite painting.webp` | `my favourite painting.txt` |

### 3. Fill in the text card

Copy the template below and fill in your own text.
The only lines you **must** fill in are `Title:`, `Alt:`, and `Description:`.
Everything else is optional.

```
Title: Sunset at the lake
Year: 2024
Credit: Your Name
Alt: Warm orange and pink sky reflected in a calm lake at dusk.
Tags: sunset, lake, landscape

Description:
This painting captures the quiet end of a summer day at the lake near my childhood home.
The warm light on the water always reminded me of how brief those evenings felt.
You can write as many lines here as you like.
```

### 4. Save the text file in the inbox

Save the `.txt` file into the **same inbox folder** as the picture:
`customer-artworks/inbox/`

### 5. Run Update Gallery

Double-click **Update Gallery** in the FREYRAUM folder.

### 6. Read the report

The report opens automatically. Look for these sections:

- **Text applied** — your text card was matched and used. ✓
- **Pictures missing text** — picture imported with placeholder text; you should add a text card.
- **Text files without matching pictures** — a text card was found but has no matching picture; check the filename spelling.
- **Needs attention** — a field in your text card has a problem (e.g. the year is not a number).

Fix any issues, then run Update Gallery again.

### 7. Open the gallery

Double-click `index.html` in the FREYRAUM folder.
Click the left/right arrows to see your paintings.
The panel on the right shows the text from your text cards.

---

## Text card format reference

```
Title: (your painting title — required)
Year: (year of creation, e.g. 2024 — optional, defaults to current year)
Credit: (your name or studio name — optional, defaults to "Customer")
Alt: (short visual description for screen readers — required)
Tags: (comma-separated words for future filtering — optional)
Surface: (one of: matte-canvas, satin-canvas, varnished-oil, paper — optional)
Medium: (e.g. "Oil on canvas · 60×80 cm" — optional)
Subtitle: (short eyebrow line above the title — optional)

Description:
(your text here — required)
(can be multiple lines)
(blank lines inside the description are kept as-is)
```

---

## Field guide

### Title (required)
The main title shown in the info panel. If you leave it out, the gallery
generates a title from the file name.

**Example:** `Title: Sunset at the lake`

### Alt (required)
A short description of what the painting looks like, for visitors using a
screen reader or who cannot see images. Write in plain sentences.

Good alt text describes: subject, colours, composition, mood, and any visible text.

**Example:**
`Alt: Warm orange and pink sky reflected in a calm lake at dusk, with dark tree silhouettes on the left.`

**Tip:** Do not start with "image of" or "picture of" — screen readers
already say "image" before reading the alt text.

### Description (required)
The main text shown in the info panel below the title.
Start a new line after `Description:` and write as much as you like.
Blank lines within the description are preserved.

**Example:**
```
Description:
This painting captures the quiet end of a summer day at the lake.
The warm light on the water always reminded me of how brief those evenings felt.
```

### Year (optional)
The year the painting was created, as a four-digit number.
If you leave it blank or enter something invalid, the current year is used.

**Example:** `Year: 2024`

### Credit (optional)
Your name, studio name, or rights holder.
Shown in the info panel as `© [Credit]`.
If omitted, defaults to "Customer".

**Example:** `Credit: Maria Musterfrau`

### Tags (optional)
Comma-separated keywords reserved for future filtering.

**Example:** `Tags: landscape, lake, warm`

### Surface (optional)
The visual material simulation for the 3D painting effect.
If omitted, defaults to `matte-canvas`.

Allowed values (copy exactly):

| Value | Looks like |
|---|---|
| `matte-canvas` | Classic matte linen canvas |
| `satin-canvas` | Slightly glossy canvas |
| `varnished-oil` | Varnished oil painting |
| `paper` | Smooth paper |

**Example:** `Surface: varnished-oil`

### Medium (optional)
Free-text medium description, shown in the info panel alongside the pixel dimensions.
If omitted, the gallery shows the image orientation and pixel size.

**Example:** `Medium: Oil on canvas · 60×80 cm`

### Subtitle (optional)
Short line shown above the title (the "eyebrow" line).
If omitted, defaults to "Artwork 01", "Artwork 02", etc.

**Example:** `Subtitle: Freyraum Collection`

---

## Common questions

**What if I do not create a text card for a painting?**

The importer still imports the picture and uses a generated title (from the
file name) and placeholder text. You will see a "Pictures missing text" entry
in the report.

**What if the file names do not match?**

The picture imports without your custom text (uses the generated fallback).
The text card appears in the report as "Text files without matching pictures".
Check that both names are identical apart from the file extension.

**Can I use a different text editor?**

Yes. You can use any editor that saves plain text. Avoid rich-text editors
like Microsoft Word that save in proprietary formats — they must be saved as
"Plain Text (.txt)".

On macOS, switch TextEdit to plain text first: Format menu → Make Plain Text.

**Can I add more than one description paragraph?**

Yes. Just write multiple lines after `Description:`. Blank lines between
paragraphs are preserved.

**What happens if I make a spelling mistake in a field name?**

The field is ignored (a warning appears in the report). All other fields
still parse correctly.

**Can I update the text without re-importing the image?**

No. You must run Update Gallery again after editing the text card so the
changes appear in the gallery.

**What is the `ARTWORK_TEXT_TEMPLATE.txt` file?**

It is the reference copy-paste template, located at
`customer-artworks/ARTWORK_TEXT_TEMPLATE.txt`. Open it, copy it, rename
the copy to match your image, and fill in your text.

---

## Quick checklist

- [ ] Image file is in `customer-artworks/inbox/`
- [ ] Text file has the **same name** as the image (only `.txt` at the end)
- [ ] Text file is in the **same inbox folder**
- [ ] `Title:` is filled in
- [ ] `Alt:` is filled in with a plain-language description
- [ ] `Description:` section is filled in
- [ ] Ran **Update Gallery**
- [ ] Report says "Text applied" for the painting
- [ ] Gallery shows the correct text in the info panel

---

## For support

If the report shows a warning you do not understand, send the
`customer-artworks/last-import-report.txt` file to your support person.
It is written in plain language and they can read it without seeing the gallery.

See `docs/CUSTOMER_PICTURE_GUIDE.md` for the full picture-import guide.
See `plan.md § v0.18` for the technical implementation notes.
