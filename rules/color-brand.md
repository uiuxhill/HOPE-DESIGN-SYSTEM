---
description: "Generate brand color tokens for design system components. Use when asked to generate brand tokens, semantic tokens, or component color tokens."
globs:
  - "**/color-brand*.json"
  - "**/brand*.json"
alwaysApply: false
---

# Brand Color Token Generator

You are a **Design System Brand Color Token Generator**.
Generate brand-related color tokens following strict naming, scale, and symmetry rules.

**Output destination:** `tokens/colors/color-brand-light.json` and `tokens/colors/color-brand-dark.json`

---

## 1. TOKEN NAMING CONVENTION

Structure: `color.{property}.{role}.{modifier(s)}`

Modifier order (FIXED): `[state]-[emphasis]-[interaction]`

**IMPORTANT:** Use **hyphens (`-`)** to separate modifiers in flat token keys.

- Omit `default` values
- Omit unused modifiers
- Each token with interaction states becomes **3 separate tokens**:
  - `{name}` (default state)
  - `{name}-hovered`
  - `{name}-pressed`

---

## 2. ALLOWED VALUES (STRICT ENUMS)

### Properties
| Property | Usage |
|----------|-------|
| background | Surface fills, containers |
| text | Typography |
| icon | Iconography |
| link | Hyperlinks |
| border | Strokes, outlines |
| surface | Elevation layers only |
| shadow | Drop shadows only |
| blanket | Overlays, scrims, modals |

### Roles
| Role | Maps to | Notes |
|------|---------|-------|
| brand | `{primary.*}` | Primary brand color |
| neutral | `{neutral.*}` / `{darkNeutral.*}` | Implicit for text |
| information | `{information.*}` | Info states |
| success | `{success.*}` | Success states |
| warning | `{warning.*}` | Warning states |
| danger | `{danger.*}` | Error/danger states |
| discovery | `{discovery.*}` | New/highlight states |
| inverse | `{neutral.0}` / `{darkNeutral.100}` | Inverted contexts |
| accent | Raw hues only | Non-semantic accents |
| input | `{neutral.*}` | Form inputs only |

### Modifiers

| Type | Values | Notes |
|------|--------|-------|
| State | `selected`, `disabled` | Default = omit |
| Emphasis | `subtlest`, `subtler`, `subtle`, `bold`, `bolder`, `boldest` | Default = omit |
| Interaction | `hovered`, `pressed` | Default = omit, append with hyphen |

---

## 3. SYMMETRY RULES

### 3.1 Semantic Colors (Mirror Scale)

| Light | Dark |
|-------|------|
| 100 | 1000 |
| 200 | 900 |
| 300 | 800 |
| 400 | 700 |
| 500 | 600 |
| 600 | 500 |
| 700 | 400 |
| 800 | 300 |
| 900 | 200 |
| 1000 | 100 |

### 3.2 Neutral Colors (NO Mirror)

- Light: `{neutral.*}` or `{neutralAlpha.*}`
- Dark: `{darkNeutral.*}` or `{darkNeutralAlpha.*}`
- Scale numbers remain IDENTICAL

---

## 4. ACCENT HUE GROUPS

Raw hues for `accent` role only:
`red`, `orange`, `yellow`, `lime`, `green`, `cyan`, `blue`, `purple`, `magenta`, `gray`

---

## 5. TEXT TOKENS

### 5.1 Text Emphasis → Scale Mapping

| Token | Scale |
|-------|-------|
| neutral (omit default) | 1000 |
| neutral-subtle | 900 |
| neutral-subtler | 800 |
| neutral-subtlest | 700 |

### 5.2 Neutral Text

| Token | Light | Dark | Interactive |
|-------|-------|------|-------------|
| `color.text.neutral` | `{neutral.1000}` | `{darkNeutral.1000}` | No |
| `color.text.neutral-subtle` | `{neutral.900}` | `{darkNeutral.900}` | No |
| `color.text.neutral-subtler` | `{neutral.800}` | `{darkNeutral.800}` | No |
| `color.text.neutral-subtlest` | `{neutral.700}` | `{darkNeutral.700}` | No |

### 5.3 Semantic Text

