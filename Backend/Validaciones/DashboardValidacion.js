import { query } from 'express-validator';

export const validarFecha = [
    query('fecha')
        .optional()
        .isISO8601().withMessage('La fecha debe ser válida (formato ISO8601)')
];