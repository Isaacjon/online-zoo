export function initHamburgerMenu(): void {
  const hamburger = document.querySelector(".header__hamburger");
  const sideMenu = document.querySelector("#side-menu");
  const sideMenuClose = document.querySelector(".side-menu__close");

  function openMenu(): void {
    document.body.classList.add("side-menu-open");
    sideMenu?.classList.add("side-menu--open");
    hamburger?.setAttribute("aria-expanded", "true");
    sideMenu?.setAttribute("aria-hidden", "false");
  }

  function closeMenu(): void {
    document.body.classList.remove("side-menu-open");
    sideMenu?.classList.remove("side-menu--open");
    hamburger?.setAttribute("aria-expanded", "false");
    sideMenu?.setAttribute("aria-hidden", "true");
  }

  hamburger?.addEventListener("click", () => {
    document.body.classList.contains("side-menu-open")
      ? closeMenu()
      : openMenu();
  });

  sideMenuClose?.addEventListener("click", closeMenu);

  sideMenu?.querySelectorAll(".side-menu__nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}
