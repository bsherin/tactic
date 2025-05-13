
import redis

print("getting redis client")
print("*** Using updated Redis config2 ***")
redis_tm = redis.StrictRedis(host="tactic-redis",
                             port=6379,
                             db=1,
                             decode_responses=True)

redis_ht = redis.StrictRedis(host="tactic-redis",
                             port=6379,
                             db=2,
                             decode_responses=True)

redis_rb = redis.StrictRedis(host="tactic-redis",
                             port=6379,
                             db=3,
                             decode_responses=True)


# Ready block functions
def create_ready_block(rb_id, username, id_list, main_id=None):
    rb_set(username, rb_id, id_list, main_id)
    return


def delete_ready_block_participant(username, rb_key, participant):
    redis_rb.hset("{}.ready_blocks.{}".format(username, rb_key), participant, 0)
    the_keys = rb_keys(username, rb_key)
    remaining_keys = 0
    for k in the_keys:
        if not k == "main_id":
            v = rb_hget(username, rb_key, participant)
            remaining_keys += int(v)

    if remaining_keys == 0:
        main_id = rb_hget(username, rb_key, "main_id")
        rb_del(username, rb_key)
        return the_keys, main_id
    else:
        return False, None


def rb_del(username, rb_key):
    redis_rb.delete("{}.ready_blocks.{}".format(username, rb_key))
    return


def rb_set(username, rb_key, id_list, main_id="__none__"):
    for the_id in id_list:
        redis_rb.hset("{}.ready_blocks.{}".format(username, rb_key), the_id, 1)
    redis_rb.hset("{}.ready_blocks.{}".format(username, rb_key), "main_id", main_id)


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
