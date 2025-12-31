import 'dotenv/config';

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico primero
app.use(express.json());

// CORS más permisivo para Railway
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    // Permite cualquier subdominio de railway.app
    /https:\/\/.*\.railway\.app$/,
    /https:\/\/.*\.up\.railway\.app$/
].filter(origin => origin !== undefined);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ruta de health check
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: 'Backend SOCKS CBA funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Función para inicializar DB de forma asíncrona
const initializeDatabaseAsync = async () => {
    try {
        const { initializeDatabase } = await import('./Config/db.js');
        await initializeDatabase();
        console.log('✅ Base de datos inicializada correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error.message);
        // No bloquear el servidor si falla la DB
    }
};

// Función para cargar rutas de forma asíncrona
const loadRoutes = async () => {
    try {
        // Importar controladores
        const ProductosController = (await import('./Controladores/ProductosController.js')).default;
        const UsuarioController = (await import('./Controladores/UsuarioController.js')).default;
        const VentasController = (await import('./Controladores/VentasController.js')).default;
        const GastosController = (await import('./Controladores/GastosController.js')).default;
        const DetalleVentasController = (await import('./Controladores/DetalleVentasController.js')).default;
        const DashboardController = (await import('./Controladores/DashboardController.js')).default;
        const AuthController = (await import('./Controladores/AuthController.js')).default;

        // Montar rutas de los controladores
        app.use('/productos', ProductosController);
        app.use('/usuarios', UsuarioController);
        app.use('/ventas', VentasController);
        app.use('/gastos', GastosController);
        app.use('/detalle-ventas', DetalleVentasController);
        app.use('/dashboard', DashboardController);
        app.use('/auth', AuthController);

        console.log('✅ Rutas cargadas correctamente');
    } catch (error) {
        console.error('❌ Error al cargar las rutas:', error.message);
    }
};

// Iniciar servidor
const startServer = async () => {
    try {
        console.log('🚀 Iniciando servidor...');
        console.log('📍 NODE_ENV:', process.env.NODE_ENV || 'development');
        console.log('📍 PORT:', PORT);
        
        // Cargar rutas
        await loadRoutes();
        
        // Inicializar DB en background
        initializeDatabaseAsync();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`✅ Servidor corriendo en puerto ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error crítico al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();