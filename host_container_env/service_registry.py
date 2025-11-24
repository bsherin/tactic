import os

use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

if use_ecs:
    import boto3
    from botocore.exceptions import ParamValidationError
    from aws_helpers import get_ssm_parameter
    AWS_REGION = get_ssm_parameter("MY_AWS_REGION", "us-east-2")
    ECS_CLUSTER = get_ssm_parameter("ECS_CLUSTER", "tactic-cluster")
    ecs = boto3.client("ecs", region_name=AWS_REGION)

class ServiceRegistry:
    def __init__(self, worker, id_prefix="", service_name=""):
        self.id_prefix = id_prefix
        self._registry = {}
        self.worker = worker
        self.service_name = service_name
        self.removed_obsolete_queues = False

    @staticmethod
    def task_to_id(task):
        return f'{self.id_prefix}{task["taskArn"].split("/")[-1]}'

    @staticmethod
    def list_running_service_tasks():
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

    def remove_obsolete_queues(self, extra_valid_ids=None):
        if not use_ecs:
            self.removed_obsolete_queues = True
            return
        if self.host_worker.channel is None:
            print("in remove_obsolete_queues, channel isn't ready yet")
            return
        print("removing obsolete queues")

        tasks = self.list_running_service_tasks()
        if not tasks:
            return
        running_ids = [self.task_to_id(t) for t in tasks]
        if extra_valid_ids:
            running_ids += extra_valid_ids
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

    def registry_heartbeat(self):
        if use_ecs:
            if not self.removed_obsolete_queues:
                self.remove_obsolete_queues()