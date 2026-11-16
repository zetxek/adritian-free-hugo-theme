/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2024 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
    'use strict'

    console.log('Dark mode toggle script loaded')
  
    const getStoredTheme = () => localStorage.getItem('theme')
    const setStoredTheme = theme => localStorage.setItem('theme', theme)
  
    const getPreferredTheme = () => {
      const storedTheme = getStoredTheme()
      if (storedTheme) {
        return storedTheme
      }
  
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  
    function setTheme(theme) {
      // Apply a transition class before changing theme
      document.documentElement.classList.add('theme-transition');
      
      // Set the new theme
      if (theme === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
        // Store the actual value for smoother transitions
        document.documentElement.setAttribute('data-theme-auto', 'true');
      } else {
        document.documentElement.setAttribute('data-bs-theme', theme);
        document.documentElement.removeAttribute('data-theme-auto');
      }
      
      // Remove the transition class after a short delay
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
      }, 300);
    }
  
    // Apply theme immediately to prevent flash
    setTheme(getPreferredTheme())
  
    const showActiveTheme = (theme, focus = false) => {
      const themeSwitcher = document.querySelectorAll('.bd-theme-selector')
  
      if (!themeSwitcher) {
        return
      }
  
      const themeSwitcherText = document.querySelectorAll('.bd-theme-text')
      const activeTheme = document.querySelectorAll('.current-theme')
      const btnToActive = document.querySelectorAll(`[data-bs-theme-value="${theme}"]`)
      //const iconOfActiveBtn = btnToActive.querySelector('span.theme-icon')

  
      document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
        element.classList.remove('active')
        element.setAttribute('aria-pressed', 'false')
      })
      for (const element of btnToActive){
        element.setAttribute('aria-pressed', 'true')
      }
      for (const element of activeTheme) {
        element.textContent = btnToActive[0].textContent
      }
      const visibleLabel = (activeTheme[0]?.textContent ?? '').trim()
      const helperText = (themeSwitcherText[0]?.textContent ?? '').trim()
      const themeSwitcherLabel = helperText ? `${visibleLabel} — ${helperText}` : visibleLabel
      for (const element of themeSwitcher) {
        element.setAttribute('aria-label', themeSwitcherLabel)
      }
    }
  
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      const storedTheme = getStoredTheme()
      if (storedTheme === 'auto' || (!storedTheme && document.documentElement.getAttribute('data-theme-auto') === 'true')) {
        setTheme('auto')
      }
    })
  
    window.addEventListener('DOMContentLoaded', () => {
      showActiveTheme(getPreferredTheme())
  
      document.querySelectorAll('[data-bs-theme-value]')
        .forEach(toggle => {
          toggle.addEventListener('click', () => {
            const theme = toggle.getAttribute('data-bs-theme-value')
            setStoredTheme(theme)
            setTheme(theme)
            showActiveTheme(theme, true)
          })
        })
    })
  })()