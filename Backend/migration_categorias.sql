-- Agregar columna categoria a la tabla Producto
ALTER TABLE Producto ADD COLUMN categoria VARCHAR(100) DEFAULT 'General';

-- Actualizar productos existentes con categorías específicas
UPDATE Producto SET categoria = 'Canilleras' WHERE nombre LIKE '%canillera%' OR nombre LIKE '%Canillera%';
UPDATE Producto SET categoria = 'Medias Antideslizantes Niño' WHERE (nombre LIKE '%media%' OR nombre LIKE '%Media%') AND (nombre LIKE '%niño%' OR nombre LIKE '%Niño%' OR nombre LIKE '%infantil%');
UPDATE Producto SET categoria = 'Medias Antideslizantes Adulto' WHERE (nombre LIKE '%media%' OR nombre LIKE '%Media%') AND (nombre LIKE '%adulto%' OR nombre LIKE '%Adulto%' OR nombre NOT LIKE '%niño%');
UPDATE Producto SET categoria = 'Pantorrilleras' WHERE nombre LIKE '%pantorrillera%' OR nombre LIKE '%Pantorrillera%';
UPDATE Producto SET categoria = 'Pelotas' WHERE nombre LIKE '%pelota%' OR nombre LIKE '%Pelota%' OR nombre LIKE '%balon%' OR nombre LIKE '%Balón%';


