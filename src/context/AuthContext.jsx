import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import * as authService from '../services/authService.js';
import { TOKEN_KEY, USER_KEY } from '../services/api.js';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    if (!sessionStorage.getItem(TOKEN_KEY)) return null;
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // The JWT lives in sessionStorage: it is cleared when the tab closes and is never
  // written to localStorage or cookies.
  const [user, setUser] = useState(readStoredUser);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    const profile = { id: data.id, name: data.name, email: data.email };
    sessionStorage.setItem(TOKEN_KEY, data.token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(profile));
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      toast.error('Your session expired. Please log in again.');
    };
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  const value = useMemo(() => ({ user, isAuthenticated: !!user, login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
