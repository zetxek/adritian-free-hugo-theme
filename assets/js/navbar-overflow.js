/*!
 * Navbar Overflow Handler for Adritian theme
 * Automatically moves overflowing nav items and selectors to a "More" dropdown.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'navbarOverflow';
  var MORE_DROPDOWN_ID = 'navbar-more-dropdown';
  var MORE_BUTTON_ID = 'navbar-more-button';
  var RESIZE_DEBOUNCE_MS = 100;

  var moreDropdown = null;
  var moreButton = null;
  var navbarNav = null;
  var navbarBrand = null;
  var navbarToggler = null;
  var resizeTimeout = null;
  var overflowMode = 'dropdown';
  // Tracks <li> dropdown items moved (not cloned) into the More dropdown so
  // resetAllItems can return them to their original <ul.dropdown-menu>. Moving
  // preserves the click handlers bound directly by color-scheme-switcher.js,
  // color-modes.js, etc. — cloning would silently break them.
  var movedDropdownItems = [];

  function init() {
    // Determine overflow mode from script tag data attribute
    var scriptTag = document.currentScript || document.querySelector('script[src*="navbar-overflow.js"]');
    if (scriptTag && scriptTag.getAttribute('data-navbar-overflow-mode')) {
      overflowMode = scriptTag.getAttribute('data-navbar-overflow-mode');
    }

    // Allow test override
    if (window.__TEST_OVERFLOW_MODE) {
      overflowMode = window.__TEST_OVERFLOW_MODE;
    }

    navbarNav = document.querySelector('.header .navbar-nav');
    if (!navbarNav) return;

    navbarBrand = document.querySelector('.navbar-brand');
    navbarToggler = document.querySelector('.navbar-toggler');

    // Create More dropdown if it doesn't exist and mode is dropdown
    if (overflowMode === 'dropdown') {
      createMoreDropdown();
    }

    // Check for debug mode via URL parameter
    var urlParams = new URLSearchParams(window.location.search);
    var debugOverflow = urlParams.get('debug-overflow');

    // Handle overflow on load (after a short delay to ensure DOM is fully rendered)
    setTimeout(handleOverflow, 50);

    // Handle overflow on resize (debounced)
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleOverflow, RESIZE_DEBOUNCE_MS);
    });

    // Handle overflow when dropdowns are opened/closed
    document.addEventListener('shown.bs.dropdown', handleOverflow);
    document.addEventListener('hidden.bs.dropdown', handleOverflow);

    // Debug mode: log overflow status
    if (debugOverflow === 'true') {
      setInterval(function () {
        var moreItem = document.getElementById('navbar-more-item');
        console.log('Overflow debug - More visible:', moreItem ? moreItem.style.display !== 'none' : 'N/A', 'Window width:', window.innerWidth);
      }, 2000);
    }
  }

  function createMoreDropdown() {
    // Check if More dropdown already exists
    moreDropdown = document.getElementById(MORE_DROPDOWN_ID);
    moreButton = document.getElementById(MORE_BUTTON_ID);

    if (moreDropdown && moreButton) return;

    // Create the More dropdown structure
    var moreLi = document.createElement('li');
    moreLi.className = 'dropdown nav-item more-dropdown';
    moreLi.id = 'navbar-more-item';

    moreButton = document.createElement('button');
    moreButton.id = MORE_BUTTON_ID;
    moreButton.className = 'btn btn-link py-2 px-0 px-lg-2 dropdown-toggle d-flex align-items-center';
    moreButton.type = 'button';
    moreButton.setAttribute('data-bs-toggle', 'dropdown');
    moreButton.setAttribute('data-bs-auto-close', 'outside');
    moreButton.setAttribute('aria-expanded', 'false');
    moreButton.setAttribute('aria-haspopup', 'true');
    moreButton.textContent = 'More';

    moreDropdown = document.createElement('ul');
    moreDropdown.id = MORE_DROPDOWN_ID;
    moreDropdown.className = 'dropdown-menu dropdown-menu-end';
    moreDropdown.setAttribute('aria-labelledby', MORE_BUTTON_ID);

    moreLi.appendChild(moreButton);
    moreLi.appendChild(moreDropdown);

    // Add to navbar nav
    navbarNav.appendChild(moreLi);
  }

  function handleOverflow() {
    if (!navbarNav) return;

    // Reset all items first
    resetAllItems();

    // On mobile, don't use overflow - items are in collapse menu
    if (window.innerWidth < 992) {
      var moreItem = document.getElementById('navbar-more-item');
      if (moreItem) {
        moreItem.style.display = 'none';
      }
      return;
    }

    // Re-select navbarNav after reset in case DOM was modified
    navbarNav = document.querySelector('.header .navbar-nav');
    if (!navbarNav) return;

    // Calculate available space
    // The navbar-collapse container width is the actual available space for items
    var navbarCollapse = document.getElementById('navbarSupportedContent');
    if (!navbarCollapse) return;

    // Buffer reserves room for the More button (dropdown mode) or trailing spacing.
    // Measure the actual rendered button so localized labels don't clip.
    var buffer = 20;
    if (overflowMode === 'dropdown') {
      var moreItemEl = document.getElementById('navbar-more-item');
      if (moreItemEl) {
        var prevDisplay = moreItemEl.style.display;
        moreItemEl.style.display = 'list-item';
        var measured = moreItemEl.getBoundingClientRect().width;
        moreItemEl.style.display = prevDisplay;
        buffer = measured > 0 ? Math.ceil(measured) + 8 : 120;
      } else {
        buffer = 120;
      }
    }
    var availableWidth = navbarCollapse.offsetWidth - buffer;


    // Check for debug mode via URL parameter
    var urlParams = new URLSearchParams(window.location.search);
    var forceOverflow = urlParams.get('force-overflow') === 'true';

    // Measure all items
    var items = Array.from(navbarNav.children).filter(function (item) {
      // Exclude the More dropdown itself and any hidden items
      return !item.classList.contains('more-dropdown');
    });

    var totalWidth = 0;
    var overflowItems = [];

    // First measure the total width of all items
    items.forEach(function (item) {
      // Add the full width of the item including margins (approx)
      totalWidth += item.getBoundingClientRect().width;
      
      if (totalWidth > availableWidth || forceOverflow) {
        overflowItems.push(item);
      }
    });

    // If force-overflow is true but no items overflowed naturally,
    // move the last item to overflow to demonstrate the feature
    if (forceOverflow && overflowItems.length === 0 && items.length > 0) {
      overflowItems.push(items[items.length - 1]);
    }

    // Move overflow items to destination
    if (overflowItems.length > 0) {
      if (overflowMode === 'dropdown') {
        // Show More button
        var moreItem = document.getElementById('navbar-more-item');
        if (moreItem) {
          moreItem.style.display = 'list-item';
        }

        // Move items to More dropdown
        overflowItems.forEach(function (item) {
          moveItemToMore(item);
        });
      } else if (overflowMode === 'footer') {
        overflowItems.forEach(function (item) {
          moveItemToFooter(item);
        });
      }
    } else {
      if (overflowMode === 'dropdown') {
        // Hide More dropdown if no overflow
        var moreItem = document.getElementById('navbar-more-item');
        if (moreItem) {
          moreItem.style.display = 'none';
        }
      }
    }
  }

  function moveItemToMore(item) {
    if (!moreDropdown) return;

    // Dropdown items (language/theme/scheme selectors) get inlined with a
    // section header. Bootstrap 5 has no native nested-dropdown support, so a
    // nested toggle wouldn't open. We also MOVE the original <li> items rather
    // than cloning so handlers bound directly by color-scheme-switcher.js etc.
    // keep working.
    if (item.classList.contains('dropdown')) {
      var dropdownMenu = item.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        var labelText = getDropdownLabel(item);
        if (labelText) {
          var headerLi = document.createElement('li');
          headerLi.className = 'overflow-section-header';
          var header = document.createElement('h6');
          header.className = 'dropdown-header';
          header.textContent = labelText;
          headerLi.appendChild(header);
          moreDropdown.appendChild(headerLi);
        }

        Array.from(dropdownMenu.children).forEach(function (li) {
          movedDropdownItems.push({ item: li, originalParent: dropdownMenu });
          moreDropdown.appendChild(li);
        });

        item.dataset.inMore = 'true';
        item.style.display = 'none';
        return;
      }
    }

    // Plain nav items: clone the link (it has no JS-bound handlers worth
    // preserving — links navigate via href).
    var link = item.querySelector('a, button');
    if (!link) return;

    var dropdownItem = document.createElement('li');
    var dropdownLink = link.cloneNode(true);

    if (dropdownLink.id) {
      dropdownLink.id = dropdownLink.id + '-more';
    }
    dropdownLink.classList.remove('dropup');
    dropdownLink.classList.remove('dropdown-toggle');
    dropdownLink.removeAttribute('data-bs-toggle');
    dropdownLink.removeAttribute('aria-expanded');
    dropdownLink.removeAttribute('aria-haspopup');

    dropdownItem.appendChild(dropdownLink);

    item.dataset.inMore = 'true';
    moreDropdown.appendChild(dropdownItem);
    item.style.display = 'none';
  }

  function getDropdownLabel(item) {
    var labelEl = item.querySelector('.current-scheme, .current-theme, .label');
    if (labelEl && labelEl.textContent.trim()) {
      return labelEl.textContent.trim();
    }
    var toggle = item.querySelector('.dropdown-toggle, [data-bs-toggle="dropdown"]');
    if (toggle) {
      var aria = toggle.getAttribute('aria-label');
      if (aria) return aria.trim();
      if (toggle.textContent.trim()) return toggle.textContent.trim();
    }
    return '';
  }

  function moveItemToFooter(item) {
    var footerNav = document.querySelector('.footer_links .navbar-nav');
    if (!footerNav) return;

    // Create a copy of the item
    var footerItem = item.cloneNode(true);
    footerItem.classList.add('overflow-footer-item');
    
    // Change IDs so they don't duplicate
    var elementsWithIds = footerItem.querySelectorAll('[id]');
    elementsWithIds.forEach(function(el) { el.id = el.id + '-footer'; });
    if (footerItem.id) {
       footerItem.id = footerItem.id + '-footer';
    }
    var link = footerItem.querySelector('a, button');
    if (link && link.hasAttribute('aria-controls')) {
       link.setAttribute('aria-controls', link.getAttribute('aria-controls') + '-footer');
    }
    
    // Convert dropdown to dropup for footer
    if (footerItem.classList.contains('dropdown')) {
      footerItem.classList.remove('dropdown');
      footerItem.classList.add('dropup');
    }
    
    // Store original item reference
    item.dataset.inFooter = 'true';
    
    footerNav.appendChild(footerItem);

    // Hide original item
    item.style.display = 'none';
  }

  function resetAllItems() {
    // Restore all items that were moved to More or Footer
    var itemsInOverflow = Array.from(navbarNav.children).filter(function (item) {
      return item.dataset.inMore === 'true' || item.dataset.inFooter === 'true';
    });

    itemsInOverflow.forEach(function (item) {
      item.style.display = '';
      delete item.dataset.inMore;
      delete item.dataset.inFooter;
    });

    // Return moved <li> dropdown items to their original parent BEFORE
    // clearing the More dropdown — otherwise we'd destroy elements that still
    // own live event handlers.
    movedDropdownItems.forEach(function (entry) {
      if (entry.originalParent && entry.item) {
        entry.originalParent.appendChild(entry.item);
      }
    });
    movedDropdownItems = [];

    if (moreDropdown) {
      // Clear More dropdown (now contains only headers and clones)
      while (moreDropdown.firstChild) {
        moreDropdown.removeChild(moreDropdown.firstChild);
      }
    }

    var footerNav = document.querySelector('.footer_links .navbar-nav');
    if (footerNav) {
      var footerItems = footerNav.querySelectorAll('.overflow-footer-item');
      footerItems.forEach(function(el) {
        el.remove();
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
