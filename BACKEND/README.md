# Backend — GESALQVEH

Monorepo Maven con 5 módulos Spring Boot 3.3 / Java 21 / Spring Cloud 2023.0.x.

| Módulo | Puerto | Responsabilidad |
|---|---|---|
| `eureka-server` | 8761 | Registro de servicios |
| `gateway` | 8080 | Spring Cloud Gateway, único punto público |
| `buscador` | 8081 | Lectura de la BD. Búsqueda por todos los atributos (JPA Specifications) |
| `operador` | 8082 | Operaciones de negocio (alquilar / devolver / extender). Valida vía HTTP contra `buscador` con `lb://` (sin IP/puerto) |
| `dashboard` | 8083 | CRUD veh./clientes + agregados + login. Cookie de sesión opaca |

## Endpoints clave (a través del gateway en `:8080`)

### Buscador (público)
- `GET /api/buscador/vehiculos/buscar?...` — busca por matricula, marca, modelo, anio, tipo, color, precioMin, precioMax, disponible, transmision, combustible, plazas, kilometrajeMax, categoria, sucursal.
- `GET /api/buscador/vehiculos/{id}`
- `GET /api/buscador/clientes` · `GET /api/buscador/clientes/buscar?nombre=&dni=&email=`
- `GET /api/buscador/alquileres` · `GET /api/buscador/alquileres/buscar?estado=&vehiculoId=&...`

### Operador (público)
- `POST /api/operador/alquileres` `{ vehiculoId, clienteId, fechaInicio, fechaFin }`
- `POST /api/operador/alquileres/{id}/devolver` `{ fechaDevolucionReal }`
- `PUT  /api/operador/alquileres/{id}/extender` `{ nuevaFechaFin }`

### Dashboard (requiere cookie `SESSION`)
- `POST /api/dashboard/auth/login` `{ username, password }` (público)
- `POST /api/dashboard/auth/logout` (público)
- `GET  /api/dashboard/auth/me`
- `GET  /api/dashboard/vehiculos` · `POST` · `PUT /{id}` · `DELETE /{id}`
- `GET  /api/dashboard/clientes` · `POST` · `PUT /{id}` · `DELETE /{id}`
- `GET  /api/dashboard/dashboard/resumen` — `{ alquilados, proximos, vencidos, disponibles }`
- `GET  /api/dashboard/dashboard/listas/{alquilados|proximos|vencidos|disponibles}`

## Persistencia

H2 en modo servidor TCP, **una sola base** compartida por los 3 microservicios con datos (`buscador`, `operador`, `dashboard`). Solo `buscador` ejecuta `schema.sql` y `data.sql` al arrancar; los demás tienen `spring.sql.init.mode=never` y `ddl-auto=none`.

## Lógica de penalización

`recargo = días_vencidos × precioDiario × 1.5` cuando `fechaDevolucionReal > fechaFin`.
Para alquileres aún activos pero vencidos, el dashboard calcula el recargo on-the-fly al listar `vencidos`.

## Variables de entorno principales

| Variable | Default | Uso |
|---|---|---|
| `EUREKA_URI` | `http://localhost:8761/eureka/` | Discovery |
| `DATASOURCE_URL` | `jdbc:h2:tcp://localhost:1521/./gesalqveh` | JDBC compartida |
| `ADMIN_USERNAME` | `admin` | Login dashboard |
| `ADMIN_PASSWORD` | `admin` | Login dashboard |

## Build local

```bash
# Desde BACKEND/
mvn -DskipTests package
```

(Los Dockerfile multi-stage construyen cada módulo individualmente sin requerir un Maven local.)
