(function () {
  "use strict";

  const SELECTORS = {
    giveModal: "#give-modal",
    careModal: "#care-modal",
    donateTrigger: ".donate-trigger",
    careTrigger: ".care-modal-trigger",
    feedbackForm: ".feedback-form",
    hamburger: ".header__hamburger",
    sideMenu: "#side-menu",
    sideMenuClose: ".side-menu__close",
  };

  function initDonationModals() {
    const giveModal = document.querySelector(SELECTORS.giveModal);
    const careModal = document.querySelector(SELECTORS.careModal);
    if (!giveModal && !careModal) return;

    const backdrop = giveModal?.querySelector(".give-modal__backdrop");
    const careBackdrop = careModal?.querySelector(".care-modal__backdrop");
    const careClose = careModal?.querySelector(".care-modal__close");
    const careAmounts = careModal?.querySelectorAll(".care-modal__amount");
    const steps = giveModal?.querySelectorAll(".give-modal__step");
    const dots = giveModal?.querySelectorAll(".give-modal__dot");
    const nextBtns = giveModal?.querySelectorAll(".give-modal__btn--next");
    const backBtns = giveModal?.querySelectorAll(".give-modal__btn--back");
    const submitBtn = giveModal?.querySelector(".give-modal__btn--submit");
    const amountOptions = giveModal?.querySelectorAll(".give-modal__amount-option");
    const customBtn = giveModal?.querySelector(".give-modal__custom-btn");
    const customInput = giveModal?.querySelector(".give-modal__input--custom");
    const selectWrap = giveModal?.querySelector(".give-modal__select-wrap");
    const selectTrigger = giveModal?.querySelector(".give-modal__select-trigger");
    const selectText = giveModal?.querySelector(".give-modal__select-text");
    const selectItems = giveModal?.querySelectorAll(".give-modal__select-item");

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
      customBtn?.classList.toggle("is-active", value === "custom");
      if (value !== "custom" && customInput) customInput.value = "";
    }

    function openGiveModal(amount) {
      if (!giveModal) return;
      giveModal.classList.add("is-open");
      giveModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("give-modal-open");
      document.body.classList.remove("care-modal-open");
      showStep(1);
      setAmount(amount || "10");
    }

    function closeGiveModal() {
      giveModal?.classList.remove("is-open");
      giveModal?.setAttribute("aria-hidden", "true");
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

    document.querySelectorAll(SELECTORS.donateTrigger).forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openGiveModal();
      });
    });

    document.querySelectorAll(SELECTORS.careTrigger).forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openCareModal();
      });
    });

    careClose?.addEventListener("click", closeCareModal);
    careBackdrop?.addEventListener("click", closeCareModal);

    careAmounts?.forEach((btn) => {
      btn.addEventListener("click", () => {
        const value = btn.dataset.value || "10";
        closeCareModal();
        openGiveModal(value === "other" ? "custom" : value);
      });
    });

    backdrop?.addEventListener("click", closeGiveModal);

    nextBtns?.forEach((btn) => {
      btn.addEventListener("click", () => showStep(btn.dataset.goto));
    });

    backBtns?.forEach((btn) => {
      btn.addEventListener("click", () => showStep(btn.dataset.goto));
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
        selectText && (selectText.textContent = item.textContent?.trim() || "");
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
      if (careModal?.classList.contains("is-open")) closeCareModal();
      else if (giveModal?.classList.contains("is-open")) closeGiveModal();
    });
  }

  function initSideMenu() {
    const hamburger = document.querySelector(SELECTORS.hamburger);
    const sideMenu = document.querySelector(SELECTORS.sideMenu);
    const sideMenuClose = document.querySelector(SELECTORS.sideMenuClose);

    function open() {
      document.body.classList.add("side-menu-open");
      sideMenu?.classList.add("side-menu--open");
      sideMenu?.setAttribute("aria-hidden", "false");
      hamburger?.setAttribute("aria-expanded", "true");
      hamburger?.setAttribute("aria-label", "Close menu");
    }

    function close() {
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

  function initFeedbackForm() {
    const form = document.querySelector(SELECTORS.feedbackForm);
    form?.addEventListener("submit", (e) => e.preventDefault());
  }

  document.addEventListener("DOMContentLoaded", () => {
    initDonationModals();
    initSideMenu();
    initFeedbackForm();
  });
})();
