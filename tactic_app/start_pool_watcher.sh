#!/bin/bash

host_pool_dir="/var/lib/docker/volumes/pool-volume/_data"
sudo docker run -d \
  --name pool_watcher \
  --restart "on-failure:5" \
  --label my_id=pool_watcher \
  --label owner=host \
  --label parent=host \
  --label other_name=pool_watcher \
  --network=tactic-net \
  --init \
  --mount type=bind,source=$host_pool_dir,target=/pool \
  bsherin/tactic:pool-watcher-arm64