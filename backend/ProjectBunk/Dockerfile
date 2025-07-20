# Use an OpenJDK base image with Maven and Python installed, based on a current Debian release.
# 'bookworm' is Debian 12, which is currently stable and supported.
FROM openjdk:21-jdk-slim-bookworm

# Install Python and pip, if not already present in the base image, and then install Python dependencies.
# The 'slim-bookworm' image might not have python3-pip by default, so we ensure it's installed.
RUN apt-get update && \
    apt-get install -y python3 python3-pip --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container to the root of your backend project.
WORKDIR /app

# Copy the Maven project files (pom.xml) first to leverage Docker's build cache.
# This step only re-runs if pom.xml changes.
COPY pom.xml .

# Copy the .mvn directory for Maven Wrapper (if you are using it, which your project structure suggests)
COPY .mvn .mvn/

# Copy the src directory, which contains both Java source code and the Python script.
# This ensures the Python script is available at the expected relative path.
COPY src src/

# Build the Spring Boot application using Maven.
# This will compile Java code and package it into a JAR file in the 'target' directory.
RUN mvn clean install -DskipTests

# Install Python dependencies from requirements.txt.
# We copy the requirements.txt from its specific location within the src/main/python directory.
# Then, install the dependencies globally in the container.
COPY src/main/python/requirements.txt src/main/python/
RUN pip3 install -r src/main/python/requirements.txt

# Expose the port that your Spring Boot application listens on.
# Based on your application.properties, it's 8084.
EXPOSE 8084

# Define the command to run your Spring Boot application.
# This command executes the JAR file created by the Maven build.
CMD ["java", "-jar", "target/ProjectBunk-0.0.1-SNAPSHOT.jar"]

