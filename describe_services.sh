# /opt/homebrew/bin/aws sso login
aws ecs describe-services \
  --cluster tactic-cluster \
  --services $(aws ecs list-services --cluster tactic-cluster --query 'serviceArns[]' --output text) \
  --query 'services[].{service:serviceName,status:status,desired:desiredCount,running:runningCount,pending:pendingCount}' \
  --output table