#!/usr/bin/env bash
set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-2}"
ACCOUNT_ID="${ACCOUNT_ID:-924818964184}"
CLUSTER="${ECS_CLUSTER_NAME:-tactic-cluster}"

export AWS_PROFILE=AWSAdministratorAccess-924818964184

KEY="$1"

case "$KEY" in
  main|tactic-main)
    SERVICE="tactic-main-service"
    ;;
  module-viewer|tactic-module-viewer)
    SERVICE="tactic-module-viewer"
    ;;
  pool-watcher|tactic-pool-watcher-s3)
    SERVICE="tactic-pool-watcher-s3"
    ;;
  tile|tactic-tile)
    SERVICE="tactic-tile-pool"
    ;;
  *)
    echo "Unknown service key: $KEY" >&2
    exit 1
    ;;
esac

echo "Restarting ECS service:"
echo "  Cluster: $CLUSTER"
echo "  Service: $SERVICE"
echo

aws ecs update-service \
  --region "$AWS_REGION" \
  --cluster "$CLUSTER" \
  --service "$SERVICE" \
  --force-new-deployment