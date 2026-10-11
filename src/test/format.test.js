import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDate, monthName, parseISODate, todayISO } from '../utils/format.js';

describe('format helpers', () => {
  it('formats currency with two decimals', () => {
    expect(formatCurrency(1234.5)).toContain('1,234.50');
    expect(formatCurrency(null)).toContain('0.00');
  });

  it('parses ISO dates as local dates', () => {
    const d = parseISODate('2026-10-05');
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 9, 5]);
  });

  it('formats dates for display', () => {
    expect(formatDate('2026-10-05')).toMatch(/0?5\s+Oct\s+2026/);
    expect(formatDate('')).toBe('');
  });

  it('returns today in yyyy-MM-dd form and month names', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(monthName(1)).toBe('January');
    expect(monthName(12)).toBe('December');
  });
});
