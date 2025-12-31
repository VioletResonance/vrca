/**
 * UnloadManager — Manages dirty state (unsaved changes) and intercepts unload events.
 * Prompts user with a confirmation dialog if there are unsaved changes.
 */

class UnloadManager {
  constructor (eventBus) {
    this.eventBus = eventBus; // Event bus for handling events
    this.isDirty = false; // Tracks whether there are unsaved changes

    this.initHandlers(); // Initialize event handlers
  }

  /**
   * Initializes event handlers for dirty state and unload events.
   * @returns {void}
   */
  initHandlers () {
    this.eventBus.on([
      'evt:addAvatarComplete',
      'evt:editAvatarComplete',
      'evt:deleteAvatarComplete',
      'evt:confirmAvatarsGroupComplete',
      'evt:deleteAvatarsGroupComplete',
      'evt:sortAvatarsComplete',
      'evt:sortGroupsComplete',
      'evt:importDataComplete'
    ], this.setDirtyState.bind(this));

    this.eventBus.on('evt:exportHtmlComplete', this.clearDirtyState.bind(this));

    window.addEventListener('beforeunload', this.processUnloadRequest.bind(this));
  }

  /**
   * Marks the document as "dirty" (unsaved changes).
   * @returns {void}
   */
  setDirtyState () {
    this.isDirty = true;
  }

  /**
   * Clears the "dirty" state (marks document as saved).
   * @returns {void}
   */
  clearDirtyState () {
    this.isDirty = false;
  }

  /**
   * Intercepts the browser's unload event to prompt the user about unsaved changes.
   * @param {BeforeUnloadEvent} event - Native browser unload event.
   * @returns {string} An empty string to trigger the browser's default unload confirmation behavior.
   */
  processUnloadRequest (event) {
    if (this.isDirty) {
      event.preventDefault();
      event.returnValue = '';
      return '';
    }
  }
}

export default UnloadManager;
