import express from 'express';
import UsuarioService from '../Servicios/UsuarioService.js';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }
        
        const usuario = await UsuarioService.verificarCredenciales(email, password);
        
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        
        // Token simple por ahora
        const token = `token-${usuario.id}-${Date.now()}`;
        
        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                token,
                user: {
                    id: usuario.id,
                    email: usuario.email,
                    nombre: usuario.nombre
                }
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
});

// Registro endpoint (opcional)
router.post('/registro', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }
        
        // Verificar si ya existe
        const usuarioExistente = await UsuarioService.obtenerPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya existe'
            });
        }
        
        const nuevoUsuario = await UsuarioService.agregar({
            nombre: nombre || 'Usuario',
            email,
            contrasena: password
        });
        
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: {
                id: nuevoUsuario.id,
                email: nuevoUsuario.email,
                nombre: nuevoUsuario.nombre
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear usuario',
            error: error.message
        });
    }
});

export default router;