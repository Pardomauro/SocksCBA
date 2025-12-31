import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Request interceptor: ensure token from localStorage is attached if not already
api.interceptors.request.use((config) => {
  if (!config.headers?.Authorization) {
    const token = localStorage.getItem('token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor: handle global errors (e.g., 401) and normalize messages
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Token inválido o expirado: limpiar y forzar recarga para que AuthContext lo tome
        localStorage.removeItem('token');
        localStorage.removeItem('user_email');
        try { window.location.href = '/login'; } catch (e) { /* ignore */ }
      }
      const msg = error.response.data?.message || error.response.statusText || `Error ${status}`;
      return Promise.reject(new Error(msg));
    }
    // Network or other
    return Promise.reject(new Error(error.message || 'Network error'));
  }
);

export default api;
