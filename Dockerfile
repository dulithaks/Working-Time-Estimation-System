# --- STEP 1: Build Assets (The Combo Stage) ---
FROM php:8.4-alpine AS build-assets

# Install Node, NPM, and PHP extensions needed for the build
RUN apk add --no-cache nodejs npm libxml2-dev oniguruma-dev && \
    docker-php-ext-install mbstring xml bcmath

WORKDIR /app
COPY . .

# Wayfinder needs composer dependencies to run artisan commands
# We install them here just for the build process
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --no-scripts

# Create .env if it doesn't exist
RUN cp .env.example .env || touch .env

# Build React Assets
ENV CI=true
RUN npm install && npm run build

# --- STEP 2: Final Production Environment ---
FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    nginx \
    supervisor \
    libpq-dev \
    libxml2-dev \
    sqlite-dev \
    unzip \
    oniguruma-dev

RUN docker-php-ext-install bcmath opcache pdo_sqlite mbstring xml

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

# Copy the assets built in Step 1
COPY --from=build-assets /app/public/build ./public/build

# Final production install
RUN composer install --no-dev --optimize-autoloader

# SQLite & Permissions Setup
RUN mkdir -p database && touch database/database.sqlite
RUN chmod -R 777 storage bootstrap/cache database

# Use port 8080 for Cloud Run
EXPOSE 8080

CMD php artisan migrate --force && \
    php artisan db:seed --force && \
    php artisan serve --host=0.0.0.0 --port=8080