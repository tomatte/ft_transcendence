#!/bin/sh
set -e

celery -A backend worker -D

python manage.py migrate

python manage.py runserver 0.0.0.0:8000