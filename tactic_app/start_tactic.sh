#!/bin/bash
use_arm64="False"
develop="False"
use_remote_repo="False"
use_remote_repo_key="False"
remote_username=
remote_password=
remote_key_file="None"
mongo_dir=

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
    --remote-repo-key)
      use_remote_repo_key="True"
      remote_username="$2"
      remote_key_file="$3"
      shift 2
      ;;
    --remote-db)
      use_remote_db="True"
      remote_username="$2"
      remote_key_file="$3"
      shift 2
      ;;
    --pdir)
      pool_dir="$2"
      shift
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
host_pool_dir="$pool_dir"
restart_policy="on-failure:5"
echo "develop is $develop"
if [ $use_arm64 == "True" ] ; then
  echo "using arm64"
  arm_string="-arm64"
else
  echo "using x86"
  arm_string=""
fi

# if dont have remote_key_file make it something safe that will work in container mount
if [ $remote_key_file == "None" ] ; then
  remote_key_file="$root_dir/tactic_app/env.list"
fi

echo "*** removing old containers ***"

for image in "tile" "host" "module_viewer" "main" "nginx" "pool-watcher" "mongo-watcher" "log-streamer"
  do
    num=$(sudo docker ps --filter ancestor="bsherin/tactic:$image$arm_string" -aq | wc -l)
    echo "$num containers of type bsherin/tactic:$image$arm_string to remove"
    if [ $num != "0" ] ; then
      sudo docker ps --filter ancestor="bsherin/tactic:$image$arm_string" -aq | xargs sudo docker stop | xargs sudo docker rm
    fi
  done

for image in "rabbitmq:3-management" "rabbitmq" "redis:alpine"
  do
    echo "removing $image"
    num=$(sudo docker ps --filter ancestor=$image -aq | wc -l)
    echo "$num containers of type $image to remove"
    if [ $num != "0" ] ; then
      sudo docker ps --filter ancestor=$image -aq | xargs sudo docker stop | xargs sudo docker rm
    fi
  done

echo "double checking that containers are removed"
for cname in "tile_test_container" "tactic_host5000" "tactic_host5001"
  do
    num=$(sudo docker ps --filter name=$cname -aq | wc -l)
    if [ $num != "0" ] ; then
      echo "removing $cname"
      sudo docker ps --filter name=$cname -aq | xargs sudo docker stop | xargs sudo docker rm
    fi
  done

echo "***creating network***"
sudo docker network create tactic-net

echo "*** checking mongo ***"

if [ $use_remote_db == "True" ] || [ $(sudo docker ps -q -f name=$mongo_uri) ]; then
  echo "no need to create mongo container"
else
  if [ $(sudo docker ps -aq -f status=exited -f name=$mongo_uri) ] ; then
    echo "stopped container exists, removing"
    sudo docker rm $mongo_uri
  fi
  echo "mongo container doesn't exist, creating ..."
  sudo docker run -p 27017:27017 -v $mongo_dir:/data/db --name $mongo_uri --network=tactic-net --restart always -d mongo:latest --replSet "rs0"
fi

echo "*** creating megaplex *** "
sudo docker run -d \
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
sudo docker run -d \
  --name tactic-redis \
  --restart $restart_policy \
  --hostname tactic-redis \
  --network=tactic-net \
  -p 6379:6379 \
  -e MY_ID=tactic-redis \
  -e OWNER=host \
  redis:alpine

echo "*** creating mongo watcher ***"

sudo docker run -d \
  --name mongo_watcher \
  --restart $restart_policy \
  --label my_id=mongo_watcher \
  --label owner=host \
  --label parent=host \
  --label other_name=mongo_watcher \
  --network=tactic-net \
  --init \
  -e MONGO_URI=$mongo_uri \
  -e USE_REMOTE_DATABASE=$use_remote_db \
  -e USE_REMOTE_REPOSITORY=$use_remote_repo \
  -e USE_REMOTE_REPOSITORY_KEY=$use_remote_repo_key \
  -e REMOTE_USERNAME=$remote_username \
  -e REMOTE_PASSWORD=$remote_password \
  -e REMOTE_KEY_FILE=$remote_key_file \
  --mount type=bind,source=$remote_key_file,target=$remote_key_file \
  bsherin/tactic:mongo-watcher$arm_string

echo "*** creating tile-test-container ***"
sudo docker run -d \
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

echo "*** creating pool_watcher *** "
sudo docker run -d \
  --name pool_watcher \
  --restart $restart_policy \
  --label my_id=pool_watcher \
  --label owner=host \
  --label parent=host \
  --label other_name=pool_watcher \
  --network=tactic-net \
  --init \
  --mount type=bind,source=$host_pool_dir,target=/pool \
  bsherin/tactic:pool-watcher$arm_string

echo "*** creating the host containers ***"

for port in 5000 5001
  do
    sudo docker run -d \
      --name "tactic_host$port" \
      --restart $restart_policy \
      --hostname none \
      -p $port:5000 \
      --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
      --mount type=bind,source=$host_persist_dir,target=/code/persist \
      --mount type=bind,source=$host_pool_dir,target=/pool \
      --mount type=bind,source=$host_static_dir,target=/code/static \
      --mount type=bind,source=$remote_key_file,target=$remote_key_file \
      --label my_id=host$port \
      --label owner=host \
      --label parent=host \
      --label other_name=none \
      --network=tactic-net \
      --init \
      --env-file $root_dir/tactic_app/env.list \
      -e MY_ID=host$port \
      -e MONGO_URI=$mongo_uri \
      -e MYPORT=$port \
      -e TRUE_HOST_PERSIST_DIR=$host_persist_dir \
      -e TRUE_HOST_RESOURCES_DIR=$host_resources_dir \
      -e TRUE_HOST_POOL_DIR=$host_pool_dir \
      -e USE_ARM64=$use_arm64 \
      -e DEVELOP=$develop \
      -e USE_REMOTE_DATABASE=$use_remote_db \
      -e USE_REMOTE_REPOSITORY=$use_remote_repo \
      -e USE_REMOTE_REPOSITORY_KEY=$use_remote_repo_key \
      -e REMOTE_USERNAME=$remote_username \
      -e REMOTE_PASSWORD=$remote_password \
      -e REMOTE_KEY_FILE=$remote_key_file \
      bsherin/tactic:host$arm_string
  done

#echo "*** creating tactic_nginx ***"
#sudo docker run -d \
#  -p 80:80 \
#  --name tactic_nginx \
#  --restart $restart_policy \
#  --label my_id=tactic_nginx \
#  --label owner=host \
#  --label parent=host \
#  --network=tactic-net \
#  --init \
#  bsherin/tactic:nginx$arm_string