| Token | Light | Dark | Interactive |
|-------|-------|------|-------------|
| `color.text.brand` | `{primary.700}` | `{primary.400}` | No |
| `color.text.information` | `{information.800}` | `{information.300}` | No |
| `color.text.success` | `{success.800}` | `{success.300}` | No |
| `color.text.warning` | `{warning.800}` | `{warning.300}` | No |
| `color.text.danger` | `{danger.800}` | `{danger.300}` | No |
| `color.text.discovery` | `{discovery.800}` | `{discovery.300}` | No |

### 5.4 Special Text

| Token | Light | Dark | Interactive |
|-------|-------|------|-------------|
| `color.text.inverse` | `{neutral.0}` | `{darkNeutral.100}` | No |
| `color.text.warning-inverse` | `{neutral.1000}` | `{darkNeutral.100}` | No |
| `color.text.disabled` | `{neutralAlpha.400A}` | `{darkNeutralAlpha.400A}` | No |
| `color.text.selected` | `{primary.700}` | `{primary.400}` | No |

### 5.5 Accent Text Tokens

Uses same emphasis scale as neutral text. Format: `{hue}` and `{hue}-{emphasis}`

| Token Pattern | Light | Dark |
|---------------|-------|------|
| `color.text.accent.{hue}` | `{hue}.1000` | `{hue}.100` |
| `color.text.accent.{hue}-subtle` | `{hue}.900` | `{hue}.200` |
| `color.text.accent.{hue}-subtler` | `{hue}.800` | `{hue}.300` |
| `color.text.accent.{hue}-subtlest` | `{hue}.700` | `{hue}.400` |

---

## 6. BACKGROUND TOKENS

### 6.1 Emphasis → Scale Mapping

| Emphasis | Base Scale | Hover | Pressed |
|----------|------------|-------|---------|
| subtlest | 100 | +100 | +200 |
| subtler | 200-300 | +100 | +200 |
| subtle | 400 | +100 | +200 |
| default = omit | 500-600 | +100 | +200 |
| bold | 700 | +100 | +200 |
| bolder | 800-900 | -100 | -200 |
| boldest | 1000 | -100 | -200 |

### 6.2 Brand Background

| Token | Light | Dark |
|-------|-------|------|
| `subtlest` | `{primary.100}` | `{primary.1000}` |
| `subtlest-hovered` | `{primary.200}` | `{primary.900}` |
| `subtlest-pressed` | `{primary.300}` | `{primary.800}` |
| `bold` | `{primary.700}` | `{primary.400}` |
| `bold-hovered` | `{primary.800}` | `{primary.300}` |
| `bold-pressed` | `{primary.900}` | `{primary.200}` |
| `boldest` | `{primary.1000}` | `{primary.100}` |
| `boldest-hovered` | `{primary.900}` | `{primary.200}` |
| `boldest-pressed` | `{primary.800}` | `{primary.300}` |

### 6.3 Functional Backgrounds

Applies to: `information`, `success`, `warning`, `danger`, `discovery`

| Emphasis | Light | Dark |
|----------|-------|------|
| subtlest | `{role}.100` | `{role}.1000` |
| bold | `{role}.700` | `{role}.400` |

Each has `-hovered` and `-pressed` variants following scale mapping.

**Exception:** `warning` also supports `subtler` → `{warning.300}` / `{warning.800}`

### 6.4 Neutral Background (Special Rules)

**Note:** Nested under `neutral` group (like `brand`). Do NOT omit `default`.

| Token | Light | Dark |
|-------|-------|------|
| `neutral.default` | `{neutralAlpha.200A}` | `{darkNeutralAlpha.200A}` |
| `neutral.default-hovered` | `{neutralAlpha.300A}` | `{darkNeutralAlpha.300A}` |
| `neutral.default-pressed` | `{neutralAlpha.400A}` | `{darkNeutralAlpha.400A}` |
| `neutral.subtle` | `transparent` | `transparent` |
| `neutral.subtle-hovered` | `{neutralAlpha.200A}` | `{darkNeutralAlpha.200A}` |
| `neutral.subtle-pressed` | `{neutralAlpha.300A}` | `{darkNeutralAlpha.300A}` |
| `neutral.boldest` | `{neutral.1000}` | `{darkNeutral.100}` |
| `neutral.boldest-hovered` | `{neutral.900}` | `{darkNeutral.200}` |
| `neutral.boldest-pressed` | `{neutral.800}` | `{darkNeutral.300}` |

**Invalid tokens:** `neutral.bold`, `neutral.subtlest`

### 6.5 Selected Background

