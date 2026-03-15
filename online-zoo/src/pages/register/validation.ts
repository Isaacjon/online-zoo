import {
  validateLogin as validateLoginBase,
  validatePassword as validatePasswordBase,
} from "../sign-in/validation";

export { validateLoginBase as validateLogin };
export { validatePasswordBase as validatePassword };

const NAME_MIN_LENGTH = 3;
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function validateName(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length < NAME_MIN_LENGTH) {
    return "Name must be at least 3 characters";
  }
  if (!/^[a-zA-Z]+$/.test(trimmed)) {
    return "Name must contain only English letters";
  }
  return null;
}

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "Email is required";
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return "Please enter a valid email address";
  }
  return null;
}

export function validateConfirmPassword(
  password: string,
  confirm: string
): string | null {
  const passwordError = validatePasswordBase(confirm);
  if (passwordError) return passwordError;
  if (password !== confirm) {
    return "Passwords must match";
  }
  return null;
}
