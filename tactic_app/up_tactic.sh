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
    --up-only)
      up_only="True"
      ;;
    *)
      break
      ;;
  esac
  shift
done

if [ $up_only == "False" ] ; then
  echo "*** removing tactic containers ***"
  sudo docker ps --filter label="project=tactic" -aq | xargs sudo docker stop | xargs sudo docker rm
  echo "*** removing aux containers ***"
  sudo docker ps --filter label="project=tactic_aux" -aq | xargs sudo docker stop | xargs sudo docker rm
fi

sudo docker compose --env-file $env_file --profile start_project up --detach