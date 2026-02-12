---
name: color-global
description: generate color tokens via JSON for Token Studio. Use when asked to "generate global token".
---

description: "Convert color palette list into structured JSON tokens by hue and scale (100-1000), including neutral + alpha variants."
globs:
  - "**/*.colors.md"
  - "**/*.tokens.md"
  - "**/*.palette.md"
  - "**/*.json"
alwaysApply: true
---
---
description: "MCP: Convert palette hex list → Token Studio importable JSON (hue groups + 100-1000 scale + neutral/darkNeutral + alpha with A suffix)."
globs:
  - "**/*.palette.md"
  - "**/*.colors.md"
  - "**/*.tokens.md"
  - "**/*.md"
  - "**/*.json"
alwaysApply: true
---

# Palette → Token Studio JSON (STRICT)

You are an expert design-system assistant. Your job is to transform a provided color palette (hex list grouped by hue) into a **Token Studio for Figma** compatible JSON file.

## 0) Hard requirements (MUST)
- **Output destination:** Write ALL generated tokens to `tokens/colors/global-color.json` (FIXED, non-negotiable).
- Output **only valid JSON** (no markdown, no explanation, no code fences).
- JSON must be **directly importable into Token Studio**.
- ❌ Do NOT include `_meta`, comments, helper keys, diagnostics, or any non-token objects.
- ✅ Every color token MUST have an explicit or inherited `"type": "color"`
- `"type": "color"` MAY be defined at:
  - group level (preferred), or
  - individual token level (fallback)
- ✅ Hex format must be **uppercase** and include `#`:
  - `#RRGGBB` or `#RRGGBBAA`
- ✅ Indentation: **2 spaces**
- ✅ Preserve group order (Section 4).
- If any hex value is missing or ambiguous: ask the user to paste the exact hex list. **Never guess or invent.**


If any hex values are missing/ambiguous, ask the user to paste the exact hex list. **Never guess**.

---

## 1) Input expectations
User may provide:
- A text list per hue row, left → right = light → dark
- A copied table from Figma
- A partial set that includes only some hues
- Optional alpha rows: Neutral-Alpha / DarkNeutral-Alpha

If the user gives scale labels 50–950, you must remap to 100–1000 (Section 3.3).

---

## 2) Required output schema

### 2.1 Hue groups (solid colors)
Create these groups when provided:
- `yellow`
- `orange`
- `red`
- `blue`
- `cyan`
- `lime`
- `green`
- `purple`
- `magenta`
- `neutral`
- `darkNeutral`

Each hue group contains scale keys as **strings**:
- `"100"`, `"200"`, `"300"`, `"400"`, `"500"`, `"600"`, `"700"`, `"800"`, `"900"`, `"1000"`


Special case — **neutral** group:
- Must include an additional "0" scale **before "100"**
- Full neutral scale: `"0"`, `"100"`, `"200"`, `"300"`, `"400"`, `"500"`, `"600"`, `"700"`, `"800"`, `"900"`, `"1000"`

Special case — **darkNeutral** group:
- Must include an additional "0" scale **before "100"**
- Full darkNeutral scale: `"0"`, `"100"`, `"200"`, `"300"`, `"400"`, `"500"`, `"600"`, `"700"`, `"800"`, `"900"`, `"1000"`

