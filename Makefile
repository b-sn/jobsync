# Makefile
# Usage:
#   make dev
#   make main
#   make dev-pull
#   make dev-build
#   make main-pull
#   make main-build
#   make status

SHELL := /bin/bash

REPO_DIR ?= .
COMPOSE ?= docker compose

DEV_BRANCH  := dev
MAIN_BRANCH := main

# Common git settings
GIT := git -C $(REPO_DIR)

.PHONY: dev main dev-pull dev-build main-pull main-build dev-run main-run status clean stop dev-rebuild main-rebuild

dev: dev-pull dev-build dev-run
dev-rebuild: clean dev
main: main-pull main-build main-run
main-rebuild: clean main

dev-pull:
	@set -e; \
	cd "$(REPO_DIR)"; \
	echo "==> Updating branch $(DEV_BRANCH) in $(REPO_DIR)"; \
	git fetch --all --prune; \
	git checkout "$(DEV_BRANCH)"; \
	git reset --hard "origin/$(DEV_BRANCH)"; \
	git submodule update --init --recursive

main-pull:
	@set -e; \
	cd "$(REPO_DIR)"; \
	echo "==> Updating branch $(MAIN_BRANCH) in $(REPO_DIR)"; \
	git fetch --all --prune; \
	git checkout "$(MAIN_BRANCH)"; \
	git reset --hard "origin/$(MAIN_BRANCH)"; \
	git submodule update --init --recursive

dev-build:
	@set -e; \
	cd "$(REPO_DIR)"; \
	echo "==> Building containers (branch: $(DEV_BRANCH))"; \
	$(COMPOSE) build

main-build:
	@set -e; \
	cd "$(REPO_DIR)"; \
	echo "==> Building containers (branch: $(MAIN_BRANCH))"; \
	$(COMPOSE) build

dev-run:
	@set -e; \
	cd "$(REPO_DIR)"; \
	echo "==> Running containers (branch: $(DEV_BRANCH))"; \
	$(COMPOSE) up -d

main-run:
	@set -e; \
	cd "$(REPO_DIR)"; \
	echo "==> Running containers (branch: $(MAIN_BRANCH))"; \
	$(COMPOSE) up -d

status:
	@set -e; \
	cd "$(REPO_DIR)"; \
	echo "==> Git status"; \
	git status -sb; \
	echo; \
	echo "==> Compose config (resolved)"; \
	$(COMPOSE) config >/dev/null && echo "OK" || exit $$?

clean:
	@set -e; \
	cd "$(REPO_DIR)"; \
	echo "==> Removing dangling images"; \
	docker image prune -f

stop:
	@set -e; \
	cd "$(REPO_DIR)"; \
	echo "==> Stopping containers"; \
	$(COMPOSE) down