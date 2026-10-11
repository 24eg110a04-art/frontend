import { describe, expect, it } from 'vitest';
import { hasErrors, validateAmount, validateDate, validateEmail, validateName, validatePassword } from '../utils/validators.js';
import { todayISO } from '../utils/format.js';

describe('validators', () => {
  it('validates email', () => {
    expect(validateEmail('')).toBe('Email is required');
    expect(validateEmail('not-an-email')).toBe('Enter a valid email address');
    expect(validateEmail('kiran@example.com')).toBe('');
  });

  it('validates password strength', () => {
    expect(validatePassword('')).toBe('Password is required');
    expect(validatePassword('short1')).toMatch(/at least 8/);
    expect(validatePassword('onlyletters')).toMatch(/letter and one number/);
    expect(validatePassword('Secret123')).toBe('');
  });

  it('validates name', () => {
    expect(validateName(' ')).toBe('Full name is required');
    expect(validateName('Kiran Kumar')).toBe('');
  });

  it('requires amounts greater than 0', () => {
    expect(validateAmount('')).toBe('Amount is required');
    expect(validateAmount('0')).toBe('Amount must be greater than 0');
    expect(validateAmount('-5')).toBe('Amount must be greater than 0');
    expect(validateAmount('abc')).toBe('Amount must be a number');
    expect(validateAmount('120.50')).toBe('');
    expect(validateAmount('', 'Budget amount')).toBe('Budget amount is required');
  });

  it('validates dates', () => {
    expect(validateDate('')).toBe('Date is required');
    expect(validateDate('2026-02-31')).toBe('Enter a valid date');
    expect(validateDate('1999-01-01')).toBe('Date must be 2000 or later');
    expect(validateDate('2999-01-01')).toBe('Date cannot be in the future');
    expect(validateDate(todayISO())).toBe('');
  });

  it('detects errors in a map', () => {
    expect(hasErrors({ a: '', b: '' })).toBe(false);
    expect(hasErrors({ a: '', b: 'bad' })).toBe(true);
  });
});
