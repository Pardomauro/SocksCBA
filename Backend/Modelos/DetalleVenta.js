import mysql from 'mysql2/promise';
import { pool } from '../Config/db.js';

const createDetalleVentaTable = async () => {
    const query = `CREATE TABLE IF NOT EXISTS DetalleVenta (
        id INT AUTO_INCREMENT PRIMARY KEY,
        venta_id INT NOT NULL,
        producto_id INT NOT NULL,
        cantidad INT NOT NULL,
        precio_unitario FLOAT NOT NULL,
        FOREIGN KEY (venta_id) REFERENCES Venta(id),
        FOREIGN KEY (producto_id) REFERENCES Producto(id)
    ) ENGINE=InnoDB;`;

    const connection = await pool.getConnection();
    try {
        await connection.query(query);
        console.log('Tabla DetalleVenta creada o ya existe.');
    } finally {
        connection.release();
    }
};

export default createDetalleVentaTable;