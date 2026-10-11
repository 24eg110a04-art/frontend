import api from './api.js';

// params: { search, type, category, from, to, page, size }
export const getTransactions = (params = {}) => {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null));
  return api.get('/transactions', { params: clean }).then((r) => r.data);
};
export const getTransaction = (id) => api.get(`/transactions/${id}`).then((r) => r.data);
export const createTransaction = (payload) => api.post('/transactions', payload).then((r) => r.data);
export const updateTransaction = (id, payload) => api.put(`/transactions/${id}`, payload).then((r) => r.data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`).then((r) => r.data);
