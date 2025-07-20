# Use an OpenJDK base image with a current Debian release.
FROM openjdk:21-jdk-slim-bookworm

# Install Python, pip, and Maven.
# '--no-install-recommends' keeps the image size smaller.
RUN apt-get update && \
    apt-get install -y python3 python3-pip maven --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container.
WORKDIR /app

# Copy the Maven project files (pom.xml) first to leverage Docker's build cache.
COPY pom.xml .

# Copy the .mvn directory for Maven Wrapper (if applicable).
COPY .mvn .mvn/

# Copy the src directory, which contains both Java source code and the Python script.
COPY src src/

# Build the Spring Boot application using Maven.
# This will compile Java code and package it into a JAR file.
RUN mvn clean install -DskipTests

# Install Python dependencies from requirements.txt.
COPY src/main/python/requirements.txt src/main/python/
RUN pip3 install -r src/main/python/requirements.txt

# Expose the port that your Spring Boot application listens on.
EXPOSE 8084

# Define the command to run your Spring Boot application.
CMD ["java", "-jar", "target/ProjectBunk-0.0.1-SNAPSHOT.jar"]
