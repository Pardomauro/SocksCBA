import express from 'express';
import { validationResult } from 'express-validator';
import GastosService from '../Servicios/GastosService.js';
import { validarObtenerGastoPorFecha, validarObtenerGastoPorId, validarAgregarGasto, validarExistenciaGasto } from '../Validaciones/GastosValidacion.js';

const router = express.Router();

// Obtener todos los gastos 
router.get('/', async (req, res) => {
    try {
        const gastos = await GastosService.obtenerGastos(); 
        res.status(200).json({
            success: true,
            message: 'Gastos obtenidos correctamente',
            data: gastos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los gastos',
            error: error.message
        });
    }
});

// Obtener gasto por id 
router.get('/:id', validarObtenerGastoPorId, async (req, res) => {
    try {
        const gasto = await GastosService.obtenerGastoPorId(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Gasto obtenido correctamente',
            data: gasto
        });
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: 'Error al obtener el gasto',
            error: error.message
        });
    }
});

// Obtener gastos por fecha
router.get('/fecha/:fecha', validarObtenerGastoPorFecha,async (req, res) => {
    try {
        const gastos = await GastosService.obtenerGastosPorFecha(req.params.fecha);
        res.status(200).json({
            success: true,
            message: 'Gastos obtenidos correctamente',
            data: req.gastos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los gastos',
            error: error.message
        });
    }
});

// Agregar nuevo gasto
router.post('/', validarAgregarGasto, async (req, res) => {
    try {
        console.log('Backend Controller - POST /gastos recibió:', req.body);
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            console.log('Backend Controller - Errores de validación:', errores.array());
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errores: errores.array()
            });
        }
    
        const nuevoGasto = await GastosService.agregarGasto(req.body);
        console.log('Backend Controller - Gasto creado:', nuevoGasto);
        res.status(201).json({
            success: true,
            message: 'Gasto agregado correctamente',
            data: nuevoGasto
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al agregar el gasto',
            error: error.message
        });
    }
});

// Actualizar gasto por ID
router.put('/:id', [validarAgregarGasto, validarExistenciaGasto], async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errores: errores.array()
            });
        }

        const gastoActualizado = await GastosService.actualizarGasto(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Gasto actualizado correctamente',
            data: gastoActualizado
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el gasto',
            error: error.message
        });
    }
});

// Eliminar gasto por ID
router.delete('/:id', validarExistenciaGasto, async (req, res) => {
    try {
        await GastosService.eliminarGasto(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Gasto eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el gasto',
            error: error.message
        });

    } 
});


export default router;