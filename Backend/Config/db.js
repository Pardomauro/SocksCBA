import mysql from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'socks_db',
    port: process.env.DB_PORT || 3306, // Incluye el puerto desde .env
    charset: 'utf8mb4'
};



const createConnection = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conexión a la base de datos establecida');
        return connection;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw error;
    }
};

const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Inicializamos base de datos
const initializeDatabase = async () => {
    try {
        const tempConnection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            port: dbConfig.port // Incluye el puerto en la conexión temporal
        });

        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await tempConnection.end();

        // Importar y ejecutar la creación de tablas desde los modelos
        const createUsuarioTable = (await import('../Modelos/Usuario.js')).default;
        const createProductoTable = (await import('../Modelos/Producto.js')).default;
        const createGastoTable = (await import('../Modelos/Gastos.js')).default;
        const createVentaTable = (await import('../Modelos/Venta.js')).default;
        const createDetalleVentaTable = (await import('../Modelos/DetalleVenta.js')).default;

        // Ajustar el orden de creación de tablas según dependencias
        await createUsuarioTable();
        await createProductoTable();
        await createGastoTable();
        await createVentaTable();
        await createDetalleVentaTable();
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        throw error;
    }
};

export {
    createConnection,
    pool,
    initializeDatabase
};