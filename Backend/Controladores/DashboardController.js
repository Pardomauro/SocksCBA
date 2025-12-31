import express from 'express';
import DashboardService from '../Servicios/DashboardService.js';

const router = express.Router();

// Obtener monto total de ventas del mes
router.get('/ventas/mes', async (req, res) => {
    try {
        const montoTotal = await DashboardService.obtenerMontoVentasMes();
        res.status(200).json({
            success: true,
            message: 'Monto total de ventas del mes obtenido correctamente',
            data: montoTotal
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el monto total de ventas del mes',
            error: error.message
        });
    }
});

// Obtener monto total de ventas de la semana
router.get('/ventas/semana', async (req, res) => {
    try {
        const montoTotal = await DashboardService.obtenerMontoVentasSemana();
        res.status(200).json({
            success: true,
            message: 'Monto total de ventas de la semana obtenido correctamente',
            data: montoTotal
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el monto total de ventas de la semana',
            error: error.message
        });
    }
});

// Obtener monto total de ventas del día
router.get('/ventas/dia', async (req, res) => {
    try {
        const montoTotal = await DashboardService.obtenerMontoVentasDia();
        res.status(200).json({
            success: true,
            message: 'Monto total de ventas del día obtenido correctamente',
            data: montoTotal
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el monto total de ventas del día',
            error: error.message
        });
    }
});

// Obtener producto más vendido del mes
router.get('/ventas/producto-mas-vendido', async (req, res) => {
    try {
        const productoMasVendido = await DashboardService.obtenerProductoMasVendidoMes();
        res.status(200).json({
            success: true,
            message: 'Producto más vendido del mes obtenido correctamente',
            data: productoMasVendido
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el producto más vendido del mes',
            error: error.message
        });
    }
});

// Obtener total de gastos del mes
router.get('/gastos/mes', async (req, res) => {
    try {
        const totalGastos = await DashboardService.obtenerTotalGastosMes();
        res.status(200).json({
            success: true,
            message: 'Total de gastos del mes obtenido correctamente',
            data: totalGastos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el total de gastos del mes',
            error: error.message
        });
    }
});

export default router;
