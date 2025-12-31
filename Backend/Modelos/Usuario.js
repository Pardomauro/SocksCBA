import mysql from 'mysql2/promise';
import { pool } from '../Config/db.js';

const createUsuarioTable = async () => {
    const query = `CREATE TABLE IF NOT EXISTS Usuario (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        contrasena VARCHAR(255) NOT NULL
    ) ENGINE=InnoDB;`;

    const connection = await pool.getConnection();
    try {
        await connection.query(query);
        console.log('Tabla Usuario creada o ya existe.');
    } finally {
        connection.release();
    }
};

export default createUsuarioTable;
