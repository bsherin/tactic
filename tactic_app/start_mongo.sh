#!/bin/bash
mongo_dir="mongo-volume"
mongo_uri="tactic-mongo"

sudo docker run -p 27017:27017 -v $mongo_dir:/data/db --name $mongo_uri --network=tactic-net --restart always -d mongo:latest --replSet "rs0"