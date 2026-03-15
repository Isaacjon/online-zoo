import { getPets, submitDonation } from "../api";
import type { Pet } from "../api/types";
import { getProfile, isLoggedIn } from "../auth/auth";
import {
  validateCard,
  validateCvv,
  validateEmail,
  validateExp,
  validateName,
  validateOtherAmount,
} from "./validation";
import { getSavedCards, maskCardNumber, saveCard, type SavedCard } from "./storage";

const SUCCESS_MSG = "Thank you for your donation of [amount] to [pet name]!";
const ERROR_MSG = "Something went wrong. Please, try again later.";

const INVALID_CLASS = "give-modal__field--invalid";
const INVALID_ROW_CLASS = "give-modal__custom-row--invalid";

function setFieldInvalid(field: HTMLElement, messageEl: HTMLElement, msg: string): void {
  field.classList.add(INVALID_CLASS);
  messageEl.textContent = msg;
  messageEl.hidden = false;
}

function setFieldValid(field: HTMLElement, messageEl: HTMLElement): void {
  field.classList.remove(INVALID_CLASS);
  messageEl.textContent = "";
  messageEl.hidden = true;
}

export function initDonationModal(options?: {
  donateTrigger?: string;
  careModalTrigger?: string;
}): void {
  const modal = document.getElementById("give-modal");
  const careModal = document.getElementById("care-modal");
  const donateTriggerSel = options?.donateTrigger ?? ".donate-trigger";
  const careTriggerSel = options?.careModalTrigger ?? ".care-modal-trigger";

  const triggers = document.querySelectorAll(donateTriggerSel);
  const careTriggers = document.querySelectorAll(careTriggerSel);
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
  const customInput = modal?.querySelector(".give-modal__input--custom") as HTMLInputElement | null;
  const selectWrap = modal?.querySelector(".give-modal__select-wrap");
  const selectTrigger = modal?.querySelector(".give-modal__select-trigger");
  const selectText = modal?.querySelector(".give-modal__select-text");
  const selectList = modal?.querySelector(".give-modal__select-list");

  const step2 = modal?.querySelector(".give-modal__step[data-step='2']");
  const step2NameInput = step2?.querySelector(".give-modal__input-name") as HTMLInputElement | null;
  const step2EmailInput = step2?.querySelector(".give-modal__input-email") as HTMLInputElement | null;
  const step2NextBtn = step2?.querySelector(".give-modal__btn--next");

  const step3 = modal?.querySelector(".give-modal__step[data-step='3']");
  const step3CardInput = step3?.querySelector(".give-modal__input-card") as HTMLInputElement | null;
  const step3CvvInput = step3?.querySelector(".give-modal__input-cvv") as HTMLInputElement | null;
  const step3MonthSelect = step3?.querySelector(".give-modal__select-month") as HTMLSelectElement | null;
  const step3YearSelect = step3?.querySelector(".give-modal__select-year") as HTMLSelectElement | null;
  const step3SaveCheckboxWrap = step3?.querySelector(".give-modal__save-card-wrap");
  const step3SavedCardsWrap = step3?.querySelector(".give-modal__saved-cards-wrap");
  const step3SavedCardsSelect = step3?.querySelector(".give-modal__saved-cards-select") as HTMLSelectElement | null;
  const step3CardFieldsWrap = step3?.querySelector(".give-modal__card-fields-wrap");

  if (!modal || !careModal) return;

  let pets: Pet[] = [];
  let petsFetched = false;
  let petsFetchFailed = false;

  async function ensurePets(): Promise<Pet[]> {
    if (petsFetched && pets.length > 0) return pets;
    try {
      const res = await getPets();
      pets = res.data ?? [];
      petsFetched = true;
      petsFetchFailed = false;
      return pets;
    } catch {
      petsFetchFailed = true;
      return [];
    }
  }

  function renderPetList(): void {
    if (!selectList) return;
    selectList.innerHTML = "";
    if (pets.length > 0) {
      pets.forEach((pet) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "give-modal__select-item";
        btn.dataset.petId = String(pet.id);
        btn.textContent = `${pet.name} (${pet.commonName})`;
        li.appendChild(btn);
        selectList.appendChild(li);
      });
    } else if (petsFetchFailed) {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "give-modal__select-item give-modal__select-item--retry";
      btn.dataset.retry = "true";
      btn.textContent = "Unable to load pets. Tap to retry";
      li.appendChild(btn);
      selectList.appendChild(li);
    }
    if (selectText) selectText.textContent = "Choose your favourite";
  }

  function showStep(stepNum: string): void {
    const n = Number(stepNum);
    steps?.forEach((s) => {
      s.classList.toggle("give-modal__step--active", Number((s as HTMLElement).dataset.step) === n);
    });
    dots?.forEach((d) => {
      d.classList.toggle("give-modal__dot--active", Number((d as HTMLElement).dataset.step) <= n);
    });
    if (n === 2) {
      const profile = getProfile();
      if (profile && step2NameInput && step2EmailInput) {
        step2NameInput.value = profile.name;
        step2EmailInput.value = profile.email;
      }
      updateStep2Validity();
    }
    if (n === 3) {
      if (step3SaveCheckboxWrap) {
        step3SaveCheckboxWrap.classList.toggle("give-modal__save-card-wrap--hidden", !isLoggedIn());
      }
      renderSavedCards();
      updateStep3Validity();
    }
  }

  function getSelectedAmount(): number | null {
    const active = modal?.querySelector(".give-modal__amount-option--active") as HTMLElement | null;
    const value = active?.dataset.value;
    if (value && value !== "custom") {
      const n = parseInt(value, 10);
      return Number.isFinite(n) ? n : null;
    }
    if (customBtn?.classList.contains("is-active") && customInput) {
      const err = validateOtherAmount(customInput.value);
      if (err) return null;
      const n = parseFloat(customInput.value.trim());
      return n > 0 ? n : null;
    }
    return null;
  }

  function getSelectedPetId(): number | null {
    const chosen = modal?.querySelector(".give-modal__select-item--chosen") as HTMLElement | null;
    const id = chosen?.dataset.petId;
    if (!id) return null;
    const n = parseInt(id, 10);
    return Number.isFinite(n) ? n : null;
  }

  function getSelectedPetName(): string {
    const chosen = modal?.querySelector(".give-modal__select-item--chosen") as HTMLElement | null;
    return chosen?.textContent?.trim() ?? "";
  }

  function isStep1Valid(): boolean {
    const amount = getSelectedAmount();
    const petId = getSelectedPetId();
    return amount !== null && amount > 0 && petId !== null;
  }

  function updateStep1Validity(): void {
    const step1Next = modal?.querySelector(".give-modal__step[data-step='1'] .give-modal__btn--next") as HTMLButtonElement | null;
    if (step1Next) step1Next.disabled = !isStep1Valid();
  }

  function isStep2Valid(): boolean {
    if (!step2NameInput || !step2EmailInput) return false;
    return validateName(step2NameInput.value) === null && validateEmail(step2EmailInput.value) === null;
  }

  function updateStep2Validity(): void {
    if (step2NextBtn) (step2NextBtn as HTMLButtonElement).disabled = !isStep2Valid();
  }

  function isStep3Valid(): boolean {
    if (!step3CardInput || !step3CvvInput || !step3MonthSelect || !step3YearSelect) return false;
    return (
      validateCard(step3CardInput.value) === null &&
      validateCvv(step3CvvInput.value) === null &&
      validateExp(step3MonthSelect.value, step3YearSelect.value) === null
    );
  }

  function updateStep3Validity(): void {
    if (submitBtn) (submitBtn as HTMLButtonElement).disabled = !isStep3Valid();
  }

  function updateExpSelectEmptyState(): void {
    step3MonthSelect?.classList.toggle("give-modal__select-native--empty", !step3MonthSelect.value);
    step3YearSelect?.classList.toggle("give-modal__select-native--empty", !step3YearSelect.value);
  }

  function setAmount(value: string): void {
    amountOptions?.forEach((btn) => {
      btn.classList.toggle("give-modal__amount-option--active", value !== "" && (btn as HTMLElement).dataset.value === value);
    });
    if (value === "custom") {
      customBtn?.classList.add("is-active");
      customInput?.focus();
    } else {
      customBtn?.classList.remove("is-active");
      if (customInput) customInput.value = "";
    }
    updateStep1Validity();
  }

  function openGiveModal(amount?: string): void {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("give-modal-open");
    document.body.classList.remove("care-modal-open");
    showStep("1");
    setAmount(amount ?? "");
    const step1Next = modal.querySelector(".give-modal__step[data-step='1'] .give-modal__btn--next") as HTMLButtonElement | null;
    if (step1Next) step1Next.disabled = true;
    void ensurePets().then(() => {
      renderPetList();
      updateStep1Validity();
    });
  }

  (window as unknown as { openGiveModal?: (v?: string) => void }).openGiveModal = openGiveModal;

  function resetForm(): void {
    setAmount("");
    if (customInput) customInput.value = "";
    selectList?.querySelectorAll(".give-modal__select-item--chosen").forEach((el) => el.classList.remove("give-modal__select-item--chosen"));
    if (selectText) selectText.textContent = "Choose your favourite";
    selectWrap?.classList.remove("give-modal__select-wrap--chosen");
    if (step2NameInput) step2NameInput.value = "";
    if (step2EmailInput) step2EmailInput.value = "";
    if (step3CardInput) step3CardInput.value = "";
    if (step3CvvInput) step3CvvInput.value = "";
    if (step3MonthSelect) step3MonthSelect.value = "";
    if (step3YearSelect) step3YearSelect.value = "";
    updateExpSelectEmptyState();
    if (step3SavedCardsSelect) step3SavedCardsSelect.value = "";
    const saveCheckbox = modal?.querySelector(".give-modal__save-card") as HTMLInputElement | null;
    if (saveCheckbox) saveCheckbox.checked = false;
    modal?.querySelectorAll(`.${INVALID_CLASS}, .${INVALID_ROW_CLASS}`).forEach((el) => el.classList.remove(INVALID_CLASS, INVALID_ROW_CLASS));
    modal?.querySelectorAll(".give-modal__error").forEach((el) => {
      el.textContent = "";
      (el as HTMLElement).hidden = true;
    });
  }

  function closeGiveModal(): void {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("give-modal-open");
    showStep("1");
    selectWrap?.classList.remove("is-open");
    hideNotification();
    resetForm();
  }

  function openCareModal(): void {
    careModal?.classList.add("is-open");
    careModal?.setAttribute("aria-hidden", "false");
    document.body.classList.add("care-modal-open");
  }

  function closeCareModal(): void {
    careModal?.classList.remove("is-open");
    careModal?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("care-modal-open");
  }

  function showNotification(message: string, isError: boolean): void {
    let toast = modal?.querySelector(".give-modal__toast") as HTMLElement | null;
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "give-modal__toast";
      modal?.querySelector(".give-modal__panel")?.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.toggle("give-modal__toast--error", isError);
    toast.classList.add("give-modal__toast--visible");
  }

  function hideNotification(): void {
    const toast = modal?.querySelector(".give-modal__toast");
    toast?.classList.remove("give-modal__toast--visible");
  }

  function renderSavedCards(): void {
    if (!step3SavedCardsWrap || !step3SavedCardsSelect || !step3CardFieldsWrap) return;
    const cards = getSavedCards();
    if (!isLoggedIn() || cards.length === 0) {
      step3SavedCardsWrap.classList.add("give-modal__saved-cards-wrap--hidden");
      step3CardFieldsWrap?.classList.remove("give-modal__card-fields-wrap--hidden");
      return;
    }
    step3SavedCardsWrap.classList.remove("give-modal__saved-cards-wrap--hidden");
    step3SavedCardsSelect.innerHTML = '<option value="">Select a saved card</option>';
    cards.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.masked;
      step3SavedCardsSelect.appendChild(opt);
    });
    step3SavedCardsSelect.value = "";
    step3CardFieldsWrap?.classList.remove("give-modal__card-fields-wrap--hidden");
  }

  function fillCardFromSaved(card: SavedCard): void {
    if (step3CardInput) step3CardInput.value = card.cardNumber.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
    if (step3CvvInput) step3CvvInput.value = card.cvv;
    if (step3MonthSelect) step3MonthSelect.value = card.expMonth;
    if (step3YearSelect) step3YearSelect.value = card.expYear;
    updateExpSelectEmptyState();
    updateStep3Validity();
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

  careClose?.addEventListener("click", closeCareModal);
  (careBackdrop as HTMLElement)?.addEventListener("click", closeCareModal);
  (backdrop as HTMLElement)?.addEventListener("click", closeGiveModal);

  careAmounts?.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = (btn as HTMLElement).dataset.value ?? "10";
      closeCareModal();
      openGiveModal(value === "other" ? "custom" : value);
    });
  });

  amountOptions?.forEach((btn) => {
    btn.addEventListener("click", () => setAmount((btn as HTMLElement).dataset.value ?? ""));
  });

  customBtn?.addEventListener("click", () => {
    setAmount("custom");
    customInput?.focus();
  });

  customInput?.addEventListener("input", () => {
    let val = customInput?.value ?? "";
    if (/^0+\d/.test(val)) {
      val = val.replace(/^0+(?=\d)/, "");
      customInput!.value = val;
    }
    const dotIdx = val.indexOf(".");
    if (dotIdx !== -1 && val.length - dotIdx - 1 > 2) {
      customInput!.value = val = val.slice(0, dotIdx + 3);
    }
    val = customInput!.value.trim();
    if (val && val !== "0" && parseFloat(val) === 0 && !val.endsWith(".")) {
      customInput!.value = "";
    }
    if (customInput?.value.trim()) setAmount("custom");
    updateStep1Validity();
    const row = customInput?.closest(".give-modal__custom-row");
    const msgEl = row?.querySelector(".give-modal__error") as HTMLElement | null;
    if (row && msgEl && customInput?.value.trim()) {
      const err = validateOtherAmount(customInput.value);
      if (err) {
        row.classList.add(INVALID_ROW_CLASS);
        msgEl.textContent = err;
        msgEl.hidden = false;
      } else {
        row.classList.remove(INVALID_ROW_CLASS);
        msgEl.textContent = "";
        msgEl.hidden = true;
      }
    } else if (row && msgEl && !customInput?.value.trim()) {
      row.classList.remove(INVALID_ROW_CLASS);
      msgEl.textContent = "";
      msgEl.hidden = true;
    }
  });

  customInput?.addEventListener("blur", () => {
    if (customInput?.value.trim()) {
      const err = validateOtherAmount(customInput.value);
      const row = customInput.closest(".give-modal__custom-row");
      const msgEl = row?.querySelector(".give-modal__error") as HTMLElement | null;
      if (msgEl && row) {
        if (err) {
          row.classList.add(INVALID_ROW_CLASS);
          msgEl.textContent = err;
          msgEl.hidden = false;
        } else {
          row.classList.remove(INVALID_ROW_CLASS);
          msgEl.textContent = "";
          msgEl.hidden = true;
        }
      }
    } else {
      const row = customInput?.closest(".give-modal__custom-row");
      const msgEl = row?.querySelector(".give-modal__error") as HTMLElement | null;
      if (row && msgEl) {
        row.classList.remove(INVALID_ROW_CLASS);
        msgEl.textContent = "";
        msgEl.hidden = true;
      }
    }
    updateStep1Validity();
  });

  customInput?.addEventListener("beforeinput", (e) => {
    const data = e.data ?? "";
    if (/[eE+\-]/.test(data)) {
      e.preventDefault();
      return;
    }
    const input = e.target as HTMLInputElement;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const newVal = input.value.slice(0, start) + data + input.value.slice(end);
    if (data) {
      const dotIdx = newVal.indexOf(".");
      if (dotIdx !== -1 && newVal.length - dotIdx - 1 > 2) {
        e.preventDefault();
        return;
      }
    }
    if (data === "0") {
      const newVal0 = input.value.slice(0, start) + "0" + input.value.slice(end);
      const trimmed = newVal0.trim();
      if (trimmed === "0") return;
      if (trimmed && parseFloat(trimmed) === 0 && !trimmed.endsWith(".")) {
        e.preventDefault();
      }
    }
  });

  customInput?.addEventListener("keydown", (e) => {
    if (e.key === "0") {
      const input = e.target as HTMLInputElement;
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;
      const newVal = input.value.slice(0, start) + "0" + input.value.slice(end);
      const trimmed = newVal.trim();
      if (trimmed === "0") return;
      if (trimmed && parseFloat(trimmed) === 0 && !trimmed.endsWith(".")) {
        e.preventDefault();
      }
    }
  });

  selectTrigger?.addEventListener("click", () => {
    selectWrap?.classList.toggle("is-open");
    selectTrigger?.setAttribute("aria-expanded", String(selectWrap?.classList.contains("is-open")));
  });

  selectList?.addEventListener("click", (e) => {
    const item = (e.target as HTMLElement).closest(".give-modal__select-item");
    if (!item) return;
    if (item.getAttribute("data-retry") === "true") {
      selectWrap?.classList.remove("is-open");
      selectTrigger?.setAttribute("aria-expanded", "false");
      petsFetched = false;
      void ensurePets().then(() => {
        renderPetList();
        updateStep1Validity();
      });
      return;
    }
    selectList.querySelectorAll(".give-modal__select-item").forEach((i) => i.classList.remove("give-modal__select-item--chosen"));
    item.classList.add("give-modal__select-item--chosen");
    if (selectText) selectText.textContent = item.textContent?.trim() ?? "";
    selectWrap?.classList.add("give-modal__select-wrap--chosen");
    selectWrap?.classList.remove("is-open");
    selectTrigger?.setAttribute("aria-expanded", "false");
    updateStep1Validity();
  });

  document.addEventListener("click", (e) => {
    if (selectWrap && !selectWrap.contains(e.target as Node)) {
      selectWrap.classList.remove("is-open");
      selectTrigger?.setAttribute("aria-expanded", "false");
    }
  });

  nextBtns?.forEach((btn) => {
    btn.addEventListener("click", () => {
      const goto = (btn as HTMLElement).dataset.goto;
      if (!goto) return;
      const step = Number(goto);
      if (step === 2 && !isStep1Valid()) return;
      if (step === 3 && !isStep2Valid()) return;
      showStep(goto);
    });
  });

  backBtns?.forEach((btn) => {
    btn.addEventListener("click", () => {
      const goto = (btn as HTMLElement).dataset.goto;
      if (goto) showStep(goto);
    });
  });

  if (step2NameInput && step2EmailInput) {
    const nameField = step2NameInput.closest(".give-modal__field");
    const emailField = step2EmailInput.closest(".give-modal__field");
    const nameError = nameField?.querySelector(".give-modal__error") as HTMLElement | null;
    const emailError = emailField?.querySelector(".give-modal__error") as HTMLElement | null;

    step2NameInput.addEventListener("blur", () => {
      const msg = validateName(step2NameInput!.value);
      if (nameField && nameError) (msg ? setFieldInvalid : setFieldValid)(nameField as HTMLElement, nameError, msg ?? "");
      updateStep2Validity();
    });
    step2NameInput.addEventListener("focus", () => {
      if (nameField && nameError) setFieldValid(nameField as HTMLElement, nameError);
      updateStep2Validity();
    });
    step2NameInput.addEventListener("input", () => updateStep2Validity());

    step2EmailInput.addEventListener("blur", () => {
      const msg = validateEmail(step2EmailInput!.value);
      if (emailField && emailError) (msg ? setFieldInvalid : setFieldValid)(emailField as HTMLElement, emailError, msg ?? "");
      updateStep2Validity();
    });
    step2EmailInput.addEventListener("focus", () => {
      if (emailField && emailError) setFieldValid(emailField as HTMLElement, emailError);
      updateStep2Validity();
    });
    step2EmailInput.addEventListener("input", () => updateStep2Validity());
  }

  if (step3SavedCardsSelect) {
    step3SavedCardsSelect.addEventListener("change", () => {
      const id = step3SavedCardsSelect.value;
      if (!id) return;
      const cards = getSavedCards();
      const card = cards.find((c) => c.id === id);
      if (card) fillCardFromSaved(card);
    });
  }

  if (step3CardInput && step3CvvInput && step3MonthSelect && step3YearSelect) {
    const cardField = step3CardInput.closest(".give-modal__field");
    const cvvField = step3CvvInput.closest(".give-modal__field");
    const expField = step3MonthSelect.closest(".give-modal__field--full");
    const cardError = cardField?.querySelector(".give-modal__error") as HTMLElement | null;
    const cvvError = cvvField?.querySelector(".give-modal__error") as HTMLElement | null;
    const expError = expField?.querySelector(".give-modal__error") as HTMLElement | null;

    const updateCardDisplay = (): void => {
      const val = step3CardInput!.value.replace(/\D/g, "");
      const groups = val.match(/.{1,4}/g) ?? [];
      step3CardInput!.value = groups.join(" ").slice(0, 19);
    };

    step3CardInput.addEventListener("input", () => {
      updateCardDisplay();
      updateStep3Validity();
    });
    step3CardInput.addEventListener("blur", () => {
      const msg = validateCard(step3CardInput!.value);
      if (cardField && cardError) (msg ? setFieldInvalid : setFieldValid)(cardField as HTMLElement, cardError, msg ?? "");
      updateStep3Validity();
    });
    step3CardInput.addEventListener("focus", () => {
      if (cardField && cardError) setFieldValid(cardField as HTMLElement, cardError);
    });

    step3CvvInput.addEventListener("input", () => {
      step3CvvInput!.value = step3CvvInput!.value.replace(/\D/g, "").slice(0, 3);
      updateStep3Validity();
    });
    step3CvvInput.addEventListener("blur", () => {
      const msg = validateCvv(step3CvvInput!.value);
      if (cvvField && cvvError) (msg ? setFieldInvalid : setFieldValid)(cvvField as HTMLElement, cvvError, msg ?? "");
      updateStep3Validity();
    });
    step3CvvInput.addEventListener("focus", () => {
      if (cvvField && cvvError) setFieldValid(cvvField as HTMLElement, cvvError);
    });

    const updateExpValidity = (): void => {
      const msg = validateExp(step3MonthSelect!.value, step3YearSelect!.value);
      if (expField && expError) (msg ? setFieldInvalid : setFieldValid)(expField as HTMLElement, expError, msg ?? "");
      updateStep3Validity();
    };
    step3MonthSelect.addEventListener("change", () => {
      updateExpValidity();
      updateExpSelectEmptyState();
    });
    step3YearSelect.addEventListener("change", () => {
      updateExpValidity();
      updateExpSelectEmptyState();
    });
    updateExpSelectEmptyState();
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      const amount = getSelectedAmount();
      const petId = getSelectedPetId();
      const petName = getSelectedPetName();
      if (!amount || !petId || !step2NameInput || !step2EmailInput) return;
      if (!isStep3Valid()) return;

      const saveCheckbox = modal?.querySelector(".give-modal__save-card") as HTMLInputElement | null;
      const shouldSave = isLoggedIn() && saveCheckbox?.checked;

      const cardNum = step3CardInput?.value.replace(/\s/g, "") ?? "";
      const cvv = step3CvvInput?.value ?? "";
      const month = step3MonthSelect?.value ?? "";
      const year = step3YearSelect?.value ?? "";

      if (shouldSave && cardNum.length === 16) {
        saveCard({
          last4: cardNum.slice(-4),
          masked: maskCardNumber(cardNum),
          cardNumber: cardNum,
          expMonth: month,
          expYear: year,
          cvv,
        });
      }

      (submitBtn as HTMLButtonElement).disabled = true;

      try {
        await submitDonation({
          name: step2NameInput.value.trim(),
          email: step2EmailInput.value.trim(),
          amount,
          petId,
        });
        showNotification(
          SUCCESS_MSG.replace("[amount]", `$${amount}`).replace("[pet name]", petName || "your chosen pet"),
          false
        );
        setTimeout(() => {
          closeGiveModal();
        }, 2500);
      } catch {
        showNotification(ERROR_MSG, true);
      } finally {
        (submitBtn as HTMLButtonElement).disabled = false;
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (careModal?.classList.contains("is-open")) closeCareModal();
    else if (modal?.classList.contains("is-open")) closeGiveModal();
  });

  updateStep1Validity();
}
