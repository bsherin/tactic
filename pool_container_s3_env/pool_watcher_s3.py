from tactic_logging import log, setup_logging, bind_request

setup_logging("pool_watcher_s3")
log.info("starting", extra_flag=True)

try:
    import json, collections
    import boto3
    import pika
    import traceback
    from urllib.parse import unquote_plus

    from rabbit_manage import get_pika_connection_with_retries
    from aws_helpers import get_ssm_parameter
    from aws_detection import on_aws

    S3_BUCKET = get_ssm_parameter("BUCKET")
    SQS_QUEUE_URL = get_ssm_parameter("SQS_QUEUE_URL")
    AWS_REGION = get_ssm_parameter("MY_AWS_REGION", "us-east-2")

    RECENT = collections.deque(maxlen=5000)
    SEEN  = {}

    def is_dir_key(key: str) -> bool:
        return key.endswith('/')
except Exception:
    log.exception("*** fatal error during imports in pool_watcher_s3 ***")
    log.critical("*** exiting pool_watcher_s3 due to fatal error ***")
    raise

class Handler:
    def __init__(self):
        self.my_id = "pool_watcher"
        log.info("my_id", self.my_id)
        self.connection, self.channel = get_pika_connection_with_retries(0)
        log.info("connected to RabbitMQ")
        if on_aws:
            self.sqs = boto3.client("sqs", region_name=AWS_REGION)
        else:
            self.sqs = boto3.client(
                "sqs",
                endpoint_url="http://host.docker.internal:4566",
                aws_access_key_id="test",
                aws_secret_access_key="test",
                region_name=AWS_REGION,
            )
        log.info("connected to SQS", region_name=self.sqs.meta.region_name)

    def post_pool_event(self, event_type, key, is_dir, dest_key=None):
        self.ask_host("pool_event", {
            "event_type": event_type,
            "is_directory": is_dir,
            "path": f"s3://{S3_BUCKET}/{key}",
            "dest_path": f"s3://{S3_BUCKET}/{dest_key}" if dest_key else None
        })

    def ask_host(self, msg_type, task_data=None):
        self.post_task("host", msg_type, task_data)
        return

    def post_task(self, dest_id, task_type, task_data=None, expiration=None):
        new_id = new_task_id()
        with bind_request(new_id, "presend", task_type):
            try:
                callback_id = None
                reply_to = None
                callback_type = "no_callback"
                new_packet = {"source": self.my_id,
                              "task_id": new_id,
                              "status": "presend",
                              "callback_type": callback_type,
                              "dest": dest_id,
                              "task_type": task_type,
                              "task_data": task_data,
                              "callback_id": callback_id,
                              "response_data": None,
                              "reply_to": reply_to,
                              "expiration": expiration}
                self.post_packet(dest_id, new_packet, reply_to, callback_id)
                result = {"success": True}

            except Exception as ex:
                log.exception("Error handling task", task_type=task_type, my_id=self.my_id)
                special_string = "Error handling task for task type {} for my_id {}".format(task_type, self.my_id)
                error_string = self.get_traceback_message(ex, special_string)
                result = {"success": False, "message": error_string}
            return result

    @staticmethod
    def get_traceback_message(e, special_string=None):
        if special_string is None:
            template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}\n"
        else:
            template = special_string + "<pre>\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
        error_string = template.format(type(e).__name__, e.args)
        error_string += traceback.format_exc() + "</pre>"
        return error_string

    def post_packet(self, dest_id, task_packet, reply_to=None, callback_id=None, attempt=0):
        try:
            self.channel.basic_publish(exchange='',
                                      routing_key=dest_id,
                                      properties=pika.BasicProperties(
                                          reply_to=reply_to,
                                          correlation_id=callback_id,
                                          delivery_mode=2
                                      ),
                                      body=json.dumps(task_packet))
        except Exception:
            if attempt == 0:
                log.exception("Error posting packet, retrying", dest_id=dest_id, my_id=self.my_id)
                connection, channel = get_pika_connection_with_retries(0)
                if connection is not None:
                    self.channel = channel
                    self.post_packet(dest_id, task_packet,
                                     reply_to, callback_id, attempt=1)
            else:
                log.exception("Error posting packet, giving up", dest_id=dest_id, my_id=self.my_id)
        return

    def main(self):
        while True:
            task_id = new_task_id()
            with bind_quest(task_id, "ad_hoc", "sqs_poll"):
                resp = self.sqs.receive_message(
                    QueueUrl=SQS_QUEUE_URL,
                    MaxNumberOfMessages=10,
                    WaitTimeSeconds=20,
                    MessageAttributeNames=['All']
                )
                msgs = resp.get("Messages", [])
                if not msgs:
                    continue

                for m in msgs:
                    try:
                        log.info("Processing SQS message:", message_id=m["MessageId"])
                        body = json.loads(m["Body"])
                        recs = body.get("Records", [])
                        for r in recs:
                            ev = r["eventName"]                 # e.g. "ObjectCreated:Put", "ObjectRemoved:Delete"
                            log.info("Got eventName", event_name=ev)
                            b  = r["s3"]["bucket"]["name"]
                            k  = unquote_plus(r["s3"]["object"]["key"])
                            etag = r["s3"]["object"].get("eTag")

                            # basic de-dupe (S3 can retry)
                            sig = (ev, k, etag, r.get("eventTime"))
                            if sig in SEEN:
                                continue
                            SEEN[sig] = True
                            RECENT.append(sig)

                            if ev.startswith("ObjectCreated:"):
                                self.post_pool_event("modify", k, is_dir_key(k))

                            elif ev.startswith("ObjectRemoved:"):
                                self.post_pool_event("delete", k, is_dir_key(k))

                            # Optional: move synthesis logic could be added here if you want to correlate
                            # a recent copy+delete with same ETag and infer (src->dest).

                        # success: delete from queue
                        self.sqs.delete_message(QueueUrl=SQS_QUEUE_URL, ReceiptHandle=m["ReceiptHandle"])

                    except Exception:
                        log.exception("Error processing SQS message")
                        pass

if __name__ == "__main__":
    handler = Handler()
    handler.main()