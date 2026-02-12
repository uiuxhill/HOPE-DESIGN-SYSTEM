import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TOKENS_DIR = path.join(ROOT, 'tokens');
const OUTPUT_DIR = path.join(ROOT, 'figma');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

// ── Helpers ──────────────────────────────────────────────────────────────

const isRef = (v) => typeof v === 'string' && /^\{.+\}$/.test(v);
const stripBraces = (v) => v.slice(1, -1);

/**
 * Normalize a {ref} to avoid double prefix.
 * - "{neutral.100}" + "color"       -> "{color.neutral.100}"
 * - "{color.neutral.100}" + "color" -> "{color.neutral.100}"
 * - "{16}" + "dimension"            -> "{dimension.16}"
 */
const normalizeRef = (refInside, prefix) => {
  const r = String(refInside ?? '').trim();
  if (!r) return `{${prefix}.UNKNOWN}`;
  if (r.startsWith(prefix + '.')) return `{${r}}`;
  return `{${prefix}.${r}}`;
};

/**
 * Parse number smartly:
 * - "16px"   -> 16
 * - "120%"   -> 1.2
 * - "1.5"    -> 1.5
 * - 16       -> 16
 */
const parseNumberSmart = (v) => {
  if (typeof v === 'number') return v;
  if (typeof v !== 'string') {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  }

  const s = v.trim();
  if (!s) return 0;

  if (s.endsWith('%')) {
    const n = parseFloat(s);
    return Number.isFinite(n) ? n / 100 : 0;
  }

  const n = parseFloat(s); // handles "16px" or "16"
  return Number.isFinite(n) ? n : 0;
};

/**
 * Return $extensions only when scopes is an array.
 * Passing null/undefined => omit scopes completely.
 */
const withScopes = (scopes) => {
  if (!Array.isArray(scopes)) return undefined;
  return { 'com.figma.scopes': scopes };
};

/** Convert hex string to Figma color object */
function hexToFigmaColor(hex) {
  const h = String(hex).replace('#', '');
  let r, g, b, a = 1;

  if (h.length === 6) {
    r = parseInt(h.slice(0, 2), 16) / 255;
    g = parseInt(h.slice(2, 4), 16) / 255;
    b = parseInt(h.slice(4, 6), 16) / 255;
  } else if (h.length === 8) {
    r = parseInt(h.slice(0, 2), 16) / 255;
    g = parseInt(h.slice(2, 4), 16) / 255;
    b = parseInt(h.slice(4, 6), 16) / 255;
    a = parseInt(h.slice(6, 8), 16) / 255;
  } else {
    r = 0; g = 0; b = 0; a = 0;
  }

  // Round to 4 decimal places to keep file clean
  const round = (n) => Math.round(n * 10000) / 10000;

  return {
    colorSpace: 'srgb',
    components: [round(r), round(g), round(b)],
    alpha: round(a),
    hex: `#${h.slice(0, 6).toUpperCase()}`,
  };
}

/** Set a value deep inside a nested object via key array */
function setNested(obj, keys, value) {
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!cur[k] || typeof cur[k] !== 'object' || '$value' in cur[k]) cur[k] = {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
}

/** Count leaf tokens (objects with $value) in a nested tree */
function countTokens(obj) {
  let n = 0;
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) n++;
    else if (v && typeof v === 'object') n += countTokens(v);
  }
  return n;
}

/**
 * Build a color token with Figma-compatible value.
 * ✅ Requirement: color tokens should NOT apply to any scope => omit scopes by default.
 */
function makeColorToken(hexOrRef, scopes = null) {
  const ext = withScopes(scopes);

  if (isRef(hexOrRef)) {
    const t = {
      $type: 'color',
      $value: normalizeRef(stripBraces(hexOrRef), 'color'),
    };
    if (ext) t.$extensions = ext;
    return t;
  }

  const v = (hexOrRef === 'transparent')
    ? hexToFigmaColor('#00000000')
    : hexToFigmaColor(hexOrRef);

  const t = { $type: 'color', $value: v };
  if (ext) t.$extensions = ext;
  return t;
}

/**
 * Build a number token.
 * ✅ Requirement: dimension tokens should NOT apply to any scope => omit scopes by default.
 */
function makeNumberToken(value, scopes = null, refPrefix = null) {
  const ext = withScopes(scopes);

  if (isRef(value) && refPrefix) {
    const t = {
      $type: 'number',
      $value: normalizeRef(stripBraces(value), refPrefix),
    };
    if (ext) t.$extensions = ext;
    return t;
  }

  const t = {
    $type: 'number',
    $value: parseNumberSmart(value),
  };
  if (ext) t.$extensions = ext;
  return t;
}

// ── Load source tokens ──────────────────────────────────────────────────

const colorGlobal     = readJson(path.join(TOKENS_DIR, 'colors/color-global.json'));
const colorBrandLight = readJson(path.join(TOKENS_DIR, 'colors/color-brand-light.json'));
const colorBrandDark  = readJson(path.join(TOKENS_DIR, 'colors/color-brand-dark.json'));
const dimensionGlobal = readJson(path.join(TOKENS_DIR, 'dimensions/dimension-global.json'));
const fontSizeBrand   = readJson(path.join(TOKENS_DIR, 'dimensions/fontSize-brand.json'));
const lineHeightBrand = readJson(path.join(TOKENS_DIR, 'dimensions/lineHeight-brand.json'));
const radiusBrand     = readJson(path.join(TOKENS_DIR, 'dimensions/radius-brand.json'));
const spacingGlobal   = readJson(path.join(TOKENS_DIR, 'spacings/spacing-global.json'));
const spacingBrand    = readJson(path.join(TOKENS_DIR, 'spacings/spacing-brand.json'));

