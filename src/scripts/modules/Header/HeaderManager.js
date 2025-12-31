/**
 * HeaderManager — Manages the sticky behavior of the header on scroll and resize.
 */

class HeaderManager {
  constructor (utils, eventBus) {
    this.utils = utils; // Utility functions
    this.eventBus = eventBus; // Event bus for handling events

    // Get avatars and header elements using UIMap selectors
    this.avatars = document.querySelector(this.utils.getSelector('avatars'));
    this.header = document.querySelector(this.utils.getSelector('avatarsHeader'));

    this.breakpoint = 800; // Sticky header activation breakpoint

    this.initHandlers(); // Initialize event handlers
  }

  /**
   * Initializes event handlers for scroll, resize, and export events.
   * @returns {void}
   */
  initHandlers () {
    this.eventBus.on({
      'evt:exportHtmlInitiate': this.removeHeaderSticky.bind(this),
      'evt:exportHtmlComplete': this.setHeaderSticky.bind(this)
    });

    window.addEventListener('scroll', this.utils.debounce(this.setHeaderSticky.bind(this), 10));
    window.addEventListener('resize', this.utils.debounce(this.toggleHeaderSticky.bind(this), 10));
  }

  /**
   * Sets the sticky state of the header based on scroll position.
   * Updates body padding top on window resize.
   * @returns {void}
   */
  setHeaderSticky () {
    if (window.innerWidth > this.breakpoint) {
      const headerOffsetTop = this.header.offsetTop;
      const headerHeight = this.header.offsetHeight;
      const scrollPosition = window.scrollY || window.pageYOffset;
      if (scrollPosition > headerOffsetTop) {
        this.utils.addState(this.header, 'sticky');
        this.avatars.style.paddingTop = `${headerHeight}px`;
      } else {
        this.utils.removeState(this.header, 'sticky');
        this.avatars.style.paddingTop = '';
      }
    }
  }

  /**
   * Removes the sticky state and resets body padding.
   * @returns {void}
   */
  removeHeaderSticky () {
    this.header && this.utils.removeState(this.header, 'sticky');
    this.avatars.style.paddingTop = '';
    this.avatars.removeAttribute('style');
  }

  /**
   * Toggles the sticky state of the header based on screen size.
   * @returns {void}
   */
  toggleHeaderSticky () {
    if (window.innerWidth > this.breakpoint) {
      this.setHeaderSticky();
    } else {
      this.removeHeaderSticky();
    }
  }
}

export default HeaderManager;
