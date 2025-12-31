/**
 * DropdownManager — Manages dropdown visibility within avatar groups.
 */

class DropdownManager {
  constructor (utils, eventBus) {
    this.utils = utils; // Utility functions
    this.eventBus = eventBus; // Event bus for handling events

    this.initHandlers(); // Initialize event handlers
  }

  /**
   * Initializes event handlers for toggling dropdown visibility.
   * @returns {void}
   */
  initHandlers () {
    this.utils.handleClick('avatarsGroupDropdownAction', this.toggleDropdown.bind(this));
  }

  /**
   * Toggles the visibility of the dropdown and adjusts its height for a smooth transition.
   * @param {Event} event - The event object from the user action.
   * @param {HTMLElement} event.target - Toggle dropdown button.
   * @returns {void}
   */
  toggleDropdown (event) {
    const group = event.target.closest(this.utils.getSelector('avatarsGroup'));
    const dropdown = group.querySelector(this.utils.getSelector('avatarsGroupDropdown'));
    const isHidden = this.utils.hasState(dropdown, 'hidden');
    dropdown.style.height = `${dropdown.scrollHeight}px`;
    setTimeout(() => {
      this.utils.toggleState(dropdown, 'hidden', !isHidden);
      this.utils.toggleState(event.target, 'hidden', !isHidden);
    }, 200);
    setTimeout(() => {
      dropdown.removeAttribute('style');
    }, 400);
  }
}

export default DropdownManager;
