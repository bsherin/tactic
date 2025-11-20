
export SERVICE=$1

TASKS=( $(aws ecs list-tasks --cluster tactic-cluster --service-name ${SERVICE}--query 'taskArns' --output text) )
for ARN in "${TASKS[@]}"; do
  aws ecs stop-task --cluster tactic-cluster --task "$ARN" --reason "forced reset"
done

aws ecs update-service \
  --region us-east-2 \
  --cluster tactic-cluster \
  --service ${SERVICE} \
  --force-new-deployment