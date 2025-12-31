/**
 * AvatarData — Extracts and processes avatar-related data (HTML, platforms, features, availability).
 */

class AvatarData {
  constructor (utils) {
    this.utils = utils; // Utility functions
  }

  /**
   * Extracts data from an avatar element (HTML, platforms, features, availability).
   * @param {HTMLElement} avatar - Avatar element.
   * @returns {object} - Extracted avatar data:
   *   - `avatarHtml` (string): Avatar's HTML.
   *   - `avatarPlatforms` (Array): List of platforms for the avatar.
   *   - `avatarFeatures` (Array): List of features for the avatar.
   *   - `isAvatarUnavailable` (boolean): Avatar availability status.
   */
  extractDataFromAvatar (avatar) {
    const getAttributes = (selector) => {
      return Array.from(avatar.querySelectorAll(this.utils.getSelector(selector)), (indicator) => indicator.dataset.name);
    };
    const data = {
      avatarHtml: avatar.outerHTML.trim(),
      avatarPlatforms: getAttributes('avatarPlatform'),
      avatarFeatures: getAttributes('avatarFeature'),
      isAvatarUnavailable: this.utils.hasState(avatar, 'unavailable')
    };
    return data;
  }
}

export default AvatarData;
