#!/bin/bash

use_remote_db="False"
use_remote_repo="False"
use_remote_repo="False"
use_remote_repo_key="False"
remote_username=
remote_password=
remote_key_file="None"
mongo_uri="tactic-mongo"
restart_policy="on-failure:5"
arm_string="-arm64"

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
  bsherin/tactic:mongo-watcher$arm_string

