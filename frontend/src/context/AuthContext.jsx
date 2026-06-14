import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { apiLogin } from '../services/api';

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem('ers_user');
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    localStorage.removeItem('ers_user');
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [token, setToken] = useState(() => localStorage.getItem('ers_token'));

  const isAuthenticated = Boolean(token && user);

  const login = useCallback(async (email, password) => {
    const response = await apiLogin(email, password);
    const authUser = response?.data ?? response;
    const nextToken = authUser?.token ?? null;

    if (nextToken) {
      localStorage.setItem('ers_token', nextToken);
      setToken(nextToken);
    }

    localStorage.setItem('ers_user', JSON.stringify(authUser));
    setUser(authUser);

    return authUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ers_token');
    localStorage.removeItem('ers_user');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, isAuthenticated, login, logout }),
    [user, token, isAuthenticated, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
