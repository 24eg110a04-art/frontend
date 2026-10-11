import api from './api.js';

export const getSummary = () => api.get('/dashboard/summary').then((r) => r.data);
export const getMonthly = (months = 6) => api.get('/dashboard/monthly', { params: { months } }).then((r) => r.data);
export const getCategories = () => api.get('/dashboard/categories').then((r) => r.data);
