for iname in "tactic-main" "tactic-module-viewer" "tactic-pool-watcher-s3" "tactic-tile"
  do
    ./push_image.sh $iname
  done