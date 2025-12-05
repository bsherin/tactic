#!/usr/bin/env python3
"""
sync_ssm_params.py

Load SSM parameter definitions from a JSON file and write them
to AWS SSM (either real AWS or LocalStack).

Example usage:

  # Real AWS, default profile, names as-is
  python sync_ssm_params.py \
      --config ssm_params.json \
      --target aws \
      --overwrite

  # Real AWS, with a path prefix and explicit profile
  python sync_ssm_params.py \
      --config ssm_params.json \
      --target aws \
      --profile tactic \
      --path-prefix /tactic/dev \
      --overwrite

  # LocalStack (assuming default localstack port)
  python sync_ssm_params.py \
      --config ssm_params.json \
      --target localstack \
      --overwrite
"""

import argparse
import json
import sys
from pathlib import Path

import boto3
from botocore.exceptions import BotoCoreError, ClientError


def load_config(path):
    if not path.exists():
        raise FileNotFoundError(f"Config file not found: {path}")
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    if "parameters" not in data or not isinstance(data["parameters"], list):
        raise ValueError("Config JSON must have a 'parameters' list")

    return data


def make_ssm_client(args, region):
    if args.target == "localstack":
        endpoint = "http://localhost:4566"  # LocalStack endpoint
        ssm = boto3.client(
            "ssm",
            endpoint_url=endpoint,
            aws_access_key_id="test",
            aws_secret_access_key="test",
            region_name="us-east-2"
        )
    else:
        ssm = boto3.client("ssm", region_name=REGION)
    return ssm


def build_param_name(base_name: str, path_prefix):
    if not path_prefix:
        return base_name
    prefix = path_prefix.rstrip("/")
    return f"{prefix}/{base_name}"


def main():
    parser = argparse.ArgumentParser(description="Sync SSM parameters from JSON to AWS/LocalStack.")
    parser.add_argument(
        "--config", "-c",
        type=Path,
        default=Path("ssm_params.json"),
        help="Path to JSON config file (default: ssm_params.json)",
    )
    parser.add_argument(
        "--target",
        choices=["aws", "localstack"],
        default="aws",
        help="Where to write parameters: real AWS or LocalStack (default: aws)",
    )
    parser.add_argument(
        "--path-prefix",
        help="Optional path prefix to prepend to each parameter name, e.g. /tactic/dev.",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing parameters with the same name.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be done without actually calling SSM.",
    )

    args = parser.parse_args()

    try:
        config = load_config(args.config)
    except Exception as e:
        print(f"Error loading config: {e}", file=sys.stderr)
        sys.exit(1)

    # Region: from defaults.region if present, else fall back to environment/boto config
    region = config.get("defaults", {}).get("region")
    if not region:
        print(
            "No 'defaults.region' in config; relying on AWS default region "
            "(env vars/profile/instance metadata).",
            file=sys.stderr,
        )

    try:
        ssm = make_ssm_client(args, region=region)
    except Exception as e:
        print(f"Error creating SSM client: {e}", file=sys.stderr)
        sys.exit(1)

    # Optional: warn if there are duplicate names in the JSON
    seen = {}
    for p in config["parameters"]:
        n = p.get("name")
        if not n:
            continue
        seen.setdefault(n, 0)
        seen[n] += 1
    dups = [name for name, count in seen.items() if count > 1]
    if dups:
        print(f"Warning: duplicate parameter 'name' values found in config: {dups}", file=sys.stderr)

    for p in config["parameters"]:
        if args.target == "localstack" and "local_value" in p:
            base_name = p["local_value"]
        else:
            base_name = p["name"]
        value = str(p["value"])
        ptype = p.get("type", "String")

        param_name = build_param_name(base_name, args.path_prefix)

        put_kwargs = {
            "Name": param_name,
            "Value": value,
            "Type": ptype,
            "Overwrite": args.overwrite,
        }

        # Optional: allow per-parameter KMS key in JSON:
        # { "name": "...", "value": "...", "type": "SecureString", "key_id": "alias/your-key" }
        if ptype == "SecureString" and "key_id" in p:
            put_kwargs["KeyId"] = p["key_id"]

        if args.dry_run:
            print(f"[DRY-RUN] put_parameter({put_kwargs})")
            continue

        try:
            ssm.put_parameter(**put_kwargs)
            print(f"Set {param_name} (Type={ptype})")
        except (BotoCoreError, ClientError) as e:
            print(f"Error setting {param_name}: {e}", file=sys.stderr)


if __name__ == "__main__":
    main()