/**
 * FilterManager — Manages the filters applied to elements on the page.
 */

class FilterManager {
  constructor (uiMap, utils, eventBus) {
    this.uiMap = uiMap; // UI element mappings
    this.utils = utils; // Utility functions
    this.eventBus = eventBus; // Event bus for handling events

    // Get filter elements using UIMap selectors
    this.filter = document.querySelector(this.utils.getSelector('filter'));
    this.options = this.filter.querySelectorAll(this.uiMap.selectors.filterOption);
    this.reset = this.filter.querySelector(this.utils.getSelector('filterActionRoleReset'));

    this.initHandlers(); // Initialize event handlers
  }

  /**
   * Initializes event handlers for filter changes and reset action.
   * @returns {void}
   */
  initHandlers () {
    this.options.forEach((input) => input.addEventListener('change', this.applyFilters.bind(this)));
    this.utils.handleClick('filterActionRoleReset', this.clearFilters.bind(this));
  }

  /**
   * Applies selected filters to avatars, hiding those that don't match.
   * @returns {void}
   */
  applyFilters () {
    const avatars = document.querySelectorAll(this.utils.getSelector('avatar'));
    const activeFilters = Array.from(this.options).filter((input) => input.checked).map((input) => input.name);
    avatars.forEach((avatar) => {
      const matches = this.matchesFilters(avatar, activeFilters);
      this.utils.toggleState(avatar, 'hidden', !matches);
    });
    this.utils.toggleState(this.reset, 'hidden', activeFilters.length === 0);
  }

  /**
   * Clears all filters.
   * @returns {void}
   */
  clearFilters () {
    this.options.forEach((input) => input.checked = false);
    this.applyFilters();
  }

  /**
   * Checks if an avatar matches all selected filters.
   * @param {HTMLElement} avatar - Avatar element to check.
   * @param {Array} filters - Selected filters.
   * @returns {boolean} - True if the avatar matches all filters, else false.
   */
  matchesFilters (avatar, filters) {
    if (filters.length === 0) return true;
    const platforms = Array.from(avatar.querySelectorAll(this.utils.getSelector('avatarPlatform')), (platform) => platform.dataset.name);
    const features = Array.from(avatar.querySelectorAll(this.utils.getSelector('avatarFeature')), (feature) => feature.dataset.name);
    const attributes = [...platforms, ...features];
    return filters.every((filter) =>
      filter === 'unavailable' ? this.utils.hasState(avatar, 'unavailable') : attributes.includes(filter)
    );
  }
}

export default FilterManager;
