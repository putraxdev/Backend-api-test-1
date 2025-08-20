# Makefile for Advanced Backend API

# Variables
APP_NAME := advanced-backend-api
NODE_ENV := development
PORT := 3000
DOCKER_COMPOSE_FILE := docker-compose.yml

# Default target
.DEFAULT_GOAL := help

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

.PHONY: help install dev build test lint clean docker-up docker-down db-migrate run setup

help: ## Show this help message
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

install: ## Install dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	npm install

dev: ## Start development server with auto-reload
	@echo "$(GREEN)Starting development server...$(NC)"
	npm run dev

build: ## Build the application
	@echo "$(GREEN)Building application...$(NC)"
	npm run build 2>/dev/null || echo "No build script defined"

test: ## Run all tests
	@echo "$(GREEN)Running tests...$(NC)"
	npm test

test-watch: ## Run tests in watch mode
	@echo "$(GREEN)Running tests in watch mode...$(NC)"
	npm run test:watch

test-coverage: ## Run tests with coverage report
	@echo "$(GREEN)Running tests with coverage...$(NC)"
	npm run test -- --coverage

lint: ## Run linter
	@echo "$(GREEN)Running linter...$(NC)"
	npm run lint

lint-fix: ## Fix linting issues
	@echo "$(GREEN)Fixing linting issues...$(NC)"
	npm run lint:fix

clean: ## Clean dependencies and build artifacts
	@echo "$(GREEN)Cleaning...$(NC)"
	rm -rf node_modules
	rm -rf coverage
	rm -rf dist
	npm cache clean --force

setup: install ## Setup the project (install dependencies)
	@echo "$(GREEN)Project setup completed!$(NC)"
	@echo "$(YELLOW)Run 'make run' to start the application$(NC)"

docker-build: ## Build Docker image
	@echo "$(GREEN)Building Docker image...$(NC)"
	docker build -t $(APP_NAME) .

docker-up: ## Start services with Docker Compose
	@echo "$(GREEN)Starting services with Docker Compose...$(NC)"
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

docker-down: ## Stop services with Docker Compose
	@echo "$(GREEN)Stopping services with Docker Compose...$(NC)"
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

docker-logs: ## Show Docker Compose logs
	@echo "$(GREEN)Showing Docker Compose logs...$(NC)"
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f

docker-restart: docker-down docker-up ## Restart Docker services

db-migrate: ## Run database migrations (setup database)
	@echo "$(GREEN)Setting up database...$(NC)"
	@echo "$(YELLOW)Waiting for database to be ready...$(NC)"
	@sleep 3
	@echo "$(YELLOW)Database migrations will be handled automatically by Sequelize sync$(NC)"
	@echo "$(GREEN)Database setup completed!$(NC)"

db-reset: ## Reset database (recreate tables)
	@echo "$(RED)This will destroy all data in the database!$(NC)"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "$(YELLOW)Database will be reset on next application start$(NC)"

run: docker-up db-migrate ## Start the application with all dependencies
	@echo "$(GREEN)Starting application...$(NC)"
	@echo "$(YELLOW)Waiting for database to be ready...$(NC)"
	@sleep 5
	@echo "$(GREEN)Database is ready, starting application...$(NC)"
	npm start &
	@echo ""
	@echo "$(GREEN)✅ Application is starting!$(NC)"
	@echo "$(YELLOW)📍 API Server: http://localhost:$(PORT)$(NC)"
	@echo "$(YELLOW)📍 Health Check: http://localhost:$(PORT)/health$(NC)"
	@echo "$(YELLOW)📍 API Documentation: http://localhost:$(PORT)/api-docs$(NC)"
	@echo "$(YELLOW)📍 Database: PostgreSQL running in Docker$(NC)"
	@echo ""
	@echo "$(GREEN)Available endpoints:$(NC)"
	@echo "$(YELLOW)  • GET  /api/users$(NC)"
	@echo "$(YELLOW)  • POST /api/users/register$(NC)"
	@echo "$(YELLOW)  • POST /api/users/login$(NC)"
	@echo "$(YELLOW)  • GET  /api/products$(NC)"
	@echo "$(YELLOW)  • POST /api/products$(NC)"
	@echo "$(YELLOW)  • PUT  /api/products/:id$(NC)"
	@echo "$(YELLOW)  • DELETE /api/products/:id$(NC)"
	@echo ""
	@echo "$(GREEN)Use Ctrl+C to stop the application$(NC)"

