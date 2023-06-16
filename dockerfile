#
# Build stage
#
FROM maven:3.8.3-openjdk-17 AS build
WORKDIR /app
COPY . /app/
RUN mvn clean package

#
# Package stage
#
FROM openjdk:17-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar /app/app.jar

# Instalar libfreetype
RUN apk update && apk add --no-cache freetype

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]