import os
import sys
import time
import boto3
from typing import List, Dict, Any

REGION = os.getenv("AWS_REGION", "us-east-2")
CLUSTER = os.getenv("ECS_CLUSTER_NAME", "tactic-cluster")

TILE_POOL_SERVICE = "tactic-tile-pool"

TILE_TASK_DEFS = {
    "standard": os.getenv("TACTIC_TILE_TASKDEF_STANDARD", "tactic-tile:10"),
    "large": os.getenv("TACTIC_TILE_TASKDEF_LARGE", "tactic-tile:11"),
}

DEFAULT_TILE_SIZE = os.getenv("TACTIC_TILE_SIZE", "standard")

# Infrastructure services that other services depend on
SERVICES_FOUNDATION = [
    "tactic-rabbitmq",
    "tactic-redis",
]

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

# Everything except the foundation services
SERVICES_AFTER_FOUNDATION = [
    "tactic-main-service",
    "tactic-module-viewer",
    "tactic-pool-watcher-s3",
    "tactic-tile-pool",
]

# Baseline capacities for start
BASELINE_CAPACITY = {
    "tactic-main-service":       {"min": 1, "max": 2,  "desired": 1},
    "tactic-module-viewer":      {"min": 1, "max": 2,  "desired": 1},
    "tactic-pool-watcher-s3":    {"min": 1, "max": 2,  "desired": 1},
    "tactic-tile-pool":          {"min": 0, "max": 20, "desired": 10},
    "tactic-rabbitmq":           {"min": 1, "max": 1,  "desired": 1},
    "tactic-redis":              {"min": 1, "max": 1,  "desired": 1},
}

# --- Behavior knobs (tune as you like) ---
DRAIN_GRACE_SECONDS = int(os.getenv("DRAIN_GRACE_SECONDS", "60"))
STOP_WAIT_TIMEOUT_S = int(os.getenv("STOP_WAIT_TIMEOUT_S", "600"))
STOP_POLL_S = int(os.getenv("STOP_POLL_S", "5"))

# Start/wait knobs
START_WAIT_DELAY_S = int(os.getenv("START_WAIT_DELAY_S", "10"))
START_WAIT_MAX_ATTEMPTS = int(os.getenv("START_WAIT_MAX_ATTEMPTS", "60"))

ecs = boto3.client("ecs", region_name=REGION)
autoscaling = boto3.client("application-autoscaling", region_name=REGION)

def _get_tile_task_definition(tile_size: str) -> str:
    tile_size = tile_size.lower()
    if tile_size not in TILE_TASK_DEFS:
        raise ValueError(
            f"Unknown tile_size={tile_size!r}. "
            f"Expected one of: {', '.join(TILE_TASK_DEFS.keys())}"
        )
    return TILE_TASK_DEFS[tile_size]


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

                for t in tasks:
                    if t.get("lastStatus") != "STOPPED":
                        new_remaining.add(t["taskArn"])

                # missing tasks are assumed stopped
                _missing = set(chunk) - seen
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


def _set_service_on(
    service_name: str,
    tile_size: str = DEFAULT_TILE_SIZE,
    tile_desired_count: int | None = None,
) -> None:
    caps = BASELINE_CAPACITY[service_name]

    desired = caps["desired"]
    if service_name == TILE_POOL_SERVICE and tile_desired_count is not None:
        desired = tile_desired_count

    print(f"[START] {service_name}: scalable target min={caps['min']} max={caps['max']}")
    autoscaling.register_scalable_target(
        ServiceNamespace="ecs",
        ResourceId=_resource_id(service_name),
        ScalableDimension="ecs:service:DesiredCount",
        MinCapacity=caps["min"],
        MaxCapacity=caps["max"],
    )

    update_kwargs = {
        "cluster": CLUSTER,
        "service": service_name,
        "desiredCount": desired,
        "forceNewDeployment": True,
    }

    if service_name == TILE_POOL_SERVICE:
        task_def = _get_tile_task_definition(tile_size)
        update_kwargs["taskDefinition"] = task_def
        print(f"[START] {service_name}: taskDefinition={task_def} ({tile_size})")

    print(f"[START] {service_name}: desiredCount={desired}")
    ecs.update_service(**update_kwargs)


