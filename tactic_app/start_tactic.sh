#!/bin/bash
use_arm64="False"
develop="False"
use_remote_repo="False"
remote_username=
remote_password=

# process arguments
while :; do
  case $1 in
    --root)
      root_dir="$2"
      shift
      ;;
    --mdir)
      mongo_dir="$2"
      shift
      ;;
    --dev)
      develop="True"
      ;;
    --arm64)
      use_arm64="True"
      ;;
    --remote-repo)
      use_remote_repo="True"
      remote_username="$2"
      remote_password="$3"
      shift 2
      ;;
    *)
      break
      ;;
  esac
  shift
done

echo "Got root dir $root_dir"
echo "U"
echo "Got mongo_dir $mongo_dir"
mongo_uri="tactic-mongo"
host_persist_dir="$root_dir/persist"
host_static_dir="$root_dir/tactic_app/static"
host_resources_dir="$root_dir/tactic_app/resources"
restart_policy="on-failure:5"
echo "develop is $develop"
if [ $use_arm64 == "True" ] ; then
  echo "using arm64"
  arm_string="-arm64"
else
  echo "using x86"
  arm_string=""
fi
if [ $use_remote_repo == "True" ] ; then
  echo "using remote repository"
else
  echo "using local repository"
fi

echo "*** removing old containers ***"

for image in "tile" "host" "module_viewer" "main"
  do
    echo "removing bsherin/tactic:$image$arm_string"
    docker ps --filter ancestor="bsherin/tactic:$image$arm_string" -aq | xargs docker stop | xargs docker rm
  done

for image in "rabbitmq:3-management" "rabbitmq" "redis:alpine"
  do
    echo "removing $image"
    docker ps --filter ancestor=$image -aq | xargs docker stop | xargs docker rm
  done

echo "double checking that containers are removed"
for cname in "tile_test_container" "tactic_host5000" "tactic_host5001"
  do
    echo "removing $cname"
    docker ps --filter name=$cname -aq | xargs docker stop | xargs docker rm
  done

echo "*** checking mongo ***"

if [ $(docker ps -f "name=$mongo_uri" --format '{{.Names}}') == "$mongo_uri" ] ; then
  echo "mongo container exists"
else
  echo "mongo container doesn't exist, creating ..."
  docker run -p 27017:27017 -v $mongo_dir:/data/db --name $mongo_uri --network=tactic-net --restart always -d mongo:latest
fi

echo "*** creating megaplex *** "
docker run -d \
  --name megaplex \
  --restart $restart_policy \
  --hostname megaplex \
  --network=tactic-net \
  -p 5672:5672 \
  -p 15672:15672 \
  -e MY_ID=megaplex \
  -e OWNER=host \
  rabbitmq:3-management

echo "*** creating redis ***"
docker run -d \
  --name tactic-redis \
  --restart $restart_policy \
  --hostname tactic-redis \
  --network=tactic-net \
  -p 6379:6379 \
  -e MY_ID=tactic-redis \
  -e OWNER=host \
  redis:alpine

echo "*** creating tile-test-container ***"
docker run -d \
  --name tile_test_container \
  --restart $restart_policy \
  --label my_id=tile_test_container \
  --label owner=host \
  --label parent=host \
  --label other_name=test_container \
  --network=tactic-net \
  --init \
  --env-file $root_dir/tactic_app/env.list \
  -e MY_ID=tile_test_container \
  -e PPI=0 \
  -e MONGO_URI=$mongo_uri \
  -e OWNER=host \
  -e PARENT=host \
  -e TRUE_HOST_PERSIST_DIR=$host_persist_dir \
  -e TRUE_HOST_RESOURCES_DIR=$host_resources_dir \
  -e USERNAME= \
  bsherin/tactic:tile$arm_string

echo "*** creating the host containers ***"
for port in 5000 5001
  do
    docker run -d \
      --name "tactic_host$port" \
      --restart $restart_policy \
      --hostname none \
      -p $port:5000 \
      --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
      --mount type=bind,source=$host_persist_dir,target=/code/persist \
      --mount type=bind,source=$host_static_dir,target=/code/static \
      --label my_id=host$port \
      --label owner=host \
      --label parent=host \
      --label other_name=test_container \
      --network=tactic-net \
      --init \
      --env-file $root_dir/tactic_app/env.list \
      -e MY_ID=host$port \
      -e MONGO_URI=$mongo_uri \
      -e AM_TACTIC_HOST=True \
      -e MYPORT=$port \
      -e USE_WAIT_TASKS=True \
      -e USE_REMOTE_REPOSITORY=False \
      -e OWNER=host \
      -e PARENT=host \
      -e TRUE_HOST_PERSIST_DIR=$host_persist_dir \
      -e TRUE_HOST_RESOURCES_DIR=$host_resources_dir \
      -e USERNAME= \
      -e USE_ARM64=$use_arm64 \
      -e DEVELOP=$develop \
      -e USE_REMOTE_REPOSITORY=$use_remote_repo \
      -e REMOTE_USERNAME=$remote_username \
      -e REMOTE_PASSWORD=$remote_password \
      bsherin/tactic:host$arm_string
  done

