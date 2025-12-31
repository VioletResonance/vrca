/**
 * UIMap — Stores mappings for UI elements (CSS classes, states, selectors).
 */

class UIMap {
  /**
   * UI element states (visibility, interactivity, selection).
   */
  static states = {
    hidden: 'is-hidden',
    unavailable: 'is-unavailable',
    draggable: 'is-draggable',
    chosen: 'is-chosen',
    sticky: 'is-sticky'
  };

  /**
   * CSS class names for various UI elements.
   * Centralizes class names for easier maintenance.
   */
  static cls = {
    avatars: 'avatars',
    avatarsHeader: 'avatars__header',
    avatarsHeaderActionRoleEdit: 'avatars__header-action_role_edit',
    avatarsHeaderActionRoleConfirm: 'avatars__header-action_role_confirm',
    avatarsFilter: 'avatars__filter',
    avatarsContent: 'avatars__content',
    avatarsGroup: 'avatars__group',
    avatarsGroupHandle: 'avatars__group-handle',
    avatarsGroupHeader: 'avatars__group-header',
    avatarsGroupTitle: 'avatars__group-title',
    avatarsGroupTitleInput: 'avatars__group-title-input',
    avatarsGroupOrderInput: 'avatars__group-order-input',
    avatarsGroupOrderLabel: 'avatars__group-order-label',
    avatarsGroupDropdown: 'avatars__group-dropdown',
    avatarsGroupDropdownAction: 'avatars__group-dropdown-action',
    avatarsGroupGrid: 'avatars__group-grid',
    avatarsGroupActions: 'avatars__group-actions',
    avatarsGroupAction: 'avatars__group-action',
    avatarsGroupActionRoleAdd: 'avatars__group-action_role_add',
    avatarsGroupActionRoleEdit: 'avatars__group-action_role_edit',
    avatarsGroupActionRoleConfirm: 'avatars__group-action_role_confirm',
    avatarsGroupActionRoleDelete: 'avatars__group-action_role_delete',
    avatarsGroupActionRoleAvatarAdd: 'avatars__group-action_role_avatar-add',
    avatarsGroupActionPositionBefore: 'avatars__group-action_position_before',
    avatarsGroupActionPositionAfter: 'avatars__group-action_position_after',
    avatarsFooter: 'avatars__footer',
    avatarsFooterActionRoleExportHtml: 'avatars__footer-action_role_export-html',
    avatarsFooterActionRoleExportData: 'avatars__footer-action_role_export-data',
    avatarsFooterActionRoleImportData: 'avatars__footer-action_role_import-data',
    avatarsFooterFileInput: 'avatars__footer-file-input',
    avatarsFooterVersion: 'avatars__footer-version',
    avatar: 'avatar',
    avatarContent: 'avatar__content',
    avatarPlatforms: 'avatar__platforms',
    avatarPlatform: 'avatar__platform',
    avatarLink: 'avatar__link',
    avatarImage: 'avatar__image',
    avatarInfo: 'avatar__info',
    avatarFeatures: 'avatar__features',
    avatarFeature: 'avatar__feature',
    avatarName: 'avatar__name',
    avatarAuthor: 'avatar__author',
    avatarDescription: 'avatar__description',
    avatarActions: 'avatar__actions',
    avatarAction: 'avatar__action',
    avatarActionRoleDelete: 'avatar__action_role_delete',
    avatarActionRoleEdit: 'avatar__action_role_edit',
    form: 'form',
    formTextarea: 'form__textarea',
    formActionConfirm: 'form__action_role_confirm',
    formActionCancel: 'form__action_role_cancel',
    modal: 'modal',
    modalTitle: 'modal__title',
    dialog: 'dialog',
    dialogRoleAlert: 'dialog_role_alert',
    dialogRoleWarning: 'dialog_role_warning',
    dialogRoleError: 'dialog_role_error',
    dialogRoleSuccess: 'dialog_role_success',
    dialogRoleInfo: 'dialog_role_info',
    dialogRoleConfirm: 'dialog_role_confirm',
    dialogIcon: 'dialog__icon',
    dialogTitle: 'dialog__title',
    dialogText: 'dialog__text',
    dialogActionRoleCancel: 'dialog__action_role_cancel',
    dialogActionRoleConfirm: 'dialog__action_role_confirm',
    dialogActionRoleDismiss: 'dialog__action_role_dismiss',
    filter: 'filter',
    filterActionRoleReset: 'filter__action_role_reset'
  };

  /**
   * CSS selectors for specific elements.
   * These selectors are used to query DOM elements based on their attributes or structure.
   * @property {string} filterOption - Selector for checkbox inputs in filter controls.
   * @property {string} formOption - Selector for checkbox inputs in form options.
   */
  static selectors = {
    filterOption: '.filter__control input[type="checkbox"]',
    formOption: '.form__options input[type="checkbox"]'
  };
}

export default UIMap;
