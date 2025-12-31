-- Crear usuario de prueba para login
INSERT INTO Usuario (nombre, email, contrasena) VALUES 
('Administrador', 'admin@socks.com', '1234');

INSERT INTO Usuario (nombre, email, contrasena) VALUES 
('Juan Rodriguez', 'usuario_prueba@socks.com', '1234');

-- Ver usuarios creados
SELECT * FROM Usuario;