for sname in "tactic-main-service" "tactic-module-viewer" "tactic-pool-watcher-s3" "tactic-tile"
  do
    ./restart_service.sh $sname
  done