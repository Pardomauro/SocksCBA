import express from 'express';
import { validationResult } from 'express-validator';
import { validarVenta, validarExistenciaVenta } from '../Validaciones/VentaValidacion.js';
import VentasService from '../Servicios/VentasService.js';
const router = express.Router();

// Obtener todas las ventas
router.get('/', async (req, res) => {
    try {
        const ventas = await VentasService.obtenerTodos();
        res.status(200).json({
            success: true,
            message: 'Ventas obtenidas correctamente',
            data: ventas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las ventas',
            error: error.message
        });
    }
});

// Agregar una nueva venta
router.post('/', validarVenta, async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errores: errores.array()
        });
    }
    try {
        const nuevaVenta = await VentasService.agregar(req.body);
        res.status(201).json({
            success: true,
            message: 'Venta agregada correctamente',
            data: nuevaVenta
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al agregar la venta',
            error: error.message
        });
    }
});

// Actualizar una venta 
router.put('/:id', validarVenta, async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errores: errores.array()
        });
    }
    try {
        const ventaActualizada = await VentasService.actualizar(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Venta actualizada correctamente',
            data: ventaActualizada
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la venta',
            error: error.message
        });
    }
});

// Eliminar una venta
router.delete('/:id', validarExistenciaVenta, async (req, res) => {
    try {
        await VentasService.eliminar(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Venta eliminada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la venta',
            error: error.message
        });
    }
});

export default router;