import os

def running_on_aws():
    if os.getenv("ECS_CONTAINER_METADATA_URI_V4") or os.getenv("ECS_CONTAINER_METADATA_URI"):
        return True
    return os.getenv("RUNNING_ON_AWS", "true").lower() == "true"

on_aws = running_on_aws()