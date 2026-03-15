import { clearToken, getProfile } from "../auth/auth";
import type { UserProfile } from "../api/types";

const SIGN_IN_PATH = "../sign-in/index.html";
const REGISTER_PATH = "../register/index.html";
const LANDING_PATH = "../landing/index.html";

function createUserIconSvg(): string {
  return `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g id="User"><g><path d="M17.438,21.937H6.562a2.5,2.5,0,0,1-2.5-2.5V18.61c0-3.969,3.561-7.2,7.938-7.2s7.938,3.229,7.938,7.2v.827A2.5,2.5,0,0,1,17.438,21.937ZM12,12.412c-3.826,0-6.938,2.78-6.938,6.2v.827a1.5,1.5,0,0,0,1.5,1.5H17.438a1.5,1.5,0,0,0,1.5-1.5V18.61C18.938,15.192,15.826,12.412,12,12.412Z"></path><path d="M12,9.911a3.924,3.924,0,1,1,3.923-3.924A3.927,3.927,0,0,1,12,9.911Zm0-6.847a2.924,2.924,0,1,0,2.923,2.923A2.926,2.926,0,0,0,12,3.064Z"></path></g></g></svg>`;
}

function renderUserBlock(profile: UserProfile | null): string {
  const icon = createUserIconSvg();
  if (profile) {
    return `
      <div class="header__user" id="header-user">
        <button type="button" class="header__user-btn" aria-label="User menu" aria-expanded="false" aria-haspopup="true">
          <span class="header__user-name">${escapeHtml(profile.name)}</span>
          <span class="header__user-icon">${icon}</span>
        </button>
      </div>
    `;
  }
  return `
    <div class="header__user" id="header-user">
      <button type="button" class="header__user-btn" aria-label="User menu" aria-expanded="false" aria-haspopup="true">
        <span class="header__user-icon">${icon}</span>
      </button>
    </div>
  `;
}

function renderUserPopup(profile: UserProfile | null): string {
  if (profile) {
    return `
      <div class="header-user-popup" id="header-user-popup" role="menu" aria-hidden="true">
        <div class="header-user-popup__profile">
          <p class="header-user-popup__label">Profile</p>
          <p class="header-user-popup__value">${escapeHtml(profile.name)}</p>
          <p class="header-user-popup__value">${escapeHtml(profile.email)}</p>
        </div>
        <button type="button" class="header-user-popup__sign-out" data-action="sign-out">Sign Out</button>
      </div>
    `;
  }
  return `
    <div class="header-user-popup" id="header-user-popup" role="menu" aria-hidden="true">
      <a href="${SIGN_IN_PATH}" class="header-user-popup__link">Sign In</a>
      <a href="${REGISTER_PATH}" class="header-user-popup__link">Registration</a>
    </div>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function injectUserSection(): void {
  const social = document.querySelector(".header__social");
  if (!social) return;

  const profile = getProfile();
  const userBlock = renderUserBlock(profile);
  const popup = renderUserPopup(profile);

  const wrapper = document.createElement("div");
  wrapper.className = "header__user-wrap";
  wrapper.innerHTML = userBlock + popup;
  social.after(wrapper);
}

function injectSideMenuUser(): void {
  const sideMenu = document.getElementById("side-menu");
  if (!sideMenu) return;

  const profile = getProfile();
  const userBlock = renderUserBlock(profile);
  const popup = renderUserPopup(profile);

  const wrapper = document.createElement("div");
  wrapper.className = "side-menu__user-wrap";
  wrapper.innerHTML = userBlock + popup;
  const nav = sideMenu.querySelector(".side-menu__nav");
  sideMenu.insertBefore(wrapper, nav ?? sideMenu.firstChild);
}

function setupUserPopup(): void {
  const userWrap = document.querySelector(".header__user-wrap");
  const userBtn = userWrap?.querySelector(".header__user-btn");
  const popup = userWrap?.querySelector(".header-user-popup");

  if (!userBtn || !popup) return;

  const openPopup = (): void => {
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    userBtn.setAttribute("aria-expanded", "true");
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
  };

  const closePopup = (): void => {
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
    userBtn.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", handleOutsideClick);
    document.removeEventListener("keydown", handleEscape);
  };

  const handleOutsideClick = (e: MouseEvent): void => {
    const target = e.target as Node;
    if (!userWrap?.contains(target)) {
      closePopup();
    }
  };

  const handleEscape = (e: KeyboardEvent): void => {
    if (e.key === "Escape") closePopup();
  };

  userBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = popup.classList.contains("is-open");
    if (isOpen) {
      closePopup();
    } else {
      openPopup();
    }
  });

  const signOutBtn = popup.querySelector("[data-action='sign-out']");
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      clearToken();
      closePopup();
      window.location.href = LANDING_PATH;
    });
  }

  const links = popup.querySelectorAll(".header-user-popup__link");
  links.forEach((link) => {
    link.addEventListener("click", () => closePopup());
  });
}

function setupSideMenuUserPopup(): void {
  const sideMenuUserWrap = document.querySelector(".side-menu__user-wrap");
  const userBtn = sideMenuUserWrap?.querySelector(".header__user-btn");
  const popup = sideMenuUserWrap?.querySelector(".header-user-popup");

  if (!userBtn || !popup) return;

  const openPopup = (): void => {
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    userBtn.setAttribute("aria-expanded", "true");
  };

  const closePopup = (): void => {
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
    userBtn.setAttribute("aria-expanded", "false");
  };

  userBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = popup.classList.contains("is-open");
    if (isOpen) {
      closePopup();
    } else {
      openPopup();
    }
  });

  const signOutBtn = popup.querySelector("[data-action='sign-out']");
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      clearToken();
      closePopup();
      const sideMenu = document.getElementById("side-menu");
      if (sideMenu?.classList.contains("side-menu--open")) {
        document.body.classList.remove("side-menu-open");
        sideMenu.classList.remove("side-menu--open");
        sideMenu.setAttribute("aria-hidden", "true");
      }
      window.location.href = LANDING_PATH;
    });
  }

  const links = popup.querySelectorAll(".header-user-popup__link");
  links.forEach((link) => {
    link.addEventListener("click", () => closePopup());
  });
}

export function initHeader(): void {
  if (!document.querySelector(".header")) return;

  injectUserSection();
  injectSideMenuUser();
  setupUserPopup();
  setupSideMenuUserPopup();
}
