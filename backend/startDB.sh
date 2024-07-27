#!/bin/sh
set -e

celery -A backend worker -D

python manage.py makemigrations

python manage.py migrate tournament
python manage.py migrate users

python manage.py migrate --fake sessions zero
python manage.py showmigrations
python manage.py migrate --fake-initial

python manage.py runserver 0.0.0.0:$BACKEND_PORT

# daphne -b 0.0.0.0 -p 8000 backend.asgi:application
