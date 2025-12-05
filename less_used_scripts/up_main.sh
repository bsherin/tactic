#!/bin/bash
env_file="develop.env"

docker ps --filter label="other_name=main_service" -aq | xargs sudo docker stop | xargs sudo docker rm
docker compose --env-file $env_file up -d tactic_main