// dependencies
import DOMPurify from 'dompurify';
import beautify from 'js-beautify';
import Sortable from 'sortablejs';

// config
import Config from './config/Config';
import UIMap from './config/UIMap';

// utils
import Utils from './utils/Utils';

// core
import EventBus from './core/EventBus';

// modules
import AvatarManager from './modules/Avatar/AvatarManager';
import AvatarBuilder from './modules/Avatar/AvatarBuilder';
import AvatarData from './modules/Avatar/AvatarData';
import DialogManager from './modules/Dialog/DialogManager';
import DropdownManager from './modules/Dropdown/DopdownManager';
import ExportManager from './modules/Export/ExportManager';
import FilterManager from './modules/Filter/FilterManager';
import FormManager from './modules/Form/FormManager';
import HeaderManager from './modules/Header/HeaderManager';
import ImportManager from './modules/Import/ImportManager';
import AvatarsManager from './modules/Avatars/AvatarsManager';
import AvatarsBuilder from './modules/Avatars/AvatarsBuilder';
import ModalManager from './modules/Modal/ModalManager';
import UnloadManager from './modules/Unload/UnloadManager';

/**
 * App — Initializes services, event handlers,and core modules.
 * Manages app lifecycle, and component setup.
 */

class App {
  constructor () {
    // Initialize dependencies and core utilities

    // JS formatting utility (to beautify JS, JSON, HTML, CSS code)
    this.beautify = beautify;
    // Sanitizes HTML
    this.dompurify = DOMPurify;
    // Enables sortable lists (drag-and-drop functionality)
    this.sortable = Sortable;

    // Application configuration (settings)
    this.config = Config;
    // UI element selectors and class mappings
    this.uiMap = UIMap;

    // Utilities for manipulating DOM and strings
    this.utils = new Utils(this.config, this.uiMap);

    // Event bus for dispatching and listening to events across the app
    this.eventBus = new EventBus();

    // Handles avatar data extraction
    this.avatarData = new AvatarData(this.utils);
    // Responsible for building and rendering avatars
    this.avatarBuilder = new AvatarBuilder(this.config, this.uiMap, this.utils);
    // Manages avatar-related actions
    this.avatarManager = new AvatarManager(this.utils, this.eventBus, this.avatarBuilder, this.avatarData);
    // Manages dialog UI and actions
    this.dialogManager = new DialogManager(this.config, this.uiMap, this.utils, this.eventBus);
    // Handles dropdown interactions
    this.dropdownManager = new DropdownManager(this.utils, this.eventBus);
    // Manages data export functionality
    this.exportManager = new ExportManager(this.beautify, this.config, this.utils, this.eventBus);
    // Manages filtering functionality
    this.filterManager = new FilterManager(this.uiMap, this.utils, this.eventBus);
    // Manages form interactions
    this.formManager = new FormManager(this.beautify, this.dompurify, this.config, this.utils, this.eventBus);
    // Manages sticky header behavior
    this.headerManager = new HeaderManager(this.utils, this.eventBus);
    // Manages data import functionality
    this.importManager = new ImportManager(this.config, this.uiMap, this.utils, this.eventBus);
    // Builds the layout UI
    this.avatarsBuilder = new AvatarsBuilder(this.sortable, this.config, this.uiMap, this.utils, this.eventBus);
    // Manages layout actions
    this.avatarsManager = new AvatarsManager(this.utils, this.eventBus, this.avatarsBuilder);
    // Manages modals in the app
    this.modalManager = new ModalManager(this.utils, this.eventBus);
    // Manages DOM dirty state
    this.unloadManager = new UnloadManager(this.eventBus);

    this.initHandlers(); // Initialize event handlers
  }

  /**
   * Initializes event handlers for
   * @returns {void}
   */
  initHandlers () {
    document.addEventListener('DOMContentLoaded', this.runStartupActions.bind(this));
  }

  /**
   * Performs initial setup actions.
   * @returns {void}
   */
  runStartupActions () {
    this.avatarBuilder.replaceBrokenImages(); // Fix broken avatar images
    this.filterManager.clearFilters(); // Reset filters
    this.headerManager.setHeaderSticky(); // Set sticky header
  }
}

export default App;
