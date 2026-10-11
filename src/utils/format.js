import { CURRENCY, LOCALE, MONTH_NAMES } from './constants.js';

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 2,
});

export function formatCurrency(value) {
  const number = Number(value);
  return currencyFormatter.format(Number.isFinite(number) ? number : 0);
}

/** Compact axis labels such as 1.2K or 3L. */
export function formatCompact(value) {
  return new Intl.NumberFormat(LOCALE, { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value) || 0);
}

/** Parses "2026-10-05" as a local date (avoids the UTC shift of new Date("2026-10-05")). */
export function parseISODate(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function formatDate(iso) {
  if (!iso) return '';
  return parseISODate(iso).toLocaleDateString(LOCALE, { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatShortDate(iso) {
  return parseISODate(iso).toLocaleDateString(LOCALE, { day: 'numeric', month: 'short' });
}

/** Today as yyyy-MM-dd in the user's local time zone. */
export function todayISO() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function monthName(month) {
  return MONTH_NAMES[month - 1] || '';
}
