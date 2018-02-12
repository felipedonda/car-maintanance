## Vehicle Maintenance API Challenge
[![Build Status](https://travis-ci.org/felipedonda/car-maintanance.svg?branch=master)](https://travis-ci.org/felipedonda/car-maintanance) [![Run in Postman](https://img.shields.io/badge/postman-collection-orange.svg)](https://app.getpostman.com/run-collection/b5f104ea08c83120f02d)

### Technologies

* node.js: 9.5.0
* travis ci
* docker
* mocha
* chai
* eslint standard
* MongoDB
* express
* joi
* mongoose

## Running on docker
### Requirements
* [docker](https://www.docker.com/get-docker)
* [git](https://git-scm.com/downloads)
### Steps
1. Clone the application with git:
```bash
git clone https://github.com/felipedonda/car-maintanance
```
2. Build the application container:
```bash
sudo docker build -t "car-maintenance" car-maintenance
```
3. Create the application network:
```bash
sudo docker network create 'app-network'
```
4. Run a MongoDB container as a database for the application:
```bash
sudo docker run --name 'db' --net 'app-network' -d mongo
```
5. Run the application container
	In **development** mode:  
	```bash
	sudo docker run --name 'app' -p '80:80' \
	--net 'app-network' \
	-e MONGODB_URI='mongodb://db/car-maintenance-db' \
	car-maintenance
	```
	In **production** mode:
	```bash
	sudo docker run --name 'app' -p '80:80' \
	--net 'app-network' \
	-e MONGODB_URI='mongodb://db/car-maintenance-db' \
	-e NODE_ENV='production' \
	car-maintenance
	```