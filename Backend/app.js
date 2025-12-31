import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { pool, initializeDatabase } from './Config/db.js';

// Importar controladores
import ProductosController from './Controladores/ProductosController.js';
import UsuarioController from './Controladores/UsuarioController.js';
import VentasController from './Controladores/VentasController.js';
import GastosController from './Controladores/GastosController.js';
import DetalleVentasController from './Controladores/DetalleVentasController.js';
import DashboardController from './Controladores/DashboardController.js';
import AuthController from './Controladores/AuthController.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:3000',
        process.env.FRONTEND_URL, // URL del frontend desplegado
        // Railway genera URLs automáticamente, así que también permitimos cualquier subdominio de railway.app
        /.*\.railway\.app$/
    ].filter(Boolean), // Elimina valores undefined/null
    credentials: true
}));
app.use(express.json());

// Montar rutas de los controladores
app.use('/productos', ProductosController);
app.use('/usuarios', UsuarioController);
app.use('/ventas', VentasController);
app.use('/gastos', GastosController);
app.use('/detalle-ventas', DetalleVentasController);
app.use('/dashboard', DashboardController);
app.use('/auth', AuthController);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Backend funcionando correctamente');
});

// Inicializar base de datos y arrancar el servidor
const startServer = async () => {
    try {
        console.log('Iniciando servidor...');
        console.log('NODE_ENV:', process.env.NODE_ENV);
        console.log('PORT:', PORT);
        
        await initializeDatabase();
        console.log('Base de datos inicializada correctamente');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        // En desarrollo, salir. En producción, intentar continuar solo con el servidor
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        } else {
            console.log('Intentando iniciar servidor sin inicialización completa de BD...');
            app.listen(PORT, '0.0.0.0', () => {
                console.log(`Servidor corriendo en puerto ${PORT} (modo recovery)`);
            });
        }
    }
};

startServer();

