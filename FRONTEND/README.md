# Frontend — GESALQVEH

SPA en **Angular 21** (standalone components, zoneless) con **Angular Material**.

## Estructura

```
gesalqveh-web/
├── src/app/
│   ├── app.ts/html/scss          # shell con toolbar
│   ├── app.config.ts             # providers (router, http, animations)
│   ├── app.routes.ts             # rutas lazy + authGuard
│   ├── core/
│   │   ├── models.ts             # tipos TS de dominio
│   │   ├── credentials.interceptor.ts   # withCredentials + redirect 401
│   │   ├── auth.service.ts       # login / logout / me
│   │   ├── auth.guard.ts         # protege /dashboard
│   │   ├── vehiculo.service.ts   # buscar + CRUD
│   │   ├── cliente.service.ts    # listar público + CRUD
│   │   ├── alquiler.service.ts   # alquilar / devolver / extender
│   │   └── dashboard.service.ts  # resumen + listas
│   └── pages/
│       ├── home/                 # landing
│       ├── vehiculos-list/       # filtros + grid de tarjetas
│       ├── vehiculo-detail/      # detalle + diálogo "Alquilar"
│       ├── alquileres-list/      # tabla + acciones devolver/extender
│       ├── login/                # acceso admin
│       └── dashboard/            # cards + 4 tablas + CRUD veh/clientes
├── nginx.conf                    # proxy /api/ → gateway:8080
└── Dockerfile                    # build → nginx
```

## Rutas

| Ruta | Auth | Descripción |
|---|---|---|
| `/` | — | Landing |
| `/vehiculos` | — | Búsqueda con filtros (tipo, marca, transmisión, combustible, categoría, precio, disponibilidad) |
| `/vehiculos/:id` | — | Detalle + alquilar |
| `/alquileres` | — | Listado con acciones devolver/extender |
| `/login` | — | Formulario de admin (defaults `admin` / `admin`) |
| `/dashboard` | sí | Cards (alquilados / próximos ≤3 días / vencidos / disponibles) + CRUDs |

## Configuración de API base

`src/environments/environment.ts` apunta a `/api` (a través del proxy de nginx en producción).
`src/environments/environment.development.ts` apunta a `http://localhost:8080/api` cuando se usa `ng serve` contra el backend en local.

## Desarrollo

```bash
cd FRONTEND/gesalqveh-web
npm install
npm start                      # ng serve → http://localhost:4200
# Asegúrate de que el backend está corriendo en :8080 (gateway).
```

## Build producción

```bash
npx ng build --configuration=production
# Genera dist/gesalqveh-web/browser
```
