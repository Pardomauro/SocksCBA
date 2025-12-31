import express from 'express';
import jwt from 'jsonwebtoken';
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
        
        // Crear JWT token seguro
        const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_cambiala_en_produccion';
        const token = jwt.sign(
            { 
                userId: usuario.id, 
                email: usuario.email 
            }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
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
        const { nombre, email, password, contrasena } = req.body;
        
        // Manejar tanto 'password' como 'contrasena' del frontend
        const finalPassword = password || contrasena;
        
        if (!email || !finalPassword) {
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
            contrasena: finalPassword
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