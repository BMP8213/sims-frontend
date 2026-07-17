import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, logout as logoutRequest } from '../services/authService.js';

const AuthContext = createContext(null);

const initialUser = () => {
  const stored = localStorage.getItem('sims_user');
  return stored ? JSON.parse(stored) : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(() => localStorage.getItem('sims_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      localStorage.setItem('sims_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sims_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('sims_token', token);
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('sims_token');
      localStorage.removeItem('access_token');
    }
  }, [token]);

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
      setError('Session expired. Please sign in again.');
      sessionStorage.removeItem('sims_token');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      localStorage.removeItem('sims_token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('sims_user');
    };

    window.addEventListener('sims:auth:expired', handleAuthExpired);
    return () => window.removeEventListener('sims:auth:expired', handleAuthExpired);
  }, []);

  const login = async (credentials, remember) => {
    setLoading(true);
    setError('');
    try {
      const response = await loginRequest(credentials);
      setUser(response.user);
      setToken(response.token);
      if (remember) {
        localStorage.setItem('sims_token', response.token);
        localStorage.setItem('access_token', response.token);
        localStorage.setItem('refresh_token', response.refreshToken || '');
      } else {
        sessionStorage.setItem('sims_token', response.token);
        sessionStorage.setItem('access_token', response.token);
        sessionStorage.setItem('refresh_token', response.refreshToken || '');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('sims_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  };

  const value = useMemo(
    () => ({ user, token, loading, error, login, logout }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
