/**
 * EventBus — Simple event system to register, remove, and emit events.
 * Supports multiple listeners and events.
 */

class EventBus {
  constructor () {
    this.events = {}; // Stores event listeners by event name
  }

  /**
   * Registers listeners for events (single or multiple).
   * @param {string|string[]|object} event - Event(s) to listen for.
   * @param {function|function[]} listener - Listener(s) to register.
   */
  on (event, listener) {
    // Handle multiple event-listener pairs
    if (event && typeof event === 'object' && !Array.isArray(event)) {
      Object.entries(event).forEach(([e, l]) => {
        this.on(e, l);
      });
      return;
    }
    // Handle multiple events
    if (Array.isArray(event)) {
      event.forEach((e) => {
        this.on(e, listener);
      });
      return;
    }
    // Handle multiple listeners for the same event
    if (Array.isArray(listener)) {
      listener.forEach((l) => {
        this.on(event, l);
      });
      return;
    }
    // Initialize event array
    if (!this.events[event]) {
      this.events[event] = [];
    }
    // Add listener
    this.events[event].push(listener);
    // Attach event listener
    document.addEventListener(event, listener);
  }

  /**
   * Removes listeners from events (single or multiple).
   * @param {string|string[]|object} event - Event(s) to stop listening for.
   * @param {function|function[]} listener - Listener(s) to remove.
   */
  off (event, listener) {
    // Handle multiple event-listener pairs
    if (event && typeof event === 'object' && !Array.isArray(event)) {
      Object.entries(event).forEach(([e, l]) => {
        this.off(e, l);
      });
      return;
    }
    // Handle multiple events
    if (Array.isArray(event)) {
      event.forEach((e) => {
        this.off(e, listener);
      });
      return;
    }
    // Handle multiple listeners for the same event
    if (Array.isArray(listener)) {
      listener.forEach((l) => {
        this.off(event, l);
      });
      return;
    }
    // Remove listener from the event
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((l) => l !== listener);
    }
    // Remove event listener
    document.removeEventListener(event, listener);
  }

  /**
   * Emits an event with data to all registered listeners.
   * @param {string|string[]|object} event - Event(s) to emit.
   * @param {any} data - Data to pass to listeners.
   */
  emit (event, data) {
    // Handle multiple event-data pairs
    if (event && typeof event === 'object' && !Array.isArray(event)) {
      Object.entries(event).forEach(([e, d]) => {
        this.emit(e, d);
      });
      return;
    }
    // Handle multiple events
    if (Array.isArray(event)) {
      event.forEach((e) => {
        this.emit(e, data);
      });
      return;
    }

    // Emit the event
    if (this.events[event]) {
      // Create and dispatche CustomEvent
      document.dispatchEvent(new CustomEvent(event, { detail: data }));
      // Non-native approach
      // for (const listener of this.events[event]) {
      //   try {
      //     listener({detail: data});
      //   } catch (e) {
      //     console.error(`[EventBus] error in listener for "${event}":`, e);
      //   }
      // }
    }
  }

  /**
   * Handles context-based routes and executes the corresponding listener.
   * @param {object} routes - Context-listener mappings.
   * @returns {function} Returns a function that takes an event and invokes the appropriate listener based on the context.
   */
  context (routes) {
    return (event) => {
      const listener = routes[event.detail.context];
      listener && listener(event);
    };
  }
}

export default EventBus;
