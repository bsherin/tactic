#!/bin/bash
docker push -q bsherin/tactic:base
docker push -q bsherin/tactic:host
docker push -q bsherin/tactic:main
docker push -q bsherin/tactic:module_viewer
docker push -q bsherin/tactic:tile
