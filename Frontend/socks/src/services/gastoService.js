import api from './api';

export const getGastos = async () => {
  const res = await api.get('/gastos');
  return res.data?.data || [];
};

export const getGastosPorFecha = async (fechaStr) => {
  const res = await api.get(`/gastos/fecha/${fechaStr}`);
  // GastosController devolvía en algunos lugares req.gastos
  return res.data?.data || res.data?.gastos || [];
};

export const addGasto = async ({ descripcion, monto, fecha }) => {
  const res = await api.post('/gastos', { descripcion, monto, fecha });
  return res.data?.data;
};

export const updateGasto = async (id, { descripcion, monto, fecha }) => {
  const res = await api.put(`/gastos/${id}`, { descripcion, monto, fecha });
  return res.data?.data;
};

export const deleteGasto = async (id) => {
  const res = await api.delete(`/gastos/${id}`);
  return res.data?.success ?? true;
};
