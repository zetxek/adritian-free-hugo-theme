(function() {
  'use strict';

  var overlay, img, closeBtn, previousFocus, previousOverflow;

  function create() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image viewer');

    closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '\u00D7';

    img = document.createElement('img');
    img.className = 'lightbox-img';
    img.alt = '';

    overlay.appendChild(closeBtn);
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay || e.target === closeBtn) close();
    });
    closeBtn.addEventListener('click', close);
  }

  function open(src, alt) {
    if (!overlay) create();
    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    img.src = src;
    img.alt = alt || '';
    overlay.classList.add('lightbox-active');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    document.addEventListener('keydown', onKey);
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('lightbox-active');
    document.body.style.overflow = previousOverflow || '';
    document.removeEventListener('keydown', onKey);
    if (previousFocus) previousFocus.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
    // Trap focus within the lightbox
    if (e.key === 'Tab') {
      e.preventDefault();
      closeBtn.focus();
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    var selectors = '.post-content img, .client-works-container img';
    document.querySelectorAll(selectors).forEach(function(el) {
      if (el.closest('a')) return;
      el.style.cursor = 'zoom-in';
      el.tabIndex = 0;
      el.setAttribute('role', 'button');
      var altText = el.getAttribute('alt') || '';
      el.setAttribute('aria-label', altText ? 'View image: ' + altText : 'View image in lightbox');

      function activate() {
        var src = el.currentSrc || el.getAttribute('data-src') || el.src;
        open(src, el.alt);
      }
      el.addEventListener('click', activate);
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
    });
  });
})();
