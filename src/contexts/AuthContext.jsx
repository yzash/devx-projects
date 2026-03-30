import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ceo_auth_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback((newToken, userData = null) => {
    localStorage.setItem('ceo_auth_token', newToken);
    setToken(newToken);
    if (userData) setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {}
    localStorage.removeItem('ceo_auth_token');
    setToken(null);
    setUser(null);
  }, []);

  // Check URL for token (OAuth callback)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const authError = params.get('auth_error');

    if (urlToken) {
      login(urlToken);
      window.history.replaceState({}, '', window.location.pathname);
    } else if (authError) {
      console.error('Auth error:', authError);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [login]);

  // Try demo auto-auth on load
  useEffect(() => {
    async function init() {
      const storedToken = localStorage.getItem('ceo_auth_token');

      if (storedToken) {
        try {
          const res = await api.get('/auth/status');
          setUser(res.data.user);
          setLoading(false);
          return;
        } catch (_) {
          localStorage.removeItem('ceo_auth_token');
          setToken(null);
        }
      }

      // Try demo auth
      try {
        const res = await api.get('/auth/demo');
        if (res.data.token) {
          login(res.data.token, res.data.user);
        }
      } catch (err) {
        console.warn('Demo auth not available:', err.message);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [login]);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
