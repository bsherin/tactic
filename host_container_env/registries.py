import time
import uuid

from rabbit_manage import declare_durable_queue
from rabbit_admin import list_queues
from service_registry import ServiceRegistry
from aws_helpers import get_ssm_parameter

import boto3
from aws_detection import on_aws
from tactic_logging import log
from utils import utcnow
import json

# I'm leaving some of the desired idle logic in for test, non-aws for the purposes of testing it.

DESIRED_IDLE_DEFAULT = 6
from redis_tools import redis_client as r

AWS_REGION = get_ssm_parameter("MY_AWS_REGION", "us-east-2")

TILE_SERVICE = get_ssm_parameter("ECS_TILE_SERVICE", "tactic-tile-pool")
MAIN_SERVICE = get_ssm_parameter("ECS_MAIN_SERVICE", "tactic-main-service")
MODULE_VIEWER_SERVICE = get_ssm_parameter("ECS_MODULE_VIEWER_SERVICE", "tactic-module-viewer")
TILE_ID_PREFIX = get_ssm_parameter("TILE_ID_PREFIX", "tile_")
MAIN_ID_PREFIX = get_ssm_parameter("MAIN_ID_PREFIX", "main_service_")
MODULE_VIEWER_PREFIX = get_ssm_parameter("MODULE_VIEWER_PREFIX", "module_viewer_")

TILE_HEARTBEAT_TIMEOUT_SECS = float(get_ssm_parameter("TILE_HEARTBEAT_TIMEOUT_SECS", "600"))

if on_aws:
    DESIRED_IDLE_DEFAULT = int(get_ssm_parameter("desired_idle", DESIRED_IDLE_DEFAULT))
    ECS_CLUSTER = get_ssm_parameter("ECS_CLUSTER", "tactic-cluster")
    log.info("Using ECS tile pool", service=TILE_SERVICE, cluster=ECS_CLUSTER, region=AWS_REGION)
    ecs = boto3.client("ecs", region_name=AWS_REGION)
    CW = boto3.client("cloudwatch", region_name=AWS_REGION)
    NS = "Tactic"
    SVC = TILE_SERVICE
