localstack auth set-token ls-tAPeBEGI-2773-Nero-DOko-gofujiQEeee7
export AWS_ACCESS_KEY_ID="test"
export AWS_SECRET_ACCESS_KEY="test"
export AWS_DEFAULT_REGION="us-east-2"
export SNAPSHOT_FLUSH_INTERVAL=600
PERSISTENCE=1 localstack start -d