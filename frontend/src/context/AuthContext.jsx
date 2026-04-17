import { createContext, useContext, useState, useCallback } from 'react';
import { apiLogin } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ers_user')); }
    catch { return null; }
  });

  const login = useCallback(async (email, password) => {
    const { data } = await apiLogin(email, password);
    localStorage.setItem('ers_token', data.token);
    localStorage.setItem('ers_user',  JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ers_token');
    localStorage.removeItem('ers_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
