/*!
 * Color Scheme Switcher for Adritian theme
 * Enables runtime switching between named color schemes.
 * Only loaded when params.colorSchemeSwitcher.enable is true.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'colorScheme';

  function getStoredScheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredScheme(name) {
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch (e) {
      // Ignore errors (e.g. private browsing mode)
    }
  }

  function setColorScheme(name) {
    // Disable all scheme override stylesheets
    var found = false;
    document.querySelectorAll('link[data-color-scheme]').forEach(function (link) {
      if (link.getAttribute('data-color-scheme') === name) {
        link.disabled = false;
        found = true;
      } else {
        link.disabled = true;
      }
    });

    // Fall back to 'default' if the name is unknown
    // (e.g. a stale value from a previous theme version stored in localStorage)
    if (!found && name !== 'default') {
      name = 'default';
      document.querySelectorAll('link[data-color-scheme="default"]').forEach(function(link) {
        link.disabled = false;
      });
      setStoredScheme(name);
    }

    // Set attribute on html for any additional CSS hooks
    document.documentElement.setAttribute('data-color-scheme', name);
    setStoredScheme(name);

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
