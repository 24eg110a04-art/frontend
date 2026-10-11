import axios from 'axios';

export const TOKEN_KEY = 'et_token';
export const USER_KEY = 'et_user';

// The API URL comes from the environment (see .env) - never hardcode it in components.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export function extractErrorMessage(error) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (!error?.response) return 'Cannot reach the server. Check that the backend is running on port 8080.';
  return 'Something went wrong. Please try again.';
}

// Request interceptor: attach the JWT to every call.
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: normalise errors and handle expired sessions.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall = (error.config?.url || '').startsWith('/auth/');
    if (error.response?.status === 401 && !isAuthCall && sessionStorage.getItem(TOKEN_KEY)) {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      window.dispatchEvent(new Event('auth:expired'));
    }
    error.userMessage = extractErrorMessage(error);
    return Promise.reject(error);
  }
);

export default api;
