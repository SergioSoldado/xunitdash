# See https://hub.docker.com/_/postgres for more information
# Commands:
# docker build -t your_tag .
# docker run -p 5432 -e POSTGRES_PASSWORD=password --rm -it pytest_postgresql
FROM postgres:latest

COPY ./schema.sql  /docker-entrypoint-initdb.d/
