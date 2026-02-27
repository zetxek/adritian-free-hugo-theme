// Respect prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Show all elements immediately without animation
  Array.from(document.querySelectorAll('.rad-fade-down, .rad-fade-in, .rad-fade-in-long, .rad-scale-down')).forEach(function(el) {
    el.classList.add('rad-animate');
  });
} else {
  const sectionIntersectOptions = { rootMargin: '9999px 0px 100px 0px', threshold: 0.05 };

  const onSectionIntersect = (entry) => {
    let delay = 0;
    animatedNodes.forEach((node) => {
      if (node === entry.target || entry.target.contains(node)) {
        node.style.animationDelay = `${nodeDelayDelta * delay}s`;
        node.classList.add('rad-animate');
        delay++;
      }
    });
  };

  const onSectionIntersectChange = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onSectionIntersect(entry);
      }
    });
  };

  const animationObserver = new IntersectionObserver(onSectionIntersectChange, sectionIntersectOptions);
  const animatedNodes = Array.from(document.querySelectorAll('.rad-fade-down, .rad-fade-in, .rad-fade-in-long, .rad-scale-down'));
  const animatedSections = Array.from(document.querySelectorAll('.rad-animation-group'));
  const nodeDelayDelta = 0.05;

  animatedNodes.forEach((node) => { node.classList.add('rad-waiting'); });
  animatedSections.forEach((section) => { animationObserver.observe(section); });
}
