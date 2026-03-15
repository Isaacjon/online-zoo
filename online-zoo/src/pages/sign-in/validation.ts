const LOGIN_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 6;
const SPECIAL_CHAR = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export function validateLogin(value: string): string | null {
  if (value.length < LOGIN_MIN_LENGTH) {
    return "Login must be at least 3 characters";
  }
  if (!/^[a-zA-Z]/.test(value)) {
    return "Login must start with a letter";
  }
  if (!/^[a-zA-Z]+$/.test(value)) {
    return "Login must contain only English letters";
  }
  return null;
}

export function validatePassword(value: string): string | null {
  if (value.length < PASSWORD_MIN_LENGTH) {
    return "Password must be at least 6 characters";
  }
  if (!SPECIAL_CHAR.test(value)) {
    return "Password must contain at least one special character";
  }
  return null;
}

export const FORM_ERROR_MESSAGE = "Incorrect login or password";
