import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import client from '../api/client';
import { logger } from '../utils/env';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides auth state (user, token) with localStorage persistence and sync. */
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const t = localStorage.getItem('auth_token');
    const u = localStorage.getItem('auth_user');
    if (t) setToken(t);
    if (u) setUser(JSON.parse(u));
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (token) localStorage.setItem('auth_token', token);
    else localStorage.removeItem('auth_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user));
    else localStorage.removeItem('auth_user');
  }, [user]);

  // PUBLIC_INTERFACE
  const setUserAndToken = (u, t) => {
    setUser(u);
    setToken(t);
  };

  // PUBLIC_INTERFACE
  const logout = async () => {
    try {
      await client.post('/auth/logout', null, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    } catch (e) {
      logger.warn('Logout request failed silently', e);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  // PUBLIC_INTERFACE
  const value = useMemo(() => ({ user, token, setUserAndToken, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access the AuthContext. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
