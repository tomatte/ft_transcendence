#!/bin/sh
set -e

rm -rf users/migrations/*
rm -rf tournament/migrations/*

python manage.py makemigrations users
python manage.py makemigrations tournament
python manage.py migrate

python manage.py migrate --fake sessions zero
python manage.py showmigrations
python manage.py migrate --fake-initial
python manage.py runserver

python manage.py runserver 0.0.0.0:8000
