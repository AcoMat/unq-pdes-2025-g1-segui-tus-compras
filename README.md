# Seguí tus compras

Este repositorio contiene el código fuente del proyecto "Seguí tus compras", una aplicación web para la gestión de compras.

#### ... Y tambien el docker-compose para levantar todo el sistema.

---

## Integrantes
- **Acosta Matías**

---

## Funcionalidades

### Acceso Público (sin autenticación)
- Búsqueda de productos por nombre.
- Visualización de productos y sus detalles.

### Usuarios Autenticados
- **Todas las funcionalidades de acceso público.**
- **Perfil:**
    - Postear reseñas y calificaciones de productos.
    - Consulta de historial de compras.
    - Gestión de productos favoritos.
- **Carrito de compras:**
    - Agregar y eliminar productos.
    - Modificar cantidades de productos.
    - Finalización del proceso de compra.

### Administradores
- **Visualización de estadísticas:**
    - Métricas de ventas.
    - Métricas de actividad de usuarios.

---

# Docker

El proyecto puede ser ejecutado en su totalidad utilizando Docker Compose.

### Requisitos

- **Docker**
- **Docker Compose**
- **Variables de Entorno**

### **Importante**
Para el correcto funcionamiento de la aplicación, es necesario configurar
las siguientes variables de entorno.
En un archivo `.env` en la raíz del proyecto poner el siguiente contenido:
```
MERCADOLIBRE_API_MOST_RECENT_TOKEN= token api mercado libre
```

### Ejecución

1. Desde el directorio raíz del proyecto, ejecutar:
    ```bash
    docker-compose -f docker-compose.dev.yml up --build
    ```
Este comando construirá las imágenes (incluyendo la compilación del backend con Maven) y levantará los contenedores para el frontend, backend y la base de datos MySQL.

### Servicios y Puertos

Una vez que los contenedores estén ejecutándose, los siguientes servicios estarán disponibles:

| Servicio  | Puerto | URL                                    | Descripción                           |
|-----------|--------|----------------------------------------|---------------------------------------|
| Frontend  | 15173  | http://localhost:15173                 | Aplicación web principal              |
| Backend   | 18080  | http://localhost:18080                 | API REST del backend                  |
| Swagger   | 18080  | http://localhost:18080/swagger-ui/index.html#/ | Documentación de la API          |
| MySQL     | 13306  | localhost:13306                        | Base de datos                         |
| Prometheus| 19090  | http://localhost:19090                 | Métricas del sistema                  |
| Grafana   | 13000  | http://localhost:13000                 | Dashboard de monitoreo                |

#### Grafana
El sistema viene integrado con Grafana para monitoreo y visualización de métricas. Las credenciales por defecto son:
- **Usuario:** admin
- **Contraseña:** admin

Además, se incluye un dashboard custom llamado "Seguí Tus Compras" ya preconfigurado, que contiene:
- Salud del sistema y JVM (estado del backend, uptime)
- Infraestructura y disponibilidad (carga general, sesiones activas)
- Métricas de negocio:
  - Total de requests procesadas
  - Tiempo máximo de respuesta por endpoint
  - Productos buscados y vistas por producto
  - Endpoints con mayor carga
  - Usuarios logueados y registrados
  - Compras por producto y por usuario
  - Favoritos por usuario y por producto
  - Comentarios por producto

### API Documentation

La documentación completa de la API está disponible en Swagger UI:
- **URL**: http://localhost:18080/swagger-ui/index.html#/
- Acceso directo para probar los endpoints
- Documentación detallada de todos los servicios REST

---

### Datos iniciales
Para facilitar la visualización de la aplicación, se han incluido datos iniciales en la base de datos. Estos datos incluyen productos, usuarios y reseñas predefinidos.

**usuarios:**

| Rol     | Email                        | Contraseña   |
|---------|------------------------------|--------------|
| admin   | admin@email.com              | admin123     |
| cliente | juliantrejo@email.com        | julian123    |
| cliente | douglasespagnol@email.com    | douglas123   |
| cliente | juancruzcenturion@email.com  | juan123      |
| cliente | lucasdellagiustina@email.com | lucas123     |
| cliente | juanignaciogarcia@email.com  | juan123      |
| cliente | urielpiñeyro@email.com       | uriel123     |
| cliente | matiaslaime@email.com        | matias123    |
| cliente | juancabezas@email.com        | juan123      |
| cliente | agueromauro@email.com        | aguero123    |
| cliente | aguerofernando@email.com     | aguero123    |
| cliente | mailinsoñez@email.com        | mailin123    |
| cliente | carlossaldaña@email.com      | carlos123    |
| cliente | adriancardozo@email.com      | adrian123    |k
| cliente | sofiarossi@email.com         | sofia123     |
| cliente | mateodiaz@email.com          | mateo123     |
| cliente | valentinagomez@email.com     | valentina123 |
| cliente | benjamincastro@email.com     | benjamin123  |
| cliente | isabellahernandez@email.com  | isabella123  |

---

## Tests de carga con k6

El sistema incluye tests de carga desarrollados con [k6](https://k6.io/). Los scripts se encuentran en `backend/k6-tests`.

### Configuración
El archivo `backend/k6-tests/config.js` contiene:
- `BASE_URL`: URL base del backend (por defecto: `http://localhost:18080`)
- `users`: lista de usuarios de prueba
- `productsIds`: IDs de productos de prueba
- `searchQueries`: búsquedas simuladas

Se puede modificar estos valores según corresponda.

### Ejecución local
Para ejecutar un test de carga, asegúrate de tener [k6 instalado](https://k6.io/docs/getting-started/installation/). Luego, ejecuta por ejemplo:

```bash
cd backend/k6-tests
k6 run auth/login-load-test.js
```

Puedes correr cualquier otro script dentro de las subcarpetas `auth/`, `product/` o `e2e/`.

---

## Tests E2E con Cypress

El sistema tiene integrado Cypress para pruebas end-to-end, tanto en CI/CD como 
para ejecución local (Recordar setear la variable de entorno "VITE_BACKEND_URL").

### Ejecución en CI/CD
Cypress se ejecuta automáticamente en cada pull request sobre la rama `main` (ver `.github/workflows/e2e-tests.yml`).

