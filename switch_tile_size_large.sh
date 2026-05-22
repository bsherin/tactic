/opt/homebrew/bin/aws sso login --profile AWSAdministratorAccess-924818964184
export TACTIC_TILE_TASKDEF_STANDARD="tactic-tile:10"
export TACTIC_TILE_TASKDEF_LARGE="tactic-tile:11"
export DEFAULT_TILE_SIZE="standard"
AWS_PROFILE=AWSAdministratorAccess-924818964184 python tactic_ecs_power_staged.py switch-tile-size --tile-size large --tile-desired-count 5