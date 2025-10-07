#!/usr/bin/env bash
set -euo pipefail

# ---- Config you can tweak (or pass via env) -------------------------------
AWS_REGION="${AWS_REGION:-us-east-2}"
PROFILE_OPT="${AWS_PROFILE:+--profile ${AWS_PROFILE}}"

# Files
ENV_FILE="${ENV_FILE:-server.env}"     # your existing compose env file

# ECR tag to publish (single tag shared across base/wheels/tile)
TAG=x86

# Compose service names (must match docker-compose.yml)
BASE_SVC="${BASE_SVC:-tactic_base}"
WHEELS_SVC="${WHEELS_SVC:-tactic_wheels}"
TILE_SVC="${TILE_SVC:-tactic_tile}"

# --------------------------------------------------------------------------

# Helper: colored echo
cecho() { printf "\033[1;32m%s\033[0m\n" "$*"; }
eexit() { printf "\033[1;31mERROR:\033[0m %s\n" "$*" >&2; exit 1; }

# 0) Sanity checks
command -v aws >/dev/null || eexit "aws CLI not found"
command -v docker >/dev/null || eexit "docker not found"
command -v docker-compose >/dev/null || true  # not required, we use 'docker compose'

# 1) Load server.env so IMG_SUFFIX/PLATFORM etc. are available to Compose
[ -f "${ENV_FILE}" ] || eexit "Env file ${ENV_FILE} not found"
# shellcheck disable=SC1090
source "${ENV_FILE}"

# Strongly recommended: PLATFORM=linux/amd64 and IMG_SUFFIX without quotes in server.env
[ "${PLATFORM:-}" = "linux/amd64" ] || cecho "Note: PLATFORM is '${PLATFORM:-unset}'. For Fargate use 'linux/amd64'."
IMG_SUFFIX="${IMG_SUFFIX:-x86}"

# 2) Resolve AWS account/ECR and login
cecho "Resolving AWS Account ID..."
ACCOUNT_ID="$(aws sts get-caller-identity ${PROFILE_OPT} --query Account --output text)"
ECR="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

cecho "Ensuring ECR repos exist..."
aws ecr create-repository ${PROFILE_OPT} --region "${AWS_REGION}" --repository-name tactic-base   >/dev/null 2>&1 || true
aws ecr create-repository ${PROFILE_OPT} --region "${AWS_REGION}" --repository-name tactic-wheels >/dev/null 2>&1 || true
aws ecr create-repository ${PROFILE_OPT} --region "${AWS_REGION}" --repository-name tactic-tile   >/dev/null 2>&1 || true

cecho "Logging in to ECR..."
aws ecr get-login-password ${PROFILE_OPT} --region "${AWS_REGION}" \
  | docker login --username AWS --password-stdin "${ECR}"

# 3) Make sure BuildKit/Buildx are ready (helps cross-arch and caching)
export DOCKER_BUILDKIT=1
docker buildx create --use --name xplat >/dev/null 2>&1 || true
docker buildx inspect >/dev/null || true
docker buildx inspect --bootstrap >/dev/null || true

# 4) Build BASE (Compose), tag & push
cecho "Building ${BASE_SVC} with docker compose (platform=${PLATFORM})..."
docker compose --env-file "${ENV_FILE}" build "${BASE_SVC}"

LOCAL_BASE_IMAGE="bsherin/tactic-base:${IMG_SUFFIX}"
REMOTE_BASE_IMAGE="${ECR}/tactic-base:${TAG}"

cecho "Tagging & pushing base -> ${REMOTE_BASE_IMAGE}"
docker tag "${LOCAL_BASE_IMAGE}" "${REMOTE_BASE_IMAGE}"
docker push "${REMOTE_BASE_IMAGE}"

# 5) Build WHEELS (point BASE_IMAGE at ECR), tag & push
cecho "Building ${WHEELS_SVC} (BASE_IMAGE=${REMOTE_BASE_IMAGE})..."
BASE_IMAGE="${REMOTE_BASE_IMAGE}" \
docker compose --env-file "${ENV_FILE}" build "${WHEELS_SVC}"

LOCAL_WHEELS_IMAGE="bsherin/tactic-wheels:${IMG_SUFFIX}"
REMOTE_WHEELS_IMAGE="${ECR}/tactic-wheels:${TAG}"

cecho "Tagging & pushing wheels -> ${REMOTE_WHEELS_IMAGE}"
docker tag "${LOCAL_WHEELS_IMAGE}" "${REMOTE_WHEELS_IMAGE}"
docker push "${REMOTE_WHEELS_IMAGE}"

# 6) Build TILE (point BASE & WHEELS at ECR), tag & push
cecho "Building ${TILE_SVC} (BASE_IMAGE=${REMOTE_BASE_IMAGE}, WHEELS_IMAGE=${REMOTE_WHEELS_IMAGE})..."
BASE_IMAGE="${REMOTE_BASE_IMAGE}" \
WHEELS_IMAGE="${REMOTE_WHEELS_IMAGE}" \
docker compose --env-file "${ENV_FILE}" build "${TILE_SVC}"

LOCAL_TILE_IMAGE="bsherin/tactic-tile:${IMG_SUFFIX}"
REMOTE_TILE_IMAGE="${ECR}/tactic-tile:${TAG}"

cecho "Tagging & pushing tile -> ${REMOTE_TILE_IMAGE}"
docker tag "${LOCAL_TILE_IMAGE}" "${REMOTE_TILE_IMAGE}"
docker push "${REMOTE_TILE_IMAGE}"

cecho "Done!"
echo "ECR images:"
echo "  ${REMOTE_BASE_IMAGE}"
echo "  ${REMOTE_WHEELS_IMAGE}"
echo "  ${REMOTE_TILE_IMAGE}"
echo
echo "Use '${REMOTE_TILE_IMAGE}' in your ECS task definition."