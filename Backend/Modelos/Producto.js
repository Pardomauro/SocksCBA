import mysql from 'mysql2/promise';
import { pool } from '../Config/db.js';

const createProductoTable = async () => {
    const query = `CREATE TABLE IF NOT EXISTS Producto (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        precio FLOAT NOT NULL,
        categoria VARCHAR(100) DEFAULT 'General'
    ) ENGINE=InnoDB;`;

    const connection = await pool.getConnection();
    try {
        await connection.query(query);
        console.log('Tabla Producto creada o ya existe.');
        
        // Verificar si la columna categoria existe, si no, agregarla
        const [columns] = await connection.query(`SHOW COLUMNS FROM Producto LIKE 'categoria'`);
        if (columns.length === 0) {
            await connection.query(`ALTER TABLE Producto ADD COLUMN categoria VARCHAR(100) DEFAULT 'General'`);
            console.log('Columna categoria agregada a la tabla Producto.');
        }
    } finally {
        connection.release();
    }
};

export default createProductoTable;
