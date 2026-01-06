import os
import sys
import time
import boto3
from typing import List

REGION = os.getenv("AWS_REGION", "us-east-2")
CLUSTER = os.getenv("ECS_CLUSTER_NAME", "tactic-cluster")

SERVICES = [
    "tactic-main-service",
    "tactic-module-viewer",
    "tactic-pool-watcher-s3",
    "tactic-tile-pool",
    "tactic-rabbitmq",
    "tactic-redis",
]

BASELINE_CAPACITY = {
    "tactic-main-service":       {"min": 1, "max": 2, "desired": 1},
    "tactic-module-viewer":      {"min": 1, "max": 2, "desired": 1},
    "tactic-pool-watcher-s3":    {"min": 1, "max": 2, "desired": 1},
    "tactic-tile-pool":          {"min": 0, "max": 10, "desired": 6},
    "tactic-rabbitmq":           {"min": 1, "max": 1, "desired": 1},
    "tactic-redis":              {"min": 1, "max": 1, "desired": 1},
}

ecs = boto3.client("ecs", region_name=REGION)
autoscaling = boto3.client("application-autoscaling", region_name=REGION)

def _resource_id(service_name: str) -> str:
    return f"service/{CLUSTER}/{service_name}"

def _list_service_tasks(service_name: str, desired_status: str = "RUNNING") -> List[str]:
    """Return task ARNs for tasks belonging to an ECS service."""
    arns: List[str] = []
    paginator = ecs.get_paginator("list_tasks")
    for page in paginator.paginate(
        cluster=CLUSTER,
        serviceName=service_name,
        desiredStatus=desired_status,
    ):
        arns.extend(page.get("taskArns", []))
    return arns

def _disable_task_protection(task_arns: List[str]) -> None:
    """Best-effort remove task protection so the service scheduler can scale in/stop them."""
    if not task_arns:
        return
    # ECS API caps this list; 10 is a safe chunk size.
    CHUNK = 10
    for i in range(0, len(task_arns), CHUNK):
        chunk = task_arns[i:i+CHUNK]
        try:
            ecs.update_task_protection(
                cluster=CLUSTER,
                tasks=chunk,
                protectionEnabled=False
            )
            print(f"  - Disabled task protection for {len(chunk)} task(s)")
        except Exception as e:
            # Some tasks may not support protection / may already be stopping; keep going.
            print(f"  ! Could not disable protection for some tasks: {e}")

def _stop_tasks(task_arns: List[str], reason: str) -> None:
    for arn in task_arns:
        try:
            ecs.stop_task(cluster=CLUSTER, task=arn, reason=reason)
            print(f"  - stop_task: {arn}")
        except Exception as e:
            print(f"  ! stop_task failed for {arn}: {e}")

def _wait_for_tasks_stopped(task_arns: List[str], timeout_s: int = 300, poll_s: int = 5) -> None:
    """Wait until all specified tasks are STOPPED (or vanish)."""
    if not task_arns:
        return
    deadline = time.time() + timeout_s
    remaining = set(task_arns)

    while remaining and time.time() < deadline:
        # describe_tasks allows up to 100 tasks per call
        chunked = list(remaining)
        new_remaining = set()

        for i in range(0, len(chunked), 100):
            chunk = chunked[i:i+100]
            try:
                resp = ecs.describe_tasks(cluster=CLUSTER, tasks=chunk)
                tasks = resp.get("tasks", [])
                # If a task ARN is missing from response, treat it as gone/stopped.
                seen = {t["taskArn"] for t in tasks}
                missing = set(chunk) - seen

                for t in tasks:
                    if t.get("lastStatus") != "STOPPED":
                        new_remaining.add(t["taskArn"])

                # missing are no longer describable; assume stopped
                if missing:
                    pass
            except Exception:
                # If describe fails transiently, keep remaining and retry.
                new_remaining.update(chunk)

        remaining = new_remaining
        if remaining:
            time.sleep(poll_s)

    if remaining:
        print(f"  ! Timed out waiting for {len(remaining)} task(s) to stop")
    else:
        print("  - All targeted tasks are STOPPED")

