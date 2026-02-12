// tailwind.config.js
/** @type {import('tailwindcss').Config} */
import fs from 'fs';
import path from 'path';

// Helper to read JSON synchronously (for config setup only)
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Paths
const TOKENS_DIR = path.join(process.cwd(), 'tokens');

// --- Helper Functions to Expand Tokens for Tailwind ---

// 1. Flatten function slightly adapted for Config consumption
function flattenKeys(obj, prefix = '') {
  let flattened = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key === 'type' && typeof val === 'string') continue;
    
    // Check if it's a leaf node with "value"
    if (val && typeof val === 'object' && 'value' in val) {
       // It's a token.
       const newKey = prefix ? `${prefix}-${key}` : key;
       flattened[newKey] = val.value;
    } else if (val && typeof val === 'object') {
       // Recurse
       const newKey = prefix ? `${prefix}-${key}` : key;
       const children = flattenKeys(val, newKey);
       Object.assign(flattened, children);
    }
  }
  return flattened;
}

// 2. Generators 
// These generate the `var(--...)` ref string based on the known CSS generation logic.

const generateColorTheme = () => {
  const global = readJson(path.join(TOKENS_DIR, 'colors/color-global.json'));
  const brand = readJson(path.join(TOKENS_DIR, 'colors/color-brand-light.json'));
  
  const colors = {};

  // Global Palettes (e.g., yellow-100, blue-500)
  // Structure: { yellow: { 100: { value: ... } } }
  // We want to map `colors: { yellow: { 100: "var(--color-yellow-100)", ... } }`
  
  Object.keys(global).forEach(paletteName => {
    if (paletteName === 'type') return;
    const paletteObj = global[paletteName];
    
    // ensure it's an object with keys like 100, 200...
    if (typeof paletteObj === 'object') {
      colors[paletteName] = {};
      Object.keys(paletteObj).forEach(shade => {
        if (shade === 'type' || shade === 'value') return; // value check if it's not nested
         
        // If the structure is direct value: { value: "#..."}
        if (paletteObj[shade].value) {
            colors[paletteName][shade] = `var(--color-${paletteName}-${shade})`;
        }
      });
    }
  });

  // Semantic / Brand Colors
  // Structure: { color: { text: { neutral: ... } } }
  // Flatten keys: "color-text-neutral" -> var(--color-text-neutral)
  // We will map these into top level or nested structure?
  // User asked: "expose them as Tailwind palettes"
  
  // Let's flatten brand aliases and just expose them as top-level semantic colors?
  // Or match the nesting? "text-neutral" -> text: { neutral: ... } ?
  // Existing tokens.css keys: --color-text-neutral
  // Ideally in tailwind: `text-neutral` or `text.neutral`?
  
  // Let's flatten to simple semantic keys for ease of use.
  // e.g. text-neutral -> "var(--color-text-neutral)"
  
  const flatBrand = flattenKeys(brand); // keys: "color-text-neutral"
  
  Object.keys(flatBrand).forEach(key => {
    // Remove "color-" prefix from the tailwind key if present for brevity, 
    // but keep CSS var full.
    // keys in JSON: "color-text-neutral"
    // We want tailwind class `text-text-neutral` or `bg-text-neutral`?
    // "color" prefix is redundant in usage like `text-color-text-neutral`.
    // Let's strip "color-" if it starts with it.
    
    let twKey = key;
    if (twKey.startsWith('color-')) {
        twKey = twKey.replace('color-', '');
    }
    
    // We can't have dots in keys at top level of colors, but we can return flat keys.
    colors[twKey] = `var(--${key})`;
  });

  return colors;
};

const generateSpacing = () => {
    // We unified spacing in build script to `--spacing-{suffix}` from `padding-p-{suffix}`
    // Global spacings use numeric keys like "0", "025", "100", etc.
    
    // Let's expose the Global ones as specific keys if wanted? 
    // User requirement: "map spacing-global + spacing-brand to theme.extend.spacing"
    // And from our build script we output:
    // --spacing-200 (global token)
    // --spacing-4 (derived from brand p-4)
    
    const spacings = {};
    const globalSpace = readJson(path.join(TOKENS_DIR, 'spacings/spacing-global.json'));
    // keys: 0, 025, 050, 100, etc.
    const flatGlobal = flattenKeys(globalSpace);
    Object.keys(flatGlobal).forEach(key => {
        spacings[key] = `var(--spacing-${key})`;
    });

    const brandSpace = readJson(path.join(TOKENS_DIR, 'spacings/spacing-brand.json'));
    // keys: padding-p-4, margin-m-4 ...
    // we want to extract that "4" or "0-5".
    
    const flatBrand = flattenKeys(brandSpace);
    Object.keys(flatBrand).forEach(key => {
        // key: padding-p-4
        const match = key.match(/^(?:padding-p|margin-m)-(.+)$/);
        if (match) {
            const suffix = match[1];
            spacings[suffix] = `var(--spacing-${suffix})`;
        }
    });
    
    return spacings;
}

const generateDimension = () => {
    const global = readJson(path.join(TOKENS_DIR, 'dimensions/dimension-global.json'));
    const flat = flattenKeys(global);
    const result = {};
    Object.keys(flat).forEach(key => {
       result[key] = `var(--dimension-${key})`;
    });
    return result;
}

const generateFontSize = () => {
    const brandFontSizes = readJson(path.join(TOKENS_DIR, 'dimensions/fontSize-brand.json'));
    const flatBrand = flattenKeys(brandFontSizes);
    const result = {};
    Object.keys(flatBrand).forEach(key => {
       result[key] = `var(--text-${key})`;
    });
    return result;
}

const generateLineHeight = () => {
    const brandLineHeights = readJson(path.join(TOKENS_DIR, 'dimensions/lineHeight-brand.json'));
    const flatBrand = flattenKeys(brandLineHeights);
    const result = {};
    Object.keys(flatBrand).forEach(key => {
       result[key] = `var(--leading-${key})`;
    });
    return result;
}

const generateRadius = () => {
    const brandRadii = readJson(path.join(TOKENS_DIR, 'dimensions/radius-brand.json'));
    const flatBrand = flattenKeys(brandRadii);
    const result = {};
    Object.keys(flatBrand).forEach(key => {
       result[key] = `var(--rounded-${key})`;
    });
    return result;
}


export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: generateColorTheme(),
      spacing: generateSpacing(),
      dimension: generateDimension(),
      fontSize: generateFontSize(),
      lineHeight: generateLineHeight(),
      borderRadius: generateRadius(),
    },
  },
  plugins: [],
}
