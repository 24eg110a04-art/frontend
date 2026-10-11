const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(email) {
  if (!email || !email.trim()) return 'Email is required';
  if (!EMAIL_PATTERN.test(email.trim())) return 'Enter a valid email address';
  return '';
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Password must include at least one letter and one number';
  }
  return '';
}

export function validateName(name) {
  if (!name || !name.trim()) return 'Full name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
}

export function validateAmount(value, label = 'Amount') {
  if (value === '' || value === null || value === undefined) return `${label} is required`;
  const number = Number(value);
  if (!Number.isFinite(number)) return `${label} must be a number`;
  if (number <= 0) return `${label} must be greater than 0`;
  if (number > 9999999999.99) return `${label} is too large`;
  return '';
}

export function validateDate(value) {
  if (!value) return 'Date is required';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Enter a valid date';
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return 'Enter a valid date';
  if (y < 2000) return 'Date must be 2000 or later';
  const limit = new Date();
  limit.setDate(limit.getDate() + 1);
  limit.setHours(23, 59, 59, 999);
  if (date > limit) return 'Date cannot be in the future';
  return '';
}

export function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}
