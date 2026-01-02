// Utilidades para manejo de fechas en zona horaria argentina

/**
 * Convierte una fecha UTC a hora argentina (UTC-3)
 * @param {string|Date} fechaUTC - Fecha en UTC
 * @returns {Date} - Fecha convertida a hora argentina
 */
export const convertirUTCAHoraArgentina = (fechaUTC) => {
  const fecha = new Date(fechaUTC);
  // Restar 3 horas para convertir UTC a Argentina (UTC-3)
  return new Date(fecha.getTime() - (3 * 60 * 60 * 1000));
};

/**
 * Formatea una fecha UTC para mostrar en hora argentina
 * @param {string|Date} fechaUTC - Fecha en UTC
 * @param {Object} opciones - Opciones de formato (opcional)
 * @returns {string} - Fecha formateada en hora argentina
 */
export const formatearFechaArgentina = (fechaUTC, opciones = {}) => {
  const fecha = new Date(fechaUTC);
  
  const opcionesPorDefecto = {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires'
  };

  return fecha.toLocaleString('es-AR', {
    ...opcionesPorDefecto,
    ...opciones
  });
};

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD en hora argentina
 * @returns {string} - Fecha actual argentina en formato ISO
 */
export const obtenerFechaActualArgentina = () => {
  // Crear fecha actual en zona horaria argentina
  const ahora = new Date();
  const fechaArgentina = new Date(ahora.toLocaleString("en-US", {timeZone: "America/Argentina/Buenos_Aires"}));
  
  const year = fechaArgentina.getFullYear();
  const month = String(fechaArgentina.getMonth() + 1).padStart(2, '0');
  const day = String(fechaArgentina.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};