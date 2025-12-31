import mysql from 'mysql2/promise';
import { pool } from '../Config/db.js';

const createVentaTable = async () => {
    const query = `CREATE TABLE IF NOT EXISTS Venta (
        id INT AUTO_INCREMENT PRIMARY KEY,
        total FLOAT NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;`;

    const connection = await pool.getConnection();
    try {
        await connection.query(query);
        console.log('Tabla Venta creada o ya existe.');
    } finally {
        connection.release();
    }
};

export default createVentaTable;
