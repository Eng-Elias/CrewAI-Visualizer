.PHONY: start stop build clean supabase-start supabase-stop dev prod help backend-install backend-uninstall frontend-install frontend-uninstall logs logs-frontend logs-backend logs-celery logs-redis logs-all

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
	@echo "Package Management Commands:"
	@echo "  make backend-install pkg=PACKAGE   - Install Python package in backend"
	@echo "  make backend-uninstall pkg=PACKAGE - Uninstall Python package from backend"
	@echo "  make frontend-install pkg=PACKAGE  - Install npm package in frontend"
	@echo "  make frontend-uninstall pkg=PACKAGE - Uninstall npm package from frontend"
	@echo "Log Commands:"
	@echo "  make logs          - Show logs from all services (last 100 lines)"
	@echo "  make logs-frontend - Show frontend logs"
	@echo "  make logs-backend  - Show backend logs"
	@echo "  make logs-celery   - Show Celery worker logs"
	@echo "  make logs-redis    - Show Redis logs"
	@echo "  make logs-all      - Show all logs without truncation"

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

# Backend package management
backend-install:
ifndef pkg
	@echo "Error: Package name not specified. Usage: make backend-install pkg=PACKAGE"
	@exit 1
endif
	@echo "Installing $(pkg) in backend..."
	docker-compose exec backend pip install $(pkg)
	@echo "Updating requirements.txt..."
	docker-compose exec backend pip freeze > backend/requirements.txt
	@echo "Package $(pkg) installed and requirements.txt updated"

backend-uninstall:
ifndef pkg
	@echo "Error: Package name not specified. Usage: make backend-uninstall pkg=PACKAGE"
	@exit 1
endif
	@echo "Uninstalling $(pkg) from backend..."
	docker-compose exec backend pip uninstall -y $(pkg)
	@echo "Updating requirements.txt..."
	docker-compose exec backend pip freeze > backend/requirements.txt
	@echo "Package $(pkg) uninstalled and requirements.txt updated"

# Frontend package management
frontend-install:
ifndef pkg
	@echo "Error: Package name not specified. Usage: make frontend-install pkg=PACKAGE"
	@exit 1
endif
	@echo "Installing $(pkg) in frontend..."
	docker-compose exec frontend bun install $(pkg)
	@echo "Package $(pkg) installed and package.json updated"

frontend-uninstall:
ifndef pkg
	@echo "Error: Package name not specified. Usage: make frontend-uninstall pkg=PACKAGE"
	@exit 1
endif
	@echo "Uninstalling $(pkg) from frontend..."
	docker-compose exec frontend bun uninstall $(pkg)
	@echo "Package $(pkg) uninstalled and package.json updated"

# Log commands
logs:
	@echo "Showing last 100 lines of logs from all services..."
	docker-compose logs --tail=100 -f

logs-frontend:
	@echo "Showing frontend logs..."
	docker-compose logs -f frontend

logs-backend:
	@echo "Showing backend logs..."
	docker-compose logs -f backend

logs-celery:
	@echo "Showing Celery worker logs..."
	docker-compose logs -f celery_worker

logs-redis:
	@echo "Showing Redis logs..."
	docker-compose logs -f redis

logs-all:
	@echo "Showing all logs without truncation..."
	docker-compose logs -f

# You can also specify number of lines with n=NUMBER
# Show last N lines from a specific service
# make logs-frontend n=50  # Show last 50 lines from frontend
# make logs-backend n=200  # Show last 200 lines from backend
logs-%:
ifdef n
	docker-compose logs --tail=$(n) -f $(subst logs-,,$@)
else
	docker-compose logs -f $(subst logs-,,$@)
endif
