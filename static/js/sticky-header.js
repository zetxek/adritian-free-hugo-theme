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
    console.log('window resized - sticky header. window size = ', window.innerWidth);
    // if the window size is larger than 992px, remove collapse and show classes
    // to show the main content in case that the navigation was triggered
    if (window.innerWidth > 991) {
        this.header.classList.remove('show');
        this.header.classList.remove('collapsed');
      }
  }
}
const stickyHeader = new StickyHeader(document.querySelector(".header"));
