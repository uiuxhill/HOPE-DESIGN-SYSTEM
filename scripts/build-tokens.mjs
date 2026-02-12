import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TOKENS_DIR = path.join(ROOT, 'tokens');
const OUTPUT_CSS = path.join(ROOT, 'src/styles/tokens.css');

// Helper to read JSON
const readJson = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e);
    return {};
  }
};

// Start: Load all tokens
const tokens = {
  colors: {
    global: readJson(path.join(TOKENS_DIR, 'colors/color-global.json')),
    brandLight: readJson(path.join(TOKENS_DIR, 'colors/color-brand-light.json')),
    brandDark: readJson(path.join(TOKENS_DIR, 'colors/color-brand-dark.json')),
  },
  dimensions: {
    global: readJson(path.join(TOKENS_DIR, 'dimensions/dimension-global.json')),
    fontSizeBrand: readJson(path.join(TOKENS_DIR, 'dimensions/fontSize-brand.json')),
    lineHeightBrand: readJson(path.join(TOKENS_DIR, 'dimensions/lineHeight-brand.json')),
    radiusBrand: readJson(path.join(TOKENS_DIR, 'dimensions/radius-brand.json')),
  },
  spacings: {
    global: readJson(path.join(TOKENS_DIR, 'spacings/spacing-global.json')),
    brand: readJson(path.join(TOKENS_DIR, 'spacings/spacing-brand.json')),
  },
  typography: {
    brand: readJson(path.join(TOKENS_DIR, 'typography/typography-brand.json')),
  }
};

// Resolver state
// We need a lookup map to resolve {ref} -> value
const lookup = new Map();

// Flatten helper: prefix keys with hyphen, build lookup map
// path: array of keys leading here
function flattenAndRegister(obj, prefix = '', registryPrefix = '') {
  let flattened = {};

  for (const [key, val] of Object.entries(obj)) {
    // Skip metadata keys like "type": "color"
    if (key === 'type' && typeof val === 'string') continue;

    const newKey = prefix ? `${prefix}-${key}` : key;
    // Registry key generally follows dot notation for references: neutral.100 or spacing.space100
    // But referencing depends on how the JSONs structure them.
    // References in JSON are like "{neutral.1000}" or "{space200}"

    // We try to match the reference structure.

    if (val && typeof val === 'object' && 'value' in val) {
      // It's a token node
      flattened[newKey] = val.value;

      // key might be "100" inside "neutral". Registry key: "neutral.100"
      const regKey = registryPrefix ? `${registryPrefix}.${key}` : key;
      lookup.set(regKey, val.value);
      lookup.set(`{${regKey}}`, val.value); // Store with braces too for easy lookup
    } else if (val && typeof val === 'object') {
      // Recurse
      const nextRegistryPrefix = registryPrefix ? `${registryPrefix}.${key}` : key;
      const children = flattenAndRegister(val, newKey, nextRegistryPrefix);
      Object.assign(flattened, children);
    }
  }
  return flattened;
}

// 1. Register Globals first
// Colors
const globalColors = flattenAndRegister(tokens.colors.global);
// Spacings Global
// spacing-global.json structure: { "0": { value: "0px" }, "025": { value: "2px" } }
// Token names are now numeric strings like "0", "025", "100", etc.
const globalSpacings = flattenAndRegister(tokens.spacings.global);

// Dimensions Global (single source for text, leading, rounded)
const globalDimensions = flattenAndRegister(tokens.dimensions.global);

// Brand Dimensions (registered after globals so {ref} can resolve)
// Use namespaced registry prefixes to avoid overwriting dimension-global keys
const brandFontSizes = flattenAndRegister(tokens.dimensions.fontSizeBrand, '', 'fontSize.brand');
const brandLineHeights = flattenAndRegister(tokens.dimensions.lineHeightBrand, '', 'lineHeight.brand');
const brandRadius = flattenAndRegister(tokens.dimensions.radiusBrand, '', 'radius.brand');

// 2. Resolve function
function resolve(value) {
  if (typeof value !== 'string') return value;

  // Regex for {ref}
  const refRegex = /\{([^}]+)\}/g;

  // Check if it's a direct single reference to avoid "calc" or complex strings first
  // but regex replace is robust enough.

  // We need to support reference chains.
  let current = value;
  let hasReplaced = true;
  let loops = 0;

  while (hasReplaced && loops < 10) {
    hasReplaced = false;
    current = current.replace(refRegex, (match, key) => {
      // Try to find key in lookup
      // Lookup keys are "neutral.100", "space200"
      if (lookup.has(key)) {
        hasReplaced = true;
        return lookup.get(key);
      } else {
        console.warn(`Could not resolve reference: ${match}`);
        return match;
      }
    });
    loops++;
  }
  return current;
}

// 3. Process Brand Tokens (resolve against globals)
// We treat Brand tokens as semantic aliases.
// Structure: color-brand-light.json -> { color: { text: { neutral: { value: "{neutral.1000}" } } } }
// flattenAndRegister handles the deep nesting -> "color-text-neutral"
// But wait, the file structure starts with `color` key?
// Let's check `color-brand-light.json` again.
// Yes: { "color": { "text": ... } }
// So flattened keys will be "color-text-neutral".
// We might want to strip the "color-" prefix for the variable name if it's redundant, but "text-neutral" is good.
// Let's keep the full path for uniqueness, or maybe strip top level if generic.
// "color-text-neutral" -> var(--color-text-neutral) sounds correct.

