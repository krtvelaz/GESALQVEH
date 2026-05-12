# GESALQVEH — Gestión de Alquiler de Vehículos

Sistema completo con backend en microservicios (Spring Boot 3.3 + Eureka + Spring Cloud Gateway) y frontend en Angular 21. Diseñado como ejercicio académico funcional con buenas prácticas.

## Arquitectura

```
                ┌──────────┐
                │ Frontend │  (Angular 21 + Material)
                │  :80     │  nginx → proxy /api → gateway
                └────┬─────┘
                     │
                     ▼
                ┌────────────┐         ┌────────────┐
                │  Gateway   │ ◀──────▶│   Eureka   │
                │  :8080     │         │   :8761    │
                └─────┬──────┘         └────────────┘
                      │
   ┌──────────────────┼──────────────────┐
   ▼                  ▼                  ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│ buscador │     │ operador │     │dashboard │
│  :8081   │     │  :8082   │     │  :8083   │
└────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │ HTTP `lb://`   │
     │                ▼                │
     │            buscador             │
     ▼                                 ▼
        ┌──────────────────────┐
        │  H2 (TCP server)     │
        │   gesalqveh.mv.db    │
        └──────────────────────┘
```

- **buscador**: única lectura/búsqueda por todos los atributos vía JPA Specifications.
- **operador**: alquilar / devolver / extender. Valida existencia y disponibilidad mediante HTTP al buscador, **sin IP/puerto** (usa `lb://buscador`).
- **dashboard**: CRUD de vehículos/clientes, métricas, login con cookie opaca (`SESSION`).

## 1. Stack y versiones

| Componente | Versión | Justificación |
|---|---|---|
| Java | 21 (LTS) | Soporte a largo plazo; records, pattern matching, virtual threads disponibles. |
| Spring Boot | 3.3.4 | Compatibilidad con Java 21 + Spring Cloud 2023.0.x. |
| Spring Cloud | 2023.0.3 | Train compatible con Spring Boot 3.3; aporta Eureka Server/Client y Cloud Gateway. |
| H2 | imagen `thomseno/h2` | Soporta arm64 (Apple Silicon). Modo servidor TCP en el puerto 9092. |
| Maven | 3.9+ | Proyecto multimódulo con POM padre `BACKEND/pom.xml`. |

El proyecto contiene cinco módulos Maven hermanos dentro de `BACKEND/`: `eureka-server`, `gateway`, `buscador`, `operador` y `dashboard`. Cada uno produce un JAR ejecutable independiente.

## 2. Estructura por capas (controller / service / repository / specification)

Los tres microservicios funcionales (`buscador`, `operador`, `dashboard`) siguen una estructura uniforme:

```
com.gesalqveh.<ms>
├── domain/            Entidades JPA y enums del dominio
├── repository/        Interfaces Spring Data (extends JpaRepository)
├── service/           Lógica de negocio y transacciones
├── specification/     (solo buscador) JPA Specifications para búsqueda dinámica
├── exception/         Excepciones del dominio (NotFoundException, BusinessException)
└── web/
    ├── *Controller    Controladores REST delgados que delegan al service
    ├── GlobalExceptionHandler  Traduce excepciones a respuestas HTTP
    └── dto/           Request DTOs (entrada validada)
```

### Responsabilidad de cada capa

- **controller**: recibe la petición HTTP, valida la entrada (`@Valid`), delega al service y devuelve la respuesta. No contiene lógica de negocio.
- **service**: define las operaciones de negocio y la frontera transaccional (`@Transactional`). Lanza `NotFoundException`/`BusinessException` cuando algo no cuadra.
- **repository**: contrato de persistencia. Spring Data implementa la interfaz en tiempo de arranque; añadimos métodos por convención (`findByDni`) o por `JpaSpecificationExecutor`.
- **specification** (solo buscador): traduce un DTO de filtros a una `Specification<T>` de JPA Criteria. Permite búsqueda por cualquier combinación de atributos en una sola consulta.
- **dto**: tipos planos (records) que representan el payload de entrada. Independientes de las entidades JPA.

### Diferencias justificadas entre microservicios

No todos los servicios tienen las mismas carpetas. Las diferencias son intencionales:

- `specification/` solo en `buscador` — es el único que ofrece búsqueda dinámica por todos los atributos.
- `client/` y `config/` solo en `operador` — es el único que llama a otro microservicio vía HTTP y necesita un `WebClient` con `@LoadBalanced`.
- `security/` solo en `dashboard` — es el único con autenticación.

## 3. Consumo de H2

