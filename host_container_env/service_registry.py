import os
import re
from rabbit_admin import list_queues, delete_queue

use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

if use_ecs:
    import boto3
    from botocore.exceptions import ParamValidationError
    from aws_helpers import get_ssm_parameter
    AWS_REGION = get_ssm_parameter("MY_AWS_REGION", "us-east-2")
    ECS_CLUSTER = get_ssm_parameter("ECS_CLUSTER", "tactic-cluster")
    ecs = boto3.client("ecs", region_name=AWS_REGION)

class ServiceRegistry:
    def __init__(self, worker, id_prefix="", service_name="", extra_valid_ids=None):
        self.id_prefix = id_prefix
        self._registry = {}
        self.worker = worker
        self.service_name = service_name
        self.extra_valid_ids = extra_valid_ids
        self.removed_obsolete_queues = False

    def task_to_id(self, task):
        return f'{self.id_prefix}{task["taskArn"].split("/")[-1]}'

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

    def remove_obsolete_queues(self):
        print("got extra_valid_ids: {}".format(self.extra_valid_ids))
        if not use_ecs:
            self.removed_obsolete_queues = True
            return
        if self.worker.channel is None:
            print("in remove_obsolete_queues, channel isn't ready yet")
            return
        print("removing obsolete queues")

        tasks = self.list_running_service_tasks()
        if not tasks:
            print("no running service tasks found")
            return
        print(f"found {len(tasks)} running service tasks")
        running_ids = [self.task_to_id(t) for t in tasks]
        if self.extra_valid_ids:
            running_ids += self.extra_valid_ids
        print("running ids:", running_ids)
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
        if use_ecs:
            if not self.removed_obsolete_queues:
                self.remove_obsolete_queues()