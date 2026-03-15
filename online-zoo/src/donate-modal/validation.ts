export function validateOtherAmount(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Enter an amount";
  if (/[eE]/.test(trimmed)) return "Scientific notation is not allowed";
  if (trimmed.endsWith(".")) return null;
  if (!/^\d+(\.\d{0,2})?$/.test(trimmed)) return "Enter a valid number";
  const num = parseFloat(trimmed);
  if (!Number.isFinite(num) || num <= 0) return "Amount must be greater than 0";
  return null;
}

export function validateName(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Name is required";
  if (!/^[a-zA-Z\s]+$/.test(trimmed)) return "Name must contain only letters and spaces";
  if (trimmed.length < 3) return "Name must be at least 3 characters";
  return null;
}

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Email is required";
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(trimmed)) return "Enter a valid email address";
  return null;
}

export function validateCard(value: string): string | null {
  const digits = value.replace(/\s/g, "");
  if (digits.length !== 16) return "Card number must be 16 digits";
  if (!/^\d+$/.test(digits)) return "Card number must contain only digits";
  return null;
}

export function validateCvv(value: string): string | null {
  if (value.length !== 3) return "CVV must be 3 digits";
  if (!/^\d+$/.test(value)) return "CVV must contain only digits";
  return null;
}

export function validateExp(month: string, year: string): string | null {
  if (!month || !year) return "Select expiration date";
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (m < 1 || m > 12) return "Invalid month";
  const fullYear = y >= 100 ? y : 2000 + y;
  const now = new Date();
  const expDate = new Date(fullYear, m - 1);
  if (expDate <= now) return "Expiration date must be in the future";
  return null;
}
