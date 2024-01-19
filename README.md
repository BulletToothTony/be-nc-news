# Northcoders News API

- [Link to live site](https://be-nc-news-fz91.onrender.com/api/users/)

## About

- This project is a hosted API allowing users to make requests to a live database, the backend is written in express with testing in jest

## Local setup

- Clone the project from git
- To run locally you will need to add two .env file which will connect to your local DBs, one for testing and one for dev-data. Add these two files in /db, naming convention is .env.test and .env.development
- Inside the .env files you will set the DB names 
    
        .env.test
        PGDATABASE=DBNAME_test 

        .env.development
        PGDATABASE=DBNAME

- Install the dotenv package with npm install dotenv
- The environment files should be be included in your git ignore file
- You can then use the scripts to setup your local PSQL DB by running npm setup-dbs.

## Requirements
-   Node v21.1.0
-   PostgreSQL 14.9