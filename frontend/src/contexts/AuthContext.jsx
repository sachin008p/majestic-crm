import React, { createContext, useState, useEffect } from 'react';
import { login as loginApi } from '../services/authService';
// Helper to derive a display name from an email address
const deriveNameFromEmail = (email) => {
  if (!email) return '';
  const namePart = email.split('@')[0];
  const words = namePart.replace(/[._-]+/g, ' ').split(' ');
  return words.filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};
export const AuthContext = createContext();
const TOKEN_KEY = 'crm_token';
const USER_KEY = 'crm_user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (!parsed.name && parsed.email) {
        parsed.name = deriveNameFromEmail(parsed.email);
        localStorage.setItem(USER_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
    return null;
  });

  const isAuthenticated = !!token;

  const login = async (email, password) => {
    try {
      const data = await loginApi(email, password);

      if (data && data.token) {
        const loggedInUser = {
          id: data.id,
          name: data.name || deriveNameFromEmail(data.email),
          email: data.email || email,
          roles: data.roles || [],
          phone: data.phone,
          lastLogin: data.lastLogin
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
    <AuthContext.Provider value={{ token, user, setUser, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
