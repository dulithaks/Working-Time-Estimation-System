# Step 1: Build React Assets using Node
FROM node:20 AS build-assets
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Step 2: Main PHP 8.4 Environment
FROM php:8.4-fpm-alpine

# Install system dependencies for Laravel & SQLite
RUN apk add --no-cache \
    nginx \
    supervisor \
    libpq-dev \
    libxml2-dev \
    sqlite-dev \
    unzip

# Install PHP extensions
RUN docker-php-ext-install bcmath opcache pdo_sqlite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application code
COPY . .
# Copy built React assets from the first stage
COPY --from=build-assets /app/public/build ./public/build

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Setup SQLite Database
RUN mkdir -p database && touch database/database.sqlite
RUN chmod -R 777 storage bootstrap/cache database

# Copy Nginx configuration (provided below)
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Run migrations and start the server
CMD php artisan migrate --force && \
    php artisan db:seed --force && \
    php artisan serve --host=0.0.0.0 --port=8080