import 'dotenv/config';
import bcrypt from 'bcrypt';
import { pool } from './Config/db.js';

/**
 * Script para migrar contraseñas existentes a formato hasheado
 * Ejecutar solo UNA VEZ cuando ya tengas usuarios con contraseñas sin hashear
 */
const migrarContrasenas = async () => {
    try {
        console.log('🔄 Iniciando migración de contraseñas...');
        
        // Obtener todos los usuarios
        const [usuarios] = await pool.query('SELECT id, email, contrasena FROM Usuario');
        
        if (usuarios.length === 0) {
            console.log('✅ No hay usuarios para migrar');
            return;
        }
        
        console.log(`📋 Encontrados ${usuarios.length} usuarios para migrar`);
        
        for (const usuario of usuarios) {
            // Verificar si la contraseña ya está hasheada (bcrypt hash empieza con $2b$)
            if (usuario.contrasena.startsWith('$2b$')) {
                console.log(`⏭️  Usuario ${usuario.email} ya tiene contraseña hasheada`);
                continue;
            }
            
            // Hashear la contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(usuario.contrasena, saltRounds);
            
            // Actualizar en la base de datos
            await pool.query(
                'UPDATE Usuario SET contrasena = ? WHERE id = ?',
                [hashedPassword, usuario.id]
            );
            
            console.log(`✅ Contraseña actualizada para: ${usuario.email}`);
        }
        
        console.log('🎉 Migración completada exitosamente');
        
    } catch (error) {
        console.error('❌ Error durante la migración:', error);
    } finally {
        process.exit(0);
    }
};

migrarContrasenas();