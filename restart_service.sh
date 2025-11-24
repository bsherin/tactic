export SERVICE=$1

# List the tasks correctly (space fixed before --query)
TASKS=( $(aws ecs list-tasks \
    --cluster tactic-cluster \
    --service-name "${SERVICE}" \
    --query 'taskArns' \
    --output text) )

# Stop tasks
for ARN in "${TASKS[@]}"; do
  aws ecs stop-task \
    --cluster tactic-cluster \
    --task "$ARN" \
    --reason "forced reset"
done

# Force new deployment
aws ecs update-service \
  --region us-east-2 \
  --cluster tactic-cluster \
  --service "${SERVICE}" \
  --force-new-deployment