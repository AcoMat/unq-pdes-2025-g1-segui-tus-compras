# Segui Tus Compras - Grupo 1

`Segui Tus Compras` es una aplicación web diseñada para ayudar a los usuarios 
a rastrear sus compras en línea de MercadoLibre.

## Stack tecnologico

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Maven](https://maven.apache.org/)
- [MySQL](https://www.mysql.com/)
- [Docker](https://www.docker.com/)
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)

## Empezando

### Pre-requisitos

- Java 21
- Maven
- Docker

### Instalación

1. Clona el repositorio
   ```sh
   git clone https://github.com/acomat/unq-pdes-2025-g1-segui-tus-compras.git
   ```
2. Navega al directorio `backend`
   ```sh
   cd unq-pdes-2025-g1-segui-tus-compras/backend
   ```
3. Construye el proyecto
   ```sh
   mvn clean install
   ```

## Uso

Para ejecutar la aplicación, puedes usar el siguiente comando:
```sh
mvn spring-boot:run
```
La aplicación estará disponible en `http://localhost:8080`.

## Variables de Entorno

Las siguientes variables de entorno son necesarias para ejecutar la aplicación:

- `SPRING_DATASOURCE_URL`: La cadena de conexión para la base de datos.
- `SPRING_DATASOURCE_USERNAME`: El nombre de usuario para la base de datos.
- `SPRING_DATASOURCE_PASSWORD`: La contraseña para la base de datos.
- `JWT_SECRET`: Una clave secreta para generar tokens JWT.
- `MERCADOLIBRE_API_MOST_RECENT_TOKEN`: El token más reciente para la API de MercadoLibre.

## Documentación de la API

La documentación de la API se genera usando SpringDoc y está disponible en `http://localhost:8080/swagger-ui.html` cuando la aplicación está en ejecución.

## Testing

Para ejecutar las pruebas, usa el siguiente comando:
```sh
mvn test
```

## Docker

Para ejecutar la aplicación con Docker, usa el siguiente comando:
```sh
docker-compose up
```

Esto iniciará la aplicación junto con una base de datos MySQL, Prometheus y Grafana.


