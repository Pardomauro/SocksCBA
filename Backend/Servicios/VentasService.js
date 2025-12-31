import { pool } from '../Config/db.js';

const obtenerTodos = async () => {
    const [ventas] = await pool.query(
        `SELECT id, total, fecha FROM Venta ORDER BY id DESC;`
    );
    
    // Para cada venta, obtener los productos vendidos
    for (const venta of ventas) {
        const [detalles] = await pool.query(
            `SELECT dv.cantidad, dv.precio_unitario, p.nombre 
             FROM DetalleVenta dv 
             JOIN Producto p ON dv.producto_id = p.id 
             WHERE dv.venta_id = ?`,
            [venta.id]
        );
        venta.productos = detalles;
    }
    
    return ventas;
};

const agregar = async (ventaData) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // 1. Insertar la venta
        const { total, productos } = ventaData;
        const [ventaResult] = await connection.query(
            `INSERT INTO Venta (total) VALUES (?);`,
            [total]
        );
        const ventaId = ventaResult.insertId;
        
        // 2. Insertar los detalles de la venta
        for (const producto of productos) {
            await connection.query(
                `INSERT INTO DetalleVenta (venta_id, producto_id, cantidad, precio_unitario) 
                 VALUES (?, ?, ?, ?);`,
                [ventaId, producto.id, producto.cantidad, producto.precio]
            );
        }
        
        await connection.commit();
        
        // 3. Devolver la venta completa con productos
        return { 
            id: ventaId, 
            total, 
            fecha: new Date().toISOString(),
            productos: productos.map(p => ({
                nombre: p.nombre,
                cantidad: p.cantidad,
                precio_unitario: p.precio
            }))
        };
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const actualizar = async (id, ventaData) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const { total, productos } = ventaData;
        
        // 1. Actualizar la venta
        await connection.query(
            `UPDATE Venta SET total = ? WHERE id = ?;`,
            [total, id]
        );
        
        // 2. Eliminar detalles anteriores
        await connection.query(
            `DELETE FROM DetalleVenta WHERE venta_id = ?;`,
            [id]
        );
        
        // 3. Insertar nuevos detalles
        for (const producto of productos) {
            await connection.query(
                `INSERT INTO DetalleVenta (venta_id, producto_id, cantidad, precio_unitario) 
                 VALUES (?, ?, ?, ?);`,
                [id, producto.id, producto.cantidad, producto.precio]
            );
        }
        
        await connection.commit();
        
        return { 
            id, 
            total,
            productos: productos.map(p => ({
                nombre: p.nombre,
                cantidad: p.cantidad,
                precio_unitario: p.precio
            }))
        };
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const eliminar = async (id) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // 1. Eliminar detalles primero (por foreign key)
        await connection.query(
            `DELETE FROM DetalleVenta WHERE venta_id = ?;`,
            [id]
        );
        
        // 2. Eliminar la venta
        await connection.query(
            `DELETE FROM Venta WHERE id = ?;`,
            [id]
        );
        
        await connection.commit();
        return { id };
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export default { obtenerTodos, agregar, actualizar, eliminar };