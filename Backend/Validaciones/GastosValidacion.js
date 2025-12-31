import { body } from 'express-validator';
import { pool } from '../Config/db.js';

export const validarObtenerGastoPorId = async (req, res, next) => {
    const { id } = req.params;
    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'ID de gasto inválido'
        });
    }
    next();
};



export const validarObtenerGastoPorFecha = async (req, res, next) => {
    const { fecha } = req.params;

    try {
        const [gastos] = await pool.query(
            `SELECT * FROM Gastos WHERE DATE(fecha) = ?;`,
            [fecha]
        );

        if (gastos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró ningún gasto para la fecha pedida'
            });
        }

        req.gastos = gastos; // Pasar los gastos encontrados al siguiente middleware
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al buscar gastos por fecha',
            error: error.message
        });
    }
};

export const validarAgregarGasto = [
    body('monto')
        .notEmpty().withMessage('El monto es obligatorio')
        .isFloat({ gt: 0 }).withMessage('El monto debe ser un número mayor que 0'),

    body('descripcion')
        .notEmpty().withMessage('La descripción es obligatoria')
        .isLength({ min: 5 }).withMessage('La descripción debe tener al menos 5 caracteres'),

    body('fecha')
        .notEmpty().withMessage('La fecha es obligatoria')
        .isDate().withMessage('Debe ser una fecha válida')
];

export const validarExistenciaGasto = async (req, res, next) => {
    const { id } = req.params;
    try {
        const [gasto] = await pool.query(`SELECT * FROM Gastos WHERE id = ?;`, [id]);
        if (gasto.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Gasto no encontrado'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al verificar el gasto',
            error: error.message
        });
    }
};
