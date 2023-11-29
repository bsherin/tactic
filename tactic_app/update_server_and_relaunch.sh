#!/bin/bash
cd /srv/tactic && sudo git pull
# sudo docker pull bsherin/tactic -a
cd /srv/tactic/tactic_app
sudo /usr/local/bin/docker compose --env-file server.env --profile build_project build
sudo /srv/tactic/tactic_app/up_tactic.sh --env-file server.env --remove-all