import os
import redis
from rabbit_manage import declare_durable_queue
from rabbit_admin import list_queues, delete_queue
use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

# I'm leaving some of the desired idle logic in for test, non-aws for the purposes of testing it.

DESIRED_IDLE_DEFAULT = 3
from redis_tools import redis_client as r

if use_ecs:
    import boto3
    from botocore.exceptions import ParamValidationError
    from aws_task_helpers import get_ssm_parameter
    DESIRED_IDLE_DEFAULT = int(get_ssm_parameter("desired_idle", DESIRED_IDLE_DEFAULT))
    TILE_SERVICE = get_ssm_parameter("ECS_TILE_SERVICE", "tactic-tile-pool")
    AWS_REGION = get_ssm_parameter("MY_AWS_REGION", "us-east-2")
    ECS_CLUSTER = get_ssm_parameter("ECS_CLUSTER", "tactic-cluster")
    print("Using ECS tile pool with service:", TILE_SERVICE, "in cluster:", ECS_CLUSTER, "and region:", AWS_REGION)
    ecs = boto3.client("ecs", region_name=AWS_REGION)
    CW = boto3.client("cloudwatch", region_name=AWS_REGION)
    NS = "Tactic"
    SVC = TILE_SERVICE

class TileContainerRegistry:
    def __init__(self, host_worker):
        print("** initializing tile registery ***")
        self._registry = {}
        self.host_worker = host_worker
        self.removed_obsolete_queues = False
        self.pull_desired_idle()
        self.registry_heartbeat()
        self.remove_obsolete_queues()


    def pull_desired_idle(self):
        v = r.get("config:desired_idle")
        if v:
            self.desired_idle = int(v)
        else:
            self.desired_idle = DESIRED_IDLE_DEFAULT
        return

    def set_desired_idle(self, new_val):
        self.desired_idle = int(new_val)
        r.set("config:desired_idle", self.desired_idle)

    def registry_heartbeat(self):
        if use_ecs:
            self.pull_desired_idle()
            self.reconcile_tiles()
            self.publish_metrics()
            if not self.removed_obsolete_queues:
                self.remove_obsolete_queues()

    def get_items(self):
        return list(self._registry.items())

    def publish_metrics(self):
        if use_ecs:
            print("*** entering publish metrics ***")
            print("desired_idle:", self.desired_idle)
            print("idle_tiles:", self.idle_tiles, "running_tiles:", self.running_tiles, )
            idle_deficit = max(0, self.desired_idle - self.idle_tiles)
            excess_idle = max(0, self.idle_tiles - self.desired_idle)
            print("idle_deficit:", idle_deficit, "excess_idle:", excess_idle)
            CW.put_metric_data(
                Namespace=NS,
                MetricData=[
                    {"MetricName": "IdleTiles", "Dimensions": [{"Name": "ServiceName", "Value": SVC}],
                     "Unit": "Count", "Value": self.idle_tiles},
                    {"MetricName": "RunningTiles", "Dimensions": [{"Name": "ServiceName", "Value": SVC}],
                     "Unit": "Count", "Value": self.running_tiles},
                    {"MetricName": "IdleDeficit", "Dimensions": [{"Name": "ServiceName", "Value": SVC}],
                     "Unit": "Count", "Value": idle_deficit},
                    {"MetricName": "ExcessIdle", "Dimensions": [{"Name": "ServiceName", "Value": SVC}],
                     "Unit": "Count", "Value": excess_idle},
                ]
            )
        else:
            print(f"Metrics publishing is disabled in non-ECS mode. {self.idle_tiles} idle tiles, {self.running_tiles} running tiles.")

    def mark_status(self, tile_id, status, task_arn=None, username=None, owner=None, parent=None, created=None):
        if tile_id not in self._registry:
            self._registry[tile_id] = {"status": "idle"}
            declare_durable_queue(self.host_worker.channel, tile_id)
        self._registry[tile_id]["status"] = status
        if username is not None:
            self._registry[tile_id]["username"] = username
        if owner is not None:
            self._registry[tile_id]["owner"] = owner
        if parent is not None:
            self._registry[tile_id]["parent"] = parent
        self._registry[tile_id]["created_dt"] = created
        if use_ecs:
            if task_arn is not None:
                self._registry[tile_id]["task_arn"] = task_arn
            self.set_task_protection(tile_id)
        print("leaving mark_status with registry:", self._registry)

    @property
    def running_tiles(self):
        return len([tile_id for tile_id, d in self._registry.items() if d.get("status") == "busy"])

    @property
    def idle_tiles(self):
        return len([tile_id for tile_id, d in self._registry.items() if d.get("status") == "idle"])

    def tile_exists(self, tile_id):
        return tile_id in self._registry

    def release_tile(self, tile_id):
        if tile_id in self._registry:
            self._registry[tile_id]["status"] = "idle"
            self._registry[tile_id].pop("username", None)
            self._registry[tile_id].pop("owner", None)
            self._registry[tile_id].pop("parent", None)
            if use_ecs:
                self.set_task_protection(tile_id)

    def get_children(self, parent_id):
        return [tile_id for tile_id, d in self._registry.items() if d.get("parent") == parent_id]

    def get_owned_tiles(self, owner_id):
        return [tile_id for tile_id, d in self._registry.items() if d.get("owner") == owner_id]

    def get(self, tile_id):
        return self._registry.get(tile_id, {})

    def get_arn(self, tile_id):
        return self._registry[tile_id]["task_arn"]

    def deregister(self, tile_id):
        if tile_id in self._registry:
            del self._registry[tile_id]

    def set_task_protection(self, tile_id):
        if self._registry[tile_id]["task_arn"]:
            ecs.update_task_protection(
                cluster=ECS_CLUSTER,
                tasks=[self._registry[tile_id]["task_arn"]],
                protectionEnabled=self._registry[tile_id]["status"] == "busy"
            )

    def claim_tile(self, username, owner, parent):
        for tile_id, info in self._registry.items():
            if info["status"] == "idle":
                self._registry[tile_id]["username"] = username
                self._registry[tile_id]["owner"] = owner # This is the user_id
                self._registry[tile_id]["parent"] = parent
                self.mark_status(tile_id, "busy")
                if use_ecs:
                    return tile_id, self._registry[tile_id]["task_arn"]
                else:
                    return tile_id, ""
        return None, None

    def task_to_tile_id(self, task):
        return f'tile_{task["taskArn"].split("/")[-1]}'

    def list_running_tile_tasks(self):
        arns = []
        try:
            paginator = ecs.get_paginator("list_tasks")
            for page in paginator.paginate(
                    cluster=ECS_CLUSTER,
                    serviceName=TILE_SERVICE,
                       desiredStatus="RUNNING"
            ):
                arns.extend(page.get("taskArns", []))
        except ParamValidationError as e:
            raise RuntimeError(f"Param validation error calling list_tasks: {e}") from e

        if not arns:
            return []

        tasks = []
        for i in range(0, len(arns), 100):
            resp = ecs.describe_tasks(cluster=ECS_CLUSTER, tasks=arns[i:i + 100])
            for t in resp.get("tasks", []):
                if t.get("lastStatus") == "RUNNING":
                    tasks.append(t)
        return tasks

    def remove_obsolete_queues(self):
        if not use_ecs:
            self.removed_obsolete_queues = True
            return
        if self.host_worker.channel is None:
            print("in remove_obsolete_queues, channel isn't ready yet")
            return
        print("removing obsolete queues")

        tasks = self.list_running_tile_tasks()
        if not tasks:
            return
        running_ids = [self.task_to_tile_id(t) for t in tasks]
        all_queues = list_queues()
        for q in all_queues:
            qname = q["name"]
            if qname.startswith("tile_"):
                if qname not in running_ids:
                    delete_queue(qname)
            if qname.startswith("kill_tile_"):
                partial_qname = re.sub("kill_", "", qname)
                if partial_qname not in running_ids:
                    delete_queue(qname)
        self.removed_obsolete_queues = True


    def reconcile_tiles(self):
        if self.host_worker.channel is None:
            print("in reconcile_tiles, channel isn't ready yet")
            return
        if not use_ecs:
            return
        print("doing tile reconciliation")
        tasks = self.list_running_tile_tasks()
        if not tasks:
            return
        print("found running tiles:", len(tasks))
        running_ids = [self.task_to_tile_id(t) for t in tasks]
        ids_to_delete = []
        for tile_id, info in self._registry.items():
            if tile_id not in running_ids:
                ids_to_delete.append(tile_id)
        for tile_id in ids_to_delete:
            del self._registry[tile_id]
            self.host_worker.channel.queue_delete(tile_id)
            self.host_worker.channel.queue_delete(f"kill_{tile_id}")
        for t in tasks:
            tile_id = self.task_to_tile_id(t)
            if tile_id not in self._registry:
                print("found new available tile container:", tile_id)
                self.mark_status(tile_id, "idle", task_arn=t["taskArn"], created=t["createdAt"])