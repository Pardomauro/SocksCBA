import mysql from 'mysql2/promise';
import { pool } from '../Config/db.js';

const createProductoTable = async () => {
    const query = `CREATE TABLE IF NOT EXISTS Producto (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        precio FLOAT NOT NULL
    ) ENGINE=InnoDB;`;

    const connection = await pool.getConnection();
    try {
        await connection.query(query);
        console.log('Tabla Producto creada o ya existe.');
    } finally {
        connection.release();
    }
};

export default createProductoTable;
