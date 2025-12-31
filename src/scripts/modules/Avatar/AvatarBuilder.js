/**
 * AvatarBuilder — Builds and modifies avatar elements (creates, updates platforms, features, and actions).
 */

class AvatarBuilder {
  constructor (config, uiMap, utils) {
    this.config = config; // Application settings
    this.uiMap = uiMap; // UI element mappings
    this.utils = utils; // Utility functions
  }

  /**
   * Creates an avatar element from the provided data (image, platforms, features, actions).
   * @param {object} data - Avatar data.
   * @returns {HTMLElement} - The created avatar element (`div`).
   */
  createAvatar (data) {
    const {
      isAvatarUnavailable: isUnavailableData,
      avatarLink: linkData,
      avatarImage: imageData,
      avatarName: nameData,
      avatarAuthor: authorData,
      avatarDescription: descriptionData,
      avatarPlatforms: platformsData,
      avatarFeatures: featuresData
    } = data;
    const avatar = this.utils.createNode('div', [this.uiMap.cls.avatar, isUnavailableData && this.uiMap.states.unavailable]);
    const avatarContent = this.utils.createNode('div', [this.uiMap.cls.avatarContent]);
    const avatarPlatforms = this.utils.createNode('ul', [this.uiMap.cls.avatarPlatforms]);
    const avatarLink = this.utils.createNode('a', [this.uiMap.cls.avatarLink], { href: linkData, target: '_blank', rel: 'noopener noreferrer' });
    const avatarImage = this.utils.createNode('img', [this.uiMap.cls.avatarImage], { src: imageData, alt: 'Avatar image' });
    const avatarInfo = this.utils.createNode('div', [this.uiMap.cls.avatarInfo]);
    const avatarFeatures = this.utils.createNode('ul', [this.uiMap.cls.avatarFeatures]);
    const avatarName = this.utils.createNode('h2', [this.uiMap.cls.avatarName], {}, nameData);
    const avatarAuthor = this.utils.createNode('p', [this.uiMap.cls.avatarAuthor], {}, authorData);
    const avatarDescription = this.utils.createNode('p', [this.uiMap.cls.avatarDescription], {}, descriptionData);
    const avatarActions = this.utils.createNode('div', [this.uiMap.cls.avatarActions]);
    const avatarActionDelete = this.utils.createNode('button', [this.uiMap.cls.avatarAction, this.uiMap.cls.avatarActionRoleDelete], { type: 'button' }, 'Delete');
    const avatarActionEdit = this.utils.createNode('button', [this.uiMap.cls.avatarAction, this.uiMap.cls.avatarActionRoleEdit], { type: 'button' }, 'Edit');
    if (platformsData.length > 0) {
      const platforms = document.createDocumentFragment();
      platformsData.forEach((platformData) => {
        const { avatarPlatformName: nameData, avatarPlatformLabel: labelData } = platformData;
        const platform = this.utils.createNode('li', [this.uiMap.cls.avatarPlatform, `${this.uiMap.cls.avatarPlatform}_type_${nameData}`], { 'data-name': nameData, title: labelData }, labelData);
        platforms.append(platform);
      });
      avatarPlatforms.append(platforms);
    }
    if (featuresData.length > 0) {
      const features = document.createDocumentFragment();
      featuresData.forEach((featureData) => {
        const { avatarFeatureName: nameData, avatarFeatureLabel: labelData } = featureData;
        const feature = this.utils.createNode('li', [this.uiMap.cls.avatarFeature, `${this.uiMap.cls.avatarFeature}_type_${nameData}`], { 'data-name': nameData, title: labelData }, labelData);
        features.append(feature);
      });
      avatarFeatures.append(features);
    }
    avatar.append(avatarContent);
    avatar.append(avatarActions);
    avatarContent.append(avatarPlatforms);
    avatarContent.append(avatarLink);
    avatarContent.append(avatarInfo);
    avatarActions.append(avatarActionDelete);
    avatarActions.append(avatarActionEdit);
    avatarLink.append(avatarImage);
    avatarInfo.append(avatarFeatures);
    avatarInfo.append(avatarName);
    avatarInfo.append(avatarAuthor);
    avatarInfo.append(avatarDescription);
    return avatar;
  }

  /**
   * Replaces broken avatar images with a fallback image.
   * @returns {void}
   */
  replaceBrokenImages () {
    document.querySelectorAll(this.utils.getSelector('avatarImage')).forEach((image) => {
      const testImage = new Image();
      testImage.onload = () => {}; // No action needed if image loads successfully
      testImage.onerror = () => {
        image.src = this.config.settings.fallbackDataUri;
      };
      testImage.src = image.src; // Attempt to load the image
    });
  }
}

export default AvatarBuilder;
