
import redis

# redis_address = get_address("tactic-redis", "bridge")
print("getting redis client")
redis_client = redis.StrictRedis(host="tactic-redis",
                                 port=6379,
                                 charset="utf-8",
                                 decode_responses=True)

print("setting in redis")
redis_client.set("foo", "bar")

print("getting from redis")
redis_client.get("foo")


def hset(username, d, k, v):
    redis_client.hset("tile_manager.{}.{}".format(username, d), k, v)


def hadd(username, d, k):
    redis_client.hincrby("tile_manager.{}.{}".format(username, d), k)


def hdel(username, d, k):
    redis_client.hdel("tile_manager.{}.{}".format(username, d), k)


def hexists(username, d):
    return redis_client.exists("tile_manager.{}.{}".format(username, d))


def hget(username, d, k):
    return redis_client.hget("tile_manager.{}.{}".format(username, d), k)


def hkeys(username, d):
    return redis_client.hkeys("tile_manager.{}.{}".format(username, d))


def vset(username, k, v):
    redis_client.set("tile_manager.{}.{}".format(username, k), v)

