#!/bin/bash
cd /srv/tactic && sudo git pull
# sudo docker pull bsherin/tactic -a
cd /srv/tactic
sudo /usr/bin/docker compose --env-file server.env build tactic_base
sudo /usr/bin/docker compose --env-file server.env --profile build_project build --no-parallel
sudo /srv/tactic/up_tactic.sh --env-file server.env