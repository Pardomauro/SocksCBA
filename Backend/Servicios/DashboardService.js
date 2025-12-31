import { pool } from '../Config/db.js';

const obtenerMontoVentasMes = async () => {
    const [result] = await pool.query(
        `SELECT SUM(total) AS montoTotal FROM Venta WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE());`
    );
    return result[0].montoTotal || 0;
};

const obtenerMontoVentasSemana = async () => {
    const [result] = await pool.query(
        `SELECT SUM(total) AS montoTotal FROM Venta WHERE WEEK(fecha) = WEEK(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE());`
    );
    return result[0].montoTotal || 0;
};

const obtenerMontoVentasDia = async () => {
    const [result] = await pool.query(
        `SELECT SUM(total) AS montoTotal FROM Venta WHERE DATE(fecha) = CURRENT_DATE();`
    );
    return result[0].montoTotal || 0;
};

const obtenerProductoMasVendidoMes = async () => {
    const [result] = await pool.query(
        `SELECT producto_id, SUM(cantidad) AS cantidadVendida FROM DetalleVenta 
         WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE())
         GROUP BY producto_id ORDER BY cantidadVendida DESC LIMIT 1;`
    );
    return result[0] || null;
};

const obtenerTotalGastosMes = async () => {
    const [result] = await pool.query(
        `SELECT SUM(monto) AS montoTotal FROM Gastos WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE());`
    );
    return result[0].montoTotal || 0;
};

export default {
    obtenerMontoVentasMes,
    obtenerMontoVentasSemana,
    obtenerMontoVentasDia,
    obtenerProductoMasVendidoMes,
    obtenerTotalGastosMes
};