def _wait_for_service_stable(service_name: str) -> None:
    """
    Wait until ECS says the service is stable.
    This is better if your task definition includes container health checks.
    """
    print(f"[WAIT] {service_name}: waiting for ECS service stability")
    waiter = ecs.get_waiter("services_stable")
    waiter.wait(
        cluster=CLUSTER,
        services=[service_name],
        WaiterConfig={
            "Delay": START_WAIT_DELAY_S,
            "MaxAttempts": START_WAIT_MAX_ATTEMPTS,
        },
    )
    print(f"[WAIT] {service_name}: service is stable")


def _start_services(
    services: List[str],
    wait: bool = False,
    tile_size: str = DEFAULT_TILE_SIZE,
    tile_desired_count: int | None = None,
) -> None:
    for svc in services:
        _set_service_on(
            svc,
            tile_size=tile_size,
            tile_desired_count=tile_desired_count,
        )

    if wait:
        for svc in services:
            _wait_for_service_stable(svc)


def stop_services(wait: bool = True) -> None:
    # 1) Simple services: scale-to-zero only
    for svc in SERVICES_SIMPLE:
        _set_service_off(svc)

    # 2) Tile pool: drain then force stop if still running
    for svc in SERVICES_NEED_FORCE:
        _stop_service_force_if_needed(svc, drain_grace_s=DRAIN_GRACE_SECONDS)

    # 3) Ad hoc tile tasks
    stop_ad_hoc_family_tasks("tactic-tile", wait=wait)


def start_services(
    tile_size: str = DEFAULT_TILE_SIZE,
    tile_desired_count: int | None = None,
) -> None:
    print("[START] Stage 1: foundation services")
    _start_services(
        SERVICES_FOUNDATION,
        wait=False,
        tile_size=tile_size,
        tile_desired_count=tile_desired_count,
    )

    print("[START] Stage 1 complete; pausing briefly before dependent services")
    time.sleep(30)

    print(f"[START] Stage 2: dependent services; tile_size={tile_size}")
    if tile_desired_count is not None:
        print(f"[START] Tile desired count override: {tile_desired_count}")

    _start_services(
        SERVICES_AFTER_FOUNDATION,
        wait=False,
        tile_size=tile_size,
        tile_desired_count=tile_desired_count,
    )

def switch_tile_size(tile_size: str, tile_desired_count: int | None = None) -> None:
    task_def = _get_tile_task_definition(tile_size)

    update_kwargs = {
        "cluster": CLUSTER,
        "service": TILE_POOL_SERVICE,
        "taskDefinition": task_def,
        "forceNewDeployment": True,
    }

    if tile_desired_count is not None:
        update_kwargs["desiredCount"] = tile_desired_count

    print(f"[SWITCH] {TILE_POOL_SERVICE}: taskDefinition={task_def} ({tile_size})")
    if tile_desired_count is not None:
        print(f"[SWITCH] {TILE_POOL_SERVICE}: desiredCount={tile_desired_count}")

    ecs.update_service(**update_kwargs)


def lambda_handler(event, _context):
    action = (event.get("action") or "").lower()
    tile_size = (event.get("tile_size") or DEFAULT_TILE_SIZE).lower()

    tile_desired_count = event.get("tile_desired_count")
    if tile_desired_count is not None:
        tile_desired_count = int(tile_desired_count)

    print(
        f"Received action={action}, "
        f"tile_size={tile_size}, "
        f"tile_desired_count={tile_desired_count}"
    )

    if action == "stop":
        stop_services(wait=True)
    elif action == "start":
        start_services(
            tile_size=tile_size,
            tile_desired_count=tile_desired_count,
        )
    elif action == "switch_tile_size":
        switch_tile_size(tile_size)
    else:
        raise ValueError(f"Unknown action: {action}")

    return {
        "status": "ok",
        "action": action,
        "tile_size": tile_size,
        "tile_desired_count": tile_desired_count,
    }


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "action",
        choices=["start", "stop", "switch-tile-size"],
    )
    parser.add_argument(
        "--tile-size",
        choices=sorted(TILE_TASK_DEFS.keys()),
        default=DEFAULT_TILE_SIZE,
        help="Tile pool size class to use when starting or switching.",
    )

    parser.add_argument(
        "--tile-desired-count",
        type=int,
        default=None,
        help="Optional desired count for tactic-tile-pool when starting.",
    )

    args = parser.parse_args()

    if args.action == "stop":
        stop_services(wait=True)
    elif args.action == "start":
        start_services(
            tile_size=args.tile_size,
            tile_desired_count=args.tile_desired_count,
        )
    elif args.action == "switch-tile-size":
        switch_tile_size(
            args.tile_size,
            tile_desired_count=args.tile_desired_count,
        )