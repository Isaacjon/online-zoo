import { initDonationModal } from "../../donate-modal/donate-modal";

function initSideMenu(): void {
  const body = document.body;
  const hamburger = document.querySelector(".header__hamburger");
  const sideMenu = document.querySelector("#side-menu");
  const sideMenuClose = document.querySelector(".side-menu__close");

  function openMenu(): void {
    body.classList.add("side-menu-open");
    sideMenu?.classList.add("side-menu--open");
    sideMenu?.setAttribute("aria-hidden", "false");
    hamburger?.setAttribute("aria-expanded", "true");
    hamburger?.setAttribute("aria-label", "Close menu");
  }

  function closeMenu(): void {
    body.classList.remove("side-menu-open");
    sideMenu?.classList.remove("side-menu--open");
    sideMenu?.setAttribute("aria-hidden", "true");
    hamburger?.setAttribute("aria-expanded", "false");
    hamburger?.setAttribute("aria-label", "Open menu");
  }

  hamburger?.addEventListener("click", () => {
    body.classList.contains("side-menu-open") ? closeMenu() : openMenu();
  });
  sideMenuClose?.addEventListener("click", closeMenu);
}

document.addEventListener("DOMContentLoaded", () => {
  initDonationModal();
  initSideMenu();
});
