// ...existing code...
import api from './api';

/**
 * Registra un usuario en el backend
 * @param {{ nombre: string, email: string, password: string }} param0
 */
export const register = async ({ nombre, email, password }) => {
  try {
    if (!nombre || !email || !password) {
      throw new Error('Todos los campos son obligatorios');
    }
    const payload = { nombre, email, contrasena: password };
    const res = await api.post('/usuarios', payload);
    return res.data?.data || res.data; // Backend devuelve { success, message, data }
  } catch (err) {
    const message = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Error en registro';
    throw new Error(message);
  }
};

// Login se maneja en authService.js - no hay endpoint /auth/login en UsuarioController

export const getAllUsers = async () => {
  try {
    const res = await api.get('/usuarios');
    return res.data?.data || res.data; // Backend devuelve { success, message, data }
  } catch (err) {
    const message = err?.response?.data?.message || err.message || 'Error obteniendo usuarios';
    throw new Error(message);
  }
};

export const getUserById = async (id) => {
  try {
    const res = await api.get(`/usuarios/${id}`);
    return res.data?.data || res.data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || 'Error obteniendo usuario';
    throw new Error(message);
  }
};

export const updateUser = async (id, payload) => {
  try {
    const body = { ...payload };
    if (body.password && !body.contrasena) body.contrasena = body.password;
    const res = await api.put(`/usuarios/${id}`, body);
    return res.data?.data || res.data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || 'Error actualizando usuario';
    throw new Error(message);
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/usuarios/${id}`);
    return res.data?.success ?? true;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || 'Error eliminando usuario';
    throw new Error(message);
  }
};

export default {
  register,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

