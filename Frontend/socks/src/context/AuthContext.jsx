import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../Services/authService';
import { setAuthToken } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('user_email');
    if (token) setAuthToken(token);
    return token ? { email, token } : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loginUser = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(email, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user_email', email);
      setAuthToken(res.token);
      setUser({ email, token: res.token });
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    setUser(null);
  };

  const setUserFromToken = (token, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user_email', email);
    setAuthToken(token);
    setUser({ email, token });
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, loginUser, logout, setUserFromToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export default AuthContext;
