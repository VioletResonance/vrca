/**
 * ExportManager — Manages the export of HTML content and JSON data.
 */

class ExportManager {
  constructor (beautify, config, utils, eventBus) {
    this.beautify = beautify; // JS formatting utility
    this.config = config; // Application settings
    this.utils = utils; // Utility functions
    this.eventBus = eventBus; // Event bus for handling events

    this.initHandlers(); // Initialize event handlers
  }

  /**
   * Initializes event handlers for export action.
   * @returns {void}
   */
  initHandlers () {
    this.utils.handleClick({
      'avatarsFooterActionRoleExportHtml': this.exportHtml.bind(this),
      'avatarsFooterActionRoleExportData': this.exportData.bind(this)
    });
  }

  /**
   * Handles the export process: formats HTML and triggers the download.
   * @fires evt:exportHtmlInitiate - Emits a custom event.
   * @fires evt:exportHtmlComplete - Emits a custom event.
   * @returns {void}
   */
  exportHtml () {
    this.eventBus.emit('evt:exportHtmlInitiate');
    const rawHtml = this.extractHtml();
    const formattedHtml = this.formatHtml(rawHtml);
    this.triggerDownload({
      content: formattedHtml,
      filename: `${this.config.settings.exportFileName.html}.html`,
      mimeType: 'text/html'
    });
    this.eventBus.emit('evt:exportHtmlComplete');
  }

  /**
   * Handles the export process: creates json and triggers the download.
   * @fires evt:exportDataInitiate - Emits a custom event.
   * @fires evt:exportDataComplete - Emits a custom event.
   * @returns {void}
   */
  exportData () {
    this.eventBus.emit('evt:exportDataInitiate');
    const rawData = this.extractData();
    const formattedData = this.formatData(rawData);
    this.triggerDownload({
      content: formattedData,
      filename: `${this.config.settings.exportFileName.data}.json`,
      mimeType: 'application/json'
    });
    this.eventBus.emit('evt:exportDataComplete');
  }

  /**
   * Extracts and returns the document's HTML contentwith doctype.
   * @returns {string} - The formatted HTML content.
   */
  extractHtml () {
    const doctype = '<!DOCTYPE html>\n';
    const rawHtml = document.documentElement.outerHTML;
    return doctype + rawHtml;
  }

  /**
   * Extracts and returns the data from HTML content.
   * @returns {object} - Data object.
   */
  extractData () {
    const data = {
      version: this.config.settings.version,
      groups: []
    };
    document.querySelectorAll(this.utils.getSelector('avatarsGroup')).forEach((group) => {
      const groupData = {
        groupTitle: group.querySelector(this.utils.getSelector('avatarsGroupTitle')).textContent.trim(),
        groupAvatars: []
      };
      group.querySelectorAll(this.utils.getSelector('avatar')).forEach((avatar) => {
        const avatarData = {
          isAvatarUnavailable: avatar.classList.contains('is-unavailable'),
          avatarLink: avatar.querySelector(this.utils.getSelector('avatarLink')).getAttribute('href'),
          avatarImage: avatar.querySelector(this.utils.getSelector('avatarImage')).getAttribute('src'),
          avatarName: avatar.querySelector(this.utils.getSelector('avatarName')).textContent.trim(),
          avatarAuthor: avatar.querySelector(this.utils.getSelector('avatarAuthor')).textContent.trim(),
          avatarDescription: avatar.querySelector(this.utils.getSelector('avatarDescription')).textContent.trim(),
          avatarPlatforms: [],
          avatarFeatures: []
        };
        avatar.querySelectorAll(this.utils.getSelector('avatarPlatform')).forEach((platform) => {
          avatarData.avatarPlatforms.push({
            avatarPlatformName: platform.getAttribute('data-name'),
            avatarPlatformLabel: platform.getAttribute('title')
          });
        });
        avatar.querySelectorAll(this.utils.getSelector('avatarFeature')).forEach((feature) => {
          avatarData.avatarFeatures.push({
            avatarFeatureName: feature.getAttribute('data-name'),
            avatarFeatureLabel: feature.getAttribute('title')
          });
        });
        groupData.groupAvatars.push(avatarData);
      });
      data.groups.push(groupData);
    });
    return data;
  }

  /**
   * Formats the HTML content into a pretty-printed string.
   * @param {string} html - The raw HTML content.
   * @returns {string} - The formatted HTML string.
   */
  formatHtml (html) {
    const formattedHtml = this.beautify.html(html, {
      indent_size: 2,
      indent_inner_html: true,
      preserve_newlines: false,
      extra_liners: [],
      inline: [],
      unformatted: ['script', 'style']
    });
    return formattedHtml;
  }

  /**
   * Formats the raw data into a pretty-printed JSON string.
   * @param {object} data - The raw data.
   * @returns {string} - The formatted JSON string.
   */
  formatData (data) {
    const rawData = JSON.stringify(data);
    const formattedData = this.beautify.js(rawData, {
      indent_size: 2,
      preserve_newlines: false
    });
    return formattedData;
  }

  /**
   * Triggers a file download by creating a Blob and programmatically clicking a link.
   * @param {object} args - Download arguments.
   * @param {string} args.content - The content to download (HTML).
   * @param {string} args.filename - The filename for the download.
   * @param {string} [args.mimeType='text/plain'] - MIME type for the file.
   * @returns {void}
   */
  triggerDownload ({ content, filename, mimeType = 'text/plain' }) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}

export default ExportManager;
