-- Vehículos
INSERT INTO vehiculo (matricula, marca, modelo, anio, tipo, color, precio_diario, disponible, transmision, combustible, plazas, kilometraje, categoria, sucursal, descripcion, url_imagen) VALUES
 ('1234ABC', 'Toyota',     'Corolla',    2022, 'COCHE',     'Blanco',  45.00, TRUE,  'AUTOMATICA', 'HIBRIDO',   5, 18000,  'ECONOMICO', 'Madrid Centro',    'Sedán híbrido económico',          '/cars/toyota-corolla.jpg'),
 ('5678DEF', 'Volkswagen', 'Golf',       2021, 'COCHE',     'Negro',   50.00, FALSE, 'MANUAL',     'GASOLINA',  5, 35000,  'PREMIUM',   'Madrid Centro',    'Compacto deportivo',                '/cars/vw-golf.jpg'),
 ('9012GHI', 'Ford',       'Transit',    2020, 'FURGONETA', 'Blanco',  75.00, TRUE,  'MANUAL',     'DIESEL',    3, 80000,  'ECONOMICO', 'Barcelona Norte',  'Furgoneta de carga',                '/cars/ford-transit.jpg'),
 ('3456JKL', 'BMW',        'X5',         2023, 'SUV',       'Gris',   120.00, TRUE,  'AUTOMATICA', 'DIESEL',    7, 12000,  'LUJO',      'Madrid Centro',    'SUV de lujo, gran espacio',         '/cars/bmw-x5.jpg'),
 ('7890MNO', 'Yamaha',     'MT-07',      2022, 'MOTO',      'Azul',    35.00, TRUE,  'MANUAL',     'GASOLINA',  2, 9000,   'PREMIUM',   'Valencia Sur',     'Naked moderna',                     '/cars/yamaha-mt07.jpg'),
 ('1357PQR', 'Tesla',      'Model 3',    2023, 'COCHE',     'Rojo',   110.00, FALSE, 'AUTOMATICA', 'ELECTRICO', 5, 7000,   'PREMIUM',   'Madrid Centro',    'Eléctrico, autonomía 500km',        '/cars/tesla-model3.jpg'),
 ('2468STU', 'Mercedes',   'Sprinter',   2021, 'CAMION',    'Blanco', 130.00, TRUE,  'AUTOMATICA', 'DIESEL',    3, 65000,  'PREMIUM',   'Barcelona Norte',  'Camión ligero, 3.5T',               '/cars/mercedes-sprinter.jpg'),
 ('9753VWX', 'Honda',      'CR-V',       2022, 'SUV',       'Negro',   85.00, FALSE, 'AUTOMATICA', 'HIBRIDO',   5, 22000,  'PREMIUM',   'Valencia Sur',     'SUV híbrido familiar',              '/cars/honda-crv.jpg'),
 ('8642YZA', 'Kawasaki',   'Z900',       2023, 'MOTO',      'Verde',   45.00, TRUE,  'MANUAL',     'GASOLINA',  2, 4000,   'LUJO',      'Madrid Centro',    'Deportiva 4 cilindros',             '/cars/kawasaki-z900.jpg'),
 ('1928BCD', 'Renault',    'Clio',       2020, 'COCHE',     'Azul',    32.00, TRUE,  'MANUAL',     'GASOLINA',  5, 55000,  'ECONOMICO', 'Valencia Sur',     'Utilitario eficiente',              '/cars/renault-clio.jpg');

-- Clientes
INSERT INTO cliente (nombre, dni, telefono, email) VALUES
 ('Cristian Velasquez', '12345678A', '+34 600 123 456', 'cristian@example.com'),
 ('Ana Martínez',       '23456789B', '+34 611 234 567', 'ana.martinez@example.com'),
 ('Pedro Sánchez',      '34567890C', '+34 622 345 678', 'pedro.sanchez@example.com'),
 ('Lucía García',       '45678901D', '+34 633 456 789', 'lucia.garcia@example.com'),
 ('Mateo Fernández',    '56789012E', '+34 644 567 890', 'mateo.f@example.com');

-- Alquileres: uno activo cómodo, uno próximo a vencer (2 días), uno vencido (5 días vencido)
INSERT INTO alquiler (vehiculo_id, cliente_id, fecha_inicio, fecha_fin, fecha_devolucion_real, costo_total, recargo, estado) VALUES
 (2, 1, DATEADD('DAY', -3,  CURRENT_DATE), DATEADD('DAY', 7,  CURRENT_DATE), NULL, 500.00, 0, 'ACTIVO'),
 (6, 2, DATEADD('DAY', -5,  CURRENT_DATE), DATEADD('DAY', 2,  CURRENT_DATE), NULL, 770.00, 0, 'ACTIVO'),
 (8, 3, DATEADD('DAY', -10, CURRENT_DATE), DATEADD('DAY', -5, CURRENT_DATE), NULL, 425.00, 0, 'ACTIVO');
