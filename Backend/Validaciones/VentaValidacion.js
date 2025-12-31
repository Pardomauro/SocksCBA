import { body } from 'express-validator';
import { pool } from '../Config/db.js';

export const validarVenta = [
    body('total').isFloat({ gt: 0 }).withMessage('El total debe ser un número mayor que 0'),
    body('fecha').optional().isISO8601().withMessage('La fecha debe ser una fecha válida'),
    body('productos').isArray({ min: 1 }).withMessage('Se debe incluir al menos un producto'),
    body('productos.*.id').isInt({ min: 1 }).withMessage('El ID del producto debe ser un número válido'),
    body('productos.*.cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser un número mayor que 0'),
    body('productos.*.precio').isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor que 0')
];

export const validarExistenciaVenta = async (req, res, next) => {
    const { id } = req.params;

    try {
        const [venta] = await pool.query(`SELECT * FROM Venta WHERE id = ?;`, [id]);
        if (venta.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Venta no encontrada'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al verificar la venta',
            error: error.message
        });
    }
};

export default { validarVenta, validarExistenciaVenta };