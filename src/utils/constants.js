// Categories are plain strings stored as-is by the backend, so adding a category
// later only means adding it to one of these lists.
export const EXPENSE_CATEGORIES = [
  'Food', 'Shopping', 'Transport', 'Education', 'Entertainment', 'Health',
  'Bills', 'Rent', 'Travel', 'Groceries', 'Other',
];

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Other'];

export const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])].sort();

export const PAYMENT_METHODS = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const CURRENCY = 'INR';
export const LOCALE = 'en-IN';

export const CHART_COLORS = [
  '#0F6B5C', '#E8A220', '#D9482B', '#3B6FB6', '#8A5FBF', '#2F9E8F',
  '#C2547A', '#7C8B3A', '#5A6B66', '#B5651D', '#4D9DE0',
];
