import os
import re
import redis
from rabbit_manage import declare_durable_queue
from rabbit_admin import list_queues
from service_registry import ServiceRegistry
from aws_helpers import get_ssm_parameter
import boto3
import datetime
use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

# I'm leaving some of the desired idle logic in for test, non-aws for the purposes of testing it.

DESIRED_IDLE_DEFAULT = 3
from redis_tools import redis_client as r

AWS_REGION = get_ssm_parameter("MY_AWS_REGION", "us-east-2")


if use_ecs:
    from botocore.exceptions import ParamValidationError
    from aws_task_helpers import get_ssm_parameter
    DESIRED_IDLE_DEFAULT = int(get_ssm_parameter("desired_idle", DESIRED_IDLE_DEFAULT))
    TILE_SERVICE = get_ssm_parameter("ECS_TILE_SERVICE", "tactic-tile-pool")
    MAIN_SERVICE = get_ssm_parameter("ECS_MAIN_SERVICE", "tactic-main-service")
    MODULE_VIEWER_SERVICE = get_ssm_parameter("ECS_MODULE_VIEWER_SERVICE", "tactic-module-viewer")
    TILE_ID_PREFIX = get_ssm_parameter("TILE_ID_PREFIX", "tile_")
    MAIN_ID_PREFIX = get_ssm_parameter("MAIN_ID_PREFIX", "main_service_")
    MODULE_VIEWER_PREFIX = get_ssm_parameter("MODULE_VIEWER_PREFIX", "module_viewer_")

    ECS_CLUSTER = get_ssm_parameter("ECS_CLUSTER", "tactic-cluster")
    print("Using ECS tile pool with service:", TILE_SERVICE, "in cluster:", ECS_CLUSTER, "and region:", AWS_REGION)
    ecs = boto3.client("ecs", region_name=AWS_REGION)
    CW = boto3.client("cloudwatch", region_name=AWS_REGION)
    NS = "Tactic"
    SVC = TILE_SERVICE
else:
    TILE_SERVICE = ""
    MAIN_SERVICE = ""
    MODULE_VIEWER_SERVICE = ""
    TILE_ID_PREFIX = ""
    MAIN_ID_PREFIX = ""
    MODULE_VIEWER_PREFIX = ""
    CW = boto3.client(
        "cloudwatch",
         endpoint_url="http://host.docker.internal:4566",
         aws_access_key_id="test",
         aws_secret_access_key="test",
         region_name=AWS_REGION,
    )

def publish_queue_metrics():
    queue_count = len(list_queues())
    r.set("metric:queue_count", queue_count)
    print(f"got queue count {queue_count}")
    env = "prod"

    CW.put_metric_data(
        Namespace="Tactic/App",  # your app's namespace
        MetricData=[
            {
                "MetricName": "BrokerQueueCount",
                "Dimensions": [
                    {"Name": "Environment", "Value": env},
                ],
                "Timestamp": datetime.datetime.utcnow(),
                "Value": float(queue_count),
                "Unit": "Count",
            }
        ],
    )


class MainContainerRegistry(ServiceRegistry):
    def __init__(self, worker):
        ServiceRegistry.__init__(self, worker, id_prefix=MAIN_ID_PREFIX, service_name=MAIN_SERVICE)
        self.remove_obsolete_queues()

class ModuleViewerRegistry(ServiceRegistry):
    def __init__(self, worker):
        ServiceRegistry.__init__(self, worker, id_prefix=MODULE_VIEWER_PREFIX, service_name=MODULE_VIEWER_SERVICE)
        self.remove_obsolete_queues()

class TileContainerRegistry(ServiceRegistry):
    def __init__(self, worker):
        ServiceRegistry.__init__(self, worker, id_prefix=TILE_ID_PREFIX, service_name=TILE_SERVICE)
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
            declare_durable_queue(self.worker.channel, tile_id)
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

    def list_running_tile_tasks(self):
        return self.list_running_service_tasks()

    def reconcile_tiles(self):
        if self.worker.channel is None:
            print("in reconcile_tiles, channel isn't ready yet")
            return
        if not use_ecs:
            return
        print("doing tile reconciliation")
        tasks = self.list_running_tile_tasks()
        if not tasks:
            return
        print("found running tiles:", len(tasks))
        running_ids = [self.task_to_id(t) for t in tasks]
        ids_to_delete = []
        for tile_id, info in self._registry.items():
            if tile_id not in running_ids:
                ids_to_delete.append(tile_id)
        for tile_id in ids_to_delete:
            del self._registry[tile_id]
            self.worker.channel.queue_delete(tile_id)
            self.worker.channel.queue_delete(f"kill_{tile_id}")
        for t in tasks:
            tile_id = self.task_to_id(t)
            if tile_id not in self._registry:
                print("found new available tile container:", tile_id)
                self.mark_status(tile_id, "idle", task_arn=t["taskArn"], created=t["createdAt"])