/*========================================================================
Utility Scripts
========================================================================== */
import Modernizr from '../vendor/modernizr';

class Utility {
  constructor() {
    this.checkSafariMobile();
    this.checkTouch();
  }

  checkSafariMobile() {
    Modernizr.addTest('mobilesafari', () =>
      /iP(ad|hone|od).+Version\/[\d\.]+.*Safari/i.test(navigator.userAgent),
    );

    this.isSafariMobile = Modernizr.mobilesafari;
  }

  checkTouch() {
    if (Modernizr.touchevents) {
      this.hasTouch = true;
    } else {
      this.hasTouch = false;
    }
  }
}

export default Utility;
export const util = new Utility();