// ══════════════════════════════════════════════════════════════════════════
// Build nested Figma DTCG token objects
// ══════════════════════════════════════════════════════════════════════════

const figma = {};

// ─── 1. Color Primitives (global palette) ───────────────────────────────

const colorPaletteNames = Object.keys(colorGlobal).filter(
  k => k !== 'type' && typeof colorGlobal[k] === 'object'
);

for (const palette of colorPaletteNames) {
  const group = colorGlobal[palette];
  for (const [shade, token] of Object.entries(group)) {
    if (shade === 'type') continue;
    setNested(figma, ['color', palette, shade], makeColorToken(token.value, [])); // empty scopes = hidden
  }
}

// ─── 2. Semantic Colors (brand) ─────────────────────────────────────────
// ✅ Mount semantic colors under "color.*" to keep paths consistent (Light/Dark)
// Scopes per semantic category:
//   text              → TEXT_FILL
//   icon              → SHAPE_FILL, FRAME_FILL
//   link              → TEXT_FILL
//   border            → STROKE
//   elevation/surface → SHAPE_FILL, FRAME_FILL
//   elevation/shadow  → EFFECT_COLOR
//   background        → SHAPE_FILL, FRAME_FILL

const SEMANTIC_SCOPES = {
  text:       ['TEXT_FILL'],
  icon:       ['SHAPE_FILL', 'FRAME_FILL'],
  link:       ['TEXT_FILL'],
  border:     ['STROKE'],
  background: ['SHAPE_FILL', 'FRAME_FILL'],
};

const ELEVATION_SCOPES = {
  surface: ['SHAPE_FILL', 'FRAME_FILL'],
  shadow:  ['EFFECT_COLOR'],
};

function buildSemanticColors(brandData, target) {
  (function walk(obj, pathKeys) {
    for (const [key, val] of Object.entries(obj)) {
      if (key === 'type') continue;
      if (val && typeof val === 'object' && 'value' in val) {
        // pathKeys = ['color', 'color', '<category>', '<sub>', ...] — category at [2], sub at [3]
        const category = pathKeys[2];
        const sub = pathKeys[3];
        const scopes = category === 'elevation'
          ? (ELEVATION_SCOPES[sub] ?? null)
          : (SEMANTIC_SCOPES[category] ?? null);
        setNested(target, [...pathKeys, key], makeColorToken(val.value, scopes));
      } else if (val && typeof val === 'object') {
        walk(val, [...pathKeys, key]);
      }
    }
  })(brandData, ['color']);
}

buildSemanticColors(colorBrandLight, figma);

// ─── 3. Dimension Global ───────────────────────────────────────────────
// ✅ No scopes for dimension tokens

for (const [key, token] of Object.entries(dimensionGlobal)) {
  if (key === 'type') continue;
  setNested(figma, ['dimension', key], makeNumberToken(token.value, [])); // empty scopes = hidden
}

// ─── 4. Font Size Brand — aliases → dimension global ───────────────────
// Keep FONT_SIZE scope

for (const [key, token] of Object.entries(fontSizeBrand)) {
  if (key === 'type') continue;
  setNested(
    figma,
    ['fontSize', key],
    makeNumberToken(token.value, ['FONT_SIZE'], 'dimension')
  );
}

// ─── 5. Line Height Brand — aliases → dimension global ─────────────────
// Keep LINE_HEIGHT scope (and % parsing is handled)

for (const [key, token] of Object.entries(lineHeightBrand)) {
  if (key === 'type') continue;
  setNested(
    figma,
    ['lineHeight', key],
    makeNumberToken(token.value, ['LINE_HEIGHT'], 'dimension')
  );
}

// ─── 6. Radius Brand — aliases → dimension global ─────────────────────
// Keep CORNER_RADIUS scope

for (const [key, token] of Object.entries(radiusBrand)) {
  if (key === 'type') continue;
  setNested(
    figma,
    ['radius', key],
    makeNumberToken(token.value, ['CORNER_RADIUS'], 'dimension')
  );
}

// ─── 7. Spacing Global ────────────────────────────────────────────────
// Keep GAP scope

for (const [key, token] of Object.entries(spacingGlobal)) {
  if (key === 'type') continue;
  setNested(figma, ['spacing', key], makeNumberToken(token.value, ['GAP']));
}

// ─── 8. Spacing Brand — aliases → spacing global ──────────────────────
// Keep GAP scope, alias to spacing.*

for (const [key, token] of Object.entries(spacingBrand)) {
  if (key === 'type') continue;
  setNested(
    figma,
    ['spacing', key],
    makeNumberToken(token.value, ['GAP'], 'spacing')
  );
}

// ─── Mode extension ───────────────────────────────────────────────────
figma.$extensions = { 'com.figma.modeName': 'Light' };

// ─── Dark mode (only semantic color overrides) ────────────────────────
const figmaDark = {};
buildSemanticColors(colorBrandDark, figmaDark);
figmaDark.$extensions = { 'com.figma.modeName': 'Dark' };

// ── Write output ────────────────────────────────────────────────────────

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const lightPath = path.join(OUTPUT_DIR, 'hope-tokens.light.json');
const darkPath  = path.join(OUTPUT_DIR, 'hope-tokens.dark.json');

fs.writeFileSync(lightPath, JSON.stringify(figma, null, 2));
fs.writeFileSync(darkPath,  JSON.stringify(figmaDark, null, 2));

console.log(`✅ Generated ${lightPath}`);
console.log(`✅ Generated ${darkPath}`);
console.log(`   Light: ${countTokens(figma)} tokens`);
console.log(`   Dark:  ${countTokens(figmaDark)} tokens`);
