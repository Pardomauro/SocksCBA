import { pool } from '../Config/db.js';
import bcrypt from 'bcrypt';

const obtenerTodos = async () => {
    const [usuarios] = await pool.query(
        `SELECT id, nombre, email FROM Usuario ORDER BY id ASC;`
    );
    return usuarios;
};

const agregar = async (usuario) => {
    const { nombre, email, contrasena } = usuario;
    
    // Hashear la contraseña antes de guardarla
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
    
    const [result] = await pool.query(
        `INSERT INTO Usuario (nombre, email, contrasena) VALUES (?, ?, ?);`,
        [nombre, email, hashedPassword]
    );
    
    // No devolver la contraseña hasheada
    return { id: result.insertId, nombre, email };
}

const actualizar = async (id, usuario) => {
    const { nombre, email, contrasena } = usuario;
    
    let hashedPassword = contrasena;
    // Solo hashear si se proporciona una nueva contraseña
    if (contrasena) {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(contrasena, saltRounds);
    }
    
    await pool.query(
        `UPDATE Usuario SET nombre = ?, email = ?, contrasena = ? WHERE id = ?;`,
        [nombre, email, hashedPassword, id]
    );
    
    // No devolver la contraseña hasheada
    return { id, nombre, email };
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
    
    // Usar bcrypt para comparar la contraseña
    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) {
        return null;
    }
    
    return {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre
    };
};

export default { obtenerTodos, agregar, actualizar, eliminar, obtenerPorEmail, verificarCredenciales };