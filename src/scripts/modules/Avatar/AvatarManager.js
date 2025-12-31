/**
 * AvatarManager — Manages avatar actions (add, edit, delete) and interactions with dialogs.
 */

class AvatarManager {
  constructor (utils, eventBus, avatarBuilder, avatarData) {
    this.utils = utils; // Utility functions
    this.eventBus = eventBus; // Event bus for handling events
    this.avatarBuilder = avatarBuilder; // Creates or modifies avatars
    this.avatarData = avatarData; // Extracts data from avatars

    this.initHandlers(); // Initialize event handlers
  }

  /**
   * Initializes event handlers for avatar actions (add, edit, delete).
   * @returns {void}
   */
  initHandlers () {
    this.eventBus.on([
      'evt:confirmFormComplete',
      'evt:confirmDialogComplete'
    ], this.eventBus.context({
      'ctx:avatarAdd': this.confirmAddAvatar.bind(this),
      'ctx:avatarEdit': this.confirmEditAvatar.bind(this),
      'ctx:avatarDelete': this.confirmDeleteAvatar.bind(this)
    }).bind(this));

    this.utils.handleClick({
      'avatarsGroupActionRoleAvatarAdd': this.addAvatar.bind(this),
      'avatarActionRoleEdit': this.editAvatar.bind(this),
      'avatarActionRoleDelete': this.deleteAvatar.bind(this)
    });
  }

  /**
   * Emits event and opens avatar creation modal.
   * @param {Event} event - The event object from the user action.
   * @param {HTMLElement} event.target - Add avatar button.
   * @fires evt:addAvatarInitiate - Emits a custom event.
   * @returns {void}
   */
  addAvatar (event) {
    const grid = event.target.closest(this.utils.getSelector('avatarsGroup')).querySelector(this.utils.getSelector('avatarsGroupGrid'));
    this.eventBus.emit('evt:addAvatarInitiate', {
      modalTitleText: 'Add Avatar',
      context: 'ctx:avatarAdd',
      data: null,
      target: grid
    });
  }

  /**
   * Confirms avatar addition and appends it to the grid.
   * @param {Event} event - The event object from the user action.
   * @param {object} event.detail - Avatar data and target grid element.
   * @param {object} event.detail.data - Avatar data.
   * @param {HTMLElement} event.detail.target - Target grid.
   * @fires evt:addAvatarComplete - Emits a custom event.
   * @returns {void}
   */
  confirmAddAvatar (event) {
    const { data, target: targetGrid } = event.detail;
    const avatar = this.avatarBuilder.createAvatar(data);
    targetGrid.append(avatar);
    this.eventBus.emit('evt:addAvatarComplete');
  }

  /**
   * Emits event and opens avatar editing modal.
   * @param {Event} event - The event object from the user action.
   * @param {HTMLElement} event.target - Edit avatar button.
   * @fires evt:editAvatarInitiate - Emits a custom event.
   * @returns {void}
   */
  editAvatar (event) {
    const avatar = event.target.closest(this.utils.getSelector('avatar'));
    const data = this.avatarData.extractDataFromAvatar(avatar);
    this.eventBus.emit('evt:editAvatarInitiate', {
      modalTitleText: 'Edit Avatar',
      context: 'ctx:avatarEdit',
      data: data,
      target: avatar
    });
  }

  /**
   * Confirms avatar edit and replaces the old avatar with the new one.
   * @param {Event} event - The event object from the user action.
   * @param {object} event.detail - Avatar data and target element.
   * @param {object} event.detail.data - Avatar data.
   * @param {HTMLElement} event.detail.target - Target avatar.
   * @fires evt:editAvatarComplete - Emits a custom event.
   * @returns {void}
   */
  confirmEditAvatar (event) {
    const { data, target: targetAvatar } = event.detail;
    const avatar = this.avatarBuilder.createAvatar(data);
    targetAvatar.replaceWith(avatar);
    this.eventBus.emit('evt:editAvatarComplete');
  }

  /**
   * Emits event opens confirmation dialog for avatar deletion.
   * @param {Event} event - The event object from the user action.
   * @param {HTMLElement} event.target - Delete avatar button.
   * @fires evt:deleteAvatarInitiate - Emits a custom event.
   * @returns {void}
   */
  deleteAvatar (event) {
    const avatar = event.target.closest(this.utils.getSelector('avatar'));
    this.eventBus.emit('evt:deleteAvatarInitiate', {
      type: 'confirm',
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this avatar? This action cannot be undone.',
      context: 'ctx:avatarDelete',
      target: avatar
    });
  }

  /**
   * Confirms avatar deletion and removes it from DOM.
   * @param {Event} event - The event object from the user action.
   * @param {object} event.detail - Avatar data.
   * @param {HTMLElement} event.detail.target - Target avatar.
   * @fires evt:deleteAvatarComplete - Emits a custom event
   * @returns {void}
   */
  confirmDeleteAvatar (event) {
    const { target: targetAvatar } = event.detail;
    targetAvatar.remove();
    this.eventBus.emit('evt:deleteAvatarComplete');
  }
}

export default AvatarManager;
