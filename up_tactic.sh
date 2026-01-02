#!/bin/bash
env_file="server.env"
extra_docker_compose="docker-compose.ec2.yml"
up_only="False"
profile="start_project"
restart_aux="False"

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
    --restart_aux)
      restart_aux="True"
      ;;
    --develop)
      profile="start_development"
      ;;
    --debug_host)
      profile="debug_host"
      ;;
    --local)
      extra_docker_compose="docker-compose.local.yml"
      ;;
    --debug)
      env_file="develop_debug.env"
      ;;
    *)
      break
      ;;
  esac
  shift``
done

if [ $up_only == "False" ] ; then
  echo "*** removing tactic containers ***"
  num=$(docker ps --filter label="project=tactic" -aq | wc -l)
  if [ $num != "0" ] ; then
    docker ps --filter label="project=tactic" -aq | xargs docker stop | xargs docker rm
  fi
  if [ $restart_aux == "True" ] ; then
    echo "*** removing aux containers ***"
    num=$(docker ps --filter label="project=tactic_aux" -aq | wc -l)
    if [ $num != "0" ] ; then
      docker ps --filter label="project=tactic_aux" -aq | xargs docker stop | xargs docker rm
    fi
  fi

fi
docker compose --env-file $env_file -f docker-compose.yml -f $extra_docker_compose --profile $profile up --detach