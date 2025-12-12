export AWS_REGION=us-east-2
export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export ECR=${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
export TAG=tiles-2025-10-07   # pick your tag; keep it consistent across all 3

aws ecr create-repository --repository-name tactic-base   --region ${AWS_REGION} || true
aws ecr create-repository --repository-name tactic-wheels --region ${AWS_REGION} || true
aws ecr create-repository --repository-name tactic-tile   --region ${AWS_REGION} || true

aws ecr get-login-password --region ${AWS_REGION} \
 | docker login --username AWS --password-stdin ${ECR}
