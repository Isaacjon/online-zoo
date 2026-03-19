import { register as authRegister } from "../../auth";
import { ApiError } from "../../api/client";
import {
  validateLogin,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validateEmail,
} from "./validation";

const INVALID_CLASS = "feedback-form__row--invalid";

function setFieldInvalid(
  row: HTMLElement,
  errorEl: HTMLElement,
  message: string
): void {
  row.classList.add(INVALID_CLASS);
  errorEl.textContent = message;
}

function setFieldValid(row: HTMLElement, errorEl: HTMLElement): void {
  row.classList.remove(INVALID_CLASS);
  errorEl.textContent = "";
}

export function initRegisterForm(): void {
  const form = document.getElementById(
    "register-form"
  ) as HTMLFormElement | null;
  const loginInput = document.getElementById(
    "register-login"
  ) as HTMLInputElement | null;
  const passwordInput = document.getElementById(
    "register-password"
  ) as HTMLInputElement | null;
  const confirmInput = document.getElementById(
    "register-confirm"
  ) as HTMLInputElement | null;
  const nameInput = document.getElementById(
    "register-name"
  ) as HTMLInputElement | null;
  const emailInput = document.getElementById(
    "register-email"
  ) as HTMLInputElement | null;
  const loginRow = document.getElementById("register-login-row");
  const passwordRow = document.getElementById("register-password-row");
  const confirmRow = document.getElementById("register-confirm-row");
  const nameRow = document.getElementById("register-name-row");
  const emailRow = document.getElementById("register-email-row");
  const loginError = document.getElementById("register-login-error");
  const passwordError = document.getElementById("register-password-error");
  const confirmError = document.getElementById("register-confirm-error");
  const nameError = document.getElementById("register-name-error");
  const emailError = document.getElementById("register-email-error");
  const formError = document.getElementById("register-form-error");
  const submitBtn = document.getElementById(
    "register-btn"
  ) as HTMLButtonElement | null;

  const elements = {
    form,
    loginInput,
    passwordInput,
    confirmInput,
    nameInput,
    emailInput,
    loginRow,
    passwordRow,
    confirmRow,
    nameRow,
    emailRow,
    loginError,
    passwordError,
    confirmError,
    nameError,
    emailError,
    formError,
    submitBtn,
  };

  if (Object.values(elements).some((el) => !el)) {
    return;
  }

  let skipBlurValidation = false;

  function isFormValid(): boolean {
    const login = loginInput!.value.trim();
    const password = passwordInput!.value;
    const confirm = confirmInput!.value;
    const name = nameInput!.value.trim();
    const email = emailInput!.value.trim();

    return (
      validateLogin(login) === null &&
      validatePassword(password) === null &&
      validateConfirmPassword(password, confirm) === null &&
      validateName(name) === null &&
      validateEmail(email) === null
    );
  }

  function updateSubmitButton(): void {
    submitBtn!.disabled = !isFormValid();
  }

  function handleLoginBlur(): void {
    if (skipBlurValidation) {
      skipBlurValidation = false;
      updateSubmitButton();
      return;
    }
    const msg = validateLogin(loginInput!.value.trim());
    if (msg) setFieldInvalid(loginRow!, loginError!, msg);
    else setFieldValid(loginRow!, loginError!);
    updateSubmitButton();
  }

  function handlePasswordBlur(): void {
    if (skipBlurValidation) {
      skipBlurValidation = false;
      updateSubmitButton();
      return;
    }
    const msg = validatePassword(passwordInput!.value);
    if (msg) setFieldInvalid(passwordRow!, passwordError!, msg);
    else setFieldValid(passwordRow!, passwordError!);
    updateSubmitButton();
  }

  function handleConfirmBlur(): void {
    if (skipBlurValidation) {
      skipBlurValidation = false;
      updateSubmitButton();
      return;
    }
    const msg = validateConfirmPassword(
      passwordInput!.value,
      confirmInput!.value
    );
    if (msg) setFieldInvalid(confirmRow!, confirmError!, msg);
    else setFieldValid(confirmRow!, confirmError!);
    updateSubmitButton();
  }

  function handleNameBlur(): void {
    if (skipBlurValidation) {
      skipBlurValidation = false;
      updateSubmitButton();
      return;
    }
    const msg = validateName(nameInput!.value.trim());
    if (msg) setFieldInvalid(nameRow!, nameError!, msg);
    else setFieldValid(nameRow!, nameError!);
    updateSubmitButton();
  }

  function handleEmailBlur(): void {
    if (skipBlurValidation) {
      skipBlurValidation = false;
      updateSubmitButton();
      return;
    }
    const msg = validateEmail(emailInput!.value.trim());
    if (msg) setFieldInvalid(emailRow!, emailError!, msg);
    else setFieldValid(emailRow!, emailError!);
    updateSubmitButton();
  }

  function clearFieldOnFocus(
    row: HTMLElement,
    errorEl: HTMLElement
  ): void {
    setFieldValid(row, errorEl);
    formError!.textContent = "";
    updateSubmitButton();
  }

  function initPasswordToggle(
    input: HTMLInputElement,
    toggleSelector: string,
    iconPathOn: string,
    iconPathOff: string
  ): void {
    const toggle = form!.querySelector(toggleSelector) as HTMLButtonElement | null;
    const icon = toggle?.querySelector("img");
    if (!toggle || !icon) return;

    toggle.addEventListener("mousedown", (e) => e.preventDefault());
    toggle.addEventListener("click", () => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      icon.src = isPassword ? iconPathOn : iconPathOff;
      const label = isPassword ? "Hide password" : "Show password";
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("title", label);
    });
  }

  function handleSubmit(e: Event): void {
    e.preventDefault();
    formError!.textContent = "";

    const login = loginInput!.value.trim();
    const password = passwordInput!.value;
    const confirm = confirmInput!.value;
    const name = nameInput!.value.trim();
    const email = emailInput!.value.trim();

    const loginMsg = validateLogin(login);
    const passwordMsg = validatePassword(password);
    const confirmMsg = validateConfirmPassword(password, confirm);
    const nameMsg = validateName(name);
    const emailMsg = validateEmail(email);

    if (loginMsg) setFieldInvalid(loginRow!, loginError!, loginMsg);
    if (passwordMsg) setFieldInvalid(passwordRow!, passwordError!, passwordMsg);
    if (confirmMsg) setFieldInvalid(confirmRow!, confirmError!, confirmMsg);
    if (nameMsg) setFieldInvalid(nameRow!, nameError!, nameMsg);
    if (emailMsg) setFieldInvalid(emailRow!, emailError!, emailMsg);
    if (loginMsg || passwordMsg || confirmMsg || nameMsg || emailMsg) return;

    submitBtn!.disabled = true;
    submitBtn!.classList.add("is-loading");

    authRegister({ login, password, name, email })
      .then(() => {
        window.location.href = "../landing/index.html";
      })
      .catch((err: unknown) => {
        const message =
          err instanceof ApiError ? err.message : "Something went wrong. Please, try again later.";
        formError!.textContent = message;
        submitBtn!.disabled = false;
        submitBtn!.classList.remove("is-loading");
      });
  }

  submitBtn!.addEventListener("mousedown", () => {
    skipBlurValidation = true;
  });

  function preventSpace(e: KeyboardEvent): void {
    if (e.key === " ") e.preventDefault();
  }

  const blurHandlers: [HTMLInputElement, () => void][] = [
    [loginInput!, handleLoginBlur],
    [passwordInput!, handlePasswordBlur],
    [confirmInput!, handleConfirmBlur],
    [nameInput!, handleNameBlur],
    [emailInput!, handleEmailBlur],
  ];

  const focusHandlers: [HTMLInputElement, HTMLElement, HTMLElement][] = [
    [loginInput!, loginRow!, loginError!],
    [passwordInput!, passwordRow!, passwordError!],
    [confirmInput!, confirmRow!, confirmError!],
    [nameInput!, nameRow!, nameError!],
    [emailInput!, emailRow!, emailError!],
  ];

  blurHandlers.forEach(([input, handler]) => {
    input.addEventListener("blur", handler);
    input.addEventListener("input", updateSubmitButton);
    input.addEventListener("keydown", preventSpace);
  });

  focusHandlers.forEach(([input, row, errorEl]) => {
    input.addEventListener("focus", () => {
      input.removeAttribute("readonly");
      clearFieldOnFocus(row, errorEl);
    });
  });

  initPasswordToggle(
    passwordInput!,
    "#register-password-toggle",
    "../../assets/icons/eye-off.svg",
    "../../assets/icons/eye.svg"
  );
  initPasswordToggle(
    confirmInput!,
    "#register-confirm-toggle",
    "../../assets/icons/eye-off.svg",
    "../../assets/icons/eye.svg"
  );

  form!.addEventListener("submit", handleSubmit);

  updateSubmitButton();

  const active = document.activeElement;
  const inputs = [loginInput, passwordInput, confirmInput, nameInput, emailInput];
  if (active && inputs.some((el) => el === active)) {
    skipBlurValidation = true;
    (active as HTMLElement).blur();
  }
}
