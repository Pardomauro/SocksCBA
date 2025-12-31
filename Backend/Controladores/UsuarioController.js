import express from 'express';
import { validationResult } from 'express-validator';
import { validarAgregarUsuario, validarActualizarUsuario, validarExistenciaUsuario } from '../Validaciones/UsuarioValidacion.js';
import UsuarioService from '../Servicios/UsuarioService.js';

const router = express.Router();

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await UsuarioService.obtenerTodos();
        res.status(200).json({
            success: true,
            message: 'Usuarios obtenidos correctamente',
            data: usuarios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los usuarios',
            error: error.message
        });
    }
});

// Agregar nuevo usuario
router.post('/', validarAgregarUsuario, async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errores: errores.array()
        });
    }

    try {
        const nuevoUsuario = await UsuarioService.agregar(req.body);
        res.status(201).json({
            success: true,
            message: 'Usuario agregado correctamente',
            data: nuevoUsuario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al agregar el usuario',
            error: error.message
        });
    }
});

// Actualizar usuario
router.put('/:id', [validarActualizarUsuario, validarExistenciaUsuario], async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errores: errores.array()
        });
    }

    try {
        const usuarioActualizado = await UsuarioService.actualizar(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Usuario actualizado correctamente',
            data: usuarioActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el usuario',
            error: error.message
        });
    }
});

// Eliminar usuario
router.delete('/:id', validarExistenciaUsuario, async (req, res) => {
    try {
        await UsuarioService.eliminar(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el usuario',
            error: error.message
        });
    }
});

export default router;