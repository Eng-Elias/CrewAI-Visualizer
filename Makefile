.PHONY: start stop build clean supabase-start supabase-stop dev prod help

help:
	@echo "Available commands:"
	@echo "  make start         - Start all services (Supabase and main services)"
	@echo "  make stop          - Stop all services"
	@echo "  make build         - Build all Docker images"
	@echo "  make clean         - Clean up Docker resources"
	@echo "  make supabase-start - Start only Supabase"
	@echo "  make supabase-stop  - Stop Supabase"
	@echo "  make dev           - Start services in development mode"
	@echo "  make prod          - Start services in production mode"

supabase-start:
	@echo "Starting Supabase..."
	cd supabase_service && supabase start

supabase-stop:
	@echo "Stopping Supabase..."
	cd supabase_service && supabase stop

build:
	@echo "Building Docker images..."
	docker-compose build

start: supabase-start
	@echo "Starting all services..."
	docker-compose up -d

stop: supabase-stop
	@echo "Stopping all services..."
	docker-compose down

dev: supabase-start
	@echo "Starting services in development mode..."
	docker-compose up

prod: supabase-start
	@echo "Starting services in production mode..."
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

clean: stop
	@echo "Cleaning up Docker resources..."
	docker-compose down -v
	docker system prune -f
