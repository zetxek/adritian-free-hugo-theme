// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Create the overlay element if it doesn't exist
  if (!document.querySelector('.transition-overlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'transition-overlay';
    document.body.appendChild(overlay);
  }

  // Find all internal links
  for (const link of document.querySelectorAll('a')) {
    const href = link.getAttribute('href');

    // Skip if no href
    if (!href) continue;

    // Skip anchor links (both relative #section and absolute with fragments)
    if (href.startsWith('#') ||
        (link.hostname === window.location.hostname &&
         link.pathname === window.location.pathname &&
         link.hash)) {
      continue;
    }

    // Only handle links to the same site that aren't anchor links
    if (link.hostname === window.location.hostname &&
        !link.hasAttribute('target')) {

      link.addEventListener('click', (e) => {
        // Don't handle special clicks (modifier keys)
        if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey) {
          return;
        }

        e.preventDefault();
        const destination = link.href;

        // Skip overlay and delay for users who prefer reduced motion
        if (prefersReducedMotion) {
          window.location.href = destination;
          return;
        }

        // Add active class to trigger the overlay
        document.body.classList.add('transition-active');

        // Navigate after a slight delay
        setTimeout(() => {
          window.location.href = destination;
        }, 300);
      });
    }
  }
});

// If someone navigates back/forward, we need to hide the overlay
window.addEventListener('pageshow', (event) => {
  // This works for both fresh loads and back-forward cache
  if (document.body.classList.contains('transition-active')) {
    document.body.classList.remove('transition-active');
  }
});