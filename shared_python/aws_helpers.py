import json
import os

import boto3
from botocore.config import Config

AWS_REGION = "us-east-2"  # Default region, can be overridden by environment variable
ECS_CLUSTER = "tactic-cluster"
on_aws = os.getenv("RUNNING_ON_AWS", "true").lower() == "true"


def get_ssm_parameter(name, default=None):
    if on_aws:
        ssm = boto3.client('ssm', region_name="us-east-2")  # Adjust region as needed
    else:
        ssm = boto3.client(
            "ssm",
            endpoint_url="http://host.docker.internal:4566",
            aws_access_key_id="test",
            aws_secret_access_key="test",
            region_name="us-east-2",
            config=Config(s3={"addressing_style": "path"})
        )
    try:
        response = ssm.get_parameter(Name=name, WithDecryption=True)
        return response['Parameter']['Value']
    except ssm.exceptions.ParameterNotFound:
        return default
    except Exception as e:
        print(f"Error fetching parameter {name}: {e}")
        return default


def resolve_task_identity(id_prefix):
    import requests
    # Try env first (some setups inject it)
    arn = os.getenv("ECS_TASK_ARN")

    # Fallback to the ECS task metadata endpoint
    if not arn:
        uri = os.getenv("ECS_CONTAINER_METADATA_URI_V4") or os.getenv("ECS_CONTAINER_METADATA_URI")
        if uri:
            try:
                data = requests.get(f"{uri}/task", timeout=2).json()
                arn = data.get("TaskARN")
            except Exception as e:
                print(f"got an error when resolving ECS task ARN {e}")
                arn = None

    if arn:
        print("successfully resolved ECS task ARN")
        return arn, f'{id_prefix}{arn.split("/")[-1]}'
    # Local/dev fallback
    fallback_id = os.getenv("MY_ID") or f"{id_prefix}{os.getpid()}"
    return None, fallback_id


def get_s3_client():
    cfg = Config(region_name=AWS_REGION, s3={"addressing_style": "path"}, signature_version="s3v4")
    if on_aws:
        s3 = boto3.client("s3", config=cfg)
    else:
        s3 = boto3.client(
            "s3",
            endpoint_url="http://host.docker.internal:4566",
            aws_access_key_id="test",
            aws_secret_access_key="test",
            config=cfg
        )
    return s3

def load_secret_json(secret_arn: str):
    region = get_ssm_parameter("MY_AWS_REGION")
    sm = boto3.client("secretsmanager", region_name=region)
    try:
        r = sm.get_secret_value(SecretId=secret_arn)
        if "SecretString" in r:
            return json.loads(r["SecretString"])
        else:
            # binary not expected here, but handle anyway
            return json.loads(r["SecretBinary"].decode("utf-8"))
    except Exception as e:
        raise RuntimeError(f"Failed to fetch secret: {e}")