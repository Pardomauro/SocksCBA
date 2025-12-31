import api from '../services/api';

export const getProductos = async () => {
  const res = await api.get('/productos');
  // Backend responde { success, message, data }
  return res.data?.data || [];
};

export const addProducto = async ({ nombre, precio, categoria }) => {
  const res = await api.post('/productos', { nombre, precio, categoria });
  return res.data?.data;
};

export const updateProducto = async (id, { nombre, precio, categoria }) => {
  const res = await api.put(`/productos/${id}`, { nombre, precio, categoria });
  return res.data?.data;
};

export const deleteProducto = async (id) => {
  const res = await api.delete(`/productos/${id}`);
  return res.data?.success ?? true;
};
