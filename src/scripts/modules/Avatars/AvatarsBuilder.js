/**
 * AvatarsBuilder — Builds and manages layout structure, including group creation, sorting, and edit mode.
 */

class AvatarsBuilder {
  constructor (sortable, config, uiMap, utils, eventBus) {
    this.sortable = sortable; // Handles drag-and-drop sorting
    this.config = config; // Application settings
    this.uiMap = uiMap; // UI element mappings
    this.utils = utils; // Utility functions
    this.eventBus = eventBus; // Event bus for handling events
  }

  setVersion () {
    document.querySelector(this.utils.getSelector('avatarsFooterVersion')).textContent = `Version: ${this.config.settings.version}`;
  }

  /**
   * Toggles the layout between edit and non-edit mode.
   * @param {string} context - The context indicating whether to enter or exit edit mode.
   * @returns {void}
   */
  toggleEditMode (context) {
    const isEnter = context === 'enter';
    const isExit = context === 'exit';
    const avatars = document.querySelectorAll(this.utils.getSelector('avatar'));
    const selectors = [
      'avatarsHeaderActionRoleEdit',
      'avatarsHeaderActionRoleConfirm',
      'avatarsGroupActionRoleAvatarAdd',
      'avatarsGroupActionRoleAdd',
      'avatarsGroupActionRoleEdit',
      'avatarsGroupActionRoleDelete',
      'avatarsFooterActionRoleExportHtml',
      'avatarsFooterActionRoleExportData',
      'avatarsFooterActionRoleImportData',
      'avatarsFooterVersion'
    ];
    avatars.forEach((avatar) => {
      const action = avatar.querySelector(this.utils.getSelector('avatarActions'));
      const link = avatar.querySelector(this.utils.getSelector('avatarLink'));
      this.utils.toggleState(avatar, 'draggable');
      this.utils.toggleState(action, 'hidden');
      if (isEnter) {
        link.style.pointerEvents = 'none';
      } else if (isExit) {
        avatar.removeAttribute('style');
        link.removeAttribute('style');
        document.querySelectorAll(this.utils.getSelector('avatarsGroup')).forEach((group) => group.removeAttribute('style'));
      }
    });
    selectors.forEach((selector) => {
      document.querySelectorAll(this.utils.getSelector(selector)).forEach((element) => this.utils.toggleState(element, 'hidden'));
    });
    if (isEnter) {
      this.sortAvatars();
    } else if (isExit) {
      document.documentElement.removeAttribute('style');
      document.body.removeAttribute('style');
      if (this.sortableAvatarInstances) {
        this.sortableAvatarInstances.forEach((s) => s.destroy());
        this.sortableAvatarInstances = [];
      }
    }
  }

  /**
   * Creates a new group element with predefined structure.
   * @returns {HTMLElement} - The new group element.
   */
  createGroup () {
    const group = this.utils.createNode('section', [this.uiMap.cls.avatarsGroup]);
    const groupActionAddBefore = this.utils.createNode('button', [this.uiMap.cls.avatarsGroupAction, this.uiMap.cls.avatarsGroupActionRoleAdd, this.uiMap.cls.avatarsGroupActionPositionBefore, this.uiMap.states.hidden], { type: 'button' }, 'Add Group');
    const groupActionAddAfter = this.utils.createNode('button', [this.uiMap.cls.avatarsGroupAction, this.uiMap.cls.avatarsGroupActionRoleAdd, this.uiMap.cls.avatarsGroupActionPositionAfter, this.uiMap.states.hidden], { type: 'button' }, 'Add Group');
    const groupHeader = this.utils.createNode('header', [this.uiMap.cls.avatarsGroupHeader]);
    const groupTitleInput = this.utils.createNode('input', [this.uiMap.cls.avatarsGroupTitleInput], { type: 'text', placeholder: 'Group Name' });
    const groupDropdownAction = this.utils.createNode('button', [this.uiMap.cls.avatarsGroupDropdownAction], { type: 'button' }, 'Toggle Dropdown');
    const groupDropdown = this.utils.createNode('div', [this.uiMap.cls.avatarsGroupDropdown]);
    const groupGrid = this.utils.createNode('div', [this.uiMap.cls.avatarsGroupGrid]);
    const groupActions = this.utils.createNode('div', [this.uiMap.cls.avatarsGroupActions]);
    const groupActionConfirm = this.utils.createNode('button', [this.uiMap.cls.avatarsGroupAction, this.uiMap.cls.avatarsGroupActionRoleConfirm], { type: 'button' }, 'Confirm');
    const groupActionDelete = this.utils.createNode('button', [this.uiMap.cls.avatarsGroupAction, this.uiMap.cls.avatarsGroupActionRoleDelete, this.uiMap.states.hidden], { type: 'button' }, 'Delete Group');
    const groupActionEdit = this.utils.createNode('button', [this.uiMap.cls.avatarsGroupAction, this.uiMap.cls.avatarsGroupActionRoleEdit, this.uiMap.states.hidden], { type: 'button' }, 'Edit Group');
    const groupActionAddAvatar = this.utils.createNode('button', [this.uiMap.cls.avatarsGroupAction, this.uiMap.cls.avatarsGroupActionRoleAvatarAdd, this.uiMap.states.hidden], { type: 'button' }, 'Add Avatar');
    group.append(groupActionAddBefore);
    group.append(groupHeader);
    group.append(groupDropdown);
    group.append(groupActionAddAfter);
    groupHeader.append(groupTitleInput);
    groupHeader.append(groupDropdownAction);
    groupDropdown.append(groupGrid);
    groupDropdown.append(groupActions);
    groupActions.append(groupActionConfirm);
    groupActions.append(groupActionDelete);
    groupActions.append(groupActionEdit);
    groupActions.append(groupActionAddAvatar);
    return group;
  }

