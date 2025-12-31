import { pool } from '../Config/db.js';
import { body } from 'express-validator';

export const validarAgregarDetalleVenta = [

    body('producto_id').notEmpty().withMessage('El ID del producto es requerido'),
    body('venta_id').notEmpty().withMessage('El ID de la venta es requerido'),
    body('cantidad').isInt({ gt: 0 }).withMessage('La cantidad debe ser un número entero mayor que 0'),
    body('precio_unitario').isFloat({ gt: 0 }).withMessage('El precio unitario debe ser un número mayor que 0'),

];

export const validarExistenciaDetalleVenta = async (req, res, next) => {
    const { id } = req.params;
    try {
        const [detalleVenta] = await pool.query(`SELECT * FROM DetalleVentas WHERE id = ?;`, [id]);
        if (detalleVenta.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Detalle de venta no encontrado'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al verificar el detalle de venta',
            error: error.message
        });
    }
};