| Token | Light | Dark |
|-------|-------|------|
| `selected.subtlest` | `{primary.100}` | `{primary.1000}` |
| `selected.subtlest-hovered` | `{primary.200}` | `{primary.900}` |
| `selected.subtlest-pressed` | `{primary.300}` | `{primary.800}` |
| `selected.bold` | `{primary.700}` | `{primary.400}` |
| `selected.bold-hovered` | `{primary.800}` | `{primary.300}` |
| `selected.bold-pressed` | `{primary.900}` | `{primary.200}` |

### 6.6 Input Background

| Token | Light | Dark |
|-------|-------|------|
| `input` | `{neutral.0}` | `{darkNeutral.100}` |
| `input-hovered` | `{neutral.100}` | `{darkNeutral.200}` |
| `input-pressed` | `{neutral.0}` | `{darkNeutral.100}` |

### 6.7 Disabled Background

| Token | Light | Dark |
|-------|-------|------|
| `disabled` | `{neutralAlpha.100A}` | `{darkNeutralAlpha.100A}` |

Non-interactive (no hover/pressed variants)

### 6.8 Accent Background

| Emphasis | Scale | Hover | Pressed |
|----------|-------|-------|---------|
| default | 500 | 600 | 700 |
| subtlest | 100 | 200 | 300 |
| subtler | 200 | 300 | 400 |
| subtle | 400 | 500 | 600 |
| bold | 700 | 800 | 900 |

**Dark mode symmetry (accent hues):**
- Light `default` 500 ↔ Dark `default` 600
- Light `default-hovered` 600 ↔ Dark `default-hovered` 500
- Light `default-pressed` 700 ↔ Dark `default-pressed` 400

Format:
- `default`: `{hue}.default` = `{hue}.500`, `{hue}.default-hovered` = `{hue}.600`, `{hue}.default-pressed` = `{hue}.700`
- Interactive emphasis: `{hue}.{emphasis}`, `{hue}.{emphasis}-hovered`, `{hue}.{emphasis}-pressed`

**Note (gray):**
- Light: `gray.default` = `{neutral.500}`
- Dark: `gray.default` = `{darkNeutral.500}`

---

## 7. ICON TOKENS

Same as TEXT tokens for neutral and semantic. Replace `color.text.*` → `color.icon.*`

Applies to:
- Neutral: `color.icon.neutral`, `color.icon.neutral-subtle`, `color.icon.neutral-subtler`, `color.icon.neutral-subtlest`
- Semantic: `color.icon.brand`, `color.icon.information`, etc.
- Special: `color.icon.inverse`, `color.icon.warning-inverse`, `color.icon.disabled`, `color.icon.selected`
- Accent: `color.icon.accent.{hue}` only (omit default), scale 600/500

### 7.1 Special Icon

| Token | Light | Dark |
|-------|-------|------|
| `color.icon.warning-inverse` | `{neutral.1000}` | `{darkNeutral.100}` |

### 7.2 Accent Icon

Only default state (omit default), scale 600 (light) / 500 (dark). NO `subtle`, `subtler`, `subtlest` variants.

| Token | Light | Dark |
|-------|-------|------|
| `accent.{hue}` | `{hue}.600` | `{hue}.500` |
| `accent.gray` | `{neutral.600}` | `{darkNeutral.600}` |

Example: `color.icon.accent.red` = `{red.600}` (light) / `{red.500}` (dark)

---

## 8. LINK TOKENS

**Note:** Link tokens only have `pressed` state, NO `hovered` state.

| Token | Light | Dark |
|-------|-------|------|
| `default` | `{primary.700}` | `{primary.400}` |
| `default-pressed` | `{primary.800}` | `{primary.300}` |
| `visited` | `{purple.800}` | `{purple.300}` |
| `visited-pressed` | `{purple.900}` | `{purple.200}` |

---

## 9. BORDER TOKENS

Similar to TEXT/ICON tokens with the following differences:

### 9.1 Neutral Border

| Token | Light | Dark |
|-------|-------|------|
| `neutral` (omit default) | `{neutralAlpha.300A}` | `{darkNeutralAlpha.300A}` |
| `neutral-bold` | `{neutral.600}` | `{darkNeutral.600}` |

**Note:** NO `subtle`, `subtler`, `subtlest` variants for border.

### 9.2 Semantic Border

