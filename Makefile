export DOCKER_BUILDKIT=1

all: build-all lint-test unit-test-coverage test-image

build-all: build build-test

build:
	docker compose build pdf-service
build-test:
	docker compose build pdf-service-test

start-container:
	docker run --cpus=0.5 --memory=1G -p 8000:80 --rm -d --name pdf-service 311462405659.dkr.ecr.eu-west-1.amazonaws.com/pdf-service:latest
	sleep 8

stop-container:
	docker container kill pdf-service

LOAD_PARALLELISM=14
LOAD_REQUESTS_TOTAL=200

run-load:
	yes "make send-template" | head -n $(LOAD_REQUESTS_TOTAL) | xargs -0 | parallel --jobs $(LOAD_PARALLELISM)

send-template:
	curl --silent --request POST --header "Content-Type: text/html" localhost:8000/generate-pdf --output ./test-results/load-test-pdfs/example-sirius-lpa.pdf --data-binary '@./src/baseline/example-sirius-lpa.html'

unit-test: setup-directories
	docker compose run --rm pdf-service-test unit-test

unit-test-coverage: build-test setup-directories
	docker compose run --rm pdf-service-test unit-test-coverage

lint-test: setup-directories
	docker compose run --rm --no-deps pdf-service-test lint:check

setup-directories:
	mkdir -p -m 0777 test-results/junit coverage
	mkdir -p -m 0777 ./test-results/images
	mkdir -p -m 0777 ./coverage
