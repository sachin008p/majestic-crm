import React, { createContext, useState, useEffect } from 'react';
import { login as loginApi } from '../services/authService';

export const AuthContext = createContext();
const TOKEN_KEY = 'crm_token';
const USER_KEY = 'crm_user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = !!token;

  const login = async (email, password) => {
    try {
      const data = await loginApi(email, password);

      if (data && data.token) {
        const loggedInUser = {
          id: data.id,
          email: data.email || email,
          roles: data.roles || [],
        };

        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
        setToken(data.token);
        setUser(loggedInUser);

        return { success: true };
      }

      return { success: false, error: data?.message || 'Login failed' };
    } catch (e) {
      return { success: false, error: 'Backend unreachable. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const handleForcedLogout = () => logout();
    window.addEventListener('logout', handleForcedLogout);
    return () => window.removeEventListener('logout', handleForcedLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
