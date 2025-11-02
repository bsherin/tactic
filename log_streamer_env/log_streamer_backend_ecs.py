import time
import threading
import os
import boto3
from botocore.exceptions import ClientError

import flask_socketio
from flask_socketio import SocketIO

from aws_helpers import get_sms_parameter
from redis_tools import MESSAGE_QUEUE

socketio = SocketIO(
    message_queue=MESSAGE_QUEUE,
    channel="socketio",
    logger=False,
    engineio_logger=False,
)

region = get_sms_parameter("MY_AWS_REGION")
cluster = get_sms_parameter("ECS_CLUSTER", "tactic-cluster")
account = get_sms_parameter("MY_AWS_ACCOUNT")

logs = boto3.client("logs", region_name="us-east-2")
ecs = boto3.client("ecs", region_name=region)


def id_from_arn(arn):
    return arn.rsplit("/", 1)[-1]


def arn_from_id(id):
    return f"arn:aws:ecs:{region}:{account}:task/{cluster}/{id}"


def resolve_log_stream_for_task(task_arn, container_name=None):
    """
    Returns (log_group_name, log_stream_name) for the task's container.
    If container_name is None and there is only one container, uses that.
    """
    d = ecs.describe_tasks(cluster=cluster, tasks=[task_arn])
    tasks = d.get("tasks", [])
    if not tasks:
        raise RuntimeError(f"No such task {task_arn}")

    task = tasks[0]
    # Find the right container
    containers = task.get("containers", [])
    if not containers:
        raise RuntimeError("Task has no containers listed yet.")

    if container_name:
        c = next((x for x in containers if x.get("name") == container_name), None)
        if not c:
            raise RuntimeError(f"Container {container_name} not found on task.")
    else:
        if len(containers) != 1:
            raise RuntimeError("Multiple containers on task; please pass container_name.")
        c = containers[0]

    # Get the log config from task definition (safer than guessing)
    # Need the task definition to read the container's log configuration
    td_arn = task["taskDefinitionArn"]
    td = ecs.describe_task_definition(taskDefinition=td_arn)["taskDefinition"]

    cd = next((x for x in td["containerDefinitions"] if x["name"] == c["name"]), None)
    if not cd:
        raise RuntimeError("Container definition not found for container on task def.")

    log_cfg = cd.get("logConfiguration", {})
    if log_cfg.get("logDriver") != "awslogs":
        raise RuntimeError("This container is not using awslogs.")

    opts = log_cfg.get("options", {})
    group = opts["awslogs-group"]
    prefix = opts.get("awslogs-stream-prefix", cd["name"])  # fallback

    # CloudWatch stream naming convention: <prefix>/<container-name>/<task-id>
    task_id = id_from_arn(task["taskArn"])
    stream = f"{prefix}/{cd['name']}/{task_id}"
    return group, stream

def get_container_log_ecs(cont_id, since=None):
    group, log_stream = resolve_log_stream_for_task(cont_id)
    events = []
    next_token = None
    while True:
        kwargs = {
            "logGroupName": group,
            "logStreamName": log_stream,
            "startFromHead": True,
        }
        if next_token:
            kwargs["nextToken"] = next_token
        resp = logs.get_log_events(**kwargs)
        events.extend(resp.get("events", []))
        nt = resp.get("nextForwardToken")
        if nt == next_token:  # reached end
            break
        next_token = nt

    # Print or return the combined log text
    text = "\n".join(e["message"].rstrip("\n") for e in events)
    return text

class ECSLogTailer:
    def __init__(self, room, task_id,
                 start_ms=None, poll=1.5, batch_size=200):
        self.task_arn = arn_from_id(task_id)
        self.task_id = task_id
        self.room = room
        self.start_ms = start_ms
        self.batch_size = batch_size
        self._stop = threading.Event()
        self._t = None
        self.poll_interval_sec = poll
        self.group = ""
        self.stream = ""

    def start(self):
        if self._t and self._t.is_alive():
            return
        self._t = threading.Thread(target=self._run, name=f"tail-{self.stream}", daemon=True)
        self._t.start()

    def stop(self, timeout=3):
        self._stop.set()
        if self._t:
            self._t.join(timeout=timeout)


    def send_fn(self, msg):
        if not msg.endswith("\n"):
            msg += "\n"
        base_data = {"message": "updateLog", "container_id": self.task_id, "new_line": msg}
        socketio.emit("searchable-console-message", base_data, namespace="/main", room=self.room)


    def _run(self, inactivity_timeout_sec=600):
        """
        Tails logs for one ECS task's container and streams each line via send_fn.
        Stops when (a) task stops and no new logs for a poll, or (b) inactivity timeout.
        """
        next_token = None
        last_seen_ts = 0
        self.group, self.stream = resolve_log_stream_for_task(self.task_arn)

        # Initial announcement (optional)
        self.send_fn(f"[log-tail] Following {self.group} :: {self.stream}")

        # Poll until we decide to stop
        while not self._stop.is_set():
            try:
                # Has the task stopped?
                d = ecs.describe_tasks(cluster=cluster, tasks=[self.task_arn])
                task = (d.get("tasks") or [None])[0]
                task_stopped = (task and task.get("lastStatus") == "STOPPED")

                # Pull log events
                kwargs = dict(logGroupName=self.group, logStreamName=self.stream, startFromHead=True)
                if next_token:
                    kwargs["nextToken"] = next_token

                try:
                    resp = logs.get_log_events(**kwargs)
                except ClientError as e:
                    code = e.response["Error"]["Code"]
                    if code in ("ResourceNotFoundException", "AccessDeniedException"):
                        self.send_fn(f"Log stream no longer accessible ({code}). Stopping.")
                        break
                    raise

                events = resp.get("events", [])
                next_token_new = resp.get("nextForwardToken")

                if events:
                    # Emit lines
                    for ev in events:
                        msg = ev.get("message", "")
                        ts = ev.get("timestamp", 0)
                        last_seen_ts = max(last_seen_ts, ts)
                        self.send_fn(msg)

                    next_token = next_token_new
                else:
                    # No new lines
                    if next_token_new != next_token:
                        # Token advanced but no events (rare) — still update token and keep going
                        next_token = next_token_new
                    else:
                        # Truly quiet
                        if task_stopped:
                            # Give it one last drain attempt (in case of slight lag)
                            time.sleep(self.poll_interval_sec)
                            try:
                                resp2 = logs.get_log_events(logGroupName=self.group, logStreamName=self.stream,
                                                            startFromHead=True, nextToken=next_token)
                                if resp2.get("events"):
                                    for ev in resp2["events"]:
                                        msg = ev.get("message", "")
                                        self.send_fn(msg)
                                    next_token = resp2.get("nextForwardToken", next_token)
                                    continue
                            except Exception:
                                pass
                            self.send_fn("Task has STOPPED and no new logs; ending stream.")
                            break

                        # Inactivity watchdog
                        quiet_for = time.time() * 1000 - last_seen_ts
                        if quiet_for >= inactivity_timeout_sec * 1000:
                            self.send_fn(f"No new logs for {inactivity_timeout_sec}s; ending stream.")
                            break

                time.sleep(self.poll_interval_sec)

            except ClientError as e:
                code = e.response["Error"]["Code"]
                if code in ("ThrottlingException", "Throttling", "RateExceededException"):
                    time.sleep(1.5)
                    continue
                self.send_fn(f"Stopping due to AWS error: {code}")
                break
            except Exception as e:
                self.send_fn(f"Stopping due to error: {e.__class__.__name__}: {e}")
                break
