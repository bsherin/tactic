#!/bin/bash
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
  git commit -a
  git push https://bsherin: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@github.com/bsherin/tactic
fi

ssh -i /Users/brucesherin/PycharmProjects/tactic/LightsailDefaultKey-us-east-2.pem centos@tactictext.net \
'/srv/tactic/tactic_app/update_server_and_relaunch.sh'