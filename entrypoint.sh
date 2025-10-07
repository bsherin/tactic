#!/usr/bin/env bash
set -euo pipefail

# Defaults (can be overridden by task env)
: "${MYDISK_ROOT:=/mnt/efs/users}"
: "${USERNAME:=unknown}"

# Create EFS-backed dirs if the volume is mounted there
mkdir -p "${MYDISK_ROOT}/${USERNAME}"

# Caches (point these env vars at EFS in the ECS task def)
mkdir -p "${HF_HOME:-/var/cache/hf}" \
         "${TORCH_HOME:-/var/cache/torch}" \
         "${NLTK_DATA:-/root/nltk}" \
         "${MPLCONFIGDIR:-/var/cache/matplotlib}"

# Keep your old /mydisk path working if app expects it
if [ ! -e /mydisk ]; then
  ln -s "${MYDISK_ROOT}/${USERNAME}" /mydisk
fi

# Hand off to the image CMD (python -u tile_main.py)
exec "$@"