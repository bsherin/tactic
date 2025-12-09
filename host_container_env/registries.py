import os
import time

from rabbit_manage import declare_durable_queue
from rabbit_admin import list_queues
from redis_tools import RedisManager, redis_client
from service_registry import ServiceRegistry
from aws_helpers import get_ssm_parameter
from docker_functions import get_tile_container_ids
import boto3
import datetime
use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

# I'm leaving some of the desired idle logic in for test, non-aws for the purposes of testing it.

DESIRED_IDLE_DEFAULT = 3
from redis_tools import redis_client as r

AWS_REGION = get_ssm_parameter("MY_AWS_REGION", "us-east-2")

TILE_SERVICE = get_ssm_parameter("ECS_TILE_SERVICE", "tactic-tile-pool")
MAIN_SERVICE = get_ssm_parameter("ECS_MAIN_SERVICE", "tactic-main-service")
MODULE_VIEWER_SERVICE = get_ssm_parameter("ECS_MODULE_VIEWER_SERVICE", "tactic-module-viewer")
TILE_ID_PREFIX = get_ssm_parameter("TILE_ID_PREFIX", "tile_")
MAIN_ID_PREFIX = get_ssm_parameter("MAIN_ID_PREFIX", "main_service_")
MODULE_VIEWER_PREFIX = get_ssm_parameter("MODULE_VIEWER_PREFIX", "module_viewer_")

TILE_HEARTBEAT_TIMEOUT_SECS = float(get_ssm_parameter("TILE_HEARTBEAT_TIMEOUT_SECS", "600"))

if use_ecs:
    from aws_task_helpers import get_ssm_parameter
    DESIRED_IDLE_DEFAULT = int(get_ssm_parameter("desired_idle", DESIRED_IDLE_DEFAULT))


    ECS_CLUSTER = get_ssm_parameter("ECS_CLUSTER", "tactic-cluster")
    print("Using ECS tile pool with service:", TILE_SERVICE, "in cluster:", ECS_CLUSTER, "and region:", AWS_REGION)
    ecs = boto3.client("ecs", region_name=AWS_REGION)
    CW = boto3.client("cloudwatch", region_name=AWS_REGION)
    NS = "Tactic"
    SVC = TILE_SERVICE
else:
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
    id_prefix = MAIN_ID_PREFIX
    service_name = MAIN_SERVICE
    prefix = MAIN_SERVICE
    extra_valid_ids = []

    def __init__(self, worker):
        ServiceRegistry.__init__(self, worker)
        self.remove_obsolete_queues()

class ModuleViewerRegistry(ServiceRegistry):
    id_prefix = MODULE_VIEWER_PREFIX
    service_name = MODULE_VIEWER_SERVICE
    prefix = MODULE_VIEWER_PREFIX
    extra_valid_ids = []

    def __init__(self, worker):
        ServiceRegistry.__init__(self, worker)
        self.remove_obsolete_queues()

