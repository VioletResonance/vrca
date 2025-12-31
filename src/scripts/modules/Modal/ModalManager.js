/**
 * ModalManager — Manages modal dialogs (show/hide).
 */

class ModalManager {
  constructor (utils, eventBus) {
    this.utils = utils; // Utility functions
    this.eventBus = eventBus; // Event bus for handling events

    // Get modal and title elements using UIMap selectors
    this.modal = document.querySelector(this.utils.getSelector('modal'));
    this.title = this.modal.querySelector(this.utils.getSelector('modalTitle'));

    this.isPageScroll = true; // Page scroll state

    this.initHandlers(); // Initialize event handlers
  }

  /**
   * Initializes event handlers for modal show and hide events.
   * @returns {void}
   */
  initHandlers () {
    this.eventBus.on([
      'evt:addAvatarInitiate',
      'evt:editAvatarInitiate'
    ], this.showModal.bind(this));

    this.eventBus.on([
      'evt:confirmFormComplete',
      'evt:cancelFormComplete'
    ], this.hideModal.bind(this));
  }

  /**
   * Shows the modal and sets its title.
   * @param {Event} event - The event object from the user action.
   * @param {string} event.detail.modalTitleText - Title for the modal.
   * @fires evt:showModalComplete - Emits a custom event.
   * @returns {void}
   */
  showModal (event) {
    const { modalTitleText = '' } = event.detail;
    this.isPageScroll = document.body.style.overflow !== 'hidden';
    if (this.isPageScroll) document.body.style.overflow = 'hidden';
    this.title.textContent = modalTitleText;
    this.utils.removeState(this.modal, 'hidden');
    this.eventBus.emit('evt:showModalComplete');
  }

  /**
   * Hides the modal.
   * @fires evt:hideModalComplete - Emits a custom event.
   * @returns {void}
   */
  hideModal () {
    if (this.isPageScroll) document.body.removeAttribute('style');
    this.utils.addState(this.modal, 'hidden');
    this.eventBus.emit('evt:hideModalComplete');
  }
}

export default ModalManager;
