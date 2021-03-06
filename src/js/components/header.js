class SiteHeader {
  constructor() {
    this.body = document.body;
    this.header = document.querySelector('#site-header');
    this.navigation = document.querySelector('#site-header .navigation');
    this.siteNavigation = document.getElementById('site-navigation');

    this.onMenuToggle();
  }

  // Click Event Menu Toggle
  onMenuToggle() {
    document.querySelectorAll('[data-toggle-mobile-nav]').forEach((toggler) => {
      toggler.addEventListener('click', () => {
        this.body.classList.toggle('no-scroll');
        this.body.classList.toggle('main-navigation-opened');
        this.siteNavigation.classList.toggle('main-navigation--open');
      });
    });
  }
}

const siteHeader = {
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      // eslint-disable-next-line no-unused-vars
      const header = new SiteHeader();
    });
  },
};

export default siteHeader;
