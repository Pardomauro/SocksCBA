import { pool } from '../Config/db.js';

const obtenerTodos = async () => {
    const [usuarios] = await pool.query(
        `SELECT id, nombre, email FROM Usuario ORDER BY id ASC;`
    );
    return usuarios;
};

const agregar = async (usuario) => {
    const { nombre, email, contrasena } = usuario;
    const [result] = await pool.query(
        `INSERT INTO Usuario (nombre, email, contrasena) VALUES (?, ?, ?);`,
        [nombre, email, contrasena]
    );
    return { id: result.insertId, nombre, email, contrasena };

}

const actualizar = async (id, usuario) => {
    const { nombre, email, contrasena } = usuario;
    await pool.query(
        `UPDATE Usuario SET nombre = ?, email = ?, contrasena = ? WHERE id = ?;
        `,
        [nombre, email, contrasena, id]
    );
    return { id, nombre, email, contrasena };
}

const eliminar = async (id) => {
    await pool.query(
        `DELETE FROM Usuario WHERE id = ?;`,
        [id]
    );
    return { id };
}

const obtenerPorEmail = async (email) => {
    const [usuarios] = await pool.query(
        `SELECT id, email, contrasena, nombre FROM Usuario WHERE email = ?;`,
        [email]
    );
    return usuarios[0] || null;
};

const verificarCredenciales = async (email, contrasena) => {
    const usuario = await obtenerPorEmail(email);
    if (!usuario) {
        return null;
    }
    
    // Comparación directa por ahora (después podemos agregar hashing)
    if (usuario.contrasena !== contrasena) {
        return null;
    }
    
    return {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre
    };
};

export default { obtenerTodos, agregar, actualizar, eliminar, obtenerPorEmail, verificarCredenciales };