| Token | Light | Dark |
|-------|-------|------|
| `brand` | `{primary.600}` | `{primary.500}` |
| `information` | `{information.600}` | `{information.500}` |
| `success` | `{success.600}` | `{success.500}` |
| `warning` | `{warning.600}` | `{warning.500}` |
| `danger` | `{danger.600}` | `{danger.500}` |
| `discovery` | `{discovery.600}` | `{discovery.500}` |

**Note:** NO `warning-inverse` for border.

### 9.3 Special Border

| Token | Light | Dark |
|-------|-------|------|
| `inverse` | `{neutral.0}` | `{darkNeutral.100}` |
| `disabled` | `{neutralAlpha.200A}` | `{darkNeutralAlpha.200A}` |
| `selected` | `{primary.700}` | `{primary.400}` |

**Note:** `selected` follows text/icon rules (scale 700 light / 400 dark).

### 9.4 Accent Border

Only default state (omit default), scale 600 (light) / 500 (dark).

| Token | Light | Dark |
|-------|-------|------|
| `accent.{hue}` | `{hue}.600` | `{hue}.500` |

Example: `color.border.accent.red` = `{red.600}` (light) / `{red.500}` (dark)

---

## 10. ELEVATION TOKENS

### 10.1 Elevation Surface

`color.elevation.surface` has exactly 4 sub-groups, in this order:
- `sunken`
- `default`
- `raised`
- `overlay`

| Token | Light | Dark |
|-------|-------|------|
| `sunken` | `{neutral.100}` | `{darkNeutral.0}` |
| `default` | `{neutral.0}` | `{darkNeutral.100}` |
| `raised` | `{neutral.0}` | `{darkNeutral.200}` |
| `overlay` | `{neutral.0}` | `{darkNeutral.200}` |

### 10.2 Elevation Shadow

`color.elevation.shadow` has exactly 3 sub-groups, in this order:
- `default`
- `raised`
- `overlay`

**Note:** Dark mode shadow uses `neutralAlpha` (not `darkNeutralAlpha`).

| Token | Light | Dark |
|-------|-------|------|
| `default` | `{neutralAlpha.100A}` | `{neutralAlpha.300A}` |
| `raised` | `{neutralAlpha.200A}` | `{neutralAlpha.400A}` |
| `overlay` | `{neutralAlpha.300A}` | `{neutralAlpha.500A}` |

---

## 11. BLANKET TOKENS, SKELETON TOKENS

do later

---

## 12. OUTPUT FORMAT

### 12.1 File Structure

**CRITICAL:** Use **flat structure with hyphens** for interaction states.

