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
        'https://sockscba-frontend-production.up.railway.app'
    ], // Permitir Vite y el dominio público de Railway
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
        await initializeDatabase();
        console.log('Base de datos inicializada correctamente');

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();

