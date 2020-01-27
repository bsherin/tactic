
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