#!/usr/bin/env bash
set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-2}"
ACCOUNT_ID="${ACCOUNT_ID:-924818964184}"
CLUSTER="${ECS_CLUSTER_NAME:-tactic-cluster}"

export AWS_PROFILE=AWSAdministratorAccess-924818964184

stop_ad_hoc_family_tasks() {
  local FAMILY="$1"
  local REGION="$AWS_REGION"
  local CLUSTER="$CLUSTER"

  echo "Stopping ad hoc RUNNING tasks in family=${FAMILY} (cluster=${CLUSTER})..."

  # List all RUNNING tasks in this family
  local TASK_ARNS
  TASK_ARNS=$(aws ecs list-tasks \
    --region "$REGION" \
    --cluster "$CLUSTER" \
    --family "$FAMILY" \
    --desired-status RUNNING \
    --query 'taskArns[]' \
    --output text)

  if [[ -z "${TASK_ARNS}" || "${TASK_ARNS}" == "None" ]]; then
    echo "  - none found"
    return 0
  fi

  # Describe and keep only tasks whose group is NOT service:*
  # (service tasks usually have group like "service:tactic-tile-pool")
  local AD_HOC_ARNS
  AD_HOC_ARNS=$(aws ecs describe-tasks \
    --region "$REGION" \
    --cluster "$CLUSTER" \
    --tasks ${TASK_ARNS} \
    --query 'tasks[?!(starts_with(group, `service:`))].taskArn' \
    --output text)

  if [[ -z "${AD_HOC_ARNS}" || "${AD_HOC_ARNS}" == "None" ]]; then
    echo "  - found tasks in family, but none look ad hoc (non-service)"
    return 0
  fi

  echo "  - stopping $(wc -w <<< "${AD_HOC_ARNS}") ad hoc task(s)"

  # Best-effort: disable task protection (some tasks may not be protected)
  aws ecs update-task-protection \
    --region "$REGION" \
    --cluster "$CLUSTER" \
    --tasks ${AD_HOC_ARNS} \
    --protection-enabled false \
    >/dev/null 2>&1 || true

  # Stop them
  for arn in ${AD_HOC_ARNS}; do
    aws ecs stop-task \
      --region "$REGION" \
      --cluster "$CLUSTER" \
      --task "$arn" \
      --reason "restart script cleanup: stop ad hoc ${FAMILY} task" \
      >/dev/null
    echo "    - stop_task ${arn}"
  done
}

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

if [[ "$SERVICE" == "tactic-tile-pool" ]]; then
  stop_ad_hoc_family_tasks "tactic-tile"
fi