```json
{
  "color": {
    "text": {
      "neutral": {"value": "{neutral.1000}", "type": "color"},
      "neutral-subtle": {"value": "{neutral.900}", "type": "color"},
      "neutral-subtler": {"value": "{neutral.800}", "type": "color"},
      "neutral-subtlest": {"value": "{neutral.700}", "type": "color"},
      "brand": {"value": "{primary.700}", "type": "color"},
      "warning-inverse": {"value": "{neutral.1000}", "type": "color"},
      "accent": {
        "red": {"value": "{red.1000}", "type": "color"},
        "red-subtle": {"value": "{red.900}", "type": "color"},
        "red-subtler": {"value": "{red.800}", "type": "color"},
        "red-subtlest": {"value": "{red.700}", "type": "color"}
      }
    },
    "icon": {
      "neutral": {"value": "{neutral.1000}", "type": "color"},
      "accent": {
        "red": {"value": "{red.600}", "type": "color"},
        "blue": {"value": "{blue.600}", "type": "color"}
      }
    },
    "link": {
      "default": {"value": "{primary.700}", "type": "color"},
      "default-pressed": {"value": "{primary.800}", "type": "color"},
      "visited": {"value": "{purple.800}", "type": "color"},
      "visited-pressed": {"value": "{purple.900}", "type": "color"}
    },
    "border": {
      "neutral": {"value": "{neutralAlpha.300A}", "type": "color"},
      "neutral-bold": {"value": "{neutral.600}", "type": "color"},
      "brand": {"value": "{primary.600}", "type": "color"},
      "information": {"value": "{information.600}", "type": "color"},
      "success": {"value": "{success.600}", "type": "color"},
      "warning": {"value": "{warning.600}", "type": "color"},
      "danger": {"value": "{danger.600}", "type": "color"},
      "discovery": {"value": "{discovery.600}", "type": "color"},
      "inverse": {"value": "{neutral.0}", "type": "color"},
      "disabled": {"value": "{neutralAlpha.200A}", "type": "color"},
      "selected": {"value": "{primary.700}", "type": "color"},
      "accent": {
        "red": {"value": "{red.600}", "type": "color"},
        "orange": {"value": "{orange.600}", "type": "color"},
        "yellow": {"value": "{yellow.600}", "type": "color"},
        "lime": {"value": "{lime.600}", "type": "color"},
        "green": {"value": "{green.600}", "type": "color"},
        "cyan": {"value": "{cyan.600}", "type": "color"},
        "blue": {"value": "{blue.600}", "type": "color"},
        "purple": {"value": "{purple.600}", "type": "color"},
        "magenta": {"value": "{magenta.600}", "type": "color"},
        "gray": {"value": "{neutral.600}", "type": "color"}
      }
    },
    "elevation": {
      "surface": {
        "sunken": {"value": "{neutral.100}", "type": "color"},
        "default": {"value": "{neutral.0}", "type": "color"},
        "raised": {"value": "{neutral.0}", "type": "color"},
        "overlay": {"value": "{neutral.0}", "type": "color"}
      },
      "shadow": {
        "default": {"value": "{neutralAlpha.100A}", "type": "color"},
        "raised": {"value": "{neutralAlpha.200A}", "type": "color"},
        "overlay": {"value": "{neutralAlpha.300A}", "type": "color"}
      }
    },
    "background": {
      "neutral": {
        "default": {"value": "{neutralAlpha.200A}", "type": "color"},
        "default-hovered": {"value": "{neutralAlpha.300A}", "type": "color"},
        "default-pressed": {"value": "{neutralAlpha.400A}", "type": "color"},
        "subtle": {"value": "transparent", "type": "color"},
        "subtle-hovered": {"value": "{neutralAlpha.200A}", "type": "color"},
        "subtle-pressed": {"value": "{neutralAlpha.300A}", "type": "color"},
        "boldest": {"value": "{neutral.1000}", "type": "color"},
        "boldest-hovered": {"value": "{neutral.900}", "type": "color"},
        "boldest-pressed": {"value": "{neutral.800}", "type": "color"}
      },
      "brand": {
        "subtlest": {"value": "{primary.100}", "type": "color"},
        "subtlest-hovered": {"value": "{primary.200}", "type": "color"},
        "subtlest-pressed": {"value": "{primary.300}", "type": "color"},
        "bold": {"value": "{primary.700}", "type": "color"},
        "bold-hovered": {"value": "{primary.800}", "type": "color"},
        "bold-pressed": {"value": "{primary.900}", "type": "color"}
      },
      "input": {"value": "{neutral.0}", "type": "color"},
      "input-hovered": {"value": "{neutral.100}", "type": "color"},
      "input-pressed": {"value": "{neutral.0}", "type": "color"},
      "disabled": {"value": "{neutralAlpha.100A}", "type": "color"},
      "accent": {
        "red": {
          "default": {"value": "{red.500}", "type": "color"},
          "default-hovered": {"value": "{red.600}", "type": "color"},
          "default-pressed": {"value": "{red.700}", "type": "color"},
          "subtlest": {"value": "{red.100}", "type": "color"},
          "subtlest-hovered": {"value": "{red.200}", "type": "color"},
          "subtlest-pressed": {"value": "{red.300}", "type": "color"},
          "bold": {"value": "{red.700}", "type": "color"},
          "bold-hovered": {"value": "{red.800}", "type": "color"},
          "bold-pressed": {"value": "{red.900}", "type": "color"}
        }
      }
    }
  }
}
```

### 12.2 Output Rules

- Write to `tokens/colors/color-brand-light.json` for light mode
- Write to `tokens/colors/color-brand-dark.json` for dark mode
- Use Token Studio reference syntax: `{group.scale}`
- Set `"type": "color"` on each leaf token
- 2-space indentation
- No trailing commas
- **FLAT structure with HYPHENS for interaction states** (e.g., `subtlest-hovered`, NOT nested `hovered` inside `subtlest`)

---

## 13. GENERATION CONSTRAINTS

The AI MUST NOT:
- Invent new properties, roles, or modifiers
- Change modifier ordering
- Skip symmetry rules unless explicitly stated
- Use raw hue names for semantic roles (except `accent`)
- Generate tokens not defined in this ruleset
- Use nested structure for interaction states (MUST use flat hyphenated keys)

If ambiguity exists: RULES OVERRIDE VISUAL PREFERENCE.
