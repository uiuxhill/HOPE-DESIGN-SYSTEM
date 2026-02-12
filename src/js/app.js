/**
 * App Entry Point — HOPE Design System
 * Initializes navigation and renders all token documentation
 */

import { showPage, switchTab, toggleTheme, toggleSidebar } from './navigation.js';
import { buildGlobalColors, buildBrandColors, buildSpacing, buildDimensions, buildTypography } from './token-renderer.js';

// Expose functions to HTML onclick handlers
window.showPage = showPage;
window.switchTab = switchTab;
window.toggleTheme = toggleTheme;
window.toggleSidebar = toggleSidebar;

// Initialize all renderers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  buildGlobalColors();
  buildBrandColors();
  buildSpacing();
  buildDimensions();
  buildTypography();
});
