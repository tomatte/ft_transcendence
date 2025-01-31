#!/bin/sh
set -e

celery -A backend worker -D

python manage.py migrate

python manage.py runserver 0.0.0.0:$BACKEND_PORT

# daphne -b 0.0.0.0 -p 8000 backend.asgi:application
