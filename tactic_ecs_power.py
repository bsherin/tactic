import os
import sys
import time
import boto3
from typing import List, Dict, Any

REGION = os.getenv("AWS_REGION", "us-east-2")
CLUSTER = os.getenv("ECS_CLUSTER_NAME", "tactic-cluster")

# Services that can be safely stopped by setting desiredCount=0 and Min/Max=0.
SERVICES_SIMPLE = [
    "tactic-main-service",
    "tactic-module-viewer",
    "tactic-pool-watcher-s3",
    "tactic-rabbitmq",
    "tactic-redis",
]

# Services that may have task protection enabled (e.g. tile pool tasks in use)
# and therefore may require force-stop fallback.
SERVICES_NEED_FORCE = [
    "tactic-tile-pool",
]

# Baseline capacities for start
BASELINE_CAPACITY = {
    "tactic-main-service":       {"min": 1, "max": 2,  "desired": 1},
    "tactic-module-viewer":      {"min": 1, "max": 2,  "desired": 1},
    "tactic-pool-watcher-s3":    {"min": 1, "max": 2,  "desired": 1},
    "tactic-tile-pool":          {"min": 0, "max": 10, "desired": 6},
    "tactic-rabbitmq":           {"min": 1, "max": 1,  "desired": 1},
    "tactic-redis":              {"min": 1, "max": 1,  "desired": 1},
}

# --- Behavior knobs (tune as you like) ---
DRAIN_GRACE_SECONDS = int(os.getenv("DRAIN_GRACE_SECONDS", "60"))  # wait for normal drain before force-stop
STOP_WAIT_TIMEOUT_S = int(os.getenv("STOP_WAIT_TIMEOUT_S", "600"))
STOP_POLL_S = int(os.getenv("STOP_POLL_S", "5"))

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


