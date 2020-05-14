/*========================================================================
App Script - entry point
========================================================================== */
import lazy from './helpers/lazyload';
import header from './components/header';

class App {
  constructor() {
    // lazy loader
    lazy.init();
    // header
    header.init();
  }
}

const app = new App();
