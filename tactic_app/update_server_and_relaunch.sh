cd /srv/tactic && sudo git pull
# sudo docker pull bsherin/tactic -a
sudo /usr/local/bin/docker-compose build tactic_base
sudo /usr/local/bin/docker-compose build tactic_host
sudo /usr/local/bin/docker-compose build tactic_main
sudo /usr/local/bin/docker-compose build tactic_module_viewer
sudo /usr/local/bin/docker-compose build tactic_tile
sudo /srv/tactic/tactic_app/start_tactic.sh --root /srv/tactic --mdir /tacticdata/mongo/data