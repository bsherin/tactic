export AWS_REGION=us-east-2
export ACCOUNT_ID=000000000000               # LocalStack default
export REPO=$1
export TAG=arm64

# Login to local registry
awslocal ecr get-login-password --region ${AWS_REGION} \
  | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.localhost.localstack.cloud:4566

# Tag & push image
docker tag bsherin/${REPO}:${TAG} \
  ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.localhost.localstack.cloud:4566/${REPO}:${TAG}

docker push ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.localhost.localstack.cloud:4566/${REPO}:${TAG}

# Describe images to confirm push
awslocal ecr describe-images \
  --repository-name ${REPO} \
  --image-ids imageTag=${TAG} \
  --region ${AWS_REGION} \
  --query 'imageDetails[0].imageDigest'