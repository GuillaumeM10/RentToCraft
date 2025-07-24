.PHONY : ui
ui:
	@echo "start ui"
	@pnpm run dev:ui

.PHONY : api
api:
	@echo "start api"
	@pnpm run dev:api

.PHONY: up
up:
	docker compose -f ./docker-compose.yml up -d

.PHONY: down
down:
	docker compose -f ./docker-compose.yml down

.PHONY: stop
stop:
	docker compose -f ./docker-compose.yml stop

.PHONY: install
install:
	npm install

.PHONY: reset
reset:
	docker stop $$(docker ps -a -q) \
	&& docker rm $$(docker ps -a -q) \
	&& docker rmi $$(docker images -q) \
	&& docker volume rm $$(docker volume ls -q) \
	&& docker system prune -a -f

.PHONY: lint
lint:
	@echo "linting"
	@echo "linting api"
	@pnpm --filter api run lint
	@echo "linting ui"
	@pnpm --filter ui run lint

.PHONY: tests
tests:
	@echo "testing"
	@pnpm --filter api run test --passWithNoTests

.PHONY: tests-coverage
tests-coverage:
	@echo "testing"
	@pnpm --filter api test:cov
