import os
use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

ECS_CLUSTER   = os.getenv("ECS_CLUSTER", "tactic-cluster")
TILE_SERVICE  = os.getenv("ECS_TILE_SERVICE", "tactic-tile-pool")
AWS_REGION    = os.getenv("AWS_REGION", "us-east-2")

if use_ecs:
    import boto3
    ecs = boto3.client("ecs", region_name=os.getenv("AWS_REGION","us-east-2"))
    CLUSTER = os.getenv("ECS_CLUSTER","tactic-cluster")
    CW = boto3.client("cloudwatch", region_name=os.getenv("AWS_REGION", "us-east-2"))
    NS = "Tactic"
    SVC = "tactic-tile-pool"
    DESIRED_IDLE = int(os.getenv("TILE_IDLE_BUFFER","3"))

class TileContainerRegistry:
    def __init__(self):
        print("** initializing tile registery ***")
        self._registry = {}
        self.reconcile_tiles()

    def publish_metrics(self):
        if use_ecs:
            print(" *** publishing metrics to cloudwatch with idle_tiles:", self.idle_tiles, "running_tiles:", self.running_tiles)
            idle_deficit = max(0, DESIRED_IDLE - self.idle_tiles)
            CW.put_metric_data(
                Namespace=NS,
                MetricData=[
                    {"MetricName": "IdleTiles", "Dimensions": [{"Name": "ServiceName", "Value": SVC}],
                     "Unit": "Count", "Value": self.idle_tiles},
                    {"MetricName": "RunningTiles", "Dimensions": [{"Name": "ServiceName", "Value": SVC}],
                     "Unit": "Count", "Value": self.running_tiles},
                    {"MetricName": "IdleDeficit", "Dimensions": [{"Name": "ServiceName", "Value": SVC}],
                     "Unit": "Count", "Value": idle_deficit},
                ]
            )
        else:
            print(f"Metrics publishing is disabled in non-ECS mode. {self.idle_tiles} idle tiles, {self.running_tiles} running tiles.")

    def mark_status(self, tile_id, status, task_arn=None, username=None, owner=None, parent=None):
        print("entering mark_status with tile_id:", tile_id, "status:", status, "task_arn:", task_arn, "username:", username, "owner:", owner, "parent:", parent)
        if tile_id not in self._registry:
            self._registry[tile_id] = {"status": "idle"}
        self._registry[tile_id]["status"] = status
        if username is not None:
            self._registry[tile_id]["username"] = username
        if owner is not None:
            self._registry[tile_id]["owner"] = owner
        if parent is not None:
            self._registry[tile_id]["parent"] = parent
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
        return self._registry.get(tile_id, {}).get("task_arn")

    def deregister(self, tile_id):
        if tile_id in self._registry:
            del self._registry[tile_id]

    def set_task_protection(self, tile_id):
        if self._registry[tile_id]["task_arn"]:
            ecs.update_task_protection(
                cluster=CLUSTER,
                tasks=[self._registry[tile_id]["task_arn"]],
                protectionEnabled=self._registry[tile_id]["status"] == "busy"
            )

    def claim_tile(self, username, owner, parent):
        for tile_id, status in self._registry.items():
            if status == "idle":
                self._registry[tile_id]["username"] = username
                self._registry[tile_id]["owner"] = owner # This is the user_id
                self._registry[tile_id]["parent"] = parent
                self.mark_status(tile_id, "busy")
                return tile_id, self._registry[tile_id]["task_arn"]
        return None, None

    def get_number_of_idle_tiles(self):
        return sum(1 for status in self._registry.values() if status == "idle")

    def get_number_of_busy_tiles(self):
        return sum(1 for status in self._registry.values() if status == "busy")

    def get_status_summary(self):
        idle = self.get_number_of_idle_tiles()
        busy = self.get_number_of_busy_tiles()
        return {
            "idle": idle,
            "busy": busy,
            "total": idle + busy
        }

    def task_to_tile_id(self, task):
        # Make tile_id == ECS task ID (last token of ARN)
        return task["taskArn"].split("/")[-1]

    def list_running_tile_tasks(self):
        arns = []
        next_token = None
        while True:
            resp = ecs.list_tasks(cluster=ECS_CLUSTER,
                                  serviceName=TILE_SERVICE,
                                  desiredStatus="RUNNING",
                                  nextToken=next_token)
            arns.extend(resp.get("taskArns", []))
            next_token = resp.get("nextToken")
            if not next_token:
                break
        if not arns:
            return []

        # Describe in batches
        tasks = []
        for i in range(0, len(arns), 100):
            d = ecs.describe_tasks(cluster=ECS_CLUSTER, tasks=arns[i:i + 100])
            tasks.extend(d.get("tasks", []))
        return tasks

    def reconcile_tiles(self):
        if not use_ecs:
            return
        print("doing tile reconciliation")
        tasks = list_running_tile_tasks()
        if not tasks:
            return
        print("found running tiles:", len(tasks))
        conn, ch = mq_channel()
        try:
            for t in tasks:
                tile_id = task_to_tile_id(t)
                if tile_id not in self._registry:
                    self.mark_status(tile_id, "idle", task_arn=t["taskArn"])
        finally:
            try:
                conn.close()
            except Exception:
                pass