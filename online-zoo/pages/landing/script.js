document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const hamburger = document.querySelector('.header__hamburger');
  const sideMenu = document.querySelector('#side-menu');
  const sideMenuClose = document.querySelector('.side-menu__close');

  function openMenu() {
    body.classList.add('side-menu-open');
    if (sideMenu) sideMenu.classList.add('side-menu--open');
    if (sideMenu) sideMenu.setAttribute('aria-hidden', 'false');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
    }
  }

  function closeMenu() {
    body.classList.remove('side-menu-open');
    if (sideMenu) sideMenu.classList.remove('side-menu--open');
    if (sideMenu) sideMenu.setAttribute('aria-hidden', 'true');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    }
  }

  function toggleMenu() {
    const isOpen = body.classList.contains('side-menu-open');
    isOpen ? closeMenu() : openMenu();
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  if (sideMenuClose) {
    sideMenuClose.addEventListener('click', closeMenu);
  }
});
