#!/bin/sh
set -e

# rm -rf users/migrations/*

python manage.py makemigrations users
python manage.py migrate users

python manage.py migrate --fake sessions zero
python manage.py showmigrations
python manage.py migrate --fake-initial

python manage.py runserver 0.0.0.0:8000
