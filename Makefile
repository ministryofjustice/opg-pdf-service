all: build unit-test-coverage

build:
	docker-compose build pdf-service

unit-test:
	mkdir -p ./test-results/junit
	docker-compose run --rm yarn install
	docker-compose run --rm yarn unit-test

unit-test-coverage:
	mkdir -p ./test-results/junit
	docker-compose run --rm yarn install
	docker-compose run --rm yarn unit-test-coverage
