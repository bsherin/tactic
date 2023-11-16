#!/bin/bash
mongo_dir=mongo-volume
mongo_uri="tactic-mongo"

sudo docker run -d \
  -v $mongo_dir:/data/db \
  -p 27017:27017 \
  --name $mongo_uri \
  --restart always \
  --network=tactic-net \
  mongo:latest --replSet rs0