const brandLightRaw = flattenAndRegister(tokens.colors.brandLight);
const brandDarkRaw = flattenAndRegister(tokens.colors.brandDark);

// Spacing Brand
// spacing-brand.json: { "padding": { "p-0": { value: "{space0}" } } }
// We want to extract just the scale.
const spacingBrandRaw = flattenAndRegister(tokens.spacings.brand);

// 4. Generate CSS Variables
let cssContent = `:root {\n`;

// Globals
// Colors
Object.entries(globalColors).forEach(([key, val]) => {
  const resolved = resolve(val);
  cssContent += `  --color-${key}: ${resolved};\n`;
});

// Spacings
Object.entries(globalSpacings).forEach(([key, val]) => {
  const resolved = resolve(val);
  cssContent += `  --spacing-${key}: ${resolved};\n`;
});

// Dimensions (single global scale)
Object.entries(globalDimensions).forEach(([key, val]) => {
  cssContent += `  --dimension-${key}: ${resolve(val)};\n`;
});

// Font Size Brand (semantic aliases: xs, sm, base, etc.)
Object.entries(brandFontSizes).forEach(([key, val]) => {
  cssContent += `  --text-${key}: ${resolve(val)};\n`;
});

// Line Height Brand (semantic aliases: 12–48, percentages)
Object.entries(brandLineHeights).forEach(([key, val]) => {
  cssContent += `  --leading-${key}: ${resolve(val)};\n`;
});

// Radius Brand (semantic aliases: none, xs, sm, etc.)
Object.entries(brandRadius).forEach(([key, val]) => {
  cssContent += `  --rounded-${key}: ${resolve(val)};\n`;
});

// Typography Brand (composite tokens → font shorthand)
// Output: --heading-xxl: 700 36px/36px Roboto;
Object.entries(tokens.typography.brand).forEach(([key, val]) => {
  if (key === 'type') return; // skip metadata
  if (!val || !val.value || typeof val.value !== 'object') return;

  // Convert "heading/xxl" -> "heading-xxl"
  const cssKey = key.replace(/\//g, '-');
  const props = val.value;

  const weight = props.fontWeight ? resolve(props.fontWeight) : '400';
  const size = props.fontSize ? resolve(props.fontSize) : '16px';
  const lh = props.lineHeight ? resolve(props.lineHeight) : 'normal';
  const family = props.fontFamily ? resolve(props.fontFamily) : 'sans-serif';

  // CSS font shorthand: weight size/line-height family
  cssContent += `  --${cssKey}: ${weight} ${size}/${lh} ${family};\n`;
});

// Brand Light
Object.entries(brandLightRaw).forEach(([key, val]) => {
  const resolved = resolve(val);
  cssContent += `  --${key}: ${resolved};\n`;
});

// Brand Spacing Aliases (Unified)
// Keys are "padding-p-4", "margin-m-4" etc.
// We want to extract "4" and create --spacing-4
const processedSpacings = new Set();
Object.entries(spacingBrandRaw).forEach(([key, val]) => {
  const resolved = resolve(val);

  // Try to match "padding-p-(suffix)" or "margin-m-(suffix)"
  const match = key.match(/^(?:padding-p|margin-m)-(.+)$/);
  if (match) {
    const suffix = match[1];

    // We only need to write each suffix once
    if (!processedSpacings.has(suffix)) {
      cssContent += `  --spacing-${suffix}: ${resolved};\n`;
      processedSpacings.add(suffix);
    }
  } else {
    // If it doesn't match standard pattern, just write as is
    cssContent += `  --${key}: ${resolved};\n`;
  }
});

cssContent += `}\n\n`;

// Dark Mode
cssContent += `.dark {\n`;
Object.entries(brandDarkRaw).forEach(([key, val]) => {
  const resolved = resolve(val);
  cssContent += `  --${key}: ${resolved};\n`;
});
cssContent += `}\n`;

// 5. Write Tokens CSS
fs.writeFileSync(OUTPUT_CSS, cssContent);
console.log(`Generated ${OUTPUT_CSS}`);

// 6. Generate Tailwind Config extension object (optional, or just log what needs to be in tailwind.config.js)
// We will simply make the tailwind.config.js read the same JSON or references.
// Actually, generating a mapped object for tailwind.config.js is useful part of this script? 
// No, the prompt says "Write a small Node script ... or inline JS inside tailwind.config".
// I'll stick to just generating CSS here, and make tailwind.config.js read the JSONs similarly to get the keys.
// Wait, if I make tailwind config read JSONs, I duplicate logic.
// Better: Make this script output a json map too? Or just duplicate the "flatten" logic in tailwind.config.js?
// Or, just use the CSS variables we know we generated.
// We know we generated `--color-[key]`.
// So in tailwind config, we can iterate the same keys.

