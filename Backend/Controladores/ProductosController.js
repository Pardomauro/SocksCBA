import express from 'express';
import { validationResult } from 'express-validator';
import { validarProducto, validarExistenciaProducto } from '../Validaciones/ProductoValidacion.js';
import ProductoService from '../Servicios/ProductoService.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await ProductoService.obtenerTodos();
        res.status(200).json({
            success: true,
            message: 'Productos obtenidos correctamente',
            data: productos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los productos',
            error: error.message
        });
    }
});

// Agregar un nuevo producto
router.post('/', validarProducto, async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errores: errores.array()
        });
    }

    try {
        const nuevoProducto = await ProductoService.agregar(req.body);
        res.status(201).json({
            success: true,
            message: 'Producto agregado correctamente',
            data: nuevoProducto
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al agregar el producto',
            error: error.message
        });
    }
});

// Actualizar un producto
router.put('/:id', validarProducto, async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errores: errores.array()
        });
    }

    try {
        const productoActualizado = await ProductoService.actualizar(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Producto actualizado correctamente',
            data: productoActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el producto',
            error: error.message
        });
    }
});

// Eliminar un producto
router.delete('/:id', validarExistenciaProducto, async (req, res) => {
    try {
        console.log(`Controlador: eliminando producto ${req.params.id}`);
        await ProductoService.eliminar(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Producto eliminado correctamente'
        });
    } catch (error) {
        console.log(`Controlador: error al eliminar producto ${req.params.id}:`, error.message);
        // Si el error es de restricción de clave foránea, usar código 400
        if (error.message.includes('ventas registradas')) {
            console.log('Enviando error 400 por ventas registradas');
            res.status(400).json({
                success: false,
                message: error.message
            });
        } else {
            console.log('Enviando error 500 genérico');
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el producto',
                error: error.message
            });
        }
    }
});

export default router;