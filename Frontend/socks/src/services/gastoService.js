import api from './api';

export const getGastos = async () => {
  const res = await api.get('/gastos');
  console.log('Frontend Service - getGastos recibió del backend:', res.data?.data);
  return res.data?.data || [];
};

export const getGastosPorFecha = async (fechaStr) => {
  const res = await api.get(`/gastos/fecha/${fechaStr}`);
  // GastosController devolvía en algunos lugares req.gastos
  return res.data?.data || res.data?.gastos || [];
};

export const addGasto = async ({ descripcion, monto, fecha }) => {
  console.log('Service - addGasto recibió fecha:', fecha);
  const res = await api.post('/gastos', { descripcion, monto, fecha });
  console.log('Service - Respuesta del backend:', res.data);
  return res.data?.data;
};

export const updateGasto = async (id, { descripcion, monto, fecha }) => {
  console.log('Service - updateGasto recibió fecha:', fecha);
  const res = await api.put(`/gastos/${id}`, { descripcion, monto, fecha });
  console.log('Service - Respuesta del backend:', res.data);
  return res.data?.data;
};

export const deleteGasto = async (id) => {
  const res = await api.delete(`/gastos/${id}`);
  return res.data?.success ?? true;
};
