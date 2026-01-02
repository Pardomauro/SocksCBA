
import { pool } from '../Config/db.js';

const obtenerGastos = async () => {
    const [gastos] = await pool.query(
        `SELECT id, descripcion, monto, fecha FROM Gastos ORDER BY id ASC;`
    );
    console.log('Backend GastosService - obtenerGastos resultado desde BD:', gastos);
    
    // Formatear las fechas para evitar problemas de zona horaria
    const gastosFormateados = gastos.map(gasto => ({
        ...gasto,
        fecha: gasto.fecha instanceof Date ? gasto.fecha.toISOString().split('T')[0] : gasto.fecha
    }));
    
    console.log('Backend GastosService - gastos con fechas formateadas:', gastosFormateados);
    return gastosFormateados;
};

const obtenerGastoPorId = async (id) => {
    const [gasto] = await pool.query(
        `SELECT id, descripcion, monto, fecha FROM Gastos WHERE id = ?;`,
        [id]
    );
    
    if (gasto.length > 0) {
        // Formatear la fecha para evitar problemas de zona horaria
        gasto[0].fecha = gasto[0].fecha instanceof Date ? gasto[0].fecha.toISOString().split('T')[0] : gasto[0].fecha;
    }
    
    return gasto[0];
};

const obtenerGastosPorFecha = async (fecha) => {
    const [gastos] = await pool.query(
        `SELECT id, descripcion, monto, fecha FROM Gastos WHERE DATE(fecha) = ?;`,
        [fecha]
    );
    return gastos;
};

const agregarGasto = async (gasto) => {
    const { descripcion, monto, fecha } = gasto;
    console.log('Backend GastosService - agregarGasto recibió fecha:', fecha);
    // Asegurar que la fecha se guarde como fecha, no como datetime con zona horaria
    const fechaFormateada = fecha.includes('T') ? fecha.split('T')[0] : fecha; // Tomar solo la parte de fecha YYYY-MM-DD
    console.log('Backend GastosService - Fecha formateada para BD:', fechaFormateada);
    const [result] = await pool.query(
        `INSERT INTO Gastos (descripcion, monto, fecha) VALUES (?, ?, ?);`,
        [descripcion, monto, fechaFormateada]
    );
    console.log('Backend GastosService - Registro insertado con ID:', result.insertId);
    return { id: result.insertId, descripcion, monto, fecha: fechaFormateada };
};

const actualizarGasto = async (id, gasto) => {
    const { descripcion, monto, fecha } = gasto;
    console.log('Backend GastosService - actualizarGasto recibió fecha:', fecha);
    // Asegurar que la fecha se guarde como fecha, no como datetime con zona horaria
    const fechaFormateada = fecha.includes('T') ? fecha.split('T')[0] : fecha; // Tomar solo la parte de fecha YYYY-MM-DD
    console.log('Backend GastosService - Fecha formateada para BD:', fechaFormateada);
    await pool.query(
        `UPDATE Gastos SET descripcion = ?, monto = ?, fecha = ? WHERE id = ?;`,
        [descripcion, monto, fechaFormateada, id]
    );
    console.log('Backend GastosService - Registro actualizado con ID:', id);
    return { id, descripcion, monto, fecha: fechaFormateada };
};

const eliminarGasto = async (id) => {
    await pool.query(
        `DELETE FROM Gastos WHERE id = ?;`,
        [id]
    );
    return { id };
};

export default { obtenerGastos, obtenerGastoPorId, obtenerGastosPorFecha, agregarGasto, actualizarGasto, eliminarGasto };