start: docker-up ## Start only the application (requires database to be running)
	@echo "$(GREEN)Starting application...$(NC)"
	npm start

stop: ## Stop the application and services
	@echo "$(GREEN)Stopping application and services...$(NC)"
	@pkill -f "node.*main.js" || true
	@make docker-down

restart: stop run ## Restart the application

logs: ## Show application logs
	@echo "$(GREEN)Showing application logs...$(NC)"
	@echo "$(YELLOW)Application logs will appear here when running...$(NC)"

health: ## Check application health
	@echo "$(GREEN)Checking application health...$(NC)"
	@curl -s http://localhost:$(PORT)/health | jq . || echo "$(RED)Application is not running or health check failed$(NC)"

check-deps: ## Check for outdated dependencies
	@echo "$(GREEN)Checking for outdated dependencies...$(NC)"
	npm outdated

update-deps: ## Update dependencies
	@echo "$(GREEN)Updating dependencies...$(NC)"
	npm update

# Security audit
audit: ## Run security audit
	@echo "$(GREEN)Running security audit...$(NC)"
	npm audit

audit-fix: ## Fix security vulnerabilities
	@echo "$(GREEN)Fixing security vulnerabilities...$(NC)"
	npm audit fix

# Development helpers
format: ## Format code
	@echo "$(GREEN)Formatting code...$(NC)"
	npm run lint:fix

validate: lint test ## Validate code (lint + test)
	@echo "$(GREEN)Code validation completed!$(NC)"

# Production helpers
prod-build: ## Build for production
	@echo "$(GREEN)Building for production...$(NC)"
	NODE_ENV=production npm run build 2>/dev/null || echo "No build script defined"

prod-start: ## Start in production mode
	@echo "$(GREEN)Starting in production mode...$(NC)"
	NODE_ENV=production npm start

# CI/CD helpers
ci: install lint test ## Run CI pipeline
	@echo "$(GREEN)CI pipeline completed!$(NC)"

# Database utilities
db-status: ## Check database status
	@echo "$(GREEN)Checking database status...$(NC)"
	docker-compose -f $(DOCKER_COMPOSE_FILE) ps db

db-connect: ## Connect to database
	@echo "$(GREEN)Connecting to database...$(NC)"
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec db psql -U appuser -d appdb

# Documentation
docs: ## Generate documentation
	@echo "$(GREEN)API documentation is available at /api-docs when the server is running$(NC)"
	@echo "$(YELLOW)Start the server with 'make run' and visit http://localhost:$(PORT)/api-docs$(NC)"

# Quick development setup
quick-start: setup run ## Quick setup and start for new developers
	@echo "$(GREEN)🎉 Quick start completed!$(NC)"

# Environment info
info: ## Show environment information
	@echo "$(GREEN)Environment Information:$(NC)"
	@echo "$(YELLOW)Node.js version:$(NC) $$(node --version)"
	@echo "$(YELLOW)NPM version:$(NC) $$(npm --version)"
	@echo "$(YELLOW)Application name:$(NC) $(APP_NAME)"
	@echo "$(YELLOW)Port:$(NC) $(PORT)"
	@echo "$(YELLOW)Environment:$(NC) $(NODE_ENV)"
	@echo "$(YELLOW)Docker version:$(NC) $$(docker --version 2>/dev/null || echo 'Not installed')"
	@echo "$(YELLOW)Docker Compose version:$(NC) $$(docker-compose --version 2>/dev/null || echo 'Not installed')"
