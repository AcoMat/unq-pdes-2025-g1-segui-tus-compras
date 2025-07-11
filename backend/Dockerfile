# Build stage
FROM maven:3.9.9-amazoncorretto-21 AS build

WORKDIR /app

# Copy pom.xml and mvnw files for dependency resolution
COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM amazoncorretto:21.0.4-alpine3.18

WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/segui-tus-compras-0.0.1-SNAPSHOT.jar app.jar

# Environment variables
ENV JWT_SECRET=""
ENV MERCADOLIBRE_API_MOST_RECENT_TOKEN=""
ENV SPRING_DATASOURCE_PASSWORD=""
ENV SPRING_DATASOURCE_URL=""
ENV SPRING_DATASOURCE_USERNAME=""

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]