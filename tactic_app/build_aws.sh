#!/bin/bash

# This file can't be added to version control because github will then
# immediately delete the access token when it sees it
build_production="True"
do_git="True"

# Dynamically find ROOT_DIR (directory named 'tactic' above the current dir)
PROJECT_DIR=$(cd "$(dirname "$0")" && pwd)
while [[ "$PROJECT_DIR" != "/" && "$(basename "$PROJECT_DIR")" != "tactic" ]]; do
  PROJECT_DIR=$(dirname "$PROJECT_DIR")
done

if [[ "$(basename "$PROJECT_DIR")" != "tactic" ]]; then
  echo "Error: Could not find 'tactic' directory."
  exit 1
fi

export ROOT_DIR="$PROJECT_DIR"
echo "Using ROOT_DIR=$ROOT_DIR"

# shellcheck disable=SC2164
cd "$ROOT_DIR/tactic_app"


while :; do
  case $1 in
    --no-prod)
      build_production="False"
      ;;
    --no-git)
      do_git="False"
      ;;
    *)
      break
      ;;
  esac
  shift
done

if [ $build_production == "True" ] ; then
  echo "*** building production javascript"
  npm run build-production
fi

if [ $do_git == "True" ] ; then
  echo "*** doing git ***"
  gtoken=$(cat github_token.txt)
  git remote add origin https://bsherin:${gtoken}@github.com/bsherin/tactic.git
  git commit -a
  git push
fi

ssh -i {$ROOT_DIR}/LightsailDefaultKey-us-east-2.pem centos@tactictext.net \
'/srv/tactic/tactic_app/update_server_and_relaunch.sh'