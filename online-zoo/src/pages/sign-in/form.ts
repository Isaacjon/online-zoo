import { login as authLogin } from "../../auth";
import {
  validateLogin,
  validatePassword,
  FORM_ERROR_MESSAGE,
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

export function initSignInForm(): void {
  const form = document.getElementById("sign-in-form") as HTMLFormElement | null;
  const loginInput = document.getElementById(
    "sign-in-login"
  ) as HTMLInputElement | null;
  const passwordInput = document.getElementById(
    "sign-in-password"
  ) as HTMLInputElement | null;
  const loginRow = document.getElementById("login-row");
  const passwordRow = document.getElementById("password-row");
  const loginError = document.getElementById("login-error");
  const passwordError = document.getElementById("password-error");
  const formError = document.getElementById("form-error");
  const submitBtn = document.getElementById(
    "sign-in-btn"
  ) as HTMLButtonElement | null;

  if (
    !form ||
    !loginInput ||
    !passwordInput ||
    !loginRow ||
    !passwordRow ||
    !loginError ||
    !passwordError ||
    !formError ||
    !submitBtn
  ) {
    return;
  }

  let skipBlurValidation = false;

  function isFormValid(): boolean {
    return (
      validateLogin(loginInput!.value.trim()) === null &&
      validatePassword(passwordInput!.value) === null
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
    const value = loginInput!.value.trim();
    const msg = validateLogin(value);
    if (msg) {
      setFieldInvalid(loginRow!, loginError!, msg);
    } else {
      setFieldValid(loginRow!, loginError!);
    }
    updateSubmitButton();
  }

  function handlePasswordBlur(): void {
    if (skipBlurValidation) {
      skipBlurValidation = false;
      updateSubmitButton();
      return;
    }
    const value = passwordInput!.value;
    const msg = validatePassword(value);
    if (msg) {
      setFieldInvalid(passwordRow!, passwordError!, msg);
    } else {
      setFieldValid(passwordRow!, passwordError!);
    }
    updateSubmitButton();
  }

  function handleLoginFocus(): void {
    loginInput!.removeAttribute("readonly");
    setFieldValid(loginRow!, loginError!);
    formError!.textContent = "";
    updateSubmitButton();
  }

  function handlePasswordFocus(): void {
    passwordInput!.removeAttribute("readonly");
    setFieldValid(passwordRow!, passwordError!);
    formError!.textContent = "";
    updateSubmitButton();
  }

  function initPasswordToggle(): void {
    const passwordToggle = form!.querySelector(
      ".feedback-form__password-toggle"
    ) as HTMLButtonElement | null;
    const passwordToggleIcon = passwordToggle?.querySelector("img");
    if (!passwordToggle || !passwordToggleIcon) return;

    passwordToggle.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    passwordToggle.addEventListener("click", () => {
      const isPassword = passwordInput!.type === "password";
      passwordInput!.type = isPassword ? "text" : "password";
      passwordToggleIcon.src = isPassword
        ? "../../assets/icons/eye-off.svg"
        : "../../assets/icons/eye.svg";
      const label = isPassword ? "Hide password" : "Show password";
      passwordToggle.setAttribute("aria-label", label);
      passwordToggle.setAttribute("title", label);
    });
  }

  function handleSubmit(e: Event): void {
    e.preventDefault();
    formError!.textContent = "";

    const loginValue = loginInput!.value.trim();
    const passwordValue = passwordInput!.value;
    const loginMsg = validateLogin(loginValue);
    const passwordMsg = validatePassword(passwordValue);

    if (loginMsg) setFieldInvalid(loginRow!, loginError!, loginMsg);
    if (passwordMsg) setFieldInvalid(passwordRow!, passwordError!, passwordMsg);
    if (loginMsg || passwordMsg) return;

    submitBtn!.disabled = true;
    submitBtn!.classList.add("is-loading");

    authLogin({ login: loginValue, password: passwordValue })
      .then(() => {
        window.location.href = "../landing/index.html";
      })
      .catch(() => {
        formError!.textContent = FORM_ERROR_MESSAGE;
        submitBtn!.disabled = false;
        submitBtn!.classList.remove("is-loading");
      });
  }

  submitBtn.addEventListener("mousedown", () => {
    skipBlurValidation = true;
  });

  function preventSpace(e: KeyboardEvent): void {
    if (e.key === " ") e.preventDefault();
  }

  loginInput.addEventListener("blur", handleLoginBlur);
  loginInput.addEventListener("focus", handleLoginFocus);
  loginInput.addEventListener("input", updateSubmitButton);
  loginInput.addEventListener("keydown", preventSpace);

  passwordInput.addEventListener("blur", handlePasswordBlur);
  passwordInput.addEventListener("focus", handlePasswordFocus);
  passwordInput.addEventListener("input", updateSubmitButton);
  passwordInput.addEventListener("keydown", preventSpace);

  initPasswordToggle();
  form!.addEventListener("submit", handleSubmit);

  updateSubmitButton();

  if (
    document.activeElement === loginInput ||
    document.activeElement === passwordInput
  ) {
    skipBlurValidation = true;
    (document.activeElement as HTMLElement).blur();
  }
}
