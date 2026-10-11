import api from './api.js';

export const getBudgets = () => api.get('/budgets').then((r) => r.data);
export const createBudget = (payload) => api.post('/budgets', payload).then((r) => r.data);
export const updateBudget = (id, payload) => api.put(`/budgets/${id}`, payload).then((r) => r.data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`).then((r) => r.data);
