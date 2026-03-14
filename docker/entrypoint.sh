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

# Seed the database (non-fatal: may already be seeded on subsequent deployments)
php artisan db:seed --force || echo "[entrypoint] db:seed skipped or failed — continuing"

# Apply the PORT Cloud Run provides (defaults to 8080)
export PORT="${PORT:-8080}"
sed -i "s/listen [0-9]\+;/listen ${PORT};/" /etc/nginx/http.d/default.conf

# Hand off to supervisord which manages nginx + php-fpm
exec /usr/bin/supervisord -c /etc/supervisord.conf
