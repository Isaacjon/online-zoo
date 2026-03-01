function initGiveModal() {
  const modal = document.getElementById("give-modal");
  const careModal = document.getElementById("care-modal");
  const triggers = document.querySelectorAll(".donate-trigger");
  const careTriggers = document.querySelectorAll(".care-modal-trigger");
  const backdrop = modal?.querySelector(".give-modal__backdrop");
  const careBackdrop = careModal?.querySelector(".care-modal__backdrop");
  const careClose = careModal?.querySelector(".care-modal__close");
  const careAmounts = careModal?.querySelectorAll(".care-modal__amount");
  const steps = modal?.querySelectorAll(".give-modal__step");
  const dots = modal?.querySelectorAll(".give-modal__dot");
  const nextBtns = modal?.querySelectorAll(".give-modal__btn--next");
  const backBtns = modal?.querySelectorAll(".give-modal__btn--back");
  const submitBtn = modal?.querySelector(".give-modal__btn--submit");
  const amountOptions = modal?.querySelectorAll(".give-modal__amount-option");
  const customBtn = modal?.querySelector(".give-modal__custom-btn");
  const customInput = modal?.querySelector(".give-modal__input--custom");
  const selectWrap = modal?.querySelector(".give-modal__select-wrap");
  const selectTrigger = modal?.querySelector(".give-modal__select-trigger");
  const selectText = modal?.querySelector(".give-modal__select-text");
  const selectItems = modal?.querySelectorAll(".give-modal__select-item");

  if (!modal && !careModal) return;

  function showStep(stepNum) {
    const n = Number(stepNum);
    steps?.forEach((s) => {
      s.classList.toggle("give-modal__step--active", Number(s.dataset.step) === n);
    });
    dots?.forEach((d) => {
      d.classList.toggle("give-modal__dot--active", Number(d.dataset.step) <= n);
    });
  }

  function setAmount(value) {
    amountOptions?.forEach((btn) => {
      btn.classList.toggle("give-modal__amount-option--active", btn.dataset.value === value);
    });
    if (value === "custom") {
      customBtn?.classList.add("is-active");
    } else {
      customBtn?.classList.remove("is-active");
      if (customInput) customInput.value = "";
    }
  }

  function openGiveModal(amount) {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("give-modal-open");
    document.body.classList.remove("care-modal-open");
    showStep(1);
    setAmount(amount || "10");
  }

  function closeGiveModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("give-modal-open");
    showStep(1);
    selectWrap?.classList.remove("is-open");
  }

  function openCareModal() {
    careModal?.classList.add("is-open");
    careModal?.setAttribute("aria-hidden", "false");
    document.body.classList.add("care-modal-open");
  }

  function closeCareModal() {
    careModal?.classList.remove("is-open");
    careModal?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("care-modal-open");
  }

  triggers.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openGiveModal();
    });
  });

  careTriggers?.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openCareModal();
    });
  });

  if (careClose) careClose.addEventListener("click", closeCareModal);
  if (careBackdrop) careBackdrop.addEventListener("click", closeCareModal);

  careAmounts?.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.value || "10";
      closeCareModal();
      openGiveModal(value === "other" ? "custom" : value);
    });
  });

  backdrop?.addEventListener("click", closeGiveModal);

  nextBtns?.forEach((btn) => {
    btn.addEventListener("click", () => {
      const goto = btn.dataset.goto;
      if (goto) showStep(goto);
    });
  });

  backBtns?.forEach((btn) => {
    btn.addEventListener("click", () => {
      const goto = btn.dataset.goto;
      if (goto) showStep(goto);
    });
  });

  submitBtn?.addEventListener("click", closeGiveModal);

  amountOptions?.forEach((btn) => {
    btn.addEventListener("click", () => setAmount(btn.dataset.value || ""));
  });

  customBtn?.addEventListener("click", () => {
    setAmount("custom");
    customInput?.focus();
  });

  customInput?.addEventListener("input", () => {
    if (customInput.value.trim()) setAmount("custom");
  });

  selectTrigger?.addEventListener("click", () => {
    selectWrap?.classList.toggle("is-open");
    selectTrigger?.setAttribute("aria-expanded", selectWrap?.classList.contains("is-open"));
  });

  selectItems?.forEach((item) => {
    item.addEventListener("click", () => {
      selectItems.forEach((i) => i.classList.remove("give-modal__select-item--chosen"));
      item.classList.add("give-modal__select-item--chosen");
      if (selectText) selectText.textContent = item.textContent?.trim() || "";
      selectWrap?.classList.remove("is-open");
      selectTrigger?.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e) => {
    if (selectWrap && !selectWrap.contains(e.target)) {
      selectWrap.classList.remove("is-open");
      selectTrigger?.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (careModal?.classList.contains("is-open")) {
      closeCareModal();
    } else if (modal?.classList.contains("is-open")) {
      closeGiveModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initGiveModal();

  const body = document.body;
  const hamburger = document.querySelector(".header__hamburger");
  const sideMenu = document.querySelector("#side-menu");
  const sideMenuClose = document.querySelector(".side-menu__close");

  function openMenu() {
    body.classList.add("side-menu-open");
    if (sideMenu) sideMenu.classList.add("side-menu--open");
    if (sideMenu) sideMenu.setAttribute("aria-hidden", "false");
    if (hamburger) {
      hamburger.setAttribute("aria-expanded", "true");
      hamburger.setAttribute("aria-label", "Close menu");
    }
  }

  function closeMenu() {
    body.classList.remove("side-menu-open");
    if (sideMenu) sideMenu.classList.remove("side-menu--open");
    if (sideMenu) sideMenu.setAttribute("aria-hidden", "true");
    if (hamburger) {
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Open menu");
    }
  }

  function toggleMenu() {
    const isOpen = body.classList.contains("side-menu-open");
    isOpen ? closeMenu() : openMenu();
  }

  if (hamburger) {
    hamburger.addEventListener("click", toggleMenu);
  }

  if (sideMenuClose) {
    sideMenuClose.addEventListener("click", closeMenu);
  }
});
