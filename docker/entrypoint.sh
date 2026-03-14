#!/bin/sh
set -e

cd /var/www/html

# Generate an app key if one was not injected via environment
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Cache config/routes for performance (uses env vars already set)
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
php artisan migrate --force

# Seed the database
php artisan db:seed --force

# Hand off to supervisord which manages nginx + php-fpm
exec /usr/bin/supervisord -c /etc/supervisord.conf
