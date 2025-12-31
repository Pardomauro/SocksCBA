import api from '../services/api';

// Servicio de autenticación: intenta el endpoint real y cae
// a un fallback simulado si hay problemas de conexión.
export const login = async (email, password) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    // Soportar diferentes formas de respuesta: { token }, { data: { token } }, { success, data }
    const token = res?.data?.token || res?.data?.data?.token || res?.data?.data;
    if (token && typeof token === 'string') return { success: true, token };
    if (res?.data?.success && res?.data?.data) return { success: true, token: res.data.data };
    throw new Error(res?.data?.message || 'Error de autenticación');
  } catch (err) {
    // Si el backend respondió con error, propagar mensaje claro
    if (err?.response) {
      const msg = err.response.data?.message || `Error ${err.response.status}`;
      throw new Error(msg);
    }

    // Fallback local para desarrollo si no hay servidor
    if (email === 'admin@socks.com' && password === '1234') {
      return { success: true, token: 'fake-jwt-token' };
    }

    // Error de red u otro
    throw new Error(err.message || 'Error de conexión');
  }
};
