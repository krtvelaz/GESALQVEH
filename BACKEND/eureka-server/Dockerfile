# --- build stage ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace

COPY pom.xml ./
COPY eureka-server/pom.xml eureka-server/
COPY gateway/pom.xml gateway/
COPY buscador/pom.xml buscador/
COPY operador/pom.xml operador/
COPY dashboard/pom.xml dashboard/

RUN mvn -B -pl eureka-server -am dependency:go-offline -DskipTests || true

COPY eureka-server/src eureka-server/src
RUN mvn -B -pl eureka-server -am package -DskipTests

# --- runtime stage ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/eureka-server/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java","-jar","/app/app.jar"]
