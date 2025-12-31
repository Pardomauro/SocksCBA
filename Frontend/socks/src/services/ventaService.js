import api from './api';

export const getAllVentas = async () => {
  const res = await api.get('/ventas');
  return res.data?.data || [];
};

export const addVenta = async (ventaPayload) => {
  // ventaPayload debe coincidir con lo que espera el backend
  const res = await api.post('/ventas', ventaPayload);
  return res.data?.data;
};

export const updateVenta = async (id, ventaPayload) => {
  const res = await api.put(`/ventas/${id}`, ventaPayload);
  return res.data?.data;
};

export const deleteVenta = async (id) => {
  const res = await api.delete(`/ventas/${id}`);
  return res.data?.success ?? true;
};

// Helpers del lado cliente que filtran ventas obtenidas del backend
export const getVentasSemana = async () => {
  const todas = await getAllVentas();
  const hoy = new Date();
  const hace7 = new Date(hoy);
  hace7.setDate(hoy.getDate() - 6);
  
  return todas.filter(v => {
    const fechaVentaUTC = new Date(v.fecha);
    // Convertir a hora argentina (UTC-3)
    const fechaVentaArg = new Date(fechaVentaUTC.getTime() - (3 * 60 * 60 * 1000));
    return fechaVentaArg >= hace7 && fechaVentaArg <= hoy;
  });
};

export const getVentasMes = async () => {
  const todas = await getAllVentas();
  const hoy = new Date();
  const mes = hoy.getMonth();
  const year = hoy.getFullYear();
  
  return todas.filter(v => {
    const fechaVentaUTC = new Date(v.fecha);
    // Convertir a hora argentina (UTC-3)
    const fechaVentaArg = new Date(fechaVentaUTC.getTime() - (3 * 60 * 60 * 1000));
    return fechaVentaArg.getMonth() === mes && fechaVentaArg.getFullYear() === year;
  });
};

export const getVentasPorFecha = async (fechaStr) => {
  const todas = await getAllVentas();
  return todas.filter(v => {
    const fechaVentaUTC = new Date(v.fecha);
    // Convertir a hora argentina (UTC-3)
    const fechaVentaArg = new Date(fechaVentaUTC.getTime() - (3 * 60 * 60 * 1000));
    const fechaVentaStr = fechaVentaArg.toISOString().slice(0, 10);
    return fechaVentaStr === fechaStr;
  });
};

export default { getAllVentas, addVenta, updateVenta, deleteVenta, getVentasSemana, getVentasMes, getVentasPorFecha };
