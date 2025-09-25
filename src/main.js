import { detect } from './utils/browser-detect.js'
import Emitter from './utils/emitter.js'

import situations from './model/situations.js'

export default class iOSUIOverlayDetector extends Emitter {
  constructor(interval = 50) {
    super();
    this.__behaviourDedtected = false;
    this.__static_mode = null;
    this.browser = detect();

    //console.log(window.screen.height - window.innerHeight);

    if (typeof window !== 'undefined') {
      this.checker = setInterval(() => {
        this.applyMode();
      }, interval);

      this.applyMode = () => {
        if (this.__static_mode != this.mode) {
          this.updateStaticMode();
          this.__behaviourDedtected = true;
          this.emit('update', this.mode);
        }
      }
      window.addEventListener('resize', this.applyMode);

      this.applyMode();
    }
  }
  updateStaticMode() {
    this.__static_mode = this.mode;
  }
  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.applyMode);
      if (this.checker) {
        window.clearInterval(this.checker);
      }
    }
  }
  get mode() {
    if (typeof window === 'undefined') return null;
    
    if (this.isTargetDevice && this.situation && !window.navigator.standalone) {
      return this.situation.mode;
    }
    else if (this.__behaviourDedtected) {
      return this.__static_mode;
    }
    else {
      return null;
    }
  }
  get situation() {
    for (let { cases, models } of situations) {
      for (let _case of cases) {
        if (_case.detect()) {
          return {
            models,
            mode: _case.mode
          };
        }
      }
    }
    return null;
  }
  get browserVersion() {
    return this.browser.version.split('.').map(Number);
  }
  get isTargetDevice() {
    return this.browser.name == 'ios'
            && this.browser.os == 'iOS'
            && this.browserVersion[0] >= 15
  }
}
