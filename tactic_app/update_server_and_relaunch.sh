#!/bin/bash
cd /srv/tactic && sudo git pull
# sudo docker pull bsherin/tactic -a
cd /srv/tactic/tactic_app
sudo /usr/local/bin/docker-compose build tactic_base
sudo /usr/local/bin/docker-compose build tactic_host
sudo /usr/local/bin/docker-compose build tactic_main
sudo /usr/local/bin/docker-compose build tactic_module_viewer
sudo /usr/local/bin/docker-compose build tactic_tile
sudo /usr/local/bin/docker-compose build tactic_pool_watcher
sudo /usr/local/bin/docker-compose build tactic_mongo_watcher
sudo /srv/tactic/tactic_app/start_tactic.sh --root /srv/tactic --mdir /tacticdata4/mongo/data --pdir /tacticdata4/pool