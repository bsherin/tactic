#!/usr/bin/env bash
set -euo pipefail

# Defaults (can be overridden via env)
AWS_REGION="${AWS_REGION:-us-east-2}"
ACCOUNT_ID="${ACCOUNT_ID:-924818964184}"
CLUSTER="${ECS_CLUSTER_NAME:-tactic-cluster}"
TAG="${TAG:-x86}"

if [ $# -lt 1 ]; then
  echo "Usage: $0 <short-name|image-name> [restart]"
  echo
  echo "Short names:"
  echo "  main          -> tactic-main           (service: tactic-main-service)"
  echo "  module-viewer -> tactic-module-viewer  (service: tactic-module-viewer)"
  echo "  pool-watcher  -> tactic-pool-watcher-s3 (service: tactic-pool-watcher-s3)"
  echo "  tile          -> tactic-tile           (service: tactic-tile-pool)"
  echo
  echo "Example:"
  echo "  $0 main"
  echo "  $0 tile restart"
  exit 1
fi

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
RESTART_ARG="${2:-}"

# Map short key to image/repo/service
case "$KEY" in
  main|tactic-main)
    IMAGE="tactic-main"
    REPO="tactic-main"
    SERVICE="tactic-main-service"
    ;;
  module-viewer|tactic-module-viewer)
    IMAGE="tactic-module-viewer"
    REPO="tactic-module-viewer"
    SERVICE="tactic-module-viewer"
    ;;
  pool-watcher|tactic-pool-watcher-s3)
    IMAGE="tactic-pool-watcher-s3"
    REPO="tactic-pool-watcher-s3"
    SERVICE="tactic-pool-watcher-s3"
    ;;
  tile|tactic-tile)
    IMAGE="tactic-tile"
    REPO="tactic-tile"
    SERVICE="tactic-tile-pool"
    ;;
  *)
    echo "Unknown image key: '$KEY'"
    echo "Valid keys: main, module-viewer, pool-watcher, tile"
    echo "Or pass the full image name used in bsherin/<image>:${TAG}"
    exit 1
    ;;
esac

echo "Using:"
echo "  IMAGE   = ${IMAGE}"
echo "  REPO    = ${REPO}"
echo "  SERVICE = ${SERVICE}"
echo "  TAG     = ${TAG}"
echo

# Login to ECR
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin \
    "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Tag + push
docker tag "bsherin/${IMAGE}:${TAG}" \
  "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO}:${TAG}"

docker push "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO}:${TAG}"

# Show image digest
echo
echo "Image digest in ECR:"
aws ecr describe-images \
  --region "$AWS_REGION" \
  --repository-name "${REPO}" \
  --image-ids "imageTag=${TAG}" \
  --query 'imageDetails[0].imageDigest' \
  --output text

# Optionally restart the service
if [[ "$RESTART_ARG" == "restart" || "$RESTART_ARG" == "-r" || "$RESTART_ARG" == "--restart" ]]; then
  echo
  echo "Forcing new deployment of ECS service '${SERVICE}' on cluster '${CLUSTER}'..."
  aws ecs update-service \
    --region "$AWS_REGION" \
    --cluster "$CLUSTER" \
    --service "$SERVICE" \
    --force-new-deployment

  if [[ "$SERVICE" == "tactic-tile-pool" ]]; then
    stop_ad_hoc_family_tasks "tactic-tile"
  fi
fi