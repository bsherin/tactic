import boto3

def get_sms_parameter(name, default=None):
    """
    Fetches a parameter from AWS Systems Manager Parameter Store.
    Returns the parameter value or default if not found.
    """
    ssm = boto3.client('ssm', region="us-east-2")  # Adjust region as needed
    try:
        response = ssm.get_parameter(Name=name, WithDecryption=True)
        return response['Parameter']['Value']
    except ssm.exceptions.ParameterNotFound:
        return default
    except Exception as e:
        print(f"Error fetching parameter {name}: {e}")
        return default

def load_secret_json(secret_arn: str):
    sm = boto3.client("secretsmanager", region_name=REGION)
    try:
        r = sm.get_secret_value(SecretId=secret_arn)
        if "SecretString" in r:
            return json.loads(r["SecretString"])
        else:
            # binary not expected here, but handle anyway
            return json.loads(r["SecretBinary"].decode("utf-8"))
    except Exception as e:
        raise RuntimeError(f"Failed to fetch secret: {e}")