  /**
   * Toggles the visibility of layout actions (add, edit, confirm) for a group.
   * @param {HTMLElement} group - The group element to toggle actions for.
   * @param {string} context - Action context: 'add', 'edit', or 'confirm'.
   * @returns {void}
   */
  toggleLayoutActions (group, context) {
    // const isEdit = context === 'edit';
    // const isAdd = context === 'add';
    const isConfirm = context === 'confirm';
    const selectors = [
      'avatarsHeaderActionRoleConfirm',
      'avatarsGroupActionRoleEdit',
      'avatarsGroupActionRoleDelete',
      'avatarsGroupActionPositionBefore',
      'avatarsGroupActionPositionAfter'
    ];
    selectors.forEach((selector) => {
      document.querySelectorAll(this.utils.getSelector(selector)).forEach((element) => {
        this.utils.toggleState(element, 'hidden');
      });
    });
    this.utils.toggleState(group.querySelector(this.utils.getSelector('avatarsGroupActionRoleConfirm')), 'hidden', isConfirm);
  }

  /**
   * Handles adding a new group based on the action.
   * @param {HTMLElement} action - The triggering action element.
   * @param {HTMLElement} group - The newly created group element.
   * @returns {void}
   */
  processGroupAdd (action, group) {
    const targetGroup = action.closest(this.utils.getSelector('avatarsGroup'));
    const titleInput = group.querySelector(this.utils.getSelector('avatarsGroupTitleInput'));
    if (action.classList.contains(this.uiMap.cls.avatarsGroupActionPositionBefore)) {
      targetGroup.parentNode.insertBefore(group, targetGroup);
    } else if (action.classList.contains(this.uiMap.cls.avatarsGroupActionPositionAfter)) {
      targetGroup.parentNode.insertBefore(group, targetGroup.nextSibling);
    }
    titleInput.focus();
    titleInput.select();
  }

  /**
   * Handles editing an existing group.
   * @param {HTMLElement} group - The group element being edited.
   * @returns {void}
   */
  processGroupEdit (group) {
    const title = group.querySelector(this.utils.getSelector('avatarsGroupTitle'));
    const titleText = title.textContent.trim() || '';
    const titleInput = document.createElement('input');
    const order = Array.from(group.parentNode.children).indexOf(group) + 1;
    const orderInput = document.createElement('input');
    const handle = document.createElement('div');
    titleInput.type = 'text';
    titleInput.className = this.uiMap.cls.avatarsGroupTitleInput;
    titleInput.value = titleText;
    title.replaceWith(titleInput);
    titleInput.focus();
    titleInput.select();
    titleInput.after(orderInput);
    orderInput.type = 'text';
    orderInput.className = this.uiMap.cls.avatarsGroupOrderInput;
    orderInput.value = order;
    handle.className = this.uiMap.cls.avatarsGroupHandle;
    handle.textContent = 'Move Group';
    group.insertBefore(handle, group.firstElementChild);

    document.querySelectorAll(this.utils.getSelector('avatarsGroup')).forEach((element, index) => {
      if (element !== group) {
        const label = document.createElement('div');
        label.className = this.uiMap.cls.avatarsGroupOrderLabel;
        label.textContent = index + 1;
        element.querySelector(this.utils.getSelector('avatarsGroupTitle')).after(label);
      }
    });
    this.sortGroups();
  }

