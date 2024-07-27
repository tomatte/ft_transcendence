all: up

#INTRO
help:
	@cat makefile_manual.txt

setup:
	sudo service docker start

#MAIN ACTIONS
up:
	sudo docker compose up --build

down:
	sudo docker compose down

re: down up

ls:
	@sudo docker image ls -a
	@sudo docker container ls -a
	@sudo docker volume ls
	@sudo docker network ls -f type=custom

disk:
	sudo docker system df

#CLEAN AND REMOVE
fclean:
	sudo docker compose down --rmi all --volumes

del:
	sudo docker system prune --force

del_vol:
	sudo docker volume prune -f

del_net:
	sudo docker network prune --force

purge: down fclean del del_vol del_net


#INIT DEV CONTAINERS
dev:
	docker compose --file ./docker-compose-dev.yml up --build

run:
	docker compose --file ./docker-compose-dev.yml down redis
	docker compose --file ./docker-compose-dev.yml up redis -d
	-pkill -f 'celery --workdir ./backend -A backend worker -D'
	celery --workdir ./backend -A backend worker -D
	-pkill -f 'python3 ./game_loop/game_loop.py'
	python3 ./game_loop/game_loop.py &
	python3 ./backend/manage.py runserver 0.0.0.0:8000

celery:
	celery --workdir ./backend -A backend worker -l INFO

loop:
	python3 ./game_loop/game_loop.py

# celery --workdir ./backend -A backend worker -D

#PHONY
.PHONY: all help setup up down re ls disk fclean del del_vol del_net purge