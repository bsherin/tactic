#!/bin/bash

# This file can't be added to version control because github will then
# immediately delete the access token when it sees it
build_production="True"
do_git="True"


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
  git remote set-url origin https://bsherin:${gtoken}@github.com/bsherin/tactic.git
  git commit -a
  git push
fi

ssh -i /Users/brucesherin/PycharmProjects/tactic/LightsailDefaultKey-us-east-2.pem centos@tactictext.net \
'/srv/tactic/tactic_app/update_server_and_relaunch.sh'