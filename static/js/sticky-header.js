class StickyHeader {
  constructor(t) {
    (this.header = t),
      (this.body = document.querySelector("body")),
      (this.thresholdPosition = 15),
      (this.triggeredStickyClass = "header--sticky-triggered"),
      (this.stickyClass = "header--sticky"),
      (this.ticking = false),
      (this.bodyPosition = 0),
      window.addEventListener("DOMContentLoaded", () => this.initSticky()),
      this.scrollChanged();
      this.navbar = document.getElementById('navbarSupportedContent');
      // add window resize listener
      window.addEventListener("resize", () => this.resizeHandler());
  }
  initSticky() {
    (this.headerStaticHeight = this.header.getBoundingClientRect().height),
      this.header.classList.toggle(this.stickyClass, true),
      window.addEventListener("scroll", () => this.scrollHandler());
      
  }
  scrollHandler() {
    this.ticking ||
      (window.requestAnimationFrame(() => {
        this.scrollChanged(), (this.ticking = false);
      }),
      (this.ticking = true));
  }
  scrollChanged() {
    (this.bodyPosition = Math.abs(this.body.getBoundingClientRect().top)),
      this.bodyPosition > this.thresholdPosition
        ? this.header.classList.toggle(this.triggeredStickyClass, true)
        : this.header.classList.toggle(this.triggeredStickyClass, false);
  }
  resizeHandler() {
    // if the window size is larger than 992px and the navbar is displayed,
    // toggle the navbar to hide it
    if (window.innerWidth > 991) {
        if (this.navbar?.classList.contains('show')) {
            simulateClick(document.querySelector('.navbar-toggler'));
        }
      }
  }
}
const stickyHeader = new StickyHeader(document.querySelector(".header"));
