import React, { createContext, useState, useEffect } from 'react';
import { login as loginApi } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const tokenKey = import.meta.env.VITE_JWT_TOKEN_KEY || 'crm_token';
  const [token, setToken] = useState(localStorage.getItem(tokenKey) || null);
  const [user, setUser] = useState(null);

  const isAuthenticated = !!token;

  const login = async (email, password) => {
    try {
      const data = await loginApi(email, password);
      if (data && data.token) {
        localStorage.setItem(tokenKey, data.token);
        setToken(data.token);
        setUser({ email, name: data.name || '' });
        return { success: true };
      }
      return { success: false, error: data?.message || 'Login failed' };
    } catch (e) {
      return { success: false, error: 'Backend unreachable. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem(tokenKey);
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      // token exists
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};