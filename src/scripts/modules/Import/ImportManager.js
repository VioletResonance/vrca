/**
 * ImportManager — Manages the import of JSON data.
 */

class ImportManager {
  constructor (config, uiMap, utils, eventBus) {
    this.config = config; // Application settings
    this.uiMap = uiMap; // UI element mappings
    this.utils = utils; // Utility functions
    this.eventBus = eventBus; // Event bus for handling events

    // Get fileInput element and avatars elements using UIMap selector
    this.fileInput = document.querySelector(this.utils.getSelector('avatarsFooterFileInput'));
    this.content = document.querySelector(this.utils.getSelector('avatarsContent'));
    this.group = document.querySelector(this.utils.getSelector('avatarsGroup'));
    this.avatar = document.querySelector(this.utils.getSelector('avatar'));
    this.grid = this.group.querySelector(this.utils.getSelector('avatarsGroupGrid'));
    this.platforms = this.avatar.querySelector(this.utils.getSelector('avatarPlatforms'));
    this.features = this.avatar.querySelector(this.utils.getSelector('avatarFeatures'));

    this.initHandlers(); // Initialize event handlers
  }

  /**
   * Initializes event handlers for import action.
   * @fires evt:importDataInitiate - Emits a custom event.
   * @returns {void}
   */
  initHandlers () {
    this.eventBus.on(
      'evt:confirmDialogComplete',
      this.eventBus.context({
        'ctx:importData': () => { this.fileInput.click(); }
      }).bind(this)
    );

    this.utils.handleClick('avatarsFooterActionRoleImportData', () => {
      this.eventBus.emit('evt:importDataInitiate', {
        type: 'confirm',
        title: 'Confirm Import',
        text: 'Are you sure you want to import avatars data from JSON? This action will replace your entire avatar library and cannot be undone.',
        context: 'ctx:importData'
      });
    });

    this.fileInput.addEventListener('change', this.processData.bind(this));
  }

  /**
   * Handles the import process by reading JSON from the input file
   * and generating HTML markup.   *
   * @fires evt:importDataComplete - Emits a custom event.
   * @fires evt:importDataTypeErrorInitiate - Emits a custom event.
   * @fires evt:importDataVersionErrorInitiate - Emits a custom event.
   * @fires evt:importDataFileErrorInitiate - Emits a custom event.
   * @param {Event} event - The event object from the user action.
   */
  processData (event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== 'application/json') {
      this.eventBus.emit('evt:importDataTypeErrorInitiate', {
        type: 'error',
        title: 'Error: Invalid File Format',
        text: 'The selected file does not contain valid JSON data. Select a proper JSON export.'
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const appVersion = this.utils.getMajorVersion(this.config.settings.version);
        const dataVersion = this.utils.getMajorVersion(data.version);
        if (dataVersion < appVersion) {
          this.eventBus.emit('evt:importDataVersionErrorInitiate', {
            type: 'error',
            title: 'Error: Outdated Data Version',
            text: `Your file version is ${dataVersion}, but the application requires version ${appVersion}. Run the appropriate migration script to update your data.`
          });
        } else if (dataVersion > appVersion) {
          this.eventBus.emit('evt:importDataVersionErrorInitiate', {
            type: 'error',
            title: 'Error: Unsupported Data Version',
            text: `Your file version is ${dataVersion}, but the application supports version ${appVersion}. Update application to open this file.`
          });
        } else {
          this.updateHtml(data.groups);
          this.eventBus.emit('evt:importDataComplete');
        }
      } catch (error) {
        this.eventBus.emit('evt:importDataFileErrorInitiate', {
          type: 'error',
          title: 'Error: Invalid JSON File',
          text: `An error occurred while reading or parsing the JSON file. Details: ${error}`
        });
      }
    };
    reader.readAsText(file);
  }

  /**
   * Fills the avatar group template and avatar template with data.
   * @param {object} data - Data to fill the template.
   * @returns {void}
   */
  updateHtml (data) {
    this.utils.clearNode([this.content, this.grid, this.platforms, this.features]);
    this.group.querySelector(this.utils.getSelector('avatarsGroupTitle')).textContent = '';
    this.avatar.querySelector(this.utils.getSelector('avatarName')).textContent = '';
    this.avatar.querySelector(this.utils.getSelector('avatarAuthor')).textContent = '';
    this.avatar.querySelector(this.utils.getSelector('avatarDescription')).textContent = '';
    this.avatar.querySelector(this.utils.getSelector('avatarLink')).setAttribute('href', '');
    this.avatar.querySelector(this.utils.getSelector('avatarImage')).setAttribute('src', '');
    data.forEach((groupData) => {
      const { groupTitle: titleData, groupAvatars: avatarsData } = groupData;
      const group = this.group.cloneNode(true);
      const groupGrid = group.querySelector(this.utils.getSelector('avatarsGroupGrid'));
      const groupTitle = group.querySelector(this.utils.getSelector('avatarsGroupTitle'));
      groupTitle.textContent = titleData;
      avatarsData.forEach((avatarData) => {
        const {
          isAvatarUnavailable: isUnavailableData,
          avatarLink: linkData,
          avatarImage: imageData,
          avatarName: nameData,
          avatarAuthor: authorData,
          avatarDescription: descriptionData,
          avatarPlatforms: platformsData,
          avatarFeatures: featuresData
        } = avatarData;
        const avatar = this.avatar.cloneNode(true);
        if (isUnavailableData) this.utils.addState(avatar, 'unavailable');
        avatar.querySelector(this.utils.getSelector('avatarLink')).setAttribute('href', linkData);
        avatar.querySelector(this.utils.getSelector('avatarImage')).setAttribute('src', imageData);
        avatar.querySelector(this.utils.getSelector('avatarName')).textContent = nameData;
        avatar.querySelector(this.utils.getSelector('avatarAuthor')).textContent = authorData;
        avatar.querySelector(this.utils.getSelector('avatarDescription')).textContent = descriptionData;
        if (platformsData.length > 0) {
          const avatarPlatforms = avatar.querySelector(this.utils.getSelector('avatarPlatforms'));
          platformsData.forEach((platformData) => {
            const { avatarPlatformName: nameData, avatarPlatformLabel: labelData } = platformData;
            const platform = this.utils.createNode('li', [this.uiMap.cls.avatarPlatform, `${this.uiMap.cls.avatarPlatform}_type_${nameData}`], { 'data-name': nameData, title: labelData }, labelData);
            avatarPlatforms.append(platform);
          });
        }
        if (featuresData.length > 0) {
          const avatarFeatures = avatar.querySelector(this.utils.getSelector('avatarFeatures'));
          featuresData.forEach((featureData) => {
            const { avatarFeatureName: nameData, avatarFeatureLabel: labelData } = featureData;
            const feature = this.utils.createNode('li', [this.uiMap.cls.avatarFeature, `${this.uiMap.cls.avatarFeature}_type_${nameData}`], { 'data-name': nameData, title: labelData }, labelData);
            avatarFeatures.append(feature);
          });
        }
        groupGrid.append(avatar);
      });
      this.content.append(group);
    });
  }
}

export default ImportManager;
