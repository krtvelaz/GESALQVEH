DROP TABLE IF EXISTS alquiler;
DROP TABLE IF EXISTS vehiculo;
DROP TABLE IF EXISTS cliente;

CREATE TABLE vehiculo (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    matricula       VARCHAR(20)   NOT NULL UNIQUE,
    marca           VARCHAR(60)   NOT NULL,
    modelo          VARCHAR(60)   NOT NULL,
    anio            INT           NOT NULL,
    tipo            VARCHAR(20)   NOT NULL,
    color           VARCHAR(30),
    precio_diario   DECIMAL(10,2) NOT NULL,
    disponible      BOOLEAN       NOT NULL,
    transmision     VARCHAR(15),
    combustible     VARCHAR(15),
    plazas          INT,
    kilometraje     INT,
    categoria       VARCHAR(15),
    sucursal        VARCHAR(80),
    descripcion     VARCHAR(500),
    url_imagen      VARCHAR(500)
);

CREATE TABLE cliente (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre    VARCHAR(120) NOT NULL,
    dni       VARCHAR(20)  NOT NULL UNIQUE,
    telefono  VARCHAR(30),
    email     VARCHAR(120)
);

CREATE TABLE alquiler (
    id                       BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id              BIGINT        NOT NULL,
    cliente_id               BIGINT        NOT NULL,
    fecha_inicio             DATE          NOT NULL,
    fecha_fin                DATE          NOT NULL,
    fecha_devolucion_real    DATE,
    costo_total              DECIMAL(12,2) NOT NULL,
    recargo                  DECIMAL(12,2),
    estado                   VARCHAR(15)   NOT NULL,
    CONSTRAINT fk_alquiler_vehiculo FOREIGN KEY (vehiculo_id) REFERENCES vehiculo(id),
    CONSTRAINT fk_alquiler_cliente  FOREIGN KEY (cliente_id)  REFERENCES cliente(id)
);
