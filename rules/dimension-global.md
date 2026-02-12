---
name: dimension-global
description: "Generate the single global dimension token file tokens/dimensions/dimension-global.json for Token Studio. This one file feeds --text-*, --leading-*, and --rounded-* CSS variables."
globs:
  - "tokens/dimensions/dimension-global.json"
  - "**/dimensions/*.json"
  - "**/*.md"
alwaysApply: false
---

# Dimension Tokens (GLOBAL) — Token Studio JSON (STRICT)

You are an expert design-system assistant. Your job is to generate **dimension tokens** for **Token Studio for Figma**.

You MUST generate exactly **1 file**:

`tokens/dimensions/dimension-global.json`

This single file is the shared scale for **fontSize**, **lineHeight**, and **radius**. The build script (`build-tokens.mjs`) reads this file once and outputs three sets of CSS variables from it:

| CSS prefix | Purpose |
|------------|---------|
| `--text-{n}` | Font size |
| `--leading-{n}` | Line height |
| `--rounded-{n}` | Border radius |

## 0) Hard requirements (MUST)

- Output **only valid JSON** (no markdown, no explanation, no code fences) when generating tokens.
- JSON must be **directly importable into Token Studio**.
- ❌ Do NOT include `_meta`, comments, helper keys, diagnostics, or any non-token objects.
- ❌ Do NOT create separate files for fontSize, lineHeight, or radius. Everything goes in `dimension-global.json`.
- ✅ Indentation: **2 spaces**
- ✅ No trailing commas
- ✅ Use `"type": "dimension"` at root level.
- ✅ Each leaf token MUST include a `"value"` string with `px` unit (e.g. `"12px"`).

---

## 1) Naming rules (STRICT)

All tokens use **numeric keys** representing the pixel value directly.

### 1.1 Key format (REQUIRED)

- Token keys are **plain numbers as strings**: `"0"`, `"2"`, `"4"`, `"10"`, `"40"`, `"999"`
- ❌ Do NOT use prefixes like `fontSize`, `lineHeight`, `radius`
- ❌ Do NOT use zero-padding (use `"2"` not `"02"`)

Examples:
- `"0"` → `{"value": "0px"}`
- `"2"` → `{"value": "2px"}`
- `"10"` → `{"value": "10px"}`
- `"999"` → `{"value": "999px"}`

---

## 2) Value rules (STRICT)

- `"0"` = `{"value": "0px"}` — required for radius reset
- Step: **2px** from 2 to 40
- `"999"` = `{"value": "999px"}` — required for full-round radius

Full list:

`0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 999`

Each token value equals its key in px:
- `"12"` = `{"value": "12px"}`
- `"0"` = `{"value": "0px"}`
- `"999"` = `{"value": "999px"}`

---

## 3) Output schema (STRICT)

The output file MUST be a single JSON object with:
- `"type": "dimension"` at root
- Each token leaf: `{"value": "Npx"}`

### dimension-global.json

```json
{
  "type": "dimension",
  "0": {"value": "0px"},
  "2": {"value": "2px"},
  "4": {"value": "4px"},
  "6": {"value": "6px"},
  "8": {"value": "8px"},
  "10": {"value": "10px"},
  "12": {"value": "12px"},
  "14": {"value": "14px"},
  "16": {"value": "16px"},
  "18": {"value": "18px"},
  "20": {"value": "20px"},
  "22": {"value": "22px"},
  "24": {"value": "24px"},
  "26": {"value": "26px"},
  "28": {"value": "28px"},
  "30": {"value": "30px"},
  "32": {"value": "32px"},
  "34": {"value": "34px"},
  "36": {"value": "36px"},
  "38": {"value": "38px"},
  "40": {"value": "40px"},
  "999": {"value": "999px"}
}
```