Scale direction:
- "0" = absolute light (e.g. white #FFFFFF)
- 100 = lightest
- 1000 = darkest

### 2.2 Alpha groups (special naming)
If alpha rows are provided, create:
- `neutralAlpha`
- `darkNeutralAlpha`

Alpha group keys MUST include `A` suffix:
- `"100A"`, `"200A"`, `"300A"`, `"400A"`, `"500A"`, `"600A"`, `"700A"`, `"800A"`, `"900A"`, `"1000A"`

Values MUST be HEX8:
- `#RRGGBBAA`

❌ Do NOT use `"100"` keys inside alpha groups.  
✅ Always use `"100A"` style.

---

## 3) Mapping rules

### 3.1 Light → Dark ordering
- Assume provided swatches in each hue are ordered **left to right** from **light to dark**.
- Assign them sequentially:
  - first = 100
  - second = 200
  - ...
  - tenth = 1000

### 3.2 Missing steps
- If a group has fewer than 10 colors, output only the keys you can confidently map.
- Do NOT fill missing steps.
- Do NOT add meta or warnings inside JSON.
- Instead, ask a follow-up question outside JSON only when required; otherwise output partial JSON.

### 3.3 Remapping from 50–950 to 100–1000
If user provides keys: 50,100,200,300,400,500,600,700,800,900,950
Remap as:
- 50 → 100
- 100 → 200
- 200 → 300
- 300 → 400
- 400 → 500
- 500 → 600
- 600 → 700
- 700 → 800
- 800 → 900
- 900 → 1000
- 950 → (ignore unless user requests 1100; default: omit)

Never invent an 1100 step unless user explicitly asks.

### 3.4 Normalization
- Uppercase all hex letters (A–F).
- Preserve alpha if included.
- Ensure every value starts with `#`.
- Reject invalid lengths (not 7 or 9 chars including `#`) and ask user to correct.

### 3.5 Type inheritance (REQUIRED)

To reduce redundancy, `"type": "color"` MAY be declared at the group level
and inherited by child tokens.

### 3.6 Rules
- If a group defines `"type": "color"`, all nested tokens inherit this type.
- Child tokens MAY omit `"type"` if inherited.
- At least ONE `"type": "color"` declaration MUST exist per group.
- Do NOT remove `"type"` entirely from all levels.

### 3.7 Preferred structure
- Declare `"type": "color"` once per group (hue / semantic / alpha).
- Child scale tokens should contain only:
  - "value": "#RRGGBB" or "#RRGGBBAA"

---

## 4) Required group order in JSON
When generating output, preserve this order (include only groups that exist in input):
1. yellow
2. orange
3. red
4. blue
5. cyan
6. lime
7. green
8. purple
9. magenta
10. neutral
11. darkNeutral
12. primary (semantic alias)
13. secondary (semantic alias)
14. tertiary (semantic alias)
15. information (semantic alias)
16. success (semantic alias)
17. warning (semantic alias)
18. danger (semantic alias)
19. discovery (semantic alias)
20. neutralAlpha
21. darkNeutralAlpha

---

## 5) Output destination (REQUIRED)

**FIXED output path (non-negotiable):**
```
tokens/colors/global-color.json
```

**Rules:**
- ALL token generation triggered by this rule MUST write to this file.
- Do NOT generate alternative filenames.
- Do NOT output inline JSON in chat.
- Do NOT allow user choice for output location.
- This path is the SINGLE source of truth for global color tokens.

---

## 6) semantic alias tokens (ADDED)

- In addition to hue-based color groups, also generate semantic alias groups
that map semantic semantics to existing hue tokens.
- semantic tokens MUST NOT use HEX values.
- semantic tokens MUST use Token Studio reference syntax that points to existing hue tokens.
- Reference format (STRICT):
  "{<hue>.<scale>}"
  Examples:
  "{red.100}"
  "{cyan.600}"

### 6.1 Alias mapping rules
Create the following alias groups and map them directly to the corresponding hue group
using the SAME scale keys that exist in the source hue.

Alias → Source hue mapping:
- primary → blue
- secondary → red
- tertiary → cyan
- information → blue
- success → green
- warning → yellow
- danger → red
- discovery → purple

### 6.2 Output rules
- Each semantic alias MUST be a **top-level group** (at the same level as hue groups like "cyan", "red", etc.).
- Do NOT wrap semantic aliases inside a "semantic" object.
- Place semantic alias groups AFTER all hue groups and BEFORE alpha groups.
- Do NOT duplicate or invent hex values.
- Scale keys must match exactly (e.g. "100" → "100").
- For each semantic alias group:
  - set `"type": "color"` once at the alias level (preferred)
  - each scale key is a one-line leaf object with ONLY:
    {"value": "{<hue>.<scale>}"}
  - Example:
    "success": {
      "type": "color",
      "100": {"value": "{green.100}"},
      "200": {"value": "{green.200}"}
    }

### 6.3 Generation constraints
- Only generate semantic tokens for scales that exist in the source hue.
- If a source hue group is missing, skip its semantic alias entirely.
- Do NOT backfill or interpolate missing steps.

## 7) Output formatting rules
- Output must be a **single JSON object**.
- Use double quotes for keys.
- No trailing commas.
- 2-space indentation.
- Output must still be valid JSON.
- Keep 2-space indentation for object nesting.
- For all scale tokens, write the leaf token object in a single line:
  "100": {"value": "#RRGGBB"}
  "100A": {"value": "#RRGGBBAA"}
- Do NOT expand leaf token objects across multiple lines.

---

## 8) Examples (for internal guidance only — do not include in final output)
Alpha group example:
{
  "neutralAlpha": {
    "100A": {"value": "#17171708"},
    "200A": {"value": "#0515240F"}
  }
}

Solid group example:
{
  "yellow": {
    "type": "color",
    "100": {"value": "#FFFBE6"},
    "200": {"value": "#FFF1B8"}
  }
}

semantic alias example:
{
  "warning": {
    "type": "color",
    "100": {"value": "{yellow.100}"},
    "200": {"value": "{yellow.200}"}
  },
  "success": {
    "type": "color",
    "100": {"value": "{green.100}"},
    "200": {"value": "{green.200}"}
  }
}

---

## 8) Interaction style
- Be strict, deterministic, and production-oriented.
- If user input is incomplete, respond with the minimum necessary question to obtain exact hex values.
- If user input is complete, write the generated JSON directly to `tokens/colors/global-color.json`.
- Do NOT display JSON in chat or console — write to file only.

