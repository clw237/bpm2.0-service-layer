# Set the Node.js version and the base image
ARG VERSION=20
ARG BASE_IMAGE=kfydigital.jfrog.io/kf1-docker-sb-local/kf-one/hardened-nginx:1.0.1

# Use the official Node.js image as the build environment
FROM node:$VERSION AS build-env

# Set the working directory
WORKDIR /app

#Copy package.json and package-lock.json (if it exists)
COPY frontend/package*.json ./

# Copy .npmrc from the root/frontend directory to docker
COPY frontend/.npmrc .npmrc

# Install dependencies
RUN npm install

RUN rm -f .npmrc

# Copy the rest of the application code
COPY frontend/. .

# Run linting
RUN npm run lint:fix

# Run tests and generate coverage report
# RUN npm run coverage

# Build the application
RUN npx tsc && npx vite build

# Stage 2: Serve the application with Nginx
FROM $BASE_IMAGE AS runtime-env

# Copy the built files from the previous stage
COPY --from=build-env /app/dist /assets

# Ensure that Nginx is configured to serve the static files from /assets
# (Additional Nginx configuration steps may be needed here)