
import express from 'express';
import { validationResult } from 'express-validator';
import { validarAgregarDetalleVenta, validarExistenciaDetalleVenta } from '../Validaciones/DetalleVentasValidacion.js';
import DetalleVentasService from '../Servicios/DetalleVentasService.js';


const router = express.Router();

// Obtenemos todos los detalles de ventas
router.get('/', async (req, res) => {
    try {
        const detalles = await DetalleVentasService.obtenerDetallesVentas();
        res.status(200).json({
            success: true,
            message: 'Detalles de ventas obtenidos correctamente',
            data: detalles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los detalles de ventas',
            error: error.message
        });
    }
});

// Obtenemos los detalles de ventas por ID de venta
router.get('/venta/:id', async (req, res) => {
    try {
        const detalles = await DetalleVentasService.obtenerDetallesPorVentaId(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Detalles de venta obtenidos correctamente',
            data: detalles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los detalles de la venta',
            error: error.message
        });
    }
});

// Agregamos nuevo detalle de venta
router.post('/', validarAgregarDetalleVenta, async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errores: errores.array()
        });
    }
    try {
        const nuevoDetalle = await DetalleVentasService.agregarDetalleVenta(req.body);
        res.status(201).json({
            success: true,
            message: 'Detalle de venta agregado correctamente',
            data: nuevoDetalle
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al agregar el detalle de venta',
            error: error.message
        });
    }
});

// Actualizamos detalle de venta por ID
router.put('/:id', [validarAgregarDetalleVenta, validarExistenciaDetalleVenta], async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errores: errores.array()
        });
    }
    try {
        const detalleActualizado = await DetalleVentasService.actualizarDetalleVenta(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Detalle de venta actualizado correctamente',
            data: detalleActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el detalle de venta',
            error: error.message
        });
    }
});

// Eliminar detalle de venta por ID
router.delete('/:id', validarExistenciaDetalleVenta, async (req, res) => {
    try {
        await DetalleVentasService.eliminarDetalleVenta(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Detalle de venta eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el detalle de venta',
            error: error.message
        });

    }
});

export default router;