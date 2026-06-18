FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
RUN addgroup --system majestic && adduser --system --ingroup majestic majestic
COPY --from=build /workspace/target/*.jar app.jar
USER majestic
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
