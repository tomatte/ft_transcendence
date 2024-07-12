all: setup up

#INTRO
help:
	@cat makefile_manual.txt

setup:
	sudo service docker start

#MAIN ACTIONS
up:
	sudo docker compose up

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

#PHONY
.PHONY: all help setup up down re ls disk fclean del del_vol del_net purge