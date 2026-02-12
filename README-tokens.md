# Design Tokens & Tailwind Setup

This project uses Design Tokens as the single source of truth for styles.

## How it works

1. **Tokens JSON**: Located in `tokens/`.
2. **Build Script**: `scripts/build-tokens.mjs` reads JSON and generates CSS variables in `src/styles/tokens.css`.
3. **Tailwind Config**: `tailwind.config.js` maps these CSS variables to Tailwind utility classes.
4. **Globals**: `src/styles/globals.css` imports `tokens.css`.

## Usage

### Commands

- `npm run build:tokens`: Re-generate `src/styles/tokens.css`. Run this if you change JSON files.
- `npm run dev`: Runs token build before starting dev server (configure your actual dev server command in package.json).

### Using Tokens in Code

Tokens are available as Tailwind classes. Use the suffixes defined in the global/brand files.

**Colors:**
- `bg-primary-500` (Global scale)
- `text-text-neutral` (Semantic brand alias)
- `border-interactive-primary`

**Spacing:**
- `p-4` (Mapped from brand token `p-4` -> 16px)
- `m-200` (Global token explicit usage -> 16px)
- `gap-025` (Global token -> 2px)

**Typography:**
- `text-16` (Font size 16px)
- `leading-24` (Line height 24px)

**Radius:**
- `rounded-04` (4px radius)

### Dark Mode

Dark mode is implemented via CSS variables. The `.dark` class on the `html` or `body` tag will swap the brand tokens to their dark mode values automatically.