else:
    from docker_functions import get_tile_container_ids, create_container
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
    env = "prod"

    CW.put_metric_data(
        Namespace="Tactic/App",  # your app's namespace
        MetricData=[
            {
                "MetricName": "BrokerQueueCount",
                "Dimensions": [
                    {"Name": "Environment", "Value": env},
                ],
                "Timestamp": utcnow(),
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
    base_fields = ["username", "owner", "parent", "created", "project_name", "tile_name"]
    wait_queue_key = "tile_queue_ids:z"
    packets_key = "tile_queue_packets"
    tasks_by_parent_key = "tile_queued_tasks_by_parent"

    def __init__(self, worker, delete_all=False):
        ServiceRegistry.__init__(self, worker)
        if delete_all:
            self.delete_all()
            self.delete_request_queue()
        self.reconciled_tiles = False
        self.pull_desired_idle()
        self.registry_heartbeat()
        self.remove_obsolete_queues()

    def delete_request_queue(self):
        pattern = f"{self.packets_key}.*"
        for k in self.cli.scan_iter(match=pattern, count=5000):
            try:
                self.cli.unlink(k)  # fall back to delete if older Redis
            except Exception:
                self.cli.delete(k)

        self.cli.delete(self.wait_queue_key)
        pattern = f"{self.tasks_by_parent_key}.*"
        for k in self.cli.scan_iter(match=pattern, count=5000):
            try:
                self.cli.unlink(k)  # fall back to delete if older Redis
            except Exception:
                self.cli.delete(k)

    def add_to_queue(self, task_packet):
        task_id = task_packet["task_id"]
        parent_id = task_packet["task_data"]["parent"]
        score = time.time()
        pipe = self.cli.pipeline()
        pipe.set(f"{self.packets_key}.{task_id}", json.dumps(task_packet))
        pipe.zadd(self.wait_queue_key, {task_id: score})
        pipe.sadd(f"{self.tasks_by_parent_key}.{parent_id}", task_id)
        pipe.execute()
        return task_id

    def purge_parent_from_queue(self, parent_id, batch_size = 500):
        idx_key = f"{self.tasks_by_parent_key}.{parent_id}"
        removed = 0

        while True:
            ids = list(self.cli.smembers(idx_key))
            if not ids:
                self.cli.delete(idx_key)
                break

            chunk = ids[:batch_size]
            pipe = self.cli.pipeline()
            pipe.zrem(self.wait_queue_key, *chunk)
            for task_id in chunk:
                pipe.delete(f"{self.packets_key}.{task_id}")
                pipe.srem(idx_key, task_id)
            results = pipe.execute()

            removed += int(results[0] or 0)
        return removed

    def pop_oldest(self):
        result = self.cli.zpopmin(self.wait_queue_key, count=1)
        if not result:
            return None

        task_id, _score = result[0]
        raw = self.cli.get(f"{self.packets_key}.{task_id}")
        self.cli.delete(f"{self.packets_key}.{task_id}")
        task_packet = json.loads(raw) if raw else None
        parent_id = task_packet["task_data"].get("parent") if task_packet else None
        if parent_id:
            self.cli.srem(f"{self.tasks_by_parent_key}.{parent_id}", task_id)
        return task_packet

    @property
    def queue_count(self):
        count = self.cli.zcard(self.wait_queue_key)
        return count

    def pull_desired_idle(self):
        v = self.cli.get("config:desired_idle")
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
        while self.idle_tiles > 0 and self.queue_count > 0:
            tid, task_arn = self.find_idle_tile()
            if not tid:
                log.warning("Could't find idle tile after thinking there was one")
                break
            task_packet = self.pop_oldest()
            self.claim_idle_tile(tid, task_packet)
            username = task_packet["task_data"].get("username")
            if on_aws:
                creds = self.worker.tile_backend.issue_user_s3_session(username)
            else:
                creds = {
                    "AccessKeyId": "ak",
                    "SecretAccessKey": "sak",
                    "SessionToken": "token",
                    "region": "us-east-2",
                }
            self.worker.submit_response(task_packet, {"success": True, "the_id": tid, "task_arn": task_arn, "creds": creds})

        if not self.removed_obsolete_queues:
            self.remove_obsolete_queues()
        self.pull_desired_idle()
        idle_deficit = max(0, self.desired_idle + self.queue_count - self.idle_tiles)
        if on_aws:
            self.publish_metrics()
        else:
            if idle_deficit > 0 and self.worker.channel is not None:
                log.debug(f"additional idle tiles needed, current idle {self.idle_tiles}, queued {self.queue_count}",
                          category="tile_management")
                env = {
                    "RUNNING_ON_AWS": False
                }
                for _ in range(idle_deficit):
                    unique_id = f"tile_{str(uuid.uuid4())}"
                    tile_container_id, docker_id = create_container(
                        "bsherin/tactic-tile",
                        network_mode="bridge",
                        env_vars=env,
                        publish_all_ports=True,
                        special_unique_id=unique_id
                    )
                    self.mark_status(tile_container_id, "idle")
        self.sweep_tiles()

    def publish_metrics(self):
        if on_aws:
            idle_deficit = max(0, (self.desired_idle + self.queue_count) - self.idle_tiles)
            excess_idle = max(0, self.idle_tiles - (self.desired_idle + self.queue_count))
            log.debug("current metrics",
                     desired_idle=self.desired_idle,
                     idle_tiles=self.idle_tiles,
                     running_tiles=self.running_tiles,
                     idle_deficit=idle_deficit,
                     excess_idle=excess_idle)
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
            log.debug("current_metrics",
                     idle_tiles=self.idle_tiles,
                     running_tiles=self.running_tiles)

    def register_tile_heartbeat(self, tile_id, data=None):
        if not self.exists(tile_id) and not tile_id == "tile_test_container":
            log.info("heartbeat from undiscovered tile", tile_id=tile_id)
            return
        self.set_container_info(tile_id, "last_heartbeat", str(time.time()))
        if data is not None:
            if "memory_usage_mb" in data:
                self.set_container_info(tile_id, "memory_usage_mb", str(data["memory_usage_mb"]))
            if "memory_limit_mb" in data:
                self.set_container_info(tile_id, "memory_limit_mb", str(data["memory_limit_mb"]))

    def sweep_tiles(self):
        log.debug("sweep_tiles", category="tile_management")

        if not self.reconciled_tiles:
            return

        main_session_ids = self.worker.main_ss.get_unique_sids()
        tile_ids = self.container_ids()
        busy_ids = [tile_id for tile_id in tile_ids if self.is_busy(tile_id)]
        for tile_id in busy_ids:
            parent = self.get_container_info(tile_id, "parent")
            if parent not in main_session_ids:
                log.info("releasing tile with no active main session",
                         category="tile_management",
                         tile_id=tile_id,
                         parent=parent)
                self.worker.destroy_tile(tile_id)

        return

    def release_child_tiles(self, parent_id):
        tile_ids = self.get_children(parent_id)
        log.debug("releasing child tiles", tile_ids=tile_ids)

        for tile_id in tile_ids:
            self.worker.destroy_tile(tile_id)

    def get_last_parent_interaction(self, tile_id):
        parent_id = self.get_container_info(tile_id, "parent")
        if parent_id:
            last_interaction_str = self.worker.client_session_registry.get_last_interaction(parent_id)
            if last_interaction_str:
                return float(last_interaction_str)
        return None

    def mark_status(self, tile_id, status, **kwargs):
        if not self.exists(tile_id):
            self.set_container_info(tile_id, "status", "idle")
            declare_durable_queue(self.worker.channel, tile_id)
        self.set_container_info(tile_id, "status", status)
        for field in self.base_fields:
            if field in kwargs and kwargs[field] is not None:
                self.set_container_info(tile_id, field, str(kwargs[field]))
        if on_aws:
            if "task_arn" in kwargs and kwargs["task_arn"] is not None:
                self.set_container_info(tile_id, "task_arn", kwargs["task_arn"])
            self.set_task_protection(tile_id)
        if "register_heartbeat" in kwargs and kwargs["register_heartbeat"]:
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
            "parent": None,
            "project_name": None,
            "tile_name": None,
        })
        if on_aws:
            self.set_task_protection(tile_id)

    def get_children(self, parent_id):
        tile_ids = self.container_ids()
        return [tile_id for tile_id in tile_ids if self.get_container_info(tile_id, "parent") == parent_id]

    def get_owned_tiles(self, owner_id):
        tile_ids = self.container_ids()
        return [tile_id for tile_id in tile_ids if self.get_container_info(tile_id, "owner") == owner_id]

    def deregister(self, tile_id):
        self.delete(tile_id)

    def set_task_protection(self, tile_id, force_busy=False):
        task_arn = self.get_arn(tile_id)
        enabled = force_busy or self.is_busy(tile_id)
        if task_arn:
            return ecs.update_task_protection(
                cluster=ECS_CLUSTER,
                tasks=[task_arn],
                protectionEnabled=enabled
            )
        return None

    def find_idle_tile(self, temp_id=None, parent=None):
        if temp_id and parent:
            self.worker.update_tile_status(temp_id, parent, "requested")
        tile_ids = self.container_ids()
        for tile_id in tile_ids:
            if self.is_idle(tile_id):
                if on_aws:
                    task_arn = self.get_arn(tile_id)
                    if not self.is_task_running(task_arn):  # Check if the task is actually running
                        log.warning("Task not running for idle tile, deleting tile",
                                    category="tile_management",
                                    tile_id=tile_id, task_arn=task_arn)
                        self.delete(tile_id)
                        continue
                    resp = self.set_task_protection(tile_id, force_busy=True)
                    if resp is None or ("failures" in resp and len(resp["failures"]) > 0):
                        log.warning("Failed to set task protection for tile",
                                    category="tile_management",
                                    tile_id=tile_id, response=resp)
                        continue

                    return tile_id, self.get_arn(tile_id)
                else:
                    return tile_id, ""
        return None, None

    def claim_idle_tile(self, tile_id, task_packet):
        task_data = task_packet["task_data"]
        status_args = {
            "username": task_data["username"],
            "owner": task_data["owner"],
            "parent": task_data.get("parent", "host"),
            "project_name": task_data.get("project_name", None),
            "tile_name": task_data.get("tile_name", None),
        }

        self.mark_status(tile_id, "busy", **status_args)
        return

    def list_running_tile_tasks(self):
        return self.list_running_service_tasks()

    @staticmethod
    def list_docker_tile_containers():
        return get_tile_container_ids()

    def notify_user_tile_lost(self, tile_id, exp=None, reason=None):
        cont_info = self.get_container_dict(tile_id)
        content = f"<pre>Tile is no longer running.\n"
        if cont_info.get("project_name"):
            content += f"Project: {cont_info.get('project_name')}.\n"
        elif cont_info.get("parent"):
            content += f"Parent: {cont_info.get('parent')}.\n"
        if cont_info.get("tile_name"):
            content += f"Tile name: {cont_info.get('tile_name')}.\n"
        else:
            content += f"Tile ID: {tile_id}.\n"
        if exp is not None and exp.get("found"):
            content += f"Task info:\n"
            content += f"Status: {exp['lastStatus']}\n"
            content += f"Reason: {exp['stoppedReason']}\n"
            cont = exp["container"]
            if cont:
                content += f"Container info:\n"
                content += f"Status: {cont.get('lastStatus')}\n"
                content += f"Reason: {cont.get('reason')}\n"
        elif reason is not None:
            content += f"Reason: {reason}\n"
        content += "</pre>"
        self.worker.add_error_drawer_entry(
            title=f"Tile is no longer running",
            content=content,
            user_id=cont_info.get("owner")
        )

    def reconcile_tiles(self):
        log.debug("reconcile_tiles", category="tile_management")
        if self.worker.channel is None:
            log.warning("in reconcile_tiles, channel isn't ready yet")
            return
        if on_aws:
            tasks = self.list_running_tile_tasks()
            running_ids = [self.task_to_id(t) for t in tasks]
            log.debug("ecs running_ids", running_ids=running_ids)
            for t in tasks:
                tile_id = self.task_to_id(t)
                if not self.exists(tile_id):
                    log.info("new ecs tile discovered", tile_id=tile_id, category="tile_management")
                    self.mark_status(tile_id, "idle", **{
                        "task_arn": t["taskArn"],
                        "created": str(t["createdAt"])
                    })
        else:
            running_ids = self.list_docker_tile_containers()
            log.debug("docker running_ids", running_ids=running_ids, category="tile_management")
            for tile_id in running_ids:
                if not self.exists(tile_id):
                    log.info("new docker tile discovered", tile_id=tile_id, category="tile_management")
                    self.mark_status(tile_id, "idle")
        ids_to_delete = []
        tile_ids = self.container_ids()
        if "tile_test_container" in tile_ids:
            tile_ids.remove("tile_test_container")
        log.debug("all tile_ids from redis", tile_ids=tile_ids, category="tile_management")
        for tile_id in tile_ids:
            cont_info = self.get_container_dict(tile_id)
            if tile_id not in running_ids:
                log.info("found a tile that is no longer running", tile_id=tile_id, category="tile_management")
                if cont_info and cont_info["status"] == "busy":
                    if on_aws and cont_info.get("task_arn"):
                        exp = self.explain_stopped_task(cont_info.get("task_arn"))
                        self.notify_user_tile_lost(tile_id, exp=exp)
                    else:
                        self.notify_user_tile_lost(tile_id)
                ids_to_delete.append(tile_id)
                continue
            else:
                last_heartbeat_str = self.get_container_info(tile_id, "last_heartbeat")
                if last_heartbeat_str is None:
                    self.set_container_info(tile_id, "last_heartbeat", str(time.time()))
                    continue
                last_heartbeat = float(last_heartbeat_str)
                now = time.time()
                if (now - last_heartbeat) > TILE_HEARTBEAT_TIMEOUT_SECS:
                    log.info("found a tile that has timed out", tile_id=tile_id,
                             now=now, category="tile_management")
                    ids_to_delete.append(tile_id)
                    self.notify_user_tile_lost(tile_id, reason="Tile heartbeat timeout.")
                    self.worker.destroy_tile(tile_id, notify=False, force_terminate=True)

        log.debug("found ids_to_delete", ids_to_delete=ids_to_delete, category="tile_management")
        for tile_id in ids_to_delete:
            log.info("deleting tile", tile_id=tile_id, category="tile_management")
            self.delete(tile_id)
            self.worker.channel.queue_delete(tile_id)
            self.worker.channel.queue_delete(f"kill_{tile_id}")
        if not self.reconciled_tiles:
            log.info("*** did initial tile reconcile ***", category="tile_management")
            self.reconciled_tiles = True
