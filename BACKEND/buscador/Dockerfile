FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml ./
COPY eureka-server/pom.xml eureka-server/
COPY gateway/pom.xml gateway/
COPY buscador/pom.xml buscador/
COPY operador/pom.xml operador/
COPY dashboard/pom.xml dashboard/
RUN mvn -B -pl buscador -am dependency:go-offline -DskipTests || true
COPY buscador/src buscador/src
RUN mvn -B -pl buscador -am package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/buscador/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","/app/app.jar"]
