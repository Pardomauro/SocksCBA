import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_cambiala_en_produccion';

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token de acceso requerido'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Token inválido o expirado'
            });
        }
        
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    });
};

export const verificarTokenOpcional = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // Sin token, continúa pero sin usuario autenticado
        req.userId = null;
        req.userEmail = null;
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            // Token inválido, continúa sin usuario autenticado
            req.userId = null;
            req.userEmail = null;
        } else {
            req.userId = decoded.userId;
            req.userEmail = decoded.email;
        }
        next();
    });
};

export default { verificarToken, verificarTokenOpcional };