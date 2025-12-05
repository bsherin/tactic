import os
import sys
import json
import boto3
from typing import Dict

REGION = os.getenv("AWS_REGION", "us-east-2")
CLUSTER = os.getenv("ECS_CLUSTER_NAME", "tactic-cluster")

SERVICES = [
    "tactic-main-service",
    "tactic-module-viewer",
    "tactic-pool-watcher-s3",
    "tactic-tile-pool",
]

# Fill these with your preferred "daytime" capacities
BASELINE_CAPACITY: Dict[str, Dict[str, int]] = {
    "tactic-main-service":       {"min": 1, "max": 2, "desired": 1},
    "tactic-module-viewer":      {"min": 1, "max": 2, "desired": 1},
    "tactic-pool-watcher-s3":    {"min": 1, "max": 2, "desired": 1},
    "tactic-tile-pool":          {"min": 0, "max": 10, "desired": 3},
}

ecs = boto3.client("ecs", region_name=REGION)
autoscaling = boto3.client("application-autoscaling", region_name=REGION)


def _resource_id(service_name: str) -> str:
    # This is the Application Auto Scaling resource ID format for ECS services
    return f"service/{CLUSTER}/{service_name}"


def stop_services():
    """
    Set desiredCount=0 and autoscaling min/max=0 for all services.
    This prevents any scaling policy (CPU or custom CW metric) from starting tasks.
    """
    for svc in SERVICES:
        print(f"[STOP] Updating ECS service {svc} to desiredCount=0")
        ecs.update_service(
            cluster=CLUSTER,
            service=svc,
            desiredCount=0,
        )

        print(f"[STOP] Setting scalable target for {svc} to min=0, max=0")
        autoscaling.register_scalable_target(
            ServiceNamespace="ecs",
            ResourceId=_resource_id(svc),
            ScalableDimension="ecs:service:DesiredCount",
            MinCapacity=0,
            MaxCapacity=0,
        )


def start_services():
    """
    Restore min/max/desired to baseline values.
    Autoscaling policies remain attached and will work within this range.
    """
    for svc in SERVICES:
        caps = BASELINE_CAPACITY[svc]
        print(
            f"[START] Setting scalable target for {svc} to "
            f"min={caps['min']}, max={caps['max']}"
        )
        autoscaling.register_scalable_target(
            ServiceNamespace="ecs",
            ResourceId=_resource_id(svc),
            ScalableDimension="ecs:service:DesiredCount",
            MinCapacity=caps["min"],
            MaxCapacity=caps["max"],
        )

        print(
            f"[START] Updating ECS service {svc} to desiredCount={caps['desired']}"
        )
        ecs.update_service(
            cluster=CLUSTER,
            service=svc,
            desiredCount=caps["desired"],
        )


# ---- Lambda entry point -----------------------------------------------------

def lambda_handler(event, context):
    """
    EventBridge can send {"action": "stop"} or {"action": "start"}.
    """
    action = (event.get("action") or "").lower()
    print(f"Received action={action}")
    if action == "stop":
        stop_services()
    elif action == "start":
        start_services()
    else:
        raise ValueError(f"Unknown action: {action}")
    return {"status": "ok", "action": action}


# ---- CLI entry point for manual use ----------------------------------------

if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in ("start", "stop"):
        print("Usage: python tactic_ecs_power.py [start|stop]")
        sys.exit(1)

    arg_action = sys.argv[1]
    if arg_action == "stop":
        stop_services()
    else:
        start_services()