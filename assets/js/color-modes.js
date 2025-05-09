/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2024 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
    'use strict'
  
    const THEME_KEY = 'theme';
    const THEME_ATTR = 'data-bs-theme';
    const SELECTOR_THEME = '[data-bs-theme-value]';
    
    const getStoredTheme = () => localStorage.getItem(THEME_KEY);
    const setStoredTheme = theme => localStorage.setItem(THEME_KEY, theme);
  
    const getPreferredTheme = () => {
      const storedTheme = getStoredTheme();
      return storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  
    const setTheme = theme => {
      const themeValue = theme === 'auto' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
      
      document.documentElement.setAttribute(THEME_ATTR, themeValue);
    }
  
    const showActiveTheme = (theme, focus = false) => {
      const themeSwitchers = document.querySelectorAll('.bd-theme-selector');
      if (!themeSwitchers.length) return;
      
      const themeSwitcherTexts = document.querySelectorAll('.bd-theme-text');
      const activeThemes = document.querySelectorAll('.current-theme');
      const btnToActives = document.querySelectorAll(`[data-bs-theme-value="${theme}"]`);
      
      // Reset all buttons
      document.querySelectorAll(SELECTOR_THEME).forEach(element => {
        element.classList.remove('active');
        element.setAttribute('aria-pressed', 'false');
      });
      
      // Set active buttons
      btnToActives.forEach(element => {
        element.classList.add('active');
        element.setAttribute('aria-pressed', 'true');
      });
      
      // Update theme text
      if (btnToActives.length && activeThemes.length) {
        const themeText = btnToActives[0].textContent;
        activeThemes.forEach(element => {
          element.textContent = themeText;
        });
        
        if (themeSwitcherTexts.length) {
          const themeSwitcherLabel = `${themeSwitcherTexts[0].textContent} (${btnToActives[0].dataset.bsThemeValue})`;
          themeSwitchers.forEach(element => {
            element.setAttribute('aria-label', themeSwitcherLabel);
          });
        }
      }
    }
  
    // Initialize theme
    setTheme(getPreferredTheme());
    
    // Handle system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const storedTheme = getStoredTheme();
      if (storedTheme !== 'light' && storedTheme !== 'dark') {
        setTheme(getPreferredTheme());
      }
    });
  
    // Set up event listeners when DOM is ready
    window.addEventListener('DOMContentLoaded', () => {
      showActiveTheme(getPreferredTheme());
  
      document.querySelectorAll(SELECTOR_THEME).forEach(toggle => {
        toggle.addEventListener('click', () => {
          const theme = toggle.getAttribute('data-bs-theme-value');
          setStoredTheme(theme);
          setTheme(theme);
          showActiveTheme(theme, true);
        });
      });
    });
})();