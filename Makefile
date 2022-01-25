export DOCKER_BUILDKIT=1

all: build-all scan unit-test-coverage

build-all: build build-test

build:
	docker-compose build pdf-service

build-test:
	docker-compose build yarn

scan:
	trivy --exit-code 0 --severity MEDIUM,HIGH pdf-service:latest
	trivy --exit-code 1 --severity CRITICAL pdf-service:latest

unit-test:
	mkdir -p -m 0777 ./test-results/junit
	docker-compose run --rm yarn unit-test

unit-test-coverage: build-test
	mkdir -p -m 0777 ./test-results/junit
	mkdir -p -m 0777 ./coverage
	docker-compose run --rm yarn unit-test-coverage

lint-test:
	docker-compose run --rm yarn lint:check
	docker-compose run --rm yarn jshint
