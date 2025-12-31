import { body } from 'express-validator';
import { pool } from '../Config/db.js';

export const validarProducto = [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor que 0'),
    body('categoria').optional().isString().withMessage('La categoría debe ser texto válido')
];

export const validarExistenciaProducto = async (req, res, next) => {
    const { id } = req.params;

    try {
        const [producto] = await pool.query(`SELECT * FROM Producto WHERE id = ?;`, [id]);
        if (producto.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al verificar el producto',
            error: error.message
        });
    }
};