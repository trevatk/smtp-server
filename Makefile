
lint:
	eslint .

build:
	docker build -t smtp-server:latest -f ./docker/Dockerfile .

deploy:
	docker compose up -d