#!/bin/sh
set -e

cd /var/www/html

# Generate an app key if one was not injected via environment
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Run database migrations
php artisan migrate --force

# Seed the database (non-fatal: may already be seeded on subsequent deployments)
php artisan db:seed --force || echo "[entrypoint] db:seed skipped or failed — continuing"

# Start Laravel's built-in server on the PORT Cloud Run provides (default 8080)
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8080}"