Se utiliza H2 en **modo servidor TCP**, dentro de un contenedor (`thomseno/h2`) que expone los puertos 9092 (TCP) y 8082 (consola web). La imagen guarda los archivos de base de datos en `/h2-data`, montado como volumen persistente.

Los tres microservicios **comparten una sola base de datos** mediante la JDBC URL:

```
jdbc:h2:tcp://h2:9092//h2-data/gesalqveh
```

> **Por qué una sola H2 compartida.** H2 no soporta replicación nativa entre instancias. Para un ejercicio académico la opción más limpia es una única base accedida por TCP desde todos los servicios, manteniendo la separación lógica por servicio en el código (entidades duplicadas, repositorios independientes).

### Inicialización del esquema y de los datos

Solo `buscador` inicializa la base de datos. Los otros dos servicios tienen `spring.sql.init.mode=never` y `spring.jpa.hibernate.ddl-auto=none`.

```yaml
spring:
  sql:
    init:
      mode: always
      schema-locations: classpath:schema.sql
      data-locations: classpath:data.sql
```

Esto evita carreras de inicialización (dos servicios intentando crear las mismas tablas) y mantiene una sola fuente de verdad para el seed.

### Entidades duplicadas, una sola tabla

Cada microservicio define sus propias clases `@Entity` apuntando al mismo nombre de tabla (`vehiculo`, `cliente`, `alquiler`). Esto deja a cada servicio libre de ajustar qué atributos modela, sin acoplar los módulos a una librería compartida. El precio: cualquier cambio de esquema obliga a revisar los tres ficheros de dominio.

## 4. Servidor de registro: Eureka

**Eureka** es un servidor de descubrimiento de servicios: actúa como una guía telefónica donde cada microservicio se registra al arrancar y consulta para encontrar a los demás. Esto permite escalar instancias y cambiar IPs/puertos sin reconfigurar a los consumidores.

### Arquitectura mínima

El módulo `eureka-server` se configura como servidor puro mediante la anotación `@EnableEurekaServer` y, dado que es el registry, no se registra a sí mismo:

```yaml
eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
```

### Cómo se registran los microservicios

Cada uno de `buscador`, `operador`, `dashboard` y `gateway` incluye la dependencia `spring-cloud-starter-netflix-eureka-client` y declara el URL del registry:

```yaml
eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_URI:http://localhost:8761/eureka/}
  instance:
    prefer-ip-address: true
```

Al arrancar, el cliente envía un *heartbeat* periódico a Eureka anunciando su `spring.application.name`, su host y su puerto. Si el heartbeat se interrumpe, Eureka expulsa la instancia tras un periodo de gracia.

El nombre lógico (`buscador`, `operador`, `dashboard`) es lo que el gateway y otros consumidores usan para resolver el endpoint físico actual.

## 5. Gateway con Eureka: enrutamiento y load balancing

El gateway (**Spring Cloud Gateway**) es el único punto público de la API. Recibe el tráfico del navegador y lo redirige al microservicio correcto.

