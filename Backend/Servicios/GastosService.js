
import { pool } from '../Config/db.js';

const obtenerGastos = async () => {
    const [gastos] = await pool.query(
        `SELECT id, descripcion, monto, fecha FROM Gastos ORDER BY id ASC;`
    );
    return gastos;
};

const obtenerGastoPorId = async (id) => {
    const [gasto] = await pool.query(
        `SELECT id, descripcion, monto, fecha FROM Gastos WHERE id = ?;`,
        [id]
    );
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
    const [result] = await pool.query(
        `INSERT INTO Gastos (descripcion, monto, fecha) VALUES (?, ?, ?);`,
        [descripcion, monto, fecha]
    );
    return { id: result.insertId, descripcion, monto, fecha };
};

const actualizarGasto = async (id, gasto) => {
    const { descripcion, monto, fecha } = gasto;
    await pool.query(
        `UPDATE Gastos SET descripcion = ?, monto = ?, fecha = ? WHERE id = ?;`,
        [descripcion, monto, fecha, id]
    );
    return { id, descripcion, monto, fecha };
};

const eliminarGasto = async (id) => {
    await pool.query(
        `DELETE FROM Gastos WHERE id = ?;`,
        [id]
    );
    return { id };
};

export default { obtenerGastos, obtenerGastoPorId, obtenerGastosPorFecha, agregarGasto, actualizarGasto, eliminarGasto };