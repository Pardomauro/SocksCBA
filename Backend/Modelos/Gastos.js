import mysql from 'mysql2/promise';
import { pool } from '../Config/db.js';

const createGastoTable = async () => {
    const query = `CREATE TABLE IF NOT EXISTS Gastos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        descripcion VARCHAR(255) NOT NULL,
        monto FLOAT NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;`;

    const connection = await pool.getConnection();
    try {
        await connection.query(query);
        console.log('Tabla Gastos creada o ya existe.');
    } finally {
        connection.release();
    }
};

export default createGastoTable;
