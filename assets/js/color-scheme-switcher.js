/*!
 * Color Scheme Switcher for Adritian theme
 * Enables runtime switching between named color schemes.
 * Only loaded when params.colorSchemeSwitcher.enable is true.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'colorScheme';

  function getStoredScheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function setColorScheme(name) {
    // Disable all scheme override stylesheets
    document.querySelectorAll('link[data-color-scheme]').forEach(function (link) {
      link.disabled = true;
    });
    // Enable the selected one
    var target = document.querySelector('link[data-color-scheme="' + name + '"]');
    if (target) {
      target.disabled = false;
    }
    // Set attribute on html for any additional CSS hooks
    document.documentElement.setAttribute('data-color-scheme', name);
    localStorage.setItem(STORAGE_KEY, name);

    // Update switcher UI
    document.querySelectorAll('[data-scheme-value]').forEach(function (btn) {
      var isActive = btn.getAttribute('data-scheme-value') === name;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  // Restore scheme on page load
  var stored = getStoredScheme();
  if (stored) {
    setColorScheme(stored);
  }

  // Bind click handlers
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-scheme-value]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setColorScheme(btn.getAttribute('data-scheme-value'));
      });
    });

    // Mark the active scheme button
    var current = getStoredScheme() || document.documentElement.getAttribute('data-color-scheme') || 'default';
    document.querySelectorAll('[data-scheme-value]').forEach(function (btn) {
      var isActive = btn.getAttribute('data-scheme-value') === current;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  });

  // Expose globally for programmatic use
  window.setColorScheme = setColorScheme;
})();
