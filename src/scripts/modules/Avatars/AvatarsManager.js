/**
 * AvatarsManager — Manages layout actions for groups and avatars: editing, adding, deleting, and transitions.
 */

class AvatarsManager {
  constructor (utils, eventBus, avatarsBuilder) {
    this.utils = utils; // Utility functions
    this.eventBus = eventBus; // Event bus for handling events
    this.avatarsBuilder = avatarsBuilder; // Creates and modifies groups, reorders avatars and grops

    this.sortableAvatarInstances = []; // Track sortable instances for avatars
    this.sortableGroupInstance = null; // Track sortable instance for groups

    this.initHandlers(); // Initialize event handlers
  }

  /**
   * Initializes event handlers for group and layout actions.
   * @returns {void}
   */
  initHandlers () {
    this.eventBus.on(
      'evt:confirmDialogComplete',
      this.eventBus.context({
        'ctx:groupDelete': this.confirmDeleteGroup.bind(this)
      }).bind(this)
    );

    this.utils.handleClick({
      'avatarsHeaderActionRoleEdit': this.enterEditMode.bind(this),
      'avatarsHeaderActionRoleConfirm': this.exitEditMode.bind(this),
      'avatarsGroupActionRoleAdd': this.addGroup.bind(this),
      'avatarsGroupActionRoleEdit': this.editGroup.bind(this),
      'avatarsGroupActionRoleConfirm': this.confirmGroup.bind(this),
      'avatarsGroupActionRoleDelete': this.deleteGroup.bind(this)
    });

    document.addEventListener('DOMContentLoaded', this.avatarsBuilder.setVersion());
  }

  /**
   * Enters edit mode to allow layout editing.
   * @returns {void}
   */
  enterEditMode () {
    this.avatarsBuilder.toggleEditMode('enter');
  }

  /**
   * Exits edit mode and disables layout editing.
   * @returns {void}
   */
  exitEditMode () {
    this.avatarsBuilder.toggleEditMode('exit');
  }

  /**
   * Adds a new group to the layout.
   * @param {Event} event - The event object from the user action.
   * @param {HTMLElement} event.target - Add group button.
   * @returns {void}
   */
  addGroup (event) {
    const action = event.target;
    const group = this.avatarsBuilder.createGroup();
    this.avatarsBuilder.toggleLayoutActions(group, 'add');
    this.avatarsBuilder.processGroupAdd(action, group);
  }

  /**
   * Edits an existing group.
   * @param {Event} event - The event object from the user action.
   * @param {HTMLElement} event.target - Edit group button.
   * @returns {void}
   */
  editGroup (event) {
    const group = event.target.closest(this.utils.getSelector('avatarsGroup'));
    this.avatarsBuilder.toggleLayoutActions(group, 'edit');
    this.avatarsBuilder.processGroupEdit(group);
  }

  /**
   * Confirms the changes to a group.
   * @param {Event} event - The event object from the user action.
   * @param {HTMLElement} event.target - Confirm group button.
   * @fires evt:confirmAvatarsGroupComplete - Emits a custom event.
   * @returns {void}
   */
  confirmGroup (event) {
    const group = event.target.closest(this.utils.getSelector('avatarsGroup'));
    this.avatarsBuilder.toggleLayoutActions(group, 'confirm');
    this.avatarsBuilder.processGroupConfirm(group);
    this.avatarsBuilder.sortGroups();
    this.avatarsBuilder.sortAvatars();
    this.eventBus.emit('evt:confirmAvatarsGroupComplete');
  }

  /**
   * Prompts for confirmation to delete a group.
   * @param {Event} event - The event object from the user action.
   * @param {HTMLElement} event.target - Delete group button.
   * @fires evt:deleteAvatarsGroupInitiate - Emits a custom event.
   * @fires evt:deleteAvatarsOnlyGroupInitiate - Emits a custom event.
   * @returns {void}
   */
  deleteGroup (event) {
    const groups = document.querySelectorAll(this.utils.getSelector('avatarsGroup'));
    const group = event.target.closest(this.utils.getSelector('avatarsGroup'));
    if (groups.length > 1) {
      this.eventBus.emit('evt:deleteAvatarsGroupInitiate', {
        type: 'confirm',
        title: 'Confirm Deletion',
        text: 'Are you sure you want to delete this group? This action cannot be undone.',
        context: 'ctx:groupDelete',
        target: group
      });
    } else {
      this.eventBus.emit('evt:deleteAvatarsOnlyGroupInitiate', {
        type: 'warning',
        title: 'Warning',
        text: 'You cannot delete the only group.'
      });
    }
  }

  /**
   * Confirms the deletion of a group.
   * @param {Event} event - The event object from the user action.
   * @param {object} event.detail - Group data.
   * @param {HTMLElement} event.detail.target - Target group.
   * @fires evt:deleteAvatarsGroupComplete - Emits a custom event.
   * @returns {void}
   */
  confirmDeleteGroup (event) {
    const group = event.detail.target;
    group.remove();
    this.eventBus.emit('evt:deleteAvatarsGroupComplete');
  }
}

export default AvatarsManager;