class TileContainerRegistry(ServiceRegistry):
    id_prefix = TILE_ID_PREFIX
    service_name = TILE_SERVICE
    prefix = TILE_SERVICE
    extra_valid_ids = ["tile_test_container"]

    def __init__(self, worker):
        ServiceRegistry.__init__(self, worker)
        self.reconciled_tiles = False
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
        self.reconcile_tiles()
        if not self.removed_obsolete_queues:
            self.remove_obsolete_queues()
        if use_ecs:
            self.pull_desired_idle()
            self.publish_metrics()
        self.sweep_tiles()

    def publish_metrics(self):
        if use_ecs:
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

    def register_tile_heartbeat(self, tile_id):
        if not self.exists(tile_id):
            self.set_container_info(tile_id, "status", "idle")
            declare_durable_queue(self.worker.channel, tile_id)
        self.set_container_info(tile_id, "last_heartbeat", str(time.time()))

    def sweep_tiles(self):

        def got_main_ids(data):
            main_session_ids = data["sids"]
            now = time.time()
            tile_ids = self.container_ids()
            for tile_id in tile_ids:
                last_heartbeat_str = self.get_container_info(tile_id, "last_heartbeat")
                if last_heartbeat_str is None:
                    self.set_container_info(tile_id, "last_heartbeat", str(time.time()))
                    return
                last_heartbeat = float(last_heartbeat_str)
                if (now - last_heartbeat) > TILE_HEARTBEAT_TIMEOUT_SECS:
                    self.worker.destroy_tile(tile_id, force_terminate=True)
            busy_ids = [tile_id for tile_id in tile_ids if self.is_busy(tile_id)]
            for tile_id in busy_ids:
                parent = self.get_container_info(tile_id, "parent")
                if parent not in main_session_ids:
                    self.worker.destroy_tile(tile_id)

        # First need to be sure that reconcile has run
        if not self.reconciled_tiles:
            return
        self.worker.post_task("main_service", "get_open_sessions_task", {}, callback_func=got_main_ids)
        return



    def release_child_tiles(self, parent_id):
        tile_ids = self.get_children(parent_id)
        for tile_id in tile_ids:
            self.worker.destroy_tile(tile_id)

    def get_last_parent_interaction(self, tile_id):
        parent_id = self.get_container_info(tile_id, "parent")
        if parent_id:
            last_interaction_str = self.worker.client_session_registry.get_last_interaction(parent_id)
            if last_interaction_str:
                return float(last_interaction_str)
        return None

    def mark_status(self, tile_id, status, task_arn=None, username=None, owner=None, parent=None, created=None, register_heartbeat=False):
        if not self.exists(tile_id):
            self.set_container_info(tile_id, "status", "idle")
            declare_durable_queue(self.worker.channel, tile_id)
        self.set_container_info(tile_id, "status", status)
        if username is not None:
            self.set_container_info(tile_id, "username", username)
        if owner is not None:
            self.set_container_info(tile_id, "owner", owner)
        if parent is not None:
            self.set_container_info(tile_id, "parent", parent)
        if created is not None:
            self.set_container_info(tile_id, "created", string(created))
        if use_ecs:
            if task_arn is not None:
                self.set_container_info(tile_id, "task_arn", task_arn)
            self.set_task_protection(tile_id)
        if register_heartbeat:
            self.set_container_info(tile_id, "last_heartbeat", str(time.time()))

    @property
    def running_tiles(self):
        tile_ids = self.container_ids()
        return len([tile_id for tile_id in tile_ids if self.is_busy(tile_id)])

    @property
    def idle_tiles(self):
        tile_ids = self.container_ids()
        return len([tile_id for tile_id in tile_ids if self.is_idle(tile_id)])

    def is_busy(self, tile_id):
        return self.get_container_info(tile_id, "status") == "busy"

    def is_idle(self, tile_id):
        return self.get_container_info(tile_id, "status") == "idle"

    def release_tile(self, tile_id):
        self.set_container_info_from_dict(tile_id, {
            "status": "idle",
            "username": None,
            "owner": None,
            "parent": None
        })
        if use_ecs:
            self.set_task_protection(tile_id)

    def get_children(self, parent_id):
        tile_ids = self.container_ids()
        return [tile_id for tile_id in tile_ids if self.get_container_info(tile_id, "parent") == parent_id]

    def get_owned_tiles(self, owner_id):
        tile_ids = self.container_ids()
        return [tile_id for tile_id in tile_ids if self.get_container_info(tile_id, "owner") == owner_id]

    def deregister(self, tile_id):
        self.delete(tile_id)

    def set_task_protection(self, tile_id):
        task_arn = self.get_arn(tile_id)
        if task_arn:
            ecs.update_task_protection(
                cluster=ECS_CLUSTER,
                tasks=[task_arn],
                protectionEnabled=self.is_busy(tile_idf)
            )

    def claim_tile(self, username, owner, parent):
        tile_ids = self.container_ids()
        for tile_id in tile_ids:
            if self.is_idle(tile_id):
                self.set_container_info_from_dict(tile_id, {
                    "username": username,
                    "owner": owner,
                    "parent": parent
                })
                self.mark_status(tile_id, "busy")
                if use_ecs:
                    return tile_id, self.get_arn(tile_id)
                else:
                    return tile_id, ""
        return None, None

    def list_running_tile_tasks(self):
        return self.list_running_service_tasks()

    @staticmethod
    def list_docker_tile_containers():
        return get_tile_container_ids()

    def reconcile_tiles(self):
        if self.worker.channel is None:
            print("in reconcile_tiles, channel isn't ready yet")
            return
        if use_ecs:
            tasks = self.list_running_tile_tasks()
            print("found running tiles:", len(tasks))
            running_ids = [self.task_to_id(t) for t in tasks]
            for t in tasks:
                tile_id = self.task_to_id(t)
                if not self.exists(tile_id):
                    print("found new available tile container:", tile_id)
                    self.mark_status(tile_id, "idle", task_arn=t["taskArn"], created=t["createdAt"], register_heartbeat=True)
        else:
            running_ids = self.list_docker_tile_containers()
            for tile_id in running_ids:
                if not self.exists(tile_id):
                    self.mark_status(tile_id, "idle", register_heartbeat=True)
        ids_to_delete = []
        tile_ids = self.container_ids()
        for tile_id in tile_ids:
            if tile_id not in running_ids and not tile_id == "tile_test_container":
                ids_to_delete.append(tile_id)
        for tile_id in ids_to_delete:
            self.delete(tile_id)
            self.worker.channel.queue_delete(tile_id)
            self.worker.channel.queue_delete(f"kill_{tile_id}")
        self.reconciled_tiles = True
