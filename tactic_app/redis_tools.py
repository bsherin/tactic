
import redis

# redis_address = get_address("tactic-redis", "bridge")
print("getting redis client")
redis_tm = redis.StrictRedis(host="tactic-redis",
                             port=6379,
                             charset="utf-8",
                             db=1,
                             decode_responses=True)

redis_ht = redis.StrictRedis(host="tactic-redis",
                             port=6379,
                             charset="utf-8",
                             db=2,
                             decode_responses=True)


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