  /**
   * PHandles the confirmation of group editing.
   * @param {HTMLElement} group - The group element being confirmed.
   * @returns {void}
   */
  processGroupConfirm (group) {
    const orderLabels = document.querySelectorAll(this.utils.getSelector('avatarsGroupOrderLabel'));
    const orderInput = group.querySelector(this.utils.getSelector('avatarsGroupOrderInput'));
    const handle = group.querySelector(this.utils.getSelector('avatarsGroupHandle'));
    const titleInput = group.querySelector(this.utils.getSelector('avatarsGroupTitleInput'));
    const titleText = titleInput.value.trim() || 'Untitled';
    const title = document.createElement('h2');
    title.className = this.uiMap.cls.avatarsGroupTitle;
    title.textContent = titleText;
    titleInput.replaceWith(title);
    if (orderLabels && orderInput && handle) {
      this.reorderGroups(group, orderInput.value.trim() || '1');
      orderLabels.forEach((label) => label.remove());
      orderInput.remove();
      handle.remove();
    }
    if (this.sortableGroupInstance) {
      this.sortableGroupInstance.destroy();
      this.sortableGroupInstance = null;
    }
    this.sortAvatars();
  }

  /**
   * Reorders a group within its container.
   * @param {HTMLElement} group - The group to reorder.
   * @param {string} order - The new order position for the group.
   * @returns {void}
   */
  reorderGroups (group, order) {
    const container = document.querySelector(this.utils.getSelector('avatarsContent'));
    const groups = Array.from(container.children);
    const currentIndex = groups.indexOf(group);
    const newIndex = parseInt(order, 10) - 1;
    if (newIndex === currentIndex) {
      return;
    } else if (newIndex > groups.length) {
      container.append(group);
      return;
    } else if (isNaN(newIndex) || newIndex < 0) {
      container.prepend(group);
      return;
    } else {
      const target = container.children[newIndex];
      newIndex > currentIndex ? target.after(group) : target.before(group);
    }
  }

  /**
   * Initializes sorting functionality for avatars inside their respective groups.
   * @fires evt:sortAvatarsComplete - Emits a custom event.
   * @returns {void}
   */
  sortAvatars () {
    const grids = document.querySelectorAll(this.utils.getSelector('avatarsGroupGrid'));
    if (this.sortableAvatarInstances) {
      this.sortableAvatarInstances.forEach((instance) => instance.destroy());
      this.sortableAvatarInstances = [];
    }
    this.sortableAvatarInstances = Array.from(grids, (grid) => new this.sortable(grid, {
      animation: 150,
      group: true,
      chosenClass: this.uiMap.states.chosen,
      onEnd: () => {
        this.eventBus.emit('evt:sortAvatarsComplete');
      }
    }));
  }

  /**
   * Initializes sorting functionality for groups within the layout.
   * @fires evt:sortGroupsComplete - Emits a custom event.
   * @returns {void}
   */
  sortGroups () {
    const content = document.querySelector(this.utils.getSelector('avatarsContent'));
    if (this.sortableGroupInstance) {
      this.sortableGroupInstance.destroy();
      this.sortableGroupInstance = null;
    }
    this.sortableGroupInstance = new this.sortable(content, {
      handle: this.utils.getSelector('avatarsGroupHandle'),
      animation: 150,
      onEnd: () => {
        this.updateGroupOrder();
        this.eventBus.emit('evt:sortGroupsComplete');
      }
    });
  }

  /**
   * Updates the order of the groups based on their position in the DOM.
   * @returns {void}
   */
  updateGroupOrder () {
    const container = document.querySelector(this.utils.getSelector('avatarsContent'));
    const groups = Array.from(container.children);

    groups.forEach((group, index) => {
      const input = group.querySelector(this.utils.getSelector('avatarsGroupOrderInput'));
      const label = group.querySelector(this.utils.getSelector('avatarsGroupOrderLabel'));
      if (input) input.value = index + 1;
      if (label) label.textContent = index + 1;
    });
  }
}

export default AvatarsBuilder;
