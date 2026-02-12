/**
 * Navigation — HOPE Design System
 * Page routing, tab switching, theme toggle
 */

const PAGE_TITLES = {
  home: 'Home',
  changelog: 'Changelog',
  'colors-global': 'Global Colors',
  'colors-brand': 'Brand Colors',
  spacing: 'Spacing',
  dimensions: 'Dimensions',
  typography: 'Typography',
  button: 'Button'
};

let isDark = false;

/**
 * Navigate to a page by id
 */
export function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  document.getElementById('page-' + pageId).classList.add('active');
  document.querySelector('[data-page="' + pageId + '"]').classList.add('active');

  document.getElementById('topbar-title').textContent = PAGE_TITLES[pageId] || pageId;
  document.getElementById('sidebar').classList.remove('open');
  window.scrollTo(0, 0);
}

/**
 * Switch between tabs within a page
 */
export function switchTab(btn, tabId) {
  const bar = btn.parentElement;
  bar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const parent = bar.parentElement;
  parent.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme() {
  isDark = !isDark;
  document.body.classList.toggle('dark', isDark);
  document.getElementById('theme-icon').textContent = isDark ? '☀' : '☽';
  document.getElementById('theme-label').textContent = isDark ? 'Light' : 'Dark';
}

/**
 * Toggle mobile sidebar
 */
export function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}
