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
fi