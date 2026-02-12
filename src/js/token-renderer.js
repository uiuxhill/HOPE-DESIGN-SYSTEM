/**
 * Token Renderer — HOPE Design System
 * Parses CSS variables from tokens.css and renders token documentation
 */

/**
 * Parse all CSS custom properties from :root in the first stylesheet
 */
export function getTokens() {
  const tokens = {};

  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.selectorText === ':root') {
          for (let i = 0; i < rule.style.length; i++) {
            const prop = rule.style[i];
            if (prop.startsWith('--')) {
              tokens[prop] = rule.style.getPropertyValue(prop).trim();
            }
          }
        }
      }
    } catch (e) {
      // Skip cross-origin sheets
    }
  }

  return tokens;
}

/**
 * Render global color swatch grids
 */
export function buildGlobalColors() {
  const tokens = getTokens();
  const groups = {};

  Object.entries(tokens).forEach(([name, value]) => {
    if (!name.startsWith('--color-') || name.includes('text') || name.includes('icon') ||
        name.includes('link') || name.includes('border') || name.includes('elevation') ||
        name.includes('background') || name.includes('Alpha')) return;

    const match = name.match(/^--color-([a-zA-Z]+)-(\d+)$/);
    if (!match) return;

    const [, group, step] = match;
    if (!groups[group]) groups[group] = [];
    groups[group].push({ name, value, step });
  });

  const container = document.getElementById('global-colors-container');
  let html = '';

  Object.entries(groups).forEach(([group, swatches]) => {
    swatches.sort((a, b) => parseInt(a.step) - parseInt(b.step));
    html += `<div class="card">
      <div class="card-title" style="text-transform:capitalize">${group}</div>
      <div class="swatch-grid">`;

    swatches.forEach(s => {
      html += `<div class="swatch">
        <div class="swatch-color" style="background:${s.value}"></div>
        <div class="swatch-info">
          <div class="swatch-name">${s.step}</div>
          <div class="swatch-value">${s.value}</div>
        </div>
      </div>`;
    });

    html += '</div></div>';
  });

  container.innerHTML = html;
}

/**
 * Render brand color tables (text, icon, border, background, elevation)
 */
export function buildBrandColors() {
  const tokens = getTokens();

  const categories = {
    text:      { container: 'brand-text-container',      prefix: '--color-text-' },
    icon:      { container: 'brand-icon-container',      prefix: '--color-icon-' },
    border:    { container: 'brand-border-container',    prefix: '--color-border-' },
    bg:        { container: 'brand-bg-container',        prefix: '--color-background-' },
    elevation: { container: 'brand-elevation-container', prefix: '--color-elevation-' }
  };

  Object.entries(categories).forEach(([key, { container, prefix }]) => {
    const matching = Object.entries(tokens).filter(([name]) => name.startsWith(prefix));
    const el = document.getElementById(container);

    let html = `<div class="card">
      <table class="token-table">
        <thead><tr><th>Preview</th><th>Token</th><th>Value</th></tr></thead>
        <tbody>`;

    matching.forEach(([name, value]) => {
      const preview = `<span class="token-preview token-preview--color" style="background:${value}"></span>`;
      html += `<tr>
        <td>${preview}</td>
        <td class="token-name">${name}</td>
        <td class="token-value">${value}</td>
      </tr>`;
    });

    html += '</tbody></table></div>';
    el.innerHTML = html;
  });
}

/**
 * Render spacing tables (global, padding, margin)
 */
