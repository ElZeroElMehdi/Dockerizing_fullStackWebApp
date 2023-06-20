
COMPOSE_FILE := ./srcs/docker-compose.yml

up:
	docker-compose -f $(COMPOSE_FILE) up -d
down:
	docker-compose -f $(COMPOSE_FILE) down
restart: down up
purge:
	docker rm realapp-client-1  realapp-postgres-1 realapp-nginx-1 realapp-api-1 -f
	docker rmi postgres realapp-nginx realapp-api realapp-client -f
	docker volume prune -f
	docker network prune -f
	docker system prune -f
rm_data:
	rm -rf ~/data/mariadb/*
	rm -rf ~/data/wordpress/*
.PHONY: up down restart