
import redis
from docker_functions import get_address

redis_address = get_address("tactic-redis", "bridge")
print("getting redis client")
redis_client = redis.StrictRedis(host=redis_address,
                                 port=6379,
                                 charset="utf-8",
                                 decode_responses=True)


