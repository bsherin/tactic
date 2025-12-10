export AWS_REGION=us-east-2
export ACCOUNT_ID=924818964184
export REPO=$1
export IMAGE=$1
export TAG=x86

aws ecr get-login-password --region "$AWS_REGION" \
 | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

docker tag bsherin/${IMAGE}:${TAG} ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO}:${TAG}
docker push ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO}:${TAG}

aws ecr describe-images --region us-east-2 --repository-name ${IMAGE} \
  --image-ids imageTag=x86 --query 'imageDetails[0].imageDigest'