import { pool } from '../Config/db.js';

const obtenerTodos = async () => {
    try {
        // Intentar con categoria primero
        const [productos] = await pool.query(
            `SELECT id, nombre, precio, categoria FROM Producto ORDER BY categoria, nombre ASC;`
        );
        return productos;
    } catch (error) {
        // Si falla (columna no existe), usar solo campos básicos
        if (error.code === 'ER_BAD_FIELD_ERROR') {
            const [productos] = await pool.query(
                `SELECT id, nombre, precio FROM Producto ORDER BY nombre ASC;`
            );
            return productos.map(p => ({ ...p, categoria: 'General' }));
        }
        throw error;
    }
};

const agregar = async (producto) => {
    const { nombre, precio, categoria } = producto;
    try {
        // Usar la categoría seleccionada, o 'General' solo si no se proporciona
        const categoriaFinal = categoria && categoria.trim() !== '' ? categoria : 'General';
        const [result] = await pool.query(
            `INSERT INTO Producto (nombre, precio, categoria) VALUES (?, ?, ?);`,
            [nombre, precio, categoriaFinal]
        );
        return { id: result.insertId, nombre, precio, categoria: categoriaFinal };
    } catch (error) {
        // Si falla (columna no existe), usar solo nombre y precio
        if (error.code === 'ER_BAD_FIELD_ERROR') {
            const [result] = await pool.query(
                `INSERT INTO Producto (nombre, precio) VALUES (?, ?);`,
                [nombre, precio]
            );
            return { id: result.insertId, nombre, precio, categoria: 'General' };
        }
        throw error;
    }
};

const actualizar = async (id, producto) => {
    const { nombre, precio, categoria } = producto;
    try {
        // Usar la categoría seleccionada, o 'General' solo si no se proporciona
        const categoriaFinal = categoria && categoria.trim() !== '' ? categoria : 'General';
        await pool.query(
            `UPDATE Producto SET nombre = ?, precio = ?, categoria = ? WHERE id = ?;`,
            [nombre, precio, categoriaFinal, id]
        );
        return { id, nombre, precio, categoria: categoriaFinal };
    } catch (error) {
        // Si falla (columna no existe), usar solo nombre y precio
        if (error.code === 'ER_BAD_FIELD_ERROR') {
            await pool.query(
                `UPDATE Producto SET nombre = ?, precio = ? WHERE id = ?;`,
                [nombre, precio, id]
            );
            return { id, nombre, precio, categoria: 'General' };
        }
        throw error;
    }
};

const eliminar = async (id) => {
    try {
        console.log(`Intentando eliminar producto ID: ${id}`);
        
        // Verificar si el producto tiene ventas asociadas
        const [ventas] = await pool.query(
            `SELECT COUNT(*) as count FROM DetalleVenta WHERE producto_id = ?;`,
            [id]
        );
        
        console.log(`Ventas encontradas para producto ${id}:`, ventas[0].count);
        
        if (ventas[0].count > 0) {
            console.log(`Producto ${id} tiene ${ventas[0].count} ventas, no se puede eliminar`);
            throw new Error('No se puede eliminar el producto porque tiene ventas registradas');
        }
        
        await pool.query(
            `DELETE FROM Producto WHERE id = ?;`,
            [id]
        );
        console.log(`Producto ${id} eliminado exitosamente`);
        return { id };
    } catch (error) {
        console.log(`Error al eliminar producto ${id}:`, error.message);
        if (error.message.includes('ventas registradas')) {
            throw error;
        }
        throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
};

export default { obtenerTodos, agregar, actualizar, eliminar };