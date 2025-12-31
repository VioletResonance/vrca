/**
 * FormManager — Manages form interactions: data processing, submission, and resetting.
 */

class FormManager {
  constructor (beautify, dompurify, config, utils, eventBus) {
    this.beautify = beautify; // JS formatting utility
    this.dompurify = dompurify; // HTML sanitizing utility
    this.config = config; // Application settings
    this.utils = utils; // Utility functions
    this.eventBus = eventBus; // Event bus for handling events

    // Get form elements using UIMap selectors
    this.form = document.querySelector(this.utils.getSelector('form'));
    this.checkboxes = Array.from(this.form.querySelectorAll('input[type="checkbox"]'));
    this.textarea = this.form.querySelector(this.utils.getSelector('formTextarea'));

    this.context = null;
    this.target = null;

    this.initHandlers(); // Initialize event handlers
  }

  /**
   * Initializes event handlers for form actions (confirm, cancel).
   * @returns {void}
   */
  initHandlers () {
    this.eventBus.on([
      'evt:addAvatarInitiate',
      'evt:editAvatarInitiate'
    ], this.processForm.bind(this));

    this.utils.handleClick({
      'formActionConfirm': this.confirmForm.bind(this),
      'formActionCancel': this.cancelForm.bind(this)
    });
  }

  /**
   * Processes the form: populates or clears based on provided data.
   * @param {Event} event - The event object from the user action.
   * @param {object} event.detail - Group data.
   * @param {string} event.detail.context - Form context (e.g., edit or create).
   * @param {object} event.detail.data - Data to populate the form (optional).
   * @param {HTMLElement} event.detail.target - Target element.
   * @returns {void}
   */
  processForm (event) {
    const { context, data, target } = event.detail;
    this.context = context;
    this.target = target;
    data ? this.populateForm(data) : this.clearForm();
  }

  /**
   * Confirms the form submission, emits completion event.
   * @param {Event} event - The event object from the user action.
   * @fires evt:confirmFormComplete - Emits a custom event.
   * @returns {void}
   */
  confirmForm (event) {
    event.preventDefault();
    const isTextareaValue = this.textarea.value.trim() !== '';
    const isAvatarElement = this.config.settings.avatarElementRegExp.test(this.textarea.value);
    if (isTextareaValue && isAvatarElement) {
      this.eventBus.emit('evt:confirmFormComplete', {
        context: this.context,
        data: this.extractData(),
        target: this.target
      });
    } else {
      this.eventBus.emit('evt:confirmFormErrorInitiate', {
        type: 'error',
        title: 'Error: Avatar Markup Not Found',
        text: 'The pasted HTML doesn\'t contain an .avatar-card or .avatar element.'
      });
    }
  }

  /**
   * Cancels the form submission, clears the form.
   * @param {Event} event - Native browser unload event.
   * @fires evt:cancelFormCompleted - Emits a custom event.
   * @returns {void}
   */
  cancelForm (event) {
    event.preventDefault();
    this.clearForm();
    this.eventBus.emit('evt:cancelFormComplete');
  }

  /**
   * Populates the form with provided data.
   * @param {object} data - Form data.
   * @param {string} data.avatarHtml - HTML for avatar in the textarea.
   * @param {Array} data.avatarPlatforms - Platforms to check in checkboxes.
   * @param {Array} data.avatarFeatures - Features to check in checkboxes.
   * @param {boolean} data.isAvatarUnavailable - Whether the "unavailable" checkbox is checked.
   * @returns {void}
   */
  populateForm (data) {
    const {
      avatarHtml: htmlData,
      avatarPlatforms: platformsData,
      avatarFeatures: featuresData,
      isAvatarUnavailable: isUnavailableData
    } = data;
    this.textarea.value = this.beautify.html(htmlData, {
      indent_size: 2,
      indent_inner_html: true,
      inline: []
    });
    this.checkboxes.forEach((checkbox) => checkbox.checked = false);
    [...platformsData, ...featuresData].forEach((name) => {
      const checkbox = this.form.querySelector(`input[name="${name}"]`);
      if (checkbox) checkbox.checked = true;
    });
    const unavailableCheckbox = this.form.querySelector('input[name="unavailable"]');
    if (isUnavailableData) unavailableCheckbox.checked = true;
  }

