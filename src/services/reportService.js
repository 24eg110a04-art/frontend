import api from './api.js';

export const getDaily = (days = 14) => api.get('/reports/daily', { params: { days } }).then((r) => r.data);
export const getWeekly = (weeks = 8) => api.get('/reports/weekly', { params: { weeks } }).then((r) => r.data);
export const getMonthly = (months = 12) => api.get('/reports/monthly', { params: { months } }).then((r) => r.data);
export const getCategoryReport = (type = 'EXPENSE') =>
  api.get('/reports/category', { params: { type } }).then((r) => r.data);
