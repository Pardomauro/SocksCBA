
import { pool } from '../Config/db.js';

const obtenerDetallesVentas = async () => {
    const [detalles] = await pool.query(
        `SELECT id, venta_id, producto_id, cantidad, precio_unitario FROM DetalleVenta ORDER BY id ASC;`
    );
    return detalles;
};

const obtenerDetallesPorVentaId = async (ventaId) => {
    const [detalles] = await pool.query(
        `SELECT id, venta_id, producto_id, cantidad, precio_unitario FROM DetalleVenta WHERE venta_id = ? ORDER BY id ASC;`,
        [ventaId]
    );
    return detalles;
};   

const agregarDetalleVenta = async (detalle) => {
    const { venta_id, producto_id, cantidad, precio_unitario } = detalle;
    const [result] = await pool.query(
        `INSERT INTO DetalleVenta (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?);`,
        [venta_id, producto_id, cantidad, precio_unitario]
    );
    return { id: result.insertId, venta_id, producto_id, cantidad, precio_unitario };
};

export default { obtenerDetallesVentas, obtenerDetallesPorVentaId, agregarDetalleVenta };