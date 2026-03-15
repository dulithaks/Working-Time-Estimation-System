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

# Re-create bootstrap/cache (excluded via .dockerignore but required by artisan)
RUN mkdir -p bootstrap/cache && chmod 775 bootstrap/cache
# Generate an app key so artisan can bootstrap
RUN php artisan key:generate
# Create the SQLite file so Laravel doesn't error on boot
RUN mkdir -p database && touch database/database.sqlite
# Pre-generate Wayfinder TypeScript routes (the Vite plugin is disabled when CI=true)
RUN php artisan wayfinder:generate

# CI=true disables the Wayfinder plugin (routes already generated above)
ENV CI=true
RUN npm ci && npm run build

# ─── Stage 2: Production image (php-cli + artisan serve) ────────────────────
FROM php:8.4-cli-alpine

RUN apk add --no-cache \
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
# bootstrap/cache is excluded via .dockerignore; recreate it so post-autoload-dump succeeds
RUN mkdir -p bootstrap/cache && \
    composer install --no-dev --optimize-autoloader

# SQLite database file + runtime directory permissions
RUN mkdir -p database && \
    touch database/database.sqlite && \
    chown -R www-data:www-data storage bootstrap/cache database && \
    chmod -R 775 storage bootstrap/cache database

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]