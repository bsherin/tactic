export AWS_REGION=us-east-2
export SERVICE=$1
export CLUSTER=tactic-cluster

aws ecs update-service \
  --region "${AWS_REGION}" \
  --cluster "${CLUSTER}" \
  --service "${SERVICE}" \
  --force-new-deployment