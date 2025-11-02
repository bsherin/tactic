
import redis
import json
import os

use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

print("getting redis client")

if use_ecs:
    from aws_helpers import get_sms_parameter
    REDIS_HOST = get_sms_parameter("REDIS_HOST")
    REDIS_PORT = get_sms_parameter("REDIS_PORT", 6379)
    REDIS_USERNAME = get_sms_parameter("REDIS_USERNAME")
    REDIS_PASSWORD = get_sms_parameter("REDIS_PASSWORD")

    MESSAGE_QUEUE = message_queue=f"rediss://{REDIS_USERNAME}:{REDIS_PASSWORD}@{REDIS_HOST}:6379/0"
else:
    REDIS_HOST = "tactic-redis"
    REDIS_PORT = 6379
    REDIS_USERNAME = None
    REDIS_PASSWORD = None
    MESSAGE_QUEUE = "redis://tactic-redis:6379/0"


redis_0 = redis.Redis(host=REDIS_HOST,
                      username=REDIS_USERNAME,
                      password=REDIS_PASSWORD,
                      port=REDIS_PORT, db=0, decode_responses=True)

redis_tm = redis.Redis(host=REDIS_HOST,
                       username=REDIS_USERNAME,
                       password=REDIS_PASSWORD,
                       port=REDIS_PORT, db=1, decode_responses=True)

redis_ht = redis.Redis(host=REDIS_HOST,
                       username=REDIS_USERNAME,
                       password=REDIS_PASSWORD,
                       port=REDIS_PORT, db=2, decode_responses=True)

redis_rb = redis.Redis(host=REDIS_HOST,
                       username=REDIS_USERNAME,
                       password=REDIS_PASSWORD,
                       port=REDIS_PORT, db=3, decode_responses=True)


# Ready block functions
def create_ready_block(rb_id, username, id_list, local_id=None):
    rb_set(username, rb_id, id_list, local_id)
    return


def delete_ready_block_participant(username, rb_key, participant):
    redis_rb.hset("{}.ready_blocks.{}".format(username, rb_key), participant, 0)
    the_keys = rb_keys(username, rb_key)
    remaining_keys = 0
    for k in the_keys:
        if not k == "local_id":
            v = rb_hget(username, rb_key, participant)
            remaining_keys += int(v)

    if remaining_keys == 0:
        local_id = rb_hget(username, rb_key, "local_id")
        rb_del(username, rb_key)
        return the_keys, local_id
    else:
        return False, None


def rb_del(username, rb_key):
    redis_rb.delete("{}.ready_blocks.{}".format(username, rb_key))
    return


def rb_set(username, rb_key, id_list, local_id="__none__"):
    for the_id in id_list:
        redis_rb.hset("{}.ready_blocks.{}".format(username, rb_key), the_id, 1)
    redis_rb.hset("{}.ready_blocks.{}".format(username, rb_key), "local_id", local_id)


def rb_hget(username, rb_key, participant):
    return redis_rb.hget("{}.ready_blocks.{}".format(username, rb_key), participant)


def rb_keys(username, rb_key):
    return redis_rb.hkeys("{}.ready_blocks.{}".format(username, rb_key))


# Tile manager functions
def hset(username, d, k, v):
    redis_tm.hset("{}.{}".format(username, d), k, v)


def hadd(username, d, k):
    redis_tm.hincrby("{}.{}".format(username, d), k)


def hdel(username, d, k):
    redis_tm.hdel("{}.{}".format(username, d), k)


def hexists(username, d):
    return redis_tm.exists("{}.{}".format(username, d))


def hget(username, d, k):
    return redis_tm.hget("{}.{}".format(username, d), k)


def hkeys(username, d):
    return redis_tm.hkeys("{}.{}".format(username, d))


def vset(username, k, v):
    redis_tm.set("{}.{}".format(username, k), v)
