#!/bin/sh
set -e

cd /var/www/html

# Generate an app key if one was not injected via environment
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Cache config/routes for performance (non-fatal: env vars may not all be present at build time)
php artisan config:cache  || echo "[entrypoint] config:cache failed — continuing"
php artisan route:cache   || echo "[entrypoint] route:cache failed — continuing"
php artisan view:cache    || echo "[entrypoint] view:cache failed — continuing"

# Run database migrations
php artisan migrate --force

# Seed the database (non-fatal: may already be seeded on subsequent deployments)
php artisan db:seed --force || echo "[entrypoint] db:seed skipped or failed — continuing"

# Apply the PORT Cloud Run provides (defaults to 8080).
# Use a literal match — BusyBox sed (Alpine) does not support \+ in basic regex.
PORT="${PORT:-8080}"
sed -i "s/listen 8080;/listen ${PORT};/" /etc/nginx/http.d/default.conf

# Hand off to supervisord which manages nginx + php-fpm
exec /usr/bin/supervisord -c /etc/supervisord.conf