export function buildSpacing() {
  const tokens = getTokens();

  const renderTable = (entries, containerId) => {
    let html = `<div class="card">
      <table class="token-table">
        <thead><tr><th>Preview</th><th>Token</th><th>Value</th></tr></thead>
        <tbody>`;

    entries.forEach(([name, value]) => {
      const px = parseInt(value) || 0;
      html += `<tr>
        <td><span class="token-preview token-preview--spacing" style="width:${Math.min(px, 200)}px"></span></td>
        <td class="token-name">${name}</td>
        <td class="token-value">${value}</td>
      </tr>`;
    });

    html += '</tbody></table></div>';
    document.getElementById(containerId).innerHTML = html;
  };

  // Global spacing
  const spacingGlobal = Object.entries(tokens)
    .filter(([name]) => name.startsWith('--spacing-'))
    .sort((a, b) => parseInt(a[1]) - parseInt(b[1]));
  renderTable(spacingGlobal, 'spacing-global-container');

  // Brand padding
  const padding = Object.entries(tokens)
    .filter(([name]) => name.startsWith('--p-'))
    .sort((a, b) => parseInt(a[1]) - parseInt(b[1]));
  renderTable(padding, 'spacing-padding-container');

  // Brand margin
  const margin = Object.entries(tokens)
    .filter(([name]) => name.startsWith('--m-'))
    .sort((a, b) => parseInt(a[1]) - parseInt(b[1]));
  renderTable(margin, 'spacing-margin-container');
}

/**
 * Render dimension tables (font size, line height, border radius)
 */
export function buildDimensions() {
  const tokens = getTokens();

  // Font sizes
  const fonts = Object.entries(tokens).filter(([n]) => n.startsWith('--text-'));
  let html = `<div class="card"><table class="token-table">
    <thead><tr><th>Preview</th><th>Token</th><th>Value</th></tr></thead><tbody>`;
  fonts.forEach(([name, value]) => {
    html += `<tr>
      <td><span class="token-preview token-preview--text" style="font-size:${value}; line-height:1.2">Aa</span></td>
      <td class="token-name">${name}</td>
      <td class="token-value">${value}</td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  document.getElementById('dim-font-container').innerHTML = html;

  // Line heights
  const leadings = Object.entries(tokens).filter(([n]) => n.startsWith('--leading-'));
  html = `<div class="card"><table class="token-table">
    <thead><tr><th>Preview</th><th>Token</th><th>Value</th></tr></thead><tbody>`;
  leadings.forEach(([name, value]) => {
    const px = parseInt(value) || 0;
    html += `<tr>
      <td><span class="token-preview token-preview--spacing" style="width:${Math.min(px * 2, 120)}px"></span></td>
      <td class="token-name">${name}</td>
      <td class="token-value">${value}</td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  document.getElementById('dim-leading-container').innerHTML = html;

  // Border radius
  const radii = Object.entries(tokens).filter(([n]) => n.startsWith('--rounded-'));
  html = `<div class="card"><table class="token-table">
    <thead><tr><th>Preview</th><th>Token</th><th>Value</th></tr></thead><tbody>`;
  radii.forEach(([name, value]) => {
    html += `<tr>
      <td><span class="token-preview token-preview--radius" style="border-radius:${value}"></span></td>
      <td class="token-name">${name}</td>
      <td class="token-value">${value}</td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  document.getElementById('dim-radius-container').innerHTML = html;
}

/**
 * Render typography samples (headings + body)
 */
export function buildTypography() {
  const tokens = getTokens();

  const renderTypeScale = (entries, containerId) => {
    let html = '';
    entries.forEach(([name, value]) => {
      html += `<div style="margin-bottom:20px; border-bottom:1px solid var(--color-border-neutral); padding-bottom:16px">
        <div style="font:${value}; margin-bottom:8px">The quick brown fox jumps over the lazy dog</div>
        <div style="display:flex; gap:16px; align-items:center">
          <span class="token-name">${name}</span>
          <span class="token-value">${value}</span>
        </div>
      </div>`;
    });
    document.getElementById(containerId).innerHTML = html;
  };

  const headings = Object.entries(tokens).filter(([n]) => n.startsWith('--heading-'));
  const bodies = Object.entries(tokens).filter(([n]) => n.startsWith('--body-'));

  renderTypeScale(headings, 'typo-headings');
  renderTypeScale(bodies, 'typo-body');
}
