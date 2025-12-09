#!/bin/bash
env_file="server.env"
up_only="False"
profile="start_project"
]
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
    --develop)
      profile="start_development"
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
  echo "*** removing aux containers ***"
  num=$(docker ps --filter label="project=tactic_aux" -aq | wc -l)
  if [ $num != "0" ] ; then
    docker ps --filter label="project=tactic_aux" -aq | xargs docker stop | xargs docker rm
  fi
fi

docker compose --env-file $env_file --profile $profile up --detach