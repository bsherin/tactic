#!/bin/bash
env_file="server.env"
up_only="False"

# process arguments
while :; do
  case $1 in
    --env-file)
      env_file="$2"
      shift
      ;;
    *)
      break
      ;;
  esac
  shift``
done

sudo docker stop tactic_host5000
sudo docker stop tactic_host5001

sudo docker compose --env-file $env_file --profile start_host up --detach