  /**
   * Extracts data from the form for submission.
   * @returns {object} - Extracted form data:
   *   - `avatar` (object): Avatar's data.
   *   - `avatarAuthor` (string): Avatar's author name
   *   - `avatarDescription` (string): Avatar's description
   *   - `avatarFeatures` (Array): List of features for the avatar.
   *   - `avatarImage` (string): Avatar's iamge
   *   - `avatarLink` (string): Avatar's link
   *   - `avatarName` (string): Avatar's name
   *   - `avatarPlatforms` (Array): List of platforms for the avatar.
   *   - `isAvatarUnavailable` (boolean): Avatar availability status.
   */
  extractData () {
    const data = {
      avatarPlatforms: [],
      avatarFeatures: [],
      isAvatarUnavailable: this.form.querySelector('input[name="unavailable"]').checked === true
    };
    const avatarHtml = this.dompurify.sanitize(this.textarea.value.trim(), {
      ALLOWED_TAGS: [
        'div', 'ul', 'li', 'h2', 'p', 'span', 'a', 'img'
      ],
      ALLOWED_ATTR: [
        'class', 'href', 'src'
      ],
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'style', 'link', 'base', 'meta', 'form'],
      FORBID_ATTR: [/^on/i, 'style'],
      ALLOW_DATA_ATTR: false
    });
    const avatar = new DOMParser().parseFromString(avatarHtml, 'text/html');
    const avatarContentMap = [
      { key: 'avatarLink', selectors: ['a', this.utils.getSelector('avatarLink')], property: 'href' },
      { key: 'avatarImage', selectors: ['img', this.utils.getSelector('avatarImage')], property: 'src' },
      { key: 'avatarName', selectors: ['.avatar-name', this.utils.getSelector('avatarName')], property: 'textContent' },
      { key: 'avatarAuthor', selectors: ['.author-name', this.utils.getSelector('avatarAuthor')], property: 'textContent' },
      { key: 'avatarDescription', selectors: ['.description', this.utils.getSelector('avatarDescription')], property: 'textContent' }
    ];
    const avatarPlatformsMap = {
      'pc-optimized': (checked) => ({
        avatarPlatformName: checked ? 'pc-optimized' : 'pc-not-optimized',
        avatarPlatformLabel: checked ? 'PC Optimized' : 'PC Not Optimized'
      }),
      'android-optimized': (checked) => ({
        avatarPlatformName: checked ? 'android-optimized' : 'android-not-optimized',
        avatarPlatformLabel: checked ? 'Android Optimized' : 'Android Not Optimized'
      }),
      'ios-optimized': (checked) => ({
        avatarPlatformName: checked ? 'ios-optimized' : 'ios-not-optimized',
        avatarPlatformLabel: checked ? 'iOS Optimized' : 'iOS Not Optimized'
      })
    };
    const avatarFeaturesMap = {
      'gogoloco': (checked) => ({
        avatarFeatureName: checked ? 'gogoloco' : 'no-gogoloco',
        avatarFeatureLabel: checked ? 'Gogoloco' : 'No Gogoloco'
      }),
      'fly-mode': (checked) => ({
        avatarFeatureName: checked && 'fly-mode',
        avatarFeatureLabel: checked && 'Fly Mode'
      }),
      'seat-place': (checked) => ({
        avatarFeatureName: checked && 'seat-place',
        avatarFeatureLabel: checked && 'Seat Place'
      }),
      'marker': (checked) => ({
        avatarFeatureName: checked && 'marker',
        avatarFeatureLabel: checked && 'Marker'
      }),
      'vrcft': (checked) => ({
        avatarFeatureName: checked && 'vrcft',
        avatarFeatureLabel: checked && 'Face Tracking'
      }),
      'nsfw': (checked) => ({
        avatarFeatureName: checked && 'nsfw',
        avatarFeatureLabel: checked && 'Not Safe For Work'
      })
    };
    avatarContentMap.forEach(({ key, selectors, property }) => {
      const element = selectors.map((selector) => avatar.querySelector(selector)).find((el) => el);
      if (element) {
        const value = property === 'src' || property === 'href' ? element.getAttribute(property) : element[property];
        switch (property) {
          case 'href':
            data[key] = (!value.includes('vrchat.com') || !'#') ? '#' : value;
            break;
          case 'src':
            data[key] = (value.endsWith('img/fallback.webp')) ? this.config.settings.fallbackDataUri : value;
            break;
          case 'textContent':
            data[key] = (key === 'avatarAuthor' && value.startsWith('By ')) ? value.replace(/^By\s+/i, '') : value;
            break;
          default:
            data[key] = value;
            break;
        }
      } else {
        data[key] = null;
      }
    });
    this.checkboxes.forEach((checkbox) => {
      const { name, checked } = checkbox;
      if (avatarPlatformsMap[name]) {
        const platformData = avatarPlatformsMap[name](checked);
        if (platformData.avatarPlatformName && platformData.avatarPlatformLabel) data.avatarPlatforms.push(platformData);
      }
      if (avatarFeaturesMap[name]) {
        const featureData = avatarFeaturesMap[name](checked);
        if (featureData.avatarFeatureName && featureData.avatarFeatureLabel) data.avatarFeatures.push(featureData);
      }
    });
    return data;
  }

  /**
   * Clears the form (resets, clears input, unchecks checkboxes).
   * @returns {void}
   */
  clearForm () {
    this.form.reset();
    this.textarea.value = '';
    this.checkboxes.forEach((checkbox) => checkbox.checked = false);
  }
}

export default FormManager;