### Configuración de rutas

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: buscador
          uri: lb://buscador
          predicates:
            - Path=/api/buscador/**
          filters:
            - StripPrefix=2
        - id: operador
          uri: lb://operador
          predicates:
            - Path=/api/operador/**
          filters:
            - StripPrefix=2
        - id: dashboard
          uri: lb://dashboard
          predicates:
            - Path=/api/dashboard/**
          filters:
            - StripPrefix=2
```

### Cómo evita el cruce de rutas

- El **predicate `Path=/api/<ms>/**`** garantiza que cada ruta solo casa con su prefijo. Una petición a `/api/operador/...` nunca se enviará al buscador.
- El **filtro `StripPrefix=2`** elimina las dos primeras secciones del path (`/api/<ms>`) antes de reenviar. El microservicio recibe la URL "limpia": `/api/buscador/vehiculos/buscar` llega a `buscador` como `/vehiculos/buscar`.

### Cómo hace load balancing con Eureka

El prefijo `lb://` en la URI no es un host real: es una instrucción a Spring Cloud LoadBalancer que dice "resuelve este nombre lógico consultando al registry". El flujo es:

1. El gateway lee `lb://buscador`.
2. Spring Cloud LoadBalancer pide a Eureka la lista de instancias registradas con `spring.application.name=buscador`.
3. Selecciona una (round-robin por defecto) y reescribe la URL al host:puerto físico.
4. Reenvía la petición.

Si mañana se levantan dos instancias del buscador, el gateway distribuirá las peticiones entre ambas sin cambios de configuración. Si una se cae, Eureka la elimina del registry y deja de recibir tráfico.

> **Single source of truth.** Las rutas se declaran solo en el gateway. Los servicios *downstream* no saben nada del prefijo `/api/<ms>` — operan en sus paths originales.

### CORS

El gateway define el `allowedOriginPatterns` de CORS para todos los orígenes `http://localhost:*`, lo cual permite que el frontend funcione independientemente del puerto host elegido (90 por defecto, configurable por `FRONTEND_PORT`).

## 6. Comunicación operador → buscador

Cuando el operador necesita validar un vehículo antes de crear un alquiler, llama al buscador **sin saber su IP ni su puerto**. Usa el mismo mecanismo `lb://` que el gateway.

### Configuración del WebClient

```java
@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced
    public WebClient.Builder loadBalancedWebClientBuilder() {
        return WebClient.builder();
    }
}
```

La anotación `@LoadBalanced` habilita la interceptación de URLs que comienzan por un nombre lógico para que pasen por Spring Cloud LoadBalancer (igual que en el gateway).

### Uso del cliente

```java
@Component
public class BuscadorClient {
    private static final String BASE = "http://buscador";
    private final WebClient webClient;

    public BuscadorClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl(BASE).build();
    }

    public Optional<VehiculoDto> findVehiculo(Long id) {
        // GET http://buscador/vehiculos/{id}
        // se resuelve a la instancia real registrada en Eureka
        ...
    }
}
```

### ¿Por qué no va por el gateway?

El gateway es la puerta para tráfico *externo* (navegador). El tráfico *interno* entre servicios va directo vía descubrimiento. Pasar las llamadas internas por el gateway añadiría un salto innecesario, latencia y carga sin beneficio.

> **Tolerancia a fallos.** Si `buscador` está caído, el `BuscadorClient` falla con `WebClientRequestException`; el `GlobalExceptionHandler` del operador la traduce a un `503 Service Unavailable` con mensaje claro al cliente.

## 7. Autenticación del dashboard (cookie de sesión)

El microservicio `dashboard` es el único que requiere autenticación. Las credenciales son fijas y se inyectan por variables de entorno:

```yaml
admin:
  username: ${ADMIN_USERNAME:admin}
  password: ${ADMIN_PASSWORD:admin}
```

### Flujo de login

1. El cliente envía `POST /api/dashboard/auth/login` con usuario y contraseña.
2. `AuthController` compara con los valores configurados.
3. Si coinciden, `SessionStore` genera un token UUID y lo guarda en un `Map` en memoria asociado al usuario.
4. Se devuelve la cookie `SESSION=<uuid>` marcada como `HttpOnly`.

### Filtro de autorización

`CookieAuthFilter` (extiende `OncePerRequestFilter`) intercepta toda petición al dashboard. Las rutas `/auth/login` y `/auth/logout` son públicas; el resto requiere una cookie válida. Si el token no está en el store, responde `401` directamente sin pasar por el controlador.

> ⚠️ **Limitaciones conocidas.** El store es *in-memory*: las sesiones se pierden al reiniciar el contenedor del dashboard. Para producción habría que pasar a Redis o equivalente. Es aceptable para un ejercicio académico.

## 8. Manejo de excepciones uniforme

Los tres microservicios funcionales declaran las mismas dos excepciones de dominio:

- `NotFoundException` → HTTP 404.
- `BusinessException` → HTTP 409.

Cada uno tiene un `@RestControllerAdvice` idéntico (`GlobalExceptionHandler`) que centraliza la traducción de excepciones a respuestas. Esto evita que los controladores tengan que devolver `ResponseEntity.notFound()` o lanzar `ResponseStatusException` en cada método.

```java
@ExceptionHandler(NotFoundException.class)
public ResponseEntity<...> handleNotFound(NotFoundException e) {
    return error(HttpStatus.NOT_FOUND, e.getMessage());
}
```

El cuerpo de error tiene la misma estructura en todos los servicios:

```json
{
  "timestamp": "2026-05-12T01:34:56Z",
  "status": 404,
  "error": "Not Found",
  "message": "Vehículo 99 no encontrado"
}
```

## 9. Búsqueda dinámica por todos los atributos

El buscador expone un endpoint `/{entidad}/buscar` capaz de filtrar por cualquier combinación de campos. Internamente usa **JPA Specifications**: cada combinación de parámetros se compone en tiempo de ejecución como un árbol de predicados y se traduce a una sola consulta SQL.

```java
public static Specification<Vehiculo> withFilters(VehiculoSearchRequest f) {
    return (root, query, cb) -> {
        List<Predicate> ps = new ArrayList<>();
        if (f.marca() != null) ps.add(cb.like(cb.lower(root.get("marca")), like(f.marca())));
        if (f.tipo() != null) ps.add(cb.equal(root.get("tipo"), f.tipo()));
        if (f.precioMax() != null) ps.add(cb.lessThanOrEqualTo(root.get("precioDiario"), f.precioMax()));
        ...
        return cb.and(ps.toArray(new Predicate[0]));
    };
}
```

La firma del controlador queda en una sola línea gracias a `@ModelAttribute`, que enlaza automáticamente los `query params` a los campos del record:

```java
@GetMapping("/buscar")
public List<Vehiculo> buscar(@ModelAttribute VehiculoSearchRequest request) {
    return service.buscar(request);
}
```

---

## Puesta en marcha (Docker)

```bash
# desde la raíz del repo
docker compose up --build
```

Servicios expuestos al host:
- Frontend: <http://localhost:90> (override con la variable `FRONTEND_PORT`, ej. `FRONTEND_PORT=8090 docker compose up`)
- Gateway (API): <http://localhost:8080>
- Eureka: <http://localhost:8761>
- H2 console: <http://localhost:8082>

### Credenciales por defecto del dashboard
```
usuario: admin
contraseña: admin
```
Override con `ADMIN_USERNAME` / `ADMIN_PASSWORD` (variables de entorno o archivo `.env`).

## Smoke tests rápidos

```bash
# Buscar SUV disponibles
curl 'http://localhost:8080/api/buscador/vehiculos/buscar?tipo=SUV&disponible=true'

# Crear alquiler (vehículo 1, cliente 1, fechas)
curl -X POST http://localhost:8080/api/operador/alquileres \
  -H 'Content-Type: application/json' \
  -d '{"vehiculoId":1,"clienteId":1,"fechaInicio":"2026-05-12","fechaFin":"2026-05-20"}'

# Login al dashboard
curl -i -X POST http://localhost:8080/api/dashboard/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin"}'

# Resumen del dashboard (reutiliza la cookie devuelta arriba)
curl --cookie "SESSION=<token>" http://localhost:8080/api/dashboard/dashboard/resumen
```

## Desarrollo local (sin Docker)

```bash
# 1. H2 en TCP (en un contenedor o instalación local)
docker run --rm -p 9092:9092 -p 8082:8082 thomseno/h2

# 2. Cada microservicio en su terminal (BACKEND/)
mvn -pl eureka-server  spring-boot:run
mvn -pl gateway        spring-boot:run
mvn -pl buscador       spring-boot:run
mvn -pl operador       spring-boot:run
mvn -pl dashboard      spring-boot:run

# 3. Frontend
cd FRONTEND/gesalqveh-web && npm install && npm start
# http://localhost:4200 (apunta a http://localhost:8080/api en dev)
```

## Datos de seed

El microservicio `buscador` carga al arrancar (`schema.sql` + `data.sql`):
- 10 vehículos variados (coches, motos, SUV, furgoneta, camión; tipos económico/premium/lujo).
- 5 clientes.
- 3 alquileres: uno activo cómodo, uno **próximo a vencer (en 2 días)**, uno **vencido (5 días)** para que el dashboard muestre métricas en todas las categorías.

## Reglas de negocio

- **Costo del alquiler**: `días × precioDiario` calculado al crear.
- **Recargo por vencimiento**: `días_vencidos × precioDiario × 1.5`.
- **Próximo a vencer**: `fechaFin` dentro de los próximos 3 días.

## Decisiones técnicas

- **Sin Zuul** (en mantenimiento) — se usa Spring Cloud Gateway, el reemplazo oficial.
- **Una sola H2 compartida** en TCP — H2 no replica de forma nativa entre instancias y para un ejercicio pequeño es la opción más limpia que mantiene la separación lógica entre microservicios.
- **Cookie HttpOnly con token opaco (UUID)** — sesión en memoria del `dashboard`, sin dependencias extra.
- **Strict TS templates + zoneless change detection** — defaults de Angular 21.

## Estructura del repositorio

```
GESALQVEH/
├── BACKEND/
│   ├── pom.xml                   # parent agregador
│   ├── eureka-server/
│   ├── gateway/
│   ├── buscador/
│   ├── operador/
│   └── dashboard/
├── FRONTEND/
│   └── gesalqveh-web/            # Angular 21 + Material (Pendiente implementación)
├── docker-compose.yml
└── README.md
```

> ⚠️ **TODO.** Pendiente implementación FRONTEND para la actividad 2 del curso