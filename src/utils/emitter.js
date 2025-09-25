/**
 * Simple event emitter implementation to replace tiny-emitter
 */
export default class Emitter {
  constructor() {
    this._events = {};
  }

  on(event, fn) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(fn);
  }

  off(event, fn) {
    if (!this._events[event]) {
      return;
    }
    
    if (!fn) {
      // Remove all listeners for this event
      delete this._events[event];
      return;
    }

    // Remove specific listener
    const index = this._events[event].indexOf(fn);
    if (index > -1) {
      this._events[event].splice(index, 1);
    }
  }

  emit(event, ...args) {
    if (!this._events[event]) {
      return;
    }
    
    this._events[event].forEach(fn => {
      try {
        fn.apply(this, args);
      } catch (error) {
        // Prevent one listener from breaking others
        console.error('Error in event listener:', error);
      }
    });
  }
}