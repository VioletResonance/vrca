/**
 * Utils — Provides methods for stripping comments, handling inline styles,
 * and managing CSS states using UIMap mappings, handling click events, optimizing frequent calls
 */

class Utils {
  constructor (config, uiMap) {
    this.config = config; // Application settings
    this.uiMap = uiMap; // UI element mappings
  }

  /**
   * Retrieves CSS selector for an element from UIMap.
   * @param {string} name - Element name.
   * @returns {string} - CSS selector.
   */
  getSelector (name) {
    return this.uiMap.selectors[name] || '.' + this.uiMap.cls[name];
  }

  /**
   * Adds a state class to a DOM element.
   * @param {HTMLElement} element - DOM element.
   * @param {string} state - State name.
   * @returns {void}
   */
  addState (element, state) {
    if (Array.isArray(element)) {
      element.forEach((el) => {
        el.classList.add(this.uiMap.states[state]);
      });
    } else {
      element.classList.add(this.uiMap.states[state]);
    }
  }

  /**
   * Removes a state class from a DOM element.
   * @param {HTMLElement} element - DOM element.
   * @param {string} state - State name.
   * @returns {void}
   */
  removeState (element, state) {
    if (Array.isArray(element)) {
      element.forEach((el) => {
        el.classList.remove(this.uiMap.states[state]);
      });
    } else {
      element.classList.remove(this.uiMap.states[state]);
    }
  }

  /**
   * Toggles a state class based on a condition.
   * @param {HTMLElement} element - DOM element.
   * @param {string} state - State name.
   * @param {boolean} condition - Toggle condition.
   * @returns {void}
   */
  toggleState (element, state, condition) {
    if (Array.isArray(element)) {
      element.forEach((el) => {
        el.classList.toggle(this.uiMap.states[state], condition);
      });
    } else {
      element.classList.toggle(this.uiMap.states[state], condition);
    }
  }

  /**
   * Checks if a DOM element has a specific state class.
   * @param {HTMLElement} element - DOM element.
   * @param {string} name - State name.
   * @returns {boolean} - True if state exists, else false.
   */
  hasState (element, name) {
    if (element) return element.classList.contains(this.uiMap.states[name]);
  }

  /**
   * Parses major version number from semver string.
   * @param {string} version - Semver version string.
   * @returns {number} - Major version number.
   */
  getMajorVersion (version) {
    return parseInt(version.split('.')[0], 10);
  }

  /**
   * Creates an HTML element with specified tag, classes, attributes, and optional text content.
   * @param {string} tag - The tag name of the element (e.g., 'div', 'a', 'p').
   * @param {Array} classNames - Array of class names to be added to the element.
   * @param {object} attributes - Object with key-value pairs for attributes (e.g., { href: 'url', target: '_blank' }).
   * @param {string} textContent - Optional text content for the element.
   * @returns {HTMLElement} - The created HTML element.
   */
  createNode (tag, classNames = [], attributes = {}, textContent = '') {
    const element = document.createElement(tag);
    if (classNames.filter(Boolean).length) element.classList.add(...classNames.filter(Boolean));
    if (textContent) element.textContent = textContent;
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
    return element;
  }

  /**
   * Utility to remove all child elements of a given parent element.
   * @param {HTMLElement|HTMLElement[]} element - The DOM element whose child elements need to be removed.
   */
  clearNode (element) {
    if (Array.isArray(element)) {
      element.forEach((el) => {
        while (el.firstChild) {
          el.removeChild(el.firstChild);
        }
      });
    } else {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  }

  /**
   * Adds a click event listener to a UI element.
   * @param {string|object|Array} element - Element name(s), object of element-handler pairs, or array of elements.
   * @param {function|Array} handler - Event handler or array of handlers.
   * @returns {void}
   */
  handleClick (element, handler) {
    // Handle multiple element-handler pairs
    if (element && typeof element === 'object' && !Array.isArray(element)) {
      Object.entries(element).forEach(([e, h]) => {
        this.handleClick(e, h);
      });
      return;
    }
    // Handle multiple elements
    if (Array.isArray(element)) {
      element.forEach((e) => {
        this.handleClick(e, handler);
      });
      return;
    }
    // Handle multiple handlers for the same element
    if (Array.isArray(handler)) {
      handler.forEach((h) => {
        this.handleClick(element, h);
      });
      return;
    }
    // Event listener for the specified element
    document.addEventListener('click', (event) => {
      if (event.target.closest(this.getSelector(element))) {
        handler(event);
      }
    });
  }

  /**
   * Debouncing function to optimize frequent calls.
   * @param {function} func - The function to debounce.
   * @param {number} delay - Delay in milliseconds.
   * @returns {function} - The debounced function.
   */
  debounce (func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }
}

export default Utils;
