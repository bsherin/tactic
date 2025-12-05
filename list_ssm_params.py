#!/usr/bin/env python3
"""
list_ssm_params.py

List SSM parameters from AWS or LocalStack.

Examples:

  # List everything from real AWS (default profile & region)
  python list_ssm_params.py --target aws

  # List everything from LocalStack
  python list_ssm_params.py --target localstack

  # List only parameters under a path
  python list_ssm_params.py --path /tactic/dev

  # Use specific AWS profile
  python list_ssm_params.py --profile tactic

  # Show full strings (don't truncate)
  python list_ssm_params.py --no-truncate

  # JSON output (useful for diffing)
  python list_ssm_params.py --json
"""

import argparse
import json
from typing import List

import boto3
from botocore.exceptions import BotoCoreError, ClientError

REGION = "us-east-2"


def make_ssm_client(args):
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


def fetch_parameter_names(ssm, path):
    """Returns list of parameter names"""
    names = []

    paginator = ssm.get_paginator(
        "get_parameters_by_path" if path else "describe_parameters"
    )

    if path:
        pages = paginator.paginate(
            Path=path,
            Recursive=True,
            MaxResults=10
        )
        for page in pages:
            for param in page["Parameters"]:
                names.append(param["Name"])
    else:
        pages = paginator.paginate()
        for page in pages:
            for param in page["Parameters"]:
                names.append(param["Name"])

    return sorted(names)


def fetch_details(ssm, names):
    """Fetch full details (incl SecureString values) in batches"""
    all_params = []

    BATCH = 10  # AWS max for get_parameters

    for i in range(0, len(names), BATCH):
        batch = names[i:i+BATCH]
        resp = ssm.get_parameters(
            Names=batch,
            WithDecryption=True
        )
        all_params.extend(resp["Parameters"])

    return sorted(all_params, key=lambda p: p["Name"])


def truncate(s, n=80):
    if len(s) <= n:
        return s
    return s[:n-3] + "..."


def main():
    parser = argparse.ArgumentParser(description="List all AWS SSM parameters.")
    parser.add_argument(
        "--target",
        choices=["aws", "localstack"],
        default="aws",
        help="AWS or LocalStack (default: aws)",
    )

    parser.add_argument(
        "--path",
        help="Only list parameters under this path (recursive), e.g. /tactic/dev"
    )
    parser.add_argument(
        "--no-truncate",
        action="store_true",
        help="Show full values instead of truncating"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit output as JSON instead of table"
    )

    args = parser.parse_args()

    ssm = make_ssm_client(args)

    try:
        names = fetch_parameter_names(ssm, args.path)
        if not names:
            print("No parameters found.")
            return

        params = fetch_details(ssm, names)

    except (BotoCoreError, ClientError) as e:
        print("Error querying SSM:", e)
        return

    if args.json:
        print(json.dumps(params, indent=2))
        return

    # Table output
    name_w = max(len(p["Name"]) for p in params)
    type_w = max(len(p["Type"]) for p in params)

    print(
        f"{'NAME'.ljust(name_w)} | {'TYPE'.ljust(type_w)} | VALUE"
    )
    print("-" * (name_w + type_w + 12))

    for p in params:
        val = p["Value"]
        if not args.no_truncate:
            val = truncate(val, 80)

        print(
            f"{p['Name'].ljust(name_w)} | "
            f"{p['Type'].ljust(type_w)} | "
            f"{val}"
        )


if __name__ == "__main__":
    main()