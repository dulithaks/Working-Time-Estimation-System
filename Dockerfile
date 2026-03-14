# ─── Stage 1: Build JS/CSS assets ───────────────────────────────────────────
FROM php:8.4-alpine AS build-assets

# Node + PHP extensions required by Vite/Wayfinder build
RUN apk add --no-cache nodejs npm libxml2-dev oniguruma-dev && \
    docker-php-ext-install mbstring xml bcmath

WORKDIR /app
COPY . .

# Composer is needed so artisan can run during the Vite build
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --no-scripts

RUN cp .env.example .env || touch .env

# CI=true disables the Wayfinder plugin (see vite.config.ts)
ENV CI=true
RUN npm ci && npm run build

# ─── Stage 2: Production image (nginx + php-fpm + supervisor) ────────────────
FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    nginx \
    supervisor \
    libxml2-dev \
    sqlite-dev \
    unzip \
    oniguruma-dev

RUN docker-php-ext-install bcmath opcache pdo_sqlite mbstring xml

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

# Bring in the compiled front-end assets from Stage 1
COPY --from=build-assets /app/public/build ./public/build

# Install production PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# SQLite database file + runtime directory permissions
RUN mkdir -p database && \
    touch database/database.sqlite && \
    chown -R www-data:www-data storage bootstrap/cache database && \
    chmod -R 775 storage bootstrap/cache database

# Copy Docker support files
COPY docker/nginx.conf       /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh    /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]