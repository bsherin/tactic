#!/bin/bash
env_file="server.env"
remove_all="False"

# process arguments
while :; do
  case $1 in
    --env-file)
      env_file="$2"
      shift
      ;;
    --remove-all)
      remove_all="True"
      ;;
    *)
      break
      ;;
  esac
  shift
done

source $env_file

if [ $USE_ARM64 == False ] ; then
  echo $USE_ARM64
  echo "not using arm64"
  arm_string=""
else
  echo "using x86"
  arm_string="-arm64"
fi

echo "*** removing old containers ***"

for image in "tile" "module_viewer" "main" "log-streamer"
  do
    num=$(sudo docker ps --filter ancestor="bsherin/tactic:$image$arm_string" -aq | wc -l)
    echo "$num containers of type bsherin/tactic:$image$arm_string to remove"
    if [ $num != "0" ] ; then
      sudo docker ps --filter ancestor="bsherin/tactic:$image$arm_string" -aq | xargs sudo docker stop | xargs sudo docker rm
    fi
  done

if [ $remove_all == "True" ] ; then
  for image in "host" "pool-watcher" "mongo-watcher"
  do
    num=$(sudo docker ps --filter ancestor="bsherin/tactic:$image$arm_string" -aq | wc -l)
    echo "$num containers of type bsherin/tactic:$image$arm_string to remove"
    if [ $num != "0" ] ; then
      sudo docker ps --filter ancestor="bsherin/tactic:$image$arm_string" -aq | xargs sudo docker stop | xargs sudo docker rm
    fi
  done
fi

if [ $remove_all == "True" ] ; then
  for image in "rabbitmq:3-management" "rabbitmq" "redis:alpine"
    do
      echo "removing $image"
      num=$(sudo docker ps --filter ancestor=$image -aq | wc -l)
      echo "$num containers of type $image to remove"
      if [ $num != "0" ] ; then
        sudo docker ps --filter ancestor=$image -aq | xargs sudo docker stop | xargs sudo docker rm
      fi
    done
    sudo docker rm $mongo_uri
fi

docker compose -env-file $env_file --profile start_project up --detach