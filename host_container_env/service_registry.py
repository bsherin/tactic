import os
import re
import time
from rabbit_admin import list_queues, delete_queue
from redis_tools import RedisManager, redis_client
from aws_helpers import get_ssm_parameter
from aws_detection import on_aws

if on_aws:
    import boto3
    from botocore.exceptions import ParamValidationError
    from aws_helpers import get_ssm_parameter
    AWS_REGION = get_ssm_parameter("MY_AWS_REGION", "us-east-2")
    ECS_CLUSTER = get_ssm_parameter("ECS_CLUSTER", "tactic-cluster")
    ecs = boto3.client("ecs", region_name=AWS_REGION)

class ServiceRegistry(RedisManager):
    id_prefix = ""
    prefix = ""
    service_name = ""
    extra_valid_ids = None

    def __init__(self, worker):
        super().__init__(redis_client)
        self.worker = worker
        self.removed_obsolete_queues = False

    def expand_key(self, cont_id, narrower=None):
        return f"service.{self.service_name}.{cont_id}"

    def delete_all(self):
        # non-blocking deletion per key, works across slots
        pattern = f"service.{self.service_name}.*"
        for k in self.cli.scan_iter(match=pattern, count=5000):
            try:
                self.cli.unlink(k)  # fall back to delete if older Redis
            except Exception:
                self.cli.delete(k)

    def task_to_id(self, task):
        return f'{self.id_prefix}{task["taskArn"].split("/")[-1]}'

    @staticmethod
    def is_task_running(task_arn) -> bool:
        if task_arn is None:
            return False
        resp = ecs.describe_tasks(
            cluster=ECS_CLUSTER,
            tasks=[task_arn],
        )

        tasks = resp.get("tasks", [])
        if not tasks:
            # Task ARN not found (expired / aged out)
            return False

        task = tasks[0]
        return task["lastStatus"] == "RUNNING"

    @staticmethod
    def explain_stopped_task(task_arn):
        resp = ecs.describe_tasks(
            cluster=ECS_CLUSTER,
            tasks=[task_arn],
        )

        tasks = resp.get("tasks", [])
        if not tasks:
            return {"found": False}

        t = resp["tasks"][0]

        out = {
            "found": True,
            "taskArn": t.get("taskArn"),
            "lastStatus": t.get("lastStatus"),
            "desiredStatus": t.get("desiredStatus"),
            "stoppedReason": t.get("stoppedReason"),
            "stopCode": t.get("stopCode"),
            "container": None,
        }
        containers = task.get("containers", [])
        if len(containers) > 0:
            c = containers[0]
            out["container"] = {
                "name": c.get("name"),
                "lastStatus": c.get("lastStatus"),
                "exitCode": c.get("exitCode"),
                "reason": c.get("reason")
            }
        return out

    def list_running_service_tasks(self):
        arns = []
        try:
            paginator = ecs.get_paginator("list_tasks")
            for page in paginator.paginate(
                    cluster=ECS_CLUSTER,
                    serviceName=self.service_name,
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

    def set_container_dict(self, cont_id, container_info):
        self.set_hash_dict(cont_id, container_info)

    def set_container_info(self, cont_id, hash_key, value):
        print(f"Setting container info: {cont_id} [{hash_key}] = {value}")
        self.set_hash_entry(cont_id, hash_key, value)

    def set_container_info_from_dict(self, cont_id, info_dict):
        for k, v in info_dict.items():
            if v is None:
                self.delete_hash_entry(cont_id, k)
            else:
                self.set_container_info(cont_id, k, v)

    def container_ids(self):
        return self.scan_keys(f"service.{self.service_name}.*", tail_only=True)

    def get_container_info(self, cont_id, hash_key):
        return self.get_hash_entry(cont_id, hash_key)

    def get_container_dict(self, cont_id):
        return self.get_hash_dict(cont_id)

    def get(self, tile_id):
        return self.get_container_dict(tile_id)

    def get_arn(self, tile_id):
        return self.get_container_info(tile_id, "task_arn")

    def get_items(self):
        container_ids = self.container_ids()
        citems = [(cont_id, self.get_container_dict(cont_id)) for cont_id in container_ids]
        return citems

    def register_interaction(self, cont_id):
        self.set_container_info(cont_it, "last_interaction", str(time.time()))

    def register_container_heartbeat(self, cont_id):
        self.set_container_info(cont_id, "last_heartbeat", str(time.time()))

    def remove_obsolete_queues(self):
        if not on_aws:
            self.removed_obsolete_queues = True
            return
        if self.worker.channel is None:
            print("in remove_obsolete_queues, channel isn't ready yet")
            return

        tasks = self.list_running_service_tasks()
        if not tasks:
            print("no running service tasks found")
            return
        running_ids = [self.task_to_id(t) for t in tasks]
        if self.extra_valid_ids:
            running_ids += self.extra_valid_ids
        all_queues = list_queues()
        for q in all_queues:
            qname = q["name"]
            if qname.startswith(self.id_prefix):
                if qname not in running_ids:
                    print("removing queue %s" % qname)
                    delete_queue(qname)
            if qname.startswith(f"kill_{self.id_prefix}"):
                partial_qname = re.sub("kill_", "", qname)
                if partial_qname not in running_ids:
                    delete_queue(qname)
        self.removed_obsolete_queues = True

    def registry_heartbeat(self):
        if on_aws:
            if not self.removed_obsolete_queues:
                self.remove_obsolete_queues()