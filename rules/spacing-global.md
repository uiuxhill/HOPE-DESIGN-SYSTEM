---
name: spacing-global
description: "Generate global spacing tokens using numeric keys. Use when asked to generate spacing/space tokens."
globs:
  - "**/spacing-*.json"
  - "**/spacing*.json"
  - "**/*.md"
alwaysApply: false
---

# Spacing Tokens (GLOBAL) — Token Studio JSON (STRICT)

You are an expert design-system assistant. Your job is to generate **spacing tokens** for **Token Studio for Figma**.

## 0) Hard requirements (MUST)

- **Output destination:** Write ALL generated tokens to `tokens/spacings/spacing-global.json` (single source of truth).
- Output **only valid JSON** (no markdown, no explanation, no code fences) when generating tokens.
- JSON must be **directly importable into Token Studio**.
- ❌ Do NOT include `_meta`, comments, helper keys, diagnostics, or any non-token objects.
- ✅ Indentation: **2 spaces**
- ✅ No trailing commas
- ✅ Tokens MUST have `"type": "spacing"` at root level.
- ✅ Each leaf token MUST include a `"value"` with `px` unit.

---

## 1) Token naming (STRICT)

All tokens use **numeric keys** representing the pixel value directly.

### 1.1 Key format (REQUIRED)

- Token keys are **plain numbers as strings**: `"0"`, `"1"`, `"2"`, `"4"`, `"8"`, `"16"`, `"120"`
- ❌ Do NOT use prefixes like `space`
- ❌ Do NOT use percentage-based naming (like `space100`, `space025`)

Examples:
- `"0"` → `{"value": "0px"}`
- `"8"` → `{"value": "8px"}`
- `"120"` → `{"value": "120px"}`

---

## 2) Value mapping (STRICT)

Each token key equals its value in px:
- `"0"` = `{"value": "0px"}`
- `"16"` = `{"value": "16px"}`
- `"80"` = `{"value": "80px"}`

---

## 3) Default token set (REQUIRED)

Generate the following spacing scale:

| Key | Value |
|-----|-------|
| `"0"` | `0px` |
| `"1"` | `1px` |
| `"2"` | `2px` |
| `"4"` | `4px` |
| `"6"` | `6px` |
| `"8"` | `8px` |
| `"10"` | `10px` |
| `"12"` | `12px` |
| `"16"` | `16px` |
| `"20"` | `20px` |
| `"24"` | `24px` |
| `"28"` | `28px` |
| `"32"` | `32px` |
| `"36"` | `36px` |
| `"40"` | `40px` |
| `"44"` | `44px` |
| `"48"` | `48px` |
| `"52"` | `52px` |
| `"56"` | `56px` |
| `"60"` | `60px` |
| `"64"` | `64px` |
| `"68"` | `68px` |
| `"72"` | `72px` |
| `"76"` | `76px` |
| `"80"` | `80px` |
| `"88"` | `88px` |
| `"96"` | `96px` |
| `"112"` | `112px` |
| `"120"` | `120px` |

---

## 4) Output schema (STRICT)

The output must be a **single JSON object** with **flat numeric keys**:

```json
{
  "type": "spacing",
  "0": {"value": "0px"},
  "1": {"value": "1px"},
  "2": {"value": "2px"},
  "4": {"value": "4px"},
  "6": {"value": "6px"},
  "8": {"value": "8px"},
  "10": {"value": "10px"},
  "12": {"value": "12px"},
  "16": {"value": "16px"},
  "20": {"value": "20px"},
  "24": {"value": "24px"},
  "28": {"value": "28px"},
  "32": {"value": "32px"},
  "36": {"value": "36px"},
  "40": {"value": "40px"},
  "44": {"value": "44px"},
  "48": {"value": "48px"},
  "52": {"value": "52px"},
  "56": {"value": "56px"},
  "60": {"value": "60px"},
  "64": {"value": "64px"},
  "68": {"value": "68px"},
  "72": {"value": "72px"},
  "76": {"value": "76px"},
  "80": {"value": "80px"},
  "88": {"value": "88px"},
  "96": {"value": "96px"},
  "112": {"value": "112px"},
  "120": {"value": "120px"}
}
```