def _describe_tasks(task_arns: List[str]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for i in range(0, len(task_arns), 100):
        chunk = task_arns[i:i+100]
        resp = ecs.describe_tasks(cluster=CLUSTER, tasks=chunk)
        out.extend(resp.get("tasks", []))
    return out


def _disable_task_protection(task_arns: List[str]) -> None:
    """Best-effort remove task protection so the scheduler can stop/scale-in tasks."""
    if not task_arns:
        return
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
            print(f"  ! Could not disable protection for some tasks: {e}")


def _stop_tasks(task_arns: List[str], reason: str) -> None:
    for arn in task_arns:
        try:
            ecs.stop_task(cluster=CLUSTER, task=arn, reason=reason)
            print(f"  - stop_task: {arn}")
        except Exception as e:
            print(f"  ! stop_task failed for {arn}: {e}")


def _wait_for_tasks_stopped(task_arns: List[str], timeout_s: int = STOP_WAIT_TIMEOUT_S, poll_s: int = STOP_POLL_S) -> None:
    """Wait until all specified tasks are STOPPED (or vanish)."""
    if not task_arns:
        return
    deadline = time.time() + timeout_s
    remaining = set(task_arns)

    while remaining and time.time() < deadline:
        chunked = list(remaining)
        new_remaining = set()

        for i in range(0, len(chunked), 100):
            chunk = chunked[i:i+100]
            try:
                resp = ecs.describe_tasks(cluster=CLUSTER, tasks=chunk)
                tasks = resp.get("tasks", [])
                seen = {t["taskArn"] for t in tasks}
                missing = set(chunk) - seen

                for t in tasks:
                    if t.get("lastStatus") != "STOPPED":
                        new_remaining.add(t["taskArn"])

                # missing are no longer describable; assume stopped
                _ = missing
            except Exception:
                new_remaining.update(chunk)

        remaining = new_remaining
        if remaining:
            time.sleep(poll_s)

    if remaining:
        print(f"  ! Timed out waiting for {len(remaining)} task(s) to stop")
    else:
        print("  - All targeted tasks are STOPPED")


def _set_service_off(service_name: str) -> None:
    """Disable autoscaling and set desiredCount=0."""
    print(f"[STOP] {service_name}: desiredCount=0")
    ecs.update_service(cluster=CLUSTER, service=service_name, desiredCount=0)

    print(f"[STOP] {service_name}: scalable target min=0 max=0")
    autoscaling.register_scalable_target(
        ServiceNamespace="ecs",
        ResourceId=_resource_id(service_name),
        ScalableDimension="ecs:service:DesiredCount",
        MinCapacity=0,
        MaxCapacity=0,
    )


def _stop_service_force_if_needed(service_name: str, drain_grace_s: int = DRAIN_GRACE_SECONDS) -> None:
    """
    Stop service normally, then if RUNNING tasks remain after a grace period,
    disable task protection and stop them.
    """
    _set_service_off(service_name)

    print(f"[STOP] {service_name}: waiting {drain_grace_s}s for tasks to drain naturally")
    time.sleep(drain_grace_s)

    task_arns = _list_service_tasks(service_name, desired_status="RUNNING")
    if not task_arns:
        print(f"[STOP] {service_name}: no RUNNING tasks after drain grace")
        return

    print(f"[STOP] {service_name}: still has {len(task_arns)} RUNNING task(s); disabling protection + force-stopping")
    _disable_task_protection(task_arns)
    _stop_tasks(task_arns, reason=f"tactic_ecs_power stop: force-stop remaining tasks for {service_name}")
    _wait_for_tasks_stopped(task_arns)


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
    ad_hoc = [t["taskArn"] for t in tasks if not (t.get("group") or "").startswith("service:")]

    if not ad_hoc:
        print(f"[STOP] Found {len(tasks)} task(s) in family={family}, but none look ad hoc (non-service).")
        return

    print(f"[STOP] Found {len(ad_hoc)} ad hoc RUNNING task(s) in family={family}; disabling protection + force stop")
    _disable_task_protection(ad_hoc)
    _stop_tasks(ad_hoc, reason=f"tactic_ecs_power stop: force-stop ad hoc {family} tasks")
    if wait:
        _wait_for_tasks_stopped(ad_hoc)


def stop_services(wait: bool = True) -> None:
    # 1) Simple services: scale-to-zero only (no force stop)
    for svc in SERVICES_SIMPLE:
        _set_service_off(svc)

    # 2) Tile pool: drain then force stop if still running
    for svc in SERVICES_NEED_FORCE:
        _stop_service_force_if_needed(svc, drain_grace_s=DRAIN_GRACE_SECONDS)

    # 3) Ad hoc tile tasks
    stop_ad_hoc_family_tasks("tactic-tile", wait=wait)


def start_services() -> None:
    all_services = SERVICES_SIMPLE + SERVICES_NEED_FORCE
    for svc in all_services:
        caps = BASELINE_CAPACITY[svc]
        print(f"[START] {svc}: scalable target min={caps['min']} max={caps['max']}")
        autoscaling.register_scalable_target(
            ServiceNamespace="ecs",
            ResourceId=_resource_id(svc),
            ScalableDimension="ecs:service:DesiredCount",
            MinCapacity=caps["min"],
            MaxCapacity=caps["max"],
        )

        print(f"[START] {svc}: desiredCount={caps['desired']}")
        ecs.update_service(cluster=CLUSTER, service=svc, desiredCount=caps["desired"], forceNewDeployment=True)


def lambda_handler(event, _context):
    action = (event.get("action") or "").lower()
    print(f"Received action={action}")
    if action == "stop":
        stop_services(wait=True)
    elif action == "start":
        start_services()
    else:
        raise ValueError(f"Unknown action: {action}")
    return {"status": "ok", "action": action}


if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in ("start", "stop"):
        print("Usage: python tactic_ecs_power.py [start|stop]")
        sys.exit(1)

    if sys.argv[1] == "stop":
        stop_services(wait=True)
    else:
        start_services()