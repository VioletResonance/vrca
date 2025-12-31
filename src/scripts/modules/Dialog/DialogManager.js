/**
 * DialogManager — Manages the dialog box UI, listens for specific events, and handles user actions like confirming or canceling dialog actions.
 */

class DialogManager {
  constructor (config, uiMap, utils, eventBus) {
    this.config = config; // Application settings
    this.uiMap = uiMap; // UI element mappings
    this.utils = utils; // Utility functions
    this.eventBus = eventBus; // Event bus for handling events

    // Get dialog elements using UIMap selectors
    this.dialog = document.querySelector(this.utils.getSelector('dialog'));
    this.icon = this.dialog.querySelector(this.utils.getSelector('dialogIcon'));
    this.title = this.dialog.querySelector(this.utils.getSelector('dialogTitle'));
    this.text = this.dialog.querySelector(this.utils.getSelector('dialogText'));
    this.cancel = this.dialog.querySelector(this.utils.getSelector('dialogActionRoleCancel'));
    this.confirm = this.dialog.querySelector(this.utils.getSelector('dialogActionRoleConfirm'));
    this.dismiss = this.dialog.querySelector(this.utils.getSelector('dialogActionRoleDismiss'));

    // Initialize dialog context and data
    this.type = null;
    this.context = null;
    this.data = null;
    this.target = null;

    this.isPageScroll = true; // Page scroll state

    this.initHandlers(); // Initialize event handlers
  }

  /**
   * Initializes event handlers for dialog interactions.
   * @returns {void}
   */
  initHandlers () {
    this.eventBus.on([
      'evt:confirmFormErrorInitiate',
      'evt:deleteAvatarInitiate',
      'evt:deleteAvatarsGroupInitiate',
      'evt:deleteAvatarsOnlyGroupInitiate',
      'evt:importDataInitiate',
      'evt:importDataTypeErrorInitiate',
      'evt:importDataVersionErrorInitiate',
      'evt:importDataFileErrorInitiate'
    ], this.showDialog.bind(this));

    this.utils.handleClick({
      'dialogActionRoleCancel': this.hideDialog.bind(this),
      'dialogActionRoleConfirm': this.confirmDialog.bind(this),
      'dialogActionRoleDismiss': this.hideDialog.bind(this)
    });
  }

  /**
   * Displays the dialog with provided text and context.
   * @param {Event} event - The event object from the user action.
   * @param {object} event.detail - Dialog data.
   * @param {string} event.detail.type - Type of dialog (confirm, error, warning, success, etc.).
   * @param {string} event.detail.title - Title to display in the dialog.
   * @param {string} event.detail.text - Text to display in the dialog.
   * @param {string} event.detail.context - Context data (e.g., which action triggered the dialog).
   * @param {object} event.detail.data - Data passed through dialog between events.
   * @param {HTMLElement} event.detail.target - Target element.
   * @returns {void}
   */
  showDialog (event) {
    const { type = 'info', title = '', text = '', context, data, target } = event.detail;
    this.isPageScroll = document.body.style.overflow !== 'hidden';
    if (this.isPageScroll) document.body.style.overflow = 'hidden';
    this.icon.src = this.config.icons[type];
    this.icon.alt = `${type.charAt(0).toUpperCase()}${type.slice(1)} icon`;
    this.title.textContent = title;
    this.text.textContent = text;
    this.type = type;
    this.context = context;
    this.data = data;
    this.target = target;
    switch (type) {
      case 'alert':
        this.dialog.classList.add(this.uiMap.cls.dialogRoleAlert);
        break;
      case 'warning':
        this.dialog.classList.add(this.uiMap.cls.dialogRoleWarning);
        break;
      case 'error':
        this.dialog.classList.add(this.uiMap.cls.dialogRoleError);
        break;
      case 'success':
        this.dialog.classList.add(this.uiMap.cls.dialogRoleSuccess);
        break;
      case 'info':
        this.dialog.classList.add(this.uiMap.cls.dialogRoleInfo);
        break;
      case 'confirm':
        this.dialog.classList.add(this.uiMap.cls.dialogRoleConfirm);
        this.utils.removeState([this.confirm, this.cancel], 'hidden');
        this.utils.addState(this.dismiss, 'hidden');
        break;
    }
    this.utils.removeState(this.dialog, 'hidden');
  }

  /**
   * Hides the dialog and resets its context and data.
   * @returns {void}
   */
  hideDialog () {
    if (this.isPageScroll) document.body.removeAttribute('style');
    this.dialog.className = this.uiMap.cls.dialog;
    this.icon.src = this.config.icons['info'];
    this.icon.alt = 'Info icon';
    this.title.textContent = 'Information';
    this.text.textContent = 'Information';
    this.utils.removeState(this.dismiss, 'hidden');
    this.utils.addState([this.dialog, this.confirm, this.cancel], 'hidden');
    this.type = null;
    this.context = null;
    this.data = null;
    this.target = null;
  }

  /**
   * Confirms the dialog action and emits event.
   * @fires evt:confirmDialogComplete - Emits a custom event.
   * @returns {void}
   */
  confirmDialog () {
    this.eventBus.emit('evt:confirmDialogComplete', {
      context: this.context,
      data: this.data,
      target: this.target
    });
    this.hideDialog();
  }
}

export default DialogManager;
