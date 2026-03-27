export interface ValidationResult {
  valid: boolean;
  message: string;
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim() === '') {
    return { valid: false, message: `${fieldName} is required.` };
  }
  return { valid: true, message: '' };
}

export function validateEmail(value: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return { valid: false, message: 'Please enter a valid email address.' };
  }
  return { valid: true, message: '' };
}

export interface PasswordValidationResult {
  valid: boolean;
  messages: string[];
}

export function validatePassword(value: string): PasswordValidationResult {
  const messages: string[] = [];

  if (value.length < 8) {
    messages.push('Password must be at least 8 characters.');
  }
  if (!/[A-Z]/.test(value)) {
    messages.push('Password must contain at least one uppercase letter.');
  }
  if (!/[a-z]/.test(value)) {
    messages.push('Password must contain at least one lowercase letter.');
  }
  if (!/[0-9]/.test(value)) {
    messages.push('Password must contain at least one number.');
  }
  if (!/[@$!%*?&]/.test(value)) {
    messages.push('Password must contain at least one special character (@$!%*?&).');
  }

  return { valid: messages.length === 0, messages };
}

export function validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match.' };
  }
  return { valid: true, message: '' };
}
