(function() {
  'use strict';

  var overlay, img, closeBtn;

  function create() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
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
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
  }

  // Attach to blog post and portfolio images
  document.addEventListener('DOMContentLoaded', function() {
    var selectors = '.post-content img, .projects img, .showcase img';
    document.querySelectorAll(selectors).forEach(function(el) {
      if (el.closest('a')) return; // skip images already wrapped in links
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', function() {
        open(el.src, el.alt);
      });
    });
  });
})();
