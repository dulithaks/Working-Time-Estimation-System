#!/bin/sh
set -e

cd /var/www/html

# Ensure .env exists (may have been excluded by .dockerignore)
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Default to production-safe runtime values unless explicitly provided by Cloud Run.
export APP_ENV="${APP_ENV:-production}"
export APP_DEBUG="${APP_DEBUG:-false}"

# Generate an app key if one was not injected via environment
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Run database migrations (non-fatal on first deploy with empty DB)
php artisan migrate --force || echo "[entrypoint] migrate failed — continuing"

# Seed the database (non-fatal: may already be seeded on subsequent deployments)
php artisan db:seed --force || echo "[entrypoint] db:seed skipped or failed — continuing"

# Start Laravel's built-in server on the PORT Cloud Run provides (default 8080)
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8080}"
