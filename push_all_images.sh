#!/usr/bin/env bash
set -euo pipefail

# Defaults (override via env if needed)
AWS_REGION="${AWS_REGION:-us-east-2}"
ACCOUNT_ID="${ACCOUNT_ID:-924818964184}"
CLUSTER="${ECS_CLUSTER_NAME:-tactic-cluster}"
TAG="${TAG:-x86}"

RESTART=false
if [[ "${1:-}" == "restart" || "${1:-}" == "-r" || "${1:-}" == "--restart" ]]; then
  RESTART=true
fi

# Image / repo / service table
# format: short|image|repo|service
IMAGES=(
  "main|tactic-main|tactic-main|tactic-main-service"
  "module-viewer|tactic-module-viewer|tactic-module-viewer|tactic-module-viewer"
  "pool-watcher|tactic-pool-watcher-s3|tactic-pool-watcher-s3|tactic-pool-watcher-s3"
  "tile|tactic-tile|tactic-tile|tactic-tile-pool"
)

echo "Pushing all images (tag=${TAG})"
echo "Region:  ${AWS_REGION}"
echo "Account: ${ACCOUNT_ID}"
echo

# Login once
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin \
    "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

for entry in "${IMAGES[@]}"; do
  IFS="|" read -r SHORT IMAGE REPO SERVICE <<< "$entry"

  echo "======================================="
  echo "Image:   ${IMAGE}"
  echo "Repo:    ${REPO}"
  echo "Service: ${SERVICE}"
  echo

  docker tag "bsherin/${IMAGE}:${TAG}" \
    "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO}:${TAG}"

  docker push \
    "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO}:${TAG}"

  echo "ECR digest:"
  aws ecr describe-images \
    --region "$AWS_REGION" \
    --repository-name "${REPO}" \
    --image-ids "imageTag=${TAG}" \
    --query 'imageDetails[0].imageDigest' \
    --output text

  if $RESTART; then
    echo "Forcing new deployment of ${SERVICE}..."
    aws ecs update-service \
      --region "$AWS_REGION" \
      --cluster "$CLUSTER" \
      --service "$SERVICE" \
      --force-new-deployment
  fi

  echo
done

echo "All images pushed successfully."