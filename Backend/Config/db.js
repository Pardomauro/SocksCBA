import mysql from 'mysql2/promise';

// Railway proporciona DATABASE_URL o MYSQL_URL, parseamos si está disponible
const parseConnectionString = (connectionString) => {
    if (!connectionString) return null;
    
    // Formato: mysql://user:password@host:port/database
    const match = connectionString.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (match) {
        return {
            user: match[1],
            password: match[2],
            host: match[3],
            port: parseInt(match[4]),
            database: match[5]
        };
    }
    return null;
};

const railwayConfig = parseConnectionString(process.env.DATABASE_URL || process.env.MYSQL_URL);

const dbConfig = railwayConfig || {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'socks_db',
    port: process.env.DB_PORT || 3306,
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
        // En Railway, la base de datos ya existe, solo verificamos la conexión
        if (railwayConfig) {
            console.log('Detectada configuración de Railway, verificando conexión...');
            const testConnection = await mysql.createConnection(dbConfig);
            await testConnection.ping();
            await testConnection.end();
            console.log('Conexión a Railway MySQL verificada');
        } else {
            // Solo para desarrollo local - crear DB si no existe
            console.log('Configuración local, creando base de datos si no existe...');
            const tempConnection = await mysql.createConnection({
                host: dbConfig.host,
                user: dbConfig.user,
                password: dbConfig.password,
                port: dbConfig.port
            });

            await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
            await tempConnection.end();
        }

        // Importar y ejecutar la creación de tablas desde los modelos
        console.log('Creando tablas...');
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
        
        console.log('Tablas creadas/verificadas correctamente');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        // En producción, no fallar si ya están las tablas
        if (process.env.NODE_ENV === 'production') {
            console.log('Continuando en modo producción...');
            return;
        }
        throw error;
    }
};

export {
    createConnection,
    pool,
    initializeDatabase
};