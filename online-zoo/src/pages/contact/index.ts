import { initDonationModal } from "../../donate-modal/donate-modal";

function initSideMenu(): void {
  const hamburger = document.querySelector(".header__hamburger");
  const sideMenu = document.querySelector("#side-menu");
  const sideMenuClose = document.querySelector(".side-menu__close");

  function open(): void {
    document.body.classList.add("side-menu-open");
    sideMenu?.classList.add("side-menu--open");
    sideMenu?.setAttribute("aria-hidden", "false");
    hamburger?.setAttribute("aria-expanded", "true");
    hamburger?.setAttribute("aria-label", "Close menu");
  }

  function close(): void {
    document.body.classList.remove("side-menu-open");
    sideMenu?.classList.remove("side-menu--open");
    sideMenu?.setAttribute("aria-hidden", "true");
    hamburger?.setAttribute("aria-expanded", "false");
    hamburger?.setAttribute("aria-label", "Open menu");
  }

  hamburger?.addEventListener("click", () => {
    document.body.classList.contains("side-menu-open") ? close() : open();
  });
  sideMenuClose?.addEventListener("click", close);
}

function initFeedbackForm(): void {
  const form = document.querySelector(".feedback-form");
  form?.addEventListener("submit", (e) => e.preventDefault());
}

document.addEventListener("DOMContentLoaded", () => {
  initDonationModal();
  initSideMenu();
  initFeedbackForm();
});
