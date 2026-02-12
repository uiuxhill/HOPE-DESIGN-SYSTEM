---
name: spacing-brand
description: "Generate brand spacing aliases for padding/margin using Tailwind-like names (p-2, m-4, etc.), referencing spacing-global tokens."
globs:
  - "**/spacing-brand.json"
  - "**/spacings/*.json"
  - "**/*.md"
alwaysApply: false
---

# Spacing Tokens (BRAND) — Padding & Margin Aliases (STRICT)

You are an expert design-system assistant. Your job is to generate **padding** and **margin** spacing tokens for **Token Studio for Figma**, using **Tailwind-like naming**, aliased to global spacing tokens.

## 0) Hard requirements (MUST)

- **Output destination:** Write ALL generated tokens to `tokens/spacings/spacing-brand.json`.
- Output **only valid JSON** (no markdown, no explanation, no code fences) when generating tokens.
- JSON must be **directly importable into Token Studio**.
- ❌ Do NOT include `_meta`, comments, helper keys, diagnostics, or any non-token objects.
- ✅ Indentation: **2 spaces** (or 4 spaces for consistency)
- ✅ No trailing commas
- ✅ Use `"type": "spacing"` at root level.
- ✅ All leaf tokens MUST use Token Studio reference syntax to global spacing tokens:
  - Example: `{"value": "{8}"}`
- ❌ Do NOT use raw px values in brand tokens (must reference global tokens).

---

## 1) Source of truth

All aliases MUST reference tokens in `tokens/spacings/spacing-global.json`.

Global tokens use numeric keys: `"0"`, `"1"`, `"2"`, `"4"`, `"8"`, `"16"`, etc.

---

## 2) Naming (Tailwind-like)

### 2.1 Padding tokens

Prefix: `p-*`

### 2.2 Margin tokens

Prefix: `m-*`

### 2.3 Special tokens

- `p-px` and `m-px` → references `{1}` (1px)
- Use hyphenated keys exactly like Tailwind (e.g. `p-2`, `m-4`)
- For fractional Tailwind values, use hyphen: `p-0-5`, `p-1-5`
- ❌ Do NOT generate negative tokens (e.g. `-m-2`) unless explicitly requested.

---

## 3) Scale mapping (Tailwind number → global token)

| Tailwind key | px | Reference |
|-------------|-----|-----------|
| `0` | 0 | `{0}` |
| `px` | 1 | `{1}` |
| `0-5` | 2 | `{2}` |
| `1` | 4 | `{4}` |
| `1-5` | 6 | `{6}` |
| `2` | 8 | `{8}` |
| `3` | 12 | `{12}` |
| `4` | 16 | `{16}` |
| `5` | 20 | `{20}` |
| `6` | 24 | `{24}` |
| `7` | 28 | `{28}` |
| `8` | 32 | `{32}` |
| `9` | 36 | `{36}` |
| `10` | 40 | `{40}` |
| `11` | 44 | `{44}` |
| `12` | 48 | `{48}` |
| `13` | 52 | `{52}` |
| `14` | 56 | `{56}` |
| `15` | 60 | `{60}` |
| `16` | 64 | `{64}` |
| `17` | 68 | `{68}` |
| `18` | 72 | `{72}` |
| `19` | 76 | `{76}` |
| `20` | 80 | `{80}` |
| `22` | 88 | `{88}` |
| `24` | 96 | `{96}` |
| `28` | 112 | `{112}` |
| `30` | 120 | `{120}` |

---

## 4) Output structure (STRICT)

The output JSON is a **flat structure** with `"type": "spacing"` at root level.

All padding tokens (`p-*`) come first, then all margin tokens (`m-*`).

```json
{
    "type": "spacing",
    "p-0": {"value": "{0}"},
    "p-px": {"value": "{1}"},
    "p-0-5": {"value": "{2}"},
    "p-1": {"value": "{4}"},
    "p-1-5": {"value": "{6}"},
    "p-2": {"value": "{8}"},
    "p-3": {"value": "{12}"},
    "p-4": {"value": "{16}"},
    "p-5": {"value": "{20}"},
    "p-6": {"value": "{24}"},
    "p-7": {"value": "{28}"},
    "p-8": {"value": "{32}"},
    "p-9": {"value": "{36}"},
    "p-10": {"value": "{40}"},
    "p-11": {"value": "{44}"},
    "p-12": {"value": "{48}"},
    "p-13": {"value": "{52}"},
    "p-14": {"value": "{56}"},
    "p-15": {"value": "{60}"},
    "p-16": {"value": "{64}"},
    "p-17": {"value": "{68}"},
    "p-18": {"value": "{72}"},
    "p-19": {"value": "{76}"},
    "p-20": {"value": "{80}"},
    "p-22": {"value": "{88}"},
    "p-24": {"value": "{96}"},
    "p-28": {"value": "{112}"},
    "p-30": {"value": "{120}"},

    "m-0": {"value": "{0}"},
    "m-px": {"value": "{1}"},
    "m-0-5": {"value": "{2}"},
    "m-1": {"value": "{4}"},
    "m-1-5": {"value": "{6}"},
    "m-2": {"value": "{8}"},
    "m-3": {"value": "{12}"},
    "m-4": {"value": "{16}"},
    "m-5": {"value": "{20}"},
    "m-6": {"value": "{24}"},
    "m-7": {"value": "{28}"},
    "m-8": {"value": "{32}"},
    "m-9": {"value": "{36}"},
    "m-10": {"value": "{40}"},
    "m-11": {"value": "{44}"},
    "m-12": {"value": "{48}"},
    "m-13": {"value": "{52}"},
    "m-14": {"value": "{56}"},
    "m-15": {"value": "{60}"},
    "m-16": {"value": "{64}"},
    "m-17": {"value": "{68}"},
    "m-18": {"value": "{72}"},
    "m-19": {"value": "{76}"},
    "m-20": {"value": "{80}"},
    "m-22": {"value": "{88}"},
    "m-24": {"value": "{96}"},
    "m-28": {"value": "{112}"},
    "m-30": {"value": "{120}"}
}
```