def stop_services(force_stop_tasks: bool = True, wait: bool = True) -> None:
    """
    Set desiredCount=0 and autoscaling min/max=0 for all services,
    then (optionally) force-stop any still-running tasks.
    """
    for svc in SERVICES:
        print(f"[STOP] Updating ECS service {svc} to desiredCount=0")
        ecs.update_service(cluster=CLUSTER, service=svc, desiredCount=0)

        print(f"[STOP] Setting scalable target for {svc} to min=0, max=0")
        autoscaling.register_scalable_target(
            ServiceNamespace="ecs",
            ResourceId=_resource_id(svc),
            ScalableDimension="ecs:service:DesiredCount",
            MinCapacity=0,
            MaxCapacity=0,
        )

        if force_stop_tasks:
            task_arns = _list_service_tasks(svc, desired_status="RUNNING")
            if task_arns:
                print(f"[STOP] Found {len(task_arns)} RUNNING task(s) for {svc}; forcing stop")
                _disable_task_protection(task_arns)
                _stop_tasks(task_arns, reason="tactic_ecs_power stop: force-stop remaining service tasks")
                if wait:
                    _wait_for_tasks_stopped(task_arns, timeout_s=600, poll_s=5)
            else:
                print(f"[STOP] No RUNNING tasks found for {svc}")
    stop_ad_hoc_family_tasks("tactic-tile", wait=wait)

def start_services() -> None:
    for svc in SERVICES:
        caps = BASELINE_CAPACITY[svc]
        print(f"[START] Setting scalable target for {svc} to min={caps['min']}, max={caps['max']}")
        autoscaling.register_scalable_target(
            ServiceNamespace="ecs",
            ResourceId=_resource_id(svc),
            ScalableDimension="ecs:service:DesiredCount",
            MinCapacity=caps["min"],
            MaxCapacity=caps["max"],
        )

        print(f"[START] Updating ECS service {svc} to desiredCount={caps['desired']}")
        ecs.update_service(cluster=CLUSTER, service=svc, desiredCount=caps["desired"])

def lambda_handler(event, _context):
    action = (event.get("action") or "").lower()
    print(f"Received action={action}")
    if action == "stop":
        # In Lambda, you probably want wait=False to avoid long runtimes,
        # but leaving it True here to match your goal.
        stop_services(force_stop_tasks=True, wait=True)
    elif action == "start":
        start_services()
    else:
        raise ValueError(f"Unknown action: {action}")
    return {"status": "ok", "action": action}

def _list_family_tasks(family: str, desired_status: str = "RUNNING") -> List[str]:
    arns: List[str] = []
    paginator = ecs.get_paginator("list_tasks")
    for page in paginator.paginate(
        cluster=CLUSTER,
        family=family,
        desiredStatus=desired_status,
    ):
        arns.extend(page.get("taskArns", []))
    return arns

def _describe_tasks(task_arns: List[str]) -> List[dict]:
    out: List[dict] = []
    for i in range(0, len(task_arns), 100):
        chunk = task_arns[i:i+100]
        resp = ecs.describe_tasks(cluster=CLUSTER, tasks=chunk)
        out.extend(resp.get("tasks", []))
    return out

def stop_ad_hoc_family_tasks(family: str, wait: bool = True) -> None:
    """
    Force-stop RUNNING tasks started ad hoc via run_task for the given task definition family.
    Excludes ECS service-managed tasks by checking task.group (service:*).
    """
    arns = _list_family_tasks(family, desired_status="RUNNING")
    if not arns:
        print(f"[STOP] No RUNNING tasks found in family={family}")
        return

    tasks = _describe_tasks(arns)

    # Service tasks usually have group like "service:tactic-tile-pool".
    # Ad hoc run_task tasks typically do NOT start with "service:".
    ad_hoc = [t["taskArn"] for t in tasks if not (t.get("group") or "").startswith("service:")]

    if not ad_hoc:
        print(f"[STOP] Found {len(tasks)} task(s) in family={family}, but none look ad hoc (non-service).")
        return

    print(f"[STOP] Found {len(ad_hoc)} ad hoc RUNNING task(s) in family={family}; forcing stop")
    _disable_task_protection(ad_hoc)
    _stop_tasks(ad_hoc, reason=f"tactic_ecs_power stop: force-stop ad hoc {family} tasks")
    if wait:
        _wait_for_tasks_stopped(ad_hoc, timeout_s=600, poll_s=5)

if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in ("start", "stop"):
        print("Usage: python tactic_ecs_power.py [start|stop]")
        sys.exit(1)

    if sys.argv[1] == "stop":
        stop_services(force_stop_tasks=True, wait=True)
    else:
        start_services()