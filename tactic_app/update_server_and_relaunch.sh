sudo cd /srv/tactic
sudo git pull
sudo docker pull bsherin/tactic -a
sudo /srv/tactic/tactic_app/start_tactic.sh --root /srv/tactic --mdir /tacticdata/mongo/data