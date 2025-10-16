export AWS_REGION=us-east-2
export ACCOUNT_ID=924818964184
export REPO=tactic-tile
export TAG=x86

aws ecr get-login-password --region "$AWS_REGION" \
 | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

docker tag bsherin/tactic-tile:${TAG} ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO}:${TAG}
docker push ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO}:${TAG}

aws ecr describe-images --region us-east-2 --repository-name tactic-tile \
  --image-ids imageTag=x86 --query 'imageDetails[0].imageDigest'\

# Stop all running ECS tasks for the tactic-tile-pool service
TASKS=( $(aws ecs list-tasks --cluster tactic-cluster --service-name tactic-tile-pool --query 'taskArns' --output text) )
for ARN in "${TASKS[@]}"; do
  aws ecs stop-task --cluster tactic-cluster --task "$ARN" --reason "forced reset"
done

# Force a new deployment of the tactic-tile-pool service to use the new image
aws ecs update-service \
  --region us-east-2 \
  --cluster tactic-cluster \
  --service tactic-tile-pool \
  --force-new-deployment