## Description

This repository contain code for a software that can be used to administer examination. It has support for multiple examination types, including: multiple choice, short answer and spelling. It uses docker for development.

The application was built with React, Apollo, GraphQL, Docker, Express, Node andd runs on Docker

## Installation

* Install docker 
* Install docker-compose 
* Run docker-compose build
* Run docker-compose up -d

## To Run Test
* List all the running container by running => 
* ```docker ps```
* Log into the terminal using the image name or id of the api_server 
* ```docker exec -it <container_name_or_id> sh```
* When in the terminal run => ( test are minimal now)
* ```npm run test``` 
  

The application runs on http://localhost:3001

To login as admin, use the following credentials:

## Application functionality
* create individual test
* create user account
* auto or manually assign questions to a created examination
* available test types are short answer type test, multiple choice questions and spelling test
* assign timer to a test
* generate test script showing the questions answered with correction
* admin functionalities
  


You can create users account that will take a test

email : admin@admin.com
password: password